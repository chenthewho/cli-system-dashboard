<template>
	<view v-if="show" class="znj-add-good-modal-mask" @click="handleClose">
		<!-- 下拉选择蒙板 -->
		<view v-if="activeSelect.type" class="native-select-mask" @click.stop="closeSelect"></view>
		
		<!-- 全局下拉选项（提升到外层，使用fixed定位） -->
		<view v-if="activeSelect.type" class="native-select-options-global" :style="dropdownStyle" @click.stop>
			<!-- 包装类型选项 -->
			<template v-if="activeSelect.type === 'package'">
				<view 
					v-for="(option, optIndex) in packageTypeOptions" 
					:key="optIndex"
					class="native-select-item"
					:class="{ active: formData.gradeList[activeSelect.index] && formData.gradeList[activeSelect.index].packageType === option.label }"
					@click.stop="selectPackageType(activeSelect.index, optIndex)"
				>
					{{ option.label }}
				</view>
			</template>
			<!-- 单位选项 -->
			<template v-if="activeSelect.type === 'unit'">
				<view 
					v-for="(option, optIndex) in unitList" 
					:key="optIndex"
					class="native-select-item"
					:class="{ active: formData.gradeList[activeSelect.index] && formData.gradeList[activeSelect.index].countUnit === option.value }"
					@click.stop="selectUnit(activeSelect.index, optIndex)"
				>
					{{ option.label }}
				</view>
			</template>
		</view>
		
		<view class="znj-add-good-modal-wrapper" @click.stop>
			<view class="znj-add-good-modal-container">
				<!-- 标题栏 -->
				<view class="znj-add-good-modal-header">
					<button class="znj-add-good-header-btn cancel" @click="handleCancel">返回</button>
					<text class="znj-add-good-modal-title">添加新货品</text>
					<button class="znj-add-good-header-btn confirm" @click="handleConfirm">添加</button>
				</view>
				
				<!-- 内容区域 -->
				<scroll-view scroll-y="true" class="znj-add-good-modal-body">
					<view class="znj-add-good-form">
						<!-- 货品名称 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">货品名称：</text>
							<input class="znj-add-good-input-name" type="text" placeholder="请输入货品名称"
								v-model="formData.name" />
						</view>
						
					<!-- 货品分类选择 - 移到货品名称下面，改成下拉框 -->
					<view class="znj-add-good-row" v-if="categoryList && categoryList.length > 0">
						<text class="znj-add-good-label">货品分类：</text>
						<SimpleSelect 
							:zindex="1213" 
							:value="formData.categoryId" 
							:name="selectedCategoryName" 
							placeholder="请选择货品分类"
							:options="categoryOptions" 
							@selectitem="handleSelectCategory" 
							slabel="name"
							svalue="id"
							height="28rpx"
							width="200rpx"
							padding="0 20px 0 8px"
						></SimpleSelect>
					</view>
						
						<!-- 库存类型 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">库存类型：</text>
							<div class="znj-add-good-switch-group">
								<button class="znj-add-good-switch-btn" :class="{active: formData.stockType === 1}" @click="formData.stockType = 1">自营</button>
								<button class="znj-add-good-switch-btn" :class="{active: formData.stockType === 2}" @click="formData.stockType = 2">代卖</button>
							</div>
						</view>
						
						<!-- 是否分级 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">是否分级：</text>
							<div class="znj-add-good-switch-group">
								<button class="znj-add-good-switch-btn" :class="{active: formData.isMultiLevel === 1}" @click="formData.isMultiLevel = 1">是</button>
								<button class="znj-add-good-switch-btn" :class="{active: formData.isMultiLevel === 0}" @click="formData.isMultiLevel = 0">否</button>
							</div>
						</view>
						
						<!-- 是否共用库存 -->
						<view class="znj-add-good-row" v-if="formData.isMultiLevel === 1">
							<text class="znj-add-good-label">共用库存：</text>
							<div class="znj-add-good-switch-group">
								<button class="znj-add-good-switch-btn" :class="{active: formData.isShareStock === 1}" @click="setShareStock(1)">是</button>
								<button class="znj-add-good-switch-btn" :class="{active: formData.isShareStock === 0}" @click="setShareStock(0)">否</button>
							</div>
						</view>

						<!-- 分级区域 -->
						<div v-if="formData.isMultiLevel === 1" class="znj-add-good-grade-area">
							<view class="znj-add-good-grade-title">分级</view>
							<!-- 分级表格 -->
							<view class="znj-grade-table">
								<!-- 表头 -->
								<view class="znj-grade-table-header">
									<text class="znj-grade-th znj-grade-th-package">包装类型</text>
									<text class="znj-grade-th znj-grade-th-unit">计数单位</text>
									<text class="znj-grade-th znj-grade-th-weight">规格/均重</text>
									<text class="znj-grade-th znj-grade-th-name">货品等级</text>
									<text class="znj-grade-th znj-grade-th-price">货品单价</text>
									<text class="znj-grade-th znj-grade-th-action">操作</text>
								</view>
								
								<!-- 表格行 -->
								<view class="znj-grade-table-row" v-for="(grade, index) in formData.gradeList" :key="index">							
									<!-- 包装类型 -->
									<view class="znj-grade-td znj-grade-td-package">
										<view class="native-select-wrapper" :id="`select-package-${index}`">
											<view class="native-select" 
												:class="{ 'active': activeSelect.type === 'package' && activeSelect.index === index }"
												@click="toggleSelect('package', index, $event)">
												<text class="native-select-value">{{ grade.packageType }}</text>
												<text class="native-select-arrow">▼</text>
											</view>
										</view>
									</view>
									
									<!-- 计数单位 -->
									<view class="znj-grade-td znj-grade-td-unit">
										<view class="native-select-wrapper" :id="`select-unit-${index}`">
											<view class="native-select" 
												:class="{ 'active': activeSelect.type === 'unit' && activeSelect.index === index }"
												@click="toggleSelect('unit', index, $event)">
												<text class="native-select-value">{{ grade.countUnit }}</text>
												<text class="native-select-arrow">▼</text>
											</view>
										</view>
									</view>
									
									<!-- 规格/均重 -->
									<view class="znj-grade-td znj-grade-td-weight">
										<input class="znj-grade-input" type="text" v-model="grade.avgWeight" placeholder="输入规格" />
									</view>
									
									<!-- 货品等级 -->
									<view class="znj-grade-td znj-grade-td-name">
										<input class="znj-grade-input" type="text" v-model="grade.gradeName" placeholder="等级名称" />
									</view>
									
									<!-- 货品单价 -->
									<view class="znj-grade-td znj-grade-td-price">
										<input class="znj-grade-input" type="text" v-model="grade.price" placeholder="输入金额" />
									</view>
									
									<!-- 操作按钮 -->
									<view class="znj-grade-td znj-grade-td-action">
										<button class="znj-grade-delete-btn" @click="removeGrade(index)" v-if="formData.gradeList.length > 1">
											<uni-icons type="trash" size="20" color="#fff"></uni-icons>
										</button>
									</view>
								</view>
							</view>
							
							<!-- 添加分级按钮 -->
							<view class="znj-add-grade-btn-wrapper" @click="addGrade">
								<text class="znj-add-grade-btn">
									+ 新增货品等级
								</text>
							</view>
						</div>

						<!-- 计算方式 -->
						<view class="znj-add-good-row" v-if="formData.isMultiLevel == 0">
							<text class="znj-add-good-label">计算方式：</text>
							<view class="znj-add-good-btn-group">
								<button class="znj-add-good-type-btn" :class="{active: formData.saleWay === 1}" @click="changeSaleType(1)">按重量</button>
								<button class="znj-add-good-type-btn" :class="{active: formData.saleWay === 2}" @click="changeSaleType(2)">按件数</button>
								<button class="znj-add-good-type-btn" :class="{active: formData.saleWay === 3}" @click="changeSaleType(3)">按件拆包</button>
								<button class="znj-add-good-type-btn" :class="{active: formData.saleWay === 4}" @click="changeSaleType(4)">散装</button>
							</view>
						</view>

						<!-- 单位/规格 -->
						<view class="znj-add-good-row" v-if="formData.isMultiLevel == 0">
							<text class="znj-add-good-label" v-if="formData.saleWay === 2">单位：</text>
							<text class="znj-add-good-label" v-else-if="formData.saleWay === 3">单位一：</text>
							<text class="znj-add-good-label" v-else>单位：</text>
							<div v-if="formData.saleWay != 3">
								<selectLayUnit 
									:zindex="1212" 
									:value="formData.unit" 
									:name="formData.unit" 
									placeholder=" "
									:options="unitList" 
									@selectitem="editCardSpecSelct"
									@open="handleSelectOpen"
									:selectId="'spec-unit'"
									:activeSelectId="activeSelectId"
									height="28rpx"
									width="80rpx"
									padding="0 20px 0 8px"
								></selectLayUnit>
							</div>
							<div v-else>
								<selectLayUnit 
									:zindex="1212" 
									:value="formData.specList[0].specName" 
									height="28rpx"
									width="80rpx" 
									:name="formData.specList[0].specName" 
									placeholder=" "
									:options="unitList" 
									@selectitem="editCardSpecSelct1"
									@open="handleSelectOpen"
									:selectId="'spec-unit-1'"
									:activeSelectId="activeSelectId"
								></selectLayUnit>
							</div>
						</view>
						
						<!-- 规格相关 -->
						<div v-if="formData.saleWay != 1 && formData.saleWay != 2 && formData.isMultiLevel == 0" :class="{'znj-add-good-spec-area': formData.saleWay === 3}">
							<!-- 规格二 -->
							<view class="znj-add-good-row" v-if="formData.specList.length>1">
								<text class="znj-add-good-label">单位二：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ formData.specList[0].specName }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="formData.specList[1].fixcount" placeholder="" />
								</div>
								<selectLayUnit 
									:zindex="1211" 
									:value="formData.specList[1].specName" 
									:name="formData.specList[1].specName" 
									height="28rpx"
									width="80rpx" 
									placeholder=" " 
									:textWidth="30"
									:options="unitList" 
									@selectitem="editCardSpecSelct2"
									@open="handleSelectOpen"
									:selectId="'spec-unit-2'"
									:activeSelectId="activeSelectId"
								></selectLayUnit>
								<button class="znj-add-good-delete-btn" @click="removeSpec(1)">删除</button>
							</view>
							
							<!-- 规格三 -->
							<view class="znj-add-good-row" v-if="formData.specList.length>2">
								<text class="znj-add-good-label">单位三：</text>
								<div class="znj-add-good-spec-box">
									<span class="znj-add-good-spec-prefix">1 {{ formData.specList[1].specName }} =</span>
									<input class="znj-add-good-spec-input" type="text" v-model="formData.specList[2].fixcount" placeholder="" />
								</div>
								<selectLayUnit 
									:zindex="1210" 
									:value="formData.specList[2].specName" 
									:name="formData.specList[2].specName" 
									placeholder=" " 
									:textWidth="30"
									:options="unitList" 
									height="28rpx"
									width="80rpx" 
									@selectitem="editCardSpecSelct3"
									@open="handleSelectOpen"
									:selectId="'spec-unit-3'"
									:activeSelectId="activeSelectId"
								></selectLayUnit>
								<button class="znj-add-good-delete-btn" @click="removeSpec(2)">删除</button>
							</view>
							
							<!-- 添加规格按钮 -->
							<div v-if="formData.saleWay === 3">
								<view class="znj-add-good-row" v-if="formData.specList.length<3" style="margin-top: 10rpx;">
									<text class="znj-add-good-label"></text>
									<button class="znj-add-good-btn add" @click="addSpec">添加规格</button>
								</view>
							</div>
						</div>
						
						<!-- 分割线 -->
						<view class="znj-add-good-divider"></view>
						
						<!-- 附加物品 -->
						<view class="znj-add-good-row" v-if="formData.saleWay == 1">
							<text class="znj-add-good-label">附加物品：</text>
						<select-lay 
							:zindex="1211" 
							:value="formData.extralModelId" 
							:name="formData.extralModelName" 
							placeholder="请选择项目"
							:options="extralModelList" 
							@selectitem="editCardExtraModelSelct" 
							slabel="name"
							height="28rpx"
							width="120rpx"
							padding="0 20px 0 8px"
							:showLabel="false"
							maxHeight="200px"
						></select-lay>
						</view>
						
						<!-- 单位重量 -->
						<view class="znj-add-good-row" v-if="formData.saleWay === 2">
							<text class="znj-add-good-label">单位重量：</text>
							<input class="znj-add-good-input" type="text" v-model="formData.initWeight" placeholder="" />
						</view>
						
						<!-- 单位皮重 -->
						<view class="znj-add-good-row">
							<text class="znj-add-good-label">单位皮重：</text>
							<input class="znj-add-good-input" type="text" v-model="formData.fixTare" placeholder="" />
						</view>
						
					<!-- 是否显示 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">是否显示：</text>
						<div class="znj-add-good-switch-group">
							<button class="znj-add-good-switch-btn" :class="{active: formData.showToSale === 1}" @click="formData.showToSale = 1">是</button>
							<button class="znj-add-good-switch-btn" :class="{active: formData.showToSale === 0}" @click="formData.showToSale = 0">否</button>
						</div>
					</view>
				</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import selectLayUnit from '../../pages/good/component/selectLayUnit';
import SimpleSelect from '../SimpleSelect/SimpleSelect.vue';

export default {
	name: 'AddGoodModalAdvanced',
	components: {
		selectLayUnit,
		SimpleSelect
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		unitList: {
			type: Array,
			default: () => [
				{ label: "件", value: "件" },
				{ label: "筐", value: "筐" },
				{ label: "包", value: "包" },
				{ label: "个", value: "个" }
			]
		},
		extralModelList: {
			type: Array,
			default: () => []
		},
		// 当前选中的分类ID
		currentCategoryId: {
			type: String,
			default: ''
		},
		// 分类列表（用于显示分类选择）
		categoryList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
		formData: {
			name: "",
			stockType: 1, // 1=自营，2=代卖，默认自营
			saleWay: 1,
			unit: "件",
			specList: [],
			price: 0,
			fixTare: 0,
			fixWeight: 0,
			initWeight: 0,
			extralModelId: "",
			extralModelName: "无",
			showToSale: 1,
			isMultiLevel: 0,
			isShareStock: 0,
			multiLevelList: [],
			categoryId: "", // 选中的分类ID
			gradeList: [{
				packageType: "定装",
				countUnit: "件",
				avgWeight: "",
				gradeName: "",
				price: ""
			}]
		},
			activeSelectId: '', // 当前打开的选择框ID
			activeSelect: { // 原生下拉选择状态
				type: '', // 'package' 或 'unit'
				index: -1, // 当前打开的行索引
				top: 0,
				left: 0,
				width: 0
			},
			packageTypeOptions: [
				{ label: "定装", value: "2" },
				{ label: "非定装", value: "1" },
				{ label: "散装", value: "4" }
			]
		}
	},
	computed: {
		// 下拉框样式
		dropdownStyle() {
			return {
				top: this.activeSelect.top + 'px',
				left: this.activeSelect.left + 'px',
				width: this.activeSelect.width + 'px'
			};
		},
		// 将分类列表转换为下拉框格式
		categoryOptions() {
			if (!this.categoryList || this.categoryList.length === 0) {
				return [];
			}
			// 统一转换为 { id, name } 格式
			return this.categoryList.map(item => ({
				id: item.id || item.value,
				name: item.name || item.label
			}));
		},
		// 获取选中的分类名称
		selectedCategoryName() {
			if (!this.formData.categoryId) {
				return '';
			}
			const selected = this.categoryOptions.find(item => item.id === this.formData.categoryId);
			return selected ? selected.name : '';
		}
	},
	methods: {
		// 关闭弹窗
		handleClose() {
			this.$emit('close');
		},
		
		// 取消
		handleCancel() {
			this.resetForm();
			this.$emit('close');
		},
		
	// 确认添加
	handleConfirm() {
		// 验证表单
		if (!this.formData.name || this.formData.name === '') {
			uni.showToast({
				icon: 'none',
				title: '物品名称不能为空',
				duration: 1200,
			});
			return;
		}
		
		// 验证是否选择了分类（如果有分类列表的话）
		if (this.categoryList && this.categoryList.length > 0) {
			if (!this.formData.categoryId) {
				uni.showToast({
					icon: 'none',
					title: '请选择货品分类',
					duration: 1200,
				});
				return;
			}
		}
		
		// 如果是分级货品，验证所有分级的货品等级是否已填写
		if (this.formData.isMultiLevel === 1) {
			for (let i = 0; i < this.formData.gradeList.length; i++) {
				const grade = this.formData.gradeList[i];
				if (!grade.gradeName || grade.gradeName.trim() === '') {
					uni.showToast({
						icon: 'none',
						title: `请填写第${i + 1}个货品等级`,
						duration: 1500,
					});
					return;
				}
			}
		}
		
		// 添加分类ID（优先使用选择的分类，否则使用传入的当前分类）
		this.formData.classifyId = this.formData.categoryId || this.currentCategoryId;
		
		// 发送数据给父组件
		this.$emit('confirm', this.formData);
		this.resetForm();
	},
		
	// 重置表单
	resetForm() {
		this.formData = {
			name: "",
			stockType: 1,
			saleWay: 1,
			unit: "件",
			specList: [],
			price: 0,
			fixTare: 0,
			fixWeight: 0,
			initWeight: 0,
			extralModelId: "",
			extralModelName: "无",
			showToSale: 1,
			isMultiLevel: 0,
			isShareStock: 0,
			multiLevelList: [],
			categoryId: "", // 重置分类ID
			gradeList: [{
				packageType: "定装",
				countUnit: "件",
				avgWeight: "",
				gradeName: "",
				price: ""
			}]
		};
		this.activeSelectId = '';
		this.closeSelect();
	},
	
	// 选择分类 - 适配 select-lay 组件
	handleSelectCategory(index) {
		const selectedCategory = this.categoryOptions[index];
		if (selectedCategory) {
			this.formData.categoryId = selectedCategory.id;
			console.log('选择分类:', selectedCategory.name, this.formData.categoryId);
		}
	},
		
		// 切换原生下拉选择框
		toggleSelect(type, index, event) {
			if (this.activeSelect.type === type && this.activeSelect.index === index) {
				this.closeSelect();
			} else {
				const query = uni.createSelectorQuery().in(this);
				query.select(`#select-${type}-${index}`).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						const rect = res[0];
						this.activeSelect = {
							type,
							index,
							top: rect.top + rect.height + 2,
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
			if (this.formData.isShareStock === 1) {
				this.formData.gradeList.forEach((grade) => {
					grade.packageType = selectedOption.label;
				});
			} else {
				this.formData.gradeList[index].packageType = selectedOption.label;
			}
			this.closeSelect();
		},
		
		// 选择单位
		selectUnit(index, optIndex) {
			const selectedUnit = this.unitList[optIndex].value;
			if (this.formData.isShareStock === 1) {
				this.formData.gradeList.forEach((grade) => {
					grade.countUnit = selectedUnit;
				});
			} else {
				this.formData.gradeList[index].countUnit = selectedUnit;
			}
			this.closeSelect();
		},
		
		// 设置共用库存
		setShareStock(value) {
			this.formData.isShareStock = value;
			if (value === 1 && this.formData.gradeList.length > 0) {
				const firstGrade = this.formData.gradeList[0];
				const firstPackageType = firstGrade.packageType;
				const firstCountUnit = firstGrade.countUnit;
				
				this.formData.gradeList.forEach((grade) => {
					grade.packageType = firstPackageType;
					grade.countUnit = firstCountUnit;
				});
				
				uni.showToast({
					icon: 'success',
					title: '已统一所有分级',
					duration: 1000
				});
			}
		},
		
		// 添加等级
		addGrade() {
			this.formData.gradeList.push({
				packageType: "定装",
				countUnit: "件",
				avgWeight: "",
				gradeName: "",
				price: ""
			});
		},
		
		// 删除等级
		removeGrade(index) {
			if (this.formData.gradeList.length > 1) {
				this.formData.gradeList.splice(index, 1);
			}
		},
		
		// 切换销售类型
		changeSaleType(type) {
			this.formData.saleWay = type;
			this.formData.specList = [];
			if (type == 3) {
				var guid1 = this.generateUUID();
				this.formData.specList.push({
					id: guid1,
					specName: this.formData.unit,
					fixprice: this.formData.fixprice
				});
				this.formData.specList.push({
					id: this.generateUUID(),
					specName: this.formData.unit,
					fixprice: this.formData.fixprice,
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
			if (this.formData.specList.length < 3) {
				this.formData.specList.push({
					id: this.generateUUID(),
					specName: this.formData.unit,
					fixprice: this.formData.fixprice,
					parentId: this.formData.specList[this.formData.specList.length - 1].id,
					price: 0
				});
			}
		},
		
		// 删除规格
		removeSpec(index) {
			if (this.formData.specList.length > 1 && index > 0) {
				this.formData.specList.splice(index, 1);
				for (let i = 1; i < this.formData.specList.length; i++) {
					if (i === 1) {
						this.formData.specList[i].parentId = this.formData.specList[0].id;
					} else {
						this.formData.specList[i].parentId = this.formData.specList[i - 1].id;
					}
				}
			}
		},
		
		// 选择单位回调
		editCardSpecSelct(e) {
			this.formData.unit = this.unitList[e].value;
		},
		editCardSpecSelct1(e) {
			this.formData.specList[0].specName = this.unitList[e].label;
		},
		editCardSpecSelct2(e) {
			this.formData.specList[1].specName = this.unitList[e].label;
		},
		editCardSpecSelct3(e) {
			this.formData.specList[2].specName = this.unitList[e].label;
		},
		
		// 选择附加物品
		editCardExtraModelSelct(e) {
			this.formData.extralModelId = this.extralModelList[e].id;
			this.formData.extralModelName = this.extralModelList[e].name;
		},
		
		// 处理选择框打开
		handleSelectOpen(selectId) {
			this.activeSelectId = selectId;
		}
	}
}
</script>

<style scoped>
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
	border: 2px solid #ffffff;
	border-radius: 6rpx;
	font-size: 14rpx;
	font-weight: bold;
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
	margin-bottom: 12rpx;
	min-height: 32rpx;
	padding: 8rpx 12rpx;
	border-radius: 8rpx;
	border: 1px solid transparent;
	transition: all 0.3s ease;
	background: linear-gradient(135deg, #ffffff 0%, #fafbfd 100%);
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
	text-align: right;
	font-weight: 500;
	flex-shrink: 0;
}

.znj-add-good-input {
	width: 120rpx;
	height: 28rpx;
	border-radius: 4rpx;
	border: 1px solid #e0e0e0;
	background: #fafbfc;
	padding: 0 12rpx;
	font-size: 20px;
	transition: border-color 0.2s;
}

.znj-add-good-input-name {
	width: 240rpx;
	height: 28rpx;
	border-radius: 4rpx;
	border: 1px solid #e0e0e0;
	background: #fafbfc;
	padding: 0 12rpx;
	font-size: 20px;
	transition: border-color 0.2s;
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
}

.znj-add-good-type-btn {
	background: #f5f5f5;
	color: #666;
	border: 1px solid #ddd;
	border-radius: 6rpx;
	padding: 0 12rpx;
	height: 28rpx;
	line-height: 28rpx;
	font-size: 20px;
	cursor: pointer;
	transition: all 0.2s;
	font-weight: 500;
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
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.znj-add-good-grade-title {
	font-size: 28px;
	font-weight: bold;
	color: #1976d2;
	margin-bottom: 12rpx;
	padding-bottom: 8rpx;
	border-bottom: 2px solid #e3f2fd;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.znj-add-good-spec-box {
	display: flex;
	align-items: center;
	border: 1px solid #ddd;
	border-radius: 6rpx;
	overflow: hidden;
	height: 28rpx;
	background: #fafbfc;
}

.znj-add-good-spec-prefix, .znj-add-good-spec-suffix {
	background: #1976d2;
	color: #fff;
	font-size: 22rpx;
	padding: 0 10rpx;
	height: 100%;
	display: flex;
	align-items: center;
	font-weight: 500;
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
	font-size: 22rpx;
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
	border-radius: 6rpx;
	overflow: hidden;
	border: 1px solid #ddd;
}

.znj-add-good-switch-btn {
	flex: 1;
	border: none;
	background: #f5f5f5;
	color: #666;
	font-size: 14rpx;
	line-height: 25rpx;
	cursor: pointer;
	transition: all 0.2s;
	font-weight: 500;
}

.znj-add-good-switch-btn.active {
	background: #1976d2;
	color: #fff;
}

.znj-add-good-btn {
	min-width: 100rpx;
	height: 28rpx;
	line-height: 28rpx;
	padding: 0 16rpx;
	border: none;
	border-radius: 6rpx;
	font-size: 14rpx;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
}

.znj-add-good-btn.add {
	background: #1976d2;
	color: #fff;
}

.znj-add-good-delete-btn {
	background: #f44336;
	color: #fff;
	border: none;
	border-radius: 4rpx;
	padding: 4rpx 8rpx;
	font-size: 12rpx;
	cursor: pointer;
	transition: all 0.2s;
	height: 24rpx;
	line-height: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 分级表格样式 */
.znj-grade-table {
	width: 100%;
	border: 1px solid #ddd;
	border-radius: 4rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
	margin-bottom: 12rpx;
}

.znj-grade-table-header {
	display: flex;
	background: #f5f5f5;
	border-bottom: 1px solid #ddd;
	font-weight: bold;
	position: sticky;
	top: 0;
	z-index: 10;
}

.znj-grade-th {
	padding: 6rpx 4px;
	text-align: center;
	font-size: 20px;
	color: #333;
	border-right: 1px solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
}

.znj-grade-th:last-child {
	border-right: none;
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
	background: linear-gradient(135deg, #ffffff 0%, #fafbfd 100%);
}

.znj-grade-table-row:hover {
	background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
	border-color: #90caf9;
	box-shadow: 0 2px 6px rgba(33, 150, 243, 0.15);
}

.znj-grade-td {
	padding: 6rpx 4rpx;
	text-align: center;
	font-size: 20rpx;
	color: #333;
	border-right: 1px solid #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.znj-grade-td:last-child {
	border-right: none;
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
	gap: 4rpx;
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
	border-radius: 4rpx;
	padding: 0 6rpx;
	font-size: 18rpx;
	text-align: center;
	background: #ffffff;
	transition: border-color 0.2s;
}

.znj-grade-input:focus {
	border-color: #1976d2;
	outline: none;
}

.znj-grade-delete-btn {
	width: 20rpx;
	height: 20rpx;
	background: #ff4444;
	border: none;
	border-radius: 4rpx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.znj-add-grade-btn-wrapper {
	display: flex;
	justify-content: center;
	padding: 12rpx 0;
	cursor: pointer;
}

.znj-add-grade-btn {
	color: #1976d2;
	font-size: 24px;
	font-weight: bold;
	padding: 8rpx 24rpx;
	border: 2px dashed #1976d2;
	border-radius: 8rpx;
	transition: all 0.2s;
	background: #e3f2fd;
}

.znj-add-grade-btn:hover {
	background: #1976d2;
	color: #fff;
}

/* 原生下拉选择框样式 */
.native-select-wrapper {
	position: relative;
	width: 100%;
	height: 100%;
}

.native-select {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 24rpx;
	padding: 0 6rpx;
	border: 1px solid #e0e0e0;
	border-radius: 4rpx;
	background: #fff;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 18rpx;
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
	font-size: 18rpx;
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

