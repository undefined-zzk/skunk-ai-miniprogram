import {
	defineStore
} from 'pinia'
import {
	ref,
	computed
} from 'vue'
// 存储key名
const CACHEKEY = 'skunk-message'
export const useMessageStore = defineStore('message', () => {
	const cacheKey = JSON.parse(uni.getStorageSync(CACHEKEY) || '{}').currentKey;
	const cahceMsgObjInitData = JSON.parse(uni.getStorageSync(CACHEKEY) || '{}').cacheMsgObj
	// 每次对话最多30次
	const everyMaxLen = ref(30)
	// 时间对象key
	const currentKey = ref(cacheKey || Date.now())
	// 所有的对话列表 以对话时间为key,内容为value {'2025-04-16 09:56:00':[{}],maxLen:10}
	const cacheMsgObj = ref(cahceMsgObjInitData || {})
	// 当前对话内容
	const currentMsgList = ref(cacheMsgObj.value[currentKey.value] || [])
	// 所有对话内容是否为空
	const cacheMsgIsEmpty = computed(() => {
		return Object.keys(cacheMsgObj.value).length == 0
	})
	// 当前对话内容是否为空
	const currentMsgIsEmpty = computed(() => {
		return currentMsgList.value.length == 0
	})
	// 当前对话已对话的次数
	const currentMsgLength = computed(() => {
		return cacheMsgObj.value['maxLen']
	})
	// 修改存储对话内容
	const setCacheMsgObj = (key = currentKey.value, list = []) => {
		cacheMsgObj.value[key] = list
		cacheMsgObj.value['maxLen'] = list.length
	}
	return {
		currentMsgList,
		currentMsgIsEmpty,
		cacheMsgObj,
		cacheMsgIsEmpty,
		currentKey,
		setCacheMsgObj,
		currentMsgLength,
		everyMaxLen
	}
}, {
	persist: {
		key: CACHEKEY,
		pick: ['cacheMsgObj', 'currentKey'],
		storage: {
			setItem: (key, value) => uni.setStorageSync(key, value),
			getItem: (key) => uni.getStorageSync(key),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	}
})