const http = uni.$u.http

export default {
	GetAllByCompanyIdAndType(Id,type) {
		return http.get(`/OperaRecord/GetAllByCompanyIdAndType?Id=${Id}&type=${type}`)
	},
	
	// 获取自营库存操作记录
	GetEmployOperaRecord(commodityId, startTime = null, endTime = null, pageIndex = 1, pageSize = 10) {
		let params = {
			commodityId,
			pageIndex,
			pageSize
		}
		if (startTime) {
			params.startTime = startTime
		}
		if (endTime) {
			params.endTime = endTime
		}
		return http.get('/Employ/GetEmployOperaRecord', { params })
	}
}