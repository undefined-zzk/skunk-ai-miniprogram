<template>
	<view class="content">
		<custom-navbar title="登录">
			<template #left>
				<view class="logo">
					<image src="/common/icons/skunk.svg" mode=""></image>
				</view>
			</template>
			<template>
				<view class="login">
					<view class="weixin">
						<view class="form">
							<view class="name">嗨，我是SkunkAI</view>
							<view class="desc">我是AI智能助手,可以帮你搜索/答疑/写作,请把你的任务交给我吧。</view>
							<button open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
								<image v-if="avatar" :src="avatar" mode="aspectFill" />
								<text v-else>选择头像</text>
							</button>
							<input cursor-color="#4e6cff" v-model="nickName" maxlength="6" type="nickname" placeholder="请输入昵称" @blur="handleNicknameBlur" />
						</view>
						<button type="default" plain @click="login">登录</button>
						<view class="remark">
							<checkbox-group @change="changeAgree">
								<label>
									<checkbox style="transform: scale(0.7)" color="#4e6cff" :value="true" />
									<text>说明:用户信息只保存于本地,进行虚拟登录</text>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</template>
		</custom-navbar>
	</view>
</template>

<script setup>
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { getCurrentInstance } from 'vue';
import { showErrorToast } from '@/utils/toast';
const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const { userinfo, skunkToken } = storeToRefs(userStore);
const loading = ref(false);
const avatar = ref('');
const nickName = ref('');
const agree = ref(false);
const handleChooseAvatar = (e) => {
	avatar.value = e.detail.avatarUrl;
};
const handleNicknameBlur = (e) => {
	nickName.value = e.detail.value;
};

const changeAgree = (e) => {
	agree.value = e.detail.value[0];
};
const login = async () => {
	if (!avatar.value) {
		return proxy.$toast.showErrorToast('请上传头像');
	}
	if (!nickName.value) {
		return proxy.$toast.showErrorToast('请输入昵称');
	}
	if (!agree.value) {
		return proxy.$toast.showToast('请同意说明');
	}
	userinfo.value = { name: nickName.value, avatar: avatar.value, uuid: Math.round(Math.random() * 20000) };
	skunkToken.value = generateWeChatUUID();
	await proxy.$toast.showToast('登录成功', { icon: 'loading' });
	uni.reLaunch({
		url: '/pages/index/index'
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
onShow(() => {
	if (skunkToken.value) {
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}
});
</script>

<style lang="scss" scoped>
.content {
	height: 100vh;
	overflow: hidden;
	width: 100%;
	.logo {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		display: flex;
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
			button {
				border: none;
			}
			.remark {
				color: $primary-color;
				font-size: 24rpx;
				text-align: center;
				width: 100%;
				margin-top: 10rpx;
				font-weight: 700;
			}
			.form {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 20rpx;
				gap: 30rpx;
				.name {
					-webkit-text-stroke: 2rpx $primary-color;
					-o-text-stroke: 2rpx $primary-color;
					-moz-text-stroke: 2rpx $primary-color;
					color: transparent;
				}
				.desc {
					text-align: center;
					color: $primary-color;
					font-size: 24rpx;
					width: 60%;
				}
				input {
					border-bottom: 2rpx solid #f3f3f3;
					padding-left: 20rpx;
					margin: 30rpx 0;
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
