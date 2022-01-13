<script lang="ts" setup>
import { ref } from 'vue'
import ReportApi from '@/api/report'

const totalCount: any = {}
const totalEles = ref<any>([
  { name: '文章数量', icon: 'icon_article.png', key: 'article', count: 0 },
  { name: '微语数量', icon: 'icon_mood.png', key: 'mood', count: 0 },
  { name: '图片数量', icon: 'icon_picture.png', key: 'picture', count: 0 },
  { name: '评论数量', icon: 'icon_comment.png', key: 'comment', count: 0 },
  { name: '留言数量', icon: 'icon_feedback.png', key: 'feedback', count: 0 },
  { name: '友链数量', icon: 'icon_link.png', key: 'blogroll', count: 0 },
])

const getTotalCount = async () => {
  const { data } = await ReportApi.getTotalCount()
  totalEles.value = totalEles.value.map((e: any) => {
    e.count = data[e.key]
    return e
  })
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
  </div>
</template>

<style scoped lang="less">
.count-wrap {
  display: flex;
  justify-content: space-between;
  .count-item {
    width: 15%;
    border-radius: 6px;
    background: rgba(255,255,255,0.5);
    .count-main {
      padding: 15px;
    }
    .count-icon {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      background-size: 70%!important;
    }
    .count-text {
      margin-top: 5px;
      display: flex;
      align-items: center;
    }
    .count-name {
      display: block;
      color: #999999;
    }
    .count-number {
      font-size: 30px;
      font-weight: bold;
      color: #333333;
    }
    .count-name {
      color: #999999;
    }
  }
}
</style>