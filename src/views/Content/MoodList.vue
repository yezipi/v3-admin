<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="Mood.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 发布微语</a-button>
      </template>

      <template #bodyCell="{ scope: { record, column: { dataIndex } } }">
        <template v-if="dataIndex === 'content'">
          <div style="white-space: pre-line;">{{ record.content }}</div>
        </template>

        <template v-if="dataIndex === 'images'">
          <div v-if="record.images.length" class="content-imgs">
            <img v-for="(item, index) in record.images" :key="index" :src="item"/>
          </div>
        </template>

        <template v-if="dataIndex === 'action'">
          <span>
            <a @click="toEdit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a @click="confirmDelete(record)">删除</a>
          </span>
        </template>
      </template>
    </yzp-table>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import MoodApi from '@/api/mood'
import confirm from '@/utils/confirm'

export default defineComponent({
  setup() {
    const columns = reactive([
      {
        title: '内容',
        dataIndex: 'content',
        width: 300,
      },
      {
        title: '图片',
        dataIndex: 'images',
        width: 300,
      },
      {
        title: '评论',
        dataIndex: 'comments_count',
        noTransform: true,
        width: 100,
      },
      {
        title: '浏览',
        dataIndex: 'view',
        width: 100,
        noTransform: true
      },
      {
        title: '状态',
        dataIndex: 'status',
        dict: {
          false: '隐藏',
          true: '显示'
        },
        width: 100,
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        width: 200,
        format: 'YYYY-MM-DD'
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
      },
    ])

    const tableRef = ref()
    const Router = useRouter()

    const toEdit = (id: string) => {
      Router.push({ name: 'MoodEdit', query: { id } })
    }

    const toCreate = () => {
      Router.push({ name: 'MoodAdd' })
    }

    // 删除
    const confirmDelete = (item: any) => {
      confirm(`确定删除这条微语吗？`, async () => {
        await MoodApi.destory(item.id)
        initList()
      })
    }

    const initList = () => {
      tableRef.value.init()
    }

    return {
      columns,
      tableRef,
      confirmDelete,
      toEdit,
      toCreate,
    }
  }
})
</script>

<style lang="less" scoped>
.content-imgs img, .video{
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin: 5px;
  cursor: pointer;
}
.content-imgs img:hover, .video:hover {
  opacity: 0.5;
}
</style>
