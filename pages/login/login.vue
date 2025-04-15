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
				<view class="form">
					<button open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
						<image v-if="avatar" :src="avatar" mode="aspectFill" />
						<text v-else>选择头像</text>
					</button>
					<input cursor-color="#4e6cff" v-model="nickName" maxlength="6" type="nickname" placeholder="请输入昵称" @blur="handleNicknameBlur" />
				</view>
				<view class="rember">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox :value="true" color="#4e6cff" :checked="remeber" />
							<text>记住我</text>
						</label>
					</checkbox-group>
				</view>
				<button type="default" @click="login">登录</button>
				<view class="remark">说明:用户信息只保存于本地,进行虚拟登录</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const { userinfo, skunkToken, remeber } = storeToRefs(userStore);
const loading = ref(false);
const avatar = ref('');
const nickName = ref('');

const handleChooseAvatar = (e) => {
	avatar.value = e.detail.avatarUrl;
};
const handleNicknameBlur = (e) => {
	nickName.value = e.detail.value;
};
const checkboxChange = (e) => {
	remeber.value = e.detail.value[0] || false;
};
const login = () => {
	if (!avatar.value) {
		return uni.showToast({
			title: '请上传头像',
			mask: true,
			icon: 'error'
		});
	}
	if (!nickName.value) {
		return uni.showToast({
			title: '请输入昵称',
			mask: true,
			icon: 'error'
		});
	}
	userinfo.value = { name: nickName.value, avatar: avatar.value, uuid: Math.round(Math.random() * 20000) };
	skunkToken.value = generateWeChatUUID();
	uni.showToast({
		title: '登录成功',
		mask: true,
		icon: 'loading',
		success() {
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}, 1500);
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

onLoad(() => {
	if (!Boolean(remeber.value)) return;
	const { name: cacheName, avatar: cacheAvatar } = userinfo.value;
	nickName.value = cacheName;
	avatar.value = cacheAvatar;
});
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
		gap: 30rpx;
		height: calc(100vh - 88rpx);
		padding: 20rpx;
		.weixin {
			margin-top: 100rpx;
			width: 100%;
			.remark {
				color: $primary-color;
				font-size: 24rpx;
				text-align: center;
				width: 100%;
				margin-top: 10rpx;
				font-weight: 600;
			}
			.form {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 20rpx;
				gap: 30rpx;
				input {
					border-bottom: 2rpx solid #f3f3f3;
					padding-left: 20rpx;
				}
				::v-deep .input-placeholder {
					font-size: 24rpx;
				}
				button {
					padding: 0;
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					overflow: hidden;
					display: flex;
					align-items: center;
					justify-content: center;
					background: transparent;
					border: 1rpx solid $gradient-color2;
					image {
						width: 100%;
						height: 100%;
					}
					text {
						font-size: 24rpx;
						color: #808080;
					}
				}
			}
			.rember {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 10rpx;
				text {
					color: $primary-color;
					font-size: 24rpx;
				}
			}
			& > button {
				width: 100%;
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
