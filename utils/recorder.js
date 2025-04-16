export const recorderAuthorize = () => {
	return new Promise((resolve) => {
		uni.authorize({
			scope: 'scope.record',
			success(res) {
				resolve(true)
			},
			fail(err) {
				console.log('err', err);
				uni.showModal({
					title: '授权提示',
					content: '我们需要获取您的录音权限以提供更好的服务，是否授权？',
					success(res) {
						if (res.confirm) {
							uni.openSetting({
								success(res) {
									if (res.authSetting['scope.record']) {
										uni.showToast({
											title: '录音授权成功'
										});
									}
								}
							});
						}
					}
				});
			}
		});
	})
};