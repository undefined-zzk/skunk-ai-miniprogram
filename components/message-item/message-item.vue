<script setup>
defineProps({
	item: {
		type: Object,
		default: () => ({})
	}
});
</script>
<template>
	<view class="message-item">
		<view class="user">
			<text>{{ item.question }}</text>
		</view>
		<view class="skunk">
			<image class="logo" src="/common/icons/skunk.svg" mode="aspectFit"></image>
			<image class="loading" v-if="item.loading" src="/common/icons/loading.svg" mode=""></image>
			<view class="msg" v-html="item.answer"></view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.message-item {
	.user,
	.skunk {
		gap: 16rpx;
		font-size: 28rpx;
		color: #282c35;
	}
	.user {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		text {
			background-color: #f3f3f3;
			border-radius: 20rpx;
			padding: 10rpx;
			max-width: 80%;
			white-space: pre-wrap;
			word-break: break-all;
		}
	}
	.skunk {
		display: flex;
		margin: 10rpx 0;
		image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;
		}
		.logo {
		}
		.loading {
			width: 40rpx;
			height: 40rpx;
			animation: loading 1s linear infinite;
		}
		.msg {
			max-width: 80%;
			overflow-x: auto;
		}
	}
	@keyframes loading {
		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
