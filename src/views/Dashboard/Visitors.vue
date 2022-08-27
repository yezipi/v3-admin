<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { WindowsOutlined, AppleOutlined, AndroidOutlined, MobileOutlined } from '@ant-design/icons-vue'
import Api from '@/api/report'
import { formatSec } from '@/utils'

const columns = reactive([
  {
    title: '最后访问时间',
    dataIndex: 'lastVisitTime',
  },
  {
    title: '地区',
    dataIndex: 'area',
  },
  {
    title: '来源',
    dataIndex: 'from',
  },
  {
    title: '入口页面',
    dataIndex: 'visitedPage',
  },
  {
    title: '搜索词',
    dataIndex: 'keywords',
  },
  {
    title: '访问IP',
    dataIndex: 'ip',
  },
  {
    title: '停留时间',
    dataIndex: 'stay',
    noTransform: true,
  },
  {
    title: '访问页数',
    dataIndex: 'visitedCount',
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
  },
  {
    title: '系统',
    dataIndex: 'os',
  },
  {
    title: '网络类型',
    dataIndex: 'isp',
  },
  {
    title: '访客类型',
    dataIndex: 'visitorType',
  },
])

const modalColumns = reactive([
  {
    title: '访问时间',
    dataIndex: 'lastVisitTime',
  },
  {
    title: '访问页面',
    dataIndex: 'visitedPage',
  },
  {
    title: '停留时间',
    dataIndex: 'stay',
  },
])

const osType = (os: string) => {
  if (os.indexOf('Win') > -1) {
    return {
      color: '#008dff',
      icon: WindowsOutlined
    }
  }
  if (os.indexOf('macOS') > -1) {
    return {
      color: '#333333',
      icon: AppleOutlined
    }
  }
  if (os.indexOf('Android') > -1) {
    return {
      color: 'green',
      icon: AndroidOutlined
    }
  }
  if (os.indexOf('iOS') > -1) {
    return {
      color: '#333333',
      icon: MobileOutlined
    }
  }
  return null
}

const list = ref<any>([])
const tableRef = ref()
const count = ref(0)
const condition = ref({
  size: 20,
  page: 1,
})
const visible = ref(false)
const modalSource = ref<any>(undefined)


const getBaiduVisitors = async () => {
  try {
    const { data }: any = await Api.getBaiduVisitors(condition.value)
    const { total, items } = data
    const field = items[1]
    count.value = total
    list.value = items[0].map((el: any, index: number) => {
      const detail = el[0].detail
      const data: any = {
        lastVisitTime: field[index][0],
        area: field[index][1],
        from: field[index][2],
        visitedPage: field[index][3],
        keywords: field[index][4],
        ip: field[index][5],
        stay: formatSec(field[index][7]),
        visitedCount: field[index][8],
        browser: detail.browser,
        os: detail.os,
        isp: detail.isp || '-',
        visitorType: detail.visitorType,
        paths: detail.paths
      }
      return data
    })
  } catch (e) {
    list.value = []
    console.log(e)
  }
}

const onPageChange = (res: any) => {
  condition.value = res
  getBaiduVisitors()
}

const showModal = (res: any) => {
  modalSource.value = res.paths.map((e: any) => {
    return {
      lastVisitTime: e[0],
      visitedPage: e[2],
      stay: formatSec(+e[1]),
    }
  })
  console.log(modalSource.value)
  visible.value = true
}

const handleOk = () => {

}

onMounted(() => getBaiduVisitors())

</script>

<template>
  <div class="baidu-visitors-wrap">
    <yzp-table :columns="columns" :data="list" :total="count" ref="tableRef" @onPageChange="onPageChange">
      <template #bodyCell="{ scope: { record, column } }">

        <template v-if="column.dataIndex === 'from'">
          <a v-if="record.from.url" :href="record.from.url" target="_blank">{{ record.from.fromType }}</a>
          <span v-else>{{ record.from.fromType }}</span>
        </template>

        <template v-if="column.dataIndex === 'visitedPage'">
          <a :href="record.visitedPage" target="_blank">{{ record.visitedPage }}</a>
        </template>

        <template v-if="column.dataIndex === 'visitedCount'">
          <a-button type="link" @click="showModal(record)">{{ record.visitedCount }}</a-button>
        </template>

        <template v-if="column.dataIndex === 'os'">
          <div style="display: flex;align-items: center;">
            <component v-if="osType(record.os)" :is="osType(record.os)?.icon" :style="{ color: osType(record.os)?.color, 'font-size': '24px' }"></component>
            <span style="display: inline-block;margin-left: 10px">{{ record.os }}</span>
          </div>
        </template>

        <template v-if="column.dataIndex === 'visitorType'">
          <a-tag :color="record.visitorType === '新访客' ? 'green' : 'pink'">{{ record.visitorType }}</a-tag>
        </template>

      </template>
    </yzp-table>

    <a-modal v-model:visible="visible" width="50%" title="访问深度明细" @ok="handleOk">
      <a-table :columns="modalColumns" :dataSource="modalSource" size="small" bordered></a-table>
    </a-modal>

  </div>
</template>

