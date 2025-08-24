<template>
	<div class="container">
	<div class="horizontal-line"></div>
	<div style="display: flex; justify-content: space-between; margin-left: 20px;margin-right: 20px;">
	    <div>创建时间: {{orderInfo.createTime.replace("T"," ")}}</div>
		<div style="color: deepskyblue;" v-if="paymentStatus=='1'">已付款</div>
	    <div style="color: red;" v-if="paymentStatus=='2'">未付款</div>
		<div style="color: red;" v-if="paymentStatus=='3'">赊账</div>
	</div>
	<div class="horizontal-line"></div>
	<p style="margin-left: 40px;">	{{this.moduleInfo}}</p>
	
	<div class="horizontal-line"></div>
	 <div style="margin-left: 20px;">总计: {{totalMoney}} 元</div>
	<div class="horizontal-line"></div>
	</div>
</template>

<script>
	export default { 
		name:'OrderItem',
		props: {
					paymentStatus: {
						type: String,
						default: '2' // 默认颜色为红色
					},
					orderInfo:{
						type: Object,
						default: () => {} // 默认颜色为红色
					}
				},
				data() {
					return {
							detail:{},
							totalMoney:0,
							moduleInfo:""
					}
				},
		created() {
			console.log(this.orderInfo)
			this.detail = JSON.parse(this.orderInfo.module);
			console.log(this.detail.cardList)
			for(var i =0;i<this.detail.cardList.length;i++){
				this.totalMoney += this.detail.cardList[i].totalprice;
				this.moduleInfo += this.detail.cardList[i].name+"*"+this.detail.cardList[i].price+(parseFloat(this.detail.cardList[i].totalWeight)-parseFloat(this.detail.cardList[i].tareWeight))+",";
			}
			console.log(this.totalMoney)
		}
	}
</script>

<style>
	.horizontal-line {
	  height: 1px; /* 高度为1px */
	  width: 100%; /* 宽度为100% */
	  background-color: black; /* 颜色为黑色 */
	  margin: 10px 0; /* 上下间距 */
	}
	.container{
		margin-top: 5rpx;
		font-size: 15px;
		color: black;
		font-weight: bold;
		background-color: white;
		border-radius: 10px;
		box-shadow:
		 0 2px 5px rgba(0, 0, 0, 0.1), /* 下方阴影 */
		  0 -2px 5px rgba(0, 0, 0, 0.1), /* 上方阴影 */
		  2px 0 5px rgba(0, 0, 0, 0.1), /* 右侧阴影 */
		  -2px 0 5px rgba(0, 0, 0, 0.1);
	}
</style>