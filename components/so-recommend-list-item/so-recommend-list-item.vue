<template>
	<view class="thoughts" @tap.stop="goDetails">
		<view class="thoughts-header">
			<view class="thoughts-header-info" @tap.stop="goSo">
				<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="avatar-lg avatarImg">
				</image>
				<image v-else :src="avatar" class="avatarImg" @error="avatarError()">
				</image>
				<view class="thoughts-header-info-name singleEllipsis">
					{{$isEmpty(name)?'':name}}
				</view>
				<image v-if="redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
				<image v-if="redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
				<image v-if="redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
				<image v-if="redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
				<image v-if="redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
			</view>
			<image class="icon-sm" :src="$ossUrl('icon_showActions.png')" @tap.stop="showActions()"></image>
			<slot></slot>
		</view>
		<view class="thoughts-content">
			<text class="thoughts-content-name">{{$isEmpty(userName)?'':userName}}:</text>
			<text class="thoughts-content-txt">{{$isEmpty(content)?'':content}}</text>
		</view>
		<view class="thoughts-image" v-if="images.length==1">
			<image class="thoughts-image-single" :src="images[0]" mode="aspectFill" @tap.stop="previewImage(images,0)"></image>
		</view>
		<view class="thoughts-image" v-if="images.length>1">
			<view class="thoughts-image-wrap" v-for="(item,index) of images" :key="index">
				<image class="thoughts-image-multiple" :src="item" mode="aspectFill" @tap.stop="previewImage(images,index)"></image>
			</view>
		</view>
		<view class="so-content-link" v-if="!$isEmpty(attach)">
			<view class="so-content-link-Wrap" @tap.stop="goRelevanceDetails">
				<view class="linkImg">
					<image class="icon-xs" :src="$ossUrl('icon_newLink.png')" mode=""></image>
				</view>
				<view class="so-content-link-title singleEllipsis">
					{{attach.title}}
				</view>
				<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<slot name="actions"></slot>
	</view>
</template>

<script>
	import{
		previewImage
	} from '@/common/utils.js'
	export default {
		name:"soRecommendListItem",
		props:{
			orgId:{
				type:Number,
				default:0
			},
			name:{
				type: String,
				default: ''
			},
			avatar:{
				type: String,
				default: ''
			},
			redness:{
				type:Number,
				default:0
			},
			content: {
				type: String,
				default: '暂无内容'
			},
			time: {
				type: String,
				default: ''
			},
			userName:{
				type: String,
				default: '暂无昵称'
			},
			status:{
				type:Boolean,
				default:false
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
			attach:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data() {
			return {
				defaultAvatar:false
			};
		},
		methods:{
			goSo(){
				uni.navigateTo({
					url:`/pages/group/home/home?id=${this.orgId}`
				})
			},
			goRelevanceDetails() {
				// console.log('关联信息', attach)
				this.$http.get('/admin/smart_groups/link/path', {
					params: {
						type: this.attach.type, //材料：material；活动：activity；魔方：products；文章：article
						id: this.attach.relationId, //关联id
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
			avatarError() {
				this.defaultAvatar = true;
			},
			showActions(){
				this.$emit('showActions')
			},
			goDetails(){
				this.$emit('goDetails')
			},
			previewImage
		}
	}
</script>

<style lang="scss" scoped>
	.so-content-link{
		margin-top: $spacing-lg;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: $font-size-xxs;
		line-height: $line-height-size-xxs;
		color: $text-color-regular;
		padding: 0rpx 24rpx;
		.so-content-link-Wrap{
			display: flex;
			align-items: center;
			justify-content: flex-start;
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
				// display: inline-block;
				margin-left: 14rpx;
				margin-right: $spacing-xs;
			}
		}
	}
.thoughts{
	padding: 24rpx 0rpx;
	background-color: $color-white;
	border-radius: $border-radius-lg;
	margin-bottom: $spacing-base;
}

.thoughts-image{
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding:$spacing-base 20rpx;
	width: 678rpx;
	.thoughts-image-single{
		width: 460rpx;
		height: 344rpx;
		border-radius: $border-radius-base;
	}
	.thoughts-image-wrap{
		width: 226rpx;
		height: 226rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.thoughts-image-multiple{
			width: 218rpx;
			height: 218rpx;
			border-radius: $border-radius-base;
		}
	}
}
.thoughts-content{
	font-size:$font-size-base ;
	line-height:$line-height-size-base ;
	padding: 0rpx 24rpx;
	.thoughts-content-name{
		color: $text-color-regular;
		font-weight: bold;
		font-family:PingFangSC-Medium, 
	}
	.thoughts-content-txt{
		color: $text-color-primary;
		word-break: break-all;
		font-family:PingFang SC;
	}
}
.thoughts-header{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
	position: relative;
	padding: 8rpx 24rpx;
	.thoughts-header-info{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.avatarImg{
			width: 56rpx;
			height: 56rpx;
			border-radius: $border-radius-lg;
		}
		.thoughts-header-info-name{
			max-width: 500rpx;
			margin-left: $spacing-base;
			margin-right: $spacing-xs;
			font-weight: bold;
			font-size: $font-size-lg;
			line-height: $line-height-size-lg;
			color: $text-color-auxiliary;
		}
	}
}
</style>
