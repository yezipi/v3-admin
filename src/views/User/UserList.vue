<template>
  <div class="page-list">

    <yzp-table :columns="columns" ref="tableRef" url="User.getList">

      <template #filter>
        <div></div>
        <a-button type="primary" @click="toCreate">+ 创建账号</a-button>
      </template>

      <template #status="{ scope }">
        <a-switch v-if="scope.record.role === 'admin'" :checked="scope.record.status" @change="changeStatus(scope.record, $event)" />
        <span v-else>正常</span>
      </template>

      <template #role="{ scope }">
        <span>{{ setUserRole(scope.record.role) }}</span>
      </template>

      <template #createdAt="{ scope }">
        <span>{{ formatDate(scope.record.createdAt, 'YYYY-MM-DD hh:mm') }}</span>
      </template>

      <template #action="{ scope }">
        <span>
          <a @click="toEdit(scope.record.id)">编辑</a>
          <template v-if="scope.record.role === 'admin'">
            <a-divider type="vertical" />
            <a @click="confirmDelete(scope.record.id)">删除</a>
          </template>
        </span>
      </template>
    </yzp-table>

    <user-edit v-model:visible="drawVisible" :id="userId" @change="initList"></user-edit>

  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { Modal } from 'ant-design-vue'
import UserApi from '@/api/user'
import confirm from '@/utils/confirm'
import { formatDate } from '@/utils/index'
import DICT, { UserRole } from '@/dict/index'

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
        slots: { customRender: 'role' },
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
    const userId = ref()
    const drawVisible = ref(false)
    const setUserRole = (role: UserRole) => DICT.USER_ROLE[role]

    // 隐藏显示
    const changeStatus = async (item: any, checked: boolean) => {
      const { status, id } = item
      try {
        await UserApi.update(id, { status: checked })
        item.status = checked
      } catch (e) {
        item.status = !status
      }
    }

    const toEdit = (id: string) => {
      userId.value = id
      drawVisible.value = true
    }

    const toCreate = () => {
      userId.value = ''
      drawVisible.value = true
    }

    // 删除
    const confirmDelete = (id: any) => {
      if (useStore().state.user.id === id) {
        Modal.info({
          title: '温馨提示',
          content: '这是您当前登录的用户，不能删除'
        })
        return
      }
      confirm('确定删除该用户吗？', async () => {
        await UserApi.destory(id)
        initList()
      })
    }

    const initList = () => {
      tableRef.value.init()
    }

    return {
      columns,
      tableRef,
      userId,
      drawVisible,
      changeStatus,
      confirmDelete,
      toEdit,
      formatDate,
      setUserRole,
      toCreate,
      initList,
    }
  }
})
</script>
