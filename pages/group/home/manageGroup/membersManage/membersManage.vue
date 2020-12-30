<template>
	<view>
		<view class="title">
			<!-- <so-search placeholder="请输入名称"></so-search> -->
			<view class="search-view">
				<image :src="$ossUrl('icon_search.png')" class="icon-xs"></image>
				<input type="text" placeholder="请输入名称" v-model="txt" placeholder-class="placeholder-class" @input='searchList' />
			</view>
		</view>
		<view :style="{height: listHeight + 'px'}">
			<uni-indexed-so-list :options="showFriendList" :orgId="id" @actions="manageActions">
				<view class="adminWrap" v-if="showAdminListStatus==true">
					<view class="adminWrapTitle">
						<view class="adminWrapTitleLeft">
							群主、管理员
						</view>
						<view class="adminWrapTitleRight">
							左滑成员可进行操作
						</view>
					</view>
					<view class="adminWrap-item" v-for="(item,index) of adminList" :key="index" @tap="goDetails(item)">
						<image class="avatarImg" :src="imageError(item.avatar,oss)" mode=""></image>
						<view class="person-item-info">
							<image class="iconAdminImg" :src="$ossUrl('icon_group_admin.png')" mode="" v-if="item.isAdmin==2"></image>
							<image class="iconManageImg" :src="$ossUrl('icon_group_manage.png')" mode="" v-if="item.isAdmin==1"></image>
							<view class="person-item-info-realName singleEllipsis">
								{{$isEmpty(item.name)?'':item.name}}
							</view>
							<image v-if="item.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
							<image v-if="item.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
							<image v-if="item.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
							<image v-if="item.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
							<image v-if="item.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
						</view>
					</view>
				</view>
			</uni-indexed-so-list>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				id: '',
				friendList: [],
				showFriendList: [],
				adminList: [],
				showAdminListStatus: true,
				listHeight: 0,
				oss: '',
				isAdmin: '',
				txt: ''
			};
		},
		methods: {
			imageError,
			goDetails(item) {
				uni.navigateTo({
					url: `/pages/my/myMien/myMien?userId=${item.userId}`
				})
			},
			searchList() {
				if (this.txt.length > 0) {
					this.showAdminListStatus = false
				} else {
					this.showAdminListStatus = true
				}
				this.showFriendList = [];
				this.friendList.forEach(res => {
					let item = [];
					item = res.dataList.filter(item => item.realName.indexOf(this.txt) > -1);
					if (item.length > 0) this.showFriendList.push({
						dataList: item,
						letter: res.letter
					});
				});
			},
			goNext(item) {
				if (item.userId > 0) {
					this.$store.commit('createGroupConversationActive', item.userId)
					uni.navigateTo({
						url: '/pages/chat/chatRoom/chatRoom'
					})
				}
				// console.log(item.dataList.userId)
			}
		},
		onLoad(options) {
			// console.log(options)
			this.id = options.id
			this.oss = this.$oss
			this.isAdmin = options.isAdmin
			// console.log(this.isAdmin)
			uni.$on('refresh', data => {
				// console.log(9666)
				this.txt = ''
				this.showAdminListStatus = true
				this.friendList = []
				this.showFriendList = []
				let pinyin = require('js-pinyin');
				let that = this;
				let friendList = [];
				let secondList = [];
				that.$http.get('admin/smart_groups/groups/user/list', {
					params: {
						orgId: that.id
					}
				}).then(res => {
					// console.log(res)
					let data = res.data.data.map(item => {
						let options = []
						if (that.isAdmin == 2 && item.isAdmin == 0) {
							// console.log(that.isAdmin)
							options = [{
									text: '设为管理员',
									style: {
										backgroundColor: '#FFC300'
									}
								},
								{
									text: '移出群组',
									style: {
										backgroundColor: '#FA5151'
									}
								},
							]
						} else if (that.isAdmin == 2 && item.isAdmin == 1) {
							options = [{
									text: '移除管理员',
									style: {
										backgroundColor: '#4C4C4C'
									}
								},
								{
									text: '移出群组',
									style: {
										backgroundColor: '#FA5151'
									}
								},
							]
						} else if (that.isAdmin == 1 && item.isAdmin == 0) {
							options = [{
								text: '移出群组',
								style: {
									backgroundColor: '#FA5151'
								}
							}, ]
						} else {
							options = []
						}
						return {
							...item,
							options: options
						}
					})
					// console.log(data)
					this.adminList = res.data.data.filter(item => {
						return item.isAdmin == 1 || item.isAdmin == 2
					})
					// console.log(this.adminList)
					data.forEach(item => {
						//遍历数组,拿到名称
						let name = item.realName;
						//取全部数据的首字母
						let fristName = pinyin.getCamelChars(name).substring(0, 1);
						if (fristName < 'A' || fristName > 'Z') {
							fristName = '#';
						}
						//给原json添加首字母键值对
						item.letter = fristName;
						//放入新数组
						friendList.push(item);
						secondList.push(fristName);
						// console.log(soList)
					});
					secondList.sort();
					for (var i = 0; i < secondList.length; i++) {
						if (secondList[i] == secondList[i + 1]) {
							secondList.splice(i, 1);
							i--;
						}
					}
					//根据首字母键值对给原数据按首字母分类
					secondList.forEach(item => {
						let dataList = [];
						friendList.forEach((item2, index) => {
							if (item == item2.letter) {
								//手动排除图片出错
								item2.avatar = imageError(item2.avatar, that.oss)
								dataList.push(item2);
								//从待选数组中删除 提高效率
								// soList.splice(index, 1);
							}
						});
						that.friendList.push({
							letter: item,
							dataList: dataList
						});
					});
					that.showFriendList = that.friendList;
					// console.log(this.showFriendList)
				});
			})
			uni.createSelectorQuery()
				.in(this)
				.select('.title')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.listHeight = height - ret[0].height;
				});
			let pinyin = require('js-pinyin');
			let that = this;
			let friendList = [];
			let secondList = [];
			that.$http.get('admin/smart_groups/groups/user/list', {
				params: {
					orgId: that.id
				}
			}).then(res => {
				let data = res.data.data.map(item => {
					let options = []
					if (that.isAdmin == 2 && item.isAdmin == 0) {
						// console.log(that.isAdmin)
						options = [{
								text: '设为管理员',
								style: {
									backgroundColor: '#FFC300'
								}
							},
							{
								text: '移出群组',
								style: {
									backgroundColor: '#FA5151'
								}
							},
						]
					} else if (that.isAdmin == 2 && item.isAdmin == 1) {
						options = [{
								text: '移除管理员',
								style: {
									backgroundColor: '#4C4C4C'
								}
							},
							{
								text: '移出群组',
								style: {
									backgroundColor: '#FA5151'
								}
							},
						]
					} else if (that.isAdmin == 1 && item.isAdmin == 0) {
						options = [{
							text: '移出群组',
							style: {
								backgroundColor: '#FA5151'
							}
						}, ]
					} else {
						options = []
					}
					return {
						...item,
						options: options
					}
				})
				// console.log(data)
				this.adminList = res.data.data.filter(item => {
					return item.isAdmin == 1 || item.isAdmin == 2
				})
				// console.log(this.adminList)
				data.forEach(item => {
					//遍历数组,拿到名称
					let name = item.realName;
					//取全部数据的首字母
					let fristName = pinyin.getCamelChars(name).substring(0, 1);
					if (fristName < 'A' || fristName > 'Z') {
						fristName = '#';
					}
					//给原json添加首字母键值对
					item.letter = fristName;
					//放入新数组
					friendList.push(item);
					secondList.push(fristName);
					// console.log(soList)
				});
				secondList.sort();
				for (var i = 0; i < secondList.length; i++) {
					if (secondList[i] == secondList[i + 1]) {
						secondList.splice(i, 1);
						i--;
					}
				}
				//根据首字母键值对给原数据按首字母分类
				secondList.forEach(item => {
					let dataList = [];
					friendList.forEach((item2, index) => {
						if (item == item2.letter) {
							//手动排除图片出错
							item2.avatar = imageError(item2.avatar, that.oss)
							dataList.push(item2);
							//从待选数组中删除 提高效率
							// soList.splice(index, 1);
						}
					});
					that.friendList.push({
						letter: item,
						dataList: dataList
					});
				});
				that.showFriendList = that.friendList;
				// console.log(this.showFriendList)
			});
		},
	}
</script>

<style lang="scss">
	.person-item-info::after {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
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
		background-color: #F4F5F6;
	}

	.title {
		padding: 16rpx;
	}

	.adminWrap {
		.adminWrapTitle {
			padding: 12rpx $spacing-xl;
			color: $text-color-placeholder;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.adminWrapTitleLeft {
				font-size: $font-size-lg;
				line-height: $line-height-size-base;
			}

			.adminWrapTitleRight {
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
			}
		}

		.adminWrap-item {
			padding: 0rpx $spacing-xl;
			background-color: $color-white;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.avatarImg {
				width: 80rpx;
				height: 80rpx;
				border-radius: $border-radius-lg;
			}

			.person-item-info {
				flex: 1;
				min-width: 0;
				margin-left: $spacing-lg;
				padding: $spacing-xl 0rpx;
				// border-bottom: 2rpx solid #EFF0F1;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.iconAdminImg {
					width: 52rpx;
					height: 28rpx;
					margin-right: $spacing-sm;
				}

				.iconManageImg {
					width: 72rpx;
					height: 28rpx;
					margin-right: $spacing-sm;
				}

				.person-item-info-realName {
					max-width: 406rpx;
					margin-right: $spacing-xs;
					color: $text-color-primary;
					font-size: $font-size-base;
					line-height: $line-height-size-base;
				}
			}
		}
	}
</style>
