<script setup>
	import {
		storeToRefs
	} from 'pinia';
	import {
		useMessageStore
	} from '@/store/modules/message';
	import {
		getCurrentInstance
	} from 'vue';
	import {
		nanoid
	} from 'nanoid/non-secure';
	import {
		request
	} from '@/utils/request';
	import {
		storageClearIfNeeded
	} from '@/utils/storage';
	import {
		useAsideStore
	} from '@/store/modules/aside';
	import {
		timeDiffNowDay
	} from '@/utils/time';
	import {
		config
	} from '@/static/config';
	import {
		showErrorToast,
		showSuccessToast
	} from '@/utils/toast';
	const messageStore = useMessageStore();
	const asideStore = useAsideStore();
	const {
		asideChange
	} = storeToRefs(asideStore);
	const {
		currentMsgIsEmpty,
		currentMsgList,
		currentKey,
		currentMsgLength,
		everyMaxLen,
		processLoading,
		startRender,
		refreshCreate,
		editMsg
	} = storeToRefs(messageStore);
	const {
		proxy
	} = getCurrentInstance();
	const question = ref('');
	const tempQuestion = ref('');
	const inputRef = ref();
	const autoHeight = ref(true);
	const deepthink = ref(false);
	const requestLoading = ref(false); // 请求loading
	const role = ref('user');
	const createWorkerIng = ref(false);
	const keyboardHeight = ref(0); // 键盘高度
	const modelTypes = ref({
		chat: 'deepseek-chat',
		reasoner: 'deepseek-reasoner'
	});
	let worker = null;
	watch(currentKey, () => {
		deepthink.value = false;
		killRequest();
	});

	// 会话重新生成
	watch(editMsg, (newVal) => {
		const {
			index,
			newQuestion
		} = newVal;
		killRequest();
		question.value = '';
		tempQuestion.value = newQuestion;
		refreshCreate.value = true;
		currentMsgList.value.splice(index);
		validSendBefore();
	});

	// 创建新的线程
	const createNewWorker = () => {
		killWorker();
		wx.preDownloadSubpackage({
			packageType: 'workers',
			success(res) {
				worker = wx.createWorker('static/workers/index.js', {
					useExperimentalWorker: true
				});
				worker.onProcessKilled(() => {
					createNewWorker();
				});
				sendMsg();
				createNewWorker.value = false;
				refreshCreate.value = false;
			},
			fail(res) {
				createNewWorker.value = false;
				proxy.$toast.showErrorToast('Worker加载失败');
			}
		});
	};
	const disabledBtn = computed(() => {
		return question.value.length <= 0 && !requestLoading.value && !processLoading.value;
	});

	const disabledInput = computed(() => {
		return processLoading.value || requestLoading.value;
	});
	const cacheMsgData = () => {
		messageStore.setCacheMsgObj(currentKey.value, currentMsgList.value);
	};
	// 请求控制器
	let abortTaskFn = null;

	// 消息发送前校验
	function validSendBefore() {
		if (!refreshCreate.value) {
			// 不是重新生成
			if (requestLoading.value || processLoading.value || !question.value) return;
		}
		if (currentMsgLength.value >= everyMaxLen.value) return proxy.$toast.showToast('此对话已达限制，请新建对话');
		// 正在读取worker
		if (createWorkerIng.value) return;
		const day = timeDiffNowDay(currentKey.value);
		// 当前如果对话不是今日的，更新它的key为今日对话
		if (day != config.TIME.today) {
			const newKey = Date.now();
			messageStore.updateCurrentMsgListKey(currentKey.value, newKey);
			currentKey.value = newKey;
		}
		createNewWorker();
	}

	// 发送消息
	async function sendMsg() {
		await nextTick();
		const {
			currentItem,
			messages
		} = requestParams();
		requestLoading.value = true;
		setTimeout(() => {
			requestLoading.value = false;
			processLoading.value = true;
		}, 1000);
		abortTaskFn = uni.request({
			url: `https://api.deepseek.com/v1/chat/completions`,
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer sk-921c241153c243e1956e7481787861f9`
			},
			data: {
				messages,
				model: deepthink.value ? modelTypes.value['reasoner'] : modelTypes.value['chat'],
				stream: true
			},
			timeout: 60000,
			success(res) {
				const stream = res.data;
				requestLoading.value = false;
				processLoading.value = true;
				let buffer = '';
				worker.postMessage({
					stream,
					deepthink: deepthink.value
				});
				worker.onMessage((e) => {
					buffer += e.chunk;
					startRender.value = true;
					if (e.chunk !== '[DONE]' && abortTaskFn) {
						currentItem.answer = buffer;
						return;
					}
					currentItem.loading = false;
					abortTaskFn = null;
					killRequest();
				});
			},
			fail(err) {
				if (err.errMsg?.indexOf('timeout') != -1) {
					currentItem.answer = err.errMsg || '服务繁忙，请稍后再试';
				}
				killRequest();
			},
			complete() {
				requestLoading.value = false;
			}
		});
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
		const list = currentMsgList.value.map((item) => ({
			role: item.role,
			question: item.question,
			answer: item.answer
		}));
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

	// 结束线程
	function killWorker() {
		if (worker) {
			worker.terminate();
			worker = null;
		}
	}

	// 终止请求
	function killRequest() {
		if (abortTaskFn) {
			abortTaskFn.abort();
			abortTaskFn = null;
		}
		processLoading.value = false;
		requestLoading.value = false;
		startRender.value = false;
		initMsgList();
		killWorker();
	}

	function inputEvent(e) {
		if (e.length > 150) {
			autoHeight.value = false;
		} else {
			autoHeight.value = true;
		}
	}

	function blurEvent() {
		keyboardHeight.value = 0;
	}

	// 监听网络状态
	function workStatus(res) {
		if (!res.isConnected) {
			showErrorToast('网络已断开连接');
			killRequest();
		} else {
			if (res.networkType != 'wifi') {
				showSuccessToast(`已使用移动网络`);
			} else {
				showSuccessToast(`已连接wifi`);
			}
		}
	}

	onLoad(() => {
		storageClearIfNeeded();
		killRequest();
	});
	onShow(() => {
		uni.onKeyboardHeightChange((res) => {
			keyboardHeight.value = res.height;
		});
		uni.onNetworkStatusChange(workStatus);
	});
	onHide(() => {
		uni.offKeyboardHeightChange();
		uni.offNetworkStatusChange(workStatus);
	});
</script>
<template>
	<view class="msg-input" :style="{ bottom: keyboardHeight + 'px' }"
		:class="{ keyboard: keyboardHeight > 0 && !currentMsgIsEmpty }">
		<uv-textarea fixed @input="inputEvent" v-model.trim="question" height="100" :disabled="disabledInput"
			:customStyle="{ backgroundColor: '#f3f4f6' }" placeholderStyle="font-size:24rpx;" :autoHeight="autoHeight"
			:adjustPosition="false" border="none" :maxlength="50000" s @blur="blurEvent"
			placeholder="发送消息"></uv-textarea>
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
					<image v-if="!requestLoading && !processLoading" @click.stop="validSendBefore"
						src="/common/icons/send.svg" mode=""></image>
					<image v-if="requestLoading" class="loading" src="/common/icons/loading-white.svg" mode=""></image>
					<image v-if="!requestLoading && processLoading" @click.stop="killRequest"
						src="/common/icons/stop.svg" mode=""></image>
				</view>
			</view>
		</view>
	</view>
	<view class="statement" v-if="!currentMsgIsEmpty">内容仅供参考</view>
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
		transition: bottom 0.3s ease;

		&.keyboard {
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
		}

		.tool {
			display: flex;
			align-items: center;
			justify-content: space-between;

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