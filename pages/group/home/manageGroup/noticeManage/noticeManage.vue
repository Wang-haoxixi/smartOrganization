<template>
	<view class="container">
		<view class="title">
			<view class="title-info">
				所有公告
			</view>
			<view class="title-btn" @tap="addNotice">
				新增公告
			</view>
		</view>
		<view class="" v-if="contenList.records.length>0">
			<view class="content" v-for="(item,index) of contenList.records" :key="index" @tap="selectAction(item,index)">
				<view class="content-title">
					{{$isEmpty(item.title)?'':item.title}}
				</view>
				<view class="content-titme">
					{{$isEmpty(item.createTime)?'':item.createTime.split(' ')[0]}}
				</view>
			</view>
		</view>
		<view class="noContent" v-else>
			暂无公告 
		</view>
		<uni-load-more :status="thoughtsMore" v-if="contenList.records.length>=10"></uni-load-more>
		<view class="safe-bottom" style="height: 60rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				contenList: {
					records:[]
				},
				thoughtsMore:'more'
			};
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.$http.get('admin/applets/so/get_news_page', {
				params: {
					orgId: this.id
				}
			}).then(res => {
				console.log(res)
				this.contenList = res.data.data
				if(this.contenList.current<this.contenList.pages){
					this.thoughtsMore='more'
				}else{
					this.thoughtsMore="noMore"
				}
			})
		},
		onReachBottom() {
			if (this.contenList.current < this.contenList.pages) {
				this.$http.get('admin/applets/so/get_news_page', {
					params: {
						orgId: this.id,
						current: this.contenList.current + 1
					}
				}).then(res => {
					console.log(res)
					this.contenList.current = res.data.data.current
					if(this.contenList.current<this.contenList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore="noMore"
					}
					this.contenList.records = this.contenList.records.concat(res.data.data.records)
				})
			}
		},
		methods: {
			addNotice() {
				uni.navigateTo({
					url: `/pages/group/home/manageGroup/noticeManage/addNotice/addNotice?id=${this.id}&type=0`
				})
			},
			selectAction(item,index) {
				let that = this
				uni.showActionSheet({
					itemList: ['删除', '编辑', '查看'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex == 0) {
							that.$http.post('admin/applets/so/del_news', {
								orgId: that.id,
								ids: [item.id]
							}).then(res => {
								console.log(res)
								if(res.data.code == 1){
									uni.showToast({
										title:res.data.message,
										icon:"none"
									})
								}else{
									that.contenList.records.splice(index,1)
								}
							})
						} else if (res.tapIndex == 1) {
							uni.navigateTo({
								url: `/pages/group/home/manageGroup/noticeManage/addNotice/addNotice?id=${that.id}&type=1&noticeId=${item.id}`
							})
						} else if (res.tapIndex == 2) {
							uni.navigateTo({
								url: `/pages/group/home/manageGroup/noticeManage/noticeDetail/noticeDetail?id=${item.id}`
							})
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.noContent{
		text-align: center;
		margin-top: 80rpx;
		color: #919397;
		font-size: 24rpx;
		line-height: 32rpx;
	}
	page {
		background-color: $bg-color-primary;
	}

	.container {
		.title {
			padding: 22rpx $spacing-xl;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;

			.title-info {
				color: $text-color-placeholder;
			}

			.title-btn {
				background-color: $color-primary;
				color: $color-white;
				padding: 12rpx $spacing-lg;
				border-radius: $border-radius-lg;
				font-weight: bold;
			}
		}

		.content {
			background-color: $color-white;
			border-radius: $border-radius-lg;
			margin: 0rpx $spacing-base $spacing-base;
			padding: $spacing-xl $spacing-lg;

			.content-title {
				// font-family: PingFangSC-Regular, PingFang SC;
				color: $text-color-primary;
				font-size: $font-size-base;
				line-height: $line-height-size-base;
				margin-bottom: $spacing-base;
			}

			.content-titme {
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
				color: $text-color-placeholder;
			}
		}
	}
</style>
