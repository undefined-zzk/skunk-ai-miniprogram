<script setup>
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();

const { userinfo } = storeToRefs(userStore);
</script>

<template>
	<view class="content">
		<custom-navbar title="我的">
			<template>
				<view class="user-info">
					<view class="avatar">
						<image src="/common/icons/skunk.svg" v-if="!userinfo.avatar"></image>
						<image :src="userinfo.avatar" v-else></image>
					</view>
					<view class="name-box">
						<view class="name">{{ userinfo.name }}</view>
						<view class="uuid">ID:{{ userinfo.uuid }}</view>
					</view>
				</view>
			</template>
		</custom-navbar>
	</view>
</template>
<style lang="scss" scoped>
.user-info {
	padding: 30rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 2rpx solid #fff;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.name-box {
		font-size: 28rpx;
		.name {
			margin-bottom: 10rpx;
		}
		.uuid {
			font-size: 20rpx;
			color: #6d6d6d;
		}
	}
}
</style>
