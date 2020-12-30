import Vue from 'vue'
import Vuex from 'vuex'
import tim from '../common/tim/tim'
import {
	decodeElement
} from '../utils/decodeElement'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		isLogin: false,
		isSDKReady: false, // TIM SDK 是否 ready


		conversationActive: {}, //聊天进行中的会话
		conversationType: '', //聊天类型 C2C或GROUP
		toUserId: '', //聊天对象id
		conversationList: [], //会话列表
		currentMessageList: [], //消息列表
		unreadCount: 0, //未读消息数
	},
	mutations: {
		//更新登录状态
		toggleIsLogin(state, isLogin) {
			state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
		},
		//更新TIMSDK状态
		toggleIsSDKReady(state, isSDKReady) {
			state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
		},
		//退出登录重置状态
		reset(state) {
			state.isLogin = false
			state.isSDKReady = false
		},
		//选择好友聊天--创建会话/拼接会话id
		createConversationActive(state, toUserId) {
			state.conversationActive.conversationID = 'C2C' + toUserId
			state.conversationActive.type = 'C2C'
			state.toUserId = toUserId
			state.conversationType = 'C2C'
			state.currentMessageList = []
		},
		//选择群组
		createGroupConversationActive(state, toUserId) {
			state.conversationActive.conversationID = 'GROUP' + toUserId
			state.conversationActive.type = 'GROUP'
			state.toUserId = toUserId
			state.currentMessageList = []
			state.conversationType = 'GROUP'
		},
		//选择已有会话聊天--更新选中会话详情
		updateConversationActive(state, conversationItem) {
			console.log(state)
			console.log(conversationItem)
			state.conversationActive = Object.assign({}, conversationItem);
			if (conversationItem.type == 'C2C') {
				state.toUserId = conversationItem.userProfile.userID
				state.conversationType = 'C2C'
			} else if (conversationItem.type == 'GROUP') {
				state.toUserId = conversationItem.groupProfile.groupID
				state.conversationType = 'GROUP'
			}
			state.currentMessageList = []
		},
		//更新会话列表
		updateConversationList(state, newConversationList) {
			state.conversationList = newConversationList
			let unreadCount = 0;
			newConversationList.forEach(item => {
				if(item.type != '@TIM#SYSTEM'){
					unreadCount += item.unreadCount;
				}
			})
			state.unreadCount = unreadCount;
		},
		/**
		 * 将消息插入当前会话列表
		 * 调用时机：收/发消息事件触发时
		 * @param {Object} state
		 * @param {Message[]|Message} data
		 * @returns
		 */
		pushCurrentMessageList(state, data) {
			// 还没当前会话，则跳过
			if (Array.isArray(data)) {
				// 筛选出当前会话的消息
				const result = data.filter(item => item.conversationID === state.conversationActive.conversationID)
				for (let i = 0; i < result.length; i++) {
					let message = result[i]
					result[i].virtualDom = decodeElement(message)
				}
				state.currentMessageList = [...state.currentMessageList, ...result]
			} else if (data.conversationID === state.conversationActive.conversationID) {
				data.virtualDom = decodeElement(data)
				state.currentMessageList = [...state.currentMessageList, data]
			}
			console.log('1111')
			console.log(state.currentMessageList)
		},
		/**
		 * 滑到顶部请求更多的历史消息
		 * */
		unshiftCurrentMessageList(state, data) {
			if (data) {
				for (let i = 0; i < data.length; i++) {
					let message = data[i]
					data[i].virtualDom = decodeElement(message)
				}
				state.currentMessageList = [...data, ...state.currentMessageList]
			}
		},
	},

	actions: {

	}
})
export default store
