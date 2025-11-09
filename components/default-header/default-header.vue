<template>
  <div class="header">
    <div class="header-theme" :class="theme">
      <div class="header-container">
        <!-- <div
          v-if="showManageBtn"
          class="btn btn-manage"
          @click="goToManagement"
          style="margin-right: auto; margin-left: 5px"
        >
          <u-icon name="grid-fill" size="18" color="#fff" style="margin-right: 5rpx"></u-icon>
          <span>管理</span>
        </div> -->
        <div class="company-name-container">
          <div class="menu-item company-menu-item">
            <span class="company-name-text" @click="turnToCommonSetting">
              {{ currentCompanyName }}
            </span>
            <div class="company-switcher" @click="showCompanySwitcher">
              <u-icon name="arrow-down" size="16" color="#666"></u-icon>
            </div>
          </div>
        </div>
        <div
          class="menu-item last-order-container"
          v-if="lastOrder"
          @click="showLastModel"
        >
          <span class="last-order-icon">
            <u-icon name="file-text" color="#fba903" size="28"></u-icon>
          </span>
          <span class="last-order-text">上一张订单: {{ lastOrder.accountCode }}</span>
          <span class="last-order-text last-order-customer"
            >顾客:
            {{ lastOrder.customName != null && lastOrder.customName != '' ? lastOrder.customName : '散客' }}</span
          >
          <span class="last-order-text last-order-amount">金额: {{ lastOrder.payableAmount }}</span>
        </div>
        <div class="btn btn-primary-plain btn-submit hang-order-btn" @click="showHangList">
          挂单中心
        </div>
      </div>
    </div>
    <u-modal
      title="订单详情"
      :show="lastModelSHOW"
      :closeOnClickOverlay="true"
      @close="lastModelSHOW = false"
      :showConfirmButton="false"
      :width="'600px'"
    ></u-modal>

    <!-- 商家切换弹窗 -->
    <u-modal
      title="选择商家"
      :show="showCompanyList"
      @close="closeCompanyList"
      :closeOnClickOverlay="true"
      :showConfirmButton="false"
      width="400rpx"
    >
      <div class="company-list">
        <div v-for="company in companyList" :key="company.id" class="company-item" @click="switchCompany(company)">
          <div class="company-info">
            <u-icon name="home" size="25" color="#409EFF" class="company-icon"></u-icon>
            <span>{{ company.name }}</span>
          </div>
          <u-icon v-if="company.name === currentCompanyName" name="checkmark" size="16" color="#67C23A"></u-icon>
        </div>
      </div>
    </u-modal>

    <div class="horizontal-line"></div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light',
    },
    lastOrder: {
      type: Object,
      default: null,
    },
    showManageBtn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentTime: this.getCurrentTime(),
      currentCompanyName: '',
      lastModelSHOW: false,
      showCompanyList: false,
      companyList: [],
      interval: null,
    }
  },
  created() {
    this.currentCompanyName = uni.getStorageSync('companyName')
    this.loadCompanyList()
  },
  mounted() {
    this.updateTime() // 组件挂载时更新一次时间
    this.interval = setInterval(this.updateTime, 1000) // 每秒更新一次时间
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval) // 清除定时器
    }
  },
  goIndex() {
    uni.navigateTo({
      url: '/pages/cashier/cashier',
    })
  },
  methods: {
    refresh() {
      this.currentCompanyName = uni.getStorageSync('companyName')
    },
    goToManagement() {
      this.$emit('goToManagement')
    },
    showLastModel() {
      this.$emit('showlastOrder')
    },
    showHangList() {
      this.$emit('showHangList')
    },
    getCurrentTime() {
      const now = new Date()
      let hours = now.getHours() // 获取小时，不进行补零
      let minutes = now.getMinutes().toString().padStart(2, '0') // 获取分钟并补零
      return `${hours}:${minutes}` // 返回格式化后的时间
    },
    updateTime() {
      this.currentTime = this.getCurrentTime() // 更新当前时间
    },
    turnToCommonSetting() {
      uni.navigateTo({
        url: '/pages/setting/commonSetting',
      })
    },
    showCompanySwitcher() {
      this.loadCompanyList()
      this.showCompanyList = true
    },
    loadCompanyList() {
      // 从本地存储获取用户的商家列表
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo && userInfo.companies) {
        this.companyList = userInfo.companies
      } else {
        // 如果没有商家列表，可以从API获取
        this.getCompanyListFromAPI()
      }
    },
    async getCompanyListFromAPI() {
      try {
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo && userInfo.id) {
          const res = await uni.$u.http.get(`/Company/GetByUserId?id=${userInfo.id}`)
          if (res.data && Array.isArray(res.data)) {
            console.log('res.data', res.data)
            this.companyList = res.data.map(item => ({
              id: item.id,
              name: item.companyName,
              vesionType: item.vesionType,
            }))
          }
        }
      } catch (error) {
        console.error('获取商家列表失败:', error)
        uni.showToast({
          title: '获取商家列表失败',
          icon: 'none',
        })
      }
    },
    switchCompany(company) {
      console.log('company', company)
      // 检查是否切换到相同商家
      const currentCompanyId = uni.getStorageSync('companyId')
      if (currentCompanyId === company.id) {
        this.showCompanyList = false
        return
      }

      // 切换商家
      uni.setStorageSync('companyId', company.id)
      uni.setStorageSync('companyName', company.name)
      uni.setStorageSync('vesionType', company.vesionType)
      this.currentCompanyName = company.name
      this.showCompanyList = false

      // 发送事件通知父组件商家已切换
      this.$emit('companyChanged', company)

      // 显示切换成功提示并刷新页面
      uni.showToast({
        title: `已切换至：${company.name}`,
        icon: 'success',
        duration: 1500,
      })

      // 延迟刷新当前页面以加载新商家的数据
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/index/index',
        })
      }, 1500)
    },
    closeCompanyList() {
      this.showCompanyList = false
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 3;
  top: 0;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);

  .header-theme.light {
    background: #ffffff !important;
    color: #606266 !important;
  }

  .header-theme.dark {
    background-color: rgba(37, 38, 40, 0.21);
    background-image: radial-gradient(circle at 25%, hsla(0, 0%, 100%, 0.2), rgba(50, 50, 50, 0.2) 80%);
    backdrop-filter: blur(14px);
    color: #ffffff !important;
  }

  .header-container {
    display: flex;
    flex-flow: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    padding-left: 0px;
    font-size: 16px;
    height: 60px;
  }

  .menu-item {
    cursor: pointer;
  }

  // 公司名称容器
  .company-name-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
  }

  // 公司菜单项
  .company-menu-item {
    display: flex;
    align-items: center;
    gap: 15rpx;
  }

  // 公司名称文本
  .company-name-text {
    color: #000000;
    font-size: 18rpx;
    font-weight: bold;
    cursor: pointer;
  }

  // 公司切换器
  .company-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e8e8e8;
      border-color: #d0d0d0;
    }
  }

  // 上一张订单容器
  .last-order-container {
    margin-right: 5rpx;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  // 上一张订单图标
  .last-order-icon {
    margin-right: 5rpx;
    display: flex;
    align-items: center;
  }

  // 上一张订单文本
  .last-order-text {
    color: $zn-main-act-color;
    font-size: 14px;
  }

  .last-order-customer {
    margin-left: 25rpx;
  }

  .last-order-amount {
    margin-left: 25rpx;
  }

  // 挂单中心按钮
  .hang-order-btn {
    font-weight: bold;
    box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
    height: 25rpx;
  }
}

.horizontal-line {
  height: 1px;
  /* 横线的高度 */
  background-color: $m-border-color;
  /* 横线的颜色 */
  margin-top: 0px;
  /* 横线与上方内容的间距 */
}

.company-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.company-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }

  &:last-child {
    border-bottom: none;
  }

  .company-info {
    display: flex;
    align-items: center;
    font-size: 14rpx;

    .company-icon {
      margin-right: 10rpx;
    }
  }
}

.btn-manage {
  display: flex;
  align-items: center;
  padding: 8rpx 6rpx;
  background-color: #409eff;
  color: white;
  border-radius: 4rpx;
  cursor: pointer;
  font-weight: bold;
  font-size: 14rpx;
  transition: all 0.3s;
  box-shadow: 0 2rpx 5rpx rgba(64, 158, 255, 0.3);

  &:hover {
    background-color: #66b1ff;
    transform: translateY(-1rpx);
    box-shadow: 0 4rpx 8rpx rgba(64, 158, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
