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
						{{currentShipper.shipperName}} — 采购单
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
							<input @click="showKeyBorad(index,1)" inputmode="none" 
								:class="['input1', { 'input-active': editingIndex === index && valueType === 1 }]"
								v-model="item.initMount" />
							<!-- <text style="font-size: 16px; color: #666; font-weight: 500; min-width: 40rpx;">{{ item.spec ? item.spec.specName : '件' }}</text> -->
						</div>
						<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
							<input @click="showKeyBorad(index,2)" inputmode="none" 
								:class="['input1', { 'input-active': editingIndex === index && valueType === 2 }]"
								v-model="item.initWeight" />
						</div>
					<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
						<input @click="showKeyBorad(index,3)" inputmode="none" 
							:class="['input1', { 'input-active': editingIndex === index && valueType === 3 }]"
							v-model="item.incomingPrice" />
					</div>
					<div style="flex: 2; padding: 8px; text-align: center; display: flex; align-items: center; justify-content: center;">
						<span style="font-weight: bold; color: #ff6600;font-size: 18rpx;">{{ getCostPrice(item) }}</span>
					</div>
					<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
						<input @click="showKeyBorad(index,4)" inputmode="none" 
							:class="['input1', { 'input-active': editingIndex === index && valueType === 4 }]"
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

	<!-- 添加/编辑费用弹窗 -->
	<view v-if="expenseModalVisible" class="expense-modal-mask" @click="cancelExpense">
		<view class="expense-modal-wrapper" @click.stop>
			<view class="expense-modal-container">
			<!-- 标题区域 -->
			<view class="expense-modal-header">
				<button class="expense-header-btn cancel" @click="cancelExpense">
					<uni-icons type="closeempty" size="20" color="#ffffff"></uni-icons>
					取消
				</button>
				<text class="header-title">{{ editingExpenseId ? '编辑费用' : '添加费用' }}</text>
				<button class="expense-header-btn confirm" @click="confirmExpense" 
					:class="{ disabled: tempExpenseAmount <= 0 || !selectedAllocationMethod }"
					:disabled="tempExpenseAmount <= 0 || !selectedAllocationMethod">
					<uni-icons type="checkmarkempty" size="20" color="#fff"></uni-icons>
					{{ editingExpenseId ? '保存' : '确认添加' }}
				</button>
			</view>
			
		<!-- 内容区域（可滚动） -->
		<scroll-view scroll-y class="expense-modal-content">
		<view class="expense-modal-content-inner">
					
					<!-- 费用金额输入框 -->
					<view class="input-wrapper">
							<view class="input-label">
								<text class="label-text">费用金额</text>
								<text class="label-required">*</text>
							</view>
							<view class="input-container">
								<text class="input-prefix">¥</text>
								<input 
									type="digit"
									v-model="tempExpenseAmount" 
									placeholder="0.00"
									class="expense-input"
									@input="validateExpenseAmount"
								/>
								<button 
									v-if="tempExpenseAmount && tempExpenseAmount > 0" 
									@click="tempExpenseAmount = 0"
									class="clear-expense-btn"
								>
									清空
								</button>
							</view>
							<text class="input-hint">费用将按选择的方式分摊到各商品</text>
						</view>
						
						<!-- 均摊方式选择 -->
						<view class="allocation-section">
							<text class="section-label">均摊方式</text>
							<view class="allocation-buttons">
								<view 
									v-for="method in allocationMethods" 
									:key="method.value"
									@click="selectedAllocationMethod = method.value"
									class="allocation-btn"
									:class="{ active: selectedAllocationMethod === method.value }"
								>
									<view class="allocation-btn-content">
										<uni-icons :type="method.icon" size="24" :color="selectedAllocationMethod === method.value ? '#fff' : '#606266'"></uni-icons>
										<text class="allocation-btn-text">{{ method.label }}</text>
									</view>
								</view>
							</view>
						<text class="allocation-hint" v-if="selectedAllocationMethod">
							{{ getAllocationHint() }}
						</text>
					</view>
					
				<!-- 费用类型选择 -->
				<view class="expense-type-section">
					<view class="section-label-wrapper">
						<text class="section-label">费用类型</text>
						<view class="add-type-btn" @click="showAddTypeModal">
							<uni-icons type="plusempty" size="20" color="#00aaff"></uni-icons>
						</view>
					</view>
					<view class="expense-type-buttons">
							<view 
								v-for="type in expenseTypes" 
								:key="type.id"
								@click="selectedExpenseType = type.id"
								class="expense-type-btn"
								:class="{ active: selectedExpenseType === type.id }"
							>
								<text class="expense-type-text">{{ type.label }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			</view>
		</view>
	</view>
	
	<!-- 添加费用类型弹窗 -->
	<view v-if="addTypeModalVisible" class="add-type-modal-mask" @click="cancelAddType">
		<view class="add-type-modal-wrapper" @click.stop>
			<view class="add-type-modal-container">
				<!-- 标题 -->
				<view class="add-type-modal-header">
					<button class="expense-header-btn cancel" @click="cancelAddType">
						<uni-icons type="closeempty" size="20" color="#ffffff"></uni-icons>
						取消
					</button>
					<text class="header-title">添加费用类型</text>
					<button class="expense-header-btn confirm" @click="confirmAddType"
						:class="{ disabled: !newExpenseTypeName || newExpenseTypeName.trim() === '' }"
						:disabled="!newExpenseTypeName || newExpenseTypeName.trim() === ''">
						<uni-icons type="checkmarkempty" size="20" color="#fff"></uni-icons>
						确认
					</button>
				</view>
				
				<!-- 输入框 -->
				<view class="add-type-modal-content">
					<view class="input-wrapper">
						<text class="input-label-text">类型名称</text>
						<input 
							type="text"
							v-model="newExpenseTypeName" 
							placeholder="请输入费用类型名称（最多10个字）"
							class="type-name-input"
							maxlength="10"
						/>
					</view>
				</view>
			</view>
		</view>
	</view>
	
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
	import labelApi from '../../api/label/labelApi';
	import batch from '../../api/batch/batch'
	import AddGoodModalAdvanced from '../../components/AddGoodModal/AddGoodModalAdvanced.vue'
	import SimpleSelect from '../../components/SimpleSelect/SimpleSelect.vue'
	import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
	
	export default {
		components: {
			AddGoodModalAdvanced,
			SimpleSelect,
			GoodsSelector
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
				currentShipper: '',
				currentShipperName: '',
				editingIndex: 0,
				selectedProductType: "",
				showKeyBoard1: false,
				actionView: null,
				maskView: null,
				editType: "common",
				BatchCommodityList: [],
			targetId: "id-0-view",
			unitList: [], // 单位列表
			extralModelList: [], // 附加物品列表
		newGoodInfo: {
				name: "",
				classifyId: "",
				saleWay: 1, // 默认按重量
				unit: "件", // 默认单位
				unitList: [],
				price: "", // 价格
				initWeight: "", // 单位重量
				fixTare: "", // 单位皮重
				showToSale: 1, // 是否显示，默认显示
				specList: [] // 规格列表
			},
				showComfirmBtn: true,
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
				],
		// 费用相关
		expenseList: [], // 费用列表，存储多个费用
		expenseManageModalVisible: false, // 费用管理弹窗
		expenseModalVisible: false, // 添加/编辑费用弹窗
		tempExpenseAmount: 0,
		selectedAllocationMethod: 4, // 默认选中不均摊
		lastExpenseAmount: 0, // 上一次的费用金额
		lastAllocationMethod: 4, // 上一次的均摊方式，默认不均摊
		totalExpense: 0, // 累计总费用（计算属性）
		allocationMethods: [
			{ value: 2, label: '按数量均摊', icon: '' },
			{ value: 1, label: '按重量均摊', icon: '' },
			{ value: 3, label: '按种类均摊', icon: '' },
			{ value: 4, label: '不均摊', icon: '' }
		],
		// 费用类型选项
		expenseTypes: [],
		selectedExpenseType: 'shipping', // 默认选中运费
		lastExpenseType: 'shipping', // 上一次选中的费用类型
		editingExpenseId: null, // 正在编辑的费用ID（null表示新增）
		// 添加费用类型弹窗相关
		addTypeModalVisible: false,
		newExpenseTypeName: '',
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
		}
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
			// if (this.editType === "common") {

			this.currentShipper = JSON.parse(options.shipper);
			// } else {
			// 	var batchSimple = JSON.parse(options.Batch);
			// 	batch.getBatchInfoById(batchSimple.id).then(res => {
			// 		this.BatchInfo = res.data;
			// 		this.getLastBatchCommodityList(this.BatchInfo.companyId, this.BatchInfo.shipperId)
			// 	})
			// }

		},
	mounted() {
		// 在组件挂载后设置 scrollHeight
		this.scrollHeight = uni.getWindowInfo().windowHeight - 165; // 调整搜索框后的高度
		this.windowHeight = uni.getWindowInfo().windowHeight;
		this.companyId = uni.getStorageSync('companyId');
		this.getAllcommodity();
		if (this.editType === "common") {
			// this.getBatchCommodityList();
		}
		this.initSystem();
		// 初始化费用类型列表
		this.getExpenseLabel();
		this.getCompanyUnit();
		this.getAllextralModel();
	},
		methods: {
		getCompanyUnit(){
			let that = this;
			labelApi.GetCompanyUnit(this.companyId).then(res => {
				that.unitList = res.data;
				
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
					element.calcType = 2;
				} else {
					element.calcType = 1
				}
				this.calcCommodityaddedInboundAmount(element);
			},
			onProductTypeChange() {

			},
			// 计算成本单价
			getCostPrice(item) {
				// 如果没有原始采购单价，则使用当前采购单价
				const originalPrice = parseFloat(item.originalIncomingPrice || item.incomingPrice) || 0;
				const expenseAllocated = parseFloat(item.expenseAllocated) || 0;
				
				// 成本单价 = 原始采购单价 + (分摊费用 / 数量或重量)
				console.log("expenseAllocated",expenseAllocated);
				console.log("item",item);
				let costPerUnit = originalPrice;
				if (expenseAllocated > 0) {
					if (item.calcType === 2) {
						// 按重量计算
						const weight = parseFloat(item.initWeight) || 0;
						if (weight > 0) {
							costPerUnit = originalPrice + (expenseAllocated / weight);
						}
						if(weight === 0){
							costPerUnit = originalPrice;
						}
						console.log("costPerUnit",costPerUnit);
					} else {
						// 按数量计算
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
			}, 0);
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
	// 处理组件确认添加货品
	handleAddNewGood(formData) {
		// 将组件返回的数据赋值给 newGoodInfo
		this.newGoodInfo = { ...formData };
		// 调用原有的添加逻辑
		this.addNewGood();
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
	// 选择单位
	selectUnit(unit) {
		this.newGoodInfo.unit = unit;
		// 如果是按件拆包类型，也要更新specList中的单位
		if (this.newGoodInfo.saleWay === 3 && this.newGoodInfo.specList.length > 0) {
			this.newGoodInfo.specList[0].specName = unit;
		}
	},
	// 更新主单位（按件拆包时）
	updateMainUnit() {
		// 当按件拆包的主单位改变时，同步到newGoodInfo.unit
		if (this.newGoodInfo.specList.length > 0) {
			this.newGoodInfo.unit = this.newGoodInfo.specList[0].specName;
		}
	},
	// 选择商品分类（确保只能选择一个）
	selectCategory(classifyId) {
		console.log("this.tabListOrigin", this.tabListOrigin)
		console.log("this.classifyId", classifyId)
		this.newGoodInfo.classifyId = classifyId;
	},
	changeTab(e) {
		// 分类切换已由 GoodsSelector 组件内部处理
		// 这里可以添加额外的分类切换相关逻辑（如果需要）
		console.log('切换分类:', e.name);
	},
		// 搜索处理（由组件触发）
		handleSearch(keyword) {
			// 搜索逻辑已在 GoodsSelector 组件内部处理
			// 这里可以添加额外的搜索相关逻辑（如果需要）
			console.log('搜索关键词:', keyword);
		},
			//键盘数字输入处理
			NumberCk(val) {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
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
				this.BatchCommodityList[this.editingIndex].initMount = myvalue;
				// 数量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 2:
				this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
				// 重量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 3:
				this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
				//输入入库单价计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 4:
				this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
				//输入入库金额计算单价
				this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
				break;
		}
	},
			//键盘删除处理
			Tuige() {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
		myvalue = myvalue ? myvalue.toString() : '';
		myvalue = myvalue.slice(0, -1);
		switch (this.valueType) {
			case 1:
				this.BatchCommodityList[this.editingIndex].initMount = myvalue;
				// 数量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 2:
				this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
				// 重量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 3:
				this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
				//输入入库单价计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 4:
				this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
				//输入入库金额计算单价
				this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
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
			this.editingIndex = -1;
			this.valueType = 0;
		},
			getLastBatchCommodityList(companyId, shipperId) {
				batch.GetLastBatchCommodity(companyId, shipperId).then(res => {
					this.BatchCommodityList = res.data;
					for (var i = 0; i < this.BatchCommodityList.length; i++) {
						this.BatchCommodityList[i].id = "";
						this.BatchCommodityList[i].inventory = this.BatchCommodityList[i].initInventory;
					}
				})
			},
		//计算添加货品的入库金额 2-按重量计算 1-按数量计算（基于成本单价）
		calcCommodityaddedInboundAmount(commodityAdded) {
			// 更新原始采购单价
			commodityAdded.originalIncomingPrice = commodityAdded.incomingPrice || 0;
			
			// 获取成本单价（采购单价 + 单位费用）
			const costPrice = parseFloat(this.getCostPrice(commodityAdded));
			
			if (commodityAdded.calcType === 2) {
				// 按重量计算：入库金额 = 重量 × 成本单价
				const weight = parseFloat(commodityAdded.initWeight) || 0;
				console.log("weight",weight);
				commodityAdded.inboundAmount = (weight * costPrice).toFixed(1);
			}
			if (commodityAdded.calcType === 1) {
				// 按数量计算：入库金额 = 数量 × 成本单价
				const quantity = parseFloat(commodityAdded.initMount) || 0;
				commodityAdded.inboundAmount = (quantity * costPrice).toFixed(1);
			}
		},
		//根据入库金额反推采购单价 2-按重量计算 1-按数量计算（扣除费用分摊）
		calcCommodityaddedincomingPrice(commodityAdded) {
			// 计算单位费用
			let unitExpense = 0;
			const expenseAllocated = parseFloat(commodityAdded.expenseAllocated) || 0;
			const inboundAmount = parseFloat(commodityAdded.inboundAmount) || 0;
			
			if (commodityAdded.calcType === 2) {
				// 按重量计算：采购单价 = (入库金额 / 重量) - 单位费用
				const weight = parseFloat(commodityAdded.initWeight) || 0;
				if (weight > 0) {
					unitExpense = expenseAllocated / weight;
					commodityAdded.incomingPrice = ((inboundAmount / weight) - unitExpense).toFixed(2);
					// 更新原始采购单价
					commodityAdded.originalIncomingPrice = commodityAdded.incomingPrice;
				}
			}
			if (commodityAdded.calcType === 1) {
				// 按数量计算：采购单价 = (入库金额 / 数量) - 单位费用
				const quantity = parseFloat(commodityAdded.initMount) || 0;
				if (quantity > 0) {
					unitExpense = expenseAllocated / quantity;
					commodityAdded.incomingPrice = ((inboundAmount / quantity) - unitExpense).toFixed(2);
					// 更新原始采购单价
					commodityAdded.originalIncomingPrice = commodityAdded.incomingPrice;
				}
			}
		},
			getBatchCommodityList() {
				category.GetBybatchId(this.BatchInfo.id).then(res => {
					this.BatchCommodityList = res.data;
				})
			},
			saveBatchGood() {
				let that = this;
				that.showComfirmBtn = false;
				var CommodityList = [];
				that.BatchCommodityList.forEach(item => {
					CommodityList.push({
						"commodityId": item.commodityId,
						"calcType": item.calcType,
						"initMount": parseFloat(item.initMount),
						"initWeight": parseFloat(item.initWeight),
						"incomingPrice": parseFloat(item.incomingPrice),
						"costPrice":parseFloat(that.getCostPrice(item)),
						"inboundAmount": parseFloat(item.inboundAmount),
						"purchaseInventories": [{
							"specId": item.spec.id,
							"mount": parseFloat(item.initMount)
						}]
					})
				})

		// 构建费用列表
		var purchaseExpenseList = [];
		that.expenseList.forEach(expense => {
			purchaseExpenseList.push({
				"label": expense.label, // 费用名称
				"amount": parseFloat(expense.amount), // 费用金额
				"purchaseOrderCostType": expense.allocationType // 均摊方式
			});
		});
		
		// 构建基本参数
		var param = {
			shipperId: that.currentShipper.id,
			companyId: that.companyId,
			purchaseEmployList: CommodityList,
			purchaseOrderCostList: purchaseExpenseList
		}
		
		console.log("提交参数", param);
				if (that.BatchCommodityList.length > 0) {
					category.CreatePurchaseOrder(JSON.stringify(param)).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '采购成功',
								icon: 'none',
								duration: 2000
							})
							that.back()
						} else {
							uni.showToast({
								title: res.message || '采购失败',
								icon: 'none',
								duration: 2000
							})
							that.showComfirmBtn = true;
						}
					}).catch(error => {
						console.error('采购订单提交失败:', error);
						uni.showToast({
							title: error.message || '网络错误，请稍后重试',
							icon: 'none',
							duration: 3000
						});
						that.showComfirmBtn = true;
					})
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
				this.commodityList = res.data;
				this.tabList = [{
					name: "全部",
					value: 0
				}];
				this.tabListOrigin = [];
				console.log("res", res.data)
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
						this.newGoodInfo.classifyId = this.tabListOrigin[0].value;
					}
				});
			});
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
				calcType: e.saleWay === 2?2:1,
				saleWay: e.saleWay,
				incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
				originalIncomingPrice: e.incomingPrice ? e.incomingPrice : 0, // 保存原始采购单价
				expenseAllocated: 0, // 初始化分摊费用为0
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
	//用于添加拆包商品
	addCommodity2(e,spec) {
		// if (this.getCommdityActive(e.id)) return;
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
				originalIncomingPrice: e.incomingPrice ? e.incomingPrice : 0, // 保存原始采购单价
				expenseAllocated: 0, // 初始化分摊费用为0
				inboundAmount: 0
			}
			commodityAdded.spec =spec
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
				zoneTop = zoneTop + zoneHeight > plus.screen.resolutionHeight ? plus.screen.resolutionHeight - zoneHeight :
					zoneTop;
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
			},
	// 费用管理弹窗方法
	showExpenseManageModal() {
		this.expenseManageModalVisible = true;
		// 如果没有费用，直接打开添加费用弹窗
		if (this.expenseList.length === 0) {
			this.$nextTick(() => {
				this.openAddExpenseModal();
			});
		}
	},
	closeExpenseManageModal() {
		this.expenseManageModalVisible = false;
		// 重新计算所有费用分摊
		this.recalculateAllExpenses();
	},
	// 打开添加费用弹窗
	openAddExpenseModal() {
		this.editingExpenseId = null;
		this.getExpenseLabel();
		this.expenseModalVisible = true;
		// 回填上一次的值
		this.tempExpenseAmount = this.lastExpenseAmount || 0;
		this.selectedAllocationMethod = this.lastAllocationMethod || 4;
		this.selectedExpenseType = this.lastExpenseType || (this.expenseTypes.length > 0 ? this.expenseTypes[0].id : '');
	},
	// 编辑费用
	editExpense(expense) {
		this.editingExpenseId = expense.id;
		this.getExpenseLabel();
		this.expenseModalVisible = true;
		// 回填费用数据
		this.tempExpenseAmount = expense.amount;
		this.selectedAllocationMethod = expense.allocationType;
		this.selectedExpenseType = expense.typeId;
	},
	// 删除费用
	deleteExpense(expenseId) {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这个费用吗？',
			success: (res) => {
				if (res.confirm) {
					this.expenseList = this.expenseList.filter(item => item.id !== expenseId);
					uni.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1500
					});
					// 重新计算费用分摊
					this.recalculateAllExpenses();
				}
			}
		});
	},
	cancelExpense() {
		this.expenseModalVisible = false;
		this.editingExpenseId = null;
		this.tempExpenseAmount = 0;
		this.selectedAllocationMethod = 4;
	},
	// 计算总费用
	getTotalExpense() {
		return this.expenseList.reduce((total, expense) => {
			return total + (parseFloat(expense.amount) || 0);
		}, 0);
	},
	// 获取均摊方式标签
	getAllocationMethodLabel(value) {
		const method = this.allocationMethods.find(m => m.value === value);
		return method ? method.label : '未知方式';
	},
	validateExpenseAmount() {
		if (this.tempExpenseAmount < 0) {
			this.tempExpenseAmount = 0;
		}
	},
	// 生成UUID（用于费用ID）
	generateExpenseId() {
		return 'expense-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
	},
	// 添加费用类型弹窗相关方法
	showAddTypeModal() {
		this.addTypeModalVisible = true;
		this.newExpenseTypeName = '';
	},
	cancelAddType() {
		this.addTypeModalVisible = false;
		this.newExpenseTypeName = '';
	},
	confirmAddType() {
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
		const exists = this.expenseTypes.some(type => type.label === typeName);
		if (exists) {
			uni.showToast({
				title: '该费用类型已存在',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		this.addExpenseLabel(typeName);
	},
	// 添加费用标签
	addExpenseLabel(label) {
			var userInfo = uni.getStorageSync("userInfo");
			const labelData = {
				companyId: this.companyId,
				label: label.trim(),
				labelType: 2,
				operatorId: userInfo.id
			};
			
		labelApi.createExpenseLabel(labelData).then(res => {
			if (res.code === 200) {
				uni.showToast({
					title: "添加成功",
					icon: "success"
				});
				
				// 重新获取标签列表
				this.getExpenseLabel();
				
				// 自动选中新添加的费用类型
				// 等待getExpenseLabel()完成后，通过label匹配找到对应的类型
				setTimeout(() => {
					const newType = this.expenseTypes.find(type => type.label === label.trim());
					if (newType) {
						this.selectedExpenseType = newType.value || newType.id;
					}
				}, 300);
				
				// 关闭添加类型弹窗
				this.addTypeModalVisible = false;
				this.newExpenseTypeName = '';
			} else {
				uni.showToast({
					title: res.message || "添加失败",
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
	getExpenseLabel(){
		this.expenseTypes = [];
		labelApi.GetExpenseLabel(this.companyId,2).then(res=>{
			if(res.code === 200){
				this.expenseTypes = res.data || [];
				
				// 如果费用类型列表不为空，且当前选中的费用类型无效，则设置为第一个
				if (this.expenseTypes.length > 0) {
					const validType = this.expenseTypes.find(type => 
						type.value === this.selectedExpenseType || type.id === this.selectedExpenseType
					);
					if (!validType) {
						// 当前选中的费用类型无效，设置为第一个
						this.selectedExpenseType = this.expenseTypes[0].value || this.expenseTypes[0].id;
						this.lastExpenseType = this.selectedExpenseType;
					}
				}
			}
		})
	},
	getAllocationHint() {
		const hints = {
			2: '费用将按各商品的入库数量比例进行分摊', // 按数量均摊
			1: '费用将按各商品的入库重量比例进行分摊', // 按重量均摊
			3: '费用将按商品种类数量平均分摊（每个商品分摊相同金额）', // 按种类均摊
			4: '费用将作为单独项目添加，不分摊到商品' // 不均摊
		};
		return hints[this.selectedAllocationMethod] || '';
	},
	// 重新计算所有商品的入库金额（基于成本单价）
	recalculateAllInboundAmount() {
		this.BatchCommodityList.forEach(item => {
			// 获取成本单价
			const costPrice = parseFloat(this.getCostPrice(item));
			
			// 根据计算类型重新计算入库金额
			if (item.calcType === 2) {
				// 按重量计算
				const weight = parseFloat(item.initWeight) || 0;
				item.inboundAmount = (weight * costPrice).toFixed(2);
			} else {
				// 按数量计算
				const quantity = parseFloat(item.initMount) || 0;
				item.inboundAmount = (quantity * costPrice).toFixed(2);
			}
		});
	},
	// 重新计算所有费用分摊
	recalculateAllExpenses() {
		// 先清空所有商品的费用分配
		this.BatchCommodityList.forEach(item => {
			item.expenseAllocated = 0;
		});
		
		// 遍历费用列表，累加每个费用的分摊
		this.expenseList.forEach(expense => {
			const expenseAmount = parseFloat(expense.amount) || 0;
			const allocationType = expense.allocationType;
			
			// 根据不同的均摊方式处理费用
			switch(allocationType) {
				case 2: // 按数量均摊
					this.allocateExpenseByQuantity(expenseAmount);
					break;
				case 1: // 按重量均摊
					this.allocateExpenseByWeight(expenseAmount);
					break;
				case 3: // 按种类均摊
					this.allocateExpenseByCategory(expenseAmount);
					break;
				case 4: // 不均摊
					// 不均摊不需要分配到商品
					break;
			}
		});
		
		// 重新计算所有商品的入库金额（基于成本单价）
		this.recalculateAllInboundAmount();
		
		// 强制更新视图
		this.$forceUpdate();
	},
	// 按数量均摊费用（累加模式）
	allocateExpenseByQuantity(expenseAmount) {
		const totalQuantity = this.totalInitInventory();
		if (totalQuantity === 0) {
			return;
		}
		
		this.BatchCommodityList.forEach(item => {
			// 保存原始采购单价（如果还没保存）
			if (!item.originalIncomingPrice) {
				item.originalIncomingPrice = item.incomingPrice || 0;
			}
			
			const quantity = parseFloat(item.initMount) || 0;
			const allocation = (quantity / totalQuantity) * expenseAmount;
			
			// 累加费用分摊
			item.expenseAllocated = (parseFloat(item.expenseAllocated) || 0) + allocation;
		});
	},
	// 按重量均摊费用（累加模式）
	allocateExpenseByWeight(expenseAmount) {
		const totalWeight = this.totalInitWeight();
		if (totalWeight === 0) {
			return;
		}
		
		this.BatchCommodityList.forEach(item => {
			// 保存原始采购单价（如果还没保存）
			if (!item.originalIncomingPrice) {
				item.originalIncomingPrice = item.incomingPrice || 0;
			}
			
			const weight = parseFloat(item.initWeight) || 0;
			const allocation = (weight / totalWeight) * expenseAmount;
			
			// 累加费用分摊
			item.expenseAllocated = (parseFloat(item.expenseAllocated) || 0) + allocation;
		});
	},
	// 按种类均摊费用（累加模式）
	allocateExpenseByCategory(expenseAmount) {
		const itemCount = this.BatchCommodityList.length;
		
		if (itemCount === 0) {
			return;
		}
		
		// 每个商品分摊相同的费用金额
		const expensePerItem = expenseAmount / itemCount;
		
		this.BatchCommodityList.forEach(item => {
			// 保存原始采购单价（如果还没保存）
			if (!item.originalIncomingPrice) {
				item.originalIncomingPrice = item.incomingPrice || 0;
			}
			
			// 累加费用分摊
			item.expenseAllocated = (parseFloat(item.expenseAllocated) || 0) + expensePerItem;
		});
	},
confirmExpense() {
	// 验证费用金额
	if (this.tempExpenseAmount <= 0) {
		uni.showToast({
			title: '费用金额必须大于0',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	if (!this.selectedAllocationMethod) {
		uni.showToast({
			title: '请选择均摊方式',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	if (!this.selectedExpenseType) {
		uni.showToast({
			title: '请选择费用类型',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	const expenseAmount = parseFloat(this.tempExpenseAmount) || 0;
	
	// 获取费用类型的label（名称）
	const expenseType = this.expenseTypes.find(type => 
		type.id === this.selectedExpenseType || type.value === this.selectedExpenseType
	);
	
	if (!expenseType) {
		uni.showToast({
			title: '费用类型无效',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	if (this.editingExpenseId) {
		// 编辑模式：更新现有费用
		const index = this.expenseList.findIndex(item => item.id === this.editingExpenseId);
		if (index !== -1) {
			this.expenseList[index] = {
				id: this.editingExpenseId,
				label: expenseType.label,
				amount: expenseAmount,
				allocationType: this.selectedAllocationMethod,
				typeId: this.selectedExpenseType
			};
			uni.showToast({
				title: '费用修改成功',
				icon: 'success',
				duration: 1500
			});
		}
	} else {
		// 新增模式：添加新费用
		const newExpense = {
			id: this.generateExpenseId(),
			label: expenseType.label,
			amount: expenseAmount,
			allocationType: this.selectedAllocationMethod,
			typeId: this.selectedExpenseType
		};
		
		this.expenseList.push(newExpense);
		uni.showToast({
			title: '费用添加成功',
			icon: 'success',
			duration: 1500
		});
	}
	
	// 保存本次输入的值，供下次打开时回填
	this.lastExpenseAmount = this.tempExpenseAmount;
	this.lastAllocationMethod = this.selectedAllocationMethod;
	this.lastExpenseType = this.selectedExpenseType;
	
	// 重新计算所有费用分摊
	this.recalculateAllExpenses();
	
	// 关闭添加/编辑费用弹窗
	this.expenseModalVisible = false;
	this.editingExpenseId = null;
	
	// 强制更新视图
	this.$forceUpdate();
}

		}

	}
</script>

<style lang="scss" scoped>
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
		
		&:hover {
			transform: scale(1.05);
			box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.4);
		}
		
		&:active {
			transform: scale(0.98);
		}
		
		.expense-label-text {
			font-size: 13rpx;
			font-weight: bold;
			color: white;
			line-height: 25rpx;
		}
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
	
	/* 费用列表内容样式 */
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
		
		.empty-text {
			margin-top: 20px;
			font-size: 16px;
			color: #909399;
		}
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
		
		&:hover {
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
			transform: translateY(-2px);
		}
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
		
		&.edit {
			background: #ecf5ff;
			
			&:hover {
				background: #d9ecff;
				transform: scale(1.1);
			}
		}
		
		&.delete {
			background: #fef0f0;
			
			&:hover {
				background: #fde2e2;
				transform: scale(1.1);
			}
		}
		
		&:active {
			transform: scale(0.95);
		}
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

			&:hover {
				background: rgba(255, 255, 255, 0.2);
				border-color: rgba(255, 255, 255, 0.8);
			}

			&.confirm {
				background: rgba(255, 255, 255, 0.2);
				
				&.disabled {
					background: rgba(255, 255, 255, 0.1);
					opacity: 0.5;
					cursor: not-allowed;
					
					&:hover {
						background: rgba(255, 255, 255, 0.1);
						border-color: rgba(255, 255, 255, 0.5);
					}
				}

				&:not(.disabled):hover {
					background: rgba(255, 255, 255, 0.3);
					transform: translateY(-1px);
				}
			}

			&:active:not(.disabled) {
				transform: scale(0.98);
			}
		}
	}

	.expense-modal-content {
		// scroll-view样式
		height: 500px;
		max-height: 60vh;
		
		.expense-modal-content-inner {
			padding: 32px 28px;
		}

		.input-wrapper {
			margin-bottom: 32px;

			.input-label {
				display: flex;
				align-items: center;
				margin-bottom: 12px;

				.label-text {
					font-size: 20px;
					font-weight: 600;
					color: #303133;
				}

				.label-required {
					color: #f56c6c;
					margin-left: 6px;
					font-size: 22px;
				}
			}

			.input-container {
				display: flex;
				align-items: center;
				padding: 0 20px;
				background: #fff;
				border: 3px solid #dcdfe6;
				border-radius: 10px;
				transition: all 0.3s ease;
				position: relative;

				&:focus-within {
					border-color: #00aaff;
					box-shadow: 0 0 0 4px rgba(0, 170, 255, 0.1);
				}

				.input-prefix {
					font-size: 28px;
					font-weight: bold;
					color: #909399;
					margin-right: 6px;
				}

				.expense-input {
					flex: 1;
					height: 30rpx;
					padding: 0px 0px 0px 0;
					border: none;
					font-size: 25rpx;
					font-weight: bold;
					color: #303133;
					outline: none;
					background: transparent;
				}

				.clear-expense-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 4px 8px;
					margin-left: 12px;
					background: #f5f7fa;
					color: #606266;
					font-size: 18px;
					font-weight: 600;
					border: 2px solid #e4e7ed;
					border-radius: 8px;
					cursor: pointer;
					transition: all 0.2s ease;
					white-space: nowrap;

					&:hover {
						background: #ecf5ff;
						border-color: #b3d8ff;
						color: #409eff;
					}

					&:active {
						background: #d9ecff;
						transform: scale(0.96);
					}
				}
			}

			.input-hint {
				display: block;
				margin-top: 10px;
				font-size: 16px;
				color: #909399;
				padding-left: 6px;
			}
		}

	.allocation-section {
		.section-label {
			display: block;
			font-size: 20px;
			font-weight: 600;
			color: #303133;
			margin-bottom: 16px;
		}

		.allocation-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 14px;
			margin-bottom: 16px;

				.allocation-btn {
					flex: 0 0 calc(50% - 7px);
					padding: 16px 12px;
					background: #f5f7fa;
					border: 3px solid #e4e7ed;
					border-radius: 10px;
					cursor: pointer;
					transition: all 0.2s ease;

					.allocation-btn-content {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 8px;

						.allocation-btn-text {
							font-size: 18px;
							font-weight: bold;
							color: #606266;
						}
					}

					&:hover {
						background: #ecf5ff;
						border-color: #b3d8ff;

						.allocation-btn-text {
							color: #409eff;
						}
					}

					&.active {
						background: #00aaff;
						border-color: #00aaff;
						transform: scale(1.02);

						.allocation-btn-text {
							color: white;
						}
					}

					&:active {
						transform: scale(0.98);
					}
				}
			}

			.allocation-hint {
				display: block;
				padding: 12px 16px;
				background: #f0f9ff;
				border-left: 4px solid #00aaff;
				border-radius: 6px;
				font-size: 15px;
				color: #606266;
				line-height: 1.5;
			}
		}
	}

	/* 费用类型选择样式 */
	.expense-type-section {
		margin-top: 24px;
		
		.section-label-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16px;
			
			.section-label {
				font-size: 20px;
				font-weight: 600;
				color: #303133;
			}
			
			.add-type-btn {
				width: 36px;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #e8f3ff;
				border-radius: 50%;
				
				
			}
		}
		
		.expense-type-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			
			.expense-type-btn {
				flex: 0 0 calc(25% - 9px);
				padding: 12px 8px;
				background: #f5f7fa;
				border: 2px solid #e4e7ed;
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.2s ease;
				text-align: center;
				
				&:hover {
					background: #e8f3ff;
					border-color: #00aaff;
					transform: translateY(-2px);
				}
				
				&.active {
					background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
					border-color: #00aaff;
					box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
					
					.expense-type-text {
						color: #fff;
						font-weight: 600;
					}
				}
				
				.expense-type-text {
					font-size: 16px;
					color: #606266;
					font-weight: 500;
				}
			}
		}
	}
	
	/* 添加费用类型弹窗样式 */
	.add-type-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10001;
	}
	
	.add-type-modal-wrapper {
		width: 90%;
		max-width: 500px;
	}
	
	.add-type-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		animation: modalSlideIn 0.3s ease-out;
	}
	
	.add-type-modal-header {
		padding: 15px 20px;
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.header-title {
			font-size: 24px;
			font-weight: bold;
			color: #ffffff;
			flex: 1;
			text-align: center;
		}
	}
	
	.add-type-modal-content {
		padding: 40px 32px;
		
		.input-wrapper {
			.input-label-text {
				display: block;
				font-size: 18px;
				font-weight: 600;
				color: #303133;
				margin-bottom: 16px;
			}
			
			.type-name-input {
				width: 100%;
				height: 56px;
				padding: 0 20px;
				font-size: 18px;
				color: #303133;
				background: #f5f7fa;
				border: 3px solid #e4e7ed;
				border-radius: 10px;
				box-sizing: border-box;
				transition: all 0.2s ease;
				
				&:focus {
					background: #ffffff;
					border-color: #00aaff;
					outline: none;
					box-shadow: 0 0 0 4px rgba(0, 170, 255, 0.1);
				}
			}
		}
	}
	
	/* 添加新货品弹窗美化样式 */
	.znj-add-good-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9998;
	}
	
	.znj-add-good-modal-wrapper {
		width: 90%;
		max-width: 900px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}
	
	.znj-add-good-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		max-height: 85vh;
		height: 85vh;
	}
	
	.znj-add-good-modal-header {
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		padding: 20px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.znj-add-good-modal-title {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
		flex: 1;
		text-align: center;
	}
	
	.znj-add-good-header-btn {
		min-width: 80rpx;
		height: 36rpx;
		line-height: 36rpx;
		padding: 0 20rpx;
		border: 2px solid #ffffff;
		border-radius: 8rpx;
		font-size: 16rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		color: #ffffff;
		background: transparent;
	}
	
	.znj-add-good-header-btn.cancel:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.znj-add-good-header-btn.confirm {
		background: rgba(255, 255, 255, 0.15);
	}
	
	.znj-add-good-header-btn.confirm:hover {
		background: rgba(255, 255, 255, 0.3);
	}
	
	.znj-add-good-modal-body {
		flex: 1;
		overflow: hidden;
		min-height: 0;
	}
	.znj-add-good-form {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		padding: 20px;
	}
	.znj-add-good-row {
		display: flex;
		align-items: center;
		gap: 5rpx;
		margin-bottom: 0rpx;
		min-height: 25rpx;
	}
	.znj-add-good-label {
		width: 120rpx;
		font-size: 15rpx;
		color: #333;
		text-align: right;
		font-weight: 500;
		flex-shrink: 0;
	}
	.znj-add-good-input {
		flex: 1;
		height: 32rpx;
		border-radius: 8rpx;
		border: 1px solid #e0e0e0;
		background: #fafbfc;
		padding: 0 16rpx;
		font-size: 15rpx;
		transition: border-color 0.2s;
	}
	.znj-add-good-input:focus {
		border-color: #1976d2;
		outline: none;
	}
	.znj-add-good-btn-group {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-type-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 15rpx;
		height: 35rpx;
		line-height: 35rpx;
		font-size: 20rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-type-btn.active, .znj-add-good-type-btn:hover {
		background: #1976d2;
		color: #fff;
		border-color: #1976d2;
	}
	.znj-add-good-btn.add {
		min-width: 120rpx;
		height: 32rpx;
		line-height: 32rpx;
		padding: 0 20rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 15rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		background: #07c160;
		color: #fff;
		box-shadow: 0 2px 4px rgba(7,193,96,0.2);
	}
	.znj-add-good-btn.add:hover {
		background: #06ad56;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(7,193,96,0.3);
	}
	
	/* 单位选择按钮组 */
	.znj-add-good-unit-group {
		display: flex;
		gap: 8rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-unit-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		padding: 0 12rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 18rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-unit-btn.active, .znj-add-good-unit-btn:hover {
		background: #07c160;
		color: #fff;
		border-color: #07c160;
	}

	.znj-add-good-unit-select {
		padding: 8rpx 12rpx;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		background: #fff;
		font-size: 28rpx;
		color: #333;
		min-width: 100rpx;
		outline: none;
	}

	.znj-add-good-unit-select:focus {
		border-color: #07c160;
	}
	
	.znj-add-good-delete-btn {
		min-width: 60rpx;
		height: 28rpx;
		line-height: 28rpx;
		padding: 0 12rpx;
		border: 1px solid #ff4d4f;
		border-radius: 6rpx;
		font-size: 14rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		background: #fff;
		color: #ff4d4f;
		margin-left: 10rpx;
	}
	
	.znj-add-good-delete-btn:hover {
		background: #ff4d4f;
		color: #fff;
		transform: translateY(-1px);
	}
	
	/* 规格输入框样式 */
	.znj-add-good-spec-box {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		overflow: hidden;
		height: 32rpx;
		margin-left: 10rpx;
		background: #fafbfc;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-spec-prefix, .znj-add-good-spec-suffix {
		background: #1976d2;
		color: #fff;
		font-size: 20rpx;
		padding: 0 12rpx;
		height: 100%;
		display: flex;
		align-items: center;
		font-weight: 500;
	}
	.znj-add-good-spec-suffix {
		background: #07c160;
	}
	.znj-add-good-spec-input {
		width: 80rpx;
		flex: 1;
		padding: 0 12rpx;
		border: none;
		outline: none;
		font-size: 22rpx;
		background: transparent;
		text-align: center;
	}
	
	/* 分割线 */
	.znj-add-good-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, #e0e0e0, transparent);
		margin: 5rpx 0;
	}
	
	/* 开关按钮组 */
	.znj-add-good-switch-group {
		display: flex;
		width: 120rpx;
		height: 30rpx;
		border-radius: 8rpx;
		overflow: hidden;
		border: 1px solid #ddd;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-switch-btn {
		flex: 1;
		border: none;
		background: transparent;
		color: #333;
		font-size: 15rpx;
		line-height: 30rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-switch-btn.active {
		background: #07c160;
		color: #fff;
	}
	
	/* H5规格选择弹窗样式 */
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
		color: #31BDEC;
		border: 1px solid #31BDEC;
		background: rgba(49, 189, 236, 0.1);
	}
	
	.tag-fixed {
		color: #00aa00;
		border: 1px solid #00aa00;
		background: rgba(0, 170, 0, 0.1);
	}
	
	.tag-unpack {
		color: #aa55ff;
		border: 1px solid #aa55ff;
		background: rgba(170, 85, 255, 0.1);
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