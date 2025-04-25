<script setup>
import { useUserStore } from '@/store/modules/user';
import { useMessageStore } from '@/store/modules/message';
import { useAsideStore } from '@/store/modules/aside';
import { storeToRefs } from 'pinia';
import { timeDiffNowDay } from '@/utils/time';
import { config } from '@/static/config';
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
watch(showModal, async (newVal) => {
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
	}
	await nextTick();
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
				question: item.list ? item.list[0]?.question?.slice(0, 100) : '-',
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
</script>
<template>
	<view class="aside-history" v-if="showModal">
		<view class="mask" @click="showModal = false"></view>
		<view class="box" :animation="animation">
			<view class="list-box" :class="{ noData: !hisLen }">
				<view class="list-item" v-if="hisLen" v-for="(item, key) in historyList" :key="key">
					<view class="date">{{ key }}</view>
					<view class="answer-item" @click="changeChat(child.time)" v-for="(child, idx) in item" :key="idx">{{ child.question }}</view>
				</view>
				<view class="empty" v-if="!hisLen">暂无会话</view>
			</view>
			<view class="user" @click="goUserCenter">
				<image :src="userinfo.avatar" mode=""></image>
				<text>{{ userinfo.name }}</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
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
			color: #333;
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
