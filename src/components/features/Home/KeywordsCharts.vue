<script lang="ts" setup>
import { ref } from 'vue'
import ReportApi from '@/api/report'

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
})

const loading = ref(true)
const columns = ref([
  {
    title: '搜索词',
    dataIndex: 'keywords',
  },
  {
    title: '浏览量',
    dataIndex: 'pv',
  },
])

const dataSource = ref<any>([])

const init = async () => {
  try {
    const { data } = await ReportApi.getBaiduKeywordReport(props.startDate, props.endDate)
    const items = data.items as Array<any>[]
    items[0].forEach((e: any, index: number) => {
      dataSource.value.push({
        keywords: e[0].name,
        pv: items[1][index][0]
      })
    })
    console.log(dataSource.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = true
  }
}

init()

</script>

<template>
  <div class="keywords-charts">
    <a-table :data="dataSource" :columns="columns" :pagination="false" size="small"></a-table>
  </div>
</template>