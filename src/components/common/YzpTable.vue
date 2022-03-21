<template>
  <div class="yzp-page-list" :id="tableId">
    <div v-if="slots.filter" class="yzp-page-filter">
      <slot name="filter"></slot>
    </div>
    <div :style="{ height: tableHeight + 100 + 'px' }" class="yzp-table-main">
      <div v-if="loading && !total" class="yzp-table-spin">
        <a-spin :spinning="loading" tip="奋力加载中..."></a-spin>
      </div>
      <template v-if="total">
        <a-table
          :dataSource="dataSource"
          :loading="{ spinning: loading, tip: '奋力加载中...' }"
          :columns="newColumns"
          :pagination="false"
          :scroll="{ x: tableWidth, y: total < 10 ? null : tableHeight }"
          :rowKey="rowKey"
          :childrenColumnName="childrenColumnName"
          :row-class-name="setRowClassName"
          :bordered="bordered"
          class="ant-table-striped"
          size="small"
        >
          <template v-for="item in slotsKeys" v-slot:[item]="scope">
            <slot :name="item" :scope="scope"></slot>
          </template>
        </a-table>
        <yzp-pagintion v-if="pagintion" :total="total" :size="pageSize" @change="onPageChange"></yzp-pagintion>
      </template>
      <div v-if="!total && !loading" class="yzp-table-empty">
        <a-empty />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { formatDate } from '@/utils/index'
import api, { ApiConfig } from '@/api/index'
import { useStore } from 'vuex'

interface AnyKey {
  [key: string]: any 
}

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tableId: {
      type: String,
      default: 'yzp-table'
    },
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
    childrenColumnName: {
      type: String,
      default: 'children'
    },
    condition: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagintion: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      default: 0,
    }
  },
  setup(props, { emit, slots }) {

    const { url, scrollWidth, columns, size, childrenColumnName } = props

    const tableConfig = reactive({
      dataSource: [] as any,
      total: props.total,
      loading: true
    })

    const slotsKeys = Object.keys(slots).filter((e: any) => e !== 'filter')

    const tableHeight = ref<any>(undefined)
    const tableWidth = ref<any>(undefined)
    const bakcupHeight = ref<any>(undefined)
    const page = ref(1)
    const pageSize = ref(size)
    const newColumns = ref<Array<any>>(columns)
    const Store = useStore()
    const menuStyle = computed(() => Number(Store.state.menuStyle))

    if (props.center) {
      newColumns.value = columns.map((e: any) => {
        e.align = 'center'
        return e
      })
    }

    watch(() => menuStyle.value, () => {
      setTableHeight()
    })

    watch(() => props.data, (data: any[]) => {
      tableConfig.loading = true
      if (!props.url) {
        tableConfig.dataSource = data
        tableConfig.total = props.total || data.length
        tableConfig.loading = false
      }
    })

    const setTableHeight = () => {
      const filterEle: any = document.querySelector(`#${props.tableId} .yzp-page-filter`) // 列表的筛选统一加这个id
      const filterHeight = filterEle ? (filterEle.offsetHeight + 10) : 0
      console.log(`#${props.tableId} .ky-page-filter`)
      tableHeight.value = screen.height - 360 - filterHeight
      bakcupHeight.value = tableHeight.value
      tableWidth.value = scrollWidth
      if (menuStyle.value === 2) {
        tableHeight.value = bakcupHeight.value - 40
      } else {
        tableHeight.value = bakcupHeight.value
      }
      console.log('tableHeight: ' + tableHeight.value)
    }

    const mapColumns = (e: any) => {
      newColumns.value.forEach((i: any) => {
        const key = i.dataIndex
        const item = e[key]

        // noTransform为false, 布尔值，数字类型的话就不进行转换
        if (!e[key] && typeof e[key] !== 'boolean' && typeof e[key] !== 'number' && !i.noTransform && !i.dict) {
          e[key] = '-'
        }

        // 匹配字典
        if (i.dict) {
          e[key] = i.dict[item]
        }

        // 格式化时间，如果传入的是布尔值，则默认YYYY-MM-DD，否则就传入时间格式
        if (i.format) {
          e[key] = formatDate(e[key], typeof i.format === 'boolean' ? 'YYYY-MM-DD hh:mm' : i.format)
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
        tableConfig.loading = true
        const str = url.split('.')
        const obj: AnyKey = api[str[0] as keyof ApiConfig] // class对象
        const fn = str[1] // 对象下面的方法
        const { data } = await obj[fn]({ size: pageSize.value, page: page.value, ...props.condition, ...filters })
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
        const tableBody: any = document.querySelector(`#${props.tableId} .ant-table-body`)
        tableBody && tableBody.scrollTo(0, 0)
        tableConfig.loading = false
      }
    }

    // 分页
    const onPageChange = (res: any) => {
      page.value = res.page
      pageSize.value = res.size
      tableConfig.loading = true
      if (!props.url) {
        emit('onPageChange', res)
      }
      init(res)
    }

    const setRowClassName = (_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : '')

    onMounted(() => {
      setTableHeight()
      init()
    })

    return {
      ...toRefs(tableConfig),
      newColumns,
      tableHeight,
      tableWidth,
      slotsKeys,
      slots,
      page,
      pageSize,
      init,
      setRowClassName,
      onPageChange,
    }
  }
})
</script>

<style lang="less" scoped>
.yzp-page-filter {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .filter-left, .filter-right {
    display: flex;
    align-items: center;
  }
}
.yzp-table-main {
  position: relative;
  .yzp-table-spin, .yzp-table-empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  :deep(.ant-spin-nested-loading > div > .ant-spin) {
    max-height: none;
  }
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #f5f5f5;
}
</style>
