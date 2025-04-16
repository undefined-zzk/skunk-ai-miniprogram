<template>
	<view class="content">
		<custom-navbar title="SkunkAI"></custom-navbar>
		<view class="msg-box">
			<div class="empty" v-if="currentMsgIsEmpty">currentMsgIsEmpty</div>
		</view>
	</view>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth';
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/store/modules/message';
useAuth();

const messageStore = useMessageStore();
const { messageList, currentMsgIsEmpty } = storeToRefs(messageStore);
</script>

<style lang="scss" scoped></style>
