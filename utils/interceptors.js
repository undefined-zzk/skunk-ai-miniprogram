export const initRouterInterceptor = () => {
	uni.addInterceptor("reLaunch", {
		invoke(args) {},
		success(res) {}
	})
}