<template>
	<view class="container">
		<view class="title">
			<view class="search-view">
				<image :src="$ossUrl('icon_search.png')" class="icon-xs"></image>
				<input type="text" v-model="txt" @confirm="search" @input="searchBack" maxlength="30" :placeholder="placeholderTxt" placeholder-class="placeholder-class" focus="true"/>
			</view>
		</view>
		<view class="" v-if="searchStatus==false">
			<view class="history-search" v-if="!$isEmpty(hisrotyList) && hisrotyList.length>0">
				<view class="history-search-title">
					<view class="history-search-title-info">
						历史搜索
					</view>
					<view class="history-search-title-action" @tap="clearHistory">
						<image class="icon-xs" :src="$ossUrl('icon_clear.png')"></image>
						<view class="history-search-title-action-info">
							清除
						</view>
					</view>
				</view>
				<view class="history-search-content">
					<view class="history-search-content-item" v-for="(item,index) of hisrotyList" :key="index" @tap.stop="selectSearch(item)" v-if="index<10">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
			<view class="hot-recommend">
				<view class="hot-recommend-title">
					热门搜索
				</view>
				<view class="hot-recommend-list">
					<view class="hot-recommend-list-item" v-for="(item,index) of hotRecommendList" :key="index" @tap="goDetails(item)">
						<view class="hot-recommend-list-item-num" :class="index==0?'one':index==1?'two':index==2?'three':''">
							{{$isEmpty(index)?'1': index+1}}
						</view>
						<view class="hot-recommend-list-item-info">
							<view class="hot-recommend-list-item-info-content singleEllipsis">
								{{$isEmpty(item.name)?'':item.name}}
							</view>
							<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="" v-if="searchStatus==true">
			<view class="search-person" v-if="searchPersonList.length>0">
				<view class="search-person-title">
					用户
				</view>
				<view class="search-person-list">
					<view class="search-person-item" v-for="(item,index) of searchPersonList" :key="index" v-if="searchPersonList.length=='4'?index<=3:index<3" @tap="goPersonDetail(item)">
						<image class="avatar-xl avatarImg" :src="imageError(item.avatar,oss)"></image>
						<view class="search-person-item-info">
							<view class="search-person-item-info-name singleEllipsis">
								{{$isEmpty(item.realName)?'':item.realName}}
							</view>
							<image v-if="item.redness==1" class="icon-xs" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
							<image v-if="item.redness==2" class="icon-xs" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
							<image v-if="item.redness==3" class="icon-xs" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
							<image v-if="item.redness==4" class="icon-xs" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
							<image v-if="item.redness==5" class="icon-xs" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
						</view>
					</view>
					<view class="search-person-item" @tap="goSearchPersonList" v-if="searchPersonList.length>4">
						<image class="avatar-xl" :src="$ossUrl('icon_communityHome_more.png')" mode=""></image>
						<view class="search-person-item-info">
							<view class="search-person-item-info-name">
								全部
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="search-group"  v-if="searchGroupList.records.length>0">
				<view class="search-group-title">
					群组
				</view>
				<view class="search-group-list">
					<so-group-list-item v-for="(item,index) of searchGroupList.records" :key="index" @goDetails="goDetails(item)"  :avatar="imageError(item.avatar,oss)" :name="item.name" :redness="item.redness" :content="item.thoughtsContent" :time="item.thoughtsCreateTime"></so-group-list-item>
					<uni-load-more :status="thoughtsMore" v-if="searchGroupList.records.length>=10"></uni-load-more>
					<view class="safe-bottom" style="height: 60rpx;"></view>
				</view>
			</view>
		</view>
		<view class="nothing-show" v-if="searchStatus==true && searchPersonList.length==0 && searchGroupList.records.length==0">
			未搜索到相关人员以及群组
		</view>
	</view>
</template>

<script>
	import{
		imageError
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				oss:'',
				txt:'',
				searchStatus:false,
				placeholderTxt:'搜索群组或用户',
				hisrotyList:[],
				hotRecommendList:[],
				searchPersonList:[],
				searchGroupList:{
					records:[]
				},
				thoughtsMore:'more'
			};
		},
		onLoad() {
			this.oss=this.$oss
			if(this.$isEmpty(uni.getStorageSync('globalSearchHistory'))){
				uni.setStorageSync('globalSearchHistory',[])
			}else{
				this.hisrotyList =uni.getStorageSync('globalSearchHistory')
			}
			this.$http.get('admin/smart_groups/user/count/ranking',{
				params:{
					size:5
				}
			}).then(res=>{
				// console.log(res)
				this.hotRecommendList =res.data.data
			})
		},
		onReachBottom() {
			if(this.searchGroupList.current<this.searchGroupList.pages){
				this.$http.get('admin/smart_groups/list',{
					params:{
						current:this.searchGroupList.current+1,
						name:this.txt
					}
				}).then(res=>{
					console.log(res)
					this.searchGroupList.current=res.data.data.current
					if(this.searchGroupList.current<this.searchGroupList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
					this.searchGroupList.records= this.searchGroupList.records.concat(res.data.data.records)
				})
			}
		},
		methods:{
			imageError,
			goPersonDetail(item){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${item.userId}`
				})
			},
			goDetails(item){
				uni.navigateTo({
					url:`/pages/group/home/home?id=${item.orgId}`
				})
			},
			selectSearch(item){
				// console.log(666)
				this.txt = item
				uni.$emit('searchItem',this.txt)
				this.searchStatus=true
				this.$http.get('admin/search/search_user',{
					params:{
						type:1,
						keyword:this.txt
					}
				}).then(res=>{
					this.searchPersonList=res.data.data.records
					console.log(this.searchPersonList)
				})
				//搜搜群组
				this.$http.get('admin/smart_groups/list',{
					params:{
						name:this.txt
					}
				}).then(res=>{
					this.searchGroupList=res.data.data
					console.log(this.searchGroupList)
					if(this.searchGroupList.current<this.searchGroupList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
				})
			},
			clearHistory(){
				uni.removeStorageSync('globalSearchHistory')
				this.hisrotyList = []
			},
			goSearchPersonList(){
				uni.navigateTo({
					url:`/pages/community/home/globalSearch/searchPersonList/searchPersonList?txt=${this.txt}`
				})
			},
			searchBack(){
				if(this.$isEmpty(this.txt.trim())){
					this.searchStatus=false
				}
			},
			search(){
				if(this.$isEmpty(this.txt.trim())){
					this.searchStatus=false
				}else{
					this.searchStatus=true
				}
				if(this.hisrotyList.includes(this.txt.trim())==false &&!this.$isEmpty(this.txt.trim())){
					this.hisrotyList.unshift(this.txt)
				}
				uni.setStorageSync('globalSearchHistory',this.hisrotyList)
				//搜索人
				this.$http.get('admin/search/search_user',{
					params:{
						type:1,
						keyword:this.txt
					}
				}).then(res=>{
					console.log(res)
					this.searchPersonList=res.data.data.records
				})
				//搜搜群组
				this.$http.get('admin/smart_groups/list',{
					params:{
						name:this.txt
					}
				}).then(res=>{
					console.log(res)
					this.searchGroupList=res.data.data
					if(this.searchGroupList.current<this.searchGroupList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-group-title::after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}
	.hot-recommend-list-item-info::after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}
	.history-search-content-item::after {
	     content : " " ; /* 注意这里为双引号 */
	     position : absolute ;
		 top: 0rpx;
		 left: 0rpx;
	     width : 200% ;
	     height : 200% ;
	     border : 1px solid #E3E4E5;
	     border-radius: 56rpx;/* 也可以设置圆角 */
	     transform-origin: 0 0 ;
	     transform: scale( 0.5 , 0.5 );
	     box-sizing: border-box;
	}
	.search-view {
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
	.nothing-show{
		text-align: center;
		font-size:$font-size-sm ;
		line-height:$line-height-size-sm ;
		color: $text-color-regular;
		margin-top: 104rpx;
	}
.one{
	background-color: #FB4273 !important;
}
.two{
	background-color: #FE8155 !important;
}
.three{
	background-color: #FCB80A !important;
}
page{
	background-color: $bg-color-primary;
}
.container{
	padding: $spacing-base;
	.title{
		padding: 0rpx $spacing-sm;
		margin-bottom: $spacing-xl;
	}
	.history-search{
		background-color: $color-white;
		padding: $spacing-xl $spacing-lg;
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-base;
		.history-search-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $spacing-base;
			.history-search-title-info{
				color: $text-color-primary;
				font-size:$font-size-lg ;
				line-height:$line-height-size-lg ;
				font-weight: bold;
			}
			.history-search-title-action{
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.history-search-title-action-info{
					color: $text-color-placeholder;
					font-size:$font-size-xxs ;
					line-height: $line-height-size-xxs;
				}
			}
		}
		.history-search-content{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			color: $text-color-primary;
			.history-search-content-item{
				position: relative;
				padding: 8rpx 24rpx;
				margin-right: $spacing-base;
				margin-top: $spacing-base;
			}
		}	
	}
	.hot-recommend{
		background-color: $color-white;
		padding: $spacing-xl $spacing-lg;
		border-radius: $border-radius-lg;
		.hot-recommend-title{
			color: $text-color-primary;
			font-size:$font-size-lg ;
			line-height:$line-height-size-lg ;
			font-weight: bold;
			margin-bottom: $spacing-lg;
		}
		.hot-recommend-list{
			.hot-recommend-list-item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.hot-recommend-list-item-num{
					width:$icon-size-sm;
					height: $icon-size-sm;
					line-height:$icon-size-sm ;
					font-size: $font-size-lg;
					text-align: center;
					border-radius: $border-radius-base;
					background-color: #BABEC0;
					color: $color-white;
					margin-right: $spacing-base;
				}
				.hot-recommend-list-item-info{
					position: relative;
					flex: 1;
					min-width: 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: $spacing-lg 0rpx;
					// border-bottom: 2rpx solid $border-color;
					.hot-recommend-list-item-info-content{
						flex: 1;
						color: $text-color-primary;
						font-size: $font-size-sm;
						line-height: $line-height-size-sm;
					}
					.rightImg{
						margin-right: -$spacing-base;
					}
				}
			}
		}
	}
	.search-person{
		background-color: $color-white;
		padding: $spacing-lg $spacing-lg $spacing-xl $spacing-lg;
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-base;
		.search-person-title{
			font-size:$font-size-sm ;
			line-height: $line-height-size-sm;
			color: $text-color-placeholder;
			padding-bottom:$spacing-lg ;
			border-bottom: 2rpx solid #EFF0F1;
		}
		.search-person-list{
			padding-top: $spacing-xl;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.search-person-item{
				display: flex;
				align-items: center;
				flex-direction: column;
				width: 25%;
				margin-right: 8rpx;
				.avatarImg{
					border-radius: $border-radius-xl;
				}
				.search-person-item-info{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: $spacing-sm;
					.search-person-item-info-name{
						max-width: 132rpx;
						font-size:$font-size-xxs ;
						line-height: $line-height-size-xs;
						color: $text-color-primary;
					}
				}
			}
		}
	}
	.search-group{
		background-color: $color-white;
		padding: $spacing-lg $spacing-lg $spacing-xl $spacing-lg;
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-base;
		.search-group-title{
			position: relative;
			font-size:$font-size-sm ;
			line-height: $line-height-size-sm;
			color: $text-color-placeholder;
			padding-bottom:$spacing-lg ;
			// border-bottom: 2rpx solid #EFF0F1;
		}
	}
}
</style>
