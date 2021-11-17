import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '@/config'
import { 
  HomeOutlined,
  EditOutlined,
  CopyOutlined,
  CommentOutlined,
  LinkOutlined,
  PictureOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '系统首页', icon: HomeOutlined },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import( '@/views/404.vue'),
    meta: { title: '404', noMenu: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { noAuth: true, title: '登录', noMenu: true },
  },
  {
    path: '/content-edit',
    name: 'ContentEdit',
    meta: { title: '内容发布', noLink: true, role: [1, 2], icon: EditOutlined },
    component: () => import('@/views/ContentEdit/Index.vue'),
    children: [
      {
        path: '/article/edit',
        name: 'ArticleEdit',
        meta: { title: '发布文章' },
        component: () => import('@/views/ContentEdit/ArticleEdit.vue'),
      },
      {
        path: '/case/edit',
        name: 'CaseEdit',
        meta: { title: '案例发布' },
        component: () => import('@/views/ContentEdit/CaseEdit.vue'),
      },
      {
        path: '/mood/edit',
        name: 'MoodEdit',
        meta: { title: '微语发布' },
        component: () => import('@/views/ContentEdit/MoodEdit.vue'),
      },
    ],
  },
  {
    path: '/content-list',
    name: 'ContentList',
    meta: { title: '内容管理', noLink: true, role: [1, 2], icon: CopyOutlined },
    component: () => import('@/views/ContentList/Index.vue'),
    children: [
      {
        path: '/article/list',
        name: 'ArticleList',
        meta: { title: '文章管理', icon: 'el-icon-notebook-1' },
        component: () => import('@/views/ContentList/ArticleList.vue'),
      },
      {
        path: '/case/list',
        name: 'CaseList',
        meta: { title: '案例管理', icon: 'el-icon-ice-cream-round' },
        component: () => import('@/views/ContentList/CaseList.vue'),
      },
      {
        path: '/mood/list',
        name: 'MoodList',
        meta: { title: '微语管理', icon: 'el-icon-chat-dot-round' },
        component: () => import('@/views/ContentList/MoodList.vue'),
      },
      {
        path: '/log/list',
        name: 'LogList',
        meta: { title: '日志管理', icon: 'el-icon-notebook-2' },
        component: () => import('@/views/ContentList/LogList.vue'),
      },
      {
        path: '/tag/list',
        name: 'TagList',
        meta: { title: '标签管理', icon: 'el-icon-collection-tag' },
        component: () => import('@/views/ContentList/TagList.vue'),
      },
    ],
  },
  {
    path: '/interact',
    name: 'Interact',
    meta: { title: '互动管理', noLink: true, role: [1, 2], icon: CommentOutlined },
    component: () => import('@/views/Interact/Index.vue'),
    children: [
      {
        path: '/comment/list',
        name: 'CommentList',
        meta: { title: '评论管理', role: [1, 2], icon: 'el-icon-chat-line-round' },
        component: () => import('@/views/Interact/CommentList.vue'),
      },
      {
        path: '/feedback/list',
        name: 'FeedbackList',
        meta: { title: '留言管理', role: [1, 2], icon: 'el-icon-chat-dot-square' },
        component: () => import('@/views/Interact/FeedbackList.vue'),
      },
    ],
  },
  {
    path: '/blogroll',
    name: 'BlogrollIndex',
    meta: { title: '友链管理', noLink: true, role: [1, 2], icon: LinkOutlined },
    component: () => import('@/views/Blogroll/Index.vue'),
    children: [
      {
        path: '/blogroll/list',
        name: 'BlogrollList',
        meta: { title: '友链列表', role: [1, 2], icon: 'el-icon-paperclip' },
        component: () => import('@/views/Blogroll/BlogrollList.vue'),
      },
    ],
  },
  {
    path: '/albums',
    name: 'AlbumIndex',
    meta: { title: '相册管理', noLink: true, role: [1, 2], icon: PictureOutlined },
    component: () => import('@/views/Album/Index.vue'),
    children: [
      {
        path: '/albums/list',
        name: 'AlbumList',
        meta: { title: '相册列表', role: [1, 2], icon: 'el-icon-camera' },
        component: () => import('@/views/Album/AlbumList.vue'),
      },
      {
        path: '/picture/list',
        name: 'PictureList',
        meta: { title: '图片列表', role: [1, 2], icon: 'el-icon-picture' },
        component: () => import('@/views/Album/PictureList.vue'),
      },
    ],
  },
  {
    path: '/columns',
    name: 'ColumnIndex',
    meta: { title: '栏目管理', noLink: true, role: [1, 2], icon: AppstoreOutlined },
    component: () => import('@/views/Column/Index.vue'),
    children: [
      {
        path: '/columns/list',
        name: 'ColumnList',
        meta: { title: '栏目列表', role: [1, 2], icon: 'el-icon-s-grid' },
        component: () => import('@/views/Column/ColumnList.vue'),
      },
    ],
  },
  {
    path: '/users',
    name: 'UserIndex',
    meta: { title: '用户管理', noLink: true, role: [1, 2], icon: UserOutlined },
    component: () => import('@/views/User/Index.vue'),
    children: [
      {
        path: '/users/list',
        name: 'UserList',
        meta: { title: '用户列表', noLink: true, role: [1, 2], icon: 'el-icon-s-custom' },
        component: () => import('@/views/User/UserList.vue'),
      },
    ],
  },
  {
    path: '/settings',
    name: 'SettingsIndex',
    meta: { title: '系统设置', noLink: true, role: [1, 2], icon: SettingOutlined },
    component: () => import('@/views/Settings/Index.vue'),
    children: [
      {
        path: '/settings/ad',
        name: 'AdSettings',
        meta: { title: '广告设置', role: [1, 2], icon: 'el-icon-s-flag' },
        component: () => import('@/views/Settings/Ad.vue'),
      },
      {
        path: '/settings/mail',
        name: 'MailSettings',
        meta: { title: '邮件设置', role: [1, 2], icon: 'el-icon-message' },
        component: () => import('@/views/Settings/Mail.vue'),
      },
      {
        path: '/settings/security',
        name: 'SecuritySettings',
        meta: { title: '安全设置', role: [1, 2], icon: 'el-icon-message' },
        component: () => import('@/views/Settings/Security.vue'),
      },
      {
        path: '/settings/custom',
        name: 'CustomSettings',
        meta: { title: '个性化设置', role: [1, 2], icon: 'el-icon-s-open' },
        component: () => import('@/views/Settings/Personalize.vue'),
      },
      {
        path: '/settings/base',
        name: 'BaseSettings',
        meta: { title: '基本设置', role: [1, 2], icon: 'el-icon-s-tools' },
        component: () => import('@/views/Settings/Base.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes
})

export default router
