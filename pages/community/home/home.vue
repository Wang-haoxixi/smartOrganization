<template>
	<view class="container" @tap="hideActions">
		<view class="title">
			<!-- <so-search class="soSearch" :placeholder="placeholderTxt" :disabled="disabled" @handlEvents="golist"></so-search> -->
			<view class="search-view">
				<image :src="$ossUrl('icon_search.png')" class="icon-xs"></image>
				<input type="text" placeholder="搜索" :disabled="disabled" placeholder-class="placeholder-class" @tap='golist' />
			</view>
			<view class="titleIcon">
				<view class="iconChat">
					<image class="icon-sm" v-if="oss" :src="$ossUrl('icon_chat.png')" @tap="goChat"></image>
					<view class="notice" v-if="unreadCount>0">
					</view>
					<view>消息</view>
				</view>
				<view class="" style="display: flex;align-items: center;flex-direction: column;">
					<image class="icon-sm" v-if="oss" :src="$ossUrl('icon_my.png')" @tap="goOwnInfo"></image>
					<view class="">
						个人
					</view>
				</view>
			</view>
		</view>
		<view class="ownerGroup">
			<view class="ownerGroupTitle">
				<view class="ownerGroupTitleText">
					我的群组
				</view>
				<view class="ownerGroupTitleBtn" @tap="createGroup">
					创建群组
				</view>
			</view>
			<view class="no-so-list" v-if="isLogin==false">
				<view class="loginBtn">
					<view class="btn" @tap="goLogin">
						前往登录
					</view>
				</view>
			</view>
			<view class="" v-if="isLogin==true">
				<view class="so-list" v-if="ownerSoList.length>0">
					<view class="so-list-item" @tap="goGroupDetails(item)" v-for="(item,index) of ownerSoList" :key="index" v-if="ownerSoList.length=='8'?index<=7:index<7">
						<image class="avatar-xl avatarImg" :src="imageError(item.avatar,oss)"></image>
						<view class="soName singleEllipsis">
							{{$isEmpty( item.name)?'': item.name}}
						</view>
					</view>
					<view class="so-list-item" @tap="goOwnerGroupList" v-if="ownerSoList.length>8">
						<image class="avatar-xl avatarImg" :src="$ossUrl('icon_communityHome_more.png')"></image>
						<view class="soName">
							全部
						</view>
					</view>
				</view>
				<view class="no-so-list" v-else>
					你还未加入群组
				</view>
			</view>
		</view>
		<view class="recommendTitle">
			推荐
		</view>
		<view class="recommendList">
			<so-recommend-list-item v-for="(item,index) of thougtsList.records" :key="index" :avatar="imageError(item.avatar,oss)"
			 :name="item.name" :redness="item.redness" :content="item.thoughtsContent" :images="item.images" :userName="item.userName"
			 :status="item.status" :thoughtsId="item.thoughtsId" :attach="item.attach" :orgId="item.orgId" @showActions="changeStatus(item,index)"
			 @goDetails="goThoughtsDetails(item)">
				<view class="thoughts-header-actions" v-show="item.status==true">
					<view class="thoughts-header-actions-info">
						<!-- catchtap="share"，分享事件防止冒泡 -->
						<button :id="item.userName" class="thoughts-header-actions-info-share" open-type="share" catchtap="share">
							<image class="icon-xs iconImg" :src="$ossUrl('icon_share.png')" mode=""></image>
							<view class="">
								分享
							</view>
						</button>
						<view class="thoughts-header-actions-info-line">

						</view>
						<view class="thoughts-header-actions-info-share" @tap.stop="reportThoughts(item)">
							<image class="icon-xs iconImg" :src="$ossUrl('icon_report.png')" mode=""></image>
							<view class="">
								举报
							</view>
						</view>
					</view>
				</view>
				<view slot="actions" class="thoughts-action">
					<view class="thoughts-action-info">
						<view class="thoughts-action-info-content">
							<view class="thoughts-action-info-content-num">
								{{$isEmpty(item.commentCount)?'0':item.commentCount}}
							</view>
							<view class="">
								评论
							</view>
						</view>
						<view class="thoughts-action-info-content">
							<view class="thoughts-action-info-content-num">
								{{$isEmpty(item.weChatShare)?'0':item.weChatShare}}
							</view>
							<view class="">
								分享
							</view>
						</view>
					</view>
					<view class="thoughts-action-praise">
						<view class="thoughts-action-praise-num" v-if="item.thumbsUpCount<=999">
							{{$isEmpty(item.thumbsUpCount)?'0':item.thumbsUpCount}}
						</view>
						<view class="thoughts-action-praise-num" v-else-if="item.thumbsUpCount>999">
							{{$isEmpty(item.thumbsUpCount)?'0':'999+'}}
						</view>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraise.png')" v-if="item.praiseStatus==0" @tap.stop="praiseThoughts(item)"></image>
						<image class="icon-sm" :src="$ossUrl('icon_bluePraised.png')" v-if="item.praiseStatus==1" @tap.stop="cancelPraiseThoughts(item)"></image>
					</view>
				</view>
			</so-recommend-list-item>
			<uni-load-more :status="thoughtsMore" v-if="thougtsList.records.length>=10"></uni-load-more>
			<view class="safe-bottom" style="height: 60rpx;"></view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js'
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				oss: '',
				ownerSoList: [],
				thougtsList: {
					records: []
				},
				isLogin: false,
				placeholderTxt: '搜索群组',
				disabled: true,
				id: '',
				userId: '',
				thoughtsMore: 'more'
			};
		},
		computed: {
			...mapState({
				unreadCount: state => state.unreadCount,
			})
		},
		onLoad() {
			this.oss = this.$oss
			this.$http.get('admin/smart_groups/recommend').then(res => {
				// console.log(res)
				this.thougtsList = res.data.data
				if (this.thougtsList.current < this.thougtsList.pages) {
					this.thoughtsMore = 'more'
				} else {
					this.thoughtsMore = "noMore"
				}
				this.thougtsList.records = this.thougtsList.records.map(item => {
					return {
						...item,
						status: false
					}
				})
			})
		},
		onShow() {
			this.userId = uni.getStorageSync('userinfo').user_id
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'))
			// console.log(this.isLogin)
			if (this.isLogin == true) {
				this.$http.get('admin/smart_groups/list', {
					hideLoading: true,
					params: {
						userId: this.userId
					}
				}).then(res => {
					// console.log(res)
					this.ownerSoList = res.data.data.records
				})
			}
			this.thougtsList.records.forEach(item => {
				item.status = false
			})
		},
		onShareAppMessage(res) {
			// console.log(res)
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
				// console.log(this.id)
				this.$http.get(`dms/thoughts/we_chat/share/save/${this.id}`).then(resp => {
					console.log(resp)
				})
				return {
					title: `我分享了${res.target.id}的内容`,
					path: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${this.id}`
				}
			} else {
				return {
					title: '智慧群组',
					imageUrl: 'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_createShare.png',
					path: `/pages/community/home/home`
				}
			}
		},
		onPullDownRefresh() {
			this.$http.get('admin/smart_groups/recommend').then(res => {
				// console.log(res)
				this.thougtsList = res.data.data
				if (this.thougtsList.current < this.thougtsList.pages) {
					this.thoughtsMore = 'more'
				} else {
					this.thoughtsMore = "noMore"
				}
				this.thougtsList.records = this.thougtsList.records.map(item => {
					return {
						...item,
						status: false
					}
				})
			})
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.thougtsList.current < this.thougtsList.pages) {
				this.$http.get('admin/smart_groups/recommend', {
					params: {
						current: this.thougtsList.current + 1
					}
				}).then(res => {
					this.thougtsList.current = res.data.data.current
					if (this.thougtsList.current < this.thougtsList.pages) {
						this.thoughtsMore = 'more'
					} else {
						this.thoughtsMore = "noMore"
					}
					this.thougtsList.records = this.thougtsList.records.concat(res.data.data.records.map(item => {
						return {
							...item,
							status: false
						}
					}))
				})
			}
		},
		onPageScroll(e) {
			// console.log(e)
			this.thougtsList.records = this.thougtsList.records.map(item => {
				return {
					...item,
					status: false
				}
			})
		},
		methods: {
			imageError,
			hideActions() {
				// console.log(666)
				this.thougtsList.records.forEach(item => {
					item.status = false
				})
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/getUserInfo/getUserInfo'
				})
			},
			goOwnerGroupList() {
				uni.navigateTo({
					url: '/pages/community/home/ownerGroupLIst/ownerGroupLIst'
				})
			},
			goChat() {
				uni.navigateTo({
					url: '/pages/chat/chatList/chatList'
				})
			},
			golist() {
				uni.navigateTo({
					url: '/pages/community/home/globalSearch/globalSearch'
				})
			},
			changeStatus(item, index) {
				this.id = item.thoughtsId
				if (item.status == false) {
					this.thougtsList.records.forEach(item2 => {
						item2.status = false
					})
					item.status = true
				} else if (item.status == true) {
					this.thougtsList.records.forEach(item2 => {
						item2.status = false
					})
				}
			},
			goThoughtsDetails(item) {
				uni.navigateTo({
					url: `/pages/community/home/thoughtsDetails/thoughtsDetails?id=${item.thoughtsId}`
				})
			},
			createGroup() {
				uni.navigateTo({
					url: '/pages/community/home/createGroup/createGroup'
				})
			},
			reportThoughts(item) {
				uni.navigateTo({
					url: `/pages/report/report?id=${item.thoughtsId}`
				})
			},
			goOwnInfo() {
				uni.navigateTo({
					url: '/pages/my/personalInfo/personalInfo'
				})
			},
			goGroupDetails(item) {
				uni.navigateTo({
					url: `/pages/group/home/home?id=${item.orgId}`
				})
			},
			praiseThoughts(item) {
				this.$http.get('dms/thoughts/add_thumbs_up/' + item.thoughtsId,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						item.praiseStatus = 1
						item.thumbsUpCount++;
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			},
			cancelPraiseThoughts(item) {
				this.$http.get('dms/thoughts/add_thumbs_up/' + item.thoughtsId,{
					hideLoading: true
				}).then(res => {
					if (res.data.code == 0) {
						item.praiseStatus = 0
						item.thumbsUpCount--;
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
</script>

<style lang="scss">
	.thoughts-action {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 24rpx;
		padding-top: 20rpx;

		.thoughts-action-info {
			font-size: $font-size-xs;
			line-height: $line-height-size-xs;
			color: $text-color-secondary;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.thoughts-action-info-content {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				margin-right: 18rpx;

				.thoughts-action-info-content-num {
					margin-right: $spacing-sm;
				}
			}
		}

		.thoughts-action-praise {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.thoughts-action-praise-num {
				width: 60rpx;
				text-align: right;
				font-size: $font-size-base;
				line-height: $line-height-size-base;
				margin-right: $spacing-sm;
				color: $text-color-auxiliary;
			}
		}
	}

	.search-view {
		flex: 1;
		margin-right: $spacing-lg;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// margin-right: $spacing-lg;
		padding: 18rpx $spacing-lg;
		background-color: $color-white;
		border-radius: $border-radius-lg;

		.icon-xs {
			margin-right: $spacing-base;
		}

		.placeholder-class {
			color: $text-color-secondary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
		}

		input {
			flex: 1;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			color: $text-color-primary;
		}
	}

	page {
		// height: 100%;
		background-color: $bg-color-primary;
		// padding-bottom: $spacing-base;
	}

	.no-so-list {
		color: $text-color-regular;
		font-size: $font-size-sm;
		position: relative;
		height: 180rpx;
		line-height: 180rpx;
		text-align: center;

		.loginBtn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 80rpx;

			.btn {
				color: $color-white;
				font-size: $font-size-sm;
				line-height: $line-height-size-xxs;
				font-weight: bold;
				padding: $spacing-base $spacing-lg;
				border-radius: $border-radius-base;
				background-color: $color-primary;
			}
		}
	}

	.container {
		.soSearch {
			margin-right: $spacing-lg;
		}
	}

	.recommendList {
		margin: 0rpx $spacing-base;
	}

	.recommendTitle {
		padding: $spacing-lg $spacing-xxl $spacing-xl $spacing-xxl;
		font-size: $font-size-lg;
		line-height: $line-height-size-lg;
		font-weight: bold;
		color: $text-color-primary;
	}

	.ownerGroup {
		margin: $spacing-base;
		background-color: $color-white;
		border-radius: $border-radius-lg;

		.ownerGroupTitle {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $spacing-xl $spacing-lg;

			.ownerGroupTitleText {
				font-size: $font-size-lg;
				line-height: $line-height-size-lg;
				font-weight: bold;
				color: $text-color-primary;
			}

			.ownerGroupTitleBtn {
				color: $color-white;
				font-size: $font-size-sm;
				line-height: $line-height-size-xxs;
				font-weight: bold;
				padding: $spacing-base $spacing-lg;
				border-radius: $border-radius-base;
				background-color: $color-primary;
			}
		}

		.so-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			justify-content: flex-start;
			width: 720rpx;
			// margin: 0rpx 16rpx;

			.so-list-item {
				// width: 180rpx;
				width: 180rpx;
				margin-bottom: $spacing-xl;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.avatarImg {
					border-radius: $border-radius-xxl;
				}

				.soName {
					max-width: 132rpx;
					margin-top: $spacing-sm;
					color: $text-color-primary;
					font-size: $font-size-xs;
					line-height: $line-height-size-xs;
				}
			}
		}
	}

	.title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-base $spacing-lg;

		so-search {
			flex: 1;
		}

		.titleIcon {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 20rpx;
			line-height: 28rpx;
			color: #303031;

			.iconChat {
				display: flex;
				align-items: center;
				flex-direction: column;
				margin-right: $spacing-xl;
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
		}
	}

	.thoughts-header-actions {
		position: absolute;
		right: 52rpx;
		top: 0rpx;
		display: flex;
		align-items: flex-end;
		flex-direction: column;
		border-radius: 8rpx;
		transition: all 2s;

		.thoughts-header-actions-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: $bg-color-secondary;
			padding: 16rpx $spacing-xl;
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-sm;
			border-radius: $border-radius-base;

			.thoughts-header-actions-info-share {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				background-color: $bg-color-secondary;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
				font-weight: normal;
				padding-left: 0rpx;
				padding-right: 0rpx;

				.iconImg {
					margin-right: $spacing-xs;
				}
			}

			.thoughts-header-actions-info-line {
				width: 2rpx;
				height: 32rpx;
				background: rgba(30, 30, 30, .8);
				margin: 0rpx $spacing-lg;
			}
		}
	}
</style>
