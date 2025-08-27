<template>
	<view :style="{ 'display': 'flex', 'width': '100%', 'height': (windowHeight - 65) + 'px' }">
		<div style="width: 120rpx; background-color: #ffffff;display: flex;">
			<div>
				<!-- 圆弧边卡片 -->
				<div style="display: flex; flex-direction: column; gap: 5rpx;">
					<div @click="exchangeTab(item)" v-for="item in categoryList" :key="item.id" :style="{
						marginLeft: '5rpx',
						marginRight: '5rpx',
						width: '100rpx',
						backgroundColor: currentTabId === item.id ? '#62d860' : '#ffffff', // 浅绿色或白色
						borderRadius: '12rpx',
						boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
						padding: '10rpx',
						boxSizing: 'border-box',
						textAlign: 'left',
						fontSize: '14rpx',
						color: '#333'
					}">
						<div>
							<text style="font-size: 15rpx; font-weight: bold;">
								{{ item.name }}
							</text>
						</div>
					</div>
				</div>
			</div>
			<!-- 垂直线 -->
			<div :style="{ 'width': '5rpx', 'background-color': '#ccc', 'height': (windowHeight - 65) + 'px' }"></div>
		</div>

		<div style="width: 100%; background-color: #ffffff; text-align: right;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;"><text
						style="margin-right: 5rpx;">{{ currentTabName }}</text>
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
			<div style="margin-left: 5rpx;margin-right: 5rpx;">
				<!-- 表头 -->
				<div
					style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
					<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">货品</div>
					<!-- <div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">价格</div> -->
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">剩余库存</div>
				</div>
			</div>
			<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight }">
				<!-- 表格内容行 -->
				<div style="display: flex;flex-direction: row;  border-bottom: 1px solid #ddd; cursor:pointer;"
					v-for="(item, index) in goodSelect" @click="showGoodsDetail(item)">
					<div
						style="flex: 3; display: flex; padding: 8px;justify-content: center;  align-items: center; border-right: 1px solid #ddd; text-align: center;font-weight: bold;line-height: 20rpx;">
						<div style="font-size: 15rpx;">{{ item.name }}</div>
						<text v-if="item.saleWay === 1"
							style="height: 15rpx;line-height: 15rpx; margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 3rpx;">非定装</text>
						<text v-if="item.saleWay === 2"
							style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #00aa00;border-radius: 3rpx;">定装</text>
						<text v-if="item.saleWay === 3"
							style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 3rpx;">定装拆包</text>
						<text v-if="item.saleWay === 4"
							style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #55aaff;border: 1px solid #55aaff;border-radius: 3rpx;">散装</text>
						<text v-if="item.extralModel"
							style="height: 15rpx;line-height: 15rpx; font-size: 8rpx;margin-left: 5rpx;  padding-left: 2rpx;padding-right: 2rpx;color: #ff5500;border: 1px solid #ff5500;border-radius: 3rpx;">{{ item.extralModel.name }}</text>
					</div>
					<!-- <div
						style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
						<div></div>
					</div> -->
					<div
						style="flex: 2;display: flex;line-height: 20rpx; padding: 8px;justify-content: center;  border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
						<div v-for="(item2, index2) in item.outPutPurchaseInventories" style="display: flex;">

							<div>{{ item2.mount }}</div>
							<text style="margin-right:5rpx">{{ item2.specName }}</text>
							<text style="margin-right:5rpx"
								v-if="index2 != item.outPutPurchaseInventories.length - 1">|</text>
						</div>
					</div>

				</div>
				<div style=" display: flex;flex-direction: column;align-items: center;">
					<u-divider class="divider" style=" width: 100%; "></u-divider>
					<!-- <u-icon name="plus-circle-fill" color="#00aa00" size="28" class="icon"
							@click="showAddNewGood = true"></u-icon> -->
				</div>
			</scroll-view>

		</div>


		<u-modal title="" :show="purchaseAddshow" @close="purchaseAddshow = false" :closeOnClickOverlay="false"
			:showConfirmButton="false" width="900px">
			<div style="
	    padding: 10rpx;
	    display: flex;
	    flex-direction: column;
	    width: 900px;
	    background-color: #ffffff;
	">
				<div
					style="position: relative; height: 30rpx; width: 100%; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
					<div style="font-size: 15rpx;font-weight: bold;">采购货主</div>
					<div style="position: absolute;right: -25px;top: -25px;">
						<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="25"
							@click="purchaseAddshow = false" color="#aa0000"></uni-icons>
					</div>
				</div>
				<div class="containerAddBatch">
					<div class="leftAddBatch">
						<div style="font-weight: bold;width: 80%;" v-if="shipperSelected != null">
							<div style="font-weight: bold;">选中货主：</div>
							<u--input fontSize="25" border="surround" v-model="shipperSelected.shipperName"
								disabled="true" style="margin-top: 10rpx;"></u--input>
						</div>
						<div style="display: flex; line-height: 20rpx;margin-top: 10rpx;font-weight: bold"><u-switch
								v-model="copyLastBatch" @click="copyLastBatch = !copyLastBatch"
								style="margin-right: 10rpx;"></u-switch> 是否复制上一次货品</div>
						<button
							style="margin-bottom: 10rpx; background-color: green;font-size: 15rpx;height: 25rpx;line-height: 25rpx;font-weight: bold;color: white;margin-top: 50rpx;letter-spacing: 15rpx;"
							@click="purchaseEnter">下一步</button>
					</div>
					<div class="rightAddBatch">
						<div
							style="height: 15rpx; width: 100%; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
							<div style="margin-left: 10rpx;font-weight: bold;">选择货主：</div>
							<div>
								<button @click="ShipperAddshow = true"
									style="width: 80rpx;height: 20rpx;line-height: 20rpx;background-color: #909090;color: #ffffff;font-weight: bold;">新增货主</button>
							</div>
						</div>
						<div class="tab-content">
							<scroll-view class="scrollArea" scroll-y="true"
								style="width: 150rpx; height: 140rpx;border: 1px solid #aaaaaa;">
								<div id="tab1" class="tab-panel" v-if="shipperList.length > 0"
									v-for="(item, index) in shipperList" :key="item.id"
									style="width: 150rpx;color: #333;">
									<h2 :class="{ 'selected': shipperSelected.id === item.id }"
										@click="shipperSelected = item">
										<uni-icons custom-prefix="iconfont" type="icon-youjiantou" size="25"
											color="#333" style="margin-right: 5rpx;"></uni-icons>
										{{ (index + 1) + ". " + item.shipperName }}
									</h2>
								</div>
							</scroll-view>
						</div>
					</div>
				</div>
			</div>

		   </u-modal>
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
		<u-modal title="新增货主" :show="ShipperAddshow" @close="ShipperAddshow = false" :closeOnClickOverlay="false"
			:showConfirmButton="false" width="200rpx">
			<view class="addShipper-content">
				<u--input placeholder="货主名称" border="surround" v-model="shipperAddedName" clearable></u--input>
				<u--input placeholder="货主电话" border="surround" v-model="shipperPhone" clearable
					style="margin-top: 10rpx;"></u--input>
				<div style="display: flex;margin-top: 10rpx;">
					<button
						style="width: 50rpx;height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: #909090;color: #ffffff;"
						@click="ShipperAddshow = false"> 返回</button>
					<button
						style="width: 50rpx;height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: #0073ac;color: #ffffff;"
						@click="AddShipper"> 添加</button>
				</div>
			</view>
		</u-modal>
		   <u-modal title="货品详情" :show="goodsDetailModalShow" @close="goodsDetailModalShow = false;" :closeOnClickOverlay="true" :showConfirmButton="false" width="720px">
			   <div v-if="currentGoodsDetail" class="goods-detail-modal beauty-modal">
				   <div class="goods-header beauty-header">
					   <div class="goods-title beauty-title">{{ currentGoodsDetail.name }}
						   <span v-if="currentGoodsDetail.saleWay === 1" class="tag tag-blue">非定装</span>
						   <span v-else-if="currentGoodsDetail.saleWay === 2" class="tag tag-green">定装</span>
						   <span v-else-if="currentGoodsDetail.saleWay === 3" class="tag tag-purple">定装拆包</span>
						   <span v-else-if="currentGoodsDetail.saleWay === 4" class="tag tag-cyan">散装</span>
					   </div>
					   <div class="goods-subtitle beauty-subtitle">分类：{{ currentGoodsDetail.classifyName || '未分类' }}</div>
				   </div>
				   <div class="beauty-section">
					   <div class="beauty-row">
						   <div class="beauty-card">
							   <div class="beauty-label">价格</div>
							   <div class="beauty-value">{{ currentGoodsDetail.price }}</div>
						   </div>
						   <div class="beauty-card">
							   <div class="beauty-label">初始重量</div>
							   <div class="beauty-value">{{ currentGoodsDetail.initWeight }}</div>
						   </div>
						   <div class="beauty-card">
							   <div class="beauty-label">单位</div>
							   <div class="beauty-value">{{ currentGoodsDetail.unit }}</div>
						   </div>
						   <div class="beauty-card">
							   <div class="beauty-label">总利润</div>
							   <div class="beauty-value beauty-profit">{{ formatProfit(currentGoodsDetail.totalProfit) }}</div>
						   </div>
					   </div>
					   <div class="beauty-row">
						   <div class="beauty-card" style="flex:2;">
							   <div class="beauty-label">规格</div>
							   <div class="beauty-value">
								   <span v-if="currentGoodsDetail.specList && currentGoodsDetail.specList.length">
									   <span v-for="(spec, idx) in currentGoodsDetail.specList" :key="idx" class="beauty-chip">{{ spec.specName }}</span>
								   </span>
								   <span v-else>无</span>
							   </div>
						   </div>
					   </div>
					   <div class="beauty-row">
						<div class="beauty-card beauty-bill-card">
							<div class="beauty-label">绑定单据</div>
							<div class="beauty-value beauty-bill-list">
								<template v-if="currentGoodsDetail.allPrintModules && currentGoodsDetail.allPrintModules.length">
									<scroll-view scroll-y class="bill-list-scroll-vertical" style="max-height:180px;overflow-y:auto;">
										<div v-for="(mod, idx) in currentGoodsDetail.allPrintModules" :key="mod.id" class="beauty-bill-item improved-bill-item bill-list-scroll-item-vertical" @click="showBillDetail(mod)" style="margin-bottom:10px;">
											<div class="bill-row-main">
												<span class="beauty-bill-customer">{{ mod.customName || '无' }}</span>
											</div>
											<div class="bill-row-info">
												<span class="beauty-bill-money">应收：<b>{{ mod.payableAmount }}</b></span>
												<span class="beauty-bill-money">实收：<b>{{ mod.actualMoney }}</b></span>
												<span class="beauty-bill-profit">利润：<b>{{ formatProfit(mod.totalProfit) }}</b></span>
											</div>
											<div class="bill-row-footer">
												<span class="bill-date">{{ mod.createTime.replace("T"," ") }}</span>
												<span class="bill-payway">{{ billPaywayText(mod.payway) }}</span>
											</div>
										</div>
									</scroll-view>
								</template>
								<span v-else>无</span>
							</div>
						</div>
					   </div>
				   </div>
			   </div>
		   </u-modal>

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
		formatProfit(val) {
			if (val === null || val === undefined || isNaN(val)) return '0.00';
			return Number(val).toFixed(2);
		},
		showBillDetail(bill) {
			this.currentBillDetail = bill;
			this.billDetailModalShow = true;
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
					this.scrollHeight = (this.windowHeight - 100) + 'px';
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
						unit: res.data[i].unit,
						initWeight: res.data[i].initWeight,
						extralModel: res.data[i].extralModel,
						saleWay: res.data[i].saleWay,
						outPutPurchaseInventories: res.data[i].outPutPurchaseInventories
					})
				}

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
	vertical-align: top;
}
</style>