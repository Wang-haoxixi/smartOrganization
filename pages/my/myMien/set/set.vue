<template>
	<view class="set" >
		<view class="list">
			<view class="list-item" @tap='cancelAttention' v-if="userInfo.isFollow" >
				<view class="cancelAttention">
					取消关注
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap='delFriend' v-if="userInfo.isFriend">
				<view class="delFriend">
					删除好友
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {}, //用户信息
			};
		},
		onLoad(opt) {
			let userInfo = JSON.parse(opt.userInfo)
			console.log(userInfo)
			this.userInfo = userInfo
		},
		methods: {
			// 取消关注
			cancelAttention() {
				let that = this
				uni.showModal({
					content: '取消关注后，将不会在个人列表中出现该用户，是否放弃取消？',
					cancelText: '确定',
					cancelColor: '#3CC51F',
					confirmText: '取消关注',
					confirmColor: '#919397',
					success: function(res) {
						if (res.confirm) {
							that.$http.post('admin/follow/user', {
								followId: that.userInfo.userId, //关注对象的ID
								sign: 1, //关注标记(0-关注;1-取消关注)
								type: 1, //关注类型(1-用户；2-组织；3-话题)
								userId: uni.getStorageSync('user').userId //账号ID
							}).then(res => {
								uni.navigateBack();
							})
							
						} else if (res.cancel) {
						}
					},
					complete:function(res){
						console.log('complete',res)
					}
				});
			},
			// 删除好友
			delFriend() {
				let that = this
				uni.showModal({
					content: '删除好友后，将不会在个人列表中出现该用户，是否放弃删除？',
					cancelText: '确定',
					cancelColor: '#3CC51F',
					confirmText: '删除好友',
					confirmColor: '#919397',
					success: function(res) {
						if (res.confirm) {
							that.$http.get('/admin/friend/delete/' + that.userInfo.userId).then(res => {
								uni.navigateBack();
							})
							
						} else if (res.cancel) {
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.set {
		// width: 100%;
		// height: 100%;
		// padding: 0 40rpx;

		.list-item ::after {
			content: " ";
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background: #EFF0F1;
			transform: scaleY(0.5);
		}

		.list {
			padding: 0rpx $spacing-xxl;
			background-color: $color-white;

			.list-item {
				position: relative;
				padding: $spacing-xl 0rpx;
				// border-bottom: 2rpx solid $border-color;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: $text-color-primary;
				font-size: $font-size-base;
				line-height: $line-height-size-base;

				.rightImg {
					margin-right: -$spacing-base;
				}
			}
		}
	}
</style>
