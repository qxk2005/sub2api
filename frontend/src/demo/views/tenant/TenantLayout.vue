<script setup lang="ts">
/**
 * 2.7 企业租户门户 布局框架
 * 苹果高级灰白配色
 */
import DemoNavBar from '../../components/DemoNavBar.vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-layout min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 font-sans flex flex-col selection:bg-purple-100">
    <!-- 顶部导航 -->
    <DemoNavBar />
    
    <div class="flex-1 flex overflow-hidden max-w-[1440px] w-full mx-auto">
      <!-- 侧边栏菜单 (紫罗兰极光侧栏) -->
      <aside class="w-64 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-r border-purple-100/80 dark:border-purple-900/30 flex flex-col h-[calc(100vh-53px)] sticky top-[53px] backdrop-blur-xl">
        <!-- 租户信息头部 -->
        <div class="p-5 border-b border-purple-100/60 dark:border-purple-900/30 space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-500/30">
              {{ demoStore.tenant.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-slate-900 dark:text-white text-sm truncate w-36">{{ demoStore.tenant.name }}</div>
              <div class="text-[10px] text-purple-600 dark:text-purple-400 font-mono mt-0.5 font-semibold">{{ demoStore.tenant.id }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-2 pt-1">
            <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              租户控制台
            </span>
            <span class="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/60 rounded-full text-[10px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40">
              ⚡ {{ demoStore.tenant.plan }}
            </span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
          <router-link 
            to="/demo/tenant/dashboard" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">📊</span>
            <span>控制台总览</span>
          </router-link>
          
          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">组织与账号架构</p>
          </div>

          <router-link 
            to="/demo/tenant/employees" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">👥</span>
            <span>子账号与员工管理</span>
          </router-link>

          <router-link 
            to="/demo/tenant/security" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">🛡️</span>
            <span>登录与安全审计</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">资源与账单</p>
          </div>

          <router-link 
            to="/demo/tenant/keys" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">🔑</span>
            <span>API Key 管理</span>
          </router-link>

          <router-link 
            to="/demo/tenant/billing" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">💰</span>
            <span>财务与月度账单</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">企业设置</p>
          </div>

          <router-link 
            to="/demo/tenant/settings" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">⚙️</span>
            <span>企业参数设置</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">用户门户 <span class="text-purple-500 font-mono">2.7.7</span></p>
          </div>

          <router-link 
            to="/demo/tenant/user-portal" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">👤</span>
            <span>我的专属门户</span>
          </router-link>
        </nav>

        <!-- 底部用户信息 -->
        <div class="p-4 border-t border-purple-100/60 dark:border-purple-900/30">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-purple-500/20">
              👑
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-slate-900 dark:text-white truncate">企业超级管理员</div>
              <div class="text-[10px] text-slate-400 truncate">admin@demo.com</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
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
