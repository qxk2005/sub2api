<script setup lang="ts">
/**
 * 2.10 渠道代理门户 布局框架
 */
import DemoNavBar from '../../components/DemoNavBar.vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-layout min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-100">
    <DemoNavBar />
    
    <div class="flex-1 flex overflow-hidden max-w-[1400px] w-full mx-auto">
      <!-- 侧边栏菜单 -->
      <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-53px)] sticky top-[53px]">
        <!-- 代理商信息头部 -->
        <div class="p-4 border-b border-slate-800">
          <div class="flex items-center space-x-3 mb-1">
            <div class="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-inner">
              {{ demoStore.agent.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-white text-sm truncate w-40">{{ demoStore.agent.name }}</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ demoStore.agent.id }}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center space-x-2">
            <span class="px-2 py-0.5 bg-slate-800 rounded text-xs font-medium text-slate-400 border border-slate-700">代理商后台</span>
            <span class="px-2 py-0.5 bg-amber-900/50 rounded text-xs font-medium text-amber-400 border border-amber-800/50">
              👑 {{ demoStore.agent.level }}
            </span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <router-link to="/demo/agent/dashboard" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-amber-600 text-white hover:bg-amber-600">
            <span class="text-lg">📈</span>
            <span>代理概览</span>
          </router-link>
          
          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">客户与收益</p>
          </div>
          <router-link to="/demo/agent/clients" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-amber-600 text-white hover:bg-amber-600">
            <span class="text-lg">🤝</span>
            <span>下级客户管理</span>
          </router-link>
          <router-link to="/demo/agent/pricing" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-amber-600 text-white hover:bg-amber-600">
            <span class="text-lg">🏷️</span>
            <span>专属费率设置</span>
          </router-link>
          <router-link to="/demo/agent/payouts" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-amber-600 text-white hover:bg-amber-600">
            <span class="text-lg">💳</span>
            <span>佣金与提现</span>
          </router-link>

          <div class="pt-4 pb-1">
            <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">代理资源</p>
          </div>
          <router-link to="/demo/agent/pools" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white" active-class="bg-amber-600 text-white hover:bg-amber-600">
            <span class="text-lg">🔋</span>
            <span>专属号池</span>
          </router-link>
        </nav>
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
