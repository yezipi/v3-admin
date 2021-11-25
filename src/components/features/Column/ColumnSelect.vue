<script lang="ts" setup>
  import { onMounted, ref, toRaw, watch } from 'vue'
  import ColumnApi from '@/api/column'

  const options = ref<any>([])
  const lists = ref<any>([])
  let id = ref<string | number | undefined>(undefined)

  const emit = defineEmits(['update:value', 'change'])
  const props = defineProps({
    type: {
      type: String,
      default: 'article'
    },
    value: {
      type: String,
      default: undefined
    }
  })

  watch(() => props.value, (val: string | undefined) => {
    id.value = String(val)
  })

  watch(() => props.type, (val: string) => {
    id.value = undefined
    filterOptions(val)
  })

  const filterOptions = (type: string) => {
    options.value = lists.value.filter((e: any) => e.type === type)
  }

  const getColumnList = async () => {
    const { data: { rows } } = await ColumnApi.getSubList()
    lists.value = rows.map((e: any) => {
      e.id = String(e.id)
      return e
    })
    filterOptions(props.type)
  }

  const onChange = (val: any) => {
    console.log(typeof val)
    emit('change', val)
    emit('update:value', val) // 这组件太坑了，是number的话，form校验过不去
  }

  onMounted(() => {
    getColumnList()
  })
</script>

<template>
  <a-select
    ref="select"
    v-model:value="id"
    allowClear
    style="width: 100%;"
    placeholder="请选择"
    @change="onChange"
  >
    <a-select-option
      v-for="(item, index) in options"
      :key="index"
      :value="item.id"
    >
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<style>

</style>
