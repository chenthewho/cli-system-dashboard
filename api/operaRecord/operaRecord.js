const http = uni.$u.http

export default {
	GetAllByCompanyIdAndType(Id,type) {
		return http.get(`/OperaRecord/GetAllByCompanyIdAndType?Id=${Id}&type=${type}`)
	}
}