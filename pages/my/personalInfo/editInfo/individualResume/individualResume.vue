<template>
	<view class="individualResume">
		<textarea class="individualResume-text" maxlength=50 v-model='text' placeholder-style="font-size:30rpx,font-weight: 400,color: #BABEC0"
		 placeholder="填写个人简介，让他人更好认识你，1-50字" /></textarea>

		<view class="btn">
			<button size="mini" class="save" @tap='save'>保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: ''
			}
		},
		methods: {
			save() {
				this.$http.post('admin/user/app/update', {
					introduction: this.text
				}).then(res => {
					// console.log('res', res)
					if (res.data.code === 0) {
						uni.navigateBack();
					}
				})
			}
		},

		onLoad(opt) {
			// console.log(opt)
			this.text = opt.data
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F4F5F6;

		.individualResume {
			.individualResume-text {
				width: 100%;
				height: 414rpx;
				background-color: #FFFFFF;
				box-sizing: border-box;
				padding: 24rpx 40rpx;
			}

			.btn {
				text-align: center;
				margin-top: 48rpx;

				.save {
					font-size: 32rpx;
					width: 224rpx;
					height: 88rpx;
					line-height: 88rpx;
				}
			}
		}
	}
</style>
