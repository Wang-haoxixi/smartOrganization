import Request from '@/utils/luch-request/index.js'
import tim from '@/common/tim/tim.js'
import {
	isEmpty
} from '@/common/utils.js'

const http = new Request();
const getUserInfo = () => {
	let that = this;
	let url = '';
	uni.login({
		provider: 'weixin',
		success: function(loginRes) {
			uni.setStorageSync('code', loginRes.code);
			console.log(loginRes);
			uni.getUserInfo({
				provider: 'weixin',
				success: function(infoRes) {
					// #ifdef MP-WEIXIN
					url = 'admin/social/get_mini_user_exist'
					// #endif
					// #ifdef MP-QQ	
					url = 'admin/social/get_qq_user_exist'
					// #endif
					http
						.post(
							url, {}, {
								params: {
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									wxMiniType: 'WXSOMINI',
									code: getCode()
								},
								header: {
									isToken: 'false',
									TENANT_ID: 1,
									Authorization: 'Basic Z2RzOmdkcw=='
								}
							}
						)
						.then(res => {
							if (res.data.data == true) {
								login();
							} else {
								// #ifdef MP-WEIXIN
								uni.redirectTo({
									url: '/pages/getPhoneNumber/getPhoneNumber'
								});
								// #endif
								// #ifdef MP-QQ	
								uni.redirectTo({
									url: '/pages/getPhoneNumber/getQQPhoneNumber'
								});
								// #endif
							}
						})
				},
				fail: function(res) {
					// #ifdef MP-WEIXIN
					uni.redirectTo({
						url: '/pages/getPhoneNumber/getPhoneNumber'
					});
					// #endif
					// #ifdef MP-QQ	
					uni.redirectTo({
						url: '/pages/getPhoneNumber/getQQPhoneNumber'
					});
					// #endif
				}
			});
		}
	});
}
const getPhoneNumber = (userInfo) => {
	let that = this;
	// #ifdef MP-WEIXIN
	http
		.post(
			'admin/social/get_mini_mobile', {}, {
				params: {
					encryptedData: userInfo.detail.encryptedData,
					iv: userInfo.detail.iv,
					wxMiniType: 'WXSOMINI',
					code: getCode()
				},
				header: {
					isToken: 'false',
					TENANT_ID: 1,
					Authorization: 'Basic Z2RzOmdkcw=='
				}
			}
		)
		.then(res => {
			if (res.data.code == 0) {
				login();
			} else {
				uni.redirectTo({
					url: '/pages/getUserInfo/getUserInfo'
				});
			}
		})
	// #endif
	// #ifdef MP-QQ	
	http
		.post(
			'admin/social/get_qq_mobile', {}, {
				params: {
					mobile: userInfo.mobile,
					smsCode: userInfo.smsCode,
					code: getCode()
				},
				header: {
					isToken: 'false',
					TENANT_ID: 1,
					Authorization: 'Basic Z2RzOmdkcw=='
				}
			}
		)
		.then(res => {
			if (res.data.code == 0) {
				login();
			} else {
				uni.showToast({
					icon: 'none',
					title: res.data.message
				})
				// uni.redirectTo({
				// 	url: '/pages/getUserInfo/getUserInfo'
				// });
			}
		})
	// #endif
}

const login = () => {
	let params = {}
	// #ifdef MP-WEIXIN
	params = {
		mobile: 'WXSOMINI@' + getCode(),
		grant_type: 'mobile'
	}
	// #endif
	// #ifdef MP-QQ
	params = {
		mobile: 'QQMINI@' + getCode(),
		grant_type: 'mobile'
	}
	// #endif
	http
		.post(
			'auth/mobile/token/social', {}, {
				params: params,
				header: {
					isToken: 'false',
					TENANT_ID: 1,
					Authorization: 'Basic Z2RzOmdkcw==',
					'Accept-Language': 'zh-CN', //不要删除，后端框架限制必传字段
				}
			}
		)
		.then(res => {
			if (res.data.code == 0) {
				uni.setStorageSync('userinfo', res.data);
				uni.setStorageSync('token', 'Bearer ' + res.data.access_token);
				uni.navigateBack();
				http.get('admin/app/my', {
					header: {
						Authorization: uni.getStorageSync('token')
					}
				}).then(res => {
					uni.setStorageSync('user', res.data.data);
					loginIm();
				});
			} else if (res.data.code == 4001) {
				let phone = res.data.data;
				uni.showModal({
					title: '提示',
					content: '用户账号已被锁定，如有问题请联系客服' + phone,
					success: function(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: phone
							});
						} else if (res.cancel) {

						}
					}
				});
			}
		});
}

const loginIm = () => {
	if (!isEmpty(uni.getStorageSync('token'))) {
		let promise = tim.tim.login({
			userID: uni.getStorageSync('user').userId + '',
			userSig: uni.getStorageSync('user').tengxToken
		});
		promise.then(function(imResponse) {
			console.log(imResponse.data); // 登录成功
			if (imResponse.data.repeatLogin === true) {
				// 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
				console.log(imResponse.data.errorInfo);
			}
		}).catch(function(imError) {
			console.warn('login error:', imError); // 登录失败的相关信息
			uni.navigateTo({
				url: '/pages/getUserInfo/getUserInfo.vue'
			})
		});
	}
}

const getCode = () => {
	let code = '';
	try {
		code = uni.getStorageSync('code')
	} catch (e) {}
	return code
}

export {
	getUserInfo,
	getPhoneNumber,
	getCode,
	login,
	loginIm
}
