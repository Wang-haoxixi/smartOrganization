<template>
	<view>
		<view class="container" @tap.stop="hide">
			<view class="" style="padding-top: 40rpx;">
				<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="avatar-sm avatarImg"  @tap="goPerson">
				</image>
				<image v-else :src="replyList.avatar" class="avatar-sm avatarImg" @error="avatarError()"  @tap="goPerson">
				</image>
			</view>
			<view class="content">
				<view class="content-title">
					<view class="content-name">
						{{$isEmpty(replyList.realName)?'':replyList.realName}}
					</view>
					<!-- <image v-if="isAdmin==1 || isAdmin==2" class="icon-sm" src="../../static/icon_showActions.png" mode="" @tap.stop="showActions()"></image> -->
				</view>
				<view class="content-details">
					{{$isEmpty(replyList.replyMsg)?'':replyList.replyMsg}}
				</view>
				<view class="content-data">
					<view class="" v-if="!$isEmpty(replyList.createTime)">
						{{$isEmpty(getDateDiff(replyList.createTime))?'刚刚': getDateDiff(replyList.createTime)}}
					</view>
				</view>
				<view class="reply-content" v-if="replyList.thoughtsReplyList.length>0">
					<view class="reply-content-item" v-for="(item,index) of replyList.thoughtsReplyList" :key="index" @tap.stop="replyItem(item)">
						<text class="reply-content-item-name">{{$isEmpty(item.realName)?'':item.realName}}</text>回复<text class="reply-content-item-name">{{$isEmpty(item.replyTo)?'':item.replyTo}}</text>:<text class="reply-content-item-reply">{{$isEmpty(item.replyMsg)?'':item.replyMsg}}</text>
					</view>
				</view>
				<view class="" style="height: 112rpx;"></view>
			</view>
		</view>
		<view class="contetnt-bottom-wrap safe-bottom">
			<view class="content-bottom">
				<view class="content-bottom-title"  @tap="showComment">
					<image class="icon-sm" :src="$ossUrl('icon_thoughts_comment.png')" mode=""></image>
					<view class="content-bottom-title-info">
						写评论...
					</view>
				</view>
				<view class="content-bottom-data">
					<view class="content-bottom-data-item">
						<view class="content-bottom-data-item-num" v-if="replyList.thumbsUpCount<=999">
							{{$isEmpty(replyList.thumbsUpCount)?'0':replyList.thumbsUpCount}}
						</view>
						<view class="content-bottom-data-item-num" v-else-if="replyList.thumbsUpCount>999" >
							{{$isEmpty(replyList.thumbsUpCount)?'0':'999+'}}
						</view>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraise.png')" mode="" @tap.stop="praiseThoughtsItem()" v-show="replyList.praiseStatus==0"></image>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraised.png')" mode="" @tap.stop="cancelPraiseThoughtsItem()" v-show="replyList.praiseStatus==1"></image>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="addFriendPopup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholderTxt" placeholder-class="inputDefault" v-model="commentTxt" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="commentTxt.length>0" class="textSend" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;background-color: #EFF0F1; color: #BABEC0;padding: 12rpx 24rpx;border-radius: 8rpx;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		imageError,
		getDateDiff
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				replyList:{
					thoughtsReplyList:[]
				},
				defaultAvatar:false,
				thoughtsId:'',
				placeholderTxt:'写评论',
				commentId:'',
				replyId:'',
				commentTxt:'',
			};
		},
		onLoad(options) {
			this.replyList=JSON.parse(options.item)
		},
		computed:{
			publishStatus(){
				return this.commentTxt.length>0
			}
		},
		methods:{
			imageError,
			getDateDiff,
			avatarError() {
				this.defaultAvatar = true;
			},
			goPerson(){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${this.replyList.commentUserId}`
				})
			},
			praiseThoughtsItem(){
				this.$http.get(`dms/thoughts_comment/comment_thumbs/${this.replyList.commentId}`).then(res=>{
					console.log(res)
					if(res.data.code==0){
						this.replyList.praiseStatus = 1
						this.replyList.thumbsUpCount++;;
					}
				})
			},
			cancelPraiseThoughtsItem(){
				this.$http.get(`dms/thoughts_comment/comment_thumbs/${this.replyList.commentId}`).then(res=>{
					console.log(res)
					if(res.data.code==0){
						this.replyList.praiseStatus = 0
						this.replyList.thumbsUpCount--;;
					}
				})
			},
			showAction(){
				this.showActionStatus=!this.showActionStatus
			},
			showComment(){
				this.commentTxt=""
				this.$refs.addFriendPopup.open()
				this.placeholderTxt= `回复${this.replyList.realName}`
				this.commentId=this.replyList.commentId
			},
			comment(){
				this.commentTxt=""
				this.$refs.addFriendPopup.open()
				this.placeholderTxt= `回复${this.replyList.realName}`
				this.commentId=this.replyList.commentId
			},
			replyItem(item){
				this.commentTxt=""
				this.placeholderTxt= `@${item.realName}`
				this.$refs.addFriendPopup.open()
				this.commentId=item.commentId
				this.replyId=item.replyId
			},
			hide(){
				this.showActionStatus=false
			},
			sendInput(){
				this.$http.post('dms/thoughts_reply/create',{
					thoughtsId: this.replyList.thoughtsId,
					replyMsg: this.commentTxt,
					commentId:this.commentId,
					replyId:this.replyId
				}).then(res=>{
					console.log(res)
					if(res.data.code == 1){
						uni.showToast({
							title:res.data.message,
							icon:"none"
						})
					}else{
						this.commentTxt=''
						this.$http.get(`dms/app/thoughts_reply/page`,{
							params:{
								commentId:this.replyList.commentId,
								size:9999
							}
						}).then(res=>{
							console.log(res)
							this.replyList.thoughtsReplyList =res.data.data.records
						})
					}
					this.$refs.addFriendPopup.close()
				})
			}
		}
	}
</script>

<style lang="scss">
	.popup_input {
		padding: 30rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;
	
		.inputDefault {
			color: #BABEC0;
			padding: 20rpx;
			line-height: 48rpx;
		}
	
		textarea {
			flex: 1;
			padding: 20rpx;
			line-height: 48rpx;
			background-color: #F4F5F6;
			color: #666769;
			border-radius: 20rpx;
			height: 184rpx;
		}
	
		.textSend {
			background-color: #07C160;
			padding: 12rpx 24rpx;
			border-radius: 8rpx;
			border-radius: 4px;
			color: $color-white;
		}
	}
	textarea{
		flex: 1;
		border-radius: $border-radius-lg;
		background-color: $color-white;
		padding: 18rpx $spacing-lg;
		font-size: $font-size-base;
		line-height: $font-size-base;
	}
	.content-comment{
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: $bg-color-primary;		
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px $bg-color-regular;
		padding: $spacing-base $spacing-lg;
		position: fixed;
		bottom: 0rpx;
		width: 702rpx;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
		.content-comment-notBtn{
			padding: 12rpx $spacing-lg;
			background-color: $bg-color-disabled;
			color: $text-color-secondary;
			font-size: $font-size-sm;
			line-height:$line-height-size-sm ;
			font-weight: bold;
			margin-left: $spacing-lg;
			border-radius: $border-radius-base;
		}
		.content-comment-btn{
			padding: 12rpx $spacing-lg;
			background-color: $color-primary;
			color: $color-white;
			font-size: $font-size-sm;
			line-height:$line-height-size-sm ;
			font-weight: bold;
			margin-left: $spacing-lg;
			border-radius: $border-radius-base;
		}
	}
	.contetnt-bottom-wrap{
		background-color: $bg-color-primary;
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px $bg-color-regular;
		position: fixed;
		bottom: 0rpx;
		width: 100%;
	}
	.content-bottom{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 34rpx 40rpx;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			.content-bottom-title{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.content-bottom-title-info{
					color: #576B95;
					margin-left: 8rpx;
				}
			}
			.content-bottom-data {
				display: flex;
				align-items: center;
				justify-content: flex-start;
			
				.content-bottom-data-item {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					margin-left: $spacing-lg;
					background-color: $bg-color-primary;
					font-weight: normal;
					padding: 0rpx;
			
					.content-bottom-data-item-num {
						width: 74rpx;
						text-align: right;
						margin-right: $spacing-sm;
						color: $text-color-auxiliary;
					}
				}
			}
		}
	.reply-content{
		background-color: $bg-color-primary;
		border-radius: 20rpx;
		padding: 0rpx $spacing-base $spacing-lg $spacing-base;
		margin: $spacing-xl 0rpx;
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
	padding: 0 40rpx;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	.avatarImg{
		border-radius: 16rpx;
	}
	.content-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.content{
		position: relative;
		padding-top: $spacing-xxl;
		margin-left: $spacing-lg;
		flex: 1;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		border-bottom: 2rpx solid $border-color;
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
		}
	}
}
</style>
