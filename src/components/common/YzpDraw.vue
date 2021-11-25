<template>
  <a-drawer
    :title="title"
    :width="width"
    :size="size"
    :maskClosable="maskClosable"
    :visible="state"
    :destroyOnClose="true"
    @close="hide"
  > 
    <div class="draw-wrap">
      <div class="draw-content">
        <slot name="content"></slot>
      </div>
      <div class="draw-footer">
        <a-button style="flex: 1;margin-right: 24px" @click="cancel">取消</a-button>
        <a-button type="primary" style="flex: 1" @click="confirm">确定</a-button>
      </div>
    </div>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({

  props: {
    width: {
      type: [String, Number],
      default: '40%'
    },
    size: {
      type: String,
      default: 'default'
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    title: String,
  },

  setup(props, ctx) {

    const state = ref<boolean>(false);

    const show = () => {
      ctx.emit('update:visible', true)
      state.value = true
    }

    const hide = () => {
      ctx.emit('update:visible', false)
      console.log(state.value)
    }

    const confirm = () => {
      ctx.emit('confirm', true)
    }

    const cancel = () => {
      ctx.emit('cancel', true)
      hide()
    }

    return {
      state,
      show,
      hide,
      cancel,
      confirm
    };
  },
});
</script>

<style scoped lang="less">
.draw-wrap {
  display: flex;
  flex-direction: column;
  margin-right: -24px;
  .draw-content {
    padding-right: 24px;
    height: calc(100vh - 170px);
    overflow-y: auto;
  }
  .draw-footer {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 24px;
  }
}
</style>
