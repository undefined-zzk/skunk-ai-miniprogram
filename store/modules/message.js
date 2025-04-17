import {
	defineStore
} from 'pinia'
import {
	ref,
	computed
} from 'vue'
export const useMessageStore = defineStore('message', () => {
	// 所有的对话列表 以对话时间为key,内容为value {'2025-04-16 09:56:00':[{}]}
	const cacheMsgList = ref({})
	// 当前对话内容
	const currentMsgList = ref([])
	// 所有对话内容是否为空
	const cacheMsgIsEmpty = computed(() => {
		return Object.keys(cacheMsgList.value).length == 0
	})
	// 当前对话内容是否为空
	const currentMsgIsEmpty = computed(() => {
		return currentMsgList.value.length == 0
	})
	return {
		currentMsgList,
		currentMsgIsEmpty,
		cacheMsgList,
		cacheMsgIsEmpty
	}
}, {
	persist: {
		key: "skunk-message",
		pick: ['cacheMsgList'],
		storage: {
			setItem: (key, value) => uni.setStorageSync(key, value),
			getItem: (key) => uni.getStorageSync(key),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	}
})