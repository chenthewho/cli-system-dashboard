<template>
	<view class="customer-container">
		<scroll-view class="customer-scroll-area" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="customer-list">
				<view v-for="item in memberOptionsShow" :key="item.id" class="customer-item-wrapper" @click="enterTodetail(item)">
					<div class="checkbox-section" v-if="isEdting">
						<u-checkbox-group placement="column" @change="checkboxChange(item.id)">
							<u-checkbox class="modern-checkbox" :key="item.id" label="" :checked="checkboxValue.includes(item.id)" />
						</u-checkbox-group>
					</div>

					<div class="customer-card" :class="{'editing': isEdting}">
						<div class="customer-header">
							<div class="customer-name">
								<uni-icons custom-prefix="iconfont" type="icon-kehu" size="18" color="#3b82f6"></uni-icons>
								<span>{{item.customName}}</span>
							</div>
							<div class="customer-phone">
								<uni-icons custom-prefix="iconfont" type="icon-dianhua" size="14" color="#6b7280"></uni-icons>
								<span>{{item.customPhone}}</span>
							</div>
						</div>
						
						<div class="customer-stats">
							<div class="stat-item " :class="{'debt-item':item.debts > 0}">
								<div class="stat-label">欠款</div>
								<text class="stat-value" :class="{'debt-amount':item.debts > 0}">{{item.debts.toFixed(1)}}元</text>
							</div>
							<div class="stat-item">
								<div class="stat-label">订单数</div>
								<text class="stat-value">{{item.orderNum}}</text>
							</div>
							<div class="stat-item">
								<div class="stat-label">欠筐</div>
								<text class="stat-value">{{item.owebasket}}</text>
							</div>
						</div>
					</div>
				</view>
			</view>
		</scroll-view>
		
		<div class="bottom-toolbar">
			<div class="stats-section">
				<div class="stat-group">
					<!-- <u-icon name="man-add" size="20" color="#3b82f6"></u-icon> -->
					<span class="stat-text">客户数: <strong>{{ memberOptions.length }}</strong></span>
				</div>
				<div class="stat-group">
					<span class="stat-text">总欠款: <strong class="debt-text">{{ allDebt.toFixed(1) }}</strong></span>
				</div>
				<div class="stat-group">
					<span class="stat-text">总欠筐: <strong>{{allOweBasket}}</strong></span>
				</div>
			</div>
			
			<div class="action-section">
				<button class="action-btn select-btn" @click="showEdit">
					<span>{{isEdting ? '取消' : '选中'}}</span>
				</button>
				<button class="action-btn delete-btn" @click="deleteHandle" v-if="isEdting" :disabled="!isEdting || checkboxValue.length === 0">
					<span>删除</span>
				</button>
				<button class="action-btn add-btn" @click="customerDialogVisible = true">
					<span>添加</span>
				</button>
			</div>
		</div>
<!-- 
		<u-modal title="" class="modern-customer-modal" :show="customerDialogVisible" :closeOnClickOverlay="true"
			:showConfirmButton="false" :showCancelButton="false" :width="600" @close="customerDialogVisible = false"> -->
			<view class="modern-customer-modal" v-if="customerDialogVisible">
			<div class="modal-container">
				<div class="modal-header">
					<h3 class="modal-title">添加客户</h3>
				</div>
				
				<div class="form-container">
					<div class="form-row">
						<label class="form-label">客户名称</label>
						<input class="form-input" type="text" placeholder="请输入客户名称" v-model="baseFormData.name" />
					</div>
					
					<div class="form-row">
						<label class="form-label">联系方式</label>
						<input class="form-input" type="text" placeholder="请输入联系方式" v-model="baseFormData.phone" />
					</div>
					
					<div class="form-row">
						<label class="form-label">车牌号码</label>
						<input class="form-input" type="text" placeholder="请输入车牌号码" v-model="baseFormData.carNum" />
					</div>
					
					<div class="form-row">
						<label class="form-label">联系地址</label>
						<input class="form-input" type="text" placeholder="请输入联系地址" v-model="baseFormData.address" />
					</div>
					
					<div class="form-actions">
						<button class="form-btn cancel-btn" @click="customerDialogVisible = false">取消</button>
						<button class="form-btn submit-btn" @click="submit()">确认添加</button>
					</div>
				</div>
			</div>
		</view>
		<!-- </u-modal> -->
	</view>
</template>

<script>
	import member from '../../api/member/member'

	export default {
		name: 'order',
		components: {},
		data() {
			return {
				curNow: 0,
				memberOptions: [],
				memberOptionsShow: [],
				scrollHeight: 0,
				allDebt: 0,
				allOweBasket: 0,
				customerDialogVisible: false,
				baseFormData: {
					name: '',
					phone: '',
					address: ''
				},
				searchstr:"",
				checkboxValue: [],
				isEdting: false
			}
		},
		created() {
			this.refresh();
		},
		onShow() {
			this.refresh();
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 100;
		},
		methods: {
			searchMember(str){
				this.searchstr = str;
				this.spiltMemberOptionsShow();
			},
			refresh() {
				let currentCompanyId = uni.getStorageSync('companyId');
				member.memberList(currentCompanyId).then(res => {
					this.allDebt = 0;
					this.allOweBasket = 0;
					this.memberOptions = res.data || [];
					for (let i = 0; i < this.memberOptions.length; i++) {
						this.allDebt += this.memberOptions[i].debts;
						this.allOweBasket += this.memberOptions[i].owebasket;
					}
					this.memberOptions.sort((a, b) => {
						return b.debts - a.debts; // 降序排序
					});
					this.spiltMemberOptionsShow();
				}).finally(() => {})
			},
			spiltMemberOptionsShow(){
				if(this.searchstr!=""){
					this.memberOptionsShow = this.memberOptions.filter(item => {
							return item.customName.indexOf(this.searchstr) != -1 || item.customPhone.indexOf(this.searchstr) != -1;
						})
				}else{
					this.memberOptionsShow = this.memberOptions;
				}
			},
			showEdit() {
				this.isEdting = !this.isEdting;
				if (this.checkboxValue.length > 0) {
					this.checkboxValue = [];
				}
			},
			enterTodetail(e) {
				uni.navigateTo({
					url: `/pages/order/CustomerMangerPage1?customerId=${e.id}`
				})
			},
			checkboxChange(e) {
				this.checkboxValue.push(e)
			},
			deleteHandle() {
				if (!this.isEdting || this.checkboxValue.length == 0) {
					return
				}
				var isflag = false;
				this.checkboxValue.forEach(item => {
					this.memberOptions.forEach(item2 => {
						if (item2.id == item) {
							if (item2.orderNum > 0 ) {
								isflag = true;
							}
						}
					})
				})
				if (isflag) {
					uni.showToast({
						title: '产生订单的客户不能删除',
						icon: 'none'
					})
					return;
				}
				member.memberDelete(JSON.stringify(this.checkboxValue)).then(res => {
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
					this.refresh();
				}).finally(() => {
					this.checkboxValue = [];
				})
			},
			submit() {
				if (this.baseFormData.phone == "" || this.baseFormData.name == "") {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return;
				}
				let currentCompanyId = uni.getStorageSync('companyId');
				var param = {
					id: "",
					CustomName: this.baseFormData.name,
					CustomPhone: this.baseFormData.phone,
					Address: this.baseFormData.address,
					CarNum :this.baseFormData.CarNum,
					CompanyId: currentCompanyId,
					Debts: 0,
					OrderNum: 0,
					Owebasket: 0
				}
				member.memberCreate(param).then(res => {
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					})
					this.baseFormData = {};
					this.customerDialogVisible = false;
					this.refresh();
				}).finally(() => {

				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.customer-container {
		background-color: darkgrey;
		height: calc(100vh - 60rpx);
		display: flex;
		flex-direction: column;
	}

	.customer-scroll-area {
		flex: 1;
		padding: 12rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
	}

	.customer-list {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.customer-item-wrapper {
		margin-top: 2rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2rpx);
		}
	}

	.checkbox-section {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40rpx;
		height: 40rpx;

		.modern-checkbox {
			transform: scale(1.2);
		}
	}

	.customer-card {
		flex: 1;
		background: white;
		border-radius: 5rpx;
		padding: 16rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
		cursor: pointer;

		&:hover {
			border-color: #3b82f6;
			box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.12);
		}

		&.editing {
			margin-left: 0;
		}
	}

	.customer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5rpx;
		padding-bottom: 5rpx;
		border-bottom: 1rpx solid #f1f5f9;
	}

	.customer-name {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 18rpx;
		font-weight: 600;
		color: #1e293b;

		span {
			color: #1e293b;
		}
	}

	.customer-phone {
		display: flex;
		align-items: center;
		gap: 6rpx;
		font-size: 15rpx;
		color: #6b7280;

		span {
			color: #6b7280;
		}
	}

	.customer-stats {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 16rpx;
	}

	.stat-item {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8rpx;
		background: #f8fafc;
		border-radius: 8rpx;
		border: 1rpx solid #e2e8f0;
		flex: 1;
		min-width: 0;
		&.debt-item {
			background: linear-gradient(135deg, #fef2f2, #fee2e2);
		}
	}

	.stat-label {
		font-size: 15rpx;
		color: #6b7280;
		font-weight: 500;
		margin-bottom: 0;
		text-align: left;
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stat-value {
		font-size: 15rpx;
		font-weight: 600;
		text-align: right;
		color: #374151;
		flex: 1;
		white-space: nowrap;
		justify-content: flex-end;
		display: flex;
		align-items: center;
		
		&.debt-amount {
			color: #dc2626;
		}
	}

	.bottom-toolbar {
		position: fixed;
		width: calc(100% - 70rpx);
		bottom: 0;
		background: white;
		border-top: 1rpx solid #e2e8f0;
		padding: 0 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.stats-section {
		display: flex;
		gap: 24rpx;
		align-items: center;
	}

	.stat-group {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.stat-text {
		font-size: 15rpx;
		color: #374151;

		strong {
			font-weight: 600;
			color: #1e293b;
		}

		.debt-text {
			color: #dc2626;
		}
	}

	.action-section {
		display: flex;
		gap: 12rpx;
	}

	.action-btn {
		height: 30rpx;
		margin: 5rpx;
		line-height: 30rpx;
		padding: 0 20rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 20rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		}

		&:active {
			transform: translateY(0);
		}

		&.select-btn {
			background: linear-gradient(135deg, #6b7280, #4b5563);
			color: white;

			&:hover {
				background: linear-gradient(135deg, #4b5563, #374151);
			}
		}

		&.delete-btn {
			background: linear-gradient(135deg, #ef4444, #dc2626);
			color: white;

			&:hover:not(:disabled) {
				background: linear-gradient(135deg, #dc2626, #b91c1c);
			}

			&:disabled {
				background: #d1d5db;
				color: #9ca3af;
				cursor: not-allowed;
				transform: none;
				box-shadow: none;
			}
		}

		&.add-btn {
			background: linear-gradient(135deg, #10b981, #059669);
			color: white;

			&:hover {
				background: linear-gradient(135deg, #059669, #047857);
			}
		}
	}

	/* 弹窗样式 */
	.modern-customer-modal {
			position: absolute;
			top: 10%;
			left: 30%;
			padding: 10prx;

		.modal-container {
			background: white;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 0 10rpx 0 #9e9e9e;
		}

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx 24rpx;
			background: linear-gradient(135deg, #3b82f6, #1d4ed8);
			color: white;

			.modal-title {
				font-size: 20rpx;
				font-weight: 600;
				margin: 0;
				color: white;
			}

			.modal-close {
				background: rgba(255, 255, 255, 0.2);
				border: none;
				border-radius: 50%;
				width: 40rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s ease;

				&:hover {
					background: rgba(255, 255, 255, 0.3);
					transform: scale(1.1);
				}
			}
		}

		.form-container {
			padding: 24rpx;
		}

		.form-row {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			gap: 16rpx;
		}

		.form-label {
			font-size: 15rpx;
			font-weight: 500;
			color: #374151;
			min-width: 90rpx;
			text-align: right;
		}

		.form-input {
			flex: 1;
			height: 30rpx;
			padding: 0 16rpx;
			border: 2rpx solid #e2e8f0;
			border-radius: 8rpx;
			font-size: 15rpx;
			background: #f8fafc;
			transition: all 0.3s ease;

			&:focus {
				outline: none;
				border-color: #3b82f6;
				background: white;
				box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.1);
			}

			&::placeholder {
				color: #9ca3af;
			}
		}

		.form-actions {
			display: flex;
			justify-content: center;
			gap: 16rpx;
			margin-top: 32rpx;
			padding-top: 20rpx;
			border-top: 1rpx solid #e2e8f0;
		}

		.form-btn {
			height: 35rpx;
			line-height: 35rpx;
			padding: 0 32rpx;
			border: none;
			border-radius: 8rpx;
			font-size: 20rpx;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.3s ease;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

			&:hover {
				transform: translateY(-2rpx);
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
			}

			&.cancel-btn {
				background: #f3f4f6;
				color: #374151;

				&:hover {
					background: #e5e7eb;
				}
			}

			&.submit-btn {
				background: linear-gradient(135deg, #3b82f6, #1d4ed8);
				color: white;

				&:hover {
					background: linear-gradient(135deg, #1d4ed8, #1e40af);
				}
			}
		}
	}

	/* 响应式设计 */
	@media (min-width: 768rpx) {
		.customer-stats {
			grid-template-columns: repeat(6, 1fr);
			gap: 12rpx;
		}

		.stat-item {
			padding: 6rpx;
		}

		.stat-label {
			font-size: 18rpx;
		}

		.stat-value {
			font-size: 22rpx;
		}
	}
</style>