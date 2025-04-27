<template>
	<view class="content">
		<custom-navbar title="SkunkAI">
			<template #left>
				<view class="nav-icon">
					<image src="/common/icons/aside.svg" @click="showAside = true"></image>
					<image src="/common/icons/new_chat.svg" mode="" @click="createNewChat"></image>
				</view>
			</template>
		</custom-navbar>
		<view class="msg-box" :class="{ noChat: currentMsgIsEmpty }">
			<view class="empty" v-if="currentMsgIsEmpty && !refreshCreate">
				<view class="logo">
					<image src="/common/icons/skunk.svg" mode=""></image>
				</view>
				<view class="desc">
					<view class="title">
						<text>我是SkunkAI，很高兴见到你!</text>
					</view>
					<view class="sub-title">我可以帮你写代码、写作各种创意内容，请把你的任务交给我吧~</view>
				</view>
			</view>
			<view class="msgs" v-else>
				<message-item v-for="(item, index) in currentMsgList" :item="item" :index="index" :key="item.id"></message-item>
			</view>
			<msg-input class="msg-input-bottom"></msg-input>
		</view>
		<aside-history v-model="showAside"></aside-history>
	</view>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth';
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/store/modules/message';
import { showToast } from '@/utils/toast';
import { ref, onMounted } from 'vue';
useAuth();
const showAside = ref(false);
const messageStore = useMessageStore();
const stop = ref(false);
const { currentMsgList, currentMsgIsEmpty, currentKey, processLoading, refreshCreate } = storeToRefs(messageStore);

// 创建新的对话
const createNewChat = () => {
	if (currentMsgIsEmpty.value) {
		showToast('已在最新对话中');
		return;
	}
	currentKey.value = Date.now();
	currentMsgList.value = [];
};

// 内容生成中
watch(processLoading, () => {
	if (processLoading.value) {
		stop.value = false;
		// scrollToBottom();
	} else {
		stop.value = true;
	}
});

// msgRef滚动到底部
function scrollToBottom() {
	if (stop.value) return;
	if (msgRef.value) {
		msgRef.value.scrollTop = msgRef.value.scrollHeight;
		scrollToBottom();
	}
}
</script>

<style lang="scss" scoped>
.nav-icon {
	display: flex;
	align-items: center;
	gap: 30rpx;
	image {
		width: 40rpx;
		height: 40rpx;
	}
}
.content {
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	.msg-box {
		flex: 1;
		flex-shrink: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		&.noChat {
			align-items: center;
			margin-top: 80rpx;
			// justify-content: center;
		}
		.msgs {
			flex: 1;
			flex-shrink: 0;
			overflow-y: auto;
			padding: 0 20rpx;
		}
		.msg-input-bottom {
			width: 100%;
			height: fit-content;
		}
		.empty {
			width: 80%;
			margin: 0 auto 20rpx;
			transition: all 0.3s linear;
			.logo {
				image {
					width: 80rpx;
					height: 80rpx;
				}
			}
			.desc {
				margin-top: 20rpx;
				.title {
					font-weight: 700;
					color: #000;
					margin-bottom: 20rpx;
				}
				.sub-title {
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
