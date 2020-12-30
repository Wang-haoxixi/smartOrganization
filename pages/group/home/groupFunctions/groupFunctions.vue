<template>
	<view class="container">
		<view class="content-item" @tap="goMagic">
			<image class="avatarImg" :src="$ossUrl('icon_magicMini.png')" mode=""></image>
			<view class="content-item-wrap">
				<view class="content-item-name">
					魔方商城
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<view class="content-item" @tap="goIcan">
			<image class="avatarImg" :src="$ossUrl('icon_groupHome_ican.png')" mode=""></image>
			<view class="content-item-wrap">
				<view class="content-item-name">
					我能VIP
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<view class="content-item" @tap="goShop">
			<image class="avatarImg" :src="$ossUrl('icon_shopMini.png')" mode=""></image>
			<view class="content-item-wrap">
				<view class="content-item-name">
					爱消费
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<view class="bottomTitle">
			更多功能陆续开放中~
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oss:''
			};
		},
		onLoad() {
			this.oss=this.$oss
		},
		methods:{
			goIcan(){
				uni.navigateToMiniProgram({
				  appId: 'wx59743bba56cec450',
				  path: 'pages/tabbar/ican',
				  extraData: {
				    'data1': 'release'
				  },
				  success(res) {
				    // 打开成功
				  }
				})
			},
			goMagic(){
				uni.navigateToMiniProgram({
				  appId: 'wx37d142564d21bac9',
				  path: 'pages/tabbar/fine',
				  extraData: {
				    'data1': 'release'
				  },
				  success(res) {
				    // 打开成功
				  }
				})
			},
			goShop(){
				uni.navigateToMiniProgram({
				  appId: 'wxcf529e5f1a6ea445',
				  path: 'pages/coupon/index/index',
				  extraData: {
				    'data1': 'release'
				  },
				  success(res) {
				    // 打开成功
				  }
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content-item-wrap ::before{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.bottomTitle{
		font-size: 24rpx;
		line-height: 34rpx;
		text-align: center;
		margin-top:40rpx ;
		color: #919397;
	}
.container{
	padding: $spacing-xl $spacing-xxl;
	.content-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		// border-bottom: 2rpx solid $border-color;
		.avatarImg{
			width: 72rpx;
			height: 72rpx;
		}
		.content-item-wrap{
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			padding: 48rpx 0;
			flex: 1;
			.rightImg{
				margin-right: -$spacing-base;
			}
			.content-item-name{
				flex: 1;
				margin-left: $spacing-lg;
				color: $text-color-primary;
				font-size:$font-size-base ;
				line-height: $line-height-size-base;
			}
		}
	}
}
</style>
