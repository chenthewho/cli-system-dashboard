<template>
  <div :style="{ display: 'flex', height: WindowHeight + 'px', width: '100%', overflow: 'hidden' }">
    <div style="width: 200rpx; background-color: #ffffff; display: flex">
      <div>
        <div style="text-align: center">
          <CustomTabs
            ref="customTabs"
            :list="tabList"
            :itemStyle="{ width: '80px', height: '40px', fontWeight: 'bold' }"
            @click="changeType"
            :current="currentTabIndex"
            activeColor="#2979ff"
            inactiveColor="#606266"
            underlineColor="#2979ff"
            :underlineHeight="5"
            style="display: inline-block; margin-top: 10rpx; margin-bottom: 10rpx"
          >
          </CustomTabs>
        </div>
        <!-- 圆弧边卡片 -->
        <div style="display: flex; flex-direction: column; gap: 5rpx">
          <div
            v-if="batchShowList.length === 0"
            :key="1"
            :style="{
              marginLeft: '5rpx',
              marginRight: '5rpx',
              width: '150rpx',
              backgroundColor: '#d0d0d0', // 浅绿色或白色
              color: '#000000',
              borderRadius: '12rpx',
              boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
              padding: '10rpx',
              boxSizing: 'border-box',
              textAlign: 'left',
              fontSize: '14rpx',
            }"
          >
            <div>
              <div style="display: flex; line-height: 15rpx">
                <text style="font-size: 15rpx; font-weight: bold"> 暂无批次 </text>
                <text style="font-size: 12rpx; font-weight: bold; margin-left: 5rpx"> </text>
              </div>
            </div>
          </div>
          <scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight - 80 + 'px' }">
            <div
              v-for="item in batchShowList"
              @click="exchangeBatch(item)"
              :key="item.id"
              :style="{
                marginLeft: '5rpx',
                marginRight: '5rpx',
                width: '150rpx',
                marginTop: '5px',
                backgroundColor: selectBatch.id === item.id ? '#00aaff' : '#ffffff', // 浅绿色或白色
                color: selectBatch.id === item.id ? '#ffffff' : '#000000',
                borderRadius: '12rpx',
                boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
                padding: '10rpx',
                boxSizing: 'border-box',
                textAlign: 'left',
                fontSize: '14rpx',
              }"
            >
              <div>
                <div style="display: flex; line-height: 15rpx">
                  <text style="font-size: 15rpx; font-weight: bold">
                    {{ item.shipperName }}
                  </text>
                  <text style="font-size: 12rpx; font-weight: bold; margin-left: 5rpx">
                    {{ item.batchCode }}
                  </text>
                </div>
                <text style="font-size: 8rpx; font-weight: bold">{{ item.createTime.replace('T', ' ') }}</text>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
      <!-- 垂直线 -->
      <div style="width: 5rpx; background-color: #ccc"></div>
    </div>
    <div
      class="right-content-container"
      style="width: 100%; background-color: #ffffff; display: flex; flex-direction: column; overflow: hidden"
    >
      <div
        style="
          height: 40rpx;
          margin-left: 5rpx;
          margin-right: 5rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5rpx 0;
          flex-shrink: 0;
        "
      >
        <div style="font-size: 16rpx; font-weight: bold" v-if="selectBatch">
          <div style="display: flex; align-items: center">
            <text style="margin-right: 5rpx; color: #333">{{ selectBatch.shipperName }}</text>
            <text style="color: #666">{{ selectBatch.batchCode }}</text>
            <text style="font-size: 10rpx; font-weight: normal; margin-left: 8rpx; color: #999"
              >创建：{{ selectBatch.createTime.replace('T', ' ') }}</text
            >
          </div>
        </div>
        <div style="display: flex; gap: 8rpx; align-items: center">
          <!-- 在售批次显示售罄按钮 -->
          <button
            v-if="selectBatch && selectBatch.saleStatus === 1"
            @click="setSaleStatus(0)"
            style="
              height: 26rpx;
              line-height: 26rpx;
              padding: 0 12rpx;
              font-weight: bold;
              background-color: white;
              border: 2rpx solid #ff4444;
              color: #ff4444;
              border-radius: 4rpx;
              font-size: 13rpx;
            "
          >
            售罄
          </button>
          <!-- 售罄批次显示开售按钮 -->
          <button
            v-if="selectBatch && selectBatch.saleStatus === 0"
            @click="setSaleStatus(1)"
            style="
              height: 26rpx;
              line-height: 26rpx;
              padding: 0 12rpx;
              font-weight: bold;
              background-color: white;
              border: 2rpx solid #00aa00;
              color: #00aa00;
              border-radius: 4rpx;
              font-size: 13rpx;
            "
          >
            开售
          </button>
          <!-- <button style="height: 26rpx; line-height: 26rpx; padding: 0 10rpx; font-weight: bold; background-color: white; border: 2rpx solid #00aa00; color: #00aa00; border-radius: 4rpx; font-size: 13rpx; white-space: nowrap;">销售详情</button>
				 -->
        </div>
      </div>
      <div style="height: 1rpx; background-color: #e0e0e0; flex-shrink: 0"></div>
      <scroll-view
        class="scrollArea"
        scroll-y="true"
        style="flex: 1; overflow-y: auto; background-color: #f5f5f5; padding: 10rpx 0"
      >
        <!-- 未结算货品卡片 -->
        <div
          style="
            margin: 0 10rpx 15rpx 10rpx;
            background: white;
            border-radius: 10rpx;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          "
        >
          <!-- 货品标题 -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12rpx 15rpx;
              border-bottom: 2rpx solid #f0f0f0;
            "
          >
            <div style="font-size: 16rpx; font-weight: bold; color: #333">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-icon-test"
                size="18"
                color="#00aa00"
                style="margin-right: 5rpx"
              ></uni-icons>
              未结算货品
            </div>
            <div>
              <button
                @click="showSetBatchAssist"
                style="
                  width: 100px;
                  height: 28rpx;
                  line-height: 28rpx;
                  font-weight: bold;
                  background-color: white;
                  border: 1rpx solid #00aa00;
                  color: #00aa00;
                  border-radius: 5rpx;
                  font-size: 12rpx;
                  white-space: nowrap;
                  padding: 0;
                  flex-shrink: 0;
                  margin-left: auto;
                "
              >
                设置代卖费
              </button>
            </div>
          </div>
          <!-- 货品表格 -->
          <div style="display: flex; overflow: hidden">
            <!-- 固定列容器 -->
            <div style="flex-shrink: 0; position: relative; z-index: 10; box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08)">
              <!-- 表头固定列 -->
              <div
                style="
                  width: 150px;
                  padding: 10px;
                  border-right: 1px solid #d0d0d0;
                  text-align: center;
                  background-color: #e8f4f8;
                  font-weight: bold;
                  border-bottom: 1px solid #d0d0d0;
                  font-size: 14rpx;
                "
              >
                货品
              </div>
              <!-- 数据行固定列 -->
              <div
                v-for="item in BatchCommodityList"
                :key="item.id"
                @click="goToGoodDetail(item)"
                class="commodity-name-cell"
                style="
                  width: 150px;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  border-bottom: 1px solid #e8e8e8;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-weight: bold;
                  color: #00aa00;
                  font-size: 14rpx;
                  background-color: #fff;
                  cursor: pointer;
                "
              >
                <span>{{ item.commodityName }}</span>
                <span style="color: #999">></span>
              </div>
              <!-- 合计行固定列 -->
              <div
                style="
                  width: 150px;
                  padding: 10px;
                  border-right: 1px solid #d0d0d0;
                  text-align: center;
                  color: #333;
                  background-color: #f5f5f5;
                  font-weight: bold;
                  border-top: 1px solid #d0d0d0;
                  font-size: 14rpx;
                "
              >
                合计
              </div>
            </div>

            <!-- 可滚动列容器 -->
            <scroll-view scroll-x="true" :style="{ flex: 1, width: scrollableWidth + 'px' }" :show-scrollbar="false">
              <div :style="{ display: 'inline-block', minWidth: scrollableWidth + 'px' }">
                <!-- 表头可滚动列 -->
                <div
                  style="
                    display: flex;
                    background-color: #e8f4f8;
                    font-weight: bold;
                    border-bottom: 1px solid #d0d0d0;
                    font-size: 14rpx;
                  "
                >
                  <div
                    :style="{
                      width: columnWidths.sales + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      flexShrink: 0,
                    }"
                  >
                    销量
                  </div>
                  <div
                    :style="{
                      width: columnWidths.avgWeight + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      flexShrink: 0,
                    }"
                  >
                    均重
                  </div>
                  <div
                    :style="{
                      width: columnWidths.avgPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      flexShrink: 0,
                    }"
                  >
                    销售均价
                  </div>
                  <div
                    :style="{
                      width: columnWidths.totalPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      flexShrink: 0,
                    }"
                  >
                    销售货款
                  </div>
                  <div
                    :style="{
                      width: columnWidths.inventory + 'px',
                      padding: '10px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }"
                  >
                    库存
                  </div>
                </div>

                <!-- 数据行可滚动列 -->
                <div
                  v-for="item in BatchCommodityList"
                  :key="item.id"
                  style="display: flex; border-bottom: 1px solid #e8e8e8; background-color: #fff"
                >
                  <div
                    :style="{
                      width: columnWidths.sales + 'px',
                      padding: '10px',
                      borderRight: '1px solid #e8e8e8',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      color: '#666',
                      fontSize: '13rpx',
                      flexShrink: 0,
                    }"
                  >
                    <text v-for="model in item.outPutSaleMount">{{ model.mount }}{{ model.specName }}</text
                    >/({{ item.saleWeight }}斤)
                  </div>
                  <div
                    v-if="item.averageWeight != undefined"
                    :style="{
                      width: columnWidths.avgWeight + 'px',
                      padding: '10px',
                      borderRight: '1px solid #e8e8e8',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      color: '#666',
                      fontSize: '13rpx',
                      flexShrink: 0,
                    }"
                  >
                    {{
                      item.averageWeight != null && item.averageWeight != 'NaN' && item.averageWeight != 'Infinity'
                        ? item.averageWeight.toFixed(0)
                        : '--'
                    }}
                  </div>
                  <div
                    v-if="item.averagePrice != undefined"
                    :style="{
                      width: columnWidths.avgPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #e8e8e8',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      color: '#666',
                      fontSize: '13rpx',
                      flexShrink: 0,
                    }"
                  >
                    {{ item.averagePrice != null && item.averagePrice != 'NaN' ? item.averagePrice.toFixed(1) : '--' }}
                  </div>
                  <div
                    :style="{
                      width: columnWidths.totalPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #e8e8e8',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '14rpx',
                      flexShrink: 0,
                    }"
                  >
                    {{ item.saleSubTotal }}
                  </div>
                  <div
                    :style="{
                      width: columnWidths.inventory + 'px',
                      padding: '10px',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      color: '#ff4444',
                      fontSize: '13rpx',
                      display: 'flex',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }"
                  >
                    <text
                      v-for="model in item.outPutPurchaseInventories"
                      v-if="item.outPutPurchaseInventories.length > 0"
                      >{{ model.mount }}{{ model.specName }}</text
                    >
                    <text v-if="item.outPutPurchaseInventories.length === 0">0</text>
                  </div>
                </div>

                <!-- 合计行可滚动列 -->
                <div
                  style="
                    display: flex;
                    background-color: #f5f5f5;
                    font-weight: bold;
                    border-top: 1px solid #d0d0d0;
                    font-size: 14rpx;
                  "
                >
                  <div
                    :style="{
                      width: columnWidths.sales + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      color: '#333',
                      flexShrink: 0,
                    }"
                  >
                    {{ batchCommodityTotal.totalMount }} /({{ batchCommodityTotal.totalWeight }})
                  </div>
                  <div
                    :style="{
                      width: columnWidths.avgWeight + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      color: '#666',
                      flexShrink: 0,
                    }"
                  >
                    --
                  </div>
                  <div
                    :style="{
                      width: columnWidths.avgPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      color: '#666',
                      flexShrink: 0,
                    }"
                  >
                    --
                  </div>
                  <div
                    :style="{
                      width: columnWidths.totalPrice + 'px',
                      padding: '10px',
                      borderRight: '1px solid #d0d0d0',
                      textAlign: 'center',
                      color: '#ff6600',
                      flexShrink: 0,
                    }"
                  >
                    {{ batchCommodityTotal.totalMoney }}
                  </div>
                  <div
                    :style="{
                      width: columnWidths.inventory + 'px',
                      padding: '10px',
                      textAlign: 'center',
                      color: '#333',
                      flexShrink: 0,
                    }"
                  >
                    数量:{{ batchCommodityTotal.totalMount }} 重量:{{ batchCommodityTotal.totalWeight }}
                  </div>
                </div>
              </div>
            </scroll-view>
          </div>
          <div style="height: 100rpx" v-if="BatchCommodityList.length == 0">
            <div style="margin-top: 40rpx; text-align: center">
              <uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
              <div style="margin-top: 10px; color: #969696; font-weight: bold">无货品</div>
              <!-- 添加的文字 -->
            </div>
          </div>
        </div>
        <!-- 未结算费用卡片 -->
        <div
          style="
            margin: 0 10rpx 15rpx 10rpx;
            background: white;
            border-radius: 10rpx;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          "
        >
          <!-- 费用标题 -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12rpx 15rpx;
              border-bottom: 2rpx solid #f0f0f0;
            "
          >
            <div style="font-size: 16rpx; font-weight: bold; color: #333">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-fuzhushuxian"
                size="18"
                color="#00aaff"
                style="margin-right: 5rpx"
              ></uni-icons>
              未结算费用
            </div>
            <div>
              <button
                @click="showAddexpenses"
                style="
                  width: 100rpx;
                  height: 28rpx;
                  line-height: 28rpx;
                  font-weight: bold;
                  background-color: white;
                  border: 2rpx solid #00aaff;
                  color: #00aaff;
                  border-radius: 5rpx;
                  font-size: 12rpx;
                  white-space: nowrap;
                  padding: 0;
                "
              >
                添加费用
              </button>
            </div>
          </div>
          <!-- 费用表格 -->
          <div>
            <div
              style="
                display: flex;
                background-color: #e8f4f8;
                font-weight: bold;
                border-bottom: 1px solid #d0d0d0;
                font-size: 14rpx;
              "
            >
              <div style="flex: 2; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">费用名</div>
              <div style="flex: 1; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">金额</div>
              <div style="flex: 2; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">添加时间</div>
              <div style="flex: 3; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">备注</div>
              <div style="flex: 1; padding: 10px; text-align: center">操作</div>
            </div>
            <!-- 表格内容行 -->
            <div
              style="display: flex; border-bottom: 1px solid #e8e8e8; background-color: #fff"
              v-for="(item, index) in expenseList"
            >
              <div
                style="
                  flex: 2;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: bold;
                  color: #333;
                  font-size: 14rpx;
                "
              >
                {{ item.expensesLabel }}
              </div>
              <div
                style="
                  flex: 1;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{ item.expensesMoney }}
              </div>
              <div
                style="
                  flex: 2;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{ item.createTime.replace('T', ' ') }}
              </div>
              <div
                style="
                  flex: 3;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{ item.remark }}
              </div>
              <div
                style="
                  flex: 1;
                  padding: 10px;
                  font-weight: normal;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 5rpx;
                "
              >
                <!-- <uni-icons @click="modifyExpense" custom-prefix="iconfont" type="icon-xiugai" size="16"
									color="#00aaff" style="cursor: pointer;"></uni-icons> -->
                <uni-icons
                  @click="deleteExpense(item, index)"
                  custom-prefix="iconfont"
                  type="icon-shanchu"
                  size="16"
                  color="#ff4444"
                  style="cursor: pointer"
                ></uni-icons>
              </div>
            </div>
            <div style="height: 100rpx" v-if="expenseList.length == 0">
              <div style="margin-top: 40rpx; text-align: center">
                <uni-icons
                  custom-prefix="iconfont"
                  type="icon-kongliebiao"
                  size="40"
                  color="#969696"
                  style="margin-right: 5rpx"
                ></uni-icons>
                <div style="margin-top: 10px; color: #969696; font-weight: bold">未添加费用</div>
                <!-- 添加的文字 -->
              </div>
            </div>
          </div>
        </div>

        <!-- 备注卡片 -->
        <div
          style="
            margin: 0 10rpx 15rpx 10rpx;
            background: white;
            border-radius: 10rpx;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          "
        >
          <!-- 备注标题 -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12rpx 15rpx;
              border-bottom: 2rpx solid #f0f0f0;
            "
          >
            <div style="font-size: 16rpx; font-weight: bold; color: #333">
              <uni-icons type="compose" size="18" color="#00aaff" style="margin-right: 5rpx"></uni-icons>
              备注
            </div>
            <div>
              <button
                style="
                  width: 100rpx;
                  height: 28rpx;
                  line-height: 28rpx;
                  font-weight: bold;
                  background-color: white;
                  border: 2rpx solid #00aaff;
                  color: #00aaff;
                  border-radius: 5rpx;
                  font-size: 12rpx;
                  white-space: nowrap;
                  padding: 0;
                "
              >
                添加备注
              </button>
            </div>
          </div>
          <!-- 备注内容区 -->
          <div style="padding: 15rpx; min-height: 60rpx">
            <div style="color: #999; font-size: 13rpx; text-align: center">暂无备注</div>
          </div>
        </div>

        <!-- 结算记录卡片 -->
        <div
          style="
            margin: 0 10rpx 15rpx 10rpx;
            background: white;
            border-radius: 10rpx;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          "
        >
          <!-- 结算记录标题 -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12rpx 15rpx;
              border-bottom: 2rpx solid #f0f0f0;
            "
          >
            <div style="font-size: 16rpx; font-weight: bold; color: #333">
              <uni-icons
                custom-prefix="iconfont"
                type="icon-jiesuan"
                size="18"
                color="#ff6600"
                style="margin-right: 5rpx"
              ></uni-icons>
              结算记录
            </div>
          </div>
          <!-- 结算记录表格 -->
          <div>
            <div
              style="
                display: flex;
                background-color: #e8f4f8;
                font-weight: bold;
                border-bottom: 1px solid #d0d0d0;
                font-size: 14rpx;
              "
            >
              <div style="flex: 2; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">结算时间</div>
              <div style="flex: 1; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">结算金额</div>
              <div style="flex: 1; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">操作人</div>
              <div style="flex: 2; padding: 10px; border-right: 1px solid #d0d0d0; text-align: center">备注</div>
              <div style="flex: 1; padding: 10px; text-align: center">操作</div>
            </div>
            <!-- 表格内容行 -->
            <div
              style="
                display: flex;
                border-bottom: 1px solid #e8e8e8;
                background-color: #fff;
                cursor: pointer;
                transition: background-color 0.2s;
              "
              v-for="(item, index) in settleRecords"
              :key="item.id"
              @click="viewSettleDetail(item)"
              onmouseover="this.style.backgroundColor='#f5f5f5';"
              onmouseout="this.style.backgroundColor='#fff';"
            >
              <div
                style="
                  flex: 2;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{
                  item.settleTime
                    ? new Date(item.settleTime)
                        .toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        .replace(/\//g, '-')
                    : '--'
                }}
              </div>
              <div
                style="
                  flex: 1;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: bold;
                  color: #ff6600;
                  font-size: 14rpx;
                "
              >
                {{ item.settleMoney ? item.settleMoney.toFixed(2) : '0.00' }}
              </div>
              <div
                style="
                  flex: 1;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{ item.operatorName || '--' }}
              </div>
              <div
                style="
                  flex: 2;
                  padding: 10px;
                  border-right: 1px solid #e8e8e8;
                  text-align: center;
                  font-weight: normal;
                  color: #666;
                  font-size: 13rpx;
                "
              >
                {{ item.remark || '--' }}
              </div>
              <div
                style="
                  flex: 1;
                  padding: 10px;
                  font-weight: normal;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <button
                  @click.stop="cancelSettle(item)"
                  style="
                    height: 20rpx;
                    line-height: 20rpx;
                    padding: 0 6rpx;
                    font-weight: 500;
                    background-color: white;
                    border: 1rpx solid #ff4444;
                    color: #ff4444;
                    border-radius: 3rpx;
                    font-size: 10rpx;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                  "
                  onmouseover="this.style.backgroundColor='#ff4444'; this.style.color='white';"
                  onmouseout="this.style.backgroundColor='white'; this.style.color='#ff4444';"
                >
                  取消结算
                </button>
              </div>
            </div>
            <!-- 无记录提示 -->
            <div style="height: 100rpx" v-if="settleRecords.length === 0">
              <div style="margin-top: 40rpx; text-align: center">
                <uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
                <div style="margin-top: 10px; color: #969696; font-weight: bold">暂无结算记录</div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>

      <!-- 底部结算区域 -->
      <div
        style="
          height: 60rpx;
          background: #ffffff;
          border-top: 2rpx solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15rpx;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
        "
        v-if="!showKeyBoard1"
      >
        <div
          v-if="settingMoney != undefined && batchCommodityTotal.totalMoney != undefined && totalSettle != undefined"
          style="font-weight: bold; font-size: 14rpx; color: #333; flex: 1"
        >
          <text style="color: #666">应结算金额：</text>
          <text style="color: #ff6600; font-size: 20rpx">{{ settingMoney.toFixed(1) }}</text>
          <text style="color: #ff6600; font-size: 14rpx">元</text>
          <text style="color: #999; font-size: 12rpx; margin-left: 10rpx"
            >(销售{{ batchCommodityTotal.totalMoney.toFixed(1) }}-代卖{{ calculatedAssistAmount.toFixed(1) }}-费用{{
              totalSettle.toFixed(1)
            }})</text
          >
        </div>
        <div>
          <button
            :style="{
              width: '100rpx',
              height: '40rpx',
              fontWeight: 'bold',
              background:
                selectBatch && selectBatch.saleStatus === 1
                  ? '#d0d0d0'
                  : 'linear-gradient(135deg, #ff8800 0%, #ff6600 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8rpx',
              lineHeight: '40rpx',
              fontSize: '15rpx',
              boxShadow: selectBatch && selectBatch.saleStatus === 1 ? 'none' : '0 4px 12px rgba(255, 102, 0, 0.3)',
              whiteSpace: 'nowrap',
              padding: '0',
              flexShrink: '0',
              cursor: selectBatch && selectBatch.saleStatus === 1 ? 'not-allowed' : 'pointer',
              opacity: selectBatch && selectBatch.saleStatus === 1 ? '0.6' : '1',
            }"
            @click="handleSettleClick"
          >
            结算
          </button>
        </div>
      </div>
    </div>
    <!-- 新增费用弹窗组件 -->
    <ExpenseAddModal
      :show="expenseAddedShow"
      :expense-labels="expenseLabels"
      @close="closeExpenseModal"
      @confirm="handleExpenseConfirm"
      @add-label="handleAddLabel"
      @delete-label="handleDeleteLabel"
    />

    <div class="assist-modal-container" v-if="assistAmountShow">
      <div class="assist-modal-overlay" @click="handleModalClose"></div>
      <div class="assist-modal">
        <div class="assist-modal-header">
          <h3>代卖费设置</h3>
          <div class="header-actions">
            <button class="btn-cancel" @click="handleModalClose" type="button">取消</button>
            <button class="btn-confirm" @click="handleConfirmAssist" :disabled="!isFormValid" type="button">
              确认
            </button>
          </div>
        </div>

        <div class="assist-modal-body">
          <div class="modal-content" v-if="batchAssist && typeof batchAssist === 'object'">
            <!-- 费用类型选择 -->
            <div class="section">
              <div class="section-title">费用类型</div>
              <div class="type-buttons">
                <button
                  type="button"
                  class="type-button"
                  :class="{ active: batchAssist.assistType === '1' }"
                  @click="selectAssistType('1')"
                >
                  按数量
                </button>
                <button
                  type="button"
                  class="type-button"
                  :class="{ active: batchAssist.assistType === '2' }"
                  @click="selectAssistType('2')"
                >
                  按重量
                </button>
              </div>
            </div>

            <!-- 货品单价设置 -->
            <div class="section" v-if="batchAssist.assistType">
              <div class="section-title">{{ getAmountTitle() }}</div>

              <div class="commodity-price-list">
                <div class="price-hint">请为每个货品设置代卖单价</div>
                <div class="commodity-items">
                  <div class="commodity-price-item" v-for="(item, index) in BatchCommodityList" :key="index">
                    <div class="commodity-name-large">{{ item.commodityName }}</div>
                    <div class="price-input-wrapper">
                      <u--input
                        placeholder="0.00"
                        border="surround"
                        class="price-input"
                        v-model="item.assistUnitPrice"
                        type="number"
                        clearable
                      >
                      </u--input>
                      <span class="price-unit">元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-else class="loading-container">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算弹窗组件 -->
    <SettlementModal
      :visible="showSettlementModal"
      :customerInfo="customerData"
      :initialData="initialSettlementData"
      @close="showSettlementModal = false"
      @confirm="handleSettlementConfirm"
    />
  </div>
</template>

<script>
import category from '../../api/goods/category'
import expense from '../../api/expense/expense'
import batch from '../../api/batch/batch'
import labelApi from '../../api/label/labelApi'
import DropdownOperater from './component/DropdownOperater.vue'
import SettlementModal from '../../components/SettlementModal.vue'
import CustomTabs from '../../components/CustomTabs/CustomTabs.vue'
import ExpenseAddModal from '../../components/ExpenseAddModal.vue'
export default {
  components: {
    DropdownOperater,
    SettlementModal,
    CustomTabs,
    ExpenseAddModal,
  },
  computed: {
    // 计算各列的动态宽度
    columnWidths() {
      return {
        sales: Math.max(150, this.scrollableWidth * 0.25), // 销量列
        avgWeight: Math.max(100, this.scrollableWidth * 0.15), // 均重列
        avgPrice: Math.max(100, this.scrollableWidth * 0.15), // 销售均价列
        totalPrice: Math.max(120, this.scrollableWidth * 0.2), // 销售货款列
        inventory: Math.max(150, this.scrollableWidth * 0.25), // 库存列
      }
    },

    // 计算实际代卖费总额（用于显示）
    calculatedAssistAmount() {
      return this.calculateAssistAmount()
    },

    // 表单验证
    isFormValid() {
      console.log('this.batchAssist', this.batchAssist)
      if (!this.batchAssist || !this.batchAssist.assistType) {
        return false
      }
      console.log('this.batchAssist1', this.batchAssist)
      const assistType = this.batchAssist.assistType

      if (assistType === '0') {
        // 按批次：验证总金额
        return this.isValidAmount(this.batchAssist.assistAmount)
      } else if (assistType === '1' || assistType === '2') {
        // 按数量或按重量：验证至少有一个货品设置了单价
        if (!this.BatchCommodityList || this.BatchCommodityList.length === 0) {
          return false
        }
        return this.BatchCommodityList.some(item => this.isValidAmount(item.assistUnitPrice))
      }
      console.log('this.batchAssist2', this.batchAssist)
      return false
    },

    // 是否显示单位金额输入
    showUnitPriceInput() {
      return (
        this.batchAssist &&
        this.batchAssist.assistType &&
        (this.batchAssist.assistType === '1' || this.batchAssist.assistType === '2')
      )
    },

    // 是否显示总金额输入
    showTotalAmountInput() {
      return this.batchAssist && this.batchAssist.assistType && this.batchAssist.assistType === '0'
    },
  },
  data() {
    return {
      assistAmountShow: false,
      batchAssist: {
        id: this.batchCommodityTotal?.id ?? '',
        assistType: '0', // 默认选择"按批次"，使用字符串
        assistUnitPrice: 0,
        assistAmount: 0,
      },
      expenseAddedShow: false,
      expenseAdded: {},
      expenseLabels: [],
      expenseLabelAddShow: false,
      newExpenseLabel: { label: '' },
      isEditingLabels: false,
      companyId: '',
      shipperAddedName: '',
      shipperList: [],
      batshNewCode: '',
      expenseList: [],
      copyLastBatch: false,
      selectBatch: null,
      batchCommodityTotal: {},
      batchList: [],
      batchShowList: [],
      BatchCommodityList: [],
      settingMoney: 0,
      totalSettle: 0,
      WindowHeight: 0,
      batchCalcType: 1,
      showSettlementModal: false,
      customerData: {},
      initialSettlementData: {},
      showKeyBoard1: false, // 控制键盘显示状态
      scrollableWidth: 0, // 可滚动区域的宽度
      settleRecords: [], // 结算记录列表
      currentTabIndex: 0, // 当前选中的tab索引
      tabList: [
        {
          name: '在售',
          value: 1,
        },
        {
          name: '售罄',
          value: 0,
        },
        {
          name: '已结算',
          value: 2,
        },
        // {
        // 	name: '已结清',
        // 	value: 2
        // },
      ],
      operatorBtnoptions: [
        {
          text: '按数量',
          value: 1,
        },
        {
          text: '按重量',
          value: 2,
        },
      ],
    }
  },
  mounted() {
    this.companyId = uni.getStorageSync('companyId')
    this.getallShipper()
    this.getAllBatch()
    this.getExpenseLabel()
    this.WindowHeight = uni.getWindowInfo().windowHeight

    // 延迟计算宽度，确保DOM已渲染
    this.$nextTick(() => {
      setTimeout(() => {
        this.calculateScrollableWidth()
        // 刷新tabs组件下划线
        this.refreshTabs()
      }, 100)
    })

    // 监听窗口大小变化
    // #ifdef H5
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.calculateScrollableWidth()
      }, 100)
    })
    // #endif
  },
  onShow() {
    // 页面显示时刷新tabs组件
    this.$nextTick(() => {
      setTimeout(() => {
        this.refreshTabs()
      }, 200)
    })
  },
  activated() {
    // 如果使用了 keep-alive，组件激活时也刷新
    this.$nextTick(() => {
      setTimeout(() => {
        this.refreshTabs()
      }, 200)
    })
  },
  beforeUnmount() {
    // 移除窗口大小变化监听
    // #ifdef H5
    window.removeEventListener('resize', this.calculateScrollableWidth)
    // #endif
  },
  methods: {
    // 跳转到货品销售明细
    goToGoodDetail(item) {
      if (!item || !item.id) {
        uni.showToast({
          title: '货品信息不完整',
          icon: 'none',
        })
        return
      }

      uni.navigateTo({
        url: `/pages/settlement/goodSaleDetail?id=${item.id}&name=${encodeURIComponent(item.commodityName)}&isSettled=false`,
      })
    },
    // 计算可滚动区域宽度
    calculateScrollableWidth() {
      // 使用选择器查询获取右侧容器的实际宽度
      const query = uni.createSelectorQuery().in(this)
      query
        .select('.right-content-container')
        .boundingClientRect(data => {
          if (data) {
            // 固定列宽度（150px）
            const fixedColumnWidth = 150
            // 预留边距和可能的滚动条
            const reservedSpace = 10

            // 可滚动区域宽度 = 容器宽度 - 固定列宽度 - 预留空间
            this.scrollableWidth = data.width - fixedColumnWidth - reservedSpace - 115

            // 确保最小宽度
            if (this.scrollableWidth < 300) {
              this.scrollableWidth = 300
            }

          } else {
            // 如果无法获取容器宽度，使用备用方案
            const windowInfo = uni.getWindowInfo()
            const windowWidth = windowInfo.windowWidth
            const leftSideWidth = 100
            const fixedColumnWidth = 150
            this.scrollableWidth = Math.max(300, windowWidth - leftSideWidth - fixedColumnWidth - 20)
          }
        })
        .exec()
    },
    // 计算代卖费总额
    calculateAssistAmount() {
      // 如果没有批次选中或没有代卖费设置，返回0
      if (!this.batchCommodityTotal || !this.batchCommodityTotal.assistType) {
        return 0
      }

      const assistType = String(this.batchCommodityTotal.assistType)

      // 按批次：直接返回代卖费总金额（取绝对值确保返回正数）
      if (assistType === '0') {
        return Math.abs(parseFloat(this.batchCommodityTotal.assistAmount) || 0)
      }

      // 按数量或按重量：计算每个货品的代卖费
      let totalAssistAmount = 0
      if (this.BatchCommodityList && this.BatchCommodityList.length > 0) {
        for (let i = 0; i < this.BatchCommodityList.length; i++) {
          const item = this.BatchCommodityList[i]
          const unitPrice = parseFloat(item.settlementUnitPrice) || 0
          if (assistType === '1') {
            // 按数量：代卖费单价 * 货品数量
            let totalMount = 0
            if (item.outPutSaleMount && item.outPutSaleMount.length > 0) {
              for (let k = 0; k < item.outPutSaleMount.length; k++) {
                totalMount += item.outPutSaleMount[k].mount || 0
              }
            }
            totalAssistAmount += unitPrice * totalMount
          } else if (assistType === '2') {
            // 按重量：代卖费单价 * 货品总重量
            const weight = parseFloat(item.saleWeight) || 0
            totalAssistAmount += unitPrice * weight
          }
        }
      }

      // 返回绝对值，确保代卖费始终为正数
      return Math.abs(totalAssistAmount)
    },

    operabtnChange(e) {
      console.log('e', e)
    },
    settingRecount() {
      this.totalSettle = 0
      for (var i = 0; i < this.expenseList.length; i++) {
        this.totalSettle += this.expenseList[i].expensesMoney
      }

      // 计算代卖费总额
      const assistAmount = this.calculateAssistAmount()

      // 应结算金额 = 销售货款 - 代卖费 - 费用
      this.settingMoney = (this.batchCommodityTotal.totalMoney || 0) - assistAmount - this.totalSettle
    },
    deleteExpense(data, index) {
      // 调用接口添加费用
      batch
        .CancelBatchExpense(data)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
            })

            this.expenseList.splice(index, 1)
            this.settingRecount()
          } else {
            uni.showToast({
              title: res.message || '删除失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          console.error('删除费用失败:', error)
          uni.showToast({
            title: '删除失败，请重试',
            icon: 'none',
          })
        })
    },
    refreshTabs() {
      // 刷新批次数据
      category.GetAllBatch(this.companyId).then(res => {
        this.batchList = res.data
        this.batchList = this.batchList.sort(
          (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        )

        // 根据当前选中的tab筛选批次
        const currentTab = this.tabList[this.currentTabIndex]
        if (currentTab) {
          this.batchShowList = this.batchList.filter(batch => {
            return batch.saleStatus === currentTab.value
          })

          // 如果当前选中的批次不在筛选后的列表中，清空选中状态
          if (this.selectBatch && !this.batchShowList.find(b => b.id === this.selectBatch.id)) {
            this.BatchCommodityList = []
            this.expenseList = []
            this.settleRecords = []
            this.selectBatch = null
          }

          // 如果有批次，选中第一个
          if (this.batchShowList.length > 0 && !this.selectBatch) {
            this.exchangeBatch(this.batchShowList[0])
          }
        }
      })
    },
    changeType(item) {
      // 更新当前选中的tab索引
      this.currentTabIndex = item.index

      this.batchShowList = []
      this.batchShowList = this.batchList.filter(batch => {
        return batch.saleStatus === item.value
      })
      this.BatchCommodityList = []
      this.expenseList = []
      this.settleRecords = []
      this.selectBatch = null
      if (this.batchShowList?.length > 0) {
        this.exchangeBatch(this.batchShowList[0])
      }
    },
    handleSettleClick() {
      // 检查是否为在售批次
      if (this.selectBatch && this.selectBatch.saleStatus === 1) {
        uni.showModal({
          title: '无法结算',
          content: '在售批次不能结算，请先将批次设置为售罄状态',
          showCancel: false,
          confirmText: '我知道了',
        })
        return
      }
      this.settle()
    },
    settle() {
      if (!this.selectBatch) {
        uni.showToast({
          title: '请选择批次',
          icon: 'none',
        })
        return
      }

      // 跳转到结算确认页面
      uni.navigateTo({
        url: `/pages/settlement/settlementConfirm?batchId=${this.selectBatch.id}`,
      })
    },
    getExpenseByBatchId(batchId) {
      expense.getAllUnsettleExpenseByBatchId(batchId).then(res => {
        this.expenseList = res.data
        this.settingRecount()
      })
    },
    // 获取结算记录
    getSettleRecords(batchId) {
      batch
        .GetSettleRecordsByBatchIdWithJoin(batchId)
        .then(res => {
          if (res.code === 200) {
            this.settleRecords = res.data || []
          } else {
            this.settleRecords = []
          }
        })
        .catch(error => {
          console.error('获取结算记录失败:', error)
          this.settleRecords = []
        })
    },
    // 查看结算详情
    viewSettleDetail(record) {
      if (!record || !record.id) {
        uni.showToast({
          title: '结算记录信息不完整',
          icon: 'none',
        })
        return
      }

      // 获取当前批次信息
      const batchCode = this.selectBatch?.batchCode || ''
      const shipperName = this.selectBatch?.shipperName || ''
      const assistType = this.selectBatch?.assistType || 0
      const assistAmount = this.selectBatch?.assistAmount || 0
      const batchId = this.selectBatch?.id || ''

      // 跳转到结算记录详情页，传递批次信息
      uni.navigateTo({
        url: `/pages/settlement/settlementDetail?settleRecordId=${record.id}&batchId=${batchId}&batchCode=${encodeURIComponent(batchCode)}&shipperName=${encodeURIComponent(shipperName)}&assistType=${assistType}&assistAmount=${assistAmount}`,
      })
    },
    // 取消结算
    cancelSettle(record) {
      if (!record || !record.id) {
        uni.showToast({
          title: '结算记录信息不完整',
          icon: 'none',
        })
        return
      }

      uni.showModal({
        title: '确认取消结算',
        content: `确定要取消这笔 ${record.settleMoney ? record.settleMoney.toFixed(2) : '0.00'} 元的结算吗？取消后将恢复批次的未结算状态。`,
        confirmColor: '#ff4444',
        success: res => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...',
            })

            // 调用取消结算API
            batch
              .CancelBatchSettle(record.id)
              .then(response => {
                uni.hideLoading()

                if (response.code === 200) {
                  uni.showToast({
                    title: '取消结算成功',
                    icon: 'success',
                  })

                  // 刷新数据
                  if (this.selectBatch) {
                    this.getSettleRecords(this.selectBatch.id)
                    this.getBatchCommodityList(this.selectBatch.id)
                    this.getExpenseByBatchId(this.selectBatch.id)
                  }
                } else {
                  uni.showToast({
                    title: response.message || '取消结算失败',
                    icon: 'none',
                  })
                }
              })
              .catch(error => {
                uni.hideLoading()
                console.error('取消结算失败:', error)
                uni.showToast({
                  title: '网络错误，请重试',
                  icon: 'none',
                })
              })
          }
        },
      })
    },
    padZero(num) {
      return num.toString().padStart(2, '0')
    },
    AddExpense() {
      if (!this.expenseAdded.label || !this.expenseAdded.money) {
        uni.showToast({
          title: '请选择费用项并输入金额',
          icon: 'none',
        })
        return
      }

      // 获取用户信息
      var userInfo = uni.getStorageSync('userInfo')

      // 构建请求数据
      const expenseData = {
        batchId: this.selectBatch.id,
        expensesLabel: this.expenseAdded.label,
        expensesMoney: parseFloat(this.expenseAdded.money),
        remark: this.expenseAdded.remark || '',
        operatorId: userInfo.id,
      }

      uni.showLoading({
        title: '添加中...',
      })

      // 调用接口添加费用
      batch
        .AddBatchExpense(expenseData)
        .then(res => {
          uni.hideLoading()

          if (res.code === 200) {
            uni.showToast({
              title: '添加成功',
              icon: 'success',
            })

            // 关闭弹窗
            this.closeExpenseModal()

            // 刷新未结算费用列表
            this.getExpenseByBatchId(this.selectBatch.id)
          } else {
            uni.showToast({
              title: res.message || '添加失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          uni.hideLoading()
          console.error('添加费用失败:', error)
          uni.showToast({
            title: '添加失败，请重试',
            icon: 'none',
          })
        })
    },
    showAddexpenses() {
      if (!this.selectBatch) return
      this.expenseAddedShow = true
      // 重置编辑模式状态
      this.isEditingLabels = false
      this.expenseAdded = {
        money: 0,
        remark: '',
        labelId: this.expenseLabels.length > 0 ? this.expenseLabels[0].id : null,
        label: this.expenseLabels.length > 0 ? this.expenseLabels[0].label : '',
      }
    },
    // 选择费用标签
    selectExpenseLabel(label) {
      this.expenseAdded.labelId = label.id
      this.expenseAdded.label = label.label
    },
    // 关闭费用弹窗
    closeExpenseModal() {
      this.expenseAddedShow = false
      // 重置编辑模式状态
      this.isEditingLabels = false
    },
    // 切换编辑模式
    toggleEditMode() {
      this.isEditingLabels = !this.isEditingLabels
      if (this.isEditingLabels) {
        uni.showToast({
          title: '编辑模式已开启',
          icon: 'none',
          duration: 1500,
        })
      } else {
        uni.showToast({
          title: '编辑模式已关闭',
          icon: 'success',
          duration: 1500,
        })
      }
    },
    // 显示新增费用标签弹窗
    showAddExpenseLabel() {
      this.expenseLabelAddShow = true
      this.newExpenseLabel = { label: '' }
    },
    // 添加费用标签
    addExpenseLabel() {
      if (!this.newExpenseLabel.label.trim()) {
        uni.showToast({
          title: '请输入标签名称',
          icon: 'none',
        })
        return
      }
      var userInfo = uni.getStorageSync('userInfo')
      const labelData = {
        companyId: this.companyId,
        label: this.newExpenseLabel.label.trim(),
        labelType: 1,
        operatorId: userInfo.id,
      }

      labelApi
        .createExpenseLabel(labelData)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '添加成功',
              icon: 'success',
            })
            this.expenseLabelAddShow = false
            this.getExpenseLabel() // 重新获取标签列表
          } else {
            uni.showToast({
              title: res.message || '添加失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          uni.showToast({
            title: '网络错误',
            icon: 'none',
          })
        })
    },
    // 删除费用标签
    deleteExpenseLabel(label, index) {
      console.log('label', label)
      uni.showModal({
        title: '确认删除',
        content: `确定要删除费用标签"${label.label}"吗？`,
        success: res => {
          if (res.confirm) {
            labelApi
              .deleteExpenseLabel(label.id)
              .then(response => {
                if (response.code === 200) {
                  uni.showToast({
                    title: '删除成功',
                    icon: 'success',
                  })
                  this.getExpenseLabel() // 重新获取标签列表

                  // 如果当前选中的标签被删除，重置选择
                  if (this.expenseAdded.labelId === label.id && this.expenseLabels.length > 1) {
                    const remainingLabels = this.expenseLabels.filter(l => l.id !== label.id)
                    if (remainingLabels.length > 0) {
                      this.selectExpenseLabel(remainingLabels[0])
                    }
                  }
                } else {
                  uni.showToast({
                    title: response.message || '删除失败',
                    icon: 'none',
                  })
                }
              })
              .catch(error => {
                uni.showToast({
                  title: '网络错误',
                  icon: 'none',
                })
              })
          }
        },
      })
    },

    // 验证金额是否有效
    isValidAmount(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return false
      }
      const num = parseFloat(amount)
      return !isNaN(num) && num > 0
    },

    // 处理模态框关闭
    handleModalClose() {
      this.assistAmountShow = false
      this.resetFormData()
    },

    // 重置表单数据
    resetFormData() {
      if (this.batchAssist) {
        this.batchAssist.assistType = '0' // 重置为默认的"按批次"
        this.batchAssist.assistUnitPrice = 0
        this.batchAssist.assistAmount = 0
      }
    },

    // 处理费用类型变化
    handleTypeChange() {
      // 当费用类型改变时，清空对应的金额字段
      if (this.batchAssist) {
        this.batchAssist.assistUnitPrice = 0
        this.batchAssist.assistAmount = 0
      }
    },

    // 选择费用类型
    selectAssistType(type) {
      if (this.batchAssist) {
        const oldType = this.batchAssist.assistType
        this.batchAssist.assistType = type

        // 切换类型时的处理
        if (oldType !== type) {
          // 从按批次切换到按数量/重量时，清空批次总金额
          if (oldType === '0' && (type === '1' || type === '2')) {
            this.batchAssist.assistAmount = ''
          }
          // 从按数量/重量切换到按批次时，清空货品单价
          if ((oldType === '1' || oldType === '2') && type === '0') {
            if (this.BatchCommodityList) {
              this.BatchCommodityList.forEach(item => {
                this.$set(item, 'assistUnitPrice', '')
              })
            }
          }
          // 在按数量和按重量之间切换时，保留货品单价输入
        }
      }
    },

    // 获取金额标题
    getAmountTitle() {
      if (!this.batchAssist.assistType) return '金额设置'

      const titles = {
        0: '代卖费总金额',
        1: '代卖单价（按数量）',
        2: '代卖单价（按重量）',
      }
      return titles[this.batchAssist.assistType] || '金额设置'
    },

    // 获取金额占位符
    getAmountPlaceholder() {
      if (!this.batchAssist.assistType) return '请先选择费用类型'

      const placeholders = {
        0: '请输入总金额',
        1: '请输入每个商品的费用',
        2: '请输入每公斤的费用',
      }
      return placeholders[this.batchAssist.assistType] || '请输入金额'
    },

    // 获取快捷金额选项
    getQuickAmounts() {
      if (!this.batchAssist.assistType) return []

      const amounts = {
        0: [10, 20, 50, 100, 200, 500], // 按批次的常用总金额
        1: [0.5, 1, 2, 5, 10, 20], // 按数量的常用单价
        2: [2, 5, 10, 15, 20, 30], // 按重量的常用单价
      }
      return amounts[this.batchAssist.assistType] || []
    },

    // 获取当前金额
    getCurrentAmount() {
      if (!this.batchAssist.assistType) return ''

      if (this.batchAssist.assistType === '0') {
        return this.batchAssist.assistAmount || ''
      } else {
        return this.batchAssist.assistUnitPrice || ''
      }
    },

    // 更新当前金额
    updateCurrentAmount(event) {
      const value = parseFloat(event.target.value) || 0

      if (this.batchAssist.assistType === '0') {
        this.batchAssist.assistAmount = value
        this.batchAssist.assistUnitPrice = 0
      } else {
        this.batchAssist.assistUnitPrice = value
        this.batchAssist.assistAmount = 0
      }
    },

    // 设置快捷金额
    setQuickAmount(amount) {
      if (this.batchAssist.assistType === '0') {
        this.batchAssist.assistAmount = amount
        this.batchAssist.assistUnitPrice = 0
      } else {
        this.batchAssist.assistUnitPrice = amount
        this.batchAssist.assistAmount = 0
      }
    },

    // 检查快捷金额是否激活
    isQuickAmountActive(amount) {
      const currentAmount = this.getCurrentAmount()
      return parseFloat(currentAmount) === amount
    },

    // 验证输入
    validateInput(event) {
      const value = event.target.value
      // 确保输入的是有效数字
      if (value && isNaN(parseFloat(value))) {
        event.target.value = ''
        this.$nextTick(() => {
          // 触发响应式更新
          if (event.target.name === 'assistUnitPrice') {
            this.batchAssist.assistUnitPrice = 0
          } else if (event.target.name === 'assistAmount') {
            this.batchAssist.assistAmount = 0
          }
        })
      }
    },

    // 格式化输入
    formatInput(event) {
      const value = parseFloat(event.target.value)
      if (!isNaN(value) && value >= 0) {
        event.target.value = value.toFixed(2)
      }
    },

    // 处理确认添加
    handleConfirmAssist() {
      if (!this.isFormValid) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none',
        })
        return
      }
      this.UpdateBatchAssist()
    },

    UpdateBatchAssist() {
      try {
        console.log('this.batchAssist', this.batchAssist)

        // 数据验证
        if (!this.batchAssist || !this.selectBatch) {
          uni.showToast({
            title: '数据异常，请重试',
            icon: 'none',
          })
          return
        }

        // 类型转换和验证
        const assistType = parseInt(this.batchAssist.assistType)
        if (isNaN(assistType) || assistType < 0 || assistType > 2) {
          uni.showToast({
            title: '费用类型无效',
            icon: 'none',
          })
          return
        }

        // 根据费用类型构建数据
        let settleData = {
          batchId: this.selectBatch.id,
          settleType: assistType,
          batchSettleAmount: 0, // 默认为0，按批次时会更新
          assistPurchaseSettleModelList: [],
        }

        if (assistType === 0) {
          // 按批次 - 用户输入总金额，需要分配到每个货品
          const totalAmount = this.parseAmount(this.batchAssist.assistAmount)

          if (totalAmount <= 0) {
            uni.showToast({
              title: '请输入有效的总金额',
              icon: 'none',
            })
            return
          }

          if (!this.BatchCommodityList || this.BatchCommodityList.length === 0) {
            uni.showToast({
              title: '没有可分配的货品',
              icon: 'none',
            })
            return
          }

          // 按批次时，设置批次总金额
          settleData.batchSettleAmount = totalAmount

          // 将总金额平均分配到每个货品
          // 也可以按销售额比例分配，这里采用平均分配
          const averageAmount = totalAmount / this.BatchCommodityList.length

          settleData.assistPurchaseSettleModelList = this.BatchCommodityList.map(item => ({
            purchaseAssistId: item.id,
            SettleAmount: averageAmount,
          }))

          console.log('按批次分配 - 总金额:', totalAmount, '平均单价:', averageAmount)
        } else {
          // 按数量（1）或重量（2）- 用户为每个货品输入单价
          const commoditiesWithPrice = this.BatchCommodityList.filter(item => this.isValidAmount(item.assistUnitPrice))

          if (commoditiesWithPrice.length === 0) {
            uni.showToast({
              title:
                assistType === 1 ? '请至少为一个货品设置代卖单价（元/个）' : '请至少为一个货品设置代卖单价（元/斤）',
              icon: 'none',
            })
            return
          }

          // 按数量或重量时，batchSettleAmount = 0（已在初始化时设置）
          settleData.assistPurchaseSettleModelList = commoditiesWithPrice.map(item => ({
            purchaseAssistId: item.id,
            SettleAmount: this.parseAmount(item.assistUnitPrice),
          }))

          console.log(assistType === 1 ? '按数量设置' : '按重量设置', '货品数量:', commoditiesWithPrice.length)
        }

        // 提交数据
        this.submitBatchAssist(settleData)
      } catch (error) {
        console.error('UpdateBatchAssist 错误:', error)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none',
        })
      }
    },

    // 提交批次代卖费数据
    submitBatchAssist(settleData) {
      // 显示加载状态
      uni.showLoading({
        title: '处理中...',
      })

      console.log('提交的结算数据:', settleData)

      // 调用新的API接口
      batch
        .UpdateBatchSettleAmountSetting(settleData)
        .then(res => {
          uni.hideLoading()

          if (res && res.code === 200) {
            uni.showToast({
              title: '设置成功',
              icon: 'success',
            })

            // 关闭弹窗并刷新数据
            this.handleModalClose()
            this.getBatchCommodityList(this.selectBatch.id)
          } else {
            uni.showToast({
              title: res?.message || '设置失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          uni.hideLoading()
          console.error('设置代卖费失败:', error)
          uni.showToast({
            title: '网络错误，请重试',
            icon: 'none',
          })
        })
    },
    getExpenseLabel() {
      labelApi.GetExpenseLabel(this.companyId, 1).then(res => {
        if (res.code === 200) {
          this.expenseLabels = res.data || []
        }
      })
    },
    // 安全解析金额
    parseAmount(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return 0
      }
      const num = parseFloat(amount)
      return isNaN(num) ? 0 : Math.max(0, num)
    },
    showSetBatchAssist() {
      if (!this.selectBatch) return

      this.assistAmountShow = true

      // 初始化代卖费设置数据
      this.batchAssist = {
        id: this.selectBatch.id,
        assistType: String(this.batchCommodityTotal.assistType || '1'), // 转换为字符串
        assistUnitPrice: this.batchCommodityTotal.assistUnitPrice || 0,
        assistAmount: this.batchCommodityTotal.assistAmount || '',
      }

      // 初始化每个货品的代卖单价，从 settlementUnitPrice 字段获取
      if (this.BatchCommodityList && this.BatchCommodityList.length > 0) {
        this.BatchCommodityList.forEach(item => {
          // 从 settlementUnitPrice 字段加载已设置的代卖单价
          const unitPrice = item.settlementUnitPrice || ''
          this.$set(item, 'assistUnitPrice', unitPrice)
        })
      }

      console.log(
        '打开代卖费设置弹窗 - 当前类型:',
        this.batchAssist.assistType,
        '总金额:',
        this.batchAssist.assistAmount
      )
    },
    exchangeBatch(item) {
      this.selectBatch = item
      this.getBatchCommodityList(item.id)
      this.getExpenseByBatchId(item.id)
      this.getSettleRecords(item.id)
    },
    getBatchCommodityList(id) {
      batch.GetUnsettleAssistBatchInfoAsync(id).then(res => {
        this.batchCommodityTotal = {
          assistType: res.data.assistType,
          assistAmount: res.data.assistAmount,
          assistUnitPrice: res.data.assistUnitPrice,
          totalMount: 0,
          totalWeight: 0,
          totalMoney: res.data.saleSubTotal,
          totalInventory: 0,
        }
        this.BatchCommodityList = res.data.allPurchaseAssistList
        this.BatchCommodityList.sort((a, b) => b.inventorySold - a.inventorySold)
        if (this.BatchCommodityList.length > 0) {
          for (var i = 0; i < this.BatchCommodityList.length; i++) {
            this.batchCommodityTotal.totalWeight += this.BatchCommodityList[i].saleWeight
            //计算库存
            for (var k = 0; k < this.BatchCommodityList[i].outPutPurchaseInventories?.length; k++) {
              let element = this.BatchCommodityList[i].outPutPurchaseInventories[k]
              this.batchCommodityTotal.totalInventory += element.mount
            }
            //计算售量
            for (var k = 0; k < this.BatchCommodityList[i].outPutSaleMount?.length; k++) {
              let element = this.BatchCommodityList[i].outPutSaleMount[k]
              this.batchCommodityTotal.totalMount += element.mount
            }
          }
        }
        this.settingRecount()

        // 数据加载完成后重新计算宽度
        this.$nextTick(() => {
          setTimeout(() => {
            this.calculateScrollableWidth()
          }, 50)
        })
      })
    },
    setSaleStatus(info) {
      var newBatch = JSON.parse(JSON.stringify(this.selectBatch))
      newBatch.saleStatus = info
      category.UpdateBatchStatus(newBatch).then(res => {
        if (res.code === 200) {
          uni.showToast({
            title: info === 0 ? '已设置为售罄' : '已设置为在售',
            icon: 'success',
            duration: 1500,
          })
          // 更新当前选中批次的状态
          this.selectBatch.saleStatus = info

          // 更新批次列表中对应项的状态
          const batchInList = this.batchList.find(b => b.id === this.selectBatch.id)
          if (batchInList) {
            batchInList.saleStatus = info
          }

          // 根据当前tab重新过滤显示列表
          const currentTab = this.tabList[this.currentTabIndex]
          if (currentTab) {
            this.batchShowList = this.batchList.filter(batch => {
              return batch.saleStatus === currentTab.value
            })
          }

          // 如果当前批次不在新的显示列表中，选择第一个批次
          if (!this.batchShowList.find(b => b.id === this.selectBatch.id)) {
            if (this.batchShowList.length > 0) {
              this.exchangeBatch(this.batchShowList[0])
            } else {
              // 如果没有批次了，清空数据
              this.BatchCommodityList = []
              this.expenseList = []
              this.settleRecords = []
              this.selectBatch = null
            }
          }
        } else {
          uni.showToast({
            title: res.message || '操作失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    },
    getallShipper() {
      category.GetAllShipper(this.companyId).then(res => {
        this.shipperList = res.data
        if (this.shipperList.length > 0) {
          this.shipperSelectedId = this.shipperList[0].id

          this.getBatchNewCodeByShipperId()
        }
      })
    },
    getAllBatch() {
      category.GetAllBatch(this.companyId).then(res => {
        this.batchList = res.data
        this.batchList = this.batchList.sort(
          (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        )
        this.batchShowList = this.batchList.filter(x => x.saleStatus === 1)
        if (this.batchShowList.length > 0) {
          this.selectBatch = this.batchShowList[0]
          this.getExpenseByBatchId(this.selectBatch.id)
          this.getBatchCommodityList(this.selectBatch.id)
          this.getSettleRecords(this.selectBatch.id)
        }
      })
    },
    shipperSelect(e) {
      this.shipperSelectedId = e
      this.getBatchNewCodeByShipperId()
    },
    getBatchNewCodeByShipperId() {
      category.GetNewBatchCode(this.companyId, this.shipperSelectedId).then(res => {
        this.batshNewCode = res.data
      })
    },

    // 处理费用添加组件的事件
    handleExpenseConfirm(expenseData) {
      // 获取用户信息
      var userInfo = uni.getStorageSync('userInfo')

      // 构建请求数据
      const requestData = {
        batchId: this.selectBatch.id,
        expensesLabel: expenseData.labelName,
        expensesMoney: parseFloat(expenseData.money),
        remark: expenseData.remark || '',
        operatorId: userInfo.id,
      }

      uni.showLoading({
        title: '添加中...',
      })

      // 调用接口添加费用
      batch
        .AddBatchExpense(requestData)
        .then(res => {
          uni.hideLoading()

          if (res.code === 200) {
            uni.showToast({
              title: '添加成功',
              icon: 'success',
            })

            // 关闭弹窗
            this.closeExpenseModal()

            // 刷新未结算费用列表
            this.getExpenseByBatchId(this.selectBatch.id)
          } else {
            uni.showToast({
              title: res.message || '添加失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          uni.hideLoading()
          console.error('添加费用失败:', error)
          uni.showToast({
            title: '网络错误，请重试',
            icon: 'none',
          })
        })
    },

    handleAddLabel(labelName) {
      const newLabel = {
        label: labelName,
        companyId: this.companyId,
        labelType: 1,
      }

      labelApi
        .AddExpenseLabel(newLabel)
        .then(res => {
          if (res.code === 200) {
            uni.showToast({
              title: '添加成功',
              icon: 'success',
            })
            this.getExpenseLabel()
          } else {
            uni.showToast({
              title: res.message || '添加失败',
              icon: 'none',
            })
          }
        })
        .catch(error => {
          console.error('添加标签失败:', error)
          uni.showToast({
            title: '网络错误，请重试',
            icon: 'none',
          })
        })
    },

    handleDeleteLabel({ label }) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除标签"${label.label}"吗？`,
        success: res => {
          if (res.confirm) {
            labelApi
              .DeleteExpenseLabel(label.id)
              .then(res => {
                if (res.code === 200) {
                  uni.showToast({
                    title: '删除成功',
                    icon: 'success',
                  })
                  this.getExpenseLabel()
                } else {
                  uni.showToast({
                    title: res.message || '删除失败',
                    icon: 'none',
                  })
                }
              })
              .catch(error => {
                console.error('删除标签失败:', error)
                uni.showToast({
                  title: '网络错误，请重试',
                  icon: 'none',
                })
              })
          }
        },
      })
    },
  },
}
</script>

<style>
/* 右侧内容容器样式 */
.right-content-container {
  box-sizing: border-box;
  max-width: 100%;
}

.expenseBtn {
  height: 20rpx;
  font-weight: bold;
  font-size: 12rpx;
  line-height: 20rpx;
  border: solid 1px #7a7a7a;
  background-color: white;
  color: #7a7a7a;
  border-radius: 10rpx;
  padding: 0 8rpx;
  margin: 2rpx;
  transition: all 0.3s ease;
}

.expenseBtn:hover {
  border-color: dodgerblue;
  color: dodgerblue;
}

.expenseBtnActive {
  background-color: dodgerblue;
  color: white;
  border: solid 1px dodgerblue;
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
  background-color: #2196f3;
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

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-header i {
  font-size: 1.8rem;
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.card-body {
  padding: 25px;
}

.card-1 .card-header {
  background: linear-gradient(135deg, #3498db 0%, #1a5276 100%);
}

.card-2 .card-header {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.modal-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group {
  position: relative;
  margin-bottom: 15px;
}

select,
input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

select:focus,
input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background: white;
}

.unit {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  font-weight: bold;
  font-size: 14px;
}

.input-with-label {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 0 15px;
  border: 1px solid #e0e0e0;
}

.input-with-label span {
  color: #7f8c8d;
  font-size: 14px;
  min-width: 80px;
}

.input-with-label input {
  border: none;
  background: transparent;
  padding: 12px 0;
}

.input-with-label input:focus {
  box-shadow: none;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  gap: 15px;
}

button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  flex: 1;
  background: #f1f2f6;
  color: #7f8c8d;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  flex: 1;
  background: linear-gradient(135deg, #3498db 0%, #1a5276 100%);
  color: white;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #2980b9 0%, #154360 100%);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

/* 新增费用弹窗样式优化 */
.expense-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
  width: 380rpx;
  max-height: 90vh;
  z-index: 9999;
}

.expense-card {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.expense-card .card-header {
  background: linear-gradient(135deg, #2198cf 0%, #2198cf 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  height: 45px;

  .header-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    i {
      font-size: 1.2rem;
    }

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: white;
    }
  }

  .header-btn-cancel,
  .header-btn-confirm {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    height: 40px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
  }

  .header-btn-cancel {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .header-btn-confirm {
    background: white;
    color: #2198cf;

    &:hover {
      background: #f0f0f0;
    }

    &:disabled {
      background: rgba(255, 255, 255, 0.5);
      color: rgba(33, 152, 207, 0.5);
      cursor: not-allowed;
    }
  }
}

.expense-card .card-body {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 45px);
}

/* 按钮式费用类型选择 */
.fee-buttons-container {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.fee-button {
  flex: 1;
  min-width: 100px;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  outline: none;

  &:hover {
    border-color: #e74c3c;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.15);
  }

  &.active {
    border-color: #e74c3c;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
    transform: translateY(-3px);

    i {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  i {
    font-size: 18px;
    transition: all 0.3s ease;
  }

  span {
    font-size: 13px;
    line-height: 1;
  }
}

/* 金额设置容器 */
.amount-setting-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

/* 快捷金额按钮 */
.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-amount-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    border-color: #e74c3c;
    color: #e74c3c;
    transform: scale(1.05);
  }

  &.active {
    border-color: #e74c3c;
    background: #e74c3c;
    color: white;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }
}

/* 自定义金额输入 */
.custom-amount-input {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .input-hint {
    font-size: 13px;
    color: #7f8c8d;
    padding-left: 5px;
    font-weight: 500;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .input-unit {
    font-size: 14px;
    color: #667eea;
    font-weight: 600;
    white-space: nowrap;
  }
}

/* 货品列表容器 */
.commodity-list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .input-hint {
    font-size: 13px;
    color: #7f8c8d;
    padding-left: 5px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .commodity-scroll {
    border: 1px solid #e9ecef;
    border-radius: 10px;
    background: #f8f9fa;
    padding: 10px;

    .commodity-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: white;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .commodity-name {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: #2c3e50;
        padding-right: 15px;
      }

      .commodity-input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;

        .input-unit-inline {
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
          white-space: nowrap;
        }
      }
    }
  }

  .input-with-icon {
    position: relative;

    .input-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #7f8c8d;
      font-size: 14px;
      z-index: 2;
    }

    .expense-input {
      width: 100%;
      padding: 14px 60px 14px 45px;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      background: white;
      font-size: 16px;
      color: #2c3e50;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
      }

      &:hover {
        border-color: #dc3545;
      }

      &::placeholder {
        color: #bdc3c7;
        font-size: 14px;
      }
    }

    .currency-suffix {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #7f8c8d;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

/* 响应式适配 */
@media (max-width: 480px) {
  .fee-buttons-container {
    flex-direction: column;
  }

  .fee-button {
    flex-direction: row;
    justify-content: center;
    min-width: auto;
    padding: 12px 20px;

    i {
      font-size: 16px;
    }

    span {
      font-size: 14px;
    }
  }

  .quick-amounts {
    justify-content: center;
  }

  .quick-amount-btn {
    min-width: 60px;
    text-align: center;
  }

  /* 移动端按钮仍保持一行显示 */
  .buttons {
    flex-direction: row !important;
    gap: 12px;
  }

  .btn-cancel,
  .btn-confirm {
    width: auto;
    flex: 1;
    min-width: 0;
    padding: 12px 16px;
    font-size: 14px;
  }
}

/* 输入框样式 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 15px;
    color: #7f8c8d;
    font-size: 14px;
    z-index: 2;
  }

  .expense-input {
    width: 100%;
    padding: 12px 60px 12px 45px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    color: #2c3e50;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    &:hover {
      border-color: #dc3545;
    }

    &::placeholder {
      color: #bdc3c7;
    }

    /* 移除数字输入框的箭头 */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type='number'] {
      appearance: textfield;
      -moz-appearance: textfield;
    }
  }

  .currency-suffix {
    position: absolute;
    right: 15px;
    color: #7f8c8d;
    font-size: 14px;
    font-weight: 500;
  }
}

/* 按钮禁用状态 */
.btn-confirm:disabled {
  background: #bdc3c7 !important;
  color: #7f8c8d !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.btn-confirm:disabled:hover {
  background: #bdc3c7 !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 动画效果 */
.expense-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #7f8c8d;
}

.loading-spinner {
  margin-bottom: 15px;

  i {
    font-size: 24px;
    color: #e74c3c;
  }
}

.loading-container p {
  margin: 0;
  font-size: 14px;
  color: #95a5a6;
}

/* CSS兼容性增强 */
.expense-select {
  /* 兼容性过渡效果 */
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.expense-input {
  /* 兼容性过渡效果 */
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

/* 按钮兼容性 */
.btn-cancel,
.btn-confirm {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  -webkit-tap-highlight-color: transparent;
}

.expense-card .card-body {
  padding: 15px;
}

.buttons {
  flex-direction: row;
  gap: 12px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  min-width: 0;
}

/* 移动端输入框优化 */
.expense-input {
  font-size: 16px; /* 防止 iOS Safari 缩放 */
}

/* 美化的新增费用弹窗样式 */
.expense-add-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expense-add-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.expense-add-modal {
  position: relative;
  width: 90%;
  max-width: 650px;
  max-height: 80vh;
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50rpx) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.expense-add-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25rpx 30rpx;
  position: relative;
  display: flex;
  align-items: center;
  gap: 15rpx;
  flex-shrink: 0;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expense-add-modal-header h3 {
  color: white;
  font-size: 18rpx;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.close-btn {
  width: 35rpx;
  height: 35rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.expense-add-modal-body {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
}

.input-section {
  margin-bottom: 25rpx;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 16rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.add-label-btn {
  margin-left: auto;
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 !important;
  box-sizing: border-box;
}

.add-label-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  flex: 1;
  border-radius: 5rpx !important;
  border: 2rpx solid #e9ecef !important;
  transition: all 0.3s ease;
  height: 40rpx;
  font-size: 30rpx !important;
}

.amount-input:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1) !important;
}

.currency-unit {
  position: absolute;
  right: 20rpx;
  color: #666;
  font-size: 16rpx;
  font-weight: 600;
  pointer-events: none;
}

.expense-labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  min-height: 40rpx;
  align-items: flex-start;
}

.no-labels-tip {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14rpx;
  padding: 15rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
  width: 100%;
  box-sizing: border-box;
}

.expense-label-btn {
  padding: 8rpx 16rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 20rpx;
  background: white;
  color: #666;
  font-size: 14rpx;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5rpx;
}

.expense-label-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2rpx);
}

.expense-label-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.3);
}

.expense-label-btn.editing {
  border-color: #ff7875;
  animation: editingPulse 2s infinite;
}

@keyframes editingPulse {
  0%,
  100% {
    border-color: #ff7875;
    box-shadow: 0 0 0 0 rgba(255, 120, 117, 0.4);
  }
  50% {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 4px rgba(255, 120, 117, 0.2);
  }
}

.delete-label-btn {
  margin-left: 5rpx;
  width: 20rpx;
  height: 20rpx;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12rpx;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  z-index: 99;
  animation: deleteButtonShow 0.3s ease-out;
}

@keyframes deleteButtonShow {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.delete-label-btn:hover {
  background: #ff3742;
  transform: scale(1.3);
  box-shadow: 0 2rpx 8rpx rgba(255, 71, 87, 0.4);
}

.remark-textarea {
  border-radius: 12rpx !important;
  border: 2rpx solid #e9ecef !important;
  min-height: 80rpx !important;
  transition: all 0.3s ease;
}

.remark-textarea:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1) !important;
}

.expense-add-modal-footer {
  padding: 25rpx 30rpx;
  background: #f8f9fa;
  display: flex;
  gap: 15rpx;
  border-top: 1rpx solid #e9ecef;
  flex-shrink: 0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 30rpx;
  border: none;
  border-radius: 12rpx;
  font-size: 16rpx;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5rpx;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 2rpx solid #e9ecef;
}

.btn-cancel:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.4);
}

.btn-confirm:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .expense-add-modal {
    width: 95%;
    max-width: 450px;
  }
}

@media (max-width: 480px) {
  .expense-add-modal {
    width: 95%;
    max-width: 380px;
  }

  .expense-add-modal-header {
    padding: 20rpx 25rpx;
  }

  .expense-add-modal-body {
    padding: 25rpx;
  }

  .expense-add-modal-footer {
    padding: 20rpx 25rpx;
    flex-direction: row;
  }

  .btn-cancel,
  .btn-confirm {
    height: 40rpx;
    font-size: 14rpx;
  }
}

/* 货品名称单元格悬停效果 */
.commodity-name-cell {
  transition: background-color 0.2s ease;
}

/* H5 环境悬停效果 */
/* #ifdef H5 */
.commodity-name-cell:hover {
  background-color: #f0f9ff !important;
}
/* #endif */

/* 代卖费设置弹窗样式 */
.assist-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assist-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.assist-modal {
  position: relative;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.assist-modal-header {
  background: #f8f9fa;
  padding: 5px 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.assist-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .btn-cancel,
.header-actions .btn-confirm {
  padding: 0px 40px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.header-actions .btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.header-actions .btn-cancel:hover {
  background: #f5f5f5;
  border-color: #b3b3b3;
}

.header-actions .btn-confirm {
  background: #1890ff;
  color: white;
}

.header-actions .btn-confirm:hover:not(:disabled) {
  background: #40a9ff;
}

.header-actions .btn-confirm:disabled {
  background: #d9d9d9;
  color: #999;
  cursor: not-allowed;
}

.assist-modal-body {
  padding: 24px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.type-buttons {
  display: flex;
  gap: 12px;
}

.type-button {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.type-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.type-button.active {
  border-color: #1890ff;
  background: #1890ff;
  color: white;
}

.commodity-price-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.price-hint {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  text-align: center;
}

.commodity-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.commodity-price-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.commodity-price-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.commodity-name-large {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 16px;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 120px !important;
  font-size: 16px !important;
}

.price-unit {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  min-width: 20px;
}

/* 响应式适配 */
@media (max-width: 600px) {
  .assist-modal {
    width: 95%;
    max-width: none;
  }

  .assist-modal-header {
    padding: 16px 20px;
  }

  .assist-modal-body {
    padding: 20px;
  }

  .commodity-price-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .commodity-name-large {
    margin-right: 0;
    text-align: center;
  }

  .price-input-wrapper {
    justify-content: center;
  }
}
</style>
