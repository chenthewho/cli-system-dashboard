const http = uni.$u.http

export default {
	getCurrentOperater(companyId,operatorId){
		return http.get(`/schedule/getCurrentOperater?companyId=${companyId}&operatorId=${operatorId}`)
	},
	addDuty(companyId,operatorId){
		return http.get(`/schedule/addDuty?companyId=${companyId}&operatorId=${operatorId}`)
	},
	getDutyStatic(dutyId){
		return http.get(`/schedule/getDutyStatic?dutyId=${dutyId}`)
	},
	getDutyDebtOrder(dutyId){
		return http.get(`/schedule/getDutyDebtOrder?dutyId=${dutyId}`)
	},
	getDutyRepayOrder(dutyId){
		return http.get(`/schedule/getDutyRepayOrder?dutyId=${dutyId}`)
	},
	GetExpenseAccoutByDutyandType(dutyId,type){
		return http.get(`/Static/GetExpenseAccoutByDutyandType?dutyId=${dutyId}&type=${type}`)
	},
	changeDuty(companyId,operatorId){
		return http.get(`/schedule/changeDuty?companyId=${companyId}&operatorId=${operatorId}`)
	},
	addReservefundRecord(data){
		return http.post(`/schedule/addReservefundRecord`,data)
	},
	getReservefundRecordByDutyId(dutyId){
		return http.get(`/schedule/getReservefundRecordByDutyId?dutyId=${dutyId}`)
	},
	AddDutySpendCost(data){
		return http.post(`/DutySpend/AddDutySpendCost`,data)
	},
	getSpendCostByDutyId(dutyId){
		return http.get(`/DutySpend/getDutySpendCostByDutyId?dutyId=${dutyId}`)
	},
	// 根据公司ID和时间范围获取费用支出
	getDutySpendCostByCompanyIdAndTimeRange(companyId, startTime, endTime){
		return http.get(`/DutySpend/getDutySpendCostByCompanyIdAndTimeRange?companyId=${companyId}&startTime=${startTime}&endTime=${endTime}`)
	}
}