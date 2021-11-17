import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import AntVue from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

Router.beforeEach((to: any, from: any, next: any) => {
  console.log(to.fullPath)
  document.title = to.meta.title || '未命名'
  if (!to.name || (to.meta.noLink && to.matched.length === 1)) {
    next('/404')
    return
  }
  next()

});

app
.use(Store)
.use(Router)
.use(AntVue)
.mount('#app')
