/**
 * DiskMonitor - 磁盘监控模块
 *
 * 职责：每 2 秒采集一次磁盘使用情况，用柱状图展示各挂载点的使用率。
 *
 * 数据来源：systeminformation 的 fsSize() 方法
 *   返回数组，每项代表一个挂载点：
 *   - fs: 挂载路径（如 '/'、'/home'）
 *   - size: 分区总大小（字节）
 *   - used: 已用大小（字节）
 *   - use: 使用率百分比（已计算好，如 78.5 表示 78.5%）
 *   - mount: 设备路径
 *
 * 展示逻辑：
 *   - 每个挂载点一根柱状条，横排显示
 *   - 颜色从绿到黄到红，使用率越高颜色越暖
 *   - 标签显示挂载路径
 *   - 磁盘数据变化较慢，2 秒刷新一次即可
 *
 * 依赖：systeminformation（系统数据）、blessed-contrib（bar 组件）
 */

import * as si from 'systeminformation';
import * as contrib from 'blessed-contrib';

class DiskMonitor {
  // blessed-contrib 的柱状图组件
  bar: contrib.Widgets.PictureElement;

  // 定时器 ID
  interval: NodeJS.Timeout | null = null;

  /**
   * @param bar - blessed-contrib 创建好的 bar 组件（已在 grid 中定位）
   */
  constructor(bar: contrib.Widgets.PictureElement) {
    this.bar = bar;
  }

  /**
   * 启动监控：先采集一次，然后每 2 秒更新
   * 磁盘比 CPU/内存变化慢得多，2 秒间隔足够
   */
  init() {
    si.fsSize().then(() => {
      this.updateData();
      this.interval = setInterval(() => {
        this.updateData();
      }, 2000); // 磁盘变化慢，2 秒刷新
    });
  }

  /**
   * 采集磁盘数据并更新柱状图
   *
   * bar.setData(titles, data) 的调用方式：
   *   - titles: 字符串数组，每根柱子的标签
   *   - data: 数字数组，每根柱子的值（百分比）
   */
  updateData() {
    si.fsSize().then((drives) => {
      // 过滤掉虚拟文件系统（如 /dev、/sys、/proc 等），只显示物理分区
      const realDrives = drives.filter(
        (d) =>
          d.size > 0 &&
          !d.fs.startsWith('/dev') &&
          !d.fs.startsWith('/sys') &&
          !d.fs.startsWith('/proc') &&
          !d.fs.startsWith('/run') &&
          !d.fs.startsWith('/snap')
      );

      if (realDrives.length === 0) {
        return; // 没有有效的磁盘分区，不更新
      }

      // 提取挂载点名称和数据
      const titles = realDrives.map((d) => d.fs);    // e.g. ['/', '/home']
      const data = realDrives.map((d) => d.use);      // e.g. [78.5, 34.2]

      // blessed-contrib bar 组件的 setData 接收 { titles, data } 对象
      this.bar.setData({ titles, data });
    });
  }

  /**
   * 销毁定时器
   */
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default DiskMonitor;
