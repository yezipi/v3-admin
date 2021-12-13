// 角色接口
import Request from '@/utils/request'

export interface RoleListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export interface RoleUpdateConfig {
  name?: string,
  type?: string,
  permissions: any,
  loading?: boolean,
}

export default new class Role extends Request {


  /**
   * 更新角色
   * @param { String } id id
   * @param { Obejct } data 同创建的参数
   * @version 2021-12-13 zzc
   */
   public update(id: string, data: RoleUpdateConfig) {
    const url = `v1/role/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取角色详情
   * @param { String } id id
   * @version 2021-12-13 zzc
   */
   public getDetail(id: string) {
    const url = `v1/role/${id}`
    return this.get(url)
  }

  /**
   * 角色列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2021-12-13 zzc
   */
   public getList(params?: RoleListConfig) {
    const url = 'v1/role'
    return this.get(url, { ...params, loading: true })
  }
}