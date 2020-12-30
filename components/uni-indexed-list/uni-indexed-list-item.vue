<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" @click="goNext(item)" class="uni-indexed-list__item"
			 hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view v-if="showSelect" style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
						</view>
						<view class="" style="display: flex;align-items: center">
							<image class="avatarImg" :src="item.dataList.avatar" mode="aspectFill"></image>
							<view class="uni-indexed-list__item-content" style="font-size: 30rpx;line-height: 44rpx;">{{ item.dataList.realName }}</view>
							<image class="icon-sm" v-if="soStatus==true && item.dataList.redness==1" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
							<image class="icon-sm" v-if="soStatus==true && item.dataList.redness==2" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
							<image class="icon-sm" v-if="soStatus==true && item.dataList.redness==3" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
							<image class="icon-sm" v-if="soStatus==true && item.dataList.redness==4" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
							<image class="icon-sm" v-if="soStatus==true && item.dataList.redness==5" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	getCompanyStation
	// } from '@/common/utils.js';
	import {
		isEmpty
	} from '@/common/utils.js'
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		data() {
			return {
				oss: ''
			}
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			},
			soStatus:{
				type: Boolean,
				default: false
			}
		},
		onReady() {
			this.oss = this.$oss
		},
		methods: {
			// getCompanyStation,
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			},
			goNext(item) {
				if (item.dataList.userId > 0) {
					uni.navigateTo({
						url: '/pages/my/myMien/myMien?userId=' + item.dataList.userId
					})
					// console.log(item.dataList.userId)
					// this.$store.commit('createConversationActive', item.dataList.userId+'')
					// uni.navigateTo({
					// 	url: '/pages/chat/chatRoom/chatRoom'
					// })
				}
				console.log(item.dataList.userId)
				// this.$store.commit('createConversationActive', userId)
				// if (isEmpty(item.dataList.userId)) {
				// 	uni.navigateTo({
				// 		url: `/pages/contacts/soWorkbench/soWorkbench?id=${item.dataList.orgId}`
				// 	})
				// }
				// if (isEmpty(item.dataList.orgId)) {
				// 	// console.log(item.dataList.userId)
				// 	uni.navigateTo({
				// 		url: `/pages/find/cannerCard/cannerCard?id=${item.dataList.userId}`
				// 	})
				// }

				// console.log(item)
			},
			// exit(item, index) {
			// 	// console.log(index)
			// 	console.log(item)
			// 	if (!isEmpty(item.dataList.orgId)) {
			// 		if (item.dataList.isAdmin == 2) {
			// 			this.goNext(item)
			// 		} else {
			// 			let that = this
			// 			uni.showModal({
			// 				content: "你确定要退出该SO吗?",
			// 				success: (res) => {
			// 					if (res.confirm) {
			// 						that.$http.get('admin/org/sign/out/' + item.dataList.orgId).then(res => {
			// 							// console.log(res)
			// 							if (res.data.code == 0) {
			// 								uni.showToast({
			// 									title: "成功退出该SO",
			// 									icon: "none",
			// 									duration: 1000,
			// 									success: () => {
			// 										setTimeout(() => {
			// 											this.$emit('cancel', index)
			// 										}, 1000)
			// 									}
			// 								})
			// 							}
			// 						})
			// 					} else if (res.cancel) {
			// 						// console.log('用户点击取消');
			// 					}
			// 				}
			// 			})
			// 		}
			// 	} else {
			// 		let that = this
			// 		uni.showModal({
			// 			content: "你确定要删除该好友吗?",
			// 			success: (res) => {
			// 				if (res.confirm) {
			// 					that.$http.get('admin/friend/delete/' + item.dataList.userId).then(res => {
			// 						// console.log(res)
			// 						if (res.data.code == 0) {
			// 							uni.showToast({
			// 								title: "成功删除该好友",
			// 								icon: "none",
			// 								duration: 1000,
			// 								success: () => {
			// 									setTimeout(() => {
			// 										this.$emit('cancel', index)
			// 									}, 1000)
			// 								}
			// 							})
			// 						}
			// 					})
			// 				} else if (res.cancel) {
			// 					// console.log('用户点击取消');
			// 				}
			// 			}
			// 		})
			// 	}
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-width: 1px;
		border-top-color: $uni-border-color;
	}

	.uni-indexed-list__item {
		font-size: $uni-font-size-lg;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding: 16rpx 24rpx;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom-width: 1px;
		border-bottom-color: $uni-border-color;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		// width: 532rpx;
		font-size: 14px;
		color: #303031;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
	}

	.uni-indexed-list__title {
		padding: 12rpx 32rpx;
		line-height: 44rpx;
		font-size: 32rpx;
		color: #919397;
	}

	.avatarImg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		margin-right: 24rpx;
	}

	.adminInfo {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;

		.mark {
			width: 76rpx;
			height: 26rpx
		}
	}
</style>
