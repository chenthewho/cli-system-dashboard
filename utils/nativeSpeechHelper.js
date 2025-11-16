/**
 * 原生语音播报工具类
 * 基于 MT-TTS-Speech 原生插件封装
 */

class NativeSpeechHelper {
  constructor() {
    this.TTSSpeech = null
    this.isInitialized = false
    this.isEnabled = true
  }

  /**
   * 初始化语音插件
   */
  init() {
    try {
      // 尝试获取原生插件
      this.TTSSpeech = uni.requireNativePlugin('MT-TTS-Speech')

      if (this.TTSSpeech) {
        this.isInitialized = true
        console.log('原生语音插件初始化成功')

        // 挂载到全局
        uni.$nativeTTS = this

        return true
      } else {
        console.warn('原生语音插件加载失败')
        return false
      }
    } catch (error) {
      console.error('原生语音插件初始化失败:', error)
      this.isInitialized = false
      return false
    }
  }

  /**
   * 播放文本
   * @param {String} text - 要播放的文本
   * @param {Object} options - 播放选项
   * @returns {Promise}
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isEnabled) {
        console.log('语音播报已禁用')
        resolve({ success: true, message: '语音播报已禁用' })
        return
      }

      if (!this.isInitialized || !this.TTSSpeech) {
        console.warn('语音插件未初始化，尝试重新初始化...')
        if (!this.init()) {
          reject(new Error('语音插件初始化失败'))
          return
        }
      }

      if (!text || text.trim() === '') {
        reject(new Error('播报文本不能为空'))
        return
      }

      try {
        const config = Object.assign(
          {
            text: text.trim(),
            // 默认配置
            speed: 1.0, // 语速
            volume: 1.0, // 音量
            pitch: 1.0, // 音调
          },
          options
        ) // 合并用户配置

        this.TTSSpeech.speak(config, result => {
          if (result && result.success) {
            console.log('语音播报成功:', text)
            resolve(result)
          } else {
            const errorMsg = result ? result.message : '语音播报失败'
            console.error('语音播报失败:', errorMsg)
            reject(new Error(errorMsg))
          }
        })
      } catch (error) {
        console.error('语音播报异常:', error)
        reject(error)
      }
    })
  }

  /**
   * 停止播放
   */
  stop() {
    try {
      if (this.TTSSpeech && this.isInitialized) {
        this.TTSSpeech.stop()
        console.log('语音播报已停止')
        return true
      } else {
        console.warn('语音插件未初始化')
        return false
      }
    } catch (error) {
      console.error('停止语音播报失败:', error)
      return false
    }
  }

  /**
   * 暂停播放
   */
  pause() {
    try {
      if (this.TTSSpeech && this.isInitialized) {
        this.TTSSpeech.pause()
        console.log('语音播报已暂停')
        return true
      } else {
        console.warn('语音插件未初始化')
        return false
      }
    } catch (error) {
      console.error('暂停语音播报失败:', error)
      return false
    }
  }

  /**
   * 恢复播放
   */
  resume() {
    try {
      if (this.TTSSpeech && this.isInitialized) {
        this.TTSSpeech.resume()
        console.log('语音播报已恢复')
        return true
      } else {
        console.warn('语音插件未初始化')
        return false
      }
    } catch (error) {
      console.error('恢复语音播报失败:', error)
      return false
    }
  }

  /**
   * 启用语音播报
   */
  enable() {
    this.isEnabled = true
    console.log('语音播报已启用')
  }

  /**
   * 禁用语音播报
   */
  disable() {
    this.isEnabled = false
    this.stop() // 停止当前播报
    console.log('语音播报已禁用')
  }

  /**
   * 检查是否已初始化
   */
  checkInitialized() {
    return this.isInitialized
  }

  /**
   * 检查是否已启用
   */
  checkEnabled() {
    return this.isEnabled
  }

  /**
   * 获取插件状态
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      enabled: this.isEnabled,
      hasPlugin: !!this.TTSSpeech,
    }
  }
}

// 创建单例
const nativeSpeechHelper = new NativeSpeechHelper()

/**
 * 便捷方法：播放文本
 * @param {String} text - 要播放的文本
 * @param {Object} options - 播放选项
 */
export function speakText(text, options = {}) {
  return nativeSpeechHelper.speak(text, options)
}

/**
 * 便捷方法：停止播放
 */
export function stopSpeech() {
  return nativeSpeechHelper.stop()
}

/**
 * 便捷方法：暂停播放
 */
export function pauseSpeech() {
  return nativeSpeechHelper.pause()
}

/**
 * 便捷方法：恢复播放
 */
export function resumeSpeech() {
  return nativeSpeechHelper.resume()
}

/**
 * 便捷方法：启用语音播报
 */
export function enableSpeech() {
  nativeSpeechHelper.enable()
}

/**
 * 便捷方法：禁用语音播报
 */
export function disableSpeech() {
  nativeSpeechHelper.disable()
}

/**
 * 便捷方法：初始化语音插件
 */
export function initNativeSpeech() {
  return nativeSpeechHelper.init()
}

/**
 * 便捷方法：获取状态
 */
export function getSpeechStatus() {
  return nativeSpeechHelper.getStatus()
}

// 导出单例和类
export { nativeSpeechHelper, NativeSpeechHelper }
export default nativeSpeechHelper
