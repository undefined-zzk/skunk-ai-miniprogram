import dayjs from 'dayjs'
import {
	config
} from '@/static/config'
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
	if (day < 1) {
		return config.TIME.today
	} else if (day >= 1 && day < 3) {
		return config.TIME.recent
	} else if (day >= 3 && day < 7) {
		return config.TIME.weeks
	} else {
		return config.TIME.long
	}
}