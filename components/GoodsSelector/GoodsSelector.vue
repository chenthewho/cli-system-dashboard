<template>
	<div style="width: 220rpx; background-color: #ffffff;display: flex;">
		<div>
			<div style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;align-items: center;gap: 5rpx;">
				<!-- 返回按钮 -->
				<button
					v-if="showBackButton"
					style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #ff5500;"
					@click="handleBack">
					<uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
						color="#ffffff" style="margin-right: 5px;"></uni-icons>返回
				</button>
				
				<!-- 搜索框 -->
				<div class="search-box">
					<uni-icons type="search" size="14" color="#999" class="search-icon"></uni-icons>
					<input 
						type="text" 
						v-model="searchKeyword" 
						placeholder="搜索货品" 
						class="search-input"
						@input="handleSearch"
					/>
					<uni-icons 
						v-if="searchKeyword" 
						type="clear" 
						size="14" 
						color="#999" 
						class="clear-icon"
						@click="clearSearch"
					></uni-icons>
				</div>
			</div>
			
			<!-- 分类下拉选择 -->
			<div style="margin-top: 8px; margin-left: 10rpx; width: 200rpx;">
				<SimpleSelect 
					:value="activeType" 
					:name="activeType"
					:options="tabList" 
					placeholder="选择分类"
					slabel="name"
					svalue="name"
					height="32rpx"
					width="200rpx"
					padding="0 30rpx 0 12rpx"
					@selectitem="handleCategorySelect"
				></SimpleSelect>
			</div>
			
			<!-- 新增货品按钮 -->
			<div v-if="showAddButton" style="
				width: 205rpx;
				height: 30rpx;
				margin: 5rpx;
				background: green;
				color: white;
				line-height: 30rpx;
				text-align: center;
				border-radius: 4rpx;
				cursor: pointer;
				font-size: 18rpx;
				user-select: none;
				font-weight: bold;
			" @click="handleAddGood">
				<uni-icons custom-prefix="iconfont" type="icon-plus-square" size="30" color="#ffffff"
					style="margin-right: 5px;line-height: 30rpx;"></uni-icons>新增货品
			</div>
			
			<!-- 商品列表 -->
			<div>
				<scroll-view class="scrollArea" scroll-y="true"
					:style="{ height: scrollHeight + 'px',width:'217rpx',backgroundColor:'#ddd' }">
					<div
						style="display: flex; flex-direction: column; gap: 5rpx;background-color: #ddd;height: 100%;">
						<div style="margin-top: 2rpx;"></div>
						<div style="display: flex; flex-wrap: wrap; ">
							<div 
								:id="'grid-item-'+item.id" 
								:class="['clickCard', isActive(item.id) ? 'activeCard' : '' ]"
								@click="handleItemClick(item)" 
								v-for="item in filteredCommodityList"
								:key="item.id"
							>
								<div>
									<text style="font-size: 15rpx;font-weight: bold;">
										{{item.commodityName}}
									</text>
									<br>
									<div v-if="item.isMultiLevel==0">
										<text v-if="item.saleWay===1"
											style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 2rpx;">非定</text>
										<text v-if="item.saleWay===2"
											style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #00aa00;border-radius: 2rpx;">定{{item.initWeight?item.initWeight:''}}</text>
										<text v-if="item.saleWay===3"
											style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 2rpx;">拆</text>
										<text v-if="item.saleWay===4"
											style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #55aaff;border: 1px solid #55aaff;border-radius: 2rpx;">散</text>
										<text v-if="item.extralModel"
											style="margin-top: 5rpx;margin-left: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #ff5500;border: 1px solid #ff5500;border-radius: 2rpx;">{{item.extralModel.name}}</text>
									</div>
									<div v-if="item.isMultiLevel==1">
										<text 
											style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: red;border: 1px solid red;border-radius: 2rpx;">多等级</text>
									</div>
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
</template>

<script>
import SimpleSelect from '../SimpleSelect/SimpleSelect.vue'

export default {
	name: 'GoodsSelector',
	components: {
		SimpleSelect
	},
	props: {
		// 商品列表
		commodityList: {
			type: Array,
			default: () => []
		},
		// 分类列表
		categoryList: {
			type: Array,
			default: () => []
		},
		// 已选中的商品ID列表（用于高亮显示）
		selectedIds: {
			type: Array,
			default: () => []
		},
		// 滚动区域高度
		height: {
			type: Number,
			default: 0
		},
		// 是否显示返回按钮
		showBackButton: {
			type: Boolean,
			default: true
		},
		// 是否显示新增货品按钮
		showAddButton: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			searchKeyword: '', // 搜索关键词
			activeType: "全部", // 当前选中的分类
			scrollHeight: 0, // 滚动区域高度
			tabList: [] // 分类列表（带"全部"选项）
		}
	},
	computed: {
		// 过滤后的商品列表
		filteredCommodityList() {
			let filteredList = this.commodityList;
			
			// 按分类过滤
			if (this.activeType !== "全部") {
				filteredList = filteredList.filter(x => x.className === this.activeType);
			}
			
			// 按搜索关键词过滤
			if (this.searchKeyword && this.searchKeyword.trim()) {
				const keyword = this.searchKeyword.trim().toLowerCase();
				filteredList = filteredList.filter(item => 
					item.commodityName && item.commodityName.toLowerCase().includes(keyword)
				);
			}
			
			return filteredList;
		}
	},
	watch: {
		// 监听分类列表变化，更新tabList
		categoryList: {
			handler(newVal) {
				this.updateTabList(newVal);
			},
			immediate: true,
			deep: true
		},
		// 监听高度变化
		height: {
			handler(newVal) {
				if (newVal > 0) {
					this.scrollHeight = newVal;
				}
			},
			immediate: true
		}
	},
	mounted() {
		// 初始化滚动高度
		if (this.height > 0) {
			this.scrollHeight = this.height;
		} else {
			this.scrollHeight = uni.getWindowInfo().windowHeight - 165;
		}
	},
	methods: {
		// 更新分类列表（添加"全部"选项）
		updateTabList(categoryList) {
			this.tabList = [{ name: "全部", value: 0 }];
			
			if (categoryList && categoryList.length > 0) {
				categoryList.forEach((item, index) => {
					if (!this.tabList.some(tab => tab.name === item.name)) {
						this.tabList.push({
							name: item.name,
							value: index + 1
						});
					}
				});
			}
		},
		
		// 判断商品是否被选中
		isActive(id) {
			return this.selectedIds.includes(id);
		},
		
		// 处理分类选择
		handleCategorySelect(index) {
			const selectedCategory = this.tabList[index];
			if (selectedCategory) {
				this.activeType = selectedCategory.name;
				this.$emit('category-change', selectedCategory);
			}
		},
		
		// 搜索处理
		handleSearch() {
			this.$emit('search', this.searchKeyword);
		},
		
		// 清空搜索
		clearSearch() {
			this.searchKeyword = "";
			this.$emit('search', this.searchKeyword);
		},
		
		// 点击商品项
		handleItemClick(item) {
			this.$emit('item-click', item);
		},
		
		// 返回按钮
		handleBack() {
			this.$emit('back');
		},
		
		// 新增货品按钮
		handleAddGood() {
			this.$emit('add-good');
		}
	}
}
</script>

<style lang="scss" scoped>
/* 搜索框样式 */
.search-box {
	flex: 1;
	position: relative;
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 3rpx;
	padding: 4rpx 8rpx;
	height: 18rpx;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	margin-right: 5rpx;
}

.search-box:focus-within {
	background: #ffffff;
	box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.search-icon {
	margin-right: 6rpx;
	flex-shrink: 0;
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 12rpx;
	color: #333;
	outline: none;
	height: 100%;
	line-height: 22rpx;
	min-width: 0;
}

.search-input::placeholder {
	color: #999;
	font-size: 11rpx;
}

.clear-icon {
	margin-left: 4rpx;
	flex-shrink: 0;
	cursor: pointer;
	padding: 2rpx;
	border-radius: 50%;
	transition: background 0.2s;
}

.clear-icon:active {
	background: rgba(0, 0, 0, 0.05);
}

/* 商品卡片样式 */
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
	cursor: pointer;
	transition: all 0.2s ease;
}

.clickCard:hover {
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
	transform: translateY(-1rpx);
}

.activeCard {
	border: 3px solid #007AFF;
}
</style>

