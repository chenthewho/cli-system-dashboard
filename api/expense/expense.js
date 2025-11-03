const http = uni.$u.http

export default {
	createExpense(data){
		return http.post(`/BatchExpense/Create`,data)
	},
	getAllExpenseByBatchId(batchId){
		return http.get(`/BatchExpense/GetByBatchId?batchId=${batchId}`)
	},
	//获取未结算的费用项
	getAllUnsettleExpenseByBatchId(batchId){
		return http.get(`/BatchExpense/GetByBatchIdUnsettle?batchId=${batchId}`)
	},
	deleteByBatchId(batchId){
			return http.get(`/BatchExpense/DeleteAll?batchId=${batchId}`)
	},
	createListExpense(data){
			return http.post(`/BatchExpense/Create`,data)
	},
}