<script setup lang="ts">
/**
 * 2.7.7 租户/用户专属门户 - 员工/普通用户个人门户视角
 * 苹果高级灰白配色
 */

// 模拟当前登录的员工用户
const currentEmployee = {
  name: '张三',
  email: 'zhangsan@demo.com',
  role: '部门管理员',
  tenant: '示例科技有限公司',
  quota: 500000,
  used: 234567,
  keyCount: 3,
  lastLogin: '2026-08-04 10:32:15'
}

const usagePercent = Math.round((currentEmployee.used / currentEmployee.quota) * 100)

// 个人 Key 列表
const myKeys = [
  { id: 'sk-emp-prod-***abc', name: '生产主 Key', models: 'GPT-4o, Claude 3.5', quota: 300000, used: 189000, status: '正常', expiry: '2026-12-31' },
  { id: 'sk-emp-dev-***def', name: '开发测试 Key', models: 'GPT-4o Mini, DeepSeek', quota: 100000, used: 35600, status: '正常', expiry: '2026-10-15' },
  { id: 'sk-emp-tmp-***ghi', name: '临时演示 Key', models: '全部模型', quota: 100000, used: 9967, status: '即将过期', expiry: '2026-08-15' },
]

// 个人用量明细
const myUsage = [
  { date: '2026-08-04', model: 'Claude 3.5 Sonnet', inputTokens: 12500, outputTokens: 8900, cost: 0.55 },
  { date: '2026-08-04', model: 'GPT-4o', inputTokens: 8200, outputTokens: 15600, cost: 1.77 },
  { date: '2026-08-03', model: 'DeepSeek V3', inputTokens: 45000, outputTokens: 32000, cost: 0.47 },
  { date: '2026-08-03', model: 'GPT-4o Mini', inputTokens: 22000, outputTokens: 18000, cost: 0.14 },
  { date: '2026-08-02', model: 'Gemini 2.0 Flash', inputTokens: 56000, outputTokens: 28000, cost: 0.17 },
]

// 当前用户可用的模型渠道
const availableModels = [
  { name: 'GPT-4o', provider: 'OpenAI', context: '128K', status: '可用', latency: '~420ms' },
  { name: 'GPT-4o Mini', provider: 'OpenAI', context: '128K', status: '可用', latency: '~180ms' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', context: '200K', status: '可用', latency: '~350ms' },
  { name: 'DeepSeek V3', provider: 'DeepSeek', context: '64K', status: '可用', latency: '~220ms' },
  { name: 'Gemini 2.0 Flash', provider: 'Google', context: '1M', status: '可用', latency: '~150ms' },
  { name: 'Claude 3 Opus', provider: 'Anthropic', context: '200K', status: '权限受限', latency: '-' },
]
</script>

<template>
  <div class="user-portal p-6 md:p-8 font-sans space-y-6">
    <!-- Header -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-bold border border-violet-200/80">
        <span>👤 2.7.7 用户专属门户 (个人视角)</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">我的 API 控制台</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">管理个人 API Key、实时查看用量与账单明细、查看权限可用的上游渠道及模型列表。</p>
    </div>

    <!-- 个人资料卡 + 配额概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>个人账号</span>
          <span class="p-1.5 bg-violet-50 text-violet-600 rounded-xl text-sm">👤</span>
        </div>
        <div class="text-base font-black text-slate-900 dark:text-white">{{ currentEmployee.name }}</div>
        <div class="space-y-1 text-[11px] text-slate-500">
          <div>📧 {{ currentEmployee.email }}</div>
          <div>🏢 {{ currentEmployee.tenant }}</div>
          <div>🔖 角色: <span class="text-violet-600 font-bold">{{ currentEmployee.role }}</span></div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>个人分配额度</span>
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm">⚡</span>
        </div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">
          {{ (currentEmployee.quota / 10000).toFixed(0) }}万
          <span class="text-xs font-normal text-slate-400">Tokens</span>
        </div>
        <div class="space-y-1 pt-1">
          <div class="flex justify-between text-[11px] font-bold">
            <span class="text-blue-600">已用 {{ usagePercent }}%</span>
            <span class="text-slate-400 font-mono">剩 {{ ((currentEmployee.quota - currentEmployee.used) / 10000).toFixed(1) }}万</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-dark-700 rounded-full h-1.5 overflow-hidden">
            <div class="bg-blue-600 h-1.5 rounded-full transition-all" :style="{ width: `${usagePercent}%` }"></div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>我的 API Key</span>
          <span class="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm">🔑</span>
        </div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">{{ currentEmployee.keyCount }}</div>
        <div class="text-[11px] text-slate-500 font-bold">含 1 个即将过期 Key</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>可用模型渠道</span>
          <span class="p-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm">🧠</span>
        </div>
        <div class="text-3xl font-black text-emerald-600 font-mono">{{ availableModels.filter(m => m.status === '可用').length }}</div>
        <div class="text-[11px] text-slate-500 font-bold">共 {{ availableModels.length }} 个模型，{{ availableModels.filter(m => m.status !== '可用').length }} 个权限受限</div>
      </div>
    </div>

    <!-- 个人 Key 管理 + 可用模型 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-dark-700 flex justify-between items-center">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">🔑 我的 API Key 管理</h3>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors">+ 申请新 Key</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-700 text-slate-500 font-bold border-b border-slate-200/80 dark:border-dark-600">
              <tr>
                <th class="px-5 py-3">Key 名称</th>
                <th class="px-5 py-3">授权模型</th>
                <th class="px-5 py-3">额度用量</th>
                <th class="px-5 py-3">到期时间</th>
                <th class="px-5 py-3">状态</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700">
              <tr v-for="key in myKeys" :key="key.id" class="hover:bg-slate-50 dark:hover:bg-dark-700/50">
                <td class="px-5 py-3">
                  <div class="font-bold text-slate-900 dark:text-white">{{ key.name }}</div>
                  <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ key.id }}</div>
                </td>
                <td class="px-5 py-3 text-slate-500">{{ key.models }}</td>
                <td class="px-5 py-3">
                  <div class="text-slate-900 dark:text-white font-mono font-bold">{{ (key.used / 1000).toFixed(0) }}K / {{ (key.quota / 1000).toFixed(0) }}K</div>
                  <div class="w-full bg-slate-100 dark:bg-dark-700 rounded-full h-1 mt-1 overflow-hidden">
                    <div class="bg-blue-600 h-1 rounded-full" :style="{ width: `${Math.round(key.used / key.quota * 100)}%` }"></div>
                  </div>
                </td>
                <td class="px-5 py-3 text-slate-400 font-mono">{{ key.expiry }}</td>
                <td class="px-5 py-3">
                  <span :class="['px-2 py-1 rounded text-xs font-bold border', key.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100']">{{ key.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
        <h3 class="font-bold text-xs text-slate-900 dark:text-white">🧠 我的权限可用模型</h3>
        <div class="space-y-2">
          <div v-for="model in availableModels" :key="model.name" class="flex items-center justify-between p-3 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
            <div>
              <div class="font-bold text-xs text-slate-800 dark:text-white">{{ model.name }}</div>
              <div class="text-[10px] text-slate-400">{{ model.provider }} · {{ model.context }}</div>
            </div>
            <div class="text-right">
              <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', model.status === '可用' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500']">{{ model.status }}</span>
              <div v-if="model.latency !== '-'" class="text-[10px] text-slate-400 font-mono mt-1">{{ model.latency }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 近期调用明细 -->
    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 dark:border-dark-700">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white">📊 近期调用用量明细</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 dark:bg-dark-700 text-slate-500 font-bold border-b border-slate-200/80 dark:border-dark-600">
            <tr>
              <th class="px-5 py-3">日期</th>
              <th class="px-5 py-3">模型</th>
              <th class="px-5 py-3">输入 Tokens</th>
              <th class="px-5 py-3">输出 Tokens</th>
              <th class="px-5 py-3">费用 (¥)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-dark-700 font-mono">
            <tr v-for="(row, idx) in myUsage" :key="idx" class="hover:bg-slate-50 dark:hover:bg-dark-700/50">
              <td class="px-5 py-3 text-slate-400 font-sans">{{ row.date }}</td>
              <td class="px-5 py-3 font-bold text-slate-900 dark:text-white font-sans">{{ row.model }}</td>
              <td class="px-5 py-3 text-slate-500">{{ row.inputTokens.toLocaleString() }}</td>
              <td class="px-5 py-3 text-slate-500">{{ row.outputTokens.toLocaleString() }}</td>
              <td class="px-5 py-3 font-bold text-slate-900 dark:text-white">¥{{ row.cost.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
