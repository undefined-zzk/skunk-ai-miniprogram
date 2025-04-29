<template>
	<view class="content">
		<custom-navbar title="ZK助手">
			<template #left>
				<view class="nav-icon">
					<image src="/common/icons/aside.svg" @click="showAside = true"></image>
					<image src="/common/icons/new_chat.svg" mode="" @click="createNewChat"></image>
				</view>
			</template>
		</custom-navbar>
		<view class="msg-box" :class="{ noChat: currentMsgIsEmpty }">
			<view class="empty" v-if="currentMsgIsEmpty && !refreshCreate">
				<view class="logo">
					<image src="/common/icons/skunk.svg" mode=""></image>
				</view>
				<view class="desc">
					<view class="title">
						<text>我是ZK助手，很高兴见到你!</text>
					</view>
					<view class="sub-title">我可以帮你写代码、写作各种创意内容，请把你的任务交给我吧~</view>
				</view>
			</view>
			<scroll-view scroll-y @touchmove="touchmove" class="msgs" scroll-anchoring scroll-x :scroll-top="scrollTop"
				@scroll="scroll" scroll-with-animation v-else>
				<!-- 	<uv-list style="width: 100%">
					<uv-list-item style="width: 100%; overflow: auto" v-for="(item, index) in currentMsgList" :key="item.id">
						<message-item :item="item" :index="index"></message-item>
					</uv-list-item>
				</uv-list> -->
				<message-item v-for="(item, index) in currentMsgList" :key="item.id" :item="item"
					:index="index"></message-item>
				<view class="observe"></view>
			</scroll-view>
			<msg-input class="msg-input-bottom"></msg-input>
		</view>
		<aside-history v-model="showAside"></aside-history>
		<top-bottom-arrow @top="goTop" @bottom="goBottom"></top-bottom-arrow>
	</view>
</template>

<script setup>
	import { useAuth } from '../../composables/useAuth'
	import { storeToRefs } from 'pinia'
	import { useMessageStore } from '@/store/modules/message'
	import { showToast } from '@/utils/toast'
	import {
		ref,
		onMounted,
		getCurrentInstance
	} from 'vue'
	const instance = getCurrentInstance()
	useAuth()
	const showAside = ref(false)
	const scrollTop = ref(0)
	const scrollObj = ref({ oldScrollTop: 0 })
	const messageStore = useMessageStore()
	const stop = ref(false)
	let rafId = null
	const {
		currentMsgList,
		currentMsgIsEmpty,
		currentKey,
		startRender,
		processLoading,
		refreshCreate
	} = storeToRefs(messageStore)

	// 创建新的对话
	const createNewChat = () => {
		if (currentMsgIsEmpty.value) {
			showToast('已在最新对话中')
			return
		}
		currentKey.value = Date.now()
		currentMsgList.value = []
	}

	// 内容开始渲染
	watch(startRender, () => {
		if (startRender.value) {
			stop.value = false
			goToBtoLoop()
		} else {
			stop.value = true
		}
	})
	// 请求开始
	watch(processLoading, () => {
		if (processLoading.value) {
			goBottom()
		}
	})

	function scroll(e) {
		scrollObj.value.oldScrollTop = e.detail.scrollTop
	}

	function touchmove() {
		stop.value = true
	}

	// 回到顶部
	function goTop() {
		stop.value = true
		// 确保scrollTop的值发生变化，不然小程序会忽略这次更新
		scrollTop.value = scrollObj.value.oldScrollTop
		nextTick(() => {
			scrollTop.value = 0
		})
	}

	// 回到底部
	async function goBottom() {
		scrollTop.value = scrollObj.value.oldScrollTop
		const { scrollHeight } = await getScrollInfo()
		nextTick(() => {
			scrollTop.value = scrollHeight
			stop.value = false
		})
	}

	async function goToBtoLoop() {
		if (stop.value) {
			clearTimeout(rafId)
			rafId = null
			return
		}
		const { scrollHeight } = await getScrollInfo()
		scrollTop.value = scrollHeight + 1
		nextTick(() => {
			scrollTop.value = scrollHeight
		})
		rafId = setTimeout(() => {
			goToBtoLoop()
		}, 100)
	}

	// 获取内容总体高度
	function getScrollInfo() {
		return new Promise(resolve => {
			if (currentMsgIsEmpty.value) return
			uni.createSelectorQuery()
				.select('.msgs')
				.scrollOffset(({
					scrollTop,
					scrollHeight
				}) => {
					resolve({
						scrollHeight,
						scrollTop
					})
				})
				.exec()
		})
	}

	onReady(() => {
		scrollTop.value = scrollObj.value.oldScrollTop + 0.01
		nextTick(async () => {
			const { scrollHeight } = await getScrollInfo()
			scrollTop.value = scrollHeight
		})
	})
</script>

<style lang="scss" scoped>
	.nav-icon {
		display: flex;
		align-items: center;
		gap: 30rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.content {
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.msg-box {
			flex: 1;
			flex-shrink: 0;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			&.noChat {
				align-items: center;
				margin-top: 80rpx;
				// justify-content: center;
			}

			.observe {
				text-align: center;
				height: 60rpx;
			}

			.msgs {
				flex: 1;
				flex-shrink: 0;
				overflow-y: auto;
			}

			.msg-input-bottom {
				width: 100%;
				height: fit-content;
			}

			.empty {
				width: 80%;
				margin: 0 auto 20rpx;
				transition: all 0.3s linear;

				.logo {
					image {
						width: 80rpx;
						height: 80rpx;
					}
				}

				.desc {
					margin-top: 20rpx;

					.title {
						font-weight: 700;
						color: #000;
						margin-bottom: 20rpx;
					}

					.sub-title {
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>