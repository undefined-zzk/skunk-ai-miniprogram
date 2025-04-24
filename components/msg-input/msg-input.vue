<script setup>
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/store/modules/message';
import { getCurrentInstance } from 'vue';
import { nanoid } from 'nanoid/non-secure';
import { request } from '@/utils/request';
import { storageClearIfNeeded } from '@/utils/storage';
const messageStore = useMessageStore();
const { currentMsgIsEmpty, currentMsgList, currentKey, currentMsgLength, everyMaxLen } = storeToRefs(messageStore);
const { disabled } = defineProps({
	disabled: {
		type: Boolean,
		defalut: false
	}
});
const { proxy } = getCurrentInstance();
const question = ref('');
const tempQuestion = ref('');
const inputRef = ref();
const autoHeight = ref(false);
const deepthink = ref(false);
const requestLoading = ref(false); // 请求loading
const processLoading = ref(false); // 内容生成loading
const role = ref('user');
const createWorkerIng = ref(false);
const modelTypes = ref({
	chat: 'deepseek-chat',
	reasoner: 'deepseek-reasoner'
});
let worker = null;
// 创建新的线程
const createNewWorker = () => {
	killWorker();
	wx.preDownloadSubpackage({
		packageType: 'workers',
		success(res) {
			worker = wx.createWorker('/static/workers/index.js', {
				useExperimentalWorker: true
			});
			worker.onProcessKilled(() => {
				createNewWorker();
			});
			sendMsg();
			createNewWorker.value = false;
		},
		fail(res) {
			createNewWorker.value = false;
			proxy.$toast.showErrorToast('Worker加载失败');
		}
	});
};
const disabledBtn = computed(() => {
	return (question.value.length <= 0 && !requestLoading.value && !processLoading.value) || disabled;
});

const cacheMsgData = () => {
	messageStore.setCacheMsgObj(currentKey.value, currentMsgList.value);
};
let abortTaskFn = null;

// 消息发送前校验
function validSendBefore() {
	if (requestLoading.value || processLoading.value || !question.value) return;
	if (currentMsgLength.value >= everyMaxLen.value) return proxy.$toast.showToast('此对话已达限制，请新建对话');
	// 正在读取worker
	if (createWorkerIng.value) return;
	createNewWorker();
}

// 发送消息
async function sendMsg() {
	const { currentItem, messages } = requestParams();
	try {
		requestLoading.value = true;
		const { data: stream, requestTask } = await request('/chat/completions', 'POST', {
			messages,
			model: deepthink.value ? modelTypes.value['reasoner'] : modelTypes.value['chat'],
			stream: true
		});
		abortTaskFn = requestTask;
		requestLoading.value = false;
		processLoading.value = true;
		const decoder = new TextDecoder();
		let buffer = '';
		worker.postMessage({
			stream,
			deepthink: deepthink.value
		});
		worker.onMessage((e) => {
			if (e.chunk !== '[DONE]' && abortTaskFn) {
				buffer += e.chunk;
				currentItem.answer = buffer;
				return;
			}
			currentItem.loading = false;
			processLoading.value = false;
			abortTaskFn = null;
			killRequest();
		});
	} catch (err) {
		console.log(err);
		if (err.errMsg.indexOf('timeout') != -1) {
			currentItem.answer = err.errMsg || '服务繁忙，请稍后再试';
		}
		killRequest();
		processLoading.value = false;
	} finally {
		requestLoading.value = false;
	}
}

// 请求参数
function requestParams() {
	const messageId = nanoid();
	const msgItem = {
		role: role.value,
		question: question.value || tempQuestion.value,
		id: messageId,
		answer: '',
		lzstring: false,
		loading: true,
		copySuccess: false,
		createtime: Date.now()
	};
	currentMsgList.value = [...currentMsgList.value, msgItem];
	cacheMsgData();
	question.value = '';
	// 发起请求
	const list = currentMsgList.value.map((item) => ({ role: item.role, question: item.question, answer: item.answer }));
	const messages = [];
	list.forEach((item) => {
		const user = {
			role: item.role,
			content: item.question
		};
		const assistant = {
			role: 'assistant',
			content: item.answer || ''
		};
		messages.push(user, assistant);
	});
	// 确保最后一个是user
	messages.splice(messages.length - 1, 1);
	const currentItem = currentMsgList.value.find((item) => item.id === messageId);
	return {
		messages,
		currentItem
	};
}

// 当前对话所有loading=false
function initMsgList() {
	const currentItem = currentMsgList.value.find((item) => item.loading);
	if (currentItem) {
		currentItem.loading = false;
	}
	cacheMsgData();
}

function killWorker() {
	if (worker) worker.terminate();
}

// 终止请求
function killRequest() {
	if (abortTaskFn) {
		abortTaskFn.abort();
		abortTaskFn = null;
		proxy.$toast.showToast('会话已终止');
	}
	initMsgList();
	killWorker();
}
onLoad(() => {
	storageClearIfNeeded();
});
</script>
<template>
	<view class="msg-input">
		<uni-easyinput
			ref="inputRef"
			type="textarea"
			:disabled="disabled"
			placeholderStyle="fontSize:24rpx"
			:maxlength="50000"
			:adjust-position="false"
			:clearSize="0"
			:autoHeight="autoHeight"
			:inputBorder="false"
			disableColor="#f3f4f6"
			trim
			:styles="{
				backgroundColor: '#f3f4f6'
			}"
			v-model="question"
			placeholder="给 SkunkAI 发送消息"
		></uni-easyinput>
		<view class="tool">
			<view class="left">
				<view class="icon" :class="{ active: deepthink }" @click.stop="deepthink = !deepthink">
					<image src="/common/icons/deepthink-active.svg" v-if="deepthink" mode=""></image>
					<image src="/common/icons/deepthink.svg" mode="" v-else></image>
					<text>深度思考 (R1)</text>
				</view>
			</view>
			<view class="right">
				<view class="icon2" :class="{ disabled: disabledBtn }">
					<image v-if="!requestLoading && !processLoading" @click.stop="validSendBefore" src="/common/icons/send.svg" mode=""></image>
					<image v-if="requestLoading" class="loading" src="/common/icons/loading-white.svg" mode=""></image>
					<image v-if="!requestLoading && processLoading" @click.stop="killRequest" src="/common/icons/stop.svg" mode=""></image>
				</view>
			</view>
		</view>
	</view>
	<view class="statement" v-if="!currentMsgIsEmpty">内容由AI生成,仅供参考</view>
</template>

<style lang="scss" scoped>
.msg-input {
	width: 90%;
	padding: 20rpx;
	margin: auto;
	background-color: #f3f4f6;
	border: 1rpx solid #f3f3f3;
	border-radius: 10rpx;
	overflow: hidden;
	.tool {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		.left,
		.right {
			.icon {
				display: flex;
				align-items: center;
				gap: 10rpx;
				padding: 10rpx;
				border-radius: 100rpx;
				background-color: #fff;
				border: 2rpx solid #f3f3f3;
				font-size: 24rpx;
				color: #bfbfbf;
				&.active {
					background-color: rgba($primary-color, 25%);
					border-color: $primary-color;
					text {
						color: $primary-color;
					}
				}
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		.right {
			.icon2 {
				background-color: $primary-color;
				width: 50rpx;
				height: 50rpx;
				border-radius: 18rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				&.disabled {
					opacity: 0.3;
				}
				image {
					width: 30rpx;
					height: 30rpx;
				}
				.loading {
					animation: loading 1s linear infinite;
				}
			}
		}
	}
}
.statement {
	font-size: 24rpx;
	color: #bfbfbf;
	text-align: center;
	margin-top: 10rpx;
}
@keyframes loading {
	100% {
		transform: rotate(360deg);
	}
}
</style>
