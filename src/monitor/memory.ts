import * as si from 'systeminformation';
import * as contrib from 'blessed-contrib';

class MemoryMonitor {
  donut: contrib.Widgets.PictureElement;
  interval: NodeJS.Timeout | null = null;

  constructor(donut: contrib.Widgets.PictureElement) {
    this.donut = donut;
  }

  init() {
    si.mem().then(() => {
      this.updateData();
      this.interval = setInterval(() => {
        this.updateData();
      }, 1000);
    });
  }

  updateData() {
    si.mem().then((data) => {
      const total = data.total;
      const used = Math.max(0, data.active - data.buffcache);
      const cached = data.buffcache;
      const free = data.free;

      const usedPercent = total > 0 ? used / total : 0;
      const cachedPercent = total > 0 ? cached / total : 0;
      const freePercent = total > 0 ? free / total : 0;

      const fmt = (bytes: number) => (bytes / 1024 / 1024 / 1024).toFixed(1) + 'G';
      const totalStr = fmt(total);

      const donutData = [
        {
          percent: parseFloat(usedPercent.toFixed(3)),
          label: '已用 ' + fmt(used),
          color: 'red',
        },
        {
          percent: parseFloat(cachedPercent.toFixed(3)),
          label: '缓存 ' + fmt(cached),
          color: 'cyan',
        },
        {
          percent: parseFloat(freePercent.toFixed(3)),
          label: '空闲 ' + fmt(free),
          color: 'green',
        },
      ];

      this.donut.setData(donutData);
    });
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default MemoryMonitor;
