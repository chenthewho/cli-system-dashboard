<template>
  <div :style="{'display': 'flex', 'height': (WindowHeight-65)+'px', 'width': '100%', 'background-color': '#ffffff'}">
    <!-- 修改记录内容 -->
    <div style="width: 100%; background-color: #ffffff; text-align: right;">
      <!-- 头部信息 -->
      <div style="height: 60rpx; margin: 10rpx; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 10rpx 15rpx; border-radius: 8rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);">
        <div style="display: flex; align-items: center;">
          <!-- 返回按钮 -->
          <button @click="goBack" style="
            height: 35rpx;
            line-height: 35rpx;
            font-weight: bold;
            background-color: #5a5a5a;
            color: #ffffff;
            font-size: 14rpx;
            padding: 0 20rpx;
            border-radius: 6rpx;
            border: none;
            cursor: pointer;
            margin-right: 20rpx;
            box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
          ">
            ← 返回
          </button>
          
          <!-- 批次信息 -->
          <div style="font-size: 18rpx; font-weight: bold;" v-if="selectBatch">
            <text style="margin-right: 10rpx; color: #333;">{{selectBatch.shipperName}}</text>
            <text style="color: #2196f3;">{{selectBatch.batchCode}}</text>
            <text style="margin-left: 20rpx; font-size: 14rpx; color: #666;">
              修改记录总计: {{modifyRecords.length}} 条
            </text>
          </div>
        </div>
        
        <div style="text-align: right; display: flex;" v-if="selectBatch">
          <button 
            style="height: 35rpx; line-height: 35rpx; font-weight: bold; background-color: #11998e; color: #ffffff; font-size: 14rpx; padding: 0 20rpx; border-radius: 6rpx; border: none; cursor: pointer; box-shadow: 0 2rpx 4rpx rgba(17, 153, 142, 0.3);"
            @click="refreshRecords">
            🔄 刷新记录
          </button>
        </div>
      </div>

      <!-- 记录列表 -->
      <div style="margin-left: 5rpx; margin-right: 5rpx;">
        <!-- 表头 -->
        <div class="table-header">
          <div style="flex: 2; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">修改时间</text>
          </div>
          <div style="flex: 2; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">操作人员</text>
          </div>
          <div style="flex: 3; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">商品名称</text>
          </div>
          <div style="flex: 2; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">修改类型</text>
          </div>
          <div style="flex: 2; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">修改前数量</text>
          </div>
          <div style="flex: 2; padding: 10px; text-align: center;">
            <text style="font-size: 16px; font-weight: bold;">修改后数量</text>
          </div>
        </div>

        <!-- 记录内容 -->
        <scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-190 + 'px' }" v-if="modifyRecords.length > 0">
          <div style="display: flex; height: 45rpx; font-size: 18rpx;" v-for="(record, index) in modifyRecords" :key="index"
            :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
            <div style="flex: 2; padding: 8px; text-align: center; font-size: 14rpx; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              {{ formatDateTime(record.createTime) }}
            </div>
            <div style="flex: 2; padding: 8px; text-align: center; font-weight: bold; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              {{ record.operatorName || '' }}
            </div>
            <div style="flex: 3; padding: 8px; text-align: center; font-weight: bold; font-size: 20px; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              {{ record.commodityName }}
            </div>
            <div style="flex: 2; padding: 8px; text-align: center; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              <span :style="{
                padding: '4rpx 12rpx',
                borderRadius: '6rpx',
                fontSize: '12rpx',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: getModifyTypeColor(record.operaType),
                boxShadow: '0 2rpx 4rpx rgba(0, 0, 0, 0.2)'
              }">
                {{ getModifyTypeText(record.operaType) }}
              </span>
            </div>
            <div style="flex: 2; padding: 8px; text-align: center; font-weight: bold; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              {{ record.beforeQuantity }}{{ record.specName }}
            </div>
            <div style="flex: 2; padding: 8px; text-align: center; font-weight: bold; display: flex; align-items: center; justify-content: center; line-height: 35rpx;">
              {{ record.afterQuantity }}{{ record.specName }}
            </div>
          </div>
        </scroll-view>

        <!-- 空状态 -->
        <div style="height: 100rpx;" v-if="modifyRecords.length === 0 && !loading">
          <div style="margin-top: 80rpx; text-align: center;">
            <uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
            <div style="margin-top: 10px; color: #969696; font-weight: bold;">暂无修改记录</div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div style="height: 100rpx;" v-if="loading">
          <div style="margin-top: 80rpx; text-align: center;">
            <div style="margin-top: 10px; color: #969696; font-weight: bold;">加载中...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import category from '../../api/goods/category'
import batch from '../../api/batch/batch'

export default {
  data() {
    return {
      companyId: "",
      selectBatch: null,
      modifyRecords: [],
      WindowHeight: 0,
      loading: false,
      // 路由参数
      batchId: null
    }
  },
  onLoad(options) {
    // 获取路由参数
    if (options.batchId) {
      this.batchId = options.batchId;
    }
  },
  onShow() {
    this.getBatchInfo();
  },
  mounted() {
    this.companyId = uni.getStorageSync('companyId');
    this.getBatchInfo();
    this.WindowHeight = uni.getWindowInfo().windowHeight;
  },
  methods: {
    // 返回上级页面
    goBack() {
      uni.navigateBack();
    },
    
    // 获取批次信息
    getBatchInfo() {
      if (!this.batchId) {
        uni.showToast({
          title: '缺少批次参数',
          icon: 'none'
        });
        return;
      }
      
      // 获取批次详细信息
      batch.getBatchInfoById(this.batchId).then(res => {
        if (res.code === 200) {
          this.selectBatch = res.data;
          this.getBatchModifyRecords(this.batchId);
        } else {
          uni.showToast({
            title: '获取批次信息失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        console.error('获取批次信息失败:', err);
        uni.showToast({
          title: '获取批次信息失败',
          icon: 'none'
        });
      });
    },
    
    // 获取批次修改记录
    getBatchModifyRecords(batchId) {
      this.loading = true;
      this.modifyRecords = [];
      
      batch.GetBatchModifyRecord(batchId).then(res => {
        this.loading = false;
        if (res.code === 200) {
          this.modifyRecords = res.data || [];
          // 按修改时间倒序排列
          this.modifyRecords.sort((a, b) => {
            return new Date(b.modifyTime) - new Date(a.modifyTime);
          });
        } else {
          uni.showToast({
            title: '获取修改记录失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        this.loading = false;
        console.error('获取批次修改记录失败:', err);
        uni.showToast({
          title: '获取修改记录失败',
          icon: 'none'
        });
      });
    },
    
    // 刷新记录
    refreshRecords() {
      if (this.batchId) {
        this.getBatchModifyRecords(this.batchId);
        uni.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1000
        });
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '-';
      try {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        return dateTime.replace('T', ' ');
      }
    },
    
    // 获取修改类型文本
    getModifyTypeText(type) {
      const typeMap = {
        1: '编辑',
        2: '删除',
        3: '添加',
        4: '删除商品',
        5: '价格调整',
        0: '其他'
      };
      return typeMap[type] || '未知';
    },
    
    // 获取修改类型颜色
    getModifyTypeColor(type) {
      const colorMap = {
        1: '#ffc107', // 编辑 - 黄色
        2: '#dc3545', // 删除 - 红色
        3: '#28a745', // 添加商品 - 绿色
        4: '#6c757d', // 删除商品 - 灰色
        5: '#17a2b8', // 价格调整 - 青色
        0: '#6f42c1'  // 其他 - 紫色
      };
      return colorMap[type] || '#6c757d';
    }
  }
}
</script>

<style>
.scrollArea {
  overflow-y: auto;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 表格行悬停效果 */
.scrollArea > div:hover {
  background-color: #e3f2fd !important;
  transition: background-color 0.2s;
}

/* 表头样式 - 与 batchGoodManger.vue 一致 */
.table-header {
  display: flex;
  background: #2196f3;
  font-weight: bold;
  border-bottom: none;
  color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3);
  border-radius: 8rpx 8rpx 0 0;
}
</style>
