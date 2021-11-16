<!--
  分页组件, 2021-11-10 zzc
-->
<template>
  <div v-if="total" class="ky-pagintion" style="margin-top: 20px">
    <a-config-provider :locale="locale">
      <a-pagination
        :total="total"
        :showTotal="totalText"
        :showQuickJumper="true"
        :showSizeChanger="true"
        :pageSize="size"
        v-model:current="page"
        @showSizeChange="onSizeChange"
        @change="onPageChange"
      >
      </a-pagination>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
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
  },
  setup(props, { emit }) {
    const page = ref<number>(1)

    const onPageChange = (page: number, size: number) => {
      emit('change', { page, size })
    }

    const onSizeChange = (page: number, size: number) => {
      emit('change', { page, size })
    }

    const totalText = (total: any) => `总共 ${total} 条`

    return {
      locale: zhCN,
      page,
      totalText,
      onSizeChange,
      onPageChange,
    };
  },
});
</script>