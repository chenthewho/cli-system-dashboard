# FilterDropdown 筛选下拉组件

一个可复用的筛选下拉组件，支持单选模式，带有蓝色主题高亮效果。

## 功能特性

- ✅ 单选模式
- ✅ 自动显示当前选中项的标签
- ✅ 蓝色渐变主题的激活状态
- ✅ 点击外部自动关闭
- ✅ 平滑动画过渡
- ✅ 支持自定义选项列表

## 使用方法

### 1. 引入组件

```vue
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown.vue'

export default {
  components: {
    FilterDropdown
  }
}
```

### 2. 准备数据

```javascript
data() {
  return {
    currentValue: 'option1',
    options: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' }
    ]
  }
}
```

### 3. 使用组件

```vue
<FilterDropdown 
  ref="myFilter"
  :options="options" 
  v-model="currentValue"
  @change="handleChange" 
/>
```

## Props

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| options | Array | 是 | - | 选项列表，格式：`[{ label: '显示文本', value: '值' }]` |
| value | String | 否 | '' | 当前选中的值（支持 v-model） |
| panelClass | String | 否 | '' | 下拉面板的额外类名，用于自定义定位 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| input | value | v-model 双向绑定事件 |
| change | value | 选项变化时触发 |
| open | - | 下拉框打开时触发 |
| close | - | 下拉框关闭时触发 |

## Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| close | - | 外部调用关闭下拉框 |

## 示例：多个筛选器互斥

当同时使用多个筛选器时，可以通过 `@open` 事件关闭其他筛选器：

```vue
<FilterDropdown 
  ref="filter1"
  :options="options1" 
  v-model="value1"
  @open="closeOtherFilters('filter1')"
/>

<FilterDropdown 
  ref="filter2"
  :options="options2" 
  v-model="value2"
  @open="closeOtherFilters('filter2')"
/>
```

```javascript
methods: {
  closeOtherFilters(current) {
    if (current !== 'filter1' && this.$refs.filter1) {
      this.$refs.filter1.close();
    }
    if (current !== 'filter2' && this.$refs.filter2) {
      this.$refs.filter2.close();
    }
  }
}
```

## 样式定制

组件使用了 scoped 样式，如需定制，可以通过以下方式：

1. 修改组件内的 CSS 变量（如果有）
2. 使用 `::v-deep` 穿透样式
3. 直接修改组件源码

## 注意事项

1. 选项数组中的每个选项必须包含 `label` 和 `value` 两个字段
2. 下拉面板使用绝对定位，确保父容器有合适的定位上下文
3. 遮罩层使用 `fixed` 定位，z-index 为 999

