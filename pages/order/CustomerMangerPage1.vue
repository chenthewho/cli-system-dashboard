<template>
	<view class="customer-detail-container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="back-button" @click="back">
				<u-icon name="arrow-left" color="#3b82f6" size="18"></u-icon>
				<span class="back-text">返回</span>
			</view>
			
			<view class="customer-info-card" v-if="customerInfo" @click="openEditCustomer">
				<view class="customer-main-info">
					<view class="customer-name-phone">
						<view class="name-section">
							<uni-icons custom-prefix="iconfont" type="icon-kehu" size="16" color="#3b82f6"></uni-icons>
							<span class="customer-name">{{customerInfo.customName}}</span>
						</view>
						<view class="phone-section">
							<uni-icons custom-prefix="iconfont" type="icon-dianhua" size="14" color="#6b7280"></uni-icons>
							<span class="customer-phone">{{customerInfo.customPhone}}</span>
						</view>
					</view>
				</view>
				
				<view class="customer-stats-row">
					<view class="stat-item debt-stat">
						<span class="stat-label">总欠款</span>
						<span class="stat-value debt-amount">{{customerInfo.debts}}元</span>
					</view>
					<view class="stat-item">
						<span class="stat-label">总欠筐</span>
						<span class="stat-value">{{customerInfo.owebasket}}个</span>
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
		<u-modal title="" class="modern-customer-modal" :show="customerDialogVisible" :closeOnClickOverlay="false"
			:showConfirmButton="false" :width="600" @close="customerDialogVisible = false">
			<view class="modal-container">
				<view class="modal-header">
					<h3 class="modal-title">客户信息</h3>
				</view>
				
				<view class="form-container">
					<view class="form-row">
						<label class="form-label">客户名称</label>
						<input class="form-input" type="text" placeholder="请输入客户名称" v-model="customerInfo_copy.customName" />
					</view>
					
					<view class="form-row">
						<label class="form-label">联系方式</label>
						<input class="form-input" type="text" placeholder="请输入联系方式" v-model="customerInfo_copy.customPhone" />
					</view>
					
					<view class="form-row">
						<label class="form-label">车牌号码</label>
						<input class="form-input" type="text" placeholder="请输入车牌号码" v-model="customerInfo_copy.carNum" />
					</view>
					
					<view class="form-row">
						<label class="form-label">联系地址</label>
						<input class="form-input" type="text" placeholder="请输入联系地址" v-model="customerInfo_copy.address" />
					</view>
					
					<view class="form-actions">
						<button class="form-btn cancel-btn" @click="customerDialogVisible = false">取消</button>
						<button class="form-btn submit-btn" @click="submit()">确认修改</button>
					</view>
				</view>
			</view>
		</u-modal>

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
					<div class="order-detail-header">
						<div class="detail-title">
							<view class="detail-title-icon">
								<uni-icons custom-prefix="iconfont" type="icon-dingdan" size="20" color="#666"></uni-icons>
							</view>
							<text class="detail-title-text">订单详情</text>
						</div>
						<view class="close-btn" @tap="closeOrderDetail">
							<uni-icons type="close" size="35" color="#666"></uni-icons>
						</view>
					</div>

					<!-- 订单概览信息 -->
					<div class="order-overview">
						<div class="info-item">
							<span class="info-label">创建时间:</span>
							<span class="info-value">{{ selectedOrder.createTime ? selectedOrder.createTime.replace("T", " ") : "" }}</span>
						</div>
						<!-- <div class="info-item" v-if="selectedOrder.updateTime">
							<span class="info-label">修改时间:</span>
							<span class="info-value">{{ selectedOrder.updateTime ? selectedOrder.updateTime.replace("T", " ") : "" }}</span>
						</div> -->
						<div class="info-item">
							<span class="info-label">订单号:</span>
							<span class="info-value">{{ selectedOrder.accountCode || "-" }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">顾客:</span>
							<span class="info-value">{{ selectedOrder.customName || "散客" }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">总计金额:</span>
							<span class="info-value">¥{{ selectedOrder.payableAmount || 0 }}</span>
						</div>
						<div class="info-item" v-if="selectedOrder.basketOffsetAmount">
							<span class="info-label">押筐抵扣:</span>
							<span class="info-value">¥{{ selectedOrder.basketOffsetAmount || 0 }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">实付金额:</span>
							<span class="info-value">¥{{ selectedOrder.actualMoney || 0 }}</span>
						</div>
						<div class="info-item debt" v-if="selectedOrder.debt > 0">
							<span class="info-label">下欠:</span>
							<span class="info-value">¥{{ selectedOrder.debt }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">订单状态:</span>
							<span class="info-value" :class="getOrderStatusClass(selectedOrder.status)">{{ getOrderStatusText(selectedOrder.status) }}</span>
						</div>
					</div>

					<!-- 商品列表 -->
					<scroll-view class="product-scroll" :style="{ maxHeight: 'calc(100vh - 300rpx)' }" scroll-y="true" v-if="selectedOrder.modelList && selectedOrder.modelList.length > 0">
						<div class="product-table">
							<div class="table-header">
								<div class="header-cell">货品</div>
								<div class="header-cell">数量</div>
								<div class="header-cell">总重</div>
								<div class="header-cell">皮重</div>
								<div class="header-cell">单价</div>
								<div class="header-cell">小计</div>
							</div>

							<div class="table-row" v-for="(item, index) in selectedOrder.modelList" :key="index">
								<div class="table-cell">{{ item.name }}</div>
								<div class="table-cell">{{ item.mount }}</div>
								<div class="table-cell">{{ item.totalWeight }}</div>
								<div class="table-cell">{{ item.tareWeight }}</div>
								<div class="table-cell">¥{{ item.referenceAmount }}</div>
								<div class="table-cell">¥{{ item.subtotal }}</div>
							</div>
						</div>
					</scroll-view>

					<!-- 无商品数据提示 -->
					<div v-else class="no-products">
						<view class="no-products-icon">
							<uni-icons type="info-filled" size="24" color="#bdc3c7"></uni-icons>
						</view>
						<text class="no-products-text">暂无商品信息</text>
					</div>

					<!-- 操作按钮区域 -->
					<view class="order-action-buttons">
						<view class="button-group left-buttons">
							<u-button v-if="selectedOrder.status!=2" 
								class="action-btn modify-btn"
								type="primary" 
								@click="modifyOrder" 
								text="改单">
							</u-button>
							<u-button v-if="selectedOrder.status!=2" 
								class="action-btn refund-btn"
								type="primary" 
								@click="refundOrder" 
								text="退单">
							</u-button>
						</view>
						
						<view class="button-group center-buttons" v-if="selectedOrder.debt>0">
							<u-button 
								class="action-btn repay-btn"
								type="primary" 
								text="整单还款" 
								@click="repayOrder">
							</u-button>
						</view>
					
						<view class="button-group right-buttons">
							<u-button 
								class="action-btn print-btn"
								type="primary"
								text="打印" 
								@click="printOrder">
							</u-button>
						</view>
					</view>
				</div>
			</view>
		</view>


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
				let that = this;
				member.GetCustomerClientShareImage(this.customerId).then(res=>{
					if(res.code==200){
						that.downLoadImage(res.data);
					}
				})
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
					customerName:this.customerInfo.customName
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
					customerName:this.customerInfo.customName
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
					customerName:this.customerInfo.customName
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
				// this.payTypeDialogVisible = true;
				// this.repayBasket = 0;
				// this.modelType=2;
				// this.modelTitle="收筐";
				this.$refs.repayBasketModelRef.openRepayBasket(this.customerInfo);

			},
			showPayModel() {
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
				this.customerInfo_copy = JSON.parse(JSON.stringify(this.customerInfo));
				this.customerDialogVisible = true;
			},
			submit() {
				if (this.customerInfo.customName == "" || this.customerInfo.customPhone == "") {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return;
				}
				
				let currentCompanyId = uni.getStorageSync('companyId');
				var param = {
					id: this.customerId,
					CustomName: this.customerInfo_copy.customName,
					CustomPhone: this.customerInfo_copy.customPhone,
					Address: this.customerInfo_copy.address,
					CarNum :this.customerInfo_copy.carNum,
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
				}).finally(() => {
			
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.customer-detail-container {
		background: darkgray;
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
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.order-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx;
		background: linear-gradient(135deg, #e74c3c, #c0392b);
		color: white;
		border-radius: 6rpx;
		margin-bottom: 10rpx;
	}

	.detail-title {
		display: flex;
		align-items: center;
		gap: 6rpx;
	}

	.detail-title-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24rpx;
		height: 24rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}

	.detail-title-text {
		font-size: 20rpx;
		font-weight: bold;
		color: white;
	}

	.order-overview {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx 12rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 10rpx;
	}

	.info-item {
		flex: 1;
		min-width: 45%;
		display: flex;
		font-size: 16rpx;
		line-height: 1.3;
	}

	.info-label {
		color: #666;
		min-width: 4.5em;
		margin-right: 6rpx;
		font-size: 16rpx;
	}

	.info-value {
		color: #333;
		font-weight: normal;
		font-size: 16rpx;
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
		flex: 1;
		margin-top: 6rpx;
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
		padding: 6rpx 4rpx;
		text-align: center;
		border: 1rpx solid #eee;
		font-size: 14rpx;
		line-height: 1.2;
		vertical-align: middle;
	}

	.header-cell {
		background-color: #f5f5f5;
		font-weight: bold;
		color: #333;
		font-size: 15rpx;
	}

	.table-cell {
		background-color: #fff;
		color: #666;
	}

	.table-row:nth-child(even) .table-cell {
		background-color: #fafafa;
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
		height: calc(100vh - 60rpx);
	}

	/* 订单操作按钮样式 */
	.order-action-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 5rpx 5rpx;
		margin-top: 10rpx;
		border-top: 1rpx solid #eee;
		background: #f8f9fa;
	}

	.button-group {
		display: flex;
		align-items: center;
		gap: 35rpx;
	}

	.left-buttons {
		flex: 1;
		justify-content: flex-start;
		padding-right: 10rpx;
	}

	.center-buttons {
		padding-left: 10rpx;
		padding-right: 10rpx;
		flex: 1;
		justify-content: center;
	}

	.right-buttons {
		flex: 1;
		justify-content: flex-end;
		padding-left: 10rpx;
	}

	/* 按钮基础样式 */
	.action-btn {
		min-width: 65rpx !important;
		height: 35rpx !important;
		font-size: 16rpx !important;
		font-weight: bold !important;
		border-radius: 3rpx !important;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1) !important;
		transition: all 0.3s ease !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		text-align: center !important;
		line-height: 1 !important;
	}

	.action-btn:hover {
		transform: translateY(-1rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15) !important;
	}

	/* 改单按钮 */
	.modify-btn {
		background: linear-gradient(135deg, #3498db, #2980b9) !important;
		border-color: #3498db !important;
		color: white !important;
	}

	.modify-btn:hover {
		background: linear-gradient(135deg, #2980b9, #1f5f8b) !important;
	}

	/* 退单按钮 */
	.refund-btn {
		background: linear-gradient(135deg, #95a5a6, #7f8c8d) !important;
		border-color: #95a5a6 !important;
		color: white !important;
	}

	.refund-btn:hover {
		background: linear-gradient(135deg, #7f8c8d, #6c7b7d) !important;
	}

	/* 整单还款按钮 */
	.repay-btn {
		background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
		border-color: #e74c3c !important;
		color: white !important;
		min-width: 85rpx !important;
	}

	.repay-btn:hover {
		background: linear-gradient(135deg, #c0392b, #a93226) !important;
	}

	/* 打印按钮 */
	.print-btn {
		background: linear-gradient(135deg, #27ae60, #229954) !important;
		border-color: #27ae60 !important;
		color: white !important;
	}

	.print-btn:hover {
		background: linear-gradient(135deg, #229954, #1e8449) !important;
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
		.modal-container {
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
				font-size: 28rpx;
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
			padding: 20rpx;
		}

		.form-row {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
			gap: 12rpx;
		}

		.form-label {
			font-size: 20rpx;
			font-weight: 500;
			color: #374151;
			min-width: 100rpx;
			text-align: right;
		}

		.form-input {
			flex: 1;
			height: 40rpx;
			padding: 0 12rpx;
			border: 2rpx solid #e2e8f0;
			border-radius: 6rpx;
			font-size: 20rpx;
			background: #f8fafc;
			transition: all 0.3s ease;

			&:focus {
				outline: none;
				border-color: #3b82f6;
				background: white;
			}
		}

		.form-actions {
			display: flex;
			justify-content: center;
			gap: 12rpx;
			margin-top: 24rpx;
			padding-top: 16rpx;
			border-top: 1rpx solid #e2e8f0;
		}

		.form-btn {
			height: 40rpx;
			line-height: 40rpx;
			padding: 0 24rpx;
			border: none;
			border-radius: 6rpx;
			font-size: 20rpx;
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