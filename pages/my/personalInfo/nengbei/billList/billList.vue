<template>
	<scroll-view class="scroll" scroll-y="true">
		<view @tap="goDetail(item)" v-for="(item, index) in data.records" :key="index" class="item">
			<image lazy-load="true" class="avatar" mode="aspectFill" :src="item.avatar"></image>
			<view class="content">
				<view class="name singleEllipsis">{{$isEmpty(item.remarks)?'':item.remarks}}</view>
				<view class="time">{{$isEmpty(item.createTime)?'':item.createTime}}</view>
			</view>
			<view v-if="item.type == 'A'" class="money color_F74437">
				+{{$isEmpty(item.amount)?'':item.amount}}
			</view>
			<view v-if="item.type == 'L'" class="money color_919397">
				-{{$isEmpty(item.amount)?'':item.amount}}
			</view>
		</view>
		<view class="noMsg" v-if="!data.records.length > 0">
			暂无账单
		</view>
		<uni-load-more :status="moreStatus" v-if="data.records.length > 0"></uni-load-more>
	</scroll-view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				data: '',
				moreStatus: 'more',
			};
		},
		onReachBottom() {
			let that = this;
			if (that.data.current < that.data.pages) {
				that.moreStatus = 'loading';
				that.$http.get('fms/app/red/flow/page', {
					params: {
						size:20,
						current: that.data.current + 1
					}
				}).then(res => {
					that.data.current = res.data.data.current;
					res.data.data.records.forEach(item => {
						item.avatar = imageError(item.avatar, that.oss)
					})
					that.data.records = that.data.records.concat(res.data.data.records);
					that.moreStatus = 'more';
				});
			} else {
				that.moreStatus = 'noMore';
			}
		},
		methods: {
			goDetail(item) {
				uni.navigateTo({
					url: '/pages/my/personalInfo/nengbei/billDetails/billDetails?id=' + item.id
				})
			}
		},
		onLoad() {
			this.oss = this.$oss;
			this.$http.get('fms/app/red/flow/page', {
				params: {
					size:20,
					current: 1
				}
			}).then(res => {
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
	.scroll {
		height: 100%;
		@extend %safe-bottom;
	}

	.item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		margin: 0 40rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.avatar {
			width: 76rpx;
			height: 76rpx;
		}

		.content {
			margin-left: 20rpx;

			.name {
				color: #303031;
				font-size: 28rpx;
				line-height: 40rpx;
				width: 340rpx;
			}

			.time {
				color: #919397;
				font-size: 22rpx;
				line-height: 32rpx;
			}
		}

		.money {
			font-weight: bold;
			flex: 1;
			text-align: right;
			font-size: 28rpx;
			line-height: 32rpx;
		}
	}

	.noMsg {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		font-weight: 400;
		color: #666769;
	}
</style>
