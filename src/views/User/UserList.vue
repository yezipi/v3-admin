<template>
  <div>
    <a-table :dataSource="dataSource" :columns="columns" rowKey="id" size ="middle">
      <template #createdAt="{ record }">
        <span>{{ record.createdAt.substr(0, 10) }}</span>
      </template>
      <template #action>
        <span>
          <a>编辑</a>
          <a-divider type="vertical" />
          <a>删除</a>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { UserApi } from '../../api'

export default defineComponent({
  setup() {
    const dataSource = ref([])
    const columns = ref([
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
      },
      {
        title: '状态',
        dataIndex: 'status',
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

    const getList = (async () => {
      const { data } = await UserApi.getList()
      dataSource.value = data.rows
    });

    onMounted(() => {
      getList()
    })

    return {
      dataSource,
      columns
    }
  }
})
</script>

