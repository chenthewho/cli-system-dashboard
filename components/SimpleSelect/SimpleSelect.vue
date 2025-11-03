<template>
	<view class="simple-select-wrapper" :style="{ zIndex: zindex }">
		<!-- 蒙板 -->
		<view v-if="isOpen" class="simple-select-mask" @click="closeDropdown"></view>
		
		<!-- 下拉框主体 -->
		<view 
			class="simple-select" 
			:class="{ 'is-open': isOpen, 'is-disabled': disabled }"
			:style="{ height: height, width: width, padding: padding }"
			@click="toggleDropdown"
		>
			<!-- 显示文本 -->
			<text class="simple-select-text" :class="{ 'is-placeholder': !selectedLabel }">
				{{ selectedLabel || placeholder }}
			</text>
			
			<!-- 下拉箭头 -->
			<text class="simple-select-arrow" :class="{ 'is-open': isOpen }">▼</text>
		</view>
		
		<!-- 下拉选项 -->
		<view v-if="isOpen" class="simple-select-options" :style="{ width: width }">
			<view 
				v-for="(item, index) in options" 
				:key="item[realValueKey] || index"
				class="simple-select-option"
				:class="{ 'is-active': item[realValueKey] === realValue }"
				@click.stop="selectOption(item, index)"
			>
				{{ item[realLabelKey] }}
			</view>
			
			<!-- 空状态 -->
			<view v-if="options.length === 0" class="simple-select-empty">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SimpleSelect',
	props: {
		// v-model 绑定的值（兼容 value）
		modelValue: {
			type: [String, Number],
			default: ''
		},
		value: {
			type: [String, Number],
			default: ''
		},
		// 显示的名称（兼容 select-lay）
		name: {
			type: String,
			default: ''
		},
		// 选项列表
		options: {
			type: Array,
			default: () => []
		},
		// 占位符
		placeholder: {
			type: String,
			default: '请选择'
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 选项的值字段名（兼容 svalue）
		valueKey: {
			type: String,
			default: 'value'
		},
		svalue: {
			type: String,
			default: ''
		},
		// 选项的标签字段名（兼容 slabel）
		labelKey: {
			type: String,
			default: 'label'
		},
		slabel: {
			type: String,
			default: ''
		},
		// z-index
		zindex: {
			type: Number,
			default: 999
		},
		// 高度
		height: {
			type: String,
			default: '28rpx'
		},
		// 宽度
		width: {
			type: String,
			default: '200rpx'
		},
		// 内边距
		padding: {
			type: String,
			default: '0 30rpx 0 12rpx'
		}
	},
	data() {
		return {
			isOpen: false
		}
	},
	computed: {
		// 获取真实的值字段名
		realValueKey() {
			return this.svalue || this.valueKey;
		},
		// 获取真实的标签字段名
		realLabelKey() {
			return this.slabel || this.labelKey;
		},
		// 获取真实的绑定值
		realValue() {
			return this.value || this.modelValue;
		},
		// 当前选中项的标签
		selectedLabel() {
			// 如果传入了 name 属性，优先使用
			if (this.name) return this.name;
			
			if (!this.realValue) return '';
			const selected = this.options.find(item => item[this.realValueKey] === this.realValue);
			return selected ? selected[this.realLabelKey] : '';
		}
	},
	methods: {
		// 切换下拉框
		toggleDropdown() {
			if (this.disabled) return;
			this.isOpen = !this.isOpen;
		},
		
		// 关闭下拉框
		closeDropdown() {
			this.isOpen = false;
		},
		
		// 选择选项
		selectOption(item, index) {
			const value = item[this.realValueKey];
			// 兼容不同的事件名
			this.$emit('update:modelValue', value);
			this.$emit('change', value, item);
			this.$emit('selectitem', index); // 兼容 select-lay 的事件
			this.closeDropdown();
		}
	}
}
</script>

<style scoped>
/* 容器 */
.simple-select-wrapper {
	position: relative;
	display: inline-block;
}

/* 蒙板 */
.simple-select-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 998;
}

/* 下拉框主体 */
.simple-select {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 28rpx;
	padding: 0 30rpx 0 12rpx;
	background: #fafbfc;
	border: 1px solid #e0e0e0;
	border-radius: 4rpx;
	cursor: pointer;
	transition: all 0.2s;
	box-sizing: border-box;
}

.simple-select:hover {
	border-color: #1976d2;
}

.simple-select.is-open {
	border-color: #1976d2;
}

.simple-select.is-disabled {
	background: #f5f5f5;
	cursor: not-allowed;
	opacity: 0.6;
}

/* 显示文本 */
.simple-select-text {
	flex: 1;
	font-size: 20px;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: bold;
}

.simple-select-text.is-placeholder {
	color: #999;
	font-weight: normal;
}

/* 箭头 */
.simple-select-arrow {
	position: absolute;
	right: 8rpx;
	font-size: 10rpx;
	color: #999;
	transition: transform 0.2s;
}

.simple-select-arrow.is-open {
	transform: rotate(180deg);
}

/* 下拉选项容器 */
.simple-select-options {
	position: absolute;
	top: calc(100% + 4rpx);
	left: 0;
	width: 200rpx;
	max-height: 400rpx;
	background: #fff;
	border: 1px solid #8b8b8b;
	border-radius: 4rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
	overflow-y: auto;
	z-index: 999;
	padding: 4rpx 0;
}

/* 选项 */
.simple-select-option {
	padding: 12rpx 16rpx;
	font-size: 14px;
	color: #333;
	cursor: pointer;
	transition: background-color 0.15s;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.simple-select-option:hover {
	background-color: #f5f5f5;
}

.simple-select-option.is-active {
	background-color: #007AFF;
	color: #fff;
}

.simple-select-option.is-active:hover {
	background-color: #007AFF;
}

/* 空状态 */
.simple-select-empty {
	padding: 24rpx;
	text-align: center;
	font-size: 14px;
	color: #999;
}
</style>

