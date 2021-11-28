import common from '@/api/common'

/**
 *@name 上传到阿里云oss,先获取凭证
 *@author zzc 2020-5-21
 */
class AliyunUpload {
  /**
   *@name 获取凭证
   *@param { String } file 文件
   *@param { String } fileName 文件名
   */
  async start(file: any, fileName?: string) {
    try {
      const { data }: any = await common.ossPolicy('competition')
      console.log(data)
      const formData: any = new FormData()
      const newFileName = fileName || new Date().getTime()
      const extension = file.name.replace(/.+\./, '')
      const fileUrl = `${data.dir}${newFileName}.${extension}`
      const exportName = data.host + '/' + fileUrl
      formData.append('OSSAccessKeyId', data.OSSAccessKeyId)
      formData.append('policy', data.policy)
      formData.append('signature', data.signature)
      formData.append('success_action_status', '200')
      formData.append('key', fileUrl)
      formData.append('file', file)
      await this.upload(data.host, formData)
      return exportName
    } catch (e) {
      console.log(e)
      // Toast(e.message || '请求失败~')
      alert(JSON.stringify(e))
      return Promise.reject(e)
    }
  }

  // 上传到oss
  async upload(url: string, formData: string) {
    try {
      const res = await common.ossUpload(url, formData)
      if (res.status !== 200) {
        throw { message: '图片上传失败~' }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export default new AliyunUpload()
