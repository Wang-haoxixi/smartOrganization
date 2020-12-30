<template>
	<view class="safe-bottom">
		<view class="title">
			<so-search @handleSearch="search"></so-search>
			<view class="mailList">
				<image :src="$ossUrl('icon_mailList.png')" class="icon-sm" @tap="goFriend"></image>
				<view class="mailList-text">
					通讯录
				</view>
			</view>
		</view>
		<so-chat-list-item :itemData="item" :name="item.userProfile.nick" :content="item.lastMessage.messageForShow" :time="formatTime(new Date(item.lastMessage.lastTime * 1000))"
		 v-for="(item,index) in showList" :key="index" @tap="chatRoom(item)"></so-chat-list-item>
		<view class="defalt-text" v-if="!showList.length>0">
			暂无聊天信息
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import {
		formatTime
	} from '@/utils/index.js'
	// import {
	// 	getLocalTime
	// } from '@/common/utils.js'
	export default {
		data() {
			return {
				userAddConversationList: [],
				showList: []
			}
		},
		computed: {
			...mapState({
				isLogin: state => state.isLogin,
				isSDKReady: state => state.isSDKReady,
				conversationList: state => state.conversationList,
			})
		},
		watch: {
			isSDKReady(val) {
				//isSDKReady == true 请求会话列表
				if (val) {
					this.getConversationList()
				}
			},
			conversationList(val) {
				this.getUserInfo(val)
			}
		},
		methods: {
			search(text) {
				this.showList = [];
				this.showList = this.userAddConversationList.filter(item => {
					if (item.type == 'C2C') {
						return item.userProfile.nick.indexOf(text) > -1
					} else if (item.type == 'GROUP') {
						return item.groupProfile.name.indexOf(text) > -1
					}
				});
				// this.userAddConversationList.forEach(res => {
				// 	let item = [];
				// 	console.log(res)
				// 	item = res.filter(item => item.userProfile.nick.indexOf(text) > -1);
				// 	if (item.length > 0) this.showList.push({
				// 		dataList: item,
				// 		letter: res.letter
				// 	});
				// });
			},
			goFriend() {
				uni.navigateTo({
					url: '../friendList/friendList'
				})
			},
			formatTime,
			chatRoom(item) {
				if (item.type == 'C2C') {
					if (item.conversationID == 'C2CWAIT_DEAL') {
						uni.navigateTo({
							url: '../waitDeal/waitDeal'
						})
						console.log('待处理')
					} else if (item.conversationID == 'C2CTIP') {
						uni.navigateTo({
							url: '../tip/tip'
						})
						console.log('群组通知')
					} else {
						this.$store.commit('updateConversationActive', item)
						uni.navigateTo({
							url: '../chatRoom/chatRoom?titleName=' + item.userProfile.nick
						})
					}
				} else if (item.type == 'GROUP') {
					this.$store.commit('updateConversationActive', item)
					uni.navigateTo({
						url: '../chatRoom/chatRoom?titleName=' + item.groupProfile.name
					})
				}
			},
			// login() {
			// 	let promise = this.$tim.login({
			// 		userID: '1045',
			// 		userSig: 'eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwoYGJqZQ8eKU7MSCgswUJStDEwMDE2MTY0sjiExqRUFmUSpQ3NTU1MjAwAAiWpKZCxIzMzAzNjc3NTGEmpKZDjTWNcoSaIW3aZJZcYx*Rk5mmkuxZZmvQUVgmHGyt2mMfkBihltmYaF2oE*lu6*tUi0A1-kwvw__'
			// 	});
			// 	promise.then(function(imResponse) {
			// 		console.log(imResponse.data); // 登录成功
			// 		if (imResponse.data.repeatLogin === true) {
			// 			// 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
			// 			console.log(imResponse.data.errorInfo);
			// 		}
			// 	}).catch(function(imError) {
			// 		console.warn('login error:', imError); // 登录失败的相关信息
			// 	});
			// },
			receive() {
				console.log(this.$store)
			},
			//获取消息列表
			getConversationList() {
				// 拉取会话列表
				let promise = this.$tim.getConversationList();
				promise.then((res) => {
					let conversationList = res.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
					if (conversationList.length) {
						//将返回的会话列表拼接上 用户的基本资料  
						//说明：如果已经将用户信息 提交到tim服务端了 就不需要再次拼接
						this.$store.commit("updateConversationList", conversationList);
					}

				}).catch((err) => {
					console.warn('getConversationList error:', err); // 获取会话列表失败的相关信息
				});
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
			getUserInfo(conversationList) {
				this.userAddConversationList = conversationList;
				this.showList = conversationList;
				// conversationList.forEach(item => {
				// 	let obj = {}
				// 	obj.conversation = item
				// 	userList.forEach(item1 => {
				// 		if (item.toAccount == item1.userId) {
				// 			obj.user = item1
				// 		}
				// 	})
				// 	this.userAddConversationList.push(JSON.parse(JSON.stringify(obj)))
				// })
			},
		},
		onShow() {
			if (this.isSDKReady) {
				this.getConversationList()
			} else {}
		},
		onLoad() {
			// this.login();
			this.getConversationList();
		}
	}
</script>

<style lang="scss">
	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: $bg-color-primary;
		padding: $spacing-base;

		so-search {
			flex: 1;
		}
		.mailList{
			margin-left: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.mailList-text {
				font-size: 20rpx;
				line-height: 28rpx;
				color: #303031;
			}
		}
	}

	.defalt-text {
		text-align: center;
		margin-top: 80rpx;
		color: #666769;
		font-size: 28rpx;
		line-height: 40rpx;
	}
</style>
