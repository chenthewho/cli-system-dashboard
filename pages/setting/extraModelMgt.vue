<template>
	<div class="container">
		<div class="list-container">
			<ul>
				<li v-for="(item, index) in items" :key="index" class="list-item">
					<div class="item-container"> <!-- 项目名称和重量 -->
						<div class="item-name">{{ item.name }}</div>
						<text class="item-weight" >重量: {{item.weight}}</text>
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
		<u-modal title="添加" :show="isAddVisible" :closeOnClickOverlay="true" @close="closeAdded"
			:showConfirmButton="false" :width="'400px'">
			<view>
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="addedModel" :rules="rules" ref="uForm">
					<u-form-item label="名称" prop="name" borderBottom ref="item1">
						<u--input v-model="addedModel.name" border="none"></u--input>
					</u-form-item>
					<u-form-item label="金额" prop="amount" borderBottom ref="item2">
						<u--input v-model="addedModel.amount" border="none"></u--input>
					</u-form-item>
					<u-form-item label="重量" prop="weight" borderBottom ref="item3">
						<u--input v-model="addedModel.weight" border="none" placeholder="可选，输入重量"></u--input>
					</u-form-item>
					<!-- <u-form-item label="类型" prop="type" borderBottom ref="item4">
						<u-radio-group v-model="addedModel.type" placement="row">
							<u-radio shape="square" label="数量" name="1"></u-radio>
							<u-radio shape="square" label="总重" name="2"></u-radio>
							<u-radio shape="square" label="净重" name="3"></u-radio>
						</u-radio-group>

					</u-form-item> -->

				</u--form>
				<div class="button-group" style="margin-top: 30rpx;">
					<u-button type="primary" :plain="true" text="取消" @click="closeAdded"></u-button>
					<u-button type="primary" text="保存" @click="addAction"></u-button>
				</div>
			</view>

		</u-modal>

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
		padding: 16px;
		background-color: #f8f9fa;
		border: none;
		border-radius: 12px;
		max-height: 350px;
		/* 设置最大高度 */
		overflow-y: auto;
		/* 允许垂直滚动 */
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	.list-item {
		padding: 16px;
		border-bottom: 1px solid #f0f2f5;
		display: flex;
		/* 使用 Flexbox 布局 */
		align-items: center;
		/* 垂直居中对齐 */
		justify-content: space-between;
		/* 在主轴上均匀分配空间 */
		background: #fff;
		margin-bottom: 8px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.list-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.list-item:last-child {
		margin-bottom: 0;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		/* 垂直排列 */
		flex: 1;
		/* 使 item-container 占据剩余空间 */
		justify-content: center;
	}

	.item-name {
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin-bottom: 4px;
	}

	.item-weight {
		font-size: 15px;
		color: #2979ff;
		padding: 4px;
		border-radius: 5px;
		width: 100px;
		display: inline-block;
		font-weight: 500;
	}

	.amount {
		margin-right: 60rpx;
		font-size: 15px;
		/* 设置金额的字体大小 */
		color: #e91e63;
		/* 设置金额的颜色 */
		font-weight: 600;
		flex: 0 1 auto;
		/* 使金额在中间 */
		background: #fce4ec;
		padding: 6px 12px;
		border-radius: 16px;
		border: 1px solid #f8bbd9;
	}

	.button-group {
		display: flex;
		/* 使用 Flexbox 布局 */
		margin-left: auto;
		/* 将按钮组推到最右边 */
	}

	.add-button-container {
		display: flex;
		/* 使用 Flexbox 布局 */
		justify-content: center;
		margin-top: 16px;
		/* 设置与列表的间距 */
		padding-top: 16px;
		border-top: 1px solid #e9ecef;
	}

	input {
		margin-right: 10px;
		padding: 5px;
	}

	button {
		margin-left: 5px;
	}
</style>