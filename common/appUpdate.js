import { baseUrl } from '@/common/config.js'

/**
 * 创建下载进度视图
 */
function createProgressView() {
  const screenWidth = plus.screen.resolutionWidth
  const screenHeight = plus.screen.resolutionHeight
  const viewWidth = 280
  const viewHeight = 120

  // 创建半透明遮罩
  const maskView = new plus.nativeObj.View('updateMask', {
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  })

  // 创建进度卡片
  const progressView = new plus.nativeObj.View('updateProgress', {
    top: screenHeight / 2 - viewHeight / 2 + 'px',
    left: screenWidth / 2 - viewWidth / 2 + 'px',
    width: viewWidth + 'px',
    height: viewHeight + 'px',
    backgroundColor: '#FFFFFF',
  })

  // 绘制卡片样式
  progressView.draw([
    // 圆角背景
    {
      tag: 'rect',
      id: 'background',
      rectStyles: {
        color: '#FFFFFF',
        radius: '12px',
      },
    },
    // 标题
    {
      tag: 'font',
      id: 'title',
      text: '正在下载更新',
      textStyles: {
        size: '16px',
        color: '#333333',
        weight: 'bold',
        align: 'center',
      },
      position: {
        top: '20px',
        left: '0px',
        width: '100%',
        height: '25px',
      },
    },
    // 进度文本
    {
      tag: 'font',
      id: 'progressText',
      text: '0%',
      textStyles: {
        size: '24px',
        color: '#4CAF50',
        weight: 'bold',
        align: 'center',
      },
      position: {
        top: '50px',
        left: '0px',
        width: '100%',
        height: '30px',
      },
    },
    // 提示文本
    {
      tag: 'font',
      id: 'tipText',
      text: '请稍候...',
      textStyles: {
        size: '12px',
        color: '#999999',
        align: 'center',
      },
      position: {
        top: '85px',
        left: '0px',
        width: '100%',
        height: '20px',
      },
    },
  ])

  maskView.show()
  progressView.show()

  return {
    maskView,
    progressView,
    update: function (progress, downloadedSize, totalSize) {
      const progressPercent = progress.toFixed(1) + '%'
      const downloaded = (downloadedSize / 1024 / 1024).toFixed(2) + 'MB'
      const total = (totalSize / 1024 / 1024).toFixed(2) + 'MB'

      progressView.draw([
        // 更新进度文本
        {
          tag: 'font',
          id: 'progressText',
          text: progressPercent,
          textStyles: {
            size: '24px',
            color: '#4CAF50',
            weight: 'bold',
            align: 'center',
          },
          position: {
            top: '50px',
            left: '0px',
            width: '100%',
            height: '30px',
          },
        },
        // 更新提示文本
        {
          tag: 'font',
          id: 'tipText',
          text: downloaded + ' / ' + total,
          textStyles: {
            size: '12px',
            color: '#999999',
            align: 'center',
          },
          position: {
            top: '85px',
            left: '0px',
            width: '100%',
            height: '20px',
          },
        },
      ])
    },
    close: function () {
      maskView.close()
      progressView.close()
    },
  }
}

function check(param = {}) {
  // 合并默认参数
  param = Object.assign(
    {
      title: '发现新版本',
      content: '检测到新版本，建议您立即更新以获得更好的体验！',
      canceltext: '暂不更新',
      oktext: '立即更新',
    },
    param
  )

  plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
    let platform = plus.os.name.toLocaleLowerCase()
    uni.request({
      url: baseUrl + '/Update/GetUpdateInfo',
      method: 'GET',
      success: res => {
        var result = res.data
        let data = result.data ? result.data : null

        if (!data || widgetInfo.version === data.versionId) {
          return
        }

        if (result.code === 200) {
          if (platform === 'ios') {
            // 如果是ios,则跳转到appstore
            plus.runtime.openURL(result.data.data.url)
            return
          }

          // Android 更新流程
          const updateContent = data.intro
            ? '版本号: ' + data.versionId + '\n\n更新内容:\n' + data.intro
            : param.content

          uni.showModal({
            title: param.title,
            content: updateContent,
            showCancel: true,
            confirmText: param.oktext,
            cancelText: param.canceltext,
            success: modalRes => {
              if (!modalRes.confirm) {
                return
              }

              // 开始下载
              const dtask = plus.downloader.createDownload(
                data.url,
                {
                  filename: '_downloads/update.apk',
                },
                function (d, status) {
                  if (status === 200) {
                    // 下载成功，关闭进度视图
                    if (progressViewInstance) {
                      progressViewInstance.close()
                    }

                    // 显示安装提示
                    uni.showToast({
                      title: '下载完成，准备安装',
                      icon: 'success',
                      duration: 1500,
                    })

                    // 安装应用
                    setTimeout(() => {
                      plus.runtime.install(
                        d.filename,
                        {
                          force: true,
                        },
                        function () {
                          // 安装成功，重启应用
                          plus.runtime.restart()
                        },
                        e => {
                          uni.showModal({
                            title: '安装失败',
                            content: '安装升级包失败: ' + JSON.stringify(e),
                            showCancel: false,
                          })
                        }
                      )
                    }, 1500)
                  } else {
                    // 下载失败
                    if (progressViewInstance) {
                      progressViewInstance.close()
                    }
                    uni.showModal({
                      title: '下载失败',
                      content: '下载升级包失败，错误码: ' + status + '\n请检查网络后重试',
                      showCancel: false,
                    })
                  }
                }
              )

              // 创建进度视图
              const progressViewInstance = createProgressView()

              // 监听下载进度
              dtask.addEventListener(
                'statechanged',
                e => {
                  if (e && e.downloadedSize > 0 && e.totalSize > 0) {
                    const progress = (e.downloadedSize / e.totalSize) * 100
                    progressViewInstance.update(progress, e.downloadedSize, e.totalSize)
                  }
                },
                false
              )

              // 开始下载
              dtask.start()
            },
          })
        }
      },
      fail: err => {
        console.error('检查更新失败:', err)
      },
    })
  })
}

export default {
  check,
}
