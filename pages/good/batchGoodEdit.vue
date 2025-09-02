<template>
	<div>
		<div style="display: flex; width: 100%;">
			<div style="width: 220rpx; background-color: #ffffff;display: flex;">
				<div>
					<div style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;">
						<div style="align-items: left;">
							<button
								style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
								@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
									color="#ffffff" style="margin-right: 5px;"></uni-icons>返回</button>
						</div>
						<text style="font-size: 15rpx;font-weight: bold;color: #333;margin-left: 10rpx;">选择货品</text>
					</div>
					<scroll-view class="scroll-view2" scroll-x style="height:60px;width: 200rpx;margin-top: 10px;">
						<div style="margin-top: 5rpx;margin-left: 20rpx;">
							<view :class="{'coach_wrap': true,'coach_wrap_active': activeType == item.name}"
								v-for="(item, index) in tabList" :key="index" @click="changeTab(item)">
								{{item.name}}
							</view>
						</div>
					</scroll-view>
					<div style="
	          width: 205rpx;
	          height: 30rpx;
			  margin: 5rpx;
	          background: grey;
	          color: white;
	          line-height: 30rpx;
	          text-align: center;
	          border-radius: 4rpx;
	          cursor: pointer;
			  font-size: 18rpx;
	          user-select: none;
	          font-weight: bold;
	          " @click="showAddNewGood=true">
						<uni-icons custom-prefix="iconfont" type="icon-plus-square" size="30" color="#ffffff"
							style="margin-right: 5px;line-height: 30rpx;"></uni-icons>新增货品
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
										@click="addCommodity(item)" v-for="item in commodityShowList">
										<div>
											<text style="font-size: 15rpx;font-weight: bold;">
												{{item.commodityName}}
											</text>
											<br>
											<text v-if="item.saleWay===1"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 2rpx;">非定装</text>
											<text v-if="item.saleWay===2"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #00aa00;border-radius: 2rpx;">定{{item.initWeight?item.initWeight:''}}</text>
											<text v-if="item.saleWay===3"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 2rpx;">定装拆包</text>
											<text v-if="item.saleWay===4"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #55aaff;border: 1px solid #55aaff;border-radius: 2rpx;">散装</text>
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
						<div style="font-size: 15rpx; font-weight: bold;"><text
								style="margin-right: 5rpx;">{{BatchInfo.shipperName}}</text><text>{{BatchInfo.batchCode}}</text>
						</div>
					</div>
				</div>
				<div :style="{marginLeft: '5rpx',marginRight: '5rpx', height: (windowHeight-60)+'px'}">
					<!-- 表头 -->
					<div
						style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
						<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">货品</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库数量
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库重量
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库单价
						</div>
						<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库金额
						</div>
						<div style="width: 40rpx;padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">操作
						</div>
					</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 25rpx;" v-for="(item, index) in BatchCommodityList" v-if="item.operaType !== 2"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 5px; text-align: left; font-weight: bold; line-height: 20rpx;">

								<!--商品名称栏-->
								<view style="display: flex;">
									<!--左边-->
									<view>
										{{ item.name }}
									</view>
									<!--右边-->
									<view v-if="item.saleWay == 1">
										<zero-switch @change="SwitchCalcType($event, item)" text-on="数量" text-off="重量"
											:show-text="true"></zero-switch>
									</view>
								</view>

							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,1)" inputmode="none" class="input1"
									v-model="item.initMount" />
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,2)" inputmode="none" class="input1"
									v-model="item.initWeight" />
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,3)" inputmode="none" class="input1"
									v-model="item.incomingPrice" />
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,4)" inputmode="none" class="input1"
									v-model="item.inboundAmount" />
							</div>
							<div
								style="width: 40rpx; padding: 4px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 20rpx;">
								<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="20"
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
							<div class="total-content-item" style="flex: 2; ">
								总重：{{totalInitWeight()}}
							</div>
							<div class="total-content-item" style="flex: 2; ">

							</div>
							<div class="total-content-item" style="flex: 2; ">
								￥{{totalAmount()}}
							</div>
							<div class="total-content-item" style="width: 40rpx;">

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
					v-if="!showKeyBoard1">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="saveBatchGood">确认</button>
				</div>
			</div>
		</div>


		<u-modal title="添加新货品" class="payment" :show="showAddNewGood" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="400" @close="showAddNewGood = false">
			<div class="slot-content" style="overflow-y: auto;">
				<uni-section title="表单校验" type="line">
					<view class="example">
						<!-- 基础表单校验 -->
						<view class="input-container" style="margin-top: 10px;">
							<text class="label" style="width: 100px;">新货品名称：</text>
							<input class="input-field" type="text" placeholder=" "
								style="height: 40px;width: 300px;border-radius: 5rpx;background-color: lightgray;padding-left: 10px;"
								v-model="newGoodInfo.name" />
						</view>
						<view class="input-container" style="margin-top: 10px;">
							<text class="label" style="width: 100px;">选择货品类型：</text>
							<scroll-view class="scroll-view2" scroll-x
								style="height:60px;width: 300px;margin-top: 10px;">
								<div style="margin-top: 5rpx;margin-left: 20rpx;">
									<view
										:class="{'coach_wrap': true,'coach_wrap_active': newGoodInfo.classifyId == item.value}"
										v-for="(item, index) in tabListOrigin" :key="index"
										@click="newGoodInfo.classifyId=item.value">
										{{item.name}}
									</view>

								</div>
							</scroll-view>
						</view>

						<view style="display: flex;">
							<button type="primary" @click="showAddNewGood = false"
								style="width: 30%;margin-top: 20px;background-color: darkgray;">返回</button>
							<button type="primary" @click="addNewGood" style="width: 30%;margin-top: 20px;">添加</button>
						</view>
					</view>
				</uni-section>
			</div>
		</u-modal>
	</div>

	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import batch from '../../api/batch/batch'
	export default {
		data() {
			return {
				currentTab: 0,
				scrollHeight: 0,
				windowHeight: 0,
				companyId: "",
				BatchInfo: null,
				tabList: [],
				tabListOrigin: [],
				showAddNewGood: false,
				activeType: "全部",
				activeType2Id: "",
				commodityList: [],
				commodityShowList: [],
				valueType: 1,
				windowWidth: 0,
				windowHeight: 0,
				scrollHeight2: '0px',
				editingIndex: 0,
				selectedProductType: "",
				showKeyBoard1: false,
				editType: "common",
				BatchCommodityList: [],
				targetId: "id-0-view",
				newGoodInfo: {
					name: "",
					classifyId: ""
				},
				batchList: [{
						batchName: '批次名称1',
						batchCode: '批次编号1',
					},
					{
						batchName: '批次名称2',
						batchCode: '批次编号2',
					},
					{
						batchName: '批次名称2',
						batchCode: '批次编号2',
					}
				]
			}
		},
		onLoad(options) {
				batch.getBatchInfoById(options.batchId).then(res => {
					this.BatchInfo = res.data;
					this.GetReposityAssistBybatchId()
				})	
		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.getAllcommodity();
			this.initSystem();
		},
		methods: {
			//切换计算方式
			SwitchCalcType(e, element) {
				console.log("e", e);
				console.log("element", element)
				if (e) {
					element.calcType = 1;
				} else {
					element.calcType = 2
				}
				this.calcCommodityaddedInboundAmount(element);
			},
			onProductTypeChange() {

			},
			totalInitInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initMount) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initWeight) || 0);
				}, 0);
			},
			totalAmount() {
				var total = this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inboundAmount) || 0);
				}, 0);

				return total.toFixed(1);
			},
			addNewGood() {
				if (this.newGoodInfo.name === "") {
					uni.showToast({
						title: '请输入货品名称',
						icon: 'none',
						duration: 1500
					})
					return;
				}
				if (this.newGoodInfo.classifyId === "") {
					uni.showToast({
						title: '请选择货品类型',
						icon: 'none',
						duration: 1500
					})
					return;
				}
				var goodInfo = {
					Id: "",
					name: this.newGoodInfo.name,
					price: 0,
					no: 0,
					classifyId: this.newGoodInfo.classifyId,
					inventory: 0,
					userId: ""
				}
				console.log("goodInfo", goodInfo)
				category.CommoditySave2(JSON.stringify(goodInfo)).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '添加成功',
							icon: 'none',
							duration: 1500
						})
						this.newGoodInfo.name = "";
						this.getAllcommodity();
						this.showAddNewGood = false;
					}
				})
			},
			getCommdityActive(id) {
				if (this.BatchCommodityList.some(x => x.commodityId === id)) {
					return true;
				}
			},
			changeTab(e) {
				var type = e.name;
				this.activeType = e.name;
				if (type == "全部") {
					this.commodityShowList = this.commodityList
				} else {
					this.commodityShowList = this.commodityList.filter(x => x.className == type)
				}
			},
			//键盘数字输入处理
			NumberCk(val) {
                //修改状态
                if(this.BatchCommodityList[this.editingIndex].operaType === 0){
                    this.BatchCommodityList[this.editingIndex].operaType = 1;
                }
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
						break;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var myvalueStr = myvalue.toString();
				if (val == '.') {
					if (myvalueStr.indexOf('.') >= 0) {
						return;
					}
				}
				if ((val === '+' || val === '-') && myvalueStr === '0') {
					return;
				}
				var txt = myvalue == null || (myvalueStr === '0' && val != ".") || myvalue == undefined ? '' : myvalue;

				if (val === "+" || val === "-") {
					txt = eval(txt);
				}
				myvalue = txt + val.toString();
				
				switch (this.valueType) {
					case 1:
						this.BatchCommodityList[this.editingIndex].initMount = myvalue;
						if(this.BatchCommodityList[this.editingIndex].fixWeight&&this.BatchCommodityList[this.editingIndex].fixWeight!=""){
							this.BatchCommodityList[this.editingIndex].initWeight=this.BatchCommodityList[this.editingIndex].initMount*this.BatchCommodityList[this.editingIndex].fixWeight;
						}
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 2:
						this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 3:
						this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
						//输入入库单价计算入库金额
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 4:
						this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
						//输入入库金额计算单价
						this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
						break;
				}
			},
			//键盘删除处理
			Tuige() {
                //修改状态
                if(this.BatchCommodityList[this.editingIndex].operaType === 0){
                    this.BatchCommodityList[this.editingIndex].operaType = 1;
                }
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				if(myvalue.length==1){
					myvalue = "0";
				}else{
					myvalue = myvalue.slice(0, -1);
				}
			
				switch (this.valueType) {
					case 1:
						this.BatchCommodityList[this.editingIndex].initMount = myvalue;
						if(this.BatchCommodityList[this.editingIndex].fixWeight&&this.BatchCommodityList[this.editingIndex].fixWeight!=""){
							this.BatchCommodityList[this.editingIndex].initWeight=this.BatchCommodityList[this.editingIndex].initMount*this.BatchCommodityList[this.editingIndex].fixWeight;
						}
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 2:
						this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 3:
						this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
						//输入入库单价计算入库金额
						this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
						break;
					case 4:
						this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
						//输入入库金额计算单价
						this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
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
			GetReposityAssistBybatchId() {
				batch.GetReposityAssistBybatchId(this.BatchInfo.id).then(res => {
					console.log("res", res)
					// this.BatchCommodityList = res.data;
					for (var i = 0; i < res.data.length; i++) {
						var commodity = res.data[i];
						var commodityAdded = {
						id: "",
                        historyId:commodity.id,
						name: commodity.commodityName,
						initMount: commodity.initMount,
						initWeight: commodity.initWeight,
						fixWeight:0,//单位重量（目前仅用于定装）
						commodityId: commodity.commodityId,
						calcType: 1,
						saleWay: commodity.saleWay,
						incomingPrice: 0,
						inboundAmount: commodity.inboundAmount,
                        operaType:0
					}
					if (commodity.specList.length > 0) {
						commodityAdded.spec = commodity.specList[0]
					}
					this.BatchCommodityList.push(commodityAdded)
					}
				})
			},
			getBatchCommodityList() {
				category.GetBybatchId(this.BatchInfo.id).then(res => {
					this.BatchCommodityList = res.data;
				})
			},
			saveBatchGood() {
				let that = this;
				var CommodityList = [];
				console.log("that.BatchCommodityList", that.BatchCommodityList)
				that.BatchCommodityList.forEach(item => {
					if (item.operaType !== 0) {
						CommodityList.push({
							"BatchId": that.BatchInfo.id,
							"commodityId": item.commodityId,
                            "historyId": item.historyId,
							"calcType": item.calcType,
							"initMount": 0,
							"initWeight": parseFloat(item.initWeight),
							"incomingPrice": parseFloat(item.incomingPrice),
							"inboundAmount": parseFloat(item.inboundAmount),
							"purchaseInventories": [{
								"specId": item.spec.id,
								"mount": parseFloat(item.initMount)
							}]
						})
					}
				})
				if (that.BatchCommodityList.length > 0) {
					batch.BulkModifyPurchaseAssist(JSON.stringify(CommodityList)).then(res => {
						if (res.code == 200) {
								uni.showToast({
									title: '保存成功',
									icon: 'none',
									duration: 2000
								})
								that.back();
						} else {
							uni.showToast({
								title: '保存失败',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},
			back() {
				uni.setStorageSync("refresh_batch", this.BatchInfo.id)
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

							//修改状态
                            if(this.BatchCommodityList[index].operaType === 0||this.BatchCommodityList[index].operaType === 1){
                                this.BatchCommodityList[index].operaType = 2;
                            }else{
                                this.BatchCommodityList.splice(index, 1);
                            }
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
			getAllcommodity() {
				category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
					console.log("res", res)
					this.commodityList = res.data;
					this.commodityShowList = res.data;
					this.tabList = [{
						name: "全部",
						value: 0
					}];
					this.tabListOrigin = [];
					this.commodityList.forEach((item, index) => {
						if (!this.tabList.some(tab => tab.name === item.className)) {
							this.tabList.push({
								name: item.className,
								value: index
							});
						};
						if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
							this.tabListOrigin.push({
								name: item.className,
								value: item.classifyId
							});
						};
						if (this.tabListOrigin.length > 0) {
							this.newGoodInfo.classifyId = this.tabListOrigin[0].value;
						}
					});
				});
			},
			//计算添加货品的入库金额 2-按重量计算 1-按数量计算
			calcCommodityaddedInboundAmount(commodityAdded) {

				if(commodityAdded.initWeight&&commodityAdded.initWeight!=""&&commodityAdded.incomingPrice&&commodityAdded.incomingPrice!=""){
				if (commodityAdded.calcType === 2) {
					commodityAdded.inboundAmount = (parseFloat(commodityAdded.initWeight) * parseFloat(commodityAdded.incomingPrice)).toFixed(1)
				}
				if (commodityAdded.calcType === 1) {
					commodityAdded.inboundAmount =(parseFloat(commodityAdded.initMount) * parseFloat(commodityAdded.incomingPrice)).toFixed(1)
				}
			}
			},
			//计算添加货品的入库单价 2-按重量计算 1-按数量计算
			calcCommodityaddedincomingPrice(commodityAdded) {
				if (commodityAdded.calcType === 2) {
					commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initWeight).toFixed(2)
				}
				if (commodityAdded.calcType === 1) {
					commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initMount).toFixed(2)
				}
			},
			addCommodity(e) {
				if (this.getCommdityActive(e.id)) return;
				if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
					var commodityAdded = {
						id: "",
						name: e.commodityName,
						initMount: 0,
						initWeight: 0,
						fixWeight:e.initWeight,//单位重量（目前仅用于定装）
						commodityId: e.id,
						calcType: 1,
						saleWay: e.saleWay,
						incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
						inboundAmount: 0,
                        operaType:3 //0-未修改 1-编辑 2-删除 3-添加
					}
					if (e.commoditySpecs.length > 0) {
						commodityAdded.spec = e.commoditySpecs[0]
					}
                    console.log("commodityAdded", commodityAdded)
					this.BatchCommodityList.push(commodityAdded)
				}
                console.log("this.BatchCommodityList", this.BatchCommodityList)
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

	.total-content {
		display: flex;
		height: 25rpx;
		font-size: 12rpx;
		border-top: 1px solid gainsboro;
		border-bottom: 1px solid gainsboro;
	}

	.total-content-item {
		padding: 5px;
		text-align: left;
		font-weight: bold;
		line-height: 20rpx;
	}
</style>