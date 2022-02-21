<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import Api from '@/api/report'

const columns = reactive([
  {
    title: '访问时间',
    dataIndex: 'visitedTime',
  },
  {
    title: '地区',
    dataIndex: 'area',
  },
  {
    title: '来源',
    dataIndex: 'from',
  },
  {
    title: '入口页面',
    dataIndex: 'visitedPage',
  },
  {
    title: '搜索词',
    dataIndex: 'keywords',
  },
  {
    title: '访问IP',
    dataIndex: 'ip',
  },
  {
    title: '访问时长',
    dataIndex: 'stay',
  },
  {
    title: '访问页数',
    dataIndex: 'visitedCount',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
  },
  {
    title: '系统',
    dataIndex: 'os',
  },
  {
    title: '网络类型',
    dataIndex: 'isp',
  },
])

const list = ref<any>([])
const tableRef = ref()

const getBaiduVisitors = async () => {
  const { data } = await Api.baiduVisitors()
  const field = data.items[1]
  list.value = data.items[0].map((el: any, index: number) => {
    const detail = el[0].detail
    return {
      visitedTime: field[index][0],
      area: field[index][1],
      from: field[index][2],
      visitedPage: field[index][3],
      keywords: field[index][4],
      ip: field[index][5],
      stay: field[index][7] + '秒',
      visitedCount: field[index][8],
      browser: detail.browser,
      os: detail.os,
      isp: detail.isp
    }
  })
  console.log(list.value)
}

onMounted(() => getBaiduVisitors())

</script>

<template>
  <div class="baidu-visitors-wrap">
    <yzp-table :columns="columns" :data="list" ref="tableRef">
      <template #bodyCell="{ scope: { record, column } }">
        <span v-if="column.dataIndex === 'from'">
          <a v-if="record.from.url" :href="record.from.url" target="_blank">{{ record.from.fromType }}</a>
          <span v-else>{{ record.from.fromType }}</span>
        </span>
      </template>
    </yzp-table>
  </div>
</template>

