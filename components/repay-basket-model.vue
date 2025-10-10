<template>
	<u-modal title="" class="modern-basket-modal" :show="inputModelVisible" :closeOnClickOverlay="true" 
		:showConfirmButton="false" :width="800" @close="inputModelVisible = false">
		<div class="basket-modal-container">
			<!-- 关闭按钮 -->
			<div class="modal-close-btn" @click="inputModelVisible = false">
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
			</div>
			
			<div class="basket-content-grid">
				<!-- 左侧：收筐列表和支付方式 -->
				<div class="left-basket-section">
					<!-- 收筐列表区域 -->
					<div class="basket-list-section">
						<div class="section-title">收筐明细</div>
						<div class="basket-items">
							<div class="basket-item" v-for="(item,index) in repayBasketList" :key="index">
								<div class="basket-row" :class="{'active': index === repayBasketActiveIndex}" @click="repayBasketActiveIndex = index">
									<div class="basket-name">{{ item.name }}</div>
									<div class="basket-input-wrapper">
										<input class="basket-quantity-input" v-model="item.quantity" readonly>
									</div>
									<div class="basket-price">单价：{{ item.amount || 0 }}</div>
									<div class="basket-total">小计：{{ (item.quantity || 0) * (item.amount || 0) }}</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 支付方式区域 -->
					<div class="payment-methods-section">
						<div class="section-header">
							<div class="section-title">支付方式</div>
							<div class="repay-basket-control">
								<button 
									class="repay-basket-btn" 
									:class="{'active': repayBasketType === 1, 'inactive': repayBasketType === 2}"
									@click="toggleRepayBasketType">
									{{repayBasketType === 1 ? '抵扣赊欠' : '不抵扣赊欠'}}
								</button>
							</div>
						</div>
						<div class="payment-methods-grid">
							<div class="payment-method-card" 
								v-for="(payitem, index) in payItemList" 
								:key="payitem.label"
								:class="{'active': payitem.active}"
								@click="selectPaymentMethod(index)">
								<div class="payment-method-card-content">
									<div class="payment-icon">
										<u-icon :name="payitem.icon" :size="24" :color="payitem.color"></u-icon>
									</div>
									<div class="payment-label">{{payitem.label}}</div>
								</div>
								<div class="payment-amount">{{payitem.amount.toFixed(2)}}</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 右侧：客户信息、数字键盘和操作按钮 -->
				<div class="right-keypad-section">
					<!-- 客户信息 -->
					<div class="customer-info-section">
						<div class="customer-badge" :class="currentMember && currentMember.debts > 0 ? 'debt' : 'normal'">
							<div class="customer-name">{{currentMember ? currentMember.customName : '散客'}}</div>
							<div v-if="currentMember && currentMember.debts > 0" class="debt-info">总下欠：{{currentMember.debts}}元</div>
						</div>
					</div>
					
					<!-- 数字键盘 -->
					<div class="modern-keypad">
						<div class="keypad-row">
							<button class="keypad-btn" @click="NumberCk3(1)">1</button>
							<button class="keypad-btn" @click="NumberCk3(2)">2</button>
							<button class="keypad-btn" @click="NumberCk3(3)">3</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="NumberCk3(4)">4</button>
							<button class="keypad-btn" @click="NumberCk3(5)">5</button>
							<button class="keypad-btn" @click="NumberCk3(6)">6</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="NumberCk3(7)">7</button>
							<button class="keypad-btn" @click="NumberCk3(8)">8</button>
							<button class="keypad-btn" @click="NumberCk3(9)">9</button>
						</div>
						<div class="keypad-row">
							<button class="keypad-btn" @click="NumberCk3(0)">0</button>
							<button class="keypad-btn" @click="NumberCk3('.')">.</button>
							<button class="keypad-btn delete-btn" @click="Tuige3()">
								<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
							</button>
						</div>
					</div>
					
					<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="action-btn cancel-btn" @click="cancelRepayBasket">取消收筐</button>
						<button class="action-btn confirm-btn" @click="payBasketConfirm">确认收筐</button>
					</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
	import basketApi from '@/api/basket/basketApi'
	export default {
		props: {
			// 基础类型检查（可选）
			basketData: {
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				repayBasketActiveIndex: 1,
				inputModelVisible: false,
				currentMember: null,
				repayBasketList: [],
				repayBasketType: 2, // 还框类型 1-抵扣赊欠 2-不抵扣赊欠
				payItemList: [{
					label: "微信支付",
					icon: "weixin-fill",
					color: "#07c160",
					amount: 0,
					active: false
				}, {
					label: "支付宝",
					icon: "zhifubao",
					color: "#1677ff",
					amount: 0,
					active: false
				}, {
					label: "现金",
					icon: "red-packet-fill",
					color: "#ff4757",
					amount: 0,
					active: false
				}, {
					label: "其他",
					icon: "coupon-fill",
					color: "#ffa502",
					amount: 0,
					active: false
				}],
				activePaymentIndex: -1
			}
		},
		computed: {
			// 计算收筐总金额
			totalBasketAmount() {
				return this.repayBasketList.reduce((total, item) => {
					return total + ((item.quantity || 0) * (item.amount || 0));
				}, 0);
			}
		},
		methods: {
			// 切换还框类型
			toggleRepayBasketType() {
				this.repayBasketType = this.repayBasketType === 1 ? 2 : 1;
				this.updatePaymentAmounts();
				uni.showToast({
					title: this.repayBasketType === 1 ? '已启用抵扣赊欠' : '已关闭抵扣赊欠',
					icon: 'none',
					duration: 1500
				});
			},
			// 选择支付方式
			selectPaymentMethod(index) {
				if (this.repayBasketType === 1) {
					// 抵扣赊欠模式下不允许选择支付方式
					return;
				}
				
				// 重置所有支付方式
				this.payItemList.forEach(item => {
					item.active = false;
					item.amount = 0;
				});
				
				// 设置选中的支付方式
				this.payItemList[index].active = true;
				this.payItemList[index].amount = this.totalBasketAmount;
				this.activePaymentIndex = index;
			},
			// 更新支付金额
			updatePaymentAmounts() {
				if (this.repayBasketType === 1) {
					// 抵扣赊欠：所有支付方式金额为0
					this.payItemList.forEach(item => {
						item.amount = 0;
						item.active = false;
					});
					this.activePaymentIndex = -1;
				} else {
					// 不抵扣赊欠：默认微信支付为总金额
					this.payItemList.forEach((item, index) => {
						item.active = index === 0; // 微信支付默认选中
						item.amount = index === 0 ? this.totalBasketAmount : 0;
					});
					this.activePaymentIndex = 0;
				}
			},
			playSystemKeyClickSound() {
				try {
					var Context = plus.android.importClass("android.content.Context");
					var AudioManager = plus.android.importClass("android.media.AudioManager");
					var main = plus.android.runtimeMainActivity();
					var audioManager = main.getSystemService(Context.AUDIO_SERVICE);
					audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
				} catch (e) {
					console.error("播放系统按键音失败:", e);
				}
			},
			//收筐
			payBasketConfirm() {
				let that = this;
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let totalAmount = 0;
				let baskerListSend = [] //发送后端对象需要转换
				for (var i = 0; i < this.repayBasketList.length; i++) {
					baskerListSend.push({
						"ExtraModelId": this.repayBasketList[i].id,
						"Mount": parseFloat(this.repayBasketList[i].quantity) ,
						"Price": this.repayBasketList[i].amount,
						"TotalMoney": (this.repayBasketList[i].quantity || 0) * (this.repayBasketList[i].amount ||
							0)
					})
					let basket = this.repayBasketList[i];
					totalAmount += (basket.quantity || 0) * (basket.amount || 0);
				}



				let orderExpenseDetail = {
					"alipayAmount": this.payItemList[1].amount, // 支付宝
					"wxpayAmount": this.payItemList[0].amount,  // 微信支付
					"cashAmount": this.payItemList[2].amount,   // 现金
					"otherAmount": this.payItemList[3].amount   // 其他
				}

				let param = {
					"companyId": CompanyId,
					"customerId":this.currentMember.id,
					"operatorId": userInfo.id,
					"basketList": baskerListSend,
					"totalAmount": totalAmount,
					"orderStatus": 1,
					"orderExpenseDetail": orderExpenseDetail,
					"RepayBasketType": this.repayBasketType, /// 还框类型 1-抵扣赊欠 2-不抵扣赊欠
				}
				basketApi.createRepayBasketOrder(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						that.$emit('saveBasketOffest')
						uni.showToast({
							title: "收筐成功",
							icon: "success",
							duration: 2000
						});
					} else {
						uni.showToast({
							title: "收筐失败",
							icon: "error",
							duration: 2000
						});
					}
					this.inputModelVisible = false;
				})
			},
			//初始化还筐对象
			resetPayBasket() {
				this.repayBasketList = [];
				this.repayBasketActiveIndex = 0;
				console.log("basketData", this.basketData)
				for (var i = 0; i < this.basketData.length; i++) {
					let basket = this.basketData[i];
					this.repayBasketList.push({
						id: basket.id,
						name: basket.name,
						amount: basket.amount,
						quantity: 0,
					})
				}
			},
			Tuige3() {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue === '' ? '0' : myvalue;
				
				// 数量变化后更新支付金额
				this.$nextTick(() => {
					this.updatePaymentAmounts();
				});
			},
			NumberCk3(val) {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue;
				
				// 数量变化后更新支付金额
				this.$nextTick(() => {
					this.updatePaymentAmounts();
				});
			},
			//取消收筐
			cancelRepayBasket() {
				this.inputModelVisible = false
				this.$emit('cancelRepayBasket')
			},
			//确认收筐
			saveBasketOffest() {
				this.inputModelVisible = false
				this.$emit('saveBasketOffest')
			},
			//打开收筐
			openRepayBasket(e) {
				this.currentMember = e;
				console.log("prop", this.currentMember)
				this.resetPayBasket();
				this.inputModelVisible = true;
				
				// 初始化支付金额
				this.$nextTick(() => {
					this.updatePaymentAmounts();
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 收筐弹窗样式 - 参照cashier.vue收银弹窗设计 */
	.modern-basket-modal {
		.basket-modal-container {
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

		.basket-content-grid {
			display: grid;
			grid-template-columns: 1fr 0.8fr;
			gap: 5rpx;
			height: 400rpx;
		}

		.left-basket-section {
			display: flex;
			flex-direction: column;
			gap: 6rpx;

			.basket-list-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
				flex: 1;

				.section-title {
					font-size: 15rpx;
					font-weight: 600;
					color: #888888;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;
				}

				.basket-items {
					display: flex;
					flex-direction: column;
					gap: 3rpx;

					.basket-item {
						.basket-row {
							display: grid;
							grid-template-columns: 1fr 80rpx 1fr 1fr;
							gap: 6rpx;
							align-items: center;
							padding: 3rpx 6rpx;
							border: 1rpx solid #e2e8f0;
							border-radius: 4rpx;
							transition: all 0.3s ease;
							cursor: pointer;
							min-height: 28rpx;
							font-size: 14rpx;

							&:hover {
								border-color: #cbd5e1;
							}

							&.active {
								border-color: #3b82f6;
								background: #eff6ff;
							}

							.basket-name {
								font-size: 12rpx;
								font-weight: 500;
								color: #374151;
							}

							.basket-input-wrapper {
								display: flex;
								justify-content: center;

								.basket-quantity-input {
									width: 50rpx;
									height: 20rpx;
									border: none;
									outline: none;
									font-size: 12rpx;
									font-weight: 600;
									text-align: center;
									background: transparent;
									color: #1e293b;
								}
							}

							.basket-price, .basket-total {
								font-size: 12rpx;
								font-weight: 500;
								color: #374151;
							}
						}
					}
				}
			}

			.payment-methods-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

				.section-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;

					.section-title {
						font-size: 15rpx;
						font-weight: 600;
						color: #888888;
					}

					.repay-basket-control {
						.repay-basket-btn {
							padding: 0rpx 12rpx;
							border-radius: 5rpx;
							border: none;
							font-size: 12rpx;
							font-weight: 600;
							cursor: pointer;
							transition: all 0.3s ease;
							box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

							&.active {
								background: linear-gradient(135deg, #10b981, #059669);
								color: white;
								
								&:hover {
									background: linear-gradient(135deg, #059669, #047857);
									transform: translateY(-1rpx);
								}
							}

							&.inactive {
								background: linear-gradient(135deg, #6b7280, #4b5563);
								color: white;
								
								&:hover {
									background: linear-gradient(135deg, #4b5563, #374151);
									transform: translateY(-1rpx);
								}
							}
						}
					}
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
						background: #dbeafe;
						border-color: #3b82f6;
						box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.2);
						
						.payment-label {
							color: #1d4ed8;
							font-weight: 600;
						}
						
						.payment-amount {
							color: #1d4ed8;
							font-weight: 700;
						}
					}

					.payment-method-card-content {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						gap: 4rpx;
					}

					.payment-icon {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 32rpx;
						height: 32rpx;
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

					&.normal {
						background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					}

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

					&.cancel-btn {
						background: #f3f4f6;
						color: #374151;

						&:hover {
							background: #e5e7eb;
							transform: translateY(-1rpx);
						}
					}

					&.confirm-btn {
						background: linear-gradient(135deg, #f59e0b, #d97706);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #d97706, #b45309);
							transform: translateY(-1rpx);
						}
					}
				}
			}
		}
	}
</style>