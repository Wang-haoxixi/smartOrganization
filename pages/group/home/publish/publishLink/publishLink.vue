<template>
	<view class="">
		<view class="container">
			<so-search :placeholder="placeholderTxt" @historySearch="searchList" id="search"></so-search>
			<view class="title" id="title">
				<view :class="type=='article'?'title-itemed':'title-item'" @tap="changeTitle('article')">
					<view>
						文章
					</view>
					<view class="point" v-if="type=='article'">

					</view>
				</view>
				<view :class="type=='material'?'title-itemed':'title-item'" @tap="changeTitle('material')">
					<view>
						材料
					</view>
					<view class="point" v-if="type=='material'">

					</view>
				</view>
				<view :class="type=='activity'?'title-itemed':'title-item'" @tap="changeTitle('activity')">
					<view>
						活动
					</view>
					<view class="point" v-if="type=='activity'">

					</view>
				</view>
				<view :class="type=='products'?'title-itemed':'title-item'" @tap="changeTitle('products')">
					<view>
						魔方
					</view>
					<view class="point" v-if="type=='products'">

					</view>
				</view>
			</view>
			<swiper @change="swiperChange" observer observerParents  :current-item-id="type" :style="{height:swiperHeight + 'px'}" ref="swiper">
				<swiper-item item-id="article">
					<view class="swiper-item">
						<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="articleMoreList">
							<radio-group>
								<label class="swiper-item-info" v-for="(item,index) of articleList.records" :key="index" @tap="chooseArticle(item)">
									<view class="swiper-item-info-content">
										<view class="swiper-item-info-wrap">
											<view class="swiper-item-info-name">
												{{$isEmpty(item.name)?'':item.name}}
											</view>
											<radio :checked="item.status==true" style="transform: scale(0.7);margin-right: -16rpx;"/>
										</view>
									</view>
									<view class="swiper-item-bottom" @tap.stop="goRelevanceDetails(item)">
										<view class="">
											查看详情
										</view>
										<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode="" style="margin-right: -16rpx;"></image>
									</view>
								</label>
							</radio-group>
							<uni-load-more :status="articleMore" v-if="articleList.records.length>=10"></uni-load-more>
							<view class="safe-bottom" style="height: 60rpx;"></view>
						</scroll-view>
					</view>
				</swiper-item>
				<swiper-item item-id="material">
					<view class="swiper-item">
						<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="materialMoreList">
							<radio-group>
								<label class="swiper-item-info" v-for="(item,index) of materialList.records" :key="index" @tap="chooseMaterial(item)">
									<view class="swiper-item-info-content">
										<view class="swiper-item-info-wrap">
											<view class="">
												<view class="swiper-item-info-name">
													{{$isEmpty(item.name)?'':item.name}}
												</view>
												<view class="swiper-item-soInfo">
													来自：<text style="color: #576B95;" @tap.stop="goSoHome(item)">{{$isEmpty(item.orgName)?'':item.orgName}}</text>
												</view>
											</view>
											<radio :checked="item.status==true" style="transform: scale(0.7);margin-right: -16rpx;"/>
										</view>
									</view>
									<view class="swiper-item-bottom" @tap.stop="goRelevanceDetails(item)">
										<view class="">
											查看详情
										</view>
										<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode="" style="margin-right: -16rpx;"></image>
									</view>
								</label>
							</radio-group>
							<uni-load-more :status="materialMore" v-if="materialList.records.length>=10"></uni-load-more>
							<view class="safe-bottom" style="height: 60rpx;"></view>
						</scroll-view>
					</view>
				</swiper-item>
				<swiper-item item-id="activity">
					<view class="swiper-item">
						<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="activityMoreList">
							<radio-group name="">
								<label class="swiper-item-info" v-for="(item,index) of activityList.records" :key="index" @tap="chooseActivity(item)">
									<view class="swiper-item-info-content">
										<view class="swiper-item-info-wrap">
											<view class="">
												<view class="swiper-item-info-name">
													{{$isEmpty(item.name)?'':item.name}}
												</view>
												<view class="swiper-item-soInfo">
													来自：<text style="color: #576B95;" @tap.stop="goSoHome(item)">{{$isEmpty(item.orgName)?'':item.orgName}}</text>
												</view>
											</view>
											<radio :checked="item.status==true" style="transform: scale(0.7);margin-right: -16rpx;"/>
										</view>
									</view>
									<view class="swiper-item-bottom" @tap.stop="goRelevanceDetails(item)">
										<view class="">
											查看详情
										</view>
										<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode="" style="margin-right: -16rpx;"></image>
									</view>
								</label>
							</radio-group>
							<uni-load-more :status="activityMore" v-if="activityList.records.length>=10"></uni-load-more>
							<view class="safe-bottom" style="height: 60rpx;"></view>
						</scroll-view>
					</view>
				</swiper-item>
				<swiper-item item-id="products">
					<view class="swiper-item">
						<scroll-view scroll-y="true" :style="{height:swiperHeight + 'px'}" @scrolltolower="productsMoreList">
							<radio-group name="">
								<label class="swiper-item-info" v-for="(item,index) of productsList.records" :key="index"  @tap="chooseProducts(item)">
									<view class="swiper-item-info-content">
										<view class="swiper-item-info-wrap">
											<view class="">
												<view class="swiper-item-info-name">
													{{$isEmpty(item.name)?'':item.name}}
												</view>
												<view class="swiper-item-soInfo">
													来自：<text style="color: #576B95;" @tap.stop="goSoHome(item)">{{$isEmpty(item.orgName)?'':item.orgName}}</text>
												</view>
											</view>
											<radio :checked="item.status==true" style="transform: scale(0.7);margin-right: -16rpx;"/>
										</view>
									</view>
									<view class="swiper-item-bottom" @tap.stop="goRelevanceDetails(item)">
										<view class="">
											查看详情
										</view>
										<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode="" style="margin-right: -16rpx;"></image>
									</view>
								</label>
							</radio-group>
							<uni-load-more :status="productsMore" v-if="productsList.records.length>=10"></uni-load-more>
							<view class="safe-bottom" style="height: 60rpx;"></view>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholderTxt: '请输入链接名称',
				type:'article',
				item_id: 0,
				swiperHeight:'',
				articleList:{
					records:[]
				},
				articleMore:'more',
				materialList:{
					records:[]
				},
				materialMore:'more',
				activityList:{
					records:{}
				},
				activityMore:'more',
				productsList:{
					records:[]
				},
				productsMore:'more',
				txt:'',
				chooseData:{
					name:'',
					id:'',
					type:''
				}
			};
		},
		onLoad() {
			this.$http.get('admin/smart_groups/link/page', {
				params: {
					name: '',
					type: this.type
				}
			}).then(res => {
				console.log(res)
				this.articleList= res.data.data
				if(this.articleList.current<this.articleList.pages){
					this.articleMore='more'
				}else{
					this.articleMore='noMore'
				}
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#search')
				.boundingClientRect()
				.select('#title')
				.boundingClientRect()
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height-ret[1].height
					console.log(this.swiperHeight)
				});
		},
		methods: {
			goSoHome(item){
				uni.navigateTo({
					url:`/pages/group/home/home?id=${item.orgId}`
				})
			},
			goRelevanceDetails(item) {
				// console.log('关联信息', attach)
				this.$http.get('/admin/smart_groups/link/path', {
					params: {
						type: item.type, //材料：material；活动：activity；魔方：products；文章：article
						id: item.id, //关联id
					}
				}).then(res => {
					console.log('关联成功', res)
					// 打开另一个小程序。
					uni.navigateToMiniProgram({
						appId: res.data.data.appId,
						path: res.data.data.path,
						success(res) {
							console.log('打开成功', res)
						}
					})
			
				})
			},
			chooseArticle(item){
				this.chooseData.id =item.id
				this.chooseData.name =item.name
				this.chooseData.type =item.type
				uni.$emit('link',this.chooseData)
				uni.navigateBack({
					delta:1
				})
			
			},
			chooseMaterial(item){
				this.chooseData.id =item.id
				this.chooseData.name =item.name
				this.chooseData.type =item.type
				uni.$emit('link',this.chooseData)
				uni.navigateBack({
					delta:1
				})
			},
			chooseActivity(item){
				this.chooseData.id =item.id
				this.chooseData.name =item.name
				this.chooseData.type =item.type
				uni.$emit('link',this.chooseData)
				uni.navigateBack({
					delta:1
				})
			},
			chooseProducts(item){
				this.chooseData.id =item.id
				this.chooseData.name =item.name
				this.chooseData.type =item.type
				uni.$emit('link',this.chooseData)
				uni.navigateBack({
					delta:1
				})
			},
			searchList(txt) {
				this.txt = txt
				this.$http.get('admin/smart_groups/link/page', {
					params: {
						name: this.txt,
						type: this.type
					}
				}).then(res => {
					console.log(res)
					if(this.type =='article'){
						this.articleList=res.data.data
						if(this.articleList.current<this.articleList.pages){
							this.articleMore='more'
						}else{
							this.articleMore='noMore'
						}
					}else if(this.type =='material'){
						this.materialList=res.data.data
						if(this.materialList.current<this.materialList.pages){
							this.materialMore='more'
						}else{
							this.materialMore='noMore'
						}
					}else if(this.type =='activity'){
						this.activityList=res.data.data
						if(this.activityList.current<this.activityList.pages){
							this.activityMore='more'
						}else{
							this.activityMore='noMore'
						}
					}else if(this.type =='products'){
						this.productsList=res.data.data
						if(this.productsList.current<this.productsList.pages){
							this.productsMore='more'
						}else{
							this.productsMore='noMore'
						}
					}
				})
			},
			swiperChange(e) {
				// console.log(e)
				this.type =e.target.currentItemId
				this.$http.get('admin/smart_groups/link/page', {
					params: {
						name: this.txt,
						type: this.type
					}
				}).then(res => {
					console.log(res)
					if(this.type =='article'){
						this.articleList=res.data.data
						if(this.articleList.current<this.articleList.pages){
							this.articleMore='more'
						}else{
							this.articleMore='noMore'
						}
					}else if(this.type =='material'){
						this.materialList=res.data.data
						if(this.materialList.current<this.materialList.pages){
							this.materialMore='more'
						}else{
							this.materialMore='noMore'
						}
					}else if(this.type =='activity'){
						this.activityList=res.data.data
						if(this.activityList.current<this.activityList.pages){
							this.activityMore='more'
						}else{
							this.activityMore='noMore'
						}
					}else if(this.type =='products'){
						this.productsList=res.data.data
						if(this.productsList.current<this.productsList.pages){
							this.productsMore='more'
						}else{
							this.productsMore='noMore'
						}
					}
				})
			},
			articleMoreList(){
				if(this.articleList.current<this.articleList.pages){
					this.$http.get('admin/smart_groups/link/page', {
						params: {
							name: this.txt,
							type: this.type,
							current:this.articleList.current+1
						}
					}).then(res => {
						console.log(res)
						this.articleList.current = res.data.data.current
						if(this.articleList.current<this.articleList.pages){
							this.articleMore='more'
						}else{
							this.articleMore='noMore'
						}
						this.articleList.records = this.articleList.records.concat(res.data.data.records)
					})
				}
			},
			materialMoreList(){
				if(this.materialList.current<this.materialList.pages){
					this.$http.get('admin/smart_groups/link/page', {
						params: {
							name: this.txt,
							type: this.type,
							current:this.materialList.current+1
						}
					}).then(res => {
						console.log(res)
						this.materialList.current = res.data.data.current
						if(this.materialList.current<this.materialList.pages){
							this.materialMore='more'
						}else{
							this.materialMore='noMore'
						}
						this.materialList.records = this.materialList.records.concat(res.data.data.records)
					})
				}
			},
			activityMoreList(){
				if(this.activityList.current<this.activityList.pages){
					this.$http.get('admin/smart_groups/link/page', {
						params: {
							name: this.txt,
							type: this.type,
							current:this.activityList.current+1
						}
					}).then(res => {
						console.log(res)
						this.activityList.current = res.data.data.current
						if(this.activityList.current<this.activityList.pages){
							this.activityMore='more'
						}else{
							this.activityMore='noMore'
						}
						this.activityList.records = this.activityList.records.concat(res.data.data.records)
					})
				}
			},
			productsMoreList(){
				if(this.productsList.current<this.productsList.pages){
					this.$http.get('admin/smart_groups/link/page', {
						params: {
							name: this.txt,
							type: this.type,
							current:this.productsList.current+1
						}
					}).then(res => {
						console.log(res)
						this.productsList.current = res.data.data.current
						if(this.productsList.current<this.productsList.pages){
							this.productsMore='more'
						}else{
							this.productsMore='noMore'
						}
						this.productsList.records = this.productsList.records.concat(res.data.data.records)
					})
				}
			},
			changeTitle(item) {
				this.type = item
				console.log(this.type)
				this.$http.get('admin/smart_groups/link/page', {
					params: {
						name: this.txt,
						type: this.type
					}
				}).then(res => {
					console.log(res)
					if(item=='article'){
						this.articleList=res.data.data
						if(this.articleList.current<this.articleList.pages){
							this.articleMore='more'
						}else{
							this.articleMore='noMore'
						}
					}else if(item=='material'){
						this.materialList=res.data.data
						if(this.materialList.current<this.materialList.pages){
							this.materialMore='more'
						}else{
							this.materialMore='noMore'
						}
					}else if(item=='activity'){
						this.activityList=res.data.data
						if(this.activityList.current<this.activityList.pages){
							this.activityMore='more'
						}else{
							this.activityMore='noMore'
						}
					}else if(item=='products'){
						this.productsList=res.data.data
						if(this.productsList.current<this.productsList.pages){
							this.productsMore='more'
						}else{
							this.productsMore='noMore'
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.swiper-item-bottom::before{
		content: " ";
		position: absolute;
		right: 0;
		top: 0;
		width:100%;
		height: 1px;
		background:#EFF0F1;
		transform: scaleY(0.5);
	}
	page {
		background-color: $bg-color-primary;
	}
	.swiper-item-info{
		background-color: $color-white;
		padding: 0rpx $spacing-lg;
		border-radius: $border-radius-lg;
		margin-bottom: $spacing-base;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: flex-start;
		.swiper-item-info-content{
			padding: 32rpx 0rpx;
			width: 100%;
		}
		.swiper-item-info-wrap{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.swiper-item-info-name{
				color: $text-color-primary;
				font-size: $font-size-base;
				line-height: $line-height-size-base;
				display: block;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.swiper-item-soInfo{
				padding-top: 24rpx;
				font-size: 26rpx;
				line-height: 36rpx;
			}
		}
		.swiper-item-bottom{
			font-size: 28rpx;
			line-height: 40rpx;
			color: #666769;
			width: 100%;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0;
		}
	}
	.container {
		padding: $spacing-base $spacing-base 0rpx;

		.title {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: $spacing-xl $spacing-lg;

			.title-item {
				color: $text-color-placeholder;
				font-size: $font-size-lg;
				line-height: $line-height-size-lg;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: flex-start;
				margin-right: 48rpx;

				.point {
					width: 12rpx;
					height: 6rpx;
					background: $text-color-primary;
					border-radius: $border-radius-sm;
					margin-top: $spacing-xs;
				}
			}

			.title-itemed {
				color: $text-color-primary;
				font-size: $font-size-xl;
				line-height: $line-height-size-xl;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: flex-start;
				font-weight: bold;
				margin-right: 44rpx;

				.point {
					width: 12rpx;
					height: 6rpx;
					background: $text-color-primary;
					border-radius: $border-radius-sm;
					margin-top: $spacing-xs;
				}
			}
		}
	}
</style>
