<template>
	<view>
		<view class="searchTitle">
			<so-search @handleSearch="searchList"></so-search>
		</view>
		<view class="listWrap" v-if="list.length>0">
			<view class="listWrap-item" v-for="(item,index) of list" :key="index" @tap="goPersonDetails(item)">
				<view class="avatarImg-wrap">
					<image class="avatarImg" :src="imageError(item.avatar,oss)" mode=""></image>
				</view>
				<view class="listWrap-item-name singleEllipsis">
					{{$isEmpty(item.realName)?'':item.realName}}
				</view>
			</view>
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
				id:'',
				oss:'',
				list:[]
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			this.id=options.id
			this.$http.get('admin/smart_groups/groups/user/list',{
				params:{
					orgId:this.id
				}
			}).then(res=>{
				console.log(res)
				this.list=res.data.data
			})
		},
		methods:{
			imageError,
			searchList(txt){
				console.log(txt)
				if(!this.$isEmpty(txt.trim())){
					this.list=this.list.filter(item=>{
						return item.realName.includes(txt)
					})
				}else{
					this.$http.get('admin/smart_groups/groups/info',{
						params:{
							orgId:this.id,
							range:1
						}
					}).then(res=>{
						console.log(res)
						this.list=res.data.data
					})
				}
			},
			goPersonDetails(item){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${item.userId}`
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: $bg-color-primary;
}
.searchTitle{
	padding: $spacing-base;
}
.listWrap{
		width: 100%;
		background-color:$color-white;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding-top: 40rpx;
		.listWrap-item{
			width: 150rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 24rpx;
			.avatarImg-wrap{
				// padding: $spacing-base $spacing-xl $spacing-sm;
				.avatarImg{
					width: 88rpx;
					height: 88rpx;
					border-radius: $spacing-base;
				}
			}
			.listWrap-item-name{
				max-width: 120rpx;
				text-align: center;
				font-size: $font-size-xxs;
				line-height: $line-height-size-xxs;
				color: $text-color-regular;
				margin-bottom: $spacing-sm;
			}
		}
	}
</style>
