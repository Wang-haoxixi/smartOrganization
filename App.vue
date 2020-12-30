<script>
	// import userlist from './commen/tim/user'
	import {loginIm} from 'common/login.js'
	import {decodeElement} from 'utils/decodeElement'
	export default {
		mounted() {
			/**官网有很多关于关于sdk 其他的监听方法（比如：有新的消息，用户资料更新等等）
			 * 详情可对照： https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html
			 * 监听的含义：服务端发生了数据变更---前端全局可以接收到变更通知--前端就可以自动触发某个事件来更新相应数据
			 * */
			// 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
			this.$tim.on(this.$TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
			// 收到新消息
			this.$tim.on(this.$TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
			// 会话列表更新
			this.$tim.on(this.$TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
				this.$store.commit("updateConversationList", event.data);
			});
		},
		methods: {
			onReadyStateUpdate({
				name
			}) {
				const isSDKReady = name === this.$TIM.EVENT.SDK_READY ? true : false;
				//自动监听并更新 sdk 的ready 状态 （未登录是 notReady  登录后是ready）
				this.$store.commit("toggleIsSDKReady", isSDKReady);
				//sdk ready 后  肯定完成了登录操作    这里可以获取用户存储在im的基础信息/离线消息/黑名单列表
			},

			onReceiveMessage({
				data: messageList
			}) {
				// this.handleAt(messageList);
				let list = messageList
				for (let i = 0; i < list.length; i++) {
				  let message = list[i]
				  list[i].virtualDom = decodeElement(message)
				}
				this.$store.commit("pushCurrentMessageList", list);
				uni.vibrateLong({
				    success: function () {
				        console.log('success');
				    }
				});
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接

		},
		onLaunch: function() {
			loginIm();
			console.log('App Launch')
			// console.log(userlist)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}

	}
</script>

<style lang="scss">
	/*每个页面公共css */

	/*图标 */
	image{
		vertical-align: top;
	}
	.icon-xs {
		width: $icon-size-xs;
		height: $icon-size-xs;
	}

	.icon-sm {
		width: $icon-size-sm;
		height: $icon-size-sm;
	}

	.icon-base {
		width: $icon-size-base;
		height: $icon-size-base;
	}

	.icon-lg {
		width: $icon-size-lg;
		height: $icon-size-lg;
	}

	/*头像*/
	.avatar-sm{
		width: $avatar-size-sm;
		height: $avatar-size-sm;
	}
	.avatar-base{
		width: $avatar-size-base;
		height: $avatar-size-base;
	}
	.avatar-lg{
		width: $avatar-size-lg;
		height: $avatar-size-lg;
		border-radius: $border-radius-xl;
	}
	.avatar-xl{
		width: $avatar-size-xl;
		height: $avatar-size-xl;
	}

	.singleEllipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.safe-bottom {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
	}
	
	.button-sm{
		font-size: $font-size-sm;
		padding: 12rpx 24rpx;
		line-height: $line-height-size-sm;
		border-radius: 8rpx;
	}
	
	.button-base{
		font-size: $font-size-base;
		padding: 14rpx $spacing-lg;
		line-height: $line-height-size-base;
		border-radius: 16rpx;
	}
	
	.button-lg{
		font-size: $font-size-lg;
		padding: 22rpx 80rpx;
		line-height: $line-height-size-base;
		border-radius: 16rpx;
	}

	button {
		align-items: center;
		white-space: nowrap;
		font-weight: bold;
		border-radius: $border-radius-lg;
		overflow: visible;
		text-align: center;
		color: $color-white;
		background-color: $color-primary;
	}

	button::after {
		border-radius: $border-radius-lg;
		border: 0;
	}

	button[disabled] {
		color: $text-color-secondary !important;
		background: $bg-color-disabled !important;
	}

	.button-hover {
		background-color: $color-primary;
		color: $color-white;
		opacity: 0.7;
	}
	checkbox .wx-checkbox-input {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 背景的宽 */
		height: 45rpx;
		/* 背景的高 */
		border: 4rpx solid #E3E4E5;
	}
	
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 4rpx solid $color-primary;
		background: $color-primary;
	}
	
	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		height: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		line-height: 45rpx;
		text-align: center;
		font-size: 30rpx;
		/* 对勾大小 30rpx */
		color: #fff;
		/* 对勾颜色 白色 */
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	radio .wx-radio-input {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 背景的宽 */
		height: 45rpx;
		/* 背景的高 */
		border: 4rpx solid #E3E4E5;
	}
	
	radio .wx-radio-input.wx-radio-input-checked {
		border: 4rpx solid $color-primary;
		background: $color-primary;
	}
	
	radio .wx-radio-input.wx-radio-input-checked::before {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		height: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		line-height: 45rpx;
		text-align: center;
		font-size: 30rpx;
		/* 对勾大小 30rpx */
		color: #fff;
		/* 对勾颜色 白色 */
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}
	
</style>
