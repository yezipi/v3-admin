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

  public ossUpload(url: any, formData: any) {
    return this.post(url, formData)
  }

  public ossPolicy (params: any) {
    console.log(params)
    return {
      data: {}
    }
  }
}