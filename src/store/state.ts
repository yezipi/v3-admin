import db from '@/utils/db'

// 手动声明 state 类型
export interface State {
  token: string;
  user: any;
  isLoading: boolean;
  loading: any;
}

const state: State = {
  token: db.get('token'),
  user: db.get('user') || '123',
  isLoading: false,
  loading: null,
}

export default state
