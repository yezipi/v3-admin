<template>
  <div :class="{ collapsed, horizontal: mode === 'horizontal' }" class="yzp-aside">
    <div v-if="mode !== 'horizontal'" class="yzp-logo">
      <img src="@/assets/logo.png" />
    </div>
    <a-menu
      class="yzp-menu"
      :theme="theme"
      :mode="mode"
      :inline-collapsed="collapsed"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      @openChange="onOpenChange"
    >
      <template v-for="(item) in menus">
        <a-menu-item v-if="!item.children && showMenu(item.name)" :key="item.name" @click="onMenuClick(item)">
          <template #icon>
            <component :is="item.meta.icon"></component>
          </template>
          {{ item.meta.title }}
        </a-menu-item>
        <template v-else>
          <a-sub-menu v-if=" showMenu(item.name)" :key="item.name">
            <template #icon>
              <component :is="item.meta.icon"></component>
            </template>
            <template #title>{{ item.meta.title }}</template>
            <template v-if="item.children.length">
              <template v-for="(sub) in item.children">
                <a-menu-item v-if="!sub.meta.noMenu &&  showMenu(sub.name)" :key="sub.name" @click="onMenuClick(sub)">{{ sub.meta.title }}</a-menu-item>
              </template>
            </template>
          </a-sub-menu>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'
import { useRouter  } from 'vue-router'
import { useStore } from 'vuex'
import { MenuMode, MenuTheme } from 'ant-design-vue/es/menu/src/interface'

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
      type: Array as any,
      default: () => []
    },
    mode: {
      default: 'inline' as MenuMode
    },
    theme: {
      default: 'dark' as MenuTheme
    }
  },
  setup(props) {
    const router = useRouter()
    const store = useStore()

    const permissions = computed(() => store.getters.permissions as Array<any>)

    console.log(permissions.value.includes('Home'))

    const state = reactive({
      collapsed: false,
      selectedKeys: props.selectName,
      openKeys: props.mode !== 'horizontal' ? props.openName : [] as any,
      preOpenKeys: [] as any,
      rootSubmenuKeys: router.options.routes.map((e: any) => e.name)
    })

    watch(() => [
      props.selectName,
      props.openName,
    ], (
        [ newSelect, newOpen],
        [ oldPre ],
      ) => {
        state.preOpenKeys = oldPre;
        state.selectedKeys = newSelect,
        state.openKeys = props.mode !== 'horizontal' ? newOpen : []
      },
    )

    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed
      state.openKeys = state.collapsed ? [] : state.preOpenKeys
    }

    const onMenuClick = ({ path }: { path: string }) => {
      if (!path) {
        return
      }
      if (router.currentRoute.value.path === path) {
        return
      }
      router.push(path)
    }

    const onOpenChange = (openKeys: any[]) => {
      if (props.mode === 'horizontal') {
        return
      }
      if (openKeys.length) {
        state.openKeys = [openKeys[openKeys.length - 1]]
      } else {
        state.openKeys = []
      }
    }

    const showMenu = (name: string) => {
      return permissions.value.includes(name)
    }

    return {
      ...toRefs(state),
      permissions,
      toggleCollapsed,
      onMenuClick,
      onOpenChange,
      showMenu,
    };
  }
})

</script>

<style scoped lang="less">
.yzp-aside {
  // backdrop-filter: saturate(150%) blur(10px);
  background: #001529;
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
  &.horizontal {
    width: auto;
    height: auto;
    overflow: initial;
    background: none!important;
    backdrop-filter: none!important;
    :deep(.ant-menu-horizontal) {
      background: none!important;
      border-bottom: 0;
      box-shadow: none;
    }
  }
  .yzp-logo {
    width: 80px;
    height: 80px;
    margin: 20px auto;
    transition: all 0.3s;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .yzp-menu.ant-menu-dark,
  .yzp-menu-dark .yzp-menu-sub, 
  .yzp-menu.ant-menu-dark .ant-menu-sub
  {
    background: none
  }
  
  :deep(.ant-menu-submenu-horizontal .ant-menu-submenu-arrow) {
    display: block;
    right: -16px;
    color: #999999;
    font-weight: normal;
    transform: rotate(90deg);
  }
}
</style>

