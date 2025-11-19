<template>
  <div class="login-container">
    <div class="auth-bg">
      <u-toast ref="uToast"></u-toast>
      <div class="auth-body">
        <div class="common-layout">
          <div class="login-title">
            <div class="logo">
              <u--image class="logo-img" src="../../static/img/logo.png" width="32px" height="32px"></u--image>
              <div class="logo-title">智农佳</div>
            </div>
            <div class="line">/</div>
            <div class="desc">专业的农批管理工具</div>
          </div>
          <div class="content">
            <div class="login">
              <div class="login-tabs" v-if="loginModel !== 'qrcode'">
                <div
                  class="login-tabs-item"
                  :class="loginModel === 'password' ? 'active' : ''"
                  @click="changeLoginModeTitle('password')"
                >
                  密码登录
                </div>
                <div class="login-tabs-line"></div>
                <!-- <div
                  class="login-tabs-item"
                  :class="loginModel === 'smsCode' ? 'active' : ''"
                  @click="changeLoginModeTitle('smsCode')"
                >
                  验证码登录
                </div> -->
              </div>
              <div class="login-tabs" v-else>
                <div
                  class="login-tabs-item"
                  :class="loginModel === 'qrcode' ? 'active' : ''"
                  @click="changeLoginModeTitle('qrcode')"
                >
                  移动端扫码登录
                </div>
              </div>
              <div class="login-type-icon-bg"></div>
              <div
                class="login-type-icon"
                :class="loginModel === 'qrcode' ? 'login-type-account-icon' : 'login-type-qrcode-icon'"
                @click="changeLoginModeIcon"
              ></div>
              <u--form
                v-if="loginModel === 'password'"
                class="login-form"
                ref="form"
                :rules="rules"
                :model="form"
                label-width="0px"
              >
                <u-form-item label="" prop="phone" borderBottom>
                  <u--input
                    v-model="form.phone"
                    placeholder="请输入手机号"
                    border="none"
                    @input="phoneChange"
                  ></u--input>
                </u-form-item>
                <u-form-item label="" prop="password" borderBottom>
                  <u--input type="password" v-model="form.password" placeholder="请输入密码" border="none"> </u--input>
                </u-form-item>
                <u-form-item v-if="captchaImage" label="" prop="imgCaptcha" borderBottom>
                  <u--input v-model="form.imgCaptcha" placeholder="输入验证码" border="none">
                    <template v-slot:suffix>
                      <img
                        :src="captchaImage"
                        style="border-radius: 5px; margin-left: 15px"
                        alt=""
                        class="captcha"
                        @click="getCaptcha"
                      />
                    </template>
                  </u--input>
                </u-form-item>
                <u-button
                  :loading="loginLoading"
                  loadingText="登录中"
                  @click="login('form')"
                  style="width: 100%; margin: 22px 0"
                  type="primary"
                >
                  登录
                </u-button>
              </u--form>
              <u--form
                v-if="loginModel === 'smsCode'"
                class="login-form"
                ref="form"
                :model="form"
                :rules="rules"
                label-width="0px"
              >
                <u-form-item label="" prop="phone" borderBottom>
                  <u--input
                    v-model="form.phone"
                    placeholder="请输入手机号"
                    border="none"
                    @input="phoneChange"
                  ></u--input>
                </u-form-item>
                <u-form-item v-if="captchaImage" label="" prop="imgCaptcha" borderBottom>
                  <u--input v-model="form.imgCaptcha" placeholder="输入图片验证码" border="none">
                    <template v-slot:suffix>
                      <img
                        :src="captchaImage"
                        style="border-radius: 5px; margin-left: 15px"
                        alt=""
                        class="captcha"
                        @click="getCaptcha"
                      />
                    </template>
                  </u--input>
                </u-form-item>
                <u-form-item label="" prop="smsCaptcha" borderBottom>
                  <u--input v-model="form.smsCaptcha" placeholder="输入短信验证码" border="none">
                    <template v-slot:suffix>
                      <u-code
                        ref="uCode"
                        @change="codeChange"
                        :seconds="smsCountdown"
                        @start="smsCaptchaStart"
                        @end="smsCaptchaEnd"
                        :disabled="smsCodeDisable"
                        changeText="X秒重新获取"
                      ></u-code>
                      <u-button
                        @tap="getSmsCaptcha"
                        :text="btnSmsText"
                        type="success"
                        :disabled="smsCodeDisable"
                        size="mini"
                      ></u-button>
                    </template>
                  </u--input>
                </u-form-item>
                <u-button
                  :loading="loginLoading"
                  loadingText="登录中"
                  @click="login('form')"
                  style="width: 100%; margin: 22px 0"
                  type="primary"
                >
                  登录
                </u-button>
              </u--form>
              <u--form
                v-if="loginModel === 'qrcode'"
                class="login-form qrcode-form"
                ref="form"
                :model="form"
                label-width="0px"
              >
                <div class="qrcode-container">
                  <div v-if="qrCodeLoading" class="qrcode-loading">
                    <u-loading-icon mode="circle" size="40"></u-loading-icon>
                    <text class="loading-text">生成二维码中...</text>
                  </div>
                  <div v-else-if="qrCodeExpired" class="qrcode-expired">
                    <uni-icons type="info-filled" size="50" color="#ccc"></uni-icons>
                    <text class="expired-text">二维码已过期</text>
                    <u-button @click="refreshQRCode" type="primary" size="small" style="margin-top: 20px">
                      刷新二维码
                    </u-button>
                  </div>
                  <div v-else class="qrcode-content">
                    <div class="qrcode-wrapper">
                      <canvas
                        canvas-id="qrcode"
                        id="qrcode"
                        class="qrcode-canvas"
                        :style="{ width: qrcodeSize + 'px', height: qrcodeSize + 'px' }"
                      ></canvas>
                    </div>
                    <div class="qrcode-status">
                      <text v-if="qrCodeStatus === 'pending'" class="status-text">请使用移动端扫码登录</text>
                      <text v-else-if="qrCodeStatus === 'scanned'" class="status-text success"
                        >已扫码，请在手机上确认</text
                      >
                      <text v-else-if="qrCodeStatus === 'authorized'" class="status-text success"
                        >授权成功，登录中...</text
                      >
                    </div>
                    <div class="qrcode-countdown">
                      <text class="countdown-text">{{ qrCodeCountdown }}秒后过期</text>
                    </div>
                  </div>
                </div>
              </u--form>
              <!-- <div class="login-foot">
								<u--text type="info" class="router-left" @click="forget" text="找回密码"></u--text>
								<u--text type="info" class="router-right" @click="register" text="快速注册"></u--text>
							</div> -->

              <!-- 隐私政策确认 (扫码登录模式下不显示) -->
              <div v-if="loginModel !== 'qrcode'" class="privacy-agreement-wrapper">
                <div class="privacy-checkbox" :class="privacyChecked ? 'checked' : ''" @click="togglePrivacyCheck">
                  <div v-if="privacyChecked" class="checkbox-icon">✓</div>
                </div>
                <span class="privacy-checkbox-text" @click="togglePrivacyCheck"> 我已阅读并同意 </span>
                <span class="privacy-link-inline" @click="showPrivacyAgreement"> 《隐私政策》和《用户协议》 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐私协议弹窗 -->
    <UserAgreementModal
      :visible="showAgreementModal"
      :show-buttons="true"
      @agree="onAgreementAgree"
      @disagree="onAgreementDisagree"
      @close="onAgreementModalClose"
    />
  </div>
</template>

<script>
import login from '../../api/auth/login'
import UserAgreementModal from '../../components/UserAgreementModal.vue'
import config from '../../common/config'
import setting from '../../api/setting/setting.js'
import { getCurrentOrCreateDuty } from '../../utils/dutyHelper.js'
export default {
  components: {
    UserAgreementModal,
  },
  data() {
    return {
      loginLoading: false,
      btnSmsText: '获取短信验证码',
      smsCountdown: 60,
      smsCodeDisable: false,
      loginModel: 'qrcode', // 默认使用扫码登录
      privacyChecked: false,
      showAgreementModal: false,
      // 二维码登录相关
      qrCodeLoading: false,
      qrCodeExpired: false,
      qrCodeStatus: 'pending', // pending, scanned, authorized
      qrCodeId: '',
      qrCodeContent: '',
      qrCodeCountdown: 300, // 5分钟倒计时
      qrcodeSize: 200,
      pollTimer: null, // 轮询定时器
      countdownTimer: null, // 倒计时定时器
      form: {
        grantType: 'password',
        clientId: 'client',
        clientSecret: '123',
        phone: '',
        password: '',
        smsCaptcha: '',
        imgCaptcha: '',
        platform: config.platformCode,
      },
      captchaImage: '',
      rules: {
        phone: [
          {
            type: 'string',
            required: true,
            message: '请填写手机号',
            trigger: ['blur', 'change'],
          },
        ],
        password: {
          type: 'string',
          required: true,
          message: '请填写密码',
          trigger: ['blur', 'change'],
        },
        imgCaptcha: {
          type: 'string',
          required: true,
          message: '请填写图片验证码',
          trigger: ['blur', 'change'],
        },
        smsCaptcha: {
          type: 'string',
          required: true,
          message: '请填写短信验证码',
          trigger: ['blur', 'change'],
        },
      },
    }
  },
  onLoad() {
    // var userInfo = uni.getStorageSync('userInfo')
    // if (userInfo != null && userInfo != '') {
    //   this.form.phone = userInfo.phone
    //   this.form.password = userInfo.password
    //   this.login2()
    // }
  },
  methods: {
    changeLoginModeTitle(mode) {
      this.loginModel = mode
      this.changeGradeType()
    },
    changeLoginModeIcon() {
      if (this.loginModel === 'qrcode') {
        this.loginModel = 'password'
      } else {
        this.loginModel = 'qrcode'
      }
      this.changeGradeType()
    },
    changeGradeType() {
      if (this.loginModel === 'qrcode') {
        this.form.grant_type = 'authorization_code'
      } else if (this.loginModel === 'smsCode') {
        this.form.grant_type = 'sms_code'
      } else {
        this.form.grant_type = 'password'
      }
      this.loginLoading = false
      this.$refs.form.clearValidate()
    },
    codeChange(text) {
      this.btnSmsText = text
    },
    getSmsCaptcha() {
      if (this.$refs.uCode.canGetCode) {
        const params = {
          phone: this.form.phone,
          imgCaptcha: this.form.imgCaptcha,
        }
        login.smsCaptcha(params).then(res => {
          this.$refs.uToast.show({
            type: 'success',
            message: '短信发送成功',
            icon: 'checkmark-circle',
          })
          setTimeout(() => {
            // 通知验证码组件内部开始倒计时
            this.$refs.uCode.start()
          }, this.smsCountdown)
        })
      } else {
        this.$refs.uToast.show({
          type: 'default',
          message: '短信已发送',
        })
      }
    },
    smsCaptchaStart() {
      this.smsCodeDisable = true
    },
    smsCaptchaEnd() {
      this.smsCodeDisable = false
    },
    phoneChange() {
      if (uni.$u.test.mobile(this.form.phone)) {
        this.getCaptcha()
      } else {
        this.captchaImage = ''
        this.form.imgCaptcha = ''
      }
    },
    getCaptcha() {
      this.captchaImage = ''
      login.imgCaptcha(this.form.phone).then(res => {
        const { image, phone } = res.data
        this.captchaImage = image
      })
    },
    login2() {
      var sendLoginData = {
        Phone: this.form.phone,
        Password: this.form.password,
      }
      this.$store
        .dispatch('actionTokenInfo', sendLoginData)
        .then(res => {
          console.log('res', res)
          // 调用统一的登录成功处理方法
          this.handleLoginSuccess(res.id)
        })
        .catch(error => {
          // this.phoneChange()
        })
        .finally(() => {
          this.loginLoading = false
        })
    },
    login() {
      // 检查是否同意隐私协议
      if (!this.privacyChecked) {
        uni.showToast({
          title: '请同意用户协议和隐私政策',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      this.$refs.form
        .validate()
        .then(valid => {
          this.loginLoading = true
          var sendLoginData = {
            Phone: this.form.phone,
            Password: this.form.password,
          }
          this.$store
            .dispatch('actionTokenInfo', sendLoginData)
            .then(res => {
              // 调用统一的登录成功处理方法
              this.handleLoginSuccess(res.id)
            })
            .catch(error => {})
            .finally(() => {
              this.loginLoading = false
            })
        })
        .catch(error => {})
    },
    getCompanyInfo(id) {
      return new Promise((resolve, reject) => {
        uni.$u.http
          .get(`/Company/GetByUserId?id=${id}`)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    register() {
      uni.navigateTo({
        url: '/pages/auth/register',
      })
    },
    forget() {
      uni.navigateTo({
        url: '/pages/auth/forget',
      })
    },
    // 隐私政策相关方法
    togglePrivacyCheck() {
      this.privacyChecked = !this.privacyChecked
    },
    showPrivacyAgreement() {
      // 显示详细的隐私协议弹窗
      this.showAgreementModal = true
    },
    // 隐私协议弹窗事件处理
    onAgreementAgree(agreementData) {
      console.log('用户在登录页面同意协议:', agreementData)
      // 自动勾选页面上的隐私复选框
      if (agreementData.privacy && agreementData.userTerms) {
        this.privacyChecked = true
      }
      this.showAgreementModal = false
    },
    onAgreementDisagree() {
      console.log('用户不同意协议')
      this.privacyChecked = false
      this.showAgreementModal = false
    },
    onAgreementModalClose() {
      this.showAgreementModal = false
    },

    // ========== 二维码登录相关方法 ==========

    // 生成二维码
    async generateQRCode() {
      this.qrCodeLoading = true
      this.qrCodeExpired = false
      this.qrCodeStatus = 'pending'
      this.qrCodeCountdown = 300

      try {
        const res = await login.generateMobileQRCode()
        if (res.code === 200) {
          this.qrCodeId = res.data.qrCodeId
          this.qrCodeContent = res.data.qrCodeContent

          // 绘制二维码
          this.drawQRCode(res.data.qrCodeContent)

          // 开始轮询
          this.startPolling()

          // 开始倒计时
          this.startCountdown()
        } else {
          uni.showToast({
            title: res.msg || '生成二维码失败',
            icon: 'none',
          })
        }
      } catch (error) {
        console.error('生成二维码失败:', error)
        uni.showToast({
          title: '生成二维码失败',
          icon: 'none',
        })
      } finally {
        this.qrCodeLoading = false
      }
    },

    // 绘制二维码
    async drawQRCode(content) {
      try {
        const uQRCode = require('../../common/uqrcode.js').default

        await uQRCode.make({
          canvasId: 'qrcode',
          componentInstance: this,
          text: content,
          size: this.qrcodeSize,
          margin: 1,
          backgroundColor: '#ffffff',
          foregroundColor: '#000000',
          correctLevel: 'H',
          success: () => {
            console.log('二维码生成成功')
          },
          fail: err => {
            console.error('二维码生成失败:', err)
            uni.showToast({
              title: '二维码生成失败',
              icon: 'none',
            })
          },
        })
      } catch (error) {
        console.error('绘制二维码失败:', error)
        uni.showToast({
          title: '二维码生成失败',
          icon: 'none',
        })
      }
    },

    // 开始轮询检查状态
    startPolling() {
      // 清除之前的定时器
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
      }

      // 每2秒轮询一次
      this.pollTimer = setInterval(() => {
        this.checkQRCodeStatus()
      }, 2000)
    },

    // 检查二维码状态
    async checkQRCodeStatus() {
      try {
        const res = await login.checkMobileQRCodeStatus(this.qrCodeId)
        console.log('checkQRCodeStatus', res)
        if (res.code === 200) {
          const status = res.data.status

          if (status === 'pending') {
            // 等待扫码
            this.qrCodeStatus = 'pending'
          } else if (status === 'scanned') {
            // 已扫码
            this.qrCodeStatus = 'scanned'
          } else if (status === 'authorized') {
            // 已授权，登录成功
            this.qrCodeStatus = 'authorized'
            this.stopPolling()
            this.stopCountdown()

            // 处理登录成功
            this.handleQRCodeLoginSuccess(res.data)
          }
        } else if (res.code === 404) {
          // 二维码过期
          this.qrCodeExpired = true
          this.stopPolling()
          this.stopCountdown()
        }
      } catch (error) {
        console.error('检查二维码状态失败:', error)
      }
    },

    // 处理二维码登录成功
    async handleQRCodeLoginSuccess(data) {
      try {
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })

        // 保存 token
        uni.setStorageSync('token', data.token)
        if (data.expires) {
          uni.setStorageSync('tokenExpires', data.expires)
        }

        // 通过 userId 获取完整用户信息
        const userInfoRes = await login.getUserInfo(data.userId)
        if (userInfoRes.code === 200 && userInfoRes.data) {
          const userInfo = userInfoRes.data

          // 保存用户信息到本地存储
          uni.setStorageSync('userId', userInfo.id)
          uni.setStorageSync('userName', userInfo.userName)
          uni.setStorageSync('phone', userInfo.phone)
          uni.setStorageSync('userInfo', userInfo)

          console.log('用户信息获取成功:', userInfo)
        }

        // 使用 userId 调用统一的登录成功处理方法
        await this.handleLoginSuccess(data.userId)
      } catch (error) {
        console.error('二维码登录处理失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none',
        })
      }
    },

    // 统一的登录成功处理方法
    async handleLoginSuccess(userId) {
      try {
        const companyList = await this.getCompanyInfo(userId)
        console.log('获取公司信息----->', companyList)

        if (companyList && companyList.length > 0) {
          const company = companyList[0]

          // 保存公司信息到本地存储
          uni.setStorageSync('companyId', company.id)
          uni.setStorageSync('companyName', company.companyName)
          uni.setStorageSync('marketName', company.marketName)
          uni.setStorageSync('address', company.address)
          uni.setStorageSync('contact', company.contact)
          uni.setStorageSync('role', company.role)
          uni.setStorageSync('vesionType', company.vesionType != undefined ? company.vesionType : 1)

          // 获取公司设置
          try {
            const settingRes = await setting.GetByCompanyId(company.id)
            if (settingRes.code === 200) {
              uni.setStorageSync('companySetting', settingRes.data.settingInfo)
            }
          } catch (error) {
            console.error('获取公司设置失败:', error)
          }

          // 获取或创建当班人员，并自动跳转到首页
          getCurrentOrCreateDuty(company.id, userId)
        } else {
          uni.showToast({
            title: '未找到公司信息',
            icon: 'none',
          })
        }
      } catch (error) {
        console.error('登录成功处理失败:', error)
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none',
        })
      }
    },

    // 开始倒计时
    startCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }

      this.countdownTimer = setInterval(() => {
        this.qrCodeCountdown--

        if (this.qrCodeCountdown <= 0) {
          // 倒计时结束，二维码过期
          this.qrCodeExpired = true
          this.stopPolling()
          this.stopCountdown()
        }
      }, 1000)
    },

    // 停止轮询
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },

    // 停止倒计时
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },

    // 刷新二维码
    refreshQRCode() {
      this.generateQRCode()
    },
  },

  // 页面加载时自动生成二维码
  mounted() {
    // 如果默认是二维码登录模式，自动生成二维码
    if (this.loginModel === 'qrcode') {
      this.$nextTick(() => {
        this.generateQRCode()
      })
    }
  },

  // 监听登录模式切换
  watch: {
    loginModel(newVal) {
      if (newVal === 'qrcode') {
        // 切换到二维码登录时生成二维码
        this.$nextTick(() => {
          this.generateQRCode()
        })
      } else {
        // 切换到其他登录方式时停止轮询和倒计时
        this.stopPolling()
        this.stopCountdown()
      }
    },
  },

  // 页面卸载时清理定时器
  beforeUnmount() {
    this.stopPolling()
    this.stopCountdown()
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/css/auth.scss';

// 隐私协议样式
.privacy-agreement-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16rpx 0 8rpx 0;
  padding: 0 20rpx;
  font-size: 15px;
}

.privacy-checkbox {
  width: 12px;
  height: 12px;
  border: 2rpx solid #d1d5db;
  border-radius: 3rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &.checked {
    background: #00b27a;
    border-color: #00b27a;
  }

  &:active {
    transform: scale(0.95);
  }
}

.checkbox-icon {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 600;
  line-height: 1;
}

.privacy-checkbox-text {
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.privacy-link-inline {
  font-size: 12px;
  color: #00b27a;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 2rpx;
  white-space: nowrap;

  &:active {
    color: #008c62;
  }
}

// 二维码登录样式
.qrcode-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250rpx;
}

.qrcode-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 0;
}

.qrcode-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.loading-text {
  font-size: 14px;
  color: #64748b;
  margin-top: 20rpx;
}

.qrcode-expired {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.expired-text {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 20rpx;
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30rpx;
}

.qrcode-wrapper {
  padding: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.qrcode-canvas {
  display: block;
}

.qrcode-status {
  text-align: center;
}

.status-text {
  font-size: 14px;
  color: #64748b;

  &.success {
    color: #00b27a;
    font-weight: 500;
  }
}

.qrcode-countdown {
  text-align: center;
}

.countdown-text {
  font-size: 12px;
  color: #94a3b8;
}
</style>
