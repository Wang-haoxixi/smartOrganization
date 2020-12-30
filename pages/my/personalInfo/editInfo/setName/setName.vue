<template>
	<view class="setName">
		<input class="uni-input" v-model="userName" maxlength=20 placeholder="1-20字" placeholder-style='font-weight: 400,color: #BABEC0,font-size:30rpx ' />

		<view class="save">
			<button size="mini" class="btn" @tap='save'>保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName: ''
			};
		},

		onLoad(opt) {
			this.userName = opt.data
		},

		methods: {
			save() {
				this.$http.post('admin/user/app/update', {
					realName: this.userName
				}).then(res => {
					// console.log('res', res)
					if (res.data.code === 0) {
						uni.navigateBack();
					}
				})
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
