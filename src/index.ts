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
 *   │  内存 donut (8×6)          │  磁盘 bar (8×6)      │
 *   │                             │                      │
 *   └───────────────────────────────────────────────────┘
 *
 * 依赖：blessed（终端 UI）、blessed-contrib（仪表盘组件）
 */

import blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import CpuMonitor from './monitor/cpu.js';
import MemoryMonitor from './monitor/memory.js';
import DiskMonitor from './monitor/disk.js';

// ===== Step 1：创建终端屏幕（全屏画布） =====
const screen = blessed.screen({
  fullUnicode: true, // 支持中文和 Unicode 字符
});

// ===== Step 2：创建 12×12 网格布局 =====
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen,
});

// ===== Step 3：放置监控面板 =====

// CPU 面板：占据顶部 0-3 行，全部 12 列
const cpuLineChart = grid.set(0, 0, 4, 12, contrib.line, {
  label: 'CPU 占用',
  showLegend: true,
});

// 内存面板：占据 4-11 行（8行），左半 0-5 列
const memoryDonut = grid.set(4, 0, 8, 6, contrib.donut, {
  label: '内存使用',
  radius: 10,      // 环形半径（空间大了，可以用大一点的环）
  arcWidth: 4,     // 环的厚度
  yPadding: 4,     // 垂直内边距，给标签留足空间
});

// 磁盘面板：占据 4-11 行（8行），右半 6-11 列
const diskBar = grid.set(4, 6, 8, 6, contrib.bar, {
  label: '磁盘使用',
  barWidth: 4,        // 细柱体，不挤占标签空间
  barSpacing: 16,     // 柱间距充裕，文字不会堆叠
  xOffset: 2,         // 左侧留白
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
