const http = uni.$u.http

//报表接口
export default {
	rankByCompanyId(companyId) {
		return http.get(`/Rank/GetbyCompanyId?companyId=${companyId}&type=${1}`)
	},
	//简略获取公司下的代销批次（用于经营统计表）
	getBatchProfitSimpleByCompanyId(companyId){
		return http.get(`/Batch/GetCompanyBatchProfitSimple?companyId=${companyId}`)
	},
	//简略获取公司下的自营批次（用于经营统计表）
	getPurchaseEmployOrderProfitSimple(companyId){
		return http.get(`/PurchaseOrder/getPurchaseEmployOrderProfitSimple?companyId=${companyId}`)
	},
	//获取经验总表统计数据
	GetBusinessSummaryStatic(companyId,beiginTime,endTime){
		return http.get(`/Table/GetBusinessSummaryStatic?companyId=${companyId}&beginTime=${beiginTime}&endTime=${endTime}`)
	},
	//获取经验总表统计数据
	GetSingleAssistBatchInfoAndProfit(batchId){
		return http.get(`/Batch/GetSingleAssistBatchInfoAndProfit?batchId=${batchId}`)
	},
	//获取批次信息
	GetShipperBatchDTOById(batchId){
		return http.get(`/ShipperClient/GetShipperBatchDTOById?batchId=${batchId}`)
	}
}