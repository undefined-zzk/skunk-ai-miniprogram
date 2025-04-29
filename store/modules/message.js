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
	const startRender = ref(false)
	// 重新编辑的数据，是重新生成的判断依据
	const editMsg = ref({})
	// 当前对话内容是否正在生成中
	const processLoading = ref(false)
	// 当前对话是否是重新生成
	const refreshCreate = ref(false)
	const cacheKey = JSON.parse(uni.getStorageSync(CACHEKEY) || '{}').currentKey;
	const cahceMsgObjInitData = JSON.parse(uni.getStorageSync(CACHEKEY) || '[]').cacheMsgObj
	// 每次对话最多30次
	const everyMaxLen = ref(30)
	// 时间对象key
	const currentKey = ref(cacheKey || Date.now())
	// 所有的对话列表 以对话时间为key,内容为value 
	const cacheMsgObj = ref(cahceMsgObjInitData || [])
	// 当前对话内容
	const data = cacheMsgObj.value.find(item => item.time === currentKey.value)
	const currentMsgList = ref(data?.list || [])
	// 所有对话内容是否为空
	const cacheMsgIsEmpty = computed(() => {
		return cacheMsgObj.value.length == 0
	})
	// 当前对话内容是否为空
	const currentMsgIsEmpty = computed(() => {
		return currentMsgList.value.length == 0
	})
	// 当前对话已对话的次数
	const currentMsgLength = computed(() => {
		const item = cacheMsgObj.value.find(item => item.time === currentKey.value)
		return item?.maxLen || 0
	})
	// 修改存储对话内容
	const setCacheMsgObj = (key = currentKey.value, list = []) => {
		const obj = {
			time: key,
			maxLen: list.length,
			list,
			asideTitle: ''
		}
		const result = cacheMsgObj.value.find(item => item.time === key)
		const index = cacheMsgObj.value.findIndex(item => item.time === key)
		if (!result) {
			cacheMsgObj.value.push(obj)
		} else {
			cacheMsgObj.value.fill({
				...obj,
				asideTitle: result.asideTitle
			}, index, index + 1)
		}
		cacheMsgObj.value = cacheMsgObj.value.filter(item => item.list.length > 0)
	}
	// 删除存储对话内容
	const removeCacheMsgObj = (key) => {
		cacheMsgObj.value = cacheMsgObj.value.filter(item => item.time !== key)
	}
	// 根据索引删除存储对话内容
	const removeCacheMsgObjByIndex = (start, end) => {
		if (start && end) {
			cacheMsgObj.value.splice(start, end)
		} else {
			cacheMsgObj.value.splice(start)
		}
	}
	// 修改当前对话内容
	const updateCurrentMsgList = (time) => {
		currentMsgList.value = cacheMsgObj.value.find(item => item.time === time)?.list || []
	}
	// 更新key
	const updateCurrentMsgListKey = (oldKey, newKey) => {
		const item = cacheMsgObj.value.find(item => item.time === oldKey)
		if (item) {
			item.time = newKey
		}
	}
	return {
		processLoading,
		currentMsgList,
		currentMsgIsEmpty,
		cacheMsgObj,
		cacheMsgIsEmpty,
		currentKey,
		setCacheMsgObj,
		currentMsgLength,
		everyMaxLen,
		removeCacheMsgObj,
		removeCacheMsgObjByIndex,
		updateCurrentMsgList,
		updateCurrentMsgListKey,
		editMsg,
		refreshCreate,
		startRender
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