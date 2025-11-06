<template>
	<div class="cashier-card">
		<div class="cashier-col">
			<div class="card-title">
				<div style="display: flex; flex-flow: row; align-items: center; justify-content: space-between; padding: 2px 6px; font-weight: bold;">
					<div style="font-size: 15rpx; text-align: left;">
						{{ editingCard.skuName }}
					</div>
					<u-icon name="edit-pen" color="#969696" size="30" @click="showAllweightStr = !showAllweightStr"></u-icon>
				</div>
			</div>

		<!-- 非定装输入 -->
		<div class="card-body" v-if="editingCard.saleWay === 1">
			<div style="padding: 5rpx; display: flex; justify-content: space-between; align-items: center; gap: 5rpx;">
				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused3 }" @click="custominputFocusedMethod(3)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">总重</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_allweight" class="step1-input" type="text" inputmode="none" :value="editingCard.allweight" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">斤</span>
					</div>
				</div>

				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused }" @click="custominputFocusedMethod(1)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">数量</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_quantity" class="step1-input" type="text" inputmode="none" :value="editingCard.quantity" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">件</span>
					</div>
				</div>
			</div>

			<div v-if="showAllweightStr" style="font-size: 16rpx; color: white; font-weight: bold; padding: 3rpx 8rpx; line-height: 18rpx; background-color: orange; margin: 3rpx 5rpx; border-radius: 4rpx; word-break: break-all; white-space: normal;">
				总重：{{ editingCard.allweightSrt }}
			</div>

			<div style="padding: 5rpx; display: flex; justify-content: space-between; align-items: center; gap: 5rpx;">
				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused4 }" @click="custominputFocusedMethod(4)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">皮重</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_carweight" class="step1-input" type="text" inputmode="none" :value="editingCard.carweight" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">斤</span>
					</div>
				</div>

				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused2 }" @click="custominputFocusedMethod(2)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">单价</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_referenceAmount" class="step1-input" type="text" inputmode="none" :value="editingCard.referenceAmount" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">元</span>
					</div>
				</div>
			</div>

			
			<!-- 押筐选择 -->
			<div v-if="showStep2" style="display: flex; align-items: center; padding: 3rpx 8rpx; margin-top: 10rpx;">
				<select-lay 
					:zindex="1211" 
					:name="editingCard.extralModel.name" 
					:value="editingCard.extralModel.id"
					direction="up"
					placeholder="请选择项目" 
					:options="editCardExtralModel"
					@selectitem="handleExtraModelSelect" 
					slabel="name">
				</select-lay>
			</div>
			</div>

		<!-- 定装输入 -->
		<div class="card-body" v-if="editingCard.saleWay === 2 || editingCard.saleWay === 3">
			<div style="padding: 5rpx; display: flex; justify-content: space-between; align-items: center; gap: 5rpx;">
				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused }" @click="custominputFocusedMethod(1)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">数量</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_quantity" class="step1-input" type="text" inputmode="none" :value="editingCard.quantity" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">{{ editingCard.commoditySpec ? editingCard.commoditySpec.specName : '' }}</span>
					</div>
				</div>

				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused2 }" @click="custominputFocusedMethod(2)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">单价</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_referenceAmount" class="step1-input" type="text" inputmode="none" :value="editingCard.referenceAmount" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">元</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 散装输入 -->
		<div class="card-body" v-if="editingCard.saleWay === 4">
			<div style="padding: 5rpx; display: flex; justify-content: space-between; align-items: center; gap: 5rpx;">
				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused3 }" @click="custominputFocusedMethod(3)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">总重</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_allweight" class="step1-input" type="text" inputmode="none" :value="editingCard.allweightSrt" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">斤</span>
					</div>
				</div>

				<div :class="{ 'custom-input': true, 'input-focused': custominputFocused2 }" @click="custominputFocusedMethod(2)" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; flex: 1;">
					<div style="font-size: 12rpx; color: #666; margin-right: 5rpx;">单价</div>
					<div style="display: flex; align-items: center;">
						<input ref="input_referenceAmount" class="step1-input" type="text" inputmode="none" :value="editingCard.referenceAmount" style="border: none; background: transparent; outline: none; text-align: right;" />
						<span class="currency-label">元</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 键盘 -->
		<view class="mybrankmask" :style="{ width: '100%', maxWidth: '450rpx', height: '195rpx', zIndex: 999, left: 0, bottom: 0, marginTop:'0rpx', margin: '0 auto 0' }">
			<view style="padding: 8rpx;">
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(1)">1</view>
					<view class="maskListItem" @click="NumberCk(2)">2</view>
					<view class="maskListItem" @click="NumberCk(3)">3</view>
					<view class="maskListItem" @click="Tuige()">
						<uni-icons custom-prefix="iconfont" type="icon-tuige" size="35" color="#ffffff" style="margin-right: 5rpx;"></uni-icons>
					</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(4)">4</view>
					<view class="maskListItem" @click="NumberCk(5)">5</view>
					<view class="maskListItem" @click="NumberCk(6)">6</view>
					<view class="maskListItem" @click="NumberCk('+')">+</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(7)">7</view>
					<view class="maskListItem" @click="NumberCk(8)">8</view>
					<view class="maskListItem" @click="NumberCk(9)">9</view>
					<view class="maskListItem" @click="NumberCk('-')">-</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
					<view class="maskListItem" @click="NumberCk('.')">.</view>
					<view class="maskListItem confirm-btn" @click="confirm">确定</view>
				</view>
			</view>
		</view>
		</div>
	</div>
</template>

<script>
export default {
	name: 'GoodEditKeyboard',
	props: {
		// 编辑中的商品卡片
		card: {
			type: Object,
			required: true
		},
		// 固定皮重配置
		fixedTareWeight: {
			type: Object,
			default: () => ({ action: false })
		},
		// 是否显示押筐选择
		showStep2: {
			type: Boolean,
			default: false
		},
		// 押筐选项列表
		editCardExtralModel: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			// 内部编辑副本，避免直接修改 prop
			editingCard: {},
			custominputFocused: false,
			custominputFocused2: false,
			custominputFocused3: false,
			custominputFocused4: false,
			custominputFocusIndex: '',
			showAllweightStr: false,
			inputBuffer: {
				timer: null
			}
		};
	},
	watch: {
		// 监听 prop 变化，同步到内部副本
		card: {
			handler(newVal) {
				this.editingCard = JSON.parse(JSON.stringify(newVal));
				console.log("this.editingCard",this.editingCard);
				if (this.editingCard.saleWay === 1 || this.editingCard.saleWay === 4) {
					// 非定装和散装：默认聚焦总重（index 3）
					this.custominputFocusedMethod(3);
				} else {
					// 定装：默认聚焦数量（index 1）
					this.custominputFocusedMethod(1);
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		// 组件加载时默认聚焦到总重（非定装和散装）或数量（定装）
		this.$nextTick(() => {
			if (this.editingCard.saleWay === 1 || this.editingCard.saleWay === 4) {
				// 非定装和散装：默认聚焦总重（index 3）
				this.custominputFocusedMethod(3);
			} else {
				// 定装：默认聚焦数量（index 1）
				this.custominputFocusedMethod(1);
			}
		});
	},
	beforeDestroy() {
		if (this.inputBuffer.timer) {
			clearTimeout(this.inputBuffer.timer);
		}
	},
	methods: {
	NumberCk(val) {
		// 取消之前的复杂计算定时器
		if (this.inputBuffer.timer) {
			clearTimeout(this.inputBuffer.timer);
			this.inputBuffer.timer = null;
		}

		const focusIndex = this.custominputFocusIndex;
		const fieldMap = ['', 'quantity', 'referenceAmount', 'allweight', 'carweight'];
		const field = fieldMap[focusIndex];
		if (!field) return;

		// 从数据模型读取当前值
		let currentValue = String(this.editingCard[field] || '0');

		// 快速验证：小数点重复检查
		if (val === '.' && currentValue.includes('.')) {
			return;
		}

		// 运算符处理（累加累减）
		const isOperator = val === '+' || val === '-';
		if (isOperator) {
			// 如果当前值为0，不允许输入运算符
			if (currentValue === '0') {
				return;
			}
			
			// 如果当前值已经包含运算符，先计算结果再拼接新运算符
			if (currentValue.includes('+') || currentValue.includes('-')) {
				try {
					// 使用安全计算
					const result = new Function('return ' + currentValue)();
					currentValue = String(result);
				} catch (e) {
					// 计算失败，保持原值
					currentValue = String(parseFloat(currentValue) || 0);
				}
			}
			
			// 拼接运算符
			const newValue = currentValue + val;
			this.editingCard[field] = newValue;
			
			// allweightSrt 特殊处理
			if (focusIndex === 3) {
				this.editingCard.allweightSrt = (this.editingCard.allweightSrt || '0') + val;
			}
			return;
		}

		// 优化初始值处理
		let txt = currentValue === '0' && val !== '.' ? '' : currentValue;

		// 计算新值
		const newValue = String(txt) + val;

		// ===【关键】立即更新数据模型，触发 Vue 响应式更新===
		this.editingCard[field] = newValue;

		// allweightSrt 特殊处理
		if (focusIndex === 3) {
			const allweightSrt = this.editingCard.allweightSrt || '0';
			this.editingCard.allweightSrt = allweightSrt.toString() === '0' ? val : allweightSrt + val;
		}

		// 【优化】只延迟复杂计算
		if (focusIndex === 1 && this.fixedTareWeight.action === true) {
			this.inputBuffer.timer = setTimeout(() => {
				// 如果包含运算符，先计算结果
				let calculatedValue = newValue;
				if (newValue.includes('+') || newValue.includes('-')) {
					try {
						calculatedValue = String(new Function('return ' + newValue)());
					} catch (e) {
						calculatedValue = newValue;
					}
				}
				
				const currentQuantity = parseFloat(calculatedValue) || 0;
				let calculatedCarWeight = 0;

				// 皮重处理
				if (this.editingCard.fixedTare) {
					calculatedCarWeight = this.editingCard.fixedTare * currentQuantity;
				}

				// 押筐数量处理
				if (this.editingCard.extralModel) {
					this.editingCard.extralModel.quantity = calculatedValue;
					if (this.editingCard.extralModel.weight) {
						calculatedCarWeight += currentQuantity * parseFloat(this.editingCard.extralModel.weight);
					}
				}

				// 统一设置 carweight
				this.editingCard.carweight = calculatedCarWeight;

				// 固定重量处理
				if (this.editingCard.initWeight) {
					this.editingCard.allweight = currentQuantity * parseFloat(this.editingCard.initWeight);
				}
			}, 50);
		}
	},

		Tuige() {
			// 取消复杂计算定时器
			if (this.inputBuffer.timer) {
				clearTimeout(this.inputBuffer.timer);
			}

			const focusIndex = this.custominputFocusIndex;
			const fieldMap = ['', 'quantity', 'referenceAmount', 'allweight', 'carweight'];
			const field = fieldMap[focusIndex];
			if (!field) return;

			// 从数据模型读取当前值
			let currentValue = String(this.editingCard[field] || '0');

			// 如果当前值为空或为零，直接返回
			if (currentValue === '' || currentValue === '0') {
				return;
			}

			// 回退一个字符
			let newValue = currentValue.slice(0, -1);
			newValue = newValue === '' ? '0' : newValue;

			// 立即更新数据模型
			this.editingCard[field] = newValue;

			// 散装模式总重特殊处理
			if (focusIndex === 3) {
				let srt = this.editingCard.allweightSrt;
				if (srt != null && srt !== '') {
					srt = srt.toString().slice(0, -1);
					this.editingCard.allweightSrt = srt === '' ? '0' : srt;
				}
			}

			// 延迟复杂计算
			if (focusIndex === 1 && this.fixedTareWeight.action === true) {
				this.inputBuffer.timer = setTimeout(() => {
					const currentQuantity = parseFloat(newValue) || 0;
					let calculatedCarWeight = 0;

					if (this.editingCard.fixedTare) {
						calculatedCarWeight = this.editingCard.fixedTare * currentQuantity;
					}

					if (this.editingCard.extralModel) {
						this.editingCard.extralModel.quantity = newValue;
						if (this.editingCard.extralModel.weight) {
							calculatedCarWeight += currentQuantity * parseFloat(this.editingCard.extralModel.weight);
						}
					}

					this.editingCard.carweight = calculatedCarWeight;
				}, 50);
			}
		},

		custominputFocusedMethod(index) {
			// 清理之前输入框的待处理更新
			if (this.inputBuffer.timer) {
				clearTimeout(this.inputBuffer.timer);
				this.inputBuffer.timer = null;
			}

			this.custominputFocused = false;
			this.custominputFocused2 = false;
			this.custominputFocused3 = false;
			this.custominputFocused4 = false;

			switch (index) {
				case 1:
					this.custominputFocused = true;
					break;
				case 2:
					this.custominputFocused2 = true;
					break;
				case 3:
					this.custominputFocused3 = true;
					break;
				case 4:
					this.custominputFocused4 = true;
					break;
			}
			this.custominputFocusIndex = index;
		},

		confirm() {
			// 安全计算表达式
			const safeEval = expr => {
				try {
					return new Function('return ' + expr)();
				} catch (e) {
					return parseFloat(expr) || 0;
				}
			};

			// 计算表达式
			Object.assign(this.editingCard, {
				quantity: safeEval(this.editingCard.quantity),
				referenceAmount: safeEval(this.editingCard.referenceAmount),
				allweight: safeEval(this.editingCard.allweight),
				carweight: safeEval(this.editingCard.carweight)
			});

			// 触发父组件事件
			this.$emit('confirm', this.editingCard);
		},

		// 处理押筐选择
		handleExtraModelSelect(e) {
			this.editingCard.extralModel = JSON.parse(JSON.stringify(this.editCardExtralModel[e]));
			
			// 押筐数量处理
			if (this.editingCard.extralModel) {
				this.editingCard.extralModel.quantity = this.editingCard.quantity;
				
				// 计算皮重
				let calculatedCarWeight = 0;
				const currentQuantity = parseFloat(this.editingCard.quantity) || 0;
				
				// 固定皮重
				if (this.editingCard.fixedTare) {
					calculatedCarWeight = this.editingCard.fixedTare * currentQuantity;
				}
				
				// 押筐重量
				if (this.editingCard.extralModel.weight) {
					calculatedCarWeight += currentQuantity * parseFloat(this.editingCard.extralModel.weight);
				}
				
				this.editingCard.carweight = calculatedCarWeight;
			}
			
			// 通知父组件押筐选择变化
			// this.$emit('extra-model-select', this.editingCard.extralModel);
		}
	}
};
</script>

<style scoped>
.cashier-card {
	background: #fff;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
}

.cashier-col {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.card-title {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	color: white;
	padding: 5rpx;
	padding-left: 10rpx;
	padding-right: 10rpx;
	flex-shrink: 0;
}

.card-body {
	padding: 5rpx;
	flex: 1;
	overflow-y: auto;
	min-height: 0;
}

.custom-input {
	padding: 5rpx 8rpx;
	border: 1px solid #d9d9d9;
	border-radius: 4rpx;
	transition: all 0.2s;
	cursor: pointer;
	min-height: 32rpx;
	background: #fafafa;
}

.input-focused {
	border-color: #1890ff;
	background: #e6f7ff;
	box-shadow: 0 0 0 2rpx rgba(24, 144, 255, 0.2);
}

.step1-input {
	font-size: 16rpx;
	font-weight: bold;
	color: #333;
	min-width: 40rpx;
	max-width: 100rpx;
	flex: 1;
}

.currency-label {
	font-size: 12rpx;
	color: #8c8c8c;
	margin-left: 3rpx;
	white-space: nowrap;
	flex-shrink: 0;
}

.mybrankmask {
	flex-shrink: 0;
}

.MymaskList {
	font-weight: bold;
	display: flex;
	width: 100%;
	height: 42rpx;
	justify-content: space-around;
	margin-bottom: 6rpx;
	font-size: 26rpx;
}

.maskListItem {
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
	user-select: none;
}

.maskListItem:active {
	opacity: 0.8;
	transform: scale(0.96);
	background: #4a4a4a;
	box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

/* 确定按钮特殊样式 - 使用绿色 */
.confirm-btn {
	background: #11998e !important;
	font-weight: bold;
}

.confirm-btn:active {
	opacity: 0.8 !important;
	background: #0d7a6f !important;
}
</style>

