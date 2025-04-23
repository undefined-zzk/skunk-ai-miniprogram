<script setup>
const { item } = defineProps({
	item: {
		type: Object,
		default: () => ({})
	}
});
const comItemAnswer = computed(() => {
	if (!item.answer) {
		return;
	}
	let htmlString = '';
	if (item.answer.split('```').length % 2) {
		let content = item.answer;
		if (content[content.length - 1] != '\n') {
			content += '\n';
		}
		htmlString = content;
	} else {
		htmlString = item.answer;
	}
	return htmlString;
});
</script>
<template>
	<view class="message-item">
		<view class="user">
			<text>{{ item.question }}</text>
		</view>
		<view class="skunk">
			<image class="logo" src="/common/icons/skunk.svg" mode="aspectFit"></image>
			<view class="content-loading">
				<zero-markdown-view themeColor="#282C35" style="width: 100%" :markdown="comItemAnswer"></zero-markdown-view>
				<image class="loading" v-if="item.loading" src="/common/icons/loading.svg" mode=""></image>
			</view>
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
			min-width: 60rpx;
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
		.content-loading {
			display: flex;
			flex-direction: column;
			max-width: 90%;
			overflow: hidden;
			word-break: break-all;
		}
		.loading {
			width: 40rpx;
			height: 40rpx;
			animation: loading 1s linear infinite;
		}
	}
	@keyframes loading {
		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
