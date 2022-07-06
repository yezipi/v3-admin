<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MailApi from '@/api/mail'
import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '发件人',
    dataIndex: 'send_mail',
  },
  {
    title: '收件人',
    dataIndex: 'receive_mail',
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '结果',
    dataIndex: 'reason',
  },
  {
    title: '时间',
    dataIndex: 'created_at',
    format: 'YYYY-MM-DD hh:mm'
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
])

const tableRef = ref()

const initList = () => {
  tableRef.value.init()
}

// 删除
const confirmDelete = (item: any) => {
  confirm(`确定删除这条记录吗？`, async () => {
    await MailApi.destory(item.id)
    initList()
  })
}
</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" url="Mail.getList">
      <template #bodyCell="{ scope: { record, column } }">
        <template v-if="column.dataIndex === 'content'">
          <a-popover placement="top">
            <template #content>
              <div v-html="record.content.replace('box-shadow', '').replace('border: 1px solid #eeeeee', '')" style="max-width: 500px;"></div>
            </template>
            <template #title>
              <span>发送内容</span>
            </template>
            <a>查看详情</a>
          </a-popover>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span v-if="record.status" style="color: forestgreen;">成功</span>
          <span v-else style="color: red">失败</span>
        </template>
        <div v-if="column.dataIndex === 'action'">
          <a @click="confirmDelete(record)">删除</a>
        </div>
      </template>
    </yzp-table>
  </div>
</template>
