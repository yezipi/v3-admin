// 设置接口
import Request from '../utils/request'

export interface BaseSettingsConfig {
  web_name: string,
  web_notice: any,
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
  audit_comment: boolean,
  audit_feedback: boolean,
  web_avatar: string,
  web_logo: string,
  web_like: number,
  alipay_code: string,
  wxpay_code: string,
  gzh_code: string,
}

export interface AdSettingsConfig {
  banner: string,
  aside: string,
  float: string,
  open: boolean,
}

export interface PersonalizeSettingsConfig {
  style: string,
  font: string,
  background: string,
  gray: boolean,
  auto: boolean,
}

export interface SecuritySettingsConfig {
  black_ip: string,
  open: boolean,
}

export type MaintenanceSettingsConfig = {
  content: string;
  open: boolean;
}

export type AliyunSettingsConfig = {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  dir: string;
  open: boolean,
};

export interface BaiduConfig {
  appid: string,
  secret: string,
  code: string,
  site_id: string,
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
   * 保存基本设置
   * @param { Object } data 基本设置参数
   * @param { String } data.web_name 网站名称
   * @param { String } data.web_slogan 网站签名
   * @param { String } data.web_notice 网站标语
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
   * @param { String } data.audit_comment 评论审核
   * @param { String } data.audit_feedback 留言审核
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
   * @param { String } data.background 背景图片
   * @param { String } data.gray 置灰
   * @param { Boolean } data.auto 自动切换
   * @version 2021-10-30 zzc
   */
  public savePersonalizeSettings(data: PersonalizeSettingsConfig) {
    const url = 'v1/settings/savePersonalizeSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 网站维护设置保存
   * @param { Object } data 参数
   * @param { String } data.content 维护内容
   * @param { Boolean } data.open 维护状态
   * @version 2022-08-19 zzc
   */
  public saveMaintenanceSettings(data: MaintenanceSettingsConfig) {
    const url = 'v1/settings/saveMaintenanceSettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 获取网站维护设置
   * @version 2022-08-19 zzc
   */
  public getMaintenanceSettings() {
    const url = 'v1/settings/getMaintenanceSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 保存阿里云oss设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.region 区域
   * @param { String } data.accessKeyId 黑名单ip,逗号分隔
   * @param { String } data.accessKeySecret 黑名单ip,逗号分隔
   * @param { String } data.bucket bucket名称
   * @param { String } data.dir 目录
   * @param { Boolean } data.open 是否启用
   * @version 2022-08-19 zzc
   */
  public saveAliyunettings(data: AliyunSettingsConfig) {
    const url = 'v1/settings/saveAliyunettings'
    return this.put(url, { loading: true, ...data })
  }

  /**
   * 获取存阿里云oss设置
   * @version 2022-08-19 zzc
   */
  public getAliyunSettings() {
    const url = 'v1/settings/getAliyunSettings'
    return this.get(url, { loading: true })
  }

  /**
   * 保存安全设置
   * @param { Object } data 邮件设置参数
   * @param { String } data.black_ip 黑名单ip,换行
   * @param { String } data.open 搜房启用
   * @version 2021-10-30 zzc
   */
   public saveSecuritySettings(data: SecuritySettingsConfig) {
    const url = 'v1/settings/saveSecuritySettings'
    return this.put(url, { loading: true, ...data })
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
   * 保存百度统计配置
   * @param { Object } body 参数
   * @param { String } body.appid appid
   * @param { String } body.secret secret
   * @param { String } body.code code
   * @param { String } body.site_id site_id
   * @version 2022-01-13 zzc
   */
  public saveBaiduConfig(body: BaiduConfig) {
    const url = 'v1/settings/saveBaiduConfig'
    return this.put(url, { loading: true, ...body })
  }

  /**
   * 保存安全设置
   * @version 2022-01-13 zzc
   */
  public getBaiduConfig() {
    const url = 'v1/settings/getBaiduConfig'
    return this.get(url, { loading: true })
  }
}