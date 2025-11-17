<template>
	<view>
		<view>
		<!-- 左右布局容器 -->
		<view class="layout-container" :style="{ height: scrollHeight + 'px' }">
			<!-- 左侧订单列表 -->
      <scroll-view
        class="scrollArea left-panel"
        scroll-y="true"
        :style="{ height: scrollHeight + 'px' }"
        @scrolltolower="loadMore"
        lower-threshold="100"
        @scroll="onScroll"
      >
        <div style="height: 50rpx" v-if="moduleList.length == 0 && !loading">
          <div style="margin-top: 100rpx; text-align: center">
						<uni-icons custom-prefix="iconfont" type="icon-zanwudingdan" size="40" color="#4c4c4c"></uni-icons>
            <div style="margin-top: 10px; color: #4c4c4c; font-weight: bold">暂无订单</div>
					</div>
				</div>

        <view v-for="item in moduleList" :key="item.id">
          <view
            class="order-item"
            :class="{ 'order-item-selected': selectedOrderId === item.id }"
            :style="{ backgroundColor: item.status == 2 ? '#f5f5f5' : 'white' }"
            @click="showInfo(item)"
          >
						<!-- 状态标签 - 固定在左上角 -->
						<view class="status-badges">
              <view class="status-badge status-modified" v-if="item.status == 5">
								<text class="status-badge-text">已修改</text>
							</view>
              <view class="status-badge status-refunded" v-if="item.status == 2">
								<text class="status-badge-text">作废</text>
							</view>
						</view>

						<!-- 已发单标签 - 固定在右上角 -->
						<view class="sent-badge-top" v-if="item.shareNum > 0">
							<text class="sent-badge">已发单</text>
						</view>

						<!-- 第一行：客户名称、时间、实收金额 -->
						<view class="order-row-first">
							<view class="customer-info">
								<image src="/static/img/common/header.png" class="user-header" />
                <text class="customer-name">{{ item.customName ? item.customName : '散客' }}</text>
							</view>
							<view class="order-time">
                {{ item.createTime.replace('T', ' ') }}
							</view>
							<view class="actual-money">
								实收(元): <text class="money-value">{{ item.actualMoney }}</text>
							</view>
						</view>

						<!-- 第二行：商品列表和下欠金额 -->
						<view class="order-row-second">
							<view class="module-str">{{ item.modulestr }}</view>
							<view class="debt-badge" v-if="item.debt > 0">
								下欠: <text class="debt-value">{{ item.debt }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 加载提示 -->
        <view style="text-align: center; padding: 20rpx; color: #666" v-if="loading">
					<text>加载中...</text>
				</view>
        <view style="text-align: center; padding: 20rpx; color: #999" v-if="!hasMore && moduleList.length > 0">
					<text>没有更多数据了</text>
				</view>
			</scroll-view>

			<!-- 右侧订单详情 -->
			<view class="right-panel" :style="{ height: scrollHeight + 'px' }">
				<view v-if="!showDetail" class="empty-detail">
					<uni-icons type="info-filled" size="60" color="#ccc"></uni-icons>
          <text style="margin-top: 20rpx; color: #999">请选择订单查看详情</text>
				</view>
				<view v-else class="detail-content">
					<view class="detail-header-new">
						<view class="header-left">
							<text class="detail-title-new">订单详情</text>
						</view>
            <view class="header-right">
							<view @click="shareOrder" class="share-order-btn">
								<image src="/static/img/common/editor.png" />
								发单
							</view>
						</view>
					</view>

          <scroll-view scroll-y="true" :style="{ height: scrollHeight - 115 + 'px' }">
						<div class="order-info-grid-compact">
							<!-- 第一行 -->
							<div class="info-row">
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{
                    currentOrder.createTime ? currentOrder.createTime.replace('T', ' ') : ''
                  }}</text>
								</div>
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{
                    currentOrder.accountCode ? currentOrder.accountCode : ''
                  }}</text>
								</div>
							</div>

							<!-- 第二行 -->
							<div class="info-row">
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{
                    currentOrder.customName ? currentOrder.customName : '散客'
                  }}</text>
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

							<!-- 第四行 - 下欠和状态 -->
							<div class="info-row">
                <div class="info-item-new" v-if="currentOrder.debt > 0">
									<text class="info-label-new">下欠:</text>
                  <text class="info-value-new debt-value-new">{{ currentOrder.debt }}</text>
								</div>
                <div class="info-item-status" v-if="currentOrder.status != 1">
									<view class="status-container-flex">
										<view class="status-tag-group">
                      <view class="status-tag status-modified-tag" v-if="currentOrder.status == 5">
												<uni-icons type="compose" size="12" color="#31BDEC"></uni-icons>
												<text class="status-tag-text">已修改</text>
											</view>
                      <view class="status-tag status-refunded-tag" v-if="currentOrder.status == 2">
												<uni-icons type="undo" size="12" color="#F56C6C"></uni-icons>
												<text class="status-tag-text">作废</text>
											</view>
										</view>
                    <u-button
                      v-if="currentOrder.status == 5"
                      class="history-btn-right"
                      type="primary"
                      size="mini"
                      @click="showHistoryOrder(currentOrder)"
                    >
											<uni-icons type="eye" size="12" color="#fff"></uni-icons>
                      <text style="margin-left: 4rpx">查看历史</text>
										</u-button>
									</view>
								</div>
							</div>
						</div>

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

                <div
                  class="table-row table-body-row"
                  v-for="item in currentCardInfo"
                  v-if="item.type != 4"
                  :key="item.id"
                >
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

					<view class="order-action-buttons-compact">
            <u-button
              v-if="currentOrder.status != 2"
              class="action-btn-compact modify-btn-new"
              type="primary"
              @click="TurnToTuigeCashier"
              text="改单"
            >
						</u-button>
            <u-button
              v-if="currentOrder.status != 2"
              class="action-btn-compact refund-btn-new"
              type="primary"
              @click="TuigeOrder"
              text="作废"
            >
						</u-button>
            <u-button
              v-if="currentOrder.debt > 0"
              class="action-btn-compact repay-btn-new"
              type="primary"
              text="整单还款"
              @click="openPayTypeDialogVisible"
            >
						</u-button>
            <u-button
              class="action-btn-compact print-btn-new"
              type="primary"
              text="打印"
              @click="printerModel(currentOrder)"
            >
						</u-button>
					</view>
				</view>
			</view>
		</view>

    <u-modal
      title="整单还款"
      class="payment"
      :show="payTypeDialogVisible"
      :closeOnClickOverlay="true"
      :showConfirmButton="false"
      :width="800"
      @close="payTypeDialogVisible = false"
    >
      <div class="slot-content" style="overflow-y: auto">
				<div class="slot-modal pay-type">
					<div class="body">
						<div class="pay-amount">
							<u--form labelPosition="left" ref="payAamountForm" :labelWidth="120">
								<div class="form-row">
									<div class="right-part">
										<div class="payment-methods">
                      <div
                        :class="{ 'payment-item': true, activepayment: item.select == 1 ? true : false }"
                        v-for="(item, index) in payWay"
                        @click="changPayWay(index)"
                      >
                        <u-icon style="margin-top: 10rpx" :size="40" :name="item.coin" :color="item.color"></u-icon>
                        <span class="payment-text">{{ item.label }}</span>
											</div>
										</div>
									</div>
									<div class="form-container">
										<div
                      style="font-weight: bold; font-size: 15rpx; display: flex; align-items: center; margin-top: 10rpx"
                    >
                      <text style="width: 80rpx; margin-left: 20rpx">还款金额：</text>
                      <input
                        v-model="repayMount"
                        inputmode="none"
                        style="
                          text-align: center;
                          width: 100rpx;
                          font-weight: bold;
                          font-size: 20rpx;
                          border: none;
                          border-bottom: 1px solid black;
                          outline: none;
                          padding: 5rpx;
                          margin-left: 10rpx;
                        "
                      />
										</div>
                    <view
                      class="mybrankmask2"
                      :style="{
                        width: '320rpx',
                        height: '150rpx',
                        zIndex: 999,
                        left: 0,
                        bottom: 0,
                        marginTop: '20rpx',
                      }"
                    >
                      <view style="padding: 5rpx">
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(1)">1</view>
													<view class="maskListItem" @click="NumberCk2(2)">2</view>
													<view class="maskListItem" @click="NumberCk2(3)">3</view>
                          <view class="maskListItem" style="background-color: #67c23a; color: #fff" @click="Tuige2()">
                            退格</view
                          >
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(4)">4</view>
													<view class="maskListItem" @click="NumberCk2(5)">5</view>
													<view class="maskListItem" @click="NumberCk2(6)">6</view>
                          <view
                            class="maskListItem"
                            @click="NumberCk2('+')"
                            style="background-color: #31bdec; font-size: 25px; color: white"
                          >
                            +</view
                          >
													<!-- <view class="maskListItem large"
																style="background-color: #F56C6C;color: #fff;"
																@click="Clear2()">清空</view> -->
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(7)">7</view>
													<view class="maskListItem" @click="NumberCk2(8)">8</view>
													<view class="maskListItem" @click="NumberCk2(9)">9</view>
                          <view
                            class="maskListItem"
                            @click="NumberCk2('-')"
                            style="background-color: #f56c6c; font-size: 25px; color: white"
                          >
                            -</view
                          >
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
            <div style="display: flex; justify-content: center">
              <div
                class="btn"
                @click="payTypeDialogVisible = false"
                style="
                  width: 100rpx;
                  font-weight: bolder;
                  color: white;
                  border: 1px solid darkgray;
                  background: darkgray;
                  box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
                "
              >
                返回
              </div>
              <div
                class="btn"
                @click="repaySingle"
                style="
                  margin-left: 20rpx;
                  width: 100rpx;
                  font-weight: bolder;
                  color: white;
                  border: 1px solid darkgreen;
                  background: darkgreen;
                  box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
                "
              >
                确认还款
              </div>
						</div>
					</div>
				</div>
			</div>
		</u-modal>

		<!-- 历史订单抽屉 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
      <view class="drawer-mask" :class="{ show: showHistoryDrawer }" @tap="closeHistoryDrawer"></view>

			<!-- 抽屉内容 -->
      <view class="drawer-content" :class="{ show: showHistoryDrawer }">
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
          <scroll-view class="history-scroll" :style="{ height: scrollHeight - 100 + 'px' }" scroll-y="true">
						<div class="history-order-list">
              <div
                class="history-order-item"
                v-for="(order, index) in historyOrderList"
                :key="index"
                @click="showOrderDetail(order)"
              >
								<div class="history-order-header">
									<div class="history-order-info">
                    <text class="history-customer-name">{{ order.customName || '散客' }}</text>
                    <text class="history-order-time">{{
                      order.updateTime ? order.updateTime.replace('T', ' ') : ''
											}}</text>
									</div>
									<div class="history-order-amounts">
										<text class="history-total-amount">实收: ¥{{ order.actualMoney || 0 }}</text>
										<text class="history-debt-amount" v-if="order.debt > 0">欠款: ¥{{ order.debt || 0 }}</text>
									</div>
								</div>
								<div class="history-order-detail">
									<div class="history-order-code">
										<text class="history-code-label">订单号:</text>
                    <text class="history-code-value">{{ order.accountCode || '-' }}</text>
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
      <view class="drawer-mask" :class="{ show: showOrderDetailDrawer }" @tap="closeOrderDetailDrawer"></view>

			<!-- 抽屉内容 -->
      <view class="drawer-content" :class="{ show: showOrderDetailDrawer }">
				<!-- 订单详情抽屉 -->
				<div class="order-detail-container" v-if="showOrderDetailDrawer && orderDetailData">
					<!-- 抽屉头部 -->
					<view class="detail-header-new2">
						<view class="header-left">
							<uni-icons type="list" size="18" color="#fff"></uni-icons>
							<text class="detail-title-new">历史订单</text>
						</view>
						<view class="header-right">
							<view class="close-btn" @tap="closeOrderDetailDrawer">
								<uni-icons type="close" size="24" color="#fff"></uni-icons>
							</view>
						</view>
					</view>

          <scroll-view scroll-y="true" :style="{ height: scrollHeight - 115 + 'px' }">
						<!-- 订单概览信息 -->
						<div class="order-info-grid-compact">
							<!-- 第一行 -->
							<div class="info-row">
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{
                    orderDetailData.createTime ? orderDetailData.createTime.replace('T', ' ') : ''
                  }}</text>
								</div>
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{ orderDetailData.accountCode || '-' }}</text>
								</div>
							</div>

							<!-- 第二行 -->
							<div class="info-row">
								<div class="info-item-new">
                  <text class="info-value-new info-value-small">{{ orderDetailData.customName || '散客' }}</text>
								</div>
								<div class="info-item-new">
									<text class="info-label-new">总计金额:</text>
									<text class="info-value-new highlight-value">{{ orderDetailData.payableAmount || 0 }}</text>
								</div>
							</div>

							<!-- 第三行 -->
							<div class="info-row">
								<div class="info-item-new" v-if="orderDetailData.basketOffsetAmount">
									<text class="info-label-new">押筐抵扣:</text>
									<text class="info-value-new">{{ orderDetailData.basketOffsetAmount || 0 }}</text>
								</div>
								<div class="info-item-new">
									<text class="info-label-new">实付金额:</text>
									<text class="info-value-new highlight-value">{{ orderDetailData.actualMoney || 0 }}</text>
								</div>
							</div>

							<!-- 第四行 - 下欠和状态 -->
							<div class="info-row">
								<div class="info-item-new" v-if="orderDetailData.debt > 0">
									<text class="info-label-new">下欠:</text>
									<text class="info-value-new debt-value-new">{{ orderDetailData.debt }}</text>
								</div>
							</div>
						</div>

						<!-- 商品列表 -->
						<div class="product-table-container" v-if="orderDetailData.module && orderDetailData.module.length > 0">
							<div class="product-table">
								<div class="table-row table-header-row">
									<div class="table-header-cell">货品</div>
									<div class="table-header-cell">数量</div>
									<div class="table-header-cell">总重</div>
									<div class="table-header-cell">皮重</div>
									<div class="table-header-cell">单价</div>
									<div class="table-header-cell">小计</div>
								</div>

								<div class="table-row table-body-row" v-for="(item, index) in orderDetailData.module" :key="index">
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
				</div>
			</view>
		</view>
	</view>
    <!-- debug=true 可以看到页面，debug=false 后台渲染 -->
    <OrderImage :orderImageInfo="orderImageInfo" :debug="true" @close="closeOrderImage" />
    <view :prop="canvasImageMsg" :change:prop="canvasImage.updateEcharts"></view>
  </view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import member from '../../api/member/member'
import OrderImage from '@/components/OrderImage/OrderImage.vue'
	export default {
		name: 'OrderMangerIndex',
		components: {
    OrderImage,
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
      CompanyId: '',
				single: '',
				showTimePcker: false,
				showDetail: false,
				currentOrder: {},
				currentCardInfo: [],
				canvasheight: 0,
				canvasWidth: 750,
				canvasHeight: 1000,
				isGeneratingImage: false, // 是否正在生成图片
				scrollHeight: 0,
				checkboxValue: [],
				isEdting: false,
				memberOptions: [],
				currentPayWay: 1,
      beginTime: '',
      endTime: '',
				showHistoryDrawer: false, // 历史订单抽屉显示状态
				historyOrderList: [], // 历史订单列表
      currentOriginOrderId: '', // 当前原始订单ID
				showOrderDetailDrawer: false, // 订单详情抽屉显示状态
				orderDetailData: null, // 订单详情数据
				selectedOrderId: null, // 选中的订单ID
				// 分页相关
				pageSize: 10, // 每页显示的数据量
				currentPage: 1, // 当前页码
				totalCount: 0, // 总数据量
				hasMore: true, // 是否还有更多数据
				loading: false, // 是否正在加载
      payWay: [
        {
          label: '微信支付',
          coin: 'weixin-fill',
						select: 1,
          color: 'green',
          id: 1,
					},
					{
          label: '现金',
          coin: 'red-packet-fill',
						select: 0,
          color: 'red',
          id: 2,
					},
					{
          label: '支付宝',
          coin: 'zhifubao',
						select: 0,
          color: 'blue',
          id: 3,
        },
        {
          label: '其他',
          coin: 'coupon-fill',
						select: 0,
          color: 'red',
          id: 4,
        },
      ],
      canvasImageMsg: null,
      orderImageInfo: null,
			}
		},
		// mounted() {
		// 	// 在组件挂载后设置 scrollHeight

		// },
		mounted() {
    this.scrollHeight = uni.getWindowInfo().windowHeight - 50
    this.CompanyId = uni.getStorageSync('companyId')
    this.getMinTimeToNow()
    this.refresh()
		},
		methods: {
    refresh() {
				// 重置分页和数据
      this.currentPage = 1
      this.hasMore = true
      this.moduleList = []
      this.originalModuleList = []
      this.getMinTimeToNow()
				// 加载第一页数据
      this.loadPageData()
			},
			
			// 加载分页数据
			loadPageData() {
      if (this.loading) return

      this.loading = true
      const currentDate = this.getcurrentTime()
      this.single = currentDate

      cashierOrder
        .GetAccountByCompanyIdandDateRange(
					this.CompanyId, 
					this.beginTime, 
					this.endTime,
					this.pageSize,
					this.currentPage
        )
        .then(res => {
					
					// 兼容不同的返回格式
          let newData = []
          let totalCount = 0
					
					if (res.code === 200 || res.data) {
						// 判断返回的数据结构
						if (Array.isArray(res.data)) {
							// 如果直接返回数组（旧格式，无分页信息）
              newData = res.data
              totalCount = res.data.length
              this.hasMore = false // 无分页信息时，认为没有更多数据
						} else if (res.data && typeof res.data === 'object') {
							// 如果返回对象（新格式，包含分页信息）
              newData = res.data.data || res.data.list || []
              totalCount = res.data.totalCount || res.data.total || res.data.totalElements || 0
						}
						
						// 处理每条数据
						if (newData && newData.length > 0) {
							newData.forEach(item => {
                item.modulestr = ''
								if (item.module) {
									try {
                    var cardList = JSON.parse(item.module)
										cardList.forEach(card => {
											if (card.type === 1 || card.type === 3) {
                        let modulesStr = []
												if (card.type === 1 || card.type === 3) {
                          modulesStr.push(card.name + 'x' + card.mount)
												}
                        item.modulestr = modulesStr.join('|')
											}
										})
									} catch (e) {
                    console.error('解析module数据失败:', e)
									}
								}
							})
							
							// 数据按时间降序排序
							newData.sort((a, b) => {
                return new Date(b.createTime) - new Date(a.createTime)
              })
							
							// 追加到原始列表
              this.originalModuleList = [...this.originalModuleList, ...newData]
							
						// 计算是否还有更多数据
						if (totalCount > 0) {
                this.hasMore = this.originalModuleList.length < totalCount
						} else {
							// 如果没有总数信息，根据返回的数据量判断
                this.hasMore = newData.length >= this.pageSize
						}
						
						} else {
              this.hasMore = false
						}
						
						// 应用当前筛选
            this.applyFilter()
					} else {
            this.hasMore = false
					}
        })
        .catch(err => {
          console.error('加载数据失败:', err)
					uni.showToast({
						title: '加载失败',
            icon: 'none',
          })
          this.hasMore = false
        })
        .finally(() => {
          this.loading = false
        })
			},
			
			// 滚动事件监听（用于调试）
			onScroll(e) {
				// 可以通过这个方法监听滚动位置
				// console.log("滚动中:", e.detail);
			},
			
			// 加载更多数据（滚动到底部时触发）
			loadMore() {
				if (!this.hasMore || this.loading) {
        return
      }
      this.currentPage++
      this.loadPageData()
			},
			// 获取从最小时间到当前时间的时间范围
			getMinTimeToNow() {
      const now = new Date()
				
				// 设置最小时间（可以根据需求修改，这里设置为2020-01-01 00:00:00）
      const minTime = new Date('2020-01-01 00:00:00')
				
				// 格式化成 "YYYY-MM-DD HH:mm:ss"（使用本地时间）
      const formatDateTime = date => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      this.beginTime = formatDateTime(minTime) // 例如 "2020-01-01 00:00:00"
      this.endTime = formatDateTime(now) // 当前时间，例如 "2025-10-15 14:30:25"
			},
			
			// 保留原来的今日时间范围方法（如果需要可以调用）
			getTodayDateRange() {
				// 获取当前本地时间
      const now = new Date()

				// 设置当天的 00:00:01 和 23:59:59（本地时间）
      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 1, 0) // 设置为 00:00:01

      const todayEnd = new Date(now)
      todayEnd.setHours(23, 59, 59, 999) // 设置为 23:59:59

				// 格式化成 "YYYY-MM-DD HH:mm:ss"（使用本地时间）
      const formatDateTime = date => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }

      this.beginTime = formatDateTime(todayStart) // 例如 "2025-09-26 00:00:01"
      this.endTime = formatDateTime(todayEnd) // 例如 "2025-09-26 23:59:59"
			},
			openPayTypeDialogVisible() {
      this.payTypeDialogVisible = true
      this.repayMount = this.currentOrder.debt
			},
			Tuige2() {
      let myvalue = ''
      myvalue = this.repayMount

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
        return
				}
      myvalue = myvalue ? myvalue.toString() : ''
				// 回退一个字符
      myvalue = myvalue.slice(0, -1) // 去掉最后一个字符
				// 更新数据模型
      this.repayMount = myvalue
			},
			Clear2() {
				// 根据 custominputFocusIndex 清空对应的值
      this.repayMount = '0'
			},
			NumberCk2(val) {
      let myvalue = this.repayMount
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
          return
        }
      }
      var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue
      myvalue = txt + val.toString()
      this.repayMount = myvalue
			},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
        this.payWay[i].select = 0
				}
      this.payWay[index].select = 1
      this.currentPayWay = this.payWay[index].id
			},
			repaySingle() {
				var repayOrder = JSON.parse(JSON.stringify(this.currentOrder))
      repayOrder.payWay = this.currentPayWay
      var moduleSelect = [repayOrder]

      var userInfo = uni.getStorageSync('userInfo')
      var CompanyId = uni.getStorageSync('companyId')
				let param = {
					customerId: repayOrder.customerId,
					repayMoney: this.repayMount,
					orderList: moduleSelect,
					operatorId: userInfo.idateChangeCompanyId,
        customerName: repayOrder.customName,
				}
				member.RepayDebts(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						uni.showToast({
            title: '还款成功',
            icon: 'none',
            duration: 2000,
          })
          this.payTypeDialogVisible = false
          this.refresh()
					} else {
						uni.showToast({
            title: '还款失败',
            icon: 'none',
            duration: 2000,
          })
					}
				})
			},
			memberChange() {
      this.memberOptions = []
      member
        .GetmemberListByCompanyIdPage({ Id: this.CompanyId, pageSize: 10, currentPage: 1 })
        .then(res => {
					this.memberOptions.push({
            customName: '散客',
            id: '',
					})
					// 适配分页结果格式
          const memberList = res.data.Data || res.data.data || []
          this.memberOptions.push(...memberList)
					this.memberDialogVisible = true
        })
        .finally(() => {})
			},
			orderMemberChangeMain(memberNew, order) {
      var orderNew = JSON.parse(JSON.stringify(order))
      orderNew.customerId = memberNew.id
      orderNew.customName = memberNew.customName
				cashierOrder.exchangMember(JSON.stringify(orderNew)).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '客户变更成功',
            icon: 'none',
						})
          this.dateChange()
          this.memberDialogVisible = false
					}
      })
			},
			showInfo(e) {
      this.showDetail = true
      this.currentOrder = e
      this.selectedOrderId = e.id // 设置选中的订单ID
      this.currentCardInfo = JSON.parse(e.module)
      this.currentCardInfo = this.currentCardInfo.filter(item => item.type !== 4).sort((a, b) => a.type - b.type)
			},
			dateChange(beginTime, endTime) {
				// 如果日期为空，使用最小时间到当前时间的范围
				if (!beginTime || !endTime) {
        this.getMinTimeToNow()
				} else {
        this.beginTime = beginTime
        this.endTime = endTime
				}
      this.refresh()
			},
			// 筛选功能相关方法
			filterChange(filterType) {
      this.currentFilterType = filterType
      this.applyFilter()
			},
			applyFilter() {
				if (!this.originalModuleList) {
        return
				}
				
      let filteredList = [...this.originalModuleList]
				
				switch (this.currentFilterType) {
					case 'debt':
						// 筛选有欠款的订单（下欠金额大于0）
          filteredList = filteredList.filter(item => item.debt > 0)
          break
					case 'sent':
						// 筛选已发单的订单（shareNum > 0）
          filteredList = filteredList.filter(item => item.shareNum > 0)
          break
					case 'unsent':
						// 筛选未发单的订单（shareNum === 0 或者 undefined）
          filteredList = filteredList.filter(item => !item.shareNum || item.shareNum === 0)
          break
					case 'all':
					default:
						// 显示全部订单
          break
				}
				
      this.moduleList = filteredList
			},
			checkboxChange(e) {
				this.checkboxValue = [e]
			},
    showHistoryOrder(item) {
				// 设置当前原始订单ID和订单ID
      this.currentOriginOrderId = item.originOrderId || item.id
				
				// 调用API获取历史订单
      this.loadHistoryOrders(this.currentOriginOrderId, item.id)
				
				// 显示抽屉
      this.showHistoryDrawer = true
			},
			
			// 加载历史订单数据
			loadHistoryOrders(originOrderId, orderId) {
				
      cashierOrder
        .GetOriginOrderId(originOrderId, orderId)
        .then(res => {
					if (res.code === 200) {
            let historyData = res.data || []
						// 按照updateTime降序排序
						historyData.sort((a, b) => {
              const timeA = a.updateTime || a.createTime || ''
              const timeB = b.updateTime || b.createTime || ''
              return new Date(timeB) - new Date(timeA)
            })
            this.historyOrderList = historyData
					} else {
            console.error('获取历史订单失败:', res.message)
            this.historyOrderList = []
						uni.showToast({
							title: '获取历史订单失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          console.error('获取历史订单异常:', error)
          this.historyOrderList = []
					uni.showToast({
						title: '网络异常',
            icon: 'none',
          })
        })
			},
			
			// 关闭历史订单抽屉
			closeHistoryDrawer() {
      this.showHistoryDrawer = false
      this.historyOrderList = []
      this.currentOriginOrderId = ''
			},
			
			// 格式化订单时间
			formatOrderTime(timeStr) {
      if (!timeStr) return ''
      return timeStr.replace('T', ' ').substring(0, 16)
			},
			
			// 获取订单状态文本
			getOrderStatusText(status) {
      switch (status) {
        case 1:
          return '正常'
        case 2:
          return '作废'
        case 4:
          return '已修改'
        default:
          return '未知'
				}
			},
			
			// 获取订单状态样式类
			getOrderStatusClass(status) {
      switch (status) {
        case 1:
          return 'status-normal'
        case 2:
          return 'status-refund'
        case 5:
          return 'status-modified'
        default:
          return 'status-unknown'
				}
			},
			
			// 显示订单详情
			showOrderDetail(order) {
				// 获取订单详细信息
      this.loadOrderDetail(order.id)
			},
			
			// 加载订单详情数据
			loadOrderDetail(orderId) {
				
      cashierOrder
        .GetOrderByAccountId(orderId)
        .then(res => {
					if (res.code === 200 || res.data) {
            this.orderDetailData = res.data
						// 解析商品数据
						if (this.orderDetailData.module && typeof this.orderDetailData.module === 'string') {
							try {
                this.orderDetailData.module = JSON.parse(this.orderDetailData.module)
							} catch (error) {
                console.error('解析商品数据失败:', error)
                this.orderDetailData.module = []
							}
						}
						// 过滤掉type为4的项目，并按type排序
						if (this.orderDetailData.module && Array.isArray(this.orderDetailData.module)) {
							this.orderDetailData.module = this.orderDetailData.module
								.filter(item => item.type !== 4)
                .sort((a, b) => a.type - b.type)
						}
						
            console.log('订单详情数据:', this.orderDetailData)
            this.showOrderDetailDrawer = true
					} else {
            console.error('获取订单详情失败:', res.message)
						uni.showToast({
							title: '获取订单详情失败',
              icon: 'none',
            })
					}
        })
        .catch(error => {
          console.error('获取订单详情异常:', error)
					uni.showToast({
						title: '网络异常',
            icon: 'none',
          })
        })
			},
			
			// 关闭订单详情抽屉
			closeOrderDetailDrawer() {
      this.showOrderDetailDrawer = false
      this.orderDetailData = null
			},
			deleteHandle() {
				if (!this.isEdting || this.checkboxValue.length == 0) {
					return
				}
      let that = this
				uni.showModal({
					title: '提示',
					content: '您确定要删除该订单吗？',
        success: res => {
						if (res.confirm) {
            var isflag = false
							that.checkboxValue.forEach(item => {
								that.moduleList.forEach(item2 => {
									if (item2.id == item) {
										if (item2.debt > 0) {
                    isflag = true
										}
									}
								})
							})
							if (isflag) {
								uni.showToast({
									title: '下欠订单不可删除',
                icon: 'none',
              })
              return
            }

            var order = that.moduleList.filter(x => x.id == that.checkboxValue[0])[0]
            order.companyId = this.CompanyId
            var userInfo = uni.getStorageSync('userInfo')
            order.operatorId = userInfo.id
            order.operatorName = userInfo.userName
            cashierOrder
              .deleteOrder(JSON.stringify(order))
              .then(res => {
								uni.showToast({
									title: '删除成功',
                  icon: 'none',
                })
                that.getModuleListbyDate(that.single)
              })
              .finally(() => {
                that.checkboxValue = []
							})
						} else if (res.cancel) {
						}
        },
      })
			},

			getLastTime() {
      const currentDate = new Date()

				// 获取前一天
      currentDate.setDate(currentDate.getDate() - 1)

				// 格式化日期
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 月份从0开始
      const day = String(currentDate.getDate()).padStart(2, '0')

				// 拼接成 YYYY-MM-DD 格式
      const formattedDate = `${year}-${month}-${day}`
      return formattedDate
			},
	shareOrder() {
		// 防止重复点击
		if (this.isGeneratingImage) {
			uni.showToast({
          title: '单据正在生成中，请稍候...',
          icon: 'none',
        })
        return
		}
		
		// 显示加载提示
		uni.showLoading({
        title: '正在生成单据...',
        mask: true,
      })
		
		// 使用canvas生成订单详情图片
      this.generateOrderImage()
	},
		
	// 使用canvas生成订单详情图片（参照票据样式）
	generateOrderImage() {
      this.isGeneratingImage = true
      const order = this.currentOrder
      const products = this.currentCardInfo || []
		
		// 获取公司信息
      const companyName = uni.getStorageSync('companyName') || ''
      const companyAddress = uni.getStorageSync('address') || ''
      const companyPhone = uni.getStorageSync('contact') || ''
      const marketName = uni.getStorageSync('marketName') || ''

      this.orderImageInfo = {
        companyName,
        companyAddress,
        companyPhone,
        order,
        products,
        marketName,
      }
      this.generateHandle()
    },
		
		// 更新发单次数
		updateShareCount() {
			if (!this.currentOrder || !this.currentOrder.id) {
        return
			}
			
			// 调用API更新发单次数
			cashierOrder.updateShareNum(this.currentOrder.id).then(res => {
				if (res.code === 200) {
					// 更新本地订单的shareNum
					if (this.currentOrder.shareNum) {
            this.currentOrder.shareNum += 1
					} else {
            this.currentOrder.shareNum = 1
					}
					// 更新列表中对应订单的shareNum
          const orderIndex = this.moduleList.findIndex(item => item.id === this.currentOrder.id)
					if (orderIndex !== -1) {
            this.$set(this.moduleList[orderIndex], 'shareNum', this.currentOrder.shareNum)
					}
				}
      })
		},
		
		// 直接分享图片（不保存到相册）
		saveAndShareImage(tempFilePath) {
      this.shareImage(tempFilePath)
    },
    downLoadImage(base64) {
      let that = this
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        base64,
        function () {
          const url = '_doc/' + new Date().getTime() + '.png' // url为时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true, // 是否覆盖
              quality: 100, // 图片清晰度
            },
            i => {
              // 直接使用临时图片路径分享，不保存到相册
              that.shareImage(url)
              bitmap.clear()
            },
            e => {
			                     uni.showToast({
                title: '图片处理失败',
                icon: 'none',
			                     })
			                     bitmap.clear()
			                 }
          )
        },
        e => {
			             uni.showToast({
            title: '图片处理失败',
            icon: 'none',
			              })
			              bitmap.clear()
        }
      )
			},
			shareImage(tempFilePath) {
				uni.share({
					provider: 'weixin',
					type: 2, // 图片类型
					scene: 'WXSceneSession', // 分享到聊天界面
					imageUrl: tempFilePath, // 只分享这张图片的地址
					success(res) {
          uni.showToast({
            title: '分享成功',
            icon: 'success',
          })
					},
					fail(err) {
          uni.showToast({
            title: '分享失败',
            icon: 'none',
          })
        },
      })
			},
			
			printerModel(order) {
      getApp().senBleLabel(order)
			},
			getcurrentTime() {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 月份从0开始
      const day = String(currentDate.getDate()).padStart(2, '0')
      const hours = String(currentDate.getHours()).padStart(2, '0')
      const minutes = String(currentDate.getMinutes()).padStart(2, '0')
      const seconds = String(currentDate.getSeconds()).padStart(2, '0')

      const formattedDate = `${year}-${month}-${day} `
      return formattedDate
    },
    TurnToTuigeCashier() {
				uni.navigateTo({
        url: '/pages/cashier/tuigeCashier?order=' + JSON.stringify(this.currentOrder),
				})
			},
    TuigeOrder() {
      let that = this
				uni.showModal({
					title: '提示',
					content: '您确定要退单吗？',
        success: res => {
						if (res.confirm) {
            that.TuigeOrderAction()
          }
        },
      })
    },
    TuigeOrderAction() {
      var userInfo = uni.getStorageSync('userInfo')
				let param = {
        type: 10,
        companyId: this.CompanyId,
        operatorId: userInfo.id,
        operatorName: userInfo.userName,
        content: this.currentOrder.id,
      }
      cashierOrder.TuigeAccount(JSON.stringify(param)).then(res => {
        if (res.code == 200) {
						uni.showToast({
							title: '退单成功',
            icon: 'none',
          })
          this.refresh()
        }
      })
    },
    // 生成图片后的回调函数
    receiveRenderData(base64) {
      this.canvasImageMsg = null
      // 重置生成状态
      this.isGeneratingImage = false
      // 清空订单信息（下次生成时会重新设置）
      this.orderImageInfo = null
      // 隐藏加载提示
      uni.hideLoading()
      // 更新发单次数
      this.updateShareCount()
      // 保存并分享图片
      this.downLoadImage(base64)
    },
    // 触发生成图片事件
    generateHandle() {
      this.canvasImageMsg = 'generate'
    },
    // 关闭订单图片预览（debug 模式下使用）
    closeOrderImage() {
      this.orderImageInfo = null
      this.isGeneratingImage = false
      uni.hideLoading()
    },
  },
}
</script>
<script lang="renderjs" module="canvasImage">
import html2canvas from 'html2canvas'
export default {
  methods: {
    generateImage(callback) {
			// 使用html2canvas 转换html为canvas 克隆解决的问题：html2canvas只能给屏幕可视范围之内的元素生成图片
      // 获取节点高度，后面为克隆节点设置高度。
      var height = document.querySelector('#orderImage').offsetHeight
      // 克隆节点，默认为false，不复制方法属性，为true是全部复制。
      var cloneDom = document.querySelector('#orderImage').cloneNode(true);
      cloneDom.style.zIndex = '-1';
      // 将克隆节点动态追加到body后面。
      document.querySelector('body').append(cloneDom)
      // 插件生成base64img图片。
      html2canvas(cloneDom, {
				useCORS: true,
				scrollY: 0,
				scrollX: 0,
				logging: false,
				ignoreElements: (e) => {
					if (
              e.contains(cloneDom) ||
              cloneDom.contains(e) ||
							e.tagName === 'STYLE'
            ) {
              return false;
            }
            return true;
				},
			}).then(function(canvas) {
        const imgUri = canvas.toDataURL('image/png')
				callback&&callback(imgUri);
      })		
			document.querySelector('body').removeChild(cloneDom)				
    },
    updateEcharts(newValue, oldValue, ownerInstance, instance) {
      // 监听 service 层数据变更
      if(newValue){
        this.generateImage((base64)=>{
          ownerInstance.callMethod('receiveRenderData', base64);
        })
      }
    }
		}
	}
</script>

<style lang="scss">
	/* 左右布局容器 */
	.layout-container {
		display: flex;
		justify-content: space-between;
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	
	/* 左侧订单列表面板 - 固定宽度 */
	.left-panel {
		padding: 5rpx 0rpx;
		flex: 0 0 50%;
		width: 50%;
		min-width: 50%;
		max-width: 50%;
		padding-left: 10rpx;
		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;
	}
	
	/* 右侧订单详情面板 - 固定宽度 */
	.right-panel {
		flex: 0 0 49%;
		width: 49%;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-sizing: border-box;
	}
	
	/* 订单项基础样式 */
	.order-item {
		width: 100%;
		min-height: 50rpx;
		background-color: white;
		margin-bottom: 8rpx;
		margin-top: 4rpx;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2rpx solid transparent;
		position: relative;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.08);
	}
	
	/* 状态标签容器 - 固定在左上角 */
	.status-badges {
		position: relative;
		top: 0;
		left: 0;
		display: flex;
		gap: 5rpx;
		z-index: 10;
	}
	
	/* 已发单标签容器 - 固定在右上角 */
	.sent-badge-top {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
	}
	
	/* 状态标签通用样式 */
	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 3rpx;
		padding: 2rpx 8rpx;
		border-radius: 0 0 6rpx 0;
		font-size: 12rpx;
		font-weight: 600;
		color: white;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.12);
		animation: badge-slide-in 0.3s ease;
	}
	
	@keyframes badge-slide-in {
		from {
			opacity: 0;
			transform: translate(-10rpx, -10rpx);
		}
		to {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
	
	.status-badge-text {
		font-size: 8rpx;
		font-weight: 500;
		line-height: 1;
	}
	
	/* 已修改标签 */
	.status-modified {
  background: linear-gradient(135deg, #31bdec, #2a9fd6);
	}
	
	/* 退单标签 */
	.status-refunded {
  background: linear-gradient(135deg, #f56c6c, #e54d4d);
	}
	
	/* 第一行样式 */
	.order-row-first {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 8rpx;
	}
	
	.customer-info {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 4rpx;
		min-width: 0;
		.user-header {
			width: 10rpx;
			height: 10rpx;
		}
	}
	
	.customer-name {
		font-weight: bold;
		color: #333;
		font-size: 13rpx;
	}
	
	.order-time {
		flex: 2;
		text-align: left;
		padding-left: 8rpx;
		font-size: 12rpx;
		color: #666;
		display: flex;
		align-items: center;
		gap: 6rpx;
	}
	
	.sent-badge {
		display: inline-flex;
		align-items: center;
  background-color: #67c23a;
		color: white;
		padding: 2rpx 6rpx;
		border-radius: 8rpx;
		font-size: 10rpx;
		font-weight: 500;
		white-space: nowrap;
	}
	
	.actual-money {
		flex: 1;
		text-align: right;
		font-size: 12rpx;
		color: #666;
		white-space: nowrap;
	}
	
	.money-value {
		font-weight: bold;
		color: #333;
		font-size: 13rpx;
	}
	
	/* 第二行样式 */
	.order-row-second {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 8rpx;
  padding: 0 8rpx 8rpx 8rpx;
	}
	
	.module-str {
		flex: 1;
		color: #999;
		font-size: 11rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
		max-width: 50%;
	}
	
	.debt-badge {
		display: inline-flex;
		align-items: center;
		background: linear-gradient(135deg, #ff4757, #ff3838);
		color: white;
		padding: 3rpx 8rpx;
		border-radius: 4rpx;
		font-size: 11rpx;
		font-weight: 600;
		white-space: nowrap;
		box-shadow: 0 2rpx 6rpx rgba(255, 71, 87, 0.3);
		animation: debt-pulse 2s ease-in-out infinite;
	}
	
	@keyframes debt-pulse {
  0%,
  100% {
			box-shadow: 0 2rpx 6rpx rgba(255, 71, 87, 0.3);
		}
		50% {
			box-shadow: 0 2rpx 10rpx rgba(255, 71, 87, 0.5);
		}
	}
	
	.debt-value {
		font-weight: bold;
		font-size: 12rpx;
	}
	
	/* 订单项悬停样式 */
	.order-item:hover {
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
		transform: translateY(-1rpx);
	}
	
	/* 订单项选中样式 */
	.order-item-selected {
		border: 2rpx solid $zn-theme-color !important;
		background-color: #e3f2fdc2 !important;
		box-shadow: 0 1rpx 8rpx #5dcdfd97 !important;
	}
	
	/* 空状态样式 */
	.empty-detail {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #999;
	}
	
	/* 详情内容 */
	.detail-content {
		display: flex;
		flex-direction: column;
		height: 96%;
		background-color: white;
		border-radius: 4rpx;
		padding: 10rpx;
		margin-top: 8rpx;
	}
	
	/* 详情头部 */
	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #3498db, #2980b9);
		border-radius: 8rpx;
		margin-bottom: 10rpx;
	}
	
	.detail-title {
		font-size: 26rpx;
		font-weight: bold;
		color: white;
	}
	
	/* 新的详情头部样式 */
	.detail-header-new {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 6rpx;
		margin-bottom: 5rpx;
	}

	/* 新的详情头部样式2 */
	.detail-header-new2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 12rpx;
		background: orange;
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
		color: $zn-font-color-leve1;
		letter-spacing: 0.5rpx;
	}
	
	.header-right {
		display: flex;
		align-items: center;
	}
	
	.share-order-btn {
		width: 60rpx;
		height: 24rpx;
		font-size: 12rpx;
		font-weight: 600;
		background: $zn-theme-color;
		border-radius: 30rpx;
		transition: all 0.3s ease !important;
		color: #ffffff;
		display: flex;
		line-height: 24rpx;
		justify-content: center;
		align-items: center;
		image {
			width: 12rpx;
			height: 12rpx;
			margin-right: 4rpx;
		}
	}
	
	/* 测试按钮样式（临时调试用） */
	.test-canvas-btn {
		width: 50rpx;
		height: 24rpx;
		font-size: 12rpx;
		font-weight: 600;
		background: #ff9800;
		border-radius: 30rpx;
		transition: all 0.3s ease !important;
		color: #ffffff;
		display: flex;
		line-height: 24rpx;
		justify-content: center;
		align-items: center;
	}
	
	/* 订单信息网格布局 */
	.order-info-grid {
		padding: 15rpx;
		background-color: #f8f9fa;
		border-radius: 8rpx;
		margin-bottom: 15rpx;
	}
	
	/* 紧凑的订单信息网格 */
	.order-info-grid-compact {
		padding: 8rpx 8rpx 4rpx 8rpx;
		background-color: #f8f9fa;
		border-radius: 4rpx;
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
		font-size: 14rpx;
		font-weight: 600;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	/* 缩小的文字样式 */
	.info-value-small {
		font-size: 12rpx !important;
		font-weight: 500 !important;
	}
	
	.highlight-value {
		color: $zn-main-act-color;
		font-size: 15rpx;
		font-weight: bold;
	}
	
	.debt-value-new {
  color: #f56c6c;
		font-size: 15rpx;
		font-weight: bold;
	}
	
	.status-wrapper {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	/* 状态项容器 */
	.info-item-status {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: white;
		padding: 10rpx 12rpx;
		border-radius: 6rpx;
  border-left: 3rpx solid #4a90e2;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		min-width: 0;
		width: 100%;
	}
	
	/* 紧凑模式下的状态项 */
	.order-info-grid-compact .info-item-status {
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
  border-left: 2rpx solid #4a90e2;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
	}
	
	.status-container {
		display: flex;
		align-items: center;
		gap: 10rpx;
		flex-wrap: wrap;
		width: 100%;
	}
	
	/* 左右分布的状态容器 */
	.status-container-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		flex: 1;
		gap: 10rpx;
	}
	
	/* 状态标签组 */
	.status-tag-group {
		display: flex;
		align-items: center;
		gap: 8rpx;
		flex: 0 0 auto;
	}
	
	/* 状态标签样式 - 更像标签而不是按钮 */
	.status-tag {
		display: inline-flex;
		align-items: center;
		gap: 4rpx;
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
		font-size: 12rpx;
		font-weight: 500;
		border: 1rpx solid;
		background-color: transparent;
		white-space: nowrap;
		transition: all 0.3s ease;
	}
	
	.status-tag-text {
		line-height: 1;
	}
	
	/* 已修改标签 - 蓝色边框 */
	.status-modified-tag {
  color: #31bdec;
  border-color: #31bdec;
		background-color: rgba(49, 189, 236, 0.08);
	}
	
	/* 退单标签 - 红色边框 */
	.status-refunded-tag {
  color: #f56c6c;
  border-color: #f56c6c;
		background-color: rgba(245, 108, 108, 0.08);
	}
	
	/* 状态徽章详情页样式 */
	.status-badge-detail {
		display: inline-flex;
		align-items: center;
		gap: 5rpx;
		padding: 6rpx 12rpx;
		border-radius: 6rpx;
		font-size: 13rpx;
		font-weight: 600;
		color: white;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
		white-space: nowrap;
	}
	
	.status-text-detail {
		line-height: 1;
	}
	
	.status-modified-detail {
  background: linear-gradient(135deg, #31bdec, #2a9fd6);
	}
	
	.status-refunded-detail {
  background: linear-gradient(135deg, #f56c6c, #e54d4d);
	}
	
	/* 查看历史按钮 */
	.history-btn {
		min-width: 100rpx !important;
		height: 30rpx !important;
		font-size: 12rpx !important;
		font-weight: 600 !important;
  background: linear-gradient(135deg, #409eff, #3a8ee6) !important;
		border: none !important;
		border-radius: 5rpx !important;
		box-shadow: 0 2rpx 6rpx rgba(64, 158, 255, 0.3) !important;
		transition: all 0.3s ease !important;
		display: inline-flex !important;
		align-items: center !important;
		justify-content: center !important;
		gap: 4rpx !important;
	}
	
	.history-btn:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 10rpx rgba(64, 158, 255, 0.4) !important;
	}
	
	/* 右对齐的查看历史按钮 - 更小更紧凑 */
	.history-btn-right {
		width: 90rpx !important;
		min-width: 90rpx !important;
		max-width: 90rpx !important;
		height: 26rpx !important;
		font-size: 11rpx !important;
		font-weight: 600 !important;
  background: linear-gradient(135deg, #409eff, #3a8ee6) !important;
		border: none !important;
		border-radius: 4rpx !important;
		box-shadow: 0 1rpx 4rpx rgba(64, 158, 255, 0.25) !important;
		transition: all 0.3s ease !important;
		display: inline-flex !important;
		align-items: center !important;
		justify-content: center !important;
		gap: 3rpx !important;
		flex-shrink: 0 !important;
		margin-left: auto !important;
	}
	
	.history-btn-right:hover {
		transform: translateY(-1rpx);
		box-shadow: 0 2rpx 8rpx rgba(64, 158, 255, 0.35) !important;
  background: linear-gradient(135deg, #3a8ee6, #3376c5) !important;
	}
	
	.history-btn-right:active {
		transform: translateY(0);
		box-shadow: 0 1rpx 3rpx rgba(64, 158, 255, 0.2) !important;
	}
	
	.status-text-modified {
  color: #31bdec;
		font-size: 13rpx;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.status-text-refunded {
  color: #f56c6c;
		font-size: 13rpx;
		font-weight: 600;
	}
	
	.history-link {
  background-color: #31bdec;
		color: white;
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
		font-size: 12rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		white-space: nowrap;
	}
	
	.history-link:hover {
  background-color: #2a9fd6;
		transform: translateY(-1rpx);
	}
	
	.scrollArea {
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
		padding: 12rpx;
		background-color: #e9e9e9;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
		height: 100%;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8rpx 12rpx;
		background: orange;
		color: white;
		border-radius: 6rpx;
		margin-bottom: 10rpx;
	}

	.history-title {
		display: flex;
		align-items: center;
		gap: 6rpx;
	}

	.history-title-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24rpx;
		height: 24rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}

	.history-title-text {
		font-size: 20rpx;
		font-weight: bold;
		color: white;
	}

	.history-summary {
		display: flex;
		align-items: center;
	}

	.history-summary-text {
		font-size: 18rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.history-scroll {
		height: 100%;
	}

	.history-order-list {
		padding-bottom: 10rpx;
	}

	.history-order-item {
		background: white;
		border-radius: 6rpx;
		margin-bottom: 8rpx;
		padding: 10rpx 12rpx;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
		border-left: 2rpx solid orange;
		transition: all 0.2s ease;
	}

	.history-order-item:hover {
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
		transform: translateY(-1rpx);
		cursor: pointer;
	}

	.history-order-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 6rpx;
	}

	.history-order-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.history-customer-name {
		font-size: 20rpx;
		font-weight: bold;
		color: #333;
	}

	.history-order-time {
		font-size: 16rpx;
		color: #999;
	}

	.history-order-amounts {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 3rpx;
	}

	.history-total-amount {
		font-size: 18rpx;
		color: #333;
		font-weight: bold;
	}

	.history-debt-amount {
		font-size: 16rpx;
		color: #e74c3c;
		font-weight: bold;
	}

	.history-order-detail {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6rpx;
		padding-top: 6rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.history-order-code {
		display: flex;
		align-items: center;
		gap: 4rpx;
	}

	.history-code-label {
		font-size: 16rpx;
		color: #999;
	}

	.history-code-value {
		font-size: 16rpx;
		color: #666;
		font-family: monospace;
	}

	.history-order-status {
		display: flex;
		align-items: center;
	}

	.history-status-tag {
		padding: 2rpx 6rpx;
		border-radius: 8rpx;
		font-size: 14rpx;
		font-weight: 500;
		color: white;
	}

	.history-status-tag.status-normal {
  background-color: #67c23a;
	}

	.history-status-tag.status-refund {
  background-color: #f56c6c;
	}

	.history-status-tag.status-modified {
  background-color: #31bdec;
	}

	.history-status-tag.status-unknown {
		background-color: #909399;
	}

	.history-status-text {
		font-size: 14rpx;
	}

	.history-order-items {
		padding-top: 6rpx;
		border-top: 1rpx solid #f8f9fa;
	}

	.history-items-text {
		font-size: 16rpx;
		color: #999;
		line-height: 1.4;
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
		padding: 40rpx 20rpx;
		text-align: center;
	}

	.history-empty-icon {
		margin-bottom: 10rpx;
	}

	.history-empty-text {
		font-size: 18rpx;
		color: #bdc3c7;
		font-weight: 400;
	}

	/* 订单详情抽屉样式 */
	.order-detail-container {
		background-color: #fff;
		height: 100%;
		display: flex;
		flex-direction: column;
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
	
	/* 新的操作按钮容器 - 自适应布局 */
	.order-action-buttons-new {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		padding: 12rpx 10rpx;
		gap: 12rpx;
		background-color: #f8f9fa;
		border-radius: 8rpx;
		flex-wrap: wrap;
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
		
		:deep(.u-button) {
			font-size: 30rpx !important;
		}
		
		:deep(.u-button__text) {
			font-size: 30rpx !important;
		}
	}
	
	/* 新的按钮基础样式 - 自适应宽度 */
	.action-btn-new {
		flex: 1;
		min-width: 80rpx !important;
		height: 38rpx !important;
		font-size: 15rpx !important;
		font-weight: 600 !important;
		border-radius: 6rpx !important;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1) !important;
		transition: all 0.3s ease !important;
		border: none !important;
	}
	
	/* 紧凑模式按钮 */
	.action-btn-compact {
		flex: 1;
		min-width: 70rpx !important;
		height: 32rpx !important;
		font-size: 30rpx !important;
		font-weight: 600 !important;
		border-radius: 5rpx !important;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08) !important;
		transition: all 0.3s ease !important;
		border: none !important;
	}
	
	.action-btn-new:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2) !important;
	}
	
	.action-btn-compact:hover {
		transform: translateY(-1rpx);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15) !important;
	}
	
	.action-btn-new:active {
		transform: translateY(0);
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.15) !important;
	}
	
	.action-btn-compact:active {
		transform: translateY(0);
		box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1) !important;
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
	
	/* 新改单按钮 */
	.modify-btn-new {
		background: $zn-main-purple-color;
		color: white !important;
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
	
	/* 新退单按钮 */
	.refund-btn-new {
  background: linear-gradient(135deg, #909399, #7d7e82) !important;
		color: white !important;
	}
	
	.refund-btn-new:hover {
  background: linear-gradient(135deg, #7d7e82, #6a6b6f) !important;
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
	
	/* 新整单还款按钮 */
	.repay-btn-new {
  background: linear-gradient(135deg, #f56c6c, #e54d4d) !important;
		color: white !important;
	}
	
	.repay-btn-new:hover {
  background: linear-gradient(135deg, #e54d4d, #d43838) !important;
	}

	/* 打印按钮 */
	.print-btn {
		background: linear-gradient(135deg, #27ae60, #229954) !important;
		border-color: #27ae60 !important;
		color: white !important;
	}
	
	/* 新打印按钮 */
	.print-btn-new {
		background: $zn-main-act-color !important;
		color: white !important;
	}
	
	/* 产品表格容器 - 自适应宽度 */
	.product-table-container {
		width: 100%;
		margin: 15rpx 0;
		box-sizing: border-box;
		border-radius: 4rpx;
	}
	
	/* 紧凑模式下的表格容器 */
	.order-info-grid-compact ~ .product-table-container {
		margin: 8rpx 0;
	}
	
	.product-table {
		width: 100%;
		background-color: white;
	
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}
	
	/* 紧凑模式下的表格 */
	.order-info-grid-compact ~ .product-table-container .product-table {
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
	
	/* 产品表格行样式 - 使用flex布局 */
	.product-table .table-row {
		display: flex;
		width: 100%;
		border-bottom: 1rpx solid #e4e7ed;
	}
	
	.product-table .table-row:last-child {
		border-bottom: none;
	}

	.table-cell {
		display: table-cell;
		border: 1px solid #dddddd;
		padding: 8px;
		text-align: left;
	}
	
	/* 产品表格单元格样式 - flex均分宽度 */
	.product-table .table-cell,
	.product-table .table-header-cell {
		flex: 1;
		padding: 12rpx 10rpx;
		text-align: center;
		font-size: 13rpx;
		line-height: 1.4;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		word-break: break-all;
	}
	
	/* 紧凑模式下的表格单元格 */
	.order-info-grid-compact ~ .product-table-container .product-table .table-cell,
	.order-info-grid-compact ~ .product-table-container .product-table .table-header-cell {
		padding: 8rpx 6rpx;
		font-size: 12rpx;
		line-height: 1.3;
	}

	.table-header-cell {
		display: table-cell;
		border: 1px solid #dddddd;
		padding: 8px;
		text-align: center;
		font-weight: bold;
		background-color: #dddddd;
	}
	
	/* 产品表格表头单元格 */
	.product-table .table-header-cell {
		font-weight: bold;
		color: #333;
		font-size: 14rpx;
		background: linear-gradient(135deg, #f5f7fa, #e8ebef);
	}
	
	/* 产品表格数据单元格 */
	.product-table .table-body-row .table-cell {
		color: #666;
		font-weight: 500;
	}
	
	/* 货品名称列稍微宽一点 */
	.product-table .table-cell:first-child,
	.product-table .table-header-cell:first-child {
		flex: 1.5;
		font-weight: 600;
		color: #333;
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
  background-color: #31bdec;
		border-radius: 10rpx;
	}
</style>
