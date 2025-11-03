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
						<div style="font-size: 15rpx; font-weight: bold;">
						<text
								style="margin-right: 5rpx;">{{BatchInfo.shipperName}}</text><text>{{BatchInfo.batchCode}}</text>
						</div>
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
<!-- 						<div style="flex: 2; padding: 10px; text-align: left;">入库单价
					</div>
					<div style="flex: 2; padding: 10px; text-align: left;">入库金额
					</div> -->
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
									<view v-if="item.saleWay == 1" style="margin-left: 10rpx;">
										<zero-switch @change="SwitchCalcType($event, item)" text-on="数量" text-off="重量"
											:show-text="true"></zero-switch>
									</view>
								</view>

							</div>
					<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
						<input @click="showKeyBorad(index,1)" inputmode="none" 
							:class="['input1', { 'input-active': editingIndex === index && valueType === 1 }]"
							v-model="item.initMount" />
						<text style="font-size: 16px; color: #666; font-weight: 500; min-width: 40rpx;">{{ item.spec ? item.spec.specName : '件' }}</text>
					</div>
				<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
					<input v-if="item.saleWay !== 3" @click="showKeyBorad(index,2)" inputmode="none" 
						:class="['input1', { 'input-active': editingIndex === index && valueType === 2 }]"
						v-model="item.initWeight" />
					<text v-else style="font-size: 16px; color: #999;">-</text>
					<!-- <text style="font-size: 16px; color: #666; font-weight: 500; min-width: 40rpx;">斤</text> -->
				</div>
<!-- 							<div style="flex: 2; padding: 8px; text-align: left;">
								<input @click="showKeyBorad(index,3)" inputmode="none" class="input1"
									v-model="item.incomingPrice" />
							</div>
							<div style="flex: 2; padding: 8px; text-align: left;">
								<input @click="showKeyBorad(index,4)" inputmode="none" class="input1"
									v-model="item.inboundAmount" />
							</div> -->
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
					v-if="!showKeyBoard1">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="saveBatchGood">确认</button>
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
	
	<!-- 规格选择弹窗（拆包） -->
	<div v-if="specPopup.visible" class="spec-popup-mask" @click="closeSpecPopup">
		<div 
			class="spec-popup-container" 
			:style="specPopupStyle"
			@click.stop
		>
			<div class="spec-popup-content">
				<div 
					v-for="(spec, index) in specPopup.specList" 
					:key="index"
					class="spec-item"
					@click="handleSpecClick(spec)"
				>
					<!-- 商品名称 + 规格名称 -->
					<div class="spec-item-name">
						{{ specPopup.commodity.commodityName || specPopup.commodity.name }}-{{ spec.specName }}
					</div>
					
					<!-- 商品信息区域 -->
					<div class="spec-item-info">
						<!-- 标签行 -->
						<div class="spec-item-tags">
							<div class="tag tag-unpack">拆包</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- 多等级商品选择弹窗 -->
	<view v-if="multiLevelPopup.visible" class="multilevel-popup-mask" @click="closeMultiLevelPopup">
		<view 
			class="multilevel-popup-container" 
			:style="multiLevelPopupStyle"
			@click.stop
		>
			<view class="multilevel-popup-content">
				<view 
					v-for="(child, index) in multiLevelPopup.childrenList" 
					:key="child.id || index"
					:id="'multilevel-grid-item-' + child.id"
					class="multilevel-grid-item"
					@click="handleMultiLevelClick(child)"
				>
					<!-- 商品名称 -->
					<view class="multilevel-item-name">
						{{ child.commodityName || child.name }}
					</view>
					
					<!-- 商品信息区域 -->
					<view class="multilevel-item-info">
						<!-- 标签行 -->
						<view class="multilevel-item-tags">
							<view v-if="child.saleWay == 1" class="tag tag-unfixed">非定</view>
							<view v-if="child.saleWay == 2" class="tag tag-fixed">
								定{{ child.initWeight ? child.initWeight : '' }}
							</view>
							<view v-if="child.saleWay == 3" class="tag tag-unpack">拆包</view>
							<view v-if="child.saleWay == 4" class="tag tag-bulk">散</view>
							<view v-if="child.extralModel" class="tag tag-extra">{{ child.extralModel.name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import batch from '../../api/batch/batch'
	import labelApi from '../../api/label/labelApi';
	import selectLayUnit from './component/selectLayUnit'
	import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
	import AddGoodModalAdvanced from '../../components/AddGoodModal/AddGoodModalAdvanced.vue'
	
	export default {
		components: {
			selectLayUnit,
			GoodsSelector,
			AddGoodModalAdvanced
		},
		data() {
			return {
				currentTab: 0,
				scrollHeight: 0,
				windowHeight: 0,
				companyId: "",
				BatchInfo: null,
			tabList: [],
			tabListOrigin: [],
			showAddNewGood: false,
			commodityList: [],
			valueType: 1,
		windowWidth: 0,
		windowHeight: 0,
		scrollHeight2: '0px',
	editingIndex: -1,
	selectedProductType: "",
	showKeyBoard1: false,
			actionView: null,
			maskView: null,
			editType: "common",
			BatchCommodityList: [],
			unitList: [],
			unitOptions: [], // 用于selectLayUnit组件的选项格式
			extralModelList: [], // 附加物品列表
			targetId: "id-0-view",
			// 规格弹窗数据（拆包）
			specPopup: {
				visible: false,
				left: 0,
				top: 0,
				commodity: null,
				specList: []
			},
			// 多等级商品弹窗
			multiLevelPopup: {
				visible: false,
				left: 0,
				top: 0,
				parentCommodity: null,
				childrenList: []
			},
				newGoodInfo: {
					name: "",
					classifyId: "",
					saleWay: 1, // 默认按重量
					unit: "件", // 默认单位
					price: "", // 价格
					initWeight: "", // 单位重量
					fixTare: "", // 单位皮重
					showToSale: 1, // 是否显示，默认显示
					specList: [] // 规格列表
				},
				batchList: [{
						batchName: '批次名称1',
						batchCode: '批次编号1',
					},
					{
						batchName: '批次名称2',
						batchCode: '批次编号2',
					},
					{
						batchName: '批次名称2',
						batchCode: '批次编号2',
					}
				]
		}
	},
	computed: {
		// 已选商品ID列表
		selectedCommodityIds() {
			return this.BatchCommodityList.map(item => item.commodityId);
		},
		// 规格弹窗样式（拆包）
		specPopupStyle() {
			const { left, top, specList } = this.specPopup;
			if (!specList || specList.length === 0) {
				return {};
			}
			const itemHeight = 90; // 每项高度
			const popupHeight = Math.min(specList.length * itemHeight + 10, 450); // 限制最大高度450px
			
			// 使用 uni-app 兼容的方式获取屏幕高度
			const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight;
			
			// 计算最佳位置（避免超出屏幕）
			let adjustedTop = top - 100 < 0 ? 0 : top - 100;
			adjustedTop = adjustedTop + popupHeight > screenHeight 
				? screenHeight - popupHeight - 20
				: adjustedTop;
			
			return {
				left: left + 'px',
				top: adjustedTop + 'px'
			};
		},
		// 多等级商品弹窗样式
		multiLevelPopupStyle() {
			const { left, top, childrenList } = this.multiLevelPopup;
			if (!childrenList || childrenList.length === 0) {
				return {};
			}
			const itemHeight = 90; // 每个 grid-item 的高度（包含边距）
			const popupPadding = 20; // 弹窗内边距
			const popupHeight = Math.min(childrenList.length * itemHeight + popupPadding * 2, 500); // 最大高度500px
			
			// 使用 uni-app 兼容的方式获取屏幕高度
			const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight;
			
			// 计算最佳位置（避免超出屏幕）
			let adjustedTop = top - 100 < 0 ? 0 : top - 100;
			adjustedTop = adjustedTop + popupHeight > screenHeight 
				? screenHeight - popupHeight - 20
				: adjustedTop;
			
			return {
				left: left + 'px',
				top: adjustedTop + 'px',
				maxHeight: '500px'
			};
		}
	},
	onLoad(options) {
			this.editType = options.edit;
			// 使用传过来的参数构建 BatchInfo
			this.companyId = uni.getStorageSync('companyId');
			this.BatchInfo = {
				shipperId: options.shipperId,
				batchCode: options.BatchCode,
				shipperName: decodeURIComponent(options.shipperName || '')
			};
			
			if (this.editType === "copyLast") {
				console.log("复制上一批", options)
				this.getLastBatchCommodityList(this.companyId, this.BatchInfo.shipperId)
			}

		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.getAllcommodity();
			// if (this.editType === "common") {
			// 	this.getBatchCommodityList();
			// }
		this.initSystem();
		this.getCompanyUnit();
		this.getAllextralModel();
	},
		methods: {
		getCompanyUnit(){
			let that = this;
			labelApi.GetCompanyUnit(this.companyId).then(res => {
				that.unitList = res.data;
				// 转换为selectLayUnit组件需要的格式
				that.unitOptions = res.data.map(unit => ({
					label: unit.unitName,
					value: unit.unitName
				}));
			})
		},
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
			//切换计算方式
			SwitchCalcType(e, element) {
				if (e) {
					element.calcType = 1;
				} else {
					element.calcType = 2
				}
				this.calcCommodityaddedInboundAmount(element);
			},
			onProductTypeChange() {

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
				var total = this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inboundAmount) || 0);
				}, 0);

				return total.toFixed(1);
			},
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
				
				let that = this;
				
				// 需要转换成double,不然发送失败500
				for (var i = 0; i < that.newGoodInfo.specList.length; i++) {
					that.newGoodInfo.specList[i].fixcount = parseFloat(that.newGoodInfo.specList[i].fixcount || 0);
					that.newGoodInfo.specList[i].fixprice = parseFloat(that.newGoodInfo.specList[i].fixprice || 0);
				}
				
				// 如果售卖方式等于1-2-4的话需要处理unit
				if (that.newGoodInfo.saleWay === 1) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					});
				}
				if (that.newGoodInfo.saleWay === 2) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price || 0),
						parentId: "",
						price: 0
					});
				}
				if (that.newGoodInfo.saleWay === 4) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price || 0),
						parentId: "",
						price: 0
					});
				}
				
				// 需要转换成double,不然发送失败500
				that.newGoodInfo.price = parseFloat(that.newGoodInfo.price || 0);
				that.newGoodInfo.fixTare = parseFloat(that.newGoodInfo.fixTare || 0);
				that.newGoodInfo.initWeight = parseFloat(that.newGoodInfo.initWeight || 0);
				
				console.log("完整的newGoodInfo", that.newGoodInfo);
				
				category.CommoditySave3(JSON.stringify(that.newGoodInfo)).then(res => {
					uni.showToast({
						icon: 'none',
						title: '添加成功',
						duration: 1200,
					});
					that.showAddNewGood = false;
					that.newGoodInfoReset();
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
			// 重置新货品信息
			newGoodInfoReset() {
				this.newGoodInfo = {
					name: "",
					classifyId: "",
					saleWay: 1,
					unit: "件",
					price: "",
					initWeight: "",
					fixTare: "",
					showToSale: 1,
					specList: []
				};
			},
			// 改变销售方式
			changSaleType(type) {
				this.newGoodInfo.saleWay = type;
				this.newGoodInfo.specList = [];
				if (type == 3) {
					var guid1 = this.generateUUID();
					this.newGoodInfo.specList.push({
						id: guid1,
						specName: this.newGoodInfo.unit,
						fixprice: 0
					});
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: 0,
						parentId: guid1
					});
				}
			},
			// 生成UUID
			generateUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					const r = Math.random() * 16 | 0;
					const v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			// 添加规格
			addSpec() {
				if (this.newGoodInfo.specList.length < 3) {
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: 0,
						parentId: this.newGoodInfo.specList[this.newGoodInfo.specList.length - 1].id,
						price: 0
					});
				}
			},
			// 按createTime排序方法
			sortByCreateTime(data) {
				return data.sort((a, b) => {
					const dateA = new Date(a.createTime);
					const dateB = new Date(b.createTime);
					return dateB - dateA; // 降序排序，最新的在前面
				});
			},
		// 选择单位
		selectUnit(unit) {
			this.newGoodInfo.unit = unit;
		},
		// 规格一单位选择
		editCardSpecSelct1(e) {
			this.newGoodInfo.specList[0].specName = this.unitOptions[e].label;
			this.newGoodInfo.unit = this.unitOptions[e].label;
		},
		// 规格二单位选择
		editCardSpecSelct2(e) {
			this.newGoodInfo.specList[1].specName = this.unitOptions[e].label;
		},
		// 规格三单位选择
		editCardSpecSelct3(e) {
			this.newGoodInfo.specList[2].specName = this.unitOptions[e].label;
		},
		// 删除规格
		removeSpec(index) {
			this.newGoodInfo.specList.splice(index, 1);
		},
		// 选择商品分类（确保只能选择一个）
		selectCategory(classifyId) {
			console.log("this.tabListOrigin", this.tabListOrigin)
			this.newGoodInfo.classifyId = classifyId;
		},
		// 搜索处理（由组件触发）
		handleSearch(keyword) {
			// 搜索逻辑已在 GoodsSelector 组件内部处理
			console.log('搜索关键词:', keyword);
		},
		changeTab(e) {
			// 分类切换已由 GoodsSelector 组件内部处理
			console.log('切换分类:', e.name);
		},
		// 处理组件确认添加货品
		handleAddNewGood(formData) {
			// 将组件返回的数据赋值给 newGoodInfo
			this.newGoodInfo = { ...formData };
			// 调用原有的添加逻辑
			this.addNewGood();
		},
		//键盘数字输入处理
		NumberCk(val) {
			const item = this.BatchCommodityList[this.editingIndex];
			let myvalue = "";
			
			// 获取当前编辑的值
			switch (this.valueType) {
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
			
			var myvalueStr = myvalue.toString();
			
			// 防止重复小数点
			if (val == '.') {
				if (myvalueStr.indexOf('.') >= 0) {
					return;
				}
			}
			
			// 防止+/-在0的情况下输入
			if ((val === '+' || val === '-') && myvalueStr === '0') {
				return;
			}
			
			var txt = myvalue == null || (myvalueStr === '0' && val != ".") || myvalue == undefined ? '' : myvalue;

			// 替换 eval() 为安全的计算方式
			if (val === "+" || val === "-") {
				try {
					txt = new Function('return ' + txt)();
				} catch (e) {
					txt = parseFloat(txt) || 0;
				}
			}
			myvalue = txt + val.toString();
			
			// 批量更新，减少响应式触发
			switch (this.valueType) {
				case 1:
					item.initMount = myvalue;
					if(item.fixWeight && item.fixWeight != ""){
						item.initWeight = item.initMount * item.fixWeight;
					}
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 2:
					item.initWeight = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 3:
					item.incomingPrice = myvalue;
					//输入入库单价计算入库金额
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 4:
					item.inboundAmount = myvalue;
					//输入入库金额计算单价
					this.calcCommodityaddedincomingPrice(item);
					break;
			}
		},
		//键盘删除处理
		Tuige() {
			const item = this.BatchCommodityList[this.editingIndex];
			let myvalue = "";
			
			// 获取当前编辑的值
			switch (this.valueType) {
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
			if(myvalue.length == 1){
				myvalue = "0";
			}else{
				myvalue = myvalue.slice(0, -1);
			}
		
			// 批量更新，减少响应式触发
			switch (this.valueType) {
				case 1:
					item.initMount = myvalue;
					if(item.fixWeight && item.fixWeight != ""){
						item.initWeight = item.initMount * item.fixWeight;
					}
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 2:
					item.initWeight = myvalue;
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 3:
					item.incomingPrice = myvalue;
					//输入入库单价计算入库金额
					this.calcCommodityaddedInboundAmount(item);
					break;
				case 4:
					item.inboundAmount = myvalue;
					//输入入库金额计算单价
					this.calcCommodityaddedincomingPrice(item);
					break;
			}
		},
			initSystem() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.windowWidth = res.windowWidth; // 输出屏幕宽度
						that.windowHeight = res.windowHeight;
						that.scrollHeight2 = res.windowHeight - 150 + 'px';
					}
				});
			},
showKeyBorad(index, type) {
	// 如果是编辑入库重量(type===2)且saleWay===3，不允许编辑
	const item = this.BatchCommodityList[index];
	if (type === 2 && item && item.saleWay === 3) {
		return;
	}
	
	this.$nextTick(() => {
		// 确保赋值和 view 的 id 一致
		this.scrollIntoView = `id-${this.currentNumber}-view`
	})
	this.valueType = type;
	this.editingIndex = index;
	this.showKeyBoard1 = true;
	// 键盘高度调整为200rpx
	this.scrollHeight2 = this.windowHeight - 210 - 200 + 'px';
},
	hideBorad() {
		this.scrollHeight2 = this.windowHeight - 150 + 'px';
		this.showKeyBoard1 = false;
		// 清除激活状态
		this.editingIndex = -1;
		this.valueType = 0;
	},
		getLastBatchCommodityList(companyId, shipperId) {
			batch.GetLastBatchCommodity(companyId, shipperId).then(res => {
				console.log("res", res)
				// this.BatchCommodityList = res.data;
				for (var i = 0; i < res.data.length; i++) {
					var commodity = res.data[i];
					var commodityAdded = {
					id: "",
					name: commodity.commodityName,
					initMount:  commodity.initMount,
					initWeight: commodity.saleWay === 3 ? 0 : commodity.initWeight,
					fixWeight:0,//单位重量（目前仅用于定装）
					commodityId: commodity.commodityId,
					calcType: 1,
					saleWay: commodity.saleWay,
					incomingPrice: 0,
					inboundAmount: 0
				}
				if (commodity.specList.length > 0) {
					commodityAdded.spec = commodity.specList[0]
				}
				this.BatchCommodityList.push(commodityAdded)
				}
			})
		},
		getBatchCommodityList() {
			category.GetBybatchId(this.BatchInfo.id).then(res => {
				this.BatchCommodityList = res.data.map(item => {
					// 如果 saleWay 为 3，强制 initWeight 为 0
					if (item.saleWay === 3) {
						item.initWeight = 0;
					}
					return item;
				});
			})
		},
		saveBatchGood() {
			let that = this;
			var CommodityList = [];
			that.BatchCommodityList.forEach(item => {
					CommodityList.push({
						"BatchId": '',
						"commodityId": item.commodityId,
						"calcType": item.calcType,
						"initMount": 0,
						"initWeight": item.saleWay === 3 ? 0 : parseFloat(item.initWeight),
						"incomingPrice": parseFloat(item.incomingPrice),
						"inboundAmount": parseFloat(item.inboundAmount),
						"purchaseInventories": [{
							"specId": item.spec.id,
							"mount": parseFloat(item.initMount)
						}]
					})
			})

				let newBatchInfo = {
					CompanyId: this.companyId,
					ShipperId: this.BatchInfo.shipperId,
					BatchCode: this.BatchInfo.batchCode
				}

				let param = {
					newBatchInfo:newBatchInfo,
					purchaseAssistList:CommodityList
				}


				if (that.BatchCommodityList.length > 0) {
					batch.createBatchType2(param).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'none',
								duration: 2000
							})
							that.back();
						} else {
							uni.showToast({
								title: '保存失败',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},
		back() {
			console.log("返回并刷新批次:", this.BatchInfo.id)
			uni.setStorageSync("refresh_batch", this.BatchInfo.id)
			// 触发刷新事件
			uni.$emit('refreshBatch', this.BatchInfo.id);
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
							// 用户点击了确认
							this.BatchCommodityList.splice(index, 1)
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
		getAllcommodity() {
			category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
				console.log("res", res)
				// 按createTime降序排序（最新的在前面）
				const sortedData = this.sortByCreateTime(res.data);
				this.commodityList = sortedData;
				this.tabList = [{
					name: "全部",
					value: 0
				}];
				this.tabListOrigin = [];
				this.commodityList.forEach((item, index) => {
					if (!this.tabList.some(tab => tab.name === item.className)) {
						this.tabList.push({
							name: item.className,
							value: item.classId
						});
					};
					if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
						this.tabListOrigin.push({
							name: item.className,
							value: item.classId
						});
					};
					if (this.tabListOrigin.length > 0) {
						this.newGoodInfo.classifyId = this.tabListOrigin[0].value;
					}
				});
			});
		},
			//计算添加货品的入库金额 2-按重量计算 1-按数量计算
			calcCommodityaddedInboundAmount(commodityAdded) {

				if(commodityAdded.initWeight&&commodityAdded.initWeight!=""&&commodityAdded.incomingPrice&&commodityAdded.incomingPrice!=""){
				if (commodityAdded.calcType === 2) {
					commodityAdded.inboundAmount = (parseFloat(commodityAdded.initWeight) * parseFloat(commodityAdded.incomingPrice)).toFixed(1)
				}
				if (commodityAdded.calcType === 1) {
					commodityAdded.inboundAmount =(parseFloat(commodityAdded.initMount) * parseFloat(commodityAdded.incomingPrice)).toFixed(1)
				}
			}
			},
			//计算添加货品的入库单价 2-按重量计算 1-按数量计算
			calcCommodityaddedincomingPrice(commodityAdded) {
				if (commodityAdded.calcType === 2) {
					commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initWeight).toFixed(2)
				}
				if (commodityAdded.calcType === 1) {
					commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initMount).toFixed(2)
				}
			},
	addCommodity(e) {
		// if (this.getCommdityActive(e.id)) return;
		
		// 处理多等级商品
		if (e.isMultiLevel === 1) {
			uni.createSelectorQuery().selectAll(`#grid-item-${e.id}`).boundingClientRect(data => {
				console.log("多等级商品位置信息:", data);
				if (data && data.length > 0) {
					this.createMultiLevelView(data[0].left + data[0].width / 2, data[0].top, e, e.childrenList);
				}
			}).exec()
			return;
		}
		
		if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
			var commodityAdded = {
				id: "",
				name: e.commodityName,
				initMount: 0,
				initWeight: 0,
				fixWeight:e.initWeight,//单位重量（目前仅用于定装）
				commodityId: e.id,
				calcType: 1,
				saleWay: e.saleWay,
				incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
				inboundAmount: 0
			}
			if (e.commoditySpecs.length > 0) {
				commodityAdded.spec = e.commoditySpecs[0]
			}
			this.BatchCommodityList.push(commodityAdded)
		}
		
		// 处理定装拆包
		if(e.saleWay === 3){
			uni.createSelectorQuery().selectAll(`#grid-item-${e.id}`).boundingClientRect(data => {
				console.log("拆包商品位置信息", data)
				if (data && data.length > 0) {
					this.createSpecPopup(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
				}
			}).exec()
		}
	},
		
		// 用于添加拆包商品
		addCommodity2(e, spec) {
			var commodityAdded = {
				id: "",
				name: e.commodityName,
				initMount: 0,
				initWeight: 0,
				fixWeight:e.initWeight,//单位重量（目前仅用于定装）
				commodityId: e.id,
				calcType: 1,
				saleWay: e.saleWay,
				incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
				inboundAmount: 0
			}
			commodityAdded.spec = spec
			this.BatchCommodityList.push(commodityAdded)
		},
		
	// 创建规格弹窗（拆包）
	createSpecPopup(left, top, commodity, specList) {
		if (!specList || specList.length < 1) return;
		
		this.specPopup = {
			visible: true,
			left,
			top,
			commodity,
			specList
		};
	},
	// 关闭规格弹窗
	closeSpecPopup() {
		this.specPopup.visible = false;
		// 延迟清空数据，等动画完成
		setTimeout(() => {
			this.specPopup = {
				visible: false,
				left: 0,
				top: 0,
				commodity: null,
				specList: []
			};
		}, 300);
	},
	// 点击规格项
	handleSpecClick(spec) {
		this.addCommodity2(this.specPopup.commodity, spec);
		this.closeSpecPopup();
	},
	
	// 创建多等级商品弹窗
	createMultiLevelView(left, top, parentCommodity, childrenList) {
		if (!childrenList || childrenList.length < 1) return;
		
		this.multiLevelPopup = {
			visible: true,
			left,
			top,
			parentCommodity,
			childrenList
		};
	},
	// 关闭多等级商品弹窗
	closeMultiLevelPopup() {
		this.multiLevelPopup.visible = false;
		// 延迟清空数据，等动画完成
		setTimeout(() => {
			this.multiLevelPopup = {
				visible: false,
				left: 0,
				top: 0,
				parentCommodity: null,
				childrenList: []
			};
		}, 300);
	},
	// 点击多等级商品项
	handleMultiLevelClick(childCommodity) {
		this.closeMultiLevelPopup();
		// 直接使用子商品自身的数据
		this.addCommodity(childCommodity);
	},
	
	// 创建原生视图用于选择规格（仅APP-PLUS环境）
	createNativeView(left, top, commodity, specList) {
			console.log(specList)
			if (this.actionView || !specList || specList.length < 0) return;
			let that = this;
			this.maskView = new plus.nativeObj.View("maskView", {
				top: "0px",
				left: "0px",
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.1)" // 接近透明
			});
			this.maskView.addEventListener("click", () => {
				that.actionView.close();
				that.actionView = null;
				that.maskView.close();
				that.maskView = null;
			});
			this.maskView.show();

			var zoneHeight = specList.length * 100;
			var zoneTop = top - 100 < 0 ? 0 : top - 100;
			zoneTop = zoneTop + zoneHeight > plus.screen.resolutionHeight ? plus.screen.resolutionHeight - zoneHeight : zoneTop;
			this.actionView = new plus.nativeObj.View("actionView", {
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				border: "5px solid #FF0000",
				borderRadius: "10px",
				left: left,
				top: zoneTop,
				width: "150px",
				height: zoneHeight + "px"
			});

			for (var i = 0; i < specList.length; i++) {
				this.actionView.drawRect({
					color: "#000000", // 边框颜色
					width: "2px", // 边框宽度
					radius: "5px" // 圆角半径（关键！）
				}, {
					top: i * 100 + "px",
					left: "0px",
					width: "150px",
					height: "100px"
				});
				this.actionView.drawRect({
					color: "#ffffff", // 边框颜色
					width: "2px", // 边框宽度
					radius: "5px" // 圆角半径（关键！）
				}, {
					top: i * 100 + 2 + "px",
					left: "2px",
					width: "146px",
					height: "96px"
				});

				this.actionView.draw([{
					tag: 'font',
					id: 'font' + i,
					text: specList[i].specName,
					textStyles: {
						size: '50px'
					},
					// 添加边框样式
					border: {
						width: '2px', // 边框宽度
						style: 'solid', // 边框样式（solid, dashed, dotted）
						color: '#000000' // 边框颜色（黑色）
					},
					position: {
						top: i * 100 + 25 + 'px',
						left: '0px',
						width: '100%',
						height: '60px'
					}
				}]);
			}

			// 添加点击事件
			this.actionView.addEventListener("click", (e) => {
				const x = e.clientX;
				const y = e.clientY;
				// 判断点击位置
				for (var i = 0; i < specList.length; i++) {
					if (x > 0 && x < 150 && y > i * 100 && y < (i + 1) * 100) {
						that.addCommodity2(commodity, specList[i])
					}
				}

				that.actionView.close();
				that.actionView = null;
				that.maskView.close();
				that.maskView = null;
			});

			this.actionView.show();
		}
		}

	}
</script>

<style lang="scss" scoped>
	.scroll-view2 {
		white-space: nowrap;
	}

	.coach_wrap {
		padding: 5rpx;
		background-color: white;
		font-weight: bold;
		border: solid 1px dodgerblue;
		margin-right: 15rpx;
		display: inline-block;
		border-radius: 10rpx;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.coach_wrap_active {
		color: white !important;
		background-color: dodgerblue !important;
		border-color: dodgerblue !important;
	}

	.input1 {
		background: #f5f5f5;
		height: 28rpx;
		border-radius: 8rpx;
		font-size: 18rpx;
		text-align: center;
		border: 2px solid #919191;
		font-weight: bold;
		color: #5a5a5a;
		width: 70%;
		flex: 1;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		line-height: 28rpx;
	}
	
	.input-active {
		background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
		border: 2px solid #2196f3 !important;
		color: #1565c0 !important;
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3) !important;
	}
	
	.input1:focus {
		border-color: #1976d2;
		box-shadow: 0 0 0 3rpx rgba(33, 150, 243, 0.2);
		background: #ffffff;
	}

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 42rpx;
		justify-content: space-around;
		margin-bottom: 6rpx;
		font-size: 26rpx;
	}

	.mybrankmask .MymaskList .large {
		font-weight: bold;
		height: 42rpx;
		line-height: 42rpx;
		z-index: 5;
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
	
	/* 表头美化样式 */
	.table-header {
		display: flex;
		background: #2196f3;
		font-weight: bold;
		border-bottom: none;
		color: #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3);
		border-radius: 8rpx 8rpx 0 0;
	}

	/* 规格选择弹窗样式（拆包） - 与分级弹窗保持一致 */
	.spec-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 9998;
		animation: fadeIn 0.2s ease-out;
	}
	
	.spec-popup-container {
		position: fixed;
		min-width: 250px;
		max-width: 500px;
		background-color: #ffffff;
		border: 3px solid #00aaff;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		z-index: 9999;
		animation: scaleIn 0.2s ease-out;
		display: flex;
		flex-direction: column;
	}
	
	.spec-popup-content {
		padding: 5px;
		overflow-y: auto;
		max-height: 450px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.spec-item {
		min-height: 70px;
		padding: 12px;
		border: 3px solid #7e7e7e;
		border-radius: 8px;
		background: #ffffff;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.spec-item:hover {
		border-color: #00aaff;
		background: linear-gradient(135deg, rgba(0, 170, 255, 0.05) 0%, rgba(0, 136, 204, 0.05) 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
	}
	
	.spec-item:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(0, 170, 255, 0.3);
	}
	
	.spec-item-name {
		font-size: 18rpx;
		font-weight: bold;
		color: #333;
		line-height: 1.4;
		word-break: break-all;
	}
	
	.spec-item-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	
	.spec-item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	
	/* 多等级商品弹窗样式 */
	.multilevel-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 9998;
		animation: fadeIn 0.2s ease-out;
	}
	
	.multilevel-popup-container {
		position: fixed;
		min-width: 250px;
		max-width: 500px;
		background-color: #ffffff;
		border: 3px solid #00aaff;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		z-index: 9999;
		animation: scaleIn 0.2s ease-out;
		display: flex;
		flex-direction: column;
	}
	
	.multilevel-popup-content {
		padding: 5px;
		overflow-y: auto;
		max-height: 450px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.multilevel-grid-item {
		min-height: 70px;
		padding: 12px;
		border: 3px solid #7e7e7e;
		border-radius: 8px;
		background: #ffffff;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.multilevel-grid-item:hover {
		border-color: #00aaff;
		background: #f0f9ff;
		box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
		transform: translateX(5px);
	}
	
	.multilevel-grid-item:active {
		transform: translateX(5px) scale(0.98);
		background: #e6f7ff;
	}
	
	.multilevel-item-name {
		font-size: 18rpx;
		font-weight: bold;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.multilevel-item-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 14px;
	}
	
	.multilevel-item-tags {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}
	
	.tag {
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 12rpx;
		font-weight: 600;
		white-space: nowrap;
	}
	
	.tag-unfixed {
		color: #00aa00;
		border: 1px solid #00aa00;
		background: rgba(0, 170, 0, 0.1);
	}
	
	.tag-fixed {
		color: #55aaff;
		border: 1px solid #55aaff;
		background: rgba(85, 170, 255, 0.1);
	}
	
	.tag-unpack {
		color: #dc9300;
		border: 1px solid #dc9300;
		background: rgba(220, 147, 0, 0.1);
	}
	
	.tag-bulk {
		color: #55aaff;
		border: 1px solid #55aaff;
		background: rgba(85, 170, 255, 0.1);
	}
	
	.tag-extra {
		color: #ff5500;
		border: 1px solid #ff5500;
		background: rgba(255, 85, 0, 0.1);
	}
	
	/* 淡入动画 */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	/* 缩放动画 */
	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>