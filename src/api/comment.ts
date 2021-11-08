// 评论接口
import Request from '../utils/request'

export interface CommentListConfig {
  page?: number,
  size?: number,
}

export interface CommentSaveConfig {
  article_id: string,
  type: string,
  nickname: string,
  content: string,
  email?:string,
}

export default new class Comment extends Request {

 /**
   * 客户端创建评论
   * @param { Object } params 参数
   * @param { String } params.article_id 上级id,必须
   * @param { String } params.type 评论类型
   * @param { String } params.nickname 昵称
   * @param { String } params.content 内容
   * @version 2021-11-05 zzc
   */
   public create(data?: CommentSaveConfig) {
    const url = 'v1/client/comment'
    return this.post(url, { ...data, loading: true })
  }

  /**
   * 删除评论
   * @param { String } id 评论id
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/admin/comment/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新评论
   * @param { String } id 文章id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: string, data?: { content: string }) {
    const url = `v1/admin/comment/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取评论详情
   * @param { String } id 文章id
   * @version 2021-11-05 zzc
   */
   public detail(id: string) {
    const url = `v1/admin/comment/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 评论列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: CommentListConfig) {
    const url = 'v1/admin/comment'
    return this.get(url, { ...params, loading: true })
  }
}