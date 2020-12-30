<template>
	<view class="attention">
		<view style="height: 100%;" v-if="cannerList.records.length > 0">
			<scroll-view scroll-y="true" @scrolltolower="cannerMore" style="height: 100%;">
				<view class="attention-item" v-for="(item,index) in cannerList.records" :key="index" @tap="goMyMien(item.userId)">
					<!-- <image :src="item.avatar" class="img_head"></image> -->
					
					<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="img_head"></image>
					<image v-else-if="item.avatar" :src="item.avatar" class="img_head" @error='avatarError'></image>
					
					<view class="attention-item-right">
						<text class="attention-name">{{item.realName}}</text>
						<image :src="$ossUrl(`icon_smartOrganization_grade${item.redness}.png`)" class="img_grade"></image>
					</view>
				</view>
				<uni-load-more :status="cannerStatus" v-if="cannerList.records.length > 0"></uni-load-more>
			</scroll-view>
		</view>
		<view v-else class="noAttention">
			您暂未关注用户
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore,
		},

		data() {
			return {
				cannerList: {
					records: []
				},
				cannerStatus: 'more',
				// oss:'',
				
				defaultAvatar: false,
			};
		},

		onShow() {
			this.$http.post('admin/follow/page', {
				size: 20,
				type: 1
			}).then(res => {
				console.log("res", res)
				this.cannerList = res.data.data;
				// this.cannerList.records.forEach(item => {
				// 	item.avatar = imageError(item.avatar, this.oss)
				// })
				if (!(this.cannerList.current < this.cannerList.pages)) {
					this.cannerStatus = 'noMore';
				}
			});
		},

		onLoad() {},

		methods: {
			cannerMore() {
				console.log('我触底了~')
				let that = this;
				if (this.cannerList.current < this.cannerList.pages) {
					this.cannerStatus = 'loading';
					this.$http.post('admin/follow/page', {
						type: 1,
						size: 20,
						current: this.cannerList.current + 1
					}).then(res => {
						console.log('再次加载', res)
						that.cannerList.current = res.data.data.current;
						// res.data.data.records.forEach(item => {
						// 	item.avatar = imageError(item.avatar, that.oss)
						// })
						that.cannerList.records = that.cannerList.records.concat(res.data.data.records);
						that.cannerStatus = 'more';
					});
				} else {
					that.cannerStatus = 'noMore';
				}
			},

			goMyMien(id) {
				console.log(id)
				uni.navigateTo({
					url: '/pages/my/myMien/myMien?userId=' + id
				})
			},
			
			avatarError() {
				console.log('错误')
				this.defaultAvatar = true;
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100vh;
	}

	.attention {
		height: 100%;
		// padding: 0 40rpx;
		// @extend %safe-bottom-box;

		.title {
			font-size: 28rpx;
			font-weight: 400;
			color: #919397;
			height: 104rpx;
			line-height: 104rpx;
			border-bottom: 2rpx solid #EFF0F1;
		}

		.noAttention {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #666769;
		}

		.attention-item {
			height: 110rpx;
			display: flex;
			align-items: center;
			padding: 0 40rpx;

			.img_head {
				width: 80rpx;
				height: 80rpx;
				margin-right: 24rpx;
				border-radius: 16rpx;
			}

			.attention-item-right {
				height: 100%;
				flex: 1;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #EFF0F1;

				.attention-name {
					font-size: 30rpx;
					font-weight: 400;
					color: #303031;
					max-width: 526rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;  
				}

				.img_grade {
					width: 44rpx;
					height: 44rpx;
					flex-shrink: 0;
				}
			}
		}
	}
</style>
