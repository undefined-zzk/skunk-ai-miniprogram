import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'
export const useUserStore = defineStore('user', () => {
	const userinfo = ref({
		name: '',
		uuid: '',
		avatar: '',
	})
	const skunkToken = ref('')
	// 退出登录
	const logout = () => {
		userinfo.value = {
			name: '',
			uuid: '',
			avatar: ''
		}
		skunkToken.value = ''
		uni.reLaunch({
			url: '/pages/login/login'
		})
	}
	return {
		userinfo,
		skunkToken,
		logout,
	}
}, {
	persist: {
		key: 'skunk-user',
		pick: ['userinfo', 'skunkToken'],
		storage: {
			setItem: (key, value) => uni.setStorageSync(key, value),
			getItem: (key) => uni.getStorageSync(key),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	}
})