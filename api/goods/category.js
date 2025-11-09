const http = uni.$u.http

export default {
	categoryList(companyId) {
		return http.get(`/Classify/list?companyId=${companyId}`)
	},
	deleteClassfiy(id) {
		return http.get(`/Classify/delete?id=${id}`)
	},
	categoryListContent(ClassifyId) {
		return http.get(`/Commodity/list?ClassifyId=${ClassifyId}`)
	},
	CommoditySave(ClassifyId,listData){
		return http.get(`/Commodity/Create?classifyId=${ClassifyId}&data=${listData}`)
	},
	CommodityDeleteByClassId(ClassifyId,listData){
		return http.get(`/Commodity/Create?classifyId=${ClassifyId}&data=${listData}`)
	},
	CreateClassify(data){
		return http.get(`/Classify/Create?data=${data}`)}
	,
	getallextralgood(id){
		return http.get(`/ExtralModel/GetByCompanyId?companyId=${id}`)
	},
	deleteExtralgood(id){
		return http.get(`/ExtralModel/delete?id=${id}`)
	},
	updateExtralgood(data){
		return http.post(`/ExtralModel/update`,JSON.stringify(data))
	},
	activeExtralgood(companyId,modelId){
		return http.get(`/ExtralModel/active?&companyId=${companyId}&modelId=${modelId}`)
	},
	DeactiveModel(companyId,modelId){
		return http.get(`/ExtralModel/cancelActive?&companyId=${companyId}&modelId=${modelId}`)
	},
	GetActiveExtralgood(companyId){
		return http.get(`/ExtralModel/GetActive?&companyId=${companyId}`)
	},
	GetDateStatic(companyId,time){
		return http.get(`/Static/GetDateStatic?companyId=${companyId}&dateTime=${time}`)
	},
	GetMonthStatic(companyId,time){
		return http.get(`/Static/GetMonthStatic?companyId=${companyId}&dateTime=${time}`)
	},
	GetAllCommodity(companyId){
		return http.get(`/Commodity/GetBycompanyId?companyId=${companyId}`)
	},
	GetAllCommidityByCompanyId2(companyId){
		return http.get(`/Commodity/GetAllCommidityByCompanyId?companyId=${companyId}`)
	},
	GetAllShipper(companyId){
		return http.get(`/Shipper/GetByCompanyId?companyId=${companyId}`)
	},
	AddShipper(data){
		return http.post(`/Shipper/Create`,data)
	},
	UpdateShipper(data){
		return http.post(`/Shipper/Update`,data)
	},
	GetNewBatchCode(companyId,shipperId){
		return http.get(`/Batch/GetNewBatchCode?CompanyId=${companyId}&ShipperId=${shipperId}`)
	},
	CreateBatch(data){
		return http.post(`/Batch/Create`,data)
	},
	GetAllBatch(companyId){
		return http.get(`/Batch/GetByCompanyId?companyId=${companyId}`)
	},
	GetAllActiveBatch(companyId){
		return http.get(`/Batch/GetActiveByCompanyId?companyId=${companyId}`)
	},
	SaveCommoditySale(data){
		return http.post(`/CommoditySale/CreateType2`,data)
	},
	GetBybatchId(Id){
		return http.get(`/CommoditySale/GetBybatchId?batchId=${Id}`)
	},
	GetBybatchId2(Id){
		return http.get(`/Batch/GetPurchaseAssistBybatchId?batchId=${Id}`)
	},
	DeleteBybatchId(Id){
		return http.get(`/CommoditySale/DeleteBybatchId?batchId=${Id}`)
	},
	UpdateBatchStatus(data){
		return http.post(`/Batch/UpdateStatus`,data)
	},
	CommoditySave2(listData){
		return http.get(`/Commodity/Create2?data=${listData}`)
	},
	CommoditySave3(data){
		return http.post(`/Commodity/Create3`,data)
	},
	CreatePurchaseOrder(data){
		return http.post(`/PurchaseOrder/CreatePurchaseOrder`,data)
	},
	UpdatePurchaseOrder(data){
		return http.post(`/PurchaseOrder/UpdatePurchaseOrder`,data)
	},
	BulkInsertPurchaseAssist(data){
		return http.post(`/Batch/BulkInsertPurchaseAssist`,data)
	},
	DeleteCommodity(id){
		return http.get(`/Commodity/DeleteCommodity?id=${id}`)
	},
	EditCommodity(data){
		return http.post(`/Commodity/EditCommodity`,data)
	}
}