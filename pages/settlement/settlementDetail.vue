<template>
	<div :style="{ 'display': 'flex', 'height': WindowHeight + 'px', width: '100%', 'flex-direction': 'column', 'background-color': '#f5f5f5', 'box-sizing': 'border-box', 'overflow': 'hidden' }">
		<!-- 顶部导航栏 -->
		<div style="height: 56px; background: linear-gradient(135deg, #52c41a 0%, #52c41a 100%); display: flex; align-items: center; padding: 0 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; box-sizing: border-box;">
			<div @click="goBack" style="cursor: pointer; display: flex; align-items: center; color: white; font-weight: bold; font-size: 16px;">
				<uni-icons type="left" color="white" size="24" style="margin-right: 8px;"></uni-icons>
				返回
			</div>
			<div style="flex: 1; text-align: center; color: white; font-size: 18px; font-weight: bold; padding: 0 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
				结算记录详情
			</div>
			<div style="width: 60px;"></div>
		</div>

		<div style="flex: 1; display: flex; overflow: hidden; box-sizing: border-box;">
			<!-- 左侧 - 货款结算卡片 -->
			<div style="flex: 1; min-width: 0; padding: 6px; background: #fafafa; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden;">
				<div style="background: white; border-radius: 8px; padding: 12px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow: hidden;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; box-sizing: border-box;">
						<div style="font-size: 17px; font-weight: 600; color: #333;">已结算货品</div>
						<div style="display: flex; align-items: center; gap: 6px;">
							<uni-icons type="checkmarkempty" color="#52c41a" size="20"></uni-icons>
							<text style="font-size: 14px; color: #52c41a; font-weight: 500;">已完成</text>
						</div>
					</div>

					<!-- 货品列表 -->
					<div style="border: solid 1px #e8e8e8; border-radius: 6px; overflow: hidden; flex: 1; display: flex; flex-direction: column; box-sizing: border-box; min-height: 0;">
						<!-- 表头 -->
						<div style="display: flex; background-color: #f5f7fa; font-weight: 600; border-bottom: 1px solid #e8e8e8; font-size: 15px; flex-shrink: 0; box-sizing: border-box;">
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
							<div style="display: flex; border-bottom: 1px solid #f0f0f0; background: white; font-size: 14px; box-sizing: border-box;" 
								v-for="(item, index) in commodityList" :key="index">
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
							<div style="flex: 3; min-width: 100px; padding: 12px 8px; border-right: 1px solid #e8e8e8; text-align: center; font-weight: 600; color: #333; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06); position: relative; z-index: 5; box-sizing: border-box;">
								合计
							</div>
							<div style="flex: 5; min-width: 200px; padding: 12px 8px; text-align: center; font-weight: 500; color: #52c41a; word-break: break-all; box-sizing: border-box;">
								数量:{{ totalInfo.totalMount }} 重量:{{ totalInfo.totalWeight }}斤
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; border-left: 1px solid #e8e8e8; text-align: center; font-weight: 500; color: #999; box-sizing: border-box;">
								--
							</div>
							<div style="flex: 2; min-width: 80px; padding: 12px 8px; text-align: center; font-weight: 600; color: #52c41a; box-sizing: border-box;">
								¥{{ settleGoodMoney.toFixed(1) }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧 - 统计和详情区 -->
			<div :style="{ width: rightPanelWidth, maxWidth: '400px', minWidth: '280px', display: 'flex', flexDirection: 'column', background: '#fafafa', borderLeft: '1px solid #e8e8e8', flexShrink: 0, boxSizing: 'border-box' }">
				<!-- 右侧内容区（可滚动） -->
				<div style="flex: 1; padding: 8px; overflow-y: auto; box-sizing: border-box; min-height: 0;">
					<!-- 结算信息卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							结算信息
						</div>
						
						<div style="display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">批次编号</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ batchInfo.batchCode }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">货主</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ batchInfo.shipperName }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">结算时间</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ settleTime }}</text>
							</div>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<text style="font-size: 14px; color: #999;">操作人</text>
								<text style="font-size: 14px; font-weight: 500; color: #333;">{{ settleRecord.operatorName }}</text>
							</div>
						</div>
					</div>

					<!-- 货款统计卡片 -->
					<div style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							货款统计
						</div>
						
						<div style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
							<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
								<text style="font-size: 15px; color: #666;">货款小计</text>
								<text style="font-size: 18px; font-weight: 600; color: #333;">¥{{ settleGoodMoney.toFixed(1) }}</text>
							</div>
							<div style="height: 1px; background: #f0f0f0;"></div>
							<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; box-sizing: border-box;">
								<text style="font-size: 15px; color: #666;">代卖费</text>
								<text style="font-size: 16px; font-weight: 500; color: #ff9800;">-¥{{ assistAmount.toFixed(1) }}</text>
							</div>
						</div>
					</div>

					<!-- 已结算费用卡片 -->
					<div v-if="expenseList.length > 0" style="background: white; border-radius: 6px; padding: 14px; margin-bottom: 10px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							已结算费用
						</div>
						
						<!-- 费用列表 -->
						<div style="display: flex; flex-direction: column; gap: 8px; box-sizing: border-box;">
							<div 
								v-for="(item, index) in expenseList" 
								:key="index"
								style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #fafafa; border-radius: 4px; border: 1px solid #e8e8e8; box-sizing: border-box;"
							>
								<div style="display: flex; align-items: center; gap: 8px; flex: 1;">
									<uni-icons type="checkmarkempty" color="#52c41a" size="18"></uni-icons>
									<div style="display: flex; flex-direction: column; gap: 2px;">
										<text style="font-size: 14px; font-weight: 500; color: #333;">{{ item.expensesLabel }}</text>
										<text v-if="item.remark" style="font-size: 12px; color: #999;">{{ item.remark }}</text>
									</div>
								</div>
								<text style="font-size: 15px; font-weight: 600; color: #ff6b35;">-¥{{ item.expensesMoney }}</text>
							</div>
						</div>
						
						<!-- 费用统计 -->
						<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
							<text style="font-size: 14px; color: #666;">结算费用合计</text>
							<text style="font-size: 16px; font-weight: 600; color: #ff6b35;">-¥{{ otherAmount.toFixed(1) }}</text>
						</div>
					</div>

					<!-- 实际结算金额卡片 -->
					<div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 6px; padding: 18px; margin-bottom: 10px; border: 2px solid #81c784; box-shadow: 0 2px 8px rgba(82, 196, 26, 0.15); box-sizing: border-box;">
						<div style="display: flex; justify-content: space-between; align-items: center;">
							<div style="display: flex; align-items: center; gap: 8px;">
								<uni-icons type="wallet-filled" color="#52c41a" size="24"></uni-icons>
								<text style="font-size: 17px; font-weight: 600; color: #2e7d32;">实际结算金额</text>
							</div>
							<text style="font-size: 26px; font-weight: 700; color: #2e7d32;">¥{{ settleMoney.toFixed(1) }}</text>
						</div>
					</div>

					<!-- 备注信息卡片 -->
					<div v-if="settleRecord.remark" style="background: white; border-radius: 6px; padding: 14px; border: 1px solid #e8e8e8; box-sizing: border-box;">
						<div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; box-sizing: border-box;">
							备注信息
						</div>
						<div style="font-size: 14px; color: #666; line-height: 1.6;">
							{{ settleRecord.remark }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import batch from '../../api/batch/batch';

export default {
	data() {
		return {
			WindowHeight: 0,
			WindowWidth: 0,
			settleRecordId: '',
			settleRecord: {},
			batchInfo: {
				id: '',
				batchCode: '',
				shipperName: '',
				assistAmount: 0,
				assistType: 0
			},
			commodityList: [],
			expenseList: [],
			totalInfo: {
				totalMount: 0,
				totalWeight: 0
			},
			// 结算记录中的实际金额字段
			settleGoodMoney: 0, // 结算货款（货款小计）
			assistAmount: 0, // 代卖费
			otherAmount: 0, // 其他费用（结算费用合计）
			settleMoney: 0, // 最终结算金额（实际结算金额）
			settleTime: ''
		}
	},
	computed: {
		// 动态计算右侧面板宽度
		rightPanelWidth() {
			if (this.WindowWidth < 768) {
				return '280px';
			} else if (this.WindowWidth < 1024) {
				return '30%';
			} else {
				return '350px';
			}
		}
	},
	onLoad(options) {
		const windowInfo = uni.getWindowInfo();
		this.WindowHeight = windowInfo.windowHeight;
		this.WindowWidth = windowInfo.windowWidth;
		
		// 从页面参数获取数据
		if (options.settleRecordId) {
			this.settleRecordId = options.settleRecordId;
			
			// 从参数中获取批次信息
			if (options.batchId) {
				this.batchInfo.id = options.batchId;
			}
			if (options.batchCode) {
				this.batchInfo.batchCode = decodeURIComponent(options.batchCode);
			}
			if (options.shipperName) {
				this.batchInfo.shipperName = decodeURIComponent(options.shipperName);
			}
			if (options.assistType !== undefined) {
				this.batchInfo.assistType = parseInt(options.assistType);
			}
			if (options.assistAmount !== undefined) {
				this.batchInfo.assistAmount = parseFloat(options.assistAmount);
			}
			
			this.loadSettleRecordData();
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
		
		goBack() {
			uni.navigateBack();
		},
		
		// 加载结算记录数据
		loadSettleRecordData() {
			uni.showLoading({
				title: '加载中...'
			});
			
			batch.GetSettleRecordById(this.settleRecordId).then(res => {
				uni.hideLoading();
				
				if (res && res.data) {
					const data = res.data;
					
					// 结算记录基本信息
					this.settleRecord = {
						id: data.id || this.settleRecordId,
						settleMoney: data.settleMoney || 0,
						operatorName: data.operatorName || '',
						remark: data.remark || '',
						settleTime: data.settleTime || ''
					};
					
					// 批次信息（保留从页面参数传入的值，API返回的值作为备用）
					this.batchInfo = {
						id: this.batchInfo.id || data.batchId || '',
						batchCode: this.batchInfo.batchCode || data.batchCode || '',
						shipperName: this.batchInfo.shipperName || data.shipperName || '',
						assistAmount: this.batchInfo.assistAmount || data.assistAmount || 0,
						assistType: this.batchInfo.assistType !== undefined ? this.batchInfo.assistType : (data.assistType || 0)
					};
					
					// 从结算记录中读取实际金额字段
					this.settleGoodMoney = parseFloat(data.settleGoodMoney) || 0; // 结算货款（货款小计）
					this.assistAmount = Math.abs(parseFloat(data.assistAmount) || 0); // 代卖费（取绝对值）
					this.otherAmount = Math.abs(parseFloat(data.otherAmount) || 0); // 其他费用（取绝对值）
					this.settleMoney = parseFloat(data.settleMoney) || 0; // 最终结算金额（实际结算金额）
					
					// 格式化结算时间
					if (this.settleRecord.settleTime) {
						const date = new Date(this.settleRecord.settleTime);
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						const hour = String(date.getHours()).padStart(2, '0');
						const minute = String(date.getMinutes()).padStart(2, '0');
						this.settleTime = `${year}-${month}-${day} ${hour}:${minute}`;
					}
					
					// 已结算的货品列表
					this.commodityList = data.settlePurcahseAssistList || [];
					
					// 已结算的费用列表
					this.expenseList = data.settleExpenseList || [];
					
					// 只计算货品统计信息（数量和重量），金额使用结算记录中的值
					this.calculateTotalInfo();
					
				} else {
					uni.showToast({
						title: '加载数据失败',
						icon: 'error'
					});
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('加载结算记录失败:', error);
				uni.showToast({
					title: '加载数据失败',
					icon: 'error'
				});
			});
		},
		
		// 计算货品统计信息（只计算数量和重量，金额直接使用结算记录中的值）
		calculateTotalInfo() {
			let totalMount = 0;
			let totalWeight = 0;
			
			this.commodityList.forEach(item => {
				totalWeight += (item.saleWeight || 0);
				
				if (item.outPutSaleMount && Array.isArray(item.outPutSaleMount)) {
					item.outPutSaleMount.forEach(model => {
						totalMount += (model.mount || 0);
					});
				}
			});
			
			this.totalInfo = {
				totalMount,
				totalWeight: totalWeight.toFixed(1)
			};
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
	* {
		font-size: 13px !important;
	}
}

@media screen and (max-width: 768px) {
	* {
		font-size: 12px !important;
	}
	
	.card {
		padding: 8px !important;
	}
}

@media screen and (max-width: 600px) {
	* {
		font-size: 11px !important;
	}
	
	.card {
		padding: 6px !important;
		margin: 4px !important;
	}
}
</style>

