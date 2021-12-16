import { InjectionKey } from 'vue';
import { createStore, StoreOptions, Store } from 'vuex'
import state, { StateConfig } from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// Define StoreOptions
const globalStoreOption: StoreOptions<StateConfig> = {
  state,
  getters,
  mutations,
  actions,
};

export default createStore<StateConfig>(globalStoreOption)

// InjectionKey 方法为创建并使用定义 state 时提供唯一的 key，用到了 ES6 的 Symbol。
export const globalStoreKey: InjectionKey<Store<StateConfig>> = Symbol();


