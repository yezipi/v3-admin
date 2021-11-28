// 设置接口
import Request from '../utils/request'

export interface BaseSettingsConfig {
  web_name: string,
  web_sign: string,
  web_slogan: string,
  web_title: string,
  web_url: string,
  web_beian: string,
  web_mail: string,
  web_version: string,
  web_keywords: string,
  web_description: string,
  web_date: any,
  web_tongji: string,
  web_copyright: string,
  open_comment: boolean,
  web_avatar: string,
  web_logo: string,
  web_like: number,
}

export interface MailSettingsConfig {
  hosts: string,
  port: string,
  send_nickname: string,
  send_mail: string,
  send_pwd: string,
  send_title: string,
  receive_mail: string,
  receive_title: string,
  receive_notice: boolean,
}

export interface AdSettingsConfig {
  banner: string,
  aside: string,
  float: string,
  status: boolean,
}

export interface PersonalizeSettingsConfig {
  style: string,
  font: string,
  bg: string,
  current: string,
  auto: boolean,
}

export interface SecuritySettingsConfig {
  black_ip: string,
}

export default new class Settings extends Request {

  /**
   * 获取基本设置
   * @version 2021-10-21 zzc
   */
   public getBaseSettings() {
    const url = 'v1/settings/getBaseSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 获取邮件设置
   * @version 2021-10-21 zzc
   */
   public getMailSettings() {
    const url = 'v1/settings/getMailSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 获取广告设置
   * @version 2021-10-30 zzc
   */
   public getAdSettings() {
    const url = 'v1/settings/getAdSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 获取个性化设置
   * @version 2021-10-30 zzc
   */
   public getPersonalizeSettings() {
    const url = 'v1/settings/getPersonalizeSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 获取安全设置
   * @version 2021-10-30 zzc
   */
   public getSecuritySettings() {
    const url = 'v1/settings/getSecuritySettings'
    return this.get(url, { loading: true })
  }

  /**
   * 保存基本设置
   * @param { Object } data 基本设置参数
   * @param { String } data.web_name 网站名称
   * @param { String } data.web_sign 网站签名
   * @param { String } data.web_slogan 网站标语
   * @param { String } data.web_title 网站标题
   * @param { String } data.web_url 网站地址
   * @param { String } data.web_beian 网站备案
   * @param { String } data.web_mail 网站邮箱
   * @param { String } data.web_version 网站版本
   * @param { String } data.web_keywords 网站关键字
   * @param { String } data.web_description 网站描述
   * @param { String } data.web_date 网站日期
   * @param { String } data.web_tongji 网站统计代码
   * @param { String } data.web_copyright 网站版权
   * @param { String } data.open_comment 评论总开关
   * @param { String } data.web_avatar 网站头像
   * @param { String } data.web_logo 网站logo
   * @param { String } data.web_like 网站点赞
   * @version 2021-10-29 zzc
   */
   public saveBaseSettings(data: BaseSettingsConfig) {
    const url = 'v1/settings/saveBaseSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 保存邮件设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.send_nickname 发送者昵称
   * @param { String } data.hosts 邮件协议
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
    const url = 'v1/settings/saveMailSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 保存广告设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.banner banner广告
   * @param { String } data.aside 侧边栏广告
   * @param { String } data.float 悬浮广告
   * @param { Boolean } data.status 状态显示
   * @version 2021-10-30 zzc
   */
   public saveAdSettings(data: AdSettingsConfig) {
    const url = 'v1/settings/saveAdSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 保存个性化设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.style banner风格样式
   * @param { String } data.font 字体
   * @param { String } data.bg 背景图片数组
   * @param { String } data.current 当前前背景
   * @param { Boolean } data.auto 自动切换
   * @version 2021-10-30 zzc
   */
   public savePersonalizeSettings(data: PersonalizeSettingsConfig) {
    const url = 'v1/settings/savePersonalizeSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 保存安全设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.black_ip 黑名单ip,逗号分隔
   * @version 2021-10-30 zzc
   */
   public saveSecuritySettings(data: SecuritySettingsConfig) {
    const url = 'v1/settings/saveSecuritySettings'
    return this.put(url, { loading: true, ...data })
  }
}