import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from '../store'
import config from '../config'
import router from '../router'
import { message } from 'ant-design-vue';

// interface resConfig extends AxiosResponse<any> {
//   rows?: [],
//   count?: number,
// }

axios.defaults.timeout = 30000
axios.defaults.baseURL = '/api/admin/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const headers: any = config.headers
  const { params, data } = config
  headers.common.Authorization = store.state.token;
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
  if (!response.data) {
    return response
  }
  const res = response.data
  const { params, data, method } = response.config
  const { code, msg } = res
  const dataLoading = typeof data === 'string' ? (data && data.indexOf('loading') > -1) : false
  const paramsLoading = params && params.loading
  const showMsg = (data && typeof data === 'string' && data.indexOf('showMsg') > -1) || res && res.msg && params && params.showMsg

  if (dataLoading || paramsLoading) {
    store.commit('hideLoading')
  }

  if (code === 401) {
    message.error('请重新登录')
    store.dispatch('clearUser')
    router.replace({
      name: 'Login',
      query: {
        referrer: router.currentRoute.value.name as any
      }
    })
    return Promise.reject(res)
  }

  if (code !== 1) {
    if (method !== 'get') {
      message.error(msg)
    }
    return Promise.reject(res)
  }

  if (showMsg) {
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
 * request请求
 */
export default class Request {

  // get = (url: string, query?: object) =>  axios.get(url, { params: query })
  // post = (url: string, data: any, config?: AxiosRequestConfig) =>  axios.post(url, data, config)
  // put = (url: string, data?: object) =>  axios.put(url, data)
  // delete = (url: string, data?: object) =>  axios.delete(url, { params: data })

  /**
   * get请求
   * @param { String } url 接口地址
   * @param { Object } query 参数
   */
   get(url: string, query?: object) {
     return axios.get(url, { params: query })
   }

   /**
   * post请求
   * @param { String } url 接口地址
   * @param { Object } data 参数
   */
    post(url: string, data: any, config?: AxiosRequestConfig) {
      return axios.post(url, data, config)
    }

  /**
   * put请求
   * @param { String } url 接口地址
   * @param { Object } data 参数
   */
   put(url: string, data?: object) {
    return axios.put(url, data)
  }

  /**
   * delete请求
   * @param { String } url 接口地址
   * @param { Object } data 参数
   */
   delete(url: string, data?: object) {
    return axios.delete(url, { params: data })
  }
   

}
