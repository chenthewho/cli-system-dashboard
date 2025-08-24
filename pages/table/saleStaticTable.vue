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
				<text class="title">进销存统计表</text>
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
						<view class="time-btn" :class="currentTableTab===1?'time-btn-active':none"
							@click="changeTimeTab(1)">自定义</view>
						<view class="time-btn" :class="currentTableTab===2?'time-btn-active':none"
							@click="changeTimeTab(2)">本月</view>
						<view class="time-btn" :class="currentTableTab===3?'time-btn-active':none"
							@click="changeTimeTab(3)">今日</view>
					</view>
				</view>
			</view>
		</div>

		<view class="space-content">
			<view class="table-container">
				<!-- 表格标题 -->
				<view class="table-title">
					
				</view>

				<!-- 表头 -->
				<view class="table-header">
					<view class="header-cell" style="flex: 2;">商品名称</view>
					<view class="header-cell">单价</view>
					<view class="header-cell">销量</view>
					<view class="header-cell">销售额</view>
				</view>

				<!-- 表格内容 -->
				<view class="table-body">
					<view class="table-row" v-for="item in goodsList" key="id">
						<view class="body-cell" style="flex: 2;">{{item.name}}</view>
						<view class="body-cell">{{item.price}}元</view>
						<view class="body-cell">{{item.sales}}件</view>
						<view class="body-cell">{{item.total}}元</view>
					</view>

					<!-- 空状态 -->
					<view class="empty-tip" v-if="goodsList.length === 0">
						<image src="/images/empty.png" mode="aspectFit"></image>
						<text>暂无数据</text>
					</view>
				</view>

				<!-- 表格底部统计 -->
				<view class="table-footer">
					<view class="footer-cell">总计：</view>
					<view class="footer-cell">{{totalSales}}件</view>
					<view class="footer-cell">{{totalAmount}}元</view>
				</view>
			</view>
	
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// title: '代销利润统计表',
				dataSelectBeiginTime: "", //选择开始时间
				dateSelectEndTime: "", //选择结束时间
				currentTableTab: 1, //右栏选择的表格类型tab
				goodsList: [{
						id: 1,
						name: '苹果 iPhone 13',
						price: 5999,
						sales: 120,
						total: 719880
					},
					{
						id: 2,
						name: '小米 12 Pro',
						price: 4699,
						sales: 85,
						total: 399415
					},
					{
						id: 3,
						name: '华为 Mate 40',
						price: 4999,
						sales: 63,
						total: 314937
					}
				],
				totalSales: 268,
				totalAmount: 1434232
			}
		},
		onLoad() {
			this.getTodayStatic();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
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
			}
		}
	}
</script>

<style>
	/* 表格容器 */
	.table-container {
		width: 100%;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		margin: 20px 0;
	}

	/* 表格标题 */
	.table-title {
		padding: 16px;
		background-color: #f8f8f8;
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		border-bottom: 1px solid #eee;
	}

	/* 表头样式 */
	.table-header {
		display: flex;
		background-color: #409EFF;
		color: white;
	}

	.header-cell {
		flex: 1;
		padding: 12px 8px;
		text-align: center;
		font-weight: bold;
	}

	/* 表格内容 */
	.table-body {
		background-color: #fff;
	}

	.table-row {
		display: flex;
		border-bottom: 1px solid #f0f0f0;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.body-cell {
		flex: 1;
		padding: 12px 8px;
		text-align: center;
		color: #606266;
	}

	/* 空状态提示 */
	.empty-tip {
		padding: 40px 0;
		text-align: center;
		color: #909399;
	}

	.empty-tip image {
		width: 100px;
		height: 100px;
		margin-bottom: 10px;
	}

	/* 表格底部 */
	.table-footer {
		display: flex;
		background-color: #fafafa;
		padding: 12px 0;
		font-weight: bold;
	}

	.footer-cell {
		flex: 1;
		text-align: center;
	}

	.footer-cell:first-child {
		flex: 2;
		text-align: right;
		padding-right: 10px;
	}

	.space {}

	.space-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 15px;
		background: #ffffff;
		border-bottom: 1px solid #dddddd;
	}

	.space-header .title {
		font-size: 18rpx;
		font-weight: bold;
		color: #333333;
		margin-left: 10rpx;
	}

	.space-content {
		padding: 10rpx;
	}

	.time-btn {
		width: 100rpx;
		height: 30rpx;
		line-height: 30rpx;
		color: #868686;
		font-weight: bold;
		background: #cacaca;
		border-radius: 0;
		border: 0;
	}

	.time-btn-active {
		background: #00aaff;
		color: white;
		border-radius: 5rpx;
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
</style>