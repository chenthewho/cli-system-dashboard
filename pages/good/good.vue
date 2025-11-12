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
			<scroll-view scroll-y="true" :style="{height:scrollHeight, width: '100%'}">
				<div @click="exchangeTab(item)" v-for="item in categoryList" :key="item.id" :style="{
       marginLeft: '10rpx',
       width: '100rpx',
       backgroundColor: currentTabId === item.id ? '#62d860' : '#ffffff', // 浅绿色或白色
       borderRadius: '12rpx',
       boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
       padding: '10rpx',
			 marginTop:'5rpx',
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
			</scroll-view>
			</div>
			<!-- 垂直线 -->
			<div :style="{ 'width': '5rpx', 'background-color': '#ccc','height': (windowHeight-65)+'px' }"></div>
		</div>

		<div style="width: 100%; background-color: #f5f5f5; text-align: right;">
	<div
		style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx;margin-top: 5rpx; display: flex; justify-content: space-between; align-items: center; background-color: #ffffff; padding: 0 10rpx; border-radius: 8rpx;">
		<div style="display: flex; align-items: center; gap: 10rpx;">
			<view style="position: relative; display: flex; align-items: center;">
				<uni-icons type="search" size="14" color="#999" style="position: absolute; left: 6rpx; z-index: 1;"></uni-icons>
				<input 
					class="search-input" 
					type="text" 
					v-model="searchKeyword" 
					placeholder="搜索商品" 
					style="height: 26rpx; line-height: 26rpx; padding-left: 26rpx; padding-right: 10rpx; border: 1rpx solid #e0e0e0; border-radius: 20rpx; font-size: 12rpx; width: 140rpx; background-color: #f5f5f5;" 
				/>
			</view>
			<div style="font-size: 15rpx; font-weight: bold;"><text
					style="margin-right: 5rpx;">{{currentTabName}}</text>
			</div>
		</div>
		<div style="text-align: right; display: flex; align-items: center; gap: 10rpx;">
			<button
				style="height: 24rpx;line-height: 24rpx;font-weight: bold;background-color: orange;color:white;border-radius: 4rpx;padding: 0 12rpx;"
				@click="showDeleteGood = !showDeleteGood">编辑</button>
		</div>
	</div>
			<div style="margin-left: 5rpx;margin-right: 5rpx; overflow: hidden;">
				<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight, width: '100%'}">
					<!-- 宫格布局 -->
					<div class="goods-grid-container">
						<!-- 添加货品卡片（始终第一个） -->
						<div class="grid-item add-item" :style="{ width: gridItemWidth }" @click="showAddNewGood = true">
							<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 40rpx;">
								<uni-icons type="plusempty" size="32" color="#07c160"></uni-icons>
								<div style="margin-top: 8rpx; font-size: 14rpx; color: #07c160; font-weight: bold;">添加货品</div>
							</div>
						</div>
						
					<!-- 普通商品卡片 -->
					<div v-for="(item, index) in filteredGoodSelect" :key="item.id || index" 
						 class="grid-item" 
						 :style="{ width: gridItemWidth, position: 'relative' }"
						 @click="handleGoodClick(item)">
							<!-- 删除按钮 -->
							<div v-if="showDeleteGood" 
								class="delete-icon" 
								@click.stop="deleteItem(item)">
								<uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
							</div>
							
							<!-- 商品名称 -->
							<div style="text-align: left; font-weight: bold; font-size: 16rpx; letter-spacing: 1rpx; display: flex;">
								{{ item.name }}
							</div>
							
							<!-- 标签区域 -->
							<div style="font-size: 12rpx; margin-top: 6rpx; font-weight: bold; display: flex; flex-direction: column; text-align: left;">
								<div style="text-align: left; display: flex; flex-wrap: wrap; gap: 4rpx;">
									<div v-if="item.saleWay===1" class="good-tag" style="color: #31BDEC; border-color: #31BDEC;">非定装</div>
									<div v-if="item.saleWay===2" class="good-tag" style="color: #00aa00; border-color: #00aa00;">定{{item.initWeight?item.initWeight:''}}</div>
									<div v-if="item.saleWay===3" class="good-tag" style="color: #aa55ff; border-color: #aa55ff;">拆包</div>
									<div v-if="item.saleWay===4" class="good-tag" style="color: #55aaff; border-color: #55aaff;">散</div>
									<div v-if="item.extralModel" class="good-tag" style="color: #ff5500; border-color: #ff5500;">{{item.extralModel.name}}</div>
								</div>
								
								<!-- 规格信息 -->
								<div style="margin-top: 8rpx; font-size: 11rpx; color: #666;">
									{{item.specLabel}}
								</div>
							</div>
						</div>
					</div>
					<div style="display: flex; flex-direction: column; align-items: center;">
						<u-divider class="divider" style="width: 100%;"></u-divider>
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
	<!-- 添加新货品弹窗 - 使用组件 -->
	<AddGoodModalAdvanced
		:show="showAddNewGood"
		:unitList="unit"
		:extralModelList="extralModelList"
		:currentCategoryId="currentTabId"
		@close="showAddNewGood = false"
		@confirm="saveGood"
	/>
	
	<!-- 编辑货品弹窗 - 使用组件 -->
	<EditGoodModalAdvanced
		:show="showEditGood"
		:unitList="unit"
		:extralModelList="extralModelList"
		:currentCategoryId="currentTabId"
		:categoryList="categoryList"
		:editData="editingGood"
		@close="showEditGood = false"
		@success="handleEditSuccess"
	/>


	<!-- 添加新分类弹窗 -->
	<view v-if="tempSpuDialogVisible" class="znj-add-category-modal-mask" @click="tempSpuClose">
		<view class="znj-add-category-modal-wrapper" @click.stop>
			<view class="znj-add-category-modal-container">
				<!-- 标题栏 -->
				<view class="znj-add-category-modal-header">
					<view class="znj-add-category-title-wrapper">
						<uni-icons custom-prefix="iconfont" type="icon-fenlei" size="24" color="#ffffff"></uni-icons>
						<text class="znj-add-category-modal-title">添加新分类</text>
					</view>
					<view class="znj-add-category-modal-close" @click="tempSpuClose">
						<uni-icons type="closeempty" size="24" color="#fff"></uni-icons>
					</view>
				</view>
				
				<!-- 内容区域 -->
				<view class="znj-add-category-modal-body">
					<div class="znj-add-category-form">
						<div class="znj-add-category-row">
							<text class="znj-add-category-label">分类名称：</text>
							<input class="znj-add-category-input" 
								type="text" 
								placeholder="请输入分类名称" 
								maxlength="20"
								v-model="tempSpuSkuName" />
						</div>
					</div>
					
					<!-- 操作按钮 -->
					<div class="znj-add-category-btns">
						<button class="znj-add-category-btn cancel" @click="tempSpuClose">取消</button>
						<button class="znj-add-category-btn confirm" @click="tempSpuSubmit">确定</button>
					</div>
				</view>
			</view>
		</view>
	</view>

	</view>
</template>

<script>
	import category from '../../api/goods/category'
	import selectLayUnit from './component/selectLayUnit'
	import labelApi from '../../api/label/labelApi';
	import AddGoodModalAdvanced from '../../components/AddGoodModal/AddGoodModalAdvanced.vue';
	import EditGoodModalAdvanced from '../../components/AddGoodModal/EditGoodModalAdvanced.vue';
	
	export default {
		components: {
			selectLayUnit,
			AddGoodModalAdvanced,
			EditGoodModalAdvanced
		},
		data() {
			return {
				companyId: "",
				categoryList: [],
				currentTabId: "",
				currentTabName: "",
				goodSelect: [],
				searchKeyword: '', // 搜索关键词
				editingIndex: 0,
				showKeyBoard1: false,
				windowWidth: 0,
				windowHeight: 0,
			scrollHeight: '0px',
			valueType: 0,
			tempSpuDialogVisible: false,
			tempSpuSkuName: "",
			showAddNewGood: false,
			showEditGood: false,
			editingGood: null,
			showDeleteGood: false,
			extralModelList: [],
			itemsPerRow: 4, // 每行显示的商品数量
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
	computed: {
		// 动态计算宫格项的宽度 - 固定每行4个
		gridItemWidth() {
			// 固定每行显示4个商品
			// 每个宫格占 25%，减去 margin (左右各3rpx) 并留出一些额外空间防止换行
			return 'calc(25% - 8rpx)';
		},
		// 过滤后的商品列表
		filteredGoodSelect() {
			if (!this.searchKeyword || this.searchKeyword.trim() === '') {
				return this.goodSelect;
			}
			const keyword = this.searchKeyword.toLowerCase().trim();
			return this.goodSelect.filter(item => {
				return item.name && item.name.toLowerCase().includes(keyword);
			});
		}
	},
	mounted() {
			this.companyId = uni.getStorageSync('companyId');
			this.getCategoryList();
			this.initSystem();
			this.getAllextralModel();
			this.getCompanyUnit();
			// this.getallShipper();
			// this.getAllBatch();
		},
		methods: {
			// 切换原生下拉选择框
			toggleSelect(type, index, event) {
				if (this.activeSelect.type === type && this.activeSelect.index === index) {
					// 如果点击的是已打开的选择框，则关闭
					this.closeSelect();
				} else {
					// 打开新的选择框，并计算位置
					const query = uni.createSelectorQuery().in(this);
					query.select(`#select-${type}-${index}`).boundingClientRect();
					query.exec((res) => {
						if (res && res[0]) {
							const rect = res[0];
							this.activeSelect = {
								type,
								index,
								top: rect.top + rect.height + 2, // 元素底部往下2px
								left: rect.left,
								width: rect.width
							};
						}
					});
				}
			},
			// 关闭原生下拉选择框
			closeSelect() {
				this.activeSelect = { 
					type: '', 
					index: -1,
					top: 0,
					left: 0,
					width: 0
				};
			},
			// 选择包装类型
			selectPackageType(index, optIndex) {
				const selectedOption = this.packageTypeOptions[optIndex];
				// 如果是共库模式，所有等级的包装类型都要统一
				if (this.newGoodInfo.isShareStock === 1) {
					this.newGoodInfo.gradeList.forEach((grade) => {
						grade.packageType = selectedOption.label;
					});
				} else {
					// 非共库模式，只修改当前行
					this.newGoodInfo.gradeList[index].packageType = selectedOption.label;
				}
				this.closeSelect();
			},
			// 选择单位
			selectUnit(index, optIndex) {
				const selectedUnit = this.unit[optIndex];
				// 如果是共库模式，所有等级的单位都要统一
				if (this.newGoodInfo.isShareStock === 1) {
					this.newGoodInfo.gradeList.forEach((grade) => {
						grade.countUnit = selectedUnit.value;
					});
				} else {
					// 非共库模式，只修改当前行
					this.newGoodInfo.gradeList[index].countUnit = selectedUnit.value;
				}
				this.closeSelect();
			},
			// 关闭添加货品弹窗
			closeAddGood() {
				this.closeSelect();
				this.showAddNewGood = false;
			},
			// 设置共用库存
			setShareStock(value) {
				this.newGoodInfo.isShareStock = value;
				// 如果选择共用库存，统一所有分级的单位和包装类型为第一个
				if (value === 1 && this.newGoodInfo.gradeList.length > 0) {
					const firstGrade = this.newGoodInfo.gradeList[0];
					const firstPackageType = firstGrade.packageType;
					const firstCountUnit = firstGrade.countUnit;
					
					// 统一所有分级
					this.newGoodInfo.gradeList.forEach((grade) => {
						grade.packageType = firstPackageType;
						grade.countUnit = firstCountUnit;
					});
					
					uni.showToast({
						icon: 'success',
						title: '已统一为第一个分级的类型',
						duration: 1500,
					});
				}
			},
			// 处理选择框打开事件
			handleSelectOpen(selectId) {
				this.activeSelectId = selectId;
			},
			getCompanyUnit(){
				let that = this;
				labelApi.GetCompanyUnit(this.companyId).then(res => {
					that.unit = [];
					for(var i = 0;i<res.data.length;i++){
						that.unit.push({
							label: res.data[i].unitName,
							value: res.data[i].unitName
						})
					}
				})
			},
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
				console.log("选择附加物品:", this.extralModelList[e]);
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
			removeSpec(index) {
				if (this.newGoodInfo.specList.length > 1 && index > 0) {
					// 删除指定索引的规格
					this.newGoodInfo.specList.splice(index, 1);
					
					// 重新设置parentId关系
					for (let i = 1; i < this.newGoodInfo.specList.length; i++) {
						if (i === 1) {
							this.newGoodInfo.specList[i].parentId = this.newGoodInfo.specList[0].id;
						} else {
							this.newGoodInfo.specList[i].parentId = this.newGoodInfo.specList[i - 1].id;
						}
					}
				}
			},
			getAllextralModel() {
				let that = this;
				that.extralModelList = [{name:"无",id:""}]
				category.getallextralgood(this.companyId).then(res => {
					console.log("附加物品列表返回数据:", res.data);
					if (res.data != null) {
						for(var i = 0 ;i<res.data.length;i++){
								that.extralModelList.push(res.data[i]);
						}
						console.log("附加物品列表:", that.extralModelList);
					}
				})
			},
			//初始化新增物体对象
			newGoodInfoReset() {
				this.newGoodInfo = {
					name: "",
					stockType: 1, // 1=自营，2=代卖，默认自营
					saleWay: 1,
					unit: "件",
					specList: [],
					price: 0,
					fixTare:0,
					fixWeight:0,
					extralModelId: "",
					extralModelName: "无",
					showToSale: 1,
					isMultiLevel: 0,
					isShareStock: 0,
					multiLevelList: [], // 初始化分级列表数组
					gradeList: [{
						packageType: "定装",
						countUnit: "件",
						avgWeight: "",
						gradeName: "",
						price: ""
					}]
				}
			},
			// 添加等级
			addGrade() {
				this.newGoodInfo.gradeList.push({
					packageType: "定装",
					countUnit: "件",
					avgWeight: "",
					gradeName: "",
					price: ""
				});
			},
			// 删除等级
			removeGrade(index) {
				if (this.newGoodInfo.gradeList.length > 1) {
					this.newGoodInfo.gradeList.splice(index, 1);
				}
			},
			// 选择分级单位
			selectGradeUnit(index, e) {
				const selectedUnit = this.unit[e].value;
				// 如果是共库模式，所有等级的单位都要统一
				if (this.newGoodInfo.isShareStock === 1) {
					this.newGoodInfo.gradeList.forEach((grade) => {
						grade.countUnit = selectedUnit;
					});
				} else {
					// 非共库模式，只修改当前行
					this.newGoodInfo.gradeList[index].countUnit = selectedUnit;
				}
			},
			// 选择分级包装类型
			selectGradePackageType(index, e) {
				const selectedPackageType = this.packageTypeOptions[e].value;
				// 如果是共库模式，所有等级的包装类型都要统一
				if (this.newGoodInfo.isShareStock === 1) {
					this.newGoodInfo.gradeList.forEach((grade) => {
						grade.packageType = selectedPackageType;
					});
				} else {
					// 非共库模式，只修改当前行
					this.newGoodInfo.gradeList[index].packageType = selectedPackageType;
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
		// 新增商品 - 接收来自组件的表单数据
		saveGood(formData) {
			let that = this;
			
			// 包装类型选项（用于转换）
			const packageTypeOptions = [
				{ label: "定装", value: "2" },
				{ label: "非定装", value: "1" },
				{ label: "散装", value: "4" }
			];
			
			// 需要转换成double,不然发送失败500
			for (var i = 0; i < formData.specList.length; i++) {
				formData.specList[i].fixcount = parseFloat(formData.specList[i].fixcount) || 0;
				formData.specList[i].fixprice = parseFloat(formData.specList[i].fixprice) || 0;
			}
			
			// 如果售卖方式等于1-2-4的话需要处理unit
			if (formData.saleWay === 1 || formData.saleWay === 2 || formData.saleWay === 4) {
				formData.specList.push({
					id: that.generateUUID(),
					specName: formData.unit,
					fixcount: 1,
					fixprice: 0,
					parentId: "",
					price: 0
				});
			}
			
			// 需要转换成double,不然发送失败500
			formData.price = parseFloat(formData.price) || 0;
			formData.fixTare = parseFloat(formData.fixTare) || 0;
			formData.initWeight = formData.initWeight ? parseFloat(formData.initWeight) : 0;

			console.log("保存前的 formData:", formData);
			console.log("附加物品ID:", formData.extralModelId);
			console.log("附加物品名称:", formData.extralModelName);

			// 分级的话添加分级
			if (formData.isMultiLevel == 1) {
				// 添加分级
				for (var i = 0; i < formData.gradeList.length; i++) {
					let grade = formData.gradeList[i];
					
					// 将 packageType 转换成对应的 value 值
					let packageTypeValue = grade.packageType;
					const packageTypeOption = packageTypeOptions.find(opt => opt.label === grade.packageType || opt.value === grade.packageType);
					if (packageTypeOption) {
						packageTypeValue = packageTypeOption.value;
					}

					let levelModel = {
						specList: [],
						multiLevelList: [],
						classifyId: that.currentTabId,
						price: grade.price ? parseFloat(grade.price) : 0,
						name: grade.gradeName,
						fixTare: parseFloat(formData.fixTare),
						initWeight: grade.avgWeight ? parseFloat(grade.avgWeight) : 0,
						isShareStock: formData.isShareStock,
						stockType: formData.stockType, // 继承父级的库存类型
						extralModelId: formData.extralModelId, // 继承父级的附加物品ID
						saleWay: parseInt(packageTypeValue), // 使用转换后的 value
					};

					levelModel.specList.push({
						id: that.generateUUID(),
						specName: grade.countUnit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					});

					formData.multiLevelList.push(levelModel);
				}
			}

			console.log("保存前的 formData:", formData);

			category.CommoditySave3(JSON.stringify(formData)).then(res => {
				uni.showToast({
					icon: 'none',
					title: '添加成功',
					duration: 1200,
				});
				that.showAddNewGood = false;
				// 刷新货品列表
				that.updateActiveTab(that.currentTabId);
			}).catch(err => {
				console.error('保存失败:', err);
				uni.showToast({
					icon: 'none',
					title: '保存失败，请重试',
					duration: 1200,
				});
			});
		},
		// 点击商品卡片 - 打开编辑弹窗
		handleGoodClick(item) {
			// 如果处于删除模式，不打开编辑弹窗
			if (this.showDeleteGood) {
				return;
			}
			
			// 设置要编辑的商品数据
			this.editingGood = item;
			// 打开编辑弹窗
			this.showEditGood = true;
		},
		// 更新商品 - 接收来自编辑组件的表单数据
		updateGood(formData) {
			let that = this;
			
			// 包装类型选项（用于转换）
			const packageTypeOptions = [
				{ label: "定装", value: "2" },
				{ label: "非定装", value: "1" },
				{ label: "散装", value: "4" }
			];
			
			// 需要转换成double,不然发送失败500
			for (var i = 0; i < formData.specList.length; i++) {
				formData.specList[i].fixcount = parseFloat(formData.specList[i].fixcount) || 0;
				formData.specList[i].fixprice = parseFloat(formData.specList[i].fixprice) || 0;
			}
			
			// 如果售卖方式等于1-2-4的话需要处理unit
			if (formData.saleWay === 1 || formData.saleWay === 2 || formData.saleWay === 4) {
				// 检查是否已经有对应的 spec
				const hasUnitSpec = formData.specList.some(spec => spec.specName === formData.unit && spec.fixcount === 1);
				if (!hasUnitSpec) {
					formData.specList.push({
						id: that.generateUUID(),
						specName: formData.unit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					});
				}
			}
			
			// 需要转换成double,不然发送失败500
			formData.price = parseFloat(formData.price) || 0;
			formData.fixTare = parseFloat(formData.fixTare) || 0;
			formData.initWeight = formData.initWeight ? parseFloat(formData.initWeight) : 0;

			console.log("更新前的 formData:", formData);

			// 分级的话添加分级
			if (formData.isMultiLevel == 1) {
				formData.multiLevelList = []; // 重置分级列表
				// 添加分级
				for (var i = 0; i < formData.gradeList.length; i++) {
					let grade = formData.gradeList[i];
					
					// 将 packageType 转换成对应的 value 值
					let packageTypeValue = grade.packageType;
					const packageTypeOption = packageTypeOptions.find(opt => opt.label === grade.packageType || opt.value === grade.packageType);
					if (packageTypeOption) {
						packageTypeValue = packageTypeOption.value;
					}

					let levelModel = {
						specList: [],
						multiLevelList: [],
						classifyId: formData.classifyId || that.currentTabId,
						price: grade.price ? parseFloat(grade.price) : 0,
						name: grade.gradeName,
						fixTare: parseFloat(formData.fixTare),
						initWeight: grade.avgWeight ? parseFloat(grade.avgWeight) : 0,
						isShareStock: formData.isShareStock,
						stockType: formData.stockType,
						extralModelId: formData.extralModelId,
						saleWay: parseInt(packageTypeValue),
					};

					levelModel.specList.push({
						id: that.generateUUID(),
						specName: grade.countUnit,
						fixcount: 1,
						fixprice: 0,
						parentId: "",
						price: 0
					});

					formData.multiLevelList.push(levelModel);
				}
			}

			// 调用更新接口
			category.CommoditySave3(JSON.stringify(formData)).then(res => {
				uni.showToast({
					icon: 'success',
					title: '更新成功',
					duration: 1200,
				});
				that.showEditGood = false;
				that.editingGood = null;
				// 刷新货品列表
				that.updateActiveTab(that.currentTabId);
			}).catch(err => {
				console.error('更新失败:', err);
				uni.showToast({
					icon: 'none',
					title: '更新失败，请重试',
					duration: 1200,
				});
			});
		},
		// 编辑货品成功后的回调
		handleEditSuccess() {
			// 刷新当前分类的商品列表
			this.updateActiveTab(this.currentTabId);
		},
		deleteItem(e) {
			const that = this;
			// 调用API删除商品
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该货品吗？',
				success: (res) => {
					if (res.confirm) {
						// 显示加载提示
						uni.showLoading({
							title: '删除中...',
							mask: true
						});
						
						category.DeleteCommodity(e.id).then(response => {
							uni.hideLoading();
							
							// 判断返回结果
							if (response.data === false || response.data === 'false') {
								// 删除失败
								uni.showToast({
									title: '删除失败，产生过数据的货品不能删除',
									icon: 'none',
									duration: 2500
								});
							} else {
								// 删除成功，从列表中移除
								const indexToDelete = that.goodSelect.findIndex(item => item.id === e.id);
								if (indexToDelete !== -1) {
									that.goodSelect.splice(indexToDelete, 1);
								}
								uni.showToast({
									title: '删除成功',
									icon: 'success',
									duration: 1500
								});
							}
						}).catch(err => {
							uni.hideLoading();
							console.error('删除失败:', err);
							uni.showToast({
								title: '删除失败，请稍后重试',
								icon: 'none',
								duration: 2000
							});
						});
					}
				}
			});
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
					
					// 固定每行显示4个商品
					that.itemsPerRow = 4;
					console.log('屏幕宽度:', res.windowWidth, '每行显示:', that.itemsPerRow, '个商品');
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
							specList: res.data[i].commoditySpecs,
							extralModel: res.data[i].extralModel,
							inventory: res.data[i].inventory,
							type: 0,
							initWeight: res.data[i].initWeight,
							classId:res.data[i].classId,
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
	/* 宫格容器样式 */
	.goods-grid-container {
		display: flex;
		flex-wrap: wrap;
		padding: 5rpx 0;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}
	
	/* 宫格商品卡片样式 */
	.grid-item {
		background: #ffffff;
		border-radius: 12rpx;
		padding: 12rpx;
		margin: 3rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		border: 1px solid #e8e8e8;
		transition: all 0.2s;
		cursor: pointer;
		min-height: 80rpx;
		box-sizing: border-box;
	}
	
	.grid-item:hover {
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		transform: translateY(-2rpx);
	}
	
	/* 货品标签样式 */
	.good-tag {
		padding: 1rpx 3rpx;
		border: 1px solid;
		border-radius: 4rpx;
		font-size: 10rpx;
		line-height: 16rpx;
		display: inline-block;
	}
	
	/* 删除图标样式 */
	.delete-icon {
		position: absolute;
		top: 5rpx;
		right: 5rpx;
		width: 24rpx;
		height: 24rpx;
		background: #ff4444;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 10;
		box-shadow: 0 2rpx 4rpx rgba(255, 68, 68, 0.3);
	}
	
	.delete-icon:hover {
		background: #cc0000;
		transform: scale(1.1);
	}
	
	/* 滚动区域样式 */
	.scrollArea {
		width: 100%;
		overflow-x: hidden;
	}
	
	/* 添加货品卡片样式 */
	.add-item {
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border: 2px dashed #07c160;
		cursor: pointer;
		transition: all 0.3s;
	}
	
	.add-item:hover {
		background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
		border-color: #059669;
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.2);
	}
	
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
		max-width: 1000px;
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
		max-height: 85vh;
		height: 85vh;
	}
	
	.znj-add-good-modal-header {
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.znj-add-good-modal-title {
		font-size: 20rpx;
		font-weight: 600;
		color: #ffffff;
		flex: 1;
		text-align: center;
	}
	
	.znj-add-good-header-btn {
		min-width: 60rpx;
		height: 28rpx;
		line-height: 28rpx;
		padding: 0 16rpx;
		border: 1px solid #ffffff;
		border-radius: 4rpx;
		font-size: 22rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		color: #ffffff;
		background: transparent;
	}
	
	.znj-add-good-header-btn.cancel:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.znj-add-good-header-btn.confirm {
		background: rgba(255, 255, 255, 0.15);
	}
	
	.znj-add-good-header-btn.confirm:hover {
		background: rgba(255, 255, 255, 0.3);
	}
	
	.znj-add-good-modal-body {
		flex: 1;
		overflow: hidden;
		min-height: 0;
	}
	.znj-add-good-form {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 16rpx;
	}
	.znj-add-good-row {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 0rpx;
		min-height: 28rpx;
		justify-content: space-between;
		padding: 16rpx 12rpx;
		border-radius: 8rpx;
		margin-bottom: 12rpx;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 1px solid #e9ecef;
		transition: all 0.2s ease;
	}
	
	.znj-add-good-row:hover {
		background: linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%);
		border-color: #90caf9;
		box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
	}
	
	.znj-add-good-row:nth-child(even) {
		background: linear-gradient(135deg, #ffffff 0%, #f1f3f5 100%);
	}
	
	.znj-add-good-row:nth-child(even):hover {
		background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
		border-color: #81c784;
	}
	.znj-add-good-label {
		width: 150rpx;
		font-size: 30px;
		color: #333;
		text-align: left;
		font-weight: 400;
		flex-shrink: 0;
	}
	.znj-add-good-input {
		width: 120rpx;
		height: 28rpx;
		border-radius: 4rpx;
		border: 1px solid #ddd;
		background: #fff;
		padding: 0 12rpx;
		font-size: 25px;
		transition: border-color 0.2s;
		flex-shrink: 0;
	}
	.znj-add-good-input-name {
		width: 240rpx;
		height: 28rpx;
		border-radius: 4rpx;
		border: 1px solid #ddd;
		background: #fff;
		padding: 0 12rpx;
		font-size: 25px;
		transition: border-color 0.2s;
		flex-shrink: 0;
	}
	.znj-add-good-input-name:focus {
		border-color: #1976d2;
		outline: none;
	}
	.znj-add-good-input:focus {
		border-color: #1976d2;
		outline: none;
	}
	.znj-add-good-btn-group {
		display: flex;
		gap: 8rpx;
		flex-wrap: nowrap;
		flex: 1;
	}
	.znj-add-good-type-btn {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
		border-radius: 4rpx;
		padding: 0 10rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 25px;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 400;
		flex: 1;
		white-space: nowrap;
	}
	.znj-add-good-type-btn.active {
		background: #1976d2;
		color: #fff;
		border-color: #1976d2;
	}
	.znj-add-good-spec-area {
		background: #f5f5f5;
		border: 1px solid #e0e0e0;
		border-radius: 8rpx;
		padding: 12rpx;
		margin-top: 8rpx;
	}
	.znj-add-good-grade-area {
		background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
		border: 2px solid #e3e8ef;
		border-radius: 12rpx;
		padding: 16rpx;
		margin: 12rpx 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}
	.znj-add-good-grade-title {
		font-size: 28px;
		font-weight: bold;
		color: #1976d2;
		margin-bottom: 16rpx;
		padding: 12rpx 16rpx;
		background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
		border-radius: 8rpx;
		text-align: center;
		letter-spacing: 2rpx;
		box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
	}
	.znj-add-good-grade-list {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}
	.znj-add-good-grade-item {
		background: #ffffff;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		padding: 12rpx;
		box-shadow: 0 2px 4px rgba(0,0,0,0.05);
	}
	.znj-add-good-grade-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
		padding-bottom: 8rpx;
		border-bottom: 1px solid #e8e8e8;
	}
	.znj-add-good-grade-name {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
	}
	.znj-add-good-spec-box {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 4rpx;
		overflow: hidden;
		height: 28rpx;
		background: #fff;
	}
	.znj-add-good-spec-prefix, .znj-add-good-spec-suffix {
		background: #1976d2;
		color: #fff;
		font-size: 22rpx;
		padding: 0 8rpx;
		height: 100%;
		display: flex;
		align-items: center;
		font-weight: 400;
		white-space: nowrap;
	}
	.znj-add-good-spec-suffix {
		background: #07c160;
	}
	.znj-add-good-spec-input {
		width: 60rpx;
		flex: 1;
		padding: 0 8rpx;
		border: none;
		outline: none;
		font-size: 24rpx;
		background: transparent;
		text-align: center;
	}
	.znj-add-good-divider {
		height: 1px;
		background: #e8e8e8;
		margin: 8rpx 0;
	}
	.znj-add-good-switch-group {
		display: flex;
		width: 100rpx;
		height: 25rpx;
		border-radius: 4rpx;
		overflow: hidden;
		border: 1px solid #ddd;
	}
	.znj-add-good-switch-btn {
		flex: 1;
		border: none;
		background: #f5f5f5;
		color: #666;
		font-size: 25px;
		line-height: 25rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 400;
	}
	.znj-add-good-switch-btn.active {
		background: #1976d2;
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
		min-width: 100rpx;
		height: 28rpx;
		line-height: 28rpx;
		padding: 0 16rpx;
		border: none;
		border-radius: 4rpx;
		font-size: 24px;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.2s;
	}
	.znj-add-good-btn.cancel {
		background: #e0e0e0;
		color: #666;
	}
	.znj-add-good-btn.confirm, .znj-add-good-btn.add {
		background: #1976d2;
		color: #fff;
	}
	.znj-add-good-delete-btn {
		background: #f44336;
		color: #fff;
		border: none;
		border-radius: 4rpx;
		padding: 0 10rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 22px;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.2s;
		margin-left: 8rpx;
	}

	/* 添加新分类弹窗美化样式 */
	.znj-add-category-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
	
	.znj-add-category-modal-wrapper {
		width: 85%;
		max-width: 700px;
		display: flex;
		flex-direction: column;
	}
	
	.znj-add-category-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
	}
	
	.znj-add-category-modal-header {
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		padding: 20px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.znj-add-category-title-wrapper {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}
	
	.znj-add-category-modal-title {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
		margin-left: 8px;
	}
	
	.znj-add-category-modal-close {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 50%;
		transition: background 0.2s;
	}
	
	.znj-add-category-modal-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.znj-add-category-modal-body {
		padding: 30px 24px;
	}
	.znj-add-category-form {
		margin-bottom: 30rpx;
	}
	.znj-add-category-row {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 20rpx;
		min-height: 40rpx;
	}
	.znj-add-category-label {
		width: 120rpx;
		font-size: 22rpx;
		color: #333;
		text-align: right;
		font-weight: 500;
		flex-shrink: 0;
	}
	.znj-add-category-input {
		flex: 1;
		height: 40rpx;
		border-radius: 8rpx;
		border: 2px solid #e0e0e0;
		background: #fafbfc;
		padding: 0 16rpx;
		font-size: 26rpx;
		transition: all 0.3s ease;
		box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-category-input:focus {
		border-color: #1976d2;
		background: #fff;
		outline: none;
		box-shadow: 0 0 0 3px rgba(25,118,210,0.1), inset 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-category-input::placeholder {
		color: #bbb;
	}
	.znj-add-category-btns {
		display: flex;
		justify-content: center;
		gap: 30rpx;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1px solid #f0f0f0;
	}
	.znj-add-category-btn {
		min-width: 120rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0 25rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 26rpx;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}
	.znj-add-category-btn.cancel {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
	}
	.znj-add-category-btn.cancel:hover {
		background: #ebebeb;
		transform: translateY(-2rpx);
		box-shadow: 0 4px 12px rgba(0,0,0,0.15);
	}
	.znj-add-category-btn.confirm {
		background: linear-gradient(135deg, #1976d2, #1565c0);
		color: #fff;
	}
	.znj-add-category-btn.confirm:hover {
		background: linear-gradient(135deg, #1565c0, #0d47a1);
		transform: translateY(-2rpx);
		box-shadow: 0 4px 16px rgba(25,118,210,0.4);
	}
	
	/* 分级表格样式 - 简洁紧凑风格 */
	.znj-grade-table {
		width: 100%;
		border: 1px solid #ddd;
		border-radius: 4rpx;
		background: #ffffff;
		margin-top: 8rpx;
		position: relative;
	}
	
	.znj-grade-table-header {
		display: flex;
		background: #f5f5f5;
		border-bottom: 1px solid #ddd;
		font-weight: 500;
		color: #666;
	}
	
	.znj-grade-th {
		padding: 6rpx 4px;
		text-align: center;
		font-size: 20px;
		border-right: 1px solid #e8e8e8;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.znj-grade-th:last-child {
		border-right: none;
	}
	
	.znj-grade-th-level {
		flex: 0 0 50rpx;
	}
	
	.znj-grade-th-package {
		flex: 0 0 80rpx;
	}
	
	.znj-grade-th-unit {
		flex: 0 0 80rpx;
	}
	
	.znj-grade-th-weight {
		flex: 1;
		min-width: 80rpx;
	}
	
	.znj-grade-th-name {
		flex: 1;
		min-width: 110rpx;
	}
	
	.znj-grade-th-price {
		flex: 0 0 70rpx;
	}
	
	.znj-grade-th-action {
		flex: 0 0 60rpx;
	}
	
	.znj-grade-table-row {
		display: flex;
		border-bottom: 1px solid #f0f0f0;
		transition: all 0.2s ease;
		position: relative;
		background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
		margin-bottom: 8rpx;
		border-radius: 6rpx;
		border: 1px solid #e9ecef;
	}
	
	.znj-grade-table-row:nth-child(even) {
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	}
	
	.znj-grade-table-row:last-child {
		margin-bottom: 0;
	}
	
	.znj-grade-table-row:hover {
		background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
		border-color: #90caf9;
		box-shadow: 0 2px 6px rgba(33, 150, 243, 0.15);
		transform: translateX(2px);
	}
	
	.znj-grade-td {
		padding: 6rpx 4rpx;
		text-align: center;
		font-size: 20rpx;
		border-right: 1px solid #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.znj-grade-td:last-child {
		border-right: none;
	}
	
	.znj-grade-td-level {
		flex: 0 0 50rpx;
		color: #666;
		font-weight: 400;
	}
	
	.znj-grade-td-package {
		flex: 0 0 80rpx;
	}
	
	.znj-grade-td-unit {
		flex: 0 0 80rpx;
	}
	
	.znj-grade-td-weight {
		flex: 1;
		min-width: 85rpx;
		flex-direction: column;
		gap: 2rpx;
	}
	
	.znj-grade-td-name {
		flex: 1;
		min-width: 115rpx;
	}
	
	.znj-grade-td-price {
		flex: 0 0 80rpx;
	}
	
	.znj-grade-td-action {
		flex: 0 0 60rpx;
	}
	
	.znj-grade-input {
		width: 90%;
		height: 24rpx;
		border: 1px solid #e0e0e0;
		border-radius: 2rpx;
		padding: 0 6rpx;
		font-size: 23px;
		text-align: center;
		background: #fff;
		transition: border-color 0.15s;
	}
	
	.znj-grade-input:focus {
		border-color: #1976d2;
		outline: none;
	}
	
	.znj-grade-unit-text {
		font-size: 16rpx;
		color: #999;
	}
	
	.znj-grade-delete-btn {
		width: 20rpx;
		height: 20rpx;
		background: #ff4444;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s;
		padding: 0;
	}
	
	.znj-grade-delete-btn:hover {
		background: #cc0000;
	}
	
	.znj-add-grade-btn-wrapper {
		margin-top: 8rpx;
		padding: 8rpx;
		border: 1px dashed #07c160;
		border-radius: 4rpx;
		background: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: all 0.15s;
	}
	
	.znj-add-grade-btn-wrapper:hover {
		background: #f9fff9;
	}
	
	.znj-add-grade-btn {
		background: transparent;
		border: none;
		color: #07c160;
		font-size: 20rpx;
		font-weight: 400;
		cursor: pointer;
		padding: 0;
	}
	
	.znj-extra-fee-wrapper {
		margin-top: 8rpx;
		padding: 8rpx 12rpx;
		background: #fafafa;
		border: 1px solid #e8e8e8;
		border-radius: 4rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.znj-extra-fee-icon {
		width: 28rpx;
		height: 28rpx;
		background: #f0fff0;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.znj-extra-fee-text {
		flex: 1;
		font-size: 20rpx;
		color: #333;
		font-weight: 400;
	}
	
	.znj-extra-fee-btn {
		background: transparent;
		border: none;
		color: #666;
		font-size: 18rpx;
		padding: 0;
		cursor: pointer;
	}
	
	/* 原生下拉选择样式 */
	.native-select-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.native-select {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 6rpx;
		height: 24rpx;
		border: 1px solid #e0e0e0;
		border-radius: 2rpx;
		background: #fff;
		cursor: pointer;
		transition: all 0.15s;
		font-size: 15rpx;
		font-weight: bold;
	}
	
	.native-select.active,
	.native-select:hover {
		border-color: #1976d2;
	}
	
	.native-select-value {
		flex: 1;
		color: #000;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.native-select-arrow {
		font-size: 10rpx;
		color: #999;
		margin-left: 4rpx;
		transition: transform 0.2s;
	}
	
	.native-select.active .native-select-arrow {
		transform: rotate(180deg);
	}
	
	/* 全局下拉选项（fixed定位，提升到外层） */
	.native-select-options-global {
		position: fixed;
		max-height: 200rpx;
		background: #fff;
		border: 1px solid #8b8b8b;
		border-radius: 4rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
		overflow-y: auto;
		z-index: 100001;
		padding: 4rpx 0;
	}
	
	.native-select-item {
		padding: 8rpx 10rpx;
		font-size: 14px;
		text-align: center;
		cursor: pointer;
		transition: background-color 0.15s;
		color: #333;
	}
	
	.native-select-item:hover {
		background-color: #f5f5f5;
	}
	
	.native-select-item.active {
		background-color: #007AFF;
		color: #fff;
	}
	
	.native-select-item.active:hover {
		background-color: #007AFF;
	}
	
	/* 原生下拉选择蒙板 */
	.native-select-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 100000;
	}
</style>