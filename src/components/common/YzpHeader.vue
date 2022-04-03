<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined, 
  ReloadOutlined,
  UserOutlined,
  LogoutOutlined,
  BgColorsOutlined,
  CloudOutlined,
  BellOutlined
} from '@ant-design/icons-vue'
import Store from '@/store/index'
import { useRouter } from 'vue-router'
import { timeAgao } from '@/utils/index'
import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils'
import MessageApi from '@/api/message'

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['collapseMenu'])

const collapsed = ref(false)
const Router = useRouter()
const user = computed(() => Store.state.user)
const msgCount = ref(0)
const unReadComments = ref<any>({ count: 0, rows: [] })
const unReadFeedbacks = ref<any>({ count: 0, rows: [] })
const unReadBlogrolls = ref<any>({ count: 0, rows: [] })

const unReadMsg = computed(() => Store.state.msg)

const activeMsgType = ref('comments')

const menuStyle = computed(() => +Store.state.menuStyle)
const theme = computed(() => Store.state.theme)

const toggleMenu = () => {
  collapsed.value = !collapsed.value
  emit('collapseMenu', collapsed.value)
}

const logout = () => {
  Router.replace({
    name: 'Login',
    query: {
      referrer: Router.currentRoute.value.name as any
    }
  })
  Store.dispatch('clearUser')
}

const changeMenuStyle = () => {
  Store.commit('changeMenuStyle', Store.state.menuStyle === 1 ? 2 : 1)
}

const changeTheme = (theme: string) => {
  toggleTheme({ scopeName: theme })
  Store.commit('changeTheme', theme )
}

// 获取未审核内容
MessageApi.getUnRead()

onMounted(() => changeTheme(theme.value))

</script>

<template>
  <div :class="{ collapsed, hasMenu: $slots.menu }" class="yzp-head">
    <div v-if="!$slots.menu" class="yzp-head-left">
      <div class="yzp-head-left-btn" @click="toggleMenu">
        <MenuFoldOutlined v-if="collapsed" />
        <MenuUnfoldOutlined v-else />
      </div>
      <div class="yzp-head-left-btn">
        <ReloadOutlined />
      </div>
      <a-breadcrumb style="margin-left: 10px">
        <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{ item }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div v-if="$slots.menu" class="yzp-head-left">
      <div class="yzp-head-logo">
        <img src="@/assets/logo.png" />
      </div>
      <div class="yzp-head-menu">
        <slot name="menu"></slot>
      </div>
    </div>
    <div class="yzp-head-right">
      <!--消息菜单-->
      <a-dropdown placement="bottomRight">
        <div class="yzp-head-user-message">
        <a-badge :count="unReadMsg.count">
          <bell-outlined style="font-size: 20px;" />
        </a-badge>
      </div>
        <template #overlay>
          <a-menu>
            <div class="yzp-head-msg-wrap">
              <a-tabs v-model:value="activeMsgType" class="yzp-head-msg-tab" centered>

                <a-tab-pane key="comments" :tab="`评论(${unReadMsg.data.comments.count})`">
                  <div v-for="(item, index) in unReadMsg.data.comments.rows" :key="index" class="yzp-head-msg-item">
                    <div class="yzp-head-msg-user">
                      <span class="yzp-head-msg-user-nickname">{{ item.nickname }}</span>
                      <span class="yzp-head-msg-user-preffix">{{ item.preffix }}</span>
                      <span v-if="item.article_type !== 'mood'" class="yzp-head-msg-user-title">《{{ item.title }}》</span>
                    </div>
                    <div class="yzp-head-msg-content">{{ item.content }}</div>
                    <div class="yzp-head-msg-date">{{ timeAgao(item.createdAt) }}</div>
                  </div>
                  <a-empty v-if="!unReadMsg.data.comments.rows.length" />
                </a-tab-pane>

                <a-tab-pane key="feedbacks" :tab="`留言(${unReadMsg.data.feedbacks.count})`">
                  <div v-for="(item, index) in unReadMsg.data.feedbacks.rows" :key="index" class="yzp-head-msg-item">
                    <div class="yzp-head-msg-user">
                      <span class="yzp-head-msg-user-nickname">{{ item.nickname }}</span>
                      <span class="yzp-head-msg-user-preffix">{{ item.preffix }}</span>
                    </div>
                    <div class="yzp-head-msg-content">{{ item.content }}</div>
                    <div class="yzp-head-msg-date">{{ timeAgao(item.createdAt) }}</div>
                  </div>
                  <a-empty v-if="!unReadMsg.data.feedbacks.rows.length" />
                </a-tab-pane>

                <a-tab-pane key="blogrolls" :tab="`友链(${unReadMsg.data.blogrolls.count})`">
                  <div v-for="(item, index) in unReadMsg.data.blogrolls.rows" :key="index" class="yzp-head-msg-item">
                    <div class="yzp-head-msg-user">
                      <span class="yzp-head-msg-user-nickname">{{ item.nickname }}</span>
                      <span class="yzp-head-msg-user-preffix">{{ item.preffix }}</span>
                    </div>
                    <div class="yzp-head-msg-content">{{ item.content }}</div>
                    <div class="yzp-head-msg-date">{{ timeAgao(item.createdAt) }}</div>
                  </div>
                  <a-empty v-if="!unReadMsg.data.blogrolls.rows.length" />
                </a-tab-pane>

              </a-tabs>
            </div>
          </a-menu>
        </template>
      </a-dropdown>
      <!--end 消息菜单-->

      <!--用户菜单-->
      <a-dropdown placement="bottomRight">
        <div class="yzp-head-right-avatar">
          <a-avatar :size="40" :src="user.avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="yzp-head-user-name">{{ user.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item  @click="changeMenuStyle">
              <cloud-outlined />
              <a style="margin-left: 10px;">{{ menuStyle === 2 ? '垂直菜单' : '水平菜单' }}</a>
            </a-menu-item>
            <a-menu-item  @click="changeTheme(theme === 'theme-dark' ? 'theme-default' : 'theme-dark')">
              <bg-colors-outlined />
              <a style="margin-left: 10px;">{{ theme === 'theme-dark' ? '默认主题' : '暗黑主题' }}</a>
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

<style lang="less" scoped>
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
  .yzp-head-left {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    height: 100%;
    .yzp-head-left-btn {
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
    .yzp-head-menu {
      width: calc(100vw - 280px);
    }
  }
  .yzp-head-right {
    margin-right: 15px;
    display: flex;
    align-items: center;
    height: 100%;
    .yzp-head-user-message {
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
    .yzp-head-right-avatar {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      cursor: pointer;
      .yzp-head-user-name {
        display: inline-block;
        margin-left: 10px;
        flex-shrink: 0;
      }
    }
  }
  .yzp-head-logo {
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
  .yzp-head-msg-wrap {
    background: #ffffff;
    width: 300px;
    max-height: 500px;
    overflow-y: auto;
    .yzp-head-msg-item {
      padding: 10px 15px;
      border-bottom: 1px solid #eeeeee;
      &:first-child {
        margin-top: -16px;
      }
      &:last-child {
        border: 0;
      }
      &:hover {
        background: #f5f5f5;
      }
      .yzp-head-msg-user {
        font-size: 12px;
        color: #666666;
        .yzp-head-msg-user-title {
          color: @primary-color;
        }
        .yzp-head-msg-user-nickname {
          font-weight: bold;
        }
        .yzp-head-msg-user-preffix {
          display: inline-block;
          margin: 0 5px;
        }
      }
      .yzp-head-msg-content {
        color: #333333;
        font-size: 12px;
        margin: 5px 0;
      }
      .yzp-head-msg-date {
        font-size: 12px;
        color: #999999;
      }
    }
  }
</style>

