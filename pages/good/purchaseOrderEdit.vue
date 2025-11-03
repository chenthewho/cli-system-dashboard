<template>
	<div>
		<div style="display: flex; width: 100%;">
			<!-- 商品选择器组件 -->
			<GoodsSelector
				:commodity-list="commodityList"
				:category-list="tabListOrigin"
				:selected-ids="selectedCommodityIds"
				:height="scrollHeight"
				:show-back-button="true"
				:show-add-button="true"
				@back="back"
				@add-good="showAddNewGood=true"
				@item-click="addCommodity"
				@search="handleSearch"
				@category-change="changeTab"
			></GoodsSelector>
			<div style="flex: 1; background-color: #ffffff; text-align: right;">
				<div
					style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
					<div style="font-size: 15rpx; font-weight: bold;">
						{{currentShipper.shipperName}} — 编辑采购单 - {{orderCode}}
					</div>
			<div style="font-size: 15rpx; font-weight: bold;">
				<button v-if="expenseList.length === 0" class="add-expense-btn" @click="showExpenseManageModal">添加费用</button>
				<view v-else class="expense-label" @click="showExpenseManageModal">
					<text class="expense-label-text">费用({{ expenseList.length }}项)：¥{{ getTotalExpense().toFixed(2) }}</text>
				</view>
			</div>
				</div>
				<div :style="{marginLeft: '5rpx',marginRight: '5rpx', height: (windowHeight-60)+'px'}">
				<!-- 表头 -->
				<div class="table-header">
					<div style="flex: 3; padding: 10px; text-align: left;">
						<text style="font-size: 16px; font-weight: bold;">货品</text>
					</div>
					<div style="flex: 2; padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">入库数量</text>
					</div>
					<div style="flex: 2; padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">入库重量</text>
					</div>
					<div style="flex: 2; padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">采购单价</text>
					</div>
					<div style="flex: 2; padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">成本单价</text>
					</div>
					<div style="flex: 2; padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">入库金额</text>
					</div>
					<div style="width: 40rpx;padding: 10px; text-align: center;">
						<text style="font-size: 16px; font-weight: bold;">操作</text>
					</div>
				</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 45rpx; font-size: 18rpx;" v-for="(item, index) in BatchCommodityList"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 8px; text-align: left; font-weight: bold; line-height: 35rpx;">

								<!--商品名称栏-->
								<view style="display: flex; align-items: center;">
									<!--左边-->
									<view style="font-size: 20px;">
										{{ item.name }}
									</view>
									<!--右边-->
									<view v-if="item.saleWay === 1" style="margin-left: 10rpx;">
										<zero-switch @change="SwitchCalcType($event, item)" text-on="重量" text-off="数量"
											:show-text="true"></zero-switch>
									</view>
								</view>

							</div>
							<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
								<input @click="showKeyBorad(index,1)" inputmode="none" class="input1"
									v-model="item.initMount" />
							</div>
							<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
								<input @click="showKeyBorad(index,2)" inputmode="none" class="input1"
									v-model="item.initWeight" />
							</div>
						<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
							<input @click="showKeyBorad(index,3)" inputmode="none" class="input1"
								v-model="item.incomingPrice" />
						</div>
						<div style="flex: 2; padding: 8px; text-align: center; display: flex; align-items: center; justify-content: center;">
							<span style="font-weight: bold; color: #ff6600;font-size: 18rpx;">{{ getCostPrice(item) }}</span>
						</div>
						<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
							<input @click="showKeyBorad(index,4)" inputmode="none" class="input1"
								v-model="item.inboundAmount" />
						</div>
							<div
								style="width: 40rpx; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 35rpx; display: flex; align-items: center; justify-content: center;">
								<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="24"
									@click="deleteBatchCommdity(index)" color="#aa0000"></uni-icons>
							</div>
						</div>
					<div class="total-content">
						<div class="total-content-item" style="flex: 3;">
							总计：
						</div>
						<div class="total-content-item" style="flex: 2;">
							总数：{{totalInitInventory()}}
						</div>
						<div class="total-content-item" style="flex: 2; ">
							总重：{{totalInitWeight()}}
						</div>
						<div class="total-content-item" style="flex: 2; ">

						</div>
						<div class="total-content-item" style="flex: 2; ">
							
						</div>
						<div class="total-content-item" style="flex: 2; ">
							￥{{totalAmount()}}
						</div>
						<div class="total-content-item" style="width: 40rpx;">

						</div>
					</div>
					</scroll-view>
				<!--键盘-->
				<div v-if="showKeyBoard1">
					<view class="mybrankmask"
						:style="{ width: '450rpx', height: '200rpx', backgroundColor: '#ffffff', zIndex: 999, left: 0, bottom: 0, boxShadow: '0 -4rpx 20rpx rgba(0,0,0,0.15)' }">
						<view style="padding: 8rpx;">
							<view class="MymaskList">
								<view class="maskListItem" @click="NumberCk(1)">1</view>
								<view class="maskListItem" @click="NumberCk(2)">2</view>
								<view class="maskListItem" @click="NumberCk(3)">3</view>
								<view class="maskListItem " @click="Tuige()"><uni-icons custom-prefix="iconfont"
										type="icon-tuige" size="35" color="#ffffff"
										style="margin-right: 5rpx;"></uni-icons>
								</view>

							</view>
							<view class="MymaskList">
								<view class="maskListItem" @click="NumberCk(4)">4</view>
								<view class="maskListItem" @click="NumberCk(5)">5</view>
								<view class="maskListItem" @click="NumberCk(6)">6</view>

								<view class="maskListItem" @click="NumberCk('+')"
									style="font-size: 35rpx;color: white;">
									+</view>
							</view>
							<view class="MymaskList">
								<view class="maskListItem" @click="NumberCk(7)">7</view>
								<view class="maskListItem" @click="NumberCk(8)">8</view>
								<view class="maskListItem" @click="NumberCk(9)">9</view>
								<view class="maskListItem" @click="NumberCk('-')"
									style="font-size: 35rpx;color: white;">
									-</view>
							</view>
							<view class="MymaskList">
								<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
								<view class="maskListItem" @click="NumberCk('.')">.</view>
								<view class="maskListItem confirm-btn"
									@click="hideBorad">确定
								</view>
							</view>
						</view>
					</view>
				</div>
				</div>

				<div style="position: fixed;bottom: 0;height: 30rpx;background: #ffffff;width: 100%;"
					v-if="!showKeyBoard1&&showComfirmBtn">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="saveBatchGood">保存</button>
				</div>
			</div>


		</div>


	<!-- 添加新货品弹窗 - 使用高级组件 -->
	<AddGoodModalAdvanced 
		:show="showAddNewGood" 
		:unitList="unitList" 
		:categoryList="tabListOrigin"
		:extralModelList="extralModelList"
		@close="showAddNewGood = false"
		@confirm="handleAddNewGood"
	/>

	<!-- 费用管理弹窗 -->
	<view v-if="expenseManageModalVisible" class="expense-modal-mask" @click="closeExpenseManageModal">
		<view class="expense-modal-wrapper" @click.stop>
			<view class="expense-modal-container">
				<!-- 标题区域 -->
				<view class="expense-modal-header">
					<button class="expense-header-btn cancel" @click="closeExpenseManageModal">
						<uni-icons type="closeempty" size="20" color="#ffffff"></uni-icons>
						关闭
					</button>
					<text class="header-title">费用管理</text>
					<button class="expense-header-btn confirm" @click="openAddExpenseModal">
						<uni-icons type="plusempty" size="20" color="#fff"></uni-icons>
						添加费用
					</button>
				</view>
				
				<!-- 费用列表 -->
				<scroll-view scroll-y class="expense-list-content">
					<view v-if="expenseList.length === 0" class="empty-expense-hint">
						<uni-icons type="info" size="60" color="#c0c4cc"></uni-icons>
						<text class="empty-text">暂无费用，点击右上角添加费用</text>
					</view>
					<view v-else class="expense-items-wrapper">
						<view v-for="(expense, index) in expenseList" :key="expense.id" class="expense-item-card">
							<view class="expense-item-header">
								<view class="expense-item-title">
									<text class="expense-type-badge">{{ expense.label }}</text>
									<text class="expense-amount">¥{{ expense.amount.toFixed(2) }}</text>
								</view>
								<view class="expense-item-actions">
									<button class="expense-action-btn edit" @click="editExpense(expense)">
										<uni-icons type="compose" size="16" color="#409eff"></uni-icons>
									</button>
									<button class="expense-action-btn delete" @click="deleteExpense(expense.id)">
										<uni-icons type="trash" size="16" color="#f56c6c"></uni-icons>
									</button>
								</view>
							</view>
							<view class="expense-item-info">
								<text class="expense-info-text">
									{{ getAllocationMethodLabel(expense.allocationType) }}
								</text>
							</view>
						</view>
						<!-- 总费用汇总 -->
						<view class="expense-total-summary">
							<text class="summary-label">总费用：</text>
							<text class="summary-amount">¥{{ getTotalExpense().toFixed(2) }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>

	<!-- 添加/编辑费用弹窗 - 省略部分代码，与goodPurchaseEmploy相同 -->
	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import purchase from '../../api/purchase/purchase.js'
	import labelApi from '../../api/label/labelApi';
	import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
	import AddGoodModalAdvanced from '../../components/AddGoodModal/AddGoodModalAdvanced.vue'
	
	export default {
		components: {
			GoodsSelector,
			AddGoodModalAdvanced
		},
		data() {
			return {
				scrollHeight: 0,
				windowHeight: 0,
				companyId: "",
			tabList: [],
			tabListOrigin: [],
			showAddNewGood: false,
			commodityList: [],
			scrollHeight2: '0px',
				currentShipper: null,
				orderId: "",
				orderCode: "",
				editingIndex: 0,
				showKeyBoard1: false,
				editType: "common",
				BatchCommodityList: [],
			targetId: "id-0-view",
			unitList: [], // 单位列表
			extralModelList: [], // 附加物品列表
			newGoodInfo: {
				name: "",
				classifyId: "",
				saleWay: 1,
				unit: "件",
				price: "",
				initWeight: "",
				fixTare: "",
				showToSale: 1,
				specList: []
			},
			showComfirmBtn: true,
				// 费用相关
				expenseList: [], // 费用列表
				expenseManageModalVisible: false,
				expenseModalVisible: false,
				tempExpenseAmount: 0,
				selectedAllocationMethod: 4,
				allocationMethods: [
					{ value: 2, label: '按数量均摊', icon: '' },
					{ value: 1, label: '按重量均摊', icon: '' },
					{ value: 3, label: '按种类均摊', icon: '' },
					{ value: 4, label: '不均摊', icon: '' }
				],
				expenseTypes: [],
				selectedExpenseType: 'shipping',
				editingExpenseId: null,
		}
	},
	computed: {
		// 已选商品ID列表
		selectedCommodityIds() {
			return this.BatchCommodityList.map(item => item.commodityId);
		}
	},
	onLoad(options) {
			this.orderId = options.orderId;
			this.orderCode = options.orderCode;
			// 从参数中获取供应商信息
			this.currentShipper = {
				id: options.shipperId,
				shipperName: decodeURIComponent(options.shipperName)
			};
			// 加载采购单数据
			this.loadPurchaseOrderData();
		},
	mounted() {
		this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
		this.windowHeight = uni.getWindowInfo().windowHeight;
		this.companyId = uni.getStorageSync('companyId');
		this.getAllcommodity();
		this.getExpenseLabel();
		this.getCompanyUnit();
		this.getAllextralModel();
		this.scrollHeight2 = (this.windowHeight - 110) + 'px';
	},
	methods: {
		// 获取附加物品列表
		getAllextralModel() {
			let that = this;
			that.extralModelList = [{ name: "无", id: "" }];
			category.getallextralgood(this.companyId).then(res => {
				console.log("附加物品列表返回数据:", res.data);
				if (res.data != null) {
					for (var i = 0; i < res.data.length; i++) {
						that.extralModelList.push(res.data[i]);
					}
					console.log("附加物品列表:", that.extralModelList);
				}
			}).catch(err => {
				console.error("获取附加物品列表失败:", err);
			});
		},
		// 搜索处理（由组件触发）
		handleSearch(keyword) {
			// 搜索逻辑已在 GoodsSelector 组件内部处理
			console.log('搜索关键词:', keyword);
		},
		// 处理组件确认添加货品
		handleAddNewGood(formData) {
			// 将组件返回的数据赋值给 newGoodInfo
			this.newGoodInfo = { ...formData };
			// 调用原有的添加逻辑
			this.addNewGood();
		},
		// 添加新货品
		addNewGood() {
			if (this.newGoodInfo.name === null || this.newGoodInfo.name === "") {
				uni.showToast({
					icon: 'none',
					title: '物品名称不能为空',
					duration: 1200,
				});
				return;
			}
			if (this.newGoodInfo.classifyId === "") {
				uni.showToast({
					title: '请选择货品类型',
					icon: 'none',
					duration: 1500
				})
				return;
			}
			
			var that = this;
			// 处理规格列表
			for (var spec of this.newGoodInfo.specList) {
				if (spec.fixcount) spec.fixcount = parseFloat(spec.fixcount);
				if (spec.fixprice) spec.fixprice = parseFloat(spec.fixprice);
			}
			
			// 根据销售方式处理单位
			if (this.newGoodInfo.saleWay == 1) {
				this.newGoodInfo.specList.push({
					id: this.generateUUID(),
					specName: this.newGoodInfo.unit,
					fixcount: 1,
					fixprice: 0,
					parentId: ''
				});
			}
			
			if (this.newGoodInfo.saleWay == 2 || this.newGoodInfo.saleWay == 4) {
				this.newGoodInfo.specList.push({
					id: this.generateUUID(),
					specName: this.newGoodInfo.unit,
					fixcount: 1,
					fixprice: parseFloat(this.newGoodInfo.price),
					parentId: ''
				});
			}
			
			// 转换数值类型
			this.newGoodInfo.price = parseFloat(this.newGoodInfo.price);
			this.newGoodInfo.fixTare = parseFloat(this.newGoodInfo.fixTare);
			this.newGoodInfo.initWeight = parseFloat(this.newGoodInfo.initWeight);
			
			category.CommoditySave3(JSON.stringify(this.newGoodInfo)).then(res => {
				uni.showToast({
					icon: 'success',
					title: '添加成功',
					duration: 1200,
				});
				that.showAddNewGood = false;
				that.getAllcommodity();
			}).catch(error => {
				console.error('添加商品失败:', error);
				uni.showToast({
					icon: 'none',
					title: '添加失败',
					duration: 1200,
				});
			});
		},
		// 生成UUID
		generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		},
		// 加载采购单数据
		loadPurchaseOrderData() {
				purchase.GetCommodityByPurchaseOrderId(this.orderId).then(res => {
					// 将后端数据转换为前端编辑格式
					const records = res.data.purchaseEmployRecordList || [];
					this.BatchCommodityList = records.map(item => ({
						id: item.id,
						name: item.commodityName,
						commodityId: item.commodityId,
						initMount: item.initMount,
						initWeight: item.initWeight,
						calcType: item.calcType,
						saleWay: item.calcType === 2 ? 2 : 1,
						incomingPrice: item.incomingPrice,
						originalIncomingPrice: item.incomingPrice,
						expenseAllocated: 0,
						inboundAmount: item.inboundAmount,
						spec: {
							id: item.specId || '',
							specName: item.specName || '件'
						}
					}));
					
					// 加载费用列表
					const costList = res.data.purchaseOrderCostList || [];
					this.expenseList = costList.map((cost, index) => ({
						id: cost.id || 'expense-' + index,
						label: cost.label,
						amount: parseFloat(cost.amount),
						allocationType: cost.purchaseOrderCostType
					}));
					
					// 重新分摊费用
					this.recalculateExpenseAllocation();
				});
			},
			// 重新计算费用分摊
			recalculateExpenseAllocation() {
				// 重置所有商品的分摊费用
				this.BatchCommodityList.forEach(item => {
					item.expenseAllocated = 0;
				});
				
				// 对每个费用项目进行分摊
				this.expenseList.forEach(expense => {
					this.allocateExpense(expense);
				});
			},
			// 费用分摊逻辑（从goodPurchaseEmploy复制）
			allocateExpense(expense) {
				const amount = parseFloat(expense.amount) || 0;
				const method = expense.allocationType;
				
				if (method === 4 || this.BatchCommodityList.length === 0) {
					return;
				}
				
				let totalBase = 0;
				if (method === 1) { // 按重量
					totalBase = this.BatchCommodityList.reduce((sum, item) => 
						sum + (parseFloat(item.initWeight) || 0), 0);
				} else if (method === 2) { // 按数量
					totalBase = this.BatchCommodityList.reduce((sum, item) => 
						sum + (parseFloat(item.initMount) || 0), 0);
				} else if (method === 3) { // 按种类
					totalBase = this.BatchCommodityList.length;
				}
				
				if (totalBase === 0) return;
				
				this.BatchCommodityList.forEach(item => {
					let ratio = 0;
					if (method === 1) {
						ratio = (parseFloat(item.initWeight) || 0) / totalBase;
					} else if (method === 2) {
						ratio = (parseFloat(item.initMount) || 0) / totalBase;
					} else if (method === 3) {
						ratio = 1 / totalBase;
					}
					item.expenseAllocated = (item.expenseAllocated || 0) + (amount * ratio);
				});
			},
			getCompanyUnit(){
				labelApi.GetCompanyUnit(this.companyId).then(res => {
					this.unitList = res.data;
				})
			},
		SwitchCalcType(e, element) {
			if (e) {
				element.calcType = 2; // 按重量
			} else {
				element.calcType = 1; // 按数量
			}
			this.calcCommodityaddedInboundAmount(element);
		},
			getCostPrice(item) {
				const originalPrice = parseFloat(item.originalIncomingPrice || item.incomingPrice) || 0;
				const expenseAllocated = parseFloat(item.expenseAllocated) || 0;
				
				let costPerUnit = originalPrice;
				if (expenseAllocated > 0) {
					if (item.calcType === 2) {
						const weight = parseFloat(item.initWeight) || 0;
						if (weight > 0) {
							costPerUnit = originalPrice + (expenseAllocated / weight);
						}
					} else {
						const quantity = parseFloat(item.initMount) || 0;
						if (quantity > 0) {
							costPerUnit = originalPrice + (expenseAllocated / quantity);
						}
					}
				}
				
				return costPerUnit.toFixed(2);
			},
			totalInitInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initMount) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initWeight) || 0);
				}, 0);
			},
			totalAmount() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inboundAmount) || 0);
				}, 0).toFixed(2);
			},
			saveBatchGood() {
				let that = this;
				that.showComfirmBtn = false;
				
				// 构建商品列表
				var CommodityList = [];
				that.BatchCommodityList.forEach(item => {
					CommodityList.push({
						"id": item.id || "",
						"commodityId": item.commodityId,
						"calcType": item.calcType,
						"initMount": parseFloat(item.initMount),
						"initWeight": parseFloat(item.initWeight),
						"incomingPrice": parseFloat(item.incomingPrice),
						"costPrice": parseFloat(that.getCostPrice(item)),
						"inboundAmount": parseFloat(item.inboundAmount),
						"purchaseInventories": [{
							"specId": item.spec.id,
							"mount": parseFloat(item.initMount)
						}]
					})
				});

				// 构建费用列表
				var purchaseExpenseList = [];
				that.expenseList.forEach(expense => {
					purchaseExpenseList.push({
						"id": expense.id.startsWith('expense-') ? "" : expense.id,
						"label": expense.label,
						"amount": parseFloat(expense.amount),
						"purchaseOrderCostType": expense.allocationType
					});
				});
				
				// 构建更新参数
				var param = {
					id: that.orderId,
					shipperId: that.currentShipper.id,
					companyId: that.companyId,
					purchaseEmployList: CommodityList,
					purchaseOrderCostList: purchaseExpenseList
				}
				
				console.log("更新参数", param);
				
				if (that.BatchCommodityList.length > 0) {
					// 调用更新API
					purchase.modifyCommodityByPurchaseOrder(JSON.stringify(param)).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'success',
								duration: 2000
							});
							setTimeout(() => {
								that.back();
							}, 1000);
						} else {
							uni.showToast({
								title: res.message || '保存失败',
								icon: 'none',
								duration: 2000
							});
							that.showComfirmBtn = true;
						}
					}).catch(error => {
						console.error('保存失败:', error);
						uni.showToast({
							title: '保存失败，请稍后重试',
							icon: 'none',
							duration: 3000
						});
						that.showComfirmBtn = true;
					});
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			deleteBatchCommdity(index) {
				uni.showModal({
					title: '确认删除',
					content: '您确定要删除该项吗？',
					success: (res) => {
						if (res.confirm) {
							this.BatchCommodityList.splice(index, 1);
							this.recalculateExpenseAllocation();
						}
					}
				});
			},
		getAllcommodity() {
			category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
				this.commodityList = res.data;
				this.tabList = [{
					name: "全部",
					value: 0
				}];
				this.tabListOrigin = [];
				this.commodityList.forEach((item, index) => {
					if (!this.tabList.some(tab => tab.name === item.className)) {
						this.tabList.push({
							name: item.className,
							value: index
						});
					};
					if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
						this.tabListOrigin.push({
							name: item.className,
							value: item.classId
						});
					};
					if (this.tabListOrigin.length > 0) {
						this.newGoodInfo.classId = this.tabListOrigin[0].value;
					}
				});
			});
		},
		addCommodity(e) {
			if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
				var commodityAdded = {
					id: "",
					name: e.commodityName,
					initMount: 0,
					initWeight: 0,
					commodityId: e.id,
					calcType: e.saleWay === 2 ? 2 : 1,
					saleWay: e.saleWay,
					incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
					originalIncomingPrice: e.incomingPrice ? e.incomingPrice : 0,
					expenseAllocated: 0,
					inboundAmount: 0,
					spec: {
						id: '',
						specName: '件'
					}
				}
				if (e.commoditySpecs && e.commoditySpecs.length > 0) {
					commodityAdded.spec = e.commoditySpecs[0]
				}
				this.BatchCommodityList.push(commodityAdded);
				this.recalculateExpenseAllocation();
			}
		},
		getCommdityActive(id) {
			return this.BatchCommodityList.some(item => item.commodityId === id);
		},
		changeTab(e) {
			// 分类切换已由 GoodsSelector 组件内部处理
			console.log('切换分类:', e.name);
		},
		// 键盘相关方法
		showKeyBorad(index, type) {
			this.$nextTick(() => {
				this.scrollIntoView = `id-${index}-view`
			})
			this.editType = type;
			this.editingIndex = index;
			this.showKeyBoard1 = true;
			this.scrollHeight2 = (this.windowHeight - 110 - 200) + 'px';
		},
		hideBorad() {
			this.scrollHeight2 = (this.windowHeight - 110) + 'px';
			this.showKeyBoard1 = false;
			const item = this.BatchCommodityList[this.editingIndex];
			this.calcCommodityaddedInboundAmount(item);
			// 关闭键盘时重新分摊费用
			this.recalculateExpenseAllocation();
		},
		NumberCk(val) {
			const item = this.BatchCommodityList[this.editingIndex];
			let myvalue = "";
			switch (this.editType) {
				case 1:
					myvalue = item.initMount;
					break;
				case 2:
					myvalue = item.initWeight;
					break;
				case 3:
					myvalue = item.incomingPrice;
					break;
				case 4:
					myvalue = item.inboundAmount;
					break;
			}
			
			// 处理小数点
			if (val == '.') {
				if (myvalue.toString().indexOf('.') >= 0) {
					return;
				}
			}
			
			var myvalueStr = myvalue.toString();
			// 处理加减号
			if ((val === '+' || val === '-') && myvalueStr === '0') {
				return;
			}
			
			var txt = myvalue == null || (myvalueStr === '0' && val != ".") || myvalue == undefined ? '' : myvalue;
			
			if (val === "+" || val === "-") {
				txt = eval(txt);
			}
			myvalue = txt + val.toString();
			
			switch (this.editType) {
				case 1:
					item.initMount = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 2:
					item.initWeight = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 3:
					item.incomingPrice = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 4:
					item.inboundAmount = myvalue;
					// 根据入库金额反算单价
					if (item.calcType === 1) {
						item.incomingPrice = (parseFloat(myvalue) / (parseFloat(item.initMount) || 1)).toFixed(2);
					} else {
						item.incomingPrice = (parseFloat(myvalue) / (parseFloat(item.initWeight) || 1)).toFixed(2);
					}
					break;
			}
		},
		Tuige() {
			const item = this.BatchCommodityList[this.editingIndex];
			let myvalue = "";
			switch (this.editType) {
				case 1:
					myvalue = item.initMount;
					break;
				case 2:
					myvalue = item.initWeight;
					break;
				case 3:
					myvalue = item.incomingPrice;
					break;
				case 4:
					myvalue = item.inboundAmount;
					break;
			}
			
			if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
				return;
			}
			
			myvalue = myvalue ? myvalue.toString() : '';
			if (myvalue.length == 1) {
				myvalue = "0";
			} else {
				myvalue = myvalue.slice(0, -1);
			}
			
			switch (this.editType) {
				case 1:
					item.initMount = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 2:
					item.initWeight = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 3:
					item.incomingPrice = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 4:
					item.inboundAmount = myvalue;
					// 根据入库金额反算单价
					if (item.calcType === 1) {
						item.incomingPrice = (parseFloat(myvalue) / (parseFloat(item.initMount) || 1)).toFixed(2);
					} else {
						item.incomingPrice = (parseFloat(myvalue) / (parseFloat(item.initWeight) || 1)).toFixed(2);
					}
					break;
			}
		},
		calcCommodityaddedInboundAmount(commodityAdded) {
			// 计算入库金额的逻辑
			if (commodityAdded.calcType === 1) {
				commodityAdded.inboundAmount = ((parseFloat(commodityAdded.initMount) || 0) * 
					(parseFloat(commodityAdded.incomingPrice) || 0)).toFixed(2);
			} else {
				commodityAdded.inboundAmount = ((parseFloat(commodityAdded.initWeight) || 0) * 
					(parseFloat(commodityAdded.incomingPrice) || 0)).toFixed(2);
			}
		},
			// 费用管理相关方法
			getExpenseLabel() {
				labelApi.GetExpenseLabel(this.companyId,2).then(res => {
					this.expenseTypes = res.data || [];
					if (this.expenseTypes.length > 0) {
						this.selectedExpenseType = this.expenseTypes[0].id;
					}
				});
			},
			getTotalExpense() {
				return this.expenseList.reduce((total, expense) => {
					return total + (parseFloat(expense.amount) || 0);
				}, 0);
			},
			getAllocationMethodLabel(value) {
				const methods = {
					1: '按重量均摊',
					2: '按数量均摊',
					3: '按种类均摊',
					4: '不均摊'
				};
				return methods[value] || '未知方式';
			},
			showExpenseManageModal() {
				this.expenseManageModalVisible = true;
			},
			closeExpenseManageModal() {
				this.expenseManageModalVisible = false;
			},
			openAddExpenseModal() {
				this.expenseModalVisible = true;
			},
			editExpense(expense) {
				// 编辑费用的实现
			},
			deleteExpense(id) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除该费用项吗？',
					success: (res) => {
						if (res.confirm) {
							this.expenseList = this.expenseList.filter(e => e.id !== id);
							this.recalculateExpenseAllocation();
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.input1 {
		border-radius: 4rpx;
		padding: 5rpx;
		text-align: center;
		font-weight: bold;
		color: #000000;
		border: 1rpx solid #ccc;
		background: #ffffff;
		font-size: 16rpx;
	}

	.mybrankmask {
		position: fixed;
		z-index: 999;
	}

	.mybrankmask .MymaskList {
		display: flex;
		width: 100%;
		height: 42rpx;
		justify-content: space-around;
		margin-bottom: 6rpx;
		font-size: 26rpx;
	}

	.mybrankmask .MymaskList .maskListItem {
		font-weight: bold;
		width: 23%;
		height: 42rpx;
		text-align: center;
		line-height: 42rpx;
		border-radius: 8rpx;
		background: #5a5a5a;
		font-size: 26rpx;
		color: white;
		transition: all 0.15s;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.mybrankmask .MymaskList .maskListItem:active {
		opacity: 0.8;
		transform: scale(0.96);
		background: #4a4a4a;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
	}

	.mybrankmask .MymaskList .confirm-btn {
		background: #11998e;
		font-weight: bold;
	}

	.mybrankmask .MymaskList .confirm-btn:active {
		opacity: 0.8;
		background: #0d7a6f;
	}

	.table-header {
		display: flex;
		background: #2196f3;
		font-weight: bold;
		border-bottom: none;
		color: #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3);
		border-radius: 8rpx 8rpx 0 0;
	}

	.add-expense-btn {
		height: 25rpx;
		line-height: 25rpx;
		background-color: #00aaff;
		font-weight: bold;
		color: white;
		margin-right: 10rpx;
	}

	.expense-label {
		display: inline-flex;
		align-items: center;
		height: 25rpx;
		padding: 0 10rpx;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
	}

	.expense-label-text {
		font-size: 13rpx;
		font-weight: bold;
		color: white;
		line-height: 25rpx;
	}

	.total-content {
		display: flex;
		height: 35rpx;
		font-size: 16rpx;
		background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
		border-top: 2px solid #fdcb6e;
		border-bottom: 2px solid #fdcb6e;
		box-shadow: 0 2rpx 8rpx rgba(253, 203, 110, 0.3);
		align-items: center;
	}

	.total-content-item {
		padding: 8px;
		text-align: left;
		font-weight: bold;
		line-height: 28rpx;
		color: #d63031;
		font-size: 15px;
	}

	/* 费用弹窗样式 */
	.expense-modal-mask {
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

	.expense-modal-wrapper {
		width: 650px;
		max-width: 90%;
		max-height: 90vh;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
	}

	.expense-modal-container {
		background: white;
		overflow: hidden;
	}

	.expense-modal-header {
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		padding: 15px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
		flex-shrink: 0;
	}

	.header-title {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
		flex: 1;
		text-align: center;
	}

	.expense-header-btn {
		min-width: 90px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 0 16px;
		border: 2px solid rgba(255, 255, 255, 0.5);
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		color: #ffffff;
		background: rgba(255, 255, 255, 0.1);
	}

	.expense-list-content {
		height: 500px;
		max-height: 60vh;
		background: #f5f7fa;
	}

	.empty-expense-hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80px 20px;
	}

	.empty-text {
		margin-top: 20px;
		font-size: 16px;
		color: #909399;
	}

	.expense-items-wrapper {
		padding: 20px;
	}

	.expense-item-card {
		background: #ffffff;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.2s ease;
	}

	.expense-item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.expense-item-title {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
	}

	.expense-type-badge {
		display: inline-block;
		padding: 4px 12px;
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		color: white;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 600;
	}

	.expense-amount {
		font-size: 24px;
		font-weight: bold;
		color: #ff6b6b;
	}

	.expense-item-actions {
		display: flex;
		gap: 8px;
	}

	.expense-action-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
	}

	.expense-action-btn.edit {
		background: #ecf5ff;
	}

	.expense-action-btn.delete {
		background: #fef0f0;
	}

	.expense-item-info {
		padding-top: 12px;
		border-top: 1px solid #f0f0f0;
	}

	.expense-info-text {
		font-size: 14px;
		color: #606266;
	}

	.expense-total-summary {
		background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
		border-radius: 12px;
		padding: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 8px;
		box-shadow: 0 4px 12px rgba(253, 203, 110, 0.3);
	}

	.summary-label {
		font-size: 20px;
		font-weight: bold;
		color: #333;
	}

	.summary-amount {
		font-size: 28px;
		font-weight: bold;
		color: #d63031;
	}
</style>

