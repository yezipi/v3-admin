import db from '@/utils/db'

// 手动声明 state 类型
export interface StateConfig {
  token: string;
  user: { nickname: string, id: number, role: any };
  isLoading: boolean;
  loading: any;
}

const state: StateConfig = {
  token: db.get('token'),
  user: db.get('user') || '',
  isLoading: false,
  loading: null,
}

export default state
