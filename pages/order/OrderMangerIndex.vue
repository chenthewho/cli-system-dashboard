<template>
	<view style="background-color:darkgrey;">
		<view style="height: 1px; background-color: #ccc; box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);"></view>
		<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<div style="height: 50rpx;" v-if="moduleList.length==0">
				<div style=" margin-top: 100rpx; text-align: center;">
					<uni-icons custom-prefix="iconfont" type="icon-zanwudingdan" size="40" color="#4c4c4c"></uni-icons>
					<div style="margin-top: 10px; color: #4c4c4c;font-weight: bold;">暂无订单</div> <!-- 添加的文字 -->
				</div>
			</div>

			<view v-for=" item in moduleList" style=" display: flex;font-weight: bold;">
				<u-checkbox-group placement="column" @change="checkboxChange(item.id)"
					style=" margin-top: 40px;margin-left: 20px;" v-if="isEdting">
					<u-checkbox class="checkBox" :key="item.id" label="" :checked="checkboxValue.includes(item.id)" />
				</u-checkbox-group>
				<view
					style="width: 98%; height: 50rpx;background-color:white;margin-left: 5rpx;margin-bottom: 5rpx;margin-top: 5rpx; border-radius: 5px;padding: 5rpx;"
					:style="{backgroundColor:item.status==2?'#f0f0f0':'white'}"
					@click="showInfo(item)">
					<view
						style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 2rpx;">
						<view style="flex: 1; text-align: left;padding-right: 5rpx;font-weight: bold;"><uni-icons
								custom-prefix="iconfont" type="icon-tubiao_guke" size="15" color="#000000"
								style="margin-right: 5rpx;"></uni-icons>{{item.customName ? item.customName : "散客"}}
								<text style="color: #31BDEC;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="item.status==5">已修改</text>
								<text style="color:#F56C6C;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="item.status==2">退单</text>
						</view>
						<view style="flex: 2;text-align: left;padding-left: 5rpx;">
							时间：{{item.createTime.replace("T"," ")}}
							<text style="color: white;background-color: #67C23A;padding: 2rpx 8rpx;margin-left: 10rpx;border-radius: 10rpx;font-size: 12rpx;font-weight: 500;" v-if="item.shareNum > 0">已发单</text>
						
						</view>
						<view style="flex: 1;text-align: right;padding-right: 5rpx;position: relative;">
						
							<!-- <uni-icons custom-prefix="iconfont"
								type="icon-xiangmujine" size="15" color="#000000"
								style="margin-right: 5rpx;"></uni-icons> -->
								实收(元): {{item.actualMoney}}
								
							</view>
					</view>
					<view
						style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
						<view style="color: #ccc; text-align: left;padding-left: 5rpx;margin-top: 5rpx;white-space: nowrap;width: 400rpx;text-overflow: ellipsis;overflow: hidden;">{{item.modulestr}}</view>
						<view
							style="text-align: right;padding-right: 5rpx;color: white;background-color: red;padding: 5rpx;margin-right: 5rpx;border-radius: 5rpx;"
							v-if="item.debt>0">下欠: {{item.debt}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view style="height: 41rpx;background-color: lightgray;position: fixed; bottom: 0;width: 100%;">
			<div class="demo-row" style="height: 80rpx;">
				<div class="demo-col col-12">

					<div style="display: flex;font-weight: bold;">
						<div style="display: flex; align-items: center;">
							<u-icon name="car-fill" size="25"></u-icon>订单数:
							<text style="margin-left: 5px;font-size: 20px;">{{ moduleList.length }}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">成交金额:
							<text style="margin-left: 5px;font-size: 20px;"> {{totalMoney.toFixed(1)}}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">当日下欠:
							<text style="margin-left: 5px;font-size: 20px;color: red;"> {{ allDebt.toFixed(1) }}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">实收金额:
							<text style="margin-left: 5px;font-size: 20px;color: green;">
								{{actualMoney.toFixed(1)}}</text>
						</div>
					</div>
				</div>
			</div>

		</view>
		<u-modal title="订单详情" :show="showDetail" @close="showDetail = false" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="'500rpx'">
			<div class="slot-content" style="position: relative;">
				<div class="slot-content" style=" display: flex; flex-wrap: wrap; gap: 10px;font-weight: bold;">
					<div style="flex: 1; min-width: 200rpx;">创建时间:
						{{currentOrder.createTime ? currentOrder.createTime.replace("T", " ") : ""}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">订单号:
						{{currentOrder.accountCode ? currentOrder.accountCode : ""}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">顾客:
						{{currentOrder.customName ? currentOrder.customName : "散客"}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">总计金额:
						{{currentOrder.payableAmount }}
					</div>
					<div style="flex: 1; min-width: 200rpx;">押筐抵扣:
						{{currentOrder.basketOffsetAmount }}
					</div>
					<div style="flex: 1; min-width: 200rpx;">实付金额:
						{{currentOrder.actualMoney }}
					</div>
					<div style="flex: 1; min-width: 200rpx;color: darkred;" v-if="currentOrder.debt>0">下欠:
						{{currentOrder.debt}}
					</div>
					<div style="flex: 1; min-width: 200rpx;display: flex;" v-if="currentOrder.status !=1" >状态:
						<text style="color: #31BDEC;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="currentOrder.status==5">已修改<text style="background-color: #31BDEC;color: white;padding: 5rpx;border-radius: 5rpx;margin-left: 10rpx;" @click="showHistoryOrder(currentOrder)">查看历史订单</text></text>
						<text style="color:#F56C6C;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="currentOrder.status==2">退单</text>
					</div>
				</div>
				<scroll-view  scroll-y="true"
					:style="{ height: 150 + 'rpx',marginTop:'5rpx',marginBottom:'5rpx' }">
				<div class="table">
					
					<div class="table-row">
						<div class="table-header-cell">货品</div>
						<div class="table-header-cell">数量</div>
						<div class="table-header-cell">总重</div>
						<div class="table-header-cell">皮重</div>
						<div class="table-header-cell">单价</div>
						<div class="table-header-cell">小计</div>
					</div>
			
					<div class="table-row" v-for="item in currentCardInfo" v-if="item.type!=4">
						<div class="table-cell">{{item.name}}</div>
						<div class="table-cell">{{item.mount}}</div>
						<div class="table-cell">{{item.totalWeight}}</div>
						<div class="table-cell">{{item.tareWeight}}</div>
						<div class="table-cell">{{item.referenceAmount}}</div>
						<div class="table-cell">{{item.subtotal}}</div>
					</div>
					
				</div>
				</scroll-view>
				<view class="order-action-buttons">
					<view class="button-group left-buttons">
						<u-button v-if="currentOrder.status!=2" 
							class="action-btn modify-btn"
							type="primary" 
							@click="TurnToTuigeCashier" 
							text="改单">
						</u-button>
						<u-button v-if="currentOrder.status!=2" 
							class="action-btn refund-btn"
							type="primary" 
							@click="TuigeOrder" 
							text="退单">
						</u-button>
					</view>
					
					<view class="button-group center-buttons" v-if="currentOrder.debt>0">
						<u-button 
							class="action-btn repay-btn"
							type="primary" 
							text="整单还款" 
							@click="openPayTypeDialogVisible">
						</u-button>
					</view>
				
					<view class="button-group right-buttons">
						<u-button 
							class="action-btn print-btn"
							type="primary"
							text="打印" 
							@click="printerModel(currentOrder)">
						</u-button>
					</view>
				</view>
				<u-button
				icon="share-square"
					:plain="true"
					shape="circle" 
				  type="primary"
				  text="发单" 
				  @click="shareOrder()" 
				  style="position: absolute; top: 0; right: 0;width: 50rpx;">
				</u-button>
			
			</div>
		</u-modal>

		<u-modal title="整单还款" class="payment" :show="payTypeDialogVisible" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="800" @close="payTypeDialogVisible = false">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal pay-type">
					<div class="body">
						<div class="pay-amount">
							<u--form labelPosition="left" ref="payAamountForm" :labelWidth="120">
								<div class="form-row">
									<div class="right-part">
										<div class="payment-methods">
											<div :class="{'payment-item':true,'activepayment':item.select==1?true:false}"
												v-for="item , index in payWay" @click="changPayWay(index)">
												<u-icon style="margin-top: 10rpx;" :size="40" :name="item.coin"
													:color="item.color"></u-icon>
												<span class="payment-text">{{item.label}}</span>
											</div>
										</div>
									</div>
									<div class="form-container">
										<div
											style="font-weight: bold; font-size: 15rpx; display: flex; align-items: center;margin-top: 10rpx;">
											<text style="width: 80rpx;margin-left: 20rpx;">还款金额：</text>
											<input v-model="repayMount" inputmode="none"
												style="text-align: center; width: 100rpx;font-weight: bold; font-size: 20rpx; border: none; border-bottom: 1px solid black; outline: none; padding: 5rpx; margin-left: 10rpx;" />
										</div>
										<view class="mybrankmask2"
											:style="{ width: '320rpx', height: '150rpx', zIndex: 999, left: 0, bottom: 0 ,marginTop:'20rpx'}">
											<view style="padding: 5rpx;">
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(1)">1</view>
													<view class="maskListItem" @click="NumberCk2(2)">2</view>
													<view class="maskListItem" @click="NumberCk2(3)">3</view>
													<view class="maskListItem "
														style="background-color: #67C23A;color: #fff;"
														@click="Tuige2()">退格</view>
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(4)">4</view>
													<view class="maskListItem" @click="NumberCk2(5)">5</view>
													<view class="maskListItem" @click="NumberCk2(6)">6</view>
													<view class="maskListItem" @click="NumberCk2('+')"
														style="background-color: #31BDEC;font-size: 25px;color: white;">
														+</view>
													<!-- <view class="maskListItem large"
																style="background-color: #F56C6C;color: #fff;"
																@click="Clear2()">清空</view> -->
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(7)">7</view>
													<view class="maskListItem" @click="NumberCk2(8)">8</view>
													<view class="maskListItem" @click="NumberCk2(9)">9</view>
													<view class="maskListItem" @click="NumberCk2('-')"
														style="background-color: #F56C6C;font-size: 25px;color: white;">
														-</view>
												</view>
												<view class="MymaskList">
													<view class="maskListItem3" @click="NumberCk2(0)">0</view>
													<view class="maskListItem" @click="NumberCk2('.')">.</view>
													<view class="maskListItem2"></view>
												</view>
											</view>
										</view>
									</div>
								</div>
							</u--form>
						</div>
					</div>
					<div class="footer">
						<div style="display: flex;justify-content: center;">
							<div class="btn" @click="payTypeDialogVisible = false"
								style="width: 100rpx;font-weight: bolder; color: white;border: 1px solid darkgray;background: darkgray; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);">
								返回</div>
							<div class="btn" @click="repaySingle"
								style="margin-left: 20rpx; width: 100rpx;font-weight: bolder; color: white;border: 1px solid darkgreen;background: darkgreen; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);">
								确认还款</div>
						</div>
					</div>
				</div>
			</div>
		</u-modal>

		<!-- 历史订单抽屉 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showHistoryDrawer }" @tap="closeHistoryDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showHistoryDrawer }">
				<!-- 历史订单抽屉 -->
				<div class="history-order-container" v-if="showHistoryDrawer">
					<!-- 抽屉头部 -->
					<div class="history-header">
						<div class="history-title">
							<view class="history-title-icon">
								<uni-icons custom-prefix="iconfont" type="icon-lishijilu" size="16" color="#3498db"></uni-icons>
							</view>
							<text class="history-title-text">历史订单列表</text>
						</div>
						<div class="history-summary" v-if="historyOrderList.length > 0">
							<text class="history-summary-text">共 {{ historyOrderList.length }} 个版本</text>
						</div>
					</div>

					<!-- 历史订单列表 -->
					<scroll-view class="history-scroll" :style="{ height: (scrollHeight - 100) + 'px' }" scroll-y="true">
						<div class="history-order-list">
							<div class="history-order-item" v-for="(order, index) in historyOrderList" :key="index" @click="showOrderDetail(order)">
								<div class="history-order-header">
									<div class="history-order-info">
										<text class="history-customer-name">{{ order.customName || "散客" }}</text>
										<text class="history-order-time">{{ order.updateTime ? order.updateTime.replace("T", " ") : "" }}</text>
									</div>
									<div class="history-order-amounts">
										<text class="history-total-amount">实收: ¥{{ order.actualMoney || 0 }}</text>
										<text class="history-debt-amount" v-if="order.debt > 0">欠款: ¥{{ order.debt || 0 }}</text>
									</div>
								</div>
								<div class="history-order-detail">
									<div class="history-order-code">
										<text class="history-code-label">订单号:</text>
										<text class="history-code-value">{{ order.accountCode || "-" }}</text>
									</div>
									<div class="history-order-status" v-if="order.status !== 1">
										<view class="history-status-tag" :class="getOrderStatusClass(order.status)">
											<text class="history-status-text">{{ getOrderStatusText(order.status) }}</text>
										</view>
									</div>
								</div>
								<div class="history-order-items" v-if="order.modulestr">
									<text class="history-items-text">{{ order.modulestr }}</text>
								</div>
							</div>
							<!-- 空状态 -->
							<div class="history-empty" v-if="!historyOrderList || historyOrderList.length === 0">
								<view class="history-empty-icon">
									<uni-icons type="info-filled" size="32" color="#bdc3c7"></uni-icons>
								</view>
								<text class="history-empty-text">暂无历史订单</text>
							</div>
						</div>
					</scroll-view>
				</div>
			</view>
		</view>

		<!-- 订单详情抽屉 -->
		<view class="drawer-container" v-if="showOrderDetailDrawer">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showOrderDetailDrawer }" @tap="closeOrderDetailDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showOrderDetailDrawer }">
				<!-- 订单详情抽屉 -->
				<div class="order-detail-container" v-if="showOrderDetailDrawer && orderDetailData">
					<!-- 抽屉头部 -->
					<div class="order-detail-header">
						<div class="detail-title">
							<view class="detail-title-icon">
								<uni-icons custom-prefix="iconfont" type="icon-dingdan" size="20" color="#666"></uni-icons>
							</view>
							<text class="detail-title-text">订单详情</text>
						</div>
						<view class="close-btn" @tap="closeOrderDetailDrawer">
							<uni-icons type="close" size="35" color="#666"></uni-icons>
						</view>
					</div>

					<!-- 订单概览信息 -->
					<div class="order-overview">
						<div class="info-item">
							<span class="info-label">创建时间:</span>
							<span class="info-value">{{ orderDetailData.createTime ? orderDetailData.createTime.replace("T", " ") : "" }}</span>
						</div>
						<div class="info-item" v-if="orderDetailData.updateTime">
							<span class="info-label">修改时间:</span>
							<span class="info-value">{{ orderDetailData.updateTime ? orderDetailData.updateTime.replace("T", " ") : "" }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">订单号:</span>
							<span class="info-value">{{ orderDetailData.accountCode || "-" }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">顾客:</span>
							<span class="info-value">{{ orderDetailData.customName || "散客" }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">总计金额:</span>
							<span class="info-value">¥{{ orderDetailData.payableAmount || 0 }}</span>
						</div>
						<div class="info-item" v-if="orderDetailData.basketOffsetAmount">
							<span class="info-label">押筐抵扣:</span>
							<span class="info-value">¥{{ orderDetailData.basketOffsetAmount || 0 }}</span>
						</div>
						<div class="info-item highlight">
							<span class="info-label">实付金额:</span>
							<span class="info-value">¥{{ orderDetailData.actualMoney || 0 }}</span>
						</div>
					<div class="info-item debt" v-if="orderDetailData.debt > 0">
						<span class="info-label">下欠:</span>
						<span class="info-value">¥{{ orderDetailData.debt }}</span>
					</div>
					<div class="info-item" v-if="orderDetailData.status !== 1">
						<span class="info-label">订单状态:</span>
						<span class="info-value" :class="getOrderStatusClass(orderDetailData.status)">{{ getOrderStatusText(orderDetailData.status) }}</span>
					</div>
					</div>

					<!-- 商品列表 -->
					<scroll-view class="product-scroll" :style="{ maxHeight: (scrollHeight - 200) + 'px' }" scroll-y="true" v-if="orderDetailData.module && orderDetailData.module.length > 0">
						<div class="product-table">
							<div class="table-header">
								<div class="header-cell">货品</div>
								<div class="header-cell">数量</div>
								<div class="header-cell">总重</div>
								<div class="header-cell">皮重</div>
								<div class="header-cell">单价</div>
								<div class="header-cell">小计</div>
							</div>

							<div class="table-row" v-for="(item, index) in orderDetailData.module" :key="index">
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
				</div>
			</view>
		</view>

	</view>

</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import member from '../../api/member/member'
	export default {
		name: 'OrderMangerIndex',
		components: {

		},
		data() {
			return {
				list: ['今日', '昨日'],
				tabs1Current: 0,
				payTypeDialogVisible: false,
				moduleList: [],
				originalModuleList: [], // 保存原始订单列表
				currentFilterType: 'all', // 当前筛选类型
				repayMount: 0,
				memberDialogVisible: false,
				CompanyId: "",
				single: '',
				showTimePcker: false,
				showDetail: false,
				currentOrder: {},
				currentCardInfo: [],
				canvasheight: 0,
				scrollHeight: 0,
				allDebt: 0,
				totalMoney: 0,
				actualMoney: 0,
				checkboxValue: [],
				isEdting: false,
				memberOptions: [],
				currentPayWay: 1,
				beginTime:"",
				endTime:"",
				showHistoryDrawer: false, // 历史订单抽屉显示状态
				historyOrderList: [], // 历史订单列表
				currentOriginOrderId: "", // 当前原始订单ID
				showOrderDetailDrawer: false, // 订单详情抽屉显示状态
				orderDetailData: null, // 订单详情数据
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
					}, {
						label: "其他",
						coin: "coupon-fill",
						select: 0,
						color: "red",
						id: 4
					}
				]
			}
		},
		// mounted() {
		// 	// 在组件挂载后设置 scrollHeight
			

		// },
		mounted() {
			this.scrollHeight = uni.getWindowInfo().windowHeight - 70;
			this.CompanyId = uni.getStorageSync('companyId'); 
			this.getTodayDateRange();
			this.refresh();
		},
		methods: {
			refresh(){
				// 重置统计数据
				this.allDebt = 0;
				this.totalMoney = 0;
				this.actualMoney = 0;
				
				const currentDate = this.getcurrentTime();
				this.single = currentDate;
				console.log("this.beginTime",this.beginTime);
				console.log("this.endTime",this.endTime);
				cashierOrder.GetAccountByCompanyIdandDateRange(this.CompanyId, this.beginTime, this.endTime).then(res => {
					this.originalModuleList = res.data;
					this.originalModuleList.forEach(item => {

						item.modulestr = "";
						if(item.status!=2){
							this.allDebt += item.debt;
						this.totalMoney += item.payableAmount;
						this.actualMoney += item.actualMoney;
						}
						var cardList = JSON.parse(item.module);
						cardList.forEach(card => {
							if (card.type === 1 || card.type === 3) {
								let modulesStr = [];
				
								if (card.type === 1 || card.type === 3) {
									modulesStr.push(card.name + "x" + card.mount);
								}
				
								item.modulestr = modulesStr.join("|");
				
				
								// item.modulestr += card.name + "x" + card.mount + " | ";
							}
				
						})
					})
					this.originalModuleList.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime); // 升序排序
					});
					
					// 应用当前筛选
					this.applyFilter();
				})
			},
			getTodayDateRange() {
    // 获取当前本地时间
    const now = new Date();

    // 设置当天的 00:00:01 和 23:59:59（本地时间）
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 1, 0); // 设置为 00:00:01

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999); // 设置为 23:59:59

    // 格式化成 "YYYY-MM-DD HH:mm:ss"（使用本地时间）
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    this.beginTime = formatDateTime(todayStart); // 例如 "2025-09-26 00:00:01"
    this.endTime = formatDateTime(todayEnd);    // 例如 "2025-09-26 23:59:59"
	console.log("this.beginTime",this.beginTime);
	console.log("this.endTime",this.endTime);
},
			openPayTypeDialogVisible() {
				this.payTypeDialogVisible = true;
				this.repayMount = this.currentOrder.debt;
			},
			Tuige2() {
				let myvalue = "";
				myvalue = this.repayMount;

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				this.repayMount = myvalue;
			},
			Clear2() {
				// 根据 custominputFocusIndex 清空对应的值
				this.repayMount = '0';
			},
			NumberCk2(val) {
				let myvalue = this.repayMount;
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				this.repayMount = myvalue;
			},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
					this.payWay[i].select = 0;
				}
				this.payWay[index].select = 1;
				this.currentPayWay = this.payWay[index].id;
			},
			repaySingle() {
				var repayOrder = JSON.parse(JSON.stringify(this.currentOrder))
				repayOrder.payWay = this.currentPayWay;
				var moduleSelect = [repayOrder];

				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param = {
					customerId: repayOrder.customerId,
					repayMoney: this.repayMount,
					orderList: moduleSelect,
					operatorId: userInfo.idateChangeCompanyId,
					customerName: repayOrder.customName
				}
				member.RepayDebts(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: "还款成功",
							icon: "none",
							duration: 2000
						});
						this.payTypeDialogVisible = false;
						this.refresh();
						this.showDetail = false;
					} else {
						uni.showToast({
							title: "还款失败",
							icon: "none",
							duration: 2000
						});
					}
				})
			},
			memberChange() {
				this.showDetail = false;
				this.memberOptions = [];
				member.memberList(this.CompanyId).then(res => {
					this.memberOptions.push({
						customName: "散客",
						id: ""
					})
					this.memberOptions.push(...(res.data || []));
					this.memberDialogVisible = true
				}).finally(() => {})
			},
			orderMemberChangeMain(memberNew, order) {
				var orderNew = JSON.parse(JSON.stringify(order));
				orderNew.customerId = memberNew.id;
				orderNew.customName = memberNew.customName;
				cashierOrder.exchangMember(JSON.stringify(orderNew)).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '客户变更成功',
							icon: 'none'
						})
						this.dateChange();
						this.memberDialogVisible = false;
					}
				});
			},
			showInfo(e) {
				this.showDetail = true;
				this.currentOrder = e;
				this.currentCardInfo = JSON.parse(e.module);
				this.currentCardInfo=this.currentCardInfo.filter(item => item.type !== 4).sort((a, b) => a.type - b.type);	
			},
			dateChange(beginTime,endTime) {
				this.beginTime = beginTime;
				this.endTime = endTime;
				this.refresh();
			},
			// 筛选功能相关方法
			filterChange(filterType) {
				this.currentFilterType = filterType;
				this.applyFilter();
			},
			applyFilter() {
				if (!this.originalModuleList) {
					return;
				}
				
				let filteredList = [...this.originalModuleList];
				
				switch (this.currentFilterType) {
					case 'debt':
						// 筛选有欠款的订单（下欠金额大于0）
						filteredList = filteredList.filter(item => item.debt > 0);
						break;
					case 'sent':
						// 筛选已发单的订单（shareNum > 0）
						filteredList = filteredList.filter(item => item.shareNum > 0);
						break;
					case 'unsent':
						// 筛选未发单的订单（shareNum === 0 或者 undefined）
						filteredList = filteredList.filter(item => !item.shareNum || item.shareNum === 0);
						break;
					case 'all':
					default:
						// 显示全部订单
						break;
				}
				
				this.moduleList = filteredList;
				
				// 重新计算统计数据（只计算当前筛选结果）
				this.recalculateStats();
			},
			recalculateStats() {
				this.allDebt = 0;
				this.totalMoney = 0;
				this.actualMoney = 0;
				
				this.moduleList.forEach(item => {
					if(item.status != 2) { // 排除退单
						this.allDebt += item.debt;
						this.totalMoney += item.payableAmount;
						this.actualMoney += item.actualMoney;
					}
				});
			},
			checkboxChange(e) {
				this.checkboxValue = [e]
			},
			showHistoryOrder(item){
				this.showDetail = false;
				// 设置当前原始订单ID和订单ID
				this.currentOriginOrderId = item.originOrderId || item.id;
				console.log('显示历史订单，原始订单ID:', this.currentOriginOrderId, '当前订单ID:', item.id);
				
				// 调用API获取历史订单
				this.loadHistoryOrders(this.currentOriginOrderId, item.id);
				
				// 显示抽屉
				this.showHistoryDrawer = true;
			},
			
			// 加载历史订单数据
			loadHistoryOrders(originOrderId, orderId) {
				console.log('加载历史订单:', originOrderId, orderId);
				
				cashierOrder.GetOriginOrderId(originOrderId, orderId).then(res => {
					console.log('历史订单API响应:', res);
					if (res.code === 200) {
						let historyData = res.data || [];
						// 按照updateTime降序排序
						historyData.sort((a, b) => {
							const timeA = a.updateTime || a.createTime || '';
							const timeB = b.updateTime || b.createTime || '';
							return new Date(timeB) - new Date(timeA);
						});
						this.historyOrderList = historyData;
						console.log('历史订单列表(已排序):', this.historyOrderList);
					} else {
						console.error('获取历史订单失败:', res.message);
						this.historyOrderList = [];
						uni.showToast({
							title: '获取历史订单失败',
							icon: 'none'
						});
					}
				}).catch(error => {
					console.error('获取历史订单异常:', error);
					this.historyOrderList = [];
					uni.showToast({
						title: '网络异常',
						icon: 'none'
					});
				});
			},
			
			// 关闭历史订单抽屉
			closeHistoryDrawer() {
				this.showHistoryDrawer = false;
				this.historyOrderList = [];
				this.currentOriginOrderId = "";
			},
			
			// 格式化订单时间
			formatOrderTime(timeStr) {
				if (!timeStr) return '';
				return timeStr.replace('T', ' ').substring(0, 16);
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
			
			// 显示订单详情
			showOrderDetail(order) {
				console.log('显示订单详情:', order);
				// 获取订单详细信息
				this.loadOrderDetail(order.id);
			},
			
			// 加载订单详情数据
			loadOrderDetail(orderId) {
				console.log('加载订单详情:', orderId);
				
				cashierOrder.GetOrderByAccountId(orderId).then(res => {
					console.log('订单详情API响应:', res);
					if (res.code === 200 || res.data) {
						this.orderDetailData = res.data;
						// 解析商品数据
						if (this.orderDetailData.module && typeof this.orderDetailData.module === 'string') {
							try {
								this.orderDetailData.module = JSON.parse(this.orderDetailData.module);
							} catch (error) {
								console.error('解析商品数据失败:', error);
								this.orderDetailData.module = [];
							}
						}
						// 过滤掉type为4的项目，并按type排序
						if (this.orderDetailData.module && Array.isArray(this.orderDetailData.module)) {
							this.orderDetailData.module = this.orderDetailData.module
								.filter(item => item.type !== 4)
								.sort((a, b) => a.type - b.type);
						}
						
						console.log('订单详情数据:', this.orderDetailData);
						this.showOrderDetailDrawer = true;
					} else {
						console.error('获取订单详情失败:', res.message);
						uni.showToast({
							title: '获取订单详情失败',
							icon: 'none'
						});
					}
				}).catch(error => {
					console.error('获取订单详情异常:', error);
					uni.showToast({
						title: '网络异常',
						icon: 'none'
					});
				});
			},
			
			// 关闭订单详情抽屉
			closeOrderDetailDrawer() {
				this.showOrderDetailDrawer = false;
				this.orderDetailData = null;
			},
			deleteHandle() {
				if (!this.isEdting || this.checkboxValue.length == 0) {
					return
				}
				let that = this;
				uni.showModal({
					title: '提示',
					content: '您确定要删除该订单吗？',
					success: (res) => {
						if (res.confirm) {


							var isflag = false;
							that.checkboxValue.forEach(item => {
								that.moduleList.forEach(item2 => {
									if (item2.id == item) {
										if (item2.debt > 0) {
											isflag = true;
										}
									}
								})
							})
							if (isflag) {
								uni.showToast({
									title: '下欠订单不可删除',
									icon: 'none'
								})
								return;
							}

							var order = that.moduleList.filter(x => x.id == that.checkboxValue[0])[0];
							order.companyId = this.CompanyId;
							var userInfo = uni.getStorageSync("userInfo");
							order.operatorId = userInfo.id;
							order.operatorName = userInfo.userName;
							cashierOrder.deleteOrder(JSON.stringify(order)).then(res => {
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								})
								that.getModuleListbyDate(that.single);
							}).finally(() => {
								that.checkboxValue = [];
							})
						} else if (res.cancel) {

						}
					}
				});
			},

			getLastTime() {
				const currentDate = new Date();

				// 获取前一天
				currentDate.setDate(currentDate.getDate() - 1);

				// 格式化日期
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
				const day = String(currentDate.getDate()).padStart(2, '0');

				// 拼接成 YYYY-MM-DD 格式
				const formattedDate = `${year}-${month}-${day}`;
				return formattedDate;
			},
			shareOrder() {
				cashierOrder.GetCanvasBase64ById(this.currentOrder.id).then(res=>{
					if(res.code==200){
						this.downLoadImage(res.data);
					}
				})
			},
			downLoadImage(base64){
				let that = this;
			    const bitmap = new plus.nativeObj.Bitmap("test");
			    bitmap.loadBase64Data(base64, function() {
			        const url = "_doc/" + new Date().getTime() + ".png";  // url为时间戳命名方式
			        bitmap.save(url, {
			            overwrite: true,  // 是否覆盖
			            quality: 100  // 图片清晰度
			        }, (i) => {
			             uni.saveImageToPhotosAlbum({
			                 filePath: url,
			                 success: function() {
								 that.shareImage(url);
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
			shareImage(tempFilePath) {
				uni.share({
					provider: 'weixin',
					type: 2, // 图片类型
					scene: 'WXSceneSession', // 分享到聊天界面
					imageUrl: tempFilePath, // 只分享这张图片的地址
					success(res) {
						console.log('分享成功', res);
					},
					fail(err) {
						console.log('分享失败', err);
					}
				});
			},
			
			printerModel(order) {
				getApp().senBleLabel(order);
			},
			getcurrentTime() {
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
				const day = String(currentDate.getDate()).padStart(2, '0');
				const hours = String(currentDate.getHours()).padStart(2, '0');
				const minutes = String(currentDate.getMinutes()).padStart(2, '0');
				const seconds = String(currentDate.getSeconds()).padStart(2, '0');

				const formattedDate = `${year}-${month}-${day} `;
				return formattedDate;
			},
			showEdit() {
				this.isEdting = !this.isEdting;
				if (this.checkboxValue.length > 0) {
					this.checkboxValue = [];
				}
			},
			TurnToTuigeCashier(){
				uni.navigateTo({
					url: '/pages/cashier/tuigeCashier?order='+JSON.stringify(this.currentOrder)
				})
			},
			TuigeOrder(){
				let that = this;
				that.showDetail = false;
				uni.showModal({
					title: '提示',
					content: '您确定要退单吗？',
					success: (res) => {
						if (res.confirm) {
							that.TuigeOrderAction();		
						}}}
					)
			},
			TuigeOrderAction(){
				var userInfo = uni.getStorageSync("userInfo");
				let param = {
					type:10,
					companyId:this.CompanyId,
					operatorId:userInfo.id,
					operatorName:userInfo.userName,
					content:this.currentOrder.id
				}
				cashierOrder.TuigeAccount(JSON.stringify(param)).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: '退单成功',
							icon: 'none'
						})
						this.showDetail = false;
						this.refresh();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.scrollArea {
		background-color: darkgrey;
	}

	/* 抽屉容器 */
	.drawer-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		z-index: 999;
		margin-top: 50rpx;
		height: calc(100% - 50rpx);
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
		background: #cacaca;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		pointer-events: auto;
	}

	.drawer-content.show {
		transform: translateX(-100%);
	}

	/* 历史订单抽屉样式 */
	.history-order-container {
		padding: 20rpx;
		background-color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		height: 100%;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15rpx;
		background: linear-gradient(135deg, #3498db, #2980b9);
		color: white;
		border-radius: 8rpx;
		margin-bottom: 15rpx;
	}

	.history-title {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.history-title-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30rpx;
		height: 30rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}

	.history-title-text {
		font-size: 24rpx;
		font-weight: bold;
		color: white;
	}

	.history-summary {
		display: flex;
		align-items: center;
	}

	.history-summary-text {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.history-scroll {
		height: 100%;
	}

	.history-order-list {
		padding-bottom: 20rpx;
	}

	.history-order-item {
		background: white;
		border-radius: 8rpx;
		margin-bottom: 15rpx;
		padding: 15rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
		border-left: 3rpx solid #3498db;
		transition: all 0.3s ease;
	}

	.history-order-item:hover {
		box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-1rpx);
		cursor: pointer;
	}

	.history-order-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12rpx;
	}

	.history-order-info {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.history-customer-name {
		font-size: 24rpx;
		font-weight: bold;
		color: #333;
	}

	.history-order-time {
		font-size: 20rpx;
		color: #666;
	}

	.history-order-amounts {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4rpx;
	}

	.history-total-amount {
		font-size: 22rpx;
		color: #333;
		font-weight: bold;
	}

	.history-debt-amount {
		font-size: 20rpx;
		color: #e74c3c;
		font-weight: bold;
	}

	.history-order-detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
		padding-top: 12rpx;
		border-top: 1rpx solid #f0f0f0;
	}

	.history-order-code {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.history-code-label {
		font-size: 20rpx;
		color: #666;
	}

	.history-code-value {
		font-size: 20rpx;
		color: #333;
		font-family: monospace;
	}

	.history-order-status {
		display: flex;
		align-items: center;
	}

	.history-status-tag {
		padding: 3rpx 8rpx;
		border-radius: 10rpx;
		font-size: 18rpx;
		font-weight: 500;
		color: white;
	}

	.history-status-tag.status-normal {
		background-color: #67C23A;
	}

	.history-status-tag.status-refund {
		background-color: #F56C6C;
	}

	.history-status-tag.status-modified {
		background-color: #31BDEC;
	}

	.history-status-tag.status-unknown {
		background-color: #909399;
	}

	.history-status-text {
		font-size: 18rpx;
	}

	.history-order-items {
		padding-top: 8rpx;
		border-top: 1rpx solid #f8f9fa;
	}

	.history-items-text {
		font-size: 20rpx;
		color: #666;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* 空状态样式 */
	.history-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 30rpx;
		text-align: center;
	}

	.history-empty-icon {
		margin-bottom: 15rpx;
	}

	.history-empty-text {
		font-size: 24rpx;
		color: #95a5a6;
		font-weight: 500;
	}

	/* 订单详情抽屉样式 */
	.order-detail-container {
		padding: 12rpx;
		background-color: #fff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
		height: 100%;
		display: flex;
		flex-direction: column;
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

	.table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		margin: 20px 0;
		font-weight: bold;
	}

	.table-header {
		display: table-header-group;
		background-color: #f2f2f2;
	}

	.table-row {
		display: table-row;
	}

	.table-cell {
		display: table-cell;
		border: 1px solid #dddddd;
		padding: 8px;
		text-align: left;
	}

	.table-header-cell {
		display: table-cell;
		border: 1px solid #000000;
		padding: 8px;
		text-align: center;
		font-weight: bold;
		background-color: #dddddd;
	}

	.demo-row {
		display: flex;
		/* 使用 flexbox 布局 */
		flex-wrap: wrap;
		/* 允许换行 */
	}

	.demo-col {
		padding: 10px;
		/* 添加内边距 */
	}

	/* 根据需要设置列的宽度 */
	.col-12 {
		flex: 0 0 60%;
		/* 占据 50% 的宽度 */
	}

	.col-6 {
		flex: 0 0 15%;
		/* 占据 25% 的宽度 */
	}

	.grid-member-container {
		display: flex;
		flex-wrap: wrap;
		/* 允许换行 */
		margin: 5px;
		/* 负边距用于消除间距 */
	}

	.grid-member-item {
		height: 50rpx;
		width: 30%;
		/* 每个格子占据 30% 的宽度 */
		box-sizing: border-box;
		/* 包含内边距和边框 */
		padding: 5rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 圆角 */
		/* 左右对齐 */
		align-items: center;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.row {
		display: flex;
		/* 使用 Flexbox 布局 */
		justify-content: space-between;
		/* 在行内均匀分配空间 */
		margin-bottom: 5px;
		/* 行间距 */
	}

	.member-btn {
		padding: 5rpx 10rpx;
		/* 按钮内边距 */
		/* 按钮背景颜色 */
		color: green;
		/* 按钮文字颜色 */
		border: none;
		/* 去掉边框 */
		border-radius: 3rpx;
		/* 圆角 */
		cursor: pointer;
		/* 鼠标悬停时显示手型 */
	}

	.grid-member-item2 {
		height: 50rpx;
		flex: 1 0 90%;
		/* 每个格子占据 30% 的宽度 */
		box-sizing: border-box;
		/* 包含内边距和边框 */
		padding: 5rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 圆角 */
		display: flex;
		/* 使用 flex 布局 */
		justify-content: space-between;
		/* 左右对齐 */
		align-items: center;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.payment-methods {
		display: flex;
		flex-direction: column;
		/* 垂直排列每个支付方式 */
	}

	.payment-item {
		padding: 10rpx;
		padding-right: 20rpx;
		display: flex;
		/* 水平排列图标和文字 */
		align-items: center;
		/* 垂直居中对齐 */
		margin-bottom: 10px;
		/* 每个支付方式之间的间距 */
	}

	.payment-text {
		margin-left: 8px;
		/* 图标和文字之间的间距 */
	}

	.pay-amount {
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.form-row {
		display: flex;
		width: 100%;
		/* 使其占满父容器的宽度 */
		margin-left: 20px;
	}

	.left-part {
		flex: 1;
		/* 左侧部分占据剩余空间 */
	}

	.right-part {
		display: flex;
		align-items: center;
		/* 垂直居中 */
	}


	.mybrankmask2 .MymaskList {
		display: flex;
		width: 100%;
		height: 30rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem {
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #a8a8a8;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem2 {
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #ffffff;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem3 {
		width: 48%;
		height: 30rpx;
		color: #ffffff;
		background-color: #a8a8a8;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	/* 新增样式 */
	.mybrankmask2 .MymaskList .large {
		height: 100rpx;
		/* 设置更高的高度 */
		line-height: 100rpx;
		/* 使文本垂直居中 */
		z-index: 5;
	}

	.activepayment {
		background-color: #31BDEC;
		border-radius: 10rpx;
	}
</style>