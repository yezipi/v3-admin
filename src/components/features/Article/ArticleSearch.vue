<!--
  @name 远程获取sku信息
  @version: 2021-11-19
-->
<template>
  <a-select
    v-model:value="value"
    allowClear
    show-search
    placeholder="请输入文章关键词"
    :default-active-first-option="false"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    @search="handleSearch"
  >
    <a-option v-for="(item, index) in options" :value="item.id" :key="index" class="aso-cell">
      <div class="aso-item">
        <span v-if="item.recommend" class="aso-label">【推荐】</span>
        <span class="aso-value">{{ item.title }}</span>
      </div>
    </a-option>
    <template v-if="fetching" #notFoundContent>
      <a-spin />
    </template>
  </a-select>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref, onMounted } from 'vue'
import ArticleApi from '@/api/article'
import { debounce } from '@/utils/index'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'article',
    },
    // 组件加载是否自动请求
    autoLoad: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { emit }) {

    const keywords = ref()
    
    const conf = reactive({
      options: [] as any,
      value: undefined,
      fetching: false
    })

    watch(() => props.type, () => {
      getList(keywords.value)
    })

    const getList = async (title: any) => {
      if (!title && !props.autoLoad) {
        return
      }
      conf.fetching = true
      try {
        const prams = { title, type: props.type, loading: false }
        const { data } = await ArticleApi.getList(prams)
        conf.options = data.rows
      } catch (e) {
        console.log(e)
      } finally {
        conf.fetching = false
      }
    }

    const handleSearch = debounce((e: any) => {
      conf.options = []
      keywords.value = e
      getList(e)
    }, 1000)

    const handleChange = (val: any) => {
      conf.value = val
      emit('select', val)
    }

    onMounted(() => {
      getList(undefined)
    })

    return {
      ...toRefs(conf),
      handleSearch,
      handleChange,
    }
  },
});
</script>

<style scoped lang="less">
.aso-cell {
  .aso-label {
    font-size: 12px;
    color: red;
  }
  .aso-value {
    font-size: 12px;
  }
}
</style>

