<template>
  <div style="height: 100vh; overflow: hidden">
    <div style="display: flex; width: 100%; height: 100vh; overflow: hidden">
      <!-- 左侧：商品选择器组件 (50%) -->
      <div style="flex: 1; background-color: #f8f9fa; border-right: 1px solid #e9ecef">
        <GoodsSelectorGrid
          :commodity-list="commodityList"
          :category-list="[]"
          :selected-ids="selectedCommodityIds"
          :height="scrollHeight"
          :show-back-button="true"
          @back="back"
          @item-click="getCommodityCorrection"
          @spec-selected="handleSpecSelected"
          @multilevel-selected="handleMultilevelSelected"
        ></GoodsSelectorGrid>
      </div>

      <!-- 右侧：盘点列表 (50%) -->
      <div style="flex: 1; background-color: #f8f9fa; text-align: right; position: relative">
        <div
          style="
            height: 50rpx;
            padding: 0 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            border-bottom: 1px solid #e9ecef;
          "
        >
          <div style="font-size: 16rpx; font-weight: 600; color: #495057">盘点列表</div>
        </div>
        <div :style="{ height: windowHeight - 60 + 'px', position: 'relative' }">
          <!-- 表头 -->
          <div class="table-header">
            <div style="flex: 3; padding: 12rpx 16rpx; text-align: left">
              <text style="font-size: 14rpx; font-weight: 600">货品名称</text>
            </div>
            <div style="flex: 3; padding: 12rpx 16rpx; text-align: center">
              <text style="font-size: 14rpx; font-weight: 600">盘点数量</text>
            </div>
            <div style="width: 50rpx; padding: 12rpx 16rpx; text-align: center">
              <text style="font-size: 14rpx; font-weight: 600">操作</text>
            </div>
          </div>

          <scroll-view
            class="scrollArea"
            scroll-y="true"
            :style="{ height: scrollHeight2 }"
            :scroll-into-view="targetId"
          >
            <div
              class="list-item"
              v-for="(item, index) in correctionCommodityList"
              :id="'id-' + index + '-view'"
              :key="index"
              @click="openDrawer(index)"
            >
              <div style="flex: 3; padding: 12rpx 16rpx; text-align: left">
                <div style="font-size: 14rpx; font-weight: 500; color: #212529">
                  {{ item.correctCommodityName }}
                </div>
              </div>
              <div
                style="
                  flex: 3;
                  padding: 12rpx 16rpx;
                  text-align: center;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <text class="quantity-text">
                  {{ item.correctMount }}{{ item.unit || ''
                  }}{{ item.correctWeight ? '（' + item.correctWeight + '斤）' : '' }}
                </text>
              </div>
              <div
                @click.stop="deleteBatchCommdity(index)"
                style="
                  width: 50rpx;
                  padding: 12rpx 16rpx;
                  text-align: center;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <uni-icons custom-prefix="iconfont" type="icon-shanchu" size="20" color="#dc3545"></uni-icons>
              </div>
            </div>
            <div class="total-content">
              <div class="total-content-item" style="flex: 3">总计</div>
              <div class="total-content-item" style="flex: 2">总数：{{ totalInitInventory() }}</div>
              <div class="total-content-item" style="width: 50rpx"></div>
            </div>
          </scroll-view>
          <!--键盘-->
          <NumericKeyboard
            :show="showKeyBoard1"
            :value="getCurrentValue()"
            :container-position="true"
            @input="handleKeyboardInput"
            @delete="handleKeyboardDelete"
            @confirm="hideBorad"
          />
        </div>

        <div class="bottom-action-bar" v-if="!showKeyBoard1 && showComfirmBtn">
          <button class="confirm-button" @click="createCorrection">确认提交</button>
        </div>
      </div>
    </div>

    <!-- 盘点编辑抽屉 -->
    <CorrectionEditDrawer
      :visible="drawerVisible"
      :item="currentEditingItem"
      @close="closeDrawer"
      @confirm="handleDrawerConfirm"
    />

    <!-- 规格选择弹窗（拆包） -->
    <div v-if="specPopup.visible" class="spec-popup-mask" @click="closeSpecPopup">
      <div class="spec-popup-container" :style="specPopupStyle" @click.stop>
        <div class="spec-popup-content">
          <div
            v-for="(spec, index) in specPopup.specList"
            :key="index"
            class="spec-item"
            @click="handleSpecClick(spec)"
          >
            <!-- 商品名称 + 规格名称 -->
            <div class="spec-item-name">{{ specPopup.commodity.name }}-{{ spec.specName }}</div>

            <!-- 商品信息区域 -->
            <div class="spec-item-info">
              <!-- 标签行 -->
              <div class="spec-item-tags">
                <div class="tag tag-unpack">拆包</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import purchase from '../../../api/purchase/purchase'
import correctionApi from '../../../api/correction/correctionApi'
import GoodsSelectorGrid from '../../../components/GoodsSelectorGrid/GoodsSelectorGrid.vue'
import NumericKeyboard from '../../../components/NumericKeyboard/NumericKeyboard.vue'
import CorrectionEditDrawer from '../../../components/CorrectionEditDrawer/CorrectionEditDrawer.vue'

export default {
  components: {
    GoodsSelectorGrid,
    NumericKeyboard,
    CorrectionEditDrawer,
  },
  data() {
    return {
      scrollHeight: 0,
      windowHeight: 0,
      companyId: '',
      commodityList: [],
      valueType: 1,
      windowWidth: 0,
      scrollHeight2: '0px',
      currentClassId: '',
      editingIndex: -1,
      userInfo: null,
      showKeyBoard1: false,
      correctionCommodityList: [],
      targetId: 'id-0-view',
      showComfirmBtn: true,
      // 抽屉相关
      drawerVisible: false,
      currentEditingItem: null,
      // 规格弹窗数据（拆包）
      specPopup: {
        visible: false,
        left: 0,
        top: 0,
        commodity: null,
        specList: [],
      },
    }
  },
  computed: {
    // 已选商品ID列表
    selectedCommodityIds() {
      return this.correctionCommodityList.map(item => item.commodityId)
    },
    // 规格弹窗样式（拆包）
    specPopupStyle() {
      const { left, top, specList } = this.specPopup
      if (!specList || specList.length === 0) {
        return {}
      }
      const itemHeight = 90 // 每项高度
      const popupHeight = Math.min(specList.length * itemHeight + 10, 450) // 限制最大高度450px

      // 使用 uni-app 兼容的方式获取屏幕高度
      const screenHeight = this.windowHeight || uni.getWindowInfo().windowHeight

      // 计算最佳位置（避免超出屏幕）
      let adjustedTop = top - 100 < 0 ? 0 : top - 100
      adjustedTop = adjustedTop + popupHeight > screenHeight ? screenHeight - popupHeight - 20 : adjustedTop

      return {
        left: left + 'px',
        top: adjustedTop + 'px',
      }
    },
  },
  onLoad(options) {
    this.currentClassId = options.classId
  },
  mounted() {
    // 在组件挂载后设置 scrollHeight
    this.scrollHeight = uni.getWindowInfo().windowHeight - 155
    this.windowHeight = uni.getWindowInfo().windowHeight
    this.companyId = uni.getStorageSync('companyId')
    this.userInfo = uni.getStorageSync('userInfo')
    //根据classId获取物体
    this.getCommodityByClassId()
    this.initSystem()
  },
  methods: {
    totalInitInventory() {
      return this.correctionCommodityList.reduce((total, item) => {
        return total + (parseFloat(item.correctMount) || 0)
      }, 0)
    },
    totalInitWeight() {
      return this.correctionCommodityList.reduce((total, item) => {
        return total + (parseFloat(item.totalWeight) || 0)
      }, 0)
    },
    getCommdityActive(id) {
      return this.correctionCommodityList.some(x => x.commodityId === id)
    },
    // 获取当前编辑的值
    getCurrentValue() {
      if (this.editingIndex === -1) return ''
      const item = this.correctionCommodityList[this.editingIndex]
      return item ? item.correctMount || '' : ''
    },
    // 处理键盘输入
    handleKeyboardInput(val) {
      if (this.editingIndex === -1) return

      let myvalue = this.getCurrentValue()

      // 如果是+/-，先计算表达式
      if (val === '+' || val === '-') {
        try {
          myvalue = eval(myvalue.toString())
        } catch (e) {
          myvalue = parseFloat(myvalue) || 0
        }
      }

      // 拼接新值
      var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue
      myvalue = txt + val.toString()

      // 更新值
      const item = this.correctionCommodityList[this.editingIndex]
      if (item) {
        item.correctMount = myvalue
      }
    },
    // 处理键盘删除
    handleKeyboardDelete() {
      if (this.editingIndex === -1) return

      let myvalue = this.getCurrentValue()

      if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
        return
      }

      myvalue = myvalue ? myvalue.toString() : ''
      if (myvalue.length == 1) {
        myvalue = '0'
      } else {
        myvalue = myvalue.slice(0, -1)
      }

      // 更新值
      const item = this.correctionCommodityList[this.editingIndex]
      if (item) {
        item.correctMount = myvalue
      }
    },
    initSystem() {
      let that = this
      uni.getSystemInfo({
        success: function (res) {
          that.windowWidth = res.windowWidth // 输出屏幕宽度
          that.windowHeight = res.windowHeight
          that.scrollHeight2 = res.windowHeight - 150 + 'px'
        },
      })
    },
    showKeyBorad(index) {
      this.editingIndex = index
      this.showKeyBoard1 = true
      // 键盘高度调整为200rpx
      this.scrollHeight2 = this.windowHeight - 210 - 200 + 'px'

      // 设置滚动目标，使选中的行滚动到可视区域
      this.$nextTick(() => {
        this.targetId = `id-${index}-view`
      })
    },
    hideBorad() {
      this.scrollHeight2 = this.windowHeight - 150 + 'px'
      this.showKeyBoard1 = false
      // 清除激活状态
      this.editingIndex = -1
    },
    createCorrection() {
      let that = this
      that.showComfirmBtn = false

      // 转换数据格式为后端期望的 CorrectionOutputDTO 格式
      const correctionModelList = this.correctionCommodityList.map(item => {
        // 构建 CorrectionList（规格数量列表）
        // 后端会使用 InventoryCovertUtil.CovertToOriginMount 将其转换为最小单位
        let correctionList = []

        // 如果商品有规格信息，构建规格列表
        if (item.specId && item.specName) {
          // 拆包商品，使用规格信息
          correctionList.push({
            id: item.specId,
            specName: item.specName,
            mount: item.correctMount || 0,
            unit: item.unit,
          })
        } else {
          // 普通商品，使用基础单位
          correctionList.push({
            id: item.specId,
            specName: item.unit || '个',
            mount: item.correctMount || 0,
            unit: item.unit || '个',
          })
        }

        return {
          commodityId: item.correctCommodityId || item.id,
          correctCommodityName: item.correctCommodityName,
          correctMount: item.correctMount || 0,
          correctionWeight: item.correctWeight || 0,
          operatorId: that.userInfo.id,
          // 传递规格数量列表给后端
          CorrectionList: correctionList,
          // 如果有 purchaseEmployId，传递给后端（用于记录）
          purchaseEmployId: item.purchaseEmployId || '',
        }
      })

      // 盘点单对象
      let correctionOrder = {
        companyId: that.companyId,
        operatorId: that.userInfo.id,
        correctionModelList: correctionModelList,
      }

      console.log('提交盘点数据:', correctionOrder)

      if (correctionModelList.length > 0) {
        correctionApi
          .createCorrectionOrder(JSON.stringify(correctionOrder))
          .then(res => {
            if (res.code == 200) {
              uni.showToast({
                title: '盘点成功',
                icon: 'success',
                duration: 2000,
              })
              that.back()
            } else {
              uni.showToast({
                title: res.msg || '盘点失败',
                icon: 'none',
                duration: 2000,
              })
              that.showComfirmBtn = true
            }
          })
          .catch(err => {
            console.error('盘点提交失败:', err)
            uni.showToast({
              title: '盘点提交失败',
              icon: 'none',
              duration: 2000,
            })
            that.showComfirmBtn = true
          })
      } else {
        uni.showToast({
          title: '请先添加盘点商品',
          icon: 'none',
          duration: 2000,
        })
        that.showComfirmBtn = true
      }
    },
    back() {
      uni.navigateBack({
        delta: 1,
      })
    },
    deleteBatchCommdity(index) {
      uni.showModal({
        title: '确认删除',
        content: '您确定要删除该项吗？',
        success: res => {
          if (res.confirm) {
            // 用户点击了确认
            this.correctionCommodityList.splice(index, 1)
          } else if (res.cancel) {
            // 用户点击了取消
          }
        },
      })
    },
    getCommodityByClassId() {
      purchase.GetEmployCommidityByClassId(this.currentClassId).then(res => {
        console.log('Res', res)
        this.commodityList = []
        for (let i = 0; i < res.data.length; i++) {
          this.commodityList.push({
            id: res.data[i].id,
            key: i,
            commodityName: res.data[i].commodityName, // 使用 commodityName 适配 GoodsSelector
            name: res.data[i].commodityName,
            price: res.data[i].price,
            commoditySpecs: res.data[i].commoditySpecs,
            inventory: res.data[i].initMount - res.data[i].saleMount,
            type: 0,
            unit: res.data[i].unit,
            initWeight: res.data[i].initWeight,
            extralModel: res.data[i].extralModel,
            saleWay: res.data[i].saleWay,
            outPutPurchaseInventories: res.data[i].outPutPurchaseInventories,
            isMultiLevel: 0, // 不支持多等级
          })
        }
      })
    },
    //获取物体可矫正德数值
    getCommodityCorrection(e) {
      let that = this
      if (this.getCommdityActive(e.id)) return

      if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
        // 直接使用商品对象打开抽屉编辑
        // 先添加到列表
        // 获取商品的基础规格ID（通常是第一个规格或最小单位规格）
        let baseSpecId = null
        if (e.commoditySpecs && e.commoditySpecs.length > 0) {
          // 找到转换率为1的规格（基础单位）
          const baseSpec = e.commoditySpecs.find(spec => spec.convertMount === 1)
          baseSpecId = baseSpec ? baseSpec.id : e.commoditySpecs[0].id
        }

        const correctionItem = {
          id: e.id,
          correctCommodityId: e.id,
          correctCommodityName: e.commodityName || e.name,
          correctMount: 0,
          correctWeight: 0,
          saleWay: e.saleWay,
          unit: e.unit,
          initWeight: e.initWeight,
          price: e.price,
          specId: baseSpecId, // 添加基础规格ID
        }
        that.correctionCommodityList.push(correctionItem)
        // 立即打开抽屉编辑
        that.currentEditingItem = JSON.parse(JSON.stringify(correctionItem))
        that.currentEditingItem._index = that.correctionCommodityList.length - 1
        that.drawerVisible = true
      }

      // 处理定装拆包
      if (e.saleWay === 3) {
        uni
          .createSelectorQuery()
          .selectAll(`#grid-item-${e.id}`)
          .boundingClientRect(data => {
            console.log('拆包商品位置信息', data)
            if (data && data.length > 0) {
              this.createSpecPopup(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
            }
          })
          .exec()
      }
    },

    // 创建规格弹窗（拆包）
    createSpecPopup(left, top, commodity, specList) {
      if (!specList || specList.length < 1) return

      this.specPopup = {
        visible: true,
        left,
        top,
        commodity,
        specList,
      }
    },

    // 关闭规格弹窗
    closeSpecPopup() {
      this.specPopup.visible = false
      // 延迟清空数据，等动画完成
      setTimeout(() => {
        this.specPopup = {
          visible: false,
          left: 0,
          top: 0,
          commodity: null,
          specList: [],
        }
      }, 300)
    },

    // 点击规格项
    handleSpecClick(spec) {
      const commodity = this.specPopup.commodity
      this.closeSpecPopup()

      // 创建拆包商品的盘点项
      const correctionItem = {
        id: commodity.id,
        correctCommodityId: commodity.id,
        correctCommodityName: `${commodity.commodityName || commodity.name}-${spec.specName}`,
        correctMount: 0,
        correctWeight: 0,
        saleWay: commodity.saleWay,
        unit: spec.unit || commodity.unit,
        initWeight: commodity.initWeight,
        price: spec.price || commodity.price,
        specId: spec.id,
        specName: spec.specName,
      }

      // 添加到列表
      this.correctionCommodityList.push(correctionItem)

      // 立即打开抽屉编辑
      this.currentEditingItem = JSON.parse(JSON.stringify(correctionItem))
      this.currentEditingItem._index = this.correctionCommodityList.length - 1
      this.drawerVisible = true
    },

    // 处理规格选择（拆包商品）- 从 GoodsSelectorGrid 组件触发
    handleSpecSelected({ commodity, spec }) {
      console.log('选择了拆包规格:', commodity, spec)

      // 创建拆包商品的盘点项
      const correctionItem = {
        id: commodity.id,
        correctCommodityId: commodity.id,
        correctCommodityName: `${commodity.commodityName || commodity.name}-${spec.specName}`,
        correctMount: 0,
        correctWeight: 0,
        saleWay: commodity.saleWay,
        unit: spec.unit || commodity.unit,
        initWeight: commodity.initWeight,
        price: spec.price || commodity.price,
        specId: spec.id,
        specName: spec.specName,
      }

      // 添加到列表
      this.correctionCommodityList.push(correctionItem)

      // 立即打开抽屉编辑
      this.currentEditingItem = JSON.parse(JSON.stringify(correctionItem))
      this.currentEditingItem._index = this.correctionCommodityList.length - 1
      this.drawerVisible = true
    },

    // 处理多等级商品选择
    handleMultilevelSelected(childCommodity) {
      console.log('选择了多等级子商品:', childCommodity)
      // 处理多等级子商品的盘点
      this.getCommodityCorrection(childCommodity)
    },

    // 打开抽屉
    openDrawer(index) {
      this.currentEditingItem = JSON.parse(JSON.stringify(this.correctionCommodityList[index]))
      this.currentEditingItem._index = index // 保存索引用于更新
      this.drawerVisible = true
    },

    // 关闭抽屉
    closeDrawer() {
      this.drawerVisible = false
      this.currentEditingItem = null
    },

    // 处理抽屉确认
    handleDrawerConfirm(item) {
      if (item._index !== undefined) {
        // 更新列表中的数据
        this.correctionCommodityList[item._index].correctMount = item.correctMount
        // 如果有重量数据，也更新重量
        if (item.correctWeight !== undefined) {
          this.correctionCommodityList[item._index].correctWeight = item.correctWeight
        }
      }
      this.closeDrawer()
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-view2 {
  white-space: nowrap;
}

.coach_wrap {
  padding: 5rpx;
  background-color: white;
  font-weight: bold;
  border: solid 1px dodgerblue;
  margin-right: 15rpx;
  display: inline-block;
  border-radius: 10rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coach_wrap_active {
  color: white !important;
  background-color: dodgerblue !important;
  border-color: dodgerblue !important;
}

.quantity-text {
  font-size: 14rpx;
  color: #495057;
  font-weight: 500;
  padding: 6rpx 12rpx;
  background: #e9ecef;
  border-radius: 6rpx;
  transition: all 0.2s;
}

.list-item {
  display: flex;
  min-height: 50rpx;
  background: #ffffff;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
}

.input1 {
  height: 28rpx;
  font-size: 18rpx;
  text-align: center;
  font-weight: bold;
  color: #5a5a5a;
  width: 70%;
  flex: 1;
  line-height: 28rpx;
}

.input-active {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
  border: 2px solid #2196f3 !important;
  color: #1565c0 !important;
  box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3) !important;
}

.input1:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 3rpx rgba(33, 150, 243, 0.2);
  background: #ffffff;
}

.total-content {
  display: flex;
  background: #e3f2fd;
  font-weight: 600;
  align-items: center;
}

.total-content-item {
  padding: 0rpx 16rpx;
  text-align: left;
  font-weight: 600;
  line-height: 28rpx;
  color: #1976d2;
  font-size: 14rpx;
}

/* 表头美化样式 */
.table-header {
  display: flex;
  background: #2196f3;
  font-weight: 600;
  border-bottom: none;
  color: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.2);
  border-radius: 0;
}

/* 规格选择弹窗样式（拆包） */
.spec-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9998;
  animation: fadeIn 0.2s ease-out;
}

.spec-popup-container {
  position: fixed;
  min-width: 250px;
  max-width: 500px;
  background-color: #ffffff;
  border: 2px solid #2196f3;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(33, 150, 243, 0.3);
  z-index: 9999;
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

.spec-popup-content {
  padding: 5px;
  overflow-y: auto;
  max-height: 450px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.spec-item {
  min-height: 70px;
  padding: 16rpx;
  border: 2px solid #dee2e6;
  border-radius: 12rpx;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item:hover {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.08);
  transform: translateY(-4rpx);
  box-shadow: 0 6rpx 20rpx rgba(33, 150, 243, 0.25);
}

.spec-item:active {
  transform: translateY(-2rpx);
  box-shadow: 0 3rpx 10rpx rgba(33, 150, 243, 0.3);
}

.spec-item-name {
  font-size: 15rpx;
  font-weight: 600;
  color: #212529;
  line-height: 1.5;
  word-break: break-all;
}

.spec-item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spec-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  font-size: 12rpx;
  font-weight: 600;
  white-space: nowrap;
}

.tag-unpack {
  color: #fd7e14;
  border: 1px solid #fd7e14;
  background: rgba(253, 126, 20, 0.1);
}

/* 底部操作栏 */
.bottom-action-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40rpx;
  background: #ffffff;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
}

.confirm-button {
  width: 120rpx;
  height: 35rpx;
  font-weight: 600;
  font-size: 14rpx;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8rpx;
  line-height: 35rpx;
  cursor: pointer;
}

.confirm-button:active {
  background: #1565c0;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 缩放动画 */
@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
