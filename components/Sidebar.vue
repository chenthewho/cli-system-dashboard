<template>
  <div class="sidebar-box">
    <div class="logo-container" @click="onLogoClick">
      <image class="logo-image" src="/static/img/logo-transparent.png" mode="aspectFill"></image>
    </div>
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.id">
        <div
          @click="changeContent(item.id)"
          :class="{ active: activeItem === item.id }"
          class="menu-item"
          v-if="item.isShow"
        >
          <image
            class="menu-icon"
            :src="`/static/img/tabbar/${activeItem === item.id ? item.icon : item.iconAct}`"
            mode="aspectFit"
          />
          <span class="bar-text" :class="{ active: activeItem === item.id }">{{ item.text }}</span>
        </div>
      </li>
    </ul>
    <ul>
      <li>
        <div @click="changeContent('six')" :class="{ active: activeItem === 'six' }" class="menu-item-footer">
          <image class="setting-icon" src="/static/img/tabbar/setting.png" mode="aspectFit" />
          <span class="bar-text" :class="{ active: activeItem === 'six' }">设置</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      activeItem: 'one', // 当前选中的菜单项
      vesionType: uni.getStorageSync('vesionType') ?? 1, // 获取版本类型，默认为1|| 1-普通版 2-代销 3-自营版 4-满血版
      menuItems: [],
    }
  },
  created() {
    console.log('Sidebar onShow called')
    this.vesionType = uni.getStorageSync('vesionType') ?? 1
    // 检查版本类型是否有变化
    console.log('Current vesionType:', this.vesionType)
    if (this.vesionType === 4) {
      this.menuItems = [
        {
          id: 'one',
          icon: 'shouying.png',
          iconAct: 'shouying-act.png',
          text: '收银',
          isShow: true,
        },
        {
          id: 'two',
          icon: 'order.png',
          iconAct: 'order-act.png',
          text: '订单',
          isShow: true,
        },
        {
          id: 'three',
          icon: 'kucun.png',
          iconAct: 'kucun-act.png',
          text: '库存',
          isShow: true,
        },
        {
          id: 'five',
          icon: 'count.png',
          iconAct: 'count-act.png',
          text: '结算',
          isShow: true,
        },
        {
          id: 'eight',
          icon: 'huozhu.png',
          iconAct: 'huozhu-act.png',
          text: '货主',
          isShow: true,
        },
        {
          id: 'four',
          icon: 'data.png',
          iconAct: 'data-act.png',
          text: '报表',
          isShow: true,
        },
        {
          id: 'seven',
          icon: 'work-time.png',
          iconAct: 'work-time-act.png',
          text: '轮值',
          isShow: true,
        },
      ]
    } else if (this.vesionType === 2) {
      this.menuItems = [
        {
          id: 'one',
          icon: 'shouying.png',
          iconAct: 'shouying-act.png',
          text: '收银',
          isShow: true,
        },
        {
          id: 'two',
          icon: 'order.png',
          iconAct: 'order-act.png',
          text: '订单',
          isShow: true,
        },
        {
          id: 'three',
          icon: 'kucun.png',
          iconAct: 'kucun-act.png',
          text: '库存',
          isShow: true,
        },
        {
          id: 'five',
          icon: 'count.png',
          iconAct: 'count-act.png',
          text: '结算',
          isShow: true,
        },
        {
          id: 'four',
          icon: 'data.png',
          iconAct: 'data-act.png',
          text: '报表',
          isShow: true,
        },
        {
          id: 'seven',
          icon: 'work-time.png',
          iconAct: 'work-time-act.png',
          text: '轮值',
          isShow: true,
        },
      ]
    } else if (this.vesionType === 3) {
      this.menuItems = [
        {
          id: 'one',
          icon: 'shouying.png',
          iconAct: 'shouying-act.png',
          text: '收银',
          isShow: true,
        },
        {
          id: 'two',
          icon: 'order.png',
          iconAct: 'order-act.png',
          text: '订单',
          isShow: true,
        },
        {
          id: 'three',
          icon: 'kucun.png',
          iconAct: 'kucun-act.png',
          text: '库存',
          isShow: true,
        },
        {
          id: 'four',
          icon: 'data.png',
          iconAct: 'data-act.png',
          text: '报表',
          isShow: true,
        },
        {
          id: 'seven',
          icon: 'work-time.png',
          iconAct: 'work-time-act.png',
          text: '轮值',
          isShow: true,
        },
      ]
    } else if (this.vesionType === 1) {
      this.menuItems = [
        {
          id: 'one',
          icon: 'shouying.png',
          iconAct: 'shouying-act.png',
          text: '收银',
          isShow: true,
        },
        {
          id: 'two',
          icon: 'order.png',
          iconAct: 'order-act.png',
          text: '订单',
          isShow: true,
        },
        {
          id: 'seven',
          icon: 'work-time.png',
          iconAct: 'work-time-act.png',
          text: '轮值',
          isShow: true,
        },
      ]
    }
  },
  methods: {
    playSystemKeyClickSound() {
      try {
        var Context = plus.android.importClass('android.content.Context')
        var AudioManager = plus.android.importClass('android.media.AudioManager')
        var main = plus.android.runtimeMainActivity()
        var audioManager = main.getSystemService(Context.AUDIO_SERVICE)
        audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK)
      } catch (e) {
        console.error('播放系统按键音失败:', e)
      }
    },
    // 设置激活的菜单项（用于外部调用）
    setActiveItem(itemId) {
      this.activeItem = itemId
    },
    changeContent(content) {
      this.playSystemKeyClickSound()
      this.activeItem = content // 更新当前选中的菜单项
      this.$emit('update-content', content) // 触发事件并传递内容
    },
    onLogoClick() {
      this.playSystemKeyClickSound()
      // 点击logo返回收银页面
      this.activeItem = 'one'
      this.$emit('update-content', 'one')
      // 可以添加一个提示
      uni.showToast({
        title: '智农佳收银系统',
        icon: 'none',
        duration: 1500,
      })
    },
  },
}
</script>

<style scoped lang="scss">
.bar-coin {
  margin-bottom: 5rpx;
}

.sidebar-box {
  width: 40rpx;
  height: 100vh;
  z-index: 10;
  background-color: #3e79f3;

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 2rpx 0;
    display: flex;
    align-items: center;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .menu-item {
    width: 100%;
    padding-top: 2rpx;
    padding-bottom: 2rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background-color 0.3s;
    margin-bottom: 8rpx;
    border-radius: 6rpx;

    &.active {
      background-color: #ffffff;
    }

    .menu-icon {
      width: 20rpx;
      height: 20rpx;
    }
  }

  .menu-item-footer {
    position: fixed;
    bottom: 0;
    width: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background-color 0.3s;
    border-top: 1rpx solid #ffffff59;
    margin-bottom: 10rpx;
    padding-top: 10rpx;
    .setting-icon {
      width: 20rpx;
      height: 20rpx;
    }

    &.active {
      background-color: #00aa00;
    }
  }

  .bar-text {
    // font-weight: bold;
    color: white;
    margin-top: 2rpx;
    font-size: 9rpx;

    &.active {
      color: $zn-font-color-leve1;
    }
  }

  .logo-container {
    position: relative;
    display: flex;
    justify-content: center;
    top: 10px;
    width: 40rpx;
    height: 100px;

    .logo-image {
      width: 28rpx;
      height: 30rpx;
      border-radius: 0;
      object-fit: cover;
    }
  }
}
</style>
