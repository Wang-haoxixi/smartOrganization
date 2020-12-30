<template>
	<view class="myMien" @tap='hideAction'>

		<!-- 备注 -->
		<uni-popup ref="popup" type="center" customStyle="background:transparent">
			<view class="remark-box">
				<view class="title">
					添加备注
				</view>
				<input class="uni-input" maxlength=20 v-model="alias" />
				<view class="btns">
					<button type="default" size="mini" class="cancel btn" @tap='cancel'>取消</button>
					<button size="mini" class="confirm btn" @tap='confirm'>确定</button>
				</view>
			</view>
		</uni-popup>

		<!-- 加友 -->
		<uni-popup ref="addFriendPopup" type="bottom" customStyle="background:#F4F5F6">
			<view class="popup_input safe-bottom">
				<textarea placeholder="请输入申请理由，1-50字" maxlength=50 placeholder-class="inputDefault" v-model="remarks"
				 adjust-position="true" show-confirm-bar="false" cursor-spacing="100"></textarea>
				<view v-if="remarks.length>0" class="textSend" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;background-color: #EFF0F1; color: #BABEC0;padding: 12rpx 24rpx;border-radius: 8rpx;">发送</view>
			</view>
		</uni-popup>

		<!-- 评价 -->
		<uni-popup ref="commentThoughtsPopup" type="bottom" customStyle="background:#F4F5F6">
			<view class="comment_input safe-bottom">
				<input v-model="comment" placeholder="请输入" placeholder-style='color:#BABEC0' cursor-spacing=8 :focus='isFocus'
				 adjust-position="true" />
				<view v-if="comment.length>0" class="textSend1" @tap="sendComment">发送</view>
				<view v-else class="textSend0">发送</view>
			</view>
		</uni-popup>

		<!-- 解除好友弹窗 -->
		<uni-popup ref="relieveFriendPopup" type="center">
			<view class="relieveFriend-box">
				<view class="title">
					是否解除好友？
				</view>
				<view class="btns">
					<button size="mini" type="default" class="btn cancel" @tap='cancelFriend'>取消</button>
					<button size="mini" class="btn confirm" @tap='confirmFriend'>确定</button>
				</view>
			</view>
		</uni-popup>

		<view class="immersive-top" :style="{paddingTop:menuButton.top+'px',height: menuButton.height+'px',paddingBottom:titlePadding+'px',backgroundColor: bgColor}">
			<image class="back" v-if="oss && titleFontColor == 'white' && pages >1" :src="$ossUrl('icon_immersive_back.png')"
			 @tap="back" :style="{height: menuButton.height+'px',width: menuButton.height+'px',marginLeft: titleLeft+'px'}"></image>
			<image class="back" v-if="oss && titleFontColor == 'black' && pages >1" :src="$ossUrl('icon_back.png')" @tap="back"
			 :style="{height: menuButton.height-titlePadding+'px',width: menuButton.height-titlePadding+'px',paddingTop: titlePadding/2+'px',marginLeft: titleLeft+'px'}"></image>
			<image class="back home" v-if="oss && titleFontColor == 'white' && pages <2" :src="$ossUrl('icon_home_white.png')"
			 @tap="back"></image>
			<image class="back home" v-if="oss && titleFontColor == 'black' && pages <2" :src="$ossUrl('icon_home.png')" @tap="back"></image>
			<view v-if="titleFontColor == 'black'" class="immersive-title" :style="{marginRight: titleLeft + menuButton.height + 'px',lineHeight: menuButton.height + 'px'}">
				<!-- <text space="nbsp" class="title" v-if="!userInfo.alias">{{$isEmpty(userInfo.realName) ? '暂无' : userInfo.realName}}</text>
				<text space="nbsp" class="title" v-else>{{$isEmpty(userInfo.alias) ? '暂无' : userInfo.alias}}</text> -->
			</view>
		</view>
		<view class="myMien-bg">
			<view class="myMien-bg-top">
				<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="img_head"></image>
				<image v-else-if="userInfo.avatar" :src="userInfo.avatar" class="img_head" @error='avatarError'></image>
				<view class="btns" v-if="isShow">
					<button size="mini" class="btn remark" @tap='remark' v-if="userInfo.isFriend">备注</button>
					<button v-if="!userInfo.isFollow" size="mini" class="btn attention" @tap='attention'>{{userInfo.isFollow ? "已关注" : "关注"}}</button>
					<!-- <button v-else size="mini" class="btn attention-no" @tap='attention'>{{userInfo.isFollow ? "已关注" : "关注"}}</button> -->
					<button size="mini" class="btn" :class="{set:!userInfo.isFollow || !userInfo.isFriend}" v-if="userInfo.isFollow || userInfo.isFriend"
					 @tap='goSet'>设置</button>
				</view>
			</view>
			<view class="myMien-bg-middle">
				<text space="nbsp" class="name" v-if="!userInfo.alias">{{$isEmpty(userInfo.realName) ? '暂无' : userInfo.realName}}</text>
				<!-- 备注 -->
				<text space="nbsp" class="name" v-else>{{$isEmpty(userInfo.alias) ? '暂无' : userInfo.alias}} (
					{{$isEmpty(userInfo.realName) ? '暂无' : userInfo.realName}} )</text>
				<image :src="$ossUrl(userInfo.sex==1?'icon_smartOrganization_man.png':'icon_smartOrganization_woman.png')" class="img_sex"></image>
				<image v-if="userInfo.redness" :src="$ossUrl(`icon_smartOrganization_grade${userInfo.redness}.png`)" class="img_grade"></image>
				<image v-if="userInfo.rank" :src="$ossUrl(`icon_smartOrganization_partner${userInfo.rank}.png`)" class="img_partner"></image>
			</view>
			<view class="fans-attention">
				<text class="fans">{{$isEmpty(userInfo.fansNum) ? '0' : userInfo.fansNum}}</text><text class="span">粉丝</text><text
				 class="attention">{{$isEmpty(userInfo.followNum) ? '0' : userInfo.followNum}}</text><text class="span">关注</text>
			</view>
			<view class="introduce-text">
				<text space="nbsp">{{$isEmpty(userInfo.introduction) ? '该用户暂未设置简介' : userInfo.introduction}}</text>
			</view>
		</view>
		<!-- 页面分享 -->
		<button v-if="oss && titleFontColor == 'white' && pages >1" class="pageShareWhite" id="pageShare" open-type="share"
		 :style="{top:menuButton.top  +'px',height:menuButton.height  +'px',width:menuButton.height  +'px',left:menuButton.left - menuButton.height - 16 +'px'}">
			<image :src="$ossUrl('icon_smartOrganization_shareWhite.png')" class="img_pageShare"></image>
		</button>
		<button v-if="oss && titleFontColor == 'black' && pages >1" class="pageShare" id="pageShare" open-type="share" :style="{top:menuButton.top  +'px',height:menuButton.height  +'px',width:menuButton.height  +'px',left:menuButton.left - menuButton.height - 16 +'px'}">
			<image :src="$ossUrl('icon_smartOrganization_pageShare.png')" class="img_pageShare"></image>
		</button>
		<view class="container">
			<view class="container-item" v-if="data.records.length > 0" v-for="(item,index) in data.records" :key='index'>
				<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="img_head"></image>
				<image v-else-if="userInfo.avatar" :src="userInfo.avatar" class="img_head" @error='avatarError'></image>
				<view class="container-item-right">
					<view class="container-item-right-top" @tap='goDetails(item)'>
						<view class="name-more">
							<view class="name-more-left-box singleEllipsis">
								<view class="name-more-left">
									<view style="max-width: 250rpx;height: 100%;">
										<view class="name" v-if="!userInfo.alias"><text space="nbsp">{{$isEmpty(userInfo.realName) ? '暂无' : userInfo.realName}}</text></view>
										<view class="name" v-else><text space="nbsp">{{$isEmpty(userInfo.alias) ? '暂无' : userInfo.alias}}</text></view>
									</view>
									<view style="flex:1;display: flex;align-items: center;" class="singleEllipsis">
										<view style="display: flex;width: 88rpx;align-items: center;">
											<image v-if="userInfo.redness" :src="$ossUrl(`icon_smartOrganization_grade${userInfo.redness}.png`)" class="img_grade"></image>
											<image :src="$ossUrl('icon_smartOrganization_masses.png')" class="img_masses"></image>
										</view>
										<view style="flex: 1;" class="massesName singleEllipsis" @tap.stop='goGroup(item.orgId)'>{{$isEmpty(item.orgName) ? '暂无' : item.orgName}}</view>
									</view>
								</view>
							</view>
							<image :src="$ossUrl('icon_showActions.png')" class="img_action" @tap.stop='showAction(item,index)'></image>
							<!-- 更多操作 -->
							<view class="moreAction" v-if="item.showStatus==true">
								<view class="delAction" v-if="isShow" @tap.stop='reportThoughts(item)'>
									<!-- <image :src="$ossUrl('pic_corner.png')" class="img_corner"></image> -->
									<view class="del">
										<image :src="$ossUrl('icon_report.png')" class="img_del"></image>
										<view class="">
											举报
										</view>
									</view>
								</view>
								<view class="delAction" v-if="!isShow" @tap.stop='delThoughts(item,index)'>
									<!-- <image :src="$ossUrl('pic_corner.png')" class="img_corner"></image> -->
									<view class="del">
										<image :src="$ossUrl('icon_delete.png')" class="img_del"></image>
										<view class="">
											删除
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="read">
							{{getDateDiff($isEmpty(item.createTime) ? '' : item.createTime)}}
						</view>
					</view>
					<view class="container-item-text" @tap='goDetails(item)'>
						<text space="nbsp">{{$isEmpty(item.content) ? '' : item.content}}</text>
					</view>
					<view class="pics" v-if="item.images.length != 0">
						<image @tap='previewImage(item.images,i)' v-if="item.images.length==1" :src="i" class="img_pic_mult" v-for="i in item.images"
						 :key='i' mode="aspectFill"></image>
						<image @tap='previewImage(item.images,i)' v-if="item.images.length>1" :src="i" class="img_pic" v-for="i in item.images"
						 :key='i' mode="aspectFill"></image>
					</view>
					<view class="location" v-if="!$isEmpty(item.location)">
						{{item.location}}
					</view>
					<view class="link" v-if="item.attach">
						<view class="link-in" @tap='goRelevanceDetails(item.attach)'>
							<image :src="$ossUrl('icon_smartOrganization_file.png')" class="img_file"></image>
							<view class="link-text singleEllipsis">{{item.attach.title}}</view>
							<image :src="$ossUrl('icon_right.png')" class="img_right"></image>
						</view>
					</view>
					<view class="container-item-right-bottom">
						<!-- <button size="mini" class="share" open-type="share" :data-thoughts='item'> -->
						<button size="mini" class="share" :data-thoughts='item' @tap='goDetails(item)'>
							<image :src="$ossUrl('icon_blueShare.png')" class="img_share icon"></image>
							<view class="weChatShare num">
								{{$isEmpty(item.weChatShare) ? '0' : (item.weChatShare>999?'999+':item.weChatShare) }}
							</view>
						</button>
						<view class="comment item" @tap='commentThoughts(item)'>
							<image :src="$ossUrl('icon_comment.png')" class="img_comment icon"></image>
							<view class="commentNum num">
								{{$isEmpty(item.commentNum) ? '0' : (item.commentNum>999?'999+':item.commentNum)}}
							</view>
						</view>
						<view class="good item" @tap='goodThoughts(item)'>
							<image v-if="item.praiseStatus==0" :src="$ossUrl('icon_bluePraise.png')" class="img_good icon"></image>
							<image v-if="item.praiseStatus==1" :src="$ossUrl('icon_bluePraised.png')" class="img_good icon"></image>
							<view class="thumbsUpCount num">
								{{$isEmpty(item.thumbsUpCount) ? '0' : (item.thumbsUpCount>999?'999+':item.thumbsUpCount)}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="thoughtsMore" v-if="data.records.length>0"></uni-load-more>
			<view class="noThumbs" v-if="data.records.length==0">
				<view class="text">
					暂未发布内容
				</view>
			</view>
			<!-- 不是本人且当前页为最后一页 -->
			<view v-if="isShow && data.current == data.pages" :style="{height: userInfo.isFriend?'80rpx':'240rpx'}"></view>
		</view>

		<view class="addFriend">
			<!-- 外层判断是否本人，内层判断是否已是好友 -->
			<view class="addFriend-pic" v-if="isShow">
				<image :src="$ossUrl('icon_smartOrganization_addFriend.png')" v-if="isShow && !userInfo.isFriend" class="img_item img_addFriend"
				 @tap='addFriend'></image>
			</view>
			<view class="weChat" v-if="isShow" @tap='weChat'>
				<image :src="$ossUrl('icon_smartOrganization_weChat.png')" v-if="isShow" class="img_item img_weChat"></image>
				<view class="notice" v-if="unreadCount>0">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import {
		getDateDiff,
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState
	} from "vuex";
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			uniLoadMore
		},
		data() {
			return {
				data: {
					records: [], //说说
				},
				isShow: true, //进入页面是否是自己 默认不是
				isLogin: false,
				defaultAvatar: false,
				userId: 1044,
				userInfo: {
					avatar: '',
					redness: '',
					rank: ''
				},
				storageUserId: '', //本地用戶id
				alias: '', //备注
				remarks: '', //加友理由
				thoughtsId: '', //说说id
				comment: '', //评论
				thoughtsMore: 'more',
				unreadCount: 0,
				menuButton: {
					height: 0,
					right: 0,
					top: 0,
				},
				oss: '',
				titlePadding: '',
				titleLeft: '',
				titleFontColor: 'white',
				bgColor: 'rgba(255, 255, 255, 0)',
				pages: 0,

				isRefresh: true, //控制图片预览后是否刷新页面
				selectShare: null, //点击的分享的说说
			}
		},
		methods: {
			getDateDiff,
			// 聊天
			weChat() {
				if (this.userId > 0) {
					this.$store.commit('createConversationActive', this.userId + '')
					uni.navigateTo({
						url: '/pages/chat/chatRoom/chatRoom?titleName=' + this.userInfo.realName
					})
				}
			},
			// 设置
			goSet() {
				uni.navigateTo({
					url: '/pages/my/myMien/set/set?userInfo=' + JSON.stringify(this.userInfo)
				})
			},
			goGroup(id) {
				uni.navigateTo({
					url: '/pages/group/home/home?id=' + id
				})
			},
			avatarError() {
				console.log('错误')
				this.defaultAvatar = true;
			},
			// 备注
			remark() {
				this.$refs.popup.open()
			},
			cancel() {
				this.$refs.popup.close()
			},
			confirm() {
				this.$http.post('/admin/friend/alias', {
					userId: this.userId, //好友ID
					alias: this.alias, //别名
				}).then(res => {
					console.log('备注', res)

					this.$http.get('/admin/smart_groups/user/info', {
						hideLoading: true,
						params: {
							userId: this.userId
						}
					}).then(res => {
						this.userInfo = res.data.data
						this.$refs.popup.close()
					})
				})
			},
			hideAction() {
				this.data.records.forEach(item => {
					item.showStatus = false
				})
			},
			// 关注
			attention() {
				this.$http.post('admin/follow/user', {
					followId: this.userId, //关注对象的ID
					sign: this.userInfo.isFollow ? 1 : 0, //关注标记(0-关注;1-取消关注)
					type: 1, //关注类型(1-用户；2-组织；3-话题)
					userId: this.storageUserId //账号ID
				}, {
					hideLoading: true
				}).then(res => {
					this.$http.get('/admin/smart_groups/user/info', {
						hideLoading: true,
						params: {
							userId: this.userId
						}
					}).then(res => {
						this.userInfo = res.data.data
					})
				})
			},
			// 输入框加友
			sendInput() {
				if (!this.userInfo.isFriend) {
					console.log(this.userId, this.remarks)
					this.$http.post('/admin/friend/create', {
						receiveId: this.userId, //被加人
						remarks: this.remarks, //理由
					}).then(res => {
						console.log('加友', res)
						this.$refs.addFriendPopup.close()
					})
				}
			},
			// 发送-评论
			sendComment() {
				let _this = this
				console.log(this.comment)
				this.$http.post('/dms/thoughts_comment/create', {
					replyMsg: this.comment, //内容
					thoughtsId: this.thoughtsId, //说说ID
				}).then(res => {
					// console.log('评价成功', res)
					if (res.data.code == 0) {
						this.$refs.commentThoughtsPopup.close()
						this.comment = ''
						this.data.records.forEach(item => {
							if (item.thoughtsId == _this.thoughtsId) {
								item.commentNum += 1
							}
						})
					}
				})
			},
			// 加友-触发输入框
			addFriend() {
				this.$refs.addFriendPopup.open()
			},
			// 解除好友
			relieveFriend() {
				this.$refs.relieveFriendPopup.open()
			},
			cancelFriend() {
				this.$refs.relieveFriendPopup.close()
			},
			// 确定解除好友
			confirmFriend() {
				let _this = this
				this.$http.get('/admin/friend/delete/' + this.userId, {
					hideLoading: true
				}).then(res => {
					console.log('解除', res)
					if (res.data.code == 0) {
						this.$refs.relieveFriendPopup.close()

						_this.$http.get('/admin/smart_groups/user/info', {
							hideLoading: true,
							params: {
								userId: this.userId
							}
						}).then(res => {
							this.userInfo = res.data.data
						})
					}
				})
			},
			// 显示更多
			showAction(item, index) {
				console.log('更多', item, index)

				this.thoughtsId = item.thoughtsId
				if (item.showStatus == false) {
					this.data.records.forEach(item2 => {
						item2.showStatus = false
					})
					item.showStatus = true
				} else if (item.showStatus == true) {
					this.data.records.forEach(item2 => {
						item2.showStatus = false
					})
				}
			},
			// 去说说详情
			goDetails(item) {
				this.selectShare = item.thoughtsId
				uni.navigateTo({
					url: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${item.thoughtsId}`
				})
			},
			// 去关联详情
			goRelevanceDetails(attach) {
				console.log('关联信息', attach)
				this.$http.get('/admin/smart_groups/link/path', {
					hideLoading: true,
					params: {
						type: attach.type, //材料：material；活动：activity；魔方：products；文章：article
						id: attach.relationId, //关联id
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
			// 图片预览
			previewImage(images, i) {
				this.isRefresh = true
				uni.previewImage({
					urls: images,
					current: i
				});
			},
			// 举报
			reportThoughts(item) {
				console.log(item.thoughtsId)
				uni.navigateTo({
					url: '/pages/report/report?id=' + item.thoughtsId
				});
			},
			// 删除
			delThoughts(item, index) {
				console.log(item)
				let _this = this
				this.$http.post('/dms/thoughts/delete/batch', [item.thoughtsId], {
					hideLoading: true
				}).then(res => {
					console.log('删除', res)
					this.data.records.forEach(item => {
						if (item.thoughtsId == _this.thoughtsId) {
							_this.data.records.splice(index, 1)
						}
					})
				})
			},
			// 评价
			commentThoughts(item) {
				this.thoughtsId = item.thoughtsId
				this.$refs.commentThoughtsPopup.open()
			},
			// 点赞
			goodThoughts(item) {
				this.thoughtsId = item.thoughtsId
				let _this = this
				// console.log('点赞', item.thoughtsId)
				this.$http.get('/dms/thoughts/add_thumbs_up/' + item.thoughtsId, {
					hideLoading: true
				}).then(res => {
					// console.log('点赞', res)
					this.data.records.forEach(item => {
						if (item.thoughtsId == _this.thoughtsId) {
							if (item.praiseStatus == 0) {
								item.praiseStatus = 1
								item.thumbsUpCount += 1
							} else if (item.praiseStatus == 1) {
								item.praiseStatus = 0
								item.thumbsUpCount -= 1
							}
						}
					})
				})
			},
			back() {
				if (this.pages < 2) {
					uni.reLaunch({
						url: '/pages/community/home/home'
					})
				} else {
					uni.navigateBack();
				}
			},
		},
		onPageScroll(e) {
			this.data.records.forEach(item => {
				item.showStatus = false
			})

			this.bgColor = 'rgba(255, 255, 255, ' + 1 / 200 * e.scrollTop + ')'
			if (e.scrollTop > 200) {
				this.titleFontColor = 'black';
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: '#FFFFFF',
				});
			} else {
				this.titleFontColor = 'white';
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#FFFFFF',
					fail(e) {}
				});
			}
			if (!(e.scrollTop < this.titleHeight - this.menuButton.height - this.menuButton.top - this.titlePadding)) {
				this.isScroll = true;
			} else {
				this.isScroll = false;
			}
		},
		onShareAppMessage(res) {
			let _that = this
			if (res.from === 'button') { // 来自页面内分享按钮
				if (res.target.dataset.thoughts) { //说说分享
					this.$http.get(`dms/thoughts/we_chat/share/save/${res.target.dataset.thoughts.thoughtsId}`, {
						hideLoading: true
					}).then(resp => {
						_that.data.records.forEach(item => {
							if (item.thoughtsId == res.target.dataset.thoughts.thoughtsId) {
								item.weChatShare += 1
							}
						})
					})
					return {
						title: `我分享了${res.target.dataset.thoughts.userName}的内容，快去看看吧`,
						path: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${res.target.dataset.id}`,
						// imageUrl:`/pages/community/home/thoughtsDetails/thoughtsDetails?id=${res.target.dataset.id}`
					}
				} else if (res.target.id) { //页面分享
					return {
						title: `我分享了${this.userInfo.realName}的个人风采页，快去看看吧`,
						path: '/pages/my/myMien/myMien?userId=' + this.userId,
					}
				}
			}
		},
		computed: {
			...mapState({
				conversationList: state => state.conversationList
			})
		},
		watch: {
			conversationList: {
				handler(newName, oldName) {
					this.conversationList.forEach(item => {
						if (item.type == 'C2C') {
							if (item.userProfile.userID == this.userId) {
								this.unreadCount = item.unreadCount;
							}
						}
					})
				},
				deep: true
			}
		},
		onShow() {
			this.data.records.forEach(item => {
				item.showStatus = false
			})

			let that = this;
			// 风采页-个人信息
			this.$http.get('/admin/smart_groups/user/info', {
				hideLoading: true,
				params: {
					userId: this.userId
				}
			}).then(res => {
				this.userInfo = res.data.data
				this.alias = res.data.data.alias
				this.conversationList.forEach(item => {
					if (item.type == 'C2C') {
						if (item.userProfile.userID == that.userId) {
							this.unreadCount = item.unreadCount;
							console.log('onshow', this.unreadCount)
						}
					}
				})
			})
			if (this.isRefresh) {
				this.isRefresh = false; //控制预览后是否刷新页面
				return;
			} else {
				console.log('refresh...')
				this.data.records.forEach(item => {
					if (item.thoughtsId == this.selectShare) {
						// 获取详情
						this.$http.get(`dms/thoughts/smart_org/${this.selectShare}`, {
							hideLoading: true
						}).then(res => {
							// console.log('详情分享数：',res.data.data.weChatShare,'当前分享数：',item.weChatShare)
							if (item.weChatShare != res.data.data.weChatShare) {
								item.weChatShare += 1
							}
							if (item.commentNum != res.data.data.commentNum) {
								item.commentNum += 1
							}
						})
					}
				})
				// 说说
				// this.$http.get('/dms/thoughts/smart_org/page', {
				// 	hideLoading:true,
				// 	params: {
				// 		// current: 1,
				// 		size: 10,
				// 		id: this.userId, //所查个人用户的用户id
				// 	}
				// }).then(res => {
				// 	this.data = res.data.data
				// 	if (this.data.current < this.data.pages) {
				// 		this.thoughtsMore = 'more'
				// 	} else {
				// 		this.thoughtsMore = 'noMore'
				// 	}
				// 	this.data.records = this.data.records.map(item => {
				// 		return {
				// 			...item,
				// 			showStatus: false
				// 		}
				// 	})
				// })
			}
		},
		onLoad(opt) {
			let that = this;
			this.oss = this.$oss
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			console.log('菜单按钮信息',uni.getMenuButtonBoundingClientRect())
			this.titleLeft = uni.getSystemInfoSync().windowWidth - uni.getMenuButtonBoundingClientRect().right
			this.titlePadding = uni.getMenuButtonBoundingClientRect().top - uni.getSystemInfoSync().statusBarHeight;
			this.pages = getCurrentPages().length
			this.userId = opt.userId
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'))
			this.storageUserId = uni.getStorageSync('user').userId
			if (this.isLogin) {
				if (this.storageUserId == this.userId) {
					this.isShow = false
				}
			}
			// 说说
			this.$http.get('/dms/thoughts/smart_org/page', {
				hideLoading: true,
				params: {
					current: 1,
					size: 10,
					id: this.userId, //所查个人用户的用户id
				}
			}).then(res => {
				this.data = res.data.data
				if (this.data.current < this.data.pages) {
					this.thoughtsMore = 'more'
				} else {
					this.thoughtsMore = 'noMore'
				}
				this.data.records = this.data.records.map(item => {
					return {
						...item,
						showStatus: false
					}
				})
			})
		},
		onReachBottom() {
			if (this.data.current < this.data.pages) {
				this.thoughtsMore = 'loading'
				this.$http.get('/dms/thoughts/smart_org/page', {
					hideLoading: true,
					params: {
						current: this.data.current + 1,
						size: 10,
						id: this.userId, //所查个人用户的用户id
					}
				}).then(res => {
					this.data.current = res.data.data.current
					if (this.data.current < this.data.pages) {
						this.thoughtsMore = 'more'
					} else {
						this.thoughtsMore = 'noMore'
					}
					this.data.records = this.data.records.concat(res.data.data.records.map(item => {
						return {
							...item,
							showStatus: false
						}
					}))
				})
			}
		},
	}
</script>
<style lang="scss">
	.myMien {
		@extend %safe-bottom-box;

		.remark-box {
			padding: 40rpx;
			width: 550rpx;
			height: 386rpx;
			background-color: #FFFFFF;
			border-radius: 32rpx;
			box-sizing: border-box;

			.title {
				text-align: center;
				font-size: 36rpx;
				font-weight: 500;
				color: #333333;
			}

			.uni-input {
				padding: 22rpx 0;
				border-bottom: 2rpx solid #EFF0F1;
				margin: 40rpx 0;
			}

			.btns {
				text-align: center;

				.btn {
					width: 216rpx;
					height: 88rpx;
					line-height: 88rpx;
				}

				.cancel {
					margin-right: 24rpx;
				}
			}
		}

		.popup_input {
			padding: 30rpx;
			background-color: #F4F5F6;
			display: flex;
			font-size: 28rpx;
			align-items: flex-end;

			.inputDefault {
				color: #919397;
				padding: 20rpx;
				line-height: 48rpx;
			}

			textarea {
				flex: 1;
				padding: 20rpx;
				line-height: 48rpx;
				background-color: #FFFFFF;
				color: #666769;
				border-radius: 20rpx;
				height: 184rpx;
			}

			.textSend {
				background-color: #07C160;
				padding: 12rpx 24rpx;
				border-radius: 8rpx;
				border-radius: 4px;
				color: #FFFFFF;
			}
		}

		.comment_input {
			padding: 16rpx 24rpx;
			background-color: #F4F5F6;
			display: flex;
			align-items: center;

			input {
				flex: 1;
				background-color: #FFFFFF;
				color: #666769;
				border-radius: 20rpx;
				font-size: 28rpx;
				margin-right: 24rpx;
				height: 80rpx;
				padding: 0 24rpx;
			}

			.textSend0 {
				width: 104rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				background-color: #EFF0F1;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #BABEC0;
			}

			.textSend1 {
				width: 104rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				background-color: #07C160;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}

		.relieveFriend-box {
			width: 552rpx;
			height: 256rpx;
			background-color: #FFFFFF;
			border-radius: 32rpx;
			padding: 40rpx 48rpx;
			box-sizing: border-box;

			.title {
				font-size: 32rpx;
				font-weight: 400;
				color: #303031;
				text-align: center;
				margin-bottom: 40rpx;
			}

			.btns {
				text-align: center;

				.btn {
					width: 216rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-weight: 400;
					font-size: 32rpx;
				}

				.cancel {
					color: #919397;
					margin-right: 24rpx;
				}

				.confirm {
					color: #FFFFFF;
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

			.home {
				align-self: flex-start;
				width: 44rpx;
				height: 44rpx;
				margin-left: 15rpx;
				margin-top: 15rpx;
			}

			.immersive-title {
				flex: 1;
				text-align: center;
				font-size: 34rpx;
				line-height: 48rpx;
				justify-content: center;

				.title {
					display: inline-block;
					width: 160rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.mienName {
					font-weight: 500;
					color: #303031;
				}
			}
		}

		.myMien-bg {
			box-sizing: border-box;
			width: 100%;
			height: 668rpx;
			background-image: url("https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_bg_black.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding-top: 212rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;



			.myMien-bg-top {
				display: flex;
				justify-content: space-between;

				.img_head {
					width: 144rpx;
					height: 144rpx;
					border-radius: 32rpx;
					border: 4rpx solid #FFFFFF;
				}

				.btns {
					align-self: flex-end;

					.btn {
						height: 64rpx;
						line-height: 64rpx;
						border-radius: 32rpx;
					}

					.remark {
						width: 104rpx;
						padding: 0;
						margin-right: 24rpx;
					}

					.attention {
						width: 152rpx;
					}

					.set {
						margin-left: 24rpx;
					}

					.attention-no {
						width: 152rpx;
						background-color: #F4F5F6;
						color: #919397;
					}
				}
			}

			.myMien-bg-middle {
				height: 64rpx;
				margin-top: 24rpx;
				display: flex;
				align-items: center;

				.name {
					font-size: 40rpx;
					font-weight: 500;
					color: #FFFFFF;
					max-width: 442rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				.img_sex {
					width: 36rpx;
					height: 36rpx;
					margin-left: 8rpx;
				}

				.img_grade {
					width: 44rpx;
					height: 44rpx;
					margin: 0 8rpx;
				}

				.img_partner {
					width: 130rpx;
					height: 44rpx;
				}
			}

			.fans-attention {
				color: #FFFFFF;
				margin: 10rpx 0;

				.fans,
				.attention {
					font-size: 36rpx;
					font-weight: 600;
					margin-right: 8rpx;
				}

				.attention {
					margin-left: 34rpx;
				}

				.span {
					font-size: 26rpx;
					color: rgba(255, 255, 255, .8);
				}
			}

			.introduce-text {
				// height: 72rpx;
				font-size: 26rpx;
				font-weight: normal;
				color: rgba(255, 255, 255, .8);
				white-space: normal;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				word-break: break-all;

			}
		}

		.pageShareWhite {
			padding: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background: transparent;
			border-radius: 16px;
			position: fixed;
			z-index: 100000;
		}

		.img_pageShare {
			width: 44rpx;
			height: 44rpx;
			display: block;
		}

		.pageShare {
			padding: 0;
			margin: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 16px;
			border: 2rpx solid rgba(151, 151, 151, 0.2);
			position: fixed;
			z-index: 100000;
		}

		.container {
			padding: 0 32rpx;
			background-color: #FFFFFF;
			border-radius: 32rpx 32rpx 0px 0px;
			margin-top: -40rpx;
			padding-top: 40rpx;
			box-sizing: border-box;

			.noThumbs {
				margin-top: 100rpx;
			}

			.text {
				text-align: center;
				font-size: 28rpx;
				font-weight: 400;
				color: #666769;

			}

			.container-item {
				display: flex;
				box-sizing: border-box;
				margin-bottom: 40rpx;

				.img_head {
					width: 88rpx;
					height: 88rpx;
					border-radius: 24rpx;
					margin-right: 24rpx;
					flex-shrink: 0;
				}

				.container-item-right {
					border-bottom: 2rpx solid #EFF0F1;
					flex: 1;

					.container-item-right-top {
						height: 88rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;

						.name-more {
							position: relative;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.name-more-left-box {
								max-width: 510rpx;

								.name-more-left {
									display: flex;
									align-items: center;

									.name {
										max-width: 250rpx;
										text-overflow: ellipsis;
										overflow: hidden;
										white-space: nowrap;
										font-size: 32rpx;
										font-weight: 500;
										color: #303031;
										flex-shrink: 0
									}

									.img_grade {
										width: 44rpx;
										height: 44rpx;
										flex-shrink: 0;
									}

									.img_masses {
										width: 36rpx;
										height: 36rpx;
										flex-shrink: 0;
									}

									.massesName {
										font-size: 26rpx;
										font-weight: 400;
										color: #07C160;
										flex-shrink: 0;
									}
								}

							}


							.moreAction {
								position: absolute;
								bottom: -15rpx;
								right: 50rpx;

								.delAction {
									display: flex;
									flex-direction: column;

									.del {
										width: 152rpx;
										height: 70rpx;
										background-color: #4C4C4C;
										display: flex;
										justify-content: center;
										align-items: center;
										border-radius: 8rpx;
										color: #FFFFFF;
										font-size: 28rpx;
										font-weight: 400;
										margin-top: -2rpx;

										.img_del {
											width: 32rpx;
											height: 32rpx;
											display: block;
											margin-right: 8rpx;
										}
									}
								}
							}

							.img_action {
								width: 44rpx;
								height: 44rpx;
								margin-left: 24rpx;
							}
						}

						.read {
							font-size: 26rpx;
							font-weight: 400;
							color: #919397;
						}
					}

					.container-item-text {
						font-size: 30rpx;
						font-weight: 400;
						color: #303031;
						line-height: 44rpx;
						margin-top: 16rpx;
						word-break: break-all;
					}

					.pics {
						display: flex;
						align-items: center;
						justify-content: flex-start;
						flex-wrap: wrap;
						margin-left: -8rpx;
						margin-top: 20rpx;

						.img_pic {
							width: 186rpx;
							height: 186rpx;
							border-radius: 8rpx;
							margin-bottom: 8rpx;
							margin-left: 8rpx;
						}

						.img_pic_mult {
							width: 460rpx;
							height: 344rpx;
							border-radius: 8rpx;
						}
					}

					.location {
						padding-top: $spacing-base;
						color: #919397;
						font-size: 26rpx;
						line-height: 36rpx;
					}

					.link {
						display: flex;

						.link-in {
							height: 56rpx;
							border-radius: 28rpx;
							background: #F4F5F6;
							margin-top: 24rpx;
							display: flex;
							align-items: center;
							padding: 0 12rpx;
						}

						.img_file {
							width: 34rpx;
							height: 34rpx;
							margin-right: 14rpx;
						}

						.link-text {
							max-width: 470rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #666769;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}

						.img_right {
							width: 44rpx;
							height: 44rpx;
						}
					}

					.container-item-right-bottom {
						display: flex;
						justify-content: space-between;
						margin: 30rpx 0;

						.item {
							font-size: 24rpx;
							font-weight: 400;
							color: #576B95;
							display: flex;
							align-items: center;

							.icon {
								width: 32rpx;
								height: 32rpx;
								margin-right: 8rpx;
							}
						}

						.num {
							width: 60rpx;
							text-align: left;
						}

						.share {
							font-size: 24rpx;
							font-weight: 400;
							color: #576B95;
							display: flex;
							margin: 0;
							padding: 0;
							background-color: #FFFFFF;

							.icon {
								width: 32rpx;
								height: 32rpx;
								margin-right: 8rpx;
							}
						}
					}
				}
			}
		}

		.addFriend {
			position: fixed;
			right: 24rpx;
			bottom: 24rpx;
			@extend %safe-bottom;
			.addFriend-pic {

				.img_addFriend {
					margin-bottom: 48rpx;
				}
			}

			.weChat {
				position: relative;

				.notice {
					width: 20rpx;
					height: 20rpx;
					border-radius: 20rpx;
					background-color: #F74437;
					position: absolute;
					top: 16rpx;
					right: 30rpx;
				}
			}

			.img_item {
				width: 112rpx;
				height: 112rpx;
				display: block;
				border-radius: 50%;
				box-shadow: 2px 2px 8px -3px #07C160;
			}
		}
	}
</style>
