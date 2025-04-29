<script setup>
import { useUserStore } from '@/store/modules/user';
import { settingLocationAuth, getLocationOpenMap } from '../../utils/location.js';
import { storeToRefs } from 'pinia';
import { useAuth } from '../../composables/useAuth';
import { useMessageStore } from '@/store/modules/message';
import { getCurrentInstance } from 'vue';
import { showErrorToast, showToast } from '@/utils/toast.js';
const { proxy } = getCurrentInstance();
useAuth();
const userStore = useUserStore();
const messageStore = useMessageStore();
const showModal = ref(false);
const confirmText = ref('确定');
const title = ref('');
const content = ref('');
const subscription = ref(false);
const { userinfo } = storeToRefs(userStore);
const { cacheMsgObj } = storeToRefs(messageStore);
const tempId = 'Lt7PRpzGVk85E3SAec51b0kiSyF91CN3YznRWmyYShQ';
const clearCache = async () => {
	await proxy.$toast.showToast('清除中', { icon: 'loading' });
	cacheMsgObj.value = [];
	proxy.$toast.showSuccessToast('清除完成');
};

const openModal = (type) => {
	confirmText.value = '确定';
	if (type === 1) {
		title.value = '清除缓存';
		content.value = '这将清除所有对话!是否继续?';
	} else {
		title.value = '退出登录';
		content.value = '这将清除当前用户信息!是否继续?';
	}
	showModal.value = true;
};

const confirm = async () => {
	showModal.value = false;
	if (title.value === '清除缓存') {
		await clearCache();
	} else if (title.value === '退出登录') {
		userStore.logout();
	} else if (title.value === '订阅失败') {
		openSetting();
	}
};

const openLocation = async () => {
	const { name } = await getLocationOpenMap();
	userinfo.value.ip = name;
};

const changeSwitch = async (e) => {
	if (e) {
		const res = await getSetting();
		if (res.subscriptionsSetting?.itemSettings?.[tempId] === 'reject') {
			title.value = '订阅失败';
			content.value = '您已拒绝消息订阅，如需接收通知，请到设置页开启权限';
			confirmText.value = '去设置';
			showModal.value = true;
		} else {
			uni.requestSubscribeMessage({
				tmplIds: [tempId],
				async success(res) {
					if (res[tempId] == 'accept') {
						showToast('订阅成功');
						subscription.value = true;
					} else {
						subscription.value = false;
					}
				},
				fail(err) {
					showErrorToast('订阅失败');
					if (err.errCode === 20004) {
						title.value = '订阅失败';
						content.value = '请在设置中打开通知管理权限';
						confirmText.value = '去设置';
						showModal.value = true;
					}
					subscription.value = false;
				}
			});
		}
	} else {
		openSetting();
	}
};

function openSetting() {
	return new Promise((resolve, reject) => {
		wx.openSetting({
			success(res) {
				resolve(res);
			},
			fail(err) {
				reject(err);
			}
		});
	});
}

function getSetting() {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			withSubscriptions: true,
			success(res) {
				if (res.subscriptionsSetting?.itemSettings?.[tempId] === 'accept') {
					subscription.value = true;
				} else {
					subscription.value = false;
				}
				resolve(res);
			},
			fail(err) {
				subscription.value = false;
				reject(err);
			}
		});
	});
}

onShow(() => {
	getSetting();
});
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
					<view class="location">
						<image src="/common/icons/location.svg" mode="" @click="openLocation"></image>
						<text>{{ userinfo.ip }}</text>
					</view>
				</view>
			</template>
		</custom-navbar>
		<view class="box">
			<view class="">
				<view class="action-item">
					<button hover-class="none" plain open-type="contact">联系作者</button>
				</view>
				<view class="action-item">
					<button hover-class="none" plain @click="openModal(1)">清除缓存</button>
				</view>
				<view class="action-item">
					<view>订阅消息</view>
					<view class="right">
						<uv-switch size="20" v-model="subscription" activeColor="#4e6cff" @change="changeSwitch"></uv-switch>
					</view>
				</view>
			</view>
			<view class="action-item logout">
				<button hover-class="none" plain @click="openModal(2)">退出登录</button>
			</view>
		</view>
	</view>
	<confirm-modal v-model="showModal" :title="title" :content="content" @confirm="confirm" :confirmText="confirmText"></confirm-modal>
</template>
<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	height: 100vh;
}
.user-info {
	padding: 30rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	.location {
		align-self: flex-end;
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 20rpx;
		color: #6d6d6d;
		margin-bottom: 12rpx;
		text {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 440rpx;
		}
		image {
			width: 40rpx;
			height: 40rpx;
		}
	}
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		flex-shrink: 0;
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
.box {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.action-item,
.logout {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	border-bottom: 2rpx solid #f3f3f3;
	.right {
		width: 100rpx;
	}
	button {
		flex: 1;
		height: 100%;
		line-height: 80rpx;
		background: transparent;
		overflow: hidden;
		border: none;
	}
}
.logout {
	border: 2rpx solid #f3f3f3;
	width: 90%;
	border-radius: 10rpx;
	margin: 30rpx auto;
}
</style>
