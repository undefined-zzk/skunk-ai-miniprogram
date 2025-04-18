<script setup>
const { disabled } = defineProps({
	disabled: {
		type: Boolean,
		defalut: false
	}
});
const emits = defineEmits(['sendMessage']);
const question = ref('');
const inputRef = ref();
const autoHeight = ref(false);
const deepthink = ref(false);

const disabledBtn = computed(() => {
	return question.value.length <= 0 || disabled;
});

// 发送消息
const sendMsg = () => {
	emits('sendMessage', {
		question: question.value,
		deepthink: deepthink.value
	});
};
</script>
<template>
	<view class="msg-input">
		<uni-easyinput
			ref="inputRef"
			type="textarea"
			:disabled="disabled"
			placeholderStyle="fontSize:24rpx"
			:maxlength="50000"
			:adjust-position="false"
			:clearSize="0"
			:autoHeight="autoHeight"
			:inputBorder="false"
			disableColor="#f3f4f6"
			focus
			trim
			:styles="{
				backgroundColor: '#f3f4f6'
			}"
			v-model="question"
			placeholder="给 SkunkAI 发送消息"
		></uni-easyinput>
		<view class="tool">
			<view class="left">
				<view class="icon" :class="{ active: deepthink }" @click.stop="deepthink = !deepthink">
					<image src="/common/icons/deepthink-active.svg" v-if="deepthink" mode=""></image>
					<image src="/common/icons/deepthink.svg" mode="" v-else></image>
					<text>深度思考 (R1)</text>
				</view>
			</view>
			<view class="right">
				<view class="icon2" @click.stop="sendMsg" :class="{ disabled: disabledBtn }">
					<image src="/common/icons/send.svg" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.msg-input {
	width: 90%;
	padding: 20rpx;
	margin: auto;
	background-color: #f3f4f6;
	border: 1rpx solid #f3f3f3;
	border-radius: 10rpx;
	overflow: hidden;
	.tool {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20rpx;
		.left,
		.right {
			.icon {
				display: flex;
				align-items: center;
				gap: 10rpx;
				padding: 10rpx;
				border-radius: 100rpx;
				background-color: #fff;
				border: 2rpx solid #f3f3f3;
				font-size: 24rpx;
				color: #bfbfbf;
				&.active {
					background-color: rgba($primary-color, 25%);
					border-color: $primary-color;
					text {
						color: $primary-color;
					}
				}
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		.right {
			.icon2 {
				background-color: $primary-color;
				width: 50rpx;
				height: 50rpx;
				border-radius: 18rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				&.disabled {
					opacity: 0.3;
				}
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}
}
</style>
