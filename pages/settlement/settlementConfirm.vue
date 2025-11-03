<template>
	<div :style="{ 'display': 'flex', 'height': WindowHeight + 'px', width: '100%', 'flex-direction': 'column', 'background-color': '#f5f5f5', 'box-sizing': 'border-box', 'overflow': 'hidden' }">
		<!-- 顶部导航栏 -->
		<div style="height: 56px; background: linear-gradient(135deg, #2198cf 0%, #2198cf 100%); display: flex; align-items: center; padding: 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; box-sizing: border-box;">
			<div @click="goBack" style="cursor: pointer; display: flex; align-items: center; color: white; font-weight: bold; font-size: 16px;">
				<uni-icons type="left" color="white" size="24" style="margin-right: 8px;"></uni-icons>
				返回
			</div>
			<div style="flex: 1; text-align: center; color: white; font-size: 18px; font-weight: bold; padding: 0 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
				{{ batchInfo.shipperName }} {{ batchInfo.batchCode }}
			</div>
		</div>

		<div style="flex: 1; display: flex; overflow: hidden; box-sizing: border-box;">
			<!-- 左侧 - 货款结算卡片 -->
			<div style="flex: 1; min-width: 0; padding: 6px; background: #fafafa; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden;">
				<div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow: hidden;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; box-sizing: border-box;">
						<div style="font-size: 17px; font-weight: 600; color: #333;">货款结算</div>
						<div style="display: flex; align-items: center; gap: 6px;">
							<text style="font-size: 14px; color: #999;">截止</text>
							<text style="font-size: 14px; color: #666; font-weight: 500;">{{ currentTime }}</text>
						</div>
					</div>

					<!-- 货品列表 -->
					<div style="border: solid 1px #e8e8e8; border-radius: 6px; overflow: hidden; flex: 1; display: flex; flex-direction: column; box-sizing: border-box; min-height: 0;">
						<!-- 表头 -->
						<div style="display: flex; background-color: #f5f7fa; font-weight: 600; border-bottom: 1px solid #e8e8e8; font-size: 15px; flex-shrink: 0; box-sizing: border-box;">
							<div @click="toggleSelectAll" style="width: 50px; min-width: 50px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; display: flex; align-items: center; justify-content: center; cursor: pointer; box-sizing: border-box;">
								<uni-icons :type="allSelected ? 'checkbox-filled' : 'circle'" :color="allSelected ? '#52c41a' : '#ccc'" size="24"></uni-icons>
							</div>
							<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06); position: relative; z-index: 5; box-sizing: border-box;">货品</div>
							<div style="flex: 2; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">销量</div>
							<div style="flex: 1; min-width: 60px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">均重</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; color: #555; box-sizing: border-box;">结算均价</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; color: #555; box-sizing: border-box;">结算货款</div>
						</div>

						<!-- 表格内容行 - 使用scroll-view -->
						<scroll-view 
							scroll-y="true" 
							:style="{ flex: 1, minHeight: 0, boxSizing: 'border-box' }"
							:show-scrollbar="true"
						>
							<div :style="{ display: 'flex', borderBottom: '1px solid #f0f0f0', background: item.selected ? 'white' : '#fafafa', fontSize: '14px', opacity: item.selected ? 1 : 0.6, boxSizing: 'border-box' }" 
								v-for="(item, index) in commodityList" :key="index">
								<div @click="toggleItemSelect(index)" style="width: 50px; min-width: 50px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; display: flex; align-items: center; justify-content: center; cursor: pointer; box-sizing: border-box;">
									<uni-icons :type="item.selected ? 'checkbox-filled' : 'circle'" :color="item.selected ? '#52c41a' : '#ccc'" size="24"></uni-icons>
								</div>
								<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; font-weight: 500; color: #333; box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05); position: relative; z-index: 5; word-break: break-all; box-sizing: border-box;">
									{{ item.commodityName }}
								</div>
								<div style="flex: 2; min-width: 100px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; word-break: break-all; box-sizing: border-box;">
									<text v-for="model in item.outPutSaleMount">{{ model.mount }}{{ model.specName }}</text>({{ item.saleWeight }})
								</div>
								<div style="flex: 1; min-width: 60px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; box-sizing: border-box;">
									{{ item.averageWeight != null && item.averageWeight != 'NaN' && item.averageWeight != 'Infinity' ? item.averageWeight.toFixed(1) : '--' }}
								</div>
								<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-right: 1px solid #f0f0f0; text-align: center; color: #666; box-sizing: border-box;">
									{{ item.averagePrice != null && item.averagePrice != 'NaN' ? item.averagePrice.toFixed(1) : '0' }}
								</div>
								<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; font-weight: 500; color: #333; box-sizing: border-box;">
									{{ item.saleSubTotal }}
								</div>
							</div>
						</scroll-view>

						<!-- 合计 -->
						<div style="display: flex; border-top: 2px solid #e8e8e8; background: #fafbfc; font-size: 15px; flex-shrink: 0; box-sizing: border-box;">
							<div style="width: 50px; min-width: 50px; padding: 12px 8px; border-right: 1px solid #e8e8e8; box-sizing: border-box;"></div>
							<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; font-weight: 600; color: #333; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06); position: relative; z-index: 5; box-sizing: border-box;">
								合计
							</div>
							<div style="flex: 5; min-width: 200px; padding: 12px 8px; text-align: center; font-weight: 500; color: #ff6b35; word-break: break-all; box-sizing: border-box;">
								数量:{{ selectedTotalInfo.totalMount }} 重量:{{ selectedTotalInfo.totalWeight }}斤
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-left: 1px solid #e8e8e8; text-align: center; font-weight: 500; color: #999; box-sizing: border-box;">
								--
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; font-weight: 600; color: #ff6b35; box-sizing: border-box;">
								¥{{ selectedTotalInfo.totalMoney }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧 - 统计和操作区 -->
			<div :style="{ width: rightPanelWidth, maxWidth: '400px', minWidth: '280px', display: 'flex', flexDirection: 'column', background: '#fafafa', borderLeft: '1px solid #e8e8e8', flexShrink: 0, boxSizing: 'border-box' }">
				<!-- 右侧内容区（可滚动） -->
				<div style="flex: 1; padding: 8px; overflow-y: auto; box-sizing: border-box; min-height: 0;">
					<!-- 货款统计卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							<text style="font-size: 16px; font-weight: 600; color: #333;">货款统计</text>
							<text style="font-size: 13px; color: #52c41a; background: #f0f9f0; padding: 4px 8px; border-radius: 4px;">
								已选 {{ commodityList.filter(item => item.selected).length }}/{{ commodityList.length }}
							</text>
						</div>
						
					<div style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
						<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
							<text style="font-size: 15px; color: #666;">货款小计</text>
							<text style="font-size: 18px; font-weight: 600; color: #333;">¥{{ selectedTotalInfo.totalMoney }}</text>
						</div>
						<div style="height: 1px; background: #f0f0f0;"></div>
						<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
							<text style="font-size: 15px; color: #666;">代卖费</text>
							<text style="font-size: 16px; font-weight: 500; color: #ff9800;">-¥{{ calculateAssistAmount().toFixed(1) }}</text>
						</div>
					</div>
					</div>

					<!-- 未结算费用卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							<text style="font-size: 16px; font-weight: 600; color: #333;">未结算费用</text>
							<text style="font-size: 13px; color: #ff9800; background: #fff3e0; padding: 4px 8px; border-radius: 4px;">
								已选 {{ expenseList.filter(item => item.selected).length }}/{{ expenseList.length }}
							</text>
						</div>
						
						<!-- 费用列表 -->
						<div v-if="expenseList.length > 0" style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
							<div 
								v-for="(item, index) in expenseList" 
								:key="index"
								@click="toggleExpenseSelect(index)"
								:style="{ 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'space-between',
									padding: '10px', 
									background: item.selected ? '#fff9f0' : '#fafafa',
									borderRadius: '4px',
									border: '1px solid ' + (item.selected ? '#ffd591' : '#e8e8e8'),
									cursor: 'pointer',
									transition: 'all 0.2s',
									boxSizing: 'border-box'
								}"
							>
								<div style="display: flex; align-items: center; gap: 8px; flex: 1;">
									<uni-icons 
										:type="item.selected ? 'checkbox-filled' : 'circle'" 
										:color="item.selected ? '#ff9800' : '#ccc'" 
										size="20"
									></uni-icons>
									<div style="display: flex; flex-direction: column; gap: 2px;">
										<text style="font-size: 14px; font-weight: 500; color: #333;">{{ item.expensesLabel }}</text>
										<text v-if="item.remark" style="font-size: 12px; color: #999;">{{ item.remark }}</text>
									</div>
								</div>
								<text style="font-size: 15px; font-weight: 600; color: #ff6b35;">-¥{{ item.expensesMoney }}</text>
							</div>
						</div>
						
						<!-- 无费用提示 -->
						<div v-else style="text-align: center; padding: 20px 0; color: #999; font-size: 14px;">
							<uni-icons type="info-filled" color="#ccc" size="24" style="display: block; margin: 0 auto 8px;"></uni-icons>
							暂无未结算费用
						</div>
						
					<!-- 费用统计 -->
					<div v-if="expenseList.length > 0" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
						<text style="font-size: 14px; color: #666;">本次结算费用</text>
						<text style="font-size: 16px; font-weight: 600; color: #ff6b35;">-¥{{ calculateSelectedExpense().toFixed(1) }}</text>
					</div>
				</div>

				<!-- 应结算金额卡片 -->
				<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe8cc 100%); border-radius: 6px; padding: 18px; margin-bottom: 10px; border: 2px solid #ffb74d; box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15); box-sizing: border-box;">
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<div style="display: flex; align-items: center; gap: 8px;">
							<uni-icons type="wallet-filled" color="#ff9800" size="24"></uni-icons>
							<text style="font-size: 17px; font-weight: 600; color: #e65100;">应结算金额</text>
						</div>
						<text style="font-size: 26px; font-weight: 700; color: #e65100;">¥{{ selectedSettlementAmount }}</text>
					</div>
				</div>

				<!-- 实际结算卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							实际结算
						</div>

						<!-- 备注输入 -->
						<div style="box-sizing: border-box;">
							<div style="display: flex; align-items: center; margin-bottom: 8px;">
								<text style="font-size: 15px; color: #666;">备注信息</text>
							</div>
							<u--textarea 
								v-model="remark" 
								placeholder="请输入备注信息（可选）" 
								:maxlength="200"
								:showWordLimit="true"
								:autoHeight="true"
								style="border: 1px solid #e8e8e8; border-radius: 4px; background: #fafafa; font-size: 14px; box-sizing: border-box; width: 100%;"
							></u--textarea>
						</div>
					</div>
				</div>

				<!-- 底部操作栏（固定） -->
				<div style="background: white; padding: 12px 14px; box-shadow: 0 -1px 4px rgba(0,0,0,0.06); border-top: 1px solid #e8e8e8; flex-shrink: 0; box-sizing: border-box;">
					<div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px;">
						<uni-icons :type="allSelected ? 'checkmarkempty' : 'info'" :color="allSelected ? '#52c41a' : '#ff9800'" size="20"></uni-icons>
						<text :style="{ fontSize: '15px', fontWeight: 500, color: allSelected ? '#52c41a' : '#ff9800' }">
							{{ allSelected ? '整车已结完' : '部分货品结算' }}
						</text>
					</div>
					<button 
						@click="confirmSettlement"
						:disabled="commodityList.filter(item => item.selected).length === 0"
						:style="{ 
							width: '100%', 
							height: '44px', 
							lineHeight: '44px', 
							background: commodityList.filter(item => item.selected).length === 0 ? '#ccc' : 'linear-gradient(135deg, #ff8a3d 0%, #ff6b35 100%)', 
							color: 'white', 
							fontWeight: 600, 
							fontSize: '16px', 
							borderRadius: '8px', 
							border: 'none', 
							boxShadow: '0 2px 6px rgba(255,107,53,0.3)',
							cursor: commodityList.filter(item => item.selected).length === 0 ? 'not-allowed' : 'pointer',
							boxSizing: 'border-box'
						}">
						确认结算 ({{ commodityList.filter(item => item.selected).length }}项)
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import batch from '../../api/batch/batch';
import expense from '../../api/expense/expense';

export default {
	data() {
		return {
			WindowHeight: 0,
			WindowWidth: 0,
			batchInfo: {},
			commodityList: [],
			allSelected: true, // 全选状态
			totalInfo: {
				totalMount: 0,
				totalWeight: 0,
				totalMoney: 0
			},
			settlementAmount: 0,
			expenseList: [],
			currentTime: '',
			remark: ''
		}
	},
	computed: {
		// 动态计算右侧面板宽度
		rightPanelWidth() {
			// 如果窗口宽度小于 768px，使用较小的宽度
			if (this.WindowWidth < 768) {
				return '280px';
			}
			// 如果窗口宽度小于 1024px，使用 30% 的宽度
			else if (this.WindowWidth < 1024) {
				return '30%';
			}
			// 大屏幕使用固定宽度 350px
			else {
				return '350px';
			}
		},
		
		// 计算被勾选的货品总计
		selectedTotalInfo() {
			let totalMount = 0;
			let totalWeight = 0;
			let totalMoney = 0;
			
			this.commodityList.forEach(item => {
				if (item.selected) {
					totalWeight += (item.saleWeight || 0);
					totalMoney += (parseFloat(item.saleSubTotal) || 0);
					if (item.outPutSaleMount && Array.isArray(item.outPutSaleMount)) {
						item.outPutSaleMount.forEach(model => {
							totalMount += (model.mount || 0);
						});
					}
				}
			});
			
			return {
				totalMount,
				totalWeight: totalWeight.toFixed(1),
				totalMoney: totalMoney.toFixed(1)
			};
		},
		
		// 计算被勾选货品的结算金额
		selectedSettlementAmount() {
			// 只计算被选中的费用
			const totalExpense = this.calculateSelectedExpense();
			
			// 使用计算方法获取代卖费
			const assistAmount = this.calculateAssistAmount();
			const selectedMoney = parseFloat(this.selectedTotalInfo.totalMoney) || 0;
			// 结算金额 = 结算货款 - 代卖费 - 费用
			return (selectedMoney - assistAmount - totalExpense).toFixed(1);
		}
	},
	onLoad(options) {
		const windowInfo = uni.getWindowInfo();
		this.WindowHeight = windowInfo.windowHeight;
		this.WindowWidth = windowInfo.windowWidth;
		
		// 获取当前时间
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hour = String(now.getHours()).padStart(2, '0');
		const minute = String(now.getMinutes()).padStart(2, '0');
		this.currentTime = `${year}-${month}-${day} ${hour}:${minute}`;
		
		// 从页面参数或全局状态获取数据
		if (options.batchId) {
			this.loadBatchData(options.batchId);
		}
		
		// 监听窗口大小变化
		// #ifdef H5
		window.addEventListener('resize', this.handleResize);
		// #endif
	},
	
	beforeDestroy() {
		// 移除窗口大小变化监听
		// #ifdef H5
		window.removeEventListener('resize', this.handleResize);
		// #endif
	},
	methods: {
		// 处理窗口大小变化
		handleResize() {
			const windowInfo = uni.getWindowInfo();
			this.WindowHeight = windowInfo.windowHeight;
			this.WindowWidth = windowInfo.windowWidth;
		},
		
		// 计算被选中的费用总额
		calculateSelectedExpense() {
			let totalExpense = 0;
			this.expenseList.forEach(item => {
				if (item.selected) {
					totalExpense += parseFloat(item.expensesMoney) || 0;
				}
			});
			return totalExpense;
		},
		
		// 切换费用的选中状态
		toggleExpenseSelect(index) {
			const item = this.expenseList[index];
			this.$set(item, 'selected', !item.selected);
		},
		
		// 计算代卖费总额（参考 settlementIndex.vue 的计算方式）
		calculateAssistAmount() {
			// 如果没有批次信息或没有代卖费设置，返回0
			if (!this.batchInfo || !this.batchInfo.assistType) {
				return 0;
			}
			
			const assistType = String(this.batchInfo.assistType);
			
			// 按批次：根据选中货品的金额占比分配代卖费
			if (assistType === '0') {
				const batchAssistAmount = parseFloat(this.batchInfo.assistAmount) || 0;
				
				// 计算总货款
				let totalMoney = 0;
				this.commodityList.forEach(item => {
					totalMoney += parseFloat(item.saleSubTotal) || 0;
				});
				
				// 计算选中货品的货款
				let selectedMoney = parseFloat(this.selectedTotalInfo.totalMoney) || 0;
				
				// 如果总货款为0，返回0
				if (totalMoney === 0) {
					return 0;
				}
				
				// 按照选中货品的金额占比分配代卖费（取绝对值确保返回正数）
				return Math.abs(batchAssistAmount * selectedMoney / totalMoney);
			}
			
			// 按数量或按重量：计算选中货品的代卖费
			let totalAssistAmount = 0;
			
			if (this.commodityList && this.commodityList.length > 0) {
				for (let i = 0; i < this.commodityList.length; i++) {
					const item = this.commodityList[i];
					// 只计算被选中的货品的代卖费
					if (!item.selected) continue;
					
					const unitPrice = parseFloat(item.settlementUnitPrice) || 0;
					
					if (assistType === '1') {
						// 按数量：代卖费单价 * 货品销售数量
						let totalMount = 0;
						if (item.outPutPurchaseInventories && item.outPutPurchaseInventories.length > 0) {
							for (let k = 0; k < item.outPutPurchaseInventories.length; k++) {
								totalMount += item.outPutPurchaseInventories[k].mount || 0;
							}
						}
						totalAssistAmount += unitPrice * totalMount;
					} else if (assistType === '2') {
						// 按重量：代卖费单价 * 货品销售重量
						const weight = parseFloat(item.saleWeight) || 0;
						totalAssistAmount += unitPrice * weight;
					}
				}
			}
			
			// 返回绝对值，确保代卖费始终为正数
			return Math.abs(totalAssistAmount);
		},
		
		goBack() {
			uni.navigateBack();
		},
		
		// 切换全选状态
		toggleSelectAll() {
			this.allSelected = !this.allSelected;
			this.commodityList.forEach(item => {
				this.$set(item, 'selected', this.allSelected);
			});
		},
		
		// 切换单个货品的选中状态
		toggleItemSelect(index) {
			const item = this.commodityList[index];
			this.$set(item, 'selected', !item.selected);
			
			// 检查是否所有货品都被选中
			this.allSelected = this.commodityList.every(item => item.selected);
		},
		
		addRemark() {
			// 聚焦到备注输入框
			uni.showToast({
				title: '请输入备注信息',
				icon: 'none'
			});
		},
		
		loadBatchData(batchId) {
			uni.showLoading({
				title: '加载中...'
			});
			
			// 加载批次数据
			batch.GetUnsettleAssistBatchInfoAsync(batchId).then(res => {
				if (res && res.data) {
					// 获取批次基本信息
					this.batchInfo = {
						id: res.data.id || batchId,
						batchCode: res.data.batchCode || '',
						companyId: res.data.companyId || '',
						shipperId: res.data.shipperId || '',
						shipperName: res.data.shipperName || '批次',
						createTime: res.data.createTime || '',
						assistAmount: res.data.assistAmount || 0,
						assistType: res.data.assistType || 0
					};
					
					// 初始化货品列表，默认全部勾选
					this.commodityList = (res.data.allPurchaseAssistList || []).map(item => {
						return {
							...item,
							selected: true // 默认勾选
						};
					});
					
					// 计算总计
					this.totalInfo.totalMoney = res.data.saleSubTotal || 0;
					this.totalInfo.totalMount = 0;
					this.totalInfo.totalWeight = 0;
					
					this.commodityList.forEach(item => {
						this.totalInfo.totalWeight += (item.saleWeight || 0);
						if (item.outPutSaleMount && Array.isArray(item.outPutSaleMount)) {
							item.outPutSaleMount.forEach(model => {
								this.totalInfo.totalMount += (model.mount || 0);
							});
						}
					});
					
					// 加载费用数据
					expense.getAllExpenseByBatchId(batchId).then(res => {
						uni.hideLoading();
						// 初始化费用列表，默认全部勾选
						this.expenseList = (res.data || []).map(item => {
							return {
								...item,
								selected: true // 默认勾选
							};
						});
						this.calculateSettlement();
					}).catch(error => {
						uni.hideLoading();
						console.error('加载费用数据失败:', error);
						this.calculateSettlement();
					});
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '加载数据失败',
						icon: 'error'
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('加载批次数据失败:', error);
				uni.showToast({
					title: '加载数据失败',
					icon: 'error'
				});
			});
		},
		
		calculateSettlement() {
			// 使用被选中的费用进行计算
			const totalExpense = this.calculateSelectedExpense();
			
			// 使用计算方法获取代卖费
			const assistAmount = this.calculateAssistAmount();
			this.settlementAmount = (this.totalInfo.totalMoney - assistAmount - totalExpense).toFixed(1);
		},
		
		confirmSettlement() {
			// 检查是否至少选择了一个货品
			const selectedItems = this.commodityList.filter(item => item.selected);
			if (selectedItems.length === 0) {
				uni.showToast({
					title: '请至少选择一个货品进行结算',
					icon: 'none'
				});
				return;
			}
			
			let that = this;
			const selectedCount = selectedItems.length;
			const totalCount = this.commodityList.length;
			const content = selectedCount === totalCount 
				? `确定要结算全部${totalCount}个货品，金额 ${this.selectedSettlementAmount} 元吗？`
				: `您选择了${selectedCount}个货品（共${totalCount}个），确定要结算金额 ${this.selectedSettlementAmount} 元吗？`;
			
			uni.showModal({
				title: '确认结算',
				content: content,
				success: (res) => {
					if (res.confirm) {
						// 执行结算操作
						that.doSettlement();
					}
				}
			});
		},
		
		doSettlement() {
			let that = this;
			uni.showLoading({
				title: '结算中...'
			});
			
			// 获取用户信息
			const userInfo = uni.getStorageSync("userInfo");
			if (!userInfo) {
				uni.hideLoading();
				uni.showToast({
					title: "请先登录",
					icon: "error"
				});
				return;
			}
			
			// 获取被选中的货品ID列表
			const selectedItems = this.commodityList.filter(item => item.selected);
			const settleAssistIds = selectedItems.map(item => item.id);
			
			// 获取被选中的费用ID列表
			const selectedExpenses = this.expenseList.filter(item => item.selected);
			const settleExpenseIds = selectedExpenses.map(item => item.id);
			
		// 计算各项金额
		const settleGoodMoney = parseFloat(this.selectedTotalInfo.totalMoney); // 结算货款
		const assistAmount = Math.abs(this.calculateAssistAmount()); // 代卖费用（取绝对值确保正数）
		const otherAmount = Math.abs(this.calculateSelectedExpense()); // 其他费用（取绝对值确保正数）
		
		// 构建结算对象
		const settlementData = {
			batchId: this.batchInfo.id,
			settleTime: new Date().toISOString(),
			settleMoney: parseFloat(this.selectedSettlementAmount), // 最终结算金额
			settleGoodMoney: settleGoodMoney, // 结算货款
			assistAmount: assistAmount, // 代卖费用（正数）
			otherAmount: otherAmount, // 其他费用（正数）
			operatorName: userInfo.name || userInfo.userName || '',
			operatorId: userInfo.id || '',
			remark: this.remark || '',
			status: 1,
			settleAssistId: settleAssistIds,
			settleExpenseId: settleExpenseIds, // 添加被选中的费用ID
			IsSettleAll: this.allSelected // 是否整车结完
		};
		
		// 调试日志：查看发送的数据
		console.log('=== 结算数据 ===');
		console.log('结算货款:', settleGoodMoney);
		console.log('代卖费用:', assistAmount, '(应为正数)');
		console.log('其他费用:', otherAmount, '(应为正数)');
		console.log('最终结算金额:', settlementData.settleMoney);
		console.log('完整数据:', settlementData);
		
					// 调用批次结算接口
					batch.BatchSettleAction(settlementData).then(res3 => {
							uni.hideLoading();
							if (res3.code === 200) {
								uni.showToast({
									title: "结算成功",
									icon: "success"
								});
								
								setTimeout(() => {
									uni.navigateBack();
								}, 1500);
							} else {
								uni.showToast({
									title: res3.msg || "结算失败",
									icon: "error"
								});
							}
						}).catch(error => {
							uni.hideLoading();
							console.error('结算失败:', error);
							uni.showToast({
								title: "结算失败",
								icon: "error"
							});
						});
	}
	}
}
</script>

<style scoped>
/* 防止页面横向滚动 */
* {
	box-sizing: border-box;
}

/* 滚动条样式 */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
	background: #a1a1a1;
}

/* 响应式适配 */
@media screen and (max-width: 1024px) {
	/* 中等屏幕优化 */
	* {
		font-size: 13px !important;
	}
}

@media screen and (max-width: 768px) {
	/* 小屏幕下调整布局 */
	* {
		font-size: 12px !important;
	}
	
	/* 调整内边距以节省空间 */
	.card {
		padding: 8px !important;
	}
}

@media screen and (max-width: 600px) {
	/* 超小屏幕下优化显示 */
	* {
		font-size: 11px !important;
	}
	
	/* 进一步减少内边距 */
	.card {
		padding: 6px !important;
		margin: 4px !important;
	}
}
</style>

