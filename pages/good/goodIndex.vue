<template>
	<view>
	<view class="header" style="height: 35rpx;background-color:white;">
		<view style="width: 300rpx;padding: 5rpx;">
			<!-- <u-subsection :list="list" mode="subsection" :current="curNow" @change="sectionChange"></u-subsection> -->
			<div style="display: flex;">
			<u-button class="tabbtn1" type="primary" @click="sectionChange(0)" :plain="curNow!=0" v-if="this.vesionType == 2 || this.vesionType == 4" text="批次管理"></u-button>
			<u-button class="tabbtn3" type="primary" @click="sectionChange(2)" :plain="curNow!=2" v-if="this.vesionType == 3 || this.vesionType == 4" text="自营商品"></u-button>
			<u-button class="tabbtn2" type="primary" @click="sectionChange(1)" :plain="curNow!=1" v-if="this.vesionType == 2 || this.vesionType == 3 || this.vesionType == 4" text="货品管理"></u-button>	
			</div>
		</view>
	</view>
	<good ref="goodRef" v-if=" curNow==1" />
	<batch  ref="batchRef" v-if=" curNow==0" />
	<goodEmploy ref="goodEmployRef" v-if=" curNow==2" />
	</view>
</template>

<script>
	import good from './good.vue';
	import batch from './batch.vue';
	import goodEmploy from './goodEmploy.vue';
	export default {
		name: 'goodIndex',
		components: {
			good,
			batch,
			goodEmploy
		},
		data() {
			return {
				vesionType : 1, // 获取版本类型，默认为1
				list: ['批次管理', '货品管理'],
				curNow: 0
			}
		},
		created() {
			this.vesionType = uni.getStorageSync("vesionType");
			if(this.vesionType == 3){
				this.curNow = 2;
			}
			// console.log("vesionType",this.vesionType);
		},
		methods: {
			refreshPage(){
				// 刷新当前显示的页面
				this.$nextTick(() => {
					if(this.curNow === 0 && this.$refs.batchRef){
						// 刷新批次管理页面
						this.$refs.batchRef.getAllBatch();
					} else if(this.curNow === 1 && this.$refs.goodRef){
						// 刷新货品管理页面
						if(this.$refs.goodRef.refreshPage){
							this.$refs.goodRef.refreshPage();
						}
					} else if(this.curNow === 2 && this.$refs.goodEmployRef){
						// 刷新自营商品页面
						if(this.$refs.goodEmployRef.refreshPage){
							this.$refs.goodEmployRef.refreshPage();
						}
					}
				});
			},
			refreshBatch(id){
				this.$refs.batchRef.getBatchCommodityList(id);
			},
			refreshAllBatch(){
				this.$refs.batchRef.getAllBatch();
			},
			sectionChange(index) {
				this.curNow = index;
			}
		}
	}
</script>

<style lang="scss">
	.scrollArea {
		background-color: darkgrey;
		height: calc(100vh - 34rpx);

	}
	
	.tabbtn1 {
	    height: 35px;
	    border-top-left-radius: 5px;   /* 左上圆角 */
	    border-bottom-left-radius: 5px; /* 左下圆角 */
	    border-top-right-radius: 0;    /* 右上无圆角 */
	    border-bottom-right-radius: 0; /* 右下无圆角 */
	}
	
	.tabbtn2 {
	    height: 35px;
	    border-top-left-radius: 0;     /* 左上无圆角 */
	    border-bottom-left-radius: 0;  /* 左下无圆角 */
	    border-top-right-radius: 5px;  /* 右上圆角 */
	    border-bottom-right-radius: 5px; /* 右下圆角 */
	}
	.tabbtn3 {
	    height: 35px;
		border-left-color:white;     /* 左上无圆角 */
	    border-right-color:white;
		border-left:0px;
		border-right:0px;
	    border-top-left-radius: 0;     /* 左上无圆角 */
	    border-bottom-left-radius: 0;  /* 左下无圆角 */
	    border-top-right-radius: 0px;  /* 右上圆角 */
	    border-bottom-right-radius: 0px; /* 右下圆角 */
	}
</style>