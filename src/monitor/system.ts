/**
 * SystemMonitor - 系统信息模块
 *
 * 职责：每 2 秒更新系统基本信息，展示在底部面板。
 *
 * 数据来源：
 *   - si.osInfo() — 主机名、发行版、内核版本、架构
 *   - si.time() — 系统运行时间（uptime 秒数）
 *   - si.currentLoad() — 负载均值 avgLoad 和当前 CPU 使用率
 *
 * 展示效果：
 *   主机: ubuntu     系统: Ubuntu 24.04     内核: 6.8.0-101
 *   运行: 3天 12时   负载: 0.15     使用: 6.5%
 *
 * 依赖：systeminformation、blessed
 */

import * as si from 'systeminformation';
import blessed from 'blessed';

class SystemMonitor {
  box: any;
  interval: NodeJS.Timeout | null = null;

  constructor(box: any) {
    this.box = box;
  }

  /**
   * 启动监控
   */
  init() {
    // 系统信息不需要频繁刷新，但为了一致性用 2 秒
    this.updateData();
    this.interval = setInterval(() => {
      this.updateData();
    }, 2000);
  }

  /**
   * 格式化秒数为人类可读的时间
   * e.g. 302400 → "3天 12时"
   */
  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}天 ${hours}时 ${mins}分`;
    return `${hours}时 ${mins}分`;
  }

  /**
   * 采集数据并更新显示
   */
  updateData() {
    Promise.all([si.osInfo(), si.time(), si.currentLoad()]).then(
      ([osInfo, timeInfo, loadInfo]) => {
        // 第一行：主机名 + 系统版本 + 内核版本
        const line1 = [
          `主机: ${osInfo.hostname}`,
          `系统: ${osInfo.distro}`,
          `内核: ${osInfo.kernel}`,
        ].join('    ');

        // 第二行：运行时间 + 负载 + CPU 使用率
        const uptimeStr = this.formatUptime(timeInfo.uptime);
        const line2 = [
          `运行: ${uptimeStr}`,
          `负载: ${loadInfo.avgLoad.toFixed(2)}`,
          `CPU使用: ${loadInfo.currentLoad.toFixed(1)}%`,
        ].join('    ');

        // 居中显示
        const content = '\n\n  ' + line1 + '\n  ' + line2;

        this.box.setContent(content);
        this.box.screen.render();
      }
    );
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default SystemMonitor;
