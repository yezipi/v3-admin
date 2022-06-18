import db from '@/utils/db'

// 手动声明 state 类型
export interface StateConfig {
  token: string
  user: { nickname: string, id: number, role: any, avatar: any }
  isLoading: boolean
  loading: any
  menuStyle: any,
  theme: string,
  msg: {
    count: number,
    data: {
      comments: { count: number, rows: Array<any> },
      feedbacks: { count: number, rows: Array<any> },
      blogrolls: { count: number, rows: Array<any> },
    }
  },
  error: {
    status: number,
    msg: string
  }
}

const state: StateConfig = {
  token: db.get('token'),
  user: db.get('user') || '',
  isLoading: false,
  loading: null,
  menuStyle: db.get('menuStyle') || 1, // 1 菜单在左边，2 菜单在顶部
  theme: db.get('theme') || 'theme-default', // 主题配置
  msg: {
    count: 0,
    data: {
      comments: { count: 0, rows: [] as any },
      feedbacks: { count: 0, rows: [] as any },
      blogrolls: { count: 0, rows: [] as any },
    }
  },
  error: {
    status: 200,
    msg: ''
  }
}

export default state
