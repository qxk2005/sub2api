<script setup lang="ts">
/**
 * FRS V3.4 2.2 一键部署客户端 (Windows / macOS 专属客户端 Demo 仿真)
 * 完整覆盖 2.2.1 ~ 2.2.7 全部子功能
 */
import { ref } from 'vue'

// 窗口状态控制
const isMaximized = ref(false)
const activeTab = ref<'profiles' | 'inject' | 'speedtest' | 'traffic' | 'settings' | 'chatbot'>('chatbot')

// 托盘控制面板 (2.2.1)
const isTrayOpen = ref(false)
const isProxyEnabled = ref(true)

// 多线路/多账号预设 (2.2.2)
interface Profile {
  id: string
  name: string
  keyMasked: string
  endpoint: string
  port: number
  isVIP: boolean
  active: boolean
}

const profiles = ref<Profile[]>([
  { id: 'p-1', name: '默认生产主线路 (OpenAI)', keyMasked: 'sk-prod-88***99', endpoint: 'https://core.cnfcloud.com', port: 10808, isVIP: false, active: true },
  { id: 'p-2', name: 'VIP 极速低延迟专线', keyMasked: 'sk-vip-77***33', endpoint: 'https://vip.cnfcloud.com', port: 10808, isVIP: true, active: false },
  { id: 'p-3', name: '开发测试 Key 隔离池', keyMasked: 'sk-dev-11***22', endpoint: 'https://dev.cnfcloud.com', port: 10809, isVIP: false, active: false }
])

const activeProfile = ref<Profile>(profiles.value[0])

const switchProfile = (p: Profile) => {
  profiles.value.forEach(item => item.active = (item.id === p.id))
  activeProfile.value = p
  showToast(`已无感切至线路：【${p.name}】`)
}

// 本地环境检测与一键注入 (2.2.3)
interface EnvironmentTool {
  id: string
  name: string
  icon: string
  configPath: string
  detected: boolean
  bound: boolean
}

const envTools = ref<EnvironmentTool[]>([
  { id: 'claude-code', name: 'Claude Code CLI', icon: '🤖', configPath: '~/.claude.json', detected: true, bound: true },
  { id: 'codex-cli', name: 'Codex / VSCode Plugin', icon: '💻', configPath: '~/.codex/config.toml', detected: true, bound: false },
  { id: 'gemini-cli', name: 'Gemini CLI Tool', icon: '✨', configPath: '~/.gemini/settings.env', detected: true, bound: false },
  { id: 'openclaw', name: 'OpenClaw Agent Runtime', icon: '🦅', configPath: '~/.openclaw/agent.yaml', detected: true, bound: false },
  { id: 'hermes', name: 'Hermes Auto-Dev Plugin', icon: '⚡', configPath: '~/.hermes/config.json', detected: false, bound: false }
])

const injectConfig = (tool: EnvironmentTool) => {
  tool.bound = true
  showToast(`已成功将【${activeProfile.value.name}】的 Base URL 与 Key 注入到 ${tool.name} 配置文件 (${tool.configPath})！`)
}

// 延迟测速大盘 (2.2.4)
interface PingNode {
  id: string
  name: string
  region: string
  latency: number
  status: 'fast' | 'good' | 'slow'
  recommended: boolean
}

const speedtestNodes = ref<PingNode[]>([
  { id: 'n-1', name: '香港极速直连专线', region: 'HK-01', latency: 38, status: 'fast', recommended: true },
  { id: 'n-2', name: '东京高吞吐节点', region: 'TY-02', latency: 85, status: 'fast', recommended: false },
  { id: 'n-3', name: '新加坡备用节点', region: 'SG-01', latency: 142, status: 'good', recommended: false },
  { id: 'n-4', name: '美西冗余路由', region: 'US-West', latency: 280, status: 'slow', recommended: false }
])

const isTestingSpeed = ref(false)
const runSpeedtest = () => {
  isTestingSpeed.value = true
  showToast('正在发起并发高精度 Ping 测速...')
  setTimeout(() => {
    speedtestNodes.value.forEach(node => {
      node.latency = Math.floor(Math.random() * 80) + 20
      node.status = node.latency < 60 ? 'fast' : node.latency < 150 ? 'good' : 'slow'
    })
    isTestingSpeed.value = false
    showToast('测速完成！已更新节点延迟大盘。')
  }, 1200)
}

// 版本更新 (2.2.5)
const currentVersion = ref('v3.1.2')
const hasUpdate = ref(true)
const latestVersion = ref('v3.2.0')
const updateNotes = ref('1. 新增 DeepSeek V3 / R1 协议原生透传支持\n2. 优化本地代理内存占用，降低 30%\n3. 修复网络断开后托盘热重载自愈')
const isDownloadingUpdate = ref(false)
const updateProgress = ref(0)

const startUpdate = () => {
  isDownloadingUpdate.value = true
  updateProgress.value = 0
  const timer = setInterval(() => {
    updateProgress.value += 20
    if (updateProgress.value >= 100) {
      clearInterval(timer)
      isDownloadingUpdate.value = false
      hasUpdate.value = false
      currentVersion.value = latestVersion.value
      showToast('🎉 静默升级完成！本地代理服务已热重载为 v3.2.0')
    }
  }, 400)
}

// 本地抓包与错误诊断 (2.2.6)
interface ProxyLog {
  id: string
  time: string
  method: string
  path: string
  status: number
  durationMs: number
  errorTitle?: string
  errorAdvice?: string
}

const proxyLogs = ref<ProxyLog[]>([
  { id: 'l-1', time: '13:42:01', method: 'POST', path: '/v1/chat/completions', status: 200, durationMs: 420 },
  { id: 'l-2', time: '13:42:15', method: 'POST', path: '/v1/chat/completions', status: 402, durationMs: 120, errorTitle: '本平台账户余额不足', errorAdvice: '检测到当前绑定的账号额度已用尽，请联系平台管理员或在控制台充值。' },
  { id: 'l-3', time: '13:43:02', method: 'POST', path: '/v1/models', status: 200, durationMs: 65 },
  { id: 'l-4', time: '13:44:10', method: 'POST', path: '/v1/chat/completions', status: 403, durationMs: 90, errorTitle: 'API Key 权限受限', errorAdvice: '该 Key 未开启 claude-3-5-sonnet 模型访问白名单。请在【API 密钥】中更新模型权限。' }
])

const selectedLog = ref<ProxyLog | null>(proxyLogs.value[1])

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

// 聊天机器人客户端 (2.2.7)
const chatbotModel = ref('Claude 3.5 Sonnet')
const chatbotModels = ['GPT-4o', 'GPT-4o Mini', 'Claude 3.5 Sonnet', 'Gemini 2.0 Flash', 'DeepSeek V3']
const chatbotInput = ref('')
interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: string
  time: string
}
const chatbotMessages = ref<ChatMessage[]>([
  { id: 1, role: 'assistant', content: '你好！我是 Sub2API 桌面客户端内置的 AI 助手。请随时向我提问，我会通过当前激活的线路与 Key 调用底层模型为您服务。', model: 'Claude 3.5 Sonnet', time: '14:20' },
])
let chatIdCounter = 2
const sendChatbotMessage = () => {
  const text = chatbotInput.value.trim()
  if (!text) return
  chatbotMessages.value.push({ id: chatIdCounter++, role: 'user', content: text, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) })
  chatbotInput.value = ''
  setTimeout(() => {
    chatbotMessages.value.push({ id: chatIdCounter++, role: 'assistant', content: `这是来自 **${chatbotModel.value}** 的模拟响应。在真实环境中，此请求会通过当前激活的线路（${activeProfile.value.endpoint}）转发至上游模型。`, model: chatbotModel.value, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) })
  }, 600)
}
const chatbotQuickPrompts = ['💬 简单对话', '💻 代码编写', '📄 文档整理', '🌐 翻译润色']
</script>

<template>
  <div class="desktop-client h-screen w-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans">
    
    <!-- 桌面背景遮罩 -->
    <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-md"></div>

    <!-- 顶部返回退出提示 -->
    <router-link to="/demo/portal" class="absolute top-4 left-4 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-white transition-all border border-white/20 flex items-center">
      <span class="mr-1.5 text-sm">←</span> 退出桌面客户端仿真
    </router-link>

    <!-- 模拟 Windows/macOS 客户端主界面窗体 -->
    <div :class="[
      'bg-slate-900/95 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700/80 relative z-10 transition-all duration-300 backdrop-blur-2xl',
      isMaximized ? 'w-full h-full rounded-none border-0' : 'w-[1100px] h-[720px]'
    ]">
      
      <!-- 窗口顶部标题栏 (Window Titlebar) -->
      <div class="h-11 bg-slate-950/80 flex justify-between items-center px-4 border-b border-slate-800 select-none cursor-move">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-md">
            S2
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold tracking-wide text-slate-200">Sub2API Desktop Client</span>
            <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-mono border border-blue-500/30">{{ currentVersion }}</span>
          </div>
        </div>

        <!-- 窗口控制与系统托盘操作区 (2.2.1) -->
        <div class="flex items-center space-x-3">
          <!-- 托盘图标控制组 (Win 右下角 / Mac 状态栏模拟) -->
          <div class="relative">
            <button 
              @click="isTrayOpen = !isTrayOpen" 
              class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span class="w-2 h-2 rounded-full" :class="isProxyEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"></span>
              <span>系统托盘</span>
            </button>

            <!-- 托盘悬浮弹窗 (2.2.1 托盘面板) -->
            <div v-if="isTrayOpen" class="absolute right-0 top-9 z-50 w-72 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-xs">
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div class="font-bold text-white flex items-center gap-1.5">
                  <span>📌 托盘悬浮控制台</span>
                </div>
                <span class="text-[10px] text-slate-400 font-mono">127.0.0.1:{{ activeProfile.port }}</span>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                  <span>本地代理状态</span>
                  <button 
                    @click="isProxyEnabled = !isProxyEnabled; showToast(isProxyEnabled ? '🟢 代理守护进程已启动' : '⚪ 代理已被手动关停')"
                    :class="['px-3 py-1 rounded-lg font-bold transition-all text-xs', isProxyEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400']"
                  >
                    {{ isProxyEnabled ? '运行中' : '已关停' }}
                  </button>
                </div>

                <div>
                  <div class="text-[11px] text-slate-400 mb-1.5">当前生效线路 (单击无感热切换):</div>
                  <div class="space-y-1.5 max-h-36 overflow-y-auto">
                    <div 
                      v-for="p in profiles" 
                      :key="p.id"
                      @click="switchProfile(p)"
                      :class="['p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between', p.active ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 text-slate-400']"
                    >
                      <div class="truncate mr-2">{{ p.name }}</div>
                      <span v-if="p.active" class="text-xs">✓</span>
                    </div>
                  </div>
                </div>

                <div class="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                  <button @click="runSpeedtest(); activeTab = 'speedtest'" class="hover:text-blue-400">⚡ 测速大盘</button>
                  <button @click="activeTab = 'traffic'" class="hover:text-blue-400">🔍 查看抓包</button>
                  <button @click="isTrayOpen = false" class="hover:text-slate-200">收起</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Windows 窗口控制按钮 -->
          <div class="flex items-center space-x-1 border-l border-slate-800 pl-2">
            <button class="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-md text-slate-400 transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
            <button @click="isMaximized = !isMaximized" class="w-7 h-7 flex items-center justify-center hover:bg-slate-800 rounded-md text-slate-400 transition-colors">
              <div class="w-2.5 h-2.5 border-2 border-current rounded-xs"></div>
            </button>
            <router-link to="/demo/portal" class="w-7 h-7 flex items-center justify-center hover:bg-red-600 hover:text-white rounded-md text-slate-400 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 客户端主体区 (侧边栏 + 内容面板) -->
      <div class="flex-1 flex overflow-hidden">
        
        <!-- 左侧功能导航侧边栏 -->
        <div class="w-56 bg-slate-950/60 border-r border-slate-800/80 flex flex-col justify-between p-3 select-none">
          <div class="space-y-1">
            <div class="px-3 py-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
              客户端功能导航 (2.2)
            </div>

            <button 
              @click="activeTab = 'chatbot'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'chatbot' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">🤖</span>
                <span>聊天机器人</span>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">2.2.7</span>
            </button>

            <button 
              @click="activeTab = 'profiles'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'profiles' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">🔀</span>
                <span>线路/Key 切换</span>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">2.2.2</span>
            </button>

            <button 
              @click="activeTab = 'inject'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'inject' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">🔌</span>
                <span>环境一键注入</span>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">2.2.3</span>
            </button>

            <button 
              @click="activeTab = 'speedtest'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'speedtest' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">📊</span>
                <span>延迟测速大盘</span>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">2.2.4</span>
            </button>

            <button 
              @click="activeTab = 'traffic'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'traffic' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">🔍</span>
                <span>日志与白话抓包</span>
              </div>
              <span class="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono">2.2.6</span>
            </button>

            <button 
              @click="activeTab = 'settings'"
              :class="['w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all', activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200']"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">⚙️</span>
                <span>版本与更新</span>
              </div>
              <span v-if="hasUpdate" class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </button>
          </div>

          <!-- 底部当前生效 Profile 卡片提示 -->
          <div class="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
            <div class="text-[10px] text-slate-500 font-mono mb-1">当前激活线路 (2.2.2)</div>
            <div class="font-bold text-white truncate">{{ activeProfile.name }}</div>
            <div class="text-[10px] text-blue-400 font-mono mt-1">{{ activeProfile.keyMasked }}</div>
          </div>
        </div>

        <!-- 右侧主内容展示面板 -->
        <div class="flex-1 bg-slate-900/60 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          
          <!-- TAB 2: 多节点/多账号快捷切换 (2.2.2) -->
          <div v-if="activeTab === 'profiles'" class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">子项 2.2.2</span>
                <h3 class="text-lg font-bold text-white">多线路 / 多账号快捷切换</h3>
              </div>
              <p class="text-xs text-slate-400">
                预设多套本平台线路与 Key 配置。支持通过滑动开关或点击卡片秒级无感热重载，无需重启客户端或修改复杂配置文件。
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div 
                v-for="p in profiles" 
                :key="p.id"
                :class="[
                  'p-5 rounded-2xl border transition-all flex items-center justify-between',
                  p.active ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/10' : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600'
                ]"
              >
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-sm text-white">{{ p.name }}</h4>
                    <span v-if="p.isVIP" class="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">VIP专线</span>
                    <span v-if="p.active" class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>当前生效中</span>
                    </span>
                  </div>
                  <div class="text-xs text-slate-400 font-mono flex items-center gap-3">
                    <span>Key: {{ p.keyMasked }}</span>
                    <span>Endpoint: {{ p.endpoint }}</span>
                    <span>监听端口: :{{ p.port }}</span>
                  </div>
                </div>

                <button 
                  @click="switchProfile(p)"
                  :disabled="p.active"
                  :class="[
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md',
                    p.active ? 'bg-emerald-600 text-white cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  ]"
                >
                  {{ p.active ? '✓ 已激活' : '切换至此线路' }}
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 3: 环境检测与配置一键注入 (2.2.3) -->
          <div v-else-if="activeTab === 'inject'" class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">子项 2.2.3</span>
                <h3 class="text-lg font-bold text-white">本地 AI 环境检测与配置一键注入</h3>
              </div>
              <p class="text-xs text-slate-400">
                客户端内置环境检测引擎，自动识别扫描本地已安装的 AI 客户端与开发 CLI，一键将当前生效的 API Base URL 与 Key 自动注入到工具配置文件中。
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="tool in envTools" :key="tool.id" class="p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2.5">
                      <span class="text-2xl">{{ tool.icon }}</span>
                      <h4 class="font-bold text-sm text-white">{{ tool.name }}</h4>
                    </div>
                    <span v-if="tool.detected" class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-semibold">🟢 已检测到安装</span>
                    <span v-else class="px-2 py-0.5 bg-slate-700 text-slate-400 rounded-full text-[10px]">⚪ 未检测到</span>
                  </div>
                  <div class="text-xs text-slate-400 font-mono mb-4">
                    配置文件路径: {{ tool.configPath }}
                  </div>
                </div>

                <button 
                  @click="injectConfig(tool)"
                  :disabled="!tool.detected"
                  :class="[
                    'w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md',
                    tool.bound ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : tool.detected ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                  ]"
                >
                  <span v-if="tool.bound">✓ 已成功绑定本平台配置</span>
                  <span v-else-if="tool.detected">🔌 一键绑定本平台 Key 与 Base URL</span>
                  <span v-else>未安装此环境</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 4: 图形化延迟测速大盘 (2.2.4) -->
          <div v-else-if="activeTab === 'speedtest'" class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">子项 2.2.4</span>
                  <h3 class="text-lg font-bold text-white">图形化并发延迟测速大盘</h3>
                </div>
                <p class="text-xs text-slate-400">
                  高精度并发测试各个网关入口线路响应延迟，色块直观展示健康度并自动推荐最佳线路。
                </p>
              </div>

              <button 
                @click="runSpeedtest"
                :disabled="isTestingSpeed"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>⚡ {{ isTestingSpeed ? '测速中...' : '发起并发 Ping 测速' }}</span>
              </button>
            </div>

            <!-- 色块大盘 Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="node in speedtestNodes" 
                :key="node.id"
                :class="[
                  'p-5 rounded-2xl border transition-all flex items-center justify-between',
                  node.status === 'fast' ? 'bg-emerald-950/20 border-emerald-500/50' : node.status === 'good' ? 'bg-amber-950/20 border-amber-500/50' : 'bg-red-950/20 border-red-500/50'
                ]"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">{{ node.region }}</span>
                    <h4 class="font-bold text-sm text-white">{{ node.name }}</h4>
                    <span v-if="node.recommended" class="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold">🏆 智能推荐首选</span>
                  </div>
                  <div class="text-xs text-slate-400">
                    并发请求响应标准差 ≤ 5ms
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-2xl font-black font-mono" :class="node.status === 'fast' ? 'text-emerald-400' : node.status === 'good' ? 'text-amber-400' : 'text-red-400'">
                    {{ node.latency }} <span class="text-xs">ms</span>
                  </div>
                  <span class="text-[10px] font-bold uppercase" :class="node.status === 'fast' ? 'text-emerald-400' : node.status === 'good' ? 'text-amber-400' : 'text-red-400'">
                    {{ node.status === 'fast' ? '极速线路 (<100ms)' : node.status === 'good' ? '良好 (100-300ms)' : '超时/高延迟' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 5: 排查指引与日志抓包 (2.2.6) -->
          <div v-else-if="activeTab === 'traffic'" class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">子项 2.2.6</span>
                <h3 class="text-lg font-bold text-white">排查指引与可视化日志抓包视窗</h3>
              </div>
              <p class="text-xs text-slate-400">
                监听本地代理端口 (:10808) 请求流量。报错时自动将晦涩的技术 HTTP 状态码转换为小白看懂的【白话分析卡片】。
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- 左侧请求抓包列表 -->
              <div class="lg:col-span-2 space-y-2">
                <div class="text-xs font-bold text-slate-400 px-1 mb-2 flex justify-between">
                  <span>本地抓包实时流 (Local Proxy Log)</span>
                  <span class="font-mono text-blue-400">Listening on 127.0.0.1:10808</span>
                </div>

                <div 
                  v-for="log in proxyLogs" 
                  :key="log.id"
                  @click="selectedLog = log"
                  :class="[
                    'p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs',
                    selectedLog?.id === log.id ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-800/50 border-slate-700/70 hover:bg-slate-800'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-slate-400 text-[11px]">{{ log.time }}</span>
                    <span class="px-1.5 py-0.5 bg-slate-700 text-slate-200 rounded font-mono font-bold text-[10px]">{{ log.method }}</span>
                    <span class="font-mono text-slate-200 truncate max-w-[200px]">{{ log.path }}</span>
                  </div>

                  <div class="flex items-center gap-3 font-mono">
                    <span :class="log.status === 200 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'">HTTP {{ log.status }}</span>
                    <span class="text-slate-400 text-[11px]">{{ log.durationMs }}ms</span>
                  </div>
                </div>
              </div>

              <!-- 右侧白话排查指引卡片 -->
              <div class="bg-slate-800/70 border border-slate-700 rounded-2xl p-5">
                <h4 class="font-bold text-sm text-white mb-3 flex items-center gap-2">
                  <span>💡 错误白话原因与排查指引</span>
                </h4>

                <div v-if="selectedLog && selectedLog.errorTitle" class="space-y-4">
                  <div class="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">
                    <div class="font-bold text-sm text-red-400 mb-1">❌ 错误分析：{{ selectedLog.errorTitle }}</div>
                    <div>HTTP {{ selectedLog.status }} 拦截</div>
                  </div>

                  <div class="space-y-2 text-xs">
                    <div class="font-bold text-slate-200">🛠️ 小白排查指引助手：</div>
                    <p class="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {{ selectedLog.errorAdvice }}
                    </p>
                  </div>
                </div>
                <div v-else-if="selectedLog" class="p-4 text-center text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  🟢 该请求响应成功 (HTTP 200 OK)，用时 {{ selectedLog.durationMs }}ms，无异常。
                </div>
                <div v-else class="text-xs text-slate-500 text-center py-8">
                  请选择左侧的一条请求日志查看详细分析
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 6: 客户端版本更新 (2.2.5) -->
          <div v-else-if="activeTab === 'settings'" class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono font-bold">子项 2.2.5</span>
                <h3 class="text-lg font-bold text-white">客户端静默更新与版本比对</h3>
              </div>
              <p class="text-xs text-slate-400">
                自动与云端 Release 检查接口比对版本，支持新特性增量下载与热重载。
              </p>
            </div>

            <div class="p-6 bg-slate-800/60 border border-slate-700 rounded-2xl max-w-xl space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-slate-400">当前安装版本</div>
                  <div class="text-xl font-black font-mono text-white">{{ currentVersion }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">云端最新版本</div>
                  <div class="text-xl font-black font-mono text-blue-400">{{ latestVersion }}</div>
                </div>
              </div>

              <div v-if="hasUpdate" class="p-4 bg-blue-950/40 border border-blue-500/40 rounded-xl text-xs space-y-2">
                <div class="font-bold text-blue-300">🎉 发现新版本 {{ latestVersion }} 新特性日志：</div>
                <pre class="font-sans text-slate-300 whitespace-pre-line leading-relaxed">{{ updateNotes }}</pre>

                <div v-if="isDownloadingUpdate" class="space-y-1.5 pt-2">
                  <div class="flex justify-between text-[11px] text-blue-300 font-mono">
                    <span>增量下载进度...</span>
                    <span>{{ updateProgress }}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 transition-all duration-300" :style="{ width: `${updateProgress}%` }"></div>
                  </div>
                </div>

                <button 
                  v-else
                  @click="startUpdate"
                  class="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  一键增量静默更新 (支持热重载)
                </button>
              </div>

              <div v-else class="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs text-center font-bold">
                ✓ 当前客户端已是最新版本 ({{ currentVersion }})，无需更新。
              </div>
            </div>
          </div>

          <!-- TAB 7: 聊天机器人客户端 (2.2.7) -->
          <div v-else-if="activeTab === 'chatbot'" class="h-full flex flex-col">
            <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-bold text-white">🤖 聊天机器人客户端</h3>
                  <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-full border border-emerald-500/30">2.2.7 NEW</span>
                </div>
                <p class="text-xs text-slate-400">将网页版对话机器人核心功能移植至桌面客户端，支持模型选择、Prompt 预设、多轮会话。</p>
              </div>
              <select v-model="chatbotModel" class="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none">
                <option v-for="m in chatbotModels" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>

            <!-- Prompt 快捷标签 -->
            <div class="flex gap-2 mb-4">
              <button 
                v-for="tag in chatbotQuickPrompts" 
                :key="tag" 
                @click="chatbotInput = tag.slice(2) + '：'"
                class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-medium transition-all"
              >{{ tag }}</button>
            </div>

            <!-- 消息列表 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 pr-2">
              <div v-for="msg in chatbotMessages" :key="msg.id" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
                <div :class="['max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed', msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-200']">
                  <div v-if="msg.role === 'assistant'" class="text-[10px] text-slate-400 mb-1 font-mono">{{ msg.model }} · {{ msg.time }}</div>
                  <div v-html="msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class=&quot;text-white&quot;>$1</strong>')"></div>
                  <div v-if="msg.role === 'user'" class="text-[10px] text-blue-200 mt-1 text-right font-mono">{{ msg.time }}</div>
                </div>
              </div>
            </div>

            <!-- 输入框 -->
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <textarea 
                v-model="chatbotInput" 
                @keydown.enter.exact.prevent="sendChatbotMessage" 
                rows="2" 
                placeholder="输入消息... (Enter 发送)" 
                class="w-full bg-transparent outline-none text-xs text-white resize-none"
              ></textarea>
              <div class="flex justify-between items-center pt-2 border-t border-slate-800/80">
                <div class="flex items-center gap-3 text-[11px] text-slate-500">
                  <span class="font-mono">模型: {{ chatbotModel }}</span>
                  <span>·</span>
                  <span class="font-mono">线路: {{ activeProfile.name }}</span>
                </div>
                <button @click="sendChatbotMessage" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30">
                  发送
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 全局 Toast 提示 -->
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
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
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
