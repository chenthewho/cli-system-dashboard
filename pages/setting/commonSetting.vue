<template>
	<view>
		<div style="display: flex; align-items: center; height: 25rpx; background: white; position: relative;">
		  <div style="position: absolute; left: 0; display: flex; align-items: center; height: 25rpx;">
		    <button
		      style="margin-left: 5px; height: 18rpx; line-height: 18rpx; color:#ffffff; font-weight: bold; background: #dddddd;"
		      @click="back">
		      <uni-icons custom-prefix="iconfont" type="icon-fanhui" size="15" color="#ffffff" style="margin-right: 5px;"></uni-icons>返回
		    </button>
		  </div>
		  <div style="margin: 0 auto; font-size: 10rpx; font-weight: bold; color: #333;">
		    商户信息
		  </div>
		</div>
		<div class="settings-container">
			<!-- <uni-row class="demo-uni-row" width="1000px">
			<uni-col :span="12">
				<view class="demo-uni-col dark"></view>
			</uni-col>
			<uni-col :span="12">
				<div class="setting-item">
					<button @click="logout">退出登录</button>
				</div>
			</uni-col>
		</uni-row> -->


			<view class="container" style="margin-top: 50px;">
				<view class="left-part">
					<view>
						<view class="input-container">
							<text class="label">商家名称：</text>
							<input class="input-field" type="text" placeholder=" " v-model="baseFormData.companyName" />
						</view>
						<view class="input-container">
							<text class="label">地址：</text>
							<input class="input-field" type="text" placeholder=" " v-model="baseFormData.address" />
						</view>
						<view class="input-container">
							<text class="label">联系电话：</text>
							<input class="input-field" type="text" placeholder=" " v-model="baseFormData.contact" />
						</view>
						<view style="margin-top: 50px;">
							<button @click="submit" style="width: 50%;height: 40px;line-height: 40px;">保存信息</button>
						</view>
						<view style="margin-top: 50px;">
							<button @click="logout" style="width: 50%;background-color: darkred;height: 40px;line-height: 40px;">退出登录</button>
						</view>
					</view>
				</view>

				<view class="right-part">
					<view >
						<view class="vertical-line"></view>
						
					</view>
				</view>
			</view>

		</div>
	</view>
</template>

<script>
	import cashierOrder from '../../api/cashier/cashierOrder'
	export default {
		data() {
			return {
				currentCompanyId:"",
				baseFormData:{}
			}
		},
		created() {
			this.currentCompanyId = uni.getStorageSync('companyId');
			this.getStoreInfo();
		},
		methods: {
			back(){
				uni.setStorageSync("refreshCompanyInfo","true")
				uni.navigateBack({
				  delta: 1 // 返回上一级页面，默认值是1
				});
			},
			logout() {
				getApp().logout();
			},
			getStoreInfo() {
				cashierOrder.getStoreInfo(this.currentCompanyId).then(res => {
					this.baseFormData = {
						companyName: res.data.companyName,
						address: res.data.address,
						contact: res.data.contact
					}
					this.baseFormData.id = this.currentCompanyId;
				})
			},
			submit() {
					cashierOrder.updateStoreInfo(this.baseFormData).then(res => {	
						if(res.code===200){
							uni.showToast({
								title: '修改成功',
								icon: 'none'
							})
							uni.setStorageSync('companyName',this.baseFormData.companyName);
						}else{
							uni.showToast({
								title: '修改失败',
								icon: 'none'
							})
						}
					})
			}
		}
	}
</script>

<style scoped>
	.settings-container {
		padding: 20px;
		text-align: center;
	}


	.setting-item {
		margin: 15px 0;
	}

	.input-container {
		margin-left: 10%;
		width: 80%;
		display: flex;
		/* 使用 Flexbox 布局 */
		flex-direction: column;
		/* 垂直排列 */
		margin-bottom: 10px;
		/* 可选：添加下边距 */
	}

	.label {
		margin-bottom: 5px;
		/* 可选：添加标签与输入框之间的间距 */
		font-weight: bold;
		/* 可选：加粗标签文字 */
	}

	.input-field {
		padding: 10px;
		/* 可选：添加内边距 */
		border: 1px solid #ccc;
		/* 可选：设置边框 */
		border-radius: 5px;
		/* 可选：设置圆角 */
		width: 100%;
		height: 50px;
		/* 可选：设置输入框宽度 */
	}

	.container {
		display: flex;
		/* 使用 Flexbox 布局 */
		justify-content: space-between;
		/* 在左右两侧均匀分配空间 */
		align-items: center;
		/* 垂直居中对齐 */
		padding: 10px;
		/* 可选：添加内边距 */
		background-color: transparent;
		/* 可选：设置背景颜色 */
		border-radius: 5px;
		/* 可选：设置圆角 */
	}

	.left-part {
		flex: 1;
		/* 左侧部分占据可用空间 */
		text-align: left;
		/* 左对齐 */
	}

	.right-part {
		flex: 1;
		/* 右侧部分占据可用空间 */
		text-align: right;
		/* 右对齐 */
	}

	.vertical-line {
		border-left: 2px solid gray;
		/* 设置竖线的颜色和宽度 */
		height: 500px;
		/* 设置竖线的高度 */
		margin: 0 10px;
		/* 设置竖线与文本之间的间距 */
	}

	button {
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 15px;
		cursor: pointer;
	}
</style>