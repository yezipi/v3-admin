import { StateConfig } from './state'
import { GetterTree } from 'vuex'

const getters: GetterTree<StateConfig, any> =  {
  permissions(state): Array<any> {
    return state.user && state.user.role ? state.user.role.permissions : []
  }
}

export default getters
