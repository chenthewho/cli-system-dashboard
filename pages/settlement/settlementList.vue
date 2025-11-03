<template>
	<view class="container">
		<!-- 头部导航栏 -->
		<view class="header">
			<view class="header-back" @click="goBack">
				<uni-icons type="left" size="20" color="#333"></uni-icons>
				<text class="back-text">返回</text>
			</view>
			<view class="header-title">结算单列表</view>
		</view>

		<!-- 筛选区域 -->
		<view class="filter-section">

			<view class="select-all-row" @click="toggleSelectAll">
				<view class="select-icon">
					<uni-icons :type="allSelected ? 'checkbox-filled' : 'circle'" 
						:color="allSelected ? '#1890ff' : '#ccc'" size="30"></uni-icons>
				</view>
				<text class="select-text">全选</text>
			</view>
            <view class="date-picker-item date-picker-right" @click="showCreateTimePicker = true">
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
			<view v-for="(item, index) in batchList" :key="item.id" 
				class="batch-item" :class="{ 'selected': item.selected }" @click="goToBatchDetail(item)">
				<!-- 左侧选择框 -->
				<view class="batch-checkbox" @click.stop="toggleBatchSelect(index)">
					<uni-icons :type="item.selected ? 'checkbox-filled' : 'circle'" 
						:color="item.selected ? '#1890ff' : '#ccc'" size="30"></uni-icons>
				</view>
				
				<!-- 批次信息 -->
				<view class="batch-content">
					<!-- 批次号和时间 -->
					<view class="batch-header">
						<text class="batch-code">批次{{ item.batchCode }}</text>
						<text class="batch-time">创建{{ item.createTime }}</text>
					</view>
					<view class="batch-settle-time">
						<text>结算{{ item.settleTime }}</text>
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
				<text>暂无未付款结算单</text>
			</view>
		</scroll-view>

		<!-- 底部汇总栏 -->
		<view class="footer">
			<view class="footer-stats">
				<text class="stat-label">已选</text>
				<text class="stat-value highlight">{{ formatAmount(selectedTotal.unpaid) }}</text>
				<text class="stat-note">({{ selectedCount }}单)</text>
				<view class="stat-divider"></view>
				<text class="stat-mini-label">货款</text>
				<text class="stat-mini-value">{{ formatAmount(selectedTotal.totalMoney) }}</text>
				<view class="stat-divider"></view>
				<text class="stat-mini-label">费用</text>
				<text class="stat-mini-value">{{ formatAmount(selectedTotal.totalFee) }}</text>
				<view class="stat-divider"></view>
				<text class="stat-mini-label">应付</text>
				<text class="stat-mini-value">{{ formatAmount(selectedTotal.shouldPay) }}</text>
				<view class="stat-divider"></view>
				<text class="stat-mini-label">已付</text>
				<text class="stat-mini-value success">{{ formatAmount(selectedTotal.paidMoney) }}</text>
			</view>
			<view class="footer-actions">
				<view class="action-btn share-btn" @click="handleShare">
					<text>分享</text>
				</view>
				<view class="action-btn pay-btn" @click="handlePay">
					<text>付款</text>
				</view>
			</view>
		</view>

		<!-- 日期选择器弹窗 -->
		<u-datetime-picker
			v-model="createTimeValue"
			:show="showCreateTimePicker"
			mode="date"
			@confirm="confirmCreateTime"
			@cancel="showCreateTimePicker = false"
		></u-datetime-picker>
		
		<u-datetime-picker
			v-model="settleTimeValue"
			:show="showSettleTimePicker"
			mode="date"
			@confirm="confirmSettleTime"
			@cancel="showSettleTimePicker = false"
		></u-datetime-picker>
		
		<!-- 付款弹窗 -->
		<view v-if="showPaymentModal" class="payment-modal-container">
			<view class="payment-modal-overlay" @click="closePaymentDialog"></view>
			<view class="payment-modal">
				<view class="payment-modal-header">
					<text class="modal-title">确认付款</text>
					<view class="close-btn" @click="closePaymentDialog">
						<uni-icons type="close" color="white" size="20"></uni-icons>
					</view>
				</view>
				
				<view class="payment-modal-body">
					<!-- 付款金额输入 -->
					<view class="input-section">
						<view class="input-label">
							<uni-icons custom-prefix="iconfont" type="icon-yen" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							<text>付款金额</text>
						</view>
						<view class="amount-input-wrapper">
							<input 
								v-model="paymentAmount" 
								type="digit" 
								placeholder="请输入付款金额"
								class="amount-input"
							/>
							<text class="currency-unit">元</text>
						</view>
					</view>

					<!-- 支付方式选择 -->
					<view class="input-section">
						<view class="input-label">
							<uni-icons type="wallet" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							<text>支付方式</text>
						</view>
					<view class="payment-methods">
						<view 
							@click="paymentMethod = '微信'"
							:class="['payment-method-btn', { 'active': paymentMethod === '微信' }]"
						>
							<u-icon name="weixin-fill" :color="paymentMethod === '微信' ? '#1890ff' : '#999'" size="20"></u-icon>
							<text>微信</text>
						</view>
						<view 
							@click="paymentMethod = '支付宝'"
							:class="['payment-method-btn', { 'active': paymentMethod === '支付宝' }]"
						>
							<u-icon name="zhifubao" :color="paymentMethod === '支付宝' ? '#1890ff' : '#999'" size="20"></u-icon>
							<text>支付宝</text>
						</view>
						<view 
							@click="paymentMethod = '现金'"
							:class="['payment-method-btn', { 'active': paymentMethod === '现金' }]"
						>
							<u-icon name="red-packet-fill" :color="paymentMethod === '现金' ? '#1890ff' : '#999'" size="20"></u-icon>
							<text>现金</text>
						</view>
						<view 
							@click="paymentMethod = '银行卡'"
							:class="['payment-method-btn', { 'active': paymentMethod === '银行卡' }]"
						>
							<u-icon name="coupon-fill" :color="paymentMethod === '银行卡' ? '#1890ff' : '#999'" size="20"></u-icon>
							<text>银行卡</text>
						</view>
					</view>
					</view>

					<!-- 付款备注 -->
					<view class="input-section">
						<view class="input-label">
							<uni-icons type="compose" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							<text>付款备注（可选）</text>
						</view>
						<textarea 
							v-model="paymentRemark" 
							placeholder="请输入付款备注"
							class="remark-textarea"
						/>
					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="payment-modal-footer">
					<button class="btn-cancel" @click="closePaymentDialog">
						<uni-icons type="close" size="16" color="#666" style="margin-right: 5px;"></uni-icons>
						<text>取消</text>
					</button>
					<button class="btn-confirm" @click="handlePaymentConfirm">
						<uni-icons type="checkmarkempty" size="16" color="white" style="margin-right: 5px;"></uni-icons>
						<text>确认付款</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import batchApi from '@/api/batch/batch.js';
import shipperApi from '@/api/shipper/shipperApi.js';

export default {
	name: 'settlementList',
	data() {
		return {
			shipperId: '',
			shipperName: '',
			batchList: [],
			allSelected: false,
			loading: false,
			scrollViewHeight: 0,
			
			// 日期筛选
			showCreateTimePicker: false,
			showSettleTimePicker: false,
			createTimeValue: Date.now(),
			settleTimeValue: Date.now(),
			createTimeRange: '',
			settleTimeRange: '',
			createTimeStart: '',
			createTimeEnd: '',
			settleTimeStart: '',
			settleTimeEnd: '',
			
			// 付款弹窗相关
			showPaymentModal: false,
			paymentAmount: '',
			paymentRemark: '',
			paymentMethod: ''
		}
	},
	computed: {
		// 已选择的批次数量
		selectedCount() {
			return this.batchList.filter(item => item.selected).length;
		},
		
		// 已选择批次的汇总数据
		selectedTotal() {
			let total = {
				totalMoney: 0,
				totalFee: 0,
				shouldPay: 0,
				paidMoney: 0,
				unpaid: 0
			};
			
			this.batchList.forEach(item => {
				if (item.selected) {
					total.totalMoney += parseFloat(item.totalMoney) || 0;
					total.totalFee += parseFloat(item.totalFee) || 0;
					total.shouldPay += parseFloat(item.shouldPay) || 0;
					total.paidMoney += parseFloat(item.paidMoney) || 0;
					total.unpaid += parseFloat(item.unpaidMoney) || 0;
				}
			});
			
			return total;
		}
	},
	onLoad(options) {
		this.shipperId = options.shipperId || '';
		this.shipperName = options.shipperName || '';
		
		this.calculateScrollViewHeight();
		this.loadData();
	},
	methods: {
		// 计算滚动视图高度
		calculateScrollViewHeight() {
			const that = this;
			uni.getSystemInfo({
				success: (res) => {
					const windowHeight = res.windowHeight;
					this.$nextTick(() => {
						// 获取头部、筛选区、底部高度
						uni.createSelectorQuery().in(this).selectAll('.header, .filter-section, .footer')
							.boundingClientRect((rects) => {
								let totalHeight = 0;
								if (rects && rects.length > 0) {
									rects.forEach(rect => {
										totalHeight += rect.height;
									});
									that.scrollViewHeight = windowHeight - totalHeight - 5; // 减去额外间距
								} else {
									// 使用默认值（头部约40px + 筛选约35px + 底部约70px）
									that.scrollViewHeight = windowHeight - 145;
								}
							}).exec();
					});
				}
			});
		},
		
		// 加载数据
		async loadData() {
			if (this.loading) return;
			
			this.loading = true;
			
			try {
				// 调用API获取未付款批次列表（一次性加载全部）
				const res = await batchApi.GetUnpaidBatchListByShipper(this.shipperId);
				
				if (res.code === 200 && res.data) {
					// 处理返回的数据
					this.batchList = this.processBatchData(res.data.list || res.data);
					// 数据加载完成后，设置全选状态为true（因为默认全选）
					this.allSelected = this.batchList.length > 0;
				} else {
					uni.showToast({
						title: res.msg || '加载失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载批次列表失败:', error);
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				});
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
				// 计算费用（代卖费）
				const totalFee = item.assistAmount || 0;
				// 应付款 = 结算金额
				const shouldPay = item.settleAmount || 0;
				
				return {
					id: item.id,
					batchCode: item.batchCode || '',
					createTime: this.formatTime(item.createTime),
					settleTime: this.formatTime(item.updateTime), // 使用updateTime作为结算时间
					shipperName: item.shipperName || '',
					shipperId: item.shipperId || this.shipperId, // 保留货主ID，如果没有则使用页面级别的shipperId
					totalMoney: item.settleGoodMoney || item.settleAmount || 0,
					totalFee: totalFee,
					shouldPay: shouldPay,
					paidMoney: item.paidAmount || 0,
					unpaidMoney: item.unPaidAmount || 0,
					selected: true // 默认全选
				};
			});
		},
		
		// 格式化时间
		formatTime(time) {
			if (!time) return '';
			const date = new Date(time);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hour = String(date.getHours()).padStart(2, '0');
			const minute = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hour}:${minute}`;
		},
		
		// 格式化金额
		formatAmount(amount) {
			if (!amount && amount !== 0) return '0';
			return Number(amount).toFixed(0);
		},
		
		// 全选/取消全选
		toggleSelectAll() {
			this.allSelected = !this.allSelected;
			this.batchList.forEach(item => {
				item.selected = this.allSelected;
			});
		},
		
		// 切换单个批次选中状态
		toggleBatchSelect(index) {
			const item = this.batchList[index];
			item.selected = !item.selected;
			
			// 检查是否所有批次都被选中
			this.allSelected = this.batchList.every(item => item.selected);
		},
		
		// 返回
		goBack() {
			uni.navigateBack();
		},
		
		// 分享
		handleShare() {
			if (this.selectedCount === 0) {
				uni.showToast({
					title: '请先选择要分享的结算单',
					icon: 'none'
				});
				return;
			}
			
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			});
		},
		
		// 付款
		handlePay() {
			if (this.selectedCount === 0) {
				uni.showToast({
					title: '请先选择要付款的结算单',
					icon: 'none'
				});
				return;
			}
			
			// 显示付款弹窗
			this.showPaymentModal = true;
			// 默认填充未付金额
			this.paymentAmount = this.selectedTotal.unpaid.toFixed(2);
			// 默认选择微信支付
			this.paymentMethod = '微信';
		},
		
		// 关闭付款弹窗
		closePaymentDialog() {
			this.showPaymentModal = false;
			this.paymentAmount = '';
			this.paymentRemark = '';
			this.paymentMethod = '';
		},
		
		// 设置付款金额
		setPaymentAmount(amount) {
			this.paymentAmount = amount.toFixed(2);
		},
		
		// 处理付款操作
		handlePaymentConfirm() {
			// 验证付款金额
			const amount = parseFloat(this.paymentAmount);
			
			if (!this.paymentAmount || isNaN(amount) || amount <= 0) {
				uni.showToast({
					title: '请输入有效的付款金额',
					icon: 'none'
				});
				return;
			}
			
			// 验证支付方式
			if (!this.paymentMethod) {
				uni.showToast({
					title: '请选择支付方式',
					icon: 'none'
				});
				return;
			}
			
			if (amount > this.selectedTotal.unpaid) {
				uni.showModal({
					title: '提示',
					content: `付款金额(¥${amount.toFixed(2)})超过未付金额(¥${this.selectedTotal.unpaid.toFixed(2)})，是否继续？`,
					success: (res) => {
						if (res.confirm) {
							this.confirmPayment(amount);
						}
					}
				});
				return;
			}
			
			this.confirmPayment(amount);
		},
		
		// 确认付款（直接执行付款）
		confirmPayment(amount) {
			this.executePayment(amount);
		},
		
		// 执行付款操作
		executePayment(amount) {
			// 验证必要的参数
			if (!this.shipperId) {
				uni.showToast({
					title: '货主信息缺失，无法付款',
					icon: 'none'
				});
				return;
			}
			
			// 获取选中批次的ID列表
			const selectedIds = this.batchList
				.filter(item => item.selected)
				.map(item => item.id);
			
			if (selectedIds.length === 0) {
				uni.showToast({
					title: '请选择要付款的批次',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({
				title: '付款中...'
			});
			
			// 获取当前操作员信息
			const userInfo = uni.getStorageSync("userInfo");
			if (!userInfo || !userInfo.id) {
				uni.hideLoading();
				uni.showToast({
					title: '用户信息异常，请重新登录',
					icon: 'none'
				});
				return;
			}
			
			// 将支付方式转换为数字：1-微信 2-支付宝 3-现金 4-其他
			let payWay = 4; // 默认为其他
			switch (this.paymentMethod) {
				case '微信':
					payWay = 1;
					break;
				case '支付宝':
					payWay = 2;
					break;
				case '现金':
					payWay = 3;
					break;
				case '银行卡':
					payWay = 4;
					break;
				default:
					payWay = 4;
			}
			
			// 构建付款记录对象
			const paidRecord = {
				paidMoney: amount,
				operatorId: userInfo.id,
				payWay: payWay,
				status: 1, // 1-正常
				remark: this.paymentRemark || '',
				batchIdList: selectedIds, // 选中的批次ID列表
				shipperId: this.shipperId
			};
			
			// 调用创建付款记录API
			shipperApi.createShipperPaidRecord(paidRecord).then(res => {
				uni.hideLoading();
				
				if (res && res.code === 200) {
					// 关闭弹窗
					this.closePaymentDialog();
					
					uni.showToast({
						title: '付款成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							// 刷新列表
							setTimeout(() => {
								this.loadData();
							}, 1500);
						}
					});
				} else {
					uni.showToast({
						title: res.message || '付款失败',
						icon: 'none',
						duration: 3000
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('付款失败:', error);
				uni.showToast({
					title: error.message || '付款失败，请重试',
					icon: 'none',
					duration: 3000
				});
			});
		},
		
		// 确认创建时间
		confirmCreateTime(e) {
			const date = new Date(e.value);
			this.createTimeRange = this.formatTime(date);
			this.showCreateTimePicker = false;
			// TODO: 根据时间筛选数据
			this.loadData();
		},
		
		// 确认结算时间
		confirmSettleTime(e) {
			const date = new Date(e.value);
			this.settleTimeRange = this.formatTime(date);
			this.showSettleTimePicker = false;
			// TODO: 根据时间筛选数据
			this.loadData();
		},
		
		// 跳转到批次结算详情
		goToBatchDetail(item) {
			uni.navigateTo({
				url: `/pages/settlement/batchSettlementDetail?batchId=${item.id}&batchCode=${encodeURIComponent(item.batchCode)}&shipperName=${encodeURIComponent(item.shipperName || this.shipperName)}&shipperId=${item.shipperId || this.shipperId}&paidMoney=${item.paidMoney}&unpaidMoney=${item.unpaidMoney}`
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.header {
	display: flex;
	align-items: center;
	padding: 6rpx 24rpx;
	background-color: white;
	border-bottom: 1px solid #e5e5e5;
	flex-shrink: 0;
	
	.header-back {
		display: flex;
		align-items: center;
		cursor: pointer;
		
		.back-text {
			font-size: 20px;
			color: #333;
			margin-left: 6rpx;
		}
	}
	
	.header-title {
		flex: 1;
		text-align: center;
		font-size: 20rpx;
		font-weight: 600;
		color: #333;
		margin-right: 80rpx;
	}
}

.filter-section {
	background-color: white;
	padding: 8rpx 24rpx;
	border-bottom: 1px solid #e5e5e5;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: 12rpx;
	
	.date-picker-item {
		display: flex;
		align-items: center;
		padding: 8rpx 12rpx;
		background-color: #f8f8f8;
		border-radius: 4rpx;
		border: 1px solid #e8e8e8;
		
		&.date-picker-right {
			margin-left: auto;
		}
		
		.picker-text {
			font-size: 20px;
			color: #666;
			margin-left: 6rpx;
			white-space: nowrap;
		}
	}
	
	.select-all-row {
		display: flex;
		align-items: center;
		padding: 0 12rpx 0 24rpx;
		
		.select-icon {
			margin-right: 12rpx;
		}
		
		.select-text {
			font-size: 20px;
			color: #333;
			font-weight: 500;
		}
	}
}

.batch-list {
	flex: 1;
	padding: 12rpx 24rpx;
	
	.batch-item {
		display: flex;
		align-items: stretch;
		background-color: white;
		border-radius: 8rpx;
		margin-bottom: 12rpx;
		padding: 16rpx;
		border: 1rpx solid #e8e8e8;
		transition: all 0.3s;
		
		&.selected {
			border-color: #1890ff;
			background-color: #e6f7ff;
		}
		
		.batch-checkbox {
			display: flex;
			align-items: center;
			padding-right: 12rpx;
		}
		
		.batch-content {
			flex: 1;
			min-width: 0;
			
			.batch-header {
				display: flex;
				align-items: center;
				margin-bottom: 6rpx;
				
				.batch-code {
					font-size: 20px;
					font-weight: 600;
					color: #333;
					margin-right: 16rpx;
				}
				
				.batch-time {
					font-size: 20px;
					color: #999;
				}
			}
			
			.batch-settle-time {
				font-size: 20px;
				color: #999;
				margin-bottom: 8rpx;
			}
			
			.batch-shipper {
				.shipper-text {
					font-size: 22rpx;
					color: #666;
					line-height: 1.4;
				}
			}
		}
		
		.batch-finance {
			display: flex;
			gap: 16rpx;
			padding-left: 12rpx;
			border-left: 1px solid #f0f0f0;
			
			.finance-col {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				min-width: 60rpx;
				
				&.highlight {
					background-color: #fff9f0;
					padding: 6rpx 8rpx;
					border-radius: 4rpx;
				}
				
				.finance-label {
					font-size: 22px;
					color: #999;
					margin-bottom: 4rpx;
					white-space: nowrap;
				}
				
				.finance-value {
					font-size: 22px;
					font-weight: 600;
					color: #333;
					white-space: nowrap;
					
					&.danger {
						color: #f5222d;
					}
					
					&.success {
						color: #52c41a;
					}
					
					&.unpaid {
						color: #f5222d;
						font-size: 22px;
						font-weight: 700;
					}
				}
			}
		}
		
		.batch-arrow {
			display: flex;
			align-items: center;
			padding-left: 12rpx;
		}
	}
	
	.empty-state {
		text-align: center;
		padding: 100rpx 40rpx;
		color: #999;
		font-size: 24rpx;
	}
	
	.load-more {
		text-align: center;
		padding: 16rpx;
		color: #999;
		font-size: 22rpx;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: white;
	border-top: 1rpx solid #e5e5e5;
	padding: 8rpx 24rpx;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
	
	.footer-stats {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 8rpx;
		flex-wrap: wrap;
		
		.stat-label {
			font-size: 18rpx;
			color: #666;
		}
		
		.stat-value {
			font-size: 24rpx;
			font-weight: 700;
			color: #333;
			
			&.highlight {
				color: #f5222d;
			}
		}
		
		.stat-note {
			font-size: 18rpx;
			color: #999;
		}
		
		.stat-divider {
			width: 1rpx;
			height: 24rpx;
			background-color: #e5e5e5;
		}
		
		.stat-mini-label {
			font-size: 18rpx;
			color: #999;
		}
		
		.stat-mini-value {
			font-size: 20rpx;
			font-weight: 600;
			color: #333;
			
			&.success {
				color: #52c41a;
			}
		}
	}
	
	.footer-actions {
		display: flex;
		gap: 12rpx;
		
		.action-btn {
			flex: 1;
			height: 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6rpx;
			font-size: 22rpx;
			font-weight: 600;
			cursor: pointer;
			
			&.share-btn {
				background-color: #f0f0f0;
				color: #666;
				border: 1px solid #d9d9d9;
			}
			
			&.pay-btn {
				background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
				color: white;
				box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.3);
			}
		}
	}
}

/* 付款弹窗样式 */
.payment-modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.payment-modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(5px);
}

.payment-modal {
	position: relative;
	width: 90%;
	max-width: 500px;
	max-height: 80vh;
	background: white;
	border-radius: 12px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	animation: modalSlideIn 0.3s ease-out;
	display: flex;
	flex-direction: column;
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: translateY(-50px) scale(0.9);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.payment-modal-header {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	padding: 18px 20px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;
	
	.modal-title {
		color: white;
		font-size: 18px;
		font-weight: 600;
	}
	
	.close-btn {
		width: 30px;
		height: 30px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		
		&:active {
			background: rgba(255, 255, 255, 0.3);
			transform: scale(1.1);
		}
	}
}

.payment-modal-body {
	padding: 20px;
	flex: 1;
	overflow-y: auto;
}

.input-section {
	margin-bottom: 20px;
}

.input-label {
	display: flex;
	align-items: center;
	font-size: 14rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 10px;
}

/* 支付方式选择 */
.payment-methods {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.payment-method-btn {
	flex: 1;
	min-width: 100px;
	padding: 12px;
	border: 2px solid #e9ecef;
	border-radius: 8px;
	background: white;
	color: #666;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	
	&:active {
		border-color: #1890ff;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
	}
	
	&.active {
		border-color: #1890ff;
		background: #e6f7ff;
		color: #1890ff;
		box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
	}
	
	text {
		font-size: 13px;
	}
}

/* 金额输入 */
.amount-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.amount-input {
	flex: 1;
	padding: 0 50px 0 15px;
	border: 2px solid #e9ecef;
	border-radius: 8px;
	font-size: 20rpx;
	transition: all 0.3s ease;
	
	&:focus {
		border-color: #1890ff;
		box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
	}
}

.currency-unit {
	position: absolute;
	right: 15px;
	color: #666;
	font-size: 14px;
	font-weight: 600;
	pointer-events: none;
}

/* 备注输入 */
.remark-textarea {
	width: 100%;
	padding: 12px;
	border: 2px solid #e9ecef;
	border-radius: 8px;
	font-size: 14px;
	min-height: 80px;
	resize: none;
	transition: all 0.3s ease;
	box-sizing: border-box;
	
	&:focus {
		border-color: #1890ff;
		box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
	}
}

.payment-modal-footer {
	padding: 15px 20px;
	background: #f8f9fa;
	display: flex;
	gap: 12px;
	border-top: 1px solid #e9ecef;
	flex-shrink: 0;
}

.btn-cancel,
.btn-confirm {
	flex: 1;
	height: 40rpx;
	border: none;
	border-radius: 8px;
	font-size: 20px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}

.btn-cancel {
	background: white;
	color: #666;
	border: 2px solid #e9ecef;
	
	&:active {
		background: #f8f9fa;
		border-color: #dee2e6;
	}
}

.btn-confirm {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
	
	&:active {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
	}
}
</style>

