<template>
	<view class="content">
		<view class="header">
			<view class="content-left">
				<view style=""  v-if=" curNow==0">
					<uni-datetime-picker v-model="dateRange" type="daterange" @change="dateChange"
						style="font-weight: bold;margin-right: 100rpx;"><uni-icons custom-prefix="iconfont"
							type="icon-rili1" size="20" color="#000000"
							style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;text-align: center;justify-items: center;"></uni-icons>日期范围:
						{{formatDateRange()}}</uni-datetime-picker>
				</view>
			</view>
			<!-- <u-subsection :list="list" mode="subsection" :current="curNow" @change="sectionChange"></u-subsection> -->
			<div class="content-right">
				<div style="display: flex;">
					<u-button class="tabbtn2" type="primary" @click="sectionChange(1)" :plain="curNow==0" text="客户中心"
					style="width: 150px;"></u-button>
					<u-button class="tabbtn1" type="primary" @click="sectionChange(0)" :plain="curNow==1" text="订单中心"
						style="width: 150px;"></u-button>
				</div>
			</div>
		</view>
		<CustomerMangerIndexVue ref="CustomerMangerIndexVue" v-if=" curNow==1" />
		<OrderMangerIndexVue ref="OrderMangerIndexVue" v-if=" curNow==0" />
	</view>
</template>

<script>
	import CustomerMangerIndexVue from './CustomerMangerIndex.vue';
	import OrderMangerIndexVue from './OrderMangerIndex.vue';
	export default {
		name: 'order',
		components: {
			CustomerMangerIndexVue,
			OrderMangerIndexVue
		},
		data() {
			return {
				list: ['订单中心', '客户中心'],
				curNow: 1,
				dateRange: []
			}
		},
		mounted() {
			const currentDate = this.getcurrentTime();
			// 设置默认日期范围：今天到今天
			this.dateRange = [currentDate, currentDate];
		},
		methods: {
			getcurrentTime() {
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
				const day = String(currentDate.getDate()).padStart(2, '0');
			
				const formattedDate = `${year}-${month}-${day}`;
				return formattedDate;
			},
			formatDateRange() {
				if (!this.dateRange || this.dateRange.length !== 2) {
					return '请选择日期范围';
				}
				return `${this.dateRange[0]} 至 ${this.dateRange[1]}`;
			},
			onshowMethed() {
				this.curNow = 0;
				this.$refs.OrderMangerIndexVue.refresh();
			},
			sectionChange(index) {
				this.curNow = index;
				// if (this.curNow === 1) {
				// 	this.$refs.CustomerMangerIndexVue.refresh();
				// } else if (this.curNow === 0) {
				// 	this.$refs.OrderMangerIndexVue.refresh();
				// }
			},
			dateChange(e) {
				this.dateRange = e;
				// 传递范围数据给子组件
				this.$refs.OrderMangerIndexVue.dateChange(e[0],e[1]);
			}
		}
	}
</script>

<style lang="scss">
	.scrollArea {
		background-color: darkgrey;
		height: calc(100vh - 34rpx);

	}

	.tabbtn1 {
	height: 35px;
		border-top-left-radius: 0;
		/* 左上无圆角 */
		border-bottom-left-radius: 0;
		/* 左下无圆角 */
		border-top-right-radius: 5px;
		/* 右上圆角 */
		border-bottom-right-radius: 5px;
		/* 右下圆角 */
	}

	.tabbtn2 {
		height: 35px;
		border-top-left-radius: 5px;
		/* 左上圆角 */
		border-bottom-left-radius: 5px;
		/* 左下圆角 */
		border-top-right-radius: 0;
		/* 右上无圆角 */
		border-bottom-right-radius: 0;
		/* 右下无圆角 */	
	}

	.header {
		height: 30rpx;
		background-color: white;
		padding: 5rpx;
		display: flex;

		.content-left {
			flex: 1;
		}

		.content-right {
			flex: 1;
			display: flex;
			justify-content: end;
		}
	}
</style>