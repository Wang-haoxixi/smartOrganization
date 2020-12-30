<template>
	<view class="personallInfo">
		<view v-if="isLogin" class="personallInfo-top" @tap="navigateTo('editInfo')">
			<image :src="userMsg.avatar" class="img_head"></image>
			<view class="middle">
				<text space="nbsp" class="name">{{$isEmpty(userMsg.realName)?'':userMsg.realName}}</text>
				<image v-if="userMsg.sex" :src="userMsg.sex==='1' ? $ossUrl('icon_smartOrganization_man.png'):$ossUrl('icon_smartOrganization_woman.png')"
				 class="img_sex"></image>
				<image v-if="userMsg.redness" :src="$ossUrl(`icon_smartOrganization_grade${userMsg.redness}.png`)" class="img_grade"></image>
				<image v-if="userMsg.rank" :src="$ossUrl(`icon_smartOrganization_partner${userMsg.rank}.png`)" class="img_partner"></image>
			</view>
			<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
		</view>

		<view v-else class="personallInfo-top" @tap='login'>
			<image :src="$ossUrl('icon_avatar_df.png')" class="img_head"></image>
			<view class="middle" style="font-weight: 400;color: #919397;font-size: 40rpx;">
				登录
			</view>
			<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
		</view>

		<view class="line"></view>

		<view>
			<view class="list-much" @tap="toContentManager()">
				<image :src="$ossUrl('icon_smartOrganization_contentManager.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">内容管理</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
			<view class="list-much" @tap="goMyMien">
				<image :src="$ossUrl('icon_myInfo_myMien.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">个人风采页</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
		</view>

		<view class="line"></view>

		<view>
			<view class="list-much" @tap="navigateTo('nengbei')">
				<image :src="$ossUrl('icon_smartOrganization_nengbei.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">能贝</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
			<view class="list-much" @tap="navigateTo('attention')">
				<image :src="$ossUrl('icon_smartOrganization_attention.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">关注</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
			<!-- <view class="list-much" @tap="navigateTo('collect')">
				<image :src="$ossUrl('icon_smartOrganization_collect.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">收藏</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view> -->
		</view>

		<view class="line"></view>

		<view>
			<view class="list-much" @tap="goWebView('redness')">
				<image :src="$ossUrl('icon_myInfo_redness.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">红度值</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
			<view class="list-much" @tap="navigateTo('partner')">
				<image :src="$ossUrl('icon_myInfo_partner.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">合伙人等级</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
			<view class="list-much" @tap="navigateTo('about')">
				<image :src="$ossUrl('icon_smartOrganization_about.png')" class="img_list"></image>
				<view class="list-much-right">
					<text class="span">关于我能平台</text>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				userMsg: {}
			};
		},

		methods: {
			// 跳转
			navigateTo(url) {
				uni.navigateTo({
					url: './' + url + '/' + url
				});
			},

			toContentManager() {
				if (this.isLogin) {
					uni.navigateTo({
						url: '/pages/my/personalInfo/contentManager/contentManager?id=' + this.userMsg.userId
					});

				} else {
					uni.navigateTo({
						url: '/pages/getUserInfo/getUserInfo'
					})
				}
			},

			login() {
				uni.navigateTo({
					url: '/pages/getUserInfo/getUserInfo'
				});
			},

			goMyMien() {
				if (this.userMsg.userId > 0) {
					uni.navigateTo({
						url: '/pages/my/myMien/myMien?userId=' + this.userMsg.userId
					})
				} else {
					uni.navigateTo({
						url: '/pages/getUserInfo/getUserInfo'
					})
				}
			},

			goWebView(type) {
				uni.navigateTo({
					url: '../../webView/webView?type=' + type
				});
			},
		},

		onShow() {
			this.isLogin = !this.$isEmpty(uni.getStorageSync('token'));
			if (this.isLogin) {
				// let userInfo = uni.getStorageSync('userinfo')
				this.$http.get('admin/app/my', {
					hideLoading: true
				}).then(res => {
					uni.setStorageSync('user', res.data.data);
					this.userMsg = res.data.data
					console.log('userMsg', this.userMsg)
				});
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;

		.personallInfo {

			.img_list {
				width: 44rpx;
				height: 44rpx;
				margin-right: 24rpx;
			}

			.span {
				font-size: 30rpx;
				font-weight: 400;
				color: #303031;
			}

			.img_arrow {
				width: 44rpx;
				height: 44rpx;
			}

			.line {
				height: 16rpx;
			}

			.personallInfo-top {
				height: 120rpx;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				padding: 40rpx 32rpx 40rpx 40rpx;

				.img_head {
					width: 120rpx;
					height: 120rpx;
					border-radius: 24rpx;
					margin-right: 24rpx;
				}

				.middle {
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;

					.name {
						font-size: 40rpx;
						font-weight: 500;
						color: #303031;
						max-width: 250rpx;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}

					.img_sex {
						width: 36rpx;
						height: 36rpx;
						margin: 0 8rpx;
						flex-shrink: 0;
					}

					.img_grade {
						width: 44rpx;
						height: 44rpx;
						flex-shrink: 0;
					}

					.img_partner {
						width: 130rpx;
						height: 44rpx;
						margin-left: 8rpx;
						flex-shrink: 0;
					}
				}
			}
		}

		.list-much {
			height: 112rpx;
			padding: 0 34rpx;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;

			.list-much-right {
				height: 100%;
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;

				&:before {
					content: '';
					width: 98%;
					height: 2rpx;
					background-color: #EFF0F1;
					position: absolute;
					bottom: 0;
					left: 0;
				}
			}
		}

		.list-much:last-of-type {
			.list-much-right {
				&:before {
					content: none;
				}
			}
		}
	}
</style>
