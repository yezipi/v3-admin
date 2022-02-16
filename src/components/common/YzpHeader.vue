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
import Store from '@/store/index'
import { useRouter } from 'vue-router'
import ReportApi from '@/api/report'
import { timeAgao } from '@/utils/index'

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['collapseMenu'])

const collapsed = ref(false)
// const Store = useStore(globalStoreKey)
const Router = useRouter()
const user = computed(() => Store.state.user)
const msgCount = computed(() => Store.state.msgData.count)
const unAuditComments = computed(() => Store.state.msgData.data.comments)
const unAuditFeedbacks = computed(() => Store.state.msgData.data.feedbacks)
const unAuditBlogrolls = computed(() => Store.state.msgData.data.blogrolls)
const activeMsgType = ref('comments')

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

const changeStyle = () => {
  Store.commit('updateStyle', Store.state.style === 1 ? 2 : 1)
}

// 获取未审核内容
ReportApi.getUnAudit()

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
      <a-dropdown position="br" trigger="hover">
        <div class="user-message">
          <a-badge :count="msgCount">
            <bell-outlined style="font-size: 20px;" />
          </a-badge>
        </div>
        <template #content>
          <div>
            <div class="msg-wrap">
              <a-tabs v-model:value="activeMsgType" class="msg-tab">
                <a-tab-pane key="comments" :title="`评论(${unAuditComments.count})`">
                  <div v-for="(item, index) in unAuditComments.rows" :key="index" class="msg-item">
                    <div class="msg-user">
                      <span>{{ item.nickname }}</span>
                      <span>{{ timeAgao(item.createdAt) }}</span>
                    </div>
                    <span class="msg-content">{{ item.content }}</span>
                  </div>
                  <a-empty v-if="!unAuditComments.rows.length" />
                </a-tab-pane>
                <a-tab-pane key="feedbacks" :title="`留言(${unAuditFeedbacks.count})`">
                  <div v-for="(item, index) in unAuditFeedbacks.rows" :key="index" class="msg-item">
                    <div class="msg-user">
                      <span>{{ item.nickname }}</span>
                      <span>{{ timeAgao(item.createdAt) }}</span>
                    </div>
                    <span class="msg-content">{{ item.content }}</span>
                  </div>
                  <a-empty v-if="!unAuditFeedbacks.rows.length" />
                </a-tab-pane>
                <a-tab-pane key="blogrolls" :title="`友链(${unAuditBlogrolls.count})`">
                  <div v-for="(item, index) in unAuditBlogrolls.rows" :key="index" class="msg-item">
                    <div class="msg-user">
                      <span>{{ item.nickname }}</span>
                      <span>{{ timeAgao(item.createdAt) }}</span>
                    </div>
                    <span class="msg-content">{{ item.content }}</span>
                  </div>
                  <a-empty v-if="!unAuditBlogrolls.rows.length" />
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </template>
      </a-dropdown>
      <!--end 消息菜单-->

      <!--用户菜单-->
      <a-dropdown position="br" trigger="hover">
        <div class="right-avatar">
          <a-avatar :size="40">
            <UserOutlined v-if="!user.avatar" />
            <img v-else class="yzp-user-avatar" :src="user.avatar" />
          </a-avatar>
          <span class="user-name">{{ user.nickname }}</span>
        </div>
        <template #content>
          <a-doption @click="changeStyle">
            <robot-outlined />
            <span style="margin-left: 10px">切换布局</span>
          </a-doption>
          <a-doption @click="logout">
            <logout-outlined />
            <span style="margin-left: 10px">退出</span>
          </a-doption>
        </template>
      </a-dropdown>
      <!--end 用户菜单-->
    </div>
  </div>
</template>

<style scoped lang="less">
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
    height: 100%;
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
      .yzp-user-avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
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
.msg-wrap {
  background: #ffffff;
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
  .msg-item {
    padding: 10px 15px;
    border-bottom: 1px solid #eeeeee;
    &:last-child {
      border: 0;
    }
    &:hover {
      background: #f5f5f5;
    }
    .msg-user {
      display: flex;
      align-items: center;
      span:first-child {
        display: inline-block;
        color: #ff6666;
        margin-right: 10px;
        font-size: 12px;
      }
      span:nth-child(2) {
        color: #999999;
        font-size: 12px;
      }
    }
    .msg-content {
      color: #666666;
      font-size: 12px;
    }
  }
}
</style>
<style lang="less">
.arco-tabs-nav-tab-list {
  width: 100%;
  display: flex!important;;
}
.arco-tabs-nav-type-line .arco-tabs-tab {
  display: flex;
  flex: 1;
  justify-content: center;
}
</style>

