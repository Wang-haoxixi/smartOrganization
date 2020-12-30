<template>
	<view class="container">
		<view class="title">
			<so-search class="so-search" :placeholder="placeholderTxt" @handleSearch="searchList"></so-search>
			<view class="ownerGroupTitleBtn" @tap="createGroup">
				创建群组
			</view>
		</view>
		<view class="list">
			<so-group-list-item v-if="groupList.records.length>0" v-for="(item,index) of groupList.records" :key="index" :avatar="imageError(item.avatar,oss)"
			 :name="item.name" :redness="item.redness" :content="item.thoughtsContent" :time="item.thoughtsCreateTime"
			 @goDetails="goGroupDetails(item)"></so-group-list-item>
			 <view class="noContent" v-else>
			 	未搜索到相关群组
			 </view>
			 <uni-load-more :status="thoughtsMore" v-if="groupList.records.length>=10"></uni-load-more>
			 <view class="safe-bottom" style="height: 60rpx;"></view>
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
				oss: '',
				groupList: {
					records:[]
				},
				placeholderTxt: '搜索群组',
				groupListNum: '',
				userId: '',
				thoughtsMore:'more',
				txt:''
			};
		},
		onLoad() {
			this.oss = this.$oss
			this.userId = uni.getStorageSync('userinfo').user_id
			this.$http.get('admin/smart_groups/list', {
				params: {
					userId: this.userId
				}
			}).then(res => {
				console.log(res)
				this.groupList = res.data.data
				if(this.groupList.current<this.groupList.pages){
					this.thoughtsMore='more'
				}else{
					this.thoughtsMore='noMore'
				}
				this.groupListNum = res.data.data.total
				uni.setNavigationBarTitle({
					title: `我的群组(${this.groupListNum})`
				})
			})
		},
		onPullDownRefresh() {
			console.log('refresh');
			if(this.$isEmpty(this.txt)){
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			}else{
				this.$http.get('admin/smart_groups/list', {
					params: {
						userId: this.userId,
						name: this.txt
					}
				}).then(res => {
					console.log(res)
					this.groupList = res.data.data
					this.groupListNum = res.data.data.total
					uni.setNavigationBarTitle({
						title: `我的群组(${this.groupListNum})`
					})
				})
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			}
		},
		onReachBottom() {
			if (this.groupList.current < this.groupList.pages) {
				this.$http.get('admin/smart_groups/list', {
					params: {
						userId: this.userId,
						current: this.groupList.current + 1
					}
				}).then(res => {
					console.log(res)
					this.groupList.current = res.data.data.current
					if(this.groupList.current<this.groupList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
					this.groupList.records = this.groupList.records.concat(res.data.data.records)
				})
			} else {

			}
		},
		methods: {
			imageError,
			searchList(txt) {
				this.txt =txt
				this.$http.get('admin/smart_groups/list', {
					params: {
						userId: this.userId,
						name: txt
					}
				}).then(res => {
					console.log(res)
					this.groupList = res.data.data
					if(this.groupList.current<this.groupList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
					this.groupListNum = res.data.data.total
					uni.setNavigationBarTitle({
						title: `我的群组(${this.groupListNum})`
					})
				})
			},
			createGroup() {
				uni.navigateTo({
					url: '/pages/community/home/createGroup/createGroup'
				})
			},
			goGroupDetails(item) {
				uni.navigateTo({
					url: `/pages/group/home/home?id=${item.orgId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.noContent{
		text-align: center;
		margin-top: 80rpx;
		color: #919397;
		font-size: 24rpx;
		line-height: 32rpx;
	}
	.title {
		background-color: $bg-color-primary;
		padding: $spacing-base $spacing-lg;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.so-search {
			flex: 1;
		}

		.ownerGroupTitleBtn {
			color: $color-white;
			font-size: $font-size-sm;
			line-height: $line-height-size-xxs;
			font-weight: bold;
			padding: $spacing-base $spacing-lg;
			border-radius: $border-radius-base;
			background-color: $color-primary;
			margin-left: $spacing-lg;
		}
	}

	.list {
		padding: $spacing-sm 40rpx $spacing-xl;
	}

	.num {
		text-align: center;
		color: $text-color-regular;
		font-size: $font-size-xxs;
		line-height: 34rpx;
	}
</style>
