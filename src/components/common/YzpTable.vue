<template>
  <div class="page-list">
    <div v-if="slots.filter" id="list-filter">
      <slot name="filter"></slot>
    </div>
    <a-table
      v-if="loadEnd"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: tableWidth, y: tableHeight }"
      :rowKey="rowKey"
      :childrenColumnName="childrenColumnName"
      size="small"
    >
      <template v-for="item in slotsKeys" v-slot:[item]="scope">
        <slot :name="item" :scope="scope"></slot>
      </template>
    </a-table>
    <yzp-pagintion v-if="total" :total="total" :size="size" @change="onPageChange"></yzp-pagintion>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import api, { ApiConfig } from '@/api/index'

interface AnyKey {
  [key: string]: any 
}

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    scrollWidth: {
      type: [ Number, String ],
      default: undefined
    },
    // api对象的获取列表方法
    url: {
      type: String,
      default: ''
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    size: {
      type: Number,
      default: 20,
    },
    childrenColumnName: String
  },
  setup({ url, scrollWidth, columns, size }, { emit, slots }) {

    const tableConfig = reactive({
      dataSource: [] as any,
      total: 0,
    })

    const slotsKeys = Object.keys(slots).filter((e: any) => e !== 'filter')

    const tableHeight = ref<any>(undefined)
    const tableWidth = ref<any>(undefined)
    const loadEnd = ref(false)
    const page = ref(1)

    // 获取列表
    const init = async (condition?: object) => {
      if (!url) {
        return
      }
      try {
        const str = url.split('.')
        const obj: AnyKey = api[str[0] as keyof ApiConfig] // class对象
        const fn = str[1] // 对象下面的方法
        const { data } = await obj[fn]({ size, page: page.value, ...condition })
        const { rows, count } = data
        // 匹配字典
        tableConfig.dataSource = rows.map((e: any[]) => {
          columns.forEach((i: any) => {
            const key = i.dataIndex
            const item = e[key]
            if (i.dict) {
              e[key] = i.dict[item]
            }
          })
          return e
        })
        tableConfig.total = count
        emit('load', rows)
      } catch (e: any) {
        const noFnMsg = url + '方法不存在，请检查'
        const errMsg = e.toString().indexOf('fn') > -1 ? noFnMsg : e.toString()
        message.error(errMsg)
        console.log(e)
        throw { errMsg }
      } finally {
        nextTick(() => {
          if (!loadEnd.value) {
            const filterEle: any = document.querySelector('#list-filter') // 列表的筛选统一加这个id
            const filterHeight = filterEle ? (filterEle.offsetHeight) : 0
            tableHeight.value = tableConfig.total >= size ? (screen.height - 350 - filterHeight) : undefined
            tableWidth.value = scrollWidth
            loadEnd.value = true
          }
        })
      }
    }

    // 分页
    const onPageChange = (res: any) => {
      page.value = res.page
      init(res)
    }

    onMounted(() => {
      init()
    })

    return {
      ...toRefs(tableConfig),
      init,
      tableHeight,
      tableWidth,
      loadEnd,
      slotsKeys,
      slots,
      onPageChange,
    }
  }
})
</script>

<style lang="less" scoped>
#list-filter {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filter-left, .filter-right {
    display: flex;
    align-items: center;
  }
}
</style>
