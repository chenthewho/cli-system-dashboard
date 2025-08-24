const http = uni.$u.http

export default {
	createExpense(data){
		return http.post(`/BatchExpense/Create`,data)
	},
	getAllExpenseByBatchId(batchId){
		return http.get(`/BatchExpense/GetByBatchId?batchId=${batchId}`)
	},
	deleteByBatchId(batchId){
			return http.get(`/BatchExpense/DeleteAll?batchId=${batchId}`)
	},
	createListExpense(data){
			return http.post(`/BatchExpense/Create`,data)
	},
}