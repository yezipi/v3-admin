// 消息接口
import Request from '@/utils/request'
import Store from '@/store/index'

export interface MessageListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export default new class Message extends Request {

  /**
   * 删除消息
   * @param { String } id 消息id
   * @version 2022-03-26 zzc
   */
  public destory(id: string) {
    const url = `v1/message/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新消息
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2022-03-26 zzc
   */
  public update(id: string, data: { name?: string, sort?: number }) {
    const url = `v1/message/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取消息详情
   * @param { String } id id
   * @version 2022-03-26 zzc
   */
  public getDetail(id: string) {
    const url = `v1/message/${id}`
    return this.get(url)
  }

  /**
   * 消息列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2022-03-26 zzc
   */
  public getList(params?: MessageListConfig) {
    const url = 'v1/message'
    return this.get(url, params)
  }

  /**
   * 未读消息
   * @version 2022-03-26 zzc
   */
  public async getUnRead() {
    const url = 'v1/unReadMessage'
    const { data } =  await this.get(url)
    Store.commit('updateMsg', data)
  }

  /**
   * 获取消息详情
   * @param { String } id id
   * @version 2022-03-26 zzc
   */
  public setRead(id: string) {
    const url = 'v1/setReadMessage'
    return this.post(url, { loading: true, showMsg: true, id })
  }
}