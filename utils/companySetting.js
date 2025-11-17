/**
 * 公司系统设置管理
 * 用于管理和访问公司级别的系统设置参数
 */

class CompanySetting {
  constructor() {
    this.settings = {
      // 打印设置
      _fixedPayPrint: false, // 收款打印开关

      // 提示音设置
      _soundEnabled: false, // 提示音开关

      // 皮重设置
      _fixedTareWeight: {
        action: false, // 固定皮重开关
        value: 0, // 固定皮重值
      },
    }

    this.companyId = ''
    this.isLoaded = false
  }

  /**
   * 初始化设置
   * @param {String} companyId - 公司ID
   */
  init(companyId) {
    if (!companyId) {
      console.warn('CompanySetting: 公司ID为空，无法初始化')
      return Promise.resolve(false)
    }

    this.companyId = companyId

    // 先从本地存储加载
    this.loadFromStorage()

    // 然后从服务器同步
    return this.syncFromServer()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  }

  /**
   * 从本地存储加载设置
   */
  loadFromStorage() {
    try {
      var storedSettings = uni.getStorageSync('companySetting')
      if (storedSettings) {
        this.settings = Object.assign({}, this.settings, storedSettings)
        this.isLoaded = true
        console.log('CompanySetting: 从本地存储加载设置成功', this.settings)
      }
    } catch (error) {
      console.error('CompanySetting: 从本地存储加载设置失败', error)
    }
  }

  /**
   * 从服务器同步设置
   */
  syncFromServer() {
    var self = this
    return new Promise(function (resolve) {
      try {
        // 这里需要导入setting API
        var settingApi = require('../api/setting/setting.js').default

        settingApi
          .GetByCompanyId(self.companyId)
          .then(function (res) {
            if (res.code === 200 && res.data && res.data.settingInfo) {
              self.settings = Object.assign({}, self.settings, res.data.settingInfo)

              // 保存到本地存储
              self.saveToStorage()
              self.isLoaded = true

              console.log('CompanySetting: 从服务器同步设置成功', self.settings)
              resolve(true)
            } else {
              console.warn('CompanySetting: 服务器未返回有效设置数据')
              resolve(false)
            }
          })
          .catch(function (error) {
            console.error('CompanySetting: 从服务器同步设置失败', error)
            resolve(false)
          })
      } catch (error) {
        console.error('CompanySetting: 从服务器同步设置异常', error)
        resolve(false)
      }
    })
  }

  /**
   * 保存设置到本地存储
   */
  saveToStorage() {
    try {
      uni.setStorageSync('companySetting', this.settings)
      console.log('CompanySetting: 保存到本地存储成功')
    } catch (error) {
      console.error('CompanySetting: 保存到本地存储失败', error)
    }
  }

  /**
   * 获取指定设置项的值
   * @param {String} key - 设置项键名
   * @param {*} defaultValue - 默认值
   */
  get(key, defaultValue = null) {
    if (!this.isLoaded) {
      console.warn('CompanySetting: 设置尚未加载，返回默认值')
      return defaultValue
    }

    // 支持嵌套键名，如 '_fixedTareWeight.action'
    const keys = key.split('.')
    let value = this.settings

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return defaultValue
      }
    }

    return value !== undefined ? value : defaultValue
  }

  /**
   * 设置指定设置项的值
   * @param {String} key - 设置项键名
   * @param {*} value - 设置值
   */
  set(key, value) {
    const keys = key.split('.')
    let target = this.settings

    // 遍历到倒数第二个键
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!(k in target) || typeof target[k] !== 'object') {
        target[k] = {}
      }
      target = target[k]
    }

    // 设置最后一个键的值
    target[keys[keys.length - 1]] = value

    // 保存到本地存储
    this.saveToStorage()

    console.log(`CompanySetting: 设置 ${key} = ${value}`)
  }

  /**
   * 批量更新设置
   * @param {Object} newSettings - 新设置对象
   */
  update(newSettings) {
    this.settings = Object.assign({}, this.settings, newSettings)
    this.saveToStorage()
    console.log('CompanySetting: 批量更新设置', this.settings)
  }

  /**
   * 重新加载设置
   */
  reload() {
    console.log('CompanySetting: 重新加载设置')
    this.loadFromStorage()
    return this.syncFromServer()
  }

  /**
   * 清除设置
   */
  clear() {
    this.settings = {
      _fixedPayPrint: false,
      _soundEnabled: false,
      _fixedTareWeight: {
        action: false,
        value: 0,
      },
    }
    this.isLoaded = false
    uni.removeStorageSync('companySetting')
    console.log('CompanySetting: 设置已清除')
  }

  // ========== 便捷访问方法 ==========

  /**
   * 是否开启收款打印
   */
  isPayPrintEnabled() {
    return this.get('_fixedPayPrint', false)
  }

  /**
   * 是否开启提示音
   */
  isSoundEnabled() {
    return this.get('_soundEnabled', false)
  }

  /**
   * 是否开启固定皮重
   */
  isFixedTareWeightEnabled() {
    return this.get('_fixedTareWeight.action', false)
  }

  /**
   * 获取固定皮重值
   */
  getFixedTareWeightValue() {
    return this.get('_fixedTareWeight.value', 0)
  }

  /**
   * 获取所有设置
   */
  getAll() {
    return Object.assign({}, this.settings)
  }
}

// 创建单例
const companySetting = new CompanySetting()

export default companySetting
