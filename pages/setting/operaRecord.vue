<template>
	<view>
		<u-navbar title="操作记录" @rightClick="rightClick" :autoBack="true" leftText="返回">
		</u-navbar>
		<div class="settings-container">
			<view class="container" style="margin-top: 50px;">
				<view class="left-part">
					<view>
						<u-subsection :list="list" :current="tabs1Current" style="width: 390rpx;"
							@change="sectionChange"></u-subsection>
					</view>
					<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
						<view v-for=" item in moduleList" style=" display: flex;">
							<view
								style="width: 380rpx; height: 50rpx;background-color:white;margin-left: 5rpx;margin-right: 5rpx;margin-top: 10rpx; border-radius: 10rpx;"
								@click="handleClickRecord(item)">
								<view
									style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 2rpx;">
									<view style="text-align: left;padding-left: 5rpx;color: gray;">
										时间：{{item.createTime.replace("T"," ")}}</view>
									<view style="text-align: center;padding-right: 5rpx;font-weight: bold;">
										操作人:{{item.operatorName}}</view>
								</view>
								<view v-if="item.type!=6"
									style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
									<view style="text-align: left;padding-left: 5rpx;color: royalblue;font-weight: bold;">{{item.content}}</view>
								</view>
								<view v-else
									style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
									<view style="text-align: left;padding-left: 5rpx;color: darkred;font-weight: bold;">删除订单号：{{item.model.AccountCode}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="right-part">
					<view
						style="width: 90%;margin-left: 5%;margin-top:50rpx ;5px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);padding: 5rpx;"
						v-if="currentOrder">
						<div class="slot-content" style="display: flex; flex-wrap: wrap; gap: 10px;">
							<div style="flex: 1; min-width: 180rpx; text-align: left;margin-bottom: 10px;">创建时间:
								{{currentOrder.CreateTime ? currentOrder.CreateTime.replace("T", " ") : ""}}
							</div>
							<div style="flex: 1; min-width: 100rpx; text-align: left;margin-bottom: 10px;">订单号:
								{{currentOrder.AccountCode ? currentOrder.AccountCode : ""}}
							</div>
						</div>
						<div style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
							<div style="flex: 1; min-width: 100rpx; text-align: left;">顾客:
								{{currentOrder.CustomName ? currentOrder.CustomName : ""}}
							</div>
							<div style="flex: 1; min-width: 100rpx; text-align: left;">总计金额:
								{{currentOrder.PayableAmount ? currentOrder.PayableAmount : ""}}
							</div>
						</div>
						<div style="display: flex; flex-wrap: wrap; margin-bottom: 10px;">
							<div style="flex: 1; min-width: 100rpx; text-align: left;">实付金额:
								{{currentOrder.ActualMoney ? currentOrder.ActualMoney : ""}}
							</div>
							<div style="flex: 1; min-width: 100rpx; color: darkred; text-align: left;"
								v-if="currentOrder.Debt > 0">欠款: {{currentOrder.Debt}}</div>
						</div>
						<div class="table" v-if="currentCardInfo.length>0">
							<div class="table-row">
								<div class="table-header-cell">货品</div>
								<div class="table-header-cell">数量</div>
								<div class="table-header-cell">总重</div>
								<div class="table-header-cell">皮重</div>
								<div class="table-header-cell">单价</div>
								<div class="table-header-cell">小计</div>
							</div>
							<div class="table-row" v-for="item in currentCardInfo">
								<div class="table-cell">{{item.name}}</div>
								<div class="table-cell">{{item.mount}}</div>
								<div class="table-cell">{{item.totalWeight}}</div>
								<div class="table-cell">{{item.tareWeight}}</div>
								<div class="table-cell">{{item.referenceAmount}}</div>
								<div class="table-cell">{{item.subtotal}}</div>
							</div>
						</div>
					</view>
				</view>
			</view>

		</div>
	</view>
</template>

<script>
	import operaRecord from '../../api/operaRecord/operaRecord'
	export default {
		data() {
			return {
				currentCompanyId: "",
				baseFormData: {},
				list: ['还款', '还筐', '删除订单'],
				tabs1Current: 0,
				moduleList: [],
				scrollHeight: 0,
				currentOrder: null,
				currentCardInfo: []
			}
		},
		created() {},
		mounted() {
			this.currentCompanyId = uni.getStorageSync('companyId');
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 130;
			this.getRecordByType(2)
		},
		methods: {
			handleClickRecord(e) {
				this.currentOrder = null;
				this.currentCardInfo = [];
				if (e.type === 6) {
					this.currentOrder = JSON.parse(e.content);
					this.currentCardInfo = JSON.parse(this.currentOrder.Module);
				}
			},
			logout() {
				uni.removeStorageSync("userInfo");
				uni.removeStorageSync("companyId");
				uni.removeStorageSync("companyName");
				uni.reLaunch({
					url: '/pages/auth/login'
				});
			},
			sectionChange(e) {
				this.tabs1Current = e;
				if (e == 0) {
					this.getRecordByType(2)
				} else if (e == 1) {
					this.getRecordByType(3)
				} else if (e == 2) {
					this.getRecordByType(6)
				}
			},
			getRecordByType(type) {
				operaRecord.GetAllByCompanyIdAndType(this.currentCompanyId, type).then(res => {
					this.moduleList = res.data
					this.moduleList.forEach(x => {
						if (x.type === 6) {
							x.model = JSON.parse(x.content)
						}
					})
					this.moduleList.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime); // 升序排序
						// 如果需要降序排序，可以使用: return new Date(b.creatime) - new Date(a.creatime);
					});
				})
			}
		}
	}
</script>

<style scoped>
	.settings-container {
		padding: 20px;
		text-align: center;
	}


	.setting-item {
		margin: 15px 0;
	}

	.input-container {
		margin-left: 10%;
		width: 80%;
		display: flex;
		/* 使用 Flexbox 布局 */
		flex-direction: column;
		/* 垂直排列 */
		margin-bottom: 10px;
		/* 可选：添加下边距 */
	}

	.label {
		margin-bottom: 5px;
		/* 可选：添加标签与输入框之间的间距 */
		font-weight: bold;
		/* 可选：加粗标签文字 */
	}

	.input-field {
		padding: 10px;
		/* 可选：添加内边距 */
		border: 1px solid #ccc;
		/* 可选：设置边框 */
		border-radius: 5px;
		/* 可选：设置圆角 */
		width: 100%;
		height: 50px;
		/* 可选：设置输入框宽度 */
	}

	.container {
		display: flex;
		/* 使用 Flexbox 布局 */
		justify-content: space-between;
		/* 在左右两侧均匀分配空间 */
		padding: 10px;
		/* 可选：添加内边距 */
		background-color: transparent;
		/* 可选：设置背景颜色 */
		border-radius: 5px;
		/* 可选：设置圆角 */
	}

	.left-part {
		flex: 1;
		/* 左侧部分占据可用空间 */
		text-align: left;
		/* 左对齐 */
	}

	.right-part {
		flex: 1;
		/* 右侧部分占据可用空间 */
		text-align: right;
		/* 右对齐 */
	}

	.vertical-line {
		border-left: 2px solid gray;
		/* 设置竖线的颜色和宽度 */
		height: 600px;
		/* 设置竖线的高度 */
		margin: 0 10px;
		/* 设置竖线与文本之间的间距 */
	}

	.table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		margin: 20px 0;
	}

	.table-header {
		display: table-header-group;
		background-color: #f2f2f2;
	}

	.table-row {
		display: table-row;
	}

	.table-cell {
		display: table-cell;
		border: 1px solid #dddddd;
		padding: 8px;
		text-align: left;
	}

	.table-header-cell {
		display: table-cell;
		border: 1px solid #000000;
		padding: 8px;
		text-align: center;
		font-weight: bold;
		background-color: #dddddd;
	}

	button {
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 15px;
		cursor: pointer;
	}

	.scrollArea {
		height: calc(100vh - 60rpx);
	}
</style>