<template>
	<div class="container">
		<div class="list-container">
			<ul>
				<li v-for="(item, index) in items" :key="index" class="list-item">
					<div class="item-container"> <!-- 项目名称和小字 -->
						<span>{{ item.name }}</span>
						<span class="small-text">绑定:{{item.typeName}}</span> <!-- 下方的小字 -->
					</div>
					<div class="amount">金额：{{item.amount}}</div> <!-- 中间的金额 -->
					<div class="button-group"> <!-- 按钮组 -->
						<u-button v-if="item.status==0" type="error" text="删除" @click="deleteItem(item)"></u-button>
						<u-button v-if="item.status==0" type="primary" text="启动" @click="activeModel(item)"></u-button>
						<u-button v-if="item.status==1" type="error" text="关闭" @click="DeactiveModel(item)"></u-button>
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
					<u-form-item label="类型" prop="type" borderBottom ref="item1">
						<u-radio-group v-model="addedModel.type" placement="row">
							<u-radio shape="square" label="数量" name="1"></u-radio>
							<u-radio shape="square" label="总重" name="2"></u-radio>
							<u-radio shape="square" label="净重" name="3"></u-radio>
						</u-radio-group>

					</u-form-item>

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
					type: "1"
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
			activeModel(item){
				let that = this;
				category.activeExtralgood(this.conpanyId,item.id).then(res => {
					that.refreshItems();
				})
			},
			DeactiveModel(item){
				let that = this;
				category.DeactiveModel(this.conpanyId,item.id).then(res => {
					that.refreshItems();
				})
			},
			refreshItems() {
				let that = this;
				category.getallextralgood(this.conpanyId).then(res => {
					that.items = res.data;
					that.items.forEach((x) => {
						if (x.type == 1) {
							x.typeName = "数量"
						}

					})
					that.items.sort((a, b) => {
						return b.status - a.status; // 降序排序
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
					type: "1"
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
				category.updateExtralgood(modelParam).then(res => {
					if(res.code===200){
						uni.showToast({
								title: '添加成功',
								icon: 'none',
								duration: 2000})
								that.refreshItems();
								that.isAddVisible = false;
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
		padding: 20px;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 5px;
		max-height: 300px;
		/* 设置最大高度 */
		overflow-y: auto;
		/* 允许垂直滚动 */
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	.list-item {
		padding: 10px;
		border-bottom: 1px solid #ddd;
		display: flex;
		/* 使用 Flexbox 布局 */
		align-items: center;
		/* 垂直居中对齐 */
		justify-content: space-between;
		/* 在主轴上均匀分配空间 */
	}

	.item-container {
		display: flex;
		flex-direction: column;
		/* 垂直排列 */
		flex: 1;
		/* 使 item-container 占据剩余空间 */
	}

	.small-text {
		font-size: 12px;
		/* 设置小字的字体大小 */
		color: #888;
		/* 设置小字的颜色 */
		margin-top: 5px;
		/* 设置小字与上方文本的间距 */
	}

	.amount {
		margin-right: 100rpx;
		font-size: 14px;
		/* 设置金额的字体大小 */
		color: #333;
		/* 设置金额的颜色 */
		flex: 0 1 auto;
		/* 使金额在中间 */
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
		margin-top: 20px;
		/* 设置与列表的间距 */
		margin-left: 100rpx;
	}

	input {
		margin-right: 10px;
		padding: 5px;
	}

	button {
		margin-left: 5px;
	}
</style>