<template>
	<div class="setting-container">
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
				<div class="setting-card" @click="showSkuDialog()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-lanya" size="32"></uni-icons>
					</div>
					<div class="card-title">打印机连接</div>
				</div>
				<div class="setting-card" @click="turnToCommonSetting()">
					<div class="card-icon">
						<uni-icons custom-prefix="iconfont" type="icon-jibenshezhi_1" size="32"></uni-icons>
					</div>
					<div class="card-title">基本设置</div>
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

		<!-- 弹窗 -->
		<u-modal title="额外物品" :show="isExtraModalVisible" :closeOnClickOverlay="true"
			@close="isExtraModalVisible = false" :showConfirmButton="false" :width="'700px'">
			<ExtraModelMgt />
		</u-modal>
		
		<u-modal title="打印机蓝牙连接" :show="skuDialogVisible" @close="closeSkuDialog" :closeOnClickOverlay="true"
			:showConfirmButton="false" :width="'500px'">
			<scroll-view scroll-y="true" class="device-list">
				<div class="device-item" v-for="item in deviceList" @click="onConn(item)" :key="item.deviceId">
					<div class="device-name">{{ item.name }}</div>
					<div class="device-signal">{{ item.RSSI }}</div>
				</div>
			</scroll-view>
		</u-modal>
	</div>
</template>

<script>
	import ExtraModelMgt from './extraModelMgt.vue';
	export default {
		components: {
			ExtraModelMgt,
		},
		data() {
			return {
				isExtraModalVisible: false,
				skuDialogVisible: false,
				deviceList: []
			}
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

	/* 弹窗样式优化 */
	.device-list {
		height: 350rpx;
		padding: 8rpx;
	}

	.device-item {
		background: #ffffff;
		border: 1rpx solid #f0f2f5;
		border-radius: 8rpx;
		margin-bottom: 8rpx;
		padding: 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.device-item:hover {
		background: #f8f9ff;
		border-color: #2979ff;
		transform: translateX(2rpx);
	}

	.device-item:last-child {
		margin-bottom: 0;
	}

	.device-name {
		flex: 1;
		font-size: 15rpx;
		color: #333333;
		font-weight: 500;
	}

	.device-signal {
		font-size: 15rpx;
		color: #666666;
		background: #f5f7fa;
		padding: 4rpx 10rpx;
		border-radius: 16rpx;
	}
</style>