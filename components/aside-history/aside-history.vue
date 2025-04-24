<script setup>
import { useUserStore } from '@/store/modules/user';
import { useMessageStore } from '@/store/modules/message';
import { storeToRefs } from 'pinia';
import { timeDiffNowDay } from '@/utils/time';
const showModal = defineModel({ required: true, default: false, type: Boolean });
const { width, top, right } = uni.getMenuButtonBoundingClientRect();
const { safeArea } = uni.getSystemInfoSync();
const pt = ref(top * 2 + 'rpx');
const wd = ref((safeArea.width - (safeArea.width - right) * 2 - width) * 2 + 'rpx');
const boxh = ref((safeArea.height - 40 - 10) * 2 + 'rpx');
const userStore = useUserStore();
const messageStore = useMessageStore();
const { userinfo } = storeToRefs(userStore);
const { cacheMsgObj } = storeToRefs(messageStore);
const animation = ref(null);
const historyList = computed(() => {
	try {
		const list = cacheMsgObj.value.map((item) => {
			return {
				question: item.list ? item.list[0]?.question?.slice(0, 100) : '-',
				day: timeDiffNowDay(item.time),
				time: item.time
			};
		});
		return groupHistory(list || []);
	} catch (err) {
		console.log('err', err);
	}
});

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

watch(showModal, async (newVal) => {
	const ani = uni.createAnimation({
		duration: 400,
		timingFunction: 'ease-out'
	});
	if (newVal) {
		ani.opacity(1).translateX(0).step();
	} else {
		ani.translateX('-100%').opacity(0).step();
	}
	await nextTick();
	animation.value = ani.export();
});
</script>
<template>
	<view class="aside-history" v-show="showModal">
		<view class="mask" @click="showModal = false"></view>
		<view class="box" :animation="animation">
			<view class="list-box">
				<view class="list-item" v-for="(item, key) in historyList" :key="key">
					<view class="date">{{ key }}</view>
					<view class="answer-item" v-for="(child, idx) in item" :key="idx">{{ child.question }}</view>
				</view>
			</view>
			<view class="user">
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
		.list-item {
			font-size: 26rpx;
			margin-bottom: 40rpx;
			.date {
				color: #878787;
				margin-bottom: 20rpx;
				font-weight: 600;
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
			width: 40rpx;
			height: 40rpx;
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
