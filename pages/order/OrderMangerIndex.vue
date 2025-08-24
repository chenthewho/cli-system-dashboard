<template>
	<view style="background-color:darkgrey;">
		<view style="height: 1px; background-color: #ccc; box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.2);"></view>
		<scroll-view class="scrollArea" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<div style="height: 50rpx;" v-if="moduleList.length==0">
				<div style=" margin-top: 100rpx; text-align: center;">
					<uni-icons custom-prefix="iconfont" type="icon-zanwudingdan" size="40" color="#4c4c4c"></uni-icons>
					<div style="margin-top: 10px; color: #4c4c4c;font-weight: bold;">暂无订单</div> <!-- 添加的文字 -->
				</div>
			</div>

			<view v-for=" item in moduleList" style=" display: flex;font-weight: bold;">
				<u-checkbox-group placement="column" @change="checkboxChange(item.id)"
					style=" margin-top: 40px;margin-left: 20px;" v-if="isEdting">
					<u-checkbox class="checkBox" :key="item.id" label="" :checked="checkboxValue.includes(item.id)" />
				</u-checkbox-group>
				<view
					style="width: 98%; height: 50rpx;background-color:white;margin-left: 5rpx;margin-bottom: 5rpx;margin-top: 5rpx; border-radius: 5px;padding: 5rpx;"
					:style="{backgroundColor:item.status==2?'#f0f0f0':'white'}"
					@click="showInfo(item)">
					<view
						style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 2rpx;">
						<view style="flex: 1; text-align: left;padding-right: 5rpx;font-weight: bold;"><uni-icons
								custom-prefix="iconfont" type="icon-tubiao_guke" size="15" color="#000000"
								style="margin-right: 5rpx;"></uni-icons>{{item.customName ? item.customName : "散客"}}
								<text style="color: #31BDEC;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="item.status==5">已修改</text>
								<text style="color:#F56C6C;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="item.status==2">退单</text>
						</view>
						<view style="flex: 2;text-align: left;padding-left: 5rpx;">
							时间：{{item.createTime.replace("T"," ")}}
							<text style="color: white;background-color: #67C23A;padding: 2rpx 8rpx;margin-left: 10rpx;border-radius: 10rpx;font-size: 12rpx;font-weight: 500;" v-if="item.shareNum > 0">已发单</text>
						
						</view>
						<view style="flex: 1;text-align: right;padding-right: 5rpx;position: relative;">
						
							<!-- <uni-icons custom-prefix="iconfont"
								type="icon-xiangmujine" size="15" color="#000000"
								style="margin-right: 5rpx;"></uni-icons> -->
								实收(元): {{item.actualMoney}}
								
							</view>
					</view>
					<view
						style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
						<view style="color: #ccc; text-align: left;padding-left: 5rpx;margin-top: 5rpx;white-space: nowrap;width: 400rpx;text-overflow: ellipsis;overflow: hidden;">{{item.modulestr}}</view>
						<view
							style="text-align: right;padding-right: 5rpx;color: white;background-color: red;padding: 5rpx;margin-right: 5rpx;border-radius: 5rpx;"
							v-if="item.debt>0">下欠: {{item.debt}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view style="height: 41rpx;background-color: lightgray;position: fixed; bottom: 0;width: 100%;">
			<div class="demo-row" style="height: 80rpx;">
				<div class="demo-col col-12">

					<div style="display: flex;font-weight: bold;">
						<div style="display: flex; align-items: center;">
							<u-icon name="car-fill" size="25"></u-icon>订单数:
							<text style="margin-left: 5px;font-size: 20px;">{{ moduleList.length }}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">成交金额:
							<text style="margin-left: 5px;font-size: 20px;"> {{totalMoney.toFixed(1)}}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">当日下欠:
							<text style="margin-left: 5px;font-size: 20px;color: red;"> {{ allDebt.toFixed(1) }}</text>
						</div>
						<div style="display: flex; align-items: center;padding-left: 20rpx;">实收金额:
							<text style="margin-left: 5px;font-size: 20px;color: green;">
								{{actualMoney.toFixed(1)}}</text>
						</div>
					</div>
				</div>
			</div>

		</view>
		<u-modal title="订单详情" :show="showDetail" @close="showDetail = false" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="'500rpx'">
			<div class="slot-content" style="position: relative;">
				<div class="slot-content" style=" display: flex; flex-wrap: wrap; gap: 10px;font-weight: bold;">
					<div style="flex: 1; min-width: 200rpx;">创建时间:
						{{currentOrder.createTime ? currentOrder.createTime.replace("T", " ") : ""}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">订单号:
						{{currentOrder.accountCode ? currentOrder.accountCode : ""}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">顾客:
						{{currentOrder.customName ? currentOrder.customName : "散客"}}
					</div>
					<div style="flex: 1; min-width: 200rpx;">总计金额:
						{{currentOrder.payableAmount }}
					</div>
					<div style="flex: 1; min-width: 200rpx;">押筐抵扣:
						{{currentOrder.basketOffsetAmount }}
					</div>
					<div style="flex: 1; min-width: 200rpx;">实付金额:
						{{currentOrder.actualMoney }}
					</div>
					<div style="flex: 1; min-width: 200rpx;color: darkred;" v-if="currentOrder.debt>0">下欠:
						{{currentOrder.debt}}
					</div>
					<div style="flex: 1; min-width: 200rpx;display: flex;" >订单状态:
						<text style="color:#67C23A;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="currentOrder.status==1">正常</text>
						<text style="color: #31BDEC;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="currentOrder.status==5">已修改<text style="background-color: #31BDEC;color: white;padding: 5rpx;border-radius: 5rpx;margin-left: 10rpx;" @click="showHistoryOrder">查看历史订单</text></text>
						<text style="color:#F56C6C;font-weight: 500;margin-left: 10rpx;font-size: 13rpx;" v-if="currentOrder.status==2">退单</text>
					</div>
				</div>
				<scroll-view  scroll-y="true"
					:style="{ height: 150 + 'rpx',marginTop:'5rpx',marginBottom:'5rpx' }">
				<div class="table">
					
					<div class="table-row">
						<div class="table-header-cell">货品</div>
						<div class="table-header-cell">数量</div>
						<div class="table-header-cell">总重</div>
						<div class="table-header-cell">皮重</div>
						<div class="table-header-cell">单价</div>
						<div class="table-header-cell">小计</div>
					</div>
			
					<div class="table-row" v-for="item in currentCardInfo" v-if="item.type!=4">
						<div class="table-cell">{{item.name}}</div>
						<div class="table-cell">{{item.mount}}</div>
						<div class="table-cell">{{item.totalWeight}}</div>
						<div class="table-cell">{{item.tareWeight}}</div>
						<div class="table-cell">{{item.referenceAmount}}</div>
						<div class="table-cell">{{item.subtotal}}</div>
					</div>
					
				</div>
				</scroll-view>
				<view
					style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
					<view style="text-align: right;padding-right: 5rpx;font-weight: bold;display: flex;"><u-button v-if="currentOrder.status!=2" type="primary" style="background-color: gray;border-color: gray; color: white;font-weight: bold;"
							@click="TurnToTuigeCashier" text="改单"></u-button><u-button v-if="currentOrder.status!=2" type="primary" style="background-color: gray;border-color: gray; color: #ccc;font-weight: bold;margin-left: 20rpx;"
							@click="TuigeOrder" text="退单" ></u-button></view>
					<view v-if="currentOrder.debt>0" style="text-align: right;padding-right: 5rpx;"><u-button
							type="primary" text="整单还款" @click="openPayTypeDialogVisible"
							style="background-color: darkred;color: white;border-color: darkred;font-weight: bold;"></u-button>
					</view>
				
					<view style="text-align: right;padding-right: 5rpx;font-weight: bold;"><u-button type="primary"
							text="打印" @click="printerModel(currentOrder)"></u-button>
					</view>
				</view>
				<u-button
				icon="share-square"
					:plain="true"
					shape="circle" 
				  type="primary"
				  text="发单" 
				  @click="shareOrder()" 
				  style="position: absolute; top: 0; right: 0;width: 50rpx;">
				</u-button>
			
			</div>
		</u-modal>

		<u-modal title="整单还款" class="payment" :show="payTypeDialogVisible" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="800" @close="payTypeDialogVisible = false">
			<div class="slot-content" style="overflow-y: auto;">
				<div class="slot-modal pay-type">
					<div class="body">
						<div class="pay-amount">
							<u--form labelPosition="left" ref="payAamountForm" :labelWidth="120">
								<div class="form-row">
									<div class="right-part">
										<div class="payment-methods">
											<div :class="{'payment-item':true,'activepayment':item.select==1?true:false}"
												v-for="item , index in payWay" @click="changPayWay(index)">
												<u-icon style="margin-top: 10rpx;" :size="40" :name="item.coin"
													:color="item.color"></u-icon>
												<span class="payment-text">{{item.label}}</span>
											</div>
										</div>
									</div>
									<div class="form-container">
										<div
											style="font-weight: bold; font-size: 15rpx; display: flex; align-items: center;margin-top: 10rpx;">
											<text style="width: 80rpx;margin-left: 20rpx;">还款金额：</text>
											<input v-model="repayMount" inputmode="none"
												style="text-align: center; width: 100rpx;font-weight: bold; font-size: 20rpx; border: none; border-bottom: 1px solid black; outline: none; padding: 5rpx; margin-left: 10rpx;" />
										</div>
										<view class="mybrankmask2"
											:style="{ width: '320rpx', height: '150rpx', zIndex: 999, left: 0, bottom: 0 ,marginTop:'20rpx'}">
											<view style="padding: 5rpx;">
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(1)">1</view>
													<view class="maskListItem" @click="NumberCk2(2)">2</view>
													<view class="maskListItem" @click="NumberCk2(3)">3</view>
													<view class="maskListItem "
														style="background-color: #67C23A;color: #fff;"
														@click="Tuige2()">退格</view>
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(4)">4</view>
													<view class="maskListItem" @click="NumberCk2(5)">5</view>
													<view class="maskListItem" @click="NumberCk2(6)">6</view>
													<view class="maskListItem" @click="NumberCk2('+')"
														style="background-color: #31BDEC;font-size: 25px;color: white;">
														+</view>
													<!-- <view class="maskListItem large"
																style="background-color: #F56C6C;color: #fff;"
																@click="Clear2()">清空</view> -->
												</view>
												<view class="MymaskList">
													<view class="maskListItem" @click="NumberCk2(7)">7</view>
													<view class="maskListItem" @click="NumberCk2(8)">8</view>
													<view class="maskListItem" @click="NumberCk2(9)">9</view>
													<view class="maskListItem" @click="NumberCk2('-')"
														style="background-color: #F56C6C;font-size: 25px;color: white;">
														-</view>
												</view>
												<view class="MymaskList">
													<view class="maskListItem3" @click="NumberCk2(0)">0</view>
													<view class="maskListItem" @click="NumberCk2('.')">.</view>
													<view class="maskListItem2"></view>
												</view>
											</view>
										</view>
									</div>
								</div>
							</u--form>
						</div>
					</div>
					<div class="footer">
						<div style="display: flex;justify-content: center;">
							<div class="btn" @click="payTypeDialogVisible = false"
								style="width: 100rpx;font-weight: bolder; color: white;border: 1px solid darkgray;background: darkgray; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);">
								返回</div>
							<div class="btn" @click="repaySingle"
								style="margin-left: 20rpx; width: 100rpx;font-weight: bolder; color: white;border: 1px solid darkgreen;background: darkgreen; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);">
								确认还款</div>
						</div>
					</div>
				</div>
			</div>
		</u-modal>

	</view>

</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	import member from '../../api/member/member'
	export default {
		name: 'OrderMangerIndex',
		components: {

		},
		data() {
			return {
				list: ['今日', '昨日'],
				tabs1Current: 0,
				payTypeDialogVisible: false,
				moduleList: [],
				repayMount: 0,
				memberDialogVisible: false,
				CompanyId: "",
				single: '',
				showTimePcker: false,
				showDetail: false,
				currentOrder: {},
				currentCardInfo: [],
				canvasheight: 0,
				scrollHeight: 0,
				allDebt: 0,
				totalMoney: 0,
				actualMoney: 0,
				checkboxValue: [],
				isEdting: false,
				memberOptions: [],
				currentPayWay: 1,
				beginTime:"",
				endTime:"",
				payWay: [{
						label: "微信支付",
						coin: "weixin-fill",
						select: 1,
						color: "green",
						id: 1
					},
					{
						label: "现金",
						coin: "red-packet-fill",
						select: 0,
						color: "red",
						id: 2
					},
					{
						label: "支付宝",
						coin: "zhifubao",
						select: 0,
						color: "blue",
						id: 3
					}, {
						label: "其他",
						coin: "coupon-fill",
						select: 0,
						color: "red",
						id: 4
					}
				]
			}
		},
		// mounted() {
		// 	// 在组件挂载后设置 scrollHeight
			

		// },
		mounted() {
			this.scrollHeight = uni.getWindowInfo().windowHeight - 70;
			this.CompanyId = uni.getStorageSync('companyId'); 
			this.getTodayDateRange();
			this.refresh();
		},
		methods: {
			refresh(){
				const currentDate = this.getcurrentTime();
				this.single = currentDate;
				cashierOrder.GetAccountByCompanyIdandDateRange(this.CompanyId, this.beginTime, this.endTime).then(res => {
					this.moduleList = res.data;
					this.moduleList.forEach(item => {

						item.modulestr = "";
						if(item.status!=2){
							this.allDebt += item.debt;
						this.totalMoney += item.payableAmount;
						this.actualMoney += item.actualMoney;
						}
						var cardList = JSON.parse(item.module);
						cardList.forEach(card => {
							if (card.type === 1 || card.type === 3) {
								let modulesStr = [];
				
								if (card.type === 1 || card.type === 3) {
									modulesStr.push(card.name + "x" + card.mount);
								}
				
								item.modulestr = modulesStr.join("|");
				
				
								// item.modulestr += card.name + "x" + card.mount + " | ";
							}
				
						})
					})
					this.moduleList.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime); // 升序排序
					});
				})
			},
			getTodayDateRange() {
    // 获取当前时间（UTC+8 北京时间）
    const now = new Date();
    const beijingOffset = 8 * 60 * 60 * 1000; // 北京时区偏移（毫秒）
    const beijingTime = new Date(now.getTime() + beijingOffset);

    // 设置当天的 00:00:00 和 23:59:59（北京时间）
    const todayStart = new Date(beijingTime);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(beijingTime);
    todayEnd.setHours(23, 59, 59, 999);

    // 格式化成 "YYYY-MM-DD HH:mm:ss"
    const formatDateTime = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    this.beginTime = formatDateTime(todayStart); // 例如 "2023-11-16 00:00:00"
    this.endTime = formatDateTime(todayEnd);    // 例如 "2023-11-16 23:59:59"
},
			openPayTypeDialogVisible() {
				this.payTypeDialogVisible = true;
				this.repayMount = this.currentOrder.debt;
			},
			Tuige2() {
				let myvalue = "";
				myvalue = this.repayMount;

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				this.repayMount = myvalue;
			},
			Clear2() {
				// 根据 custominputFocusIndex 清空对应的值
				this.repayMount = '0';
			},
			NumberCk2(val) {
				let myvalue = this.repayMount;
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				this.repayMount = myvalue;
			},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
					this.payWay[i].select = 0;
				}
				this.payWay[index].select = 1;
				this.currentPayWay = this.payWay[index].id;
			},
			repaySingle() {
				var repayOrder = JSON.parse(JSON.stringify(this.currentOrder))
				repayOrder.payWay = this.currentPayWay;
				var moduleSelect = [repayOrder];

				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param = {
					customerId: repayOrder.customerId,
					repayMoney: this.repayMount,
					orderList: moduleSelect,
					operatorId: userInfo.idateChangeCompanyId,
					customerName: repayOrder.customName
				}
				member.RepayDebts(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: "还款成功",
							icon: "none",
							duration: 2000
						});
						this.payTypeDialogVisible = false;
						this.refresh();
						this.showDetail = false;
					} else {
						uni.showToast({
							title: "还款失败",
							icon: "none",
							duration: 2000
						});
					}
				})
			},
			memberChange() {
				this.showDetail = false;
				this.memberOptions = [];
				member.memberList(this.CompanyId).then(res => {
					this.memberOptions.push({
						customName: "散客",
						id: ""
					})
					this.memberOptions.push(...(res.data || []));
					this.memberDialogVisible = true
				}).finally(() => {})
			},
			orderMemberChangeMain(memberNew, order) {
				var orderNew = JSON.parse(JSON.stringify(order));
				orderNew.customerId = memberNew.id;
				orderNew.customName = memberNew.customName;
				cashierOrder.exchangMember(JSON.stringify(orderNew)).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '客户变更成功',
							icon: 'none'
						})
						this.dateChange();
						this.memberDialogVisible = false;
					}
				});
			},
			showInfo(e) {
				this.showDetail = true;
				this.currentOrder = e;
				this.currentCardInfo = JSON.parse(e.module);
				this.currentCardInfo=this.currentCardInfo.filter(item => item.type !== 4).sort((a, b) => a.type - b.type);	
			},
			dateChange(beginTime,endTime) {
				this.beginTime = beginTime;
				this.endTime = endTime;
				this.refresh();
			},
			checkboxChange(e) {
				this.checkboxValue = [e]
			},
			deleteHandle() {
				if (!this.isEdting || this.checkboxValue.length == 0) {
					return
				}
				let that = this;
				uni.showModal({
					title: '提示',
					content: '您确定要删除该订单吗？',
					success: (res) => {
						if (res.confirm) {


							var isflag = false;
							that.checkboxValue.forEach(item => {
								that.moduleList.forEach(item2 => {
									if (item2.id == item) {
										if (item2.debt > 0) {
											isflag = true;
										}
									}
								})
							})
							if (isflag) {
								uni.showToast({
									title: '下欠订单不可删除',
									icon: 'none'
								})
								return;
							}

							var order = that.moduleList.filter(x => x.id == that.checkboxValue[0])[0];
							order.companyId = this.CompanyId;
							var userInfo = uni.getStorageSync("userInfo");
							order.operatorId = userInfo.id;
							order.operatorName = userInfo.userName;
							cashierOrder.deleteOrder(JSON.stringify(order)).then(res => {
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								})
								that.getModuleListbyDate(that.single);
							}).finally(() => {
								that.checkboxValue = [];
							})
						} else if (res.cancel) {

						}
					}
				});
			},

			getLastTime() {
				const currentDate = new Date();

				// 获取前一天
				currentDate.setDate(currentDate.getDate() - 1);

				// 格式化日期
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
				const day = String(currentDate.getDate()).padStart(2, '0');

				// 拼接成 YYYY-MM-DD 格式
				const formattedDate = `${year}-${month}-${day}`;
				return formattedDate;
			},
			shareOrder() {
				cashierOrder.GetCanvasBase64ById(this.currentOrder.id).then(res=>{
					if(res.code==200){
						this.downLoadImage(res.data);
					}
				})
			},
			downLoadImage(base64){
				let that = this;
			    const bitmap = new plus.nativeObj.Bitmap("test");
			    bitmap.loadBase64Data(base64, function() {
			        const url = "_doc/" + new Date().getTime() + ".png";  // url为时间戳命名方式
			        bitmap.save(url, {
			            overwrite: true,  // 是否覆盖
			            quality: 100  // 图片清晰度
			        }, (i) => {
			             uni.saveImageToPhotosAlbum({
			                 filePath: url,
			                 success: function() {
								 that.shareImage(url);
			                     uni.showToast({
			                         title: '图片保存成功',
			                         icon: 'none'
			                     })
			                     bitmap.clear()
			                 }
			              });
			         }, (e) => {
			             uni.showToast({
			                 title: '图片保存失败',
			                 icon: 'none'
			              })
			              bitmap.clear()
			          });
			     }, (e) => {
			          uni.showToast({
			              title: '图片保存失败',
			              icon: 'none'
			          })
			          bitmap.clear()
			      });
			},
			shareImage(tempFilePath) {
				uni.share({
					provider: 'weixin',
					type: 2, // 图片类型
					scene: 'WXSceneSession', // 分享到聊天界面
					imageUrl: tempFilePath, // 只分享这张图片的地址
					success(res) {
						console.log('分享成功', res);
					},
					fail(err) {
						console.log('分享失败', err);
					}
				});
			},
			
			printerModel(order) {
				getApp().senBleLabel(order);
			},
			getcurrentTime() {
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始
				const day = String(currentDate.getDate()).padStart(2, '0');
				const hours = String(currentDate.getHours()).padStart(2, '0');
				const minutes = String(currentDate.getMinutes()).padStart(2, '0');
				const seconds = String(currentDate.getSeconds()).padStart(2, '0');

				const formattedDate = `${year}-${month}-${day} `;
				return formattedDate;
			},
			showEdit() {
				this.isEdting = !this.isEdting;
				if (this.checkboxValue.length > 0) {
					this.checkboxValue = [];
				}
			},
			TurnToTuigeCashier(){
				uni.navigateTo({
					url: '/pages/cashier/tuigeCashier?order='+JSON.stringify(this.currentOrder)
				})
			},
			TuigeOrder(){
				let that = this;
				that.showDetail = false;
				uni.showModal({
					title: '提示',
					content: '您确定要退单吗？',
					success: (res) => {
						if (res.confirm) {
							that.TuigeOrderAction();		
						}}}
					)
			},
			TuigeOrderAction(){
				var userInfo = uni.getStorageSync("userInfo");
				let param = {
					type:10,
					companyId:this.CompanyId,
					operatorId:userInfo.id,
					operatorName:userInfo.userName,
					content:this.currentOrder.id
				}
				cashierOrder.TuigeAccount(JSON.stringify(param)).then(res=>{
					if(res.code==200){
						uni.showToast({
							title: '退单成功',
							icon: 'none'
						})
						this.showDetail = false;
						this.refresh();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.scrollArea {
		background-color: darkgrey;
		height: calc(100vh - 60rpx);
	}

	.table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		margin: 20px 0;
		font-weight: bold;
	}

	.table-header {
		display: table-header-group;
		background-color: #f2f2f2;
	}

	.table-row {
		display: table-row;
	}

	.table-cell {
		display: table-cell;
		border: 1px solid #dddddd;
		padding: 8px;
		text-align: left;
	}

	.table-header-cell {
		display: table-cell;
		border: 1px solid #000000;
		padding: 8px;
		text-align: center;
		font-weight: bold;
		background-color: #dddddd;
	}

	.demo-row {
		display: flex;
		/* 使用 flexbox 布局 */
		flex-wrap: wrap;
		/* 允许换行 */
	}

	.demo-col {
		padding: 10px;
		/* 添加内边距 */
	}

	/* 根据需要设置列的宽度 */
	.col-12 {
		flex: 0 0 60%;
		/* 占据 50% 的宽度 */
	}

	.col-6 {
		flex: 0 0 15%;
		/* 占据 25% 的宽度 */
	}

	.grid-member-container {
		display: flex;
		flex-wrap: wrap;
		/* 允许换行 */
		margin: 5px;
		/* 负边距用于消除间距 */
	}

	.grid-member-item {
		height: 50rpx;
		width: 30%;
		/* 每个格子占据 30% 的宽度 */
		box-sizing: border-box;
		/* 包含内边距和边框 */
		padding: 5rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 圆角 */
		/* 左右对齐 */
		align-items: center;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.row {
		display: flex;
		/* 使用 Flexbox 布局 */
		justify-content: space-between;
		/* 在行内均匀分配空间 */
		margin-bottom: 5px;
		/* 行间距 */
	}

	.member-btn {
		padding: 5rpx 10rpx;
		/* 按钮内边距 */
		/* 按钮背景颜色 */
		color: green;
		/* 按钮文字颜色 */
		border: none;
		/* 去掉边框 */
		border-radius: 3rpx;
		/* 圆角 */
		cursor: pointer;
		/* 鼠标悬停时显示手型 */
	}

	.grid-member-item2 {
		height: 50rpx;
		flex: 1 0 90%;
		/* 每个格子占据 30% 的宽度 */
		box-sizing: border-box;
		/* 包含内边距和边框 */
		padding: 5rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 圆角 */
		display: flex;
		/* 使用 flex 布局 */
		justify-content: space-between;
		/* 左右对齐 */
		align-items: center;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.payment-methods {
		display: flex;
		flex-direction: column;
		/* 垂直排列每个支付方式 */
	}

	.payment-item {
		padding: 10rpx;
		padding-right: 20rpx;
		display: flex;
		/* 水平排列图标和文字 */
		align-items: center;
		/* 垂直居中对齐 */
		margin-bottom: 10px;
		/* 每个支付方式之间的间距 */
	}

	.payment-text {
		margin-left: 8px;
		/* 图标和文字之间的间距 */
	}

	.pay-amount {
		display: flex;
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
	}

	.form-row {
		display: flex;
		width: 100%;
		/* 使其占满父容器的宽度 */
		margin-left: 20px;
	}

	.left-part {
		flex: 1;
		/* 左侧部分占据剩余空间 */
	}

	.right-part {
		display: flex;
		align-items: center;
		/* 垂直居中 */
	}


	.mybrankmask2 .MymaskList {
		display: flex;
		width: 100%;
		height: 30rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem {
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #a8a8a8;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem2 {
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #ffffff;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem3 {
		width: 48%;
		height: 30rpx;
		color: #ffffff;
		background-color: #a8a8a8;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
	}

	/* 新增样式 */
	.mybrankmask2 .MymaskList .large {
		height: 100rpx;
		/* 设置更高的高度 */
		line-height: 100rpx;
		/* 使文本垂直居中 */
		z-index: 5;
	}

	.activepayment {
		background-color: #31BDEC;
		border-radius: 10rpx;
	}
</style>