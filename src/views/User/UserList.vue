<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="User.getList">

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="onStatusChange(scope.record, $event)" />
      </template>

      <template #createdAt="{ scope }">
        <span>{{ formatDate(scope.record.createdAt, 'YYYY-MM-DD hh:mm') }}</span>
      </template>

      <template #action="{ scope }">
        <span>
          <a @click="toEdit(scope.record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="confirmDelete(scope.record.id)">删除</a>
        </span>
      </template>
    </yzp-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleApi from '@/api/article'
import confirm from '@/utils/confirm'
import { formatDate } from '@/utils/index'

export default defineComponent({
  setup() {
    const columns = reactive([
      {
        title: '账号',
        dataIndex: 'name',
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
      },
      {
        title: '角色',
        dataIndex: 'role',
        dict: {
          admin: '普通管理员',
          super: '超级管理员'
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        slots: { customRender: 'status' },
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        slots: { customRender: 'createdAt' },
      },
      {
        title: '操作',
        key: 'action',
        slots: { customRender: 'action' },
      },
    ])

    const tableRef = ref() 

    const router = useRouter()

    // 隐藏显示
    const onStatusChange = async ({ status, id }: { status: boolean, id: string }, checked: boolean) => {
      if (status === checked) {
        return
      }
      try {
        await ArticleApi.update(id, { status: checked })
      } catch (e) {
        status = !status
      }
    }

    const toEdit = (id: string) => {}

    // 删除
    const confirmDelete = (id: string) => {
      confirm('确定删除该文章吗？', async () => {
        await ArticleApi.destory(id)
      })
    }

    return {
      columns,
      tableRef,
      onStatusChange,
      confirmDelete,
      toEdit,
      formatDate,
    }
  }
})
</script>
