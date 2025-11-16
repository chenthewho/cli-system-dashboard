/**
 * 当班人员管理工具类
 * 用于处理当班人员的获取和切换逻辑
 */

import duty from '../api/duty/duty'

/**
 * 获取或创建当班人员
 * @param {String} companyId - 商户ID
 * @param {String} userId - 用户ID
 * @param {Object} options - 可选配置
 * @param {Boolean} options.autoNavigate - 是否自动跳转到首页，默认true
 * @param {String} options.navigateUrl - 跳转的URL，默认'/pages/index/index'
 * @param {Function} options.onSuccess - 成功回调函数
 * @param {Function} options.onError - 错误回调函数
 * @returns {Promise}
 */
export function getCurrentOrCreateDuty(companyId, userId, options = {}) {
  const { autoNavigate = true, navigateUrl = '/pages/index/index', onSuccess = null, onError = null } = options

  return new Promise((resolve, reject) => {
    // 获取当班人员ID，如果为空则添加自己为当班人员
    duty
      .getCurrentOperater(companyId, userId)
      .then(res => {
        console.log('获取当班人员结果:', res)

        if (res.code === 200) {
          if (res.data != null) {
            // 当班人员已存在
            uni.setStorageSync('currentDutyId', res.data.id)
            uni.setStorageSync('currentDutybeginTime', res.data.beginTime)

            console.log('当班人员已存在:', res.data.id)

            // 执行成功回调
            if (onSuccess) {
              onSuccess(res.data)
            }

            // 自动跳转
            if (autoNavigate) {
              uni.reLaunch({
                url: navigateUrl,
              })
            }

            resolve(res.data)
          } else {
            // 当班人员不存在，创建新的当班记录
            console.log('当班人员不存在，创建新的当班记录')

            duty
              .addDuty(companyId, userId)
              .then(addRes => {
                if (addRes.code === 200) {
                  uni.setStorageSync('currentDutyId', addRes.data.id)
                  uni.setStorageSync('currentDutybeginTime', addRes.data.beginTime)

                  console.log('创建当班人员成功:', addRes.data.id)

                  // 执行成功回调
                  if (onSuccess) {
                    onSuccess(addRes.data)
                  }
                }

                // 自动跳转
                if (autoNavigate) {
                  uni.reLaunch({
                    url: navigateUrl,
                  })
                }

                resolve(addRes.data)
              })
              .catch(error => {
                console.error('创建当班人员失败:', error)

                if (onError) {
                  onError(error)
                }

                uni.showToast({
                  title: '创建当班记录失败',
                  icon: 'none',
                })

                reject(error)
              })
          }
        } else {
          console.error('获取当班人员失败:', res.message)

          if (onError) {
            onError(res)
          }

          uni.showToast({
            title: res.message || '获取当班人员失败',
            icon: 'none',
          })

          reject(res)
        }
      })
      .catch(error => {
        console.error('获取当班人员异常:', error)

        if (onError) {
          onError(error)
        }

        uni.showToast({
          title: '网络错误，请重试',
          icon: 'none',
        })

        reject(error)
      })
  })
}

/**
 * 切换当班人员（用于切换商户或用户时）
 * @param {String} companyId - 商户ID
 * @param {String} userId - 用户ID
 * @returns {Promise}
 */
export function switchDuty(companyId, userId) {
  return getCurrentOrCreateDuty(companyId, userId, {
    autoNavigate: false,
  })
}

/**
 * 获取当前当班信息
 * @returns {Object} 当班信息对象
 */
export function getCurrentDutyInfo() {
  return {
    dutyId: uni.getStorageSync('currentDutyId'),
    beginTime: uni.getStorageSync('currentDutybeginTime'),
  }
}

/**
 * 清除当班信息
 */
export function clearDutyInfo() {
  uni.removeStorageSync('currentDutyId')
  uni.removeStorageSync('currentDutybeginTime')
  console.log('当班信息已清除')
}

/**
 * 检查是否有当班人员
 * @returns {Boolean}
 */
export function hasDuty() {
  const dutyId = uni.getStorageSync('currentDutyId')
  return !!dutyId
}

export default {
  getCurrentOrCreateDuty,
  switchDuty,
  getCurrentDutyInfo,
  clearDutyInfo,
  hasDuty,
}
