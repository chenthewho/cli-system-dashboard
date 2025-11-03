<template>
  <view class="tablet-profit-page">
    <!-- 顶部工具栏 -->
    <view class="top-toolbar">
      <view class="toolbar-left">
        <view class="back-button" @click="handleBack">
          <uni-icons type="left" size="18" color="#666"></uni-icons>
          <text class="back-text">返回</text>
        </view>
        <text class="page-title">异常操作记录表</text>
      </view>
      
      <!-- 筛选条件 -->
      <view class="toolbar-filter">
        <view class="filter-group">
          <text class="filter-label">时间范围：</text>
          <view class="tab-buttons">
            <view 
              class="tab-button" 
              :class="{ active: currentTab === 1 }"
              @click="changeTab(1)"
            >
              自定义
            </view>
            <view 
              class="tab-button" 
              :class="{ active: currentTab === 2 }"
              @click="changeTab(2)"
            >
              本月
            </view>
            <view 
              class="tab-button" 
              :class="{ active: currentTab === 3 }"
              @click="changeTab(3)"
            >
              今日
            </view>
          </view>
        </view>
        
        <view class="date-group" v-if="currentTab === 1">
          <uni-datetime-picker v-model="startDate" type="date">
            <view class="date-picker">
              <text>{{ startDate }}</text>
              <uni-icons type="calendar" size="12" color="#999"></uni-icons>
            </view>
          </uni-datetime-picker>
          <text class="date-separator">至</text>
          <uni-datetime-picker v-model="endDate" type="date">
            <view class="date-picker">
              <text>{{ endDate }}</text>
              <uni-icons type="calendar" size="12" color="#999"></uni-icons>
            </view>
          </uni-datetime-picker>
        </view>
      </view>
      
      <view class="toolbar-right">
        <view class="action-button" @click="handleRefresh">
          <uni-icons type="refresh" size="16" color="#666"></uni-icons>
          <text>刷新</text>
        </view>
        <view class="action-button primary" @click="handleExport">
          <uni-icons type="download" size="16" color="#fff"></uni-icons>
          <text>导出</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 - 表格区域 -->
    <view class="main-content">
      <view class="table-container">
        <view class="table-header-info">
          <text class="table-title">异常操作记录明细</text>
          <text class="table-subtitle">共 {{ recordList.length }} 条记录</text>
        </view>
        
        <!-- 表格 -->
        <view class="simple-table">
          <!-- 表头 -->
          <view class="table-header">
            <view class="table-header-cell time-column">操作时间</view>
            <view class="table-header-cell operator-column">操作人</view>
            <view class="table-header-cell detail-column">操作详情</view>
          </view>
          
          <!-- 表格内容 -->
          <scroll-view class="table-body" scroll-y :style="{ height: tableHeight + 'px' }">
            <view 
              class="table-row" 
              v-for="(item, index) in recordList" 
              :key="item.id || index"
              @click="handleRowClick(item)"
            >
              <view class="table-cell time-column">
                <text class="time-text">{{ item.operateTime }}</text>
              </view>
              <view class="table-cell operator-column">
                <text class="operator-text">{{ item.operator }}</text>
              </view>
              <view class="table-cell detail-column">
                <text class="detail-text">{{ item.detail }}</text>
              </view>
            </view>
            
            <!-- 空状态 -->
            <view class="empty-state" v-if="recordList.length === 0">
              <text>暂无数据</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 加载遮罩 -->
    <view class="loading-mask" v-if="loading">
      <view class="loading-box">
        <view class="spinner"></view>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import tableApi from '../../api/table/tableApi'

export default {
  name: 'OperaRecordTable',
  data() {
    return {
      loading: false,
      currentTab: 3, // 默认选择今日
      startDate: '',
      endDate: '',
      tableHeight: 400,
      currentCompanyId: "",
      recordList: []
    }
  },
  mounted() {
    this.currentCompanyId = uni.getStorageSync('companyId');
    this.initDates()
    this.loadData();
    this.$nextTick(() => {
      this.calculateTableHeight()
    })
  },
  methods: {
    loadData() {
      // TODO: 调用实际的API接口
      // tableApi.GetOperaRecordTable(this.currentCompanyId, this.startDate, this.endDate).then(res => {
      //   console.log("res", res)
      //   this.recordList = res.data
      // })
      
      // 临时测试数据
      this.recordList = [
        {
          id: 1,
          operateTime: '2025-10-31 10:30:25',
          operator: '张三',
          detail: '修改商品价格：苹果 从 5.00元 改为 5.50元'
        },
        {
          id: 2,
          operateTime: '2025-10-31 09:15:10',
          operator: '李四',
          detail: '删除订单：订单号 #20251031001'
        },
        {
          id: 3,
          operateTime: '2025-10-31 08:45:30',
          operator: '王五',
          detail: '修改库存：香蕉 库存调整 +50件'
        }
      ]
    },
    
    // 工具方法
    formatDate(date) {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    // 获取今日日期
    getTodayDate() {
      const today = new Date()
      return this.formatDate(today)
    },
    
    // 获取本月第一天
    getMonthStart() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      return this.formatDate(new Date(year, month, 1))
    },
    
    // 获取本月最后一天
    getMonthEnd() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      return this.formatDate(new Date(year, month + 1, 0))
    },
    
    // 初始化日期
    initDates() {
      const today = this.getTodayDate()
      this.startDate = today
      this.endDate = today
    },
    
    // 事件处理方法
    handleBack() {
      uni.navigateBack({
        delta: 1
      })
    },
    
    changeTab(tabIndex) {
      this.currentTab = tabIndex
      
      switch (tabIndex) {
        case 1: // 自定义
          // 保持当前日期不变
          break
        case 2: // 本月
          this.startDate = this.getMonthStart()
          this.endDate = this.getMonthEnd()
          break
        case 3: // 今日
          const today = this.getTodayDate()
          this.startDate = today
          this.endDate = today
          break
      }
      
      // 刷新数据
      this.refreshData()
    },
    
    async refreshData() {
      this.loading = true
      try {
        // 调用数据加载
        this.loadData();
        
        // 这里可以根据时间范围请求真实数据
        console.log('查询时间范围:', this.startDate, '至', this.endDate)
        
        uni.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 1500
        })
      } catch (error) {
        console.error('刷新数据失败:', error)
        uni.showToast({
          title: '刷新失败',
          icon: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    
    handleRefresh() {
      this.refreshData()
    },
    
    handleExport() {
      uni.showModal({
        title: '导出数据',
        content: '是否导出当前筛选条件下的数据？',
        success: (res) => {
          if (res.confirm) {
            // 模拟导出过程
            uni.showLoading({
              title: '导出中...'
            })
            
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '导出成功',
                icon: 'success'
              })
            }, 2000)
          }
        }
      })
    },
    
    handleRowClick(item) {
      uni.showModal({
        title: '操作详情',
        content: `操作时间：${item.operateTime}\n操作人：${item.operator}\n操作详情：${item.detail}`,
        showCancel: false
      })
    },
    
    // 计算表格高度
    calculateTableHeight() {
      uni.getSystemInfo({
        success: (res) => {
          // 屏幕高度 - 顶部工具栏 - 表格头部信息 - 表头 - 内边距
          const screenHeight = res.windowHeight
          const toolbarHeight = 80   // 顶部工具栏（包含筛选）
          const tableHeaderInfoHeight = 53  // 表格头部信息
          const tableHeaderHeight = 45  // 表头
          const padding = 40  // 上下内边距
          
          this.tableHeight = screenHeight - toolbarHeight - tableHeaderInfoHeight - tableHeaderHeight - padding
          
          // 最小高度限制
          if (this.tableHeight < 200) {
            this.tableHeight = 200
          }
          
          // 最大高度限制（避免过高）
          if (this.tableHeight > 500) {
            this.tableHeight = 500
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 平板横屏专用样式 - 灰色主题 + 筛选条件在顶部 */
.tablet-profit-page {
  min-height: 100vh;
  background: #f5f6fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部工具栏 - 包含筛选条件 */
.top-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 20px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }
}

.back-text {
  font-size: 14px;
  color: #666;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 筛选条件区域 */
.toolbar-filter {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.tab-buttons {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.tab-button {
  padding: 6px 16px;
  font-size: 14px;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid #ddd;
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }

  &.active {
    background: #007bff;
    color: white;
  }

  &:hover:not(.active) {
    background: #e9ecef;
  }
}

.date-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  min-width: 120px;

  &:hover {
    border-color: #007bff;
  }
}

.date-separator {
  font-size: 14px;
  color: #666;
}

.toolbar-right {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  background: #f8f9fa;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
  }

  &.primary {
    background: #007bff;
    color: white;

    &:hover {
      background: #0056b3;
    }
  }
}

/* 主要内容区域 */
.main-content {
  height: calc(100vh - 80px);
  padding: 20px;
}

.table-container {
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.table-header-info {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.table-subtitle {
  font-size: 12px;
  color: #999;
}

/* 简单表格样式 */
.simple-table {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  height: 45px;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
}

.table-header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-right: 1px solid #e5e5e5;

  &:last-child {
    border-right: none;
  }
}

.time-column {
  width: 200px;
  min-width: 200px;
}

.operator-column {
  width: 150px;
  min-width: 150px;
}

.detail-column {
  flex: 1;
  min-width: 300px;
}

.table-body {
  flex: 1;
  overflow-y: auto;
}

.table-row {
  display: flex;
  min-height: 60px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-right: 1px solid #f0f0f0;
  font-size: 14px;

  &:last-child {
    border-right: none;
  }
}

.time-text {
  color: #007bff;
  font-weight: 500;
}

.operator-text {
  color: #333;
  font-weight: 500;
}

.detail-text {
  color: #666;
  line-height: 1.5;
  word-break: break-all;
}

.empty-state {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

/* 加载遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .time-column {
    width: 180px;
    min-width: 180px;
  }

  .operator-column {
    width: 120px;
    min-width: 120px;
  }

  .detail-column {
    min-width: 250px;
  }
}

@media (max-width: 900px) {
  .top-toolbar {
    flex-direction: column;
    align-items: stretch;
    height: auto;
    padding: 15px 20px;
  }

  .toolbar-filter {
    justify-content: flex-start;
    margin: 10px 0;
  }

  .main-content {
    height: calc(100vh - 120px);
  }

  .time-column {
    width: 150px;
    min-width: 150px;
  }

  .operator-column {
    width: 100px;
    min-width: 100px;
  }

  .detail-column {
    min-width: 200px;
  }
}
</style>

