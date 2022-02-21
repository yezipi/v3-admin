<!--
  分页组件, 2021-11-10 zzc
-->
<template>
  <div class="yzp-pagintion" style="margin-top: 20px">
    <a-pagination
      :total="total"
      :showTotal="totalText"
      :showQuickJumper="true"
      :showSizeChanger="true"
      :pageSize="size"
      v-model:current="page"
      @change="onPageChange"
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
      default: 10,
    },
  },
  setup(props, { emit }) {
    const page = ref<number>(1)

    const onPageChange = (page: number, size: number) => {
      emit('change', { page, size })
    }

    const totalText = (total: any) => `总共 ${total} 条`

    return {
      page,
      totalText,
      onPageChange,
    };
  },
});
</script>