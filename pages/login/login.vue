<template>
	<view class="content">
		<view class="title">
			<view class="logo">
				<image src="/common/icons/skunk.svg" mode=""></image>
			</view>
			<text>登录</text>
			<view class=""></view>
		</view>
		<view class="login">
			<view class="weixin">
				<!-- <image src="/common/icons/weixin.svg" mode=""></image> -->
				<button @click="getuserinfo">一键登录</button>
				<!-- <button :loading="loading" open-type="getUserInfo" @getuserinfo="getuserinfo">一键登录</button> -->
				<!-- <button :loading="loading" open-type="getPhoneNumber" @getphonenumber="getphonenumber">一键登录</button> -->
			</view>
		</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const { userinfo, skunkToken } = storeToRefs(userStore);
const loading = ref(false);
const getuserinfo = () => {
	uni.getUserProfile({
		desc: '用户登录',
		success(res) {
			const { nickName, avatarUrl } = res.userInfo;
			userinfo.value = { name: nickName, avatar: avatarUrl, uuid: Math.round(Math.random() * 20000) };
			skunkToken.value = generateWeChatUUID();
			uni.showToast({
				title: '登录成功',
				mask: true,
				image: '/common/icons/skunk.svg',
				success() {
					uni.reLaunch({
						url: '/pages/index/index'
					});
				}
			});
		},
		fail(err) {
			uni.showToast({
				title: err,
				mask: true
			});
		}
	});
};

function generateWeChatUUID() {
	if (wx.getSystemInfoSync().SDKVersion >= '2.11.0') {
		return wx.env.USER_DATA_PATH + '/' + Date.now(); // 示例: wxfile://usr/1718289324254
	} else {
		// 降级方案
		return Date.now() + '-' + Math.random().toString(36).substr(2, 8);
	}
}
</script>

<style lang="scss" scoped>
$bar: var(--status-bar-height);
@mixin bg {
	background: linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -webkit-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -moz-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
	background: -o-linear-gradient(to bottom, $gradient-color1, $gradient-color2, #ffffff);
}
.content {
	@include bg();
	height: 100vh;
	overflow: hidden;
	width: 100%;
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: $bar;
		font-weight: 600;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
		color: #ffffff;
		padding-left: 20rpx;
		padding-right: 20rpx;
		.logo {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			display: flex;
		}
	}
	image {
		width: 100%;
		height: 100%;
	}
	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 30rpx;
		height: calc(100vh - 88rpx);
		padding: 20rpx;
		.weixin {
			width: 100%;
			button {
				width: 100%;
				height: 100%;
				padding: 20rpx;
				background: linear-gradient(to bottom, $gradient-color1, $gradient-color2);
				background: -webkit-linear-gradient(to bottom, $gradient-color1, $gradient-color2);
				background: -moz-linear-gradient(to bottom, $gradient-color1, $gradient-color2);
				background: -o-linear-gradient(to bottom, $gradient-color1, $gradient-color2);
				color: #ffffff;
			}
		}
	}
}
</style>
