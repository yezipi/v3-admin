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

const loading = ref(true)
const isErr = ref(false)

// 获取百度每日浏览统计
const init = async () => {
  try {
    const { data } = await ReportApi.getBaiduDayReport(props.startDate, props.endDate)
    // 组合成适用于图表的数据
    const date = data.items[0].map((e: any) => e[0].substring(5, 13))
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
    const chartDom = document.getElementById('day-charts')!
    const myChart = echarts.init(chartDom)
    const option: EChartsOption = {
      title: {
        text: '7天日访问'
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
        data: ['日用户数', '日访问数']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: date,
        }
      ],
      yAxis: [
        {
          type: 'value',
        }
      ],
      series: [
        {
          name: '日用户数',
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
          data: val2
        },
        {
          name: '日访问数',
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
          data: val1
        },
      ]
    }
    option && myChart.setOption(option)
    // window.addEventListener('resize', () => {
    //   myChart.resize()
    // })
  } catch (e) {
    console.log(e)
    isErr.value = true
  } finally {
    loading.value = false;
  }
}

onMounted(() => init());


</script>

<template>
  <div class="charts-wrap">
    <div v-if="loading" class="charts-loading">
      <a-spin></a-spin>
    </div>
    <div class="charts-main" id="day-charts">
      <a-empty v-if="isErr" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </div>
  </div>
</template>

<style scoped lang="less">
.h300 {
  height: 300px;
}
.charts-wrap {
  .h300;
  .charts-loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .charts-main {
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
