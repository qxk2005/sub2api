<script setup lang="ts">
/**
 * 2.10.6 佣金提现
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-payouts p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">佣金与提现</h1>
        <p class="text-slate-500 text-sm mt-1">查看收益明细并申请提现到您的银行账户。</p>
      </div>
      <button class="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
        申请提现
      </button>
    </div>

    <div class="grid lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <div class="text-amber-100 text-sm font-medium mb-2">当前可提现余额</div>
        <div class="text-4xl font-bold mb-6 font-mono">¥{{ demoStore.agent.withdrawable.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</div>
        
        <div class="flex justify-between items-center text-xs text-amber-100 border-t border-amber-400/30 pt-4">
          <span>最低提现额度: ¥500.00</span>
          <span>免手续费</span>
        </div>
      </div>
      
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-center">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-slate-800">提现账户信息</h3>
          <button class="text-sm font-medium text-blue-600">修改</button>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div>
            <div class="text-xs text-slate-400 mb-1">收款人姓名</div>
            <div class="font-medium text-slate-900">张代理</div>
          </div>
          <div>
            <div class="text-xs text-slate-400 mb-1">开户银行</div>
            <div class="font-medium text-slate-900 flex items-center">
              <span class="w-4 h-4 bg-red-600 rounded-full inline-block mr-2"></span>
              招商银行
            </div>
          </div>
          <div class="col-span-2">
            <div class="text-xs text-slate-400 mb-1">银行卡号</div>
            <div class="font-medium text-slate-900 font-mono text-lg">**** **** **** 8888</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提现记录 -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 bg-slate-50">
        <h3 class="font-bold text-slate-900">历史提现记录</h3>
      </div>
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">申请账期</th>
            <th class="px-6 py-4 font-medium">提现金额</th>
            <th class="px-6 py-4 font-medium">实际佣金收益</th>
            <th class="px-6 py-4 font-medium">打款方式</th>
            <th class="px-6 py-4 font-medium">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="(payout, idx) in demoStore.agent.payoutHistory" :key="idx" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">{{ payout.period }}</td>
            <td class="px-6 py-4 font-mono font-bold text-slate-900">¥{{ payout.amount.toFixed(2) }}</td>
            <td class="px-6 py-4 text-slate-500">¥{{ payout.commission.toFixed(2) }}</td>
            <td class="px-6 py-4 text-slate-500">{{ payout.method }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-green-50 text-green-600 border border-green-100 rounded text-xs font-medium">{{ payout.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
