/**
 * MemoryMonitor - 内存监控模块
 *
 * 职责：每秒采集一次系统内存数据，渲染为 donut（环形图）展示。
 *
 * 数据来源：systeminformation 库的 mem() 方法
 *   返回对象包含：total（总量）、active（活跃使用）、buffcache（缓存/缓冲）、
 *   free（空闲）、swaptotal（交换分区总量）、swapused（交换分区已用）
 *
 * 展示逻辑：
 *   - 应用占用 = used - buffcache（系统 total - free 中减去缓存部分，得到真实占用）
 *   - 缓存 = buffcache（操作系统用空闲内存做的缓存，可随时释放）
 *   - 空闲 = free（完全未被使用的内存）
 *   三者之和 = (used-buffcache) + buffcache + free = used + free = total ✅
 *   - 交换 = swapused（黄色），百分比基于 swaptotal
 *   - 四个 donut 环并排显示：红=已用、青=缓存、绿=空闲、黄=交换
 *
 * 依赖：systeminformation（系统数据）、blessed-contrib（donut 组件）
 */

import * as si from 'systeminformation';
import * as contrib from 'blessed-contrib';

class MemoryMonitor {
  // blessed-contrib 的 donut 组件实例，负责绘制环形图
  donut: contrib.Widgets.PictureElement;

  // 定时器 ID，用于销毁时停止采集
  interval: NodeJS.Timeout | null = null;

  /**
   * @param donut - blessed-contrib 创建好的 donut 组件（已在 grid 中定位）
   */
  constructor(donut: contrib.Widgets.PictureElement) {
    this.donut = donut;
  }

  /**
   * 启动监控：
   * 1. 立即采集一次数据并渲染
   * 2. 设置每秒定时器持续更新
   */
  init() {
    // 先执行一次 mem() 确保 systeminformation 可用，再启动定时器
    si.mem().then(() => {
      this.updateData();
      this.interval = setInterval(() => {
        this.updateData();
      }, 1000); // 每次更新间隔 1 秒
    });
  }

  /**
   * 采集数据并更新 donut 图表
   *
   * 流程：
   *   采集 → 计算百分比 → 格式化标签 → 传给 donut.setData() 渲染
   */
  updateData() {
    si.mem().then((data) => {
      // ===== Step 1：提取原始数据 =====
      const total = data.total;
      const used = Math.max(0, data.used - data.buffcache); // 应用真实占用 = 总占用 - 缓存
      const cached = data.buffcache;
      const free = data.free;

      // ===== Step 2：计算各项占总量的百分比（0~1 小数） =====
      const usedPercent = total > 0 ? used / total : 0;
      const cachedPercent = total > 0 ? cached / total : 0;
      const freePercent = total > 0 ? free / total : 0;

      // ===== Step 3：格式化工具函数（字节 → 人类可读如 "7.8G"） =====
      const fmt = (bytes: number) =>
        (bytes / 1024 / 1024 / 1024).toFixed(1) + 'G';

      // ===== Step 4：构建 donut 数据 =====
      // bless-contrib donut 的 setData 接收数组，每项为一个独立的环形图：
      //   - percent: 0~1 小数（如 0.45 = 45%）
      //   - label: 显示在环下方的标签（纯中文，对齐用）
      //   - color: 环的颜色
      // 注意：标签只放名称不放数值，因为中文 + 数字混排时 measureText 计算不准
      const donutData = [
        {
          percent: parseFloat(usedPercent.toFixed(3)),
          label: '已用',
          color: 'red',
        },
        {
          percent: parseFloat(cachedPercent.toFixed(3)),
          label: '缓存',
          color: 'cyan',
        },
        {
          percent: parseFloat(freePercent.toFixed(3)),
          label: '空闲',
          color: 'green',
        },
        {
          percent:
            data.swaptotal > 0
              ? parseFloat((data.swapused / data.swaptotal).toFixed(3))
              : 0,
          label: '交换',
          color: 'yellow',
        },
      ];

      // 调用 setData → 内部 update → 绘制到 Canvas → screen.render 刷新
      this.donut.setData(donutData);
    });
  }

  /**
   * 销毁定时器，释放资源（页面退出时调用）
   */
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default MemoryMonitor;
