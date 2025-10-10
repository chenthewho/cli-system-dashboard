<template>
	<div>
		<div style="display: flex; width: 100%;">
			<div style="width: 220rpx; background-color: #ffffff;display: flex;">
				<div>
					<div style="display: flex;margin-left: 5rpx;margin-top: 5rpx;line-height: 18rpx;">
						<div style="align-items: left;">
							<button
								style="height: 18rpx;line-height: 18rpx;color:#ffffff;font-weight: bold;background: #dddddd;"
								@click="back"><uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15"
									color="#ffffff" style="margin-right: 5px;"></uni-icons>返回</button>
						</div>
						<text style="font-size: 15rpx;font-weight: bold;color: #333;margin-left: 10rpx;">选择货品</text>
					</div>
					<scroll-view class="scroll-view2" scroll-x style="height:60px;width: 200rpx;margin-top: 10px;">
						<div style="margin-top: 5rpx;margin-left: 20rpx;">
							<view :class="{'coach_wrap': true,'coach_wrap_active': activeType == item.name}"
								v-for="(item, index) in tabList" :key="index" @click="changeTab(item)">
								{{item.name}}
							</view>

						</div>
					</scroll-view>
					<div style="
	          width: 205rpx;
	          height: 30rpx;
			  margin: 5rpx;
	          background: grey;
	          color: white;
	          line-height: 30rpx;
	          text-align: center;
	          border-radius: 4rpx;
	          cursor: pointer;
			  font-size: 18rpx;
	          user-select: none;
	          font-weight: bold;
	          " @click="showAddNewGood=true">
						<uni-icons custom-prefix="iconfont" type="icon-plus-square" size="30" color="#ffffff"
							style="margin-right: 5px;line-height: 30rpx;"></uni-icons>新增货品
					</div>
					<!-- 圆弧边卡片 -->
					<div>
						<scroll-view class="scrollArea" scroll-y="true"
							:style="{ height: scrollHeight + 'px',width:'217rpx',backgroundColor:'#ddd' }">
							<div
								style="display: flex; flex-direction: column; gap: 5rpx;background-color: #ddd;height: 100%;">
								<div style="margin-top: 2rpx;"></div>
								<div style="display: flex; flex-wrap: wrap; ">
									<div :id="'grid-item-'+item.id" :class="['clickCard',getCommdityActive(item.id)?'activeCard':'' ]"
										@click="addCommodity(item)" v-for="item in commodityShowList">
										<div>
											<text style="font-size: 15rpx;font-weight: bold;">
												{{item.commodityName}}
											</text>
											<br>
											<text v-if="item.saleWay===1"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #31BDEC;border: 1px solid #31BDEC;border-radius: 2rpx;">非定装</text>
											<text v-if="item.saleWay===2"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #00aa00;border: 1px solid #00aa00;border-radius: 2rpx;">定装</text>
											<text v-if="item.saleWay===3"
												style="margin-top: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #aa55ff;border: 1px solid #aa55ff;border-radius: 2rpx;">定装拆包</text>
											<text v-if="item.extralModel"
												style="margin-top: 5rpx;margin-left: 5rpx; font-size: 10rpx; padding-left: 2rpx;padding-right: 2rpx;color: #ff5500;border: 1px solid #ff5500;border-radius: 2rpx;">{{item.extralModel.name}}</text>
										</div>
									</div>
								</div>
							</div>
						</scroll-view>

					</div>

				</div>
				<!-- 垂直线 -->
				<div style="width: 3rpx; background-color: #ccc; "></div>
			</div>
			<div style="flex: 1; background-color: #ffffff; text-align: right;">
				<div
					style="height: 40rpx; margin-left: 5rpx;margin-right: 5rpx; display: flex; justify-content: space-between; align-items: center;">
					<div style="font-size: 15rpx; font-weight: bold;">
						{{currentShipper.shipperName}} — 采购单
					</div>
			<div style="font-size: 15rpx; font-weight: bold;">
				<button v-if="totalExpense === 0" class="add-expense-btn" @click="showExpenseModal">添加费用</button>
				<view v-else class="expense-label" @click="showExpenseModal">
					<text class="expense-label-text">费用：¥{{ totalExpense.toFixed(2) }}</text>
				</view>
			</div>
				</div>
				<div :style="{marginLeft: '5rpx',marginRight: '5rpx', height: (windowHeight-60)+'px'}">
				<!-- 表头 -->
				<!-- 表头 -->
				<div
					style="display: flex; background-color: #b9b9b9 ; font-weight: bold; border-bottom: 1px solid #f4f4f4;">
					<div style="flex: 3; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">货品</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库数量
					</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库重量
					</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">采购单价
					</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">成本单价
					</div>
					<div style="flex: 2; padding: 8px; border-right: 1px solid #f4f4f4; text-align: left;">入库金额
					</div>
					<div style="width: 40rpx;padding: 8px; border-right: 1px solid #f4f4f4; text-align: center;">操作
					</div>
				</div>

					<scroll-view class="scrollArea" scroll-y="true" :style="{height:scrollHeight2}"
						:scroll-into-view="targetId">
						<div style="display: flex; height: 25rpx;" v-for="(item, index) in BatchCommodityList"
							:id="'id-' + index + '-view'" :key="index"
							:style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }">
							<div
								style="flex: 3; padding: 5px; text-align: left; font-weight: bold; line-height: 20rpx;">

								<!--商品名称栏-->
								<view style="display: flex;">
									<!--左边-->
									<view>
										{{ item.name }}
									</view>
									<!--右边-->
									<view>
										<zero-switch @change="SwitchCalcType($event, item)" text-on="数量" text-off="重量"
											:show-text="true"></zero-switch>
									</view>
								</view>

							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,1)" inputmode="none" class="input1"
									v-model="item.initMount" />
							</div>
							<div style="flex: 2; padding: 4px; text-align: left;">
								<input @click="showKeyBorad(index,2)" inputmode="none" class="input1"
									v-model="item.initWeight" />
							</div>
						<div style="flex: 2; padding: 4px; text-align: left;">
							<input @click="showKeyBorad(index,3)" inputmode="none" class="input1"
								v-model="item.incomingPrice" />
						</div>
						<div style="flex: 2; padding: 4px; text-align: center; display: flex; align-items: center;">
							<span style="font-weight: bold; color: #ff6600;font-size: 15rpx;">{{ getCostPrice(item) }}</span>
						</div>
						<div style="flex: 2; padding: 4px; text-align: left;">
							<input @click="showKeyBorad(index,4)" inputmode="none" class="input1"
								v-model="item.inboundAmount" />
						</div>
							<div
								style="width: 40rpx; padding: 4px; border-right: 1px solid #f4f4f4; text-align: center; line-height: 20rpx;">
								<uni-icons custom-prefix="iconfont" type="icon-shanchu" size="20"
									@click="deleteBatchCommdity(index)" color="#aa0000"></uni-icons>
							</div>
						</div>
					<div class="total-content">
						<div class="total-content-item" style="flex: 3;">
							总计：
						</div>
						<div class="total-content-item" style="flex: 2;">
							总数：{{totalInitInventory()}}
						</div>
						<div class="total-content-item" style="flex: 2; ">
							总重：{{totalInitWeight()}}
						</div>
						<div class="total-content-item" style="flex: 2; ">

						</div>
						<div class="total-content-item" style="flex: 2; ">
							
						</div>
						<div class="total-content-item" style="flex: 2; ">
							￥{{totalAmount()}}
						</div>
						<div class="total-content-item" style="width: 40rpx;">

						</div>
					</div>
					</scroll-view>
					<!--键盘-->
					<div v-if="showKeyBoard1">
						<view class="mybrankmask"
							:style="{ width: '340rpx', height: '150rpx', backgroundColor: '#ffffff', zIndex: 999, left: 0, bottom: 0 }">
							<view style="padding: 5rpx;">
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(1)">1</view>
									<view class="maskListItem" @click="NumberCk(2)">2</view>
									<view class="maskListItem" @click="NumberCk(3)">3</view>
									<view class="maskListItem " @click="Tuige()"><uni-icons custom-prefix="iconfont"
											type="icon-tuige" size="30" color="#ffffff"
											style="margin-right: 5rpx;"></uni-icons>
									</view>

								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(4)">4</view>
									<view class="maskListItem" @click="NumberCk(5)">5</view>
									<view class="maskListItem" @click="NumberCk(6)">6</view>

									<view class="maskListItem" @click="NumberCk('+')"
										style="font-size: 25px;color: white;">
										+</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(7)">7</view>
									<view class="maskListItem" @click="NumberCk(8)">8</view>
									<view class="maskListItem" @click="NumberCk(9)">9</view>
									<view class="maskListItem" @click="NumberCk('-')"
										style="font-size: 25px;color: white;">
										-</view>
								</view>
								<view class="MymaskList">
									<view class="maskListItem" @click="NumberCk(0)" style="width: 48%;">0</view>
									<view class="maskListItem" @click="NumberCk('.')">.</view>
									<view class="maskListItem" style="background-color: #31BDEC;color: white;"
										@click="hideBorad">确定
									</view>
								</view>
							</view>
						</view>
					</div>
				</div>

				<div style="position: fixed;bottom: 0;height: 30rpx;background: #ffffff;width: 100%;"
					v-if="!showKeyBoard1&&showComfirmBtn">
					<div style="height: 1rpx;width: 99%;background-color: #909090;"></div>
					<button
						style="position: fixed;width: 50rpx;right: 10px;font-weight: bold;height: 25rpx;background-color: #008200;color: white;margin-top: 3rpx;line-height: 25rpx;"
						@click="saveBatchGood">确认</button>
				</div>
			</div>


		</div>


	<!-- 添加新货品弹窗 -->
	<view v-if="showAddNewGood" class="znj-add-good-modal-mask" @click="showAddNewGood = false">
		<view class="znj-add-good-modal-wrapper" @click.stop>
			<view class="znj-add-good-modal-container">
				<!-- 标题栏 -->
				<view class="znj-add-good-modal-header">
					<text class="znj-add-good-modal-title">添加新货品</text>
					<view class="znj-add-good-modal-close" @click="showAddNewGood = false; newGoodInfoReset();">
						<uni-icons type="closeempty" size="24" color="#fff"></uni-icons>
					</view>
				</view>
				
				<!-- 内容区域 -->
				<scroll-view scroll-y="true" class="znj-add-good-modal-body" :style="{ maxHeight: '70vh' }">
					<view class="znj-add-good-form">
					<!-- 货品名称 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">货品名称：</text>
						<input class="znj-add-good-input" type="text" placeholder="请输入货品名称"
							v-model="newGoodInfo.name" />
					</view>
					<!-- 计算方式 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">计算方式：</text>
						<view class="znj-add-good-btn-group">
							<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 1}" @click="changSaleType(1)">按重量</button>
							<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 2}" @click="changSaleType(2)">按件数</button>
							<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 3}" @click="changSaleType(3)">按件拆包</button>
							<button class="znj-add-good-type-btn" :class="{active: newGoodInfo.saleWay === 4}" @click="changSaleType(4)">散装</button>
						</view>
					</view>
					<!-- 单位 -->
					<view class="znj-add-good-row">
					<text class="znj-add-good-label">单位：</text>
					<view class="znj-add-good-unit-group" v-if="newGoodInfo.saleWay != 3">
						<button v-for="unit in unitList.slice(0, 4)" :key="unit.id" 
							class="znj-add-good-unit-btn" 
							:class="{active: newGoodInfo.unit === unit.unitName}" 
							@click="selectUnit(unit.unitName)">{{ unit.unitName }}</button>
				</view>
					<view v-else>
						<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[0].specName" @change="updateMainUnit">
							<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
						</select>
					</view>
					</view>
					
					<!-- 规格相关 -->
					<div v-if="newGoodInfo.saleWay != 1">
						<!-- 按件数规格 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 2">
							<text class="znj-add-good-label">规格：</text>
							<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.unit }} =</span>
								<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.price" placeholder="" />
								<span class="znj-add-good-spec-suffix">元</span>
							</div>
						</view>
						<!-- 按件拆包规格 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 3">
							<text class="znj-add-good-label">规格一：</text>
							<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
								<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[0].fixprice" placeholder="" />
								<span class="znj-add-good-spec-suffix">元</span>
							</div>
						</view>
						<!-- 规格二 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.specList.length > 1">
							<text class="znj-add-good-label">规格二：</text>
							<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[0].specName }} =</span>
								<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[1].fixcount" placeholder="" />
						</div>
						<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[1].specName">
							<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
						</select>
						<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
								<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[1].fixprice" placeholder="" />
								<span class="znj-add-good-spec-suffix">元</span>
							</div>
						</view>
						<!-- 规格三 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.specList.length > 2">
							<text class="znj-add-good-label">规格三：</text>
							<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[1].specName }} =</span>
								<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.specList[2].fixcount" placeholder="" />
						</div>
						<select class="znj-add-good-unit-select" v-model="newGoodInfo.specList[2].specName">
							<option v-for="unit in unitList" :key="unit.id" :value="unit.unitName">{{ unit.unitName }}</option>
						</select>
						<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.specList[2].specName }} =</span>
								<input class="znj-add-good-spec-input" type="number" v-model="newGoodInfo.specList[2].fixprice" placeholder="" />
								<span class="znj-add-good-spec-suffix">元</span>
							</div>
						</view>
						<!-- 散装规格 -->
						<view class="znj-add-good-row" v-if="newGoodInfo.saleWay == 4">
							<text class="znj-add-good-label">规格：</text>
							<div class="znj-add-good-spec-box">
								<span class="znj-add-good-spec-prefix">1 {{ newGoodInfo.unit }} =</span>
								<input class="znj-add-good-spec-input" type="text" v-model="newGoodInfo.price" placeholder="" />
								<span class="znj-add-good-spec-suffix">元</span>
							</div>
						</view>
						<!-- 添加规格按钮 -->
						<div v-if="newGoodInfo.saleWay === 3">
							<view class="znj-add-good-row" v-if="newGoodInfo.specList.length < 3" style="margin-top: 10rpx;">
								<text class="znj-add-good-label"></text>
								<button class="znj-add-good-btn add" @click="addSpec">添加规格</button>
							</view>
						</div>
					</div>
					
					<!-- 分割线 -->
					<view class="znj-add-good-divider"></view>
					
					<!-- 单位重量 -->
					<view class="znj-add-good-row" v-if="newGoodInfo.saleWay === 2">
						<text class="znj-add-good-label">单位重量：</text>
						<input class="znj-add-good-input" type="text" v-model="newGoodInfo.initWeight" placeholder="" />
					</view>
					
					<!-- 单位皮重 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">单位皮重：</text>
						<input class="znj-add-good-input" type="text" v-model="newGoodInfo.fixTare" placeholder="" />
					</view>
					
					<!-- 是否显示 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">是否显示：</text>
						<div class="znj-add-good-switch-group">
							<button class="znj-add-good-switch-btn" :class="{active: newGoodInfo.showToSale === 1}" @click="newGoodInfo.showToSale = 1">是</button>
							<button class="znj-add-good-switch-btn" :class="{active: newGoodInfo.showToSale === 0}" @click="newGoodInfo.showToSale = 0">否</button>
						</div>
					</view>
					
					<!-- 选择货品分类 -->
					<view class="znj-add-good-row">
						<text class="znj-add-good-label">货品分类：</text>
						<scroll-view class="scroll-view2" scroll-x style="height:60px;width: 500px;">
							<div style="margin-top: 5rpx;margin-left: 20rpx;">
								<view :class="{'coach_wrap': true,'coach_wrap_active': newGoodInfo.classifyId == item.value}"
									v-for="(item, index) in tabListOrigin" :key="index"
									@click="selectCategory(item.value)">
									{{item.name}}
								</view>
							</div>
						</scroll-view>
					</view>
					<!-- 操作按钮 -->
					<view class="znj-add-good-btns">
						<button class="znj-add-good-btn cancel" @click="showAddNewGood = false;newGoodInfoReset();">返回</button>
						<button class="znj-add-good-btn confirm" @click="addNewGood">添加</button>
					</view>
				</view>
				</scroll-view>
			</view>
		</view>
	</view>

		<!-- 添加费用弹窗 -->
		<view v-if="expenseModalVisible" class="expense-modal-mask" @click="cancelExpense">
			<view class="expense-modal-wrapper" @click.stop>
				<view class="expense-modal-container">
				<!-- 标题区域 -->
				<view class="expense-modal-header">
					<text class="header-title">添加费用</text>
					<text class="header-subtitle">请输入费用金额并选择均摊方式</text>
				</view>
				
			<!-- 内容区域（可滚动） -->
			<scroll-view scroll-y="true" class="expense-modal-content" :style="{ maxHeight: '600rpx' }">
			<view class="expense-modal-content-inner">
					
					<!-- 费用金额输入框 -->
					<view class="input-wrapper">
							<view class="input-label">
								<text class="label-text">费用金额</text>
								<text class="label-required">*</text>
							</view>
							<view class="input-container">
								<text class="input-prefix">¥</text>
								<input 
									type="digit"
									v-model="tempExpenseAmount" 
									placeholder="0.00"
									class="expense-input"
									@input="validateExpenseAmount"
								/>
								<button 
									v-if="tempExpenseAmount && tempExpenseAmount > 0" 
									@click="tempExpenseAmount = 0"
									class="clear-expense-btn"
								>
									清空
								</button>
							</view>
							<text class="input-hint">费用将按选择的方式分摊到各商品</text>
						</view>
						
						<!-- 均摊方式选择 -->
						<view class="allocation-section">
							<text class="section-label">均摊方式</text>
							<view class="allocation-buttons">
								<view 
									v-for="method in allocationMethods" 
									:key="method.value"
									@click="selectedAllocationMethod = method.value"
									class="allocation-btn"
									:class="{ active: selectedAllocationMethod === method.value }"
								>
									<view class="allocation-btn-content">
										<uni-icons :type="method.icon" size="24" :color="selectedAllocationMethod === method.value ? '#fff' : '#606266'"></uni-icons>
										<text class="allocation-btn-text">{{ method.label }}</text>
									</view>
								</view>
							</view>
						<text class="allocation-hint" v-if="selectedAllocationMethod">
							{{ getAllocationHint() }}
						</text>
					</view>
					
				<!-- 费用类型选择 -->
				<view class="expense-type-section">
					<view class="section-label-wrapper">
						<text class="section-label">费用类型</text>
						<view class="add-type-btn" @click="showAddTypeModal">
							<uni-icons type="plusempty" size="20" color="#00aaff"></uni-icons>
						</view>
					</view>
					<view class="expense-type-buttons">
							<view 
								v-for="type in expenseTypes" 
								:key="type.id"
								@click="selectedExpenseType = type.id"
								class="expense-type-btn"
								:class="{ active: selectedExpenseType === type.id }"
							>
								<text class="expense-type-text">{{ type.label }}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
				
				<!-- 底部按钮 -->
					<view class="expense-modal-footer">
						<button class="btn-cancel" @click="cancelExpense">
							取消
						</button>
					<button 
						class="btn-confirm" 
						@click="confirmExpense"
						:class="{ disabled: tempExpenseAmount < 0 || !selectedAllocationMethod }"
						:disabled="tempExpenseAmount < 0 || !selectedAllocationMethod"
					>
							<uni-icons type="checkmarkempty" size="20" color="#fff" style="margin-right: 4px;"></uni-icons>
							确认添加
						</button>
					</view>
				</view>
			</view>
		</view>
	
	<!-- 添加费用类型弹窗 -->
	<view v-if="addTypeModalVisible" class="add-type-modal-mask" @click="cancelAddType">
		<view class="add-type-modal-wrapper" @click.stop>
			<view class="add-type-modal-container">
				<!-- 标题 -->
				<view class="add-type-modal-header">
					<text class="header-title">添加费用类型</text>
				</view>
				
				<!-- 输入框 -->
				<view class="add-type-modal-content">
					<view class="input-wrapper">
						<text class="input-label-text">类型名称</text>
						<input 
							type="text"
							v-model="newExpenseTypeName" 
							placeholder="请输入费用类型名称"
							class="type-name-input"
							maxlength="10"
						/>
					</view>
				</view>
				
				<!-- 底部按钮 -->
				<view class="add-type-modal-footer">
					<button class="btn-cancel" @click="cancelAddType">
						取消
					</button>
					<button 
						class="btn-confirm" 
						@click="confirmAddType"
						:class="{ disabled: !newExpenseTypeName || newExpenseTypeName.trim() === '' }"
						:disabled="!newExpenseTypeName || newExpenseTypeName.trim() === ''"
					>
						确认添加
					</button>
				</view>
			</view>
		</view>
	</view>
	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import labelApi from '../../api/label/labelApi';
	import batch from '../../api/batch/batch'
	export default {
		data() {
			return {
				currentTab: 0,
				scrollHeight: 0,
				windowHeight: 0,
				companyId: "",
				BatchInfo: null,
				tabList: [],
				tabListOrigin: [],
				showAddNewGood: false,
				activeType: "全部",
				activeType2Id: "",
				commodityList: [],
				commodityShowList: [],
				valueType: 1,
				windowWidth: 0,
				windowHeight: 0,
				scrollHeight2: '0px',
				currentShipper: '',
				currentShipperName: '',
				editingIndex: 0,
				selectedProductType: "",
				showKeyBoard1: false,
				actionView: null,
				maskView: null,
				editType: "common",
				BatchCommodityList: [],
				targetId: "id-0-view",
				unitList: [], // 单位列表
			newGoodInfo: {
				name: "",
				classifyId: "",
				saleWay: 1, // 默认按重量
				unit: "件", // 默认单位
				unitList: [],
				price: "", // 价格
				initWeight: "", // 单位重量
				fixTare: "", // 单位皮重
				showToSale: 1, // 是否显示，默认显示
				specList: [] // 规格列表
			},
				showComfirmBtn: true,
				batchList: [{
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
					}
				],
		// 费用弹窗相关
		expenseModalVisible: false,
		tempExpenseAmount: 0,
		selectedAllocationMethod: 4, // 默认选中不均摊
		lastExpenseAmount: 0, // 上一次的费用金额
		lastAllocationMethod: 4, // 上一次的均摊方式，默认不均摊
		totalExpense: 0, // 累计总费用
		allocationMethods: [
			{ value: 2, label: '按数量均摊', icon: '' },
			{ value: 1, label: '按重量均摊', icon: '' },
			{ value: 3, label: '按种类均摊', icon: '' },
			{ value: 4, label: '不均摊', icon: '' }
		],
		// 费用类型选项
		expenseTypes: [],
		selectedExpenseType: 'shipping', // 默认选中运费
		lastExpenseType: 'shipping', // 上一次选中的费用类型
		// 添加费用类型弹窗相关
		addTypeModalVisible: false,
		newExpenseTypeName: ''
			}
		},
		onLoad(options) {
			// if (this.editType === "common") {

			this.currentShipper = JSON.parse(options.shipper);
			// } else {
			// 	var batchSimple = JSON.parse(options.Batch);
			// 	batch.getBatchInfoById(batchSimple.id).then(res => {
			// 		this.BatchInfo = res.data;
			// 		this.getLastBatchCommodityList(this.BatchInfo.companyId, this.BatchInfo.shipperId)
			// 	})
			// }

		},
	mounted() {
		// 在组件挂载后设置 scrollHeight
		this.scrollHeight = uni.getWindowInfo().windowHeight - 155;
		this.windowHeight = uni.getWindowInfo().windowHeight;
		this.companyId = uni.getStorageSync('companyId');
		this.getAllcommodity();
		if (this.editType === "common") {
			// this.getBatchCommodityList();
		}
		this.initSystem();
		// 初始化费用类型列表
		this.getExpenseLabel();
		this.getCompanyUnit();
	},
		methods: {
			getCompanyUnit(){
				let that = this;
				labelApi.GetCompanyUnit(this.companyId).then(res => {
					that.unitList = res.data;
					
				})
			},
			//切换计算方式
			SwitchCalcType(e, element) {
				if (e) {
					element.calcType = 1;
				} else {
					element.calcType = 2
				}
				this.calcCommodityaddedInboundAmount(element);
			},
			onProductTypeChange() {

			},
			// 计算成本单价
			getCostPrice(item) {
				// 如果没有原始采购单价，则使用当前采购单价
				const originalPrice = parseFloat(item.originalIncomingPrice || item.incomingPrice) || 0;
				const expenseAllocated = parseFloat(item.expenseAllocated) || 0;
				
				// 成本单价 = 原始采购单价 + (分摊费用 / 数量或重量)
				console.log("expenseAllocated",expenseAllocated);
				console.log("item",item);
				let costPerUnit = originalPrice;
				if (expenseAllocated > 0) {
					if (item.calcType === 2) {
						// 按重量计算
						const weight = parseFloat(item.initWeight) || 0;
						if (weight > 0) {
							costPerUnit = originalPrice + (expenseAllocated / weight);
						}
						if(weight === 0){
							costPerUnit = originalPrice;
						}
						console.log("costPerUnit",costPerUnit);
					} else {
						// 按数量计算
						const quantity = parseFloat(item.initMount) || 0;
						if (quantity > 0) {
							costPerUnit = originalPrice + (expenseAllocated / quantity);
						}
					}
				}
				
				return costPerUnit.toFixed(2);
			},
			totalInitInventory() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initMount) || 0);
				}, 0);
			},
			totalInitWeight() {
				return this.BatchCommodityList.reduce((total, item) => {
					return total + (parseFloat(item.initWeight) || 0);
				}, 0);
			},
		totalAmount() {
			return this.BatchCommodityList.reduce((total, item) => {
				return total + (parseFloat(item.inboundAmount) || 0);
			}, 0);
		},
		addNewGood() {
			if (this.newGoodInfo.name === null || this.newGoodInfo.name === "") {
				uni.showToast({
					icon: 'none',
					title: '物品名称不能为空',
					duration: 1200,
				});
				return;
			}
			if (this.newGoodInfo.classifyId === "") {
				uni.showToast({
					title: '请选择货品类型',
					icon: 'none',
					duration: 1500
				})
				return;
			}
			
			let that = this;
			
			// 需要转换成double,不然发送失败500
			for (var i = 0; i < that.newGoodInfo.specList.length; i++) {
				that.newGoodInfo.specList[i].fixcount = parseFloat(that.newGoodInfo.specList[i].fixcount || 0);
				that.newGoodInfo.specList[i].fixprice = parseFloat(that.newGoodInfo.specList[i].fixprice || 0);
			}
			
			// 如果售卖方式等于1-2-4的话需要处理unit
			if (that.newGoodInfo.saleWay === 1) {
				that.newGoodInfo.specList.push({
					id: that.generateUUID(),
					specName: that.newGoodInfo.unit,
					fixcount: 1,
					fixprice: 0,
					parentId: "",
					price: 0
				});
			}
			if (that.newGoodInfo.saleWay === 2) {
				that.newGoodInfo.specList.push({
					id: that.generateUUID(),
					specName: that.newGoodInfo.unit,
					fixcount: 1,
					fixprice: parseFloat(that.newGoodInfo.price || 0),
					parentId: "",
					price: 0
				});
			}
			if (that.newGoodInfo.saleWay === 4) {
				that.newGoodInfo.specList.push({
					id: that.generateUUID(),
					specName: that.newGoodInfo.unit,
					fixcount: 1,
					fixprice: parseFloat(that.newGoodInfo.price || 0),
					parentId: "",
					price: 0
				});
			}
			
			// 需要转换成double,不然发送失败500
			that.newGoodInfo.price = parseFloat(that.newGoodInfo.price || 0);
			that.newGoodInfo.fixTare = parseFloat(that.newGoodInfo.fixTare || 0);
			that.newGoodInfo.initWeight = parseFloat(that.newGoodInfo.initWeight || 0);
			
			console.log("完整的newGoodInfo", that.newGoodInfo);
			
			category.CommoditySave3(JSON.stringify(that.newGoodInfo)).then(res => {
				uni.showToast({
					icon: 'none',
					title: '添加成功',
					duration: 1200,
				});
				that.showAddNewGood = false;
				that.newGoodInfoReset();
				that.getAllcommodity();
			}).catch(error => {
				console.error('添加商品失败:', error);
				uni.showToast({
					icon: 'none',
					title: '添加失败',
					duration: 1200,
				});
		});
	},
	// 重置新货品信息
	newGoodInfoReset() {
		this.newGoodInfo = {
			name: "",
			classifyId: "",
			saleWay: 1,
			unit: "件",
			price: "",
			initWeight: "",
			fixTare: "",
			showToSale: 1,
			specList: []
		};
	},
	// 改变销售方式
	changSaleType(type) {
		this.newGoodInfo.saleWay = type;
		this.newGoodInfo.specList = [];
		if (type == 3) {
			var guid1 = this.generateUUID();
			this.newGoodInfo.specList.push({
				id: guid1,
				specName: this.newGoodInfo.unit,
				fixprice: 0
			});
			this.newGoodInfo.specList.push({
				id: this.generateUUID(),
				specName: this.newGoodInfo.unit,
				fixprice: 0,
				parentId: guid1
			});
		}
	},
	// 生成UUID
	generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0;
			const v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	// 添加规格
	addSpec() {
		if (this.newGoodInfo.specList.length < 3) {
			this.newGoodInfo.specList.push({
				id: this.generateUUID(),
				specName: this.newGoodInfo.unit,
				fixprice: 0,
				parentId: this.newGoodInfo.specList[this.newGoodInfo.specList.length - 1].id,
				price: 0
			});
		}
	},
	// 选择单位
	selectUnit(unit) {
		this.newGoodInfo.unit = unit;
		// 如果是按件拆包类型，也要更新specList中的单位
		if (this.newGoodInfo.saleWay === 3 && this.newGoodInfo.specList.length > 0) {
			this.newGoodInfo.specList[0].specName = unit;
		}
	},
	// 更新主单位（按件拆包时）
	updateMainUnit() {
		// 当按件拆包的主单位改变时，同步到newGoodInfo.unit
		if (this.newGoodInfo.specList.length > 0) {
			this.newGoodInfo.unit = this.newGoodInfo.specList[0].specName;
		}
	},
	// 选择商品分类（确保只能选择一个）
	selectCategory(classifyId) {
		console.log("this.tabListOrigin", this.tabListOrigin)
		console.log("this.classifyId", classifyId)
		this.newGoodInfo.classifyId = classifyId;
	},
		getCommdityActive(id) {
			if (this.BatchCommodityList.some(x => x.commodityId === id)) {
				return true;
			}
			return false;
		},
			changeTab(e) {
				var type = e.name;
				this.activeType = e.name;
				if (type == "全部") {
					this.commodityShowList = this.commodityList
				} else {
					this.commodityShowList = this.commodityList.filter(x => x.className == type)
				}
			},
			//键盘数字输入处理
			NumberCk(val) {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
						break;
				}
				if (val == '.') {
					if (myvalue.toString().indexOf('.') >= 0) {
						return;
					}
				}
		var txt = myvalue == null || myvalue == 0 || myvalue == undefined ? '' : myvalue;
		myvalue = txt + val.toString();
		switch (this.valueType) {
			case 1:
				this.BatchCommodityList[this.editingIndex].initMount = myvalue;
				// 数量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 2:
				this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
				// 重量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 3:
				this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
				//输入入库单价计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 4:
				this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
				//输入入库金额计算单价
				this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
				break;
		}
	},
			//键盘删除处理
			Tuige() {
				let myvalue = "";
				switch (this.valueType) {
					case 1:
						myvalue = this.BatchCommodityList[this.editingIndex].initMount;
						break;
					case 2:
						myvalue = this.BatchCommodityList[this.editingIndex].initWeight;
						break;
					case 3:
						myvalue = this.BatchCommodityList[this.editingIndex].incomingPrice;
						break;
					case 4:
						myvalue = this.BatchCommodityList[this.editingIndex].inboundAmount;
						break;
				}
				if (myvalue == null || myvalue === '' || myvalue === '0') {
					return;
				}
		myvalue = myvalue ? myvalue.toString() : '';
		myvalue = myvalue.slice(0, -1);
		switch (this.valueType) {
			case 1:
				this.BatchCommodityList[this.editingIndex].initMount = myvalue;
				// 数量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 2:
				this.BatchCommodityList[this.editingIndex].initWeight = myvalue;
				// 重量变化，重新计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 3:
				this.BatchCommodityList[this.editingIndex].incomingPrice = myvalue;
				//输入入库单价计算入库金额
				this.calcCommodityaddedInboundAmount(this.BatchCommodityList[this.editingIndex]);
				break;
			case 4:
				this.BatchCommodityList[this.editingIndex].inboundAmount = myvalue;
				//输入入库金额计算单价
				this.calcCommodityaddedincomingPrice(this.BatchCommodityList[this.editingIndex]);
				break;
		}
	},
			initSystem() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.windowWidth = res.windowWidth; // 输出屏幕宽度
						that.windowHeight = res.windowHeight;
						that.scrollHeight2 = res.windowHeight - 150 + 'px';
					}
				});
			},
			showKeyBorad(index, type) {
				this.$nextTick(() => {
					// 确保赋值和 view 的 id 一致
					this.scrollIntoView = `id-${this.currentNumber}-view`
				})
				this.valueType = type;
				this.editingIndex = index;
				this.showKeyBoard1 = true;
				this.scrollHeight2 = this.windowHeight - 210 - 150 + 'px';
			},
			hideBorad() {
				this.scrollHeight2 = this.windowHeight - 150 + 'px';
				this.showKeyBoard1 = false;
			},
			getLastBatchCommodityList(companyId, shipperId) {
				batch.GetLastBatchCommodity(companyId, shipperId).then(res => {
					this.BatchCommodityList = res.data;
					for (var i = 0; i < this.BatchCommodityList.length; i++) {
						this.BatchCommodityList[i].id = "";
						this.BatchCommodityList[i].inventory = this.BatchCommodityList[i].initInventory;
					}
				})
			},
		//计算添加货品的入库金额 2-按重量计算 1-按数量计算（基于成本单价）
		calcCommodityaddedInboundAmount(commodityAdded) {
			// 如果还没保存原始采购单价，先保存
			if (!commodityAdded.originalIncomingPrice) {
				commodityAdded.originalIncomingPrice = commodityAdded.incomingPrice || 0;
			}
			
			// 获取成本单价（采购单价 + 单位费用）
			const costPrice = parseFloat(this.getCostPrice(commodityAdded));
			
			if (commodityAdded.calcType === 2) {
				// 按重量计算
				const weight = parseFloat(commodityAdded.initWeight) || 0;
				console.log("weight",weight);
				commodityAdded.inboundAmount = (weight * costPrice).toFixed(1);
			}
			if (commodityAdded.calcType === 1) {
				// 按数量计算
				const quantity = parseFloat(commodityAdded.initMount) || 0;
				commodityAdded.inboundAmount = (quantity * costPrice).toFixed(1);
			}
		},
		//计算添加货品的入库单价 2-按重量计算 1-按数量计算（考虑费用）
		calcCommodityaddedincomingPrice(commodityAdded) {
			// 计算单位费用
			let unitExpense = 0;
			const expenseAllocated = parseFloat(commodityAdded.expenseAllocated) || 0;
			
			if (commodityAdded.calcType === 2) {
				// 按重量计算
				const weight = parseFloat(commodityAdded.initWeight) || 0;
				if (weight > 0) {
					unitExpense = expenseAllocated / weight;
					// 采购单价 = (入库金额 / 重量) - 单位费用
					commodityAdded.incomingPrice = ((commodityAdded.inboundAmount / weight) - unitExpense).toFixed(2);
				}
			}
			if (commodityAdded.calcType === 1) {
				// 按数量计算
				const quantity = parseFloat(commodityAdded.initMount) || 0;
				if (quantity > 0) {
					unitExpense = expenseAllocated / quantity;
					// 采购单价 = (入库金额 / 数量) - 单位费用
					commodityAdded.incomingPrice = ((commodityAdded.inboundAmount / quantity) - unitExpense).toFixed(2);
				}
			}
		},
			getBatchCommodityList() {
				category.GetBybatchId(this.BatchInfo.id).then(res => {
					this.BatchCommodityList = res.data;
				})
			},
			saveBatchGood() {
				let that = this;
				that.showComfirmBtn = false;
				var CommodityList = [];
				that.BatchCommodityList.forEach(item => {
					CommodityList.push({
						"commodityId": item.commodityId,
						"calcType": item.calcType,
						"initMount": 0,
						"initWeight": parseFloat(item.initWeight),
						"incomingPrice": parseFloat(item.incomingPrice),
						"inboundAmount": parseFloat(item.inboundAmount),
						"purchaseInventories": [{
							"specId": item.spec.id,
							"mount": parseFloat(item.initMount)
						}]
					})
				})

			console.log("that.selectedExpenseType",that.selectedExpenseType);
			console.log("that.tempExpenseAmount",that.tempExpenseAmount);
			console.log("that.selectedAllocationMethod",that.selectedAllocationMethod);
			console.log("that.totalExpense",that.totalExpense);

			// 构建基本参数
			var param = {
				shipperId: that.currentShipper.id,
				companyId: that.companyId,
				purchaseEmployList: CommodityList,
				purchaseExpenseList: []
			}
			
			// 只有在添加了费用时才发送 purchaseOrderCost
			if (that.totalExpense > 0 && that.selectedExpenseType) {
				// 获取费用类型的label（名称）
				const expenseType = that.expenseTypes.find(type => 
					type.id === that.selectedExpenseType 
				);
				
				if (expenseType) {
					param.purchaseOrderCost = {
						"label": expenseType.label, // 使用费用类型的名称
						"amount": parseFloat(that.totalExpense),
						"purchaseOrderCostType": that.selectedAllocationMethod
					};
					
					console.log("purchaseOrderCost", param.purchaseOrderCost);
				}
			}
				if (that.BatchCommodityList.length > 0) {
					category.CreatePurchaseOrder(JSON.stringify(param)).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '采购成功',
								icon: 'none',
								duration: 2000
							})
							that.back()
						} else {
							uni.showToast({
								title: '采购失败',
								icon: 'none',
								duration: 2000
							})
							that.showComfirmBtn = true;
						}
					})
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			deleteBatchCommdity(index) {
				uni.showModal({
					title: '确认删除',
					content: '您确定要删除该项吗？',
					success: (res) => {
						if (res.confirm) {
							// 用户点击了确认
							this.BatchCommodityList.splice(index, 1)
						} else if (res.cancel) {
							// 用户点击了取消
						}
					}
				});

			},
			getAllcommodity() {
				category.GetAllCommidityByCompanyId2(this.companyId).then(res => {
					this.commodityList = res.data;
					this.commodityShowList = res.data;
					this.tabList = [{
						name: "全部",
						value: 0
					}];
					this.tabListOrigin = [];
					console.log("res", res.data)
					this.commodityList.forEach((item, index) => {
						if (!this.tabList.some(tab => tab.name === item.className)) {
							this.tabList.push({
								name: item.className,
								value: index
							});
						};
						if (!this.tabListOrigin.some(tab => tab.name === item.className)) {
							this.tabListOrigin.push({
								name: item.className,
								value: item.classId
							});
						};
						if (this.tabListOrigin.length > 0) {
							this.newGoodInfo.classifyId = this.tabListOrigin[0].value;
						}
					});
				});
			},
		addCommodity(e) {
			// if (this.getCommdityActive(e.id)) return;
			if (e.saleWay === 1 || e.saleWay === 2 || e.saleWay === 4) {
				var commodityAdded = {
					id: "",
					name: e.commodityName,
					initMount: 0,
					initWeight: 0,
					commodityId: e.id,
					calcType: 1,
					incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
					originalIncomingPrice: e.incomingPrice ? e.incomingPrice : 0, // 保存原始采购单价
					expenseAllocated: 0, // 初始化分摊费用为0
					inboundAmount: 0
				}
				if (e.commoditySpecs.length > 0) {
					commodityAdded.spec = e.commoditySpecs[0]
				}
				this.BatchCommodityList.push(commodityAdded)
			}

			console.log("e", e)
			if(e.saleWay === 3){
				uni.createSelectorQuery().selectAll(`#grid-item-${e.id}`).boundingClientRect(data => {
						// const { left, top, width, height } = data;
						console.log("data", data)
						this.createNativeView(data[0].left + data[0].width / 2, data[0].top, e, e.commoditySpecs)
					}).exec()
			}
		},
		//用于添加拆包商品
		addCommodity2(e,spec) {
			// if (this.getCommdityActive(e.id)) return;
				var commodityAdded = {
					id: "",
					name: e.commodityName,
					initMount: 0,
					initWeight: 0,
					commodityId: e.id,
					calcType: 1,
					incomingPrice: e.incomingPrice ? e.incomingPrice : 0,
					originalIncomingPrice: e.incomingPrice ? e.incomingPrice : 0, // 保存原始采购单价
					expenseAllocated: 0, // 初始化分摊费用为0
					inboundAmount: 0
				}
				commodityAdded.spec =spec
				this.BatchCommodityList.push(commodityAdded)
			
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
					backgroundColor: "rgba(0,0,0,0.1)" // 接近透明

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
						width: "2px", // 边框宽度
						radius: "5px" // 圆角半径（关键！）
					}, {
						top: i * 100 + "px",
						left: "0px",
						width: "150px",
						height: "100px"
					});
					this.actionView.drawRect({
						color: "#ffffff", // 边框颜色
						width: "2px", // 边框宽度
						radius: "5px" // 圆角半径（关键！）
					}, {
						top: i * 100 + 2 + "px",
						left: "2px",
						width: "146px",
						height: "96px"
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
							that.addCommodity2(commodity, specList[i])
						}
					}

					that.actionView.close();
					that.actionView = null;
					that.maskView.close();
					that.maskView = null;
				});


				this.actionView.show();
			},
	// 费用弹窗相关方法
	showExpenseModal() {
		this.getExpenseLabel();
		this.expenseModalVisible = true;
		// 回填上一次的值
		this.tempExpenseAmount = this.lastExpenseAmount;
		this.selectedAllocationMethod = this.lastAllocationMethod;
		this.selectedExpenseType = this.lastExpenseType; // 回填上一次选中的费用类型
	},
	cancelExpense() {
		this.expenseModalVisible = false;
		this.tempExpenseAmount = 0;
		this.selectedAllocationMethod = 4; // 重置为默认值（不均摊）
		// 不重置费用类型，保持上一次确认的值
	},
	validateExpenseAmount() {
		if (this.tempExpenseAmount < 0) {
			this.tempExpenseAmount = 0;
		}
	},
	// 添加费用类型弹窗相关方法
	showAddTypeModal() {
		this.addTypeModalVisible = true;
		this.newExpenseTypeName = '';
	},
	cancelAddType() {
		this.addTypeModalVisible = false;
		this.newExpenseTypeName = '';
	},
	confirmAddType() {
		const typeName = this.newExpenseTypeName.trim();
		if (!typeName) {
			uni.showToast({
				title: '请输入费用类型名称',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		// 检查是否已存在
		const exists = this.expenseTypes.some(type => type.label === typeName);
		if (exists) {
			uni.showToast({
				title: '该费用类型已存在',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		this.addExpenseLabel(typeName);
	},
	// 添加费用标签
	addExpenseLabel(label) {
			var userInfo = uni.getStorageSync("userInfo");
			const labelData = {
				companyId: this.companyId,
				label: label.trim(),
				labelType: 2,
				operatorId: userInfo.id
			};
			
		labelApi.createExpenseLabel(labelData).then(res => {
			if (res.code === 200) {
				uni.showToast({
					title: "添加成功",
					icon: "success"
				});
				
				// 重新获取标签列表
				this.getExpenseLabel();
				
				// 自动选中新添加的费用类型
				// 等待getExpenseLabel()完成后，通过label匹配找到对应的类型
				setTimeout(() => {
					const newType = this.expenseTypes.find(type => type.label === label.trim());
					if (newType) {
						this.selectedExpenseType = newType.value || newType.id;
					}
				}, 300);
				
				// 关闭添加类型弹窗
				this.addTypeModalVisible = false;
				this.newExpenseTypeName = '';
			} else {
				uni.showToast({
					title: res.message || "添加失败",
					icon: "none"
				});
			}
		}).catch(error => {
			uni.showToast({
				title: "网络错误",
				icon: "none"
			});
		});
	},
	getExpenseLabel(){
		this.expenseTypes = [];
		labelApi.GetExpenseLabel(this.companyId,2).then(res=>{
			if(res.code === 200){
				this.expenseTypes = res.data || [];
				
				// 如果费用类型列表不为空，且当前选中的费用类型无效，则设置为第一个
				if (this.expenseTypes.length > 0) {
					const validType = this.expenseTypes.find(type => 
						type.value === this.selectedExpenseType || type.id === this.selectedExpenseType
					);
					if (!validType) {
						// 当前选中的费用类型无效，设置为第一个
						this.selectedExpenseType = this.expenseTypes[0].value || this.expenseTypes[0].id;
						this.lastExpenseType = this.selectedExpenseType;
					}
				}
			}
		})
	},
	getAllocationHint() {
		const hints = {
			2: '费用将按各商品的入库数量比例进行分摊', // 按数量均摊
			1: '费用将按各商品的入库重量比例进行分摊', // 按重量均摊
			3: '费用将按商品种类数量平均分摊（每个商品分摊相同金额）', // 按种类均摊
			4: '费用将作为单独项目添加，不分摊到商品' // 不均摊
		};
		return hints[this.selectedAllocationMethod] || '';
	},
	// 重新计算所有商品的入库金额（基于成本单价）
	recalculateAllInboundAmount() {
		this.BatchCommodityList.forEach(item => {
			// 获取成本单价
			const costPrice = parseFloat(this.getCostPrice(item));
			
			// 根据计算类型重新计算入库金额
			if (item.calcType === 2) {
				// 按重量计算
				const weight = parseFloat(item.initWeight) || 0;
				item.inboundAmount = (weight * costPrice).toFixed(2);
			} else {
				// 按数量计算
				const quantity = parseFloat(item.initMount) || 0;
				item.inboundAmount = (quantity * costPrice).toFixed(2);
			}
		});
	},
confirmExpense() {
	// 允许费用金额为0
	if (this.tempExpenseAmount < 0) {
		uni.showToast({
			title: '费用金额不能为负数',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	if (!this.selectedAllocationMethod) {
		uni.showToast({
			title: '请选择均摊方式',
			icon: 'none',
			duration: 2000
		});
		return;
	}
	
	const expenseAmount = parseFloat(this.tempExpenseAmount) || 0;
	
	// 直接使用输入的费用金额作为总费用
	this.totalExpense = expenseAmount;
	
	// 保存本次输入的值，供下次打开时回填
	this.lastExpenseAmount = this.tempExpenseAmount;
	this.lastAllocationMethod = this.selectedAllocationMethod;
	this.lastExpenseType = this.selectedExpenseType; // 保存选中的费用类型
	
	// 先清空所有商品的费用分配（切换均摊方式时需要重新计算）
	this.BatchCommodityList.forEach(item => {
		if (!item.isExpense) {  // 只清空普通商品的费用分配，不清空费用项
			item.expenseAllocated = 0;
		}
	});
	
	// 移除之前添加的费用项（如果有）
	this.BatchCommodityList = this.BatchCommodityList.filter(item => !item.isExpense);
	
	// 根据不同的均摊方式处理费用
	switch(this.selectedAllocationMethod) {
		case 2: // 按数量均摊
			this.allocateByQuantity(expenseAmount);
			break;
		case 1: // 按重量均摊
			this.allocateByWeight(expenseAmount);
			break;
		case 3: // 按种类均摊
			this.allocateByCategory(expenseAmount);
			break;
		case 4: // 不均摊
			this.addExpenseWithoutAllocation(expenseAmount);
			break;
	}
	
	// 重新计算所有商品的入库金额（基于成本单价）
	// 成本单价会自动重新计算：成本单价 = 原始采购单价 + (分摊费用 / 数量或重量)
	this.recalculateAllInboundAmount();
	
	// 强制更新视图，确保成本单价列立即刷新
	this.$forceUpdate();
	
	this.expenseModalVisible = false;
	
	uni.showToast({
		title: '费用添加成功',
		icon: 'success',
		duration: 2000
	});
},
	allocateByQuantity(expenseAmount) {
		// 按数量均摊
		const totalQuantity = this.totalInitInventory();
		if (totalQuantity === 0) {
			uni.showToast({
				title: '总数量为0，无法按数量均摊',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
	this.BatchCommodityList.forEach(item => {
		// 保存原始采购单价（如果还没保存）
		if (!item.originalIncomingPrice) {
			item.originalIncomingPrice = item.incomingPrice || 0;
		}
		
		const quantity = parseFloat(item.initMount) || 0;
		const allocation = (quantity / totalQuantity) * expenseAmount;
		
		// 直接赋值，不累加（根据当前费用重新计算）
		item.expenseAllocated = allocation;
		
		// 采购单价不变，保持原始值
	});
},
	allocateByWeight(expenseAmount) {
		// 按重量均摊
		const totalWeight = this.totalInitWeight();
		// if (totalWeight === 0) {
		// 	uni.showToast({
		// 		title: '总重量为0，无法按重量均摊',
		// 		icon: 'none',
		// 		duration: 2000
		// 	});
		// 	return;
		// }
		
	this.BatchCommodityList.forEach(item => {
		// 保存原始采购单价（如果还没保存）
		if (!item.originalIncomingPrice) {
			item.originalIncomingPrice = item.incomingPrice || 0;
		}
		
		const weight = parseFloat(item.initWeight) || 0;
		const allocation = (weight / totalWeight) * expenseAmount;
		
		// 直接赋值，不累加（根据当前费用重新计算）
		item.expenseAllocated = allocation;
		
		// 采购单价不变，保持原始值
	});
},
	allocateByCategory(expenseAmount) {
		// 按种类均摊 - 根据商品列表长度平均分配
		const itemCount = this.BatchCommodityList.length;
		
		if (itemCount === 0) {
			uni.showToast({
				title: '没有商品，无法均摊',
				icon: 'none',
				duration: 2000
			});
			return;
		}
		
		console.log("this.BatchCommodityList",this.BatchCommodityList);

		// 每个商品分摊相同的费用金额
		const expensePerItem = expenseAmount / itemCount;
		
		this.BatchCommodityList.forEach(item => {
			// 保存原始采购单价（如果还没保存）
			if (!item.originalIncomingPrice) {
				item.originalIncomingPrice = item.incomingPrice || 0;
			}
			
			// 直接赋值，不累加（根据当前费用重新计算）
			item.expenseAllocated = expensePerItem;
			
			// 采购单价不变，保持原始值
		});
	},
		addExpenseWithoutAllocation(expenseAmount) {
			// // 不均摊，作为单独费用项添加
			// const expenseItem = {
			// 	id: "",
			// 	name: "费用",
			// 	initMount: 1,
			// 	initWeight: 0,
			// 	commodityId: "",
			// 	calcType: 1,
			// 	incomingPrice: expenseAmount,
			// 	originalIncomingPrice: expenseAmount,
			// 	expenseAllocated: 0,
			// 	inboundAmount: expenseAmount,
			// 	isExpense: true  // 标记为费用项
			// };
			
			// this.BatchCommodityList.push(expenseItem);
		}

		}

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
	}

	.coach_wrap_active {
		color: white;
		background-color: dodgerblue;
	}

	.input1 {
		background-color: #b9b9b9;
		height: 20rpx;
		border-radius: 5rpx;
		font-size: 15rpx;
		text-align: center;
		border: 1px solid black;
		font-weight: bold;
		color: black;
		width: 90%;

	}

	.mybrankmask .MymaskList {
		font-weight: bold;
		display: flex;
		width: 100%;
		height: 30rpx;
		justify-content: space-around;
		margin-bottom: 5rpx;
		font-size: 12rpx;

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
		height: 30rpx;
		text-align: center;
		line-height: 30rpx;
		border-radius: 10rpx;
		background-color: #a8a8a8;
		font-size: 12rpx;
	}

	.clickCard {
		margin-left: 2rpx;
		margin-right: 2rpx;
		width: 104rpx;
		height: 70rpx;
		background-color: #ffffff !important;
		border-radius: 8rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		padding: 10rpx;
		box-sizing: border-box;
		text-align: left;
		font-size: 14rpx;
		color: #333;
		margin-bottom: 3rpx;
	}

	.activeCard {
		border: 3px solid #007AFF;
	}

	.add-expense-btn {
		height: 25rpx;
		line-height: 25rpx;
		background-color: #00aaff;
		font-weight: bold;
		color: white;
		margin-right: 10rpx;
	}
	
	.expense-label {
		display: inline-flex;
		align-items: center;
		height: 25rpx;
		padding: 0 10rpx;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
		
		&:hover {
			transform: scale(1.05);
			box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.4);
		}
		
		&:active {
			transform: scale(0.98);
		}
		
		.expense-label-text {
			font-size: 13rpx;
			font-weight: bold;
			color: white;
			line-height: 25rpx;
		}
	}

	.total-content {
		display: flex;
		height: 25rpx;
		font-size: 12rpx;
		border-top: 1px solid gainsboro;
		border-bottom: 1px solid gainsboro;
	}

	.total-content-item {
		padding: 5px;
		text-align: left;
		font-weight: bold;
		line-height: 20rpx;
	}

	/* 费用弹窗样式 */
	.expense-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.expense-modal-wrapper {
		width: 650px;
		max-width: 90%;
		max-height: 90vh;
		overflow: hidden;
		border-radius: 12px;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
	}

	.expense-modal-container {
		background: white;
		overflow: hidden;
	}

	.expense-modal-header {
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		padding: 20px 24px;
		text-align: center;
		color: white;

		.header-title {
			display: block;
			font-size: 30px;
			font-weight: bold;
			margin-bottom: 8px;
		}

		.header-subtitle {
			display: block;
			font-size: 18px;
			opacity: 0.9;
		}
	}

	.expense-modal-content {
		// scroll-view样式
		max-height: 600rpx;
		
		.expense-modal-content-inner {
			padding: 32px 28px;
		}

		.input-wrapper {
			margin-bottom: 32px;

			.input-label {
				display: flex;
				align-items: center;
				margin-bottom: 12px;

				.label-text {
					font-size: 20px;
					font-weight: 600;
					color: #303133;
				}

				.label-required {
					color: #f56c6c;
					margin-left: 6px;
					font-size: 22px;
				}
			}

			.input-container {
				display: flex;
				align-items: center;
				padding: 0 20px;
				background: #fff;
				border: 3px solid #dcdfe6;
				border-radius: 10px;
				transition: all 0.3s ease;
				position: relative;

				&:focus-within {
					border-color: #00aaff;
					box-shadow: 0 0 0 4px rgba(0, 170, 255, 0.1);
				}

				.input-prefix {
					font-size: 28px;
					font-weight: bold;
					color: #909399;
					margin-right: 6px;
				}

				.expense-input {
					flex: 1;
					height: 30rpx;
					padding: 0px 0px 0px 0;
					border: none;
					font-size: 25rpx;
					font-weight: bold;
					color: #303133;
					outline: none;
					background: transparent;
				}

				.clear-expense-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 4px 8px;
					margin-left: 12px;
					background: #f5f7fa;
					color: #606266;
					font-size: 18px;
					font-weight: 600;
					border: 2px solid #e4e7ed;
					border-radius: 8px;
					cursor: pointer;
					transition: all 0.2s ease;
					white-space: nowrap;

					&:hover {
						background: #ecf5ff;
						border-color: #b3d8ff;
						color: #409eff;
					}

					&:active {
						background: #d9ecff;
						transform: scale(0.96);
					}
				}
			}

			.input-hint {
				display: block;
				margin-top: 10px;
				font-size: 16px;
				color: #909399;
				padding-left: 6px;
			}
		}

	.allocation-section {
		.section-label {
			display: block;
			font-size: 20px;
			font-weight: 600;
			color: #303133;
			margin-bottom: 16px;
		}

		.allocation-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 14px;
			margin-bottom: 16px;

				.allocation-btn {
					flex: 0 0 calc(50% - 7px);
					padding: 16px 12px;
					background: #f5f7fa;
					border: 3px solid #e4e7ed;
					border-radius: 10px;
					cursor: pointer;
					transition: all 0.2s ease;

					.allocation-btn-content {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 8px;

						.allocation-btn-text {
							font-size: 18px;
							font-weight: bold;
							color: #606266;
						}
					}

					&:hover {
						background: #ecf5ff;
						border-color: #b3d8ff;

						.allocation-btn-text {
							color: #409eff;
						}
					}

					&.active {
						background: #00aaff;
						border-color: #00aaff;
						transform: scale(1.02);

						.allocation-btn-text {
							color: white;
						}
					}

					&:active {
						transform: scale(0.98);
					}
				}
			}

			.allocation-hint {
				display: block;
				padding: 12px 16px;
				background: #f0f9ff;
				border-left: 4px solid #00aaff;
				border-radius: 6px;
				font-size: 15px;
				color: #606266;
				line-height: 1.5;
			}
		}
	}

	/* 费用类型选择样式 */
	.expense-type-section {
		margin-top: 24px;
		
		.section-label-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 16px;
			
			.section-label {
				font-size: 20px;
				font-weight: 600;
				color: #303133;
			}
			
			.add-type-btn {
				width: 36px;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #e8f3ff;
				border-radius: 50%;
				
				
			}
		}
		
		.expense-type-buttons {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
			
			.expense-type-btn {
				flex: 0 0 calc(25% - 9px);
				padding: 12px 8px;
				background: #f5f7fa;
				border: 2px solid #e4e7ed;
				border-radius: 8px;
				cursor: pointer;
				transition: all 0.2s ease;
				text-align: center;
				
				&:hover {
					background: #e8f3ff;
					border-color: #00aaff;
					transform: translateY(-2px);
				}
				
				&.active {
					background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
					border-color: #00aaff;
					box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
					
					.expense-type-text {
						color: #fff;
						font-weight: 600;
					}
				}
				
				.expense-type-text {
					font-size: 16px;
					color: #606266;
					font-weight: 500;
				}
			}
		}
	}

	.expense-modal-footer {
		display: flex;
		gap: 16px;
		padding: 20px 28px 28px;
		background: #f8f9fa;
		border-top: 1px solid #e9ecef;

		button {
			flex: 1;
			height: 60px;
			border-radius: 10px;
			font-size: 20px;
			font-weight: bold;
			border: none;
			cursor: pointer;
			transition: all 0.2s ease;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.btn-cancel {
			background: #f5f5f5;
			color: #606266;

			&:hover {
				background: #e9e9e9;
			}

			&:active {
				transform: scale(0.98);
			}
		}

		.btn-confirm {
			background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
			color: white;
			box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);

			&:hover {
				box-shadow: 0 6px 16px rgba(0, 170, 255, 0.4);
				transform: translateY(-1px);
			}

			&:active {
				transform: translateY(0) scale(0.98);
			}

			&.disabled {
				background: #c0c4cc;
				box-shadow: none;
				cursor: not-allowed;
				opacity: 0.6;

				&:hover {
					transform: none;
				}
			}
		}
	}
	
	/* 添加费用类型弹窗样式 */
	.add-type-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10001;
	}
	
	.add-type-modal-wrapper {
		width: 90%;
		max-width: 500px;
	}
	
	.add-type-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		animation: modalSlideIn 0.3s ease-out;
	}
	
	.add-type-modal-header {
		padding: 24px 28px;
		background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
		
		.header-title {
			font-size: 24px;
			font-weight: 600;
			color: #ffffff;
			display: block;
		}
	}
	
	.add-type-modal-content {
		padding: 28px;
		
		.input-wrapper {
			.input-label-text {
				display: block;
				font-size: 16px;
				font-weight: 600;
				color: #303133;
				margin-bottom: 12px;
			}
			
			.type-name-input {
				width: 100%;
				height: 50px;
				padding: 0 16px;
				font-size: 16px;
				color: #303133;
				background: #f5f7fa;
				border: 2px solid #e4e7ed;
				border-radius: 8px;
				box-sizing: border-box;
				transition: all 0.2s ease;
				
				&:focus {
					background: #ffffff;
					border-color: #00aaff;
					outline: none;
				}
			}
		}
	}
	
	.add-type-modal-footer {
		display: flex;
		gap: 16px;
		padding: 20px 28px 28px;
		background: #f8f9fa;
		border-top: 1px solid #e9ecef;
		
		button {
			flex: 1;
			height: 50px;
			border: none;
			border-radius: 8px;
			font-size: 16px;
			font-weight: 600;
			cursor: pointer;
			transition: all 0.2s ease;
			
			&.btn-cancel {
				background: #ffffff;
				color: #606266;
				border: 2px solid #dcdfe6;
				
				&:hover {
					background: #f5f7fa;
					border-color: #c0c4cc;
				}
			}
			
			&.btn-confirm {
				background: linear-gradient(135deg, #00aaff 0%, #0088cc 100%);
				color: #ffffff;
				box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
				
				&:hover {
					box-shadow: 0 6px 16px rgba(0, 170, 255, 0.4);
					transform: translateY(-2px);
				}
				
				&.disabled {
					background: #dcdfe6;
					color: #909399;
					cursor: not-allowed;
					box-shadow: none;
					
					&:hover {
						transform: none;
					}
				}
			}
		}
	}
	
	/* 添加新货品弹窗美化样式 */
	.znj-add-good-modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9998;
	}
	
	.znj-add-good-modal-wrapper {
		width: 90%;
		max-width: 900px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}
	
	.znj-add-good-modal-container {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		max-height: 90vh;
	}
	
	.znj-add-good-modal-header {
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		padding: 20px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
	}
	
	.znj-add-good-modal-title {
		font-size: 24px;
		font-weight: bold;
		color: #ffffff;
	}
	
	.znj-add-good-modal-close {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border-radius: 50%;
		transition: background 0.2s;
	}
	
	.znj-add-good-modal-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.znj-add-good-modal-body {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}
	.znj-add-good-form {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	.znj-add-good-row {
		display: flex;
		align-items: center;
		gap: 5rpx;
		margin-bottom: 0rpx;
		min-height: 25rpx;
	}
	.znj-add-good-label {
		width: 120rpx;
		font-size: 15rpx;
		color: #333;
		text-align: right;
		font-weight: 500;
		flex-shrink: 0;
	}
	.znj-add-good-input {
		flex: 1;
		height: 32rpx;
		border-radius: 8rpx;
		border: 1px solid #e0e0e0;
		background: #fafbfc;
		padding: 0 16rpx;
		font-size: 15rpx;
		transition: border-color 0.2s;
	}
	.znj-add-good-input:focus {
		border-color: #1976d2;
		outline: none;
	}
	.znj-add-good-btn-group {
		display: flex;
		gap: 12rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-type-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 8rpx;
		padding: 0 15rpx;
		height: 35rpx;
		line-height: 35rpx;
		font-size: 20rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-type-btn.active, .znj-add-good-type-btn:hover {
		background: #1976d2;
		color: #fff;
		border-color: #1976d2;
	}
	.znj-add-good-btns {
		display: flex;
		justify-content: flex-end;
		gap: 24rpx;
		margin-top: 5rpx;
		padding-top: 5rpx;
		border-top: 1px solid #f0f0f0;
	}
	.znj-add-good-btn {
		min-width: 150rpx;
		height: 32rpx;
		line-height: 32rpx;
		padding: 0 10rpx;
		border: none;
		border-radius: 8rpx;
		font-size: 25rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	.znj-add-good-btn.cancel {
		background: #bdbdbd;
		color: #fff;
	}
	.znj-add-good-btn.cancel:hover {
		background: #a0a0a0;
		transform: translateY(-1px);
	}
	.znj-add-good-btn.confirm {
		background: linear-gradient(135deg, #1976d2, #1565c0);
		color: #fff;
	}
	.znj-add-good-btn.confirm:hover {
		background: linear-gradient(135deg, #1565c0, #0d47a1);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(25,118,210,0.3);
	}
	.znj-add-good-btn.add {
		background: linear-gradient(135deg, #07c160, #06ae56);
		color: #fff;
		min-width: 100rpx;
	}
	.znj-add-good-btn.add:hover {
		background: linear-gradient(135deg, #06ae56, #059748);
		transform: translateY(-1px);
	}
	
	/* 单位选择按钮组 */
	.znj-add-good-unit-group {
		display: flex;
		gap: 8rpx;
		flex-wrap: wrap;
	}
	.znj-add-good-unit-btn {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		padding: 0 12rpx;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 18rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-unit-btn.active, .znj-add-good-unit-btn:hover {
		background: #07c160;
		color: #fff;
		border-color: #07c160;
	}

	.znj-add-good-unit-select {
		padding: 8rpx 12rpx;
		border: 1px solid #e0e0e0;
		border-radius: 6rpx;
		background: #fff;
		font-size: 28rpx;
		color: #333;
		min-width: 100rpx;
		outline: none;
	}

	.znj-add-good-unit-select:focus {
		border-color: #07c160;
	}
	
	/* 规格输入框样式 */
	.znj-add-good-spec-box {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		overflow: hidden;
		height: 32rpx;
		margin-left: 10rpx;
		background: #fafbfc;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-spec-prefix, .znj-add-good-spec-suffix {
		background: #1976d2;
		color: #fff;
		font-size: 20rpx;
		padding: 0 12rpx;
		height: 100%;
		display: flex;
		align-items: center;
		font-weight: 500;
	}
	.znj-add-good-spec-suffix {
		background: #07c160;
	}
	.znj-add-good-spec-input {
		width: 80rpx;
		flex: 1;
		padding: 0 12rpx;
		border: none;
		outline: none;
		font-size: 22rpx;
		background: transparent;
		text-align: center;
	}
	
	/* 分割线 */
	.znj-add-good-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, #e0e0e0, transparent);
		margin: 5rpx 0;
	}
	
	/* 开关按钮组 */
	.znj-add-good-switch-group {
		display: flex;
		width: 120rpx;
		height: 30rpx;
		border-radius: 8rpx;
		overflow: hidden;
		border: 1px solid #ddd;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	.znj-add-good-switch-btn {
		flex: 1;
		border: none;
		background: transparent;
		color: #333;
		font-size: 15rpx;
		line-height: 30rpx;
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}
	.znj-add-good-switch-btn.active {
		background: #07c160;
		color: #fff;
	}
</style>