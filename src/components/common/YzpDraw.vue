<template>
  <a-drawer
    :title="title"
    :width="width"
    :visible="visible"
    :size="size"
    :maskClosable="maskClosable"
    @close="hide"
  > 
    <div class="draw-wrap">
      <div class="draw-content">
        <slot name="content"></slot>
      </div>
      <div class="draw-footer">
        <a-button style="flex: 1;margin-right: 24px" size="large" @click="hide">取消</a-button>
        <a-button type="primary" size="large" style="flex: 1" @click="hide">确定</a-button>
      </div>
    </div>
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

    const show = () => {
      visible.value = true;
    };

    const hide = () => {
      visible.value = false;
    };

    return {
      visible,
      show,
      hide,
    };
  },
});
</script>

<style scoped lang="less">
.draw-wrap {
  position: absolute;
  height: calc(100% - 103px);
  left: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  .draw-content {
    flex: 1;
  }
  .draw-footer {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
