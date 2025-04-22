<script setup>
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/store/modules/message';
import { getCurrentInstance } from 'vue';
import { nanoid } from 'nanoid/non-secure';
import { request } from '@/utils/request';
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
const role = ref('user');
const modelTypes = ref({
	chat: 'deepseek-chat',
	reasoner: 'deepseek-reasoner'
});

const disabledBtn = computed(() => {
	return question.value.length <= 0 || disabled;
});

const cacheMsgData = () => {
	messageStore.setCacheMsgObj(currentKey.value, currentMsgList.value);
};

// 发送消息
const sendMsg = async () => {
	let currentItem = null;
	if (currentMsgLength.value >= everyMaxLen.value) return proxy.$toast.showToast('此对话已达限制，请新建对话');
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
	currentItem = currentMsgList.value.find((item) => item.id === messageId);
	try {
		const { data: stream, requestTask } = await request('/chat/completions', 'POST', {
			messages,
			model: deepthink.value ? modelTypes.value['reasoner'] : modelTypes.value['chat'],
			stream: true
		});
		console.log('requestTask', requestTask);
		const decoder = new TextDecoder();
		let buffer = '';
		for await (const chunk of stream) {
			buffer += typeof chunk === 'string' ? chunk : decoder.decode(chunk);
			const events = buffer.split('\n\n');
			buffer = events.pop() || '';
			for (const event of events) {
				let chunkContent;
				const match = event.match(/^data: (.*)/);
				if (match && match[1] !== '[DONE]') {
					try {
						const chunk = JSON.parse(match[1]);
						if (deepthink.value) {
							const reasonContent = chunk.choices[0].delta.reasoning_content || '';
							if (reasonContent) {
								chunkContent = reasonContent;
							} else {
								chunkContent = chunk.choices[0]?.delta?.content || '';
							}
						} else {
							chunkContent = chunk.choices[0]?.delta?.content || '';
						}
						if (chunkContent) {
							currentItem.loading = false;
							currentItem.answer += chunkContent;
						}
					} catch (e) {
						console.error('JSON parse error:', e);
					}
				} else {
				}
			}
		}
	} catch (err) {
		console.log('err', err);
	} finally {
		cacheMsgData();
	}
};
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
				<view class="icon2" @click.stop="sendMsg" :class="{ disabled: disabledBtn }">
					<image v-if="true" src="/common/icons/send.svg" mode=""></image>
					<image v-else-if="false" class="loading" src="/common/icons/loading-white.svg" mode=""></image>
				</view>
			</view>
		</view>
	</view>
	<view class="statement" v-if="!currentMsgIsEmpty">内容由AI生成,仅供参考1</view>
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
