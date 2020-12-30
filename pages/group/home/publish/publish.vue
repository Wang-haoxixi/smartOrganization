<template>
	<view class="container">
		<view class="title">
			<view class="title-wrap">
				<image class="avatarImg" :src="avatar" mode=""></image>
				<view class="title-wrap-name singleEllipsis">
					{{name}}
				</view>
			</view>
			<view class="notPublishBtn" v-show="status==false">
				发表
			</view>
			<view class="publishBtn" v-show="status==true" @tap="publishThoughts">
				发表
			</view>
		</view>
		<textarea @input="checkInput"  @linechange="linechange" :style="{height:lineCount*44 + 'rpx'}"
		 v-model="txt" placeholder="请输入" placeholder-class="inputDefault" maxlength="150" />
		<view class="content-img">
			<view class="content-img-item" v-if="imgs.length>0" v-for="(item,index) of imgs" :key="index">
				<image class="content-img-item-img" :src="item" mode="aspectFill"></image>
				<image class="delImg" :src="$ossUrl('icon_publishImgDel.png')" mode="" @tap="delImg(item,index)"></image>
			</view>
			<view class="content-img-item" v-if="imgs.length<9">
				<view class="content-publish" @tap="addImg">
					<image class="content-publish-img" :src="$ossUrl('icon_thoughts_publish.png')" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view class="content-link" @tap="link">
			<image class="icon-sm" :src="$ossUrl('icon_newLink.png')" mode=""></image>
			<view class="content-link-info singleEllipsis" v-if="!$isEmpty(attach.title)">
				{{$isEmpty(attach.title)?'':attach.title}}
			</view>
			<view class="content-link-info" v-else>
				链接
			</view>
			<image v-if="!$isEmpty(attach.title)" class="delLink" :src="$ossUrl('icon_publishLinkDel.png')" mode="" @tap.stop="delLink"></image>
			<image v-if="$isEmpty(attach.title)" class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
		</view>
		<view class="content-location">
			<image class="icon-sm" :src="$ossUrl('icon_linkLocation.png')" mode=""></image>
			<picker mode="region" class="regionPicker" @change="bindPickerChange">
				<view class="" v-if="$isEmpty(location)">
					位置
				</view>
				<view v-else class="uni-input">{{location}}</view>
				<image v-if="!$isEmpty(location)" class="delLink" :src="$ossUrl('icon_publishLinkDel.png')" mode="" @tap.stop="deLocation"></image>
				<image v-if="$isEmpty(location)" class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
			</picker>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				txt:'',
				oss:'',
				imgs:[],
				id:'',
				avatar:'',
				name:'',
				attach:{
					title:'',
					relationId:'',
					type:''
				},
				location:'',
				lineCount:0
			};
		},
		computed:{
			status(){
				return this.txt.length>0 || this.imgs.length>0
			}
		},
		onLoad(options) {
			this.id=options.id
			this.oss=this.$oss
			this.avatar = options.avatar
			console.log(this.avatar)
			this.name=options.name
			uni.$on('link',data=>{
				console.log(data)
				this.attach.title=data.name
				this.attach.relationId=data.id
				this.attach.type=data.type
			})
		},
		methods:{
			linechange(e){
				console.log('e',e)
				this.$nextTick(function(){
					if(e.detail.lineCount<1){
						this.lineCount = 1;
					}else{
						this.lineCount = e.detail.lineCount;
					}
				})
			},
			checkInput(e){
				// console.log(e)
				if(e.detail.value.length>200){
					this.txt= e.detail.value.substring(0,200)
				}
				// console.log(6)
			},
			bindPickerChange(e){
				// console.log(e)
				this.location=`${e.detail.value[1]}`+ '·' + `${e.detail.value[2]}`
				// console.log(this.location)
			},
			deLocation(){
				this.location=''
			},
			delLink(){
				this.attach.title=''
				this.attach.relationId=''
				this.attach.type=''
			},
			delImg(item,index){
				this.imgs.splice(index,1)
			},
			link(){
				uni.navigateTo({
					url:'/pages/group/home/publish/publishLink/publishLink'
				})
			},
			publishThoughts(){
				// console.log(this.imgs)
				if(this.$isEmpty(this.attach.relationId)){
					this.$http.post('dms/thoughts/smart_org/create',{
						content:this.txt,
						images: this.imgs,
						orgId:this.id,
						location:this.location
					}).then(res=>{
						if(res.data.code==1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"发布成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}
					})
				}else{
					this.$http.post('dms/thoughts/smart_org/create',{
						content:this.txt,
						images: this.imgs,
						orgId:this.id,
						attach:this.attach,
						location:this.location
					}).then(res=>{
						if(res.data.code==1){
							uni.showToast({
								title:res.data.message,
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"发布成功",
								icon:"none",
								duration:1000,
								success: () => {
									setTimeout(()=>{
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						}
					})
				}
			},
			addImg(){
				let that = this
				let num = 9-this.imgs.length
				console.log(num)
				uni.chooseImage({
					count: num, //默认9
					// sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(res)
						// console.log(`http://183.131.134.242:10026/admin/file/app/sftp/upload`)
						res.tempFilePaths.forEach(item=>{
							uni.uploadFile({
								// src: res.tempFilePaths[0],
								// success: function(image) {
								// 	that.soInfo.org.avatar = image.path
								// }
								url:'https://www.woneng.net/api/admin/file/app/sftp/upload', //开发者服务器地址
								header: {
									"Content-Type": "multipart/form-data",
									"Authorization":uni.getStorageSync('token')
								},
								filePath:item, //要上传文件资源的路径
								name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
								success: (res) => {
									// console.log(res)
									console.log(JSON.parse(res.data).data)
									let url = JSON.parse(res.data).data.toString()
									that.imgs.push(url)
									console.log(that.imgs)
								},
								fail: (resp) => {
									console.log(resp)
								}
							});
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.inputDefault {
		color: #BABEC0;
		// padding: 20rpx;
		font-size: 26rpx;
		line-height: 44rpx;
	}
	.content-link::after{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.content-link::before{
		content: " ";
		position: absolute;
		right: 0;
		top: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.content-location::after{
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.content-link::before{
		content: " ";
		position: absolute;
		right: 0;
		top: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	.avatarImg{
		width: 56rpx;
		height:56rpx;
		border-radius: 16rpx;
	}
.container{
	.title{
		padding: $spacing-xxl $spacing-xxl 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title-wrap{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex: 1;
			min-width: 0;
			.title-wrap-name{
				flex: 1;
				min-width: 0;
				font-size: 32rpx;
				line-height: 48rpx;
				color: #516B8D;
				font-weight: bold;
				margin-left: 16rpx;
				margin-right: 100rpx;
			}
		}
		.notPublishBtn{
			background-color: $bg-color-disabled;
			color: $text-color-secondary;
			font-weight: bold;
			font-size:$font-size-sm ;
			line-height:$line-height-size-sm ;
			padding: 12rpx $spacing-lg;
			border-radius: $spacing-sm;
		}
		.publishBtn{
			background-color: $color-primary;
			color: $color-white;
			font-weight: bold;
			font-size:$font-size-sm ;
			line-height:$line-height-size-sm ;
			padding: 12rpx $spacing-lg;
			border-radius: $spacing-sm;
		}
	}
	.content-img{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding: 68rpx 26rpx 96rpx 28rpx;
		.content-img-item{
			padding: 0rpx 12rpx;
			margin-bottom: $spacing-lg;
			position: relative;
			.content-img-item-img{
				width: 208rpx;
				height:208rpx;
				border-radius: 8rpx;
			}
			.delImg{
				width: 28rpx;
				height: 28rpx;
				position: absolute;
				top: -12rpx;
				right: 0rpx;
			}
			.content-publish{
				padding: 60rpx;
				background-color: $bg-color-primary;
				border-radius: 8rpx;
				.content-publish-img{
					width: 88rpx;
					height: 88rpx;
				}
			}
		}
	}
	.content-location{
		margin: 0rpx $spacing-xxl;
		padding: $spacing-xl 0rpx;
		// border-top: 2rpx solid $border-color;
		// border-bottom: 2rpx solid $border-color;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.regionPicker{
			flex: 1;
			margin-left: $spacing-lg;
			color: $text-color-primary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			position: relative;
			.delLink{
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				width: 40rpx;
				height: 40rpx;
				right: -12rpx;
			}
			.rightImg{
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				right: -$spacing-base;
			}
		}
	}
	.content-link{
		margin: 0rpx $spacing-xxl;
		padding: $spacing-xl 0rpx;
		position: relative;
		// border-top: 2rpx solid $border-color;
		// border-bottom: 2rpx solid $border-color;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		.content-link-info{
			flex: 1;
			margin-left: $spacing-lg;
			color: $text-color-primary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
		}
		.delLink{
			width: 40rpx;
			height: 40rpx;
			margin-left: 20rpx;
			margin-right: -12rpx;
		}
		.rightImg{
			margin-right: -$spacing-base;
		}
	}
}
 textarea{
	min-height: 44rpx;
	width:670rpx;
	padding: $spacing-xxl;
	font-size: $font-size-base;
	line-height:44rpx ;
	}
</style>
