<template>
  <div class="order-image-container" v-if="orderImageInfo" @click.self="closeImage">
    <div class="voucher-wrapper" id="orderImage">
      <!-- 关闭按钮 - 不会被捕获到图片中 -->
      <div class="close-btn no-capture" @click="closeImage">
        <uni-icons type="close" size="24" color="#666"></uni-icons>
      </div>

      <!-- 标题 -->
      <div class="voucher-title">{{ voucherTitle }}</div>

      <!-- 副标题 -->
      <div class="voucher-subtitle">
        <div>广东省食用农产品批发市场销售票据</div>
        <div>(广州江南果菜批发市场)</div>
      </div>

      <!-- 店铺名称 -->
      <div class="company-name">{{ companyName }}</div>

      <!-- 客户和票号 -->
      <div class="order-header">
        <div class="customer-info">客户：{{ customerName }}</div>
        <div class="order-code">票号：{{ orderCode }}</div>
      </div>

      <!-- 日期 -->
      <div class="order-date">{{ orderDate }}</div>

      <!-- 商品表格 -->
      <div class="product-table">
        <!-- 表头 -->
        <div class="table-header">
          <div class="col col-no">#</div>
          <div class="col col-name">货品</div>
          <div class="col col-quantity">数量</div>
          <div class="col col-weight">重量</div>
          <div class="col col-price">单价</div>
          <div class="col col-subtotal">小计</div>
        </div>

        <!-- 数据行 -->
        <div class="table-body">
          <div class="table-row" v-for="(item, index) in productItems" :key="index">
            <div class="col col-no">{{ index + 1 }}</div>
            <div class="col col-name">{{ item.name }}</div>
            <div class="col col-quantity">{{ formatQuantity(item) }}</div>
            <div class="col col-weight">{{ formatWeight(item) }}</div>
            <div class="col col-price">{{ item.referenceAmount || 0 }}</div>
            <div class="col col-subtotal">{{ formatSubtotal(item) }}</div>
          </div>
        </div>

        <!-- 合计行 -->
        <div class="table-footer">
          <div class="total-row">
            <div class="total-label">合计</div>
            <div class="total-value">{{ totalAmount }}</div>
          </div>

          <!-- 还筐信息 -->
          <div class="basket-row" v-if="basketOffsetNum > 0">
            <div class="basket-label">{{ basketDate }} 还筐</div>
            <div class="basket-info">{{ basketInfo }}</div>
            <div class="basket-value">-{{ basketOffsetAmount }}</div>
          </div>
        </div>
      </div>

      <!-- 本单合计 -->
      <div class="final-total">
        <div class="final-label">本单合计：</div>
        <div class="final-value">{{ finalAmount }}</div>
      </div>

      <!-- 实付金额 -->
      <div class="payment-info">实付：{{ actualPayment }}({{ paymentMethod }})</div>

      <!-- 底部信息 -->
      <div class="footer-divider"></div>
      <div class="footer-info">地址：{{ companyAddress }}，联系电话：{{ companyPhone }}</div>

      <!-- Logo -->
      <div class="logo-area">
        <img src="/static/img/orderlogo.png" class="logo-img" alt="智农佳" />
        <div class="hotline">咨询热线：400-812-7682</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderImage',
  props: {
    orderImageInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    // 凭证标题
    voucherTitle() {
      if (!this.orderImageInfo) return ''
      const order = this.orderImageInfo.order || {}
      const isRefund = order.debt < 0 || order.basketOffsetAmount > 0
      return isRefund ? '退款凭证' : '付款凭证'
    },

    // 公司名称
    companyName() {
      return this.orderImageInfo?.companyName || '店铺名称'
    },

    // 客户名称
    customerName() {
      const order = this.orderImageInfo?.order || {}
      return order.customName || '散客'
    },

    // 订单编号
    orderCode() {
      const order = this.orderImageInfo?.order || {}
      return order.accountCode || ''
    },

    // 订单日期
    orderDate() {
      const order = this.orderImageInfo?.order || {}
      return order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : ''
    },

    // 商品列表（过滤掉type=4的还筐项）
    productItems() {
      const products = this.orderImageInfo?.products || []
      return products.filter(item => item.type !== 4)
    },

    // 总金额
    totalAmount() {
      return this.productItems
        .reduce((total, item) => {
          return total + parseFloat(item.subtotal || 0)
        }, 0)
        .toFixed(0)
    },

    // 还筐数量
    basketOffsetNum() {
      const products = this.orderImageInfo?.products || []
      return products
        .filter(item => item.type === 4)
        .reduce((sum, item) => {
          return sum + parseInt(item.mount || 0)
        }, 0)
    },

    // 还筐信息
    basketInfo() {
      const products = this.orderImageInfo?.products || []
      return products
        .filter(item => item.type === 4)
        .map(item => `${item.name}:${item.mount}`)
        .join(';')
    },

    // 还筐日期
    basketDate() {
      const order = this.orderImageInfo?.order || {}
      const createTime = order.createTime || ''
      return createTime.substring(5, 10) // MM-DD
    },

    // 还筐抵扣金额
    basketOffsetAmount() {
      const order = this.orderImageInfo?.order || {}
      return order.basketOffsetAmount || 0
    },

    // 本单合计
    finalAmount() {
      const order = this.orderImageInfo?.order || {}
      const total = parseFloat(this.totalAmount)
      const offset = parseFloat(order.basketOffsetAmount || 0)
      return (total - offset).toFixed(0)
    },

    // 实付金额
    actualPayment() {
      const order = this.orderImageInfo?.order || {}
      return Math.abs(order.actualMoney || this.finalAmount).toFixed(0)
    },

    // 支付方式
    paymentMethod() {
      const order = this.orderImageInfo?.order || {}
      const payType = order.payType
      switch (payType) {
        case 1:
          return '微信'
        case 2:
          return '支付宝'
        case 3:
          return '现金'
        default:
          return '挂账'
      }
    },

    // 公司地址
    companyAddress() {
      return this.orderImageInfo?.companyAddress || '地址信息'
    },

    // 公司电话
    companyPhone() {
      return this.orderImageInfo?.companyPhone || '联系电话'
    },
  },
  methods: {
    // 格式化数量
    formatQuantity(item) {
      return item.type === 2 ? `${item.mount}` : `${item.mount}件`
    },

    // 格式化重量
    formatWeight(item) {
      if (item.type === 2) return '--'
      const totalWeight = parseFloat(item.totalWeight || 0)
      const tareWeight = parseFloat(item.tareWeight || 0)
      const netWeight = (totalWeight - tareWeight).toFixed(2)
      return netWeight
    },

    // 格式化小计
    formatSubtotal(item) {
      return parseFloat(item.subtotal || 0).toFixed(0)
    },

    // 关闭图片预览
    closeImage() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.order-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start; // 改为顶部对齐，支持滚动查看
  z-index: 9999;
  padding: 40rpx;
  box-sizing: border-box;
  overflow-y: auto; // 外层容器支持滚动
  overflow-x: hidden;
  opacity: 0;
}

.voucher-wrapper {
  width: 750rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 40rpx;
  padding-bottom: 50rpx; // 进一步增加底部内边距，确保底部内容不被裁剪
  margin-top: 20rpx; // 添加上边距
  margin-bottom: 60rpx; // 增加下边距，方便滚动查看
  position: relative; // 为关闭按钮提供定位基准
  // max-height: 90vh; // 移除高度限制，让内容完整显示以便生成图片
  // overflow-y: auto; // 移除滚动，让内容完整显示
  overflow: visible; // 确保所有内容可见
}

// 关闭按钮
.close-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.15);
    transform: rotate(90deg) scale(0.95);
  }
}

// 标题
.voucher-title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
  color: #000;
}

// 副标题
.voucher-subtitle {
  text-align: center;
  font-size: 20rpx;
  color: #333;
  margin-bottom: 30rpx;
  line-height: 1.6;
}

// 公司名称
.company-name {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #000;
}

// 订单头部
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.customer-info {
  flex: 1;
}

.order-code {
  flex: 1;
  text-align: right;
}

// 日期
.order-date {
  text-align: right;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 30rpx;
}

// 表格
.product-table {
  margin: 30rpx 0;
}

.table-header {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 4rpx;
  padding: 12rpx 0;
  font-size: 24rpx;
  font-weight: bold;
  color: #000;
  border-bottom: 2rpx solid #ddd;
}

.table-body {
  .table-row {
    display: flex;
    padding: 10rpx 0;
    font-size: 22rpx;
    color: #333;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }
}

.col {
  text-align: center;

  &.col-no {
    width: 50rpx;
  }

  &.col-name {
    flex: 1;
    text-align: left;
    padding-left: 10rpx;
  }

  &.col-quantity {
    width: 120rpx;
  }

  &.col-weight {
    width: 120rpx;
  }

  &.col-price {
    width: 100rpx;
  }

  &.col-subtotal {
    width: 100rpx;
    text-align: right;
    padding-right: 10rpx;
  }
}

.table-footer {
  margin-top: 20rpx;
  border-top: 2rpx solid #000;
  padding-top: 15rpx;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  font-weight: bold;
  padding: 10rpx 20rpx;
  color: #000;
}

.basket-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  color: #333;

  .basket-label {
    flex: 0 0 auto;
  }

  .basket-info {
    flex: 1;
    padding: 0 20rpx;
  }

  .basket-value {
    flex: 0 0 auto;
    color: #e74c3c;
  }
}

// 本单合计
.final-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  padding: 20rpx;
  margin: 30rpx 0;
  border-top: 3rpx solid #000;
  border-bottom: 3rpx solid #000;
  color: #000;
}

// 实付信息
.payment-info {
  text-align: right;
  font-size: 28rpx;
  padding: 15rpx 20rpx;
  color: #333;
}

// 底部分割线
.footer-divider {
  height: 2rpx;
  background-color: #000;
  margin: 30rpx 0 20rpx;
}

// 底部信息
.footer-info {
  font-size: 20rpx;
  color: #666;
  text-align: left;
  padding: 0 20rpx;
  margin-bottom: 30rpx;
}

// Logo区域
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  padding-bottom: 50rpx; // 进一步增加底部内边距，确保不被裁剪
  margin-bottom: 30rpx; // 添加底部外边距

  .logo-img {
    width: 200rpx;
    height: auto;
    margin-bottom: 20rpx; // 增加图片底部间距
  }

  .hotline {
    font-size: 18rpx;
    color: #666;
    padding-bottom: 20rpx; // 增加底部内边距
    margin-bottom: 20rpx; // 添加底部外边距
  }
}
</style>
