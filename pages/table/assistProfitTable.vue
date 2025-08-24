<template>
	<view class="tablet-profit-page">
	  <!-- 顶部工具栏 -->
	  <view class="top-toolbar">
		<view class="toolbar-left">
		  <view class="back-button" @click="handleBack">
			<uni-icons type="left" size="18" color="#666"></uni-icons>
			<text class="back-text">返回</text>
		  </view>
		  <text class="page-title">批次利润统计表</text>
		</view>
		
		<!-- 筛选条件 -->
		<view class="toolbar-filter">
		  <view class="filter-group">
			<text class="filter-label">时间范围：</text>
			<view class="tab-buttons">
			  <view 
				class="tab-button" 
				:class="{ active: currentTab === 1 }"
				@click="changeTab(1)"
			  >
				自定义
			  </view>
			  <view 
				class="tab-button" 
				:class="{ active: currentTab === 2 }"
				@click="changeTab(2)"
			  >
				本月
			  </view>
			  <view 
				class="tab-button" 
				:class="{ active: currentTab === 3 }"
				@click="changeTab(3)"
			  >
				今日
			  </view>
			</view>
		  </view>
		  
		  <view class="date-group" v-if="currentTab === 1">
			<uni-datetime-picker v-model="startDate" type="date">
			  <view class="date-picker">
				<text>{{ startDate }}</text>
				<uni-icons type="calendar" size="12" color="#999"></uni-icons>
			  </view>
			</uni-datetime-picker>
			<text class="date-separator">至</text>
			<uni-datetime-picker v-model="endDate" type="date">
			  <view class="date-picker">
				<text>{{ endDate }}</text>
				<uni-icons type="calendar" size="12" color="#999"></uni-icons>
			  </view>
			</uni-datetime-picker>
		  </view>
		</view>
		
		<view class="toolbar-right">
		  <view class="action-button" @click="handleRefresh">
			<uni-icons type="refresh" size="16" color="#666"></uni-icons>
			<text>刷新</text>
		  </view>
		  <view class="action-button primary" @click="handleExport">
			<uni-icons type="download" size="16" color="#fff"></uni-icons>
			<text>导出</text>
		  </view>
		</view>
	  </view>
  
	  <!-- 主要内容区域 - 表格区域 -->
	  <view class="main-content">
		<view class="table-container">
		  <view class="table-header-info">
			<text class="table-title">批次统计</text>
			<text class="table-subtitle">共 {{ goodsList.length }} 条记录</text>
		  </view>
		  
		  <!-- 固定列表格 -->
		  <view class="fixed-table">
			<!-- 表格结构：左侧固定列 + 右侧滑动列 -->
			<view class="table-wrapper">
			  <!-- 固定列 - 商品名称 -->
			  <view class="fixed-column">
				<!-- 固定列头 -->
				<view class="fixed-header">
				  <text class="header-text">批次编号</text>
				</view>
				
				<!-- 固定列内容 -->
				<scroll-view 
					class="fixed-body" 
					scroll-y 
					:style="{ height: tableHeight + 'px' }"
					@scroll="onFixedBodyScroll"
					:scroll-top="fixedScrollTop"
					:scroll-with-animation="false"
				>
				  <view 
					class="fixed-row" 
					v-for="(item, index) in batchProfitSimpleList" 
					:key="item.id"
					@click="handleRowClick(item)"
				  >
					<view class="product-cell">
					  <text class="product-name">{{ item.shipperName }}</text>
					  <text class="product-no">{{ item.batchCode }}</text>
					</view>
				  </view>
				  
				  <!-- 空状态 -->
				  <view class="empty-fixed-row" v-if="goodsList.length === 0">
					<text>暂无数据</text>
				  </view>
				</scroll-view>
				
				<!-- 固定列底部 -->
				<view class="fixed-footer">
				  <text class="summary-text">合计</text>
				</view>
			  </view>
			  
			  <!-- 滑动列 - 单价、销量、销售额 -->
			  <view class="scroll-column">
				<!-- 滑动列头 -->
				<scroll-view class="scroll-header" scroll-x>
				  <view class="scroll-header-content">
					<view class="scroll-header-cell">创建时间</view>
					<view class="scroll-header-cell">代卖费类型</view>
					<view class="scroll-header-cell">销售额(元)</view>
					<view class="scroll-header-cell">代卖费单价</view>
					<view class="scroll-header-cell">代卖费用</view>
					<view class="scroll-header-cell">状态</view>
				  </view>
				</scroll-view>
				
				<!-- 滑动列内容 -->
				<scroll-view 
					class="scroll-body" 
					scroll-y 
					scroll-x 
					:style="{ height: tableHeight + 'px' }"
					@scroll="onScrollBodyScroll"
					:scroll-top="scrollBodyScrollTop"
					:scroll-with-animation="false"
				>
				  <view class="scroll-body-content">
					<view 
					  class="scroll-row" 
					  v-for="(item, index) in batchProfitSimpleList" 
					  :key="item.id"
					  @click="handleRowClick(item)"
					>
					  <view class="scroll-cell price-cell">
						<text class="price-value">{{ item.createTime.replace('T', ' ') }}</text>
					  </view>
					  <view class="scroll-cell sales-cell">
						<text class="sales-value status-selling" v-if="item.assistType === 0">按批次</text>
						<text class="sales-value status-sold-out" v-if="item.assistType === 1">按数量</text>
						<text class="sales-value status-settled" v-if="item.assistType === 2">按重量</text>
					  </view>
					  <view class="scroll-cell total-cell">
						<text class="total-value">{{ item.cargoAmount }}</text>
					  </view>
					  <view class="scroll-cell sales-cell">
						<text class="sales-value">{{ item.assistUnitPrice}}</text>
					  </view>
					  <view class="scroll-cell sales-cell">
					  	<text class="total-value">{{ item.assistAmount}}</text>
					  </view>
					  <view class="scroll-cell sales-cell">
						<text class="sales-value status-selling" v-if="item.saleStatus === 1">正售</text>
						<text class="sales-value status-sold-out" v-if="item.saleStatus === 0">售罄</text>
						<text class="sales-value status-settled" v-if="item.saleStatus === 2">已结算</text>
					  </view>
					</view>
					
					<!-- 空状态 -->
					<view class="empty-scroll-row" v-if="goodsList.length === 0">
					  <view class="scroll-cell">-</view>
					  <view class="scroll-cell">-</view>
					  <view class="scroll-cell">-</view>
					</view>
				  </view>
				</scroll-view>
				
				<!-- 滑动列底部 -->
				<scroll-view class="scroll-footer" scroll-x>
				  <view class="scroll-footer-content">
					<view class="scroll-footer-cell">-</view>
					<view class="scroll-footer-cell">
					  <text class="summary-number">{{ totalSales }}</text>
					</view>
					<view class="scroll-footer-cell">
					  <text class="summary-amount">{{ formatNumber(totalAmount) }}</text>
					</view>

					<view class="scroll-footer-cell">
					  <text class="summary-amount">{{ }}</text>
					</view>
					<view class="scroll-footer-cell">-</view>
				  </view>
				</scroll-view>
			  </view>
			</view>
		  </view>
		</view>
	  </view>
  
	  <!-- 加载遮罩 -->
	  <view class="loading-mask" v-if="loading">
		<view class="loading-box">
		  <view class="spinner"></view>
		  <text>加载中...</text>
		</view>
	  </view>
	  
		<!-- 抽屉组件 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showDrawer }" @tap="closeDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showDrawer }">
				<slot>
					<view class="drawer-content-header">
						<view>
							<uni-icons custom-prefix="iconfont" type="icon-guanbi" size="25" color="#ca0000"
								style="font-weight: bold;margin-left: 10rpx;margin-right: 10rpx; "></uni-icons>
							<text>车次明细</text>
						</view>
					</view>
					<view class="drawer-content-header2">
						<view class="drawer-content-header2-title">
							货主：{{selectAssistBatchDetail.shipperName}} 车次：{{selectAssistBatchDetail.batchCode}} <text
								v-if="selectAssistBatchDetail.saleStatus===1" class="drawer-content-header2-status"
								style="--sale-status-color: #00aaff;">
								在售
							</text>
							<text v-if="selectAssistBatchDetail.saleStatus===0" class="drawer-content-header2-status"
								style="--sale-status-color: #e74c3c;">
								停售
							</text>
							<text v-if="selectAssistBatchDetail.saleStatus===2" class="drawer-content-header2-status"
								style="--sale-status-color: #00b900;">
								已结算
							</text>
						</view>
						<view class="drawer-content-header2-title2">
							创建时间:  {{selectAssistBatchDetail.createTime}}
						</view>
					</view>

					<view class="drawer-content-card">
						<view class="drawer-content-card-title">
							销售明细
						</view>
						<view class="drawer-content-table-content">
							<scroll-view class="drawer-content-scrollArea" scroll-y="true" scroll-x="true" >
							 <table border="1" class="drawer-content-table" >
							    <thead>
							      <tr class="drawer-content-table-header" >
							        <th  class="drawer-content-table-header-grid">货品</th>
							        <th  class="drawer-content-table-header-grid">销量</th>
							        <th  class="drawer-content-table-header-grid">均重</th>
							        <th  class="drawer-content-table-header-grid">均价</th>
							        <th  class="drawer-content-table-header-grid">货款</th>
							      </tr>
							    </thead>
							    <tbody>
							      <tr v-for="item in selectAssistBatchDetail.allPurchaseAssistList">
							        <td  class="drawer-content-table-grid" >{{item.commodityName}}</td>
							        <td class="drawer-content-table-grid" >{{item.saleMount}}</td>
							        <td class="drawer-content-table-grid" >---</td>
							        <td class="drawer-content-table-grid" >{{item.averagePrice}}</td>
							        <td class="drawer-content-table-grid" >{{item.saleSubTotal}}</td>
							      </tr>
							    </tbody>
								<tbody>
								  <tr >
								    <td  class="drawer-content-table-grid" >合计:</td>
								    <td class="drawer-content-table-grid" ></td>
								    <td class="drawer-content-table-grid" >---</td>
								    <td class="drawer-content-table-grid" ></td>
								    <td class="drawer-content-table-grid" ></td>
								  </tr>
								</tbody>
							  </table>
							  </scroll-view>
						</view>
					</view>
				</slot> <!-- 抽屉内容插槽 -->
			</view>
		</view>
	</view>
  </template>
  
  <script >
	import tableApi from '../../api/table/tableApi'
  export default {
	name: 'EmployProfitTable',
	data() {
	  return {
		loading: false,
		showDrawer: false,
		selectAssistBatchDetail: "", //选中的代销批次明细
		currentTab: 3, // 默认选择今日
		startDate: '',
		endDate: '',
		tableHeight: 400,
		currentCompanyId:"",
		batchProfitSimpleList:[],
		// 滚动同步相关变量
		fixedScrollTop: 0,
		scrollBodyScrollTop: 0,
		isScrollingFixed: false,
		isScrollingBody: false,
		goodsList: [
		  {
			id: 1,
			name: '苹果 iPhone 13',
			price: 5999,
			sales: 120,
			total: 719880
		  },
		  {
			id: 2,
			name: '小米 12 Pro',
			price: 4699,
			sales: 85,
			total: 399415
		  },
		  {
			id: 3,
			name: '华为 Mate 40',
			price: 4999,
			sales: 63,
			total: 314937
		  },
		  {
			id: 4,
			name: '华为 P50 Pro',
			price: 5988,
			sales: 45,
			total: 269460
		  },
		  {
			id: 5,
			name: 'OPPO Find X5',
			price: 3999,
			sales: 38,
			total: 151962
		  }
		]
	  }
	},
	computed: {
	  totalSales() {
		return this.goodsList.reduce((sum, item) => sum + item.sales, 0)
	  },
	  totalAmount() {
		return this.batchProfitSimpleList.reduce((sum, item) => sum + item.cargoAmount, 0)
	  }
	},
	created() {
		console.log("tableApi", tableApi)
	},
	mounted() {
	  this.currentCompanyId = uni.getStorageSync('companyId');
		this.loadData();
	  this.initDates()
	  this.$nextTick(() => {
		this.calculateTableHeight()
	  })
	},
	methods: {
	  loadData() {
				  tableApi.getBatchProfitSimpleByCompanyId(this.currentCompanyId).then(res => {
					  console.log("res", res)
					  this.batchProfitSimpleList = res.data
					  this.batchProfitSimpleList = this.batchProfitSimpleList.sort((a, b) => {
						  return new Date(b.createTime) - new Date(a.createTime);
					  });
				  })
			  },
	  // 工具方法
	  formatDate(date) {
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	  },
	  
	  formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	  },
	  
	  formatCurrency(amount) {
		return `¥${this.formatNumber(amount)}`
	  },
	  
	  // 获取今日日期
	  getTodayDate() {
		const today = new Date()
		return this.formatDate(today)
	  },
	  
	  // 获取本月第一天
	  getMonthStart() {
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth()
		return this.formatDate(new Date(year, month, 1))
	  },
	  
	  // 获取本月最后一天
	  getMonthEnd() {
		const today = new Date()
		const year = today.getFullYear()
		const month = today.getMonth()
		return this.formatDate(new Date(year, month + 1, 0))
	  },
	  
	  // 初始化日期
	  initDates() {
		const today = this.getTodayDate()
		this.startDate = today
		this.endDate = today
	  },
	  
	  // 事件处理方法
	  handleBack() {
		uni.navigateBack({
		  delta: 1
		})
	  },
	  
	  changeTab(tabIndex) {
		this.currentTab = tabIndex
		
		switch (tabIndex) {
		  case 1: // 自定义
			// 保持当前日期不变
			break
		  case 2: // 本月
			this.startDate = this.getMonthStart()
			this.endDate = this.getMonthEnd()
			break
		  case 3: // 今日
			const today = this.getTodayDate()
			this.startDate = today
			this.endDate = today
			break
		}
		
		// 刷新数据
		this.refreshData()
	  },
	  
	  async refreshData() {
		this.loading = true
		try {
		  // 模拟API调用
		  await new Promise(resolve => setTimeout(resolve, 800))
		  
		  // 这里可以根据时间范围请求真实数据
		  console.log('查询时间范围:', this.startDate, '至', this.endDate)
		  
		  uni.showToast({
			title: '数据已更新',
			icon: 'success',
			duration: 1500
		  })
		} catch (error) {
		  console.error('刷新数据失败:', error)
		  uni.showToast({
			title: '刷新失败',
			icon: 'error'
		  })
		} finally {
		  this.loading = false
		}
	  },
	  
	  handleRefresh() {
		this.refreshData()
	  },
	  
	  handleExport() {
		uni.showModal({
		  title: '导出数据',
		  content: '是否导出当前筛选条件下的数据？',
		  success: (res) => {
			if (res.confirm) {
			  // 模拟导出过程
			  uni.showLoading({
				title: '导出中...'
			  })
			  
			  setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
				  title: '导出成功',
				  icon: 'success'
				})
			  }, 2000)
			}
		  }
		})
	  },
	  
	  handleRowClick(item) {
		  console.log(item);
		// uni.showModal({
		//   title: '商品详情',
		//   content: `商品：${item.name}\n单价：¥${item.price}\n销量：${item.sales}件\n销售额：¥${this.formatNumber(item.total)}`,
		//   showCancel: false
		// })
		this.openAssistDrawer(item.batchId);
	  },
	  
	  // 固定列滚动事件处理
	  onFixedBodyScroll(e) {
		if (this.isScrollingBody) return
		
		this.isScrollingFixed = true
		const scrollTop = e.detail.scrollTop
		this.scrollBodyScrollTop = scrollTop
		
		setTimeout(() => {
		  this.isScrollingFixed = false
		}, 50)
	  },
	  
	  // 滑动列滚动事件处理
	  onScrollBodyScroll(e) {
		if (this.isScrollingFixed) return
		
		this.isScrollingBody = true
		const scrollTop = e.detail.scrollTop
		this.fixedScrollTop = scrollTop
		
		setTimeout(() => {
		  this.isScrollingBody = false
		}, 50)
	  },
	  
	  // 计算表格高度
	  calculateTableHeight() {
		uni.getSystemInfo({
		  success: (res) => {
			// 新布局：屏幕高度 - 顶部工具栏 - 表格头部信息 - 固定列头部 - 固定列底部 - 内边距
			const screenHeight = res.windowHeight
			const toolbarHeight = 80   // 顶部工具栏（包含筛选）
			const tableHeaderInfoHeight = 53  // 表格头部信息
			const fixedHeaderHeight = 45  // 固定列头部
			const fixedFooterHeight = 45  // 固定列底部
			const padding = 40  // 上下内边距
			
			this.tableHeight = screenHeight - toolbarHeight - tableHeaderInfoHeight - fixedHeaderHeight - fixedFooterHeight - padding
			
			// 最小高度限制
			if (this.tableHeight < 200) {
			  this.tableHeight = 200
			}
			
			// 最大高度限制（避免过高）
			if (this.tableHeight > 500) {
			  this.tableHeight = 500
			}
		  }
		})
	  },
	  
	  //关闭抽屉
	  closeDrawer() {
	  	this.showDrawer = false;
	  },
	  //打开抽屉
	  openAssistDrawer(batchId) {
	  	console.log("batchId", batchId)
	  	this.getAssistBatchDetail(batchId);
	  	this.showDrawer = true;
	  },
	  //获取单个代销批次信息(包含利润计算)
	  getAssistBatchDetail(batchId) {
	  	tableApi.GetSingleAssistBatchInfoAndProfit(batchId).then(res => {
	  		console.log("res", res)
	  		this.selectAssistBatchDetail = res.data;
	  	})
	  },
	}
  }
  </script>
  
  <style lang="scss" scoped>
  /* 平板横屏专用样式 - 灰色主题 + 筛选条件在顶部 */
  .tablet-profit-page {
	min-height: 100vh;
	background: #f5f6fa;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* 顶部工具栏 - 包含筛选条件 */
  .top-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 60px;
	padding: 10px 20px;
	background: #ffffff;
	border-bottom: 1px solid #e5e5e5;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	flex-wrap: wrap;
	gap: 20px;
  }
  
  .toolbar-left {
	display: flex;
	align-items: center;
	gap: 20px;
	flex-shrink: 0;
  }
  
  .back-button {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 12px;
	background: #f8f9fa;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s;
  
	&:hover {
	  background: #e9ecef;
	}
  }
  
  .back-text {
	font-size: 14px;
	color: #666;
  }
  
  .page-title {
	font-size: 18px;
	font-weight: 600;
	color: #333;
  }
  
  /* 筛选条件区域 */
  .toolbar-filter {
	display: flex;
	align-items: center;
	gap: 16px;
	flex: 1;
	justify-content: center;
	flex-wrap: wrap;
  }
  
  .filter-group {
	display: flex;
	align-items: center;
	gap: 12px;
  }
  
  .filter-label {
	font-size: 14px;
	color: #666;
	white-space: nowrap;
  }
  
  .tab-buttons {
	display: flex;
	border: 1px solid #ddd;
	border-radius: 4px;
	overflow: hidden;
  }
  
  .tab-button {
	padding: 6px 16px;
	font-size: 14px;
	background: #f8f9fa;
	color: #666;
	cursor: pointer;
	transition: all 0.2s;
	border-right: 1px solid #ddd;
	white-space: nowrap;
  
	&:last-child {
	  border-right: none;
	}
  
	&.active {
	  background: #007bff;
	  color: white;
	}
  
	&:hover:not(.active) {
	  background: #e9ecef;
	}
  }
  
  .date-group {
	display: flex;
	align-items: center;
	gap: 8px;
  }
  
  .date-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 6px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	background: #fff;
	font-size: 14px;
	color: #333;
	cursor: pointer;
	min-width: 120px;
  
	&:hover {
	  border-color: #007bff;
	}
  }
  
  .date-separator {
	font-size: 14px;
	color: #666;
  }
  
  .toolbar-right {
	display: flex;
	gap: 10px;
	flex-shrink: 0;
  }
  
  .action-button {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 16px;
	border-radius: 6px;
	background: #f8f9fa;
	color: #666;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
  
	&:hover {
	  background: #e9ecef;
	}
  
	&.primary {
	  background: #007bff;
	  color: white;
  
	  &:hover {
		background: #0056b3;
	  }
	}
  }
  
  /* 主要内容区域 */
  .main-content {
	height: calc(100vh - 80px);
	padding: 20px;
  }
  
  .table-container {
	height: 100%;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #e5e5e5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
  }
  
  .table-header-info {
	padding: 16px 20px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: space-between;
  }
  
  .table-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
  }
  
  .table-subtitle {
	font-size: 12px;
	color: #999;
  }
  
  /* 固定列表格 */
  .fixed-table {
	flex: 1;
	overflow: hidden;
  }
  
  .table-wrapper {
	display: flex;
	height: 100%;
  }
  
  /* 固定列 - 商品名称 */
  .fixed-column {
	width: 300px;
	border-right: 2px solid #e5e5e5;
	display: flex;
	flex-direction: column;
	background: #fafbfc;
  }
  
  .fixed-header {
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	border-bottom: 1px solid #e5e5e5;
	font-weight: 600;
	color: #333;
	font-size: 14px;
  }
  
  .fixed-body {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
  }
  
  .fixed-row {
	height: 60px;
	border-bottom: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	padding: 0 16px;
	cursor: pointer;
	transition: background-color 0.2s;
  
	&:hover {
	  background: #f0f2f5;
	}
  
	&:last-child {
	  border-bottom: none;
	}
  }
  
  .product-cell {
	display: flex;
	flex-direction: column;
	width: 100%;
  }
  
                  .product-name {
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 4px;
                    font-size: 14px;
                }
  
                  .product-no {
                    font-size: 12px;
                    color: #666;
                }
  
  .fixed-footer {
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	border-top: 1px solid #e5e5e5;
	font-weight: 600;
	color: #666;
	font-size: 14px;
  }
  
  .empty-fixed-row {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
	font-size: 14px;
  }
  
  /* 滑动列 - 单价、销量、销售额 */
  .scroll-column {
	flex: 1;
	display: flex;
	flex-direction: column;
  }
  
  .scroll-header {
	height: 45px;
	border-bottom: 1px solid #e5e5e5;
  }
  
  .scroll-header-content {
	display: flex;
	height: 100%;
	min-width: 600px;
  }
  
  .scroll-header-cell {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	border-right: 1px solid #e5e5e5;
	font-weight: 600;
	color: #333;
	font-size: 14px;
  
	&:last-child {
	  border-right: none;
	}
  }
  
  .scroll-body {
	flex: 1;
	overflow-y: auto;
	overflow-x: auto;
  }
  
  .scroll-body-content {
	min-width: 600px;
  }
  
  .scroll-row {
	display: flex;
	height: 60px;
	border-bottom: 1px solid #f0f0f0;
	cursor: pointer;
	transition: background-color 0.2s;
  
	&:hover {
	  background: #f8f9fa;
	}
  
	&:last-child {
	  border-bottom: none;
	}
  }
  
  .scroll-cell {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid #f0f0f0;
	font-size: 14px;
  
	&:last-child {
	  border-right: none;
	}
  }
  
                  .price-value {
                    color: #007bff;
                    font-weight: 500;
                }
  
  .sales-value {
	color: #333;
	
	/* 状态文字样式 - 带背景色和圆弧边框 */
	&.status-selling {
	  background: #e8f5e8;
	  color: #28a745;
	  padding: 4px 12px;
	  border-radius: 12px;
	  font-size: 12px;
	  font-weight: 500;
	  border: 1px solid #c3e6c3;
	}
	
	&.status-sold-out {
	  background: #fff3cd;
	  color: #856404;
	  padding: 4px 12px;
	  border-radius: 12px;
	  font-size: 12px;
	  font-weight: 500;
	  border: 1px solid #ffeaa7;
	}
	
	&.status-settled {
	  background: #d1ecf1;
	  color: #0c5460;
	  padding: 4px 12px;
	  border-radius: 12px;
	  font-size: 12px;
	  font-weight: 500;
	  border: 1px solid #bee5eb;
	}
  }
  
                  .total-value {
                    color: #28a745;
                    font-weight: 600;
                }
  
  .scroll-footer {
	height: 45px;
	border-top: 1px solid #e5e5e5;
  }
  
  .scroll-footer-content {
	display: flex;
	height: 100%;
	min-width: 600px;
  }
  
  .scroll-footer-cell {
	width: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	border-right: 1px solid #e5e5e5;
	font-weight: 600;
	font-size: 14px;
  
	&:last-child {
	  border-right: none;
	}
  }
  
  .summary-text {
	color: #666;
  }
  
  .summary-number {
	color: #333;
  }
  
                  .summary-amount {
                    color: #28a745;
                    font-weight: 700;
                }
  
  .empty-scroll-row {
	display: flex;
	height: 60px;
  }
  
  /* 加载遮罩 */
  .loading-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
  }
  
  .loading-box {
	background: white;
	padding: 30px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .spinner {
	width: 32px;
	height: 32px;
	border: 3px solid #f0f0f0;
	border-top: 3px solid #007bff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
  }
  
  /* 响应式调整 */
  @media (max-width: 1200px) {
	.fixed-column {
	  width: 250px;
	}
  
	.scroll-header-cell,
	.scroll-cell,
	.scroll-footer-cell {
	  width: 150px;
	}
  
	.scroll-header-content,
	.scroll-body-content,
	.scroll-footer-content {
	  min-width: 450px;
	}
  }
  
  @media (max-width: 900px) {
	.top-toolbar {
	  flex-direction: column;
	  align-items: stretch;
	  height: auto;
	  padding: 15px 20px;
	}
  
	.toolbar-filter {
	  justify-content: flex-start;
	  margin: 10px 0;
	}
  
	.main-content {
	  height: calc(100vh - 120px);
	}
  
	.fixed-column {
	  width: 200px;
	}
  
	.scroll-header-cell,
	.scroll-cell,
	.scroll-footer-cell {
	  width: 120px;
	}
  
	.scroll-header-content,
	.scroll-body-content,
	.scroll-footer-content {
	  min-width: 360px;
	}
  }
  
  /* 抽屉容器 */
  .drawer-container {
  	position: fixed;
  	top: 0;
  	left: 0;
  	width: 100%;
  	pointer-events: none;
  	/* 初始不允许交互 */
  	z-index: 999;
  	margin-top: 40rpx;
  	height: calc(100% - 40rpx);
  }
  
  /* 遮罩层 */
  .drawer-mask {
  	position: absolute;
  	top: 0;
  	left: 0;
  	width: 50%;
  	height: 100%;
  	background: rgba(0, 0, 0, 0.5);
  	opacity: 0;
  	transition: opacity 0.3s ease;
  	pointer-events: none;
  }
  
  .drawer-mask.show {
  	opacity: 1;
  	pointer-events: auto;
  	/* 显示时允许点击 */
  }
  
  /* 抽屉内容 */
  .drawer-content {
  	position: absolute;
  	top: 0;
  	right: -100%;
  	/* 初始隐藏在右侧 */
  	width: 75%;
  	/* 抽屉宽度 */
  	height: 100%;
  	background: #cacaca;
  	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  	transition: transform 0.3s ease;
  	pointer-events: auto;
  }
  
  .drawer-content.show {
  	transform: translateX(-100%);
  	/* 从右向左滑出 */
  }
  
  .drawer-content-header {
  	display: grid;
  	align-items: center;
  	height: 30rpx;
  	line-height: 30rpx;
  	font-size: 12rpx;
  	font-weight: bold;
  	background-color: white;
  	border-bottom: 1px solid #888888;
  }
  
  .drawer-content-header2 {
  	height: 50rpx;
  	font-size: 13rpx;
  	font-weight: bold;
  	background-color: white;
  }
  
  .drawer-content-header2-title {
  	padding: 5rpx;
  }
  
  .drawer-content-header2-title2 {
  	font-size: 9rpx;
  	margin-left: 5rpx;
  	margin-top: 5rpx;
  	color: grey;
  }
  
  .drawer-content-header2-status {
  	font-size: 10rpx;
  	color: white;
  	background-color: var(--sale-status-color, #d8d8d8);
  	margin-left: 5rpx;
  	padding: 2rpx;
  	border-radius: 5rpx;
  }
  
  .drawer-content-card {
  	height: 50rpx;
  	font-size: 13rpx;
  	font-weight: bold;
  	background-color: white;
  	margin-top: 20rpx;
  	height: calc(100% - 140rpx);
  }
  .drawer-content-card-title {
  	padding: 5rpx;
  }
  
  
  
  .drawer-content-table-content {
  	padding: 10rpx;
  }
  
  .drawer-content-scrollArea {
  	width: 300rpx;
  		 box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
  }
  .drawer-content-table {
  	width: 100%;
  	border-collapse: collapse;
  }
  
  .drawer-content-table-header {
  	background-color: #f5f5f5; 
  	font-weight: bold;
  }
  
  .drawer-content-table-header-grid {
  	padding: 8px; 
  	text-align: center;
  }
  .drawer-content-table-grid {
  	padding: 8px;
  	text-align: center;
  	font-weight: 100;
  }
  </style>