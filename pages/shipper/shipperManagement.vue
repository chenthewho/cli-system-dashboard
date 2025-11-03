<template>
	<view>
		<view class="header" style="height: 35rpx;background-color:white;">
			<view style="width: 300rpx;padding: 5rpx;">
				<div style="display: flex;">
					<u-button 
						class="tabbtn1" 
						type="primary" 
						@click="tabChange(0)" 
						:plain="currentTab!=0" 
						text="代销货主"
					></u-button>
					<u-button 
						class="tabbtn2" 
						type="primary" 
						@click="tabChange(1)" 
						:plain="currentTab!=1" 
						text="自营货主"
					></u-button>	
				</div>
			</view>
		</view>
		<consignmentShipper ref="consignmentRef" v-show="currentTab==0" />
		<selfOperatedShipper ref="selfOperatedRef" v-show="currentTab==1" />
	</view>
</template>

<script>
	import consignmentShipper from './consignmentShipper.vue';
	import selfOperatedShipper from './selfOperatedShipper.vue';
	
	export default {
		name: 'shipperManagement',
		components: {
			consignmentShipper,
			selfOperatedShipper
		},
		data() {
			return {
				currentTab: 0, // 0-代销货主, 1-自营货主
				vesionType: 1
			}
		},
		created() {
			this.vesionType = uni.getStorageSync("vesionType") ?? 1;
		},
		methods: {
			tabChange(index) {
				this.currentTab = index;
				// 切换标签时刷新对应页面数据
				this.$nextTick(() => {
					if(index === 0 && this.$refs.consignmentRef) {
						this.$refs.consignmentRef.loadData(true);
					} else if(index === 1 && this.$refs.selfOperatedRef) {
						this.$refs.selfOperatedRef.loadData(true);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		align-items: center;
		padding: 5rpx;
		background-color: white;
	}
	
	.tabbtn1 {
		height: 35px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	
	.tabbtn2 {
		height: 35px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
</style>

