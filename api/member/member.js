const http = uni.$u.http

export default {
  memberCreate (data) {
    return http.post('/Customer/CreateOrUpdate', data)
  },
  memberImport (data) {
    return http.post('/merchant/member/import', data)
  },
  memberEdit (id, data) {
    return http.put(`/merchant/member/${id}`, data)
  },
  memberDelete (ids) {
    return http.get(`/Customer/DeleteIds?ids=${ids}`)
  },
  memberInfo (id) {
    return http.get(`/merchant/member/${id}`)
  },
  memberPage (params) {
    return http.get('/merchant/member/page', {params: params})
  },
  memberList (id) {
    return http.get(`/Customer/GetAllByCompanyId?Id=${id}`)
  },
  memberSearch (searchKey) {
    return http.get(`/merchant/gate/member/search?searchKey=${searchKey}`)
  },
  dashMemberTotal () {
    return http.get('/merchant/gate/member/total-dash')
  },
  GetAccountByCustomeId (id) {
    return http.get(`/Account/GetByCustomerIdv2?CustomerId=${id}`)
  },
  GetmemberByCustomeId (id) {
    return http.get(`/Customer/GetById?id=${id}`)
  },
  RepayDebts(data){
	   return http.post("/Customer/RepayDebts",data)
  },
  AddRepayMoney(data){
  	   return http.post("/Customer/AddRepayMoney",data)
  },
  RepayBasket(data){
  	   return http.post("/Customer/RepayBasket",data)
  },
  GetCustomerClientShareImage(id) {
    return http.get('https://zfprinter.top/test/api/Customer/GetCustomerClientShareImage', {
      params: { customerId: id } // GET 参数自动拼接到 URL
    });
  }
}