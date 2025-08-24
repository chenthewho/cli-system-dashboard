<template>
	<div class="login-container">
		<div class="auth-bg">
			<u-toast ref="uToast"></u-toast>
			<div class="auth-body">
				<div class="common-layout">
					<!-- <div class="login-title">
						<div class="logo">
							<u--image class="logo-img" src="../../static/img/logo.png" width="32px"
								height="32px"></u--image>
							<div class="logo-title">易米派</div>
						</div>
						<div class="line">/</div>
						<div class="desc">专业的新零售管理</div>
					</div> -->
					<div class="content">
						<div class="login">
							<div class="login-tabs-item" style="font-weight: bold;"
								@click="changeLoginModeTitle('password')">
								选择商户
							</div>
							<div style="margin-top: 50px;height: 200px;">
								<div class="containerSelection" v-for="item in indexList">
								    <div class="textSelection">{{item.companyName}}</div>
								    <div class="buttonSelection"><u-button type="primary" text="进入" @click="enter(item)"></u-button></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				indexList: [],
			}
		},
		methods: {
			enter(item){
				uni.setStorageSync("companyId",item.id);
				uni.setStorageSync("companyName",item.companyName);
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			getCompanyInfo(id){
					return new Promise((resolve, reject) => {
						 uni.$u.http.get(`/Company/GetByUserId?id=${id}`).then(res => {
							resolve(res.data)
						}).catch(err => {
							reject(err)
						})	})			
			}
		},
		 onLoad :async  function() {
			 var companyId =uni.getStorageSync("companyId");
			if(companyId){
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}else{
			var userInfo = uni.getStorageSync("userInfo");
            var result =  await this.getCompanyInfo(userInfo.id);
			this.indexList = result;
			}
		},
		
		onShow() {
			console.log("进入")
			// this.$u.route({
			// 	url: '/pages/auth/login',
			// 	type: 'reLaunch'
			// })
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/auth.scss";
</style>