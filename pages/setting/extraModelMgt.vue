<template>
	<div class="container">
		<div class="list-container">
			<ul>
				<li v-for="(item, index) in items" :key="index" class="list-item">
					<div class="item-container"> <!-- 项目名称和重量 -->
						<div class="item-name">{{ item.name }}</div>
						<div class="item-weight" >重量: {{item.weight}}</div>
					</div>
					<div class="amount">单价：{{item.amount}}</div> <!-- 中间的金额 -->
					<div class="button-group"> <!-- 按钮组 -->
						<u-button type="error" text="删除" @click="deleteItem(item)"></u-button>
					</div>
				</li>
			</ul>
			<div class="add-button-container"> <!-- 添加按钮的容器 -->
				<u-button type="primary" text="添加" style="width: 60%;" @click="isAddVisible = true"></u-button>
			</div>
		</div>
		<!-- 添加物品弹窗 -->
		<div class="znj-modal-overlay" v-if="isAddVisible" @click="closeAdded">
			<div class="znj-add-modal" @click.stop>
				<div class="znj-add-modal-header">
					<span>添加物品</span>
					<uni-icons custom-prefix="iconfont" type="icon-icon-cross-squre" size="28"
						@click="closeAdded" color="#ffffff" class="znj-modal-close"></uni-icons>
				</div>
				<div class="znj-add-modal-body">
					<u--form labelPosition="left" :model="addedModel" :rules="rules" ref="uForm" labelWidth="60">
						<u-form-item label="名称" prop="name" borderBottom ref="item1">
							<u--input v-model="addedModel.name" border="none" fontSize="13rpx" placeholder="请输入名称"></u--input>
						</u-form-item>
						<u-form-item label="金额" prop="amount" borderBottom ref="item2">
							<u--input v-model="addedModel.amount" border="none" fontSize="13rpx" placeholder="请输入金额"></u--input>
						</u-form-item>
						<u-form-item label="重量" prop="weight" borderBottom ref="item3">
							<u--input v-model="addedModel.weight" border="none" fontSize="13rpx" placeholder="可选，输入重量"></u--input>
						</u-form-item>
					</u--form>
					<div class="modal-button-group">
						<button class="modal-btn cancel-btn" @click="closeAdded">取消</button>
						<button class="modal-btn save-btn" @click="addAction">保存</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import category from '../../api/goods/category'
	import {
		getCompanyId
	} from '../../common/const/cacheSync'
	export default {
		name: 'ExtraModelMgt',
		data() {
			return {
				newItem: '', // 新项目输入
				items: [], // 列表数据
				conpanyId: uni.getStorageSync('companyId'),
				isEditing: [], // 记录每个项目是否在编辑状态
				editItem: [], // 编辑中的项目内容
				isAddVisible: false,
				addedModel: {
					type: "1",
					weight: ""
				},
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}
				},
			};
		},
		created() {
			this.refreshItems();
		},
		methods: {
			refreshItems() {
				let that = this;
				category.getallextralgood(this.conpanyId).then(res => {
					that.items = res.data;
					// 按名称排序
					that.items.sort((a, b) => {
						return a.name.localeCompare(b.name);
					});
				})
			},
			addItem() {
				if (this.newItem.trim()) {
					this.items.push(this.newItem.trim()); // 添加新项目
					this.newItem = ''; // 清空输入框
					this.isEditing.push(false); // 添加编辑状态
					this.editItem.push(''); // 添加编辑内容
				}
			},
			deleteItem(item) {
				console.log(item);
				let that = this;
				category.deleteExtralgood(item.id).then(res => {
					that.refreshItems();
				})
			},
			closeAdded() {
				this.addedModel = {
					type: "1",
					weight: ""
				};
				this.isAddVisible = false;
			},
			addAction() {
				let that = this;
				this.addedModel.Id = "";
				this.addedModel.companyId = that.conpanyId;
				this.addedModel.status = 0;
				var modelParam  = JSON.parse(JSON.stringify(this.addedModel))
				modelParam.type = parseFloat(modelParam.type);
				modelParam.amount = parseFloat(modelParam.amount);
				// 处理重量字段，如果为空则不传递
				if (modelParam.weight && modelParam.weight.trim() !== "") {
					modelParam.weight = parseFloat(modelParam.weight);
				} else {
					delete modelParam.weight;
				}
				category.updateExtralgood(modelParam).then(res => {
					if(res.code===200){
						uni.showToast({
								title: '添加成功',
								icon: 'none',
								duration: 2000})
								that.refreshItems();
								that.closeAdded();
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000})
					}

				})
			}
		}
	};
</script>

<style scoped>
	.list-container {
		padding: 15rpx;
		background-color: #fafbfc;
		border: none;
		border-radius: 0;
		max-height: 420rpx;
		overflow-y: auto;
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.list-item {
		padding: 10rpx 12rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		margin-bottom: 8rpx;
		border-radius: 6rpx;
		border: 1px solid #eee;
		box-shadow: none;
		transition: all 0.2s ease;
	}

	.list-item:hover {
		background: #e3f2fd;
		border-color: #1976d2;
		transform: none;
	}

	.list-item:last-child {
		margin-bottom: 0;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
	}

	.item-name {
		font-size: 14rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 3rpx;
	}

	.item-weight {
		margin-top: 5rpx;
		font-size: 12rpx;
		color: #1976d2;
		padding: 5rpx 6rpx;
		border-radius: 3rpx;
		width: 20%;
		display: inline-block;
		font-weight: 500;
		background: #e3f2fd;
	}

	.amount {
		margin-right: 10rpx;
		font-size: 13rpx;
		color: #e91e63;
		font-weight: 600;
		flex: 0 1 auto;
		background: #fce4ec;
		padding: 4rpx 10rpx;
		border-radius: 5rpx;
		border: 1px solid #f8bbd9;
	}

	.button-group {
		display: flex;
		margin-left: auto;
	}

	.add-button-container {
		display: flex;
		justify-content: center;
		padding: 15rpx 0 10rpx 0;
		border-top: 1px solid #f0f2f5;
	}

	/* 遮罩层样式 */
	.znj-modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	/* 添加物品弹窗样式 */
	.znj-add-modal {
		background: #fff;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.12);
		width: 350rpx;
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.znj-add-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
		font-size: 14rpx;
		font-weight: bold;
		padding: 12rpx 15rpx;
		color: #ffffff;
		border-radius: 12px 12px 0 0;
	}

	.znj-modal-close {
		cursor: pointer;
	}

	.znj-add-modal-body {
		padding: 20rpx;
	}

	.modal-button-group {
		display: flex;
		gap: 15rpx;
		margin-top: 25rpx;
		justify-content: center;
	}

	.modal-btn {
		flex: 1;
		height: 40rpx;
		border: none;
		border-radius: 5rpx;
		font-size: 14rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-btn {
		background: #bdbdbd;
		color: #fff;
	}

	.cancel-btn:hover {
		background: #9e9e9e;
	}

	.save-btn {
		background: linear-gradient(90deg, #4caf50, #43a047);
		color: #fff;
	}

	.save-btn:hover {
		background: linear-gradient(90deg, #43a047, #388e3c);
	}
</style>