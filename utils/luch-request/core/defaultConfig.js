export default  {
  baseUrl: '',
  header: {},
  method: 'GET',
  dataType: 'json',
  hideLoading: false, //增加自定义隐藏loading
  // #ifndef MP-ALIPAY || APP-PLUS
  responseType: 'text',
  // #endif
  custom: {},
  // #ifdef MP-ALIPAY || MP-WEIXIN
  timeout: 30000,
  // #endif
  // #ifdef APP-PLUS
  sslVerify: true,
  // #endif
  // #ifdef H5
  withCredentials: false
  // #endif
}
