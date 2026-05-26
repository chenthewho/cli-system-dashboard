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
 *   │  内存 donut (4×6)  │  磁盘（预留，4×6）            │
 *   │  温度/进程（预留，4×12）                           │
 *   └────────────────────────────────────────────────────┘
 *
 * 依赖：blessed（终端 UI）、blessed-contrib（仪表盘组件）
 */

import blessed from 'blessed';
import * as contrib from 'blessed-contrib';
import CpuMonitor from './monitor/cpu.js';
import MemoryMonitor from './monitor/memory.js';

// ===== Step 1：创建终端屏幕（全屏画布） =====
const screen = blessed.screen({
  fullUnicode: true, // 支持中文和 Unicode 字符
});

// ===== Step 2：创建 12×12 网格布局 =====
// grid 将屏幕分成 12 行 × 12 列，每个面板通过 set(row, col, rowSpan, colSpan) 定位
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen,
});

// ===== Step 3：放置监控面板 =====

// CPU 面板：占据顶部 0-3 行，全部 12 列，使用折线图（line chart）
const cpuLineChart = grid.set(0, 0, 4, 12, contrib.line, {
  label: 'CPU 占用',
  showLegend: true, // 显示图例（CPU1, CPU2, ...）
});

// 内存面板：占据左下 4-7 行，左半 0-5 列，使用环形图（donut chart）
const memoryDonut = grid.set(4, 0, 4, 6, contrib.donut, {
  label: '内存使用',
  radius: 8,       // 环形半径（像素）
  arcWidth: 4,     // 环的厚度（像素）
  yPadding: 2,     // 垂直内边距，防止标签被裁切
});

// ===== Step 4：首次渲染（设置好布局后必须调用一次） =====
screen.render();

// ===== Step 5：注册退出快捷键 =====
screen.key('C-c', function () {
  screen.destroy(); // 销毁终端 UI，恢复普通终端
});

// ===== Step 6：启动监控器 =====
// 每个 Monitor 类负责：定时采集数据 → 更新对应 widget → 触发重绘
new CpuMonitor(cpuLineChart).init();
new MemoryMonitor(memoryDonut).init();
