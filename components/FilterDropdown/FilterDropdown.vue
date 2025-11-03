<template>
	<view class="filter-dropdown-wrapper">
		<view class="filter-dropdown" @click.stop="toggleDropdown">
			<text class="filter-label">{{ currentLabel }}</text>
			<text class="filter-arrow">▼</text>
		</view>
		
		<view v-if="showDropdown" class="filter-options-panel" :class="panelClass" @click.stop>
			<view 
				v-for="(option, index) in options" 
				:key="index"
				class="filter-option-item" 
				:class="{ active: currentValue === option.value }"
				@click="selectOption(option)">
				<text>{{ option.label }}</text>
			</view>
		</view>
		
		<!-- 遮罩 -->
		<view v-if="showDropdown" class="filter-mask" @click="closeDropdown"></view>
	</view>
</template>

<script>
export default {
	name: 'FilterDropdown',
	props: {
		// 选项列表
		options: {
			type: Array,
			required: true,
			// 格式: [{ label: '按时间↓', value: 'time-desc' }]
		},
		// 当前选中的值
		value: {
			type: String,
			default: ''
		},
		// 面板额外类名（用于调整位置）
		panelClass: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showDropdown: false
		};
	},
	computed: {
		currentLabel() {
			const option = this.options.find(opt => opt.value === this.value);
			return option ? option.label : '请选择';
		},
		currentValue() {
			return this.value;
		}
	},
	methods: {
		toggleDropdown() {
			this.showDropdown = !this.showDropdown;
			if (this.showDropdown) {
				this.$emit('open');
			}
		},
		closeDropdown() {
			this.showDropdown = false;
			this.$emit('close');
		},
		selectOption(option) {
			this.$emit('input', option.value);
			this.$emit('change', option.value);
			this.closeDropdown();
		},
		// 外部调用关闭
		close() {
			this.showDropdown = false;
		}
	}
};
</script>

<style scoped>
.filter-dropdown-wrapper {
	position: relative;
	display: inline-block;
}

.filter-dropdown {
	display: flex;
	align-items: center;
	gap: 4rpx;
	padding: 4rpx 10rpx;
	background-color: #ffffff;
	border: 1rpx solid #e0e0e0;
	border-radius: 6rpx;
	cursor: pointer;
	transition: all 0.2s;
}

.filter-dropdown:active {
	background-color: #f5f5f5;
	transform: scale(0.98);
}

.filter-label {
	font-size: 11rpx;
	color: #333;
	font-weight: 500;
	white-space: nowrap;
}

.filter-arrow {
	font-size: 10rpx;
	color: #999;
	transition: transform 0.2s;
}

.filter-options-panel {
	position: absolute;
	top: calc(100% + 2rpx);
	right: 0;
	background-color: #ffffff;
	border: 1rpx solid #e0e0e0;
	border-radius: 8rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	z-index: 1000;
	overflow: hidden;
	min-width: 100rpx;
}

.filter-option-item {
	padding: 10rpx 16rpx;
	font-size: 12rpx;
	color: #333;
	cursor: pointer;
	transition: all 0.2s;
	border-bottom: 1rpx solid #f5f5f5;
}

.filter-option-item:last-child {
	border-bottom: none;
}

.filter-option-item:hover {
	background-color: #f5f5f5;
}

.filter-option-item:active {
	background-color: #e8e8e8;
}

.filter-option-item.active {
	background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
	color: #ffffff;
	font-weight: 600;
}

.filter-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: transparent;
	z-index: 999;
}
</style>

