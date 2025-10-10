<template>
	<div :style="{'display': 'flex', 'height': (WindowHeight-65)+'px',width:'100%' }">
		<div style="width: 120rpx; background-color: #ffffff;display: flex;">
			<div>
					<div style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;">
						<div style="align-items: left;">
							<button
								style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
								@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
									color="#ffffff" style="margin-right: 5px;"></uni-icons>返回</button>
						</div>
					</div>
				<!-- 圆弧边卡片 -->
				<div style="display: flex; flex-direction: column; gap: 5rpx;margin-top: 5rpx;">
					<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-150 + 'px' }">
						<div v-for="item in orderList" @click="exchangeBatch(item)" :key="item.id" :style="{
	       marginLeft: '10rpx',
		   marginRight: '5rpx',
		   marginTop:'10px',
	       width: '100rpx',
	       backgroundColor: selectBatch.id === item.id ? '#00aaff' : '#ffffff', // 浅绿色或白色
	       borderRadius: '12rpx',
	       boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
	       padding: '10rpx',
	       boxSizing: 'border-box',
	       textAlign: 'left',
	       fontSize: '14rpx',
	       color: selectBatch.id === item.id ? '#ffffff' : '#000000'
	     }">
							<div>
								<text style="font-size: 15rpx; font-weight: bold;">
									{{ item.shipperName }}
								</text>
								<br>
								<text style="font-size: 12rpx; font-weight: bold;">
									{{ item.purchaseOrderCode }}
								</text>
							</div>
						</div>
					</scroll-view>
				</div>
			</div>
			<!-- 垂直线 -->
			<div style="width: 5rpx; background-color: #ccc; "></div>
		</div>
		<div style="width: 100%;; background-color: #ffffff; text-align: right;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;" v-if="selectBatch!=null"><text
						style="margin-right: 5rpx;">{{selectBatch.shipperName}}</text><text>{{selectBatch.batchCode}}</text>
					<text v-if="selectBatch.saleStatus===2"
						style="font-size: 10rpx; border: 1px solid green; border-radius: 4rpx; color: green; margin-left: 5rpx;">已结算</text>
					<text style="margin-left: 50rpx;font-size: 10rpx;"
						v-if="selectBatch!=null">创建时间:{{(selectBatch.createTime).replace("T"," ")}}</text>
				</div>
				<div style="text-align: right;display: flex;" v-if="selectBatch">

				</div>
			</div>
			<div style="margin-left: 5rpx;margin-right: 5rpx;">
				<!-- 表头 -->
				<div
					style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
					<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">货品</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">已售数量</div>
					<div style="flex: 2; padding: 8px; text-align: center;border-right: 1px solid #f4f4f4; ">已售重量 / 入库重量
					</div>
					<div style="flex: 2; padding: 8px; text-align: center;">剩余库存 / 入库数量</div>
				</div>
				<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-170 + 'px' }">
					<!-- 表格内容行 -->
					<div style="display: flex; border: 1px solid #ddd;" v-if="BatchCommodityList.length>0"
						v-for="item in BatchCommodityList">
						<div
							style="flex: 3; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{item.commodityName}}
						</div>

						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{item.saleMountStr===""?0:item.saleMountStr}}
						</div>
						<div
							style="flex: 2; padding: 8px; text-align: center;font-weight: bold;border-right: 1px solid #ddd;">
							<!-- ( {{item.weightSold}} ) / {{item.initWeight}} 斤 -->
						</div>
						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							( {{item.inventMountStr}} ) / {{item.initMountStr}}
						</div>
					</div>
					<div style="display: flex; border: 1px solid #ddd;"  v-if="BatchCommodityList.length!=0">
						<div style="flex: 3; padding: 8px;text-align: center;font-weight: bold;">
							总计：
						</div>

						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							{{totalInventorySold()}}
						</div>
						<div style="flex: 2; padding: 8px; text-align: center;font-weight: bold;">
							( {{totalWeightSold()}} ) / {{totalInitWeight() }}
						</div>
						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							( {{totalInventory()}} ) / {{totalInitInventory()}}
						</div>
					</div>
					<div style="height: 100rpx;" v-if="BatchCommodityList.length==0">
						<div style=" margin-top: 40rpx; text-align: center;">
							<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
							<div style="margin-top: 10px; color: #969696;font-weight: bold;">无货品</div> <!-- 添加的文字 -->
						</div>
					</div>
				</scroll-view>
			</div>

		</div>
	</div>
</template>

<script>
	import purchase from '../../api/purchase/purchase.js'
	export default {
		data() {
			return {
				BatchAddshow: false,
				ShipperAddshow: false,
				companyId: "",
				shipperAddedName: "",
				shipperList: [],
				shipperSelectedId: "",
				batshNewCode: "",
				copyLastBatch: true,
				selectBatch: null,
				orderList: [],
				BatchCommodityList: [],
				WindowHeight: 0,
			}
		},
		onShow() {},
		mounted() {
			this.companyId = uni.getStorageSync('companyId');
			// this.getallShipper();
			this.getPurchaseOrder();
			this.WindowHeight = uni.getWindowInfo().windowHeight;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			totalInitInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initInventory) || 0);
				}, 0);
			},
			totalInventorySold() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inventorySold) || 0);
				}, 0);
			},

			totalInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inventory) || 0);
				}, 0);
			},

			totalWeightSold() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.weightSold) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initWeight) || 0);
				}, 0);
			},
			exchangeBatch(item) {
				this.selectBatch = item;
				this.getOrderCommodityList(item.id);
			},
			getOrderCommodityList(id) {
				purchase.GetCommodityByPurchaseOrderId(id).then(res => {
					this.BatchCommodityList = res.data;
					for (var i = 0; i < this.BatchCommodityList.length; i++) {
						this.BatchCommodityList[i].saleMountStr = "";
						this.BatchCommodityList[i].initMountStr = "";
						this.BatchCommodityList[i].inventMountStr = "";
						for (var j = 0; j < this.BatchCommodityList[i].salePurchaseInventories.length; j++) {
							this.BatchCommodityList[i].saleMountStr += this.BatchCommodityList[i]
								.salePurchaseInventories[j].mount + this.BatchCommodityList[i]
								.salePurchaseInventories[j].specName + " "
						}
						for (var j = 0; j < this.BatchCommodityList[i].initPurchaseInventories.length; j++) {
							this.BatchCommodityList[i].initMountStr += this.BatchCommodityList[i]
								.initPurchaseInventories[j].mount + this.BatchCommodityList[i]
								.initPurchaseInventories[j].specName + " "
						}
						for (var j = 0; j < this.BatchCommodityList[i].outPutPurchaseInventories.length; j++) {
							this.BatchCommodityList[i].inventMountStr += this.BatchCommodityList[i]
								.outPutPurchaseInventories[j].mount + this.BatchCommodityList[i]
								.outPutPurchaseInventories[j].specName + " "
						}
					}
				})
			},
			changAddedBatchCode(id) {
				this.shipperSelectedId = id;
				this.getBatchNewCodeByShipperId(id);
			},

			getPurchaseOrder() {
				purchase.getPurchaseOrderByCompanyId(this.companyId).then(res => {
					this.orderList = res.data.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
					if (this.orderList.length > 0) {
						this.selectBatch = this.orderList[0];
						this.getOrderCommodityList(this.selectBatch.id);
					}
				})
			},
			AddShipper() {
				if (this.shipperAddedName == null || this.shipperAddedName == "") return;
				var data = {
					CompanyId: this.companyId,
					ShipperName: this.shipperAddedName
				}
				category.AddShipper(data).then(res => {
					this.ShipperAddshow = false;
					this.getallShipper();
				})
			},
			shipperSelect(e) {
				this.shipperSelectedId = e;
				this.getBatchNewCodeByShipperId(e);
			},
			getBatchNewCodeByShipperId(Id) {
				category.GetNewBatchCode(this.companyId, Id).then(res => {
					this.batshNewCode = res.data
				})
			}
		}

	}
</script>

<style>
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
</style>