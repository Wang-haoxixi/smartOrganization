<template>
	<view>
		<uni-popup type="bottom" ref="showModal">
			<view class="safe-bottom">
				<view class="content">
					<!-- <image src="https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_createShare.png" mode="aspectFit" class="modalImg"></image> -->
					<image src="https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_createShare.png" mode="aspectFit" class="modalImg"></image>
					<view class="name">
						{{name}}邀请你加入群组
					</view>
					<view class="btns">
						<view class="cancelBtn" @tap="cancel">
							不加入
						</view>
						<view class="confirmBtn" @tap="confirm">
							加入
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shareId: '',
				name: '',
				orgName: ''
			};
		},
		onLoad(options) {
			this.shareId = options.id
			let that = this
			that.$http.get('admin/smart_groups/share/create/info?shareId=' + that.shareId).then(res => {
				console.log(res)
				if (res.data.code == 0) {
					that.name = res.data.data.userName
					console.log(that.name)
					that.orgName = res.data.data.orgName
					uni.setNavigationBarTitle({
						title: that.orgName
					})
				} else {
					uni.showToast({
						title: res.data.message,
						icon: "none",
						duration: 1000,
						success: () => {
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/community/home/home'
								})
							}, 1000)
						}
					})
				}
			})
			this.$refs.showModal.open()
		},
		methods: {
			cancel() {
				uni.navigateTo({
					url: '/pages/community/home/home'
				})
			},
			confirm() {
				this.$http.get('admin/smart_groups/share/create/join?shareId=' + this.shareId).then(res => {
					if (res.data.code == 0) {
						uni.redirectTo({
							url: `/pages/group/home/home?id=${res.data.data}`
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/community/home/home'
									})
								}, 1000)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.btns {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 32rpx;
		line-height: 44rpx;
		font-weight: bold;

		.cancelBtn {
			margin-right: 24rpx;
			background-color: #FFFFFF;
			color: #FA5151;
			padding: 22rpx 64rpx;
			border-radius: 20rpx;
		}

		.confirmBtn {
			background-color: #07C160;
			color: #FFFFFF;
			padding: 22rpx 80rpx;
			border-radius: 20rpx;
		}
	}

	.content {
		background-color: #F4F5F6;
		padding: 80rpx 0rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.modalImg {
		width: 460rpx;
		height: 368rpx;
		margin-bottom: 48rpx;
	}

	.name {
		color: #303031;
		font-size: 30rpx;
		line-height: 42rpx;
		margin-bottom: 80rpx;
	}
</style>
