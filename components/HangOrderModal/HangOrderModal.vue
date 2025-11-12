<template>
  <!-- 挂单中心模态框 -->
  <view v-if="visible" class="custom-modal-overlay" @click="handleClose">
    <view class="custom-modal-wrapper" @click.stop>
      <!-- 标题栏 -->
      <view class="custom-modal-header">
        <text class="custom-modal-title">{{ title }}</text>
        <view class="custom-modal-close" @click="handleClose">
          <text>✕</text>
        </view>
      </view>
      
      <!-- 内容区域 -->
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
                :class="{ 'item-selected': selectedOrder && selectedOrder.id === item.id }"
                v-for="item in group.items"
                :key="item.uniqueKey"
                @click="handleSelectOrder(item)"
              >
                <view class="order-item-key">{{ item.key }}</view>
                <view class="hang-order-item-header">
                  <view class="order-item-time">{{ item.createTime.replace('T', ' ') }}</view>
                  <view class="order-item-customer">{{ item.customName }}</view>
                </view>
                <view class="hang-order-model-info">
                  {{ item.modelInfo }}
                </view>
              </view>
            </view>
          </view>
        </div>

        <!-- 右边订单详情 -->
        <div class="order-detail hang-order-detail">
          <!-- 固定表头 -->
          <view class="hang-order-table-header">
            <view class="table-header-cell">名称</view>
            <view class="table-header-cell">数量</view>
            <view class="table-header-cell">单价</view>
            <view class="table-header-cell">小计(元)</view>
          </view>
          
          <!-- 可滚动表格内容 -->
          <scroll-view 
            class="hang-order-table-body" 
            scroll-y="true"
            :style="{ height: tableBodyHeight }"
          >
            <view v-if="!selectedOrder || !selectedOrder.modelList || selectedOrder.modelList.length === 0" class="empty-text">
              请选择挂单查看详情
            </view>
            <view 
              v-for="(item, index) in (selectedOrder && selectedOrder.modelList) || []" 
              :key="index"
              class="table-row"
              :class="{ 'stripe-row': index % 2 === 1 }"
            >
              <view class="table-cell">
                <div class="table-cell-inner cell-name">
                  <span class="name-text">{{ index + 1 }}. {{ item.skuName || item.name }}</span>
                  <span 
                    v-if="item.extralModel && item.extralModel.id != '' && item.extralModel.quantity > 0"
                    class="extra-tag"
                  >
                    {{ item.extralModel.name }}
                  </span>
                </div>
              </view>
              <view class="table-cell">
                <view class="table-body-text">
                  <div>{{ getQuantity(item) }}</div>
                  <div class="tips" v-if="item.saleWay === 1">毛:{{item.allweight || item.totalWeight}} - 皮:{{item.carweight || item.tareWeight}}</div>
                </view>
              </view>
              <view class="table-cell">
                <view class="table-body-text">
                  {{ item.referenceAmount }}元{{ item.commoditySpec && item.commoditySpec.specName ? item.saleWay === 1 ? '/斤' : ('/' + item.commoditySpec.specName) : '' }}
                </view>
              </view>
              <view class="table-cell">
                <view class="table-body-text table-body-text-money">
                  {{ item.money2 || item.subtotal }}
                </view>
              </view>
            </view>
          </scroll-view>
          
          <div class="hang-order-actions">
            <button @click="handleDelete" class="hang-order-btn hang-order-btn--delete">
              删除
            </button>
            <button @click="handlePrint" class="hang-order-btn hang-order-btn--print">
              打印挂单
            </button>
            <button @click="handleParse" class="hang-order-btn hang-order-btn--parse">
              取挂单
            </button>
          </div>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HangOrderModal',
  props: {
    // 控制模态框显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '挂单中心'
    },
    // 挂单列表数据
    hangList: {
      type: Array,
      default: () => []
    },
    // 当前选中的订单
    selectedOrder: {
      type: Object,
      default: null
    }
  },
  computed: {
    // 计算表格内容区域的高度
    tableBodyHeight() {
      // 容器总高度 380rpx - 表头高度 30rpx - 按钮栏高度 35rpx = 315rpx
      return '315rpx'
    }
  },
  methods: {
    // 关闭模态框
    handleClose() {
      this.$emit('close')
    },
    // 选择订单
    handleSelectOrder(item) {
      this.$emit('select-order', item)
    },
    // 删除订单
    handleDelete() {
      if (this.selectedOrder) {
        this.$emit('delete', this.selectedOrder)
      }
    },
    // 打印挂单
    handlePrint() {
      if (this.selectedOrder) {
        this.$emit('print', this.selectedOrder)
      }
    },
    // 取挂单
    handleParse() {
      if (this.selectedOrder) {
        this.$emit('parse', this.selectedOrder)
      }
    },
    // 获取数量显示文本
    getQuantity(item) {
      const spenc = item.commoditySpec && item.commoditySpec.specName ? item.commoditySpec.specName : ''
      let res = ''
      // 如果是散装数量为 总重
      if (item.saleWay === 4) {
        res = (item.allweight || item.totalWeight) + spenc
      } else if (item.saleWay === 1) {
        // 非定装，展示数量展示 xx/单位（净重）/n ( 毛：xx - 皮：xx )
        const allweight = item.allweight || item.totalWeight || 0
        const carweight = item.carweight || item.tareWeight || 0
        res = `${item.mount}${spenc}(${allweight - carweight})`
      } else {
        res = (item.mount || 0) + spenc
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
/* 自定义模态框样式 */
.custom-modal-overlay {
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

.custom-modal-wrapper {
  background-color: #ffffff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}

.custom-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5rpx 20rpx;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e5e5e5;
}

.custom-modal-title {
  font-size: 16rpx;
  font-weight: bold;
  color: #333333;
}

.custom-modal-close {
  width: 30rpx;
  height: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.custom-modal-close:hover {
  background-color: #e5e5e5;
}

.custom-modal-close text {
  font-size: 20rpx;
  color: #666666;
  font-weight: bold;
}

.hang-modal-container {
  display: flex;
  height: 400rpx;
  width: 650rpx;
}

.hang-order-list {
  flex: 2;
  overflow-y: auto;
  border-right: 1px solid #eee;
  padding: 10rpx;
  height: 360rpx;
}

.hang-order-detail {
  flex: 3;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 380rpx;
}

/* 固定表头 */
.hang-order-table-header {
  display: flex;
  align-items: center;
  background-color: #cecece;
  font-weight: bold;
  height: 30rpx;
  flex-shrink: 0;
  border-bottom: 1px solid #ccc;
}

.table-header-cell {
  flex: 1;
  text-align: center;
  font-size: 12rpx;
  color: #333333;
  padding: 8rpx 4rpx;
  box-sizing: border-box;
}

.table-header-cell-index {
  flex: 0 0 50rpx;
  min-width: 50rpx;
}

/* 可滚动表格内容 */
.hang-order-table-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.empty-text {
  text-align: center;
  padding: 40rpx 20rpx;
  color: #999999;
  font-size: 12rpx;
}

.table-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  min-height: 50rpx;
  background-color: #ffffff;
}

.table-row.stripe-row {
  background-color: #fafafa;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.table-cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 4rpx;
  box-sizing: border-box;
  font-size: 12rpx;
  border-right: 1px solid #f0f0f0;
}

.table-cell-index {
  flex: 0 0 50rpx;
  min-width: 50rpx;
}

.table-cell:last-child {
  border-right: none;
}

.table-cell-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-cell:nth-child(2) .table-cell-inner {
  justify-content: flex-start;
}

.table-body-text {
  font-size: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
  
  .tips {
    font-size: 8rpx;
    color: #999999;
  }
}

.table-body-text-money {
  color: #eb0404;
  font-weight: 600;
}

.cell-name {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rpx;
  padding: 5rpx;
  width: 100%;
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
  padding: 1rpx 4rpx;
  background: linear-gradient(135deg, #ff9c6e 0%, #ff7a45 100%);
  color: #ffffff;
  font-size: 7rpx;
  border-radius: 3rpx;
  letter-spacing: 0.2rpx;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(255, 122, 69, 0.3);
}

.hang-order-actions {
  height: 35rpx;
  border-top: 1px solid #ccc;
  width: 100%;
  display: flex;
  gap: 6rpx;
  padding: 4rpx 0;
  flex-shrink: 0;
  background-color: #ffffff;
  box-sizing: border-box;
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
  margin-top: 6rpx;
  font-size: 10rpx;
  color: #666666;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 1.4;
}

.hang-order-group-title {
  font-weight: bold;
  margin-bottom: 12rpx;
  margin-top: 8rpx;
  font-size: 18rpx;
  color: #333333;
  padding-left: 4rpx;
}

.hang-order-item-header {
  margin-top: 6rpx;
  padding: 0;
  font-size: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8rpx;
}

.order-item-key {
  font-size: 14rpx;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4rpx;
  line-height: 1.4;
}

.order-item-time {
  font-size: 10rpx;
  color: #888888;
  flex: 1;
}

.order-item-customer {
  font-size: 11rpx;
  color: #555555;
  font-weight: 500;
  flex-shrink: 0;
}

.grid-member-container {
  display: flex;
  flex-direction: column;
}

.group-container {
  margin-bottom: 16rpx;
}

.grid-member-item2 {
  padding: 12rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 8rpx;
  position: relative;
  overflow: hidden;
}

.grid-member-item2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4rpx;
  background-color: #00aaff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-member-item2:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
  border-color: #d0d0d0;
}

.grid-member-item2:hover::before {
  opacity: 1;
}

.grid-member-item2.item-selected {
  background: #00aaff;
  border-color: #00aaff;
  box-shadow: 0 4rpx 16rpx rgba(0, 170, 255, 0.3);
}


.grid-member-item2.item-selected .order-item-key {
  color: #ffffff;
  font-weight: 700;
}

.grid-member-item2.item-selected .order-item-time {
  color: rgba(255, 255, 255, 0.9);
}

.grid-member-item2.item-selected .order-item-customer {
  color: #ffffff;
  font-weight: 600;
}

.grid-member-item2.item-selected .hang-order-model-info {
  color: rgba(255, 255, 255, 0.85);
}

.slot-content {
  padding: 10rpx;
}

.order-detail {
  padding: 10rpx;
}
</style>

