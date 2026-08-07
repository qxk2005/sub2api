<script setup lang="ts">
/**
 * FRS V3.0 2.4.4 定价页：套餐对比与购买入口
 * 支持按月/按年优惠切换、可视化功能矩阵与极速充值购买 Modal 弹窗
 */
import { ref } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
const billingCycle = ref<'monthly' | 'yearly'>('monthly')

// 购买 Modal
const isPayModalOpen = ref(false)
const selectedPlan = ref<any>(null)

const openPayModal = (plan: any) => {
  selectedPlan.value = plan
  isPayModalOpen.value = true
}

const isSuccessPay = ref(false)
const handlePay = () => {
  isSuccessPay.value = true
  setTimeout(() => {
    isSuccessPay.value = false
    isPayModalOpen.value = false
  }, 2000)
}
</script>

<template>
  <div class="portal-pricing pt-10 pb-24 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      <!-- 头部标题与计费周期 Toggle -->
      <div class="text-center space-y-4 max-w-3xl mx-auto">
        <div class="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3.5 py-1 rounded-full text-xs font-bold border border-purple-200/80 dark:border-purple-800/60 shadow-sm">
          <span>💳 2.4.4 阶梯定价方案与充值中心</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          灵活弹性计费，<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">支持月付/年付/按量</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400">
          无论是个人独立开发者、中小型团队还是大型企业，Sub2API 均提供最具性价比的准入方案。
        </p>

        <!-- 计费周期 Toggle (年付 8 折) -->
        <div class="inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-900 rounded-2xl text-xs font-bold shadow-inner border border-slate-200/60 dark:border-slate-800">
          <button 
            @click="billingCycle = 'monthly'"
            :class="['px-4 py-1.5 rounded-xl transition-all', billingCycle === 'monthly' ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-300 shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400']"
          >
            按月付费 (Monthly)
          </button>
          <button 
            @click="billingCycle = 'yearly'"
            :class="['px-4 py-1.5 rounded-xl transition-all flex items-center gap-1', billingCycle === 'yearly' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm font-bold' : 'text-slate-600 dark:text-slate-400']"
          >
            <span>按年付费 (Yearly)</span>
            <span class="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[9px]">8 折优惠</span>
          </button>
        </div>
      </div>

      <!-- 三大套餐卡片 Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        <div 
          v-for="plan in demoStore.plans" 
          :key="plan.name" 
          :class="[
            'bg-white/90 dark:bg-slate-900/90 rounded-3xl p-8 border relative flex flex-col justify-between transition-all duration-300 backdrop-blur-xl',
            plan.recommended ? 'border-purple-500 dark:border-purple-500 shadow-xl shadow-purple-500/15 ring-2 ring-purple-500/20 scale-105 z-10' : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
          ]"
        >
          <!-- 推荐徽章 -->
          <div v-if="plan.recommended" class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md shadow-purple-500/30 tracking-wider">
            ★ 热门企事业首选
          </div>

          <div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">{{ plan.name }}</h3>
            
            <div class="flex items-baseline mb-6 font-mono">
              <span class="text-4xl font-black text-slate-900 dark:text-white">
                {{ typeof plan.price === 'number' ? (billingCycle === 'yearly' ? `¥${Math.floor(plan.price * 0.8 * 12)}` : `¥${plan.price}`) : plan.price }}
              </span>
              <span v-if="plan.unit" class="text-xs text-slate-500 dark:text-slate-400 ml-1">
                / {{ billingCycle === 'yearly' ? '年' : '月' }}
              </span>
            </div>

            <!-- 功能清单对比 -->
            <ul class="space-y-3 mb-8 text-xs text-slate-600 dark:text-slate-300">
              <li class="flex items-center gap-2">
                <span class="text-purple-600 font-bold">✓</span>
                <span><strong>包含额度：</strong>{{ plan.quota }}</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-purple-600 font-bold">✓</span>
                <span><strong>服务支持：</strong>{{ plan.support }}</span>
              </li>
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                <span class="text-purple-600 font-bold">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <button 
            @click="openPayModal(plan)"
            :class="[
              'w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-sm',
              plan.recommended ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-md shadow-purple-500/25' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-purple-600 dark:hover:bg-purple-400 dark:hover:text-white'
            ]"
          >
            {{ typeof plan.price === 'number' ? '立即在线订阅 (2.4.4)' : '联系商务开通' }}
          </button>
        </div>
      </div>

      <!-- 渠道代理商引导卡片 -->
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 text-white rounded-3xl p-8 border border-purple-500/20 max-w-4xl mx-auto shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="space-y-2">
          <span class="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-lg text-xs font-mono font-bold">
            🤝 渠道代理专区 (2.10)
          </span>
          <h3 class="text-xl font-bold">寻求建立二次转售代理商体系？</h3>
          <p class="text-xs text-slate-400">
            加入 Sub2API 渠道代理伙伴计划。自主设定价格，专属号池隔离，享最高 20% 返佣。
          </p>
        </div>
        <router-link to="/demo/agent" class="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xs transition-all whitespace-nowrap shadow-md shadow-purple-500/30">
          进入代理商控制台 →
        </router-link>
      </div>

    </div>

    <!-- 充值/订阅 Modal 弹窗 (2.4.4 购买入口) -->
    <div v-if="isPayModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💳 确认订购套餐：{{ selectedPlan?.name }}</span>
          </h3>
          <button @click="isPayModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div v-if="!isSuccessPay" class="space-y-4 text-xs">
          <div class="p-3 bg-slate-50 dark:bg-dark-900 rounded-2xl space-y-1 font-mono">
            <div class="flex justify-between">
              <span class="text-slate-500">订阅周期:</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ billingCycle === 'yearly' ? '按年 (享 8 折)' : '按月' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">应付金额:</span>
              <span class="font-bold text-[#6e29f6] text-sm">
                {{ typeof selectedPlan?.price === 'number' ? (billingCycle === 'yearly' ? `¥ ${Math.floor(selectedPlan.price * 0.8 * 12)}` : `¥ ${selectedPlan.price}`) : '按量结算' }}
              </span>
            </div>
          </div>

          <div class="space-y-2">
            <div class="font-bold text-slate-700 dark:text-slate-300">选择支付方式 (支持 Engine B 穿透核算):</div>
            <div class="grid grid-cols-2 gap-2">
              <button class="p-3 border-2 border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl text-left font-bold text-[#6e29f6] dark:text-purple-300 flex items-center gap-2">
                <span>💚</span>
                <span>微信 / 支付宝</span>
              </button>
              <button class="p-3 border border-slate-200 dark:border-slate-800 hover:border-purple-300 rounded-xl text-left font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span>💳</span>
                <span>兑换码 / 积分卡</span>
              </button>
            </div>
          </div>

          <button @click="handlePay" class="w-full py-3 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-2xl font-bold transition-all shadow-md shadow-purple-500/25">
            确认调起支付
          </button>
        </div>

        <div v-else class="py-8 text-center space-y-3 animate-fade-in">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ✓
          </div>
          <div class="font-bold text-slate-900 dark:text-white text-base">支付成功！配额已即时发放</div>
          <p class="text-xs text-slate-500">已自动向您的企业租户账户注入对应 Tokens 额度。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
