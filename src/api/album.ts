// 相册接口
import Request from '@/utils/request'

export interface AlbumListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export interface AlbumSaveConfig {
  title: string,
  cover: string,
  description: string,
  open_comment: boolean,
  recommend: boolean,
  status: boolean,
  password: string,
  lock: boolean,
  user_id?: any
}

export default new class Album extends Request {

  /**
   * 创建相册
   * @param { Object } params 参数
   * @param { String } params.title 标题
   * @param { String } params.cover 封面
   * @version 2011-11-29 zzc
   */
   public create(data: AlbumSaveConfig) {
    const url = 'v1/album'
    return this.post(url, data)
  }

  /**
   * 删除相册
   * @param { String } id 相册id
   * @description 删除相册时把相册封面删除
   * @version 2011-11-29 zzc
   */
   public destory(id: String) {
    const url = `v1/album/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新相册
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2011-11-29 zzc
   */
   public update(id: string, data: AlbumSaveConfig) {
    const url = `v1/album/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取相册详情
   * @param { String } id id
   * @version 2011-11-29 zzc
   */
   public getDetail(id: string) {
    const url = `v1/album/${id}`
    return this.get(url)
  }

  /**
   * 相册列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2011-11-29 zzc
   */
   public getList(params?: AlbumListConfig) {
    const url = 'v1/album'
    return this.get(url, { ...params, loading: true })
  }
}