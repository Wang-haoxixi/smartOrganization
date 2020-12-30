<template>
	<view class="editInfo">
		<view class="list" style="padding: 18rpx 0;" @tap="chooseImage()">
			<view class="list-title">头像</view>
			<view class="list-right">
				<view class="list-text">
					<image :src="data.avatar" class="img_head"></image>
					<!-- <sunui-upimg @change="getImageInfo" :upload_auto="true" ref="upimg" :upimg_preview="serviceArr" :header="header"
					 upload_img_wh="width:88rpx;height:88rpx;border-radius:20rpx;" upload_count="1" :isDelShow="false"></sunui-upimg> -->
				</view>
				<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
			</view>
		</view>

		<view class="list" @tap="navigateTo('setName',data.realName)">
			<view class="list-title">名称</view>
			<view class="list-right">
				<view class="list-text"><text space="nbsp">{{data.realName}}</text></view>
				<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
			</view>
		</view>

		<picker class="list-text" @change="sexPickerChange" :value="sexIndex" :range="sexArray" range-key="name">
			<view class="list">
				<view class="list-title">性别</view>
				<view class="list-right">
					<view class="list-text">
						{{ $isEmpty(data.sex)?'请完善':(data.sex == 1 ?'男' : '女') }}
					</view>
					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
		</picker>

		<picker class="list-text" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray"
		 range-key="name" @change="workPlace">
			<view class="list">
				<view class="list-title">地区</view>
				<view class="list-right">
					<view class="list-text">{{ $isEmpty(data.workPlace)?'去完善':data.workPlace }}</view>

					<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
				</view>
			</view>
		</picker>

		<view class="list" @tap="navigateTo('individualResume',data.introduction)">
			<view class="list-title">个人简介</view>
			<view class="list-right">
				<view class="list-text introTxt">{{$isEmpty(data.introduction) ? '去完善' : data.introduction}}</view>
				<image :src="$ossUrl('icon_smartOrganization_rightArrow.png')" class="img_arrow"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import city from '@/common/city.js'

	export default {
		data() {
			return {
				data: {}, //用户信息
				multiIndex: [0, 0],
				multiArray: [
					city,
					city[0].children,
				],
				serviceArr: [],
				header: {},
				sexIndex: 0,
				sexArray: [{
					name: '男',
					value: 1
				}, {
					name: '女',
					value: 2
				}]
			};
		},

		methods: {
			sexPickerChange(e) {
				this.$http.post('admin/user/app/update', {
					sex: e.detail.value - -1
				}).then(res => {
					this.data = res.data.data;
					this.sexIndex = this.data.sex - 1;
					if (this.data.position) {
						this.position = this.data.position.split('-')[(this.data.position.split('-').length - 1)]
					}
				});
			},

			navigateTo(url, data) {
				uni.navigateTo({
					url: './' + url + '/' + url + '?data=' + (this.$isEmpty(data) ? '' : data)
				});
			},

			// 获取用户信息
			getUserInfo() {
				this.$http.get('admin/app/my').then(res => {
					this.data = res.data.data;
					this.serviceArr = [{
						path: res.data.data.avatar
					}];
					// console.log('data', this.data)
					// console.log(this.data.avatar)
				});
			},

			// 选择头像
			getImageInfo(e) {
				console.log(e)
				this.serviceArr = e;
			},

			// 选择头像
			chooseImage() {
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册、拍照选择
					success: function(res) {
						console.log(res.tempFilePaths);
						uni.uploadFile({
							url: 'https://api.woneng.net/admin/file/app/sftp/upload', //开发者服务器地址
							header: {
								"Content-Type": "multipart/form-data",
								"Authorization": uni.getStorageSync('token')
							},
							filePath: res.tempFilePaths[0], //要上传文件资源的路径
							name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
							success: (res) => {
								if (JSON.parse(res.data).code === 0) {
									let avatarImg = JSON.parse(res.data).data.toString()
									// 调用更换头像接口
									_this.$http.post('admin/user/app/update', {
										avatar: avatarImg
									}).then(res => {
										// console.log('更换成功', res)
										if (res.data.code === 0) {
											_this.data = res.data.data
										}
									})
								} else {
									uni.showToast({
										icon: 'none',
										title: '头像上传失败！'
									})
								}
							},
							fail: (resp) => {
								console.log(resp)
							}
						});
					}
				});
			},

			// 选择地区索引
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				// 获取下标
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						// 获取第二列的数据
						this.multiArray[1] = city[this.multiIndex[0]].children
						console.log(this.multiIndex);
						break
				}
				this.$forceUpdate()
			},
			// 调用更改地区接口
			workPlace() {
				this.$http.post('admin/user/app/update', {
					workPlace: this.multiArray[0][this.multiIndex[0]].name + '-' + this.multiArray[1][this.multiIndex[1]].name
				}).then(res => {
					console.log('res', res)
					if (res.data.code === 0) {
						this.data = res.data.data;
					}
				});
			},

		},

		onShow() {
			this.getUserInfo()
			this.header = {
				Authorization: uni.getStorageSync('token')
			};
		}
	}
</script>

<style lang="scss">
	.editInfo {
		width: 93%;
		margin: 0px 25rpx 0 35rpx;

		.list {
			height: 110rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;

			&::before {
				content: '';
				width: 97.5%;
				height: 2rpx;
				background-color: #EFF0F1;
				position: absolute;
				bottom: 0;
				left: 0;
			}

			.list-title {
				width: 120rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #303031;
			}

			.list-right {
				// flex: 1;
				display: flex;
				align-items: center;

				.introTxt {
					max-width: 446rpx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap; 
				}

				.list-text {
					// width: 510rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #919397;
					// display: flex;
					// justify-content: flex-end;

					.img_head {
						width: 88rpx;
						height: 88rpx;
						border-radius: 20rpx;
						display: block;
					}

				}

				.img_arrow {
					width: 44rpx;
					height: 44rpx;
					margin-left: 10rpx;
				}
			}
		}

		.sexPopup-box {
			background-color: #FFFFFF;
			padding: 0 40rpx;
			box-shadow: 0px -2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
			border-radius: 32rpx 32rpx 0px 0px;

			.sexPopup-item {
				height: 110rpx;
				text-align: center;
				line-height: 110rpx;
				font-size: 30rpx;
				font-weight: 500;
				color: #303031;
			}

			.man {
				border-bottom: 2rpx solid #F4F4F4;
			}
		}

	}
</style>
