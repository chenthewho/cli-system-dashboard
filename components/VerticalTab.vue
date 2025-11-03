<template>
  <div class="vertical-tabs">
    <div class="tabs">
		<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
      <div
        v-for="tab in categoryList"
        :key="tab.name"
        class="tab"
        :class="{ active: activeTabId === tab.id }"
        @click="selectTab(tab)"
		@longpress="longpress(tab)"
      >
	  <div>
		 <!-- 批次显示：货主名 + 批次号后4位 -->
		 <template v-if="tab.shipperName && tab.batchCode">
			 <text> {{ tab.shipperName }}</text><br>
			 <text> {{ tab.batchCode.slice(-4)}}</text>
		 </template>
		 <!-- 分类显示：分类名称 -->
		 <template v-else>
			 <text> {{ tab.name }}</text><br>
		 </template>
	  </div>
      </div>
	  <!-- 自营分类列表（仅版本1和3显示，版本4已集成在上面的 categoryList 中） -->
	  <div
	    v-for="tab in categoryList_employ"
	    v-if="vesionType !== 4"
	    :key="tab.name"
	    class="tab"
	    :class="{ active: activeTabId === tab.id }"
	    @click="selectTab2(tab)"
	  >
	  <div>
	  		 <text> {{ tab.name }}</text><br>
	  </div>
	   
	   </div>
	  
	  </scroll-view>
    </div>
  </div>
</template>

<script>
import category from '../api/goods/category.js'

export default {
  name: 'VerticalTab',
   props: {
      categoryList: {
        type: Array,
        default: () => []
      },
	  activeTabId: {
		  type: String,
		  default: ""
	  }
    },
  data() {
    return {
      activeTab: 'tab1', 
	  vesionType:uni.getStorageSync("vesionType")??1, // 获取版本类型，默认为1
	  scrollHeight:0,
	  categoryList_employ:[],
	  isSelecting: false // 防止重复点击
    };
  },
  mounted(){
	  if(this.categoryList.length>0){
	  	this.activeTab = this.categoryList[0].name;
	  }
	  this.scrollHeight = uni.getWindowInfo().windowHeight - 120;
	//   if(this.vesionType==1||this.vesionType==3||this.vesionType==4){
 	// 			//暂不启用自营商品分类
 	// 			this.getCategoryList();
	//   } 
  },
  methods: {
	// 刷新方法 - 供父组件调用
	refresh() {
		console.log("refresh刷新");
		// 重新获取 vesionType
		this.vesionType = uni.getStorageSync("vesionType") ?? 1;
		console.log("refresh_vesionType",this.vesionType);
		// 重新执行 mounted 中的逻辑
		if(this.categoryList.length>0){
			this.activeTab = this.categoryList[0].name;
		}
		this.scrollHeight = uni.getWindowInfo().windowHeight - 120;
		// 当vesionType为1或3时，加载自营商品分类
		// 版本4不在这里加载，由 CashierGoodsPanel 统一处理
		if(this.vesionType==1||this.vesionType==3){
			this.getCategoryList();
		}
	},

		//暂不启用自营商品分类
	  async getCategoryList() {
	  	let that = this;
	  	this.categoryList_employ = [];
		let companyId = uni.getStorageSync('companyId');
	  	var res = await category.categoryList(companyId);
		console.log("getCategoryList",res.data);
	  	res.data.forEach(x => {
	  		this.categoryList_employ.push({
	  			id: x.id,
	  			name: x.className
	  		});
	  	})
		// 版本1或3时自动选择第一个分类
		if((that.vesionType==1||that.vesionType==3)&&that.categoryList_employ.length>0){
			that.selectTab2(that.categoryList_employ[0]);
		}
	  },
	  longpress(tab) {
		this.$emit('delete:activeTab', tab);
	  },
    selectTab(tab) {
	  // 防止重复点击
	  if (this.isSelecting || this.activeTabId === tab.id) {
	    return;
	  }
	  
	  this.isSelecting = true;
      this.activeTab = tab.name;
	  
	  // 智能判断类型：有 shipperName 说明是批次（代销），否则是分类（自营）
	  const type = tab.shipperName ? 1 : 2;
	  this.$emit('update:activeTab', {id:tab.id, type: type});
	  
	  // 300ms 后允许再次点击
	  setTimeout(() => {
	    this.isSelecting = false;
	  }, 300);
    },
	selectTab2(tab) {
	  // 防止重复点击
	  if (this.isSelecting || this.activeTabId === tab.id) {
	    return;
	  }
	  
	  this.isSelecting = true;
	  this.activeTab = tab.name;
	  this.$emit('update:activeTab', {id:tab.id,type:2});
	  
	  // 300ms 后允许再次点击
	  setTimeout(() => {
	    this.isSelecting = false;
	  }, 300);
	}
  },
};
</script>

<style scoped>
.vertical-tabs {
  display: flex; /* 使用 flexbox 布局 */
}

.tabs {
	margin-top: 5px;
	margin-bottom: 10px;
	margin-left: 5px;
	border-radius: 2px;
	 height: calc(100vh - 75px);
  width: 200px; /* 标签栏宽度 */
  background-color: white; /* 背景颜色 */
  padding: 2px; /* 内边距 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* 右侧阴影 */
}

.tab {
	font-weight: bold;
	  display: flex;               /* 使用 flexbox 布局 */
	    justify-content: center;     /* 水平居中 */
	    align-items: center;  
		 text-align: center;
  width: 40rpx;
    height: 30rpx;
  padding: 10px; /* 标签内边距 */
  padding-top: 15px;
  padding-bottom: 15px;
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  /* 移除过渡效果以提升性能 */
  /* transition: background-color 0.3s; */
}

.active {
  background-color: #4A90E2; /* 选中标签的背景颜色 */
  color: white; /* 选中标签的文字颜色 */
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3); /* 阴影效果 */
}

.active2 {
  background-color: #8d46d3; /* 选中标签的背景颜色 */
  color: white; /* 选中标签的文字颜色 */
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3); /* 阴影效果 */
}

.tab-content {
  padding: 20px; /* 内容区域内边距 */
  flex: 1; /* 内容区域占据剩余空间 */
}
</style>