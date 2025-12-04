import blessed from 'blessed';
import contrib from 'blessed-contrib';
import CpuMonitor from './monitor/cpu.js';

const screen = blessed.screen({
  fullUnicode: true,
});

const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen,
});

const cpuLineChart = grid.set(0, 0, 4, 12, contrib.line, {
  label: 'CPU 占用',
  showLegend: true,
});

screen.render();

screen.key('C-c', function() {
    screen.destroy();
})

new CpuMonitor(cpuLineChart).init();