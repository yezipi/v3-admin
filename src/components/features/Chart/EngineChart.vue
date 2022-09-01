<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import ReportApi from '@/api/report'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components'
import { PieChart, PieSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | PieSeriesOption
>

const props = defineProps({
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => {}
  }
})

const chartEl = ref()
const height = ref(0)
const loading = ref(true)
const errMsg = ref('')
const seriesData = ref<any[]>([])
const option = ref<EChartsOption>({})

let chartDom: any = undefined
let myChart: any = undefined

const init = async () => {
  try {
    loading.value = true
    errMsg.value = ''
    seriesData.value = []

    const { data } = await ReportApi.getBaiduEngine(props.startDate, props.endDate)

    // 组合成适用于图表的数据
    data.items[0].forEach((e: any, index: number) => {
      seriesData.value.push({
        name: e[0].name,
        value: data.items[1][index][0]
      })
    })
    if (!myChart) {
      chartDom = document.getElementById('engineChart')!
      myChart = echarts.init(chartDom)
    }
    option.value = {
      title: {
        text: '搜索引擎',
      },
      legend: {
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          radius: ['40%', '70%'],
          name: '访问数',
          type: 'pie',
          data: seriesData.value,
          label: {
            show: true,
            formatter: '{b}\n{c}'
          },
        },
      ]
    }
    myChart.setOption(option.value)
  } catch (e: any) {
    console.log(e)
    errMsg.value = e.message || e.errMsg
  } finally {
    loading.value = false
  }
}

const resize = () => myChart.resize()

const refresh = () => init()

defineExpose({
  resize,
  refresh
})

onMounted(() => {
  height.value = chartEl.value.clientWidth
  init()
})

onUnmounted(() => {
  myChart && myChart.clear()
  myChart && myChart.dispose()
})


</script>

<template>
  <div ref="chartEl" :style="{ height: height + 'px' }" class="chart-area">
    <div class="chart-main" id="engineChart"></div>
    <div v-if="loading" class="chart-spin">
      <a-spin :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>