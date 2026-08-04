<script setup lang="ts">
/**
 * 2.10 渠道代理 - 概览看板
 * 苹果高级灰白配色
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-dashboard p-6 md:p-8 font-sans space-y-6">
    <!-- Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/80">
        <span>💎 2.10.4 独立 Agent 代理用量与收益看板</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">代理商数据概览大盘</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">实时掌握下级企业租户/直营客户的消费额度、结算收益明细及专属邀请链接。</p>
    </div>

    <!-- 核心数据卡片 (苹果灰白风) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="text-xs font-medium text-slate-400">可提现结算佣金</div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">¥{{ demoStore.agent.withdrawable.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
        <div class="text-[11px] text-emerald-600 font-bold">累计收益: ¥{{ demoStore.agent.totalEarnings.toLocaleString('zh-CN', {minimumFractionDigits: 2}) }}</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="text-xs font-medium text-slate-400">本月下级客户总消耗</div>
        <div class="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">¥24,850.00</div>
        <div class="text-[11px] text-emerald-600 font-bold">↑ 较上月环比增长 +18.5%</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="text-xs font-medium text-slate-400">活跃客户与租户数</div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">{{ demoStore.agent.clientCount }} <span class="text-xs font-normal text-slate-400">家</span></div>
        <div class="text-[11px] text-blue-600 font-bold">本月新增 5 家企业租户</div>
      </div>
    </div>

    <!-- 收益趋势与邀请链接 -->
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-700">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">近 30 天下级分销收益趋势</h3>
          <select class="text-xs border border-slate-200 rounded-xl px-3 py-1.5 outline-none bg-slate-50">
            <option>全量下级客户</option>
            <option>仅企业租户</option>
            <option>仅直营用户</option>
          </select>
        </div>

        <div class="h-60 flex items-end justify-between px-2 pb-2 border-b border-slate-100">
          <div v-for="i in 30" :key="i" class="w-[2%] bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-colors" :style="{ height: `${20 + (i % 7) * 12}%` }" :title="`Day ${i}`"></div>
        </div>
        <div class="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>{{ new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString() }}</span>
          <span>今日</span>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
          <div class="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            <span>🔗 专属推广邀请链接</span>
          </div>
          <p class="text-xs text-slate-400">客户通过此链接注册，自动归属绑定为您的下级客户。</p>
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex justify-between items-center font-mono">
            <span class="text-xs font-bold text-slate-700 truncate pr-2">{{ demoStore.agent.inviteLink }}</span>
            <button class="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs">复制</button>
          </div>
          <div class="text-xs text-slate-500 font-sans">
            专属邀请码: <code class="px-2 py-0.5 bg-slate-100 rounded text-blue-600 font-mono font-bold">{{ demoStore.agent.inviteCode }}</code>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-3">
          <h3 class="font-bold text-xs text-slate-900 dark:text-white">阶梯佣金算分比例</h3>
          <ul class="space-y-2 text-xs">
            <li v-for="(tier, idx) in demoStore.agent.commissionTiers" :key="idx" class="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
              <span class="text-slate-500 font-mono">{{ tier.range }}</span>
              <span class="font-bold text-blue-600">{{ tier.rate }} 返佣</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
