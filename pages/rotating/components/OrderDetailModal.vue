<template>
  <u-modal 
    title="订单详情" 
    :show="show" 
    @close="handleClose" 
    :closeOnClickOverlay="true"
    :showConfirmButton="false" 
    :width="'500rpx'"
  >
    <div class="slot-content" style="position: relative;">
      <!-- 订单基本信息 -->
      <div class="slot-content" style="display: flex; flex-wrap: wrap; gap: 10px; font-weight: bold;">
        <div style="flex: 1; min-width: 200rpx;">
          创建时间: {{ formatDateTime(orderData.createTime) }}
        </div>
        <div style="flex: 1; min-width: 200rpx;">
          订单号: {{ orderData.accountCode || "" }}
        </div>
        <div style="flex: 1; min-width: 200rpx;">
          顾客: {{ orderData.customName || "散客" }}
        </div>
        <div style="flex: 1; min-width: 200rpx;">
          总计金额: {{ orderData.payableAmount }}
        </div>
        <div style="flex: 1; min-width: 200rpx;">
          押筐抵扣: {{ orderData.basketOffsetAmount }}
        </div>
        <div style="flex: 1; min-width: 200rpx;">
          实付金额: {{ orderData.actualMoney }}
        </div>
        <div 
          style="flex: 1; min-width: 200rpx; color: darkred;" 
          v-if="orderData.debt > 0"
        >
          下欠: {{ orderData.debt }}
        </div>
      </div>

      <!-- 订单商品列表 -->
      <scroll-view 
        scroll-y="true"
        :style="{ height: 150 + 'rpx', marginTop: '5rpx', marginBottom: '5rpx' }"
      >
        <div class="table">
          <div class="table-row">
            <div class="table-header-cell">货品</div>
            <div class="table-header-cell">数量</div>
            <div class="table-header-cell">总重</div>
            <div class="table-header-cell">皮重</div>
            <div class="table-header-cell">单价</div>
            <div class="table-header-cell">小计</div>
          </div>
          
          <div 
            class="table-row" 
            v-for="item in filteredOrderItems" 
            :key="item.id || item.name"
          >
            <div class="table-cell">{{ item.name }}</div>
            <div class="table-cell">{{ item.mount }}</div>
            <div class="table-cell">{{ item.totalWeight }}</div>
            <div class="table-cell">{{ item.tareWeight }}</div>
            <div class="table-cell">{{ item.referenceAmount }}</div>
            <div class="table-cell">{{ item.subtotal }}</div>
          </div>
        </div>
      </scroll-view>

      <!-- 操作按钮 -->
      <view style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding-top: 5rpx;">
        <view style="text-align: right; padding-right: 5rpx; font-weight: bold;">
          <u-button 
            type="primary"
            @click="handleMemberChange" 
            text="客户变更"
          />
        </view>
        
        <view 
          v-if="orderData.debt > 0" 
          style="text-align: right; padding-right: 5rpx;"
        >
          <u-button
            type="primary" 
            text="整单还款" 
            @click="handlePayment"
            style="background-color: darkred; color: white; border-color: darkred; font-weight: bold;"
          />
        </view>
      
        <view style="text-align: right; padding-right: 5rpx; font-weight: bold;">
          <u-button 
            type="primary"
            text="打印" 
            @click="handlePrint"
          />
        </view>
      </view>

      <!-- 发单按钮 -->
      <u-button
        icon="share-square"
        :plain="true"
        shape="circle" 
        type="primary"
        text="发单" 
        @click="handleShare" 
        style="position: absolute; top: 0; right: 0; width: 50rpx;"
      />
    </div>
  </u-modal>
</template>

<script>
export default {
  name: 'OrderDetailModal',
  props: {
    // 控制模态框显示/隐藏
    show: {
      type: Boolean,
      default: false
    },
    // 订单数据
    orderData: {
      type: Object,
      default: () => ({
        createTime: '',
        accountCode: '',
        customName: '',
        payableAmount: 0,
        basketOffsetAmount: 0,
        actualMoney: 0,
        debt: 0
      })
    },
    // 订单商品列表
    orderItems: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    'close',
    'member-change',
    'payment',
    'print',
    'share'
  ],
  computed: {
    // 过滤掉type为4的商品项
    filteredOrderItems() {
      return this.orderItems.filter(item => item.type !== 4);
    }
  },
  methods: {
    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return dateTime.replace('T', ' ');
    },
    
    // 关闭模态框
    handleClose() {
      this.$emit('close');
    },
    
    // 客户变更
    handleMemberChange() {
      this.$emit('member-change', this.orderData);
    },
    
    // 整单还款
    handlePayment() {
      this.$emit('payment', this.orderData);
    },
    
    // 打印订单
    handlePrint() {
      this.$emit('print', this.orderData);
    },
    
    // 分享订单
    handleShare() {
      this.$emit('share', this.orderData);
    }
  }
};
</script>

<style scoped>
.slot-content {
  padding: 10rpx;
}

.table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.table-row:last-child {
  border-bottom: none;
}

.table-header-cell {
  flex: 1;
  padding: 10rpx;
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
  border-right: 1px solid #ddd;
  font-size: 24rpx;
}

.table-header-cell:last-child {
  border-right: none;
}

.table-cell {
  flex: 1;
  padding: 10rpx;
  text-align: center;
  border-right: 1px solid #eee;
  font-size: 22rpx;
  word-break: break-all;
}

.table-cell:last-child {
  border-right: none;
}
</style>
