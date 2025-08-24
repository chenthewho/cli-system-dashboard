<!--代销货品报损-->
<template>
	<div>
		<div style="display: flex; width: 100%;">
			<div style="width: 220rpx; background-color: #ffffff;display: flex;">
				<div>
					<div style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;margin-bottom: 10px;">
						<div style="align-items: left;">
							<button
								style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
								@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
									color="#ffffff" style="margin-right: 5px;"></uni-icons>返回</button>
						</div>
						<text style="font-size: 15rpx;font-weight: bold;color: #333;margin-left: 10rpx;">选择货品</text>
					</div>
					<!-- 圆弧边卡片 -->
					<div>
						<scroll-view class="scrollArea" scroll-y="true"
							:style="{ height: scrollHeight + 'px',width:'217rpx',backgroundColor:'#ddd' }">
							<div
								style="display: flex; flex-direction: column; gap: 5rpx;background-color: #ddd;height: 100%;">
								<div style="margin-top: 2rpx;"></div>
								<div style="display: flex; flex-wrap: wrap; ">
									<div :class="['clickCard',getCommdityActive(item.id)?'activeCard':'' ]"
										@click="addCommodity(item)" v-for="item in commodityList">
										<div>
											<text style="font-size: 15rpx;font-weight: bold;">
												{{item.name}}
											</text>
											<br>
											<text v-if="item.saleWay===1"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 2rpx;">非定装</text>
											<text v-if="item.saleWay===2"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #31BDEC;border-radius: 2rpx;">定装</text>
											<text v-if="item.saleWay===3"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 2rpx;">定装拆包</text>
											<text v-if="item.extralModel"
												style="margin-top: 5rpx;margin-left: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #ff5500;border: 1px solid #ff5500;border-radius: 2rpx;">{{item.extralModel.name}}</text>
										</div>
									</div>
								</div>
							</div>
						</scroll-view>

					</div>

				</div>
				<!-- 垂直线 -->
				<div style="width: 3rpx; background-color: #ccc; "></div>
			</div>
			<div style="flex: 1; background-color: #ffffff; text-align: right;">
				<div
					style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
					<div style="font-size: 15rpx; font-weight: bold;">
						<div style="font-size: 15rpx; font-weight: bold;">
						</div>
					</div>
				</div>
				<div :style="{marginLeft: '5rpx',marginRight: '5rpx', height: (windowHeight-60)+'px'}">
					<!-- 表头 -->
					<div
						style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
						<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">货品</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">报损数量
						</div>
						<div style="width: 40rpx;padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">操作
						</div>
					</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 25rpx;" v-for="(item, index) in LossCommodityList"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 5px; text-align: left; font-weight: bold; line-height: 20rpx;">
								{{ item.name }}
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;display: flex;">
								<input @click="showKeyBorad(index,1)" inputmode="none" class="input1"
									v-model="item.mount" style="flex: 3" />
								<div style="flex: 1;line-height: 25rpx;text-align: center;">
									/{{item.spec?item.spec.specName:""}}</div>
							</div>
							<div
								style="width: 40rpx; padding: 4px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 20rpx;">
								<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="20"
									@click="deleteBatchCommdity(index)" color="#aa0000"></uni-icons>
							</div>
						</div>
						<div
							style="display: flex; height: 25rpx;font-size: 12rpx;border-top: 1px solid gainsboro;border-bottom: 1px solid gainsboro;">
							<div
								style="flex: 3; padding: 5px; text-align: left; font-weight: bold; line-height: 20rpx;">
								总计：
							</div>
							<div
								style="flex: 2; padding: 4px; text-align: center;font-weight: bold; line-height: 20rpx;">
								总数：{{totalInitInventory()}}
							</div>
							<div
								style="flex: 2; padding: 4px; text-align: center;font-weight: bold; line-height: 20rpx;">
								总重：{{totalInitWeight()}}
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;font-weight: bold; line-height: 20rpx;">

							</div>
							<div
								style="width: 40rpx; padding: 4px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 20rpx;">

							</div>
						</div>
					</scroll-view>
					<!--键盘-->
					<div v-if="showKeyBoard1">
						<view class="mybrankmask"
							:style="{ width: '340rpx', height: '150rpx', backgroundColor: '#ffffff', zIndex: 999, left: 0, bottom: 0 }">
							<view style="padding: 5rpx;">
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(1)">1</view>
									<view class="maskListItem" @click="NumberCk(2)">2</view>
									<view class="maskListItem" @click="NumberCk(3)">3</view>
									<view class="maskListItem " @click="Tuige()"><uni-icons custom-prefix="iconfont"
											type="icon-tuige" size="30" color="#ffffff"
											style="margin-right: 5rpx;"></uni-icons>
									</view>

								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(4)">4</view>
									<view class="maskListItem" @click="NumberCk(5)">5</view>
									<view class="maskListItem" @click="NumberCk(6)">6</view>

									<view class="maskListItem" @click="NumberCk('+')"
										style="font-size: 25px;color: white;">
										+</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(7)">7</view>
									<view class="maskListItem" @click="NumberCk(8)">8</view>
									<view class="maskListItem" @click="NumberCk(9)">9</view>
									<view class="maskListItem" @click="NumberCk('-')"
										style="font-size: 25px;color: white;">
										-</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
									<view class="maskListItem" @click="NumberCk('.')">.</view>
									<view class="maskListItem" style="background-color: #31BDEC;color: white;"
										@click="hideBorad">确定
									</view>
								</view>
							</view>
						</view>
					</div>
				</div>

				<div style="position: fixed;bottom: 0;height: 30rpx;background: #ffffff;width: 100%;"
					v-if="!showKeyBoard1&&showComfirmBtn">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="saveBatchGood">确认</button>
				</div>
			</div>


		</div>
	</div>

	</div>
</template>

<script>
	import batch from '../../api/batch/batch'
	import lossModelApi from '../../api/lossModel/lossModelApi';
	import purchase from '../../api/purchase/purchase';
	export default {
		data() {
			return {
				scrollHeight: 0,
				windowHeight: 0,
				companyId: "",
				commodityList: [],
				valueType: 1,
				windowWidth: 0,
				windowHeight: 0,
				scrollHeight2: '0px',
				currentBatch: '',
				editingIndex: 0,
				userInfo:null,
				showKeyBoard1: false,
				LossCommodityList: [],
				targetId: "id-0-view",
				showComfirmBtn: true,
			}
		},
		onLoad(options) {
			this.currentBatch =JSON.parse(options.batch);
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 55;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.userInfo = uni.getStorageSync("userInfo");
			//根据classId获取物体
			this.getBatchCommodityList(this.currentBatch.id);
			this.initSystem();
		},
		methods: {
			totalInitInventory() {
				return this.LossCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initInventory) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.LossCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.totalWeight) || 0);
				}, 0);
			},
			getCommdityActive(id) {
				if (this.LossCommodityList.some(x => x.commodityId === id)) {
					return true;
				}
				return false;
			},
			NumberCk(val) {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.LossCommodityList[this.editingIndex].mount;
						break;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				switch (this.valueType) {
					case 1:
						this.LossCommodityList[this.editingIndex].mount = myvalue;
						break;
				}
			},
			Tuige() {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.LossCommodityList[this.editingIndex].mount;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				myvalue = myvalue.slice(0, -1);
				switch (this.valueType) {
					case 1:
						this.LossCommodityList[this.editingIndex].mount = myvalue === '' ? '0' : myvalue;
						break;
				}
			},
			initSystem() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.windowWidth = res.windowWidth; // 输出屏幕宽度
						that.windowHeight = res.windowHeight;
						that.scrollHeight2 = res.windowHeight - 150 + 'px';
					}
				});
			},
			showKeyBorad(index, type) {
				this.$nextTick(() => {
					// 确保赋值和 view 的 id 一致
					this.scrollIntoView = `id-${this.currentNumber}-view`
				})
				this.valueType = type;
				this.editingIndex = index;
				this.showKeyBoard1 = true;
				this.scrollHeight2 = this.windowHeight - 210 - 150 + 'px';
			},
			hideBorad() {
				this.scrollHeight2 = this.windowHeight - 150 + 'px';
				this.showKeyBoard1 = false;
			},
			saveBatchGood() {
				let that = this;
				that.showComfirmBtn = false;
				var CommodityList = [];
				that.LossCommodityList.forEach(item => {
					if (item.mount > 0) {
						CommodityList.push({
							"commodityId": item.commodityId,
							"purchaseEmployId":item.purchaseEmployId,
							"purchaseInventories": [{
								"specId": item.spec.id,
								"mount": parseFloat(item.mount)
							}],
							"operatorId":that.userInfo.id
						})
					}
				})
				//报损单对象
				let lossModelOrder={
					"companyId": that.companyId,
					"operatorId": that.userInfo.id,
					"lossModelList": CommodityList,
					"stockType":"1",//货物库存类型 1-代销 2-自营
				}
				console.log("lossModelOrder",lossModelOrder)
				if (that.LossCommodityList.length > 0) {
					lossModelApi.createLossModelOrder(JSON.stringify(lossModelOrder)).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '报损成功',
								icon: 'none',
								duration: 2000
							})
							that.back()
						} else {
							uni.showToast({
								title: '报损失败',
								icon: 'none',
								duration: 2000
							})
							that.showComfirmBtn = true;
						}
					})
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			deleteBatchCommdity(index) {
				uni.showModal({
					title: '确认删除',
					content: '您确定要删除该项吗？',
					success: (res) => {
						if (res.confirm) {
							// 用户点击了确认
							this.LossCommodityList.splice(index, 1)
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
			
			getBatchCommodityList(id) {
				console.log("id",id)
				batch.GetBybatchPurchaseAssist(id).then(res => {
					this.commodityList = [];
					for (let i = 0; i < res.data.length; i++) {
						this.commodityList.push({
							id: res.data[i].id,
							key: i,
							name: res.data[i].commodityName,
							commodityId:res.data[i].commodityId,
							commoditySpecs:res.data[i].specList,
							type: 0,
							unit: res.data[i].unit,
							extralModel: res.data[i].extralModel,
							saleWay: res.data[i].saleWay
						})
					}
					
					console.log("this.commodityList",this.commodityList)
				})
			},
			getCommodityByClassId() {
				// purchase.GetEmployCommidityByClassId(this.currentClassId).then(res => {


				// })
			},
			addCommodity(e) {
				if (this.getCommdityActive(e.id)) return;
				if (e.saleWay === 1 || e.saleWay === 2||e.saleWay===4) {
					var commodityAdded = {
						id: "",
						name: e.name,
						commodityId: e.commodityId,
						mount:0,
						purchaseEmployId:e.id
					}
					if (e.commoditySpecs.length > 0) {
						commodityAdded.spec = e.commoditySpecs[0]
					}
					this.LossCommodityList.push(commodityAdded)
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.scroll-view2 {
		white-space: nowrap;
	}

	.coach_wrap {
		padding: 5rpx;
		background-color: white;
		font-weight: bold;
		border: solid 1px dodgerblue;
		margin-right: 15rpx;
		display: inline-block;
		border-radius: 10rpx;
	}

	.coach_wrap_active {
		color: white;
		background-color: dodgerblue;
	}

	.input1 {
		background-color: #b9b9b9;
		height: 20rpx;
		border-radius: 5rpx;
		font-size: 15rpx;
		text-align: center;
		border: 1px solid black;
		font-weight: bold;
		color: black;
		width: 90%;

	}

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 30rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 12rpx;

	}

	.mybrankmask .MymaskList .large {
		font-weight: bold;
		height: 65;
		/* 设置更高的高度 */
		line-height: 65rpx;
		/* 使文本垂直居中 */
		z-index: 5;
		font-size: 12rpx;
	}

	.mybrankmask .MymaskList .maskListItem {
		font-weight: bold;
		width: 23%;
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		background-color: #a8a8a8;
		font-size: 12rpx;
	}

	.clickCard {
		margin-left: 2rpx;
		margin-right: 2rpx;
		width: 104rpx;
		height: 70rpx;
		background-color: #ffffff !important;
		border-radius: 8rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		padding: 10rpx;
		box-sizing: border-box;
		text-align: left;
		font-size: 14rpx;
		color: #333;
		margin-bottom: 3rpx;
	}

	.activeCard {
		border: 3px solid #007AFF;
	}
</style>