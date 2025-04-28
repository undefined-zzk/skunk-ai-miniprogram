<script setup>
import { showToast } from '@/utils/toast';
import { copySync } from '@/utils/copy';
import { useMessageStore } from '@/store/modules/message';
import { storeToRefs } from 'pinia';
const showModal = ref(false);
const messageStore = useMessageStore();
const { editMsg } = storeToRefs(messageStore);
const newQuestion = ref('');
const { item, index } = defineProps({
	item: {
		type: Object,
		default: () => ({})
	},
	index: {
		type: Number,
		default: 0
	}
});
const comItemAnswer = computed(() => {
	if (!item.answer) {
		return;
	}
	let htmlString = '';
	if (item.answer.split('```').length % 2) {
		let content = item.answer;
		if (content[content.length - 1] != '\n') {
			content += '\n';
		}
		htmlString = content;
	} else {
		htmlString = item.answer;
	}
	return htmlString;
});

// 复制文本
const copyText = (type) => {
	if (type === 'user') {
		copySync(item.question);
	} else {
		copySync(item.answer);
	}
};
// 打开编辑文本对话框
const editText = () => {
	showModal.value = true;
	newQuestion.value = item.question;
};
// 确认编辑
const confirmEditText = () => {
	if (!newQuestion.value || newQuestion.value.length <= 0) {
		showToast('内容不能为空');
		return;
	}
	editMsg.value = {
		index,
		newQuestion: newQuestion.value
	};
};

// 重新生成
const refresh = () => {
	editMsg.value = {
		index,
		newQuestion: item.question
	};
};
</script>
<template>
	<view class="message-item">
		<view class="user">
			<text>{{ item.question }}</text>
			<view class="icons">
				<image src="/common/icons/copy.svg" @click="copyText('user')" mode=""></image>
				<image src="/common/icons/edit.svg" @click="editText" mode=""></image>
			</view>
		</view>
		<view class="skunk">
			<image class="logo" src="/common/icons/skunk.svg" mode="aspectFit"></image>
			<view class="content-loading">
				<zero-markdown-view themeColor="#282C35" style="width: 100%" :markdown="comItemAnswer"></zero-markdown-view>
				<view class="icons">
					<image class="loading" v-if="item.loading" src="/common/icons/loading.svg" mode=""></image>
					<image src="/common/icons/copy.svg" v-if="!item.loading" @click="copyText('answer')" mode=""></image>
					<image src="/common/icons/refresh.svg" v-if="!item.loading" @click="refresh" mode=""></image>
				</view>
			</view>
		</view>
	</view>
	<confirm-modal v-model="showModal" @confirm="confirmEditText" title="重新编辑消息">
		<template #content>
			<view class="edit">
				<uni-easyinput
					type="textarea"
					placeholderStyle="fontSize:24rpx"
					:maxlength="50000"
					:inputBorder="false"
					focus
					trim
					:styles="{
						backgroundColor: '#f3f4f6'
					}"
					v-model="newQuestion"
					placeholder="请输入新的内容"
				></uni-easyinput>
			</view>
		</template>
	</confirm-modal>
</template>

<style lang="scss" scoped>
.edit {
	background-color: #f3f4f6;
	padding: 0 10rpx;
	border-radius: 10rpx;
	overflow: hidden;
}
.message-item {
	padding: 0 20rpx;
	width: 100%;
	.user,
	.skunk {
		gap: 16rpx;
		font-size: 28rpx;
		color: #282c35;
	}
	.user {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		flex-direction: column;
		text {
			background-color: #f3f3f3;
			border-radius: 20rpx;
			padding: 10rpx;
			max-width: 80%;
			min-width: 60rpx;
			white-space: pre-wrap;
			word-break: break-all;
		}
		.icons {
			display: flex;
			align-items: center;
			gap: 18rpx;
			justify-content: flex-end;
			image {
				visibility: hidden;
				width: 30rpx;
				height: 30rpx;
			}
		}
		&:hover {
			.icons {
				image {
					visibility: visible;
				}
			}
		}
	}
	.skunk {
		display: flex;
		margin: 10rpx 0;
		& > image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;
		}
		.logo {
		}
		.content-loading {
			display: flex;
			flex-direction: column;
			max-width: 90%;
			overflow: hidden;
			word-break: break-all;
		}
		.loading {
			width: 30rpx;
			height: 30rpx;
			animation: loading 1s linear infinite;
		}
		.icons {
			display: flex;
			align-items: center;
			gap: 18rpx;
			image {
				width: 30rpx;
				height: 30rpx;
			}
		}
	}
	@keyframes loading {
		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
