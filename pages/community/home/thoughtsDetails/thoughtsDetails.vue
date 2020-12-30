<template>
	<view @tap="hide">
		<view class="container">
			<view class="so-content">
				<view class="so-content-sotitle">
					<view class="" style="padding-top: 12rpx;">
						<image v-if="!$isEmpty(thoughtsDetail.avatar)" class="avatar-base avatarImg" :src="imageError(thoughtsDetail.avatar,oss)"
						 mode="" @tap="goPerson"></image>
					</view>
					<view class="so-content-sotitle-soinfo">
						<view class="so-content-sotitle-soinfo-header">
							<view class="so-content-sotitle-soinfo-header-left" @tap="goPerson">
								<view class="so-content-sotitle-soinfo-header-left-name">
									{{$isEmpty(thoughtsDetail.userName)?'':thoughtsDetail.userName}}
								</view>
								<image v-if="thoughtsDetail.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
								<image v-if="thoughtsDetail.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
								<image v-if="thoughtsDetail.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
								<image v-if="thoughtsDetail.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
								<image v-if="thoughtsDetail.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
								<!-- <image v-if="thoughtsDetail.isTop==1" class="topImg" src="../../../../static/icon_thoughts_top.png" mode=""></image> -->
							</view>
							<view class="so-content-sotitle-soinfo-header-right">
								<!-- <image class="icon-sm collectImg" src="../../../../static/icon_collect.png" mode=""></image> -->
								<image class="icon-sm" :src="$ossUrl('icon_showActions.png')" mode="" @tap.stop="showAction"></image>
							</view>
							<view class="thoughts-header-actions" v-if="showActionStatus==true">
								<view class="thoughts-header-actions-info">
									<!-- catchtap="share"，分享事件防止冒泡 -->
									<view class="thoughts-header-actions-info-share" @tap.stop="deleteThoughts" v-if="thoughtsDetail.isAdmin==1||thoughtsDetail.isAdmin==2 || userId==thoughtsDetail.userId">
										<image class="icon-xs iconImg" :src="$ossUrl('icon_delete.png')" mode=""></image>
										<view class="">
											删除
										</view>
									</view>
									<!-- 	<view class="thoughts-header-actions-info-line">
										
									</view> -->
									<view class="thoughts-header-actions-info-share" @tap.stop="reportThoughts" v-else>
										<image class="icon-xs iconImg" :src="$ossUrl('icon_report.png')" mode=""></image>
										<view class="">
											举报
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="so-content-time" v-if="!$isEmpty(thoughtsDetail.createTime)">
							{{$isEmpty(getDateDiff(thoughtsDetail.createTime))?'刚刚': getDateDiff(thoughtsDetail.createTime)}}
						</view>
					</view>
				</view>
				<view class="so-content-wrap">
					<view class="so-content-details">
						<text>{{$isEmpty(thoughtsDetail.content)?'':thoughtsDetail.content}}</text>
					</view>
					<view class="so-content-img" v-if="thoughtsDetail.images.length>0">
						<view class="thoughts-image" v-if="thoughtsDetail.images.length==1">
							<image class="thoughts-image-single" :src="thoughtsDetail.images[0]" mode="aspectFill" @tap.stop="previewImage(thoughtsDetail.images,0)"></image>
						</view>
						<view class="thoughts-image" v-if="thoughtsDetail.images.length>1">
							<image v-for="(item,index) of thoughtsDetail.images" :key="index" class="thoughts-image-multiple" :src="item"
							 mode="aspectFill" @tap.stop="previewImage(thoughtsDetail.images,index)"></image>
						</view>
					</view>
					<view class="so-content-location" v-if="!$isEmpty(thoughtsDetail.location)">
						{{thoughtsDetail.location}}
					</view>
					<view class="so-content-link" v-if="!$isEmpty(thoughtsDetail.attach)">
						<view class="so-content-link-Wrap" @tap="goRelevanceDetails">
							<view class="linkImg">
								<image class="icon-xs" :src="$ossUrl('icon_newLink.png')" mode=""></image>
							</view>
							<view class="so-content-link-title singleEllipsis">
								{{thoughtsDetail.attach.title}}
							</view>
							<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="praiseTitle" @tap="goPraiseList">
				<view class="">
					赞过的人
				</view>
				<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="commentList">
				<view class="commentList-title" v-if="recommendNum>0">
					{{$isEmpty(recommendNum)?'0':recommendNum}}条评论
				</view>
				<view class="commentList-title-noComment" v-if="!recommendNum>0">
					暂无评论
				</view>
				<so-comment-item v-for="(item2,index2) of thoughtsDetail.thoughtsCommentList" @showActions="showItemActions(item2)"
				 :key="index2" :isAdmin="thoughtsDetail.isAdmin" :avatar="item2.avatar" :name="item2.realName" :content="item2.replyMsg"
				 :time="item2.createTime" :replyList="item2.thoughtsReplyList" :userId="item2.commentUserId" @replyItem="replyItem"
				 @checkMore="checkMore(item2)">
					<view class="content-data-num">
						<view class="content-data-num-item" @tap.stop="comment(item2)">
							<view class="content-data-num-item-num">
								{{$isEmpty(item2.thoughtsReplyList.length)?'0':item2.thoughtsReplyList.length}}
							</view>
							<image class="icon-xs" :src="$ossUrl('icon_comment.png')" mode=""></image>
						</view>
						<view class="content-data-num-item">
							<view class="content-data-num-item-num">
								{{$isEmpty(item2.thumbsUpCount)?'0':item2.thumbsUpCount}}
							</view>
							<image class="icon-xs" :src="$ossUrl('icon_littleBluePraise.png')" mode="" @tap="praiseThoughtsItem(item2)" v-if="item2.praiseStatus==0"></image>
							<image class="icon-xs" :src="$ossUrl('icon_littleBluePraised.png')" mode="" @tap="cancelPraiseThoughtsItem(item2)"
							 v-if="item2.praiseStatus==1"></image>
						</view>
					</view>
					<!-- <view class="thoughts-header-actions-item" v-if="item2.status==true">
						<image src="../../../../static/pic_corner.png" mode="" style="width: 44rpx;height: 10rpx;"></image>
						<view class="thoughts-header-actions-info-item">
							<view class="thoughts-header-actions-info-share-item"  @tap.stop="deleteComment(item2,index2)">
								<image class="icon-xs iconImg" src="../../../../static/icon_delete.png" mode=""></image>
								<view class="">
									删除
								</view>
							</view>
						</view>
					</view> -->
				</so-comment-item>
				<view class="" :style="{height:bottomHeight+'px'}"></view>
			</view>
		</view>
		<view class="safe-bottom content-bottom-wrap" id="bottomBtn">
			<view class="content-bottom">
				<!-- <input type="text" value="" placeholder="写评论" class="content" :disabled="true" @tap="showComment" /> -->
				<view class="content-bottom-title" @tap="showComment">
					<image class="icon-sm" :src="$ossUrl('icon_thoughts_comment.png')" mode=""></image>
					<view class="content-bottom-title-info">
						写评论...
					</view>
				</view>
				<view class="content-bottom-data">
					<button class="content-bottom-data-item" open-type="share">
						<view class="content-bottom-data-item-num" v-if="thoughtsDetail.weChatShare<=999">
							{{$isEmpty(thoughtsDetail.weChatShare)?'0':thoughtsDetail.weChatShare}}
						</view>
						<view class="content-bottom-data-item-num" v-else-if="thoughtsDetail.weChatShare>999">
							{{$isEmpty(thoughtsDetail.weChatShare)?'0':'999+'}}
						</view>
						<image class="icon-sm" :src="$ossUrl('icon_blueShare.png')" mode=""></image>
					</button>
					<view class="content-bottom-data-item">
						<view class="content-bottom-data-item-num" v-if="thoughtsDetail.thumbsUpCount<=999">
							{{$isEmpty(thoughtsDetail.thumbsUpCount)?'0':thoughtsDetail.thumbsUpCount}}
						</view>
						<view class="content-bottom-data-item-num" v-else-if="thoughtsDetail.thumbsUpCount>999" >
							{{$isEmpty(thoughtsDetail.thumbsUpCount)?'0':'999+'}}
						</view>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraise.png')" mode="" @tap="praiseThoughts()" v-show="thoughtsDetail.praiseStatus==0"></image>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraised.png')" mode="" @tap="cancelPraiseThoughts()" v-show="thoughtsDetail.praiseStatus==1"></image>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="addFriendPopup" type="bottom">
			<view class="popup_input">
				<textarea :placeholder="placeholderTxt" placeholder-class="inputDefault"  v-model="commentTxt" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80" :focus="focusStatus"></textarea>
				<view v-if="commentTxt.length>0" class="textSend" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;background-color: #EFF0F1; color: #BABEC0;padding: 12rpx 24rpx;border-radius: 8rpx;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		imageError,
		getDateDiff,
		previewImage
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				id: '',
				oss: '',
				thoughtsDetail: {},
				showActionStatus: false,
				commentTxt: '',
				thoughtsId: '',
				placeholderTxt: '写评论',
				commentId: '',
				replyId: '',
				recommendNum: 0,
				focusStatus:false,
				userId:'',
				bottomHeight:'',
				pages:''
			};
		},
		onLoad(options) {
			this.id = options.id
			// console.log(this.id)
			this.oss = this.$oss
			uni.createSelectorQuery()
				.in(this)
				.select('#bottomBtn')
				.boundingClientRect()
				.exec(ret => {
					this.bottomHeight = ret[0].height+40
					// console.log(this.bottomHeight)
				});
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id
			this.showActionStatus = false
			this.pages = getCurrentPages().length
			this.$http.get(`dms/thoughts/smart_org/${this.id}`,{
				hideLoading:true
			}).then(res => {
				// console.log(res)
				if(res.data.code==1){
					uni.showToast({
						title:res.data.message,
						icon:"none",
						success: () => {
							setTimeout(()=>{
								if(this.pages>1){
									uni.navigateBack({
										delta: 1
									})
								}else{
									uni.navigateTo({
										url:'/pages/community/home/home'
									})
								}
							},1000)
						}
					})
				}else{
						this.thoughtsDetail = res.data.data
						this.thoughtsDetail.thoughtsCommentList = this.thoughtsDetail.thoughtsCommentList.map(item => {
							return {
								...item,
								status: false
							}
						})
						this.recommendNum = this.thoughtsDetail.thoughtsCommentList.length
				}
			})
		},
		onShareAppMessage(res) {
			// console.log(res)
			this.$http.get(`dms/thoughts/we_chat/share/save/${this.id}`, {}).then(resp => {
				console.log(resp)
			})
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: `我分享了${this.thoughtsDetail.userName}的内容`,
				path: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${this.id}`
			}
		},
		onPageScroll(e) {
			this.showActionStatus=false
		},
		computed: {
			publishStatus() {
				return this.commentTxt.length > 0
			}
		},
		methods: {
			imageError,
			getDateDiff,
			previewImage,
			checkMore(item2) {
				let list = JSON.stringify(item2)
				uni.navigateTo({
					url: `/pages/community/home/thoughtsDetails/commentDetails/commentDetails?item=${list}`
				})
			},
			goPerson() {
				uni.navigateTo({
					url: `/pages/my/myMien/myMien?userId=${this.thoughtsDetail.userId}`
				})
			},
			goRelevanceDetails() {
				// console.log('关联信息', attach)
				this.$http.get('/admin/smart_groups/link/path', {
					params: {
						type: this.thoughtsDetail.attach.type, //材料：material；活动：activity；魔方：products；文章：article
						id: this.thoughtsDetail.attach.relationId, //关联id
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
			deleteThoughts() {
				let that = this
				that.pages = getCurrentPages().length
				// console.log(that.pages)
				uni.showModal({
					content: '是否删除该内容？',
					cancelColor: '#919397',
					success: function(res) {
						if (res.confirm) {
							that.$http.get('dms/thoughts/delete/' + that.thoughtsDetail.thoughtsId).then(res => {
								console.log(res)
								if (res.data.code == 1) {
									uni.showToast({
										title: res.data.message,
										icon: "none"
									})
								} else {
									uni.showToast({
										title: "删除成功",
										icon: "none",
										duration: 1000,
										success: () => {
											setTimeout(() => {
												if(that.pages>1){
													uni.navigateBack({
														delta: 1
													})
												}else{
													uni.navigateTo({
														url:'/pages/community/home/home'
													})
												}
											}, 1000)
										}
									})
								}
							})
						} else if (res.cancel) {
							that.showActionStatus = false
							console.log('用户点击取消');
						}
					}
				})
			},
			reportThoughts() {
				// console.log(6)
				uni.navigateTo({
					url: `/pages/report/report?id=${this.id}`
				})
			},
			goPraiseList() {
				uni.navigateTo({
					url: `/pages/community/home/thoughtsDetails/praisePersonList/praisePersonList?id=${this.id}`
				})
			},
			praiseThoughts() {
				this.$http.get('dms/thoughts/add_thumbs_up/' + this.id,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						this.thoughtsDetail.praiseStatus = 1
						this.thoughtsDetail.thumbsUpCount++;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			cancelPraiseThoughts() {
				this.$http.get('dms/thoughts/add_thumbs_up/' + this.id,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						this.thoughtsDetail.praiseStatus = 0
						this.thoughtsDetail.thumbsUpCount--;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			praiseThoughtsItem(item) {
				this.$http.get(`dms/thoughts_comment/comment_thumbs/${item.commentId}`,{
					hideLoading: true
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						item.praiseStatus = 1
						item.thumbsUpCount++;;
					}
				})
			},
			cancelPraiseThoughtsItem(item) {
				this.$http.get(`dms/thoughts_comment/comment_thumbs/${item.commentId}`,{
					hideLoading: true
				}).then(res => {
					console.log(res)
					if (res.data.code == 0) {
						item.praiseStatus = 0
						item.thumbsUpCount--;;
					}
				})
			},
			showAction() {
				this.showActionStatus = !this.showActionStatus
			},
			deleteComment(item2, index2) {
				// uni.navigateTo({
				// 	url:'/pages/report/report'
				// })
				// this.$http.post('dms/thoughts_comment/' + item2.commentId).then(res=>{
				// 	console.log(res)
				// 	if(res.data.data==false){
				// 		uni.showToast({
				// 			title:"非评论创建者不可删除",
				// 			icon:'none'
				// 		})
				// 	}else if(res.data.data==true){
				// 		uni.showModal({
				// 			content: '确认删除该评论？',
				// 			cancelColor: '#919397',
				// 			success: res => {
				// 				if (res.confirm) {

				// 				} else if (res.cancel) {
				// 					item2.status=false
				// 				    console.log('用户点击取消');
				// 				}
				// 			}
				// 		});
				// 	}
				// })
			},
			showComment() {
				// this.showCommentStatus=true
				this.placeholderTxt = '写评论'
				this.commentTxt = ""
				this.$refs.addFriendPopup.open()
				this.focusStatus =true
			},
			comment(item) {
				this.commentTxt = ""
				this.$refs.addFriendPopup.open()
				this.placeholderTxt = `回复${item.realName}`
				this.commentId = item.commentId
			},
			replyItem(item) {
				this.commentTxt = ""
				this.$refs.addFriendPopup.open()
				this.placeholderTxt = `@${item.realName}`
				this.commentId = item.commentId
				this.replyId = item.replyId
			},
			hide() {
				this.showActionStatus = false
			},
			sendInput() {
				if (this.placeholderTxt == '写评论') {
					this.$http.post('dms/thoughts_comment/create', {
						thoughtsId: this.id,
						replyMsg: this.commentTxt
					}).then(res => {
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							this.commentTxt = ''
							this.$http.get(`dms/thoughts/smart_org/${this.id}`).then(res => {
								console.log(res)
								this.thoughtsDetail = res.data.data
								this.recommendNum++
								// this.thoughtsDetail.avatar = this.imageError(this.thoughtsDetail.avatar)
								// this.thoughtsDetail.createTime = this.getDateDiff(this.thoughtsDetail.createTime)
							})
						}
						this.$refs.addFriendPopup.close()
					})
				} else if (this.placeholderTxt.includes('回复')) {
					this.$http.post('dms/thoughts_reply/create', {
						thoughtsId: this.id,
						replyMsg: this.commentTxt,
						commentId: this.commentId
					}).then(res => {
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							this.commentTxt = ''
							this.$http.get(`dms/thoughts/smart_org/${this.id}`).then(res => {
								console.log(res)
								this.thoughtsDetail = res.data.data
								// this.thoughtsDetail.avatar = this.imageError(this.thoughtsDetail.avatar)
								// this.thoughtsDetail.createTime = this.getDateDiff(this.thoughtsDetail.createTime)
							})
						}
						this.$refs.addFriendPopup.close()
					})
				} else if (this.placeholderTxt.includes('@')) {
					this.$http.post('dms/thoughts_reply/create', {
						thoughtsId: this.id,
						replyMsg: this.commentTxt,
						commentId: this.commentId,
						replyId: this.replyId
					}).then(res => {
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							this.commentTxt = ''
							this.$http.get(`dms/thoughts/smart_org/${this.id}`).then(res => {
								console.log(res)
								this.thoughtsDetail = res.data.data
								// this.thoughtsDetail.avatar = this.imageError(this.thoughtsDetail.avatar)
								// this.thoughtsDetail.createTime = this.getDateDiff(this.thoughtsDetail.createTime)
							})
						}
						this.$refs.addFriendPopup.close()
					})
				}
			},
			showItemActions(item) {
				this.thoughtsId = item.thoughtsId
				if (item.status == false) {
					this.thoughtsDetail.thoughtsCommentList.forEach(item2 => {
						item2.status = false
					})
					item.status = true
				} else if (item.status == true) {
					this.thoughtsDetail.thoughtsCommentList.forEach(item2 => {
						item2.status = false
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.so-content-wrap::after {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	.praiseTitle::after {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	textarea {
		flex: 1;
		border-radius: $border-radius-lg;
		background-color: $color-white;
		padding: 18rpx $spacing-lg;
		font-size: $font-size-base;
		line-height: $font-size-base;
	}

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
			color: #303031;
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

	.content-data-num {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.content-data-num-item {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-left: 48rpx;

			.content-data-num-item-num {
				width: 60rpx;
				text-align: right;
				margin-right: $spacing-sm;
				color: #576B95;
			}
		}
	}

	.thoughts-header-actions {
		position: absolute;
		right: 52rpx;
		top: 0rpx;
		display: flex;
		align-items: flex-end;
		flex-direction: column;

		.thoughts-header-actions-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $bg-color-secondary;
			padding: 16rpx $spacing-xl;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			border-radius: $border-radius-base;

			.thoughts-header-actions-info-share {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				background-color: $bg-color-secondary;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
				font-weight: normal;

				.iconImg {
					margin-right: $spacing-xs;
				}
			}

			.thoughts-header-actions-info-line {
				width: 2rpx;
				height: $font-size-xxs;
				background-color: $bg-color-primary;
				opacity: 0.8;
				margin: 0rpx $spacing-lg;
			}
		}
	}

	.so-content-time {
		// margin-top: 8rpx;
		font-size: $font-size-xxs;
		line-height: $line-height-size-xxs;
		color: $text-color-secondary;
	}
	.so-content-location {
		margin-top: 16rpx;
		font-size: $font-size-xxs;
		line-height: $line-height-size-xxs;
		color: $text-color-secondary;
	}
	
	::v-deep .content-bottom-data-item{
		font-size: $font-size-base;
		line-height: $line-height-size-base;
	}
	.container {
		padding: 28rpx 40rpx 40rpx;
		height: 100vh;
		position: relative;

		.so-content {
			.so-content-sotitle {
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				margin-bottom: $spacing-base;

				.avatarImg {
					border-radius: $border-radius-xl;
				}

				.so-content-sotitle-soinfo {
					margin-left: $spacing-lg;
					flex: 1;
					
					.so-content-sotitle-soinfo-header {
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;
						padding-bottom: 12rpx;
						padding-top: 12rpx;

						.so-content-sotitle-soinfo-header-left {
							margin-right: 40rpx;
							display: flex;
							align-items: center;
							justify-content: flex-start;

							.so-content-sotitle-soinfo-header-left-name {
								flex: 1;
								color: $text-color-primary;
								font-weight: bold;
								font-size: $font-size-lg;
								line-height: $line-height-size-lg;
								margin-right: $spacing-xs;
							}

							.topImg {
								width: 56rpx;
								height: 32rpx;
								margin-left: $spacing-xs;
							}
						}

						.so-content-sotitle-soinfo-header-right {
							display: flex;
							align-items: center;
							justify-content: flex-start;

							.collectImg {
								margin-right: $spacing-xl;
							}
						}
					}

					.so-content-sotitle-soinfo-bottom {
						color: $text-color-placeholder;
						font-size: $font-size-xs;
						line-height: $line-height-size-xs;
						margin-top: $spacing-sm;
					}
				}
			}

			.so-content-wrap {
				padding-bottom: $spacing-xl;
				// border-bottom: 2rpx solid #EFF0F1;
				position: relative;

				.so-content-details {
					word-break: break-all;
					color: $text-color-primary;
					font-size: $font-size-base;
					line-height: $line-height-size-base;
				}

				.so-content-img {
					margin-top: $spacing-base;

					.thoughts-image {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						flex-wrap: wrap;

						.thoughts-image-single {
							width: 460rpx;
							height: 344rpx;
							border-radius: $border-radius-base;
						}

						.thoughts-image-multiple {
							width: 218rpx;
							height: 218rpx;
							border-radius: $border-radius-base;
							margin-right: 6rpx;
							margin-bottom: 6rpx;
						}
					}
				}

				.so-content-link {
					margin-top: $spacing-lg;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: $font-size-xxs;
					line-height: $line-height-size-xxs;
					color: $text-color-regular;

					.so-content-link-Wrap {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						padding: 6rpx 0rpx 6rpx 6rpx;
						background-color: $bg-color-primary;
						border-radius: $border-radius-xl;

						.linkImg {
							background-color: #EFF0F1;
							margin-right: 8rpx;
							border-radius: 28rpx;
							padding: 6rpx;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.so-content-link-title {
							max-width: 468rpx;
							// margin-left: 14rpx;
							margin-right: $spacing-xs;
						}
					}
				}
			}
		}

		.praiseTitle {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $spacing-lg 0rpx;
			// border-bottom: 2rpx solid $bg-color-disabled;
			position: relative;
			font-weight: bold;
			color: $text-color-primary;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
		}

		.commentList {
			.commentList-title {
				font-weight: bold;
				color: $text-color-primary;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
				padding: $spacing-lg 0rpx;
			}

			.commentList-title-noComment {
				text-align: center;
				margin-top: 40rpx;
				color: #919397;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
			}
		}
	}

	.content-comment {
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

		.content-comment-notBtn {
			padding: 12rpx $spacing-lg;
			background-color: $bg-color-disabled;
			color: $text-color-secondary;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			font-weight: bold;
			margin-left: $spacing-lg;
			border-radius: $border-radius-base;
		}

		.content-comment-btn {
			padding: 12rpx $spacing-lg;
			background-color: $color-primary;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			font-weight: bold;
			margin-left: $spacing-lg;
			border-radius: $border-radius-base;
		}
	}
	.content-bottom-wrap{
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		background-color: $bg-color-primary;
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px $bg-color-regular;
	}
	.content-bottom {
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

	.thoughts-header-actions-item {
		position: absolute;
		right: 0rpx;
		top: 76rpx;
		display: flex;
		align-items: flex-end;
		flex-direction: column;

		.thoughts-header-actions-info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $bg-color-secondary;
			padding: 20rpx $spacing-xl;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			border-radius: $border-radius-base;
			border-top-right-radius: 0rpx;

			.thoughts-header-actions-info-share-item {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.iconImg {
					margin-right: $spacing-xs;
				}
			}
		}
	}
</style>
