export default {
	GetByCompanyId(companyId) {
		return uni.$u.http.get(`/CompanySetting/GetbyCompanyId?companyId=${companyId}`)
	},
	saveSetting(model){
		return uni.$u.http.post('/CompanySetting/SettingSave', model)
	}
}