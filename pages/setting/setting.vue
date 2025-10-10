<template>
	<div class="setting-container">
		<scroll-view  scroll-y :style="{ height: WindowHeight + 'px' }">
		<!-- 通用设置区域 -->
		<div class="setting-section">
			<div class="section-header">
				<u-icon name="tags" color="#2979ff" size="18"></u-icon>
				<text class="section-title">通用设置</text>
			</div>
			<div class="settings-grid">
				<div class="setting-card" @click="turnToOperatorSetting()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-fenleishezhi" size="32"></uni-icons>
					</div>
					<div class="card-title">操作设置</div>
				</div>
				<div class="setting-card" @click="turnToCommonSetting()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-jibenshezhi_1" size="32"></uni-icons>
					</div>
					<div class="card-title">基本设置</div>
				</div>
				<div class="setting-card" @click="openUnitManagement">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-danwei" size="32"></uni-icons>
					</div>
					<div class="card-title">单位管理</div>
				</div>
			</div>
		</div>

		<!-- 设备设置区域 -->
		<div class="setting-section">
			<div class="section-header">
				<u-icon name="tags" color="#2979ff" size="18"></u-icon>
				<text class="section-title">设备设置</text>
			</div>
			<div class="settings-grid">

				<div class="setting-card" @click="showSkuDialog()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-lanya" size="32"></uni-icons>
					</div>
					<div class="card-title">打印机连接</div>
				</div>
				<div class="setting-card" @click="">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-fenleishezhi" size="32"></uni-icons>
					</div>
					<div class="card-title">标签机连接</div>
				</div>
				<div class="setting-card" @click="">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-cheng" size="32"></uni-icons>
					</div>
					<div class="card-title">蓝牙称连接</div>
				</div>
			</div>
		</div>

		<!-- 其他设置区域 -->
		<div class="setting-section">
			<div class="section-header">
				<u-icon name="tags" color="#2979ff" size="18"></u-icon>
				<text class="section-title">其他设置</text>
			</div>
			<div class="settings-grid">
				<div class="setting-card" @click="openExtraModel">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-fujiaxiang-fujian" size="32"></uni-icons>
					</div>
					<div class="card-title">押筐设置</div>
				</div>
				<div class="setting-card" @click="turnToOperaRecord()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-jilu1" size="32"></uni-icons>
					</div>
					<div class="card-title">操作记录</div>
				</div>
				<div class="setting-card" @click="">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-banbenshengji" size="32"></uni-icons>
					</div>
					<div class="card-title">版本升级</div>
				</div>
			</div>
		</div>
	</scroll-view>
	<!-- 额外物品弹窗 -->
	<div class="znj-modal-overlay" v-if="isExtraModalVisible" @click="isExtraModalVisible = false">
		<div class="znj-extra-modal" @click.stop>
			<div class="znj-extra-modal-header">
				<span>额外物品管理</span>
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
					@click="isExtraModalVisible = false" color="#ffffff" class="znj-modal-close"></uni-icons>
			</div>
			<div class="znj-extra-modal-body">
				<ExtraModelMgt />
			</div>
		</div>
	</div>
		
	<!-- 打印机蓝牙连接弹窗 -->
	<div class="znj-modal-overlay" v-if="skuDialogVisible" @click="closeSkuDialog">
		<div class="znj-bluetooth-modal" @click.stop>
			<div class="znj-bluetooth-modal-header">
				<span>打印机蓝牙连接</span>
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
					@click="closeSkuDialog" color="#ffffff" class="znj-modal-close"></uni-icons>
			</div>
			<div class="znj-bluetooth-modal-body">
				<scroll-view scroll-y="true" class="bluetooth-device-list">
					<div v-if="deviceList.length === 0" class="empty-state">
						<uni-icons type="info-filled" size="30" color="#ccc"></uni-icons>
						<text class="empty-text">正在搜索设备...</text>
					</div>
					<div v-else class="device-item" v-for="item in deviceList" @click="onConn(item)" :key="item.deviceId">
						<div class="device-info">
							<uni-icons custom-prefix="iconfont" type="icon-lanya" size="18" color="#1976d2" style="margin-right: 8rpx;"></uni-icons>
							<div class="device-name">{{ item.name }}</div>
						</div>
						<div class="device-signal-wrapper">
							<div class="signal-strength">
								<div class="signal-bar" :class="{ active: getSignalLevel(item.RSSI) >= 1 }"></div>
								<div class="signal-bar" :class="{ active: getSignalLevel(item.RSSI) >= 2 }"></div>
								<div class="signal-bar" :class="{ active: getSignalLevel(item.RSSI) >= 3 }"></div>
								<div class="signal-bar" :class="{ active: getSignalLevel(item.RSSI) >= 4 }"></div>
							</div>
							<div class="signal-value">{{ item.RSSI }} dBm</div>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>
	</div>
		
	<!-- 单位管理弹窗 -->
	<div class="znj-modal-overlay" v-if="unitManagementVisible" @click="closeUnitManagement">
		<div class="znj-unit-modal" @click.stop>
			<div class="znj-unit-modal-header">
				<span>单位管理</span>
				<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="32"
					@click="closeUnitManagement" color="#ffffff" class="znj-modal-close"></uni-icons>
			</div>
			<div class="znj-unit-modal-body">
				<scroll-view scroll-y="true" class="unit-scroll-view">
					<!-- 添加单位区域 -->
					<div class="add-unit-section">
						<div class="input-group">
							<input 
								v-model="newUnitName" 
								placeholder="请输入单位名称" 
								class="unit-input"
								maxlength="10"
							/>
							<button @click="addUnit" class="add-btn" :disabled="!newUnitName.trim()">
								<uni-icons type="plus" size="25" color="#fff"></uni-icons>
								<view style="color: white;">添加</view>
							</button>
						</div>
					</div>
					
					<!-- 单位列表 -->
					<div class="unit-list-section">
						<div class="list-header">
							<text class="list-title">已有单位</text>
							<text class="unit-count">(共{{ unitList.length }}个)</text>
						</div>
						<div class="unit-list">
							<div v-if="unitList.length === 0" class="empty-state">
								<uni-icons type="info-filled" size="30" color="#ccc"></uni-icons>
								<text class="empty-text">暂无单位数据</text>
							</div>
							<div v-else class="unit-item" v-for="(unit, index) in unitList" :key="unit.id">
								<div class="unit-content">
									<div class="unit-name">{{ unit.name }}</div>
								</div>
								<div class="unit-actions">
									<button 
										@click="deleteUnit(unit, index)" 
										class="action-btn delete-btn"
										:disabled="isDefaultUnit(unit.name)"
									>
										<uni-icons type="trash" size="20" :color="isDefaultUnit(unit.name) ? '#ccc' : '#ff4757'"></uni-icons>
									</button>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 底部按钮 -->
					<div class="modal-footer">
						<button @click="closeUnitManagement" class="footer-btn back-btn">
							返回
						</button>
					</div>
				</scroll-view>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import ExtraModelMgt from './extraModelMgt.vue';
	import labelApi from '../../api/label/labelApi';
	export default {
		components: {
			ExtraModelMgt,
		},
		data() {
			return {
				isExtraModalVisible: false,
				skuDialogVisible: false,
				deviceList: [],
				WindowHeight: 0,
				companyId: "",
				// 单位管理相关
				unitManagementVisible: false,
				newUnitName: '',
				unitList: [],
				defaultUnits: ['件', '筐', '包', '个', '斤', '公斤', '箱', '袋'],
				modalMaxHeight: 0
			}
		},
		mounted(){
			this.companyId = uni.getStorageSync('companyId');
			this.WindowHeight = uni.getWindowInfo().windowHeight-50;
			this.calculateModalHeight();
			this.loadUnits();
		},
		methods: {
			openExtraModel() {
				this.isExtraModalVisible = true;
			},
			showSkuDialog() {
				this.skuDialogVisible = true;
				this.onDevice();
			},
		closeSkuDialog() {
			this.skuDialogVisible = false;
			this.deviceList = [];
			this.stopFindBule();
		},
		// 根据RSSI值计算信号强度等级（1-4）
		getSignalLevel(rssi) {
			if (rssi >= -50) return 4; // 优秀
			if (rssi >= -60) return 3; // 良好
			if (rssi >= -70) return 2; // 一般
			if (rssi >= -80) return 1; // 较弱
			return 1; // 很弱
		},
		turnToCommonSetting() {
			uni.navigateTo({
				url: '/pages/setting/commonSetting'
			});
		},
			turnToOperatorSetting() {
				uni.navigateTo({
					url: '/pages/setting/operatorSetting'
				});
			},
			turnToOperaRecord() {
				uni.navigateTo({
					url: '/pages/setting/operaRecord'
				});
			},
			getBLEServices(_deviceId) {
				var that = this;
				let deviceId = _deviceId;
				setTimeout(() => {
					uni.getBLEDeviceServices({
						deviceId: deviceId, // deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						complete(res) {
							let serviceId = "";
							for (var s = 0; s < res.services.length; s++) {
								let serviceId = res.services[s].uuid
								uni.getBLEDeviceCharacteristics({
									deviceId: deviceId, // deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
									serviceId: serviceId, // serviceId 需要在 getBLEDeviceServices 接口中获取
									success(res) {
										var re = JSON.parse(JSON.stringify(res))
										for (var c = 0; c < re.characteristics.length; c++) {
											if (re.characteristics[c].properties.write == true) {
												let uuid = re.characteristics[c].uuid;
												let deviceInfo = {
													deviceId,
													serviceId,
													uuid
												};
												uni.setStorageSync("lastbluetooth", deviceInfo);
											}
										}
									},
									fail(err) {
										console.log("err", err)
									}
								})
							}
						},
						fail(res) {
							console.log(res)
						},
					})
				}, 2000);
			},

			onConn(item) {
				var that = this;
				// uni.showLoading({
				//     title: '正在连接打印机...',
				// });
				// uni.hideLoading();
				// 检查设备是否已经连接
				uni.getConnectedBluetoothDevices({
					services: [], // 可以指定服务 UUID，或者留空以获取所有已连接设备
					success(res) {
						const connectedDevices = res.devices;
						const isConnected = connectedDevices.some(device => device.deviceId === item.deviceId);
						if (isConnected) {
							uni.showToast({
								icon: 'none',
								title: '该打印机连接失败！',
								duration: 1200,
							});
							// that.stopFindBule();
							//             that.getBLEServices(item.deviceId); // 获取打印机服务
							//             return; // 直接返回，不再尝试连接
						}

						// 如果没有连接，尝试连接打印机
						uni.createBLEConnection({
							deviceId: item.deviceId,
							complete(res) {
								uni.hideLoading();
								if (res.errMsg === "createBLEConnection:ok") {
									uni.showToast({
										icon: 'none',
										title: '打印机连接成功！',
										duration: 1200,
									});
									// 连接成功，关闭搜索
									that.stopFindBule();
									console.log("成功")
									that.getBLEServices(item.deviceId); // 获取打印机服务
								} else {
									uni.showToast({
										icon: 'none',
										title: '连接失败！',
										duration: 1200,
									});
									// 这里可以选择重试连接或其他处理
								}
							}
						});
					},
					fail(err) {
						uni.hideLoading();
						uni.showToast({
							icon: 'error',
							title: '获取连接状态失败！',
							duration: 1200,
						});
					}
				});
			},

			stopFindBule() {
				uni.stopBluetoothDevicesDiscovery({
					success: function(res) {
					},
					fail: function(err) {
					}
				});
			},
			onDevice() { // 监听已搜索到的蓝牙设备中
				const that = this;
				uni.startBluetoothDevicesDiscovery({
					success(res) {
						// 这里可以遍历搜索到的设备，找到你的打印机  
						// 假设你已知打印机的设备名称
						uni.onBluetoothDeviceFound(function(devices) {
							var res = JSON.parse(JSON.stringify(devices));
							const deviceExists = that.deviceList.some(device => device.deviceId === res
								.devices[0].deviceId);

							if (!deviceExists && res.devices[0].localName != "") {
								that.deviceList.push(res.devices[0]);
								that.deviceList=that.deviceList.sort((a, b) => b.RSSI - a.RSSI);
							}

						})
						//       console.log('开始搜索蓝牙设备', res); 

					} 
				});
			},
			
			// 计算弹窗最大高度（屏幕高度的80%）
			calculateModalHeight() {
				try {
					const windowInfo = uni.getWindowInfo();
					this.modalMaxHeight = Math.floor(windowInfo.windowHeight * 0.8);
				} catch (e) {
					console.error('获取窗口信息失败:', e);
					// 设置一个默认值
					this.modalMaxHeight = 600;
				}
			},
			
			// 单位管理相关方法
			openUnitManagement() {
				this.unitManagementVisible = true;
				this.calculateModalHeight(); // 每次打开时重新计算高度
				this.loadUnits();
			},
			
			closeUnitManagement() {
				this.unitManagementVisible = false;
				this.newUnitName = '';
			},
			
			// 加载单位数据
			loadUnits() {
				if (!this.companyId) {
					console.error('公司ID未找到');
					return;
				}
				
				labelApi.GetCompanyUnit(this.companyId).then(res => {
					if (res.code === 200) {
						this.unitList = res.data.map(unit => ({
							id: unit.id,
							name: unit.unitName
						}));
						
					} else {
						console.error('获取单位数据失败:', res.message);
						this.initDefaultUnits();
					}
				}).catch(error => {
					console.error('加载单位数据失败:', error);
				});
			},
			
			
			// 添加新单位
			addUnit() {
				const unitName = this.newUnitName.trim();
				if (!unitName) return;
				
				// 检查是否重复
				if (this.unitList.some(unit => unit.name === unitName)) {
					uni.showToast({
						title: '单位已存在',
						icon: 'none'
					});
					return;
				}
				
				let userInfo = uni.getStorageSync("userInfo");

				const unitData = {
					operatorId: userInfo.id,
					companyId: this.companyId,
					unitName: unitName
				};
				
				labelApi.createCompanyUnit(unitData).then(res => {
					if (res.code === 200) {
						// 添加到本地列表
						const newUnit = {
							id: res.data.id,
							name: unitName
						};
						
						this.unitList.push(newUnit);
						this.newUnitName = '';
						
						uni.showToast({
							title: '添加成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.message || '添加失败',
							icon: 'none'
						});
					}
				}).catch(error => {
					console.error('添加单位失败:', error);
					uni.showToast({
						title: '网络错误',
						icon: 'none'
					});
				});
			},
			
			
			// 删除单位
			deleteUnit(unit, index) {
				if (this.isDefaultUnit(unit.name)) {
					uni.showToast({
						title: '默认单位不能删除',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '确认删除',
					content: `确定要删除单位"${unit.name}"吗？`,
					success: (res) => {
						if (res.confirm) {
							labelApi.deleteCompanyUnit(unit.id).then(response => {
								if (response.code === 200) {
									this.unitList.splice(index, 1);
									
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: response.message || '删除失败',
										icon: 'none'
									});
								}
							}).catch(error => {
								console.error('删除单位失败:', error);
								uni.showToast({
									title: '网络错误',
									icon: 'none'
								});
							});
						}
					}
				});
			},
			
			// 判断是否为默认单位
			isDefaultUnit(unitName) {
				return this.defaultUnits.includes(unitName);
			},
			
			// 初始化默认单位
			initDefaultUnits() {
				// 批量创建默认单位
				const promises = this.defaultUnits.map(unitName => {
					const unitData = {
						companyId: this.companyId,
						unitName: unitName
					};
					return labelApi.createCompanyUnit(unitData);
				});
				
				Promise.all(promises).then(results => {
					this.unitList = results.map((res, index) => {
						if (res.code === 200) {
							return {
								id: res.data.id,
								name: this.defaultUnits[index]
							};
						} else {
							// 如果创建失败，使用临时ID
							return {
								id: Date.now() + index,
								name: this.defaultUnits[index]
							};
						}
					});
				}).catch(error => {
					console.error('初始化默认单位失败:', error);
					// 降级到本地创建
					this.unitList = this.defaultUnits.map((name, index) => ({
						id: Date.now() + index,
						name: name
					}));
				});
			}
		}
	}
</script>

<style scoped>
	.setting-container {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		height: 100vh;
		padding: 16rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.setting-section {
		background: #ffffff;
		border-radius: 12rpx;
		padding: 16rpx;
		margin-bottom: 12rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
		border: 1rpx solid rgba(255, 255, 255, 0.8);
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.setting-section:last-child {
		margin-bottom: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
		padding-bottom: 8rpx;
		border-bottom: 1rpx solid #f0f2f5;
		flex-shrink: 0;
	}

	.section-title {
		margin-left: 6rpx;
		color: #2979ff;
		font-size: 28rpx;
		font-weight: 600;
		letter-spacing: 0.5rpx;
	}

	.settings-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12rpx;
		padding: 0;
		flex: 1;
		align-content: start;
	}

	.setting-card {
		background: #ffffff;
		border-radius: 8rpx;
		padding: 12rpx 8rpx;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1rpx solid #f0f2f5;
		position: relative;
		overflow: hidden;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.setting-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, rgba(41, 121, 255, 0.05), rgba(41, 121, 255, 0.1));
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.setting-card:hover::before {
		opacity: 1;
	}

	.setting-card:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 15rpx rgba(41, 121, 255, 0.12);
		border-color: #2979ff;
	}

	.setting-card:active {
		transform: translateY(-1rpx);
		transition: transform 0.1s ease;
	}

	.card-icon {
		position: relative;
		z-index: 1;
		color: #2979ff;
		margin-bottom: 4rpx;
		transition: all 0.3s ease;
	}

	.setting-card:hover .card-icon {
		color: #1565c0;
		transform: scale(1.05);
	}

	.card-title {
		position: relative;
		z-index: 1;
		font-size: 22rpx;
		color: #333333;
		font-weight: 500;
		line-height: 1.2;
		transition: color 0.3s ease;
	}

	.setting-card:hover .card-title {
		color: #2979ff;
	}

	/* 蓝牙连接弹窗样式 */
	.znj-bluetooth-modal {
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		width: 500rpx;
		max-height: 80vh;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.znj-bluetooth-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		font-size: 15rpx;
		font-weight: bold;
		padding: 15rpx 20rpx;
		color: #ffffff;
		border-radius: 16px 16px 0 0;
		flex-shrink: 0;
	}

	.znj-bluetooth-modal-body {
		flex: 1;
		overflow: hidden;
		padding: 15rpx;
	}

	.bluetooth-device-list {
		max-height: 400rpx;
	}

	.device-item {
		background: #fafbfc;
		border: 1px solid #eee;
		border-radius: 6rpx;
		margin-bottom: 8rpx;
		padding: 12rpx 15rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.device-item:hover {
		background: #e3f2fd;
		border-color: #1976d2;
		transform: translateX(2rpx);
	}

	.device-item:last-child {
		margin-bottom: 0;
	}

	.device-info {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.device-name {
		font-size: 14rpx;
		color: #333;
		font-weight: 500;
	}

	.device-signal-wrapper {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.signal-strength {
		display: flex;
		align-items: flex-end;
		gap: 2rpx;
		height: 16rpx;
	}

	.signal-bar {
		width: 3rpx;
		background: #e0e0e0;
		transition: background 0.3s ease;
	}

	.signal-bar:nth-child(1) {
		height: 25%;
	}

	.signal-bar:nth-child(2) {
		height: 50%;
	}

	.signal-bar:nth-child(3) {
		height: 75%;
	}

	.signal-bar:nth-child(4) {
		height: 100%;
	}

	.signal-bar.active {
		background: linear-gradient(to top, #4caf50, #66bb6a);
	}

	.signal-value {
		font-size: 11rpx;
		color: #666;
		min-width: 50rpx;
		text-align: right;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
		color: #999;
	}

	.empty-text {
		margin-top: 10rpx;
		font-size: 13rpx;
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

	/* 单位管理弹窗样式 */
	.znj-unit-modal {
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		width: 450rpx;
		max-height: 80vh;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.znj-unit-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		font-size: 15rpx;
		font-weight: bold;
		padding: 15rpx 20rpx;
		color: #ffffff;
		border-radius: 16px 16px 0 0;
		flex-shrink: 0;
	}

	.znj-modal-close {
		cursor: pointer;
	}

	.znj-unit-modal-body {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.unit-scroll-view {
		flex: 1;
		max-height: 400rpx;
	}

	.add-unit-section {
		padding: 20rpx;
		padding-bottom: 15rpx;
		border-bottom: 1px solid #f0f2f5;
	}

	.input-group {
		display: flex;
		gap: 10rpx;
		align-items: center;
	}

	.unit-input {
		flex: 1;
		height: 35rpx;
		padding: 5rpx 12rpx;
		border: 1px solid #e0e0e0;
		border-radius: 5rpx;
		font-size: 14rpx;
		background: #ffffff;
		transition: border-color 0.3s ease;
		line-height: 35rpx;
	}

	.unit-input:focus {
		border-color: #1976d2;
		outline: none;
	}

	.add-btn {
		height: 35rpx;
		padding: 0 15rpx;
		background: linear-gradient(90deg, #4caf50, #43a047);
		color: white;
		border: none;
		border-radius: 5rpx;
		font-size: 13rpx;
		font-weight: bold;
		display: flex;
		align-items: center;
		gap: 5rpx;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 70rpx;
		justify-content: center;
	}

	.add-btn:hover:not(:disabled) {
		background: linear-gradient(90deg, #43a047, #388e3c);
	}

	.add-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.unit-list-section {
		padding: 15rpx 20rpx;
		flex: 1;
	}

	.list-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		gap: 5rpx;
	}

	.list-title {
		font-size: 14rpx;
		font-weight: 600;
		color: #333;
	}

	.unit-count {
		font-size: 12rpx;
		color: #666;
	}

	.unit-list {
		padding: 5rpx 0;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		color: #999;
	}

	.empty-text {
		margin-top: 10rpx;
		font-size: 13rpx;
	}

	.unit-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 12rpx;
		margin-bottom: 8rpx;
		background: #fafbfc;
		border: 1px solid #eee;
		border-radius: 6rpx;
		transition: all 0.2s ease;
	}

	.unit-item:hover {
		background: #e3f2fd;
		border-color: #1976d2;
	}

	.unit-item:last-child {
		margin-bottom: 0;
	}

	.unit-content {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.unit-name {
		font-size: 14rpx;
		color: #333;
		font-weight: 500;
	}

	.unit-actions {
		display: flex;
		gap: 5rpx;
		align-items: center;
	}

	.action-btn {
		width: 30rpx;
		height: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 4rpx;
		cursor: pointer;
		transition: all 0.2s ease;
		background: transparent;
	}

	.delete-btn:hover:not(:disabled) {
		background: rgba(255, 71, 87, 0.1);
		transform: scale(1.1);
	}

	.delete-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.modal-footer {
		display: flex;
		justify-content: center;
		padding: 15rpx 20rpx;
		border-top: 1px solid #f0f2f5;
		flex-shrink: 0;
	}

	.footer-btn {
		height: 40rpx;
		padding: 0 30rpx;
		border: none;
		border-radius: 5rpx;
		font-size: 14rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 5rpx;
		justify-content: center;
		min-width: 100rpx;
	}

	.back-btn {
		background: #bdbdbd;
		color: #fff;
	}

	.back-btn:hover {
		background: #9e9e9e;
	}

	/* 额外物品弹窗样式 */
	.znj-extra-modal {
		background: #fff;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		width: 550rpx;
		max-height: 85vh;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.znj-extra-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		font-size: 15rpx;
		font-weight: bold;
		padding: 15rpx 20rpx;
		color: #ffffff;
		border-radius: 16px 16px 0 0;
		flex-shrink: 0;
	}

	.znj-extra-modal-body {
		flex: 1;
		overflow: hidden;
		padding: 0;
	}
</style>