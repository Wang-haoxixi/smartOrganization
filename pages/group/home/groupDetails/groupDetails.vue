<template>
	<view class="">
		<view class="container">
			<view class="title" v-if="!$isEmpty(groupInfo.avatar)">
				<image class="avatarImg" :src="imageError(groupInfo.avatar,oss)" mode=""></image>
				<view class="title-info">
					<view class="title-info-name">
						<text class="title-info-name-info">
							{{$isEmpty(groupInfo.name)?'':groupInfo.name}}
						</text>
						<image v-if="groupInfo.redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
						<image v-if="groupInfo.redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
						<image v-if="groupInfo.redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
						<image v-if="groupInfo.redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
						<image v-if="groupInfo.redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
					</view>
					<!-- <image class="icon-sm rightImg" src="../../../../static/icon_right.png" mode=""></image> -->
				</view>
			</view>
			<view class="content">
				{{$isEmpty(groupInfo.introduction)?'':groupInfo.introduction}}
			</view>
			<view class="adminTitle">
				能主
			</view>
			<view class="adminWrap" v-if="!$isEmpty(groupInfo.userList)" @tap="goOwnerPersonDetails(groupInfo.userList[0].userId)">
				<image class="avatarImg" :src="imageError(groupInfo.userList[0].avatar,oss)" mode=""></image>
				<view class="adminWrap-info">
					<view class="">
						{{$isEmpty(groupInfo.userList[0])?'':groupInfo.userList[0].realName}}
					</view>
					<image v-if="groupInfo.userList[0].redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
					<image v-if="groupInfo.userList[0].redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
					<image v-if="groupInfo.userList[0].redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
					<image v-if="groupInfo.userList[0].redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
					<image v-if="groupInfo.userList[0].redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="listTitle">
				成员列表(包含<text class="listTitle-num">{{$isEmpty(groupInfo.friendsNum)?'':groupInfo.friendsNum}}</text>好友)
			</view>
			<view class="listWrap">
				<view class="listWrap-item" v-for="(item,index) of groupInfo.userList" :key="index" v-if="index<=29" @tap="goPersonDetails(item)">
					<view class="avatarImg-wrap">
						<image class="avatarImg" :src="imageError(item.avatar,oss)" mode=""></image>
					</view>
					<view class="listWrap-item-name singleEllipsis">
						{{$isEmpty(item.realName)?'':item.realName}}
					</view>
				</view>
			</view>
			<view class="listNum" @tap="goList" v-if="groupInfo.memberNum>30">
				<view class="">
					共{{$isEmpty(groupInfo.memberNum)?'':groupInfo.memberNum}}人
				</view>
				<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
		</view>
		<view class="safe-bottom">
			<view class="noContent" @tap="outGroup" v-if="groupInfo.isJoin==true">
				退出群组
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
				groupInfo:{}
			};
		},
		onLoad(options) {
			this.id=options.id
			this.oss=this.$oss
			this.$http.get('admin/smart_groups/groups/info',{
				params:{
					orgId:this.id,
					range:1
				}
			}).then(res=>{
				console.log(res)
				this.groupInfo=res.data.data
			})
		},
		methods:{
			imageError,
			goList(){
				uni.navigateTo({
					url:`/pages/group/home/groupDetails/groupList/groupList?id=${this.id}`
				})
			},
			goPersonDetails(item){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${item.userId}`
				})
			},
			goOwnerPersonDetails(item){
				uni.navigateTo({
					url:`/pages/my/myMien/myMien?userId=${item}`
				})
			},
			outGroup() {
				let that = this
				uni.showModal({
					content: '退出群组后，将不再收到群组的任何消息，相关权益也将不再享有，是否放弃退出？',
					cancelColor: '#07C160',
					confirmColor:'#BABEC0',
					cancelText:'确定',
					confirmText:'退出',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.$http.get('admin/org/sign/out/' + that.id).then(res => {
								console.log(res)
								if (res.data.code == 1) {
									uni.showToast({
										title: res.data.message,
										icon: "none"
									})
								} else {
									uni.showToast({
										title: "退出成功",
										icon: "none",
										duration: 1000,
										success: () => {
											setTimeout(() => {
												// that.groupDetails.isJoin = false
												// that.groupDetails.memberNum--;
												uni.navigateTo({
													url:`/pages/group/home/home?id=${that.id}`
												})
											},1000)
										}
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
		}	
	}
</script>

<style lang="scss">
	.noContent{
		padding-top: 60rpx;
		color: #BABEC0;
		text-align: center;
		font-size: 22rpx;
		line-height: 32rpx;
		padding-bottom: 40rpx;
	}
	page{
		background-color: #F4F5F6;
	}
	.container{
		background-color: #FFFFFF;
		margin-bottom: 200rpx;
	}
	.listNum{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		color: $text-color-regular;
		text-align: center;
		padding-top: $spacing-lg;
		padding-bottom: 34rpx;
	}
	.listWrap{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-top: 40rpx;
		.listWrap-item{
			width: 150rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 24rpx;
			.avatarImg-wrap{
				// padding: $spacing-base $spacing-xl $spacing-sm;
				margin-bottom: 8rpx;
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
				// margin-bottom: $spacing-sm;
			}
		}
	}
	.listTitle{
		padding: 14rpx $spacing-xxl;
		background-color: $bg-color-primary;
		color: $text-color-placeholder;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		.listTitle-num{
			color: $color-primary;
		}
	}
	.adminWrap{
		padding:$spacing-base $spacing-xxl ;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.avatarImg{
			width: 80rpx;
			height: 80rpx;
			border-radius: $border-radius-lg;
		}
		.adminWrap-info{
			flex: 1;
			margin-left: $spacing-lg;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			color: $text-color-primary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
		}
		.rightImg{
			margin-right:-$spacing-base;
		}
	}
	.adminTitle{
		padding: 14rpx $spacing-xxl;
		background-color: $bg-color-primary;
		color: $text-color-placeholder;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		
	}
.title{
	padding: $spacing-xxl $spacing-xxl $spacing-lg;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	.avatarImg{
		width: 120rpx;
		height: 120rpx;
		border-radius: $border-radius-xl;
	}
	.title-info{
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-left: $spacing-lg;
		min-width: 0;
		.title-info-name{
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			// flex-wrap: wrap;
			color: $text-color-primary;
			font-size:$font-size-xxl ;
			line-height: $line-height-size-base;
			.title-info-name-info{
				flex: 1;min-width: 0;
			}
		}
		.rightImg{
			margin-right:-$spacing-base;
		}
	}
}
.content{
		padding: 0rpx $spacing-xxl $spacing-xxl;
		font-size: $font-size-sm;
		line-height: $line-height-size-sm;
		color: $text-color-regular;
	}
</style>
