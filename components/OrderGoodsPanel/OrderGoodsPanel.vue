<template>
	<div class="order-goods-panel">
		<div class="modern-table-header">
			<div class="header-cell header-name" @click="handleNameClick">名称</div>
			<div class="header-cell header-quantity">数量</div>
			<div class="header-cell header-price">单价</div>
			<div class="header-cell header-subtotal">小计</div>
			<div class="header-cell header-action">操作</div>
		</div>
		
		<div class="table-body-wrapper">
			<div v-if="goodsList.length > 0" class="modern-table-body">
				<div 
					class="modern-table-row" 
					v-for="(item, index) in goodsList"
					:key="item.key || index" 
					@click="handleItemClick(item, index)"
				>
					<div class="table-cell cell-name">
						<span class="name-text">{{ item.skuName }}</span>
						<span 
							v-if="item.extralModel && item.extralModel.id != '' && item.extralModel.quantity > 0"
							class="extra-tag"
						>
							{{ item.extralModel.name }}
						</span>
					</div>
					<div class="table-cell cell-quantity">{{ item.quantity }}</div>
					<div class="table-cell cell-subtotal">¥{{ item.money2 }}</div>
					<div class="table-cell cell-action" @click.stop="handleDelete(item)">
						<u-icon name="trash" color="#ff6b6b" size="22"></u-icon>
					</div>
				</div>
			</div>
			
			<div v-else class="empty-state">
				<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="80" color="#c0c4cc"></uni-icons>
				<div class="empty-text">暂无物品</div>
				<div class="empty-hint">请添加商品到购物车</div>
			</div>
		</div>
		
		<!-- Footer 固定在底部 -->
		<div class="footer">
			<!-- 总计金额 -->
			<div class="card-sumarry">
				<div class="text">总计金额</div>
				<div class="amount">￥{{ totalAmount }}</div>
			</div>
			
			<!-- 底部操作区域 -->
			<div class="card-footer">
				<div class="shipping-info" @click="handleShippingClick">
					<uni-icons custom-prefix="iconfont" type="icon-ehl_sanlunche" size="24" color="#00aaff"></uni-icons>
					<span class="shipping-text">运费{{ shippingFee > 0 ? shippingFee + '元' : '' }}</span>
				</div>
				<div class="footer-item footer-right">
					<div v-if="showHangOrder" class="btn btn-primary-plain btn-submit modern-btn" @click="handleHangOrder">
						挂单
					</div>
					<div class="btn btn-primary btn-submit modern-btn" @click="handleCheckout">
						{{ checkoutButtonText }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OrderGoodsPanel',
	props: {
		// 商品列表
		goodsList: {
			type: Array,
			default: () => []
		},
		// 总计金额
		totalAmount: {
			type: [Number, String],
			default: 0
		},
		// 运费
		shippingFee: {
			type: [Number, String],
			default: 0
		},
		// 是否显示挂单按钮
		showHangOrder: {
			type: Boolean,
			default: true
		},
		// 结账按钮文字
		checkoutButtonText: {
			type: String,
			default: '结账'
		}
	},
	methods: {
		// 点击表头名称
		handleNameClick() {
			this.$emit('name-click');
		},
		
		// 点击商品行
		handleItemClick(item, index) {
			this.$emit('item-click', { item, index });
		},
		
		// 删除商品
		handleDelete(item) {
			this.$emit('delete-item', item);
		},
		
		// 点击运费
		handleShippingClick() {
			this.$emit('shipping-click');
		},
		
		// 挂单
		handleHangOrder() {
			this.$emit('hang-order');
		},
		
		// 结账
		handleCheckout() {
			this.$emit('checkout');
		}
	}
}
</script>

<style lang="scss" scoped>
.order-goods-panel {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 50rpx);
	width: 100%;
	background: #ffffff;
	box-sizing: border-box;
	position: relative;
}

/* 现代简洁风格表格样式 */
.modern-table-header {
	display: flex;
	align-items: center;
	background: $zn-table-header-bg;
	padding: 8rpx 5rpx;
	width: 100%;
	box-sizing: border-box;
	flex-shrink: 0;
	z-index: 10;
}

.header-cell {
	display: flex;
	align-items: center;
	justify-content: center;
	color: $zn-font-color-leve1;
	font-size: 12rpx;
	font-weight: 600;
	letter-spacing: 0.3rpx;
	flex-shrink: 0;
	padding: 0 2rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	min-width: 0;
	box-sizing: border-box;
}

.header-name { 
	flex: 0 0 40%; 
	min-width: 0; 
	justify-content: flex-start;
	padding-left: 4rpx;
	cursor: pointer;
}
.header-quantity { flex: 0 0 15%; min-width: 0; }
.header-price { flex: 0 0 15%; min-width: 0; }
.header-weight { flex: 0 0 20%; min-width: 0; }
.header-subtotal { flex: 0 0 20%; min-width: 0; }
.header-action { 
	flex: 0 0 6%; 
	min-width: 0;
	justify-content: center;
}

/* 商品列表容器 */
.table-body-wrapper {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	width: 100%;
	box-sizing: border-box;
	min-height: 0;
}

.modern-table-body {
	background: #ffffff;
	width: 100%;
	box-sizing: border-box;
}

.modern-table-row {
	display: flex;
	align-items: center;
	padding: 8rpx 4rpx;
	border-bottom: 1px solid #f0f0f0;
	transition: all 0.2s ease;
	cursor: pointer;
	width: 100%;
	min-height: 45rpx;
	box-sizing: border-box;
}

.modern-table-row:hover {
	background: linear-gradient(to right, #ffffff 0%, #e6f7ff 100%);
	transform: translateX(2rpx);
	box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.modern-table-row:last-child {
	border-bottom: none;
}

.table-cell {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 13rpx;
	color: #333333;
	flex-shrink: 0;
	min-width: 0;
	overflow: hidden;
	padding: 0 2rpx;
	box-sizing: border-box;
}

.cell-name {
	flex: 0 0 26%;
	justify-content: flex-start;
	flex-direction: column;
	align-items: flex-start;
	gap: 3rpx;
	padding-left: 4rpx;
	min-width: 0;
	overflow: hidden;
	box-sizing: border-box;
}

.name-text {
	font-weight: 600;
	color: #2c3e50;
	font-size: 13rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	line-height: 1.3;
}

.extra-tag {
	display: inline-block;
	padding: 1rpx 5rpx;
	background: linear-gradient(135deg, #ff9c6e 0%, #ff7a45 100%);
	color: #ffffff;
	font-size: 9rpx;
	border-radius: 3rpx;
	font-weight: 500;
	letter-spacing: 0.2rpx;
	white-space: nowrap;
	box-shadow: 0 1px 4px rgba(255, 122, 69, 0.3);
}

.cell-quantity {
	flex: 0 0 12%;
	font-weight: 700;
	color: #096dd9;
	font-size: 13rpx;
	min-width: 0;
	box-sizing: border-box;
}

.cell-price {
	flex: 0 0 15%;
	font-weight: 500;
	color: #555555;
	font-size: 12rpx;
	min-width: 0;
	box-sizing: border-box;
}

.cell-weight {
	flex: 0 0 20%;
	flex-direction: column;
	gap: 2rpx;
	min-width: 0;
	box-sizing: border-box;
}

.weight-main {
	font-weight: 600;
	color: #2c3e50;
	font-size: 13rpx;
}

.weight-detail {
	font-size: 9rpx;
	color: #999999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.cell-subtotal {
	flex: 0 0 20%;
	font-weight: 700;
	background: linear-gradient(135deg, #ff4d4f 0%, #f5222d 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	font-size: 14rpx;
	min-width: 0;
	box-sizing: border-box;
}

.cell-action {
	flex: 0 0 6%;
	cursor: pointer;
	transition: transform 0.2s ease;
	min-width: 0;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
}

.cell-action:hover {
	transform: scale(1.2);
}

/* 空状态样式 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	min-height: 200px;
}

.empty-text {
	margin-top: 16rpx;
	font-size: 16rpx;
	color: #909399;
	font-weight: 500;
	text-align: center;
}

.empty-hint {
	margin-top: 8rpx;
	font-size: 12rpx;
	color: #c0c4cc;
	text-align: center;
}

.detail-list {
	margin: 0;
	padding: 0 8px;
	display: flex;
	flex-flow: column;
	justify-content: center;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
}

.detail-item {
	display: flex;
	flex-flow: row;
	justify-content: space-between;
	align-items: center;
	font-weight: 600;
	font-size: 25px;
	color: #2c3e50;
	width: 100%;
	box-sizing: border-box;
	gap: 10px;
}

.detail-item > div {
	white-space: nowrap;
	overflow: visible;
}

.payable .amount {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	font-weight: 700;
	display: flex;
	align-items: center;
	white-space: nowrap;
}

.payable .amount span {
	font-size: 30px;
	font-weight: 700;
}

/* 底部操作区域 */
.card-footer {
	height: 70px;
	min-height: 70px;
	display: flex;
	flex-flow: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	z-index: 10;
	border-top: 1px solid #e8e8e8;
	padding: 8px 12px;
	box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
	width: 100%;
	box-sizing: border-box;
	flex-shrink: 0;
}

/* 运费信息样式 */
.shipping-info {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	padding: 10px 16px;
	border-radius: 8px;
	background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);
	border: 2px solid #1890ff;
	transition: all 0.2s ease;
	height: 50px;
	box-sizing: border-box;
}

.shipping-info:hover {
	background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
	border-color: #40a9ff;
}

.shipping-info:active {
	transform: translateY(0);
	box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
}

.shipping-text {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	font-weight: 600;
	font-size: 16px;
	white-space: nowrap;
}

.footer-item {
	display: flex;
	flex-flow: row;
	align-items: center;
	gap: 12px;
	flex-shrink: 0;
}

.btn-submit {
	padding: 14px 24px;
	font-size: 18px;
	font-weight: 600;
	white-space: nowrap;
	flex-shrink: 0;
	border-radius: 8px;
	transition: all 0.3s ease;
	min-width: 90px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	letter-spacing: 2px;
	cursor: pointer;
}

/* 现代按钮样式 */
.modern-btn {
	border-radius: 8px;
	font-weight: 600;
	transition: all 0.3s ease;
	box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	cursor: pointer;
}

.modern-btn:hover {
	transform: translateY(-2px) scale(1.02);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.modern-btn:active {
	transform: translateY(0) scale(1);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 挂单按钮特殊样式 */
.btn-primary-plain.btn-submit {
	border: 2px solid #1890ff !important;
	color: #1890ff !important;
	font-weight: 600;
	background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%) !important;
}

.btn-primary-plain.btn-submit:hover {
	background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%) !important;
	border-color: #40a9ff !important;
	color: #096dd9 !important;
	box-shadow: 0 6px 20px rgba(24, 144, 255, 0.2);
}

/* 结账按钮特殊样式 */
.btn-primary.btn-submit {
	font-weight: 700;
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%) !important;
	border: none !important;
	color: white !important;
}

.btn-primary.btn-submit:hover {
	background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%) !important;
	box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

.footer {
	flex-shrink: 0;
	width: 100%;
	background: #ffffff;
	box-sizing: border-box;
	padding-bottom: 10rpx;
	
	.card-sumarry {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
		height: 40rpx;
		border-top: 3px solid #1890ff;
		padding: 0 10px;
		box-sizing: border-box;
		
		.text {
			font-size: 12rpx;
			font-weight: bold;
			color: $zn-font-color-leve1;
		}
		
		.amount {
			color: $zn-main-purple-color;
			font-weight: bold;
		}
	}
}

/* 响应式字体大小 - 在小宽度下减小字体 */
@media screen and (max-width: 1366px) {
	.header-cell,
	.table-cell {
		font-size: 11rpx;
	}
	
	.name-text {
		font-size: 12rpx;
	}
	
	.btn-submit {
		padding: 12px 18px !important;
		font-size: 16px !important;
		min-width: 80px !important;
		height: 45px !important;
	}
	
	.shipping-text {
		font-size: 14px !important;
	}
}

/* 极小屏幕优化 */
@media screen and (max-width: 1024px) {
	.btn-submit {
		padding: 10px 14px !important;
		font-size: 14px !important;
		min-width: 70px !important;
		height: 40px !important;
		letter-spacing: 1px !important;
	}
	
	.card-footer {
		padding: 6px 8px;
	}
	
	.shipping-info {
		padding: 8px 12px !important;
		height: 40px !important;
	}
	
	.shipping-text {
		font-size: 13px !important;
	}
}
</style>

