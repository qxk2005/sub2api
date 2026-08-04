<script setup lang="ts">
/**
 * 2.10.5 下级客户管理
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-clients p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">下级客户管理</h1>
      <p class="text-slate-500 text-sm mt-1">查看您招募并绑定的企业/个人客户列表及消费情况。</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- 工具栏 -->
      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div class="relative">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="搜索客户名称..." class="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-shadow">
        </div>
        <div class="flex items-center space-x-2 text-sm text-slate-500">
          <span>客户类型:</span>
          <select class="border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500">
            <option>全部</option>
            <option>企业</option>
            <option>个人</option>
          </select>
        </div>
      </div>

      <!-- 客户列表 -->
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">客户名称</th>
            <th class="px-6 py-4 font-medium">类型</th>
            <th class="px-6 py-4 font-medium">绑定时间</th>
            <th class="px-6 py-4 font-medium">本月消费</th>
            <th class="px-6 py-4 font-medium">本月调用量</th>
            <th class="px-6 py-4 font-medium">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="(client, idx) in demoStore.agent.clients" :key="idx" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 font-medium text-slate-900">{{ client.name }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded text-xs font-medium" :class="client.type === '企业' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600'">
                {{ client.type }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-500">{{ client.joined }}</td>
            <td class="px-6 py-4 font-mono font-medium text-slate-900">¥{{ client.monthly.toFixed(2) }}</td>
            <td class="px-6 py-4 text-slate-500">{{ (client.tokens / 1000).toFixed(1) }}k Tokens</td>
            <td class="px-6 py-4">
              <span class="flex items-center text-xs font-medium" :class="client.status === '活跃' ? 'text-green-600' : 'text-slate-400'">
                <span class="w-2 h-2 rounded-full mr-1.5" :class="client.status === '活跃' ? 'bg-green-500' : 'bg-slate-300'"></span>
                {{ client.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
