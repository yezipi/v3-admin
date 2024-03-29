import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import config from '@/config'
import { 
  HomeOutlined,
  CopyOutlined,
  CommentOutlined,
  LinkOutlined,
  SettingOutlined,
  AppstoreOutlined,
  UserOutlined,
  LineChartOutlined,
  ToolOutlined
} from '@ant-design/icons-vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '系统首页', icon: HomeOutlined },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { noAuth: true, title: '登录', noMenu: true },
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import( '@/views/Result.vue'),
    meta: { title: '结果页', noAuth: true, noMenu: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '数据看板', noLink: true, icon: LineChartOutlined },
    component: () => import('@/views/Comments/Index.vue'),
    children: [
      {
        path: '/dashboard/overview',
        name: 'DashboardOverview',
        meta: { title: '网站概况', icon: '' },
        component: () => import('@/views/Dashboard/Overview.vue'),
      },
      {
        path: '/dashboard/visitors',
        name: 'DashboardVisitors',
        meta: { title: '实时访客', icon: '' },
        component: () => import('@/views/Dashboard/Visitors.vue'),
      },
    ],
  },
  {
    path: '/content',
    name: 'Content',
    meta: { title: '内容管理', noLink: true, icon: CopyOutlined },
    component: () => import('@/views/Content/Index.vue'),
    children: [
      {
        path: '/article/add',
        name: 'ArticleAdd',
        meta: { title: '发布文章' },
        component: () => import('@/views/Publish/ArticleEdit.vue'),
      },
      {
        path: '/article/edit',
        name: 'ArticleEdit',
        meta: { title: '编辑文章', noMenu: true },
        component: () => import('@/views/Publish/ArticleEdit.vue'),
      },
      {
        path: '/mood/edit',
        name: 'MoodEdit',
        meta: { title: '编辑微语', noMenu: true },
        component: () => import('@/views/Publish/MoodEdit.vue'),
      },
      {
        path: '/mood/add',
        name: 'MoodAdd',
        meta: { title: '微语发布' },
        component: () => import('@/views/Publish/MoodEdit.vue'),
      },
      {
        path: '/article/list',
        name: 'ArticleList',
        meta: { title: '文章管理', icon: '' },
        component: () => import('@/views/Content/ArticleList.vue'),
      },
      {
        path: '/case/list',
        name: 'CaseList',
        meta: { title: '案例管理', icon: '' },
        component: () => import('@/views/Content/CaseList.vue'),
      },
      {
        path: '/mood/list',
        name: 'MoodList',
        meta: { title: '微语管理', icon: '' },
        component: () => import('@/views/Content/MoodList.vue'),
      },
      {
        path: '/albums/list',
        name: 'AlbumList',
        meta: { title: '相册管理' },
        component: () => import('@/views/Content/AlbumList.vue'),
      },
      {
        path: '/picture/list',
        name: 'PictureList',
        meta: { title: '图片列表', icon: '', noMenu: true },
        component: () => import('@/views/Content/PictureList.vue'),
      },
      {
        path: '/banner/list',
        name: 'BannerList',
        meta: { title: '轮播管理', icon: '' },
        component: () => import('@/views/Content/BannerList.vue'),
      },
      {
        path: '/tag/list',
        name: 'TagList',
        meta: { title: '标签管理', icon: '' },
        component: () => import('@/views/Content/TagList.vue'),
      },
    ],
  },
  {
    path: '/comments',
    name: 'Comments',
    meta: { title: '互动管理', noLink: true, icon: CommentOutlined },
    component: () => import('@/views/Comments/Index.vue'),
    children: [
      {
        path: '/comment/list',
        name: 'CommentList',
        meta: { title: '评论管理', icon: '' },
        component: () => import('@/views/Comments/CommentList.vue'),
      },
      {
        path: '/feedback/list',
        name: 'FeedbackList',
        meta: { title: '留言管理', icon: '' },
        component: () => import('@/views/Comments/FeedbackList.vue'),
      },
    ],
  },
  {
    path: '/blogroll',
    name: 'Blogroll',
    meta: { title: '友链管理', noLink: true, icon: LinkOutlined },
    component: () => import('@/views/Blogroll/Index.vue'),
    children: [
      {
        path: '/blogroll/list',
        name: 'BlogrollList',
        meta: { title: '友链列表', icon: '' },
        component: () => import('@/views/Blogroll/BlogrollList.vue'),
      },
    ],
  },
  {
    path: '/columns',
    name: 'Columns',
    meta: { title: '栏目管理', noLink: true, icon: AppstoreOutlined },
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
    name: 'Users',
    meta: { title: '用户管理', noLink: true, icon: UserOutlined },
    component: () => import('@/views/User/Index.vue'),
    children: [
      {
        path: '/users/list',
        name: 'UserList',
        meta: { title: '用户列表', noLink: true, icon: '' },
        component: () => import('@/views/User/UserList.vue'),
      },
      {
        path: '/users/permission',
        name: 'PermissionSettings',
        meta: { title: '权限设置', icon: '' },
        component: () => import('@/views/User/Permission.vue'),
      },
    ],
  },
  {
    path: '/mainten',
    name: 'Mainten',
    meta: { title: '运营维护', noLink: true, icon: ToolOutlined },
    component: () => import('@/views/Mainten/Index.vue'),
    children: [
      {
        path: '/change/logs',
        name: 'ChangeLogs',
        meta: { title: '版本管理', icon: '' },
        component: () => import('@/views/Mainten/ChangeLogs.vue'),
      },
      {
        path: '/operation/logs',
        name: 'OperationLogs',
        meta: { title: '操作日志', icon: '' },
        component: () => import('@/views/Mainten/OperationList.vue'),
      },
      {
        path: '/messages',
        name: 'Messages',
        meta: { title: '消息列表', icon: '' },
        component: () => import('@/views/Mainten/Messages.vue'),
      },
      {
        path: '/mail/send',
        name: 'SendMail',
        meta: { title: '发送邮件', icon: '' },
        component: () => import('@/views/Mainten/SendMail.vue'),
      },
      {
        path: '/mail/logs',
        name: 'MailLogs',
        meta: { title: '邮件记录', icon: '' },
        component: () => import('@/views/Mainten/MailLogs.vue'),
      },
      {
        path: '/settings/ad',
        name: 'AdSettings',
        meta: { title: '广告设置', icon: '' },
        component: () => import('@/views/Mainten/Ad.vue'),
      },
      {
        path: '/settings/security',
        name: 'SecuritySettings',
        meta: { title: '安全设置', icon: '' },
        component: () => import('@/views/Mainten/Security.vue'),
      },
      {
        path: '/settings/baidu',
        name: 'BaiduSettings',
        meta: { title: '百度统计', icon: '' },
        component: () => import('@/views/Mainten/Baidu.vue'),
      },
      {
        path: '/settings/maintenance',
        name: 'MaintenanceSettings',
        meta: { title: '网站维护', icon: '' },
        component: () => import('@/views/Mainten/Maintenance.vue'),
      },
      {
        path: '/settings/sitemap',
        name: 'SettingsSitemap',
        meta: { title: '网站地图', icon: '' },
        component: () => import('@/views/Mainten/Sitemap.vue'),
      },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { title: '系统设置', noLink: true, icon: SettingOutlined },
    component: () => import('@/views/Settings/Index.vue'),
    children: [
      {
        path: '/settings/base',
        name: 'BaseSettings',
        meta: { title: '基本设置', icon: '' },
        component: () => import('@/views/Settings/Base.vue'),
      },
      {
        path: '/settings/mail',
        name: 'MailSettings',
        meta: { title: '邮件设置', icon: '' },
        component: () => import('@/views/Settings/Mail.vue'),
      },
      {
        path: '/settings/aliyun',
        name: 'AliyunSettings',
        meta: { title: '阿里云设置', icon: '' },
        component: () => import('@/views/Settings/Aliyun.vue'),
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
