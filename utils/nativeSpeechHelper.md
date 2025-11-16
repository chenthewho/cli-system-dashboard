# 原生语音播报使用指南

基于 `MT-TTS-Speech` 原生插件的语音播报工具，提供简洁易用的API。

## 使用方式

### 方式一：通过全局挂载使用（推荐）

在 `index.vue` 中已经将语音插件挂载到全局 `uni.$TTSSpeech`，其他页面可以直接使用：

```javascript
// 在任何页面中直接使用
export default {
  methods: {
    // 播报文本
    speakGoodName(goodName) {
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.speak(
          {
            text: goodName,
            speed: 1.0,
            volume: 1.0,
          },
          result => {
            if (result.success) {
              console.log('播报成功')
            } else {
              console.error('播报失败:', result.message)
            }
          }
        )
      }
    },

    // 停止播报
    stopSpeaking() {
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.stop()
      }
    },
  },
}
```

### 方式二：通过工具类使用

导入封装好的工具类：

```javascript
import { speakText, stopSpeech, initNativeSpeech } from '@/utils/nativeSpeechHelper.js'

export default {
  mounted() {
    // 初始化语音插件
    initNativeSpeech()
  },

  methods: {
    // 播报商品名称
    handleGoodClick(good) {
      speakText(good.name, {
        speed: 1.2, // 语速
        volume: 0.8, // 音量
      })
        .then(() => {
          console.log('播报成功')
        })
        .catch(error => {
          console.error('播报失败:', error)
        })
    },

    // 停止播报
    handleStop() {
      stopSpeech()
    },
  },
}
```

### 方式三：通过父组件方法调用

在 `index.vue` 中提供了 `speakText` 和 `stopSpeech` 方法，子组件可以通过 `$parent` 调用：

```javascript
// 在子组件中
export default {
  methods: {
    speakGoodName(text) {
      if (this.$parent && this.$parent.speakText) {
        this.$parent
          .speakText(text, {
            speed: 1.0,
            volume: 1.0,
          })
          .then(() => {
            console.log('播报成功')
          })
          .catch(error => {
            console.error('播报失败:', error)
          })
      }
    },
  },
}
```

## API 参数

### speak 方法参数

```javascript
{
  text: String,      // 必填：要播报的文本
  speed: Number,     // 可选：语速 (0.1-3.0)，默认 1.0
  volume: Number,    // 可选：音量 (0.0-1.0)，默认 1.0
  pitch: Number      // 可选：音调 (0.5-2.0)，默认 1.0
}
```

### 回调结果

```javascript
{
  success: Boolean,  // 是否成功
  message: String    // 错误信息（失败时）
}
```

## 使用场景示例

### 1. 收银页面播报商品

```javascript
// pages/cashier/cashier.vue
export default {
  methods: {
    handleClick(commodity) {
      // 添加商品到购物车
      this.goodSelect.push(commodity)

      // 播报商品名称
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.speak(
          {
            text: commodity.name,
            speed: 1.0,
          },
          result => {
            if (!result.success) {
              console.error('播报失败:', result.message)
            }
          }
        )
      }
    },
  },
}
```

### 2. 结算时播报金额

```javascript
// 结算页面
export default {
  methods: {
    checkout() {
      const totalAmount = this.calculateTotal()

      // 播报总金额
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.speak(
          {
            text: `总计${totalAmount}元，请支付`,
            speed: 0.9,
            volume: 1.0,
          },
          result => {
            if (result.success) {
              console.log('金额播报成功')
            }
          }
        )
      }
    },
  },
}
```

### 3. 支付结果播报

```javascript
export default {
  methods: {
    onPaymentSuccess() {
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.speak(
          {
            text: '支付成功，感谢您的购买',
            speed: 1.0,
          },
          result => {
            if (result.success) {
              // 播报完成后的处理
              this.resetOrder()
            }
          }
        )
      }
    },

    onPaymentFailed() {
      if (uni.$TTSSpeech) {
        uni.$TTSSpeech.speak({
          text: '支付失败，请重试',
          speed: 1.0,
        })
      }
    },
  },
}
```

### 4. 库存警告播报

```javascript
export default {
  methods: {
    checkStock(commodity) {
      if (commodity.stock < 10) {
        if (uni.$TTSSpeech) {
          uni.$TTSSpeech.speak({
            text: `${commodity.name}库存不足，剩余${commodity.stock}件`,
            speed: 1.1,
          })
        }
      }
    },
  },
}
```

### 5. 条件播报控制

```javascript
export default {
  data() {
    return {
      speechEnabled: true, // 语音播报开关
    }
  },

  methods: {
    speakIfEnabled(text) {
      if (this.speechEnabled && uni.$TTSSpeech) {
        uni.$TTSSpeech.speak({
          text: text,
          speed: 1.0,
        })
      }
    },

    toggleSpeech() {
      this.speechEnabled = !this.speechEnabled

      if (!this.speechEnabled && uni.$TTSSpeech) {
        // 禁用时停止当前播报
        uni.$TTSSpeech.stop()
      }
    },
  },
}
```

## 错误处理

```javascript
export default {
  methods: {
    safeSpeak(text) {
      try {
        if (uni.$TTSSpeech) {
          uni.$TTSSpeech.speak(
            {
              text: text,
            },
            result => {
              if (!result.success) {
                console.error('语音播报失败:', result.message)
                // 可以显示静默提示或记录日志
                uni.showToast({
                  title: '语音播报失败',
                  icon: 'none',
                  duration: 1000,
                })
              }
            }
          )
        } else {
          console.warn('语音插件未初始化')
        }
      } catch (error) {
        console.error('语音播报异常:', error)
      }
    },
  },
}
```

## 最佳实践

1. **检查插件可用性**：使用前先检查 `uni.$TTSSpeech` 是否存在
2. **错误处理**：始终处理播报失败的情况
3. **用户控制**：提供开关让用户控制是否启用语音播报
4. **适当的语速**：根据内容调整语速，重要信息可以稍慢
5. **避免频繁播报**：防止多个播报同时进行造成混乱

## 注意事项

- 语音插件需要在真机环境下测试
- 确保设备音量已打开
- 长文本播报可能需要分段处理
- 在页面切换时考虑停止当前播报

## 调试技巧

```javascript
// 检查插件状态
console.log('语音插件状态:', !!uni.$TTSSpeech)

// 测试播报
if (uni.$TTSSpeech) {
  uni.$TTSSpeech.speak(
    {
      text: '测试语音播报',
    },
    result => {
      console.log('播报结果:', result)
    }
  )
}
```
