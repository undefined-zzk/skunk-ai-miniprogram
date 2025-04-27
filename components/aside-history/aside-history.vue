<script setup>
import { useUserStore } from '@/store/modules/user';
import { useMessageStore } from '@/store/modules/message';
import { useAsideStore } from '@/store/modules/aside';
import { storeToRefs } from 'pinia';
import { timeDiffNowDay } from '@/utils/time';
import { config } from '@/static/config';
import { showToast } from '@/utils/toast';
const showModal = defineModel({ required: true, default: false, type: Boolean });
const { width, top, right } = uni.getMenuButtonBoundingClientRect();
const { safeArea } = uni.getSystemInfoSync();
const pt = ref(top * 2 + 'rpx');
const wd = ref((safeArea.width - (safeArea.width - right) * 2 - width - 20) * 2 + 'rpx');
const boxh = ref((safeArea.height - 40 - 10) * 2 + 'rpx');
const userStore = useUserStore();
const messageStore = useMessageStore();
const asideStore = useAsideStore();
const { userinfo } = storeToRefs(userStore);
const { cacheMsgObj, currentKey } = storeToRefs(messageStore);
const { asideChange } = storeToRefs(asideStore);
const animation = ref(null);
const showPressPopup = ref(false);
const showDelModal = ref(false);
const showRenameModal = ref(false);
const asideTitleMaxLength = 100;
const pressItem = ref({
	asideTitle: ''
});
watch(showModal, async (newVal) => {
	await nextTick();
	// 创建动画
	const ani = uni.createAnimation({
		duration: 400,
		timingFunction: 'ease-out'
	});
	if (newVal) {
		ani.opacity(1).step();
		if (timeDiffNowDay(currentKey.value) != config.TIME.today) {
			getGroupData();
		}
	} else {
		ani.opacity(0).step();
		pressItem.value = { asideTitle: '' };
	}
	animation.value = ani.export();
});
const historyList = computed(() => {
	return getGroupData();
});

const hisLen = computed(() => {
	return Object.keys(historyList.value).length > 0;
});

function getGroupData() {
	try {
		const list = cacheMsgObj.value.map((item) => {
			return {
				question: item.asideTitle ? item.asideTitle : item.list ? item.list[0]?.question?.slice(0, asideTitleMaxLength) : '-',
				day: timeDiffNowDay(item.time),
				time: item.time
			};
		});
		// 最新的排到最前面
		list.sort((a, b) => {
			return b.time - a.time;
		});
		return groupHistory(list || []);
	} catch (err) {
		console.log('err', err);
	}
}

// 进行分组
function groupHistory(arr) {
	const obj = {};
	arr.forEach((item) => {
		if (obj[item.day]) {
			obj[item.day].push({ time: item.time, question: item.question });
		} else {
			obj[item.day] = [{ time: item.time, question: item.question }];
		}
	});
	return obj;
}

// 切换对话
function changeChat(time) {
	currentKey.value = time;
	messageStore.updateCurrentMsgList(time);
	showModal.value = false;
}
// 跳转用户中心
function goUserCenter() {
	uni.navigateTo({
		url: '/pages/user/user'
	});
}

// 处理长按事件
function handleLongPress(child) {
	pressItem.value = { ...child, asideTitle: child.asideTitle ? child.asideTitle : child.question };
	showPressPopup.value = true;
}

// 重新命名标题
function renameHistoryTitle() {
	if (!pressItem.value) return;
	showRenameModal.value = true;
}
// 删除会话
function delHistory() {
	if (!pressItem.value) return;
	const { time } = pressItem.value;
	cacheMsgObj.value = cacheMsgObj.value.filter((item) => item.time != time).filter((item) => item.list && item.list.length > 0);
	if (time === currentKey.value) {
		currentKey.value = Date.now();
		messageStore.updateCurrentMsgList(currentKey.value);
	}
	showDelModal.value = false;
	showPressPopup.value = false;
}
// 打开删除确认弹窗，关闭长按弹窗
function pressOpen() {
	showPressPopup.value = false;
	showDelModal.value = true;
}
// 会话重新命名
function renameConfirm() {
	const { time, asideTitle } = pressItem.value;
	if (!asideTitle || asideTitle.length <= 0) {
		showToast('请输入名称');
		return;
	}
	const result = cacheMsgObj.value.find((item) => item.time === time);
	result.asideTitle = asideTitle;
	showRenameModal.value = false;
}
</script>
<template>
	<view class="aside-history" v-if="showModal">
		<view class="mask" @click="showModal = false"></view>
		<view class="box" :animation="animation">
			<view class="list-box" :class="{ noData: !hisLen }">
				<view class="list-item" v-if="hisLen" v-for="(item, key) in historyList" :key="key">
					<view class="date">{{ key }}</view>
					<view
						class="answer-item"
						:class="{ active: currentKey === child.time }"
						@longpress="handleLongPress(child)"
						@click="changeChat(child.time)"
						v-for="(child, idx) in item"
						:key="idx"
					>
						{{ child.question }}
					</view>
				</view>
				<view class="empty" v-if="!hisLen">暂无对话</view>
			</view>
			<view class="user" @click="goUserCenter">
				<image :src="userinfo.avatar" mode=""></image>
				<text>{{ userinfo.name }}</text>
			</view>
		</view>
	</view>
	<press-popup v-model="showPressPopup" @del="pressOpen" @rename="renameHistoryTitle"></press-popup>
	<confirm-modal @confirm="delHistory" v-model="showDelModal" title="永久删除对话" content="删除后,该对话不可恢复,确认删除吗?"></confirm-modal>
	<confirm-modal @confirm="renameConfirm" v-model="showRenameModal" title="重命名会话">
		<template #content>
			<input class="rename" cursor-color="#4e6cff" :maxlength="asideTitleMaxLength" v-model.trim="pressItem.asideTitle" focus placeholder="请输入新的会话名称" />
		</template>
	</confirm-modal>
</template>

<style lang="scss" scoped>
.rename {
	padding: 10rpx 20rpx;
	background-color: #f3f4f6;
	border-radius: 10rpx;
}
.box {
	position: fixed;
	z-index: 1002;
	left: 0;
	top: 0;
	background-color: #ffffff;
	height: 100%;
	padding: v-bind(pt) 20rpx 0rpx 20rpx;
	width: v-bind(wd);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	opacity: 0;
	box-sizing: border-box;

	.list-box {
		overflow-y: auto;
		flex: 1;
		&.noData {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.empty {
			font-size: 28rpx;
			color: #878787;
		}
		.list-item {
			font-size: 30rpx;
			margin-bottom: 40rpx;
			.date {
				color: #878787;
				margin-bottom: 20rpx;
				font-weight: 700;
			}
			.answer-item {
				margin-bottom: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				border-radius: 10rpx;
				padding: 20rpx 10rpx;
				&.active {
					background-color: rgba($primary-color, 10%);
				}
			}
		}
	}
	.user {
		display: flex;
		align-items: center;
		gap: 20rpx;
		height: 80rpx;
		image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			overflow: hidden;
		}
		.name {
			color: #333;
		}
	}
}
.aside-history {
	position: fixed;
	width: 100vw;
	height: 100vh;
	inset: 0;
	z-index: 1000;
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 1001;
	}
}
</style>
