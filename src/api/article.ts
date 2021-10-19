// 用户接口
import Request from '../utils/request'

export default new class Article extends Request {
  
  /**
   * 文章列表
   * @version 2021-10-19 zzc
   */
  public getList() {
    const url = 'v1/admin/article'
    return this.get(url, { loading: true })
  }
}