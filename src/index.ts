/**
 * index.ts - CLI 系统监控仪表盘主入口
 *
 * 整体架构：
 *   1. 创建 blessed screen（终端全屏画布）
 *   2. 创建 12×12 的 contrib grid（网格布局系统）
 *   3. 在网格中放置各个监控面板（widget）
 *   4. 每个面板由一个 Monitor 类驱动（采集数据 → 更新 widget）
 *
 * 当前面板布局：
 *   ┌────────────── CPU 折线图 (4行×12列) ──────────────┐
 *   │  内存 donut (4×6)    │  磁盘 bar (4×6)            │
 *   │  系统信息（预留，4×12）                            │
 *   └────────────────────────────────────────────────────┘
 *
 * 依赖：blessed（终端 UI）、blessed-contrib（仪表盘组件）
 */

import blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import CpuMonitor from './monitor/cpu.js';
import MemoryMonitor from './monitor/memory.js';
import DiskMonitor from './monitor/disk.js';

// ===== Step 1：创建终端屏幕 =====
const screen = blessed.screen({
  fullUnicode: true,
});

// ===== Step 2：创建 12×12 网格布局 =====
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen,
});

// ===== Step 3：放置监控面板 =====

// CPU 面板：顶部 0-3 行，全宽
const cpuLineChart = grid.set(0, 0, 4, 12, contrib.line, {
  label: 'CPU 占用',
  showLegend: true,
});

// 内存面板：4-7 行，左半 0-5 列
const memoryDonut = grid.set(4, 0, 4, 6, contrib.donut, {
  label: '内存使用',
  radius: 8,
  arcWidth: 4,
  yPadding: 2,
});

// 磁盘面板：4-7 行，右半 6-11 列
const diskBar = grid.set(4, 6, 4, 6, contrib.bar, {
  label: '磁盘使用',
  barWidth: 4,        // 细柱体
  barSpacing: 14,     // 充裕间距
  xOffset: 2,
});

// ===== Step 4：首次渲染 =====
screen.render();

// ===== Step 5：退出快捷键 =====
screen.key('C-c', function () {
  screen.destroy();
});

// ===== Step 6：启动监控器 =====
new CpuMonitor(cpuLineChart).init();
new MemoryMonitor(memoryDonut).init();
new DiskMonitor(diskBar).init();
