<script setup lang="ts">
/**
 * 官网门户 (2.4) 布局框架
 * 支持网页对话机器人 (2.3) 在官网导航栏下方直接嵌入，并具备苹果高级灰白配色与登录态 Logo 头像展示
 */
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import DemoNavBar from '../../components/DemoNavBar.vue'

const route = useRoute()
const isChatbotView = computed(() => route.path === '/demo/portal/chatbot')

// 2.3.1 用户登录鉴权状态模拟
const isLoggedIn = ref(true)
const isUserMenuOpen = ref(false)

const userProfile = ref({
  name: 'demo_user',
  email: 'user@sub2api.com',
  tokensRemaining: '2,150,000 Tokens',
  balance: '$ 25.40',
  tier: 'VIP 专属租户'
})

const toggleAuth = () => {
  isLoggedIn.value = !isLoggedIn.value
  isUserMenuOpen.value = false
}
</script>

<template>
  <div :class="['portal-layout bg-slate-50 dark:bg-slate-950 text-slate-900 font-sans flex flex-col selection:bg-purple-100', isChatbotView ? 'h-screen overflow-hidden' : 'min-h-screen']">
    <DemoNavBar />
    
    <!-- 官网内部专属导航（紫罗兰极光玻璃拟态风格） -->
    <header class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-purple-100/80 dark:border-purple-900/30 sticky top-0 z-40 shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        <!-- 左侧 Logo 标识 -->
        <router-link to="/demo/portal" class="flex items-center space-x-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
            S2A
          </div>
          <span class="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            Sub2API <span class="text-purple-600 dark:text-purple-400 font-normal text-sm">| 企业级 AI 聚合分发</span>
          </span>
        </router-link>

        <!-- 中间标题菜单导航 -->
        <nav class="hidden md:flex items-center space-x-7 text-sm font-semibold">
          <router-link to="/demo/portal" class="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" active-class="text-purple-600 dark:text-purple-400 font-bold">首页</router-link>
          <router-link to="/demo/portal/models" class="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" active-class="text-purple-600 dark:text-purple-400 font-bold">模型广场</router-link>
          <router-link to="/demo/portal/pricing" class="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" active-class="text-purple-600 dark:text-purple-400 font-bold">定价方案</router-link>
          
          <!-- 网页对话机器人菜单 -->
          <router-link 
            to="/demo/portal/chatbot" 
            class="relative px-3 py-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
            active-class="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold border border-purple-200/80 dark:border-purple-800/60"
          >
            <span>🤖 网页对话机器人</span>
            <span class="px-1.5 py-0.2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[9px] font-bold rounded-full animate-pulse shadow-sm shadow-purple-500/30">SaaS</span>
          </router-link>

          <router-link to="/demo/portal/docs" class="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" active-class="text-purple-600 dark:text-purple-400 font-bold">文档中心</router-link>
          <router-link to="/demo/portal/about" class="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" active-class="text-purple-600 dark:text-purple-400 font-bold">关于我们</router-link>
        </nav>

        <!-- 右上角：用户登录状态 Logo 头像与信息卡片 -->
        <div class="flex items-center space-x-3">
          
          <!-- 已登录状态组件 -->
          <div v-if="isLoggedIn" class="relative">
            <button 
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-slate-200/70 dark:border-slate-700 rounded-2xl transition-all shadow-xs"
            >
              <!-- 紫罗兰风格用户 Logo 头像 -->
              <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-purple-500/30">
                U
              </div>
              <div class="text-left text-xs hidden sm:block">
                <div class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 leading-tight">
                  <span>{{ userProfile.name }}</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500" title="Sub2API Token 已连接"></span>
                </div>
                <div class="text-[10px] text-purple-600 dark:text-purple-400 font-mono leading-tight font-semibold">
                  {{ userProfile.tokensRemaining }}
                </div>
              </div>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- 用户下拉菜单卡片 -->
            <div v-if="isUserMenuOpen" class="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 rounded-2xl shadow-2xl p-3 space-y-2 animate-fade-in text-xs">
              <div class="p-2 bg-purple-50/70 dark:bg-purple-950/50 rounded-xl space-y-1 border border-purple-100 dark:border-purple-900/40">
                <div class="font-bold text-slate-900 dark:text-white">{{ userProfile.email }}</div>
                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
                  <span>账户余额: {{ userProfile.balance }}</span>
                  <span class="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 rounded font-bold">{{ userProfile.tier }}</span>
                </div>
              </div>

              <div class="pt-1 space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                <router-link to="/demo/tenant/dashboard" class="p-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg flex items-center justify-between transition-colors hover:text-purple-600">
                  <span>🏢 企业租户控制台</span>
                  <span>→</span>
                </router-link>
                <router-link to="/demo/tenant/keys" class="p-2 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg flex items-center justify-between transition-colors hover:text-purple-600">
                  <span>🔑 API Key 凭证管理</span>
                  <span>→</span>
                </router-link>
              </div>

              <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button @click="toggleAuth" class="w-full text-left p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-bold transition-colors flex items-center justify-between">
                  <span>🚪 模拟退出登录</span>
                  <span class="text-[10px] opacity-75">切换未登录</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 未登录状态按钮 -->
          <div v-else class="flex items-center space-x-2">
            <button @click="toggleAuth" class="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors">
              登录账号
            </button>
            <button @click="toggleAuth" class="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/25">
              免费注册
            </button>
          </div>
        </div>

      </div>
    </header>

    <!-- 子页面路由出口 (当在 Chatbot 视图下时，限定 max-w-7xl 居中固定宽度，防止宽屏过度拉伸) -->
    <main :class="['flex-1 flex flex-col relative', isChatbotView ? 'min-h-0 overflow-hidden bg-slate-200/40 dark:bg-dark-950' : '']">
      <div v-if="isChatbotView" class="max-w-7xl mx-auto w-full h-full flex flex-col min-h-0 border-x border-slate-200/80 dark:border-dark-700/80 shadow-md">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :is-user-logged-in="isLoggedIn" @login-request="isLoggedIn = true" />
          </transition>
        </router-view>
      </div>
      <router-view v-else v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :is-user-logged-in="isLoggedIn" @login-request="isLoggedIn = true" />
        </transition>
      </router-view>
    </main>

    <!-- 官网公共页脚 (在对话机器人页面中隐去，确保 100vh 同屏无整体滚动条) -->
    <footer v-if="!isChatbotView" class="bg-slate-100/70 dark:bg-dark-900 border-t border-slate-200/80 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white mb-4 text-xs">产品与中台</h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li>模型广场</li>
            <li>API 接口文档</li>
            <li>阶梯定价方案</li>
            <li>网页对话机器人 (2.3)</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white mb-4 text-xs">四级控制层</h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li>平台顶级控制层</li>
            <li>渠道代理商控制层</li>
            <li>企业/组织租户控制层</li>
            <li>终端使用者 / API Key</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white mb-4 text-xs">核心引擎</h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li>安全敏感词合规护栏</li>
            <li>Engine B: 多级穿透扣费与实时分账</li>
            <li>智能熔断与多渠道 Failover</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white mb-4 text-xs">关于 Sub2API</h4>
          <ul class="space-y-2 text-xs text-slate-500">
            <li>产品规格说明书 V3.0</li>
            <li>联系技术支持</li>
            <li>服务级别协议 SLA</li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-slate-200 dark:border-dark-800 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between items-center">
        <p>© 2026 Sub2API. All rights reserved.</p>
        <div class="flex space-x-4 mt-2 sm:mt-0 font-mono">
          <span>Sub2API Hub V3.0</span>
        </div>
      </div>
    </footer>
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
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
