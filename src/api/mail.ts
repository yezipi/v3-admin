// 消息接口
import Request from '@/utils/request'

export interface MailListConfig {
  page?: number,
  size?: number,
  loading?: boolean,
}

export interface MailSettingsConfig {
  host: string,
  port: string,
  send_nickname: string,
  send_mail: string,
  send_pwd: string,
  send_title: string,
  receive_mail: string,
  receive_title: string,
  receive_notice: boolean,
}

export default new class Mail extends Request {

    /**
   * 获取邮件设置
   * @version 2021-10-21 zzc
   */
     public getMailSettings() {
      const url = 'v1/mail/getMailSettings'
      return this.get(url, { loading: true })
    }

    /**
   * 保存邮件设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.send_nickname 发送者昵称
   * @param { String } data.host 邮件协议
   * @param { String } data.port 邮件端口
   * @param { String } data.send_mail 发送者邮箱账号
   * @param { String } data.send_pwd 发送者邮箱密码
   * @param { String } data.receive_mail 接受邮箱
   * @param { String } data.send_title 发送标题
   * @param { String } data.receive_title 接收者标题
   * @param { String } data.receive_notice 是否发送
   * @version 2021-10-29 zzc
   */
     public saveMailSettings(data: MailSettingsConfig) {
      const url = 'v1/mail/saveMailSettings'
      return this.put(url, { loading: true, ...data })
    }

  /**
   * 删除消息
   * @param { String } id 消息id
   * @version 2022-03-26 zzc
   */
  public destory(id: string) {
    const url = 'v1/mail'
    return this.delete(url, { loading: true, showMsg: true, id })
  }

  /**
   * 消息列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @version 2022-03-26 zzc
   */
  public getList(params?: MailListConfig) {
    const url = 'v1/mail'
    return this.get(url, params)
  }
}