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
									<div :id="'grid-item-'+item.id" :class="['clickCard',getCommdityActive(item.id)?'activeCard':'' ]"
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
						<div style="display: flex; height: 25rpx;" v-for="(item, index) in BatchCommodityList"
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


	<!-- 添加新货品弹窗 -->
	<view v-if="showAddNewGood" class="znj-add-good-modal-mask" @click="showAddNewGood = false">
		<view class="znj-add-good-modal-wrapper" @click.stop>
			<view class="znj-add-good-modal-container">
				<!-- 标题栏 -->
				<view class="znj-add-good-modal-header">
					<text class="znj-add-good-modal-title">添加新货品</text>
					<view class="znj-add-good-modal-close" @click="showAddNewGood = false; newGoodInfoReset();">
						<uni-icons type="closeempty" size="24" color="#fff"></uni-icons>
					</view>
				</view>
				
				<!-- 内容区域 -->
				<scroll-view scroll-y="true" class="znj-add-good-modal-body" :style="{ maxHeight: '70vh' }">
					<view class="znj-add-good-form">
						<!-- 货品名称 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">货品名称：</text>
							<input class="znj-add-good-input" type="text" placeholder="请输入货品名称"
								v-model="newGoodInfo.name" />
						</view>
						<!-- 计算方式 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">计算方式：</text>
							<view class="znj-add-good-btn-group">
								<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 1}" @click="changSaleType(1)">按重量</button>
								<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 2}" @click="changSaleType(2)">按件数</button>
								<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 3}" @click="changSaleType(3)">按件拆包</button>
								<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 4}" @click="changSaleType(4)">散装</button>
							</view>
						</view>
						<!-- 单位 -->
						<view class="znj-add-good-row">
					<text class="znj-add-good-label">单位：</text>
					<view class="znj-add-good-unit-group" v-if="newGoodInfo.saleWay != 3">
						<button v-for="unit in unitList.slice(0, 4)" :key="unit.id" 
							class="znj-add-good-unit-btn" 
							:class="{active: newGoodInfo.unit === unit.unitName}" 
							@click="selectUnit(unit.unitName)">{{ unit.unitName }}</button>
						</view>
						<view v-else>
							<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[0].specName" @change="updateMainUnit">
								<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
							</select>
						</view>
						</view>
						
						<!-- 规格相关 -->
						<div v-if="newGoodInfo.saleWay != 1">
							<!-- 按件数规格 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 2">
								<text class="znj-add-good-label">规格：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.unit }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.price" placeholder="" />
									<span class="znj-add-good-spec-suffix">元</span>
								</div>
							</view>
							<!-- 按件拆包规格 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 3">
								<text class="znj-add-good-label">规格一：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
									<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[0].fixprice" placeholder="" />
									<span class="znj-add-good-spec-suffix">元</span>
								</div>
							</view>
							<!-- 规格二 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.specList.length > 1">
								<text class="znj-add-good-label">规格二：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[1].fixcount" placeholder="" />
							</div>
							<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[1].specName">
								<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
							</select>
							<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
									<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[1].fixprice" placeholder="" />
									<span class="znj-add-good-spec-suffix">元</span>
								</div>
							</view>
							<!-- 规格三 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.specList.length > 2">
								<text class="znj-add-good-label">规格三：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[2].fixcount" placeholder="" />
							</div>
							<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[2].specName">
								<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
							</select>
							<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[2].specName }} =</span>
									<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[2].fixprice" placeholder="" />
									<span class="znj-add-good-spec-suffix">元</span>
								</div>
							</view>
							<!-- 散装规格 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 4">
								<text class="znj-add-good-label">规格：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.unit }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.price" placeholder="" />
									<span class="znj-add-good-spec-suffix">元</span>
								</div>
							</view>
							<!-- 添加规格按钮 -->
							<div v-if="newGoodInfo.saleWay === 3">
								<view class="znj-add-good-row" v-if="newGoodInfo.specList.length < 3" style="margin-top: 10rpx;">
									<text class="znj-add-good-label"></text>
									<button class="znj-add-good-btn add" @click="addSpec">添加规格</button>
								</view>
							</div>
						</div>
						
						<!-- 分割线 -->
						<view class="znj-add-good-divider"></view>
						
						<!-- 单位重量 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.saleWay === 2">
							<text class="znj-add-good-label">单位重量：</text>
							<input class="znj-add-good-input" type="text" v-model="newGoodInfo.initWeight" placeholder="" />
						</view>
						
						<!-- 单位皮重 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">单位皮重：</text>
							<input class="znj-add-good-input" type="text" v-model="newGoodInfo.fixTare" placeholder="" />
						</view>
						
						<!-- 是否显示 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">是否显示：</text>
							<div class="znj-add-good-switch-group">
								<button class="znj-add-good-switch-btn" :class="{active: newGoodInfo.showToSale === 1}" @click="newGoodInfo.showToSale = 1">是</button>
								<button class="znj-add-good-switch-btn" :class="{active: newGoodInfo.showToSale === 0}" @click="newGoodInfo.showToSale = 0">否</button>
							</div>
						</view>
						
						<!-- 选择货品分类 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">货品分类：</text>
							<scroll-view class="scroll-view2" scroll-x style="height:60px;width: 500px;">
								<div style="margin-top: 5rpx;margin-left: 20rpx;">
									<view :class="{'coach_wrap': true,'coach_wrap_active': newGoodInfo.classifyId == item.value}"
										v-for="(item, index) in tabListOrigin" :key="index"
										@click="selectCategory(item.value)">
										{{item.name}}
									</view>
								</div>
							</scroll-view>
						</view>
					<!-- 操作按钮 -->
					<view class="znj-add-good-btns">
						<button class="znj-add-good-btn cancel" @click="showAddNewGood = false;newGoodInfoReset();">返回</button>
						<button class="znj-add-good-btn confirm" @click="addNewGood">添加</button>
					</view>
				</view>
				</scroll-view>
			</view>
		</view>
	</view>
	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import batch from '../../api/batch/batch'
	import labelApi from '../../api/label/labelApi';
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
			actionView: null,
			maskView: null,
			editType: "common",
			BatchCommodityList: [],
			unitList: [],
			targetId: "id-0-view",
				newGoodInfo: {
					name: "",
					classifyId: "",
					saleWay: 1, // 默认按重量
					unit: "件", // 默认单位
					price: "", // 价格
					initWeight: "", // 单位重量
					fixTare: "", // 单位皮重
					showToSale: 1, // 是否显示，默认显示
					specList: [] // 规格列表
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
			this.editType = options.edit;
			if (this.editType === "common") {
				this.BatchInfo = JSON.parse(options.Batch);
			} else {
				console.log("复制上一批", options)
				var batchSimple = JSON.parse(options.Batch);
				batch.getBatchInfoById(batchSimple.id).then(res => {
					this.BatchInfo = res.data;
					this.getLastBatchCommodityList(this.BatchInfo.companyId, this.BatchInfo.shipperId)
				})
			}

		},
		mounted() {
			// 在组件挂载后设置 scrollHeight
			this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.companyId = uni.getStorageSync('companyId');
			this.getAllcommodity();
			if (this.editType === "common") {
				this.getBatchCommodityList();
			}
			this.initSystem();
			this.getCompanyUnit();
		},
		methods: {
			getCompanyUnit(){
				let that = this;
				labelApi.GetCompanyUnit(this.companyId).then(res => {
					that.unitList = res.data;
				})
			},
			//切换计算方式
			SwitchCalcType(e, element) {
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
				if (this.newGoodInfo.name === null || this.newGoodInfo.name === "") {
					uni.showToast({
						icon: 'none',
						title: '物品名称不能为空',
						duration: 1200,
					});
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
				
				let that = this;
				
				// 需要转换成double,不然发送失败500
				for (var i = 0; i < that.newGoodInfo.specList.length; i++) {
					that.newGoodInfo.specList[i].fixcount = parseFloat(that.newGoodInfo.specList[i].fixcount || 0);
					that.newGoodInfo.specList[i].fixprice = parseFloat(that.newGoodInfo.specList[i].fixprice || 0);
				}
				
				// 如果售卖方式等于1-2-4的话需要处理unit
				if (that.newGoodInfo.saleWay === 1) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					});
				}
				if (that.newGoodInfo.saleWay === 2) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price || 0),
						parentId: "",
						price: 0
					});
				}
				if (that.newGoodInfo.saleWay === 4) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price || 0),
						parentId: "",
						price: 0
					});
				}
				
				// 需要转换成double,不然发送失败500
				that.newGoodInfo.price = parseFloat(that.newGoodInfo.price || 0);
				that.newGoodInfo.fixTare = parseFloat(that.newGoodInfo.fixTare || 0);
				that.newGoodInfo.initWeight = parseFloat(that.newGoodInfo.initWeight || 0);
				
				console.log("完整的newGoodInfo", that.newGoodInfo);
				
				category.CommoditySave3(JSON.stringify(that.newGoodInfo)).then(res => {
					uni.showToast({
						icon: 'none',
						title: '添加成功',
						duration: 1200,
					});
					that.showAddNewGood = false;
					that.newGoodInfoReset();
					that.getAllcommodity();
				}).catch(error => {
					console.error('添加商品失败:', error);
					uni.showToast({
						icon: 'none',
						title: '添加失败',
						duration: 1200,
					});
				});
			},
			// 重置新货品信息
			newGoodInfoReset() {
				this.newGoodInfo = {
					name: "",
					classifyId: "",
					saleWay: 1,
					unit: "件",
					price: "",
					initWeight: "",
					fixTare: "",
					showToSale: 1,
					specList: []
				};
			},
			// 改变销售方式
			changSaleType(type) {
				this.newGoodInfo.saleWay = type;
				this.newGoodInfo.specList = [];
				if (type == 3) {
					var guid1 = this.generateUUID();
					this.newGoodInfo.specList.push({
						id: guid1,
						specName: this.newGoodInfo.unit,
						fixprice: 0
					});
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: 0,
						parentId: guid1
					});
				}
			},
			// 生成UUID
			generateUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					const r = Math.random() * 16 | 0;
					const v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			// 添加规格
			addSpec() {
				if (this.newGoodInfo.specList.length < 3) {
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: 0,
						parentId: this.newGoodInfo.specList[this.newGoodInfo.specList.length - 1].id,
						price: 0
					});
				}
			},
			// 按createTime排序方法
			sortByCreateTime(data) {
				return data.sort((a, b) => {
					const dateA = new Date(a.createTime);
					const dateB = new Date(b.createTime);
					return dateB - dateA; // 降序排序，最新的在前面
				});
			},
			// 选择单位
			selectUnit(unit) {
				this.newGoodInfo.unit = unit;
				// 如果是按件拆包类型，也要更新specList中的单位
				if (this.newGoodInfo.saleWay === 3 && this.newGoodInfo.specList.length > 0) {
					this.newGoodInfo.specList[0].specName = unit;
				}
			},
			// 更新主单位（按件拆包时）
			updateMainUnit() {
				// 当按件拆包的主单位改变时，同步到newGoodInfo.unit
				if (this.newGoodInfo.specList.length > 0) {
					this.newGoodInfo.unit = this.newGoodInfo.specList[0].specName;
				}
			},
			// 选择商品分类（确保只能选择一个）
			selectCategory(classifyId) {
				console.log("this.tabListOrigin", this.tabListOrigin)
				this.newGoodInfo.classifyId = classifyId;
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
					// 过滤后也保持按createTime排序
					const filteredData = this.commodityList.filter(x => x.className == type);
					this.commodityShowList = this.sortByCreateTime(filteredData);
				}
			},
			//键盘数字输入处理
			NumberCk(val) {
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
			getLastBatchCommodityList(companyId, shipperId) {
				batch.GetLastBatchCommodity(companyId, shipperId).then(res => {
					console.log("res", res)
					// this.BatchCommodityList = res.data;
					for (var i = 0; i < res.data.length; i++) {
						var commodity = res.data[i];
						var commodityAdded = {
						id: "",
						name: commodity.commodityName,
						initMount: commodity.initMount,
						initWeight: commodity.initWeight,
						fixWeight:0,//单位重量（目前仅用于定装）
						commodityId: commodity.commodityId,
						calcType: 1,
						saleWay: commodity.saleWay,
						incomingPrice: 0,
						inboundAmount: 0
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
						CommodityList.push({
							"BatchId": that.BatchInfo.id,
							"commodityId": item.commodityId,
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
				})
				if (that.BatchCommodityList.length > 0) {
					category.BulkInsertPurchaseAssist(JSON.stringify(CommodityList)).then(res => {
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
							// 用户点击了确认
							this.BatchCommodityList.splice(index, 1)
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
			getAllcommodity() {
				category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
					console.log("res", res)
					// 按createTime降序排序（最新的在前面）
					const sortedData = this.sortByCreateTime(res.data);
					this.commodityList = sortedData;
					this.commodityShowList = sortedData;
					this.tabList = [{
						name: "全部",
						value: 0
					}];
					this.tabListOrigin = [];
					this.commodityList.forEach((item, index) => {
						if (!this.tabList.some(tab => tab.name === item.className)) {
							this.tabList.push({
								name: item.className,
								value: item.classId
							});
						};
						if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
							this.tabListOrigin.push({
								name: item.className,
								value: item.classId
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
					inboundAmount: 0
				}
				if (e.commoditySpecs.length > 0) {
					commodityAdded.spec = e.commoditySpecs[0]
				}
				this.BatchCommodityList.push(commodityAdded)
			}
			
			// 处理定装拆包
			if(e.saleWay === 3){
				uni.createSelectorQuery().selectAll(`#grid-item-${e.id}`).boundingClientRect(data => {
					console.log("data", data)
					this.createNativeView(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
				}).exec()
			}
		},
		
		// 用于添加拆包商品
		addCommodity2(e, spec) {
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
				inboundAmount: 0
			}
			commodityAdded.spec = spec
			this.BatchCommodityList.push(commodityAdded)
		},
		
		// 创建原生视图用于选择规格
		createNativeView(left, top, commodity, specList) {
			console.log(specList)
			if (this.actionView || !specList || specList.length < 0) return;
			let that = this;
			this.maskView = new plus.nativeObj.View("maskView", {
				top: "0px",
				left: "0px",
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.1)" // 接近透明
			});
			this.maskView.addEventListener("click", () => {
				that.actionView.close();
				that.actionView = null;
				that.maskView.close();
				that.maskView = null;
			});
			this.maskView.show();

			var zoneHeight = specList.length * 100;
			var zoneTop = top - 100 < 0 ? 0 : top - 100;
			zoneTop = zoneTop + zoneHeight > plus.screen.resolutionHeight ? plus.screen.resolutionHeight - zoneHeight : zoneTop;
			this.actionView = new plus.nativeObj.View("actionView", {
				backgroundColor: "rgba(255, 255, 255, 0.1)",
				border: "5px solid #FF0000",
				borderRadius: "10px",
				left: left,
				top: zoneTop,
				width: "150px",
				height: zoneHeight + "px"
			});

			for (var i = 0; i < specList.length; i++) {
				this.actionView.drawRect({
					color: "#000000", // 边框颜色
					width: "2px", // 边框宽度
					radius: "5px" // 圆角半径（关键！）
				}, {
					top: i * 100 + "px",
					left: "0px",
					width: "150px",
					height: "100px"
				});
				this.actionView.drawRect({
					color: "#ffffff", // 边框颜色
					width: "2px", // 边框宽度
					radius: "5px" // 圆角半径（关键！）
				}, {
					top: i * 100 + 2 + "px",
					left: "2px",
					width: "146px",
					height: "96px"
				});

				this.actionView.draw([{
					tag: 'font',
					id: 'font' + i,
					text: specList[i].specName,
					textStyles: {
						size: '50px'
					},
					// 添加边框样式
					border: {
						width: '2px', // 边框宽度
						style: 'solid', // 边框样式（solid, dashed, dotted）
						color: '#000000' // 边框颜色（黑色）
					},
					position: {
						top: i * 100 + 25 + 'px',
						left: '0px',
						width: '100%',
						height: '60px'
					}
				}]);
			}

			// 添加点击事件
			this.actionView.addEventListener("click", (e) => {
				const x = e.clientX;
				const y = e.clientY;
				// 判断点击位置
				for (var i = 0; i < specList.length; i++) {
					if (x > 0 && x < 150 && y > i * 100 && y < (i + 1) * 100) {
						that.addCommodity2(commodity, specList[i])
					}
				}

				that.actionView.close();
				that.actionView = null;
				that.maskView.close();
				that.maskView = null;
			});

			this.actionView.show();
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

	/* 添加新货品弹窗美化样式 */
	.znj-add-good-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9998;
	}
	
	.znj-add-good-modal-wrapper {
		width: 90%;
		max-width: 900px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}
	
	.znj-add-good-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		max-height: 90vh;
	}
	
	.znj-add-good-modal-header {
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		padding: 20px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.znj-add-good-modal-title {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
	}
	
	.znj-add-good-modal-close {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 50%;
		transition: background 0.2s;
	}
	
	.znj-add-good-modal-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.znj-add-good-modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}
	.znj-add-good-form {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	.znj-add-good-row {
		display: flex;
		align-items: center;
		gap: 5rpx;
		margin-bottom: 0rpx;
		min-height: 25rpx;
	}
	.znj-add-good-label {
		width: 120rpx;
		font-size: 15rpx;
		color: #333;
		text-align: right;
		font-weight: 500;
		flex-shrink: 0;
	}
	.znj-add-good-input {
		flex: 1;
		height: 32rpx;
		border-radius: 8rpx;
		border: 1px solid #e0e0e0;
		background: #fafbfc;
		padding: 0 16rpx;
		font-size: 15rpx;
		transition: border-color 0.2s;
	}
	.znj-add-good-input:focus {
		border-color: #1976d2;
		outline: none;
	}
	.znj-add-good-btn-group {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-type-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 15rpx;
		height: 35rpx;
		line-height: 35rpx;
		font-size: 20rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-type-btn.active, .znj-add-good-type-btn:hover {
		background: #1976d2;
		color: #fff;
		border-color: #1976d2;
	}
	.znj-add-good-btns {
		display: flex;
		justify-content: flex-end;
		gap: 24rpx;
		margin-top: 5rpx;
		padding-top: 5rpx;
		border-top: 1px solid #f0f0f0;
	}
	.znj-add-good-btn {
		min-width: 150rpx;
		height: 32rpx;
		line-height: 32rpx;
		padding: 0 10rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 25rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	.znj-add-good-btn.cancel {
		background: #bdbdbd;
		color: #fff;
	}
	.znj-add-good-btn.cancel:hover {
		background: #a0a0a0;
		transform: translateY(-1px);
	}
	.znj-add-good-btn.confirm {
		background: linear-gradient(135deg, #1976d2, #1565c0);
		color: #fff;
	}
	.znj-add-good-btn.confirm:hover {
		background: linear-gradient(135deg, #1565c0, #0d47a1);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(25,118,210,0.3);
	}
	
	/* 单位选择按钮组 */
	.znj-add-good-unit-group {
		display: flex;
		gap: 8rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-unit-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		padding: 0 12rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 18rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-unit-btn.active, .znj-add-good-unit-btn:hover {
		background: #07c160;
		color: #fff;
		border-color: #07c160;
	}

	.znj-add-good-unit-select {
		padding: 8rpx 12rpx;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		background: #fff;
		font-size: 28rpx;
		color: #333;
		min-width: 100rpx;
		outline: none;
	}

	.znj-add-good-unit-select:focus {
		border-color: #07c160;
	}
	
	/* 规格输入框样式 */
	.znj-add-good-spec-box {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		overflow: hidden;
		height: 32rpx;
		margin-left: 10rpx;
		background: #fafbfc;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-spec-prefix, .znj-add-good-spec-suffix {
		background: #1976d2;
		color: #fff;
		font-size: 20rpx;
		padding: 0 12rpx;
		height: 100%;
		display: flex;
		align-items: center;
		font-weight: 500;
	}
	.znj-add-good-spec-suffix {
		background: #07c160;
	}
	.znj-add-good-spec-input {
		width: 80rpx;
		flex: 1;
		padding: 0 12rpx;
		border: none;
		outline: none;
		font-size: 22rpx;
		background: transparent;
		text-align: center;
	}
	
	/* 分割线 */
	.znj-add-good-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, #e0e0e0, transparent);
		margin: 5rpx 0;
	}
	
	/* 开关按钮组 */
	.znj-add-good-switch-group {
		display: flex;
		width: 120rpx;
		height: 30rpx;
		border-radius: 8rpx;
		overflow: hidden;
		border: 1px solid #ddd;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-switch-btn {
		flex: 1;
		border: none;
		background: transparent;
		color: #333;
		font-size: 15rpx;
		line-height: 30rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-switch-btn.active {
		background: #07c160;
		color: #fff;
	}
</style>