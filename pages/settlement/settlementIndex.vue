<template>
	<div :style="{ 'display': 'flex', 'height': WindowHeight + 'px', width: '100%' }">
		<div style="width: 200rpx; background-color: #ffffff;display: flex;">
			<div>
				<div style="text-align: center;">
					<u-tabs :list="tabList" :itemStyle="{ width: '80px', height: '40px', fontWeight: 'bold' }"
						@click="changeType"
						style="display: inline-block;margin-top: 10rpx;margin-bottom: 10rpx;"></u-tabs>
				</div>
				<!-- 圆弧边卡片 -->
				<div style="display: flex; flex-direction: column; gap: 5rpx;">

					<div v-if="batchShowList.length === 0" :key="1" :style="{
						marginLeft: '5rpx',
						marginRight: '5rpx',
						width: '150rpx',
						backgroundColor: '#d0d0d0', // 浅绿色或白色
						color: '#000000',
						borderRadius: '12rpx',
						boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
						padding: '10rpx',
						boxSizing: 'border-box',
						textAlign: 'left',
						fontSize: '14rpx'
					}">
						<div>
							<div style="display: flex;line-height: 15rpx;"> <text
									style="font-size: 15rpx; font-weight: bold;">
									暂无批次
								</text>
								<text style="font-size: 12rpx; font-weight: bold;margin-left: 5rpx;">

								</text>
							</div>
						</div>
					</div>
					<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight - 80 + 'px' }">
						<div v-for="item in batchShowList" @click="exchangeBatch(item)" :key="item.id" :style="{
							marginLeft: '5rpx',
							marginRight: '5rpx',
							width: '150rpx',
							marginTop: '5px',
							backgroundColor: selectBatch.id === item.id ? '#00aaff' : '#ffffff', // 浅绿色或白色
							color: selectBatch.id === item.id ? '#ffffff' : '#000000',
							borderRadius: '12rpx',
							boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
							padding: '10rpx',
							boxSizing: 'border-box',
							textAlign: 'left',
							fontSize: '14rpx'
						}">
							<div>
								<div style="display: flex;line-height: 15rpx;"> <text
										style="font-size: 15rpx; font-weight: bold;">
										{{ item.shipperName }}
									</text>
									<text style="font-size: 12rpx; font-weight: bold;margin-left: 5rpx;">
										{{ item.batchCode }}
									</text>
								</div>
								<text style="font-size: 8rpx; font-weight: bold;">创建时间：{{ item.createTime.replace("T", "")}}</text>
							</div>
						</div>
					</scroll-view>
				</div>
			</div>
			<!-- 垂直线 -->
			<div style="width: 5rpx; background-color: #ccc; "></div>
		</div>
		<div style="width: 100%;; background-color: #ffffff; ">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;" v-if="selectBatch">
					<div style="display: flex;"><text
							style="margin-right: 5rpx;">{{ selectBatch.shipperName }}</text><text>{{ selectBatch.batchCode }}</text>
					</div>
					<text style="font-size: 8rpx; font-weight: bold;">创建时间：{{ selectBatch.createTime.replace("T", "")}}</text>
				</div>
				<div style="text-align: right;font-weight: bold;">
					<DropdownOperater :options="operatorBtnoptions" :fontSize="12" :menuFontSize="12"
						:defaultValue="batchCalcType" :width="105" :height="20" :iconPosition="-5"
						@click="showSetBatchAssist" />
				</div>
			</div>
			<div style="height: 3rpx;background-color: #ccc;margin-bottom: 5rpx;"></div>
			<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
				<div style="margin-left: 5rpx;margin-right: 5rpx;border: solid 1px #909090;">
					<!-- 表头 -->
					<div
						style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
						<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">货品
						</div>
						<div style="flex: 1; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">均价
						</div>
						<div style="flex: 1; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">均重
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">销量
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">销售货款
						</div>
						<div style="flex: 1; padding: 8px; text-align: center;">库存</div>
					</div>

					<!-- 表格内容行 -->
					<div style="display: flex; border-bottom: 1px solid #ddd;" v-for="item in BatchCommodityList">
						<div
							style="flex: 3; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.commodityName }}
						</div>
						<div v-if="item.averagePrice!=undefined"
							style="flex: 1; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.averagePrice != null && item.averagePrice != 'NaN' ? item.averagePrice.toFixed(1) : '---' }}
						</div>
						<div v-if="item.averageWeight!=undefined"
							style="flex: 1; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.averageWeight != null && item.averageWeight != 'NaN'&&item.averageWeight!='Infinity' ? item.averageWeight.toFixed(1)  : '---' }}
						</div>
						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							<text
								v-for="model in item.outPutSaleMount">{{ model.mount }}{{ model.specName }}</text>/（{{ item.saleWeight }}斤）
						</div>
						<div
							style="flex: 2; padding: 8px;border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.saleSubTotal }}
						</div>
						<div style="flex: 1; padding: 8px; text-align: center;font-weight: bold;display: flex;"><text
								v-for="model in item.outPutPurchaseInventories"
								v-if="item.outPutPurchaseInventories.length > 0">{{ model.mount }}{{ model.specName }}</text>
							<text v-if="item.outPutPurchaseInventories.length === 0">0</text>
						</div>
					</div>
					<!--合计-->
					<div style="display: flex; border-bottom: 1px solid #ddd;">
						<div
							style="flex: 1; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							合计
						</div>
						<div style="flex: 3; padding: 8px;  text-align: center;font-weight: bold;">
							总销量：{{ batchCommodityTotal.totalMount }}|总重：{{ batchCommodityTotal.totalWeight }}斤
						</div>
						<div style="flex: 2; padding: 8px; text-align: center;font-weight: bold;">
							销售总额：{{ batchCommodityTotal.totalMoney }}元
						</div>
					</div>
					<div style="display: flex; border-bottom: 1px solid #ddd;" >
						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							代卖类型：{{ batchCommodityTotal.assistType == 0 ? '按批次' : batchCommodityTotal.assistType == 1 ?
								'按数量' : batchCommodityTotal.assistType == 2 ? '按重量' : '' }}
						</div>
						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;" v-if="batchCommodityTotal.assistType != 0">
							代卖单价：{{ batchCommodityTotal.assistUnitPrice }}/{{ batchCommodityTotal.assistType == 1 ? '数量' :
								batchCommodityTotal.assistType == 2 ? '重量' : '' }}
						</div>
						<div v-if="batchCommodityTotal.assistAmount != undefined" style="flex: 2; padding: 8px; text-align: center;font-weight: bold;">
							代卖总费用：{{ batchCommodityTotal.assistAmount.toFixed(1) }}元
						</div>
					</div>
					<div style="height: 100rpx;" v-if="BatchCommodityList.length == 0">
						<div style=" margin-top: 40rpx; text-align: center;">
							<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40"
								color="#969696"></uni-icons>
							<div style="margin-top: 10px; color: #969696;font-weight: bold;">无货品</div> <!-- 添加的文字 -->
						</div>
					</div>
				</div>
				<div
					style="display: flex; justify-content: space-between; align-items: center; width: 100%;margin-top: 20rpx;">
					<div style="text-align: left;font-weight: bold;margin-left: 10rpx;"><uni-icons
							custom-prefix="iconfont" type="icon-fuzhushuxian" size="20" color="#00aaff"
							style="margin-right: 5rpx;"></uni-icons>成本费用</div>
					<div style="text-align: right;"> <button @click="showAddexpenses"
							style="height: 20rpx;line-height: 20rpx;font-weight: bold;margin-right: 10rpx;background-color: white;border: 1px solid dodgerblue;color: dodgerblue ;">添加费用</button>
					</div>
				</div>
				<div style="margin-left: 5rpx;margin-right: 5rpx;margin-top: 10px;border: solid 1px #909090;">
					<div
						style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">费用名
						</div>
						<div style="flex: 1; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">金额
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">添加时间
						</div>
						<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">备注
						</div>
						<div style="flex: 1; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">操作
						</div>
					</div>
					<!-- 表格内容行 -->
					<div style="display: flex; border-bottom: 1px solid #ddd;" v-for="(item, index) in expenseList">
						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.expensesLabel }}
						</div>
						<div
							style="flex: 1; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.expensesMoney }}
						</div>
						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.createTime.replace("T", " ") }}
						</div>
						<div
							style="flex: 3; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{ item.remark }}
						</div>
						<div
							style="flex: 1; padding: 8px; border-right: 1px solid #ddd; font-weight: bold; display: flex; justify-content: center; align-items: center;">
							<uni-icons @click="modifyExpense" custom-prefix="iconfont" type="icon-xiugai" size="20"
								color="#7a7a7a" style="margin-right: 5rpx;"></uni-icons>|
							<uni-icons @click="deleteExpense(index)" custom-prefix="iconfont" type="icon-shanchu"
								size="20" color="#aa0000 " style="margin-left: 5rpx;"></uni-icons>
						</div>
					</div>
					<div style="height: 100rpx;" v-if="expenseList.length == 0">
						<div style=" margin-top: 40rpx; text-align: center;">
							<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"
								style="margin-right: 5rpx;"></uni-icons>
							<div style="margin-top: 10px; color: #969696;font-weight: bold;">未添加费用</div> <!-- 添加的文字 -->
						</div>
					</div>
				</div>
			</scroll-view>

			<div style="position: fixed;bottom: 0;height: 30rpx;background: #e5e5e5;width: 100%;" v-if="!showKeyBoard1">
				<div v-if="settingMoney!=undefined&&batchCommodityTotal.totalMoney!=undefined&&batchCommodityTotal.assistAmount!=undefined&&totalSettle!=undefined" 
					style="height: 1rpx;width: 100%;background-color: #909090;line-height: 30rpx;font-weight: bold;font-size: 12rpx;">
					<div style="margin-left: 10rpx;"> 结算金额：{{ settingMoney.toFixed(1) }}元(营销总额{{batchCommodityTotal.totalMoney.toFixed(1)
						}}-代卖费用{{ batchCommodityTotal.assistAmount.toFixed(1) }}-其他费用{{totalSettle.toFixed(1) }})</div>
				</div>
				<button
					style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
					@click="settle">结算</button>
			</div>
		</div>
		<!-- 美化的新增费用弹窗 -->
		<div class="expense-add-modal-container" v-if="expenseAddedShow">
			<div class="expense-add-modal-overlay" @click="closeExpenseModal"></div>
			<div class="expense-add-modal">
				<div class="expense-add-modal-header">

					<h3>新增费用</h3>
					<div class="close-btn" @click="closeExpenseModal">
						<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="20" color="white"></uni-icons>
					</div>
				</div>
				
				<div class="expense-add-modal-body">
					<!-- 金额输入 -->
					<div class="input-section">
						<label class="input-label">
							<uni-icons custom-prefix="iconfont" type="icon-yen" size="16" color="#666" style="margin-right: 8rpx;"></uni-icons>
							费用金额
						</label>
						<div class="amount-input-wrapper">
							<u--input 
								placeholder="请输入金额" 
								border="surround" 
								v-model="expenseAdded.money"
								clearable
								type="number"
								class="amount-input"
							></u--input>
							<span class="currency-unit">元</span>
						</div>
					</div>

					<!-- 费用项选择 -->
					<div class="input-section">
						<view class="input-label">
							<uni-icons custom-prefix="iconfont" type="icon-biaoqian" size="16" color="#666" style="margin-right: 8rpx;"></uni-icons>
							费用项
							<view style="margin-left: auto; display: flex; align-items: center; gap: 15rpx;">
								<uni-icons 
									type="plus" 
									size="30" 
									color="#667eea" 
									@click="showAddExpenseLabel" 
									style="cursor: pointer;"
								></uni-icons>
								<uni-icons 
									:type="isEditingLabels ? 'checkmarkempty' : 'compose'" 
									size="30" 
									:color="isEditingLabels ? '#52c41a' : '#667eea'" 
									@click="toggleEditMode" 
									style="cursor: pointer;"
								></uni-icons>
							</view>
						</view>
						<div class="expense-labels-container">
							<div v-if="expenseLabels.length === 0" class="no-labels-tip">
								<uni-icons type="info-circle" size="14" color="#999" style="margin-right: 5rpx;"></uni-icons>
								暂无费用标签，请点击 + 添加
							</div>
							<button 
								v-for="(label, index) in expenseLabels" 
								:key="label.id"
								:class="['expense-label-btn', { 'active': expenseAdded.labelId === label.id, 'editing': isEditingLabels }]"
								@click="selectExpenseLabel(label)"
							>
								{{ label.label }}
								<span 
									v-if="isEditingLabels && expenseLabels.length > 1"
									@click.stop="deleteExpenseLabel(label, index)" 
									class="delete-label-btn"
								>×</span>
							</button>
						</div>
					</div>

					<!-- 备注输入 -->
					<div class="input-section">
						<label class="input-label">
							<uni-icons custom-prefix="iconfont" type="icon-beizhu" size="16" color="#666" style="margin-right: 8rpx;"></uni-icons>
							备注说明
						</label>
						<u--textarea 
							v-model="expenseAdded.remark" 
							placeholder="请输入备注信息（可选）" 
							class="remark-textarea"
							:maxlength="200"
							:showWordLimit="true"
						></u--textarea>
					</div>
				</div>

				<!-- 操作按钮 -->
				<div class="expense-add-modal-footer">
					<button class="btn-cancel" @click="closeExpenseModal">
						<uni-icons type="close" size="16" color="#666" style="margin-right: 5rpx;"></uni-icons>
						取消
					</button>
					<button class="btn-confirm" @click="AddExpense">
						<uni-icons type="checkmarkempty" size="16" color="white" style="margin-right: 5rpx;"></uni-icons>
						添加费用
					</button>
				</div>
			</div>
		</div>

		<!-- 新增费用标签弹窗 -->
		<u-modal title="新增费用标签" :show="expenseLabelAddShow" @close="expenseLabelAddShow = false" :closeOnClickOverlay="false"
			:showConfirmButton="false" width="250rpx">
			<div style="display: flex;flex-direction: column;width: 180rpx;background: #ffffff;">
				<div style="display: flex;">
					<u--input placeholder="请输入标签名称" border="surround" style="width: 180rpx;" v-model="newExpenseLabel.label"
						clearable></u--input>
				</div>
				<div style="display: flex;margin-top: 20rpx;">
					<button
						style="width: 70rpx;height: 30rpx;line-height: 30rpx;font-weight: bold;background-color: #909090;color: #ffffff;"
						@click="expenseLabelAddShow = false"> 取消</button>
					<button
						style="width: 70rpx;height: 30rpx;line-height: 30rpx;font-weight: bold;background-color: dodgerblue;color: #ffffff;"
						@click="addExpenseLabel"> 添加</button>
				</div>
			</div>
		</u-modal>

			<div class="expense-modal-container" v-if="assistAmountShow">
				<div class="card expense-card" >
					<div class="card-header">
						<div class="header-content">
							<h3>代卖费设置</h3>
						</div>
						<div class="modal-close-btn" @click="handleModalClose">
							<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="red"></uni-icons>
						</div>
					</div>
					
					<div class="card-body">
						<div class="modal-content" v-if="batchAssist && typeof batchAssist === 'object'">
							<!-- 费用类型选择 -->
							<div class="section">
								<div class="section-title">
									<i class="fas fa-list"></i>
									<span>费用类型</span>
								</div>
								<div class="fee-buttons-container">
									<button 
										type="button"
										class="fee-button"
										:class="{ 'active': batchAssist.assistType === '0' }"
										@click="selectAssistType('0')"
									>
										<span>按批次</span>
									</button>
									
									<button 
										type="button"
										class="fee-button"
										:class="{ 'active': batchAssist.assistType === '1' }"
										@click="selectAssistType('1')"
									>
										<span>按数量</span>
									</button>
									
									<button 
										type="button"
										class="fee-button"
										:class="{ 'active': batchAssist.assistType === '2' }"
										@click="selectAssistType('2')"
									>
										<span>按重量</span>
									</button>
								</div>
							</div>

							<!-- 金额设置 -->
							<div class="section" v-if="batchAssist.assistType">
								<div class="section-title">
									<i class="fas fa-yen-sign"></i>
									<span>{{ getAmountTitle() }}</span>
								</div>
								
								<div class="amount-setting-container">
									<!-- 快捷金额按钮 -->
									<!-- <div class="quick-amounts">
										<button 
											type="button"
											class="quick-amount-btn"
											:class="{ 'active': isQuickAmountActive(amount) }"
											v-for="amount in getQuickAmounts()"
											:key="amount"
											@click="setQuickAmount(amount)"
										>
											{{ amount }}元
										</button>
									</div> -->
									
									<!-- 自定义金额输入 -->
									<div class="custom-amount-input">

										<u--input v-if="batchAssist.assistType === '0'" placeholder="请输入金额" border="surround" style="width: 200rpx;" v-model="batchAssist.assistAmount"
											clearable></u--input>
											<u--input v-if="batchAssist.assistType != '0'" placeholder="请输入金额" border="surround" style="width: 200rpx;" v-model="batchAssist.assistUnitPrice"
											clearable></u--input>
									</div>
								</div>
							</div>

							<!-- 操作按钮 -->
							<div class="buttons">
								<button 
									class="btn-cancel" 
									@click="handleModalClose"
									type="button"
								>
									<!-- <i class="fas fa-arrow-left"></i> -->
									取消
								</button>
								<button 
									class="btn-confirm" 
									@click="handleConfirmAssist" 
									:disabled="!isFormValid"
									type="button"
								>
									<!-- <i class="fas fa-check"></i> -->
									确认添加
								</button>
							</div>
						</div>
						
						<!-- 加载状态 -->
						<div v-else class="loading-container">
							<div class="loading-spinner">
								<i class="fas fa-spinner fa-spin"></i>
							</div>
							<p>加载中...</p>
						</div>
					</div>
				</div>
			</div>

		  <!-- 结算弹窗组件 -->
		  <SettlementModal
      :visible="showSettlementModal"
      :customerInfo="customerData"
      :initialData="initialSettlementData"
      @close="showSettlementModal = false"
      @confirm="handleSettlementConfirm"
    />
	</div>
</template>

<script>
import category from '../../api/goods/category'
import expense from '../../api/expense/expense'
import batch from '../../api/batch/batch';
import labelApi from '../../api/label/labelApi';
import DropdownOperater from './component/DropdownOperater.vue';
import SettlementModal from '../../components/SettlementModal.vue'; 
export default {
	components: {
		DropdownOperater,
		SettlementModal
	},
	computed: {
		// 表单验证
		isFormValid() {
			console.log("this.batchAssist",this.batchAssist);
			if (!this.batchAssist || !this.batchAssist.assistType) {
				return false;
			}
			console.log("this.batchAssist1",this.batchAssist);
			const assistType = this.batchAssist.assistType;
			
			if (assistType === "0") {
				return this.isValidAmount(this.batchAssist.assistAmount);
			} else if (assistType === "1" || assistType === "2") {
				return this.isValidAmount(this.batchAssist.assistUnitPrice);
			}
			console.log("this.batchAssist2",this.batchAssist);
			return false;
		},
		
		// 是否显示单位金额输入
		showUnitPriceInput() {
			return this.batchAssist && 
				   this.batchAssist.assistType && 
				   (this.batchAssist.assistType === '1' || this.batchAssist.assistType === '2');
		},
		
		// 是否显示总金额输入
		showTotalAmountInput() {
			return this.batchAssist && 
				   this.batchAssist.assistType && 
				   this.batchAssist.assistType === '0';
		}
	},
	data() {
		return {
			assistAmountShow: false,
			batchAssist: {
				id: this.batchCommodityTotal?.id ?? "",
				assistType: '0',  // 默认选择"按批次"，使用字符串
				assistUnitPrice: 0,
				assistAmount: 0
			},
			expenseAddedShow: false,
			expenseAdded: {},
			expenseLabels: [],
			expenseLabelAddShow: false,
			newExpenseLabel: { label: '' },
			isEditingLabels: false,
			companyId: "",
			shipperAddedName: "",
			shipperList: [],
			batshNewCode: "",
			expenseList: [],
			copyLastBatch: false,
			selectBatch: null,
			batchCommodityTotal: {},
			batchList: [],
			batchShowList: [],
			BatchCommodityList: [],
			settingMoney: 0,
			totalSettle: 0,
			WindowHeight: 0,
			scrollHeight: 0,
			batchCalcType: 1,
			showSettlementModal: false,
			customerData: {},
			initialSettlementData: {},
			tabList: [{
				name: '在售',
				value: 1
			}, {
				name: '售罄',
				value: 0
			}, {
				name: '结算中',
				value: 2
			},
			// {
			// 	name: '已结清',
			// 	value: 2
			// },
			],
			operatorBtnoptions: [{
				text: "按数量",
				value: 1
			}, {
				text: "按重量",
				value: 2
			}]
		}
	},
	mounted() {
		this.companyId = uni.getStorageSync('companyId');
		this.getallShipper();
		this.getAllBatch();
		this.getExpenseLabel();
		this.WindowHeight = uni.getWindowInfo().windowHeight;
		this.scrollHeight = this.WindowHeight - 80;
	},
	methods: {
		operabtnChange(e) {
			console.log("e", e)
		},
		settingRecount() {
			this.totalSettle = 0;
			for (var i = 0; i < this.expenseList.length; i++) {
				this.totalSettle += this.expenseList[i].expensesMoney;
			}
			this.settingMoney = this.batchCommodityTotal.totalMoney - this.totalSettle - this.batchCommodityTotal.assistAmount;
		},
		deleteExpense(index) {
			this.expenseList.splice(index, 1);
			this.settingRecount();
		},
		changeType(item) {
			this.batchShowList = []
			this.batchShowList = this.batchList.filter(batch => {
				return batch.saleStatus === item.value
			})
			this.BatchCommodityList = [];
			this.expenseList = [];
			this.selectBatch = null;
			if (this.batchShowList?.length > 0) {
				this.exchangeBatch(this.batchShowList[0])
			}
		},
		settle() {
			if (!this.selectBatch) return;
			let that = this;
			this.showSettlementModal = true;
			// expense.deleteByBatchId(this.selectBatch.id).then(res => {
			// 	expense.createListExpense(that.expenseList).then(res2 => {
			// 		if (res2.code === 200) {
			// 			that.setSaleStatus(2);
			// 			uni.showToast({
			// 				title: "结算成功",
			// 				icon: "success"
			// 			})
			// 		} else {
			// 			uni.showToast({
			// 				title: "结算失败",
			// 				icon: "error"
			// 			})
			// 		}
			// 	})

			// })
		},
		getExpenseByBatchId(batchId) {
			expense.getAllExpenseByBatchId(batchId).then(res => {
				this.expenseList = res.data;
			})
		},
		padZero(num) {
			return num.toString().padStart(2, '0');
		},
		AddExpense() {
			if (!this.expenseAdded.labelId || !this.expenseAdded.money) {
				uni.showToast({
					title: "请选择费用项并输入金额",
					icon: "none"
				});
				return;
			}
			
			var newExpense = JSON.parse(JSON.stringify(this.expenseAdded))
			const now = new Date();
			const utc = now.getTime() + (now.getTimezoneOffset() * 60000);

			// 上海时区偏移（毫秒）
			const offset = 8 * 60 * 60 * 1000;

			// 上海时间的 Date 对象
			const shanghaiTime = new Date(utc + offset);
			const year = shanghaiTime.getFullYear();
			const month = this.padZero(shanghaiTime.getMonth() + 1); // 月份从0开始
			const day = this.padZero(shanghaiTime.getDate());
			const hour = this.padZero(shanghaiTime.getHours());
			const minute = this.padZero(shanghaiTime.getMinutes());
			const second = this.padZero(shanghaiTime.getSeconds());

			const iso8601Time = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

			this.expenseList.push({
				id: "",
				BatchId: this.selectBatch.id,
				createTime: iso8601Time,
				expensesMoney: parseFloat(newExpense.money),
				remark: newExpense.remark || "",
				expensesStatus: 1,
				expensesLabel: newExpense.label,
				labelId: newExpense.labelId
			})
			this.closeExpenseModal();
			this.settingRecount();
		},
		showAddexpenses() {
			if (!this.selectBatch) return;
			this.expenseAddedShow = true;
			// 重置编辑模式状态
			this.isEditingLabels = false;
			this.expenseAdded = {
				money: 0,
				remark: "",
				labelId: this.expenseLabels.length > 0 ? this.expenseLabels[0].id : null,
				label: this.expenseLabels.length > 0 ? this.expenseLabels[0].label : ""
			};
		},
		// 选择费用标签
		selectExpenseLabel(label) {
			this.expenseAdded.labelId = label.id;
			this.expenseAdded.label = label.label;
		},
		// 关闭费用弹窗
		closeExpenseModal() {
			this.expenseAddedShow = false;
			// 重置编辑模式状态
			this.isEditingLabels = false;
		},
		// 切换编辑模式
		toggleEditMode() {
			this.isEditingLabels = !this.isEditingLabels;
			if (this.isEditingLabels) {
				uni.showToast({
					title: "编辑模式已开启",
					icon: "none",
					duration: 1500
				});
			} else {
				uni.showToast({
					title: "编辑模式已关闭",
					icon: "success",
					duration: 1500
				});
			}
		},
		// 显示新增费用标签弹窗
		showAddExpenseLabel() {
			this.expenseLabelAddShow = true;
			this.newExpenseLabel = { label: '' };
		},
		// 添加费用标签
		addExpenseLabel() {
			if (!this.newExpenseLabel.label.trim()) {
				uni.showToast({
					title: "请输入标签名称",
					icon: "none"
				});
				return;
			}
			var userInfo = uni.getStorageSync("userInfo");
			const labelData = {
				companyId: this.companyId,
				label: this.newExpenseLabel.label.trim(),
				labelType: 1,
				operatorId: userInfo.id
			};
			
			labelApi.createExpenseLabel(labelData).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: "添加成功",
						icon: "success"
					});
					this.expenseLabelAddShow = false;
					this.getExpenseLabel(); // 重新获取标签列表
				} else {
					uni.showToast({
						title: res.message || "添加失败",
						icon: "none"
					});
				}
			}).catch(error => {
				uni.showToast({
					title: "网络错误",
					icon: "none"
				});
			});
		},
		// 删除费用标签
		deleteExpenseLabel(label, index) {
			console.log("label", label)
			uni.showModal({
				title: '确认删除',
				content: `确定要删除费用标签"${label.label}"吗？`,
				success: (res) => {
					if (res.confirm) {
						labelApi.deleteExpenseLabel(label.id).then(response => {
							if (response.code === 200) {
								uni.showToast({
									title: "删除成功",
									icon: "success"
								});
								this.getExpenseLabel(); // 重新获取标签列表
								
								// 如果当前选中的标签被删除，重置选择
								if (this.expenseAdded.labelId === label.id && this.expenseLabels.length > 1) {
									const remainingLabels = this.expenseLabels.filter(l => l.id !== label.id);
									if (remainingLabels.length > 0) {
										this.selectExpenseLabel(remainingLabels[0]);
									}
								}
							} else {
								uni.showToast({
									title: response.message || "删除失败",
									icon: "none"
								});
							}
						}).catch(error => {
							uni.showToast({
								title: "网络错误",
								icon: "none"
							});
						});
					}
				}
			});
		},
		
		// 验证金额是否有效
		isValidAmount(amount) {
			if (amount === null || amount === undefined || amount === '') {
				return false;
			}
			const num = parseFloat(amount);
			return !isNaN(num) && num > 0;
		},
		
		// 处理模态框关闭
		handleModalClose() {
			this.assistAmountShow = false;
			this.resetFormData();
		},
		
		// 重置表单数据
		resetFormData() {
			if (this.batchAssist) {
				this.batchAssist.assistType = '0';  // 重置为默认的"按批次"
				this.batchAssist.assistUnitPrice = 0;
				this.batchAssist.assistAmount = 0;
			}
		},
		
		// 处理费用类型变化
		handleTypeChange() {
			// 当费用类型改变时，清空对应的金额字段
			if (this.batchAssist) {
				this.batchAssist.assistUnitPrice = 0;
				this.batchAssist.assistAmount = 0;
			}
		},
		
		// 选择费用类型
		selectAssistType(type) {
			if (this.batchAssist) {
				this.batchAssist.assistType = type;
				// 不清空金额字段，让用户可以继续使用之前的输入
			}
		},
		
		// 获取金额标题
		getAmountTitle() {
			if (!this.batchAssist.assistType) return '金额设置';
			
			const titles = {
				'0': '总金额',
				'1': '单位金额',
				'2': '单位金额'
			};
			return titles[this.batchAssist.assistType] || '金额设置';
		},
		
		// 获取金额占位符
		getAmountPlaceholder() {
			if (!this.batchAssist.assistType) return '请先选择费用类型';
			
			const placeholders = {
				'0': '请输入总金额',
				'1': '请输入每个商品的费用',
				'2': '请输入每公斤的费用'
			};
			return placeholders[this.batchAssist.assistType] || '请输入金额';
		},
		
		// 获取快捷金额选项
		getQuickAmounts() {
			if (!this.batchAssist.assistType) return [];
			
			const amounts = {
				'0': [10, 20, 50, 100, 200, 500], // 按批次的常用总金额
				'1': [0.5, 1, 2, 5, 10, 20],      // 按数量的常用单价
				'2': [2, 5, 10, 15, 20, 30]       // 按重量的常用单价
			};
			return amounts[this.batchAssist.assistType] || [];
		},
		
		// 获取当前金额
		getCurrentAmount() {
			if (!this.batchAssist.assistType) return '';
			
			if (this.batchAssist.assistType === '0') {
				return this.batchAssist.assistAmount || '';
			} else {
				return this.batchAssist.assistUnitPrice || '';
			}
		},
		
		// 更新当前金额
		updateCurrentAmount(event) {
			const value = parseFloat(event.target.value) || 0;
			
			if (this.batchAssist.assistType === '0') {
				this.batchAssist.assistAmount = value;
				this.batchAssist.assistUnitPrice = 0;
			} else {
				this.batchAssist.assistUnitPrice = value;
				this.batchAssist.assistAmount = 0;
			}
		},
		
		// 设置快捷金额
		setQuickAmount(amount) {
			if (this.batchAssist.assistType === '0') {
				this.batchAssist.assistAmount = amount;
				this.batchAssist.assistUnitPrice = 0;
			} else {
				this.batchAssist.assistUnitPrice = amount;
				this.batchAssist.assistAmount = 0;
			}
		},
		
		// 检查快捷金额是否激活
		isQuickAmountActive(amount) {
			const currentAmount = this.getCurrentAmount();
			return parseFloat(currentAmount) === amount;
		},
		
		// 验证输入
		validateInput(event) {
			const value = event.target.value;
			// 确保输入的是有效数字
			if (value && isNaN(parseFloat(value))) {
				event.target.value = '';
				this.$nextTick(() => {
					// 触发响应式更新
					if (event.target.name === 'assistUnitPrice') {
						this.batchAssist.assistUnitPrice = 0;
					} else if (event.target.name === 'assistAmount') {
						this.batchAssist.assistAmount = 0;
					}
				});
			}
		},
		
		// 格式化输入
		formatInput(event) {
			const value = parseFloat(event.target.value);
			if (!isNaN(value) && value >= 0) {
				event.target.value = value.toFixed(2);
			}
		},
		
		// 处理确认添加
		handleConfirmAssist() {
			if (!this.isFormValid) {
				uni.showToast({
					title: "请填写完整信息",
					icon: "none"
				});
				return;
			}
			this.UpdateBatchAssist();
		},
		
		UpdateBatchAssist() {
			try {
				console.log("this.batchAssist",this.batchAssist);
				// 数据验证
				if (!this.batchAssist || !this.selectBatch) {
					uni.showToast({
						title: "数据异常，请重试",
						icon: "none"
					});
					return;
				}
				console.log("进入1");
				// 深拷贝数据
				const newBatch = {
					...this.batchAssist,
					id: this.selectBatch.id,
					batchCode: this.selectBatch.batchCode,
					companyId: this.selectBatch.companyId,
					shipperId: this.selectBatch.shipperId
				};
				
				// 类型转换和验证
				const assistType = parseInt(newBatch.assistType);
				if (isNaN(assistType) || assistType < 0 || assistType > 2) {
					uni.showToast({
						title: "费用类型无效",
						icon: "none"
					});
					return;
				}
				console.log("进入2");
				
				newBatch.assistType = assistType;
				
				// 根据费用类型设置金额
				if (assistType === 0) {
					// 按批次
					newBatch.assistAmount = this.parseAmount(this.batchAssist.assistAmount);
					newBatch.assistUnitPrice = 0;
					
					if (newBatch.assistAmount <= 0) {
						uni.showToast({
							title: "请输入有效的总金额",
							icon: "none"
						});
						return;
					}
				} else {
					// 按数量或重量
					newBatch.assistUnitPrice = this.parseAmount(this.batchAssist.assistUnitPrice);
					newBatch.assistAmount = 0;
					
					if (newBatch.assistUnitPrice <= 0) {
						uni.showToast({
							title: "请输入有效的单位金额",
							icon: "none"
						});
						return;
					}
				}
				
				// 显示加载状态
				uni.showLoading({
					title: "处理中..."
				});
				
				console.log("提交的费用数据:", newBatch);
				
				batch.UpdateBatchAssist(newBatch).then(res => {
					uni.hideLoading();
					
					if (res && res.code === 200) {
						uni.showToast({
							title: "添加成功",
							icon: "success"
						});
						
						// 关闭弹窗并刷新数据
						this.handleModalClose();
						this.getBatchCommodityList(this.selectBatch.id);
					} else {
						uni.showToast({
							title: res?.message || "添加失败",
							icon: "none"
						});
					}
				}).catch(error => {
					uni.hideLoading();
					console.error("添加费用失败:", error);
					uni.showToast({
						title: "网络错误，请重试",
						icon: "none"
					});
				});
				
			} catch (error) {
				console.error("UpdateBatchAssist 错误:", error);
				uni.showToast({
					title: "操作失败，请重试",
					icon: "none"
				});
			}
		},
		getExpenseLabel(){
			labelApi.GetExpenseLabel(this.companyId,1).then(res=>{
				console.log("GetExpenseLabel",res)
				if(res.code === 200){
					this.expenseLabels = res.data || [];
				}
			})
		},
		// 安全解析金额
		parseAmount(amount) {
			if (amount === null || amount === undefined || amount === '') {
				return 0;
			}
			const num = parseFloat(amount);
			return isNaN(num) ? 0 : Math.max(0, num);
		},
		showSetBatchAssist() {
			if (!this.selectBatch) return;
			this.assistAmountShow = true;
			this.batchAssist = {
				id: this.selectBatch.id,
				assistType: String(this.batchCommodityTotal.assistType || '0'), // 转换为字符串
				assistUnitPrice: this.batchCommodityTotal.assistUnitPrice,
				assistAmount: this.batchCommodityTotal.assistAmount
			};
		},
		exchangeBatch(item) {
			this.selectBatch = item;
			this.getBatchCommodityList(item.id);
			this.getExpenseByBatchId(item.id);
		},
		getBatchCommodityList(id) {
			batch.GetSingleAssistBatchInfoAndProfit(id).then(res => {
				this.batchCommodityTotal = {
					assistType: res.data.assistType,
					assistAmount: res.data.assistAmount,
					assistUnitPrice: res.data.assistUnitPrice,
					totalMount: 0,
					totalWeight: 0,
					totalMoney: res.data.saleSubTotal,
					totalInventory: 0
				}
				this.BatchCommodityList = res.data.allPurchaseAssistList;
				console.log("this.BatchCommodityList",this.BatchCommodityList);
				this.BatchCommodityList.sort((a, b) => b.inventorySold - a.inventorySold);
				if (this.BatchCommodityList.length > 0) {
					for (var i = 0; i < this.BatchCommodityList.length; i++) {
						this.batchCommodityTotal.totalWeight += this.BatchCommodityList[i].saleWeight;
						//计算库存
						for (var k = 0; k < this.BatchCommodityList[i].outPutPurchaseInventories?.length; k++) {
							let element = this.BatchCommodityList[i].outPutPurchaseInventories[k];
							this.batchCommodityTotal.totalInventory += element.mount
						}
						//计算售量
						for (var k = 0; k < this.BatchCommodityList[i].outPutSaleMount?.length; k++) {
							let element = this.BatchCommodityList[i].outPutSaleMount[k];
							this.batchCommodityTotal.totalMount += element.mount
						}
					}
				}
				this.settingRecount();
			})
		},
		setSaleStatus(info) {
			var newBatch = JSON.parse(JSON.stringify(this.selectBatch))
			newBatch.saleStatus = info;
			category.UpdateBatchStatus(newBatch)
		},
		getallShipper() {
			category.GetAllShipper(this.companyId).then(res => {
				this.shipperList = res.data;
				if (this.shipperList.length > 0) {
					this.shipperSelectedId = this.shipperList[0].id;

					this.getBatchNewCodeByShipperId();
				}
			})
		},
		getAllBatch() {
			category.GetAllBatch(this.companyId).then(res => {
				this.batchList = res.data;
				this.batchList = this.batchList.sort((a, b) =>
					new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
				);
				this.batchShowList = this.batchList.filter(x => x.saleStatus === 1);
				if (this.batchShowList.length > 0) {
					this.selectBatch = this.batchShowList[0];
					this.getExpenseByBatchId(this.selectBatch.id);
					this.getBatchCommodityList(this.selectBatch.id);
				}
			})
		},
		shipperSelect(e) {
			this.shipperSelectedId = e;
			this.getBatchNewCodeByShipperId();
		},
		getBatchNewCodeByShipperId() {
			category.GetNewBatchCode(this.companyId, this.shipperSelectedId).then(res => {
				this.batshNewCode = res.data
			})
		}
	}

}
</script>

<style>
.expenseBtn {
	height: 20rpx;
	font-weight: bold;
	font-size: 12rpx;
	line-height: 20rpx;
	border: solid 1px #7a7a7a;
	background-color: white;
	color: #7a7a7a;
	border-radius: 10rpx;
	padding: 0 8rpx;
	margin: 2rpx;
	transition: all 0.3s ease;
}

.expenseBtn:hover {
	border-color: dodgerblue;
	color: dodgerblue;
}

.expenseBtnActive {
	background-color: dodgerblue;
	color: white;
	border: solid 1px dodgerblue;
}

.containerAddBatch {
	display: flex;
	width: 100%;
	height: 80%;
}

.leftAddBatch {
	flex: 1;
	/* 左边占一半 */
	background-color: #f0f0f0;
	padding: 20px;
	box-sizing: border-box;
	border-radius: 5rpx;
}

.rightAddBatch {
	flex: 1;
	/* 右边占一半 */
	background-color: #ffffff;
	box-sizing: border-box;
}

/* 垂直标签栏样式 */
.vertical-tabs {
	width: 150px;
	background-color: #f0f0f0;
	border-right: 1px solid #ccc;
	display: flex;
	flex-direction: column;
}

.vertical-tabs button {
	background-color: inherit;
	border: none;
	outline: none;
	padding: 15px;
	text-align: left;
	cursor: pointer;
	transition: background-color 0.3s;
	font-size: 16px;
}

.vertical-tabs button:hover {
	background-color: #ddd;
}

.vertical-tabs button.active {
	background-color: #2196F3;
	color: white;
}

/* 内容区域 */
.tab-content {
	flex-grow: 1;
	padding: 20px;
}

h2 {
	border-bottom: 1px solid gray;
	/* 默认无下划线 */
	padding: 5rpx;
	border-radius: 5rpx;
}

h2.selected {
	border-bottom: 2px solid gray;
	/* 下划线为蓝色 */
	background-color: #cacaca;
	/* 蓝色背景框，可以根据需求调整 */
	padding: 5rpx;
	border-radius: 5rpx;
}

.cards {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
}

@media (max-width: 768px) {
	.cards {
		grid-template-columns: 1fr;
	}
}

.card {
	background: white;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
	padding: 20px;
	background: #3498db;
	color: white;
	display: flex;
	align-items: center;
	gap: 15px;
}

.card-header i {
	font-size: 1.8rem;
}

.card-header h2 {
	font-size: 1.5rem;
	font-weight: 600;
}

.card-body {
	padding: 25px;
}

.card-1 .card-header {
	background: linear-gradient(135deg, #3498db 0%, #1a5276 100%);
}

.card-2 .card-header {
	background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.modal-content {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 10px 0;
}

.section {
	margin-bottom: 20px;
}

.section-title {
	font-weight: bold;
	color: #2c3e50;
	margin-bottom: 8px;
	font-size: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.input-group {
	position: relative;
	margin-bottom: 15px;
}

select,
input {
	width: 100%;
	padding: 12px 15px;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	font-size: 16px;
	transition: all 0.3s ease;
	background: #f8f9fa;
}

select:focus,
input:focus {
	outline: none;
	border-color: #3498db;
	box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
	background: white;
}

.unit {
	position: absolute;
	right: 15px;
	top: 50%;
	transform: translateY(-50%);
	color: #7f8c8d;
	font-weight: bold;
	font-size: 14px;
}

.input-with-label {
	display: flex;
	align-items: center;
	background: #f8f9fa;
	border-radius: 10px;
	padding: 0 15px;
	border: 1px solid #e0e0e0;
}

.input-with-label span {
	color: #7f8c8d;
	font-size: 14px;
	min-width: 80px;
}

.input-with-label input {
	border: none;
	background: transparent;
	padding: 12px 0;
}

.input-with-label input:focus {
	box-shadow: none;
}

.buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 25px;
	gap: 15px;
}

button {
	flex: 1;
	padding: 12px;
	border: none;
	border-radius: 10px;
	font-weight: bold;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

.btn-cancel {
	flex: 1;
	background: #f1f2f6;
	color: #7f8c8d;
}

.btn-cancel:hover {
	background: #e0e0e0;
}

.btn-confirm {
	flex: 1;
	background: linear-gradient(135deg, #3498db 0%, #1a5276 100%);
	color: white;
}

.btn-confirm:hover {
	background: linear-gradient(135deg, #2980b9 0%, #154360 100%);
	box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

/* 新增费用弹窗样式优化 */
.expense-modal-container {
	top: 20%;
	left: 20%;
	position: absolute;
	padding: 0;
	width: 480rpx;
}

.expense-card {
	margin: 5px;
	border-radius: 16px;
	overflow: hidden;
	box-shadow:  0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.expense-card .card-header {
	background: linear-gradient(135deg, #2198cf 0%, #2198cf 100%);
	position: relative;
	
	
	.header-content {
		display: flex;
		align-items: center;
		gap: 12px;
		
		i {
			font-size: 1.5rem;
		}
		
		h2 {
			margin: 0;
			font-size: 1.3rem;
			font-weight: 600;
		}
	}
	
	.modal-close-btn {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 30px;
		height: 30px;
		background: rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		
		&:hover {
			background: rgba(255, 255, 255, 0.3);
			transform: scale(1.1);
		}
		
		i {
			color: white;
			font-size: 14px;
		}
	}
}

.expense-card .card-body {
	padding: 20px;
}

/* 按钮式费用类型选择 */
.fee-buttons-container {
	display: flex;
	gap: 10px;
	margin-top: 8px;
	flex-wrap: wrap;
}

.fee-button {
	flex: 1;
	min-width: 100px;
	padding: 14px 16px;
	border: 2px solid #e9ecef;
	border-radius: 10px;
	background: white;
	color: #7f8c8d;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	outline: none;
	
	&:hover {
		border-color: #e74c3c;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(231, 76, 60, 0.15);
	}
	
	&.active {
		border-color: #e74c3c;
		background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
		color: white;
		box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
		transform: translateY(-3px);
		
		i {
			transform: scale(1.1);
		}
	}
	
	&:active {
		transform: translateY(-1px);
	}
	
	i {
		font-size: 18px;
		transition: all 0.3s ease;
	}
	
	span {
		font-size: 13px;
		line-height: 1;
	}
}

/* 金额设置容器 */
.amount-setting-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-top: 8px;
}

/* 快捷金额按钮 */
.quick-amounts {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.quick-amount-btn {
	padding: 8px 16px;
	border: 1px solid #ddd;
	border-radius: 20px;
	background: white;
	color: #666;
	font-size: 13px;
	cursor: pointer;
	transition: all 0.3s ease;
	outline: none;
	
	&:hover {
		border-color: #e74c3c;
		color: #e74c3c;
		transform: scale(1.05);
	}
	
	&.active {
		border-color: #e74c3c;
		background: #e74c3c;
		color: white;
		box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
	}
}

/* 自定义金额输入 */
.custom-amount-input {
	.input-with-icon {
		position: relative;
		
		.input-icon {
			position: absolute;
			left: 15px;
			top: 50%;
			transform: translateY(-50%);
			color: #7f8c8d;
			font-size: 14px;
			z-index: 2;
		}
		
		.expense-input {
			width: 100%;
			padding: 14px 60px 14px 45px;
			border: 2px solid #e9ecef;
			border-radius: 10px;
			background: white;
			font-size: 16px;
			color: #2c3e50;
			transition: all 0.3s ease;
			
			&:focus {
				outline: none;
				border-color: #e74c3c;
				box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
			}
			
			&:hover {
				border-color: #dc3545;
			}
			
			&::placeholder {
				color: #bdc3c7;
				font-size: 14px;
			}
		}
		
		.currency-suffix {
			position: absolute;
			right: 15px;
			top: 50%;
			transform: translateY(-50%);
			color: #7f8c8d;
			font-size: 14px;
			font-weight: 500;
		}
	}
}

/* 响应式适配 */
@media (max-width: 480px) {
	.fee-buttons-container {
		flex-direction: column;
	}
	
	.fee-button {
		flex-direction: row;
		justify-content: center;
		min-width: auto;
		padding: 12px 20px;
		
		i {
			font-size: 16px;
		}
		
		span {
			font-size: 14px;
		}
	}
	
	.quick-amounts {
		justify-content: center;
	}
	
	.quick-amount-btn {
		min-width: 60px;
		text-align: center;
	}
	
	/* 移动端按钮仍保持一行显示 */
	.buttons {
		flex-direction: row !important;
		gap: 12px;
	}
	
	.btn-cancel,
	.btn-confirm {
		width: auto;
		flex: 1;
		min-width: 0;
		padding: 12px 16px;
		font-size: 14px;
	}
}

/* 输入框样式 */
.input-with-icon {
	position: relative;
	display: flex;
	align-items: center;
	
	.input-icon {
		position: absolute;
		left: 15px;
		color: #7f8c8d;
		font-size: 14px;
		z-index: 2;
	}
	
	.expense-input {
		width: 100%;
		padding: 12px 60px 12px 45px;
		border: 2px solid #e9ecef;
		border-radius: 8px;
		background: white;
		font-size: 14px;
		color: #2c3e50;
		transition: all 0.3s ease;
		
		&:focus {
			outline: none;
			border-color: #e74c3c;
			box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
		}
		
		&:hover {
			border-color: #dc3545;
		}
		
		&::placeholder {
			color: #bdc3c7;
		}
		
		/* 移除数字输入框的箭头 */
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		
		&[type=number] {
			appearance: textfield;
			-moz-appearance: textfield;
		}
	}
	
	.currency-suffix {
		position: absolute;
		right: 15px;
		color: #7f8c8d;
		font-size: 14px;
		font-weight: 500;
	}
}

/* 按钮禁用状态 */
.btn-confirm:disabled {
	background: #bdc3c7 !important;
	color: #7f8c8d !important;
	cursor: not-allowed !important;
	transform: none !important;
	box-shadow: none !important;
}

.btn-confirm:disabled:hover {
	background: #bdc3c7 !important;
	transform: none !important;
	box-shadow: none !important;
}

/* 动画效果 */
.expense-card {
	animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
	from {
		transform: translateY(30px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* 加载状态样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	text-align: center;
	color: #7f8c8d;
}

.loading-spinner {
	margin-bottom: 15px;
	
	i {
		font-size: 24px;
		color: #e74c3c;
	}
}

.loading-container p {
	margin: 0;
	font-size: 14px;
	color: #95a5a6;
}

/* CSS兼容性增强 */
.expense-select {
	/* 兼容性过渡效果 */
	-webkit-transition: all 0.3s ease;
	-moz-transition: all 0.3s ease;
	-o-transition: all 0.3s ease;
	transition: all 0.3s ease;
}

.expense-input {
	/* 兼容性过渡效果 */
	-webkit-transition: all 0.3s ease;
	-moz-transition: all 0.3s ease;
	-o-transition: all 0.3s ease;
	transition: all 0.3s ease;
}

/* 按钮兼容性 */
.btn-cancel,
.btn-confirm {
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	
	-webkit-tap-highlight-color: transparent;
}


	.expense-card .card-body {
		padding: 15px;
	}
	
	.buttons {
		flex-direction: row;
		gap: 12px;
	}
	
	.btn-cancel,
	.btn-confirm {
		flex: 1;
		min-width: 0;
	}
	
	/* 移动端输入框优化 */
	.expense-input {
		font-size: 16px; /* 防止 iOS Safari 缩放 */
	}

/* 美化的新增费用弹窗样式 */
.expense-add-modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.expense-add-modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(5px);
}

.expense-add-modal {
	position: relative;
	width: 80%;
	max-width: 500px;
	max-height: 80vh;
	background: white;
	border-radius: 20rpx;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
	overflow: hidden;
	animation: modalSlideIn 0.3s ease-out;
	display: flex;
	flex-direction: column;
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: translateY(-50rpx) scale(0.9);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.expense-add-modal-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 25rpx 30rpx;
	position: relative;
	display: flex;
	align-items: center;
	gap: 15rpx;
	flex-shrink: 0;
}

.header-icon {
	width: 40rpx;
	height: 40rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.expense-add-modal-header h3 {
	color: white;
	font-size: 18rpx;
	font-weight: 600;
	margin: 0;
	flex: 1;
}

.close-btn {
	width: 35rpx;
	height: 35rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(1.1);
}

.expense-add-modal-body {
	padding: 30rpx;
	flex: 1;
	overflow-y: auto;
}

.input-section {
	margin-bottom: 25rpx;
}

.input-label {
	display: flex;
	align-items: center;
	font-size: 16rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 12rpx;
}

.add-label-btn {
	margin-left: auto;
	width: 24px !important;
	height: 24px !important;
	min-width: 24px !important;
	min-height: 24px !important;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	padding: 0 !important;
	box-sizing: border-box;
}

.add-label-btn:hover {
	transform: scale(1.1);
	box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.amount-input-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.amount-input {
	flex: 1;
	border-radius: 5rpx !important;
	border: 2rpx solid #e9ecef !important;
	transition: all 0.3s ease;
	height: 40rpx;
		font-size: 30rpx !important;

}

.amount-input:focus {
	border-color: #667eea !important;
	box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1) !important;
}

.currency-unit {
	position: absolute;
	right: 20rpx;
	color: #666;
	font-size: 16rpx;
	font-weight: 600;
	pointer-events: none;
}

.expense-labels-container {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	min-height: 40rpx;
	align-items: flex-start;
}

.no-labels-tip {
	display: flex;
	align-items: center;
	color: #999;
	font-size: 14rpx;
	padding: 15rpx;
	background: #f8f9fa;
	border-radius: 10rpx;
	width: 100%;
	box-sizing: border-box;
}

.expense-label-btn {
	padding: 8rpx 16rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 20rpx;
	background: white;
	color: #666;
	font-size: 14rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	display: flex;
	align-items: center;
	gap: 5rpx;
}

.expense-label-btn:hover {
	border-color: #667eea;
	color: #667eea;
	transform: translateY(-2rpx);
}

.expense-label-btn.active {
	border-color: #667eea;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.3);
}

.expense-label-btn.editing {
	border-color: #ff7875;
	animation: editingPulse 2s infinite;
}

@keyframes editingPulse {
	0%, 100% {
		border-color: #ff7875;
		box-shadow: 0 0 0 0 rgba(255, 120, 117, 0.4);
	}
	50% {
		border-color: #ff4d4f;
		box-shadow: 0 0 0 4px rgba(255, 120, 117, 0.2);
	}
}

.delete-label-btn {
	margin-left: 5rpx;
	width: 20rpx;
	height: 20rpx;
	background: #ff4757;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12rpx;
	line-height: 1;
	cursor: pointer;
	transition: all 0.3s ease;
	color: white;
	font-weight: bold;
	z-index: 99;
	animation: deleteButtonShow 0.3s ease-out;
}

@keyframes deleteButtonShow {
	from {
		opacity: 0;
		transform: scale(0.5);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.delete-label-btn:hover {
	background: #ff3742;
	transform: scale(1.3);
	box-shadow: 0 2rpx 8rpx rgba(255, 71, 87, 0.4);
}

.remark-textarea {
	border-radius: 12rpx !important;
	border: 2rpx solid #e9ecef !important;
	min-height: 80rpx !important;
	transition: all 0.3s ease;
}

.remark-textarea:focus {
	border-color: #667eea !important;
	box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1) !important;
}

.expense-add-modal-footer {
	padding: 25rpx 30rpx;
	background: #f8f9fa;
	display: flex;
	gap: 15rpx;
	border-top: 1rpx solid #e9ecef;
	flex-shrink: 0;
}

.btn-cancel,
.btn-confirm {
	flex: 1;
	height: 45rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 16rpx;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5rpx;
}

.btn-cancel {
	background: white;
	color: #666;
	border: 2rpx solid #e9ecef;
}

.btn-cancel:hover {
	background: #f8f9fa;
	border-color: #dee2e6;
}

.btn-confirm {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
}

.btn-confirm:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

.btn-confirm:active {
	transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.expense-add-modal {
		width: 90%;
		max-width: 350px;
	}
}

@media (max-width: 480px) {
	.expense-add-modal {
		width: 95%;
		max-width: 320px;
	}
	
	.expense-add-modal-header {
		padding: 20rpx 25rpx;
	}
	
	.expense-add-modal-body {
		padding: 25rpx;
	}
	
	.expense-add-modal-footer {
		padding: 20rpx 25rpx;
		flex-direction: row;
	}
	
	.btn-cancel,
	.btn-confirm {
		height: 40rpx;
		font-size: 14rpx;
	}
}

</style>