<script setup>
onLaunch(() => {
	console.log('App Launch');
});
onShow(() => {
	console.log('App Show');
});
onHide(() => {
	console.log('App Hide');
});
</script>

<style lang="scss">
view,
text,
rich-text {
	box-sizing: border-box;
}
</style>
