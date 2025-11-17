<template>
  <view class="page-wrapper">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @click="back">
        <uni-icons custom-prefix="iconfont" type="icon-fanhui" size="18" color="#666"></uni-icons>
        <text>返回</text>
      </view>
      <view class="header-title">操作设置</view>
    </view>

    <!-- 设置内容区域 -->
    <view class="settings-content">
      <view class="settings-card">
        <!-- 收款打印设置 -->
        <view class="setting-item">
          <view class="setting-label">
            <text class="label-text">收款打印</text>
            <text class="label-desc">开启后收款时自动打印小票</text>
          </view>
          <view class="setting-control">
            <view class="toggle-group">
              <view
                class="toggle-btn"
                :class="{ active: !comapnySetting.settingInfo._fixedPayPrint }"
                @click="comapnySetting.settingInfo._fixedPayPrint = false"
              >
                关闭
              </view>
              <view
                class="toggle-btn"
                :class="{ active: comapnySetting.settingInfo._fixedPayPrint }"
                @click="comapnySetting.settingInfo._fixedPayPrint = true"
              >
                开启
              </view>
            </view>
          </view>
        </view>

        <!-- 分割线 -->
        <view class="divider"></view>

        <!-- 提示音设置 -->
        <view class="setting-item">
          <view class="setting-label">
            <text class="label-text">提示音</text>
            <text class="label-desc">开启后操作时播放提示音</text>
          </view>
          <view class="setting-control">
            <view class="toggle-group">
              <view
                class="toggle-btn"
                :class="{ active: !comapnySetting.settingInfo._soundEnabled }"
                @click="comapnySetting.settingInfo._soundEnabled = false"
              >
                关闭
              </view>
              <view
                class="toggle-btn"
                :class="{ active: comapnySetting.settingInfo._soundEnabled }"
                @click="comapnySetting.settingInfo._soundEnabled = true"
              >
                开启
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-btn-wrapper">
        <button class="save-btn" @click="submit">保存设置</button>
      </view>
    </view>
  </view>
</template>

<script>
import setting from '../../api/setting/setting.js'
export default {
  data() {
    return {
      currentCompanyId: '',
      comapnySetting: {
        id: '',
        operatorId: '',
        settingInfo: {
          _fixedPayPrint: false,
          _soundEnabled: false,
          _fixedTareWeight: {
            action: false,
            value: 0,
          },
        },
      },
    }
  },
  created() {
    this.currentCompanyId = uni.getStorageSync('companyId')
    this.getSettingInfo()
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1, // 返回上一级页面，默认值是1
      })
    },
    getSettingInfo() {
      setting.GetByCompanyId(this.currentCompanyId).then(res => {
        if (res.code == 200 && res.data) {
          // 合并服务器数据，保留默认字段
          this.comapnySetting.id = res.data.id || ''
          this.comapnySetting.operatorId = res.data.operatorId || ''

          // 合并 settingInfo，确保新字段不会丢失
          if (res.data.settingInfo) {
            this.comapnySetting.settingInfo = Object.assign({}, this.comapnySetting.settingInfo, res.data.settingInfo)
          }
        }
      })
    },
    submit() {
      var userInfo = uni.getStorageSync('userInfo')
      this.comapnySetting.companyId = this.currentCompanyId
      this.comapnySetting.operatorId = userInfo.id
      this.comapnySetting.settingInfo._fixedTareWeight.value = parseFloat(
        this.comapnySetting.settingInfo._fixedTareWeight.value
      )

      console.log('comapnySetting', this.comapnySetting)

      setting.saveSetting(this.comapnySetting).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: '保存成功',
            icon: 'none',
          })
          // 合并服务器返回的数据，保留本地字段
          if (res.data) {
            this.comapnySetting.id = res.data.id || this.comapnySetting.id
            this.comapnySetting.operatorId = res.data.operatorId || this.comapnySetting.operatorId

            if (res.data.settingInfo) {
              this.comapnySetting.settingInfo = Object.assign({}, this.comapnySetting.settingInfo, res.data.settingInfo)
            }
          }
          // 保存完整的设置信息到本地存储
          uni.setStorageSync('companySetting', this.comapnySetting.settingInfo)

          // 同步更新全局设置
          if (uni.$companySetting) {
            uni.$companySetting.update(this.comapnySetting.settingInfo)
          }
        } else {
          uni.showToast({
            title: '保存失败',
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

/* 设置内容区域 */
.settings-content {
  padding: 20px;
}

.settings-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label-text {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.label-desc {
  font-size: 12px;
  color: #999;
}

.setting-control {
  flex-shrink: 0;
}

/* 切换按钮组 */
.toggle-group {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 3px;
}

.toggle-btn {
  padding: 6px 16px;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.toggle-btn.active {
  background-color: #fff;
  color: #333;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 分割线 */
.divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 0 20px;
}

/* 保存按钮 */
.save-btn-wrapper {
  margin-top: 20px;
  padding: 0 20px;
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
</style>
