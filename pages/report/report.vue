<template>
	<view class="report">
		<view class="p">
			请选择你要举报的类型
		</view>

		<view class="report-type">
			<view :class="{'report-type-item':true,active:report.tipOffReason==index?true:false}" v-for="(item,index) in reportTypes"
			 :key='index' @tap='changeTag(item.id)'>
				{{item.reportName}}
			</view>
		</view>

		<view class="report-reasons">
			举报原因（必填）
		</view>

		<textarea class="textarea" v-model="report.tipOffReasonDetails" maxlength=500 placeholder-style="font-weight: 400,color: #BABEC0"
		 placeholder="填写原因，1-500字" /></textarea>

		<view class="btns">
			<button class="cancel btn" size="mini" @tap='cancel'>取消</button>
			<button :class="{submitActive:report.tipOffReason!=null?true:false,btn:true}" size="mini" @tap='submit'>提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				reportTypes: [{
						id: 0,
						reportName: '垃圾广告',
					},
					{
						id: 1,
						reportName: '黄色信息',
					},
					{
						id: 2,
						reportName: '抄袭侵权',
					},
					{
						id: 3,
						reportName: '诈骗信息',
					},
					{
						id: 4,
						reportName: '人身攻击',
					},
					{
						id: 5,
						reportName: '其他类型',
					},
				],

				report: {
					tipOffContentId: 14842, //说说id
					tipOffReason: null, //举报原因
					tipOffReasonDetails: '', //举报原因详细说明
					tipOffType: 0, //举报内容分类( 0:举报说说 1:举报说说的评论 2 :举报说说评论的回复 3:举报任务 4：举报so 5.举报任务评论 6.举报材料 7.举报考试 8.举报报表 9：举报纪要 10.举报用户 11.举报活动 12.举报问卷 ---其他类型举报待扩充)默认0举报说说
				}

			};
		},

		methods: {
			changeTag(id) {
				this.report.tipOffReason = id
			},

			// 提交
			submit() {
				console.log(this.report)
				this.$http.post('/dms/tip_off_manage/create', this.report).then(res => {
					console.log('res', res)
					if (res.data.code == 0) {
						uni.showToast({
							title: '举报成功！',
							duration: 2000,
						});
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
					}
				})
			},

			cancel() {
				console.log('取消')
				uni.navigateBack();
			}
		},

		onLoad(opt) {
			console.log(opt)
			this.report.tipOffContentId = opt.id
		}
	}
</script>

<style lang="scss">
	.report {
		padding: 40rpx;

		.p {
			font-size: 28rpx;
			font-weight: 400;
			color: #919397;
		}

		.report-reasons {
			font-size: 28rpx;
			font-weight: 400;
			color: #919397;
			margin: 48rpx 0 32rpx 0;
		}

		.report-type {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.report-type-item {
				width: 200rpx;
				height: 72rpx;
				margin-top: 32rpx;
				background: #F4F5F6;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #303031;
				text-align: center;
				line-height: 72rpx;

				&.active {
					color: #07C160;
				}
			}
		}

		.textarea {
			box-sizing: border-box;
			width: 100%;
			background-color: #F4F5F6;
			border-radius: 16rpx;
			padding: 24rpx;
		}

		.btns {
			margin-top: 56rpx;
			text-align: center;

			.btn {
				color: #BABEC0;
				font-size: 30rpx;
				background: #EFF0F1;
				border-radius: 20rpx;
				width: 224rpx;
				height: 88rpx;
				line-height: 88rpx;
			}

			.cancel {
				margin-right: 32rpx;
				color: #FA5151;
			}

			.submitActive {
				color: #FFFFFF;
				background: #FA5151;
			}
		}
	}
</style>
