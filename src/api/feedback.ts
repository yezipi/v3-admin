// 留言接口
import Request from '../utils/request'
import { CommentSaveConfig, CommentUpdateConfig } from './comment'

export interface CommentListConfig {
  page?: number,
  size?: number,
}

export default new class Feedback extends Request {

 /**
   * 客户端创建留言
   * @param { Object } params 参数
   * @param { String } params.article_id 上级id,必须
   * @param { String } params.type 留言类型
   * @param { String } params.nickname 昵称
   * @param { String } params.content 内容
   * @version 2021-11-05 zzc
   */
   public create(data: CommentSaveConfig) {
    const url = 'v1/feedback'
    return this.post(url, data)
  }

  /**
   * 删除留言
   * @param { String } id 留言id
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/feedback/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新留言
   * @param { String } id 留言id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: string, data: CommentUpdateConfig) {
    const url = `v1/feedback/${id}`
    return this.put(url, { ...data, showMsg: true })
  }

  /**
   * 获取留言详情
   * @param { String } id 留言id
   * @version 2021-11-05 zzc
   */
   public getDetail(id: string) {
    const url = `v1/feedback/${id}`
    return this.get(url)
  }

  /**
   * 留言列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: CommentListConfig) {
    const url = 'v1/feedback'
    return this.get(url, params)
  }
}