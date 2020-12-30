<template>
	<view class="container">
		<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="avatar-sm avatarImg"  @tap="goPerson">
		</image>
		<image v-else :src="avatar" class="avatar-sm avatarImg" @error="avatarError()"  @tap="goPerson">
		</image>
		<view class="content">
			<view class="content-title">
				<view class="content-name">
					{{$isEmpty(name)?'':name}}
				</view>
				<!-- <image v-if="isAdmin==1 || isAdmin==2" class="icon-sm" src="../../static/icon_showActions.png" mode="" @tap.stop="showActions()"></image> -->
			</view>
			<view class="content-details">
				{{$isEmpty(content)?'':content}}
			</view>
			<view class="content-data">
				<view class="">
					{{$isEmpty(getDateDiff(time))?'刚刚': getDateDiff(time)}}
				</view>
				<slot></slot>
			</view>
			<view class="reply-content" v-if="replyList.length>0">
				<view class="reply-content-item" v-for="(item,index) of replyList" :key="index" @tap.stop="replyItem(item)" v-if="index<10">
					<text class="reply-content-item-name">{{$isEmpty(item.realName)?'':item.realName}}</text>回复<text class="reply-content-item-name">{{$isEmpty(item.replyTo)?'':item.replyTo}}</text>:<text class="reply-content-item-reply">{{$isEmpty(item.replyMsg)?'':item.replyMsg}}</text>
				</view>
				<view class="moreReply" v-if="replyList.length>10">
					<view class="" @tap="checkMore">
						查看全部{{$isEmpty(replyList.length)?'0':replyList.length}}回复
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		imageError,
		getDateDiff
	} from '@/common/utils.js'
	export default {
		name:'soCommentItem',
		props:{
			name:{
				type: String,
				default: ''
			},
			avatar:{
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: '暂无内容'
			},
			time: {
				type: String,
				default: '刚刚'
			},
			isAdmin:{
				type: Number,
				default: 0
			},
			replyList:{
				type:Array,
				default(){
					return []
				}
			},
			userId:{
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				defaultAvatar:false
			};
		},
		methods:{
			getDateDiff,
			avatarError() {
				this.defaultAvatar = true;
			},
			showActions(){
				this.$emit('showActions')
			},
			replyItem(item){
				this.$emit('replyItem',item)
			},
			checkMore(){
				this.$emit('checkMore')
			},
			goPerson(){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${this.userId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content::after{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.moreReply{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 20rpx;
		margin-top: 32rpx;
		font-size:24rpx;
		line-height: 32rpx;
		color: #576B95;
	}
	.reply-content{
		background-color: $bg-color-primary;
		border-radius: 20rpx;
		padding: 0rpx $spacing-base $spacing-lg $spacing-base;
		margin-bottom: 32rpx;
		font-size: $font-size-sm;
		line-height:$line-height-size-sm ;
		.reply-content-item{
			color: $text-color-regular;
			padding-top: $spacing-lg;
			.reply-content-item-name{
				color: $text-color-auxiliary;
				font-weight: bold;
			}
			.reply-content-item-reply{
				margin-left: $spacing-sm;
			}
		}
	}
.container{
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	padding-top: $spacing-xxl;
	.avatarImg{
		// padding-top: $spacing-xxl;
		border-radius: 16rpx;
	}
	.content-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.content{
		position: relative;
		// padding-top: $spacing-xxl;
		// padding-bottom: $spacing-xl;
		margin-left: $spacing-lg;
		flex: 1;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		// border-bottom: 2rpx solid $border-color;
		position: relative;
		.content-name{
			color: $text-color-primary;
			font-weight: bold;
		}
		.content-details{
			word-break: break-all;
			color: $text-color-regular;
			padding-top: $spacing-lg;
			padding-bottom:$spacing-xl ;
		}
		.content-data{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $text-color-secondary;
			font-size: $font-size-xxs;
			line-height: $line-height-size-xxs;
			padding-bottom: 32rpx;
			// .content-data-num{
			// 	display: flex;
			// 	align-items: center;
			// 	justify-content: flex-start;
			// 	.content-data-num-item{
			// 		display: flex;
			// 		align-items: center;
			// 		justify-content: flex-start;
			// 		margin-left: 48rpx;
			// 		.content-data-num-item-num{
			// 			margin-left: $spacing-sm;
			// 		}
			// 	}
			// }
		}
	}
}
</style>
