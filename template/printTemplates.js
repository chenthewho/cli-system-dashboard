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
  var ModelList = JSON.parse(order.module)

  // 标题
  printerJobs.setSize(2).setAlign('LT').print('【付款凭证】\r\n')
  printerJobs.lineFeed(1)

  // 商家名称
  printerJobs.setAlign('CT')
  printerJobs.setSize(3).print(currentCompanyName + '\r\n')
  printerJobs.setAlign('LT')

  // 买家信息
  printerJobs.setSize(2).print('买家：' + (order.customName != null ? order.customName : ''))
  printerJobs.setSize(1).print('支付时间：')

  // 货品信息分割线
  printerJobs.setSize(2).print('-------------------货品信息------------------').println().setBold(false)

  // 打印货品列表（type=1）
  var goodIndex = 0
  for (var i = 0; i < ModelList.length; i++) {
    var x = ModelList[i]
    if (x.type === 1) {
      goodIndex += 1
      printerJobs
        .setSize(2)
        .text(goodIndex + '.' + x.name)
        .text(' '.repeat(10))
      printerJobs.text('小计：' + x.subtotal).println()
      printerJobs.setAlign('LT')
      printerJobs
        .setSize(1)
        .text(context.calculateSpacesTo9('数量：' + x.mount + '件'))
        .text(context.calculateSpacesTo9('单价：' + x.referenceAmount))
        .text(
          context.calculateSpacesTo12(
            '重量：' + (x.totalWeight - x.tareWeight) + '(' + x.totalWeight + '-' + x.tareWeight + ')'
          )
        )
        .println()
    }
  }

  // 打印附加项（type=2）
  var filteredList = ModelList.filter(function (item) {
    return item.type === 2
  })
  if (filteredList.length > 0) {
    printerJobs.text('(附加项)').println()
  }
  for (var j = 0; j < filteredList.length; j++) {
    var item = filteredList[j]
    printerJobs
      .setSize(1)
      .text(j + 1 + '.' + item.name)
      .text(' '.repeat(10))
    printerJobs.text('小计：' + item.subtotal).println()
    printerJobs.setAlign('LT')
    printerJobs
      .setSize(1)
      .text(context.calculateSpacesTo15('数量：' + item.mount + '件'))
      .text(context.calculateSpacesTo15('单价：' + item.referenceAmount))
      .println()
  }

  // 金额汇总
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).print('-------------------------------------------')
  printerJobs.setSize(4)
  printerJobs.text('总计：' + order.payableAmount + '元').println()
  if (order.basketOffsetAmount > 0) {
    printerJobs.text('收筐抵扣：' + order.basketOffsetAmount + '元').println()
  }
  if (order.discountAmount > 0) {
    printerJobs.text('优惠金额：' + order.discountAmount + '元').println()
  }
  if (order.debt > 0) {
    printerJobs.text('应付金额：' + order.debt + '元').println()
  }
  printerJobs.text('实付金额：' + order.actualMoney + '元').println()
  if (order.overchargeAmount > 0) {
    printerJobs.text('多收金额：' + order.overchargeAmount + '元').println()
  }
  printerJobs.setSize(2).print('-------------------------------------------')

  // 联系信息
  printerJobs.setSize(1)
  if (address) {
    printerJobs.text('联系地址：' + address).println()
  }
  if (contact) {
    printerJobs.text('联系电话：' + contact).println()
  }

  // 页脚
  printerJobs.text('打印时间:' + context.getFormattedDate()).println()
  printerJobs.text('智农佳-全国热线：400-812-7682')
  printerJobs.lineFeed(2)
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
  var ModelList = JSON.parse(order.module)

  // 标题
  printerJobs.lineFeed(1)
  printerJobs.setSize(2).setAlign('LT').print('【挂单打印】\r\n')
  printerJobs.lineFeed(1)

  // 商家名称
  printerJobs.setAlign('CT')
  printerJobs.setSize(3).print(currentCompanyName + '\r\n')
  printerJobs.setAlign('LT')

  // 买家信息
  printerJobs.setSize(2).print('买家：' + (order.customName != null ? order.customName : ''))
  printerJobs.setSize(1).print('挂单时间：')

  // 货品信息分割线
  printerJobs.setSize(2).print('-------------------货品信息------------------').println().setBold(false)

  // 打印货品列表（type=1）
  var goodIndex = 0
  for (var i = 0; i < ModelList.length; i++) {
    var x = ModelList[i]
    if (x.type === 1) {
      goodIndex += 1
      printerJobs
        .setSize(2)
        .text(goodIndex + '.' + x.name)
        .text(' '.repeat(10))
      printerJobs.text('小计：' + x.subtotal).println()
      printerJobs.setAlign('LT')
      printerJobs
        .setSize(1)
        .text(context.calculateSpacesTo9('数量：' + x.mount + '件'))
        .text(context.calculateSpacesTo9('单价：' + x.referenceAmount))
        .text(
          context.calculateSpacesTo12(
            '重量：' + (x.totalWeight - x.tareWeight) + '(' + x.totalWeight + '-' + x.tareWeight + ')'
          )
        )
        .println()
    }
  }

  // 打印附加项（type=2）
  var filteredList = ModelList.filter(function (item) {
    return item.type === 2
  })
  if (filteredList.length > 0) {
    printerJobs.text('(附加项)').println()
  }
  for (var k = 0; k < filteredList.length; k++) {
    var addon = filteredList[k]
    printerJobs
      .setSize(1)
      .text(k + 1 + '.' + addon.name)
      .text(' '.repeat(10))
    printerJobs.text('小计：' + addon.subtotal).println()
    printerJobs.setAlign('LT')
    printerJobs
      .setSize(1)
      .text(context.calculateSpacesTo15('数量：' + addon.mount + '件'))
      .text(context.calculateSpacesTo15('单价：' + addon.referenceAmount))
      .println()
  }

  // 金额汇总
  printerJobs.setAlign('LT')
  printerJobs.setSize(2).print('-------------------------------------------')
  printerJobs.setSize(4)
  printerJobs.text('总计：' + order.payableAmount + '元').println()
  if (order.basketOffsetAmount > 0) {
    printerJobs.text('收筐抵扣：' + order.basketOffsetAmount + '元').println()
  }
  if (order.discountAmount > 0) {
    printerJobs.text('优惠金额：' + order.discountAmount + '元').println()
  }
  if (order.debt > 0) {
    printerJobs.text('应付金额：' + order.debt + '元').println()
  }
  printerJobs.text('实付金额：' + order.actualMoney + '元').println()
  if (order.overchargeAmount > 0) {
    printerJobs.text('多收金额：' + order.overchargeAmount + '元').println()
  }
  printerJobs.setSize(2).print('-------------------------------------------')

  // 联系信息
  printerJobs.setSize(1)
  if (address) {
    printerJobs.text('联系地址：' + address).println()
  }
  if (contact) {
    printerJobs.text('联系电话：' + contact).println()
  }

  // 页脚
  printerJobs.text('打印时间:' + context.getFormattedDate()).println()
  printerJobs.text('智农佳-全国热线：400-812-7682')
  printerJobs.lineFeed(2)
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
