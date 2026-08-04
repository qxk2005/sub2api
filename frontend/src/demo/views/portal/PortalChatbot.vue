<script setup lang="ts">
/**
 * FRS V3.0 2.3 网页版对话机器人 (SaaS Web Chat Demo)
 * 苹果高级灰白配色 (Apple-Style Light Gray Design System)
 * 严格支持官网标题菜单下方嵌入，100% 页面不产生滚动条，同屏展示顶部模型切换器与底部输入框
 */
import { ref, computed } from 'vue'

defineProps<{
  isUserLoggedIn?: boolean
}>()

const emit = defineEmits(['login-request'])

// 2.3.1 用户账户体系与云端同步
const currentUser = ref({
  name: 'demo_user',
  email: 'user@sub2api.com',
  balanceQuota: '$ 25.40',
  tokensRemaining: '2,150,000 Tokens',
  isSynced: true
})

// 侧边栏控制
const isSidebarOpen = ref(true)

// 2.3.5 多轮对话上下文管理与会话历史树
interface ChatSession {
  id: string
  title: string
  timeGroup: 'today' | 'yesterday' | 'earlier'
  pinned: boolean
  model: string
  updatedAt: string
}

const sessions = ref<ChatSession[]>([
  { id: 's-1', title: 'Vue 3 组合式 API 计数器示例', timeGroup: 'today', pinned: true, model: 'Claude 3.5 Sonnet', updatedAt: '14:20' },
  { id: 's-2', title: 'DeepSeek V3 架构解析与长文本处理', timeGroup: 'today', pinned: false, model: 'DeepSeek-V3', updatedAt: '11:05' },
  { id: 's-3', title: 'Apple 2024 Q4 财报核心摘要总结', timeGroup: 'yesterday', pinned: false, model: 'GPT-4o Omni', updatedAt: '昨天 16:30' },
  { id: 's-4', title: 'Python 异步 asyncio 多任务压测脚本', timeGroup: 'earlier', pinned: false, model: 'Gemini 2.0 Flash', updatedAt: '3天前' }
])

const currentSessionId = ref<string>('s-1')
const currentSession = computed(() => sessions.value.find(s => s.id === currentSessionId.value) || sessions.value[0])

// 新建对话
const createNewSession = () => {
  const newId = `s-${Date.now()}`
  const newSess: ChatSession = {
    id: newId,
    title: '新对话 session',
    timeGroup: 'today',
    pinned: false,
    model: selectedModel.value.name,
    updatedAt: '刚刚'
  }
  sessions.value.unshift(newSess)
  currentSessionId.value = newId
  messages.value = []
  showToast('已新建空白对话 session！')
}

// 2.3.4 模型手动切换（按品牌与能力分类）
interface ModelItem {
  id: string
  name: string
  brand: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek'
  icon: string
  desc: string
  badge?: string
  rateMultiplier: number
}

const models: ModelItem[] = [
  { id: 'm-1', name: 'Claude 3.5 Sonnet', brand: 'Anthropic', icon: '🟣', desc: '逻辑代码与长文本推荐，200K 上下文', badge: '全能推', rateMultiplier: 1.0 },
  { id: 'm-2', name: 'GPT-4o Omni', brand: 'OpenAI', icon: '🟢', desc: '原生多模态与视觉识别，响应极快', badge: '多模态', rateMultiplier: 1.2 },
  { id: 'm-3', name: 'DeepSeek-V3', brand: 'DeepSeek', icon: '🔴', desc: '国产高性价比开源强力大模型', badge: '超低资费', rateMultiplier: 0.2 },
  { id: 'm-4', name: 'Gemini 2.0 Flash', brand: 'Google', icon: '🔵', desc: '谷歌最新极速模型，适合高并发', badge: '极速', rateMultiplier: 0.5 },
  { id: 'm-5', name: 'DALL-E 3 Image', brand: 'OpenAI', icon: '🖼️', desc: '文本生成高清艺术图片', badge: '绘画', rateMultiplier: 2.0 }
]

const selectedModel = ref<ModelItem>(models[0])
const isModelPickerOpen = ref(false)
const selectedBrandFilter = ref<string>('all')

const filteredModels = computed(() => {
  if (selectedBrandFilter.value === 'all') return models
  return models.filter(m => m.brand === selectedBrandFilter.value)
})

const selectModel = (m: ModelItem) => {
  selectedModel.value = m
  isModelPickerOpen.value = false
  if (currentSession.value) {
    currentSession.value.model = m.name
  }
  showToast(`已无感切至模型：【${m.name}】`)
}

// 2.3.2 任务分类入口 (预设场景 Prompt 标签) & 2.3.3 智能模型匹配
interface TaskScenario {
  id: string
  title: string
  icon: string
  desc: string
  prompt: string
  recommendModelId: string
  recommendModelName: string
}

const taskScenarios: TaskScenario[] = [
  { id: 'sc-chat', title: '通用日常对话', icon: '💬', desc: '日常知识解答与头脑风暴', prompt: '请帮我解答以下常识与日常问题：', recommendModelId: 'm-1', recommendModelName: 'Claude 3.5 Sonnet' },
  { id: 'sc-doc', title: '文档长文本整理', icon: '📄', desc: '提炼 PDF / Word 核心摘要', prompt: '请阅读以下文档内容，提炼核心结论与 3 个关键 Key Takeaways：', recommendModelId: 'm-1', recommendModelName: 'Claude 3.5 Sonnet (200K)' },
  { id: 'sc-code', title: '代码编写与审查', icon: '💻', desc: '语法检查、重构与算法编写', prompt: '请审查以下代码，找出潜在性能瓶颈并给出优化方案：', recommendModelId: 'm-3', recommendModelName: 'DeepSeek-V3 / Claude 3.5' },
  { id: 'sc-image', title: '多模态图片处理', icon: '🖼️', desc: '识图分析与 DALL-E 3 绘画', prompt: '请详细描述所上传图片的核心对象、配色结构与艺术风格：', recommendModelId: 'm-2', recommendModelName: 'GPT-4o Omni (视觉识图)' },
  { id: 'sc-translate', title: '多语言专业翻译', icon: '🌐', desc: '地道中英/多语种专业互译', prompt: '请将以下文本翻译为地道的专业英文，保持学术严谨性：', recommendModelId: 'm-1', recommendModelName: 'Claude 3.5 Sonnet' }
]

const recommendNotice = ref<string | null>(null)

const selectScenario = (sc: TaskScenario) => {
  inputPrompt.value = sc.prompt
  recommendNotice.value = `🤖 智能推荐：针对【${sc.title}】场景，系统已为您自动切换至最优推荐模型：${sc.recommendModelName}`
  
  // 自动切换推荐模型
  const recModel = models.find(m => m.id === sc.recommendModelId)
  if (recModel) {
    selectedModel.value = recModel
  }
  showToast(`已套用【${sc.title}】预设场景`)
}

// 2.3.6 多模态输入支持 (文件上传与预览)
interface AttachedFile {
  name: string
  size: string
  type: 'image' | 'doc'
  tokensEstimate: number
}

const attachedFiles = ref<AttachedFile[]>([])
const isDragOver = ref(false)

const triggerFileUpload = () => {
  attachedFiles.value.push({
    name: '2024_Q4_Financial_Report.pdf',
    size: '2.4 MB',
    type: 'doc',
    tokensEstimate: 12500
  })
  showToast('📄 已成功解析并预载 PDF 附件 (预计消耗 12.5k Tokens)')
}

const removeFile = (idx: number) => {
  attachedFiles.value.splice(idx, 1)
}

// 消息流
interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
  files?: AttachedFile[]
}

const messages = ref<Message[]>([
  { role: 'assistant', content: '您好！我是 Sub2API 驱动的 AI 智能助手。您可以通过顶部模型选择器切换模型，或选择下方场景快速体验。', time: '14:00' },
  { role: 'user', content: '可以给我展示一个基于 Vue 3 `<script setup>` 的简单计数器代码吗？', time: '14:01' },
  { role: 'assistant', content: "没问题！这是一个现代 Vue 3 单文件组件示例：\n\n```vue\n<script setup>\nimport { ref } from 'vue'\nconst count = ref(0)\n<\/script>\n\n<template>\n  <button @click=\"count++\">Count is: {{ count }}</button>\n</template>\n```", time: '14:01' }
])

const inputPrompt = ref('')

const sendMessage = () => {
  if (!inputPrompt.value.trim() && attachedFiles.value.length === 0) return

  const userText = inputPrompt.value
  const userFiles = [...attachedFiles.value]

  // 追加用户消息
  messages.value.push({
    role: 'user',
    content: userText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    files: userFiles.length > 0 ? userFiles : undefined
  })

  // 自动设置首句为标题
  if (currentSession.value && (currentSession.value.title.startsWith('新对话') || currentSession.value.title === '')) {
    currentSession.value.title = userText.slice(0, 18) + (userText.length > 18 ? '...' : '')
  }

  inputPrompt.value = ''
  attachedFiles.value = []

  // 模拟 AI 响应
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `【${selectedModel.value.name} 回复】：已由 Sub2API 聚合网关完成流式响应转发，耗时 290ms，当前 Token 配额与扣费已自动核算。`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }, 700)
}

// 2.3.7 对话导出与匿名分享 Modal
const isShareModalOpen = ref(false)
const shareUrl = ref('https://sub2api.com/s/share_7f8a9b2c')

const exportMarkdown = () => {
  const content = messages.value.map(m => `### ${m.role === 'user' ? 'User' : 'Assistant'}\n${m.content}\n`).join('\n')
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chat_export_${Date.now()}.md`
  a.click()
  showToast('📝 已成功导出为 Markdown 文件！')
}

const copyShareUrl = () => {
  navigator.clipboard.writeText(shareUrl.value)
  showToast('🔗 公开匿名分享链接已复制到剪贴板！')
}

// Toast
const toastMessage = ref('')
const toastVisible = ref(false)
const showToast = (msg: string) => {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}
</script>

<template>
  <!-- 嵌入在官网导航栏下方的苹果高级灰白配色 Chatbot 界面 (h-full 溢出裁剪) -->
  <div class="portal-chatbot h-full w-full bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-slate-100 flex overflow-hidden font-sans selection:bg-blue-100 relative">
    
    <!-- 未登录保护拦截屏 (2.3.1 登录后才能使用) -->
    <div v-if="!isUserLoggedIn" class="absolute inset-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      <div class="bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl p-8 max-w-md text-center shadow-2xl space-y-5">
        <div class="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">
          🔐
        </div>
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">对话机器人为 Sub2API 授权用户专属</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            网页版对话机器人包含云端会话持久化 (2.3.1)、多模态文件解析 (2.3.6) 与高阶模型调用。请登录账号以开启完全体验。
          </p>
        </div>
        <button 
          @click="emit('login-request')" 
          class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-600/25"
        >
          🔑 模拟以 Demo 账号登录 Sub2API
        </button>
      </div>
    </div>

    <!-- 1. 左侧侧边栏：会话历史树 (苹果半透明灰白面板) -->
    <aside :class="['w-64 bg-slate-100/70 dark:bg-dark-800/70 border-r border-slate-200/80 dark:border-dark-700 backdrop-blur-xl flex flex-col shrink-0 transition-all duration-300 relative z-30 select-none', !isSidebarOpen && '-ml-64']">
      
      <!-- 侧边栏头部：新建对话按扭 -->
      <div class="p-3 border-b border-slate-200/70 dark:border-dark-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">会话历史 (2.3.5)</span>
        </div>
        <button 
          @click="createNewSession"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
        >
          <span class="text-sm">+</span>
          <span>新建</span>
        </button>
      </div>

      <!-- 会话历史树列表 -->
      <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs">
        <div class="px-2 py-1 text-[10px] font-bold text-slate-400 font-mono">今天与最近</div>
        
        <div 
          v-for="s in sessions" 
          :key="s.id"
          @click="currentSessionId = s.id"
          :class="[
            'p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border group relative flex flex-col gap-0.5 shadow-2xs',
            currentSessionId === s.id 
              ? 'bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 border-slate-300/80 dark:border-dark-600 font-bold shadow-xs' 
              : 'hover:bg-slate-200/50 dark:hover:bg-dark-700/50 text-slate-700 dark:text-slate-300 border-transparent'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="truncate flex-1 pr-2">{{ s.title }}</span>
            <span v-if="s.pinned" class="text-[10px]">📌</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{{ s.model }}</span>
            <span>{{ s.updatedAt }}</span>
          </div>
        </div>
      </div>

      <!-- 2.3.1 底部账户卡片展示 -->
      <div class="p-3 border-t border-slate-200/70 dark:border-dark-700 bg-white/60 dark:bg-dark-900/60">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            U
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-xs text-slate-800 dark:text-white truncate flex items-center justify-between">
              <span>{{ currentUser.name }}</span>
              <span class="text-[9px] text-emerald-500 font-mono">🟢 认证正常</span>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
              {{ currentUser.balanceQuota }} • {{ currentUser.tokensRemaining }}
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 2. 右侧主对话视图 (嵌入在官网 Header 下方) -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-white dark:bg-dark-900">
      
      <!-- 2.1 顶栏 Header：切换侧边栏 + 模型选择器 (2.3.4) + 分享导出 (2.3.7) -->
      <header class="h-13 border-b border-slate-200/70 dark:border-dark-700 shrink-0 flex items-center justify-between px-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl z-20">
        <div class="flex items-center space-x-3">
          <button @click="isSidebarOpen = !isSidebarOpen" class="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          
          <!-- 2.3.4 苹果胶囊风格模型下拉选择器 -->
          <div class="relative">
            <button 
              @click="isModelPickerOpen = !isModelPickerOpen"
              class="flex items-center space-x-2 px-3 py-1 bg-slate-100/80 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl hover:border-blue-500 transition-all text-xs font-bold text-slate-800 dark:text-slate-100 shadow-2xs"
            >
              <span>{{ selectedModel.icon }}</span>
              <span class="text-xs">{{ selectedModel.name }}</span>
              <span class="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded text-[10px] font-mono">{{ selectedModel.rateMultiplier }}x 计费</span>
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- 品牌下拉菜单卡片 (2.3.4) -->
            <div v-if="isModelPickerOpen" class="absolute left-0 top-10 z-50 w-80 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl shadow-2xl p-3 animate-fade-in space-y-2">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-dark-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>切换大模型 (2.3.4 按品牌筛选)</span>
                <span class="text-[10px] text-slate-400">共 {{ models.length }} 款可用</span>
              </div>

              <!-- 品牌 Tab 筛选 -->
              <div class="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                <button 
                  v-for="b in ['all', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek']"
                  :key="b"
                  @click="selectedBrandFilter = b"
                  :class="['px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all', selectedBrandFilter === b ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-slate-400']"
                >
                  {{ b === 'all' ? '全部品牌' : b }}
                </button>
              </div>

              <!-- 模型条目列表 -->
              <div class="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
                <div 
                  v-for="m in filteredModels" 
                  :key="m.id"
                  @click="selectModel(m)"
                  :class="['p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs', selectedModel.id === m.id ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-700 dark:text-blue-300 font-bold' : 'bg-slate-50/50 dark:bg-dark-900/50 border-slate-200/60 dark:border-dark-700 hover:border-blue-300 text-slate-700 dark:text-slate-300']"
                >
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5">
                      <span>{{ m.icon }}</span>
                      <span class="font-bold">{{ m.name }}</span>
                      <span v-if="m.badge" class="px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-[10px] rounded">{{ m.badge }}</span>
                    </div>
                    <div class="text-[10px] text-slate-400">{{ m.desc }}</div>
                  </div>
                  <span class="text-[10px] font-mono text-slate-400">{{ m.rateMultiplier }}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2.3.7 导出分享按钮 -->
        <div class="flex items-center space-x-3 text-xs">
          <button 
            @click="isShareModalOpen = true"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>🔗 分享/导出 (2.3.7)</span>
          </button>
        </div>
      </header>

      <!-- 2.3.3 智能模型推荐横幅 -->
      <div v-if="recommendNotice" class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-4 py-1.5 shrink-0 flex items-center justify-between shadow-xs z-10">
        <div class="flex items-center gap-2 truncate">
          <span>✨</span>
          <span class="truncate">{{ recommendNotice }}</span>
        </div>
        <button @click="recommendNotice = null" class="font-bold ml-2">✕</button>
      </div>

      <!-- 2.2 消息流主体区域 (Apple 风格居中布局 max-w-3xl, flex-1 可滚动) -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 custom-scrollbar">
        <div class="max-w-3xl mx-auto w-full h-full flex flex-col justify-between">
          
          <!-- 空白状态：ChatGPT / Apple 风格大标题与 2.3.2 预设场景分类卡片 -->
          <div v-if="messages.length === 0" class="my-auto py-6 text-center space-y-5">
            <div class="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 rounded-3xl flex items-center justify-center text-2xl mx-auto shadow-sm">
              ✨
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white mb-1">今天需要什么帮助？</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">点击下方场景标签自动匹配推荐大模型，或直接输入问题。</p>
            </div>

            <!-- 2.3.2 预设场景分类卡片 Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left">
              <button 
                v-for="sc in taskScenarios" 
                :key="sc.id"
                @click="selectScenario(sc)"
                class="p-3 bg-slate-50 dark:bg-dark-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-dark-700 hover:border-blue-400 rounded-2xl transition-all group shadow-2xs"
              >
                <div class="text-base mb-1">{{ sc.icon }}</div>
                <div class="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-0.5">{{ sc.title }}</div>
                <div class="text-[10px] text-slate-400 truncate">{{ sc.desc }}</div>
              </button>
            </div>
          </div>

          <!-- 有消息时的对话历史列表 -->
          <div v-else class="space-y-5 pb-2">
            <!-- 场景分类快捷入口小浮条 (有对话时保持收纳) -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-dark-800">
              <span class="text-[10px] font-bold text-slate-400 shrink-0 font-mono">快捷场景:</span>
              <button 
                v-for="sc in taskScenarios" 
                :key="sc.id"
                @click="selectScenario(sc)"
                class="px-2.5 py-1 bg-slate-100 dark:bg-dark-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-dark-700 rounded-xl text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-all whitespace-nowrap"
              >
                <span>{{ sc.icon }}</span>
                <span class="ml-1">{{ sc.title }}</span>
              </button>
            </div>

            <!-- 消息气泡列表 -->
            <div v-for="(msg, idx) in messages" :key="idx" class="flex items-start" :class="msg.role === 'user' ? 'justify-end' : ''">
              
              <div v-if="msg.role === 'assistant'" class="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center mr-3 text-white font-bold text-xs shadow-xs">
                AI
              </div>
              
              <div :class="[
                'max-w-[85%] rounded-2xl p-3.5 shadow-2xs relative text-xs leading-relaxed',
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-xs' : 'bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-dark-700'
              ]">
                <!-- 多模态上传文件卡片 (2.3.6) -->
                <div v-if="msg.files" class="mb-2 space-y-1">
                  <div v-for="f in msg.files" :key="f.name" class="p-2 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center gap-2 text-[11px]">
                    <span>📄</span>
                    <span class="font-bold">{{ f.name }} ({{ f.size }})</span>
                  </div>
                </div>

                <!-- Markdown 代码与文本渲染 -->
                <template v-if="msg.content.includes('```')">
                  <div class="whitespace-pre-wrap">{{ msg.content.split('```')[0] }}</div>
                  <pre class="bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[11px] my-2 font-mono border border-slate-800"><code>{{ msg.content.split('```')[1].replace(/^vue\n/, '') }}</code></pre>
                </template>
                <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>

                <div class="text-[10px] opacity-60 mt-1 text-right font-mono">{{ msg.time }}</div>
              </div>

              <div v-if="msg.role === 'user'" class="w-8 h-8 rounded-2xl bg-slate-200 dark:bg-dark-700 flex-shrink-0 flex items-center justify-center ml-3 text-slate-700 dark:text-slate-200 font-bold text-xs">
                U
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 2.3 底部固定对话输入框 (苹果灰白圆角胶囊容器，在同屏最下端固顶) -->
      <div class="shrink-0 p-4 max-w-3xl mx-auto w-full bg-white dark:bg-dark-900 z-20">
        <!-- 多模态附件预览 (2.3.6) -->
        <div v-if="attachedFiles.length > 0" class="flex flex-wrap gap-2 mb-2">
          <div v-for="(f, i) in attachedFiles" :key="i" class="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span>📄</span>
            <span class="font-bold">{{ f.name }}</span>
            <span class="text-[10px] opacity-75">({{ f.tokensEstimate }} Tokens)</span>
            <button @click="removeFile(i)" class="font-bold hover:text-red-500 ml-1">✕</button>
          </div>
        </div>

        <div 
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="isDragOver = false; triggerFileUpload()"
          :class="[
            'relative bg-slate-100/80 dark:bg-dark-800 border rounded-3xl transition-all p-3 shadow-md',
            isDragOver ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50' : 'border-slate-200 dark:border-dark-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
          ]"
        >
          <textarea 
            v-model="inputPrompt"
            @keydown.enter.exact.prevent="sendMessage"
            rows="2"
            placeholder="发送消息给大模型... (可直接拖拽 PDF/图片 到此处上传多模态解析 2.3.6)" 
            class="w-full bg-transparent outline-none resize-none text-xs text-slate-800 dark:text-slate-100 pr-20"
          ></textarea>

          <div class="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-dark-700/80">
            <div class="flex items-center gap-2 text-xs">
              <button 
                @click="triggerFileUpload"
                class="px-2.5 py-1 bg-white dark:bg-dark-900 hover:bg-slate-200/80 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px] shadow-2xs"
              >
                <span>📎 上传文件/图片</span>
              </button>
              <span class="text-[10px] text-slate-400 font-mono hidden sm:inline">Enter 发送</span>
            </div>

            <button 
              @click="sendMessage"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1"
            >
              <span>发送</span>
              <span>🚀</span>
            </button>
          </div>
        </div>

        <div class="text-center mt-2 text-[10px] text-slate-400 font-mono">
          由 Sub2API 聚合网关强力驱动 • 已安全校验当前账户身份与配额 (2.3.1)
        </div>
      </div>
    </main>

    <!-- 2.3.7 对话导出与匿名分享 Modal -->
    <div v-if="isShareModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔗 对话导出与匿名分享 (2.3.7)</span>
          </h3>
          <button @click="isShareModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- 导出 Markdown -->
          <div class="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-dark-700 flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-800 dark:text-slate-200">导出 Markdown 文件 (.md)</div>
              <div class="text-[11px] text-slate-400 mt-0.5">完整保存多轮对话历史与代码块</div>
            </div>
            <button @click="exportMarkdown" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all">
              下载
            </button>
          </div>

          <!-- 匿名分享链接 -->
          <div class="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-dark-700 space-y-2">
            <div class="font-bold text-slate-800 dark:text-slate-200">生成匿名公开分享短链</div>
            <div class="flex items-center gap-2">
              <input :value="shareUrl" readonly class="flex-1 px-3 py-1.5 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl font-mono text-slate-600 dark:text-slate-300 outline-none" />
              <button @click="copyShareUrl" class="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all">
                复制
              </button>
            </div>
          </div>
        </div>

        <div class="pt-2 text-right">
          <button @click="isShareModalOpen = false" class="px-4 py-2 bg-slate-200 dark:bg-dark-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 全局 Toast -->
    <Transition name="toast">
      <div v-if="toastVisible" class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-semibold border border-slate-700 flex items-center gap-2">
        <span>💡</span>
        <div>{{ toastMessage }}</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
