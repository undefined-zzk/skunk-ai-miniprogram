<script setup>
const props = defineProps({
	title: {
		type: String,
		default: '标题'
	}
});
</script>
<template>
	<view class="custom-navbar">
		<view class="navbar">
			<view class="left"></view>
			<view class="center">{{ title }}</view>
			<view class="right"></view>
		</view>
		<slot></slot>
	</view>
</template>

<style lang="scss" scoped>
.custom-navbar {
	padding-top: var(--status-bar-height);
	min-height: 88rpx;
	// 兼容性
	background: linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -webkit-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -moz-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -o-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	.navbar {
		display: flex;
		align-items: center;
		height: 88rpx;
		justify-content: space-between;
		color: #fff;
	}
}
</style>
