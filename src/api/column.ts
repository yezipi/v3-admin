// 栏目接口
import Request from '../utils/request'

type ColumnBaseConfig = {
  new_windows?: number,
  keywords?: string,
  description?: string,
  content?: string,
  status?: boolean,
}

export interface SubColumnSaveConfig extends ColumnBaseConfig {
  column_id: number,
  name: string,
  url: string,
}

export interface SubColumnUpdateConfig extends ColumnBaseConfig {
  name?: string,
  url?: string,
}

export default new class Column extends Request {

  /**
   * 创建二级栏目
   * @param { Object } data 用户名
   * @param { Number } data.column_id 一级栏目id
   * @param { String } data.name 栏目名称
   * @param { String } data.url 栏目路径
   * @param { Number } data.new_windows 是否新窗口打开
   * @param { Number } data.keywords 关键词
   * @param { Number } data.description 描述
   * @version 2021-10-21 zzc
   */
  public createSubcolumn(data: SubColumnSaveConfig) {
    const url = 'v1/admin/column/createSubcolumn'
    return this.post(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 删除二级栏目
   * @param { String } id 二级栏目id
   * @version 2021-10-21 zzc
   */
   public destorySubColumn(id: string) {
    const url = `v1/admin/column/createSubcolumn/${id}`
    return this.post(url, { loading: true, showMsg: true })
  }

  /**
   * 更新二级栏目
   * @param { String } id 二级栏目id
   * @param { Obejct } data 同创建的参数
   * @version 2021-10-21 zzc
   */
   public updateSubColumn(id: string, data?: SubColumnUpdateConfig) {
    const url = `v1/admin/column/updateSubColumn/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 更新一级栏目
   * @param { String } id 一级栏目id
   * @param { Obejct } data 同创建的参数
   * @version 2021-10-21 zzc
   */
   public updateColumn(id: string, data?: SubColumnUpdateConfig) {
    const url = `v1/admin/column/updateColumn/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 一级栏目详情
   * @param { String } id 一级栏目id
   * @version 2021-10-21 zzc
   */
   public getColumnDetail(id: string) {
    const url = `v1/admin/column/getColumnDetail/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 二级栏目详情
   * @param { String } id 二级栏目id
   * @version 2021-10-21 zzc
   */
   public getSubColumnDetail(id: string) {
    const url = `v1/admin/column/getSubColumnDetail/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 栏目列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-10-21 zzc
   */
   public getList(params?: { size?: number, page?: number }) {
    const url = 'v1/admin/column'
    return this.get(url, { ...params, loading: true })
  }
}