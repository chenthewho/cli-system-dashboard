# UserAgreementModal 蓝牙权限使用说明

## 功能概述

`UserAgreementModal` 组件现已支持蓝牙权限的开关控制，用户可以在同意用户协议时选择是否授权蓝牙权限。

## 新增功能

### 1. 蓝牙权限说明

在隐私政策详情中新增了两个部分：

#### **信息收集类型**
```
• 蓝牙权限：用于连接蓝牙打印机等外设，您可以随时关闭此权限
```

#### **关于蓝牙权限的说明**
- 蓝牙权限用于连接蓝牙打印机、扫码枪等外部设备
- 我们不会通过蓝牙收集您的个人隐私信息
- 蓝牙功能仅在您主动使用打印等功能时启用
- 您可以在应用设置中随时开启或关闭蓝牙权限
- 关闭蓝牙权限后，将无法使用蓝牙打印机等外设功能

### 2. 蓝牙权限开关

在内容区域和按钮区域之间新增了权限控制区域，包含：
- **权限标签**：蓝牙权限
- **权限描述**：用于连接打印机等外设
- **开关按钮**：可实时切换蓝牙权限状态

## 使用方法

### 基础用法

```vue
<template>
  <view>
    <button @click="showAgreement">显示用户协议</button>
    
    <UserAgreementModal
      :visible="agreementVisible"
      :show-buttons="true"
      @agree="handleAgree"
      @disagree="handleDisagree"
      @close="handleClose"
      @bluetooth-change="handleBluetoothChange"
    />
  </view>
</template>

<script>
import UserAgreementModal from '@/components/UserAgreementModal.vue'

export default {
  components: {
    UserAgreementModal,
  },
  data() {
    return {
      agreementVisible: false,
      bluetoothPermission: true,
    }
  },
  methods: {
    showAgreement() {
      this.agreementVisible = true
    },
    
    handleAgree(data) {
      console.log('用户同意协议', data)
      // data = {
      //   privacy: true,
      //   userTerms: true,
      //   bluetoothEnabled: true/false
      // }
      
      // 保存蓝牙权限设置
      this.bluetoothPermission = data.bluetoothEnabled
      uni.setStorageSync('bluetoothPermission', data.bluetoothEnabled)
      
      this.agreementVisible = false
    },
    
    handleDisagree() {
      console.log('用户拒绝协议')
      this.agreementVisible = false
    },
    
    handleClose() {
      console.log('用户关闭弹窗')
      this.agreementVisible = false
    },
    
    handleBluetoothChange(enabled) {
      console.log('蓝牙权限状态变化:', enabled)
      // 实时响应蓝牙权限变化
      this.bluetoothPermission = enabled
    },
  },
}
</script>
```

### 在打印功能中使用

```javascript
methods: {
  async printReceipt() {
    // 检查蓝牙权限
    const bluetoothPermission = uni.getStorageSync('bluetoothPermission')
    
    if (!bluetoothPermission) {
      uni.showModal({
        title: '提示',
        content: '您已关闭蓝牙权限，无法使用打印功能。是否前往设置开启？',
        success: (res) => {
          if (res.confirm) {
            // 跳转到设置页面
            uni.navigateTo({
              url: '/pages/settings/index'
            })
          }
        }
      })
      return
    }
    
    // 执行打印操作
    try {
      await this.connectBluetoothPrinter()
      await this.sendPrintData()
      uni.showToast({
        title: '打印成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('打印失败:', error)
      uni.showToast({
        title: '打印失败',
        icon: 'none'
      })
    }
  },
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 控制弹窗显示/隐藏 |
| showButtons | Boolean | true | 是否显示同意/不同意按钮 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| agree | `{ privacy: Boolean, userTerms: Boolean, bluetoothEnabled: Boolean }` | 用户点击"同意并继续"，返回协议状态和蓝牙权限状态 |
| disagree | - | 用户点击"不同意" |
| close | - | 用户点击关闭按钮 |
| bluetooth-change | `Boolean` | 蓝牙权限开关状态变化时触发 |

## Data

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| bluetoothEnabled | Boolean | true | 蓝牙权限开关状态 |

## 样式说明

### 权限控制区域样式

```scss
.permission-control {
  padding: 12rpx 20rpx;
  background: #f9fafb;        // 浅灰背景
  border-top: 1rpx solid #e5e7eb;
}

.permission-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.permission-label {
  font-size: 20rpx;
  font-weight: 500;
  color: #1f2937;             // 深灰色
}

.permission-desc {
  font-size: 18rpx;
  color: #9ca3af;             // 中灰色
}

.permission-switch {
  transform: scale(0.85);     // 缩小开关尺寸
}
```

## 布局结构

```
┌─────────────────────────┐
│  头部 (~40rpx)          │
├─────────────────────────┤
│                         │
│  内容区域 (850rpx)      │
│  - 用户服务协议         │
│  - 隐私政策详情         │
│    • 蓝牙权限说明 ✨    │
│  - 联系我们             │
│                         │
├─────────────────────────┤
│  权限控制 (~44rpx) ✨   │
│  [蓝牙权限]    [开关]   │
├─────────────────────────┤
│  按钮区 (~52rpx)        │
│  [不同意] [同意并继续]  │
└─────────────────────────┘
```

## 最佳实践

### 1. 初始化时检查权限

```javascript
onLoad() {
  // 检查是否已同意协议
  const hasAgreed = uni.getStorageSync('hasAgreedTerms')
  const bluetoothPermission = uni.getStorageSync('bluetoothPermission')
  
  if (!hasAgreed) {
    // 显示用户协议
    this.agreementVisible = true
  } else {
    // 加载蓝牙权限设置
    this.bluetoothPermission = bluetoothPermission !== false
  }
}
```

### 2. 提供权限管理页面

```vue
<!-- pages/settings/index.vue -->
<template>
  <view class="settings-page">
    <view class="setting-item">
      <text class="setting-label">蓝牙权限</text>
      <switch
        :checked="bluetoothPermission"
        @change="handleBluetoothToggle"
        color="#10b981"
      />
    </view>
    
    <view class="setting-tip">
      关闭后将无法使用蓝牙打印机等外设功能
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bluetoothPermission: true,
    }
  },
  onLoad() {
    this.bluetoothPermission = uni.getStorageSync('bluetoothPermission') !== false
  },
  methods: {
    handleBluetoothToggle(e) {
      this.bluetoothPermission = e.detail.value
      uni.setStorageSync('bluetoothPermission', e.detail.value)
      
      uni.showToast({
        title: e.detail.value ? '已开启蓝牙权限' : '已关闭蓝牙权限',
        icon: 'none'
      })
    },
  },
}
</script>
```

### 3. 动态提示用户

```javascript
methods: {
  checkBluetoothPermission() {
    const bluetoothPermission = uni.getStorageSync('bluetoothPermission')
    
    if (bluetoothPermission === false) {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: '蓝牙权限已关闭',
          content: '使用打印功能需要开启蓝牙权限，是否立即开启？',
          confirmText: '去开启',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 开启权限
              uni.setStorageSync('bluetoothPermission', true)
              resolve(true)
            } else {
              reject(new Error('用户拒绝开启蓝牙权限'))
            }
          }
        })
      })
    }
    
    return Promise.resolve(true)
  },
  
  async handlePrint() {
    try {
      await this.checkBluetoothPermission()
      // 执行打印
      await this.doPrint()
    } catch (error) {
      console.log('打印取消:', error.message)
    }
  },
}
```

## 注意事项

1. **默认状态**：蓝牙权限默认为开启状态（`bluetoothEnabled: true`）
2. **持久化存储**：建议使用 `uni.setStorageSync` 保存用户的权限选择
3. **实时响应**：通过 `@bluetooth-change` 事件可以实时响应权限变化
4. **用户体验**：在需要使用蓝牙功能时，应提前检查权限并给予友好提示
5. **权限恢复**：提供设置页面让用户可以随时修改权限状态

## 更新日志

### v2.1 - 蓝牙权限支持
- ✅ 新增蓝牙权限说明文案
- ✅ 新增权限控制区域和开关
- ✅ 新增 `bluetoothEnabled` 数据字段
- ✅ 新增 `bluetooth-change` 事件
- ✅ 优化 `agree` 事件返回数据结构
- ✅ 新增权限控制区域样式

### v2.0 - 简洁紧凑版
- 缩小头部和按钮区域
- 增大内容显示区域
- 优化字体和间距
