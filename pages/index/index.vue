<template>
  <div id="app">
    <Sidebar ref="sidebarRef" @update-content="updateCashierContent" />
    <div class="main-content" :class="{ 'no-sidebar': cashierContent === 'one' }">
        <Cashier v-show="cashierContent === 'one'" ref="orderRef" @goToManagement="switchToManagement" />
        <order ref="orderRef2" v-show="cashierContent === 'two'" />
        <goodIndex ref="goodIndexRef" v-show="cashierContent === 'three'" />
        <setting v-show="cashierContent === 'six'" />
        <staticPage v-show="cashierContent === 'four'" />
        <settlementIndex ref="settlementIndexRef" v-show="cashierContent === 'five'" />
        <rotating ref="rotatingRef" v-show="cashierContent === 'seven'" />
        <shipperManagement ref="shipperManagementRef" v-show="cashierContent === 'eight'" />
    </div>
	</div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Cashier from '../cashier/cashier.vue'
import goodIndex from '../good/goodIndex.vue'
import order from '../order/order.vue'
import setting from '../setting/setting.vue'
import staticPage from '../static/static.vue'
import rotating from '../rotating/rotatingIndex.vue'
import settlementIndex from '../settlement/settlementIndex.vue'
import shipperManagement from '../shipper/shipperManagement.vue'
export default {
  components: {
    Cashier,
    Sidebar,
    goodIndex,
    order,
    setting,
    staticPage,
    rotating,
    settlementIndex,
    shipperManagement,
  },
  data() {
    return {
      cashierContent: 'one',
      vesionType: uni.getStorageSync('vesionType') ?? 1, // 获取版本类型，默认为1
    }
  },
  onShow() {
    var refresh_batch = uni.getStorageSync('refresh_batch')
    if (refresh_batch != null && refresh_batch.trim() !== '') {
      this.refreshBatch(refresh_batch)
      uni.removeStorageSync('refresh_batch')
    }
    var refresh_allbatch = uni.getStorageSync('refresh_all')
    if (refresh_allbatch != null && refresh_allbatch.trim() !== '') {
      this.refreshallBatch()
      uni.removeStorageSync('refresh_all')
    }
    var refresh_CompanyInfo = uni.getStorageSync('refreshCompanyInfo')
    if (refresh_CompanyInfo != null && refresh_CompanyInfo.trim() !== '') {
      this.$refs.orderRef.refreshHeaderInfo()
      uni.removeStorageSync('refreshCompanyInfo')
    }
    plus.navigator.setFullscreen(true)
    //隐藏虚拟按键
    plus.navigator.hideSystemNavigation()
    console.log('vesionType', this.vesionType)
  },
  mounted() {
    // this.$refs.orderRef.onLoadMethod();
  },
  methods: {
    refreshBatch(id) {
      this.$refs.goodIndexRef.refreshBatch(id)
    },
    refreshallBatch() {
      this.$refs.goodIndexRef.refreshAllBatch()
    },
    updateCashierContent(newContent) {
      this.cashierContent = newContent
      // 切换到对应页面时刷新数据
      this.$nextTick(() => {
        if (this.cashierContent === 'one' && this.$refs.orderRef) {
          this.$refs.orderRef.refreshPage()
        } else if (this.cashierContent === 'two' && this.$refs.orderRef2) {
          this.$refs.orderRef2.onshowMethed()
        } else if (this.cashierContent === 'five' && this.$refs.settlementIndexRef) {
          // 切换到结算页面时刷新tabs组件
          setTimeout(() => {
            if (this.$refs.settlementIndexRef.refreshTabs) {
              this.$refs.settlementIndexRef.refreshTabs()
            }
          }, 200)
        } else if (this.cashierContent === 'three' && this.$refs.goodIndexRef) {
          // 切换到商品管理页面时刷新数据
          this.$refs.goodIndexRef.refreshPage()
        } else if (this.cashierContent === 'seven' && this.$refs.rotatingRef) {
          // 切换到轮班页面时刷新数据
          this.$refs.rotatingRef.refreshPage()
        } else if (this.cashierContent === 'eight' && this.$refs.shipperManagementRef) {
          // 切换到货主管理页面时刷新数据
          console.log('切换到货主管理页面')
        }
      })
    },
    switchToManagement() {
      // 切换到订单页面
      this.cashierContent = 'two'
      // 更新 sidebar 的激活状态
      this.$nextTick(() => {
        if (this.$refs.sidebarRef) {
          this.$refs.sidebarRef.setActiveItem('two')
        }
      })
    },
  },
}
</script>

<style>
#app {
  display: flex; /* 使用 Flexbox 布局 */
}

.sidebar {
  width: 40rpx; /* 设置侧边栏宽度 */
  height: 100vh; /* 使侧边栏高度占满整个视口 */
  background-color: #f4f4f4; /* 侧边栏背景颜色 */
  position: fixed; /* 固定在左边 */
  left: 0; /* 靠左对齐 */
  top: 0; /* 靠上对齐 */
  overflow-y: auto; /* 允许垂直滚动 */
}

.main-content {
  position: relative;
  width: calc(100vw - 40rpx);
	height: 100vh;
  background-color: #f3f4f9;
}

.main-content.no-sidebar {
  margin-left: 0; /* 当隐藏 sidebar 时，移除左边距 */
}
</style>
