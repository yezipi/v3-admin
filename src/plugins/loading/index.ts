// 插件注册
import { createVNode, render } from 'vue'

import loadingEle from './index.vue'

const Loading = function(props: any) {

  const divVNode: any =  document.querySelector('#loading')

  if (!props.visible || divVNode) {
    document.body.removeChild(divVNode)
  }

  if (!props.visible) {
    return
  }

  const divWrap = document.createElement('div')

  divWrap.id = 'loading'

  const vm = createVNode(loadingEle, props)
  render(vm, divWrap)

  document.body.appendChild(divWrap)

}

export default {

  // install(app: App): void {

  //   app.config.globalProperties.$loading = {

  //     show(msg: string) {
  //       Share({ visible: true, msg })
  //     },

  //     hide() {
  //       Share({ visible: false })
  //     }

  //   }

  // }

  show(msg: string) {
    Loading({ visible: true, msg })
  },

  hide() {
    Loading({ visible: false })
  }

}