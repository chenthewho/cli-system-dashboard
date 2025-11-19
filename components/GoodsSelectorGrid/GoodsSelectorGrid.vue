<template>
  <div style="width: 100%; background-color: #ffffff; display: flex; flex-direction: column">
    <!-- 顶部工具栏 -->
    <div style="padding: 10rpx; display: flex; align-items: center; gap: 10rpx; border-bottom: 1px solid #eee">
      <!-- 返回按钮 -->
      <button
        v-if="showBackButton"
        style="
          height: 32rpx;
          line-height: 32rpx;
          color: #ffffff;
          font-weight: bold;
          background: #ff5500;
          padding: 0 15rpx;
        "
        @click="handleBack"
      >
        <uni-icons
          custom-prefix="iconfont"
          type="icon-fanhui"
          size="15"
          color="#ffffff"
          style="margin-right: 5px"
        ></uni-icons
        >返回
      </button>

      <!-- 搜索框 -->
      <div class="search-box">
        <uni-icons type="search" size="14" color="#999" class="search-icon"></uni-icons>
        <input type="text" v-model="searchKeyword" placeholder="搜索货品" class="search-input" @input="handleSearch" />
        <uni-icons
          v-if="searchKeyword"
          type="clear"
          size="14"
          color="#999"
          class="clear-icon"
          @click="clearSearch"
        ></uni-icons>
      </div>

      <!-- 分类选择 -->
      <div style="flex: 1">
        <SimpleSelect
          :value="activeType"
          :name="activeType"
          :options="tabList"
          placeholder="选择分类"
          slabel="name"
          svalue="name"
          height="32rpx"
          width="150rpx"
          padding="0 30rpx 0 12rpx"
          @selectitem="handleCategorySelect"
        ></SimpleSelect>
      </div>
    </div>

    <!-- 商品网格列表 -->
    <scroll-view class="scrollArea" scroll-y="true" :style="{ height: height + 'px', backgroundColor: '#f5f5f5' }">
      <div class="goods-grid">
        <div
          v-for="item in filteredCommodityList"
          :key="item.id"
          :id="'grid-item-' + item.id"
          :class="['grid-item', isActive(item.id) ? 'active-item' : '']"
          @click="handleItemClick(item)"
        >
          <div class="item-content">
            <text class="item-name">{{ item.commodityName }}</text>
            <div class="item-tags">
              <div v-if="item.isMultiLevel == 0">
                <text v-if="item.saleWay === 1" class="tag tag-unfixed">非定</text>
                <text v-if="item.saleWay === 2" class="tag tag-fixed"
                  >定{{ item.initWeight ? item.initWeight : '' }}</text
                >
                <text v-if="item.saleWay === 3" class="tag tag-unpack">拆</text>
                <text v-if="item.saleWay === 4" class="tag tag-bulk">散</text>
                <text v-if="item.extralModel && item.extralModel.name" class="tag tag-extra">{{
                  item.extralModel.name
                }}</text>
              </div>
              <div v-if="item.isMultiLevel == 1">
                <text class="tag tag-multilevel">多等级</text>
              </div>
            </div>
            <div class="item-stock" v-if="item.outPutPurchaseInventories && item.outPutPurchaseInventories.length > 0">
              <text class="stock-label">余:</text>
              <span v-for="item2 in item.outPutPurchaseInventories" :key="item2.id" class="stock-item">
                {{ item2.mount }}{{ item2.specName }}
              </span>
            </div>
            <div
              class="item-stock"
              v-else-if="!item.outPutPurchaseInventories || item.outPutPurchaseInventories.length === 0"
              style="color: #aa0000"
            >
              <text class="stock-label">无库存</text>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>

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
            <div class="spec-item-name">
              {{ specPopup.commodity.commodityName || specPopup.commodity.name }}-{{ spec.specName }}
            </div>
            <div class="spec-item-info">
              <div class="spec-item-tags">
                <span class="tag tag-unpack">拆包</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多规格商品选择弹窗 -->
    <div v-if="multiLevelPopup.visible" class="multilevel-popup-mask" @click="closeMultiLevelPopup">
      <div class="multilevel-popup-container" :style="multiLevelPopupStyle" @click.stop>
        <div class="multilevel-popup-content">
          <div
            v-for="(child, index) in multiLevelPopup.childrenList"
            :key="child.id || index"
            :id="'multilevel-grid-item-' + child.id"
            class="multilevel-grid-item"
            @click="handleMultiLevelClick(child, multiLevelPopup)"
          >
            <div class="multilevel-item-name">
              {{ child.commodityName || child.name }}
            </div>
            <div class="multilevel-item-info">
              <div class="multilevel-item-tags">
                <span v-if="child.saleWay == 1" class="tag tag-unfixed">非定</span>
                <span v-if="child.saleWay == 2" class="tag tag-fixed"
                  >定{{ child.initWeight ? child.initWeight : '' }}</span
                >
                <span v-if="child.saleWay == 3" class="tag tag-unpack">拆包</span>
                <span v-if="child.saleWay == 4" class="tag tag-bulk">散</span>
              </div>
              <div
                class="multilevel-item-stock"
                :style="
                  !child.outPutPurchaseInventories || child.outPutPurchaseInventories.length === 0
                    ? { color: '#aa0000' }
                    : {}
                "
              >
                余:
                <span v-for="item2 in child.outPutPurchaseInventories" :key="item2.id" class="stock-item">
                  {{ item2.mount }}{{ item2.specName }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleSelect from '../SimpleSelect/SimpleSelect.vue'

export default {
  components: {
    SimpleSelect,
  },
  props: {
    commodityList: {
      type: Array,
      default: () => [],
    },
    categoryList: {
      type: Array,
      default: () => [],
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 500,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchKeyword: '',
      activeType: '全部',
      specPopup: {
        visible: false,
        left: 0,
        top: 0,
        commodity: null,
        specList: [],
      },
      multiLevelPopup: {
        visible: false,
        left: 0,
        top: 0,
        commodity: null,
        childrenList: [],
      },
    }
  },
  computed: {
    tabList() {
      const allTab = { name: '全部' }
      return [allTab, ...this.categoryList]
    },
    filteredCommodityList() {
      let list = this.commodityList

      // 分类筛选
      if (this.activeType !== '全部') {
        list = list.filter(item => item.className === this.activeType)
      }

      // 搜索筛选
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        list = list.filter(item => item.commodityName.toLowerCase().includes(keyword))
      }

      return list
    },
    specPopupStyle() {
      return {
        left: this.specPopup.left + 'px',
        top: this.specPopup.top + 'px',
        transform: 'translate(-50%, 0)',
      }
    },
    multiLevelPopupStyle() {
      return {
        left: this.multiLevelPopup.left + 'px',
        top: this.multiLevelPopup.top + 'px',
        transform: 'translate(-50%, 0)',
      }
    },
  },
  methods: {
    isActive(id) {
      return this.selectedIds.includes(id)
    },
    handleBack() {
      this.$emit('back')
    },
    handleSearch() {
      // 搜索由计算属性自动处理
    },
    clearSearch() {
      this.searchKeyword = ''
    },
    handleCategorySelect(item) {
      this.activeType = item.name
    },
    handleItemClick(item) {
      // 如果是多规格商品，显示多规格弹窗
      if (item.isMultiLevel == 1) {
        uni
          .createSelectorQuery()
          .in(this)
          .selectAll(`#grid-item-${item.id}`)
          .boundingClientRect(data => {
            if (data && data.length > 0) {
              console.log('多规格商品弹窗位置:', data)
              this.createMultiLevelView(
                data[0].left + data[0].width / 2,
                data[0].top,
                item,
                item.childrenList || item.childrenCommodity || []
              )
            } else {
              console.error('未找到多等级商品的DOM元素')
            }
          })
          .exec()
        return
      }

      // 如果是拆包商品，显示规格选择弹窗
      if (item.saleWay === 3) {
        uni
          .createSelectorQuery()
          .in(this)
          .selectAll(`#grid-item-${item.id}`)
          .boundingClientRect(data => {
            if (data && data.length > 0) {
              console.log('拆包商品弹窗位置:', data)
              this.createNativeView(
                data[0].left + data[0].width / 2,
                data[0].top,
                item,
                item.commoditySpecs || item.specList || []
              )
            }
          })
          .exec()
        return
      }

      // 其他商品直接触发点击事件
      this.$emit('item-click', item)
    },
    handleSpecClick(spec) {
      const commodity = this.specPopup.commodity
      this.closeSpecPopup()
      // 触发选择规格事件，传递商品和规格信息
      this.$emit('spec-selected', { commodity, spec })
    },
    handleMultiLevelClick(childCommodity, parentCommodity) {
      this.closeMultiLevelPopup()
      // 触发选择子商品事件
      const res = { ...childCommodity, parentName: parentCommodity.parentCommodity.commodityName }
      this.$emit('multilevel-selected', res)
    },
    // 创建规格选择弹窗（拆包）
    createNativeView(left, top, commodity, specList) {
      if (!specList || specList.length < 1) return

      this.specPopup = {
        visible: true,
        left,
        top,
        commodity,
        specList,
      }
    },
    // 创建多规格商品弹窗
    createMultiLevelView(left, top, parentCommodity, childrenList) {
      if (!childrenList || childrenList.length < 1) return

      this.multiLevelPopup = {
        visible: true,
        left,
        top,
        parentCommodity,
        childrenList,
      }
    },
    closeSpecPopup() {
      this.specPopup.visible = false
    },
    closeMultiLevelPopup() {
      this.multiLevelPopup.visible = false
    },
  },
}
</script>

<style scoped>
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  padding: 0 10rpx;
  height: 32rpx;
  flex: 1;
  max-width: 300rpx;
}

.search-icon {
  margin-right: 5rpx;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14rpx;
  height: 100%;
  outline: none;
}

.clear-icon {
  margin-left: 5rpx;
  cursor: pointer;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  padding: 8rpx;
  background-color: #f5f5f5;
}

.grid-item {
  flex: 1 1 calc(33.333% - 8rpx);
  min-width: 0;
  height: 80rpx;
  background-color: #ffffff !important;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  padding: 10rpx;
  box-sizing: border-box;
  text-align: left;
  font-size: 14rpx;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.grid-item:hover {
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  transform: translateY(-1rpx);
}

.active-item {
  border: 3px solid #007aff;
}

.item-content {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-name {
  font-size: 14rpx;
  font-weight: 600;
  color: #212529;
  display: block;
  margin-bottom: 6rpx;
  word-break: break-all;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4rpx;
  justify-content: flex-start;
  margin-bottom: 4rpx;
}

.item-stock {
  margin-top: auto;
  font-size: 11rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.stock-label {
  color: #6c757d;
  font-weight: 500;
}

.stock-value {
  color: #2196f3;
  font-weight: 600;
  margin-left: 2rpx;
}

.stock-item {
  color: #2196f3;
  font-weight: 600;
  margin-left: 4rpx;
}

.tag {
  font-size: 10rpx;
  padding: 2rpx 6rpx;
  border-radius: 3rpx;
  border: 1px solid;
  display: inline-block;
  white-space: nowrap;
}

.tag-unfixed {
  color: #31bdec;
  border-color: #31bdec;
}

.tag-fixed {
  color: #00aa00;
  border-color: #00aa00;
}

.tag-unpack {
  color: #aa55ff;
  border-color: #aa55ff;
}

.tag-bulk {
  color: #55aaff;
  border-color: #55aaff;
}

.tag-extra {
  color: #ff5500;
  border-color: #ff5500;
}

.tag-multilevel {
  color: red;
  border-color: red;
}

/* 规格弹窗样式 */
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
  border: 3px solid #00aaff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: scaleIn 0.2s ease-out;
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
  padding: 12px;
  border: 3px solid #7e7e7e;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item:hover {
  border-color: #00aaff;
  background: linear-gradient(135deg, rgba(0, 170, 255, 0.05) 0%, rgba(0, 136, 204, 0.05) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
}

.spec-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 170, 255, 0.3);
}

.spec-item-name {
  font-size: 18rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
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

/* 多规格弹窗样式 */
.multilevel-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9998;
  animation: fadeIn 0.2s ease-out;
}

.multilevel-popup-container {
  position: fixed;
  min-width: 250px;
  max-width: 500px;
  background-color: #ffffff;
  border: 3px solid #00aaff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: scaleIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
}

.multilevel-popup-content {
  padding: 5px;
  overflow-y: auto;
  max-height: 450px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.multilevel-grid-item {
  min-height: 70px;
  padding: 12px;
  border: 3px solid #7e7e7e;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.multilevel-grid-item:hover {
  border-color: #00aaff;
  background: #f0f9ff;
  box-shadow: 0 4px 12px rgba(0, 170, 255, 0.2);
  transform: translateX(5px);
}

.multilevel-grid-item:active {
  transform: translateX(5px) scale(0.98);
  background: #e6f7ff;
}

.multilevel-item-name {
  font-size: 18rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.multilevel-item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.multilevel-item-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.multilevel-item-stock {
  font-size: 14px;
  color: #666;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.stock-item {
  color: #333;
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

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}
</style>
