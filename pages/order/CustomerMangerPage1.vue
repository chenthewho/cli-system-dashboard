<template>
	<view class="customer-detail-container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="back-button" @click="back">
				<u-icon name="arrow-left" color="#3b82f6" size="18"></u-icon>
				<span class="back-text">返回</span>
			</view>
			
			<!-- 加载中状态 -->
			<view class="customer-info-card loading-card" v-if="!customerInfo">
				<view class="loading-content">
					<text class="loading-text">客户信息加载中...</text>
				</view>
			</view>
			
			<view class="customer-info-card" v-if="customerInfo" @click="openEditCustomer">
				<view class="customer-main-info">
					<view class="customer-name-phone">
						<view class="name-section">
							<uni-icons custom-prefix="iconfont" type="icon-kehu" size="16" color="#3b82f6"></uni-icons>
							<span class="customer-name">{{customerInfo.customName || ''}}</span>
						</view>
						<view class="phone-section">
							<uni-icons custom-prefix="iconfont" type="icon-dianhua" size="14" color="#6b7280"></uni-icons>
							<span class="customer-phone">{{customerInfo.customPhone || ''}}</span>
						</view>
					</view>
				</view>
				
				<view class="customer-stats-row">
					<view class="stat-item debt-stat">
						<span class="stat-label">总欠款</span>
						<span class="stat-value debt-amount">{{customerInfo.debts || 0}}元</span>
					</view>
					<view class="stat-item">
						<span class="stat-label">总欠筐</span>
						<span class="stat-value">{{customerInfo.owebasket || 0}}个</span>
					</view>
				</view>
			</view>
			
			<view class="action-buttons">
				<button class="action-btn basket-btn" @click="showBasketModel">
					<span>收筐</span>
				</button>
				<button class="action-btn repay-btn" @click="showPayModel">
					<span>还款</span>
				</button>
				<button class="action-btn share-btn" @click="GetCustomerClientShareImage">
					<uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="14" color="#ffffff"></uni-icons>
					<span>分享</span>
				</button>
			</view>
		</view>
		
		<!-- 订单列表区域 -->
		<view class="orders-section">
			<view class="orders-header">
				<view class="select-all-section">
					<u-checkbox-group name="allCheck" @change="changeAll">
						<u-checkbox key="all" :checked="checkboxValue.length==moduleList.length" shape="circle"></u-checkbox>
					</u-checkbox-group>
					<span class="select-text">已选</span>
					<span class="select-count" v-if="checkboxValue.length>0">({{checkboxValue.length}}单)</span>
					<span class="select-debt" v-if="selectDebt>0">{{selectDebt}}元</span>
				</view>
			</view>

			<scroll-view class="orders-scroll" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
				<view class="orders-list">
					<view v-for="item in moduleList" :key="item.id" class="order-item">
						<view class="order-checkbox">
							<u-checkbox-group placement="column" @change="checkboxChange(item.id)">
								<u-checkbox class="modern-checkbox" :key="item.id" label="" :checked="checkboxValue.includes(item.id)" />
							</u-checkbox-group>
						</view>

						<view class="order-card" @click="showOrderDetail(item)">
							<view class="order-header">
								<view class="order-time">{{ item.createTime.replace("T", " ") }}</view>
								<view class="order-amounts">
									<view class="debt-amount" v-if="item.debt && item.debt > 0">
										待付: <span class="debt-value">{{ item.debt }}</span> 元
									</view>
									<view class="actual-amount">实收: {{ item.actualMoney }} 元</view>
								</view>
							</view>
							
							<view class="order-content">
								<view class="order-info">{{ item.moduleInfo }}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 还款/收筐弹窗 -->
		<u-modal title="" class="modern-operation-modal" :show="payTypeDialogVisible" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="modelType==1?700:500" @close="payTypeDialogVisible = false">
			<view class="operation-modal-container">
				<view class="modal-header">
					<h3 class="modal-title">{{modelTitle}}</h3>
					<button class="modal-close" @click="payTypeDialogVisible = false">
						<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="18" color="#666"></uni-icons>
					</button>
				</view>
				
				<view class="operation-content">
					<!-- 支付方式选择（仅还款时显示） -->
					<view class="payment-methods-section" v-if="modelType==1">
						<view class="section-title">支付方式</view>
						<view class="payment-methods-grid">
							<view class="payment-method-item" 
								:class="{'active': item.select == 1}"
								v-for="(item, index) in payWay" 
								:key="item.id"
								@click="changPayWay(index)">
								<u-icon :name="item.coin" :color="item.color" size="24"></u-icon>
								<span class="method-label">{{item.label}}</span>
							</view>
						</view>
					</view>
					
					<!-- 输入区域 -->
					<view class="input-keypad-grid">
						<view class="input-section">
							<view class="input-row">
								<label class="input-label" v-if="modelType==1">还款金额</label>
								<label class="input-label" v-if="modelType==2">收筐数量</label>
								<label class="input-label" v-if="modelType==3">下欠金额</label>
								<input class="amount-input" 
									:value="modelType==2 ? repayBasket : repayMoney" 
									inputmode="none" readonly>
							</view>
						</view>
						
						<!-- 数字键盘 -->
						<view class="compact-keypad">
							<view class="keypad-row">
								<button class="keypad-btn" @click="NumberCk2(1)">1</button>
								<button class="keypad-btn" @click="NumberCk2(2)">2</button>
								<button class="keypad-btn" @click="NumberCk2(3)">3</button>
								<button class="keypad-btn special-btn" @click="Tuige2()">退格</button>
							</view>
							<view class="keypad-row">
								<button class="keypad-btn" @click="NumberCk2(4)">4</button>
								<button class="keypad-btn" @click="NumberCk2(5)">5</button>
								<button class="keypad-btn" @click="NumberCk2(6)">6</button>
								<button class="keypad-btn clear-btn" @click="Clear2()">清空</button>
							</view>
							<view class="keypad-row">
								<button class="keypad-btn" @click="NumberCk2(7)">7</button>
								<button class="keypad-btn" @click="NumberCk2(8)">8</button>
								<button class="keypad-btn" @click="NumberCk2(9)">9</button>
								<button class="keypad-btn empty-btn"></button>
							</view>
							<view class="keypad-row">
								<button class="keypad-btn wide-btn" @click="NumberCk2(0)">0</button>
								<button class="keypad-btn" @click="NumberCk2('.')">.</button>
								<button class="keypad-btn empty-btn"></button>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 操作按钮 -->
				<view class="modal-actions">
					<button class="modal-btn cancel-btn" @click="payTypeDialogVisible = false">
						<span v-if="modelType==1">取消收款</span>
						<span v-if="modelType==2">取消收筐</span>
						<span v-if="modelType==3">取消</span>
					</button>
					<button class="modal-btn confirm-btn" 
						@click="modelType==1 ? payTypeConfirm() : (modelType==2 ? payBasketConfirm() : AddRepayConfirm())">
						<span v-if="modelType==1">确认收款</span>
						<span v-if="modelType==2">确认收筐</span>
						<span v-if="modelType==3">确认下欠</span>
					</button>
				</view>
			</view>
		</u-modal>
		
	<!-- 编辑客户信息弹窗 -->
	<view class="modern-customer-modal" v-if="customerDialogVisible">
		<div class="modal-container">
			<div class="modal-header">
				<h3 class="modal-title">编辑客户信息</h3>
			</div>
			
			<div class="form-container">
				<div class="form-row">
					<label class="form-label">客户名称 <text class="required">*</text></label>
					<input class="form-input" type="text" placeholder="请输入客户名称（必填）" v-model="customerInfo_copy.customName" />
				</div>
				
				<div class="form-row">
					<label class="form-label">联系方式 <text class="optional">（选填）</text></label>
					<input class="form-input" type="text" placeholder="请输入联系方式" v-model="customerInfo_copy.customPhone" />
				</div>
				
				<div class="form-row">
					<label class="form-label">车牌号码 <text class="optional">（选填）</text></label>
					<input class="form-input" type="text" placeholder="请输入车牌号码" v-model="customerInfo_copy.carNum" />
				</div>
				
				<div class="form-row">
					<label class="form-label">联系地址 <text class="optional">（选填）</text></label>
					<input class="form-input" type="text" placeholder="请输入联系地址" v-model="customerInfo_copy.address" />
				</div>
				
				<div class="form-actions">
					<button class="form-btn cancel-btn" @click="customerDialogVisible = false">取消</button>
					<button class="form-btn submit-btn" @click="submit()">确认修改</button>
				</div>
			</div>
		</div>
	</view>

		<!--还筐弹窗(不抵扣)-->
		<RepayBasketModel ref="repayBasketModelRef" :basketData="extraModel" @saveBasketOffest="saveBasketOffestMethod"></RepayBasketModel>
		<!--还款弹窗-->
		<RepaymentModal :visible="showRepaymentModal"
      :customerInfo="customerInfo"
      @confirm="handleRepaymentConfirm"
      @close="showRepaymentModal = false">
		</RepaymentModal>


	
		<!-- 订单详情抽屉 -->
		<view class="drawer-container" v-if="orderDetailVisible">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': orderDetailVisible }" @tap="closeOrderDetail"></view>
			
			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': orderDetailVisible }">
				<!-- 订单详情抽屉 -->
				<div class="order-detail-container" v-if="orderDetailVisible && selectedOrder">
					<!-- 抽屉头部 -->
					<view class="detail-header-new">
						<view class="header-left">
							<uni-icons type="list" size="18" color="#fff"></uni-icons>
							<text class="detail-title-new">订单详情</text>
						</view>
						<view class="header-right">
							<view class="close-btn" @tap="closeOrderDetail">
								<uni-icons type="close" size="24" color="#fff"></uni-icons>
							</view>
						</view>
					</view>

					<scroll-view scroll-y="true" style="height: calc(100vh - 115rpx);">
						<!-- 订单概览信息 -->
						<div class="order-info-grid-compact">
							<!-- 第一行 -->
							<div class="info-row">
								<div class="info-item-new">
									<text class="info-value-new info-value-small">{{ selectedOrder.createTime ? selectedOrder.createTime.replace("T", " ") : "" }}</text>
								</div>
								<div class="info-item-new">
									<text class="info-value-new info-value-small">{{ selectedOrder.accountCode || "-" }}</text>
								</div>
							</div>
							
							<!-- 第二行 -->
							<div class="info-row">
								<div class="info-item-new">
									<text class="info-value-new info-value-small">{{ selectedOrder.customName || "散客" }}</text>
								</div>
								<div class="info-item-new">
									<text class="info-label-new">总计金额:</text>
									<text class="info-value-new highlight-value">{{ selectedOrder.payableAmount || 0 }}</text>
								</div>
							</div>
							
							<!-- 第三行 -->
							<div class="info-row">
								<div class="info-item-new" v-if="selectedOrder.basketOffsetAmount">
									<text class="info-label-new">押筐抵扣:</text>
									<text class="info-value-new">{{ selectedOrder.basketOffsetAmount || 0 }}</text>
								</div>
								<div class="info-item-new">
									<text class="info-label-new">实付金额:</text>
									<text class="info-value-new highlight-value">{{ selectedOrder.actualMoney || 0 }}</text>
								</div>
							</div>
							
							<!-- 第四行 - 下欠和状态 -->
							<div class="info-row">
								<div class="info-item-new" v-if="selectedOrder.debt > 0">
									<text class="info-label-new">下欠:</text>
									<text class="info-value-new debt-value-new">{{ selectedOrder.debt }}</text>
								</div>
								<div class="info-item-status" v-if="selectedOrder.status !== 1">
									<view class="status-container-flex">
										<view class="status-tag-group">
											<view class="status-tag status-modified-tag" v-if="selectedOrder.status == 5">
												<uni-icons type="compose" size="12" color="#31BDEC"></uni-icons>
												<text class="status-tag-text">已修改</text>
											</view>
											<view class="status-tag status-refunded-tag" v-if="selectedOrder.status == 2">
												<uni-icons type="undo" size="12" color="#F56C6C"></uni-icons>
												<text class="status-tag-text">退单</text>
											</view>
										</view>
									</view>
								</div>
							</div>
						</div>

						<!-- 商品列表 -->
						<div class="product-table-container" v-if="selectedOrder.modelList && selectedOrder.modelList.length > 0">
							<div class="product-table">
								<div class="table-row table-header-row">
									<div class="table-header-cell">货品</div>
									<div class="table-header-cell">数量</div>
									<div class="table-header-cell">总重</div>
									<div class="table-header-cell">皮重</div>
									<div class="table-header-cell">单价</div>
									<div class="table-header-cell">小计</div>
								</div>

								<div class="table-row table-body-row" v-for="(item, index) in selectedOrder.modelList" :key="index">
									<div class="table-cell">{{ item.name }}</div>
									<div class="table-cell">{{ item.mount }}</div>
									<div class="table-cell">{{ item.totalWeight }}</div>
									<div class="table-cell">{{ item.tareWeight }}</div>
									<div class="table-cell">{{ item.referenceAmount }}</div>
									<div class="table-cell">{{ item.subtotal }}</div>
								</div>
							</div>
						</div>

						<!-- 无商品数据提示 -->
						<div v-else class="no-products">
							<view class="no-products-icon">
								<uni-icons type="info-filled" size="24" color="#bdc3c7"></uni-icons>
							</view>
							<text class="no-products-text">暂无商品信息</text>
						</div>
					</scroll-view>

					<!-- 操作按钮区域 -->
					<view class="order-action-buttons-compact">
						<u-button v-if="selectedOrder.status!=2" 
							class="action-btn-compact modify-btn-new"
							type="primary" 
							@click="modifyOrder" 
							text="改单">
						</u-button>
						<u-button v-if="selectedOrder.status!=2" 
							class="action-btn-compact refund-btn-new"
							type="primary" 
							@click="refundOrder" 
							text="退单">
						</u-button>
						<u-button v-if="selectedOrder.debt>0"
							class="action-btn-compact repay-btn-new"
							type="primary" 
							text="整单还款" 
							@click="repayOrder">
						</u-button>
						<u-button 
							class="action-btn-compact print-btn-new"
							type="primary"
							text="打印" 
							@click="printOrder">
						</u-button>
					</view>
				</div>
			</view>
		</view>

		<!-- 隐藏的canvas，用于生成客户账单图片 -->
		<canvas canvas-id="customerCanvas" style="width: 500px; height: 400px; position: fixed; left: -9999px; top: -9999px;"></canvas>

		</view>
		
</template>

<script>
	import OrderItem from '@/components/OrderItem.vue'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import member from '../../api/member/member'
	import category from '@/api/goods/category'
	import RepayBasketModel from '@/components/repay-basket-model.vue'
	import RepaymentModal from '@/components/RepaymentModal.vue'
	export default {
		name: 'CustomerMangerPage1',
		components: {
			OrderItem,
			RepayBasketModel,
			RepaymentModal
		},
		data() {
			return {
				list: ['全部', '未付款', '已付款', '赊账'],
				tabs1Current: 0,
				moduleList: [],
				customerId: "",
				customerInfo: null,
				customerInfo_copy: {},
				checkboxValue: [],
				extraModel:[],
				selectDebt: 0,
				scrollHeight: 0,
				selectBasket: 0,
				payTypeDialogVisible: false,
				customerDialogVisible:false,
				showRepaymentModal:false,
				repayMoney: 0,
				repayBasket:0,
				currentPayWay:1,
				modelType :1,
				modelTitle:"",
			orderDetailVisible: false,
			selectedOrder: null,
			scrollHeight: 0,
				payWay: [{
						label: "微信支付",
						coin: "weixin-fill",
						select: 1,
						color: "green",
						id: 1
					},
					{
						label: "现金",
						coin: "red-packet-fill",
						select: 0,
						color: "red",
						id: 2
					},
					{
						label: "支付宝",
						coin: "zhifubao",
						select: 0,
						color: "blue",
						id: 3
					}
				]
			}
		},
		onLoad(options) {
			this.customerId = options.customerId;
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 145;
			this.getallextralgood();
		},
	created() {
	this.refreshModule();
	},
		methods: {
			// 显示订单详情
		showOrderDetail(order) {
			console.log('显示订单详情:', order);
			this.selectedOrder = order;
			// 如果订单有商品列表，解析它
			if (order.module) {
				try {
					this.selectedOrder.modelList = JSON.parse(order.module);
				} catch (e) {
					console.error('解析订单商品列表失败:', e);
					this.selectedOrder.modelList = [];
				}
			} else {
				this.selectedOrder.modelList = [];
			}
			// 过滤掉type为4的项目，并按type排序
			if (this.selectedOrder.modelList && Array.isArray(this.selectedOrder.modelList)) {
				this.selectedOrder.modelList = this.selectedOrder.modelList
					.filter(item => item.type !== 4)
					.sort((a, b) => a.type - b.type);
			}
			// 显示订单详情抽屉
			this.orderDetailVisible = true;
		},
			// 打印订单
			printOrder() {
				console.log('打印订单:', this.selectedOrder);
				// TODO: 实现打印功能
				uni.showToast({
					title: '打印功能开发中',
					icon: 'none'
				});
			},
		// 分享订单
		shareOrder() {
			console.log('分享订单:', this.selectedOrder);
			// TODO: 实现分享功能
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			});
		},
		
		// 关闭订单详情抽屉
		closeOrderDetail() {
			this.orderDetailVisible = false;
			this.selectedOrder = null;
		},
		
		// 改单操作
		modifyOrder() {
			console.log('改单操作:', this.selectedOrder);
			// TODO: 实现改单功能
			uni.navigateTo({
				url: '/pages/cashier/tuigeCashier?order=' + JSON.stringify(this.selectedOrder)
			});
		},
		
		// 退单操作
		refundOrder() {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '您确定要退单吗？',
				success: (res) => {
					if (res.confirm) {
						that.refundOrderAction();
					}
				}
			});
		},
		
		// 执行退单操作
		refundOrderAction() {
			var userInfo = uni.getStorageSync("userInfo");
			var CompanyId = uni.getStorageSync('companyId');
			let param = {
				type: 10,
				companyId: CompanyId,
				operatorId: userInfo.id,
				operatorName: userInfo.userName,
				content: this.selectedOrder.id
			}
			// 这里需要引入对应的API
			// cashierOrder.TuigeAccount(JSON.stringify(param)).then(res => {
			// 	if (res.code == 200) {
			// 		uni.showToast({
			// 			title: '退单成功',
			// 			icon: 'none'
			// 		});
			// 		this.closeOrderDetail();
			// 		this.refreshModule();
			// 	}
			// });
			
			// 临时提示
			uni.showToast({
				title: '退单功能开发中',
				icon: 'none'
			});
		},
		
		// 整单还款操作
		repayOrder() {
			console.log('整单还款:', this.selectedOrder);
			// TODO: 实现整单还款功能
			uni.showToast({
				title: '整单还款功能开发中',
				icon: 'none'
			});
		},
		
		// 获取订单状态文本
		getOrderStatusText(status) {
			switch(status) {
				case 1: return '正常';
				case 2: return '退单';
				case 5: return '已修改';
				default: return '未知';
			}
		},
		
		// 获取订单状态样式类
		getOrderStatusClass(status) {
			switch(status) {
				case 1: return 'status-normal';
				case 2: return 'status-refund';
				case 5: return 'status-modified';
				default: return 'status-unknown';
			}
		},
			//处理还款事件
			handleRepaymentConfirm(data) {
				console.log("handleRepaymentConfirm", data)
				this.refreshModule();
			},
			saveBasketOffestMethod(){
				console.log("saveBasketOffestMethod")
				this.refreshModule();
			},
			getallextralgood() {
				let that = this;
				const companyId = uni.getStorageSync('companyId');
				this.extraModel = [];
				category.getallextralgood(companyId).then(res => {
					console.log("getallextralgood", res)
					that.extraModel = res.data;
					that.extraModel.forEach(x => {
						x.quantity = 0;
						x.money = 0;
					})
					console.log("that.extraModel", that.extraModel)
				})
			},
			GetCustomerClientShareImage(){
				// 使用canvas生成客户欠款信息图片
				this.generateCustomerShareImage();
			},
			
			// 使用canvas生成客户欠款信息封面（简化版）
			generateCustomerShareImage() {
				const that = this;
				const customer = this.customerInfo;
				
				if (!customer) {
					uni.showToast({
						title: '客户信息加载中',
						icon: 'none'
					});
					return;
				}
				
				// 获取公司信息
				const companyId = uni.getStorageSync('companyId');
				const cashierOrder = require('../../api/cashier/cashierOrder').default;
				cashierOrder.getStoreInfo(companyId).then(res => {
					const companyInfo = res.data || {};
					const companyName = companyInfo.name || '店铺名称';
					
				// 创建canvas上下文
				const ctx = uni.createCanvasContext('customerCanvas', this);
				
				// 画布尺寸（微信分享封面标准尺寸 5:4 比例）
				const canvasWidth = 500;
				const canvasHeight = 400;
				const padding = 30;
				
				// 白色背景
				ctx.setFillStyle('#FFFFFF');
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);
				
				// 画边框
				ctx.setStrokeStyle('#3b82f6');
				ctx.setLineWidth(3);
				const paddingRect = 8;
				ctx.strokeRect(paddingRect, paddingRect, canvasWidth - paddingRect * 2, canvasHeight - paddingRect * 2);
				
				let y = 40;
				
				// 绘制标题（客户名称）
				ctx.setFillStyle('#1e3a8a');
				ctx.setFontSize(28);
				ctx.setTextAlign('center');
				ctx.fillText(customer.customName || '客户', canvasWidth / 2, y);
				y += 40;
				
				// 公司名称
				ctx.setFontSize(22);
				ctx.setFillStyle('#3b82f6');
				ctx.fillText(companyName, canvasWidth / 2, y);
				y += 50;
				
				// 账单信息卡片（总欠款）
				const cardPadding = 40;
				const cardHeight = 90;
				const cardY = y;
				
				// 账单背景框（粉色背景）
				ctx.setFillStyle('#fef2f2');
				ctx.fillRect(cardPadding, cardY, canvasWidth - cardPadding * 2, cardHeight);
				
				// 账单标签
				ctx.setFontSize(24);
				ctx.setFillStyle('#6b7280');
				ctx.setTextAlign('left');
				ctx.fillText('账单', cardPadding + 25, cardY + 35);
				
				// 账单金额（总欠款，红色）
				ctx.setFontSize(42);
				ctx.setFillStyle('#dc2626');
				ctx.setTextAlign('right');
				const debtText = `¥${customer.debts || 0}`;
				ctx.fillText(debtText, canvasWidth - cardPadding - 25, cardY + 58);
				
				y += cardHeight + 45;
				
				// 账单时间
				ctx.setFontSize(18);
				ctx.setFillStyle('#9ca3af');
				ctx.setTextAlign('center');
				const now = new Date();
				const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
				ctx.fillText(`账单日期: ${dateStr}`, canvasWidth / 2, y);
					
					// 绘制完成，导出图片
					ctx.draw(false, () => {
						setTimeout(() => {
							uni.canvasToTempFilePath({
								canvasId: 'customerCanvas',
								x: 0,
								y: 0,
								width: canvasWidth,
								height: canvasHeight,
								destWidth: canvasWidth * 2,  // 2倍分辨率
								destHeight: canvasHeight * 2,
								fileType: 'png',
								quality: 1,
								success: (res) => {
									console.log('生成客户账单图片成功:', res.tempFilePath);
									// 直接保存并分享图片
									that.saveAndShareCustomerImage(res.tempFilePath);
								},
								fail: (err) => {
									console.error('生成图片失败:', err);
									uni.showToast({
										title: '生成图片失败',
										icon: 'none'
									});
								}
							}, that);
						}, 500);
					});
				}).catch(err => {
					console.error('获取公司信息失败:', err);
					uni.showToast({
						title: '获取公司信息失败',
						icon: 'none'
					});
				});
			},
			
			// 直接分享客户账单图片（不保存到相册）
			saveAndShareCustomerImage(tempFilePath) {
				const that = this;
				// 直接分享图片，不保存到相册
				that.shareCustomerOrder(tempFilePath);
			},
			
			downLoadImage(base64) {
				let that = this;
				const bitmap = new plus.nativeObj.Bitmap("test");
				bitmap.loadBase64Data(base64, function() {
					const url = "_doc/" + new Date().getTime() + ".png"; // url为时间戳命名方式
					bitmap.save(url, {
						overwrite: true, // 是否覆盖
						quality: 10 // 图片清晰度
					}, (i) => {
						uni.saveImageToPhotosAlbum({
							filePath: url,
							success: function() {
								that.shareCustomerOrder(url);
								uni.showToast({
									title: '图片保存成功',
									icon: 'none'
								})
								bitmap.clear()
							}
						});
					}, (e) => {
						uni.showToast({
							title: '图片保存失败',
							icon: 'none'
						})
						bitmap.clear()
					});
				}, (e) => {
					uni.showToast({
						title: '图片保存失败',
						icon: 'none'
					})
					bitmap.clear()
				});
			},
			shareCustomerOrder(url) {
				var currentCompanyName = uni.getStorageSync('companyName');
				let that = this;
				uni.share({
				    provider: 'weixin',
				    scene: "WXSceneSession",
				    type: 5,
					title: currentCompanyName,
					imageUrl: url,
				    miniProgram: {
				        id: 'gh_9a0864956648',
				        path: `/pages/companyOrder/index?customerId=${that.customerId}`,
				        type: 0,
				        webUrl: 'http://uniapp.dcloud.io'
				    },
				    success: ret => {
				        console.log(JSON.stringify(ret));
				    },
					fail: ret => {
				        console.log(JSON.stringify(ret));
				    },
				});
			},
			payTypeConfirm(){
				var moduleSelect = [];
				this.moduleList.forEach(item => {
					if (this.checkboxValue.includes(item.id)) {
						item.payWay = this.currentPayWay;
						moduleSelect.push(item);
					}
				})
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param ={
					customerId:this.customerId,
					repayMoney:parseFloat(this.repayMoney) ,
					orderList :moduleSelect,
					operatorId :userInfo.id,
					operatorName:userInfo.userName,
					CompanyId:CompanyId,
					customerName:this.customerInfo ? this.customerInfo.customName : ''
				}
				member.RepayDebts(JSON.stringify(param)).then(res=>{
					if(res.code==200){
						uni.showToast({
								title: "还款成功",
								icon: "none",
								duration: 2000
							});
							this.refreshModule();
							this.payTypeDialogVisible = false;
					}else{
						uni.showToast({
								title: "还款失败",
								icon: "none",
								duration: 2000
							});
					}
					
				})
			},
			AddRepayConfirm(){
				var moduleSelect = [];
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param ={
					customerId:this.customerId,
					repayMoney:parseFloat(this.repayMoney) ,
					orderList :moduleSelect,
					operatorId :userInfo.id,
					operatorName:userInfo.userName,
					CompanyId:CompanyId,
					customerName:this.customerInfo ? this.customerInfo.customName : ''
				}
				member.AddRepayMoney(JSON.stringify(param)).then(res=>{
					if(res.code==200){
						uni.showToast({
								title: "下欠成功",
								icon: "none",
								duration: 2000
							});
							this.refreshModule();
							this.payTypeDialogVisible = false;
					}else{
						uni.showToast({
								title: "下欠失败",
								icon: "none",
								duration: 2000
							});
					}
					
				})
			},
			payBasketConfirm(){
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param ={
					customerId:this.customerId,
					repayBasket:parseFloat(this.repayBasket),
					orderList :[],
					operatorId :userInfo.id,
					operatorName:userInfo.userName,
					CompanyId:CompanyId,
					customerName:this.customerInfo ? this.customerInfo.customName : ''
				}
				member.RepayBasket(JSON.stringify(param)).then(res=>{
					if(res.code==200){
						uni.showToast({
								title: "收筐成功",
								icon: "none",
								duration: 2000
							});
							this.refreshModule();
							this.payTypeDialogVisible = false;
					}else{
						uni.showToast({
								title: "收筐失败",
								icon: "none",
								duration: 2000
							});
					}
					
				})
			},
			refreshCustomerInfo(){
				member.GetmemberByCustomeId(this.customerId).then(res => {
					this.customerInfo = res.data;
				})
			},
			refreshModule(){
				this.refreshCustomerInfo();
				member.GetAccountByCustomeId(this.customerId).then(res => {
					this.moduleList = res.data;
					this.moduleList.forEach(item => {
						var modelList = JSON.parse(item.module)
						item.moduleInfo = "";
						let modulesStr = [];
						modelList.forEach(model => {			
							if(model.type === 1 || model.type === 3){
							    modulesStr.push(model.name + "x" + model.mount);
							}
						})
						item.moduleInfo = modulesStr.join("|");
					})
					// 然后按 createTime 排序
					this.moduleList.sort((a, b) => {
					    const timeA = new Date(a.createTime).getTime();
					    const timeB = new Date(b.createTime).getTime();
					
					    return timeB - timeA ; // 按 createTime 升序排序
					});
					this.moduleList.sort((a, b) => {
					    const debtA = a.debt || 0; // 确保 debt 有默认值
					    const debtB = b.debt || 0;
					
					    return debtB - debtA; // 按 debt 升序排序
					});
				})
			},
			showBasketModel(){
				if (!this.customerInfo) {
					uni.showToast({
						title: '客户信息加载中',
						icon: 'none'
					});
					return;
				}
				// this.payTypeDialogVisible = true;
				// this.repayBasket = 0;
				// this.modelType=2;
				// this.modelTitle="收筐";
				this.$refs.repayBasketModelRef.openRepayBasket(this.customerInfo);

			},
			showPayModel() {
				if (!this.customerInfo) {
					uni.showToast({
						title: '客户信息加载中',
						icon: 'none'
					});
					return;
				}
				console.log("showPayModel",this.customerInfo)
				this.showRepaymentModal = true;
			},
			showPayModelType() {
				this.payTypeDialogVisible = true;
				this.repayMoney = 0;
				this.modelType=3;
				this.modelTitle="下欠";
			},
			back() {
				uni.navigateBack();
			},
			changeAll(e) {
				this.checkboxValue = [];
				if (e.length > 0) {
					this.moduleList.forEach(item => {
						this.checkboxValue.push(item.id)
					})
				}
				this.countSelect();
			},
			checkboxChange(val) {
				const index = this.checkboxValue.indexOf(val);
				if (index > -1) {
					this.checkboxValue.splice(index, 1);
				} else {
					this.checkboxValue.push(val);
				}
				this.countSelect();
			},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
					this.payWay[i].select = 0;
				}
				this.payWay[index].select = 1;
				this.currentPayWay = this.payWay[index].id;
			},
			countSelect() {
				this.selectDebt = 0;
				this.moduleList.forEach(item => {
					if (this.checkboxValue.includes(item.id)) {
						this.selectDebt += item.debt;
					}
				})
			},
			NumberCk2(val) {
				let myvalue = this.repayMoney;
				if(this.modelType==2){
					myvalue = this.repayBasket;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				if(this.modelType==1||this.modelType==3){
	
					this.repayMoney = myvalue; 	
							
				}else if(this.modelType==2){
					
					this.repayBasket = myvalue;
					
				}
			},
			Clear2() {
				if(this.modelType==1||this.modelType==3){
					
					this.repayMoney = '0'; 	
							
				}else if(this.modelType==2){
					
						this.repayBasket = '0';
					
					
				}
			},
			Tuige2() {
				let myvalue = this.repayMoney;
				if(this.modelType==2){
					myvalue = this.repayBasket;
				}
				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				if(this.modelType==1||this.modelType==3){
					
					this.repayMoney = myvalue === '' ? '0' : myvalue; // 如果为空，设置为0	
									
				}else if(this.modelType==2){
					
					this.repayBasket = myvalue === '' ? '0' : myvalue;
					
				}
				
			},
			openEditCustomer(){
				if (!this.customerInfo) {
					uni.showToast({
						title: '客户信息加载中',
						icon: 'none'
					});
					return;
				}
				this.customerInfo_copy = JSON.parse(JSON.stringify(this.customerInfo));
				this.customerDialogVisible = true;
			},
			submit() {
			// 只验证客户名称是否为空
			if (!this.customerInfo_copy.customName || this.customerInfo_copy.customName.trim() == "") {
				uni.showToast({
					title: '请输入客户名称',
					icon: 'none'
				})
				return;
			}
				
			let currentCompanyId = uni.getStorageSync('companyId');
			var param = {
				id: this.customerId,
				CustomName: this.customerInfo_copy.customName.trim(),
				CustomPhone: this.customerInfo_copy.customPhone || "",
				Address: this.customerInfo_copy.address || "",
				CarNum: this.customerInfo_copy.carNum || "",
				CompanyId: currentCompanyId,
				Debts: 0,
				OrderNum: 0,
				Owebasket: 0
			}
			member.memberCreate(param).then(res => {
				uni.showToast({
					title: '修改成功',
					icon: 'none'
				})
				this.refreshCustomerInfo();
				this.customerDialogVisible = false;
			}).catch(err => {
				uni.showToast({
					title: '修改失败',
					icon: 'none'
				})
				console.error('修改客户信息失败:', err);
			}).finally(() => {
		
			})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.customer-detail-container {
		background: #e8e8e8;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 头部区域 */
	.header-section {
		background: white;
		padding: 8rpx 12rpx;
		border-bottom: 2rpx solid #e2e8f0;
		display: flex;
		align-items: center;
		gap: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.back-button {
		display: flex;
		align-items: center;
		border: 1rpx solid #e2e8f0;
		gap: 6rpx;
		cursor: pointer;
		padding: 8rpx 12rpx;
		border-radius: 6rpx;
		transition: all 0.3s ease;

		&:hover {
			background: #f1f5f9;
		}

		.back-text {
			font-size: 18rpx;
			color: #3b82f6;
			font-weight: 500;
		}
	}

	.customer-info-card {
		flex: 1;
		background: white;
		border: 2rpx solid #e2e8f0;
		border-radius: 8rpx;
		padding: 12rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			border-color: #3b82f6;
			box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.1);
		}
		
		&.loading-card {
			cursor: default;
			
			&:hover {
				border-color: #e2e8f0;
				box-shadow: none;
			}
		}
	}
	
	.loading-content {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16rpx 0;
	}
	
	.loading-text {
		font-size: 18rpx;
		color: #9ca3af;
		font-weight: 500;
	}

	.customer-main-info {
		margin-bottom: 8rpx;
	}

	.customer-name-phone {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.name-section {
		display: flex;
		align-items: center;
		gap: 6rpx;

		.customer-name {
			font-size: 21rpx;
			font-weight: 600;
			color: #1e293b;
		}
	}

	.phone-section {
		display: flex;
		align-items: center;
		gap: 4rpx;

		.customer-phone {
			font-size: 22rpx;
			color: #6b7280;
		}
	}

	.customer-stats-row {
		display: flex;
		gap: 16rpx;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 4rpx 8rpx;
		background: #f8fafc;
		border-radius: 6rpx;
		border: 1rpx solid #e2e8f0;

		&.debt-stat {
			background: linear-gradient(135deg, #fef2f2, #fee2e2);
		}

		.stat-label {
			font-size: 18rpx;
			color: #6b7280;
			font-weight: 500;
		}

		.stat-value {
			font-size: 20rpx;
			font-weight: 600;
			color: #374151;

			&.debt-amount {
				color: #dc2626;
			}
		}
	}

	.action-buttons {
		display: flex;
		gap: 8rpx;
	}

	.action-btn {
		height: 48rpx;
		padding: 0 16rpx;
		border: none;
		border-radius: 6rpx;
		font-size: 20rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 4rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);

		&:hover {
			transform: translateY(-1rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		}

		&.basket-btn {
			background: linear-gradient(135deg, #f59e0b, #d97706);
			color: white;
		}

		&.repay-btn {
			background: linear-gradient(135deg, #10b981, #059669);
			color: white;
		}

		&.share-btn {
			background: linear-gradient(135deg, #3b82f6, #1d4ed8);
			color: white;
		}
	}

	/* 订单列表区域 */
	.orders-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 8rpx;
	}

	.orders-header {
		background: white;
		padding: 8rpx 12rpx;
		border-radius: 6rpx;
		margin-bottom: 8rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	}

	.select-all-section {
		display: flex;
		align-items: center;
		gap: 8rpx;

		.select-text {
			font-size: 15rpx;
			font-weight: 500;
			color: #374151;
		}

		.select-count {
			font-size: 20rpx;
			color: #6b7280;
		}

		.select-debt {
			font-size: 24rpx;
			font-weight: 600;
			color: #dc2626;
			margin-left: 12rpx;
		}
	}

	.orders-scroll {
		flex: 1;
	}

	.orders-list {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.order-item {
		display: flex;
		align-items: flex-start;
		gap: 8rpx;
		background: white;
		border-radius: 8rpx;
		padding: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
		transition: all 0.3s ease;

		&:hover {
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			transform: translateY(-1rpx);
		}
	}

	.order-checkbox {
		padding-top: 4rpx;

		.modern-checkbox {
			transform: scale(1.1);
		}
	}

	.order-card {
		flex: 1;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6rpx;
		padding-bottom: 4rpx;
		border-bottom: 1rpx solid #f1f5f9;
	}

	.order-time {
		font-size: 15rpx;
		color: #6b7280;
		font-weight: 500;
	}

	.order-amounts {
		display: flex;
		gap: 12rpx;
		align-items: center;
	}

	.debt-amount {
		font-size: 18rpx;
		color: #374151;

		.debt-value {
			color: #dc2626;
			font-weight: 600;
		}
	}

	.actual-amount {
		font-size: 18rpx;
		color: #374151;
	}

	.order-content {
		padding: 2rpx 0;
	}

	.order-info {
		font-size: 15rpx;
		color: #888888;
		font-weight: 500;
		line-height: 1.4;
	}

	/* 操作弹窗样式 */
	.modern-operation-modal {
		.operation-modal-container {
			background: white;
			border-radius: 12rpx;
			overflow: hidden;
		}

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 20rpx;
			background: linear-gradient(135deg, #3b82f6, #1d4ed8);
			color: white;

			.modal-title {
				font-size: 20rpx;
				font-weight: 600;
				margin: 0;
				color: white;
			}

			.modal-close {
				background: rgba(255, 255, 255, 0.2);
				border: none;
				border-radius: 50%;
				width: 32rpx;
				height: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s ease;

				&:hover {
					background: rgba(255, 255, 255, 0.3);
				}
			}
		}

		.operation-content {
			padding: 16rpx;
		}

		.payment-methods-section {
			margin-bottom: 16rpx;

			.section-title {
				font-size: 24rpx;
				font-weight: 600;
				color: #1e293b;
				margin-bottom: 8rpx;
			}

			.payment-methods-grid {
				display: flex;
				gap: 8rpx;
			}

			.payment-method-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 4rpx;
				padding: 12rpx 8rpx;
				border: 2rpx solid #e2e8f0;
				border-radius: 6rpx;
				cursor: pointer;
				transition: all 0.3s ease;

				&:hover {
					border-color: #3b82f6;
				}

				&.active {
					background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					border-color: #3b82f6;
					color: white;

					.method-label {
						color: white;
					}
				}

				.method-label {
					font-size: 18rpx;
					font-weight: 500;
					color: #374151;
				}
			}
		}

		.input-keypad-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16rpx;
		}

		.input-section {
			.input-row {
				display: flex;
				flex-direction: column;
				gap: 8rpx;

				.input-label {
					font-size: 22rpx;
					font-weight: 500;
					color: #374151;
				}

				.amount-input {
					height: 48rpx;
					padding: 0 12rpx;
					border: 2rpx solid #e2e8f0;
					border-radius: 6rpx;
					font-size: 24rpx;
					font-weight: 600;
					text-align: center;
					background: #f8fafc;
				}
			}
		}

		.compact-keypad {
			display: grid;
			gap: 4rpx;

			.keypad-row {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;
				gap: 4rpx;

				.keypad-btn {
					height: 36rpx;
					border: none;
					border-radius: 4rpx;
					background: #f1f5f9;
					color: #374151;
					font-size: 20rpx;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s ease;

					&:hover {
						background: #e2e8f0;
					}

					&.special-btn {
						background: #67c23a;
						color: white;
					}

					&.clear-btn {
						background: #f56c6c;
						color: white;
					}

					&.wide-btn {
						grid-column: span 2;
					}

					&.empty-btn {
						background: transparent;
						cursor: default;
					}
				}
			}
		}

		.modal-actions {
			display: flex;
			gap: 12rpx;
			padding: 16rpx 20rpx;
			border-top: 1rpx solid #e2e8f0;

			.modal-btn {
				flex: 1;
				height: 48rpx;
				border: none;
				border-radius: 6rpx;
				font-size: 24rpx;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.3s ease;

				&.cancel-btn {
					background: #f3f4f6;
					color: #374151;

					&:hover {
						background: #e5e7eb;
					}
				}

				&.confirm-btn {
					background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					color: white;

				&:hover {
					background: linear-gradient(135deg, #1d4ed8, #1e40af);
				}
			}
		}
	}

}



	/* 抽屉容器 */
	.drawer-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		pointer-events: none;
		z-index: 999;
	}

	/* 遮罩层 */
	.drawer-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		backdrop-filter: blur(2px);
	}

	.drawer-mask.show {
		opacity: 1;
		pointer-events: auto;
	}

	/* 抽屉内容 */
	.drawer-content {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100vh;
		background: #cacaca;
		box-shadow: -8rpx 0 24rpx rgba(0, 0, 0, 0.2);
		transform: translateX(100%);
		transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
		pointer-events: auto;
		overflow: hidden;
	}

	.drawer-content.show {
		transform: translateX(0);
	}

	/* 订单详情抽屉样式 */
	.order-detail-container {
		padding: 12rpx;
		background-color: #fff;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* 详情头部样式 */
	.detail-header-new {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 12rpx;
		background: linear-gradient(135deg, #4A90E2, #357ABD);
		border-radius: 6rpx;
		margin-bottom: 10rpx;
		box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.2);
		min-height: 40rpx;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.detail-title-new {
		font-size: 16rpx;
		font-weight: 600;
		color: white;
	}

	/* 紧凑的订单信息网格 */
	.order-info-grid-compact {
		padding: 8rpx;
		background-color: #f8f9fa;
		border-radius: 6rpx;
		margin-bottom: 8rpx;
	}

	.info-row {
		display: flex;
		gap: 15rpx;
		margin-bottom: 12rpx;
	}

	/* 紧凑模式下的行间距 */
	.order-info-grid-compact .info-row {
		gap: 8rpx;
		margin-bottom: 6rpx;
	}

	.info-row:last-child {
		margin-bottom: 0;
	}

	.info-item-new {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: white;
		padding: 10rpx 12rpx;
		border-radius: 6rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		min-width: 0;
	}

	/* 紧凑模式下的info-item */
	.order-info-grid-compact .info-item-new {
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
	}

	.info-label-new {
		color: #666;
		font-size: 14rpx;
		font-weight: 500;
		white-space: nowrap;
		margin-right: 8rpx;
	}

	.info-value-new {
		color: #333;
		font-size: 15rpx;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.info-value-small {
		font-size: 12rpx;
		color: #666;
		font-weight: 400;
	}

	.highlight-value {
		color: #e74c3c;
		font-weight: 700;
	}

	.debt-value-new {
		color: #e74c3c;
		font-weight: 700;
	}

	/* 状态项容器 */
	.info-item-status {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: white;
		padding: 10rpx 12rpx;
		border-radius: 6rpx;
		border-left: 3rpx solid #4A90E2;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		min-width: 0;
		width: 100%;
	}

	/* 紧凑模式下的状态项 */
	.order-info-grid-compact .info-item-status {
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
		border-left: 2rpx solid #4A90E2;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
	}

	.status-container-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.status-tag-group {
		display: flex;
		gap: 6rpx;
	}

	.status-tag {
		display: inline-flex;
		align-items: center;
		gap: 3rpx;
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 12rpx;
		font-weight: 600;
	}

	.status-modified-tag {
		background-color: rgba(49, 189, 236, 0.1);
		color: #31BDEC;
		border: 1rpx solid rgba(49, 189, 236, 0.3);
	}

	.status-refunded-tag {
		background-color: rgba(245, 108, 108, 0.1);
		color: #F56C6C;
		border: 1rpx solid rgba(245, 108, 108, 0.3);
	}

	.status-tag-text {
		font-size: 11rpx;
	}

	/* 产品表格容器 */
	.product-table-container {
		width: 100%;
		margin: 8rpx 0;
		padding: 0 8rpx;
		box-sizing: border-box;
	}

	.product-table {
		width: 100%;
		background-color: white;
		overflow: hidden;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
	}

	.table-row {
		display: flex;
		width: 100%;
	}

	.table-header-row {
		background: linear-gradient(135deg, #f5f7fa, #e8ebef);
	}

	.table-body-row {
		transition: background-color 0.3s ease;
	}

	.table-body-row:nth-child(even) {
		background-color: #fafbfc;
	}

	.table-body-row:hover {
		background-color: #f0f4f8;
	}

	.product-table .table-cell,
	.product-table .table-header-cell {
		flex: 1;
		padding: 8rpx 6rpx;
		text-align: center;
		font-size: 12rpx;
		line-height: 1.3;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		word-break: break-all;
	}

	.table-header-cell {
		font-weight: 700;
		color: #2c3e50;
	}

	.table-cell {
		color: #555;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.no-products {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 30rpx;
		text-align: center;
	}

	.no-products-icon {
		margin-bottom: 8rpx;
	}

	.no-products-text {
		font-size: 16rpx;
		color: #95a5a6;
	}

	/* 紧凑操作按钮容器 */
	.order-action-buttons-compact {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		padding: 8rpx 8rpx;
		gap: 8rpx;
		background-color: #f8f9fa;
		border-radius: 6rpx;
		flex-wrap: wrap;
	}

	/* 紧凑模式按钮 */
	.action-btn-compact {
		flex: 1;
		min-width: 70rpx !important;
		height: 32rpx !important;
		font-size: 13rpx !important;
		font-weight: 600 !important;
		border-radius: 5rpx !important;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08) !important;
		transition: all 0.3s ease !important;
		border: none !important;
	}

	.action-btn-compact:hover {
		transform: translateY(-1rpx);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15) !important;
	}

	.modify-btn-new {
		background: linear-gradient(135deg, #31BDEC, #2BA6D0) !important;
		color: white !important;
	}

	.modify-btn-new:hover {
		background: linear-gradient(135deg, #2BA6D0, #2291B6) !important;
	}

	.refund-btn-new {
		background: linear-gradient(135deg, #F56C6C, #E05656) !important;
		color: white !important;
	}

	.refund-btn-new:hover {
		background: linear-gradient(135deg, #E05656, #CC4A4A) !important;
	}

	.repay-btn-new {
		background: linear-gradient(135deg, #FFA500, #FF8C00) !important;
		color: white !important;
	}

	.repay-btn-new:hover {
		background: linear-gradient(135deg, #FF8C00, #E67E00) !important;
	}

	.print-btn-new {
		background: linear-gradient(135deg, #67C23A, #5DAF2E) !important;
		color: white !important;
	}

	.print-btn-new:hover {
		background: linear-gradient(135deg, #5DAF2E, #529B28) !important;
	}

	/* 订单状态样式 */
	.status-normal {
		color: #27ae60;
		font-weight: bold;
	}

	.status-refund {
		color: #e74c3c;
		font-weight: bold;
	}

	.status-modified {
		color: #f39c12;
		font-weight: bold;
	}

	.status-unknown {
		color: #95a5a6;
		font-weight: bold;
	}

	/* 订单卡片悬停效果 */
	.order-card {
		cursor: pointer;
		transition: all 0.2s ease;
		
		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		}
	}

	/* 关闭按钮样式 */
	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 4rpx;
		border-radius: 50%;
		transition: all 0.3s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.2);
		}
	}

	/* 商品类型标签样式 */
	.product-type {
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
		font-size: 18rpx;
		font-weight: 600;
		color: white;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		border: 1rpx solid rgba(255, 255, 255, 0.2);

		&.goods {
			background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		}

		&.service {
			background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		}

		&.extra {
			background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		}

		&.other {
			background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
		}
	}

	/* 客户编辑弹窗样式 */
	.modern-customer-modal {
		position: absolute;
		top: 10%;
		left: 30%;
		padding: 10rpx;
		z-index: 1000;
		
		.modal-container {
			background: white;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 0 10rpx 0 #9e9e9e;
		}

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 24rpx;
			background: linear-gradient(135deg, #3b82f6, #1d4ed8);
			color: white;

			.modal-title {
				font-size: 20rpx;
				font-weight: 600;
				margin: 0;
				color: white;
			}

			.modal-close {
				background: rgba(255, 255, 255, 0.2);
				border: none;
				border-radius: 50%;
				width: 32rpx;
				height: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s ease;

				&:hover {
					background: rgba(255, 255, 255, 0.3);
				}
			}
		}

	.form-container {
		padding: 24rpx;
	}

	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		gap: 16rpx;
	}

	.form-label {
		font-size: 15rpx;
		font-weight: 500;
		color: #374151;
		min-width: 90rpx;
		text-align: right;
		
		.required {
			color: #ef4444;
			font-weight: 600;
			margin-left: 2rpx;
		}
		
		.optional {
			color: #9ca3af;
			font-size: 12rpx;
			font-weight: 400;
			margin-left: 4rpx;
		}
	}

	.form-input {
		flex: 1;
		height: 30rpx;
		padding: 0 16rpx;
		border: 2rpx solid #e2e8f0;
		border-radius: 8rpx;
		font-size: 15rpx;
		background: #f8fafc;
		transition: all 0.3s ease;

		&:focus {
			outline: none;
			border-color: #3b82f6;
			background: white;
			box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1);
		}
		
		&::placeholder {
			color: #9ca3af;
		}
	}

	.form-actions {
		display: flex;
		justify-content: center;
		gap: 16rpx;
		margin-top: 32rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid #e2e8f0;
	}

	.form-btn {
		height: 35rpx;
		line-height: 35rpx;
		padding: 0 32rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		
		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		}

			&.cancel-btn {
				background: #f3f4f6;
				color: #374151;

				&:hover {
					background: #e5e7eb;
				}
			}

			&.submit-btn {
				background: linear-gradient(135deg, #3b82f6, #1d4ed8);
				color: white;

				&:hover {
					background: linear-gradient(135deg, #1d4ed8, #1e40af);
				}
			}
		}
	}
</style>