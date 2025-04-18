<script setup>
const props = defineProps({
	title: {
		type: String,
		default: '标题'
	}
});

const { width, right, top, height } = uni.getMenuButtonBoundingClientRect();
const systeminfo = uni.getSystemInfoSync();
const pt = ref(top * 2 + 'rpx');
</script>
<template>
	<view class="custom-navbar">
		<view class="navbar">
			<view class="left">
				<slot name="left"></slot>
			</view>
			<view class="center">
				<text>{{ title }}</text>
			</view>
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
		<slot></slot>
	</view>
</template>
<style lang="scss" scoped>
.custom-navbar {
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	padding-top: v-bind(pt);
	z-index: 999;
	min-height: 88rpx;
	background: linear-gradient(to bottom, $gradient-color1, $gradient-color2, $gradient-color2, #ffffff);
	background: -webkit-linear-gradient(to bottom, $gradient-color1, $gradient-color2, $gradient-color2, #ffffff);
	background: -moz-linear-gradient(to bottom, $gradient-color1, $gradient-color2, $gradient-color2, #ffffff);
	background: -o-linear-gradient(to bottom, $gradient-color1, $gradient-color2, $gradient-color2, #ffffff);
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ffffff;
		height: 64rpx;
		padding: 0 16rpx;
		.left,
		.right,
		.center {
			display: flex;
			align-items: center;
		}
		.left,
		.right {
			flex: 1;
			min-width: 0;
		}
		.center {
			flex-shrink: 0;
			text-align: center;
		}
	}
}
</style>
