<template>
	<view>
		<view class="wrap" v-if="images.length>0" @tap="goDetails">
			<view class="wrapTime">
				<view class="dayTime">
					{{$isEmpty(dayTime)?'':dayTime}}
				</view>
				<view class="monthTime">
					{{$isEmpty(monthTime)?'':monthTime}}月
				</view>
			</view>
			<view class="wrapContent">
				<view class="imgWrap">
					<image class="singleImg" v-if="images.length==1" :src="images[0]" mode="aspectFill"></image>
					<image class="doubleImg" v-if="images.length==2" v-for="(item,index) of images" :key="index" :src="item" mode="aspectFill"></image>
					<image class="multipleImg" v-if="images.length>2 && index<4" v-for="(item,index) of images" :key="index" :src="item" mode="aspectFill"></image>
				</view>
				<view class="content">
					<view class="contentDetails">
						{{$isEmpty(content)?'':content}}
					</view>
					<view class="contenImgNum" v-if="images.length>4">
						共{{$isEmpty(images.length)?'':images.length}}张
					</view>
				</view>
			</view>
		</view>
		<view class="notImgWrap" v-if="images.length==0" @tap="goDetails">
			<view class="wrapTime">
				<view class="dayTime">
					{{$isEmpty(dayTime)?'':dayTime}}
				</view>
				<view class="monthTime">
					{{$isEmpty(monthTime)?'':monthTime}}月
				</view>
			</view>
			<view class="info">
				<view class="info-content">
					{{$isEmpty(content)?'':content}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"soContentItem",
		props:{
			content:{
				type:String,
				default:''
			},
			thoughtsId:{
				type:Number,
				default:0
			},
			images:{
				type:Array,
				default:()=>{
					return []
				}
			},
			monthTime:{
				type:String,
				default:''
			},
			dayTime:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		onReady() {
			// console.log(this.thoughtsId,this.dayTime,this.monthTime)
		},
		methods:{
			goDetails(){
				uni.navigateTo({
					url:`/pages/community/home/thoughtsDetails/thoughtsDetails?id=${this.thoughtsId}`
				})
			}
		}
	}
</script>

<style lang="scss">
.wrap{
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: $spacing-xxl;
	.wrapTime{
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		color: $text-color-primary;
		font-weight: bold;
		.monthTime{
			font-size: $font-size-xxs;
			line-height: 24rpx;
		}
		.dayTime{
			font-size: 56rpx;
			line-height: 56rpx;
		}
	}
	.wrapContent{
		margin-left: 26rpx;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex: 1;
		.imgWrap{
			width: 186rpx;
			height: 186rpx;
			border-radius: $border-radius-base;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			overflow: hidden;
			.singleImg{
				width: 100%;
				height: 100%;
			}
			.doubleImg{
				width: 50%;
				height: 100%;
			}
			.multipleImg{
				width: 50%;
				height: 50%;
			}
		}
		.content{
			flex: 1;
			height: 186rpx;
			word-break: break-all;
			margin-left: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			.contentDetails{
				margin-bottom: $spacing-base;
				display: block;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: $font-size-base;
				line-height: $line-height-size-base;
				color: $text-color-primary;
			}
			.contenImgNum{
				color: $text-color-regular;
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
			}
		}
	}
}
.notImgWrap{
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	margin-bottom: $spacing-xxl;
	.wrapTime{
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		color: $text-color-primary;
		font-weight: bold;
		.monthTime{
			font-size: $font-size-xxs;
			line-height: 24rpx;
		}
		.dayTime{
			font-size: 56rpx;
			line-height: 56rpx;
		}
	}
	.info{
		margin-left: 26rpx;
		flex: 1;
		word-break: break-all;
		background-color: $bg-color-primary;
		border-radius: $border-radius-base;
		padding: $spacing-base;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
		.info-content{
			display: block;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
