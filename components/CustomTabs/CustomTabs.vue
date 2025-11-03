<template>
	<view class="custom-tabs">
		<view class="tabs-container">
			<view 
				v-for="(item, index) in list" 
				:key="index"
				class="tab-item"
				:class="{ active: currentIndex === index }"
				:style="itemStyle"
				:id="'tab-item-' + index"
				@click="handleClick(index)"
			>
			<text 
				class="tab-text"
				:id="'tab-text-' + index"
				:style="{ 
					color: currentIndex === index ? activeColor : inactiveColor,
					fontSize: getTextFontSize(index)
				}"
			>{{ item.name }}</text>
			</view>
		</view>
		<view class="underline-wrapper" :style="{ height: underlineHeight + 'px' }">
			<view 
				class="underline" 
				:style="[underlineStyle, { backgroundColor: underlineColor, height: underlineHeight + 'px' }]"
			></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabs',
	props: {
		list: {
			type: Array,
			default: () => []
		},
		itemStyle: {
			type: Object,
			default: () => ({})
		},
		current: {
			type: Number,
			default: 0
		},
		// 新增：用于监听父组件的可见性变化
		visible: {
			type: Boolean,
			default: true
		},
		// 激活文字颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 普通文字颜色
		inactiveColor: {
			type: String,
			default: '#606266'
		},
		// 激活文字大小
		activeFontSize: {
			type: String,
			default: ''
		},
		// 普通文字大小
		inactiveFontSize: {
			type: String,
			default: ''
		},
		// 下划线颜色
		underlineColor: {
			type: String,
			default: '#2979ff'
		},
		// 下划线高度
		underlineHeight: {
			type: Number,
			default: 4
		}
	},
	data() {
		return {
			currentIndex: 0,
			underlineStyle: {
				width: '0px',
				transform: 'translateX(0px)',
				transition: 'none'
			},
			isInit: false,
			observer: null
		};
	},
	watch: {
		current: {
			immediate: true,
			handler(val) {
				this.currentIndex = val;
				if (this.isInit) {
					this.updateUnderline(true);
				}
			}
		},
		list: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					setTimeout(() => {
						this.initUnderline();
					}, 100);
				});
			}
		},
		// 监听可见性变化
		visible: {
			handler(val) {
				if (val) {
					// 当组件变为可见时，重新初始化下划线
					this.$nextTick(() => {
						setTimeout(() => {
							this.initUnderline();
						}, 200);
					});
				}
			}
		}
	},
	mounted() {
		// 延迟初始化，确保DOM完全渲染
		this.$nextTick(() => {
			setTimeout(() => {
				this.initUnderline();
			}, 150);
		});
		
		// 使用 IntersectionObserver 监听元素可见性
		this.setupVisibilityObserver();
	},
	beforeDestroy() {
		if (this.observer) {
			this.observer.disconnect();
		}
	},
	methods: {
		getTextFontSize(index) {
			const isActive = this.currentIndex === index;
			if (isActive && this.activeFontSize) {
				return this.activeFontSize;
			}
			if (!isActive && this.inactiveFontSize) {
				return this.inactiveFontSize;
			}
			return this.itemStyle.fontSize || '14px';
		},
		
		handleClick(index) {
			if (this.currentIndex === index) return;
			this.currentIndex = index;
			this.updateUnderline(true);
			this.$emit('click', {
				index,
				...this.list[index]
			});
		},
		
		initUnderline() {
			this.updateUnderline(false);
			this.isInit = true;
		},
		
		// 暴露给外部的刷新方法
		refresh() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.initUnderline();
				}, 100);
			});
		},
		
		setupVisibilityObserver() {
			// 在uni-app中使用 IntersectionObserver
			try {
				const observer = uni.createIntersectionObserver(this);
				observer.relativeToViewport({bottom: 0}).observe('.custom-tabs', (res) => {
					if (res.intersectionRatio > 0 && !this.isInit) {
						// 元素变为可见且还未初始化
						this.$nextTick(() => {
							setTimeout(() => {
								this.initUnderline();
							}, 200);
						});
					}
				});
				this.observer = observer;
			} catch (e) {
				console.log('IntersectionObserver not supported');
			}
		},
		
	updateUnderline(animate = true) {
		// 查询当前激活的文字元素和tab-item元素
		const query = uni.createSelectorQuery().in(this);
		query.select(`#tab-text-${this.currentIndex}`).boundingClientRect();
		query.select(`#tab-item-${this.currentIndex}`).boundingClientRect();
		query.exec((res) => {
			if (res && res[0] && res[1] && res[0].width > 0) {
				const textInfo = res[0]; // 文字信息
				const itemInfo = res[1]; // tab-item信息
				
				// 查询第一个tab的位置作为基准
				const firstQuery = uni.createSelectorQuery().in(this);
				firstQuery.select('#tab-item-0').boundingClientRect();
				firstQuery.exec((firstRes) => {
					if (firstRes && firstRes[0]) {
						const firstLeft = firstRes[0].left;
						// 计算文字中心相对于第一个tab的偏移
						const textCenterX = textInfo.left + textInfo.width / 2;
						const offset = textCenterX - firstLeft - textInfo.width / 2;
						
						this.underlineStyle = {
							width: textInfo.width + 'px', // 使用文字宽度
							transform: `translateX(${offset}px)`,
							transition: animate ? 'all 0.3s ease' : 'none'
						};
					}
				});
			}
		});
	}
	}
};
</script>

<style scoped>
.custom-tabs {
	position: relative;
	display: inline-block;
}

.tabs-container {
	display: flex;
	align-items: center;
	position: relative;
}

.tab-item {
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.tab-text {
	font-size: 14px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	transform-origin: center center;
}

.tab-item.active .tab-text {
	font-weight: bold;
	transform: scale(1);
}

.underline-wrapper {
	position: relative;
	width: 100%;
	background-color: transparent;
}

.underline {
	position: absolute;
	left: 0;
	bottom: 0;
	border-radius: 2px;
	transform-origin: left center;
}
</style>

