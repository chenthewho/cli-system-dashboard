<template>
  <div>
    <div style="display: flex; width: 100%">
      <!-- 商品选择器组件 -->
      <GoodsSelector
        :commodity-list="commodityList"
        :category-list="tabListOrigin"
        :selected-ids="selectedCommodityIds"
        :height="scrollHeight"
        :show-back-button="true"
        :show-add-button="true"
        @back="back"
        @add-good="showAddNewGood = true"
        @item-click="addCommodity"
        @search="handleSearch"
        @category-change="changeTab"
      ></GoodsSelector>
      <div style="flex: 1; background-color: #ffffff; text-align: right">
        <div
          style="
            height: 40rpx;
            margin-left: 5rpx;
            margin-right: 5rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="font-size: 15rpx; font-weight: bold">
            <div v-if="BatchInfo" style="font-size: 15rpx; font-weight: bold">
              <text style="margin-right: 5rpx">{{ BatchInfo.shipperName }}</text
              ><text>{{ BatchInfo.batchCode }}</text>
            </div>
            <div v-else style="font-size: 15rpx; font-weight: bold; color: #999">加载中...</div>
          </div>
        </div>
        <div :style="{ marginLeft: '5rpx', marginRight: '5rpx', height: windowHeight - 60 + 'px' }">
          <!-- 表头 -->
          <div class="table-header">
            <div style="flex: 3; padding: 10px; text-align: left">
              <text style="font-size: 16px; font-weight: bold">货品</text>
            </div>
            <div style="flex: 2; padding: 10px; text-align: center">
              <text style="font-size: 16px; font-weight: bold">入库数量</text>
            </div>
            <div style="flex: 2; padding: 10px; text-align: center">
              <text style="font-size: 16px; font-weight: bold">入库重量</text>
            </div>
            <!-- <div style="flex: 2; padding: 10px; text-align: center;">
							<text style="font-size: 16px; font-weight: bold;">入库单价</text>
						</div>
						<div style="flex: 2; padding: 10px; text-align: center;">
							<text style="font-size: 16px; font-weight: bold;">入库金额</text>
						</div> -->
            <div style="width: 40rpx; padding: 10px; text-align: center">
              <text style="font-size: 16px; font-weight: bold">操作</text>
            </div>
          </div>

          <scroll-view
            class="scrollArea"
            scroll-y="true"
            :style="{ height: scrollHeight2 }"
            :scroll-into-view="targetId"
          >
            <div
              style="display: flex; height: 45rpx; font-size: 18rpx"
              v-for="(item, index) in BatchCommodityList"
              v-if="item.operaType !== 2"
              :id="'id-' + index + '-view'"
              :key="index"
              :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }"
            >
              <div style="flex: 3; padding: 8px; text-align: left; font-weight: bold; line-height: 35rpx">
                <!--商品名称栏-->
                <view style="display: flex; align-items: center">
                  <!--左边-->
                  <view style="font-size: 20px">
                    {{ item.name }}
                  </view>
                  <!--右边-->
                  <view v-if="item.saleWay == 1" style="margin-left: 10rpx">
                    <zero-switch
                      @change="SwitchCalcType($event, item)"
                      text-on="数量"
                      text-off="重量"
                      :show-text="true"
                    ></zero-switch>
                  </view>
                </view>
              </div>
              <div
                style="
                  flex: 2;
                  padding: 8px;
                  text-align: left;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 5rpx;
                "
              >
                <input @click="showKeyBorad(index, 1)" inputmode="none" class="input1" v-model="item.initMount" />
                <text style="font-size: 16px; color: #666; font-weight: 500; min-width: 40rpx">{{
                  item.spec ? item.spec.specName : '件'
                }}</text>
              </div>
              <div
                style="
                  flex: 2;
                  padding: 8px;
                  text-align: left;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 5rpx;
                "
              >
                <input
                  v-if="item.saleWay !== 3"
                  @click="showKeyBorad(index, 2)"
                  inputmode="none"
                  class="input1"
                  v-model="item.initWeight"
                />
                <text v-else style="font-size: 16px; color: #999">-</text>
              </div>
              <!-- <div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
								<input @click="showKeyBorad(index,3)" inputmode="none" class="input1"
									v-model="item.incomingPrice" />
							</div>
							<div style="flex: 2; padding: 8px; text-align: left; display: flex; align-items: center; justify-content: center;">
								<input @click="showKeyBorad(index,4)" inputmode="none" class="input1"
									v-model="item.inboundAmount" />
							</div> -->
              <div
                style="
                  width: 40rpx;
                  padding: 8px;
                  border-right: 1px solid #f4f4f4;
                  text-align: center;
                  line-height: 35rpx;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <uni-icons
                  custom-prefix="iconfont"
                  type="icon-shanchu"
                  size="24"
                  @click="deleteBatchCommdity(index)"
                  color="#aa0000"
                ></uni-icons>
              </div>
            </div>
            <div class="total-content">
              <div class="total-content-item" style="flex: 3">总计：</div>
              <div class="total-content-item" style="flex: 2">总数：{{ totalInitInventory() }}</div>
              <div class="total-content-item" style="flex: 2">总重：{{ totalInitWeight() }}</div>
              <div class="total-content-item" style="width: 40rpx"></div>
            </div>
          </scroll-view>
          <!--键盘-->
          <div v-if="showKeyBoard1">
            <view
              class="mybrankmask"
              :style="{
                width: '450rpx',
                height: '200rpx',
                backgroundColor: '#ffffff',
                zIndex: 999,
                left: 0,
                bottom: 0,
                boxShadow: '0 -4rpx 20rpx rgba(0,0,0,0.15)',
              }"
            >
              <view style="padding: 8rpx">
                <view class="MymaskList">
                  <view class="maskListItem" @click="NumberCk(1)">1</view>
                  <view class="maskListItem" @click="NumberCk(2)">2</view>
                  <view class="maskListItem" @click="NumberCk(3)">3</view>
                  <view class="maskListItem" @click="Tuige()"
                    ><uni-icons
                      custom-prefix="iconfont"
                      type="icon-tuige"
                      size="35"
                      color="#ffffff"
                      style="margin-right: 5rpx"
                    ></uni-icons>
                  </view>
                </view>
                <view class="MymaskList">
                  <view class="maskListItem" @click="NumberCk(4)">4</view>
                  <view class="maskListItem" @click="NumberCk(5)">5</view>
                  <view class="maskListItem" @click="NumberCk(6)">6</view>

                  <view class="maskListItem" @click="NumberCk('+')" style="font-size: 35rpx; color: white"> +</view>
                </view>
                <view class="MymaskList">
                  <view class="maskListItem" @click="NumberCk(7)">7</view>
                  <view class="maskListItem" @click="NumberCk(8)">8</view>
                  <view class="maskListItem" @click="NumberCk(9)">9</view>
                  <view class="maskListItem" @click="NumberCk('-')" style="font-size: 35rpx; color: white"> -</view>
                </view>
                <view class="MymaskList">
                  <view class="maskListItem" @click="NumberCk(0)" style="width: 48%">0</view>
                  <view class="maskListItem" @click="NumberCk('.')">.</view>
                  <view class="maskListItem confirm-btn" @click="hideBorad">确定 </view>
                </view>
              </view>
            </view>
          </div>
        </div>

        <div style="position: fixed; bottom: 0; height: 30rpx; background: #ffffff; width: 100%" v-if="!showKeyBoard1">
          <div style="height: 1rpx; width: 99%; background-color: #909090"></div>
          <button
            style="
              position: fixed;
              width: 50rpx;
              right: 10px;
              font-weight: bold;
              height: 25rpx;
              background-color: #008200;
              color: white;
              margin-top: 3rpx;
              line-height: 25rpx;
            "
            @click="saveBatchGood"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 添加新货品弹窗 - 使用高级组件 -->
    <AddGoodModalAdvanced
      :show="showAddNewGood"
      :unitList="unitList"
      :categoryList="tabListOrigin"
      :extralModelList="extralModelList"
      @close="showAddNewGood = false"
      @confirm="handleAddNewGood"
    />
  </div>
</template>

<script>
import category from '../../api/goods/category'
import batch from '../../api/batch/batch'
import labelApi from '../../api/label/labelApi'
import GoodsSelector from '../../components/GoodsSelector/GoodsSelector.vue'
import AddGoodModalAdvanced from '../../components/AddGoodModal/AddGoodModalAdvanced.vue'

export default {
  components: {
    GoodsSelector,
    AddGoodModalAdvanced,
  },
  data() {
    return {
      currentTab: 0,
      scrollHeight: 0,
      windowHeight: 0,
      companyId: '',
      BatchInfo: null,
      tabList: [],
      tabListOrigin: [],
      showAddNewGood: false,
      commodityList: [],
      valueType: 1,
      windowWidth: 0,
      windowHeight: 0,
      scrollHeight2: '0px',
      editingIndex: 0,
      selectedProductType: '',
      showKeyBoard1: false,
      editType: 'common',
      BatchCommodityList: [],
      targetId: 'id-0-view',
      unitList: [],
      extralModelList: [], // 附加物品列表
      newGoodInfo: {
        name: '',
        classifyId: '',
        saleWay: 1, // 默认按重量
        unit: '件', // 默认单位
        price: '', // 价格
        initWeight: '', // 单位重量
        fixTare: '', // 单位皮重
        showToSale: 1, // 是否显示，默认显示
        specList: [], // 规格列表
      },
      batchList: [
        {
          batchName: '批次名称1',
          batchCode: '批次编号1',
        },
        {
          batchName: '批次名称2',
          batchCode: '批次编号2',
        },
        {
          batchName: '批次名称2',
          batchCode: '批次编号2',
        },
      ],
    }
  },
  computed: {
    // 已选商品ID列表
    selectedCommodityIds() {
      return this.BatchCommodityList.filter(item => item.operaType !== 2) // 排除已删除的
        .map(item => item.commodityId)
    },
  },
  onLoad(options) {
    batch.getBatchInfoById(options.batchId).then(res => {
      this.BatchInfo = res.data
      this.GetReposityAssistBybatchId()
    })
  },
  mounted() {
    // 在组件挂载后设置 scrollHeight
    this.scrollHeight = uni.getWindowInfo().windowHeight - 155
    this.windowHeight = uni.getWindowInfo().windowHeight
    this.companyId = uni.getStorageSync('companyId')
    this.getAllcommodity()
    this.initSystem()
    this.getCompanyUnit()
    this.getAllextralModel()
  },
  methods: {
    // 获取附加物品列表
    getAllextralModel() {
      let that = this
      that.extralModelList = [{ name: '无', id: '' }]
      category
        .getallextralgood(this.companyId)
        .then(res => {
          console.log('附加物品列表返回数据:', res.data)
          if (res.data != null) {
            for (var i = 0; i < res.data.length; i++) {
              that.extralModelList.push(res.data[i])
            }
            console.log('附加物品列表:', that.extralModelList)
          }
        })
        .catch(err => {
          console.error('获取附加物品列表失败:', err)
        })
    },
    // 搜索处理（由组件触发）
    handleSearch(keyword) {
      // 搜索逻辑已在 GoodsSelector 组件内部处理
      console.log('搜索关键词:', keyword)
    },
    changeTab(e) {
      // 分类切换已由 GoodsSelector 组件内部处理
      console.log('切换分类:', e.name)
    },
    // 处理组件确认添加货品
    handleAddNewGood(formData) {
      // 将组件返回的数据赋值给 newGoodInfo
      this.newGoodInfo = { ...formData }
      // 调用原有的添加逻辑
      this.addNewGood()
    },
    //切换计算方式
    SwitchCalcType(e, element) {
      console.log('e', e)
      console.log('element', element)
      if (e) {
        element.calcType = 1
      } else {
        element.calcType = 2
      }
      this.calcCommodityaddedInboundAmount(element)
    },
    onProductTypeChange() {},
    totalInitInventory() {
      return this.BatchCommodityList.reduce((total, item) => {
        return total + (parseFloat(item.initMount) || 0)
      }, 0)
    },
    totalInitWeight() {
      return this.BatchCommodityList.reduce((total, item) => {
        return total + (parseFloat(item.initWeight) || 0)
      }, 0)
    },
    totalAmount() {
      var total = this.BatchCommodityList.reduce((total, item) => {
        return total + (parseFloat(item.inboundAmount) || 0)
      }, 0)

      return total.toFixed(1)
    },
    addNewGood() {
      if (this.newGoodInfo.name === null || this.newGoodInfo.name === '') {
        uni.showToast({
          icon: 'none',
          title: '物品名称不能为空',
          duration: 1200,
        })
        return
      }
      if (this.newGoodInfo.classifyId === '') {
        uni.showToast({
          title: '请选择货品类型',
          icon: 'none',
          duration: 1500,
        })
        return
      }

      var that = this
      // 处理规格列表
      for (var spec of this.newGoodInfo.specList) {
        if (spec.fixcount) spec.fixcount = parseFloat(spec.fixcount)
        if (spec.fixprice) spec.fixprice = parseFloat(spec.fixprice)
      }

      // 根据销售方式处理单位
      if (this.newGoodInfo.saleWay == 1) {
        this.newGoodInfo.specList.push({
          id: this.generateUUID(),
          specName: this.newGoodInfo.unit,
          fixcount: 1,
          fixprice: 0,
          parentId: '',
        })
      }

      if (this.newGoodInfo.saleWay == 2 || this.newGoodInfo.saleWay == 4) {
        this.newGoodInfo.specList.push({
          id: this.generateUUID(),
          specName: this.newGoodInfo.unit,
          fixcount: 1,
          fixprice: parseFloat(this.newGoodInfo.price),
          parentId: '',
        })
      }

      // 转换数值类型
      this.newGoodInfo.price = parseFloat(this.newGoodInfo.price)
      this.newGoodInfo.fixTare = parseFloat(this.newGoodInfo.fixTare)
      this.newGoodInfo.initWeight = parseFloat(this.newGoodInfo.initWeight)

      category
        .CommoditySave3(JSON.stringify(this.newGoodInfo))
        .then(res => {
          uni.showToast({
            icon: 'success',
            title: '添加成功',
            duration: 1200,
          })
          that.showAddNewGood = false
          that.getAllcommodity()
        })
        .catch(error => {
          console.error('添加商品失败:', error)
          uni.showToast({
            icon: 'none',
            title: '添加失败',
            duration: 1200,
          })
        })
    },
    // 生成UUID
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    // 获取公司单位列表
    getCompanyUnit() {
      var that = this
      labelApi.GetCompanyUnit(this.companyId).then(res => {
        that.unitList = res.data
      })
    },
    getCommdityActive(id) {
      if (this.BatchCommodityList.some(x => x.commodityId === id)) {
        return true
      }
    },
    //键盘数字输入处理
    NumberCk(val) {
      //修改状态
      if (this.BatchCommodityList[this.editingIndex].operaType === 0) {
        this.BatchCommodityList[this.editingIndex].operaType = 1
      }
      let myvalue = ''
      switch (this.valueType) {
        case 1:
          myvalue = this.BatchCommodityList[this.editingIndex].initMount
          break
        case 2:
          myvalue = this.BatchCommodityList[this.editingIndex].initWeight
          break
        case 3:
          myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice
          break
        case 4:
          myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount
          break
      }
      if (val == '.') {
        if (myvalue.toString().indexOf('.') >= 0) {
          return
        }
      }
      var myvalueStr = myvalue.toString()
      if (val == '.') {
        if (myvalueStr.indexOf('.') >= 0) {
          return
        }
      }
      if ((val === '+' || val === '-') && myvalueStr === '0') {
        return
      }
      var txt = myvalue == null || (myvalueStr === '0' && val != '.') || myvalue == undefined ? '' : myvalue

      if (val === '+' || val === '-') {
        txt = eval(txt)
      }
      myvalue = txt + val.toString()

      switch (this.valueType) {
        case 1:
          this.BatchCommodityList[this.editingIndex].initMount = myvalue
          if (
            this.BatchCommodityList[this.editingIndex].fixWeight &&
            this.BatchCommodityList[this.editingIndex].fixWeight != ''
          ) {
            this.BatchCommodityList[this.editingIndex].initWeight =
              this.BatchCommodityList[this.editingIndex].initMount *
              this.BatchCommodityList[this.editingIndex].fixWeight
          }
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 2:
          this.BatchCommodityList[this.editingIndex].initWeight = myvalue
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 3:
          this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue
          //输入入库单价计算入库金额
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 4:
          this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue
          //输入入库金额计算单价
          this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex])
          break
      }
    },
    //键盘删除处理
    Tuige() {
      //修改状态
      if (this.BatchCommodityList[this.editingIndex].operaType === 0) {
        this.BatchCommodityList[this.editingIndex].operaType = 1
      }
      let myvalue = ''
      switch (this.valueType) {
        case 1:
          myvalue = this.BatchCommodityList[this.editingIndex].initMount
          break
        case 2:
          myvalue = this.BatchCommodityList[this.editingIndex].initWeight
          break
        case 3:
          myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice
          break
        case 4:
          myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount
          break
      }
      if (myvalue == null || myvalue === '' || myvalue.toString() === '0') {
        return
      }
      myvalue = myvalue ? myvalue.toString() : ''
      if (myvalue.length == 1) {
        myvalue = '0'
      } else {
        myvalue = myvalue.slice(0, -1)
      }

      switch (this.valueType) {
        case 1:
          this.BatchCommodityList[this.editingIndex].initMount = myvalue
          if (
            this.BatchCommodityList[this.editingIndex].fixWeight &&
            this.BatchCommodityList[this.editingIndex].fixWeight != ''
          ) {
            this.BatchCommodityList[this.editingIndex].initWeight =
              this.BatchCommodityList[this.editingIndex].initMount *
              this.BatchCommodityList[this.editingIndex].fixWeight
          }
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 2:
          this.BatchCommodityList[this.editingIndex].initWeight = myvalue
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 3:
          this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue
          //输入入库单价计算入库金额
          this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex])
          break
        case 4:
          this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue
          //输入入库金额计算单价
          this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex])
          break
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
    showKeyBorad(index, type) {
      // 如果是编辑入库重量(type===2)且saleWay===3，不允许编辑
      const item = this.BatchCommodityList[index]
      if (type === 2 && item && item.saleWay === 3) {
        return
      }

      this.valueType = type
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
    },
    GetReposityAssistBybatchId() {
      batch.GetReposityAssistBybatchId(this.BatchInfo.id).then(res => {
        console.log('res', res)
        // this.BatchCommodityList = res.data;
        for (var i = 0; i < res.data.length; i++) {
          var commodity = res.data[i]
          var commodityAdded = {
            id: '',
            historyId: commodity.id,
            name: commodity.commodityName,
            initMount: commodity.initMount,
            initWeight: commodity.saleWay === 3 ? 0 : commodity.initWeight,
            fixWeight: 0, //单位重量（目前仅用于定装）
            commodityId: commodity.commodityId,
            calcType: 1,
            saleWay: commodity.saleWay,
            incomingPrice: 0,
            inboundAmount: commodity.inboundAmount,
            operaType: 0,
          }
          if (commodity.specList.length > 0) {
            commodityAdded.spec = commodity.specList[0]
          }
          this.BatchCommodityList.push(commodityAdded)
        }
      })
    },
    getBatchCommodityList() {
      category.GetBybatchId(this.BatchInfo.id).then(res => {
        this.BatchCommodityList = res.data.map(item => {
          // 如果 saleWay 为 3，强制 initWeight 为 0
          if (item.saleWay === 3) {
            item.initWeight = 0
          }
          return item
        })
      })
    },
    saveBatchGood() {
      let that = this
      var CommodityList = []
      console.log('that.BatchCommodityList', that.BatchCommodityList)
      let userInfo = uni.getStorageSync('userInfo')
      that.BatchCommodityList.forEach(item => {
        if (item.operaType !== 0) {
          CommodityList.push({
            BatchId: that.BatchInfo.id,
            commodityId: item.commodityId,
            historyId: item.historyId,
            operatorId: userInfo.id,
            calcType: item.calcType,
            operaType: item.operaType,
            initMount: 0,
            initWeight: item.saleWay === 3 ? 0 : parseFloat(item.initWeight),
            incomingPrice: parseFloat(item.incomingPrice),
            inboundAmount: parseFloat(item.inboundAmount),
            purchaseInventories: [
              {
                specId: item.spec.id,
                mount: parseFloat(item.initMount),
              },
            ],
          })
        }
      })

      console.log('CommodityList', CommodityList)
      if (that.BatchCommodityList.length > 0) {
        batch.BulkModifyPurchaseAssist(JSON.stringify(CommodityList)).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000,
            })
            that.back()
          } else {
            uni.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000,
            })
          }
        })
      }
    },
    back() {
      uni.setStorageSync('refresh_batch', this.BatchInfo.id)
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
            //修改状态
            if (this.BatchCommodityList[index].operaType === 0 || this.BatchCommodityList[index].operaType === 1) {
              this.BatchCommodityList[index].operaType = 2
            } else {
              this.BatchCommodityList.splice(index, 1)
            }
          } else if (res.cancel) {
            // 用户点击了取消
          }
        },
      })
    },
    getAllcommodity() {
      category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
        console.log('res', res)
        this.commodityList = res.data
        this.tabList = [
          {
            name: '全部',
            value: 0,
          },
        ]
        this.tabListOrigin = []
        this.commodityList.forEach((item, index) => {
          if (!this.tabList.some(tab => tab.name === item.className)) {
            this.tabList.push({
              name: item.className,
              value: index,
            })
          }
          if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
            this.tabListOrigin.push({
              name: item.className,
              value: item.classId,
            })
          }
          if (this.tabListOrigin.length > 0) {
            this.newGoodInfo.classId = this.tabListOrigin[0].value
          }
        })
      })
    },
    //计算添加货品的入库金额 2-按重量计算 1-按数量计算
    calcCommodityaddedInboundAmount(commodityAdded) {
      if (
        commodityAdded.initWeight &&
        commodityAdded.initWeight != '' &&
        commodityAdded.incomingPrice &&
        commodityAdded.incomingPrice != ''
      ) {
        if (commodityAdded.calcType === 2) {
          commodityAdded.inboundAmount = (
            parseFloat(commodityAdded.initWeight) * parseFloat(commodityAdded.incomingPrice)
          ).toFixed(1)
        }
        if (commodityAdded.calcType === 1) {
          commodityAdded.inboundAmount = (
            parseFloat(commodityAdded.initMount) * parseFloat(commodityAdded.incomingPrice)
          ).toFixed(1)
        }
      }
    },
    //计算添加货品的入库单价 2-按重量计算 1-按数量计算
    calcCommodityaddedincomingPrice(commodityAdded) {
      if (commodityAdded.calcType === 2) {
        commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initWeight).toFixed(2)
      }
      if (commodityAdded.calcType === 1) {
        commodityAdded.incomingPrice = (commodityAdded.inboundAmount / commodityAdded.initMount).toFixed(2)
      }
    },
    addCommodity(e) {
      if (this.getCommdityActive(e.id)) return
      if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
        var commodityAdded = {
          id: '',
          name: e.commodityName,
          initMount: 0,
          initWeight: 0,
          fixWeight: e.initWeight, //单位重量（目前仅用于定装）
          commodityId: e.id,
          calcType: 1,
          saleWay: e.saleWay,
          incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
          inboundAmount: 0,
          operaType: 3, //0-未修改 1-编辑 2-删除 3-添加
        }
        if (e.commoditySpecs.length > 0) {
          commodityAdded.spec = e.commoditySpecs[0]
        }
        console.log('commodityAdded', commodityAdded)
        this.BatchCommodityList.push(commodityAdded)
      }
      console.log('this.BatchCommodityList', this.BatchCommodityList)
    },
  },
}
</script>

<style lang="scss" scoped>
.input1 {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  height: 28rpx;
  border-radius: 8rpx;
  font-size: 18rpx;
  text-align: center;
  border: 2px solid #2196f3;
  font-weight: bold;
  color: #1565c0;
  width: 70%;
  flex: 1;
  transition: all 0.2s;
  box-shadow: 0 2rpx 4rpx rgba(33, 150, 243, 0.2);
  line-height: 28rpx;
}

.input1:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 3rpx rgba(33, 150, 243, 0.2);
  background: #ffffff;
}

.mybrankmask .MymaskList {
  font-weight: bold;
  display: flex;
  width: 100%;
  height: 42rpx;
  justify-content: space-around;
  margin-bottom: 6rpx;
  font-size: 26rpx;
}

.mybrankmask .MymaskList .large {
  font-weight: bold;
  height: 42rpx;
  line-height: 42rpx;
  z-index: 5;
  font-size: 26rpx;
}

.mybrankmask .MymaskList .maskListItem {
  font-weight: bold;
  width: 23%;
  height: 42rpx;
  text-align: center;
  line-height: 42rpx;
  border-radius: 8rpx;
  background: #5a5a5a;
  font-size: 26rpx;
  color: white;
  transition: all 0.15s;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.mybrankmask .MymaskList .maskListItem:active {
  opacity: 0.8;
  transform: scale(0.96);
  background: #4a4a4a;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

.mybrankmask .MymaskList .confirm-btn {
  background: #11998e;
  font-weight: bold;
}

.mybrankmask .MymaskList .confirm-btn:active {
  opacity: 0.8;
  background: #0d7a6f;
}

.total-content {
  display: flex;
  height: 35rpx;
  font-size: 16rpx;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-top: 2px solid #fdcb6e;
  border-bottom: 2px solid #fdcb6e;
  box-shadow: 0 2rpx 8rpx rgba(253, 203, 110, 0.3);
  align-items: center;
}

.total-content-item {
  padding: 8px;
  text-align: left;
  font-weight: bold;
  line-height: 28rpx;
  color: #d63031;
  font-size: 15px;
}

/* 表头美化样式 */
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
