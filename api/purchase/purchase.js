const http = uni.$u.http

export default {
	getPurchaseOrderByCompanyId(companyId){
		return http.get(`/PurchaseOrder/GetByCompanyId?companyId=${companyId}`)
	},
	getAllpurchaseShipper(companyId){
		return http.get(`/PurchaseShipper/GetByCompanyId?companyId=${companyId}`)
	},
	createPurchaseShipper(data){
		return http.post("/PurchaseShipper/Create",data)
	},
	GetCommodityByPurchaseOrderId(purchaseOrderId){
		return http.get(`/PurchaseOrder/GetCommodityByPurchaseOrderId?purchaseOrderId=${purchaseOrderId}`)
	},
	GetEmployCommidityByClassId(classId) {
		return http.get(`/Commodity/GetEmployCommidityByClassId?classId=${classId}`)
	}
	
}