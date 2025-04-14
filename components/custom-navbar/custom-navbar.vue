<script setup>
 const props=defineProps({
	 title:{
		 type:String,
		 default:'标题'
	 }
 })
</script>
<template>
 <view class="custom-navbar">
	  <view class="left"></view>
	  <view class="cener">{{title}}</view>
	  <view class="right"></view>
 </view>
</template>

<style lang="scss" scoped>
.custom-navbar{
	padding-top: var(--status-bar-height);
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #EAECEF;
	background-color: $primary-color;
	color: #fff;
}
	
</style>