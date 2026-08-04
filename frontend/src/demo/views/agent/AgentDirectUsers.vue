<script setup lang="ts">
/**
 * 2.10.5 直营用户管理 (代理商 Portal 控制端 - 个人直营专版)
 * 苹果高级灰白风格，支持查看当前直营客户的控制面板 (消费统计、API Key、QPS/RPM限额与资金划拨)
 */
import { ref, computed } from 'vue'

interface UserApiKey {
  id: string
  name: string
  keyPrefix: string
  models: string
  createdAt: string
  usedQuota: number
}

interface DirectUser {
  id: string
  name: string
  email: string
  balance: number
  monthlyTokens: string
  joinedAt: string
  status: 'active' | 'disabled'
  concurrency: number
  rpmLimit: number
  rate: number
  keys: UserApiKey[]
  logs: { time: string; model: string; tokens: number; latency: number; cost: number }[]
}

// 模拟代理直营个人用户列表
const directUsers = ref<DirectUser[]>([
  {
    id: 'USR-3011',
    name: '张明 (直属个人开发者)',
    email: 'zhangming@dev.io',
    balance: 2500.00,
    monthlyTokens: '89 万 Tokens',
    joinedAt: '2026-05-10',
    status: 'active',
    concurrency: 16,
    rpmLimit: 600,
    rate: 1.25,
    keys: [
      { id: 'DKEY-1', name: '个人开发项目 Key', keyPrefix: 'sk-direct-dev-***77a', models: 'GPT-4o, Claude 3.5 Sonnet', createdAt: '2026-05-11', usedQuota: 890.00 }
    ],
    logs: [
      { time: '2026-08-04 14:32:05', model: 'claude-3-5-sonnet', tokens: 4200, latency: 120, cost: 0.85 },
      { time: '2026-08-04 12:10:44', model: 'gpt-4o', tokens: 1800, latency: 145, cost: 0.45 },
      { time: '2026-08-03 18:20:11', model: 'gpt-4o-mini', tokens: 8900, latency: 45, cost: 0.12 }
    ]
  },
  {
    id: 'USR-3012',
    name: '极客工作室 (张伟)',
    email: 'zhangwei@geek.io',
    balance: 8900.00,
    monthlyTokens: '340 万 Tokens',
    joinedAt: '2026-04-15',
    status: 'active',
    concurrency: 32,
    rpmLimit: 1200,
    rate: 1.25,
    keys: [
      { id: 'DKEY-2', name: '极客 AI 部署 Key', keyPrefix: 'sk-geek-***99b', models: 'DeepSeek V3, GPT-4o', createdAt: '2026-04-16', usedQuota: 3400.00 }
    ],
    logs: [
      { time: '2026-08-04 15:02:11', model: 'deepseek-v3', tokens: 12000, latency: 85, cost: 0.32 }
    ]
  },
  {
    id: 'USR-3013',
    name: '李华 (直属独立开发者)',
    email: 'lihua@indie.me',
    balance: 450.00,
    monthlyTokens: '12 万 Tokens',
    joinedAt: '2026-07-01',
    status: 'active',
    concurrency: 8,
    rpmLimit: 300,
    rate: 1.25,
    keys: [
      { id: 'DKEY-3', name: '独立 MVP 测试 Key', keyPrefix: 'sk-indie-***12c', models: 'GPT-4o Mini', createdAt: '2026-07-02', usedQuota: 120.00 }
    ],
    logs: []
  }
])

const searchQuery = ref('')

const filteredUsers = computed(() => {
  return directUsers.value.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           u.id.toLowerCase().includes(searchQuery.value)
  })
})

// 选中的直营用户控制面板
const isUserDashboardOpen = ref(false)
const selectedUser = ref<DirectUser | null>(null)
const activeTab = ref<'keys' | 'logs'>('keys')

const openUserDashboard = (user: DirectUser) => {
  selectedUser.value = user
  activeTab.value = 'keys'
  isUserDashboardOpen.value = true
}

// 开通直营用户 Modal
const isCreateUserModalOpen = ref(false)
const newUserForm = ref({ name: '', email: '', balance: 2000.00, concurrency: 16, rpmLimit: 600 })

// Toast 通知
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const submitCreateUser = () => {
  if (!newUserForm.value.name || !newUserForm.value.email) return
  const newId = `USR-${Math.floor(3014 + Math.random() * 100)}`
  const today = new Date().toISOString().slice(0, 10)

  const newUser: DirectUser = {
    id: newId,
    name: newUserForm.value.name,
    email: newUserForm.value.email,
    balance: newUserForm.value.balance,
    monthlyTokens: '0 Tokens',
    joinedAt: today,
    status: 'active',
    concurrency: newUserForm.value.concurrency,
    rpmLimit: newUserForm.value.rpmLimit,
    rate: 1.25,
    keys: [
      { id: `DKEY-${Math.floor(10 + Math.random() * 90)}`, name: '默认主服务 Key', keyPrefix: `sk-direct-${newId.toLowerCase()}-***`, models: '全部推荐模型', createdAt: today, usedQuota: 0.00 }
    ],
    logs: []
  }

  directUsers.value.unshift(newUser)
  newUserForm.value = { name: '', email: '', balance: 2000.00, concurrency: 16, rpmLimit: 600 }
  isCreateUserModalOpen.value = false
  triggerToast(`✓ 成功开通直营个人用户【${newUser.name}】！`)
}

const rechargeUser = (u: DirectUser) => {
  u.balance += 1000.00
  triggerToast(`✓ 成功为直营用户【${u.name}】划拨 1000.00 元 Token 余额！`)
}

const toggleStatus = (u: DirectUser) => {
  u.status = u.status === 'active' ? 'disabled' : 'active'
  triggerToast(`✓ 直营用户【${u.name}】状态已设为：${u.status === 'active' ? '正常运行' : '已停用'}`)
}
</script>

<template>
  <div class="agent-direct-users p-6 md:p-8 font-sans space-y-6 relative">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">直营用户 Portal 操作成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- 1. Header Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div>
        <div class="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold border border-indigo-200/80">
          <span>👤 FRS 2.10.5 代理商直营个人用户管理</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">直营用户管理中心</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          在此管理属于您专属代理直绑的个人开发者与直营客户，点击可查看直营客户的控制面板与秘钥调用信息。
        </p>
      </div>

      <button 
        @click="isCreateUserModalOpen = true"
        class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
      >
        <span>+ 开通直营个人用户</span>
      </button>
    </div>

    <!-- 2. 直营用户主表格面板 -->
    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
          直营个人客户列表 ({{ filteredUsers.length }} 位)
        </div>

        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索直营用户名、邮箱或 ID..." 
          class="w-full sm:w-64 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div class="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th class="px-5 py-3.5">用户 ID / 客户姓名</th>
              <th class="px-5 py-3.5">登录邮箱</th>
              <th class="px-5 py-3.5">账户余额 (balance)</th>
              <th class="px-5 py-3.5">月消耗 Tokens</th>
              <th class="px-5 py-3.5">QPS 并发 / RPM Cap</th>
              <th class="px-5 py-3.5">状态</th>
              <th class="px-5 py-3.5 text-right">直营控制面板与管控</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-5 py-4 font-sans">
                <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span class="text-indigo-600 font-mono text-xs">👤</span>
                  <span>{{ u.name }}</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ u.id }} · 开户时间: {{ u.joinedAt }}</div>
              </td>

              <td class="px-5 py-4 text-slate-600 font-sans">
                {{ u.email }}
              </td>

              <td class="px-5 py-4 font-bold text-slate-900 text-sm">
                ¥{{ u.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
              </td>

              <td class="px-5 py-4 font-bold text-indigo-600">
                {{ u.monthlyTokens }}
              </td>

              <td class="px-5 py-4 font-sans text-slate-600">
                {{ u.concurrency }} QPS / {{ u.rpmLimit }} RPM
              </td>

              <td class="px-5 py-4 font-sans whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                    u.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-rose-50 text-rose-700 border-rose-200/80'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                  <span>{{ u.status === 'active' ? '正常运行' : '已停用' }}</span>
                </span>
              </td>

              <td class="px-5 py-4 text-right font-sans whitespace-nowrap">
                <div class="inline-flex items-center justify-end space-x-2">
                  <button 
                    @click="openUserDashboard(u)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
                  >
                    <span>📊</span>
                    <span>控制面板</span>
                  </button>

                  <button 
                    @click="rechargeUser(u)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs border border-indigo-200/60 transition-all shadow-2xs active:scale-95"
                  >
                    <span>⚡</span>
                    <span>划拨</span>
                  </button>

                  <button 
                    @click="toggleStatus(u)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs border border-slate-200 transition-all shadow-2xs active:scale-95"
                  >
                    <span>{{ u.status === 'active' ? '🔒' : '🔓' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. 直营客户专属控制面板 Drawer / Modal -->
    <div v-if="isUserDashboardOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-4xl w-full border border-slate-200/80 dark:border-dark-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <!-- Dashboard Header -->
        <div class="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-dark-700">
          <div>
            <div class="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
              <span>👤 直营客户控制面板 (Direct User Dashboard)</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {{ selectedUser?.name }}
            </h2>
            <p class="text-xs text-slate-400 mt-1 font-mono">
              客户 ID: {{ selectedUser?.id }} | 邮箱: {{ selectedUser?.email }} | 执行加价倍率: {{ selectedUser?.rate }}x
            </p>
          </div>
          <button @click="isUserDashboardOpen = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-sm">✕</button>
        </div>

        <!-- 4大核心数据卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">直营账户余额</div>
            <div class="text-2xl font-black text-emerald-600 mt-1">¥{{ selectedUser?.balance.toFixed(2) }}</div>
            <button @click="rechargeUser(selectedUser!)" class="text-[10px] text-indigo-600 font-bold mt-1 hover:underline">+ 充值划拨</button>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">本月消耗 Tokens</div>
            <div class="text-2xl font-black text-indigo-600 mt-1">{{ selectedUser?.monthlyTokens }}</div>
            <div class="text-[10px] text-slate-400 mt-1">日均调用良好</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">QPS 并发上限</div>
            <div class="text-2xl font-black text-slate-900 mt-1">{{ selectedUser?.concurrency }} QPS</div>
            <div class="text-[10px] text-emerald-600 font-bold mt-1">极速独立通道</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">RPM 限额</div>
            <div class="text-xl font-black text-slate-900 mt-1">{{ selectedUser?.rpmLimit }} RPM</div>
            <div class="text-[10px] text-slate-400 mt-1">单分钟上限</div>
          </div>
        </div>

        <!-- 控制面板 Tab -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button 
            @click="activeTab = 'keys'"
            :class="['px-4 py-2 rounded-2xl font-bold text-xs transition-all', activeTab === 'keys' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            🔑 专属 API Key 列表 ({{ selectedUser?.keys.length }})
          </button>
          <button 
            @click="activeTab = 'logs'"
            :class="['px-4 py-2 rounded-2xl font-bold text-xs transition-all', activeTab === 'logs' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            📈 近期调用日志与扣费
          </button>
        </div>

        <!-- Tab 1: API Keys -->
        <div v-if="activeTab === 'keys'" class="space-y-3">
          <div class="text-xs font-bold text-slate-700">直营个人部署 Key 明细</div>
          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Key 名称</th>
                  <th class="px-4 py-3">Key 前缀</th>
                  <th class="px-4 py-3">模型白名单</th>
                  <th class="px-4 py-3">创建时间</th>
                  <th class="px-4 py-3">已用额度</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr v-for="k in selectedUser?.keys" :key="k.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3 font-sans font-bold text-slate-900">{{ k.name }}</td>
                  <td class="px-4 py-3 font-bold text-indigo-600">{{ k.keyPrefix }}</td>
                  <td class="px-4 py-3 font-sans text-slate-600">{{ k.models }}</td>
                  <td class="px-4 py-3 text-slate-400 font-sans">{{ k.createdAt }}</td>
                  <td class="px-4 py-3 font-bold text-emerald-600">¥{{ k.usedQuota.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: Logs -->
        <div v-if="activeTab === 'logs'" class="space-y-3">
          <div class="text-xs font-bold text-slate-700">直营客户请求日志记录</div>
          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">请求时间</th>
                  <th class="px-4 py-3">调用的 AI 模型</th>
                  <th class="px-4 py-3">消耗 Tokens</th>
                  <th class="px-4 py-3">响应延迟</th>
                  <th class="px-4 py-3">单次消费</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr v-for="(log, idx) in selectedUser?.logs" :key="idx" class="hover:bg-slate-50">
                  <td class="px-4 py-3 text-slate-400">{{ log.time }}</td>
                  <td class="px-4 py-3 font-bold text-indigo-600">{{ log.model }}</td>
                  <td class="px-4 py-3 font-bold text-slate-900">{{ log.tokens }} Tokens</td>
                  <td class="px-4 py-3 text-emerald-600 font-bold">{{ log.latency }}ms</td>
                  <td class="px-4 py-3 text-blue-600 font-bold">¥{{ log.cost.toFixed(2) }}</td>
                </tr>
                <tr v-if="!selectedUser?.logs || selectedUser.logs.length === 0">
                  <td colspan="5" class="text-center py-6 text-slate-400 font-sans italic">暂无调用日志记录</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button @click="isUserDashboardOpen = false" class="px-5 py-2 bg-slate-900 text-white rounded-2xl font-bold text-xs">
            关闭面板
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: 开通直营个人用户 -->
    <div v-if="isCreateUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">+ 开通直营个人用户</h3>
          <button @click="isCreateUserModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">用户姓名 <span class="text-red-500">*</span></label>
            <input v-model="newUserForm.name" type="text" placeholder="例如: 开发者 王强" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700">登录邮箱 <span class="text-red-500">*</span></label>
            <input v-model="newUserForm.email" type="email" placeholder="例如: wangqiang@dev.io" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="space-y-1">
              <label class="font-bold text-slate-700">初始余额</label>
              <input v-model.number="newUserForm.balance" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700">并发 (QPS)</label>
              <input v-model.number="newUserForm.concurrency" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700">RPM Limit</label>
              <input v-model.number="newUserForm.rpmLimit" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isCreateUserModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitCreateUser" class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">确认开户</button>
        </div>
      </div>
    </div>

  </div>
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
