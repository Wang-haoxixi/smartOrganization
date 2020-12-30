<template>
	<view class="search-view">
		<image :src="$ossUrl('icon_search.png')" class="icon-xs"></image>
		<input type="text" v-model="txt" @input="search" @confirm="historySearch" :placeholder="placeholder" :disabled="disabled" placeholder-class="placeholder-class" @tap='handlEvents'/>
	</view>
</template>

<script>
	export default {
		name: 'SoSearch',
		props: {
			placeholder:{
				type:String,
				default:"搜索"
			},
			disabled:{
				type:Boolean,
				default:false
			},
			searchtxt:{
				type:String,
				default:""
			}
		},
		data() {
			return {
				txt:''
			};
		},
		onReady() {
			uni.$on('searchItem',data=>{
				// console.log(6)
				this.txt=data
			})
		},
		methods:{
			historySearch(){
				this.$emit('historySearch',this.txt)
			},
			search(){
				this.$emit('handleSearch',this.txt)
			},
			handlEvents(){
				this.$emit('handlEvents')
			}
		}
	}
</script>

<style lang="scss">
	.search-view {
		display: flex;
		align-items: center;
		justify-content: space-between;
		// margin-right: $spacing-lg;
		padding: 18rpx $spacing-lg;
		background-color: $color-white;
		border-radius: $border-radius-lg;

		.icon-xs {
			margin-right: $spacing-base;
		}

		.placeholder-class {
			color: $text-color-secondary;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
		}

		input {
			flex: 1;
			font-size: $font-size-base;
			line-height: $line-height-size-base;
			color: $text-color-primary;
		}
	}
</style>
