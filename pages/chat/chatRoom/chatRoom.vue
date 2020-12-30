<template>
	<view>
		<scroll-view scroll-y :scroll-top="scrollTop" :style="{height: pageHeight+'px'}" :scroll-with-animation="scrollAnimation"
		 :scroll-into-view="scrollToView" @scroll="scroll" refresher-enabled @refresherrefresh="pulldown"
		 :refresher-triggered="pulldownStatus" @tap="clickChatView">
			<view v-for="(item,index) in msgList" :key="item.ID" :id="item.ID" v-if="item.from !='@TIM#SYSTEM'">
				<view class="chatTop" v-if="index == 0">
				</view>
				<view class="time" v-if="index == 0 || item.time - msgList[index-1].time > 300">
					{{formatChatTime(new Date(item.time * 1000))}}
				</view>
				<so-chat-conversation-item :itemData="item" :TIM="TIM" :myProfile="MyProfile" :userProfile="UserProfile"></so-chat-conversation-item>
			</view>
			<view class="chatBottom" v-if="moreShow" style="height: 244rpx;">
			</view>
			<view class="chatBottom" v-if="emojiShow" style="height: 400rpx;">
			</view>
		</scroll-view>
		<view class="bottom" :class="{'safe-bottom': !keyboardShow}">
			<view class="bottom-view">
				<textarea cursor-spacing="200" :style="{height:lineCount*44 + 'rpx',width: textMsg.length<1?486 + 'rpx':442 + 'rpx' }"
				 :show-confirm-bar="false" v-model="textMsg" @confirm="sendText" @linechange="linechange" @focus="focus" @blur="blur"
				 @keyboardheightchange="keyboardheightchange" :disable-default-padding="false" maxlength="7000" />
				<view class="bottom-right">
					<image :src="$ossUrl('icon_chat_emoji.png')" class="icon-lg icon-emoji" mode="" @tap="emoji"></image>
					<image :src="$ossUrl('icon_chat_add.png')" class="icon-lg" v-if="textMsg.length<1" @tap="add"></image>
					<button class="button-sm" v-else @tap="sendText">发送</button>
				</view>
			</view>
			<view class="more" v-if="moreShow">
				<view class="more-item" @tap="chooseImg">
					<image class="more-item-icon" :src="$ossUrl('icon_chat_img.png')"></image>
					<view class="more-item-text">
						图片
					</view>
				</view>
				<view class="more-item" @tap="chatFunction">
					<image class="more-item-icon" :src="$ossUrl('icon_chat_function.png')"></image>
					<view class="more-item-text">
						功能
					</view>
				</view>
				<view class="more-item" @tap="goGroup" v-if="conversationActive.type == 'GROUP'">
					<image class="more-item-icon" :src="$ossUrl('icon_chat_gogroup.png')"></image>
					<view class="more-item-text">
						进入群组
					</view>
				</view>
				<view class="more-item" @tap="manageGroup" v-if="GroupMemberProfile.role == TIM.TYPES.GRP_MBR_ROLE_OWNER || GroupMemberProfile.role == TIM.TYPES.GRP_MBR_ROLE_ADMIN">
					<image class="more-item-icon" :src="$ossUrl('icon_chat_management.png')"></image>
					<view class="more-item-text">
						群管理
					</view>
				</view>
			</view>
			<scroll-view class="emojis-view" scroll-y v-if="emojiShow">
				<view class="emojis safe-bottom">
					<view v-for="(emojiItem, index3) in emojiName" class="emoji" :key="emojiItem" @click="chooseEmoji(emojiItem)">
					  <image :src="emojiUrl + emojiMap[emojiItem]" style="width:100%;height:100%"/>
					</view>
					<view class="emoji-del safe-bottom">
						<view class="emoji-del-view" @tap="delmsg">
							<image v-if="textMsg.length>0" :src="this.$ossUrl('icon_chat_del_black.png')" class="emoji-del-icon"></image>
							<image v-else :src="this.$ossUrl('icon_chat_del_gray.png')" class="emoji-del-icon"></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<uni-popup ref="chatFunction" type="bottom" customStyle="background-color: #F4F5F6;border-radius:16rpx 16rpx 0 0">
			<view class="function">
				<image :src="$ossUrl('icon_chat_function_down.png')" class="icon-down" @tap="popclose"></image>
				<view class="function-list">
					<view class="function-item" @tap="goIcan">
						<image :src="$ossUrl('icon_chat_function_woneng.png')" class="function-img"></image>
						<view class="function-title">我能</view>
					</view>
					<view class="function-item" @tap="goMagic">
						<image :src="$ossUrl('icon_chat_function_magic.png')" class="function-img"></image>
						<view class="function-title">魔方商城</view>
					</view>
					<view class="function-item" @tap="goShop">
						<image :src="$ossUrl('icon_chat_function_aixiaofei.png')" class="function-img"></image>
						<view class="function-title">爱消费</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import { emojiName, emojiMap, emojiUrl } from '@/utils/emojiMap'
	import {
		formatChatTime
	} from '@/utils/index.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components:{
			uniPopup
		},
		data() {
			return {
				conversationActive: null, //活动中的对话
				toUserId: '', //im发送的目标id
				UserProfile: null,//目标用户信息
				MyProfile: null,//我的用户信息
				GroupMemberProfile: {
					role: ''
				}, //群组用户信息
				nextReqMessageID: '',
				count: 15,//条目
				isCompleted: '',
				msgList: [],//消息列表
				TIM: null,
				pulldownStatus: false,
				scrollToView: '',
				
				emojiName: emojiName,
				emojiMap: emojiMap,
				emojiUrl: emojiUrl,
				scrollAnimation: false, //滚动动画
				moreShow: false,
				emojiShow: false,
				keyboardShow : false,//键盘是否弹起
				windowHeight: 0,
				windowWidth: 0,
				pageHeight:0,
				scrollHeight:999999,
				
				//文字消息
				textMsg:'',
				scrollTop: 0,
				old: {
					scrollTop: 0,
					},
				autoScroll:true,
				lineCount: 1,
			};
		},
		computed: {
			...mapState({
				currentMessageList: state => state.currentMessageList,
			})
		},
		watch: {
			currentMessageList(newVal, oldVal) {
				this.screenMsg(newVal, oldVal)
			},
			moreShow(newVal, oldVal){
				if(newVal == true){
					this.goBottom()
				}else{
					
				}
			},
			emojiShow(newVal, oldVal){
				if(newVal == true){
					this.goBottom()
				}else{
					
				}
			}
		},
		methods: {
			goGroup(){
				uni.navigateTo({
					url:'/pages/group/home/home?id=' + this.toUserId
				})
			},
			getGroupMemberProfile(groupID,userIDList){
				let that = this;
				let promise = that.$tim.getGroupMemberProfile({
				  groupID: groupID,
				  userIDList: userIDList, // 请注意：即使只拉取一个群成员的资料，也需要用数组类型，例如：userIDList: ['user1']
				  // memberCustomFieldFilter: ['group_member_custom'], // 筛选群成员自定义字段：group_member_custom
				});
				promise.then(function(imResponse) {
				  console.log(imResponse.data.memberList); // 群成员列表
				  that.GroupMemberProfile = imResponse.data.memberList[0]
				}).catch(function(imError) {
				  console.warn('getGroupMemberProfile error:', imError);
				});
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
			chatFunction(){
				this.moreShow = false;
				this.emojiShow = false;
				this.$refs.chatFunction.open()
			},
			popclose(){
				this.$refs.chatFunction.close()
			},
			formatChatTime,
			manageGroup(){
				uni.navigateTo({
					url: '/pages/group/home/manageGroup/manageGroup?isChat=ture&id='+ this.toUserId
				})
			},
			delmsg(){
				this.textMsg = this.textMsg.slice(0,this.textMsg.length - 1)
			},
			// 发消息选中emoji
			chooseEmoji (item) {
			  this.textMsg += item
			},
			chooseImg(){
				let that = this;
				wx.chooseImage({
				// sourceType: ['album'], // 从相册选择
				count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
				success: function (res) {
				  // 2. 创建消息实例，接口返回的实例可以上屏
				  let message = that.$tim.createImageMessage({
				    to: that.toUserId,
				    conversationType: that.$store.state.conversationType,
				    payload: { file: res },
				    onProgress: function(event) { console.log('file uploading:', event) }
				  });
				  // 3. 发送图片
				  let promise = that.$tim.sendMessage(message);
				  promise.then(function(imResponse) {
				    // 发送成功
				    console.log(imResponse);
					that.msgList.push(imResponse.data.message);
					that.moreShow = false;
				  }).catch(function(imError) {
				    // 发送失败
				    console.warn('sendMessage error:', imError);
				  });
				}
				})
			},
			clickChatView(){
				this.moreShow = false;
				this.emojiShow = false;
			},
			keyboardheightchange(){
					this.moreShow = false;
			},
			add(){
				this.moreShow = true;
				this.emojiShow = false;
			},
			emoji(){
				this.emojiShow = true;
				this.moreShow = false;
			},
			// 将某会话下所有未读消息已读上报
			setMessageRead(){
				if(this.conversationActive.conversationID){
					let promise = this.$tim.setMessageRead({conversationID: this.conversationActive.conversationID});
					promise.then(function(imResponse) {
						// 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
						}).catch(function(imError) {
							// 已读上报失败
							console.warn('setMessageRead error:', imError);
							});
					}
				},
			pulldown(){
				let that = this;
				this.pulldownStatus = true;
				this.scrollAnimation = false;
				// 更多消息列表
					let conversationID = this.conversationActive.conversationID
					let lastReqMessageID = this.nextReqMessageID
					if(this.$isEmpty(lastReqMessageID)){ 
						try{
							lastReqMessageID = this.msgList[0].ID
						}catch(e){
							//TODO handle the exception
						}
					}
					let promise = this.$tim.getMessageList({conversationID: conversationID,nextReqMessageID:lastReqMessageID,count: this.count});
					promise.then((res)=> {
					  this.$store.commit('unshiftCurrentMessageList',  res.data.messageList)
					  this.$nextTick(function(){//控制scroll滑动到上一次消息的位置
					  	this.scrollToView = lastReqMessageID;
						this.$nextTick(function(){
							this.scrollAnimation = true
						})
					  })
					  this.nextReqMessageID =  res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
					  this.isCompleted =  res.data.isCompleted
					  this.pulldownStatus = false;
					});
			},
			goBottom(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = this.scrollHeight;
					this.scrollAnimation = true; //首次接收到消息后打开页面滚动动画
				})
			},	
			scroll(e){
				this.old.scrollTop = e.detail.scrollTop;
				this.scrollHeight = e.detail.scrollHeight;
				if(e.detail.scrollHeight- e.detail.scrollTop > this.pageHeight + 10){
					this.autoScroll = false;
				}
				else{
					this.autoScroll = true;
				}
			},
			focus(){
				this.keyboardShow = true;
				this.emojiShow = false;
			},
			blur(){
				this.keyboardShow = false
			},
			linechange(e){
				this.$nextTick(function(){
					if(e.detail.lineCount<1){
						this.lineCount = 1;
					}
					else if(e.detail.lineCount>3){
						this.lineCount = 3;
					}
					else{
						this.lineCount = e.detail.lineCount;
					}
				})
			},
			// 发送消息
			sendMsg(content,type){
				let that = this;
				let message = this.$tim.createTextMessage({
				  to: this.toUserId,
				  conversationType: that.$store.state.conversationType,
				  payload: {
				    text: content.text
				  },
				  type: type
				});	
				this.$store.commit('pushCurrentMessageList', message)
				let pomise = this.$tim.sendMessage(message)
				pomise.then(res=>{
					console.log(res)
				})	
			},
			// 发送文字消息
			sendText(){
				if(!this.textMsg){
					return;
				}
				if (this.textMsg.match(/^\s*$/)){
					uni.showModal({
					    content: '不能发送空白消息',
						showCancel: false,
					    success: function (res) {
					        if (res.confirm) {
					            console.log('用户点击确定');
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					}
					else{
						let msg = {text:this.textMsg}
						this.sendMsg(msg,'TIMTextElem');
					}
					this.textMsg = '';//清空输入框
			},
			//聊天的节点加上外层的div
			nodesFliter(str) {
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
				return nodeStr
			},
			//时间过滤
			// timeFliter(timer) {
			// 	let timeData = new Date(timer * 1000)
			// 	let str = this.$common.dateTimeFliter(timeData)
			// 	return str
			// },
			// 加载初始页面消息
			getMsgList() {
				// 历史消息列表
				let conversationID = this.conversationActive.conversationID
				let promise = this.$tim.getMessageList({
					conversationID: conversationID,
					count: this.count
				});
				promise.then((res) => {
					this.$store.commit('pushCurrentMessageList', res.data.messageList)
					this.nextReqMessageID = res.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
					this.isCompleted = res.data.isCompleted
					// this.scrollToView = res.data.messageList[res.data.messageList.length - 1].ID
					console.log(this.nextReqMessageID)
				});
			},
			// 接受消息(定位消息)
			screenMsg(newVal,oldVal){
				this.msgList = newVal;
				this.$nextTick(function(){
					if(this.autoScroll){
						this.goBottom()
					}
				})
			},
			getUserProfile(userList) {
				let that = this;
				let promise = this.$tim.getUserProfile({
					userIDList: userList // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
				});
				promise.then(function(imResponse) {
					console.log(imResponse.data); // 存储用户资料的数组 - [Profile]
					that.UserProfile = imResponse.data[0];
				}).catch(function(imError) {
					console.log('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
				});
			},
			getMyProfile() {
				let that = this;
				let promise = this.$tim.getMyProfile();
				promise.then(function(imResponse) {
					that.MyProfile = imResponse.data;
					console.log(imResponse.data); // 个人资料 - Profile 实例
					if(that.conversationActive.type == 'GROUP') {
						that.getGroupMemberProfile(that.$store.state.toUserId,[that.MyProfile.userID])
					}
				}).catch(function(imError) {
					console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
				});
			},
		},
		onLoad(option) {
			let that = this;
			// this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			this.TIM = this.$TIM;
			this.conversationActive = this.$store.state.conversationActive;
			this.getUserProfile([this.$store.state.toUserId]);
			this.getMyProfile();
			this.toUserId = this.$store.state.toUserId;
			uni.setNavigationBarTitle({
				title: option.titleName
			});
			this.getMsgList();
			uni.createSelectorQuery()
				.in(this)
				.select('.bottom')
				.boundingClientRect()
				.exec(ret => {
					that.windowHeight = uni.getSystemInfoSync().windowHeight;
					that.windowWidth = uni.getSystemInfoSync().windowWidth;
					that.pageHeight = that.windowHeight - ret[0].height;
				});
		},
		onShow() {
			// this.scrollTop = this.scrollHeight;
		},
		onUnload() {
			this.setMessageRead()
			let pages = getCurrentPages();
			//页面注销时读取页面栈，返回到第一个聊天窗口前
			for(let i = 0;i<pages.length;i++){
				if(pages[i].route == 'pages/chat/chatRoom/chatRoom'){
					if(pages.length - i > 1){
						uni.navigateBack({
							delta:pages.length - i -1
						})
					}
					return;
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #EFF0F1;
	}
	.function{
		background-color: #F4F5F6;
		height: 500rpx;
		border-radius: 32rpx 32rpx 0 0;
		box-shadow: 0 -2rpx 4rpx 0 rgba(0, 0, 0, 0.03);
		padding: 24rpx 40rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.icon-down{
			width: 64rpx;
			height: 40rpx;
		}
		.function-list{
			width: 100%;
			margin-top: 60rpx;
			display: flex;
			
			.function-item{
				width: 104rpx;
				height: 144rpx;
				padding: 0 32rpx;
				.function-img{
					width: 104rpx;
					height: 104rpx;
				}
				.function-title{
					margin-top: 8rpx;
					line-height: 32rpx;
					text-align: center;
					font-size: 24rpx;
					color: #303031;
				}
			}
		}
	}
	.chatTop{
		height: 40rpx;
	}
	.time{
		color: #919397;
		font-size: 26rpx;
		line-height: 36rpx;
		text-align: center;
		padding-bottom: 40rpx;
	}
	.bottom {
		width: 750rpx;
		position: fixed;
		bottom: 0;
		background: #F4F5F6;
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px #BABEC0;
		.bottom-view{
			display: flex;
			justify-content: space-between;
			padding: 16rpx 24rpx;
			align-items: center;
				textarea{
					font-size: 30rpx;
					line-height: 44rpx;
					border-radius: 16rpx;
					padding: 16rpx 24rpx;
					background-color: $color-white;
					margin-right: 24rpx;
				}
			
			.bottom-right{
				display: flex;
				flex: 1;
			}
			.icon-emoji{
				margin-right: 24rpx;
			}
		}
		.more{
			height: 244rpx;
			padding: 16rpx 15rpx;
			display: flex;
			.more-item{
				width: 180rpx;
				height: 180rpx;
				margin: 16rpx 0;
				text-align: center;
				.more-item-icon{
					height: 128rpx;
					width: 128rpx;
				}
				.more-item-text{
					margin-top: 12rpx;
					color: #666769;
					font-size: 24rpx;
					line-height: 32rpx;
				}
			}
		}
		.emojis-view{
			height: 400rpx;
			background-color: #EFF0F1;
			.emojis{
				padding: 0 40rpx 60rpx 20rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.emoji{
					margin-left: 20rpx;
					margin-top: 12rpx;
					height: 64rpx;
					width: 64rpx;
				}
				.emoji-del{
					position: fixed;
					right: 0;
					bottom: 0;
					// background-color: #EFF0F1;
					background-image: linear-gradient(to bottom right, #EFF0F100 0%, #EFF0F1 50%);
					padding-left: 64rpx;
					padding-top: 20px;
					.emoji-del-view{
						border-radius: 8rpx;
						background-color: #FFFFFF;
						padding: 10rpx 24rpx;
						margin: 0 40rpx 20rpx 0;
						.emoji-del-icon{
							width: 56rpx;
							height: 44rpx;
						}
					}
				}
			}
		}
	}
</style>
