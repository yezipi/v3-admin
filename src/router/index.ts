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
    path: '/content-publish',
    name: 'ContentPublish',
    meta: { title: '内容发布', noLink: true, role: [1, 2], icon: EditOutlined },
    component: () => import('@/views/ContentPublish/Index.vue'),
    children: [
      {
        path: '/article/add',
        name: 'ArticleAdd',
        meta: { title: '发布文章' },
        component: () => import('@/views/ContentPublish/ArticleEdit.vue'),
      },
      {
        path: '/article/edit',
        name: 'ArticleEdit',
        meta: { title: '编辑文章', noMenu: true },
        component: () => import('@/views/ContentPublish/ArticleEdit.vue'),
      },
      {
        path: '/mood/edit',
        name: 'MoodEdit',
        meta: { title: '微语发布' },
        component: () => import('@/views/ContentPublish/MoodEdit.vue'),
      },
    ],
  },
  {
    path: '/content-manage',
    name: 'ContentManage',
    meta: { title: '内容管理', noLink: true, role: [1, 2], icon: CopyOutlined },
    component: () => import('@/views/ContentManage/Index.vue'),
    children: [
      {
        path: '/article/list',
        name: 'ArticleList',
        meta: { title: '文章管理', icon: '' },
        component: () => import('@/views/ContentManage/ArticleList.vue'),
      },
      {
        path: '/case/list',
        name: 'CaseList',
        meta: { title: '案例管理', icon: '' },
        component: () => import('@/views/ContentManage/CaseList.vue'),
      },
      {
        path: '/mood/list',
        name: 'MoodList',
        meta: { title: '微语管理', icon: '' },
        component: () => import('@/views/ContentManage/MoodList.vue'),
      },
      {
        path: '/log/list',
        name: 'LogList',
        meta: { title: '日志管理', icon: '' },
        component: () => import('@/views/ContentManage/LogList.vue'),
      },
      {
        path: '/banner/list',
        name: 'BannerList',
        meta: { title: '轮播管理', icon: '' },
        component: () => import('@/views/ContentManage/BannerList.vue'),
      },
      {
        path: '/tag/list',
        name: 'TagList',
        meta: { title: '标签管理', icon: '' },
        component: () => import('@/views/ContentManage/TagList.vue'),
      },
    ],
  },
  {
    path: '/comments',
    name: 'Comments',
    meta: { title: '互动管理', noLink: true, role: [1, 2], icon: CommentOutlined },
    component: () => import('@/views/Comments/Index.vue'),
    children: [
      {
        path: '/comment/list',
        name: 'CommentList',
        meta: { title: '评论管理', role: [1, 2], icon: '' },
        component: () => import('@/views/Comments/CommentList.vue'),
      },
      {
        path: '/feedback/list',
        name: 'FeedbackList',
        meta: { title: '留言管理', role: [1, 2], icon: '' },
        component: () => import('@/views/Comments/FeedbackList.vue'),
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
        meta: { title: '友链列表', role: [1, 2], icon: '' },
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
        meta: { title: '相册列表', role: [1, 2], icon: '' },
        component: () => import('@/views/Album/AlbumList.vue'),
      },
      {
        path: '/picture/list',
        name: 'PictureList',
        meta: { title: '图片列表', role: [1, 2], icon: '' },
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
        meta: { title: '栏目列表', role: [1, 2] },
        component: () => import('@/views/Column/ColumnList.vue'),
      },
      {
        path: '/columns/edit',
        name: 'ColumnEdit',
        meta: { title: '栏目编辑', noMenu: true, role: [1, 2] },
        component: () => import('@/views/Column/ColumnEdit.vue'),
      },
      {
        path: '/columns/sub-edit',
        name: 'SubColumnEdit',
        meta: { title: '编辑子栏目', noMenu: true, role: [1, 2] },
        component: () => import('@/views/Column/SubColumnEdit.vue'),
      },
      {
        path: '/columns/sub-add',
        name: 'SubColumnAdd',
        meta: { title: '添加子栏目', noMenu: true, role: [1, 2] },
        component: () => import('@/views/Column/SubColumnEdit.vue'),
      },
      {
        path: '/columns/add',
        name: 'ColumnAdd',
        meta: { title: '栏目添加', role: [1, 2] },
        component: () => import('@/views/Column/ColumnEdit.vue'),
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
        meta: { title: '用户列表', noLink: true, icon: '' },
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
        path: '/settings/base',
        name: 'BaseSettings',
        meta: { title: '基本设置', icon: '' },
        component: () => import('@/views/Settings/Base.vue'),
      },
      {
        path: '/settings/ad',
        name: 'AdSettings',
        meta: { title: '广告设置', icon: '' },
        component: () => import('@/views/Settings/Ad.vue'),
      },
      {
        path: '/settings/mail',
        name: 'MailSettings',
        meta: { title: '邮件设置', icon: '' },
        component: () => import('@/views/Settings/Mail.vue'),
      },
      {
        path: '/settings/security',
        name: 'SecuritySettings',
        meta: { title: '安全设置', icon: '' },
        component: () => import('@/views/Settings/Security.vue'),
      },
      {
        path: '/settings/custom',
        name: 'CustomSettings',
        meta: { title: '个性化设置', icon: '' },
        component: () => import('@/views/Settings/Personalize.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes
})

export default router
