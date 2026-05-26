/**
 * NetworkMonitor - 网络流量监控模块
 *
 * 职责：每 2 秒采集网卡流量，文字展示各网卡实时吞吐量。
 *
 * 数据来源：systeminformation 的 networkStats()
 *   返回网卡数组：{iface, rx_sec, tx_sec, rx_bytes, tx_bytes, ...}
 *   - rx_sec / tx_sec: 每秒速率（字节），首次调用为 null
 *   - 需要连续调用两次才能得到速率数据
 *
 * 展示效果：
 *   eth0  ↓ 12.3 MB/s    ↑ 5.1 MB/s
 *
 * 依赖：systeminformation、blessed
 */

import * as si from 'systeminformation';
import blessed from 'blessed';

// 物理网卡命名规则：Linux(eth/ens/enp/wlan) + macOS(en0-en9) + 通用(enx)
const VALID_IFACE = /^(eth|ens|enp|wlan|wlp|enx|en\d+$)/;

class NetworkMonitor {
  box: any;
  interval: NodeJS.Timeout | null = null;
  firstRun = true; // 标记首次运行（速率数据需要两次采样）

  constructor(box: any) {
    this.box = box;
  }

  init() {
    // 先触发两次采样获取速率基线
    si.networkStats();
    setTimeout(() => {
      this.updateData();
      this.interval = setInterval(() => {
        this.updateData();
      }, 2000);
    }, 2000);
  }

  /**
   * 格式化速率：字节/秒 → 人类可读
   */
  formatSpeed(bytesPerSec: number | null): string {
    if (bytesPerSec == null || bytesPerSec === 0) return '0 B/s';
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let value = bytesPerSec;
    let unitIndex = 0;
    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      unitIndex++;
    }
    return value >= 100
      ? `${value.toFixed(0)} ${units[unitIndex]}`
      : `${value.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * 采集数据并更新显示
   */
  updateData() {
    si.networkStats().then((interfaces) => {
      // 过滤：只要物理网卡
      const valid = interfaces.filter(
        (iface) =>
          VALID_IFACE.test(iface.iface) && iface.operstate !== 'down'
      );

      if (valid.length === 0) {
        this.box.setContent('\n  无活跃网卡');
        this.box.screen.render();
        return;
      }

      // 每行一个网卡：iface ↓ 速率 ↑ 速率
      const lines = valid.map((iface) => {
        const name = iface.iface.padEnd(8);
        const down = this.formatSpeed(iface.rx_sec);
        const up = this.formatSpeed(iface.tx_sec);
        return `  ${name} ↓ ${down.padStart(10)}  ↑ ${up.padStart(10)}`;
      });

      this.box.setContent('\n' + lines.join('\n'));
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

export default NetworkMonitor;
