const http = uni.$u.http

export default {
	createExpenseLabel(data){
			return http.post("/ExpenseLabel/Create",data)
	},
	deleteExpenseLabel(id){
			return http.get(`/ExpenseLabel/Delete?id=${id}`)
	},
	GetExpenseLabel(companyId,labelType){
			return http.get(`/ExpenseLabel/GetBycompanyId?companyId=${companyId}&labelType=${labelType}`)
	},
	createCompanyUnit(data){
		return http.post("/CompanyUnit/Create",data)
},
deleteCompanyUnit(id){
		return http.get(`/CompanyUnit/Delete?id=${id}`)
},
GetCompanyUnit(companyId){
		return http.get(`/CompanyUnit/GetBycompanyId?companyId=${companyId}`)
}
}