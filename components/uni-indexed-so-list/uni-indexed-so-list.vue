<template>
	<view class="uni-indexed-list" ref="list" id="list">
		<!-- #ifdef APP-NVUE -->
		<list class="uni-indexed-list__scroll" scrollable="true" show-scrollbar="false">
			<cell v-for="(list, idx) in lists" :key="idx" :ref="'uni-indexed-list-' + idx">
				<!-- #endif -->
				<!-- #ifndef APP-NVUE -->
				<scroll-view :scroll-into-view="scrollViewId" class="uni-indexed-list__scroll" scroll-y @scroll="onScroll">
					<slot></slot>
					<uni-swipe-action>
						<view v-for="(list, idx) in lists" :key="idx" :id="'uni-indexed-list-' + idx">
							<!-- #endif -->
							<uni-indexed-list-item :list="list" :loaded="loaded" :idx="idx" :orgId="orgId" :showSelect="showSelect"
							 @itemClick="onClick" @cancel='cancelSo(list)'></uni-indexed-list-item>
							<!-- #ifndef APP-NVUE -->
						</view>
					</uni-swipe-action>
					<view class="bottom-safe" style="height: 90rpx;"></view>
				</scroll-view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
			</cell>
		</list>
		<!-- #endif -->
		<view id="list_index" style="position: fixed;right: 5px;" :style="{ top: winOffsetY + 'px', height: winHeight + 'px' }">
			<view :class="touchmove ? 'uni-indexed-list__menu--active' : ''" @touchstart="touchStart" @touchmove.stop.prevent="touchMove"
			 @touchend="touchEnd" class="uni-indexed-list__menu" style="display: flex;flex-direction: column;justify-content: center;">
				<view v-for="(list, key) in lists" :key="key" class="uni-indexed-list__menu-item" style="display: flex;">
					<text class="uni-indexed-list__menu-text" :class="touchmoveIndex == key ? 'uni-indexed-list__menu-text--active' : ''">{{ list.key }}</text>
				</view>
			</view>
		</view>
		<view v-if="touchmove" class="uni-indexed-list__alert-wrapper">
			<text class="uni-indexed-list__alert">{{ lists[touchmoveIndex].key }}</text>
		</view>
	</view>
</template>
<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
	import uniIcons from '../uni-icons/uni-icons.vue';
	import uniIndexedListItem from './uni-indexed-so-list-item.vue';

	// #ifdef APP-NVUE
	const dom = weex.requireModule('dom');
	// #endif
	// #ifdef APP-PLUS
	function throttle(func, delay) {
		var prev = Date.now();
		return function() {
			var context = this;
			var args = arguments;
			var now = Date.now();
			if (now - prev >= delay) {
				func.apply(context, args);
				prev = Date.now();
			}
		};
	}

	function touchMove(e) {
		let pageY = e.touches[0].pageY;
		let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight);
		if (this.touchmoveIndex === index) {
			return false;
		}
		let item = this.lists[index];
		if (item) {
			// #ifndef APP-NVUE
			this.scrollViewId = 'uni-indexed-list-' + index;
			this.touchmoveIndex = index;
			// #endif
			// #ifdef APP-NVUE
			dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
				animated: false
			});
			this.touchmoveIndex = index;
			// #endif
		}
	}
	const throttleTouchMove = throttle(touchMove, 40);
	// #endif

	/**
	 * IndexedList 索引列表
	 * @description 用于展示索引列表
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=375
	 * @property {Boolean} showSelect = [true|false] 展示模式
	 * 	@value true 展示模式
	 * 	@value false 选择模式
	 * @property {Object} options 索引列表需要的数据对象
	 * @event {Function} click 点击列表事件 ，返回当前选择项的事件对象
	 * @example <uni-indexed-list options="" showSelect="false" @click=""></uni-indexed-list>
	 */
	export default {
		name: 'UniIndexedSoList',
		components: {
			uniIcons,
			uniIndexedListItem,
			uniSwipeAction,
		},
		props: {
			options: {
				type: Array,
				default () {
					return [];
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			},
			scrollTop: {
				type: Number
			},
			status: {
				type: Boolean,
				default: false
			},
			topList: {
				type: Array,
				default () {
					return [];
				}
			},
			orgId: {
				type: Number
			}
		},
		data() {
			return {
				lists: [],
				winWidth: 0,
				itemHeight: 0,
				winOffsetY: 0,
				touchmove: false,
				touchmoveIndex: -1,
				scrollViewId: '',
				touchmoveTimeout: '',
				loaded: false,
				num: 120,
				rightWidth: 0,
				oss: '',
				timer:'',
				scrollStatus:false
			};
		},
		watch: {
			options: {
				handler: function() {
					this.setList();
				},
				deep: true
			}
		},
		onReady() {
			this.oss = this.$oss
		},
		mounted() {
			uni.createSelectorQuery()
				.in(this)
				.select('#list_index')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret[0])
					this.rightWidth = ret[0].width + 5
				});
			setTimeout(() => {
				this.loaded = true;
			}, 300);
		},
		methods: {
			onScroll(e) {
				clearTimeout(this.timer) // 每次滚动前 清除一次
				this.scrollStatus = true;
				this.timer = setTimeout(function() {
					// console.log('滚动结束了');
					this.scrollStatus = false;
				}, 500);

			},
			goNext(item) {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soWorkbench?id=${item.orgId}`
				})
			},
			cancelSo(list, index) {
				// console.log(index)
				list.items.splice(index, 1)
			},
			setList() {
				let index = 0;
				this.lists = [];
				this.options.forEach((value, index) => {
					if (value.dataList.length === 0) {
						return;
					}
					let indexBefore = index;
					let items = value.dataList.map(item => {
						let obj = {};
						obj['key'] = value.letter;
						obj['dataList'] = item;
						obj['itemIndex'] = index;
						index++;
						obj.checked = item.checked ? item.checked : false;
						return obj;
					});
					this.lists.push({
						title: value.letter,
						key: value.letter,
						items: items,
						itemIndex: indexBefore
					});
				});
				let height = uni.getSystemInfoSync().windowHeight;
				// this.winHeight = 14 * this.lists.length;
				// this.winOffsetY = (height - titleHeight - this.winHeight ) / 2;
				this.winHeight = 14 * this.lists.length;
				this.winOffsetY = (height - this.winHeight) / 2;
				this.itemHeight = this.winHeight / this.lists.length;
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				console.warn(pageY);
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index;
					this.touchmoveIndex = index;
					// #ifdef APP-NVUE
					dom.scrollToElement(this.$refs['uni-indexed-list-' + index][0], {
						animated: false
					});
					// #endif
				}
			},
			touchMove(e) {
				// #ifndef APP-PLUS
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.winOffsetY) / this.itemHeight);
				if (this.touchmoveIndex === index) {
					return false;
				}
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + index;
					this.touchmoveIndex = index;
				}
				// #endif
				// #ifdef APP-PLUS
				throttleTouchMove.call(this, e);
				// #endif
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			onClick(e) {
				// console.log(this.lists)
				let {
					idx,
					index
				} = e;
				let obj = {};
				for (let key in this.lists[idx].items[index]) {
					obj[key] = this.lists[idx].items[index][key];
				}
				let select = [];
				if (this.showSelect) {
					this.lists[idx].items[index].checked = !this.lists[idx].items[index].checked;
					this.lists.forEach((value, idx) => {
						value.items.forEach((item, index) => {
							if (item.checked) {
								let obj = {};
								for (let key in this.lists[idx].items[index]) {
									obj[key] = this.lists[idx].items[index][key];
								}
								select.push(obj);
							}
						});
					});
				}
				this.$emit('click', {
					item: obj,
					select: select
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	.avatarImg {
		width: 76rpx;
		height: 76rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
	}

	.adminInfo {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;

		.mark {
			width: 76rpx;
			height: 26rpx
		}
	}

	.wrapInfo {
		justify-content: space-between;
		height: 80rpx;
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.uni-indexed-list {
		position: absolute;
		left: 0;
		top: 112rpx;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__scroll {
		flex: 1;
	}

	.uni-indexed-list__menu {
		width: 16px;
		border-radius: 8px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		// justify-content:  flex-end;
	}

	.uni-indexed-list__menu-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		margin: 1px;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__menu-text {
		line-height: 12px;
		font-size: 10px;
		text-align: center;
		color: #696666;
	}

	.uni-indexed-list__menu--active {
		// background-color: rgb(200, 200, 200);
	}

	.uni-indexed-list__menu-text--active {
		color: #07C160;
	}

	.uni-indexed-list__alert-wrapper {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.uni-indexed-list__alert {
		width: 80px;
		height: 80px;
		border-radius: 80px;
		text-align: center;
		line-height: 80px;
		font-size: 35px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
