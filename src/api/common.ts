// 公共接口
import Request from '@/utils/request'

export default new class Common extends Request {

  /**
   * nodejs上传到服务器
   * @param { FormData } formData
   * @param { Object } headers
   * @version 2021-10-21 zzc
   */
  public uploadImg(formData: any, headers?: object) {
    const url = 'v1/common/uploadImg'
    return this.post(url, formData, headers)
  }

  /**
   * 发送邮件
   * @param { String } params.subject 标题
   * @param { String } params.html 内容
   * @param { String } params.recipient 收件人
   * @version 2022-08-12 zzc
   */
  public sendMail(params: { subject: string, html: string, recipient: string }) {
    const url = 'v1/common/sendMail'
    return this.post(url, { ...params, loading: true, })
  }

  /**
   * 获取表情
   * @version 2021-12-16 zzc
   * @param { String } dir 目录
   */
   public getFace(dir?: string) {
    const url = 'v1/common/getFace'
    return this.get(url, { dir })
  }

  /**
   * 阿里云文件上传
   * @param { FormData } formData 文件
   */
  public aliyunOssUpload(formData: any) {
    const url = '/admin/v1/aliyun/upload'
    return this.post(url, formData)
  }

  public ossPolicy (params: any) {
    console.log(params)
    return {
      data: {}
    }
  }
}