export default {
	getByCompanyIdAssistShipperManger(companyId,pageSize,currentPage) {
		return uni.$u.http.get(`/Shipper/GetByCompanyIdAssistShipperManger?companyId=${companyId}&pageSize=${pageSize}&currentPage=${currentPage}`)
	},
    getAssistShipperMangerInfo(shipperId) {
		return uni.$u.http.get(`/Shipper/GetAssistShipperMangerInfo?shipperId=${shipperId}`)
	},
    getByCompanyIdEmployShipperManger(companyId,pageSize,currentPage) {
		return uni.$u.http.get(`/Shipper/GetByCompanyIdEmployShipperManger?companyId=${companyId}&pageSize=${pageSize}&currentPage=${currentPage}`)
	},
	getEmployShipperMangerInfo(shipperId) {
		return uni.$u.http.get(`/Shipper/GetEmployShipperMangerInfo?shipperId=${shipperId}`)
	},
	// 获取货主付款记录
	getPaidRecordsByShipperId(shipperId) {
		return uni.$u.http.get(`/ShipperPaidRecord/GetByShipperId?shipperId=${shipperId}`)
	},
	// 创建货主付款记录
	createShipperPaidRecord(record) {
		return uni.$u.http.post(`/ShipperPaidRecord/Create`, record)
	},
	// 删除货主付款记录（软删除）
	deleteShipperPaidRecord(id) {
		return uni.$u.http.get(`/ShipperPaidRecord/Delete?id=${id}`)
	}
}