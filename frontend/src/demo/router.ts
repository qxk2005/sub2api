/**
 * Demo 演示平台路由定义
 * 独立的 demo 路由集合，注入到主路由中
 */
import type { RouteRecordRaw } from 'vue-router'

const demoRoutes: RouteRecordRaw[] = [
  // ==================== 官网门户 (2.4) ====================
  {
    path: '/demo/portal',
    component: () => import('./views/portal/PortalLayout.vue'),
    meta: { requiresAuth: false, title: 'Sub2API 官网门户' },
    children: [
      { path: '', name: 'DemoPortalHome', component: () => import('./views/portal/PortalHome.vue'), meta: { title: 'Sub2API - AI 模型 API 聚合平台' } },
      { path: 'models', name: 'DemoPortalModels', component: () => import('./views/portal/PortalModels.vue'), meta: { title: '模型广场 - Sub2API' } },
      { path: 'docs', name: 'DemoPortalDocs', component: () => import('./views/portal/PortalDocs.vue'), meta: { title: '文档中心 - Sub2API' } },
      { path: 'pricing', name: 'DemoPortalPricing', component: () => import('./views/portal/PortalPricing.vue'), meta: { title: '定价方案 - Sub2API' } },
      { path: 'about', name: 'DemoPortalAbout', component: () => import('./views/portal/PortalAbout.vue'), meta: { title: '关于我们 - Sub2API' } },
      { path: 'chatbot', name: 'DemoPortalChatbot', component: () => import('./views/portal/PortalChatbot.vue'), meta: { title: 'AI 对话助手 - Sub2API' } },
    ]
  },

  // ==================== 企业租户门户 (2.7 自用) ====================
  {
    path: '/demo/tenant',
    component: () => import('./views/tenant/TenantLayout.vue'),
    meta: { requiresAuth: false, title: '企业租户管理控制台' },
    children: [
      { path: '', redirect: '/demo/tenant/dashboard' },
      { path: 'dashboard', name: 'DemoTenantDashboard', component: () => import('./views/tenant/TenantDashboard.vue'), meta: { title: '控制台总览 - 企业租户' } },
      { path: 'employees', name: 'DemoTenantEmployees', component: () => import('./views/tenant/TenantEmployees.vue'), meta: { title: '员工管理 - 企业租户' } },
      { path: 'keys', name: 'DemoTenantKeys', component: () => import('./views/tenant/TenantKeys.vue'), meta: { title: 'API Key 管理 - 企业租户' } },
      { path: 'billing', name: 'DemoTenantBilling', component: () => import('./views/tenant/TenantBilling.vue'), meta: { title: '财务与账单 - 企业租户' } },
      { path: 'security', name: 'DemoTenantSecurity', component: () => import('./views/tenant/TenantSecurity.vue'), meta: { title: '安全设置 - 企业租户' } },
      { path: 'settings', name: 'DemoTenantSettings', component: () => import('./views/tenant/TenantSettings.vue'), meta: { title: '系统设置 - 企业租户' } },
    ]
  },

  // ==================== 渠道代理门户 (2.10 自用) ====================
  {
    path: '/demo/agent',
    component: () => import('./views/agent/AgentLayout.vue'),
    meta: { requiresAuth: false, title: '渠道代理商控制台' },
    children: [
      { path: '', redirect: '/demo/agent/dashboard' },
      { path: 'dashboard', name: 'DemoAgentDashboard', component: () => import('./views/agent/AgentDashboard.vue'), meta: { title: '代理概览 - 渠道代理' } },
      { path: 'clients', name: 'DemoAgentClients', component: () => import('./views/agent/AgentClients.vue'), meta: { title: '下级租户管理 - 渠道代理' } },
      { path: 'direct-users', name: 'DemoAgentDirectUsers', component: () => import('./views/agent/AgentDirectUsers.vue'), meta: { title: '直营用户管理 - 渠道代理' } },
      { path: 'pricing', name: 'DemoAgentPricing', component: () => import('./views/agent/AgentPricing.vue'), meta: { title: '专属费率 - 渠道代理' } },
      { path: 'pools', name: 'DemoAgentPools', component: () => import('./views/agent/AgentPools.vue'), meta: { title: '专属号池 - 渠道代理' } },
      { path: 'payouts', name: 'DemoAgentPayouts', component: () => import('./views/agent/AgentPayouts.vue'), meta: { title: '佣金提现 - 渠道代理' } },
    ]
  },

  // ==================== Windows 客户端仿真 (2.2) ====================
  {
    path: '/demo/desktop',
    name: 'DemoDesktopClient',
    component: () => import('./views/desktop/DesktopClient.vue'),
    meta: { requiresAuth: false, title: 'Sub2API 桌面客户端' }
  },
]

export default demoRoutes
