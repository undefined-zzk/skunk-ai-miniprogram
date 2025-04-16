export const showToast = async (title, options) => {
	return new Promise((resolve) => {
		uni.showToast({
			title,
			icon: 'none',
			mask: true,
			...options,
			complete() {
				setTimeout(() => {
					resolve(true)
				}, 500)
			}
		})
	})
}

export const showSuccessToast = async (title) => {
	await showToast(title, {
		icon: 'success'
	})
}

export const showErrorToast = async (title) => {
	await showToast(title, {
		icon: 'error'
	})
}

export const showLoadingToast = async (title) => {
	uni.showLoading({
		title,
		mask: true
	})
}

export const hideToast = () => {
	uni.hideToast()
	uni.hideLoading()
}