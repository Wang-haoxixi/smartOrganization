<template>
	<view class="collect">
		<!-- <so-thoughts-item v-if="thoughtsList.records.length>0" v-for="(item,index) of thoughtsList.records" :key="index"
		 :avatar="item.avatar" :name="item.userName" :redness="item.redness" :content="item.content" :time="item.createTime"
		 :images="item.images" :isAdmin="item.isAdmin" :attach="item.attach" @showActions="showActions(item)" @goDetails="goDetails(item)">
			<view class="thoughts-header-actions-item" v-if="item.status==true">
				<image :src="$ossUrl('pic_corner.png')" mode="" style="width: 44rpx;height: 10rpx;"></image>
				<view class="thoughts-header-actions-info-item">
					<view class="thoughts-header-actions-info-share-item" @tap.stop="deleteThoughts(item,index)" v-if="groupDetails.isAdmin==true">
						<image class="icon-xs iconImg" :src="$ossUrl('icon_delete.png')" mode=""></image>
						<view class="">
							删除
						</view>
					</view>
					<view class="thoughts-header-actions-info-share" @tap.stop="reportThoughts" v-if="groupDetails.isAdmin==false">
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
						<image class="icon-xs" :src="$ossUrl('icon_blueShare.png')" mode=""></image>
						<view class="thoughts-action-info-content-num">
							{{$isEmpty(item.weChatShare)?'0':item.weChatShare}}
						</view>
					</view>
					<view class="thoughts-action-info-content">
						<image class="icon-xs" :src="$ossUrl('icon_comment.png')" mode=""></image>
						<view class="thoughts-action-info-content-num">
							{{$isEmpty(item.commentNum)?'0':item.commentNum}}
						</view>
					</view>
					<view class="thoughts-action-info-content">
						<image class="icon-xs" :src="$ossUrl('icon_bluePraise.png')" v-if="item.praiseStatus==0" @tap.stop="praiseThoughts(item)"></image>
						<image class="icon-xs" :src="$ossUrl('icon_bluePraised.png')" v-if="item.praiseStatus==1" @tap.stop="cancelPraiseThoughts(item)"></image>
						<view class="thoughts-action-info-content-num">
							{{$isEmpty(item.thumbsUpCount)?'0':item.thumbsUpCount}}
						</view>
					</view>
				</view>
			</view>
		</so-thoughts-item>
		<view class="noCentent" v-if="thoughtsList.records.length==0">
			暂无成员发布内容
		</view> -->
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				thoughtsList: {
					records: []
				},
			}
		},

		onLoad(opt) {
			this.$http.get('dms/thoughts/smart_org/collection', {
				params: {
					current: 1,
					size: 5,
					smartOrgTag: 1
				}
			}).then(res => {
				console.log('收藏', res)
				// this.thoughtsList = res.data.data
				// this.thoughtsList.records = this.thoughtsList.records.map(item => {
				// 	return {
				// 		...item,
				// 		status: false
				// 	}
				// })
			})
		},

		onReachBottom() {
			if (this.thoughtsList.current < this.thoughtsList.pages) {
				this.$http.get('/dms/collection/page', {
					params: {
						size: 5,
						current: this.thoughtsList.current + 1
					}
				}).then(res => {
					this.thoughtsList.current = res.data.data.current
					this.thoughtsList.records = this.thoughtsList.records.concat(res.data.data.records.map(item => {
						return {
							...item,
							status: false
						}
					}))
				})
			}
		},
	}
</script>

<style lang="scss">
	.thoughts-header-actions-item {
		position: absolute;
		right: 0rpx;
		top: 40rpx;
		display: flex;
		align-items: flex-end;
		flex-direction: column;

		.thoughts-header-actions-info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $bg-color-secondary;
			padding: 20rpx $spacing-xl;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			border-radius: $border-radius-base;
			border-top-right-radius: 0rpx;

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

	.thoughts-action {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
		padding-bottom: $spacing-xl;
		border-bottom: 2rpx solid $border-color;

		.thoughts-action-info-content {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.thoughts-action-info-content-num {
				margin-left: $spacing-sm;
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
				color: $text-color-auxiliary;
			}
		}
	}

	.noCentent {
		text-align: center;
		margin-top: 80rpx;
	}
</style>
