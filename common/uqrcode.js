/**
 * 二维码生成工具
 * 使用在线 API 生成二维码
 */

export default {
  /**
   * 生成二维码
   * @param {Object} options 配置选项
   * @param {String} options.canvasId canvas 的 id
   * @param {Object} options.componentInstance 组件实例 (this)
   * @param {String} options.text 二维码内容
   * @param {Number} options.size 二维码大小
   * @param {Number} options.margin 边距
   * @param {String} options.backgroundColor 背景色
   * @param {String} options.foregroundColor 前景色
   * @param {String} options.correctLevel 纠错级别 L/M/Q/H
   * @param {Function} options.success 成功回调
   * @param {Function} options.fail 失败回调
   */
  make(options) {
    const {
      canvasId,
      componentInstance,
      text,
      size = 200,
      margin = 0,
      backgroundColor = '#ffffff',
      foregroundColor = '#000000',
      correctLevel = 'M',
      success,
      fail,
    } = options

    // 使用在线 API 生成二维码
    const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      text
    )}&margin=${margin}&bgcolor=${backgroundColor.replace('#', '')}&color=${foregroundColor.replace('#', '')}`

    console.log('生成二维码 URL:', qrcodeUrl)

    // 获取 canvas 上下文
    const ctx = uni.createCanvasContext(canvasId, componentInstance)

    // 下载二维码图片并绘制到 canvas
    uni.getImageInfo({
      src: qrcodeUrl,
      success: res => {
        console.log('获取二维码图片成功:', res)
        ctx.drawImage(res.path, 0, 0, size, size)
        ctx.draw(false, () => {
          console.log('二维码绘制完成')
          if (success) {
            success({ errMsg: 'qrcode:ok' })
          }
        })
      },
      fail: err => {
        console.error('获取二维码图片失败:', err)
        if (fail) {
          fail(err)
        }
      },
    })
  },
}
