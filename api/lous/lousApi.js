const http = uni.$u.http

export default {
	GetBycompanyId(companyId){
			return http.get(`/Lous/GetBycompanyId?companyId=${companyId}`)
	}
}