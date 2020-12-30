<template>
	<view class="container">
		<textarea v-model="soInfo.introduction" placeholder-class="inputDefault" placeholder="填写介绍语，让大家认识群组，1-150字" maxlength="150"/>
		<view class="btnWrap">
			<view class="btn" @tap="saveIntroduction">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				soInfo:{
					orgId:'',
					introduction:''
				}
			};
		},
		onLoad(options) {
			this.soInfo.orgId=options.id
			this.soInfo.introduction=options.introduction
		},
		methods:{
			saveIntroduction(){
				let that =this
				if(that.$isEmpty(that.soInfo.introduction.trim())){
					uni.showToast({
						title:"介绍与不能为空",
						icon:"none"
					})
				}else{
					that.$http.post('admin/org/update',{
						...that.soInfo
					}).then(res=>{
						if (res.data.code == 0) {
							uni.showToast({
								title: "更改成功",
								icon: "none",
								success:()=> {
									setTimeout(()=>{
										uni.$emit('intrudoctionRefresh',that.soInfo.introduction)
										uni.navigateBack({
											delta:1
										})
									},1000)
								}
							})
						} else {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.inputDefault {
		color: #BABEC0;
		padding: 20rpx;
		line-height: 48rpx;
	}
	page{
		background-color: $bg-color-primary;
	}
.container{
	padding: 20rpx 0rpx;
}
textarea{
	padding: $spacing-lg $spacing-xxl;
	width: 670rpx;
	height: 366rpx;
	background-color: $color-white;
	color: $text-color-regular;
}
.btnWrap{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 48rpx;
	.btn{
		background-color: $color-primary;
		border-radius: $border-radius-lg;
		color: $color-white;
		padding: 22rpx 80rpx;
	}
}
</style>
