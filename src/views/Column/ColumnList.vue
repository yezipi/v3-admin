<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Column.getList" childrenColumnName="subcolumn">

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="onStatusChange(scope.record, $event)" />
      </template>

      <template #createdAt="{ scope }">
        <span>{{ formatDate(scope.record.createdAt, 'YYYY-MM-DD hh:mm') }}</span>
      </template>

      <template #type="{ scope }">
        <span>{{ setColumnTypeText(scope.record.type) }}</span>
      </template>

      <template #sort="{ scope }">
        <a v-if="!scope.record.showSortInput" class="sort-wrap" @click="showSortInput(scope.record)">
          <span>{{ scope.record.sort }}</span>
          <EditOutlined />
        </a>
        <div v-else class="sort-wrap">
          <a-input v-model:value="scope.record.sort" class="sort-input" size="small" type="number" placeholder="请输入数字" @pressEnter="confirmSortChange(scope.record)" />
          <a @click="confirmSortChange(scope.record)"><CheckOutlined /></a>
        </div>
      </template>

      <template #action="{ scope }">
        <template v-if="(scope.record.type === 'article' || scope.record.type === 'case') && !scope.record.column_id">
          <a @click="toAdd(scope.record.id)">添加</a>
          <a-divider type="vertical" />
        </template>
        <a @click="toEdit(scope.record)">编辑</a>
        <template v-if="scope.record.can_delete">
          <a-divider type="vertical" />
          <a @click="confirmDelete(scope.record)">删除</a>
        </template>
      </template>
    </yzp-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined, CheckOutlined } from '@ant-design/icons-vue'
import ColumnApi from '@/api/column'
import confirm from '@/utils/confirm'
import { formatDate } from '@/utils/index'
import DICT, { ColumnType } from '@/dict/index'

export default defineComponent({
  components: {
    EditOutlined,
    CheckOutlined,
  },
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
        slots: { customRender: 'type' },
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
        width: 120,
        slots: { customRender: 'sort' },
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
    const drawState = reactive({
      data: {} as any,
      title: '编辑',
      visible: false
    })

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

    // 删除
    const confirmDelete = (item: { id: number, column_id: number, name: string }) => {
      const { id, column_id, name } = item
      confirm(`确定删除${name}吗？`, async () => {
        if (!column_id) {
          await ColumnApi.destoryColumn(id)
        } else {
          await ColumnApi.destorySubColumn(id)
        }
        tableRef.value.init()
      })
    }

    const toEdit = (item: { id: number, column_id: number }) => {
      const { id, column_id } = item
      if (!column_id) {
        router.push({
          name: 'ColumnEdit',
          query: { id }
        })
      } else {
        router.push({
          name: 'SubColumnEdit',
          query: { id, column_id }
        })
      }
    }

    const toAdd = (id: number) => {
      router.push({ name: 'SubColumnAdd', query: { column_id: id } })
    }

    const showSortInput = (e: any) => {
      e.showSortInput = true
    }

    const confirmSortChange = async (e: any) => {
      await ColumnApi.updateColumn(e.id, { sort: e.sort })
      e.showSortInput = false
      tableRef.value.init()
    }

    const setColumnTypeText = (type: ColumnType) => DICT.COLUMN_TYPE[type]

    const onUpdate = () => {}

    return {
      columns,
      tableRef,
      drawState,
      onStatusChange,
      confirmDelete,
      toAdd,
      toEdit,
      formatDate,
      showSortInput,
      confirmSortChange,
      onUpdate,
      setColumnTypeText,
    }
  }
})
</script>

<style lang="less" scoped>
.sort-wrap {
  display: flex;
  align-items: center;
  .sort-input {
    width: 50px;
    margin-right: 10px;
    text-align: center;
    padding: 0!important;
  }
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
