<!-- 说明： 因为html2canvas 开启 生成图片会导致calss样式丢失，所以改成行内样式， TODO应该有更好的解决方法 -->
<template>
  <div :style="containerStyle" v-if="orderImageInfo" @click.self="closeImage">
    <div id="orderImage" :style="wrapperStyle">
      <!-- 标题 -->
      <div :style="titleStyle">{{ voucherTitle }}</div>

      <!-- 副标题 -->
      <div :style="subtitleStyle">
        <div>广东省食用农产品批发市场销售票据</div>
        <div>{{ marketName }}</div>
      </div>

      <!-- 店铺名称 -->
      <div :style="companyNameStyle">{{ companyName }}</div>

      <!-- 客户和票号 -->
      <div :style="headerRowStyle">
        <div :style="{ flex: '1' }">客户：{{ customerName }}</div>
        <div :style="{ flex: '1', textAlign: 'right' }">票号：{{ orderCode }}</div>
      </div>

      <!-- 日期 -->
      <div :style="dateStyle">{{ orderDate }}</div>

      <!-- 商品表格 -->
      <div :style="tableContainerStyle">
        <!-- 表头 -->
        <div :style="tableHeaderStyle">
          <div :style="colNoStyle"></div>
          <div :style="colNameStyle">货品</div>
          <div :style="colQuantityStyle">数量</div>
          <div :style="colWeightStyle">重量</div>
          <div :style="colPriceStyle">单价</div>
          <div :style="colSubtotalStyle">小计</div>
        </div>

        <!-- 货品数据行 (type === 1) -->
        <div v-if="goodsItems.length > 0">
          <div
            :style="tableRowStyle(index === goodsItems.length - 1 && extraItems.length === 0)"
            v-for="(item, index) in goodsItems"
            :key="'goods_' + index"
          >
            <div :style="colNoStyle">{{ index + 1 }}</div>
            <div :style="colNameStyle">{{ item.name }}</div>
            <div :style="colQuantityStyle">{{ formatQuantity(item) }}</div>
            <div :style="colWeightStyle">
              <div :style="{ fontWeight: 'bold' }">
                {{ formatWeight(item).netWeight }}
              </div>
              <div :style="{ fontSize: '20rpx', color: '#666', marginTop: '4rpx' }" v-if="formatWeight(item).detail">
                {{ formatWeight(item).detail }}
              </div>
            </div>
            <div :style="colPriceStyle">{{ item.referenceAmount || 0 }}</div>
            <div :style="colSubtotalStyle">{{ formatSubtotal(item) }}</div>
          </div>
        </div>

        <!-- 附加项数据行 (type === 2)||(type === 5) -->
        <div v-if="extraItems.length > 0">
          <!-- 附加项标题 -->
          <div :style="sectionTitleStyle">附加项</div>
          <div
            :style="tableRowStyle(index === extraItems.length - 1 && deductionItems.length === 0)"
            v-for="(item, index) in extraItems"
            :key="'extra_' + index"
          >
            <div :style="colNoStyle">{{ goodsItems.length + index + 1 }}</div>
            <div :style="colNameStyle">{{ item.name }}</div>
            <div :style="colQuantityStyle">{{ formatQuantity(item) }}</div>
            <div :style="colWeightStyle">
              <div :style="{ fontWeight: 'bold' }">
                {{ formatWeight(item).netWeight }}
              </div>
              <div :style="{ fontSize: '20rpx', color: '#666', marginTop: '4rpx' }" v-if="formatWeight(item).detail">
                {{ formatWeight(item).detail }}
              </div>
            </div>
            <div :style="colPriceStyle">{{ item.referenceAmount || 0 }}</div>
            <div :style="colSubtotalStyle">{{ formatSubtotal(item) }}</div>
          </div>
        </div>

        <!-- 抵扣项数据行 (type === 4) -->
        <div v-if="deductionItems.length > 0">
          <!-- 抵扣项标题 -->
          <div :style="sectionTitleStyle">抵扣项</div>
          <div
            :style="tableRowStyle(index === deductionItems.length - 1)"
            v-for="(item, index) in deductionItems"
            :key="'deduction_' + index"
          >
            <div :style="colNoStyle">{{ goodsItems.length + extraItems.length + index + 1 }}</div>
            <div :style="colNameStyle">{{ item.name }}</div>
            <div :style="colQuantityStyle">{{ formatQuantity(item) }}</div>
            <div :style="colWeightStyle">
              <div :style="{ fontWeight: 'bold' }">
                {{ formatWeight(item).netWeight }}
              </div>
              <div :style="{ fontSize: '20rpx', color: '#666', marginTop: '4rpx' }" v-if="formatWeight(item).detail">
                {{ formatWeight(item).detail }}
              </div>
            </div>
            <div :style="colPriceStyle">{{ item.referenceAmount || 0 }}</div>
            <div :style="colSubtotalStyle">-{{ formatSubtotal(item) }}</div>
          </div>
        </div>
      </div>

      <!-- 本单合计 -->
      <div :style="finalTotalStyle">
        <div>本单合计：</div>
        <div>{{ finalAmount }} 元</div>
      </div>

      <!-- 多收金额 -->
      <div :style="paymentInfoStyle" v-if="overchargeAmount > 0">多收：{{ overchargeAmount.toFixed(0) }} 元</div>

      <!-- 优惠金额 -->
      <div :style="paymentInfoStyle" v-if="discountAmount > 0">优惠：{{ discountAmount.toFixed(0) }} 元</div>

      <!-- 实付金额 -->
      <div :style="paymentInfoStyle" v-if="actualPayment > 0">实付：{{ actualPayment }} 元</div>

      <!-- 下欠金额 -->
      <div :style="paymentInfoStyle" v-if="debt > 0">下欠：{{ debt.toFixed(0) }} 元</div>

      <!-- 底部分割线 -->
      <div :style="dividerStyle"></div>

      <!-- 底部信息 -->
      <div :style="footerInfoStyle">地址：{{ companyAddress }}，联系电话：{{ companyPhone }}</div>

      <!-- Logo -->
      <div :style="logoAreaStyle">
        <!-- 图片Logo -->
        <img src="https://zfprinter.top/static/orderlogo.png" :style="logoImgStyle" alt="智农佳" />
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
  data() {
    return {
      logoError: false, // logo加载是否出错
      useFallbackLogo: false, // 是否使用备用logo
      currentLogoPath: '', // 当前尝试的logo路径
      showDebugInfo: false, // 是否显示调试信息（可以手动开启）
      platform: '', // 当前平台
      logoPath: '', // 当前logo路径
    }
  },
  mounted() {
    // 获取平台信息
    this.platform = uni.getSystemInfoSync().platform
  },
  computed: {
    // === 公共样式对象 ===

    // 外层容器样式
    containerStyle() {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: '9999',
        padding: '40rpx',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        opacity: '0',
      }
    },

    // 主容器样式
    wrapperStyle() {
      return {
        width: '1200rpx',
        backgroundColor: '#ffffff',
        borderRadius: '8rpx',
        padding: '40rpx',
        paddingBottom: '50rpx',
        marginTop: '20rpx',
        marginBottom: '30rpx',
        position: 'relative',
        overflow: 'visible',
      }
    },

    // 标题样式
    titleStyle() {
      return {
        fontSize: '40rpx',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20rpx',
        color: '#000',
      }
    },

    // 副标题样式
    subtitleStyle() {
      return {
        textAlign: 'center',
        fontSize: '25rpx',
        color: '#333',
        marginBottom: '30rpx',
        lineHeight: '1.6',
      }
    },

    // 公司名称样式
    companyNameStyle() {
      return {
        fontSize: '35rpx',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '30rpx',
        color: '#000',
      }
    },

    // 行信息样式（客户和票号）
    headerRowStyle() {
      return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '30rpx',
        marginBottom: '20rpx',
        color: '#333',
      }
    },

    // 日期样式
    dateStyle() {
      return {
        textAlign: 'right',
        fontSize: '26rpx',
        color: '#666',
        marginBottom: '30rpx',
      }
    },

    // 表格容器样式
    tableContainerStyle() {
      return {
        margin: '30rpx 0',
      }
    },

    // 表头样式
    tableHeaderStyle() {
      return {
        display: 'flex',
        backgroundColor: '#f5f5f5',
        borderRadius: '4rpx',
        padding: '12rpx 0',
        fontSize: '30rpx',
        fontWeight: 'bold',
        color: '#000',
        borderBottom: '2rpx solid #ddd',
      }
    },

    // 表格列样式
    colNoStyle() {
      return { width: '60rpx', textAlign: 'center' }
    },
    colNameStyle() {
      return {
        width: '300rpx',
        textAlign: 'left',
        paddingLeft: '15rpx',
        wordWrap: 'break-word',
        wordBreak: 'break-all',
      }
    },
    colQuantityStyle() {
      return { width: '140rpx', textAlign: 'center' }
    },
    colWeightStyle() {
      return { width: '280rpx', textAlign: 'center' }
    },
    colPriceStyle() {
      return { width: '120rpx', textAlign: 'center' }
    },
    colSubtotalStyle() {
      return { width: '120rpx', textAlign: 'right', paddingRight: '15rpx' }
    },

    // 本单合计样式
    finalTotalStyle() {
      return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '32rpx',
        fontWeight: 'bold',
        padding: '20rpx',
        margin: '30rpx 0',
        marginTop: '50rpx',
        borderTop: '3rpx solid #000',
        borderBottom: '3rpx solid #000',
        color: '#000',
      }
    },

    // 付款信息样式
    paymentInfoStyle() {
      return {
        textAlign: 'right',
        fontSize: '30rpx',
        padding: '15rpx 20rpx',
        color: '#000',
      }
    },

    // 底部分割线样式
    dividerStyle() {
      return {
        position: 'relative',
        height: '2rpx',
        backgroundColor: '#000',
        margin: '30rpx 0 20rpx',
      }
    },

    // 底部信息样式
    footerInfoStyle() {
      return {
        position: 'relative',
        fontSize: '24rpx',
        color: '#666',
        textAlign: 'left',
        padding: '0 20rpx',
        marginBottom: '30rpx',
      }
    },

    // Logo区域样式
    logoAreaStyle() {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30rpx 0',
        paddingBottom: '50rpx',
        marginBottom: '30rpx',
      }
    },

    // Logo图片样式
    logoImgStyle() {
      return {
        width: '200rpx',
        height: 'auto',
        marginBottom: '20rpx',
      }
    },

    // 热线样式
    hotlineStyle() {
      return {
        fontSize: '18rpx',
        color: '#666',
        paddingBottom: '20rpx',
        marginBottom: '20rpx',
      }
    },

    // 分区标题样式
    sectionTitleStyle() {
      return {
        fontSize: '26rpx',
        color: '#333',
        padding: '15rpx 20rpx',
        borderTop: '2rpx solid #ddd',
        borderBottom: '1rpx solid #ddd',
        marginTop: '10rpx',
      }
    },

    // === 数据相关 computed ===

    // 凭证标题
    voucherTitle() {
      if (!this.orderImageInfo) return ''
      const order = this.orderImageInfo.order || {}
      const isRefund = order.debt > 0
      return isRefund ? '欠款凭证' : '付款凭证'
    },

    // 生成表格行样式（动态计算是否最后一行）
    tableRowStyle() {
      return isLast => ({
        display: 'flex',
        padding: '10rpx 0',
        fontSize: '28rpx',
        color: '#333',
        borderBottom: isLast ? 'none' : '1rpx solid #f0f0f0',
      })
    },

    // 还筐容器样式
    basketContainerStyle() {
      return {
        marginTop: '20rpx',
        borderTop: '2rpx solid #000',
        paddingTop: '15rpx',
      }
    },

    // 还筐行样式
    basketRowStyle() {
      return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '24rpx',
        padding: '8rpx 20rpx',
        color: '#333',
      }
    },

    // === 数据相关 computed ===

    // 公司名称
    companyName() {
      return this.orderImageInfo?.companyName || ''
    },

    // 市场名称
    marketName() {
      return this.orderImageInfo?.marketName || ''
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

    // 商品列表
    productItems() {
      const products = this.orderImageInfo?.products || []
      console.log('products', products)

      return products
    },

    // 货品列表 (type === 1)
    goodsItems() {
      return this.productItems.filter(item => item.type === 1)
    },

    // 附加项列表 (type === 2)||(type === 5)
    extraItems() {
      return this.productItems.filter(item => item.type === 2 || item.type === 5)
    },

    // 抵扣项列表 (type === 4)
    deductionItems() {
      return this.productItems.filter(item => item.type === 4)
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
      console.log('this.orderImageInfo', this.orderImageInfo)
      const order = this.orderImageInfo?.order || {}
      return Math.abs(order.actualMoney || 0).toFixed(0)
    },

    // 支付方式
    paymentMethod() {
      const order = this.orderImageInfo?.order || {}
      console.log('this.orderImageInfo', this.orderImageInfo)
      const payType = order.payway
      switch (payType) {
        case 1:
          return '微信'
        case 2:
          return '支付宝'
        case 3:
          return '现金'
        default:
          return '其他'
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

    // 下欠金额
    debt() {
      const order = this.orderImageInfo?.order || {}
      return parseFloat(order.debt || 0)
    },

    // 多收金额
    overchargeAmount() {
      const order = this.orderImageInfo?.order || {}
      return parseFloat(order.overchargeAmount || 0)
    },

    // 优惠金额
    discountAmount() {
      const order = this.orderImageInfo?.order || {}
      return parseFloat(order.discountAmount || 0)
    },
  },
  methods: {
    // 格式化数量
    formatQuantity(item) {
      return item.type === 2 ? `${item.mount}` : `${item.mount}件`
    },

    // 格式化重量
    formatWeight(item) {
      if (item.type === 2) {
        return {
          netWeight: '--',
          detail: '',
        }
      }
      const totalWeight = parseFloat(item.totalWeight || 0)
      const tareWeight = parseFloat(item.tareWeight || 0)
      const netWeight = (totalWeight - tareWeight).toFixed(1)
      const detail = `(总重:${totalWeight.toFixed(1)} - 皮重:${tareWeight.toFixed(1)})`
      return {
        netWeight: netWeight,
        detail: detail,
      }
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
/* 所有样式已改为行内样式 */
</style>
