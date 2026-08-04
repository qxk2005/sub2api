<script setup lang="ts">
/**
 * 2.10.5 下级租户管理 (代理商 Portal 控制端 - 企业租户专版)
 * 苹果高级灰白风格，支持查看当前企业租户的控制面板 (数据大盘、成员列表、API Key 明细与额度划拨)
 */
import { ref, computed } from 'vue'

interface Member {
  id: string
  name: string
  email: string
  role: 'tenant_admin' | 'tenant_user'
  allocatedQuota: number
  usedQuota: number
  status: 'active' | 'disabled'
  lastActive: string
}

interface TenantApiKey {
  id: string
  name: string
  keyPrefix: string
  models: string
  createdAt: string
  usedQuota: number
}

interface EnterpriseTenant {
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
  members: Member[]
  keys: TenantApiKey[]
}

// 模拟企业租户列表
const tenants = ref<EnterpriseTenant[]>([
  {
    id: 'TNT-8001',
    name: '示例科技有限公司',
    email: 'contact@demo-corp.com',
    balance: 45000.00,
    monthlyTokens: '560 万 Tokens',
    joinedAt: '2026-03-15',
    status: 'active',
    concurrency: 64,
    rpmLimit: 3000,
    rate: 1.25,
    members: [
      { id: 'MEM-101', name: '张三 (部门管理员)', email: 'zhangsan@demo-corp.com', role: 'tenant_admin', allocatedQuota: 20000.00, usedQuota: 8900.00, status: 'active', lastActive: '10 分钟前' },
      { id: 'MEM-102', name: '李四 (开发工程师)', email: 'lisi@demo-corp.com', role: 'tenant_user', allocatedQuota: 10000.00, usedQuota: 3400.00, status: 'active', lastActive: '2 小时前' },
      { id: 'MEM-103', name: '王五 (算法专员)', email: 'wangwu@demo-corp.com', role: 'tenant_user', allocatedQuota: 15000.00, usedQuota: 11200.00, status: 'active', lastActive: '5 小时前' }
    ],
    keys: [
      { id: 'KEY-1', name: '后端主服务 API Key', keyPrefix: 'sk-demo-corp-***9a8', models: 'GPT-4o, Claude 3.5', createdAt: '2026-03-16', usedQuota: 18500.00 },
      { id: 'KEY-2', name: '算法实验节点 Key', keyPrefix: 'sk-demo-corp-***7f2', models: 'DeepSeek V3, Gemini', createdAt: '2026-04-01', usedQuota: 5000.00 }
    ]
  },
  {
    id: 'TNT-8002',
    name: '创新工坊 AI 课题组',
    email: 'lab@innovation.cn',
    balance: 18900.00,
    monthlyTokens: '320 万 Tokens',
    joinedAt: '2026-04-20',
    status: 'active',
    concurrency: 32,
    rpmLimit: 1500,
    rate: 1.25,
    members: [
      { id: 'MEM-201', name: '钱七 (课题组负责人)', email: 'qianqi@innovation.cn', role: 'tenant_admin', allocatedQuota: 18900.00, usedQuota: 12000.00, status: 'active', lastActive: '1 天前' }
    ],
    keys: [
      { id: 'KEY-3', name: '课题研究专用 Key', keyPrefix: 'sk-innov-***3b1', models: 'Claude 3.5 Sonnet', createdAt: '2026-04-22', usedQuota: 12000.00 }
    ]
  },
  {
    id: 'TNT-8003',
    name: '智慧教育科技',
    email: 'tech@edu-cloud.org',
    balance: 32000.00,
    monthlyTokens: '890 万 Tokens',
    joinedAt: '2026-02-28',
    status: 'active',
    concurrency: 128,
    rpmLimit: 6000,
    rate: 1.25,
    members: [
      { id: 'MEM-301', name: '赵八 (CTO)', email: 'zhaoba@edu-cloud.org', role: 'tenant_admin', allocatedQuota: 32000.00, usedQuota: 21000.00, status: 'active', lastActive: '30 分钟前' }
    ],
    keys: [
      { id: 'KEY-4', name: '在线教育网关 Key', keyPrefix: 'sk-edu-***88d', models: 'GPT-4o Mini', createdAt: '2026-03-01', usedQuota: 21000.00 }
    ]
  }
])

const searchQuery = ref('')

const filteredTenants = computed(() => {
  return tenants.value.filter(t => {
    return t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           t.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           t.id.toLowerCase().includes(searchQuery.value)
  })
})

// 选中的租户 (用于打开控制面板 Modal)
const isTenantDashboardOpen = ref(false)
const selectedTenant = ref<EnterpriseTenant | null>(null)
const activeTab = ref<'members' | 'keys' | 'logs'>('members')

const openTenantDashboard = (tenant: EnterpriseTenant) => {
  selectedTenant.value = tenant
  activeTab.value = 'members'
  isTenantDashboardOpen.value = true
}

// 创建租户 Modal 控制
const isCreateTenantModalOpen = ref(false)
const newTenantForm = ref({ name: '', email: '', balance: 10000.00, concurrency: 32, rpmLimit: 1500 })

// 添加租户成员 Modal 控制
const isAddMemberModalOpen = ref(false)
const newMemberForm = ref({ name: '', email: '', role: 'tenant_user' as 'tenant_admin' | 'tenant_user', allocatedQuota: 2000.00 })

// Toast 通知
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const submitCreateTenant = () => {
  if (!newTenantForm.value.name || !newTenantForm.value.email) return
  const newId = `TNT-${Math.floor(8300 + Math.random() * 700)}`
  const today = new Date().toISOString().slice(0, 10)

  const newTenant: EnterpriseTenant = {
    id: newId,
    name: newTenantForm.value.name,
    email: newTenantForm.value.email,
    balance: newTenantForm.value.balance,
    monthlyTokens: '0 Tokens',
    joinedAt: today,
    status: 'active',
    concurrency: newTenantForm.value.concurrency,
    rpmLimit: newTenantForm.value.rpmLimit,
    rate: 1.25,
    members: [],
    keys: []
  }

  tenants.value.unshift(newTenant)
  newTenantForm.value = { name: '', email: '', balance: 10000.00, concurrency: 32, rpmLimit: 1500 }
  isCreateTenantModalOpen.value = false
  triggerToast(`✓ 成功创建企业租户【${newTenant.name}】！`)
}

const submitAddMember = () => {
  if (!newMemberForm.value.name || !newMemberForm.value.email || !selectedTenant.value) return
  const newMemId = `MEM-${Math.floor(700 + Math.random() * 300)}`
  selectedTenant.value.members.push({
    id: newMemId,
    name: newMemberForm.value.name,
    email: newMemberForm.value.email,
    role: newMemberForm.value.role,
    allocatedQuota: newMemberForm.value.allocatedQuota,
    usedQuota: 0.00,
    status: 'active',
    lastActive: '刚刚'
  })
  isAddMemberModalOpen.value = false
  triggerToast(`✓ 成功为其添加成员【${newMemberForm.value.name}】！`)
}

const rechargeTenant = (t: EnterpriseTenant) => {
  t.balance += 5000.00
  triggerToast(`✓ 成功为租户【${t.name}】划拨 5000.00 元 Token 余额！`)
}

const toggleStatus = (t: EnterpriseTenant) => {
  t.status = t.status === 'active' ? 'disabled' : 'active'
  triggerToast(`✓ 租户【${t.name}】状态已更改为：${t.status === 'active' ? '正常运行' : '已停用'}`)
}
</script>

<template>
  <div class="agent-clients p-6 md:p-8 font-sans space-y-6 relative">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">代理 Portal 操作成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- 1. Header Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div>
        <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200/80">
          <span>🏢 FRS 2.10.5 代理商下级企业租户管理</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">企业租户管理中心</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          在此管理属于您专属代理下面的所有企业租户，点击可深度查看租户专属控制面板、员工成员及 API Key 配额。
        </p>
      </div>

      <button 
        @click="isCreateTenantModalOpen = true"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
      >
        <span>+ 开通新企业租户</span>
      </button>
    </div>

    <!-- 2. 企业租户主表格面板 -->
    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
          全量下级企业租户列表 ({{ filteredTenants.length }} 家)
        </div>

        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索租户名称、邮箱或 ID..." 
          class="w-full sm:w-64 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div class="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th class="px-5 py-3.5">租户 ID / 企业名称</th>
              <th class="px-5 py-3.5">管理员邮箱</th>
              <th class="px-5 py-3.5">账户余额 (balance)</th>
              <th class="px-5 py-3.5">月消耗 Tokens</th>
              <th class="px-5 py-3.5">成员规模</th>
              <th class="px-5 py-3.5">状态</th>
              <th class="px-5 py-3.5 text-right">租户控制面板与管控</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr v-for="t in filteredTenants" :key="t.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-5 py-4 font-sans">
                <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span class="text-blue-600 font-mono text-xs">🏢</span>
                  <span>{{ t.name }}</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ t.id }} · 开户时间: {{ t.joinedAt }}</div>
              </td>

              <td class="px-5 py-4 text-slate-600 font-sans">
                {{ t.email }}
              </td>

              <td class="px-5 py-4 font-bold text-slate-900 text-sm">
                ¥{{ t.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
              </td>

              <td class="px-5 py-4 font-bold text-blue-600">
                {{ t.monthlyTokens }}
              </td>

              <td class="px-5 py-4 font-sans">
                <span class="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-[11px]">
                  👥 {{ t.members.length }} 位成员
                </span>
              </td>

              <td class="px-5 py-4 font-sans whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                    t.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-rose-50 text-rose-700 border-rose-200/80'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', t.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                  <span>{{ t.status === 'active' ? '正常运行' : '已停用' }}</span>
                </span>
              </td>

              <td class="px-5 py-4 text-right font-sans whitespace-nowrap">
                <div class="inline-flex items-center justify-end space-x-2">
                  <button 
                    @click="openTenantDashboard(t)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
                  >
                    <span>📊</span>
                    <span>控制面板</span>
                  </button>

                  <button 
                    @click="rechargeTenant(t)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs border border-blue-200/60 transition-all shadow-2xs active:scale-95"
                  >
                    <span>⚡</span>
                    <span>划拨</span>
                  </button>

                  <button 
                    @click="toggleStatus(t)" 
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs border border-slate-200 transition-all shadow-2xs active:scale-95"
                  >
                    <span>{{ t.status === 'active' ? '🔒' : '🔓' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. 企业租户专属控制面板 Drawer / Modal (核心交互) -->
    <div v-if="isTenantDashboardOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-5xl w-full border border-slate-200/80 dark:border-dark-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <!-- Dashboard Header -->
        <div class="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-dark-700">
          <div>
            <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
              <span>🏢 企业租户专属控制面板 (Tenant Dashboard)</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {{ selectedTenant?.name }}
            </h2>
            <p class="text-xs text-slate-400 mt-1 font-mono">
              租户 ID: {{ selectedTenant?.id }} | 管理员: {{ selectedTenant?.email }} | 执行加价倍率: {{ selectedTenant?.rate }}x
            </p>
          </div>
          <button @click="isTenantDashboardOpen = false" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-sm">✕</button>
        </div>

        <!-- 4大核心数据卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">租户可用余额</div>
            <div class="text-2xl font-black text-emerald-600 mt-1">¥{{ selectedTenant?.balance.toFixed(2) }}</div>
            <button @click="rechargeTenant(selectedTenant!)" class="text-[10px] text-blue-600 font-bold mt-1 hover:underline">+ 代充划拨</button>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">本月消耗 Tokens</div>
            <div class="text-2xl font-black text-blue-600 mt-1">{{ selectedTenant?.monthlyTokens }}</div>
            <div class="text-[10px] text-slate-400 mt-1">日均 ~18 万 Tokens</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">租户成员规模</div>
            <div class="text-2xl font-black text-slate-900 mt-1">{{ selectedTenant?.members.length }} <span class="text-xs font-normal text-slate-400">人</span></div>
            <div class="text-[10px] text-emerald-600 font-bold mt-1">包含 1 位管理员</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <div class="text-[11px] text-slate-400 font-medium">并发 QPS / RPM</div>
            <div class="text-xl font-black text-slate-900 mt-1">{{ selectedTenant?.concurrency }} QPS</div>
            <div class="text-[10px] text-slate-400 mt-1">{{ selectedTenant?.rpmLimit }} RPM Cap</div>
          </div>
        </div>

        <!-- 控制面板 Tab -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button 
            @click="activeTab = 'members'"
            :class="['px-4 py-2 rounded-2xl font-bold text-xs transition-all', activeTab === 'members' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            👥 租户员工成员 ({{ selectedTenant?.members.length }})
          </button>
          <button 
            @click="activeTab = 'keys'"
            :class="['px-4 py-2 rounded-2xl font-bold text-xs transition-all', activeTab === 'keys' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
          >
            🔑 租户 API Key 列表 ({{ selectedTenant?.keys.length }})
          </button>
        </div>

        <!-- Tab 1: 租户成员列表 -->
        <div v-if="activeTab === 'members'" class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="text-xs font-bold text-slate-700">企业租户内部员工成员名册</div>
            <button @click="isAddMemberModalOpen = true" class="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500">
              + 为租户添加成员
            </button>
          </div>

          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">成员姓名</th>
                  <th class="px-4 py-3">工作邮箱</th>
                  <th class="px-4 py-3">租户内角色</th>
                  <th class="px-4 py-3">分配额度 / 已使用</th>
                  <th class="px-4 py-3">最近活跃</th>
                  <th class="px-4 py-3">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr v-for="m in selectedTenant?.members" :key="m.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3 font-sans font-bold text-slate-900">{{ m.name }}</td>
                  <td class="px-4 py-3 font-sans text-slate-600">{{ m.email }}</td>
                  <td class="px-4 py-3 font-sans">
                    <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', m.role === 'tenant_admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600']">
                      {{ m.role === 'tenant_admin' ? '租户管理员' : '普通员工' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-bold text-slate-900">
                    ¥{{ m.allocatedQuota.toFixed(2) }} (已用: ¥{{ m.usedQuota.toFixed(2) }})
                  </td>
                  <td class="px-4 py-3 text-slate-400 font-sans">{{ m.lastActive }}</td>
                  <td class="px-4 py-3 font-sans">
                    <span class="text-emerald-600 font-bold">✓ 正常</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 2: API Keys -->
        <div v-if="activeTab === 'keys'" class="space-y-3">
          <div class="text-xs font-bold text-slate-700">租户部署秘钥明细</div>
          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Key 名称</th>
                  <th class="px-4 py-3">Key 前缀</th>
                  <th class="px-4 py-3">授权模型白名单</th>
                  <th class="px-4 py-3">创建时间</th>
                  <th class="px-4 py-3">累计消耗</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr v-for="k in selectedTenant?.keys" :key="k.id" class="hover:bg-slate-50">
                  <td class="px-4 py-3 font-sans font-bold text-slate-900">{{ k.name }}</td>
                  <td class="px-4 py-3 font-bold text-blue-600">{{ k.keyPrefix }}</td>
                  <td class="px-4 py-3 font-sans text-slate-600">{{ k.models }}</td>
                  <td class="px-4 py-3 text-slate-400 font-sans">{{ k.createdAt }}</td>
                  <td class="px-4 py-3 font-bold text-emerald-600">¥{{ k.usedQuota.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button @click="isTenantDashboardOpen = false" class="px-5 py-2 bg-slate-900 text-white rounded-2xl font-bold text-xs">
            关闭面板
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: 开通新企业租户 -->
    <div v-if="isCreateTenantModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">+ 开通新企业租户</h3>
          <button @click="isCreateTenantModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">企业租户名称 <span class="text-red-500">*</span></label>
            <input v-model="newTenantForm.name" type="text" placeholder="例如: 联想 AI 研发中心" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700">管理员邮箱 <span class="text-red-500">*</span></label>
            <input v-model="newTenantForm.email" type="email" placeholder="例如: admin@lenovo-ai.com" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div class="space-y-1">
              <label class="font-bold text-slate-700">初始余额</label>
              <input v-model.number="newTenantForm.balance" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700">并发 (QPS)</label>
              <input v-model.number="newTenantForm.concurrency" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700">RPM</label>
              <input v-model.number="newTenantForm.rpmLimit" type="number" class="w-full p-2 bg-slate-50 border rounded-xl font-mono" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isCreateTenantModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitCreateTenant" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">确认创建</button>
        </div>
      </div>
    </div>

    <!-- Modal: 添加成员 -->
    <div v-if="isAddMemberModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">+ 添加成员到【{{ selectedTenant?.name }}】</h3>
          <button @click="isAddMemberModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">姓名</label>
            <input v-model="newMemberForm.name" type="text" placeholder="例如: 赵六" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-700">邮箱</label>
            <input v-model="newMemberForm.email" type="email" placeholder="zhaoliu@demo-corp.com" class="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-700">分配额度 (元)</label>
            <input v-model.number="newMemberForm.allocatedQuota" type="number" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isAddMemberModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitAddMember" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">添加成员</button>
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
