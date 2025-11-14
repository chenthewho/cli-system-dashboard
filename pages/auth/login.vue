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
                <div
                  class="login-tabs-item"
                  :class="loginModel === 'smsCode' ? 'active' : ''"
                  @click="changeLoginModeTitle('smsCode')"
                >
                  验证码登录
                </div>
              </div>
              <div class="login-tabs" v-else>
                <div
                  class="login-tabs-item"
                  :class="loginModel === 'qrcode' ? 'active' : ''"
                  @click="changeLoginModeTitle('qrcode')"
                >
                  微信扫码登录
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
              <u--form v-if="loginModel === 'qrcode'" class="login-form" ref="form" :model="form" label-width="0px">
              </u--form>
              <!-- <div class="login-foot">
								<u--text type="info" class="router-left" @click="forget" text="找回密码"></u--text>
								<u--text type="info" class="router-right" @click="register" text="快速注册"></u--text>
							</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import login from '../../api/auth/login'
import duty from '../../api/duty/duty'
import config from '../../common/config'
import setting from '../../api/setting/setting.js'
export default {
  data() {
    return {
      loginLoading: false,
      btnSmsText: '获取短信验证码',
      smsCountdown: 60,
      smsCodeDisable: false,
      loginModel: 'password',
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
    var userInfo = uni.getStorageSync('userInfo')
    if (userInfo != null && userInfo != '') {
      this.form.phone = userInfo.phone
      this.form.password = userInfo.password
      this.login2()
    }
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
          //获取第一个绑定的商户号
          this.getCompanyInfo(res.id).then(res2 => {
            if (res2 && res2.length > 0) {
              uni.setStorageSync('companyId', res2[0].id)
              uni.setStorageSync('companyName', res2[0].companyName)
              uni.setStorageSync('address', res2[0].address)
              uni.setStorageSync('contact', res2[0].contact)
              uni.setStorageSync('role', res2[0].role)
              uni.setStorageSync('vesionType', res2[0].vesionType != undefined ? res2[0].vesionType : 1)
              console.log('res.id', res.id)
              //获取当班人员ID如果空则添加自己为当班人员
              duty.getCurrentOperater(res2[0].id, res.id).then(res3 => {
                console.log('res3', res3)
                if (res3.code === 200) {
                  if (res3.data != null) {
                    uni.setStorageSync('currentDutyId', res3.data.id)
                    uni.setStorageSync('currentDutybeginTime', res3.data.beginTime)
                    uni.reLaunch({
                      url: '/pages/index/index',
                    })
                  } else {
                    duty.addDuty(res2[0].id, res.id).then(res4 => {
                      if (res4.code === 200) {
                        uni.setStorageSync('currentDutyId', res4.data.id)
                        uni.setStorageSync('currentDutybeginTime', res4.data.beginTime)
                      }
                      uni.reLaunch({
                        url: '/pages/index/index',
                      })
                    })
                  }
                }
              })
            }
          })
        })
        .catch(error => {
          // this.phoneChange()
        })
        .finally(() => {
          this.loginLoading = false
        })
    },
    login() {
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
              this.getCompanyInfo(res.id).then(res2 => {
                if (res2 && res2.length > 0) {
                  this.login2()
                  uni.setStorageSync('companyId', res2[0].id)
                  setting.GetByCompanyId(res2[0].id).then(res3 => {
                    if (res3.code === 200) {
                      uni.setStorageSync('companySetting', res3.data.settingInfo)
                    }
                  })
                  uni.setStorageSync('companyName', res2[0].companyName)
                  uni.setStorageSync('marketName', res2[0].marketName)
                  uni.setStorageSync('address', res2[0].address)
                  uni.setStorageSync('contact', res2[0].contact)
                  uni.setStorageSync('companyId', res2[0].id)
                  uni.setStorageSync('role', res2[0].role)
                  uni.reLaunch({
                    url: '/pages/index/index',
                  })
                }
              })
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/common/css/auth.scss';
</style>
