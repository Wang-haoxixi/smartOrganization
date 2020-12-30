<template>
	<view class="so-list-item" v-if="itemData.type != '@TIM#SYSTEM' && itemData.conversationID != 'C2CSO_MESSAGE' && itemData.conversationID != 'C2CRED_ENVELOPE' && itemData.conversationID != 'C2CSYSTEM_MESSAGE' && itemData.conversationID != 'C2CCAVEAT'">
		<view class="avatar">
			<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="avatar-lg">
			</image>
			<image v-else-if="itemData.type == 'C2C'" :src="itemData.userProfile.avatar" class="avatar-lg" @error="avatarError()">
			</image>
			<image v-else-if="itemData.type == 'GROUP'" :src="itemData.groupProfile.avatar" class="avatar-lg" @error="avatarError()">
			</image>
			<view class="notice" v-if="itemData.unreadCount>0">
			</view>
		</view>
		<view class="text">
			<view class="primary">
				<view class="name" v-if="itemData.type == 'C2C'">
					{{$isEmpty(itemData.userProfile.nick)?'暂无昵称':itemData.userProfile.nick}}
				</view>
				<view class="name" v-else-if="itemData.type == 'GROUP'">
					{{$isEmpty(itemData.groupProfile.name)?'暂无昵称':itemData.groupProfile.name}}
				</view>
				<view class="name" v-else-if="itemData.type == '@TIM#SYSTEM'">
					系统消息
				</view>
				<view class="time">
					{{$isEmpty(time)?'暂无时间':time}}
				</view>
			</view>
			<view class="content singleEllipsis" v-if="itemData.conversationID == 'C2CWAIT_DEAL' || itemData.conversationID == 'C2CTIP'">
				<text v-if="itemData.unreadCount>0">[{{itemData.unreadCount}}条]</text><text space="ensp">{{$isEmpty(itemData.lastMessage.payload.description)?'暂无内容':itemData.lastMessage.payload.description}}</text>
			</view>
			<view class="content singleEllipsis" v-else>
				<text v-if="itemData.unreadCount>0">[{{itemData.unreadCount}}条]</text><text space="ensp">{{$isEmpty(content)?'暂无内容':content}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SoChatListItem',
		props: {
			itemData: {
				type: Object,
				default: null,
			},
			name: {
				type: String,
				default: '暂无昵称'
			},
			content: {
				type: String,
				default: '暂无消息'
			},
			time: {
				type: String,
				default: '暂无时间'
			}
		},
		data() {
			return {
				defaultAvatar: false,
			};
		},
		methods: {
			avatarError() {
				this.defaultAvatar = true;
			}
		},
		onReady() {
			if (this.itemData.type == 'C2C') {
				if (this.$isEmpty(this.itemData.userProfile.avatar)) {
					this.avatarError();
				}
			} else if (this.itemData.type == 'GROUP') {
				if (this.$isEmpty(this.itemData.groupProfile.avatar)) {
					this.avatarError();
				}
			} else {
				this.avatarError();
			}
		}
	}
</script>

<style lang="scss">
	.avatar {
		position: relative;

		.notice {
			width: 20rpx;
			height: 20rpx;
			border-radius: 20rpx;
			background-color: #F74437;
			position: absolute;
			top: -4rpx;
			right: -4rpx;
		}
	}

	.so-list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 $spacing-xl;

		.text {
			position: relative;
			padding: $spacing-lg 0;
			display: flex;
			flex-direction: column;
			margin-left: $spacing-lg;
			// border-bottom: solid #EFF0F1 1px;
			flex: 1;

			.primary {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.name {
					flex: 1;
					color: $text-color-primary;
					font-size: $font-size-lg;
					line-height: $line-height-size-lg;
				}

				.time {
					color: $text-color-secondary;
					font-size: $font-size-xxs;
					line-height: $line-height-xxxs;
				}

			}

			.content {
				max-width: 560rpx;
				margin-top: $border-radius-base;
				color: $text-color-placeholder;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
			}

		}

		.text:after {
			content: "  ";
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			width: 200%;
			height: 200%;
			border-bottom: 1px solid #EFF0F1;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scale(.5, .5);
			transform: scale(.5, .5);
		}

	}
</style>
