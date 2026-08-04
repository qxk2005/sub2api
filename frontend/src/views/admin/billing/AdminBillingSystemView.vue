<script setup lang="ts">
/**
 * FRS V3.0 - 2.6 账单与充值系统 (系统管理员控制台 DEMO)
 * 涵盖 2.6.1 ~ 2.6.6 全部 6 大核心子功能
 */
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// 账单记录
interface BillingRecord {
  id: string
  period: string
  clientName: string
  clientType: '代理商' | '企业租户' | '直营用户'
  modelBreakdown: { model: string; tokens: number; cost: number }[]
  totalTokens: number
  totalCost: number
  cachedDiscountRatio: string
  status: '已结算' | '待对账' | '已推送'
  generatedAt: string
}

// 充值流水订单记录 (2.6.6)
interface RechargeOrder {
  orderId: string
  clientName: string
  channel: '微信支付' | '支付宝'
  amount: number
  tokensGranted: number
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED'
  createdAt: string
  transactionNo: string
}

const activeTab = ref<'metering' | 'recurring' | 'visual' | 'export' | 'alert' | 'recharge'>('metering')

// 模拟用量明细数据
const billingRecords = ref<BillingRecord[]>([
  {
    id: 'BILL-202608-01',
    period: '2026-08',
    clientName: '智算云连华东代理',
    clientType: '代理商',
    totalTokens: 24500000,
    totalCost: 12680.50,
    cachedDiscountRatio: '50% (Cached Tokens)',
    status: '已结算',
    generatedAt: '2026-08-01 00:00:00',
    modelBreakdown: [
      { model: 'gpt-4o', tokens: 12000000, cost: 7200.00 },
      { model: 'claude-3-5-sonnet', tokens: 8500000, cost: 4250.00 },
      { model: 'deepseek-v3', tokens: 4000000, cost: 1230.50 }
    ]
  },
  {
    id: 'BILL-202608-02',
    period: '2026-08',
    clientName: '示例科技有限公司',
    clientType: '企业租户',
    totalTokens: 5600000,
    totalCost: 1289.50,
    cachedDiscountRatio: '30% (Cached Tokens)',
    status: '已推送',
    generatedAt: '2026-08-01 00:00:00',
    modelBreakdown: [
      { model: 'gpt-4o', tokens: 3000000, cost: 800.00 },
      { model: 'claude-3-5-sonnet', tokens: 2600000, cost: 489.50 }
    ]
  }
])

// 模拟充值订单 (2.6.6)
const rechargeOrders = ref<RechargeOrder[]>([
  { orderId: 'ORD-20260804-9901', clientName: '示例科技有限公司', channel: '微信支付', amount: 5000.00, tokensGranted: 50000000, status: 'SUCCESS', createdAt: '2026-08-04 14:20:11', transactionNo: 'wx_tx_9988221100' },
  { orderId: 'ORD-20260803-7712', clientName: '张明 (直属个人开发者)', channel: '支付宝', amount: 1000.00, tokensGranted: 10000000, status: 'SUCCESS', createdAt: '2026-08-03 09:15:30', transactionNo: 'ali_tx_7722119933' }
])

// Toast 通知
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// Modal 状态
const isPdfModalOpen = ref(false)
const selectedBillForPdf = ref<BillingRecord | null>(null)
const isPayModalOpen = ref(false)
const payForm = ref({ clientName: '示例科技有限公司', amount: 2000, channel: '微信支付' as '微信支付' | '支付宝' })

// 2.6.1 穿透扣费测试
const promptTokens = ref(4000)
const completionTokens = ref(1500)
const cachedTokens = ref(2000)
const simulatedDeduction = computed(() => {
  const promptPrice = 0.00001
  const completionPrice = 0.00003
  const cachedPrice = 0.000005 // 50% discount for cached
  const rawCost = (promptTokens.value * promptPrice) + (completionTokens.value * completionPrice) + (cachedTokens.value * cachedPrice)
  const agentMarkup = rawCost * 1.25 // 代理加价 25%
  return {
    rawCost: rawCost.toFixed(4),
    agentMarkup: agentMarkup.toFixed(4),
    discountSaved: (cachedTokens.value * (promptPrice - cachedPrice)).toFixed(4)
  }
})

// 2.6.2 异步跑批账单
const triggerBatchBilling = () => {
  triggerToast("✓ 已完成定时任务跑批！成功自动出具全量下级【日/周/月度账单】并向 42 位企业管理员推送邮件对账单。")
}

// 2.6.4 导出 PDF / CSV
const openPdfModal = (record: BillingRecord) => {
  selectedBillForPdf.value = record
  isPdfModalOpen.value = true
}

const exportCsv = () => {
  triggerToast("✓ 已成功生成并下载全量 Token 穿透扣费明细 CSV 文件 (sub2api_billing_detail_202608.csv)！")
}

// 2.6.5 预警告警测试
const alertThreshold = ref(1000)
const triggerAlertTest = () => {
  triggerToast(`✓ 预警引擎响应成功！当账户余额 < ¥${alertThreshold.value} 时，系统自动触发多渠道邮件 & 钉钉 Webhook 告警，归零后自动暂停 Key 权限。`)
}

// 2.6.6 在线充值模拟
const submitOnlinePay = () => {
  const newOrder: RechargeOrder = {
    orderId: `ORD-${Date.now().toString().slice(-8)}`,
    clientName: payForm.value.clientName,
    channel: payForm.value.channel,
    amount: payForm.value.amount,
    tokensGranted: payForm.value.amount * 10000,
    status: 'SUCCESS',
    createdAt: new Date().toLocaleString(),
    transactionNo: `${payForm.value.channel === '微信支付' ? 'wx_tx_' : 'ali_tx_'}${Math.floor(100000 + Math.random() * 900000)}`
  }
  rechargeOrders.value.unshift(newOrder)
  isPayModalOpen.value = false
  triggerToast(`✓ 在线【${payForm.value.channel}】扫码到账成功！第三方 Hook 验签完成，已划拨 ${newOrder.tokensGranted.toLocaleString()} Tokens！`)
}
</script>

<template>
  <AppLayout>
    <div class="admin-billing-system font-sans space-y-6 relative selection:bg-purple-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">账单中台引擎系统通知</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div>
        <div class="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-3.5 py-1 rounded-full text-xs font-bold border border-purple-200/80">
          <span>💰 FRS 2.6 账单与在线充值中台控制塔 (Level 1)</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">账单与充值系统管理中心</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          包含 Token 级穿透计费、周期账单自动生成推送、可视化统计报表、规范 CSV/PDF 对账单导出、余额预警限流及微信/支付宝在线充值网关。
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button 
          @click="isPayModalOpen = true"
          class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>💳 发起在线充值</span>
        </button>
        <button 
          @click="triggerBatchBilling"
          class="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>✉️ 跑批生成与推送账单</span>
        </button>
      </div>
    </div>

    <!-- 6大核心功能子项 Tab 导航 -->
    <div class="flex items-center space-x-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
      <button 
        @click="activeTab = 'metering'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'metering' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>⚡ 2.6.1 穿透扣费与 Cached 计费</span>
      </button>

      <button 
        @click="activeTab = 'recurring'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'recurring' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>✉️ 2.6.2 日周月账单自动推送</span>
      </button>

      <button 
        @click="activeTab = 'visual'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'visual' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>📊 2.6.3 账单可视化分析</span>
      </button>

      <button 
        @click="activeTab = 'export'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'export' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>📥 2.6.4 CSV / PDF 对账单导出</span>
      </button>

      <button 
        @click="activeTab = 'alert'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'alert' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>🔔 2.6.5 余额预警与欠费停服</span>
      </button>

      <button 
        @click="activeTab = 'recharge'"
        :class="['px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all', activeTab === 'recharge' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100']"
      >
        <span>💳 2.6.6 在线充值与支付网关</span>
      </button>
    </div>

    <!-- Tab 1: 2.6.1 穿透扣费与 Cached 折扣计费引擎 -->
    <div v-if="activeTab === 'metering'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-700">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚡ 子项 2.6.1 多级穿透扣费与 Prompt Cache 折扣仿真引擎</span>
          </h3>
          <span class="text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">Engine B 双向精确对账</span>
        </div>

        <div class="grid md:grid-cols-3 gap-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">输入 Prompt Tokens</label>
            <input v-model.number="promptTokens" type="number" step="500" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-700">输出 Completion Tokens</label>
            <input v-model.number="completionTokens" type="number" step="500" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-700">Cached Prompt Tokens (50% 折扣)</label>
            <input v-model.number="cachedTokens" type="number" step="500" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>
        </div>

        <!-- 计算结果穿透预览 -->
        <div class="p-4 bg-slate-50 dark:bg-dark-900 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div class="font-bold text-slate-900 flex justify-between items-center">
            <span>🧮 穿透扣费计算核算表：</span>
            <span class="text-emerald-600 font-mono">命中语义缓存为您节省: ¥{{ simulatedDeduction.discountSaved }}</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-[11px]">
            <div>平台底层原价: <b class="text-slate-900">¥{{ simulatedDeduction.rawCost }}</b></div>
            <div>代理商加价后结算价: <b class="text-blue-600">¥{{ simulatedDeduction.agentMarkup }}</b></div>
            <div>企业租户最终扣额: <b class="text-purple-600">¥{{ simulatedDeduction.agentMarkup }}</b></div>
            <div>Cached 折扣率: <b class="text-amber-600">50% Off</b></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: 2.6.2 日/周/月账单自动生成与邮件推送 -->
    <div v-if="activeTab === 'recurring'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="font-bold text-sm text-slate-900">✉️ 子项 2.6.2 周期性账单跑批生成与自动化邮件推送</h3>
          <button @click="triggerBatchBilling" class="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-2xs">
            + 立即触发全量跑批
          </button>
        </div>

        <div class="grid md:grid-cols-3 gap-4 text-xs">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div class="font-bold text-slate-700">日度用量账单</div>
            <div class="text-slate-400">每日 00:00 自动聚合上日日志</div>
            <div class="text-emerald-600 font-bold mt-1">✓ 已发送 128 封邮件</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div class="font-bold text-slate-700">周度对账报告</div>
            <div class="text-slate-400">每周一 08:00 推送至企业管理员</div>
            <div class="text-emerald-600 font-bold mt-1">✓ 已发送 42 封周报</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div class="font-bold text-slate-700">月度规范财务账单</div>
            <div class="text-slate-400">每月 1 日出具上月完整对账 PDF</div>
            <div class="text-emerald-600 font-bold mt-1">✓ 已出具 15 份对账单</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: 2.6.3 账单可视化分析 -->
    <div v-if="activeTab === 'visual'" class="space-y-6 animate-fade-in">
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 class="font-bold text-sm text-slate-900">📊 近 30 天消费折线趋势图 (2.6.3)</h3>
            <span class="text-xs text-slate-400">日粒度精确汇总</span>
          </div>

          <div class="h-60 flex items-end justify-between px-2 pb-2 border-b border-slate-100">
            <div v-for="i in 30" :key="i" class="w-[2%] bg-purple-500 hover:bg-purple-600 rounded-t-sm transition-colors" :style="{ height: `${25 + (i % 8) * 10}%` }" :title="`Day ${i}`"></div>
          </div>
        </div>

        <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 class="font-bold text-xs text-slate-900 pb-2 border-b border-slate-100">模型费用消耗占比</h3>
          <ul class="space-y-3 text-xs">
            <li class="flex justify-between items-center">
              <span class="font-bold text-slate-700">GPT-4o (OpenAI)</span>
              <span class="font-mono text-purple-600 font-bold">58.4% (¥7,405.00)</span>
            </li>
            <li class="flex justify-between items-center">
              <span class="font-bold text-slate-700">Claude 3.5 Sonnet</span>
              <span class="font-mono text-orange-600 font-bold">33.5% (¥4,250.00)</span>
            </li>
            <li class="flex justify-between items-center">
              <span class="font-bold text-slate-700">DeepSeek V3</span>
              <span class="font-mono text-blue-600 font-bold">8.1% (¥1,025.50)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Tab 4: 2.6.4 CSV / PDF 规范对账单导出 -->
    <div v-if="activeTab === 'export'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="font-bold text-sm text-slate-900">📥 子项 2.6.4 规范 CSV / 盖章打印版 PDF 账单导出下载器</h3>
          <button @click="exportCsv" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-2xs">
            ↓ 导出全量 CSV 明细
          </button>
        </div>

        <div class="overflow-x-auto border border-slate-200 rounded-2xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th class="px-5 py-3.5">账期 / 客户名称</th>
                <th class="px-5 py-3.5">客户类型</th>
                <th class="px-5 py-3.5">消耗 Tokens</th>
                <th class="px-5 py-3.5">金额</th>
                <th class="px-5 py-3.5">Cached 折扣比例</th>
                <th class="px-5 py-3.5 text-right">PDF 打印与预览</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr v-for="b in billingRecords" :key="b.id" class="hover:bg-slate-50">
                <td class="px-5 py-4 font-sans font-bold text-slate-900">
                  {{ b.clientName }}
                  <div class="text-[10px] text-slate-400 font-mono">{{ b.id }} · {{ b.period }}</div>
                </td>
                <td class="px-5 py-4 font-sans font-bold text-purple-600">{{ b.clientType }}</td>
                <td class="px-5 py-4 font-bold text-slate-800">{{ b.totalTokens.toLocaleString() }}</td>
                <td class="px-5 py-4 font-bold text-emerald-600">¥{{ b.totalCost.toFixed(2) }}</td>
                <td class="px-5 py-4 font-sans text-amber-600 font-bold">{{ b.cachedDiscountRatio }}</td>
                <td class="px-5 py-4 text-right font-sans">
                  <button @click="openPdfModal(b)" class="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
                    🖨️ 预览 & 打印 PDF 账单
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 5: 2.6.5 余额预警与欠费停服机制 -->
    <div v-if="activeTab === 'alert'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 max-w-2xl text-xs">
        <h3 class="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
          🔔 子项 2.6.5 余额预警告警线与 0 余额自动停服机制
        </h3>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">触发预警余额阈值 (元)</label>
            <input v-model.number="alertThreshold" type="number" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>

          <div class="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 space-y-1">
            <div class="font-bold">⚠️ 自动停服规则:</div>
            <div>当代理商/租户/个人账号的余额归零或低于欠费硬上限时，底层 API 网关实时熔断，拒绝全量 API Key 请求（HTTP 402 Payment Required）。</div>
          </div>

          <button @click="triggerAlertTest" class="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-2xs">
            模拟预警通知与关停拦截
          </button>
        </div>
      </div>
    </div>

    <!-- Tab 6: 2.6.6 在线微信/支付宝充值网关流水与状态机 -->
    <div v-if="activeTab === 'recharge'" class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="font-bold text-sm text-slate-900">💳 子项 2.6.6 微信支付 / 支付宝扫码在线充值订单与 Hook 验签流水</h3>
          <button @click="isPayModalOpen = true" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
            + 发起第三方支付模拟
          </button>
        </div>

        <div class="overflow-x-auto border border-slate-200 rounded-2xl">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th class="px-5 py-3.5">订单号</th>
                <th class="px-5 py-3.5">充值客户</th>
                <th class="px-5 py-3.5">支付渠道</th>
                <th class="px-5 py-3.5">充值金额</th>
                <th class="px-5 py-3.5">自动注入 Tokens</th>
                <th class="px-5 py-3.5">Hook 验签状态</th>
                <th class="px-5 py-3.5">第三方交易号</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr v-for="ord in rechargeOrders" :key="ord.orderId" class="hover:bg-slate-50">
                <td class="px-5 py-4 font-bold text-slate-900">{{ ord.orderId }}</td>
                <td class="px-5 py-4 font-sans font-bold text-slate-800">{{ ord.clientName }}</td>
                <td class="px-5 py-4 font-sans font-bold text-emerald-600">{{ ord.channel }}</td>
                <td class="px-5 py-4 font-bold text-slate-900 text-sm">¥{{ ord.amount.toFixed(2) }}</td>
                <td class="px-5 py-4 font-bold text-blue-600">+ {{ ord.tokensGranted.toLocaleString() }}</td>
                <td class="px-5 py-4 font-sans">
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">✓ 充值即时到账</span>
                </td>
                <td class="px-5 py-4 text-slate-400 text-[11px]">{{ ord.transactionNo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal 1: 规范 PDF 账单预览与打印 (2.6.4) -->
    <div v-if="isPdfModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-sans">
        <div class="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <div class="text-xs font-bold text-purple-600 tracking-wider">Sub2API OFFICIAL INVOICE</div>
            <h2 class="text-xl font-black text-slate-900 mt-1">企业正式月度对账结算单 (PDF 打印版)</h2>
          </div>
          <button @click="isPdfModalOpen = false" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <!-- PDF 账单样式内容 -->
        <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs font-mono relative">
          <div class="absolute right-6 top-6 w-24 h-24 rounded-full border-4 border-rose-500/40 text-rose-500 flex items-center justify-center font-bold text-[10px] transform -rotate-12 pointer-events-none select-none">
            Sub2API 财务专用章
          </div>

          <div class="flex justify-between border-b pb-3">
            <div>
              <div class="font-bold text-slate-900 text-sm font-sans">{{ selectedBillForPdf?.clientName }}</div>
              <div class="text-slate-400 text-[11px]">客户编号 / 结算账户: {{ selectedBillForPdf?.id }}</div>
            </div>
            <div class="text-right">
              <div>账单周期: {{ selectedBillForPdf?.period }}</div>
              <div>生成日期: {{ selectedBillForPdf?.generatedAt }}</div>
            </div>
          </div>

          <table class="w-full text-left border-b pb-3 text-xs">
            <thead class="text-slate-400">
              <tr>
                <th class="py-1">调用 AI 模型</th>
                <th class="py-1">消耗 Tokens</th>
                <th class="py-1 text-right">核算费用 (元)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/60">
              <tr v-for="(m, idx) in selectedBillForPdf?.modelBreakdown" :key="idx">
                <td class="py-2 font-bold text-slate-800">{{ m.model }}</td>
                <td class="py-2">{{ m.tokens.toLocaleString() }}</td>
                <td class="py-2 text-right font-bold text-slate-900">¥{{ m.cost.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="flex justify-between items-center pt-2 font-bold text-sm">
            <span class="font-sans">对账结算总金额 (CNY):</span>
            <span class="text-emerald-600 font-mono text-lg">¥{{ selectedBillForPdf?.totalCost.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-2">
          <button @click="isPdfModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold text-xs">关闭</button>
          <button @click="triggerToast('✓ 正在唤起系统打印机下载标准 PDF 文件...')" class="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-2xs">
            🖨️ 打印导出 PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: 微信 / 支付宝在线充值发起 (2.6.6) -->
    <div v-if="isPayModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">💳 在线第三方充值 (微信/支付宝)</h3>
          <button @click="isPayModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">充值客户账号</label>
            <input v-model="payForm.clientName" type="text" class="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700">充值金额 (元)</label>
            <input v-model.number="payForm.amount" type="number" step="500" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700">选择支付渠道</label>
            <select v-model="payForm.channel" class="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
              <option value="微信支付">💚 微信支付 (Native 扫码)</option>
              <option value="支付宝">💙 支付宝 (当面付 / 网页支付)</option>
            </select>
          </div>

          <div class="p-4 bg-slate-50 rounded-2xl border flex flex-col items-center justify-center space-y-2">
            <div class="w-28 h-28 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs p-2 text-center">
              [ 模拟 {{ payForm.channel }} 扫码 ]
            </div>
            <div class="text-[10px] text-slate-400">扫码完成后系统异步 Hook 将自动加点配额</div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isPayModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitOnlinePay" class="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">模拟支付回调到账</button>
        </div>
      </div>
    </div>

    </div>
  </AppLayout>
</template>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
