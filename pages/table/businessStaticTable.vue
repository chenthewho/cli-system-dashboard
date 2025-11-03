<template>
	<div class="space" :style="{ height: windowHeight + 'px' }">
		<div class="space-header">

			<div style="flex: 1; display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;">
				<div style="align-items: left;">
					<button
						style="height: 18rpx;line-height: 18rpx;color:#666666;font-weight: bold;background: #f5f5f5;border: 1px solid #e0e0e0;"
						@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15" color="#666666"
							style="margin-right: 5px;"></uni-icons>返回</button>
				</div>
				<text class="title">营业统计表</text>
			</div>
			<view style="flex: 1;">
				<view style="display: flex;">
					<view class="time-select-show">
						<uni-datetime-picker v-model="dataSelectBeiginTime" type="date" @change="changeTimeTab(1)"
							style="font-weight: bold;margin-right: 40rpx;"><uni-icons custom-prefix="iconfont"
								type="icon-rili1" size="20" color="#000000"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>{{dataSelectBeiginTime}}</uni-datetime-picker>
						<uni-datetime-picker v-model="dateSelectEndTime" type="date" v-if="time_select_type===1" @change="changeTimeTab(1)"
							style="font-weight: bold;margin-right: 60rpx;"> <text
								style="color: black;margin-right: 10rpx;">至</text>
							{{dateSelectEndTime}}</uni-datetime-picker>
					</view>
					<view class="time-select-card">
						<view class="time-btn" :class="time_select_type===1?'time-btn-active':none"
							@click="changeTimeTab(1)">自定义</view>
						<view class="time-btn" :class="time_select_type===2?'time-btn-active':none"
							@click="changeTimeTab(2)">本月</view>
						<view class="time-btn" :class="time_select_type===3?'time-btn-active':none"
							@click="changeTimeTab(3)">今日</view>
					</view>
				</view>
			</view>
		</div>
		<view class="space-content">
			<view class="left-side">
				<!-- 左边内容 - 添加滚动区域 -->
				<scroll-view scroll-y="true" class="left-side-scroll" :style="{ height: leftScrollHeight + 'px' }">
				<!-- 卡片1-->
				<view class="left-side-card1">
					<view class="card-header">
						<view class="left">
							<uni-icons custom-prefix="iconfont"
								type="icon-yingshouguanli-tongjibaobiao-yingshouduizhang" size="20" color="#55aaff"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>总营收
						</view>
						<view class="right">
							{{
								tableStatic.receiveMoeny
							}}
						</view>
					</view>
					<view class="card-body">
						<view class="card-grid"><text class="left">销售数量</text><text class="right">{{tableStatic.orderNum}}</text></view>
						<view class="card-grid"><text class="left">销售重量</text><text class="right">0</text></view>
						<view class="card-grid"><text class="left">优惠</text><text class="right">{{ tableStatic.discountAmount }}</text></view>
					</view>
				</view>
			<!-- 卡片2-->
			<view class="left-side-card2">
				<view class="card-header">
					<view class="left">
						<uni-icons custom-prefix="iconfont" type="icon-zhichu" size="20" color="#00aa7f"
							style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>支出费用
					</view>
					<view class="right">
						{{ totalExpense.toFixed(2) }}
					</view>
				</view>
				<view class="card-body" v-if="expenseList.length > 0">
					<scroll-view scroll-y="true" class="expense-scroll" style="max-height: 60rpx;">
						<view class="expense-item" v-for="(item, index) in expenseList" :key="index">
							<text class="expense-name">{{ item.spendName }}</text>
							<text class="expense-amount">¥{{ item.spendMoney.toFixed(2) }}</text>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 卡片4-->
			<view class="left-side-card4">
				<view class="card-header">
					<view class="left">
						<uni-icons custom-prefix="iconfont" type="icon-coupons" size="20" color="#e20000"
							style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>赊欠统计
					</view>
					<view class="right">
						{{
							tableStatic.debtMoney
						}}
					</view>
				</view>
				<view class="card-body">
					<view class="grid" style="color: darkred;" ><view>待付款</view><view >0</view></view>
					<view class="grid" style="color: green;"  ><view>还款</view><view>0</view></view>
				</view>
			</view>

			<!-- 卡片5 - 其他统计 -->
			<view class="left-side-card5">
				<view class="card-header">
					<view class="left">
						<uni-icons custom-prefix="iconfont" type="icon-baobiao" size="20" color="#9c27b0"
							style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>其他统计
					</view>
					<view class="right">
					</view>
				</view>
				<view class="card-body card-body-grid">
					<view class="grid-item" style="border-right: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef;">
						<view class="grid-item-label" style="color: #e91e63;">报损记录</view>
						<view class="grid-item-value">{{ tableStatic.lossCount || 0 }}</view>
					</view>
					<view class="grid-item" style="border-bottom: 1px solid #e9ecef;">
						<view class="grid-item-label" style="color: #3f51b5;">盘点记录</view>
						<view class="grid-item-value">{{ tableStatic.inventoryCount || 0 }}</view>
					</view>
					<view class="grid-item" style="border-right: 1px solid #e9ecef;">
						<view class="grid-item-label" style="color: #4caf50;">盘盈</view>
						<view class="grid-item-value">{{ tableStatic.profitCount || 0 }}</view>
					</view>
					<view class="grid-item">
						<view class="grid-item-label" style="color: #ff9800;">盘亏</view>
						<view class="grid-item-value">{{ tableStatic.lossStockCount || 0 }}</view>
					</view>
				</view>
			</view>
			</scroll-view>
		</view>
			<view class="right-side">
				<!-- 右边内容 -->
				<view class="right-side-card">
					<!--顶部tab-->
					<view class="header">
						<zb-tab :value="1" :data="tabValue" @click-tab="tabChange"></zb-tab>
					</view>

					<view class="content">
						<!-- 代销车次表格 -->
						<view v-if="currentTableTab===1">
							<view class="compact-table-header">
								<view style="flex: 2.2;">货主/车次</view>
								<view style="flex: 1.5;text-align: center;">创建时间</view>
								<view style="flex: 0.8;text-align: center;">状态</view>
								<view style="flex: 1;text-align: right;">售额</view>
							</view>
							<view class="step1-table-content">
								<scroll-view class="step1-table-scrollArea" scroll-y="true"
									:style="{ height: tableScrollHeight + 'px' }">
									<view class="compact-table-row" v-for="simple in batchProfitSimpleList"
										@click="openAssistDrawer(simple.batchId)">
										<view style="flex: 2.2; display: flex;flex-direction: column;min-width: 0;">
											<view class="ellipsis">{{simple.shipperName}}</view>
											<view class="row-sub-text">{{simple.batchCode}}</view>
										</view>
									<view style="flex: 1.5;display: flex;flex-direction: column;align-items: center;justify-content: center;">
										<view class="row-time-date">{{simple.createTime.split('T')[0].substring(5)}}</view>
										<view class="row-time-hour">{{simple.createTime.split('T')[1] ? simple.createTime.split('T')[1].substring(0,5) : ''}}</view>
									</view>
										<view style="flex: 0.8;display: flex; justify-content: center;align-items: center;">
											<text v-if="simple.saleStatus===1" class="compact-status-tag" 
												style="--status-color: #00aaff;--status-bg: #e3f2fd;">售罄</text>
											<text v-if="simple.saleStatus===0" class="compact-status-tag"
												style="--status-color: #e74c3c;--status-bg: #ffebee;">停售</text>
											<text v-if="simple.saleStatus===2" class="compact-status-tag"
												style="--status-color: #00b900;--status-bg: #e8f5e9;">已结算</text>
										</view>
										<view class="row-amount" style="flex: 1;">
											¥{{simple.cargoAmount}}
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
						
						<!-- 货品统计表格 -->
						<view v-if="currentTableTab===3||currentTableTab===2">
							<view class="compact-table-header">
								<view style="flex: 2.5;">货品名称</view>
								<view style="flex: 1.2;text-align: center;">已售重量</view>
								<view style="flex: 1.2;text-align: right;">货款金额</view>
							</view>
							<view class="step1-table-content">
								<scroll-view class="step1-table-scrollArea" scroll-y="true"
									:style="{ height: tableScrollHeight + 'px' }">
									<view class="compact-table-row" v-for="item in batchProfitSimpleList"
										  @click="(currentTableTab === 2 || currentTableTab === 3) ? openGoodsDrawer(item) : null"
										  :class="{ 'clickable-item': currentTableTab === 2 || currentTableTab === 3 }">
										<view style="flex: 2.5; display: flex;align-items: center;font-weight: 600;min-width: 0;">
											<view class="ellipsis">{{item.name}}</view>
										</view>
										<view class="row-weight" style="flex: 1.2;">
											{{item.weightSold}}
										</view>
										<view class="row-amount" style="flex: 1.2;">
											¥{{item.amountSale}}
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 抽屉组件 -->
		<view class="drawer-container">
			<!-- 遮罩层 -->
			<view class="drawer-mask" :class="{ 'show': showDrawer || showGoodsDrawer }" @tap="showDrawer ? closeDrawer() : closeGoodsDrawer()"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showDrawer || showGoodsDrawer }">
				<slot>
				<!-- 车次明细抽屉 -->
				<view v-if="showDrawer">
					<view class="drawer-header">
						<view class="drawer-header-left">
							<uni-icons custom-prefix="iconfont" type="icon-guanbi" size="20" color="#666" @click="closeDrawer"></uni-icons>
							<text class="drawer-title">车次明细</text>
						</view>
					</view>
					<view class="drawer-info-card">
						<view class="info-row">
							<text class="info-label">货主</text>
							<text class="info-value">{{selectAssistBatchDetail.shipperName}}</text>
							<text class="info-label" style="margin-left: 20rpx;">车次</text>
							<text class="info-value">{{selectAssistBatchDetail.batchCode}}</text>
							<text v-if="selectAssistBatchDetail.saleStatus===1" class="drawer-status-tag" 
								style="--status-color: #00aaff;--status-bg: #e3f2fd;">在售</text>
							<text v-if="selectAssistBatchDetail.saleStatus===0" class="drawer-status-tag"
								style="--status-color: #e74c3c;--status-bg: #ffebee;">停售</text>
							<text v-if="selectAssistBatchDetail.saleStatus===2" class="drawer-status-tag"
								style="--status-color: #00b900;--status-bg: #e8f5e9;">已结算</text>
						</view>
						<view class="info-row" style="margin-top: 8rpx;">
							<text class="info-time">{{selectAssistBatchDetail.createTime ? selectAssistBatchDetail.createTime.replace('T', ' ') : ''}}</text>
						</view>
					</view>

					<view class="drawer-table-wrapper">
						<scroll-view class="drawer-scroll-area" scroll-y="true" scroll-x="true">
							<table class="drawer-table">
								<thead>
									<tr class="drawer-thead">
										<th class="drawer-th">货品</th>
										<th class="drawer-th">销量</th>
										<th class="drawer-th">均重</th>
										<th class="drawer-th">均价</th>
										<th class="drawer-th">货款</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in selectAssistBatchDetail.allPurchaseAssistList" class="drawer-tr">
										<td class="drawer-td drawer-td-name">{{item.commodityName}}</td>
										<td class="drawer-td">{{item.saleMount}}</td>
										<td class="drawer-td">-</td>
										<td class="drawer-td">¥{{item.averagePrice}}</td>
										<td class="drawer-td drawer-td-amount">¥{{item.saleSubTotal}}</td>
									</tr>
								</tbody>
							</table>
						</scroll-view>
					</view>
				</view>
					
				<!-- 货品详情抽屉 -->
				<view v-if="showGoodsDrawer">
					<view class="drawer-header">
						<view class="drawer-header-left">
							<uni-icons custom-prefix="iconfont" type="icon-guanbi" size="20" color="#666" @click="closeGoodsDrawer"></uni-icons>
							<text class="drawer-title">货品详情</text>
						</view>
					</view>
					<view class="drawer-info-card" v-if="currentGoodsItem">
						<view class="info-row">
							<text class="info-label">货品</text>
							<text class="info-value">{{currentGoodsItem.name}}</text>
							<text v-if="currentTableTab === 3" class="drawer-status-tag" 
								style="--status-color: #f39c12;--status-bg: #fff3e0;">自营</text>
							<text v-if="currentTableTab === 2" class="drawer-status-tag" 
								style="--status-color: #00aaff;--status-bg: #e3f2fd;">代销</text>
						</view>
						<view class="info-row" style="margin-top: 8rpx;">
							<text class="info-stat">已售: {{currentGoodsItem.weightSold}}</text>
							<text class="info-stat" style="margin-left: 20rpx;">货款: ¥{{currentGoodsItem.amountSale}}</text>
						</view>
					</view>

					<view class="drawer-table-wrapper">
						<scroll-view class="drawer-scroll-area" scroll-y="true" scroll-x="true" 
									 :style="{ height: (tableScrollHeight - 100) + 'px' }">
							<table class="drawer-table">
								<thead>
									<tr class="drawer-thead">
										<th class="drawer-th">时间</th>
										<th class="drawer-th">数量</th>
										<th class="drawer-th">重量</th>
										<th class="drawer-th">单价</th>
										<th class="drawer-th">小计</th>
										<th class="drawer-th">订单号</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(goods, index) in goodsList" :key="index" class="drawer-tr">
										<td class="drawer-td drawer-td-time">{{goods.createTime ? goods.createTime.split('T')[0].substring(5) + ' ' + goods.createTime.split('T')[1].substring(0,5) : '-'}}</td>
										<td class="drawer-td">{{goods.amount || goods.quantity || 0}}</td>
										<td class="drawer-td">{{goods.weight || goods.totalWeight || 0}}</td>
										<td class="drawer-td">¥{{goods.price || goods.unitPrice || 0}}</td>
										<td class="drawer-td drawer-td-amount">¥{{goods.subtotal || goods.totalAmount || 0}}</td>
										<td class="drawer-td drawer-td-code">{{goods.orderCode || goods.accountCode || '-'}}</td>
									</tr>
								</tbody>
								<tbody v-if="!goodsList || goodsList.length === 0">
									<tr>
										<td colspan="6" class="drawer-td-empty">
											<view class="empty-state">
												<text>暂无订单记录</text>
											</view>
										</td>
									</tr>
								</tbody>
							</table>
						</scroll-view>
					</view>
				</view>
				</slot> <!-- 抽屉内容插槽 -->
			</view>
		</view>

	</div>
</template>

<script>
	import letsgofishingTab from '@/components/letsgofishing-Tab/letsgofishing-Tab.vue'
	import tableApi from '../../api/table/tableApi'
	import dutyApi from '../../api/duty/duty'
	export default {
		data() {
			return {
				// title: '代销利润统计表',
				time_select_type: 3, //1:自定义 2:本周 3:今日
				showDrawer: false,
				currentTab: 1,
				currentCompanyId: "",
				tableScrollHeight: 0,
				windowHeight: 0, // 窗口高度
				leftScrollHeight: 0, // 左侧滚动区域高度
				selectAssistBatchDetail: "", //选中的代销批次明细
			tableStatic: {
			lossCount: 0,        // 报损记录数
			inventoryCount: 0,   // 盘点记录数
			profitCount: 0,      // 盘盈记录数
			lossStockCount: 0    // 盘亏记录数
		}, //统计数据
				expenseList: [], // 费用支出列表
				totalExpense: 0, // 总支出金额
				dataSelectBeiginTime: "", //选择开始时间
				dateSelectEndTime: "", //选择结束时间
				currentTableTab: 1, //右栏选择的表格类型tab
				batchProfitSimpleList: [], //批次利润简略列表
				employProfitList: [], //获取自营库存记录利润
				employProfitpageIndex: 1,
				tabValue: [{
					name: "代销车次",
					value: 1,
				}, {
					name: "代销货品",
					value: 2,
				}, {
					name: "自营货品",
					value: 3,
				}],
				vesionType: 1, // 获取版本类型，默认为1
				// 货品详情抽屉相关数据
				showGoodsDrawer: false,
				currentGoodsItem: null,
				goodsList: [] // 货品详情列表
			}
		},
		onLoad() {
			this.vesionType = uni.getStorageSync("vesionType");
			if(this.vesionType == 4){
				this.tabValue = [{
					name: "代销车次",
					value: 1,
				}, {
					name: "代销货品",
					value: 2,
				}, {
					name: "自营货品",
					value: 3,
				}];
			}
			else if(this.vesionType == 2){
				this.tabValue = [{
					name: "代销车次",
					value: 1,
				}, {
					name: "代销货品",
					value: 2,
				}];
			}
			else if(this.vesionType == 3){
				this.tabValue = [{
					name: "自营货品",
					value: 1,
				}];
			}
		},
		mounted() {
			this.currentCompanyId = uni.getStorageSync('companyId');

			//获取今日数据
			this.getTodayStatic()

			//获取批次利润简略列表
			this.getAssistProfitSimpleList();

			// 计算高度
			this.calculateHeight();
		},
		methods: {
			// 计算页面高度
			calculateHeight() {
				try {
					const systemInfo = uni.getWindowInfo();
					this.windowHeight = systemInfo.windowHeight;
					// 头部高度约 30rpx，转换为px约为 (30 / 750) * windowWidth
					// 但为了简单，直接使用固定值，头部实际高度约为 50-60px
					this.tableScrollHeight = this.windowHeight - 60; // 减去头部高度
					this.leftScrollHeight = this.windowHeight - 60; // 左侧滚动区域高度
				} catch (e) {
					// 降级处理
					uni.getSystemInfo({
						success: (res) => {
							this.windowHeight = res.windowHeight;
							this.tableScrollHeight = res.windowHeight - 60;
							this.leftScrollHeight = res.windowHeight - 60;
						}
					});
				}
			},
			//获取单个代销批次信息(包含利润计算)
			getAssistBatchDetail(batchId) {
				tableApi.GetSingleAssistBatchInfoAndProfit(batchId).then(res => {
					console.log("res", res)
					this.selectAssistBatchDetail = res.data;
				})
			},
			//切换时间选择
			changeTimeTab(item) {
				this.time_select_type = item;
				if (this.time_select_type === 1) {

				} else if (this.time_select_type === 2) {
					this.getMoneyStatic()
				} else if (this.time_select_type === 3) {
					this.getTodayStatic()
				}
				this.refreshBatchStatic()
			},
			// 获取本月数据
			getMoneyStatic() {
				const today = new Date();

				// 获取本月第一天（yyyy-mm-dd格式）
				const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
				const firstDayStr = [
					firstDay.getFullYear(),
					String(firstDay.getMonth() + 1).padStart(2, '0'),
					String(firstDay.getDate()).padStart(2, '0')
				].join('-');

				// 获取本月最后一天（yyyy-mm-dd格式）
				const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
				const lastDayStr = [
					lastDay.getFullYear(),
					String(lastDay.getMonth() + 1).padStart(2, '0'),
					String(lastDay.getDate()).padStart(2, '0')
				].join('-');

				// 设置日期范围
				this.dataSelectBeiginTime = firstDayStr;
				this.dateSelectEndTime = lastDayStr;

				// 调用获取数据的方法
				this.getTableStatic();
			},
			//获取今日数据
			getTodayStatic() {
				const today = new Date();

				// 获取年月日时分秒
				const year = today.getFullYear();
				const month = String(today.getMonth() + 1).padStart(2, '0'); // 补零
				const day = String(today.getDate()).padStart(2, '0');
				const hours = String(today.getHours()).padStart(2, '0');
				const minutes = String(today.getMinutes()).padStart(2, '0');
				const seconds = String(today.getSeconds()).padStart(2, '0');

				this.dataSelectBeiginTime = `${year}-${month}-${day}`;
				this.dateSelectEndTime = `${year}-${month}-${day}`;
				// 今天的开始时间（00:00:00）
				// 调用获取数据的方法
				this.getTableStatic();
			},
		//获取统计数据
		getTableStatic() {
			const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
			const endTime = `${this.dateSelectEndTime} 23:59:59`;
			tableApi.GetBusinessSummaryStatic(this.currentCompanyId, beginTime, endTime).then(res => {
				console.log("res", res)
				this.tableStatic = res.data
			})
			// 同时获取费用支出数据
			this.getExpenseData();
		},
		
		// 获取费用支出数据
		getExpenseData() {
			const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
			const endTime = `${this.dateSelectEndTime} 23:59:59`;
			
			dutyApi.getDutySpendCostByCompanyIdAndTimeRange(this.currentCompanyId, beginTime, endTime)
				.then(res => {
					if (res.code === 200 && res.data) {
						// 只保留 spendStatus 为 1（支出）的记录
						this.expenseList = res.data.filter(item => item.spendStatus === 1);
						
						// 计算总支出金额
						this.totalExpense = this.expenseList.reduce((total, item) => {
							return total + (item.spendMoney || 0);
						}, 0);
					} else {
						this.expenseList = [];
						this.totalExpense = 0;
					}
				})
				.catch(error => {
					console.error('获取费用支出数据失败:', error);
					this.expenseList = [];
					this.totalExpense = 0;
				});
		},
		tabChange(e) {
			this.currentTableTab = e.value
			this.refreshBatchStatic()
		},
		//右边货品刷新
		refreshBatchStatic(){
			// 先清空数据，避免显示旧数据
			this.batchProfitSimpleList = []
			
			if (this.currentTableTab === 1) {
				this.getAssistProfitSimpleList()
			} else if (this.currentTableTab === 3) {
				this.GetEmployCommodityStatic()
			}else if(this.currentTableTab === 2){
				this.getAssistCommodityStatic()
			}
		},
			//获取批次利润简略列表
			getAssistProfitSimpleList() {
				const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
				const endTime = `${this.dateSelectEndTime} 23:59:59`;
				tableApi.getBatchProfitSimpleByCompanyId(this.currentCompanyId,beginTime,endTime).then(res => {
					this.batchProfitSimpleList = res.data

					this.batchProfitSimpleList = this.batchProfitSimpleList.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
				})
			},
			//获取自营商品简略列表
			GetEmployCommodityStatic() {
				const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
				const endTime = `${this.dateSelectEndTime} 23:59:59`;
				tableApi.GetEmployCommodityStatic(this.currentCompanyId,beginTime,endTime).then(res => {
					console.log("GetEmployCommodityStatic.res", res)
					this.batchProfitSimpleList = res.data
					// this.employProfitList.push()
				})
			},
			//获取代销商品简略列表
			getAssistCommodityStatic() {
				console.log("getAssistCommodityStatic")
				const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
				const endTime = `${this.dateSelectEndTime} 23:59:59`;
				tableApi.getAssistCommodityStatic(this.currentCompanyId,beginTime,endTime).then(res => {
					console.log("getAssistCommodityStatic.res", res)
					this.batchProfitSimpleList = res.data
					// this.employProfitList.push()
				})
			},
			//关闭抽屉
			closeDrawer() {
				this.showDrawer = false;
			},
			//打开抽屉
			openAssistDrawer(batchId) {
				console.log("batchId", batchId)
				this.getAssistBatchDetail(batchId);
				this.showDrawer = true;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			//tab切换方法
			changeTab(e) {
				console.log("E", e)
			},
			// 打开货品详情抽屉
			openGoodsDrawer(item) {
				this.currentGoodsItem = item;
				if (this.currentTableTab === 3) {
					this.getEmployGoods(item.id);
				} else if (this.currentTableTab === 2) {
					this.getAssistGoods(item.id);
				}
			},
			// 获取自营货品详情
			getEmployGoods(commodityId) {
				const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
				const endTime = `${this.dateSelectEndTime} 23:59:59`;
				
				tableApi.getEmployGoodsByCommodityIdAndTime(this.currentCompanyId, commodityId, beginTime, endTime).then(res => {
					console.log("getEmployGoods res:", res);
					this.goodsList = res.data || [];
					this.showGoodsDrawer = true;
				}).catch(err => {
					console.error("获取自营货品详情失败:", err);
					uni.showToast({
						title: '获取货品详情失败',
						icon: 'none'
					});
				});
			},
			// 获取代销货品详情
			getAssistGoods(commodityId) {
				const beginTime = `${this.dataSelectBeiginTime} 00:00:00`;
				const endTime = `${this.dateSelectEndTime} 23:59:59`;
				
				tableApi.getAssistGoodsByCommodityIdAndTime(this.currentCompanyId, commodityId, beginTime, endTime).then(res => {
					console.log("getAssistGoods res:", res);
					this.goodsList = res.data || [];
					this.showGoodsDrawer = true;
				}).catch(err => {
					console.error("获取代销货品详情失败:", err);
					uni.showToast({
						title: '获取货品详情失败',
						icon: 'none'
					});
				});
			},
			// 关闭货品详情抽屉
			closeGoodsDrawer() {
				this.showGoodsDrawer = false;
				this.currentGoodsItem = null;
				this.goodsList = [];
			}
		}
	}
</script>

<style>
	/* 固定页面，禁止滚动 */
	page {
		height: 100%;
		overflow: hidden;
	}
	
	.space {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	.space-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 15px;
		background: #ffffff;
		border-bottom: 1px solid #e9ecef;
		height: 30rpx;
	}

	.space-header .title {
		font-size: 18rpx;
		font-weight: bold;
		color: #333333;
		margin-left: 10rpx;
	}

	.time-select-show {
		display: grid;
		grid-auto-flow: column;
		/* 强制子元素横向排列 */
		justify-content: center;
		align-items: center;
		color: #00aaff;
		width: 100%;
		/* 确保宽度足够 */
	}

	.time-select-card {
		display: flex;
		margin-left: auto;
		background-color: #f5f5f5;
		padding: 2rpx;
		border-radius: 5rpx;
	}

	.time-btn {
		width: 100rpx;
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		color: #666666;
		font-weight: bold;
		background-color: #f5f5f5;
		border-radius: 0;
		border: 0;
		font-size: 15rpx;
	}

	.time-btn-active {
		background: #00aaff;
		color: white;
		border-radius: 5rpx;
	}

	.space-content {
		display: flex;
		/* 启用 Flexbox 布局 */
		justify-content: space-between;
		/* 左右两边分开 */
		width: 100%;
		/* 确保容器宽度足够 */
		background-color: #f8f9fa;
		padding: 1rpx;
		flex: 1;
		overflow: hidden;
	}

	.left-side {
		/* 左边样式，可以根据需要调整宽度 */
		width: 50%;
		padding: 2rpx;
		/* 留一些间隙 */
		height: 100%;
		overflow: hidden;
	}
	
	.left-side-scroll {
		width: 100%;
		/* height 由动态绑定控制 */
	}

	.right-side {
		/* 右边样式，可以根据需要调整宽度 */
		width: 50%;
		/* 留一些间隙 */
		padding: 2rpx;
		height: 100%;
		overflow: hidden;
	}

	.left-side-card1 {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease, transform 0.2s ease;
	}
	
	.left-side-card1:hover {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}

	.left-side-card1 .card-body{
		display: flex;
		
		.card-grid{
			font-weight: bold;
			font-size: 10rpx;
			margin-top: auto;
			flex: 1;
			background-color: #f5f5f5;
			border-radius: 5px;
			margin: 10rpx;
			padding: 10rpx;
			padding-left: 5rpx;
			 display: flex;  
			justify-content: space-between;
			
		}
	}

	.left-side-card1 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #e9ecef;
	}

	.left-side-card1 .card-header .left {
		flex: 1;
		color: #888888;
		font-size: 12rpx;
		font-weight: bold;
	}

	.left-side-card1 .card-header .right {
		flex: 1;
		text-align: right;
		color: #00aaff;
		font-size: 15rpx;
		font-weight: bold;
	}

	.left-side-card2 {
		background-color: white;
		min-height: 100rpx;
		max-height: 180rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease, transform 0.2s ease;
	}
	
	.left-side-card2:hover {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}


	.left-side-card2 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #e9ecef;
	}

	.left-side-card2 .card-header .left {
		flex: 1;
		color: #888888;
		font-size: 12rpx;
		font-weight: bold;
	}

	.left-side-card2 .card-header .right {
		flex: 1;
		text-align: right;
		color: #00aa00;
		font-size: 15rpx;
		font-weight: bold;
	}
	
	.left-side-card2 .card-body {
		padding: 5rpx 10rpx;
	}
	
	.expense-scroll {
		width: 100%;
	}
	
	.expense-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4rpx 8rpx;
		background-color: #f5f5f5;
		border-radius: 4rpx;
		margin-bottom: 4rpx;
		font-size: 10rpx;
	}
	
	.expense-item:last-child {
		margin-bottom: 0;
	}
	
	.expense-name {
		flex: 1;
		color: #666;
		font-weight: 500;
	}
	
	.expense-amount {
		color: #00aa7f;
		font-weight: bold;
		margin-left: 10rpx;
	}

	.left-side-card3 {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease, transform 0.2s ease;
	}
	
	.left-side-card3:hover {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}


	.left-side-card3 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #e9ecef;
	}

	.left-side-card3 .card-header .left {
		flex: 1;
		color: #888888;
		font-size: 12rpx;
		font-weight: bold;
	}

	.left-side-card3 .card-header .right {
		flex: 1;
		text-align: right;
		color: #ffaa00;
		font-size: 15rpx;
		font-weight: bold;
	}

	.left-side-card4 {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease, transform 0.2s ease;
	}
	
	.left-side-card4:hover {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}
	
	/* 卡片5 - 其他统计 */
	.left-side-card5 {
		background-color: white;
		height: 160rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
		margin-bottom: 3rpx;
		margin-bottom: 5rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease, transform 0.2s ease;
	}
	
	.left-side-card5:hover {
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
		transform: translateY(-2rpx);
	}
	
	.left-side-card5 .card-body-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
		height: calc(100% - 40rpx); /* 减去header高度 */
		overflow: hidden;
	}
	
	.left-side-card5 .grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8rpx;
		background-color: #fafafa;
		transition: background-color 0.2s ease;
	}
	
	.left-side-card5 .grid-item:hover {
		background-color: #f0f0f0;
	}
	
	.left-side-card5 .grid-item-label {
		font-size: 11rpx;
		font-weight: 600;
		margin-bottom: 4rpx;
	}
	
	.left-side-card5 .grid-item-value {
		font-size: 16rpx;
		font-weight: bold;
		color: #333;
	}
	
	.left-side-card5 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #e9ecef;
	}
	
	.left-side-card5 .card-header .left {
		flex: 1;
		color: #888888;
		font-size: 12rpx;
		font-weight: bold;
	}
	
	.left-side-card5 .card-header .right {
		flex: 1;
		text-align: right;
		color: #9c27b0;
		font-size: 15rpx;
		font-weight: bold;
	}
	
	.left-side-card4 .card-body{
		display: flex;
		
		.grid {
			flex: 1;
			display: flex;
			justify-content: space-between;
			background-color: #f5f5f5;
			margin: 10rpx;
			border-radius: 5px;
			padding: 15rpx;
			font-weight: bold;
			font-size: 13rpx;
		}
		
	}


	.left-side-card4 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #e9ecef;
	}

	.left-side-card4 .card-header .left {
		flex: 1;
		color: #888888;
		font-size: 12rpx;
		font-weight: bold;
	}

	.left-side-card4 .card-header .right {
		flex: 1;
		text-align: right;
		color: #aa0000;
		font-size: 15rpx;
		font-weight: bold;
	}

	.right-side-card {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
		height: 100%;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(0, 0, 0, 0.05);
		transition: box-shadow 0.3s ease;
	}

	.right-side-card .header {
		height: 50rpx;
		padding: 10rpx;
		border-bottom: 2rpx solid #e9ecef;
	}

	/* 紧凑型表格头部 */
	.compact-table-header {
		display: flex;
		padding: 6rpx 8rpx;
		font-weight: 600;
		font-size: 14rpx;
		color: #666;
		background: #fafafa;
		border-bottom: 2rpx solid #e0e0e0;
	}
	
	/* 紧凑型表格行 */
	.compact-table-row {
		display: flex;
		padding: 5rpx 8rpx;
		font-size: 13rpx;
		color: #333;
		border-bottom: 1rpx solid #f0f0f0;
		transition: background-color 0.2s ease;
		align-items: center;
		min-height: 40rpx;
	}
	
	.compact-table-row:active {
		background-color: #f8f8f8;
	}
	
	/* 文本溢出省略 */
	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	/* 行子文本 */
	.row-sub-text {
		font-size: 11rpx;
		color: #999;
		margin-top: 2rpx;
	}
	
	/* 时间显示 */
	.row-time {
		font-size: 12rpx;
		color: #666;
	}
	
	/* 时间日期（两行显示） */
	.row-time-date {
		font-size: 13rpx;
		color: #333;
		font-weight: 500;
		line-height: 1.2;
	}
	
	.row-time-hour {
		font-size: 11rpx;
		color: #999;
		margin-top: 2rpx;
		line-height: 1.2;
	}
	
	/* 紧凑型状态标签 */
	.compact-status-tag {
		font-size: 11rpx;
		font-weight: 600;
		color: var(--status-color, #666);
		background: var(--status-bg, #f5f5f5);
		padding: 2rpx 6rpx;
		border-radius: 3rpx;
	}
	
	/* 金额显示 */
	.row-amount {
		text-align: right;
		font-weight: 600;
		font-size: 14rpx;
		color: #00aaff;
	}
	
	/* 重量显示 */
	.row-weight {
		text-align: center;
		font-size: 13rpx;
		color: #666;
	}
	
	/* 保留旧样式以防其他地方使用 */
	.step1-table-header {
		display: flex;
		margin: 5rpx;
		font-weight: bold;
		color: #868686;
		margin-top: 10rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #dddddd;
	}

	.step1-table-content-item {
		display: flex;
		margin: 5rpx;
		font-weight: bold;
		color: #000000;
		margin-top: 10rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #dddddd;
	}

	.step1-table-content-item-saleStatus {
		border-radius: 5rpx;
		color: white;
		background-color: var(--sale-status-color, #e9ecef);
		padding: 3rpx;
	}

	/* 抽屉容器 */
	.drawer-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		/* 初始不允许交互 */
		z-index: 999;
		margin-top: 40rpx;
		height: calc(100% - 40rpx);
	}

	/* 遮罩层 */
	.drawer-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	.drawer-mask.show {
		opacity: 1;
		pointer-events: auto;
		/* 显示时允许点击 */
	}

	/* 抽屉内容 */
	.drawer-content {
		position: absolute;
		top: 0;
		right: -100%;
		/* 初始隐藏在右侧 */
		width: 75%;
		/* 抽屉宽度 */
		height: 100%;
		background: #f5f5f5;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		pointer-events: auto;
	}

	.drawer-content.show {
		transform: translateX(-100%);
		/* 从右向左滑出 */
	}

	/* 抽屉头部 */
	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15rpx 20rpx;
		background: white;
		border-bottom: 1rpx solid #e5e5e5;
	}
	
	.drawer-header-left {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}
	
	.drawer-title {
		font-size: 16rpx;
		font-weight: 600;
		color: #333;
	}
	
	/* 抽屉信息卡片 */
	.drawer-info-card {
		background: white;
		padding: 15rpx 20rpx;
		margin: 10rpx;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}
	
	.info-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
	
	.info-label {
		font-size: 12rpx;
		color: #999;
		margin-right: 8rpx;
	}
	
	.info-value {
		font-size: 14rpx;
		font-weight: 600;
		color: #333;
	}
	
	.info-time {
		font-size: 12rpx;
		color: #999;
	}
	
	.info-stat {
		font-size: 13rpx;
		color: #666;
	}
	
	/* 抽屉状态标签 */
	.drawer-status-tag {
		font-size: 11rpx;
		font-weight: 600;
		color: var(--status-color, #666);
		background: var(--status-bg, #f5f5f5);
		padding: 3rpx 10rpx;
		border-radius: 4rpx;
		margin-left: 10rpx;
	}
	
	/* 抽屉表格包装器 */
	.drawer-table-wrapper {
		margin: 10rpx;
		background: white;
		border-radius: 8rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}
	
	.drawer-scroll-area {
		width: 100%;
		overflow: auto;
	}
	
	/* 抽屉表格 */
	.drawer-table {
		width: 100%;
		min-width: 550rpx;
		border-collapse: collapse;
		background: white;
	}
	
	.drawer-thead {
		background: #fafafa;
		position: sticky;
		top: 0;
		z-index: 2;
	}
	
	.drawer-th {
		padding: 10rpx 8rpx;
		text-align: center;
		font-size: 12rpx;
		font-weight: 600;
		color: #666;
		border-bottom: 2rpx solid #e5e5e5;
		white-space: nowrap;
	}
	
	.drawer-tr {
		transition: background-color 0.2s ease;
	}
	
	.drawer-tr:hover {
		background: #fafafa;
	}
	
	.drawer-td {
		padding: 8rpx 8rpx;
		text-align: center;
		font-size: 13rpx;
		color: #333;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.drawer-td-name {
		text-align: left;
		font-weight: 500;
	}
	
	.drawer-td-time {
		font-size: 12rpx;
		color: #999;
	}
	
	.drawer-td-amount {
		font-weight: 600;
		color: #00aaff;
	}
	
	.drawer-td-code {
		font-size: 11rpx;
		color: #999;
	}
	
	.drawer-td-empty {
		padding: 0;
		border: none;
	}
	
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60rpx 20rpx;
		color: #bbb;
		font-size: 13rpx;
	}
	
	/* 可点击项样式 */
	.clickable-item {
		cursor: pointer;
		transition: background-color 0.2s ease;
	}
	
	.clickable-item:hover {
		background-color: rgba(0, 170, 255, 0.1);
	}
</style>