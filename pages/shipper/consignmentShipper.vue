<template>
	<view class="container">
		<!-- 头部信息栏 -->
		<view class="header-info">
			<view class="info-item">
				<text class="label">共</text>
				<text class="value">{{ totalCount }}个货主</text>
			</view>
			<view class="info-item">
				<text class="label">未付款合计：</text>
				<text class="value amount">{{ formatAmount(totalUnpaid) }}元</text>
			</view>
			<view class="search-box">
				<u-search 
					v-model="searchKeyword" 
					placeholder="搜货主..." 
					@search="handleSearch"
					@clear="handleSearch"
				></u-search>
			</view>
		</view>

		<!-- 货主列表 -->
		<scroll-view 
			class="shipper-list" 
			scroll-y 
			:style="{ height: scrollViewHeight + 'px' }"
			@scrolltolower="loadMore"
		>
			<view 
				v-for="(item, index) in shipperList" 
				:key="item.id"
				class="shipper-item"
				@click="viewShipperDetail(item)"
			>
				<view class="shipper-name">{{ item.shipperName }}</view>
				<view class="shipper-info">
					<text class="unpaid-label">未付款：</text>
					<text class="unpaid-amount">{{ formatAmount(item.unPaidMoney) }}</text>
				</view>
				<view class="arrow">
					<text class="detail-btn">详情</text>
					<uni-icons type="right" size="20" color="#00aa00"></uni-icons>
				</view>
			</view>

			<!-- 加载更多提示 -->
			<view class="load-more" v-if="shipperList.length > 0">
				<text v-if="loading">加载中...</text>
				<text v-else-if="!hasMore">没有更多数据了</text>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="shipperList.length === 0 && !loading">
				<text>暂无代销货主数据</text>
			</view>
		</scroll-view>
	
	<!-- 货主详情抽屉 -->
	<!-- 遮罩层 -->
	<view class="drawer-mask" :class="{ 'show': showDetailDrawer }" @click="closeDetailDrawer"></view>
	
	<!-- 抽屉主体 -->
	<view class="detail-drawer" :class="{ 'show': showDetailDrawer }">
		<!-- 加载中状态 -->
		<view v-if="detailLoading" class="loading-container">
			<u-loading mode="circle" size="30"></u-loading>
			<text class="loading-text">加载中...</text>
		</view>
		
		<!-- 详情内容 -->
		<view v-else class="drawer-content-wrapper">
			<!-- 抽屉头部 -->
			<view class="drawer-header">
				<view class="header-title">货主详情</view>
				<view class="close-btn" @click="closeDetailDrawer">
					<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
				</view>
			</view>
			
			<!-- 可滚动内容区域 -->
			<scroll-view class="drawer-scroll-content" scroll-y>
				<!-- 货主名称和标签 -->
				<view class="shipper-header">
					<text class="shipper-title">{{ detailData.shipperName || '-' }}</text>
					<view class="shipper-tag">代卖</view>
				</view>
				
			<!-- 全部批次统计 -->
	<view class="section" @click="goToAllBatchList">
		<view class="section-header">
			<view class="section-icon">
				<uni-icons type="list" size="14" color="#19be6b"></uni-icons>
			</view>
			<text class="section-title">全部批次</text>
			<uni-icons type="right" size="14" color="#999"></uni-icons>
		</view>
		<view class="stats-grid">
			<view class="stat-item">
				<text class="stat-label">总货款</text>
				<text class="stat-value">{{ formatAmount(detailData.totalGoodsMoney) }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">总费用</text>
				<text class="stat-value">{{ formatAmount(detailData.totalFee) }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">未结算货款</text>
				<text class="stat-value orange">{{ formatAmount(detailData.unSettleGoodsMoney) }}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">未结算费用</text>
				<text class="stat-value orange">{{ formatAmount(detailData.unSettleFee) }}</text>
			</view>
		</view>
	</view>
		
		<!-- 付款信息 -->
		<view class="section">
			<view class="section-header">
				<view class="section-icon">
					<uni-icons type="wallet" size="14" color="#19be6b"></uni-icons>
				</view>
				<text class="section-title">付款信息</text>
			</view>
			<view class="payment-info">
				<view class="payment-row">
					<text class="payment-label">已结算金额</text>
					<text class="payment-formula">*已结算金额=待付款+已付款-预付</text>
					<view class="share-btn" @click="handleShare">
						<text class="share-text">去分享</text>
						<uni-icons type="right" size="12" color="#19be6b"></uni-icons>
					</view>
				</view>
				<view class="payment-amount-box">
					<text class="payment-amount">{{ formatAmount(detailData.settledMoney) }}</text>
				</view>
			</view>
			
			<view class="payment-detail">
				<view class="payment-item">
					<text class="payment-item-label">待付款</text>
					<text class="payment-item-value pending">{{ formatAmount(detailData.unPaidMoney) }}</text>
					<view class="payment-action" @click="handlePay">
						<text class="action-text">去付款</text>
						<uni-icons type="right" size="12" color="#19be6b"></uni-icons>
					</view>
				</view>
				<view class="payment-item" @click="showPaidRecords">
					<text class="payment-item-label">已付款</text>
					<text class="payment-item-value">{{ formatAmount(detailData.paidMoney) }}</text>
					<view class="payment-action">
						<text class="action-text">查看记录</text>
						<uni-icons type="right" size="12" color="#19be6b"></uni-icons>
					</view>
				</view>
			</view>
		</view>
			</scroll-view>
		</view>
	</view>
	
	<!-- 付款记录弹窗 -->
	<view v-if="showPaidRecordModal" class="modal-mask" @click="closePaidRecordModal">
		<view class="modal-container" @click.stop>
			<view class="modal-header">
				<text class="modal-title">付款记录</text>
				<view class="close-icon" @click="closePaidRecordModal">
					<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
				</view>
			</view>
			
			<view class="modal-content">
				<!-- 加载中 -->
				<view v-if="recordLoading" class="record-loading">
					<u-loading mode="circle" size="30"></u-loading>
					<text class="loading-text">加载中...</text>
				</view>
				
				<!-- 付款记录列表 -->
				<scroll-view v-else scroll-y class="record-list">
					<view v-if="paidRecordList.length === 0" class="empty-record">
						<text>暂无付款记录</text>
					</view>
					
					<view 
						v-for="(record, index) in paidRecordList" 
						:key="record.id"
						:class="['record-item', { 'cancelled': record.status === 0 }]"
					>
						<!-- 删除按钮（仅显示正常记录的删除按钮） -->
						<view v-if="record.status === 1" class="delete-btn" @click.stop="deletePaidRecord(record)">
							<uni-icons type="trash" size="18" color="#ff4d4f"></uni-icons>
						</view>
						
						<!-- 已取消标志 -->
						<view v-if="record.status === 0" class="cancelled-badge">
							<text>已取消</text>
						</view>
						
						<view class="record-header">
							<text class="record-amount">{{ formatAmount(record.paidMoney) }}元</text>
							<text class="record-time">{{ formatDateTime(record.createTime) }}</text>
						</view>
						<view class="record-info">
							<view class="info-row">
								<text class="info-label">支付方式：</text>
								<text class="info-value">{{ getPayWayText(record.payWay) }}</text>
							</view>
							<view class="info-row" v-if="record.remark">
								<text class="info-label">备注：</text>
								<text class="info-value">{{ record.remark }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import shipperApi from '@/api/shipper/shipperApi.js';
	
	export default {
		name: 'consignmentShipper',
		data() {
			return {
				shipperList: [],
				searchKeyword: '',
				showFilter: false,
				loading: false,
				initialLoading: false,
				hasMore: true,
				currentPage: 1,
				pageSize: 20,
				totalCount: 0,
				totalUnpaid: 0,
				companyId: '',
				showDetailDrawer: false,
				detailLoading: false,
				detailData: {
					shipperName: '',
					totalGoodsMoney: 0,
					totalFee: 0,
					unSettleGoodsMoney: 0,
					unSettleFee: 0,
					settledMoney: 0,
					unPaidMoney: 0,
					paidMoney: 0
				},
				currentShipperId: '',
				scrollViewHeight: 0,
				showPaidRecordModal: false,
				recordLoading: false,
				paidRecordList: []
			}
		},
		mounted() {
			this.companyId = uni.getStorageSync('companyId') || '';
			this.calculateScrollViewHeight();
			this.loadData();
		},
		methods: {
			// 加载数据
		async loadData(isRefresh = false) {
			if (this.loading) return;
			
			console.log("loadData",this.companyId,this.pageSize,this.currentPage);

			if (isRefresh) {
				this.currentPage = 1;
				// 不要立即清空列表，等新数据加载完成后再替换
				// this.shipperList = [];
				this.hasMore = true;
			}
			
			// this.loading = true;
			if (this.currentPage === 1) {
				this.initialLoading = true;
			}
			
			try {
				const res = await shipperApi.getByCompanyIdAssistShipperManger(
					this.companyId,
					this.pageSize,
					this.currentPage
				);
				
				if (res.code === 200 && res.data) {
					const newList = res.data.shipperList || [];
					
					if (isRefresh) {
						// 刷新时直接替换整个列表，避免闪烁
						this.shipperList = newList;
					} else {
						this.shipperList = [...this.shipperList, ...newList];
					}
						
						this.totalCount = res.data.totalCount || 0;
						this.totalUnpaid = res.data.totalUnPaid || 0;
						
						// 判断是否还有更多数据
						this.hasMore = newList.length >= this.pageSize;
						
						if (this.hasMore) {
							this.currentPage++;
						}
					} else {
						uni.showToast({
							title: res.msg || '加载失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('加载货主数据失败:', error);
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
					this.initialLoading = false;
				}
			},
			
			// 加载更多
			loadMore() {
				if (this.hasMore && !this.loading) {
					this.loadData();
				}
			},
			
			// 搜索
			handleSearch() {
				this.loadData(true);
			},
			
			// 格式化金额
			formatAmount(amount) {
				if (!amount && amount !== 0) return '0';
				return Number(amount).toFixed(2);
			},
			
			// 查看货主详情
			async viewShipperDetail(item) {
				console.log('查看货主详情:', item);
				this.currentShipperId = item.id;
				this.showDetailDrawer = true;
				await this.loadShipperDetail();
			},
			
			// 加载货主详情
			async loadShipperDetail() {
				if (!this.currentShipperId) {
					uni.showToast({
						title: '货主ID不存在',
						icon: 'none'
					});
					return;
				}
				
				this.detailLoading = true;
				try {
					const res = await shipperApi.getAssistShipperMangerInfo(this.currentShipperId);
					
					if (res.code === 200 && res.data) {
						this.detailData = {
							shipperName: res.data.shipperName || '',
							totalGoodsMoney: res.data.totalAmount || 0,
							totalFee: res.data.totalCost || 0,
							unSettleGoodsMoney: res.data.unSettleAmount || 0,
							unSettleFee: res.data.unSettleCost || 0,
							settledMoney: res.data.settledMoney || 0,
							unPaidMoney: res.data.unPaidMoney || 0,
							paidMoney: res.data.paidMoney || 0
						};
					} else {
						uni.showToast({
							title: res.msg || '加载详情失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('加载货主详情失败:', error);
					uni.showToast({
						title: '加载详情失败，请重试',
						icon: 'none'
					});
				} finally {
					this.detailLoading = false;
				}
			},
			
			// 关闭详情抽屉
			closeDetailDrawer() {
				this.showDetailDrawer = false;
				this.currentShipperId = '';
			},
			
			// 分享
			handleShare() {
				uni.showToast({
					title: '分享功能开发中',
					icon: 'none'
				});
			},
			
		// 去付款
		handlePay() {
			if (!this.currentShipperId) {
				uni.showToast({
					title: '货主信息不存在',
					icon: 'none'
				});
				return;
			}
			
			// 跳转到未付款批次列表页面
			uni.navigateTo({
				url: `/pages/settlement/settlementList?shipperId=${this.currentShipperId}&shipperName=${encodeURIComponent(this.detailData.shipperName)}`
			});
		},
		
		// 查看全部批次
		goToAllBatchList() {
			if (!this.currentShipperId) {
				uni.showToast({
					title: '货主信息不存在',
					icon: 'none'
				});
				return;
			}
			
			// 跳转到全部批次列表页面
			uni.navigateTo({
				url: `/pages/shipper/batchList?shipperId=${this.currentShipperId}&shipperName=${encodeURIComponent(this.detailData.shipperName)}`
			});
		},
		
		// 显示付款记录
		async showPaidRecords() {
			if (!this.currentShipperId) {
				uni.showToast({
					title: '货主信息不存在',
					icon: 'none'
				});
				return;
			}
			
			this.showPaidRecordModal = true;
			await this.loadPaidRecords();
		},
		
		// 加载付款记录
		async loadPaidRecords() {
			this.recordLoading = true;
			try {
				const res = await shipperApi.getPaidRecordsByShipperId(this.currentShipperId);
				
				if (res.code === 200 && res.data) {
					// 显示所有记录，包括已取消的（status === 0）
					this.paidRecordList = res.data || [];
				} else {
					uni.showToast({
						title: res.msg || '加载付款记录失败',
						icon: 'none'
					});
					this.paidRecordList = [];
				}
			} catch (error) {
				console.error('加载付款记录失败:', error);
				uni.showToast({
					title: '加载付款记录失败，请重试',
					icon: 'none'
				});
				this.paidRecordList = [];
			} finally {
				this.recordLoading = false;
			}
		},
		
		// 关闭付款记录弹窗
		closePaidRecordModal() {
			this.showPaidRecordModal = false;
			this.paidRecordList = [];
		},
		
		// 删除付款记录
		deletePaidRecord(record) {
			uni.showModal({
				title: '确认取消',
				content: `确定要取消这条付款记录吗？\n付款金额：¥${record.paidMoney}\n付款时间：${this.formatDateTime(record.createTime)}`,
				confirmText: '取消',
				confirmColor: '#ff4d4f',
				success: (res) => {
					if (res.confirm) {
						this.executeDeletePaidRecord(record.id);
					}
				}
			});
		},
		
		// 执行删除付款记录
		async executeDeletePaidRecord(recordId) {
			uni.showLoading({
				title: '删除中...'
			});
			
			try {
				const res = await shipperApi.deleteShipperPaidRecord(recordId);
				uni.hideLoading();
				
				if (res.code === 200) {
					uni.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1500
					});
					
					// 重新加载付款记录列表
					await this.loadPaidRecords();
					
					// 重新加载货主详情数据以更新金额
					if (this.currentShipperId) {
						await this.loadShipperDetail(this.currentShipperId);
					}
					
					// 刷新货主列表
					this.loadData();
				} else {
					uni.showToast({
						title: res.msg || '删除失败',
						icon: 'none',
						duration: 2000
					});
				}
			} catch (error) {
				uni.hideLoading();
				console.error('删除付款记录失败:', error);
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none',
					duration: 2000
				});
			}
		},
		
		// 获取支付方式文本
		getPayWayText(payWay) {
			const payWayMap = {
				1: '微信',
				2: '支付宝',
				3: '现金',
				4: '其他'
			};
			return payWayMap[payWay] || '未知';
		},
		
		// 格式化日期时间
		formatDateTime(dateTime) {
			if (!dateTime) return '-';
			const date = new Date(dateTime);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
			
			// 计算滚动视图高度
			calculateScrollViewHeight() {
				const that = this;
				uni.getSystemInfo({
					success: (res) => {
						// 获取系统信息
						const systemInfo = res;
						const windowHeight = systemInfo.windowHeight;
						
						// 延迟获取头部高度，确保DOM已渲染
						this.$nextTick(() => {
							uni.createSelectorQuery().in(this).select('.header-info').boundingClientRect((rect) => {
								if (rect) {
									// 窗口高度 - tab栏高度(35rpx转px) - 头部高度
									const tabHeight = uni.upx2px(35); // 将rpx转换为px
									const headerHeight = rect.height;
									that.scrollViewHeight = windowHeight - tabHeight - headerHeight;
								} else {
									// 如果无法获取头部高度，使用默认值
									const tabHeight = uni.upx2px(35);
									const defaultHeaderHeight = uni.upx2px(80); // 默认头部高度
									that.scrollViewHeight = windowHeight - tabHeight - defaultHeaderHeight;
								}
							}).exec();
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: calc(100vh - 35rpx);
		background-color: #e8e8e8;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.header-info {
		display: flex;
		align-items: center;
		padding: 8rpx 15rpx;
		background-color: white;
		border-bottom: 1px solid #e5e5e5;
		flex-wrap: wrap;
		flex-shrink: 0;
		
		.info-item {
			display: flex;
			align-items: center;
			margin-right: 20rpx;
			
			.label {
				font-size: 20rpx;
				color: #666;
			}
			
			.value {
				font-size: 20rpx;
				font-weight: bold;
				color: #333;
				margin-left: 8rpx;
				
				&.amount {
					color: #ff6b00;
				}
			}
		}
		
		.search-box {
			flex: 1;
			min-width: 180rpx;
			margin-right: 15rpx;
		}
		
		.filter-btn {
			margin-left: auto;
		}
	}
	
	.shipper-list {
		padding: 8rpx 10rpx;
		
		.shipper-item {
			display: flex;
			align-items: center;
			background-color: white;
			padding: 12rpx 15rpx;
			margin-bottom: 4rpx;
			border-radius: 6rpx;
			border: 1px solid #f0f0f0;
			position: relative;
			
			&:active {
				background-color: #f8f8f8;
			}
			
			.shipper-name {
				flex: 1;
				font-size: 16rpx;
				font-weight: 500;
				color: #333;
			}
			
			.shipper-info {
				flex: 2;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				.unpaid-label {
					font-size: 16rpx;
					color: #999;
				}
				
				.unpaid-amount {
					font-size: 16rpx;
					font-weight: bold;
					color: #ff6b00;
					margin-left: 8rpx;
				}
			}
			
			.arrow {
				display: flex;
				align-items: center;
				
				.detail-btn {
					font-size: 16rpx;
					color: #00aa00;
					margin-right: 4rpx;
				}
			}
		}
		
		.load-more {
			text-align: center;
			padding: 15rpx;
			color: #999;
			font-size: 16rpx;
		}
		
		.empty-state {
			text-align: center;
			padding: 80rpx 20rpx;
			color: #999;
			font-size: 24rpx;
		}
	}
	
	// 遮罩层
	.drawer-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		pointer-events: none;
		
		&.show {
			opacity: 1;
			pointer-events: auto;
		}
	}
	
	// 详情抽屉样式
	.detail-drawer {
		position: fixed;
		top: 0;
		right: 0;
		width: 50%;
		height: 100vh;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		z-index: 1000;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: -2rpx 0 8rpx rgba(0, 0, 0, 0.15);
		will-change: transform;
		
		&.show {
			transform: translateX(0);
		}
		
		.loading-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100vh;
			
			.loading-text {
				margin-top: 16rpx;
				font-size: 12rpx;
				color: #999;
			}
		}
		
		.drawer-content-wrapper {
			display: flex;
			flex-direction: column;
			height: 100vh;
			overflow: hidden;
		}
		
		.drawer-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 12rpx 16rpx;
			background-color: white;
			border-bottom: 1rpx solid #e5e5e5;
			flex-shrink: 0;
			
			.header-title {
				font-size: 14rpx;
				font-weight: 600;
				color: #333;
			}
			
			.close-btn {
				padding: 4rpx;
				cursor: pointer;
			}
		}
		
		.drawer-scroll-content {
			flex: 1;
			height: calc(100vh - 50rpx);
			overflow-y: auto;
			padding-bottom: 20rpx;
		}
		
		.shipper-header {
			display: flex;
			align-items: center;
			padding: 12rpx 16rpx;
			background-color: white;
			margin-bottom: 8rpx;
			margin-top: 0;
			
			.shipper-title {
				font-size: 13rpx;
				font-weight: 600;
				color: #333;
				margin-right: 8rpx;
			}
			
			.shipper-tag {
				background-color: #19be6b;
				color: white;
				font-size: 10rpx;
				padding: 2rpx 6rpx;
				border-radius: 3rpx;
			}
			
			.more-actions {
				margin-left: auto;
				font-size: 11rpx;
				color: #19be6b;
			}
		}
		
		.section {
			background-color: white;
			margin-bottom: 8rpx;
			padding: 12rpx 16rpx;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			.section-header {
				display: flex;
				align-items: center;
				margin-bottom: 12rpx;
				
				.section-icon {
					margin-right: 4rpx;
				}
				
				.section-title {
					font-size: 12rpx;
					font-weight: 600;
					color: #333;
					flex: 1;
				}
			}
			
			.stats-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 12rpx;
				
				.stat-item {
					display: flex;
					flex-direction: column;
					
					.stat-label {
						font-size: 10rpx;
						color: #999;
						margin-bottom: 4rpx;
					}
					
					.stat-value {
						font-size: 13rpx;
						font-weight: 600;
						color: #333;
						
						&.orange {
							color: #ff6b00;
						}
					}
				}
			}
			
			.payment-info {
				margin-bottom: 10rpx;
				
				.payment-row {
					display: flex;
					align-items: center;
					margin-bottom: 8rpx;
					
					.payment-label {
						font-size: 11rpx;
						color: #333;
					}
					
					.payment-formula {
						font-size: 10rpx;
						color: #ff6b00;
						margin-left: 6rpx;
						flex: 1;
					}
					
					.share-btn {
						display: flex;
						align-items: center;
						
						.share-text {
							font-size: 11rpx;
							color: #19be6b;
							margin-right: 2rpx;
						}
					}
				}
				
				.payment-amount-box {
					background-color: #f8f8f8;
					padding: 10rpx;
					border-radius: 6rpx;
					text-align: center;
					
					.payment-amount {
						font-size: 20rpx;
						font-weight: 600;
						color: #333;
					}
				}
			}
			
			.payment-detail {
				.payment-item {
					display: flex;
					align-items: center;
					padding: 10rpx 0;
					border-top: 1rpx solid #f0f0f0;
					
					.payment-item-label {
						font-size: 11rpx;
						color: #666;
						flex: 1;
					}
					
					.payment-item-value {
						font-size: 13rpx;
						font-weight: 600;
						color: #333;
						margin-right: 8rpx;
						
						&.pending {
							color: #ff6b00;
						}
					}
					
					.payment-action {
						display: flex;
						align-items: center;
						
						.action-text {
							font-size: 11rpx;
							color: #19be6b;
							margin-right: 2rpx;
						}
					}
				}
			}
		}
	}
	
	// 付款记录弹窗样式
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
	
	.modal-container {
		width: 80%;
		max-height: 70vh;
		background-color: white;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 20rpx;
		border-bottom: 1rpx solid #e5e5e5;
		
		.modal-title {
			font-size: 16rpx;
			font-weight: 600;
			color: #333;
		}
		
		.close-icon {
			padding: 4rpx;
			cursor: pointer;
		}
	}
	
	.modal-content {
		flex: 1;
		overflow: hidden;
		
		.record-loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 60rpx 20rpx;
			
			.loading-text {
				margin-top: 16rpx;
				font-size: 12rpx;
				color: #999;
			}
		}
		
		.record-list {
			max-height: 60vh;
			padding: 10rpx;
			
			.empty-record {
				text-align: center;
				padding: 60rpx 20rpx;
				color: #999;
				font-size: 12rpx;
			}
			
			.record-item {
				background-color: #f8f8f8;
				border-radius: 8rpx;
				padding: 12rpx;
				margin-bottom: 10rpx;
				position: relative;
				transition: all 0.3s ease;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				&.cancelled {
					background-color: #f5f5f5;
					opacity: 0.7;
					
					.record-amount {
						color: #999 !important;
						text-decoration: line-through;
					}
					
					.record-time,
					.info-label,
					.info-value {
						color: #999 !important;
					}
				}
				
				.delete-btn {
					position: absolute;
					bottom: 8rpx;
					right: 8rpx;
					width: 32rpx;
					height: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: rgba(255, 77, 79, 0.1);
					border-radius: 50%;
					opacity: 0.6;
					transition: all 0.3s ease;
					z-index: 10;
					
					&:hover {
						opacity: 1;
						background-color: rgba(255, 77, 79, 0.15);
						transform: scale(1.1);
					}
					
					&:active {
						transform: scale(0.95);
					}
				}
				
				.cancelled-badge {
					position: absolute;
					bottom: 8rpx;
					right: 8rpx;
					padding: 4rpx 12rpx;
					background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
					border-radius: 20rpx;
					z-index: 10;
					
					text {
						font-size: 10rpx;
						color: #fff;
						font-weight: 600;
					}
				}
				
				.record-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8rpx;
					
					.record-amount {
						font-size: 15rpx;
						font-weight: 600;
						color: #19be6b;
					}
					
					.record-time {
						font-size: 10rpx;
						color: #999;
					}
				}
				
				.record-info {
					.info-row {
						display: flex;
						align-items: flex-start;
						margin-bottom: 4rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.info-label {
							font-size: 11rpx;
							color: #666;
							flex-shrink: 0;
						}
						
						.info-value {
							font-size: 11rpx;
							color: #333;
							flex: 1;
						}
					}
				}
			}
		}
	}
</style>

