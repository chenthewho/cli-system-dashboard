<template>
	<view class="container">
		<!-- 顶部栏 -->
		<view class="top-bar">
			<!-- 返回按钮和标题 -->
			<view class="title-bar">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">返回</text>
				</view>
				<text class="page-title">{{ goodsName }} - 关联订单</text>
			</view>
			
			<!-- 搜索栏 -->
			<view class="search-bar">
				<view class="search-item">
					<text class="label">开始：</text>
					<view class="datetime-picker-wrapper">
						<uni-datetime-picker 
							v-model="searchForm.startTime" 
							type="datetime"
							:clear-icon="true"
							@change="onStartTimeChange"
						/>
					</view>
				</view>
				<view class="search-item">
					<text class="label">结束：</text>
					<view class="datetime-picker-wrapper">
						<uni-datetime-picker 
							v-model="searchForm.endTime" 
							type="datetime"
							:clear-icon="true"
							@change="onEndTimeChange"
						/>
					</view>
				</view>
				<view style="display: flex;">
					<button class="search-btn" @click="searchOrders">查询</button>
					<button class="reset-btn" @click="resetSearch">重置</button>
				</view>
			</view>
		</view>

		<!-- 表格容器 -->
		<view class="table-container">
			<!-- 表头 -->
			<view class="table-header">
				<view class="table-cell header-cell" style="flex: 1.5;">创建时间</view>
				<view class="table-cell header-cell" style="flex: 1;">客户名称</view>
				<view class="table-cell header-cell" style="flex: 0.8;">应收金额</view>
				<view class="table-cell header-cell" style="flex: 0.8;">实收金额</view>
				<view class="table-cell header-cell" style="flex: 0.8;">利润</view>
				<view class="table-cell header-cell last-cell" style="flex: 0.8;">支付方式</view>
			</view>

			<!-- 表格内容 -->
			<scroll-view scroll-y class="table-body" :style="{ height: scrollHeight + 'px' }">
				<view v-if="orderList.length > 0">
					<view class="table-row" v-for="(item, index) in orderList" :key="item.id" @click="goToOrderDetail(item)">
						<view class="table-cell" style="flex: 1.5;">
							{{ formatDateTime(item.createTime) }}
						</view>
						<view class="table-cell" style="flex: 1;">
							{{ item.customName || '无' }}
						</view>
						<view class="table-cell" style="flex: 0.8;">
							¥{{ item.payableAmount }}
						</view>
						<view class="table-cell" style="flex: 0.8;">
							¥{{ item.actualMoney }}
						</view>
						<view class="table-cell" style="flex: 0.8;">
							<text :class="['profit-tag', item.totalProfit >= 0 ? 'profit-positive' : 'profit-negative']">
								¥{{ formatProfit(item.totalProfit) }}
							</text>
						</view>
						<view class="table-cell last-cell" style="flex: 0.8;">
							<text class="payway-tag">{{ billPaywayText(item.payway) }}</text>
						</view>
					</view>
				</view>
				<view v-else class="empty-state">
					<text class="empty-icon">📋</text>
					<text class="empty-text">暂无关联订单</text>
				</view>

				<!-- 加载更多 -->
				<view v-if="hasMore" class="load-more" @click="loadMore">
					<text>{{ loading ? '加载中...' : '点击加载更多' }}</text>
				</view>
				<view v-else-if="orderList.length > 0" class="no-more">
					<text>没有更多了</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import purchase from '../../api/purchase/purchase.js'

export default {
	data() {
		return {
			commodityId: '',
			goodsName: '',
			searchForm: {
				startTime: '',
				endTime: ''
			},
			orderList: [],
			pageIndex: 1,
			pageSize: 20,
			hasMore: true,
			loading: false,
			scrollHeight: 0,
			windowHeight: 0
		}
	},
	onLoad(options) {
		if (options.commodityId) {
			this.commodityId = options.commodityId
		}
		if (options.goodsName) {
			this.goodsName = decodeURIComponent(options.goodsName)
		}
		
		// 获取窗口高度
		const systemInfo = uni.getSystemInfoSync()
		this.windowHeight = systemInfo.windowHeight
		// 计算滚动区域高度：窗口高度 - 顶部栏(90) - 表头(40) - 边距(20)
		this.scrollHeight = this.windowHeight - 150
		
		this.loadOrders()
	},
	methods: {
		// 返回
		goBack() {
			uni.navigateBack()
		},
		// 加载订单
		async loadOrders(reset = false) {
			if (this.loading) return
			
			if (reset) {
				this.pageIndex = 1
				this.orderList = []
				this.hasMore = true
			}
			
			this.loading = true
			
			try {
				const res = await purchase.getPurchaseCommodityProfit(this.commodityId)
				
				if (res.code === 200) {
					const data = res.data
					if (data && data.allPrintModules) {
						let filteredOrders = data.allPrintModules
						
						// 时间过滤
						if (this.searchForm.startTime || this.searchForm.endTime) {
							filteredOrders = filteredOrders.filter(order => {
								const orderTime = new Date(order.createTime).getTime()
								const startTime = this.searchForm.startTime ? new Date(this.searchForm.startTime).getTime() : 0
								const endTime = this.searchForm.endTime ? new Date(this.searchForm.endTime).getTime() : Infinity
								return orderTime >= startTime && orderTime <= endTime
							})
						}
						
						// 分页处理
						const start = (this.pageIndex - 1) * this.pageSize
						const end = start + this.pageSize
						const pageData = filteredOrders.slice(start, end)
						
						if (reset) {
							this.orderList = pageData
						} else {
							this.orderList = [...this.orderList, ...pageData]
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.orderList.length < filteredOrders.length
					}
				} else {
					uni.showToast({
						title: res.message || '加载失败',
						icon: 'none'
					})
				}
			} catch (error) {
				console.error('加载关联订单失败：', error)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		// 搜索
		searchOrders() {
			this.loadOrders(true)
		},
		
		// 重置搜索
		resetSearch() {
			this.searchForm.startTime = ''
			this.searchForm.endTime = ''
			this.loadOrders(true)
		},
		
		// 加载更多
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.pageIndex++
				this.loadOrders()
			}
		},
		
		// 开始时间变化
		onStartTimeChange(e) {
			this.searchForm.startTime = e
		},
		
		// 结束时间变化
		onEndTimeChange(e) {
			this.searchForm.endTime = e
		},
		
		// 格式化日期时间
		formatDateTime(dateTime) {
			if (!dateTime) return '-'
			return dateTime.replace('T', ' ')
		},
		
		// 格式化利润
		formatProfit(val) {
			if (val === null || val === undefined || isNaN(val)) return '0.00'
			return Number(val).toFixed(2)
		},
		
		// 支付方式文本
		billPaywayText(val) {
			if(val===1) return '现金'
			if(val===2) return '微信'
			if(val===3) return '支付宝'
			if(val===4) return '银行卡'
			return '其他'
		},
		
		// 跳转到订单详情
		goToOrderDetail(order) {
			uni.navigateTo({
				url: `/pages/order/order?billId=${order.id}`
			})
		}
	}
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100vh;
	background-color: #f8f9fa;
	display: flex;
	flex-direction: column;
}

/* 顶部栏 */
.top-bar {
	background-color: #ffffff;
	padding: 8rpx 10rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	flex-shrink: 0;
}

/* 标题栏 */
.title-bar {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.back-btn {
	width: 50rpx;
	height: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
	border-radius: 6rpx;
	margin-right: 10rpx;
	cursor: pointer;
	transition: background-color 0.2s;
}

.back-btn:active {
	background-color: #e0e0e0;
}

.back-icon {
	font-size: 15rpx;
	font-weight: bold;
	color: #333;
}

.page-title {
	font-size: 16rpx;
	font-weight: 600;
	color: #333;
	flex: 1;
}

/* 搜索栏 */
.search-bar {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	gap: 12rpx;
}

.search-item {
	display: flex;
	align-items: center;
}

.label {
	font-size: 12rpx;
	color: #666;
	margin-right: 6rpx;
	white-space: nowrap;
}

.datetime-picker-wrapper {
	width: 100rpx;
}

.search-btn {
	height: 26rpx;
	line-height: 26rpx;
	padding: 0 18rpx;
	background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
	color: #ffffff;
	border: none;
	border-radius: 6rpx;
	font-size: 12rpx;
	font-weight: 500;
	margin-left: 4rpx;
}

.reset-btn {
	height: 26rpx;
	line-height: 26rpx;
	padding: 0 18rpx;
	background-color: #f0f0f0;
	color: #666;
	border: none;
	margin-left: 20rpx;
	border-radius: 6rpx;
	font-size: 12rpx;
	font-weight: 500;
}

/* 表格容器 */
.table-container {
	flex: 1;
	margin: 5rpx 5rpx 5rpx 5rpx;
	border-radius: 8rpx 8rpx 0 0;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
}

/* 表头 */
.table-header {
	display: flex;
	background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
	border-bottom: 2rpx solid #90caf9;
	flex-shrink: 0;
}

.header-cell {
	padding: 8rpx 8rpx;
	font-weight: 600;
	color: #1976d2;
	font-size: 13rpx;
	border-right: 1rpx solid #90caf9;
}

.header-cell.last-cell {
	border-right: none;
}

/* 表格内容 */
.table-body {
	flex: 1;
	overflow-y: auto;
}

.table-row {
	display: flex;
	background-color: #ffffff;
	border-bottom: 1rpx solid #f1f3f5;
	transition: background-color 0.2s ease;
	margin: 0 5rpx;
	border-left: 1rpx solid #f1f3f5;
	border-right: 1rpx solid #f1f3f5;
	cursor: pointer;
}

.table-row:hover {
	background-color: #f8f9fa;
}

.table-cell {
	padding: 12rpx 10rpx;
	text-align: center;
	font-size: 13rpx;
	color: #333;
	border-right: 1rpx solid #e9ecef;
	word-break: break-all;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 500;
}

.table-cell.last-cell {
	border-right: none;
}

/* 利润标签 */
.profit-tag {
	padding: 2rpx 8rpx;
	border-radius: 6rpx;
	font-size: 12rpx;
	font-weight: 600;
}

.profit-positive {
	background-color: #e8f5e9;
	color: #43a047;
}

.profit-negative {
	background-color: #ffebee;
	color: #e53935;
}

/* 支付方式标签 */
.payway-tag {
	padding: 2rpx 8rpx;
	border-radius: 6rpx;
	font-size: 11rpx;
	background-color: #e3f2fd;
	color: #1976d2;
	font-weight: 500;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
}

.empty-icon {
	font-size: 60rpx;
	margin-bottom: 10rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 13rpx;
	color: #999;
}

/* 加载更多 */
.load-more {
	text-align: center;
	padding: 20rpx;
	color: #1976d2;
	font-size: 12rpx;
	cursor: pointer;
}

.no-more {
	text-align: center;
	padding: 20rpx;
	color: #999;
	font-size: 11rpx;
}
</style>

