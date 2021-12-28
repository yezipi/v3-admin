// 用户接口
import Request from '../utils/request'

export interface UserBaseConfig {
  name: string,
  nickname: string,
  password?: string,
  status: boolean,
  role_id: any,
  avatar?: string
}

export default new class User extends Request {

  /**
   * 登陆
   * @param { String } data.name 用户名
   * @param { String } data.password 密码
   * @version 2021-10-10 zzc
   */
  public login(data: { name: string, password: string }) {
    const url = 'v1/user/login'
    return this.post(url, data)
  }

  /**
   * 创建用户， 只能创建非super角色
   * @param { Object } data 要更新的数据
   * @version 2021-11-25 zzc
   */
  public create(data: UserBaseConfig) {
    const url = 'v1/user'
    return this.post(url, { ...data, showMsg: true })
  }

  /**
   * 删除用户
   * @param { Number } id 用户id
   * @param { Object } data 要更新的数据
   * @version 2021-11-25 zzc
   */
   public destory(id: Number) {
    const url = `v1/user/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新用户
   * @param { Number } id 用户id
   * @param { Object } data 要更新的数据
   * @version 2021-11-25 zzc
   */
  public update(id: number, data: any) {
    const url = `v1/user/${id}`
    return this.put(url, { ...data, showMsg: true })
  }

  /**
   * 用户列表
   * @version 2021-10-19 zzc
   */
  public getList() {
    const url = 'v1/user'
    return this.get(url, { loading: true })
  }

  /**
   * 用户详情
   * @param { Number } id 用户id
   * @version 2021-11-25 zzc
   */
  public getDetail(id: number) {
    const url = `v1/user/${id}`
    return this.get(url)
  }

}