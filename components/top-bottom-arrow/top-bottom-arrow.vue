<script setup>
import { useMessageStore } from '@/store/modules/message';
import { storeToRefs } from 'pinia';
const messageStore = useMessageStore();
const { currentMsgIsEmpty } = storeToRefs(messageStore);
const emits = defineEmits(['top', 'bottom']);
</script>
<template>
	<view class="top-bottom-arrow" v-if="!currentMsgIsEmpty">
		<view class="arrow" @click="emits('top')">
			<image src="/common/icons/top.svg" mode=""></image>
		</view>
		<view class="arrow" @click="emits('bottom')">
			<image class="bottom" src="/common/icons/top.svg" mode=""></image>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.top-bottom-arrow {
	position: fixed;
	right: 30rpx;
	bottom: 330rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	.arrow {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		border: 1rpx solid #ccc;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
		.bottom {
			transform: rotate(180deg);
		}
		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
}
</style>
