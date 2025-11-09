<template>
	<div>
		<div style="display: flex; width: 100%;">
			<!-- 商品选择器组件 -->
			<GoodsSelector
				:commodity-list="commodityList"
				:category-list="[]"
				:selected-ids="selectedCommodityIds"
				:height="scrollHeight"
				:show-back-button="true"
				:show-add-button="false"
				@back="back"
				@item-click="addCommodity"
				@spec-selected="handleSpecSelected"
				@multilevel-selected="handleMultiLevelSelected"
			></GoodsSelector>
		<div style="flex: 1; background-color: #ffffff; text-align: right; position: relative;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;">
					<div style="font-size: 15rpx; font-weight: bold;">
					</div>
				</div>
			</div>
			<div :style="{marginLeft: '5rpx',marginRight: '5rpx', height: (windowHeight-60)+'px', position: 'relative'}">
					<!-- 表头 -->
					<div class="table-header">
						<div style="flex: 3; padding: 10px; text-align: left;">
							<text style="font-size: 16px; font-weight: bold;">货品</text>
						</div>
						<div style="flex: 2; padding: 10px; text-align: center;">
							<text style="font-size: 16px; font-weight: bold;">报损数量</text>
						</div>
						<div style="width: 40rpx;padding: 10px; text-align: center;">
							<text style="font-size: 16px; font-weight: bold;">操作</text>
						</div>
					</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 45rpx; font-size: 18rpx;" v-for="(item, index) in LossCommodityList"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 8px; text-align: left; font-weight: bold; line-height: 35rpx;">
								{{ item.name }}
							</div>
							<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center; gap: 5rpx;">
								<input @click="showKeyBorad(index,1)" inputmode="none" 
									:class="['input1', { 'input-active': editingIndex === index && valueType === 1 }]"
									v-model="item.mount" />
								<text style="font-size: 16px; color: #666; font-weight: 500; min-width: 40rpx;">{{item.spec?item.spec.specName:""}}</text>
							</div>
							<div
								style="width: 40rpx; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 35rpx; display: flex; align-items: center; justify-content: center;">
								<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="24"
									@click="deleteBatchCommdity(index)" color="#aa0000"></uni-icons>
							</div>
						</div>
						<div class="total-content">
							<div class="total-content-item" style="flex: 3;">
								总计：
							</div>
							<div class="total-content-item" style="flex: 2;">
								总数：{{totalInitInventory()}}
							</div>
							<div class="total-content-item" style="width: 40rpx;">

							</div>
						</div>
			</scroll-view>
			<!--键盘-->
			<NumericKeyboard 
				:show="showKeyBoard1" 
				:value="getCurrentValue()"
				:container-position="true"
				@input="handleKeyboardInput"
				@delete="handleKeyboardDelete"
				@confirm="hideBorad"
			/>
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
</template>

<script>
	import batch from '../../api/batch/batch'
	import lossModelApi from '../../api/lossModel/lossModelApi';
	import purchase from '../../api/purchase/purchase';
	import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
	import NumericKeyboard from '../../components/NumericKeyboard/NumericKeyboard.vue'
	
	export default {
		components: {
			GoodsSelector,
			NumericKeyboard
		},
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
				editingIndex: -1,
				userInfo:null,
				showKeyBoard1: false,
				LossCommodityList: [],
				targetId: "id-0-view",
				showComfirmBtn: true
			}
		},
		computed: {
			// 已选商品ID列表
			selectedCommodityIds() {
				return this.LossCommodityList.map(item => item.commodityId);
			}
		},
		onLoad(options) {
			this.currentClassId =options.classId;
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.userInfo = uni.getStorageSync("userInfo");
			//根据classId获取物体
			this.getCommodityByClassId();
			this.initSystem();
		},
		methods: {
		totalInitInventory() {
			return this.LossCommodityList.reduce((total, item) => {
				return total + (parseFloat(item.mount) || 0);
			}, 0);
		},
		// 获取当前编辑的值
		getCurrentValue() {
			if (this.editingIndex === -1) return '';
			switch (this.valueType) {
				case 1:
					return this.LossCommodityList[this.editingIndex].mount || '';
				default:
					return '';
			}
		},
		// 处理键盘输入
		handleKeyboardInput(val) {
			let myvalue = this.getCurrentValue();
			
			// 如果是+/-，先计算表达式
			if (val === '+' || val === '-') {
				try {
					myvalue = eval(myvalue.toString());
				} catch (e) {
					myvalue = parseFloat(myvalue) || 0;
				}
			}
			
			// 拼接新值
			var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
			myvalue = txt + val.toString();
			
			// 更新值
			switch (this.valueType) {
				case 1:
					this.LossCommodityList[this.editingIndex].mount = myvalue;
					break;
			}
		},
		// 处理键盘删除
		handleKeyboardDelete() {
			let myvalue = this.getCurrentValue();
			
			if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
				return;
			}
			
			myvalue = myvalue ? myvalue.toString() : '';
			if(myvalue.length == 1){
				myvalue = "0";
			} else {
				myvalue = myvalue.slice(0, -1);
			}
			
			// 更新值
			switch (this.valueType) {
				case 1:
					this.LossCommodityList[this.editingIndex].mount = myvalue;
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
			this.valueType = type;
			this.editingIndex = index;
			this.showKeyBoard1 = true;
			// 键盘高度调整为200rpx
			this.scrollHeight2 = this.windowHeight - 210 - 200 + 'px';
			
			// 设置滚动目标，使选中的行滚动到可视区域
			this.$nextTick(() => {
				this.targetId = `id-${index}-view`;
			});
		},
			hideBorad() {
				this.scrollHeight2 = this.windowHeight - 150 + 'px';
				this.showKeyBoard1 = false;
				// 清除激活状态
				this.editingIndex = -1;
				this.valueType = 0;
			},
			saveBatchGood() {
				let that = this;
				that.showComfirmBtn = false;
				var CommodityList = [];
				that.LossCommodityList.forEach(item => {
					if (item.mount > 0) {
						CommodityList.push({
							"commodityId": item.commodityId,
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
					"stockType":"2",//货物库存类型 1-代销 2-自营
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
			getCommodityByClassId() {
				purchase.GetEmployCommidityByClassId(this.currentClassId).then(res => {
					this.commodityList = [];
					for (let i = 0; i < res.data.length; i++) {
						this.commodityList.push({
							id: res.data[i].id,
							key: i,
							commodityName: res.data[i].commodityName, // 使用 commodityName 适配 GoodsSelector
							name: res.data[i].commodityName,
							price: res.data[i].price,
							commoditySpecs:res.data[i].commoditySpecs,
							inventory: res.data[i].initMount - res.data[i].saleMount,
							type: 0,
							unit: res.data[i].unit,
							initWeight: res.data[i].initWeight,
							extralModel: res.data[i].extralModel,
							saleWay: res.data[i].saleWay,
							outPutPurchaseInventories: res.data[i].outPutPurchaseInventories,
							isMultiLevel: 0 // 不支持多等级
						})
					}

					console.log("this.commodityList",this.commodityList);

				})
			},
			addCommodity(e) {
				// 检查是否已经添加
				if (this.LossCommodityList.some(x => x.commodityId === e.id)) return;
				
				// 只处理非拆包、非多规格商品
				// 拆包和多规格商品由 GoodsSelector 内部弹窗处理
				if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
					var commodityAdded = {
						id: "",
						name: e.name,
						commodityId: e.id,
						mount: 0
					}
					if (e.commoditySpecs && e.commoditySpecs.length > 0) {
						commodityAdded.spec = e.commoditySpecs[0]
					}
					this.LossCommodityList.push(commodityAdded)
				}
			},
			
			// 处理规格选择（拆包商品）
			handleSpecSelected({ commodity, spec }) {
				console.log('选择拆包规格:', commodity, spec);
				// 检查是否已经添加
				if (this.LossCommodityList.some(x => x.commodityId === commodity.id)) {
					uni.showToast({
						title: '该商品已添加',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				
				// 添加拆包商品
				var commodityAdded = {
					id: "",
					name: commodity.name || commodity.commodityName,
					commodityId: commodity.id,
					mount: 0,
					spec: spec
				};
				this.LossCommodityList.push(commodityAdded);
			},
			
			// 处理多规格商品选择
			handleMultiLevelSelected(childCommodity) {
				console.log('选择多规格子商品:', childCommodity);
				// 检查是否已经添加
				if (this.LossCommodityList.some(x => x.commodityId === childCommodity.commodityId || x.commodityId === childCommodity.id)) {
					uni.showToast({
						title: '该商品已添加',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				
				// 添加多规格子商品
				var commodityAdded = {
					id: "",
					name: childCommodity.commodityName || childCommodity.name,
					commodityId: childCommodity.commodityId || childCommodity.id,
					mount: 0
				};
				
				// 获取规格信息
				if (childCommodity.commoditySpecs && childCommodity.commoditySpecs.length > 0) {
					commodityAdded.spec = childCommodity.commoditySpecs[0];
				} else if (childCommodity.commoditySpec) {
					commodityAdded.spec = childCommodity.commoditySpec;
				}
				
				this.LossCommodityList.push(commodityAdded);
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
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.coach_wrap_active {
		color: white !important;
		background-color: dodgerblue !important;
		border-color: dodgerblue !important;
	}

	.input1 {
		background: #f5f5f5;
		height: 28rpx;
		border-radius: 8rpx;
		font-size: 18rpx;
		text-align: center;
		border: 2px solid #919191;
		font-weight: bold;
		color: #5a5a5a;
		width: 70%;
		flex: 1;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		line-height: 28rpx;
	}
	
	.input-active {
		background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
		border: 2px solid #2196f3 !important;
		color: #1565c0 !important;
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3) !important;
	}
	
	.input1:focus {
		border-color: #1976d2;
		box-shadow: 0 0 0 3rpx rgba(33, 150, 243, 0.2);
		background: #ffffff;
	}

	.total-content {
		display: flex;
		height: 35rpx;
		font-size: 16rpx;
		background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
		border-top: 2px solid #fdcb6e;
		border-bottom: 2px solid #fdcb6e;
		box-shadow: 0 2rpx 8rpx rgba(253, 203, 110, 0.3);
		align-items: center;
	}

	.total-content-item {
		padding: 8px;
		text-align: left;
		font-weight: bold;
		line-height: 28rpx;
		color: #d63031;
		font-size: 15px;
	}
	
	/* 表头美化样式 */
	.table-header {
		display: flex;
		background: #2196f3;
		font-weight: bold;
		border-bottom: none;
		color: #ffffff;
		box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3);
		border-radius: 8rpx 8rpx 0 0;
	}
</style>