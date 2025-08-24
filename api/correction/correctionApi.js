const http = uni.$u.http

//盘点接口
export default {
	GetCurrentCorrectionByCommodityId(commodityId) {
		return http.get(`/Correction/GetCurrentCorrectionByCommodityId?commodityId=${commodityId}`)
	},
	createCorrectionOrder(data){
		return http.post(`/Correction/createCorrectionOrder`,data)
	}
}