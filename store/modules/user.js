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
	const remeber = ref(false)
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
		remeber
	}
}, {
	persist: {
		key: 'skunk-user',
		pick: ['userinfo', 'skunkToken', 'remeber'],
		storage: {
			setItem: (key, value) => uni.setStorageSync(key, value),
			getItem: (key) => uni.getStorageSync(key),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	}
})