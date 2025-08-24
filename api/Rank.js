const http = uni.$u.http

export default {
	rankByCompanyId(companyId) {
		return http.get(`/Rank/GetbyCompanyId?companyId=${companyId}&type=${1}`)
	}
}