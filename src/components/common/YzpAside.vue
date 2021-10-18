<template>
  <div :class="{ collapsed }" class="yzp-aside">
    <div class="yzp-logo">
      <img src="../../assets/logo.png" />
    </div>
    <a-menu
      class="yzp-menu"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
    >
      <template v-for="(item) in menus">
        <a-menu-item v-if="!item.children" :key="item.name" @click="onMenuClick(item)">
          <template #icon>
            <component :is="item.meta.icon"></component>
          </template>
          {{ item.meta.title }}
        </a-menu-item>
        <a-sub-menu v-else :key="item.name">
          <template #icon>
            <component :is="item.meta.icon"></component>
          </template>
          <template #title>{{ item.meta.title }}</template>
          <template v-if="item.children.length">
            <template v-for="(sub, idx) in item.children">
              <a-menu-item v-if="!sub.meta.noMenu" :key="sub.name" @click="onMenuClick(sub)">{{ sub.meta.title }}</a-menu-item>
            </template>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter  } from 'vue-router'

export default defineComponent({
  props: {
    openName: {
      type: Array,
      default: () => []
    },
    selectName: {
      type: Array,
      default: () => []
    },
    menus: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const state = reactive({
      collapsed: false,
      selectedKeys: props.selectName,
      openKeys: props.openName,
      preOpenKeys: [] as any,
    });

    const router = useRouter()

    watch(() => [
      state.openKeys,
      props.selectName,
      props.openName,
    ], (
        [ newPre, newSelect, newOpen],
        [ oldPre ],
      ) => {
        state.preOpenKeys = oldPre;
        state.selectedKeys = newSelect,
        state.openKeys = newOpen
      },
    );

    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    const onMenuClick = ({ path }: { path: string }) => {
      if (!path) {
        return
      }
      if (router.currentRoute.value.path === path) {
        return
      }
      router.push(path)
    }

    return {
      ...toRefs(state),
      toggleCollapsed,
      onMenuClick,
    };
  }
})

</script>

<style scoped lang="scss">
.yzp-aside {
  backdrop-filter: saturate(150%) blur(10px);
  background: rgba(0,0,0,0.5);
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  width: 200px;
  transition: all 0.3s;
  &.collapsed {
    width: 80px;
    .yzp-logo {
      width: 40px;
      height: 40px;
    }
  }
  .yzp-logo {
    width: 80px;
    height: 80px;
    margin: 30px auto;
    transition: all 0.3s;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .yzp-menu.ant-menu-dark, .yzp-menu-dark .yzp-menu-sub, .yzp-menu.ant-menu-dark .ant-menu-sub {
    background: none
  }
}
</style>

