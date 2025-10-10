<template>
  <view class="statistics-page-landscape" :style="{ height: windowHeight + 'px' }">
    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 顶部标题栏 -->
      <view class="content-header">
        <view class="header-info">
          <view class="title-section">
            <uni-icons type="bars" size="24" color="#667eea"></uni-icons>
            <text class="page-title">数据统计中心</text>
          </view>
          <text class="page-desc">查看各类业务统计数据和报表</text>
        </view>
        <view class="header-actions">
          <!-- <view class="action-btn">
            <uni-icons type="refresh" size="16" color="#666"></uni-icons>
            <text>刷新</text>
          </view> -->
        </view>
      </view>

      <!-- 统计卡片网格 -->
      <view class="statistics-grid">
        
        <!-- 营业统计卡片 -->
        <view class="stat-module business-module">
          <view class="module-header">
            <view class="module-icon business">
              <uni-icons type="calendar" size="20" color="#fff"></uni-icons>
            </view>
            <view class="module-info">
              <text class="module-title">营业统计</text>
              <text class="module-count">2 个报表</text>
            </view>
          </view>
          
          <view class="reports-list">
            <view class="report-card" @click="enterTobusinessStaticTable">
              <view class="report-icon">
                <uni-icons type="shop" size="18" color="#4caf50"></uni-icons>
              </view>
              <view class="report-info">
                <text class="report-title">营业统计表</text>
                <text class="report-desc">日常营业收入数据</text>
              </view>
              <view class="report-arrow">
                <uni-icons type="right" size="12" color="#ccc"></uni-icons>
              </view>
            </view>
			<view class="report-card" @click="enterToDutyStaticTable">
			  <view class="report-icon">
			    <uni-icons type="shop" size="18" color="#00aaff"></uni-icons>
			  </view>
			  <view class="report-info">
			    <text class="report-title">班次统计表</text>
			    <text class="report-desc">所有班次产生数据</text>
			  </view>
			  <view class="report-arrow">
			    <uni-icons type="right" size="12" color="#ccc"></uni-icons>
			  </view>
			</view>
          </view>
        </view>

        <!-- 利润统计卡片 -->
        <view class="stat-module profit-module">
          <view class="module-header">
            <view class="module-icon profit">
              <uni-icons type="wallet" size="20" color="#fff"></uni-icons>
            </view>
            <view class="module-info">
              <text class="module-title">利润统计</text>
              <text class="module-count">2 个报表</text>
            </view>
          </view>
          
          <view class="reports-list">
            <view class="report-card" @click="enterToEmployTable" v-if="this.vesionType == 3 || this.vesionType == 4">
              <view class="report-icon">
                <uni-icons type="list" size="18" color="#ff9800"></uni-icons>
              </view>
              <view class="report-info">
                <text class="report-title">自营利润统计表</text>
                <text class="report-desc">自营商品利润分析</text>
              </view>
              <view class="report-arrow">
                <uni-icons type="right" size="12" color="#ccc"></uni-icons>
              </view>
            </view>
            
            <view class="report-card" @click="enterToAssistTable" v-if="this.vesionType == 2 || this.vesionType == 4">
              <view class="report-icon">
                <uni-icons type="person" size="18" color="#9c27b0"></uni-icons>
              </view>
              <view class="report-info">
                <text class="report-title">代卖统计表</text>
                <text class="report-desc">代销商品利润分析</text>
              </view>
              <view class="report-arrow">
                <uni-icons type="right" size="12" color="#ccc"></uni-icons>
              </view>
            </view>
          </view>
        </view>

        <!-- 货品统计卡片 -->
        <view class="stat-module inventory-module">
          <view class="module-header">
            <view class="module-icon inventory">
              <uni-icons type="list" size="20" color="#fff"></uni-icons>
            </view>
            <view class="module-info">
              <text class="module-title">货品统计</text>
              <text class="module-count">1 个报表</text>
            </view>
          </view>
          
          <view class="reports-list">
            <view class="report-card" @click="enterToSaleStaticTable">
              <view class="report-icon">
                <uni-icons type="loop" size="18" color="#607d8b"></uni-icons>
              </view>
              <view class="report-info">
                <text class="report-title">进销存统计表</text>
                <text class="report-desc">库存流转数据分析</text>
              </view>
              <view class="report-arrow">
                <uni-icons type="right" size="12" color="#ccc"></uni-icons>
              </view>
            </view>
          </view>
        </view>

		<!-- 其他统计卡片 -->
		<view class="stat-module other-module">
		  <view class="module-header">
		    <view class="module-icon inventory">
		      <uni-icons type="list" size="20" color="#fff"></uni-icons>
		    </view>
		    <view class="module-info">
		      <text class="module-title">其他统计</text>
		      <text class="module-count">1 个报表</text>
		    </view>
		  </view>
		  
		  <view class="reports-list">
		    <view class="report-card" @click="enterTolousStaticTable">
		      <view class="report-icon">
		        <uni-icons type="loop" size="18" color="#607d8b"></uni-icons>
		      </view>
		      <view class="report-info">
		        <text class="report-title">欠条统计表</text>
		        <text class="report-desc">用户欠条记录数据</text>
		      </view>
		      <view class="report-arrow">
		        <uni-icons type="right" size="12" color="#ccc"></uni-icons>
		      </view>
		    </view>
		  </view>
		</view>

      </view>
    </view>
  </view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import category from '../../api/goods/category'
	import Rank from '../../api/Rank'
	export default {
		name: 'staticPage',
		components: {},
		data() {
			return {
				moduleList_date: null,
				moduleList_lastdate: null,
				moduleList_month: null,
				CompanyId: "",
				searchVal: '',
				windowHeight:0,
				tableData: [],
        vesionType:uni.getStorageSync("vesionType")??1, // 获取版本类型，默认为1
				}
				},
		mounted() {
			this.getSystemheight();
			// this.CompanyId = uni.getStorageSync("companyId");
			// const currentDate = this.getcurrentTime();
			// category.GetDateStatic(this.CompanyId, currentDate).then(res => {
			// 	this.moduleList_date = res.data;
			// })
			// const lastDate = this.getLastTime();
			// category.GetDateStatic(this.CompanyId, lastDate).then(res => {
			// 	this.moduleList_lastdate = res.data;
			// })
			// category.GetMonthStatic(this.CompanyId, currentDate).then(res => {
			// 	this.moduleList_month = res.data;
			// })
		},
		methods: {
			//进入营业统计表
			enterTobusinessStaticTable(){
				uni.navigateTo({
					url: `/pages/table/businessStaticTable`
				})
			},
			//进入轮值数据统计表
			enterToDutyStaticTable(){
				uni.navigateTo({
					url: `/pages/table/dutyStaticTable`
				})
			},
			//进入自营统计表
			enterToEmployTable(){
        // uni.showToast({
        //   title: '自营统计表暂未开放',
        //   icon: 'none'
        // })
				uni.navigateTo({
					url: `/pages/table/employProfitTable`
				})
			},
			//进入代销统计表
			enterToAssistTable(){
				uni.navigateTo({
					url: `/pages/table/assistProfitTable`
				})
			},
			enterTolousStaticTable(){
				uni.navigateTo({
					url: `/pages/table/lousStaticTable`
				})
			},	
			//进入进销存统计表
			enterToSaleStaticTable(){
        uni.showToast({
          title: '进销存统计表暂未开放',
          icon: 'none'
        })
				// uni.navigateTo({
				// 	url: `/pages/table/saleStaticTable`
				// })
			},
			getSystemheight() {
				try {
					this.windowHeight = uni.getWindowInfo().windowHeight;
				} catch (e) {
					// 降级处理
					uni.getSystemInfo({
						success: (res) => {
							this.windowHeight = res.windowHeight;
						}
					});
				}
			},

			// getLastTime() {
			// 	const currentDate = new Date();

			// 	// 获取前一天
			// 	currentDate.setDate(currentDate.getDate() - 1);

			// 	// 格式化日期
			// 	const year = currentDate.getFullYear();
			// 	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
			// 	const day = String(currentDate.getDate()).padStart(2, '0');

			// 	// 拼接成 YYYY-MM-DD 格式
			// 	const formattedDate = `${year}-${month}-${day}`;
			// 	return formattedDate;
			// },
			// getcurrentTime() {
			// 	const currentDate = new Date();
			// 	const year = currentDate.getFullYear();
			// 	const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
			// 	const day = String(currentDate.getDate()).padStart(2, '0');
			// 	const hours = String(currentDate.getHours()).padStart(2, '0');
			// 	const minutes = String(currentDate.getMinutes()).padStart(2, '0');
			// 	const seconds = String(currentDate.getSeconds()).padStart(2, '0');

			// 	const formattedDate = `${year}-${month}-${day} `;
			// 	return formattedDate;
			// }
		}
	}
</script>

<style lang="scss" scoped>
/* 横屏统计页面样式 */
.statistics-page-landscape {
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


/* 主内容区域 */
.main-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 内容头部 */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  background: #ffffff;
  color: #2c3e50;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e5e5e5;
  position: relative;
  z-index: 10;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 1px;
}

.page-desc {
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
  border: 1px solid #e5e5e5;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
    color: #667eea;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

/* 统计网格 */
.statistics-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px;
  overflow-y: auto;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
}

/* 统计模块 */
.stat-module {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  &.business-module {
    border-top: 3px solid #4caf50;
  }

  &.profit-module {
    border-top: 3px solid #ff9800;
  }

  &.inventory-module {
    border-top: 3px solid #607d8b;
  }
  &.other-module {
    border-top: 3px solid #00aaff;
  }
}

/* 模块头部 */
.module-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.module-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.business {
    background: linear-gradient(135deg, #4caf50, #45a049);
  }

  &.profit {
    background: linear-gradient(135deg, #ff9800, #f57c00);
  }

  &.inventory {
    background: linear-gradient(135deg, #607d8b, #546e7a);
  }
}

.module-info {
  flex: 1;
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.module-count {
  margin-left: 8px;
  font-size: 12px;
  color: #7f8c8d;
}

/* 报表列表 */
.reports-list {
  padding: 16px 24px 24px;
}

.report-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: #e9ecef;
    transform: translateX(4px);

    &::before {
      left: 100%;
    }

    .report-arrow {
      transform: translateX(4px);
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.report-icon {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.report-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.report-desc {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.2;
}

.report-arrow {
  transition: all 0.3s ease;
  opacity: 0.5;
}

// /* 响应式设计 */
// @media (max-width: 1000px) {
 
// }

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20rpx) rotate(180deg);
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .statistics-page-landscape {
    background: #2c2c2c;
  }

  .content-header {
    background: #2c3e50;
    border-color: #34495e;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .page-title {
    color: #ecf0f1;
  }

  .page-desc {
    color: #bdc3c7;
  }

  .action-btn {
    background: #34495e;
    color: #ecf0f1;
    border-color: #4a5f7a;

    &:hover {
      background: #3d566e;
      border-color: #667eea;
      color: #667eea;
    }
  }

  .stat-module {
    background: #2c3e50;
    border-color: #34495e;
  }

  .module-title {
    color: #ecf0f1;
  }

  .module-count {
    color: #bdc3c7;
  }

  .report-card {
    background: #34495e;

    &:hover {
      background: #3d566e;
    }
  }

  .report-title {
    color: #ecf0f1;
  }

  .report-desc {
    color: #bdc3c7;
  }

  .report-icon {
    background: #2c3e50;
  }
}

/* 滚动条样式 */
.statistics-grid::-webkit-scrollbar {
  width: 6px;
}

.statistics-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.statistics-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;

  &:hover {
    background: #a8a8a8;
  }
}
</style>


