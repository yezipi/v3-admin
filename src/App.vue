<template>
  <div class="yzp-app">
    
    <YzpAside
      v-if="isFullPage"
      :menus="menus"
      :openName="openName"
      :selectName="selectName"
      ref="aside"
    />

    <div v-if="isFullPage" class="yzp-main">
      <YzpHeader @collapseMenu="collapseMenu" />

      <section class="yzp-section">
        <div class="yzp-content">
          <router-view />
        </div>
      </section>
    </div>

    <!--未登录显示-->
    <div v-else class="yzp-main no-margin">
      <router-view />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, reactive } from 'vue'
import { useRouter, useRoute  } from 'vue-router'

export default defineComponent({
  setup() {
    const aside = ref()
    const isFullPage = ref(false)
    const menuState = reactive({
      openName: [] as any,
      selectName: [ 'Home' ] as any
    })

    const route = useRoute()
    const router = useRouter()
    const routes = router.options.routes
    const menus = reactive(routes.filter((e: any) => !e.meta.noMenu))

    const setFullPageState = () => {
      isFullPage.value = route.name !== 'Login'
    }

    watch(() => route.name, () => {
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
      setFullPageState()
    })

    const collapseMenu = () => {
      aside.value.toggleCollapsed()
    }

    return {
      ...toRefs(menuState),
      aside,
      menus,
      isFullPage,
      collapseMenu
    }
  }
})

</script>

<style lang="less">
@import './assets/css/reset.less';

.halfWhite {
  background: rgba(255,255,255,0.5)!important;
}
* {
  padding: 0;
  margin: 0;
}
body {
  font-size: 14px;
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
    .halfWhite;
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
  .halfWhite;
  margin: 15px;
  backdrop-filter: saturate(150%) blur(10px);
  border-radius: 5px;
  min-height: calc(100vh - 90px);
}
.yzp-content {
  padding: 15px;
}
</style>

