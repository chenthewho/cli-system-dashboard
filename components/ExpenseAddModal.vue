<template>
  <div class="expense-modal-container" v-if="show">
    <div class="expense-modal-overlay" @click="handleClose"></div>
    <div class="expense-modal">
      <div class="expense-modal-header">
        <h3>新增费用</h3>
      </div>
      <div class="close-btn" @click="handleClose">
        <uni-icons type="close" size="25" color="#666"></uni-icons>
      </div>

      <div class="expense-modal-body">
        <!-- 金额输入 -->
        <div class="input-section">
          <label class="input-label">费用金额</label>
          <div class="amount-input-wrapper">
            <u--input
              placeholder="请输入金额"
              border="surround"
              v-model="formData.money"
              clearable
              type="number"
              class="amount-input"
            ></u--input>
            <span class="currency-unit">元</span>
          </div>
        </div>

        <!-- 费用项选择 -->
        <div class="input-section">
          <div class="input-label">
            <span>费用项</span>
            <div class="label-actions">
              <!-- <div class="action-btn" @click="showAddLabel"> -->
              <uni-icons type="plus" size="30" color="#1890ff"></uni-icons>
              <!-- </div> -->
              <!-- <div class="action-btn" @click="toggleEditMode"> -->
              <uni-icons
                :type="isEditingLabels ? 'checkmarkempty' : 'compose'"
                size="30"
                :color="isEditingLabels ? '#52c41a' : '#1890ff'"
              ></uni-icons>
              <!-- </div> -->
            </div>
          </div>
          <div class="expense-labels-container">
            <div v-if="expenseLabels.length === 0" class="no-labels-tip">
              <uni-icons type="info-circle" size="14" color="#999"></uni-icons>
              <span>暂无费用标签，请点击 + 添加</span>
            </div>
            <div
              v-for="(label, index) in expenseLabels"
              :key="label.id"
              :class="[
                'expense-label-btn',
                {
                  active: formData.labelId === label.id,
                  editing: isEditingLabels,
                },
              ]"
              @click="selectExpenseLabel(label)"
            >
              {{ label.label }}
              <span
                v-if="isEditingLabels && expenseLabels.length > 1"
                @click.stop="deleteExpenseLabel(label, index)"
                class="delete-label-btn"
                >×</span
              >
            </div>
          </div>
        </div>

        <!-- 备注输入 -->
        <div class="input-section">
          <label class="input-label">备注说明</label>
          <u--textarea
            v-model="formData.remark"
            placeholder="请输入备注信息（可选）"
            class="remark-textarea"
            :maxlength="200"
            :showWordLimit="true"
          ></u--textarea>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="expense-modal-footer">
        <button class="btn-cancel" @click="handleClose">取消</button>
        <button class="btn-confirm" @click="handleConfirm" :disabled="!isFormValid">添加费用</button>
      </div>
    </div>

    <!-- 新增费用标签弹窗 -->
    <div class="label-modal-container" v-if="showLabelModal">
      <div class="label-modal-overlay" @click="closeLabelModal"></div>
      <div class="label-modal">
        <div class="label-modal-header">
          <h4>新增费用标签</h4>
        </div>
        <div class="label-modal-body">
          <u--input
            placeholder="请输入标签名称"
            border="surround"
            v-model="newLabelName"
            clearable
            class="label-input"
          ></u--input>
        </div>
        <div class="label-modal-footer">
          <button class="btn-cancel" @click="closeLabelModal">取消</button>
          <button class="btn-confirm" @click="addExpenseLabel" :disabled="!newLabelName.trim()">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpenseAddModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    expenseLabels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        money: '',
        labelId: '',
        remark: '',
      },
      isEditingLabels: false,
      showLabelModal: false,
      newLabelName: '',
    }
  },
  computed: {
    isFormValid() {
      return this.formData.money && this.formData.labelId
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm()
      }
    },
  },
  methods: {
    resetForm() {
      this.formData = {
        money: '',
        labelId: '',
        remark: '',
      }
      this.isEditingLabels = false
    },
    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      if (!this.isFormValid) return

      const selectedLabel = this.expenseLabels.find(label => label.id === this.formData.labelId)
      const expenseData = {
        ...this.formData,
        labelName: selectedLabel?.label || '',
      }

      this.$emit('confirm', expenseData)
    },
    selectExpenseLabel(label) {
      if (this.isEditingLabels) return
      this.formData.labelId = label.id
    },
    toggleEditMode() {
      this.isEditingLabels = !this.isEditingLabels
    },
    showAddLabel() {
      this.showLabelModal = true
      this.newLabelName = ''
    },
    closeLabelModal() {
      this.showLabelModal = false
      this.newLabelName = ''
    },
    addExpenseLabel() {
      if (!this.newLabelName.trim()) return

      this.$emit('add-label', this.newLabelName.trim())
      this.closeLabelModal()
    },
    deleteExpenseLabel(label, index) {
      this.$emit('delete-label', { label, index })
    },
  },
}
</script>

<style scoped>
.expense-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expense-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  backdrop-filter: blur(2px);
}

.expense-modal {
  position: relative;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.expense-modal-header {
  background: #f8f9fa;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.expense-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: #e9ecef;
}

.expense-modal-body {
  padding: 20px;
  max-height: calc(80vh - 140px);
  overflow-y: auto;
}

.input-section {
  margin-bottom: 20px;
}

.input-section:last-child {
  margin-bottom: 0;
}

.input-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.label-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #1890ff;
  background: #f0f8ff;
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  flex: 1;
  font-size: 16px !important;
}

.currency-unit {
  position: absolute;
  right: 12px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
}

.expense-labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  min-height: 32px;
  align-items: flex-start;
}

.no-labels-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 13px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

.expense-label-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-right: none;
  background: white;
  color: #666;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.expense-label-btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.expense-label-btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-right: 1px solid #d9d9d9;
}

.expense-label-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.expense-label-btn.active {
  border-color: #1890ff;
  background: #1890ff;
  color: white;
}

.expense-label-btn.editing {
  border-color: #ff7875;
  animation: editingPulse 2s infinite;
}

@keyframes editingPulse {
  0%,
  100% {
    border-color: #ff7875;
    box-shadow: 0 0 0 0 rgba(255, 120, 117, 0.4);
  }
  50% {
    border-color: #ff4d4f;
    box-shadow: 0 0 0 3px rgba(255, 120, 117, 0.2);
  }
}

.delete-label-btn {
  width: 16px;
  height: 16px;
  background: #ff4757;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-weight: bold;
}

.delete-label-btn:hover {
  background: #ff3742;
  transform: scale(1.1);
}

.remark-textarea {
  border-radius: 8px !important;
  border: 1px solid #d9d9d9 !important;
  min-height: 80px !important;
  transition: all 0.2s ease;
}

.remark-textarea:focus {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1) !important;
}

.expense-modal-footer {
  padding: 16px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e9ecef;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 45px;
  border: none;
  border-radius: 6px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-cancel:hover {
  background: #f5f5f5;
  border-color: #b3b3b3;
}

.btn-confirm {
  background: #1890ff;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-confirm:disabled {
  background: #d9d9d9;
  color: #999;
  cursor: not-allowed;
}

/* 标签弹窗样式 */
.label-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.label-modal {
  position: relative;
  width: 90%;
  max-width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.label-modal-header {
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.label-modal-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.label-modal-body {
  padding: 20px;
}

.label-input {
  width: 100% !important;
  font-size: 14px !important;
}

.label-modal-footer {
  padding: 12px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e9ecef;
}

.label-modal-footer .btn-cancel,
.label-modal-footer .btn-confirm {
  flex: 1;
  height: 32px;
  font-size: 13px;
}

/* 响应式适配 */
@media (max-width: 600px) {
  .expense-modal {
    width: 95%;
    max-width: none;
  }

  .expense-modal-header {
    padding: 12px 16px;
  }

  .expense-modal-body {
    padding: 16px;
  }

  .expense-modal-footer {
    padding: 12px 16px;
  }
}
</style>
