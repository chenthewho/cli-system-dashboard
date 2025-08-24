<template>
	<div class="space">
		<div class="space-header">

			<div style="flex: 1; display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;">
				<div style="align-items: left;">
					<button
						style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
						@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15" color="#ffffff"
							style="margin-right: 5px;"></uni-icons>返回</button>
				</div>
				<text class="title">营业统计表</text>
			</div>
			<view style="flex: 1;">
				<view style="display: flex;">
					<view class="time-select-show">
						<uni-datetime-picker v-model="dataSelectBeiginTime" type="date"
							style="font-weight: bold;margin-right: 40rpx;"><uni-icons custom-prefix="iconfont"
								type="icon-rili1" size="20" color="#000000"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>{{dataSelectBeiginTime}}</uni-datetime-picker>
						<uni-datetime-picker v-model="dateSelectEndTime" type="date" v-if="time_select_type===1"
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
				<!-- 左边内容 -->
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
						<view class="card-grid"><text class="left">销售数量</text><text class="right">0</text></view>
						<view class="card-grid"><text class="left">销售重量</text><text class="right">0</text></view>
						<view class="card-grid"><text class="left">优惠</text><text class="right">0</text></view>
					</view>
				</view>
				<!-- 卡片2-->
				<view class="left-side-card2">
					<view class="card-header">
						<view class="left">
							<uni-icons custom-prefix="iconfont" type="icon-zhichu" size="20" color="#00aa7f"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>总支出
						</view>
						<view class="right">
							0
						</view>
					</view>
				</view>

				<!-- 卡片3-->
				<view class="left-side-card3">
					<view class="card-header">
						<view class="left">
							<uni-icons custom-prefix="iconfont" type="icon-qitashourudan" size="20" color="#ffaa7f"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>其他收入
						</view>
						<view class="right">
							0
						</view>
					</view>
				</view>

				<!-- 卡片4-->
				<view class="left-side-card4">
					<view class="card-header">
						<view class="left">
							<uni-icons custom-prefix="iconfont" type="icon-coupons" size="20" color="#e20000"
								style="font-weight: bold; margin-left: 5rpx;margin-right: 5rpx;"></uni-icons>新增赊欠
						</view>
						<view class="right">
							{{
								tableStatic.debtMoney
							}}
						</view>
					</view>
					<view class="card-body">
						<view class="grid" style="background-color: #dddddd; color: darkred;" ><view>待付款</view><view >0</view></view>
						<view class="grid" style="background-color: #dddddd;color: green;"  ><view>还款</view><view>0</view></view>
					</view>
				</view>
			</view>
			<view class="right-side">
				<!-- 右边内容 -->
				<view class="right-side-card">
					<!--顶部tab-->
					<view class="header">

						<zb-tab :value="1" :data="tabValue" @click-tab="tabChange"></zb-tab>
					</view>

					<view class="content">
						<view v-if="currentTableTab===1||currentTableTab===3">
							<view class="step1-table-header">
								<view style="flex: 2;">
									车次/创建时间
								</view>
								<view style="flex: 1;text-align: center;">
									状态
								</view>
								<view style="flex: 1;text-align: center;">
									售额
								</view>
							</view>
							<view class="step1-table-content">
								<scroll-view class="step1-table-scrollArea" scroll-y="true"
									:style="{ height: tableScrollHeight + 'px' }">
									<view class="step1-table-content-item" v-for="simple in batchProfitSimpleList"
										@click="openAssistDrawer(simple.batchId)">
										<view style="flex: 2; display: flex;flex-direction: column">
											<view>
												{{simple.shipperName}}{{simple.batchCode}}
											</view>
											<view style="margin-top: 5rpx;color: #b0b0b0;">
												{{simple.createTime.replace("T"," ")}}
											</view>
										</view>
										<view
											style="flex: 1;display: flex; justify-content: center;align-items: center">
											<text v-if="simple.saleStatus===1"
												class="step1-table-content-item-saleStatus"
												style="--sale-status-color: #00aaff;">
												在售
											</text>
											<text v-if="simple.saleStatus===0"
												class="step1-table-content-item-saleStatus"
												style="--sale-status-color: #e74c3c;">
												停售
											</text>
											<text v-if="simple.saleStatus===2"
												class="step1-table-content-item-saleStatus"
												style="--sale-status-color: #00b900;">
												已结算
											</text>
										</view>
										<view
											style="flex: 1;display: flex; justify-content: center;align-items: center;font-size: 18rpx;">
											{{simple.cargoAmount}}
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
			<view class="drawer-mask" :class="{ 'show': showDrawer }" @tap="closeDrawer"></view>

			<!-- 抽屉内容 -->
			<view class="drawer-content" :class="{ 'show': showDrawer }">
				<slot>
					<view class="drawer-content-header">
						<view>
							<uni-icons custom-prefix="iconfont" type="icon-guanbi" size="25" color="#ca0000"
								style="font-weight: bold;margin-left: 10rpx;margin-right: 10rpx; "></uni-icons>
							<text>车次明细</text>
						</view>
					</view>
					<view class="drawer-content-header2">
						<view class="drawer-content-header2-title">
							货主：{{selectAssistBatchDetail.shipperName}} 车次：{{selectAssistBatchDetail.batchCode}} <text
								v-if="selectAssistBatchDetail.saleStatus===1" class="drawer-content-header2-status"
								style="--sale-status-color: #00aaff;">
								在售
							</text>
							<text v-if="selectAssistBatchDetail.saleStatus===0" class="drawer-content-header2-status"
								style="--sale-status-color: #e74c3c;">
								停售
							</text>
							<text v-if="selectAssistBatchDetail.saleStatus===2" class="drawer-content-header2-status"
								style="--sale-status-color: #00b900;">
								已结算
							</text>
						</view>
						<view class="drawer-content-header2-title2">
							创建时间:  {{selectAssistBatchDetail.createTime}}
						</view>
					</view>

					<view class="drawer-content-card">
						<view class="drawer-content-card-title">
							销售明细
						</view>
						<view class="drawer-content-table-content">
							<scroll-view class="drawer-content-scrollArea" scroll-y="true" scroll-x="true" >
							 <table border="1" class="drawer-content-table" >
							    <thead>
							      <tr class="drawer-content-table-header" >
							        <th  class="drawer-content-table-header-grid">货品</th>
							        <th  class="drawer-content-table-header-grid">销量</th>
							        <th  class="drawer-content-table-header-grid">均重</th>
							        <th  class="drawer-content-table-header-grid">均价</th>
							        <th  class="drawer-content-table-header-grid">货款</th>
							      </tr>
							    </thead>
							    <tbody>
							      <tr v-for="item in selectAssistBatchDetail.allPurchaseAssistList">
							        <td  class="drawer-content-table-grid" >{{item.commodityName}}</td>
							        <td class="drawer-content-table-grid" >{{item.saleMount}}</td>
							        <td class="drawer-content-table-grid" >---</td>
							        <td class="drawer-content-table-grid" >{{item.averagePrice}}</td>
							        <td class="drawer-content-table-grid" >{{item.saleSubTotal}}</td>
							      </tr>
							    </tbody>
								<tbody>
								  <tr >
								    <td  class="drawer-content-table-grid" >合计:</td>
								    <td class="drawer-content-table-grid" ></td>
								    <td class="drawer-content-table-grid" >---</td>
								    <td class="drawer-content-table-grid" ></td>
								    <td class="drawer-content-table-grid" ></td>
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
	export default {
		data() {
			return {
				// title: '代销利润统计表',
				time_select_type: 3, //1:自定义 2:本周 3:今日
				showDrawer: false,
				currentTab: 1,
				currentCompanyId: "",
				tableScrollHeight: 0,
				selectAssistBatchDetail: "", //选中的代销批次明细
				tableStatic: {}, //统计数据
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
					name: "自营车次",
					value: 3,
				}],
				vesionType: 1, // 获取版本类型，默认为1
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
					name: "自营车次",
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
					name: "自营车次",
					value: 1,
				}];
			}
		},
		mounted() {
			this.currentCompanyId = uni.getStorageSync('companyId');
			//获取批次利润简略列表
			this.getAssistProfitSimpleList();

			//获取今日数据
			this.getTodayStatic()

			this.tableScrollHeight = uni.getWindowInfo().windowHeight - 220;
		},
		methods: {
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
				if (this.time_select_type === 1) {} else if (this.time_select_type === 2) {
					this.getMoneyStatic()
				} else if (this.time_select_type === 3) {
					this.getTodayStatic()
				}
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
			},
			tabChange(e) {
				console.log("e", e)
				this.currentTableTab = e.value
				if (this.currentTableTab === 1) {
					this.getAssistProfitSimpleList()
				} else if (this.currentTableTab === 3) {
					this.getPurComProfitByComIdPage()
				}
			},
			//获取批次利润简略列表
			getAssistProfitSimpleList() {
				tableApi.getBatchProfitSimpleByCompanyId(this.currentCompanyId).then(res => {
					console.log("res", res)
					this.batchProfitSimpleList = res.data

					this.batchProfitSimpleList = this.batchProfitSimpleList.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
				})
			},
			//获取自营商品入库简略列表
			getPurComProfitByComIdPage() {
				tableApi.getPurchaseEmployOrderProfitSimple(this.currentCompanyId).then(res => {
					console.log("res", res)
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
			}
		}
	}
</script>

<style>
	.space {}

	.space-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 15px;
		background: #ffffff;
		border-bottom: 1px solid #dddddd;
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
		background-color: #dddddd;
		padding: 2rpx;
		border-radius: 5rpx;
	}

	.time-btn {
		width: 100rpx;
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		color: #868686;
		font-weight: bold;
		background-color: #dddddd;
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
		background-color: #dddddd;
		padding: 1rpx;
		height: calc(100% - 30rpx);
	}

	.left-side {
		/* 左边样式，可以根据需要调整宽度 */
		width: 50%;
		padding: 2rpx;
		/* 留一些间隙 */
	}

	.right-side {
		/* 右边样式，可以根据需要调整宽度 */
		width: 50%;
		/* 留一些间隙 */
		padding: 2rpx;
	}

	.left-side-card1 {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
	}

	.left-side-card1 .card-body{
		display: flex;
		
		.card-grid{
			font-weight: bold;
			font-size: 10rpx;
			margin-top: auto;
			flex: 1;
			background-color: lightgrey;
			border-radius: 10rpx;
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
		border-bottom: 1rpx solid #dddddd;
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
		height: 100rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
	}


	.left-side-card2 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #dddddd;
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

	.left-side-card3 {
		background-color: white;
		height: 100rpx;
		border-radius: 10rpx;
		margin-top: 3rpx;
	}


	.left-side-card3 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #dddddd;
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
	}
	
	.left-side-card4 .card-body{
		display: flex;
		
		.grid {
			flex: 1;
			display: flex;
			justify-content: space-between;
			margin: 10rpx;
			border-radius: 10rpx;
			padding: 15rpx;
			font-weight: bold;
			font-size: 13rpx;
		}
		
	}


	.left-side-card4 .card-header {
		display: flex;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #dddddd;
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
	}

	.right-side-card .header {
		height: 50rpx;
		padding: 10rpx;
		border-bottom: 2rpx solid #dddddd;
	}

	.right-side-card .content {}

	.step1-table-header {
		display: flex;
		margin: 5rpx;
		font-weight: bold;
		color: #868686;
		margin-top: 10rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #dddddd;
	}

	.step1-table-content {}

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
		background-color: var(--sale-status-color, #d8d8d8);
		/* 默认蓝色 */
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
		background: #cacaca;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		pointer-events: auto;
	}

	.drawer-content.show {
		transform: translateX(-100%);
		/* 从右向左滑出 */
	}

	.drawer-content-header {
		display: grid;
		align-items: center;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 12rpx;
		font-weight: bold;
		background-color: white;
		border-bottom: 1px solid #888888;
	}

	.drawer-content-header2 {
		height: 50rpx;
		font-size: 13rpx;
		font-weight: bold;
		background-color: white;
	}

	.drawer-content-header2-title {
		padding: 5rpx;
	}

	.drawer-content-header2-title2 {
		font-size: 9rpx;
		margin-left: 5rpx;
		margin-top: 5rpx;
		color: grey;
	}
	
	.drawer-content-header2-status {
		font-size: 10rpx;
		color: white;
		background-color: var(--sale-status-color, #d8d8d8);
		margin-left: 5rpx;
		padding: 2rpx;
		border-radius: 5rpx;
	}

	.drawer-content-card {
		height: 50rpx;
		font-size: 13rpx;
		font-weight: bold;
		background-color: white;
		margin-top: 20rpx;
		height: calc(100% - 140rpx);
	}
	.drawer-content-card-title {
		padding: 5rpx;
	}
	

	
	.drawer-content-table-content {
		padding: 10rpx;
	}
	
	.drawer-content-scrollArea {
		width: 300rpx;
			 box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
	}
	.drawer-content-table {
		width: 100%;
		border-collapse: collapse;
	}
	
	.drawer-content-table-header {
		background-color: #f5f5f5; 
		font-weight: bold;
	}
	
	.drawer-content-table-header-grid {
		padding: 8px; 
		text-align: center;
	}
	.drawer-content-table-grid {
		padding: 8px;
		text-align: center;
		font-weight: 100;
	}
</style>