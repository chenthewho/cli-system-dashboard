const http = uni.$u.http

export default {
	createLossModelOrder(data){
			return http.post("/LossModel/createLossModelOrder",data)
	}
}