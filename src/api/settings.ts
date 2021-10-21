// 设置接口
import Request from '../utils/request'

export default new class Settings extends Request {

  /**
   * 获取基本设置
   * @version 2021-10-21 zzc
   */
   public getBaseSettings() {
    const url = 'v1/admin/settings/getBaseSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 获取邮件设置
   * @version 2021-10-21 zzc
   */
   public getMailSettings() {
    const url = 'v1/admin/settings/getMailSettings'
    return this.get(url, { loading: true })
  }
}