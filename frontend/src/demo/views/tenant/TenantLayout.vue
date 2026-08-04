<script setup lang="ts">
/**
 * 2.7 企业租户门户 布局框架
 */
import DemoNavBar from '../../components/DemoNavBar.vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-layout min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-slate-200">
    <!-- 顶部导航 -->
    <DemoNavBar />
    
    <div class="flex-1 flex overflow-hidden max-w-[1400px] w-full mx-auto">
      <!-- 侧边栏菜单 -->
      <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-53px)] sticky top-[53px]">
        <!-- 租户信息头部 -->
        <div class="p-4 border-b border-slate-800">
          <div class="flex items-center space-x-3 mb-1">
            <div class="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
              {{ demoStore.tenant.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-white text-sm truncate w-40">{{ demoStore.tenant.name }}</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ demoStore.tenant.id }}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center space-x-2">
            <span class="px-2 py-0.5 bg-slate-800 rounded text-xs font-medium text-slate-400 border border-slate-700">租户控制台</span>
            <span class="px-2 py-0.5 bg-blue-900/50 rounded text-xs font-medium text-blue-400 border border-blue-800/50">{{ demoStore.tenant.plan }}</span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <router-link to="/demo/tenant/dashboard" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">📊</span>
            <span>控制台总览</span>
          </router-link>
          
          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">组织与安全</p>
          </div>
          <router-link to="/demo/tenant/employees" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">👥</span>
            <span>子账号管理</span>
          </router-link>
          <router-link to="/demo/tenant/security" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">🛡️</span>
            <span>登录与安全</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">资源与账单</p>
          </div>
          <router-link to="/demo/tenant/keys" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">🔑</span>
            <span>API Key 管理</span>
          </router-link>
          <router-link to="/demo/tenant/billing" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">💰</span>
            <span>财务与账单</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">系统</p>
          </div>
          <router-link to="/demo/tenant/settings" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-blue-600 text-white hover:bg-blue-600">
            <span class="text-lg">⚙️</span>
            <span>企业设置</span>
          </router-link>
        </nav>

        <!-- 底部用户信息 -->
        <div class="p-4 border-t border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
              Admin
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-white truncate">企业超级管理员</div>
              <div class="text-xs text-slate-500 truncate">admin@demo.com</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-y-auto bg-white border-l border-slate-200">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
