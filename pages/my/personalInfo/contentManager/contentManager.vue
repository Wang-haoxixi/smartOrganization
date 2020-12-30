<template>
	<view class="container">
		<view class="" v-if="thoughtsList.records.length>0">
			<so-content-item v-for="(item,index) of thoughtsList.records" :key="index" :content="item.content" :monthTime="item.monthTime" :dayTime="item.dayTime"
			:images="item.images" :thoughtsId="item.thoughtsId"></so-content-item>
		</view>
		<view class="noContent" v-else>
			暂无内容
		</view>
		<uni-load-more :status="thoughtsMore" v-if="thoughtsList.records.length>=20"></uni-load-more>
		<view class="safe-bottom" style="height: 60rpx;">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				thoughtsList:{
					records:[]
				},
				thoughtsMore:'more'
			};
		},
		onLoad(options) {
			this.id=options.id
			this.$http.get('/dms/thoughts/smart_org/page',{
				params:{
					id: this.id,
					size:20
					
				}
			}).then(res=>{
				console.log(res)
				this.thoughtsList = res.data.data
				if(this.thoughtsList.current<this.thoughtsList.pages){
					this.thoughtsMore='more'
				}else{
					this.thoughtsMore='noMore'
				}
				this.thoughtsList.records =this.thoughtsList.records.map(item=>{
					return {
						...item,
						monthTime:item.createTime.substring(5,7),
						dayTime:item.createTime.substring(8,10)
					}
				})
				// console.log(this.thoughtsList.records)
			})
		},
		onReachBottom() {
			if(this.thoughtsList.current<this.thoughtsList.pages){
				this.$http.get('/dms/thoughts/smart_org/page',{
					params:{
						orgId: this.id,
						size:20,
						current:this.thoughtsList.current+1
					}
				}).then(res=>{
					console.log(res)
					this.thoughtsList.current= res.data.data.current
					if(this.thoughtsList.current<this.thoughtsList.pages){
						this.thoughtsMore='more'
					}else{
						this.thoughtsMore='noMore'
					}
					this.thoughtsList.records =this.thoughtsList.records.concat(res.data.data.records.map(item=>{
						return {
							...item,
							monthTime:item.createTime.substring(5,7),
							dayTime:item.createTime.substring(8,10)
						}
					}))
					console.log(this.thoughtsList.records)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.noContent{
		text-align: center;
		margin-top: 80rpx;
		color: #919397;
		font-size: 24rpx;
		line-height: 32rpx;
	}
.container{
	// height: 100vh;
	padding: $spacing-xxl $spacing-xxl $spacing-xxl $spacing-lg;
}
</style>
