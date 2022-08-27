<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Empty } from 'ant-design-vue'
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
})

const chartEl = ref()
const height = ref(0)
const loading = ref(true)
const errMsg = ref('')
const option = ref<EChartsOption>({})

let chartDom: any = undefined
let myChart: any = undefined

// 获取百度每日浏览统计
const init = async () => {
  try {
    loading.value = true
    errMsg.value = ''

    const { data } = await ReportApi.getBaiduDistrictReport(props.startDate, props.endDate)

    // 组合成适用于图表的数据
    const yData = data.items[0].map((e: any) => e[0].name)
    const val = data.items[1]
    const val1: any = []
    const val2: any = []
    val.forEach((e: any) => {
      if (e[0] !== '--' ) {
        val1.push(e[0])
      } else {
        val1.push(0)
      }
      if (e[1] !== '--' ) {
        val2.push(e[1])
      } else {
        val2.push(0)
      }
    })
    if (!myChart) {
      chartDom = document.getElementById('districtCharts')!
      myChart = echarts.init(chartDom)
    }
    option.value = {
      title: {
        text: '7天省份统计'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: yData
      },
      series: [
        {
          name: '访问数',
          type: 'bar',
          data: val1,
          label: {
            show: true,
            position: 'top'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: '#01b2ff' },
              { offset: 0, color: '#acecff' }
            ])
          },
        },
        {
          name: '用户数',
          type: 'bar',
          data: val2,
          label: {
            show: true,
            position: 'top'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 1, color: '#ff6666' },
              { offset: 0, color: '#ffacac' }
            ])
          },
        }
      ]
    }
    myChart.setOption(option.value)
  } catch (e: any) {
    console.log(e)
    errMsg.value = e.message || e.errMsg
  } finally {
    loading.value = false;
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
  <div ref="chartEl" class="chart-area" style="height: 300px">
    <div class="chart-main" id="districtCharts"></div>
    <div v-if="loading" class="chart-spin">
      <a-spin :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>