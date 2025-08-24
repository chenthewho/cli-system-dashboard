<script>
	import config from './common/config'
	// import * as tsc from "./printer/tsc.js";
	import global from './common/const/global'
	import PrinterJobs from './printer/printerjobs.js';
	import GBK from './printer/gbk.min.js';
	import BluetoothTool from './printer/bluetoothTool.js';
	import checkappupdate from './common/appUpdate.js';
	// import {
	// 	printQR,
	// 	printCommand,
	// 	sendDataToDevice
	// } from './printer/bluetoolth';
	export default {
		data() {
			return {
				// DevicesDiscovery: []
			}
		},
		onLaunch: function() {
			//自动更新
			// #ifdef APP-PLUS
			checkappupdate.check({
			              title: '检测到有新版本！',
			              content: '请升级app到最新版本！',
			              canceltext: '暂不升级',
			              oktext: '立即升级'
			          });
			// #endif		  
					
											
					  
			this.autoLogin()
			this.checkPermission(["android.permission.BLUETOOTH_CONNECT"], "蓝牙", function() {
				
			});
			BluetoothTool.initBluetooth();
		},
		onShow: function() {
			plus.navigator.setFullscreen(true);
			plus.navigator.hideSystemNavigation()

			uni.onWindowResize(this.windowResizeCallback)
			this.initSystem()
			// uni.reLaunch({
			// 	url: '/pages/index/index'
			// })

		},
		onHide: function() {},
		methods: {
			windowResizeCallback(res) {

				const width = res.size.windowWidth
				this.initGridCol(width)
				this.initModalSize(width)
			},
			autoLogin() {
				// const localPath = this.$route.path
				// if (config.noAuthPages.findIndex(x => x === localPath) >= 0) {
				// 	return
				// }
				this.$store.dispatch('actionInit').then(tokenInfo => {
					uni.reLaunch({
						url: '/pages/auth/login'
					})
					// 判断缓存是否有token,如果没有，跳转到登录页
					// if (!tokenInfo) {
					// 	uni.showToast({
					// 		title: '未登录',
					// 		icon: 'none',
					// 		position: 'top',
					// 		mask: true
					// 	})
					// 	setTimeout(() => {
					// 		uni.reLaunch({
					// 			url: '/pages/auth/login'
					// 		})
					// 	}, 1000)
					// }
				})
			},
			initSystem() {
				const window = uni.getWindowInfo()
				const width = window.windowWidth
				this.initGridCol(width)
				this.initModalSize(width)
				if (window.windowHeight < 500) {
					uni.showModal({
						title: '提示',
						content: '屏幕过小会影响使用体验，请更换大屏幕使用',
						showCancel: false
					})
				}
			},

			checkPermission(permissions, permissionName, success) {
				plus.android.requestPermissions(permissions, function(e) {
					if (e.deniedAlways.length > 0) { //权限被永久拒绝
						// 弹出提示框解释为何需要读写手机储存权限，引导用户打开设置页面开启
						uni.showModal({
							title: permissionName + '权限',
							content: '您可能拒绝了' + permissionName + '权限或您的设备无需设置权限',
							success: function(res) {
								if (res.confirm) {
									// console.log('用户点击确定');
								} else if (res.cancel) {
									// console.log('用户点击取消');
								}
							}
						});
					}
					if (e.deniedPresent.length > 0) { //权限被临时拒绝
						plus.android.requestPermissions(permissions)
					}
					if (e.granted.length > 0) { //权限被允许
						if (success) {
							success();
						}
					}
				}, function(e) {
					console.log('checkPermission error:', e);
				});
			},
			initGridCol(width) {
				let col = 3
				if (width <= 600) {
					col = 1
				}
				if (width <= 1000) {
					col = 2
				} else if (width <= 1300) {
					col = 3
				} else if (width <= 1600) {
					col = 4
				} else {
					col = 5
				}
				global.setGridCol(col)
			},
			initModalSize(width, height) {
				const widthCacle = 0.6
				let modalWidth = '500px'
				if (width) {
					modalWidth = (width * widthCacle) + 'px'
				}
				global.setModalWidth(modalWidth)
			},
			//打印发送
			senBleLabel(order) {
				var buleTeethInfo = uni.getStorageSync("lastbluetooth");
				if (!buleTeethInfo) {
					uni.showToast({
						icon: 'none',
						title: '尚未连接打印机',
						duration: 1000,
					});
					return;
				}
				var currentCompanyName = uni.getStorageSync('companyName');
				var address = uni.getStorageSync("address");
				var contact = uni.getStorageSync("contact");
				let ModelList = JSON.parse(order.module);
				const that = this;
				let printerJobs = new PrinterJobs();
				// printerJobs.lineFeed(1);
				printerJobs.setSize(2).setAlign('LT').print('【付款凭证】\r\n');
				printerJobs.lineFeed(1);
				printerJobs.setAlign('CT');
				printerJobs.setSize(3).print(`${currentCompanyName}\r\n`);
				printerJobs.setAlign('LT');
				printerJobs.setSize(2).print(`买家：${order.customName!=null?order.customName:""}`);
				printerJobs.setSize(1).print("支付时间：");
				printerJobs.setSize(2).print('-------------------货品信息------------------').println().setBold(false);
				var goodIndex = 0;
				for (var i = 0; i < ModelList.length; i++) {
					var x = ModelList[i];
					if (x.type == 1) {
						goodIndex+=1;
						printerJobs.setSize(2).text(`${goodIndex}.${x.name}`).text(' '.repeat(10));
						printerJobs.text(`小计：${x.subtotal}`).println();
						printerJobs.setAlign('LT');
						printerJobs.setSize(1).text(that.calculateSpacesTo9(`数量：${x.mount}件`)).text(that
							.calculateSpacesTo9(`单价：${x.referenceAmount}`)).text(that
							.calculateSpacesTo12(
								`重量：${x.totalWeight-x.tareWeight}(${x.totalWeight}-${x.tareWeight})`)).println();
					}
				}
				const filteredList = ModelList.filter(item => item.type === 2);
				if (filteredList.length > 0) {
					printerJobs.text(`(附加项)`).println();
				}
				for (var i = 0; i < filteredList.length; i++) {
					var x = filteredList[i];
					printerJobs.setSize(1).text(`${i+1}.${x.name}`).text(' '.repeat(10));
					printerJobs.text(`小计：${x.subtotal}`).println();
					printerJobs.setAlign('LT');
					printerJobs.setSize(1).text(that.calculateSpacesTo15(`数量：${x.mount}件`)).text(that.calculateSpacesTo15(
						`单价：${x.referenceAmount}`)).println();
				}
				printerJobs.setAlign('LT');
				printerJobs.setSize(2).print('-------------------------------------------');
				printerJobs.setSize(4);
				printerJobs.text(`总计：${order.payableAmount}元`).println();
				if (order.basketOffsetAmount > 0) {
					printerJobs.text(`收筐抵扣：${order.basketOffsetAmount}元`).println();
				}
				if (order.debt > 0) {
					printerJobs.text(`应付金额：${order.debt}元`).println();
				}
				printerJobs.text(`实付金额：${order.actualMoney}元`).println();
				printerJobs.setSize(2).print('-------------------------------------------');
				printerJobs.setSize(1);
				if (address) {
					printerJobs.text(`联系地址：${address}`).println();
				}
				if (contact) {
					printerJobs.text(`联系电话：${contact}`).println();
				}
				printerJobs.text(`打印时间:${this.getFormattedDate()}`).println();
				printerJobs.text("--智农佳--农批人的管理系统");
				printerJobs.lineFeed(2);
				printerJobs.caizhi();
				let buffer = printerJobs.buffer();
				this.senBlData(buleTeethInfo.deviceId, buleTeethInfo.serviceId, buleTeethInfo.uuid, buffer);

			},

			//打印挂单
			senBleLabel_GD(order) {
				var buleTeethInfo = uni.getStorageSync("lastbluetooth");
				if (!buleTeethInfo) {
					uni.showToast({
						icon: 'error',
						title: '尚未连接打印机',
						duration: 1200,
					});
					return;
				}
				// console.log("order",order)
				var currentCompanyName = uni.getStorageSync('companyName');
				var address = uni.getStorageSync("address");
				var contact = uni.getStorageSync("contact");
				let ModelList = JSON.parse(order.module);
				// console.log("ModelList",ModelList)
				const that = this;
				let printerJobs = new PrinterJobs();
				printerJobs.lineFeed(1);
				printerJobs.setSize(2).setAlign('LT').print('【挂单打印】\r\n');
				printerJobs.lineFeed(1);
				printerJobs.setAlign('CT');
				printerJobs.setSize(3).print(`${currentCompanyName}\r\n`);
				printerJobs.setAlign('LT');
				printerJobs.setSize(2).print(`买家：${order.customName!=null?order.customName:""}`);
				printerJobs.setSize(2).print('-------------------货品信息------------------').println().setBold(false);
				for (var i = 0; i < ModelList.length; i++) {
					var x = ModelList[i];
					// if (x.type == 1) {
						printerJobs.setSize(2).text(`${i+1}.${x.name}`).text(' '.repeat(10));
						// printerJobs.text(`小计：${x.subtotal}`).println();
						printerJobs.setAlign('LT');
						printerJobs.setSize(2).text(that.calculateSpacesTo9(`数量：${x.mount}件`)).text(that
							.calculateSpacesTo15(
								`总重：${x.totalWeight}`)).println();
					// }
				}
				const filteredList = ModelList.filter(item => item.type === 2);
				if (filteredList.length > 0) {
					printerJobs.text(`(附加项)`).println();
				}
				for (var i = 0; i < filteredList.length; i++) {
					var x = filteredList[i];
					printerJobs.setSize(1).text(`${i+1}.${x.name}`).text(' '.repeat(10));
					// printerJobs.text(`小计：${x.subtotal}`).println();
					printerJobs.setAlign('LT');
					printerJobs.setSize(2).text(that.calculateSpacesTo9(`数量：${x.mount}件`)).text(that.calculateSpacesTo15(
						`单价：${x.referenceAmount}`)).println();
				}
				printerJobs.setAlign('LT');
				// printerJobs.setSize(2).print('-------------------------------------------');
				// printerJobs.setSize(4);
				// printerJobs.text(`总计：${order.payableAmount}元`).println();
				// if (order.basketOffsetAmount > 0) {
				// 	printerJobs.text(`收筐抵扣：${order.basketOffsetAmount}元`).println();
				// }
				// if (order.debt > 0) {
				// 	printerJobs.text(`下欠：${order.debt}元`).println();
				// }
				// printerJobs.text(`实付：${order.actualMoney}元`).println();
				printerJobs.setSize(2).print('-------------------------------------------');
				printerJobs.lineFeed(2);
				printerJobs.caizhi();
				let buffer = printerJobs.buffer();
				this.senBlData(buleTeethInfo.deviceId, buleTeethInfo.serviceId, buleTeethInfo.uuid, buffer);

			},
			getFormattedDate() {
				const now = new Date();
				const year = now.getFullYear();
				const month = String(now.getMonth() + 1).padStart(2, '0'); // 补零
				const day = String(now.getDate()).padStart(2, '0'); // 补零
				const hours = String(now.getHours()).padStart(2, '0'); // 补零
				const minutes = String(now.getMinutes()).padStart(2, '0'); // 补零
				const seconds = String(now.getSeconds()).padStart(2, '0'); // 补零

				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			},
			calculateSpacesTo9(inputString) {
				// 获取输入字符串的长度
				const currentLength = inputString.length;
				// 计算需要的空格数
				const spacesNeeded = Math.max(0, 9 - currentLength);
				// 在字符串末尾添加空格
				const newString = inputString + ' '.repeat(spacesNeeded);
				return newString;
			},
			calculateSpacesTo15(inputString) {
				// 获取输入字符串的长度
				const currentLength = inputString.length;
				// 计算需要的空格数
				const spacesNeeded = Math.max(0, 15 - currentLength);
				// 在字符串末尾添加空格
				const newString = inputString + ' '.repeat(spacesNeeded);
				return newString;
			},
			calculateSpacesTo12(inputString) {
				// 获取输入字符串的长度
				const currentLength = inputString.length;
				// 计算需要的空格数
				const spacesNeeded = Math.max(0, 12 - currentLength);
				// 在字符串末尾添加空格
				const newString = inputString + ' '.repeat(spacesNeeded);
				return newString;
			},
			// 标签打印
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				var uint8Buf = Array.from(uint8Array);

				function split_array(datas, size) {
					var result = [];
					for (var i = 0; i < datas.length; i += size) {
						result.push(datas.slice(i, i + size));
					}
					return result;
				}

				var sendloop = split_array(uint8Buf, 20);
				function realWriteData(sendloop, i) {
					if (i >= sendloop.length) {
						return;
					}
					var data = sendloop[i];
					var buffer = new ArrayBuffer(data.length);
					var dataView = new DataView(buffer);
					for (var j = 0; j < data.length; j++) {
						dataView.setUint8(j, data[j]);
					}
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success(res) {
							// 延时100ms再发送下一包，防止写入过快
							setTimeout(() => {
								realWriteData(sendloop, i + 1);
							}, 100);
						},
						fail(err) {
							// 失败时也尝试继续发送下一包，或者根据需求重试
							setTimeout(() => {
								realWriteData(sendloop, i + 1);
							}, 100);
						}
					});
				}
				realWriteData(sendloop, 0);
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "./common/css/main.scss";
	@import "@/static/iconfont.css";
</style>