<template>
	<div :style="{ 'display': 'flex', 'height': WindowHeight + 'px', width: '100%', 'flex-direction': 'column', 'background-color': '#f5f5f5', 'box-sizing': 'border-box', 'overflow': 'hidden' }">
		<!-- 顶部导航栏 -->
		<div style="height: 56px; background: linear-gradient(135deg, #1890ff 0%, #1890ff 100%); display: flex; align-items: center; padding: 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; box-sizing: border-box;">
			<div @click="goBack" style="cursor: pointer; display: flex; align-items: center; color: white; font-weight: bold; font-size: 16px;">
				<uni-icons type="left" color="white" size="24" style="margin-right: 8px;"></uni-icons>
				返回
			</div>
			<div style="flex: 1; text-align: center; color: white; font-size: 18px; font-weight: bold; padding: 0 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
				批次结算详情
			</div>
			<div style="width: 60px;"></div>
		</div>

		<div style="flex: 1; display: flex; overflow: hidden; box-sizing: border-box;">
			<!-- 左侧 - 货款结算卡片 -->
			<div style="flex: 1; min-width: 0; padding: 6px; background: #fafafa; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden;">
				<div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow: hidden;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; box-sizing: border-box;">
						<div style="font-size: 17px; font-weight: 600; color: #333;">已结算货品汇总</div>
						<div style="display: flex; align-items: center; gap: 6px;">
							<text style="font-size: 14px; color: #666; font-weight: 500;">共{{ settleRecordCount }}条结算记录</text>
						</div>
					</div>

					<!-- 货品列表 -->
					<div style="border: solid 1px #e8e8e8; border-radius: 6px; overflow: hidden; flex: 1; display: flex; flex-direction: column; box-sizing: border-box; min-height: 0;">
						<!-- 表头 -->
						<div style="display: flex; background-color: #f5f7fa; font-weight: 600; border-bottom: 1px solid #e8e8e8; font-size: 15px; flex-shrink: 0; box-sizing: border-box;">
							<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06); position: relative; z-index: 5; box-sizing: border-box;">货品</div>
							<div style="flex: 2; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">销量</div>
							<div style="flex: 1; min-width: 60px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">均重</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">结算均价</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; color: #555; box-sizing: border-box;">结算货款</div>
						</div>

						<!-- 表格内容行 - 使用scroll-view -->
						<scroll-view 
							scroll-y="true" 
							:style="{ flex: 1, minHeight: 0, boxSizing: 'border-box' }"
							:show-scrollbar="true"
						>
							<div style="display: flex; border-bottom: 1px solid #f0f0f0; background: white; font-size: 14px; box-sizing: border-box;" 
								v-for="(item, index) in commodityList" :key="index">
								<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; font-weight: 500; color: #333; box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05); position: relative; z-index: 5; word-break: break-all; box-sizing: border-box;">
									{{ item.commodityName }}
								</div>
								<div style="flex: 2; min-width: 100px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; word-break: break-all; box-sizing: border-box;">
									<text v-for="model in item.outPutSaleMount">{{ model.mount }}{{ model.specName }}</text>({{ item.saleWeight }})
								</div>
								<div style="flex: 1; min-width: 60px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; box-sizing: border-box;">
									{{ item.averageWeight != null && item.averageWeight != 'NaN' && item.averageWeight != 'Infinity' ? item.averageWeight.toFixed(1) : '--' }}
								</div>
								<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; box-sizing: border-box;">
									{{ item.averagePrice != null && item.averagePrice != 'NaN' ? item.averagePrice.toFixed(1) : '0' }}
								</div>
								<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; font-weight: 500; color: #333; box-sizing: border-box;">
									{{ item.saleSubTotal }}
								</div>
							</div>
						</scroll-view>

						<!-- 合计 -->
						<div style="display: flex; border-top: 2px solid #e8e8e8; background: #fafbfc; font-size: 15px; flex-shrink: 0; box-sizing: border-box;">
							<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; font-weight: 600; color: #333; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06); position: relative; z-index: 5; box-sizing: border-box;">
								合计
							</div>
							<div style="flex: 5; min-width: 200px; padding: 12px 8px; text-align: center; font-weight: 500; color: #1890ff; word-break: break-all; box-sizing: border-box;">
								数量:{{ totalInfo.totalMount }} 重量:{{ totalInfo.totalWeight }}斤
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-left: 1px solid #e8e8e8; text-align: center; font-weight: 500; color: #999; box-sizing: border-box;">
								--
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; font-weight: 600; color: #1890ff; box-sizing: border-box;">
								¥{{ settleGoodMoney.toFixed(1) }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧 - 统计和详情区 -->
			<div :style="{ width: rightPanelWidth, maxWidth: '400px', minWidth: '280px', display: 'flex', flexDirection: 'column', background: '#fafafa', borderLeft: '1px solid #e8e8e8', flexShrink: 0, boxSizing: 'border-box' }">
				<!-- 右侧内容区（可滚动） -->
				<div style="flex: 1; padding: 8px; overflow-y: auto; box-sizing: border-box; min-height: 0;">
					<!-- 批次信息卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							批次信息
						</div>
						
						<div style="display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">批次编号</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ batchCode }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">货主</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ shipperName }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">结算记录数</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ settleRecordCount }}条</text>
							</div>
						</div>
					</div>

					<!-- 货款统计卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							货款统计
						</div>
						
						<div style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
							<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
								<text style="font-size: 15px; color: #666;">货款合计</text>
								<text style="font-size: 18px; font-weight: 600; color: #333;">¥{{ settleGoodMoney.toFixed(1) }}</text>
							</div>
							<div style="height: 1px; background: #f0f0f0;"></div>
							<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
								<text style="font-size: 15px; color: #666;">代卖费</text>
								<text style="font-size: 16px; font-weight: 500; color: #ff9800;">-¥{{ assistAmount.toFixed(1) }}</text>
							</div>
						</div>
					</div>

					<!-- 已结算费用卡片 -->
					<div v-if="expenseList.length > 0" style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							已结算费用
						</div>
						
						<!-- 费用列表 -->
						<div style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
							<div 
								v-for="(item, index) in expenseList" 
								:key="index"
								style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #fafafa; border-radius: 4px; border: 1px solid #e8e8e8; box-sizing: border-box;"
							>
								<div style="display: flex; align-items: center; gap: 8px; flex: 1;">
									<uni-icons type="checkmarkempty" color="#1890ff" size="18"></uni-icons>
									<div style="display: flex; flex-direction: column; gap: 2px;">
										<text style="font-size: 14px; font-weight: 500; color: #333;">{{ item.expensesLabel }}</text>
										<text v-if="item.remark" style="font-size: 12px; color: #999;">{{ item.remark }}</text>
									</div>
								</div>
								<text style="font-size: 15px; font-weight: 600; color: #ff6b35;">-¥{{ item.expensesMoney }}</text>
							</div>
						</div>
						
						<!-- 费用统计 -->
						<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
							<text style="font-size: 14px; color: #666;">结算费用合计</text>
							<text style="font-size: 16px; font-weight: 600; color: #ff6b35;">-¥{{ otherAmount.toFixed(1) }}</text>
						</div>
					</div>

					<!-- 应付金额卡片 -->
					<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 6px; padding: 18px; margin-bottom: 10px; border: 2px solid #64b5f6; box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15); box-sizing: border-box;">
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<div style="display: flex; align-items: center; gap: 8px;">
								<uni-icons type="wallet-filled" color="#1890ff" size="24"></uni-icons>
								<text style="font-size: 17px; font-weight: 600; color: #0d47a1;">应付金额</text>
							</div>
							<text style="font-size: 26px; font-weight: 700; color: #0d47a1;">¥{{ settleMoney.toFixed(1) }}</text>
						</div>
					</div>

					<!-- 付款信息卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							付款情况
						</div>
						
						<div style="display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">已付金额</text>
								<text style="font-size: 16px; font-weight: 600; color: #52c41a;">¥{{ paidAmount.toFixed(2) }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">未付金额</text>
								<text style="font-size: 16px; font-weight: 600; color: #ff4d4f;">¥{{ unPaidAmount.toFixed(2) }}</text>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 底部固定付款按钮 -->
				<div style="background: white; padding: 12px; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); border-top: 1px solid #e8e8e8; flex-shrink: 0; box-sizing: border-box;">
					<button 
						@click="showPaymentDialog"
						:disabled="unPaidAmount <= 0"
						:style="{ 
							width: '100%', 
							height: '44px', 
							lineHeight: '44px', 
							background: unPaidAmount <= 0 ? '#ccc' : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
							color: 'white', 
							fontWeight: '600', 
							fontSize: '16px', 
							borderRadius: '8px', 
							border: 'none', 
							boxShadow: unPaidAmount > 0 ? '0 2px 6px rgba(24, 144, 255, 0.3)' : 'none',
							cursor: unPaidAmount <= 0 ? 'not-allowed' : 'pointer',
							boxSizing: 'border-box'
						}">
						{{ unPaidAmount <= 0 ? '已完成全部付款' : '确认付款' }}
					</button>
				</div>
			</div>
		</div>
		
		<!-- 付款弹窗 -->
		<div v-if="showPaymentModal" class="payment-modal-container">
			<div class="payment-modal-overlay" @click="closePaymentDialog"></div>
			<div class="payment-modal">
				<div class="payment-modal-header">
					<h3>确认付款</h3>
					<div class="close-btn" @click="closePaymentDialog">
						<uni-icons type="close" color="white" size="20"></uni-icons>
					</div>
				</div>
				
				<div class="payment-modal-body">
					<!-- 付款金额输入 -->
					<div class="input-section">
						<label class="input-label">
							<uni-icons custom-prefix="iconfont" type="icon-yen" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							付款金额
						</label>
						<div class="amount-input-wrapper">
							<input 
								v-model="paymentAmount" 
								type="digit" 
								placeholder="请输入付款金额"
								class="amount-input"
							/>
							<span class="currency-unit">元</span>
						</div>
					</div>

					<!-- 支付方式选择 -->
					<div class="input-section">
						<label class="input-label">
							<uni-icons type="wallet" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							支付方式
						</label>
						<div class="payment-methods">
							<div 
								@click="paymentMethod = '现金'"
								:class="['payment-method-btn', { 'active': paymentMethod === '现金' }]"
							>
								<uni-icons type="wallet-filled" :color="paymentMethod === '现金' ? '#1890ff' : '#999'" size="20"></uni-icons>
								<text>现金</text>
							</div>
							<div 
								@click="paymentMethod = '微信'"
								:class="['payment-method-btn', { 'active': paymentMethod === '微信' }]"
							>
								<uni-icons custom-prefix="iconfont" type="icon-weixin" :color="paymentMethod === '微信' ? '#1890ff' : '#999'" size="20"></uni-icons>
								<text>微信</text>
							</div>
							<div 
								@click="paymentMethod = '支付宝'"
								:class="['payment-method-btn', { 'active': paymentMethod === '支付宝' }]"
							>
								<uni-icons custom-prefix="iconfont" type="icon-zhifubao" :color="paymentMethod === '支付宝' ? '#1890ff' : '#999'" size="20"></uni-icons>
								<text>支付宝</text>
							</div>
							<div 
								@click="paymentMethod = '银行卡'"
								:class="['payment-method-btn', { 'active': paymentMethod === '银行卡' }]"
							>
								<uni-icons type="wallet" :color="paymentMethod === '银行卡' ? '#1890ff' : '#999'" size="20"></uni-icons>
								<text>银行卡</text>
							</div>
						</div>
					</div>

					<!-- 付款备注 -->
					<div class="input-section">
						<label class="input-label">
							<uni-icons type="compose" size="16" color="#666" style="margin-right: 8px;"></uni-icons>
							付款备注（可选）
						</label>
						<textarea 
							v-model="paymentRemark" 
							placeholder="请输入付款备注"
							class="remark-textarea"
						/>
					</div>
				</div>

				<!-- 操作按钮 -->
				<div class="payment-modal-footer">
					<button class="btn-cancel" @click="closePaymentDialog">
						<uni-icons type="close" size="16" color="#666" style="margin-right: 5px;"></uni-icons>
						取消
					</button>
					<button class="btn-confirm" @click="handlePayment">
						<uni-icons type="checkmarkempty" size="16" color="white" style="margin-right: 5px;"></uni-icons>
						确认付款
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import batch from '../../api/batch/batch';
import shipperApi from '../../api/shipper/shipperApi';

export default {
	data() {
		return {
			WindowHeight: 0,
			WindowWidth: 0,
			batchId: '',
			batchCode: '',
			shipperName: '',
			shipperId: '', // 货主ID
			settleRecordCount: 0,
			commodityList: [],
			expenseList: [],
			totalInfo: {
				totalMount: 0,
				totalWeight: 0
			},
			// 从API返回的结算金额字段
			settleGoodMoney: 0, // 货款
			assistAmount: 0, // 代卖费
			otherAmount: 0, // 结算费用
			settleMoney: 0, // 应付金额
			paidAmount: 0, // 已付金额
			unPaidAmount: 0, // 未付金额
			// 付款弹窗相关
			showPaymentModal: false,
			paymentAmount: '',
			paymentRemark: '',
			paymentMethod: '' // 支付方式
		}
	},
	computed: {
		// 动态计算右侧面板宽度
		rightPanelWidth() {
			if (this.WindowWidth < 768) {
				return '280px';
			} else if (this.WindowWidth < 1024) {
				return '30%';
			} else {
				return '350px';
			}
		}
	},
	onLoad(options) {
		const windowInfo = uni.getWindowInfo();
		this.WindowHeight = windowInfo.windowHeight;
		this.WindowWidth = windowInfo.windowWidth;
		
		// 从页面参数获取数据
		if (options.batchId) {
			this.batchId = options.batchId;
		}
		if (options.batchCode) {
			this.batchCode = decodeURIComponent(options.batchCode);
		}
		if (options.shipperName) {
			this.shipperName = decodeURIComponent(options.shipperName);
		}
		if (options.shipperId) {
			this.shipperId = options.shipperId;
		}
		this.loadBatchSettlementData();
		
		// 监听窗口大小变化
		// #ifdef H5
		window.addEventListener('resize', this.handleResize);
		// #endif
	},
	
	beforeDestroy() {
		// 移除窗口大小变化监听
		// #ifdef H5
		window.removeEventListener('resize', this.handleResize);
		// #endif
	},
	
	methods: {
		// 处理窗口大小变化
		handleResize() {
			const windowInfo = uni.getWindowInfo();
			this.WindowHeight = windowInfo.windowHeight;
			this.WindowWidth = windowInfo.windowWidth;
		},
		
		goBack() {
			uni.navigateBack();
		},
		
		// 加载批次结算数据
		loadBatchSettlementData() {
			uni.showLoading({
				title: '加载中...'
			});
			
			batch.GetAllSettleRecordContentByBatchId(this.batchId).then(res => {
				uni.hideLoading();
				
				if (res && res.data) {
					const data = res.data;
					
					// 批次结算汇总信息
					this.batchId = data.batchId || this.batchId;
					this.settleRecordCount = data.settleRecordCount || 0;
					
					// 从API获取货主ID（如果返回数据中有）
					if (data.shipperId) {
						this.shipperId = data.shipperId;
					}
					
					// 从API获取实际金额字段
					this.settleGoodMoney = Math.abs(parseFloat(data.settleGoodMoney) || 0); // 货款
					this.assistAmount = Math.abs(parseFloat(data.assistAmount) || 0); // 代卖费
					this.otherAmount = Math.abs(parseFloat(data.otherAmount) || 0); // 结算费用
					this.settleMoney = parseFloat(data.settleMoney) || 0; // 应付金额
					this.paidAmount = parseFloat(data.paidAmount) || 0; // 已付金额
					this.unPaidAmount = parseFloat(data.unPaidAmount) || 0; // 未付金额
					
					// 汇总的货品列表
					this.commodityList = data.allSettlePurchaseAssistList || [];
					
					// 汇总的费用列表
					this.expenseList = data.allSettleExpenseList || [];
					
					// 只计算货品统计信息（数量和重量）
					this.calculateTotalInfo();
					
				} else {
					uni.showToast({
						title: '加载数据失败',
						icon: 'error'
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('加载批次结算数据失败:', error);
				uni.showToast({
					title: '加载数据失败',
					icon: 'error'
				});
			});
		},
		
		// 计算货品统计信息（只计算数量和重量）
		calculateTotalInfo() {
			let totalMount = 0;
			let totalWeight = 0;
			
			this.commodityList.forEach(item => {
				totalWeight += (item.saleWeight || 0);
				
				if (item.outPutSaleMount && Array.isArray(item.outPutSaleMount)) {
					item.outPutSaleMount.forEach(model => {
						totalMount += (model.mount || 0);
					});
				}
			});
			
			this.totalInfo = {
				totalMount,
				totalWeight: totalWeight.toFixed(1)
			};
		},
		
		// 显示付款弹窗
		showPaymentDialog() {
			if (this.unPaidAmount <= 0) {
				uni.showToast({
					title: '已完成全部付款',
					icon: 'none'
				});
				return;
			}
			this.showPaymentModal = true;
			// 默认填充未付金额
			this.paymentAmount = this.unPaidAmount.toFixed(2);
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
		handlePayment() {

			let that = this;
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
			
			if (amount > this.unPaidAmount) {
				uni.showModal({
					title: '提示',
					content: `付款金额(¥${amount.toFixed(2)})超过未付金额(¥${this.unPaidAmount.toFixed(2)})，是否继续？`,
					success: (res) => {
						if (res.confirm) {
							that.executePayment(amount);
						}
					}
				});
				return;
			}
			
			that.executePayment(amount);
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
				batchIdList: [this.batchId],
				shipperId: this.shipperId
			};
			
			// 调用创建付款记录API
			shipperApi.createShipperPaidRecord(paidRecord).then(res => {
				uni.hideLoading();
				
				if (res && res.code === 200) {
					// 更新付款信息
					this.paidAmount = parseFloat((this.paidAmount + amount).toFixed(2));
					this.unPaidAmount = parseFloat((this.unPaidAmount - amount).toFixed(2));
					
					// 关闭弹窗
					this.closePaymentDialog();
					
					uni.showToast({
						title: '付款成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							// 如果已全部付款，延迟返回
							if (this.unPaidAmount <= 0) {
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							}
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
		}
	}
}
</script>

<style scoped>
/* 防止页面横向滚动 */
* {
	box-sizing: border-box;
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
	background: #a1a1a1;
}

/* 输入框样式 */
input, textarea {
	outline: none;
}

input:focus, textarea:focus {
	border-color: #1890ff !important;
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
}

.payment-modal-header h3 {
	color: white;
	font-size: 18px;
	font-weight: 600;
	margin: 0;
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
}

.close-btn:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(1.1);
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
}

.payment-method-btn:hover {
	border-color: #1890ff;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.payment-method-btn.active {
	border-color: #1890ff;
	background: #e6f7ff;
	color: #1890ff;
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.payment-method-btn text {
	font-size: 13px;
}

/* 金额输入 */
.amount-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.amount-input {
	flex: 1;
	padding: 0px 50px 0px 15px;
	border: 2px solid #e9ecef;
	border-radius: 8px;
	font-size: 20rpx;
	transition: all 0.3s ease;
}

.amount-input:focus {
	border-color: #1890ff;
	box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
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
}

.remark-textarea:focus {
	border-color: #1890ff;
	box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
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
	font-size: 15px;
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
}

.btn-cancel:hover {
	background: #f8f9fa;
	border-color: #dee2e6;
}

.btn-confirm {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.btn-confirm:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.btn-confirm:active {
	transform: translateY(0);
}

/* 响应式适配 */
@media screen and (max-width: 1024px) {
	* {
		font-size: 13px !important;
	}
}

@media screen and (max-width: 768px) {
	* {
		font-size: 12px !important;
	}
	
	.card {
		padding: 8px !important;
	}
}

@media screen and (max-width: 600px) {
	* {
		font-size: 11px !important;
	}
	
	.card {
		padding: 6px !important;
		margin: 4px !important;
	}
}
</style>

