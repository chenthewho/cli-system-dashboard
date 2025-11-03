<template>
	<div :style="{'display': 'flex', 'height': (WindowHeight-65)+'px',width:'100%', 'overflow': 'hidden' }">
		<div style="width: 160rpx; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); display: flex; flex-direction: column; overflow: hidden; box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.08);">
			<!-- 返回按钮 -->
			<div @click="back" style="
	          width: 120rpx;
	          height: 30rpx;
			  margin: 5rpx 5rpx 8rpx 5rpx;
	          background: linear-gradient(90deg, #6c757d 0%, #5a6268 100%);
	          color: white;
	          line-height: 30rpx;
	          text-align: center;
	          border-radius: 6rpx;
	          cursor: pointer;
			  font-size: 16rpx;
	          user-select: none;
	          font-weight: 600;
			  box-shadow: 0 2rpx 8rpx rgba(108, 117, 125, 0.3);
			  flex-shrink: 0;
	          ">
				返回
			</div>
			<!-- 订单列表滚动区 -->
			<scroll-view class="scrollArea" scroll-y="true" :style="{ height: (WindowHeight - 120) + 'px', width: '100%' }">
				<div style="display: flex; flex-direction: column; gap: 5rpx; padding: 0 5rpx 5rpx 5rpx;">
					<div v-for="item in orderList" @click="exchangeBatch(item)" :key="item.id" :style="{
	       width: '120rpx',
	       background: selectBatch.id === item.id ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' : '#ffffff',
	       borderRadius: '12rpx',
	       boxShadow: selectBatch.id === item.id ? '0 4rpx 12rpx rgba(33, 150, 243, 0.35)' : '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
	       padding: '10rpx',
	       boxSizing: 'border-box',
	       textAlign: 'left',
	       fontSize: '14rpx',
	       color: selectBatch.id === item.id ? '#ffffff' : '#333',
		   border: selectBatch.id === item.id ? '2rpx solid #2196F3' : '1rpx solid #e0e0e0',
		   transform: selectBatch.id === item.id ? 'scale(1.02)' : 'scale(1)',
		   transition: 'all 0.3s ease',
		   cursor: 'pointer'
	     }">
							<div>
								<text style="font-size: 15rpx; font-weight: bold;">
									{{ item.shipperName }}
								</text>
								<br>
								<text style="font-size: 12rpx; font-weight: bold;">
									{{ item.purchaseOrderCode }}
								</text>
							</div>
						</div>
					</div>
			</scroll-view>
		</div>
		<!-- 垂直分隔线 -->
		<div style="width: 3rpx; background: #ccc; flex-shrink: 0;"></div>
		<div style="width: 100%; background-color: #ffffff; text-align: right; overflow: hidden;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;" v-if="selectBatch"><text
						style="margin-right: 5rpx;">{{selectBatch.shipperName}}</text><text>{{selectBatch.purchaseOrderCode}}</text>
					<text v-if="selectBatch.saleStatus===2"
						style="font-size: 10rpx; border: 1px solid green; border-radius: 4rpx; color: green; margin-left: 5rpx;">已结算</text>
					<text style="margin-left: 50rpx;font-size: 10rpx;"
						v-if="selectBatch">创建时间:{{(selectBatch.createTime).replace("T"," ")}}</text>
				</div>
				<div style="text-align: right;display: flex;gap: 10rpx;align-items: center;font-size: 15rpx; font-weight: bold;" v-if="selectBatch">
					<view v-if="purchaseOrderCostList.length > 0" class="expense-label" @click="showExpenseDetailModal">
						<text class="expense-label-text">费用({{ purchaseOrderCostList.length }}项)：¥{{ getTotalExpense().toFixed(2) }}</text>
					</view>
					<DropdownButton 
						:options="operatorBtnOptions" 
						:fontSize="12" 
						:menuFontSize="10"
						:defaultValue="操作" 
						:width="70" 
						:height="20" 
						:iconPosition="-5" 
						@change="operatorBtnChange">
					</DropdownButton>
				</div>
			</div>
			<div class="table-container">
				<!-- 表头 -->
				<div class="table-header">
					<div class="table-cell header-cell" style="flex: 3;">货品</div>
					<div class="table-cell header-cell " style="flex: 2;">入库数量</div>
					<div class="table-cell header-cell" style="flex: 2;">入库重量</div>
					<div class="table-cell header-cell" style="flex: 2;">采购单价</div>
					<div class="table-cell header-cell" style="flex: 2;">成本单价</div>
					<div class="table-cell header-cell last-cell" style="flex: 2;">入库金额</div>
				</div>
				<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-170 + 'px' }" v-if="BatchCommodityList.length>0">
					<!-- 表格内容行 -->
					<div class="table-row" v-for="(item, index) in BatchCommodityList" :key="index">
						<div class="table-cell goods-cell" style="flex: 3;">
							<div class="goods-name">{{ item.commodityName }}</div>
							<text v-if="item.calcType === 1" class="goods-tag tag-blue">按数量</text>
							<text v-if="item.calcType === 2" class="goods-tag tag-green">按重量</text>
						</div>
						<div class="table-cell " style="flex: 2;">
							{{ item.initMount }} {{ item.specName }}
						</div>
						<div class="table-cell" style="flex: 2;">
							{{ item.initWeight }}
						</div>
						<div class="table-cell" style="flex: 2;">
							{{ item.incomingPrice ? item.incomingPrice.toFixed(2) : '0.00' }}
						</div>
						<div class="table-cell" style="flex: 2;">
							{{ item.costPrice ? item.costPrice.toFixed(2) : '0.00' }}
						</div>
						<div class="table-cell  last-cell" style="flex: 2;">
							{{ item.inboundAmount ? item.inboundAmount.toFixed(2) : '0.00' }}
						</div>

					</div>
					<!-- 总计行 -->
					<div class="table-row total-row">
						<div class="table-cell" style="flex: 3;">
							总计
						</div>
						<div class="table-cell" style="flex: 2;">
							-
						</div>
						<div class="table-cell" style="flex: 2;">
							-
						</div>
						<div class="table-cell" style="flex: 2;">
							-
						</div>
						<div class="table-cell" style="flex: 2;">
							-
						</div>
						<div class="table-cell" style="flex: 2;">
							{{ totalInboundAmount() }}
						</div>
					</div>
				</scroll-view>
			</div>
			<div style="height: 100rpx;" v-if="BatchCommodityList.length==0">
				<div style=" margin-top: 40rpx; text-align: center;">
					<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
					<div style="margin-top: 10px; color: #969696;font-weight: bold;">无货品</div> <!-- 添加的文字 -->
				</div>
			</div>
		</div>
		
		<!-- 费用详情弹窗 -->
		<view v-if="expenseDetailModalVisible" class="expense-modal-mask" @click="closeExpenseDetailModal">
			<view class="expense-modal-wrapper" @click.stop>
				<view class="expense-modal-container">
					<!-- 标题区域 -->
					<view class="expense-modal-header">
						<button class="expense-header-btn cancel" @click="closeExpenseDetailModal">
							<uni-icons type="closeempty" size="20" color="#ffffff"></uni-icons>
							关闭
						</button>
						<text class="header-title">费用详情</text>
						<view style="min-width: 90px;"></view>
					</view>
					
					<!-- 费用列表 -->
					<scroll-view scroll-y class="expense-list-content">
						<view class="expense-items-wrapper">
							<view v-for="(cost, index) in purchaseOrderCostList" :key="index" class="expense-item-card">
								<view class="expense-item-header">
									<view class="expense-item-title">
										<text class="expense-type-badge">{{ cost.label }}</text>
										<text class="expense-amount">¥{{ cost.amount.toFixed(2) }}</text>
									</view>
								</view>
								<view class="expense-item-info">
									<text class="expense-info-text">
										{{ getAllocationMethodLabel(cost.purchaseOrderCostType) }}
									</text>
								</view>
							</view>
							<!-- 总费用汇总 -->
							<view class="expense-total-summary">
								<text class="summary-label">总费用：</text>
								<text class="summary-amount">¥{{ getTotalExpense().toFixed(2) }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</div>
</template>

<script>
	import purchase from '../../api/purchase/purchase.js'
	import DropdownButton from '../../components/DropdownButton/DropdownButton.vue'
	
	export default {
		components: {
			DropdownButton
		},
		data() {
			return {
				BatchAddshow: false,
				ShipperAddshow: false,
				companyId: "",
				shipperAddedName: "",
				shipperList: [],
				shipperSelectedId: "",
				batshNewCode: "",
				copyLastBatch: true,
				selectBatch: null,
				orderList: [],
				BatchCommodityList: [],
				WindowHeight: 0,
				// 费用相关
				purchaseOrderCostList: [], // 采购单费用列表
				expenseDetailModalVisible: false, // 费用详情弹窗显示状态
				// 操作按钮选项
				operatorBtnOptions: [
					{ text: '修改', value: 'edit' },
					{ text: '删除', value: 'delete' }
				]
			}
		},
		onShow() {
			// 从其他页面返回时，刷新当前选择的采购单数据
			if (this.selectBatch && this.selectBatch.id) {
				this.getOrderCommodityList(this.selectBatch.id);
			}
		},
		mounted() {
			this.companyId = uni.getStorageSync('companyId');
			// this.getallShipper();
			this.getPurchaseOrder();
			this.WindowHeight = uni.getWindowInfo().windowHeight;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 操作按钮点击事件
			operatorBtnChange(item) {
				if (!this.selectBatch) {
					uni.showToast({
						title: '请先选择采购单',
						icon: 'none'
					});
					return;
				}
				
				switch(item.value) {
					case 'edit':
						this.editPurchaseOrder();
						break;
					case 'delete':
						this.deletePurchaseOrder();
						break;
				}
			},
			// 修改采购单
			editPurchaseOrder() {
				if (this.selectBatch.saleStatus === 2) {
					uni.showToast({
						title: '已结算的采购单无法修改',
						icon: 'none'
					});
					return;
				}
				
				// 跳转到编辑页面，传递数据
				uni.navigateTo({
					url: '/pages/good/purchaseOrderEdit?orderId=' + this.selectBatch.id + 
						'&shipperId=' + this.selectBatch.shipperId +
						'&shipperName=' + encodeURIComponent(this.selectBatch.shipperName) +
						'&orderCode=' + this.selectBatch.purchaseOrderCode
				});
			},
			// 删除采购单
			deletePurchaseOrder() {
				if (this.selectBatch.saleStatus === 2) {
					uni.showToast({
						title: '已结算的采购单无法删除',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '确认删除',
					content: '确定要删除该采购单吗？删除后无法恢复！',
					success: (res) => {
						if (res.confirm) {
							// 调用删除接口
							purchase.DeletePurchaseOrder(this.selectBatch.id).then(res => {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								// 刷新列表
								this.getPurchaseOrder();
							}).catch(err => {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							});
						}
					}
				});
			},
			// 计算总采购金额
			totalInboundAmount() {
				const total = this.BatchCommodityList.reduce((sum, item) => {
					return sum + (parseFloat(item.inboundAmount) || 0);
				}, 0);
				return total.toFixed(2);
			},
			// 计算总成本金额
			totalCostAmount() {
				const total = this.BatchCommodityList.reduce((sum, item) => {
					return sum + (parseFloat(item.costAmount) || 0);
				}, 0);
				return total.toFixed(2);
			},
			exchangeBatch(item) {
				this.selectBatch = item;
				this.getOrderCommodityList(item.id);
			},
			getOrderCommodityList(id) {
				purchase.GetCommodityByPurchaseOrderId(id).then(res => {
					// 新数据结构：直接使用purchaseEmployRecordList
					this.BatchCommodityList = res.data.purchaseEmployRecordList || [];
					// 设置费用列表（从后端返回的数据中获取）
					this.purchaseOrderCostList = res.data.purchaseOrderCostList || [];
				})
			},
			changAddedBatchCode(id) {
				this.shipperSelectedId = id;
				this.getBatchNewCodeByShipperId(id);
			},

			getPurchaseOrder() {
				purchase.getPurchaseOrderByCompanyId(this.companyId).then(res => {
					this.orderList = res.data.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
					if (this.orderList.length > 0) {
						this.selectBatch = this.orderList[0];
						this.getOrderCommodityList(this.selectBatch.id);
					}
				})
			},
			getBatchNewCodeByShipperId(Id) {
				category.GetNewBatchCode(this.companyId, Id).then(res => {
					this.batshNewCode = res.data
				})
			},
			// 计算总费用
			getTotalExpense() {
				return this.purchaseOrderCostList.reduce((total, cost) => {
					return total + (parseFloat(cost.amount) || 0);
				}, 0);
			},
			// 获取均摊方式标签
			getAllocationMethodLabel(value) {
				const methods = {
					1: '按重量均摊',
					2: '按数量均摊',
					3: '按种类均摊',
					4: '不均摊'
				};
				return methods[value] || '未知方式';
			},
			// 显示费用详情弹窗
			showExpenseDetailModal() {
				this.expenseDetailModalVisible = true;
			},
			// 关闭费用详情弹窗
			closeExpenseDetailModal() {
				this.expenseDetailModalVisible = false;
			}
		}

	}
</script>

<style>
	.containerAddBatch {
		display: flex;
		width: 100%;
		height: 80%;
	}

	.leftAddBatch {
		flex: 1;
		/* 左边占一半 */
		background-color: #f0f0f0;
		padding: 20px;
		box-sizing: border-box;
		border-radius: 5rpx;
	}

	.rightAddBatch {
		flex: 1;
		/* 右边占一半 */
		background-color: #ffffff;
		box-sizing: border-box;
	}

	/* 垂直标签栏样式 */
	.vertical-tabs {
		width: 150px;
		background-color: #f0f0f0;
		border-right: 1px solid #ccc;
		display: flex;
		flex-direction: column;
	}

	.vertical-tabs button {
		background-color: inherit;
		border: none;
		outline: none;
		padding: 15px;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.3s;
		font-size: 16px;
	}

	.vertical-tabs button:hover {
		background-color: #ddd;
	}

	.vertical-tabs button.active {
		background-color: #2196F3;
		color: white;
	}

	/* 内容区域 */
	.tab-content {
		flex-grow: 1;
		padding: 20px;
	}

	h2 {
		border-bottom: 1px solid gray;
		/* 默认无下划线 */
		padding: 5rpx;
		border-radius: 5rpx;
	}

	h2.selected {
		border-bottom: 2px solid gray;
		/* 下划线为蓝色 */
		background-color: #cacaca;
		/* 蓝色背景框，可以根据需求调整 */
		padding: 5rpx;
		border-radius: 5rpx;
	}

	/* 简洁风格表格样式 */
	.table-container {
	  margin: 0 5rpx;
	  border-radius: 8rpx;
	  overflow: hidden;
	  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}

	.table-header {
	  display: flex;
	  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
	  border-bottom: 2rpx solid #90caf9;
	}

	.table-cell {
	  padding: 12rpx 10rpx;
	  text-align: center;
	  font-size: 13rpx;
	  border-right: 1rpx solid #e9ecef;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}

	.table-cell.last-cell {
	  border-right: none;
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

	.table-row {
	  display: flex;
	  background-color: #ffffff;
	  border-bottom: 1rpx solid #f1f3f5;
	  transition: background-color 0.2s ease;
	}

	.table-row:hover {
	  background-color: #f8f9fa;
	}

	.table-row .table-cell {
		font-weight: 500;
		color: #333;
		font-size: 13rpx;
	}
	
	.goods-cell {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 5rpx;
	}
	
	.goods-name {
		font-size: 15rpx;
		font-weight: 600;
	}
	
	.goods-tag {
		height: 15rpx;
		line-height: 15rpx;
		font-size: 8rpx;
		padding: 0 2rpx;
		border-radius: 3rpx;
		border: 1rpx solid;
		display: inline-block;
	}
	
	.tag-blue {
		color: #31BDEC;
		border-color: #31BDEC;
	}
	
	.tag-green {
		color: #00aa00;
		border-color: #00aa00;
	}
	
	.tag-purple {
		color: #aa55ff;
		border-color: #aa55ff;
	}
	
	.tag-light-blue {
		color: #55aaff;
		border-color: #55aaff;
	}
	
	.tag-orange {
		color: #ff5500;
		border-color: #ff5500;
	}

	.total-row {
	  background: linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%);
	  font-weight: 600;
	  border-top: 2rpx solid #ff9800;
	  border-bottom: none;
	}

	.total-row:hover {
	  background: linear-gradient(180deg, #ffe0b2 0%, #ffd180 100%);
	}

	.total-row .table-cell {
		color: #e65100;
		font-weight: 600;
		font-size: 14rpx;
	}
	
	/* 费用标签样式 */
	.expense-label {
		display: inline-flex;
		align-items: center;
		height: 25rpx;
		padding: 0 10rpx;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
		
		&:hover {
			transform: scale(1.05);
			box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.4);
		}
		
		&:active {
			transform: scale(0.98);
		}
		
		.expense-label-text {
			font-size: 13rpx;
			font-weight: bold;
			color: white;
			line-height: 25rpx;
		}
	}
	
	/* 费用弹窗样式 */
	.expense-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	
	.expense-modal-wrapper {
		width: 650px;
		max-width: 90%;
		max-height: 90vh;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
	}

	.expense-modal-container {
		background: white;
		overflow: hidden;
	}

	.expense-modal-header {
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		padding: 15px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
		flex-shrink: 0;

		.header-title {
			font-size: 24px;
			font-weight: bold;
			color: #ffffff;
			flex: 1;
			text-align: center;
		}

		.expense-header-btn {
			min-width: 90px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			padding: 0 16px;
			border: 2px solid rgba(255, 255, 255, 0.5);
			border-radius: 8px;
			font-size: 16px;
			font-weight: bold;
			cursor: pointer;
			transition: all 0.2s;
			color: #ffffff;
			background: rgba(255, 255, 255, 0.1);

			&:hover {
				background: rgba(255, 255, 255, 0.2);
				border-color: rgba(255, 255, 255, 0.8);
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}
	
	/* 费用列表内容样式 */
	.expense-list-content {
		height: 500px;
		max-height: 60vh;
		background: #f5f7fa;
	}
	
	.expense-items-wrapper {
		padding: 20px;
	}
	
	.expense-item-card {
		background: #ffffff;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.2s ease;
		
		&:hover {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
			transform: translateY(-2px);
		}
	}
	
	.expense-item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	
	.expense-item-title {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}
	
	.expense-type-badge {
		display: inline-block;
		padding: 4px 12px;
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		color: white;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
	}
	
	.expense-amount {
		font-size: 24px;
		font-weight: bold;
		color: #ff6b6b;
	}
	
	.expense-item-info {
		padding-top: 12px;
		border-top: 1px solid #f0f0f0;
	}
	
	.expense-info-text {
		font-size: 14px;
		color: #606266;
	}
	
	.expense-total-summary {
		background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
		border-radius: 12px;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
		box-shadow: 0 4px 12px rgba(253, 203, 110, 0.3);
		
		.summary-label {
			font-size: 20px;
			font-weight: bold;
			color: #333;
		}
		
		.summary-amount {
			font-size: 28px;
			font-weight: bold;
			color: #d63031;
		}
	}
</style>