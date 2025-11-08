<template>
  <div class="cashier-box">
    <default-header ref="headerInfo" theme="light" @showlastOrder="showLastOrder" @showHangList="saleHangList"
      @goToManagement="goToManagement" :showManageBtn="true" :lastOrder="lastOrder"></default-header>
    <div class="cashier-container">
      <div class="left-space">
        <!-- 货品选择面板组件 -->
        <CashierGoodsPanel ref="goodsPanel" :selectedGoodsIds="goodSelect.map(item => item.id)" :height="windowHeight"
          :vesionType="vesionType" :companyId="currentCompanyId" @tab-changed="handleTabChanged"
          @item-click="handleClick" @category-updated="handleCategoryUpdated" />
      </div>
      <div class="right-space">
        <div v-if="step1" class="cashier-card">
            <div class="cashier-col">
              <div class="card-title">
                <!-- 可滑动的客户管理区域 -->
                <scroll-view
                  scroll-x="true"
                  :show-scrollbar="false"
                  :scroll-left="scrollLeft"
                  class="customer-scroll-view"
                >
                  <view class="customer-scroll-content">
                    <!-- 主客户按钮（散客/当前客户） -->
                    <div
                      class="customerbtn modern-customer-btn main-customer-btn"
                      @click="activateMainCustomer"
                      :style="mainCustomerButtonStyle"
                    >
                      {{ mainCustomerData.member.customName ? mainCustomerData.member.customName : '散客' }}
                    </div>

                    <!-- 动态添加的客户按钮列表 -->
                    <div
                      v-for="(customerBtn, index) in customerButtons"
                      :key="`customer_btn_${customerBtn.id}`"
                      class="customerbtn modern-customer-btn dynamic-customer-btn"
                      :style="getDynamicCustomerStyle(customerBtn)"
                    >
                      <div @click="switchToCustomerByIndex(index)" class="customer-btn-main">
                        {{ customerBtn.name }}
                        <text
                          v-if="customerBtn.goodsCount > 0"
                          class="customer-btn-count"
                          >|{{ customerBtn.goodsCount }}件</text
                        >
                      </div>
                      <div @click.stop="deleteCustomerByIndex(index)" class="customer-btn-remove">
                        <uni-icons type="close" size="18" color="#ffffff" class="customer-btn-remove-icon"></uni-icons>
                      </div>
                    </div>

                    <!-- 添加客户按钮 -->
                    <div
                      class="add-customer-btn"
                      @click="addNewCustomerButton"
                      title="添加客户"
                    >
                      <uni-icons type="plus" size="30" color="#ff7043"></uni-icons>
                    </div>
                  </view>
                </scroll-view>
              </div>
              <OrderGoodsPanel
                :goodsList="goodSelect"
                :totalAmount="payAmount.total"
                :shippingFee="cashier.shippingFee"
                @name-click="memberChange('XiaDan')"
                @item-click="handleItemClick"
                @delete-item="deleteItem"
                @shipping-click="showShippingModal"
                @hang-order="hangOrder"
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
          <u-modal
            title="添加新顾客"
            class="payment"
            :show="customerDialogVisibleAdd"
            :closeOnClickOverlay="false"
            :showConfirmButton="false"
            :width="700"
            @close="customerDialogVisibleAdd = false"
          >
            <div class="slot-content" style="overflow-y: auto">
              <uni-section title="表单校验" type="line">
                <view class="example" style="font-size: 15rpx">
                  <!-- 基础表单校验 -->
                  <view class="input-container" style="margin-top: 10px">
                    <text class="label" style="width: 20%">客户名称：</text>
                    <input
                      class="input-field"
                      type="text"
                      :adjust-position="false"
                      placeholder=" "
                      style="
                        height: 40rpx;
                        width: 80%;
                        border-radius: 5rpx;
                        background-color: lightgray;
                        font-size: 15rpx;
                        padding-left: 10px;
                        font-weight: bold;
                      "
                      v-model="AddedCustomerFormData.name"
                    />
                  </view>
                  <view class="input-container" style="margin-top: 10px">
                    <text class="label" style="width: 20%">联系方式：</text>
                    <input
                      class="input-field"
                      type="text"
                      :adjust-position="false"
                      placeholder=" "
                      style="
                        height: 40rpx;
                        width: 80%;
                        border-radius: 5rpx;
                        background-color: lightgray;
                        font-size: 15rpx;
                        padding-left: 10px;
                        font-weight: bold;
                      "
                      v-model="AddedCustomerFormData.phone"
                    />
                  </view>
                  <view class="input-container" style="margin-top: 10px">
                    <text class="label" style="width: 20%">车牌：</text>
                    <input
                      class="input-field"
                      type="text"
                      placeholder=" "
                      style="
                        height: 40rpx;
                        width: 80%;
                        border-radius: 5rpx;
                        background-color: lightgray;
                        font-size: 15rpx;
                        padding-left: 10px;
                        font-weight: bold;
                      "
                      v-model="AddedCustomerFormData.carNum"
                    />
                  </view>
                  <view class="input-container" style="margin-top: 10px">
                    <text class="label" style="width: 20%">地址：</text>
                    <input
                      class="input-field"
                      type="text"
                      placeholder=" "
                      style="
                        height: 40rpx;
                        width: 80%;
                        border-radius: 5rpx;
                        background-color: lightgray;
                        font-size: 15rpx;
                        padding-left: 10px;
                        font-weight: bold;
                      "
                      v-model="AddedCustomerFormData.address"
                    />
                  </view>
                  <view style="display: flex">
                    <button
                      @click="
                        customerDialogVisibleAdd = false
                        memberDialogVisible = true
                      "
                      style="
                        width: 30%;
                        margin-top: 20px;
                        background-color: lightgrey;
                        box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
                        font-weight: bold;
                      "
                    >
                      返回
                    </button>
                    <button
                      type="primary"
                      @click="submitAddCustomer()"
                      style="width: 30%; margin-top: 20px; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3); font-weight: bold"
                    >
                      添加
                    </button>
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
            @add-customer="
              memberDialogVisible = false
              customerDialogVisibleAdd = true
            "
            @change-type="currentSelctCustomerType = $event"
          />
          <u-modal
            title="挂单中心"
            :show="hangListVisible"
            @close="hangListVisible = false"
            :closeOnClickOverlay="true"
            :showConfirmButton="false"
            :width="'600rpx'"
          >
            <div class="hang-modal-container">
              <!-- 左边订单列表 -->
              <div class="slot-content hang-order-list">
                <view class="grid-member-container">
                  <view v-for="group in hangList" :key="group.date" class="group-container">
                    <view class="group-title hang-order-group-title">
                      {{ group.date }}
                    </view>
                    <view
                      class="grid-member-item2"
                      v-for="item in group.items"
                      :key="item.uniqueKey"
                      @click="selectGDorder(item)"
                      :style="{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: orderGDSelect && orderGDSelect.id === item.id ? '#00aaff' : 'transparent',
                        color: orderGDSelect && orderGDSelect.id === item.id ? '#ffffff' : 'black',
                        padding: '8rpx',
                        marginBottom: '5rpx',
                        borderRadius: '4rpx',
                      }"
                    >
                      <text>{{ item.key }}</text>
                      <div class="hang-order-item-header">
                        <div>{{ item.createTime.replace('T', ' ') }}</div>
                        <div>{{ item.customName }}</div>
                      </div>
                      <div class="hang-order-model-info">
                        {{ item.modelInfo }}
                      </div>
                    </view>
                  </view>
                </view>
              </div>

              <!-- 右边订单详情 -->
              <div class="order-detail hang-order-detail">
                <template v-if="orderGDSelect">
                  <view class="table hang-order-table">
                    <!-- 表头 -->
                    <view class="table-row header hang-order-header">
                      <view class="table-cell2">名称</view>
                      <view class="table-cell2">单价</view>
                      <view class="table-cell2">总重</view>
                      <view class="table-cell2">皮重</view>
                      <view class="table-cell2">小计</view>
                    </view>

                    <!-- 表格内容示例 -->
                    <view class="table-row hang-order-row" v-for="(item, index) in orderGDSelect.modelList" :key="index">
                      <view class="table-cell2">{{ item.name }}</view>
                      <view class="table-cell2">{{ item.referenceAmount }}</view>
                      <view class="table-cell2">{{ item.totalWeight }}</view>
                      <view class="table-cell2">{{ item.tareWeight }}</view>
                      <view class="table-cell2">{{ item.subtotal }}</view>
                    </view>
                  </view>
                </template>
                <div class="hang-order-actions">
                  <button @click="deleteGDorder(orderGDSelect)" class="hang-order-btn hang-order-btn--delete">
                    删除
                  </button>
                  <button @click="printerGDModel(orderGDSelect)" class="hang-order-btn hang-order-btn--print">
                    打印挂单
                  </button>
                  <button @click="hangOrderParse(orderGDSelect)" class="hang-order-btn hang-order-btn--parse">
                    取挂单
                  </button>
                </div>
              </div>
            </div>
          </u-modal>

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

          <!-- 订单详情抽屉 -->
          <OrderDetailDrawer
            :visible="LastOrderShow"
            :orderData="lastOrder"
            :containerHeight="windowHeight"
            :showActions="true"
            @close="LastOrderShow = false"
            @print="printerModel"
            @share="shareOrder(lastOrder.id)"
          />

      </div>

      <!--下单成功弹窗-->
      <u-modal title=" " class="payment" :show="popup_paysuccess_show" :closeOnClickOverlay="true"
        :showConfirmButton="false" :width="500" @close="inputModelVisible = false">
        <view class="success-modal-card">
          <div class="success-modal-content">
            <div class="success-modal-image">
              <image src="/static/img/paySuccess.png" class="success-modal-illustration"></image>
            </div>
            <div class="success-modal-info">
              <div class="success-modal-title">下单成功</div>
              <br />
              <div class="success-modal-subtitle" v-if="lastOrder">
                订单金额：{{ lastOrder.payableAmount - lastOrder.basketOffsetAmount }} 元
              </div>
            </div>
          </div>
          <div class="success-modal-actions">
            <button class="success-modal-btn success-modal-btn--print" @click="paysuccessOrder(1)">
              <uni-icons custom-prefix="iconfont" type="icon-dayin" size="20" color="#ffffff"
                class="success-modal-icon"></uni-icons>打印
            </button>
            <button class="success-modal-btn success-modal-btn--share" @click="paysuccessOrder(2)">
              <uni-icons custom-prefix="iconfont" type="icon-zhuanfa" size="20" color="#ffffff"
                class="success-modal-icon"></uni-icons>发单
            </button>
            <button class="success-modal-btn success-modal-btn--continue" @click="paysuccessOrder(3)">
              <uni-icons custom-prefix="iconfont" type="icon-kaidan" size="20" color="#ffffff"
                class="success-modal-icon"></uni-icons>继续开单
            </button>
          </div>
        </view>
      </u-modal>
      <!--收筐抵扣弹窗-->
      <BasketOffestModel ref="modeloffestBasketRef" :basketData="extraModel" @saveBasketOffest="saveBasketOffest">
      </BasketOffestModel>
      <!--还筐弹窗(不抵扣)-->
      <RepayBasketModel ref="repayBasketModelRef" :basketData="extraModel"></RepayBasketModel>
      <!--还款弹窗-->
      <RepayModal :visible="showRepaymentModal" :customerInfo="repayCustomerData" @confirm="handleRepaymentConfirm"
        @close="showRepaymentModal = false">
      </RepayModal>

      <!-- 运费弹窗 -->
      <ShippingModal :visible="shippingModalVisible" :initialValue="cashier.shippingFee"
        @close="shippingModalVisible = false" @confirm="handleShippingConfirm" />

      <!-- 规格选择弹窗（拆包） -->
      <div v-if="specPopup.visible" class="spec-popup-mask" @click="closeSpecPopup">
        <div class="spec-popup-container" :style="specPopupStyle" @click.stop>
          <div class="spec-popup-content">
            <div v-for="(spec, index) in specPopup.specList" :key="index" class="spec-item"
              @click="handleSpecClick(spec)">
              <!-- 商品名称 + 规格名称 -->
              <div class="spec-item-name">{{ specPopup.commodity.name }}-{{ spec.specName }}</div>

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
        <div class="multilevel-popup-container" :style="multiLevelPopupStyle" @click.stop>
          <!-- <div class="multilevel-popup-header">
				<span class="multilevel-popup-title">选择分级商品</span>
			</div> -->
          <div class="multilevel-popup-content">
            <div v-for="(child, index) in multiLevelPopup.childrenList" :key="child.id || index"
              :id="'multilevel-grid-item-' + child.id" class="multilevel-grid-item"
              @click="handleMultiLevelClick(child)">
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
                <div class="multilevel-item-stock" :style="
                    !child.outPutPurchaseInventories || child.outPutPurchaseInventories.length === 0
                      ? { color: '#aa0000' }
                      : {}
                  ">
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
</template>

<script>
import VerticalTab from '@/components/VerticalTab.vue'
import GoodEditKeyboard from '@/components/GoodEditKeyboard.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import OrderDetailDrawer from '@/components/OrderDetailDrawer.vue'
import CashierGoodsPanel from '@/components/CashierGoodsPanel/CashierGoodsPanel.vue'
import CustomerSelector from '@/components/CustomerSelector/CustomerSelector.vue'
import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue'
import cashierDiscount from '../../api/cashier/cashierDiscount'
import cashierIgnore from '../../api/cashier/cashierIgnore'
import cashierOrder from '../../api/cashier/cashierOrder'
import category from '../../api/goods/category'
import member from '../../api/member/member'
import timeCard from '../../api/member/timeCard'
import payment from '../../api/cashier/payment'
import staff from '../../api/security/staff'
import stockStore from '../../api/stock/stockStore'
import config from '../../common/config'
import global from '../../common/const/global'
import login from '../../api/auth/login'
import cashierHang from '../../api/cashier/cashierHang'
import Purchase from '../../api/purchase/purchase.js'
import { generateGUID } from '../util/CommonMethod.js'
import { getCompanyId } from '../../common/const/cacheSync'
import MyNumberInputVue from '../../components/MyNumberInput.vue'
import RepayBasketModel from '@/components/repay-basket-model.vue' //还筐弹窗
import BasketOffestModel from './component/basket-offest-model.vue'
import RepayModal from '@/components/RepaymentModal.vue'
import ShippingModal from '@/components/ShippingModal.vue'

export default {
  name: 'Cashier',
  components: {
    VerticalTab,
    GoodEditKeyboard,
    MyNumberInputVue,
    RepayBasketModel,
    BasketOffestModel,
    RepayModal,
    PaymentModal,
    OrderDetailDrawer,
    CashierGoodsPanel,
    CustomerSelector,
    OrderGoodsPanel,
    ShippingModal,
  },
  data() {
    return {
      currentSelctCustomerType: 1, //当前选中的顾客操作类型 1-下单 2-还筐 3-还款
      test: 0,
      popup_paysuccess_show: false,
      repayBasketList: [], //2.0仅用于收银还筐
      repayBasketActiveIndex: 0,
      accountDiscount: true,
      vesionType: 1, //版本号
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
      AccountExpense: {
        otherAmount: 0,
        cashAmount: 0,
        alipayAmount: 0,
        wxpayAmount: 0,
      },
      discountAmount: 0,
      actionView: null,
      maskView: null,
      // 规格弹窗数据
      specPopup: {
        visible: false,
        left: 0,
        top: 0,
        commodity: null,
        specList: [],
      },
      // 分级商品弹窗数据
      multiLevelPopup: {
        visible: false,
        left: 0,
        top: 0,
        parentCommodity: null,
        childrenList: [],
      },
      memberStyle: 'XiaDan',
      AddedCustomerFormData: {},
      canvasheight: 0,
      currentPayWay: 1,
      custominputFocused: false,
      custominputFocused2: false,
      custominputFocused3: false,
      custominputFocused4: false,
      custominputFocusIndex: '',
      editingPaymentIndex: 1,
      // 输入缓冲区 - 用于优化键盘输入性能（只延迟复杂计算）
      inputBuffer: {
        timer: null, // 只用于延迟复杂计算
      },
      LastOrderShow: false,
      showRepaymentModal: false,
      repayCustomerData: {},
      step1: true,
      spuCol: 3,
      skuCol: 2,
      inputModelTitle: '收筐',
      inputModelType: 2,
      inputModelVisible: false,
      memberCol: 3,
      modalWidth: '700px',
      showKeyBord: false,
      editingCard: '',
      editingIndex: '',
      fixedTareWeight: {
        action: false,
        value: 0,
      },
      fixedPayPrint: false,
      memberEventInfo: {
        member: null,
        collectBasketNum: 0,
      },
      orderGDSelect: {},
      cashier: {
        type: 0,
        discount: 10,
        ignoreType: 0,
        ignoreAmount: 0, // 抹零
        preferentialAmount: 0, // 优惠金额
        collectAmount: 0, // 优惠后金额
        adjustAmount: 0, // 调整金额
        payableAmount: 0, // 应收
        shippingFee: 0, //运费
        remark: '',
        memberId: '',
        member: {},
        cards: [],
        source: config.platformCode,
      },
      customerDialogVisibleAdd: false,
      skuDialogVisible: false,
      skuOptions: [],
      windowHeight: 0,
      tempSpuDialogVisible: false,
      tempSpu: {
        skuName: '',
        adjustAmount: '',
        quantity: '',
      },
      selectCashierCardItem: {},
      showAllweightStr: false,
      memberDialogVisible: false,
      hangListVisible: false,
      memberSearchKeyword: '',
      goodsSearchKeyword: '', // 商品搜索关键词
      memberOptions: [],
      memberSearchOptions: [],
      hangleList: [],
      hangDialogVisible: false,
      hangPopupVisible: false,
      hangBtnLoading: false,
      lastOrder: null,
      hangFormRules: {
        name: {
          type: 'string',
          required: true,
          message: '请填写备注信息',
          trigger: ['blur', 'change'],
        },
      },
      hangInfo: {
        name: '',
        remark: '',
      },
      hangList: [],
      categoryList: [],
      currentOrderInfo: {},
      currentMember: {
        customName: '散客',
        id: '',
      },
      tempSpuRules: {
        skuName: {
          type: 'string',
          required: true,
          message: '请填写商品名',
          trigger: ['blur', 'change'],
        },
        adjustAmount: {
          type: 'number',
          required: true,
          message: '请填写单价',
          trigger: ['blur', 'change'],
        },
        quantity: {
          type: 'number',
          required: true,
          message: '请填写购买数量',
          trigger: ['blur', 'change'],
        },
      },
      payTypeDialogVisible: false,
      selectInput_pay: 1,
      payResult: {},
      rows: [],
      showRows: [],
      selectPay: {},
      payAmount: {
        total: 0,
        actual: 0,
        debt: 0,
        ExtraMoney: 0,
        BasketOffsetAmount: 0,
      },
      currentCompanyId: '',
      extraModel: [],
      editCardExtralModel: [],
      goodSelect: [],
      goodSelectKeyCounter: 0, // 用于生成唯一的 key
      customerInfoFlash: false, // 客户信息闪烁标识
      actualAmountFlash: false, // 实付金额闪烁标识
      shippingModalVisible: false,
      // 多客户管理相关
      multiCustomerModalVisible: false,
      customerCacheList: [],
      newCustomerFormVisible: false,
      newCustomerForm: {
        customName: '',
        phone: '',
        address: '',
      },
      // 快速客户切换相关
      showCustomerButtons: false,
      customerButtons: [], // 动态添加的客户按钮列表
      scrollLeft: 0, // 滚动位置
      isMainCustomerActive: true, // 主客户是否激活（默认激活）
      editingCustomerButtonIndex: -1, // 正在编辑的客户按钮索引（-1表示不在编辑状态）
      mainCustomerData: {
        // 主客户的独立数据
        member: { customName: '散客', id: '' },
        goodSelect: [],
        shippingFee: 0,
      },
    }
  },
  computed: {
    mainCustomerButtonStyle() {
      const debts = Number(this.mainCustomerData?.member?.debts || 0)
      const isActive = this.isMainCustomerActive
      const hasDebt = debts > 0

      const activeShadow = hasDebt
        ? '0 3px 10px rgba(245, 34, 45, 0.3)'
        : '0 3px 10px rgba(56, 158, 13, 0.3)'

      return {
        boxShadow: isActive ? activeShadow : '0 2px 6px rgba(0, 0, 0, 0.1)',
        background: hasDebt ? '#ff4d4f' : isActive ? '#389e0d' : '#8c8c8c',
      }
    },
    smartRoundButtonText() {
      // 强制依赖这些响应式数据，确保更新
      const total = parseFloat(String(this.payAmount.total)) || 0
      const debt = parseFloat(String(this.payAmount.debt)) || 0
      const basketOffset = parseFloat(String(this.payAmount.BasketOffsetAmount)) || 0
      const goodSelectLength = this.goodSelect.length // 添加依赖确保商品变化时更新
      const shippingFee = parseFloat(String(this.cashier.shippingFee)) || 0 // 添加运费依赖

      const baseAmount = total - basketOffset - debt

      if (baseAmount <= 0) {
        return '取零'
      }

      // 获取个位数
      const lastDigit = Math.floor(baseAmount) % 10
      const integerPart = Math.floor(baseAmount)
      const decimal = baseAmount - integerPart

      let targetAmount
      let adjustment
      let isDiscount

      // 规整到0或5结尾
      if (lastDigit === 0 || lastDigit === 5) {
        // 已经是0或5结尾，不需要调整
        adjustment = 0
        isDiscount = true
      } else if (lastDigit <= 2) {
        // 1,2 -> 向下规整到0
        targetAmount = integerPart - lastDigit
        adjustment = baseAmount - targetAmount
        isDiscount = true
      } else if (lastDigit <= 4) {
        // 3,4 -> 向下规整到0
        targetAmount = integerPart - lastDigit
        adjustment = baseAmount - targetAmount
        isDiscount = true
      } else if (lastDigit <= 7) {
        // 6,7 -> 向下规整到5
        targetAmount = integerPart - lastDigit + 5
        adjustment = baseAmount - targetAmount
        isDiscount = true
      } else {
        // 8,9 -> 向上规整到下一个0
        targetAmount = integerPart - lastDigit + 10
        adjustment = targetAmount - baseAmount
        isDiscount = false
      }

      // 如果调整金额为0，显示"已取零"
      if (Math.abs(adjustment) < 0.01) {
        return '已取零'
      }

      // 显示操作类型和金额
      const adjustmentStr = Math.abs(adjustment).toFixed(2)
      return isDiscount ? `优惠${adjustmentStr}` : `多收${adjustmentStr}`
    },
    shouldShowSmartRoundButton() {
      const total = parseFloat(String(this.payAmount.total)) || 0
      const debt = parseFloat(String(this.payAmount.debt)) || 0
      const basketOffset = parseFloat(String(this.payAmount.BasketOffsetAmount)) || 0
      const baseAmount = total - basketOffset - debt

      if (baseAmount <= 0) {
        return false
      }

      // 获取个位数
      const lastDigit = Math.floor(baseAmount) % 10

      // 如果已经是0或5结尾，不显示按钮
      return !(lastDigit === 0 || lastDigit === 5)
    },
    // 动态计算弹窗位置
    specPopupStyle() {
      const { left, top, specList } = this.specPopup
      const itemHeight = 90 // 每项高度（更新为新样式的高度：70px min-height + padding + gap）
      const popupHeight = Math.min(specList.length * itemHeight + 10, 450) // 限制最大高度450px

      // 使用 uni-app 兼容的方式获取屏幕高度
      const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight

      // 计算最佳位置（避免超出屏幕）
      let adjustedTop = top - 100 < 0 ? 0 : top - 100
      adjustedTop = adjustedTop + popupHeight > screenHeight ? screenHeight - popupHeight - 20 : adjustedTop

      return {
        left: left + 'px',
        top: adjustedTop + 'px',
      }
    },
    // 分级商品弹窗样式
    multiLevelPopupStyle() {
      const { left, top, childrenList } = this.multiLevelPopup
      const itemHeight = 90 // 每个 grid-item 的高度（包含边距）
      const popupPadding = 20 // 弹窗内边距
      const popupHeight = Math.min(childrenList.length * itemHeight + popupPadding * 2, 500) // 最大高度500px

      // 使用 uni-app 兼容的方式获取屏幕高度
      const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight

      // 计算最佳位置（避免超出屏幕）
      let adjustedTop = top - 100 < 0 ? 0 : top - 100
      adjustedTop = adjustedTop + popupHeight > screenHeight ? screenHeight - popupHeight - 20 : adjustedTop

      return {
        left: left + 'px',
        top: adjustedTop + 'px',
        maxHeight: '500px',
      }
    },
  },
  mounted() {
    console.log('cashier mounted')
    this.refreshPage()
    this.calculateScrollHeight()
    // 监听窗口大小变化
    uni.onWindowResize(() => {
      this.calculateScrollHeight()
    })
  },
  beforeUnmount() {
    // 清理所有待处理的定时器
    if (this.inputBuffer.timer) {
      clearTimeout(this.inputBuffer.timer)
    }
  },
  methods: {
    // 触发客户信息闪烁效果
    flashCustomerInfo() {
      this.customerInfoFlash = true
      setTimeout(() => {
        this.customerInfoFlash = false
      }, 1000) // 1秒后关闭闪烁效果（闪烁2次）
    },
    // 触发实付金额闪烁效果
    flashActualAmount() {
      console.log('触发实付金额闪烁动画', this.actualAmountFlash)
      // 先重置，确保动画可以重复播放
      this.actualAmountFlash = false
      // 使用 $nextTick 确保 DOM 更新
      this.$nextTick(() => {
        this.actualAmountFlash = true
        console.log('设置闪烁状态为 true', this.actualAmountFlash)
        setTimeout(() => {
          this.actualAmountFlash = false
          console.log('实付金额闪烁动画结束')
        }, 1000)
      })
    },
    // 计算scroll-view的高度
    calculateScrollHeight() {
      const windowInfo = uni.getWindowInfo()
      this.windowHeight = windowInfo.windowHeight
      // header高度(50px) + 搜索框区域(40px) + 其他间距(30px) = 120px
      // 这样可以确保商品列表完整显示
    },
    // 刷新页面数据 - 供父组件调用
    refreshPage() {
      console.log('cashier refreshPage')
      this.vesionType = uni.getStorageSync('vesionType') ?? 1
      this.windowHeight = uni.getWindowInfo().windowHeight
      // this.initSystem();
      this.currentCompanyId = uni.getStorageSync('companyId')
      // this.getCategoryList();
      this.getlastOrder()
      this.initCompanySetting()
      this.onLoadMethod()
      this.getallextralgood()
      // 从缓存恢复客户和 goodSelect 数据
      this.loadLastCustomerAndGoodSelect()
      // 刷新 VerticalTab 组件
      if (this.$refs.verticalTabRef) {
        this.$refs.verticalTabRef.refresh()
      }
    },
    getDynamicCustomerStyle(customerBtn) {
      const isActive = !!customerBtn?.isActive
      return {
        boxShadow: isActive
          ? '0 3px 10px rgba(56, 158, 13, 0.3)'
          : '0 2px 6px rgba(0, 0, 0, 0.1)',
        background: isActive ? '#389e0d' : '#8c8c8c',
      }
    },
    // 切换到管理页面（订单）
    goToManagement() {
      console.log('goToManagement - 向父组件发出事件')
      // 向父组件（index.vue）发出事件
      this.$emit('goToManagement')
    },
    // 缓存相关方法
    getCustomerCacheKey(customerId) {
      // 为每个客户生成唯一的缓存key，散客使用 'guest' 作为标识
      // 加入 companyId 区分不同商行的客户数据
      const customerKey = customerId || 'guest'
      const companyId = this.currentCompanyId || uni.getStorageSync('companyId') || 'default'
      return `cashier_customer_${companyId}_${customerKey}_cache`
    },
    // 生成客户按钮列表的缓存key（按商行区分）
    getCustomerButtonsCacheKey() {
      const companyId = this.currentCompanyId || uni.getStorageSync('companyId') || 'default'
      return `cashier_customer_buttons_${companyId}`
    },
    // 生成最后使用的客户ID的缓存key（按商行区分）
    getLastCustomerIdCacheKey() {
      const companyId = this.currentCompanyId || uni.getStorageSync('companyId') || 'default'
      return `cashier_last_customer_id_${companyId}`
    },
    saveCustomerDataToCache() {
      try {
        const customerId = (this.currentMember && this.currentMember.id) || ''
        const cacheKey = this.getCustomerCacheKey(customerId)
        const customerData = {
          member: this.currentMember,
          goodSelect: this.goodSelect,
          shippingFee: this.cashier.shippingFee || 0,
          timestamp: Date.now(),
        }
        uni.setStorageSync(cacheKey, JSON.stringify(customerData))
        // 同时保存最后使用的客户ID
        this.saveLastCustomerId()
        console.log(`保存客户数据到缓存 [${cacheKey}]:`, customerData)
      } catch (e) {
        console.error('保存客户数据缓存失败:', e)
      }
    },
    // 保存所有客户按钮到缓存
    saveCustomerButtonsToCache() {
      try {
        // 保存客户按钮列表（按商行区分）
        const cacheKey = this.getCustomerButtonsCacheKey()
        uni.setStorageSync(cacheKey, JSON.stringify(this.customerButtons))
        console.log(`已保存客户按钮列表到缓存 [${cacheKey}]:`, this.customerButtons)

        // 为每个客户按钮保存其对应的数据到单独的缓存
        this.customerButtons.forEach(btn => {
          if (btn.member && btn.member.id) {
            const cacheKey = this.getCustomerCacheKey(btn.member.id)
            const customerData = {
              member: btn.member,
              goodSelect: btn.goodSelect || [],
              shippingFee: btn.shippingFee || 0,
              timestamp: Date.now(),
            }
            uni.setStorageSync(cacheKey, JSON.stringify(customerData))
            console.log(`保存客户按钮数据 [${cacheKey}]:`, customerData)
          }
        })
      } catch (e) {
        console.error('保存客户按钮列表缓存失败:', e)
      }
    },
    // 从缓存恢复所有客户按钮
    loadCustomerButtonsFromCache() {
      try {
        const cacheKey = this.getCustomerButtonsCacheKey()
        const cachedButtons = uni.getStorageSync(cacheKey)
        if (cachedButtons) {
          const buttons = JSON.parse(cachedButtons)
          console.log(`从缓存恢复客户按钮列表 [${cacheKey}]:`, buttons)

          // 为每个按钮加载其对应的数据
          this.customerButtons = buttons.map(btn => {
            if (btn.member && btn.member.id) {
              const customerData = this.loadCustomerDataFromCache(btn.member.id)
              if (customerData) {
                return {
                  ...btn,
                  member: customerData.member || btn.member,
                  goodSelect: customerData.goodSelect || [],
                  shippingFee: customerData.shippingFee || 0,
                  goodsCount: (customerData.goodSelect || []).length,
                }
              }
            }
            return btn
          })

          console.log('已恢复客户按钮数据:', this.customerButtons)
        }
      } catch (e) {
        console.error('加载客户按钮列表缓存失败:', e)
      }
    },
    loadCustomerDataFromCache(customerId) {
      try {
        const cacheKey = this.getCustomerCacheKey(customerId)
        const cachedData = uni.getStorageSync(cacheKey)
        if (cachedData) {
          const customerData = JSON.parse(cachedData)
          console.log(`从缓存恢复客户数据 [${cacheKey}]:`, customerData)
          return customerData
        }
        return null
      } catch (e) {
        console.error('加载客户数据缓存失败:', e)
        return null
      }
    },
    clearCustomerCache(customerId) {
      try {
        const cacheKey = this.getCustomerCacheKey(customerId)
        uni.removeStorageSync(cacheKey)
        console.log(`已清空客户缓存 [${cacheKey}]`)
      } catch (e) {
        console.error('清空客户缓存失败:', e)
      }
    },
    clearAllCustomerCaches() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空当前商行所有客户的购物车数据吗？此操作不可恢复！',
        success: res => {
          if (res.confirm) {
            try {
              // 获取当前商行ID
              const companyId = this.currentCompanyId || uni.getStorageSync('companyId') || 'default'
              console.log(`清理商行 [${companyId}] 的所有客户缓存`)

              // 获取所有存储的key，清除当前商行的客户相关缓存
              const allKeys = uni.getStorageInfoSync().keys || []
              const customerCachePrefix = `cashier_customer_${companyId}_`
              const customerCacheKeys = allKeys.filter(key => key.startsWith(customerCachePrefix))
              customerCacheKeys.forEach(key => {
                uni.removeStorageSync(key)
                console.log(`已清空缓存 [${key}]`)
              })

              // 清除当前商行最后使用的客户ID
              const lastCustomerIdKey = this.getLastCustomerIdCacheKey()
              uni.removeStorageSync(lastCustomerIdKey)
              console.log(`已清空最后客户ID缓存 [${lastCustomerIdKey}]`)

              // 清除当前商行的客户按钮列表
              const customerButtonsKey = this.getCustomerButtonsCacheKey()
              uni.removeStorageSync(customerButtonsKey)
              console.log(`已清空客户按钮列表缓存 [${customerButtonsKey}]`)
              this.customerButtons = []

              // 刷新列表
              this.customerCacheList = []

              // 重置当前状态
              this.currentMember = {
                customName: '散客',
                id: '',
              }
              this.goodSelect = []

              uni.showToast({
                title: '已清空所有客户数据',
                icon: 'success',
              })

              this.multiCustomerModalVisible = false
            } catch (e) {
              console.error('清空所有客户缓存失败:', e)
              uni.showToast({
                title: '清空失败',
                icon: 'error',
              })
            }
          }
        },
      })
    },
    // 兼容旧版本的方法名
    saveGoodSelectToCache() {
      this.saveCustomerDataToCache()
      // 同时更新当前激活的客户按钮
      this.updateCurrentCustomerButton()
      // 保存客户按钮列表
      this.saveCustomerButtonsToCache()
    },
    loadGoodSelectFromCache() {
      const customerId = (this.currentMember && this.currentMember.id) || ''
      const customerData = this.loadCustomerDataFromCache(customerId)
      if (customerData) {
        this.goodSelect = customerData.goodSelect || []
        this.cashier.shippingFee = customerData.shippingFee || 0
        // 如果缓存中有客户信息，也恢复客户信息
        if (customerData.member) {
          this.currentMember = customerData.member
        }
      }
    },
    clearGoodSelectCache() {
      const customerId = (this.currentMember && this.currentMember.id) || ''
      this.clearCustomerCache(customerId)
    },
    saveCurrentCustomerDataBeforeSwitch() {
      // 保存当前激活客户按钮的数据
      const currentActiveIndex = this.customerButtons.findIndex(btn => btn.isActive)
      if (currentActiveIndex !== -1) {
        this.customerButtons[currentActiveIndex].member = { ...this.currentMember }
        this.customerButtons[currentActiveIndex].goodSelect = [...this.goodSelect]
        this.customerButtons[currentActiveIndex].shippingFee = this.cashier.shippingFee || 0
        this.customerButtons[currentActiveIndex].goodsCount = this.goodSelect.length
        console.log('已保存激活客户按钮的数据')
      }

      // 保存当前客户的 goodSelect 和运费数据到缓存
      if (this.goodSelect.length > 0 || this.cashier.shippingFee > 0) {
        this.saveCustomerDataToCache()
        console.log('客户切换前已保存当前数据到缓存')
      }
    },
    saveCurrentActiveCustomerData() {
      // 保存当前激活客户的数据到缓存
      this.saveCustomerDataToCache()

      // 如果主客户是激活状态，保存到主客户数据
      if (this.isMainCustomerActive) {
        this.mainCustomerData.member = { ...this.currentMember }
        this.mainCustomerData.goodSelect = [...this.goodSelect]
        this.mainCustomerData.shippingFee = this.cashier.shippingFee || 0
        console.log('主客户激活，已保存主客户数据')
        return
      }

      // 如果某个动态客户是激活状态，保存其数据
      const currentActiveIndex = this.customerButtons.findIndex(btn => btn.isActive)
      if (currentActiveIndex !== -1) {
        this.customerButtons[currentActiveIndex].member = { ...this.currentMember }
        this.customerButtons[currentActiveIndex].goodSelect = [...this.goodSelect]
        this.customerButtons[currentActiveIndex].shippingFee = this.cashier.shippingFee || 0
        this.customerButtons[currentActiveIndex].goodsCount = this.goodSelect.length
        console.log('已保存激活的动态客户按钮数据')
      }
    },
    loadNewCustomerData(newCustomerId) {
      // 加载新客户的 goodSelect 数据
      const customerData = this.loadCustomerDataFromCache(newCustomerId)
      if (customerData && customerData.goodSelect) {
        this.goodSelect = customerData.goodSelect
        this.cashier.shippingFee = customerData.shippingFee || 0
        console.log('已加载新客户的购物车数据:', this.goodSelect)
        console.log('已加载新客户的运费:', this.cashier.shippingFee)
        // 重新计算金额
        this.reCountGoodSelect()
      } else {
        // 如果没有缓存数据，清空购物车
        this.goodSelect = []
        this.cashier.shippingFee = 0
        console.log('新客户无缓存数据，已清空购物车')
      }
    },
    loadLastCustomerAndGoodSelect() {
      try {
        // 先恢复客户按钮列表
        this.loadCustomerButtonsFromCache()

        // 检查是否有激活的动态客户按钮
        const activeButtonIndex = this.customerButtons.findIndex(btn => btn.isActive)
        if (activeButtonIndex !== -1) {
          // 如果有激活的动态客户，主客户设为未激活
          this.isMainCustomerActive = false
          console.log('检测到激活的动态客户按钮，主客户设为未激活')
        } else {
          // 没有激活的动态客户，主客户保持激活状态
          this.isMainCustomerActive = true
          console.log('没有激活的动态客户按钮，主客户保持激活')
        }

        // 尝试恢复最后使用的客户信息（按商行区分）
        const lastCustomerIdCacheKey = this.getLastCustomerIdCacheKey()
        const lastCustomerId = uni.getStorageSync(lastCustomerIdCacheKey) || ''
        console.log(`尝试恢复最后使用的客户ID [${lastCustomerIdCacheKey}]:`, lastCustomerId)

        const customerData = this.loadCustomerDataFromCache(lastCustomerId)
        if (customerData) {
          // 恢复客户信息和购物车数据
          if (customerData.member) {
            this.currentMember = customerData.member
            // 如果主客户是激活状态，同步到主客户数据
            if (this.isMainCustomerActive) {
              this.mainCustomerData.member = { ...customerData.member }
            }
            console.log('已恢复客户信息:', this.currentMember)
          }
          if (customerData.goodSelect && customerData.goodSelect.length > 0) {
            this.goodSelect = customerData.goodSelect
            // 如果主客户是激活状态，同步到主客户数据
            if (this.isMainCustomerActive) {
              this.mainCustomerData.goodSelect = [...customerData.goodSelect]
            }
            console.log('已恢复购物车数据:', this.goodSelect)
            // 重新计算金额
            this.$nextTick(() => {
              this.reCountGoodSelect()
            })
          }
          // 恢复运费
          this.cashier.shippingFee = customerData.shippingFee || 0
          // 如果主客户是激活状态，同步到主客户数据
          if (this.isMainCustomerActive) {
            this.mainCustomerData.shippingFee = customerData.shippingFee || 0
          }
          console.log('已恢复运费:', this.cashier.shippingFee)
        } else {
          // 没有缓存数据，使用默认的散客
          console.log('无缓存数据，使用默认散客状态')
        }
      } catch (e) {
        console.error('加载最后客户数据失败:', e)
      }
    },
    saveLastCustomerId() {
      try {
        const customerId = (this.currentMember && this.currentMember.id) || ''
        const cacheKey = this.getLastCustomerIdCacheKey()
        uni.setStorageSync(cacheKey, customerId)
        console.log(`已保存最后使用的客户ID [${cacheKey}]:`, customerId)
      } catch (e) {
        console.error('保存最后客户ID失败:', e)
      }
    },
    // 管理功能：获取当前商行所有客户缓存列表
    getAllCustomerCaches() {
      try {
        // 获取当前商行ID
        const companyId = this.currentCompanyId || uni.getStorageSync('companyId') || 'default'
        const allKeys = uni.getStorageInfoSync().keys || []
        // 只获取当前商行的客户缓存
        const customerCachePrefix = `cashier_customer_${companyId}_`
        const customerCacheKeys = allKeys.filter(key => key.startsWith(customerCachePrefix))
        const caches = []

        console.log(`获取商行 [${companyId}] 的客户缓存，找到 ${customerCacheKeys.length} 个`)

        customerCacheKeys.forEach(key => {
          try {
            const data = uni.getStorageSync(key)
            if (data) {
              const customerData = JSON.parse(data)
              caches.push({
                key,
                customerId: customerData.member?.id || '',
                customerName: customerData.member?.customName || '散客',
                goodSelectCount: customerData.goodSelect?.length || 0,
                shippingFee: customerData.shippingFee || 0,
                timestamp: customerData.timestamp || 0,
                member: customerData.member,
              })
            }
          } catch (e) {
            console.error(`解析缓存失败 [${key}]:`, e)
          }
        })

        return caches.sort((a, b) => b.timestamp - a.timestamp)
      } catch (e) {
        console.error('获取客户缓存列表失败:', e)
        return []
      }
    },
    getAllCustomerCachesCount() {
      return this.getAllCustomerCaches().length
    },
    showMultiCustomerManager() {
      this.customerCacheList = this.getAllCustomerCaches()
      this.multiCustomerModalVisible = true
      console.log('多客户缓存列表:', this.customerCacheList)
    },
    switchToCustomer(customerCache) {
      console.log('切换到客户:', customerCache)

      // 保存当前客户数据
      this.saveCurrentCustomerDataBeforeSwitch()

      // 切换到选中的客户
      if (customerCache.member) {
        this.currentMember = customerCache.member
      } else {
        this.currentMember = {
          customName: '散客',
          id: '',
        }
      }

      // 保存最后使用的客户ID
      this.saveLastCustomerId()

      // 加载客户数据
      this.loadNewCustomerData(customerCache.customerId)

      // 关闭弹窗
      this.multiCustomerModalVisible = false

      uni.showToast({
        title: `已切换到: ${customerCache.customerName}`,
        icon: 'success',
        duration: 2000,
      })
    },
    removeCustomerCache(customerCache) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除客户"${customerCache.customerName}"的购物车数据吗？`,
        success: res => {
          if (res.confirm) {
            this.clearCustomerCache(customerCache.customerId)
            // 刷新列表
            this.customerCacheList = this.getAllCustomerCaches()
            uni.showToast({
              title: '已删除客户数据',
              icon: 'success',
            })
          }
        },
      })
    },
    addCustomerFromManager() {
      // 关闭多客户管理弹窗
      this.multiCustomerModalVisible = false
      // 打开客户选择界面
      this.memberChange('XiaDan')
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return '未知'
      try {
        return new Date(timestamp).toLocaleString()
      } catch (e) {
        return '时间格式错误'
      }
    },
    getCurrentMemberId() {
      return (this.currentMember && this.currentMember.id) || ''
    },
    addNewCustomerButton() {
      // 检查是否已达到最大客户数量限制
      if (this.customerButtons.length >= 5) {
        uni.showToast({
          title: '最多只能添加5个客户',
          icon: 'error',
          duration: 2000,
        })
        return
      }

      // 创建一个新的客户按钮
      const customerNumber = this.customerButtons.length + 1
      const customerName = customerNumber === 1 ? '散客' : `散客${customerNumber}`

      const newCustomerBtn = {
        id: `customer_${Date.now()}`,
        name: customerName,
        member: {
          customName: customerName,
          id: `temp_${Date.now()}`,
        },
        goodSelect: [],
        shippingFee: 0,
        goodsCount: 0,
        isActive: false,
      }

      // 添加到客户按钮列表
      this.customerButtons.push(newCustomerBtn)
      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()
    },
    activateMainCustomer() {
      // 如果主客户已经是激活状态，打开客户选择对话框更换主客户
      if (this.isMainCustomerActive) {
        this.editingCustomerButtonIndex = -1 // 标记为编辑主客户
        this.memberChange('XiaDan')
        return
      }

      // 保存当前激活客户的数据
      this.saveCurrentActiveCustomerData()

      // 将所有动态客户按钮设为非激活状态
      this.customerButtons.forEach(btn => {
        btn.isActive = false
      })

      // 激活主客户
      this.isMainCustomerActive = true

      // 加载主客户的数据到工作区
      this.currentMember = { ...this.mainCustomerData.member }
      this.goodSelect = [...this.mainCustomerData.goodSelect]
      this.cashier.shippingFee = this.mainCustomerData.shippingFee || 0

      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()

      // 重新计算金额
      this.changeFee()

      uni.showToast({
        title: `已切换到: ${this.mainCustomerData.member.customName || '散客'}`,
        icon: 'success',
        duration: 1500,
      })
    },
    switchToCustomerByIndex(index) {
      if (index < 0 || index >= this.customerButtons.length) return

      const targetCustomerBtn = this.customerButtons[index]

      // 如果点击的是当前激活的客户，打开客户选择对话框更换该位置的客户
      if (targetCustomerBtn.isActive) {
        // 保存当前索引，用于稍后更新对应位置的客户
        this.editingCustomerButtonIndex = index
        this.memberChange('XiaDan')
        return
      }

      // 保存当前激活客户的数据
      this.saveCurrentActiveCustomerData()

      // 将主客户设为非激活状态
      this.isMainCustomerActive = false

      // 将所有动态客户按钮设为非激活状态
      this.customerButtons.forEach(btn => {
        btn.isActive = false
      })

      // 激活目标按钮
      this.customerButtons[index].isActive = true

      // 加载目标客户的数据
      this.currentMember = { ...targetCustomerBtn.member }
      this.goodSelect = targetCustomerBtn.goodSelect || []
      this.cashier.shippingFee = targetCustomerBtn.shippingFee || 0

      // 保存最后使用的客户ID
      this.saveLastCustomerId()

      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()

      // 重新计算金额
      this.changeFee()

      uni.showToast({
        title: `已切换到: ${targetCustomerBtn.name}`,
        icon: 'success',
        duration: 1500,
      })
    },
    saveCurrentCustomerToButton() {
      // 找到当前激活的客户按钮并保存数据
      const activeIndex = this.customerButtons.findIndex(btn => btn.isActive)
      if (activeIndex !== -1) {
        this.customerButtons[activeIndex].member = { ...this.currentMember }
        this.customerButtons[activeIndex].goodSelect = [...this.goodSelect]
        this.customerButtons[activeIndex].shippingFee = this.cashier.shippingFee || 0
        this.customerButtons[activeIndex].goodsCount = this.goodSelect.length
      }
    },
    updateCustomerButtonsFromCache() {
      // 从缓存更新客户按钮状态
      this.customerButtons.forEach(btn => {
        const customerData = this.loadCustomerDataFromCache(btn.member.id)
        if (customerData) {
          btn.goodSelect = customerData.goodSelect || []
          btn.shippingFee = customerData.shippingFee || 0
          btn.goodsCount = btn.goodSelect.length
          if (customerData.member) {
            btn.member = customerData.member
            btn.name = customerData.member.customName
          }
        }
      })
    },
    updateCurrentCustomerButton() {
      // 更新当前激活的客户按钮的商品数量
      const activeIndex = this.customerButtons.findIndex(btn => btn.isActive)
      if (activeIndex !== -1) {
        this.customerButtons[activeIndex].goodsCount = this.goodSelect.length
      }
    },
    scrollToFront() {
      // 滚动到最前面，显示激活的客户
      this.scrollLeft = 0
    },
    swapCustomerPositions(targetIndex) {
      // 保存当前主客户的数据到缓存
      this.saveCustomerDataToCache()

      // 保存当前主客户的数据到临时变量
      const currentMainCustomer = {
        member: { ...this.currentMember },
        goodSelect: [...this.goodSelect],
        shippingFee: this.cashier.shippingFee || 0,
        goodsCount: this.goodSelect.length,
      }

      // 获取目标客户的数据
      const targetCustomer = this.customerButtons[targetIndex]

      // 将目标客户的数据设置为主客户，如果是散客类型则去掉索引
      const newMainCustomer = { ...targetCustomer.member }
      if (newMainCustomer.customName && newMainCustomer.customName.startsWith('散客')) {
        newMainCustomer.customName = '散客'
      }

      this.currentMember = newMainCustomer
      this.goodSelect = targetCustomer.goodSelect || []
      this.cashier.shippingFee = targetCustomer.shippingFee || 0

      // 创建新的客户按钮来代替原来的主客户位置
      const newCustomerBtn = {
        id: `main_customer_${Date.now()}`,
        name: currentMainCustomer.member.customName || '散客',
        member: currentMainCustomer.member,
        goodSelect: currentMainCustomer.goodSelect,
        shippingFee: currentMainCustomer.shippingFee,
        goodsCount: currentMainCustomer.goodsCount,
        isActive: false,
      }

      // 将原主客户数据放到目标位置
      this.customerButtons.splice(targetIndex, 1, newCustomerBtn)

      // 设置所有按钮为非激活状态
      this.customerButtons.forEach(btn => {
        btn.isActive = false
      })

      // 保存最后使用的客户ID
      this.saveLastCustomerId()

      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()

      // 重新计算金额
      this.$nextTick(() => {
        this.reCountGoodSelect()
      })

      // 滚动到最前面
      this.scrollToFront()
    },
    deleteCustomerByIndex(index) {
      // 获取要删除的客户
      const customerToDelete = this.customerButtons[index]
      if (!customerToDelete) {
        return
      }

      // 确认删除
      uni.showModal({
        title: '确认删除',
        content: `确定要删除客户"${customerToDelete.name}"吗？`,
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#ff4d4f',
        success: res => {
          if (res.confirm) {
            // 检查是否删除的是当前激活的客户
            const isActiveCustomer = customerToDelete.isActive

            // 清除该客户的缓存
            const customerId = customerToDelete.member?.id || customerToDelete.member?.customId
            if (customerId) {
              this.clearCustomerCache(customerId)
            }

            // 从动态客户列表中移除
            this.customerButtons.splice(index, 1)

            // 如果删除的是激活客户，激活主客户
            if (isActiveCustomer) {
              this.customerButtons.forEach(btn => {
                btn.isActive = false
              })
              this.isMainCustomerActive = true
            }

            // 保存客户按钮列表到缓存
            this.saveCustomerButtonsToCache()

            uni.showToast({
              title: `已删除客户"${customerToDelete.name}"`,
              icon: 'success',
              duration: 2000,
            })
          }
        },
      })
    },
    deleteMainCustomer() {
      // 检查是否有动态客户可以提升
      if (this.customerButtons.length === 0) {
        uni.showToast({
          title: '没有其他客户可以切换',
          icon: 'error',
          duration: 2000,
        })
        return
      }

      // 确认删除
      uni.showModal({
        title: '确认删除',
        content: `确定要删除当前主客户"${this.currentMember.customName || '散客'}"吗？第一个客户"${this.customerButtons[0].name}"将成为新的主客户。`,
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#ff4d4f',
        success: res => {
          if (res.confirm) {
            this.performDeleteMainCustomer()
          }
        },
      })
    },
    performDeleteMainCustomer() {
      // 清除当前主客户的缓存
      const currentCustomerId = this.getCurrentMemberId()
      if (currentCustomerId) {
        this.clearCustomerCache(currentCustomerId)
      }

      // 获取第一个动态客户
      const firstCustomer = this.customerButtons[0]

      // 将第一个动态客户提升为主客户，如果是散客类型则去掉索引
      const newMainCustomer = { ...firstCustomer.member }
      if (newMainCustomer.customName && newMainCustomer.customName.startsWith('散客')) {
        newMainCustomer.customName = '散客'
      }

      this.currentMember = newMainCustomer
      this.goodSelect = firstCustomer.goodSelect || []
      this.cashier.shippingFee = firstCustomer.shippingFee || 0

      // 从动态客户列表中移除第一个客户
      this.customerButtons.splice(0, 1)

      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()

      // 重新计算金额
      this.$nextTick(() => {
        this.reCountGoodSelect()
      })

      // 保存最后使用的客户ID
      this.saveLastCustomerId()

      uni.showToast({
        title: `已删除原主客户，${firstCustomer.name}成为新主客户`,
        icon: 'success',
        duration: 2000,
      })
    },
    switchToNextCustomerAfterOrder() {
      // 订单完成后，如果有动态客户列表，将第一个客户提升为主客户
      if (this.customerButtons.length === 0) {
        // 没有动态客户，保持当前主客户（已重置为散客）
        console.log('订单完成，无动态客户，保持当前状态')
        return
      }

      // 清除当前主客户的缓存（因为已经resetOrder清空了）
      const currentCustomerId = this.getCurrentMemberId()
      if (currentCustomerId) {
        this.clearCustomerCache(currentCustomerId)
      }

      // 获取第一个动态客户
      const firstCustomer = this.customerButtons[0]

      // 将第一个动态客户提升为主客户，如果是散客类型则去掉索引
      const newMainCustomer = { ...firstCustomer.member }
      if (newMainCustomer.customName && newMainCustomer.customName.startsWith('散客')) {
        newMainCustomer.customName = '散客'
      }

      this.currentMember = newMainCustomer
      this.goodSelect = firstCustomer.goodSelect || []
      this.cashier.shippingFee = firstCustomer.shippingFee || 0

      // 从动态客户列表中移除第一个客户
      this.customerButtons.splice(0, 1)

      // 保存客户按钮列表到缓存
      this.saveCustomerButtonsToCache()

      // 重新计算金额
      this.$nextTick(() => {
        this.reCountGoodSelect()
      })

      // 保存最后使用的客户ID
      this.saveLastCustomerId()

      console.log(`订单完成，${firstCustomer.name}成为新主客户`)
    },
    // 运费相关方法
    showShippingModal() {
      this.shippingModalVisible = true
    },
    handleShippingConfirm(fee) {
      this.cashier.shippingFee = fee
      this.shippingModalVisible = false
      // 保存运费到客户缓存
      this.saveCustomerDataToCache()
      this.reCountGoodSelect() // 重新计算总金额
      uni.showToast({
        title: '运费设置成功',
        icon: 'success',
      })
    },
    onInputFocus() {
      // 输入框获得焦点时的处理
      console.log('运费输入框获得焦点')
    },
    editCardExtraModelSelct(e) {
      this.editingCard.extralModel = JSON.parse(JSON.stringify(this.editCardExtralModel[e]))
      console.log('this.editingCard.extralModel', this.editingCard.extralModel)
      //押筐数量处理
      if (this.editingCard.extralModel) {
        this.editingCard.extralModel.quantity = this.editingCard.quantity
        if (this.editingCard.extralModel.weight) {
          this.editingCard.carweight = this.editingCard.extralModel.quantity * this.editingCard.extralModel.weight
        }
      }
    },
    onLoadMethod() {
      this.currentCompanyId = uni.getStorageSync('companyId')
      this.getCategoryList()
      this.initCompanySetting()
    },
    initCompanySetting() {
      var companySetting = uni.getStorageSync('companySetting')
      if (companySetting != null) {
        if (companySetting._fixedTareWeight) {
          this.fixedTareWeight = companySetting._fixedTareWeight
        }
        if (companySetting._fixedPayPrint) {
          this.fixedPayPrint = companySetting._fixedPayPrint
        }
      }
    },
    paysuccessOrder(type) {
      this.popup_paysuccess_show = false
      if (type == 1) {
        this.printerModel(this.lastOrder)
      } else if (type == 2) {
        this.shareOrder(this.lastOrder.id)
      }
    },
    clickKeyWord(key) {
      this.currentKeyWord = key
      // 清空文本搜索框，避免冲突
      this.goodsSearchKeyword = ''

      if (key === '全') {
        this.rows = []
        this.commidityList.sort((a, b) => b.inventory - a.inventory)
        for (let i = 0; i < this.commidityList.length; i += 3) {
          this.rows.push(this.commidityList.slice(i, i + 3))
        }
      } else {
        var commidityList = this.commidityList.filter(x => x.name.includes(key))
        this.rows = []
        commidityList.sort((a, b) => b.inventory - a.inventory)
        for (let i = 0; i < commidityList.length; i += 3) {
          this.rows.push(commidityList.slice(i, i + 3))
        }
      }
    },
    setDicountAmount() {
      this.accountDiscount = true
      // 安全的数字转换
      const total = parseFloat(this.payAmount.total) || 0
      const discount = parseFloat(this.discountAmount) || 0
      const debt = parseFloat(this.payAmount.debt) || 0
      const basketOffset = parseFloat(this.payAmount.BasketOffsetAmount) || 0
      this.payAmount.actual = Math.floor(total - discount - basketOffset - debt)
      this.setAccountExpense(this.payAmount.actual)
    },
    setOverchargeAmount() {
      this.accountDiscount = false
      // 安全的数字转换
      const total = parseFloat(this.payAmount.total) || 0
      const discount = parseFloat(this.discountAmount) || 0
      const debt = parseFloat(this.payAmount.debt) || 0
      const basketOffset = parseFloat(this.payAmount.BasketOffsetAmount) || 0
      this.payAmount.actual = Math.floor(total + discount - basketOffset - debt)
      this.setAccountExpense(this.payAmount.actual)
    },
    smartRound() {
      const total = parseFloat(this.payAmount.total) || 0
      const debt = parseFloat(this.payAmount.debt) || 0
      const basketOffset = parseFloat(this.payAmount.BasketOffsetAmount) || 0
      const baseAmount = total - basketOffset - debt

      // 获取个位数
      const lastDigit = Math.floor(baseAmount) % 10
      const integerPart = Math.floor(baseAmount)
      const decimal = baseAmount - integerPart

      let targetAmount
      let adjustment

      // 规整到0或5结尾
      if (lastDigit === 0 || lastDigit === 5) {
        // 已经是0或5结尾，不需要调整
        adjustment = 0
        this.accountDiscount = true
      } else if (lastDigit <= 2) {
        // 1,2 -> 向下规整到0
        targetAmount = integerPart - lastDigit
        adjustment = baseAmount - targetAmount
        this.accountDiscount = true // 优惠模式
      } else if (lastDigit <= 4) {
        // 3,4 -> 向下规整到0
        targetAmount = integerPart - lastDigit
        adjustment = baseAmount - targetAmount
        this.accountDiscount = true // 优惠模式
      } else if (lastDigit <= 7) {
        // 6,7 -> 向下规整到5
        targetAmount = integerPart - lastDigit + 5
        adjustment = baseAmount - targetAmount
        this.accountDiscount = true // 优惠模式
      } else {
        // 8,9 -> 向上规整到下一个0
        targetAmount = integerPart - lastDigit + 10
        adjustment = targetAmount - baseAmount
        this.accountDiscount = false // 多收模式
      }

      // 设置优惠/多收金额（显示为整数）
      this.discountAmount = Math.floor(Math.abs(adjustment))

      // 重新计算实付金额
      const totalAmt = eval(this.payAmount.total)
      const discountAmt = eval(this.discountAmount)
      const debtAmt = eval(this.payAmount.debt)
      const basketOffsetAmt = eval(this.payAmount.BasketOffsetAmount) || 0
      if (this.accountDiscount) {
        this.payAmount.actual = totalAmt - discountAmt - basketOffsetAmt - debtAmt
      } else {
        this.payAmount.actual = totalAmt + discountAmt - basketOffsetAmt - debtAmt
      }
      this.setAccountExpense(this.payAmount.actual)
    },
    setAccountExpense(val) {
      this.AccountExpense = {
        otherAmount: 0,
        cashAmount: 0,
        alipayAmount: 0,
        wxpayAmount: val,
      }
    },
    countTareWeight(str) {
      console.log(str)
      return eval(str)
    },
    cancelRepayBasket() {
      this.inputModelVisible = false
      this.resetPayBasket()
      this.payAmount.actual = this.payAmount.actual + this.payAmount.BasketOffsetAmount
      this.payAmount.BasketOffsetAmount = 0
    },
    saveBasketOffest(basketList) {
      console.log('basketList', basketList)
      // if (parseInt(this.memberEventInfo.collectBasketNum) === 0) {
      // 	return;
      // }
      this.repayBasketList = basketList
      this.payAmount.actual += this.payAmount.BasketOffsetAmount
      this.payAmount.BasketOffsetAmount = 0
      for (var i = 0; i < this.repayBasketList.length; i++) {
        this.payAmount.BasketOffsetAmount +=
          parseFloat(this.repayBasketList[i].quantity) * parseFloat(this.repayBasketList[i].amount)
      }
      // 计算实付金额：应付金额 +/- 优惠多收 - 收筐抵扣 - 下欠金额
      const total = parseFloat(this.payAmount.total) || 0
      const basketOffset = parseFloat(this.payAmount.BasketOffsetAmount) || 0
      const debt = parseFloat(this.payAmount.debt) || 0
      const discount = parseFloat(this.discountAmount) || 0
      if (this.accountDiscount) {
        this.payAmount.actual = Math.floor(total - discount - basketOffset - debt)
      } else {
        this.payAmount.actual = Math.floor(total + discount - basketOffset - debt)
      }
      // 实付金额改变时，重置支付方式并默认分配到微信支付
      this.setAccountExpense(this.payAmount.actual)
      this.inputModelVisible = false
    },
    collectBasketoffestMoney() {
      this.$nextTick(() => {
        this.$refs.modeloffestBasketRef.open(this.repayBasketList)
      })
      this.playSystemKeyClickSound()
      // this.inputModelType = 3;
      // this.inputModelVisible = true;
    },
    blurExtralModel1(e) {
      if (e.target.value == null || e.target.value === '' || e.target.value == NaN) {
        this.extraModel[0].quantity = 0
      } else {
        this.extraModel[0].quantity = e.target.value
      }
      this.reCountGoodSelect2()
    },
    getlastOrder() {
      console.log('getlastOrder')
      let that = this
      that.lastOrder = null
      cashierOrder.GetLastAccountCompanyId(that.currentCompanyId).then(res => {
        console.log('getlastOrder', res)
        that.lastOrder = res.data
        that.lastOrder.modelList = JSON.parse(that.lastOrder.module)
        const basketOffsetList = that.lastOrder.modelList.filter(item => item.type === 4)
        that.lastOrder.modelList = that.lastOrder.modelList
          .filter(item => item.type !== 4)
          .sort((a, b) => a.type - b.type)
        if (basketOffsetList.length > 0) {
          that.lastOrder.basketOffsetNum = basketOffsetList[0].mount
        }
      })
    },
    async getlastOrder_print() {
      let that = this
      return await cashierOrder.GetLastAccountCompanyId(that.currentCompanyId)
    },
    getallextralgood() {
      this.extraModel = []
      this.editCardExtralModel = [
        {
          name: '空',
          amount: 0,
          id: '',
        },
      ]
      let that = this
      category.getallextralgood(this.currentCompanyId).then(res => {
        that.extraModel = res.data
        that.editCardExtralModel = that.editCardExtralModel.concat(res.data)
        console.log('editCardExtralModel', that.editCardExtralModel)
        that.extraModel.forEach(x => {
          x.quantity = 0
          x.money = 0
        })
        that.editCardExtralModel.forEach(x => {
          x.quantity = 0
          x.money = 0
        })
      })
    },
    //客户中心点击客户事件
    changeMember(e) {
      console.log('this.currentSelctCustomerType', this.currentSelctCustomerType)
      this.memberDialogVisible = false
      if (this.currentSelctCustomerType === 1) {
        // 检查是否在编辑某个动态客户按钮
        if (this.editingCustomerButtonIndex !== -1) {
          // 更新该位置的客户信息
          const index = this.editingCustomerButtonIndex
          if (index >= 0 && index < this.customerButtons.length) {
            // 保存新客户到该按钮
            this.customerButtons[index].member = { ...e }
            this.customerButtons[index].name = e.customName || '散客'
            // 保持该按钮的商品和运费数据不变
            this.customerButtons[index].goodsCount = this.customerButtons[index].goodSelect?.length || 0

            // 如果该按钮是激活状态，更新主显示区域
            if (this.customerButtons[index].isActive) {
              this.currentMember = { ...e }
              // 保持当前购物车数据不变
            }

            // 保存客户按钮列表到缓存
            this.saveCustomerButtonsToCache()

            uni.showToast({
              title: `已更新客户: ${e.customName || '散客'}`,
              icon: 'success',
              duration: 1500,
            })
          }

          // 重置编辑索引
          this.editingCustomerButtonIndex = -1
          return
        }

        // 在切换客户前，先保存当前客户的数据
        this.saveCurrentCustomerDataBeforeSwitch()

        // 切换到新客户
        this.currentMember = e

        // 更新主客户数据
        this.mainCustomerData.member = { ...e }

        // 激活主客户
        this.isMainCustomerActive = true

        // 清除所有动态客户按钮的激活状态（因为主客户被重新选择）
        this.customerButtons.forEach(btn => {
          btn.isActive = false
        })

        // 保存最后使用的客户ID
        this.saveLastCustomerId()

        // 保存客户按钮列表到缓存
        this.saveCustomerButtonsToCache()

        // 加载新客户的数据
        this.loadNewCustomerData(e?.id)
      } else if (this.currentSelctCustomerType === 2) {
        this.$refs.repayBasketModelRef.openRepayBasket(e)
      } else if (this.currentSelctCustomerType === 3) {
        this.repayCustomerData = e
        this.showRepaymentModal = true
      }

      // if (this.memberStyle === "XiaDan") {

      // } else if (this.memberStyle === "ShouKuang") {
      // 	this.inputModelVisible = true;
      // 	this.repayBasketList = [];
      // 	this.repayBasketActiveIndex = 0;
      // 	for (var i = 0; i < this.extraModel.length; i++) {
      // 		this.repayBasketList.push({
      // 			name: this.extraModel[i].name,
      // 			amount: this.extraModel[i].amount,
      // 			quantity: 0,
      // 		})
      // 	}
      // 	this.memberEventInfo.member = e;
      // 	this.memberEventInfo.collectBasketNum = 0;
      // }
      // 1.0 改单
      // else if (this.memberStyle === "MemberChange") {
      // 	this.orderMemberChangeMain(e, this.lastOrder);
      // }
    },
    //处理还款事件
    handleRepaymentConfirm(data) {
      console.log('data', data)
    },
    selectGDorder(e) {
      this.orderGDSelect = e
      this.orderGDSelect.modelList = JSON.parse(e.module)
    },
    //取挂单
    hangOrderParse(e) {
      console.log('e', e)
      this.goodSelect = []
      let modelList = JSON.parse(e.module)
      console.log('modelList', modelList)
      for (let i = 0; i < modelList.length; i++) {
        let model = modelList[i]
        if (model.type == 1) {
          let good = {
            key: this.goodSelectKeyCounter++,
            skuName: model.name,
            referenceAmount: model.referenceAmount,
            quantity: model.mount,
            carweight: model.tareWeight,
            allweight: model.totalWeight,
            allweightSrt: model.totalWeight,
            stockType: model.stockType,
            commodityId: model.commodityId,
            purchaseAssistId: model.purchaseAssistId,
            commoditySpec: model.commoditySpec,
            money: model.subtotal && model.subtotal != null ? model.subtotal : 0,
            id: model.Id ? model.Id : '',
            saleWay: model.saleWay,
          }
          this.goodSelect.push(good)
        }
      }
      console.log('this.goodSelect', this.goodSelect)
      //还原押筐
      for (let i = 0; i < modelList.length; i++) {
        if (modelList[i].type == 2) {
          for (let k = 0; k < this.goodSelect.length; k++) {
            console.log('1')
            if (modelList[i].parentId == this.goodSelect[k].id) {
              console.log('2')
              this.goodSelect[k].extralModel = {
                name: modelList[i].name,
                money: modelList[i].amount,
                quantity: modelList[i].mount,
                id: modelList[i].commodityId,
                amount: modelList[i].referenceAmount,
              }
            }
          }
        }
      }
      // 保存到缓存
      this.saveGoodSelectToCache()

      this.currentOrderInfo.Id = e.id
      this.currentOrderInfo.accountCode = e.accountCode
      if (e.customerId != null && e.customerId != '') {
        member.GetmemberByCustomeId(e.customerId).then(res => {
          this.currentMember = res.data
        })
      }
      this.reCountGoodSelect()
      this.hangListVisible = false
    },
    changPayWay(index) {
      for (var i = 0; i < this.payWay.length; i++) {
        this.payWay[i].select = 0
      }
      this.payWay[index].select = 1
      this.currentPayWay = this.payWay[index].id
    },
    playSystemKeyClickSound() {
      // #ifdef APP-PLUS
      try {
        // 检查 plus 对象是否存在
        if (typeof plus === 'undefined') {
          return
        }
        var Context = plus.android.importClass('android.content.Context')
        var AudioManager = plus.android.importClass('android.media.AudioManager')
        var main = plus.android.runtimeMainActivity()
        var audioManager = main.getSystemService(Context.AUDIO_SERVICE)
        audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK)
      } catch (e) {
        console.error('播放系统按键音失败:', e)
      }
      // #endif
    },
    NumberCk(val) {
      // this.playSystemKeyClickSound();

      // 取消之前的复杂计算定时器
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
        this.inputBuffer.timer = null
      }

      const focusIndex = this.custominputFocusIndex
      const fieldMap = ['', 'quantity', 'referenceAmount', 'allweight', 'carweight']
      const field = fieldMap[focusIndex]
      if (!field) return

      // 从数据模型读取当前值（保持与 :value 绑定一致）
      let currentValue = String(this.editingCard[field] || '0')

      // 快速验证：小数点重复检查
      if (val === '.' && currentValue.includes('.')) {
        return
      }

      // 快速验证：0开头不能输入运算符
      if ((val === '+' || val === '-') && currentValue === '0') {
        return
      }

      // 优化初始值处理
      let txt = currentValue === '0' && val !== '.' ? '' : currentValue

      // 运算符处理：仅在必要时计算表达式
      const isOperator = val === '+' || val === '-'
      if (isOperator && txt) {
        const numValue = parseFloat(txt)
        txt = isNaN(numValue) ? 0 : numValue
      }

      // 计算新值
      const newValue = String(txt) + val

      // ===【关键】立即更新数据模型，触发 Vue 响应式更新===
      this.editingCard[field] = newValue

      // allweightSrt 特殊处理（散装模式下）
      if (focusIndex === 3) {
        const allweightSrt = this.editingCard.allweightSrt || '0'
        this.editingCard.allweightSrt = allweightSrt.toString() === '0' ? val : allweightSrt + val
      }

      // 【优化】只延迟复杂计算，显示更新已经完成
      if (focusIndex === 1 && this.fixedTareWeight.action === true) {
        this.inputBuffer.timer = setTimeout(() => {
          const currentQuantity = parseFloat(newValue) || 0
          let calculatedCarWeight = 0

          // 皮重处理
          if (this.editingCard.fixedTare) {
            calculatedCarWeight = this.editingCard.fixedTare * currentQuantity
          }

          // 押筐数量处理
          if (this.editingCard.extralModel) {
            this.editingCard.extralModel.quantity = newValue
            if (this.editingCard.extralModel.weight) {
              calculatedCarWeight += currentQuantity * parseFloat(this.editingCard.extralModel.weight)
            }
          }

          // 统一设置 carweight（会触发响应式更新）
          this.editingCard.carweight = calculatedCarWeight

          // 固定重量处理
          if (this.editingCard.initWeight) {
            this.editingCard.allweight = currentQuantity * parseFloat(this.editingCard.initWeight)
          }
        }, 50) // 50ms 后执行复杂计算
      }
    },
    inputFinsh1() {
      this.playSystemKeyClickSound()

      // 清理待处理的定时器
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
        this.inputBuffer.timer = null
      }

      // 安全计算表达式，替换 eval()
      const safeEval = expr => {
        try {
          return new Function('return ' + expr)()
        } catch (e) {
          return parseFloat(expr) || 0
        }
      }

      // 批量计算表达式并更新（数据已经在输入时同步了）
      Object.assign(this.editingCard, {
        quantity: safeEval(this.editingCard.quantity),
        referenceAmount: safeEval(this.editingCard.referenceAmount),
        allweight: safeEval(this.editingCard.allweight),
        carweight: safeEval(this.editingCard.carweight),
      })

      // 确保更新到数组和缓存
      this.goodSelect[this.editingIndex] = this.editingCard
      this.saveGoodSelectToCache()
    },
    Tuige1() {
      this.playSystemKeyClickSound()

      // 取消复杂计算定时器
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
      }

      const focusIndex = this.custominputFocusIndex
      const fieldMap = ['', 'quantity', 'referenceAmount', 'allweight', 'carweight']
      const field = fieldMap[focusIndex]
      if (!field) return

      // 从数据模型读取当前值
      let currentValue = String(this.editingCard[field] || '0')

      // 如果当前值为空或为零，直接返回
      if (currentValue === '' || currentValue === '0') {
        return
      }

      // 回退一个字符
      let newValue = currentValue.slice(0, -1)
      newValue = newValue === '' ? '0' : newValue

      // ===【关键】立即更新数据模型，触发 Vue 响应式更新===
      this.editingCard[field] = newValue

      // 散装模式总重特殊处理
      if (focusIndex === 3) {
        let srt = this.editingCard.allweightSrt
        if (srt != null && srt !== '') {
          srt = srt.toString().slice(0, -1)
          this.editingCard.allweightSrt = srt === '' ? '0' : srt
        }
      }

      // 【优化】只延迟复杂计算，显示更新已经完成
      if (focusIndex === 1 && this.fixedTareWeight.action === true) {
        this.inputBuffer.timer = setTimeout(() => {
          const currentQuantity = parseFloat(newValue) || 0
          let calculatedCarWeight = 0

          // 皮重处理
          if (this.editingCard.fixedTare) {
            calculatedCarWeight = this.editingCard.fixedTare * currentQuantity
          }

          // 押筐数量处理
          if (this.editingCard.extralModel) {
            this.editingCard.extralModel.quantity = newValue
            if (this.editingCard.extralModel.weight) {
              calculatedCarWeight += currentQuantity * parseFloat(this.editingCard.extralModel.weight)
            }
          }

          // 统一设置 carweight
          this.editingCard.carweight = calculatedCarWeight

          this.goodSelect[this.editingIndex] = this.editingCard
          this.saveGoodSelectToCache()
        }, 50)
      }
    },
    Tuige2() {
      this.playSystemKeyClickSound()
      let myvalue = ''
      switch (this.editingPaymentIndex) {
        case 1:
          myvalue = this.payAmount.total
          break
        case 2:
          myvalue = this.payAmount.actual
          break
        case 3:
          myvalue = this.payAmount.debt
          break
        case 5:
          myvalue = this.AccountExpense.wxpayAmount
          break
        case 6:
          myvalue = this.AccountExpense.alipayAmount
          break
        case 7:
          myvalue = this.AccountExpense.cashAmount
          break
        case 8:
          myvalue = this.AccountExpense.otherAmount
          break
        case 9:
          myvalue = this.discountAmount
          break
      }

      // 如果当前值为空或为零，直接返回
      if (myvalue == null || myvalue === '' || myvalue === '0') {
        return
      }
      myvalue = myvalue ? myvalue.toString() : ''
      // 回退一个字符
      myvalue = myvalue.slice(0, -1) // 去掉最后一个字符
      myvalue = myvalue === '' ? '0' : myvalue // 如果为空，设置为0

      // 直接更新，移除 $nextTick 以提高响应速度
      switch (this.editingPaymentIndex) {
        case 1:
          this.payAmount.total = myvalue
          break
        case 2:
          this.payAmount.actual = myvalue
          // 实付金额改变时，重置支付方式并默认分配到微信支付
          this.setAccountExpense(parseFloat(myvalue) || 0)
          break
        case 3:
          this.payAmount.debt = myvalue
          // 计算实付金额：应付金额 +/- 优惠多收 - 收筐抵扣 - 下欠金额
          const totalAmountDebt = parseFloat(this.payAmount.total) || 0
          const basketOffsetAmountDebt = parseFloat(this.payAmount.BasketOffsetAmount) || 0
          const debtAmountDebt = parseFloat(this.payAmount.debt) || 0
          const discountAmtDebt = parseFloat(this.discountAmount) || 0
          if (this.accountDiscount) {
            // 优惠模式：应付 - 优惠 - 收筐 - 下欠
            this.payAmount.actual = totalAmountDebt - discountAmtDebt - basketOffsetAmountDebt - debtAmountDebt
          } else {
            // 多收模式：应付 + 多收 - 收筐 - 下欠
            this.payAmount.actual = totalAmountDebt + discountAmtDebt - basketOffsetAmountDebt - debtAmountDebt
          }
          // 实付金额改变时，重置支付方式并默认分配到微信支付
          this.setAccountExpense(this.payAmount.actual)
          break
        case 5:
          this.AccountExpense.wxpayAmount = myvalue
          break
        case 6:
          this.AccountExpense.alipayAmount = myvalue
          break
        case 7:
          this.AccountExpense.cashAmount = myvalue
          break
        case 8:
          this.AccountExpense.otherAmount = myvalue
          break
        case 9:
          this.discountAmount = myvalue
          // 安全的数字转换
          const total = parseFloat(this.payAmount.total) || 0
          const discount = parseFloat(this.discountAmount) || 0
          const debt = parseFloat(this.payAmount.debt) || 0
          const basketOffset = parseFloat(this.payAmount.BasketOffsetAmount) || 0

          if (this.accountDiscount) {
            this.payAmount.actual = Math.floor(total - discount - basketOffset - debt)
            this.setAccountExpense(this.payAmount.actual)
          } else {
            this.payAmount.actual = Math.floor(total + discount - basketOffset - debt)
            this.setAccountExpense(this.payAmount.actual)
          }
          break
      }
    },
    Tuige3() {
      this.playSystemKeyClickSound()
      if (this.repayBasketList.length === 0) return
      let myvalue = ''
      myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity

      // 如果当前值为空或为零，直接返回
      if (myvalue == null || myvalue === '' || myvalue === '0') {
        return
      }
      myvalue = myvalue ? myvalue.toString() : ''
      // 回退一个字符
      myvalue = myvalue.slice(0, -1) // 去掉最后一个字符
      // 更新数据模型
      this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue === '' ? '0' : myvalue
    },
    editingPaymentClick(index) {
      // 应付金额不允许输入
      if (index === 1) {
        return
      }
      this.editingPaymentIndex = index
      this.selectInput_pay = index
      this.payAmount.total = eval(this.payAmount.total)
      this.payAmount.actual = eval(this.payAmount.actual)
      this.payAmount.debt = eval(this.payAmount.debt)
    },
    Clear1() {
      // 取消定时器
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
      }

      const focusIndex = this.custominputFocusIndex
      const fieldMap = ['', 'quantity', 'referenceAmount', 'allweight', 'carweight']
      const field = fieldMap[focusIndex]
      if (!field) return

      // ===【关键】立即更新数据模型，触发 Vue 响应式更新===
      this.editingCard[field] = '0'

      // 散装模式特殊处理
      if (focusIndex === 3) {
        this.editingCard.allweightSrt = '0'
      }

      // 更新 goodSelect 数组
      this.goodSelect[this.editingIndex] = this.editingCard
      // 保存到缓存
      this.saveGoodSelectToCache()
      this.reCountGoodSelect()
    },
    Clear2() {
      this.playSystemKeyClickSound()
      // 根据 custominputFocusIndex 清空对应的值
      switch (this.editingPaymentIndex) {
        case 1:
          this.payAmount.total = '0' // 清空为 0
          break
        case 2:
          this.payAmount.actual = '0' // 清空为 0
          break
        case 3:
          this.payAmount.debt = '0' // 清空为 0
          break
      }

      // 更新 goodSelect 数组
      this.goodSelect[this.editingIndex] = this.editingCard
      // 保存到缓存
      this.saveGoodSelectToCache()
    },
    Clear3() {
      // 根据 custominputFocusIndex 清空对应的值
      this.memberEventInfo.collectBasketNum = '0'
    },
    NumberCk2(val) {
      this.playSystemKeyClickSound()
      // 应付金额不允许输入
      if (this.editingPaymentIndex === 1) {
        return
      }
      let myvalue = ''
      switch (this.editingPaymentIndex) {
        case 1:
          myvalue = this.payAmount.total
          break
        case 2:
          myvalue = this.payAmount.actual
          break
        case 3:
          myvalue = this.payAmount.debt
          break
        case 5:
          myvalue = this.AccountExpense.wxpayAmount
          break
        case 6:
          myvalue = this.AccountExpense.alipayAmount
          break
        case 7:
          myvalue = this.AccountExpense.cashAmount
          break
        case 8:
          myvalue = this.AccountExpense.otherAmount
          break
        case 9:
          myvalue = this.discountAmount
          break
      }
      if (val == '.') {
        // 对于优惠多收金额(case 9)，不允许输入小数点
        if (this.editingPaymentIndex === 9) {
          return
        }
        if (myvalue.toString().indexOf('.') >= 0) {
          return
        }
      }
      var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue
      myvalue = txt + val.toString()
      // 直接更新，移除 $nextTick 以提高响应速度
      switch (this.editingPaymentIndex) {
        case 1:
          this.payAmount.total = myvalue
          break
        case 2:
          this.payAmount.actual = myvalue
          // 实付金额改变时，重置支付方式并默认分配到微信支付
          this.setAccountExpense(parseFloat(myvalue) || 0)
          break
        case 3:
          this.payAmount.debt = myvalue
          // 计算实付金额：应付金额 +/- 优惠多收 - 收筐抵扣 - 下欠金额
          const totalAmount = parseFloat(this.payAmount.total) || 0
          const basketOffsetAmount = parseFloat(this.payAmount.BasketOffsetAmount) || 0
          const debtAmount = parseFloat(this.payAmount.debt) || 0
          const discountAmt = parseFloat(this.discountAmount) || 0
          if (this.accountDiscount) {
            // 优惠模式：应付 - 优惠 - 收筐 - 下欠
            this.payAmount.actual = totalAmount - discountAmt - basketOffsetAmount - debtAmount
          } else {
            // 多收模式：应付 + 多收 - 收筐 - 下欠
            this.payAmount.actual = totalAmount + discountAmt - basketOffsetAmount - debtAmount
          }
          // 实付金额改变时，重置支付方式并默认分配到微信支付
          this.setAccountExpense(this.payAmount.actual)
          break
        case 5:
          this.AccountExpense.wxpayAmount = myvalue
          break
        case 6:
          this.AccountExpense.alipayAmount = myvalue
          break
        case 7:
          this.AccountExpense.cashAmount = myvalue
          break
        case 8:
          this.AccountExpense.otherAmount = myvalue
          break
        case 9:
          this.discountAmount = myvalue
          // 安全的数字转换
          const total = parseFloat(this.payAmount.total) || 0
          const discount = parseFloat(this.discountAmount) || 0
          const debt = parseFloat(this.payAmount.debt) || 0
          const basketOffsetAmt2 = parseFloat(this.payAmount.BasketOffsetAmount) || 0
          if (this.accountDiscount) {
            this.payAmount.actual = Math.floor(total - discount - basketOffsetAmt2 - debt)
            this.setAccountExpense(this.payAmount.actual)
          } else {
            this.payAmount.actual = Math.floor(total + discount - basketOffsetAmt2 - debt)
            this.setAccountExpense(this.payAmount.actual)
          }
          break
      }
    },
    NumberCk3(val) {
      this.playSystemKeyClickSound()
      if (this.repayBasketList.length === 0) return
      let myvalue = ''
      myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity
      if (val == '.') {
        if (myvalue.toString().indexOf('.') >= 0) {
          return
        }
      }
      var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue
      myvalue = txt + val.toString()
      this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue
    },
    custominputFocusedMethod(index) {
      // 清理之前输入框的待处理更新
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
        this.inputBuffer.timer = null
      }

      this.inputFinsh1()
      this.custominputFocused = false
      this.custominputFocused2 = false
      this.custominputFocused3 = false
      this.custominputFocused4 = false
      switch (index) {
        case 1:
          this.custominputFocused = true
          break
        case 2:
          this.custominputFocused2 = true
          break
        case 3:
          this.custominputFocused3 = true
          break
        case 4:
          this.custominputFocused4 = true
          break
      }
      this.custominputFocusIndex = index
    },
    showStep2(e, index) {
      //进入输入编辑的物品，输入完返回对应的添加物品
      this.editingCard = e
      if (this.editingCard.extralModel) {
        this.editingCard.extralModel.quantity = this.editingCard.quantity
        if (this.editingCard.extralModel.weight) {
          this.editingCard.carweight = this.editingCard.extralModel.quantity * this.editingCard.extralModel.weight
        }
      } else {
        this.editingCard.extralModel = {
          name: '空',
          amount: 0,
          id: '',
          quantity: 0,
          money: 0,
        }
      }
      this.editingIndex = index
      this.step1 = false
      if (this.editingCard.saleWay === 1 || this.editingCard.saleWay === 4) {
        this.custominputFocusedMethod(3)
      } else {
        this.custominputFocusedMethod(1)
      }
    },
    // 处理 OrderGoodsPanel 组件的商品点击事件
    handleItemClick({ item, index }) {
      this.showStep2(item, index)
    },
    showStep1() {
      this.inputFinsh1()
      this.reCountGoodSelect()
      this.step1 = true
      this.custominputFocused = false
      this.custominputFocused2 = false
      this.custominputFocused3 = false
      this.custominputFocused4 = false
    },

    // GoodEditKeyboard 组件确认事件处理
    handleGoodEditConfirm(updatedCard) {
      // 更新编辑中的商品数据
      this.editingCard = updatedCard
      this.goodSelect[this.editingIndex] = updatedCard

      // 保存到缓存并重新计算
      this.saveGoodSelectToCache()
      this.reCountGoodSelect()

      // 返回商品列表
      this.step1 = true
      this.custominputFocused = false
      this.custominputFocused2 = false
      this.custominputFocused3 = false
      this.custominputFocused4 = false
      this.showAllweightStr = false
    },

    // GoodEditKeyboard 组件押筐选择事件处理
    handleExtraModelSelect(extralModel) {
      // 更新 editingCard 的押筐模型
      this.editingCard.extralModel = extralModel
      console.log('this.editingCard', this.editingCard)

      // 同步到 goodSelect 数组
      this.goodSelect[this.editingIndex] = this.editingCard
      this.saveGoodSelectToCache()
    },

    windowResizeCallback(res) {
      const width = res.size.windowWidth
      this.initCol(width)
    },
    initSystem() {
      const window = uni.getWindowInfo()
      const width = window.windowWidth
      // this.initCol(width)
    },
    initCol(width) {
      this.modalWidth = global.getModalWidth()
      if (width <= 800) {
        this.spuCol = 2
        this.skuCol = 1
        this.memberCol = 1
      } else if (width <= 1000) {
        this.spuCol = 2
        this.skuCol = 1
        this.memberCol = 2
      } else if (width <= 1300) {
        this.spuCol = 3
        this.skuCol = 2
        this.memberCol = 3
      } else if (width <= 1600) {
        this.spuCol = 4
        this.skuCol = 3
        this.memberCol = 4
      } else {
        this.spuCol = 5
        this.skuCol = 4
        this.memberCol = 5
      }
    },

    // 处理标签切换事件（从 CashierGoodsPanel 组件触发）
    handleTabChanged(data) {
      // 组件内部已经处理了商品加载逻辑
      // 这里只需要处理父组件需要知道的状态变化
      console.log('标签已切换:', data)
    },

    // 处理分类列表更新事件（从 CashierGoodsPanel 组件触发）
    handleCategoryUpdated(categoryList) {
      // 更新父组件的 categoryList（用于其他功能）
      this.categoryList = categoryList
      console.log('分类列表已更新:', categoryList)
    },

    /**
     * 获取分类列表（统一入口）
     * 现在直接调用 CashierGoodsPanel 组件的方法
     */
    getCategoryList() {
      if (this.$refs.goodsPanel) {
        this.$refs.goodsPanel.getCategoryList()
      }
    },
    deleteItem(e) {
      this.playSystemKeyClickSound()
      const indexToDelete = this.goodSelect.findIndex(item => item.index === e.index)

      // 如果找到了对应的索引，则弹出确认框
      if (indexToDelete !== -1) {
        uni.showModal({
          title: '确认删除',
          content: '您确定要删除该项吗？',
          success: res => {
            if (res.confirm) {
              // 用户点击了确认
              this.goodSelect.splice(indexToDelete, 1)
              // 保存到缓存
              this.saveGoodSelectToCache()
              this.reCountGoodSelect() // 更新选择的商品
            } else if (res.cancel) {
              // 用户点击了取消
            }
          },
        })
      }
    },
    async orderCreate() {
      this.playSystemKeyClickSound()
      this.payTypeDialogVisible = true
      this.payAmount.actual = eval(this.payAmount.total)
      this.AccountExpense = {
        alipayAmount: 0,
        wxpayAmount: JSON.parse(JSON.stringify(this.payAmount.actual)),
        cashAmount: 0,
        otherAmount: 0,
      }
      this.discountAmount = 0
      this.payAmount.BasketOffsetAmount = 0
      this.memberEventInfo = {
        member: null,
        collectBasketNum: 0,
      }
      // console.log("buleTeethInfo", buleTeethInfo)
      // console.log("this.cashier",this.cashier)
      // cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
      // 	this.orderId = res.data
      // 	this.payTypeDialogVisible = true
      // 	this.getPayResult()
      // })
      //重置收银还筐物体
      this.resetPayBasket()
    },
    resetPayBasket() {
      this.repayBasketList = []
      this.repayBasketActiveIndex = 0
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
      getApp().senBleLabel(order)
    },
    printerGDModel(order) {
      getApp().senBleLabel_GD(order)
    },
    tempSpuClose() {
      this.tempSpu = {}
      this.tempSpuDialogVisible = false
    },
    tempSpuSubmit() {
      this.$refs.tempSpuForm
        .validate()
        .then(valid => {
          this.tempAddCard(this.tempSpu)
          this.tempSpuClose()
        })
        .catch(error => {
          console.log(error)
        })
    },
    tempAddCard(item) {
      const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
      if (index >= 0) {
        this.cashier.cards[index].quantity += 1
      } else {
        const card = {
          key: new Date().getTime().toString(),
          skuId: item.skuId,
          skuName: item.skuName,
          quantity: item.quantity,
          adjustAmount: item.adjustAmount,
          payableAmount: item.payableAmount,
          skuNo: item.skuNo,
        }
        this.cashier.cards.push(card)
      }
      // this.cashierAmount()
    },
    closeKeyBoard() {
      // 清理所有待处理的更新
      if (this.inputBuffer.timer) {
        clearTimeout(this.inputBuffer.timer)
        this.inputBuffer.timer = null
      }
      this.showKeyBord = false
    },

    //商品金额计算方法
    reCountGoodSelect() {
      this.payAmount.total = 0
      this.goodSelect.forEach(x => {
        if (x.saleWay === 1 || x.saleWay === 4) {
          x.money = Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x.referenceAmount))
        } else if (x.saleWay === 2 || x.saleWay === 3) {
          x.money = Math.round(parseFloat(x.quantity) * parseFloat(x.referenceAmount))
        }
        this.payAmount.total += parseFloat(x.money) //货品金额
        x.extralModelMoney = 0 //初始化押筐金额
        if (x.extralModel && x.extralModel.id != '') {
          x.extralModelMoney += parseFloat(x.extralModel.quantity) * parseFloat(x.extralModel.amount)
          this.payAmount.total += x.extralModelMoney
        }
        x.money2 = parseFloat(x.money) + parseFloat(x.extralModelMoney)
      })
      // 添加运费到总金额
      this.payAmount.total += parseFloat(this.cashier.shippingFee || 0)
      // 确保total是数值类型，保持响应性
      this.payAmount.total = parseFloat(parseFloat(this.payAmount.total).toFixed(0))
      // 保存到缓存
      this.saveGoodSelectToCache()
    },
    //计算方法2---改变箩筐值计算
    reCountGoodSelect2() {
      this.payAmount.total = 0
      if (this.extraModel.length > 0) {
        this.extraModel[0].money = 0
      }
      this.goodSelect.forEach(x => {
        x.money =
          Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x.referenceAmount) * 10) / 10
        this.payAmount.total += x.money
        x.money2 = parseFloat(x.money)
      })

      if (this.extraModel.length > 0) {
        this.extraModel[0].money += parseFloat(this.extraModel[0].quantity) * parseFloat(this.extraModel[0].amount)
      }
      if (this.extraModel.length > 0) {
        this.payAmount.total += this.extraModel[0].money
        this.payAmount.ExtraMoney += this.extraModel[0].money
        x.money2 += this.extraModel[0].money
      }
      // 确保total是数值类型，保持响应性
      this.payAmount.total = parseFloat(this.payAmount.total)
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
          skuNo: item.skuNo,
        }
        this.cashier.cards.push(card)
      }
      // this.cashierAmount()
    },
    clearCard() {
      this.cashier = {
        type: 0,
        discount: 10,
        discountAmount: 0, // 打折

        ignoreAmount: 0, // 抹零
        preferentialAmount: 0, // 优惠金额
        collectAmount: 0, // 优惠后金额
        adjustAmount: 0, // 调整金额
        payableAmount: 0, // 应收
        remark: '',
        memberId: '',
        member: {},
        cards: [],
        source: config.platformCode,
      }
      this.payTypeDialogVisible = false
      this.payResult = {}
      this.payAmount = 0
    },
    tabActive(e) {
      const foundItem = this.goodSelect.find(item => item.id === e.id)
      if (foundItem) {
        return true
      } else {
        return false
      }
    },
    // 使用 DIV 替代原生 View 的规格选择弹窗
    createNativeView(left, top, commodity, specList) {
      if (!specList || specList.length < 1) return

      this.specPopup = {
        visible: true,
        left,
        top,
        commodity,
        specList,
      }
    },
    // 关闭规格弹窗
    closeSpecPopup() {
      this.specPopup.visible = false
      // 延迟清空数据，等动画完成
      setTimeout(() => {
        this.specPopup = {
          visible: false,
          left: 0,
          top: 0,
          commodity: null,
          specList: [],
        }
      }, 300)
    },
    // 点击规格项
    handleSpecClick(spec) {
      this.commodityClickSaleWay3(this.specPopup.commodity, spec)
      this.closeSpecPopup()
    },
    // 创建分级商品弹窗
    createMultiLevelView(left, top, parentCommodity, childrenList) {
      if (!childrenList || childrenList.length < 1) return

      this.multiLevelPopup = {
        visible: true,
        left,
        top,
        parentCommodity,
        childrenList,
      }
    },
    // 关闭分级商品弹窗
    closeMultiLevelPopup() {
      this.multiLevelPopup.visible = false
      // 延迟清空数据，等动画完成
      setTimeout(() => {
        this.multiLevelPopup = {
          visible: false,
          left: 0,
          top: 0,
          parentCommodity: null,
          childrenList: [],
        }
      }, 300)
    },
    // 点击分级商品项
    handleMultiLevelClick(childCommodity) {
      // 处理分级商品的点击逻辑，类似普通商品
      this.closeMultiLevelPopup()
      // 调用 handleClick 处理选中的子商品
      this.handleClick(childCommodity, childCommodity.id)
    },
    handleClick(e, id) {
      //如果在step2状态下点击新货品，先移除未确定的货品
      if (!this.step1 && this.editingIndex === this.goodSelect.length - 1) {
        // 移除最后一个未确定的货品
        this.goodSelect.splice(this.editingIndex, 1)
      }

      // 检查是否为分级商品
      if (e.isMultiLevel === 1) {
        uni
          .createSelectorQuery()
          .selectAll(`#grid-item-${id}`)
          .boundingClientRect(data => {
            console.log('分级商品弹窗位置:', data)
            this.createMultiLevelView(data[0].left + data[0].width / 2, data[0].top, e, e.childrenList)
          })
          .exec()
        return // 显示分级商品弹窗后直接返回
      }

      console.log('e', e)

      //1-非定装 2-定装 4-散装
      if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
        this.goodSelect.push({
          key: this.goodSelectKeyCounter++,
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
          initWeight: e.initWeight,
          carweight: 0,
          money: 0, //物品金额（不含押筐）
          money2: 0, //包含押筐金额
          index: this.goodSelect.length + 1,
        })
        // 保存到缓存
        this.saveGoodSelectToCache()
        this.showAllweightStr = false
        //显示输入价格界面
        this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1)
      } else if (e.saleWay === 3) {
        uni
          .createSelectorQuery()
          .selectAll(`#grid-item-${id}`)
          .boundingClientRect(data => {
            // const { left, top, width, height } = data;
            console.log('data', data)
            this.createNativeView(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
          })
          .exec()
      }
    },

    commodityClickSaleWay3(e, spec) {
      //如果在step2状态下点击新货品，先移除未确定的货品
      if (!this.step1 && this.editingIndex === this.goodSelect.length - 1) {
        // 移除最后一个未确定的货品
        this.goodSelect.splice(this.editingIndex, 1)
      }

      this.goodSelect.push({
        key: this.goodSelectKeyCounter++,
        skuName: e.name,
        referenceAmount: e.price,
        stockType: e.stockType,
        quantity: 0,
        id: e.id,
        commodityId: e.commodityId,
        saleWay: e.saleWay,
        allweight: 0,
        allweightSrt: 0,
        commoditySpec: spec,
        carweight: 0,
        money: 0,
        index: this.goodSelect.length + 1,
      })
      // 保存到缓存
      this.saveGoodSelectToCache()
      this.showAllweightStr = false
      this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1)
    },

    addTemplateGood() {
      //如果在step2状态下点击新货品，先移除未确定的货品
      if (!this.step1 && this.editingIndex === this.goodSelect.length - 1) {
        // 移除最后一个未确定的货品
        this.goodSelect.splice(this.editingIndex, 1)
      }

      this.goodSelect.push({
        key: this.goodSelectKeyCounter++,
        skuName: '临时物品',
        referenceAmount: 0,
        quantity: 1,
        id: this.generateGUID,
        allweight: 0,
        allweightSrt: 0,
        carweight: 0,
        money: 0,
        index: this.goodSelect.length + 1,
      })
      // 保存到缓存
      this.saveGoodSelectToCache()
      this.showAllweightStr = false
      this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1)
      this.reCountGoodSelect()
    },
    cashierAmount() {
      cashierOrder.cashierOrderCompute(this.cashier).then(res => {
        const data = res.data
        const cards = []
        data.skus.forEach(item => {
          cards.push({
            key: item.key,
            skuId: item.skuId,
            skuName: item.skuName,
            quantity: item.quantity,
            referenceAmount: item.referenceAmount,
            adjustAmount: item.adjustAmount,
            payableAmount: item.payableAmount,
            skuNo: item.skuNo,
          })
        })
        this.cashier.discountAmount = data.discountAmount
        this.cashier.ignoreAmount = data.ignoreAmount
        this.cashier.preferentialAmount = data.preferentialAmount
        this.cashier.adjustAmount = data.adjustAmount
        this.cashier.payableAmount = data.payableAmount
        this.cashier.cards = cards
      })
    },
    skuClick(item) {
      this.skuDialogVisible = false
      this.addCard(item)
    },
    saleHang() {
      this.hangBtnLoading = true
      this.hangDialogVisible = true
    },
    deleteGDorder(item) {
      console.log('item', item)
      // 先关闭挂单中心弹窗，确保删除提示显示在最前面
      this.hangListVisible = false
      // 使用 $nextTick 确保弹窗关闭后再显示删除确认提示
      this.$nextTick(() => {
        uni.showModal({
          title: '删除挂单',
          content: `您确定要删除挂单吗？`,
          success: res => {
            if (res.confirm) {
              // 调用删除挂单API
              this.performDeleteGDorder(item)
            } else {
              // 如果用户取消删除，重新打开挂单中心
              this.saleHangList()
            }
          },
        })
      })
    },
    async performDeleteGDorder(item) {
      try {
        uni.showLoading({
          title: '删除中...',
        })

        // 调用destoryOrder API删除挂单
        const response = await cashierOrder.destoryOrder(item)

        uni.hideLoading()

        if (response.code == 200) {
          uni.showToast({
            title: '删除成功',
            icon: 'success',
          })

          // 刷新挂单列表
          this.saleHangList()
        } else {
          uni.showToast({
            title: response.data?.message || '删除失败',
            icon: 'error',
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('删除挂单失败:', error)
        uni.showToast({
          title: '删除失败，请重试',
          icon: 'error',
        })
      }
    },
    submitAddCustomer() {
      if (this.AddedCustomerFormData.name == undefined || this.AddedCustomerFormData.name == '') {
        uni.showToast({
          title: '请填写客户名称',
          icon: 'none',
        })
        return
      }

      const exists = this.memberOptions.some(item => item.customName === this.AddedCustomerFormData.name)

      if (exists) {
        uni.showToast({
          title: '客户名称已存在',
          icon: 'none',
        })
        return
      }
      this.AddedCustomerFormData.phone =
        this.AddedCustomerFormData.phone == undefined ? '' : this.AddedCustomerFormData.phone
      this.AddedCustomerFormData.address =
        this.AddedCustomerFormData.address == undefined ? '' : this.AddedCustomerFormData.address
      this.AddedCustomerFormData.carNum =
        this.AddedCustomerFormData.carNum == undefined ? '' : this.AddedCustomerFormData.carNum
      let currentCompanyId = uni.getStorageSync('companyId')
      var param = {
        id: '',
        CustomName: this.AddedCustomerFormData.name,
        CustomPhone: this.AddedCustomerFormData.phone,
        Address: this.AddedCustomerFormData.address,
        CarNum: this.AddedCustomerFormData.carNum,
        CompanyId: currentCompanyId,
        Debts: 0,
        OrderNum: 0,
        Owebasket: 0,
      }
      member
        .memberCreate(param)
        .then(res => {
          uni.showToast({
            title: '添加成功',
            icon: 'none',
          })
          this.AddedCustomerFormData = {
            phone: null,
            address: null,
            carNum: null,
            name: null,
          }
          this.customerDialogVisibleAdd = false
          this.memberChange('XiaDan')
        })
        .finally(() => {})
    },
    saleHangList() {
      let that = this
      cashierOrder.GetAllGDorder(this.currentCompanyId).then(res => {
        that.hangListVisible = true
        var hangleList = res.data
        console.log('hangleList', hangleList)
        hangleList.forEach((item, index) => {
          console.log('item.module', item.module)
          // 为每个挂单项添加唯一的 uniqueKey
          item.uniqueKey = item.id || `hang_${Date.now()}_${index}`
          if (item.module) {
            let modelList = JSON.parse(item.module)
            item.modelInfo = ''
            modelList.forEach((item2, index2) => {
              item.modelInfo += item2.name + 'x' + item2.mount + '|'
            })
            console.log('item', item)
          }
        })

        const grouped = hangleList.reduce((acc, item) => {
          // 方法 1：直接截取 yyyy-mm-dd（推荐，性能最好）
          const dateKey = item.createTime.slice(0, 10)
          if (!acc[dateKey]) {
            acc[dateKey] = []
          }
          acc[dateKey].push(item)
          return acc
        }, {})

        // 转换为数组并按日期降序排序
        const groupedArray = Object.keys(grouped).map(date => ({
          date,
          items: grouped[date],
        }))

        groupedArray.sort((a, b) => new Date(b.date) - new Date(a.date))

        this.hangList = groupedArray
        if (groupedArray.length > 0) {
          this.selectGDorder(groupedArray[0].items[0])
        }
      })
    },
    memberSearch(query) {
      this.memberSearchOptions = []
      if (query !== '') {
        this.memberSearchOptions = this.memberOptions.filter(item =>
          item.customName.toLowerCase().includes(query.toLowerCase())
        )
      } else {
        this.memberSearchOptions = this.memberOptions
      }
    },
    memberSearchClear() {
      this.memberSearchKeyword = ''
      this.memberSearchOptions = this.memberOptions
    },
    // 商品搜索相关方法
    searchGoods() {
      this.filterGoods()
    },
    filterGoods() {
      this.rows = []
      let filteredList = []

      // 清除词云选中状态
      if (this.goodsSearchKeyword.trim() !== '') {
        this.currentKeyWord = ''
      }

      if (this.goodsSearchKeyword.trim() === '') {
        // 如果搜索关键词为空，显示所有商品
        filteredList = [...this.commidityList]
      } else {
        // 根据关键词筛选商品
        filteredList = this.commidityList.filter(item =>
          item.name.toLowerCase().includes(this.goodsSearchKeyword.toLowerCase())
        )
      }

      // 按库存排序
      filteredList.sort((a, b) => b.inventory - a.inventory)

      // 重新组织成rows格式（每行3个商品）
      for (let i = 0; i < filteredList.length; i += 3) {
        this.rows.push(filteredList.slice(i, i + 3))
      }
    },
    clearSearch() {
      this.goodsSearchKeyword = ''
      this.filterGoods()
    },
    // 商品搜索相关方法
    onGoodsSearch() {
      this.filterGoods()
    },
    onGoodsSearchConfirm() {
      this.filterGoods()
    },
    clearGoodsSearch() {
      this.goodsSearchKeyword = ''
      this.filterGoods()
    },
    onSearchFocus() {
      // 搜索框获得焦点时的处理
    },
    onSearchBlur() {
      // 搜索框失去焦点时的处理
    },
    memberChange(status) {
      this.playSystemKeyClickSound()
      this.currentSelctCustomerType = 1
      this.memberStyle = status
      this.memberOptions = []
      this.memberSearchOptions = []
      this.memberSearchKeyword = ''
      member
        .GetmemberListByCompanyIdPage({ Id: this.currentCompanyId, pageSize: 1000, currentPage: 1 })
        .then(res => {
          this.memberOptions.push({
            customName: '散客',
            id: '',
          })
          this.memberSearchOptions.push({
            customName: '散客',
            id: '',
          })
          // 适配分页结果格式
          const memberList = res.data.Data || res.data.data || []
          this.memberOptions.push(...memberList)
          this.memberSearchOptions.push(...memberList)
          this.memberDialogVisible = true
        })
        .finally(() => {})
    },
    orderMemberChange() {
      this.memberChange('MemberChange')
      this.LastOrderShow = false
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
          this.getlastOrder()
        }
      })
    },
    async payTypeDebt() {
      this.playSystemKeyClickSound()

      // 检查是否为散客
      if (!this.currentMember.id || this.currentMember.id === '' || this.currentMember.customName === '散客') {
        this.flashCustomerInfo()
        uni.showToast({
          title: '散客不可以整单下欠',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      this.payAmount.debt = eval(this.payAmount.total - this.payAmount.BasketOffsetAmount)
      this.payAmount.actual = 0
      this.currentPayWay = 0
      //支付方式详情归零
      this.AccountExpense = {
        alipayAmount: 0,
        wxpayAmount: 0,
        cashAmount: 0,
        otherAmount: 0,
      }

      await this.payTypeConfirm()
    },

    //订单发送
    orderSend() {
      let that = this
      var CompanyId = this.currentCompanyId
      var goodModelList = []
      var userInfo = uni.getStorageSync('userInfo')
      console.log('this.goodSelect', this.goodSelect)
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
          commodityId: this.goodSelect[i].commodityId,
          tareWeight: this.goodSelect[i].carweight,
          saleWay: this.goodSelect[i].saleWay,
          referenceAmount: this.goodSelect[i].referenceAmount,
          subtotal: this.goodSelect[i].money,
          type: 1,
        }
        //处理押筐物体(2.0押筐物体存放在extralModel,extralModel.id==""时候为空，不做处理)
        commodity.subModel = []
        if (that.goodSelect[i].extralModel) {
          if (that.goodSelect[i].extralModel && that.goodSelect[i].extralModel.id != '') {
            commodity.subModel.push({
              Id: '00000000-0000-0000-0000-000000000000',
              commodityId: that.goodSelect[i].extralModel.id,
              name: that.goodSelect[i].extralModel.name,
              mount: that.goodSelect[i].extralModel.quantity,
              referenceAmount: that.goodSelect[i].extralModel.amount,
              totalWeight: 0,
              stockType: 0,
              subtotal: 0,
              tareWeight: 0,
              commoditySpec: null,
              type: 2,
            })
          }
        }

        goodModelList.push(commodity)
      }
      //处理还筐物体
      for (var i = 0; i < this.repayBasketList.length; i++) {
        if (parseFloat(this.repayBasketList[i].quantity) > 0) {
          goodModelList.push({
            Id: '00000000-0000-0000-0000-000000000000',
            commodityId: this.repayBasketList[i].id,
            name: this.repayBasketList[i].name,
            mount: this.repayBasketList[i].quantity,
            totalWeight: 0,
            tareWeight: 0,
            referenceAmount: this.repayBasketList[i].amount,
            subtotal: parseFloat(this.repayBasketList[i].quantity) * parseFloat(this.repayBasketList[i].amount),
            type: 4,
          })
        }
      }

      //处理运费
      if (parseFloat(this.cashier.shippingFee) > 0) {
        goodModelList.push({
          Id: '00000000-0000-0000-0000-000000000000',
          commodityId: '00000000-0000-0000-0000-000000000000',
          name: '运费',
          mount: 1,
          totalWeight: 0,
          tareWeight: 0,
          referenceAmount: parseFloat(this.cashier.shippingFee),
          subtotal: parseFloat(this.cashier.shippingFee),
          type: 5,
        })
      }

      //请求主体
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
        BasketOffsetAmount: this.payAmount.BasketOffsetAmount ? Number(this.payAmount.BasketOffsetAmount) : 0,
      }
      //插入费用支付方式详情
      param.accountExpense = this.AccountExpense

      //处理优惠金额或多收金额
      if (this.accountDiscount) {
        param.discountAmount = this.discountAmount
        param.overchargeAmount = 0
      } else {
        param.discountAmount = 0
        param.overchargeAmount = this.discountAmount
      }
      //1.0用到的挂单转正式单（2.0弃用）
      if (this.currentOrderInfo != null && this.currentOrderInfo.Id) {
        param.Id = this.currentOrderInfo.Id
        param.accountCode = this.currentOrderInfo.accountCode
      }

      cashierOrder.CreateAccount(JSON.stringify(param)).then(res => {
        if (res.data != null && res.data != '' && res.data == 'success') {
          // 保存当前批次信息，用于刷新
          const currentTabId = that.$refs.goodsPanel?.currentTabId
          const currentCommodityType = that.$refs.goodsPanel?.commodityType

          //重置新建订单对象
          that.resetOrder()
          that.payTypeDialogVisible = false

          // 如果有动态客户列表，将第一个客户提升为主客户
          that.switchToNextCustomerAfterOrder()

          //获取最新的订单放在上面横幅栏
          that.getlastOrder_print().then(res2 => {
            if (that.fixedPayPrint) {
              that.printerModel(res2.data)
            }
            that.popup_paysuccess_show = true
          })

          // 清除当前批次的缓存，在 getCategoryList 完成后会自动重新加载
          if (that.$refs.goodsPanel && currentTabId && currentCommodityType) {
            that.$refs.goodsPanel.clearTabCache(currentTabId, currentCommodityType)
          }
        } else {
          uni.showToast({
            title: `创建失败:${res.data}`,
            duration: 2000,
          })
        }
      })
    },
    // 处理支付模态框确认事件
    handlePaymentConfirm(data) {
      // 更新数据
      this.payAmount = data.payAmount
      this.AccountExpense = data.accountExpense
      this.discountAmount = data.discountAmount
      this.accountDiscount = data.accountDiscount
      // 调用原来的确认方法
      this.payTypeConfirm()
    },
    async payTypeConfirm() {
      this.playSystemKeyClickSound()
      let that = this
      if (eval(this.payAmount.total) === 0) {
        uni.showToast({
          title: '订单金额必须大于0',
          icon: 'error',
          duration: 2000,
        })
        return
      }

      // 检查散客是否有下欠金额
      const debtAmt = parseFloat(this.payAmount.debt) || 0
      if (
        (!this.currentMember.id || this.currentMember.id === '' || this.currentMember.customName === '散客') &&
        debtAmt > 0
      ) {
        this.flashCustomerInfo()
        uni.showToast({
          title: '散客不可以有下欠金额',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      // 验证实付金额计算是否正确
      const totalAmount = parseFloat(this.payAmount.total) || 0
      const actualAmount = parseFloat(this.payAmount.actual) || 0
      const debtAmount = parseFloat(this.payAmount.debt) || 0
      const basketOffsetAmount = parseFloat(this.payAmount.BasketOffsetAmount) || 0
      const discountAmount = parseFloat(this.discountAmount) || 0

      let expectedActualAmount
      if (this.accountDiscount) {
        // 优惠模式：实付 = 应付 - 优惠 - 收筐抵扣 - 下欠
        expectedActualAmount = totalAmount - discountAmount - basketOffsetAmount - debtAmount
      } else {
        // 多收模式：实付 = 应付 + 多收 - 收筐抵扣 - 下欠
        expectedActualAmount = totalAmount + discountAmount - basketOffsetAmount - debtAmount
      }

      // 允许0.01的误差（避免浮点数精度问题）
      if (Math.abs(actualAmount - expectedActualAmount) > 0.01) {
        this.flashActualAmount() // 触发实付金额闪烁
        uni.showToast({
          title: `实付金额计算错误！应为${expectedActualAmount.toFixed(2)}元，当前为${actualAmount.toFixed(2)}元`,
          icon: 'error',
          duration: 3000,
        })
        return
      }

      // 检查实付金额与支付方式金额总和是否一致
      const wxpayAmount = parseFloat(this.AccountExpense.wxpayAmount) || 0
      const alipayAmount = parseFloat(this.AccountExpense.alipayAmount) || 0
      const cashAmount = parseFloat(this.AccountExpense.cashAmount) || 0
      const otherAmount = parseFloat(this.AccountExpense.otherAmount) || 0
      const totalPaymentAmount = wxpayAmount + alipayAmount + cashAmount + otherAmount

      // 允许0.01的误差（避免浮点数精度问题）
      if (Math.abs(actualAmount - totalPaymentAmount) > 0.01) {
        uni.showToast({
          title: `支付金额不一致！实付${actualAmount.toFixed(2)}元，支付方式总额${totalPaymentAmount.toFixed(2)}元`,
          icon: 'error',
          duration: 3000,
        })
        return
      }

      if (this.currentMember.id != null && this.currentMember.id != '' && this.memberEventInfo.collectBasketNum > 0) {
        await this.payBasket_beforePay()
      }
      //打开收银界面
      this.orderSend()
    },
    resetAction() {
      let that = this
      uni.showModal({
        title: '确认清空',
        content: '您确定要清空物品吗？',
        success: res => {
          if (res.confirm) {
            that.resetOrder()
          }
        },
      })
    },
    resetOrder() {
      let that = this
      that.payAmount = {
        total: 0,
        actual: 0,
        debt: 0,
        ExtraMoney: 0,
        BasketOffsetAmount: 0,
      }
      that.currentOrderInfo = {
        Id: '',
        accountCode: '',
      }
      // 清空当前客户的缓存（订单提交成功后）
      that.clearGoodSelectCache()
      that.goodSelect = []
      // 重置客户信息为散客
      that.currentMember = {
        customName: '散客',
        id: '',
      }
      // 重置运费
      that.cashier.shippingFee = 0
      that.getlastOrder()
      that.getCategoryList()
      that.extraModel.forEach(x => {
        x.quantity = 0
        x.money = 0
      })
      that.memberEventInfo = {
        member: null,
        collectBasketNum: 0,
      }
    },
    showLastOrder() {
      this.LastOrderShow = true
    },
    refreshHeaderInfo() {
      this.$refs.headerInfo.refresh()
    },
    //收筐
    payBasketConfirm() {
      if (parseInt(this.memberEventInfo.collectBasketNum) === 0) {
        uni.showToast({
          title: '收筐数量必须大于0',
          icon: 'error',
          duration: 2000,
        })
        return
      }
      var userInfo = uni.getStorageSync('userInfo')
      var CompanyId = uni.getStorageSync('companyId')
      let param = {
        customerId: this.memberEventInfo.member.id,
        repayBasket: parseFloat(this.memberEventInfo.collectBasketNum),
        orderList: [],
        operatorId: userInfo.id,
        operatorName: userInfo.userName,
        CompanyId: CompanyId,
        customerName: this.memberEventInfo.member.customName,
      }
      member.RepayBasket(JSON.stringify(param)).then(res => {
        if (res.code == 200) {
          uni.showToast({
            title: '收筐成功',
            icon: 'success',
            duration: 2000,
          })
        } else {
          uni.showToast({
            title: '收筐失败',
            icon: 'error',
            duration: 2000,
          })
        }
        this.inputModelVisible = false
        this.memberEventInfo = {
          member: null,
          collectBasketNum: 0,
        }
      })
    },
    async payBasket_beforePay() {
      if (!this.currentMember || this.currentMember.id == null || this.currentMember.id == '') return
      var userInfo = uni.getStorageSync('userInfo')
      var CompanyId = uni.getStorageSync('companyId')
      let param = {
        customerId: this.currentMember.id,
        repayBasket: parseFloat(this.memberEventInfo.collectBasketNum),
        orderList: [],
        operatorId: userInfo.id,
        operatorName: userInfo.userName,
        CompanyId: CompanyId,
        customerName: this.currentMember.customName,
      }
      await member.RepayBasket(JSON.stringify(param))
    },
    //挂单
    hangOrder() {
      this.playSystemKeyClickSound()
      if (this.goodSelect.length === 0) return
      let that = this
      var CompanyId = this.currentCompanyId
      var goodModelList = []
      var userInfo = uni.getStorageSync('userInfo')
      console.log('this.goodSelect', this.goodSelect)
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
          commodityId: this.goodSelect[i].commodityId,
          tareWeight: this.goodSelect[i].carweight,
          saleWay: this.goodSelect[i].saleWay,
          referenceAmount: this.goodSelect[i].referenceAmount,
          subtotal: this.goodSelect[i].money,
          type: 1,
        }
        //处理押筐物体(2.0押筐物体存放在extralModel,extralModel.id==""时候为空，不做处理)
        commodity.subModel = []
        if (that.goodSelect[i].extralModel) {
          console.log('that.goodSelect[i].extralModel', that.goodSelect[i].extralModel)
          if (that.goodSelect[i].extralModel && that.goodSelect[i].extralModel.id != '') {
            commodity.subModel.push({
              Id: '00000000-0000-0000-0000-000000000000',
              commodityId: this.goodSelect[i].extralModel.id,
              name: this.goodSelect[i].extralModel.name,
              mount: this.goodSelect[i].extralModel.quantity,
              referenceAmount: this.goodSelect[i].extralModel.amount,
              totalWeight: 0,
              stockType: 0,
              commodityId: '',
              subtotal: 0,
              tareWeight: 0,
              commoditySpec: null,
              type: 2,
            })
          }
        }

        goodModelList.push(commodity)
      }

      var param = {
        CompanyId: CompanyId,
        CustomName: this.currentMember.customName,
        CustomerId: this.currentMember.id,
        Status: 0,
        accountType: 0,
        Module: JSON.stringify(goodModelList),
        Payway: -1,
        PayableAmount: this.payAmount.total,
        ActualMoney: 0,
        Debt: 0,
        ExtraMoney: 0,
      }
      if (this.currentOrderInfo != null && this.currentOrderInfo.Id) {
        param.Id = this.currentOrderInfo.Id
        param.accountCode = this.currentOrderInfo.accountCode
      }
      cashierOrder.CreateGD(JSON.stringify(param)).then(res => {
        if (res.data != null || res.data != '') {
          uni.showToast({
            title: '挂单成功',
            duration: 2000,
          })
          this.currentMember = {}
          this.resetOrder()
        }
      })
    },

    downLoadImage(base64) {
      // #ifdef APP-PLUS
      let that = this
      if (typeof plus === 'undefined') {
        uni.showToast({
          title: '此功能仅在 APP 中可用',
          icon: 'none',
        })
        return
      }
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        base64,
        function () {
          const url = '_doc/' + new Date().getTime() + '.png' // url为时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true, // 是否覆盖
              quality: 10, // 图片清晰度
            },
            i => {
              uni.saveImageToPhotosAlbum({
                filePath: url,
                success: function () {
                  that.shareImage(url)
                  uni.showToast({
                    title: '图片保存成功',
                    icon: 'none',
                  })
                  bitmap.clear()
                },
              })
            },
            e => {
              uni.showToast({
                title: '图片保存失败',
                icon: 'none',
              })
              bitmap.clear()
            }
          )
        },
        e => {
          uni.showToast({
            title: '图片保存失败',
            icon: 'none',
          })
          bitmap.clear()
        }
      )
      // #endif
    },
    shareOrder(id) {
      cashierOrder.GetCanvasBase64ById(id).then(res => {
        if (res.code == 200) {
          this.downLoadImage(res.data)
        }
      })
    },
    shareImage(tempFilePath) {
      uni.share({
        provider: 'weixin',
        type: 2, // 图片类型
        scene: 'WXSceneSession', // 分享到聊天界面
        imageUrl: tempFilePath, // 只分享这张图片的地址
        success(res) {
          console.log('分享成功', res)
        },
        fail(err) {
          console.log('分享失败', err)
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/css/cashier.scss';

.cashier-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.cashier-container {
  display: flex;
  width: 100%;
  flex: 1;
  .left-space {
    width: 50%;
    height: 100%;
  }
  .right-space {
    width: 50%;
    height: 100%;
  }
}

/* 商品网格项样式 */
.grid-item {
  width: 100rpx;
  height: 100px; /* 固定高度 */
  padding: 5px;
  margin-left: 5px;
  margin-top: 5px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden; /* 隐藏超出内容 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /* 商品名称不换行，超出隐藏 */
  > div:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 底部信息区域 */
  > div:last-child {
    overflow: hidden;
    flex: 1;
    min-height: 0;

    /* 标签行不换行 */
    > div:first-child {
      white-space: nowrap;
      overflow: hidden;
    }

    /* 库存行不换行 */
    > div:last-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.grid-item-active {
  border-color: #00aaff;
  background: #c9eafc;
  box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
  font-weight: bold;
}

/* 确保整体布局响应式 */
.cashier {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 确保左侧商品区域占据正确的空间 */
.cashier-goods {
  .card-body {
    width: 100%;
    height: 100%;
  }
}

/* 确保右侧卡片在 step1 和 step2 切换时保持一致 */
.cashier-card {
  transition: none;

  .card-body {
    width: 100%;
    box-sizing: border-box;

    /* 确保内部元素不超出容器 */
    > * {
      max-width: 100%;
      box-sizing: border-box;
    }
  }
}

/* Step2 输入行的响应式布局 */
.cashier-card .card-body > div[style*='display: flex'] {
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 8rpx;
}

/* 响应式字体大小 - 在小宽度下减小字体 */
@media screen and (max-width: 1366px) {
  .header-cell,
  .table-cell {
    font-size: 11rpx;
  }

  .name-text {
    font-size: 12rpx;
  }

  .btn-submit {
    padding: 12px 18px !important;
    font-size: 16px !important;
    min-width: 80px !important;
    height: 45px !important;
  }

  .shipping-text {
    font-size: 14px !important;
  }
}

/* 极小屏幕优化 */
@media screen and (max-width: 1024px) {
  .btn-submit {
    padding: 10px 14px !important;
    font-size: 14px !important;
    min-width: 70px !important;
    height: 40px !important;
    letter-spacing: 1px !important;
  }

  .card-footer {
    padding: 6px 8px;
  }

  .shipping-info {
    padding: 8px 12px !important;
    height: 40px !important;
  }

  .shipping-text {
    font-size: 13px !important;
  }
}

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

.mybrankmask {
  width: 100%;
  max-width: 400rpx;
  box-sizing: border-box;
  padding: 0 5rpx;
}

.mybrankmask .MymaskList {
  font-weight: bold;
  display: flex;
  width: 100%;
  height: 40rpx;
  justify-content: space-around;
  margin-bottom: 5rpx;
  font-size: 20rpx;
  box-sizing: border-box;
  gap: 5rpx;
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
  flex: 1;
  min-width: 0;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  border-radius: 10rpx;
  color: #ffffff;
  background-color: #5d5d5d;
  font-size: 25rpx;
  box-sizing: border-box;
  transition: all 0.1s ease;
}

.mybrankmask .MymaskList .maskListItem:active {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
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

.mybrankmask2 {
  width: 100%;
  max-width: 400rpx;
  box-sizing: border-box;
  padding: 0 5rpx;
}

.mybrankmask2 .MymaskList {
  display: flex;
  width: 100%;
  height: 40rpx;
  justify-content: space-around;
  margin-bottom: 5rpx;
  font-size: 12rpx;
  box-sizing: border-box;
  gap: 5rpx;
}

.mybrankmask2 .MymaskList .maskListItem {
  font-weight: bold;
  flex: 1;
  min-width: 0;
  height: 40rpx;
  color: #ffffff;
  background-color: #5d5d5d;
  text-align: center;
  line-height: 40rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  transition: all 0.1s ease;
}

.mybrankmask2 .MymaskList .maskListItem:active {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
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
  border-radius: 5px;
  padding: 5px 8px;
  height: 55rpx;
  min-height: 55rpx;
  flex: 1;
  min-width: 0;
  max-width: 48%;
  box-sizing: border-box;
  transition:
    border-color 0.3s,
    transform 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.input-focused {
  border: 3px solid #31bdec;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(49, 189, 236, 0.2);
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
    transition: all 0.3s ease;

    &.flash-red {
      animation: flashRed 0.5s ease-in-out 2;
    }

    .customer-badge {
      display: inline-block;
      padding: 8rpx 16rpx;
      border-radius: 16rpx;
      font-weight: 600;
      font-size: 24rpx;
      color: white;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2rpx);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
      }

      &:active {
        transform: translateY(0);
      }

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
          }

          .smart-round-btn {
            background: transparent;
            color: #10b981;
            border: 1rpx solid #10b981;
            border-radius: 3rpx;
            padding: 0 8rpx;
            height: 24rpx;
            line-height: 22rpx;
            font-size: 14rpx;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: #10b981;
              color: white;
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

          .payment-label,
          .payment-amount {
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

        &.confirm-btn2 {
          width: 200rpx;
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

.hang-modal-container {
  display: flex;
  height: 350rpx;
  border: 1px solid #ccc;
  width: 600rpx;
}

.hang-order-list {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid #eee;
  padding: 10rpx;
  height: 325rpx;
}

.hang-order-detail {
  flex: 1;
  position: relative;
}

.hang-order-table {
  border: 1px solid #ccc;
}

.hang-order-header {
  background-color: #cecece;
  font-weight: bold;
}

.hang-order-row {
  overflow-y: auto;
}

.hang-order-actions {
  position: absolute;
  bottom: 0;
  height: 35rpx;
  border-top: 1px solid #ccc;
  width: 100%;
  display: flex;
  gap: 6rpx;
  padding: 4rpx 0;
}

.hang-order-btn {
  width: 70rpx;
  font-weight: bold;
  color: #ffffff;
  height: 25rpx;
  line-height: 25rpx;
  font-size: 12rpx;
  margin-top: 1rpx;
  border: none;
  border-radius: 4rpx;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.hang-order-btn:hover {
  filter: brightness(1.05);
}

.hang-order-btn--delete {
  background: gainsboro;
}

.hang-order-btn--print {
  background: orange;
}

.hang-order-btn--parse {
  background: #00aaff;
}

.hang-order-model-info {
  margin-top: 5rpx;
  font-size: 10rpx;
  white-space: nowrap;
  width: 250rpx;
  text-overflow: ellipsis;
  overflow: hidden;
}

.hang-order-group-title {
  font-weight: bold;
  margin-bottom: 10rpx;
  font-size: 20rpx;
}

.hang-order-item-header {
  padding: 2rpx;
  font-size: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.success-modal-card {
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.success-modal-content {
  display: flex;
  align-items: center;
}

.success-modal-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-modal-illustration {
  width: 120px;
  height: 100px;
  margin-right: 5rpx;
}

.success-modal-info {
  margin-left: 5rpx;
  margin-top: 10px;
}

.success-modal-title,
.success-modal-subtitle {
  font-size: 15rpx;
  font-weight: bold;
}

.success-modal-actions {
  display: flex;
  align-items: center;
  gap: 50px;
}

.success-modal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18rpx;
  height: 32rpx;
  border: none;
  border-radius: 6rpx;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.success-modal-btn:hover {
  filter: brightness(1.05);
}

.success-modal-btn--print {
  background-color: orange;
}

.success-modal-btn--share {
  background-color: dodgerblue;
}

.success-modal-btn--continue {
  background-color: green;
}

.success-modal-icon {
  margin-right: 5rpx;
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

/* 现代简洁风格表格样式 */
.modern-table-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 8rpx 5rpx;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
  width: 100%;
  box-sizing: border-box;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12rpx;
  font-weight: 600;
  letter-spacing: 0.3rpx;
  flex-shrink: 0;
  padding: 0 2rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  box-sizing: border-box;
}

.header-name {
  flex: 0 0 26%;
  min-width: 0;
  justify-content: flex-start;
  padding-left: 4rpx;
}
.header-quantity {
  flex: 0 0 12%;
  min-width: 0;
}
.header-price {
  flex: 0 0 13%;
  min-width: 0;
}
.header-weight {
  flex: 0 0 28%;
  min-width: 0;
}
.header-subtotal {
  flex: 0 0 15%;
  min-width: 0;
}
.header-action {
  flex: 0 0 6%;
  min-width: 0;
  justify-content: center;
}

.modern-table-body {
  background: #ffffff;
  border-radius: 0 0 8rpx 8rpx;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.modern-table-row {
  display: flex;
  align-items: center;
  padding: 8rpx 4rpx;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  min-height: 45rpx;
  box-sizing: border-box;
}

.modern-table-row:hover {
  background: linear-gradient(to right, #ffffff 0%, #e6f7ff 100%);
  transform: translateX(2rpx);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.modern-table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13rpx;
  color: #333333;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  padding: 0 2rpx;
  box-sizing: border-box;
}

.cell-name {
  flex: 0 0 26%;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rpx;
  padding-left: 4rpx;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.name-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 1.3;
}

.extra-tag {
  display: inline-block;
  padding: 1rpx 5rpx;
  background: linear-gradient(135deg, #ff9c6e 0%, #ff7a45 100%);
  color: #ffffff;
  font-size: 9rpx;
  border-radius: 3rpx;
  font-weight: 500;
  letter-spacing: 0.2rpx;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(255, 122, 69, 0.3);
}

.cell-quantity {
  flex: 0 0 12%;
  font-weight: 700;
  color: #096dd9;
  font-size: 13rpx;
  min-width: 0;
  box-sizing: border-box;
}

.cell-price {
  flex: 0 0 13%;
  font-weight: 500;
  color: #555555;
  font-size: 12rpx;
  min-width: 0;
  box-sizing: border-box;
}

.cell-weight {
  flex: 0 0 28%;
  flex-direction: column;
  gap: 2rpx;
  min-width: 0;
  box-sizing: border-box;
}

.weight-main {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13rpx;
}

.weight-detail {
  font-size: 9rpx;
  color: #999999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-subtotal {
  flex: 0 0 15%;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4d4f 0%, #f5222d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 14rpx;
  min-width: 0;
  box-sizing: border-box;
}

.cell-action {
  flex: 0 0 6%;
  cursor: pointer;
  transition: transform 0.2s ease;
  min-width: 0;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.cell-action:hover {
  transform: scale(1.2);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 20rpx;
  margin-top: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.empty-text {
  margin-top: 16rpx;
  font-size: 16rpx;
  color: #909399;
  font-weight: 500;
  text-align: center;
}

.empty-hint {
  margin-top: 8rpx;
  font-size: 12rpx;
  color: #c0c4cc;
  text-align: center;
}

/* 运费信息样式 */
.shipping-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);
  border: 2px solid #1890ff;
  transition: all 0.2s ease;
  height: 50px;
  box-sizing: border-box;

  &:hover {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    border-color: #40a9ff;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
  }

  .shipping-text {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
    font-size: 16px;
    white-space: nowrap;
  }
}

/* 现代按钮样式 */
.modern-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/* 挂单按钮特殊样式 */
.btn-primary-plain.btn-submit {
  border: 2px solid #1890ff !important;
  color: #1890ff !important;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%) !important;

  &:hover {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%) !important;
    border-color: #40a9ff !important;
    color: #096dd9 !important;
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.2);
  }
}

/* 结账按钮特殊样式 */
.btn-primary.btn-submit {
  font-weight: 700;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%) !important;
  border: none !important;

  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%) !important;
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  }
}

/* 现代客户按钮样式 */
.modern-customer-btn {
  cursor: pointer;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0) scale(1);
  }
}

.main-customer-btn {
  border: none;
  border-radius: 0;
  font-size: 16px;
  color: #ffffff;
  height: 100%;
  padding: 10rpx 16rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  margin: 0 1px 0 0;
}

.dynamic-customer-btn {
  border: none;
  border-radius: 6px;
  font-size: 15px;
  color: #ffffff;
  height: 100%;
  padding: 10rpx 8rpx 10rpx 12rpx;
  font-weight: 600;
  letter-spacing: 0.5rpx;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  transition: all 0.3s ease;
  margin-right: 1px;
}

.customer-btn-main {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.customer-btn-count {
  font-size: 11px;
  display: flex;
  color: #ffffff;
}

.customer-btn-remove {
  display: flex;
  align-items: center;
  margin-left: 8rpx;
  cursor: pointer;
  padding: 2rpx;
}

.customer-btn-remove-icon {
  opacity: 0.9;
}

.add-customer-btn {
  border: none;
  border-radius: 50%;
  color: transparent;
  background: transparent;
  width: 32px;
  height: 32px;
  font-weight: 700;
  min-width: 32px;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
  margin-left: 2px;
}

/* 主客户按钮特殊样式 */
.main-customer-btn:hover {
  box-shadow: 0 5px 14px rgba(56, 158, 13, 0.4) !important;
  filter: brightness(1.15) !important;
}

/* 动态客户按钮特殊样式 */
.dynamic-customer-btn:hover {
  transform: translateY(-2px) scale(1.02) !important;
  filter: brightness(1.15) !important;
}

.step1-input {
  font-size: 20rpx;
  font-weight: bold;
  text-align: center;
  width: 100%;
  /* 占满custom-input的宽度 */
  display: block;
  /* 使其成为块级元素 */
}

.currency-label {
  position: absolute;
  /* 绝对定位 */
  right: 5px;
  /* 固定在右侧 */
  bottom: 5px;
  /* 固定在底部 */
  font-size: 12rpx;
  /* 可选：调整字体大小 */
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
    border: 1px solid #dd8410;
    background: #dd8410;
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
  padding-left: 15rpx;
  padding-right: 15rpx;
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
}

/* 客户滚动视图样式 */
.customer-scroll-view {
  width: 500px !important;
  min-width: 500px !important;
  max-width: 500px !important;
  overflow: hidden;
  box-sizing: border-box;
  flex-shrink: 0;
  margin: -8px;
  padding: 2px 0;
  flex: 1;
}

.customer-scroll-view ::-webkit-scrollbar {
  display: none;
}

.customer-scroll-content {
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}

/* 确保父容器也不会超出宽度 */
.card-title {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

/* 商品搜索框样式 */
.goods-search-container {
  padding: 10px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10rpx;
  width: 100%;
  box-sizing: border-box;
}
.search-input-wrapper {
  position: relative;
  display: flex;
  margin: 0;
  margin-top: 2rpx;
  margin-left: 18rpx;
  margin-right: 5rpx;
  margin-bottom: 5rpx;
  height: 25rpx;
  padding: 2rpx;
  align-items: center;
  background: #fff;
  border-radius: 3px;
  transition: all 0.3s ease;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.search-input-wrapper:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14rpx;
  background: transparent;
  width: calc(100vw - 438rpx);
  max-width: 1200rpx;
  min-width: 200rpx;
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  position: absolute;
  right: 5rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
}

.search-icon {
  flex-shrink: 0;
  margin-right: 4px;
}

.vertical-tab {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}

.goods-search-input {
  flex: 1;
  border: 1px solid #ddd;
  height: 30px;
  margin-left: 20px;
  font-size: 16px;
  padding-left: 10px;
  width: 100%;
  border-radius: 5px;
  background: white;
}

.goods-search-input::placeholder {
  color: #6c757d;
  font-style: italic;
}

.clear-icon {
  position: absolute;
  right: 15px;
  color: #6c757d;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-icon:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

/* 商品加载动画样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #00aaff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 18px;
  color: #666;
  font-weight: 500;
  letter-spacing: 1px;
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

/* 红色闪烁动画 - 用于客户信息区域 */
@keyframes flashRed {
  0%,
  100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(239, 68, 68, 0.5);
  }
}

/* 红色闪烁动画 - 用于实付金额输入框 */
@keyframes flashRedRow {
  0% {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    box-shadow: 0 0 0px rgba(239, 68, 68, 0);
  }
  25% {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
    transform: scale(1.02);
  }
  50% {
    border-color: #dc2626;
    background-color: rgba(239, 68, 68, 0.5);
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.9);
    transform: scale(1.03);
  }
  75% {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
    transform: scale(1.02);
  }
  100% {
    border-color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    box-shadow: 0 0 0px rgba(239, 68, 68, 0);
    transform: scale(1);
  }
}

/* 应用闪烁动画到输入框 */
.input-row.flash-red-row {
  animation: flashRedRow 0.5s ease-in-out 2;
  border: 2px solid #ef4444 !important;
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
</style>
