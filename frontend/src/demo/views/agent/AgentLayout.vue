<script setup lang="ts">
/**
 * 2.10 渠道代理门户 布局框架
 * 苹果高级灰白配色，左侧菜单独立区分【下级租户管理】与【直营用户管理】
 */
import DemoNavBar from '../../components/DemoNavBar.vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-layout min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 font-sans flex flex-col selection:bg-purple-100">
    <DemoNavBar />
    
    <div class="flex-1 flex overflow-hidden max-w-[1440px] w-full mx-auto">
      <!-- 侧边栏菜单 (硅基流动风格紫罗兰极光侧栏) -->
      <aside class="w-64 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border-r border-purple-100/80 dark:border-purple-900/30 flex flex-col h-[calc(100vh-53px)] sticky top-[53px] backdrop-blur-xl">
        <!-- 代理商信息头部 -->
        <div class="p-5 border-b border-purple-100/60 dark:border-purple-900/30 space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-500/30">
              {{ demoStore.agent.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-slate-900 dark:text-white text-sm truncate w-36">{{ demoStore.agent.name }}</div>
              <div class="text-[10px] text-purple-600 dark:text-purple-400 font-mono mt-0.5 font-semibold">{{ demoStore.agent.id }}</div>
            </div>
          </div>

          <div class="flex items-center space-x-2 pt-1">
            <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
              代理商后台
            </span>
            <span class="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-950/60 rounded-full text-[10px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/40">
              👑 {{ demoStore.agent.level }}
            </span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
          <router-link 
            to="/demo/agent/dashboard" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">📈</span>
            <span>代理概览大盘</span>
          </router-link>
          
          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">客户架构分类管理</p>
          </div>

          <!-- 1. 下级租户管理 -->
          <router-link 
            to="/demo/agent/clients" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">🏢</span>
            <span>下级租户管理</span>
          </router-link>

          <!-- 2. 直营用户管理 -->
          <router-link 
            to="/demo/agent/direct-users" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">👤</span>
            <span>直营用户管理</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">资费与资金对账</p>
          </div>

          <router-link 
            to="/demo/agent/pricing" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">🏷️</span>
            <span>专属费率设置</span>
          </router-link>
          
          <router-link 
            to="/demo/agent/payouts" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">💳</span>
            <span>结算与双向对账</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">代理底层资源</p>
          </div>

          <router-link 
            to="/demo/agent/pools" 
            class="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600" 
            active-class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold"
          >
            <span class="text-base">⚡</span>
            <span>专属号池与专线</span>
          </router-link>
        </nav>
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
