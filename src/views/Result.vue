<script lang="ts" setup>
import router from '@/router'
import { useRoute } from 'vue-router'
const route = useRoute()
const status: any = route.query.status || '404' 
const config = {
  403: {
    title: '403无权限',
    desc: '您无权查看此页面'
  },
  404: {
    title: '404页面未找到',
    desc: '这个页面不见了哦'
  },
  500: {
    title: '500服务器错误',
    desc: '服务器发生了错误。'
  },
}
const state = status as keyof typeof config
document.title = config[state].title
</script>

<template>
  <a-result :status="state as any" :title="config[state].title" :sub-title="config[state].desc" style="margin-top: 20vh"></a-result>
</template>