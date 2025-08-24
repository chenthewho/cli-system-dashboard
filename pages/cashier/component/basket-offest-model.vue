<template>
	<u-modal title="" class="modern-basket-offest-modal" :show="inputModelVisible" :closeOnClickOverlay="true" 
		:showConfirmButton="false" :width="800" @close="inputModelVisible = false">
		<div class="basket-offest-modal-container">
			<!-- 关闭按钮 -->
			<div class="modal-close-btn" @click="inputModelVisible = false">
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
			</div>
			
			<div class="basket-offest-content-grid">
				<!-- 左侧：收筐信息 -->
				<div class="left-basket-section">
					<!-- 收筐信息区域 -->
					<div class="basket-info-section">
						<div class="section-title">收筐信息</div>
						<div class="basket-items-list">
							<div class="basket-item" v-for="(item,index) in repayBasketList" :key="index">
								<div class="basket-item-content" :class="{'active': repayBasketActiveIndex === index}" @click="repayBasketActiveIndex = index">
									<div class="item-name">{{ item.name }}</div>
									<div class="item-input">
										<input v-model="item.quantity" inputmode="none" class="quantity-input" readonly>
									</div>
									<div class="item-price">单价：{{ item.amount || 0 }}</div>
									<div class="item-total">小计：{{ (item.quantity || 0) * (item.amount || 0) }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- 右侧：数字键盘和操作按钮 -->
				<div class="right-keypad-section">
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
							<button class="keypad-btn clear-btn" @click="Clear3()">C</button>
							<button class="keypad-btn" @click="NumberCk3(0)">0</button>
							<button class="keypad-btn delete-btn" @click="Tuige3()">
								<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
							</button>
						</div>
					</div>
					
					<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="action-btn cancel-btn" @click="cancelRepayBasket">取消收筐</button>
						<button class="action-btn confirm-btn" @click="saveBasketOffest">确认收筐</button>
					</div>
				</div>
			</div>
		</div>
	</u-modal>
</template>

<script>
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
				payItemList: [{
					label: "微信支付"
				}, {
					label: "支付宝"
				}, {
					label: "现金"
				}, {
					label: "其他"
				}]
			}
		},
		methods: {
			//打开收筐
			open(repayBasketList) {
				this.resetPayBasket();

				// Create a map for faster lookup
				const repayBasketMap = new Map();
				
				for(var i = 0;i<repayBasketList.length;i++){
					 repayBasketMap.set(repayBasketList[i].id, repayBasketList[i].quantity)
				}

				// Update quantities
				this.repayBasketList = this.repayBasketList.map(item => {
					if (repayBasketMap.has(item.id)) {
						return {
							...item,
							quantity: repayBasketMap.get(item.id)
						};
					}
					return item;
				});

				this.inputModelVisible = true;
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
			//初始化还筐对象
			resetPayBasket() {
				this.repayBasketList = [];
				this.repayBasketActiveIndex = 0;
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
			},
			// 清空当前输入
			Clear3() {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				this.repayBasketList[this.repayBasketActiveIndex].quantity = '0';
			},
			//取消收筐
			cancelRepayBasket() {
				this.inputModelVisible = false
				this.$emit('saveBasketOffest',[])
			},
			//确认收筐
			saveBasketOffest() {
				this.inputModelVisible = false
				this.$emit('saveBasketOffest',this.repayBasketList)
			},

		}
	}
</script>

<style lang="scss" scoped>
/* 现代化收筐弹窗样式 */
.modern-basket-offest-modal {
	.basket-offest-modal-container {
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

	.basket-offest-content-grid {
		display: grid;
		grid-template-columns: 1fr 0.8fr;
		gap: 5rpx;
		height: 400rpx;
	}

	.left-basket-section {
		display: flex;
		flex-direction: column;

		.basket-info-section {
			background: white;
			border-radius: 8rpx;
			padding: 8rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			flex: 1;
			overflow-y: auto;

			.section-title {
				font-size: 15rpx;
				font-weight: 600;
				color: #1e293b;
				margin-bottom: 6rpx;
				padding-bottom: 4rpx;
				border-bottom: 1rpx solid #e2e8f0;
			}

			.basket-items-list {
				display: flex;
				flex-direction: column;
				gap: 3rpx;

				.basket-item {
					.basket-item-content {
						display: grid;
						grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
						gap: 6rpx;
						padding: 6rpx;
						border: 1rpx solid #e2e8f0;
						border-radius: 4rpx;
						transition: all 0.3s ease;
						cursor: pointer;
						align-items: center;

						&:hover {
							border-color: #cbd5e1;
						}

						&.active {
							border-color: #3b82f6;
							background: #eff6ff;
						}

						.item-name {
							font-size: 16rpx;
							font-weight: 600;
							color: #374151;
						}

						.item-input {
							.quantity-input {
								width: 100%;
								border: none;
								outline: none;
								font-size: 16rpx;
								font-weight: 600;
								text-align: center;
								background: transparent;
								color: #1e293b;
								padding: 2rpx 4rpx;
								border-radius: 2rpx;
								background: #f8fafc;
							}
						}

						.item-price, .item-total {
							font-size: 14rpx;
							color: #6b7280;
							text-align: center;
						}
					}
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

					&.clear-btn {
						background: #f59e0b;
						color: white;

						&:hover {
							background: #d97706;
						}
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
			grid-template-columns: 1fr 1fr;
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