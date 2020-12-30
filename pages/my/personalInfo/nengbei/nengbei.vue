<template>
	<view class="nengbei">
		<view class="top">
			<text class="balance">余额：</text><text class="num">{{$isEmpty(data.balance) ? '' : data.balance}}</text>
		</view>

		<view class="item" v-for="(item,index) in list" :key='index' @tap="navigateTo(item.id)">
			<view class="item-left">
				<image :src="$ossUrl(item.img_item)" class="img_item"></image>
				<text class="item-title">{{item['item-title']}}</text>
			</view>
			<view class="item-right">
				<text class="item-text">{{item['item-text']}}</text>
				<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					// {
					// 	id: 1,
					// 	img_item: 'icon_smartOrganization_transferAcc.png',
					// 	"item-title": '转账',
					// 	"item-text": '给好友转账',
					// },
					// {
					// 	id: 2,
					// 	img_item: 'icon_smartOrganization_redPacket.png',
					// 	"item-title": '红包',
					// 	"item-text": '发红包',
					// },
					{
						id: 3,
						img_item: 'icon_smartOrganization_bill.png',
						"item-title": '账单',
						"item-text": '查看所有账单',
					},
				],

				data: '',
			};
		},

		methods: {
			navigateTo(id) {
				console.log(id)
				if (id == 1) {

				} else if (id == 2) {

				} else if (id == 3) {
					uni.navigateTo({
						url: '/pages/my/personalInfo/nengbei/billList/billList'
					});
				}
			}
		},

		onLoad() {
			this.$http.get('fms/app/red/account').then(res => {
				console.log(res)
				this.data = res.data.data;
			});
		}
	}
</script>

<style lang="scss">
	.nengbei {
		padding: 40rpx;

		.top {
			height: 136rpx;
			background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_my_nengbei.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			color: #FFFFFF;
			text-align: right;
			line-height: 136rpx;
			padding-right: 40rpx;
			margin-bottom: 50rpx;

			.balance {
				font-size: 28rpx;
				font-weight: 400;
			}

			.num {
				font-size: 36rpx;
				font-weight: bold;
			}
		}

		.item {
			height: 112rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid #F4F4F4;

			.item-left {
				display: flex;
				justify-content: center;
				align-items: center;

				.img_item {
					width: 60rpx;
					height: 60rpx;
					margin-right: 20rpx;
				}

				.item-title {
					font-size: 30rpx;
					font-weight: 400;
					color: #303031;
				}
			}

			.item-right {
				display: flex;
				justify-content: center;
				align-items: center;

				.item-text {
					font-size: 30rpx;
					font-weight: 400;
					color: #919397;
					margin-right: 10rpx;
				}

				.img_arrow {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}
	}
</style>
