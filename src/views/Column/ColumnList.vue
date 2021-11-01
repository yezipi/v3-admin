<template>
  <div class="page-list">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="{ total, pageSize: 10 }"
      childrenColumnName="subcolumn"
      rowKey="id"
      size ="middle"
      @change="onPageChange"
    >

      <template #new_window="{ record }">
        <span>{{ record.new_window ? '新窗口' : '当前窗口' }}</span>
      </template>

      <template #status="{ record }">
        <a-switch :checked="record.status" @change="onStatusChange(record, $event)" />
      </template>

      <template #action="{ record }">
        <a v-if="record.type === 'article' || record.type === 'case'" @click="toAdd(record.id)">编辑</a>
        <a @click="toEdit(record.id)">编辑</a>
        <template v-if="record.can_delete">
          <a-divider type="vertical" />
          <a>删除</a>
        </template>
      </template>

    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import ColumnApi from '@/api/column'
import confirm from '@/utils/confirm'

export default defineComponent({
  components: { EditOutlined },
  setup() {
    const tableConfig = reactive({
      dataSource: [],
      columns: [
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
          slots: { customRender: 'new_window' },
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
      ],
      total: 0,
      current: 1
    })

    // 获取列表
    const getList = async () => {
      const page = tableConfig.current
      const { data: { rows, count } } = await ColumnApi.getList({ page })
      tableConfig.dataSource = rows.map((e: any) => {
        if (!e.subcolumn.length) {
          delete e.subcolumn
        }
        return e
      })
      tableConfig.total = count
    }

    // 分页
    const onPageChange = (e: { current: number }) => {
      tableConfig.current = e.current
      getList()
    }

    // 隐藏显示
    const onStatusChange = async (item: { status: boolean, id: string }, checked: boolean) => {
      const { status, id } = item
      if (status === checked) {
        return
      }
      try {
        await ColumnApi.updateColumn(id, { status: checked })
        getList()
      } catch (e) {
        item.status = !status
      }
    }

    const toEdit = (id: string) => {
      // router.push('/ArticleEdit?id=' + id)
      console.log(id)
    }

    const toAdd = (id: string) => {
      // todo
    }

    // 删除
    const confirmDelete = (id: string) => {
      confirm('确定删除该分类吗？', async () => {
        await ColumnApi.destorySubColumn(id)
        getList()
      })
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(tableConfig),
      onPageChange,
      onStatusChange,
      confirmDelete,
      toAdd,
      toEdit,
    }
  }
})
</script>

<style lang="less" scoped>
.page-filter {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .column-select {
    margin-right: 10px;
  }
  .filter-left, .filter-right {
    display: flex;
    align-items: center;
  }
}
</style>
