<template>
	<view class="container">
		<view class="list">
			<view class="list-item" @tap="changeAvatar">
				<view class="list-item-info">
					<view class="list-item-info-content">
						头像
					</view>
					<image class="avatarImg" :src="imageError(soInfo.avatar,oss)" mode="" v-if="!$isEmpty(soInfo.avatar)"></image>
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap="goSetName">
				<view class="list-item-info">
					<view class="list-item-info-contentWrap">
						名称
					</view>
					<input class="groupName" type="text" placeholder-class="placeholder-class" placeholder="请输入名称"  v-model="soInfo.name" disabled="true"/>
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap="changeBgimg">
				<view class="list-item-info">
					背景图
				</view>
				<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</view>
			<view class="list-item" @tap="changeIntroduction">
				<view class="list-item-info">
					介绍语
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
				id: '',
				avatar: '',
				name: '',
				oss: '',
				soInfo:{
					orgId:'',
					avatar:'',
					name:'',
					introduction:'',
				},
				bgImg:''
			};
		},
		onLoad(options) {
			this.oss = this.$oss
			console.log(options)
			uni.$on('intrudoctionRefresh',data=>{
				console.log(data)
				this.soInfo.introduction=data
			})
			uni.$on('bgImgRefresh',data=>{
				console.log(data)
				this.bgImg=data
			})
			uni.$on('nameRefresh',data=>{
				this.soInfo.name =data
			})
			const {
				id,
				avatar,
				name,
				introduction,
				bgImg
			} = options
			this.soInfo.orgId = id
			this.soInfo.avatar =avatar
			this.soInfo.name =name
			this.soInfo.introduction=introduction
			this.bgImg=bgImg
		},
		onUnload() {
			// uni.$off()
		},
		methods: {
			imageError,
			goSetName(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/editGroupInfo/editGroupName/editGroupName?orgId=${this.soInfo.orgId}&name=${this.soInfo.name}`
				})
			},
			changeIntroduction(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/editGroupInfo/editGroupIntroduction/editGroupIntroduction?id=${this.soInfo.orgId}&introduction=${this.soInfo.introduction}`
				})
			},
			changeBgimg(){
				uni.navigateTo({
					url:`/pages/group/home/manageGroup/editGroupInfo/editGroupBgImg/editGroupBgImg?id=${this.soInfo.orgId}&bgImg=${this.bgImg}`
				})
			},
			changeGroupName(){
				// if(this.$isEmpty(this.soInfo.name)){
				// 	uni.showToast({
				// 		title:"名称不能为空",
				// 		icon:"none"
				// 	})
				// }else{
				// 	this.$http.post('admin/org/update', {
				// 		...this.soInfo
				// 	}).then(res => {
				// 		// console.log(res)
				// 		if (res.data.code == 0) {
				// 			// uni.showToast({
				// 			// 	title: "更改成功",
				// 			// 	icon: "none"
				// 			// })
				// 			uni.$emit('nameRefresh',this.soInfo.name)
				// 		} else {
				// 			uni.showToast({
				// 				title: res.data.message,
				// 				icon: "none"
				// 			})
				// 		}
				// 	})
				// }
			},
			changeAvatar() {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: function(res) {
						// console.log(`http://183.131.134.242:10026/admin/file/app/sftp/upload`)
						uni.uploadFile({
							// src: res.tempFilePaths[0],
							// success: function(image) {
							// 	that.soInfo.org.avatar = image.path
							// }
							url: 'https://www.woneng.net/api/admin/file/app/sftp/upload', //开发者服务器地址
							header: {
								"Content-Type": "multipart/form-data",
								"Authorization": uni.getStorageSync('token')
							},
							filePath: res.tempFilePaths[0], //要上传文件资源的路径
							name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
							success: (res) => {
								console.log(res)
								let url = JSON.parse(res.data).data[0]
								that.soInfo.avatar=url
								that.$http.post('admin/org/update', {
									...that.soInfo
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.$emit('avatarRefresh',that.soInfo.avatar)
									} else {
										uni.showToast({
											title: res.data.message,
											icon: "none"
										})
									}
								})
							},
							fail: (resp) => {
								console.log(resp)
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.placeholder-class {
		color: $text-color-secondary;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
	}
	page {
		background-color: $bg-color-primary;
	}
	.list-item ::after{
		content: " ";
		position: absolute;
		// right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.list {
		padding: 0rpx $spacing-xxl;
		background-color: $color-white;

		.list-item {
			padding: $spacing-xl 0rpx;
			position: relative;
			// border-bottom: 2rpx solid $border-color;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $text-color-primary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;

			.list-item-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-right: $spacing-xs;
				flex: 1;

				.list-item-info-content {
					flex: 1;
				}
				
				.avatarImg {
					width: 88rpx;
					height: 88rpx;
					border-radius: 20rpx;
				}
				.groupName{
					color: $text-color-placeholder;
					flex: 1;
					text-align: right;
				}
				.list-item-info-name {
					color: $text-color-placeholder;
				}
			}

			.rightImg {
				margin-right: -$spacing-base;
			}
		}
	}
</style>
