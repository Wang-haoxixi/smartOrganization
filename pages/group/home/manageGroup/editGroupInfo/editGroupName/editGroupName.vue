<template>
	<view class="setName">
		<input class="uni-input" v-model="name" maxlength=20 placeholder="1-20字" placeholder-style='font-weight: 400,color: #BABEC0,font-size:30rpx ' />

		<view class="save">
			<button size="mini" class="btn" @tap='save'>保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				orgId:''
			};
		},

		onLoad(opt) {
			this.name = opt. name
			this.orgId=opt.orgId
		},

		methods: {
			save() {
				if(this.$isEmpty(this.name)){
					uni.showToast({
						title:"名称不能为空",
						icon:"none"
					})
				}else{
					this.$http.post('admin/org/update', {
						name:this.name,
						orgId:this.orgId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: "更改成功",
								icon: "none",
								success: () => {
									setTimeout(()=>{
										uni.$emit('nameRefresh',this.name)
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
	page {
		background-color: #F4F5F6;
	}

	.uni-input {
		height: 112rpx;
		background-color: #FFFFFF;
		padding: 0 40rpx;
	}

	.save {
		text-align: center;

		.btn {
			width: 224rpx;
			height: 88rpx;
			font-size: 32rpx;
			font-weight: 500;
			line-height: 88rpx;
			color: #FFFFFF;
			margin-top: 48rpx;
		}
	}
</style>
