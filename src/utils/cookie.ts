// 这里写cookie的读写方法
export default {

  /**
   * 获取cookie
   * @version 2021-12-15 zzc
   * @param { String } name 名称
   */
  get(name: string) {
    const cookies = document.cookie.split(';')
    const obj = {} as any
    for (const i in cookies) {
      const item = cookies[i].split('=')
      const key = item[0].trim()
      const value = decodeURIComponent(item[1]).replace(/\"/g, '')
      obj[key] = value
    }
    return obj[name]
  },

  /**
   * 设置cookie
   * @version 2021-12-15 zzc
   * @param { String } name 名称
   * @param { String } value 值
   * @param { Date } expirse 过期时间
   */
  set(name: string, value: string, expirse?: any) {
    const val = typeof value === 'object' ? JSON.stringify(value) : value
    document.cookie = `${name}=${encodeURIComponent(val)}`
  }

}
