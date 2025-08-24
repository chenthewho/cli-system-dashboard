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
	}
}