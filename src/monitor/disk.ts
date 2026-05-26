/**
 * DiskMonitor - 磁盘监控模块（文字版水平条）
 *
 * 职责：每 2 秒采集磁盘使用情况，用 Unicode 方块字符画水平条展示。
 *
 * 数据来源：systeminformation 的 fsSize()
 *   返回数组，每项代表一个挂载点：
 *   - fs: 挂载路径（如 '/'、'/home'）
 *   - size: 分区总大小
 *   - used: 已用大小
 *   - use: 使用率百分比（如 78.5）
 *
 * 展示效果：
 *   /     ████████████████████░░░░░░░░ 78%
 *   /home ████████░░░░░░░░░░░░░░░░░░░░ 34%
 *   磁盘使用
 *
 * 依赖：systeminformation、blessed（box 组件）
 */

import * as si from 'systeminformation';
import blessed from 'blessed';

// 水平条总宽度（字符数），█ 代表已用、░ 代表空闲
const BAR_WIDTH = 34;

class DiskMonitor {
  box: any; // blessed.box 实例
  interval: NodeJS.Timeout | null = null;

  constructor(box: any) {
    this.box = box;
  }

  /**
   * 启动监控：每 2 秒更新
   */
  init() {
    si.fsSize().then(() => {
      this.updateData();
      this.interval = setInterval(() => {
        this.updateData();
      }, 2000);
    });
  }

  /**
   * 格式化单个磁盘条目
   * @param label 挂载点名称
   * @param percent 使用率（0-100）
   * @param total 总容量（字节）
   * @returns 格式化后的行文本
   */
  formatDisk(label: string, percent: number, total: number): string {
    // 计算已用块的个数
    const filled = Math.round((percent / 100) * BAR_WIDTH);
    const empty = BAR_WIDTH - filled;

    // 构建水平条：█ = 已用、░ = 空闲
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    // 容量格式化（GB）
    const totalGB = (total / 1024 / 1024 / 1024).toFixed(0) + 'G';

    // 对齐标签到 6 字符宽
    const paddedLabel = label.padEnd(6);

    return ` ${paddedLabel} ${bar} ${percent.toFixed(0)}%`;
  }

  /**
   * 采集数据并更新显示
   */
  updateData() {
    si.fsSize().then((drives) => {
      // 过滤虚拟文件系统
      const realDrives = drives.filter(
        (d) =>
          d.size > 0 &&
          !d.fs.startsWith('/sys') &&
          !d.fs.startsWith('/proc') &&
          !d.fs.startsWith('/run') &&
          !d.fs.startsWith('/snap') &&
          !d.fs.match(/^\/dev\/?$/)
      );

      if (realDrives.length === 0) {
        this.box.setContent('无可用磁盘分区');
        this.box.screen.render();
        return;
      }

      // 格式化每行：{label} {bar} {percent}%
      const lines = realDrives.map((d) =>
        this.formatDisk(d.fs, d.use, d.size)
      );

      // 顶部留空、底部显示标题
      const content = '\n' + lines.join('\n') + '\n\n              磁盘使用';

      this.box.setContent(content);
      this.box.screen.render();
    });
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default DiskMonitor;
