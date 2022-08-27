<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Empty } from 'ant-design-vue';
import ReportApi from '@/api/report'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components'
import { LineChart, LineSeriesOption } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
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
});

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

    const { data } = await ReportApi.getBaiduTrend(props.startDate, props.endDate)
    
    // 组合成适用于图表的数据
    const date = data.items[0].map((e: any) => e[0])
    const val = data.items[1]
    const val1: any = []
    const val2: any = []
    const val3: any = []

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
      if (e[2] !== '--' ) {
        val3.push(e[2])
      } else {
        val3.push(0)
      }
    })
    if (!myChart) {
      chartDom = document.getElementById('dayCharts')!
      myChart = echarts.init(chartDom)
    }
    option.value = {
      title: {
        text: '趋势分析'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['访问数', '用户数', 'ip数']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: date.reverse(),
        }
      ],
      yAxis: [
        {
          type: 'value',
        }
      ],
      series: [
        {
          name: '访问数',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            color: '#fbd363f2'
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#e97f26f2'
              },
              {
                offset: 1,
                color: '#fbd363f2'
              }
            ])
          },
          lineStyle: {
            color: '#d35318'
          },
          label: {
            show: true,
            position: 'top'
          },
          emphasis: {
            focus: 'series'
          },
          smooth: true,
          data: val1.reverse()
        },
        {
          name: '用户数',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            color: '#8bd5ec'
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#8ba3ec'
              },
              {
                offset: 1,
                color: '#8bd5ec'
              }
            ])
          },
          lineStyle: {
            color: '#4b69c7'
          },
          label: {
            show: true,
            position: 'top'
          },
          emphasis: {
            focus: 'series'
          },
          smooth: true,
          data: val2.reverse()
        },
        {
          name: 'ip数',
          type: 'line',
          stack: 'Total',
          itemStyle: {
            color: '#8bd5ec'
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#1ba3ec'
              },
              {
                offset: 1,
                color: '#1bd5ec'
              }
            ])
          },
          lineStyle: {
            color: '#1b69c7'
          },
          label: {
            show: true,
            position: 'top'
          },
          emphasis: {
            focus: 'series'
          },
          smooth: true,
          data: val3.reverse()
        },
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
    <div class="chart-main" id="dayCharts"></div>
    <div v-if="loading" class="chart-spin">
      <a-spin :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>

<style scoped lang="less">

</style>
