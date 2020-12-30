<template>
	<view class="container">
	<!-- 	<view class="title">
			用户
		</view> -->
		<view class="person-item" v-if="list.length>0" v-for="(item,index) of list" :key="index" @tap="goDetails(item)">
			<image class="avatarImg" :src="imageError(item.avatar,oss)" mode=""></image>
			<view class="person-item-info">
				<view class="person-item-info-realName">
					{{$isEmpty(item.name)?'':item.name}}
				</view>
				<image v-if="item.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
				<image v-if="item.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
				<image v-if="item.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
				<image v-if="item.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
				<image v-if="item.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
			</view>
		</view>
		<view class="noList" v-if="list.length==0">
			暂无点赞
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
				id:'',
				list:[]
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			this.id=options.id
			this.$http.get('dms/thoughts/thumb_members/'+this.id).then(res=>{
				console.log(res)
				this.list=res.data.data
			})
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
	.person-item-info::after{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.noList{
		margin-top: 80rpx;
		text-align: center;
		color: $text-color-placeholder;
	}
.container{
	padding: 40rpx;
	.title{
		color: $text-color-placeholder;
		font-size: $font-size-sm;
		line-height:$line-height-size-sm ;
		padding-bottom: $spacing-lg;
		// border-bottom: 2rpx solid #EFF0F1;
		position: relative;
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
			// border-bottom: 2rpx solid #EFF0F1;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.person-item-info-realName{
				flex: 1;
				margin-right: $spacing-xs;
				color: $text-color-primary;
				font-size:$font-size-base ;
				line-height:$line-height-size-base ;
			}
		}
	}
}
</style>
