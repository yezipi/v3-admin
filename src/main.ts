import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import AntVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import '@/assets/css/reset.less'

const app = createApp(App)

Router.beforeEach((to: any, from: any, next: any) => {
  const { meta, matched, name } = to
  document.title = meta.title || '未命名'

  if (!Store.state.token && name !== 'Login') {
    Router.replace({
      name: 'Login',
      query: {
        referrer: name
      }
    })
    return
  }

  if (!name || (meta.noLink && matched.length === 1)) {
    next('/result?status=404')
    return
  }

  if (!Store.getters.permissions.includes(to.name) && !meta.noAuth) {
    next('/result?status=403')
    return
  }

  next()

});

app
.use(Store)
.use(Router)
.use(AntVue)
.mount('#app')
