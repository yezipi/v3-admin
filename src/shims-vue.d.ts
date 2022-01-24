
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ant-design/icons-vue'
declare module 'vue-img-cutter'
declare module 'vue3-easy-swiper'
