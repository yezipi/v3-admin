// 微语接口
import Request from '../utils/request'

export interface MoodListConfig {
  page?: number,
  size?: number,
}

export interface MoodSaveConfig {
  content?: string,
  view?: number,
  author_name?: string,
  comment_open?: boolean,
  status?: boolean
}

export default new class Mood extends Request {

  /**
   * 创建微语
   * @param { Object } params 参数
   * @param { String } params.content 内容
   * @param { String } params.author_name 来源
   * @param { String } params.comment_open 内容
   * @param { Boolean } params.status 显示隐藏
   * @param { Number } params.view 浏览数
   * @version 2021-11-05 zzc
   */
   public create(data: MoodSaveConfig) {
    const url = 'v1/mood'
    return this.post(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 删除微语
   * @param { String } id 微语id
   * @description 删除微语时把微语里面的图片删除
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/mood/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新微语
   * @param { String } id 文章id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: any, data: MoodSaveConfig) {
    const url = `v1/mood/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取微语详情
   * @param { String } id 文章id
   * @version 2021-11-05 zzc
   */
   public getDetail(id: any) {
    const url = `v1/mood/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 微语列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: MoodListConfig) {
    const url = 'v1/mood'
    return this.get(url, { ...params, loading: true })
  }
}