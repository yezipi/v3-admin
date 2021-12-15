import db from '@/utils/db'
import { MutationTree } from 'vuex'
import { State } from './state'
import Loading from '@/plugins/loading'

const mutations: MutationTree<State> = {
  updateToken(state: any, token: any) {
    state.token = token;
    db.set('token', token);
  },
  updateUser(state: any, data: any) {
    state.user = data;
    db.set('user', data);
  },
  showLoading(state: any) {
    Loading.show('加载中..')
    state.loading = Loading
    state.isLoading = true
  },
  hideLoading(state: any) {
    if (state.isLoading) {
      state.loading.hide()
      state.isLoading = false
    }
  },
}

export default mutations
