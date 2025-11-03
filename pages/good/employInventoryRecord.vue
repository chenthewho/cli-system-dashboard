<template>
	<view class="container">
		<!-- 顶部栏 -->
		<view class="top-bar">
			<!-- 返回按钮和标题 -->
			<view class="title-bar">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">返回</text>
				</view>
				<text class="page-title">{{ goodsName }}</text>
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
				<button class="search-btn" @click="searchRecords">查询</button>
				<button class="reset-btn" @click="resetSearch">重置</button>
			</view>
		</view>
		</view>

		<!-- 表格容器 -->
		<view class="table-container">
			<!-- 表头 -->
			<view class="table-header">
				<view class="table-cell header-cell" style="flex: 1.2;">操作时间</view>
				<view class="table-cell header-cell" style="flex: 0.7;">操作者</view>
				<view class="table-cell header-cell" style="flex: 0.7;">操作类型</view>
				<view class="table-cell header-cell" style="flex: 0.6;">操作数量</view>
				<view class="table-cell header-cell" style="flex: 0.6;">操作前</view>
				<view class="table-cell header-cell last-cell" style="flex: 0.6;">操作后</view>
			</view>

			<!-- 表格内容 -->
			<scroll-view scroll-y class="table-body" :style="{ height: scrollHeight + 'px' }">
				<view v-if="recordList.length > 0">
					<view class="table-row" v-for="(item, index) in recordList" :key="item.id">
						<view class="table-cell" style="flex: 1.2;">
							{{ formatDateTime(item.createTime) }}
						</view>
						<view class="table-cell" style="flex: 0.7;">
							{{ item.operatorName || '-' }}
						</view>
						<view class="table-cell" style="flex: 0.7;">
							<text :class="['type-tag', getRecordTypeClass(item.recordType)]">
								{{ getRecordTypeName(item.recordType) }}
							</text>
						</view>
						<view class="table-cell" style="flex: 0.6;">
							{{ item.operaMount }}
						</view>
						<view class="table-cell" style="flex: 0.6;">
							{{ item.operaBeforeMount }}
						</view>
						<view class="table-cell last-cell" style="flex: 0.6;">
							{{ item.operaAfterMount }}
						</view>
					</view>
				</view>
				<view v-else class="empty-state">
					<text class="empty-icon">📋</text>
					<text class="empty-text">暂无操作记录</text>
				</view>

				<!-- 加载更多 -->
				<view v-if="hasMore" class="load-more" @click="loadMore">
					<text>{{ loading ? '加载中...' : '点击加载更多' }}</text>
				</view>
				<view v-else-if="recordList.length > 0" class="no-more">
					<text>没有更多了</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import operaRecordApi from '@/api/operaRecord/operaRecord.js'

export default {
	data() {
		return {
			commodityId: '',
			goodsName: '',
			searchForm: {
				startTime: '',
				endTime: ''
			},
			recordList: [],
			pageIndex: 1,
			pageSize: 20,
			hasMore: true,
			loading: false,
			scrollHeight: 0,
			windowHeight: 0,
			// 记录类型映射
			recordTypeMap: {
				0: '创建订单',
				1: '修改入库单',
				2: '采购入库',
				3: '报损',
				4: '盘点',
			}
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
		
		this.loadRecords()
	},
	methods: {
		// 返回
		goBack() {
			uni.navigateBack()
		},
		// 加载记录
		async loadRecords(reset = false) {
			if (this.loading) return
			
			if (reset) {
				this.pageIndex = 1
				this.recordList = []
				this.hasMore = true
			}
			
			this.loading = true
			
			try {
				const res = await operaRecordApi.GetEmployOperaRecord(
					this.commodityId,
					this.searchForm.startTime,
					this.searchForm.endTime,
					this.pageIndex,
					this.pageSize
				)
				
				if (res.code==200) {
					const data = res.data
					if (data && data.data) {
						if (reset) {
							this.recordList = data.data
						} else {
							this.recordList = [...this.recordList, ...data.data]
						}
						
						// 判断是否还有更多数据
						this.hasMore = this.recordList.length < data.totalCount
					}
				} else {
					uni.showToast({
						title: res.message || '加载失败',
						icon: 'none'
					})
				}
			} catch (error) {
				console.error('加载操作记录失败：', error)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.loading = false
			}
		},
		
		// 搜索
		searchRecords() {
			this.loadRecords(true)
		},
		
		// 重置搜索
		resetSearch() {
			this.searchForm.startTime = ''
			this.searchForm.endTime = ''
			this.loadRecords(true)
		},
		
		// 加载更多
		loadMore() {
			if (this.hasMore && !this.loading) {
				this.pageIndex++
				this.loadRecords()
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
			const date = new Date(dateTime)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			const seconds = String(date.getSeconds()).padStart(2, '0')
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		},
		
		// 获取记录类型名称
		getRecordTypeName(type) {
			return this.recordTypeMap[type] || '未知'
		},
		
		// 获取记录类型样式类
		getRecordTypeClass(type) {
			const classMap = {
				0: 'type-adjust',  // 创建订单（蓝色）
				1: 'type-out',     // 修改入库单（红色）
				2: 'type-in',      // 采购入库（绿色）
				3: 'type-loss',    // 报损（橙色）
				4: 'type-loss',    // 盘点（橙色）
			}
			return classMap[type] || 'type-default'
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

/* 类型标签 */
.type-tag {
	padding: 2rpx 8rpx;
	border-radius: 4rpx;
	font-size: 11rpx;
	display: inline-block;
	font-weight: 500;
}

.type-in {
	background-color: #e8f5e9;
	color: #4caf50;
}

.type-out {
	background-color: #ffebee;
	color: #f44336;
}

.type-loss {
	background-color: #fff3e0;
	color: #ff9800;
}

.type-adjust {
	background-color: #e3f2fd;
	color: #2196f3;
}

.type-default {
	background-color: #f5f5f5;
	color: #999;
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

