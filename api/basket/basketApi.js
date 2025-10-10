const http = uni.$u.http

export default {
	createRepayBasketOrder(data){
		return http.post(`/Debt/createRepayBasketOrder`,data)
	},
	GetSingleRepayBasketOrder(orderId){
		return http.get(`/Debt/GetSingleRepayBasketOrder?orderId=${orderId}`)
	},
	GetRepayBasketOrdersByIdList(OrderIdList){
		return http.post(`/Debt/GetRepayBasketOrdersByIdList`,OrderIdList)
	}
}