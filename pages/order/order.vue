<template>
	<view class="content" @click="hideDropdown">
		<view class="header">
			<view class="content-left">
				<!-- 订单中心的控件 -->
				<view class="filter-controls-container"  v-if=" curNow==0">
					<!-- 日期范围选择器 -->
					<view class="date-picker-wrapper">
						<uni-datetime-picker v-model="dateRange" type="daterange" @change="dateChange">
							<view class="date-picker-display">
								<uni-icons custom-prefix="iconfont" type="icon-rili1" size="16" color="#606266"></uni-icons>
								<text class="date-label">{{ formatDateRangeLabel() }}</text>
							</view>
						</uni-datetime-picker>
					</view>
					
					<!-- 重置日期按钮 -->
					<view class="reset-date-btn" v-if="dateRange && dateRange.length === 2" @click="resetDateRange">
						<uni-icons type="refresh" size="14" color="#909399"></uni-icons>
						<text class="reset-date-text">重置</text>
					</view>
					
					<!-- 原生筛选下拉框 -->
					<view class="filter-dropdown-wrapper">
						<view class="custom-dropdown" @click.stop>
							<!-- 下拉框触发按钮 -->
							<view class="dropdown-trigger" @click="toggleDropdown">
								<text class="trigger-text">{{ getCurrentFilterLabel() }}</text>
								<text class="dropdown-arrow" :class="{ 'arrow-up': showDropdown }">▼</text>
							</view>
							
							<!-- 下拉菜单 -->
							<view 
								class="dropdown-menu" 
								v-if="showDropdown"
								@click.stop
							>
								<view 
									class="dropdown-item" 
									:class="{ 'active': item.value === filterType }"
									v-for="item in filterOptions" 
									:key="item.value"
									@click="selectFilter(item)"
								>
									<text class="item-text">{{ item.label }}</text>
									<text class="check-icon" v-if="item.value === filterType">✓</text>
								</view>
								<!-- 重置选项 -->
								<view class="dropdown-divider"></view>
								<view class="dropdown-item reset-item" @click="resetFilter">
									<text class="item-text reset-text">重置筛选</text>
									<text class="reset-icon">↻</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 客户中心的搜索框 -->
				<view style="display: flex; align-items: center; gap: 20rpx;" v-if="curNow==1">
					<view class="search-container">
						<view class="search-input-wrapper">
							<uni-icons type="search" size="18" color="#999" class="search-icon"></uni-icons>
							<input 
								class="search-input" 
								type="text" 
								v-model="customerSearchText"
								placeholder="请输入客户名称搜索..."
								@input="onCustomerSearch"
								@confirm="onCustomerSearchConfirm"
							/>
							<view 
								class="clear-btn" 
								v-if="customerSearchText" 
								@click="clearCustomerSearch"
							>
								<uni-icons type="clear" size="16" color="#ccc"></uni-icons>
							</view>
						</view>
					</view>
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
				dateRange: [], // 初始为空，显示"全部"
				filterType: 'all', // 筛选类型：all(全部), debt(有欠款), sent(已发单), unsent(未发单)
				showDropdown: false, // 控制下拉菜单显示
				customerSearchText: '', // 客户搜索文本
				searchTimer: null, // 搜索防抖定时器
				filterOptions: [
					{
						label: '全部订单',
						value: 'all'
					},
					{
						label: '有欠款',
						value: 'debt'
					},
					{
						label: '已发单',
						value: 'sent'
					},
					{
						label: '未发单',
						value: 'unsent'
					}
				]
			}
		},
		mounted() {
			// 不再设置默认日期范围，让用户手动选择
			// const currentDate = this.getcurrentTime();
			// this.dateRange = [currentDate, currentDate];
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
			formatDateRangeLabel() {
				if (!this.dateRange || this.dateRange.length !== 2) {
					return '全部';
				}
				// 格式化日期显示，只显示日期部分
				const start = this.dateRange[0].split(' ')[0];
				const end = this.dateRange[1].split(' ')[0];
				// 如果开始和结束日期相同，只显示一个日期
				if (start === end) {
					return start;
				}
				return `${start} ~ ${end}`;
			},
		onshowMethed() {
			console.log("onshowMethed2");
			this.curNow = 0;
			this.$nextTick(() => {
				if (this.$refs.OrderMangerIndexVue) {
					this.$refs.OrderMangerIndexVue.refresh();
				}
			});
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
				if (e && e.length === 2) {
					// 如果选择了日期范围，传递具体的日期
					this.$refs.OrderMangerIndexVue.dateChange(e[0], e[1]);
				} else {
					// 如果清空了日期选择，传递空值或全部时间范围
					// 这里可以传递一个很大的时间范围，或者让子组件处理空值
					this.$refs.OrderMangerIndexVue.dateChange('', '');
				}
			},
			changeFilter(type) {
				this.filterType = type;
				// 传递筛选类型给子组件
				if (this.$refs.OrderMangerIndexVue) {
					this.$refs.OrderMangerIndexVue.filterChange(type);
				}
			},
			onFilterChange(e) {
				// 下拉框选择事件
				this.filterType = e.value;
				this.changeFilter(e.value);
			},
			// 原生下拉框相关方法
			toggleDropdown() {
				this.showDropdown = !this.showDropdown;
			},
			selectFilter(item) {
				this.filterType = item.value;
				this.showDropdown = false;
				this.changeFilter(item.value);
			},
			resetFilter() {
				this.filterType = 'all';
				this.showDropdown = false;
				this.changeFilter('all');
				// 显示重置提示
				uni.showToast({
					title: '已重置筛选条件',
					icon: 'success',
					duration: 1500
				});
			},
			getCurrentFilterLabel() {
				const current = this.filterOptions.find(item => item.value === this.filterType);
				return current ? current.label : '全部订单';
			},
			// 点击其他地方关闭下拉框
			hideDropdown() {
				this.showDropdown = false;
			},
			
			// 客户搜索相关方法
			onCustomerSearch(e) {
				const searchText = e.detail.value;
				this.customerSearchText = searchText;
				
				// 防抖处理，避免频繁搜索
				if (this.searchTimer) {
					clearTimeout(this.searchTimer);
				}
				
				this.searchTimer = setTimeout(() => {
					this.performCustomerSearch(searchText);
				}, 500); // 500ms 防抖延迟
			},
			
			onCustomerSearchConfirm() {
				// 确认搜索（回车键触发）
				if (this.searchTimer) {
					clearTimeout(this.searchTimer);
				}
				this.performCustomerSearch(this.customerSearchText);
			},
			
			performCustomerSearch(searchText) {
				// 执行实际搜索逻辑
				if (this.$refs.CustomerMangerIndexVue) {
					this.$refs.CustomerMangerIndexVue.searchMember(searchText);
				}
			},
			
			clearCustomerSearch() {
				this.customerSearchText = '';
				if (this.searchTimer) {
					clearTimeout(this.searchTimer);
				}
				// 清空搜索，重置客户列表
				this.performCustomerSearch('');
				uni.showToast({
					title: '已清空搜索',
					icon: 'success',
					duration: 1000
				});
			},
			
			// 重置日期范围
			resetDateRange() {
				this.dateRange = [];
				// 通知子组件重置日期，加载全部数据
				if (this.$refs.OrderMangerIndexVue) {
					this.$refs.OrderMangerIndexVue.dateChange('', '');
				}
				uni.showToast({
					title: '已重置日期',
					icon: 'success',
					duration: 1500
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: calc(100vw - 40rpx);
		max-width: calc(100vw - 40rpx);
		overflow-x: hidden;
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: white;
	}

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
		height: 50px;
		background-color: white;
		padding: 8rpx;
		display: flex;
		align-items: center;

		.content-left {
			flex: 2;
			display: flex;
			align-items: center;
		}

		.content-right {
			flex: 1;
			display: flex;
			justify-content: end;
		}
	}
	
	/* 筛选控件容器 - 左对齐布局 */
	.filter-controls-container {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}
	
	/* 日期选择器包装 */
	.date-picker-wrapper {
		display: inline-flex;
		align-items: center;
	}
	
	/* 日期选择器显示区域 */
	.date-picker-display {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 6rpx 12rpx;
		background: #fff;
		border: 1rpx solid #dcdfe6;
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		height: 32px;
	}
	
	.date-picker-display:hover {
		background: #f5f7fa;
		border-color: #c0c4cc;
	}
	
	.date-label {
		font-size: 14px;
		color: #606266;
		font-weight: 500;
		white-space: nowrap;
	}
	
	/* 重置日期按钮 */
	.reset-date-btn {
		display: inline-flex;
		align-items: center;
		gap: 4rpx;
		padding: 6rpx 12rpx;
		height: 32px;
		background: #fff;
		border: 1rpx solid #dcdfe6;
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.reset-date-btn:hover {
		background: #f5f7fa;
		border-color: #409eff;
	}
	
	.reset-date-text {
		font-size: 13px;
		color: #909399;
	}
	
	.reset-date-btn:hover .reset-date-text {
		color: #409eff;
	}
	
	/* 筛选下拉框包装 */
	.filter-dropdown-wrapper {
		display: inline-flex;
		align-items: center;
	}

	/* 原生下拉框样式 */
	.custom-dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 120rpx;
		padding: 6rpx 12rpx;
		background: #fff;
		border: 1rpx solid #dcdfe6;
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		height: 32px;
	}

	.dropdown-trigger:hover {
		background: #f5f7fa;
		border-color: #c0c4cc;
	}

	.trigger-text {
		font-size: 14px;
		color: #606266;
		font-weight: 500;
	}

	.dropdown-arrow {
		font-size: 12px;
		color: #909399;
		margin-left: 8rpx;
		transition: transform 0.3s ease;
	}

	.arrow-up {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 4rpx);
		left: 0;
		right: 0;
		background: #fff;
		border: 1rpx solid #e4e7ed;
		border-radius: 4rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 999;
		overflow: hidden;
		animation: dropdown-fade-in 0.3s ease;
		min-width: 140rpx;
	}

	@keyframes dropdown-fade-in {
		from {
			opacity: 0;
			transform: translateY(-10rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 16rpx;
		cursor: pointer;
		transition: all 0.2s ease;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.dropdown-item:last-child {
		border-bottom: none;
	}

	.dropdown-item:hover {
		background: #f5f7fa;
	}

	.dropdown-item.active {
		background: #ecf5ff;
		color: #409eff;
	}

	.item-text {
		font-size: 13px;
		color: #606266;
		font-weight: 400;
	}
	
	.dropdown-item.active .item-text {
		color: #409eff;
		font-weight: 500;
	}

	.check-icon {
		font-size: 14px;
		color: #409eff;
		font-weight: bold;
	}

	.dropdown-divider {
		height: 1rpx;
		background-color: #e4e7ed;
		margin: 4rpx 0;
	}

	.reset-item {
		background-color: #fafafa;
	}

	.reset-item:hover {
		background: #f0f0f0;
	}

	.reset-text {
		color: #909399;
		font-weight: 400;
	}

	.reset-icon {
		font-size: 14px;
		color: #909399;
		font-weight: bold;
	}

	/* 客户搜索框样式 */
	.search-container {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: #fff;
		border: 2rpx solid #e4e7ed;
		border-radius: 8rpx;
		padding: 0 12rpx;
		height: 35px;
		min-width: 280rpx;
		transition: border-color 0.3s ease;
	}

	.search-input-wrapper:focus-within {
		border-color: #409eff;
		box-shadow: 0 0 0 2rpx rgba(64, 158, 255, 0.2);
	}

	.search-icon {
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.search-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 15px;
		color: #333;
		background: transparent;
		height: 100%;
		line-height: 40px;
	}

	.search-input::placeholder {
		color: #c0c4cc;
		font-size: 14px;
	}

	.clear-btn {
		margin-left: 8rpx;
		padding: 4rpx;
		cursor: pointer;
		border-radius: 50%;
		transition: background-color 0.3s ease;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-btn:hover {
		background-color: #f5f7fa;
	}

	.clear-btn:active {
		background-color: #e6e8eb;
	}
</style>