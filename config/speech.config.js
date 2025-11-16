/**
 * 语音播报配置文件
 * 请在此处配置您的 Minimax API 密钥和组ID
 */

export default {
  // Minimax API密钥 - 请替换为您的实际密钥
  API_KEY: 'your_minimax_api_key',

  // Minimax 组ID - 请替换为您的实际组ID
  GroupId: 'your_group_id',

  // 音频队列最大长度
  MAX_QUEUE_LENGTH: 3,

  // 音频生成配置
  modelConfig: {
    // 模型版本
    model: 'speech-01-240228',

    // 语音设置
    voice_setting: {
      // 音色ID
      // 可选值: 'female-tianmei', 'male-qn-qingse', 'female-shaonv' 等
      voice_id: 'female-tianmei',

      // 语速 (0.5-2.0)
      speed: 1,

      // 音量 (0.1-10.0)
      vol: 1,
    },
  },

  // 是否启用语音播报
  enabled: true,

  // 是否在开发环境启用
  enableInDev: true,
}
