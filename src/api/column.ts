// 栏目接口
import Request from '../utils/request'

export interface ColumnSaveConfig {
  name: string;
  url: string;
  type: string;
  new_window: boolean;
  status: boolean;
  sort: number;
  keywords: string;
  description: string;
  content?: string;
  column_id: undefined;
  can_delete: boolean
}

export interface ColumnUpdateConfig {
  name?: string,
  url?: string,
  sort?: number,
  column_id?: number | undefined,
  new_windows?: number,
  keywords?: string,
  description?: string,
  content?: string,
  status?: boolean,
  type?: string;
  can_delete?: boolean
}

export default new class Column extends Request {

  /**
   * 创建一级级栏目
   * @param { Object } data 用户名
   * @param { String } data.name 栏目名称
   * @param { String } data.url 栏目路径
   * @param { Number } data.new_windows 是否新窗口打开
   * @param { Number } data.keywords 关键词
   * @param { Number } data.description 描述
   * @version 2021-10-21 zzc
   */
  public createColumn(data: ColumnSaveConfig) {
    const url = 'v1/column/createColumn'
    return this.post(url, { ...data, loading: true, showMsg: true })
  }

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
   public createSubColumn(data: ColumnSaveConfig) {
    const url = 'v1/column/createSubcolumn'
    return this.post(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 删除一级栏目
   * @param { String } id 一级栏目id
   * @version 2021-11-25 zzc
   */
   public destoryColumn(id: any) {
    const url = `v1/column/destoryColumn/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 删除二级栏目
   * @param { String } id 二级栏目id
   * @version 2021-10-21 zzc
   */
   public destorySubColumn(id: any) {
    const url = `v1/column/destorySubColumn/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新二级栏目
   * @param { String } id 二级栏目id
   * @param { Obejct } data 同创建的参数
   * @version 2021-10-21 zzc
   */
   public updateSubColumn(id: any, data?: ColumnUpdateConfig) {
    const url = `v1/column/updateSubColumn/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 更新一级栏目
   * @param { String } id 一级栏目id
   * @param { Obejct } data 同创建的参数
   * @version 2021-10-21 zzc
   */
   public updateColumn(id: any, data?: ColumnUpdateConfig) {
    const url = `v1/column/updateColumn/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 一级栏目详情
   * @param { String } id 一级栏目id
   * @version 2021-10-21 zzc
   */
   public getColumnDetail(id: any) {
    const url = `v1/column/getColumnDetail/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 二级栏目详情
   * @param { String } id 二级栏目id
   * @param { Boolean } loading 是否loading
   * @version 2021-10-21 zzc
   */
   public getSubColumnDetail(id: any, loading?: boolean) {
    const url = `v1/column/getSubColumnDetail/${id}`
    return this.get(url, { loading })
  }

  /**
   * 栏目列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-10-21 zzc
   */
   public getList(params?: { size?: number, page?: number }) {
    const url = 'v1/column'
    return this.get(url, { ...params })
  }

  /**
   * 二级栏目列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @param { String } params.type 类型，只有article和case才可以新建分类
   * @version 2021-10-21 zzc
   */
  public getSubList(params?: { size?: number, page?: number, type: string }) {
    const url = 'v1/subColumn'
    return this.get(url, { ...params })
  }
}