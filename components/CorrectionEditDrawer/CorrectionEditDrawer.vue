<template>
  <div class="correction-drawer" v-if="visible">
    <div class="drawer-mask" @click="handleClose"></div>
    <div class="drawer-content">
      <div class="drawer-header">
        <uni-icons type="left" size="30" @click="handleClose"></uni-icons>
        <div class="good-name">{{ editingItem.correctCommodityName }}</div>
        <div style="width: 30px"></div>
      </div>

      <div class="drawer-body">
        <!-- 非定装：显示数量和重量 -->
        <div v-if="editingItem.saleWay === 1" class="input-section">
          <div :class="['custom-input', { 'input-focused': inputFocusedIndex === 1 }]" @click="focusInput(1)">
            <div class="input-label">盘点数量</div>
            <div class="input-value-container">
              <input
                ref="input_mount"
                class="input-field"
                type="text"
                inputmode="none"
                v-model="editingItem.correctMount"
              />
              <span class="currency-label">{{ editingItem.unit || '' }}</span>
            </div>
          </div>

          <div
            :class="['custom-input', { 'input-focused': inputFocusedIndex === 2 }]"
            @click="focusInput(2)"
            style="margin-top: 15rpx"
          >
            <div class="input-label">盘点重量</div>
            <div class="input-value-container">
              <input
                ref="input_weight"
                class="input-field"
                type="text"
                inputmode="none"
                v-model="editingItem.correctWeight"
              />
              <span class="currency-label">斤</span>
            </div>
          </div>
        </div>

        <!-- 散装：只显示重量 -->
        <div v-else-if="editingItem.saleWay === 4" class="input-section">
          <div :class="['custom-input', { 'input-focused': inputFocusedIndex === 2 }]" @click="focusInput(2)">
            <div class="input-label">盘点重量</div>
            <div class="input-value-container">
              <input
                ref="input_weight"
                class="input-field"
                type="text"
                inputmode="none"
                v-model="editingItem.correctWeight"
              />
              <span class="currency-label">斤</span>
            </div>
          </div>
        </div>

        <!-- 定装、拆包：只显示数量 -->
        <div v-else class="input-section">
          <div :class="['custom-input', { 'input-focused': inputFocusedIndex === 1 }]" @click="focusInput(1)">
            <div class="input-label">盘点数量</div>
            <div class="input-value-container">
              <input
                ref="input_mount"
                class="input-field"
                type="text"
                inputmode="none"
                v-model="editingItem.correctMount"
              />
              <span class="currency-label">{{ editingItem.unit || '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 键盘 -->
      <view class="keyboard-wrapper">
        <view class="keyboard-container">
          <view class="keyboard-row">
            <view class="key-item" @click="handleNumberClick(1)">1</view>
            <view class="key-item" @click="handleNumberClick(2)">2</view>
            <view class="key-item" @click="handleNumberClick(3)">3</view>
            <view class="key-item" @click="handleBackspace">
              <uni-icons custom-prefix="iconfont" type="icon-tuige" size="35" color="#ffffff"></uni-icons>
            </view>
          </view>
          <view class="keyboard-row">
            <view class="key-item" @click="handleNumberClick(4)">4</view>
            <view class="key-item" @click="handleNumberClick(5)">5</view>
            <view class="key-item" @click="handleNumberClick(6)">6</view>
            <view class="key-item" @click="handleNumberClick('+')">+</view>
          </view>
          <view class="keyboard-row">
            <view class="key-item" @click="handleNumberClick(7)">7</view>
            <view class="key-item" @click="handleNumberClick(8)">8</view>
            <view class="key-item" @click="handleNumberClick(9)">9</view>
            <view class="key-item" @click="handleNumberClick('-')">-</view>
          </view>
          <view class="keyboard-row">
            <view class="key-item key-zero" @click="handleNumberClick(0)">0</view>
            <view class="key-item" @click="handleNumberClick('.')">.</view>
            <view class="key-item key-confirm" @click="handleConfirm">确定</view>
          </view>
        </view>
      </view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CorrectionEditDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editingItem: {},
      inputFocusedIndex: 1, // 1: 数量, 2: 重量
    }
  },
  watch: {
    item: {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.editingItem = JSON.parse(JSON.stringify(newVal))
          // 确保 correctMount 有初始值
          if (!this.editingItem.correctMount) {
            this.editingItem.correctMount = '0'
          }
          // 确保 correctWeight 有初始值
          if (!this.editingItem.correctWeight) {
            this.editingItem.correctWeight = '0'
          }
          // 根据销售方式设置默认焦点
          if (this.editingItem.saleWay === 4) {
            // 散装默认聚焦重量
            this.inputFocusedIndex = 2
          } else {
            // 其他默认聚焦数量
            this.inputFocusedIndex = 1
          }
        }
      },
      deep: true,
      immediate: true,
    },
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // 根据销售方式设置默认焦点
          if (this.editingItem.saleWay === 4) {
            this.focusInput(2)
          } else {
            this.focusInput(1)
          }
        })
      }
    },
  },
  methods: {
    focusInput(index) {
      this.inputFocusedIndex = index
    },
    getSaleWayText(saleWay) {
      const saleWayMap = {
        1: '非定',
        2: '定装',
        3: '拆包',
        4: '散装',
      }
      return saleWayMap[saleWay] || '未知'
    },
    handleClose() {
      this.$emit('close')
    },
    handleNumberClick(val) {
      // TTS播报
      if (uni.$TTSSpeech) {
        try {
          uni.$TTSSpeech.speak({ text: val.toString() })
        } catch (error) {
          console.error('TTS播报失败:', error)
        }
      }

      // 根据当前焦点确定要编辑的字段
      const fieldName = this.inputFocusedIndex === 1 ? 'correctMount' : 'correctWeight'
      let currentValue = String(this.editingItem[fieldName] || '0')

      // 小数点重复检查
      if (val === '.' && currentValue.includes('.')) {
        return
      }

      // 运算符处理
      const isOperator = val === '+' || val === '-'
      if (isOperator) {
        if (currentValue === '0') {
          return
        }
        // 如果已包含运算符，先计算结果
        if (currentValue.includes('+') || currentValue.includes('-')) {
          try {
            const result = eval(currentValue)
            currentValue = String(result)
          } catch (e) {
            currentValue = String(parseFloat(currentValue) || 0)
          }
        }
        this.editingItem[fieldName] = currentValue + val
        return
      }

      // 数字输入
      let txt = currentValue === '0' && val !== '.' ? '' : currentValue
      this.editingItem[fieldName] = txt + val
    },
    handleBackspace() {
      // 根据当前焦点确定要编辑的字段
      const fieldName = this.inputFocusedIndex === 1 ? 'correctMount' : 'correctWeight'
      let currentValue = String(this.editingItem[fieldName] || '0')

      if (currentValue === '' || currentValue === '0') {
        return
      }

      let newValue = currentValue.slice(0, -1)
      this.editingItem[fieldName] = newValue === '' ? '0' : newValue
    },
    handleConfirm() {
      // 计算表达式
      const safeEval = expr => {
        try {
          return eval(expr)
        } catch (e) {
          return parseFloat(expr) || 0
        }
      }

      // 计算数量和重量的表达式
      this.editingItem.correctMount = safeEval(this.editingItem.correctMount)
      if (this.editingItem.correctWeight !== undefined) {
        this.editingItem.correctWeight = safeEval(this.editingItem.correctWeight)
      }

      // 触发确认事件
      this.$emit('confirm', this.editingItem)
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.correction-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
}

.drawer-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-out;
}

.drawer-content {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease-out;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15rpx 20rpx;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}

.good-name {
  flex: 1;
  font-size: 18rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.drawer-body {
  flex: 2;
  padding: 20rpx;
  overflow-y: auto;
}

.input-section {
  margin-bottom: 30rpx;
}

.custom-input {
  padding: 15rpx;
  border: 2px solid #d9d9d9;
  border-radius: 8rpx;
  transition: all 0.2s;
  cursor: pointer;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-focused {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 0 0 3rpx rgba(24, 144, 255, 0.2);
}

.input-label {
  font-size: 14rpx;
  color: #666;
  margin-right: 10rpx;
  white-space: nowrap;
}

.input-value-container {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.input-field {
  border: none;
  background: transparent;
  outline: none;
  text-align: right;
  font-size: 20rpx;
  font-weight: bold;
  color: #333;
  width: 100%;
}

.currency-label {
  font-size: 14rpx;
  color: #8c8c8c;
  margin-left: 8rpx;
  white-space: nowrap;
}

.info-section {
  padding: 15rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
  font-size: 14rpx;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: bold;
}

.keyboard-wrapper {
  height: 350px;
  flex-shrink: 0;
  padding: 10rpx;
  background: #f0f0f0;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.keyboard-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rpx;
  height: 100%;
}

.keyboard-row {
  display: flex;
  gap: 3rpx;
  flex: 1;
}

.key-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5a5a5a;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: bold;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
  user-select: none;
}

.key-item:active {
  opacity: 0.8;
  transform: scale(0.96);
  background: #4a4a4a;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

.key-zero {
  flex: 2.06;
}

.key-confirm {
  background: #52c41a !important;
}

.key-confirm:active {
  background: #389e0d !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
