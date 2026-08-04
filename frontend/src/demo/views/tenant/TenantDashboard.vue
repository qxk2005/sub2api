<script setup lang="ts">
/**
 * 2.7 企业租户 - 控制台总览
 * 苹果高级灰白配色
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-dashboard p-6 md:p-8 font-sans space-y-6">
    <!-- Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200/80">
        <span>🏢 2.7 企业租户控制台总览</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">企业 API 资源控制大盘</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">实时掌控全公司的 API Token 消费总量、员工子账号配额使用率及底层语义缓存优化比率。</p>
    </div>

    <!-- 核心数据卡片 (苹果灰白风) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 额度使用率 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>企业分配总额度</span>
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm">⚡</span>
        </div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">
          {{ (demoStore.tenant.allocatedQuota / 1000000).toFixed(1) }}M
          <span class="text-xs font-normal text-slate-400">Tokens</span>
        </div>

        <div class="space-y-1 pt-1">
          <div class="flex justify-between text-[11px] font-bold">
            <span class="text-blue-600">已用 {{ demoStore.tenantUsagePercent }}%</span>
            <span class="text-slate-400 font-mono">剩 {{ (demoStore.tenantRemainingQuota / 1000000).toFixed(1) }}M</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-dark-700 rounded-full h-1.5 overflow-hidden">
            <div class="bg-blue-600 h-1.5 rounded-full transition-all" :style="{ width: `${demoStore.tenantUsagePercent}%` }"></div>
          </div>
        </div>
      </div>

      <!-- 本月消费预估 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>本月预算消费</span>
          <span class="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm">💰</span>
        </div>
        <div class="text-3xl font-black text-emerald-600 font-mono">¥1,289.50</div>
        <div class="text-[11px] text-emerald-600 font-bold">↓ 环比控制优化 -12.5%</div>
      </div>

      <!-- 活跃员工数 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>企业员工子账号</span>
          <span class="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm">👥</span>
        </div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">
          {{ demoStore.tenant.employeeCount }}
          <span class="text-xs font-normal text-slate-400">位员工</span>
        </div>
        <div class="text-[11px] text-slate-500 font-bold">部署 {{ demoStore.tenant.keyCount }} 个 Key 秘钥</div>
      </div>

      <!-- 缓存命中率 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>Engine A 语义缓存</span>
          <span class="p-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm">✨</span>
        </div>
        <div class="text-3xl font-black text-amber-600 font-mono">18.4%</div>
        <div class="text-[11px] text-slate-500 font-bold">本月直接节省成本 ¥284.50</div>
      </div>
    </div>

    <!-- 图表与快捷操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 近期安全审计日志 -->
      <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden p-6 space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-700">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">近期企业操作审计日志</h3>
          <router-link to="/demo/tenant/security" class="text-xs font-bold text-blue-600 hover:underline">查看全部 ➔</router-link>
        </div>

        <div class="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th class="px-5 py-3">时间</th>
                <th class="px-5 py-3">操作员工</th>
                <th class="px-5 py-3">动作详情</th>
                <th class="px-5 py-3">IP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr v-for="(log, index) in demoStore.tenant.auditLogs.slice(0, 4)" :key="index" class="hover:bg-slate-50">
                <td class="px-5 py-3 text-slate-400 font-sans whitespace-nowrap">{{ log.time }}</td>
                <td class="px-5 py-3 font-bold text-slate-900 font-sans whitespace-nowrap">{{ log.user }}</td>
                <td class="px-5 py-3 font-sans">
                  <span class="font-bold text-slate-800">{{ log.action }}</span>
                  <span class="text-slate-400 text-[11px] ml-2 font-mono">{{ log.detail }}</span>
                </td>
                <td class="px-5 py-3 text-slate-400">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
        <h3 class="font-bold text-xs text-slate-900 dark:text-white">控制台快捷入口</h3>

        <div class="space-y-3 text-xs">
          <router-link to="/demo/tenant/keys" class="flex items-center justify-between p-3.5 border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
            <div class="flex items-center space-x-3">
              <span class="text-base p-1.5 bg-slate-100 rounded-xl">🔑</span>
              <span class="font-bold text-slate-700 group-hover:text-blue-600">创建新 API Key</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-600 font-bold">→</span>
          </router-link>

          <router-link to="/demo/tenant/employees" class="flex items-center justify-between p-3.5 border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
            <div class="flex items-center space-x-3">
              <span class="text-base p-1.5 bg-slate-100 rounded-xl">👥</span>
              <span class="font-bold text-slate-700 group-hover:text-blue-600">直接创建新员工账号</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-600 font-bold">→</span>
          </router-link>

          <router-link to="/demo/tenant/billing" class="flex items-center justify-between p-3.5 border border-slate-200/80 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
            <div class="flex items-center space-x-3">
              <span class="text-base p-1.5 bg-slate-100 rounded-xl">💳</span>
              <span class="font-bold text-slate-700 group-hover:text-blue-600">查看月度账单与划拨</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-600 font-bold">→</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
