import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '../config'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: { title: '系统首页', icon: 'HomeOutlined' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
    meta: { title: '404', noMenu: true },
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
    meta: { noAuth: true, title: '登录', noMenu: true },
  },
  {
    path: '',
    name: 'Content',
    meta: { title: '内容管理', noLink: true, role: [1, 2], icon: 'el-icon-edit' },
    component: () => import(/* webpackChunkName: "ArticleIndex" */ '../views/Content/Index.vue'),
    children: [
      {
        path: '/ArticleEdit',
        name: 'ArticleEdit',
        meta: { title: '发布文章', noMenu: true },
        component: () => import(/* webpackChunkName: "ArticleEdit" */ '../views/Content/ArticleEdit.vue'),
      },
      {
        path: '/CaseEdit',
        name: 'CaseEdit',
        meta: { title: '案例发布', noMenu: true },
        component: () => import(/* webpackChunkName: "CaseEdit" */ '../views/Content/CaseEdit.vue'),
      },
      {
        path: '/MoodEdit',
        name: 'MoodEdit',
        meta: { title: '微语发布', noMenu: true },
        component: () => import(/* webpackChunkName: "MoodEdit" */ '../views/Content/MoodEdit.vue'),
      },
      {
        path: '/ArticleList',
        name: 'ArticleList',
        meta: { title: '文章管理', icon: 'el-icon-notebook-1' },
        component: () => import(/* webpackChunkName: "ArticleList" */ '../views/Content/ArticleList.vue'),
      },
      {
        path: '/CaseList',
        name: 'CaseList',
        meta: { title: '案例管理', icon: 'el-icon-ice-cream-round' },
        component: () => import(/* webpackChunkName: "CaseList" */ '../views/Content/CaseList.vue'),
      },
      {
        path: '/MoodList',
        name: 'MoodList',
        meta: { title: '微语管理', icon: 'el-icon-chat-dot-round' },
        component: () => import(/* webpackChunkName: "MoodList" */ '../views/Content/MoodList.vue'),
      },
      {
        path: '/LogList',
        name: 'LogList',
        meta: { title: '日志管理', icon: 'el-icon-notebook-2' },
        component: () => import(/* webpackChunkName: "LogList" */ '../views/Content/LogList.vue'),
      },
      {
        path: '/TagList',
        name: 'TagList',
        meta: { title: '标签管理', icon: 'el-icon-collection-tag' },
        component: () => import(/* webpackChunkName: "TagList" */ '../views/Content/TagList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'Interact',
    meta: { title: '互动管理', noLink: true, role: [1, 2], icon: 'el-icon-s-comment' },
    component: () => import(/* webpackChunkName: "InteractIndex" */ '../views/Interact/Index.vue'),
    children: [
      {
        path: '/CommentList',
        name: 'CommentList',
        meta: { title: '评论管理', role: [1, 2], icon: 'el-icon-chat-line-round' },
        component: () => import(/* webpackChunkName: "CommentList" */ '../views/Interact/CommentList.vue'),
      },
      {
        path: '/FeedbackList',
        name: 'FeedbackList',
        meta: { title: '留言管理', role: [1, 2], icon: 'el-icon-chat-dot-square' },
        component: () => import(/* webpackChunkName: "CommentIndex" */ '../views/Interact/FeedbackList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'BlogrollIndex',
    meta: { title: '友链管理', noLink: true, role: [1, 2], icon: 'el-icon-link' },
    component: () => import(/* webpackChunkName: "BlogrollIndex" */ '../views/Blogroll/Index.vue'),
    children: [
      {
        path: '/BlogrollList',
        name: 'BlogrollList',
        meta: { title: '友链列表', role: [1, 2], icon: 'el-icon-paperclip' },
        component: () => import(/* webpackChunkName: "BlogrollList" */ '../views/Blogroll/BlogrollList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'AlbumIndex',
    meta: { title: '相册管理', noLink: true, role: [1, 2], icon: 'el-icon-picture-outline' },
    component: () => import(/* webpackChunkName: "AlbumIndex" */ '../views/Album/Index.vue'),
    children: [
      {
        path: '/AlbumList',
        name: 'AlbumList',
        meta: { title: '相册列表', role: [1, 2], icon: 'el-icon-camera' },
        component: () => import(/* webpackChunkName: "AlbumList" */ '../views/Album/AlbumList.vue'),
      },
      {
        path: '/PictureList',
        name: 'PictureList',
        meta: { title: '相册列表', role: [1, 2], icon: 'el-icon-picture' },
        component: () => import(/* webpackChunkName: "PictureList" */ '../views/Album/PictureList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'ColumnIndex',
    meta: { title: '栏目管理', noLink: true, role: [1, 2], icon: 'el-icon-menu' },
    component: () => import(/* webpackChunkName: "ColumnIndex" */ '../views/Column/Index.vue'),
    children: [
      {
        path: '/ColumnList',
        name: 'ColumnList',
        meta: { title: '栏目列表', role: [1, 2], icon: 'el-icon-s-grid' },
        component: () => import(/* webpackChunkName: "ColumnList" */ '../views/Column/ColumnList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'UserIndex',
    meta: { title: '用户管理', noLink: true, role: [1, 2], icon: 'el-icon-user' },
    component: () => import(/* webpackChunkName: "UserIndex" */ '../views/User/Index.vue'),
    children: [
      {
        path: '/UserList',
        name: 'UserList',
        meta: { title: '用户列表', noLink: true, role: [1, 2], icon: 'el-icon-s-custom' },
        component: () => import(/* webpackChunkName: "UserList" */ '../views/User/UserList.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'SettingsIndex',
    meta: { title: '系统设置', noLink: true, role: [1, 2], icon: 'el-icon-setting' },
    component: () => import(/* webpackChunkName: "SettingsIndex" */ '../views/Settings/Index.vue'),
    children: [
      {
        path: '/AdSettings',
        name: 'AdSettings',
        meta: { title: '广告设置', role: [1, 2], icon: 'el-icon-s-flag' },
        component: () => import(/* webpackChunkName: "AdSettings" */ '../views/Settings/AdSettings.vue'),
      },
      {
        path: '/MailSettings',
        name: 'MailSettings',
        meta: { title: '邮件设置', role: [1, 2], icon: 'el-icon-message' },
        component: () => import(/* webpackChunkName: "MailSettings" */ '../views/Settings/MailSettings.vue'),
      },
      {
        path: '/CustomSettings',
        name: 'CustomSettings',
        meta: { title: '个性化设置', role: [1, 2], icon: 'el-icon-s-open' },
        component: () => import(/* webpackChunkName: "CustomSettings" */ '../views/Settings/CustomSettings.vue'),
      },
      {
        path: '/BaseSettings',
        name: 'BaseSettings',
        meta: { title: '基本设置', role: [1, 2], icon: 'el-icon-s-tools' },
        component: () => import(/* webpackChunkName: "BaseSettings" */ '../views/Settings/BaseSettings.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes
})

export default router
