<template>
	  <div id="app">
	    <div class="sidebar">
	      <Sidebar  @update-content="updateCashierContent" />
	    </div>
	    <div class="main-content">
			<div class="content-area">							
				<div v-if="cashierContent==='one'">
					 <Cashier ref="orderRef" />
				</div>
		  <order ref="orderRef2"  v-if="cashierContent==='two'" />
		  <goodIndex ref="goodIndexRef" v-if="cashierContent==='three'"/>
		  <setting v-if="cashierContent==='six'"/>
		  <staticPage v-if="cashierContent==='four'"/>
		  <settlementIndex v-if="cashierContent==='five'"/>
		  <rotating v-if="cashierContent==='seven'"/>
		  </div>
	    </div>
	  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Cashier from '../cashier/cashier.vue'
import goodIndex from '../good/goodIndex.vue'
import order from '../order/order.vue'
import setting from '../setting/setting.vue'
import staticPage from '../static/static.vue'
import rotating from '../rotating/rotatingIndex.vue'
import settlementIndex from '../settlement/settlementIndex.vue'
export default {
  components: {
	  Cashier,
    Sidebar,
	goodIndex,
	order,
	setting,
	staticPage,
	rotating,
	settlementIndex
  }, data() {
    return {
      cashierContent: 'one', 
	  vesionType:uni.getStorageSync("vesionType")??1, // 获取版本类型，默认为1
    };
  },
  onShow(){
	  var refresh_batch = uni.getStorageSync('refresh_batch');
	  if (refresh_batch!=null&& refresh_batch.trim() !== '') {
	  	this.refreshBatch(refresh_batch);
	  	uni.removeStorageSync('refresh_batch');
	  }
	  var refresh_allbatch = uni.getStorageSync('refresh_all');
	  if (refresh_allbatch!=null&& refresh_allbatch.trim() !== '') {
	  	this.refreshallBatch();
	  	uni.removeStorageSync('refresh_all');
	  }
	  var refresh_CompanyInfo = uni.getStorageSync('refreshCompanyInfo');
	  if(refresh_CompanyInfo!=null && refresh_CompanyInfo.trim() !== ''){
		  this.$refs.orderRef.refreshHeaderInfo();
		  uni.removeStorageSync('refreshCompanyInfo');
	  }
	plus.navigator.setFullscreen(true);
					//隐藏虚拟按键
	plus.navigator.hideSystemNavigation();
	console.log("vesionType",this.vesionType);
  },
  mounted(){
	  // this.$refs.orderRef.onLoadMethod();
  },
   methods: {
	   refreshBatch(id){
		   this.$refs.goodIndexRef.refreshBatch(id);
	   },
	   refreshallBatch(){
	   		this.$refs.goodIndexRef.refreshAllBatch();
	   },
      updateCashierContent(newContent) {
		 // this.$refs.orderRef.onLoadMethod();
        this.cashierContent = newContent; 
		// if(this.cashierContent==='one'){
		// 	this.$refs.orderRef.onLoadMethod();
		// }else if(this.cashierContent==='two'){
		// 	this.$refs.orderRef2.onshowMethed();
		// }
      },
    },
};
</script>

<style>
#app {
  display: flex; /* 使用 Flexbox 布局 */
}

.sidebar {
  width: 40rpx; /* 设置侧边栏宽度 */
  height: 100vh; /* 使侧边栏高度占满整个视口 */
  background-color: #f4f4f4; /* 侧边栏背景颜色 */
  position: fixed; /* 固定在左边 */
  left: 0; /* 靠左对齐 */
  top: 0; /* 靠上对齐 */
  overflow-y: auto; /* 允许垂直滚动 */
}

.main-content {
 background-color: gray;
  margin-left: 40rpx; /* 主内容区左边距与侧边栏宽度相同 */
  flex-grow: 1; /* 主内容区占据剩余空间 */
}
</style>