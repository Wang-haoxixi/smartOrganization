<template>
	<view>
		<view class="title">
			<so-search placeholder="请输入名称" @handleSearch="searchList"></so-search>
		</view>
		<view :style="{height: listHeight + 'px'}">
			<uni-indexed-list :options="showFriendList" />
			<image class="emptyImg" v-if="!showFriendList.length>0 && oss" :src="oss+'pic_noFriend.png'" mode="aspectFit"></image>
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
				friendList: [],
				showFriendList: [],
				listHeight: 0,
			};
		},
		methods: {
			searchList(txt) {
				this.showFriendList = [];
				this.friendList.forEach(res => {
					let item = [];
					item = res.dataList.filter(item => item.realName.indexOf(txt) > -1);
					if (item.length > 0) this.showFriendList.push({
						dataList: item,
						letter: res.letter
					});
				});

			}
		},
		onLoad() {
			uni.createSelectorQuery()
				.in(this)
				.select('.title')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.listHeight = height - ret[0].height;
				});
		},
		onShow() {
			let pinyin = require('js-pinyin');
			let that = this;
			let friendList = [];
			let secondList = [];
			that.friendList = [];
			that.$http.get('admin/friend/list').then(res => {
				let data = res.data.data;
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
				// console.log(this.showList)
			});
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;
	}

	.title {
		padding: 16rpx;
	}
</style>
