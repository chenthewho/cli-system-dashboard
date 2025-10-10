<template>
	<view class="rotating-container" :style="{ height: windowHeight + 'px' }">
		<!-- 顶部固定头部 -->
		<view class="header-toolbar">
			<!-- 左侧用户信息 -->
			<view class="header-left">
				<text class="header-username" v-if="currentData.dutyInfo">{{ currentData.dutyInfo.userName }}</text>
			</view>

			<!-- 中间当班时间信息 -->
			<view class="header-center">
				<view class="duty-time-info">
					<text class="time-label">当班时间</text>
					<text class="time-value">{{ dutyTime }}</text>
				</view>
			</view>

			<!-- 右侧交账按钮 -->
			<view class="checkout-btn" @click="handleCheckout">
				<text class="checkout-text">交账</text>
			</view>
		</view>

		<!-- 主要内容区域 -->
		<view class="main-container">
			<view class="content-wrapper">
				<!-- 左侧面板 -->
				<view class="left-panel">
					<view class="card-container">
						<!-- 营业额卡片 -->
						<view class="grid card1">
							<view class="card1-header">
								<view class="card-header-title">
									<uni-icons custom-prefix="iconfont"
										type="icon-yingshouguanli-tongjibaobiao-yingshouduizhang" size="20"
										color="#55aaff"></uni-icons>
									<text class="title-text">营业额</text>
								</view>
							</view>
							<view class="card1-content" v-if="currentData">
								<view class="revenue-column">
									<view class="yye-grid" @click="handleTotalMoneyShow">
										<text class="yye-grid-text">已售货款：</text>
										<text class="yye-grid-value">{{ currentData.totalMoney }}</text>
									</view>
									<view class="yye-grid" @click="handleDebtShow">
										<text class="yye-grid-text">下欠金额：</text>
										<text class="yye-grid-value">{{ currentData.debtMoney }}</text>
									</view>
									<view class="yye-grid"  @click="handleTotalMoneyShow">
										<text class="yye-grid-text">总单量：</text>
										<text class="yye-grid-value">{{ currentData.orderNum }}</text>
									</view>
								</view>
								<view class="revenue-column revenue-column-right">
									<view class="yye-grid" @click="handleReceiveMoneyShow">
										<text class="yye-grid-text">收入金额：</text>
										<text class="yye-grid-value">{{ currentData.receiveMoeny }}</text>
									</view>
									<view class="yye-grid" @click="handleRepayShow">
										<text class="yye-grid-text" >还款金额：</text>
										<text class="yye-grid-value">{{ currentData.repayMoney }}</text>
									</view>
									<view class="yye-grid" @click="handleDebtShow">
										<text class="yye-grid-text">下欠单量：</text>
										<text class="yye-grid-value">{{ currentData.debtNum }}</text>
									</view>
								</view>
							</view>
						</view>

						<!-- 底部卡片容器 -->
						<view class="bottom-cards-container">
							<view class="bottom-card-wrapper">
								<!-- 附加物品卡片 -->
								<view class="grid card2">
									<view class="card2-header">
										<view class="card-header-title">
											<view class="header-title-left">
												<uni-icons custom-prefix="iconfont" type="icon-tag" size="20"
													color="#ee9f00"></uni-icons>
												<text class="title-text">附加物品</text>
											</view>
											<view class="header-title-right">
												<zb-tab :value="1" :data="card2tabValue"
													@click-tab="card2tabChange"></zb-tab>
											</view>
										</view>
									</view>
									<view class="card2-content" v-if="currentData">
										<scroll-view class="card2-scroll-area" scroll-x="false">
													<view class="basket-container" v-if="baskerShowType == 1">
														<view class="basket-item-collect" v-for="basket in currentData.collectBasket"
															:key="basket.basketModelName" @click="showBasketDetail(basket)">
															<text class="basket-name">{{ basket.basketModelName }}</text>
															<text class="basket-count">{{ basket.mount }}个</text>
														</view>
													</view>
													<view class="basket-container" v-if="baskerShowType == 2">
														<view class="basket-item-owe" v-for="basket in currentData.oweBasket"
															:key="basket.basketModelName" @click="showBasketDetail(basket)">
															<text class="basket-name">{{ basket.basketModelName }}</text>
															<text class="basket-count">{{ basket.mount }}个</text>
														</view>
													</view>
										</scroll-view>
									</view>
								</view>

								<!-- 其他费用卡片容器 -->
								<view class="other-expenses-container" :style="{ height: (windowHeight - 280 - 150 - 30 - 70) + 'px' }">
									<!-- 费用支出卡片 -->
									<view class="grid card3 expense-card">
										<view class="card3-header">
											<view class="card-header-title">
												<uni-icons custom-prefix="iconfont" type="icon-qitashourudan" size="20"
													color="#e74c3c"></uni-icons>
												<text class="title-text">费用支出</text>
											</view>
										</view>
										<view class="card3-content">
											<view class="empty-content">
												<text class="empty-text">暂无支出记录</text>
											</view>
										</view>
									</view>
									
									<!-- 备用金卡片 -->
									<view class="grid card3 reserve-card">
										<view class="card3-header">
											<view class="card-header-title">
												<view class="header-title-left">
													<uni-icons custom-prefix="iconfont" type="icon-qian" size="20"
														color="#f39c12"></uni-icons>
													<text class="title-text">备用金</text>
												</view>
												<view class="header-title-right">
													<view class="reserve-action-btn" @click="openReserveModal">
														<uni-icons type="plus-filled" size="30" color="#f39c12"></uni-icons>
													</view>
												</view>
											</view>
										</view>
										<view class="card3-content" @click="handleReserveRecordShow">
											<view class="empty-content">
												<text class="empty-text" >￥{{currentData.reservefund}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 右侧面板 -->
				<view class="right-panel">
					<!-- 支付统计卡片 -->
					<view class="grid payment-card" :style="{ backgroundColor: 'white', height: '300px' }">
						<view class="card4-header">
							<view class="card-header-title">支付统计</view>
						</view>
						<view class="payment-content">
						<!-- 第一行：微信 + 支付宝 -->
						<view class="payment-row">
							<!-- 微信支付 -->
							<view class="payment-item wechat-pay" @click="showExpenseAccout(1)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="28" name="weixin-fill"
											color="white"></u-icon>
										<text class="payment-label">微信</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData.accountExpense">
									{{ currentData.accountExpense.wxpayAmount }}
								</view>
							</view>
							<!-- 支付宝 -->
							<view class="payment-item alipay-pay" @click="showExpenseAccout(2)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="28" name="zhifubao" color="white"></u-icon>
										<text class="payment-label">支付宝</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData.accountExpense">
									{{ currentData.accountExpense.alipayAmount }}
								</view>
							</view>
						</view>
						<!-- 第二行：现金 + 其他 -->
						<view class="payment-row">
							<!-- 现金支付 -->
							<view class="payment-item cash-pay" @click="showExpenseAccout(3)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="28" name="red-packet-fill"
											color="white"></u-icon>
										<text class="payment-label">现金</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData.accountExpense">
									{{ currentData.accountExpense.cashAmount }}
								</view>
							</view>
							<!-- 其他支付 -->
							<view class="payment-item other-pay" @click="showExpenseAccout(4)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="28" name="coupon-fill"
											color="white"></u-icon>
										<text class="payment-label">其他</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData">
									{{ getOtherPaymentAmount() }}
								</view>
							</view>
						</view>
						</view>
					</view>

					<!-- 订单数据卡片 -->
					<view class="grid card5" :style="{ height: (windowHeight - 290 - 100) + 'px' }">
						<view class="card5-header">
							<text class="card5-header-text">订单数据：</text>
						</view>
						<view class="card5-content" v-if="currentData">
							<scroll-view class="orders-scroll-area" scroll-x="false" scroll-y="true"
								:style="{ height: (windowHeight - 350 - 100) + 'px' }">
								<view class="order-item" v-for="order in currentData.orderList" :key="order.id"
									@click="openAssistDrawer(order)">
									<view class="order-left">
										<text class="customer-name">{{ order.customName }}</text>
										<text class="order-time">{{ order.createTime.replace("T", " ") }}</text>
									</view>
									<view class="order-right">
										<text v-if="order.debt <= 0" class="amount-paid">￥{{ order.actualMoney }}</text>
										<text v-if="order.debt > 0" class="amount-pending">待付：￥{{ order.debt }}</text>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 抽屉组件 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showDrawer }" @tap="closeDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showDrawer }">
				<slot>
					<!--订单详情抽屉-->
					<div class="order-detail-container" v-if="drawerType === 'orderDetail'">
						<!-- 订单概览信息 -->
						<div class="order-overview">
							<div class="info-item">
								<span class="info-label">创建时间:</span>
								<span class="info-value">{{ currentOrder.createTime ?
									currentOrder.createTime.replace("T", " ") : "" }}</span>
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
						<scroll-view class="product-scroll" :style="{ maxHeight: scrollHeight }" scroll-y="true">
							<div class="product-table">
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
						</scroll-view>
					</div>

					<!--下欠订单列表抽屉-->
					<div class="debt-order-container" v-if="drawerType === 'debtOrderList'">
						<!-- 抽屉头部 -->
						<div class="debt-header">
							<div class="debt-title">
								<view class="debt-title-icon">
									<uni-icons custom-prefix="iconfont" type="icon-qian" size="20" color="#e74c3c"></uni-icons>
								</view>
								<text class="debt-title-text">下欠订单列表</text>
							</div>
							<div class="debt-summary" v-if="currentData">
								<text class="debt-summary-text">共 {{ currentData.debtNum }} 单，下欠金额 ¥{{ currentData.debtMoney }}</text>
							</div>
						</div>

						<!-- 下欠订单列表 -->
						<scroll-view class="debt-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="debt-order-list">
								<div class="debt-order-item" v-for="(order, index) in debtOrderList" :key="index" @click="openOrderDetail(order)">
									<div class="debt-order-header">
										<div class="debt-order-info">
											<text class="debt-customer-name">{{ order.customName || "散客" }}</text>
											<text class="debt-order-time">{{ order.createTime ? order.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="debt-order-amounts">
											<text class="debt-total-amount">总计: ¥{{ order.payableAmount || 0 }}</text>
											<text class="debt-amount">下欠: ¥{{ order.debt || 0 }}</text>
										</div>
									</div>
									<div class="debt-order-detail">
										<div class="debt-order-code">
											<text class="debt-code-label">订单号:</text>
											<text class="debt-code-value">{{ order.accountCode || "-" }}</text>
										</div>
										<div class="debt-order-status">
											<view class="debt-status-tag">
												<text class="debt-status-text">待还款</text>
											</view>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="debt-empty" v-if="!debtOrderList || debtOrderList.length === 0">
									<view class="debt-empty-icon">
										<uni-icons type="info-filled" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="debt-empty-text">暂无下欠订单</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--还款单列表抽屉-->
					<div class="repay-order-container" v-if="drawerType === 'repayOrderList'">
						<!-- 抽屉头部 -->
						<div class="repay-header">
							<div class="repay-title">
								<view class="repay-title-icon">
									<uni-icons custom-prefix="iconfont" type="icon-daifu" size="20" color="#27ae60"></uni-icons>
								</view>
								<text class="repay-title-text">还款记录列表</text>
							</div>
							<div class="repay-summary" v-if="currentData">
								<text class="repay-summary-text">共 {{ repayOrderList.length }} 笔还款记录，总金额 ¥{{ currentData.repayMoney }}</text>
							</div>
						</div>

						<!-- 还款单列表 -->
						<scroll-view class="repay-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="repay-order-list">
								<div class="repay-order-item" v-for="(order, index) in repayOrderList" :key="index">
									<div class="repay-order-header">
										<div class="repay-order-info">
											<text class="repay-customer-name">{{ order.customerName || "散客" }}</text>
											<text class="repay-order-time">{{ order.createTime ? order.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="repay-order-amounts">
											<text class="repay-amount">¥{{ order.repayAmount || 0 }}</text>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="repay-empty" v-if="!repayOrderList || repayOrderList.length === 0">
									<view class="repay-empty-icon">
										<uni-icons type="checkmark-circle" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="repay-empty-text">暂无还款记录</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--已售货款订单列表抽屉-->
					<div class="total-money-order-container" v-if="drawerType === 'totalMoneyOrderList'">
						<!-- 抽屉头部 -->
						<div class="total-money-header">
							<div class="total-money-title">
								<view class="total-money-title-icon">
									<uni-icons custom-prefix="iconfont" type="icon-yingshouguanli-tongjibaobiao-yingshouduizhang" size="20" color="#55aaff"></uni-icons>
								</view>
								<text class="total-money-title-text">已售货款订单列表</text>
							</div>
							<div class="total-money-summary" v-if="currentData">
								<text class="total-money-summary-text">共 {{ currentData.orderList.length }} 个订单，总金额 ¥{{ currentData.totalMoney }}</text>
							</div>
						</div>

						<!-- 已售货款订单列表 -->
						<scroll-view class="total-money-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="total-money-order-list">
								<div class="total-money-order-item" v-for="(order, index) in currentData.orderList" :key="index" @click="openOrderDetail(order)">
									<div class="total-money-order-header">
										<div class="total-money-order-info">
											<text class="total-money-customer-name">{{ order.customName || "散客" }}</text>
											<text class="total-money-order-time">{{ order.createTime ? order.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="total-money-order-amounts">
											<text class="total-money-total-amount">总计: ¥{{ order.payableAmount || 0 }}</text>
											<text class="total-money-actual-amount">实付: ¥{{ order.actualMoney || 0 }}</text>
											<text v-if="order.debt > 0" class="total-money-debt-amount">下欠: ¥{{ order.debt }}</text>
										</div>
									</div>
									<div class="total-money-order-detail">
										<div class="total-money-order-code">
											<text class="total-money-code-label">订单号:</text>
											<text class="total-money-code-value">{{ order.accountCode || "-" }}</text>
										</div>
										<div class="total-money-order-status">
											<view class="total-money-status-tag" :class="{ 'debt-status': order.debt > 0, 'paid-status': order.debt <= 0 }">
												<text class="total-money-status-text">{{ order.debt > 0 ? '部分付款' : '已付款' }}</text>
											</view>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="total-money-empty" v-if="!currentData.orderList || currentData.orderList.length === 0">
									<view class="total-money-empty-icon">
										<uni-icons type="list" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="total-money-empty-text">暂无订单记录</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--收入金额订单列表抽屉-->
					<div class="receive-money-order-container" v-if="drawerType === 'receiveMoneyOrderList'">
						<!-- 抽屉头部 -->
						<div class="receive-money-header">
							<div class="receive-money-title">
								<view class="receive-money-title-icon">
									<uni-icons custom-prefix="iconfont" type="icon-yingshouguanli-tongjibaobiao-yingshouduizhang" size="20" color="#27ae60"></uni-icons>
								</view>
								<text class="receive-money-title-text">收入金额订单列表</text>
							</div>
							<div class="receive-money-summary" v-if="currentData">
								<text class="receive-money-summary-text">共 {{ currentData.orderList.filter(order => order.actualMoney > 0).length }} 个有收入订单，总收入 ¥{{ currentData.receiveMoeny }}</text>
							</div>
						</div>

						<!-- 收入金额订单列表 -->
						<scroll-view class="receive-money-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="receive-money-order-list">
								<div class="receive-money-order-item" v-for="(order, index) in currentData.orderList.filter(order => order.actualMoney > 0)" :key="index" @click="openOrderDetail(order)">
									<div class="receive-money-order-header">
										<div class="receive-money-order-info">
											<text class="receive-money-customer-name">{{ order.customName || "散客" }}</text>
											<text class="receive-money-order-time">{{ order.createTime ? order.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="receive-money-order-amounts">
											<text class="receive-money-total-amount">总计: ¥{{ order.payableAmount || 0 }}</text>
											<text class="receive-money-actual-amount">实收: ¥{{ order.actualMoney || 0 }}</text>
											<text v-if="order.debt > 0" class="receive-money-debt-amount">下欠: ¥{{ order.debt }}</text>
										</div>
									</div>
									<div class="receive-money-order-detail">
										<div class="receive-money-order-code">
											<text class="receive-money-code-label">订单号:</text>
											<text class="receive-money-code-value">{{ order.accountCode || "-" }}</text>
										</div>
										<div class="receive-money-order-status">
											<view class="receive-money-status-tag" :class="{ 'partial-paid': order.debt > 0, 'full-paid': order.debt <= 0 }">
												<text class="receive-money-status-text">{{ order.debt > 0 ? '部分收款' : '全额收款' }}</text>
											</view>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="receive-money-empty" v-if="!currentData.orderList || currentData.orderList.filter(order => order.actualMoney > 0).length === 0">
									<view class="receive-money-empty-icon">
										<uni-icons type="wallet" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="receive-money-empty-text">暂无收入记录</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--支付方式收入项抽屉-->
					<div class="expense-accout-container" v-if="drawerType === 'expenseAccoutList'">
						<!-- 抽屉头部 -->
						<div class="expense-accout-header">
							<div class="expense-accout-title">
								<view class="expense-accout-title-icon">
									<uni-icons :type="getPaymentIcon(showExpenseAccoutType)" size="20" :color="getPaymentColor(showExpenseAccoutType)"></uni-icons>
								</view>
								<text class="expense-accout-title-text" :style="{ color: getPaymentColor(showExpenseAccoutType) }">{{ getPaymentTypeName(showExpenseAccoutType) }}收入明细</text>
							</div>
							<div class="expense-accout-summary" :style="{ backgroundColor: getPaymentBgColor(showExpenseAccoutType), borderColor: getPaymentBorderColor(showExpenseAccoutType) }">
								<text class="expense-accout-summary-text" :style="{ color: getPaymentColor(showExpenseAccoutType) }">共 {{ expenseAccoutList.length }} 条记录</text>
							</div>
						</div>

						<!-- 收入项列表 -->
						<scroll-view class="expense-accout-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="expense-accout-list">
								<div class="expense-accout-item" 
									 v-for="(item, index) in expenseAccoutList" 
									 :key="index"
									 :class="{ 'clickable': item.accountExpenseType === 1 }"
									 @click="handleExpenseItemClick(item)">
									<div class="expense-accout-item-header">
										<div class="expense-accout-item-info">
											<text class="expense-accout-item-type">{{ getAccountExpenseTypeText(item.accountExpenseType) }}</text>
											<text class="expense-accout-create-time">{{ item.createTime ? item.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="expense-accout-item-amounts">
											<text class="expense-accout-amount" :class="{ 'income': item.expenseType === 2, 'expense': item.expenseType === 1 }">
												{{ item.expenseType === 2 ? '+' : '-' }}¥{{ item.expenseNum || 0 }}
											</text>
										</div>
									</div>
									<div class="expense-accout-item-detail">
										<div class="expense-accout-direction">
											<view class="expense-accout-direction-tag" :class="{ 'income-tag': item.expenseType === 2, 'expense-tag': item.expenseType === 1 }">
												<text class="expense-accout-direction-text">{{ item.expenseType === 2 ? '收入' : '支出' }}</text>
											</view>
										</div>
										<div class="expense-accout-action" v-if="item.accountExpenseType === 1">
											<view class="expense-accout-action-icon">
												<uni-icons type="right" size="12" color="#007AFF"></uni-icons>
											</view>
											<text class="expense-accout-action-text">查看订单</text>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="expense-accout-empty" v-if="!expenseAccoutList || expenseAccoutList.length === 0">
									<view class="expense-accout-empty-icon">
										<uni-icons type="wallet" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="expense-accout-empty-text">暂无收入记录</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--备用金记录抽屉-->
					<div class="reserve-record-container" v-if="drawerType === 'reserveRecordList'">
						<!-- 抽屉头部 -->
						<div class="reserve-record-header">
							<div class="reserve-record-title">
								<view class="reserve-record-title-icon">
									<uni-icons custom-prefix="iconfont" type="icon-qian" size="20" color="#f39c12"></uni-icons>
								</view>
								<text class="reserve-record-title-text">备用金操作记录</text>
							</div>
							<div class="reserve-record-summary" v-if="currentData">
								<text class="reserve-record-summary-text" >当前备用金余额：￥{{ currentData.reservefund }}</text>
							</div>
						</div>

						<!-- 备用金记录列表 -->
						<scroll-view class="reserve-record-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
							<div class="reserve-record-list">
								<div class="reserve-record-item" v-for="(record, index) in reserveRecordList" :key="index">
									<div class="reserve-record-header">
										<div class="reserve-record-info">
											<text class="reserve-record-type" :class="{ 'income': record.reservefundOperatorType === 2, 'expense': record.reservefundOperatorType === 1 }">{{ getReserveOperationType(record.reservefundOperatorType) }}</text>
											<text class="reserve-record-time">{{ record.createTime ? record.createTime.replace("T", " ") : "" }}</text>
										</div>
										<div class="reserve-record-amounts">
											<text class="reserve-record-amount" :class="{ 'income': record.reservefundOperatorType === 2, 'expense': record.reservefundOperatorType === 1 }">
												{{ record.reservefundOperatorType === 2 ? '+' : '-' }}¥{{ record.mount || 0 }}
											</text>
										</div>
									</div>
									<div class="reserve-record-detail" v-if="record.remark">
										<div class="reserve-record-remark">
											<text class="reserve-record-remark-label">备注:</text>
											<text class="reserve-record-remark-value">{{ record.remark }}</text>
										</div>
									</div>
								</div>
								<!-- 空状态 -->
								<div class="reserve-record-empty" v-if="!reserveRecordList || reserveRecordList.length === 0">
									<view class="reserve-record-empty-icon">
										<uni-icons type="wallet" size="40" color="#bdc3c7"></uni-icons>
									</view>
									<text class="reserve-record-empty-text">暂无备用金操作记录</text>
								</div>
							</div>
						</scroll-view>
					</div>

					<!--营业额订单抽屉-->
					<!--还筐、押筐抽屉-->
				</slot> <!-- 抽屉内容插槽 -->
			</view>
		</view>

		<!-- 备用金弹窗 -->
		<view class="reserve-modal-container" v-if="showReserveModal">
			<!-- 遮罩层 -->
			<view class="modal-mask" @tap="closeReserveModal"></view>
			
			<!-- 弹窗内容 -->
			<view class="reserve-modal">
				<view class="modal-header">
					<text class="modal-title">备用金操作</text>
					<view class="modal-close" @tap="closeReserveModal">
						<uni-icons type="closeempty" size="20" color="#666"></uni-icons>
					</view>
				</view>
				
				<view class="modal-content">
					<!-- 操作类型选择 -->
					<view class="operation-type">
						<view class="type-btn" 
							  :class="{ 'active': reserveOperationType === 'add' }" 
							  @click="reserveOperationType = 'add'">
							<uni-icons type="plus" size="16" color="#27ae60"></uni-icons>
							<text>增加备用金</text>
						</view>
						<view class="type-btn" 
							  :class="{ 'active': reserveOperationType === 'expense' }" 
							  @click="reserveOperationType = 'expense'">
							<uni-icons type="minus" size="16" color="#e74c3c"></uni-icons>
							<text>支出备用金</text>
						</view>
					</view>
					
					<!-- 金额输入 -->
					<view class="amount-input-section">
						<text class="input-label">金额</text>
						<input class="amount-input" 
							   type="number" 
							   v-model="reserveAmount" 
							   placeholder="请输入金额" 
							   :focus="showReserveModal"
							   />
					</view>
					
					<!-- 备注输入 -->
					<view class="remark-input-section">
						<text class="input-label">备注</text>
						<textarea class="remark-input" 
								  v-model="reserveRemark" 
								  placeholder="请输入备注（可选）"
								  maxlength="100"></textarea>
					</view>
				</view>
				
				<view class="modal-footer">
					<view class="btn-cancel" @click="closeReserveModal">取消</view>
					<view class="btn-confirm" @click="confirmReserveOperation">确认</view>
				</view>
			</view>
		</view>

		<!-- 还筐详情抽屉 -->
		<view class="basket-detail-drawer-container" v-if="basketDetailVisible" @click="closeBasketDetail">
			<view class="basket-detail-mask"></view>
			<view class="basket-detail-content" @click.stop="">
				<div class="basket-detail-order-container">
					<!-- 抽屉头部 -->
					<div class="basket-detail-header">
						<div class="basket-detail-title">
							<view class="basket-detail-title-icon">
								<uni-icons type="basket" size="20" color="#55aaff"></uni-icons>
							</view>
							<text class="basket-detail-title-text">{{ baskerShowType === 2 ? '押筐详情' : '还筐详情' }}</text>
						</div>
						<div class="basket-detail-summary" v-if="selectedBasket">
							<text class="basket-detail-summary-text">{{ selectedBasket.basketModelName }} - {{ selectedBasket.mount }}个，共 {{ unifiedRecords.length }} 条记录</text>
						</div>
					</div>

					<!-- 相关记录列表 -->
					<scroll-view class="basket-detail-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
						<div class="basket-detail-record-list">
							<div class="basket-detail-record-item" v-for="record in unifiedRecords" :key="record.id + record.type">
								<div class="basket-detail-record-header">
									<div class="basket-detail-record-info">
										<text class="basket-detail-record-type" :class="record.type === 'order' ? 'type-order' : 'type-repay'">
											{{ record.type === 'order' ? (baskerShowType === 2 ? '订单押筐' : '订单抵扣') : (baskerShowType === 2 ? '押筐单' : '还筐单') }}
										</text>
										<text class="basket-detail-record-time">{{ formatDate(record.createTime) }}</text>
									</div>
									<div class="basket-detail-record-amounts">
										<text class="basket-detail-customer-name">{{ record.customerName || '' }}</text>
										<text class="basket-detail-basket-count">{{ record.basketCount }}</text>
									</div>
								</div>
							</div>
						</div>

						<div class="basket-detail-no-data" v-if="!unifiedRecords || unifiedRecords.length === 0">
							<uni-icons type="info-filled" size="20" color="#ccc"></uni-icons>
							<text>暂无相关数据</text>
						</div>
					</scroll-view>
				</div>
			</view>
		</view>

	</view>
</template>

<script>
import cashierOrder from '../../api/cashier/cashierOrder'
import basketApi from '../../api/basket/basketApi'
import category from '../../api/goods/category'
import duty from '../../api/duty/duty'
export default {
	name: 'rotating',
	components: {},
	data() {
		return {
			CompanyId: "",
			searchVal: '',
			windowHeight: 0,
			currentData: {},
			currentDutyId: "",
			currentDutyBeginTime: "",
			dutyTime: null,
			timer: null,
			card2tabValue: [{
				name: "还筐",
				value: 1,
			},
			{
				name: "押筐",
				value: 2
			},
			],
			showDrawer: false,
			drawerType: '', // 'orderDetail' | 'debtOrderList' | 'repayOrderList' | 'payment' | 'revenue' | 'basket'
			currentOrder: {},
			debtOrderList:[],
			repayOrderList:[],
			baskerShowType:1,
			showExpenseAccoutType:1,
			expenseAccoutList:[],
			// 备用金相关数据
			showReserveModal: false,
			reserveOperationType: 'add', // 'add' | 'expense'
			reserveAmount: '',
			reserveRemark: '',
			reserveRecordList: [], // 备用金操作记录列表
			// 还筐详情相关数据
			basketDetailVisible: false,
			selectedBasket: null,
			relatedOrders: [],
			repayBasketOrders: []
		}
	},
	computed: {
		// 统一的记录列表
		unifiedRecords() {
			const records = [];
			console.log("this.repayBasketOrders",this.repayBasketOrders);
			// 添加订单记录
			if (this.relatedOrders && this.relatedOrders.length > 0) {
				this.relatedOrders.forEach(order => {
					// 计算order的allGoodModel里面commodyId等于selectedBasket.Id的mount之和
					let basketCountInOrder = 0;
					if (order.oweBasketModelList && Array.isArray(order.oweBasketModelList) && this.selectedBasket) {
						// 尝试使用不同的ID字段名称
						const basketId = this.selectedBasket.Id || this.selectedBasket.id || this.selectedBasket.basketModelId;
						if (basketId) {
							// 根据baskerShowType决定筛选条件：押筐(2)对应oweBasketModelType==1，还筐(1)对应oweBasketModelType==2
							const targetType = this.baskerShowType === 2 ? 1 : 2;
							basketCountInOrder = order.oweBasketModelList
								.filter(good => good.extraModelId === basketId && good.oweBasketModelType === targetType)
								.reduce((sum, good) => sum + (parseFloat(good.mount) || 0), 0);
							
							console.log(`订单ID: ${order.id}, selectedBasket ID: ${basketId}, baskerShowType: ${this.baskerShowType}, targetType: ${targetType}, 匹配的商品:`, 
								order.oweBasketModelList.filter(good => good.extraModelId === basketId && good.oweBasketModelType === targetType), 
								`总数量: ${basketCountInOrder}`);
						} else {
							console.log('selectedBasket中找不到有效的ID字段:', this.selectedBasket);
						}
					}
					
					records.push({
						id: order.id,
						type: 'order',
						customerName: order.customerName || '',
						basketCount: `${basketCountInOrder}个`,
						createTime: order.createTime,
						sortTime: new Date(order.createTime).getTime() || 0
					});
				});
			}

			// 添加还筐记录
			if (this.repayBasketOrders && this.repayBasketOrders.length > 0) {
				this.repayBasketOrders.forEach(repay => {
					// 计算basketList中Mount的总和
					let totalBasketCount = 0;
					if (repay.basketList && Array.isArray(repay.basketList)) {
						totalBasketCount = repay.basketList.reduce((sum, basket) => {
							return sum + (basket.mount || 0);
						}, 0);
						console.log(`还筐单ID: ${repay.id}, basketList:`, repay.basketList, `总数量: ${totalBasketCount}`);
					} else {
						// 如果没有basketList，尝试使用basketCount作为兜底
						totalBasketCount = repay.basketCount || 0;
						console.log(`还筐单ID: ${repay.id}, 没有basketList，使用basketCount: ${totalBasketCount}`);
					}
					
					records.push({
						id: repay.id,
						type: 'repay',
						customerName: repay.customerName || '',
						basketCount: `${totalBasketCount}个`,
						createTime: repay.createTime,
						sortTime: new Date(repay.createTime).getTime() || 0
					});
				});
			}
			
			// 按时间倒序排列（最新的在前面）
			return records.sort((a, b) => b.sortTime - a.sortTime);
		}
	},
	beforeMount() {
		this.CompanyId = uni.getStorageSync("companyId");
		this.currentDutyId = uni.getStorageSync("currentDutyId");
		this.currentDutyBeginTime = uni.getStorageSync("currentDutybeginTime");
		//获取当前班次的数据
		this.getCurrentData();
		this.getSystemheight();
		this.timer = setInterval(() => {
			if (this.currentDutyBeginTime != null) {
				// 获取当前时间
				const now = new Date();
				// 将 beginTime 转换为 Date 对象（假设 beginTime 是时间戳或可解析的日期字符串）
				const beginTime = new Date(this.currentDutyBeginTime);
				// 计算时间差（毫秒）
				const timeDiff = now - beginTime;

				// 将毫秒转换为更友好的格式（例如：HH:MM:SS）
				this.dutyTime = this.formatTime(timeDiff);
			}
		}, 1000);
	},
	beforeDestroy() {
		// 组件销毁前清除计时器
		clearInterval(this.timer)
	},
	methods: {
		showExpenseAccout(ExpenseAccoutType){
			this.showExpenseAccoutType = ExpenseAccoutType;
			duty.GetExpenseAccoutByDutyandType(this.currentDutyId,ExpenseAccoutType).then(res => {
				console.log("res",res);
				this.expenseAccoutList = res.data;
				this.drawerType = 'expenseAccoutList';
				this.showDrawer = true;
			})
		},
		handleTotalMoneyShow(){
			// 显示已售货款订单列表，使用currentData.orderList
			this.drawerType = 'totalMoneyOrderList';
			this.showDrawer = true;
		},
		handleReceiveMoneyShow(){
			// 显示收入金额订单列表，筛选actualMoney大于0的订单
			this.drawerType = 'receiveMoneyOrderList';
			this.showDrawer = true;
		},
		handleDebtShow(){
			duty.getDutyDebtOrder(this.currentDutyId).then(res => {
				this.debtOrderList = res.data;
				this.drawerType = 'debtOrderList';
				this.showDrawer = true;
			})
		},
		handleRepayShow(){
			duty.getDutyRepayOrder(this.currentDutyId).then(res => {
				this.repayOrderList = res.data;
				this.drawerType = 'repayOrderList';
				this.showDrawer = true;
			})
		},
		card2tabChange(e) {
			this.baskerShowType = e.value;
		},
		handleCheckout() {
			uni.showModal({
				title: '确认交账',
				content: '确定要进行交账操作吗？',
				success: (res) => {
					if (res.confirm) {
						this.finishDutyAction();
					}
				}
			});
		},
		finishDutyAction(){
			var userInfo = uni.getStorageSync("userInfo");
			duty.changeDuty(this.CompanyId,userInfo.id).then(res => {
				console.log("res",res);
				uni.showToast({
					title: '交账成功',
					icon: 'success'
				});
				getApp().logout();
			})
		},
		formatTime(ms) {
			// 计算天、小时、分钟、秒
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
			const days = Math.floor(ms / (1000 * 60 * 60 * 24));

			// 补零显示
			const pad = (num) => num.toString().padStart(2, '0');

			// 根据天数决定显示格式
			if (days > 0) {
				// 超过1天时显示：X天 HH:MM:SS
				return `${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
			} else if (hours > 0) {
				// 超过1小时但不足1天时显示：HH:MM:SS
				return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
			} else {
				// 不足1小时时显示：MM:SS
				return `${pad(minutes)}:${pad(seconds)}`;
			}
		},
		getSystemheight() {
			this.windowHeight = uni.getWindowInfo().windowHeight;
		},
		getCurrentData() {
			duty.getDutyStatic(this.currentDutyId).then(res => {
				this.currentData = res.data;
			})
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
		//关闭抽屉
		closeDrawer() {
			this.showDrawer = false;
			this.drawerType = '';
		},
		//打开抽屉
		openAssistDrawer(e) {
			cashierOrder.GetOrderByAccountId(e.id).then(res => {
				this.currentOrder = res.data;
				this.currentOrder.module = JSON.parse(res.data.module);
				this.currentOrder.module = this.currentOrder.module.filter(item => item.type !== 4).sort((a, b) => a.type - b.type);
				console.log("res", this.currentOrder);
				this.drawerType = 'orderDetail';
				this.showDrawer = true;
			})
		},
		
		//从下欠列表点击订单打开详情
		openOrderDetail(order) {
			cashierOrder.GetOrderByAccountId(order.id).then(res => {
				this.currentOrder = res.data;
				this.currentOrder.module = JSON.parse(res.data.module);
				this.currentOrder.module = this.currentOrder.module.filter(item => item.type !== 4).sort((a, b) => a.type - b.type);
				this.drawerType = 'orderDetail';
				this.showDrawer = true;
			})
		},

		// 动态计算滚动区域高度
		scrollHeight() {
			const itemCount = this.filteredItems.length
			const baseHeight = itemCount > 3 ? 300 : 200
			return `${baseHeight}rpx`
		},
		
		// 获取账户支出类型文本
		getAccountExpenseTypeText(type) {
			switch(type) {
				case 1:
					return '下单项';
				case 2:
					return '还筐项';
				case 3:
					return '还款项';
				default:
					return '未知类型';
			}
		},
		
		// 处理收入项点击事件
		handleExpenseItemClick(item) {
			// 只有下单项才可以点击查看订单
			if (item.accountExpenseType === 1) {
				// 通过accountId查找对应的订单
				const order = this.currentData.orderList.find(o => o.id === item.accountId);
				if (order) {
					this.openOrderDetail(order);
				} else {
					// 如果在当前订单列表中找不到，可以通过API获取
					cashierOrder.GetOrderByAccountId(item.accountId).then(res => {
						this.currentOrder = res.data;
						this.currentOrder.module = JSON.parse(res.data.module);
						this.currentOrder.module = this.currentOrder.module.filter(item => item.type !== 4).sort((a, b) => a.type - b.type);
						this.drawerType = 'orderDetail';
						this.showDrawer = true;
					}).catch(err => {
						uni.showToast({
							title: '订单信息获取失败',
							icon: 'none'
						});
					});
				}
			}
		},
		
		// 获取支付方式名称
		getPaymentTypeName(type) {
			switch(type) {
				case 1:
					return '微信支付';
				case 2:
					return '支付宝';
				case 3:
					return '现金支付';
				case 4:
					return '其他支付';
				default:
					return '支付方式';
			}
		},
		
		// 获取支付方式图标
		getPaymentIcon(type) {
			switch(type) {
				case 1:
					return 'weixin-fill';
				case 2:
					return 'zhifubao';
				case 3:
					return 'red-packet-fill';
				case 4:
					return 'coupon-fill';
				default:
					return 'wallet-filled';
			}
		},
		
		// 获取支付方式颜色
		getPaymentColor(type) {
			switch(type) {
				case 1:
					return '#07c160'; // 微信绿
				case 2:
					return '#1677ff'; // 支付宝蓝
				case 3:
					return '#ff6b35'; // 现金橙
				case 4:
					return '#f57c00'; // 其他橙色
				default:
					return '#007AFF';
			}
		},
		
		// 获取支付方式背景色
		getPaymentBgColor(type) {
			switch(type) {
				case 1:
					return '#f0fff4'; // 微信浅绿背景
				case 2:
					return '#f0f8ff'; // 支付宝浅蓝背景
				case 3:
					return '#fff8f0'; // 现金浅橙背景
				case 4:
					return '#fff8e1'; // 其他浅黄背景
				default:
					return '#f8f9fa';
			}
		},
		
		// 获取支付方式边框色
		getPaymentBorderColor(type) {
			switch(type) {
				case 1:
					return '#b3ffcc'; // 微信绿边框
				case 2:
					return '#b3d9ff'; // 支付宝蓝边框
				case 3:
					return '#ffcc99'; // 现金橙边框
				case 4:
					return '#ffcc80'; // 其他黄边框
				default:
					return '#e9ecef';
			}
		},
		
		// 备用金相关方法
		openReserveModal() {
			this.showReserveModal = true;
			this.reserveOperationType = 'add';
			this.reserveAmount = '';
			this.reserveRemark = '';
		},
		
		closeReserveModal() {
			this.showReserveModal = false;
			this.reserveAmount = '';
			this.reserveRemark = '';
		},
		
		confirmReserveOperation() {
			// 验证输入
			if (!this.reserveAmount || this.reserveAmount <= 0) {
				uni.showToast({
					title: '请输入有效金额',
					icon: 'none'
				});
				return;
			}
			
			// 这里可以添加API调用来保存备用金记录
			const operationText = this.reserveOperationType === 'add' ? '增加' : '支出';
			const amount = parseFloat(this.reserveAmount);
			var userInfo = uni.getStorageSync("userInfo");
			const data = {
				operatorId:userInfo.id,
				dutyId: this.currentDutyId,
				mount: amount,
				remark: this.reserveRemark,
				dutyId: this.currentDutyId,
				reservefundOperatorType:this.reserveOperationType=='add'?2:1
			}
			
			duty.addReservefundRecord(data).then(res => {
				console.log("res",res);
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				});
				// 操作成功后关闭弹窗并刷新数据
				this.closeReserveModal();
				this.getCurrentData(); // 刷新当前数据
			})
		},
		
		// 显示备用金记录
		handleReserveRecordShow() {
			duty.getReservefundRecordByDutyId(this.currentDutyId).then(res => {
				console.log("备用金记录", res);
				this.reserveRecordList = res.data || [];
				this.drawerType = 'reserveRecordList';
				this.showDrawer = true;
			}).catch(err => {
				console.error("获取备用金记录失败:", err);
				uni.showToast({
					title: '获取记录失败',
					icon: 'none'
				});
			});
		},
		
		// 获取备用金操作类型文本
		getReserveOperationType(type) {
			switch(type) {
				case 1:
					return '支出';
				case 2:
					return '收入';
				default:
					return '未知操作';
			}
		},
		// 计算其他支付金额（包含备用金）
		getOtherPaymentAmount() {
			if (!this.currentData) return 0;
			const otherAmount = parseFloat(this.currentData.accountExpense?.otherAmount) || 0;
			const reserveAmount = parseFloat(this.currentData.reservefund) || 0;
			return (otherAmount + reserveAmount).toFixed(0);
		},

		// 还筐详情相关方法
		showBasketDetail(basket) {
			console.log('点击筐子项目:', basket);
			this.selectedBasket = basket;
			this.basketDetailVisible = true;
			this.loadBasketDetailData(basket);
		},

		closeBasketDetail() {
			this.basketDetailVisible = false;
			this.selectedBasket = null;
			this.relatedOrders = [];
			this.repayBasketOrders = [];
		},

		async loadBasketDetailData(basket) {
			try {
				console.log('开始加载筐子详情数据:', basket);
				
				uni.showLoading({
					title: '加载中...'
				});

				// 并行调用两个API获取相关数据
				const promises = [];

				// 获取相关订单数据
				if (basket.relateAccountIdList && basket.relateAccountIdList.length > 0) {

					const orderPromise = cashierOrder.GetOrderByOrderIdList(basket.relateAccountIdList)
						.then(response => {
							if (response.code === 200 && response.data) {
								this.relatedOrders = Array.isArray(response.data) ? response.data : [response.data];
								console.log('相关订单数据:', this.relatedOrders);
								// 调试每个订单的allGoodModel
								this.relatedOrders.forEach(order => {
									console.log(`订单ID: ${order.id}, allGoodModel:`, order.allGoodModel);
								});
							}
						})
						.catch(error => {
							console.error('获取相关订单失败:', error);
							this.relatedOrders = [];
						});
					promises.push(orderPromise);
				}

				// 获取还筐记录数据
				if (basket.relateRepayBasketOrderIdList && basket.relateRepayBasketOrderIdList.length > 0) {

					const repayPromise = basketApi.GetRepayBasketOrdersByIdList(basket.relateRepayBasketOrderIdList)
						.then(response => {
							if (response.code === 200 && response.data) {
								this.repayBasketOrders = Array.isArray(response.data) ? response.data : [response.data];
								console.log('还筐记录数据:', this.repayBasketOrders);
							}
						})
						.catch(error => {
							console.error('获取还筐记录失败:', error);
							this.repayBasketOrders = [];
						});
					promises.push(repayPromise);
				}

				// 等待所有请求完成
				await Promise.all(promises);

				uni.hideLoading();
			} catch (error) {
				uni.hideLoading();
				console.error('加载还筐详情失败:', error);
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'error'
				});
			}
		},

		// 格式化日期显示
		formatDate(dateString) {
			console.log('dateString', dateString);
			if (!dateString) return '--';
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return '--';
			return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style lang="scss" scoped>
// 主容器
.rotating-container {
	background-color: gainsboro;
	overflow: hidden;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

// 顶部工具栏
.header-toolbar {
	top: 0;
	left: 0;
	right: 0;
	height: 70px;
	background-color: white;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid #e5e5e5;
}

// 左侧用户信息
.header-left {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.header-username {
	font-size: 24rpx;
	font-weight: bold;
	color: #2c3e50;
}

.header-role {
	font-size: 18rpx;
	color: #7f8c8d;
	font-weight: 500;
}

// 中间时间信息
.header-center {
	flex: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
	min-width: 0;
}

.duty-status-indicator {
	display: flex;
	align-items: center;
	gap: 6rpx;
	background: #f8f9fa;
	padding: 6rpx 12rpx;
	border-radius: 16rpx;
	border: 1rpx solid #e5e5e5;
}

.status-dot {
	width: 8rpx;
	height: 8rpx;
	background: #27ae60;
	border-radius: 50%;
}

.status-text {
	font-size: 20rpx;
	color: #27ae60;
	font-weight: 500;
}

.duty-time-info {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8rpx;
	background: #f8f9fa;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
	border: 1rpx solid #e5e5e5;
}

.time-label {
	font-size: 16rpx;
	color: #6c757d;
	font-weight: 500;
}

.time-value {
	font-size: 20rpx;
	font-weight: 600;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

// 右侧交账按钮
.checkout-btn {
	flex: 1;
	max-width: 120rpx;
	background-color: #007AFF;
	color: white;
	height: 40px;
	margin: 0;
	padding: 0 24rpx;
	border-radius: 8rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	box-shadow: 0 2rpx 6rpx rgba(0, 123, 255, 0.25);
}

.checkout-text {
	font-weight: 600;
	font-size: 28rpx;
	white-space: nowrap;
}

// 主容器
.main-container {
	flex: 1;
}

.content-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	background-color: gainsboro;
	padding: 5rpx;
	gap: 5rpx;
}

// 左侧面板
.left-panel {
	flex: 3;
}

.card-container {
	display: flex;
	flex-direction: column;
	gap: 3rpx;
}

// 通用卡片样式
.grid {
	background-color: white;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	border-radius: 10px;
	border: 1rpx solid #e5e5e5;
	overflow: hidden;
}

// 卡片头部标题样式
.card-header-title {
	display: flex;
	align-items: center;
	font-weight: bold;
	font-size: 15rpx;
	padding: 10rpx;
	color: #888888;
}

.title-text {
	margin-left: 5rpx;
}

// 营业额卡片
.card1 {
	margin-right: 3rpx;
	height: 280px;
	margin-bottom: 3rpx;
	width: 99%;
}

.card1-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
}

.card1-content {
	display: flex;
	padding: 8rpx;
	gap: 8rpx;
	height: calc(100% - 50rpx); /* 更精确地计算可用高度 */
	overflow: hidden;
	box-sizing: border-box;
}

.revenue-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.revenue-column-right {
	margin-left: 8rpx;
}

.yye-grid {
	display: flex;
	flex: 1;
	justify-content: space-between;
	align-items: center;
	background-color: #f8f9fa;
	margin: 2rpx 0;
	border-radius: 6rpx;
	padding: 6rpx 10rpx;
	font-size: 12rpx;
	border: 1rpx solid #e9ecef;
	min-height: 35rpx;
	max-height: 50rpx; /* 减小最大高度 */
}

.yye-grid-text {
	font-size: 10rpx;
	color: #6c757d;
	font-weight: 500;
	white-space: nowrap;
}

.yye-grid-value {
	font-size: 15rpx;
	color: #2c3e50;
	font-weight: 600;
	text-align: right;
	flex-shrink: 0;
}

// 底部卡片容器
.bottom-cards-container {
	width: 99%;
	display: flex;
}

.bottom-card-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 3px;
}

// 附加物品卡片
.card2 {
	width: 100%;
	height: 150px;
}

.card2-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
}

.header-title-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.header-title-right {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	font-size: 20rpx;
}

.card2-content {
	padding: 10rpx;
}

.card2-scroll-area {
	height: 80px;
}

.basket-container {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.basket-item-collect {
	display: flex;
	justify-content: space-between;
	background-color: #55aaff;
	min-width: 100rpx;
	padding: 8rpx 12rpx;
	border-radius: 6rpx;
	font-size: 12rpx;
	color: white;
	font-weight: bold;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.basket-item-owe {
	display: flex;
	justify-content: space-between;
	background-color: #ffb03a;
	min-width: 100rpx;
	padding: 8rpx 12rpx;
	border-radius: 6rpx;
	font-size: 12rpx;
	color: white;
	font-weight: bold;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.basket-name {
	flex: 1;
	text-align: left;
}

.basket-count {
	margin-left: 8rpx;
	font-weight: 600;
}

// 其他费用卡片容器
.other-expenses-container {
	width: 100%;
	margin-top: 3px;
	display: flex;
	gap: 6rpx;
}

// 其他费用卡片
.card3 {
	flex: 1;
	height: 100%;
}

.card3-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
}

.card3-content {
	padding: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(100% - 50rpx);
}

.empty-content {
	text-align: center;
}

.empty-text {
	font-size: 18px;
	color: #bdc3c7;
}

// 费用支出卡片特殊样式
.expense-card .empty-text {
	color: #e74c3c;
}

// 备用金卡片特殊样式
.reserve-card .empty-text {
	font-size: 30px;
	color: #f39c12;
}

// 右侧面板
.right-panel {
	flex: 1.5;
	display: flex;
	flex-direction: column;
	gap: 5rpx;
}

// 支付统计卡片
.payment-card {
	height: 300px;
	padding: 0;
}

.card4-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
}

.payment-content {
	display: flex;
	flex-direction: column;
	height: calc(100% - 45rpx); /* 更精确地减去header高度 */
	padding: 2rpx;
	overflow: hidden;
	box-sizing: border-box;
}

.payment-row {
	display: flex;
	justify-content: space-between;
	margin: 2rpx;
	gap: 3rpx;
	flex: 1;
}

.payment-item {
	flex: 1;
	padding: 6rpx 8rpx;
	border-radius: 6rpx;
	color: white;
	font-weight: 500;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	min-height: 50rpx;
	max-height: 65rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.12);
}

.wechat-pay {
	background: #07c160;
}

.alipay-pay {
	background: #1677ff;
}

.cash-pay {
	background: #ff6b35;
}

.other-pay {
	background: #ffd700;
	color: #2c3e50;
}

.payment-header {
	margin-bottom: 4rpx;
}

.payment-icon-wrapper {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.payment-icon {
	margin-top: -2rpx;
}

.payment-label {
	font-size: 14rpx;
	font-weight: 500;
}

.payment-amount {
	font-size: 20rpx;
	font-weight: 600;
	text-align: left;
}

// 订单数据卡片
.card5 {
	width: 100%;
	margin-top: 3px;
}

.card5-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
	padding: 10rpx;
}

.card5-header-text {
	font-size: 12rpx;
	font-weight: bold;
	color: #888888;
}

.card5-content {
	padding: 8rpx;
}

.orders-scroll-area {
	height: 100%;
}

.order-item {
	border-radius: 6rpx;
	border: 1rpx solid #e9ecef;
	margin-bottom: 5rpx;
	display: flex;
	padding: 10rpx;
	background: #f8f9fa;
}

.order-left {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.customer-name {
	font-size: 12rpx;
	font-weight: bold;
	color: #2c3e50;
}

.order-time {
	font-size: 8rpx;
	color: #7f8c8d;
}

.order-right {
	flex: 1;
	text-align: right;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.amount-paid {
	font-size: 12rpx;
	font-weight: bold;
	color: #27ae60;
}

.amount-pending {
	font-size: 12rpx;
	font-weight: bold;
	color: #e74c3c;
}

/* 抽屉容器 */
.drawer-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	pointer-events: none;
	/* 初始不允许交互 */
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
	/* 显示时允许点击 */
}

/* 抽屉内容 */
.drawer-content {
	position: absolute;
	top: 0;
	right: -50%;
	/* 初始隐藏在右侧 */
	width: 50%;
	/* 抽屉宽度 */
	height: 100%;
	background: #cacaca;
	box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease;
	pointer-events: auto;
}

.drawer-content.show {
	transform: translateX(-100%);
	/* 从右向左滑出 */
}

.drawer-content-header {
	display: grid;
	align-items: center;
	height: 30rpx;
	line-height: 30rpx;
	font-size: 12rpx;
	font-weight: bold;
	background-color: white;
	border-bottom: 1px solid #888888;
}

.drawer-content-header2 {
	height: 50rpx;
	font-size: 13rpx;
	font-weight: bold;
	background-color: white;
}

.drawer-content-header2-title {
	padding: 5rpx;
}

.drawer-content-header2-title2 {
	font-size: 9rpx;
	margin-left: 5rpx;
	margin-top: 5rpx;
	color: grey;
}

.drawer-content-header2-status {
	font-size: 10rpx;
	color: white;
	background-color: var(--sale-status-color, #d8d8d8);
	margin-left: 5rpx;
	padding: 2rpx;
	border-radius: 5rpx;
}

.drawer-content-card {
	height: 50rpx;
	font-size: 12rpx;
	font-weight: bold;
	background-color: white;
	margin-top: 20rpx;
	height: calc(100% - 140rpx);
}

.drawer-content-card-title {
	padding: 5rpx;
}



.drawer-content-table-content {
	padding: 10rpx;
}

.drawer-content-scrollArea {
	width: 300rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

.drawer-content-table {
	width: 100%;
	border-collapse: collapse;
}

.drawer-content-table-header {
	background-color: #f5f5f5;
	font-weight: bold;
}

.drawer-content-table-header-grid {
	padding: 8px;
	text-align: center;
}

.drawer-content-table-grid {
	padding: 8px;
	text-align: center;
	font-weight: 100;
}

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

/* 下欠订单抽屉样式 */
.debt-order-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.debt-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.debt-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.debt-title-icon {
	display: flex;
	align-items: center;
}

.debt-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.debt-summary {
	padding: 8rpx 12rpx;
	background-color: #fff5f5;
	border-radius: 6rpx;
	border: 1rpx solid #fecaca;
}

.debt-summary-text {
	font-size: 12rpx;
	color: #dc2626;
	font-weight: 500;
}

.debt-scroll {
	flex: 1;
}

.debt-order-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.debt-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	cursor: pointer;
	transition: all 0.2s ease;
}

.debt-order-item:hover {
	background-color: #f1f3f5;
	border-color: #e74c3c;
	box-shadow: 0 2rpx 8rpx rgba(231, 76, 60, 0.1);
}

.debt-order-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.debt-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.debt-customer-name {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
}

.debt-order-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.debt-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.debt-total-amount {
	font-size: 11rpx;
	color: #6c757d;
}

.debt-amount {
	font-size: 14rpx;
	font-weight: bold;
	color: #e74c3c;
}

.debt-order-detail {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.debt-order-code {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.debt-code-label {
	font-size: 10rpx;
	color: #6c757d;
}

.debt-code-value {
	font-size: 10rpx;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

.debt-order-status {
	display: flex;
	align-items: center;
}

.debt-status-tag {
	background-color: #fef2f2;
	border: 1rpx solid #fecaca;
	border-radius: 4rpx;
	padding: 2rpx 8rpx;
}

.debt-status-text {
	font-size: 10rpx;
	color: #dc2626;
	font-weight: 500;
}

.debt-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.debt-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.debt-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 还款订单抽屉样式 */
.repay-order-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.repay-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.repay-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.repay-title-icon {
	display: flex;
	align-items: center;
}

.repay-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.repay-summary {
	padding: 8rpx 12rpx;
	background-color: #f0f9ff;
	border-radius: 6rpx;
	border: 1rpx solid #bae6fd;
}

.repay-summary-text {
	font-size: 12rpx;
	color: #0369a1;
	font-weight: 500;
}

.repay-scroll {
	flex: 1;
}

.repay-order-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.repay-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	transition: all 0.2s ease;
}

.repay-order-item:hover {
	background-color: #f1f3f5;
	border-color: #27ae60;
	box-shadow: 0 2rpx 8rpx rgba(39, 174, 96, 0.1);
}

.repay-order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.repay-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.repay-customer-name {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
}

.repay-order-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.repay-order-amounts {
	display: flex;
	align-items: center;
}

.repay-amount {
	font-size: 16rpx;
	font-weight: bold;
	color: #27ae60;
}

.repay-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.repay-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.repay-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 已售货款订单抽屉样式 */
.total-money-order-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.total-money-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.total-money-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.total-money-title-icon {
	display: flex;
	align-items: center;
}

.total-money-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.total-money-summary {
	padding: 8rpx 12rpx;
	background-color: #f0f8ff;
	border-radius: 6rpx;
	border: 1rpx solid #b3d9ff;
}

.total-money-summary-text {
	font-size: 12rpx;
	color: #0066cc;
	font-weight: 500;
}

.total-money-scroll {
	flex: 1;
}

.total-money-order-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.total-money-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	cursor: pointer;
	transition: all 0.2s ease;
}

.total-money-order-item:hover {
	background-color: #f1f3f5;
	border-color: #55aaff;
	box-shadow: 0 2rpx 8rpx rgba(85, 170, 255, 0.1);
}

.total-money-order-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.total-money-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.total-money-customer-name {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
}

.total-money-order-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.total-money-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.total-money-total-amount {
	font-size: 11rpx;
	color: #6c757d;
}

.total-money-actual-amount {
	font-size: 14rpx;
	font-weight: bold;
	color: #27ae60;
}

.total-money-debt-amount {
	font-size: 12rpx;
	font-weight: bold;
	color: #e74c3c;
}

.total-money-order-detail {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.total-money-order-code {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.total-money-code-label {
	font-size: 10rpx;
	color: #6c757d;
}

.total-money-code-value {
	font-size: 10rpx;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

.total-money-order-status {
	display: flex;
	align-items: center;
}

.total-money-status-tag {
	border-radius: 4rpx;
	padding: 2rpx 8rpx;
}

.total-money-status-tag.paid-status {
	background-color: #f0fff4;
	border: 1rpx solid #b3ffcc;
}

.total-money-status-tag.debt-status {
	background-color: #fef2f2;
	border: 1rpx solid #fecaca;
}

.total-money-status-text {
	font-size: 10rpx;
	font-weight: 500;
}

.paid-status .total-money-status-text {
	color: #16a34a;
}

.debt-status .total-money-status-text {
	color: #dc2626;
}

.total-money-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.total-money-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.total-money-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 收入金额订单抽屉样式 */
.receive-money-order-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.receive-money-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.receive-money-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.receive-money-title-icon {
	display: flex;
	align-items: center;
}

.receive-money-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.receive-money-summary {
	padding: 8rpx 12rpx;
	background-color: #f0fff4;
	border-radius: 6rpx;
	border: 1rpx solid #b3ffcc;
}

.receive-money-summary-text {
	font-size: 12rpx;
	color: #16a34a;
	font-weight: 500;
}

.receive-money-scroll {
	flex: 1;
}

.receive-money-order-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.receive-money-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	cursor: pointer;
	transition: all 0.2s ease;
}

.receive-money-order-item:hover {
	background-color: #f1f3f5;
	border-color: #27ae60;
	box-shadow: 0 2rpx 8rpx rgba(39, 174, 96, 0.1);
}

.receive-money-order-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.receive-money-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.receive-money-customer-name {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
}

.receive-money-order-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.receive-money-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.receive-money-total-amount {
	font-size: 11rpx;
	color: #6c757d;
}

.receive-money-actual-amount {
	font-size: 14rpx;
	font-weight: bold;
	color: #16a34a;
}

.receive-money-debt-amount {
	font-size: 12rpx;
	font-weight: bold;
	color: #e74c3c;
}

.receive-money-order-detail {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.receive-money-order-code {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.receive-money-code-label {
	font-size: 10rpx;
	color: #6c757d;
}

.receive-money-code-value {
	font-size: 10rpx;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

.receive-money-order-status {
	display: flex;
	align-items: center;
}

.receive-money-status-tag {
	border-radius: 4rpx;
	padding: 2rpx 8rpx;
}

.receive-money-status-tag.full-paid {
	background-color: #f0fff4;
	border: 1rpx solid #b3ffcc;
}

.receive-money-status-tag.partial-paid {
	background-color: #fff8e1;
	border: 1rpx solid #ffcc80;
}

.receive-money-status-text {
	font-size: 10rpx;
	font-weight: 500;
}

.full-paid .receive-money-status-text {
	color: #16a34a;
}

.partial-paid .receive-money-status-text {
	color: #f57c00;
}

.receive-money-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.receive-money-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.receive-money-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 支付方式收入项抽屉样式 */
.expense-accout-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.expense-accout-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.expense-accout-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.expense-accout-title-icon {
	display: flex;
	align-items: center;
}

.expense-accout-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.expense-accout-summary {
	padding: 8rpx 12rpx;
	background-color: #f8f9fa;
	border-radius: 6rpx;
	border: 1rpx solid #e9ecef;
}

.expense-accout-summary-text {
	font-size: 12rpx;
	color: #6c757d;
	font-weight: 500;
}

.expense-accout-scroll {
	flex: 1;
}

.expense-accout-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.expense-accout-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	transition: all 0.2s ease;
}

.expense-accout-item.clickable {
	cursor: pointer;
}

.expense-accout-item.clickable:hover {
	background-color: #f1f3f5;
	border-color: #007AFF;
	box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.1);
	transform: translateY(-1rpx);
}

.expense-accout-item.clickable:active {
	transform: translateY(0);
	box-shadow: 0 1rpx 4rpx rgba(0, 122, 255, 0.1);
}

.expense-accout-item-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.expense-accout-item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.expense-accout-item-type {
	font-size: 14rpx;
	font-weight: 600;
	color: #2c3e50;
}

.expense-accout-create-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.expense-accout-item-amounts {
	display: flex;
	align-items: center;
}

.expense-accout-amount {
	font-size: 16rpx;
	font-weight: bold;
}

.expense-accout-amount.income {
	color: #16a34a;
}

.expense-accout-amount.expense {
	color: #dc2626;
}

.expense-accout-item-detail {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.expense-accout-action {
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.expense-accout-action-icon {
	display: flex;
	align-items: center;
}

.expense-accout-action-text {
	font-size: 10rpx;
	color: #007AFF;
	font-weight: 500;
}

.expense-accout-direction {
	display: flex;
	align-items: center;
}

.expense-accout-direction-tag {
	border-radius: 4rpx;
	padding: 2rpx 8rpx;
}

.expense-accout-direction-tag.income-tag {
	background-color: #f0fff4;
	border: 1rpx solid #b3ffcc;
}

.expense-accout-direction-tag.expense-tag {
	background-color: #fef2f2;
	border: 1rpx solid #fecaca;
}

.expense-accout-direction-text {
	font-size: 10rpx;
	font-weight: 500;
}

.income-tag .expense-accout-direction-text {
	color: #16a34a;
}

.expense-tag .expense-accout-direction-text {
	color: #dc2626;
}

.expense-accout-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.expense-accout-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.expense-accout-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 备用金记录抽屉样式 */
.reserve-record-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.reserve-record-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.reserve-record-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.reserve-record-title-icon {
	display: flex;
	align-items: center;
}

.reserve-record-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.reserve-record-summary {
	padding: 8rpx 12rpx;
	background-color: #fff8e1;
	border-radius: 6rpx;
	border: 1rpx solid #ffcc80;
}

.reserve-record-summary-text {
	font-size: 12rpx;
	color: #f57c00;
	font-weight: 500;
}

.reserve-record-scroll {
	flex: 1;
}

.reserve-record-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.reserve-record-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	transition: all 0.2s ease;
}

.reserve-record-item:hover {
	background-color: #f1f3f5;
	border-color: #f39c12;
	box-shadow: 0 2rpx 8rpx rgba(243, 156, 18, 0.1);
}

.reserve-record-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 8rpx;
}

.reserve-record-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.reserve-record-type {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
}

.reserve-record-type.income {
	color: #16a34a;
}

.reserve-record-type.expense {
	color: #dc2626;
}

.reserve-record-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.reserve-record-amounts {
	display: flex;
	align-items: center;
}

.reserve-record-amount {
	font-size: 16rpx;
	font-weight: bold;
}

.reserve-record-amount.income {
	color: #16a34a;
}

.reserve-record-amount.expense {
	color: #dc2626;
}

.reserve-record-detail {
	display: flex;
	align-items: center;
	margin-top: 8rpx;
}

.reserve-record-remark {
	display: flex;
	align-items: center;
	gap: 8rpx;
	width: 100%;
	padding: 8rpx 12rpx;
	background-color: #f8f9fa;
	border-radius: 4rpx;
	border: 1rpx solid #e9ecef;
}

.reserve-record-remark-label {
	font-size: 10rpx;
	color: #6c757d;
	font-weight: 500;
	white-space: nowrap;
}

.reserve-record-remark-value {
	font-size: 11rpx;
	color: #495057;
	flex: 1;
	word-break: break-all;
}

.reserve-record-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.reserve-record-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.reserve-record-empty-text {
	font-size: 14rpx;
	color: #bdc3c7;
	text-align: center;
}

/* 备用金操作按钮样式 */
.reserve-action-btn {
	width: 15rpx;
	height: 15rpx;
	border-radius: 14rpx;
	background-color: rgba(243, 156, 18, 0.1);
	border: 1rpx solid rgba(243, 156, 18, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
}

.reserve-action-btn:hover {
	background-color: rgba(243, 156, 18, 0.2);
	border-color: #f39c12;
	transform: scale(1.05);
}

/* 备用金弹窗样式 */
.reserve-modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	animation: fadeIn 0.3s ease;
}

.reserve-modal {
	position: relative;
	width: 400rpx;
	background-color: white;
	border-radius: 12rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	animation: slideUp 0.3s ease;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.modal-close {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 16rpx;
	transition: background-color 0.2s ease;
}

.modal-close:hover {
	background-color: #f5f5f5;
}

.modal-content {
	padding: 24rpx;
}

.operation-type {
	display: flex;
	gap: 12rpx;
	margin-bottom: 24rpx;
}

.type-btn {
	flex: 1;
	padding: 12rpx 16rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	font-size: 14rpx;
	color: #6c757d;
	cursor: pointer;
	transition: all 0.2s ease;
}

.type-btn.active {
	border-color: #f39c12;
	background-color: rgba(243, 156, 18, 0.1);
	color: #f39c12;
	font-weight: 600;
}

.type-btn:hover {
	border-color: #f39c12;
	background-color: rgba(243, 156, 18, 0.05);
}

.amount-input-section,
.remark-input-section {
	margin-bottom: 20rpx;
}

.input-label {
	display: block;
	font-size: 14rpx;
	color: #495057;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.amount-input {
	width: 100%;
	height: 44rpx;
	padding: 0 12rpx;
	border: 1rpx solid #ced4da;
	border-radius: 6rpx;
	font-size: 16rpx;
	color: #495057;
	box-sizing: border-box;
	transition: border-color 0.2s ease;
}

.amount-input:focus {
	border-color: #f39c12;
	outline: none;
	box-shadow: 0 0 0 2rpx rgba(243, 156, 18, 0.1);
}

.remark-input {
	width: 100%;
	height: 80rpx;
	padding: 8rpx 12rpx;
	border: 1rpx solid #ced4da;
	border-radius: 6rpx;
	font-size: 14rpx;
	color: #495057;
	resize: none;
	box-sizing: border-box;
	transition: border-color 0.2s ease;
}

.remark-input:focus {
	border-color: #f39c12;
	outline: none;
	box-shadow: 0 0 0 2rpx rgba(243, 156, 18, 0.1);
}

.modal-footer {
	display: flex;
	gap: 12rpx;
	padding: 20rpx 24rpx;
	border-top: 1rpx solid #f0f0f0;
}

.btn-cancel,
.btn-confirm {
	flex: 1;
	height: 44rpx;
	line-height: 44rpx;
	text-align: center;
	border-radius: 6rpx;
	font-size: 16rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-cancel {
	background-color: #f8f9fa;
	color: #6c757d;
	border: 1rpx solid #e9ecef;
}

.btn-cancel:hover {
	background-color: #e9ecef;
}

.btn-confirm {
	background-color: #f39c12;
	color: white;
	border: 1rpx solid #f39c12;
}

.btn-confirm:hover {
	background-color: #e67e22;
	border-color: #e67e22;
}

/* 动画效果 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* 响应式调整 */
@media (max-width: 600rpx) {
	.info-item {
		min-width: 100%;
	}

	.header-cell,
	.table-cell {
		padding: 12rpx 5rpx;
		font-size: 10rpx;
	}
	
	.debt-order-header {
		flex-direction: column;
		gap: 8rpx;
	}
	
	.debt-order-amounts {
		align-items: flex-start;
	}
}

/* 还筐详情抽屉样式 - 参照已售货款订单列表样式 */
.basket-detail-drawer-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10000;
	height: 100vh;
}

.basket-detail-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	height: 100vh;
	transition: opacity 0.4s ease;
	backdrop-filter: blur(2px);
}

.basket-detail-content {
	position: absolute;
	top: 0;
	right: 0;
	width: 50%;
	height: 100vh;
	background-color: #ffffff;
	transform: translateX(0);
	transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
	box-shadow: -8rpx 0 24rpx rgba(0, 0, 0, 0.2);
}

/* 参照已售货款订单抽屉样式 */
.basket-detail-order-container {
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.basket-detail-header {
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.basket-detail-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 10rpx;
}

.basket-detail-title-icon {
	display: flex;
	align-items: center;
}

.basket-detail-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.basket-detail-summary {
	padding: 8rpx 12rpx;
	background-color: #f0f8ff;
	border-radius: 6rpx;
	border: 1rpx solid #b3d9ff;
}

.basket-detail-summary-text {
	font-size: 12rpx;
	color: #0066cc;
	font-weight: 500;
}

.basket-detail-scroll {
	flex: 1;
}

.basket-detail-record-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.basket-detail-record-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 8rpx;
	padding: 16rpx;
	cursor: pointer;
	transition: all 0.2s ease;
}

.basket-detail-record-item:hover {
	background-color: #f1f3f5;
	border-color: #55aaff;
	box-shadow: 0 2rpx 8rpx rgba(85, 170, 255, 0.1);
}

.basket-detail-record-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.basket-detail-record-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.basket-detail-record-type {
	font-size: 14rpx;
	font-weight: bold;
	padding: 2rpx 8rpx;
	border-radius: 4rpx;
	display: inline-block;
	width: fit-content;
}

.basket-detail-record-type.type-order {
	color: #28a745;
	background-color: #d4edda;
	border: 1rpx solid #c3e6cb;
}

.basket-detail-record-type.type-repay {
	color: #4A90E2;
	background-color: #e7f3ff;
	border: 1rpx solid #b3d9ff;
}

.basket-detail-record-time {
	font-size: 10rpx;
	color: #7f8c8d;
}

.basket-detail-record-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.basket-detail-customer-name {
	font-size: 14rpx;
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 4rpx;
}

.basket-detail-basket-count {
	font-size: 12rpx;
	color: #4A90E2;
	font-weight: 500;
}

.basket-detail-no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	text-align: center;
	color: #999;
	font-size: 12rpx;
}
</style>