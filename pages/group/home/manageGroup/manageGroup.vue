<template>
	<view>
		<view class="title" @tap="editInfo">
			<image class="avatarImg" :src="imageError(avatar,oss)" mode="" v-if="!$isEmpty(avatar)"></image>
			<view class="title-info">
				<view class="title-info-name">
					<view class="title-info-name-centent">
						{{$isEmpty(name)?'':name}}
					</view>
					<image v-if="redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
					<image v-if="redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
					<image v-if="redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
					<image v-if="redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
					<image v-if="redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<view class="list">
			<view class="list-item" @tap="noticeManage">
				<view class="">
					公告
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap="contentManage">
				<view class="">
					内容管理
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap="membersManage">
				<view class="">
					成员管理
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
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
				avatar:'',
				redness:'',
				name:'',
				introduction:'',
				isAdmin:'',
				oss:'',
				bgImg:''
			};
		},
		onLoad(options) {
			this.oss=this.$oss
			uni.$on('avatarRefresh',data=>{
				// console.log(data)
				this.avatar=data
			})
			uni.$on('nameRefresh',data=>{
				console.log(666)
				console.log(data)
				this.name = data
			})
			const { id , avatar , redness,name,introduction,isAdmin,bgImg ,isChat} =options
			if(isChat){
				this.$http.get('admin/smart_groups/groups/info', {
					params: {
						orgId: id,
						range: 0
					}
				}).then(res => {
					this.groupDetails = res.data.data
					this.id=this.groupDetails.orgId
					this.avatar = this.groupDetails.avatar
					this.redness =this.groupDetails.redness
					this.name = this.groupDetails.name
					this.introduction=this.groupDetails.introduction
					this.isAdmin =this.groupDetails.isAdmin
					this.bgImg=this.groupDetails.bgImg
					this.groupDetails.avatar = this.imageError(this.groupDetails.avatar, this.oss)
				})
			}else{
				this.id = id
				this.avatar = avatar
				this.redness =redness
				this.name = name
				this.introduction=introduction
				this.isAdmin =isAdmin
				this.bgImg=bgImg
			}
			// console.log(this.isAdmin)
		},
		onUnload() {
			// uni.$off()
		},
		methods:{
			imageError,
			editInfo(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/editGroupInfo/editGroupInfo?id=${this.id}&avatar=${this.avatar}&name=${this.name}&introduction=${this.introduction}&bgImg=${this.bgImg}`
				})
			},
			contentManage(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/contentManage/contentManage?id=${this.id}`
				})
			},
			noticeManage(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/noticeManage/noticeManage?id=${this.id}`
				})
			},
			membersManage(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/membersManage/membersManage?id=${this.id}&isAdmin=${this.isAdmin}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: $bg-color-primary;
	}
	.list-item ::after{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.list{
		padding: 0rpx $spacing-xxl;
		 background-color: $color-white;
		.list-item{
			position: relative;
			padding: $spacing-xl 0rpx;
			// border-bottom: 2rpx solid $border-color;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $text-color-primary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			.rightImg{
				margin-right: -$spacing-base;
			}
		}
	}
.title{
	padding: $spacing-xxl;
	background-color: $color-white;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: $spacing-base;
	.avatarImg{
		width: 120rpx;
		height: 120rpx;
		border-radius: $border-radius-xl;
	}
	.title-info{
		flex: 1;
		margin-left: $spacing-lg;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.title-info-name{
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			.title-info-name-centent{
				max-width: 450rpx;
			}
		}
		.rightImg{
			margin-right: -$spacing-base;
		}
	}
}
</style>
