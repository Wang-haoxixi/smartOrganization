<template>
	<view>
		<view class="">
			<radio-group class="content">
				<label v-for="(item,index) of imgList" :key="index" @tap="changeBgImg(item)">
					<view class="content-item">
						<image class="bgImg" :src="item.value" mode="aspectFill"></image>
						<view class="content-item-info">
							<radio style="transform: scale(0.7);" :checked="item.status==true"/>
							<view class="content-item-info-label">
								{{$isEmpty(item.label)?'':item.label}}
							</view>
						</view>
					</view>
				</label>
			</radio-group>
		</view>
		<view class="" style="height: 112rpx;"></view>
		<view class="wrapBtns safe-bottom">
			<view class="bottom-btn">
				<view class="btn" v-if="changeStatus==false">
					选取
				</view>
				<view class="btned" v-if="changeStatus==true" @tap="changeBgImgPass">
					选取
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [],
				img:'',
				changeStatus:false,
				id:'',
				bgImg:''
			};
		},
		onLoad(options) {
			this.id=options.id
			this.bgImg=options.bgImg
			console.log(this.bgImg)
			this.$http.get('admin/dict/type/smart_groups_bg_img').then(res => {
				console.log(res)
				this.imgList = res.data.data.map(item=>{
					return {
						...item,
						status:false
					}
				})
				this.imgList.forEach(item=>{
					if(item.value == this.bgImg){
						// console.log(666)
						item.status =true
						this.changeStatus=true
					}
				})
			})
		},
		methods:{
			changeBgImg(item){
				this.changeStatus=true
				this.img =item.value
			},
			changeBgImgPass(){
				this.$http.post('admin/org/set_bg_img',{
					orgId:this.id,
					bgImg:this.img	
				}).then(res=>{
					console.log(res)
					if(res.data.code == 0){
						uni.showToast({
							title:"更改成功",
							icon:"none",
							success:()=> {
								setTimeout(()=>{
									uni.$emit('bgImgRefresh',this.img)
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $bg-color-primary;
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
	.btn{
		padding: 14rpx $spacing-xxl;
		background-color: $bg-color-disabled;
		color: $text-color-secondary;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
		font-weight: bold;
		border-radius: $border-radius-base;
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
	.content {
		// padding: $spacing-xxl;
		padding: $spacing-xxl 20rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		.content-item{
			padding: 0rpx 20rpx $spacing-xl;
			.bgImg{
				width: 314rpx;
				height: 508rpx;
				border-radius: $border-radius-base;
				margin-bottom: $spacing-base;
			}
			.content-item-info{
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: $font-size-sm;
				line-height: $line-height-size-sm;
				color:$text-color-primary ;
				.content-item-info-label{
					// margin-left: $spacing-lg;
				}
			}
		}
	}
</style>
