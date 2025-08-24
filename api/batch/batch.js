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
	GetBybatchPurchaseAssist(batchId) {
		return http.get(`/Batch/GetBybatchPurchaseAssist?batchId=${batchId}`)
	},
	GetSingleAssistBatchInfoAndProfit(batchId) {
		return http.get(`/Batch/GetSingleAssistBatchInfoAndProfit?batchId=${batchId}`)
	},
	UpdateBatchAssist(data){
		return http.post(`/Batch/UpdateBatchAssist`,data)
	},
}