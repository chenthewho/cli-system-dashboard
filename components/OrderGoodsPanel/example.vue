<template>
	<div class="example-page">
		<!-- 使用 OrderGoodsPanel 组件 -->
		<OrderGoodsPanel
			:goodsList="goodSelect"
			:totalAmount="payAmount.total"
			:shippingFee="cashier.shippingFee"
			@name-click="handleNameClick"
			@item-click="handleItemClick"
			@delete-item="handleDeleteItem"
			@shipping-click="handleShippingClick"
			@hang-order="handleHangOrder"
			@checkout="handleCheckout"
		/>
	</div>
</template>

<script>
import OrderGoodsPanel from './OrderGoodsPanel.vue';

export default {
	name: 'OrderGoodsPanelExample',
	components: {
		OrderGoodsPanel
	},
	data() {
		return {
			// 商品列表
			goodSelect: [
				{
					key: 'item_1',
					id: '001',
					skuName: '苹果（红富士）',
					quantity: 5,
					referenceAmount: 8.5,
					allweight: 10.5,
					carweight: 0.5,
					money2: 85.0,
					extralModel: {
						id: 'basket_001',
						name: '押筐',
						quantity: 1,
						amount: 10
					}
				},
				{
					key: 'item_2',
					id: '002',
					skuName: '香蕉（进口）',
					quantity: 3,
					referenceAmount: 6.0,
					allweight: 5.2,
					carweight: 0.2,
					money2: 30.0,
					extralModel: {
						id: '',
						name: '',
						quantity: 0
					}
				},
				{
					key: 'item_3',
					id: '003',
					skuName: '橙子（赣南脐橙）',
					quantity: 10,
					referenceAmount: 7.5,
					allweight: 20.8,
					carweight: 0.8,
					money2: 150.0,
					extralModel: {
						id: '',
						name: '',
						quantity: 0
					}
				}
			],
			// 支付金额
			payAmount: {
				total: 265.0
			},
			// 收银信息
			cashier: {
				shippingFee: 15
			}
		}
	},
	methods: {
		// 点击表头名称 - 选择客户
		handleNameClick() {
			console.log('点击表头名称 - 选择客户');
			uni.showToast({
				title: '选择客户',
				icon: 'none'
			});
		},
		
		// 点击商品行 - 编辑商品
		handleItemClick({ item, index }) {
			console.log('点击商品行 - 编辑商品', item, index);
			uni.showToast({
				title: `编辑: ${item.skuName}`,
				icon: 'none'
			});
		},
		
		// 删除商品
		handleDeleteItem(item) {
			console.log('删除商品', item);
			
			uni.showModal({
				title: '确认删除',
				content: `确定要删除 "${item.skuName}" 吗？`,
				success: (res) => {
					if (res.confirm) {
						const index = this.goodSelect.findIndex(g => g.key === item.key);
						if (index !== -1) {
							this.goodSelect.splice(index, 1);
							// 重新计算总金额
							this.calculateTotal();
							
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				}
			});
		},
		
		// 点击运费 - 设置运费
		handleShippingClick() {
			console.log('点击运费 - 设置运费');
			
			uni.showModal({
				title: '设置运费',
				editable: true,
				placeholderText: `当前运费：${this.cashier.shippingFee} 元`,
				success: (res) => {
					if (res.confirm && res.content) {
						const fee = parseFloat(res.content);
						if (!isNaN(fee) && fee >= 0) {
							this.cashier.shippingFee = fee;
							uni.showToast({
								title: `运费已设置为 ${fee} 元`,
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '请输入有效的运费金额',
								icon: 'none'
							});
						}
					}
				}
			});
		},
		
		// 挂单
		handleHangOrder() {
			console.log('挂单', this.goodSelect);
			
			if (this.goodSelect.length === 0) {
				uni.showToast({
					title: '购物车为空',
					icon: 'none'
				});
				return;
			}
			
			uni.showModal({
				title: '确认挂单',
				content: `共 ${this.goodSelect.length} 件商品，总金额 ¥${this.payAmount.total}`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '挂单成功',
							icon: 'success'
						});
						
						// 模拟挂单后清空购物车
						setTimeout(() => {
							this.goodSelect = [];
							this.calculateTotal();
						}, 1500);
					}
				}
			});
		},
		
		// 结账
		handleCheckout() {
			console.log('结账', this.goodSelect);
			
			if (this.goodSelect.length === 0) {
				uni.showToast({
					title: '购物车为空',
					icon: 'none'
				});
				return;
			}
			
			const totalWithShipping = parseFloat(this.payAmount.total) + parseFloat(this.cashier.shippingFee || 0);
			
			uni.showModal({
				title: '确认结账',
				content: `商品金额: ¥${this.payAmount.total}\n运费: ¥${this.cashier.shippingFee}\n合计: ¥${totalWithShipping.toFixed(2)}`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '结账成功',
							icon: 'success'
						});
						
						// 模拟结账后清空购物车
						setTimeout(() => {
							this.goodSelect = [];
							this.cashier.shippingFee = 0;
							this.calculateTotal();
						}, 1500);
					}
				}
			});
		},
		
		// 计算总金额
		calculateTotal() {
			let total = 0;
			this.goodSelect.forEach(item => {
				total += parseFloat(item.money2 || 0);
			});
			this.payAmount.total = total.toFixed(2);
		}
	},
	
	mounted() {
		console.log('OrderGoodsPanel 示例页面加载完成');
	}
}
</script>

<style scoped>
.example-page {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f5f5;
}
</style>

