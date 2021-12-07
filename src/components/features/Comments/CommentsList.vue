<!--友链管理，2021-12-02-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '名称',
    dataIndex: 'nickname',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
  {
    title: '站点',
    dataIndex: 'site',
  },
  {
    title: 'ip',
    dataIndex: 'ip',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '终端',
    dataIndex: 'ua',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' },
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    format: 'YYYY-MM-DD'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
  },
])

const props = defineProps({
  api: {
    type: Object,
    default: () => {}
  },
  // 类型，blogroll, comment, feedback
  type: {
    type: String,
    default: 'comment'
  },
})

const { api, type } = props

const tableRef = ref()
const currId = ref()
const drawVisible = ref(false)
const title = ref()

switch (type) {
  case 'blogroll':
    title.value = '友链'
    break;
  case 'comment':
    title.value = '评论'
    break;
  case 'feedback':
    title.value = '留言'
    break;
  default:
    break;
}

const toEdit = (id: string) => {
  currId.value = id
  drawVisible.value = true
}

const toCreate = () => {
  currId.value = ''
  drawVisible.value = true
}

// 删除
const toDelete = (item: any) => {
  confirm(`确定删除【${item.nickname}】的${title.value}吗？`, async () => {
    await api.destory(item.id)
    initList()
  })
}

// 更新
const toUpdate =async (item: any, checked: boolean, key: any) => {
  const { id } = item
  const obj: any = {}
  obj[key] = checked
  try {
    await api.update(id, obj)
    item[key] = checked
  } catch (e) {
    item[key] = !item[key]
  }
}

const initList = () => {
  tableRef.value.init()
}

// 首字母转大写
const firstToUpper = (str: string) => {
  return str.trim().toLocaleLowerCase().replace(str[0], str[0].toUpperCase())
}

const fnName = firstToUpper(type) + '.getList'

</script>

<template>
  <div class="page-list">
    <yzp-table :columns="columns" ref="tableRef" :url="fnName">
      <template #filter>
        <div></div>
        <a-button v-if="type !== 'comment'" type="primary" @click="toCreate">+ 创建{{ title }}</a-button>
      </template>

      <template #status="{ scope }">
        <a-switch :checked="scope.record.status" @change="toUpdate(scope.record, $event, 'status')" />
      </template>

      <template #action="{ scope }">
        <span>
          <a @click="toEdit(scope.record.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="toDelete(scope.record)">删除</a>
        </span>
      </template>
    </yzp-table>

    <comments-edit
      v-if="type !== 'comment'"
      v-model:visible="drawVisible"
      :api="api"
      :id="currId"
      :type="type"
      :title="title"
      @finish="initList"
    >
    </comments-edit>

  </div>
</template>
