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
		 <text> {{ tab.shipperName }}</text><br>
		 <text> {{ tab.batchCode.slice(-4)}}</text>
	  </div>
      </div>
	  <div
	    v-for="tab in categoryList_employ"
	    :key="tab.name"
	    class="tab"
	    :class="{ active2: activeTabId === tab.id }"
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
        type: Object,
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
	  scrollHeight:0,
	  categoryList_employ:[]
    };
  },
  mounted(){
	  if(this.categoryList.length>0){
	  	this.activeTab = this.categoryList[0].name;
	  }
	  this.scrollHeight = uni.getWindowInfo().windowHeight - 120;
	  //暂不启用自营商品分类
	  this.getCategoryList();
  },
  methods: {
		//暂不启用自营商品分类
	  async getCategoryList() {
	  	let that = this;
	  	this.categoryList_employ = [];
		let companyId = uni.getStorageSync('companyId');
	  	var res = await category.categoryList(companyId);
	  	res.data.forEach(x => {
	  		this.categoryList_employ.push({
	  			id: x.id,
	  			name: x.className
	  		});
	  	})
	  },
	  longpress(tab) {
			this.$emit('delete:activeTab', tab);
	  },
    selectTab(tab) {
      this.activeTab = tab.name;
	   this.$emit('update:activeTab', {id:tab.id,type:1});
    },
	selectTab2(tab) {
	  this.activeTab = tab.name;
	   this.$emit('update:activeTab', {id:tab.id,type:2});
	}
  },
};
</script>

<style scoped>
.vertical-tabs {
  display: flex; /* 使用 flexbox 布局 */
}

.tabs {
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 5px;
	border-radius: 2px;
	 height: calc(100vh - 100px);
  width: 200px; /* 标签栏宽度 */
  background-color: #f4f4f4; /* 背景颜色 */
  padding: 2px; /* 内边距 */
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
  transition: background-color 0.3s; /* 背景颜色过渡效果 */
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