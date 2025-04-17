<script setup>
defineProps({
	disabled: {
		type: Boolean,
		defalut: false
	}
});
</script>
<template>
	<view class="msg-input">
		<textarea :disabled="disabled" placeholder-style="font-size: 28rpx" confirm-type="发送" :maxlength="50000" placeholder="给 SkunkAI 发送消息"></textarea>
	</view>
</template>

<style lang="scss" scoped>
.msg-input {
	width: 100%;
	background-color: #f3f4f6;
	border: 1rpx solid #f3f3f3;
	border-radius: 10rpx;
	overflow: hidden;
	textarea {
		width: 100%;
		padding: 20rpx;
	}
}
</style>
