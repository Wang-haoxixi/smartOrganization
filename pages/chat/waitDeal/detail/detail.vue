<template>
	<view>
		<view class="top">
			<view class="title">
				<image :src="data.avatar" mode="aspectFill" class="avatar"></image>
				<view class="title-right">
					<view class="name">
						{{$isEmpty(data.realName)?'暂无': data.realName}}
					</view>
					<view class="location">
						<image :src="$ossUrl('icon_location.png')" class="location-icon"></image>
						<view class="location-text">
							{{$isEmpty(data.workPlace)?'暂无': data.workPlace}}
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="content-title">
					{{$isEmpty(data.text)?'暂无': data.text}}
				</view>
				<view class="content-text" v-if="data.remarks">
					{{$isEmpty( data.remarks)?'暂无': data.remarks}}
				</view>
			</view>
		</view>
		<view class="introduce" @tap=goCanner>
			<view class="introduce-title">
				个人简介
			</view>
			<view class="introduce-content">
				<view class="introduce-text singleEllipsis">
					{{$isEmpty( data.introduction)?'暂无': data.introduction}}
				</view>
				<image :src="$ossUrl('icon_right.png')" class="icon-right"></image>
			</view>
		</view>
		<view class="button-view">
			<button class="agree button-lg" @tap="reject">拒绝</button>
			<button class="reject button-lg" @tap="agree">同意</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: ''
			};
		},
		methods: {
			goCanner() {
				if (this.data.userId > 0) {
					uni.navigateTo({
						url: '/pages/my/myMien/myMien?userId=' + this.data.userId
					})
				}
			},
			agree() {
				if (this.data.sysInfoId > 0) {
					this.$http.get('ims/sys_msg/pass/' + this.data.sysInfoId).then(res => {
						if (res.data.data == true) {
							uni.showToast({
								title: "操作成功！",
								icon: "none",
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1000)
								}
							})
						}
					})
				}
			},
			reject() {
				if (this.data.sysInfoId > 0) {
					this.$http.get('ims/sys_msg/reject/' + this.data.sysInfoId).then(res => {
						if (res.data.data == true) {
							uni.showToast({
								title: "操作成功！",
								icon: "none",
								success: () => {
									setTimeout(() => {
										uni.navigateBack();
									}, 1000)
								}
							})
						}
					})
				}
			}
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title: option.title
			})
			this.$http.get('ims/app/sys/userinfo', {
				params: {
					id: option.id,
				}
			}).then(res => {
				this.data = res.data.data;
			})
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;
	}

	.top {
		background-color: #FFFFFF;
		padding: 40rpx;
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.avatar {
			width: 120rpx;
			height: 120rpx;
		}

		.title-right {
			flex: 1;
			margin-left: 24rpx;

			.name {
				color: #303031;
				font-size: 36rpx;
				line-height: 44rpx;
			}

			.location {
				margin-top: 12rpx;
				display: flex;
				align-items: center;

				.location-icon {
					width: 32rpx;
					height: 32rpx;
				}

				.location-text {
					margin-left: 4rpx;
					color: #919397;
					font-size: 26rpx;
					line-height: 36rpx;
				}
			}
		}
	}

	.content {
		margin-top: 32rpx;
		padding: 32rpx;
		background-color: #F4F5F6;
		border-radius: 16rpx;

		.content-title {
			color: #303031;
			font-size: 30rpx;
			line-height: 44rpx;
		}

		.content-text {
			margin-top: 24rpx;
			color: #666769;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}

	.introduce {
		background-color: #FFFFFF;
		margin-top: 16rpx;
		display: flex;
		padding: 34rpx 24rpx 34rpx 40rpx;
		font-size: 30rpx;
		line-height: 44rpx;

		.introduce-title {
			color: #303031;

		}

		.introduce-content {
			display: flex;
			margin-left: 48rpx;

			.introduce-text {
				color: #919397;
				width: 470rpx;
				text-align: right;
			}

			.icon-right {
				margin-left: 4rpx;
				width: 44rpx;
				height: 44rpx;
			}
		}
	}

	.button-view {
		display: flex;
		padding: 48rpx 140rpx;

		.agree {
			color: #FA5151;
			background-color: #FFFFFF;
		}

		.reject {
			margin-left: 24rpx;
			color: #FFFFFF;
			background-color: #07C160;
		}
	}
</style>
