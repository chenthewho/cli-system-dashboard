<template>
	<u-modal 
		title="" 
		class="modern-repayment-modal" 
		:show="visible" 
		:closeOnClickOverlay="true"
		:showConfirmButton="false" 
		:width="800" 
		@close="handleClose">
		<div class="repayment-modal-container">
			<!-- 关闭按钮 -->
			<div class="modal-close-btn" @click="handleClose">
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
			</div>
			
			<div class="repayment-content-grid">
				<!-- 左侧：还款信息和支付方式 -->
				<div class="left-input-section">
					<!-- 还款信息区域 -->
					<div class="repayment-info-section">
						<div class="section-title">还款信息</div>
						<div class="repayment-inputs">
							<div class="input-row" :class="{'active': selectInput === 1}" @click="handleInputClick(1)">
								<label class="input-label">总欠款</label>
								<input v-model="repaymentData.totalDebt" inputmode="none" class="amount-input" readonly>
							</div>
							
							<div class="input-row" :class="{'active': selectInput === 2}" @click="handleInputClick(2)">
								<label class="input-label">本次还款</label>
								<input v-model="repaymentData.currentRepayment" inputmode="none" class="amount-input">
							</div>
							
							<div class="input-row" :class="{'active': selectInput === 3}" @click="handleInputClick(3)">
								<label class="input-label">剩余欠款</label>
								<input v-model="repaymentData.remainingDebt" inputmode="none" class="amount-input" readonly>
							</div>
						</div>
					</div>
					
					<!-- 支付方式区域 -->
					<div class="payment-methods-section">
						<div class="section-title">支付方式</div>
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
								<div class="payment-amount">{{repaymentData.wechatAmount}}</div>
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
								<div class="payment-amount">{{repaymentData.alipayAmount}}</div>
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
								<div class="payment-amount">{{repaymentData.cashAmount}}</div>
							</div>
							
							<div class="payment-method-card"
								:class="{'active': selectInput === 7}"
								@click="handleInputClick(7)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon name="coupon-fill" :size="24" color="#ffa502"></u-icon>
									</div>
									<div class="payment-label">其他</div>
								</div>
								<div class="payment-amount">{{repaymentData.otherAmount}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 右侧：顾客信息、数字键盘和操作按钮 -->
				<div class="right-keypad-section">
					<!-- 顾客信息 -->
					<div class="customer-info-section">
						<div class="customer-badge debt">
							<div class="customer-name">{{customerInfo.customName || '散客'}}</div>
							<div class="debt-info">总欠款：{{repaymentData.totalDebt}}元</div>
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
							<button class="keypad-btn delete-btn" @click="handleDelete">
								<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
							</button>
						</div>
					</div>
					
					<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="action-btn clear-btn" @click="handleClearAll">清空</button>
						<button class="action-btn confirm-btn" @click="handleConfirmRepayment">确认还款</button>
					</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
import oweApi from '@/api/owe/owe'
export default {
	name: 'RepaymentModal',
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
				name: '',
				totalDebt: 0
			})
		},
		// 初始还款数据
		initialData: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			// 当前选中的输入框
			selectInput: 2, // 默认选中本次还款
			// 还款数据
			repaymentData: {
				totalDebt: 0,          // 总欠款
				currentRepayment: 0,   // 本次还款
				remainingDebt: 0,      // 剩余欠款
				wechatAmount: 0,       // 微信支付金额
				alipayAmount: 0,       // 支付宝支付金额
				cashAmount: 0,         // 现金支付金额
				otherAmount: 0         // 其他支付金额
			}
		}
	},
	watch: {
		visible(newVal) {
			if (newVal) {
				this.initRepaymentData();
			}
		},
		customerInfo: {
			handler(newVal) {
				if (newVal) {
					console.log("newVal",newVal)
					this.repaymentData.totalDebt = newVal.debts || 0;
					this.calculateRemainingDebt();
				}
			},
			deep: true,
			immediate: true
		},
		'repaymentData.currentRepayment'(newVal) {
			this.calculateRemainingDebt();
			// this.validatePaymentMethods();
		}
	},
	methods: {
		// 初始化还款数据
		initRepaymentData() {
			console.log("this.customerInfo",this.customerInfo)
			this.repaymentData.currentRepayment = 0;
			if (this.customerInfo) {
				this.repaymentData.totalDebt = this.customerInfo.debts || 0;
			}
			
			// 合并初始数据
			if (this.initialData) {
				Object.assign(this.repaymentData, this.initialData);
			}
			
			this.calculateRemainingDebt();
		},
		
		// 计算剩余欠款
		calculateRemainingDebt() {
			const totalDebt = parseFloat(this.repaymentData.totalDebt) || 0;
			const currentRepayment = parseFloat(this.repaymentData.currentRepayment) || 0;
			this.repaymentData.remainingDebt = (totalDebt - currentRepayment).toFixed(0);
			//默认微信支付
			this.repaymentData.wechatAmount = this.repaymentData.currentRepayment;
		},
		
		// 验证支付方式金额总和
		validatePaymentMethods() {
			const totalPayment = 
				(parseFloat(this.repaymentData.wechatAmount) || 0) +
				(parseFloat(this.repaymentData.alipayAmount) || 0) +
				(parseFloat(this.repaymentData.cashAmount) || 0) +
				(parseFloat(this.repaymentData.otherAmount) || 0);
			
			this.repaymentData.currentRepayment = totalPayment.toFixed(0);
		},
		
		// 处理输入框点击
		handleInputClick(inputType) {
			this.selectInput = inputType;
		},
		
		// 处理数字键盘点击
		handleNumberClick(num) {
			let currentValue = '';
			
			switch(this.selectInput) {
				case 2:
					currentValue = this.repaymentData.currentRepayment.toString();
					this.repaymentData.currentRepayment = this.appendNumber(currentValue, num);
					break;
				case 4:
					currentValue = this.repaymentData.wechatAmount.toString();
					this.repaymentData.wechatAmount = this.appendNumber(currentValue, num);
					break;
				case 5:
					currentValue = this.repaymentData.alipayAmount.toString();
					this.repaymentData.alipayAmount = this.appendNumber(currentValue, num);
					break;
				case 6:
					currentValue = this.repaymentData.cashAmount.toString();
					this.repaymentData.cashAmount = this.appendNumber(currentValue, num);
					break;
				case 7:
					currentValue = this.repaymentData.otherAmount.toString();
					this.repaymentData.otherAmount = this.appendNumber(currentValue, num);
					break;
			}
			console.log("currentRepayment",this.repaymentData)
		},
		
		// 数字拼接逻辑
		appendNumber(currentValue, num) {
			console.log("currentValue",currentValue)
			console.log("num",num)
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
					currentValue = this.repaymentData.currentRepayment.toString();
					this.repaymentData.currentRepayment = this.deleteLastChar(currentValue);
					break;
				case 4:
					currentValue = this.repaymentData.wechatAmount.toString();
					this.repaymentData.wechatAmount = this.deleteLastChar(currentValue);
					break;
				case 5:
					currentValue = this.repaymentData.alipayAmount.toString();
					this.repaymentData.alipayAmount = this.deleteLastChar(currentValue);
					break;
				case 6:
					currentValue = this.repaymentData.cashAmount.toString();
					this.repaymentData.cashAmount = this.deleteLastChar(currentValue);
					break;
				case 7:
					currentValue = this.repaymentData.otherAmount.toString();
					this.repaymentData.otherAmount = this.deleteLastChar(currentValue);
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
		//还款执行
		repayAction(){
			var userInfo = uni.getStorageSync("userInfo");
			const companyId = uni.getStorageSync('companyId');
			let accountExpense = {
				wxpayAmount:parseFloat(this.repaymentData.wechatAmount),
				alipayAmount:parseFloat(this.repaymentData.alipayAmount),
				cashAmount:parseFloat(this.repaymentData.cashAmount),
				otherAmount:parseFloat(this.repaymentData.otherAmount),
			};

			oweApi.createRepayOrder({
				customerId:this.customerInfo.id,
				companyId:companyId,
				operatorId:userInfo.id,
				repayAmount:parseFloat(this.repaymentData.currentRepayment),
				accountExpense:accountExpense,
				attachOrderIdList:[],
			}).then(res=>{
				if(res.code == 200){
					uni.showToast({
						title: '还款成功',
						icon: 'success'
					});
					this.$emit('confirm',res.data);
					this.handleClose();
				}else{
					uni.showToast({
						title: '还款失败',
						icon: 'none'
					});
				}

			})
		},

		// 清空所有金额
		handleClearAll() {
			this.repaymentData.currentRepayment = 0;
			this.repaymentData.wechatAmount = 0;
			this.repaymentData.alipayAmount = 0;
			this.repaymentData.cashAmount = 0;
			this.repaymentData.otherAmount = 0;
		},
		
		// 确认还款
		handleConfirmRepayment() {
			const repaymentAmount = parseFloat(this.repaymentData.currentRepayment) || 0;
			
			if (repaymentAmount <= 0) {
				uni.showToast({
					title: '请输入还款金额',
					icon: 'none'
				});
				return;
			}
			
			const totalDebt = parseFloat(this.repaymentData.totalDebt) || 0;
			if (repaymentAmount > totalDebt) {
				uni.showToast({
					title: '还款金额不能超过总欠款',
					icon: 'none'
				});

				return;
			}
			
			// 验证支付方式金额总和
			const totalPaymentMethods = 
				(parseFloat(this.repaymentData.wechatAmount) || 0) +
				(parseFloat(this.repaymentData.alipayAmount) || 0) +
				(parseFloat(this.repaymentData.cashAmount) || 0) +
				(parseFloat(this.repaymentData.otherAmount) || 0);
			
			if (Math.abs(totalPaymentMethods - repaymentAmount) > 0.01) {
				uni.showToast({
					title: '支付方式金额总和与还款金额不符',
					icon: 'none'
				});
				return;
			}

			//进入还款执行
			this.repayAction();
		},
		
		// 关闭弹窗
		handleClose() {
			this.$emit('close');
		}
	}
}
</script>

<style lang="scss" scoped>
/* 现代化还款弹窗样式 */
.modern-repayment-modal {
	.repayment-modal-container {
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

	.repayment-content-grid {
		display: grid;
		grid-template-columns: 1fr 0.8fr;
		gap: 5rpx;
		height: 400rpx;
	}

	.left-input-section {
		display: flex;
		flex-direction: column;
		gap: 6rpx;

		.repayment-info-section {
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

			.repayment-inputs {
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
						border-color: #3b82f6;
						background: #eff6ff;
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
					border-color: #3b82f6;
					box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.15);
					transform: translateY(-1rpx);
				}

				&.active {
					background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					border-color: #3b82f6;
					color: white;
					box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.25);

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

				&.debt {
					background: linear-gradient(135deg, #ef4444, #dc2626);
				}

				.customer-name {
					font-size: 22rpx;
					margin-bottom: 2rpx;
				}

				.debt-info {
					font-size: 16rpx;
					opacity: 0.9;
				}
			}
		}

		.modern-keypad {
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