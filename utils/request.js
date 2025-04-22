export const request = (url, method, data = {}) => {
	return new Promise((resolve, reject) => {
		if (!method) {
			method = 'GET'
		}
		const requestTask = uni.request({
			url: `https://api.deepseek.com/v1${url}`,
			method,
			header: {
				'Content-Type': 'application/json',
				Authorization: `Bearer sk-921c241153c243e1956e7481787861f9`
			},
			data,
			timeout: 60000,
			success(res) {
				resolve({
					data: res.data,
					requestTask
				})
			},
			fail(err) {
				reject(err)
			}
		})
	})
}