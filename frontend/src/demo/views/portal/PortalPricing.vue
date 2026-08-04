<script setup lang="ts">
/**
 * 2.4.4 定价方案
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="portal-pricing pt-16 pb-24 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">按需付费，透明计费</h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">提供满足各种规模团队的订阅套餐。底层计费支持多级穿透分账，精确到每一次请求消耗的 Token。</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div v-for="plan in demoStore.plans" :key="plan.name" 
             :class="[
               'bg-white rounded-3xl p-8 border relative',
               plan.recommended ? 'border-blue-500 shadow-xl shadow-blue-900/5 scale-105 z-10' : 'border-slate-200 shadow-sm'
             ]">
          
          <div v-if="plan.recommended" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
            企业推荐
          </div>

          <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ plan.name }}</h3>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-slate-900">{{ typeof plan.price === 'number' ? `¥${plan.price}` : plan.price }}</span>
            <span v-if="plan.unit" class="text-slate-500 ml-1">/{{ plan.unit }}</span>
          </div>

          <ul class="space-y-4 mb-8 min-h-[220px]">
            <li class="flex items-start text-sm text-slate-600">
              <span class="text-blue-500 mr-2">✓</span>
              <span><strong>额度：</strong>{{ plan.quota }}</span>
            </li>
            <li class="flex items-start text-sm text-slate-600">
              <span class="text-blue-500 mr-2">✓</span>
              <span><strong>模型：</strong>{{ plan.models }}</span>
            </li>
            <li class="flex items-start text-sm text-slate-600">
              <span class="text-blue-500 mr-2">✓</span>
              <span><strong>支持：</strong>{{ plan.support }}</span>
            </li>
            <li v-for="feature in plan.features" :key="feature" class="flex items-start text-sm text-slate-600">
              <span class="text-blue-500 mr-2">✓</span>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button :class="[
            'w-full py-3 rounded-full font-medium transition-colors',
            plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          ]">
            {{ typeof plan.price === 'number' ? '立即订阅' : '联系销售' }}
          </button>
        </div>
      </div>

      <div class="mt-24 bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-4xl mx-auto shadow-sm">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">需要代理分销模式？</h3>
        <p class="text-slate-600 mb-8 max-w-2xl mx-auto">加入我们的渠道代理计划。自主设定价格，专属资源号池，享受高额返佣与独立的代理商控制台。</p>
        <router-link to="/demo/agent" class="inline-flex px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">
          进入代理商门户了解详情
        </router-link>
      </div>
    </div>
  </div>
</template>
