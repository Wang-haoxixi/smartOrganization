<template>
	<view>
		<view v-if="loaded || list.itemIndex < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.itemIndex < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
				<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
					<view class="uni-indexed-list__item-container" @click="onClick(idx, index)">
						<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
							<view class="" style="flex: 1;">
								<uni-swipe-action-item :right-options="item.dataList.options" @click="onButton($event, item)" @change="swipeChange($event, index)">
									<view v-if="showSelect" style="margin-right: 20rpx;">
										<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
									</view>
									<view class="" style="display: flex;align-items: center;flex: 1;padding: 16rpx 32rpx ;" @tap="goDetails(item)">
										<image class="avatarImg" :src="item.dataList.avatar" mode="aspectFill"></image>
										<view class="uni-indexed-list__item-content" style="font-size: 30rpx;line-height: 44rpx;max-width: 466rpx;">{{ item.dataList.realName }}</view>
										<image class="icon-sm" v-if="item.dataList.redness==1" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
										<image class="icon-sm" v-if="item.dataList.redness==2" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
										<image class="icon-sm" v-if="item.dataList.redness==3" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
										<image class="icon-sm" v-if="item.dataList.redness==4" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
										<image class="icon-sm" v-if="item.dataList.redness==5" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
									</view>
								</uni-swipe-action-item>
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
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		name: 'UniIndexedSoList',
		components: {
			uniIcons,
			uniSwipeActionItem
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
			orgId: {
				type: Number,
				default: 0
			}
		},
		onReady() {
			this.oss = this.$oss
			// console.log(this.list)
		},
		methods: {
			swipeChange(){
				
			},
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/my/myMien/myMien?userId=${item.dataList.userId}`
				})
			},
			// getCompanyStation,
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			},
			// goNext(item) {
			// 	// console.log(item)
			// 	if (item.dataList.userId > 0) {
			// 		this.$store.commit('createGroupConversationActive', 1180)
			// 		uni.navigateTo({
			// 			url: '/pages/chat/chatRoom/chatRoom'
			// 		})

			// 	}
			// 	console.log(item.dataList.userId)
			// },
			onButton(e, item) {
				// console.log(6)
				if (e.content.text == '移出群组') {
					// console.log('移出群组')
					this.$http.get('admin/org/fire', {
						params: {
							userId: item.dataList.userId,
							orgId: this.orgId
						}
					}).then(res => {
						console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "移出成员成功",
								icon: "none",
								success: () => {
									uni.$emit('refresh')
								}
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				} else if (e.content.text == '设为管理员') {
					// console.log('设为管理员')
					this.$http.get('admin/app/set/admin', {
						params: {
							userId: item.dataList.userId,
							orgId: this.orgId
						}
					}).then(res => {
						console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "设置管理员成功",
								icon: "none",
								success: () => {
									uni.$emit('refresh')
								}
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				} else if (e.content.text == '移除管理员') {
					console.log('移除管理员')
					this.$http.get('admin/app/unset/admin', {
						params: {
							userId: item.dataList.userId,
							orgId: this.orgId
						}
					}).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: "移除管理员成功",
								icon: "none",
								success: () => {
									uni.$emit('refresh')
								}
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: $color-white;
		background-color: $color-white;

		.setManage {
			padding: 32rpx $spacing-xl;
			background-color: $color-error;
		}

		.removeManage {
			padding: 32rpx $spacing-xl;
			background-color: $bg-color-secondary;
		}

		.removeGroup {
			padding: 32rpx $spacing-xl;
			background-color: $color-warning;
		}
	}

	.uni-indexed-list__list {
		position: relative;
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
		max-width: 532rpx;
		// flex: 1;
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
