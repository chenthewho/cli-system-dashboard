<template>
  <u-popup :show="visible" mode="center" :round="10" @close="handleClose">
    <view class="agreement-modal">
      <!-- 头部 -->
      <view class="modal-header">
        <view class="header-content">
          <text class="modal-title">用户协议与隐私政策</text>
          <text class="modal-subtitle">请仔细阅读相关条款</text>
        </view>
        <view class="close-btn" @click="handleClose">
          <text class="close-icon">✕</text>
        </view>
      </view>

      <!-- 内容区域 -->
      <scroll-view class="modal-content" scroll-y>
        <view class="scroll-content">
          <!-- 用户服务协议 -->
          <view class="agreement-section">
            <text class="section-title">用户服务协议</text>
            <view class="section-content">
              <text class="content-paragraph">1. 您应当遵守国家相关法律法规，不得利用本应用从事违法违规活动。</text>
              <text class="content-paragraph">2. 您应当保护好自己的账号信息，不得将账号借给他人使用。</text>
              <text class="content-paragraph"
                >3. 我们有权对违反协议的行为进行处理，包括但不限于限制使用、终止服务等。</text
              >
              <text class="content-paragraph">4. 您在使用过程中产生的数据，我们将严格按照隐私政策进行保护。</text>
              <text class="content-paragraph">5. 如您违反本协议，我们有权暂停或终止您的账号使用权限。</text>
            </view>
          </view>

          <!-- 隐私政策详情 -->
          <view class="agreement-section privacy-section">
            <text class="section-title">隐私政策详情</text>
            <view class="section-content">
              <text class="important-text">服务主体信息：</text>
              <text class="content-paragraph">• 主体名称：广州智农佳科技有限公司</text>
              <text class="content-paragraph">• 注册地址：广东省广州市天河区</text>
              <text class="content-paragraph">• 联系电话：400-812-7682</text>

              <text class="important-text">我们收集的信息类型：</text>
              <text class="content-paragraph">• 设备信息：设备型号、操作系统版本、应用版本、设备标识符、OAID等</text>
              <text class="content-paragraph">• 使用数据：功能使用记录、操作日志、访问时间、使用时长等</text>
              <text class="content-paragraph">• 账户信息：您主动提供的用户名、头像、联系方式等</text>
              <text class="content-paragraph">• 位置信息：在您授权的情况下，获取您的地理位置信息</text>

              <text class="important-text">信息使用目的：</text>
              <text class="content-paragraph">• 提供和改进应用服务，确保功能正常运行</text>
              <text class="content-paragraph">• 保障应用安全和稳定运行，防范安全风险</text>
              <text class="content-paragraph">• 分析用户体验并优化产品功能和界面设计</text>
              <text class="content-paragraph">• 通过OAID进行设备识别和统计分析，用于改善服务质量</text>

              <text class="important-text">关于OAID的说明：</text>
              <text class="content-paragraph">• OAID（开放匿名设备标识符）是一种非永久性的设备标识符</text>
              <text class="content-paragraph">• 我们使用OAID来进行应用使用统计、错误分析和服务优化</text>
              <text class="content-paragraph">• OAID信息不会用于识别您的个人身份，仅用于设备层面的数据分析</text>
              <text class="content-paragraph">• 您可以通过设备设置随时重置或关闭OAID功能</text>

              <text class="important-text">信息存储和保护：</text>
              <text class="content-paragraph">• 我们采用行业标准的加密技术保护您的数据安全</text>
              <text class="content-paragraph">• 您的个人信息将存储在安全的服务器中</text>
              <text class="content-paragraph">• 我们会定期备份数据，防止数据丢失</text>

              <text class="important-text">您的权利：</text>
              <text class="content-paragraph">• 随时查看、修改或删除个人信息</text>
              <text class="content-paragraph">• 撤销对信息处理的同意</text>
              <text class="content-paragraph">• 选择性使用应用功能</text>
              <text class="content-paragraph">• 要求我们删除您的个人数据（数据可携带权）</text>
              <text class="content-paragraph">• 对我们的数据处理活动提出异议</text>
              <text class="content-paragraph">• 申请注销账号及相关个人信息</text>

              <text class="important-text">账号注销说明：</text>
              <text class="content-paragraph">• 您可以通过"我的"->"账号信息"页面申请注销您的账号</text>
              <text class="content-paragraph">• 注销申请提交后，我们将在15个工作日内处理完成</text>
              <text class="content-paragraph">• 账号注销后，您的个人信息将被永久删除且无法恢复</text>
              <text class="content-paragraph">• 注销前请确保已备份重要数据，注销后将无法找回</text>
              <text class="content-paragraph">• 如有未完成的订单或服务，需要先处理完毕才能注销</text>
              <text class="content-paragraph">• 注销过程中如有疑问，可联系客服协助处理（400-812-7682）</text>

              <text class="important-text">信息共享：</text>
              <text class="content-paragraph">• 我们不会向第三方出售您的个人信息</text>
              <text class="content-paragraph">• 仅在法律要求或您明确同意的情况下才会共享信息</text>
              <text class="content-paragraph">• 与服务提供商共享的信息仅限于提供服务所必需的范围</text>
            </view>
          </view>

          <!-- 联系我们 -->
          <view class="agreement-section">
            <text class="section-title">联系我们</text>
            <view class="section-content">
              <text class="content-paragraph"
                >如果您对我们的隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</text
              >
              <text class="content-paragraph">• 应用内客服系统</text>
              <text class="content-paragraph">• 邮箱：znjserver@qq.com</text>
              <text class="content-paragraph">• 电话：400-812-7682</text>
              <text class="content-paragraph">我们会在收到您的反馈后及时回复和处理。</text>
            </view>
          </view>

          <!-- 底部空间 -->
          <view class="scroll-bottom-space"></view>
        </view>
      </scroll-view>

      <!-- 底部按钮 -->
      <view v-if="showButtons" class="modal-footer">
        <view class="footer-buttons">
          <view class="btn-disagree" @click="handleDisagree">不同意</view>
          <view class="btn-agree" @click="handleAgree">同意并继续</view>
        </view>
      </view>

      <view v-else class="modal-footer-simple">
        <button class="btn btn-close" @click="handleClose">关闭</button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'UserAgreementModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    showButtons: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleAgree() {
      this.$emit('agree', {
        privacy: true,
        userTerms: true,
      })
    },
    handleDisagree() {
      this.$emit('disagree')
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.agreement-modal {
  width: 580rpx;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
}

// 头部样式
.modal-header {
  position: relative;
  padding: 16rpx 20rpx 12rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #e5e7eb;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}

.privacy-icon {
  font-size: 32rpx;
  margin-bottom: 2rpx;
}

.modal-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}

.modal-subtitle {
  font-size: 18rpx;
  color: #9ca3af;
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;

  &:active {
    background: #f3f4f6;
  }
}

.close-icon {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1;
}

// 内容区域
.modal-content {
  flex: 1;
  overflow-y: auto;
  max-height: 850rpx;
}

.scroll-content {
  padding: 12rpx 20rpx;
}

.agreement-section {
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.privacy-section {
    background: #f9fafb;
    padding: 12rpx;
    border-radius: 8rpx;
  }
}

.section-title {
  font-size: 22rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10rpx;
  display: block;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.important-text {
  font-size: 20rpx;
  font-weight: 600;
  color: #374151;
  margin-top: 10rpx;
  margin-bottom: 6rpx;
  display: block;
}

.content-paragraph {
  font-size: 19rpx;
  color: #4b5563;
  line-height: 1.6;
  display: block;
}

.scroll-bottom-space {
  height: 24rpx;
}

// 底部按钮区域
.modal-footer {
  padding: 12rpx 20rpx;
  background: #ffffff;
  border-top: 1rpx solid #e5e7eb;
}

.footer-buttons {
  display: flex;
  gap: 10rpx;
}

.btn-disagree,
.btn-agree {
  flex: 1;
  height: 40rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-disagree {
  background: #f3f4f6;
  color: #6b7280;

  &:active {
    background: #e5e7eb;
  }
}

.btn-agree {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(16, 185, 129, 0.25);

  &:active {
    opacity: 0.9;
    transform: translateY(1rpx);
  }
}

.modal-footer-simple {
  padding: 12rpx 20rpx;
  background: #ffffff;
  border-top: 1rpx solid #e5e7eb;
}

.btn-close {
  width: 100%;
  height: 56rpx;
  border-radius: 28rpx;
  font-size: 22rpx;
  font-weight: 500;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(16, 185, 129, 0.25);

  &:active {
    opacity: 0.9;
  }
}
</style>
