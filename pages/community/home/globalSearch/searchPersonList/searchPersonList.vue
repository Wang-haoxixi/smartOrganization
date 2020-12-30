<template>
	<view class="container">
		<view class="title">
			用户
		</view>
		<view class="person-item" v-for="(item,index) of personList.records" :key="index" @tap="goDetails(item)">
			<image class="avatarImg" :src="imageError(item.avatar,oss)" mode=""></image>
			<view class="person-item-info">
				<view class="person-item-info-realName">
					{{$isEmpty(item.realName)?'':item.realName}}
				</view>
				<image v-if="item.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
				<image v-if="item.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
				<image v-if="item.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
				<image v-if="item.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
				<image v-if="item.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
			</view>
		</view>
		<uni-load-more :status="thoughtsMore" v-if="personList.records.length>=20"></uni-load-more>
		<view class="safe-bottom" style="height: 60rpx;"></view>
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
				personList:{
					records:[]
				},
				thoughtsMore:'more'
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			this.txt=options.txt
			this.$http.get('admin/search/search_user',{
				params:{
					type:1,
					keyword:this.txt,
					size:20
				}
			}).then(res=>{
				this.personList=res.data.data
				if(this.personList.current<this.personList.pages){
					this.thoughtsMore='more'
				}else{
					this.thoughtsMore="noMore"
				}
			})
		},
		onReachBottom() {
			// console.log(6)
			if(this.personList.current<this.personList.pages){
				this.$http.get('admin/search/search_user',{
					params:{
						type:1,
						keyword:this.txt,
						size:20,
						current:this.personList.current+1
					}
				}).then(res=>{
					this.personList.current=res.data.data.current
					if(this.personList.current<this.personList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore="noMore"
					}
					this.personList.records = this.personList.records.concat(res.data.data.records)
				})
			}
		},
		methods:{
			imageError,
			goDetails(item){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${item.id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.title::after{
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}
	.person-item-info::after{
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}
.container{
	padding: 40rpx;
	height: 100vh;
	.title{
		position: relative;
		color: $text-color-placeholder;
		font-size: $font-size-sm;
		line-height:$line-height-size-sm ;
		padding-bottom: $spacing-lg;
		// border-bottom: 2rpx solid #EFF0F1;
	}
	.person-item{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.avatarImg{
			width: 80rpx;
			height: 80rpx;
			border-radius: $border-radius-lg;
		}
		.person-item-info{
			flex: 1;
			min-width: 0;
			margin-left: $spacing-lg;
			padding: $spacing-xl 0rpx;
			position: relative;
			// border-bottom: 2rpx solid #EFF0F1;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.person-item-info-realName{
				margin-right: $spacing-xs;
				color: $text-color-primary;
				font-size:$font-size-base ;
				line-height:$line-height-size-base ;
			}
		}
	}
}
</style>
