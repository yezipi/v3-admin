// 数据统计接口
import Request from '@/utils/request'
import Store from '@/store/index'

export interface ListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export default new class Tags extends Request {

  /**
   * 获取百度accen_token
   * @param { Boolean } refresh 是否重新获取token
   * @version 2022-01-13 zzc
   */
  public getBaiduToken(refresh: boolean) {
    const url = 'v1/report/getBaiduToken'
    return this.post(url, { refresh, loading: true })
  }

  /**
   * 获取百度省份统计
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-01-12 zzc
   */
  public getBaiduDistrictReport(startDate: string, endDate: string) {
    const url = 'v1/report/baiduDistrictReport'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取百度每日访问统计
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-01-12 zzc
   */
   public getBaiduDayReport(startDate: string, endDate: string) {
    const url = 'v1/report/baiduDayReport'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取百度关键词统计
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-01-12 zzc
   */
  public getBaiduKeywordReport(startDate: string, endDate: string) {
    const url = 'v1/report/baiduKeywordReport'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取百度页面统计
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-01-12 zzc
   */
  public getBaiduPageReport(startDate: string, endDate: string) {
    const url = 'v1/report/baiduPageReport'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取内容统计
   * @version 2022-01-11 zzc
   */
  public getTotalCount() {
    const url = 'v1/report/totalCount'
    return this.get(url)
  }

  /**
   * 未审核内容
   * @version 2022-01-14 zzc
   */
  public async getUnAudit() {
    const url = 'v1/report/unAudit'
    const { data } = await this.get(url)
    Store.commit('updateMsgData', data)
    return {
      count: data.count,
      data: data.data
    }
  }

  /**
   * 获取操作日志
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2022-01-11 zzc
   */
  public getOperationLogs(params: ListConfig) {
    const url = 'v1/report/operationLogs'
    return this.get(url, params)
  }
}