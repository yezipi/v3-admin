<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" childrenColumnName="subcolumn" url="Column.getList">
      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="onStatusChange(scope.record, $event)" />
      </template>

      <template #createdAt="{ scope }">
        <span>{{ formatDate(scope.record.createdAt, 'YYYY-MM-DD hh:mm') }}</span>
      </template>

      <template #action="{ scope }">
        <template v-if="scope.record.type === 'article' || scope.record.type === 'case'">
          <a @click="toAdd(scope.record.id)">添加</a>
          <a-divider type="vertical" />
        </template>
        <a @click="toEdit(scope.record.id)">编辑</a>
        <template v-if="scope.record.can_delete">
          <a-divider type="vertical" />
          <a>删除</a>
        </template>
      </template>
    </yzp-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ColumnApi from '@/api/column'
import confirm from '@/utils/confirm'
import { formatDate } from '@/utils/index'

export default defineComponent({
  setup() {
    const columns = reactive([
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '路径',
        dataIndex: 'url',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '是否新窗口',
        dataIndex: 'new_window',
        dict: {
          false: '当前窗口',
          true: '新窗口'
        }
      },
      {
        title: '排序  ',
        dataIndex: 'sort',
      },
      {
        title: '状态',
        dataIndex: 'status',
        slots: { customRender: 'status' },
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
        await ColumnApi.updateColumn(id, { status: checked })
      } catch (e) {
        status = !status
      }
    }

    const toEdit = (id: string) => { }

    // 删除
    const confirmDelete = (id: string) => {
      confirm('确定删除该分类吗？', async () => {
        await ColumnApi.destorySubColumn(id)
      })
    }

    const toAdd = (id: string) => {
      // todo
    }

    return {
      columns,
      tableRef,
      onStatusChange,
      confirmDelete,
      toAdd,
      toEdit,
      formatDate,
    }
  }
})
</script>
