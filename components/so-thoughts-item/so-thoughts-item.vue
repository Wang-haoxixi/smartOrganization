<template>
	<view class="thoughts" @tap="goDetails">
		<view class="thoughts-header">
			<view class="thoughts-header-info">
				<!-- <image v-if="defaultAvatar" :src="$ossUrl('icon_friend.png')" class="avatar-lg avatarImg">
				</image>
				<image v-else :src="avatar" class="avatar-lg avatarImg" @error="avatarError()"> -->
				<image :src="imageError(avatar,oss)" class="avatar-lg avatarImg" @tap.stop="goPerson"></image>
				</image>
				<view class="thoughts-header-info-content">
					<view class="thoughts-header-info-content-wrap">
						<view class="thoughts-header-info-content-name" @tap.stop="goPerson">
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
					</view>
					<slot></slot>
					<view class="thoughts-header-info-time">
						{{$isEmpty(getDateDiff(time))?'刚刚':getDateDiff(time)}}
					</view>
					<view class="thoughts-content">
						<text class="thoughts-content-txt">{{$isEmpty(content)?'':content}}</text>
					</view>
					<view class="" v-if="images.length>0">
						<view class="thoughts-image" v-if="images.length==1">
							<image class="thoughts-image-single" :src="images[0]" mode="aspectFill" @tap.stop="previewImage(images,0)"></image>
						</view>
						<view class="thoughts-image" v-if="images.length>1">
							<view class="thoughts-image-wrap"  v-for="(item,index) of images" :key="index">
								<image class="thoughts-image-multiple" :src="item" mode="aspectFill" @tap.stop="previewImage(images,index)"></image>
							</view>
						</view>
					</view>
					<view class="so-content-location" v-if="!$isEmpty(location)">
						{{location}}
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
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDateDiff,
		imageError,
		previewImage
	} from '@/common/utils.js'
	export default {
		name:'soThoughtsItem',
		props:{
			userId:{
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
				default: '刚刚'
			},
			thumbsUpCount:{
				type:Number,
				default:0
			},
			weChatShare:{
				type:Number,
				default:0
			},
			commentCount:{
				type:Number,
				default:0
			},
			userName:{
				type: String,
				default: '暂无昵称'
			},
			status:{
				type:Boolean,
				default:false
			},
			id:{
				type:Number,
				default:0
			},
			attach:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			images:{
				type:Array,
				default:()=>{
					return []
				}
			},
			location:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				oss:'',
				defaultAvatar:false
			};
		},
		onReady() {
			this.oss=this.$oss
		},
		methods:{
			previewImage,
			goPerson(){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${this.userId}`
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
			reportThoughts(){
				this.$emit('reportThoughts')
			},
			shareThoughts(){
				this.$emit('shareThoughts')
			},
			getDateDiff,
			imageError
		}
	}
</script>

<style lang="scss" scoped>
	.so-content-location{
		padding-top: $spacing-base;
		color: #919397;
		font-size: 26rpx;
		line-height: 36rpx;
	}
	.so-content-link{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-top: $spacing-lg;
		font-size: $font-size-xxs;
		line-height: $line-height-size-xxs;
		color: $text-color-regular;
		.so-content-link-Wrap{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 6rpx 0rpx 6rpx 6rpx;
			background-color: $bg-color-primary;
			border-radius: 28rpx;
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
				margin-right: $spacing-xs;
			}
		}
	}
.thoughts{
	padding: $spacing-xl 0rpx 0rpx 0rpx;
	background-color: $color-white;
	border-radius: $border-radius-lg;
	margin-bottom: $spacing-base;
}
.thoughts-image{
	width: 578rpx;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding-top:$spacing-base;
	.thoughts-image-single{
		width: 460rpx;
		height: 344rpx;
		border-radius: 10rpx;
	}
	.thoughts-image-wrap{
		width: 190rpx;
		height: 190rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.thoughts-image-multiple{
		width: 186rpx;
		height: 186rpx;
		border-radius: 10rpx;
	}
}
.thoughts-header-info-time{
	// margin-top: $spacing-sm;
	margin-bottom: $spacing-base;
	font-size: $font-size-xs;
	line-height: $line-height-size-xs;
	color: $text-color-placeholder;
}
.thoughts-content{
	font-size:$font-size-base ;
	line-height:$line-height-size-base ;
	.thoughts-content-name{
		color: $text-color-regular;
	}
	.thoughts-content-txt{
		color: $text-color-primary;
		word-break: break-all;
	}
}
.thoughts-header{
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	padding-top: 12rpx;
	.thoughts-header-info{
		flex: 1;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		.avatarImg{
			border-radius: $border-radius-lg;
		}
		.thoughts-header-info-content{
			flex: 1;
			margin-left: $spacing-lg;
			.thoughts-header-info-content-wrap{
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
				padding-bottom: 12rpx;
				.thoughts-header-info-content-name{
					display: flex;
					align-items: center;
					justify-content: flex-start;
					.thoughts-header-info-name{
						max-width: 407rpx;
						margin-right: $spacing-xs;
						font-weight: bold;
						font-size: $font-size-lg;
						line-height: $line-height-size-lg;
						color: $text-color-auxiliary;
					}
				}
			}
		}
	}
}
</style>
