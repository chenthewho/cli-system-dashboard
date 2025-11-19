import { getAccessToken } from '../../common/const/cacheSync.js'

export default {
  // 获取图片验证码
  imgCaptcha(phone) {
    return uni.$u.http.get(`/merchant/oauth/login/img-captcha/${phone}`)
  },
  // 登录
  login(data) {
    return uni.$u.http.post('/Login/Login', data)
  },
  // 获取用户信息
  getUserInfo(userId) {
    return uni.$u.http.get(`/User/getUserInfo?userId=${userId}`)
  },
  smsCaptcha(data) {
    return uni.$u.http.post('/merchant/oauth/login/send-sms-code', data)
  },
  logout() {
    return uni.$u.http.post(`/merchant/oauth/logout/${getAccessToken()}`)
  },
  // 生成移动端扫码登录二维码
  generateMobileQRCode() {
    return uni.$u.http.get('/Login/GenerateMobileQRCode')
  },
  // 检查二维码状态
  checkMobileQRCodeStatus(qrCodeId) {
    return uni.$u.http.get(`/Login/CheckMobileQRCodeStatus?qrCodeId=${qrCodeId}`)
  },
}
