<template>
	<view class="content">
		<custom-navbar title="SkunkAI">
			<template #left>
				<view class="nav-icon">
					<image src="/common/icons/aside.svg"></image>
					<image src="/common/icons/new_chat.svg" mode=""></image>
				</view>
			</template>
		</custom-navbar>
		<view class="msg-box" :class="{ noChat: currentMsgIsEmpty }">
			<view class="empty" v-if="currentMsgIsEmpty">
				<view class="logo">
					<image src="/common/icons/skunk.svg" mode=""></image>
				</view>
				<view class="desc">
					<view class="title">
						<text>我是SkunkAI，很高兴见到你!</text>
					</view>
					<view class="sub-title">我可以帮你写代码、写作各种创意内容，请把你的任务交给我吧~</view>
				</view>
			</view>
			<view class="msgs" v-else>
				<message-item v-for="item in currentMsgList" :item="item" :key="item.id"></message-item>
			</view>
			<msg-input class="msg-input-bottom"></msg-input>
		</view>
	</view>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth';
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/store/modules/message';
useAuth();
const messageStore = useMessageStore();
const { currentMsgList, currentMsgIsEmpty } = storeToRefs(messageStore);
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
		.msgs {
			flex: 1;
			flex-shrink: 0;
			overflow-y: auto;
			padding: 0 20rpx;
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
					font-weight: 600;
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
