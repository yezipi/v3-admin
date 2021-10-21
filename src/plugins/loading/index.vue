<!--loading全局弹窗-->
<template>
  <div v-if="active" class="yzp-loading" @click="clickMask">
    <div class="yl-main">
      <a-spin size="large" />
      <span>{{ msg }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'

export default defineComponent({
  props: {
    msg: {
      type: String,
      default: 'loading...'
    },
    visible: {
      type: Boolean,
      default: false
    },
    lock: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const active = ref(props.visible)

    onMounted(() => {
      active.value = props.visible
    })

    watch(() => props.visible, (res) => {
      active.value = res
    })

    const show = () => {
      active.value = true
      ctx.emit('update:visible', true)
    }

    const hide = () => {
      active.value = false
      ctx.emit('update:visible', false)
    }

    const clickMask = () => {
      if (props.lock) {
        return
      }
      hide()
    }

    return {
      active,
      show,
      hide,
      clickMask,
    }
  }
})
</script>

<style scoped lang="less">
.yzp-loading {
  position: fixed;
  background: rgba(255,255,255,0);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;
  .yl-main {
    width: 150px;
    height: 150px;
    border-radius: 5px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: saturate(150%) blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow:  0 0 20px rgba(0,0,0,0.15);
  }
  span {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #999999;
  }
}
</style>