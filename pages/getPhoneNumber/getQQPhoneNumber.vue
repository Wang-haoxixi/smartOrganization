<template>
	<view>
		<view class="item" style="margin-top: 80rpx;">
			<image v-if="oss" :src="oss+'icon_phone.png'" class="icon"></image>
			<input placeholder="请输入手机号码" maxlength="11" v-model="data.mobile" type="number" placeholder-class="inputDefault" />
		</view>
		<view class="item">
			<image v-if="oss" :src="oss+'icon_key.png'" class="icon"></image>
			<input placeholder="请输入验证码" maxlength="4" v-model="data.smsCode" type="number" placeholder-class="inputDefault" />
			<view v-if="verificationShow" class="verification" @tap="getVerification">获取验证码</view>
			<view v-if="!verificationShow" class="verification">{{time}}
				<text class="color_666769">秒后重试</text></view>
		</view>
		<view class="button" @tap="login">登录</view>
		<view class="color_919397 remind">
			登录代表您已同意我能
			<text class="color_F74437" @tap="agreement">《用户协议》</text>
			和
			<text class="color_F74437" @tap="privacy">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
	import {
		getPhoneNumber
	} from '@/common/login.js';
	export default {
		data() {
			return {
				data: {
					mobile: '',
					smsCode: ''
				},
				oss: '',
				verificationShow: true,
				time: 60
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		methods: {
			login() {
				if (this.data.mobile.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					})
				} else if (this.data.mobile.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号格式不正确'
					})
				} else if (this.data.smsCode.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					})
				} else if (this.data.smsCode.length != 4) {
					uni.showToast({
						icon: 'none',
						title: '验证码不正确'
					})
				} else {
					getPhoneNumber(this.data);
				}
			},
			agreement() {
				uni.navigateTo({
					url: '../webView/webView?type=agreement'
				})
			},
			privacy() {
				uni.navigateTo({
					url: '../webView/webView?type=privacy'
				})
			},
			getVerification() {
				let that = this;
				if (that.data.mobile.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入手机号'
					})
				} else if (that.data.mobile.length != 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号格式不正确'
					})
				} else {
					that.$http.get('admin/mobile/' + that.data.mobile).then(res => {
						if (res.data.code != 0) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							that.time = 60;
							that.verificationShow = false;
							let timer = setInterval(function() {
								that.time = that.time - 1;
								console.log(that.time)
								if (that.time < 1) {
									clearInterval(timer);
									that.verificationShow = true;
								}
							}, 1000);
						}

					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.inputDefault {
		color: $text-color-secondary;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
	}

	input {
		flex: 1;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #666769;
	}

	.button {
		margin-top: 40rpx;
		width: 670rpx;
		margin-left: 40rpx;
	}

	.item {
		padding: 24rpx 0;
		margin: 0 40rpx;
		border-bottom: #EFF0F1 solid 1rpx;
		display: flex;
		align-items: center;

		.icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}

		.verification {
			color: #F74437;
			font-size: 28rpx;
			line-height: 40rpx;
			align-self: flex-end;
		}
	}

	.remind {
		align-self: flex-start;
		margin-left: 40rpx;
		margin-top: 40rpx;
		font-size: 24rpx;
		line-height: 34rpx;
	}
</style>
