import { ActionTree } from 'vuex'
import { State } from './state'

const actions: ActionTree<State, any> = {
  resetUser({ commit }: any) {
    commit('updateToken', '')
    commit('updateUser', {})
  }
}

export default actions
