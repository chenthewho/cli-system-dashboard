<template>
	<view>
		<scroll-view class="scrollX" scroll-x="true" :scroll-left="scrollLeft" enable-flex="true"
			:style="{'--color':color,'--bg-color':bgColor}" scroll-with-animation="true">
			<view class="scroll-container">
				<view class="scroll-item">
					<block v-for="(item,index) in options" :key="item.text">
						<view :id="'item'+index" class="tab-item" :class="{activeView:activeItem===item.text}"
							@click="tapItem(item,index,$event)">
							{{item.text}}
						</view>
					</block>
				</view>
				<view class="underline" :style="[underlineLeft]"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: '#2979ff'
			},
			bgColor: {
				type: String,
				default: '#fff'
			},
			options: {
				type: Array,
				default: () => {
					return [{
							text: '选项卡1'
						},
						{
							text: '选项卡2'
						},
						{
							text: '选项卡3'
						},
						{
							text: '选项卡4'
						}
					]
				}
			},
		},
		data() {
			return {
				underlineLeft: {
					'transform': 'translateX(30rpx)'
				},
				scrollLeft: 0,
				activeItem: this.options[0].text,
			}
		},
		mounted() {
			this.getDom()
		},
		methods: {
			/**点击当前tab的时候，触发，
			 * @param {Object} event 当前tab的所以信息{id:'',text:''}
			 * @param {Object} $event当前点击事件的信息,从中获取当前tab的左边距
			 */
			tapItem(event,index, $event) {
				const left = $event.target.offsetLeft || 0 //获取当前被激活的tab的左边距
				if (left - 135 > 0) {
					this.scrollLeft = left - 135
				} else if (left - 135 < 0) {
					this.scrollLeft = 0
				}
				this.activeItem = event.text //同步当前激活的tab
				this.$emit('getTab', event,index)
				this.getDom(left) //每次点击时，都要重新调用dom查询，以此来保证动态获取最新的tab元素的宽度
			},
			/**
			 * 获取点击tab时被点击的DOM元素
			 */
			getDom(distance = 0) {
				this.$nextTick(() => { //$nextTick用来解决dom获取不准确的bug
					const query = uni.createSelectorQuery().in(this); //操作dom元素
					query.select('.activeView').boundingClientRect(data => {
						const width = data.width //当前被点击的dom的宽度
						const underlineWidth = width / 4 //设置下划线的宽度为当前tab的宽度的四分之一
						const left = ((width - underlineWidth) / 2) + distance //让下划线居中
						this.underlineLeft = {
							'transform': `translateX(${left}px)`,
							'width': `${underlineWidth}px`,
						}
					}).exec();
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.scrollX {
		width: 100%;
		background-color: var(--bg-color);
	}

	.scroll-container {
		height: 76rpx;
		width: 100%;

		.scroll-item {
			display: flex;

			.tab-item {
				text-align: center;
				white-space: nowrap;
				flex-shrink: 0;
				flex-grow: 1;
				padding: 15rpx 20rpx;
			}

			.activeView {
				color: var(--color);
				font-weight: bold;
			}
		}
	}

	.underline {
		width: 40rpx;
		height: 2rpx;
		border: 1px solid var(--color);
		background-color: var(--color);
		border-radius: 2rpx;
		transition: .4s;
	}

	// 取消H5端的滚动条
	// #ifndef MP
	scroll-view ::-webkit-scrollbar {
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	// #endif
</style>
