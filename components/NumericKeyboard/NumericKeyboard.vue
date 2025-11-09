<template>
	<div v-if="show" class="numeric-keyboard-container" :class="{ 'container-relative': containerPosition }">
		<view class="numeric-keyboard">
			<view style="padding: 8rpx;">
				<!-- 第一行: 1 2 3 退格 -->
				<view class="keyboard-row">
					<view class="keyboard-key" @click="handleNumberClick(1)">1</view>
					<view class="keyboard-key" @click="handleNumberClick(2)">2</view>
					<view class="keyboard-key" @click="handleNumberClick(3)">3</view>
					<view class="keyboard-key" @click="handleDelete">
						<uni-icons custom-prefix="iconfont"
							type="icon-tuige" size="35" color="#ffffff"
							style="margin-right: 5rpx;">
						</uni-icons>
					</view>
				</view>
				
				<!-- 第二行: 4 5 6 + -->
				<view class="keyboard-row">
					<view class="keyboard-key" @click="handleNumberClick(4)">4</view>
					<view class="keyboard-key" @click="handleNumberClick(5)">5</view>
					<view class="keyboard-key" @click="handleNumberClick(6)">6</view>
					<view class="keyboard-key" @click="handleNumberClick('+')" style="font-size: 35rpx;color: white;">
						+
					</view>
				</view>
				
				<!-- 第三行: 7 8 9 - -->
				<view class="keyboard-row">
					<view class="keyboard-key" @click="handleNumberClick(7)">7</view>
					<view class="keyboard-key" @click="handleNumberClick(8)">8</view>
					<view class="keyboard-key" @click="handleNumberClick(9)">9</view>
					<view class="keyboard-key" @click="handleNumberClick('-')" style="font-size: 35rpx;color: white;">
						-
					</view>
				</view>
				
				<!-- 第四行: 0 . 确定 -->
				<view class="keyboard-row">
					<view class="keyboard-key" @click="handleNumberClick(0)" style="width: 48%;">0</view>
					<view class="keyboard-key" @click="handleNumberClick('.')">.</view>
					<view class="keyboard-key keyboard-confirm" @click="handleConfirm">
						确定
					</view>
				</view>
			</view>
		</view>
	</div>
</template>

<script>
export default {
	name: 'NumericKeyboard',
	props: {
		// 是否显示键盘
		show: {
			type: Boolean,
			default: false
		},
		// 当前值（用于判断是否可以输入小数点等）
		value: {
			type: [String, Number],
			default: ''
		},
		// 是否使用容器相对定位（false为全局固定定位）
		containerPosition: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		// 处理数字或运算符点击
		handleNumberClick(val) {
			// 防止重复小数点
			if (val === '.') {
				const currentValue = this.value.toString();
				if (currentValue.indexOf('.') >= 0) {
					return;
				}
			}
			
			// 防止在0的情况下输入+/-
			if ((val === '+' || val === '-') && this.value.toString() === '0') {
				return;
			}
			
			this.$emit('input', val);
		},
		
		// 处理退格
		handleDelete() {
			this.$emit('delete');
		},
		
		// 处理确认
		handleConfirm() {
			this.$emit('confirm');
		}
	}
}
</script>

<style lang="scss" scoped>
.numeric-keyboard-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
}

// 容器相对定位模式
.numeric-keyboard-container.container-relative {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
}

.numeric-keyboard {
	width: 100%;
	height: 200rpx;
	background-color: #ffffff;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.keyboard-row {
	font-weight: bold;
	display: flex;
	width: 100%;
	height: 42rpx;
	justify-content: space-around;
	margin-bottom: 6rpx;
	font-size: 26rpx;
}

.keyboard-key {
	font-weight: bold;
	width: 23%;
	height: 42rpx;
	text-align: center;
	line-height: 42rpx;
	border-radius: 8rpx;
	background: #5a5a5a;
	font-size: 26rpx;
	color: white;
	transition: all 0.15s;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.keyboard-key:active {
	opacity: 0.8;
	transform: scale(0.96);
	background: #4a4a4a;
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

.keyboard-confirm {
	background: #11998e;
	font-weight: bold;
}

.keyboard-confirm:active {
	opacity: 0.8;
	background: #0d7a6f;
}
</style>

