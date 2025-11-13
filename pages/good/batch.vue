<template>
	<div :style="{'display': 'flex', 'height': (WindowHeight-65)+'px',width:'100%', 'overflow': 'hidden' }">
		<div style="width: 160rpx; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); display: flex; flex-direction: column; overflow: hidden; box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.08);">
		<!-- 新增批次按钮 -->
		<div @click="getBatchNewCodeByShipperId(shipperSelectedId);BatchAddshow = true;" style="
          width: 120rpx;
          height: 30rpx;
		  margin: 5rpx 5rpx 8rpx 5rpx;
          background: linear-gradient(90deg, #0055ff 0%, #4facfe 100%);
          color: white;
          line-height: 30rpx;
          text-align: center;
          border-radius: 8rpx;
          cursor: pointer;
		  font-size: 16rpx;
          user-select: none;
          font-weight: 600;
		  box-shadow: 0 2rpx 8rpx rgba(0, 85, 255, 0.3);
		  flex-shrink: 0;
          ">
			新增批次
		</div>
			<!-- 批次列表滚动区 -->
			<scroll-view class="scrollArea" scroll-y="true" :style="{ height: (WindowHeight - 120) + 'px', width: '100%' }">
				<div style="display: flex; flex-direction: column; gap: 5rpx; padding: 0 5rpx 5rpx 5rpx;">
				<div v-for="item in batchList" @click="exchangeBatch(item)" :key="item.id" :style="{
       width: '120rpx',
       background: selectBatch.id === item.id ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' : '#ffffff',
       borderRadius: '8rpx',
       boxShadow: selectBatch.id === item.id ? '0 4rpx 12rpx rgba(33, 150, 243, 0.35)' : '0 2rpx 8rpx rgba(0, 0, 0, 0.08)',
       padding: '10rpx',
       boxSizing: 'border-box',
       textAlign: 'left',
       fontSize: '14rpx',
       color: selectBatch.id === item.id ? '#ffffff' : '#333',
	   border: selectBatch.id === item.id ? '2rpx solid #2196F3' : '1rpx solid #e0e0e0'
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
					</div>
			</scroll-view>
		</div>
		<!-- 垂直分隔线 -->
		<div style="width: 3rpx; background: #ccc; flex-shrink: 0;"></div>
		<div style="width: 100%; background-color: #ffffff; text-align: right; overflow: hidden;">
			<div
				style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
				<div style="font-size: 15rpx; font-weight: bold;" v-if="selectBatch"><text
						style="margin-right: 5rpx;">{{selectBatch.shipperName}}</text><text>{{selectBatch.batchCode}}</text>
				<text v-if="selectBatch.saleStatus===2"
					style="font-size: 10rpx; border: 1px solid green; border-radius: 6rpx; color: green; margin-left: 5rpx;">已结算</text>
					<text
						style="margin-left: 50rpx;font-size: 10rpx;">创建时间:{{(selectBatch.createTime).replace("T"," ")}}</text>
				</div>
				<div style="text-align: right;display: flex;" v-if="selectBatch">
				<button v-if="selectBatch.saleStatus===1"
					style="margin-right: 20rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: darkred;color: #ffffff;"
					@click="confirmSaleOut">售罄</button>
					<button v-if="selectBatch.saleStatus===0||selectBatch.saleStatus===2"
						style="margin-right: 20rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: dodgerblue;color: #ffffff;"
						@click="setSaleStatus(1)">开售</button>
					<button v-if="selectBatch.saleStatus===0&&deleteBatchValid()"
						style="margin-right: 5rpx; height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: #aaaaaa;color: #818181;"
						@click="deleteBatch">删除批次</button>
					<DropdownButton :options="operatorBtnoptions" :fontSize="12" :menuFontSize="10" :defaultValue="'操作'"
						:width="70" :height="20" :iconPosition="-5" @change="operabtnChange">
					</DropdownButton>
					<!-- <button
						style="height: 20rpx;line-height: 20rpx;font-weight: bold;background-color: orange;color: #ffffff;"
						@click="turnToBatchGood">库存操作</button> -->
				</div>
			</div>
			<div class="table-container">
				<!-- 表头 -->
				<div class="table-header">
					<div class="table-cell header-cell" style="flex: 2;">货品</div>
					<div class="table-cell header-cell" style="flex: 2;">入库数量</div>
					<div class="table-cell header-cell" style="flex: 2;">销量</div>
					<div class="table-cell header-cell last-cell" style="flex: 2;">库存</div>
				</div>
				<scroll-view class="scrollArea" scroll-y="true" :style="{ height: WindowHeight-170 + 'px' }" v-if="BatchCommodityList.length>0">
					<!-- 表格内容行 -->
					<div class="table-row" v-for="(item, index) in BatchCommodityList" :key="index">
						<div class="table-cell" style="flex: 2;">
							{{item.commodityName}}
						</div>
						<div class="table-cell" style="flex: 2;">
							{{item.initMountStr}}/{{item.initWeight}}
						</div>
						<div class="table-cell" style="flex: 2;">
						{{item.saleMountStr===""?0:item.saleMountStr}}/	( {{item.saleWeight}} )
						</div>
						<div class="table-cell last-cell" style="flex: 2;">
							{{item.inventMountStr}} / ({{item.inventWeight}})
						</div>
					</div>
					<!-- 总计行 -->
					<div class="table-row total-row">
						<div class="table-cell" style="flex: 2;">
							总计
						</div>
						<div class="table-cell" style="flex: 2;">
							{{totalInitMountStr()}}/{{totalInitWeight().toFixed(1)}}
						</div>
						<div class="table-cell" style="flex: 2;">
							{{totalSaleMount()}}/ ( {{totalWeightSold().toFixed(1)}} )
						</div>
						<div class="table-cell last-cell" style="flex: 2;">
							{{totalInventMount()}} / ({{totalInventWeight().toFixed(1)}})
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
  <div class="znj-modal-overlay" v-if="BatchAddshow" @click="BatchAddshow=false">
    <div class="znj-batch-modal" @click.stop>
      <div class="znj-batch-modal-header">
        <span>新增批次</span>
        <uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
          @click="BatchAddshow=false" color="#ffffff" class="znj-batch-modal-close"></uni-icons>
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
              <div v-for="(item, index) in shipperList" :key="item.id" @click="changAddedBatchCode(item.id)"
                :class="['znj-batch-modal-shipper-item', {selected: String(shipperSelectedId) === String(item.id)}]">
                <div style="display: flex; align-items: center; flex: 1;" >
                  {{ (index+1) + '. ' + item.shipperName }}
                </div>
                <!-- <button class="znj-batch-edit-shipper-btn" @click.stop="editShipper(item)" 
                  style="margin-left: 10rpx; padding: 5rpx 10rpx; background-color: #409EFF; color: white; border: none; border-radius: 6rpx; font-size: 12rpx;">
                  编辑
                </button> -->
              </div>
            </scroll-view>
          </div>
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
				operatorBtnoptions: [
				{
					text: "修改",
					value: 2
				},{
					text: "报损",
					value: 1
				},{
					text: "记录",
					value: 3
			}]
		}
	},

	mounted() {
		this.companyId = uni.getStorageSync('companyId');
		this.getallShipper();
		this.getAllBatch();
		this.WindowHeight = uni.getWindowInfo().windowHeight;
		
		// 监听刷新事件
		uni.$on('refreshBatch', (batchId) => {
			this.getAllBatch();
			if (batchId) {
				setTimeout(() => {
					this.getBatchCommodityList(batchId);
				}, 100);
			}
		});
	},
	beforeDestroy() {
		// 移除事件监听
		uni.$off('refreshBatch');
	},
	methods: {

			operabtnChange(e) {
				if (e.value === 1) {
					this.enterTolossModel();
				}
				if(e.value === 2) {
					uni.navigateTo({
						url: `/pages/good/batchGoodEdit?batchId=${this.selectBatch.id}`
					})
				}
				if(e.value === 3) {
					uni.navigateTo({
						url: `/pages/good/batchModifyRecord?batchId=${this.selectBatch.id}`
					})
				}
			},
			enterTolossModel() {
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
			// 计算总入库数量（字符串格式）
			totalInitMountStr() {
				let totalMount = 0;
				this.BatchCommodityList.forEach(item => {
					if (item.initPurchaseInventories && item.initPurchaseInventories.length > 0) {
						item.initPurchaseInventories.forEach(inv => {
							totalMount += (parseFloat(inv.mount) || 0);
						});
					}
				});
				return totalMount;
			},
			// 计算总销量数量
			totalSaleMount() {
				let totalMount = 0;
				this.BatchCommodityList.forEach(item => {
					if (item.salePurchaseInventories && item.salePurchaseInventories.length > 0) {
						item.salePurchaseInventories.forEach(inv => {
							totalMount += (parseFloat(inv.mount) || 0);
						});
					}
				});
				return totalMount;
			},
			// 计算总库存数量
			totalInventMount() {
				let totalMount = 0;
				this.BatchCommodityList.forEach(item => {
					if (item.outPutPurchaseInventories && item.outPutPurchaseInventories.length > 0) {
						item.outPutPurchaseInventories.forEach(inv => {
							totalMount += (parseFloat(inv.mount) || 0);
						});
					}
				});
				return totalMount;
			},
			// 计算总库存重量
			totalInventWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.inventWeight) || 0);
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
		// 确认售罄
		confirmSaleOut() {
			uni.showModal({
				title: '确认售罄',
				content: '确定要将该批次标记为售罄吗？',
				confirmText: '确定',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						this.setSaleStatus(0);
					}
				}
			});
		},
		setSaleStatus(info) {
			// 只发送必要的字段，避免DateTime转换问题
			const updateData = {
				id: this.selectBatch.id,
				batchCode: this.selectBatch.batchCode,
				shipperId: this.selectBatch.shipperId,
				shipperName: this.selectBatch.shipperName,
				companyId: this.selectBatch.companyId,
				saleStatus: info
				// 不包含createTime字段，避免格式问题
			};
			
			category.UpdateBatchStatus(updateData).then(res => {
				if (res.code === 200) {
					uni.showToast({
						title: '操作成功',
						icon: 'none'
					});
					this.selectBatch.saleStatus = info;
					// 刷新批次列表和商品列表
					this.getAllBatch();
					if (this.selectBatch && this.selectBatch.id) {
						this.getBatchCommodityList(this.selectBatch.id);
					}
				} else {
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					});
				}
			}).catch(err => {
				console.error('更新批次状态失败:', err);
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				});
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
						this.BatchCommodityList[i].inventWeight = this.BatchCommodityList[i].initWeight - this.BatchCommodityList[i].saleWeight;
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
				// category.CreateBatch(JSON.stringify(param)).then(res => {
				// 	if (res.code == 200) {
				// 		uni.showToast({
				// 			title: '创建成功',
				// 			icon: 'none'
				// 		});
						// 获取选中供应商的名称
						const selectedShipper = this.shipperList.find(s => s.id === this.shipperSelectedId);
						const shipperName = selectedShipper ? selectedShipper.shipperName : '';
						
						this.BatchAddshow = false;
						if (this.copyLastBatch == true) {
							uni.navigateTo({
								url: `/pages/good/batchGoodManger?shipperId=${this.shipperSelectedId}&BatchCode=${this.batshNewCode}&shipperName=${encodeURIComponent(shipperName)}&edit=copyLast`
							})
						} else {
							uni.navigateTo({
								url: `/pages/good/batchGoodManger?shipperId=${this.shipperSelectedId}&BatchCode=${this.batshNewCode}&shipperName=${encodeURIComponent(shipperName)}&edit=common`
							})
						}

					// } else {
					// 	uni.showToast({
					// 		title: '创建失败',
					// 		icon: 'none'
					// 	});
					// }
				// })
			},
			changAddedBatchCode(id) {
				// 确保类型一致，转换为字符串进行比较
				this.shipperSelectedId = String(id);
				this.getBatchNewCodeByShipperId(id);
			},
			getallShipper() {
				category.GetAllShipper(this.companyId).then(res => {
					this.shipperList = res.data;
					// 只有在没有选中货主时才设置默认选中第一个
					if (this.shipperList.length > 0 && !this.shipperSelectedId) {
						this.shipperSelectedId = String(this.shipperList[0].id);
						this.getBatchNewCodeByShipperId(this.shipperList[0].id);
					}
				})
			},
		getAllBatch() {
			category.GetAllBatch(this.companyId).then(res => {
				res.data.forEach(item => {
					item.createTime = item.createTime.replace("T", " ");
				});
				// 筛选 salestatus 等于 -1 的批次
				const filteredData = res.data.filter(item => item.saleStatus === 1);

				this.batchList = filteredData.sort((a, b) => {
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
		border-radius: 8rpx;
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
		border-radius: 6rpx;
	}

	h2.selected {
		border-bottom: 2px solid gray;
		/* 下划线为蓝色 */
		background-color: #cacaca;
		/* 蓝色背景框，可以根据需求调整 */
		padding: 5rpx;
		border-radius: 6rpx;
	}

	.addShipper-content {
		display: flex;
		flex-direction: column;
		width: 200rpx;
	}
	/* 遮罩层样式 */
.znj-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
/* 只影响这两个弹窗 */
.znj-batch-modal {
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  width: 600rpx;
  box-sizing: border-box;
  position: relative;
}
.znj-batch-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  font-size: 15rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  padding: 20px 24px;
  color: #ffffff;
}
.znj-batch-modal-close {
  cursor: pointer;
}
.znj-batch-modal-body {
  display: flex;
  gap: 32rpx;
  padding: 20rpx;
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
  border-radius: 6rpx;
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
  border-radius: 6rpx;
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
.znj-batch-modal-shipper-item.selected{
  background: #e3f2fd;
  color: #1976d2;
}

.znj-shipper-modal {
  background: #fff;
  border-radius: 12rpx;
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

/* 简洁风格表格样式 */
.table-container {
  margin: 0 5rpx;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.table-header {
  display: flex;
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
  border-bottom: 2rpx solid #90caf9;
}

.table-cell {
  padding: 12rpx 10rpx;
  text-align: center;
  font-size: 13rpx;
  border-right: 1rpx solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-cell.last-cell {
  border-right: none;
}

.header-cell {
  padding: 8rpx 8rpx;
  font-weight: 600;
  color: #1976d2;
  font-size: 13rpx;
  border-right: 1rpx solid #90caf9;
}

.header-cell.last-cell {
  border-right: none;
}

.table-row {
  display: flex;
  background-color: #ffffff;
  border-bottom: 2rpx solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row .table-cell {
  font-weight: 500;
  color: #333;
  font-size: 13rpx;
}

.total-row {
  background: linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%);
  font-weight: 600;
  border-top: 2rpx solid #ff9800;
  border-bottom: none;
}

.total-row:hover {
  background: linear-gradient(180deg, #ffe0b2 0%, #ffd180 100%);
}

.total-row .table-cell {
  color: #e65100;
  font-weight: 600;
  font-size: 14rpx;
}
</style>