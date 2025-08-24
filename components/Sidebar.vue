<template>
	<div class="sidebar">
		<ul style="margin-top: 50rpx;">
			<li v-for="item in menuItems" :key="item.id">
				<div @click="changeContent(item.id)" :class="{'active': activeItem === item.id}" class="menu-item" v-if="item.isShow">
					<uni-icons custom-prefix="iconfont" :type="item.icon" size="30" color="#ffffff"></uni-icons>
					<span class="bar-text" :class="{'active': activeItem === item.id}">{{ item.text }}</span>
				</div>
			</li>
		</ul>
		<ul>
			<li>
				<div @click="changeContent('six')" :class="{'active': activeItem === 'six'}" class="menu-item-footer">
					<uni-icons custom-prefix="iconfont" type="icon-shezhi" size="30" color="#ffffff"></uni-icons>
					<span class="bar-text" :class="{'active': activeItem === 'six'}" >设置</span>
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
				vesionType:uni.getStorageSync("vesionType")??1, // 获取版本类型，默认为1
				menuItems: [{
						id: 'one',
						icon: 'icon-shouyin',
						text: '收银',
						isShow: true
					},
					{
						id: 'two',
						icon: 'icon-dingdan',
						text: '订单',
						isShow: true
					},
					{
						id: 'three',
						icon: 'icon-transport',
						text: '库存',
						isShow: true
					},
					{
						id: 'four',
						icon: 'icon-shouyintongji',
						text: '报表',
						isShow: true
					},
					{
						id: 'five',
						icon: 'icon-huozhuguanli',
						text: '结算',
						isShow: true
					},
					{
						id: 'seven',
						icon: 'icon-zhiban',
						text: '轮值',
						isShow: true
					}
				]
			};
		},
		created(){
			console.log("Sidebar onShow called");
			this.vesionType = uni.getStorageSync("vesionType")??1;
			// 检查版本类型是否有变化
			console.log("Current vesionType:", this.vesionType);
			if(this.vesionType === 2 || this.vesionType === 4){
				this.menuItems = [{
						id: 'one',
						icon: 'icon-shouyin',
						text: '收银',
						isShow: true
					},
					{
						id: 'two',
						icon: 'icon-dingdan',
						text: '订单',
						isShow: true
					},
					{
						id: 'three',
						icon: 'icon-transport',
						text: '库存',
						isShow: true
					},
					{
						id: 'four',
						icon: 'icon-shouyintongji',
						text: '报表',
						isShow: true
					},
					{
						id: 'five',
						icon: 'icon-huozhuguanli',
						text: '结算',
						isShow: true
					},
					{
						id: 'seven',
						icon: 'icon-zhiban',
						text: '轮值',
						isShow: true
					}
				];
			}
			else if(this.vesionType === 3 || this.vesionType === 4){
				this.menuItems = [{
						id: 'one',
						icon: 'icon-shouyin',
						text: '收银',
						isShow: true
					},
					{
						id: 'two',
						icon: 'icon-dingdan',
						text: '订单',
						isShow: true
					},
					{
						id: 'three',
						icon: 'icon-transport',
						text: '库存',
						isShow: true
					},
					{
						id: 'four',
						icon: 'icon-shouyintongji',
						text: '报表',
						isShow: true
					},
					{
						id: 'seven',
						icon: 'icon-zhiban',
						text: '轮值',
						isShow: true
					}
				];
			}
			else if(this.vesionType === 1){
				this.menuItems = [{
						id: 'one',
						icon: 'icon-shouyin',
						text: '收银',
						isShow: true
					},
					{
						id: 'two',
						icon: 'icon-dingdan',
						text: '订单',
						isShow: true
					}
				];
			}
  		},
		methods: {
			playSystemKeyClickSound() {
			    try {
			        var Context = plus.android.importClass("android.content.Context");
			        var AudioManager = plus.android.importClass("android.media.AudioManager");
			        var main = plus.android.runtimeMainActivity();
			        var audioManager = main.getSystemService(Context.AUDIO_SERVICE);
			        audioManager.playSoundEffect(AudioManager.FX_KEY_CLICK);
			    } catch (e) {
			        console.error("播放系统按键音失败:", e);
			    }
			},
			changeContent(content) {
				this.playSystemKeyClickSound();
				this.activeItem = content; // 更新当前选中的菜单项
				this.$emit('update-content', content); // 触发事件并传递内容
			},
		}
	};
</script>

<style scoped>
	.bar-coin {
		margin-bottom: 5rpx;
	}

	.sidebar {
		width: 40rpx;
		/* 设置导航栏宽度 */
		background-color: #4A90E2;
		/* 背景颜色 */
		/* 阴影效果 */
	}

	.sidebar ul {
		list-style-type: none;
		/* 去掉列表样式 */
		padding: 0;
		/* 去掉内边距 */
	}

	.sidebar li {
		margin: 5rpx 0;
		/* 列表项之间的间距 */
		display: flex;
		/* 使用 flexbox 布局 */
		align-items: center;
		/* 垂直居中对齐 */
	}

	.menu-item {
		width: 40rpx;
		padding-top: 7rpx;
		padding-bottom: 7rpx;
		display: flex;
		/* 使用 flexbox 布局 */
		flex-direction: column;
		/* 垂直排列 */
		align-items: center;
		/* 水平居中对齐 */
		transition: background-color 0.3s;
		/* 添加过渡效果 */
		border-radius: 5rpx;
	}

	.menu-item-footer {
		position: fixed;
		bottom: 0;
		width: 40rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		display: flex;
		/* 使用 flexbox 布局 */
		flex-direction: column;
		/* 垂直排列 */
		align-items: center;
		/* 水平居中对齐 */
		transition: background-color 0.3s;
		/* 添加过渡效果 */
		border-top: 2rpx solid #707070;
	}

	.menu-item.active {
		background-color: #00aa00;
		/* 选中时的背景色 */
	}

	.menu-item-footer.active {
		background-color: #00aa00;
		/* 选中时的背景色 */
	}
	.bar-text{
		font-weight: bold;
	}

	.bar-text.active{
		color:white;
	}
	
			
</style>