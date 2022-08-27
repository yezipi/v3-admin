<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
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
import { BarChart, BarSeriesOption } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
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

    const { data } = await ReportApi.getBaiduAllSource(props.startDate, props.endDate)

    // 组合成适用于图表的数据
    data.items[0].forEach((e: any, index: number) => {
      seriesData.value.push({
        name: e[0].name,
        value: data.items[1][index][0],
        value1: data.items[1][index][1]
      })
    })
    if (!myChart) {
      chartDom = document.getElementById('sourceChart')!
      myChart = echarts.init(chartDom)
    }
    option.value = {
      title: {
        text: '搜索来源',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}'
      },
      legend: {
        left: 'center'
      },
      xAxis: [
        {
          type: 'category',
          data: seriesData.value.map((e: any) => e.name),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '访客数',
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          },
          data: seriesData.value.map((e: any) => e.value)
        },
        {
          name: '访问数',
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          },
          data: seriesData.value.map((e: any) => e.value1)
        }
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


</script>

<template>
  <div ref="chartEl" :style="{ height: height + 'px' }" class="chart-area">
    <div class="chart-main" id="sourceChart"></div>
    <div v-if="loading" class="chart-spin">
      <a-spin :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>