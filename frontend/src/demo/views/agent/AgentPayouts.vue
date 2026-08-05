<script setup lang="ts">
/**
 * 2.10.6 结算与对账 - 代理和平台运营方 & 代理和下属客户双向对账
 * V3.4 重新定义：从"佣金提现"变为"双向对账单"机制
 */
import { useDemoStore } from '../../stores/useDemoStore'
import { ref } from 'vue'

const demoStore = useDemoStore()

const activeTab = ref<'platform' | 'downstream'>('platform')

// 对账单 1: 平台运营方 vs 代理商
const platformReconciliation = [
  { 
    period: '2026-07', 
    platformCost: 8250.00, 
    agentDeposit: 12000.00, 
    agentMarkup: 0.15, 
    downstreamRevenue: 9487.50, 
    platformProfit: 1237.50,
    agentProfit: 1237.50,
    balance: 3750.00,
    status: '已对账' 
  },
  { 
    period: '2026-06', 
    platformCost: 7800.00, 
    agentDeposit: 10000.00, 
    agentMarkup: 0.15, 
    downstreamRevenue: 8970.00, 
    platformProfit: 1170.00,
    agentProfit: 1170.00,
    balance: 2200.00,
    status: '已对账' 
  },
  { 
    period: '2026-05', 
    platformCost: 5600.00, 
    agentDeposit: 8000.00, 
    agentMarkup: 0.15, 
    downstreamRevenue: 6440.00, 
    platformProfit: 840.00,
    agentProfit: 840.00,
    balance: 2400.00,
    status: '已对账' 
  },
]

// 对账单 2: 代理商 vs 下游企业租户/用户
const downstreamReconciliation = [
  { clientName: '示例科技有限公司', type: '企业', period: '2026-07', baseCost: 1289.50, markupRate: 0.15, clientPaid: 1482.93, agentEarning: 193.43, status: '已结清' },
  { clientName: '创新工坊', type: '企业', period: '2026-07', baseCost: 890.00, markupRate: 0.15, clientPaid: 1023.50, agentEarning: 133.50, status: '已结清' },
  { clientName: '智慧教育科技', type: '企业', period: '2026-07', baseCost: 2100.00, markupRate: 0.20, clientPaid: 2520.00, agentEarning: 420.00, status: '已结清' },
  { clientName: '张明(个人)', type: '个人', period: '2026-07', baseCost: 129.00, markupRate: 0.10, clientPaid: 141.90, agentEarning: 12.90, status: '已结清' },
  { clientName: '李华(个人)', type: '个人', period: '2026-07', baseCost: 0, markupRate: 0.10, clientPaid: 0, agentEarning: 0, status: '未激活' },
]
</script>

<template>
  <div class="agent-reconciliation p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">结算与双向对账</h1>
        <p class="text-slate-500 text-sm mt-1">查看平台-代理商对账单与代理商-下游客户对账单，实现双向资金透明核对。</p>
      </div>
      <button class="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
        导出对账单 (PDF)
      </button>
    </div>

    <!-- 双向对账 Tab 切换 -->
    <div class="flex gap-3 mb-6">
      <button 
        @click="activeTab = 'platform'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border', activeTab === 'platform' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50']"
      >
        📋 平台 vs 代理商 对账
      </button>
      <button 
        @click="activeTab = 'downstream'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border', activeTab === 'downstream' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50']"
      >
        📋 代理商 vs 下游客户 对账
      </button>
    </div>

    <!-- 对账单 1: 平台运营方 vs 代理商 -->
    <div v-if="activeTab === 'platform'" class="space-y-6">
      <!-- 汇总卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div class="text-blue-100 text-xs font-medium mb-1">代理商预充值总额</div>
          <div class="text-2xl font-bold font-mono">¥30,000.00</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">平台底价总成本</div>
          <div class="text-2xl font-bold text-slate-900 font-mono">¥21,650.00</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">代理溢价总收入</div>
          <div class="text-2xl font-bold text-emerald-600 font-mono">¥3,247.50</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">剩余预充值余额</div>
          <div class="text-2xl font-bold text-amber-600 font-mono">¥8,350.00</div>
        </div>
      </div>

      <!-- 月度对账表 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50">
          <h3 class="font-bold text-slate-900">📊 平台运营方 vs 代理商 月度对账明细</h3>
          <p class="text-xs text-slate-500 mt-1">按平台底价与代理出资额汇总对账，自动计算溢价收益与净利润</p>
        </div>
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
            <tr>
              <th class="px-5 py-4 font-medium">账期</th>
              <th class="px-5 py-4 font-medium">平台底价成本</th>
              <th class="px-5 py-4 font-medium">代理预充金额</th>
              <th class="px-5 py-4 font-medium">加价倍率</th>
              <th class="px-5 py-4 font-medium">下游实收</th>
              <th class="px-5 py-4 font-medium">代理净利润</th>
              <th class="px-5 py-4 font-medium">剩余余额</th>
              <th class="px-5 py-4 font-medium">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, idx) in platformReconciliation" :key="idx" class="hover:bg-slate-50">
              <td class="px-5 py-4 font-bold text-slate-900">{{ row.period }}</td>
              <td class="px-5 py-4 font-mono text-slate-600">¥{{ row.platformCost.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 font-mono font-bold text-blue-600">¥{{ row.agentDeposit.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 text-slate-500">{{ (row.agentMarkup * 100).toFixed(0) }}%</td>
              <td class="px-5 py-4 font-mono text-slate-900">¥{{ row.downstreamRevenue.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 font-mono font-bold text-emerald-600">+¥{{ row.agentProfit.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 font-mono text-amber-600">¥{{ row.balance.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 bg-green-50 text-green-600 border border-green-100 rounded text-xs font-medium">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 对账单 2: 代理商 vs 下游客户 -->
    <div v-else class="space-y-6">
      <!-- 汇总卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
          <div class="text-amber-100 text-xs font-medium mb-1">下游客户总数</div>
          <div class="text-2xl font-bold font-mono">{{ demoStore.agent.clientCount }}</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">本月下游总消费 (底价)</div>
          <div class="text-2xl font-bold text-slate-900 font-mono">¥4,408.50</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">本月客户实付 (含加价)</div>
          <div class="text-2xl font-bold text-blue-600 font-mono">¥5,168.33</div>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div class="text-slate-400 text-xs font-medium mb-1">本月溢价净收入</div>
          <div class="text-2xl font-bold text-emerald-600 font-mono">+¥759.83</div>
        </div>
      </div>

      <!-- 客户对账表 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50">
          <h3 class="font-bold text-slate-900">📊 代理商 vs 下游企业租户/用户 对账明细</h3>
          <p class="text-xs text-slate-500 mt-1">按代理设置的独立加价倍率与下游实际消费额汇总对账</p>
        </div>
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
            <tr>
              <th class="px-5 py-4 font-medium">客户名称</th>
              <th class="px-5 py-4 font-medium">类型</th>
              <th class="px-5 py-4 font-medium">账期</th>
              <th class="px-5 py-4 font-medium">底价成本</th>
              <th class="px-5 py-4 font-medium">加价率</th>
              <th class="px-5 py-4 font-medium">客户实付</th>
              <th class="px-5 py-4 font-medium">代理净赚</th>
              <th class="px-5 py-4 font-medium">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, idx) in downstreamReconciliation" :key="idx" class="hover:bg-slate-50">
              <td class="px-5 py-4 font-bold text-slate-900">{{ row.clientName }}</td>
              <td class="px-5 py-4">
                <span :class="['px-2 py-0.5 rounded text-xs font-bold', row.type === '企业' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-500']">{{ row.type }}</span>
              </td>
              <td class="px-5 py-4 text-slate-500">{{ row.period }}</td>
              <td class="px-5 py-4 font-mono text-slate-600">¥{{ row.baseCost.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 text-slate-500">{{ (row.markupRate * 100).toFixed(0) }}%</td>
              <td class="px-5 py-4 font-mono font-bold text-slate-900">¥{{ row.clientPaid.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4 font-mono font-bold text-emerald-600">{{ row.agentEarning > 0 ? '+' : '' }}¥{{ row.agentEarning.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
              <td class="px-5 py-4">
                <span :class="['px-2 py-1 rounded text-xs font-medium border', row.status === '已结清' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200']">{{ row.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
