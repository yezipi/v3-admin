<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import ReportApi from '@/api/report'

interface Overview {
  landingPage: any,
  sourceSite: any,
  visitPage: any,
  visitType: any,
  word: any,
}

const overview = ref<Overview>({
  landingPage: {},
  sourceSite: {},
  visitPage: {},
  visitType: {},
  word: {},
})

const startDate = ref(dayjs().subtract(1, 'week').format('YYYYMMDD'))
const endDate = ref(dayjs().subtract(1, 'day').format('YYYYMMDD'))

const getBaiduOverview = async () => {
  const { data } = await ReportApi.getBaiduOverview(startDate.value, endDate.value)
  overview.value = data
}

getBaiduOverview()

</script>

<template>
  <div class="baidu-overview">
    <div class="baidu-over-view-item">
      <map-chart :startDate="startDate" :endDate="endDate"></map-chart>
      <engine-chart :data="overview.sourceSite" :startDate="startDate" :endDate="endDate"></engine-chart>
    </div>
  </div>
</template>

<style scoped lang="less">
.baidu-overview {
  .baidu-over-view-item {
    display: flex;
    height: 400px;
  }
}
</style>