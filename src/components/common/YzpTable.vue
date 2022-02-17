<!--表格部分使用ant-design-table-->
<template>
  <div class="page-list">
    <div v-if="slots.filter" id="list-filter">
      <slot name="filter"></slot>
    </div>
    <template v-if="loadEnd && total">
      <my-table
        :id="tableId"
        :dataSource="data && data.length ? data : dataSource"
        :columns="newColumns"
        :pagination="false"
        :scroll="{ x: tableWidth, y: tableHeight }"
        :rowKey="rowKey"
        :childrenColumnName="childrenColumnName"
        :stripe="true"
        :bordered="true"
        size="small"
      >
        <template v-for="item in slotsKeys" v-slot:[item]="scope">
          <slot :name="item" :scope="scope"></slot>
        </template>
      </my-table>
      <yzp-pagination v-if="pagination" :total="total" :size="size" @change="onPageChange"></yzp-pagination>
    </template>
    <a-empty v-else :style="{ 'margin-top': emptyNoMargin ? 0 : '30vh' }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref, nextTick, computed, watch } from 'vue'
import 'ant-design-vue/es/table/style/index.less'
import { message, Table as MyTable } from 'ant-design-vue'
import { formatDate } from '@/utils/index'
import api, { ApiConfig } from '@/api/index'
import { useStore } from 'vuex'

interface AnyKey {
  [key: string]: any 
}

export default defineComponent({
  components: {
    MyTable,
  },
  props: {
    /**
     * table的唯一id，多个表格的时候建议设置
     */
    tableId: {
      type: String,
      default: 'yzp-table'
    },
    /**
     * 列是否剧中
     */
    center: {
      type: Boolean,
      default: true,
    },
    /**
     * 数据源，建议不传url的时候使用
     */
    data: {
      type: Array,
      default: () => []
    },
    /**
     * 数据列表，表头
     */
    columns: {
      type: Array,
      default: () => []
    },
    /**
     * 横向滚动配置
     */
    scrollWidth: {
      type: [ Number, String, Boolean ],
      default: false
    },
    /**
     * api对象的获取列表方法
     */
    url: {
      type: String,
      default: ''
    },
    /**
     * 唯一id
     */
    rowKey: {
      type: String,
      default: 'id'
    },
    /**
     * 页码
     */
    size: {
      type: Number,
      default: 20,
    },
    /**
     * child 键名
     */
    childrenColumnName: String,
    /**
     * 筛选条件
     */
    condition: {
      type: Object,
      default: () => {}
    },
    /**
     * 是否分页
     */
    pagination: {
      type: Boolean,
      default: true,
    },
    /**
     * 暂无数据的样式是否有间距
     */
    emptyNoMargin: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, slots }) {

    const { url, scrollWidth, columns, size, childrenColumnName } = props

    const tableConfig = reactive({
      dataSource: [] as any,
      total: 0,
    })

    const slotsKeys = Object.keys(slots).filter((e: any) => e !== 'filter')

    const tableHeight = ref<any>(undefined)
    const tableWidth = ref<any>(undefined)
    const bakcupHeight = ref<any>(undefined)
    const loadEnd = ref(false)
    const page = ref(1)
    const newColumns = ref<Array<any>>(columns)
    const Store = useStore()
    const style = computed(() => Number(Store.state.style))

    if (props.center) {
      newColumns.value = columns.map((e: any) => {
        e.align = 'center'
        return e
      })
    }

    watch(() => style.value, () => {
      seHeight()
    })

    watch(props.data, () => {
      tableConfig.total = props.data.length
      loadEnd.value = true
    })

    const seHeight = () => {
      if (style.value === 2) {
        tableHeight.value = bakcupHeight.value - 35
      } else {
        tableHeight.value = bakcupHeight.value
      }
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
        const tableBody: any = document.querySelector('#' + props.tableId)
        if (tableBody) {
          tableBody.scrollTo(0, 0)
        }
        nextTick(() => {
          if (!loadEnd.value) {
            const filterEle: any = document.querySelector('#list-filter') // 列表的筛选统一加这个id
            const filterHeight = filterEle ? (filterEle.offsetHeight + 10) : 0
            tableHeight.value = screen.height - 350 - filterHeight
            bakcupHeight.value = tableHeight.value
            tableWidth.value = scrollWidth
            seHeight()
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
      newColumns,
      tableHeight,
      tableWidth,
      loadEnd,
      slotsKeys,
      slots,
      init,
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
