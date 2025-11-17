<template>
  <div id="app">
    <Sidebar ref="sidebarRef" @update-content="updateCashierContent" />
    <div class="main-content" :class="{ 'no-sidebar': cashierContent === 'one' }">
      <Cashier v-show="cashierContent === 'one'" ref="cashierRef" @goToManagement="switchToManagement" />
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
import companySetting from '@/utils/companySetting.js'

// 声明语音插件，供全局使用
const TTSSpeech = uni.requireNativePlugin('MT-TTS-Speech')

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
      this.$refs.cashierRef.refreshHeaderInfo()
      uni.removeStorageSync('refreshCompanyInfo')
    }
    plus.navigator.setFullscreen(true)
    //隐藏虚拟按键
    plus.navigator.hideSystemNavigation()
    console.log('vesionType', this.vesionType)
  },
  mounted() {
    // this.$refs.cashierRef.onLoadMethod();
    this.initTTSSpeech()
    this.initCompanySetting()
  },

  onUnload() {
    // 页面卸载时销毁TTS
    if (TTSSpeech) {
      TTSSpeech.destroy()
    }
  },
  methods: {
    // 初始化系统设置
    initCompanySetting() {
      try {
        var companyId = uni.getStorageSync('companyId')
        if (companyId) {
          companySetting.init(companyId).then(function (success) {
            if (success) {
              // 将系统设置挂载到全局，供其他页面使用
              uni.$companySetting = companySetting
              console.log('系统设置初始化成功')
            } else {
              console.warn('系统设置初始化失败')
            }
          })
        } else {
          console.warn('未找到公司ID，无法初始化系统设置')
        }
      } catch (error) {
        console.error('系统设置初始化异常:', error)
      }
    },

    // 初始化语音插件
    initTTSSpeech() {
      try {
        // 只在App环境下加载原生插件
        if (typeof plus === 'undefined') {
          console.warn('当前不是App环境，无法加载原生语音插件')
          return
        }

        if (TTSSpeech) {
          // 初始化TTS插件
          TTSSpeech.init(() => {
            // 将语音插件挂载到全局，供其他页面使用
            uni.$TTSSpeech = TTSSpeech
            // 设置默认参数
            TTSSpeech.setPitch(70) // 设置语调
            TTSSpeech.setSpeed(65) // 设置语速
          })
        } else {
        }
      } catch (error) {
        console.error('语音插件初始化失败:', error)
        console.log('错误详情:', error.message)
      }
    },

    // 提供语音播报方法供子组件调用
    speakText(text, options = {}) {
      return new Promise((resolve, reject) => {
        try {
          if (!text || text.trim() === '') {
            reject(new Error('播报文本不能为空'))
            return
          }

          // 检查提示音设置是否开启
          if (uni.$companySetting && !uni.$companySetting.isSoundEnabled()) {
            resolve({ success: false, message: '提示音已关闭' })
            return
          }

          // 使用原生TTS插件
          if (TTSSpeech && uni.$TTSSpeech) {
            console.log('使用TTS播报:', text)

            // 设置语音参数（如果提供）
            if (options.pitch !== undefined) {
              TTSSpeech.setPitch(options.pitch)
            }
            if (options.speed !== undefined) {
              TTSSpeech.setSpeed(options.speed)
            }

            // 使用TTS插件播报
            const result = TTSSpeech.speak({ text: text.trim() })
            console.log('TTS播报结果:', result)

            if (result) {
              resolve({ success: true, method: 'tts', result: result })
            } else {
              console.warn('TTS播报失败')
              reject(new Error('TTS播报失败'))
            }
          } else {
            console.warn('TTS插件不可用')
            reject(new Error('TTS插件不可用'))
          }
        } catch (error) {
          console.error('TTS播报异常:', error)
          reject(error)
        }
      })
    },

    // 停止语音播报
    stopSpeech() {
      try {
        if (TTSSpeech && uni.$TTSSpeech) {
          TTSSpeech.stop()
          console.log('TTS播报已停止')
          return true
        } else {
          console.warn('TTS插件不可用')
          return false
        }
      } catch (error) {
        console.error('停止TTS播报失败:', error)
        return false
      }
    },

    // 设置TTS语调
    setTTSPitch(pitch) {
      try {
        if (TTSSpeech && uni.$TTSSpeech) {
          TTSSpeech.setPitch(pitch)
          console.log('TTS语调设置为:', pitch)
          return true
        }
        return false
      } catch (error) {
        console.error('设置TTS语调失败:', error)
        return false
      }
    },

    // 设置TTS语速
    setTTSSpeed(speed) {
      try {
        if (TTSSpeech && uni.$TTSSpeech) {
          TTSSpeech.setSpeed(speed)
          console.log('TTS语速设置为:', speed)
          return true
        }
        return false
      } catch (error) {
        console.error('设置TTS语速失败:', error)
        return false
      }
    },

    // 获取已安装的TTS引擎
    getInstalledTTS() {
      return new Promise((resolve, reject) => {
        try {
          if (TTSSpeech && uni.$TTSSpeech) {
            TTSSpeech.getInstallTTS(res => {
              console.log('已安装的TTS引擎:', res)
              if (res && res.length > 0) {
                resolve(res)
              } else {
                reject(new Error('未找到TTS引擎'))
              }
            })
          } else {
            reject(new Error('TTS插件不可用'))
          }
        } catch (error) {
          console.error('获取TTS引擎失败:', error)
          reject(error)
        }
      })
    },

    // 设置TTS引擎
    setTTSEngine(engineName) {
      try {
        if (TTSSpeech && uni.$TTSSpeech) {
          const result = TTSSpeech.setEngine(engineName)
          console.log('设置TTS引擎结果:', result)
          return result
        }
        return false
      } catch (error) {
        console.error('设置TTS引擎失败:', error)
        return false
      }
    },

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
        if (this.cashierContent === 'one' && this.$refs.cashierRef) {
          this.$refs.cashierRef.refreshPage()
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
          // 切换到货主管理页面时刷新当前选中的货主
          this.$refs.shipperManagementRef.refreshCurrentShipper()
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
