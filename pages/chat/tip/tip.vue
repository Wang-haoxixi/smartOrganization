<template>
	<view class="safe-bottom">
		<view class="container">
			<view v-for="(item,index) in data.records" :key="index">
				<view class="time">
					{{item.time}}
				</view>
				<view class="container-item">
					<view class="title">
						<image :src="item.senderAvatar" class="title-icon"></image>
						<view class="title-text singleEllipsis">
							{{item.title}}
						</view>
					</view>
					<view class="content">
						<!-- <image :src="item.senderAvatar" class="avatar-icon"></image> -->
						<view class="content-text">
							{{item.text}}
						</view>
					</view>
					<view class="detail" @tap="deal(item)" v-if="isDeal(item)">
						<view class="detail-text">
							查看详情
						</view>
						<image :src="$ossUrl('icon_right.png')" class="right-icon"></image>
					</view>
				</view>
			</view>
			<uni-load-more :status="tipMore" v-if="data.records.length>=10"></uni-load-more>
			<view class="defalt-text" v-if="!data.records.length>0">
				暂无待处理消息
			</view>
		</view>
		<!-- <view class="container">
			<view v-for="(item,index) in data.records" :key="index" @tap="deal(item)">
				<view class="container-item">
					<view class="time">
						{{item.time}}
					</view>
					<view class="content">
						<image :src="item.senderAvatar" class="avatar-icon"></image>
						<view class="content-text">
							{{item.title}}
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="tipMore" v-if="data.records.length>=10"></uni-load-more>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {
					records: [],
					tipMore: 'more'
				}
			};
		},
		methods: {
			setMessageRead() {
				let promise = this.$tim.setMessageRead({
					conversationID: "C2CTIP"
				});
				promise.then(function(imResponse) {
					// 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
				}).catch(function(imError) {
					// 已读上报失败
					console.warn('setMessageRead error:', imError);
				});
			},
			isDeal(item){
				switch (item.type) {
					case 10099: //收到点赞
					case 10095: //收到回复
					case 10094: //回复别人的评论被点赞
					case 10096: //说说回复
					case 10098: //收到转发
					case 10100: //被@
						return true;
						break;
					case 10053: //创建SO成功
					case 10080: //成功加入SO
					case 10055: //同意加入SO
					case 10070: //设为管理员
					case 10116: //转让SO
					case 10069: //撤销管理员
					case 10102: //邀请加SO
						return true;
						break;
					return false;
				}
			},
			deal(item) {
				if (item.dataId > 0) {
					switch (item.type) {
						case 10099: //收到点赞
						case 10095: //收到回复
						case 10094: //回复别人的评论被点赞
						case 10096: //说说回复
						case 10098: //收到转发
						case 10100: //被@
							uni.navigateTo({
								url: '/pages/community/home/thoughtsDetails/thoughtsDetails?id=' + item.dataId
							});
							break;
						case 10053: //创建SO成功
						case 10080: //成功加入SO
						case 10055: //同意加入SO
						case 10070: //设为管理员
						case 10116: //转让SO
						case 10069: //撤销管理员
						case 10102: //邀请加SO
							uni.navigateTo({
								url: '/pages/group/home/home?id=' + item.dataId
							});
							break;
					}
				}
			}
		},
		onShow() {
			this.$http.get('ims/app/sys_msg/page', {
				params: {
					id: 10035
				}
			}).then(res => {
				this.data = res.data.data;
			})
		},
		onUnload() {
			this.setMessageRead()
		},
		onReachBottom() {
			if (this.data.current < this.data.pages) {
				this.$http.get('ims/app/sys_msg/page', {
					params: {
						id: 10035,
						current: this.data.current + 1
					}
				}).then(res => {
					this.data.current = res.data.data.current
					if (this.data.current < this.data.pages) {
						this.tipMore = 'more'
					} else {
						this.tipMore = "noMore"
					}
					this.data.records = this.data.records.concat(res.data.data.records.map(item => {
						return {
							...item,
							status: false
						}
					}))
				})
			}
		},
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
			max-width: 610rpx;
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
	
		.avatar-icon {
			width: 56rpx;
			height: 56rpx;
			border-radius: 16rpx;
		}
	
		.content-text {
			color: #303031;
			font-size: 30rpx;
			line-height: 44rpx;
		}
	}
	
	.detail {
		border-top: 1px #EFF0F1 solid;
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
