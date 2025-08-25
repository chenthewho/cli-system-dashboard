<template>
	<view class="rotating-container" :style="{ height: windowHeight + 'px' }">
		<!-- 顶部固定头部 -->
		<view class="header-toolbar">
			<!-- 左侧用户信息 -->
			<view class="header-left">
				<text class="header-username" v-if="currentData">{{ currentData.dutyInfo.userName }}</text>
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
															:key="basket.basketModelName">
															<text class="basket-name">{{ basket.basketModelName }}</text>
															<text class="basket-count">{{ basket.mount }}个</text>
														</view>
													</view>
													<view class="basket-container" v-if="baskerShowType == 2">
														<view class="basket-item-owe" v-for="basket in currentData.oweBasket"
															:key="basket.basketModelName">
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
												<uni-icons custom-prefix="iconfont" type="icon-qian" size="20"
													color="#f39c12"></uni-icons>
												<text class="title-text">备用金</text>
											</view>
										</view>
										<view class="card3-content">
											<view class="empty-content">
												<text class="empty-text">暂无备用金记录</text>
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
						<!-- 第一行：微信 + 支付宝 -->
						<view class="payment-row">
							<!-- 微信支付 -->
							<view class="payment-item wechat-pay" @click="showExpenseAccout(1)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="32" name="weixin-fill"
											color="white"></u-icon>
										<text class="payment-label">微信</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData">
									{{ currentData.accountExpense.wxpayAmount }}
								</view>
							</view>
							<!-- 支付宝 -->
							<view class="payment-item alipay-pay" @click="showExpenseAccout(2)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="32" name="zhifubao" color="white"></u-icon>
										<text class="payment-label">支付宝</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData">
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
										<u-icon class="payment-icon" :size="32" name="red-packet-fill"
											color="white"></u-icon>
										<text class="payment-label">现金</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData">
									{{ currentData.accountExpense.cashAmount }}
								</view>
							</view>
							<!-- 其他支付 -->
							<view class="payment-item other-pay" @click="showExpenseAccout(4)">
								<view class="payment-header">
									<view class="payment-icon-wrapper">
										<u-icon class="payment-icon" :size="32" name="coupon-fill"
											color="white"></u-icon>
										<text class="payment-label">其他</text>
									</view>
								</view>
								<view class="payment-amount" v-if="currentData">
									{{ currentData.accountExpense.otherAmount }}
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

					<!--营业额订单抽屉-->
					<!--还筐、押筐抽屉-->
				</slot> <!-- 抽屉内容插槽 -->
			</view>
		</view>

	</view>
</template>

<script>
import cashierOrder from '../../api/cashier/cashierOrder'
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
			currentData: null,
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
			expenseAccoutList:[]
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
						uni.showToast({
							title: '交账成功',
							icon: 'success'
						});
					}
				}
			});
		},
		formatTime(ms) {
			// 计算小时、分钟、秒
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

			// 补零显示
			const pad = (num) => num.toString().padStart(2, '0');

			return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
	padding: 10rpx;
	gap: 10rpx;
}

.revenue-column {
	flex: 1;
}

.revenue-column-right {
	margin-left: 10rpx;
}

.yye-grid {
	display: flex;
	height: 40rpx;
	justify-content: space-between;
	background-color: #f8f9fa;
	margin: 5rpx 0;
	border-radius: 6rpx;
	padding: 8rpx;
	font-size: 12rpx;
	line-height: 24rpx;
	border: 1rpx solid #e9ecef;
}

.yye-grid-text {
	font-size: 10rpx;
	color: #6c757d;
	font-weight: 500;
}

.yye-grid-value {
	font-size: 15rpx;
	padding-right: 10rpx;
	color: #2c3e50;
	font-weight: 600;
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
	font-size: 20px;
	color: #bdc3c7;
}

// 费用支出卡片特殊样式
.expense-card .card3-header {
	
}

.expense-card .empty-text {
	color: #e74c3c;
}

// 备用金卡片特殊样式
.reserve-card .card3-header {
	
}

.reserve-card .empty-text {
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

.payment-row {
	display: flex;
	justify-content: space-between;
	margin: 6rpx;
	gap: 6rpx;
}

.payment-item {
	flex: 1;
	padding: 10rpx 12rpx;
	border-radius: 6rpx;
	color: white;
	font-weight: 500;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 75rpx;
	max-height: 80rpx;
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
	margin-bottom: 6rpx;
}

.payment-icon-wrapper {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.payment-icon {
	margin-top: -4rpx;
}

.payment-label {
	font-size: 16rpx;
	font-weight: 500;
}

.payment-amount {
	font-size: 22rpx;
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
</style>