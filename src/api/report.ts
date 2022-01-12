// 数据统计接口
import Request from '@/utils/request'

export interface ListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export default new class Tags extends Request {

  /**
   * 获取内容统计
   * @version 2022-01-11 zzc
   */
   public getTotalCount() {
    const url = 'v1/report/totalCount'
    return this.get(url)
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