/**
 * 语音播报工具类
 * 基于 uniapp-text-to-speech 封装
 */

import SpeechSynthesisUtil from 'uniapp-text-to-speech'

class SpeechHelper {
  constructor() {
    this.tts = null
    this.isInitialized = false
    this.config = {
      API_KEY: '', // 需要配置 Minimax API密钥
      GroupId: '', // 需要配置 Minimax 组ID
      MAX_QUEUE_LENGTH: 3, // 音频队列最大长度
      modelConfig: {
        model: 'speech-01-240228',
        voice_setting: {
          voice_id: 'female-tianmei',
          speed: 1,
          vol: 1,
        },
      },
    }
  }

  /**
   * 初始化语音播报
   * @param {Object} config - 配置项
   * @param {String} config.API_KEY - Minimax API密钥
   * @param {String} config.GroupId - Minimax 组ID
   * @param {Number} config.MAX_QUEUE_LENGTH - 音频队列最大长度
   * @param {Object} config.modelConfig - 音频生成配置
   */
  init(config) {
    try {
      // 合并配置
      if (config) {
        this.config = Object.assign({}, this.config, config)
      }

      // 检查必要配置
      if (!this.config.API_KEY || !this.config.GroupId) {
        console.warn('语音播报未配置 API_KEY 或 GroupId，将无法使用')
        return false
      }

      // 初始化 TTS
      this.tts = new SpeechSynthesisUtil(this.config)
      this.isInitialized = true
      console.log('语音播报初始化成功')
      return true
    } catch (error) {
      console.error('语音播报初始化失败:', error)
      this.isInitialized = false
      return false
    }
  }

  /**
   * 播放文本
   * @param {String} text - 要播放的文本
   * @param {Object} options - 可选配置
   * @returns {Promise}
   */
  speak(text, options) {
    if (!this.isInitialized) {
      console.warn('语音播报未初始化，尝试自动初始化...')
      const success = this.init()
      if (!success) {
        console.error('语音播报自动初始化失败')
        return Promise.reject(new Error('语音播报未初始化'))
      }
    }

    const opts = options || {}

    return this.tts
      .textToSpeech(text, opts)
      .then(function () {
        console.log('语音播报成功:', text)
        return true
      })
      .catch(function (error) {
        console.error('语音播报失败:', error)
        return Promise.reject(error)
      })
  }

  /**
   * 停止播放
   */
  stop() {
    if (this.tts && this.tts.stop) {
      this.tts.stop()
      console.log('语音播报已停止')
    }
  }

  /**
   * 清空播放队列
   */
  clear() {
    if (this.tts && this.tts.clear) {
      this.tts.clear()
      console.log('语音播报队列已清空')
    }
  }

  /**
   * 更新配置
   * @param {Object} config - 新的配置项
   */
  updateConfig(config) {
    this.config = Object.assign({}, this.config, config)

    // 重新初始化
    if (this.isInitialized) {
      this.init(this.config)
    }
  }

  /**
   * 获取当前配置
   */
  getConfig() {
    return Object.assign({}, this.config)
  }

  /**
   * 检查是否已初始化
   */
  checkInitialized() {
    return this.isInitialized
  }
}

// 创建单例
const speechHelper = new SpeechHelper()

/**
 * 便捷方法：播放文本
 * @param {String} text - 要播放的文本
 * @param {Object} options - 可选配置
 */
export function speakText(text, options) {
  return speechHelper.speak(text, options)
}

/**
 * 便捷方法：停止播放
 */
export function stopSpeech() {
  speechHelper.stop()
}

/**
 * 便捷方法：清空队列
 */
export function clearSpeechQueue() {
  speechHelper.clear()
}

/**
 * 便捷方法：初始化语音播报
 * @param {Object} config - 配置项
 */
export function initSpeech(config) {
  return speechHelper.init(config)
}

/**
 * 便捷方法：更新配置
 * @param {Object} config - 新的配置项
 */
export function updateSpeechConfig(config) {
  speechHelper.updateConfig(config)
}

// 导出单例和类
export { speechHelper, SpeechHelper }
export default speechHelper
