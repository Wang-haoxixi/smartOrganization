<template>
	<view>
		<view class="title">
			<text style="color: #FA5151;margin-right: 8rpx;font-weight: bold;">*</text>标题
		</view>
		<textarea class="titleContent" v-model="titleTxt" placeholder="1-50字" placeholder-style="color:#BABEC0" maxlength="50"
		 auto-height="true" />
		<view class="title">
			<text style="color: #FA5151;margin-right: 8rpx;font-weight: bold;">*</text>内容
		</view>
		<view class="" style="margin:40rpx 40rpx 24rpx 40rpx ;overflow: hidden;">
			<textarea :style="{height:lineCount*44 + 'rpx'}"
			 @input="checkInput" @linechange="linechange" class="infoContent" v-model="contentTxt" placeholder="请输入" placeholder-class ="inputDefault" maxlength="1000"/>
		</view>
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
			<view class="content-link-info singleEllipsis" v-if="!$isEmpty(targetName)">
				{{$isEmpty(targetName)?'':targetName}}
			</view>
			<view class="content-link-info singleEllipsis" v-else>
				链接
			</view>
			<image v-if="!$isEmpty(targetName)" class="delLink" :src="$ossUrl('icon_publishLinkDel.png')" mode="" @tap.stop="delLink"></image>
			<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')" mode=""></image>
		</view>
		<view class="" style="height: 112rpx;"></view>
		<view class="wrapBtns safe-bottom">
			<view class="bottom-btn">
				<view class="btned" @tap="addNotice">
					发布
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				oss:'',
				titleTxt:'',
				contentTxt:'',
				imgs:[],
				noticeId:'',
				type:'',
				targetType:'notice',
				targetId:'',
				targetName:'',
				lineCount:1
			};
		},
		onLoad(options) {
			uni.$on('link',data=>{
				console.log(data)
				this.targetName=data.name
				this.targetId=data.id
				this.targetType=data.type
			})
			this.id=options.id
			this.oss=this.$oss
			this.type=options.type
			// console.log(options.type)
			if(options.type == 0){
				uni.setNavigationBarTitle({
					title:'新增公告'
				})
			}else{
				this.noticeId=options.noticeId
				uni.setNavigationBarTitle({
					title:'编辑公告'
				})
				this.$http.get('admin/applets/so/get_news/' + this.noticeId).then(res=>{
					this.noticeDetail=res.data.data
					this.titleTxt =this.noticeDetail.title
					this.contentTxt=this.noticeDetail.content
					if(!this.$isEmpty(this.noticeDetail.imgUrlList)){
						this.imgs =this.noticeDetail.imgUrlList
					}
					this.targetType = this.noticeDetail.targetType
					this.targetId = this.noticeDetail.targetId
					this.targetName = this.noticeDetail.targetName
				})
			}
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
				if(e.detail.value.length>1000){
					this.contentTxt= e.detail.value.substring(0,1000)
				}
				// console.log(6)
			},
			delLink(){
				this.targetType=''
				this.targetId=''
				this.targetName=''
			},
			delImg(item,index){
				this.imgs.splice(index,1)
			},
			link(){
				uni.navigateTo({
					url:'/pages/group/home/publish/publishLink/publishLink'
				})
			},
			addNotice(){
				if(this.$isEmpty(this.titleTxt.trim())){
					uni.showToast({
						title:"标题不能为空",
						icon:'none'
					})
				}else if(this.$isEmpty(this.contentTxt.trim())){
					uni.showToast({
						title:"内容不能为空",
						icon:'none'
					})
				}else{
					this.$http.post('admin/applets/so/save_update_news',{
						orgId:this.id,
						title:this.titleTxt,
						content:this.contentTxt,
						imgUrlList:this.imgs,
						targetType:this.targetType,
						targetId:this.targetId,
						id:this.noticeId
					}).then(res=>{
						console.log(res)
						if(res.data.code == 0){
							uni.showToast({
								title:"编辑成功",
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
						}else{
							uni.showToast({
								title:res.data.message,
								icon:"none"
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
	::v-deep .titleContent{
		padding: $spacing-xl $spacing-xxl;
		width: 670rpx;
		font-size: $font-size-base;
		line-height: $font-size-base;
	}
	::v-deep .infoContent{
		// padding: $spacing-xxl $spacing-xxl $spacing-lg $spacing-xxl;
		width: 680rpx;
		min-height: 44rpx;
		font-size: $font-size-base;
		// line-height: $font-size-base;
		line-height: 44rpx;
	}
.title{
	background-color: $bg-color-primary;
	padding: 12rpx $spacing-xxl;
	font-size: $font-size-sm;
	line-height: $line-height-size-sm;
	color: $text-color-placeholder;
}
.wrapBtns{
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px #BABEC0;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		background-color: $bg-color-primary;
		width: 100%;
		z-index: 999;
	}
.bottom-btn{
		padding: $spacing-lg $spacing-xl $spacing-base $spacing-xl;	
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.btned{
		padding: 14rpx $spacing-xxl;
		background-color: $color-primary;
		color: $color-white;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
		font-weight: bold;
		border-radius: $border-radius-base;
	}
	.content-img{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding: 100rpx 26rpx 136rpx 28rpx;
		.content-img-item{
			padding: 0rpx 12rpx;
			margin-bottom: $spacing-lg;
			position: relative;
			.content-img-item-img{
				width: 208rpx;
				height:208rpx;
				border-radius: 20rpx;
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
				border-radius: 20rpx;
				.content-publish-img{
					width: 88rpx;
					height: 88rpx;
				}
			}
		}
	}
	.content-link{
		margin: 0rpx $spacing-xxl;
		padding: $spacing-xl 0rpx;
		// border-top: 2rpx solid $border-color;
		// border-bottom: 2rpx solid $border-color;
		position: relative;
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
		}
		.rightImg{
			margin-right: -$spacing-base;
		}
	}
</style>
