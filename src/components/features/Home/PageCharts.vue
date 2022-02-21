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
    title: '页面',
    dataIndex: 'page',
  },
  {
    title: '浏览量',
    dataIndex: 'pv',
  },
  {
    title: '停留时长',
    dataIndex: 'stay',
  },
])

const dataSource = ref<any>([])

const init = async () => {
  try {
    const { data } = await ReportApi.getBaiduPageReport(props.startDate, props.endDate)
    const items = data.items as Array<any>[]
    items[0].forEach((e: any, index: number) => {
      dataSource.value.push({
        page: e[0].name,
        pv: items[1][index][0],
        stay: items[1][index][2]
      })
    })
    console.log(dataSource.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

init()

</script>

<template>
  <div class="keywords-charts">
    <a-table :data-source="dataSource" :loading="loading" :columns="columns" :pagination="false" size="small">
      <template #bodyCell="{ column: { dataIndex }, record }">
        <template v-if="dataIndex === 'stay'">
          {{ record.stay }}秒
        </template>
      </template>
    </a-table>
  </div>
</template>