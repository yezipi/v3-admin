import { ActionTree } from 'vuex'

import { StateConfig } from './state'

const actions: ActionTree<StateConfig, any> = {
  clearUser({ commit }) {
    commit('updateToken', '')
    commit('updateUser', {})
  }
}

export default actions
