<template>
	<view :style="{'display': 'flex','width': '100%','height':(windowHeight-65)+'px'}">
		<div style="width: 120rpx; background-color: #ffffff;display: flex;">
			<div>
				<div @click="tempSpuDialogVisible = true" style="
	          width: 108rpx;
	          height: 30rpx;
			  margin: 5rpx;
	          background: linear-gradient(90deg, #008200 0%, #00d400 100%);
	          color: white;
	          line-height: 30rpx;
	          text-align: center;
	          border-radius: 4rpx;
	          cursor: pointer;
			  font-size: 18rpx;
	          user-select: none;
	          font-weight: 600;
	          ">
					新增分类
				</div>
				<!-- 圆弧边卡片 -->
				<div style="display: flex; flex-direction: column; gap: 5rpx;">
					<div @click="exchangeTab(item)" v-for="item in categoryList" :key="item.id" :style="{
	       marginLeft: '10rpx',
	       width: '100rpx',
	       backgroundColor: currentTabId === item.id ? '#62d860' : '#ffffff', // 浅绿色或白色
	       borderRadius: '12rpx',
	       boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
	       padding: '10rpx',
	       boxSizing: 'border-box',
	       textAlign: 'left',
	       fontSize: '14rpx',
	       color: '#333'
	     }">
						<div>
							<text style="font-size: 15rpx; font-weight: bold;">
								{{ item.name }}
							</text>
						</div>
					</div>
				</div>
			</div>
			<!-- 垂直线 -->
			<div :style="{ 'width': '5rpx', 'background-color': '#ccc','height': (windowHeight-65)+'px' }"></div>
		</div>

		<div style="width: 100%; background-color: #ffffff; text-align: right;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;"><text
						style="margin-right: 5rpx;">{{currentTabName}}</text>
				</div>
				<div style="text-align: right; display: flex;">
					<button
						style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: orange;color:white;margin-right: 10rpx;"
						@click="showDeleteGood = !showDeleteGood">编辑</button>
					<button
						style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: green;color:white;"
						@click="showAddNewGood = true">添加货品</button>
				</div>
			</div>
			<div style="margin-left: 5rpx;margin-right: 5rpx;">
				<!-- 表头 -->
				<div
					style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
					<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">货品</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">规格</div>
					<!-- <div style="width: 50rpx;padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">单位</div> -->
					<div style="width: 50rpx; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;" v-if="showDeleteGood" >操作
					</div>
				</div>
				<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight}">
					<!-- 表格内容行 -->
					<div style="display: flex; border-bottom: 1px solid #ddd;font-weight: bold;" v-for="(item,index) in goodSelect" >
						<div style="flex: 3; padding: 8px; border-right: 1px solid #ddd; display: flex; justify-content: center; align-items: center;">
						  <div style="display: flex; align-items: center;">
							<div style="font-size: 12rpx;">{{item.name}}</div>
								<text v-if="item.saleWay===1" style="height: 15rpx;line-height: 15rpx; margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 3rpx;">非定装</text>
								<text v-if="item.saleWay===2" style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #00aa00;border-radius: 3rpx;">定{{item.initWeight?item.initWeight:''}}</text>
								<text v-if="item.saleWay===3" style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 3rpx;">定装拆包</text>
								<text v-if="item.saleWay===4" style="height: 15rpx;line-height: 15rpx;margin-left: 5rpx; font-size: 8rpx; padding-left: 2rpx;padding-right: 2rpx;color: #55aaff;border: 1px solid #55aaff;border-radius: 3rpx;">散装</text>
								<text v-if="item.extralModel" style="height: 15rpx;line-height: 15rpx; font-size: 8rpx;margin-left: 5rpx;  padding-left: 2rpx;padding-right: 2rpx;color: #ff5500;border: 1px solid #ff5500;border-radius: 3rpx;">{{item.extralModel.name}}</text>
						</div></div>
						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{item.specLabel}}
							<!-- <input inputmode="none" @click="showKeyBorad(index,2)" class="input1"
								v-model="item.initWeight" /> -->
						</div>
						<!-- <div
							style="width: 50rpx; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							<input inputmode="none" @click="showKeyBorad(index,1)" class="input1"
								v-model="item.price" />
						</div> -->
						<div
							style="width: 50rpx; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;line-height: 20rpx;" v-if="showDeleteGood">
							<uni-icons custom-prefix="iconfont" @click="deleteItem(item)" type="icon-shanchu" size="20"
								color="#aa0000"></uni-icons>
						</div>
					</div>
					<div style=" display: flex;flex-direction: column;align-items: center;">
						<u-divider class="divider" style=" width: 100%; "></u-divider>
					</div>
				</scroll-view>
<!-- 				<div style="position: fixed;bottom: 0;height: 30rpx;background: #ffffff;width: 100%;"
					v-if="!showKeyBoard1">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="">确认</button>
				</div> -->
			</div>
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
									type="icon-tuige" size="30" color="#ffffff" style="margin-right: 5rpx;"></uni-icons>
							</view>

						</view>
						<view class="MymaskList">
							<view class="maskListItem" @click="NumberCk(4)">4</view>
							<view class="maskListItem" @click="NumberCk(5)">5</view>
							<view class="maskListItem" @click="NumberCk(6)">6</view>

							<view class="maskListItem" @click="NumberCk('+')" style="font-size: 25px;color: white;">+
							</view>
						</view>
						<view class="MymaskList">
							<view class="maskListItem" @click="NumberCk(7)">7</view>
							<view class="maskListItem" @click="NumberCk(8)">8</view>
							<view class="maskListItem" @click="NumberCk(9)">9</view>
							<view class="maskListItem" @click="NumberCk('-')" style="font-size: 25px;color: white;">-
							</view>
						</view>
						<view class="MymaskList">
							<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
							<view class="maskListItem" @click="NumberCk('.')">.</view>
							<view class="maskListItem" style="background-color: #31BDEC;color: white;"
								@click="hideBorad">确定</view>
						</view>
					</view>
				</view>
			</div>
		</div>
		<u-modal title="添加新货品" class="znj-add-good-modal" :show="showAddNewGood" :closeOnClickOverlay="false"
			:showConfirmButton="false" :width="900" @close="showAddNewGood = false">
			<div class="znj-add-good-modal-content">
				<div class="znj-add-good-modal-inner">
					<uni-section title="表单校验" type="line">
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
								<div v-if="newGoodInfo.saleWay != 3">
									<selectLayUnit :zindex="1212" :value="newGoodInfo.unit" :name="newGoodInfo.unit" placeholder=" "
										:options="unit" @selectitem="editCardSpecSelct"></selectLayUnit>
								</div>
								<div v-else>
									<select-lay :zindex="1212" :value="newGoodInfo.specList[0].specName" name="name" placeholder=" "
										:options="unit" @selectitem="editCardSpecSelct1"></select-lay>
								</div>
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
									<text class="znj-add-good-label">规格：</text>
									<div class="znj-add-good-spec-box">
										<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
										<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[0].fixprice" placeholder="" />
										<span class="znj-add-good-spec-suffix">元</span>
									</div>
								</view>
								<!-- 规格二 -->
								<view class="znj-add-good-row" v-if="newGoodInfo.specList.length>1">
									<text class="znj-add-good-label">规格二：</text>
									<div class="znj-add-good-spec-box">
										<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
										<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[1].fixcount" placeholder="" />
									</div>
									<select-lay :zindex="1210" :value="newGoodInfo.specList[1].specName" name="name" placeholder=" " :textWidth="30"
										:options="unit" @selectitem="editCardSpecSelct2"></select-lay>
									<div class="znj-add-good-spec-box">
										<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
										<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[1].fixprice" placeholder="" />
										<span class="znj-add-good-spec-suffix">元</span>
									</div>
								</view>
								<!-- 规格三 -->
								<view class="znj-add-good-row" v-if="newGoodInfo.specList.length>2">
									<text class="znj-add-good-label">规格三：</text>
									<div class="znj-add-good-spec-box">
										<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
										<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[2].fixcount" placeholder="" />
									</div>
									<select-lay :zindex="1210" :value="newGoodInfo.specList[2].specName" name="name" placeholder=" " :textWidth="30"
										:options="unit" @selectitem="editCardSpecSelct3"></select-lay>
									<div class="znj-add-good-spec-box">
										<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[2].specName }} =</span>
										<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[2].fixprice" placeholder="" />
										<span class="znj-add-good-spec-suffix">元</span>
									</div>
								</view>
								<!-- 添加规格按钮 -->
								<div v-if="newGoodInfo.saleWay === 3">
									<view class="znj-add-good-row" v-if="newGoodInfo.specList.length<3" style="margin-top: 10rpx;">
										<text class="znj-add-good-label"></text>
										<button class="znj-add-good-btn add" @click="addSpec" >添加规格</button>
									</view>
								</div>
							</div>
							<!-- 分割线 -->
							<view class="znj-add-good-divider"></view>
							<!-- 附加物品 -->
							<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 1">
								<text class="znj-add-good-label">附加物品：</text>
								<select-lay :zindex="1211" :value="newGoodInfo.extralModelName" placeholder="请选择项目"
									:options="extralModelList" @selectitem="editCardExtraModelSelct" slabel="name"></select-lay>
							</view>
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
							<!-- 操作按钮 -->
							<view class="znj-add-good-btns">
								<button class="znj-add-good-btn cancel" @click="showAddNewGood = false;newGoodInfoReset();">返回</button>
								<button class="znj-add-good-btn confirm" @click="saveGood">添加</button>
							</view>
						</view>
					</uni-section>
				</div>
			</div>
		</u-modal>


		<u-modal title="添加新分类" :show="tempSpuDialogVisible" @close="tempSpuDialogVisible=false"
			:closeOnClickOverlay="false" :showConfirmButton="false" width="400">
			<div class="slot-content" style="overflow-y: auto;width: 100%;">
				<div class="slot-modal">
					<u--input placeholder="输入新分类名称" maxlength="100" v-model="tempSpuSkuName"></u--input>
					<div style="height: 40rpx;padding:10rpx ;">
						<!-- <u-divider class="divider" style=" width: 100%; "></u-divider> -->
						<div style="display:flex; justify-content:center; align-items:center; text-align:center; ">
							<div class="btn btn-info-plain" @click="tempSpuClose"
								style="font-size: 15rpx; margin-right: 40rpx;font-weight: bold;height: 30rpx;width: 60rpx;">
								取消</div>
							<div class="btn btn-primary" @click="tempSpuSubmit"
								style="font-size: 15rpx;font-weight: bold;height: 30rpx;width: 60rpx;">确定</div>
						</div>
					</div>
				</div>
			</div>
		</u-modal>

	</view>
</template>

<script>
	import category from '../../api/goods/category'
	import selectLayUnit from './component/selectLayUnit'
	export default {
		components: {
			selectLayUnit
		},
		data() {
			return {
				companyId: "",
				categoryList: [],
				currentTabId: "",
				currentTabName: "",
				goodSelect: [],
				editingIndex: 0,
				showKeyBoard1: false,
				windowWidth: 0,
				windowHeight: 0,
				scrollHeight: '0px',
				valueType: 0,
				newGoodInfo: {},
				tempSpuDialogVisible: false,
				tempSpuSkuName: "",
				showAddNewGood: false,
				showDeleteGood:false,
				extralModelList: [],
				unit: [{
						label: "件",
						value: "件"
					},
					{
							label: "筐",
							value: "筐"
						},
					{
						label: "包",
						value: "包"
					},
					{
						label: "个",
						value: "个"
					}
				]
			}
		},
		mounted() {
			this.companyId = uni.getStorageSync('companyId');
			this.getCategoryList();
			this.initSystem();
			this.newGoodInfoReset();
			this.getAllextralModel();
			// this.getallShipper();
			// this.getAllBatch();
		},
		methods: {
			editCardSpecSelct(e){
				console.log(this.unit[e]);
				this.newGoodInfo.unit = this.unit[e].value;
			},
			editCardSpecSelct1(e){
				this.newGoodInfo.specList[0].specName = this.unit[e].label;
			},
			editCardSpecSelct2(e){
				this.newGoodInfo.specList[1].specName = this.unit[e].label;
			},
			editCardSpecSelct3(e){
				this.newGoodInfo.specList[2].specName = this.unit[e].label;
			},
			editCardExtraModelSelct(e){
				this.newGoodInfo.extralModelId = this.extralModelList[e].id;
				this.newGoodInfo.extralModelName = this.extralModelList[e].name;
			},
			changSaleType(type) {
				this.newGoodInfo.saleWay = type;
				this.newGoodInfo.specList = [];
				if (type == 3) {
					var guid1 = this.generateUUID();
					this.newGoodInfo.specList.push({
						id: guid1,
						specName: this.newGoodInfo.unit,
						fixprice: this.newGoodInfo.fixprice
					});
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: this.newGoodInfo.fixprice,
						parentId:guid1
					});
				}

			},
			generateUUID() {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					const r = Math.random() * 16 | 0;
					const v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},
			addSpec() {
				if (this.newGoodInfo.specList.length < 3) {
					this.newGoodInfo.specList.push({
						id: this.generateUUID(),
						specName: this.newGoodInfo.unit,
						fixprice: this.newGoodInfo.fixprice,
						parentId: this.newGoodInfo.specList[this.newGoodInfo.specList.length - 1].id,
						price: 0
					});
				}
			},
			getAllextralModel() {
				let that = this;
				that.extralModelList = [{name:"无",id:""}]
				category.getallextralgood(this.companyId).then(res => {

					if (res.data != null) {
						for(var i = 0 ;i<res.data.length;i++){
								that.extralModelList.push(res.data[i]);
						}
					
					}
				})
			},
			//初始化新增物体对象
			newGoodInfoReset() {
				this.newGoodInfo = {
					name: "",
					saleWay: 1,
					unit: "件",
					specList: [],
					price: 0,
					fixTare:0,
					fixWeight:0,
					extralModelId: "",
					extralModelName: "无",
					showToSale: 1
				}
			},
			tempSpuClose() {
				this.tempSpuSkuName = '';
				this.tempSpuDialogVisible = false
			},
			tempSpuSubmit() {
				let that = this;
				var data = {
					Id: '',
					CompanyId: this.companyId,
					ClassName: this.tempSpuSkuName,
					ClassId: "",
					ParentId: ""
				};
				category.CreateClassify(JSON.stringify(data)).then(res => {
					that.tempSpuDialogVisible = false
					if (res != null && res != "") {
						uni.showToast({
							icon: 'success',
							title: '添加分组成功',
							duration: 1200,
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '添加分组失败',
							duration: 1200,
						});
					}
					that.getCategoryList();
					that.currentTabId = res;
					that.updateActiveTab(res);
				})
			},
			addNewGood() {
				this.goodSelect.push({
					id: this.generateGUID(),
					key: this.goodSelect.length + 1,
					name: "新物品",
					price: 0,
					initWeight: 0,
					inventory: 1
				})
			},
			//新增商品
			saveGood() {
				if(this.newGoodInfo.name===null||this.newGoodInfo.name===""){
					uni.showToast({
						icon: 'none',
						title: '物品名称不能为空',
						duration: 1200,
					});
					return;
				}
				
				let that = this;
				var CommodityData = [];
				//添加分类ID
				that.newGoodInfo.classifyId = that.currentTabId;
				//需要转换成double,不然发送失败500
				for (var i = 0; i < that.newGoodInfo.specList.length; i++) {
					that.newGoodInfo.specList[i].fixcount = parseFloat(that.newGoodInfo.specList[i].fixcount);
					that.newGoodInfo.specList[i].fixprice = parseFloat(that.newGoodInfo.specList[i].fixprice)
				}
				//如果售卖方式等于1-2-4的话需要处理unit
				if (that.newGoodInfo.saleWay === 1) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					})
				}
				if (that.newGoodInfo.saleWay === 2) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price),
						parentId: "",
						price: 0
					})
				}
				if (that.newGoodInfo.saleWay === 4) {
					that.newGoodInfo.specList.push({
						id: that.generateUUID(),
						specName: that.newGoodInfo.unit,
						fixcount: 1,
						fixprice: parseFloat(that.newGoodInfo.price),
						parentId: "",
						price: 0
					})
				}
				
				//需要转换成double,不然发送失败500
				that.newGoodInfo.price = parseFloat(that.newGoodInfo.price);
				that.newGoodInfo.fixTare = parseFloat(that.newGoodInfo.fixTare);
				that.newGoodInfo.initWeight = parseFloat(that.newGoodInfo.initWeight);
				category.CommoditySave3(JSON.stringify(that.newGoodInfo)).then(res => {
					uni.showToast({
						icon: 'none',
						title: '添加成功',
						duration: 1200,
					});
					that.showAddNewGood = false;
					that.newGoodInfoReset();
				})
			},
			deleteItem(e) {
				const indexToDelete = this.goodSelect.findIndex(item => item.id === e.id);
				// 如果找到了对应的索引，则删除该项
				if (indexToDelete !== -1) {
					this.goodSelect.splice(indexToDelete, 1);
				}
			},
			generateGUID() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000) // 10000
						.toString(16)
						.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			},
			NumberCk(val) {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.goodSelect[this.editingIndex].price;
						break;
					case 2:
						myvalue = this.goodSelect[this.editingIndex].initWeight;
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
						this.goodSelect[this.editingIndex].price = myvalue;
						break;
					case 2:
						this.goodSelect[this.editingIndex].initWeight = myvalue;
						break;
				}
			},
			Tuige() {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.goodSelect[this.editingIndex].price;
						break;
					case 2:
						myvalue = this.goodSelect[this.editingIndex].initWeight;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				myvalue = myvalue.slice(0, -1);
				switch (this.valueType) {
					case 1:
						this.goodSelect[this.editingIndex].price = myvalue === '' ? '0' : myvalue;
						break;
					case 2:
						this.goodSelect[this.editingIndex].initWeight = myvalue === '' ? '0' : myvalue;
						break;
				}
			},
			initSystem() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.windowWidth = res.windowWidth; // 输出屏幕宽度
						that.windowHeight = JSON.parse(JSON.stringify(res.windowHeight));
						that.scrollHeight = res.windowHeight - 150 + 'px';
					}
				});
			},
			showKeyBorad(index, type) {
				this.valueType = type;
				this.editingIndex = index;
				this.showKeyBoard1 = true;
				this.scrollHeight = this.windowHeight - 210 - 200 + 'px';
			},
			hideBorad() {
				this.scrollHeight = this.windowHeight - 200 + 'px';
				this.showKeyBoard1 = false;
			},
			exchangeTab(e) {
				this.currentTabId = e.id;
				this.updateActiveTab(e.id)
			},
			//获取种类
			async getCategoryList() {
				let that = this;
				this.categoryList = []
				var res = await category.categoryList(this.companyId);
				res.data.forEach(x => {
					this.categoryList.push({
						id: x.id,
						name: x.className
					});
				})
				if (res.data.length > 0) {
					that.updateActiveTab(this.categoryList[0].id)
				}
			},
			//获取货物列表
			updateActiveTab(tabId) {
				this.currentTabId = tabId;
				const foundTab = this.categoryList.find(tab => tab.id === tabId);
				this.currentTabName = foundTab.name;
				category.categoryListContent(tabId).then(res => {
					
					this.rows = [];
					for (let i = 0; i < res.data.length; i += 2) {
						this.rows.push(res.data.slice(i, i + 2));
					}
					this.goodSelect = [];
					for (let i = 0; i < res.data.length; i++) {
						// 处理规格信息
						let specLabel = '';
						if (res.data[i].commoditySpecs && res.data[i].commoditySpecs.length > 0) {
							specLabel = this.processCommoditySpecs(res.data[i].commoditySpecs);
						}
						
						this.goodSelect.push({
							id: res.data[i].id,
							key: i,
							name: res.data[i].commodityName,
							price: res.data[i].price,
							saleWay: res.data[i].saleWay,
							extralModel: res.data[i].extralModel,
							inventory: res.data[i].inventory,
							type: 0,
							initWeight: res.data[i].initWeight,
							specLabel: specLabel // 添加规格标签
						})
					}

				})
			},
			// 处理商品规格，转换为标签格式
			processCommoditySpecs(specs) {
				if (!specs || specs.length === 0) return '';
				
				// 按层级排序：parentId为null的在前
				const sortedSpecs = specs.sort((a, b) => {
					if (a.parentId === null && b.parentId !== null) return -1;
					if (a.parentId !== null && b.parentId === null) return 1;
					return 0;
				});
				
				let label = '';
				
				// 处理多层规格
				for (let i = 0; i < sortedSpecs.length; i++) {
					const spec = sortedSpecs[i];
					
					if (spec.parentId === null) {
						// 顶级规格
						label += `1${spec.specName}(${spec.fixprice}元)`;
					} else {
						// 子级规格
						const parentSpec = sortedSpecs.find(s => s.id === spec.parentId);
						if (parentSpec) {
							label += ` | 1${parentSpec.specName}=${spec.fixcount}${spec.specName}`;
							if (spec.fixprice > 0) {
								label += `(${spec.fixprice}元)`;
							}
						}
					}
					
					// 添加分隔符
					if (i < sortedSpecs.length - 1) {
						label += '';
					}
				}
				
				return label;
			},
		}

	}
</script>

<style>
	.btn-show {
		padding: 5px 15px;
		margin: 0 5px;
		border: 1px solid #ddd;
		background: transparent;
		/* 默认镂空 */
		color: #333;
		border-radius: 4px;
	}

	.btn-show.active {
		background: #07c160;
		/* 选中时填满 */
		color: white;
		border-color: #07c160;
	}

	.input-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.input-container input {
		width: 70%;
		height: 70rpx;
		border: 1px solid #ccc;
		border-radius: 5rpx;
		width: 100rpx;
		padding-right: 10rpx;
	/* 	 padding: 8px 10px; */
		 border: 1rpx solid gray;
		  outline: none; 
		  font-size: 15rpx;
		  font-weight: bold;
		  height: 15rpx;
		  text-align: right;
		/* padding: 0 10rpx; */
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

	.shell-type-btn {
		background: transparent;
		border: 1px solid #1890ff;
		color: #1890ff;
		padding: 0 15px;
		border-radius: 4px;
		height: 40px;
		line-height: 40px;
	}

	.shell-type-btn-active {
		background: #1890ff;
		border: 1px solid #1890ff;
		color: white;
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

	/* 添加新货品弹窗美化样式 */
	.znj-add-good-modal-content {
		background: transparent;
		width: 100%;
		box-sizing: border-box;
	}
	.znj-add-good-modal-inner {
		margin: 2rpx;
		padding: 10rpx;
		border-radius: 16px;
		background: white;
		box-shadow: 0 0 5rpx #9e9e9e;
		max-height: 70vh;
		overflow-y: auto;
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
	.znj-add-good-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, #e0e0e0, transparent);
		margin: 5rpx 0;
	}
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
	.znj-add-good-btn.confirm, .znj-add-good-btn.add {
		background: linear-gradient(135deg, #1976d2, #1565c0);
		color: #fff;
	}
	.znj-add-good-btn.confirm:hover, .znj-add-good-btn.add:hover {
		background: linear-gradient(135deg, #1565c0, #0d47a1);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(25,118,210,0.3);
	}
</style>