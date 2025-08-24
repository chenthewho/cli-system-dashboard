import {
	baseUrl
} from '@/common/config.js';

function check(param = {}) {
	// 合并默认参数
	param = Object.assign({
		title: "检测到有新版本！",
		content: "请升级app到最新版本！",
		canceltext: "暂不升级",
		oktext: "立即升级"
	}, param)
	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		let platform = plus.os.name.toLocaleLowerCase()
		uni.request({
			url: baseUrl + '/Update/GetUpdateInfo',
			method: 'GET',
			success: res => {
				var result = res.data;
				let data = result.data ? result.data : null;
				if (widgetInfo.version === data.versionId) {
					return;
				}

				if (result.code == 200) {
					if (platform == 'ios') {
						// 如果是ios,则跳转到appstore
						plus.runtime.openURL(result.data.data.url)
						return;
					}
					// android进行如下操作
					uni.showModal({
						title: param.title,
						content: data.intro ? data.intro : param.content,
						showCancel:  true,
						confirmText: param.oktext,
						cancelText: param.canceltext,
						success: res => {
							//不升级则退出操作
							// if (!res.confirm) {
							// 	plus.runtime.quit();
							// }
							if (!res.confirm) {
								return;
							}else{
							if (false) {
								//去应用市场更新
								plus.runtime.openURL(data.url);
								plus.runtime.restart();
							} else {
								// 开始下载
								// 创建下载任务
								var dtask = plus.downloader.createDownload(data.url, {
										filename: "_downloads/"
									},
									function(d, status) {
										if (status == 200) {
											plus.runtime.install(d.filename, {
												force: true
											}, function() {
												//进行重新启动;
												plus.runtime.restart();
											}, (e) => {
												uni.showToast({
													title: '安装升级包失败:' +
														JSON
														.stringify(
															e),
													icon: 'none'
												})
											});
										} else {
											this.tui.toast(
												"下载升级包失败，请手动去站点下载安装，错误码: " +
												status);
										}
									});

								let view = new plus.nativeObj.View("maskView", {
									backgroundColor: "rgba(0,0,0,.6)",
									left: ((plus.screen.resolutionWidth / 2) -
											45) +
										"px",
									bottom: "80px",
									width: "90px",
									height: "30px"
								})

								view.drawText('开始下载', {}, {
									size: '12px',
									color: '#FFFFFF'
								});

								view.show()
								dtask.addEventListener("statechanged", (e) => {
									if (e && e.downloadedSize > 0) {
										let jindu = ((e.downloadedSize / e
												.totalSize) *
											100).toFixed(2)
										view.reset();
										view.drawText('进度:' + jindu + '%', {}, {
											size: '12px',
											color: '#FFFFFF'
										});
									}
								}, false);
								dtask.start();
							}
							}
						}
					})
				
				}
			}

		})
	});
}

export default {
	check
}