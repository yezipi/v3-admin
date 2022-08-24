<script lang="ts" setup>
import { FormOutlined, EditOutlined, BookOutlined, SettingOutlined, SkinOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import dayjs from 'dayjs'
import ReportApi from '@/api/report'

const totalEles = ref<any>([
  { name: '文章数量', icon: 'icon_article.png', key: 'article', count: 0 },
  { name: '微语数量', icon: 'icon_mood.png', key: 'mood', count: 0 },
  { name: '图片数量', icon: 'icon_picture.png', key: 'picture', count: 0 },
  { name: '评论数量', icon: 'icon_comment.png', key: 'comment', count: 0 },
  { name: '留言数量', icon: 'icon_feedback.png', key: 'feedback', count: 0 },
  { name: '友链数量', icon: 'icon_link.png', key: 'blogroll', count: 0 },
])

const startDate = ref(dayjs().subtract(1, 'week').format('YYYYMMDD'))
const endDate = ref(dayjs().subtract(1, 'day').format('YYYYMMDD'))
const day1 = ref(dayjs().format('YYYYMMDD'))
const day2 = ref(dayjs().add(1, 'day').format('YYYYMMDD'))
const dayRef = ref()
const districtRef = ref()
const keywordsRef = ref()
const pageRef = ref()
const logs = ref<any[]>([])
const unAudit = ref<{ feedback: number, comment: number, blogroll: number }>({
  feedback: 0,
  comment: 0,
  blogroll: 0,
})

// 获取内容统计
const getTotalCount = async () => {
  const { data } = await ReportApi.getTotalCount()
  totalEles.value = totalEles.value.map((e: any) => {
    e.count = data[e.key]
    return e
  })
}

// 获取未审核内容
const getUnAudit = async () => {
  const { data } = await ReportApi.getUnAudit()
  unAudit.value = data
}

// 获取操作日志
const getOperationLogs = async () => {
  const { data } = await ReportApi.getOperationLogs({ size: 5, page: 1 })
  logs.value = data.rows
}

getUnAudit()
getTotalCount()
getOperationLogs()

</script>

<template>
  <div class="yzp-home-page">
    <div class="yzp-home-left">
      <div class="yzp-count-wrap">
        <div v-for="(item, index) in totalEles" :key="index" class="yzp-count-item">
          <div class="yzp-count-main">
            <span class="yzp-count-name">{{ item.name }}</span>
            <div class="yzp-count-text">
              <div class="yzp-count-icon" :style="{ background: `url(../src/assets/img/${item.icon}) no-repeat center` }"></div>
              <span class="yzp-count-number">{{ item.count || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="yzp-charts-part">
        <day-charts class="yzp-charts-item" ref="dayRef" :start-date="startDate" :end-date="endDate"></day-charts>
        <district-charts class="yzp-charts-item" ref="districtRef" :start-date="startDate" :end-date="endDate"></district-charts>
      </div>

      <div class="yzp-charts-part">
        <keywords-charts class="yzp-charts-item" ref="keywordsRef" :start-date="day1" :end-date="day2" style="margin-right: 10px;"></keywords-charts>
        <page-charts class="yzp-charts-item" ref="pageRef" :start-date="day1" :end-date="day2"></page-charts>
      </div>
    </div>

    <div class="yzp-home-right">
      <div class="yzp-home-opt">
        <h4>我的待办</h4>
        <div class="yzp-home-todo">
          <div class="yzp-home-todo-item">
            <span>待审核评论：</span>
            <strong>{{ unAudit.comment }}</strong>
            <a-button v-if="unAudit.comment" type="link" @click="$router.push('/comment/list')">去处理</a-button>
          </div>
          <div class="yzp-home-todo-item">
            <span>待审核留言：</span>
            <strong>{{ unAudit.feedback }}</strong>
            <a-button v-if="unAudit.feedback" type="link" @click="$router.push('/feedback/list')">去处理</a-button>
          </div>
          <div class="yzp-home-todo-item">
            <span>待审核友链：</span>
            <strong>{{ unAudit.blogroll }}</strong>
            <a-button v-if="unAudit.blogroll" type="link" @click="$router.push('/blogroll/list')">去处理</a-button>
          </div>
        </div>
      </div>

      <div class="yzp-home-opt">
        <h4>快捷操作</h4>
        <div class="yzp-home-opt-wrap" style="margin-top: 0">
          <div class="yzp-home-opt-cell">
            <a href="/article/add" class="yzp-home-opt-icon">
              <form-outlined class="yzp-home-opt-icon" />
            </a>
            <span class="yzp-home-opt-name">文章发布</span>
          </div>
          <div class="yzp-home-opt-cell">
            <a href="/mood/add" class="yzp-home-opt-icon">
              <edit-outlined class="yzp-home-opt-icon" />
            </a>
            <span class="yzp-home-opt-name">微语发布</span>
          </div>
          <div class="yzp-home-opt-cell">
            <a href="/article/list" class="yzp-home-opt-icon">
              <book-outlined class="yzp-home-opt-icon" />
            </a>
            <span class="yzp-home-opt-name">文章管理</span>
          </div>
          <div class="yzp-home-opt-cell">
            <a href="/dashboard/visitors" class="yzp-home-opt-icon">
              <team-outlined class="yzp-home-opt-icon" />
            </a>
            <span class="yzp-home-opt-name">实时访客</span>
          </div>
          <div class="yzp-home-opt-cell">
            <a href="/settings/base" class="yzp-home-opt-icon">
              <setting-outlined />
            </a>
            <span class="yzp-home-opt-name">基本设置</span>
          </div>
          <div class="yzp-home-opt-cell">
            <a href="/settings/custom" class="yzp-home-opt-icon">
              <skin-outlined />
            </a>
            <span class="yzp-home-opt-name">个性化设置</span>
          </div>
        </div>
      </div>

      <div class="yzp-home-opt">
        <h4>操作日志</h4>
        <div v-if="logs.length" class="yzp-home-logs">
          <div v-for="(item, index) in logs" :key="index" class="yzp-home-log-item">
            <div class="yzp-home-log-detail">
              <span class="yzp-home-log-name">{{ item.user_name + ' ' + item.description }}</span>
              <span class="yzp-home-log-location">{{ item.province + item.city + ' ' + item.ua }}</span>
            </div>
            <span class="yzp-home-log-date">{{ dayjs(item.created_at).format('YYYY-MM-DD hh:mm') }}</span>
          </div>
        </div>
        <a-empty v-else />
      </div>

    </div>

  </div>
</template>

<style scoped lang="less">
.yzp-home-page {
  display: flex;
  justify-content: space-between;
  background: none!important;
  padding: 0;
  .yzp-home-left {
    width: 75%;
    background: var(--bg-white);
    border-radius: 6px;
  }
  .yzp-home-right {
    width: 23.5%;
  }
  .yzp-home-opt {
    padding: 20px;
    background: var(--bg-white);
    border-radius: 6px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .yzp-home-opt-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 20px;
    }
    .yzp-home-opt-cell {
      width: 30%;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .yzp-home-opt-name {
      font-size: 12px;
      color: var(--color-gray);
    }
    .yzp-home-opt-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--bg-primary);
      transition: all 0.3s;
      margin-bottom: 5px;
      &:hover {
        background: #dddddd;
      }
    }
  }
  .yzp-home-logs {
    .yzp-home-log-item {
      border-bottom: 1px solid #eeeeee;
      padding: 5px 0;
      &:last-child {
        border: 0;
      }
      .yzp-home-log-detail {
        display: flex;
        justify-content: space-between;
      }
      .yzp-home-log-location, .yzp-home-log-date {
        font-size: 12px;
        color: #999999;
      }
    }
  }
  .yzp-count-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 20px;
    .yzp-count-item {
      width: 15%;
      background: rgba(255,255,255,0.5);
      border-right: 1px solid #eeeeee;
      &:last-child {
        border: 0;
      }
      .yzp-count-main {
        padding: 10px;
      }
      .yzp-count-icon {
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
      .yzp-count-text {
        display: flex;
        align-items: center;
      }
      .yzp-count-name {
        display: block;
        color: #999999;
      }
      .yzp-count-number {
        font-size: 24px;
        font-weight: bold;
        color: #333333;
      }
      .yzp-count-name {
        color: #999999;
      }
    }
  }
  .yzp-charts-part {
    display: flex;
    padding: 0 20px;
    .yzp-charts-item {
      flex: 1;
    }
  }
  :deep(.ant-table.ant-table-small) {
    font-size: 12px;
  }
}

.yzp-home-todo {
  .yzp-home-todo-item {
    span {
      color: #999999;
    }
    strong {
      color: red;
    }
  }
}

</style>