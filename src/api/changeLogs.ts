// 标签接口
import Request from '@/utils/request'

export interface ChangeLogsListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export default new class ChangeLogs extends Request {

  /**
   * 创建标签
   * @param { Object } params 参数
   * @param { String } params.content 内容
   * @param { String } params.type 类型，fix, update, add, remove
   * @version 2021-11-05 zzc
   */
   public create(data: { content: string, type: string }) {
    const url = 'v1/changeLogs'
    return this.post(url, { ...data, showMsg: true })
  }

  /**
   * 删除标签
   * @param { String } id 标签id
   * @description 删除标签时把标签里面的图片删除
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/changeLogs/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新标签
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: string, data: { content?: string, type?: string }) {
    const url = `v1/changeLogs/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取标签详情
   * @param { String } id id
   * @version 2021-11-05 zzc
   */
   public getDetail(id: string) {
    const url = `v1/changeLogs/${id}`
    return this.get(url)
  }

  /**
   * 标签列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: ChangeLogsListConfig) {
    const url = 'v1/changeLogs'
    return this.get(url, { ...params, loading: true })
  }
}