<script setup lang="ts">
import { ref } from 'vue'
import dayjs, { Dayjs } from 'dayjs';
import ReportApi from '@/api/report'
import { formatSec } from '@/utils'

type RangeValue = [Dayjs, Dayjs];

interface VisitTypeConfig {
  avg_visit_pages: number,
  avg_visit_time: number,
  bounce_ratio: number,
  pv_count: number,
  ratio: number,
  visitor_count: number,
}

const landingPage = ref<any[]>([])
const sourceSite = ref<any[]>([])
const visitPage = ref<any[]>([])
const word = ref<any[]>([])
const visitType = ref<VisitTypeConfig>({
  avg_visit_pages: 0,
  avg_visit_time: 0,
  bounce_ratio: 0,
  pv_count: 0,
  ratio: 0,
  visitor_count: 0,
})

const date = ref<RangeValue>([dayjs(), dayjs()])
const ranges = {
  '今天': [dayjs(), dayjs()] as RangeValue,
  '昨天': [ dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day') ] as RangeValue,
  '最近7天': [dayjs().subtract(1, 'week'), dayjs()] as RangeValue,
  '最近30天': [dayjs().subtract(1, 'month'), dayjs()] as RangeValue,
}
const dateType = ref('今天')

const startDate = ref(date.value[0].format('YYYYMMDD'))
const endDate = ref(date.value[1].format('YYYYMMDD'))

const mapChartRef = ref()
const enngineChartRef = ref()
const sourceChartRef = ref()
const trendRef = ref()

const tableLoading = ref(true)

const columns = ref([
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '浏览量',
    dataIndex: 'pv',
  },
  {
    title: '占比',
    dataIndex: 'ratio',
  },
])

const setTableData = (data: any) => {
  const arr: any[] = []
  data.items.forEach((e: any) => {
    arr.push({
      title: e[0],
      pv: e[1],
      ratio: `${e[2]}%`,
    })
  })
  return arr
}

const resize = () => {
  mapChartRef.value.resize()
  enngineChartRef.value.resize()
  sourceChartRef.value.resize()
  trendRef.value.resize()
}

const refresh = () => {
  mapChartRef.value.refresh()
  enngineChartRef.value.refresh()
  sourceChartRef.value.refresh()
  trendRef.value.refresh()
  getBaiduOverview()
}

const getBaiduOverview = async () => {
  try {
    tableLoading.value = true
    const { data } = await ReportApi.getBaiduOverview(startDate.value, endDate.value)
    landingPage.value = setTableData(data.landingPage)
    sourceSite.value = setTableData(data.sourceSite)
    visitPage.value = setTableData(data.visitPage)
    word.value = setTableData(data.word)
    visitType.value = data.visitType.newVisitor as VisitTypeConfig
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const onDateChange = (res: any[]) => {
  startDate.value = dayjs(res[0]).format('YYYYMMDD')
  endDate.value = dayjs(res[1]).format('YYYYMMDD')
  setTimeout(() => {
    refresh()
  })
}

const onRadioChange = (res: any) => {
  onDateChange((ranges as any)[res.target.value])
}

getBaiduOverview()

window.onresize = function() {
  resize()
}

</script>

<template>
  <div class="baidu-overview">
    <div>
      <a-radio-group v-model:value="dateType" button-style="solid" @change="onRadioChange">
        <a-radio-button v-for="(item, key, index) in ranges" :key="index" :value="key">{{ key }}</a-radio-button>
      </a-radio-group>
      <a-range-picker v-model:value="date" :ranges="ranges" @change="onDateChange" style="margin-left: 20px" />
    </div>
    <div class="baidu-overview-box">
      <div class="baidu-overview-item">
        <div class="baidu-overview-data">
          <h3>今日流量</h3>
          <a-spin :spinning="tableLoading">
            <div class="baidu-overview-data-main">
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ visitType.visitor_count }}</span>
                <span class="baidu-overview-data-title">访客数</span>
              </div>
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ visitType.pv_count }}</span>
                <span class="baidu-overview-data-title">浏览量</span>
              </div>
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ visitType.bounce_ratio }}%</span>
                <span class="baidu-overview-data-title">跳出率</span>
              </div>
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ visitType.ratio }}%</span>
                <span class="baidu-overview-data-title">占比</span>
              </div>
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ visitType.avg_visit_pages }}</span>
                <span class="baidu-overview-data-title">平均访问页数</span>
              </div>
              <div class="baidu-overview-data-item">
                <span class="baidu-overview-data-num">{{ formatSec(visitType.avg_visit_time) }}</span>
                <span class="baidu-overview-data-title">平均访问时长</span>
              </div>
            </div>
          </a-spin>
        </div>
      </div>
      <div class="baidu-overview-item">
        <trend-chart ref="trendRef" :startDate="startDate" :endDate="endDate"></trend-chart>
      </div>
      <div class="baidu-overview-item">
        <map-chart ref="mapChartRef" :startDate="startDate" :endDate="endDate"></map-chart>
        <engine-chart ref="enngineChartRef" :startDate="startDate" :endDate="endDate"></engine-chart>
        <source-chart ref="sourceChartRef" :startDate="startDate" :endDate="endDate"></source-chart>
      </div>
      <div class="baidu-overview-item">
        <div class="baidu-overview-table">
          <h3>来源网站</h3>
          <a-table :columns="columns" :dataSource="sourceSite" :loading="tableLoading" bordered size="middle" class="baidu-overview-anttable"></a-table>
        </div>
        <div class="baidu-overview-table">
          <h3>关键词</h3>
          <a-table :columns="columns" :dataSource="word" :loading="tableLoading" bordered size="middle" class="baidu-overview-anttable"></a-table>
        </div>
      </div>
      <div class="baidu-overview-item">
        <div class="baidu-overview-table">
          <h3>入口页</h3>
          <a-table :columns="columns" :dataSource="landingPage" :loading="tableLoading" bordered size="middle" class="baidu-overview-anttable"></a-table>
        </div>
        <div class="baidu-overview-table">
          <h3>访问页</h3>
          <a-table :columns="columns" :dataSource="visitPage" :loading="tableLoading" bordered size="middle" class="baidu-overview-anttable"></a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.baidu-overview-box {
  margin-top: 20px;
  .baidu-overview-item {
    display: flex;
    margin-top: 20px;
    .baidu-overview-table {
      display: flex;
      flex-direction: column;
      flex: 1;
      &:last-child {
        margin-left: 20px;
      }
      h3 {
        font-weight: bold;
      }
      .baidu-overview-anttable {
        flex: 1;
      }
    }
  }
  .baidu-overview-data {
    display: flex;
    flex-direction: column;
    flex: 1;
    h3 {
      font-weight: bold;
    }
    .baidu-overview-data-main {
      display: flex;
      justify-content: center;
      margin: 0 10%;
    }
    .baidu-overview-data-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-right: 1px dashed #cccccc;
      &:last-child {
        border: 0;
      }
      .baidu-overview-data-num {
        font-size: 32px;
        font-weight: bold;
        display: block;
      }
      .baidu-overview-data-title {
        color: #999999;
      }
    }
    .baidu-overview-data-spin {
      position: absolute;
    }
  }
}
</style>