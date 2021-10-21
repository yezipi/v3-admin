<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ColumnApi from '../../../api/column'

const options = ref<any>([])
const id = ref<number | string>('')

const getColumnList = async () => {
  const { data: { rows } } = await ColumnApi.getList()
  options.value = rows.map((e: any) => {
    const { id, title } = e
    return {
      value: id,
      label: title,
    }
  })
}

const emit = defineEmits(['change'])

const onChange = (value: any) => {
  console.log(id.value)
  emit('change', value)
}

onMounted(() => {
  getColumnList()
})
</script>

<template>
  <a-select
    ref="select"
    v-model:value="id"
    style="width: 200px;"
    size="large"
    allowClear
    :options="options"
    @change="onChange"
  >
  </a-select>
</template>

<style scoped lang="scss">
</style>
