// currentSize: 4
// keys: (3) ["skunk-user", "__DC_STAT_UUID", "skunk-message"]
// limitSize: 10240


// 会话内容存储key
const CacheKey = 'skunk-message'
// 当内存超过9MB的时候进行清理内存中的一部分
export const storageClearIfNeeded = (maxSize = 1024 * 9) => {
	const {
		currentSize,
		keys,
		limitSize
	} = wx.getStorageInfoSync();
	if (keys.includes(CacheKey)) {
		const cahcheObj = uni.getStorageSync(CacheKey);
		console.log('cahceObj', JSON.parse(cahcheObj));
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