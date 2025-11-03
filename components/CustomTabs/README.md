# CustomTabs 自定义标签页组件

修复了首次打开页面或使用 v-show 时下划线显示不正常的问题。

## 特性

- ✅ 修复首次加载下划线显示异常
- ✅ 支持 v-show 切换场景
- ✅ 自动监听可见性变化
- ✅ 支持手动刷新
- ✅ 平滑动画过渡

## 基本使用

```vue
<template>
  <CustomTabs 
    ref="customTabs"
    :list="tabList" 
    :current="currentTabIndex"
    :itemStyle="{ width: '80px', height: '40px' }"
    @click="handleTabClick"
  />
</template>

<script>
import CustomTabs from '@/components/CustomTabs/CustomTabs.vue';

export default {
  components: {
    CustomTabs
  },
  data() {
    return {
      currentTabIndex: 0,
      tabList: [
        { name: '选项1', value: 1 },
        { name: '选项2', value: 2 },
        { name: '选项3', value: 3 }
      ]
    };
  },
  methods: {
    handleTabClick(item) {
      console.log('点击了:', item);
      // item 包含: { index, name, value }
      this.currentTabIndex = item.index;
    }
  }
}
</script>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| list | Array | [] | 标签列表数据，格式: `[{name: '名称', value: 值}]` |
| current | Number | 0 | 当前选中的索引 |
| itemStyle | Object | {} | 每个标签项的自定义样式 |
| visible | Boolean | true | 组件可见性（用于外部控制刷新时机） |
| activeColor | String | '#2979ff' | 激活状态的文字颜色 |
| inactiveColor | String | '#606266' | 未激活状态的文字颜色 |
| underlineColor | String | '#2979ff' | 下划线颜色 |
| underlineHeight | Number | 4 | 下划线高度（单位：px） |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | { index, name, value, ...其他字段 } | 点击标签时触发 |

## 在 v-show 场景下使用

### 方法1: 使用生命周期钩子（推荐）

```vue
<script>
export default {
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.refreshTabs();
      }, 100);
    });
  },
  onShow() {
    // uni-app 页面显示时
    this.$nextTick(() => {
      setTimeout(() => {
        this.refreshTabs();
      }, 200);
    });
  },
  activated() {
    // Vue keep-alive 组件激活时
    this.$nextTick(() => {
      setTimeout(() => {
        this.refreshTabs();
      }, 200);
    });
  },
  methods: {
    refreshTabs() {
      if (this.$refs.customTabs && this.$refs.customTabs.refresh) {
        this.$refs.customTabs.refresh();
      }
    }
  }
}
</script>
```

### 方法2: 使用 visible 属性

```vue
<template>
  <div v-show="pageVisible">
    <CustomTabs 
      :list="tabList"
      :visible="pageVisible"
      @click="handleTabClick"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageVisible: false
    };
  },
  mounted() {
    // 延迟显示，确保正确初始化
    setTimeout(() => {
      this.pageVisible = true;
    }, 100);
  }
}
</script>
```

## 手动刷新

如果需要手动刷新下划线位置（例如在某些特殊场景下），可以调用 `refresh` 方法：

```javascript
this.$refs.customTabs.refresh();
```

## 注意事项

1. **务必添加 ref**: 如果需要手动刷新功能，必须给组件添加 ref 属性
2. **延迟刷新**: 在 v-show 切换后，建议延迟 100-200ms 后再刷新，确保 DOM 已完全显示
3. **首次加载**: 组件已自动处理首次加载的情况，无需额外操作

## 样式自定义

### 1. 自定义标签项样式

可以通过 `itemStyle` 属性自定义每个标签项的样式：

```vue
<CustomTabs 
  :itemStyle="{ 
    width: '100px', 
    height: '50px', 
    fontSize: '16px',
    fontWeight: 'bold' 
  }"
/>
```

### 2. 自定义颜色和下划线

```vue
<CustomTabs 
  :list="tabList"
  activeColor="#ff5722"
  inactiveColor="#999999"
  underlineColor="#ff5722"
  :underlineHeight="6"
/>
```

### 3. 完整配置示例

```vue
<CustomTabs 
  ref="customTabs"
  :list="tabList"
  :current="currentIndex"
  :itemStyle="{ width: '100px', height: '45px', fontWeight: 'bold' }"
  activeColor="#00aaff"
  inactiveColor="#666666"
  underlineColor="#00aaff"
  :underlineHeight="5"
  @click="handleTabClick"
/>
```

## 故障排查

### 下划线仍然不显示？

1. 检查是否添加了 `ref` 属性
2. 确认在页面显示时调用了 `refresh()` 方法
3. 增加延迟时间（300-500ms）
4. 检查父容器是否有 `display: none` 或 `v-show="false"`

### 下划线位置不准确？

1. 确保 `itemStyle` 中的宽度设置正确
2. 检查是否有其他样式影响了布局
3. 尝试手动调用 `refresh()` 方法

## 更新日志

### v1.1.0
- 新增：下划线宽度自适应文字宽度（不再占满整个tab）
- 新增：支持自定义颜色配置（activeColor, inactiveColor, underlineColor）
- 新增：支持自定义下划线高度（underlineHeight）
- 优化：下划线定位更加精准

### v1.0.0
- 初始版本
- 修复首次加载下划线显示问题
- 支持 v-show 场景
- 添加自动可见性监听

