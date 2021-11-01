<template>
  <a-drawer
    :title="title"
    :width="width"
    :visible="visible"
    :size="size"
    :maskClosable="maskClosable"
    @close="onClose"
  > 
    <div class="drawo-content">
      <slot name="content"></slot>
    </div>
    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onClose">确定</a-button>
    </template>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({

  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: 720
    },
    size: {
      type: String,
      default: 'default'
    },
    maskClosable: {
      type: Boolean,
      default: true,
    }
  },

  setup() {
    const visible = ref<boolean>(false);

    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };
    return {
      visible,
      showDrawer,
      onClose,
    };
  },
});
</script>

