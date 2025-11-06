<template>
	<view class="container">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="header-back" @click="goBack">
				<uni-icons type="left" size="20" color="#333"></uni-icons>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">{{ shipperName }} - 全部批次</view>
		</view>

		<!-- 筛选区域 -->
		<view class="filter-section">
			<view class="date-picker-item" @click="showCreateTimePicker = true">
				<uni-icons type="calendar" size="16" color="#999"></uni-icons>
				<text class="picker-text">{{ createTimeRange || '创建时间' }}</text>
			</view>
			<view class="date-picker-item" @click="showSettleTimePicker = true">
				<uni-icons type="calendar" size="16" color="#999"></uni-icons>
				<text class="picker-text">{{ settleTimeRange || '结算时间' }}</text>
			</view>
		</view>

		<!-- 批次列表 -->
		<scroll-view class="batch-list" scroll-y :style="{ height: scrollViewHeight + 'px' }">
			<view v-for="item in batchList" :key="item.id" 
				class="batch-item" @click="goToBatchDetail(item)">
				
				<!-- 批次信息 -->
				<view class="batch-content">
					<!-- 批次号和时间 -->
					<view class="batch-header">
						<text class="batch-code">批次{{ item.batchCode }}</text>
						<text class="batch-time">创建{{ item.createTime }}</text>
					</view>
					<view class="batch-settle-time">
						<text>{{ item.settleTime ? '结算' + item.settleTime : '未结算' }}</text>
					</view>
				</view>
				
				<!-- 右侧财务信息 -->
				<view class="batch-finance">
					<view class="finance-col">
						<text class="finance-label">货款</text>
						<text class="finance-value">{{ formatAmount(item.totalMoney) }}</text>
					</view>
					<view class="finance-col">
						<text class="finance-label">费用</text>
						<text class="finance-value danger">-{{ formatAmount(item.totalFee) }}</text>
					</view>
					<view class="finance-col">
						<text class="finance-label">应付</text>
						<text class="finance-value">{{ formatAmount(item.shouldPay) }}</text>
					</view>
					<view class="finance-col">
						<text class="finance-label">已付</text>
						<text class="finance-value success">{{ formatAmount(item.paidMoney) }}</text>
					</view>
					<view class="finance-col">
						<text class="finance-label">未付</text>
						<text class="finance-value unpaid">{{ formatAmount(item.unpaidMoney) }}</text>
					</view>
				</view>
				
				<!-- 右侧箭头 -->
				<view class="batch-arrow">
					<uni-icons type="right" size="20" color="#ccc"></uni-icons>
				</view>
			</view>

			<!-- 加载中 -->
			<view v-if="loading" class="load-more">
				<text>加载中...</text>
			</view>
			
			<!-- 空状态 -->
			<view v-else-if="batchList.length === 0" class="empty-state">
				<text>暂无批次记录</text>
			</view>
		</scroll-view>

		<!-- 创建时间选择器 -->
		<uni-datetime-picker
			v-if="showCreateTimePicker"
			v-model="createTimeRange"
			type="daterange"
			@confirm="onCreateTimeChange"
			@cancel="showCreateTimePicker = false"
		/>
		
		<!-- 结算时间选择器 -->
		<uni-datetime-picker
			v-if="showSettleTimePicker"
			v-model="settleTimeRange"
			type="daterange"
			@confirm="onSettleTimeChange"
			@cancel="showSettleTimePicker = false"
		/>
	</view>
</template>

<script>
import batchApi from '@/api/batch/batch.js';

export default {
	name: 'batchList',
	data() {
		return {
			shipperId: '',
			shipperName: '',
			batchList: [],
			loading: false,
			scrollViewHeight: 0,
			
			// 时间筛选
			showCreateTimePicker: false,
			showSettleTimePicker: false,
			createTimeRange: '',
			settleTimeRange: '',
			
			// 原始数据
			originalBatchList: []
		};
	},
	
	onLoad(options) {
		// 获取货主信息
		if (options.shipperId) {
			this.shipperId = options.shipperId;
		}
		if (options.shipperName) {
			this.shipperName = decodeURIComponent(options.shipperName);
		}
		
		// 计算滚动区域高度
		this.calculateScrollHeight();
		
		// 加载数据
		this.loadData();
	},
	
	methods: {
		// 计算滚动区域高度
		calculateScrollHeight() {
			const windowInfo = uni.getWindowInfo();
			const windowHeight = windowInfo.windowHeight;
			// 头部60px + 筛选区域50px + 底部安全区域
			this.scrollViewHeight = windowHeight - 60 - 50 - 20;
		},
		
		// 加载批次数据
		async loadData() {
			if (!this.shipperId) {
				uni.showToast({
					title: '货主信息缺失',
					icon: 'none'
				});
				return;
			}
			
			this.loading = true;
			
			try {
				const res = await batchApi.GetByShipper(this.shipperId);
				
				if (res.code === 200 && res.data) {
					this.originalBatchList = this.processBatchData(res.data);
					this.applyFilters();
				} else {
					uni.showToast({
						title: res.msg || '加载失败',
						icon: 'none'
					});
					this.batchList = [];
				}
			} catch (error) {
				console.error('加载批次数据失败:', error);
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				});
				this.batchList = [];
			} finally {
				this.loading = false;
			}
		},
		
		// 处理批次数据
		processBatchData(data) {
			if (!Array.isArray(data)) {
				data = [data];
			}
			
			return data.map(item => {
				const totalFee = item.assistAmount || 0;
				const shouldPay = item.settleAmount || 0;
				
				return {
					id: item.id,
					batchCode: item.batchCode || '',
					createTime: this.formatTime(item.createTime),
					settleTime: this.formatTime(item.updateTime),
					shipperName: item.shipperName || '',
					shipperId: item.shipperId || this.shipperId,
					totalMoney: item.settleGoodMoney || item.settleAmount || 0,
					totalFee: totalFee,
					shouldPay: shouldPay,
					paidMoney: item.paidAmount || 0,
					unpaidMoney: item.unPaidAmount || 0
				};
			});
		},
		
		// 应用筛选条件
		applyFilters() {
			let filteredList = [...this.originalBatchList];
			
			// 创建时间筛选
			if (this.createTimeRange) {
				const [startStr, endStr] = this.createTimeRange;
				const startTime = new Date(startStr).getTime();
				const endTime = new Date(endStr).getTime() + 24 * 60 * 60 * 1000; // 包含结束当天
				
				filteredList = filteredList.filter(item => {
					const itemTime = new Date(item.createTime).getTime();
					return itemTime >= startTime && itemTime < endTime;
				});
			}
			
			// 结算时间筛选
			if (this.settleTimeRange) {
				const [startStr, endStr] = this.settleTimeRange;
				const startTime = new Date(startStr).getTime();
				const endTime = new Date(endStr).getTime() + 24 * 60 * 60 * 1000;
				
				filteredList = filteredList.filter(item => {
					if (!item.settleTime) return false;
					const itemTime = new Date(item.settleTime).getTime();
					return itemTime >= startTime && itemTime < endTime;
				});
			}
			
			// 按创建时间倒序排序（最新的在前面）
			filteredList.sort((a, b) => {
				const timeA = new Date(a.createTime).getTime();
				const timeB = new Date(b.createTime).getTime();
				return timeB - timeA;
			});
			
			this.batchList = filteredList;
		},
		
		// 创建时间改变
		onCreateTimeChange(e) {
			this.createTimeRange = e;
			this.showCreateTimePicker = false;
			this.applyFilters();
		},
		
		// 结算时间改变
		onSettleTimeChange(e) {
			this.settleTimeRange = e;
			this.showSettleTimePicker = false;
			this.applyFilters();
		},
		
		// 格式化时间
		formatTime(timeStr) {
			if (!timeStr) return '';
			const date = new Date(timeStr);
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${month}-${day} ${hours}:${minutes}`;
		},
		
		// 格式化金额
		formatAmount(amount) {
			if (amount === null || amount === undefined) return '0.00';
			return parseFloat(amount).toFixed(2);
		},
		
		// 跳转到批次详情
		goToBatchDetail(item) {
			uni.navigateTo({
				url: `/pages/settlement/batchSettlementDetail?batchId=${item.id}&batchCode=${encodeURIComponent(item.batchCode)}&shipperName=${encodeURIComponent(item.shipperName || this.shipperName)}&shipperId=${item.shipperId}`
			});
		},
		
		// 返回
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
}

/* 头部 */
.header {
	display: flex;
	align-items: center;
	height: 60px;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	padding: 0 15px;
	position: relative;
}

.header-back {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 5px;
}

.back-text {
	margin-left: 5px;
	font-size: 16px;
	color: #333;
}

.header-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	font-size: 18px;
	font-weight: 600;
	color: #333;
}

/* 筛选区域 */
.filter-section {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 10px 15px;
	background-color: #fff;
	border-bottom: 1px solid #e5e5e5;
	gap: 10px;
}

.date-picker-item {
	display: flex;
	align-items: center;
	padding: 8px 12px;
	background-color: #f8f9fa;
	border-radius: 6px;
	border: 1px solid #e5e5e5;
	cursor: pointer;
	gap: 6px;
}

.picker-text {
	font-size: 14px;
	color: #666;
}

/* 批次列表 */
.batch-list {
	flex: 1;
	padding: 10px;
}

.batch-item {
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	cursor: pointer;
	transition: all 0.3s;
}

.batch-item:active {
	transform: scale(0.98);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.batch-content {
	flex: 1;
	min-width: 0;
}

.batch-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 6px;
}

.batch-code {
	font-size: 20rpx;
	font-weight: 600;
	color: #333;
}

.batch-time {
	font-size: 14rpx;
	color: #999;
}

.batch-settle-time {
	font-size: 14rpx;
	color: #666;
}

/* 财务信息 */
.batch-finance {
	display: flex;
	gap: 12px;
	margin-left: 15px;
}

.finance-col {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 50px;
}

.finance-label {
	font-size: 14rpx;
	color: #999;
	margin-bottom: 4px;
}

.finance-value {
	font-size: 16rpx;
	font-weight: 600;
	color: #333;
}

.finance-value.success {
	color: #52c41a;
}

.finance-value.danger {
	color: #f5222d;
}

.finance-value.unpaid {
	color: #ff9800;
}

/* 箭头 */
.batch-arrow {
	margin-left: 10px;
}

/* 加载和空状态 */
.load-more,
.empty-state {
	padding: 30px;
	text-align: center;
	color: #999;
	font-size: 14px;
}
</style>

