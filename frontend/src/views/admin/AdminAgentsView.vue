<script setup lang="ts">
/**
 * FRS V3.0 2.10 下游代理管理系统 (系统管理员控制端)
 * 苹果高级灰白配色，支持三级分层下级客户追溯 (代理商 -> 企业租户 -> 租户成员用户 / 直属个人用户) 及自主开户管控 DEMO (2.10.5)
 */
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// 选中的 Tab 标签
const activeTab = ref<'list' | 'audit' | 'commission'>('list')
const searchQuery = ref('')
const statusFilter = ref('')

// 模拟代理商列表数据 (对齐 sub2api User / AdminUser 数据结构)
const agentList = ref([
  {
    id: 1001,
    username: '华东区核心分销商 (CNF Cloud)',
    email: 'agent-east@cnfcloud.com',
    role: 'agent',
    level: '一级代理',
    balance: 125000.00,
    frozen_balance: 0.00,
    concurrency: 128,
    rpm_limit: 6000,
    status: 'active',
    pool: 'CNF 华东专属号池 A',
    group_rate: 1.25,
    usersCount: 142,
    aff_code: 'CNF-EAST-888',
    link: 'https://core.cnfcloud.com/register?aff=CNF-EAST-888',
    notes: '华东大区总代，拥有 128Key 专属号池物理隔离',
    created_at: '2026-01-15 10:00:00',
    last_active_at: '2026-08-04 14:20:10'
  },
  {
    id: 1002,
    username: '华南 AI 创新中心',
    email: 'sz-ai@southai.cn',
    role: 'agent',
    level: '一级代理',
    balance: 86400.50,
    frozen_balance: 0.00,
    concurrency: 64,
    rpm_limit: 3000,
    status: 'active',
    pool: '华南 VIP 专线号池',
    group_rate: 1.30,
    usersCount: 89,
    aff_code: 'SOUTH-AI-666',
    link: 'https://core.cnfcloud.com/register?aff=SOUTH-AI-666',
    notes: '华南大区深广核心代理，独占高速专线号池',
    created_at: '2026-02-10 11:30:00',
    last_active_at: '2026-08-04 13:45:22'
  },
  {
    id: 1003,
    username: '北京智算云科',
    email: 'contact@bj-cloud.com',
    role: 'agent',
    level: '一级代理',
    balance: 32000.00,
    frozen_balance: 0.00,
    concurrency: 32,
    rpm_limit: 1500,
    status: 'active',
    pool: '共享号池 Group-B',
    group_rate: 1.15,
    usersCount: 35,
    aff_code: 'BJ-CLOUD-101',
    link: 'https://core.cnfcloud.com/register?aff=BJ-CLOUD-101',
    notes: '华北区一级代理商，采用标准共享号池 Group-B',
    created_at: '2026-03-01 09:15:00',
    last_active_at: '2026-08-04 11:10:05'
  },
  {
    id: 1004,
    username: '成都大模型赋能中心',
    email: 'cd-llm@chengdu.gov.cn',
    role: 'agent',
    level: '一级代理',
    balance: 450.00,
    frozen_balance: 0.00,
    concurrency: 32,
    rpm_limit: 1500,
    status: 'active',
    pool: '西南大模型专属池',
    group_rate: 1.20,
    usersCount: 64,
    aff_code: 'CD-LLM-520',
    link: 'https://core.cnfcloud.com/register?aff=CD-LLM-520',
    notes: '西南大区政企加盟代理，当前账户余额较低需充值',
    created_at: '2026-04-12 15:40:00',
    last_active_at: '2026-08-04 10:05:44'
  }
])

// 租户成员数据类型定义 (三级结构: 代理商 -> 企业租户 -> 租户下属成员)
interface SubordinateMember {
  id: string
  name: string
  email: string
  role: 'tenant_admin' | 'tenant_user'
  allocatedQuota: number
  usedQuota: number
  status: 'active' | 'disabled'
}

interface SubordinateCustomer {
  id: string
  name: string
  email: string
  type: 'tenant' | 'direct_user'
  balance: number
  monthlyTokens: string
  rate: number
  status: 'active' | 'disabled'
  joinedAt: string
  expanded?: boolean
  members?: SubordinateMember[]
}

// 模拟代理商下属客户关系 Store (2.10.5 代理三级客户架构)
const subordinateCustomersMap = ref<Record<string, SubordinateCustomer[]>>({
  'CNF-EAST-888': [
    {
      id: 'TNT-8001',
      name: '字节跳动 AI 研发部',
      email: 'bytedance-ai@bytedance.com',
      type: 'tenant',
      balance: 45000.00,
      monthlyTokens: '1.2 亿 Tokens',
      rate: 1.25,
      status: 'active',
      joinedAt: '2026-02-01',
      expanded: true,
      members: [
        { id: 'MEM-101', name: '李四 (算法团队负责人)', email: 'lisi@bytedance.com', role: 'tenant_admin', allocatedQuota: 20000.00, usedQuota: 12400.00, status: 'active' },
        { id: 'MEM-102', name: '王五 (NLP 研发工程师)', email: 'wangwu@bytedance.com', role: 'tenant_user', allocatedQuota: 15000.00, usedQuota: 8900.00, status: 'active' },
        { id: 'MEM-103', name: '赵六 (视觉模型研究员)', email: 'zhaoliu@bytedance.com', role: 'tenant_user', allocatedQuota: 10000.00, usedQuota: 3200.00, status: 'active' }
      ]
    },
    {
      id: 'TNT-8002',
      name: '创世智能 算法团队',
      email: 'contact@creation-ai.cn',
      type: 'tenant',
      balance: 12800.00,
      monthlyTokens: '3500 万 Tokens',
      rate: 1.25,
      status: 'active',
      joinedAt: '2026-03-10',
      expanded: false,
      members: [
        { id: 'MEM-201', name: '钱七 (CTO)', email: 'qianqi@creation-ai.cn', role: 'tenant_admin', allocatedQuota: 12800.00, usedQuota: 6500.00, status: 'active' }
      ]
    },
    {
      id: 'USR-3011',
      name: '极客工作室 (张伟)',
      email: 'zhangwei@geek.io',
      type: 'direct_user',
      balance: 2500.00,
      monthlyTokens: '800 万 Tokens',
      rate: 1.25,
      status: 'active',
      joinedAt: '2026-04-15'
    },
    {
      id: 'TNT-8003',
      name: '灵动智造 AI Team',
      email: 'tech@lingdong.com',
      type: 'tenant',
      balance: 800.00,
      monthlyTokens: '120 万 Tokens',
      rate: 1.25,
      status: 'disabled',
      joinedAt: '2026-05-20',
      expanded: false,
      members: []
    }
  ],
  'SOUTH-AI-666': [
    {
      id: 'TNT-9001',
      name: '腾讯云合作项目组',
      email: 'tencent-cloud@tencent.com',
      type: 'tenant',
      balance: 68000.00,
      monthlyTokens: '2.1 亿 Tokens',
      rate: 1.30,
      status: 'active',
      joinedAt: '2026-02-15',
      expanded: true,
      members: [
        { id: 'MEM-301', name: '孙八 (高级架构师)', email: 'sunba@tencent.com', role: 'tenant_admin', allocatedQuota: 40000.00, usedQuota: 28000.00, status: 'active' }
      ]
    },
    {
      id: 'USR-4022',
      name: '羊城大模型开发者社区 (直属用户)',
      email: 'dev@gz-llm.org',
      type: 'direct_user',
      balance: 4200.00,
      monthlyTokens: '1500 万 Tokens',
      rate: 1.30,
      status: 'active',
      joinedAt: '2026-03-22'
    }
  ]
})

// 搜索与过滤后的代理商列表
const filteredAgents = computed(() => {
  return agentList.value.filter(a => {
    const matchSearch = a.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        a.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        a.aff_code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        a.id.toString().includes(searchQuery.value)
    const matchStatus = !statusFilter.value || a.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

// 模拟代理申请审核数据 (2.10.1)
const auditRequests = ref([
  { id: 'REQ-501', applicant: '杭州灵动科技', contact: '张经理 (138****9988)', expectVolume: '5000 万 Tokens/月', planModels: 'GPT-4o, Claude 3.5', time: '2026-08-04 10:15', status: '待审核' },
  { id: 'REQ-502', applicant: '广州智跃云端', contact: '李总 (186****1122)', expectVolume: '2 亿 Tokens/月', planModels: 'DeepSeek V3, Gemini', time: '2026-08-03 16:40', status: '待审核' },
  { id: 'REQ-503', applicant: '上海数聚智联', contact: '王主管 (139****3344)', expectVolume: '1000 万 Tokens/月', planModels: 'GPT-4o Mini', time: '2026-08-02 11:20', status: '已拒绝' }
])

// 模拟提现结算记录 (2.10.6)
const payoutRecords = ref([
  { id: 'PAY-801', agentName: '华东区核心分销商 (CNF Cloud)', amount: 12500.00, method: '支付宝 (pay@cnfcloud.com)', period: '2026年7月结算', applyTime: '2026-08-01 09:00', status: '待打款' },
  { id: 'PAY-802', agentName: '华南 AI 创新中心', amount: 6000.00, method: '公对公银行转账 (招商银行 6214****)', period: '2026年7月结算', applyTime: '2026-08-02 14:30', status: '待打款' },
  { id: 'PAY-803', agentName: '北京智算云科', amount: 3200.00, method: '微信支付 (139****3344)', period: '2026年6月结算', applyTime: '2026-07-01 10:00', status: '已打款' }
])

// 阶梯佣金规则配置 (2.10.6)
const commissionTiers = ref([
  { tier: '阶梯一', minTokens: '0', maxTokens: '5,000 万 Tokens', rate: '5%', bonus: '¥0' },
  { tier: '阶梯二', minTokens: '5,000 万 Tokens', maxTokens: '2 亿 Tokens', rate: '8%', bonus: '¥1,000' },
  { tier: '阶梯三', minTokens: '2 亿 Tokens', maxTokens: '无上限', rate: '12%', bonus: '¥5,000' }
])

// 编辑 Modal 控制
const isEditModalOpen = ref(false)
const selectedAgent = ref<any>(null)

const openEditModal = (agent: any) => {
  selectedAgent.value = { ...agent }
  isEditModalOpen.value = true
}

const saveAgentConfig = () => {
  const index = agentList.value.findIndex(a => a.id === selectedAgent.value.id)
  if (index !== -1) {
    agentList.value[index] = { ...selectedAgent.value }
  }
  isEditModalOpen.value = false
}

// 切换代理状态 (active / disabled)
const toggleAgentStatus = (agent: any) => {
  agent.status = agent.status === 'active' ? 'disabled' : 'active'
}

// 手动添加代理商 Modal 控制
const isAddModalOpen = ref(false)
const showAddToast = ref(false)
const addToastMessage = ref('')

const newAgentForm = ref({
  username: '',
  email: '',
  balance: 100000.00,
  concurrency: 64,
  rpm_limit: 3000,
  pool: 'CNF 华东专属号池 A',
  group_rate: 1.20,
  notes: ''
})

const submitAddAgent = () => {
  if (!newAgentForm.value.username || !newAgentForm.value.email) return
  const newId = 1000 + agentList.value.length + 1
  const prefix = newAgentForm.value.username.replace(/[^\w\u4e00-\u9fa5]/g, '').slice(0, 4).toUpperCase() || 'AGENT'
  const randomCode = `${prefix}-${Math.floor(100 + Math.random() * 900)}`
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19)
  
  const newAgent = {
    id: newId,
    username: newAgentForm.value.username,
    email: newAgentForm.value.email,
    role: 'agent' as const,
    level: '一级代理',
    balance: newAgentForm.value.balance,
    frozen_balance: 0.00,
    concurrency: newAgentForm.value.concurrency,
    rpm_limit: newAgentForm.value.rpm_limit,
    status: 'active' as const,
    pool: newAgentForm.value.pool,
    group_rate: newAgentForm.value.group_rate,
    usersCount: 0,
    aff_code: randomCode,
    link: `https://core.cnfcloud.com/register?aff=${randomCode}`,
    notes: newAgentForm.value.notes || '系统管理员手动创建一级代理商',
    created_at: nowStr,
    last_active_at: nowStr
  }
  
  agentList.value.unshift(newAgent)
  
  // 初始化下属客户列表空模板
  subordinateCustomersMap.value[randomCode] = [
    {
      id: `TNT-${Math.floor(8000 + Math.random() * 1000)}`,
      name: `${newAgentForm.value.username} 初始企业租户`,
      email: newAgentForm.value.email,
      type: 'tenant',
      balance: 5000.00,
      monthlyTokens: '1000 万 Tokens',
      rate: newAgentForm.value.group_rate,
      status: 'active',
      joinedAt: nowStr.slice(0, 10),
      expanded: false,
      members: []
    }
  ]

  newAgentForm.value = {
    username: '',
    email: '',
    balance: 100000.00,
    concurrency: 64,
    rpm_limit: 3000,
    pool: 'CNF 华东专属号池 A',
    group_rate: 1.20,
    notes: ''
  }
  isAddModalOpen.value = false
  
  addToastMessage.value = '成功开通一级代理商账号！下属三级租户/用户架构已就绪。'
  showAddToast.value = true
  setTimeout(() => showAddToast.value = false, 3500)
}

// 代理商下属客户管理 Modal (2.10.5 核心三级交互 DEMO)
const isSubordinateModalOpen = ref(false)
const targetAgentForSubordinates = ref<any>(null)
const subCustomerSearch = ref('')
const subCustomerType = ref<'all' | 'tenant' | 'direct_user'>('all')

// 新建客户/成员 Modal 控制
const isCreateCustomerModalOpen = ref(false)
const createCustomerType = ref<'tenant' | 'direct_user'>('tenant')
const newCustomerForm = ref({
  name: '',
  email: '',
  balance: 10000.00,
  concurrency: 32,
  rpm_limit: 1000,
  notes: ''
})

// 新建租户成员 Modal 控制
const isAddMemberModalOpen = ref(false)
const targetTenantForMember = ref<SubordinateCustomer | null>(null)
const newMemberForm = ref({
  name: '',
  email: '',
  role: 'tenant_user' as 'tenant_admin' | 'tenant_user',
  allocatedQuota: 2000.00
})

const openSubordinateModal = (agent: any) => {
  targetAgentForSubordinates.value = agent
  isSubordinateModalOpen.value = true
}

const currentSubordinates = computed(() => {
  if (!targetAgentForSubordinates.value) return []
  const list = subordinateCustomersMap.value[targetAgentForSubordinates.value.aff_code] || []
  return list.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(subCustomerSearch.value.toLowerCase()) ||
                        item.email.toLowerCase().includes(subCustomerSearch.value.toLowerCase()) ||
                        item.id.toLowerCase().includes(subCustomerSearch.value.toLowerCase())
    const matchType = subCustomerType.value === 'all' || item.type === subCustomerType.value
    return matchSearch && matchType
  })
})

// 展开/收起企业租户成员
const toggleTenantExpand = (cust: SubordinateCustomer) => {
  if (cust.type === 'tenant') {
    cust.expanded = !cust.expanded
  }
}

// 管理员/代理商提交【创建企业租户 / 直属个人用户】
const submitCreateCustomer = () => {
  if (!newCustomerForm.value.name || !newCustomerForm.value.email || !targetAgentForSubordinates.value) return
  const affCode = targetAgentForSubordinates.value.aff_code
  const prefix = createCustomerType.value === 'tenant' ? 'TNT' : 'USR'
  const newId = `${prefix}-${Math.floor(8100 + Math.random() * 900)}`
  const today = new Date().toISOString().slice(0, 10)

  const newCust: SubordinateCustomer = {
    id: newId,
    name: newCustomerForm.value.name,
    email: newCustomerForm.value.email,
    type: createCustomerType.value,
    balance: newCustomerForm.value.balance,
    monthlyTokens: '0 Tokens',
    rate: targetAgentForSubordinates.value.group_rate,
    status: 'active',
    joinedAt: today,
    expanded: createCustomerType.value === 'tenant',
    members: createCustomerType.value === 'tenant' ? [] : undefined
  }

  if (!subordinateCustomersMap.value[affCode]) {
    subordinateCustomersMap.value[affCode] = []
  }
  subordinateCustomersMap.value[affCode].unshift(newCust)
  targetAgentForSubordinates.value.usersCount++

  newCustomerForm.value = { name: '', email: '', balance: 10000.00, concurrency: 32, rpm_limit: 1000, notes: '' }
  isCreateCustomerModalOpen.value = false

  addToastMessage.value = `✓ 成功在代理【${targetAgentForSubordinates.value.username}】下创建了${createCustomerType.value === 'tenant' ? '🏢 企业租户' : '👤 直属个人用户'}！`
  showAddToast.value = true
  setTimeout(() => showAddToast.value = false, 3500)
}

// 展开【添加租户成员 Modal】
const openAddMemberModal = (tenantCust: SubordinateCustomer) => {
  targetTenantForMember.value = tenantCust
  newMemberForm.value = { name: '', email: '', role: 'tenant_user', allocatedQuota: 2000.00 }
  isAddMemberModalOpen.value = true
}

// 提交【添加租户成员】
const submitAddMember = () => {
  if (!newMemberForm.value.name || !newMemberForm.value.email || !targetTenantForMember.value) return
  if (!targetTenantForMember.value.members) {
    targetTenantForMember.value.members = []
  }
  const newMemId = `MEM-${Math.floor(500 + Math.random() * 500)}`
  targetTenantForMember.value.members.push({
    id: newMemId,
    name: newMemberForm.value.name,
    email: newMemberForm.value.email,
    role: newMemberForm.value.role,
    allocatedQuota: newMemberForm.value.allocatedQuota,
    usedQuota: 0.00,
    status: 'active'
  })

  targetTenantForMember.value.expanded = true
  isAddMemberModalOpen.value = false

  addToastMessage.value = `✓ 成功为企业租户【${targetTenantForMember.value.name}】添加成员【${newMemberForm.value.name}】！`
  showAddToast.value = true
  setTimeout(() => showAddToast.value = false, 3500)
}

// 划拨额度
const rechargeSubordinate = (cust: SubordinateCustomer) => {
  cust.balance += 5000.00
  addToastMessage.value = `✓ 已成功向下级客户【${cust.name}】划拨 5000.00 元 Token 额度！`
  showAddToast.value = true
  setTimeout(() => showAddToast.value = false, 3000)
}

// 冻结/解封账号
const toggleSubordinateStatus = (cust: SubordinateCustomer) => {
  cust.status = cust.status === 'active' ? 'disabled' : 'active'
  addToastMessage.value = `✓ 下级客户【${cust.name}】账号状态已更新为：${cust.status === 'active' ? '正常运行' : '已冻结停用'}`
  showAddToast.value = true
  setTimeout(() => showAddToast.value = false, 3000)
}

// 审核操作
const approveRequest = (req: any) => {
  req.status = '已通过'
}
const rejectRequest = (req: any) => {
  req.status = '已拒绝'
}

// 提现操作
const markPaid = (payout: any) => {
  payout.status = '已打款'
}
</script>

<template>
  <AppLayout>
    <div class="admin-agents-view min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 p-6 md:p-8 space-y-8 font-sans selection:bg-blue-100 relative">
      
      <!-- 成功通知 Notification Toast -->
      <div v-if="showAddToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
        <span class="text-emerald-400 font-bold text-base">✓</span>
        <div class="text-xs">
          <div class="font-bold text-white">操作执行成功</div>
          <div class="text-slate-400">{{ addToastMessage }}</div>
        </div>
      </div>

      <!-- 1. Header Banner (苹果高级灰白卡片风格) -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-dark-700 pb-4">
          <div>
            <div class="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold border border-amber-200/80 dark:border-amber-900/60">
              <span>💎 FRS V3.0 2.10 下游代理管理系统 (三级客户架构)</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2">渠道代理商管理中心</h1>
            <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              支持代理商 -> 🏢 企业租户 -> 👥 租户成员 及 👤 直属个人用户 三级层级追溯、自主开户与额度划拨。
            </p>
          </div>

          <div class="flex items-center space-x-2">
            <router-link to="/demo/agent" class="px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-sm flex items-center gap-1.5">
              <span>🤝 一键进入代理商 Portal 体验端</span>
            </router-link>
          </div>
        </div>

        <!-- 2. 四大核心指标面板卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div class="bg-slate-50 dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-700">
            <div class="text-[11px] text-slate-400 font-medium">一级代理商总数</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ agentList.length }} <span class="text-xs font-normal text-slate-400">家</span></div>
            <div class="text-[10px] text-emerald-600 font-bold mt-0.5">直属平台一级加盟 (Role: agent)</div>
          </div>

          <div class="bg-slate-50 dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-700">
            <div class="text-[11px] text-slate-400 font-medium">代理招募下级客户总数 (2.10.5)</div>
            <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">330 <span class="text-xs font-normal text-slate-400">位企业/用户</span></div>
            <div class="text-[10px] text-blue-500 font-bold mt-0.5">包含 48 家企业租户</div>
          </div>

          <div class="bg-slate-50 dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-700">
            <div class="text-[11px] text-slate-400 font-medium">本月代理分销总额</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">¥142,800.00</div>
            <div class="text-[10px] text-blue-500 font-bold mt-0.5">环比增长 +24.5%</div>
          </div>

          <div class="bg-slate-50 dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/60 dark:border-dark-700">
            <div class="text-[11px] text-slate-400 font-medium">待结算提现申请 (2.10.6)</div>
            <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">¥18,500.00</div>
            <div class="text-[10px] text-indigo-500 font-bold mt-0.5">2 笔申请等待打款</div>
          </div>
        </div>
      </div>

      <!-- 3. 功能 Tab 选项卡 (苹果灰白卡片风格) -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-dark-700 pb-2">
        <button 
          @click="activeTab = 'list'"
          :class="['px-5 py-2.5 rounded-2xl font-bold text-xs transition-all', activeTab === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-100']"
        >
          📋 代理商账号管理 & 三级客户架构 (2.10.1 - 2.10.5)
        </button>
        <button 
          @click="activeTab = 'audit'"
          :class="['px-5 py-2.5 rounded-2xl font-bold text-xs transition-all relative', activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-100']"
        >
          <span>⏳ 代理加盟资质在线审核 (2.10.1)</span>
          <span class="ml-1.5 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-mono">2</span>
        </button>
        <button 
          @click="activeTab = 'commission'"
          :class="['px-5 py-2.5 rounded-2xl font-bold text-xs transition-all', activeTab === 'commission' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 hover:bg-slate-100']"
        >
          💰 阶梯佣金配置与提现结算 (2.10.6)
        </button>
      </div>

      <!-- Tab 1: 代理商列表 & 下级客户追踪管理 -->
      <div v-if="activeTab === 'list'" class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden space-y-4 p-6">
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-3 border-b border-slate-100 dark:border-dark-700">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">一级代理商账号全量矩阵</h3>
            <p class="text-xs text-slate-400 mt-0.5">点击“下级客户”可展开代理商下属企业租户、租户成员及直属个人用户。</p>
          </div>

          <div class="flex items-center gap-2">
            <!-- 搜索框 -->
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索代理名称、邮箱或邀请码..." 
              class="px-3.5 py-1.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500 min-w-[200px]"
            />
            
            <button @click="isAddModalOpen = true" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1 whitespace-nowrap">
              <span>+ 手动创建代理商账号</span>
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-dark-700">
              <tr>
                <th class="px-4 py-3">ID / 代理商名称 (username)</th>
                <th class="px-4 py-3">登录邮箱 (email)</th>
                <th class="px-4 py-3">账户余额 (balance)</th>
                <th class="px-4 py-3">绑定专属号池 (2.10.2)</th>
                <th class="px-4 py-3">专属加价 (2.10.3)</th>
                <th class="px-4 py-3">下属招募客户数 (2.10.5)</th>
                <th class="px-4 py-3">推广邀请码 (aff_code)</th>
                <th class="px-4 py-3">状态</th>
                <th class="px-4 py-3 text-right">代理管理与下级客户管控</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700 font-mono">
              <tr v-for="agent in filteredAgents" :key="agent.id" class="hover:bg-slate-50/80 dark:hover:bg-dark-900/50 transition-colors">
                <td class="px-4 py-3 font-sans">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span class="text-xs text-slate-400 font-mono">#{{ agent.id }}</span>
                    <span>{{ agent.username }}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono truncate max-w-xs" :title="agent.notes">{{ agent.notes }}</div>
                </td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {{ agent.email }}
                </td>
                <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">
                  <span :class="agent.balance < 1000 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'">
                    ¥{{ agent.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
                  </span>
                </td>
                <td class="px-4 py-3 font-sans">
                  <span class="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold border border-blue-100">
                    ⚡ {{ agent.pool }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="font-bold text-slate-900 dark:text-white">{{ agent.group_rate.toFixed(2) }}x</span>
                </td>
                <td class="px-4 py-3 font-sans">
                  <button 
                    @click="openSubordinateModal(agent)"
                    class="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center gap-1"
                  >
                    <span>👥 {{ agent.usersCount }} 位客户</span>
                    <span class="text-[10px] text-amber-500">→</span>
                  </button>
                </td>
                <td class="px-4 py-3 font-sans">
                  <code class="px-2 py-0.5 bg-slate-100 dark:bg-dark-900 rounded text-[11px] text-blue-600 dark:text-blue-400 font-mono font-bold">{{ agent.aff_code }}</code>
                </td>
                <td class="px-4 py-3 font-sans">
                  <span 
                    :class="[
                      'px-2.5 py-0.5 rounded-lg text-[10px] font-bold border',
                      agent.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'
                    ]"
                  >
                    {{ agent.status === 'active' ? '正常' : '已禁用' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2 font-sans">
                  <button @click="openSubordinateModal(agent)" class="text-amber-600 hover:text-amber-800 font-bold">👥 下级客户 (2.10.5)</button>
                  <button @click="openEditModal(agent)" class="text-blue-600 hover:text-blue-800 font-bold">配置号池/倍率</button>
                  <button @click="toggleAgentStatus(agent)" class="text-slate-400 hover:text-slate-600 font-bold">
                    {{ agent.status === 'active' ? '停用' : '启用' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: 代理加盟资质在线审核 -->
      <div v-if="activeTab === 'audit'" class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden p-6 space-y-4">
        <div class="pb-3 border-b border-slate-100 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">一级代理加盟资质申请审核</h3>
          <p class="text-xs text-slate-400 mt-0.5">审核外部企业或机构的加盟代理申请，通过后自动创建 sub2api 代理账号并配发专属邀请码。</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-dark-700">
              <tr>
                <th class="px-4 py-3">申请编号</th>
                <th class="px-4 py-3">申请企业 / 机构</th>
                <th class="px-4 py-3">联系人 / 电话</th>
                <th class="px-4 py-3">预计月用量规模</th>
                <th class="px-4 py-3">拟分销模型</th>
                <th class="px-4 py-3">申请时间</th>
                <th class="px-4 py-3">状态</th>
                <th class="px-4 py-3 text-right">资质审核操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700">
              <tr v-for="req in auditRequests" :key="req.id" class="hover:bg-slate-50/80 dark:hover:bg-dark-900/50">
                <td class="px-4 py-3 font-mono font-bold">{{ req.id }}</td>
                <td class="px-4 py-3 font-bold text-slate-900 dark:text-white">{{ req.applicant }}</td>
                <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ req.contact }}</td>
                <td class="px-4 py-3 font-mono text-blue-600 font-bold">{{ req.expectVolume }}</td>
                <td class="px-4 py-3 text-slate-500">{{ req.planModels }}</td>
                <td class="px-4 py-3 font-mono text-slate-400">{{ req.time }}</td>
                <td class="px-4 py-3">
                  <span 
                    :class="[
                      'px-2.5 py-0.5 rounded-lg text-[10px] font-bold border',
                      req.status === '待审核' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      req.status === '已通过' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500'
                    ]"
                  >
                    {{ req.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <template v-if="req.status === '待审核'">
                    <button @click="approveRequest(req)" class="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors">
                      ✓ 批准一级代理
                    </button>
                    <button @click="rejectRequest(req)" class="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                      ✕ 驳回
                    </button>
                  </template>
                  <span v-else class="text-slate-400 italic">已完成</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: 阶梯佣金规则与提现审核 -->
      <div v-if="activeTab === 'commission'" class="space-y-6">
        <!-- 阶梯佣金规则设置面板 -->
        <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-dark-700">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">代理商阶梯销售佣金规则 (2.10.6)</h3>
              <p class="text-xs text-slate-400 mt-0.5">按代理商月分销消耗区间自动算分，阶梯越高返佣比例越丰厚。</p>
            </div>
            <button class="px-3.5 py-1.5 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
              + 添加阶梯规则
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="t in commissionTiers" :key="t.tier" class="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-200/60 dark:border-dark-700 space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-900 dark:text-white">{{ t.tier }}</span>
                <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-mono font-bold">{{ t.rate }} 返佣</span>
              </div>
              <div class="text-xs text-slate-500 font-mono">
                区间: {{ t.minTokens }} ~ {{ t.maxTokens }}
              </div>
              <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                额外大额目标奖励: {{ t.bonus }}
              </div>
            </div>
          </div>
        </div>

        <!-- 提现申请审核与对账表 -->
        <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
          <div class="pb-3 border-b border-slate-100 dark:border-dark-700">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">代理商提现申请审核表 (2.10.6)</h3>
            <p class="text-xs text-slate-400 mt-0.5">代理商在 Portal 发起的提现申请，在此在线审核并确认线下打款。</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-50 dark:bg-dark-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-dark-700">
                <tr>
                  <th class="px-4 py-3">单号</th>
                  <th class="px-4 py-3">申请代理商</th>
                  <th class="px-4 py-3">结算周期</th>
                  <th class="px-4 py-3">提现金额</th>
                  <th class="px-4 py-3">提现打款方式</th>
                  <th class="px-4 py-3">申请时间</th>
                  <th class="px-4 py-3">状态</th>
                  <th class="px-4 py-3 text-right">审核与确认打款</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-dark-700 font-mono">
                <tr v-for="payout in payoutRecords" :key="payout.id" class="hover:bg-slate-50/80 dark:hover:bg-dark-900/50">
                  <td class="px-4 py-3 font-bold">{{ payout.id }}</td>
                  <td class="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">{{ payout.agentName }}</td>
                  <td class="px-4 py-3 font-sans text-slate-500">{{ payout.period }}</td>
                  <td class="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">¥{{ payout.amount.toFixed(2) }}</td>
                  <td class="px-4 py-3 font-sans text-slate-600 dark:text-slate-300">{{ payout.method }}</td>
                  <td class="px-4 py-3 text-slate-400">{{ payout.applyTime }}</td>
                  <td class="px-4 py-3 font-sans">
                    <span 
                      :class="[
                        'px-2.5 py-0.5 rounded-lg text-[10px] font-bold border',
                        payout.status === '待打款' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      ]"
                    >
                      {{ payout.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right font-sans">
                    <button 
                      v-if="payout.status === '待打款'"
                      @click="markPaid(payout)"
                      class="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-sm"
                    >
                      ✓ 确认线下打款
                    </button>
                    <span v-else class="text-slate-400 italic">打款成功</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal 1: 配置专属号池与溢价倍率 (对齐 sub2api 属性) -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            ⚙️ 配置代理商：{{ selectedAgent?.username }}
          </h3>
          <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <!-- 账户余额划拨 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">账户余额划拨 (balance)</label>
            <input v-model.number="selectedAgent.balance" type="number" step="1000" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none font-mono" />
          </div>

          <!-- 并发与 RPM 限制 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">并发限制 (concurrency)</label>
              <input v-model.number="selectedAgent.concurrency" type="number" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">RPM 限制 (rpm_limit)</label>
              <input v-model.number="selectedAgent.rpm_limit" type="number" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none font-mono" />
            </div>
          </div>

          <!-- 划拨专属号池 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">划拨专属号池 (allowed_groups)</label>
            <select v-model="selectedAgent.pool" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none">
              <option value="CNF 华东专属号池 A">CNF 华东专属号池 A (128 个 Key 物理隔离)</option>
              <option value="华南 VIP 专线号池">华南 VIP 专线号池 (64 个 高速 Key)</option>
              <option value="西南大模型专属池">西南大模型专属池 (32 个 Key)</option>
              <option value="共享号池 Group-B">共享号池 Group-B (共享隔离)</option>
            </select>
          </div>

          <!-- 专属加价倍率 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">专属溢价加价倍率 (group_rate)</label>
            <input v-model.number="selectedAgent.group_rate" type="number" step="0.05" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none font-mono" />
          </div>

          <!-- 管理员备注 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">管理员备注 (notes)</label>
            <input v-model="selectedAgent.notes" type="text" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none" />
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isEditModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            取消
          </button>
          <button @click="saveAgentConfig" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors">
            保存代理商配置
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: 手动添加代理商 (对齐 sub2api User 架构 DEMO) -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>+ 创建一级代理商账号 (sub2api User 格式)</span>
          </h3>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <!-- 代理商用户名 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">代理商用户名 (username) <span class="text-red-500">*</span></label>
            <input 
              v-model="newAgentForm.username" 
              type="text" 
              placeholder="例如: 杭州云启 AI 科技" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <!-- 登录邮箱 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">登录邮箱 (email) <span class="text-red-500">*</span></label>
            <input 
              v-model="newAgentForm.email" 
              type="email" 
              placeholder="例如: contact@yunqi-ai.com" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">初始余额 (balance)</label>
              <input v-model.number="newAgentForm.balance" type="number" step="1000" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">并发 (concurrency)</label>
              <input v-model.number="newAgentForm.concurrency" type="number" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">RPM (rpm_limit)</label>
              <input v-model.number="newAgentForm.rpm_limit" type="number" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
          </div>

          <!-- 划拨专属号池 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">划拨专属号池 (allowed_groups)</label>
            <select v-model="newAgentForm.pool" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none">
              <option value="CNF 华东专属号池 A">CNF 华东专属号池 A (128 Key)</option>
              <option value="华南 VIP 专线号池">华南 VIP 专线号池 (64 Key)</option>
              <option value="西南大模型专属池">西南大模型专属池 (32 Key)</option>
              <option value="共享号池 Group-B">共享号池 Group-B</option>
            </select>
          </div>

          <!-- 初始加价倍率与备注 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">初始溢价倍率 (group_rate)</label>
              <input v-model.number="newAgentForm.group_rate" type="number" step="0.05" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">备注说明 (notes)</label>
              <input v-model="newAgentForm.notes" type="text" placeholder="例如: 浙江大区加盟商" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs" />
            </div>
          </div>

          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-[11px] text-blue-700 dark:text-blue-300">
            💡 创建后系统将自动写入 `role: 'agent'`，并自动生成专属推广邀请码（如 `YUNQI-888`）及分销链接。
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isAddModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            取消
          </button>
          <button 
            @click="submitAddAgent" 
            :disabled="!newAgentForm.username || !newAgentForm.email"
            :class="['px-4 py-2 rounded-xl font-bold text-xs transition-colors', (!newAgentForm.username || !newAgentForm.email) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500']"
          >
            确认添加一级代理商账号
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 3: 管理员管理代理商下属三级客户 (代理商 -> 企业租户 -> 租户成员 / 直属个人用户) (2.10.5 DEMO 核心交互) -->
    <div v-if="isSubordinateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-5xl w-full border border-slate-200/80 dark:border-dark-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div class="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-dark-700">
          <div>
            <div class="inline-flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold border border-amber-200/80">
              <span>👥 FRS 2.10.5 代理三级客户追溯 & 管控</span>
            </div>
            <h3 class="text-xl font-black text-slate-900 dark:text-white mt-2">
              代理商【{{ targetAgentForSubordinates?.username }}】下属三级客户全量追踪
            </h3>
            <p class="text-xs text-slate-400 mt-1 font-mono">
              绑定邀请码: <code class="px-2 py-0.5 bg-slate-100 dark:bg-dark-900 rounded font-bold text-blue-600 dark:text-blue-400">{{ targetAgentForSubordinates?.aff_code }}</code> | 所属专属号池: <span class="font-bold text-slate-700 dark:text-slate-300">{{ targetAgentForSubordinates?.pool }}</span>
            </p>
          </div>
          <button @click="isSubordinateModalOpen = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center text-sm font-bold transition-all">✕</button>
        </div>

        <!-- 筛选与建仓操作栏 -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex items-center gap-2 text-xs w-full sm:w-auto">
            <button 
              @click="subCustomerType = 'all'"
              :class="['px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap', subCustomerType === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300 hover:bg-slate-200']"
            >
              全部客户 ({{ currentSubordinates.length }})
            </button>
            <button 
              @click="subCustomerType = 'tenant'"
              :class="['px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap', subCustomerType === 'tenant' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300 hover:bg-slate-200']"
            >
              🏢 企业租户
            </button>
            <button 
              @click="subCustomerType = 'direct_user'"
              :class="['px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap', subCustomerType === 'direct_user' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 dark:bg-dark-700 dark:text-slate-300 hover:bg-slate-200']"
            >
              👤 直属个人用户
            </button>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input 
              v-model="subCustomerSearch"
              type="text" 
              placeholder="搜索下级客户/成员..." 
              class="px-3.5 py-1.5 bg-slate-50 dark:bg-dark-900 border border-slate-200/80 dark:border-dark-700 rounded-2xl text-xs outline-none focus:border-blue-500 focus:bg-white transition-all w-full sm:w-48"
            />
            
            <button 
              @click="createCustomerType = 'tenant'; isCreateCustomerModalOpen = true"
              class="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs whitespace-nowrap"
            >
              + 创建企业租户
            </button>
            <button 
              @click="createCustomerType = 'direct_user'; isCreateCustomerModalOpen = true"
              class="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-2xs whitespace-nowrap"
            >
              + 创建直属用户
            </button>
          </div>
        </div>

        <!-- 下级客户与租户成员三级树状表格 -->
        <div class="overflow-x-auto border border-slate-200/80 dark:border-dark-700 rounded-3xl shadow-sm">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-dark-700">
              <tr>
                <th class="px-5 py-3.5">客户/成员 ID & 名称</th>
                <th class="px-5 py-3.5">客户架构类型</th>
                <th class="px-5 py-3.5">账户余额 / 成员额度</th>
                <th class="px-5 py-3.5">月消耗 Tokens</th>
                <th class="px-5 py-3.5">执行加价倍率</th>
                <th class="px-5 py-3.5">状态</th>
                <th class="px-5 py-3.5 text-right">三级层级管控操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700 font-mono">
              <template v-for="cust in currentSubordinates" :key="cust.id">
                <!-- 顶级客户行 (企业租户 / 直属个人用户) -->
                <tr class="hover:bg-slate-50/80 dark:hover:bg-dark-900/50 transition-colors">
                  <td class="px-5 py-4 font-sans">
                    <div class="flex items-center space-x-2">
                      <button 
                        v-if="cust.type === 'tenant'" 
                        @click="toggleTenantExpand(cust)"
                        class="w-5 h-5 rounded-md bg-slate-100 dark:bg-dark-700 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                      >
                        {{ cust.expanded ? '▼' : '►' }}
                      </button>
                      <div>
                        <div class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>{{ cust.name }}</span>
                          <span v-if="cust.type === 'tenant'" class="text-[10px] text-blue-600 font-mono bg-blue-50 px-1.5 py-0.2 rounded font-normal">({{ cust.members?.length || 0 }} 成员)</span>
                        </div>
                        <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ cust.id }} · {{ cust.email }}</div>
                      </div>
                    </div>
                  </td>

                  <td class="px-5 py-4 font-sans whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                        cust.type === 'tenant' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/60'
                      ]"
                    >
                      {{ cust.type === 'tenant' ? '🏢 企业租户' : '👤 直属个人用户' }}
                    </span>
                  </td>

                  <td class="px-5 py-4 font-bold text-slate-900 dark:text-white text-sm">
                    ¥{{ cust.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
                  </td>

                  <td class="px-5 py-4 font-bold text-blue-600 dark:text-blue-400">
                    {{ cust.monthlyTokens }}
                  </td>

                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="font-bold text-slate-900 dark:text-white">{{ cust.rate.toFixed(2) }}x</div>
                    <div class="text-[10px] text-slate-400 font-sans">代理溢价倍率</div>
                  </td>

                  <td class="px-5 py-4 font-sans whitespace-nowrap">
                    <span 
                      :class="[
                        'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                        cust.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60'
                      ]"
                    >
                      <span :class="['w-1.5 h-1.5 rounded-full', cust.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500']"></span>
                      <span>{{ cust.status === 'active' ? '正常运行' : '已冻结管控' }}</span>
                    </span>
                  </td>

                  <td class="px-5 py-4 text-right font-sans whitespace-nowrap">
                    <div class="inline-flex items-center justify-end space-x-2">
                      <button 
                        v-if="cust.type === 'tenant'"
                        @click="openAddMemberModal(cust)" 
                        class="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs border border-amber-200/80 transition-all shadow-2xs active:scale-95"
                      >
                        <span>+ 成员</span>
                      </button>

                      <button 
                        @click="rechargeSubordinate(cust)" 
                        class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:hover:bg-blue-900 dark:text-blue-300 font-bold text-xs border border-blue-200/60 transition-all shadow-2xs active:scale-95"
                      >
                        <span>⚡</span>
                        <span>划拨</span>
                      </button>

                      <button 
                        @click="toggleSubordinateStatus(cust)" 
                        :class="[
                          'inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all shadow-2xs active:scale-95',
                          cust.status === 'active' 
                            ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 dark:bg-dark-700 dark:text-slate-300 border-slate-200 dark:border-dark-600' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200'
                        ]"
                      >
                        <span>{{ cust.status === 'active' ? '🔒' : '🔓' }}</span>
                        <span>{{ cust.status === 'active' ? '冻结' : '解封' }}</span>
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- 企业租户下属成员行 (第三级展开层级) -->
                <template v-if="cust.type === 'tenant' && cust.expanded">
                  <tr v-for="mem in cust.members" :key="mem.id" class="bg-slate-50/60 dark:bg-dark-900/40 hover:bg-blue-50/40 transition-colors">
                    <td class="pl-12 py-3 font-sans">
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-300">└─</span>
                        <div>
                          <div class="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <span>👤 {{ mem.name }}</span>
                            <span :class="['text-[9px] px-1.5 py-0.2 rounded font-mono', mem.role === 'tenant_admin' ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-200 text-slate-600']">
                              {{ mem.role === 'tenant_admin' ? '租户管理员' : '普通成员' }}
                            </span>
                          </div>
                          <div class="text-[10px] text-slate-400 font-mono">{{ mem.id }} · {{ mem.email }}</div>
                        </div>
                      </div>
                    </td>

                    <td class="px-5 py-3 font-sans text-slate-400 text-[11px]">
                      租户下属成员
                    </td>

                    <td class="px-5 py-3 font-bold text-slate-700 dark:text-slate-300 text-xs font-mono">
                      配额: ¥{{ mem.allocatedQuota.toFixed(2) }} (已用: ¥{{ mem.usedQuota.toFixed(2) }})
                    </td>

                    <td class="px-5 py-3 text-slate-400 text-xs font-mono">
                      继承租户资源
                    </td>

                    <td class="px-5 py-3 text-slate-400 text-xs font-mono">
                      {{ cust.rate.toFixed(2) }}x (继承)
                    </td>

                    <td class="px-5 py-3 font-sans whitespace-nowrap">
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold">
                        正常活跃
                      </span>
                    </td>

                    <td class="px-5 py-3 text-right font-sans whitespace-nowrap">
                      <span class="text-slate-400 text-[11px] italic">由企业租户【{{ cust.name }}】独立管理</span>
                    </td>
                  </tr>

                  <tr v-if="!cust.members || cust.members.length === 0" class="bg-slate-50/40 dark:bg-dark-900/30">
                    <td colspan="7" class="pl-12 py-3 text-slate-400 text-xs italic">
                      └─ 该企业租户下暂无成员，点击“+ 成员”即可为其添加子账号
                    </td>
                  </tr>
                </template>
              </template>

              <tr v-if="currentSubordinates.length === 0">
                <td colspan="7" class="text-center py-10 text-slate-400 font-sans italic">
                  暂无匹配的下级客户记录
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-between items-center pt-2">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <span>💡</span>
            <span>管理员在此具备跨代理数据的直接代充与安全管控最高特权。</span>
          </div>
          <button @click="isSubordinateModalOpen = false" class="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-colors shadow-sm">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: 创建下级客户 (企业租户 / 直属个人用户) -->
    <div v-if="isCreateCustomerModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>+ 创建下级{{ createCustomerType === 'tenant' ? '🏢 企业租户' : '👤 直属个人用户' }}</span>
          </h3>
          <button @click="isCreateCustomerModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">客户名称 (username) <span class="text-red-500">*</span></label>
            <input 
              v-model="newCustomerForm.name" 
              type="text" 
              :placeholder="createCustomerType === 'tenant' ? '例如: 联想 AI 研发中心' : '例如: 独立开发者 李雷'" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">管理员 / 用户邮箱 (email) <span class="text-red-500">*</span></label>
            <input 
              v-model="newCustomerForm.email" 
              type="email" 
              placeholder="例如: admin@lenovo-ai.com" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">初始余额 (balance)</label>
              <input v-model.number="newCustomerForm.balance" type="number" step="1000" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">并发 (concurrency)</label>
              <input v-model.number="newCustomerForm.concurrency" type="number" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">RPM cap</label>
              <input v-model.number="newCustomerForm.rpm_limit" type="number" class="w-full p-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isCreateCustomerModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            取消
          </button>
          <button 
            @click="submitCreateCustomer" 
            :disabled="!newCustomerForm.name || !newCustomerForm.email"
            :class="['px-4 py-2 rounded-xl font-bold text-xs transition-colors', (!newCustomerForm.name || !newCustomerForm.email) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500']"
          >
            确认创建客户
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 5: 为企业租户添加下属成员用户 -->
    <div v-if="isAddMemberModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            + 为企业租户【{{ targetTenantForMember?.name }}】添加成员
          </h3>
          <button @click="isAddMemberModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">成员姓名 <span class="text-red-500">*</span></label>
            <input v-model="newMemberForm.name" type="text" placeholder="例如: 孙八" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">成员工作邮箱 <span class="text-red-500">*</span></label>
            <input v-model="newMemberForm.email" type="email" placeholder="例如: sunba@company.com" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">成员角色</label>
            <select v-model="newMemberForm.role" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none">
              <option value="tenant_admin">租户管理员 (Tenant Admin)</option>
              <option value="tenant_user">普通成员 (Tenant User)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">租户内部分配额度 (元)</label>
            <input v-model.number="newMemberForm.allocatedQuota" type="number" step="500" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono outline-none" />
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isAddMemberModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            取消
          </button>
          <button 
            @click="submitAddMember" 
            :disabled="!newMemberForm.name || !newMemberForm.email"
            :class="['px-4 py-2 rounded-xl font-bold text-xs transition-colors', (!newMemberForm.name || !newMemberForm.email) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500']"
          >
            添加成员
          </button>
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
