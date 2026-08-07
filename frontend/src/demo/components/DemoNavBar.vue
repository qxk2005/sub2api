<script setup lang="ts">
/**
 * Demo 公共顶部导航栏 + 高级版门户标题 Banner 指示器
 * 明确标识 平台中台 (Level 1) / 渠道代理 (Level 2) / 企业租户 (Level 3) 各种控制层级
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const portalLinks = [
  { path: '/admin', label: '平台中台', icon: '👑', color: 'bg-indigo-600' },
  { path: '/demo/agent', label: '渠道代理', icon: '🤝', color: 'bg-amber-500' },
  { path: '/demo/tenant', label: '企业租户', icon: '🏢', color: 'bg-slate-700' },
  { path: '/demo/portal', label: '官网/对话', icon: '🌐', color: 'bg-blue-500' },
  { path: '/demo/desktop', label: '桌面客户端', icon: '🖥️', color: 'bg-indigo-500' },
]

const currentPortal = computed(() => {
  const path = route.path
  if (path.startsWith('/admin')) return '/admin'
  if (path.startsWith('/demo/portal')) return '/demo/portal'
  if (path.startsWith('/demo/tenant')) return '/demo/tenant'
  if (path.startsWith('/demo/agent')) return '/demo/agent'
  if (path.startsWith('/demo/desktop')) return '/demo/desktop'
  return ''
})

// 高级版门户 Banner 详细元数据
const portalMeta = computed(() => {
  const path = route.path
  if (path.startsWith('/demo/agent')) {
    return {
      type: 'agent',
      levelBadge: 'Level 2 渠道代理控制层',
      title: '🤝 渠道代理商管理门户 (Agent Channel Portal)',
      desc: '针对一级渠道代理商的专属管理后台 · 具备下级企业租户与直营用户开户、专属加价倍率设置及阶梯佣金结算控制权',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
      glowColor: 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-amber-300/60',
      accentBadge: '👑 金牌核心代理商 (智算云连华东)'
    }
  }
  if (path.startsWith('/demo/tenant')) {
    return {
      type: 'tenant',
      levelBadge: 'Level 3 企业租户控制层',
      title: '🏢 企业租户管理控制台 (Enterprise Tenant Console)',
      desc: '面向企业/团队管理员的资源管控台 · 支持直接创建企业员工账号、分配 API Key 额度、并发 QPS / RPM 限制及月度对账',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      glowColor: 'bg-gradient-to-r from-blue-600/10 via-indigo-500/5 to-transparent border-blue-300/60',
      accentBadge: '⚡ 示例科技有限公司 (专业版套餐)'
    }
  }
  if (path.startsWith('/admin')) {
    return {
      type: 'admin',
      levelBadge: 'Level 1 平台顶级控制塔',
      title: '👑 平台中央中台管理大盘 (Platform Level Control)',
      desc: '超级管理员掌控中心 · 全局引擎 A 缓存、Engine B 穿透扣费、全网渠道代理管控与号池智能调度',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
      glowColor: 'bg-gradient-to-r from-purple-600/10 via-indigo-500/5 to-transparent border-purple-300/60',
      accentBadge: '👑 平台超级管理员 (Super Admin)'
    }
  }
  if (path.startsWith('/demo/portal')) {
    return {
      type: 'portal',
      levelBadge: 'Level 4 终端使用者 / 官网应用层',
      title: '🌐 Sub2API 官网门户与 AI 模型交互台',
      desc: '面向开发者与公众客群的模型广场、在线 Playbround 及 API 接入文档中心',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      glowColor: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-300/60',
      accentBadge: '✨ 开放模型广场'
    }
  }
  if (path.startsWith('/demo/desktop')) {
    return {
      type: 'desktop',
      levelBadge: 'Level 4 终端本地客户端',
      title: '🖥️ Sub2API 桌面原生代理客户端',
      desc: 'Windows / macOS 开发者本地配置一键注入与实时延迟测速网关',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      glowColor: 'bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-transparent border-indigo-300/60',
      accentBadge: '💻 原生桌面客户端'
    }
  }
  return null
})
</script>

<template>
  <div class="demo-nav-bar-container sticky top-0 z-50 font-sans">
    <!-- 顶部极简导航栏 -->
    <div class="border-b border-purple-100/80 dark:border-purple-900/30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div class="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2.5 sm:px-6">
        <!-- 左侧：返回 Home + Demo 标记 -->
        <div class="flex items-center space-x-3">
          <router-link
            to="/home"
            class="flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-300 border border-transparent hover:border-purple-200 dark:hover:border-purple-800/40"
          >
            <span>←</span>
            <span>返回 Home</span>
          </router-link>
          <span class="rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-3 py-0.5 text-[10px] font-black tracking-wide text-white shadow-md shadow-purple-500/20">
            DEMO
          </span>
        </div>

        <!-- 右侧：角色门户快捷切换 -->
        <nav class="flex items-center space-x-1.5">
          <router-link
            v-for="link in portalLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border',
              currentPortal === link.path
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-300 border-transparent hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-300'
            ]"
          >
            <span class="text-sm">{{ link.icon }}</span>
            <span class="hidden sm:inline">{{ link.label }}</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- 高级版 PORTAL 身份指示 BANNER (在导航栏与下层内容之间) -->
    <div v-if="portalMeta" :class="['w-full border-b backdrop-blur-md px-4 py-2.5 sm:px-6 transition-all duration-300 border-purple-100 dark:border-purple-900/30', portalMeta.glowColor]">
      <div class="mx-auto max-w-[1440px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center space-x-3">
          <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-sm whitespace-nowrap', portalMeta.tagColor]">
            {{ portalMeta.levelBadge }}
          </span>
          <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
            {{ portalMeta.title }}
          </h2>
        </div>

        <div class="flex items-center space-x-3 text-xs">
          <p class="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xl">
            {{ portalMeta.desc }}
          </p>
          <span class="px-3 py-1 bg-white/90 dark:bg-slate-900 rounded-full text-slate-800 dark:text-purple-200 font-bold border border-purple-200/80 dark:border-purple-800/50 text-[11px] shadow-sm whitespace-nowrap">
            {{ portalMeta.accentBadge }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
