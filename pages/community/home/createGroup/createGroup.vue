<template>
	<view>
		<view class="container">
			<view class="content-title" id="title">
				<scroll-view scroll-x="true" id="scrollWidth" class="content-scroll" :style="{maxWidth:scrollWidth + 'px'}" v-if="checkFirend.length>0" show-scrollbar="false" :scroll-into-view="toView">
					<view class="" id="scrollWidthImg" style="display: inline-block;" v-for="(item,index) of checkFirend" :key="index">
						<image :id="'A'+index" class="avatar-base avatarImg" :src="imageError(item.avatar)" mode=""></image>
					</view>
				</scroll-view>
				<input type="text" v-model="txt" @input="searchFriend" placeholder="搜索" class="content" placeholder-class="placeholder-class" maxlength="20"/>
			</view>
			<scroll-view scroll-y="true" :style="{height:scrollHeight + 'px'}" style="position: relative;" v-if="showAllStatus">
				<view>
					<view class="wrap">
						<button class="inviteFriend" open-type="share" id='newInvite' v-if="$isEmpty(id)">
							<view class="">
								邀请微信好友
							</view>
							<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
						</button>
						<button class="inviteFriend" open-type="share" id='oldInvite' v-else>
							<view class="">
								邀请微信好友
							</view>
							<image class="icon-sm" :src="$ossUrl('icon_right.png')" mode=""></image>
						</button>
					</view>
					<view class="" v-if="friendList.length>0 || searchList.length>0">
						<checkbox-group v-if="showStatus==false">
							<label v-for="(item,index) of friendList" :key="index" class="check-item" @tap="checkStatus(item)">
								<checkbox style="transform: scale(0.7);margin-left: -12rpx;" :checked="item.status==true" :disabled="memberList.includes(item.userId)"/>
								<view class="check-item-info">
									<image class="avatar-base avatarImg" :src="imageError(item.avatar)" mode=""></image>
									<view class="check-item-info-name">
										<view class="check-item-info-name-details">
											{{$isEmpty(item.realName)?'':item.realName}}
										</view>
									</view>
								</view>
							</label>
						</checkbox-group>
						<checkbox-group v-if="showStatus==true">
							<label v-for="(item,index) of searchList" :key="index" class="check-item" @tap="checkSearchStatus(item)">
								<checkbox style="transform: scale(0.7);margin-left: -12rpx;" :checked="item.status==true" :disabled="memberList.includes(item.userId)" />
								<view class="check-item-info">
									<image class="avatar-base avatarImg" :src="imageError(item.avatar)" mode=""></image>
									<view class="check-item-info-name">
										<view class="check-item-info-name-details">
											{{$isEmpty(item.realName)?'':item.realName}}
										</view>
										<image class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
									</view>
								</view>
							</label>
						</checkbox-group>
					</view>
					<view class="noFriend" v-else>
						<view class="noFriendTitle">
							您还没有群组好友
						</view>
						<button class="noFriendBtn" type="primary" open-type="share">邀请好友</button>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="wrapBtns safe-bottom" id="btns">
			<view class="btn">
				<view class="saveBtn" :class="!num>0?'btnNotBack':'btnBack'" @tap="createGroup">
					完成<text v-if="checkFirend.length>0">({{$isEmpty(num)?'':num}}人)</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		imageError
	} from '@/common/utils.js'
	export default {
		data() {
			return {
				friendList: [],
				searchList: [],
				scrollHeight: '',
				createrName: '',
				txt: '',
				//判断是否处于搜索后的列表，参照微信
				showStatus: false,
				shareId: '',
				name:'',
				id:'',
				toView:'',
				memberList:[],
				scrollWidth:'',
				checkFirend:[],
				showAllStatus:false
			};
		},
		onLoad(options) {
			this.createrName = uni.getStorageSync('user').realName
			this.$http.get('admin/friend/list').then(res => {
				// console.log(res)
				this.friendList = res.data.data.map(item => {
					return {
						...item,
						status: false
					}
				})
				this.showAllStatus=true
			})
			uni.createSelectorQuery()
				.in(this)
				.select('#title')
				.boundingClientRect()
				.select('#btns')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret[0].height ,ret[1].height)
					let height = uni.getSystemInfoSync().windowHeight;
					this.scrollHeight = height-ret[0].height - ret[1].height
					// console.log(this.scrollHeight)
				});
			this.id =options.id
			this.name =options.name
			if(this.$isEmpty(this.id)){
				uni.setNavigationBarTitle({
					title:"创建群组"
				})
				this.$http.post('admin/smart_groups/share/create').then(resp => {
					this.shareId = resp.data.data.shareId
					this.name =resp.data.data.orgName
				})
			}else{
				uni.setNavigationBarTitle({
					title:"邀请好友"
				})
				this.$http.get('admin/app/user/page',{
					params:{
						orgId: this.id,
						size: 10000,
					}
				}).then(res=>{
					// console.log(res)
					let memberList = res.data.data.result.records
					let idList = []
					for (let i = 0; i < memberList.length; i++) {
						idList.push(memberList[i].userId)
					}
					this.memberList = idList
				})
			}
		},
		computed: {
			// checkFirend() {
			// 	let checkFirend = []
			// 	checkFirend = this.friendList.filter(item => {
			// 		return item.status == true
			// 	})
			// 	return checkFirend
			// },
			num() {
				return this.checkFirend.length
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
				if(res.target.id=='newInvite'){
					return {
						title: `邀请你加入${this.name}`,
						imageUrl:'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_createShare.png',
						path: `/pages/community/showModal/showModal?id=${this.shareId}`
					}
				}else{
					return {
						title: `邀请你加入${this.name}`,
						imageUrl:'https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/so/pic_createShare.png',
						path: `/pages/group/home/home?id=${this.id}`
					}
				}
			}
		},
		methods: {
			imageError,
			checkStatus(item) {
				if(this.memberList.includes(item.userId)){
					
				}else{
					item.status = !item.status
					if(item.status == true){
						this.checkFirend.push(item)
						// console.log(6)
					}else{
						// console.log(9)
						this.checkFirend=this.checkFirend.filter(item2=>{
							return item2.userId != item.userId
						})
					}
					// console.log(this.checkFirend.length)
					this.toView = `A${this.checkFirend.length-1}`;
					// console.log(this.toView)
					this.$nextTick(function(){
						uni.createSelectorQuery()
							.in(this)
							.select('#scrollWidthImg')
							.boundingClientRect()
							.exec(ret => {
								// console.log(ret[0].width)
								this.scrollWidth = ret[0].width * this.num
								if(this.scrollWidth>266){
									this.scrollWidth=266
								}
								// console.log(this.scrollWidth)
								// let height = uni.getSystemInfoSync().windowHeight;
								// this.scrollHeight = height-ret[0].height - ret[1].height
								// console.log(this.scrollHeight)
							});
					})
				}
			},
			checkSearchStatus(item) {
				if(this.memberList.includes(item.userId)){
					
				}else{
					item.status = !item.status
					if(item.status == true){
						this.checkFirend.push(item)
						// console.log(6)
					}else{
						// console.log(9)
						this.checkFirend=this.checkFirend.filter(item2=>{
							return item2.userId != item.userId
						})
					}
					this.showStatus = false
					this.txt = ''
					this.toView = `A${this.checkFirend.length-1}`;
					this.$nextTick(function(){
						uni.createSelectorQuery()
							.in(this)
							.select('#scrollWidthImg')
							.boundingClientRect()
							.exec(ret => {
								// console.log(ret[0].width)
								this.scrollWidth = ret[0].width * this.num
								if(this.scrollWidth>266){
									this.scrollWidth=266
								}
								// console.log(this.scrollWidth)
								// let height = uni.getSystemInfoSync().windowHeight;
								// this.scrollHeight = height-ret[0].height - ret[1].height
								// console.log(this.scrollHeight)
							});
					})
				}
				// console.log(this.toView)
			},
			createGroup() {
				// console.log(this.checkFirend)
				let userIds = this.checkFirend.map(item => {
					return item.userId
				})
				if(this.$isEmpty(this.id)){
					this.$http.post('admin/org/create_invitation', {
						userIds: userIds,
						shareId:this.shareId
					}).then(res => {
						// console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.message,
								icon: "none"
							})
						} else {
							uni.showToast({
								title: `${res.data.data.name}创建成功`,
								icon: "none",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										uni.redirectTo({
											url: `/pages/group/home/home?id=${res.data.data.orgId}`
										})
									}, 1000)
								}
							})
						}
					})
				}else{
					this.$http.post('admin/org/batch/invite', {
						orgId:this.id,
						userIds:userIds
					}).then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								title: "邀请成功",
								icon: "none",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 1000)
								}
							})
						}else{
							uni.showToast({
								title:res.data.message,
								icon:'none'
							})
						}
					})
				}
			},
			searchFriend() {
				if (!this.$isEmpty(this.txt)) {
					this.showStatus = true
					this.searchList = this.friendList.filter(item => {
						return item.realName.includes(this.txt)
					})
				} else {
					this.showStatus = false
					this.searchList = []
				}
				// console.log(this.friendList)
			}
		}
	}
</script>

<style lang="scss">
	.placeholder-class {
		color: $text-color-secondary;
		font-size: $font-size-base;
		line-height: $line-height-size-base;
	}
	
	::v-deep .noFriendBtn {
		font-size: 32rpx;
		line-height: 44rpx;
		font-weight: bold;
		padding: 22rpx 48rpx;
		border-radius: 16rpx;
	}

	.noFriend {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;

		.noFriendTitle {
			color: #666769;
			font-size: 28rpx;
			line-height: 40rpx;
			margin-bottom: 48rpx;
		}
	}

	.content-title::after {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	.inviteFriend::before {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	.check-item-info-name::after {
		content: " ";
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}

	.container {
		.content-title {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			// border-bottom: 2rpx solid $bg-color-disabled;
			position: relative;

			.content-scroll {
				// max-width: 532rpx;
				// padding: 20rpx 0rpx;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				white-space: nowrap;
				// width: 100%;

				// padding-left: $spacing-xl;
				.avatarImg {
					margin-left: $spacing-base;
					// margin-right: $spacing-base;
					border-radius: $border-radius-xl;
				}
			}
		}

		.content {
			flex: 1;
			padding: $spacing-xl $spacing-xl $spacing-xl 16rpx;
			color: $text-color-placeholder;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			// border-bottom: 1px solid #EFF0F1;
			position: relative;
		}

		.wrap {
			padding: 0rpx $spacing-xl;

			.inviteFriend {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: $spacing-xl 0rpx;
				color: $text-color-primary;
				font-size: $font-size-base;
				line-height: $line-height-size-base;
				// border-bottom: 2rpx solid $bg-color-disabled;
				position: relative;
				background-color: $color-white;
				border-radius: 0rpx;
			}
		}

		.check-item {
			padding: 0rpx $spacing-xl;
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.check-item-info {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				margin-left:20rpx;

				.avatarImg {
					border-radius: $border-radius-lg;
				}

				.check-item-info-name {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding: $spacing-xl 0rpx;
					// border-bottom: 2rpx solid $border-color;
					position: relative;
					margin-left: $spacing-lg;

					.check-item-info-name-details {
						color: $text-color-primary;
						font-size: $font-size-base;
						line-height: $line-height-size-lg;
					}
				}
			}
		}
	}

	::-webkit-scrollbar{
	width: 0;
	height: 0;
	color: transparent;
	}
	 
	.wrapBtns{
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		background-color: $bg-color-primary;
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03), 0px 0px 0px 0px $bg-color-regular;
		z-index: 999;
	}
	.btn {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: $spacing-base $spacing-lg;

		.saveBtn {
			padding: 14rpx $spacing-xxl;
			font-weight: bold;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			border-radius: $border-radius-lg;
		}
	}

	.btnBack {
		background-color: $color-primary;
		color: $color-white;
	}

	.btnNotBack {
		background-color: $bg-color-disabled;
		color: $text-color-secondary;
	}
</style>
