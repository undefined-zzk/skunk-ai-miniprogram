import {
	showSuccessToast,
	showErrorToast
} from './toast'

/**
 * 设置
 */

export const settingLocationAuth = () => {
	uni.openSetting({
		success(settingRes) {
			if (settingRes.authSetting[
					'scope.userLocation']) {
				showSuccessToast('授权成功')
			}
		},
	})
}

/**
 * 位置授权
 */
export const locationAuthorize = () => {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: 'scope.userLocation',
			success() {
				resolve(true)
			},
			fail() {
				uni.showModal({
					title: '授权提示',
					content: '我们需要获取您的位置信息以提供更好的服务，是否授权？',
					success(res) {
						if (res.confirm) {
							uni.openSetting({
								success(settingRes) {
									if (settingRes.authSetting[
											'scope.userLocation']) {
										showSuccessToast('授权成功')
									}
								},
								fail() {
									reject(false)
								}
							});
						}
					}
				});
			}
		})
	})
}

/**
 * 获取经纬度打开地图
 */
export const getLocationOpenMap = () => {
	return new Promise(async (resolve) => {
		const authorize = await locationAuthorize()
		if (authorize) {
			uni.getLocation({
				type: 'wgs84',
				isHighAccuracy: true,
				success(res) {
					const {
						latitude,
						longitude
					} = res;
					uni.chooseLocation({
						latitude,
						longitude,
						success(address) {
							resolve(address)
						}
					});
				},
				fail(err) {
					showErrorToast('请开启定位')
				}
			});
		}
	})
}