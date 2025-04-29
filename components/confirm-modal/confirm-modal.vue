<script setup>
import { useSlots } from 'vue';

const showModal = defineModel({ required: true, default: false, type: Boolean });
const emits = defineEmits(['confirm', 'cancel']);
const animation = ref(null);
const slots = useSlots();
watch(showModal, async (newVal) => {
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
defineProps({
	content: {
		type: String,
		default: '内容'
	},
	confirmText: {
		type: String,
		default: '确定'
	},
	cancelText: {
		type: String,
		default: '取消'
	},
	title: {
		type: String,
		default: '提示'
	}
});
const confirm = () => {
	emits('confirm', false);
};
const cancel = () => {
	emits('cancel', false);
	showModal.value = false;
};
</script>
<template>
	<view class="confirm-modal" v-if="showModal">
		<view class="modal-content" :animation="animation">
			<view class="title">
				{{ title }}
			</view>
			<view class="content">
				<text v-if="!slots.content">{{ content }}</text>
				<slot name="content" v-else></slot>
			</view>
			<view class="btns">
				<view class="cancel" @click="cancel">{{ cancelText }}</view>
				<view class="confirm" @click="confirm">{{ confirmText }}</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.confirm-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1010;
	.modal-content {
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		width: 80%;
		max-width: 1000rpx;
		.title {
			font-weight: 700;
			font-size: 32rpx;
			padding: 30rpx 20rpx 20rpx 20rpx;
			text-align: center;
		}
		.content {
			font-size: 28rpx;
			margin: 20rpx 0;
			color: #333;
			min-height: 100rpx;
			max-height: 200rpx;
			overflow-y: auto;
			padding: 0 20rpx;
			text {
				text-align: center;
				width: 100%;
				display: block;
				color: #878787;
			}
		}
		.btns {
			display: flex;
			align-items: center;
			border-top: 1rpx solid #f3f3f3;
			view {
				flex: 1;
				padding: 20rpx;
				text-align: center;
				font-size: 28rpx;
				color: #333;
				font-weight: 700;
				cursor: pointer;
				&.cancel {
					border-right: 1rpx solid #f3f3f3;
					color: #878787;
				}
				&.confirm {
					color: #626262;
				}
			}
		}
	}
}
</style>
