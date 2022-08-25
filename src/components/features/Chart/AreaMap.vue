<!--地图数据组件，2022-06-27，zzc-->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  GeoComponent,
  GeoComponentOption
} from 'echarts/components';
import {
  MapChart,
  MapSeriesOption,
} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import api from '@/api/report'
import mapData from '@/utils/china'
import { setFullEle } from '@/utils'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | VisualMapComponentOption
  | GeoComponentOption
  | MapSeriesOption
>;

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

const option = ref<EChartsOption>({})
const provinceData = ref<any[]>([]); // 省市区数据匹配
const loading = ref(false)
const errMsg = ref('')

let chartDom: any = undefined
let myChart: any = undefined

/**
 * 初始化
 */
const init = async () => {
  try {
    loading.value = true
    errMsg.value = ''
    provinceData.value = []

    // 获取百度地图返回的省市区
    const { data } = await api.getBaiduArea(props.startDate, props.endDate)

    const baiduProvince = data.items[0].map((e: any) => e[0])
    const baiduVisitCount = data.items[1].map((e: any) => e[0])
    console.log(baiduVisitCount)
    
    mapData.features.forEach((a: any) => {
       let obj: any = {
        code: +a.id,
        name: a.properties.name,
        value: [0],
        latlng: a.properties.cp,
      }
      baiduProvince.forEach((x: any, index: number) => {
        if (a.properties.name === x) {
          // 省市区数据
          obj = {
            code: +a.id,
            name: a.properties.name,
            value: [baiduVisitCount[index]],
            latlng: a.properties.cp,
          }
        }
      })
      provinceData.value.push(obj)
    })

    console.log(provinceData.value)

    echarts.registerMap('china', mapData as any);

    option.value = {
      tooltip: {
        z: 6,
        trigger: 'item',
        renderMode: 'richText',
        backgroundColor: 'rgba(255,255,255, 0.8)',
      },
      visualMap: {
        min: 0, // 最小值
        max: 100, // 最大值
        dimension: 0, // 用数组里的第二个值
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#488FF7', '#fed0d0', '#ffa1a1','#ff6666', '#ff0000']
        },
        textStyle: {
          color: '#ffffff'
        },
        left: 10,
        itemWidth: 10,
      },
      // geo: {
      //   type: 'map',
      //   map: 'china',
      //   layoutCenter: ['50%', '50%'], //地图位置
      //   layoutSize: '120%',
      //   roam: true,
      //   label: {
      //     show: true,
      //     color: '#ffffff',
      //   },
      //   // 高亮显示的样式
      //   emphasis: {
      //     disabled: false,
      //     itemStyle: {
      //       areaColor: '#010256',
      //     },
      //     label: {
      //       color: '#52B7FA',
      //     }
      //   },
      //   itemStyle: {
      //     areaColor: '#6296f9',
      //     borderColor: '#52B7FA',
      //     borderWidth: 1,
      //     shadowColor: 'rgba(0, 0, 0, 0.3)',
      //     shadowBlur: 2,
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2,
      //   },
      // },
      series: [
        {
          type: 'map',
          map: 'china',
          geoIndex: 0,
          z: 0,
          roam: false,
          data: provinceData.value,
          label: {
            show: true,
            formatter: '{b}\n{c}'
          }
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

// 轮询刷新
const refresh = async () => {
}

const fullMap = async () => {
  await setFullEle('#map')
  myChart.resize()
}

const resize = () => {
  myChart.resize()
  myChart.setOption(option.value)
}

onMounted(() => {
  chartDom = document.getElementById('map')!;
  myChart = echarts.init(chartDom);
  init();
})

defineExpose({
  refresh,
  fullMap,
  resize
})

</script>

<template>
  <div class="baidu-area">
    <div class="chart-main" id="map"></div>
    <div class="chart-spin">
      <a-spin v-if="loading" :spinning="loading" />
    </div>
    <a-empty v-if="errMsg" :description="errMsg" />
  </div>
</template>

<style scoped lang="less">
.baidu-area {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: absolute;
  .chart-spin {
    position: absolute;
  }
  .chart-main {
    width: 100%;
    height: 100%;
  }
}
</style>