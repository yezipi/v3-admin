<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Column.getList" childrenColumnName="subcolumns">
      <template #filter>
        <div></div>
        <a-button type="primary" @click="$router.push({ name: 'ColumnEdit' })">+ 创建栏目</a-button>
      </template>

      <template #columns="{ scope: { record, column: { dataIndex } } }">

        <template v-if="dataIndex === 'status'">
          <a-switch :checked="record.status" @change="changeStatus(record, $event)" />
        </template>

        <template v-if="dataIndex === 'createdAt'">
          <span>{{ formatDate(record.createdAt, 'YYYY-MM-DD hh:mm') }}</span>
        </template>

        <template v-if="dataIndex === 'type'">
          <span>{{ setColumnTypeText(record.type) }}</span>
        </template>

        <template v-if="dataIndex === 'sort'">
          <a v-if="!record.showSortInput" class="sort-wrap" @click="showSortInput(record)">
            <span>{{ record.sort }}</span>
            <EditOutlined />
          </a>
          <div v-else class="sort-wrap">
            <a-input
              v-model:value="record.sort"
              class="sort-input"
              size="small"
              type="number"
              placeholder="请输入数字"
              @pressEnter="confirmSortChange(record)"
            />
            <a @click="confirmSortChange(record)"><CheckOutlined /></a>
          </div>
        </template>

        <template v-if="dataIndex === 'action'">
          <template v-if="(record.type === 'article' || record.type === 'case') && !record.column_id">
            <a @click="toAdd(record.id)">添加</a>
            <a-divider direction ="vertical" />
          </template>
          <a @click="toEdit(record)">编辑</a>
          <template v-if="record.can_delete">
            <a-divider direction ="vertical" />
            <a @click="confirmDelete(record)">删除</a>
          </template>
        </template>

      </template>

    </yzp-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { EditOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { formatDate } from '@/utils/index'
import DICT, { ColumnType } from '@/dict/index'
import ColumnApi from '@/api/column'
import confirm from '@/utils/confirm'

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
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        dataIndex: 'action',
      },
    ])

    const tableRef = ref()

    const router = useRouter()

    // 隐藏显示
    const changeStatus = async (item: any, checked: boolean) => {
      const { status, id } = item
      try {
        await ColumnApi.updateColumn(id, { status: checked })
        item.status = checked
      } catch (e) {
        item.status = !status
      }
    }

    // 删除
    const confirmDelete = (item: { id: number, column_id: number, name: string }) => {
      const { id, column_id, name } = item
      confirm(`确定删除【${name}】吗？`, async () => {
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
      console.log(e)
      const { sort, id } = e
      if (typeof Number(sort) !== 'number') {
        message.error('请输入数字')
        return
      }
      await ColumnApi.updateColumn(id, { sort })
      e.showSortInput = false
      tableRef.value.init()
    }

    const setColumnTypeText = (type: ColumnType) => DICT.COLUMN_TYPE[type]

    const onUpdate = () => {}

    return {
      columns,
      tableRef,
      changeStatus,
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
