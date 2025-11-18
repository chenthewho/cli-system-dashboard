/**
 * 打印模板管理
 * 用于管理不同类型的打印样式模板
 */

/**
 * 默认付款凭证模板
 * @param {Object} printerJobs - 打印任务对象
 * @param {Object} order - 订单数据
 * @param {Object} context - 上下文对象（包含辅助方法）
 */
function paymentReceiptTemplate(printerJobs, order, context) {
  var currentCompanyName = uni.getStorageSync('companyName')
  var address = uni.getStorageSync('address')
  var contact = uni.getStorageSync('contact')
  var marketName = uni.getStorageSync('marketName')
  var ModelList = JSON.parse(order.module)

  console.log('order', order)

  // 添加 println2 辅助方法（增加额外间距）
  printerJobs.println2 = function () {
    this.println()
    this.println()
    return this
  }

  // 设置行间距（默认30点，设置为15点以减小行距）
  printerJobs.setLineSpacing(15)

  // 标题和订单号
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).setBold(true).print('[付款凭证]').setBold(false)
  if (order.orderNo) {
    printerJobs
      .setSize(1)
      .print('     票号:' + order.orderNo)
      .println()
  } else {
    printerJobs.println()
  }
  if (order.barcode) {
    printerJobs
      .setSize(1)
      .print('                    码串:' + order.barcode)
      .println()
  }

  // 商家名称和市场名称（居中）
  printerJobs.setAlign('CT')
  if (marketName) {
    printerJobs.setSize(2).print(marketName).println()
  }
  printerJobs.setSize(3).setBold(true).print(currentCompanyName).setBold(false).println()
  printerJobs.setAlign('LT')

  // 买家信息
  printerJobs.setSize(1)
  printerJobs.print('买家:' + (order.customName != null ? order.customName : '贵宾客户')).println()
  // printerJobs.print('支付时间:' + (order.paymentTime || context.getFormattedDate()))
  if (order.printCount) {
    printerJobs.print('  第' + order.printCount + '次打印')
  }
  printerJobs.println()

  // 货品信息分割线
  printerJobs.setSize(1).print('--------------------货品信息--------------------').println()

  // 构建货品和附加项的分组关系
  var goodsWithAddons = []
  for (var i = 0; i < ModelList.length; i++) {
    console.log('ModelList', ModelList)

    var item = ModelList[i]
    if (item.type === 1) {
      // 主货品
      var goodsGroup = {
        goods: item,
        addons: [],
      }
      // 查找该货品的附加项
      for (var j = 0; j < ModelList.length; j++) {
        var addon = ModelList[j]
        if (addon.type === 2 && addon.parentId === item.Id) {
          goodsGroup.addons.push(addon)
        }
      }
      goodsWithAddons.push(goodsGroup)
    }
  }

  console.log('goodsWithAddons', goodsWithAddons)

  // 打印货品列表（货品+附加项分组）
  var goodIndex = 0
  for (var g = 0; g < goodsWithAddons.length; g++) {
    var group = goodsWithAddons[g]
    var x = group.goods
    goodIndex += 1

    // 货品名称和小计（一行显示）
    printerJobs.setSize(2).setBold(true)
    var itemLine = goodIndex + '.' + x.name
    var subtotalText = '小计:' + x.subtotal
    var spacesNeeded = 24 - itemLine.length - subtotalText.length
    if (spacesNeeded < 1) spacesNeeded = 1
    printerJobs.print(itemLine + ' '.repeat(spacesNeeded) + subtotalText).println()
    printerJobs.setBold(false)

    // 货品详细信息（第二行）
    printerJobs.setSize(1)
    var detailLine = '数量:' + x.mount + '件'
    detailLine += '        毛重:' + (x.totalWeight || 0)
    detailLine += '    去皮:' + (x.tareWeight || 0)
    printerJobs.print(detailLine).println()

    // 货品详细信息（第三行）
    var detailLine2 = '净重:' + ((x.totalWeight || 0) - (x.tareWeight || 0))
    detailLine2 += '        单价:' + x.referenceAmount
    printerJobs.print(detailLine2).println()

    // 打印该货品的附加项
    for (var a = 0; a < group.addons.length; a++) {
      var addonItem = group.addons[a]
      printerJobs.setSize(1).setBold(true)
      var addonLine = '  ' + addonItem.name
      var addonSubtotal = '小计:' + addonItem.subtotal
      var addonSpaces = 26 - addonLine.length - addonSubtotal.length
      if (addonSpaces < 1) addonSpaces = 1
      printerJobs.print(addonLine + ' '.repeat(addonSpaces) + addonSubtotal).println()
      printerJobs.setBold(false)

      // 附加项详细信息
      printerJobs.setSize(1)
      var addonDetail = '  数量:' + addonItem.mount + '件'
      addonDetail += '        单价:' + addonItem.referenceAmount
      printerJobs.print(addonDetail).println()
    }

    // 货品组之间增加间距（除了最后一个）
    if (g < goodsWithAddons.length - 1) {
      printerJobs.println2()
    }
  }

  // 金额汇总分割线
  printerJobs.setSize(1).print('------------------------------------------------').println()

  // 金额汇总
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).setBold(true)
  printerJobs.print('总    计:' + order.payableAmount + '元').println()
  if (order.debt > 0) {
    printerJobs.print('下    欠:' + order.debt + '元').println()
  }
  if (order.actualMoney > 0) {
    printerJobs.print('实    付:' + order.actualMoney + '元').println()
  }
  printerJobs.setBold(false)

  // 其他金额信息
  printerJobs.setSize(1)
  if (order.basketOffsetAmount > 0) {
    printerJobs.print('收筐抵扣：' + order.basketOffsetAmount + '元').println()
  }
  if (order.discountAmount > 0) {
    printerJobs.print('优惠金额：' + order.discountAmount + '元').println()
  }
  if (order.debt > 0) {
    printerJobs.print('应付金额：' + order.debt + '元').println()
  }
  if (order.overchargeAmount > 0) {
    printerJobs.print('多收金额：' + order.overchargeAmount + '元').println()
  }

  // 页脚信息
  printerJobs.setSize(1)
  if (address && contact) {
    printerJobs.print('商行地址:' + address).println()
  }
  printerJobs.print('打印时间:' + context.getFormattedDate()).println2()
  printerJobs.setAlign('CT')
  printerJobs.print('智农佳:400-812-7682').println2()

  printerJobs.lineFeed(1)
  printerJobs.caizhi()
}

/**
 * 挂单打印模板
 * @param {Object} printerJobs - 打印任务对象
 * @param {Object} order - 订单数据
 * @param {Object} context - 上下文对象（包含辅助方法）
 */
function pendingOrderTemplate(printerJobs, order, context) {
  var currentCompanyName = uni.getStorageSync('companyName')
  var address = uni.getStorageSync('address')
  var contact = uni.getStorageSync('contact')
  var marketName = uni.getStorageSync('marketName')
  var ModelList = JSON.parse(order.module)

  // 添加 println2 辅助方法（增加额外间距）
  printerJobs.println2 = function () {
    this.println()
    this.println()
    return this
  }

  // 设置行间距（默认30点，设置为15点以减小行距）
  printerJobs.setLineSpacing(15)

  // 标题和订单号
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).setBold(true).print('挂单打印').setBold(false)
  if (order.orderNo) {
    printerJobs
      .setSize(1)
      .print('     票号:' + order.orderNo)
      .println()
  } else {
    printerJobs.println()
  }
  if (order.barcode) {
    printerJobs
      .setSize(1)
      .print('                    码串:' + order.barcode)
      .println()
  }

  // 商家名称和市场名称（居中）
  printerJobs.setAlign('CT')
  if (marketName) {
    printerJobs.setSize(2).print(marketName).println()
  }
  printerJobs.setSize(3).setBold(true).print(currentCompanyName).setBold(false).println()
  printerJobs.setAlign('LT')

  // 买家信息
  printerJobs.setSize(1)
  printerJobs.print('买家:' + (order.customName != null ? order.customName : '散客/贵宾客户')).println()
  printerJobs.print('挂单时间:' + (order.pendingTime || context.getFormattedDate()))
  if (order.printCount) {
    printerJobs.print('  第' + order.printCount + '次打印')
  }
  printerJobs.println()

  // 货品信息分割线
  printerJobs.setSize(1).print('----------------------货品信息----------------------').println()

  // 构建货品和附加项的分组关系
  var goodsWithAddons = []
  for (var i = 0; i < ModelList.length; i++) {
    var item = ModelList[i]
    if (item.type === 1) {
      // 主货品
      var goodsGroup = {
        goods: item,
        addons: [],
      }
      // 查找该货品的附加项
      for (var j = 0; j < ModelList.length; j++) {
        var addonItem = ModelList[j]
        if (addonItem.type === 2 && addonItem.parentId === item.id) {
          goodsGroup.addons.push(addonItem)
        }
      }
      goodsWithAddons.push(goodsGroup)
    }
  }

  // 打印货品列表（货品+附加项分组）
  var goodIndex = 0
  for (var g = 0; g < goodsWithAddons.length; g++) {
    var group = goodsWithAddons[g]
    var x = group.goods
    goodIndex += 1

    // 货品名称和小计（一行显示）
    printerJobs.setSize(2).setBold(true)
    var itemLine = goodIndex + '.' + x.name
    var subtotalText = '小计:' + x.subtotal
    var spacesNeeded = 24 - itemLine.length - subtotalText.length
    if (spacesNeeded < 1) spacesNeeded = 1
    printerJobs.print(itemLine + ' '.repeat(spacesNeeded) + subtotalText).println()
    printerJobs.setBold(false)

    // 货品详细信息（第二行）
    printerJobs.setSize(1)
    var detailLine = '数量:' + x.mount + '件'
    detailLine += '        毛重:' + (x.totalWeight || 0)
    detailLine += '    去皮:' + (x.tareWeight || 0)
    printerJobs.print(detailLine).println()

    // 货品详细信息（第三行）
    var detailLine2 = '净重:' + ((x.totalWeight || 0) - (x.tareWeight || 0))
    detailLine2 += '        单价:' + x.referenceAmount
    detailLine2 += '    货款:' + x.subtotal
    printerJobs.print(detailLine2).println()

    // 打印该货品的附加项
    for (var a = 0; a < group.addons.length; a++) {
      var addon = group.addons[a]
      printerJobs.setSize(1).setBold(true)
      var addonLine = '  ' + addon.name
      var addonSubtotal = '小计:' + addon.subtotal
      var addonSpaces = 26 - addonLine.length - addonSubtotal.length
      if (addonSpaces < 1) addonSpaces = 1
      printerJobs.print(addonLine + ' '.repeat(addonSpaces) + addonSubtotal).println()
      printerJobs.setBold(false)

      // 附加项详细信息
      printerJobs.setSize(1)
      var addonDetail = '  数量:' + addon.mount + '件'
      addonDetail += '        单价:' + addon.referenceAmount
      addonDetail += '    储金额:' + addon.subtotal
      printerJobs.print(addonDetail).println()
    }

    // 货品组之间增加间距（除了最后一个）
    if (g < goodsWithAddons.length - 1) {
      printerJobs.println2()
    }
  }

  // 金额汇总分割线
  printerJobs.setSize(1).print('---------------------------------------------------').println()

  // 金额汇总
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).setBold(true)
  printerJobs.print('总    计:' + order.payableAmount + '元').println()
  printerJobs.print('实    付:' + order.actualMoney + '元(现金)').println()
  printerJobs.setBold(false)

  // 其他金额信息
  printerJobs.setSize(1)
  if (order.basketOffsetAmount > 0) {
    printerJobs.print('收筐抵扣：' + order.basketOffsetAmount + '元').println()
  }
  if (order.discountAmount > 0) {
    printerJobs.print('优惠金额：' + order.discountAmount + '元').println()
  }
  if (order.debt > 0) {
    printerJobs.print('应付金额：' + order.debt + '元').println()
  }
  if (order.overchargeAmount > 0) {
    printerJobs.print('多收金额：' + order.overchargeAmount + '元').println()
  }

  // 页脚信息
  printerJobs.setSize(1)
  if (address && contact) {
    printerJobs.print('商行地址:' + address).println()
  }
  printerJobs.print('打印时间:' + context.getFormattedDate()).println()
  printerJobs.setAlign('CT')
  printerJobs.print('智农佳:400-812-7682').println()

  printerJobs.lineFeed(1)
  printerJobs.caizhi()
}

/**
 * 简洁模板（示例）
 * @param {Object} printerJobs - 打印任务对象
 * @param {Object} order - 订单数据
 * @param {Object} context - 上下文对象（包含辅助方法）
 */
function simpleReceiptTemplate(printerJobs, order, context) {
  var currentCompanyName = uni.getStorageSync('companyName')
  var ModelList = JSON.parse(order.module)

  // 标题
  printerJobs.setAlign('CT')
  printerJobs.setSize(3).print(currentCompanyName + '\r\n')
  printerJobs.setSize(2).print('【付款凭证】\r\n')
  printerJobs.lineFeed(1)

  // 买家
  printerJobs.setAlign('LT')
  printerJobs
    .setSize(2)
    .print('买家：' + (order.customName || ''))
    .println()

  // 货品列表
  printerJobs.setSize(2).print('------- 货品 -------').println()
  var goodIndex = 0
  for (var n = 0; n < ModelList.length; n++) {
    var goods = ModelList[n]
    if (goods.type === 1) {
      goodIndex += 1
      printerJobs.setSize(1)
      printerJobs.text(goodIndex + '.' + goods.name + ' x' + goods.mount).println()
      printerJobs.text('  ¥' + goods.subtotal).println()
    }
  }

  // 金额
  printerJobs.setSize(2).print('-------------------').println()
  printerJobs
    .setSize(3)
    .text('实付：¥' + order.actualMoney)
    .println()

  // 页脚
  printerJobs.setSize(1)
  printerJobs.text(context.getFormattedDate()).println()
  printerJobs.lineFeed(2)
  printerJobs.caizhi()
}

/**
 * 模板注册表
 * 可以通过模板名称获取对应的模板函数
 */
var templates = {
  // 默认付款凭证模板
  payment_receipt: paymentReceiptTemplate,

  // 挂单打印模板
  pending_order: pendingOrderTemplate,

  // 简洁模板
  simple_receipt: simpleReceiptTemplate,
}

/**
 * 获取打印模板
 * @param {String} templateName - 模板名称
 * @returns {Function} 模板函数
 */
function getTemplate(templateName) {
  return templates[templateName] || templates.payment_receipt
}

/**
 * 注册新模板
 * @param {String} templateName - 模板名称
 * @param {Function} templateFunction - 模板函数
 */
function registerTemplate(templateName, templateFunction) {
  templates[templateName] = templateFunction
}

/**
 * 获取所有可用模板列表
 * @returns {Array} 模板名称列表
 */
function getAvailableTemplates() {
  return Object.keys(templates)
}

module.exports = {
  getTemplate: getTemplate,
  registerTemplate: registerTemplate,
  getAvailableTemplates: getAvailableTemplates,
  templates: templates,
}
