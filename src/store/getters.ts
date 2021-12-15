import { StateConfig } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<StateConfig, any> =  {
  permissions(state) {
    return state.user ? state.user.role.permissions : []
  }
}

export default getters
