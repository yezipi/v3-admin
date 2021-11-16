<template>
  <div class="page-list">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: tableWidth, y: tableHeight }"
      :rowKey="rowKey"
      size="small"
    >
      <template v-for="item in slotsKeys" v-slot:[item]="scope">
        <slot :name="item" :scope="scope"></slot>
      </template>
    </a-table>
    <yzp-pagintion :total="total" :size="condition.size" @change="onPageChange"></yzp-pagintion>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch, ref } from 'vue'
import api, { ApiConfig } from '@/api/index'

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
    condition: {
      type: Object,
      default: () => {
        return {
          page: 1,
          size: 30,
        }
      }
    },
    // api对象的获取列表方法
    url: {
      type: String,
      default: ''
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  setup({ url, condition, scrollWidth }, { emit, slots }) {

    const tableConfig = reactive({
      dataSource: [] as any,
      total: 0,
    })

    const filters = ref(condition)

    const slotsKeys = Object.keys(slots)

    const tableHeight = ref(0)
    const tableWidth = ref<any>(undefined)

    watch(() => condition, () => {
      filters.value = condition
    })

    // 获取列表
    const init = async () => {
      if (!url) {
        return
      }
      const str = url.split('.')
      const obj: { [key: string]: any } = api[str[0] as keyof ApiConfig] // class对象
      const fn = str[1] // 对象下面的方法
      const { data } = await obj[fn](filters.value)
      const { rows, count } = data
      console.log(rows)
      tableConfig.dataSource = rows
      tableConfig.total = count
      emit('load', rows)
    }

    // 分页
    const onPageChange = (res: { page: number, size: number }) => {
      const { page, size } = res
      condition.page = page
      condition.size = size
      init()
    }

    onMounted(() => {
      init()
      const filterEle: any = document.querySelector('#list-filter') // 列表的筛选统一加这个id
      const filterHeight = filterEle ? filterEle.offsetHeight : 0
      tableHeight.value = screen.height - 380 - filterHeight
      tableWidth.value = scrollWidth
    })

    return {
      ...toRefs(tableConfig),
      init,
      tableHeight,
      tableWidth,
      slotsKeys,
      onPageChange,
    }
  }
})
</script>
