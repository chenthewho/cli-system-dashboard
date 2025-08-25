<template>
	<div>
		<default-header ref="headerInfo" theme="light" @showlastOrder="showLastOrder" @showHangList="saleHangList"
			:lastOrder="lastOrder"></default-header>
		<div class="container">
			<div class="cashier" @click="closeKeyBoard">
				<div class="cashier-row">
					<div class="cashier-col cashier-goods">
						<div class="card-body">
							<div class="container2" style="position: relative;">
								<div class="vertical-tab">
									<VerticalTab @update:activeTab="updateActiveTab" :categoryList="categoryList"
										:activeTabId="currentTabId" />
								</div>
								<div style="flex-wrap: wrap;padding-top: 0;">
									<scroll-view class="scrollArea" scroll-y="true"
										:style="{ height: windowHeight-70 + 'px'}">

										<div v-for="(row, rowIndex) in rows" :key="rowIndex">
											<div style="display: flex;margin-left: 15rpx;">
												<div v-for="(item, index) in row" :key="index">
													<div :id="'grid-item-'+item.id"
														:class="['grid-item', tabActive(item) ? 'grid-item-active' : null]"
														style="width: 120rpx;" @click="handleClick(item,item.id)"
														:style="!item.outPutPurchaseInventories || item.outPutPurchaseInventories.length===0 ?{ color:'#aa0000' }:{}">
														<div
															style="text-align: left;font-weight: bold;font-size: 25px;letter-spacing: 2px;display: flex;">
															{{ item.name }}
														</div>
														<!-- 														<div v-if="commodityType===1"
															style="font-size: 15px;font-weight: bold; display: flex;flex-direction:column; text-align: left;color: #888888;">
															<div>{{currentTabName}}
															</div>
														</div> -->
														<div
															style="font-size: 15px;margin-top: 4px;font-weight: bold; display: flex;flex-direction:column; text-align: left">

															<div
																style="text-align: left;color: rgba(0, 0, 0, 0.2);display: flex;">
																<div v-if="commodityType===1"
																	style="text-align: left;color: dodgerblue;margin-right: 5px;border: 1px solid dodgerblue;">
																	代
																</div>
																<div v-if="commodityType===2"
																	style="text-align: left;color: #792292;margin-right: 5px;border: 1px solid #792292;">
																	自
																</div>
																<div v-if="item.saleWay==1"
																	style="text-align: left;color: #00aa00;margin-right: 5px;border: 1px solid #00aa00;">
																	非定</div>
																<div v-if="item.saleWay==2"
																	style="text-align: left;color: #55aaff;margin-right: 5px;border: 1px solid #55aaff;">
																	定{{item.initWeight?item.initWeight:''}}</div>
																<div v-if="item.saleWay==3"
																	style="text-align: left;color: #dc9300;margin-right: 5px;border: 1px solid #dc9300;">
																	拆包</div>
																<div v-if="item.saleWay==4"
																	style="text-align: left;color: #55aaff;margin-right: 5px;border: 1px solid #55aaff;">
																	散</div>
															</div>

															<div style="margin-top: 5px;display: flex;"
															:style="!item.outPutPurchaseInventories || item.outPutPurchaseInventories.length===0 ?{ color:'#aa0000' }:{}"
															>
																余: <div v-for="item2 in item.outPutPurchaseInventories"
																	style="margin-left: 2px;margin-right: 2px;display: flex;">
																	{{item2.mount}}{{item2.specName}}
																	<div style="margin-left: 2px;margin-right: 2px;">|
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</scroll-view>
								</div>
								<!--模糊查询字体列(词云列)-->
								<div class="vertical-tab2" v-if="rows.length>0"
									:style="{ height: windowHeight-80 + 'px',position:'absolute',right:'5px' }">
									<div class="key-word" :class="{ 'key-word-active': currentKeyWord === item }"
										v-for="item in GoodkeyWord" @click="clickKeyWord(item)">
										<span v-for="char in item">{{ char }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="step1">
						<div class="cashier-col cashier-card">
							<div class="card-title">
								<div style="display: flex; flex-flow: row; align-items: center; padding: 2px 6px;">
									<div @click="memberChange('XiaDan')" :style="{
										                borderRadius: '5px',
														fontSize:'20px',
										                boxShadow: '0 0 5rpx rgba(0, 0, 0, 0.3)',
										                color:  'white',
										                backgroundColor: currentMember.debts > 0 ? 'darkred' : 'green',
										                height: '100%',
										                marginLeft: '-4rpx',
										                paddingLeft: '20rpx',
										                paddingRight: '20rpx',
										                paddingTop: '10rpx',
														fontWeight:'bold',
														letterSpacing: '2rpx',
										                paddingBottom: '10rpx',
														display:'flex'
										            }">
										{{currentMember.customName?currentMember.customName : '散客'}} <text
											v-if="currentMember.debts > 0"
											style="font-size: 12px;margin-left: 10rpx; display: flex;">|欠:{{currentMember.debts}}</text>
									</div>
								</div>
								<div style="display: flex;">
									
									<!-- <div class="btn" @click="memberChange('ShouKuang')"
										style="margin-right: 10rpx;  height:20rpx; bolder; color: white;border: 1px solid dodgerblue;background: dodgerblue; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);">
										<uni-icons custom-prefix="iconfont" type="icon-basket" size="15" color="#ffffff"
											style="margin-right: 5rpx;"></uni-icons>收筐
									</div> -->
									<!-- <div class="btn" @click="addTemplateGood"
										style="height:20rpx;color: white;background-color: dodgerblue;margin-right: 10px;">
										<uni-icons custom-prefix="iconfont" type="icon-linshi" size="30"
											color="#ffffff"></uni-icons>临时物品
									</div> -->
								</div>
							</div>
							<!-- <u-empty class="card-body-empty" v-if="cashier.cards.length===0"
					icon="../../static/img/empty/empty-card.png"></u-empty> -->
							<div class="card-body">
								<div class="table-header">
									<div style="width: 100rpx;text-align: center;" @click="memberChange('XiaDan')">名称
									</div>
									<div style="width: 40rpx;text-align: center;">数量</div>
									<div style="width: 40rpx;text-align: center;">单价</div>
									<div style="width: 100rpx;text-align: center;">重量</div>
									<!-- <div style="width: 50rpx;text-align: center;">皮重</div> -->
									<div style="width: 50rpx;text-align: center;">小计</div>
									<div style="width: 10rpx;"></div>
								</div>
								<div v-if="goodSelect.length>0" class="table-body" v-for="(card ,index ) in goodSelect"
									:key="card.key" @click="showStep2(card,index)">
									<div class="table-row"
										:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#e7e7e7' }">
										<div
											style="width: 100rpx;text-align: center;font-size: 15rpx;font-weight: bold;display: flex;margin-left: 3rpx;">
											{{card.skuName}}
											<div v-if="card.extralModel&&card.extralModel.id!=''&&card.extralModel.quantity>0"
												style="border-radius: 3rpx; margin-left: 3rpx; background-color: orange;font-size: 10rpx;height: 10rpx;padding: 1rpx;color: white;">
												{{card.extralModel.name}}
											</div>
										</div>
										<div
											style="width: 40rpx;justify-content: center; font-size: 15rpx;font-weight: bold;display: flex;">
											{{card.quantity}}
											<!-- 	<input type="number"    v-model=""  id="input-id"
										placeholder="" /> -->
										</div>
										<div
											style="width: 40rpx;text-align: center;font-size: 15rpx;font-weight: bold;">
											{{card.referenceAmount}}
										</div>
										<div
											style="width: 100rpx;text-align: center;font-size: 15rpx;font-weight: bold;">
											{{card.allweight-card.carweight}}({{card.allweight}}-{{card.carweight}})
										</div>
										<div
											style="width: 50rpx;text-align: center;font-size: 15rpx;font-weight: bold;">
											{{card.money2}}
										</div>
										<div style="width: 10rpx;" @click.stop="deleteItem(card)"><u-icon name="trash"
												color="#ff0000" size="26"></u-icon></div>
									</div>
								</div>
								<div v-if="goodSelect.length == 0" style=" margin-top: 30%; text-align: center;">
									<uni-icons custom-prefix="iconfont" type="icon-kongliebiao" size="80"
										color="#969696" style="margin-right: 5rpx;"></uni-icons>
									<div style="margin-top: 10px; color: #969696;">没有选中物品</div> <!-- 添加的文字 -->
								</div>
							</div>
							<!-- <div class="card-sumarry" v-if="extraModel.length>0"
								style="height: 30rpx;background-color: #F56C6C; border-radius: 5px;box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.2);">
								<div class="detail-list">
									<div class="detail-item payable"
										style="display: flex; justify-content: space-between; align-items: center;">
										<div class="label"
											style="display: flex; align-items: center;width: 25%;font-weight: bold;">
											附加：{{extraModel[0].name}}
										</div>
										<div class="label"
											style="display: flex; align-items: center;width: 25%;font-weight: bold;">
											数量：<input v-model="extraModel[0].quantity" type="number"
												@blur="blurExtralModel1"
												style="height: 20rpx;padding-left: 5rpx;margin-left: 5px;width: 50%;border: 1.5px solid #000000;text-align: center;font-size: 12rpx;background-color: darkgray;" />
										</div>
										<div class="label"
											style="display: flex; align-items: center;width: 20%;margin-left: 5%;font-weight: bold;">
											<span>单价：{{extraModel[0].amount}}</span>
										</div>
										<div class="label"
											style="display: flex; align-items: center;width: 25%;font-weight: bold;">
											<span>小计：</span><input v-model="extraModel[0].money" type="number"
												style="height: 20rpx; margin-left: 5px;width: 50%;border: 1.5px solid #000000;padding-left: 5rpx;text-align: center;font-size: 12rpx;background-color: darkgray;" />
										</div>
									</div>
								</div>
							</div> -->
							<div class="card-sumarry">
								<div class="detail-list">
									<div class="detail-item payable" style="font-weight: bold;">
										<div>总计金额</div>
										<div class="amount">￥
											<span>{{ payAmount.total}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="card-footer">
								<!-- <div class="footer-item footer-left">
									<div class="btn" @click="resetAction()"
										style="font-weight: bold;  box-shadow: 0 0 5rpx rgba(0, 0, 0,0.3);">清空</div>
								</div> -->
								<div style="display: flex;font-weight: bold;margin-right: 20rpx;margin-left: 20rpx;cursor: pointer;" @click="showShippingModal">
										<uni-icons custom-prefix="iconfont" type="icon-ehl_sanlunche" size="30"
											color="#00aaff"
											style="margin-right: 5rpx;margin-left: 5rpx;margin-top: 3px;"></uni-icons>
										<div style="margin-top: 5rpx;color:#00aaff ;">运费{{shippingFee > 0 ? '：' + shippingFee + '元' : ''}}</div>
									</div>
								<div class="footer-item footer-right">
									<div class="btn btn-primary-plain btn-submit"
										style=" font-weight: bold;  box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);"
										@click="hangOrder">
										挂单
									</div>
									<div class="btn btn-primary btn-submit"
										style="font-weight: bold;   box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);"
										@click="orderCreate">
										结账
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="!step1" class="cashier-col cashier-card">
						<div class="cashier-col cashier-card">
							<div class="card-title">
								<div
									style=" display: flex; flex-flow: row; align-items: center; padding: 2px 6px;font-weight: bold;">
									<u-icon @click="showStep1" name="arrow-left" color="#2979ff" size="25"></u-icon>
									<div @click="showStep1">返回</div>
									<div style="font-size: 15rpx;margin-left: 110rpx;text-align: center;">
										{{editingCard.skuName}}
									</div>
									<u-icon name="edit-pen" color="#969696" size="30"
										style="right: 10rpx;position: fixed;"
										@click="showAllweightStr =!showAllweightStr"></u-icon>

								</div>
							</div>
							<!--非定装输入-->
							<div class="card-body" v-if="editingCard.saleWay===1">
								<div
									style="padding: 10rpx;display: flex; justify-content: space-between; align-items: center;">


									<div :class="{'custom-input': true, 'input-focused': custominputFocused3}"
										@click="custominputFocusedMethod(3)">
										总重
										<div style="display: flex;">
											<input class="step1-input" v-model="editingCard.allweight"
												inputmode="none"></input>
											<span class="currency-label">斤</span>
										</div>
									</div>

									<div :class="{'custom-input': true, 'input-focused': custominputFocused}"
										@click="custominputFocusedMethod(1)">
										数量
										<div style="display: flex;">
											<input class="step1-input" ref="myInput1" inputmode="none"
												v-model="editingCard.quantity"></input>
											<span class="currency-label">件</span>
										</div>
									</div>
								</div>

								<div v-if="showAllweightStr" style="font-size: 18rpx; color:white; font-weight: bold; padding-left: 5rpx; line-height: 20rpx; 
								            background-color: orange; width: 90%; margin-left: 5%; border-radius: 5rpx; 
								            word-break: break-all; /* 或者使用 break-word */
								            white-space: normal; /* 允许换行 */
								            ">
									总重：{{ this.editingCard.allweightSrt }}
								</div>
								<div
									style="padding: 10rpx;display: flex; justify-content: space-between; align-items: center;">

									<div :class="{'custom-input': true, 'input-focused': custominputFocused4}"
										@click="custominputFocusedMethod(4)">
										皮重
										<div style="display: flex;">
											<input class="step1-input" v-model="editingCard.carweight"
												inputmode="none"></input>
											<span class="currency-label">斤</span>
										</div>
									</div>

									<div :class="{'custom-input': true, 'input-focused': custominputFocused2}"
										@click="custominputFocusedMethod(2)">
										单价
										<div style="display: flex;">
											<input class="step1-input" v-model="editingCard.referenceAmount"
												inputmode="none"></input>
											<span class="currency-label">元</span>
										</div>
									</div>

								</div>
								<!-- 押筐-->
								<div  v-if="showStep2"
									style="display: flex; align-items: center;padding: 10rpx;">
									<select-lay :zindex="1211" :name="editingCard.extralModel.name" :value="editingCard.extralModel.id"
											direction="up"
											placeholder="请选择项目" :options="editCardExtralModel"
											@selectitem="editCardExtraModelSelct" slabel="name">
										</select-lay>
								</div>
							</div>
							<!--定装输入-->
							<div class="card-body"
								v-if="editingCard.saleWay===2||editingCard.saleWay===3||editingCard.saleWay===4">
								<div
									style="padding: 10rpx;display: flex; justify-content: space-between; align-items: center;">

									<div :class="{'custom-input': true, 'input-focused': custominputFocused}"
										@click="custominputFocusedMethod(1)">
										数量
										<div style="display: flex;">
											<input class="step1-input" ref="myInput1" inputmode="none"
												v-model="editingCard.quantity"></input>
											<span
												class="currency-label">{{editingCard.commoditySpec?editingCard.commoditySpec.specName:""}}</span>
										</div>
									</div>

									<div :class="{'custom-input': true, 'input-focused': custominputFocused2}"
										@click="custominputFocusedMethod(2)">
										单价
										<div style="display: flex;">
											<input class="step1-input" v-model="editingCard.referenceAmount"
												inputmode="none"></input>
											<span class="currency-label">元</span>
										</div>
									</div>

								</div>
							</div>
							<view class="mybrankmask"
								:style="{ width: '340rpx', height: '200rpx', backgroundColor: '#ffffff', zIndex: 999, left: 0, bottom: 0 }">
								<view style="padding: 5rpx;">
									<view class="MymaskList">
										<view class="maskListItem" @click="NumberCk(1)">1</view>
										<view class="maskListItem" @click="NumberCk(2)">2</view>
										<view class="maskListItem" @click="NumberCk(3)">3</view>
										<view class="maskListItem" @click="Tuige1()"><uni-icons custom-prefix="iconfont"
												type="icon-tuige" size="30" color="#ffffff"
												style="margin-right: 5rpx;"></uni-icons></view>

									</view>
									<view class="MymaskList">
										<view class="maskListItem" @click="NumberCk(4)">4</view>
										<view class="maskListItem" @click="NumberCk(5)">5</view>
										<view class="maskListItem" @click="NumberCk(6)">6</view>

										<view class="maskListItem" @click="NumberCk('+')">+</view>
										<!-- <view class="maskListItem" style="background-color: #F56C6C;color: #fff;"
											@click="Clear1()">清空</view> -->
									</view>
									<view class="MymaskList">
										<view class="maskListItem" @click="NumberCk(7)">7</view>
										<view class="maskListItem" @click="NumberCk(8)">8</view>
										<view class="maskListItem" @click="NumberCk(9)">9</view>
										<view class="maskListItem" @click="NumberCk('-')">-</view>
									</view>
									<view class="MymaskList">
										<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
										<view class="maskListItem" @click="NumberCk('.')">.</view>
										<view class="maskListItem" style="background-color: #31BDEC;color: #fff;"
											@click="showStep1()">确定</view>
									</view>
								</view>
							</view>
						</div>
					</div>
				</div>
				<u-modal title="添加新顾客" class="payment" :show="customerDialogVisibleAdd" :closeOnClickOverlay="false"
					:showConfirmButton="false" :width="700" @close="customerDialogVisibleAdd = false">
					<div class="slot-content" style="overflow-y: auto;">
						<uni-section title="表单校验" type="line">
							<view class="example" style="font-size: 15rpx;">
								<!-- 基础表单校验 -->
								<view class="input-container" style="margin-top: 10px;">
									<text class="label" style="width: 20%;">客户名称：</text>
									<input class="input-field" type="text" :adjust-position="false" placeholder=" "
										style="height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
										v-model="AddedCustomerFormData.name" />
								</view>
								<view class="input-container" style="margin-top: 10px;">
									<text class="label" style="width: 20%;">联系方式：</text>
									<input class="input-field" type="text" :adjust-position="false" placeholder=" "
										style="height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
										v-model="AddedCustomerFormData.phone" />
								</view>
								<view class="input-container" style="margin-top: 10px;">
									<text class="label" style="width: 20%;">车牌：</text>
									<input class="input-field" type="text" placeholder=" "
										style="	height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
										v-model="AddedCustomerFormData.carNum" />
								</view>
								<view class="input-container" style="margin-top: 10px;">
									<text class="label" style="width: 20%;">地址：</text>
									<input class="input-field" type="text" placeholder=" "
										style="	height: 40rpx;width: 80%;border-radius: 5rpx;background-color: lightgray;font-size: 15rpx;padding-left: 10px;font-weight: bold;"
										v-model="AddedCustomerFormData.address" />
								</view>
								<view style="display: flex;">
									<button @click="customerDialogVisibleAdd = false;memberDialogVisible = true;"
										style="width: 30%;margin-top: 20px;background-color: lightgrey; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);font-weight: bold;">返回</button>
									<button type="primary" @click="submitAddCustomer()"
										style="width: 30%;margin-top: 20px; box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);font-weight: bold;">添加</button>
								</view>
							</view>
						</uni-section>
					</div>
				</u-modal>
				<!--客户中心-->
				<u-modal title="" :show="memberDialogVisible" @close="memberDialogVisible=false"
					:closeOnClickOverlay="true" :showConfirmButton="false" width="900px">
					<div class="slot-content">
						<div class="search-member">

							<view class="search-member-right">
								<div style="width: 200rpx;">
									<u--input placeholder="搜索顾客名称" border="surround" v-model="memberSearchKeyword"
										clearable :adjustPosition="false"
										@change="memberSearch(memberSearchKeyword)"></u--input>
								</div>
								<div style="width: 50rpx;">
									<u-button type="primary" text="重置" @click="memberSearchKeyword=''"
										style="height: 20rpx;border-radius: 5rpx;margin-left: 10rpx;background-color: #959595;color: white;border-color:#959595;"></u-button>
								</div>
								<div style="width: 50rpx;z-index: 999;" v-if="memberStyle==='XiaDan'">
									<u-button type="primary" icon="plus-circle"
										@click="memberDialogVisible = false;customerDialogVisibleAdd = true;"
										text="添加顾客"
										style="height: 20rpx;border-radius: 5rpx;margin-left: 30rpx;width: 100px;"></u-button>
								</div>
							</view>
							<view class="search-member-left">
								<view class="search-member-select">
									<text class="search-member-select-text" @click="currentSelctCustomerType=1"
										:class="currentSelctCustomerType==1? 'search-member-select-text-active':null">收银</text>
									<text class="search-member-select-text" @click="currentSelctCustomerType=2"
										:class="currentSelctCustomerType==2?'search-member-select-text-active':null">收筐</text>
									<!-- <text class="search-member-select-text" @click="currentSelctCustomerType=3"
										:class="currentSelctCustomerType==3?'search-member-select-text-active':null">还款</text> -->
								</view>
							</view>
						</div>
						<scroll-view class="scrollArea" scroll-y="true" :style="{ height: windowHeight-200 + 'px' }">
							<view class="grid-member-container">
								<view class="grid-member-item" v-for="(item, index) in memberSearchOptions" :key="index"
									style=" box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" @click="changeMember(item)">

									<!-- 第一行 -->
									<view class="row" style="display: flex;">
										<text class="member-name" :style="{
										                color: item.debts ? '#000000' : '#000000',
										                fontSize: '18rpx',
										                fontWeight: 'bold'
										            }">{{ item.customName }}</text>
										<view style=" display: flex;align-items: center;font-size: 8rpx;"
											v-if="item.id&&item.id!=''">
											<text class="member-btn" style="color: gray;"></text>
										</view>
									</view>

									<!-- 第二行 -->
									<view class="row" style="margin-top: 5rpx;">
										<!-- <text class="member-name" style="color: #aa0000;"
										v-if="item.debts>0">欠款:{{ item.debts }}</text>-->
										<text class="member-name" style="color: black;"
											v-if="memberStyle==='ShouKuang' ">欠筐:{{ item.owebasket }}</text>
										<!-- 	<text class="member-name" style="color: black;display: flex;"
										v-if="item.orderNum!=undefined">{{'单数:'+ item.orderNum }}</text> -->
									</view>
								</view>

							</view>
						</scroll-view>
					</div>
				</u-modal>
				<u-modal title="挂单中心" :show="hangListVisible" @close="hangListVisible=false" :closeOnClickOverlay="true"
					:showConfirmButton="false" :width="'600rpx'">
					<div style="display: flex; height: 350rpx; border: 1px solid #ccc;width: 600rpx;">
						<!-- 左边订单列表 -->
						<div class="slot-content"
							style="flex: 1; overflow-y: auto; border-right: 1px solid #eee; padding: 10rpx;height: 325rpx;">
							<view class="grid-member-container">
								<view v-for="(group, index) in hangList" :key="group.date" class="group-container">
									<view class="group-title"
										style="font-weight: bold; margin-bottom: 10rpx;font-size: 20rpx;">
										{{ group.date }}
									</view>
									<view class="grid-member-item2" v-for="(item, idx) in group.items"
										:key="item.key || idx" @click="selectGDorder(item)" :style="{ fontWeight: 'bold', cursor: 'pointer', 
										backgroundColor: orderGDSelect && orderGDSelect.id === item.id ? '#00aaff' : 'transparent',
										color: orderGDSelect && orderGDSelect.id === item.id ? '#ffffff' : 'black',
										 padding: '8rpx', marginBottom: '5rpx', borderRadius: '4rpx' }">
										<text>{{ item.key }}</text>
										<div
											style="padding: 2rpx; font-size: 10rpx; display: flex; justify-content: space-between; align-items: center;">
											<div>{{ item.createTime.replace('T', ' ') }}</div>
											<div>{{ item.customName }}</div>
										</div>
										<div
											style="margin-top: 5rpx; font-size: 10rpx;white-space: nowrap;width: 250rpx;text-overflow: ellipsis;overflow: hidden;">
											{{ item.modelInfo }}
										</div>
									</view>
								</view>
							</view>
						</div>

						<!-- 右边订单详情 -->
						<div class="order-detail" style="flex: 1;  position: relative;">
							<template v-if="orderGDSelect">
								<view class="table" style=" border: 1px solid #ccc;">
									<!-- 表头 -->
									<view class="table-row header"
										style=" background-color: #cecece;font-weight: bold;">
										<view class="table-cell2">名称</view>
										<view class="table-cell2">单价</view>
										<view class="table-cell2">总重</view>
										<view class="table-cell2">皮重</view>
										<view class="table-cell2">小计</view>
									</view>

									<!-- 表格内容示例 -->
									<view class="table-row" v-for="(item, index) in orderGDSelect.modelList"
										:key="index" style="overflow-y: auto; ">
										<view class="table-cell2">{{ item.name }}</view>
										<view class="table-cell2">{{ item.referenceAmount }}</view>
										<view class="table-cell2">{{ item.totalWeight }}</view>
										<view class="table-cell2">{{ item.tareWeight }}</view>
										<view class="table-cell2">{{ item.subtotal }}</view>
									</view>
								</view>
							</template>
							<div
								style="position: absolute; bottom: 0; height: 35rpx; border-top: 1px solid #ccc; width: 100%; display: flex;">
								<button @click="deleteGDorder(orderGDSelect)"
									style="width: 70rpx;font-weight: bold; color: #ffffff;background: gainsboro; height: 25rpx; line-height: 25rpx; font-size: 12rpx; margin-top: 5rpx;">删除</button>
								<button
									style="width: 70rpx;font-weight: bold;color: #ffffff;background: orange; height: 25rpx; line-height: 25rpx; font-size: 12rpx; margin-top: 5rpx;"
									@click="printerGDModel(orderGDSelect)">打印挂单</button>
								<button @click="hangOrderParse(orderGDSelect)"
									style="width: 70rpx;font-weight: bold;color: #ffffff;background: #00aaff; height: 25rpx; line-height: 25rpx; font-size: 12rpx; margin-top: 5rpx;">取挂单</button>
							</div>
						</div>
					</div>
				</u-modal>
				<!-- 				<u-modal title="添加临时商品" :show="tempSpuDialogVisible" @close="tempSpuDialogVisible=false"
					:closeOnClickOverlay="true" :showConfirmButton="false" :width="modalWidth">
					<div class="slot-content" style="overflow-y: auto;">
						<div class="slot-modal">
							<u--form ref="tempSpuForm" :rules="tempSpuRules" :model="tempSpu" labelPosition="left"
								labelAlign="right" label-width="80px">
								<u-form-item label="商品名称:" prop="skuName">
									<u--input placeholder="输入商品名称" maxlength="100" v-model="tempSpu.skuName"></u--input>
								</u-form-item>
								<u-form-item label="商品单价:" prop="adjustAmount">
									<u--input placeholder="输入商品单价" type="number"
										v-model="tempSpu.adjustAmount"></u--input>
								</u-form-item>
								<u-form-item label="商品数量:" prop="quantity">
									<u--input placeholder="输入商品数量" type="number" v-model="tempSpu.quantity"></u--input>
								</u-form-item>
							</u--form>
							<div class="footer">
								<div class="btn btn-info-plain" @click="tempSpuClose">取消</div>
								<div class="btn btn-primary" @click="tempSpuSubmit">确定</div>
							</div>
						</div>
					</div>
				</u-modal> -->

				<!--收银弹窗-->

				<u-modal title="" class="modern-payment-modal" :show="payTypeDialogVisible" :closeOnClickOverlay="true"
					:showConfirmButton="false" :width="800" @close="payTypeDialogVisible = false">
					<div class="payment-modal-container">
						<!-- 关闭按钮 -->
						<div class="modal-close-btn" @click="payTypeDialogVisible = false">
							<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="24" color="#666"></uni-icons>
						</div>
						

						
						<div class="payment-content-grid">
							<!-- 左侧：金额输入和支付方式 -->
							<div class="left-input-section">
								<!-- 金额输入区域 -->
								<div class="amount-inputs-section">
									<!-- <div class="section-title">金额设置</div> -->
									<div class="amount-inputs">
										<div class="input-row" :class="{'active': selectInput_pay === 1}" @click="editingPaymentClick(1)">
											<label class="input-label">应付金额</label>
											<input v-model="payAmount.total" inputmode="none" class="amount-input" readonly>
										</div>
										
										<div class="input-row discount-row" :class="{'active': selectInput_pay === 9}" @click="editingPaymentClick(9)">
											<div class="discount-toggle">
												<button class="discount-btn" :class="{'active': accountDiscount}" @click="setDicountAmount">优惠</button>
												<button class="discount-btn" :class="{'active': !accountDiscount}" @click="setOverchargeAmount">多收</button>
											</div>
											<input v-model="discountAmount" inputmode="none" class="amount-input">
										</div>
										
										<div class="input-row" :class="{'active': selectInput_pay === 4}" @click="editingPaymentClick(4)">
											<label class="input-label">收筐抵扣</label>
											<input v-model="payAmount.BasketOffsetAmount" inputmode="none" class="amount-input">
											<button class="collect-btn" @click="collectBasketoffestMoney">收筐</button>
										</div>
										
										<div class="input-row" :class="{'active': selectInput_pay === 3}" @click="editingPaymentClick(3)">
											<label class="input-label">下欠金额</label>
											<input v-model="payAmount.debt" inputmode="none" class="amount-input">
										</div>
										
										<div class="input-row" :class="{'active': selectInput_pay === 2}" @click="editingPaymentClick(2)">
											<label class="input-label">实付金额</label>
											<input v-model="payAmount.actual" inputmode="none" class="amount-input">
										</div>
									</div>
								</div>
								
								<!-- 支付方式区域 -->
								<div class="payment-methods-section">
									<div class="section-title">支付方式</div>
									<div class="payment-methods-grid" v-if="AccountExpense">
										<div class="payment-method-card" 
											:class="{'active': selectInput_pay === 5}"
											@click="editingPaymentClick(5)">
											<div class="payment-method-card-content">
												<div class="payment-icon">
													<u-icon name="weixin-fill" :size="24" color="#07c160"></u-icon>
												</div>
												<div class="payment-label">微信</div>
											</div>
											<div class="payment-amount">{{AccountExpense.wxpayAmount}}</div>
										</div>
										
										<div class="payment-method-card"
											:class="{'active': selectInput_pay === 6}"
											@click="editingPaymentClick(6)">
											<div class="payment-method-card-content">
												<div class="payment-icon">
													<u-icon name="zhifubao" :size="24" color="#1677ff"></u-icon>
												</div>
												<div class="payment-label">支付宝</div>
											</div>
											<div class="payment-amount">{{AccountExpense.alipayAmount}}</div>
										</div>
										
										<div class="payment-method-card"
											:class="{'active': selectInput_pay === 7}"
											@click="editingPaymentClick(7)">
											<div class="payment-method-card-content">
												<div class="payment-icon">
													<u-icon name="red-packet-fill" :size="24" color="#ff4757"></u-icon>
												</div>
												<div class="payment-label">现金</div>
											</div>
											<div class="payment-amount">{{AccountExpense.cashAmount}}</div>
										</div>
										
										<div class="payment-method-card"
											:class="{'active': selectInput_pay === 8}"
											@click="editingPaymentClick(8)">
											<div class="payment-method-card-content">
												<div class="payment-icon">
													<u-icon name="coupon-fill" :size="24" color="#ffa502"></u-icon>
												</div>
												<div class="payment-label">其他</div>
											</div>
											<div class="payment-amount">{{AccountExpense.otherAmount}}</div>
										</div>
									</div>
								</div>
							</div>
							
							<!-- 右侧：顾客信息、数字键盘和操作按钮 -->
							<div class="right-keypad-section">
								<!-- 顾客信息 -->
								<div class="customer-info-section">
									<div class="customer-badge" :class="currentMember.debts > 0 ? 'debt' : 'normal'">
										<div class="customer-name">{{currentMember.customName ? currentMember.customName : '散客'}}</div>
										<div v-if="currentMember.debts > 0" class="debt-info">总下欠：{{currentMember.debts}}元</div>
									</div>
								</div>
								
								<!-- 数字键盘 -->
								<div class="modern-keypad">
									<div class="keypad-row">
										<button class="keypad-btn" @click="NumberCk2(1)">1</button>
										<button class="keypad-btn" @click="NumberCk2(2)">2</button>
										<button class="keypad-btn" @click="NumberCk2(3)">3</button>
									</div>
									<div class="keypad-row">
										<button class="keypad-btn" @click="NumberCk2(4)">4</button>
										<button class="keypad-btn" @click="NumberCk2(5)">5</button>
										<button class="keypad-btn" @click="NumberCk2(6)">6</button>
									</div>
									<div class="keypad-row">
										<button class="keypad-btn" @click="NumberCk2(7)">7</button>
										<button class="keypad-btn" @click="NumberCk2(8)">8</button>
										<button class="keypad-btn" @click="NumberCk2(9)">9</button>
									</div>
									<div class="keypad-row">
										<button class="keypad-btn" @click="NumberCk2(0)">0</button>
										<button class="keypad-btn" @click="NumberCk2('.')">.</button>
										<button class="keypad-btn delete-btn" @click="Tuige2()">
											<uni-icons custom-prefix="iconfont" type="icon-tuige" size="40" color="#fff"></uni-icons>
										</button>
									</div>
								</div>
								
								<!-- 操作按钮 -->
								<div class="action-buttons">
									<button class="action-btn debt-btn" @click="payTypeDebt" v-if="payAmount.actual>=0">整单下欠</button>
									<button class="action-btn confirm-btn" :class="{'confirm-btn2': payAmount.actual<0}" @click="payTypeConfirm">确认收款</button>
								</div>
							</div>
						</div>
					</div>
				</u-modal>

				<u-modal title="订单详情" :show="LastOrderShow" @close="LastOrderShow = false" :closeOnClickOverlay="true"
					:showConfirmButton="false" :width="'500rpx'">
					<div class="slot-content" v-if="lastOrder" style="position: relative;">
						<div style="display: inline-block; margin-right: 10px;">
							创建时间: {{ lastOrder.createTime ? lastOrder.createTime.replace("T", " ") : "" }}
						</div>
						<div style="display: inline-block; margin-right: 10px;margin-left: 50px;">
							订单号: {{ lastOrder.accountCode ? lastOrder.accountCode : "" }}
						</div>
						<div style="display: inline-block; margin-right: 10px;margin-left: 50px;">
							<div>顾客: {{ lastOrder.customName ? lastOrder.customName : "散客" }}</div>
						</div>
						<br>
						<div style="display: inline-block; margin-right: 10px;margin-top: 20px;margin-bottom: 20px;">
							<div>总计金额: {{ lastOrder.payableAmount ? lastOrder.payableAmount : 0 }}</div>
						</div>
						<div v-if="lastOrder.basketOffsetAmount&&lastOrder.basketOffsetAmount>0"
							style="display: inline-block;margin-left: 50px; margin-right: 10px;margin-top: 20px;margin-bottom: 20px;">
							<div>收筐抵扣:
								{{ lastOrder.basketOffsetAmount ? lastOrder.basketOffsetAmount : 0 }}({{lastOrder.basketOffsetNum}}个)
							</div>
						</div>
						<div style="display: inline-block; margin-right: 10px;margin-left: 50px;">
							<div>实付金额: {{ lastOrder.actualMoney ? lastOrder.actualMoney : 0 }}</div>
						</div>
						<div v-if="lastOrder.debt>0"
							style="display: inline-block; margin-right: 10px;margin-left: 50px;color: red;">
							<div>下欠: {{ lastOrder.debt  }}</div>
						</div>

						<div class="table">
							<div class="table-row">
								<div class="table-header-cell">货品</div>
								<div class="table-header-cell">数量</div>
								<div class="table-header-cell">总重</div>
								<div class="table-header-cell">皮重</div>
								<div class="table-header-cell">单价</div>
								<div class="table-header-cell">小计</div>
							</div>
							<scroll-view class="scrollArea" scroll-y="true" :style="{ height: 150 + 'rpx' }">
								<div class="table-row" v-for="item in lastOrder.modelList">
									<div class="table-cell">{{item.name}}</div>
									<div class="table-cell">{{item.mount}}</div>
									<div class="table-cell">{{item.totalWeight}}</div>
									<div class="table-cell">{{item.tareWeight}}</div>
									<div class="table-cell">{{item.referenceAmount}}</div>
									<div class="table-cell">{{item.subtotal}}</div>
								</div>
							</scroll-view>
						</div>
						<view
							style="display: flex; justify-content: space-between; align-items: center; width: 100%;padding-top: 5rpx;">
							<view style="text-align: right;padding-right: 5rpx;">
								<!-- <u-button type="primary"
									@click="orderMemberChange" text="客户变更"></u-button> -->
								</view>
							<view style="text-align: right;padding-right: 5rpx;"><u-button type="primary"
									@click="printerModel(lastOrder);" text="打印"></u-button></view>
						</view>
						<u-button icon="share-square" :plain="true" shape="circle" type="primary" text="发单"
							@click="shareOrder(lastOrder.id)"
							style="position: absolute; top: 0; right: 0;width: 50rpx;">
						</u-button>
					</div>
				</u-modal>
				<u-modal title=" " class="payment" :show="inputModelVisible" :closeOnClickOverlay="true"
					:showConfirmButton="false" :width="800" @close="inputModelVisible = false">
					<div class="slot-content" style="overflow-y: auto;">
						<div class="slot-modal pay-type">
							<div class="body">
								<div class="pay-amount">
									<div class="form-row">
										<div class="form-container" style="width: 95%;">
											<div v-for="(item,index) in repayBasketList" :key="index"
												style="display: flex; flex-direction: column; gap: 8px; padding: 6px;">
												<div style="display: flex; border: 1px solid #ddd;"> <!-- 外层容器加边框 -->
													<div @click="repayBasketActiveIndex = index" style="
													     width: 150rpx; 
													     font-size: 15rpx; 
													     font-weight: bold; 
													     display: flex; 
													     border-right: 1px solid #ddd;
													     align-items: center;     /* 垂直居中 */
													     justify-content: center; /* 水平居中 */
													   ">
														<div style="flex: 1; padding: 5rpx; text-align: center;">数量：
														</div>
														<input
															style="flex: 1; font-size: 15rpx; color: white; margin-right: 10rpx;  border: 1px solid #ccc; align-self: center;"
															:style="{'text-align': 'center','background-color': index === repayBasketActiveIndex ? 'dodgerblue' : 'gainsboro'}"
															v-model="item.quantity" />
													</div>

													<div
														style="flex: 1; font-size: 15rpx; font-weight: bold; padding: 5rpx; border-right: 1px solid #ddd;text-align: center;">
														{{ item.name }}
													</div>

													<div
														style="flex: 1; font-size: 15rpx; font-weight: bold; padding: 5rpx; border-right: 1px solid #ddd;text-align: center;">
														单价：{{ item.amount || 0 }}
													</div>

													<div
														style="flex: 1; font-size: 15rpx; font-weight: bold; padding: 5rpx;text-align: center;">
														小计：{{ (item.quantity || 0) * (item.amount || 0) }}
													</div>
												</div>
											</div>
											<!-- <text
														style="font-size: 20rpx;font-weight: bold;width: 120rpx;">收筐数量：</text><input
														v-model="memberEventInfo.collectBasketNum" inputmode="none"
														style="width: 150rpx;text-align: center; font-size: 25rpx;font-weight: bold;border-bottom: 2px solid #000;"></input> -->
											<!-- 	<u-form-item label="收筐数量：" prop="payAmount" borderBottom ref="item1"
													v-if="inputModelType==2||inputModelType==3" class="form-item" >
													<input v-model="memberEventInfo.collectBasketNum"
														inputmode="none" style="font-size: 25rpx;font-weight: bold;"></input>
												</u-form-item> -->
											<view class="mybrankmask2"
												:style="{marginLeft:'60rpx', width: '340rpx', height: '180rpx', zIndex: 999, left: 0, bottom: 0,marginTop:'20rpx' }">
												<view style="padding: 5rpx;">
													<view class="MymaskList">
														<view class="maskListItem" @click="NumberCk3(1)">1</view>
														<view class="maskListItem" @click="NumberCk3(2)">2</view>
														<view class="maskListItem" @click="NumberCk3(3)">3</view>
													</view>
													<view class="MymaskList">
														<view class="maskListItem" @click="NumberCk3(4)">4</view>
														<view class="maskListItem" @click="NumberCk3(5)">5</view>
														<view class="maskListItem" @click="NumberCk3(6)">6</view>
													</view>
													<view class="MymaskList">
														<view class="maskListItem" @click="NumberCk3(7)">7</view>
														<view class="maskListItem" @click="NumberCk3(8)">8</view>
														<view class="maskListItem" @click="NumberCk3(9)">9</view>
													</view>
													<view class="MymaskList">

														<view class="maskListItem" @click="Clear3()">C</view>
														<view class="maskListItem" @click="NumberCk3(0)">0</view>
														<view class="maskListItem " @click="Tuige3()"><uni-icons
																custom-prefix="iconfont" type="icon-tuige" size="30"
																color="#ffffff" style="margin-right: 5rpx;"></uni-icons>
														</view>
													</view>
												</view>
											</view>
										</div>
									</div>
								</div>
							</div>
							<div class="footer">
								<u-row customStyle="margin-bottom: 10px;margin-top:10px;" v-if="inputModelType==2">
									<u-col span="6">
										<div class="btn btn-info-plain" style="font-size: 20rpx;font-weight: bold;"
											@click="inputModelVisible = false">取消收筐</div>
									</u-col>
									<u-col span="6">
										<div class="btn btn-primary" style="font-size: 20rpx;font-weight: bold;"
											@click="payBasketConfirm">确认收筐</div>
									</u-col>
								</u-row>
								<u-row customStyle="margin-bottom: 10px;margin-top:10px;" v-if="inputModelType==3">
									<u-col span="6">
										<div class="btn btn-info-plain" style="font-size: 20rpx;font-weight: bold;"
											@click="cancelRepayBasket">取消收筐</div>
									</u-col>
									<u-col span="6">
										<div class="btn btn-primary" style="font-size: 20rpx;font-weight: bold;"
											@click="saveBasketOffest">确认收筐</div>
									</u-col>
								</u-row>
							</div>
						</div>
					</div>
				</u-modal>

			</div>
		</div>

		<!--下单成功弹窗-->
		<u-modal title=" " class="payment" :show="popup_paysuccess_show" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="500" @close="inputModelVisible = false">
			<view style="border-radius: 10rpx;">
				<div style="display: flex;">
					<div>
						<image src="/static/img/paySuccess.png"
							style="width: 120px; height: 100px; margin-right: 5rpx;"></image>
					</div>
					<div style="margin-left: 5rpx;margin-top: 10px;">
						<div style="font-size: 15rpx;font-weight: bold;">
							下单成功</div><br>
						<div style="font-size: 15rpx;font-weight: bold;" v-if="lastOrder">
							订单金额：{{lastOrder.payableAmount - lastOrder.basketOffsetAmount}} 元
						</div>
					</div>
				</div>
				<div style="display: flex;margin-top: 20px;"><button
						style="background-color: orange;color: white;font-weight: bold;"
						@click="paysuccessOrder(1)"><uni-icons custom-prefix="iconfont" type="icon-dayin" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>打印</button>
					<button style="background-color: dodgerblue;color: white;font-weight: bold;margin-left: 50px;"
						@click="paysuccessOrder(2)"><uni-icons custom-prefix="iconfont" type="icon-zhuanfa" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>发单</button>
					<button style="background-color: green;color: white;font-weight: bold;margin-left: 50px;"
						@click="paysuccessOrder(3)"><uni-icons custom-prefix="iconfont" type="icon-kaidan" size="20"
							color="#ffffff" style="margin-right: 5rpx;"></uni-icons>继续开单</button>
				</div>
			</view>
		</u-modal>
		<!--收筐抵扣弹窗-->
		<BasketOffestModel ref="modeloffestBasketRef" :basketData="extraModel" @saveBasketOffest="saveBasketOffest">
		</BasketOffestModel>
		<!--还筐弹窗(不抵扣)-->
		<RepayBasketModel ref="repayBasketModelRef" :basketData="extraModel"></RepayBasketModel>
		<!--还款弹窗-->
		<RepayModal :visible="showRepaymentModal"
      :customerInfo="repayCustomerData"
      @confirm="handleRepaymentConfirm"
      @close="showRepaymentModal = false">
		</RepayModal>

		<!--运费弹窗-->
		<u-modal title="添加运费" :show="shippingModalVisible" @close="shippingModalVisible = false" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="500">
			<div style="padding: 20px;">
				<div style="margin-bottom: 20px;">
					<div style="font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333;">运费金额</div>
					<u-input 
						type="number" 
						v-model="tempShippingFee" 
						placeholder="请输入运费金额"
						:customStyle="{
							width: '400px',
							padding: '12px',
							border: '1px solid #ddd',
							borderRadius: '8px',
							fontSize: '16px',
							background: '#fff'
						}"
						:clearable="true"
						@input="validateShippingFee"
						@focus="onInputFocus"
					></u-input>
				</div>
				<div style="display: flex; gap: 10px; margin-top: 20px;width: 400px;">
					<button 
						@click="cancelShipping"
						style="flex: 1; padding: 12px; background: #f5f5f5; color: #666; border: none;  font-size: 16px; font-weight: bold;"
					>
						取消
					</button>
					<button 
						@click="confirmShipping"
						style="flex: 1; padding: 12px; background: #00aaff; color: white; border: none; font-size: 16px; font-weight: bold;"
						:style="tempShippingFee <= 0 ? 'background: #ccc;' : ''"
					>
						确定
					</button>
				</div>
			</div>
		</u-modal>

	</div>

</template>

<script>
	import Sidebar from '@/components/Sidebar.vue'
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
	import login from '../../api/auth/login'
	import cashierHang from '../../api/cashier/cashierHang'
	import Purchase from '../../api/purchase/purchase.js'
	import {
		generateGUID
	} from '../util/CommonMethod.js'
	import {
		getCompanyId
	} from '../../common/const/cacheSync'
	import MyNumberInputVue from '../../components/MyNumberInput.vue'
	import RepayBasketModel from '@/components/repay-basket-model.vue' //还筐弹窗
	import BasketOffestModel from './component/basket-offest-model.vue'
	import RepayModal from '@/components/RepaymentModal.vue'

	export default {
		name: 'Cashier',
		components: {
			Sidebar,
			VerticalTab,
			MyNumberInputVue,
			RepayBasketModel,
			BasketOffestModel,
			RepayModal
		},
		data() {
			return {
				currentSelctCustomerType: 1, //当前选中的顾客操作类型 1-下单 2-还筐 3-还款
				test: 0,
				popup_paysuccess_show: false,
				currentTabId: "",
				repayBasketList: [], //2.0仅用于收银还筐
				repayBasketActiveIndex: 0,
				currentTabName: "",
				accountDiscount: true,
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
				],
				AccountExpense: {
					otherAmount: 0,
					cashAmount: 0,
					alipayAmount: 0,
					wxpayAmount: 0
				},
				discountAmount: 0,
				actionView: null,
				maskView: null,
				memberStyle: "XiaDan",
				AddedCustomerFormData: {},
				canvasheight: 0,
				currentPayWay: 1,
				custominputFocused: false,
				custominputFocused2: false,
				custominputFocused3: false,
				custominputFocused4: false,
				custominputFocusIndex: '',
				editingPaymentIndex: 1,
				LastOrderShow: false,
				showRepaymentModal: false,
				repayCustomerData:{},
				step1: true,
				spuCol: 3,
				skuCol: 2,
				inputModelTitle: "收筐",
				inputModelType: 2,
				inputModelVisible: false,
				memberCol: 3,
				modalWidth: '700px',
				showKeyBord: false,
				editingCard: '',
				editingIndex: '',
				fixedTareWeight: {
					action: false,
					value: 0
				},
				fixedPayPrint: false,
				memberEventInfo: {
					member: null,
					collectBasketNum: 0
				},
				orderGDSelect: {

				},
				cashier: {
					type: 0,
					discount: 10,
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
				customerDialogVisibleAdd: false,
				skuDialogVisible: false,
				skuOptions: [],
				windowHeight: 0,
				tempSpuDialogVisible: false,
				tempSpu: {
					skuName: '',
					adjustAmount: '',
					quantity: ''
				},
				selectCashierCardItem: {},
				showAllweightStr: false,
				memberDialogVisible: false,
				hangListVisible: false,
				memberSearchKeyword: '',
				memberOptions: [],
				memberSearchOptions: [],
				hangleList: [],
				hangDialogVisible: false,
				hangPopupVisible: false,
				hangBtnLoading: false,
				lastOrder: null,
				hangFormRules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写备注信息',
						trigger: ['blur', 'change']
					}
				},
				hangInfo: {
					name: '',
					remark: ''
				},
				hangList: [],
				categoryList: [],
				currentOrderInfo: {

				},
				currentMember: {
					customName: "散客",
					id: ""
				},
				tempSpuRules: {
					'skuName': {
						type: 'string',
						required: true,
						message: '请填写商品名',
						trigger: ['blur', 'change']
					},
					'adjustAmount': {
						type: 'number',
						required: true,
						message: '请填写单价',
						trigger: ['blur', 'change']
					},
					'quantity': {
						type: 'number',
						required: true,
						message: '请填写购买数量',
						trigger: ['blur', 'change']
					}
				},
				payTypeDialogVisible: false,
				selectInput_pay: 1,
				payResult: {},
				rows: [],
				showRows: [],
				GoodkeyWord: [],
				currentKeyWord: "",
				commidityList: [],
				selectPay: {},
				commodityType: 1,
				payAmount: {
					total: 0,
					actual: 0,
					debt: 0,
					ExtraMoney: 0,
					BasketOffsetAmount: 0
				},
				currentCompanyId: "",
				extraModel: [],
				editCardExtralModel: [],
				goodSelect: [],
				// 运费相关数据
				shippingFee: 0,
				shippingModalVisible: false,
				tempShippingFee: 0
			}
		},
		onShow() {
			this.initSystem();
			this.currentCompanyId = uni.getStorageSync('companyId');
			this.getCategoryList();
			this.getlastOrder();
			this.initCompanySetting();
		},
		mounted() {
			this.windowHeight = uni.getWindowInfo().windowHeight;
			this.onLoadMethod();
			this.getlastOrder();
			this.getallextralgood();
		},
		methods: {
			// 运费相关方法
			showShippingModal() {
				this.tempShippingFee = this.shippingFee;
				this.shippingModalVisible = true;
			},
			cancelShipping() {
				this.shippingModalVisible = false;
				this.tempShippingFee = 0;
			},
			confirmShipping() {
				if (this.tempShippingFee >= 0) {
					this.shippingFee = parseFloat(this.tempShippingFee);
					this.shippingModalVisible = false;
					this.tempShippingFee = 0;
					this.reCountGoodSelect(); // 重新计算总金额
					uni.showToast({
						title: '运费设置成功',
						icon: 'success'
					});
				}
			},
			validateShippingFee() {
				// 确保输入的是有效数字
				if (this.tempShippingFee < 0) {
					this.tempShippingFee = 0;
				}
			},
			onInputFocus() {
				// 输入框获得焦点时的处理
				console.log('运费输入框获得焦点');
			},
			editCardExtraModelSelct(e) {
				this.editingCard.extralModel = JSON.parse(JSON.stringify(this.editCardExtralModel[e]));
                							//押筐数量处理
							if (this.editingCard.extralModel) {
								this.editingCard.extralModel.quantity = this.editingCard.quantity;
							}
			},
			onLoadMethod() {
				this.currentCompanyId = uni.getStorageSync('companyId');
				this.getCategoryList();
				this.initCompanySetting();
			},
			initCompanySetting() {
				var companySetting = uni.getStorageSync("companySetting")
				if (companySetting != null) {
					if(companySetting._fixedTareWeight){
					this.fixedTareWeight = companySetting._fixedTareWeight;
					}
					if (companySetting._fixedPayPrint) {
						this.fixedPayPrint = companySetting._fixedPayPrint;
					}

				}
			},
			paysuccessOrder(type) {
				this.popup_paysuccess_show = false;
				if (type == 1) {
					this.printerModel(this.lastOrder);
				} else if (type == 2) {
					this.shareOrder(this.lastOrder.id);
				}
			},
			clickKeyWord(key) {
				this.currentKeyWord = key;
				if (key === "全") {
					this.rows = [];
					this.commidityList.sort((a, b) => b.inventory - a.inventory);
					for (let i = 0; i < this.commidityList.length; i += 2) {
						this.rows.push(this.commidityList.slice(i, i + 2));
					}
				} else {
					var commidityList = this.commidityList.filter(x => x.name.includes(key));
					this.rows = [];
					commidityList.sort((a, b) => b.inventory - a.inventory);
					for (let i = 0; i < commidityList.length; i += 2) {
						this.rows.push(commidityList.slice(i, i + 2));
					}
				}
			},
			setDicountAmount() {
				this.accountDiscount = true;
				this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) - eval(this.payAmount.debt);
				this.setAccountExpense(this.payAmount.actual);
			},
			setOverchargeAmount() {
				this.accountDiscount = false;
				this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) - eval(this.payAmount.debt);
				this.setAccountExpense(this.payAmount.actual);
			},
			setAccountExpense(val) {
				this.AccountExpense = {
					otherAmount: 0,
					cashAmount: 0,
					alipayAmount: 0,
					wxpayAmount: val
				}
			},
			countTareWeight(str) {
				console.log(str)
				return eval(str)
			},
			cancelRepayBasket() {
				this.inputModelVisible = false;
				this.resetPayBasket();
				this.payAmount.actual = this.payAmount.actual + this.payAmount.BasketOffsetAmount;
				this.payAmount.BasketOffsetAmount = 0;
			},
			saveBasketOffest(basketList) {
				console.log("basketList", basketList)
				// if (parseInt(this.memberEventInfo.collectBasketNum) === 0) {
				// 	return;
				// }
				this.repayBasketList = basketList;
				this.payAmount.actual += this.payAmount.BasketOffsetAmount;
				this.payAmount.BasketOffsetAmount = 0;
				for (var i = 0; i < this.repayBasketList.length; i++) {
					this.payAmount.BasketOffsetAmount += parseFloat(this.repayBasketList[i].quantity) * parseFloat(this
						.repayBasketList[i].amount);
				}
				this.payAmount.actual = parseFloat((this.payAmount.actual - this.payAmount.BasketOffsetAmount).toFixed(
					1));
				this.inputModelVisible = false;
			},
			collectBasketoffestMoney() {
				this.$nextTick(() => {
					this.$refs.modeloffestBasketRef.open(this.repayBasketList);
				});
				this.playSystemKeyClickSound();
				// this.inputModelType = 3;
				// this.inputModelVisible = true;
			},
			blurExtralModel1(e) {
				if (e.target.value == null || e.target.value === "" || e.target.value == NaN) {
					this.extraModel[0].quantity = 0;
				} else {
					this.extraModel[0].quantity = e.target.value;
				}
				this.reCountGoodSelect2();
			},
			getlastOrder() {
				console.log("getlastOrder")
				let that = this;
				that.lastOrder = null;
				cashierOrder.GetLastAccountCompanyId(that.currentCompanyId).then(res => {
					console.log("getlastOrder",res)
					that.lastOrder = res.data;
					that.lastOrder.modelList = JSON.parse(that.lastOrder.module);
					const basketOffsetList = that.lastOrder.modelList.filter(item => item.type === 4);
					that.lastOrder.modelList = that.lastOrder.modelList.filter(item => item.type !== 4).sort((a,
						b) => a.type - b.type);
					if (basketOffsetList.length > 0) {
						that.lastOrder.basketOffsetNum = basketOffsetList[0].mount;
					}
				})
			},
			async getlastOrder_print() {
				let that = this;
				return await cashierOrder.GetLastAccountCompanyId(that.currentCompanyId)
			},
			getallextralgood() {
				this.extraModel = [];
				this.editCardExtralModel = [{
					name: "空",
					amount: 0,
					id: ""
				}]
				let that = this;
				category.getallextralgood(this.currentCompanyId).then(res => {
					that.extraModel = res.data;
					that.editCardExtralModel = that.editCardExtralModel.concat(res.data);
					console.log("editCardExtralModel", that.editCardExtralModel)
					that.extraModel.forEach(x => {
						x.quantity = 0;
						x.money = 0;
					})
					that.editCardExtralModel.forEach(x => {
						x.quantity = 0;
						x.money = 0;
					})
				})
			},
			//客户中心点击客户事件
			changeMember(e) {
				console.log("this.currentSelctCustomerType", this.currentSelctCustomerType)
				this.memberDialogVisible = false
				if (this.currentSelctCustomerType === 1) {
					this.currentMember = e;
				} else if (this.currentSelctCustomerType === 2) {

					this.$refs.repayBasketModelRef.openRepayBasket(e);
				}else if(this.currentSelctCustomerType === 3){
					this.repayCustomerData = e;
					this.showRepaymentModal = true;
				}


				// if (this.memberStyle === "XiaDan") {

				// } else if (this.memberStyle === "ShouKuang") {
				// 	this.inputModelVisible = true;
				// 	this.repayBasketList = [];
				// 	this.repayBasketActiveIndex = 0;
				// 	for (var i = 0; i < this.extraModel.length; i++) {
				// 		this.repayBasketList.push({
				// 			name: this.extraModel[i].name,
				// 			amount: this.extraModel[i].amount,
				// 			quantity: 0,
				// 		})
				// 	}
				// 	this.memberEventInfo.member = e;
				// 	this.memberEventInfo.collectBasketNum = 0;
				// } 
				// 1.0 改单
				// else if (this.memberStyle === "MemberChange") {
				// 	this.orderMemberChangeMain(e, this.lastOrder);
				// }
			},
			//处理还款事件
			handleRepaymentConfirm(data) {
				console.log("data", data)
			},
			selectGDorder(e) {
				this.orderGDSelect = e;
				this.orderGDSelect.modelList = JSON.parse(e.module);
			},
			//取挂单
			hangOrderParse(e) {
				console.log("e",e);
				this.goodSelect = [];
				let modelList = JSON.parse(e.module);
                console.log("modelList",modelList);
				for (let i = 0; i < modelList.length; i++) {
					let model = modelList[i];
                    if(model.type==1){
                        let good = {
						key: i,
						skuName: model.name,
						referenceAmount: model.referenceAmount,
						quantity: model.mount,
						carweight: model.tareWeight,
						allweight: model.totalWeight,
						allweightSrt:model.totalWeight,
						stockType:model.stockType,
						commodityId:model.commodityId,
						purchaseAssistId:model.purchaseAssistId,
						commoditySpec:model.commoditySpec,
						money: model.subtotal && model.subtotal != null ? model.subtotal : 0,
						id: model.Id ? model.Id : "",
                        saleWay:model.saleWay
					}
					this.goodSelect.push(good);
                    }
				}
                console.log("this.goodSelect",this.goodSelect);
                //还原押筐
                for(let i=0;i<modelList.length;i++){
                    if(modelList[i].type==2){
                        for(let k=0;k<this.goodSelect.length;k++){
                            console.log("1");
                            if(modelList[i].parentId==this.goodSelect[k].id){
                                console.log("2");
                                this.goodSelect[k].extralModel={
                                    name:modelList[i].name,
                                    money:modelList[i].amount,
                                    quantity:modelList[i].mount,
                                    id:modelList[i].commodityId,
                                    amount:modelList[i].referenceAmount
                                }
                            }
                        }
                    }
                }

				this.currentOrderInfo.Id = e.id;
				this.currentOrderInfo.accountCode = e.accountCode;
				if (e.customerId != null && e.customerId != "") {
					member.GetmemberByCustomeId(e.customerId).then(res => {
						this.currentMember = res.data;
					})
				}
				this.reCountGoodSelect();
				this.hangListVisible = false;
			},
			changPayWay(index) {
				for (var i = 0; i < this.payWay.length; i++) {
					this.payWay[i].select = 0;
				}
				this.payWay[index].select = 1;
				this.currentPayWay = this.payWay[index].id;
			},
			playSystemKeyClickSound() {
				try {
					var Context = plus.android.importClass("android.content.Context");
					var AudioManager = plus.android.importClass("android.media.AudioManager");
					var main = plus.android.runtimeMainActivity();
					var audioManager = main.getSystemService(Context.AUDIO_SERVICE);
					audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
				} catch (e) {
					console.error("播放系统按键音失败:", e);
				}
			},
			NumberCk(val) {
				this.playSystemKeyClickSound();
				let myvalue = "";
				//修改allweightStr
				if (this.custominputFocusIndex === 3) {
					if (this.editingCard.allweightSrt.toString() === "0") {
						this.$nextTick(() => {
							this.editingCard.allweightSrt = val.toString();
						})

					} else {
						this.$nextTick(() => {
							this.editingCard.allweightSrt = this.editingCard.allweightSrt + val.toString();
						})

					}

				}
				switch (this.custominputFocusIndex) {
					case 1:
						myvalue = this.editingCard.quantity;
						break;
					case 2:
						myvalue = this.editingCard.referenceAmount;
						break;
					case 3:
						myvalue = this.editingCard.allweight;
						break;
					case 4:
						myvalue = this.editingCard.carweight;
						break;
				}
				var myvalueStr = myvalue.toString();
				if (val == '.') {
					if (myvalueStr.indexOf('.') >= 0) {
						return;
					}
				}
				if ((val === '+' || val === '-') && myvalueStr === '0') {
					return;
				}
				var txt = myvalue == null || (myvalueStr === '0' && val != ".") || myvalue == undefined ? '' : myvalue;

				if (val === "+" || val === "-") {
					txt = eval(txt);
				}
				myvalue = txt + val.toString();
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = myvalue;
						if (this.fixedTareWeight.action === true) {
							var carWeightNew = this.editingCard.fixedTare * parseFloat(this.editingCard.quantity)
							//皮重处理
							if (carWeightNew) {
								this.$nextTick(() => {
									this.editingCard.carweight = carWeightNew;
								})
							}
							//押筐数量处理
							if (this.editingCard.extralModel) {
								this.editingCard.extralModel.quantity = this.editingCard.quantity;
							}
							console.log("this.editingCard.initWeight",this.editingCard);
							//固定重量处理
							if(this.editingCard.initWeight){
								this.editingCard.allweight = parseFloat(this.editingCard.quantity) * parseFloat(this.editingCard.initWeight);
							}
						}
						break;
					case 2:
						this.$nextTick(() => {
							this.editingCard.referenceAmount = myvalue;
						})

						break;
					case 3:
						this.$nextTick(() => {
							this.editingCard.allweight = myvalue;
						})

						break;
					case 4:
						this.$nextTick(() => {
							this.editingCard.carweight = myvalue;
						})

						break;
				}
				// this.goodSelect[this.editingIndex] = this.editingCard;
			},
			inputFinsh1() {
				this.playSystemKeyClickSound();
				this.editingCard.quantity = eval(this.editingCard.quantity);
				this.editingCard.referenceAmount = eval(this.editingCard.referenceAmount);
				this.editingCard.allweight = eval(this.editingCard.allweight);
				this.editingCard.carweight = eval(this.editingCard.carweight);
			},
			Tuige1() {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.custominputFocusIndex) {
					case 1:
						myvalue = this.editingCard.quantity;
						break;
					case 2:
						myvalue = this.editingCard.referenceAmount;
						break;
					case 3:
						myvalue = this.editingCard.allweight;
						break;
					case 4:
						myvalue = this.editingCard.carweight;
						break;
				}

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = myvalue === '' ? '0' : myvalue; // 如果为空，设置为0
						if (this.fixedTareWeight.action === true) {
							var carWeightNew = this.editingCard.fixedTare * parseFloat(this.editingCard.quantity)
							//皮重处理
							if (carWeightNew) {
								this.$nextTick(() => {
									this.editingCard.carweight = carWeightNew;
								})
							}
							//押筐数量处理
							if (this.editingCard.extralModel) {
								this.editingCard.extralModel.quantity = this.editingCard.quantity;
							}
						}
						break;
					case 2:
						this.editingCard.referenceAmount = myvalue === '' ? '0' : myvalue;
						break;
					case 3:
						this.editingCard.allweight = myvalue === '' ? '0' : myvalue;
						this.editingCard.allweightSrt = myvalue === '' ? '0' : myvalue;
						break;
					case 4:
						this.editingCard.carweight = myvalue === '' ? '0' : myvalue;
						break;
				}
				this.goodSelect[this.editingIndex] = this.editingCard;
			},
			Tuige2() {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.editingPaymentIndex) {
					case 1:
						myvalue = this.payAmount.total;
						break;
					case 2:
						myvalue = this.payAmount.actual;
						break;
					case 3:
						myvalue = this.payAmount.debt;
						break;
					case 5:
						myvalue = this.AccountExpense.wxpayAmount;
						break;
					case 6:
						myvalue = this.AccountExpense.alipayAmount;
						break;
					case 7:
						myvalue = this.AccountExpense.cashAmount;
						break;
					case 8:
						myvalue = this.AccountExpense.otherAmount;
						break;
					case 9:
						myvalue = this.discountAmount;
						break;
				}

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				switch (this.editingPaymentIndex) {
					case 1:
						this.$nextTick(() => {
							this.payAmount.total = myvalue === '' ? '0' : myvalue; // 如果为空，设置为0
						})
						break;
					case 2:
						this.$nextTick(() => {
							this.payAmount.actual = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 3:
						this.$nextTick(() => {
							this.payAmount.debt = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 5:
						this.$nextTick(() => {
							this.AccountExpense.wxpayAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 6:
						this.$nextTick(() => {
							this.AccountExpense.alipayAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 7:
						this.$nextTick(() => {
							this.AccountExpense.cashAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 8:
						this.$nextTick(() => {
							this.AccountExpense.otherAmount = myvalue === '' ? '0' : myvalue;
						})
						break;
					case 9:
						this.$nextTick(() => {
							this.discountAmount = myvalue === '' ? '0' : myvalue;
							if (this.accountDiscount) {
								this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							} else {
								this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							}
						})
						break;

				}
			},
			Tuige3() {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;

				// 如果当前值为空或为零，直接返回
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
				myvalue = myvalue ? myvalue.toString() : '';
				// 回退一个字符
				myvalue = myvalue.slice(0, -1); // 去掉最后一个字符
				// 更新数据模型
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue === '' ? '0' : myvalue;
			},
			editingPaymentClick(index) {
				this.editingPaymentIndex = index;
				this.selectInput_pay = index;
				this.payAmount.total = eval(this.payAmount.total);
				this.payAmount.actual = eval(this.payAmount.actual);
				this.payAmount.debt = eval(this.payAmount.debt);
			},
			Clear1() {
				// 根据 custominputFocusIndex 清空对应的值
				switch (this.custominputFocusIndex) {
					case 1:
						this.editingCard.quantity = '0'; // 清空为 0
						break;
					case 2:
						this.editingCard.referenceAmount = '0'; // 清空为 0
						break;
					case 3:
						this.editingCard.allweight = '0'; // 清空为 0
						break;
					case 4:
						this.editingCard.carweight = '0'; // 清空为 0
						break;
				}

				// 更新 goodSelect 数组
				this.goodSelect[this.editingIndex] = this.editingCard;
				this.reCountGoodSelect();
			},
			Clear2() {
				this.playSystemKeyClickSound();
				// 根据 custominputFocusIndex 清空对应的值
				switch (this.editingPaymentIndex) {
					case 1:
						this.payAmount.total = '0'; // 清空为 0
						break;
					case 2:
						this.payAmount.actual = '0'; // 清空为 0
						break;
					case 3:
						this.payAmount.debt = '0'; // 清空为 0
						break;
				}

				// 更新 goodSelect 数组
				this.goodSelect[this.editingIndex] = this.editingCard;
			},
			Clear3() {
				// 根据 custominputFocusIndex 清空对应的值
				this.memberEventInfo.collectBasketNum = '0';
			},
			NumberCk2(val) {
				this.playSystemKeyClickSound();
				let myvalue = "";
				switch (this.editingPaymentIndex) {
					case 1:
						myvalue = this.payAmount.total;
						break;
					case 2:
						myvalue = this.payAmount.actual;
						break;
					case 3:
						myvalue = this.payAmount.debt;
						break;
					case 5:
						myvalue = this.AccountExpense.wxpayAmount;
						break;
					case 6:
						myvalue = this.AccountExpense.alipayAmount;
						break;
					case 7:
						myvalue = this.AccountExpense.cashAmount;
						break;
					case 8:
						myvalue = this.AccountExpense.otherAmount;
						break;
					case 9:
						myvalue = this.discountAmount;
						break;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				switch (this.editingPaymentIndex) {
					case 1:
						this.$nextTick(() => {
							this.payAmount.total = myvalue;
						})
						break;
					case 2:
						this.$nextTick(() => {
							this.payAmount.actual = myvalue;
						})
						break;
					case 3:
						this.$nextTick(() => {
							this.payAmount.debt = myvalue;
							this.payAmount.actual = parseFloat(this.payAmount.total) - parseFloat(this.payAmount
								.debt)
						})
						break;
					case 5:
						this.$nextTick(() => {
							this.AccountExpense.wxpayAmount = myvalue;
						})
						break;
					case 6:
						this.$nextTick(() => {
							this.AccountExpense.alipayAmount = myvalue;
						})
						break;
					case 7:
						this.$nextTick(() => {
							this.AccountExpense.cashAmount = myvalue;
						})
						break;
					case 8:

						this.$nextTick(() => {
							this.AccountExpense.otherAmount = myvalue;
						})
						break;
					case 9:
						this.$nextTick(() => {
							this.discountAmount = myvalue;
							if (this.accountDiscount) {
								this.payAmount.actual = eval(this.payAmount.total) - eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							} else {
								this.payAmount.actual = eval(this.payAmount.total) + eval(this.discountAmount) -
									eval(this.payAmount.debt);
								this.setAccountExpense(this.payAmount.actual);
							}
						})
						break;
				}
			},
			NumberCk3(val) {
				this.playSystemKeyClickSound();
				if (this.repayBasketList.length === 0) return;
				let myvalue = "";
				myvalue = this.repayBasketList[this.repayBasketActiveIndex].quantity;
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
				var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
				myvalue = txt + val.toString();
				this.repayBasketList[this.repayBasketActiveIndex].quantity = myvalue;
			},
			custominputFocusedMethod(index) {
				this.inputFinsh1();
				this.custominputFocused = false;
				this.custominputFocused2 = false;
				this.custominputFocused3 = false;
				this.custominputFocused4 = false;
				switch (index) {
					case 1:
						this.custominputFocused = true;
						break;
					case 2:
						this.custominputFocused2 = true;
						break;
					case 3:
						this.custominputFocused3 = true;
						break;
					case 4:
						this.custominputFocused4 = true;
						break;
				}
				this.custominputFocusIndex = index;
			},
			showStep2(e, index) {
				//进入输入编辑的物品，输入完返回对应的添加物品
				this.editingCard = e;
				if (this.editingCard.extralModel) {
					this.editingCard.extralModel.quantity = this.editingCard.quantity;
				} else {
					this.editingCard.extralModel = {
						name: "空",
						amount: 0,
						id: "",
						quantity: 0,
						money: 0
					}
				}
				this.editingIndex = index;
				this.step1 = false;
				if (this.editingCard.saleWay === 1) {
					this.custominputFocusedMethod(3);
				} else {
					this.custominputFocusedMethod(1);
				}

			},
			showStep1() {
				this.inputFinsh1();
				this.reCountGoodSelect();
				this.step1 = true;
				this.custominputFocused = false;
				this.custominputFocused2 = false;
				this.custominputFocused3 = false;
				this.custominputFocused4 = false;
			},

			windowResizeCallback(res) {
				const width = res.size.windowWidth
				this.initCol(width)
			},
			initSystem() {
				const window = uni.getWindowInfo()
				const width = window.windowWidth
				// this.initCol(width)
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
			updateActiveTab(res) {
				this.commodityType = res.type;
				this.currentTabId = res.id;
				this.commidityList = [];
				this.rows = [];
				if (res.type === 1) {
					category.GetBybatchId2(res.id).then(res => {
						for (let i = 0; i < res.data.length; i++) {
							//1-非定装 2-定装 4-散装 单位都为specList第一个
							if ((res.data[i].saleWay === 1 || res.data[i].saleWay === 2 || res.data[i].saleWay ===
									4) && res.data[i].specList != null && res.data[i].specList.length > 0) {
								res.data[i].commoditySpec = res.data[i].specList[0];
							}
							//3-拆包类型,单位使用列表装起来
							if (res.data[i].saleWay === 3) {
								res.data[i].commoditySpecs = res.data[i].specList;
							}

							this.commidityList.push({
								id: res.data[i].id,
								purchaseAssistId: res.data[i].id,
								key: i,
								name: res.data[i].commodityName,
								price: 0,
								inventory: res.data[i].initMount - res.data[i].saleMount,
								type: 0,
								stockType: 2, //2-代销
								saleWay: res.data[i].saleWay, //售卖方式1-非定装 2-定装 3-拆包 4-散装
								commodityId: res.data[i].commodityId,
								outPutPurchaseInventories: res.data[i].outPutPurchaseInventories, //库存
								extralModel: res.data[i].extralModel,
								unit: res.data[i].unit,
								fixedTare: res.data[i].fixedTare, //皮重
								initWeight: res.data[i].fixWeight, //固定重量
								commoditySpec: res.data[i].commoditySpec
							})

						}
						for (let i = 0; i < this.commidityList.length; i += 2) {
							this.rows.push(this.commidityList.slice(i, i + 2));
						}
						this.generateWordCloud(this.commidityList);
					})

					const tab = this.categoryList.find(t => t.id === res.id);
					if (tab) {
						this.currentTabName = tab.shipperName + tab.batchCode;
					} else {
						this.currentTabName = "";
					}
				} else {
					Purchase.GetEmployCommidityByClassId(res.id).then(res => {
						console.log(res.data)

						for (let i = 0; i < res.data.length; i++) {
							this.commidityList.push({
								id: res.data[i].id,
								key: i,
								name: res.data[i].commodityName,
								price: 0,
								inventory: res.data[i].initMount - res.data[i].saleMount,
								type: 0,
								stockType: 1, //1-自营
								saleWay: res.data[i].saleWay,
								commodityId: res.data[i].commodityId,
								outPutPurchaseInventories: res.data[i].outPutPurchaseInventories,
								unit: res.data[i].unit,
								initWeight: res.data[i].initWeight,
								commoditySpecs: res.data[i].commoditySpecs
							})

							if ((res.data[i].saleWay === 1 || res.data[i].saleWay === 2) && res.data[i]
								.commoditySpecs != null && res.data[i].commoditySpecs.length > 0) {
								res.data[i].commoditySpec = res.data[i].commoditySpecs[0];
							}
							if (res.data[i].saleWay === 3) {
								res.data[i].commoditySpecs = res.data[i].commoditySpecs;
							}
						}
						for (let i = 0; i < this.commidityList.length; i += 2) {
							this.rows.push(this.commidityList.slice(i, i + 2));
						}
						this.generateWordCloud(this.commidityList);
						console.log("自营商品", this.commidityList)
					})
				}

			},
			//生产右边词云搜索
			generateWordCloud(goodModelList) {
				this.GoodkeyWord = [];
				this.GoodkeyWord.push("全");
				this.currentKeyWord = "全";
				var nameInput = [];
				for (var i = 0; i < goodModelList.length; i++) {
					nameInput.push(goodModelList[i].name)
				}
				// 处理名称列表，分割成数组
				const names = nameInput.filter(name => name.trim() !== '');

				// 统计每个字出现的频率
				const charFrequency = {};
				names.forEach(name => {
					for (const char of name) {
						charFrequency[char] = (charFrequency[char] || 0) + 1;
					}
				});
				// 转换为数组并排序
				const charArray = Object.keys(charFrequency).map(char => ({
					char: char,
					count: charFrequency[char]
				})).sort((a, b) => b.count - a.count);
				for (var i = 0; i < Math.min(charArray.length, 10); i++) {
					this.GoodkeyWord.push(charArray[i].char);
				}
			},

			getCategoryList() {
				let that = this;
				category.GetAllActiveBatch(this.currentCompanyId).then(res => {
					that.categoryList = res.data.sort((a, b) => {
						return new Date(b.createTime) - new Date(a.createTime);
					});
					if (res.data.length > 0) {
						that.updateActiveTab({
							id: this.categoryList[0].id,
							type: 1
						})
					}
				})
			},
			deleteItem(e) {
				this.playSystemKeyClickSound();
				const indexToDelete = this.goodSelect.findIndex(item => item.index === e.index);

				// 如果找到了对应的索引，则弹出确认框
				if (indexToDelete !== -1) {
					uni.showModal({
						title: '确认删除',
						content: '您确定要删除该项吗？',
						success: (res) => {
							if (res.confirm) {
								// 用户点击了确认
								this.goodSelect.splice(indexToDelete, 1);
								this.reCountGoodSelect(); // 更新选择的商品
							} else if (res.cancel) {
								// 用户点击了取消
							}
						}
					});
				}
			},
			async orderCreate() {
				this.playSystemKeyClickSound();
				this.payTypeDialogVisible = true;
				this.payAmount.actual = eval(this.payAmount.total)
				this.AccountExpense = {
					alipayAmount: 0,
					wxpayAmount: JSON.parse(JSON.stringify(this.payAmount.actual)),
					cashAmount: 0,
					otherAmount: 0
				}
				this.discountAmount = 0;
				this.payAmount.BasketOffsetAmount = 0;
				this.memberEventInfo = {
					member: null,
					collectBasketNum: 0
				}
				// console.log("buleTeethInfo", buleTeethInfo)		
				// console.log("this.cashier",this.cashier)
				// cashierOrder.cashierOrderConfirm(this.cashier).then(res => {
				// 	this.orderId = res.data
				// 	this.payTypeDialogVisible = true
				// 	this.getPayResult()
				// })
				//重置收银还筐物体
				this.resetPayBasket();

			},
			resetPayBasket() {
				this.repayBasketList = [];
				this.repayBasketActiveIndex = 0;
				for (var i = 0; i < this.extraModel.length; i++) {
					this.repayBasketList.push({
						id: this.extraModel[i].id,
						name: this.extraModel[i].name,
						amount: this.extraModel[i].amount,
						quantity: 0,
					})
				}
			},
			printerModel(order) {
				getApp().senBleLabel(order);
			},
			printerGDModel(order) {
				getApp().senBleLabel_GD(order);
			},
			tempSpuClose() {
				this.tempSpu = {}
				this.tempSpuDialogVisible = false
			},
			tempSpuSubmit() {
				this.$refs.tempSpuForm.validate().then(valid => {
					this.tempAddCard(this.tempSpu)
					this.tempSpuClose()
				}).catch((error) => {
					console.log(error)
				})
			},
			tempAddCard(item) {
				const index = this.cashier.cards.findIndex(x => x.skuId === item.skuId)
				if (index >= 0) {
					this.cashier.cards[index].quantity += 1
				} else {
					const card = {
						key: new Date().getTime().toString(),
						skuId: item.skuId,
						skuName: item.skuName,
						quantity: item.quantity,
						adjustAmount: item.adjustAmount,
						payableAmount: item.payableAmount,
						skuNo: item.skuNo
					}
					this.cashier.cards.push(card)
				}
				// this.cashierAmount()
			},
			closeKeyBoard() {
				this.showKeyBord = false;
			},

			//商品金额计算方法
			reCountGoodSelect() {
				this.payAmount.total = 0;
				this.goodSelect.forEach(x => {
					if (x.saleWay === 1) {
						x.money = Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x
							.referenceAmount));
					} else if (x.saleWay === 2 || x.saleWay === 3 || x.saleWay === 4) {
						x.money = Math.round(parseFloat(x.quantity) * parseFloat(x
							.referenceAmount));
					}
					this.payAmount.total +=parseFloat(x.money);//货品金额
                    x.extralModelMoney = 0;//初始化押筐金额
					if (x.extralModel && x.extralModel.id != "") {
						x.extralModelMoney +=parseFloat(x.extralModel.quantity) * parseFloat(x.extralModel.amount);
						this.payAmount.total += x.extralModelMoney;
					}
					x.money2 = parseFloat(x.money) + parseFloat(x.extralModelMoney);
				})
				// 添加运费到总金额
				this.payAmount.total += parseFloat(this.shippingFee || 0);
				this.payAmount.total = parseFloat(this.payAmount.total).toFixed(0);
			},
			//计算方法2---改变箩筐值计算
			reCountGoodSelect2() {
				this.payAmount.total = 0;
				if (this.extraModel.length > 0) {
					this.extraModel[0].money = 0;
				}
				this.goodSelect.forEach(x => {
					x.money = Math.round((parseFloat(x.allweight) - parseFloat(x.carweight)) * parseFloat(x
						.referenceAmount) * 10) / 10;
					this.payAmount.total += x.money;
					x.money2 = parseFloat(x.money);
				})

				if (this.extraModel.length > 0) {
					this.extraModel[0].money += (parseFloat(this.extraModel[0].quantity) * parseFloat(this.extraModel[0]
						.amount));
				}
				if (this.extraModel.length > 0) {
					this.payAmount.total += this.extraModel[0].money;
					this.payAmount.ExtraMoney += this.extraModel[0].money;
					x.money2+=this.extraModel[0].money;
				}
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
				// this.cashierAmount()
			},
			clearCard() {
				this.cashier = {
					type: 0,
					discount: 10,
					discountAmount: 0, // 打折

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
				}
				this.payTypeDialogVisible = false
				this.payResult = {}
				this.payAmount = 0
			},
			tabActive(e) {
				const foundItem = this.goodSelect.find(item => item.id === e.id);
				if (foundItem) {
					return true
				} else {
					return false;
				}
			},
			createNativeView(left, top, commodity, specList) {
				console.log(specList)
				if (this.actionView || !specList || specList.length < 0) return;
				let that = this;
				this.maskView = new plus.nativeObj.View("maskView", {
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%",
					backgroundColor: "rgba(0,0,0,0.01)" // 接近透明

				});
				this.maskView.addEventListener("click", () => {

					that.actionView.close();
					that.actionView = null;
					that.maskView.close();
					that.maskView = null;
				});
				this.maskView.show();

				var zoneHeight = specList.length * 100;
				var zoneTop = top - 100 < 0 ? 0 : top - 100;
				zoneTop = zoneTop + zoneHeight > plus.screen.resolutionHeight ? plus.screen.resolutionHeight - zoneHeight :
					zoneTop;
				this.actionView = new plus.nativeObj.View("actionView", {
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					border: "5px solid #FF0000",
					borderRadius: "10px",
					left: left,
					top: zoneTop,
					width: "150px",
					height: zoneHeight + "px"
				});


				for (var i = 0; i < specList.length; i++) {
					this.actionView.drawRect({
						color: "#000000", // 边框颜色
						width: "1px", // 边框宽度
						radius: "10px" // 圆角半径（关键！）
					}, {
						top: i * 100 + "px",
						left: "0px",
						width: "150px",
						height: "100px"
					});
					this.actionView.drawRect({
						color: "#ffffff", // 边框颜色
						width: "1px", // 边框宽度
						radius: "10px" // 圆角半径（关键！）
					}, {
						top: i * 100 + 1 + "px",
						left: "1px",
						width: "149px",
						height: "99px"
					});


					this.actionView.draw([{
						tag: 'font',
						id: 'font' + i,
						text: specList[i].specName,
						textStyles: {
							size: '50px'
						},
						// 添加边框样式
						border: {
							width: '2px', // 边框宽度
							style: 'solid', // 边框样式（solid, dashed, dotted）
							color: '#000000' // 边框颜色（黑色）
						},
						position: {
							top: i * 100 + 25 + 'px',
							left: '0px',
							width: '100%',
							height: '60px'
						}
					}]);

				}

				// 添加点击事件
				this.actionView.addEventListener("click", (e) => {
					const x = e.clientX;
					const y = e.clientY;
					// 判断点击位置
					for (var i = 0; i < specList.length; i++) {
						if (x > 0 && x < 150 && y > i * 100 && y < (i + 1) * 100) {
							that.commodityClickSaleWay3(commodity, specList[i])
						}
					}

					that.actionView.close();
					that.actionView = null;
					that.maskView.close();
					that.maskView = null;
				});


				this.actionView.show();
			},
			handleClick(e, id) {
				console.log("e", e)
				//进入输入重量界面不可添加货品
				if (!this.step1) return;
				//1-非定装 2-定装 4-散装
				if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
					this.goodSelect.push({
						key: this.goodSelect.length,
						skuName: e.name, //货品名称
						referenceAmount: e.price, //单价
						stockType: e.stockType, //库存类型 
						quantity: 0,
						id: e.id,
						purchaseAssistId: e.purchaseAssistId,
						saleWay: e.saleWay,
						commodityId: e.commodityId,
						extralModel: e.extralModel,
						fixedTare: e.fixedTare,
						allweight: 0,
						allweightSrt: 0,
						commoditySpec: e.commoditySpec,
						initWeight: e.initWeight,
						carweight: 0,
						money: 0,//物品金额（不含押筐）
						money2:0,//包含押筐金额
						index: this.goodSelect.length + 1
					});
					this.showAllweightStr = false;
					//显示输入价格界面
					this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
				} else if (e.saleWay === 3) {
					uni.createSelectorQuery().selectAll(`#grid-item-${id}`).boundingClientRect(data => {
						// const { left, top, width, height } = data;
						console.log("data", data)
						this.createNativeView(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
					}).exec()
				}
				// }
				// this.reCountGoodSelect();
				// }
			},

			commodityClickSaleWay3(e, spec) {
				this.goodSelect.push({
					key: this.goodSelect.length,
					skuName: e.name,
					referenceAmount: e.price,
					stockType: e.stockType,
					quantity: 0,
					id: e.id,
					commodityId: e.commodityId,
					saleWay: e.saleWay,
					allweight: 0,
					allweightSrt: 0,
					commoditySpec: spec,
					carweight: 0,
					money: 0,
					index: this.goodSelect.length + 1
				});
				this.showAllweightStr = false;
				this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
			},

			addTemplateGood() {
				this.goodSelect.push({
					key: this.goodSelect.length,
					skuName: "临时物品",
					referenceAmount: 0,
					quantity: 1,
					id: this.generateGUID,
					allweight: 0,
					allweightSrt: 0,
					carweight: 0,
					money: 0,
					index: this.goodSelect.length + 1
				});
				this.showAllweightStr = false;
				this.showStep2(this.goodSelect[this.goodSelect.length - 1], this.goodSelect.length - 1);
				this.reCountGoodSelect();
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
			skuClick(item) {
				this.skuDialogVisible = false
				this.addCard(item)
			},
			saleHang() {
				this.hangBtnLoading = true
				this.hangDialogVisible = true
			},
			deleteGDorder(item) {
				uni.showModal({
					title: '删除挂单',
					content: `您确定要删除吗？`, // 假设 item 有一个 name 属性
					success: (res) => {
						if (res.confirm) {
							
						}
					}
				});
			},
			submitAddCustomer() {
				if (this.AddedCustomerFormData.name == undefined || this.AddedCustomerFormData.name == "") {
					uni.showToast({
						title: '请填写客户名称',
						icon: 'none'
					})
					return;
				}

				const exists = this.memberOptions.some(item => item.customName === this.AddedCustomerFormData.name);

				if (exists) {
					uni.showToast({
						title: '客户名称已存在',
						icon: 'none'
					})
					return;
				}
				this.AddedCustomerFormData.phone = this.AddedCustomerFormData.phone == undefined ? "" : this
					.AddedCustomerFormData.phone;
				this.AddedCustomerFormData.address = this.AddedCustomerFormData.address == undefined ? "" : this
					.AddedCustomerFormData.address;
				this.AddedCustomerFormData.carNum = this.AddedCustomerFormData.carNum == undefined ? "" : this
					.AddedCustomerFormData.carNum;
				let currentCompanyId = uni.getStorageSync('companyId');
				var param = {
					id: "",
					CustomName: this.AddedCustomerFormData.name,
					CustomPhone: this.AddedCustomerFormData.phone,
					Address: this.AddedCustomerFormData.address,
					CarNum: this.AddedCustomerFormData.carNum,
					CompanyId: currentCompanyId,
					Debts: 0,
					OrderNum: 0,
					Owebasket: 0
				}
				member.memberCreate(param).then(res => {
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					})
					this.AddedCustomerFormData = {
						phone: null,
						address: null,
						carNum: null,
						name: null
					};
					this.customerDialogVisibleAdd = false;
					this.memberChange("XiaDan");
				}).finally(() => {

				})
			},
			saleHangList() {
				let that = this;
				cashierOrder.GetAllGDorder(this.currentCompanyId).then(res => {
					that.hangListVisible = true;
					var hangleList = res.data;
					console.log("hangleList",hangleList);
					hangleList.forEach((item, index) => {
						console.log("item.module",item.module);
						if(item.module){
							let modelList = JSON.parse(item.module)
						item.modelInfo = "";
						modelList.forEach((item2, index2) => {
							item.modelInfo += item2.name + "x" + item2.mount + "|";
						})
						console.log("item",item);
						}
					});


					const grouped = hangleList.reduce((acc, item) => {
						// 方法 1：直接截取 yyyy-mm-dd（推荐，性能最好）
						const dateKey = item.createTime.slice(0, 10);
						if (!acc[dateKey]) {
							acc[dateKey] = [];
						}
						acc[dateKey].push(item);
						return acc;
					}, {});

					// 转换为数组并按日期降序排序
					const groupedArray = Object.keys(grouped).map(date => ({
						date,
						items: grouped[date],
					}));

					groupedArray.sort((a, b) => new Date(b.date) - new Date(a.date));

					this.hangList = groupedArray;
					if (groupedArray.length > 0) {
						this.selectGDorder(groupedArray[0].items[0]);
					}
				})
			},
			memberSearch(query) {
				this.memberSearchOptions = [];
				if (query !== '') {
					this.memberSearchOptions = this.memberOptions.filter(item =>
						item.customName.toLowerCase().includes(query.toLowerCase())
					);
				} else {
					this.memberSearchOptions = this.memberOptions;
				}
			},
			memberSearchClear() {
				this.memberSearchKeyword = ''
				this.memberSearchOptions = this.memberOptions;
			},
			memberChange(status) {
				this.playSystemKeyClickSound();
				this.currentSelctCustomerType = 1;
				this.memberStyle = status;
				this.memberOptions = [];
				this.memberSearchOptions = [];
				this.memberSearchKeyword = "";
				member.memberList(this.currentCompanyId).then(res => {
					this.memberOptions.push({
						customName: "散客",
						id: ""
					})
					this.memberSearchOptions.push({
						customName: "散客",
						id: ""
					})
					this.memberOptions.push(...(res.data || []));
					this.memberSearchOptions.push(...(res.data || []));
					this.memberDialogVisible = true
				}).finally(() => {})
			},
			orderMemberChange() {


				this.memberChange('MemberChange');
				this.LastOrderShow = false;
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
						this.getlastOrder();
					}
				});
			},
			async payTypeDebt() {
				this.playSystemKeyClickSound();
				this.payAmount.debt = eval(this.payAmount.total - this.payAmount.BasketOffsetAmount);
				this.payAmount.actual = 0;
				this.currentPayWay = 0;
				//支付方式详情归零
				this.AccountExpense = {
					alipayAmount: 0,
					wxpayAmount: 0,
					cashAmount: 0,
					otherAmount: 0
				}

				await this.payTypeConfirm();
			},

			//订单发送
			orderSend() {
				let that = this;
				var CompanyId = this.currentCompanyId;
				var goodModelList = [];
				var userInfo = uni.getStorageSync("userInfo");
				console.log("this.goodSelect", this.goodSelect)
				//选择商品转化成后端订单商品对象
				for (var i = 0; i < this.goodSelect.length; i++) {
					var commodity = {
						Id: this.goodSelect[i].id,
						purchaseAssistId: this.goodSelect[i].purchaseAssistId,
						name: this.goodSelect[i].skuName,
						mount: this.goodSelect[i].quantity,
						totalWeight: this.goodSelect[i].allweight,
						commoditySpec: this.goodSelect[i].commoditySpec,
						stockType: this.goodSelect[i].stockType,
						commodityId: this.goodSelect[i].commodityId,
						tareWeight: this.goodSelect[i].carweight,
						saleWay:this.goodSelect[i].saleWay,
						referenceAmount: this.goodSelect[i].referenceAmount,
						subtotal: this.goodSelect[i].money,
						type: 1
					};
					//处理押筐物体(2.0押筐物体存放在extralModel,extralModel.id==""时候为空，不做处理)
					commodity.subModel = [];
					if (that.goodSelect[i].extralModel) {
						if (that.goodSelect[i].extralModel && that.goodSelect[i].extralModel.id != "") {
							commodity.subModel.push({
								Id: "00000000-0000-0000-0000-000000000000",
								commodityId: that.goodSelect[i].extralModel.id,
								name: that.goodSelect[i].extralModel.name,
								mount: that.goodSelect[i].extralModel.quantity,
								referenceAmount: that.goodSelect[i].extralModel.amount,
								totalWeight: 0,
								stockType: 0,
								subtotal: 0,
								tareWeight: 0,
								commoditySpec: null,
								type: 2
							})
						}
					}

					goodModelList.push(commodity);
				}
				//处理还筐物体
				for (var i = 0; i < this.repayBasketList.length; i++) {
					if (parseFloat(this.repayBasketList[i].quantity) > 0) {
						goodModelList.push({
							Id: "00000000-0000-0000-0000-000000000000",
							commodityId: this.repayBasketList[i].id,
							name: this.repayBasketList[i].name,
							mount: this.repayBasketList[i].quantity,
							totalWeight: 0,
							tareWeight: 0,
							referenceAmount: this.repayBasketList[i].amount,
							subtotal: parseFloat(this.repayBasketList[i].quantity) * parseFloat(this
								.repayBasketList[i].amount),
							type: 4
						})
					}
				}

				console.log("goodModelList",goodModelList)

				//请求主体
				var param = {
					CompanyId: CompanyId,
					CustomName: this.currentMember.customName,
					CustomerId: this.currentMember.id,
					Status: 1,
					accountType: 0,
					operatorId: userInfo.id,
					Module: JSON.stringify(goodModelList),
					Payway: this.currentPayWay,
					PayableAmount: eval(this.payAmount.total),
					ActualMoney: eval(this.payAmount.actual),
					Debt: eval(this.payAmount.debt),
					ExtraMoney: this.payAmount.ExtraMoney,
					BasketOffsetAmount: this.payAmount.BasketOffsetAmount ? Number(this.payAmount.BasketOffsetAmount) :
						0
				}
				//插入费用支付方式详情
				param.accountExpense = this.AccountExpense;

				//处理优惠金额或多收金额
				if (this.accountDiscount) {
					param.discountAmount = this.discountAmount;
					param.overchargeAmount = 0;
				} else {
					param.discountAmount = 0;
					param.overchargeAmount = this.discountAmount;
				}
				//1.0用到的挂单转正式单（2.0弃用）
				if (this.currentOrderInfo != null && this.currentOrderInfo.Id) {
					param.Id = this.currentOrderInfo.Id;
					param.accountCode = this.currentOrderInfo.accountCode;
				}
				console.log("param", param)
				cashierOrder.CreateAccount(JSON.stringify(param)).then(res => {
					if (res.data != null && res.data != "" && res.data == "success") {

						//重置新建订单对象	
						that.resetOrder();
						that.payTypeDialogVisible = false;

						//获取最新的订单放在上面横幅栏
						that.getlastOrder_print().then(res2 => {
							if (that.fixedPayPrint) {
								that.printerModel(res2.data);
							}
							that.popup_paysuccess_show = true;
						})

					} else {
						uni.showToast({
							title: `创建失败:${res.data}`,
							duration: 2000
						});
					}
				})
			},
			async payTypeConfirm() {
				this.playSystemKeyClickSound();
				let that = this;
				if (eval(this.payAmount.total) === 0) {
					uni.showToast({
						title: "订单金额必须大于0",
						icon: "error",
						duration: 2000
					});
					return;
				} else {
					if (this.currentMember.id != null && this.currentMember.id != "" && this.memberEventInfo
						.collectBasketNum > 0) {
						await this.payBasket_beforePay();
					}
					//打开收银界面
					this.orderSend();

				}
			},
			resetAction() {
				let that = this;
				uni.showModal({
					title: '确认清空',
					content: '您确定要清空物品吗？',
					success: (res) => {
						if (res.confirm) {
							that.resetOrder();
						}
					}

				})
			},
			resetOrder() {
				let that = this;
				that.payAmount = {
					total: 0,
					actual: 0,
					debt: 0,
					ExtraMoney: 0,
					BasketOffsetAmount: 0
				};
				that.currentOrderInfo = {
					Id: "",
					accountCode: ""
				};
				that.goodSelect = [];
				that.currentMember = {};
				// 重置运费
				that.shippingFee = 0;
				that.getlastOrder();
				that.getCategoryList();
				that.extraModel.forEach(x => {
					x.quantity = 0;
					x.money = 0;
				})
				that.memberEventInfo = {
					member: null,
					collectBasketNum: 0
				}

			},
			showLastOrder() {
				this.LastOrderShow = true;
			},
			refreshHeaderInfo() {
				this.$refs.headerInfo.refresh();
			},
			//收筐
			payBasketConfirm() {
				if (parseInt(this.memberEventInfo.collectBasketNum) === 0) {
					uni.showToast({
						title: "收筐数量必须大于0",
						icon: "error",
						duration: 2000
					});
					return;
				}
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param = {
					customerId: this.memberEventInfo.member.id,
					repayBasket: parseFloat(this.memberEventInfo.collectBasketNum),
					orderList: [],
					operatorId: userInfo.id,
					operatorName: userInfo.userName,
					CompanyId: CompanyId,
					customerName: this.memberEventInfo.member.customName
				}
				member.RepayBasket(JSON.stringify(param)).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: "收筐成功",
							icon: "success",
							duration: 2000
						});
					} else {
						uni.showToast({
							title: "收筐失败",
							icon: "error",
							duration: 2000
						});
					}
					this.inputModelVisible = false;
					this.memberEventInfo = {
						member: null,
						collectBasketNum: 0
					}
				})
			},
			async payBasket_beforePay() {
				if (this.currentMember?.id == null || this.currentMember?.id == "") return;
				var userInfo = uni.getStorageSync("userInfo");
				var CompanyId = uni.getStorageSync('companyId');
				let param = {
					customerId: this.currentMember.id,
					repayBasket: parseFloat(this.memberEventInfo.collectBasketNum),
					orderList: [],
					operatorId: userInfo.id,
					operatorName: userInfo.userName,
					CompanyId: CompanyId,
					customerName: this.currentMember.customName
				}
				await member.RepayBasket(JSON.stringify(param));
			},
			//挂单
			hangOrder() {
				this.playSystemKeyClickSound();
				if (this.goodSelect.length === 0) return;
				let that = this;
				var CompanyId = this.currentCompanyId;
				var goodModelList = [];
				var userInfo = uni.getStorageSync("userInfo");
				console.log("this.goodSelect", this.goodSelect)
				//选择商品转化成后端订单商品对象
				for (var i = 0; i < this.goodSelect.length; i++) {
					var commodity = {
						Id: this.goodSelect[i].id,
						purchaseAssistId: this.goodSelect[i].purchaseAssistId,
						name: this.goodSelect[i].skuName,
						mount: this.goodSelect[i].quantity,
						totalWeight: this.goodSelect[i].allweight,
						commoditySpec: this.goodSelect[i].commoditySpec,
						stockType: this.goodSelect[i].stockType,
						commodityId: this.goodSelect[i].commodityId,
						tareWeight: this.goodSelect[i].carweight,
						saleWay:this.goodSelect[i].saleWay,
						referenceAmount: this.goodSelect[i].referenceAmount,
						subtotal: this.goodSelect[i].money,
						type: 1
					};
					//处理押筐物体(2.0押筐物体存放在extralModel,extralModel.id==""时候为空，不做处理)
					commodity.subModel = [];
					if (that.goodSelect[i].extralModel) {
						console.log("that.goodSelect[i].extralModel", that.goodSelect[i].extralModel)
						if (that.goodSelect[i].extralModel && that.goodSelect[i].extralModel.id != "") {
							commodity.subModel.push({
								Id: "00000000-0000-0000-0000-000000000000",
								commodityId: this.goodSelect[i].extralModel.id,
								name: this.goodSelect[i].extralModel.name,
								mount: this.goodSelect[i].extralModel.quantity,
								referenceAmount: this.goodSelect[i].extralModel.amount,
								totalWeight: 0,
								stockType: 0,
								commodityId: "",
								subtotal: 0,
								tareWeight: 0,
								commoditySpec: null,
								type: 2
							})
						}
					}

					goodModelList.push(commodity);
				}

				var param = {
					CompanyId: CompanyId,
					CustomName: this.currentMember.customName,
					CustomerId: this.currentMember.id,
					Status: 0,
					accountType: 0,
					Module: JSON.stringify(goodModelList),
					Payway: -1,
					PayableAmount: this.payAmount.total,
					ActualMoney: 0,
					Debt: 0,
					ExtraMoney: 0
				}
				if (this.currentOrderInfo != null && this.currentOrderInfo.Id) {
					param.Id = this.currentOrderInfo.Id;
					param.accountCode = this.currentOrderInfo.accountCode;
				}
				cashierOrder.CreateGD(JSON.stringify(param)).then(res => {
					if (res.data != null || res.data != "") {
						uni.showToast({
							title: '挂单成功',
							duration: 2000
						});
						this.currentMember = {};
						this.resetOrder();
					}
				})
			},

			downLoadImage(base64) {
				let that = this;
				const bitmap = new plus.nativeObj.Bitmap("test");
				bitmap.loadBase64Data(base64, function() {
					const url = "_doc/" + new Date().getTime() + ".png"; // url为时间戳命名方式
					bitmap.save(url, {
						overwrite: true, // 是否覆盖
						quality: 10 // 图片清晰度
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
			shareOrder(id) {
				cashierOrder.GetCanvasBase64ById(id).then(res => {
					if (res.code == 200) {
						this.downLoadImage(res.data);
					}
				})

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

		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/cashier.scss";

	.Numberinput {
		display: flex;
		align-items: center;
	}

	.myfous {
		width: 1rpx;
		height: 41rpx;
		background-color: #000;
		display: block;
		animation: mytreat 1.5s linear infinite;
	}

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 40rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 20rpx;

	}

	.mybrankmask .MymaskList .large {
		font-weight: bold;
		height: 65;
		/* 设置更高的高度 */
		line-height: 65rpx;
		/* 使文本垂直居中 */
		z-index: 5;
		font-size: 12rpx;
	}

	.mybrankmask .MymaskList .maskListItem {
		font-weight: bold;
		width: 23%;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 10rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		font-size: 25rpx;
	}

	.mybrankmask .MymaskList .maskListItem:active {
		width: 25%;
		height: 45rpx;
		margin-top: -3rpx;
		margin-left: -1%;
	}

	.mybrankmask .MymaskList .maskListItem2 {
		font-weight: bold;
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList {
		display: flex;
		width: 100%;
		height: 40rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem {
		font-weight: bold;
		width: 30%;
		height: 40rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 40rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem:active {
		width: 32%;
		height: 45rpx;
		margin-top: -3rpx;
		margin-left: -1%;
	}

	.mybrankmask2 .MymaskList .maskListItem2 {
		font-weight: bold;
		width: 23%;
		height: 30rpx;
		color: #ffffff;
		background-color: #ffffff;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 12rpx;
	}

	.mybrankmask2 .MymaskList .maskListItem3 {
		font-weight: bold;
		width: 48%;
		height: 30rpx;
		color: #ffffff;
		background-color: #5d5d5d;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		font-size: 20rpx;
	}

	/* 新增样式 */
	.mybrankmask2 .MymaskList .large {
		font-size: 12rpx;
		height: 100rpx;
		/* 设置更高的高度 */
		line-height: 100rpx;
		/* 使文本垂直居中 */
		z-index: 5;
	}

	.custom-input {
		font-weight: bold;
		border: 2px solid #9c9c9c;
		/* 默认边框颜色 */
		border-radius: 5px;
		/* 可选：设置圆角 */
		padding: 5px;
		/* 可选：添加内边距 */
		height: 55rpx;
		width: 45%;
		/* 可选：设置宽度 */
		box-sizing: border-box;
		/* 确保内边距和边框包含在宽度内 */
		transition: border-color 0.3s;
		/* 添加过渡效果 */
	}

	.input-focused {
		height: 55rpx;
		width: 47%;
		border: 3px solid #31BDEC;
		/* 聚焦时边框颜色 */
	}

	/* 现代化收银弹窗样式 */
	.modern-payment-modal {
		.payment-modal-container {
			background: #e2e8f0;
			border-radius: 12rpx;
			padding: 5rpx;
			position: relative;
			height: 400rpx;
			overflow: hidden;
		}

		.modal-close-btn {
			position: absolute;
			top: 8rpx;
			right: 8rpx;
			width: 32rpx;
			height: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.9);
			cursor: pointer;
			transition: all 0.3s ease;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
			z-index: 10;

			&:hover {
				background: #f1f5f9;
				transform: scale(1.1);
			}
		}

		.customer-info-section {
			margin-bottom: 12rpx;
			text-align: center;

			.customer-badge {
				display: inline-block;
				padding: 8rpx 16rpx;
				border-radius: 16rpx;
				font-weight: 600;
				font-size: 24rpx;
				color: white;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

				&.normal {
					background: linear-gradient(135deg, #3b82f6, #1d4ed8);
				}

				&.debt {
					background: linear-gradient(135deg, #ef4444, #dc2626);
				}

				.customer-name {
					font-size: 26rpx;
					margin-bottom: 2rpx;
				}

				.debt-info {
					font-size: 18rpx;
					opacity: 0.9;
				}
			}
		}

		.payment-content-grid {
			display: grid;
			grid-template-columns: 1fr 0.8fr;
			gap: 5rpx;
			height: 400rpx;
		}

		.left-input-section {
			display: flex;
			flex-direction: column;
			gap: 6rpx;

			.amount-inputs-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
				flex: 1;

				.section-title {
					font-size: 15rpx;
					font-weight: 600;
					color: #888888;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;
				}

				.amount-inputs {
					display: flex;
					flex-direction: column;
					gap: 3rpx;

					.input-row {
						display: flex;
						align-items: center;
						gap: 6rpx;
						padding: 3rpx 6rpx;
						border: 1rpx solid #e2e8f0;
						border-radius: 4rpx;
						transition: all 0.3s ease;
						cursor: pointer;
						min-height: 28rpx;

						&:hover {
							border-color: #cbd5e1;
						}

						&.active {
							border-color: #3b82f6;
							background: #eff6ff;
						}

						.input-label {
							font-size: 18rpx;
							font-weight: 500;
							color: #374151;
							min-width: 80rpx;
						}

						.amount-input {
							flex: 1;
							border: none;
							outline: none;
							font-size: 18rpx;
							font-weight: 600;
							text-align: center;
							background: transparent;
							color: #1e293b;
						}

						.collect-btn {
							background: #8b5cf6;
							color: white;
							border: none;
							border-radius: 3rpx;
							padding: 0 8rpx;
							height: 24rpx;
							line-height: 24rpx;
							font-size: 14rpx;
							font-weight: 500;
							cursor: pointer;
							transition: all 0.3s ease;

							&:hover {
								background: #7c3aed;
							}
						}
					}

					.discount-row {
						.discount-toggle {
							display: flex;
							border-radius: 3rpx;
							overflow: hidden;
							border: 1rpx solid #d1d5db;

							.discount-btn {
								background: white;
								border: none;
								padding: 0 6rpx;
								height: 22rpx;
								line-height: 22rpx;
								font-size: 14rpx;
								color: #6b7280;
								cursor: pointer;
								transition: all 0.3s ease;

								&:first-child {
									border-right: 1rpx solid #d1d5db;
								}

								&.active {
									background: #3b82f6;
									color: white;
								}
							}
						}
					}
				}
			}

			.payment-methods-section {
				background: white;
				border-radius: 8rpx;
				padding: 8rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

				.section-title {
					font-size: 15rpx;
					font-weight: 600;
					color: #1e293b;
					margin-bottom: 6rpx;
					padding-bottom: 4rpx;
					border-bottom: 1rpx solid #e2e8f0;
				}

				.payment-methods-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 6rpx;
				}

				.payment-method-card {
					background: #f8fafc;
					border: 1rpx solid #e2e8f0;
					border-radius: 4rpx;
					padding: 6rpx 4rpx;
					text-align: center;
					cursor: pointer;
					transition: all 0.3s ease;
					position: relative;
					min-height: 50rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					&:hover {
						border-color: #3b82f6;
						box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.15);
						transform: translateY(-1rpx);
					}

					&.active {
						background: linear-gradient(135deg, #3b82f6, #1d4ed8);
						border-color: #3b82f6;
						color: white;
						box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.25);

						.payment-label, .payment-amount {
							color: white;
						}
					}

					.payment-method-card-content {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 2rpx;
					}

					.payment-icon {
						margin-bottom: 2rpx;
					}

					.payment-label {
						font-size: 16rpx;
						font-weight: 500;
						color: #374151;
					}

					.payment-amount {
						font-size: 14rpx;
						color: #6b7280;
						font-weight: 600;
						margin-top: 2rpx;
					}
				}
			}
		}

		.right-keypad-section {
			background: white;
			border-radius: 8rpx;
			padding: 8rpx;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			display: flex;
			flex-direction: column;
			gap: 6rpx;

			.customer-info-section {
				text-align: center;

				.customer-badge {
					display: inline-block;
					padding: 6rpx 12rpx;
					border-radius: 12rpx;
					font-weight: 600;
					font-size: 20rpx;
					color: white;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

					&.normal {
						background: linear-gradient(135deg, #3b82f6, #1d4ed8);
					}

					&.debt {
						background: linear-gradient(135deg, #ef4444, #dc2626);
					}

					.customer-name {
						font-size: 22rpx;
						margin-bottom: 2rpx;
					}

					.debt-info {
						font-size: 16rpx;
						opacity: 0.9;
					}
				}
			}

			.modern-keypad {
				display: grid;
				gap: 1rpx;
				flex: 1;

				.keypad-row {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					gap: 1rpx;

					.keypad-btn {
						height: 60rpx;
						line-height: 60rpx;
						width: 60rpx;
						border: none;
						border-radius: 4rpx;
						background: #f1f5f9;
						color: #374151;
						font-size: 30rpx;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.2s ease;
						box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.1);

						&:hover {
							background: #e2e8f0;
							transform: translateY(-1rpx);
						}

						&:active {
							transform: translateY(0);
						}

						&.delete-btn {
							background: #ef4444;
							color: white;

							&:hover {
								background: #dc2626;
							}
						}
					}
				}
			}

			.action-buttons {
				display: grid;
				grid-template-columns: 1fr 2fr;
				gap: 6rpx;

				.action-btn {
					height: 35rpx;
					width: 100rpx;
					line-height: 35rpx;
					border: none;
					border-radius: 4rpx;
					font-size: 18rpx;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.3s ease;
					box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

					&.debt-btn {
						background: linear-gradient(135deg, #f59e0b, #d97706);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #d97706, #b45309);
							transform: translateY(-1rpx);
						}
					}

					&.confirm-btn {
						background: linear-gradient(135deg, #10b981, #059669);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #059669, #047857);
							transform: translateY(-1rpx);
						}
					}

					&.confirm-btn2 {
						width: 200rpx;
						background: linear-gradient(135deg, #10b981, #059669);
						color: white;

						&:hover {
							background: linear-gradient(135deg, #059669, #047857);
							transform: translateY(-1rpx);
						}
					}
				}
			}
		}
	}

	.activepayment {
		background-color: dodgerblue;
		// border-radius: 10rpx;
		color: white;
		border: 1px solid dodgerblue;
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
		width: 22%;
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
		padding: 2rpx;
		/* 内边距 */
		margin: 5rpx;
		/* 格子之间的间距 */
		border: 1px solid #ccc;
		/* 边框 */
		border-radius: 5px;
		/* 垂直居中 */
		background-color: #f9f9f9;
		/* 背景颜色 */
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		font-weight: bold;
	}

	.table-row {
		display: flex;
		border-bottom: 1px solid #dfdfdf;

	}

	.table-header-cell,
	.table-cell {
		flex: 1;
		padding: 10px;
		text-align: left;
	}

	.table-header-cell {
		font-weight: bold;
		background-color: #b5b5b5;
		font-size: 12rpx;
	}

	.table-cell2 {
		flex: 1;
		padding: 5px;
		text-align: left;
		font-size: 12rpx;
	}


	.step1-input {
		font-size: 20rpx;
		font-weight: bold;
		text-align: center;
	}

	.currency-label {
		margin-top: 15rpx
	}


	.pay-type {
		.body {
			margin: 16px 0;

			.pay-list {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8px;
			}

			.pay-item {
				cursor: pointer;
				width: 100%;
				height: 100%;
				border: 1px solid $m-border-color;
				border-radius: 4px;
				background: $m-white-color;
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
				transition: transform 0.2s cubic-bezier(0.32, 0.08, 0.24, 1);
				box-shadow: 0 1px 3px $m-shadow-color;
			}

			.pay-item:hover {
				backdrop-filter: blur(15px) saturate(0.9) brightness(1.4);
			}

			.pay-item.active {
				color: $m-primary;
				border: 1px solid $m-primary;
				backdrop-filter: blur(15px) saturate(0.9) brightness(1.4);
			}

			.scan-pay {
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;

				.text {
					color: $m-main-color;
					padding-top: 32px;
				}
			}

			.selected-input {
				border-color: #009ae7;
				color: #009ae7;
				/* 选中时的边框颜色 */
			}
		}

		.payComfirmBtn1 {
			padding: 5rpx;
			font-size: 20rpx;
			width: 100rpx;
			height: 35rpx;
			font-weight: bolder;
			color: white;
			border: 1px solid #DD8410;
			background: #DD8410;
			box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.3);
		}

		.payComfirmBtn1 :active {
			width: 106rpx;
			margin-left: -3rpx;

		}



	}

	.key-word {
		display: flex;
		margin-top: 13px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		font-size: 25px;
		gap: 5px;
		/* 上下间距 5px */
	}

	.key-word-active {
		color: dodgerblue;
	}

	.btn_discount {
		background-color: transparent;
		border: 1px solid dodgerblue;
		border-right: 0px;
		height: 25rpx;
		line-height: 25rpx;
		color: dodgerblue;
		border-radius: 5rpx 0 0 5rpx;
	}

	.btn_discount.active {
		background-color: dodgerblue;
		color: white;
	}

	.btn_overcharge {
		background-color: transparent;
		border: 1px solid dodgerblue;
		color: dodgerblue;
		border-radius: 0 5rpx 5rpx 0;
		height: 25rpx;
		line-height: 25rpx;
	}

	.btn_overcharge.active {
		background-color: dodgerblue;
		color: white;
	}

	.search-member {
		display: flex;
	}

	.search-member-left {
		flex: 1;
	}

	.search-member-select {
		background-color: gainsboro;
		border-radius: 5rpx;
		display: flex;
	}

	.search-member-select-text {
		flex: 1;
		text-align: center;
		border-radius: 5rpx;
		padding: 5rpx;
		font-size: 15rpx;
		font-weight: bold;
		color: darkgrey;
	}

	.search-member-select-text-active {
		background-color: #009ae7;
		color: white;
	}

	.search-member-right {
		flex: 2;
		display: flex;
	}
</style>