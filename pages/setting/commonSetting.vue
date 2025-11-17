<template>
  <view class="page-wrapper">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="back">
        <uni-icons custom-prefix="iconfont" type="icon-fanhui" size="18" color="#666"></uni-icons>
        <text>返回</text>
      </view>
      <view class="header-title">商户信息</view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 商户信息卡片 -->
      <view class="info-card">
        <view class="card-title">基本信息</view>

        <view class="form-item">
          <text class="form-label">商家名称</text>
          <input class="form-input" type="text" placeholder="请输入商家名称" v-model="baseFormData.companyName" />
        </view>

        <view class="form-item">
          <text class="form-label">地址</text>
          <input class="form-input" type="text" placeholder="请输入地址" v-model="baseFormData.address" />
        </view>

        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input class="form-input" type="text" placeholder="请输入联系电话" v-model="baseFormData.contact" />
        </view>
      </view>

      <!-- 按钮组 -->
      <view class="button-group">
        <button class="save-btn" @click="submit">保存信息</button>
        <button class="logout-btn" @click="logout">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script>
import cashierOrder from '../../api/cashier/cashierOrder'
export default {
  data() {
    return {
      currentCompanyId: '',
      baseFormData: {},
    }
  },
  created() {
    this.currentCompanyId = uni.getStorageSync('companyId')
    this.getStoreInfo()
  },
  methods: {
    back() {
      uni.setStorageSync('refreshCompanyInfo', 'true')
      uni.navigateBack({
        delta: 1, // 返回上一级页面，默认值是1
      })
    },
    logout() {
      getApp().logout()
    },
    getStoreInfo() {
      cashierOrder.getStoreInfo(this.currentCompanyId).then(res => {
        this.baseFormData = {
          companyName: res.data.companyName,
          address: res.data.address,
          contact: res.data.contact,
        }
        this.baseFormData.id = this.currentCompanyId
      })
    },
    submit() {
      cashierOrder.updateStoreInfo(this.baseFormData).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: '修改成功',
            icon: 'none',
          })
          uni.setStorageSync('companyName', this.baseFormData.companyName)
        } else {
          uni.showToast({
            title: '修改失败',
            icon: 'none',
          })
        }
      })
    },
  },
}
</script>

<style scoped>
/* 页面容器 */
.page-wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.back-btn {
  position: absolute;
  left: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 内容区域 */
.content {
  padding: 20px;
}

/* 信息卡片 */
.info-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

/* 表单项 */
.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 15px;
  font-size: 14px;
  color: #333;
  background-color: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-input:focus {
  background-color: #fff;
  border-color: #4caf50;
  outline: none;
}

/* 按钮组 */
.button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.logout-btn {
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}
</style>
