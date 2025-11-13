<template>
	<u-modal title="" class="modern-payment-modal" :show="visible" :closeOnClickOverlay="true"
		:showConfirmButton="false" :width="1000" @close="handleClose">
		<div class="payment-modal-container">
			<!-- 关闭按钮 -->
			<div class="modal-close-btn" @click="handleClose">
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
			</div>

			<div class="payment-content-grid">
				<!-- 左侧：金额输入和支付方式 -->
				<div class="left-input-section">
					<!-- 金额输入区域 -->
					<div class="amount-inputs-section">
						<div class="amount-inputs">
							<div class="input-row">
								<label class="input-label">应付金额</label>
								<input v-model="localPayAmount.total" inputmode="none" class="amount-input" readonly>
							</div>

						<div class="input-row discount-row" :class="{'active': selectInputPay === 9}"
							@click="handleEditingClick(9)">
							<div class="discount-toggle">
								<button class="discount-btn" :class="{'active': localAccountDiscount}"
									@click="handleSetDiscount">优惠</button>
								<button class="discount-btn" :class="{'active': !localAccountDiscount}"
									@click="handleSetOvercharge">多收</button>
							</div>
							<button v-if="shouldShowSmartRoundButton" class="smart-round-btn" @click="handleSmartRound">{{
								smartRoundButtonText }}</button>
							<input v-model="localDiscountAmount" inputmode="none" class="amount-input">
						</div>

						<div class="input-row" :class="{'active': selectInputPay === 4}" >
							<label class="input-label">收筐抵扣</label>
							<button class="collect-btn" @click="handleCollectBasket">收筐</button>
							<input v-model="localPayAmount.BasketOffsetAmount" inputmode="none" class="amount-input">
						</div>

							<div class="input-row" :class="{'active': selectInputPay === 3}" @click="handleEditingClick(3)">
								<label class="input-label">下欠金额</label>
								<input v-model="localPayAmount.debt" inputmode="none" class="amount-input">
							</div>

						<div class="input-row" :class="{'active': selectInputPay === 2, 'flash-red-row': actualAmountFlash}" @click="handleEditingClick(2)">
							<label class="input-label">实付金额</label>
							<input v-model="localPayAmount.actual" inputmode="none" class="amount-input">
						</div>
						</div>
					</div>

					<!-- 支付方式区域 -->
					<div class="payment-methods-section">
						<div class="section-title">支付方式</div>
						<div class="payment-methods-grid" v-if="localAccountExpense">
							<div class="payment-method-card" :class="{'active': selectInputPay === 5}"
								@click="handleEditingClick(5)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="weixin-fill" :size="24" color="#07c160"></u-icon>
									</div>
									<div class="payment-label">微信</div>
								</div>
								<div class="payment-amount">{{localAccountExpense.wxpayAmount}}</div>
							</div>

							<div class="payment-method-card" :class="{'active': selectInputPay === 6}"
								@click="handleEditingClick(6)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="zhifubao" :size="24" color="#1677ff"></u-icon>
									</div>
									<div class="payment-label">支付宝</div>
								</div>
								<div class="payment-amount">{{localAccountExpense.alipayAmount}}</div>
							</div>

							<div class="payment-method-card" :class="{'active': selectInputPay === 7}"
								@click="handleEditingClick(7)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="red-packet-fill" :size="24" color="#ff4757"></u-icon>
									</div>
									<div class="payment-label">现金</div>
								</div>
								<div class="payment-amount">{{localAccountExpense.cashAmount}}</div>
							</div>

							<div class="payment-method-card" :class="{'active': selectInputPay === 8}"
								@click="handleEditingClick(8)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="coupon-fill" :size="24" color="#ffa502"></u-icon>
									</div>
									<div class="payment-label">其他</div>
								</div>
								<div class="payment-amount">{{localAccountExpense.otherAmount}}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 右侧：顾客信息、数字键盘和操作按钮 -->
				<div class="right-keypad-section">
					<!-- 顾客信息 -->
					<div class="customer-info-section" :class="{'flash-red': customerInfoFlash}">
						<div class="customer-badge" :class="currentMember.debts > 0 ? 'debt' : 'normal'"
							@click="$emit('member-change')">
							<div class="customer-name">{{currentMember.customName ? currentMember.customName : '散客'}}</div>
							<div v-if="currentMember.debts > 0" class="debt-info">总下欠：{{currentMember.debts}}元</div>
						</div>
					</div>

					<!-- 数字键盘 -->
					<div class="modern-keypad">
						<div class="keypad-row">
							<button class="keypad-btn" @click="handleNumberClick(1)">1</button>
							<button class="keypad-btn" @click="handleNumberClick(2)">2</button>
							<button class="keypad-btn" @click="handleNumberClick(3)">3</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="handleNumberClick(4)">4</button>
							<button class="keypad-btn" @click="handleNumberClick(5)">5</button>
							<button class="keypad-btn" @click="handleNumberClick(6)">6</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="handleNumberClick(7)">7</button>
							<button class="keypad-btn" @click="handleNumberClick(8)">8</button>
							<button class="keypad-btn" @click="handleNumberClick(9)">9</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="handleNumberClick(0)">0</button>
							<button class="keypad-btn" @click="handleNumberClick('.')">.</button>
							<button class="keypad-btn delete-btn" @click="handleBackspace">
								<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
							</button>
						</div>
					</div>

					<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="action-btn debt-btn" @click="handleDebtAll"
							v-if="localPayAmount.actual>=0">整单下欠</button>
						<button class="action-btn confirm-btn" :class="{'confirm-btn2': localPayAmount.actual<0}"
							@click="handleConfirm">确认收款</button>
					</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
	export default {
		name: 'PaymentModal',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			payAmount: {
				type: Object,
				required: true
			},
			accountExpense: {
				type: Object,
				required: true
			},
			discountAmount: {
				type: [Number, String],
				default: 0
			},
			accountDiscount: {
				type: Boolean,
				default: true
			},
			currentMember: {
				type: Object,
				default: () => ({})
			},
			repayBasketList: {
				type: Array,
				default: () => []
			}
		},
	data() {
		return {
			selectInputPay: 1,
			editingPaymentIndex: 1,
			customerInfoFlash: false,
			actualAmountFlash: false, // 实付金额闪烁标识
			localPayAmount: {},
			localAccountExpense: {},
			localDiscountAmount: 0,
			localAccountDiscount: true
		};
	},
		computed: {
			shouldShowSmartRoundButton() {
				const total = parseFloat(String(this.localPayAmount.total)) || 0;
				const debt = parseFloat(String(this.localPayAmount.debt)) || 0;
				const basketOffset = parseFloat(String(this.localPayAmount.BasketOffsetAmount)) || 0;
				const baseAmount = total - basketOffset - debt;

				if (baseAmount <= 0) {
					return false;
				}

				const lastDigit = Math.floor(baseAmount) % 10;
				return !(lastDigit === 0 || lastDigit === 5);
			},
			smartRoundButtonText() {
				const total = parseFloat(String(this.localPayAmount.total)) || 0;
				const debt = parseFloat(String(this.localPayAmount.debt)) || 0;
				const basketOffset = parseFloat(String(this.localPayAmount.BasketOffsetAmount)) || 0;
				const baseAmount = total - basketOffset - debt;

				if (baseAmount <= 0) {
					return '取零';
				}

				const lastDigit = Math.floor(baseAmount) % 10;
				const integerPart = Math.floor(baseAmount);

				let targetAmount;
				let adjustment;
				let isDiscount;

				if (lastDigit === 0 || lastDigit === 5) {
					adjustment = 0;
					isDiscount = true;
				} else if (lastDigit <= 2) {
					targetAmount = integerPart - lastDigit;
					adjustment = baseAmount - targetAmount;
					isDiscount = true;
				} else if (lastDigit <= 4) {
					targetAmount = integerPart - lastDigit;
					adjustment = baseAmount - targetAmount;
					isDiscount = true;
				} else if (lastDigit <= 7) {
					targetAmount = integerPart - lastDigit + 5;
					adjustment = baseAmount - targetAmount;
					isDiscount = true;
				} else {
					targetAmount = integerPart - lastDigit + 10;
					adjustment = targetAmount - baseAmount;
					isDiscount = false;
				}

				const adjustmentStr = Math.abs(adjustment).toFixed(2);
				return isDiscount ? `优惠${adjustmentStr}` : `多收${adjustmentStr}`;
			}
		},
		watch: {
			visible(val) {
				if (val) {
					this.initData();
				}
			},
			payAmount: {
				handler(val) {
					this.localPayAmount = JSON.parse(JSON.stringify(val));
				},
				deep: true
			},
			accountExpense: {
				handler(val) {
					this.localAccountExpense = JSON.parse(JSON.stringify(val));
				},
				deep: true
			},
			discountAmount(val) {
				this.localDiscountAmount = val;
			},
			accountDiscount(val) {
				this.localAccountDiscount = val;
			}
		},
		methods: {
			initData() {
				this.localPayAmount = JSON.parse(JSON.stringify(this.payAmount));
				this.localAccountExpense = JSON.parse(JSON.stringify(this.accountExpense));
				this.localDiscountAmount = this.discountAmount;
				this.localAccountDiscount = this.accountDiscount;
				this.selectInputPay = 1;
				this.editingPaymentIndex = 1;
			},
			handleClose() {
				this.$emit('close');
			},
			handleEditingClick(index) {
				if (index === 1) {
					return; // 应付金额不允许输入
				}
				this.editingPaymentIndex = index;
				this.selectInputPay = index;
				this.$emit('play-sound');
			},
			handleNumberClick(val) {
				this.$emit('play-sound');
				if (this.editingPaymentIndex === 1) {
					return; // 应付金额不允许输入
				}

				let myvalue = this.getEditingValue();

				if (val == '.') {
					if (this.editingPaymentIndex === 9) return; // 优惠多收不允许小数点
					if (myvalue.toString().indexOf('.') >= 0) return;
				}

				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();

				this.setEditingValue(myvalue);
			},
			handleBackspace() {
				this.$emit('play-sound');
				let myvalue = this.getEditingValue();

				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				myvalue = myvalue.slice(0, -1);
				myvalue = myvalue === '' ? '0' : myvalue;

				this.setEditingValue(myvalue);
			},
			getEditingValue() {
				switch (this.editingPaymentIndex) {
					case 2:
						return this.localPayAmount.actual;
					case 3:
						return this.localPayAmount.debt;
					case 4:
						return this.localPayAmount.BasketOffsetAmount;
					case 5:
						return this.localAccountExpense.wxpayAmount;
					case 6:
						return this.localAccountExpense.alipayAmount;
					case 7:
						return this.localAccountExpense.cashAmount;
					case 8:
						return this.localAccountExpense.otherAmount;
					case 9:
						return this.localDiscountAmount;
					default:
						return 0;
				}
			},
			setEditingValue(value) {
				switch (this.editingPaymentIndex) {
					case 2:
						this.localPayAmount.actual = value;
						this.setAccountExpense(parseFloat(value) || 0);
						break;
					case 3:
						this.localPayAmount.debt = value;
						this.calculateActualByDebt();
						break;
					case 4:
						this.localPayAmount.BasketOffsetAmount = value;
						break;
					case 5:
						this.localAccountExpense.wxpayAmount = value;
						break;
					case 6:
						this.localAccountExpense.alipayAmount = value;
						break;
					case 7:
						this.localAccountExpense.cashAmount = value;
						break;
					case 8:
						this.localAccountExpense.otherAmount = value;
						break;
					case 9:
						this.localDiscountAmount = value;
						this.calculateActualByDiscount();
						break;
				}
			},
			calculateActualByDebt() {
				const total = parseFloat(this.localPayAmount.total) || 0;
				const basketOffset = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;
				const debt = parseFloat(this.localPayAmount.debt) || 0;
				const discount = parseFloat(this.localDiscountAmount) || 0;

				if (this.localAccountDiscount) {
					this.localPayAmount.actual = total - discount - basketOffset - debt;
				} else {
					this.localPayAmount.actual = total + discount - basketOffset - debt;
				}
				this.setAccountExpense(this.localPayAmount.actual);
			},
			calculateActualByDiscount() {
				const total = parseFloat(this.localPayAmount.total) || 0;
				const discount = parseFloat(this.localDiscountAmount) || 0;
				const debt = parseFloat(this.localPayAmount.debt) || 0;
				const basketOffset = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;

				if (this.localAccountDiscount) {
					this.localPayAmount.actual = Math.floor(total - discount - basketOffset - debt);
				} else {
					this.localPayAmount.actual = Math.floor(total + discount - basketOffset - debt);
				}
				this.setAccountExpense(this.localPayAmount.actual);
			},
			setAccountExpense(val) {
				this.localAccountExpense = {
					otherAmount: 0,
					cashAmount: 0,
					alipayAmount: 0,
					wxpayAmount: val
				};
			},
			handleSetDiscount() {
				this.localAccountDiscount = true;
				const total = parseFloat(this.localPayAmount.total) || 0;
				const discount = parseFloat(this.localDiscountAmount) || 0;
				const debt = parseFloat(this.localPayAmount.debt) || 0;
				const basketOffset = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;
				this.localPayAmount.actual = Math.floor(total - discount - basketOffset - debt);
				this.setAccountExpense(this.localPayAmount.actual);
			},
			handleSetOvercharge() {
				this.localAccountDiscount = false;
				const total = parseFloat(this.localPayAmount.total) || 0;
				const discount = parseFloat(this.localDiscountAmount) || 0;
				const debt = parseFloat(this.localPayAmount.debt) || 0;
				const basketOffset = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;
				this.localPayAmount.actual = Math.floor(total + discount - basketOffset - debt);
				this.setAccountExpense(this.localPayAmount.actual);
			},
			handleSmartRound() {
				const total = parseFloat(this.localPayAmount.total) || 0;
				const debt = parseFloat(this.localPayAmount.debt) || 0;
				const basketOffset = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;
				const baseAmount = total - basketOffset - debt;

				const lastDigit = Math.floor(baseAmount) % 10;
				const integerPart = Math.floor(baseAmount);

				let targetAmount;
				let adjustment;

				if (lastDigit === 0 || lastDigit === 5) {
					adjustment = 0;
					this.localAccountDiscount = true;
				} else if (lastDigit <= 2) {
					targetAmount = integerPart - lastDigit;
					adjustment = baseAmount - targetAmount;
					this.localAccountDiscount = true;
				} else if (lastDigit <= 4) {
					targetAmount = integerPart - lastDigit;
					adjustment = baseAmount - targetAmount;
					this.localAccountDiscount = true;
				} else if (lastDigit <= 7) {
					targetAmount = integerPart - lastDigit + 5;
					adjustment = baseAmount - targetAmount;
					this.localAccountDiscount = true;
				} else {
					targetAmount = integerPart - lastDigit + 10;
					adjustment = targetAmount - baseAmount;
					this.localAccountDiscount = false;
				}

				this.localDiscountAmount = Math.floor(Math.abs(adjustment));

				const totalAmt = eval(this.localPayAmount.total);
				const discountAmt = eval(this.localDiscountAmount);
				const debtAmt = eval(this.localPayAmount.debt);
				const basketOffsetAmt = eval(this.localPayAmount.BasketOffsetAmount) || 0;

				if (this.localAccountDiscount) {
					this.localPayAmount.actual = totalAmt - discountAmt - basketOffsetAmt - debtAmt;
				} else {
					this.localPayAmount.actual = totalAmt + discountAmt - basketOffsetAmt - debtAmt;
				}
				this.setAccountExpense(this.localPayAmount.actual);
			},
			handleCollectBasket() {
				this.$emit('collect-basket');
			},
			handleDebtAll() {
				this.$emit('play-sound');

				// 检查是否为散客
				if (!this.currentMember.id || this.currentMember.id === '' || this.currentMember.customName === '散客') {
					this.flashCustomerInfo();
					uni.showToast({
						title: '散客不可以整单下欠',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				this.localPayAmount.debt = eval(this.localPayAmount.total - this.localPayAmount.BasketOffsetAmount);
				this.localPayAmount.actual = 0;
				this.localAccountExpense = {
					alipayAmount: 0,
					wxpayAmount: 0,
					cashAmount: 0,
					otherAmount: 0
				};

				this.handleConfirm();
			},
			async handleConfirm() {
				this.$emit('play-sound');

				// 检查散客是否有下欠金额
				const debtAmt = parseFloat(this.localPayAmount.debt) || 0;
				if ((!this.currentMember.id || this.currentMember.id === '' || this.currentMember.customName === '散客') &&
					debtAmt > 0) {
					this.flashCustomerInfo();
					uni.showToast({
						title: '散客不可以有下欠金额',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				// 验证实付金额计算是否正确
				const totalAmount = parseFloat(this.localPayAmount.total) || 0;
				const actualAmount = parseFloat(this.localPayAmount.actual) || 0;
				const debtAmount = parseFloat(this.localPayAmount.debt) || 0;
				const basketOffsetAmount = parseFloat(this.localPayAmount.BasketOffsetAmount) || 0;
				const discountAmount = parseFloat(this.localDiscountAmount) || 0;

				let expectedActualAmount;
				if (this.localAccountDiscount) {
					expectedActualAmount = totalAmount - discountAmount - basketOffsetAmount - debtAmount;
				} else {
					expectedActualAmount = totalAmount + discountAmount - basketOffsetAmount - debtAmount;
				}

			if (Math.abs(actualAmount - expectedActualAmount) > 0.01) {
				this.flashActualAmount();
				uni.showToast({
					title: `实付金额计算错误！应为${expectedActualAmount.toFixed(2)}元，当前为${actualAmount.toFixed(2)}元`,
					icon: 'error',
					duration: 3000
				});
				return;
			}

				// 检查实付金额与支付方式金额总和是否一致
				const wxpayAmount = parseFloat(this.localAccountExpense.wxpayAmount) || 0;
				const alipayAmount = parseFloat(this.localAccountExpense.alipayAmount) || 0;
				const cashAmount = parseFloat(this.localAccountExpense.cashAmount) || 0;
				const otherAmount = parseFloat(this.localAccountExpense.otherAmount) || 0;
				const totalPaymentAmount = wxpayAmount + alipayAmount + cashAmount + otherAmount;

				if (Math.abs(actualAmount - totalPaymentAmount) > 0.01) {
					uni.showToast({
						title: `支付金额不一致！实付${actualAmount.toFixed(2)}元，支付方式总额${totalPaymentAmount.toFixed(2)}元`,
						icon: 'error',
						duration: 3000
					});
					return;
				}

				// 发送确认事件
				this.$emit('confirm', {
					payAmount: this.localPayAmount,
					accountExpense: this.localAccountExpense,
					discountAmount: this.localDiscountAmount,
					accountDiscount: this.localAccountDiscount
				});
			},
		flashCustomerInfo() {
			this.customerInfoFlash = true;
			setTimeout(() => {
				this.customerInfoFlash = false;
			}, 1000);
		},
		flashActualAmount() {
			console.log('触发实付金额闪烁动画', this.actualAmountFlash);
			// 先重置，确保动画可以重复播放
			this.actualAmountFlash = false;
			// 使用 $nextTick 确保 DOM 更新
			this.$nextTick(() => {
				this.actualAmountFlash = true;
				console.log('设置闪烁状态为 true', this.actualAmountFlash);
				setTimeout(() => {
					this.actualAmountFlash = false;
					console.log('实付金额闪烁动画结束');
				}, 1000);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	@import "@/static/css/payment-modal.scss";

	/* 确保闪烁动画生效 */
	.input-row.flash-red-row {
		animation: flashRedRow 0.5s ease-in-out 2 !important;
		border: 2px solid #ef4444 !important;
	}

	@keyframes flashRedRow {
		0% {
			border-color: #ef4444;
			background-color: rgba(239, 68, 68, 0.1);
			box-shadow: 0 0 0px rgba(239, 68, 68, 0);
		}
		25% {
			border-color: #ef4444;
			background-color: rgba(239, 68, 68, 0.3);
			box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
			transform: scale(1.02);
		}
		50% {
			border-color: #dc2626;
			background-color: rgba(239, 68, 68, 0.5);
			box-shadow: 0 0 25px rgba(239, 68, 68, 0.9);
			transform: scale(1.03);
		}
		75% {
			border-color: #ef4444;
			background-color: rgba(239, 68, 68, 0.3);
			box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
			transform: scale(1.02);
		}
		100% {
			border-color: #ef4444;
			background-color: rgba(239, 68, 68, 0.1);
			box-shadow: 0 0 0px rgba(239, 68, 68, 0);
			transform: scale(1);
		}
	}
</style>

