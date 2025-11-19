<script>
import config from './common/config'
// import * as tsc from "./printer/tsc.js";
import global from './common/const/global'
import PrinterJobs from './printer/printerjobs.js'
import GBK from './printer/gbk.min.js'
import BluetoothTool from './printer/bluetoothTool.js'
import checkappupdate from './common/appUpdate.js'
import printTemplates from './template/printTemplates.js'
// import {
// 	printQR,
// 	printCommand,
// 	sendDataToDevice
// } from './printer/bluetoolth';
export default {
  data() {
    return {
      // DevicesDiscovery: []
    }
  },
  onLaunch: function () {
    // 先执行自动登录，登录成功后再执行后续操作
    this.autoLogin()
      .then(() => {
        // 登录成功后执行的操作
        //自动更新
        // #ifdef APP-PLUS
        checkappupdate.check({
          title: '检测到有新版本！',
          content: '请升级app到最新版本！',
          canceltext: '暂不升级',
          oktext: '立即升级',
        })
        // #endif

        this.checkPermission(['android.permission.BLUETOOTH_CONNECT'], '蓝牙', function () {})
        BluetoothTool.initBluetooth()
      })
      .catch(error => {
        console.log('自动登录失败，跳过后续操作:', error)
      })
  },
  onShow: function () {
    plus.navigator.setFullscreen(true)
    plus.navigator.hideSystemNavigation()

    uni.onWindowResize(this.windowResizeCallback)
    this.initSystem()
    // uni.reLaunch({
    // 	url: '/pages/index/index'
    // })
  },
  onHide: function () {},
  methods: {
    windowResizeCallback(res) {
      const width = res.size.windowWidth
      this.initGridCol(width)
      this.initModalSize(width)
    },
    autoLogin() {
      // const localPath = this.$route.path
      // if (config.noAuthPages.findIndex(x => x === localPath) >= 0) {
      // 	return Promise.resolve()
      // }
      return this.$store
        .dispatch('actionInit')
        .then(tokenInfo => {
          // uni.reLaunch({
          //   url: '/pages/auth/login',
          // })
          var userInfo = uni.getStorageSync('userInfo')
          console.log('autoLogin', userInfo)

          if (!userInfo) {
            uni.showToast({
              title: '未登录',
              icon: 'none',
              position: 'top',
              mask: true,
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/auth/login',
              })
            }, 1000)
            return Promise.reject(new Error('未登录'))
          }

          return Promise.resolve(userInfo)
        })
        .catch(error => {
          console.error('登录失败:', error)
          return Promise.reject(error)
        })
    },
    initSystem() {
      const window = uni.getWindowInfo()
      const width = window.windowWidth
      this.initGridCol(width)
      this.initModalSize(width)

      console.log('window.windowHeight', window.windowHeight)
      if (window.windowHeight < 500) {
        uni.showModal({
          title: '提示',
          content: '屏幕过小会影响使用体验，请更换大屏幕使用',
          showCancel: false,
        })
      }
    },

    checkPermission(permissions, permissionName, success) {
      plus.android.requestPermissions(
        permissions,
        function (e) {
          if (e.deniedAlways.length > 0) {
            //权限被永久拒绝
            // 弹出提示框解释为何需要读写手机储存权限，引导用户打开设置页面开启
            uni.showModal({
              title: permissionName + '权限',
              content: '您可能拒绝了' + permissionName + '权限或您的设备无需设置权限',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定');
                } else if (res.cancel) {
                  // console.log('用户点击取消');
                }
              },
            })
          }
          if (e.deniedPresent.length > 0) {
            //权限被临时拒绝
            plus.android.requestPermissions(permissions)
          }
          if (e.granted.length > 0) {
            //权限被允许
            if (success) {
              success()
            }
          }
        },
        function (e) {
          console.log('checkPermission error:', e)
        }
      )
    },
    initGridCol(width) {
      let col = 3
      if (width <= 600) {
        col = 1
      }
      if (width <= 1000) {
        col = 2
      } else if (width <= 1300) {
        col = 3
      } else if (width <= 1600) {
        col = 4
      } else {
        col = 5
      }
      global.setGridCol(col)
    },
    initModalSize(width, height) {
      const widthCacle = 0.6
      let modalWidth = '500px'
      if (width) {
        modalWidth = width * widthCacle + 'px'
      }
      global.setModalWidth(modalWidth)
    },
    //退出登录
    logout() {
      console.log('logout')
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('companyId')
      uni.removeStorageSync('companyName')
      uni.removeStorageSync('address')
      uni.removeStorageSync('contact')
      uni.removeStorageSync('role')
      uni.removeStorageSync('vesionType')
      uni.removeStorageSync('currentDutyId')
      uni.reLaunch({
        url: '/pages/auth/login',
      })
    },
    //打印发送
    senBleLabel(order, templateName = 'payment_receipt') {
      var buleTeethInfo = uni.getStorageSync('lastbluetooth')
      if (!buleTeethInfo) {
        uni.showToast({
          icon: 'none',
          title: '尚未连接打印机',
          duration: 1000,
        })
        return
      }

      // 使用打印模板
      const that = this
      let printerJobs = new PrinterJobs()

      // 获取模板并执行
      const template = printTemplates.getTemplate(templateName)
      template(printerJobs, order, that)

      // 发送打印数据
      let buffer = printerJobs.buffer()
      this.senBlData(buleTeethInfo.deviceId, buleTeethInfo.serviceId, buleTeethInfo.uuid, buffer)
    },

    //打印挂单
    senBleLabel_GD(order, templateName = 'pending_order') {
      var buleTeethInfo = uni.getStorageSync('lastbluetooth')
      if (!buleTeethInfo) {
        uni.showToast({
          icon: 'error',
          title: '尚未连接打印机',
          duration: 1200,
        })
        return
      }

      // 使用打印模板
      const that = this
      let printerJobs = new PrinterJobs()

      // 获取模板并执行
      const template = printTemplates.getTemplate(templateName)
      template(printerJobs, order, that)

      // 发送打印数据
      let buffer = printerJobs.buffer()
      this.senBlData(buleTeethInfo.deviceId, buleTeethInfo.serviceId, buleTeethInfo.uuid, buffer)
    },
    getFormattedDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0') // 补零
      const day = String(now.getDate()).padStart(2, '0') // 补零
      const hours = String(now.getHours()).padStart(2, '0') // 补零
      const minutes = String(now.getMinutes()).padStart(2, '0') // 补零
      const seconds = String(now.getSeconds()).padStart(2, '0') // 补零

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    calculateSpacesTo9(inputString) {
      // 获取输入字符串的长度
      const currentLength = inputString.length
      // 计算需要的空格数
      const spacesNeeded = Math.max(0, 9 - currentLength)
      // 在字符串末尾添加空格
      const newString = inputString + ' '.repeat(spacesNeeded)
      return newString
    },
    calculateSpacesTo15(inputString) {
      // 获取输入字符串的长度
      const currentLength = inputString.length
      // 计算需要的空格数
      const spacesNeeded = Math.max(0, 15 - currentLength)
      // 在字符串末尾添加空格
      const newString = inputString + ' '.repeat(spacesNeeded)
      return newString
    },
    calculateSpacesTo12(inputString) {
      // 获取输入字符串的长度
      const currentLength = inputString.length
      // 计算需要的空格数
      const spacesNeeded = Math.max(0, 12 - currentLength)
      // 在字符串末尾添加空格
      const newString = inputString + ' '.repeat(spacesNeeded)
      return newString
    },
    // 标签打印（优化版）
    senBlData(deviceId, serviceId, characteristicId, uint8Array) {
      var uint8Buf = Array.from(uint8Array)

      function split_array(datas, size) {
        var result = []
        for (var i = 0; i < datas.length; i += size) {
          result.push(datas.slice(i, i + size))
        }
        return result
      }

      // 优化1: 增加包大小到最大支持的字节数（一般蓝牙支持最大512字节，这里用较保守的128字节）
      var sendloop = split_array(uint8Buf, 128)
      var retryCount = 0
      var maxRetry = 3

      function realWriteData(sendloop, i) {
        if (i >= sendloop.length) {
          console.log('打印数据发送完成')
          return
        }
        var data = sendloop[i]
        var buffer = new ArrayBuffer(data.length)
        var dataView = new DataView(buffer)
        for (var j = 0; j < data.length; j++) {
          dataView.setUint8(j, data[j])
        }
        uni.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: buffer,
          success(res) {
            retryCount = 0 // 成功后重置重试计数
            // 优化2: 减少延时到20ms，大部分蓝牙打印机都能支持
            setTimeout(() => {
              realWriteData(sendloop, i + 1)
            }, 20)
          },
          fail(err) {
            console.error('发送数据失败:', err, '包序号:', i)
            // 优化3: 失败时进行重试，而不是直接跳过
            if (retryCount < maxRetry) {
              retryCount++
              console.log(`重试第 ${retryCount} 次，包序号: ${i}`)
              setTimeout(() => {
                realWriteData(sendloop, i) // 重试当前包
              }, 50)
            } else {
              console.error('重试次数超限，跳过当前包')
              retryCount = 0
              setTimeout(() => {
                realWriteData(sendloop, i + 1) // 跳过当前包继续
              }, 50)
            }
          },
        })
      }
      realWriteData(sendloop, 0)
    },
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-ui/index.scss';
@import './common/css/main.scss';
@import '@/static/iconfont.css';
</style>
