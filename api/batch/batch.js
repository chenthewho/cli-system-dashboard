const http = uni.$u.http

export default {
	getBatchInfoById(id) {
		return http.get(`/Batch/GetById?Id=${id}`)
	},
	deleteBatchById(id) {
		return http.get(`/Batch/Delete?Id=${id}`)
	},
	GetLastBatchCommodity(companyId, shipperId) {
		return http.get(`/Batch/GetLastBatchInitPurchase?companyId=${companyId}&shipperId=${shipperId}`)
	},
	//带售量
	GetBybatchPurchaseAssist(batchId) {
		return http.get(`/Batch/GetBybatchPurchaseAssist?batchId=${batchId}`)
	},
	//不带售量
	GetPurchaseAssistBybatchId(batchId) {
		return http.get(`/Batch/GetPurchaseAssistBybatchId?batchId=${batchId}`)
	},
	GetReposityAssistBybatchId(batchId) {
		return http.get(`/Batch/GetReposityAssistBybatchId?batchId=${batchId}`)
	},
	//修改库存
	BulkModifyPurchaseAssist(data) {
		return http.post(`/Batch/BulkModifyPurchaseAssist`,data)
	},
	GetSingleAssistBatchInfoAndProfit(batchId) {
		return http.get(`/Batch/GetSingleAssistBatchInfoAndProfit?batchId=${batchId}`)
	},
	UpdateBatchAssist(data){
		return http.post(`/Batch/UpdateBatchAssist`,data)
	},
	GetBatchModifyRecord(batchId) {
		return http.get(`/Batch/GetBatchModifyRecord?batchId=${batchId}`)
	},
}