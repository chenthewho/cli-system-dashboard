	export default {
			onDevice() { // 监听已搜索到的蓝牙设备中
				console.log("监听已搜索到的蓝牙设备中...")
				const that = this;
				uni.onBluetoothDeviceFound(function(devices) {
					var res = JSON.parse(JSON.stringify(devices));
					
					// console.log(res.devices[0].name + "  " + res.devices[0].deviceId);
					if (res.devices[0].deviceId == "66:32:79:4E:7D:E6") {
						that.BH_BlueJack = res.devices[0];
						
						that.onConn(res.devices[0]);
					}
				})
			},
			onConn(item) {
				var that = this;
				uni.getConnectedBluetoothDevices({
					services: [], // 可以指定服务 UUID，或者留空以获取所有已连接设备
					success(res) {
						const connectedDevices = res.devices;
						const isConnected = connectedDevices.some(device => device.deviceId === item.deviceId);
						if (isConnected) {
							console.log("打印机已经连接: [" + item.name + "]");
							// uni.showToast({
							// 	icon: 'success',
							// 	title: '打印机已连接！',
							// 	duration: 1200,
							// });
							that.stopFindBule();
							that.getBLEServices(item.deviceId); // 获取打印机服务
							return; // 直接返回，不再尝试连接
						}
			
						// 如果没有连接，尝试连接打印机
						uni.createBLEConnection({
							deviceId: item.deviceId,
							complete(res) {
								uni.hideLoading();
								if (res.errMsg === "createBLEConnection:ok") {
									console.log("打印机连接蓝牙: [" + item.name + "] 成功");
									// uni.showToast({
									// 	icon: 'none',
									// 	title: '打印机连接成功！',
									// 	duration: 2000,
									// });
									// 连接成功，关闭搜索
									that.stopFindBule();
									that.getBLEServices(item.deviceId); // 获取打印机服务
								} else {
									// uni.showToast({
									// 	icon: 'none',
									// 	title: '打印机连接失败！',
									// 	duration: 2000,
									// });
								}
							}
						});
					},
					fail(err) {
						console.error("获取已连接设备失败:", err);
						uni.hideLoading();
						uni.showToast({
							icon: 'error',
							title: '获取连接状态失败！',
							duration: 1200,
						});
					}
				});
			},
			
			getBLEServices(_deviceId) {
				var that = this;
				let deviceId = _deviceId;
				console.log("获取蓝牙设备所有服务(service)--->", deviceId)
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
			stopFindBule() {
				console.log("停止搜索蓝牙设备");
				uni.stopBluetoothDevicesDiscovery({
					success: function(res) {
						console.log("停止搜索蓝牙设备成功", res);
					},
					fail: function(err) {
						console.error("停止搜索蓝牙设备失败", err);
					}
				});
			},
		initBluetooth() {
				var that = this;
				console.log("进入初始化蓝牙")
				// 1.1 初始化蓝牙模块
				uni.openBluetoothAdapter({
					success(res) { // 蓝牙适配器初始化成功
						console.log("已打开--->蓝牙")
						// 获取本机蓝牙适配器状态
						uni.getBluetoothAdapterState({
							success: function(res) {
								console.log('本机蓝牙适配器状态', res)
								if (res.available) {
									var lastConn = uni.getStorageSync("lastbluetooth");
									
									if (lastConn) {
										that.onConn(lastConn);
									}
									if (res.discovering) {
										that.stopFindBule(); // 停止搜索蓝牙设备
									}
								} else {
									console.log('本机蓝牙不可用');
								}
							},
						})
					},
					fail(err) { // 蓝牙适配器初始化失败
						uni.showToast({
							icon: 'error',
							title: '蓝牙初始化失败，请到设置打开蓝牙',
							duration: 2000
						});
					}
				})
			},
	}