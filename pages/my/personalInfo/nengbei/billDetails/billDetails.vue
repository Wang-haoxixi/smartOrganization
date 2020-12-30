<template>
	<view class="page">
		<image class="avatar" :src="data.avatar"></image>
		<view class="name">{{$isEmpty(data.realName)?'':data.realName}}</view>
		<view v-if="data.type == 'A'" class="money">
			+{{$isEmpty(data.amount)?'':data.amount}}<text class="gray">贝</text>
		</view>
		<view v-if="data.type == 'L'" class="money">
			-{{$isEmpty(data.amount)?'':data.amount}}<text class="gray">贝</text>
		</view>
		<view class="list">
			<view class="list-title">交易类型</view>
			<view class="list-content">{{$isEmpty(data.category)?'':data.category}}</view>
		</view>
		<view class="list">
			<view class="list-title">转账备注</view>
			<view class="list-content">{{$isEmpty(data.remarks)?'':data.remarks}}</view>
		</view>
		<view class="list">
			<view class="list-title">创建时间</view>
			<view class="list-content">{{$isEmpty(data.createTime)?'':data.createTime}}</view>
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
		onLoad(option) {
			this.$http.get('fms/flow/' + option.id).then(res => {
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx;

		.avatar {
			width: 136rpx;
			height: 136rpx;
		}

		.name {
			font-weight: bold;
			color: #303031;
			font-size: 28rpx;
			line-height: 40rpx;
			margin-top: 20rpx;
		}

		.money {
			margin-top: 40rpx;
			color: #303031;
			font-size: 76rpx;
			line-height: 90rpx;
			font-weight: bold;
			margin-bottom: 60rpx;
			.gray{
				color: #919397;
				font-size: 28rpx;
				line-height: 48rpx;
			}
		}

		.list {
			width: 670rpx;
			padding: 24rpx 0;
			border-bottom: 0.3rpx solid #EFF0F1;
			display: flex;
			justify-content: space-between;

			.list-title {
				color: #303031;
				font-size: 28rpx;
				line-height: 40rpx;
				font-weight: bold;
			}

			.list-content {
				text-align: right;
				width: 500rpx;
				color: #919397;
				font-size: 28rpx;
				line-height: 48rpx;
			}
		}
	}
</style>
