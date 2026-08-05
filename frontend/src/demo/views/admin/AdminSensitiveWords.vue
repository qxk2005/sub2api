<script setup lang="ts">
/**
 * 2.5.1 安全敏感词护栏 DEMO 展示页
 * 平台管理员视角 - 敏感词库管理、双向拦截配置、审计日志
 * 苹果高级灰白配色
 */
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// ============ 敏感词护栏总开关 ============
const isEnabled = ref(true)
const inputFilterEnabled = ref(true)
const outputFilterEnabled = ref(true)
const strictMode = ref(false) // 严格模式：命中即阻断；非严格：替换为 ***

// ============ 词库数据 ============
interface WordRule {
  id: number
  word: string
  category: string
  level: '高危' | '中危' | '低危'
  action: '阻断请求' | '替换脱敏' | '仅记录'
  source: '网信办标准库' | '自定义规则'
  hitCount: number
  enabled: boolean
  createdAt: string
}

const wordRules = ref<WordRule[]>([
  { id: 1, word: '***政治敏感词A***', category: '政治类', level: '高危', action: '阻断请求', source: '网信办标准库', hitCount: 45, enabled: true, createdAt: '2026-06-01' },
  { id: 2, word: '***政治敏感词B***', category: '政治类', level: '高危', action: '阻断请求', source: '网信办标准库', hitCount: 23, enabled: true, createdAt: '2026-06-01' },
  { id: 3, word: '***暴力内容词***', category: '暴力类', level: '中危', action: '替换脱敏', source: '网信办标准库', hitCount: 67, enabled: true, createdAt: '2026-06-01' },
  { id: 4, word: '***色情违规词***', category: '色情类', level: '高危', action: '阻断请求', source: '网信办标准库', hitCount: 89, enabled: true, createdAt: '2026-06-01' },
  { id: 5, word: '***赌博引导词***', category: '赌博类', level: '中危', action: '阻断请求', source: '网信办标准库', hitCount: 12, enabled: true, createdAt: '2026-06-01' },
  { id: 6, word: '***诈骗话术词***', category: '诈骗类', level: '高危', action: '阻断请求', source: '网信办标准库', hitCount: 34, enabled: true, createdAt: '2026-06-01' },
  { id: 7, word: '竞品品牌名-XX', category: '商业合规', level: '低危', action: '替换脱敏', source: '自定义规则', hitCount: 156, enabled: true, createdAt: '2026-07-10' },
  { id: 8, word: '内部项目代号-YY', category: '商业机密', level: '中危', action: '替换脱敏', source: '自定义规则', hitCount: 28, enabled: true, createdAt: '2026-07-15' },
  { id: 9, word: '员工手机号正则', category: '隐私保护', level: '低危', action: '替换脱敏', source: '自定义规则', hitCount: 203, enabled: true, createdAt: '2026-07-20' },
  { id: 10, word: '身份证号正则', category: '隐私保护', level: '中危', action: '替换脱敏', source: '自定义规则', hitCount: 91, enabled: true, createdAt: '2026-07-20' },
])

// ============ 审计日志 ============
interface AuditLog {
  id: number
  time: string
  direction: '输入拦截' | '输出拦截'
  userId: string
  model: string
  matchedWord: string
  category: string
  action: string
  snippet: string
}

const auditLogs = ref<AuditLog[]>([
  { id: 1, time: '2026-08-05 12:31:02', direction: '输入拦截', userId: 'user-zhangsan', model: 'GPT-4o', matchedWord: '***政治敏感词A***', category: '政治类', action: '阻断请求', snippet: '用户尝试发送包含敏感词的 prompt...' },
  { id: 2, time: '2026-08-05 12:28:47', direction: '输出拦截', userId: 'user-lisi', model: 'Claude 3.5', matchedWord: '***色情违规词***', category: '色情类', action: '阻断请求', snippet: '模型输出中检测到违规内容...' },
  { id: 3, time: '2026-08-05 12:25:33', direction: '输入拦截', userId: 'user-wangwu', model: 'DeepSeek V3', matchedWord: '员工手机号正则', category: '隐私保护', action: '替换脱敏', snippet: '请帮我查一下 138****5678 的订单...' },
  { id: 4, time: '2026-08-05 12:20:15', direction: '输出拦截', userId: 'user-zhangsan', model: 'GPT-4o', matchedWord: '竞品品牌名-XX', category: '商业合规', action: '替换脱敏', snippet: '模型回复中包含竞品品牌名已自动替换...' },
  { id: 5, time: '2026-08-05 12:15:08', direction: '输入拦截', userId: 'api-key-prod-01', model: 'Gemini 2.0', matchedWord: '身份证号正则', category: '隐私保护', action: '替换脱敏', snippet: 'API 请求中包含身份证号码已脱敏...' },
  { id: 6, time: '2026-08-05 12:10:44', direction: '输入拦截', userId: 'user-zhaoliu', model: 'GPT-4o Mini', matchedWord: '***赌博引导词***', category: '赌博类', action: '阻断请求', snippet: '用户输入包含赌博相关引导内容...' },
])

// ============ 统计数据 ============
const stats = {
  totalRules: computed(() => wordRules.value.length),
  enabledRules: computed(() => wordRules.value.filter(r => r.enabled).length),
  totalHits: computed(() => wordRules.value.reduce((sum, r) => sum + r.hitCount, 0)),
  complianceRate: 99.97,
  todayBlocks: 127,
  todayDesensitize: 482,
}

// ============ 筛选 ============
const filterCategory = ref('全部')
const categories = ['全部', '政治类', '暴力类', '色情类', '赌博类', '诈骗类', '商业合规', '商业机密', '隐私保护']
const filteredRules = computed(() => {
  if (filterCategory.value === '全部') return wordRules.value
  return wordRules.value.filter(r => r.category === filterCategory.value)
})

// ============ 新增词库弹窗 ============
const showAddDialog = ref(false)
const newWord = ref({ word: '', category: '自定义', level: '中危' as const, action: '替换脱敏' as const })
let nextId = 11
const addWordRule = () => {
  if (!newWord.value.word.trim()) return
  wordRules.value.unshift({
    id: nextId++,
    word: newWord.value.word,
    category: newWord.value.category,
    level: newWord.value.level,
    action: newWord.value.action,
    source: '自定义规则',
    hitCount: 0,
    enabled: true,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  newWord.value = { word: '', category: '自定义', level: '中危', action: '替换脱敏' }
  showAddDialog.value = false
}

// ============ Tab 切换 ============
const activeTab = ref<'rules' | 'audit' | 'config'>('rules')
</script>

<template>
  <AppLayout>
  <div class="sensitive-words-guard p-6 md:p-8 font-sans space-y-6 max-w-[1400px] mx-auto">
    <!-- Header -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200/80">
        <span>🛡️ 2.5.1 安全敏感词护栏 — 平台管理员配置面板</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">安全敏感词护栏管理</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">输入/输出双向实时敏感词拦截，对接网信办标准词库。管理员可动态热增加/删除违规词库规则，命中违规词立即阻断请求并生成安全审计日志。</p>
    </div>

    <!-- 核心统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-5 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>合规通过率</span>
          <span class="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm">✅</span>
        </div>
        <div class="text-3xl font-black text-emerald-600 font-mono">{{ stats.complianceRate }}%</div>
        <div class="text-[11px] text-slate-500 font-bold">本月累计通过率</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-5 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>今日阻断</span>
          <span class="p-1.5 bg-red-50 text-red-600 rounded-xl text-sm">🚫</span>
        </div>
        <div class="text-3xl font-black text-red-600 font-mono">{{ stats.todayBlocks }}</div>
        <div class="text-[11px] text-slate-500 font-bold">高危违规请求直接拦截</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-5 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>今日脱敏</span>
          <span class="p-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm">🔒</span>
        </div>
        <div class="text-3xl font-black text-amber-600 font-mono">{{ stats.todayDesensitize }}</div>
        <div class="text-[11px] text-slate-500 font-bold">敏感词替换为 *** 放行</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-5 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>生效规则</span>
          <span class="p-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm">📋</span>
        </div>
        <div class="text-3xl font-black text-blue-600 font-mono">{{ stats.enabledRules.value }}<span class="text-sm text-slate-400 font-normal">/{{ stats.totalRules.value }}</span></div>
        <div class="text-[11px] text-slate-500 font-bold">词库规则 (含网信办 + 自定义)</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-5 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
        <div class="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>累计命中</span>
          <span class="p-1.5 bg-violet-50 text-violet-600 rounded-xl text-sm">📊</span>
        </div>
        <div class="text-3xl font-black text-violet-600 font-mono">{{ stats.totalHits.value }}</div>
        <div class="text-[11px] text-slate-500 font-bold">全部规则历史命中次数</div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="flex gap-3">
      <button 
        v-for="tab in [
          { key: 'rules', label: '📋 词库规则管理', desc: '管理敏感词库' },
          { key: 'audit', label: '📊 安全审计日志', desc: '拦截记录' },
          { key: 'config', label: '⚙️ 护栏配置', desc: '开关与策略' },
        ]" 
        :key="tab.key"
        @click="activeTab = tab.key as any"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border', activeTab === tab.key ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700']"
      >{{ tab.label }}</button>
    </div>

    <!-- TAB 1: 词库规则管理 -->
    <div v-if="activeTab === 'rules'" class="space-y-4">
      <!-- 筛选栏 + 新增按钮 -->
      <div class="flex items-center justify-between">
        <div class="flex gap-2 overflow-x-auto">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="filterCategory = cat"
            :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap', filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-600']"
          >{{ cat }}</button>
        </div>
        <button @click="showAddDialog = true" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5">
          <span>+</span> 热增加规则
        </button>
      </div>

      <!-- 词库规则表 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-700 text-slate-500 font-bold border-b border-slate-200/80 dark:border-dark-600">
              <tr>
                <th class="px-5 py-3">启用</th>
                <th class="px-5 py-3">敏感词 / 正则</th>
                <th class="px-5 py-3">分类</th>
                <th class="px-5 py-3">危险等级</th>
                <th class="px-5 py-3">触发动作</th>
                <th class="px-5 py-3">词库来源</th>
                <th class="px-5 py-3">命中次数</th>
                <th class="px-5 py-3">添加时间</th>
                <th class="px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700">
              <tr v-for="rule in filteredRules" :key="rule.id" class="hover:bg-slate-50 dark:hover:bg-dark-700/50">
                <td class="px-5 py-3">
                  <button 
                    @click="rule.enabled = !rule.enabled"
                    :class="['w-9 h-5 rounded-full transition-all relative', rule.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-dark-600']"
                  >
                    <span :class="['absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', rule.enabled ? 'left-4' : 'left-0.5']"></span>
                  </button>
                </td>
                <td class="px-5 py-3 font-bold text-slate-900 dark:text-white font-mono">{{ rule.word }}</td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 bg-slate-100 dark:bg-dark-600 text-slate-600 dark:text-slate-300 rounded text-[11px] font-bold">{{ rule.category }}</span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['px-2 py-0.5 rounded text-[11px] font-bold border', 
                    rule.level === '高危' ? 'bg-red-50 text-red-600 border-red-100' : 
                    rule.level === '中危' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    'bg-blue-50 text-blue-600 border-blue-100']">{{ rule.level }}</span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['text-[11px] font-bold', rule.action === '阻断请求' ? 'text-red-600' : rule.action === '替换脱敏' ? 'text-amber-600' : 'text-slate-400']">{{ rule.action }}</span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['text-[11px] font-bold', rule.source === '网信办标准库' ? 'text-blue-600' : 'text-violet-600']">{{ rule.source }}</span>
                </td>
                <td class="px-5 py-3 font-mono font-bold text-slate-900 dark:text-white">{{ rule.hitCount }}</td>
                <td class="px-5 py-3 text-slate-400 font-mono">{{ rule.createdAt }}</td>
                <td class="px-5 py-3">
                  <button 
                    v-if="rule.source === '自定义规则'"
                    @click="wordRules = wordRules.filter(r => r.id !== rule.id)" 
                    class="px-2 py-1 bg-red-50 text-red-500 rounded text-[11px] font-bold hover:bg-red-100 transition-colors"
                  >删除</button>
                  <span v-else class="text-[11px] text-slate-400">系统内置</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: 安全审计日志 -->
    <div v-else-if="activeTab === 'audit'" class="space-y-4">
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 dark:border-dark-700 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">🔍 实时安全审计日志</h3>
            <p class="text-[11px] text-slate-500 mt-1">记录所有被敏感词护栏拦截或脱敏的请求，按时间倒序排列</p>
          </div>
          <button class="px-3 py-1.5 bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors">导出审计报告</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-50 dark:bg-dark-700 text-slate-500 font-bold border-b border-slate-200/80 dark:border-dark-600">
              <tr>
                <th class="px-5 py-3">时间</th>
                <th class="px-5 py-3">方向</th>
                <th class="px-5 py-3">用户 / Key</th>
                <th class="px-5 py-3">模型</th>
                <th class="px-5 py-3">命中规则</th>
                <th class="px-5 py-3">分类</th>
                <th class="px-5 py-3">处置</th>
                <th class="px-5 py-3">内容摘要</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-dark-700">
              <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-dark-700/50">
                <td class="px-5 py-3 text-slate-400 font-mono whitespace-nowrap">{{ log.time }}</td>
                <td class="px-5 py-3">
                  <span :class="['px-2 py-0.5 rounded text-[11px] font-bold border', log.direction === '输入拦截' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-violet-50 text-violet-600 border-violet-100']">{{ log.direction }}</span>
                </td>
                <td class="px-5 py-3 font-mono text-slate-600 dark:text-slate-300">{{ log.userId }}</td>
                <td class="px-5 py-3 font-bold text-slate-900 dark:text-white">{{ log.model }}</td>
                <td class="px-5 py-3 font-mono text-red-600 font-bold">{{ log.matchedWord }}</td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 bg-slate-100 dark:bg-dark-600 rounded text-[11px] font-bold text-slate-600 dark:text-slate-300">{{ log.category }}</span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['text-[11px] font-bold', log.action === '阻断请求' ? 'text-red-600' : 'text-amber-600']">{{ log.action }}</span>
                </td>
                <td class="px-5 py-3 text-slate-500 max-w-xs truncate">{{ log.snippet }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: 护栏配置 -->
    <div v-else-if="activeTab === 'config'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 总开关配置卡 -->
        <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-5">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️ 护栏总开关</span>
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white">敏感词护栏总开关</div>
                <div class="text-[11px] text-slate-500 mt-0.5">关闭后所有敏感词拦截将停止</div>
              </div>
              <button 
                @click="isEnabled = !isEnabled"
                :class="['w-12 h-6 rounded-full transition-all relative', isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-dark-600']"
              >
                <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', isEnabled ? 'left-6' : 'left-0.5']"></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-4 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white">📥 输入方向拦截 (Prompt)</div>
                <div class="text-[11px] text-slate-500 mt-0.5">对用户提交的 Prompt 内容进行实时扫描</div>
              </div>
              <button 
                @click="inputFilterEnabled = !inputFilterEnabled"
                :class="['w-12 h-6 rounded-full transition-all relative', inputFilterEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-dark-600']"
              >
                <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', inputFilterEnabled ? 'left-6' : 'left-0.5']"></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-4 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white">📤 输出方向拦截 (Completion)</div>
                <div class="text-[11px] text-slate-500 mt-0.5">对模型返回的响应内容进行实时扫描</div>
              </div>
              <button 
                @click="outputFilterEnabled = !outputFilterEnabled"
                :class="['w-12 h-6 rounded-full transition-all relative', outputFilterEnabled ? 'bg-violet-500' : 'bg-slate-300 dark:bg-dark-600']"
              >
                <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', outputFilterEnabled ? 'left-6' : 'left-0.5']"></span>
              </button>
            </div>

            <div class="flex items-center justify-between p-4 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
              <div>
                <div class="font-bold text-xs text-slate-900 dark:text-white">⚠️ 严格模式</div>
                <div class="text-[11px] text-slate-500 mt-0.5">开启后所有命中均直接阻断，不允许替换脱敏放行</div>
              </div>
              <button 
                @click="strictMode = !strictMode"
                :class="['w-12 h-6 rounded-full transition-all relative', strictMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-dark-600']"
              >
                <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', strictMode ? 'left-6' : 'left-0.5']"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- 词库来源配置 -->
        <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-5">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚 词库来源与同步配置</span>
          </h3>

          <div class="space-y-4">
            <div class="p-4 border border-blue-200/80 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl">
              <div class="flex items-center justify-between mb-2">
                <div class="font-bold text-xs text-blue-700 dark:text-blue-400">🏛️ 网信办标准词库</div>
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold">自动同步</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>• 词库版本: <span class="font-mono font-bold">v2026.08.01</span></div>
                <div>• 最近同步: <span class="font-mono">2026-08-05 00:00:15</span></div>
                <div>• 同步频率: 每日 00:00 自动拉取更新</div>
                <div>• 内置规则数: <span class="font-bold">6 条</span> (政治/暴力/色情/赌博/诈骗/涉恐)</div>
              </div>
            </div>

            <div class="p-4 border border-violet-200/80 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-950/20 rounded-2xl">
              <div class="flex items-center justify-between mb-2">
                <div class="font-bold text-xs text-violet-700 dark:text-violet-400">🔧 自定义词库</div>
                <span class="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded text-[10px] font-bold">手动管理</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>• 自定义规则数: <span class="font-bold">4 条</span> (商业合规/商业机密/隐私保护)</div>
                <div>• 支持精确匹配、正则表达式、通配符三种模式</div>
                <div>• 支持 CSV 批量导入与导出</div>
              </div>
            </div>

            <div class="p-4 border border-slate-200/80 dark:border-dark-600 rounded-2xl">
              <div class="font-bold text-xs text-slate-900 dark:text-white mb-2">🔗 Webhook 通知</div>
              <div class="text-[11px] text-slate-500 space-y-1">
                <div>当高危词被命中时，自动推送至钉钉/飞书/企微机器人</div>
                <div class="font-mono text-[10px] text-slate-400 mt-2 p-2 bg-slate-50 dark:bg-dark-700 rounded-lg">
                  https://oapi.dingtalk.com/robot/send?access_token=****
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增规则弹窗 -->
    <Transition name="fade">
      <div v-if="showAddDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showAddDialog = false">
        <div class="bg-white dark:bg-dark-800 rounded-3xl p-8 w-[480px] shadow-2xl border border-slate-200/80 dark:border-dark-700 space-y-5">
          <h3 class="text-lg font-black text-slate-900 dark:text-white">🛡️ 热增加敏感词规则</h3>
          <p class="text-xs text-slate-500">新增规则将立即生效（热加载），无需重启服务。</p>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">敏感词 / 正则表达式</label>
              <input v-model="newWord.word" type="text" placeholder="输入敏感词或正则，如：\d{18}" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-sm outline-none focus:border-blue-500 text-slate-900 dark:text-white" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">分类</label>
                <input v-model="newWord.category" type="text" placeholder="如：隐私保护" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs outline-none focus:border-blue-500 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">等级</label>
                <select v-model="newWord.level" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs outline-none text-slate-900 dark:text-white">
                  <option>高危</option>
                  <option>中危</option>
                  <option>低危</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">触发动作</label>
                <select v-model="newWord.action" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs outline-none text-slate-900 dark:text-white">
                  <option>阻断请求</option>
                  <option>替换脱敏</option>
                  <option>仅记录</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button @click="showAddDialog = false" class="px-5 py-2 bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors">取消</button>
            <button @click="addWordRule" class="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm">确认添加</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
