<template>
  <!-- 抽屉容器 -->
  <view class="drawer-container" v-if="visible">
    <!-- 遮罩层 -->
    <view class="drawer-mask" :class="{ show: visible }" @tap="handleClose"></view>

    <!-- 抽屉内容 -->
    <view class="drawer-content" :class="{ show: visible }">
      <!-- 订单详情抽屉 -->
      <view class="order-detail-container" v-if="visible && orderData">
        <!-- 抽屉头部 -->
        <view class="detail-header-new" :class="{ 'has-debt': hasDebt }">
          <view class="header-left">
            <text class="detail-title-new">上一张订单</text>
          </view>
        </view>

        <scroll-view scroll-y="true" :style="{ height: productScrollHeight }">
          <!-- 订单信息网格 -->
          <div class="order-info-grid-compact">
            <!-- 第一行 -->
            <div class="info-row">
              <div class="info-item-new">
                <text class="info-value-new info-value-small">{{
                  orderData.createTime ? orderData.createTime.replace('T', ' ') : ''
                }}</text>
              </div>
              <div class="info-item-new">
                <text class="info-value-new info-value-small">{{ orderData.accountCode || '-' }}</text>
              </div>
            </div>

            <!-- 第二行 -->
            <div class="info-row">
              <div class="info-item-new">
                <text class="info-value-new info-value-small">{{ orderData.customName || '散客' }}</text>
              </div>
              <div class="info-item-new">
                <text class="info-label-new">总计金额:</text>
                <text class="info-value-new highlight-value">{{ orderData.payableAmount || 0 }}</text>
              </div>
            </div>

            <!-- 第三行 -->
            <div class="info-row">
              <div class="info-item-new" v-if="orderData.basketOffsetAmount">
                <text class="info-label-new">押筐抵扣:</text>
                <text class="info-value-new"
                  >{{ orderData.basketOffsetAmount || 0 }}({{ orderData.basketOffsetNum || 0 }}个)</text
                >
              </div>
              <div class="info-item-new">
                <text class="info-label-new">实付金额:</text>
                <text class="info-value-new highlight-value">{{ orderData.actualMoney || 0 }}</text>
              </div>
            </div>

            <!-- 第四行 - 下欠 -->
            <div class="info-row" v-if="orderData.debt > 0">
              <div class="info-item-new">
                <text class="info-label-new">下欠:</text>
                <text class="info-value-new debt-value-new">{{ orderData.debt }}</text>
              </div>
              <div class="info-item-new" v-if="orderData.status !== 1 && orderData.status">
                <text class="info-label-new">订单状态:</text>
                <text class="info-value-new" :class="getOrderStatusClass()">{{ getOrderStatusText() }}</text>
              </div>
            </div>
          </div>

          <!-- 商品表格 -->
          <div class="product-table-container" v-if="productList && productList.length > 0">
            <div class="product-table">
              <div class="table-row table-header-row">
                <div class="table-header-cell">货品</div>
                <div class="table-header-cell">数量</div>
                <div class="table-header-cell">总重</div>
                <div class="table-header-cell">皮重</div>
                <div class="table-header-cell">单价</div>
                <div class="table-header-cell">小计</div>
              </div>

              <div class="table-row table-body-row" v-for="(item, index) in productList" :key="index">
                <div class="table-cell">{{ item.name }}</div>
                <div class="table-cell">{{ item.mount }}</div>
                <div class="table-cell">{{ item.totalWeight }}</div>
                <div class="table-cell">{{ item.tareWeight }}</div>
                <div class="table-cell">{{ item.referenceAmount }}</div>
                <div class="table-cell">{{ item.subtotal }}</div>
              </div>
            </div>
          </div>

          <!-- 无商品数据提示 -->
          <view v-else class="no-products">
            <view class="no-products-icon">
              <uni-icons type="info-filled" size="24" color="#bdc3c7"></uni-icons>
            </view>
            <text class="no-products-text">暂无商品信息</text>
          </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="action-buttons" v-if="showActions">
          <u-button type="primary" @click="handlePrint" text="打印" :custom-style="{ flex: 1 }"></u-button>
          <u-button
            type="primary"
            icon="share-square"
            @click="handleShare"
            text="发单"
            :custom-style="{ flex: 1 }"
          ></u-button>
        </view>
      </view>
    </view>

    <!-- 订单图片组件 -->
    <OrderImage :orderImageInfo="orderImageInfo" @close="closeOrderImage" v-if="showOrderImage" />
    <view :prop="canvasImageMsg" :change:prop="canvasImage.updateEcharts"></view>
  </view>
</template>

<script>
import OrderImage from './OrderImage/OrderImage.vue'
import cashierOrder from '../api/cashier/cashierOrder'

export default {
  name: 'OrderDetailDrawer',
  components: {
    OrderImage,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    orderData: {
      type: Object,
      default: () => ({}),
    },
    containerHeight: {
      type: [Number, String],
      default: 600,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isGeneratingImage: false,
      showOrderImage: false,
      orderImageInfo: null,
      canvasImageMsg: '',
    }
  },
  computed: {
    productList() {
      if (!this.orderData || !this.orderData.modelList) {
        return []
      }
      // 过滤掉 type 为 4 的项目（还筐）
      return this.orderData.modelList.filter(item => item.type !== 4)
    },
    productScrollHeight() {
      // 根据容器高度动态计算商品列表高度
      const baseHeight =
        typeof this.containerHeight === 'number' ? this.containerHeight : parseInt(this.containerHeight)
      return baseHeight - 50 + 'px'
    },
    hasDebt() {
      // 判断是否有下欠
      return this.orderData && this.orderData.debt > 0
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handlePrint() {
      this.$emit('print', this.orderData)
    },
    handleShare() {
      // 防止重复点击
      if (this.isGeneratingImage) {
        uni.showToast({
          title: '单据正在生成中，请稍候...',
          icon: 'none',
        })
        return
      }

      // 显示加载提示
      uni.showLoading({
        title: '正在生成单据...',
        mask: true,
      })

      // 使用canvas生成订单详情图片
      this.generateOrderImage()
    },
    generateOrderImage() {
      this.isGeneratingImage = true

      // 准备订单数据
      const order = this.orderData || {}
      const products = this.productList || []

      // 获取公司信息
      const companyName = uni.getStorageSync('companyName') || ''
      const companyAddress = uni.getStorageSync('address') || ''
      const companyPhone = uni.getStorageSync('contact') || ''
      const marketName = uni.getStorageSync('marketName') || ''

      this.orderImageInfo = {
        companyName,
        companyAddress,
        companyPhone,
        order,
        products,
        marketName,
      }
      this.generateHandle()
    },
    generateHandle() {
      this.showOrderImage = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.generateImageWithCanvas()
        }, 100)
      })
    },
    generateImageWithCanvas() {
      // 触发renderjs生成图片
      this.canvasImageMsg = 'generate'
    },

    // 接收renderjs返回的图片数据
    receiveRenderData(base64) {
      this.canvasImageMsg = null
      // 重置生成状态
      this.isGeneratingImage = false
      // 清空订单信息（下次生成时会重新设置）
      this.orderImageInfo = null
      // 隐藏加载提示
      uni.hideLoading()
      // 更新发单次数
      this.updateShareCount()
      // 保存并分享图片
      this.downLoadImage(base64)
    },

    downLoadImage(base64) {
      let that = this
      const bitmap = new plus.nativeObj.Bitmap('test')
      bitmap.loadBase64Data(
        base64,
        function () {
          const url = '_doc/' + new Date().getTime() + '.png' // url为时间戳命名方式
          bitmap.save(
            url,
            {
              overwrite: true, // 是否覆盖
              quality: 100, // 图片清晰度
            },
            _i => {
              // 直接使用临时图片路径分享，不保存到相册
              that.shareImage(url)
              bitmap.clear()
            },
            _e => {
              uni.showToast({
                title: '图片处理失败',
                icon: 'none',
              })
              bitmap.clear()
            }
          )
        },
        _e => {
          uni.showToast({
            title: '图片处理失败',
            icon: 'none',
          })
          bitmap.clear()
        }
      )
    },

    shareImage(url) {
      // 更新发单次数
      this.updateShareCount()

      uni.hideLoading()
      this.isGeneratingImage = false
      this.showOrderImage = false

      // 分享图片到微信
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 2,
        imageUrl: url,
        success: _res => {},
        fail: err => {
          console.log('分享失败', err)
          uni.showToast({
            title: '分享失败',
            icon: 'none',
          })
        },
      })
    },
    closeOrderImage() {
      this.showOrderImage = false
      this.orderImageInfo = null
    },
    updateShareCount() {
      if (!this.orderData || !this.orderData.id) {
        return
      }

      // 调用API更新发单次数
      cashierOrder.updateShareNum(this.orderData.id).then(res => {
        if (res.code === 200) {
          // 通过事件通知父组件更新shareNum
          const newShareNum = this.orderData.shareNum ? this.orderData.shareNum + 1 : 1
          this.$emit('update-share-count', this.orderData.id, newShareNum)
        }
      })
    },
    getOrderStatusText() {
      if (!this.orderData || !this.orderData.status) return ''
      switch (this.orderData.status) {
        case 1:
          return '正常'
        case 2:
          return '作废'
        case 5:
          return '已修改'
        default:
          return '未知'
      }
    },
    getOrderStatusClass() {
      if (!this.orderData || !this.orderData.status) return ''
      switch (this.orderData.status) {
        case 1:
          return 'status-normal'
        case 2:
          return 'status-refund'
        case 5:
          return 'status-modified'
        default:
          return 'status-unknown'
      }
    },
  },
}
</script>
<script lang="renderjs" module="canvasImage">
import html2canvas from 'html2canvas'
export default {
  methods: {
    generateImage(callback) {
			// 使用html2canvas 转换html为canvas 克隆解决的问题：html2canvas只能给屏幕可视范围之内的元素生成图片
      // 获取节点高度，后面为克隆节点设置高度。
      var height = document.querySelector('#orderImage').offsetHeight
      // 克隆节点，默认为false，不复制方法属性，为true是全部复制。
      var cloneDom = document.querySelector('#orderImage').cloneNode(true);
      cloneDom.style.zIndex = '-1';
      // 将克隆节点动态追加到body后面。
      document.querySelector('body').append(cloneDom)
      // 插件生成base64img图片。
      html2canvas(cloneDom, {
				useCORS: true,
				scrollY: 0,
				scrollX: 0,
				logging: false,
				ignoreElements: (e) => {
					if (
              e.contains(cloneDom) ||
              cloneDom.contains(e) ||
							e.tagName === 'STYLE'
            ) {
              return false;
            }
            return true;
				},
			}).then(function(canvas) {
        const imgUri = canvas.toDataURL('image/png')
				callback&&callback(imgUri);
      })		
			document.querySelector('body').removeChild(cloneDom)				
    },
    updateEcharts(newValue, oldValue, ownerInstance, instance) {
      // 监听 service 层数据变更
      if(newValue){
        this.generateImage((base64)=>{
          ownerInstance.callMethod('receiveRenderData', base64);
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 抽屉容器 */
.drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

/* 遮罩层 */
.drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.drawer-mask.show {
  opacity: 1;
  pointer-events: auto;
}

/* 抽屉内容 */
.drawer-content {
  position: absolute;
  top: 0;
  right: -50%;
  width: 50%;
  height: 100%;
  background-color: #f5f5f5;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.drawer-content.show {
  transform: translateX(-100%);
}

/* 订单详情抽屉样式 - 参照 rotatingIndex.vue */
.order-detail-container {
  padding: 12rpx 16rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 抽屉头部样式 */
.detail-header-new {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 12rpx;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  border-radius: 6rpx;
  margin-bottom: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(74, 144, 226, 0.2);
  min-height: 40rpx;
}

/* 有下欠时的红色背景 */
.detail-header-new.has-debt {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 2rpx 8rpx rgba(231, 76, 60, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-title-new {
  font-size: 16rpx;
  font-weight: bold;
  color: white;
}

/* 订单信息网格 */
.order-info-grid-compact {
  padding: 8rpx;
  background-color: #f8f9fa;
  border-radius: 6rpx;
  margin-bottom: 8rpx;
}

.info-row {
  display: flex;
  gap: 8rpx;
  margin-bottom: 6rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item-new {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 6rpx 10rpx;
  border-radius: 4rpx;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
  min-width: 0;
}

.info-label-new {
  color: #666;
  font-size: 14rpx;
  font-weight: 500;
  white-space: nowrap;
  margin-right: 8rpx;
}

.info-value-new {
  color: #333;
  font-size: 14rpx;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-value-small {
  font-size: 12rpx;
}

.highlight-value {
  color: #e4393c;
  font-weight: bold;
}

.debt-value-new {
  color: darkred;
  font-weight: bold;
}

.status-normal {
  color: #67c23a;
}

.status-refund {
  color: #f56c6c;
}

.status-modified {
  color: #31bdec;
}

.status-unknown {
  color: #909399;
}

/* 商品表格容器 */
.product-table-container {
  width: 100%;
  margin: 8rpx 0;
  padding: 0 8rpx;
  box-sizing: border-box;
}

.product-table {
  width: 100%;
  background-color: white;
  overflow: hidden;
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
  display: table;
  table-layout: fixed;
}

.table-header-row {
  background: linear-gradient(135deg, #f5f7fa, #e8ebef);
}

.table-body-row {
  transition: background-color 0.3s ease;
}

.table-body-row:nth-child(even) {
  background-color: #fafbfc;
}

.table-body-row:hover {
  background-color: #ecf5ff;
}

.table-row {
  display: table-row;
}

.table-cell,
.table-header-cell {
  display: table-cell;
  border: 1px solid #dddddd;
  padding: 8rpx 6rpx;
  text-align: center;
  font-size: 12rpx;
  line-height: 1.3;
}

.table-header-cell {
  font-weight: bold;
  color: #333;
  background: linear-gradient(135deg, #f5f7fa, #e8ebef);
}

.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 30rpx;
  text-align: center;
}

.no-products-icon {
  margin-bottom: 15rpx;
}

.no-products-text {
  font-size: 24rpx;
  color: #95a5a6;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 10rpx;
  padding: 10rpx 0;
  border-top: 1rpx solid #eee;
  margin-top: 10rpx;
}
</style>
