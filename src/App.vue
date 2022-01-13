<template>
  <div class="yzp-app">
    <a-config-provider :locale="locale">
      <yzp-menu
        v-if="isFullPage && menuStyle === 1"
        :menus="menus"
        :openName="openName"
        :selectName="selectName"
        ref="menuRef"
      >
      </yzp-menu>

      <div v-if="isFullPage" class="yzp-main">
        <yzp-header :breadcrumbs="breadcrumbs" @collapseMenu="collapseMenu">
          <template v-if="menuStyle === 2" #menu>
            <yzp-menu
              :menus="menus"
              :openName="openName"
              :selectName="selectName"
              theme="light"
              mode="horizontal"
              ref="menuRef"
            >
            </yzp-menu>
          </template>
        </yzp-header>
        <a-breadcrumb class="yzp-breadcrumb" v-if="menuStyle === 2">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{ item }}</a-breadcrumb-item>
        </a-breadcrumb>
        <section :class="{ hasBreadcrumb: menuStyle === 2 }"  class="yzp-section">
          <div class="yzp-content">
            <router-view />
          </div>
        </section>
      </div>

      <!--未登录显示-->
      <div v-else class="yzp-main no-margin">
        <router-view />
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, reactive, computed } from 'vue'
import { useRouter, useRoute  } from 'vue-router'
import { useStore } from 'vuex'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default defineComponent({
  setup() {
    const menuRef = ref()
    const isFullPage = ref(false)
    const menuState = reactive({
      openName: [] as any,
      selectName: [ 'Home' ] as any
    })

    const breadcrumbs = ref()

    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const routes = router.options.routes
    const menus = reactive(routes.filter((e: any) => !e.meta.noMenu))
    const menuStyle = computed(() => Number(store.state.style))

    const setFullPageState = () => {
      isFullPage.value = route.name !== 'Login'
    }

    watch(() => route.name, () => {
      breadcrumbs.value = []
      menus.forEach((e: any) => {
        if (e.children) {
          e.children.forEach((c: any) => {
            if (c.name === route.name) {
              menuState.openName = [ e.name ]
              menuState.selectName = [ c.name ]
              breadcrumbs.value = [e.meta.title, c.meta.title]
            }
          });
        } else {
          if (e.name === route.name) {
            menuState.openName = [ e.name ]
            menuState.selectName = [ e.name ]
            breadcrumbs.value = [e.meta.title]
          }
        }
      })
      setFullPageState()
    })

    const collapseMenu = () => {
      menuRef.value.toggleCollapsed()
    }

    return {
      ...toRefs(menuState),
      breadcrumbs,
      menuRef,
      menus,
      isFullPage,
      collapseMenu,
      locale: zhCN,
      menuStyle
    }
  }
})

</script>

<style lang="less">

.halfWhite {
  background: rgba(255,255,255,0.8)!important;
}
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
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
    z-index: -1;
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
    background: #cccccc url('./assets/img/overlay.png') center no-repeat;
    background-size: cover;
    background-attachment: fixed;
    filter: blur(10px);
    z-index: -2;
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
  border-radius: 5px;
  min-height: calc(100vh - 90px);
  &.hasBreadcrumb {
    min-height: calc(100vh - 130px);
  }
}
.yzp-content {
  padding: 15px;
}
.yzp-breadcrumb {
  margin-left: 15px!important;
  margin-top: 15px!important;
}
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.draw-content .ant-spin-spinning {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 80px;
  height: 50px;
}

@media screen and (max-width: 1024px) and (min-width: 320px) {
  .ant-col {
    max-width: 100%!important;
  }
}
</style>

