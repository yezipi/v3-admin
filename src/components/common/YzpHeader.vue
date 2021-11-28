<template>
  <div :class="{ collapsed }" class="yzp-head">
    <div class="head-left">
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
    <div class="head-right">
      <a-dropdown>
        <div class="right-avatar">
          <a-avatar :size="40" :src="user.avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span>{{ user.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a @click="logout">退出</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined,
    UserOutlined
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {

    const collapsed = ref(false)
    const toggleMenu = () => {
      collapsed.value = !collapsed.value
      emit('collapseMenu', collapsed.value)
    }

    const Store = useStore()
    const Router = useRouter()
    const user = computed(() => Store.state.user)

    const logout = () => {
      Store.dispatch('clearUser')
      Router.replace('/login')
    }

    return {
      collapsed,
      user,
      toggleMenu,
      logout,
    }

  }
})

</script>

<style lang="less">
.yzp-head {
  position: fixed;
  z-index: 9;
  backdrop-filter: saturate(150%) blur(10px);
  background: rgba(255,255,255,0.5);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  right: 0;
  left: 200px;
  transition: all 0.3s;
  &.collapsed {
    left: 80px;
  }
  .head-left {
    display: flex;
    align-items: center;
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
        background: rgba(255,255,255,0.5);
      }
    }
  }
  .head-right {
    margin-right: 40px;
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }
}
</style>

