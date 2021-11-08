// 文章接口
import Request from '../utils/request'

type ArticleFields =  {
  type?: string,
  sub_column_id?: number | string,
  column_id?: number,
  cover_thumb?: string,
  keywords?: string,
  description?: string,
  author_name?: string,
  user_id?: number,
  view?: number,
  like?: number,
  status?: boolean,
  top?: boolean
  recommend?: boolean
  download_link?: string
  comment_open?: boolean
  tags?: string,
  sort?: number,
}

export interface ArticleSaveConfig extends ArticleFields {
  title: string,
  content: string,
}

export interface ArticleUpdateConfig extends ArticleFields {
  title?: string,
  content?: string,
}

export interface ArticleListConfig {
  page?: number,
  size?: number,
  title?: string,
}

export default new class Article extends Request {

  /**
   * 更新文章
   * @param { Obejct } data 参数
   * @param { String } data.title 文章标题，不少于5个字
   * @param { String } data.content 文章正文，不少于5个字符
   * @param { String } data.type 类型
   * @param { Number } data.column_id 一级栏目id，没有二级的情况下传
   * @param { Number } data.subcolumn_id 二级栏目id
   * @param { String } data.cover_origin 原图
   * @param { String } data.cover_thumb 缩略图
   * @param { String } data.keywords 关键字
   * @param { String } data.description 描述
   * @param { Number } data.user_id 发表的用户id
   * @param { String } data.author_name 作者姓名
   * @param { Number } data.view 浏览次数
   * @param { Number } data.like 点赞数
   * @param { Boolean } data.status 状态
   * @param { Boolean } data.top 是否置顶
   * @param { Boolean } data.recommend 是否推荐
   * @param { String } data.download_link 下载链劫
   * @param { String } data.tags 标签
   * @param { Number } data.sort 排序
   * @version 2021-10-20 zzc
   */
   public create(data?: ArticleSaveConfig) {
    const url = 'v1/admin/article'
    return this.post(url, { ...data, loading: true })
  }

  /**
   * 删除文章
   * @param { String } id 文章id
   * @version 2021-10-20 zzc
   */
   public destory(id: string) {
    const url = `v1/admin/article/${id}`
    return this.delete(url, { loading: true, showMsg: true })
  }

  /**
   * 更新文章
   * @param { String } id 文章id
   * @param { Obejct } data 同创建的参数
   * @version 2021-10-20 zzc
   */
   public update(id: string, data?: ArticleUpdateConfig) {
    const url = `v1/admin/article/${id}`
    return this.put(url, { ...data, loading: true, showMsg: true })
  }

  /**
   * 获取文章详情
   * @param { String } id 文章id
   * @version 2021-10-26 zzc
   */
   public detail(id: string) {
    const url = `v1/admin/article/${id}`
    return this.get(url, { loading: true })
  }

  /**
   * 文章列表
   * @param { Obejct } params 参数
   * @param { Number } params.page 页码
   * @param { Number } params.size 页数
   * @param { String } params.title 文章标题，可选
   * @version 2021-10-19 zzc
   */
   public getList(params?: ArticleListConfig) {
    const url = 'v1/admin/article'
    return this.get(url, { ...params, loading: true })
  }
}