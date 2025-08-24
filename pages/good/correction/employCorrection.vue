<template>
	<div>
		<div style="display: flex; width: 100%;">
			<div style="width: 220rpx; background-color: #ffffff;display: flex;">
				<div>
					<div
						style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;margin-bottom: 10px;">
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
										@click="getCommodityCorrection(item)" v-for="item in commodityList">
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
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">盘点数量
						</div>
						<div style="width: 40rpx;padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">操作
						</div>
					</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 25rpx;" v-for="(item, index) in correctionCommodityList"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 5px; text-align: left; font-weight: bold; line-height: 20rpx;">
								{{ item.correctCommodityName }}
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;display: flex;">
								<div style="flex: 1;line-height: 25rpx;" v-for="inventory in item.correctionList">
									{{inventory.mount+"("+inventory.specName+")"}}|
								</div>
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
						@click="createCorrection">确认</button>
				</div>
			</div>


		</div>
	</div>

	</div>
</template>

<script>
	import purchase from '../../../api/purchase/purchase';
	import correctionApi from '../../../api/correction/correctionApi';
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
				currentClassId: '',
				editingIndex: 0,
				userInfo: null,
				showKeyBoard1: false,
				correctionCommodityList: [],
				targetId: "id-0-view",
				showComfirmBtn: true,
			}
		},
		onLoad(options) {
			this.currentClassId = options.classId;
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 55;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.userInfo = uni.getStorageSync("userInfo");
			//根据classId获取物体
			this.getCommodityByClassId();
			this.initSystem();
		},
		methods: {
			totalInitInventory() {
				return this.correctionCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initInventory) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.correctionCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.totalWeight) || 0);
				}, 0);
			},
			getCommdityActive(id) {
				return this.correctionCommodityList.some(x => x.commodityId === id);
			},
			NumberCk(val) {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.correctionCommodityList[this.editingIndex].mount;
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
						this.correctionCommodityList[this.editingIndex].mount = myvalue;
						break;
				}
			},
			Tuige() {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.correctionCommodityList[this.editingIndex].mount;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				myvalue = myvalue.slice(0, -1);
				switch (this.valueType) {
					case 1:
						this.correctionCommodityList[this.editingIndex].mount = myvalue === '' ? '0' : myvalue;
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
			createCorrection() {
				let that = this;
				that.showComfirmBtn = false;
				//报损单对象
				let correctionOrder = {
					"companyId": that.companyId,
					"operatorId": that.userInfo.id,
					"correctionModelList": this.correctionCommodityList,
				}
				console.log("this.correctionCommodityList",this.correctionCommodityList)
				if (this.correctionCommodityList.length > 0) {
					correctionApi.createCorrectionOrder(JSON.stringify(correctionOrder)).then(res => {
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
							this.correctionCommodityList.splice(index, 1)
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
			getCommodityByClassId() {
				purchase.GetEmployCommidityByClassId(this.currentClassId).then(res => {
					console.log("Res", res)
					this.commodityList = [];
					for (let i = 0; i < res.data.length; i++) {
						this.commodityList.push({
							id: res.data[i].id,
							key: i,
							name: res.data[i].commodityName,
							price: res.data[i].price,
							commoditySpecs: res.data[i].commoditySpecs,
							inventory: res.data[i].initMount - res.data[i].saleMount,
							type: 0,
							unit: res.data[i].unit,
							initWeight: res.data[i].initWeight,
							extralModel: res.data[i].extralModel,
							saleWay: res.data[i].saleWay,
							outPutPurchaseInventories: res.data[i].outPutPurchaseInventories
						})
					}

				})
			},
			//获取物体可矫正德数值
			getCommodityCorrection(e) {
				let that = this;
				if (this.getCommdityActive(e.id)) return;
				if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
					correctionApi.GetCurrentCorrectionByCommodityId(e.id).then(res => {
						console.log("res", res)
						if (res.data) {
							that.correctionCommodityList.push(res.data);
						} else {
							uni.showToast({
								title: '该商品没有可矫正的数值',
								icon: 'none',
								duration: 2000
							})
						}
					})
					// var commodityAdded = {
					// 	id: "",
					// 	name: e.name,
					// 	commodityId: e.id,
					// 	mount: 0
					// }
					// if (e.commoditySpecs.length > 0) {
					// 	commodityAdded.spec = e.commoditySpecs[0]
					// }
					//correctionCommodityList.push(commodityAdded)
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