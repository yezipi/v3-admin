<!--
  @name: 椰子皮博客表情选择
  @time: 2019-6-28
  @author: zzc 版权所有
-->
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import api from '@/api/common'

interface FaceItem {
  path: string,
  index: number,
  dir: string,
  alias: string,
  data?: any,
}

const emit = defineEmits(['change', 'update:value'])
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  }
})

const faces = ref<Array<FaceItem>>([])
const curr = ref({
  path: '',
  alias: '',
  dir: '',
})
const loadEnd = ref(false)
const state = ref(props.value)
const dirIndex= ref(0)

watch(() => props.value, (val: boolean) => {
  state.value = val
})

const getFace = async () => {
  try {
    loadEnd.value = false
    const { data } = await api.getFace()
    faces.value = data
    console.log(data)
  } catch (e) {
    console.log(e)
  } finally {
    loadEnd.value = true
  }
}

const selectType = (index: number) => {
  dirIndex.value = index
}

const hoverEmoji = (item: any) => {
  curr.value = item
}

const selectEmoji = (item: any) => {
  emit('change', item)
  close()
}

const close = () => {
  emit('update:value', false)
}

const setStyle = (path: string, type?: number): any => {
  if (type === 1) {
    return path
  }
  if (type === 2) {
    return `<img src="${path}" style="max-width: 40px" />`
  }
  return {
    background: `url(${path})`
  }
}

document.body.onclick = () => {
  close()
}

onMounted(() => getFace())

</script>
<template>
  <div v-if="state" class="yzp-emoji-wrap">
    <div v-if="!loadEnd" class="yzp-emoji-loading">
      <a-spin />
    </div>
    <div v-if="faces.length && loadEnd" class="yzp-ew-main">
      <div class="yzp-ew-tab">
        <span
          v-for="(item, index) in faces"
          :key="index"
          :class="{ active: item.index === dirIndex }"
          @click.stop="selectType(item.index)"
        >
          {{ item.alias }}
        </span>
      </div>
      <img v-if="curr.path" class="yzp-ew-zoom" :src="setStyle(curr.path, 1)" />
      <div
        v-for="(item, index) in faces"
        v-show="item.index === dirIndex"
        :key="index"
        class="yzp-ew-content"
      >
        <ul class="yzp-ew-list">
          <li
            v-for="(sub, key) in item.data"
            :key="key"
            @click.stop="selectEmoji(sub)"
            @mouseover="hoverEmoji(sub)"
          >
            <div class="yzp-ew-item" :style="setStyle(sub.path)"></div>
          </li>
        </ul>
      </div>
      <close-outlined class="yzp-ew-close" />
    </div>
    <a-empty v-if="!faces.length && loadEnd" />
  </div>
</template>

<style scoped lang="less">
.yzp-emoji-wrap {
  position: absolute;
  width: 500px;
  left: 0;
  top: 35px;
  margin: auto;
  z-index: 1;
  background: #ffffff;
  box-shadow: 0 0 10px #cccccc;
  border-radius: 6px;
  animation: toTop 0.3s;
  .yzp-emoji-loading {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .yzp-ew-main {
    padding: 20px;
    .yzp-ew-close {
      font-size: 18px;
      font-weight: bold;
      color: #ccc;
      position: absolute;
      right: 20px;
      top: 20px;
      display: block;
      width: 18px;
      height: 18px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .yzp-ew-tab {
    display: inline-block;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    span {
      display: inline-block;
      height: 100%;
      width: 60px;
      line-height: 40px;
      font-size: 12px;
      color: #555;
      text-align: center;
      background: #eeeeee;
      cursor: pointer;
      border-left: 1px solid #dddddd;
      &:first-child {
        border: 0;
      }
      &.active {
        background: #20a8fe;
        color: #ffffff;
      }
    }
  }
  .yzp-ew-zoom {
    position: absolute;
    width: 60px;
    height: auto;
    right: 60px;
    top: 10px;
    box-shadow: 0 0 10px #cccccc;
    border: 1px solid #eeeeee;
    background: #ffffff;
  }
  .yzp-ew-content {
    margin-top: 20px;
    .yzp-ew-list {
      overflow: hidden;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding-top: 1px;
      padding-left: 1px;
      li {
        padding: 10px;
        border: 1px dotted #ccc;
        margin-top: -1px;
        margin-left: -1px;
        position: relative;
        &:hover {
          background: #eee;
          cursor: pointer;
        }
        .yzp-ew-item {
          width: 30px;
          height: 30px;
          background: url("../static/images/icon/loading.gif");
          background-size: cover !important;
          background-position: center;
        }
      }
    }
  }
}
@keyframes toTop {
	0% {
		transform: translateY(30px);
	}
	100% {
		transform: translateY(0);
	}
}
</style>
