<template>
	<view class="container">
		<image v-if="oss" class="loginImg" :src="$ossUrl('pic_woneng.png')"></image>
		<button class="button" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">
			手机号注册/登录
		</button>
		<view class="color_919397 remind">
			登录代表您已同意我能
			<text class="tapLook" @tap="agreement">《用户协议》</text>
			和
			<text class="tapLook" @tap="privacy">《隐私政策》</text>
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
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss
		},
		methods: {
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
			decryptPhoneNumber(e) {
				console.log(e)
				getPhoneNumber(e);
			}
		}
	};
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 0 40rpx;

		.loginImg {
			margin-top: 264rpx;
			height: 96rpx;
			width: 270rpx;
		}

		.title {
			font-size: 24rpx;
			line-height: 34rpx;
			margin-top: 256rpx;
		}

		.remind {
			align-self: flex-start;
			margin-top: 40rpx;
			font-size: 24rpx;
			line-height: 34rpx;
		
			.tapLook {
				color: #07C160;
			}
		}
	}

	.wechatImg {
		height: 44rpx;
		width: 44rpx;
	}

	::v-deep button {
		width: 100%;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		margin-top: 268rpx;
	}
</style>
