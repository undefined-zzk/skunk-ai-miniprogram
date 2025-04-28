<script setup>
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { useAuth } from '../../composables/useAuth';
import { useMessageStore } from '@/store/modules/message';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
useAuth();
const userStore = useUserStore();
const messageStore = useMessageStore();

const { userinfo } = storeToRefs(userStore);
const { cacheMsgObj } = storeToRefs(messageStore);
const clearCache = async () => {
	await proxy.$toast.showToast('清除中', { icon: 'loading' });
	cacheMsgObj.value = [];
	proxy.$toast.showSuccessToast('清除完成');
};

const logout = () => {
	userStore.logout();
};
onShow(() => {});
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
		<view class="action-item">
			<button hover-class="none" plain open-type="contact">联系客服</button>
		</view>
		<view class="action-item">
			<button hover-class="none" plain @click="clearCache">清除缓存</button>
		</view>
		<view class="action-item">
			<button hover-class="none" plain @click="logout">退出登录</button>
		</view>
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
.action-item {
	height: 80rpx;
	padding: 0 10rpx;
	border-bottom: 1px solid #f3f3f3;
	button {
		height: 100%;
		line-height: 80rpx;
		background: transparent;
		overflow: hidden;
		border: none;
		font-size: 28rpx;
	}
}
</style>
