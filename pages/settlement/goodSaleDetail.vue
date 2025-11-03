<template>
	<div :style="{ height: WindowHeight + 'px', width: '100%', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', position: 'relative' }">
		<!-- 自定义导航栏 -->
		<div style="background-color: #ffffff; padding: 10rpx 15rpx; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0;">
			<div @click="goBack" style="display: flex; align-items: center; cursor: pointer; margin-right: 15rpx;">
				<uni-icons type="back" size="22" color="#00aa00"></uni-icons>
				<text style="font-size: 16rpx; color: #00aa00; font-weight: bold; margin-left: 5rpx;">返回</text>
			</div>
			<text style="font-size: 18rpx; font-weight: bold; color: #333;">未结算明细</text>
		</div>

		<!-- 商品名称标题 -->
		<div style="background-color: #ffffff; padding: 15rpx; margin: 10rpx; border-radius: 8rpx; box-shadow: 0 2px 8px rgba(0,0,0,0.08); flex-shrink: 0;">
			<div style="display: flex; align-items: center;">
				<text style="font-size: 18rpx; font-weight: bold; color: #333; margin-right: 8rpx;">{{ goodName }}</text>
				<span v-if="!isSettled" style="background-color: #ff9800; color: white; padding: 2rpx 8rpx; border-radius: 4rpx; font-size: 11rpx; font-weight: bold;">非</span>
			</div>
		</div>

		<!-- 表格容器 -->
		<div style="flex: 1; overflow: hidden; margin: 0 10rpx 10rpx 10rpx; background-color: #ffffff; border-radius: 8rpx; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; flex-direction: column;">
			<!-- 表头 -->
			<div style="display: flex; background-color: #e8f4f8; border-bottom: 2px solid #d0d0d0; font-weight: bold; font-size: 14rpx; flex-shrink: 0;">
				<div style="width: 120px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">买家</div>
				<div style="width: 180px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">销售时间</div>
				<div style="width: 160px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">销量</div>
				<div style="width: 100px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">均重</div>
				<div style="width: 120px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">销售单价</div>
				<div style="width: 120px; padding: 12px; text-align: center; border-right: 1px solid #d0d0d0;">销售货款</div>
				<div style="width: 80px; padding: 12px; text-align: center;">操作</div>
			</div>

			<!-- 数据区域（可滚动） -->
			<scroll-view scroll-y="true" style="flex: 1; overflow-y: auto;">
				<!-- 数据行 -->
				<div v-for="(item, index) in saleList" :key="index" 
					style="display: flex; border-bottom: 1px solid #e8e8e8; background-color: #fff; font-size: 13rpx;">
					<div style="width: 120px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #e8e8e8;">
						{{ item.buyerName || '临时客户' }}
					</div>
					<div style="width: 180px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #e8e8e8;">
						{{ formatDateTime(item.saleTime) }}
					</div>
					<div style="width: 160px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #e8e8e8;">
						{{ item.quantity }}件({{ item.weight }}斤)
					</div>
					<div style="width: 100px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #e8e8e8;">
						{{ item.avgWeight }}
					</div>
					<div style="width: 120px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #e8e8e8;">
						{{ item.unitPrice }}
					</div>
					<div style="width: 120px; padding: 12px; text-align: center; color: #333; font-weight: bold; border-right: 1px solid #e8e8e8;">
						{{ item.totalAmount }}
					</div>
					<div style="width: 80px; padding: 12px; text-align: center;">
						<text @click="viewDetail(item)" style="color: #00aa00; cursor: pointer; font-weight: bold;">详情</text>
					</div>
				</div>

				<!-- 合计行 -->
				<div style="display: flex; background-color: #f5f5f5; border-top: 2px solid #d0d0d0; font-weight: bold; font-size: 14rpx;">
					<div style="width: 120px; padding: 12px; text-align: center; color: #333; border-right: 1px solid #d0d0d0;">合计</div>
					<div style="width: 180px; padding: 12px; text-align: center; color: #666; border-right: 1px solid #d0d0d0;">--</div>
					<div style="width: 160px; padding: 12px; text-align: center; color: #333; border-right: 1px solid #d0d0d0;">
						{{ totalQuantity }}件({{ totalWeight }}斤)
					</div>
					<div style="width: 100px; padding: 12px; text-align: center; color: #333; border-right: 1px solid #d0d0d0;">
						{{ avgWeight }}
					</div>
					<div style="width: 120px; padding: 12px; text-align: center; color: #333; border-right: 1px solid #d0d0d0;">
						{{ avgPrice }}
					</div>
					<div style="width: 120px; padding: 12px; text-align: center; color: #333; border-right: 1px solid #d0d0d0;">
						{{ totalAmount }}
					</div>
					<div style="width: 80px; padding: 12px; text-align: center; color: #666;">--</div>
				</div>
			</scroll-view>
		</div>

		<!-- 订单详情抽屉 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showDrawer }" @tap="closeDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showDrawer }">
				<!--订单详情抽屉-->
				<div class="order-detail-container">
					<!-- 订单概览信息 -->
					<div class="order-overview">
						<div class="info-item">
							<span class="info-label">创建时间:</span>
							<span class="info-value">{{ currentOrder.createTime ? currentOrder.createTime.replace("T", " ") : "" }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">订单号:</span>
							<span class="info-value">{{ currentOrder.accountCode || "-" }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">顾客:</span>
							<span class="info-value">{{ currentOrder.customName || "散客" }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">总计金额:</span>
							<span class="info-value">¥{{ currentOrder.payableAmount }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">押筐抵扣:</span>
							<span class="info-value">¥{{ currentOrder.basketOffsetAmount }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">实付金额:</span>
							<span class="info-value">¥{{ currentOrder.actualMoney }}</span>
						</div>
						<div class="info-item debt" v-if="currentOrder.debt > 0">
							<span class="info-label">下欠:</span>
							<span class="info-value">¥{{ currentOrder.debt }}</span>
						</div>
					</div>

					<!-- 商品列表 -->
					<scroll-view class="product-scroll" :style="{ maxHeight: '300px' }" scroll-y="true">
						<div class="product-table" v-if="currentOrder.module && currentOrder.module.length > 0">
							<div class="table-header">
								<div class="header-cell">货品</div>
								<div class="header-cell">数量</div>
								<div class="header-cell">总重</div>
								<div class="header-cell">皮重</div>
								<div class="header-cell">单价</div>
								<div class="header-cell">小计</div>
							</div>

							<div class="table-row" v-for="(item, index) in currentOrder.module" :key="index">
								<div class="table-cell">{{ item.name }}</div>
								<div class="table-cell">{{ item.mount }}</div>
								<div class="table-cell">{{ item.totalWeight }}</div>
								<div class="table-cell">{{ item.tareWeight }}</div>
								<div class="table-cell">¥{{ item.referenceAmount }}</div>
								<div class="table-cell">¥{{ item.subtotal }}</div>
							</div>
						</div>
						<div v-else style="text-align: center; padding: 40rpx; color: #999;">
							<uni-icons type="info-filled" size="30" color="#bdc3c7"></uni-icons>
							<div style="margin-top: 10rpx; font-size: 12rpx;">暂无商品信息</div>
						</div>
					</scroll-view>
				</div>
			</view>
		</view>
	</div>
</template>

<script>
import batchApi from '@/api/batch/batch.js'
import cashierOrder from '@/api/cashier/cashierOrder.js'

export default {
	data() {
		return {
			WindowHeight: 0,
			goodId: '', // 货品ID
			goodName: '', // 货品名称
			isSettled: false, // 是否已结算
			saleList: [], // 销售明细列表
			loading: false,
			showDrawer: false, // 控制抽屉显示
			currentOrder: {} // 当前订单详情
		}
	},
	computed: {
		// 计算总销量
		totalQuantity() {
			if (!this.saleList || this.saleList.length === 0) return '0';
			return this.saleList.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toFixed(0);
		},
		// 计算总重量
		totalWeight() {
			if (!this.saleList || this.saleList.length === 0) return '0';
			return this.saleList.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0).toFixed(0);
		},
		// 计算平均重量
		avgWeight() {
			if (!this.saleList || this.saleList.length === 0) return '--';
			const totalQty = parseFloat(this.totalQuantity);
			const totalWt = parseFloat(this.totalWeight);
			if (totalQty === 0) return '--';
			return (totalWt / totalQty).toFixed(1);
		},
		// 计算平均价格
		avgPrice() {
			if (!this.saleList || this.saleList.length === 0) return '--';
			const totalWt = parseFloat(this.totalWeight);
			const totalAmt = parseFloat(this.totalAmount);
			if (totalWt === 0) return '--';
			return (totalAmt / totalWt).toFixed(2);
		},
		// 计算总金额
		totalAmount() {
			if (!this.saleList || this.saleList.length === 0) return '0';
			return this.saleList.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0).toFixed(0);
		}
	},
	onLoad(options) {
		this.WindowHeight = uni.getSystemInfoSync().windowHeight;
		
		// 获取传递的参数
		if (options.id) {
			this.goodId = options.id;
		}
		if (options.name) {
			this.goodName = decodeURIComponent(options.name);
		}
		if (options.isSettled) {
			this.isSettled = options.isSettled === 'true';
		}

		// 加载销售明细
		this.loadSaleDetail();
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		// 加载销售明细数据
		async loadSaleDetail() {
			if (!this.goodId) {
				uni.showToast({
					title: '货品ID不能为空',
					icon: 'none'
				});
				return;
			}

			this.loading = true;
			try {
				const res = await batchApi.GetPurchaseAssistGoodById(this.goodId);
				
				if (res && res.code==200) {
					// 处理返回的数据
					this.saleList = this.processSaleData(res.data || []);
				} else {
					uni.showToast({
						title: res.message || '获取数据失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取销售明细失败:', error);
				uni.showToast({
					title: '获取数据失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},

		// 处理销售数据
		processSaleData(data) {
			if (!data) return [];
			
			// 后端直接返回数组格式的 PurchaseAssistGood 列表
			if (Array.isArray(data)) {
				return data.map(item => this.processItem(item));
			}
			
			// 如果 data 是对象，可能包含 purchaseAssistGoodList 字段
			if (data.purchaseAssistGoodList && Array.isArray(data.purchaseAssistGoodList)) {
				return data.purchaseAssistGoodList.map(item => this.processItem(item));
			}
			
			// 如果 data 本身就是一条记录，包装成数组
			if (data.createTime || data.mount !== undefined) {
				return [this.processItem(data)];
			}
			
			return [];
		},
		
		// 处理单个销售记录
		processItem(item) {
			// 处理销量和重量
			const quantity = parseFloat(item.mount || 0); // 数量
			const weight = parseFloat(item.totalWeight || 0); // 总重量
			const tareWeight = parseFloat(item.tareWeight || 0); // 皮重
			const totalAmount = parseFloat(item.referenceAmount || 0); // 参考金额
			
			// 计算净重（总重 - 皮重）
			const netWeight = weight - tareWeight;
			
			// 计算均重
			const avgWeight = quantity > 0 ? (netWeight / quantity).toFixed(1) : '--';
			
			// 计算单价（金额 / 净重）
			const unitPrice = netWeight > 0 ? (totalAmount / netWeight).toFixed(2) : '--';

			return {
				...item,
				buyerName: item.customerName || '散客', // 客户名称
				saleTime: item.createTime, // 销售时间
				quantity: quantity.toFixed(0), // 数量
				weight: netWeight.toFixed(0), // 净重（用于显示）
				totalAmount: totalAmount.toFixed(0), // 销售货款
				avgWeight: avgWeight, // 均重
				unitPrice: unitPrice // 单价
			};
		},

		// 格式化日期时间
		formatDateTime(dateTimeStr) {
			if (!dateTimeStr) return '--';
			// 替换T为空格，并截取到分钟
			return dateTimeStr.replace('T', ' ').substring(0, 16);
		},

		// 查看详情
		viewDetail(item) {
			if (!item || !item.accountId) {
				uni.showToast({
					title: '订单信息不完整',
					icon: 'none'
				});
				return;
			}
			
			// 显示加载提示
			uni.showLoading({
				title: '加载中...'
			});
			
			// 通过 accountId 获取订单详情
			cashierOrder.GetOrderByAccountId(item.accountId).then(res => {
				uni.hideLoading();
				
				if (res && res.data) {
					this.currentOrder = res.data;
					// 解析 module 字段（商品列表）
					if (res.data.module) {
						try {
							this.currentOrder.module = typeof res.data.module === 'string' 
								? JSON.parse(res.data.module) 
								: res.data.module;
							// 过滤掉 type 为 4 的项，并按 type 排序
							this.currentOrder.module = this.currentOrder.module
								.filter(item => item.type !== 4)
								.sort((a, b) => a.type - b.type);
						} catch (error) {
							console.error('解析订单模块失败:', error);
							this.currentOrder.module = [];
						}
					} else {
						this.currentOrder.module = [];
					}
					// 显示抽屉
					this.showDrawer = true;
				} else {
					uni.showToast({
						title: '获取订单详情失败',
						icon: 'none'
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('获取订单详情失败:', error);
				uni.showToast({
					title: '获取订单详情失败',
					icon: 'none'
				});
			});
		},
		
		// 关闭抽屉
		closeDrawer() {
			this.showDrawer = false;
			this.currentOrder = {};
		}
	}
}
</script>

<style scoped>
.scrollArea {
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

::-webkit-scrollbar-thumb {
	background-color: #c1c1c1;
	border-radius: 4px;
}

::-webkit-scrollbar-track {
	background-color: #f1f1f1;
}

/* 抽屉容器 */
.drawer-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 999;
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
}

/* 抽屉内容 */
.drawer-content {
	position: absolute;
	top: 0;
	right: -50%;
	width: 50%;
	height: 100%;
	background: #ffffff;
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
	pointer-events: auto;
	overflow-y: auto;
}

.drawer-content.show {
	transform: translateX(-100%);
}

/* 订单详情容器 */
.order-detail-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-overview {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.info-item {
	flex: 1;
	min-width: 45%;
	display: flex;
	font-size: 12rpx;
	line-height: 1.6;
}

.info-label {
	color: #666;
	min-width: 5em;
	margin-right: 10rpx;
}

.info-value {
	color: #333;
	font-weight: normal;
}

.highlight .info-value {
	color: #e4393c;
	font-weight: bold;
}

.debt .info-value {
	color: darkred;
	font-weight: bold;
}

.product-scroll {
	margin-top: 25rpx;
}

.product-table {
	display: table;
	width: 100%;
	border-collapse: collapse;
}

.table-header,
.table-row {
	display: table-row;
}

.header-cell,
.table-cell {
	display: table-cell;
	padding: 15rpx 8rpx;
	text-align: center;
	font-size: 12rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.header-cell {
	background-color: #f9f9f9;
	font-weight: bold;
	color: #333;
}

.table-cell {
	color: #555;
}
</style>

