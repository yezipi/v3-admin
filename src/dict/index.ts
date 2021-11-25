export type ColumnType = 'article' | 'case' | 'feedback' | 'album' | 'blogroll' | 'about' | 'mood' | 'single'
export type UserRole = 'super' | 'admin' | 'tourist'

export default {
  COLUMN_TYPE: {
    article: '文章',
    case: '案例',
    feedback: '留言',
    album: '相册',
    blogroll: '友链',
    about: '关于',
    mood: '微语',
    single: '单页'
  },
  USER_ROLE: {
    super: '超级管理员',
    admin: '普通管理员',
    tourist: '游客',
  }
}