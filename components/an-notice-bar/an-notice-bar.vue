<template>
	<view>
		<view class="an-notice-box">
			<view class="an-notice-box-wrap">
				<image class="icon-sm" :src="$ossUrl('icon_notice.png')" mode="" style="vertical-align: top;"></image>
			</view>
			<scroll-view class="an-notice-content singleEllipsis">
				<swiper v-if="show" class="swiper" :autoplay="true" :interval="switchTime*1000" :duration="1500" :circular="true" :vertical="true">
					<swiper-item v-for="(text, index) in list" :key="index" :item-id="index" class="an-notice-content-item" @tap="goDetails(text,index)">
						<view class="swiper-item">
							<text class="an-notice-content-item-text" :style="'color: '+color+';'">
								<!-- <text v-if="list.length > 1 || showSerial">{{index+1+'. '}}</text> -->
								{{text}}
							</text>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>
			<image class="icon-sm rightImg" :src="$ossUrl('icon_right.png')"></image>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	export default {
		components: {
			uniIcons
		},
		props:{
			text: {
				type: Array,
				default:()=>{
					return []
				}
			}, 
			color: {
				type: String,
				default: '#303031'
			},
			bgColor: {
				type: String,
				default: '#fffbe8'
			},
			switchTime: {
				type: Number,
				default: 3
			},
			showSerial: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				number: 0,
				list: [],
				copyText: [],
				show: '',
			};
		},
		mounted() {
			this.list = this.text
			console.log(this.list.length)
			if(this.list.length > 1){
				// this.showSerial = true;
			}
			this.show = true;
			/* this.number = 0;
			this.startMove(); */
		},
		watch: {
			text: function () {
				this.show = true;
				if(this.text != this.copyText){
					this.copyText = this.text;
					this.list = this.text
					console.log(JSON.stringify(this.list))
					if(this.list.length > 1){
						// this.showSerial = true;
					}
				}
				/* this.number = 0;
				this.startMove(); */
			}
		},
		methods: {			
			goDetails(item,index){
				console.log(item,index)
				this.$emit("goDetails",item,index)
			}
		}
	}
</script>

<style>
	.an-notice-box-wrap{
		padding: 18rpx 20rpx;
		background: rgba(16, 174, 255, .1);		
		border-radius: 20rpx 0px 0px 20rpx;
	}
	.rightImg{
		margin-right: 4rpx;
	}
	.swiper{
		height: 60upx!important;
	}
	.an-notice-box{
		border-radius: 0rpx 16rpx 16rpx 0rpx;
		height: 44rpx;
		padding: 18rpx 0rpx;
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.04);
		border-radius: 16rpx;		
		background: #FFFFFF;
		overflow: hidden;
		display: flex; 
		justify-content: flex-start;
		align-items: center;
	}
	.an-notice-content{
		padding-left: 12rpx;	
		width: calc(100% - 220upx); 
		position: relative; 
		font-size: 14px;
		flex: 1;
	}
	.an-notice-content-item{
		width: 100%; 
		height: 60upx; 
		text-align: left; 
		line-height: 60upx;
	}
	.an-notice-content-item-text{
		display: block; 
		white-space: nowrap; 
		text-overflow: ellipsis; 
		overflow: hidden;
	}
	.an-notice-more{
		width: 130upx; 
		height: 60upx; 
		font-size: 12px; 
		line-height: 60upx; 
		text-align: right; 
		color: #999;
	}
	
	@keyframes anotice {
		 0%  {transform: translateY(100%);}
	    30%  {transform: translateY(0);}
	    70%  {transform: translateY(0);}
	   100%  {transform: translateY(-100%);}
	}
</style>
