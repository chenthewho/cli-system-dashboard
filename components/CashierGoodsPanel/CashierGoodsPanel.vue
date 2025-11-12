<template>
  <div class="panel-box">
    <VerticalTab
      ref="verticalTabRef"
      @update:activeTab="handleActiveTabUpdate"
      :categoryList="activeCategoryList"
      :activeTabId="currentTabId"
    />
    <view class="goods-box">
      <!-- 搜索框 -->
      <view class="search-box">
        <uni-icons type="search" size="20" color="#999" class="icon-search"></uni-icons>
        <input
          class="search-input"
          type="text"
          v-model="searchKeyword"
          placeholder="商品搜索..."
          @input="onSearch"
          @confirm="onSearchConfirm"
        />
        <view class="clear-btn" @click="clearSearch">
          <uni-icons type="clear" size="20" color="#ccc" v-if="searchKeyword"></uni-icons>
        </view>
      </view>
      <!-- 商品列表 -->
       <div style="display: flex;">
        <scroll-view scroll-y="true">
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">正在加载商品...</div>
          </div>
        </div>
        <view v-else class="good-content">
          <div class="good-list">
            <div
              v-for="item in rows"
              :key="item.key"
              :id="'grid-item-'+item.id"
              :class="['good-item', isItemActive(item) ? 'good-item-act' : null]"
              @click="handleItemClick(item, item.id)"
              :style="
                !item.outPutPurchaseInventories || item.outPutPurchaseInventories.length === 0
                  ? { color: '#aa0000' }
                  : {}
              "
            >
              <div
                style="
                  text-align: left;
                  font-weight: bold;
                  font-size: 24px;
                  line-height: 1.2;
                  margin-bottom: 2rpx;
                  height: 30px;
                "
              >
                {{ item.name }}
              </div>
              <div>
                <div class="commodity-tags">
                  <span v-if="commodityType === 1" class="tag tag-consignment">代卖</span>
                  <span v-if="commodityType === 2" class="tag tag-self">自营</span>
                  <span v-if="item.isMultiLevel == 0">
                    <span v-if="item.saleWay == 1" class="tag tag-unfixed">非定</span>
                    <span v-if="item.saleWay == 2" class="tag tag-fixed"
                      >定{{ item.initWeight ? item.initWeight : '' }}</span
                    >
                    <span v-if="item.saleWay == 3" class="tag tag-unpack">拆包</span>
                    <span v-if="item.saleWay == 4" class="tag tag-bulk">散</span>
                  </span>
                  <span v-if="item.isMultiLevel == 1" class="tag tag-multi">多规格</span>
                  <span v-if="item.extralModel && item.extralModel.name" class="tag tag-extra">{{ item.extralModel.name }}</span>
                </div>
                <div class="inventory-info" v-if="item.isMultiLevel == 0">
                  <span class="inventory-label">余:</span>
                  <span v-for="(item2, idx) in item.outPutPurchaseInventories" :key="idx" class="inventory-item"
                    >{{ item2.mount }}{{ item2.specName }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </view>
      </scroll-view>
      <!--模糊查询字体列(词云列)-->
      <scroll-view scroll-y="true" v-if="rows.length > 0" class="quick-search-tab">
            <view
              class="key-word"
              :class="{ 'key-word-active': currentKeyWord === item }"
              v-for="(item, index) in keyWordList"
              :key="index"
              @click="handleKeyWordClick(item)"
            >
              <span v-for="char in item" :key="char">{{ char }}</span>
            </view>
          </scroll-view>
       </div>
    </view>
  </div>
</template>

<script>
import VerticalTab from '../VerticalTab.vue'
import category from '../../api/goods/category'
import Purchase from '../../api/purchase/purchase.js'

export default {
  name: 'CashierGoodsPanel',
  components: {
    VerticalTab,
  },
  props: {
    // 分类列表（从父组件传入，可选）
    categoryList: {
      type: Array,
      default: () => [],
    },
    // 已选商品ID列表（用于高亮显示）
    selectedGoodsIds: {
      type: Array,
      default: () => [],
    },
    // 滚动区域高度
    height: {
      type: Number,
      default: 0,
    },
    // 版本类型 1-自营单商户 2-代销单商户 3-自营多商户 4-代销多商户
    vesionType: {
      type: Number,
      default: 2,
    },
    // 公司ID
    companyId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchKeyword: '', // 搜索关键词
      currentKeyWord: '', // 当前选中的词云关键字
      rows: [], // 商品列表（分行显示，每行3个）
      keyWordList: [], // 词云关键字列表
      scrollHeight: 0, // 滚动区域高度
      isLoading: false,
      commidityList: [], // 当前商品列表
      tabCommodityCache: {}, // 懒加载缓存：存储每个tab的商品数据
      commodityType: 1, // 商品类型 1-代卖 2-自营
      currentTabId: '', // 当前选中的标签ID
      currentTabName: '', // 当前标签名称（用于代销批次）
      commodityKeyCounter: 0, // 用于生成商品列表的唯一 key
      internalCategoryList: [], // 内部维护的分类列表
      internalCompanyId: '', // 从 storage 读取的公司ID
      internalVesionType: 1, // 从 storage 读取的版本类型
    }
  },
  computed: {
    // 窗口高度
    windowHeight() {
      return this.height > 0 ? this.height : uni.getWindowInfo().windowHeight
    },
    // 实际使用的分类列表（优先使用内部维护的，如果为空则使用props传入的）
    activeCategoryList() {
      if (this.internalCategoryList && this.internalCategoryList.length > 0) {
        return this.internalCategoryList
      }
      return this.categoryList || []
    },
    // 实际使用的公司ID（优先使用props，如果没有则使用从storage读取的）
    activeCompanyId() {
      return this.companyId || this.internalCompanyId
    },
    // 实际使用的版本类型（优先使用props，如果没有则使用从storage读取的）
    activeVesionType() {
      return this.internalVesionType
    },
  },
  watch: {
    // 监听商品列表变化
    commidityList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.updateGoodsList(newVal)
        }
      },
      deep: true,
    },
    // 监听高度变化
    height: {
      handler(newVal) {
        this.scrollHeight = newVal > 0 ? newVal - 120 : uni.getWindowInfo().windowHeight - 120
      },
      immediate: true,
    },
  },
  mounted() {
    // 初始化滚动高度
    this.scrollHeight = this.height > 0 ? this.height - 120 : uni.getWindowInfo().windowHeight - 120

    // 从 storage 读取 companyId 和 vesionType
    this.internalCompanyId = uni.getStorageSync('companyId') || ''
    this.internalVesionType = uni.getStorageSync('vesionType') || 1

    console.log('从 storage 读取:', {
      companyId: this.internalCompanyId,
      vesionType: this.internalVesionType,
    })
  },
  methods: {
    // 更新商品列表
    updateGoodsList(list) {
      // 按库存排序
      const sortedList = [...list].sort((a, b) => b.inventory - a.inventory)

      // 转换为行列格式（每行3个）
      this.rows = sortedList

      // 生成词云
      this.generateKeyWords(sortedList)
    },

    // 生成词云关键字
    generateKeyWords(goodsList) {
      this.keyWordList = []
      this.keyWordList.push('全')
      this.currentKeyWord = '全'

      // 统计商品首字（中文）频率
      const firstCharFrequency = {}
      
      for (let i = 0; i < goodsList.length; i++) {
        const name = goodsList[i].name
        if (!name || name.length === 0) continue
        
        // 找到第一个中文字符
        for (let j = 0; j < name.length; j++) {
          const char = name[j]
          if (char.match(/[\u4e00-\u9fa5]/)) {
            // 统计首字频率
            if (firstCharFrequency[char]) {
              firstCharFrequency[char]++
            } else {
              firstCharFrequency[char] = 1
            }
            // 只取首字，找到后跳出循环
            break
          }
        }
      }

      // 按频率排序，取前10个
      const charArray = Object.keys(firstCharFrequency)
        .map(char => ({
          char: char,
          count: firstCharFrequency[char],
        }))
        .sort((a, b) => b.count - a.count)

      // 将排序后的首字添加到 keyWordList
      for (let i = 0; i < Math.min(charArray.length, 10); i++) {
        this.keyWordList.push(charArray[i].char)
      }
    },

    // 判断商品是否被选中
    isItemActive(item) {
      return this.selectedGoodsIds.some(id => id === item.id)
    },

    // 处理标签切换
    handleActiveTabUpdate(res) {
      this.updateActiveTab(res)
      // 通知父组件标签已切换（如果父组件需要知道）
      this.$emit('tab-changed', {
        type: res.type,
        id: res.id,
        tabName: this.currentTabName,
      })
    },

    // 处理商品点击
    handleItemClick(item, id) {
      this.$emit('item-click', item, id)
    },

    // 处理搜索
    onSearch() {
      this.filterGoods()
    },

    onSearchConfirm() {
      this.filterGoods()
    },

    // 清空搜索
    clearSearch() {
      this.searchKeyword = ''
      this.filterGoods()
    },

    // 过滤商品
    filterGoods() {
      // 清除词云选中状态
      if (this.searchKeyword.trim() !== '') {
        this.currentKeyWord = ''
      }

      let filteredList = []

      if (this.searchKeyword.trim() === '') {
        // 如果搜索关键词为空，显示所有商品
        filteredList = [...this.commidityList]
      } else {
        // 根据关键词筛选商品
        filteredList = this.commidityList.filter(item =>
          item.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
      }

      // 按库存排序
      this.rows = filteredList.sort((a, b) => b.inventory - a.inventory)
    },

    // 处理词云点击
    handleKeyWordClick(key) {
      this.currentKeyWord = key
      // 清空文本搜索框，避免冲突
      this.searchKeyword = ''

      if (key === '全') {
        this.rows = []
        this.rows = [...this.commidityList].sort((a, b) => b.inventory - a.inventory)
      
      } else {
        const filteredList = this.commidityList.filter(x => x.name.includes(key))
        this.rows = []
        this.rows = filteredList.sort((a, b) => b.inventory - a.inventory)
        console.log('this.rows', this.rows)
      }
    },

    // ==================== 商品加载相关方法 ====================

    // 处理商品规格
    processCommoditySpec(commodity, specKey = 'specList') {
      const specs = commodity[specKey]

      // 1-非定装 2-定装 4-散装：取第一个规格
      if ([1, 2, 4].includes(commodity.saleWay) && specs?.length > 0) {
        commodity.commoditySpec = specs[0]
      }
      // 3-拆包类型：使用列表
      if (commodity.saleWay === 3) {
        commodity.commoditySpecs = specs
      }
    },

    // 处理子商品列表（处理分级子层）
    processChildrenList(childrenList, specKey = 'specList') {
      if (!childrenList?.length) return

      childrenList.forEach(node => {
        this.processCommoditySpec(node, specKey)
      })
    },

    // 缓存商品数据
    cacheCommodityData(cacheKey) {
      this.tabCommodityCache[cacheKey] = {
        commidityList: [...this.commidityList],
        rows: [...this.rows],
        GoodkeyWord: [...this.keyWordList],
        currentTabName: this.currentTabName,
      }
    },

    // 加载完成后的统一处理
    finishLoadingCommodity(cacheKey) {
      this.rows = this.commidityList
      this.generateKeyWords(this.commidityList)
      this.cacheCommodityData(cacheKey)
      this.isLoading = false
      this._loadingKey = null // 清除加载标记
      console.log('[finishLoadingCommodity] 加载完成:', cacheKey)
    },

    // 构建代销商品对象
    buildConsignmentCommodity(data, index) {
      return {
        id: data.id,
        purchaseAssistId: data.id,
        key: this.commodityKeyCounter++,
        name: data.commodityName,
        price: 0,
        inventory: data.initMount - data.saleMount,
        type: 0,
        stockType: 2, // 2-代销
        saleWay: data.saleWay, // 售卖方式1-非定装 2-定装 3-拆包 4-散装
        commodityId: data.commodityId,
        outPutPurchaseInventories: data.outPutPurchaseInventories, // 库存
        extralModel: data.extralModel,
        unit: data.unit,
        fixedTare: data.fixedTare, // 皮重
        initWeight: data.fixWeight, // 固定重量
        commoditySpec: data.commoditySpec,
        isMultiLevel: data.isMultiLevel,
        isShareStock: data.isShareStock,
        parentId: data.parentId,
        // 递归处理 childrenList
        childrenList: data.childrenList
          ? data.childrenList.map((child, childIndex) => this.buildConsignmentCommodity(child, childIndex))
          : [],
      }
    },

    // 构建自营商品对象
    buildSelfOperatedCommodity(data, index) {
      return {
        id: data.id,
        key: this.commodityKeyCounter++,
        name: data.commodityName,
        price: 0,
        inventory: data.initMount - data.saleMount,
        type: 0,
        stockType: 1, // 1-自营
        saleWay: data.saleWay,
        commodityId: data.commodityId,
        extralModel: data.extralModel,
        outPutPurchaseInventories: data.outPutPurchaseInventories,
        unit: data.unit,
        initWeight: data.initWeight,
        commoditySpecs: data.commoditySpecs,
        commoditySpec: data.commoditySpec,
        isMultiLevel: data.isMultiLevel,
        isShareStock: data.isShareStock,
        parentId: data.parentId,
        // 递归处理 childrenList
        childrenList: data.childrenList
          ? data.childrenList.map((child, childIndex) => this.buildSelfOperatedCommodity(child, childIndex))
          : [],
      }
    },

    // 加载代销商品（type === 1）
    async loadConsignmentGoods(batchId, cacheKey) {
      try {
        console.log('[loadConsignmentGoods] 开始加载代销商品:', batchId)
        const res = await category.GetBybatchId2(batchId)

        res.data.forEach((item, index) => {
          // 处理商品规格
          this.processCommoditySpec(item, 'specList')
          // 处理子商品
          this.processChildrenList(item.childrenList, 'specList')
          // 添加到列表
          const commodity = this.buildConsignmentCommodity(item, index)
          console.log('[商品库存]', commodity.name, '库存:', commodity.outPutPurchaseInventories)
          this.commidityList.push(commodity)
        })

        console.log('[loadConsignmentGoods] 代销商品数据:', res.data.length, '个')

        this.finishLoadingCommodity(cacheKey)
      } catch (err) {
        console.error('[loadConsignmentGoods] 加载代销商品失败:', err)
        this.isLoading = false
        this._loadingKey = null // 清除加载标记
      }
    },

    // 加载自营商品（type !== 1）
    async loadSelfOperatedGoods(classId, cacheKey) {
      try {
        console.log('[loadSelfOperatedGoods] 开始加载自营商品:', classId)
        const res = await Purchase.GetEmployCommidityByClassId(classId)

        res.data.forEach((item, index) => {
          // 处理商品规格
          this.processCommoditySpec(item, 'commoditySpecs')
          // 处理子商品
          this.processChildrenList(item.childrenList, 'commoditySpecs')
          // 添加到列表
          this.commidityList.push(this.buildSelfOperatedCommodity(item, index))
        })

        console.log('[loadSelfOperatedGoods] 自营商品数据:', this.commidityList.length, '个')
        this.finishLoadingCommodity(cacheKey)
      } catch (err) {
        console.error('[loadSelfOperatedGoods] 加载自营商品失败:', err)
        this.isLoading = false
        this._loadingKey = null // 清除加载标记
      }
    },

    // 更新活动标签（主入口方法）
    updateActiveTab(res) {
      console.log('[updateActiveTab] 调用:', res)

      this.commodityType = res.type
      this.currentTabId = res.id

      const cacheKey = `${res.type}_${res.id}`

      // 检查缓存
      if (this.tabCommodityCache[cacheKey]) {
        console.log('[updateActiveTab] 使用缓存数据:', cacheKey)
        const cachedData = this.tabCommodityCache[cacheKey]
        this.commidityList = cachedData.commidityList
        this.rows = cachedData.rows
        this.keyWordList = cachedData.GoodkeyWord
        this.currentTabName = cachedData.currentTabName || ''
        this.isLoading = false
        return
      }

      // 防止重复加载：如果当前正在加载同一个批次/分类，则跳过
      if (this.isLoading && this._loadingKey === cacheKey) {
        console.log('[updateActiveTab] 正在加载中，跳过重复请求:', cacheKey)
        return
      }

      // 加载新数据
      console.log('[updateActiveTab] 加载新数据:', cacheKey)
      this.isLoading = true
      this._loadingKey = cacheKey // 记录正在加载的key
      this.commidityList = []
      this.rows = []

      if (res.type === 1) {
        // 设置代销商品tab名称
        const tab = this.activeCategoryList.find(t => t.id === res.id)
        this.currentTabName = tab ? tab.shipperName + tab.batchCode : ''
        // 加载代销商品
        this.loadConsignmentGoods(res.id, cacheKey)
      } else {
        // 加载自营商品
        this.currentTabName = ''
        this.loadSelfOperatedGoods(res.id, cacheKey)
      }
    },

    // 清除商品缓存
    clearTabCache(tabId = null, tabType = null) {
      if (tabId && tabType) {
        // 清除特定tab的缓存
        const cacheKey = `${tabType}_${tabId}`
        delete this.tabCommodityCache[cacheKey]
        console.log('已清除缓存:', cacheKey)
      } else {
        // 清除所有缓存
        this.tabCommodityCache = {}
        console.log('已清除所有商品缓存')
      }
    },

    // ==================== 分类/批次获取方法 ====================

    /**
     * 获取分类列表（统一入口）
     * 根据 vesionType 判断获取代销批次和/或自营分类
     * vesionType:
     *   1 - 自营单商户（只获取分类）
     *   2 - 代销单商户（只获取批次）
     *   3 - 自营多商户（只获取分类）
     *   4 - 代销多商户（同时获取批次和分类）
     */
    async getCategoryList() {
      console.log('getCategoryList', this.activeVesionType)

      if (!this.activeCompanyId) {
        console.warn('companyId 未设置，无法获取分类列表')
        return
      }

      try {
        // 判断版本类型
        if (this.activeVesionType === 4) {
          // 版本4：代销多商户，同时获取代销批次和自营分类
          // 先清空列表，避免重复追加
          this.internalCategoryList = []

          // 先获取代销批次，再获取自营分类（代销批次在前）
          await this.getConsignmentBatchList()
          await this.getSelfOperatedCategoryList()

          // 两个列表都获取完成后，通知父组件并加载第一个分类
          console.log('版本4：合并后的分类列表 (代销批次在前):', this.internalCategoryList)
          this.$emit('category-updated', this.internalCategoryList)

          // 自动加载第一个分类/批次
          if (this.internalCategoryList.length > 0) {
            // 检查当前是否有选中的
            const currentTabExists =
              this.currentTabId && this.internalCategoryList.some(cat => cat.id === this.currentTabId)

            if (currentTabExists) {
              // 当前tab还存在，刷新
              this.updateActiveTab({
                id: this.currentTabId,
                type: this.commodityType,
              })
            } else {
              // 加载第一个（优先代销批次）
              const firstItem = this.internalCategoryList[0]
              const type = firstItem.shipperName ? 1 : 2 // 有shipperName说明是批次（代销），否则是分类（自营）
              this.updateActiveTab({
                id: firstItem.id,
                type: type,
              })
            }
          }
        } else if (this.activeVesionType === 2) {
          // 代销单商户：只获取批次列表
          // getConsignmentBatchList 内部已经处理了自动加载第一个批次
          await this.getConsignmentBatchList()
          this.$emit('category-updated', this.internalCategoryList)
        } else if (this.activeVesionType === 1 || this.activeVesionType === 3) {
          // 自营模式：只获取商品分类列表
          // getSelfOperatedCategoryList 内部已经处理了自动加载第一个分类
          await this.getSelfOperatedCategoryList()
          this.$emit('category-updated', this.internalCategoryList)
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
      }
    },

    /**
     * 获取代销批次列表（vesionType: 2或4）
     */
    async getConsignmentBatchList() {
      try {
        const res = await category.GetAllActiveBatch(this.activeCompanyId)

        // 按创建时间倒序排序
        const batchList = res.data.sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime)
        })

        console.log('代销批次列表:', batchList)

        // 如果是版本4，追加到列表；否则替换列表
        if (this.activeVesionType === 4) {
          // 合并：保留现有列表，追加批次列表
          this.internalCategoryList = [...this.internalCategoryList, ...batchList]
        } else {
          // 替换：直接使用批次列表
          this.internalCategoryList = batchList
        }

        // 自动加载第一个批次（仅在非版本4或首次加载时）
        if (this.activeVesionType !== 4 && batchList.length > 0) {
          // 检查当前批次是否还存在
          const currentTabExists = this.currentTabId && batchList.some(cat => cat.id === this.currentTabId)

          if (currentTabExists) {
            // 当前批次还存在，刷新当前批次
            this.updateActiveTab({
              id: this.currentTabId,
              type: this.commodityType,
            })
          } else {
            // 当前批次不存在或首次加载，切换到第一个批次
            this.updateActiveTab({
              id: batchList[0].id,
              type: 1, // 代销类型
            })
          }
        }
      } catch (error) {
        console.error('获取代销批次列表失败:', error)
        throw error
      }
    },

    /**
     * 获取自营商品分类列表（vesionType: 1、3或4）
     */
    async getSelfOperatedCategoryList() {
      try {
        const res = await category.categoryList(this.activeCompanyId)

        // 转换为统一格式
        const categoryList = res.data.map(x => ({
          id: x.id,
          name: x.className,
        }))

        console.log('自营分类列表:', categoryList)

        // 如果是版本4，追加到列表；否则替换列表
        if (this.activeVesionType === 4) {
          // 合并：保留现有列表，追加分类列表
          this.internalCategoryList = [...this.internalCategoryList, ...categoryList]
        } else {
          // 替换：直接使用分类列表
          this.internalCategoryList = categoryList
        }

        // 自动加载第一个分类（仅在非版本4或首次加载时）
        if (this.activeVesionType !== 4 && categoryList.length > 0) {
          // 检查当前分类是否还存在
          const currentTabExists = this.currentTabId && categoryList.some(cat => cat.id === this.currentTabId)

          if (currentTabExists) {
            // 当前分类还存在，刷新当前分类
            this.updateActiveTab({
              id: this.currentTabId,
              type: this.commodityType,
            })
          } else {
            // 当前分类不存在或首次加载，切换到第一个分类
            this.updateActiveTab({
              id: categoryList[0].id,
              type: 2, // 自营类型
            })
          }
        }
      } catch (error) {
        console.error('获取自营分类列表失败:', error)
        throw error
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-box {
  display: flex;
  .goods-box {
    width: calc(100% - 70rpx);
    padding: 4rpx;
    .search-box {
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-radius: 4rpx;
      height: 20rpx;
      padding: 0 6rpx;
      .icon-search {
        margin-right: 4rpx;
      }
      .clear-btn {
        position: relative;
      }
    }
		.good-content {
			display: flex;
			margin-top: 4rpx;
      height: calc(100vh - 70rpx);
			.good-list {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				align-content: flex-start;
				flex-wrap: wrap;
				width: 244rpx;
				.good-item {
					display: flex;
					flex-direction: column;
					width: 108rpx;
					height: 50rpx;
					padding: 5rpx;
					border-radius: 4rpx;
					background: #ffffff;
					transition: all 0.2s ease;
					margin-bottom: 5rpx;
					overflow: hidden;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
					border: 2px solid transparent;
				}
				.good-item-act {
					border-color: #00aaff;
					background: #c9eafc;
					box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
				}
			}
		}
    .quick-search-tab {
				margin-left: auto;
				position: relative;
				width: 30rpx;
				border-radius: 6rpx;
				background-color: #ffffff;
        margin-top: 4rpx;
				.key-word {}
				.key-word:last-child {
					border: none;
				}
			}
  }
}
/* 垂直标签栏 */
.vertical-tab {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 35rpx;
}

/* 搜索框样式 */
.search-container {
  display: flex;
  align-items: center;
  gap: 10rpx;
  width: 100%;
  box-sizing: border-box;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  margin: 0;
  margin-top: 3rpx;
  margin-left: 18rpx;
  margin-right: 5rpx;
  margin-bottom: 5rpx;
  height: 20rpx;
  padding: 2rpx;
  align-items: center;
  background: #fff;
  border-radius: 3px;
  transition: all 0.3s ease;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.search-input-wrapper:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  width: calc(100vw - 435rpx);
  max-width: 1200rpx;
  min-width: 200rpx;
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  flex-shrink: 0;
  margin-right: 4px;
}

/* 商品类型标签样式 */
.commodity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4rpx;
  align-items: center;
  margin-bottom: 0;
  line-height: 1;
}

.tag {
  display: inline-block;
  padding: 1rpx 3rpx;
  border-radius: 3rpx;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  line-height: 1.2;
}

.tag-consignment {
  color: dodgerblue;
  border-color: dodgerblue;
  background-color: rgba(30, 144, 255, 0.1);
}

.tag-self {
  color: #792292;
  border-color: #792292;
  background-color: rgba(121, 34, 146, 0.1);
}

.tag-unfixed {
  color: #00aa00;
  border-color: #00aa00;
  background-color: rgba(0, 170, 0, 0.1);
}

.tag-fixed {
  color: #55aaff;
  border-color: #55aaff;
  background-color: rgba(85, 170, 255, 0.1);
}

.tag-unpack {
  color: #dc9300;
  border-color: #dc9300;
  background-color: rgba(220, 147, 0, 0.1);
}

.tag-bulk {
  color: #55aaff;
  border-color: #55aaff;
  background-color: rgba(85, 170, 255, 0.1);
}

.tag-multi {
  color: red;
  border-color: red;
  background-color: rgba(255, 0, 0, 0.1);
}
.tag-extra {
  color: #ee6018;
  border-color: #ee6018;
  background-color: rgba(255, 85, 0, 0.1);
}

/* 库存信息样式 */
.inventory-info {
  display: flex;
  font-size: 10rpx;
  color: #333;
  height: 20rpx;
  margin-top: 5rpx;
  line-height: 1.2;
}

.inventory-label {
  font-weight: 600;
  color: #666;
}

.inventory-item {
  margin-left: 2rpx;
  border-radius: 3rpx;
  color: #333;
  line-height: 1.2;
}

.inventory-info.out-of-stock {
  color: #aa0000;
  .inventory-label,
  .inventory-item {
    color: #aa0000;
    background-color: rgba(170, 0, 0, 0.1);
  }
}

.grid-item-active {
  border-color: #00aaff;
  background: #c9eafc;
  box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
  font-weight: bold;
}

/* 词云容器样式 */
.vertical-tab2 {
  background: #ffffff;
  padding: 5px 5px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 词云样式 */
.key-word {
  display: flex;
  margin-top: 8px;
  flex-direction: column;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 25px;
  gap: 0;

  /* 每个字符样式 */
  span {
    padding: 8px 0;

    width: 100%;
    text-align: center;

    &:last-child {
      border-bottom: none;
    }
  }
}

.key-word-active {
  color: dodgerblue;
}

/* 加载动画样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00aaff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
</style>
