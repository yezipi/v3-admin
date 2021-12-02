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
      :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :bordered="bordered"
      class="ant-table-striped"
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
import { formatDate } from '@/utils/index'
import api, { ApiConfig } from '@/api/index'

interface AnyKey {
  [key: string]: any 
}

export default defineComponent({
  props: {
    bordered: {
      type: Boolean,
      default: true,
    },
    center: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => []
    },
    scrollWidth: {
      type: [ Number, String, Boolean ],
      default: false
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
    childrenColumnName: String,

    // 额外条件
    condition: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, slots }) {

    const { url, scrollWidth, columns, size, childrenColumnName, center } = props

    const tableConfig = reactive({
      dataSource: [] as any,
      total: 0,
    })

    const slotsKeys = Object.keys(slots).filter((e: any) => e !== 'filter')

    const tableHeight = ref<any>(undefined)
    const tableWidth = ref<any>(undefined)
    const loadEnd = ref(false)
    const page = ref(1)
    const newColumns = ref<Array<any>>(columns)

    if (props.center) {
      newColumns.value = columns.map((e: any) => {
        e.align = 'center'
        return e
      })
    }

    const mapColumns = (e: any) => {
      columns.forEach((i: any) => {
        const key = i.dataIndex
        const item = e[key]

        // noTransform为false的话就不进行转换
        if (!e[key] && typeof e[key] !== 'boolean' && !i.noTransform && !i.dict) {
          e[key] = '-'
        }

        // 匹配字典
        if (i.dict) {
          e[key] = i.dict[item]
        }

        // 格式化时间，如果传入的是布尔值，则默认YYYY-MM-DD，否则就传入时间格式
        if (i.format) {
          e[key] = formatDate(e[key], typeof i.format === 'boolean' ? 'YYYY-MM-DD' : i.format)
        }
        
      })
      return e
    }

    // 获取列表
    const init = async (filters?: object) => {
      if (!url) {
        return
      }
      try {
        const str = url.split('.')
        const obj: AnyKey = api[str[0] as keyof ApiConfig] // class对象
        const fn = str[1] // 对象下面的方法
        const { data } = await obj[fn]({ size, page: page.value, ...props.condition, ...filters })
        const { rows, count } = data
        // 匹配字典
        tableConfig.dataSource = rows.map((e: any[]) => {
          const childKeyName: any = childrenColumnName
          const sub = e[childKeyName]

          mapColumns(e)

          // 二级为空的删除属性
          if (sub) {
            if (!sub.length) {
              delete e[childKeyName]
            } else {
              if (sub !== '-') {
                e[childKeyName] = sub.map((x: any) => {
                  mapColumns(x)
                  return x
                })
              }
            }
          }

          return e
        })
        tableConfig.total = count
        emit('load', rows)
      } catch (e: any) {
        if (!e.msg) {
          const noFnMsg = url + '方法不存在，请检查'
          const errMsg = e.toString().indexOf('fn') > -1 ? noFnMsg : e.toString()
          message.error(errMsg)
          console.log(e)
          throw { errMsg }
        }
      } finally {
        loadEnd.value = true
        nextTick(() => {
          if (loadEnd.value) {
            const filterEle: any = document.querySelector('#list-filter') // 列表的筛选统一加这个id
            const sectionEle: any = document.querySelector('.yzp-section')
            const otherHeight = 230
            const filterHeight = filterEle ? (filterEle.offsetHeight) : 0
            const sectionHeight = sectionEle.offsetHeight - 180
            const maxHeight = innerHeight - otherHeight - filterHeight
            const isOuter = sectionHeight > maxHeight
            tableHeight.value = isOuter ? maxHeight : undefined
            if (tableConfig.total < size && !isOuter) {
              tableHeight.value = undefined
            }
            console.log(sectionHeight, maxHeight)
            tableWidth.value = scrollWidth
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
      newColumns,
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
