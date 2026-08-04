<script setup lang="ts">
/**
 * 企业租户 - 控制台总览
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-dashboard p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">控制台总览</h1>
      <p class="text-slate-500 text-sm mt-1">欢迎回来，以下是您企业的 API 调用及资源使用情况概览。</p>
    </div>

    <!-- 核心数据卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 额度使用率 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-xl -z-10"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="text-slate-500 text-sm font-medium">企业总额度</div>
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-slate-900 mb-1">{{ (demoStore.tenant.allocatedQuota / 1000000).toFixed(1) }}M</div>
        <div class="text-xs text-slate-500 mb-4">Tokens</div>
        <!-- 进度条 -->
        <div>
          <div class="flex justify-between text-xs mb-1 font-medium">
            <span class="text-blue-600">已用 {{ demoStore.tenantUsagePercent }}%</span>
            <span class="text-slate-500">剩余 {{ (demoStore.tenantRemainingQuota / 1000000).toFixed(1) }}M</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5">
            <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: `${demoStore.tenantUsagePercent}%` }"></div>
          </div>
        </div>
      </div>

      <!-- 本月消费 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-slate-500 text-sm font-medium">本月消费预估</div>
          <div class="p-2 bg-green-50 text-green-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-slate-900 mb-1">¥1,289.50</div>
        <div class="text-xs text-green-600 font-medium flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          环比下降 12.5%
        </div>
      </div>

      <!-- 活跃员工 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-slate-500 text-sm font-medium">活跃子账号</div>
          <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-slate-900 mb-1">{{ demoStore.tenant.employeeCount }}</div>
        <div class="text-xs text-slate-500">共分配 {{ demoStore.tenant.keyCount }} 个 API Key</div>
      </div>

      <!-- 缓存命中率 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-slate-500 text-sm font-medium">语义缓存命中率</div>
          <div class="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-slate-900 mb-1">18.4%</div>
        <div class="text-xs text-slate-500">本月为您节省 ¥284.50</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 近期审计日志 -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 class="font-bold text-slate-800">近期安全审计日志</h3>
          <router-link to="/demo/tenant/security" class="text-sm text-blue-600 hover:text-blue-700 font-medium">查看全部</router-link>
        </div>
        <div class="p-0">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th class="px-6 py-3 font-medium">时间</th>
                <th class="px-6 py-3 font-medium">操作人</th>
                <th class="px-6 py-3 font-medium">动作</th>
                <th class="px-6 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(log, index) in demoStore.tenant.auditLogs.slice(0, 4)" :key="index" class="hover:bg-slate-50">
                <td class="px-6 py-3 whitespace-nowrap text-slate-500">{{ log.time }}</td>
                <td class="px-6 py-3 font-medium text-slate-900">{{ log.user }}</td>
                <td class="px-6 py-3">
                  <span class="text-slate-900">{{ log.action }}</span>
                  <span class="text-slate-400 ml-2 text-xs truncate max-w-[200px] inline-block align-bottom">{{ log.detail }}</span>
                </td>
                <td class="px-6 py-3 text-slate-500 font-mono text-xs">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-800 mb-4">快捷操作</h3>
        <div class="space-y-3">
          <button class="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div class="flex items-center text-slate-700 group-hover:text-blue-700">
              <span class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mr-3 text-lg">➕</span>
              <span class="font-medium text-sm">创建 API Key</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-500">→</span>
          </button>
          <button class="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div class="flex items-center text-slate-700 group-hover:text-blue-700">
              <span class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mr-3 text-lg">📧</span>
              <span class="font-medium text-sm">邀请新员工加入</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-500">→</span>
          </button>
          <button class="w-full flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <div class="flex items-center text-slate-700 group-hover:text-blue-700">
              <span class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mr-3 text-lg">💳</span>
              <span class="font-medium text-sm">充值企业余额</span>
            </div>
            <span class="text-slate-400 group-hover:text-blue-500">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
