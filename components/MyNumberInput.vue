<template>
	<view>
		<view class="mybrankmask" :style="{ width: width, height: height, backgroundColor: '#EBEEF5', zIndex: 999, left: 0, bottom: 0 }"  v-if="IsShow">
			<view style="padding: 20rpx;">
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(1)">1</view>
					<view class="maskListItem" @click="NumberCk(2)">2</view>
					<view class="maskListItem" @click="NumberCk(3)">3</view>
					<view class="maskListItem" style="background-color: #FFA500;color: #fff;" @click="Cancelword()">取消</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(4)">4</view>
					<view class="maskListItem" @click="NumberCk(5)">5</view>
					<view class="maskListItem" @click="NumberCk(6)">6</view>
					<view class="maskListItem" style="background-color: #67C23A;color: #fff;" @click="Tuige()">退格</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(7)">7</view>
					<view class="maskListItem" @click="NumberCk(8)">8</view>
					<view class="maskListItem" @click="NumberCk(9)">9</view>
					<view class="maskListItem" style="background-color: #F56C6C;color: #fff;" @click="Clear()">清空</view>
				</view>
				<view class="MymaskList">
					<view class="maskListItem" @click="NumberCk(0)">0</view>
					<view class="maskListItem" @click="NumberCk('.')">.</view>
					<view class="maskListItem" style="background-color: #31BDEC;color: #fff;width: 48%;" @click="Next()">下一项</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default{
		data(){
			return {
				inputId:'',
				inputShow:false,
				maskHeight: '470rpx' // 动态高度
			}
		},
		props:{
			IsShow:{
				type:Boolean,
				default:false
			},
			width:{
				type:String,
				default:'470rpx'
			},
			height:{
				type:String,
				default:'470rpx'
			},
			myvalue:{
				type:[String,Number],
				default:''
			},
			myevent:{
				type:String,
				default:''
			}
		},
		methods:{
			maskShow(){
				this.$emit('Mykeywordck');
			},
			NumberCk(val){
				if(val=='.'){
					if(this.myvalue.toString().indexOf('.')>=0){
						return;
					}
				}
				var txt = this.myvalue == null?'':this.myvalue;
				var arr = { even:this.myevent,value:txt + val.toString() };
				this.$emit('setValue', `${JSON.stringify(arr)}`);
				//this.$emit('update:myvalue',txt + val.toString());
			},
			Tuige(){
				if(this.myvalue!=null){
					var txt = this.myvalue.toString();
					if(txt.length>=1)
					//this.$emit('update:myvalue',txt.substring(0,txt.length-1));
					var arr = { even:this.myevent,value:txt.substring(0,txt.length-1) };
					this.$emit('setValue', JSON.stringify(arr));
				}
			},
			//取消按钮
			Cancelword(){
				this.$emit('Cancelword');
			},
			//清除按钮
			Clear(){
				var arr = { even:this.myevent,value:null };
				this.$emit('setValue', JSON.stringify(arr));
			},
			//下一个
			Next(){
				this.$emit('goNext');
			}
		}
	}
</script>

<style>
	.Numberinput{display: flex;align-items: center;}
	.myfous{width: 1rpx;height: 41rpx;background-color: #000;display: block;animation: mytreat 1.5s linear infinite;}
	.mybrankmask .MymaskList{display: flex;width: 100%;justify-content: space-around;margin-bottom: 20rpx;}
	.mybrankmask .MymaskList .maskListItem{width: 23%;height: 40rpx;background-color: #fff;text-align: center;line-height: 40rpx;border-radius: 10rpx;}
	
	//自定义光标模拟Input焦点
	@keyframes mytreat{
	    /*开始画面*/
	    0%{
	        background-color: #000;
	    }
	    50%{
	        background: none;
	    }    
	    100%{
	        background-color: #000;
	    }
	}
</style>
