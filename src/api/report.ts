// 数据统计接口
import Request from '@/utils/request'

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
   * 获取百度实时访客
   * @param { String } params.startDate 开始时间
   * @param { String } params.endDate 结束时间
   * @version 2022-02-21 zzc
   */
   public getBaiduVisitors(params: { startDate?: string, endDate?: string, page?: number, size?: number }) {
    const url = 'v1/report/baiduVisitors'
    return this.get(url, params)
  }

  /**
   * 获取百度区域
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-08-26 zzc
   */
  public getBaiduArea(startDate: string, endDate: string) {
    const url = 'v1/report/baiduArea'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取百度统计趋势
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-08-26 zzc
   */
  public getBaiduOverview(startDate: string, endDate: string) {
    const url = 'v1/report/baiduOverview'
    return this.get(url, { startDate, endDate })
  }

  /**
   * 获取百度搜索引擎
   * @param { String } startDate 开始时间
   * @param { String } endDate 结束时间
   * @version 2022-08-26 zzc
   */
  public getBaiduEngine(startDate: string, endDate: string) {
    const url = 'v1/report/baiduEngine'
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