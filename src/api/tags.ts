// 标签接口
import Request from '@/utils/request'

export interface TagsListConfig {
  page?: number,
  size?: number,
}

export default new class Tags extends Request {

  /**
   * 创建标签
   * @param { Object } params 参数
   * @param { String } params.name 内容
   * @version 2021-11-05 zzc
   */
   public create(data?: { name: string, sort: number }) {
    const url = 'v1/tags'
    return this.post(url, data)
  }

  /**
   * 删除标签
   * @param { String } id 标签id
   * @description 删除标签时把标签里面的图片删除
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/tags/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新标签
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: string, data: { content?: string, sort?: number }) {
    const url = `v1/tags/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取标签详情
   * @param { String } id id
   * @version 2021-11-05 zzc
   */
   public getDetail(id: string) {
    const url = `v1/tags/${id}`
    return this.get(url)
  }

  /**
   * 标签列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: tagsListConfig) {
    const url = 'v1/tags'
    return this.get(url, { ...params, loading: true })
  }
}