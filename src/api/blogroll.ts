// 友链接口
import Request from '@/utils/request'
import { CommentSaveConfig, CommentUpdateConfig } from './comment'
export interface BlogrollListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export default new class Blogroll extends Request {

  /**
   * 创建友链
   * @param { Object } params 参数
   * @param { String } params.name 内容
   * @version 2021-12-02 zzc
   */
   public create(data: CommentSaveConfig) {
    const url = 'v1/blogroll'
    return this.post(url, { ...data, showMsg: true })
  }

  /**
   * 删除友链
   * @param { String } id 友链id
   * @description 删除友链时把友链里面的图片删除
   * @version 2021-12-02 zzc
   */
   public destory(id: string) {
    const url = `v1/blogroll/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新友链
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2021-12-02 zzc
   */
   public update(id: string, data: CommentUpdateConfig) {
    const url = `v1/blogroll/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取友链详情
   * @param { String } id id
   * @version 2021-12-02 zzc
   */
   public getDetail(id: string) {
    const url = `v1/blogroll/${id}`
    return this.get(url)
  }

  /**
   * 友链列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-12-02 zzc
   */
   public getList(params?: BlogrollListConfig) {
    const url = 'v1/blogroll'
    return this.get(url, { ...params, loading: true })
  }
}