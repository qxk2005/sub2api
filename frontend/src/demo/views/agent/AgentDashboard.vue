<script setup lang="ts">
/**
 * 渠道代理 - 概览看板
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-dashboard p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">代理商总览</h1>
      <p class="text-slate-500 text-sm mt-1">查看下级客户增长、本月消费及预计佣金收益。</p>
    </div>

    <!-- 核心数据卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl -z-10"></div>
        <div class="text-amber-100 text-sm font-medium mb-2">可提现佣金</div>
        <div class="text-4xl font-bold mb-1 font-mono">¥{{ demoStore.agent.withdrawable.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</div>
        <div class="text-xs text-amber-200">历史总计获得佣金: ¥{{ demoStore.agent.totalEarnings.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="text-slate-500 text-sm font-medium mb-2">本月下级总消费</div>
        <div class="text-3xl font-bold text-slate-900 mb-1 font-mono">¥24,850.00</div>
        <div class="text-xs text-green-600 font-medium flex items-center mt-2">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          较上月增长 18%
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="text-slate-500 text-sm font-medium mb-2">活跃客户数</div>
        <div class="text-3xl font-bold text-slate-900 mb-1">{{ demoStore.agent.clientCount }}</div>
        <div class="text-xs text-blue-600 font-medium mt-2">
          本月新增 5 家企业客户
        </div>
      </div>
    </div>

    <!-- 图表占位 & 快速获取链接 -->
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-slate-800">近 30 天收益趋势</h3>
          <select class="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-600">
            <option>全部下级</option>
            <option>仅企业客户</option>
            <option>仅个人客户</option>
          </select>
        </div>
        <!-- 模拟图表 -->
        <div class="h-64 flex items-end justify-between px-2 pb-2 border-b border-slate-100">
          <div v-for="i in 30" :key="i" class="w-[2%] bg-amber-200 rounded-t-sm hover:bg-amber-400 transition-colors" :style="{ height: `${20 + Math.random() * 80}%` }" :title="`Day ${i}`"></div>
        </div>
        <div class="flex justify-between text-xs text-slate-400 mt-2">
          <span>{{ new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString() }}</span>
          <span>今日</span>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h3 class="font-bold mb-2">您的专属邀请链接</h3>
          <p class="text-sm text-slate-400 mb-4">新用户通过此链接注册，系统将自动绑定为您的下级客户。</p>
          <div class="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center mb-3">
            <span class="text-xs font-mono text-slate-300 truncate pr-2">{{ demoStore.agent.inviteLink }}</span>
            <button class="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">复制</button>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-400">邀请码: <span class="text-white font-mono font-bold">{{ demoStore.agent.inviteCode }}</span></span>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 class="font-bold text-slate-800 mb-4">当前返佣阶梯规则</h3>
          <ul class="space-y-3">
            <li v-for="(tier, idx) in demoStore.agent.commissionTiers" :key="idx" class="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <span class="text-slate-600">{{ tier.range }}</span>
              <span class="font-bold text-amber-600">{{ tier.rate }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
