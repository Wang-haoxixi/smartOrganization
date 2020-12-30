<template>
	<view class="search-group-list-item" @tap="goDetails">
		<!-- <image class="avatarImg" :src="avatar" mode=""></image> -->
		<image v-if="defaultAvatar" :src="$ossUrl('icon_avatar_df.png')" class="avatar-lg">
		</image>
		<image v-else :src="avatar" class="avatar-lg" @error="avatarError()">
		</image>
		<view class="search-group-list-item-info">
			<view class="search-group-list-item-info-title">
				<view class="search-group-list-item-info-title">
					<view class="search-group-list-item-info-title-name singleEllipsis">
						{{$isEmpty(name)?'':name}}
					</view>
					<image v-if="redness==1" class="icon-sm" :src="$ossUrl('icon_groupLevel_one.png')" mode=""></image>
					<image v-if="redness==2" class="icon-sm" :src="$ossUrl('icon_groupLevel_two.png')" mode=""></image>
					<image v-if="redness==3" class="icon-sm" :src="$ossUrl('icon_groupLevel_three.png')" mode=""></image>
					<image v-if="redness==4" class="icon-sm" :src="$ossUrl('icon_groupLevel_four.png')" mode=""></image>
					<image v-if="redness==5" class="icon-sm" :src="$ossUrl('icon_groupLevel_five.png')" mode=""></image>
				</view>
			<!-- 	<view class="search-group-list-item-info-title-time" v-if="!$isEmpty(time)">
					{{getDateDiff(time)}}
				</view> -->
			</view>
			<view class="search-group-list-item-info-content singleEllipsis">
				{{$isEmpty(content)?'暂无内容':content}}
			</view>
		</view>
	</view>
</template>

<script>
	import{
		getDateDiff
	}from "@/common/utils.js"
	export default {
		props:{
			name:{
				type: String,
				default: ''
			},
			avatar:{
				type: String,
				default: ''
			},
			redness:{
				type:Number,
				default:0
			},
			content: {
				type: String,
				default: '暂无内容'
			},
			time: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				defaultAvatar:false
			};
		},
		methods:{
			getDateDiff,
			avatarError() {
				this.defaultAvatar = true;
			},
			goDetails(){
				this.$emit('goDetails')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-group-list-item-info::after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 1px;
		background: #EFF0F1;
		transform: scaleY(0.5);
	}
	.search-group-list-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.avatarImg {
			width: 88rpx;
			height: 88rpx;
			border-radius: $border-radius-xl;
		}

		.search-group-list-item-info {
			margin-left: $spacing-lg;
			flex: 1;
			min-width: 0;
			padding: $spacing-xl 0rpx;
			position: relative;
			// border-bottom: 2rpx solid #EFF0F1;

			.search-group-list-item-info-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: $spacing-sm;

				.search-group-list-item-info-title-time {
					font-size: $font-size-xxs;
					line-height: 34rpx;
					color: $text-color-secondary;
				}

				.search-group-list-item-info-title-name {
					max-width: 476rpx;
					color: $text-color-primary;
					font-size: $font-size-base;
					line-height: $line-height-size-base;
					margin-right: $spacing-xs;
					// max-width: 350rpx;
				}
			}

			.search-group-list-item-info-content {
				color: $text-color-placeholder;
				font-size: $font-size-xs;
				line-height: $line-height-size-xs;
			}
		}
	}
</style>
