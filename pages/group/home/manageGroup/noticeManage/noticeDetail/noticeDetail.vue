<template>
	<view class="container">
		<view class="title">
			{{$isEmpty(noticeDetail.title)?'':noticeDetail.title}}
		</view>
		<view class="time">
			{{$isEmpty(noticeDetail.createTime)?'':noticeDetail.createTime}}
		</view>
		<view class="content">
			{{$isEmpty(noticeDetail.content)?'':noticeDetail.content}}
		</view>
		<view class="images" v-for="(item,index) of noticeDetail.imgUrlList" :key="index">
			<image class="img" :src="item" mode="aspectFill" @tap.stop="previewImage(noticeDetail.imgUrlList,index)"></image>
		</view>
		<view class="so-content-link" v-if="!$isEmpty(noticeDetail.targetName)" @tap="goRelevanceDetails">
			<view class="so-content-link-Wrap" @tap="goRelevanceDetails">
				<view class="linkImg">
					<image class="icon-xs" :src="$ossUrl('icon_newLink.png')" mode=""></image>
				</view>
				<view class="so-content-link-title singleEllipsis">
					{{noticeDetail.targetName}}
				</view>
				<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import{
		previewImage
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				noticeDetail:{}
			};
		},
		onLoad(options) {
			this.id =options.id
			this.$http.get('admin/applets/so/get_news/' + this.id).then(res=>{
				this.noticeDetail=res.data.data
				this.noticeDetail.createTime= this.noticeDetail.createTime.split(' ')[0]
			})
		},
		methods:{
			previewImage,
			goRelevanceDetails() {
				// console.log('关联信息', attach)
				this.$http.get('/admin/smart_groups/link/path', {
					params: {
						type: this.noticeDetail.targetType, //材料：material；活动：activity；魔方：products；文章：article
						id: this.noticeDetail.targetId, //关联id
					}
				}).then(res => {
					console.log('关联成功', res)
					// 打开另一个小程序。
					uni.navigateToMiniProgram({
						appId: res.data.data.appId,
						path: res.data.data.path,
						success(res) {
							console.log('打开成功', res)
						}
					})
			
				})
			},
		}
	}
</script>

<style lang="scss">
	.so-content-link{
		// margin-top: $spacing-lg;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: $font-size-xxs;
		line-height: $line-height-size-xxs;
		color: $text-color-regular;
		.so-content-link-Wrap{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 6rpx 0rpx 6rpx 6rpx;
			background-color: $bg-color-primary;
			border-radius: $border-radius-xl;
			.linkImg{
				background-color: #EFF0F1;
				margin-right: 8rpx;		
				border-radius: 28rpx;
				padding: 6rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.so-content-link-title{
				max-width: 468rpx;
				// margin-left: 14rpx;
				margin-right: $spacing-xs;
			}
		}
	}
.container{
	padding: $spacing-xxl;
}
.title{
	color: $text-color-primary;
	font-size: $font-size-base;
	line-height: $line-height-size-sm;
	margin-bottom: $spacing-lg;
}
.time{
	color: $text-color-placeholder;
	font-size: $font-size-xxs;
	line-height:$line-height-size-xxs ;
	margin-bottom: $spacing-lg;
}
.content{
	color: $text-color-regular;
	font-size:$font-size-sm ;
	line-height: $line-height-size-lg;
	margin-bottom: $spacing-lg;
}
.img{
	width: 100%;
	border-radius: $border-radius-base;
	margin-bottom: $spacing-lg;
}
</style>
