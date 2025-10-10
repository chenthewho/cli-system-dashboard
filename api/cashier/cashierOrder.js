const http = uni.$u.http

export default {
	cashierOrderCompute(param) {
		return http.post('/merchant/cashier/order/compute', param)
	},
	cashierOrderConfirm(param) {
		return http.post('/merchant/cashier/order/confirm', param)
	},
	cashierOrderPay(param) {
		return http.post('/merchant/cashier/order/pay', param)
	},
	cashierOrderPayResult(id) {
		return http.get(`/merchant/cashier/order/pay/${id}`)
	},
	cashierOrderInfo(id) {
		return http.get(`/merchant/cashier/order/${id}`)
	},
	cashierOrderPage(params) {
		return http.get('/merchant/cashier/order/page', { params: params })
	},
	CreateAccount(data){
		return http.get(`/Account/Create2?data=${data}`)
	},
	ModifyAccount(data){
		return http.post(`/Account/ModifyOrder`,data)
	},
	TuigeAccount(data){
		return http.post(`/Account/TuigeOrder`,data)
	},
	CreateGD(data){
		return http.get(`/Account/GDcreate?data=${data}`)
	},
	getOrderBycompanyId(companyId){
		return http.get(`/Order/GetOrderDTOByCompanyId?Id=${companyId}`)
	},
	getOrderBycompanyIdandDate(companyId,time){
		return http.get(`/Order/GetOrderDTOByDate?Id=${companyId}&dateTime=${time}`)
	},
	GetAccountByCompanyIdandDateRange(companyId,startDate,endDate){
		return http.get(`/Order/GetAccountByCompanyIdandDateRange?Id=${companyId}&startTime=${startDate}&endTime=${endDate}`) 
	},
	getOrderBycompanyIdandMonth(companyId,time){
		return http.get(`/Order/GetOrderByMonth?Id=${companyId}&dateTime=${time}`)
	},
	GetAllGDorder(data){
		return http.get(`/Account/GetAllGDorder?CompanyId=${data}`)
	},
	GetOrderByAccountId(Id){
		return http.get(`/Order/GetOrderByAccountId?Id=${Id}`)
	},
	GetLastAccountCompanyId(data){
		return http.get(`/Account/GetLastAccountCompanyId?CompanyId=${data}`)
	},
	getStoreInfo(id) {
		return http.get(`/Company/GetById?id=${id}`)
	},
	updateStoreInfo(company) {
		return http.post('/Company/Update',company)
	},
	CheckupdateInfo() {
		return http.get('/Update/GetUpdateInfo')
	},
	deleteOrder(data) {
		return http.post(`/Account/DeleteOrder`,data)
	},
	destoryOrder(data){
		return http.post(`/Account/DestoryOrder`,data)
	},
	exchangMember(data){
		return http.post(`/Account/UpdateAccountCustomer`,data)
	},
	GetCanvasBase64ById(accountId){
		return http.get(`/Account/GetCanvasById?accountId=${accountId}`)
	},
	GetOriginOrderId(originOrderId,orderId){
		return http.get(`/Order/GetOriginOrderId?originOrderId=${originOrderId}&orderId=${orderId}`)
	},
	GetOrderByOrderIdList(data){
		return http.post(`/Order/GetOrderByOrderIdList`,data)
	}
}