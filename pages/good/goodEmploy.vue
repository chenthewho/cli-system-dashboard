<template>
	<view :style="{ 'display': 'flex', 'width': '100%', 'height': (windowHeight - 65) + 'px', 'overflow': 'hidden' }">
		<div style="width: 160rpx; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); display: flex; flex-direction: column; overflow: hidden; box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.08);">
			<scroll-view scroll-y style="flex: 1; height: 0; width: 100%;">
				<!-- 圆弧边卡片 -->
				<div v-if="categoryList.length > 0" style="display: flex; flex-direction: column; gap: 5rpx; padding: 5rpx 0;">
					<div @click="exchangeTab(item)" v-for="item in categoryList" :key="item.id" :style="{
						marginLeft: '5rpx',
						marginRight: '3rpx',
						width: '120rpx',
						background: currentTabId === item.id ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' : '#ffffff',
						borderRadius: '12rpx',
						boxShadow: currentTabId === item.id ? '0 4rpx 12rpx rgba(76, 175, 80, 0.3)' : '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
						padding: '10rpx',
						boxSizing: 'border-box',
						textAlign: 'left',
						fontSize: '14rpx',
						color: currentTabId === item.id ? '#ffffff' : '#333',
						border: currentTabId === item.id ? '2rpx solid #4caf50' : '1rpx solid #e0e0e0',
						transform: currentTabId === item.id ? 'scale(1.02)' : 'scale(1)',
						transition: 'all 0.3s ease'
					}">
						<div>
							<text style="font-size: 15rpx; font-weight: bold;">
								{{ item.name }}
							</text>
						</div>
					</div>
				</div>
				<!-- 分类为空时的提示 -->
				<div v-else class="empty-state">
					<div class="empty-icon">📦</div>
					<div class="empty-text">暂无分类</div>
					<div class="empty-hint">请先添加分类</div>
				</div>
			</scroll-view>
		</div>
		<!-- 垂直分隔线 -->
		<div style="width: 3rpx; background: '#ccc'"></div>

		<div style="width: 100%; background-color: #ffffff; display: flex; flex-direction: column; overflow: hidden;">
			<!-- 按钮栏 - 固定 -->
		<div
			style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
			<div style="font-size: 15rpx; font-weight: bold;"><text
					style="margin-right: 5rpx;">{{ currentTabName }}</text>
			</div>
			<!-- 搜索框 -->
			<div class="search-box">
				<uni-icons type="search" size="14" color="#999"></uni-icons>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索货品"
					@input="handleSearch"
					placeholder-class="search-placeholder"
				/>
				<uni-icons 
					v-if="searchKeyword" 
					type="clear" 
					size="14" 
					color="#999"
					@click="clearSearch"
					style="cursor: pointer;"
				></uni-icons>
			</div>
			<div style="text-align: right;display: flex;">
				<button
					style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: orange;color: #ffffff;"
					@click="purchaseAddshow = true">采购入库</button>
				<button
					style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: darkgray;color: #ffffff;margin-left: 20rpx;"
					@click="enterTopurchaseOrder">入库单</button>
				<!-- <button
						style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: darkgray;color: #ffffff;margin-left: 10rpx;margin-right: 10rpx;"
						@click="enterTolossModel">报损操作</button> -->
				<view style="margin-right: 10rpx;margin-left: 10rpx;">
					<DropdownButton :options="operatorBtnoptions" :fontSize="12" :menuFontSize="10"
						:defaultValue="操作" :width="70" :height="20" :iconPosition="-5" @change="operabtnChange">
					</DropdownButton>
				</view>
			</div>
		</div>
			<!-- 表头 - 固定 -->
			<div class="table-container" style="flex-shrink: 0;">
				<div class="table-header">
					<div class="table-cell header-cell" style="flex: 3;">货品</div>
					<div class="table-cell header-cell last-cell" style="flex: 2;">库存</div>
				</div>
			</div>
			<!-- 滚动内容区 - 自动填充剩余空间 -->
			<scroll-view class="scrollArea" scroll-y="true" style="flex: 1; overflow-y: auto;">
				<!-- 商品列表 -->
				<div v-if="goodSelect.length > 0">
					<!-- 表格内容行 -->
					<div class="table-row" v-for="(item, index) in goodSelect" :key="index" >
						<div class="table-cell goods-cell" style="flex: 3;" @click="showGoodsDetail(item)">
							<div class="goods-name">{{ item.name }}</div>
							<div v-if="item.isMultiLevel==0">
							<text v-if="item.saleWay === 1" class="goods-tag tag-blue">非定装</text>
							<text v-if="item.saleWay === 2" class="goods-tag tag-green">定装</text>
							<text v-if="item.saleWay === 3" class="goods-tag tag-purple">定装拆包</text>
							<text v-if="item.saleWay === 4" class="goods-tag tag-light-blue">散装</text>
						</div>
						<div v-if="item.isMultiLevel==1">
							<text class="goods-tag tag-orange">多规格</text>
						</div>
							
						</div>
						<div class="table-cell inventory-cell last-cell" style="flex: 2;" @click="showInventoryRecord(item)">
							<div v-for="(item2, index2) in item.outPutPurchaseInventories" :key="index2" class="inventory-item">
								<text>{{ item2.mount }}</text>
								<text>{{ item2.specName }}</text>
								<text v-if="index2 != item.outPutPurchaseInventories.length - 1" class="separator">|</text>
							</div>
						</div>
					</div>
				</div>
				<!-- 商品为空时的提示 -->
				<div v-else class="goods-empty-state">
					<div class="empty-icon">📦</div>
					<div class="empty-text">暂无商品</div>
					<div class="empty-hint">该分类下还没有商品</div>
				</div>
			</scroll-view>

		</div>


	<!-- 采购货主弹窗 -->
	<div class="znj-modal-overlay" v-if="purchaseAddshow" @click="purchaseAddshow = false">
		<div class="znj-batch-modal" @click.stop>
			<div class="znj-batch-modal-header">
				<span>采购货主</span>
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
					@click="purchaseAddshow = false" color="#ffffff" class="znj-batch-modal-close"></uni-icons>
			</div>
			<div class="znj-batch-modal-body">
				<div class="znj-batch-modal-left">
					<div style="display: flex; flex-direction: column;" v-if="shipperSelected != null">
						<div class="znj-batch-modal-label">选中货主：</div>
						<input v-model="shipperSelected.shipperName" disabled="true"
							class="znj-batch-modal-input"></input>
					</div>
					<div class="znj-batch-modal-copy">
						<u-switch v-model="copyLastBatch" @click="copyLastBatch = !copyLastBatch" style="margin-right: 10rpx;" />
						是否复制上一次货品
					</div>
					<button class="znj-batch-modal-btn" @click="purchaseEnter">下一步</button>
				</div>
				<div class="znj-batch-modal-right">
					<div class="znj-batch-modal-label-row">
						<span>选择货主：</span>
						<button class="znj-batch-modal-add-shipper-btn" @click="ShipperAddshow = true">新增货主</button>
					</div>
					<div class="znj-batch-modal-shipper-list">
						<scroll-view class="znj-batch-modal-scroll" scroll-y="true">
							<div v-for="(item, index) in shipperList" :key="item.id"
								:class="['znj-batch-modal-shipper-item', {selected: shipperSelected && shipperSelected.id === item.id}]"
								@click="shipperSelected = item">
								{{ (index+1) + '. ' + item.shipperName }}
							</div>
						</scroll-view>
					</div>
				</div>
			</div>
		</div>
	</div>
		   <u-modal title="单据详情" :show="billDetailModalShow" @close="billDetailModalShow = false" :closeOnClickOverlay="true" :showConfirmButton="false" width="600px">
			   <div v-if="currentBillDetail" class="bill-detail-modal">
				   <div class="bill-detail-header">
					   <span class="bill-detail-title">单号：{{ currentBillDetail.accountCode }}</span>
					   <span class="bill-detail-customer">客户：{{ currentBillDetail.customName || '无' }}</span>
				   </div>
				   <div class="bill-detail-row">
					   <span>应收：<b>{{ currentBillDetail.payableAmount }}</b></span>
					   <span style="margin-left:20px;">实收：<b>{{ currentBillDetail.actualMoney }}</b></span>
					   <span style="margin-left:20px;">利润：<b style="color:#00b96b;">{{ formatProfit(currentBillDetail.totalProfit) }}</b></span>
				   </div>
				   <div class="bill-detail-row" style="margin-top:10px;">
					   <span>创建时间：{{ currentBillDetail.createTime }}</span>
					   <span style="margin-left:20px;">支付方式：{{ billPaywayText(currentBillDetail.payway) }}</span>
				   </div>
				   <div class="bill-detail-section" v-if="currentBillDetail.allGoodModels && currentBillDetail.allGoodModels.length">
					   <div class="bill-detail-goods-title">关联商品：</div>
					   <ul class="bill-detail-goods-list">
						   <li v-for="good in currentBillDetail.allGoodModels" :key="good.id">
							   <span>{{ good.name }}</span>
							   <span style="margin-left:10px;">数量：{{ good.mount }}</span>
							   <span style="margin-left:10px;">小计：{{ good.subtotal }}</span>
							   <span style="margin-left:10px;">利润：<b style="color:#00b96b;">{{ formatProfit(good.totalProfit) }}</b></span>
						   </li>
					   </ul>
				   </div>
			   </div>
		   </u-modal>
	<!-- 新增货主弹窗 -->
	<u-modal title="新增货主" :show="ShipperAddshow" @close="ShipperAddshow = false" :closeOnClickOverlay="false"
		:showConfirmButton="false" width="500rpx">
		<div class="znj-shipper-modal">
			<u--input placeholder="货主名称" border="surround" v-model="shipperAddedName" clearable class="znj-shipper-modal-input" />
			<u--input placeholder="货主电话" border="surround" v-model="shipperPhone" clearable class="znj-shipper-modal-input" />
			<div class="znj-shipper-modal-btns">
				<button class="znj-shipper-modal-btn cancel" @click="ShipperAddshow = false">返回</button>
				<button class="znj-shipper-modal-btn confirm" @click="AddShipper">添加</button>
			</div>
		</div>
	</u-modal>
		   <!-- 原生货品详情弹窗 -->
		   <view v-if="goodsDetailModalShow" class="goods-detail-overlay" @click="goodsDetailModalShow = false">
			   <view class="goods-detail-container" @click.stop>
				   <view v-if="currentGoodsDetail" class="goods-detail-content">
					   <!-- 头部 -->
					   <view class="goods-detail-header">
						   <view class="goods-detail-title">
							   <text class="goods-name-text">{{ currentGoodsDetail.name }}</text>
							   <text v-if="currentGoodsDetail.saleWay === 1" class="sale-tag tag-blue">非定装</text>
							   <text v-else-if="currentGoodsDetail.saleWay === 2" class="sale-tag tag-green">定装</text>
							   <text v-else-if="currentGoodsDetail.saleWay === 3" class="sale-tag tag-purple">定装拆包</text>
							   <text v-else-if="currentGoodsDetail.saleWay === 4" class="sale-tag tag-cyan">散装</text>
						   </view>
						   <view class="goods-detail-close" @click="goodsDetailModalShow = false">
							   <text class="close-icon">✕</text>
						   </view>
					   </view>
					   
					   <view class="goods-detail-subtitle">
						   分类：{{ currentGoodsDetail.classifyName || '未分类' }}
					   </view>
					   
				   <!-- 主要利润展示 -->
				   <view class="profit-section">
					   <view class="profit-card" :class="currentGoodsDetail.totalProfit >= 0 ? 'main-profit' : 'main-profit-negative'">
						   <view class="profit-label">总利润</view>
						   <view class="profit-value">¥{{ formatProfit(currentGoodsDetail.totalProfit) }}</view>
					   </view>
					   <view class="profit-card" :class="(currentGoodsDetail.monthProfit || 0) >= 0 ? 'month-profit' : 'month-profit-negative'">
						   <view class="profit-label">近一个月毛利</view>
						   <view class="profit-value">¥{{ formatProfit(currentGoodsDetail.monthProfit || 0) }}</view>
					   </view>
				   </view>
					   
					   <!-- 商品信息 -->
					   <view class="info-section">
						   <view class="info-section-title">商品信息</view>
						   <view class="info-grid">
							   <view class="info-item">
								   <text class="info-label">初始单价</text>
								   <text class="info-value">¥{{ currentGoodsDetail.price }}</text>
							   </view>
							   <view class="info-item">
								   <text class="info-label">单位</text>
								   <text class="info-value">{{ currentGoodsDetail.unit }}</text>
							   </view>
							   <view class="info-item">
								   <text class="info-label">初始重量</text>
								   <text class="info-value">{{ currentGoodsDetail.initWeight }}</text>
							   </view>
							   <view class="info-item full-width">
								   <text class="info-label">规格</text>
								   <view class="info-value spec-list">
									   <text v-if="currentGoodsDetail.specList && currentGoodsDetail.specList.length" 
										   v-for="(spec, idx) in currentGoodsDetail.specList" 
										   :key="idx" 
										   class="spec-chip">
										   {{ spec.specName }}
									   </text>
									   <text v-else class="empty-text">无</text>
								   </view>
							   </view>
						   </view>
					   </view>
					   
				   <!-- 关联订单 -->
				   <view class="bill-section">
					   <view class="bill-section-title">关联订单</view>
					   <view class="bill-count-card" @click="goToRelatedOrders">
						   <view class="bill-count-content">
							   <text class="bill-count-number">{{ currentGoodsDetail.allPrintModules ? currentGoodsDetail.allPrintModules.length : 0 }}</text>
							   <text class="bill-count-label">张订单</text>
						   </view>
						   <view class="bill-count-arrow">
							   <text class="arrow-icon">></text>
						   </view>
					   </view>
				   </view>
				   </view>
			   </view>
		   </view>

		   <!-- 单据详情弹窗 -->
		   <u-modal title="单据详情" :show="billDetailModalShow" @close="billDetailModalShow = false" :closeOnClickOverlay="true" :showConfirmButton="false" width="600px">
			   <div v-if="currentBillDetail" class="bill-detail-modal">
				   <div class="bill-detail-header">
					   <span class="bill-detail-title">单号：{{ currentBillDetail.accountCode }}</span>
					   <span class="bill-detail-customer">客户：{{ currentBillDetail.customName || '无' }}</span>
				   </div>
				   <div class="bill-detail-row">
					   <span>应收：<b>{{ currentBillDetail.payableAmount }}</b></span>
					   <span style="margin-left:20px;">实收：<b>{{ currentBillDetail.actualMoney }}</b></span>
					   <span style="margin-left:20px;">利润：<b style="color:#00b96b;">{{ formatProfit(currentBillDetail.totalProfit) }}</b></span>
				   </div>
				   <div class="bill-detail-row" style="margin-top:10px;">
					<span>创建时间：{{ currentBillDetail.createTime.replace("T", " ")  }}</span>
					   <span style="margin-left:20px;">支付方式：{{ billPaywayText(currentBillDetail.payway) }}</span>
				   </div>
				   <div class="bill-detail-section" v-if="currentBillDetail.allGoodModels && currentBillDetail.allGoodModels.length">
					   <div class="bill-detail-goods-title">关联商品：</div>
					   <ul class="bill-detail-goods-list">
						   <li v-for="good in currentBillDetail.allGoodModels" :key="good.id">
							   <span>{{ good.name }}</span>
							   <span style="margin-left:10px;">数量：{{ good.mount }}</span>
							   <span style="margin-left:10px;">小计：{{ good.subtotal }}</span>
							   <span style="margin-left:10px;">利润：<b style="color:#00b96b;">{{ formatProfit(good.totalProfit) }}</b></span>
						   </li>
					   </ul>
				   </div>
			   </div>
		   </u-modal>
		</view>
	</template>

<script>
import category from '../../api/goods/category'
import purchase from '../../api/purchase/purchase.js'
import DropdownButton from '../../components/DropdownButton/DropdownButton.vue'
export default {
	data() {
		return {
		companyId: "",
		categoryList: [],
		currentTabId: "",
		currentTabName: "",
		goodSelect: [],
		searchKeyword: "", // 搜索关键词
		allGoodsList: [], // 保存所有货品列表
			editingIndex: 0,
			showKeyBoard1: false,
			windowWidth: 0,
			windowHeight: 0,
			scrollHeight: '0px',
			valueType: 0,
			newGoodInfo: {},
			ShipperAddshow: false,
			shipperAddedName: "",
			shipperPhone: "",
			copyLastBatch: false,
			shipperList: [],
			shipperSelectedId: "",
			shipperSelected: null,
			tempSpuDialogVisible: false,
			tempSpuSkuName: "",
			showAddNewGood: false,
			extralModelList: [],
			purchaseAddshow: false,
			unit: ["件", "筐", "包"],
			operatorBtnoptions: [{
				text: "报损",
				value: 1
			}, {
				text: "盘点",
				value: 2
			}],
			goodsDetailModalShow: false,
			currentGoodsDetail: null,
			billDetailModalShow: false,
			currentBillDetail: null
		}
	},
	mounted() {
		this.companyId = uni.getStorageSync('companyId');
		this.getCategoryList();
		this.initSystem();
		this.newGoodInfoReset();

		this.getallShipper();
		// this.getallShipper();
		// this.getAllBatch();
	},
	methods: {
		// 搜索货品
		handleSearch() {
			if (!this.searchKeyword.trim()) {
				// 如果搜索关键词为空，恢复显示所有货品
				this.goodSelect = [...this.allGoodsList];
				return;
			}
			
			const keyword = this.searchKeyword.toLowerCase().trim();
			this.goodSelect = this.allGoodsList.filter(item => {
				return item.name && item.name.toLowerCase().includes(keyword);
			});
		},
		// 清除搜索
		clearSearch() {
			this.searchKeyword = "";
			this.goodSelect = [...this.allGoodsList];
		},
		formatProfit(val) {
			if (val === null || val === undefined || isNaN(val)) return '0.00';
			return Number(val).toFixed(2);
		},
		showBillDetail(bill) {
			this.currentBillDetail = bill;
			this.billDetailModalShow = true;
		},
		// 跳转到单据详情页面
		goToBillDetail(bill) {
			// 关闭货品详情弹窗
			this.goodsDetailModalShow = false;
			// 跳转到订单管理页面，并传递单据ID
			uni.navigateTo({
				url: `/pages/order/order?billId=${bill.id}`
			});
		},
		// 跳转到关联订单列表页面
		goToRelatedOrders() {
			if (!this.currentGoodsDetail || !this.currentGoodsDetail.allPrintModules || this.currentGoodsDetail.allPrintModules.length === 0) {
				uni.showToast({
					title: '暂无关联订单',
					icon: 'none'
				});
				return;
			}
			// 关闭货品详情弹窗
			this.goodsDetailModalShow = false;
			// 跳转到关联订单页面
			uni.navigateTo({
				url: `/pages/good/relatedOrders?commodityId=${this.currentGoodsDetail.id}&goodsName=${encodeURIComponent(this.currentGoodsDetail.name)}`
			});
		},
		billPaywayText(val) {
			if(val===1) return '现金';
			if(val===2) return '微信';
			if(val===3) return '支付宝';
			if(val===4) return '银行卡';
			return '其他';
		},
		showGoodsDetail(item) {
			console.log(item);
			purchase.getPurchaseCommodityProfit(item.id).then(res => {
				this.currentGoodsDetail = res.data;
				console.log(this.currentGoodsDetail);
				this.goodsDetailModalShow = true;
			})
		},
		// 查看库存记录
		showInventoryRecord(item) {
			uni.navigateTo({
				url: `/pages/good/employInventoryRecord?commodityId=${item.id}&goodsName=${encodeURIComponent(item.name)}`
			})
		},
		operabtnChange(e) {
			if (e.value === 1) {
				this.enterTolossModel();
			}
			if (e.value === 2) {
				this.enterToEmployCorrection();
			}
		},
		enterToPurchase() {
			this.purchaseAddshow = true;
		},
		enterToPurchaseOrder() {
			this.enterTopurchaseOrder();
		},
		initSystem() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowWidth = res.windowWidth;
					this.windowHeight = res.windowHeight;
					this.scrollHeight = (this.windowHeight - 110) + 'px';
				}
			})
		},
		AddShipper() {
			if (this.shipperAddedName == null || this.shipperAddedName == "") return;
			var data = {
				CompanyId: this.companyId,
				ShipperName: this.shipperAddedName,
				shipperPhone: this.shipperPhone
			}
			purchase.createPurchaseShipper(data).then(res => {
				this.ShipperAddshow = false;
				this.getallShipper();
			})
		},
		enterTolossModel() {
			uni.navigateTo({
				url: `/pages/good/lossModel?classId=${this.currentTabId}`
			})
		},
		enterToEmployCorrection() {
			this.purchaseAddshow = false;
			uni.navigateTo({
				url: `/pages/good/correction/employCorrection?classId=${this.currentTabId}`
			})
		},
		enterTopurchaseOrder() {
			this.purchaseAddshow = false;
			uni.navigateTo({
				url: `/pages/good/purchaseOrder`
			})
		},
		purchaseEnter() {
			this.purchaseAddshow = false;
			uni.navigateTo({
				url: `/pages/good/goodPurchaseEmploy?shipper=${JSON.stringify(this.shipperSelected)}`
			})
		},
		getallShipper() {
			purchase.getAllpurchaseShipper(this.companyId).then(res => {
				this.shipperList = res.data;
				if (this.shipperList.length > 0) {
					this.shipperSelected = this.shipperList[0];
					console.log("this.shipperSelected", this.shipperSelected)
				}
			})
		},
		saleTypeGet(type) {
			if (type == 1) {
				return "按斤"
			} else if (type == 2) {
				return "按件"
			} else if (type == 3) {
				return "按件"
			}
		},
		changSaleType(type) {
			this.newGoodInfo.saleWay = type;
			this.newGoodInfo.specList = [];
			if (type == 3) {
				this.newGoodInfo.specList.push({
					id: this.generateUUID(),
					specName: this.newGoodInfo.unit,
					fixprice: this.newGoodInfo.fixprice
				});
			}

		},
		generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				const r = Math.random() * 16 | 0;
				const v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		addSpec() {
			if (this.newGoodInfo.specList.length < 3) {
				this.newGoodInfo.specList.push({
					id: this.generateUUID(),
					specName: this.newGoodInfo.unit,
					fixprice: this.newGoodInfo.fixprice,
					parentId: this.newGoodInfo.specList[this.newGoodInfo.specList.length - 1].id,
					price: 0
				});
			}
		},
		getAllextralModel() {
			let that = this;
			category.getallextralgood(this.companyId).then(res => {

				that.extralModelList = res.data;
			})
		},
		newGoodInfoReset() {
			this.newGoodInfo = {
				name: "",
				saleWay: 1,
				unit: "件",
				specList: [],
				price: 0,
				extralModelId: "",
				showToSale: 1
			}
		},
		tempSpuClose() {
			this.tempSpuSkuName = '';
			this.tempSpuDialogVisible = false
		},
		tempSpuSubmit() {
			let that = this;
			var data = {
				Id: '',
				CompanyId: this.companyId,
				ClassName: this.tempSpuSkuName,
				ClassId: "",
				ParentId: ""
			};
			category.CreateClassify(JSON.stringify(data)).then(res => {
				that.tempSpuDialogVisible = false
				if (res != null && res != "") {
					uni.showToast({
						icon: 'success',
						title: '添加分组成功',
						duration: 1200,
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '添加分组失败',
						duration: 1200,
					});
				}
				that.getCategoryList();
				that.currentTabId = res;
				that.updateActiveTab(res);
			})
		},
		addNewGood() {
			this.goodSelect.push({
				id: this.generateGUID(),
				key: this.goodSelect.length + 1,
				name: "新物品",
				price: 0,
				initWeight: 0,
				inventory: 1
			})
		},
		saveGood() {
			let that = this;
			var CommodityData = [];
			that.newGoodInfo.classifyId = that.currentTabId;
			// this.goodSelect.forEach(x => {
			// 	if (x.name != undefined && x.name != null && x.name != "" && x.id != undefined && x.id !=
			// 		null) {
			// 		CommodityData.push({
			// 			Id: x.id,
			// 			name: x.name,
			// 			price: x.price,
			// 			no: x.key,
			// 			classifyId: that.currentTabId,
			// 			inventory: x.inventory,
			// 			initWeight: x.initWeight
			// 		})
			// 	}
			// })
			category.CommoditySave3(JSON.stringify(that.newGoodInfo)).then(res => {
				uni.showToast({
					icon: 'none',
					title: '保存成功',
					duration: 1200,
				});
				that.newGoodInfoReset();
			})
		},
		deleteItem(e) {
			const indexToDelete = this.goodSelect.findIndex(item => item.id === e.id);
			// 如果找到了对应的索引，则删除该项
			if (indexToDelete !== -1) {
				this.goodSelect.splice(indexToDelete, 1);
			}
		},
		generateGUID() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000) // 10000
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		},
		NumberCk(val) {
			let myvalue = "";
			switch (this.valueType) {
				case 1:
					myvalue = this.goodSelect[this.editingIndex].price;
					break;
				case 2:
					myvalue = this.goodSelect[this.editingIndex].initWeight;
					break;
			}
			if (val == '.') {
				if (myvalue.toString().indexOf('.') >= 0) {
					return;
				}
			}
			var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
			myvalue = txt + val.toString();
			switch (this.valueType) {
				case 1:
					this.goodSelect[this.editingIndex].price = myvalue;
					break;
				case 2:
					this.goodSelect[this.editingIndex].initWeight = myvalue;
					break;
			}
		},
		Tuige() {
			let myvalue = "";
			switch (this.valueType) {
				case 1:
					myvalue = this.goodSelect[this.editingIndex].price;
					break;
				case 2:
					myvalue = this.goodSelect[this.editingIndex].initWeight;
					break;
			}
			if (myvalue == null || myvalue === '' || myvalue === '0') {
				return;
			}
			myvalue = myvalue ? myvalue.toString() : '';
			myvalue = myvalue.slice(0, -1);
			switch (this.valueType) {
				case 1:
					this.goodSelect[this.editingIndex].price = myvalue === '' ? '0' : myvalue;
					break;
				case 2:
					this.goodSelect[this.editingIndex].initWeight = myvalue === '' ? '0' : myvalue;
					break;
			}
		},
		initSystem() {
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
					that.windowWidth = res.windowWidth; // 输出屏幕宽度
					that.windowHeight = JSON.parse(JSON.stringify(res.windowHeight));
					console.log("that.windowHeight", that.windowHeight)
					that.scrollHeight = res.windowHeight - 150 + 'px';
				}
			});
		},
		showKeyBorad(index, type) {
			this.valueType = type;
			this.editingIndex = index;
			this.showKeyBoard1 = true;
			this.scrollHeight = this.windowHeight - 210 - 200 + 'px';
		},
		hideBorad() {
			this.scrollHeight = this.windowHeight - 200 + 'px';
			this.showKeyBoard1 = false;
		},
		exchangeTab(e) {
			this.currentTabId = e.id;
			this.updateActiveTab(e.id)
		},
		//获取种类
		async getCategoryList() {
			let that = this;
			this.categoryList = []
			var res = await category.categoryList(this.companyId);
			res.data.forEach(x => {
				this.categoryList.push({
					id: x.id,
					name: x.className
				});
			})
			if (res.data.length > 0) {
				that.updateActiveTab(this.categoryList[0].id)
			}
		},
		//获取货物列表
		updateActiveTab(tabId) {
			this.currentTabId = tabId;
			const foundTab = this.categoryList.find(tab => tab.id === tabId);
			this.currentTabName = foundTab.name;
			purchase.GetEmployCommidityByClassId(tabId).then(res => {
				console.log("Res", res)
				this.rows = [];
				for (let i = 0; i < res.data.length; i += 2) {
					this.rows.push(res.data.slice(i, i + 2));
				}
			this.goodSelect = [];
			for (let i = 0; i < res.data.length; i++) {
				this.goodSelect.push({
					id: res.data[i].id,
					key: i,
					name: res.data[i].commodityName,
					price: res.data[i].price,
					inventory: res.data[i].initMount - res.data[i].saleMount,
					type: 0,
					isMultiLevel: res.data[i].isMultiLevel,
					unit: res.data[i].unit,
					initWeight: res.data[i].initWeight,
					extralModel: res.data[i].extralModel,
					saleWay: res.data[i].saleWay,
					outPutPurchaseInventories: res.data[i].outPutPurchaseInventories
				})
			}
			// 保存所有货品列表副本，用于搜索
			this.allGoodsList = [...this.goodSelect];
			// 清空搜索关键词
			this.searchKeyword = "";

			})
		},
		saleTypeText(type) {
			if (type === 1) return '非定装';
			if (type === 2) return '定装';
			if (type === 3) return '定装拆包';
			if (type === 4) return '散装';
			return '未知';
		}
	}

}
</script>

<style>
/* 搜索框样式 */
.search-box {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 10rpx;
	padding: 0rpx 12rpx;
	margin: 0 10rpx;
	flex: 0 0 auto;
	min-width: 100rpx;
	max-width: 200rpx;
	border: 1rpx solid #e5e5e5;
	transition: all 0.3s ease;
}

.search-box:focus-within {
	background: #fff;
	border-color: #4caf50;
	box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.15);
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 13rpx;
	color: #333;
	margin: 0 8rpx;
	outline: none;
	height: 22rpx;
	line-height: 22rpx;
}

.search-placeholder {
	color: #999;
	font-size: 12rpx;
}

.btn-show {
	padding: 5px 15px;
	margin: 0 5px;
	border: 1px solid #ddd;
	background: transparent;
	/* 默认镂空 */
	color: #333;
	border-radius: 4px;
}

.btn-show.active {
	background: #07c160;
	/* 选中时填满 */
	color: white;
	border-color: #07c160;
}

.input-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.input-container input {
	width: 70%;
	height: 60rpx;
	border: 1px solid #ccc;
	border-radius: 5rpx;
	padding: 0 10rpx;
}

.input1 {
	background-color: #b9b9b9;
	height: 20rpx;
	border-radius: 5rpx;
	font-size: 15rpx;
	text-align: center;
	border: 1px solid black;
	font-weight: bold;
	color: black;
	width: 85%;

}

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
}

h2.selected {
	border-bottom: 1px solid gray;
	/* 下划线为蓝色 */
	background-color: #00aaff;
	color: white;
	/* 蓝色背景框，可以根据需求调整 */
	padding: 5rpx;
}

.shell-type-btn {
	background: transparent;
	border: 1px solid #1890ff;
	color: #1890ff;
	padding: 0 15px;
	border-radius: 4px;
	height: 40px;
	line-height: 40px;
}

.shell-type-btn-active {
	background: #1890ff;
	border: 1px solid #1890ff;
	color: white;
}

.mybrankmask .MymaskList {
	font-weight: bold;
	display: flex;
	width: 100%;
	height: 30rpx;
	justify-content: space-around;
	margin-bottom: 5rpx;
	font-size: 12rpx;

}

.mybrankmask .MymaskList .large {
	font-weight: bold;
	height: 65;
	/* 设置更高的高度 */
	line-height: 65rpx;
	/* 使文本垂直居中 */
	z-index: 5;
	font-size: 12rpx;
}

.mybrankmask .MymaskList .maskListItem {
	font-weight: bold;
	width: 23%;
	height: 30rpx;
	text-align: center;
	line-height: 30rpx;
	border-radius: 10rpx;
	background-color: #a8a8a8;
	font-size: 12rpx;
}

.addShipper-content {
	display: flex;
	flex-direction: column;
	width: 200rpx;
}

/* 遮罩层样式 */
.znj-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
/* 只影响这两个弹窗 */
.znj-batch-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  width: 600rpx;
  box-sizing: border-box;
  position: relative;
}
.znj-batch-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  font-size: 15rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  padding: 20px 24px;
  color: #ffffff;
}
.znj-batch-modal-close {
  cursor: pointer;
}
.znj-batch-modal-body {
  display: flex;
  gap: 32rpx;
  padding: 20rpx;
}
.znj-batch-modal-left, .znj-batch-modal-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.znj-batch-modal-label {
  font-size: 15rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}
.znj-batch-modal-input {
  margin-bottom: 16rpx;
  padding: 5rpx;
  height: 20rpx;
  border-radius: 5rpx;
  font-size: 20rpx;
  line-height: 15rpx;
  border: 1px solid #ccc;
  background-color: #ddd;
}
.znj-batch-modal-copy {
  display: flex;
  align-items: center;
  font-size: 15rpx;
  margin-bottom: 32rpx;
}
.znj-batch-modal-btn {
  background: linear-gradient(90deg, #4caf50, #43a047);
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 15rpx;
  font-weight: bold;
  padding: 0 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-batch-modal-btn:hover {
  background: linear-gradient(90deg, #43a047, #388e3c);
}
.znj-batch-modal-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15rpx;
  font-weight: 500;
}
.znj-batch-modal-add-shipper-btn {
  background: #0073ac;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 15rpx;
  padding: 0 15rpx;
  cursor: pointer;
}
.znj-batch-modal-shipper-list {
  margin-top: 16rpx;
}
.znj-batch-modal-scroll {
  max-height: 200rpx;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8rpx;
  padding: 8rpx;
  background: #fafbfc;
}
.znj-batch-modal-shipper-item {
  padding: 12rpx 8rpx;
  border-radius: 6rpx;
  font-size: 15rpx;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-batch-modal-shipper-item.selected, .znj-batch-modal-shipper-item:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.znj-shipper-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24rpx;
  width: 100%;
}
.znj-shipper-modal-input {
  font-size: 26rpx;
  padding: 12rpx;
}
.znj-shipper-modal-btns {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 16rpx;
}
.znj-shipper-modal-btn {
  flex: 1;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-shipper-modal-btn.cancel {
  background: #bdbdbd;
  color: #fff;
  height: 50rpx;
  line-height: 50rpx;
}
.znj-shipper-modal-btn.confirm {
  background: #0073ac;
  color: #fff;
  height: 50rpx;
  line-height: 50rpx;
}
.znj-shipper-modal-btn.confirm:hover {
  background: #005f8c;
}

.detail-btn {
	background: #f5f5f5;
	border: 1px solid #d9d9d9;
	border-radius: 4px;
	padding: 4px 12px;
	color: #333;
	font-size: 14px;
	cursor: pointer;
}

.primary-btn {
	background: #00b96b;
	color: #fff;
	border: none;
	border-radius: 4px;
	padding: 4px 18px;
	font-weight: bold;
	cursor: pointer;
}

.danger-btn {
	background: #fff;
	color: #f5222d;
	border: 1px solid #f5222d;
	border-radius: 4px;
	padding: 4px 18px;
	font-weight: bold;
	cursor: pointer;
}

.warn-btn {
	background: #fff;
	color: #faad14;
	border: 1px solid #faad14;
	border-radius: 4px;
	padding: 4px 18px;
	font-weight: bold;
	cursor: pointer;
}

.copy-btn {
	background: #fff;
	color: #1890ff;
	border: 1px solid #1890ff;
	border-radius: 4px;
	padding: 4px 18px;
	font-weight: bold;
	cursor: pointer;
}
.improved-bill-item {
	background: linear-gradient(90deg, #fafdff 60%, #e6f7ff 100%);
	border-radius: 10px;
	box-shadow: 0 2px 8px 0 rgba(24,144,255,0.06);
	border: 1.5px solid #e6f0fa;
	margin-bottom: 8px;
	padding: 12px 18px 10px 18px;
	transition: box-shadow 0.2s, border 0.2s, background 0.2s;
	cursor: pointer;
	position: relative;
}
.improved-bill-item:hover {
	box-shadow: 0 4px 16px 0 rgba(24,144,255,0.13);
	border-color: #1890ff;
	background: linear-gradient(90deg, #e6f7ff 60%, #fafdff 100%);
}
.bill-row-main {
	display: flex;
	align-items: center;
	gap: 16px;
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 4px;
}
.bill-row-info {
	display: flex;
	gap: 18px;
	font-size: 14px;
	color: #444;
	margin-bottom: 4px;
}
.bill-row-footer {
	display: flex;
	gap: 18px;
	font-size: 12px;
	color: #888;
	margin-bottom: 2px;
}
.bill-detail-btn {
	position: absolute;
	right: 18px;
	top: 16px;
	background: #00b96b;
	color: #fff;
	border-radius: 6px;
	padding: 2px 12px;
	font-size: 12px;
	font-weight: bold;
	opacity: 0.85;
	transition: opacity 0.2s;
	pointer-events: none;
}
.improved-bill-item:hover .bill-detail-btn {
	opacity: 1;
}
/* 货品详情弹窗美化升级 */
.beauty-modal {
	padding: 32px 28px 20px 28px;
	background: linear-gradient(135deg, #fafdff 0%, #f3f7fa 100%);
	border-radius: 16px;
	min-width: 540px;
	box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10);
	border: 1px solid #e6f0fa;
}
.beauty-header {
	margin-bottom: 18px;
	border-bottom: 1.5px solid #e6f0fa;
	padding-bottom: 8px;
}
.beauty-title {
	font-size: 26px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 10px;
	color: #222;
}
.beauty-subtitle {
	color: #7a8ca4;
	font-size: 15px;
	margin-top: 4px;
}
.tag {
	display: inline-block;
	padding: 2px 10px;
	border-radius: 10px;
	font-size: 13px;
	margin-left: 8px;
	font-weight: 500;
	box-shadow: 0 1px 4px 0 rgba(24,144,255,0.06);
}
.tag-blue { background: #e6f7ff; color: #1890ff; }
.tag-green { background: #e6fffb; color: #52c41a; }
.tag-purple { background: #f9f0ff; color: #722ed1; }
.tag-cyan { background: #e6fffb; color: #13c2c2; }
.tag-orange { background: #fff7e6; color: #fa8c16; }
.beauty-section {
	margin-top: 10px;
}
.beauty-row {
	display: flex;
	gap: 18px;
	margin-bottom: 16px;
}
.beauty-card {
	background: #fff;
	border-radius: 10px;
	padding: 16px 20px 12px 20px;
	flex: 1;
	min-width: 110px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	box-sizing: border-box;
	box-shadow: 0 2px 8px 0 rgba(24,144,255,0.04);
	border: 1px solid #f0f4fa;
}
.beauty-label {
	color: #7a8ca4;
	font-size: 14px;
	margin-bottom: 4px;
	font-weight: 500;
}
.beauty-value {
	font-size: 18px;
	color: #222;
	font-weight: 600;
	word-break: break-all;
}
.beauty-profit {
	color: #00b96b;
	font-size: 22px;
	font-weight: bold;
}
.beauty-chip {
	display: inline-block;
	background: #e6f7ff;
	color: #1890ff;
	border-radius: 8px;
	padding: 3px 12px;
	margin-right: 8px;
	font-size: 14px;
	margin-bottom: 2px;
	font-weight: 500;
}
.beauty-bill-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.beauty-bill-item {
	background: #f7fafd;
	border-radius: 7px;
	padding: 7px 12px 7px 12px;
	margin-bottom: 2px;
	display: flex;
	align-items: center;
	gap: 12px;
	font-size: 14px;
	color: #444;
	border: 1px solid #e6f0fa;
	box-shadow: 0 1px 4px 0 rgba(24,144,255,0.03);
}
.beauty-bill-code {
	font-weight: bold;
	color: #1890ff;
	font-size: 15px;
}
.beauty-bill-customer {
	color: #888;
	margin-left: 2px;
}
.beauty-bill-money {
	color: #222;
	margin-left: 2px;
}
.beauty-bill-profit {
	color: #00b96b;
	margin-left: 2px;
	font-weight: bold;
}
/* 单据详情弹窗样式 */
.bill-detail-modal {
	padding: 24px 18px 16px 18px;
	background: #fff;
	border-radius: 12px;
	min-width: 400px;
	box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
}
.bill-detail-header {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	color: #222;
}
.bill-detail-title {
	color: #1890ff;
	margin-right: 18px;
}
.bill-detail-customer {
	color: #888;
}
.bill-detail-row {
	font-size: 15px;
	color: #444;
	margin-bottom: 4px;
}
.bill-detail-section {
	margin-top: 12px;
	background: #f7fafd;
	border-radius: 8px;
	padding: 10px 12px;
}
.bill-detail-goods-title {
	font-weight: bold;
	color: #222;
	margin-bottom: 6px;
}
.bill-detail-goods-list {
	padding-left: 18px;
	margin: 0;
}
.bill-detail-goods-list li {
	margin-bottom: 4px;
	font-size: 14px;
	color: #444;
}
/* 纵向滑动单据列表样式 */
.bill-list-scroll-vertical {
	width: 100%;
	max-height: 180px;
	overflow-y: auto;
	padding-right: 4px;
}
.bill-list-scroll-item-vertical {
	min-width: 0;
	max-width: 100%;
	display: block;
}

/* 分类为空的样式 - 上下左右居中，适配窄栏宽度(120rpx) */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: 150rpx;
	padding: 20rpx 10rpx;
}

.empty-icon {
	font-size: 35rpx;
	margin-bottom: 8rpx;
	opacity: 0.5;
}

.empty-text {
	font-size: 14rpx;
	font-weight: bold;
	color: #666;
	margin-bottom: 4rpx;
	text-align: center;
}

.empty-hint {
	font-size: 11rpx;
	color: #999;
	text-align: center;
	line-height: 1.3;
}

/* 商品为空的样式 */
.goods-empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	min-height: 180rpx;
	padding: 30rpx 20rpx;
}

.goods-empty-state .empty-icon {
	font-size: 40rpx;
	margin-bottom: 10rpx;
	opacity: 0.5;
}

.goods-empty-state .empty-text {
	font-size: 16rpx;
	font-weight: bold;
	color: #666;
	margin-bottom: 6rpx;
}

.goods-empty-state .empty-hint {
	font-size: 13rpx;
	color: #999;
	text-align: center;
}

/* 简洁风格表格样式 */
.table-container {
  margin: 0 5rpx 5rpx 5rpx;
  border-radius: 8rpx 8rpx 0 0;
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
  border-right: 1rpx solid #d0d0d0;
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
  border-bottom: 1rpx solid #e0e0e0;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin: 0 5rpx;
  border-left: 1rpx solid #e0e0e0;
  border-right: 1rpx solid #e0e0e0;
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

.inventory-cell {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5rpx;
}

.inventory-item {
  display: flex;
  align-items: center;
  gap: 3rpx;
}

.separator {
  margin: 0 3rpx;
  color: #999;
}

.divider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 5rpx;
}

.divider {
  width: 100%;
}

/* 原生货品详情弹窗样式 */
.goods-detail-overlay {
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

.goods-detail-container {
	width: 90%;
	max-width: 700rpx;
	max-height: 85vh;
	background-color: #ffffff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.goods-detail-content {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
	padding: 20rpx;
}

/* 头部 */
.goods-detail-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 8rpx;
	padding-bottom: 12rpx;
	border-bottom: 2rpx solid #f0f0f0;
}

.goods-detail-title {
	display: flex;
	align-items: center;
	gap: 8rpx;
	flex-wrap: wrap;
	flex: 1;
}

.goods-name-text {
	font-size: 18rpx;
	font-weight: 700;
	color: #333;
}

.sale-tag {
	font-size: 10rpx;
	padding: 2rpx 6rpx;
	border-radius: 6rpx;
	font-weight: 500;
}

.goods-detail-close {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f5;
	border-radius: 50%;
	cursor: pointer;
	flex-shrink: 0;
}

.close-icon {
	font-size: 16rpx;
	color: #666;
	font-weight: bold;
}

.goods-detail-subtitle {
	font-size: 13rpx;
	color: #666;
	margin-bottom: 16rpx;
}

/* 利润区域 */
.profit-section {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.profit-card {
	flex: 1;
	padding: 16rpx;
	border-radius: 8rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.main-profit {
	background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
}

.main-profit-negative {
	background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
}

.month-profit {
	background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
}

.month-profit-negative {
	background: linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%);
}

.profit-label {
	font-size: 12rpx;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
}

.profit-value {
	font-size: 24rpx;
	font-weight: 700;
	color: #ffffff;
}

/* 信息区域 */
.info-section {
	margin-bottom: 20rpx;
}

.info-section-title {
	font-size: 14rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 12rpx;
	padding-left: 8rpx;
	border-left: 3rpx solid #1e88e5;
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12rpx;
}

.info-item {
	background-color: #f8f9fa;
	padding: 12rpx;
	border-radius: 8rpx;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	border: 1rpx solid #e9ecef;
}

.info-item.full-width {
	grid-column: 1 / -1;
}

.info-label {
	font-size: 11rpx;
	color: #999;
	font-weight: 500;
}

.info-value {
	font-size: 14rpx;
	color: #333;
	font-weight: 600;
}

.spec-list {
	display: flex;
	flex-wrap: wrap;
	gap: 6rpx;
}

.spec-chip {
	display: inline-block;
	padding: 4rpx 10rpx;
	background-color: #e8f5e9;
	color: #2e7d32;
	border-radius: 6rpx;
	font-size: 12rpx;
	font-weight: 500;
}

.empty-text {
	color: #ccc;
	font-size: 13rpx;
}

/* 绑定单据区域 */
.bill-section {
	margin-bottom: 10rpx;
}

.bill-section-title {
	font-size: 14rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 12rpx;
	padding-left: 8rpx;
	border-left: 3rpx solid #43a047;
}

.bill-count-card {
	background: #f8f9fa;
	border-radius: 8rpx;
	padding: 5rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	transition: all 0.2s ease;
	border: 1rpx solid transparent;
}

.bill-count-card:hover {
	border-color: #1e88e5;
	box-shadow: 0 4rpx 12rpx rgba(30, 136, 229, 0.2);
	transform: translateY(-2rpx);
}

.bill-count-content {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}

.bill-count-number {
	font-size: 32rpx;
	font-weight: 700;
	color: #1565c0;
}

.bill-count-label {
	font-size: 14rpx;
	color: #1976d2;
	font-weight: 500;
}

.bill-count-arrow {
	width: 30rpx;
	height: 30rpx;
	background-color: transparent;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.arrow-icon {
	font-size: 16rpx;
	color: #666363;
	font-weight: bold;
}
</style>