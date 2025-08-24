<template>
	<input :value="modelValue" type="text" v-on="$listenersWithoutInput" v-bind="$attrs" @input="_input">
</template>

<script>
	/**
	 * Input 聚焦但是不弹出键盘
	 * 方案（此处采用前两个）：
	 * 1. 使用 input 新属性，inputmode
	 * 2. 监听键盘弹出，随即设置键盘收起
	 * 3. 使用 keybord-listener 插件 https://ext.dcloud.net.cn/plugin?id=2548
	 * 		- 配合一个假的 input，实现输入但是不弹出虚拟键盘
	 */
	export default {
		props: {
			modelValue: {
				type: [String, Number],
				default: ''
			},
		},
		model: {
			prop: 'modelValue',
			event: 'update:modelValue'
		},
		emits: ['input', 'update:modelValue'],
		data() {
			return {
				inputEvent: {}
			}
		},
		created() {
			const callback = res => {
				if (res.height > 0) {
					uni.hideKeyboard()
				}
			}
			uni.onKeyboardHeightChange(callback)
			this.$once('hook:beforeDestory', () => uni.offKeyboardHeightChange(callback))
		},
		computed: {
			$listenersWithoutInput() {
				const extractEvent = ['input']
				const $listeners = this.$listeners || {}
				let temp = {}
				for (let key in $listeners) {
					if (extractEvent.indexOf(key) === -1) temp[key] = this.$listeners[key]
					else this.inputEvent = this.$listeners[key]
				}
				return temp
			}
		},
		methods: {
			_input(event) {
				this.$emit('update:modelValue', event.detail.value)
				// triggerInput
				if (typeof this.inputEvent === 'function') {
					this.inputEvent(event)
				} else {
					this.inputEvent.forEach(cb => cb(event))
				}
			}
		}
	}
</script>

<script module="input" lang="renderjs">
	export default {
		mounted() {
			// inputmode="none" 实现input聚焦但是不弹出键盘，浏览器兼容性不好
			this.$el.querySelector('input').setAttribute('inputmode', 'none')
		}
	}
</script>

<style>

</style>
