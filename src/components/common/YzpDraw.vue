<template>
  <a-drawer
    v-model:visible="state"
    :title="title"
    :width="width"
    :maskClosable="maskClosable"
    :wrapLoading="wrapLoading"
    :okLoading="okLoading"
    class="yzp-draw"
    @close="hide"
  > 
    <div v-if="wrapLoading" class="yzp-draw-spin" >
      <a-spin :spinning="wrapLoading" tip="加载中..."></a-spin>
    </div>
    <div v-if="!wrapLoading" class="yzp-draw-content ">
      <slot name="content"></slot>
    </div>
    <template v-if="!wrapLoading" #footer>
      <div class="yzp-draw-footer">
        <a-button style="margin-right: 10px;flex: 1" size="large" @click="hide">取消</a-button>
        <a-button style="flex: 1" type="primary" size="large" :loading="okLoading" @click="confirm">确定</a-button>
      </div>
    </template>
  </a-drawer>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
export default defineComponent({

  props: {
    visible: {
      type: Boolean,
      default: false
    },
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
    title: {
      type: String,
      default: ''
    },
    wrapLoading: {
      type: Boolean,
      default: false,
    },
    okLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, ctx) {

    const state = ref<boolean>(props.visible);

    const show = () => {
      ctx.emit('update:visible', true)
      state.value = true
    }

    const hide = () => {
      ctx.emit('update:visible', false)
      ctx.emit('hide', false)
    }

    const confirm = () => {
      ctx.emit('confirm', true)
    }

    const cancel = () => {
      ctx.emit('cancel', true)
      hide()
    }

    watch(() => props.visible, (res: boolean) => {
      state.value = res
    })

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
.yzp-draw {
  .yzp-draw-spin {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .yzp-draw-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

</style>
