/**
 * 生成订单图片的公共方法
 * @param {Object} options 配置选项
 * @param {Object} options.order 订单信息
 * @param {Array} options.products 商品列表
 * @param {Object} options.companyInfo 公司信息 {name, address, phone}
 * @param {String} options.canvasId canvas ID
 * @param {Object} options.componentContext 组件上下文（用于createCanvasContext）
 * @param {Function} options.onSuccess 成功回调函数，参数为生成的图片路径
 * @param {Function} options.onError 错误回调函数，参数为错误信息
 */
export function generateOrderImage(options) {
  const { order, products, companyInfo, canvasId = 'orderCanvas', componentContext, onSuccess, onError } = options

  // 验证必需参数
  if (!order) {
    onError && onError('订单信息不能为空')
    return
  }

  if (!products || !Array.isArray(products)) {
    onError && onError('商品列表不能为空')
    return
  }

  if (!companyInfo) {
    onError && onError('公司信息不能为空')
    return
  }

  const companyName = companyInfo.name || '店铺名称'
  const companyAddress = companyInfo.address || '地址信息'
  const companyPhone = companyInfo.phone || '联系电话'

  // 创建canvas上下文
  const ctx = uni.createCanvasContext(canvasId, componentContext)
  console.log("ctx",ctx);
  // 画布尺寸
  const canvasWidth = 750
  const padding = 30

  // 判断是否为退款单（欠款大于0或有还筐抵扣）
  const isRefund = order.debt < 0 || order.basketOffsetAmount > 0
  const voucherTitle = isRefund ? '退款凭证' : '付款凭证'

  // 计算实际高度
  let y = 40
  y += 50 // 标题
  y += 45 // 副标题
  y += 55 // 市场名称
  y += 50 // 客户和票号行
  y += 45 // 日期
  y += 30 // 间距

  // 表格高度计算
  y += 50 // 表头
  const productItems = products.filter(m => m.type !== 4)
  y += productItems.length * 45 // 商品行
  y += 45 // 合计行

  // 还筐信息
  let basketOffsetNum = 0
  let basketInfo = ''
  products.forEach(item => {
    if (item.type === 4) {
      basketOffsetNum += parseInt(item.mount || 0)
      basketInfo += `${item.name}:${item.mount};`
    }
  })
  if (basketOffsetNum > 0) {
    y += 45 // 还筐行
  }

  y += 30 // 间距
  y += 50 // 本单合计
  y += 70 // 本单合计后的间距
  y += 45 // 实付/实退行
  y += 30 // 分割线前间距
  y += 40 // 底部信息
  y += 100 // logo高度和留白

  const canvasHeight = y

  // 开始绘制
  y = 0

  // 白色背景
  ctx.setFillStyle('#FFFFFF')
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  y = 40

  // 1. 标题 - 居中
  ctx.setFillStyle('#000000')
  ctx.setFontSize(40)
  ctx.setTextAlign('center')
  ctx.fillText(voucherTitle, canvasWidth / 2, y)
  y += 50

  // 2. 副标题 - 居中
  ctx.setFontSize(20)
  ctx.fillText('广东省食用农产品批发市场销售票据', canvasWidth / 2, y)
  y += 30
  ctx.fillText('(广州江南果菜批发市场)', canvasWidth / 2, y)
  y += 45

  // 3. 市场名称 - 居中加粗
  ctx.setFontSize(32)
  ctx.fillText(companyName, canvasWidth / 2, y)
  y += 55

  // 4. 客户和票号 - 左右对齐
  ctx.setTextAlign('left')
  ctx.setFontSize(26)
  ctx.fillText('客户：' + (order.customName || '散客'), padding, y)

  ctx.setTextAlign('right')
  ctx.fillText('票号：' + (order.accountCode || ''), canvasWidth - padding, y)
  y += 45

  // 5. 日期 - 右对齐
  const createTime = order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : ''
  ctx.setTextAlign('right')
  ctx.fillText(createTime, canvasWidth - padding, y)
  y += 30

  // 6. 表格 - 绘制表头
  const tableX = padding
  const tableWidth = canvasWidth - padding * 2
  const colWidths = [50, 180, 80, 160, 100, 120] // #, 货品, 数量, 重量, 单价, 小计 (总和=690)

  y += 30

  // 表头背景
  ctx.setFillStyle('#F5F5F5')
  ctx.fillRect(tableX, y - 35, tableWidth, 45)

  // 表头文字
  ctx.setFillStyle('#000000')
  ctx.setFontSize(24)

  let currentX = tableX
  const headers = ['#', '货品', '数量', '重量', '单价', '小计']
  headers.forEach((header, index) => {
    if (index === 0) {
      // 序号列 - 居中
      ctx.setTextAlign('center')
      ctx.fillText(header, currentX + colWidths[index] / 2, y)
    } else if (index === 1) {
      // 货品列 - 左对齐
      ctx.setTextAlign('left')
      ctx.fillText(header, currentX + 5, y)
    } else if (index === 5) {
      // 小计列 - 右对齐
      ctx.setTextAlign('right')
      ctx.fillText(header, currentX + colWidths[index] - 10, y)
    } else {
      // 其他列 - 居中
      ctx.setTextAlign('center')
      ctx.fillText(header, currentX + colWidths[index] / 2, y)
    }
    currentX += colWidths[index]
  })
  y += 15

  // 表头下边框
  ctx.setStrokeStyle('#000000')
  ctx.setLineWidth(2)
  ctx.beginPath()
  ctx.moveTo(tableX, y)
  ctx.lineTo(tableX + tableWidth, y)
  ctx.stroke()
  y += 35

  // 定义统一的金额右对齐位置
  const amountRightX = tableX + tableWidth - 10

  // 7. 绘制商品行
  let totalAmount = 0
  productItems.forEach((item, index) => {
    const rowY = y
    currentX = tableX

    ctx.setFillStyle('#000000')
    ctx.setFontSize(22)
    ctx.setTextAlign('center')

    // 序号
    ctx.fillText((index + 1).toString(), currentX + colWidths[0] / 2, rowY)
    currentX += colWidths[0]

    // 货品名称 - 左对齐
    ctx.setTextAlign('left')
    ctx.fillText(item.name || '', currentX + 5, rowY)
    currentX += colWidths[1]

    // 数量 - 居中
    ctx.setTextAlign('center')
    const mountText = item.type === 2 ? item.mount + '' : item.mount + '件'
    ctx.fillText(mountText, currentX + colWidths[2] / 2, rowY)
    currentX += colWidths[2]

    // 重量 - 居中
    let weightText = '--'
    if (item.type !== 2) {
      const totalWeight = parseFloat(item.totalWeight || 0)
      const tareWeight = parseFloat(item.tareWeight || 0)
      const netWeight = (totalWeight - tareWeight).toFixed(2)
      weightText = netWeight + ''
    }
    ctx.fillText(weightText, currentX + colWidths[3] / 2, rowY)
    currentX += colWidths[3]

    // 单价 - 居中
    ctx.fillText((item.referenceAmount || 0) + '', currentX + colWidths[4] / 2, rowY)
    currentX += colWidths[4]

    // 小计 - 右对齐
    const subtotal = parseFloat(item.subtotal || 0)
    totalAmount += subtotal
    ctx.setTextAlign('right')
    ctx.fillText(subtotal.toFixed(0), amountRightX, rowY)

    y += 45
  })

  // 表格底边框
  ctx.setStrokeStyle('#000000')
  ctx.setLineWidth(2)
  ctx.beginPath()
  ctx.moveTo(tableX, y - 10)
  ctx.lineTo(tableX + tableWidth, y - 10)
  ctx.stroke()

  // 8. 合计行
  ctx.setFillStyle('#000000')
  ctx.setFontSize(28)
  ctx.setTextAlign('left')
  ctx.fillText('合计', tableX + 60, y + 25)

  ctx.setTextAlign('right')
  ctx.fillText(totalAmount.toFixed(0), amountRightX, y + 25)
  y += 45

  // 9. 还筐信息
  if (basketOffsetNum > 0) {
    const basketDate = createTime.substring(5, 10) // MM-DD
    ctx.setTextAlign('left')
    ctx.setFontSize(26)
    ctx.fillText(`${basketDate} 还筐`, tableX + 60, y + 20)

    ctx.fillText(basketInfo, tableX + 200, y + 20)

    ctx.setTextAlign('right')
    ctx.fillText('-' + (order.basketOffsetAmount || 0), amountRightX, y + 20)
    y += 45
  }

  y += 30

  // 10. 本单合计
  ctx.setStrokeStyle('#000000')
  ctx.setLineWidth(3)
  ctx.beginPath()
  ctx.moveTo(padding, y - 15)
  ctx.lineTo(canvasWidth - padding, y - 15)
  ctx.stroke()

  ctx.setFillStyle('#000000')
  ctx.setFontSize(32)
  ctx.setTextAlign('left')
  ctx.fillText('本单合计：', padding + 20, y + 25)

  const finalAmount = totalAmount - (order.basketOffsetAmount || 0)
  ctx.setTextAlign('right')
  ctx.fillText(finalAmount.toFixed(0), amountRightX, y + 25)
  y += 70 // 增加间距

  // 11. 实付/实退金额
  const paymentType =
    order.payType === 1 ? '微信' : order.payType === 2 ? '支付宝' : order.payType === 3 ? '现金' : '挂账'
  const payLabel = finalAmount >= 0 ? '实付：' : '实退：'
  const payAmount = Math.abs(order.actualMoney || finalAmount)

  ctx.setTextAlign('right')
  ctx.setFontSize(28)
  ctx.fillText(payLabel + payAmount.toFixed(0) + '(' + paymentType + ')', amountRightX, y + 20)
  y += 45

  // 12. 底部分割线
  ctx.setStrokeStyle('#000000')
  ctx.setLineWidth(2)
  ctx.beginPath()
  ctx.moveTo(padding, y)
  ctx.lineTo(canvasWidth - padding, y)
  ctx.stroke()
  y += 30

  // 13. 底部信息
  ctx.setFillStyle('#333333')
  ctx.setFontSize(20)
  ctx.setTextAlign('left')
  ctx.fillText('地址：' + companyAddress + '，联系电话：' + companyPhone, padding, y + 15)
  y += 40

  // 14. 底部logo
  const logoPath = '/static/img/orderlogo.png'
  uni.getImageInfo({
    src: logoPath,
    success: imgInfo => {
      // 设置logo显示尺寸（缩小到合适大小）
      const logoMaxWidth = 200 // 最大宽度
      const logoMaxHeight = 80 // 最大高度
      let logoWidth = imgInfo.width
      let logoHeight = imgInfo.height

      // 按比例缩放
      if (logoWidth > logoMaxWidth || logoHeight > logoMaxHeight) {
        const widthRatio = logoMaxWidth / logoWidth
        const heightRatio = logoMaxHeight / logoHeight
        const ratio = Math.min(widthRatio, heightRatio)
        logoWidth = logoWidth * ratio
        logoHeight = logoHeight * ratio
      }

      // 居中位置
      const logoX = (canvasWidth - logoWidth) / 2
      const logoY = y + 10

      // 绘制logo
      ctx.drawImage(logoPath, logoX, logoY, logoWidth, logoHeight)

      // 绘制完成，导出图片
      ctx.draw(false, () => {
        console.log('Canvas绘制完成（有logo），延迟2000ms后导出...')
        // 增加延迟时间，确保平板等性能较差设备有足够时间渲染
        setTimeout(() => {
          console.log('开始导出Canvas为图片...', 'canvasId:', canvasId, 'componentContext:', componentContext)
          uni.canvasToTempFilePath(
            {
              canvasId: canvasId,
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              destWidth: canvasWidth * 2,
              destHeight: canvasHeight * 2,
              fileType: 'png',
              quality: 1,
              success: res => {
                console.log('生成票据图片成功:', res.tempFilePath)
                onSuccess && onSuccess(res.tempFilePath)
              },
              fail: err => {
                console.error('生成票据图片失败:', err)
                onError && onError('生成图片失败: ' + (err.errMsg || '未知错误'))
              },
            },
            componentContext
          )
        }, 2000)
      })
    },
    fail: err => {
      console.error('获取logo图片失败:', err)
      // 即使logo加载失败，也继续导出图片
      ctx.draw(false, () => {
        console.log('Canvas绘制完成（无logo），延迟2000ms后导出...')
        // 增加延迟时间，确保平板等性能较差设备有足够时间渲染
        setTimeout(() => {
          console.log('开始导出Canvas为图片（无logo）...', 'canvasId:', canvasId, 'componentContext:', componentContext)
          uni.canvasToTempFilePath(
            {
              canvasId: canvasId,
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              destWidth: canvasWidth * 2,
              destHeight: canvasHeight * 2,
              fileType: 'png',
              quality: 1,
              success: res => {
                console.log('生成票据图片成功:', res.tempFilePath)
                onSuccess && onSuccess(res.tempFilePath)
              },
              fail: err => {
                console.error('生成票据图片失败:', err)
                onError && onError('生成图片失败: ' + (err.errMsg || '未知错误'))
              },
            },
            componentContext
          )
        }, 2000)
      })
    },
  })
}
