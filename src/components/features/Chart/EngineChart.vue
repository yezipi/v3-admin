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

const loading = ref(true)
const errMsg = ref('')
const seriesData = ref<any[]>([])

// 获取百度每日浏览统计
const init = async () => {
  try {
    const { data } = await ReportApi.getBaiduEngine(props.startDate, props.endDate)
    // 组合成适用于图表的数据
    data.items[0].forEach((e: any, index: number) => {
      seriesData.value.push({
        name: e[0].name,
        value: data.items[1][index][0]
      })
    })
    console.log(seriesData.value)
    const chartDom = document.getElementById('engineChart')!
    const myChart = echarts.init(chartDom)
    const option: EChartsOption = {
      title: {
        text: '搜索引擎',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      series: [
        {
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
    option && myChart.setOption(option)
  } catch (e: any) {
    console.log(e)
    errMsg.value = e.message || e.errMsg
  } finally {
    loading.value = false
  }
}

onMounted(() => init())

</script>

<template>
  <div class="chart-area">
    <div class="chart-main" id="engineChart"></div>
    <div class="chart-spin">
      <a-spin v-if="loading" :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>

<style scoped lang="less">
.chart-area {
  flex: 1;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  .chart-spin {
    position: absolute;
  }
  .chart-main {
    width: 100%;
    height: 100%;
  }
}
</style>