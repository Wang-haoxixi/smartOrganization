<template>
	<view @tap="hideActions" style="">
		<view class="immersive-top" :style="{paddingTop:menuButton.top+'px',height: menuButton.height+'px',paddingBottom:titlePadding+'px',backgroundColor: bgColor}">
			<view class="titleContent" :style="{marginLeft: titleLeft+'px'}" v-if="pages>1">
				<image class="backImg" v-if="oss" :src="$ossUrl('icon_groupHome_back.png')" @tap="back" :style="{height: menuButton.height-10+'px',width: menuButton.height-10+'px'}"></image>
				<view class="icon-line" :style="{height:menuButton.height-14 + 'px'}">
				</view>
				<image class="homeImg" v-if="oss" :src="$ossUrl('icon_home.png')" mode="" :style="{height: menuButton.height-10+'px',width: menuButton.height-10+'px'}"
				 @tap="goHome"></image>
			</view>
			<view class="titleContent" :style="{marginLeft: titleLeft+'px'}" v-if="pages==1" @tap="goHome">
				<image if="oss" :src="$ossUrl('icon_home.png')" mode="" :style="{height: menuButton.height-10+'px',width: menuButton.height-10+'px'}"></image>
			</view>
			<button class="shareContent" :style="{'left':menuButton.left - menuButton.height -16+ 'px','top':menuButton.top + 'px'}"
			 open-type="share">
				<image class="shareContentImg" :src="$ossUrl('icon_groupHome_share.png')" :style="{height: menuButton.height-10+'px',width: menuButton.height-10+'px'}"></image>
			</button>
		</view>
		<view class="top" id="title">
			<image class="poster" mode="aspectFill" :src="groupDetails.bgImg" :style="{height:menuButton.height+menuButton.top+ titlePadding+ 44+20 +'px'}"></image>
			<view class="content">
				<image class="avatarImg" :src="groupDetails.avatar" mode=""></image>
				<view class="content-title">
					<view class="content-title-joined" v-if="groupDetails.isJoin==true">
						<view class="">
							已加入
						</view>
						<image class="icon-sm" :src="$ossUrl('icon_down.png')" mode=""></image>
					</view>
					<view class="content-title-join" v-if="groupDetails.isJoin==false" @tap="joinGroup">
						加入群组
					</view>
					<view class="content-title-join" v-if="groupDetails.isAdmin==true" @tap="inviteFriend">
						邀请好友
					</view>
					<view class="content-title-manage" v-if="groupDetails.isAdmin==true" @tap="manageGroup">
						管理
					</view>
				</view>
				<view class="groupInfo">
					<view class="groupInfo-name"  @tap="goGroupDetails">
						<view class="groupInfo-name-title">
							{{$isEmpty( groupDetails.name)?'': groupDetails.name}}
						</view>
						<image v-if="groupDetails.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
						<image v-if="groupDetails.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
						<image v-if="groupDetails.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
						<image v-if="groupDetails.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
						<image v-if="groupDetails.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
						<image class="icon-sm rightImg" :src="$ossUrl('icon_smartOrganization_rightArrow.png')" mode=""></image>
					</view>
					<view class="groupInfo-data">
						<view class="groupInfo-data-item">
							<view class="">
								{{$isEmpty(groupDetails.memberNum)?'0':groupDetails.memberNum}}
							</view>
							<view class="groupInfo-data-item-info">
								成员
							</view>
						</view>
						<view class="groupInfo-data-item">
							<view class="">
								{{$isEmpty(groupDetails.thoughtsNum)?'0':groupDetails.thoughtsNum}}
							</view>
							<view class="groupInfo-data-item-info">
								内容量
							</view>
						</view>
						<view class="groupInfo-data-item" @tap="showData">
							<view class="">
								{{$isEmpty(groupDetails.assetsWorth)?'0':groupDetails.assetsWorth}}
							</view>
							<view class="groupInfo-data-item-info">
								数据资产
							</view>
						</view>
						<image class="arrowsImg" :src="$ossUrl('icon_groupHome_rightArrows.png')" mode="" @tap="showData"></image>
					</view>
					<view class="groupInfo-content">
						<view class="groupInfo-content-info">
							{{$isEmpty(groupDetails.introduction)?'暂无介绍':groupDetails.introduction}}
						</view>
					</view>
				</view>
				<view class="group-functions">
					<view class="group-functions-top">
						<view class="group-functions-top-left" @tap="goMagic">
							<view class="group-functions-top-left-title">
								<view class="group-functions-top-left-title-name">
									魔方商城
								</view>
								<view class="group-functions-top-left-title-info">
									软件、报告等服务
								</view>
							</view>
							<image class="group-functions-top-left-img" :src="$ossUrl('icon_magicMini.png')" mode=""></image>
						</view>
						<view class="group-functions-top-right" @tap="goShop">
							<view class="group-functions-top-right-title">
								<view class="group-functions-top-right-title-name">
									爱消费
								</view>
								<view class="group-functions-top-right-title-info">
									爱消费
								</view>
							</view>
							<image class="group-functions-top-right-img" :src="$ossUrl('icon_shopMini.png')" mode=""></image>
						</view>
					</view>
					<view class="group-functions-bottom">
						<view class="group-functions-bottom-left" @tap="goIcan">
							<view class="group-functions-top-left-title">
								<view class="group-functions-top-left-title-name">
									我能VIP
								</view>
								<view class="group-functions-top-left-title-info">
									开启数字人生
								</view>
							</view>
							<image class="group-functions-top-left-img" :src="$ossUrl('icon_groupHome_ican.png')" mode=""></image>
						</view>
						<view class="group-functions-top-right" @tap="goAllFunctions">
							<view class="group-functions-top-right-title">
								<view class="group-functions-top-right-title-name">
									更多
								</view>
								<view class="group-functions-top-right-title-info">
									查看更多
								</view>
							</view>
							<image class="group-functions-top-right-img" :src="$ossUrl('icon_groupHome_allfunctions.png')" mode=""></image>
						</view>
					</view>
				</view>
				<view class="" style="margin-bottom: 40rpx;" v-if="!$isEmpty(text)">
					<an-notice-bar @goDetails="goNoticeDetails" switchTime="2" :text="text"></an-notice-bar>
				</view>
				<view class="group-thoughts">
					<view class="group-thoughts-title">
						综合
					</view>
					<so-thoughts-item v-if="thoughtsList.records.length>0" v-for="(item,index) of thoughtsList.records" :key="index"
					 :avatar="item.avatar" :name="item.userName" :redness="item.redness" :content="item.content" :time="item.createTime"
					 :images="item.images" :isAdmin="item.isAdmin" :attach="item.attach" :userId="item.userId" :location="item.location"
					 @showActions="showActions(item)" @goDetails="goDetails(item)">
						<view class="thoughts-header-actions-item" v-if="item.status==true">
							<view class="thoughts-header-actions-info-item">
								<view class="thoughts-header-actions-info-share-item" @tap.stop="deleteThoughts(item,index)" v-if="groupDetails.isAdmin==true || userId == item.userId">
									<image class="icon-xs iconImg" :src="$ossUrl('icon_delete.png')" mode=""></image>
									<view class="">
										删除
									</view>
								</view>
								<view class="thoughts-header-actions-info-share" @tap.stop="reportThoughts(item)" v-if="groupDetails.isAdmin==false && userId != item.userId">
									<image class="icon-xs iconImg" :src="$ossUrl('icon_report.png')" mode=""></image>
									<view class="">
										举报
									</view>
								</view>
							</view>
						</view>
						<view slot="actions">
							<view class="thoughts-action">
								<view class="thoughts-action-info-content">
									<image class="icon-xs" :src="$ossUrl('icon_littleBlueShare.png')" mode=""></image>
									<view class="thoughts-action-info-content-num" v-if="item.weChatShare<=999">
										{{$isEmpty(item.weChatShare)?'0':item.weChatShare}}
									</view>
									<view class="thoughts-action-info-content-num" v-else-if="item.weChatShare>999">
										{{$isEmpty(item.weChatShare)?'0':'999+'}}
									</view>
								</view>
								<view class="thoughts-action-info-content">
									<image class="icon-xs" :src="$ossUrl('icon_comment.png')" mode=""></image>
									<view class="thoughts-action-info-content-num" v-if="item.commentNum<=999">
										{{$isEmpty(item.commentNum)?'0':item.commentNum}}
									</view>
									<view class="thoughts-action-info-content-num" v-else-if="item.commentNum>999">
										{{$isEmpty(item.commentNum)?'0':item.commentNum}}
									</view>
								</view>
								<view class="thoughts-action-info-content">
									<image class="icon-xs" :src="$ossUrl('icon_littleBluePraise.png')" v-if="item.praiseStatus==0" @tap.stop="praiseThoughts(item)"></image>
									<image class="icon-xs" :src="$ossUrl('icon_littleBluePraised.png')" v-if="item.praiseStatus==1" @tap.stop="cancelPraiseThoughts(item)"></image>
									<view class="thoughts-action-info-content-num" v-if="item.thumbsUpCount<=999">
										{{$isEmpty(item.thumbsUpCount)?'0':item.thumbsUpCount}}
									</view>
									<view class="thoughts-action-info-content-num" v-if="item.thumbsUpCount>999">
										{{$isEmpty(item.thumbsUpCount)?'0':item.thumbsUpCount}}
									</view>
								</view>
							</view>
						</view>
					</so-thoughts-item>
					<view class="noCentent" v-if="thoughtsList.records.length==0">
						暂无成员发布内容
					</view>
					<uni-load-more :status="thoughtsMore" v-if="thoughtsList.records.length>=10"></uni-load-more>
				</view>
			</view>
		</view>
		<view class="contentBtns safe-bottom" v-if="groupDetails.isJoin==true">
			<image class="publishImg" :src="$ossUrl('icon_newPublish.png')" mode="" @tap="publish"></image>
			<view class="groupChatWrap">
				<image class="groupChatImg" :src="$ossUrl('icon_newGroupChat.png')" mode="" @tap="goGroupChat"></image>
				<!-- <view class="notice" v-if="unreadCount>0">
				</view> -->
			</view>
		</view>
		<uni-popup ref="addFriendPopup" type="bottom">
			<view class="popup_input">
				<textarea placeholder="请输入申请理由，1-50字" placeholder-class="inputDefault" v-model="remarks" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="remarks.length>0" class="textSend" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;background-color: #EFF0F1; color: #BABEC0;padding: 12rpx 24rpx;border-radius: 8rpx;">发送</view>
			</view>
		</uni-popup>
		<view class="" style="height: 320rpx;">
			
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		isEmpty,
		previewImage,
		imageError
	} from '@/common/utils.js'
	import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			AnNoticeBar
		},
		data() {
			return {
				remarks: '',
				thoughtsMore: 'more',
				groupDetails: {},
				thoughtsList: {
					records: []
				},
				id: '',
				data: '',
				comment: '',
				titleHeight: 0,
				unreadCount: 0,
				userId: '',
				oss: '',
				menuButton: {},
				titlePadding: '',
				titleLeft: '',
				bgColor: 'rgba(255, 255, 255, 0)',
				pages: 0,
				text: '',
				bottomHeight:'',
			};
		},
		computed: {
			...mapState({
				conversationList: state => state.conversationList,
			})
		},
		watch: {
			conversationList: {
				handler: function(n, o) {
					this.conversationList.forEach(item => {
						if (item.type == 'GROUP') {
							// console.log('item2',item)
							if (item.groupProfile.groupID == this.id) {
								this.unreadCount = item.unreadCount;
							}
						}
					})
				},
				deep: true,
				immediate: true
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: `${this.groupDetails.name}`,
				path: `/pages/group/home/home?id=${this.id}`
			}
		},
		onReachBottom() {
			if (this.thoughtsList.current < this.thoughtsList.pages) {
				this.$http.get('dms/thoughts/smart_org/main/complex/page', {
					params: {
						orgId: this.id,
						current: this.thoughtsList.current + 1
					}
				}).then(res => {
					this.thoughtsList.current = res.data.data.current
					if (this.thoughtsList.current < this.thoughtsList.pages) {
						this.thoughtsMore = 'more'
					} else {
						this.thoughtsMore = 'noMore'
					}
					this.thoughtsList.records = this.thoughtsList.records.concat(res.data.data.records.map(item => {
						return {
							...item,
							status: false
						}
					}))
				})
			}
		},
		methods: {
			hideActions() {
				this.thoughtsList.records.forEach(item => {
					item.status = false
				})
			},
			inviteFriend() {
				uni.navigateTo({
					url: `/pages/community/home/createGroup/createGroup?id=${this.id}&name=${this.groupDetails.name}`
				})
			},
			goNoticeDetails(item, index) {
				let id = ''
				this.groupDetails.noticeList.forEach((item2, index2) => {
					if (index == index2) {
						uni.navigateTo({
							url: `/pages/group/home/manageGroup/noticeManage/noticeDetail/noticeDetail?id=${item2.id}`
						})
					}
				})
			},
			goGroupChat() {
				// console.log(this.groupDetails.orgId )
				if (this.groupDetails.orgId > 0) {
					this.$store.commit('createGroupConversationActive', this.groupDetails.orgId + '')
					uni.navigateTo({
						url: '/pages/chat/chatRoom/chatRoom?titleName=' + this.groupDetails.name
					})
				}
			},
			goIcan() {
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
			goMagic() {
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
			goShop() {
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
			reportThoughts(item) {
				uni.navigateTo({
					url: `/pages/report/report?id=${item.thoughtsId}`
				})
			},
			deleteThoughts(item, index) {
				// console.log(item)
				let that = this
				uni.showModal({
					content: '是否删除该内容？',
					cancelColor: '#919397',
					success: function(res) {
						if (res.confirm) {
							that.$http.get('dms/thoughts/delete/' + item.thoughtsId).then(res => {
								console.log(res)
								if (res.data.code == 1) {
									uni.showToast({
										title: res.data.message,
										icon: "none"
									})
								} else {
									item.status = false
									that.thoughtsList.records.splice(index, 1)
								}
							})
						} else if (res.cancel) {
							item.status = false
							console.log('用户点击取消');
						}
					}
				})
			},
			joinGroup() {
				// if(this.)
				if (this.groupDetails.isCharge == true) {
					uni.showToast({
						title: "该SO为付费SO，请移步至我能APP申请加入",
						icon: "none"
					})
				} else if (this.groupDetails.allowJoin == false) {
					uni.showToast({
						title: "该SO暂不允许加入",
						icon: "none"
					})
				} else if (this.groupDetails.isExempt == true) {
					this.sendInput()
				} else {
					this.$refs.addFriendPopup.open()
				}
			},
			manageGroup() {
				uni.navigateTo({
					url: `/pages/group/home/manageGroup/manageGroup?id=${this.id}&bgImg=${this.groupDetails.bgImg}&avatar=${this.groupDetails.avatar}&name=${this.groupDetails.name}&redness=${this.groupDetails.redness}&introduction=${this.groupDetails.introduction}&isAdmin=${this.groupDetails.identity}`
				})
			},
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${item.thoughtsId}`
				})
			},
			goAllFunctions() {
				uni.navigateTo({
					url: '/pages/group/home/groupFunctions/groupFunctions'
				})
			},
			publish() {
				uni.navigateTo({
					url: `/pages/group/home/publish/publish?id=${this.id}&avatar=${this.groupDetails.avatar}&name=${this.groupDetails.name}`
				})
			},
			goGroupDetails() {
				uni.navigateTo({
					url: `/pages/group/home/groupDetails/groupDetails?id=${this.id}`
				})
			},
			showActions(item) {
				this.thoughtsId = item.thoughtsId
				if (item.status == false) {
					this.thoughtsList.records.forEach(item2 => {
						item2.status = false
					})
					item.status = true
				} else if (item.status == true) {
					this.thoughtsList.records.forEach(item2 => {
						item2.status = false
					})
				}
			},
			praiseThoughts(item) {
				this.$http.get('dms/thoughts/add_thumbs_up/' + item.thoughtsId,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						item.praiseStatus = 1
						item.thumbsUpCount++;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			cancelPraiseThoughts(item) {
				this.$http.get('dms/thoughts/add_thumbs_up/' + item.thoughtsId,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						item.praiseStatus = 0
						item.thumbsUpCount--;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			showData() {
				uni.navigateTo({
					url: `/pages/group/home/dataAssets/dataAssets?orgId=${this.id}`
				})
			},
			sendInput() {
				let that = this
				that.$http.post('admin/org/apply', {
					orgId: that.id,
					message: that.remarks
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '申请成功',
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									that.remarks = ''
									that.$refs.addFriendPopup.close()
									if (that.groupDetails.isExempt == true) {
										that.groupDetails.isJoin = true
										that.groupDetails.memberNum++;
									} else {

									}
								}, 1000)
							}
						})
					} else {
						uni.showToast({
							title: `${res.data.message}`,
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									that.remarks = ''
									that.$refs.addFriendPopup.close()
								}, 1000)
							}
						})
					}
				})
			},
			back() {
				// console.log(6)
				uni.navigateBack({
					delta: 1
				})
			},
			goHome() {
				// console.log(9)
				uni.reLaunch({
					url: '/pages/community/home/home'
				})
			},
			isEmpty,
			previewImage,
			imageError
		},
		onLoad(options) {
			this.oss = this.$oss
			this.id = options.id;
			this.titleLeft = uni.getSystemInfoSync().windowWidth - uni.getMenuButtonBoundingClientRect().right
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			// console.log(this.menuButton)
			this.titlePadding = uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight;
			this.pages = getCurrentPages().length
			this.conversationList.forEach(item => {
				if (item.type == 'GROUP') {
					if (item.groupProfile.groupID == this.id) {
						this.unreadCount = item.unreadCount;
					}
				}
			})
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id
			this.$http.get('admin/smart_groups/groups/info', {
				hideLoading:true,
				params: {
					orgId: this.id,
					range: 0
				}
			}).then(res => {
				if(res.data.code == 1){
					uni.showToast({
						title:res.data.message,
						icon:"none"
					})
				}else{
					this.groupDetails = res.data.data
					this.groupDetails.avatar = this.imageError(this.groupDetails.avatar, this.oss)
					this.text = this.groupDetails.noticeList.map(item => {
						return item.title
					})
				}
				// console.log(this.text)
			})
			this.$http.get('dms/thoughts/smart_org/main/complex/page', {
				hideLoading:true,
				params: {
					orgId: this.id
				}
			}).then(res => {
				if(res.data.code == 1){
					uni.showToast({
						title:res.data.message,
						icon:"none"
					})
				}else{
					this.thoughtsList = res.data.data
					if (this.thoughtsList.current < this.thoughtsList.pages) {
						this.thoughtsMore = 'more'
					} else {
						this.thoughtsMore = 'noMore'
					}
					this.thoughtsList.records = this.thoughtsList.records.map(item => {
						return {
							...item,
							status: false
						}
					})
				}
			})
		},
		mounted() {
			this.$nextTick(function(){
				uni.createSelectorQuery()
					.in(this)
					.select('#title')
					.boundingClientRect()
					.exec(ret => {
						console.log(ret)
						this.titleHeight = ret[0].height;
					});
				// console.error(this.unreadCount)
			})
		},
		onPageScroll(e) {
			// console.log(e)
			this.thoughtsList.records = this.thoughtsList.records.map(item => {
				return {
					...item,
					status: false
				}
			})
			if (e.scrollTop > 44) {
				this.bgColor = 'rgba(255, 255, 255)'
			} else {
				this.bgColor = 'rgba(255, 255, 255,0)'
			}
		},
	}
</script>

<style lang="scss" scoped>
	.group-functions-top-left ::before {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 1px;
		height: 100%;
		background: #EFF0F1;
		transform: scaleX(0.5);
	}

	.group-functions-bottom-left ::before {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 1px;
		height: 100%;
		background: #EFF0F1;
		transform: scaleX(0.5);
	}

	.backImg {
		padding-right: 20rpx;
	}

	.homeImg {
		padding-left: 20rpx;
	}

	.titleContent {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: fixed;
		z-index: 11;
		padding: 4px 11px;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 50rpx;

		.icon-line {
			width: 1px;
			background: rgba(0, 0, 0, 0.2);
		}
	}

	.titleContent:after {
		content: " ";
		/* 注意这里为双引号 */
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		width: 200%;
		height: 200%;
		border: 1px solid rgba(151, 151, 151, 0.2);
		border-radius: 50rpx;
		/* 也可以设置圆角 */
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
		box-sizing: border-box;
		z-index: -1;
	}

	.shareContent {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		z-index: 11;
		padding: 4px;
		border-radius: 50%;
		/* 也可以设置圆角 */
		background: rgba(255, 255, 255, 0.6);
		// border: 1px solid rgba(151, 151, 151, 0.2);
		.shareContentImg{
			width: 44rpx;
			height: 44rpx;
		}
	}

	.shareContent:after {
		content: " ";
		/* 注意这里为双引号 */
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		width: 200%;
		height: 200%;
		border: 1px solid rgba(151, 151, 151, 0.2);
		border-radius: 50%;
		/* 也可以设置圆角 */
		transform-origin: 0 0;
		transform: scale(0.5, 0.5);
		box-sizing: border-box;
	}

	.contentBtns {
		// margin-bottom: 24rpx;
		position: fixed;
		bottom: 24rpx;
		right: 24rpx;
		z-index: 66;

		.publishImg {
			width: 112rpx;
			height: 112rpx;
			border-radius: 50%;
			box-shadow: 2px 2px 8px -3px #07C160;
			margin-bottom: 48rpx;
		}

		.groupChatWrap {
			position: relative;

			.groupChatImg {
				width: 112rpx;
				height: 112rpx;
				border-radius: 50%;
				box-shadow: 2px 2px 8px -3px #07C160;
			}

			.notice {
				width: 20rpx;
				height: 20rpx;
				border-radius: 20rpx;
				background-color: #F74437;
				position: absolute;
				top: 18rpx;
				right: 40rpx;
			}
		}
	}

	.thoughts-action {
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
		padding-top: $spacing-xl;
		padding-bottom: $spacing-xl;
		// border-bottom: 2rpx solid $border-color;

		.thoughts-action-info-content {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.thoughts-action-info-content-num {
				width: 60rpx;
				text-align: left;
				margin-left: $spacing-sm;
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
				color: $text-color-auxiliary;
			}
		}
	}

	.thoughts-action::after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}


	.thoughts-header-actions-item {
		position: absolute;
		right: 52rpx;
		top: 0rpx;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		border-radius: 8rpx;

		.thoughts-header-actions-info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $bg-color-secondary;
			padding: 16rpx $spacing-xl;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			border-radius: $border-radius-base;

			.thoughts-header-actions-info-share-item {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.iconImg {
					margin-right: $spacing-xs;
				}
			}

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
		}
	}

	.group-functions-item-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;

		.group-functions-item-info-title {
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			color: $text-color-primary;
			font-weight: bold;
			margin-bottom: $spacing-xs;
		}

		.group-functions-item-info-content {
			color: $text-color-placeholder;
			font-size: $font-size-xxs;
			line-height: $line-height-size-xxs;
		}
	}

	.group-functions-item-img {
		width: 72rpx;
		height: 72rpx;
	}

	.noCentent {
		color: #919397;
		text-align: center;
		margin-top: 92rpx;
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

	.groupInfo {
		margin-bottom: $spacing-xxl;

		.groupInfo-name {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			font-size: $font-size-xxxl;
			line-height: $line-height-size-xxxl;
			color: $text-color-primary;
			font-weight: bold;
			margin-bottom: $spacing-sm;

			.groupInfo-name-title {
				max-width: 610rpx;
				margin-right: $spacing-sm;
			}
		}

		.groupInfo-data {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 12rpx;

			.groupInfo-data-item {
				display: flex;
				align-items: flex-end;
				justify-content: flex-start;
				margin-right: $spacing-lg;
				font-weight: bold;
				color: $text-color-primary;
				font-size: $font-size-xxl;
				line-height: $font-size-xxl;

				.groupInfo-data-item-info {
					margin-left: $spacing-sm;
					color: $text-color-placeholder;
					font-size: $font-size-xs;
					line-height: $font-size-xs;
					font-weight: normal;
				}
			}

			.arrowsImg {
				width: 24rpx;
				height: 56rpx;
				margin-left: -$spacing-lg;
			}
		}

		.groupInfo-content {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.groupInfo-content-info {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				color: $text-color-regular;
				font-size: $font-size-xs;
				line-height: $line-height-size-xs;
				flex: 1;
			}

		}
	}
	.rightImg {
			margin-right: -$spacing-base;
		}
	.group-functions-top ::after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	.group-functions {
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.04);
		border-radius: $border-radius-base;
		margin-bottom: $spacing-xxl;

		.group-functions-top {
			position: relative;
			// border-bottom: 1px solid #EFF0F1;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.group-functions-top-left {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 22rpx 24rpx 18rpx;
				// border-right: 1px solid #EFF0F1;
				flex: 1;

				.group-functions-top-left-title {
					display: flex;
					align-items: flex-start;
					flex-direction: column;
					justify-content: flex-start;

					.group-functions-top-left-title-name {
						font-size: 30rpx;
						line-height: 44rpx;
						color: #303031;
						font-weight: bold;
						margin-bottom: 4rpx;
					}

					.group-functions-top-left-title-info {
						font-size: 24rpx;
						line-height: 32rpx;
						color: #919397;
					}
				}

				.group-functions-top-left-img {
					width: 72rpx;
					height: 72rpx;
				}
			}

			.group-functions-top-right {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 22rpx 24rpx 18rpx;
				flex: 1;

				.group-functions-top-right-img {
					width: 72rpx;
					height: 72rpx;
				}

				.group-functions-top-right-title {
					display: flex;
					align-items: flex-start;
					flex-direction: column;
					justify-content: flex-start;

					.group-functions-top-right-title-name {
						font-size: 30rpx;
						line-height: 44rpx;
						color: #303031;
						font-weight: bold;
						margin-bottom: 4rpx;
					}

					.group-functions-top-right-title-info {
						font-size: 24rpx;
						line-height: 32rpx;
						color: #919397;
					}
				}
			}
		}


		.group-functions-bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.group-functions-bottom-left {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 22rpx 24rpx 18rpx;
				// border-right: 1px solid #EFF0F1;
				flex: 1;

				.group-functions-top-left-title {
					display: flex;
					align-items: flex-start;
					flex-direction: column;
					justify-content: flex-start;

					.group-functions-top-left-title-name {
						font-size: 30rpx;
						line-height: 44rpx;
						color: #303031;
						font-weight: bold;
						margin-bottom: 4rpx;
					}

					.group-functions-top-left-title-info {
						font-size: 24rpx;
						line-height: 32rpx;
						color: #919397;
					}
				}

				.group-functions-top-left-img {
					width: 72rpx;
					height: 72rpx;
				}
			}

			.group-functions-top-right {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 22rpx 24rpx 18rpx;
				flex: 1;

				.group-functions-top-right-img {
					width: 72rpx;
					height: 72rpx;
				}

				.group-functions-top-right-title {
					display: flex;
					align-items: flex-start;
					flex-direction: column;
					justify-content: flex-start;

					.group-functions-top-right-title-name {
						font-size: 30rpx;
						line-height: 44rpx;
						color: #303031;
						font-weight: bold;
						margin-bottom: 4rpx;
					}

					.group-functions-top-right-title-info {
						font-size: 24rpx;
						line-height: 32rpx;
						color: #919397;
					}
				}
			}
		}
	}

	.group-thoughts {
		.group-thoughts-title {
			color: $text-color-primary;
			font-weight: bold;
			font-size: $font-size-xl;
			line-height: $line-height-size-xl;
		}
	}

	.content {
		padding: $spacing-lg $spacing-xl 0rpx $spacing-xl;
		background-color: #FFFFFF;
		position: relative;
		top: -20px;
		border-top-left-radius: $border-radius-xxl;
		border-top-right-radius: $border-radius-xxl;

		// top: -120rpx;
		.avatarImg {
			width: 144rpx;
			height: 144rpx;
			box-shadow: 2rpx 2rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
			border-radius: $border-radius-xxl;
			border: $spacing-xs solid $color-white;
			position: absolute;
			top: -60rpx;
			left: $spacing-xl;
		}

		.content-title {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			font-weight: bold;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			margin-bottom: $spacing-lg;

			.content-title-join {
				color: $color-white;
				background-color: $color-primary;
				border-radius: $border-radius-xxl;
				padding: 12rpx 48rpx;
			}

			.content-title-joined {
				visibility: hidden;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: $text-color-placeholder;
				background-color: $bg-color-primary;
				border-radius: $border-radius-xxl;
				padding: 12rpx 28rpx 12rpx 40rpx;
			}

			.content-title-manage {
				background-color: $color-primary;
				color: $color-white;
				border-radius: $border-radius-xxl;
				margin-left: $spacing-lg;
				padding: 12rpx $spacing-lg;
			}
		}
	}

	.immersive-top {
		z-index: 99999;
		position: fixed;
		width: 750rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;

		.back {
			align-self: flex-start;
		}

		.immersive-title {
			flex: 1;
			text-align: center;
			font-size: 34rpx;
			line-height: 48rpx;
			justify-content: center;
		}
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.top {
		// padding-bottom: 40rpx;

		.poster {
			width: 750rpx;
		}

		.top-title {
			margin-top: 30rpx;
			padding: 0 40rpx;

			.top-text {
				flex: 1;
				display: flex;
				flex-direction: column;

				.top-text-title {
					font-weight: bold;
					font-size: 32rpx;
					line-height: 44rpx;
				}

				.top-text-mid {
					display: flex;
					margin-top: 20rpx;
					justify-content: space-between;
					align-items: center;

					.top-text-money {
						color: #F74437;
						font-weight: bold;
						line-height: 40rpx;
						font-size: 28rpx;
					}

					.top-text-type {
						color: #919397;
						line-height: 34rpx;
						font-size: 24rpx;
					}
				}

				.top-text-org {
					margin-top: 20rpx;
					color: #919397;
					line-height: 34rpx;
					font-size: 24rpx;
				}

			}
		}
	}
</style>
