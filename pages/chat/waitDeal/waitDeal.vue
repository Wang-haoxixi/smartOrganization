<template>
	<view class="safe-bottom">
		<view class="container">
			<view v-for="(item,index) in data" :key="index">
				<view class="time">
					{{item.time}}
				</view>
				<view class="container-item">
					<view class="title">
						<image :src="item.icon" class="title-icon"></image>
						<view class="title-text">
							{{item.typeName}}
						</view>
					</view>
					<view class="content">
						<image :src="item.senderAvatar" class="avatar-icon"></image>
						<view class="content-text">
							{{item.text}}
						</view>
					</view>
					<view class="detail" @tap="detail(item)">
						<view class="detail-text">
							查看详情
						</view>
						<image :src="$ossUrl('icon_right.png')" class="right-icon"></image>
					</view>
				</view>
			</view>
			<view class="defalt-text" v-if="!data.length>0">
				暂无待处理消息
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: []
			};
		},
		methods:{
			detail(item){
				uni.navigateTo({
					url:'detail/detail?id='+item.id +'&title=' + item.typeName
				})
			},
			setMessageRead() {
				let promise = this.$tim.setMessageRead({
					conversationID: "C2CWAIT_DEAL"
				});
				promise.then(function(imResponse) {
					// 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
				}).catch(function(imError) {
					// 已读上报失败
					console.warn('setMessageRead error:', imError);
				});
			}
		},
		onShow() {
			this.$http.get('ims/app/mp/sys_msg/deal/list').then(res => {
				this.data = res.data.data;
			})
		},
		onUnload() {
			this.setMessageRead();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;
	}

	.container {
		padding: 0 16rpx 40rpx;
	}

	.container-item {
		background-color: #FFFFFF;
		border-radius: 16rpx;
	}

	.time {
		color: #919397;
		font-size: 24rpx;
		line-height: 96rpx;
		text-align: center;
	}

	.title {
		padding: 24rpx 24rpx 0;
		display: flex;
		align-items: center;

		.title-icon {
			width: 44rpx;
			height: 44rpx;
		}

		.title-text {
			margin-left: 16rpx;
			color: #666769;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}

	.content {
		padding: 32rpx 0;
		margin: 0 24rpx;
		display: flex;
		align-items: center;
		border-bottom: 1px #EFF0F1 solid;

		.avatar-icon {
			width: 56rpx;
			height: 56rpx;
			border-radius: 16rpx;
		}

		.content-text {
			max-width: 598rpx;
			margin-left: 16rpx;
			color: #303031;
			font-size: 30rpx;
			line-height: 44rpx;
		}
	}

	.detail {
		display: flex;
		align-items: center;
		margin-right: -14rpx;
		justify-content: space-between;
		padding: 24rpx;

		.right-icon {
			width: 44rpx;
			height: 44rpx;
		}

		.detail-text {
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
		}
	}
	.defalt-text {
		text-align: center;
		margin-top: 80rpx;
		color: #666769;
		font-size: 28rpx;
		line-height: 40rpx;
	}
</style>
