<template>
	<u-modal 
		title="" 
		class="modern-settlement-modal" 
		:show="visible" 
		:closeOnClickOverlay="true"
		:showConfirmButton="false" 
		:width="800" 
		@close="handleClose">
		<div class="settlement-modal-container">
			<!-- 关闭按钮 -->
			<div class="modal-close-btn" @click="handleClose">
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
			</div>
			
			<div class="settlement-content-grid">
				<!-- 左侧：结算信息和支付方式 -->
				<div class="left-input-section">
					<!-- 结算信息区域 -->
					<div class="settlement-info-section">
						<div class="section-title">结算信息</div>
						<div class="settlement-inputs">
							<div class="input-row readonly-row">
								<label class="input-label">总结算金额</label>
								<input v-model="settlementData.totalSettlement" inputmode="none" class="amount-input" readonly>
							</div>
							
							<div class="input-row readonly-row">
								<label class="input-label">未结算金额</label>
								<input v-model="settlementData.unsettledAmount" inputmode="none" class="amount-input" readonly>
							</div>
							
							<div class="input-row" :class="{'active': selectInput === 2}" @click="handleInputClick(2)">
								<label class="input-label">本次结算金额</label>
								<input v-model="settlementData.currentSettlement" inputmode="none" class="amount-input">
							</div>
						</div>
					</div>
					
					<!-- 支付方式区域 -->
					<div class="payment-methods-section">
						<div class="section-title">收款方式</div>
						<div class="payment-methods-grid">
							<div class="payment-method-card" 
								:class="{'active': selectInput === 4}"
								@click="handleInputClick(4)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="weixin-fill" :size="24" color="#07c160"></u-icon>
									</div>
									<div class="payment-label">微信</div>
								</div>
								<div class="payment-amount">{{settlementData.wechatAmount}}</div>
							</div>
							
							<div class="payment-method-card"
								:class="{'active': selectInput === 5}"
								@click="handleInputClick(5)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="zhifubao" :size="24" color="#1677ff"></u-icon>
									</div>
									<div class="payment-label">支付宝</div>
								</div>
								<div class="payment-amount">{{settlementData.alipayAmount}}</div>
							</div>
							
							<div class="payment-method-card"
								:class="{'active': selectInput === 6}"
								@click="handleInputClick(6)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="red-packet-fill" :size="24" color="#ff4757"></u-icon>
									</div>
									<div class="payment-label">现金</div>
								</div>
								<div class="payment-amount">{{settlementData.cashAmount}}</div>
							</div>
							
							<div class="payment-method-card"
								:class="{'active': selectInput === 7}"
								@click="handleInputClick(7)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="coupon-fill" :size="24" color="#ffa502"></u-icon>
									</div>
									<div class="payment-label">银行卡</div>
								</div>
								<div class="payment-amount">{{settlementData.bankAmount}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 右侧：客户信息、数字键盘和操作按钮 -->
				<div class="right-keypad-section">
					<!-- 客户信息 -->
					<!-- <div class="customer-info-section">
						<div class="customer-badge settlement">
							<div class="customer-name">{{customerInfo.customName || '散客'}}</div>
							<div class="settlement-info">未结算：{{settlementData.unsettledAmount}}元</div>
						</div>
					</div> -->
					
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
							<button class="keypad-btn delete-btn" @click="handleDelete">
								<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
							</button>
						</div>
					</div>
					
					<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="action-btn clear-btn" @click="handleClearAll">清空</button>
						<button class="action-btn confirm-btn" @click="handleConfirmSettlement">确认结算</button>
					</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
export default {
	name: 'SettlementModal',
	props: {
		// 控制弹窗显示
		visible: {
			type: Boolean,
			default: false
		},
		// 顾客信息
		customerInfo: {
			type: Object,
			default: () => ({
				customName: '',
				totalSettlement: 0,
				unsettledAmount: 0
			})
		},
		// 初始结算数据
		initialData: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['close', 'confirm'],
	data() {
		return {
			// 当前选中的输入框
			selectInput: 2, // 默认选中本次结算
			// 结算数据
			settlementData: {
				totalSettlement: 0,      // 总结算金额
				unsettledAmount: 0,      // 未结算金额
				currentSettlement: 0,    // 本次结算金额
				wechatAmount: 0,         // 微信收款金额
				alipayAmount: 0,         // 支付宝收款金额
				cashAmount: 0,           // 现金收款金额
				bankAmount: 0            // 银行卡收款金额
			}
		}
	},
	watch: {
		visible(newVal) {
			if (newVal) {
				this.initSettlementData();
			}
		},
		customerInfo: {
			handler(newVal) {
				if (newVal) {
					console.log("newVal", newVal)
					this.settlementData.totalSettlement = newVal.totalSettlement || 0;
					this.settlementData.unsettledAmount = newVal.unsettledAmount || 0;
				}
			},
			deep: true,
			immediate: true
		},
		'settlementData.currentSettlement'(newVal) {
			// 当本次结算金额变化时，更新默认的微信收款金额
			this.settlementData.wechatAmount = newVal || 0;
		}
	},
	methods: {
		// 初始化结算数据
		initSettlementData() {
			console.log("this.customerInfo", this.customerInfo)
			this.settlementData.currentSettlement = 0;
			if (this.customerInfo) {
				this.settlementData.totalSettlement = this.customerInfo.totalSettlement || 0;
				this.settlementData.unsettledAmount = this.customerInfo.unsettledAmount || 0;
			}
			
			// 合并初始数据
			if (this.initialData) {
				Object.assign(this.settlementData, this.initialData);
			}
			
			// 默认微信收款
			this.settlementData.wechatAmount = this.settlementData.currentSettlement;
		},
		
		// 验证收款方式金额总和
		validatePaymentMethods() {
			const totalPayment = 
				(parseFloat(this.settlementData.wechatAmount) || 0) +
				(parseFloat(this.settlementData.alipayAmount) || 0) +
				(parseFloat(this.settlementData.cashAmount) || 0) +
				(parseFloat(this.settlementData.bankAmount) || 0);
			
			this.settlementData.currentSettlement = totalPayment.toFixed(2);
		},
		
		// 处理输入框点击
		handleInputClick(inputType) {
			// 只有本次结算金额和支付方式可以点击
			if (inputType === 2 || inputType >= 4) {
				this.selectInput = inputType;
			}
		},
		
		// 处理数字键盘点击
		handleNumberClick(num) {
			let currentValue = '';
			
			switch(this.selectInput) {
				case 2:
					currentValue = this.settlementData.currentSettlement.toString();
					this.settlementData.currentSettlement = this.appendNumber(currentValue, num);
					break;
				case 4:
					currentValue = this.settlementData.wechatAmount.toString();
					this.settlementData.wechatAmount = this.appendNumber(currentValue, num);
					break;
				case 5:
					currentValue = this.settlementData.alipayAmount.toString();
					this.settlementData.alipayAmount = this.appendNumber(currentValue, num);
					break;
				case 6:
					currentValue = this.settlementData.cashAmount.toString();
					this.settlementData.cashAmount = this.appendNumber(currentValue, num);
					break;
				case 7:
					currentValue = this.settlementData.bankAmount.toString();
					this.settlementData.bankAmount = this.appendNumber(currentValue, num);
					break;
			}
			console.log("currentSettlement", this.settlementData)
		},
		
		// 数字拼接逻辑
		appendNumber(currentValue, num) {
			console.log("currentValue", currentValue)
			console.log("num", num)
			if (currentValue === '0' && num !== '.') {
				console.log(1)
				return num.toString();
			}
			
			if (num === '.' && currentValue.includes('.')) {
				console.log(2)
				return currentValue;
			}
			
			const newValue = currentValue + num;
			const floatValue = parseFloat(newValue);
			
			if (isNaN(floatValue)) {
				return currentValue;
			}
			
			return newValue;
		},
		
		// 处理删除
		handleDelete() {
			let currentValue = '';
			
			switch(this.selectInput) {
				case 2:
					currentValue = this.settlementData.currentSettlement.toString();
					this.settlementData.currentSettlement = this.deleteLastChar(currentValue);
					break;
				case 4:
					currentValue = this.settlementData.wechatAmount.toString();
					this.settlementData.wechatAmount = this.deleteLastChar(currentValue);
					break;
				case 5:
					currentValue = this.settlementData.alipayAmount.toString();
					this.settlementData.alipayAmount = this.deleteLastChar(currentValue);
					break;
				case 6:
					currentValue = this.settlementData.cashAmount.toString();
					this.settlementData.cashAmount = this.deleteLastChar(currentValue);
					break;
				case 7:
					currentValue = this.settlementData.bankAmount.toString();
					this.settlementData.bankAmount = this.deleteLastChar(currentValue);
					break;
			}
		},
		
		// 删除最后一个字符
		deleteLastChar(value) {
			if (value.length <= 1) {
				return '0';
			}
			return value.slice(0, -1);
		},
		
		// 清空所有金额
		handleClearAll() {
			this.settlementData.currentSettlement = 0;
			this.settlementData.wechatAmount = 0;
			this.settlementData.alipayAmount = 0;
			this.settlementData.cashAmount = 0;
			this.settlementData.bankAmount = 0;
		},
		
		// 确认结算
		handleConfirmSettlement() {
			const settlementAmount = parseFloat(this.settlementData.currentSettlement) || 0;
			
			if (settlementAmount <= 0) {
				uni.showToast({
					title: '请输入结算金额',
					icon: 'none'
				});
				return;
			}
			
			const unsettledAmount = parseFloat(this.settlementData.unsettledAmount) || 0;
			if (settlementAmount > unsettledAmount) {
				uni.showToast({
					title: '结算金额不能超过未结算金额',
					icon: 'none'
				});
				return;
			}
			
			// 验证收款方式金额总和
			const totalPaymentMethods = 
				(parseFloat(this.settlementData.wechatAmount) || 0) +
				(parseFloat(this.settlementData.alipayAmount) || 0) +
				(parseFloat(this.settlementData.cashAmount) || 0) +
				(parseFloat(this.settlementData.bankAmount) || 0);
			
			if (Math.abs(totalPaymentMethods - settlementAmount) > 0.01) {
				uni.showToast({
					title: '收款方式金额总和与结算金额不符',
					icon: 'none'
				});
				return;
			}
			
			// 构造结算数据
			const settlementResult = {
				customerId: this.customerInfo.id,
				customerName: this.customerInfo.customName,
				settlementAmount: settlementAmount,
				paymentMethods: {
					wechat: parseFloat(this.settlementData.wechatAmount) || 0,
					alipay: parseFloat(this.settlementData.alipayAmount) || 0,
					cash: parseFloat(this.settlementData.cashAmount) || 0,
					bank: parseFloat(this.settlementData.bankAmount) || 0
				},
				totalSettlement: parseFloat(this.settlementData.totalSettlement) || 0,
				unsettledAmount: parseFloat(this.settlementData.unsettledAmount) || 0
			};
			
			// 触发确认事件
			this.$emit('confirm', settlementResult);
		},
		
		// 关闭弹窗
		handleClose() {
			this.$emit('close');
		}
	}
}
</script>

<style lang="scss" scoped>
/* 现代化结算弹窗样式 */
.modern-settlement-modal {
	.settlement-modal-container {
		background: #e2e8f0;
		border-radius: 12rpx;
		padding: 5rpx;
		position: relative;
		height: 400rpx;
		overflow: hidden;
	}

	.modal-close-btn {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		width: 32rpx;
		height: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		z-index: 10;

		&:hover {
			background: #f1f5f9;
			transform: scale(1.1);
		}
	}

	.settlement-content-grid {
		display: grid;
		grid-template-columns: 1fr 0.8fr;
		gap: 5rpx;
		height: 400rpx;
	}

	.left-input-section {
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.settlement-info-section {
			background: white;
			border-radius: 8rpx;
			padding: 8rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			flex: 1;

			.section-title {
				font-size: 15rpx;
				font-weight: 600;
				color: #1e293b;
				margin-bottom: 6rpx;
				padding-bottom: 4rpx;
				border-bottom: 1rpx solid #e2e8f0;
			}

			.settlement-inputs {
				display: flex;
				flex-direction: column;
				gap: 3rpx;

				.input-row {
					display: flex;
					align-items: center;
					gap: 6rpx;
					padding: 3rpx 6rpx;
					border: 1rpx solid #e2e8f0;
					border-radius: 4rpx;
					transition: all 0.3s ease;
					cursor: pointer;
					min-height: 28rpx;

					&:hover {
						border-color: #cbd5e1;
					}

					&.active {
						border-color: #10b981;
						background: #ecfdf5;
					}
					
					&.readonly-row {
						background: #f8fafc;
						border-color: #e2e8f0;
						cursor: not-allowed;
						
						.input-label {
							color: #6b7280;
						}
						
						.amount-input {
							color: #6b7280;
						}
						
						&:hover {
							border-color: #e2e8f0;
						}
					}

					.input-label {
						font-size: 18rpx;
						font-weight: 500;
						color: #374151;
						min-width: 80rpx;
					}

					.amount-input {
						flex: 1;
						border: none;
						outline: none;
						font-size: 18rpx;
						font-weight: 600;
						text-align: center;
						background: transparent;
						color: #1e293b;
					}
				}
			}
		}

		.payment-methods-section {
			background: white;
			border-radius: 8rpx;
			padding: 8rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

			.section-title {
				font-size: 15rpx;
				font-weight: 600;
				color: #1e293b;
				margin-bottom: 6rpx;
				padding-bottom: 4rpx;
				border-bottom: 1rpx solid #e2e8f0;
			}

			.payment-methods-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 6rpx;
			}

			.payment-method-card {
				background: #f8fafc;
				border: 1rpx solid #e2e8f0;
				border-radius: 4rpx;
				padding: 6rpx 4rpx;
				text-align: center;
				cursor: pointer;
				transition: all 0.3s ease;
				position: relative;
				min-height: 50rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				&:hover {
					border-color: #10b981;
					box-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.15);
					transform: translateY(-1rpx);
				}

				&.active {
					background: linear-gradient(135deg, #10b981, #059669);
					border-color: #10b981;
					color: white;
					box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.25);

					.payment-label, .payment-amount {
						color: white;
					}
				}

				.payment-method-card-content {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 2rpx;
				}

				.payment-icon {
					margin-bottom: 2rpx;
				}

				.payment-label {
					font-size: 16rpx;
					font-weight: 500;
					color: #374151;
				}

				.payment-amount {
					font-size: 14rpx;
					color: #6b7280;
					font-weight: 600;
					margin-top: 2rpx;
				}
			}
		}
	}

	.right-keypad-section {
		background: white;
		border-radius: 8rpx;
		padding: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.customer-info-section {
			text-align: center;

			.customer-badge {
				display: inline-block;
				padding: 6rpx 12rpx;
				border-radius: 12rpx;
				font-weight: 600;
				font-size: 20rpx;
				color: white;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

				&.settlement {
					background: linear-gradient(135deg, #10b981, #059669);
				}

				.customer-name {
					font-size: 22rpx;
					margin-bottom: 2rpx;
				}

				.settlement-info {
					font-size: 16rpx;
					opacity: 0.9;
				}
			}
		}

		.modern-keypad {
            margin-top: 50rpx;
			display: grid;
			gap: 1rpx;
			flex: 1;

			.keypad-row {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				gap: 1rpx;

				.keypad-btn {
					height: 60rpx;
					line-height: 60rpx;
					width: 60rpx;
					border: none;
					border-radius: 4rpx;
					background: #f1f5f9;
					color: #374151;
					font-size: 30rpx;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s ease;
					box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

					&:hover {
						background: #e2e8f0;
						transform: translateY(-1rpx);
					}

					&:active {
						transform: translateY(0);
					}

					&.delete-btn {
						background: #ef4444;
						color: white;

						&:hover {
							background: #dc2626;
						}
					}
				}
			}
		}

		.action-buttons {
			display: grid;
			grid-template-columns: 1fr 2fr;
			gap: 6rpx;

			.action-btn {
				height: 35rpx;
				width: 100rpx;
				line-height: 35rpx;
				border: none;
				border-radius: 4rpx;
				font-size: 18rpx;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.3s ease;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

				&.clear-btn {
					background: linear-gradient(135deg, #6b7280, #4b5563);
					color: white;

					&:hover {
						background: linear-gradient(135deg, #4b5563, #374151);
						transform: translateY(-1rpx);
					}
				}

				&.confirm-btn {
					background: linear-gradient(135deg, #10b981, #059669);
					color: white;

					&:hover {
						background: linear-gradient(135deg, #059669, #047857);
						transform: translateY(-1rpx);
					}
				}
			}
		}
	}
}
</style>
