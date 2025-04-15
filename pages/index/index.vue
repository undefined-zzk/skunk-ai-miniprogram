<template>
	<view class="content">
		<custom-navbar title="SkunkAI"></custom-navbar>
		<navigator url="/pages/login/login">去登s录</navigator>
	</view>
</template>

<script setup>
import { useAuth } from '../../composables/useAuth';
useAuth();
onShow(() => {
	console.log('onShow');
});
</script>

<style lang="scss" scoped></style>
