import {
	timeIsThanXDayAgo
} from './time'
import {
	storeToRefs
} from 'pinia'
import {
	useMessageStore
} from '@/store/modules/message'
import {
	showErrorToast
} from './toast'

const messageStore = useMessageStore()

// 会话内容存储key
const CacheKey = 'skunk-message'
// 当内存超过9MB和七天之外的对话的时候进行清理内存中的一部分
export const storageClearIfNeeded = (maxSize = 1024 * 9) => {
	const {
		currentSize,
		keys,
		limitSize
	} = wx.getStorageInfoSync();
	if (keys.includes(CacheKey)) {
		try {
			const cacheObj = uni.getStorageSync(CacheKey);
			const jsonObj = JSON.parse(cacheObj)
			// 如果当前使用内存已到达9MB
			if (currentSize >= maxSize) {
				// 数据长度除以一半向下取整
				const startIndex = Math.floor(jsonObj.cacheMsgObj.length / 2)
				messageStore.removeCacheMsgObjByIndex(startIndex)
			} else {
				// 清除大于7天之外的会话
				for (let item of jsonObj.cacheMsgObj) {
					if (timeIsThanXDayAgo(item.time, 7)) {
						messageStore.removeCacheMsgObj(item.time)
					}
				}
			}
		} catch (err) {
			showErrorToast(err)
		}
	}
}

// 内存使用率
export const storageUseAgeRate = () => {
	const {
		currentSize,
		limitSize
	} = wx.getStorageInfoSync();
	return Math.round(currentSize / limitSize) * 100 + '%'
}