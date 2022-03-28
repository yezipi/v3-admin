<!--友链管理，2021-12-02-->
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import confirm from '@/utils/confirm'

const columns = reactive([
  {
    title: '名称',
    dataIndex: 'nickname',
    width: 100,
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: 300,
  },
  {
    title: '回复',
    dataIndex: 'reply_content',
    width: 300,
  },
  {
    title: '通知',
    dataIndex: 'notice',
    width: 100,
  },
  {
    title: '站点',
    dataIndex: 'site',
    width: 150,
    noTransform: true,
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 150,
  },
  {
    title: '终端',
    dataIndex: 'ua',
    width: 100,
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    width: 100,
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    format: 'YYYY-MM-DD hh:mm',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
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
    columns.unshift({
      title: '排序',
      dataIndex: 'sort',
      width: 100,
    })
    columns.splice(columns.length - 3, 0, {
      title: '推荐',
      dataIndex: 'recommend',
      width: 100,
    })
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

      <template #bodyCell="{ scope: { column: { dataIndex }, record } }">

        <template v-if="dataIndex === 'recommend'">
          <a-switch :checked="record.recommend" @change="toUpdate(record, $event, 'recommend')" />
        </template>

        <template v-if="dataIndex === 'status'">
          <a-switch :checked="record.status" @change="toUpdate(record, $event, 'status')" />
        </template>

        <template v-if="dataIndex === 'notice'">
          <span v-if="record.notice" style="color: forestgreen;">已通知</span>
          <span v-else style="color: #999999;">未通知</span>
        </template>

        <template v-if="dataIndex === 'site'">
          <a v-if="record.site" rel="nofollow" :href="record.site" target="_blank">{{ record.site }}</a>
          <span v-else>-</span>
        </template>

        <template v-if="dataIndex === 'address'">
          <span>{{ record.province + record.city + record.address }}</span>
        </template>

        <template v-if="dataIndex === 'action'">
          <span>
            <a @click="toEdit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a @click="toDelete(record)">删除</a>
          </span>
        </template>

      </template>

    </yzp-table>

    <comments-edit
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
