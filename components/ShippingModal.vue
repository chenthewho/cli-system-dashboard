<template>
	<view v-if="visible" class="shipping-modal-mask" @click="handleCancel">
		<view class="shipping-modal-wrapper" @click.stop>
			<view class="shipping-modal-container">
				<!-- 标题区域 -->
				<view class="shipping-modal-header">
					<text class="header-title">设置运费</text>
					<text class="header-subtitle">请输入本单的运费金额</text>
				</view>
				
				<!-- 内容区域 -->
				<view class="shipping-modal-content">
					
					<!-- 输入框 -->
					<view class="input-wrapper">
						<view class="input-label">
							<text class="label-text">运费金额</text>
							<text class="label-required">*</text>
						</view>
						<view class="input-container">
							<text class="input-prefix">¥</text>
							<input 
								type="digit"
								v-model="tempShippingFee" 
								placeholder="0.00"
								class="shipping-input"
								@input="validateShippingFee"
							/>
							<button 
								v-if="tempShippingFee && tempShippingFee > 0" 
								@click="tempShippingFee = 0"
								class="clear-shipping-btn"
							>
								清空
							</button>
						</view>
						<text class="input-hint">运费将计入订单总金额</text>
					</view>
					
					<!-- 快捷金额选择 -->
					<view class="quick-amount-section">
						<text class="section-label">快捷选择</text>
						<view class="quick-amount-buttons">
							<view 
								v-for="amount in quickAmounts" 
								:key="amount"
								@click="tempShippingFee = amount"
								class="quick-amount-btn"
								:class="{ active: tempShippingFee == amount }"
							>
								¥{{ amount }}
							</view>
						</view>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="shipping-modal-footer">
					<button class="btn-cancel" @click="handleCancel">
						取消
					</button>
					<button 
						class="btn-confirm" 
						@click="handleConfirm"
						:class="{ disabled: isDisabled }"
						:disabled="isDisabled"
					>
						<uni-icons type="checkmarkempty" size="26" color="#fff" style="margin-right: 6px;"></uni-icons>
						确认设置
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ShippingModal',
	props: {
		// 控制弹窗显示/隐藏
		visible: {
			type: Boolean,
			default: false
		},
		// 初始运费金额
		initialValue: {
			type: Number,
			default: 0
		},
		// 快捷金额选项
		quickAmounts: {
			type: Array,
			default: () => [5, 10, 20, 30]
		}
	},
	data() {
		return {
			tempShippingFee: 0
		}
	},
	computed: {
		// 判断确认按钮是否禁用
		isDisabled() {
			return this.tempShippingFee == null || 
				   this.tempShippingFee === '' || 
				   this.tempShippingFee < 0;
		}
	},
	watch: {
		// 监听弹窗显示状态，重置临时运费
		visible(newVal) {
			if (newVal) {
				this.tempShippingFee = this.initialValue;
			}
		}
	},
	methods: {
		// 验证运费输入
		validateShippingFee() {
			// 确保输入的是有效数字
			if (this.tempShippingFee < 0) {
				this.tempShippingFee = 0;
			}
		},
		// 取消设置
		handleCancel() {
			this.tempShippingFee = 0;
			this.$emit('close');
		},
		// 确认设置
		handleConfirm() {
			if (!this.isDisabled) {
				const fee = parseFloat(this.tempShippingFee);
				this.$emit('confirm', fee);
				this.tempShippingFee = 0;
			}
		}
	}
}
</script>

<style lang="scss" scoped>
/* 运费弹窗样式 */
.shipping-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.shipping-modal-wrapper {
	width: 650px;
	max-width: 90%;
	max-height: 90vh;
	overflow: hidden;
	border-radius: 12px;
	box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
}

.shipping-modal-container {
	background: white;
	overflow: hidden;
}

.shipping-modal-header {
	background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
	padding: 20px 24px;
	text-align: center;
	color: white;
	
	.header-title {
		display: block;
		font-size: 30px;
		font-weight: bold;
		margin-bottom: 8px;
	}
	
	.header-subtitle {
		display: block;
		font-size: 18px;
		opacity: 0.9;
	}
}

.shipping-modal-content {
	padding: 32px 28px;
	
	.input-wrapper {
		margin-bottom: 32px;
		
		.input-label {
			display: flex;
			align-items: center;
			margin-bottom: 12px;
			
			.label-text {
				font-size: 20px;
				font-weight: 600;
				color: #303133;
			}
			
			.label-required {
				color: #f56c6c;
				margin-left: 6px;
				font-size: 22px;
			}
		}
		
		.input-container {
			display: flex;
			align-items: center;
			padding: 0 20px;
			background: #fff;
			border: 3px solid #dcdfe6;
			border-radius: 10px;
			transition: all 0.3s ease;
			position: relative;
			
			&:focus-within {
				border-color: #00aaff;
				box-shadow: 0 0 0 4px rgba(0, 170, 255, 0.1);
			}
			
			.input-prefix {
				font-size: 28px;
				font-weight: bold;
				color: #909399;
				margin-right: 6px;
			}

			.shipping-input {
				flex: 1;
				padding: 0px 0px 0px 10px;
				border: none;
				font-size: 20rpx;
				font-weight: bold;
				color: #303133;
				outline: none;
				background: transparent;
			}
			
			.clear-shipping-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 4px 8px;
				margin-left: 12px;
				background: #f5f7fa;
				color: #606266;
				font-size: 18px;
				font-weight: 600;
				border: 2px solid #e4e7ed;
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.2s ease;
				white-space: nowrap;
				
				&:hover {
					background: #ecf5ff;
					border-color: #b3d8ff;
					color: #409eff;
				}
				
				&:active {
					background: #d9ecff;
					transform: scale(0.96);
				}
			}
		}
		
		.input-hint {
			display: block;
			margin-top: 10px;
			font-size: 16px;
			color: #909399;
			padding-left: 6px;
		}
	}
	
	.quick-amount-section {
		.section-label {
			display: block;
			font-size: 18px;
			font-weight: 600;
			color: #606266;
			margin-bottom: 16px;
		}
		
		.quick-amount-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 14px;
			
			.quick-amount-btn {
				flex: 0 0 calc(25% - 10.5px);
				padding: 18px 12px;
				background: #f5f7fa;
				border: 3px solid #e4e7ed;
				border-radius: 10px;
				font-size: 22px;
				font-weight: bold;
				color: #606266;
				cursor: pointer;
				transition: all 0.2s ease;
				text-align: center;
				
				&:hover {
					background: #ecf5ff;
					border-color: #b3d8ff;
					color: #409eff;
				}
				
				&.active {
					background: #00aaff;
					border-color: #00aaff;
					color: white;
					transform: scale(1.05);
				}
				
				&:active {
					transform: scale(0.98);
				}
			}
		}
	}
}

.shipping-modal-footer {
	display: flex;
	gap: 16px;
	padding: 20px 28px 28px;
	background: #f8f9fa;
	border-top: 1px solid #e9ecef;
	
	button {
		flex: 1;
		height: 60px;
		border-radius: 10px;
		font-size: 20px;
		font-weight: bold;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.btn-cancel {
		background: #f5f5f5;
		color: #606266;
		
		&:hover {
			background: #e9e9e9;
		}
		
		&:active {
			transform: scale(0.98);
		}
	}
	
	.btn-confirm {
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		color: white;
		box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
		
		&:hover {
			box-shadow: 0 6px 16px rgba(0, 170, 255, 0.4);
			transform: translateY(-1px);
		}
		
		&:active {
			transform: translateY(0) scale(0.98);
		}
		
		&.disabled {
			background: #c0c4cc;
			box-shadow: none;
			cursor: not-allowed;
			opacity: 0.6;
			
			&:hover {
				transform: none;
			}
		}
	}
}
</style>

