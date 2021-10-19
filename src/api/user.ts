// 用户接口
import Request from '../utils/request'

export default new class User extends Request {

  /**
   * 登陆
   * @param { String } data.name 用户名
   * @param { String } data.password 密码
   * @version 2021-10-10 zzc
   */
  public login(data: { name: string, password: string }) {
    const url = 'v1/admin/user/login'
    return this.post(url, data)
  }

  /**
   * 文章列表
   * @version 2021-10-19 zzc
   */
   public getList() {
    const url = 'v1/admin/user'
    return this.get(url, { loading: true })
  }
}