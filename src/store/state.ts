import db from '@/utils/db'

// 手动声明 state 类型
export interface StateConfig {
  token: string
  user: { nickname: string, id: number, role: any, avatar: any }
  isLoading: boolean
  loading: any
  style: any,
  msgData: {
    count: number,
    data: {
      comments: { count: number, rows: Array<any> }
      feedbacks: { count: number, rows: Array<any> }
      blogrolls: { count: number, rows: Array<any> }
    }
  }
}

const state: StateConfig = {
  token: db.get('token'),
  user: db.get('user') || '',
  isLoading: false,
  loading: null,
  style: db.get('style') || 1, // 1 菜单在左边，2 菜单在顶部
  msgData: db.get('msgData') || {},
}

export default state
