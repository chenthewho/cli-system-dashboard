# OrderGoodsPanel 组件集成指南

本文档说明如何在 `pages/cashier/cashier.vue` 中集成 `OrderGoodsPanel` 组件。

## 集成步骤

### 1. 导入组件

在 `cashier.vue` 的 `<script>` 部分添加导入：

```javascript
import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue';

export default {
  components: {
    // ... 其他组件
    OrderGoodsPanel
  },
  // ...
}
```

### 2. 替换原有代码

找到 `cashier.vue` 第 139-204 行的代码，替换为：

```vue
<!-- 原代码：第 139-204 行 -->
<div class="card-body">
  <div class="modern-table-header">
    <!-- ... 表头和商品列表代码 ... -->
  </div>
  <!-- ... 其他代码 ... -->
</div>

<!-- 替换为： -->
<OrderGoodsPanel
  :goodsList="goodSelect"
  :totalAmount="payAmount.total"
  :shippingFee="cashier.shippingFee"
  @name-click="memberChange('XiaDan')"
  @item-click="handleItemClick"
  @delete-item="deleteItem"
  @shipping-click="showShippingModal"
  @hang-order="hangOrder"
  @checkout="orderCreate"
/>
```

### 3. 添加事件处理方法

如果 `handleItemClick` 方法不存在，在 methods 中添加：

```javascript
methods: {
  // ... 其他方法
  
  // 处理商品行点击事件
  handleItemClick({ item, index }) {
    this.showStep2(item, index);
  },
  
  // ... 其他方法
}
```

### 4. 完整替换示例

```vue
<template>
  <div>
    <default-header ...></default-header>
    <div class="container">
      <div class="cashier" @click="closeKeyBoard">
        <div class="cashier-row">
          <!-- 左侧商品选择面板 -->
          <div class="cashier-col cashier-goods">
            <div class="card-body">
              <CashierGoodsPanel ... />
            </div>
          </div>
          
          <!-- 右侧订单区域 -->
          <div v-if="step1" class="cashier-card">
            <div class="cashier-col">
              <!-- 客户管理区域 -->
              <div class="card-title">
                <scroll-view ...>
                  <!-- 客户按钮列表 -->
                </scroll-view>
              </div>
              
              <!-- 订单商品面板组件 -->
              <OrderGoodsPanel
                :goodsList="goodSelect"
                :totalAmount="payAmount.total"
                :shippingFee="cashier.shippingFee"
                @name-click="memberChange('XiaDan')"
                @item-click="handleItemClick"
                @delete-item="deleteItem"
                @shipping-click="showShippingModal"
                @hang-order="hangOrder"
                @checkout="orderCreate"
              />
            </div>
          </div>
          
          <!-- 编辑商品键盘 -->
          <GoodEditKeyboard v-if="!step1" ... />
        </div>
        
        <!-- 其他弹窗和组件 -->
      </div>
    </div>
  </div>
</template>

<script>
import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue';

export default {
  components: {
    OrderGoodsPanel,
    // ... 其他组件
  },
  methods: {
    // 处理商品行点击事件
    handleItemClick({ item, index }) {
      this.showStep2(item, index);
    },
    
    // 其他已有方法保持不变
    memberChange(type) { /* ... */ },
    deleteItem(item) { /* ... */ },
    showShippingModal() { /* ... */ },
    hangOrder() { /* ... */ },
    orderCreate() { /* ... */ }
  }
}
</script>
```

### 5. 样式处理

组件自带完整样式，无需额外添加 CSS。如需自定义，可以在 `cashier.vue` 中添加：

```vue
<style lang="scss" scoped>
// ... 原有样式保持不变

// 如需覆盖组件样式，使用深度选择器
::v-deep .order-goods-panel {
  // 自定义样式
}
</style>
```

## 使用组件的好处

### 1. 代码复用
- 可在多个页面使用相同的订单展示组件
- 统一的 UI 和交互体验

### 2. 维护性
- 集中管理订单列表相关代码
- 修改样式或功能时只需更新组件

### 3. 可测试性
- 组件独立，便于单元测试
- 示例文件可用于快速测试

### 4. 解耦
- 业务逻辑与展示分离
- 通过 props 和 events 通信

## 在其他页面使用

### 示例：订单管理页面

```vue
<template>
  <div class="order-management-page">
    <OrderGoodsPanel
      :goodsList="currentOrder.items"
      :totalAmount="currentOrder.total"
      :shippingFee="currentOrder.shipping"
      @item-click="editOrderItem"
      @delete-item="removeOrderItem"
      @shipping-click="updateShipping"
      @hang-order="saveAsDraft"
      @checkout="completeOrder"
    />
  </div>
</template>

<script>
import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue';

export default {
  components: {
    OrderGoodsPanel
  },
  data() {
    return {
      currentOrder: {
        items: [],
        total: 0,
        shipping: 0
      }
    }
  },
  methods: {
    editOrderItem({ item, index }) {
      // 编辑订单项
    },
    removeOrderItem(item) {
      // 删除订单项
    },
    updateShipping() {
      // 更新运费
    },
    saveAsDraft() {
      // 保存草稿
    },
    completeOrder() {
      // 完成订单
    }
  }
}
</script>
```

### 示例：订单详情页面（只读模式）

如需只读模式，可以扩展组件或在父组件中控制事件：

```vue
<template>
  <div class="order-detail-page">
    <OrderGoodsPanel
      :goodsList="orderDetail.items"
      :totalAmount="orderDetail.total"
      :shippingFee="orderDetail.shipping"
      @name-click="() => {}"
      @item-click="() => {}"
      @delete-item="() => {}"
      @shipping-click="() => {}"
      @hang-order="() => {}"
      @checkout="() => {}"
    />
  </div>
</template>
```

或者在组件中添加 `readonly` prop：

```javascript
// OrderGoodsPanel.vue 扩展
props: {
  readonly: {
    type: Boolean,
    default: false
  }
}

// 在模板中使用
<div v-if="!readonly" class="cell-action" @click.stop="handleDelete(item)">
  <u-icon name="trash" color="#ff6b6b" size="22"></u-icon>
</div>
```

## 注意事项

1. **数据格式**：确保传入的 `goodsList` 符合组件要求的数据结构
2. **事件处理**：所有事件处理器都是可选的，根据需要监听
3. **样式冲突**：如遇样式冲突，使用深度选择器调整
4. **响应式**：组件已适配多种屏幕尺寸，无需额外处理
5. **依赖库**：确保项目中已安装 uView UI 和 uni-icons

## 疑难解答

### Q: 组件显示空白
A: 检查父容器是否有明确的高度，组件会占满父容器

### Q: 样式显示异常
A: 确认是否有全局样式覆盖，使用浏览器开发工具检查

### Q: 事件不触发
A: 检查事件名称是否正确（使用短横线命名，如 `@name-click`）

### Q: 图标不显示
A: 确认 uView UI 和 uni-icons 已正确安装和配置

## 技术支持

如有问题，请查看：
- `README.md` - 组件文档
- `example.vue` - 使用示例
- `OrderGoodsPanel.vue` - 源代码

