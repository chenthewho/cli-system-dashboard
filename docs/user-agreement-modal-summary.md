# UserAgreementModal 组件说明

## 当前状态

平板端的 `UserAgreementModal` 组件已经优化为**简洁紧凑风格**。

## 组件特点

### 🎨 简洁设计
- 纯白色背景，无渐变
- 细线分隔（1rpx）
- 柔和阴影
- 紧凑间距

### 📏 尺寸规格

#### **弹窗整体**
- 宽度：580rpx
- 最大高度：80vh
- 圆角：16rpx
- 阴影：0 4rpx 24rpx rgba(0, 0, 0, 0.1)

#### **头部区域**
- 内边距：16rpx 20rpx 12rpx
- 背景：纯白色 #ffffff
- 边框：1rpx solid #e5e7eb

**头部元素：**
- 🔒 图标：32rpx
- 标题：24rpx，字重 600
- 副标题：18rpx，颜色 #9ca3af
- 关闭按钮：36rpx × 36rpx
- 关闭图标：28rpx

#### **内容区域**
- 最大高度：850rpx
- 内边距：12rpx 20rpx
- 区块间距：20rpx
- 段落间距：8rpx

**内容字体：**
- 区块标题：22rpx，字重 600
- 重要文本：20rpx，字重 600
- 正文段落：19rpx，行高 1.6

#### **底部按钮区域**
- 内边距：12rpx 20rpx
- 按钮高度：56rpx
- 按钮圆角：28rpx
- 按钮字体：22rpx
- 按钮间距：10rpx

### 🎯 空间分配

```
┌─────────────────────────┐
│  头部 (~40rpx)          │ ← 16+12+12
├─────────────────────────┤
│                         │
│                         │
│  内容区域 (850rpx)      │ ← 最大高度
│                         │
│                         │
├─────────────────────────┤
│  按钮区 (~68rpx)        │ ← 12+56+12
└─────────────────────────┘
```

### 📱 内容结构

1. **📋 用户服务协议**
   - 5 条基本规则
   - 简洁明了

2. **🔐 隐私政策详情**（浅灰背景）
   - 服务主体信息
   - 信息收集类型
   - 信息使用目的
   - OAID 说明
   - 信息存储和保护
   - 用户权利
   - 账号注销说明
   - 信息共享

3. **📞 联系我们**
   - 客服系统
   - 邮箱：znjserver@qq.com
   - 电话：400-789-4668

### 🎨 配色方案

| 元素 | 颜色 | 说明 |
|------|------|------|
| 主标题 | #1f2937 | 深灰色 |
| 副标题 | #9ca3af | 中灰色 |
| 正文 | #4b5563 | 灰色 |
| 重要文本 | #374151 | 深灰色 |
| 边框 | #e5e7eb | 浅灰色 |
| 背景（隐私） | #f9fafb | 极浅灰 |
| 按钮（拒绝） | #f3f4f6 | 浅灰色 |
| 按钮（同意） | #10b981 → #059669 | 绿色渐变 |

### ✨ 交互效果

- **关闭按钮**：点击时背景变为 #f3f4f6
- **拒绝按钮**：点击时背景变为 #e5e7eb
- **同意按钮**：点击时透明度 0.9 + 下移 1rpx
- **所有按钮**：0.2s 过渡动画

### 📊 优化对比

| 项目 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| 头部高度 | ~60rpx | ~40rpx | ↓ 33% |
| 内容高度 | 750rpx | 850rpx | ↑ 13% |
| 底部高度 | ~80rpx | ~68rpx | ↓ 15% |
| 标题字体 | 30rpx | 24rpx | ↓ 20% |
| 按钮高度 | 76rpx | 56rpx | ↓ 26% |

### 🔧 使用方式

```vue
<template>
  <UserAgreementModal
    :visible="showAgreementModal"
    :show-buttons="true"
    @agree="onAgreementAgree"
    @disagree="onAgreementDisagree"
    @close="onAgreementModalClose"
  />
</template>

<script>
import UserAgreementModal from '@/components/UserAgreementModal.vue'

export default {
  components: {
    UserAgreementModal,
  },
  data() {
    return {
      showAgreementModal: false,
      privacyChecked: false,
    }
  },
  methods: {
    showPrivacyAgreement() {
      this.showAgreementModal = true
    },
    onAgreementAgree(data) {
      // data = { privacy: true, userTerms: true }
      this.privacyChecked = true
      this.showAgreementModal = false
    },
    onAgreementDisagree() {
      this.privacyChecked = false
      this.showAgreementModal = false
    },
    onAgreementModalClose() {
      this.showAgreementModal = false
    },
  },
}
</script>
```

### 📝 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 控制弹窗显示/隐藏 |
| showButtons | Boolean | true | 是否显示同意/不同意按钮 |

### 📤 Events

| 事件 | 参数 | 说明 |
|------|------|------|
| agree | { privacy: true, userTerms: true } | 用户点击"同意并继续" |
| disagree | - | 用户点击"不同意" |
| close | - | 用户点击关闭按钮 |

## 设计原则

1. **简洁至上** - 去除不必要的装饰
2. **内容优先** - 最大化内容显示区域
3. **易读性** - 合适的字体大小和行高
4. **一致性** - 统一的间距和配色
5. **响应性** - 适配不同屏幕尺寸

## 最佳实践

1. **头部**：保持简洁，只显示必要信息
2. **内容**：使用清晰的层级结构
3. **按钮**：明确的操作引导
4. **颜色**：使用中性色系，绿色作为强调
5. **间距**：紧凑但不拥挤

## 更新日志

### v2.0 - 简洁紧凑版
- ✅ 缩小头部区域 33%
- ✅ 增大内容区域 13%
- ✅ 缩小按钮区域 15%
- ✅ 优化字体大小
- ✅ 简化配色方案
- ✅ 移除渐变背景
- ✅ 增加内容可读性

### v1.0 - 初始版本
- 基础功能实现
- 完整的协议内容
- 双按钮操作
