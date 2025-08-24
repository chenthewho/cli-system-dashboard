const http = uni.$u.http

export default {
    //创建还款单
	createRepayOrder(data) {
		return http.post('/Debt/createRepayOrder',data)
	},
    //新建还款单商品
    createRepayBasketOrder(data){
        return http.post('/Debt/createRepayBasketOrder',data)
    }
}