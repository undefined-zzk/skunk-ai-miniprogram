import {
	showErrorToast,
	showToast
} from "./toast"

export const copySync = (data) => {
	return new Promise((resolve, reject) => {
		uni.setClipboardData({
			data,
			success() {
				resolve(true)
				showToast('内容已复制')
			},
			fail() {
				showErrorToast('复制失败')
				reject(false)
			}
		})
	})
}