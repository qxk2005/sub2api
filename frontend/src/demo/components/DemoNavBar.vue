<script setup lang="ts">
/**
 * Demo 公共顶部导航栏
 * 提供"返回 Home"按钮和各角色门户快捷切换链接
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
</script>

<template>
  <div class="demo-nav-bar sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
      <!-- 左侧：返回 Home + Demo 标记 -->
      <div class="flex items-center space-x-3">
        <router-link
          to="/home"
          class="flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <span>←</span>
          <span>返回 Home</span>
        </router-link>
        <span class="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
          DEMO
        </span>
      </div>

      <!-- 右侧：角色门户快捷切换 -->
      <nav class="flex items-center space-x-1">
        <router-link
          v-for="link in portalLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'flex items-center space-x-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
            currentPortal === link.path
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
          ]"
        >
          <span class="text-sm">{{ link.icon }}</span>
          <span class="hidden sm:inline">{{ link.label }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>
