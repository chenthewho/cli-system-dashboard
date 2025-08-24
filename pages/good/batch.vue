<template>
	<div :style="{'display': 'flex', 'height': (WindowHeight-65)+'px',width:'100%' }">
		<div style="width: 120rpx; background-color: #ffffff;display: flex;">
			<div>
				<div @click="BatchAddshow = true" style="
	          width: 108rpx;
	          height: 30rpx;
			  margin: 5rpx;
	          background: linear-gradient(90deg, #0055ff 0%, #4facfe 100%);
	          color: white;
	          line-height: 30rpx;
	          text-align: center;
	          border-radius: 4rpx;
	          cursor: pointer;
			  font-size: 18rpx;
	          user-select: none;
	          font-weight: 600;
	          ">
					新增批次
				</div>
				<!-- 圆弧边卡片 -->
				<div style="display: flex; flex-direction: column; gap: 5rpx;">
					<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-150 + 'px' }">
						<div v-for="item in batchList" @click="exchangeBatch(item)" :key="item.id" :style="{
	       marginLeft: '10rpx',
		   marginTop:'5px',
	       width: '100rpx',
	       backgroundColor: selectBatch.id === item.id ? '#00aaff' : '#ffffff', // 浅绿色或白色
	       borderRadius: '12rpx',
	       boxShadow: '0 4rpx 12rpx rgba(0, 0, 0, 0.1)',
	       padding: '10rpx',
	       boxSizing: 'border-box',
	       textAlign: 'left',
	       fontSize: '14rpx',
	       color: selectBatch.id === item.id ? '#ffffff' : '#000000'
	     }">
							<div>
								<text style="font-size: 15rpx; font-weight: bold;">
									{{ item.shipperName }}
								</text>
								<br>
								<text style="font-size: 12rpx; font-weight: bold;">
									{{ item.batchCode }}
								</text>
							</div>
						</div>
					</scroll-view>
				</div>
			</div>
			<!-- 垂直线 -->
			<div style="width: 5rpx; background-color: #ccc; "></div>
		</div>
		<div style="width: 100%;; background-color: #ffffff; text-align: right;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;" v-if="selectBatch"><text
						style="margin-right: 5rpx;">{{selectBatch.shipperName}}</text><text>{{selectBatch.batchCode}}</text>
					<text v-if="selectBatch.saleStatus===2"
						style="font-size: 10rpx; border: 1px solid green; border-radius: 4rpx; color: green; margin-left: 5rpx;">已结算</text>
					<text
						style="margin-left: 50rpx;font-size: 10rpx;">创建时间:{{(selectBatch.createTime).replace("T"," ")}}</text>
				</div>
				<div style="text-align: right;display: flex;" v-if="selectBatch">
					<button v-if="selectBatch.saleStatus===1"
						style="margin-right: 20rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: darkred;color: #ffffff;"
						@click="setSaleStatus(0)">售罄</button>
					<button v-if="selectBatch.saleStatus===0||selectBatch.saleStatus===2"
						style="margin-right: 20rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: dodgerblue;color: #ffffff;"
						@click="setSaleStatus(1)">开售</button>
					<button v-if="selectBatch.saleStatus===0&&deleteBatchValid()"
						style="margin-right: 5rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: #aaaaaa;color: #818181;"
						@click="deleteBatch">删除批次</button>
					<DropdownButton :options="operatorBtnoptions" :fontSize="12" :menuFontSize="10" :defaultValue="操作"
						:width="70" :height="20" :iconPosition="-5" @change="operabtnChange">
					</DropdownButton>
					<!-- <button
						style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: orange;color: #ffffff;"
						@click="turnToBatchGood">库存操作</button> -->
				</div>
			</div>
			<div style="margin-left: 5rpx;margin-right: 5rpx;">
				<!-- 表头 -->
				<div
					style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
					<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">货品</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">已售数量</div>
					<div style="flex: 2; padding: 8px; text-align: center;border-right: 1px solid #f4f4f4; ">已售重量 / 入库重量
					</div>
					<div style="flex: 2; padding: 8px; text-align: center;">剩余库存 / 入库数量</div>
				</div>
				<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-170 + 'px' }" v-if="BatchCommodityList.length>0">
					<!-- 表格内容行 -->
					<div style="display: flex; border: 1px solid #ddd;" v-for="item in BatchCommodityList">
						<div
							style="flex: 3; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{item.commodityName}}
						</div>

						<div
							style="flex: 2; padding: 8px; border-right: 1px solid #ddd; text-align: center;font-weight: bold;">
							{{item.saleMountStr===""?0:item.saleMountStr}}
						</div>
						<div
							style="flex: 2; padding: 8px; text-align: center;font-weight: bold;border-right: 1px solid #ddd;">
							( {{item.saleWeight}} ) / {{item.initWeight}}
						</div>
						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							( {{item.inventMountStr}} ) / {{item.initMountStr}}
						</div>
					</div>
					<div style="display: flex; border: 1px solid #ddd;">
						<div style="flex: 3; padding: 8px;text-align: center;font-weight: bold;">
							总计：
						</div>

						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							{{totalInventorySold()}}
						</div>
						<div style="flex: 2; padding: 8px; text-align: center;font-weight: bold;">
							( {{totalWeightSold()}} ) / {{totalInitWeight() }}
						</div>
						<div style="flex: 2; padding: 8px;  text-align: center;font-weight: bold;">
							( {{totalInventory()}} ) / {{totalInitInventory()}}
						</div>
					</div>
				</scroll-view>
			</div>
			<div style="height: 100rpx;" v-if="BatchCommodityList.length==0">
				<div style=" margin-top: 40rpx; text-align: center;">
					<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="40" color="#969696"></uni-icons>
					<div style="margin-top: 10px; color: #969696;font-weight: bold;">无货品</div> <!-- 添加的文字 -->
				</div>
			</div>
		</div>

<!-- 新增批次弹窗 -->
<!-- <u-modal title="" :show="BatchAddshow" @close="BatchAddshow=false" :closeOnClickOverlay="false"
  :showConfirmButton="false" width="900px"> -->
  <div class="znj-batch-modal" v-if="BatchAddshow">
    <div class="znj-batch-modal-header">
      <span>新增批次</span>
      <uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
        @click="BatchAddshow=false" color="#aa0000" class="znj-batch-modal-close"></uni-icons>
    </div>
    <div class="znj-batch-modal-body">
      <div class="znj-batch-modal-left">
		<div style="display: flex;">
        <div class="znj-batch-modal-label" style=" width: 100rpx;">批次号：</div>
        <input v-model="batshNewCode" disabled="true"
          class="znj-batch-modal-input"></input>
		</div>
        <div class="znj-batch-modal-copy">
          <u-switch v-model="copyLastBatch" @click="copyLastBatch = !copyLastBatch" style="margin-right: 10rpx;" />
          是否复制上一批次货品
        </div>
        <button class="znj-batch-modal-btn" @click="createBatch">下一步</button>
      </div>
      <div class="znj-batch-modal-right">
        <div class="znj-batch-modal-label-row">
          <span>选择货主：</span>
          <button class="znj-batch-modal-add-shipper-btn" @click="ShipperAddshow = true">新增货主</button>
        </div>
        <div class="znj-batch-modal-shipper-list">
          <scroll-view class="znj-batch-modal-scroll" scroll-y="true">
            <div v-for="(item, index) in shipperList" :key="item.id"
              :class="['znj-batch-modal-shipper-item', {selected: shipperSelectedId === item.id}]">
              <div style="display: flex; align-items: center; flex: 1;" @click="changAddedBatchCode(item.id)">
                <uni-icons custom-prefix="iconfont" type="icon-youjiantou" size="25"
                  color="#333" style="margin-right: 5rpx;" />
                {{ (index+1) + '. ' + item.shipperName }}
              </div>
              <button class="znj-batch-edit-shipper-btn" @click.stop="editShipper(item)" 
                style="margin-left: 10rpx; padding: 5rpx 10rpx; background-color: #409EFF; color: white; border: none; border-radius: 5rpx; font-size: 12rpx;">
                编辑
              </button>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
  </div>
<!-- </u-modal> -->

<!-- 新增货主弹窗 -->
<u-modal title="新增货主" :show="ShipperAddshow" @close="ShipperAddshow=false" :closeOnClickOverlay="false"
  :showConfirmButton="false" width="500rpx">
  <div class="znj-shipper-modal">
    <u--input placeholder="货主名称" border="surround" v-model="shipperAddedName" clearable class="znj-shipper-modal-input" />
    <u--input placeholder="货主电话" border="surround" v-model="shipperPhone" clearable class="znj-shipper-modal-input" />
    <div class="znj-shipper-modal-btns">
      <button class="znj-shipper-modal-btn cancel" @click="ShipperAddshow=false">返回</button>
      <button class="znj-shipper-modal-btn confirm" @click="AddShipper">添加</button>
    </div>
  </div>
</u-modal>

<!-- 编辑货主弹窗 -->
<u-modal title="编辑货主" :show="ShipperEditshow" @close="ShipperEditshow=false" :closeOnClickOverlay="false"
  :showConfirmButton="false" width="500rpx">
  <div class="znj-shipper-modal">
    <u--input placeholder="货主名称" border="surround" v-model="shipperEditName" clearable class="znj-shipper-modal-input" />
    <u--input placeholder="货主电话" border="surround" v-model="shipperEditPhone" clearable class="znj-shipper-modal-input" />
    <div class="znj-shipper-modal-btns">
      <button class="znj-shipper-modal-btn cancel" @click="ShipperEditshow=false">返回</button>
      <button class="znj-shipper-modal-btn confirm" @click="updateShipper">保存</button>
    </div>
  </div>
</u-modal>
	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import batch from '../../api/batch/batch'

	export default {
		data() {
			return {
				BatchAddshow: false,
				ShipperAddshow: false,
				ShipperEditshow: false,
				companyId: "",
				shipperAddedName: "",
				shipperPhone: "",
				shipperEditData: {},
				shipperEditName: "",
				shipperEditPhone: "",
				shipperList: [],
				shipperSelectedId: "",
				batshNewCode: "",
				copyLastBatch: true,
				selectBatch: null,
				batchList: [],
				BatchCommodityList: [],
				WindowHeight: 0,
				operatorBtnoptions: [{
					text: "报损",
					value: 1
				},
				{
					text: "入库",
					value: 2
				}]
			}
		},
		onShow() {
			this.getAllBatch();
			var refresh_batch = uni.getStorageInfoSync("refresh_batch");
			if (refresh_batch != null) {
				this.getBatchCommodityList(refresh_batch);
				uni.removeStorageSync("refresh_batch")
			}
		},
		mounted() {
			this.companyId = uni.getStorageSync('companyId');
			this.getallShipper();
			this.getAllBatch();
			this.WindowHeight = uni.getWindowInfo().windowHeight;
		},
		methods: {

			operabtnChange(e) {
				if (e.value === 1) {
					this.enterTolossModel();
				}
			},
			enterTolossModel() {
				console.log("this.selectBatch", this.selectBatch)
				uni.navigateTo({
					url: `/pages/good/lossAssistModel?batch=${JSON.stringify(this.selectBatch)}`
				})
			},
			totalInitInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					var initInventory = 0;
					for (var i = 0; i < item.initPurchaseInventories.length; i++) {
						initInventory += item.initPurchaseInventories[i].mount;
					}
					return total + (initInventory || 0);
				}, 0);
			},
			totalInventorySold() {
				return this.BatchCommodityList.reduce((total, item) => {
					var inventorySold = 0;
					for (var i = 0; i < item.salePurchaseInventories.length; i++) {
						inventorySold += item.salePurchaseInventories[i].mount;
					}
					return total + (inventorySold || 0);
				}, 0);
			},

			totalInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					var inventory = 0;
					for (var i = 0; i < item.outPutPurchaseInventories.length; i++) {
						inventory += item.outPutPurchaseInventories[i].mount;
					}
					return total + (inventory || 0);
				}, 0);
			},

			totalWeightSold() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.saleWeight) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initWeight) || 0);
				}, 0);
			},
			deleteBatch() {
				let that = this;
				uni.showModal({
					title: '确认删除',
					content: '确定要删除选中的批次吗？',
					success: (res) => {
						if (res.confirm) {
							batch.deleteBatchById(this.selectBatch.id).then(res => {
								if (res.code === 200) {
									uni.showToast({
										title: '已取消删除',
										icon: 'none'
									});
									that.getAllBatch();
								} else {
									uni.showToast({
										title: '删除失败',
										icon: 'none'
									});
								}
							})
						} else {
							// 用户点击了取消
							uni.showToast({
								title: '已取消删除',
								icon: 'none'
							});
						}
					}
				});
			},
			//验证该批次是否产生数据再删除
			deleteBatchValid(){
				for(var i = 0;i<this.BatchCommodityList.length;i++){
					if(this.BatchCommodityList[i].salePurchaseInventories.length>0){
						return false;
					}
				}
				return true;
			},
			setSaleStatus(info) {
				var newBatch = JSON.parse(JSON.stringify(this.selectBatch))
				newBatch.saleStatus = info;
				category.UpdateBatchStatus(newBatch).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						});
						this.selectBatch.saleStatus = info;
					} else {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				})
			},
			exchangeBatch(item) {
				this.selectBatch = item;
				this.getBatchCommodityList(item.id);
			},
			getBatchCommodityList(id) {
				batch.GetBybatchPurchaseAssist(id).then(res => {
					this.BatchCommodityList = res.data;
					for (var i = 0; i < this.BatchCommodityList.length; i++) {
						this.BatchCommodityList[i].saleMountStr = "";
						this.BatchCommodityList[i].initMountStr = "";
						this.BatchCommodityList[i].inventMountStr = "";
						for (var j = 0; j < this.BatchCommodityList[i].salePurchaseInventories.length; j++) {
							this.BatchCommodityList[i].saleMountStr += this.BatchCommodityList[i]
								.salePurchaseInventories[j].mount + this.BatchCommodityList[i]
								.salePurchaseInventories[j].specName + " "
						}
						for (var j = 0; j < this.BatchCommodityList[i].initPurchaseInventories.length; j++) {
							this.BatchCommodityList[i].initMountStr += this.BatchCommodityList[i]
								.initPurchaseInventories[j].mount + this.BatchCommodityList[i]
								.initPurchaseInventories[j].specName + " "
						}
						for (var j = 0; j < this.BatchCommodityList[i].outPutPurchaseInventories.length; j++) {
							this.BatchCommodityList[i].inventMountStr += this.BatchCommodityList[i]
								.outPutPurchaseInventories[j].mount + this.BatchCommodityList[i]
								.outPutPurchaseInventories[j].specName + " "
						}
					}
				})
			},
			createBatch() {
				var param = {
					CompanyId: this.companyId,
					ShipperId: this.shipperSelectedId,
					BatchCode: this.batshNewCode
				}
				category.CreateBatch(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: '创建成功',
							icon: 'none'
						});
						const data = encodeURIComponent(JSON.stringify(res.data));
						this.BatchAddshow = false;
						if (this.copyLastBatch == true) {
							uni.navigateTo({
								url: `/pages/good/batchGoodManger?Batch=${data}&&edit=copyLast`
							})
						} else {
							uni.navigateTo({
								url: `/pages/good/batchGoodManger?Batch=${data}&&edit=common`
							})
						}

					} else {
						uni.showToast({
							title: '创建失败',
							icon: 'none'
						});
					}
				})
			},
			turnToBatchGood() {
				const data = encodeURIComponent(JSON.stringify(this.selectBatch));
				uni.navigateTo({
					url: `/pages/good/batchGoodManger?Batch=${data}&&edit=common`
				})
			},
			changAddedBatchCode(id) {
				this.shipperSelectedId = id;
				this.getBatchNewCodeByShipperId(id);
			},
			getallShipper() {
				category.GetAllShipper(this.companyId).then(res => {
					this.shipperList = res.data;
					if (this.shipperList.length > 0) {
						this.shipperSelectedId = this.shipperList[0].id;
						this.getBatchNewCodeByShipperId(this.shipperList[0].id);
					}
				})
			},
			getAllBatch() {
				category.GetAllBatch(this.companyId).then(res => {
					this.batchList = res.data.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
					if (this.batchList.length > 0) {
						this.selectBatch = this.batchList[0];
						this.getBatchCommodityList(this.selectBatch.id);
					}
				})
			},
			AddShipper() {
				if (this.shipperAddedName == null || this.shipperAddedName == "") return;
				var data = {
					CompanyId: this.companyId,
					ShipperName: this.shipperAddedName,
					ShipperPhone:this.shipperPhone
				}
				category.AddShipper(data).then(res => {
					this.ShipperAddshow = false;
					this.getallShipper();
				})
			},
			editShipper(item) {
				this.shipperEditData = { ...item };
				this.shipperEditName = item.shipperName;
				this.shipperEditPhone = item.shipperPhone;
				this.ShipperEditshow = true;
			},
			updateShipper() {
				const data = {
					id: this.shipperEditData.id,
					CompanyId: this.companyId,
					ShipperName: this.shipperEditName,
					ShipperPhone: this.shipperEditPhone
				}
				// 这里需要调用更新货主的API
				category.UpdateShipper(data).then(res => {
					this.ShipperEditshow = false;
					this.getallShipper();
				}).catch(err => {
					console.log('更新货主失败:', err);
					// 如果没有UpdateShipper API，可以先关闭弹窗并提示用户
					this.ShipperEditshow = false;
					uni.showToast({
						title: '功能待完善',
						icon: 'none'
					});
				})
			},
			shipperSelect(e) {
				this.shipperSelectedId = e;
				this.getBatchNewCodeByShipperId(e);
			},
			getBatchNewCodeByShipperId(Id) {
				category.GetNewBatchCode(this.companyId, Id).then(res => {
					this.batshNewCode = res.data
				})
			}
		}

	}
</script>

<style>
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
		background-color: #2196F3;
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

	.addShipper-content {
		display: flex;
		flex-direction: column;
		width: 200rpx;
	}
	/* 只影响这两个弹窗 */
.znj-batch-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 32rpx 24rpx;
  width: 600rpx;
  box-sizing: border-box;
  position: absolute;
  left: 10%;
  top: 10%;
}
.znj-batch-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16rpx;
}
.znj-batch-modal-close {
  cursor: pointer;
}
.znj-batch-modal-body {
  display: flex;
  gap: 32rpx;
}
.znj-batch-modal-left, .znj-batch-modal-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.znj-batch-modal-label {
  font-size: 15rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}
.znj-batch-modal-input {
  margin-bottom: 16rpx;
  padding: 5rpx;
  height: 20rpx;
  border-radius: 5rpx;
  font-size: 20rpx;
  line-height: 15rpx;
  border: 1px solid #ccc;
  background-color: #ddd;
}
.znj-batch-modal-copy {
  display: flex;
  align-items: center;
  font-size: 15rpx;
  margin-bottom: 32rpx;
}
.znj-batch-modal-btn {
  background: linear-gradient(90deg, #4caf50, #43a047);
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 15rpx;
  font-weight: bold;
  padding: 0 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-batch-modal-btn:hover {
  background: linear-gradient(90deg, #43a047, #388e3c);
}
.znj-batch-modal-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15rpx;
  font-weight: 500;
}
.znj-batch-modal-add-shipper-btn {
  background: #0073ac;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  font-size: 15rpx;
  padding: 0 15rpx;
  cursor: pointer;
}
.znj-batch-modal-shipper-list {
  margin-top: 16rpx;
}
.znj-batch-modal-scroll {
  max-height: 200rpx;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8rpx;
  padding: 8rpx;
  background: #fafbfc;
}
.znj-batch-modal-shipper-item {
  padding: 12rpx 8rpx;
  border-radius: 6rpx;
  font-size: 15rpx;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-batch-modal-shipper-item.selected, .znj-batch-modal-shipper-item:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.znj-shipper-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24rpx;
  width: 100%;
}
.znj-shipper-modal-input {
  font-size: 26rpx;
  padding: 12rpx;
}
.znj-shipper-modal-btns {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 16rpx;
}
.znj-shipper-modal-btn {
  flex: 1;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.znj-shipper-modal-btn.cancel {
  background: #bdbdbd;
  color: #fff;
  height: 50rpx;
  line-height: 50rpx;
}
.znj-shipper-modal-btn.confirm {
  background: #0073ac;
  color: #fff;
  height: 50rpx;
  line-height: 50rpx;
}
.znj-shipper-modal-btn.confirm:hover {
  background: #005f8c;
}
</style>