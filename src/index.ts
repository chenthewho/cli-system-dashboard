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
 *   ┌────────────── CPU 折线图 (3行×12列) ──────────────┐
 *   │  内存 donut (3×6)     │  磁盘文字 (3×6)           │
 *   │  网络流量 (2×12)                                  │
 *   │  系统信息 (4×12)                                  │
 *   └───────────────────────────────────────────────────┘
 *
 * 依赖：blessed（终端 UI）、blessed-contrib（仪表盘组件）
 */

import blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import CpuMonitor from './monitor/cpu.js';
import MemoryMonitor from './monitor/memory.js';
import DiskMonitor from './monitor/disk.js';
import SystemMonitor from './monitor/system.js';
import NetworkMonitor from './monitor/network.js';

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

// CPU 面板：0-2 行，全宽
const cpuLineChart = grid.set(0, 0, 3, 12, contrib.line, {
  label: 'CPU 占用',
  showLegend: true,
});

// 内存面板：3-5 行，左半 0-5 列
const memoryDonut = grid.set(3, 0, 3, 6, contrib.donut, {
  label: '内存使用',
  radius: 6,
  arcWidth: 3,
  yPadding: 2,
});

// 磁盘面板：3-5 行，右半 6-11 列
const diskBox = grid.set(3, 6, 3, 6, blessed.box, {
  label: '磁盘使用',
  border: 'line',
  content: '加载中...',
});

// 网络面板：6-7 行，全宽
const networkBox = grid.set(6, 0, 2, 12, blessed.box, {
  label: '网络流量',
  border: 'line',
  content: '加载中...',
});

// 系统信息面板：8-11 行，全宽
const systemBox = grid.set(8, 0, 4, 12, blessed.box, {
  label: '系统信息',
  border: 'line',
  content: '加载中...',
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
new DiskMonitor(diskBox).init();
new NetworkMonitor(networkBox).init();
new SystemMonitor(systemBox).init();
