<script setup lang="ts">
/**
 * 2.6.x 财务与账单
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-billing p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">财务与账单</h1>
        <p class="text-slate-500 text-sm mt-1">查看消费明细，管理余额，下载发票与对账单。</p>
      </div>
      <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
        充值余额
      </button>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div class="text-slate-300 text-sm font-medium mb-2">当前可用余额</div>
        <div class="text-4xl font-bold mb-4 font-mono">¥24,560.00</div>
        <div class="text-xs text-slate-400">计费周期: 2026-08-01 ~ 2026-08-31</div>
      </div>
      
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="text-slate-500 text-sm font-medium mb-2">本月累计消费</div>
        <div class="text-3xl font-bold text-slate-900 mb-2 font-mono">¥1,289.50</div>
        <div class="text-sm text-green-600 font-medium">预测月底: ¥2,450.00</div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
        <div class="text-slate-500 text-sm font-medium mb-4">余额预警设置</div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-slate-700">低于 1000 元发送邮件</span>
          <div class="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
            <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-5"></div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-700">欠费自动停服</span>
          <div class="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
            <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-5"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 账单列表 -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 class="font-bold text-slate-900">历史月度账单</h3>
      </div>
      
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">账期</th>
            <th class="px-6 py-4 font-medium">总金额</th>
            <th class="px-6 py-4 font-medium">模型费用分布</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="bill in demoStore.tenant.bills" :key="bill.period" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ bill.period }}</td>
            <td class="px-6 py-4 font-mono font-bold text-slate-900">¥{{ bill.total.toFixed(2) }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2 text-xs">
                <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">GPT-4o: ¥{{ bill.models['GPT-4o']?.toFixed(2) }}</span>
                <span class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded border border-orange-100">Claude: ¥{{ bill.models['Claude 3.5']?.toFixed(2) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">{{ bill.status }}</span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end w-full">
                下载 PDF <span class="ml-1 text-lg">↓</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
