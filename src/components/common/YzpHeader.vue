<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined, 
  ReloadOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
  BellOutlined
} from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['collapseMenu'])
const collapsed = ref(false)
const toggleMenu = () => {
  collapsed.value = !collapsed.value
  emit('collapseMenu', collapsed.value)
}

const Store = useStore()
const Router = useRouter()
const user = computed(() => Store.state.user)

const logout = () => {
  Router.replace({
    name: 'Login',
    query: {
      referrer: Router.currentRoute.value.name as any
    }
  })
  Store.dispatch('clearUser')
}

const changeStyle = () => {
  Store.commit('changeStyle', Store.state.style === 1 ? 2 : 1)
}

</script>

<template>
  <div :class="{ collapsed, hasMenu: $slots.menu }" class="yzp-head">
    <div v-if="!$slots.menu" class="head-left">
      <div class="left-btn" @click="toggleMenu">
        <MenuFoldOutlined v-if="collapsed" />
        <MenuUnfoldOutlined v-else />
      </div>
      <div class="left-btn">
        <ReloadOutlined />
      </div>
      <a-breadcrumb style="margin-left: 10px">
        <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{ item }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="$slots.menu" class="head-left">
      <div class="yzp-logo">
        <img src="@/assets/logo.png" />
      </div>
      <div class="head-menu">
        <slot name="menu"></slot>
      </div>
    </div>
    <div class="head-right">
      <!--消息菜单-->
      <a-dropdown placement="bottomRight">
        <div class="user-message">
        <a-badge count="5">
          <bell-outlined style="font-size: 20px;" />
        </a-badge>
      </div>
        <template #overlay>
          <a-menu>
            <div class="message-wrap">
              <a-tabs class="message-tab" centered>
                <a-tab-pane key="1" tab="评论">Content of Tab Pane 1</a-tab-pane>
                <a-tab-pane key="2" tab="留言">Content of Tab Pane 2</a-tab-pane>
                <a-tab-pane key="3" tab="友链">Content of Tab Pane 3</a-tab-pane>
              </a-tabs>
            </div>
          </a-menu>
        </template>
      </a-dropdown>
      <!--end 消息菜单-->

      <!--用户菜单-->
      <a-dropdown placement="bottomRight">
        <div class="right-avatar">
          <a-avatar :size="40" :src="user.avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="user-name">{{ user.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="changeStyle">
              <robot-outlined />
              <a style="margin-left: 10px;">切换布局</a>
            </a-menu-item>
            <a-menu-item @click="logout">
              <logout-outlined />
              <a style="margin-left: 10px;">退出</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!--end 用户菜单-->
    </div>
  </div>
</template>

<style lang="less">
.yzp-head {
  position: sticky;
  z-index: 9;
  backdrop-filter: saturate(150%) blur(10px);
  background: rgba(255, 255, 255, 0.5);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  right: 0;
  left: 0;
  transition: all 0.3s;
  &.hasMenu {
    left: 0;
  }
  .head-left {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    .left-btn {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: #666666;
      &:hover {
        cursor: pointer;
        background: #eeeeee;
      }
    }
    .head-menu {
      width: calc(100vw - 280px);
    }
  }
  .head-right {
    margin-right: 15px;
    display: flex;
    align-items: center;
    height: 100%;
    .user-message {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      width: 60px;
      height: 100%;
      cursor: pointer;
      &:hover {
        background: #eeeeee;
      }
    }
    .right-avatar {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      cursor: pointer;
      .user-name {
        display: inline-block;
        margin-left: 10px;
        flex-shrink: 0;
      }
    }
  }
  .yzp-logo {
    width: 40px;
    height: 40px;
    margin: 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.message-wrap {
  background: #ffffff;
  padding: 10px;
  padding-top: 0;
  width: 300px;
  .message-item {
    padding: 10px;
  }
}
</style>
<style lang="less">
.message-tab .ant-tabs-nav-wrap {
  display: block!important;
  .ant-tabs-tab {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>

