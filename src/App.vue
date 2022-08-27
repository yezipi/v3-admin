<script lang="ts" setup>
import { ref, watch, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

dayjs.locale('zh-cn')

const menuRef = ref()
const isMainPage = ref(false)
const menuState = reactive({
  openName: [] as any,
  selectName: ['Home'] as any
})

const breadcrumbs = ref()

const route = useRoute()
const router = useRouter()
const store = useStore()
const routes = router.options.routes
const menus = reactive(routes.filter((e: any) => !e.meta.noMenu))
const menuStyle = computed(() => Number(store.state.menuStyle))
const error = computed(() => store.state.error)
const token = computed(() => store.state.token)

const setPageState = () => {
  isMainPage.value = route.name !== 'Login'
}

watch(() => route.name, () => {
  breadcrumbs.value = []
  menus.forEach((e: any) => {
    if (e.children) {
      e.children.forEach((c: any) => {
        if (c.name === route.name) {
          menuState.openName = [e.name]
          menuState.selectName = [c.name]
          breadcrumbs.value = [e.meta.title, c.meta.title]
        }
      });
    } else {
      if (e.name === route.name) {
        menuState.openName = [e.name]
        menuState.selectName = [e.name]
        breadcrumbs.value = [e.meta.title]
      }
    }
  })
  setPageState()
})

const collapseMenu = () => {
  menuRef.value.toggleCollapsed()
}

onMounted(() => {
  setPageState()
})

</script>

<template>
  <div class="yzp-app">
    <a-config-provider :locale="zhCN">
      <yzp-menu 
        v-if="isMainPage && menuStyle === 1 && token"
        :menus="menus"
        :openName="menuState.openName"
        :selectName="menuState.selectName"
        ref="menuRef"
      >
      </yzp-menu>

      <div v-if="isMainPage && token" class="yzp-main">
        <yzp-header :breadcrumbs="breadcrumbs" @collapseMenu="collapseMenu">
          <template v-if="menuStyle === 2" #menu>
            <yzp-menu :menus="menus" :openName="menuState.openName" :selectName="menuState.selectName" theme="light"
              mode="horizontal" ref="menuRef">
            </yzp-menu>
          </template>
        </yzp-header>
        <a-breadcrumb class="yzp-breadcrumb" v-if="menuStyle === 2">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{ item }}</a-breadcrumb-item>
        </a-breadcrumb>

        <router-view v-if="error.status === 200" :class="{ hasBreadcrumb: menuStyle === 2 }" class="yzp-section" />
        <div v-else class="yzp-section" style="display: flex; align-items: center; justify-content: center;">
          <a-result :status="error.status" :title="error.msg"></a-result>
        </div>
      </div>

      <!--未登录显示-->
      <router-view v-else class="yzp-main no-margin" />
    </a-config-provider>
  </div>
</template>

<style lang="less">
:root {

  /* --rgb-primary: 255,102,102; */
  --rgb-primary: 54, 164, 108;
  --rgb-white: 255, 255, 255;
  --rgb-dark: 51, 51, 51;
  --rgb-sub: 51, 163, 255;

  --color-dark: rgb(var(--rgb-dark));
  --color-white: rgb(var(--rgb-white));
  --color-primary: rgb(var(--rgb-primary));
  --color-gray: rgba(var(--rgb-dark), 0.6);
  --color-primary-05: rgba(var(--rgb-primary), 0.5);
  --color-primary-01: rgba(var(--rgb-primary), 0.1);
  --color-link: rgb(var(--rgb-sub));

  --bg-white: rgba(var(--rgb-white),1);
  --bg-primary: rgba(var(--rgb-dark), 0.05);

  --border-1: rgba(var(--rgb-dark), 0.1);
  --border-2: rgba(var(--rgb-dark), 0.2);

}
.halfWhite {
  background: rgba(255, 255, 255, 0.8) !important;
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
  background: #f0f0f0;
}

.ant-menu-dark .ant-menu-inline.ant-menu-sub {
  background: rgba(0, 0, 0, 0.3) !important;
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
      padding: 0;
    }
  }
}

.yzp-section {
  .halfWhite;
  margin: 15px;
  border-radius: 5px;
  min-height: calc(100vh - 110px);
  padding: 15px;
  position: relative;

  &.hasBreadcrumb {
    min-height: calc(100vh - 150px);
  }
}

.yzp-breadcrumb {
  margin-left: 15px !important;
  margin-top: 15px !important;
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
    max-width: 100% !important;
  }
}
</style>

