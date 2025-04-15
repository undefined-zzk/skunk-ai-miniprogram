import {
	onShow
} from '@dcloudio/uni-app'
import {
	storeToRefs
} from 'pinia'
import {
	useUserStore
} from '@/store/modules/user'

export const useAuth = () => {
	const userStore = useUserStore()
	const {
		skunkToken
	} = storeToRefs(userStore)
	onShow(() => {
		if (!skunkToken.value) {
			uni.showToast({
				title: "请重新登录",
				icon: 'error',
				mask: true,
				success() {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			})
		}
	})
}