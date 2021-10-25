import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from '../store'
import config from '../config'
import { message } from 'ant-design-vue';

// interface resConfig extends AxiosResponse<any> {
//   rows?: [],
//   count?: number,
// }

axios.defaults.timeout = 30000
axios.defaults.baseURL = config.REQ_URL
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers.common.Authorization = store.state.token;
  const { params, data } = config
  if (config.method) {
    const paramsLoading = params && params.loading
    const dataLoading = data && data.loading
    if (paramsLoading || dataLoading) {
      store.commit('showLoading')
    }
  }
  return config;
}, (error: AxiosError) => {
  store.commit('hideLoading')
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use((response: AxiosResponse) => {
  const res = response.data
  const { params, data } = response.config
  const { code, msg } = res
  const dataLoading = data && typeof data === 'string' && data.indexOf('loading') > -1
  const paramsLoading = params && params.loading

  if (dataLoading || paramsLoading) {
    store.commit('hideLoading')
  }

  if (code === 401) {
    alert('请重新授权')
    store.dispatch('resetUser')
    location.replace(location.href)
    return Promise.reject(res)
  }

  if (code !== 1) {
    message.error(msg)
    return Promise.reject(res)
  }

  // console.log(response)

  if (data && data.indexOf('showMsg') > -1) {
    message.success(msg)
  }

  return res
}, (error: AxiosError) => {
  const str = error.toString()
  const errMsg = str.indexOf('timeout') > 0 ? '请求超时，请刷新后重试！' : str
  message.error(errMsg)
  store.commit('hideLoading')
  return Promise.reject(error)
})

/**
 * @name request请求
 * @author 2020-4-30 zzc
 */
export default class {

  get = (url: string, query?: object) =>  axios.get(url, { params: query })
  post = (url: string, data: any, config?: AxiosRequestConfig) =>  axios.post(url, data, config)
  put = (url: string, data?: object) =>  axios.put(url, data)
  delete = (url: string, data?: object) =>  axios.delete(url, { params: data })

}
