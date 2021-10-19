<template>
  <div class="yzp-app">
    
    <YzpAside
      v-if="showBar"
      :menus="menus"
      :openName="openName"
      :selectName="selectName"
      ref="menuRef"
    />

    <div v-if="showBar" class="yzp-main">
      <YzpHeader @collapseMenu="collapseMenu" />
      <section class="yzp-section">
        <div class="yzp-content">
          <router-view />
        </div>
      </section>
    </div>

    <div v-else class="yzp-main no-margin">
      <router-view />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount, toRefs, reactive } from 'vue'
import { useRouter, useRoute  } from 'vue-router'

export default defineComponent({
  setup() {
    const menuRef = ref()
    const showBar = ref(false)
    const menuState = reactive({
      openName: [] as any,
      selectName: [ 'Home' ] as any
    })

    const route = useRoute()
    const router = useRouter()
    const routes = router.options.routes
    const menus = reactive(routes.filter((e: any) => !e.meta.noMenu))

    watch(() => route.path, (path: {} | any) => {
      menus.forEach((e: any) => {
        if (e.children) {
          e.children.forEach((c: any) => {
            if (c.name === route.name) {
              menuState.openName = [ e.name ]
              menuState.selectName = [ c.name ]
            }
          });
        }
      })
      showBar.value = path !== '/login'
    })

    const collapseMenu = () => {
      menuRef.value.toggleCollapsed()
    }

    onBeforeMount(() => {
      console.log(route)
      showBar.value = route.path !== '/login'
    })

    return {
      menuRef,
      showBar,
      menus,
      ...toRefs(menuState),
      collapseMenu
    }
  }
})

</script>

<style lang="scss">
body {
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(255,255,255,0.5);
    z-index: 0;
  }
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: #f5f5f5 url('./assets/img/1bg.jpg') center no-repeat;
    background-size: cover;
    background-attachment: fixed;
    filter: blur(10px);
    z-index: -1;
    transform: scale(1.2);
  }
}
.ant-menu-dark .ant-menu-inline.ant-menu-sub {
  background: rgba(0,0,0,0.3)!important;
}
.yzp-app {
  display: flex;
  justify-content: space-between;
  height: 100vh;
}
.yzp-main {
  flex: 1;
  margin-top: 60px;
  overflow-y: auto;
  &.no-margin {
    margin-top: 0;
    .yzp-section {
      margin: 0;
      border-radius: 0;
      backdrop-filter: saturate(0%) blur(0);
      background: none;
      .yzp-content {
        padding: 0;
      }
    }
  }
}
.yzp-section {
  margin: 15px;
  backdrop-filter: saturate(150%) blur(10px);
  background: rgba(255,255,255,0.5);
  border-radius: 5px;
}
.yzp-content {
  padding: 15px;
}
.ant-input-affix-wrapper {
  background-color: rgba(255,255,255,0.5)!important;
}
.ant-input, .ant-table {
  background: none!important;
}
</style>

