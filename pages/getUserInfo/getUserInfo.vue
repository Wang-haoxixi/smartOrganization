<template>
	<view class="container">
		<image v-if="oss" class="loginImg" :src="$ossUrl('pic_woneng.png')"></image>
		<view class="slogan">我能成就知识网红</view>
		<view class="title"><text>该程序需获得以下授权
				获取您的公开信息（昵称、头像等）</text></view>
		<view class="button-list">
			<view class="button back" @tap="back">
				拒绝
			</view>
			<button class="button author" open-type="getUserInfo" @getuserinfo="decryptUserInfo">
				允许
			</button>
		</view>

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
		getUserInfo
	} from '@/common/login.js';
	export default {
		data() {
			return {
				oss: ''
			};
		},
		onLoad() {
			this.oss = this.$oss;
			uni.setStorageSync('isGetUserInfo', true);
		},
		onUnload() {
			uni.setStorageSync('isGetUserInfo', false);
		},
		methods: {
			decryptUserInfo(e) {
				console.log(e);
				getUserInfo();
			},
			back() {
				uni.navigateBack();
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
			margin-top: 300rpx;
			height: 96rpx;
			width: 270rpx;
		}

		.slogan {
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
			margin-top: 60rpx;
		}

		.title {
			width: 100%;
			margin-top: 284rpx;
			align-self: flex-start;
			color: #666769;
			font-size: 28rpx;
			line-height: 48rpx;
			padding-top: 40rpx;
			border-top: 0.3rpx solid #EFF0F1;
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

	.back {
		background: #EFF0F1;
		border-radius: 8px;
		font-weight: 500;
		color: #FA5151;
	}

	.author {
		border-radius: 8px;
		font-weight: 500;
		color: #FFFFFF;
	}

	.button-list {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.button {
		width: 320rpx;
		padding: 4rpx 0;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
	}
</style>
