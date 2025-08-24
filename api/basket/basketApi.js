const http = uni.$u.http

export default {
	createRepayBasketOrder(data){
		return http.post(`/Debt/createRepayBasketOrder`,data)
	},
}