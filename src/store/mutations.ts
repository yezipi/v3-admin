import db from '@/utils/db'
import { MutationTree } from 'vuex'
import { StateConfig } from './state'
import Loading from '@/plugins/loading'

const mutations: MutationTree<StateConfig> = {
  updateToken(state, token: any) {
    state.token = token;
    db.set('token', token);
  },
  updateUser(state, data: any) {
    state.user = data;
    db.set('user', data);
  },
  showLoading(state) {
    Loading.show('加载中..')
    state.loading = Loading
    state.isLoading = true
  },
  hideLoading(state) {
    if (state.isLoading) {
      state.loading.hide()
      state.isLoading = false
    }
  },
  // 切换布局
  changeStyle(state, data) {
    state.style = data
    db.set('style', data)
  }
}

export default mutations
