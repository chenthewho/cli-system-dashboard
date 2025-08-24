import commands from './commands'; // 使用相对路径
import { TextEncoder } from '../text-encoding/index';

const printerJobs = function () {
  this._queue = Array.from(commands.HARDWARE.HW_INIT);
  this._encoder = new TextEncoder("gb2312", {NONSTANDARD_allowLegacyEncoding: true});
  this._enqueue = function (cmd) {
  this._queue.push.apply(this._queue, cmd);
  }
};

/**
 * 增加打印内容
 * @param  {string} content  文字内容
 */
printerJobs.prototype.text = function (content) {
  if (content) {
    let uint8Array = this._encoder.encode(content);
    let encoded = Array.from(uint8Array);
    this._enqueue(encoded);
  }
  return this;
};

/**
 * 打印文字
 * @param  {string} content  文字内容
 */
printerJobs.prototype.print = function (content) {
  this.text(content);
  this._enqueue(commands.LF);
  return this;
};

/**
 * 打印文字并换行
 * @param  {string}  content  文字内容
 */
printerJobs.prototype.println = function (content = '') {
  return this.print(content + commands.EOL);
};

/**
 * 设置对齐方式
 * @param {string} align 对齐方式 LT/CT/RT
 */
printerJobs.prototype.setAlign = function (align) {
  this._enqueue(commands.TEXT_FORMAT['TXT_ALIGN_' + align.toUpperCase()]);
  return this;
};

/**
 * 设置字体
 * @param  {string} family A/B/C
 */
printerJobs.prototype.setFont = function (family) {
  this._enqueue(commands.TEXT_FORMAT['TXT_FONT_' + family.toUpperCase()]);
  return this;
};

/**
 * 设定字体尺寸
 * @param  {number} width 字体宽度 1~2
 * @param  {number} height 字体高度 1~2
 */
printerJobs.prototype.setSize = function (size) {
		if(size==1){
			this._enqueue([0x1d, 0x21, 0x00])
		}else if(size==3){
			this._enqueue([0x1d, 0x21, 0x12])
		}else if(size==4){
			this._enqueue([0x1d, 0x21, 0x11])
		}else {
			this._enqueue([0x1d, 0x21, 0x1])
		}
		
  // if (2 >= width && 2 >= height) {
  //   this._enqueue(commands.TEXT_FORMAT.TXT_NORMAL);
  //   if (2 === width && 2 === height) {
  //     this._enqueue(commands.TEXT_FORMAT.TXT_4SQUARE);
  //   } else if (1 === width && 2 === height) {
  //     this._enqueue(commands.TEXT_FORMAT.TXT_2HEIGHT);
  //   } else if (2 === width && 1 === height) {
  //     this._enqueue(commands.TEXT_FORMAT.TXT_2WIDTH);
  //   }
  // }
  return this;
};

/**
 * 设定字体是否加粗
 * @param  {boolean} bold
 */
printerJobs.prototype.setBold = function (bold) {
  if (typeof bold !== 'boolean') {
    bold = true;
  }
  this._enqueue(bold ? commands.TEXT_FORMAT.TXT_BOLD_ON : commands.TEXT_FORMAT.TXT_BOLD_OFF);
  return this;
};

/**
 * 设定是否开启下划线
 * @param  {boolean} underline
 */
printerJobs.prototype.setUnderline = function (underline) {
  if (typeof underline !== 'boolean') {
    underline = true;
  }
  this._enqueue(underline ? commands.TEXT_FORMAT.TXT_UNDERL_ON : commands.TEXT_FORMAT.TXT_UNDERL_OFF);
  return this;
};

/**
 * 设置行间距为 n 点行,默认值行间距是 30 点
 * @param {number} n 0≤n≤255
 */
printerJobs.prototype.setLineSpacing = function (n) {
  if (n === undefined || n === null) {
    this._enqueue(commands.LINE_SPACING.LS_DEFAULT);
  } else {
    this._enqueue(commands.LINE_SPACING.LS_SET);
    this._enqueue([n]);
  }
  return this;
};

/**
 * 打印空行
 * @param {number} n
 */
printerJobs.prototype.lineFeed = function (n = 1) {
  return this.print(new Array(n).fill(commands.EOL).join(''));
};

/**
 *  设置字体颜色，需要打印机支持
 *  @param  {number} color - 0 默认颜色黑色 1 红色
 */
printerJobs.prototype.setColor = function (color) {
  this._enqueue(commands.COLOR[color === 1 ? 1 : 0]);
  return this;
};

printerJobs.prototype.AddOther = function (value) {
  this._enqueue(value);
  return this;
};

/**
 * https://support.loyverse.com/hardware/printers/use-the-beeper-in-a-escpos-printers
 * 蜂鸣警报，需要打印机支持
 * @param  {number} n    蜂鸣次数,1-9
 * @param  {number} t 蜂鸣长短,1-9
 */
printerJobs.prototype.beep = function (n, t) {
  this._enqueue(commands.BEEP);
  this._enqueue([n, t]);
  return this;
};
printerJobs.prototype.caizhi = function () {
  this._enqueue([0x1d,0x56,66,8]);
  return this;
};

printerJobs.prototype.moveCursorRight = function () {
  this._enqueue([0x1b, 0x24, 20 % 256, 20 % 256]);
  return this;
};

/**
 * 清空任务
 */
printerJobs.prototype.clear = function () {
  this._queue = Array.from(commands.HARDWARE.HW_INIT);
  return this;
};

/**
 * 返回ArrayBuffer
 */
printerJobs.prototype.buffer = function () {
	return this._queue;
};

module.exports = printerJobs;