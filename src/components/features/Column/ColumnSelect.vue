<script lang="ts" setup>
import { onMounted, ref, toRaw } from 'vue'
import ColumnApi from '@/api/column'

const options = ref<any>([])
const id = ref<number | undefined>(undefined)

const emit = defineEmits(['change'])
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const getColumnList = async () => {
  console.log(props)
  const { data: { rows } } = await ColumnApi.getSubList({ type: props.type })
  options.value = rows
  console.log(toRaw(options.value))
}

const onChange = (value: any) => {
  console.log(value)
  emit('change', value) // 这组件太坑了，是number的话，form校验过不去
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
      :value="String(item.id)"
    >
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<style scoped lang="scss">
</style>
