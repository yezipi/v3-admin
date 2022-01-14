<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ReloadOutlined } from '@ant-design/icons-vue'
import ReportApi from '@/api/report'
import { message } from 'ant-design-vue'


const totalEles = ref<any>([
  { name: '文章数量', icon: 'icon_article.png', key: 'article', count: 0 },
  { name: '微语数量', icon: 'icon_mood.png', key: 'mood', count: 0 },
  { name: '图片数量', icon: 'icon_picture.png', key: 'picture', count: 0 },
  { name: '评论数量', icon: 'icon_comment.png', key: 'comment', count: 0 },
  { name: '留言数量', icon: 'icon_feedback.png', key: 'feedback', count: 0 },
  { name: '友链数量', icon: 'icon_link.png', key: 'blogroll', count: 0 },
])

const startDate = ref(dayjs().startOf('week').add(1, 'day').format('YYYYMMDD'))
const endDate = ref(dayjs().endOf('week').add(1, 'day').format('YYYYMMDD'))
const day1 = ref(dayjs().format('YYYYMMDD'))
const day2 = ref(dayjs().add(1, 'day').format('YYYYMMDD'))
const dayRef = ref()
const districtRef = ref()
const keywordsRef = ref()
const pageRef = ref()

// 获取内容统计
const getTotalCount = async () => {
  const { data } = await ReportApi.getTotalCount()
  totalEles.value = totalEles.value.map((e: any) => {
    e.count = data[e.key]
    return e
  })
}

// 刷新token，刷新数据
const refreshData = async () => {
  await ReportApi.getBaiduToken(true)
  dayRef.value.init()
  districtRef.value.init()
  keywordsRef.value.init()
  pageRef.value.init()
  message.success('刷新成功')
}

getTotalCount()

</script>

<template>
  <div class="home-page">

    <div class="count-wrap">
      <div v-for="(item, index) in totalEles" :key="index" class="count-item">
        <div class="count-main">
          <span class="count-name">{{ item.name }}</span>
          <div class="count-text">
            <div class="count-icon" :style="{ background: `url(../src/assets/img/${item.icon}) no-repeat center` }"></div>
            <span class="count-number">{{ item.count || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <a-button size="small" type="link" @click="refreshData">
      <template #icon><reload-outlined /></template>
      刷新数据
    </a-button>

    <div class="charts-part">
      <day-charts class="charts-item" ref="dayRef" :start-date="startDate" :end-date="endDate"></day-charts>
      <district-charts class="charts-item" ref="districtRef" :start-date="startDate" :end-date="endDate"></district-charts>
    </div>

    <div class="charts-part">
      <keywords-charts class="charts-item" ref="keywordsRef" :start-date="day1" :end-date="day2"></keywords-charts>
      <page-charts class="charts-item" ref="pageRef" :start-date="day1" :end-date="day2"></page-charts>
    </div>

  </div>
</template>

<style scoped lang="less">
.count-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .count-item {
    width: 15%;
    border-radius: 6px;
    background: rgba(255,255,255,0.5);
    border-right: 1px solid #eeeeee;
    &:last-child {
      border: 0;
    }
    .count-main {
      padding: 10px;
    }
    .count-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      background-size: 70%!important;
    }
    .count-text {
      display: flex;
      align-items: center;
    }
    .count-name {
      display: block;
      color: #999999;
    }
    .count-number {
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }
    .count-name {
      color: #999999;
    }
  }
}
.charts-part {
  display: flex;
  margin-top: 15px;
  .charts-item {
    flex: 1;
  }
}
</style>