<template>
	<view class="rotating-container" :style="{ height: windowHeight + 'px', overflow: 'hidden', overflowX: 'hidden' }">
		<!-- 顶部固定头部 -->
		<view class="header-toolbar" :style="{ width: windowWidth + 'px' }">
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
			<view class="content-wrapper" :style="{ width: windowWidth + 'px' }">
				<!-- 左侧面板 -->
				<view class="left-panel" :style="{ width: leftPanelWidth + 'px' }">
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
										<text class="yye-grid-text">营收金额：</text>
										<text class="yye-grid-value">{{ currentData.totalMoney }}</text>
									</view>
									<view class="yye-grid" @click="handleDebtShow">
										<text class="yye-grid-text">赊欠金额：</text>
										<text class="yye-grid-value">{{ currentData.debtMoney }}</text>
									</view>
									<view class="yye-grid"  @click="handleTotalMoneyShow">
										<text class="yye-grid-text">总单量：</text>
										<text class="yye-grid-value">{{ currentData.orderNum }}</text>
									</view>
								</view>
								<view class="revenue-column revenue-column-right">
									<view class="yye-grid" @click="handleReceiveMoneyShow">
										<text class="yye-grid-text">实收金额：</text>
										<text class="yye-grid-value">{{ currentData.receiveMoeny }}</text>
									</view>
									<view class="yye-grid" @click="handleRepayShow">
										<text class="yye-grid-text" >还款金额：</text>
										<text class="yye-grid-value">{{ currentData.repayMoney }}</text>
									</view>
									<!-- <view class="yye-grid" @click="handleDebtShow">
										<text class="yye-grid-text">赊欠单量：</text>
										<text class="yye-grid-value">{{ currentData.debtNum }}</text>
									</view> -->
								</view>
							</view>
						</view>


								<!-- 其他费用卡片容器 -->
								<view class="other-expenses-container" :style="{ height: (windowHeight - 280 - 150 - 30 - 70) + 'px' }">
								<!-- 费用支出卡片 -->
								<view class="grid card3 expense-card">
									<view class="card3-header">
										<view class="card-header-title">
											<view class="header-title-left">
												<uni-icons custom-prefix="iconfont" type="icon-qitashourudan" size="20"
													color="#e74c3c"></uni-icons>
												<text class="title-text">费用支出</text>
											</view>
											<view class="header-title-right">
												<view class="expense-action-btn" @click="openExpenseModal">
													<uni-icons type="plus-filled" size="30" color="#e74c3c"></uni-icons>
												</view>
											</view>
										</view>
									</view>
							<view class="card3-content">
								<scroll-view class="expense-scroll-view" scroll-x="true" v-if="currentData.dutySpendList && currentData.dutySpendList.length > 0">
									<view class="expense-grid-container">
						<view class="expense-grid-item" 
									  v-for="(item, index) in currentData.dutySpendList" 
									  :key="index"
									  @click="handleExpenseListShow">
									<view class="expense-item-left">
										<text class="expense-item-name">{{ item.spendName }}</text>
									</view>
									<view class="expense-item-right">
										<text class="expense-item-amount">¥{{ item.spendMoney }}</text>
									</view>
								</view>
									</view>
								</scroll-view>
								<view class="empty-content" v-else>
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
								<CustomTabs 
									ref="basketTabs"
									:list="card2tabValue" 
									:itemStyle="{ width: '50px', height: '28px' }"
									@click="card2tabChange"
									:current="baskerTabIndex"
									activeColor="#e53935"
									inactiveColor="#666666"
									activeFontSize="17px"
									inactiveFontSize="14px"
									underlineColor="#e53935"
									:underlineHeight="2"
									:visible="true"
									style="display: inline-block;">
								</CustomTabs>
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

						</view>
					</view>
				</view>

			<!-- 右侧面板 -->
			<view class="right-panel" :style="{ width: rightPanelWidth + 'px' }">
				<!-- 支付统计卡片 -->
				<view class="grid payment-card" :style="{ backgroundColor: 'white', height: '280px' }">
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
							<view class="payment-amount" 
								:class="getAmountFontClass(currentData.accountExpense ? currentData.accountExpense.wxpayAmount : '0')"
								v-if="currentData.accountExpense">
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
							<view class="payment-amount" 
								:class="getAmountFontClass(currentData.accountExpense ? currentData.accountExpense.alipayAmount : '0')"
								v-if="currentData.accountExpense">
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
							<view class="payment-amount" 
								:class="getAmountFontClass(currentData.accountExpense ? currentData.accountExpense.cashAmount : '0')"
								v-if="currentData.accountExpense">
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
							<view class="payment-amount" 
								:class="getAmountFontClass(getOtherPaymentAmount())"
								v-if="currentData">
								{{ getOtherPaymentAmount() }}
							</view>
						</view>
						</view>
						</view>
					</view>

		<!-- 订单数据卡片 -->
		<view class="grid card5" :style="{ height: (windowHeight - 377) + 'px' }">
		<view class="card5-header">
			<text class="card5-header-text">订单数据：</text>
			<view class="order-filter-container">
				<!-- 排序筛选 -->
				<FilterDropdown 
					ref="sortFilter"
					:options="sortOptions" 
					v-model="orderSortType"
					@open="closePaymentFilter"
					@change="onSortChange" 
				/>
				<!-- 付款状态筛选 -->
				<FilterDropdown 
					ref="paymentFilter"
					:options="paymentOptions" 
					v-model="orderPaymentFilter"
					@open="closeSortFilter"
					@change="onPaymentChange" 
				/>
			</view>
		</view>
			
			<view class="card5-content" v-if="currentData">
				<scroll-view class="orders-scroll-area" scroll-x="false" scroll-y="true"
					:style="{ height: (windowHeight - 377 - 60) + 'px' }">
					<view class="order-item" v-for="order in filteredOrderList" :key="order.id"
						@click="openAssistDrawer(order)">
						<view class="order-row-top">
							<text class="customer-name">{{ order.customName }}</text>
							<view class="order-amount">
								<text v-if="order.debt <= 0" class="amount-paid">￥{{ order.actualMoney }}</text>
								<text v-if="order.debt > 0" class="amount-pending">待付：￥{{ order.debt }}</text>
							</view>
						</view>
						<view class="order-row-bottom">
							<text class="order-time">{{ order.createTime.replace("T", " ") }}</text>
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
						<!-- 抽屉头部 -->
						<view class="detail-header-new">
							<view class="header-left">
								<text class="detail-title-new">订单详情</text>
							</view>
						</view>
						
						<scroll-view scroll-y="true" :style="{ height: (windowHeight - 200) + 'px' }">
							<!-- 订单信息网格 -->
							<div class="order-info-grid-compact">
								<!-- 第一行 -->
								<div class="info-row">
									<div class="info-item-new">				
										<text class="info-value-new info-value-small">{{ currentOrder.createTime ? currentOrder.createTime.replace("T", " ") : "" }}</text>
									</div>
									<div class="info-item-new">
										<text class="info-value-new info-value-small">{{ currentOrder.accountCode || "-" }}</text>
									</div>
								</div>
								
								<!-- 第二行 -->
								<div class="info-row">
									<div class="info-item-new">
										<text class="info-value-new info-value-small">{{ currentOrder.customName || "散客" }}</text>
									</div>
									<div class="info-item-new">
										<text class="info-label-new">总计金额:</text>
										<text class="info-value-new highlight-value">{{ currentOrder.payableAmount }}</text>
									</div>
								</div>
								
								<!-- 第三行 -->
								<div class="info-row">
									<div class="info-item-new">
										<text class="info-label-new">押筐抵扣:</text>
										<text class="info-value-new">{{ currentOrder.basketOffsetAmount }}</text>
									</div>
									<div class="info-item-new">
										<text class="info-label-new">实付金额:</text>
										<text class="info-value-new highlight-value">{{ currentOrder.actualMoney }}</text>
									</div>
								</div>
								
								<!-- 第四行 - 下欠 -->
								<div class="info-row" v-if="currentOrder.debt > 0">
									<div class="info-item-new">
										<text class="info-label-new">下欠:</text>
										<text class="info-value-new debt-value-new">{{ currentOrder.debt }}</text>
									</div>
								</div>
							</div>
							
							<!-- 商品表格 -->
							<div class="product-table-container">
								<div class="product-table">
									<div class="table-row table-header-row">
										<div class="table-header-cell">货品</div>
										<div class="table-header-cell">数量</div>
										<div class="table-header-cell">总重</div>
										<div class="table-header-cell">皮重</div>
										<div class="table-header-cell">单价</div>
										<div class="table-header-cell">小计</div>
									</div>
							
									<div class="table-row table-body-row" v-for="(item, index) in currentOrder.module" :key="index">
										<div class="table-cell">{{ item.name }}</div>
										<div class="table-cell">{{ item.mount }}</div>
										<div class="table-cell">{{ item.totalWeight }}</div>
										<div class="table-cell">{{ item.tareWeight }}</div>
										<div class="table-cell">{{ item.referenceAmount }}</div>
										<div class="table-cell">{{ item.subtotal }}</div>
									</div>
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

				<!--费用支出列表抽屉-->
				<div class="expense-list-container" v-if="drawerType === 'expenseList'">
					<!-- 抽屉头部 -->
					<div class="expense-list-header">
						<div class="expense-list-title">
							<view class="expense-list-title-icon">
								<uni-icons type="wallet" size="20" color="#e74c3c"></uni-icons>
							</view>
							<text class="expense-list-title-text">费用支出记录</text>
						</div>
						<div class="expense-list-summary" v-if="currentData && currentData.dutySpendList">
							<text class="expense-list-summary-text">共 {{ currentData.dutySpendList.length }} 条支出记录</text>
						</div>
					</div>

					<!-- 费用支出列表 -->
					<scroll-view class="expense-list-scroll" :style="{ height: (windowHeight - 200) + 'px' }" scroll-y="true">
						<div class="expense-list">
							<div class="expense-list-item" v-for="(item, index) in currentData.dutySpendList" :key="index">
								<div class="expense-list-item-header">
									<div class="expense-list-item-info">
										<text class="expense-list-item-name">{{ item.spendName }}</text>
										<text class="expense-list-item-time">{{ item.createTime ? item.createTime.replace("T", " ") : "" }}</text>
									</div>
									<div class="expense-list-item-amounts">
										<text class="expense-list-amount">¥{{ item.spendMoney }}</text>
									</div>
								</div>
								<div class="expense-list-item-detail">
									<div class="expense-list-item-payment">
										<view class="expense-payment-icon" :style="{ backgroundColor: getPaymentBgColor(item.payWay) }">
											<uni-icons :type="getPaymentIcon(item.payWay)" size="16" :color="getPaymentColor(item.payWay)"></uni-icons>
										</view>
										<text class="expense-payment-text">{{ getPaymentTypeName(item.payWay) }}</text>
									</div>
									<div class="expense-list-item-remark" v-if="item.remark">
										<text class="expense-remark-label">备注:</text>
										<text class="expense-remark-value">{{ item.remark }}</text>
									</div>
								</div>
							</div>
							<!-- 空状态 -->
							<div class="expense-list-empty" v-if="!currentData.dutySpendList || currentData.dutySpendList.length === 0">
								<view class="expense-list-empty-icon">
									<uni-icons type="wallet" size="40" color="#bdc3c7"></uni-icons>
								</view>
								<text class="expense-list-empty-text">暂无支出记录</text>
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
				<view class="reserve-modal-header">
					<view class="reserve-header-btn btn-cancel-top" @click="closeReserveModal">取消</view>
					<text class="reserve-modal-title">备用金操作</text>
					<view class="reserve-header-btn btn-confirm-top" @click="confirmReserveOperation">确定</view>
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
					
				<!-- 支付方式选择 -->
				<view class="payment-type-section">
					<text class="input-label">支付方式</text>
					<view class="payment-type-buttons">
						<view v-for="(type, index) in paymentTypeList" 
							  :key="type.id" 
							  class="payment-type-btn" 
							  :class="{ 'active': reservePaymentType === type.id }" 
							  :style="{ 
								  backgroundColor: reservePaymentType === type.id ? type.color + '15' : '#f8f9fa',
								  borderColor: reservePaymentType === type.id ? type.color : '#e9ecef'
							  }"
							  @click="reservePaymentType = type.id">
							<uni-icons :type="type.icon" :size="20" :color="reservePaymentType === type.id ? type.color : '#95a5a6'"></uni-icons>
							<text :style="{ color: reservePaymentType === type.id ? type.color : '#7f8c8d' }">{{ type.name }}</text>
						</view>
					</view>
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
		</view>
	</view>

		<!-- 费用支出弹窗 -->
		<view class="expense-modal-container" v-if="showExpenseModal">
			<!-- 遮罩层 -->
			<view class="modal-mask" @tap="closeExpenseModal"></view>
			
			<!-- 弹窗内容 -->
			<view class="expense-modal">
				<view class="expense-modal-header">
					<view class="expense-header-btn btn-cancel-top" @click="closeExpenseModal">取消</view>
					<text class="expense-modal-title">费用支出</text>
					<view class="expense-header-btn btn-confirm-top" @click="confirmExpenseOperation">确定</view>
				</view>
				
			<view class="modal-content">
				<!-- 费用类型选择 -->
				<view class="expense-type-section">
					<view class="expense-type-label-wrapper">
						<text class="input-label">费用类型</text>
						<view class="add-expense-type-btn" @click="openAddExpenseTypeModal">
							<uni-icons type="plusempty" size="20" color="#e74c3c"></uni-icons>
						</view>
					</view>
					<view class="expense-type-buttons">
						<view v-for="(type, index) in expenseTypeList" 
							  :key="type.id" 
							  class="expense-type-btn" 
							  :class="{ 'active': selectedExpenseType.id === type.id }" 
							  @click="selectExpenseType(type)">
							<text>{{ type.name }}</text>
						</view>
					</view>
				</view>
				
				<!-- 金额输入 -->
				<view class="amount-input-section">
					<text class="input-label">金额</text>
					<input class="amount-input" 
						   type="number" 
						   v-model="expenseAmount" 
						   placeholder="请输入金额" 
						   :focus="showExpenseModal"
						   />
				</view>
				
				<!-- 支付方式选择 -->
				<view class="payment-type-section">
					<text class="input-label">支付方式</text>
					<view class="payment-type-buttons">
						<view v-for="(type, index) in paymentTypeList" 
							  :key="type.id" 
							  class="payment-type-btn" 
							  :class="{ 'active': selectedPaymentType === type.id }" 
							  :style="{ 
								  backgroundColor: selectedPaymentType === type.id ? type.color + '15' : '#f8f9fa',
								  borderColor: selectedPaymentType === type.id ? type.color : '#e9ecef'
							  }"
							  @click="selectPaymentType(type.id)">
							<uni-icons :type="type.icon" :size="20" :color="selectedPaymentType === type.id ? type.color : '#95a5a6'"></uni-icons>
							<text :style="{ color: selectedPaymentType === type.id ? type.color : '#7f8c8d' }">{{ type.name }}</text>
						</view>
					</view>
				</view>
				
				<!-- 备注输入 -->
				<view class="remark-input-section">
					<text class="input-label">备注</text>
					<textarea class="remark-input" 
							  v-model="expenseRemark" 
							  placeholder="请输入备注（可选）"
							  maxlength="100"></textarea>
				</view>
			</view>
			</view>
		</view>

		<!-- 添加费用类型弹窗 -->
		<view v-if="showAddExpenseTypeModal" class="add-expense-type-modal-mask" @click="cancelAddExpenseType">
			<view class="add-expense-type-modal-wrapper" @click.stop>
				<view class="add-expense-type-modal-container">
					<!-- 标题 -->
					<view class="add-expense-type-modal-header">
						<view class="expense-type-header-btn cancel" @click="cancelAddExpenseType">取消</view>
						<text class="expense-type-header-title">添加费用类型</text>
						<view class="expense-type-header-btn confirm" @click="confirmAddExpenseType">确定</view>
					</view>
					
					<!-- 输入框 -->
					<view class="add-expense-type-modal-content">
						<view class="expense-type-input-wrapper">
							<text class="expense-type-input-label">类型名称</text>
							<input 
								type="text"
								v-model="newExpenseTypeName" 
								placeholder="请输入费用类型名称（最多10个字）"
								class="expense-type-name-input"
								maxlength="10"
								:focus="showAddExpenseTypeModal"
							/>
						</view>
					</view>
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

		<!-- 对账弹窗 -->
		<view v-if="showCheckoutModal" class="checkout-modal-overlay" @click="cancelCheckout">
			<view class="checkout-modal-container" @click.stop>
				<!-- 弹窗头部 -->
				<view class="checkout-modal-header">
					<text class="checkout-modal-title">交账对账</text>
					<view class="checkout-modal-close" @click="cancelCheckout">
						<text class="close-icon">✕</text>
					</view>
				</view>

				<!-- 弹窗内容 -->
				<scroll-view scroll-y class="checkout-modal-body">
					<!-- 班次信息 -->
					<view class="checkout-section">
						<view class="checkout-section-title">
							<text class="section-icon">👤</text>
							<text class="section-title-text">班次信息</text>
						</view>
						<view class="checkout-info-grid">
							<view class="info-row">
								<text class="info-label">当班人员：</text>
								<text class="info-value">{{ currentData.dutyInfo ? currentData.dutyInfo.userName : '-' }}</text>
							</view>
							<view class="info-row">
								<text class="info-label">当班时长：</text>
								<text class="info-value">{{ dutyTime || '-' }}</text>
							</view>
						</view>
					</view>

					<!-- 营业数据 -->
					<view class="checkout-section">
						<view class="checkout-section-title">
							<text class="section-icon">💰</text>
							<text class="section-title-text">营业数据</text>
						</view>
						<view class="checkout-data-grid">
							<view class="data-item highlight">
								<text class="data-label">营收金额</text>
								<text class="data-value primary">¥{{ currentData.totalMoney || '0.00' }}</text>
							</view>
							<view class="data-item highlight">
								<text class="data-label">实收金额</text>
								<text class="data-value success">¥{{ currentData.receiveMoeny || '0.00' }}</text>
							</view>
							<view class="data-item">
								<text class="data-label">赊欠金额</text>
								<text class="data-value warning">¥{{ currentData.debtMoney || '0.00' }}</text>
							</view>
							<view class="data-item">
								<text class="data-label">还款金额</text>
								<text class="data-value info">¥{{ currentData.repayMoney || '0.00' }}</text>
							</view>
							<view class="data-item">
								<text class="data-label">总单量</text>
								<text class="data-value">{{ currentData.orderNum || '0' }}</text>
							</view>
							<view class="data-item">
								<text class="data-label">备用金</text>
								<text class="data-value">¥{{ currentData.reservefund || '0.00' }}</text>
							</view>
						</view>
					</view>

					<!-- 支付统计 -->
					<view class="checkout-section" v-if="currentData.accountExpense">
						<view class="checkout-section-title">
							<text class="section-icon">💳</text>
							<text class="section-title-text">支付统计</text>
						</view>
						<view class="checkout-payment-grid">
							<view class="payment-stat-item wechat">
								<text class="payment-stat-label">微信</text>
								<text class="payment-stat-value">¥{{ currentData.accountExpense.wxpayAmount || '0.00' }}</text>
							</view>
							<view class="payment-stat-item alipay">
								<text class="payment-stat-label">支付宝</text>
								<text class="payment-stat-value">¥{{ currentData.accountExpense.alipayAmount || '0.00' }}</text>
							</view>
							<view class="payment-stat-item cash">
								<text class="payment-stat-label">现金</text>
								<text class="payment-stat-value">¥{{ currentData.accountExpense.cashAmount || '0.00' }}</text>
							</view>
							<view class="payment-stat-item bank">
								<text class="payment-stat-label">其他</text>
								<text class="payment-stat-value">¥{{ currentData.accountExpense.bankAmount || '0.00' }}</text>
							</view>
						</view>
					</view>

					<!-- 支出统计 -->
					<view class="checkout-section" v-if="currentData.dutySpendList && currentData.dutySpendList.length > 0">
						<view class="checkout-section-title">
							<text class="section-icon">📊</text>
							<text class="section-title-text">支出统计</text>
						</view>
						<view class="checkout-expense-list">
							<view class="expense-stat-item" v-for="(item, index) in currentData.dutySpendList" :key="index">
								<text class="expense-stat-label">{{ item.spendName }}</text>
								<text class="expense-stat-value">¥{{ item.spendMoney }}</text>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 弹窗底部按钮 -->
				<view class="checkout-modal-footer">
					<view class="checkout-btn-cancel" @click="cancelCheckout">
						<text class="btn-text">取消</text>
					</view>
					<view class="checkout-btn-confirm" @click="confirmCheckout">
						<text class="btn-text">确认交账</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import cashierOrder from '../../api/cashier/cashierOrder'
import basketApi from '../../api/basket/basketApi'
import category from '../../api/goods/category'
import duty from '../../api/duty/duty'
import labelApi from '../../api/label/labelApi'
import CustomTabs from '../../components/CustomTabs/CustomTabs.vue'
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown.vue'
export default {
	name: 'rotating',
	components: {
		CustomTabs,
		FilterDropdown
	},
	data() {
		return {
			CompanyId: "",
			searchVal: '',
			windowHeight: 0,
			windowWidth: 0,
			leftPanelWidth: 0,
			rightPanelWidth: 0,
			cardWidth: 0,
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
		baskerTabIndex: 0, // 附加物品tab索引
		showDrawer: false,
		drawerType: '', // 'orderDetail' | 'debtOrderList' | 'repayOrderList' | 'payment' | 'revenue' | 'basket'
		currentOrder: {},
		debtOrderList:[],
		repayOrderList:[],
	baskerShowType:1,
	showCheckoutModal: false, // 对账弹窗显示状态
	// 订单筛选相关
	orderSortType: 'time-desc', // 排序类型: time-desc, time-asc, amount-desc, amount-asc
	orderPaymentFilter: 'all', // 付款状态: all, paid, unpaid
	// 筛选选项配置
	sortOptions: [
		{ label: '按时间↓', value: 'time-desc' },
		{ label: '按时间↑', value: 'time-asc' },
		{ label: '按金额↓', value: 'amount-desc' },
		{ label: '按金额↑', value: 'amount-asc' }
	],
	paymentOptions: [
		{ label: '全部', value: 'all' },
		{ label: '已付款', value: 'paid' },
		{ label: '未付款', value: 'unpaid' }
	],
		showExpenseAccoutType:1,
			expenseAccoutList:[],
		// 备用金相关数据
		showReserveModal: false,
		reserveOperationType: 'add', // 'add' | 'expense'
		reserveAmount: '',
		reserveRemark: '',
		reservePaymentType: 4, // 备用金支付方式，默认现金
		reserveRecordList: [], // 备用金操作记录列表
	// 费用支出相关数据
	showExpenseModal: false,
	expenseAmount: '',
	expenseRemark: '',
	selectedExpenseType: {},
	expenseTypeList: [],
	selectedPaymentType: 1, // 默认选择现金
		paymentTypeList: [
			{ id: 1, name: '微信', icon: 'weixin', color: '#09bb07' },
			{ id: 2, name: '支付宝', icon: 'paperplane', color: '#1296db' },
			{ id: 3, name: '现金', icon: 'wallet', color: '#ff9500' },
			{ id: 4, name: '其他', icon: 'more-filled', color: '#e74c3c' }
		],
			// 添加费用类型弹窗相关
			showAddExpenseTypeModal: false,
			newExpenseTypeName: '',
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
	},
	// 筛选后的订单列表
	filteredOrderList() {
		if (!this.currentData || !this.currentData.orderList) {
			return [];
		}
		
		let list = [...this.currentData.orderList];
		
		// 付款状态筛选
		if (this.orderPaymentFilter === 'paid') {
			list = list.filter(order => order.debt <= 0);
		} else if (this.orderPaymentFilter === 'unpaid') {
			list = list.filter(order => order.debt > 0);
		}
		
		// 排序
		list.sort((a, b) => {
			if (this.orderSortType === 'time-desc') {
				return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
			} else if (this.orderSortType === 'time-asc') {
				return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
			} else if (this.orderSortType === 'amount-desc') {
				return (b.actualMoney || 0) - (a.actualMoney || 0);
			} else if (this.orderSortType === 'amount-asc') {
				return (a.actualMoney || 0) - (b.actualMoney || 0);
			}
			return 0;
		});
		
		return list;
	}
},
onShow() {
		// 页面显示时刷新CustomTabs下划线
		this.$nextTick(() => {
			setTimeout(() => {
				if (this.$refs.basketTabs && this.$refs.basketTabs.refresh) {
					this.$refs.basketTabs.refresh();
				}
			}, 300);
		});
	},
	mounted() {
		// 组件挂载时只初始化系统高度
		// 数据初始化延迟到首次显示时（通过refreshPage调用）
		this.getSystemheight();
		
		// 延迟刷新CustomTabs下划线
		this.$nextTick(() => {
			setTimeout(() => {
				if (this.$refs.basketTabs && this.$refs.basketTabs.refresh) {
					this.$refs.basketTabs.refresh();
				}
			}, 500);
		});
	},
	beforeDestroy() {
		// 组件销毁前清除计时器
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	},
	methods: {
		// 初始化页面数据（懒加载模式）
		async initPageData() {
			// 显示全局加载提示
			uni.showLoading({
				title: '加载中...',
				mask: true // 防止用户操作
			});
			
			try {
				// 获取最新的存储数据
				this.CompanyId = uni.getStorageSync("companyId");
				this.currentDutyId = uni.getStorageSync("currentDutyId");
				this.currentDutyBeginTime = uni.getStorageSync("currentDutybeginTime");
				
				// 并行获取数据
				await Promise.all([
					this.getCurrentData(),
					this.getExpenseTypeList()
				]);
				
				// 清除旧的计时器
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
				
				// 启动计时器
				this.timer = setInterval(() => {
					if (this.currentDutyBeginTime != null) {
						// 获取当前时间
						const now = new Date();
						// 将 beginTime 转换为 Date 对象
						const beginTime = new Date(this.currentDutyBeginTime);
						// 计算时间差（毫秒）
						const timeDiff = now - beginTime;
						// 将毫秒转换为更友好的格式
						this.dutyTime = this.formatTime(timeDiff);
					}
				}, 1000);
			} catch (error) {
				console.error("初始化页面数据失败:", error);
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				// 无论成功或失败都隐藏加载提示
				uni.hideLoading();
			}
		},
		
		// 刷新页面（供父组件调用）
		refreshPage() {
			this.initPageData();
		},
		
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
		this.baskerTabIndex = e.index;
		this.baskerShowType = e.value;
	},
	handleCheckout() {
		// 显示对账弹窗
		this.showCheckoutModal = true;
	},
	// 确认交账
	confirmCheckout() {
		this.showCheckoutModal = false;
		this.finishDutyAction();
	},
// 取消交账
cancelCheckout() {
	this.showCheckoutModal = false;
},
// 关闭排序筛选（当打开付款筛选时）
closeSortFilter() {
	if (this.$refs.sortFilter) {
		this.$refs.sortFilter.close();
	}
},
// 关闭付款筛选（当打开排序筛选时）
closePaymentFilter() {
	if (this.$refs.paymentFilter) {
		this.$refs.paymentFilter.close();
	}
},
// 排序变化
onSortChange(value) {
	console.log('排序方式变更:', value);
},
// 付款状态变化
onPaymentChange(value) {
	console.log('付款状态变更:', value);
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
			const windowInfo = uni.getWindowInfo();
			this.windowHeight = windowInfo.windowHeight;
			this.windowWidth = windowInfo.windowWidth - uni.upx2px(40);
			this.calculateWidths();
		},
		
		calculateWidths() {
			// 计算实际的 padding 和 gap (rpx 转 px: 以 750 为基准)
			const scale = this.windowWidth / 750;
			const padding = Math.ceil(5 * scale); // 5rpx 的 padding
			const gap = Math.ceil(5 * scale); // 5rpx 的 gap
			
			// 内容区域宽度 = 窗口宽度 - 左右 padding
			const contentWidth = this.windowWidth - (padding * 2);
			
			// 左侧面板占 2/3，右侧面板占 1/3
			this.leftPanelWidth = Math.floor((contentWidth - gap) * 2/ 3);
			this.rightPanelWidth = Math.floor((contentWidth - gap) * 1 / 3);
			
			// 卡片宽度 = 左侧面板宽度（卡片本身会通过 100% 来填充）
			this.cardWidth = this.leftPanelWidth;
		},
		getCurrentData() {
			return duty.getDutyStatic(this.currentDutyId).then(res => {
				this.currentData = res.data;
				
			}).catch(err => {
				console.error("获取班次数据失败:", err);
				throw err; // 重新抛出错误，让调用者处理
			});
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
		this.reservePaymentType = 4; // 重置为现金
	},
	
	closeReserveModal() {
		this.showReserveModal = false;
		this.reserveAmount = '';
		this.reserveRemark = '';
		this.reservePaymentType = 4; // 重置为现金
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
		
	const amount = parseFloat(this.reserveAmount);
	var userInfo = uni.getStorageSync("userInfo");
	const data = {
		operatorId:userInfo.id,
		dutyId: this.currentDutyId,
		mount: amount,
		remark: this.reserveRemark,
		dutyId: this.currentDutyId,
		reservefundOperatorType: this.reserveOperationType === 'add' ? 2 : 1,  // 增加=2, 支出=1
		payWay: this.reservePaymentType  // 支付方式：1-微信 2-支付宝 3-银行卡 4-现金
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
		
	// 显示费用支出列表
	handleExpenseListShow() {
		this.drawerType = 'expenseList';
		this.showDrawer = true;
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
		
		// 费用支出相关方法
		openExpenseModal() {
			this.showExpenseModal = true;
			this.expenseAmount = '';
			this.expenseRemark = '';
			this.selectedExpenseType = {};
			this.selectedPaymentType = 4; // 重置为现金
		},
		
		closeExpenseModal() {
			this.showExpenseModal = false;
			this.expenseAmount = '';
			this.expenseRemark = '';
			this.selectedExpenseType = {};
			this.selectedPaymentType = 4; // 重置为现金
		},
		
		selectExpenseType(type) {
			this.selectedExpenseType = type;
		},
		
		selectPaymentType(typeId) {
			this.selectedPaymentType = typeId;
		},
		
		confirmExpenseOperation() {
			// 验证输入
			if (!this.selectedExpenseType.id) {
				uni.showToast({
					title: '请选择支出类型',
					icon: 'none'
				});
				return;
			}
			
			if (!this.expenseAmount || this.expenseAmount <= 0) {
				uni.showToast({
					title: '请输入有效金额',
					icon: 'none'
				});
				return;
			}
			
			// 调用API保存费用支出记录，参数对应后端DutySpend类
			const amount = parseFloat(this.expenseAmount);
			const data = {
				spendName: this.selectedExpenseType.name, // 费用名称
				spendMoney: amount, // 金额
				dutyId: this.currentDutyId, // 班次id
				companyId:this.CompanyId,
				remark: this.expenseRemark || '', // 备注
				spendStatus: 1, // 1-支出 2-收入
				payWay: this.selectedPaymentType // 支付方式：1-微信 2-支付宝 3-银行卡 4-现金
			}
			
			console.log("data",data)

			duty.AddDutySpendCost(data).then(res => {
				console.log("费用支出保存成功:", res);
				uni.showToast({
					title: '支出记录已保存',
					icon: 'success'
				});
				// 操作成功后关闭弹窗并刷新数据
				this.closeExpenseModal();
				this.getCurrentData(); // 刷新当前数据
			}).catch(err => {
				console.error("保存费用支出失败:", err);
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			});
		},
		
		// 添加费用类型弹窗相关方法
		openAddExpenseTypeModal() {
			this.showAddExpenseTypeModal = true;
			this.newExpenseTypeName = '';
		},
		
		cancelAddExpenseType() {
			this.showAddExpenseTypeModal = false;
			this.newExpenseTypeName = '';
		},
		
		confirmAddExpenseType() {
			const typeName = this.newExpenseTypeName.trim();
			if (!typeName) {
				uni.showToast({
					title: '请输入费用类型名称',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			// 检查是否已存在
			const exists = this.expenseTypeList.some(type => type.name === typeName);
			if (exists) {
				uni.showToast({
					title: '该费用类型已存在',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			
			this.addExpenseTypeLabel(typeName);
		},
		
		// 添加费用类型标签
		addExpenseTypeLabel(label) {

			var userInfo = uni.getStorageSync("userInfo");
			const labelData = {
				operatorId: userInfo.id,
				companyId: this.CompanyId,
				label: label.trim(),
				labelType: 3 // 1表示费用类型
			};

			labelApi.createExpenseLabel(labelData).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: "添加成功",
						icon: "success"
					});
					
					// 重新获取标签列表
					this.getExpenseTypeList();
					
					// 自动选中新添加的费用类型
					setTimeout(() => {
						const newType = this.expenseTypeList.find(type => type.name === label.trim());
						if (newType) {
							this.selectedExpenseType = newType;
						}
					}, 300);
					
					// 关闭添加类型弹窗
					this.showAddExpenseTypeModal = false;
					this.newExpenseTypeName = '';
				} else {
					uni.showToast({
						title: res.msg || "添加失败",
						icon: "none"
					});
				}
			}).catch(error => {
				uni.showToast({
					title: "网络错误",
					icon: "none"
				});
			});
		},
		
		// 获取费用类型列表
		getExpenseTypeList() {
			return labelApi.GetExpenseLabel(this.CompanyId, 3).then(res => {
				console.log("Res",res)
				if (res.code === 200 && res.data) {
					this.expenseTypeList = res.data.map(item => ({
						id: item.id,
						name: item.label
					}));
					
					// 如果费用类型列表不为空，且当前选中的费用类型无效，则设置为第一个
					if (this.expenseTypeList.length > 0) {
						const validType = this.expenseTypeList.find(type => 
							type.id === this.selectedExpenseType.id
						);
						if (!validType) {
							this.selectedExpenseType = this.expenseTypeList[0];
						}
					}
				}
			}).catch(err => {
				console.error("获取费用类型失败:", err);
				throw err; // 重新抛出错误，让调用者处理
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
	
	// 根据金额长度返回字体大小类名
	getAmountFontClass(amount) {
		const amountStr = String(amount);
		const length = amountStr.length;
		
		if (length > 10) {
			return 'font-size-xs';  // 超长
		} else if (length > 7) {
			return 'font-size-sm';  // 长
		} else if (length > 5) {
			return 'font-size-md';  // 中等
		}
		return '';  // 默认大小
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

// 全局防止横向滚动
view, scroll-view {
	max-width: 100%;
	box-sizing: border-box;
}

// 主容器
.rotating-container {
	background-color: gainsboro;
	overflow: hidden !important;
	overflow-x: hidden !important;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	position: relative;
	box-sizing: border-box;
}

// 顶部工具栏
.header-toolbar {
	height: 70px;
	background-color: white;
	z-index: 999;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 5rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid #e5e5e5;
	box-sizing: border-box;
	overflow: hidden;
	flex-shrink: 0;
}

// 左侧用户信息
.header-left {
	flex: 1;
	display: flex;
	align-items:flex-start;
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
	justify-content: left;
	align-items:flex-start;
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
	font-size: 16rpx;
	font-weight: 600;
	color: #2c3e50;
	letter-spacing: 0.5rpx;
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
	overflow-x: hidden;
	overflow-y: auto;
	width: 100%;
	max-width: 100%;
	position: relative;
}

.content-wrapper {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	background-color: gainsboro;
	padding: 5rpx;
	gap: 5rpx;
	overflow: hidden !important;
	overflow-x: hidden !important;
	box-sizing: border-box;
	flex-shrink: 0;
	max-width: 100%;
}

// 左侧面板
.left-panel {
	flex-shrink: 0;
	overflow: hidden;
	overflow-x: hidden;
	box-sizing: border-box;
	max-width: 100%;
}

.card-container {
	display: flex;
	flex-direction: column;
	gap: 3rpx;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
}

// 通用卡片样式
.grid {
	background-color: white;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	border-radius: 10px;
	border: 1rpx solid #e5e5e5;
	overflow: hidden;
	box-sizing: border-box;
}

// 卡片头部标题样式
.card-header-title {
	display: flex;
	align-items: center;
	font-weight: bold;
	font-size: 15rpx;
	padding: 10rpx;
	padding-top: 6rpx;
	padding-bottom: 6rpx;
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
	width: 100%;
	max-width: 100%;
}

.card1-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
}

.card1-content {
	display: flex;
	padding: 8rpx;
	padding-bottom: 0rpx;
	gap: 8rpx;
	height: calc(100% - 50rpx); /* 更精确地计算可用高度 */
	overflow: hidden;
	box-sizing: border-box;
}

.revenue-column {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	height: 100%;
}

.revenue-column-right {
	margin-left: 8rpx;
}

.yye-grid {
	display: flex;
	flex: 1;
	height: calc((100% - 12rpx) / 3);
	min-height: calc((100% - 12rpx) / 3);
	max-height: calc((100% - 12rpx) / 3);
	justify-content: space-between;
	align-items: center;
	background-color: #f5f5f5;
	margin: 2rpx 0;
	border-radius: 6rpx;
	padding: 6rpx 10rpx;
	font-size: 12rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.04);
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.04);
	cursor: pointer;
	
	&:active {
		background-color: #ececec;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.08);
	}
}

.yye-grid-text {
	font-size: 11rpx;
	color: #6b7280;
	font-weight: 500;
	white-space: nowrap;
}

.yye-grid-value {
	font-size: 14rpx;
	color: #1e293b;
	font-weight: 600;
	text-align: right;
	flex-shrink: 0;
}

// 底部卡片容器
.bottom-cards-container {
	width: 100%;
	max-width: 100%;
	display: flex;
	overflow: hidden;
}

.bottom-card-wrapper {
	width: 100%;
	max-width: 100%;
	display: flex;
	flex-direction: column;
	gap: 3px;
	overflow: hidden;
}

// 附加物品卡片
.card2 {
	width: 100%;
	max-width: 100%;
	height: 150px;
	margin-top: 3px;
	flex-shrink: 0;
	overflow: hidden;
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
	padding: 16rpx 20rpx;
}

.card2-scroll-area {
	height: 80px;
}

.basket-container {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	row-gap: 10rpx;
}

.basket-item-collect {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fafafa;
	min-width: 100rpx;
	padding: 10rpx 16rpx;
	border-radius: 6rpx;
	font-size: 14rpx;
	border: 1rpx solid #f0f0f0;
	cursor: pointer;
	transition: all 0.15s ease;
	
	&:active {
		background-color: #f0f8ff;
		border-color: #55aaff;
	}
}

.basket-item-owe {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fafafa;
	min-width: 100rpx;
	padding: 10rpx 16rpx;
	border-radius: 6rpx;
	font-size: 14rpx;
	border: 1rpx solid #f0f0f0;
	cursor: pointer;
	transition: all 0.15s ease;
	
	&:active {
		background-color: #fff8f0;
		border-color: #ffb03a;
	}
}

.basket-name {
	flex: 1;
	text-align: left;
	color: #333;
	font-weight: 500;
}

.basket-count {
	margin-left: 12rpx;
	font-weight: 600;
	color: #666;
	font-size: 13rpx;
}

// 其他费用卡片容器
.other-expenses-container {
	width: 100%;
	max-width: 100%;
	display: flex;
	gap: 6rpx;
	overflow: hidden;
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
	padding: 16rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(100% - 50rpx);
}

.empty-content {
	text-align: center;
	padding: 20rpx 0;
}

.empty-text {
	font-size: 14rpx;
	color: #999;
}

// 费用支出横向滚动样式
.expense-scroll-view {
	width: 100%;
	height: 50rpx;
	margin-top: 20px;
	white-space: nowrap;
}

.expense-grid-container {
	display: inline-flex;
	gap: 12rpx;
	padding: 8rpx 4rpx;
	height: 100%;
	align-items: center;
}

.expense-grid-item {
	display: inline-flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-width: 120rpx;
	height: auto;
	background: #fafafa;
	border-radius: 6rpx;
	padding: 12rpx 16rpx;
	border: 1rpx solid #f0f0f0;
	cursor: pointer;
	box-sizing: border-box;
	transition: all 0.15s ease;
	
	&:active {
		background: #fff5f5;
		border-color: #e74c3c;
	}
}

.expense-item-left {
	flex: 1;
	display: flex;
	align-items: center;
	margin-right: 12rpx;
}

.expense-item-name {
	font-size: 14rpx;
	color: #333;
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.expense-item-right {
	display: flex;
	align-items: center;
	flex-shrink: 0;
}

.expense-item-amount {
	font-size: 14rpx;
	color: #e74c3c;
	font-weight: 600;
	white-space: nowrap;
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
	flex-shrink: 0;
	overflow: hidden;
	overflow-x: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 5rpx;
	max-width: 100%;
}

// 支付统计卡片
.payment-card {
	height: 300px;
	padding: 0;
	width: 100%;
	max-width: 100%;
	overflow: hidden;
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
	padding-bottom: 0;
	overflow: hidden;
	box-sizing: border-box;
}

.payment-row {
	display: flex;
	justify-content: space-between;
	margin: 2rpx;
	gap: 6rpx;
	flex: 1;
	height: 0;
	min-height: 0;
}

.payment-item {
	flex: 1;
	padding: 8rpx 4rpx;
	border-radius: 6rpx;
	color: white;
	font-weight: 500;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	cursor: pointer;
	box-sizing: border-box;
	min-width: 0;
	
	&:active {
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15), 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
	}
}

.wechat-pay {
	background: #07c160;
	
	&:active {
		box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.35), 0 1rpx 3rpx rgba(7, 193, 96, 0.2);
	}
}

.alipay-pay {
	background: #1677ff;
	
	&:active {
		box-shadow: 0 2rpx 8rpx rgba(22, 119, 255, 0.35), 0 1rpx 3rpx rgba(22, 119, 255, 0.2);
	}
}

.cash-pay {
	background: #ff6b35;
	
	&:active {
		box-shadow: 0 2rpx 8rpx rgba(255, 107, 53, 0.35), 0 1rpx 3rpx rgba(255, 107, 53, 0.2);
	}
}

.other-pay {
	background: #ffd700;
	color: #2c3e50;
	
	&:active {
		box-shadow: 0 2rpx 8rpx rgba(255, 215, 0, 0.35), 0 1rpx 3rpx rgba(255, 215, 0, 0.2);
	}
}

.payment-header {
	margin-bottom: 8rpx;
	width: 100%;
}

.payment-icon-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4rpx;
	width: 100%;
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
	text-align: center;
	width: 100%;
	word-break: break-all;
	line-height: 1.2;
	
	&.font-size-md {
		font-size: 17rpx;
	}
	
	&.font-size-sm {
		font-size: 14rpx;
	}
	
	&.font-size-xs {
		font-size: 12rpx;
	}
}

// 订单数据卡片
.card5 {
	width: 100%;
	max-width: 100%;
	margin-top: 3px;
	overflow: hidden;
}

.card5-header {
	border-bottom: 1rpx solid #f0f0f0;
	background: #fafbfc;
	padding: 10rpx;
	padding-top: 5rpx;
	padding-bottom: 5rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
}

.card5-header-text {
	font-size: 12rpx;
	font-weight: bold;
	color: #888888;
}

.order-filter-container {
	display: flex;
	gap: 8rpx;
	align-items: center;
}

.card5-content {
	padding: 8rpx;
}

.orders-scroll-area {
	height: 100%;
}

.order-item {
	border-radius: 6rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.04);
	margin-bottom: 4rpx;
	display: flex;
	flex-direction: column;
	padding: 8rpx 10rpx;
	background: #f5f5f5;
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
	cursor: pointer;
	gap: 4rpx;
	
	&:active {
		background: #ececec;
		border-color: #3b82f6;
		box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.15), 0 1rpx 3rpx rgba(59, 130, 246, 0.1);
	}
}

.order-row-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.order-row-bottom {
	display: flex;
}

.customer-name {
	font-size: 13rpx;
	font-weight: 600;
	color: #1e293b;
	flex: 1;
}

.order-amount {
	display: flex;
	align-items: center;
}

.order-time {
	font-size: 11rpx;
	color: #6b7280;
}

.amount-paid {
	font-size: 13rpx;
	font-weight: 600;
	color: #10b981;
}

.amount-pending {
	font-size: 13rpx;
	font-weight: 600;
	color: #e74c3c;
}

/* 抽屉容器 */
.drawer-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	max-width: 100vw;
	pointer-events: none;
	/* 初始不允许交互 */
	z-index: 999;
	margin-top: 50rpx;
	height: calc(100% - 50rpx);
	overflow: hidden;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

/* 抽屉头部样式 */
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

.detail-title-new {
	font-size: 16rpx;
	font-weight: bold;
	color: white;
}

/* 订单信息网格 */
.order-info-grid-compact {
	padding: 8rpx;
	background-color: #f8f9fa;
	border-radius: 6rpx;
	margin-bottom: 8rpx;
}

.info-row {
	display: flex;
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
	padding: 6rpx 10rpx;
	border-radius: 4rpx;
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
	min-width: 0;
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
	font-size: 14rpx;
	font-weight: 600;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.info-value-small {
	font-size: 12rpx;
}

.highlight-value {
	color: #e4393c;
	font-weight: bold;
}

.debt-value-new {
	color: darkred;
	font-weight: bold;
}

/* 商品表格容器 */
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
	background-color: #ecf5ff;
}

.table-row {
	display: table-row;
}

.table-cell,
.table-header-cell {
	display: table-cell;
	border: 1px solid #dddddd;
	padding: 8rpx 6rpx;
	text-align: center;
	font-size: 12rpx;
	line-height: 1.3;
}

.table-header-cell {
	font-weight: bold;
	color: #333;
	background: linear-gradient(135deg, #f5f7fa, #e8ebef);
}

.product-table {
	display: table;
	table-layout: fixed;
}

/* 下欠订单抽屉样式 */
.debt-order-container {
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.debt-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.debt-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.debt-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	margin-bottom: 6rpx;
}

.debt-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.debt-customer-name {
	font-size: 13rpx;
	font-weight: bold;
	color: #2c3e50;
}

.debt-order-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.debt-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2rpx;
}

.debt-total-amount {
	font-size: 10rpx;
	color: #6c757d;
}

.debt-amount {
	font-size: 13rpx;
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
	gap: 6rpx;
}

.debt-code-label {
	font-size: 9rpx;
	color: #6c757d;
}

.debt-code-value {
	font-size: 9rpx;
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
	border-radius: 3rpx;
	padding: 1rpx 6rpx;
}

.debt-status-text {
	font-size: 9rpx;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.repay-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.repay-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.repay-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	gap: 2rpx;
}

.repay-customer-name {
	font-size: 13rpx;
	font-weight: bold;
	color: #2c3e50;
}

.repay-order-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.repay-order-amounts {
	display: flex;
	align-items: center;
}

.repay-amount {
	font-size: 14rpx;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.total-money-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.total-money-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.total-money-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	margin-bottom: 6rpx;
}

.total-money-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.total-money-customer-name {
	font-size: 13rpx;
	font-weight: bold;
	color: #2c3e50;
}

.total-money-order-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.total-money-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2rpx;
}

.total-money-total-amount {
	font-size: 10rpx;
	color: #6c757d;
}

.total-money-actual-amount {
	font-size: 13rpx;
	font-weight: bold;
	color: #27ae60;
}

.total-money-debt-amount {
	font-size: 11rpx;
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
	gap: 6rpx;
}

.total-money-code-label {
	font-size: 9rpx;
	color: #6c757d;
}

.total-money-code-value {
	font-size: 9rpx;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

.total-money-order-status {
	display: flex;
	align-items: center;
}

.total-money-status-tag {
	border-radius: 3rpx;
	padding: 1rpx 6rpx;
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
	font-size: 9rpx;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.receive-money-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.receive-money-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.receive-money-order-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	margin-bottom: 6rpx;
}

.receive-money-order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.receive-money-customer-name {
	font-size: 13rpx;
	font-weight: bold;
	color: #2c3e50;
}

.receive-money-order-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.receive-money-order-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2rpx;
}

.receive-money-total-amount {
	font-size: 10rpx;
	color: #6c757d;
}

.receive-money-actual-amount {
	font-size: 13rpx;
	font-weight: bold;
	color: #16a34a;
}

.receive-money-debt-amount {
	font-size: 11rpx;
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
	gap: 6rpx;
}

.receive-money-code-label {
	font-size: 9rpx;
	color: #6c757d;
}

.receive-money-code-value {
	font-size: 9rpx;
	color: #2c3e50;
	font-family: 'Courier New', monospace;
}

.receive-money-order-status {
	display: flex;
	align-items: center;
}

.receive-money-status-tag {
	border-radius: 3rpx;
	padding: 1rpx 6rpx;
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
	font-size: 9rpx;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.expense-accout-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.expense-accout-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.expense-accout-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	margin-bottom: 6rpx;
}

.expense-accout-item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.expense-accout-item-type {
	font-size: 13rpx;
	font-weight: 600;
	color: #2c3e50;
}

.expense-accout-create-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.expense-accout-item-amounts {
	display: flex;
	align-items: center;
}

.expense-accout-amount {
	font-size: 14rpx;
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
	gap: 3rpx;
}

.expense-accout-action-icon {
	display: flex;
	align-items: center;
}

.expense-accout-action-text {
	font-size: 9rpx;
	color: #007AFF;
	font-weight: 500;
}

.expense-accout-direction {
	display: flex;
	align-items: center;
}

.expense-accout-direction-tag {
	border-radius: 3rpx;
	padding: 1rpx 6rpx;
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
	font-size: 9rpx;
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.reserve-record-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.reserve-record-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.reserve-record-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	margin-bottom: 6rpx;
}

.reserve-record-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.reserve-record-type {
	font-size: 13rpx;
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
	font-size: 9rpx;
	color: #7f8c8d;
}

.reserve-record-amounts {
	display: flex;
	align-items: center;
}

.reserve-record-amount {
	font-size: 14rpx;
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
	margin-top: 6rpx;
}

.reserve-record-remark {
	display: flex;
	align-items: center;
	gap: 6rpx;
	width: 100%;
	padding: 6rpx 10rpx;
	background-color: #f8f9fa;
	border-radius: 4rpx;
	border: 1rpx solid #e9ecef;
}

.reserve-record-remark-label {
	font-size: 9rpx;
	color: #6c757d;
	font-weight: 500;
	white-space: nowrap;
}

.reserve-record-remark-value {
	font-size: 10rpx;
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

/* 费用支出列表抽屉样式 */
.expense-list-container {
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.expense-list-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.expense-list-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
}

.expense-list-title-icon {
	display: flex;
	align-items: center;
}

.expense-list-title-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
}

.expense-list-summary {
	padding: 8rpx 12rpx;
	background-color: #ffebee;
	border-radius: 6rpx;
	border: 1rpx solid #ffcdd2;
}

.expense-list-summary-text {
	font-size: 12rpx;
	color: #c62828;
	font-weight: 500;
}

.expense-list-scroll {
	flex: 1;
}

.expense-list {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.expense-list-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
	transition: all 0.2s ease;
}

.expense-list-item:hover {
	background-color: #fff5f5;
	border-color: #e74c3c;
	box-shadow: 0 2rpx 8rpx rgba(231, 76, 60, 0.1);
}

.expense-list-item-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 6rpx;
}

.expense-list-item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2rpx;
}

.expense-list-item-name {
	font-size: 13rpx;
	font-weight: bold;
	color: #2c3e50;
}

.expense-list-item-time {
	font-size: 9rpx;
	color: #7f8c8d;
}

.expense-list-item-amounts {
	display: flex;
	align-items: center;
}

.expense-list-amount {
	font-size: 15rpx;
	font-weight: bold;
	color: #e74c3c;
}

.expense-list-item-detail {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.expense-list-item-payment {
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.expense-payment-icon {
	width: 28rpx;
	height: 28rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.expense-payment-text {
	font-size: 11rpx;
	color: #6c757d;
	font-weight: 500;
}

.expense-list-item-remark {
	display: flex;
	align-items: center;
	gap: 6rpx;
	width: 100%;
	padding: 6rpx 10rpx;
	background-color: #fff8e1;
	border-radius: 4rpx;
	border: 1rpx solid #ffecb3;
}

.expense-remark-label {
	font-size: 9rpx;
	color: #6c757d;
	font-weight: 500;
	white-space: nowrap;
}

.expense-remark-value {
	font-size: 10rpx;
	color: #495057;
	flex: 1;
	word-break: break-all;
}

.expense-list-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 20rpx;
	gap: 16rpx;
}

.expense-list-empty-icon {
	display: flex;
	align-items: center;
	justify-content: center;
}

.expense-list-empty-text {
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
	padding: 20rpx;
	box-sizing: border-box;
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
	max-width: 90vw;
	max-height: 80vh;
	background-color: white;
	border-radius: 12rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	animation: slideUp 0.3s ease;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.reserve-modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
	flex-shrink: 0;
}

.reserve-modal-title {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
	flex: 1;
	text-align: center;
}

.reserve-header-btn {
	font-size: 14rpx;
	font-weight: 500;
	padding: 10rpx 20rpx;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 8rpx;
	user-select: none;
	min-width: 60rpx;
	text-align: center;
}

.reserve-header-btn.btn-cancel-top {
	color: #666;
	background-color: #f5f5f5;
	border: 1rpx solid #e0e0e0;
}

.reserve-header-btn.btn-cancel-top:active {
	background-color: #e8e8e8;
	transform: scale(0.95);
}

.reserve-header-btn.btn-confirm-top {
	color: white;
	background-color: #f39c12;
	font-weight: bold;
	border: 1rpx solid #f39c12;
}

.reserve-header-btn.btn-confirm-top:active {
	background-color: #e67e22;
	transform: scale(0.95);
}

.modal-content {
	padding: 24rpx;
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	/* 美化滚动条 */
	scrollbar-width: thin;
	scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.modal-content::-webkit-scrollbar {
	width: 4rpx;
}

.modal-content::-webkit-scrollbar-track {
	background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 2rpx;
}

.modal-content::-webkit-scrollbar-thumb:hover {
	background-color: rgba(0, 0, 0, 0.3);
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

/* 费用支出弹窗样式 */
.expense-modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	box-sizing: border-box;
}

.expense-modal {
	position: relative;
	width: 400rpx;
	max-width: 90vw;
	max-height: 80vh;
	background-color: white;
	border-radius: 12rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	animation: slideUp 0.3s ease;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.expense-modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
	flex-shrink: 0;
}

.expense-modal-title {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
	flex: 1;
	text-align: center;
}

.expense-header-btn {
	font-size: 14rpx;
	font-weight: 500;
	padding: 10rpx 20rpx;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 8rpx;
	user-select: none;
	min-width: 60rpx;
	text-align: center;
}

.btn-cancel-top {
	color: #666;
	background-color: #f5f5f5;
	border: 1rpx solid #e0e0e0;
}

.btn-cancel-top:active {
	background-color: #e8e8e8;
	transform: scale(0.95);
}

.btn-confirm-top {
	color: white;
	background-color: #e74c3c;
	font-weight: bold;
	border: 1rpx solid #e74c3c;
}

.btn-confirm-top:active {
	background-color: #d63a2c;
	transform: scale(0.95);
}

.expense-type-section {
	margin-bottom: 20rpx;
}

.expense-type-label-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8rpx;
}

.add-expense-type-btn {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 50%;
}

.add-expense-type-btn:active {
	background-color: rgba(231, 76, 60, 0.1);
	transform: scale(0.9);
}

.expense-type-buttons {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12rpx;
	margin-top: 8rpx;
}

.expense-type-btn {
	padding: 12rpx 16rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14rpx;
	color: #6c757d;
	cursor: pointer;
	transition: all 0.2s ease;
	background-color: white;
	text-align: center;
}

.expense-type-btn.active {
	border-color: #e74c3c;
	background-color: rgba(231, 76, 60, 0.1);
	color: #e74c3c;
	font-weight: 600;
}

.expense-type-btn:active {
	transform: scale(0.95);
}

/* 支付方式选择样式 */
.payment-type-section {
	margin-bottom: 24rpx;
}

.payment-type-buttons {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 12rpx;
	margin-top: 12rpx;
}

.payment-type-btn {
	padding: 16rpx 8rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 8rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	font-size: 12rpx;
	cursor: pointer;
	transition: all 0.2s ease;
	background-color: #f8f9fa;
}

.payment-type-btn text {
	font-size: 12rpx;
	font-weight: 500;
	transition: all 0.2s ease;
}

.payment-type-btn.active {
	font-weight: 600;
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.payment-type-btn:active {
	transform: scale(0.95);
}

.expense-action-btn {
	width: 15rpx;
	height: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
}

.expense-action-btn:active {
	opacity: 0.7;
	transform: scale(0.95);
}

/* 添加费用类型弹窗样式 */
.add-expense-type-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
}

.add-expense-type-modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 20rpx;
	box-sizing: border-box;
}

.add-expense-type-modal-container {
	width: 400rpx;
	max-width: 90vw;
	background: white;
	border-radius: 12rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
	overflow: hidden;
	animation: slideUp 0.3s ease;
}

.add-expense-type-modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.expense-type-header-title {
	font-size: 18rpx;
	font-weight: bold;
	color: #2c3e50;
	flex: 1;
	text-align: center;
}

.expense-type-header-btn {
	font-size: 14rpx;
	font-weight: 500;
	padding: 10rpx 20rpx;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 8rpx;
	user-select: none;
	min-width: 60rpx;
	text-align: center;
}

.expense-type-header-btn.cancel {
	color: #666;
	background-color: #f5f5f5;
	border: 1rpx solid #e0e0e0;
}

.expense-type-header-btn.cancel:active {
	background-color: #e8e8e8;
	transform: scale(0.95);
}

.expense-type-header-btn.confirm {
	color: white;
	background-color: #e74c3c;
	font-weight: bold;
	border: 1rpx solid #e74c3c;
}

.expense-type-header-btn.confirm:active {
	background-color: #d63a2c;
	transform: scale(0.95);
}

.add-expense-type-modal-content {
	padding: 24rpx;
}

.expense-type-input-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.expense-type-input-label {
	font-size: 14rpx;
	color: #495057;
	font-weight: 500;
}

.expense-type-name-input {
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

.expense-type-name-input:focus {
	border-color: #e74c3c;
	outline: none;
	box-shadow: 0 0 0 2rpx rgba(231, 76, 60, 0.1);
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

	.table-header-fixed .header-cell,
	.table-row .table-cell {
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
	padding: 12rpx 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;
}

.basket-detail-header {
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 10rpx;
}

.basket-detail-title {
	display: flex;
	align-items: center;
	gap: 10rpx;
	margin-bottom: 6rpx;
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
	gap: 6rpx;
	padding-bottom: 10rpx;
}

.basket-detail-record-item {
	background-color: #f8f9fa;
	border: 1rpx solid #e9ecef;
	border-radius: 6rpx;
	padding: 8rpx 10rpx;
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
	gap: 2rpx;
}

.basket-detail-record-type {
	font-size: 12rpx;
	font-weight: bold;
	padding: 1rpx 6rpx;
	border-radius: 3rpx;
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
	font-size: 9rpx;
	color: #7f8c8d;
}

.basket-detail-record-amounts {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 2rpx;
}

.basket-detail-customer-name {
	font-size: 12rpx;
	font-weight: bold;
	color: #2c3e50;
}

.basket-detail-basket-count {
	font-size: 11rpx;
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

/* 对账弹窗样式 */
.checkout-modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10000;
}

.checkout-modal-container {
	width: 90%;
	max-width: 700rpx;
	max-height: 85vh;
	background-color: #ffffff;
	border-radius: 12rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.3);
}

/* 弹窗头部 */
.checkout-modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 24rpx;
	background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
	color: #ffffff;
}

.checkout-modal-title {
	font-size: 18rpx;
	font-weight: 700;
}

.checkout-modal-close {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s;
}

.checkout-modal-close:active {
	background-color: rgba(255, 255, 255, 0.3);
}

.close-icon {
	font-size: 18rpx;
	color: #ffffff;
	font-weight: bold;
}

/* 弹窗内容 */
.checkout-modal-body {
	flex: 1;
	overflow-y: auto;
	padding: 20rpx;
}

.checkout-section {
	margin-bottom: 24rpx;
	background-color: #f8f9fa;
	border-radius: 8rpx;
	padding: 16rpx;
}

.checkout-section:last-child {
	margin-bottom: 0;
}

.checkout-section-title {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 12rpx;
	padding-bottom: 8rpx;
	border-bottom: 2rpx solid #e9ecef;
}

.section-icon {
	font-size: 18rpx;
}

.section-title-text {
	font-size: 16rpx;
	font-weight: 600;
	color: #333;
}

/* 班次信息 */
.checkout-info-grid {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.info-row {
	display: flex;
	align-items: center;
	padding: 8rpx 12rpx;
	background-color: #ffffff;
	border-radius: 6rpx;
}

.info-label {
	font-size: 13rpx;
	color: #666;
	flex-shrink: 0;
}

.info-value {
	font-size: 14rpx;
	color: #333;
	font-weight: 600;
	flex: 1;
	text-align: right;
}

/* 营业数据 */
.checkout-data-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10rpx;
}

.data-item {
	background-color: #ffffff;
	padding: 12rpx;
	border-radius: 6rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	border: 1rpx solid #e9ecef;
}

.data-item.highlight {
	border: 2rpx solid #1976d2;
	background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
}

.data-label {
	font-size: 12rpx;
	color: #999;
}

.data-value {
	font-size: 16rpx;
	font-weight: 700;
	color: #333;
}

.data-value.primary {
	color: #1976d2;
}

.data-value.success {
	color: #4caf50;
}

.data-value.warning {
	color: #ff9800;
}

.data-value.info {
	color: #2196f3;
}

/* 支付统计 */
.checkout-payment-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10rpx;
}

.payment-stat-item {
	padding: 12rpx;
	border-radius: 6rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	color: #ffffff;
}

.payment-stat-item.wechat {
	background: linear-gradient(135deg, #09bb07 0%, #07a005 100%);
}

.payment-stat-item.alipay {
	background: linear-gradient(135deg, #1678ff 0%, #0d5dcc 100%);
}

.payment-stat-item.bank {
	background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.payment-stat-item.cash {
	background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.payment-stat-label {
	font-size: 12rpx;
	color: rgba(255, 255, 255, 0.9);
}

.payment-stat-value {
	font-size: 16rpx;
	font-weight: 700;
	color: #ffffff;
}

/* 支出统计 */
.checkout-expense-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.expense-stat-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 12rpx;
	background-color: #ffffff;
	border-radius: 6rpx;
	border-left: 3rpx solid #e74c3c;
}

.expense-stat-label {
	font-size: 13rpx;
	color: #666;
}

.expense-stat-value {
	font-size: 14rpx;
	font-weight: 600;
	color: #e74c3c;
}

/* 弹窗底部按钮 */
.checkout-modal-footer {
	display: flex;
	gap: 12rpx;
	padding: 16rpx 20rpx;
	background-color: #f8f9fa;
	border-top: 1rpx solid #e9ecef;
}

.checkout-btn-cancel {
	flex: 1;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
	border: 2rpx solid #d0d0d0;
	border-radius: 8rpx;
	cursor: pointer;
	transition: all 0.2s;
}

.checkout-btn-cancel:active {
	background-color: #f5f5f5;
	border-color: #b0b0b0;
}

.checkout-btn-confirm {
	flex: 1;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
	border-radius: 8rpx;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: 0 4rpx 12rpx rgba(25, 118, 210, 0.3);
}

.checkout-btn-confirm:active {
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 6rpx rgba(25, 118, 210, 0.3);
}

.checkout-btn-cancel .btn-text {
	font-size: 15rpx;
	font-weight: 600;
	color: #666;
}

.checkout-btn-confirm .btn-text {
	font-size: 15rpx;
	font-weight: 600;
	color: #ffffff;
}
</style>