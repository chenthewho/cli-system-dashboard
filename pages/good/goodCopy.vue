<template>
	<div class="container">
		<div class="cashier">
			<div class="cashier-row">
				<div class="cashier-col cashier-goods">
					<div class="card-body">
						<div class="container2">
							<div class="vertical-tab">

								<VerticalTab @update:activeTab="updateActiveTab" @delete:activeTab="deleteTab"
									:categoryList="categoryList" :activeTabId="currentTabId"/>
								<button 
								        @click="tempSpuSelect" 
								        style="letter-spacing: 4rpx;width: 55rpx; margin-left: 5px; font-weight: bold; background-color: dodgerblue; line-height: 20rpx; padding: 5rpx; border: none; color: white;"
								    >
										添加分类
								    </button>
									<!-- <u-icon name="plus-circle-fill" color="#55aaff" size="50" style="margin-left: 10px;"
									@click="tempSpuSelect"></u-icon> -->
							</div>
							<div style="flex-wrap: wrap;padding-top: 0;">
								<div v-for="(row, rowIndex) in rows" :key="rowIndex" >
									<div style="display: flex;margin-left: 15rpx;">
									<div v-for="(item, index) in row" :key="index"  >
										<div class="grid-item" style="width: 120rpx;" :style="item.inventory <= 0 ?{backgroundColor:'darkgray', backgroundSize: 'cover',backgroundPosition: 'center', backgroundImage: 'url(' + require('@/static/img/cashier/shouqing.png') + ')' }:{}" > 
											<div style="letter-spacing: 2px;text-align: left;font-weight: bold;font-size: 25px;">
												{{ item.name }}
											</div>
											<div
												style="font-weight: bold; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
												<div style="text-align: left;">
													￥: {{ item.price }}
												</div>
												<div style="text-align: right; ">
													余: {{ item.inventory }}
												</div>
											</div>
										</div>
									</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="cashier-col cashier-card">
					<div class="cashier-col cashier-card">
						<div class="card-title">
							<div
								style="display: flex; flex-flow: row; align-items: center; padding: 2px 6px; justify-content: space-between; width: 100%;">
								<p style="border-radius: 10rpx; margin-left: 0rpx;font-weight: bold;background-color: dodgerblue;color: white;padding: 5rpx;boxShadow: '0 2rpx 10rpx rgba(0, 0, 0, 0.3)';">{{currentTabName}}</p>
								<p style="margin-right: 15rpx;font-size: 10rpx;">物品数量:<text style="margin-left: 5rpx;font-size: 15rpx;font-weight: bold;">{{goodSelect.length}}</text></p>
							</div>

						</div>
						<div class="card-body">
							<div class="table-header">
								<div style="width: 60rpx; text-align: center;">名称</div>
								<div style="width: 80rpx; text-align: center;">库存</div>
								<div style="width: 80rpx; text-align: center;">单价</div>
								<div style="width: 80rpx; text-align: center;">初始重量</div>
								<div style="width: 10rpx; text-align: center;"></div>
							</div>
							<div class="table-body" v-for="(card ,index ) in goodSelect" :key="card.key"
								@click="showStep2(card,index)">
								<div class="table-row"
									:style="{ backgroundColor: card.type===0?index % 2 === 0 ? '#ffffff' : '#f9f9f9' :'#86c6d8', fontSize:'15rpx' }">
									<input style="width: 80rpx;font-size: 13rpx;text-align: center;" v-model="card.skuName" ></input>
									<input class="valueInput1"
										 type="number"
										v-model="card.quantity">
									</input>
									<input class="valueInput1" type="number"
										
										v-model="card.referenceAmount"></input>
									<input class="valueInput1" type="number" v-model="card.initWeight"
										>
									</input>
									<div style="width: 10rpx;"><u-icon name="trash" @click="deleteItem(card)"
											color="#ff0000" size="25"></u-icon></div>
								</div>
							</div>
							<div style=" display: flex;flex-direction: column;align-items: center;">
								<u-divider class="divider" style=" width: 100%; "></u-divider>
								<u-icon name="plus-circle-fill" color="#00aa00" size="28" class="icon"
									@click="addNewGood"></u-icon>
							</div>
						</div>
						<div class="card-footer">
							<div class="footer-item footer-left">
								<div class="btn btn-info-plain" @click="">清空</div>
							</div>
							<div class="footer-item footer-right">
								<div class="btn btn-primary btn-submit" @click="CommoditySave">
									确定
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>

			<u-modal title="添加商品分类" :show="tempSpuDialogVisible" @close="tempSpuDialogVisible=false"
				:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
				<div class="slot-content" style="overflow-y: auto;">
					<div class="slot-modal">
						<u--form ref="tempSpuForm" :rules="tempSpuRules" :model="tempSpu" labelPosition="left"
							labelAlign="right" label-width="80px">
							<u-form-item label="分类名称:" prop="skuName">
								<u--input placeholder="输入商品分类" maxlength="100" v-model="tempSpuSkuName"></u--input>
							</u-form-item>
						</u--form>
						<div class="footer">
							<div class="btn btn-info-plain" @click="tempSpuClose">取消</div>
							<div class="btn btn-primary" @click="tempSpuSubmit">确定</div>
						</div>
					</div>
				</div>
			</u-modal>
			<u-modal title="添加货物" :show="goodaddeddiageVisible" @close="goodaddeddiageVisible=false"
				:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
				<div class="slot-content" style="overflow-y: auto;">
					<div class="slot-modal">
						<u--form ref="tempSpuForm" :rules="tempSpuRules" :model="tempSpu" labelPosition="left"
							labelAlign="right" label-width="80px">
							<u-form-item label="货物名称:" prop="skuName">
								<u--input placeholder="输入货物名称" maxlength="100" v-model="tempSpuSkuName"></u--input>
							</u-form-item>
							<u-form-item label="单价:" prop="skuName">
								<u--input placeholder="输入单价" maxlength="100" v-model="tempSpuSkuName"></u--input>
							</u-form-item>
							<u-form-item label="库存:" prop="skuName">
								<u--input placeholder="输入库存" maxlength="100" v-model="tempSpuSkuName"></u--input>
							</u-form-item>
						</u--form>
						<div class="footer">
							<div class="btn btn-info-plain" @click="tempSpuClose">取消</div>
							<div class="btn btn-primary" @click="tempSpuSubmit">确定</div>
						</div>
					</div>
				</div>
			</u-modal>
		</div>
	</div>
</template>

<script>

	import VerticalTab from '@/components/VerticalTab.vue'
	import cashierDiscount from '../../api/cashier/cashierDiscount'
	import cashierIgnore from '../../api/cashier/cashierIgnore'
	import cashierOrder from '../../api/cashier/cashierOrder'
	import category from '../../api/goods/category'
	import member from '../../api/member/member'
	import timeCard from '../../api/member/timeCard'
	import payment from '../../api/cashier/payment'
	import staff from '../../api/security/staff'
	import stockStore from '../../api/stock/stockStore'
	import config from '../../common/config'
	import global from '../../common/const/global'

	export default {
		name: 'Cashier',
		components: {
			VerticalTab
		},
		data() {
			return {
				spuCol: 3,
				skuCol: 3,
				memberCol: 3,
				modalWidth: '500px',
				payLoading: false,

				cashier: {
					type: 0,
					discount: 10,
					discountAmount: 0, // 打折
					ignoreType: 0,
					ignoreAmount: 0, // 抹零
					preferentialAmount: 0, // 优惠金额
					collectAmount: 0, // 优惠后金额
					adjustAmount: 0, // 调整金额
					payableAmount: 0, // 应收
					remark: '',
					memberId: '',
					member: {},
					cards: [],
					source: config.platformCode
				},
				cashierActiveName: 'goods',
				loadMoreStatus: 'loadmore',
				spuSearchLoading: false,
				spuSearchParam: {
					keyword: '',
					categoryId: '',
					pageIndex: 1,
					pageSize: 30
				},




				tempSpuDialogVisible: false,
				goodaddeddiageVisible: false,
				tempSpuSkuName: '',
				quantityDialogVisible: false,
				selectCashierCardItem: {},





				hangList: [],
				categoryList: [],
				defaultCategory: null,
				currentCompanyId: "",
				serviceAccounts: [],

				defaultIgnoreType: {},

				currentTabId: '',
				currentTabName: '',



				rows: [],

				goodSelect: []
			}
		},
		onShow() {
			this.initSystem()
			uni.onWindowResize(this.windowResizeCallback)
		},
		created() {
			this.currentCompanyId = uni.getStorageSync('companyId');
			this.getCategoryList();
			// this.getServiceAccount()
			// this.getIgnoreInfo()

			// this.getPayType()
			// this.saleHangList(0)
		},
		methods: {
			windowResizeCallback(res) {
				const width = res.size.windowWidth
				this.initCol(width)
			},
			initSystem() {


				const width = window.windowWidth
				this.initCol(width)
			},
			addNewGood() {
				this.goodSelect.push({
					id: this.generateGUID(),
					key: this.goodSelect.length + 1,
					skuName: "新物品",
					referenceAmount: 1,
					initWeight:0,
					quantity: 1
				})
			},
			initCol(width) {
				this.modalWidth = global.getModalWidth()
				if (width <= 800) {
					this.spuCol = 2
					this.skuCol = 1
					this.memberCol = 1
				} else if (width <= 1000) {
					this.spuCol = 2
					this.skuCol = 1
					this.memberCol = 2
				} else if (width <= 1300) {
					this.spuCol = 3
					this.skuCol = 2
					this.memberCol = 3
				} else if (width <= 1600) {
					this.spuCol = 4
					this.skuCol = 3
					this.memberCol = 4
				} else {
					this.spuCol = 5
					this.skuCol = 4
					this.memberCol = 5
				}
			},
			deleteTab(tab) {
				let that = this;
				uni.showModal({
					title: '删除',
					content: `您确定要删除'${tab.name}'吗？`,
					success: (res) => {
						if (res.confirm) {
							that.deleteTabAction(tab.id);
						}
					}
				});
			},
			deleteTabAction(id) {
				let that = this;
				category.deleteClassfiy(id).then(res => {
					if (res.data == true) {
						that.getCategoryList();
						uni.showToast({
							icon: 'success',
							title: '删除成功',
							duration: 1000,
						});
					}
				})
			},
			updateActiveTab(tabId) {
				this.currentTabId = tabId;
				const foundTab = this.categoryList.find(tab => tab.id === tabId);
				this.currentTabName = foundTab.name;
				category.categoryListContent(tabId).then(res => {
					this.rows = [];
					for (let i = 0; i < res.data.length; i += 2) {
						this.rows.push(res.data.slice(i, i + 2));
					}
					this.goodSelect = [];
					for (let i = 0; i < res.data.length; i++) {
						this.goodSelect.push({
							id: res.data[i].id,
							key: i,
							skuName: res.data[i].name,
							referenceAmount: res.data[i].price,
							quantity: res.data[i].inventory,
							type: 0,
							initWeight: res.data[i].initWeight
						})
					}

				})
			},

			async getCategoryList() {
				let that = this;
				this.categoryList = []
				var res = await category.categoryList(this.currentCompanyId);
				res.data.forEach(x => {
					this.categoryList.push({
						id: x.id,
						name: x.className
					});
				})
				if (res.data.length > 0) {
					that.updateActiveTab(this.categoryList[0].id)
				}
				// this.spuSearchList()
			},
			deleteItem(e) {
				const indexToDelete = this.goodSelect.findIndex(item => item.id === e.id);
				// 如果找到了对应的索引，则删除该项
				if (indexToDelete !== -1) {
					this.goodSelect.splice(indexToDelete, 1);
				}
			},

			CommoditySave() {
				let that = this;
				var CommodityData = [];
				this.goodSelect.forEach(x => {
					if(x.skuName!=undefined&&x.skuName!=null&&x.skuName!=""&&x.id!=undefined&&x.id!=null){
					CommodityData.push({
						Id: x.id,
						name: x.skuName,
						price: x.referenceAmount,
						no: x.key,
						classifyId: that.currentTabId,
						inventory: x.quantity,
						initWeight: x.initWeight
					})
					}
				})
				category.CommoditySave(that.currentTabId, JSON.stringify(CommodityData)).then(res => {
					uni.showToast({
						icon: 'success',
						title: '保存成功',
						duration: 1200,
					});
					that.updateActiveTab(that.currentTabId);
				})
			},


			tempSpuSelect() {
				this.tempSpuDialogVisible = true
			},
			goodAdded() {
				this.goodaddeddiageVisible = true
			},
			tempSpuSelect() {
				this.tempSpuDialogVisible = true
			},
			tempSpuClose() {
				this.tempSpuSkuName = '';
				this.tempSpuDialogVisible = false
			},
			tempSpuSubmit() {
				let that = this;
				var data = {
					Id: '',
					CompanyId: this.currentCompanyId,
					ClassName: this.tempSpuSkuName,
					ClassId: "",
					ParentId: ""
				};
				category.CreateClassify(JSON.stringify(data)).then(res => {

					that.tempSpuDialogVisible = false
					if (res != null && res != "") {
						uni.showToast({
							icon: 'success',
							title: '添加分组成功',
							duration: 1200,
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '添加分组失败',
							duration: 1200,
						});
					}
					that.getCategoryList();
					that.currentTabId = res;
					that.updateActiveTab(res);
				})

			},

			saleReferenceClose() {
				this.quantityDialogVisible = false
				this.selectCashierCardItem = {}
			},
			saleReferenceSubmit() {
				if (Number(this.selectCashierCardItem.quantity) === 0) {
					this.cardDeleteItem(this.selectCashierCardItem)
				} else {
					this.cashier.cards.forEach(card => {
						if (this.selectCashierCardItem.key === card.key) {
							card.quantity = this.selectCashierCardItem.quantity
						}
					})
				}
				this.cashierAmount()
				this.saleReferenceClose()
			},
			addCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
				} else {
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						skuName: item.skuName,
						quantity: 1,
						adjustAmount: item.adjustAmount,
						payableAmount: item.payableAmount,
						skuNo: item.skuNo
					}
					this.cashier.cards.push(card)
				}
				this.cashierAmount()
			},
			handleClick() {
				this.goodSelect.push({
					id: this.generateGUID(),
					key: this.goodSelect.length,
					skuName: "新物品",
					referenceAmount: 0,
					quantity: 0,
					type: 1
				})
			},
			generateGUID() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000) // 10000
						.toString(16)
						.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			},
			cashierAmount() {
				cashierOrder.cashierOrderCompute(this.cashier).then(res => {
					const data = res.data
					const cards = []
					data.skus.forEach(item => {
						cards.push({
							key: item.key,
							skuId: item.skuId,
							skuName: item.skuName,
							quantity: item.quantity,
							referenceAmount: item.referenceAmount,
							adjustAmount: item.adjustAmount,
							payableAmount: item.payableAmount,
							skuNo: item.skuNo
						})
					})
					this.cashier.discountAmount = data.discountAmount
					this.cashier.ignoreAmount = data.ignoreAmount
					this.cashier.preferentialAmount = data.preferentialAmount
					this.cashier.adjustAmount = data.adjustAmount
					this.cashier.payableAmount = data.payableAmount
					this.cashier.cards = cards
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/goods.scss"
</style>