import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import AntVue from 'ant-design-vue'
import 'ant-design-vue/lib/message/style/index.less'
import '@/assets/css/reset.less'

const app = createApp(App)

Router.beforeEach((to: any, from: any, next: any) => {
  const { meta, matched, name } = to
  document.title = meta.title || '未命名'

  Store.commit('updateError', { status: 200, msg: '' })

  if (!Store.state.token && name !== 'Login') {
    Router.replace({
      name: 'Login',
      query: {
        referrer: name
      }
    })
    Store.commit('updateError', { status: 401, msg: '登录失效请重新登录' })
    return
  }

  if (!name || (meta.noLink && matched.length === 1)) {
    Store.commit('updateError', { status: 404, msg: '页面不存在' })
    return
  }

  if (!Store.getters.permissions.includes(to.name) && !meta.noAuth && Store.state.token) {
    Store.commit('updateError', { status: 403, msg: '无权限' })
    return
  }

  next()

});

app
.use(Store)
.use(Router)
.use(AntVue)
.mount('#app')
