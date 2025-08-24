<template>
  <view class="dropdown-container" :style="containerStyle">
    <!-- 主按钮 -->
    <view 
      class="main-button" 
      :style="buttonStyle"
      @click="handleButtonClick"
    >
      <view class="button-text" :style="textStyle">
       操作
      </view>
      <view class="dropdown-icon" :style="iconStyle">
        <view class="sanjiao" :style="triangleStyle">▼</view>
      </view>
    </view>

    <!-- 下拉框 -->
    <view 
      v-if="showDropdown" 
      class="dropdown-menu" 
      :style="menuStyle"
    >
      <view 
        v-for="(item, index) in options" 
        :key="index" 
        class="dropdown-item" 
        :style="menuItemStyle"
        @click="selectItem(item)"
      >
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomDropdown',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: [String, Number],
      default: ''
    },
    // 尺寸控制
    width: {
      type: [String, Number],
      default: 'auto'
    },
    height: {
      type: [String, Number],
      default: '60rpx'
    },
    // 文字控制
    fontSize: {
      type: [String, Number],
      default: '28rpx'
    },
    iconSize: {
      type: [String, Number],
      default: '24rpx'
    },
    menuFontSize: {
      type: [String, Number],
      default: '28rpx'
    },
    // 颜色控制
    bgColor: {
      type: String,
      default: '#a1a1a1'
    },
    textColor: {
      type: String,
      default: '#FFFFFF'
    },
    menuBgColor: {
      type: String,
      default: '#FFFFFF'
    },
    menuTextColor: {
      type: String,
      default: '#333333'
    },
    // 箭头位置控制
    iconPosition: {
      type: [String, Number],
      default: '20%' // 可以是百分比或具体rpx值
    }
  },
  data() {
    return {
      showDropdown: false,
      selectedValue: this.defaultValue,
      selectedText: this.getDefaultText()
    };
  },
  computed: {
    containerStyle() {
      return {
        width: this.formatSize(this.width),
        display: 'inline-block'
      };
    },
    buttonStyle() {
      return {
        width: this.formatSize(this.width),
        height: this.formatSize(this.height),
        lineHeight: this.formatSize(this.height),
        backgroundColor: this.bgColor,
        borderRadius: this.formatSize(8)
      };
    },
    textStyle() {
      return {
        fontSize: this.formatSize(this.fontSize),
        color: this.textColor,
		lineHeight: this.formatSize(this.height),
        textAlign: 'left',
		fontWeight: 'bold'
      };
    },
    iconStyle() {
      return {
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        width: this.calcIconWidth()
      };
    },
    triangleStyle() {
      return {
        fontSize: this.formatSize(this.iconSize/2),
        left: 0
      };
    },
    menuStyle() {
      return {
        width: this.formatSize(this.width),
        backgroundColor: this.menuBgColor
      };
    },
    menuItemStyle() {
      return {
        fontSize: this.formatSize(this.menuFontSize),
        color: this.menuTextColor
      };
    }
  },
  methods: {
    formatSize(size) {
      if (typeof size === 'number') {
        return `${size}rpx`;
      }
      return size;
    },
    calcIconWidth() {
      // 计算图标容器宽度（按钮宽度的10%-20%）
      if (typeof this.width === 'number') {
        return `${Math.max(40, this.width * 0.15)}rpx`; // 最小40rpx
      }
      return '20%';
    },
    calcTrianglePosition() {
      // 计算三角形位置
      if (typeof this.iconPosition === 'number') {
        return `${this.iconPosition}rpx`;
      }
      return this.iconPosition; // 直接使用百分比
    },
    handleButtonClick() {
      this.toggleDropdown();
      this.$emit('click');
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectItem(item) {
      this.selectedValue = item.value;
      this.selectedText = item.text;
      this.showDropdown = false;
      this.$emit('change', item);
    },
    getDefaultText() {
      if (this.defaultValue) {
        const selected = this.options.find(item => item.value === this.defaultValue);
        return selected ? selected.text : '请选择';
      }
      return '请选择';
    }
  }
};
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
}

.main-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  cursor: pointer;
  position: relative;
}

.button-text {
  flex: 2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  margin-left: 10rpx;
  border-left: 1rpx black solid;
  padding-left: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
}

.sanjiao {
  transform: scale(1);
  position: absolute;
  transition: all 0.3s;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  margin-top: 8rpx;
  z-index: 999;
  box-sizing: border-box;
  max-height: 400rpx;
  overflow-y: auto;
}

.dropdown-item {
  padding: 20rpx;
  border-bottom-width: 1rpx;
  border-bottom-style: solid;
  border-bottom-color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>