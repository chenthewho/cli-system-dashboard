# input-no-keybord

### input聚焦但不弹出虚拟键盘。导入按照示例使用即可

#### 聚焦不弹键盘实现有三种方案：
1. 使用 input 新属性，inputmode="none"。效果最好，但是其兼容性太差。
	- 需要 Android webview 91+
	- 需要 iOS 13+
2. 监听键盘弹出，随即设置键盘收起，兼容性好，但是有较大弊端：
	- 虚拟键盘会先弹出再收回
3. 使用 keybord-listener 插件实现。[详情](https://ext.dcloud.net.cn/plugin?id=2548)
	- 配合一个假的 input，实现输入但是不弹出虚拟键盘
	- 兼容性也不太好，有些设备上虽然会触发callback，但是没有按键内容

> 本插件使用前两种组合实现

## 示例
```html
<template>
	<input-no-keybord v-model="value" placeholder="input-no-keybord" class="hahaha" :style="{border:'1px solid #000'}"
		style="width: 200px;" @input="input">
	</input-no-keybord>
</template>

<script>
	export default {
		data() {
			return {
				value: ""
			}
		},
		methods: {
			input(e) {
				console.log("e ************: ", e);
			}
		}
	}
</script>

```