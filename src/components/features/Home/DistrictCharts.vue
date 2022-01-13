<script lang="ts" setup>
import { onMounted, ref } from 'vue'
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

const loading = ref(true)

// 获取百度每日浏览统计
const getBaiduDistrictReport = async () => {
  try {
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
    const chartDom = document.getElementById('district-charts')!
    const myChart = echarts.init(chartDom)
    const option: EChartsOption = {
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
        boundaryGap: [0, 0.01]
      },
      xAxis: {
        type: 'category',
        data: yData
      },
      series: [
        {
          name: '访问数',
          type: 'bar',
          data: val1
        },
        {
          name: '用户数',
          type: 'bar',
          data: val2
        }
      ]
    }
    option && myChart.setOption(option)
    window.addEventListener('resize', () => {
      myChart.resize()
    })
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => getBaiduDistrictReport())

</script>

<template>
  <div class="charts-wrap">
    <div v-if="loading" class="charts-loading">
      <a-spin></a-spin>
    </div>
    <div class="charts-main" id="district-charts"></div>
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
  }
}
</style>