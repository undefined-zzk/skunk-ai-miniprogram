import dayjs from 'dayjs'

// 判断是否是x天及前
export const timeIsThanXDayAgo = (time, day = 7) => {
	const now = dayjs()
	const targetDate = dayjs(time)
	return now.diff(targetDate, 'day') > day
}

// 获取距离今日多少天
export const timeDiffNowDay = (time) => {
	const now = dayjs()
	const targetDate = dayjs(time)
	const day = now.diff(targetDate, 'day')
	if (day <= 1) {
		return '今日'
	} else if (day > 1 && day <= 7) {
		return '7 天内'
	} else {
		return '更久以前'
	}
}