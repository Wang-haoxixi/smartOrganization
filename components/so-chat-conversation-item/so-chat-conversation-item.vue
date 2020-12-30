<template>
	<!-- 用户消息 -->
	<!-- 自己发出的消息 -->
	<view class="my" v-if="itemData.flow=='out'">
		<!-- 左-消息 -->
		<view class="content">
			<!-- 文字消息 -->
			<view class="bubble-view">
				<view v-if="itemData.type==TIM.TYPES.MSG_TEXT" class="bubble">
					<span v-for="(div, index) in itemData.virtualDom" :key="index" style="min-height: 40rpx;">
						<text space="ensp" v-if="div.name === 'span'" class="text">{{div.text}}</text>
						<image v-if="div.name === 'img'" :src="div.src" style="width:40rpx;height:40rpx;"></image>
					</span>
				</view>
				<view v-else-if="itemData.type==TIM.TYPES.MSG_IMAGE" class="bubble-img">
					<image class="widthFix" :src="itemData.payload.imageInfoArray[1].imageUrl" v-if="itemData.payload.imageInfoArray[1].width < itemData.payload.imageInfoArray[1].height"
					 mode="aspectFill" @tap.stop="previewImage([itemData.payload.imageInfoArray[0].imageUrl],0)"></image>
					<image class="heightFix" :src="itemData.payload.imageInfoArray[1].imageUrl" v-else mode="heightFix" @tap.stop="previewImage([itemData.payload.imageInfoArray[0].imageUrl],0)"></image>
					<!-- <image :src="itemData.payload.imageInfoArray[1].imageUrl" mode="aspectFill" @tap.stop="previewImage([itemData.payload.imageInfoArray[0].imageUrl],0)"></image> -->
				</view>
				<view v-else class="bubble">
					暂不支持的消息类型
				</view>
				<image v-if="itemData.type!=TIM.TYPES.MSG_IMAGE" class="bubble-icon" :src="$ossUrl('icon_chat_bubble_green.png')"
				 mode=""></image>
			</view>

		</view>
		<!-- 右-头像 -->
		<image v-if="myProfile.avatar" :src="myProfile.avatar" class="avatar" @tap="goUser(myProfile.userID)"></image>
		<image v-else :src="$ossUrl('icon_avatar_df.png')" class="avatar" @tap="goUser(myProfile.userID)"></image>
	</view>
	<!-- 别人发出的消息 -->
	<view class="other" v-else>
		<!-- 左-头像 -->
		<!-- <view v-if="userProfile"> -->
		<image v-if="userProfile && itemData.conversationType == 'C2C' && userProfile.avatar" :src="userProfile.avatar" class="avatar"
		 @tap="goUser(userProfile.userID)"></image>
		<!-- </view> -->
		<image v-else-if="itemData.conversationType == 'GROUP' && itemData.avatar" :src="itemData.avatar" class="avatar" @tap="goUser(itemData.from)"></image>
		<image v-else :src="$ossUrl('icon_avatar_df.png')" class="avatar"></image>
		<!-- 右-用户名称-时间-消息 -->
		<view class="content">
			<view class="username">
				<view class="name" v-if="itemData.conversationType == 'C2C' && userProfile && userProfile.nick">
					{{$isEmpty(userProfile.nick)?'暂无昵称':userProfile.nick}}
				</view>
				<view class="name" v-else-if="itemData.conversationType == 'GROUP' && itemData.nick">
					{{$isEmpty(itemData.nick)?'暂无昵称':itemData.nick}}
				</view>
				<view class="name" v-else>
					暂无昵称
				</view>
				<!-- <view class="time">{{timeFliter(itemData.time)}}</view> -->
			</view>
			<!-- 文字消息 -->
			<view class="bubble-view">
				<image v-if="itemData.type!=TIM.TYPES.MSG_IMAGE" class="bubble-icon" :src="$ossUrl('icon_chat_bubble_white.png')"
				 mode=""></image>
				<view v-if="itemData.type==TIM.TYPES.MSG_TEXT" class="bubble">
					<span v-for="(div, index) in itemData.virtualDom" :key="index">
						<text space="ensp" v-if="div.name === 'span'" class="text">{{div.text}}</text>
						<image v-if="div.name === 'img'" :src="div.src" style="width:40rpx;height:40rpx;">
						</image>
					</span>
					<!-- <rich-text v-if="itemData.payload.text" :nodes="nodesFliter(itemData.payload.text)"></rich-text> -->
				</view>
				<view v-else-if="itemData.type==TIM.TYPES.MSG_IMAGE" class="bubble-img">
					<image class="widthFix" :src="itemData.payload.imageInfoArray[1].imageUrl" v-if="itemData.payload.imageInfoArray[1].width < itemData.payload.imageInfoArray[1].height"
					 mode="aspectFill" @tap.stop="previewImage([itemData.payload.imageInfoArray[0].imageUrl],0)"></image>
					<image class="heightFix" :src="itemData.payload.imageInfoArray[1].imageUrl" v-else mode="heightFix" @tap.stop="previewImage([itemData.payload.imageInfoArray[0].imageUrl],0)"></image>
				</view>
				<view v-else-if="itemData.type==TIM.TYPES.MSG_CUSTOM" class="bubble">
					<text v-if="JSON.parse(itemData.payload.data).type == 'RC:TxtMsg'" class="text">
						{{itemData.payload.description}}
					</text>
					<text v-else class="text">
						暂不支持的消息类型
					</text>
				</view>
				<view v-else class="bubble">
					暂不支持的消息类型
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		previewImage
	} from '@/common/utils.js'
	export default {
		name: 'soChatConversationItem',
		props: {
			myProfile: {
				type: Object,
				default: null,
			},
			userProfile: {
				type: Object,
				default: null,
			},
			itemData: {
				type: Object,
				default: null
			},
			TIM: {
				type: Object,
				default: null
			}
		},
		// watch: {
		// 	userProfile: {
		// 		handler(val) {
		// 			if (this.$store.state.conversationType == 'C2C') {
		// 				this.userProfileAvatar = this.$isEmpty(this.userProfile.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.userProfile
		// 					.avatar;
		// 				this.userProfileNick = this.userProfile.nick;
		// 			} else if (this.$store.state.conversationType == 'GROUP') {
		// 				this.userProfileAvatar = this.$isEmpty(this.itemData.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.itemData
		// 					.avatar;
		// 				this.userProfileNick = this.itemData.nick;
		// 			}
		// 			console.log(val)
		// 		},
		// 		deep: true,
		// 	},
		// 	myProfile: {
		// 		handler(val) {
		// 			if (this.itemData.flow == 'out') {
		// 				this.myProfileAvatar = this.$isEmpty(this.myProfile.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.myProfile
		// 					.avatar;
		// 			}
		// 			console.log(val)
		// 		},
		// 		deep: true,
		// 	},
		// },
		data() {
			return {
				// userProfileAvatar: '',
				// userProfileNick: '',
				// myProfileAvatar: '',
			};
		},
		methods: {
			// myAvatarError() {
			// 	this.myProfileAvatar = this.$ossUrl('icon_avatar_df.png');
			// },
			// userAvatarError() {
			// 	this.userProfileAvatar = this.$ossUrl('icon_avatar_df.png');
			// },
			goUser(userID) {
				uni.navigateTo({
					url: '/pages/my/myMien/myMien?userId=' + userID
				})
			},
			previewImage,
			//聊天的节点加上外层的div
			nodesFliter(str) {
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">' + str + '</div>'
				return nodeStr
			},
			// //时间过滤
			// timeFliter(timer) {
			// 	let timeData = new Date(timer * 1000)
			// 	let str = this.$common.dateTimeFliter(timeData)
			// 	return str
			// },
		},
		// onReady() {
		// 	//获取图片失败的情况下使用默认图片
		// 	try {
		// 		if (this.itemData.flow == 'out') {
		// 			this.myProfileAvatar = this.$isEmpty(this.myProfile.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.myProfile.avatar;
		// 			console.log(this.myProfileAvatar);
		// 		} else if (this.itemData.flow == 'in') {
		// 			if (this.$store.state.conversationType == 'C2C') {
		// 				this.userProfileAvatar = this.$isEmpty(this.userProfile.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.userProfile
		// 					.avatar;
		// 				this.userProfileNick = this.userProfile.nick;
		// 			} else if (this.$store.state.conversationType == 'GROUP') {
		// 				this.userProfileAvatar = this.$isEmpty(this.itemData.avatar) ? this.$ossUrl('icon_avatar_df.png') : this.itemData
		// 					.avatar;
		// 				this.userProfileNick = this.itemData.nick;
		// 			}
		// 		}
		// 	} catch (e) {
		// 		//TODO handle the exception
		// 		if (this.itemData.flow == 'out') {
		// 			this.myProfileAvatar = this.$ossUrl('icon_avatar_df.png');
		// 		} else if (this.itemData.flow == 'in') {
		// 			this.userProfileAvatar = this.$ossUrl('icon_avatar_df.png');
		// 			this.userProfileNick = '暂无昵称'
		// 		}
		// 	}
		// }
	}
</script>

<style lang="scss">
	.avatar {
		height: 80rpx;
		width: 80rpx;
		border-radius: 16rpx;
	}

	.other {
		display: flex;
		padding: 8rpx 24rpx 40rpx;

		.content {
			margin-left: 8rpx;
			margin-top: -8rpx;

			.username {
				margin-left: 8rpx;
			}

			.bubble-view {
				.bubble {
					background-color: $color-white;
				}
			}
		}
	}

	.my {
		display: flex;
		padding: 0 24rpx 40rpx;

		.content {
			align-items: flex-end;
			margin-right: 8rpx;

			.username {
				margin-right: 8rpx;
			}

			.bubble-view {
				.bubble {
					background-color: $color-secondary;
				}
			}
		}
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;

		.username {
			margin-bottom: 4rpx;
			display: flex;
			justify-content: space-between;

			.name {
				color: $text-color-regular;
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
			}
		}

		.bubble-view {
			// margin-top: 2rpx;
			display: flex;

			.bubble-icon {
				width: 8rpx;
				height: 16rpx;
				margin-top: 34rpx;
			}

			.bubble {
				margin-top: -2rpx;
				padding: 22rpx 24rpx;
				max-width: 462rpx;
				border-radius: 8rpx;
				display: flex;
				word-break: break-word;
				flex-wrap: wrap;


				color: $text-color-primary;
				font-size: $font-size-base;

				.text {
					color: #303031;
					font-size: 30rpx;
					line-height: 40rpx;
				}
			}

			.bubble-img {
				margin-left: 8rpx;
				max-width: 462rpx;
				border-radius: 8rpx;
				display: flex;

				.widthFix {
					width: 270rpx;
				}

				.heightFix {
					height: 270rpx;
				}

				image {
					border-radius: 8rpx;
				}
			}
		}
	}
</style>
