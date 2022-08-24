// 轮播图接口
import Request from '@/utils/request'

export interface BannerListConfig {
  page?: number,
  size?: number,
}

export interface BannerCreateConfig {
  name: string,
  cover: string,
  type: number,
  target: any,
  sort: number,
  status: number,
  url: any
}

export interface BannerUpdateConfig {
  name?: string,
  cover?: string,
  type?: number,
  target?: any,
  sort?: number,
  status?: number,
  url?: any
}

export default new class Banner extends Request {

  /**
   * 创建标签
   * @param { Object } data 参数
   * @version 2021-11-05 zzc
   */
   public create(data: BannerCreateConfig) {
    const url = 'v1/banner'
    return this.post(url, data)
  }

  /**
   * 删除标签
   * @param { String } id 标签id
   * @description 删除标签时把标签里面的图片删除
   * @version 2021-11-05 zzc
   */
   public destory(id: string) {
    const url = `v1/banner/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新标签
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2021-11-05 zzc
   */
   public update(id: string, data: BannerUpdateConfig) {
    const url = `v1/banner/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取标签详情
   * @param { String } id id
   * @version 2021-11-05 zzc
   */
   public getDetail(id: string) {
    const url = `v1/banner/${id}`
    return this.get(url)
  }

  /**
   * 标签列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-11-05 zzc
   */
   public getList(params?: BannerListConfig) {
    const url = 'v1/banner'
    return this.get(url, params)
  }
}