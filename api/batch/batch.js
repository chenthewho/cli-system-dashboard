const http = uni.$u.http

export default {
	getBatchInfoById(id) {
		return http.get(`/Batch/GetById?Id=${id}`)
	},
	deleteBatchById(id) {
		return http.get(`/Batch/Delete?Id=${id}`)
	},
	createBatchType2(data) {
		return http.post(`/Batch/CreateBatchType2`,data)
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
	//货品单个批次信息
	GetSingleAssistBatchInfoAndProfit(batchId) {
		return http.get(`/Batch/GetSingleAssistBatchInfoAndProfit?batchId=${batchId}`)
	},
	//获取单个批次信息(未结算货品)
	GetUnsettleAssistBatchInfoAsync(batchId){
		return http.get(`/Batch/GetUnsettleAssistBatchInfoAsync?batchId=${batchId}`);
	},
	UpdateBatchAssist(data){
		return http.post(`/Batch/UpdateBatchAssist`,data)
	},
	//设置代卖单价
	UpdateBatchSettleAmountSetting(data){
		return http.post(`/Batch/BatchSettleAmountSetting`,data)
	},
	GetBatchModifyRecord(batchId) {
		return http.get(`/Batch/GetBatchModifyRecord?batchId=${batchId}`)
	},
	//获取批次货品的售出记录
	GetPurchaseAssistGoodById(purchaseAssistId) {
		return http.get(`/Batch/GetPurchaseAssistGoodById?purchaseAssistId=${purchaseAssistId}`)
	},
	//批次结算操作
	BatchSettleAction(data) {
		return http.post(`/Batch/BatchSettleAction`,data)
	},
	//获取批次结算记录
	GetSettleRecordsByBatchIdWithJoin(batchId) {
		return http.get(`/Batch/GetSettleRecordsByBatchIdWithJoin?batchId=${batchId}`)
	},
	//获取批次结算记录
	GetSettleRecordById(settleRecordId) {
		return http.get(`/Batch/GetSettleRecordById?settleRecordId=${settleRecordId}`)
	},
	//取消批次结算
	CancelBatchSettle(settleRecordId) {
		return http.get(`/Batch/CancelSettleRecord?recordId=${settleRecordId}`)
	},
	//添加未结算费用
	AddBatchExpense(data) {
		return http.post(`/BatchExpense/AddBatchExpense`,data)
	},
	CancelBatchExpense(data){
		return http.post(`/BatchExpense/CancelBatchExpense`,data)
	},
	GetByShipper(shipperId){
		return http.get(`/Batch/GetByShipperId?shipperId=${shipperId}`)
	},
	//获取货主未付款批次列表
	GetUnpaidBatchListByShipper(shipperId){
		return http.get(`/Batch/GetUnpaidBatchListByShipper?shipperId=${shipperId}`)
	},
	// 根据批次ID获取所有结算记录的汇总内容
	GetAllSettleRecordContentByBatchId(batchId){
		return http.get(`/Batch/GetAllSettleRecordContentByBatchId?batchId=${batchId}`)
	}
}