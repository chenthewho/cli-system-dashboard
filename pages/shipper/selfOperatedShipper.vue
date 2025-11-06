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
					<text class="unpaid-amount">{{ formatAmount(item.unSettleMoney) }}</text>
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
				<text>暂无自营货主数据</text>
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
					<view class="shipper-tag self">自营</view>
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
								<!-- <text class="share-text">去分享</text>
								<uni-icons type="right" size="12" color="#19be6b"></uni-icons> -->
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
						<view class="payment-item">
							<text class="payment-item-label">已付款</text>
							<text class="payment-item-value">{{ formatAmount(detailData.paidMoney) }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
	</view>
</template>

<script>
	import shipperApi from '@/api/shipper/shipperApi.js';
	
	export default {
		name: 'selfOperatedShipper',
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
					settledMoney: 0,
					unPaidMoney: 0,
					paidMoney: 0
				},
				currentShipperId: '',
				scrollViewHeight: 0
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
			
			if (isRefresh) {
				this.currentPage = 1;
				// 不要立即清空列表，等新数据加载完成后再替换
				// this.shipperList = [];
				this.hasMore = true;
			}
			
			this.loading = true;
			if (this.currentPage === 1) {
				this.initialLoading = true;
			}
			
			try {
				const res = await shipperApi.getByCompanyIdEmployShipperManger(
					this.companyId,
					this.pageSize,
					this.currentPage
				);
				
				if (res.code === 200 && res.data) {
					const newList = res.data.purchaseShipperList || [];
					
					if (isRefresh) {
						// 刷新时直接替换整个列表，避免闪烁
						this.shipperList = newList;
					} else {
						this.shipperList = [...this.shipperList, ...newList];
					}
						
						this.totalCount = res.data.totalCount || 0;
						this.totalUnpaid = res.data.totalUnpaid || 0;
						
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
					const res = await shipperApi.getEmployShipperMangerInfo(this.currentShipperId);
					
					if (res.code === 200 && res.data) {
						this.detailData = {
							shipperName: res.data.shipperName || '',
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
				uni.showToast({
					title: '付款功能开发中',
					icon: 'none'
				});
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
				color: white;
				font-size: 10rpx;
				padding: 2rpx 6rpx;
				border-radius: 3rpx;
				
				&.self {
					background-color: #ff9800;
				}
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
</style>


