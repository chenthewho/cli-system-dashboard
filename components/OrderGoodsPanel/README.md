# OrderGoodsPanel 组件

订单商品列表组件，用于展示购物车商品、总计金额和操作按钮。

## 功能特性

- ✅ 商品列表展示（名称、数量、单价、重量、小计）
- ✅ 空状态提示
- ✅ 商品删除功能
- ✅ 总计金额显示
- ✅ 运费信息展示和编辑
- ✅ 挂单和结账按钮
- ✅ 响应式设计
- ✅ 现代化的 UI 样式

## 使用方法

### 1. 导入组件

```javascript
import OrderGoodsPanel from '@/components/OrderGoodsPanel/OrderGoodsPanel.vue';

export default {
  components: {
    OrderGoodsPanel
  }
}
```

### 2. 在模板中使用

```vue
<template>
  <div class="page-container">
    <OrderGoodsPanel
      :goodsList="goodSelect"
      :totalAmount="payAmount.total"
      :shippingFee="cashier.shippingFee"
      @name-click="handleNameClick"
      @item-click="handleItemClick"
      @delete-item="handleDeleteItem"
      @shipping-click="handleShippingClick"
      @hang-order="handleHangOrder"
      @checkout="handleCheckout"
    />
  </div>
</template>
```

### 3. 完整示例

```vue
<template>
  <div class="order-page">
    <OrderGoodsPanel
      :goodsList="goodSelect"
      :totalAmount="payAmount.total"
      :shippingFee="cashier.shippingFee"
      @name-click="memberChange('XiaDan')"
      @item-click="showStep2"
      @delete-item="deleteItem"
      @shipping-click="showShippingModal"
      @hang-order="hangOrder"
      @checkout="orderCreate"
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
      // 商品列表
      goodSelect: [
        {
          key: 'item1',
          id: '001',
          skuName: '商品名称',
          quantity: 2,
          referenceAmount: 10.5,
          allweight: 2.5,
          carweight: 0.5,
          money2: 21.0,
          extralModel: {
            id: '',
            name: '',
            quantity: 0
          }
        }
      ],
      // 支付金额
      payAmount: {
        total: 21.0
      },
      // 收银信息
      cashier: {
        shippingFee: 0
      }
    }
  },
  methods: {
    // 点击表头名称 - 选择客户
    memberChange(type) {
      console.log('选择客户', type);
    },
    
    // 点击商品行 - 编辑商品
    showStep2({ item, index }) {
      console.log('编辑商品', item, index);
    },
    
    // 删除商品
    deleteItem(item) {
      const index = this.goodSelect.findIndex(g => g.key === item.key);
      if (index !== -1) {
        this.goodSelect.splice(index, 1);
        // 重新计算总金额
        this.calculateTotal();
      }
    },
    
    // 点击运费 - 设置运费
    showShippingModal() {
      console.log('设置运费');
    },
    
    // 挂单
    hangOrder() {
      if (this.goodSelect.length === 0) {
        uni.showToast({
          title: '购物车为空',
          icon: 'none'
        });
        return;
      }
      console.log('挂单', this.goodSelect);
    },
    
    // 结账
    orderCreate() {
      if (this.goodSelect.length === 0) {
        uni.showToast({
          title: '购物车为空',
          icon: 'none'
        });
        return;
      }
      console.log('结账', this.goodSelect);
    },
    
    // 计算总金额
    calculateTotal() {
      let total = 0;
      this.goodSelect.forEach(item => {
        total += parseFloat(item.money2 || 0);
      });
      this.payAmount.total = total.toFixed(2);
    }
  }
}
</script>

<style scoped>
.order-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| goodsList | Array | [] | 商品列表数组 |
| totalAmount | Number/String | 0 | 总计金额 |
| shippingFee | Number/String | 0 | 运费 |

### goodsList 数据结构

```javascript
{
  key: 'unique_key',           // 唯一标识
  id: 'goods_id',              // 商品 ID
  skuName: '商品名称',          // 商品名称
  quantity: 2,                 // 数量
  referenceAmount: 10.5,       // 单价
  allweight: 2.5,              // 总重量
  carweight: 0.5,              // 皮重
  money2: 21.0,                // 小计金额
  extralModel: {               // 附加商品（如押筐）
    id: '',                    // 附加商品 ID
    name: '',                  // 附加商品名称
    quantity: 0                // 附加商品数量
  }
}
```

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| name-click | - | 点击表头名称时触发 |
| item-click | { item, index } | 点击商品行时触发 |
| delete-item | item | 点击删除按钮时触发 |
| shipping-click | - | 点击运费信息时触发 |
| hang-order | - | 点击挂单按钮时触发 |
| checkout | - | 点击结账按钮时触发 |

## 样式定制

组件使用了 scoped 样式，如需自定义样式，可以通过以下方式：

### 1. 通过深度选择器修改样式

```vue
<style scoped>
/* 修改表头背景色 */
::v-deep .modern-table-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

/* 修改按钮样式 */
::v-deep .btn-submit {
  border-radius: 12px;
}
</style>
```

### 2. 使用 class 覆盖

```vue
<template>
  <OrderGoodsPanel 
    class="custom-panel"
    :goodsList="goodSelect"
  />
</template>

<style>
.custom-panel .modern-table-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}
</style>
```

## 注意事项

1. 确保传入的 `goodsList` 数据结构完整
2. 商品列表项需要有唯一的 `key` 属性
3. 组件使用了 `u-icon` 和 `uni-icons`，请确保项目中已引入相关组件库
4. 组件高度会自动占满父容器，请确保父容器有明确的高度
5. 响应式设计适配了 1024px、1366px 和 1920px 屏幕

## 依赖

- uView UI（u-icon 组件）
- uni-icons（图标组件）

## 浏览器兼容性

- Chrome (推荐)
- Edge
- Firefox
- Safari
- 移动端浏览器

