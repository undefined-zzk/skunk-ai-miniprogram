<script setup>
const emits = defineEmits(['del', 'rename']);
const showPressPopup = defineModel({ required: true, type: Boolean });
const animation = ref(null);
watch(showPressPopup, async (newVal) => {
	await nextTick();
	// 创建动画
	const ani = uni.createAnimation({
		duration: 400,
		timingFunction: 'ease-out'
	});
	if (newVal) {
		ani.opacity(1).step();
	} else {
		ani.opacity(0).step();
	}
	animation.value = ani.export();
});

const del = () => {
	emits('del', false);
	showPressPopup.value = false;
};
const rename = () => {
	emits('rename', false);
	showPressPopup.value = false;
};
</script>
<template>
	<view class="press-popup" v-if="showPressPopup">
		<view class="mask" @click="showPressPopup = false"></view>
		<view class="popup" :animation="animation">
			<view class="" @click="del">
				<text>删除</text>
			</view>
			<view class="" @click="rename">
				<text>重命名</text>
			</view>
			<view class="" @click="showPressPopup = false">
				<text>取消</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.press-popup {
	position: fixed;
	z-index: 1010;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.popup {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
		view {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 90rpx;
			border-bottom: 1rpx solid #f3f3f3;
			text {
				font-size: 28rpx;
				color: #333;
			}
			&:last-child {
				border-bottom: none;
			}
		}
	}
}
</style>
