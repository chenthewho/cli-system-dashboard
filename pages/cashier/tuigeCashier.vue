<template>
	<div>
		<div class="container">
			<div class="cashier" >
                <div class="container-header">
                    <div class="left">
							<button
								style="padding: 3rpx; height: 24rpx;line-height: 21rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
								@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
									color="#ffffff" style="margin-right: 5px;"></uni-icons>返回</button>
                                    <text class="title">改单</text>
						</div>
                </div>
	<div class="cashier-row">
		<div class="cashier-col cashier-goods">
			<div class="card-body">
				<!-- 货品选择面板组件 -->
			<CashierGoodsPanel
				ref="goodsPanel"
				:selectedGoodsIds="goodSelect.map(item => item.id)"
				:height="windowHeight"
				:companyId="currentCompanyId"
				@tab-changed="handleTabChanged"
				@item-click="handleClick"
				@category-updated="handleCategoryUpdated"
			/>
			</div>
		</div>
		<div v-if="step1" class="cashier-card">
			<div class="cashier-col">
				<div class="card-title">
					<!-- 客户信息显示区域 -->
					<div style="display: inline-flex; align-items: center; gap: 0; margin: 0; padding: 2px 0;">
						<!-- 主客户按钮（散客/当前客户） -->
						<div class="customerbtn modern-customer-btn main-customer-btn" @click="memberChange('XiaDan')" :style="{
							borderRadius: '6px',
							fontSize:'16px',
							boxShadow: currentMember.debts > 0 ? '0 3px 10px rgba(245, 34, 45, 0.3)' : '0 3px 10px rgba(56, 158, 13, 0.3)',
							color:  'white',
							background: currentMember.debts > 0 ? '#ff4d4f' : '#389e0d',
							height: '100%',
							paddingLeft: '8rpx',
							paddingRight: '8rpx',
							paddingTop: '10rpx',
							fontWeight:'700',
							letterSpacing: '1rpx',
							paddingBottom: '10rpx',
							display:'inline-flex',
							alignItems: 'center',
							flexShrink: 0,
							transition: 'all 0.3s ease',
							border: 'none',
							marginLeft: '0',
							marginRight: '1px'
						}">
							{{currentMember.customName ? currentMember.customName : '散客'}}
						</div>
					</div>
					<div style="display: flex;"></div>
				</div>
			<OrderGoodsPanel
				:goodsList="goodSelect"
				:totalAmount="payAmount.total"
				:shippingFee="cashier.shippingFee"
				:showHangOrder="false"
				checkoutButtonText="改单"
				@name-click="memberChange('XiaDan')"
				@item-click="handleItemClick"
				@delete-item="deleteItem"
				@shipping-click="showShippingModal"
				@checkout="orderCreate"
			/>
			</div>
		</div>
		<!-- 使用 GoodEditKeyboard 组件 -->
		<div v-if="!step1" class="cashier-card">
			<GoodEditKeyboard 
				:card="editingCard"
				:fixed-tare-weight="fixedTareWeight"
				:show-step2="showStep2"
				:edit-card-extral-model="editCardExtralModel"
				@confirm="handleGoodEditConfirm"
				@extra-model-select="handleExtraModelSelect"
			/>
		</div>
	</div>
	<u-modal title="添加新顾客" class="payment" :show="customerDialogVisibleAdd" :closeOnClickOverlay="false"
		:showConfirmButton="false" :width="700" @close="customerDialogVisibleAdd = false">
		<div class="slot-content" style="overflow-y: auto;">
			<uni-section title="表单校验" type="line">
				<view class="example" style="font-size: 15rpx;">
					<!-- 基础表单校验 -->
					<view class="input-container" style="margin-top: 10px;">
						<text class="label" style="width: 20%;">客户名称：</text>
						<input class="input-field" type="text" :adjust-position="false" placeholder=" "
							style="height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
							v-model="AddedCustomerFormData.name" />
					</view>
					<view class="input-container" style="margin-top: 10px;">
						<text class="label" style="width: 20%;">联系方式：</text>
						<input class="input-field" type="text" :adjust-position="false" placeholder=" "
							style="height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
							v-model="AddedCustomerFormData.phone" />
					</view>
					<view class="input-container" style="margin-top: 10px;">
						<text class="label" style="width: 20%;">车牌：</text>
						<input class="input-field" type="text" placeholder=" "
							style="	height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
							v-model="AddedCustomerFormData.carNum" />
					</view>
					<view class="input-container" style="margin-top: 10px;">
						<text class="label" style="width: 20%;">地址：</text>
						<input class="input-field" type="text" placeholder=" "
							style="	height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
							v-model="AddedCustomerFormData.address" />
					</view>
					<view style="display: flex;">
						<button @click="customerDialogVisibleAdd = false;memberDialogVisible = true;"
							style="width: 30%;margin-top: 20px;background-color: lightgrey; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);font-weight: bold;">返回</button>
						<button type="primary" @click="submitAddCustomer()"
							style="width: 30%;margin-top: 20px; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);font-weight: bold;">添加</button>
					</view>
				</view>
			</uni-section>
		</div>
	</u-modal>
	<!--客户中心-->
	<CustomerSelector
		:visible="memberDialogVisible"
		:customerList="memberSearchOptions"
		:mode="memberStyle"
		:selectType="currentSelctCustomerType"
		:windowHeight="windowHeight"
		:showAddButton="memberStyle === 'XiaDan'"
		@close="memberDialogVisible = false"
		@select="changeMember"
		@add-customer="memberDialogVisible = false; customerDialogVisibleAdd = true"
		@change-type="currentSelctCustomerType = $event"
	/>
		<!--收银弹窗-->
		<PaymentModal
			:visible="payTypeDialogVisible"
			:payAmount="payAmount"
			:accountExpense="AccountExpense"
			:discountAmount="discountAmount"
			:accountDiscount="accountDiscount"
			:currentMember="currentMember"
			:repayBasketList="repayBasketList"
			@close="payTypeDialogVisible = false"
			@play-sound="playSystemKeyClickSound"
			@collect-basket="collectBasketoffestMoney"
			@member-change="memberChange"
			@confirm="handlePaymentConfirm"
		/>

	<!-- 运费弹窗 -->
	<ShippingModal 
		:visible="shippingModalVisible" 
		:initialValue="cashier.shippingFee"
		@close="shippingModalVisible = false"
		@confirm="handleShippingConfirm"
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
					@click="specPopup.isEditMode ? handleSpecClickForEdit(spec, specPopup.editIndex) : handleSpecClick(spec)"
				>
					<!-- 商品名称 + 规格名称 -->
					<div class="spec-item-name">
						{{ specPopup.commodity.name }}-{{ spec.specName }}
					</div>
					
					<!-- 商品信息区域 -->
					<div class="spec-item-info">
						<!-- 标签行 -->
						<div class="spec-item-tags">
							<div v-if="commodityType === 1" class="tag tag-consignment">代卖</div>
							<div v-if="commodityType === 2" class="tag tag-self">自营</div>
							<div class="tag tag-unpack">拆包</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 分级商品选择弹窗 -->
	<div v-if="multiLevelPopup.visible" class="multilevel-popup-mask" @click="closeMultiLevelPopup">
		<div 
			class="multilevel-popup-container" 
			:style="multiLevelPopupStyle"
			@click.stop
		>
			<div class="multilevel-popup-content">
				<div 
					v-for="(child, index) in multiLevelPopup.childrenList" 
					:key="child.id || index"
					:id="'multilevel-grid-item-' + child.id"
					class="multilevel-grid-item"
					@click="handleMultiLevelClick(child)"
				>
					<!-- 商品名称 -->
					<div class="multilevel-item-name">
						{{ child.commodityName || child.name }}
					</div>
					
					<!-- 商品信息区域 -->
					<div class="multilevel-item-info">
						<!-- 标签行 -->
						<div class="multilevel-item-tags">
							<div v-if="commodityType === 1" class="tag tag-consignment">代</div>
							<div v-if="commodityType === 2" class="tag tag-self">自</div>
							
							<div v-if="child.saleWay == 1" class="tag tag-unfixed">非定</div>
							<div v-if="child.saleWay == 2" class="tag tag-fixed">
								定{{ child.initWeight ? child.initWeight : '' }}
							</div>
							<div v-if="child.saleWay == 3" class="tag tag-unpack">拆包</div>
							<div v-if="child.saleWay == 4" class="tag tag-bulk">散</div>
						</div>
						
						<!-- 库存信息 -->
						<div 
							class="multilevel-item-stock"
							:style="!child.outPutPurchaseInventories || child.outPutPurchaseInventories.length === 0 ? { color: '#aa0000' } : {}"
						>
							余: 
							<span v-for="item2 in child.outPutPurchaseInventories" :key="item2.id" class="stock-item">
								{{ item2.mount }}{{ item2.specName }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	</div>
	</div>

	<!--下单成功弹窗-->
		<u-modal title=" " class="payment" :show="popup_paysuccess_show" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="500" @close="popup_paysuccess_show = false">
			<view style="border-radius: 10rpx;">
				<div style="display: flex;">
					<div>
						<image src="/static/img/paySuccess.png"
							style="width: 120px; height: 100px; margin-right: 5rpx;"></image>
					</div>
					<div style="margin-left: 5rpx;margin-top: 10px;">
						<div style="font-size: 15rpx;font-weight: bold;">
							下单成功</div><br>
						<div style="font-size: 15rpx;font-weight: bold;" v-if="lastOrder">
							订单金额：{{lastOrder.payableAmount - lastOrder.basketOffsetAmount}} 元
						</div>
					</div>
				</div>
				<div style="display: flex;margin-top: 20px;"><button
						style="background-color: orange;color: white;font-weight: bold;"
						@click="paysuccessOrder(1)"><uni-icons custom-prefix="iconfont" type="icon-dayin" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>打印</button>
					<button style="background-color: dodgerblue;color: white;font-weight: bold;margin-left: 50px;"
						@click="paysuccessOrder(2)"><uni-icons custom-prefix="iconfont" type="icon-zhuanfa" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>发单</button>
					<button style="background-color: green;color: white;font-weight: bold;margin-left: 50px;"
						@click="paysuccessOrder(3)"><uni-icons custom-prefix="iconfont" type="icon-kaidan" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>继续开单</button>
				</div>
			</view>
		</u-modal>
		<!--收筐抵扣弹窗-->
		<BasketOffestModel ref="modeloffestBasketRef" :basketData="extraModel" @saveBasketOffest="saveBasketOffest">
		</BasketOffestModel>
		<!--还款弹窗-->
		<RepayModal :visible="showRepaymentModal"
      :customerInfo="repayCustomerData"
      @confirm="handleRepaymentConfirm"
      @close="showRepaymentModal = false">
		</RepayModal>

	</div>

</template>

<script>
	import CashierGoodsPanel from '@/components/CashierGoodsPanel/CashierGoodsPanel.vue'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import category from '../../api/goods/category'
	import member from '../../api/member/member'
	import config from '../../common/config'
	import BasketOffestModel from './component/basket-offest-model.vue'
	import RepayModal from '@/components/RepaymentModal.vue'
	import GoodEditKeyboard from '@/components/GoodEditKeyboard.vue'
	import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue'
	import PaymentModal from '@/components/PaymentModal.vue'
	import CustomerSelector from '@/components/CustomerSelector/CustomerSelector.vue'
	import ShippingModal from '@/components/ShippingModal.vue'

	export default {
		name: 'Cashier',
	components: {
		CashierGoodsPanel,
		BasketOffestModel,
		RepayModal,
		GoodEditKeyboard,
		OrderGoodsPanel,
		PaymentModal,
		CustomerSelector,
		ShippingModal
	},
		data() {
			return {
				currentSelctCustomerType: 1, //当前选中的顾客操作类型 1-下单 2-还筐 3-还款
				popup_paysuccess_show: false,
				repayBasketList: [], //2.0仅用于收银还筐
				repayBasketActiveIndex: 0,
				accountDiscount: true,
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
				],
				AccountExpense: {
					otherAmount: 0,
					cashAmount: 0,
					alipayAmount: 0,
					wxpayAmount: 0
				},
		discountAmount: 0,
		actionView: null,
		maskView: null,
		// 规格弹窗数据（拆包）
		specPopup: {
			visible: false,
			left: 0,
			top: 0,
			commodity: null,
			specList: []
		},
		// 分级商品弹窗数据
		multiLevelPopup: {
			visible: false,
			left: 0,
			top: 0,
			parentCommodity: null,
			childrenList: []
		},
		memberStyle: "XiaDan",
				AddedCustomerFormData: {},
				currentPayWay: 1,
				custominputFocused: false,
				custominputFocused2: false,
				custominputFocused3: false,
				custominputFocused4: false,
				custominputFocusIndex: '',
				editingPaymentIndex: 1,
				showRepaymentModal: false,
				repayCustomerData:{},
				step1: true,
				editingCard: '',
				editingIndex: '',
			fixedTareWeight: {
				action: false,
				value: 0
			},
			memberEventInfo: {
				member: null,
				collectBasketNum: 0
			},
			cashier: {
					type: 0,
					discount: 10,
					ignoreType: 0,
					ignoreAmount: 0, // 抹零
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					memberId: '',
					member: {},
					cards: [],
			source: config.platformCode
		},
		customerDialogVisibleAdd: false,
		windowHeight: 0,
		showAllweightStr: false,
		memberDialogVisible: false,
		memberSearchKeyword: '',
		memberOptions: [],
		memberSearchOptions: [],
		lastOrder: null,
				categoryList: [],
				currentOrderInfo: {

				},
			currentMember: {
				customName: "散客",
				id: ""
			},
		payTypeDialogVisible: false,
		shippingModalVisible: false,
		selectInput_pay: 1,
			payResult: {},
			commodityType: 1,
				payAmount: {
					total: 0,
					actual: 0,
					debt: 0,
					ExtraMoney: 0,
					BasketOffsetAmount: 0
				},
				currentCompanyId: "",
				extraModel: [],
				editCardExtralModel: [],
				goodSelect: [],
                old_order:{}
			}
		},
        onLoad(options){
            this.old_order = JSON.parse(options.order);
            console.log("this.old_order",this.old_order);
            this.parseoldOrder();
        },
		onShow() {
			this.initSystem();
			this.currentCompanyId = uni.getStorageSync('companyId');
			this.initCompanySetting();
		},
	mounted() {
		this.windowHeight = uni.getWindowInfo().windowHeight;
		this.onLoadMethod();
            this.getallextralgood();
	},
	computed: {
	// 规格弹窗样式
	specPopupStyle() {
		const { left, top, specList } = this.specPopup;
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
	// 分级商品弹窗样式
	multiLevelPopupStyle() {
			const { left, top, childrenList } = this.multiLevelPopup;
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
	methods: {
		// 处理标签切换事件（从 CashierGoodsPanel 组件触发）
		handleTabChanged(data) {
			// 组件内部已经处理了商品加载逻辑
			// 这里只需要处理父组件需要知道的状态变化
			console.log('标签已切换:', data);
		},
		
	// 处理分类列表更新事件（从 CashierGoodsPanel 组件触发）
	handleCategoryUpdated(categoryList) {
		// 更新父组件的 categoryList（用于其他功能）
		this.categoryList = categoryList;
	},
	
	// 处理 OrderGoodsPanel 组件的商品点击事件（编辑已添加的商品）
	handleItemClick({ item, index }) {
		console.log("编辑商品 - item:", item);
		console.log("saleWay:", item.saleWay, "commoditySpecs:", item.commoditySpecs);

		// 如果是拆包类型 (saleWay === 3)，检查是否有多个规格
		if (item.saleWay === 3 && item.commoditySpecs && item.commoditySpecs.length > 1) {
			console.log("显示拆包规格选择弹窗，规格数量:", item.commoditySpecs.length);
			// 保存当前编辑的商品索引，供规格选择后更新使用
			this.editingIndex = index;
			this.editingCard = item;
			// 获取元素位置用于弹窗定位
			// 直接在屏幕中央显示弹窗
			const screenWidth = uni.getWindowInfo().windowWidth;
			const screenHeight = uni.getWindowInfo().windowHeight;
			this.createNativeViewForEdit(screenWidth / 2, screenHeight / 3, item, item.commoditySpecs, index);
			return;
		}
		
		console.log("直接进入编辑界面");
		// 其他情况直接进入编辑界面
		this.showStep2(item, index);
	},

	// GoodEditKeyboard 组件确认事件处理
	handleGoodEditConfirm(updatedCard) {
		// 更新编辑中的商品数据
		this.editingCard = updatedCard;
		this.goodSelect[this.editingIndex] = updatedCard;

		this.reCountGoodSelect();
		
		// 返回商品列表
		this.step1 = true;
		this.custominputFocused = false;
		this.custominputFocused2 = false;
		this.custominputFocused3 = false;
		this.custominputFocused4 = false;
		this.showAllweightStr = false;
	},

	// GoodEditKeyboard 组件押筐选择事件处理
	handleExtraModelSelect(extralModel) {
		// 更新 editingCard 的押筐模型
		this.editingCard.extralModel = extralModel;
		
		// 同步到 goodSelect 数组
		this.goodSelect[this.editingIndex] = this.editingCard;
	},
	
	// PaymentModal 组件确认事件处理
	async handlePaymentConfirm(paymentData) {
		// PaymentModal 组件会处理所有支付逻辑，这里直接调用原来的确认方法
		await this.payTypeConfirm();
	},

	// 运费相关方法
	showShippingModal() {
		this.shippingModalVisible = true;
	},
	handleShippingConfirm(fee) {
		this.cashier.shippingFee = fee;
		this.shippingModalVisible = false;
		// 重新计算总金额
		this.reCountGoodSelect();
		uni.showToast({
			title: '运费设置成功',
			icon: 'success'
		});
	},
	
            //还原订单
            parseoldOrder(){
                let modelList = JSON.parse(this.old_order.module);
                console.log("modelList",modelList);
				for (let i = 0; i < modelList.length; i++) {
					let model = modelList[i];
                    if(model.type==1){
                        let good = {
						key: i,
						skuName: model.name,
						referenceAmount: model.referenceAmount,
						quantity: model.mount,
						carweight: model.tareWeight,
						allweight: model.totalWeight,
						stockType:model.stockType,
						commodityId:model.commodityId,
						purchaseAssistId:model.purchaseAssistId,
						commoditySpec:model.commoditySpec,
						money: model.subtotal && model.subtotal != null ? model.subtotal : 0,
						id: model.Id ? model.Id : "",
                        saleWay:model.saleWay
					}
					this.goodSelect.push(good);
                    }
				}
                console.log("this.goodSelect",this.goodSelect);
                //还原押筐
                for(let i=0;i<modelList.length;i++){
                    if(modelList[i].type==2){
                        for(let k=0;k<this.goodSelect.length;k++){
                            console.log("1");
                            if(modelList[i].parentId==this.goodSelect[k].id){
                                console.log("2");
                                this.goodSelect[k].extralModel={
                                    name:modelList[i].name,
                                    money:modelList[i].amount,
                                    quantity:modelList[i].mount,
                                    id:modelList[i].commodityId,
                                    amount:modelList[i].referenceAmount
                                }
                            }
                        }
                    }
                }

				this.currentOrderInfo.Id = this.old_order.id;
				this.currentOrderInfo.accountCode = this.old_order.accountCode;
				if (this.old_order.customerId != null && this.old_order.customerId != "") {
					member.GetmemberByCustomeId(this.old_order.customerId).then(res => {
						this.currentMember = res.data;
					})
				}
				this.reCountGoodSelect();
            },
            back(){
                uni.navigateBack();
            },
			editCardExtraModelSelct(e) {

this.editingCard.extralModel = JSON.parse(JSON.stringify(this.editCardExtralModel[e]));
console.log("this.editingCard.extralModel",this.editingCard.extralModel)
							//押筐数量处理
			if (this.editingCard.extralModel) {
				this.editingCard.extralModel.quantity = this.editingCard.quantity;
				if(this.editingCard.extralModel.weight){	
					this.editingCard.carweight = this.editingCard.extralModel.quantity*this.editingCard.extralModel.weight;
				}
			}
},
			onLoadMethod() {
				this.currentCompanyId = uni.getStorageSync('companyId');
				this.initCompanySetting();
				this.getCategoryList();
			},
			initCompanySetting() {
				var companySetting = uni.getStorageSync("companySetting")
				if (companySetting != null) {
					this.fixedTareWeight = companySetting._fixedTareWeight;

					if (companySetting._fixedPayPrint) {
						this.fixedPayPrint = companySetting._fixedPayPrint;
					}

				}
			},
			paysuccessOrder(type) {
				this.popup_paysuccess_show = false;
				if (type == 1) {
					this.printerModel(this.lastOrder);
				} else if (type == 2) {
					this.shareOrder(this.lastOrder.id);
				}
			},
			setDicountAmount() {
				this.accountDiscount = true;
				this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) - eval(this.payAmount.debt);
				this.setAccountExpense(this.payAmount.actual);
			},
			setOverchargeAmount() {
				this.accountDiscount = false;
				this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) - eval(this.payAmount.debt);
				this.setAccountExpense(this.payAmount.actual);
			},
			setAccountExpense(val) {
				this.AccountExpense = {
					otherAmount: 0,
					cashAmount: 0,
					alipayAmount: 0,
					wxpayAmount: val
				}
			},
		countTareWeight(str) {
			console.log(str)
			return eval(str)
		},
		saveBasketOffest(basketList) {
			console.log("basketList", basketList)
			// if (parseInt(this.memberEventInfo.collectBasketNum) === 0) {
			// 	return;
			// }
			this.repayBasketList = basketList;
			this.payAmount.actual += this.payAmount.BasketOffsetAmount;
			this.payAmount.BasketOffsetAmount = 0;
			for (var i = 0; i < this.repayBasketList.length; i++) {
				this.payAmount.BasketOffsetAmount += parseFloat(this.repayBasketList[i].quantity) * parseFloat(this
					.repayBasketList[i].amount);
			}
			this.payAmount.actual = parseFloat((this.payAmount.actual - this.payAmount.BasketOffsetAmount).toFixed(
				1));
		},
		collectBasketoffestMoney() {
			this.$nextTick(() => {
				this.$refs.modeloffestBasketRef.open(this.repayBasketList);
			});
			this.playSystemKeyClickSound();
		},
			getallextralgood() {
				this.extraModel = [];
				this.editCardExtralModel = [{
					name: "空",
					amount: 0,
					id: ""
				}]
				let that = this;
				category.getallextralgood(this.currentCompanyId).then(res => {
					that.extraModel = res.data;
					that.editCardExtralModel = that.editCardExtralModel.concat(res.data);
					console.log("editCardExtralModel", that.editCardExtralModel)
					that.extraModel.forEach(x => {
						x.quantity = 0;
						x.money = 0;
					})
					that.editCardExtralModel.forEach(x => {
						x.quantity = 0;
						x.money = 0;
					})
				})
			},
			//客户中心点击客户事件
			changeMember(e) {
				console.log("this.currentSelctCustomerType", this.currentSelctCustomerType)
				this.memberDialogVisible = false
					this.currentMember = e;
			},
		//处理还款事件
		handleRepaymentConfirm(data) {
			console.log("data", data)
		},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
					this.payWay[i].select = 0;
				}
				this.payWay[index].select = 1;
				this.currentPayWay = this.payWay[index].id;
			},
			playSystemKeyClickSound() {
				try {
					var Context = plus.android.importClass("android.content.Context");
					var AudioManager = plus.android.importClass("android.media.AudioManager");
					var main = plus.android.runtimeMainActivity();
					var audioManager = main.getSystemService(Context.AUDIO_SERVICE);
					audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
				} catch (e) {
					console.error("播放系统按键音失败:", e);
				}
			},
			NumberCk(val) {
				this.playSystemKeyClickSound();
				let myvalue = "";
				//修改allweightStr
				if (this.custominputFocusIndex === 3) {
					if (this.editingCard.allweightSrt.toString() === "0") {
						this.$nextTick(() => {
							this.editingCard.allweightSrt = val.toString();
						})

					} else {
						this.$nextTick(() => {
							this.editingCard.allweightSrt = this.editingCard.allweightSrt + val.toString();
						})

					}

				}
				switch (this.custominputFocusIndex) {
					case 1:
						myvalue = this.editingCard.quantity;
						break;
					case 2:
						myvalue = this.editingCard.referenceAmount;
						break;
					case 3:
						myvalue = this.editingCard.allweight;
						break;
					case 4:
						myvalue = this.editingCard.carweight;
						break;
				}
				var myvalueStr = myvalue.toString();
				if (val == '.') {
					if (myvalueStr.indexOf('.') >= 0) {
						return;
					}
				}
				if ((val === '+' || val === '-') && myvalueStr === '0') {
					return;
				}
				var txt = myvalue == null || (myvalueStr === '0' && val != ".") || myvalue == undefined ? '' : myvalue;

				if (val === "+" || val === "-") {
					txt = eval(txt);
				}
				myvalue = txt + val.toString();
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = myvalue;
						if (this.fixedTareWeight.action === true) {
							var carWeightNew = this.editingCard.fixedTare * parseFloat(this.editingCard.quantity)
							//皮重处理
							if (carWeightNew) {
								this.$nextTick(() => {
									this.editingCard.carweight = carWeightNew;
								})
							}
							//押筐数量处理
							if (this.editingCard.extralModel) {
                                console.log("this.editingCard.extralModel",this.editingCard.extralModel);
								this.editingCard.extralModel.quantity = this.editingCard.quantity;
							}

						}
						break;
					case 2:
						this.$nextTick(() => {
							this.editingCard.referenceAmount = myvalue;
						})

						break;
					case 3:
						this.$nextTick(() => {
							this.editingCard.allweight = myvalue;
						})

						break;
					case 4:
						this.$nextTick(() => {
							this.editingCard.carweight = myvalue;
						})

						break;
				}
				// this.goodSelect[this.editingIndex] = this.editingCard;
			},
			inputFinsh1() {
				this.playSystemKeyClickSound();
				this.editingCard.quantity = eval(this.editingCard.quantity);
				this.editingCard.referenceAmount = eval(this.editingCard.referenceAmount);
				this.editingCard.allweight = eval(this.editingCard.allweight);
				this.editingCard.carweight = eval(this.editingCard.carweight);
			},
			Tuige1() {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.custominputFocusIndex) {
					case 1:
						myvalue = this.editingCard.quantity;
						break;
					case 2:
						myvalue = this.editingCard.referenceAmount;
						break;
					case 3:
						myvalue = this.editingCard.allweight;
						break;
					case 4:
						myvalue = this.editingCard.carweight;
						break;
				}

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = myvalue === '' ? '0' : myvalue; // 如果为空，设置为0
						if (this.fixedTareWeight.action === true) {
							var carWeightNew = this.editingCard.fixedTare * parseFloat(this.editingCard.quantity)
							//皮重处理
							if (carWeightNew) {
								this.$nextTick(() => {
									this.editingCard.carweight = carWeightNew;
								})
							}
							//押筐数量处理
							if (this.editingCard.extralModel) {
								this.editingCard.extralModel.quantity = this.editingCard.quantity;
							}
						}
						break;
					case 2:
						this.editingCard.referenceAmount = myvalue === '' ? '0' : myvalue;
						break;
					case 3:
						this.editingCard.allweight = myvalue === '' ? '0' : myvalue;
						this.editingCard.allweightSrt = myvalue === '' ? '0' : myvalue;
						break;
					case 4:
						this.editingCard.carweight = myvalue === '' ? '0' : myvalue;
						break;
				}
				this.goodSelect[this.editingIndex] = this.editingCard;
			},
			Tuige2() {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.editingPaymentIndex) {
					case 1:
						myvalue = this.payAmount.total;
						break;
					case 2:
						myvalue = this.payAmount.actual;
						break;
					case 3:
						myvalue = this.payAmount.debt;
						break;
					case 5:
						myvalue = this.AccountExpense.wxpayAmount;
						break;
					case 6:
						myvalue = this.AccountExpense.alipayAmount;
						break;
					case 7:
						myvalue = this.AccountExpense.cashAmount;
						break;
					case 8:
						myvalue = this.AccountExpense.otherAmount;
						break;
					case 9:
						myvalue = this.discountAmount;
						break;
				}

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				switch (this.editingPaymentIndex) {
					case 1:
						this.$nextTick(() => {
							this.payAmount.total = myvalue === '' ? '0' : myvalue; // 如果为空，设置为0
						})
						break;
					case 2:
						this.$nextTick(() => {
							this.payAmount.actual = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 3:
						this.$nextTick(() => {
							this.payAmount.debt = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 5:
						this.$nextTick(() => {
							this.AccountExpense.wxpayAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 6:
						this.$nextTick(() => {
							this.AccountExpense.alipayAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 7:
						this.$nextTick(() => {
							this.AccountExpense.cashAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 8:
						this.$nextTick(() => {
							this.AccountExpense.otherAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 9:
						this.$nextTick(() => {
							this.discountAmount = myvalue === '' ? '0' : myvalue;
							if (this.accountDiscount) {
								this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							} else {
								this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							}
						})
						break;

				}
			},
			Tuige3() {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue === '' ? '0' : myvalue;
			},
			editingPaymentClick(index) {
				this.editingPaymentIndex = index;
				this.selectInput_pay = index;
				this.payAmount.total = eval(this.payAmount.total);
				this.payAmount.actual = eval(this.payAmount.actual);
				this.payAmount.debt = eval(this.payAmount.debt);
			},
			Clear1() {
				// 根据 custominputFocusIndex 清空对应的值
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = '0'; // 清空为 0
						break;
					case 2:
						this.editingCard.referenceAmount = '0'; // 清空为 0
						break;
					case 3:
						this.editingCard.allweight = '0'; // 清空为 0
						break;
					case 4:
						this.editingCard.carweight = '0'; // 清空为 0
						break;
				}

				// 更新 goodSelect 数组
				this.goodSelect[this.editingIndex] = this.editingCard;
				this.reCountGoodSelect();
			},
			Clear2() {
				this.playSystemKeyClickSound();
				// 根据 custominputFocusIndex 清空对应的值
				switch (this.editingPaymentIndex) {
					case 1:
						this.payAmount.total = '0'; // 清空为 0
						break;
					case 2:
						this.payAmount.actual = '0'; // 清空为 0
						break;
					case 3:
						this.payAmount.debt = '0'; // 清空为 0
						break;
				}

				// 更新 goodSelect 数组
				this.goodSelect[this.editingIndex] = this.editingCard;
			},
			Clear3() {
				// 根据 custominputFocusIndex 清空对应的值
				this.memberEventInfo.collectBasketNum = '0';
			},
			NumberCk2(val) {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.editingPaymentIndex) {
					case 1:
						myvalue = this.payAmount.total;
						break;
					case 2:
						myvalue = this.payAmount.actual;
						break;
					case 3:
						myvalue = this.payAmount.debt;
						break;
					case 5:
						myvalue = this.AccountExpense.wxpayAmount;
						break;
					case 6:
						myvalue = this.AccountExpense.alipayAmount;
						break;
					case 7:
						myvalue = this.AccountExpense.cashAmount;
						break;
					case 8:
						myvalue = this.AccountExpense.otherAmount;
						break;
					case 9:
						myvalue = this.discountAmount;
						break;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				switch (this.editingPaymentIndex) {
					case 1:
						this.$nextTick(() => {
							this.payAmount.total = myvalue;
						})
						break;
					case 2:
						this.$nextTick(() => {
							this.payAmount.actual = myvalue;
						})
						break;
					case 3:
						this.$nextTick(() => {
							this.payAmount.debt = myvalue;
							this.payAmount.actual = parseFloat(this.payAmount.total) - parseFloat(this.payAmount
								.debt)
						})
						break;
					case 5:
						this.$nextTick(() => {
							this.AccountExpense.wxpayAmount = myvalue;
						})
						break;
					case 6:
						this.$nextTick(() => {
							this.AccountExpense.alipayAmount = myvalue;
						})
						break;
					case 7:
						this.$nextTick(() => {
							this.AccountExpense.cashAmount = myvalue;
						})
						break;
					case 8:

						this.$nextTick(() => {
							this.AccountExpense.otherAmount = myvalue;
						})
						break;
					case 9:
						this.$nextTick(() => {
							this.discountAmount = myvalue;
							if (this.accountDiscount) {
								this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							} else {
								this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							}
						})
						break;
				}
			},
			NumberCk3(val) {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue;
			},
			custominputFocusedMethod(index) {
				this.inputFinsh1();
				this.custominputFocused = false;
				this.custominputFocused2 = false;
				this.custominputFocused3 = false;
				this.custominputFocused4 = false;
				switch (index) {
					case 1:
						this.custominputFocused = true;
						break;
					case 2:
						this.custominputFocused2 = true;
						break;
					case 3:
						this.custominputFocused3 = true;
						break;
					case 4:
						this.custominputFocused4 = true;
						break;
				}
				this.custominputFocusIndex = index;
			},
			showStep2(e, index) {
				//进入输入编辑的物品，输入完返回对应的添加物品
				this.editingCard = e;
				if (this.editingCard.extralModel) {
					this.editingCard.extralModel.quantity = this.editingCard.quantity;
				} else {
					this.editingCard.extralModel = {
						name: "空",
						amount: 0,
						id: "",
						quantity: 0,
						money: 0
					}
				}
				this.editingIndex = index;
				this.step1 = false;
				console.log("this.editingCard",this.editingCard);
				if (this.editingCard.saleWay === 1) {
					this.custominputFocusedMethod(3);
				} else {
					this.custominputFocusedMethod(1);
				}

			},
			showStep1() {
				this.inputFinsh1();
				this.reCountGoodSelect();
				this.step1 = true;
				this.custominputFocused = false;
				this.custominputFocused2 = false;
				this.custominputFocused3 = false;
				this.custominputFocused4 = false;
			},

		initSystem() {
			const window = uni.getWindowInfo()
			const width = window.windowWidth
		},

			getCategoryList() {
				if (this.$refs.goodsPanel) {
			this.$refs.goodsPanel.getCategoryList();
				}
			},
			deleteItem(e) {
				this.playSystemKeyClickSound();
				const indexToDelete = this.goodSelect.findIndex(item => item.index === e.index);

				// 如果找到了对应的索引，则弹出确认框
				if (indexToDelete !== -1) {
					uni.showModal({
						title: '确认删除',
						content: '您确定要删除该项吗？',
						success: (res) => {
							if (res.confirm) {
								// 用户点击了确认
								this.goodSelect.splice(indexToDelete, 1);
								this.reCountGoodSelect(); // 更新选择的商品
							} else if (res.cancel) {
								// 用户点击了取消
							}
						}
					});
				}
			},
			async orderCreate() {
				this.playSystemKeyClickSound();
				this.payTypeDialogVisible = true;
				this.payAmount.actual = eval(this.payAmount.total)
				this.AccountExpense = {
					alipayAmount: 0,
					wxpayAmount: JSON.parse(JSON.stringify(this.payAmount.actual)),
					cashAmount: 0,
					otherAmount: 0
				}
				this.discountAmount = 0;
				this.payAmount.BasketOffsetAmount = 0;
				this.memberEventInfo = {
					member: null,
					collectBasketNum: 0
				}
				// console.log("buleTeethInfo", buleTeethInfo)		
				// console.log("this.cashier",this.cashier)
				// cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
				// 	this.orderId = res.data
				// 	this.payTypeDialogVisible = true
				// 	this.getPayResult()
				// })
				//重置收银还筐物体
				this.resetPayBasket();

			},
			resetPayBasket() {
				this.repayBasketList = [];
				this.repayBasketActiveIndex = 0;
				for (var i = 0; i < this.extraModel.length; i++) {
					this.repayBasketList.push({
						id: this.extraModel[i].id,
						name: this.extraModel[i].name,
						amount: this.extraModel[i].amount,
						quantity: 0,
					})
				}
			},
		printerModel(order) {
			getApp().senBleLabel(order);
		},

		//商品金额计算方法
		reCountGoodSelect() {
			this.payAmount.total = 0;
            console.log("this.goodSelect",this.goodSelect);
			this.goodSelect.forEach(x => {
				if (x.saleWay === 1) {
					x.money = Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x
						.referenceAmount));
				} else if (x.saleWay === 2 || x.saleWay === 3 || x.saleWay === 4) {
					x.money = Math.round(parseFloat(x.quantity) * parseFloat(x
						.referenceAmount));
				}

				this.payAmount.total +=parseFloat(x.money);//货品金额
                x.extralModelMoney = 0;//初始化押筐金额
				if (x.extralModel && x.extralModel.id != "") {
					x.extralModelMoney +=parseFloat(x.extralModel.quantity) * parseFloat(x.extralModel.amount);
					this.payAmount.total += x.extralModelMoney;
				}
				// 计算包含押筐金额的总小计
				x.money2 = parseFloat(x.money) + parseFloat(x.extralModelMoney);
			})
            console.log("this.payAmount.total",this.payAmount.total);
			this.payAmount.total = parseFloat(this.payAmount.total).toFixed(0);
		},
			//计算方法2---改变箩筐值计算
			reCountGoodSelect2() {
				this.payAmount.total = 0;
				if (this.extraModel.length > 0) {
					this.extraModel[0].money = 0;
				}
				this.goodSelect.forEach(x => {
					x.money = Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x
						.referenceAmount) * 10) / 10;
					this.payAmount.total += x.money;
				})

				if (this.extraModel.length > 0) {
					this.extraModel[0].money += (parseFloat(this.extraModel[0].quantity) * parseFloat(this.extraModel[0]
						.amount));
				}
				if (this.extraModel.length > 0) {
					this.payAmount.total += this.extraModel[0].money;
					this.payAmount.ExtraMoney += this.extraModel[0].money;
				}
			},
			addCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
				} else {
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						skuName: item.skuName,
						quantity: 1,
						adjustAmount: item.adjustAmount,
						payableAmount: item.payableAmount,
						skuNo: item.skuNo
					}
					this.cashier.cards.push(card)
				}
				// this.cashierAmount()
			},
		// 使用 DIV 替代原生 View 的规格选择弹窗
		createNativeView(left, top, commodity, specList) {
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
			this.commodityClickSaleWay3(this.specPopup.commodity, spec);
			this.closeSpecPopup();
		},
		
	// 为编辑已存在商品创建规格选择弹窗
	createNativeViewForEdit(left, top, commodity, specList, editIndex) {
		console.log('创建编辑商品的规格选择弹窗', specList);
		if (!specList || specList.length < 1) return;
		
		// 保存编辑索引，用于后续更新
		this.editingIndexForSpec = editIndex;
		
		// 使用同一个规格弹窗，但标记为编辑模式
		this.specPopup = {
			visible: true,
			left,
			top,
			commodity,
			specList,
			isEditMode: true, // 标记为编辑模式
			editIndex: editIndex
		};
	},
	
	// 点击规格项（编辑模式）
	handleSpecClickForEdit(spec, editIndex) {
		this.updateCommoditySpec(this.specPopup.commodity, spec, editIndex);
		this.closeSpecPopup();
	},
		
	// 更新已存在商品的规格
	updateCommoditySpec(commodity, spec, editIndex) {
		console.log('更新商品规格 - commodity:', commodity, 'spec:', spec, 'editIndex:', editIndex);
		// 更新商品的规格信息
		this.goodSelect[editIndex].commoditySpec = spec;
		this.goodSelect[editIndex].skuName = commodity.name;
		console.log('更新后的商品:', this.goodSelect[editIndex]);
		
		// 进入编辑界面
		this.showStep2(this.goodSelect[editIndex], editIndex);
	},
	
	// 创建分级商品弹窗
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
	
	// 关闭分级商品弹窗
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
	
	// 点击分级商品项
	handleMultiLevelClick(childCommodity) {
		// 处理分级商品的点击逻辑，类似普通商品
		this.closeMultiLevelPopup();
		// 调用 handleClick 处理选中的子商品
		this.handleClick(childCommodity, childCommodity.id);
	},
	
		
		handleClick(e, id) {
					//如果在step2状态下点击新货品，先移除未确定的货品
		if (!this.step1 && this.editingIndex === this.goodSelect.length - 1) {
			// 移除最后一个未确定的货品
			this.goodSelect.splice(this.editingIndex, 1);
		}
		
		// 检查是否为分级商品
		if (e.isMultiLevel === 1) {
			uni.createSelectorQuery().selectAll(`#grid-item-${id}`).boundingClientRect(data => {
				console.log("分级商品弹窗位置:", data);
				this.createMultiLevelView(data[0].left + data[0].width / 2, data[0].top, e, e.childrenList);
			}).exec();
			return; // 显示分级商品弹窗后直接返回
		}
		
		console.log("e",e)
			
			// 如果id未提供，从e对象中获取（适配GoodsSelector组件）
			const itemId = id || e.id;
			
		//1-非定装 2-定装 4-散装
		if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
			this.goodSelect.push({
				key: this.goodSelect.length,
				skuName: e.name, //货品名称
				referenceAmount: e.price, //单价
				stockType: e.stockType, //库存类型 
				quantity: 0,
				id: e.id,
				purchaseAssistId: e.purchaseAssistId,
				saleWay: e.saleWay,
				commodityId: e.commodityId,
				extralModel: e.extralModel,
				fixedTare: e.fixedTare,
				allweight: 0,
				allweightSrt: 0,
				commoditySpec: e.commoditySpec,
				carweight: 0,
				money: 0,//物品金额（不含押筐）
				money2: 0,//包含押筐金额
				index: this.goodSelect.length + 1
			});
				this.showAllweightStr = false;
				//显示输入价格界面
				this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
			} else if (e.saleWay === 3) {
				uni.createSelectorQuery().selectAll(`#grid-item-${itemId}`).boundingClientRect(data => {
					// const { left, top, width, height } = data;
					console.log("data", data)
					this.createNativeView(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
				}).exec()
			}
		},

	commodityClickSaleWay3(e, spec) {
		console.log('选择拆包规格:', e, spec);
		this.goodSelect.push({
			key: this.goodSelect.length,
			skuName: e.name,
			referenceAmount: e.price,
			stockType: e.stockType,
			quantity: 0,
			id: e.id,
			purchaseAssistId: e.purchaseAssistId,
			commodityId: e.commodityId,
			saleWay: e.saleWay,
			extralModel: e.extralModel,
			fixedTare: e.fixedTare,
			allweight: 0,
			allweightSrt: 0,
			commoditySpec: spec,
			commoditySpecs: e.commoditySpecs, // 保存所有规格，以便后续可以修改
			carweight: 0,
			money: 0,//物品金额（不含押筐）
			money2: 0,//包含押筐金额
			index: this.goodSelect.length + 1
		});
		this.showAllweightStr = false;
		this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
	},

		addTemplateGood() {
			this.goodSelect.push({
				key: this.goodSelect.length,
				skuName: "临时物品",
				referenceAmount: 0,
				quantity: 1,
				id: this.generateGUID,
				allweight: 0,
				allweightSrt: 0,
				carweight: 0,
				money: 0,//物品金额（不含押筐）
				money2: 0,//包含押筐金额
				index: this.goodSelect.length + 1
			});
			this.showAllweightStr = false;
			this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
			this.reCountGoodSelect();
		},
			submitAddCustomer() {
				if (this.AddedCustomerFormData.name == undefined || this.AddedCustomerFormData.name == "") {
					uni.showToast({
						title: '请填写客户名称',
						icon: 'none'
					})
					return;
				}

				const exists = this.memberOptions.some(item => item.customName === this.AddedCustomerFormData.name);

				if (exists) {
					uni.showToast({
						title: '客户名称已存在',
						icon: 'none'
					})
					return;
				}
				this.AddedCustomerFormData.phone = this.AddedCustomerFormData.phone == undefined ? "" : this
					.AddedCustomerFormData.phone;
				this.AddedCustomerFormData.address = this.AddedCustomerFormData.address == undefined ? "" : this
					.AddedCustomerFormData.address;
				this.AddedCustomerFormData.carNum = this.AddedCustomerFormData.carNum == undefined ? "" : this
					.AddedCustomerFormData.carNum;
				let currentCompanyId = uni.getStorageSync('companyId');
				var param = {
					id: "",
					CustomName: this.AddedCustomerFormData.name,
					CustomPhone: this.AddedCustomerFormData.phone,
					Address: this.AddedCustomerFormData.address,
					CarNum: this.AddedCustomerFormData.carNum,
					CompanyId: currentCompanyId,
					Debts: 0,
					OrderNum: 0,
					Owebasket: 0
				}
				member.memberCreate(param).then(res => {
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					})
					this.AddedCustomerFormData = {
						phone: null,
						address: null,
						carNum: null,
						name: null
					};
					this.customerDialogVisibleAdd = false;
					this.memberChange("XiaDan");
				}).finally(() => {

				})
			},
			memberSearch(query) {
				this.memberSearchOptions = [];
				if (query !== '') {
					this.memberSearchOptions = this.memberOptions.filter(item =>
						item.customName.toLowerCase().includes(query.toLowerCase())
					);
				} else {
					this.memberSearchOptions = this.memberOptions;
				}
			},
			memberSearchClear() {
				this.memberSearchKeyword = ''
				this.memberSearchOptions = this.memberOptions;
			},
			memberChange(status) {
				this.playSystemKeyClickSound();
				this.memberStyle = status;
				this.memberOptions = [];
				this.memberSearchOptions = [];
				this.memberSearchKeyword = "";
				member.GetmemberListByCompanyIdPage({ Id: this.currentCompanyId, pageSize: 1000, currentPage: 1 }).then(res => {
					this.memberOptions.push({
						customName: "散客",
						id: ""
					})
					this.memberSearchOptions.push({
						customName: "散客",
						id: ""
					})
					// 适配分页结果格式
					const memberList = res.data.Data || res.data.data || [];
					this.memberOptions.push(...memberList);
					this.memberSearchOptions.push(...memberList);
					this.memberDialogVisible = true
				}).finally(() => {})
			},
			async payTypeDebt() {
				this.playSystemKeyClickSound();
				this.payAmount.debt = eval(this.payAmount.total - this.payAmount.BasketOffsetAmount);
				this.payAmount.actual = 0;
				this.currentPayWay = 0;
				//支付方式详情归零
				this.AccountExpense = {
					alipayAmount: 0,
					wxpayAmount: 0,
					cashAmount: 0,
					otherAmount: 0
				}

				await this.payTypeConfirm();
			},

			//订单发送
			orderSend() {
				let that = this;
				var CompanyId = this.currentCompanyId;
				var goodModelList = [];
				var userInfo = uni.getStorageSync("userInfo");
				//选择商品转化成后端订单商品对象
				for (var i = 0; i < this.goodSelect.length; i++) {
					var commodity = {
						Id: this.goodSelect[i].id,
						purchaseAssistId: this.goodSelect[i].purchaseAssistId,
						name: this.goodSelect[i].skuName,
						mount: this.goodSelect[i].quantity,
						totalWeight: this.goodSelect[i].allweight,
						commoditySpec: this.goodSelect[i].commoditySpec,
						stockType: this.goodSelect[i].stockType,
						saleWay:this.goodSelect[i].saleWay,
						commodityId: this.goodSelect[i].commodityId,
						tareWeight: this.goodSelect[i].carweight,
						referenceAmount: this.goodSelect[i].referenceAmount,
						subtotal: this.goodSelect[i].money,
						type: 1
					};
					//处理押筐物体(2.0押筐物体存放在extralModel,extralModel.id==""时候为空，不做处理)
					commodity.subModel = [];
					if (that.goodSelect[i].extralModel) {
						console.log("that.goodSelect[i].extralModel", that.goodSelect[i].extralModel)
						if (that.goodSelect[i].extralModel && that.goodSelect[i].extralModel.id != "") {
							commodity.subModel.push({
								Id: "00000000-0000-0000-0000-000000000000",
								commodityId: this.goodSelect[i].extralModel.id,
								name: this.goodSelect[i].extralModel.name,
								mount: this.goodSelect[i].extralModel.quantity,
								referenceAmount: this.goodSelect[i].extralModel.amount,
								totalWeight: 0,
								stockType: 0,
								subtotal: 0,
								tareWeight: 0,
								commoditySpec: null,
								type: 2
							})
						}
					}
					goodModelList.push(commodity);
				}

				console.log("goodModelList",goodModelList);
				//处理还筐物体
				for (var i = 0; i < this.repayBasketList.length; i++) {
					if (parseFloat(this.repayBasketList[i].quantity) > 0) {
						goodModelList.push({
							Id: "00000000-0000-0000-0000-000000000000",
							commodityId: this.repayBasketList[i].id,
							name: this.repayBasketList[i].name,
							mount: this.repayBasketList[i].quantity,
							totalWeight: 0,
							tareWeight: 0,
							referenceAmount: this.repayBasketList[i].amount,
							subtotal: parseFloat(this.repayBasketList[i].quantity) * parseFloat(this
								.repayBasketList[i].amount),
							type: 4
						})
					}
				}

				//请求新的订单
				var param = {
					CompanyId: CompanyId,
					CustomName: this.currentMember.customName,
					CustomerId: this.currentMember.id,
					Status: 1,
					accountType: 0,
					operatorId: userInfo.id,
					Module: JSON.stringify(goodModelList),
					Payway: this.currentPayWay,
					PayableAmount: eval(this.payAmount.total),
					ActualMoney: eval(this.payAmount.actual),
					Debt: eval(this.payAmount.debt),
					ExtraMoney: this.payAmount.ExtraMoney,
					BasketOffsetAmount: this.payAmount.BasketOffsetAmount ? Number(this.payAmount.BasketOffsetAmount) :
						0
				}
				//插入费用支付方式详情
				param.accountExpense = this.AccountExpense;

				//处理优惠金额或多收金额
				if (this.accountDiscount) {
					param.discountAmount = this.discountAmount;
					param.overchargeAmount = 0;
				} else {
					param.discountAmount = 0;
					param.overchargeAmount = this.discountAmount;
				}
				//1.0用到的挂单转正式单（2.0弃用）
				if (this.currentOrderInfo != null && this.currentOrderInfo.Id) {
					param.Id = this.currentOrderInfo.Id;
					param.accountCode = this.currentOrderInfo.accountCode;
				}

                //请求主体
				let data = {
                    OldOrderId:this.old_order.id,
                    NewOrder:param
                }

            
				cashierOrder.ModifyAccount(JSON.stringify(data)).then(res => {
					if (res.code == 200) {
						//重置新建订单对象	
						that.resetOrder();
						that.payTypeDialogVisible = false;
						uni.showToast({
							title: '订单修改成功',
							icon: 'none'
						})
						that.back();
					} else {
						uni.showToast({
							title: `创建失败:${res.data}`,
							duration: 2000
						});
					}
				})
			},
			async payTypeConfirm() {
				this.playSystemKeyClickSound();
				let that = this;
				if (eval(this.payAmount.total) === 0) {
					uni.showToast({
						title: "订单金额必须大于0",
						icon: "error",
						duration: 2000
					});
					return;
				} else {
					if (this.currentMember.id != null && this.currentMember.id != "" && this.memberEventInfo
						.collectBasketNum > 0) {
						await this.payBasket_beforePay();
					}
					//打开收银界面
					this.orderSend();

				}
			},
			resetOrder() {
				let that = this;
				that.payAmount = {
					total: 0,
					actual: 0,
					debt: 0,
					ExtraMoney: 0,
					BasketOffsetAmount: 0
				};
				that.currentOrderInfo = {
					Id: "",
					accountCode: ""
				};
				that.goodSelect = [];
				that.currentMember = {};
				that.getCategoryList();
				that.extraModel.forEach(x => {
					x.quantity = 0;
					x.money = 0;
				})
				that.memberEventInfo = {
					member: null,
					collectBasketNum: 0
				}

		},
			async payBasket_beforePay() {
				if (this.currentMember?.id == null || this.currentMember?.id == "") return;
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param = {
					customerId: this.currentMember.id,
					repayBasket: parseFloat(this.memberEventInfo.collectBasketNum),
					orderList: [],
					operatorId: userInfo.id,
					operatorName: userInfo.userName,
					CompanyId: CompanyId,
					customerName: this.currentMember.customName
				}
				await member.RepayBasket(JSON.stringify(param));
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "@/pages/cashier/css/tuigeCashiercss.scss";

	.Numberinput {
		display: flex;
		align-items: center;
	}

	.myfous {
		width: 1rpx;
		height: 41rpx;
		background-color: #000;
		display: block;
		animation: mytreat 1.5s linear infinite;
	}

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 40rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 20rpx;

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
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 10rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		font-size: 25rpx;
	}

	.mybrankmask .MymaskList .maskListItem:active {
		width: 25%;
		height: 45rpx;
		margin-top: -3rpx;
		margin-left: -1%;
	}

	.mybrankmask .MymaskList .maskListItem2 {
		font-weight: bold;
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList {
		display: flex;
		width: 100%;
		height: 40rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem {
		font-weight: bold;
		width: 30%;
		height: 40rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 40rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem:active {
		width: 32%;
		height: 45rpx;
		margin-top: -3rpx;
		margin-left: -1%;
	}

	.mybrankmask2 .MymaskList .maskListItem2 {
		font-weight: bold;
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #ffffff;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem3 {
		font-weight: bold;
		width: 48%;
		height: 30rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
	}

	/* 新增样式 */
	.mybrankmask2 .MymaskList .large {
		font-size: 12rpx;
		height: 100rpx;
		/* 设置更高的高度 */
		line-height: 100rpx;
		/* 使文本垂直居中 */
		z-index: 5;
	}

	.custom-input {
		font-weight: bold;
		border: 2px solid #9c9c9c;
		/* 默认边框颜色 */
		border-radius: 5px;
		/* 可选：设置圆角 */
		padding: 5px;
		/* 可选：添加内边距 */
		height: 55rpx;
		width: 45%;
		/* 可选：设置宽度 */
		box-sizing: border-box;
		/* 确保内边距和边框包含在宽度内 */
		transition: border-color 0.3s;
		/* 添加过渡效果 */
	}

	.input-focused {
		height: 55rpx;
		width: 47%;
		border: 3px solid #31BDEC;
		/* 聚焦时边框颜色 */
	}

	/* 现代化收银弹窗样式 */
	.modern-payment-modal {
		.payment-modal-container {
			background: #e2e8f0;
			border-radius: 12rpx;
			padding: 5rpx;
			position: relative;
			height: 400rpx;
			overflow: hidden;
		}

		.modal-close-btn {
			position: absolute;
			top: 8rpx;
			right: 8rpx;
			width: 32rpx;
			height: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.9);
			cursor: pointer;
			transition: all 0.3s ease;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			z-index: 10;

			&:hover {
				background: #f1f5f9;
				transform: scale(1.1);
			}
		}

		.customer-info-section {
			margin-bottom: 12rpx;
			text-align: center;

			.customer-badge {
				display: inline-block;
				padding: 8rpx 16rpx;
				border-radius: 16rpx;
				font-weight: 600;
				font-size: 24rpx;
				color: white;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

				&.normal {
					background: linear-gradient(135deg, #3b82f6, #1d4ed8);
				}

				&.debt {
					background: linear-gradient(135deg, #ef4444, #dc2626);
				}

				.customer-name {
					font-size: 26rpx;
					margin-bottom: 2rpx;
				}

				.debt-info {
					font-size: 18rpx;
					opacity: 0.9;
				}
			}
		}

		.payment-content-grid {
			display: grid;
			grid-template-columns: 1fr 0.8fr;
			gap: 5rpx;
			height: 400rpx;
		}

		.left-input-section {
			display: flex;
			flex-direction: column;
			gap: 6rpx;

			.amount-inputs-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
				flex: 1;

				.section-title {
					font-size: 15rpx;
					font-weight: 600;
					color: #888888;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;
				}

				.amount-inputs {
					display: flex;
					flex-direction: column;
					gap: 3rpx;

					.input-row {
						display: flex;
						align-items: center;
						gap: 6rpx;
						padding: 3rpx 6rpx;
						border: 1rpx solid #e2e8f0;
						border-radius: 4rpx;
						transition: all 0.3s ease;
						cursor: pointer;
						min-height: 28rpx;

						&:hover {
							border-color: #cbd5e1;
						}

						&.active {
							border-color: #3b82f6;
							background: #eff6ff;
						}

						.input-label {
							font-size: 18rpx;
							font-weight: 500;
							color: #374151;
							min-width: 80rpx;
						}

						.amount-input {
							flex: 1;
							border: none;
							outline: none;
							font-size: 18rpx;
							font-weight: 600;
							text-align: center;
							background: transparent;
							color: #1e293b;
						}

						.collect-btn {
							background: #8b5cf6;
							color: white;
							border: none;
							border-radius: 3rpx;
							padding: 0 8rpx;
							height: 24rpx;
							line-height: 24rpx;
							font-size: 14rpx;
							font-weight: 500;
							cursor: pointer;
							transition: all 0.3s ease;

							&:hover {
								background: #7c3aed;
							}
						}
					}

					.discount-row {
						.discount-toggle {
							display: flex;
							border-radius: 3rpx;
							overflow: hidden;
							border: 1rpx solid #d1d5db;

							.discount-btn {
								background: white;
								border: none;
								padding: 0 6rpx;
								height: 22rpx;
								line-height: 22rpx;
								font-size: 14rpx;
								color: #6b7280;
								cursor: pointer;
								transition: all 0.3s ease;

								&:first-child {
									border-right: 1rpx solid #d1d5db;
								}

								&.active {
									background: #3b82f6;
									color: white;
								}
							}
						}
					}
				}
			}

			.payment-methods-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

				.section-title {
					font-size: 15rpx;
					font-weight: 600;
					color: #1e293b;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;
				}

				.payment-methods-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 6rpx;
				}

				.payment-method-card {
					background: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 4rpx;
					padding: 6rpx 4rpx;
					text-align: center;
					cursor: pointer;
					transition: all 0.3s ease;
					position: relative;
					min-height: 50rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					&:hover {
						border-color: #3b82f6;
						box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.15);
						transform: translateY(-1rpx);
					}

					&.active {
						background: linear-gradient(135deg, #3b82f6, #1d4ed8);
						border-color: #3b82f6;
						color: white;
						box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.25);

						.payment-label, .payment-amount {
							color: white;
						}
					}

					.payment-method-card-content {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 2rpx;
					}

					.payment-icon {
						margin-bottom: 2rpx;
					}

					.payment-label {
						font-size: 16rpx;
						font-weight: 500;
						color: #374151;
					}

					.payment-amount {
						font-size: 14rpx;
						color: #6b7280;
						font-weight: 600;
						margin-top: 2rpx;
					}
				}
			}
		}

		.right-keypad-section {
			background: white;
			border-radius: 8rpx;
			padding: 8rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			display: flex;
			flex-direction: column;
			gap: 6rpx;

			.customer-info-section {
				text-align: center;

				.customer-badge {
					display: inline-block;
					padding: 6rpx 12rpx;
					border-radius: 12rpx;
					font-weight: 600;
					font-size: 20rpx;
					color: white;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

					&.normal {
						background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					}

					&.debt {
						background: linear-gradient(135deg, #ef4444, #dc2626);
					}

					.customer-name {
						font-size: 22rpx;
						margin-bottom: 2rpx;
					}

					.debt-info {
						font-size: 16rpx;
						opacity: 0.9;
					}
				}
			}

			.modern-keypad {
				display: grid;
				gap: 1rpx;
				flex: 1;

				.keypad-row {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					gap: 1rpx;

					.keypad-btn {
						height: 60rpx;
						line-height: 60rpx;
						width: 60rpx;
						border: none;
						border-radius: 4rpx;
						background: #f1f5f9;
						color: #374151;
						font-size: 30rpx;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.2s ease;
						box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

						&:hover {
							background: #e2e8f0;
							transform: translateY(-1rpx);
						}

						&:active {
							transform: translateY(0);
						}

						&.delete-btn {
							background: #ef4444;
							color: white;

							&:hover {
								background: #dc2626;
							}
						}
					}
				}
			}

			.action-buttons {
				display: grid;
				grid-template-columns: 1fr 2fr;
				gap: 6rpx;

				.action-btn {
					height: 35rpx;
					width: 100rpx;
					line-height: 35rpx;
					border: none;
					border-radius: 4rpx;
					font-size: 18rpx;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.3s ease;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

					&.debt-btn {
						background: linear-gradient(135deg, #f59e0b, #d97706);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #d97706, #b45309);
							transform: translateY(-1rpx);
						}
					}

					&.confirm-btn {
						background: linear-gradient(135deg, #10b981, #059669);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #059669, #047857);
							transform: translateY(-1rpx);
						}
					}
				}
			}
		}
	}

	.activepayment {
		background-color: dodgerblue;
		// border-radius: 10rpx;
		color: white;
		border: 1px solid dodgerblue;
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
		width: 22%;
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
		padding: 2rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-weight: bold;
	}

	.table-row {
		display: flex;
		border-bottom: 1px solid #dfdfdf;

	}

	.table-header-cell,
	.table-cell {
		flex: 1;
		padding: 10px;
		text-align: left;
	}

	.table-header-cell {
		font-weight: bold;
		background-color: #b5b5b5;
		font-size: 12rpx;
	}

	.table-cell2 {
		flex: 1;
		padding: 5px;
		text-align: left;
		font-size: 12rpx;
	}


	.step1-input {
		font-size: 20rpx;
		font-weight: bold;
		text-align: center;
	}

	.currency-label {
		margin-top: 15rpx
	}


	.pay-type {
		.body {
			margin: 16px 0;

			.pay-list {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8px;
			}

			.pay-item {
				cursor: pointer;
				width: 100%;
				height: 100%;
				border: 1px solid $m-border-color;
				border-radius: 4px;
				background: $m-white-color;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				transition: transform 0.2s cubic-bezier(0.32, 0.08, 0.24, 1);
				box-shadow: 0 1px 3px $m-shadow-color;
			}

			.pay-item:hover {
				backdrop-filter: blur(15px) saturate(0.9) brightness(1.4);
			}

			.pay-item.active {
				color: $m-primary;
				border: 1px solid $m-primary;
				backdrop-filter: blur(15px) saturate(0.9) brightness(1.4);
			}

			.scan-pay {
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;

				.text {
					color: $m-main-color;
					padding-top: 32px;
				}
			}

			.selected-input {
				border-color: #009ae7;
				color: #009ae7;
				/* 选中时的边框颜色 */
			}
		}

		.payComfirmBtn1 {
			padding: 5rpx;
			font-size: 20rpx;
			width: 100rpx;
			height: 35rpx;
			font-weight: bolder;
			color: white;
			border: 1px solid #DD8410;
			background: #DD8410;
			box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
		}

		.payComfirmBtn1 :active {
			width: 106rpx;
			margin-left: -3rpx;

		}



	}

	.key-word {
		display: flex;
		margin-top: 13px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: 25px;
		gap: 5px;
		/* 上下间距 5px */
	}

	.key-word-active {
		color: dodgerblue;
	}

	.btn_discount {
		background-color: transparent;
		border: 1px solid dodgerblue;
		border-right: 0px;
		height: 25rpx;
		line-height: 25rpx;
		color: dodgerblue;
		border-radius: 5rpx 0 0 5rpx;
	}

	.btn_discount.active {
		background-color: dodgerblue;
		color: white;
	}

	.btn_overcharge {
		background-color: transparent;
		border: 1px solid dodgerblue;
		color: dodgerblue;
		border-radius: 0 5rpx 5rpx 0;
		height: 25rpx;
		line-height: 25rpx;
	}

	.btn_overcharge.active {
		background-color: dodgerblue;
		color: white;
	}

	.search-member {
		display: flex;
	}

	.search-member-left {
		flex: 1;
	}

	.search-member-select {
		background-color: gainsboro;
		border-radius: 5rpx;
		display: flex;
	}

	.search-member-select-text {
		flex: 1;
		text-align: center;
		border-radius: 5rpx;
		padding: 5rpx;
		font-size: 15rpx;
		font-weight: bold;
		color: darkgrey;
	}

	.search-member-select-text-active {
		background-color: #009ae7;
		color: white;
	}

	.search-member-right {
		flex: 2;
		display: flex;
	}
   .container-header {
       height: 50px;
       background-color: #ffffff;
       width: 100%;
       display: flex;
       align-items: center; /* 垂直居中 */

       .left{
           margin-left: 10px;
          align-items: left;
          display: flex;
       }
       .title{
           margin-left: 10rpx;
           font-size: 18rpx;
           font-weight: 800;
       }
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

	/* 分级商品弹窗样式 */
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
	
	.multilevel-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 20px;
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		border-bottom: 2px solid #0088cc;
	}
	
	.multilevel-popup-title {
		font-size: 20px;
		font-weight: bold;
		color: #ffffff;
		letter-spacing: 1px;
	}
	
	.multilevel-popup-close {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
		cursor: pointer;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s;
		
		&:hover {
			background-color: rgba(255, 255, 255, 0.2);
			transform: rotate(90deg);
		}
		
		&:active {
			background-color: rgba(255, 255, 255, 0.3);
		}
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
		
		&:hover {
			border-color: #00aaff;
			background: #f0f9ff;
			box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
			transform: translateX(5px);
		}
		
		&:active {
			transform: translateX(5px) scale(0.98);
			background: #e6f7ff;
		}
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
	
	.tag-consignment {
		color: dodgerblue;
		border: 1px solid dodgerblue;
		background: rgba(30, 144, 255, 0.1);
	}
	
	.tag-self {
		color: #792292;
		border: 1px solid #792292;
		background: rgba(121, 34, 146, 0.1);
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
	
	.multilevel-item-stock {
		font-size: 13rpx;
		font-weight: 600;
		color: #666;
		display: flex;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;
	}
	
	.stock-item {
		margin-right: 8px;
	}
	
	/* 动画 */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

</style>