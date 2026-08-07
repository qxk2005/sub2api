<script setup lang="ts">
/**
 * 演示中心入口卡片组件 (嵌入到 HomeView.vue 中)
 * 支持 FRS V3.4 平台运营管理员二级章节分组与操作指引
 * 所有功能链接均在新窗口打开 (_blank)，避免回退重走流程
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoStore } from '../stores/useDemoStore'

const router = useRouter()
const demoStore = useDemoStore()

// 控制平台管理员卡片的展开状态
const showPlatformAdmin = ref(false)

// 当前选中的二级章节 Tab ('all' | '2.1' | '2.5' | '2.6' | '2.7' | '2.8' | '2.10')
const activeChapterId = ref('all')

const filteredChapters = computed(() => {
  if (activeChapterId.value === 'all') {
    return demoStore.platformAdminChapters
  }
  return demoStore.platformAdminChapters.filter(c => c.id === activeChapterId.value)
})

// 在新窗口打开真实的后台路由并提示操作指引
const goAdminRoute = (item: { route: string; name: string; guide: string }) => {
  demoStore.showToast(`已在新窗口打开【${item.name}】！操作指引：${item.guide}`)
  if (item.route.startsWith('/demo/')) {
    // DEMO 页面：直接用 router 解析
    const routeUrl = router.resolve(item.route).href
    window.open(routeUrl, '_blank')
  } else {
    // 真实后端页面
    const routeUrl = router.resolve(item.route).href
    window.open(routeUrl, '_blank')
  }
}
</script>

<template>
  <div class="demo-center-section mb-12 mt-2 py-10 md:py-14 bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-purple-100 dark:border-purple-900/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl relative overflow-hidden">
    <!-- 紫罗兰极光背景流光 -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 px-8 md:px-12">
      <div class="text-center mb-12">
        <span class="inline-block px-3.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold tracking-wide mb-4 border border-purple-200/60 dark:border-purple-800/40 shadow-sm">
          ✨ Sub2API 智能中台 ｜ FRS V3.4 验证演示
        </span>
        <h2 class="text-3xl md:text-4xl font-black text-[#5622d6] dark:text-purple-300 mb-4 tracking-tight">
          产品功能演示中心
        </h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
          请选择您的角色进入对应的演示门户。所有链接均在<strong class="text-purple-600 dark:text-purple-400">新窗口打开</strong>，方便您随时切回本中心。
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- 1. 平台运营管理员 (系统管理员) -->
        <div class="group flex flex-col bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
             @click="showPlatformAdmin = !showPlatformAdmin">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            👨‍💻
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">平台运营管理员</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
            体验中转中台、安全合规、桌面客户端、租户权限、财务对账与渠道代理等 9 大核心模块 FRS V3.4 配置能力。
          </p>
          <div class="text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center justify-between">
            <span>{{ showPlatformAdmin ? '收起二级章节清单' : '按二级章节查看清单' }}</span>
            <svg class="w-4 h-4 transition-transform" :class="{'rotate-180': showPlatformAdmin}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <!-- 2. 企业租户管理员 -->
        <router-link to="/demo/tenant" target="_blank" class="group flex flex-col bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/10">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            🏢
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">企业租户管理员</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
            体验子账号额度分配、API Key 管理、组织级安全与账单报表。
          </p>
          <div class="text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center">
            在新窗口进入租户门户 <span class="ml-1 group-hover:translate-x-1 transition-transform">↗</span>
          </div>
        </router-link>

        <!-- 3. 渠道代理商 -->
        <router-link to="/demo/agent" target="_blank" class="group flex flex-col bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-500/10">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            💎
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">渠道代理分销商</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
            体验自定义加价倍率、下级客户管理、专属号池分配与佣金提现。
          </p>
          <div class="text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center">
            在新窗口进入代理门户 <span class="ml-1 group-hover:translate-x-1 transition-transform">↗</span>
          </div>
        </router-link>

        <!-- 4. 普通用户体验 -->
        <div class="group flex flex-col bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-2xl mb-4">
            🚀
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">普通用户 / 员工</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1 leading-relaxed">
            作为终端使用者，直接体验产品侧的各项应用服务。
          </p>
          <div class="space-y-2 mt-auto">
            <router-link to="/demo/portal" target="_blank" class="block w-full text-center py-2 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all border border-purple-200/60 dark:border-purple-800/40">
              访问官网门户 ↗
            </router-link>
            <router-link to="/demo/portal/chatbot" target="_blank" class="block w-full text-center py-2 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all border border-purple-200/60 dark:border-purple-800/40">
              体验网页对话 ↗
            </router-link>
            <router-link to="/demo/desktop" target="_blank" class="block w-full text-center py-2 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all border border-purple-200/60 dark:border-purple-800/40">
              模拟桌面客户端 ↗
            </router-link>
          </div>
        </div>
      </div>

      <!-- 平台运营管理员 - 详细功能列表 (按二级章节分组) -->
      <div v-show="showPlatformAdmin" class="mt-8 bg-slate-50/90 dark:bg-slate-900/90 border border-purple-200/80 dark:border-purple-900/50 rounded-2xl p-6 md:p-8 animate-fade-in shadow-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>系统管理员配置能力清单 (FRS V3.4)</span>
              <span class="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs rounded-full font-mono font-semibold border border-purple-200 dark:border-purple-800/40">二级章节分组版</span>
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
              按照 FRS V3.4 规范的二级章节分组展示。每个子项均提供**明确的后台具体操作说明**，点击可在新窗口打开查阅与验证。
            </p>
          </div>
          <div class="mt-4 sm:mt-0 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 rounded-xl border border-amber-200/70 dark:border-amber-800/50">
            提示：新窗口中需拥有管理员权限方可正常查看
          </div>
        </div>

        <!-- 二级章节切换 Tab 栏 -->
        <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 custom-scrollbar">
          <button 
            @click="activeChapterId = 'all'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
              activeChapterId === 'all' 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold' 
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            ]"
          >
            <span>全部章节</span>
            <span class="px-1.5 py-0.5 text-xs rounded-full bg-white/20 dark:bg-black/20 font-mono">{{ demoStore.platformAdminItems.length }}</span>
          </button>

          <button 
            v-for="chap in demoStore.platformAdminChapters" 
            :key="chap.id"
            @click="activeChapterId = chap.id"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5',
              activeChapterId === chap.id 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25 font-bold' 
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            ]"
          >
            <span>{{ chap.name }}</span>
            <span class="px-1.5 py-0.5 text-xs rounded-full font-mono" :class="activeChapterId === chap.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'">{{ chap.items.length }}</span>
          </button>
        </div>

        <!-- 二级章节分组内容渲染 -->
        <div class="space-y-8 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="chap in filteredChapters" :key="chap.id" class="bg-white/70 dark:bg-slate-950/70 rounded-2xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-sm">
            
            <!-- 章节标题头栏 -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
              <div class="flex items-center gap-2.5">
                <span class="w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-500/50"></span>
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ chap.name }}</h4>
                <span class="text-xs text-slate-400 font-normal">({{ chap.items.length }} 个细分功能)</span>
              </div>
              <span class="text-xs font-mono px-2 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 rounded border border-purple-200/40">FRS 章节: {{ chap.id }}</span>
            </div>

            <!-- 功能卡片 Grid -->
            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="item in chap.items" :key="item.section" 
                   class="flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl hover:border-purple-500/60 dark:hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/5 transition-all group">
                
                <!-- 顶部：编号 + 名称 + 状态 -->
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-md text-xs font-mono font-bold border border-purple-100 dark:border-purple-900/40">{{ item.section }}</span>
                    <h5 class="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ item.name }}</h5>
                  </div>
                  <span v-if="item.status === 'fulfilled'" class="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200/60 dark:border-emerald-800/40" title="已完全满足">✓ 已满足</span>
                  <span v-else-if="item.status === 'partial'" class="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full text-xs font-medium border border-amber-200/60 dark:border-amber-800/40" title="部分满足/规划中">~ 部分满足</span>
                  <span v-else class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full text-xs font-medium" title="待开发">... 规划中</span>
                </div>

                <!-- 简述 -->
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">{{ item.desc }}</p>

                <!-- 后台操作指引提示框 -->
                <div class="bg-purple-50/70 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 mb-4 mt-auto">
                  <div class="font-bold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                    <span>🗺️ 后台具体操作说明：</span>
                  </div>
                  <div class="leading-relaxed opacity-95">
                    {{ item.guide }}
                  </div>
                </div>

                <!-- 操作按钮 (在新窗口打开) -->
                <button @click="goAdminRoute(item)" class="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-violet-600 hover:to-purple-600 hover:text-white dark:hover:from-violet-600 dark:hover:to-purple-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-transparent">
                  <span>在新窗口打开后台功能页面</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- 全局 Toast 提示 -->
    <Transition name="toast">
      <div v-if="demoStore.toastVisible" 
           class="fixed bottom-6 right-6 z-50 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-medium max-w-md border border-white/10 dark:border-slate-200/50 flex items-center gap-2">
        <span class="text-lg">💡</span>
        <div>{{ demoStore.toastMessage }}</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
