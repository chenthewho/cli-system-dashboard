<template>

<div v-if="step1" class="cashier-card">

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
<!-- 使用 GoodEditKeyboard 组件 -->
<div v-if="!step1" class="cashier-card">
<GoodEditKeyboard
:card="editingCard"
:fixed-tare-weight="fixedTareWeight"
:show-step2="showStep2"
:edit-card-extral-model="editCardExtralModel"
@close="step1 = true"
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
</template>