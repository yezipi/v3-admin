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
document.title = config[status as keyof typeof config].title
</script>

<template>
  <a-result :status="status" :title="config[status].title" :sub-title="config[status].desc" style="margin-top: 20vh"></a-result>
</template>