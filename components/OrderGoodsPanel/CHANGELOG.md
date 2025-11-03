# Changelog

所有 OrderGoodsPanel 组件的重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2025-10-30

### ✨ 新增
- 🎉 初始版本发布
- 📋 商品列表展示功能
  - 名称、数量、单价、重量、小计列展示
  - 支持附加商品（如押筐）标签显示
  - 自动计算净重（总重-皮重）
- 🗑️ 商品删除功能
  - 每行商品可单独删除
  - 点击删除图标触发 delete-item 事件
- 💰 总计金额显示
  - 实时显示购物车总金额
  - 渐变色高亮显示
- 🚚 运费信息展示
  - 可点击编辑运费
  - 支持运费为0时的显示
- 🎯 操作按钮
  - 挂单按钮
  - 结账按钮
  - 现代化按钮样式和交互效果
- 📱 响应式设计
  - 适配 1024px 及以下屏幕
  - 适配 1366px 屏幕
  - 适配 1920px 及以上大屏
- 🎨 空状态提示
  - 当商品列表为空时显示友好提示
  - 图标 + 文字提示
- 🖱️ 交互效果
  - 商品行 hover 效果
  - 删除按钮 hover 放大效果
  - 按钮点击反馈效果
  - 运费区域 hover 效果

### 📝 文档
- README.md - 组件使用文档
- INTEGRATION_GUIDE.md - 集成指南
- example.vue - 使用示例
- types.ts - TypeScript 类型定义
- test.spec.js - 单元测试示例

### 🎯 事件系统
- `name-click` - 点击表头名称
- `item-click` - 点击商品行
- `delete-item` - 删除商品
- `shipping-click` - 点击运费
- `hang-order` - 挂单
- `checkout` - 结账

### 🎨 样式特性
- 现代简洁风格
- 渐变色设计
- 阴影效果
- 过渡动画
- 响应式布局
- 移动端友好

### 🔧 技术特性
- Vue 2/3 兼容
- 完全组件化
- Props 和 Events 通信
- Scoped CSS 样式隔离
- SCSS 预处理器
- TypeScript 类型支持

## [未来计划]

### 🚀 计划中的功能
- [ ] 只读模式支持
- [ ] 批量删除功能
- [ ] 商品排序功能
- [ ] 搜索过滤功能
- [ ] 虚拟滚动优化（大数据量）
- [ ] 拖拽排序
- [ ] 导出功能（Excel/PDF）
- [ ] 打印预览
- [ ] 自定义列显示
- [ ] 商品分类分组
- [ ] 折扣优惠显示
- [ ] 会员价显示
- [ ] 库存预警提示

### 🎨 样式增强
- [ ] 主题色自定义
- [ ] 暗黑模式
- [ ] 多语言支持
- [ ] 无障碍访问支持
- [ ] 自定义图标支持

### 🔧 技术优化
- [ ] 性能优化
- [ ] 单元测试覆盖
- [ ] E2E 测试
- [ ] CI/CD 集成
- [ ] npm 包发布
- [ ] CDN 支持

## 版本说明

### 版本号格式
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 标签说明
- ✨ 新增 (Added)
- 🔄 变更 (Changed)
- ⚠️ 废弃 (Deprecated)
- 🗑️ 移除 (Removed)
- 🐛 修复 (Fixed)
- 🔒 安全 (Security)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交格式
```
<类型>(<范围>): <主题>

<正文>

<脚注>
```

### 类型
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

## 许可证

MIT License

---

**注意**：本 CHANGELOG 遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范。

