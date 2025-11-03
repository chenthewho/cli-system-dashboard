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
			></GoodsSelector>
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
					<div v-if="showKeyBoard1">
						<view class="mybrankmask"
							:style="{ width: '450rpx', height: '200rpx', backgroundColor: '#ffffff', zIndex: 999, left: 0, bottom: 0, boxShadow: '0 -4rpx 20rpx rgba(0,0,0,0.15)' }">
							<view style="padding: 8rpx;">
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(1)">1</view>
									<view class="maskListItem" @click="NumberCk(2)">2</view>
									<view class="maskListItem" @click="NumberCk(3)">3</view>
									<view class="maskListItem " @click="Tuige()"><uni-icons custom-prefix="iconfont"
											type="icon-tuige" size="35" color="#ffffff"
											style="margin-right: 5rpx;"></uni-icons>
									</view>

								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(4)">4</view>
									<view class="maskListItem" @click="NumberCk(5)">5</view>
									<view class="maskListItem" @click="NumberCk(6)">6</view>

									<view class="maskListItem" @click="NumberCk('+')"
										style="font-size: 35rpx;color: white;">
										+</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(7)">7</view>
									<view class="maskListItem" @click="NumberCk(8)">8</view>
									<view class="maskListItem" @click="NumberCk(9)">9</view>
									<view class="maskListItem" @click="NumberCk('-')"
										style="font-size: 35rpx;color: white;">
										-</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
									<view class="maskListItem" @click="NumberCk('.')">.</view>
									<view class="maskListItem confirm-btn"
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
	
	<!-- 规格选择弹窗（拆包） -->
	<div v-if="specPopup.visible" class="spec-popup-mask" @click="closeSpecPopup">
		<div 
			class="spec-popup-container" 
			:style="specPopupStyle"
			@click.stop
		>
			<div class="spec-popup-content">
				<div 
					v-for="(spec, index) in specPopup.specList" 
					:key="index"
					class="spec-item"
					@click="handleSpecClick(spec)"
				>
					<!-- 商品名称 + 规格名称 -->
					<div class="spec-item-name">
						{{ specPopup.commodity.name }}-{{ spec.specName }}
					</div>
					
					<!-- 商品信息区域 -->
					<div class="spec-item-info">
						<!-- 标签行 -->
						<div class="spec-item-tags">
							<div class="tag tag-unpack">拆包</div>
						</div>
					</div>
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
	import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
	
	export default {
		components: {
			GoodsSelector
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
				showComfirmBtn: true,
				// 规格弹窗数据（拆包）
				specPopup: {
					visible: false,
					left: 0,
					top: 0,
					commodity: null,
					specList: []
				},
			}
		},
		computed: {
			// 已选商品ID列表
			selectedCommodityIds() {
				return this.LossCommodityList.map(item => item.commodityId);
			},
			// 规格弹窗样式（拆包）
			specPopupStyle() {
				const { left, top, specList } = this.specPopup;
				if (!specList || specList.length === 0) {
					return {};
				}
				const itemHeight = 90; // 每项高度
				const popupHeight = Math.min(specList.length * itemHeight + 10, 450); // 限制最大高度450px
				
				// 使用 uni-app 兼容的方式获取屏幕高度
				const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight;
				
				// 计算最佳位置（避免超出屏幕）
				let adjustedTop = top - 100 < 0 ? 0 : top - 100;
				adjustedTop = adjustedTop + popupHeight > screenHeight 
					? screenHeight - popupHeight - 20
					: adjustedTop;
				
				return {
					left: left + 'px',
					top: adjustedTop + 'px'
				};
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
				if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				if(myvalue.length == 1){
					myvalue = "0";
				}else{
					myvalue = myvalue.slice(0, -1);
				}
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
				this.$nextTick(() => {
					// 确保赋值和 view 的 id 一致
					this.scrollIntoView = `id-${this.currentNumber}-view`
				})
				this.valueType = type;
				this.editingIndex = index;
				this.showKeyBoard1 = true;
				// 键盘高度调整为200rpx
				this.scrollHeight2 = this.windowHeight - 210 - 200 + 'px';
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

				})
			},
			addCommodity(e) {
				// 检查是否已经添加
				if (this.LossCommodityList.some(x => x.commodityId === e.id)) return;
				
				if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
					var commodityAdded = {
						id: "",
						name: e.name,
						commodityId: e.id,
						mount: 0
					}
					if (e.commoditySpecs.length > 0) {
						commodityAdded.spec = e.commoditySpecs[0]
					}
					this.LossCommodityList.push(commodityAdded)
				}
				
				// 处理定装拆包
				if(e.saleWay === 3){
					uni.createSelectorQuery().selectAll(`#grid-item-${e.id}`).boundingClientRect(data => {
						console.log("拆包商品位置信息", data)
						if (data && data.length > 0) {
							this.createSpecPopup(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
						}
					}).exec()
				}
			},
			
			// 用于添加拆包商品
			addCommodity2(e, spec) {
				var commodityAdded = {
					id: "",
					name: e.name,
					commodityId: e.id,
					mount: 0
				}
				commodityAdded.spec = spec
				this.LossCommodityList.push(commodityAdded)
			},
			
			// 创建规格弹窗（拆包）
			createSpecPopup(left, top, commodity, specList) {
				if (!specList || specList.length < 1) return;
				
				this.specPopup = {
					visible: true,
					left,
					top,
					commodity,
					specList
				};
			},
			
			// 关闭规格弹窗
			closeSpecPopup() {
				this.specPopup.visible = false;
				// 延迟清空数据，等动画完成
				setTimeout(() => {
					this.specPopup = {
						visible: false,
						left: 0,
						top: 0,
						commodity: null,
						specList: []
					};
				}, 300);
			},
			
			// 点击规格项
			handleSpecClick(spec) {
				this.addCommodity2(this.specPopup.commodity, spec);
				this.closeSpecPopup();
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

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 42rpx;
		justify-content: space-around;
		margin-bottom: 6rpx;
		font-size: 26rpx;
	}

	.mybrankmask .MymaskList .large {
		font-weight: bold;
		height: 42rpx;
		line-height: 42rpx;
		z-index: 5;
		font-size: 26rpx;
	}

	.mybrankmask .MymaskList .maskListItem {
		font-weight: bold;
		width: 23%;
		height: 42rpx;
		text-align: center;
		line-height: 42rpx;
		border-radius: 8rpx;
		background: #5a5a5a;
		font-size: 26rpx;
		color: white;
		transition: all 0.15s;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}
	
	.mybrankmask .MymaskList .maskListItem:active {
		opacity: 0.8;
		transform: scale(0.96);
		background: #4a4a4a;
		box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
	}
	
	.mybrankmask .MymaskList .confirm-btn {
		background: #11998e;
		font-weight: bold;
	}
	
	.mybrankmask .MymaskList .confirm-btn:active {
		opacity: 0.8;
		background: #0d7a6f;
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

	/* 规格选择弹窗样式（拆包） */
	.spec-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 9998;
		animation: fadeIn 0.2s ease-out;
	}
	
	.spec-popup-container {
		position: fixed;
		min-width: 250px;
		max-width: 500px;
		background-color: #ffffff;
		border: 3px solid #00aaff;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		z-index: 9999;
		animation: scaleIn 0.2s ease-out;
		display: flex;
		flex-direction: column;
	}
	
	.spec-popup-content {
		padding: 5px;
		overflow-y: auto;
		max-height: 450px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.spec-item {
		min-height: 70px;
		padding: 12px;
		border: 3px solid #7e7e7e;
		border-radius: 8px;
		background: #ffffff;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	
	.spec-item:hover {
		border-color: #00aaff;
		background: linear-gradient(135deg, rgba(0, 170, 255, 0.05) 0%, rgba(0, 136, 204, 0.05) 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
	}
	
	.spec-item:active {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(0, 170, 255, 0.3);
	}
	
	.spec-item-name {
		font-size: 18rpx;
		font-weight: bold;
		color: #333;
		line-height: 1.4;
		word-break: break-all;
	}
	
	.spec-item-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	
	.spec-item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	
	.tag {
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 12rpx;
		font-weight: 600;
		white-space: nowrap;
	}
	
	.tag-unpack {
		color: #dc9300;
		border: 1px solid #dc9300;
		background: rgba(220, 147, 0, 0.1);
	}
	
	/* 淡入动画 */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	/* 缩放动画 */
	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>