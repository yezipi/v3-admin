// 图片接口
import Request from '@/utils/request'

export interface PictureListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
  album_id?: any
}

export interface PictureSaveConfig {
  title: string,
  thumb_path: string,
  origin_path: string,
  description?: string,
  recommend?: boolean,
  status?: boolean,
  album_id: any,
  user_id?: any,
  showMsg?: boolean,
}

export default new class Picture extends Request {

  /**
   * 创建图片
   * @param { String } data.title 标题
   * @param { String } data.origin_path 原图路径
   * @param { String } data.thumb_path 缩略图路径
   * @param { String } data.album_id 相册id
   * @version 2011-12-01 zzc
   */
   public create(data: PictureSaveConfig) {
    const url = 'v1/picture'
    return this.post(url, { showMsg: true, ...data })
  }

  /**
   * 删除图片
   * @param { String } id 图片id
   * @description 删除图片时把图片封面删除
   * @version 2011-12-01 zzc
   */
   public destory(id: String) {
    const url = `v1/picture/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新图片
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2011-12-01 zzc
   */
   public update(id: string, data: PictureSaveConfig) {
    const url = `v1/picture/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取图片详情
   * @param { String } id id
   * @version 2011-12-01 zzc
   */
   public getDetail(id: string) {
    const url = `v1/picture/${id}`
    return this.get(url)
  }

  /**
   * 图片列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2011-12-01 zzc
   */
   public getList(params?: PictureListConfig) {
    const url = 'v1/picture'
    return this.get(url, { ...params, loading: true })
  }
}