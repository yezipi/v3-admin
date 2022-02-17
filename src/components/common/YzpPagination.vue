<!--
  分页组件, 2021-11-10 zzc
-->
<template>
  <div class="ky-pagintion" style="margin-top: 20px">
    <a-pagination
      :total="total"
      :showTotal="true"
      :showJumper="true"
      :showPageSize="true"
      v-model:pageSize="size"
      v-model:current="curr"
      @showSizeChange="onSizeChange"
      @pageSizeChange	="onPageChange"
    >
    </a-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    total: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 30,
    },
    page: {
      type: Number,
      default: 1,
    }
  },
  setup(props, { emit }) {
    const curr = ref<number>(1)

    const onPageChange = (page: number) => {
      emit('change', { page })
    }

    const onSizeChange = (page: number, size: number) => {
      emit('change', { page, size })
    }

    return {
      curr,
      onSizeChange,
      onPageChange,
    }
  },
})
</script>