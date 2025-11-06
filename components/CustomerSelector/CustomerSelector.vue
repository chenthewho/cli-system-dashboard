<template>
	<!-- 遮罩层 -->
	<div v-if="visible" class="modal-overlay" @click="handleClose">
		<!-- 弹窗内容 -->
		<div class="modal-container" @click.stop>
			<!-- 关闭按钮 -->
			<!-- <div class="modal-close" @click="handleClose">
				<text class="close-icon">×</text>
			</div> -->
			
			<div class="slot-content">
				<!-- 顶部工具栏 -->
				<div class="toolbar">
					<!-- 左侧：搜索区域 -->
					<div v-if="showSearch" class="search-area">
						<u-button 
							v-if="showAddButton"
							type="primary" 
							icon="plus-circle"
							@click="handleAddCustomer"
							text="添加顾客"
							class="add-btn"
						/>
						<div class="search-input-wrapper">
							<u--input 
								placeholder="搜索顾客名称" 
								border="surround" 
								v-model="searchKeyword"
								clearable 
								:adjustPosition="false"
								@change="handleSearch"
							/>
						</div>
					</div>
					
					<!-- 右侧：类型选择器 -->
					<view class="type-selector" v-if="showTypeSelector">
						<text 
							class="type-item" 
							:class="{ 'type-item-active': currentType === 1 }"
							@click="handleTypeChange(1)"
						>
							收银
						</text>
						<text 
							class="type-item" 
							:class="{ 'type-item-active': currentType === 2 }"
							@click="handleTypeChange(2)"
						>
							收筐
						</text>
					</view>
				</div>

				<!-- 客户列表 -->
				<scroll-view 
					class="scrollArea" 
					scroll-y="true" 
					:style="{ height: scrollHeight + 'px' }"
				>
					<view class="customer-grid">
						<view 
							class="customer-item" 
							v-for="(item, index) in filteredCustomers" 
							:key="item.id || `customer_${index}`"
							@click="handleSelect(item)"
						>
							<!-- 客户名称 -->
							<view class="customer-row">
								<text class="customer-name">{{ item.customName }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CustomerSelector',
	props: {
		// 控制显示/隐藏
		visible: {
			type: Boolean,
			default: false
		},
		// 客户列表
		customerList: {
			type: Array,
			default: () => []
		},
		// 模式：'XiaDan'（收银）、'ShouKuang'（收筐）
		mode: {
			type: String,
			default: 'XiaDan'
		},
		// 当前选择类型：1-收银，2-收筐
		selectType: {
			type: Number,
			default: 1
		},
		// 是否显示添加按钮
		showAddButton: {
			type: Boolean,
			default: true
		},
		// 是否显示搜索框
		showSearch: {
			type: Boolean,
			default: true
		},
		// 是否显示类型选择器
		showTypeSelector: {
			type: Boolean,
			default: true
		},
		// 窗口高度
		windowHeight: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			searchKeyword: '',
			currentType: this.selectType
		}
	},
	computed: {
		// 滚动区域高度
		scrollHeight() {
			const height = this.windowHeight > 0 ? this.windowHeight : uni.getWindowInfo().windowHeight
			return height - 220
		},
		
		// 过滤后的客户列表
		filteredCustomers() {
			if (!this.searchKeyword.trim()) {
				return this.customerList
			}
			
			return this.customerList.filter(item => 
				item.customName && 
				item.customName.toLowerCase().includes(this.searchKeyword.toLowerCase())
			)
		}
	},
	watch: {
		visible(newVal) {
			if (newVal) {
				// 弹窗打开时重置搜索
				this.searchKeyword = ''
			}
		},
		selectType(newVal) {
			this.currentType = newVal
		}
	},
	methods: {
		// 关闭弹窗
		handleClose() {
			this.$emit('close')
		},
		
		// 选择客户
		handleSelect(customer) {
			this.$emit('select', customer)
		},
		
		// 添加客户
		handleAddCustomer() {
			this.$emit('add-customer')
		},
		
		// 搜索处理
		handleSearch() {
			// 搜索关键词变化时，computed 会自动更新 filteredCustomers
		},
		
		// 切换类型
		handleTypeChange(type) {
			this.currentType = type
			this.$emit('change-type', type)
		}
	}
}
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10080;
	animation: fadeIn 0.3s ease-out;
}

/* 弹窗容器 */
.modal-container {
	width: 900px;
	max-width: 90vw;
	max-height: 80vh;
	background: #ffffff;
	border-radius: 16rpx;
	overflow: hidden;
	position: relative;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
	animation: slideIn 0.3s ease-out;
}

/* 关闭按钮 */
.modal-close {
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	background: #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	z-index: 10;
	
	&:hover {
		background: #e9e9e9;
		transform: scale(1.1);
	}
	
	&:active {
		background: #d9d9d9;
		transform: scale(0.95);
	}
}

.close-icon {
	font-size: 40rpx;
	color: #666;
	line-height: 1;
	font-weight: 300;
}

.slot-content {
	padding: 20rpx;
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

/* 动画 */
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideIn {
	from {
		transform: translateY(-50px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

.search-area {
	display: flex;
	align-items: center;
	gap: 4rpx;
	flex: 1;
}

.add-btn {
	height: 25rpx;
	border-radius: 5rpx;
	width: 80rpx;
}

.search-input-wrapper {
	width: 200rpx;
}

.type-selector {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 5rpx;
	padding: 2rpx;
    margin-left: 20rpx;
	gap: 5rpx;
}

.type-item {
	padding-left: 15rpx;
	padding-right: 15rpx;
	padding-top: 5rpx;
	padding-bottom: 5rpx;
	border-radius: 5rpx;
	font-size: 15rpx;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
}

.type-item-active {
	background: #2979ff;
	color: white;
	box-shadow: 0 2px 8px rgba(41, 121, 255, 0.3);
}

.customer-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8rpx;
	padding: 10rpx;
}

.customer-item {
	background: white;
	border-radius: 6rpx;
	padding: 15rpx;
    justify-items: center;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
	}
	
	&:active {
		transform: translateY(0);
	}
}

.customer-row {
	display: flex;
	align-items: center;
}

.customer-name {
	color: #000000;
	font-size: 14rpx;
	font-weight: bold;
}

.detail-row {
	margin-top: 3rpx;
}

.customer-detail {
	font-size: 12rpx;
	color: black;
}

.scrollArea {
	overflow-y: auto;
}
</style>

