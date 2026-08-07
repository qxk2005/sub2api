<script setup lang="ts">
/**
 * FRS V3.0 2.4.2 模型广场 (精美紫罗兰冰晶 SaaS 极简设计)
 * 采用清爽冰晶紫白渐变背景、Hero 大胶囊搜索框、多维模型类型/应用场景 Pills 标签及精美纯白模型卡片
 */
import { ref, computed } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()

// 筛选状态
const searchQuery = ref('')
const selectedType = ref('all') // 'all' | 'chat' | 'code' | 'embed' | 'image' | 'audio'
const selectedScenario = ref('all') // 'all' | 'rag' | 'vibe' | 'translation' | 'summary'
const selectedProvider = ref('all') // 'all' | 'DeepSeek' | 'Qwen' | 'Meta' | 'OpenAI' | 'Anthropic' | 'Google' | 'BAAI'
const sortBy = ref<'default' | 'price' | 'date'>('default')

// 热门搜索关键词
const hotKeywords = ['DeepSeek-R1-Pro', 'Qwen2.5-72B-Instruct', 'GLM-5.2', 'Kimi-K2.7-Code', 'MiniMax-M2.5']

// 拷贝提示
const copiedModelId = ref<string | null>(null)
const copyModelId = (id: string) => {
  copiedModelId.value = id
  navigator.clipboard?.writeText(id)
  setTimeout(() => copiedModelId.value = null, 2000)
}

// 过滤后的模型
const filteredModels = computed(() => {
  let list = demoStore.models.filter(m => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)
    const matchCat = selectedType.value === 'all' || 
                     (selectedType.value === 'chat' && m.category === 'LLM') ||
                     (selectedType.value === 'code' && m.capability.some(c => c.includes('代码'))) ||
                     (selectedType.value === 'embed' && m.category === 'Embedding') ||
                     (selectedType.value === 'image' && m.category === 'Image')
    const matchProv = selectedProvider.value === 'all' || m.provider === selectedProvider.value
    return matchQ && matchCat && matchProv
  })

  if (sortBy.value === 'price') {
    list.sort((a, b) => a.price.input - b.price.input)
  }
  return list
})

// Modal Playground 弹窗
const isModalOpen = ref(false)
const targetModel = ref<any>(null)
const activeLanguage = ref<'python' | 'curl' | 'nodejs'>('python')
const copyCodeNotice = ref(false)

const openAccessModal = (m: any) => {
  targetModel.value = m
  isModalOpen.value = true
}

const copyCodeSnippet = () => {
  copyCodeNotice.value = true
  setTimeout(() => copyCodeNotice.value = false, 2000)
}
</script>

<template>
  <div class="portal-models min-h-screen bg-gradient-to-b from-[#f3effe] via-[#f8f7ff] to-white dark:from-[#0d091e] dark:via-[#0c0f1d] dark:to-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-purple-200">
    
    <!-- 1. Header Hero 区域 (清爽紫白，无强黑) -->
    <div class="relative pt-12 pb-16 overflow-hidden">
      <!-- 柔和紫色背景 Floating Orbs 悬浮流光球 -->
      <div class="absolute top-10 left-1/4 w-72 h-72 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-20 right-1/4 w-80 h-80 bg-violet-200/40 dark:bg-violet-950/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
        
        <!-- 大标题 -->
        <h1 class="text-4xl md:text-6xl font-black text-[#5622d6] dark:text-purple-300 tracking-tight">
          你要的 AI 模型，这里都有
        </h1>
        
        <!-- 副标题 -->
        <p class="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium">
          1 个 API，3 行代码，100+ 主流模型轻松调用
        </p>

        <!-- 大胶囊形搜索框 (SiliconFlow Pill Search Bar) -->
        <div class="max-w-2xl mx-auto pt-2">
          <div class="relative flex items-center bg-white dark:bg-slate-900 rounded-full p-2 shadow-xl shadow-purple-500/10 border border-purple-200/80 dark:border-purple-800/60 focus-within:border-[#6e29f6] focus-within:ring-4 focus-within:ring-purple-500/15 transition-all">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="具备超强上下文、代码能力的模型..." 
              class="w-full pl-6 pr-24 py-2.5 bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium"
              @keyup.enter="searchQuery = searchQuery"
            />
            <button 
              @click="searchQuery = searchQuery"
              class="absolute right-2 px-6 py-2.5 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-purple-500/30 flex items-center gap-1.5"
            >
              <span>✨ 搜索</span>
            </button>
          </div>

          <!-- 热门模型 Pills 推荐 -->
          <div class="flex items-center justify-center gap-2 mt-4 flex-wrap text-xs">
            <span class="text-slate-400 font-semibold text-[11px]">热门模型:</span>
            <button 
              v-for="kw in hotKeywords" 
              :key="kw"
              @click="searchQuery = kw"
              class="px-3 py-1 bg-white/80 dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-600 dark:text-slate-300 rounded-full border border-purple-100 dark:border-purple-900/40 transition-all font-mono text-[11px] hover:border-purple-300"
            >
              {{ kw }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- 2. 多维分类与应用场景 Pills 筛选区 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      
      <div class="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-purple-100/80 dark:border-purple-900/40 shadow-sm backdrop-blur-xl space-y-4">
        
        <!-- 行一：模型类型 (LLM / 对话 / 扩展 / 代码 / 图像 / 音频) -->
        <div class="flex items-center gap-3 flex-wrap text-xs">
          <span class="text-slate-400 font-mono text-[11px] w-16">模型类型:</span>
          <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <button 
              v-for="t in [
                { id: 'all', label: '全部' },
                { id: 'chat', label: '对话' },
                { id: 'code', label: '代码' },
                { id: 'embed', label: '向量' },
                { id: 'image', label: '生图' },
                { id: 'audio', label: '音频' }
              ]"
              :key="t.id"
              @click="selectedType = t.id"
              :class="[
                'px-4 py-1.5 rounded-xl font-bold transition-all border text-xs',
                selectedType === t.id 
                  ? 'bg-purple-50 dark:bg-purple-950/80 text-[#6e29f6] dark:text-purple-300 border-[#6e29f6] shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800 hover:bg-purple-50/50'
              ]"
            >
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- 行二：应用场景 (RAG / 代码工程 / 文案写作 / 长文摘要 / 语音合成) -->
        <div class="flex items-center gap-3 flex-wrap text-xs border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <span class="text-slate-400 font-mono text-[11px] w-16">应用场景:</span>
          <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <button 
              v-for="s in [
                { id: 'all', label: '全部' },
                { id: 'rag', label: 'RAG 知识库' },
                { id: 'vibe', label: 'Vibe Coding 代码' },
                { id: 'summary', label: '长文摘要 / 润色' },
                { id: 'translation', label: '多语言翻译' }
              ]"
              :key="s.id"
              @click="selectedScenario = s.id"
              :class="[
                'px-3.5 py-1.5 rounded-xl font-medium transition-all border text-xs',
                selectedScenario === s.id 
                  ? 'bg-purple-50 dark:bg-purple-950/80 text-[#6e29f6] dark:text-purple-300 border-[#6e29f6]' 
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800'
              ]"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- 行三：厂商筛选 + 排序 -->
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs">
          <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span class="text-slate-400 font-mono text-[11px] w-16">厂商品牌:</span>
            <button 
              v-for="p in ['all', 'DeepSeek', 'Qwen', 'Meta', 'OpenAI', 'Anthropic', 'Google', 'BFL', 'BAAI']" 
              :key="p"
              @click="selectedProvider = p"
              :class="[
                'px-3 py-1 rounded-lg font-bold transition-all border text-[11px]',
                selectedProvider === p 
                  ? 'bg-[#6e29f6] text-white border-transparent shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:bg-purple-50 hover:text-purple-600'
              ]"
            >
              {{ p === 'all' ? '全部厂商' : p }}
            </button>
          </div>

          <div class="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>排序:</span>
            <select v-model="sortBy" class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 outline-none">
              <option value="default">默认推荐</option>
              <option value="price">按价格由低到高</option>
            </select>
          </div>
        </div>

      </div>

      <!-- 3. SiliconFlow 标志性纯白模型卡片 Grid (Model Cards Matrix) -->
      <div class="flex justify-between items-center px-1">
        <h2 class="text-xl font-black text-slate-900 dark:text-white">发现并使用最适合你的 AI 模型</h2>
        <span class="text-xs text-slate-500 font-mono">共检索出 <strong>{{ filteredModels.length }}</strong> 款模型</span>
      </div>

      <div v-if="filteredModels.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- 单个 Model Card (完全参考 SiliconFlow 纯白小卡片设计) -->
        <div 
          v-for="model in filteredModels" 
          :key="model.id" 
          @click="openAccessModal(model)"
          class="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-purple-100/90 dark:border-purple-900/30 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <!-- 卡片头栏：厂商 Icon + 右侧「托管」/「免费」Tag -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-[#6e29f6] dark:text-purple-300 font-black flex items-center justify-center text-[11px] border border-purple-200/50">
                  {{ model.provider.substring(0, 2).toUpperCase() }}
                </span>
                <span class="text-xs font-bold text-slate-400 font-mono">{{ model.provider.toLowerCase() }}</span>
              </div>
              <span class="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 rounded-md text-[10px] font-bold border border-sky-200/60 dark:border-sky-800/40">
                {{ model.isFree ? '免费' : '托管' }}
              </span>
            </div>

            <!-- 模型 ID (含一键复制) -->
            <div class="flex items-center justify-between mt-1 mb-3">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#6e29f6] transition-colors truncate max-w-[200px]" :title="model.id">
                {{ model.id }}
              </h3>
              <button 
                @click.stop="copyModelId(model.id)" 
                class="text-slate-400 hover:text-[#6e29f6] p-1 text-xs transition-colors"
                :title="copiedModelId === model.id ? '已复制！' : '复制 Model ID'"
              >
                {{ copiedModelId === model.id ? '✓ 已复制' : '📋' }}
              </button>
            </div>

            <!-- 发布时间 -->
            <div class="text-[10px] text-slate-400 font-mono mt-1 mb-3">
              发布时间: {{ model.releaseDate || '2026年03月' }}
            </div>

            <!-- 能力气泡 Pills (如 Vibe Coding, 深度推理) -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span v-for="cap in model.capability" :key="cap" class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-[#6e29f6] dark:text-purple-300 rounded-md text-[10px] font-bold">
                {{ cap }}
              </span>
            </div>
          </div>

          <!-- 卡片底栏：单价 -->
          <div class="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-[11px] font-mono">
            <div class="text-slate-500">
              输入: <strong class="text-slate-900 dark:text-white">{{ model.isFree ? '免费' : `¥${model.price.input.toFixed(2)}` }}</strong> <span class="text-[9px] font-normal text-slate-400">/ M Tokens</span>
            </div>
            <div class="text-slate-500">
              输出: <strong class="text-slate-900 dark:text-white">{{ model.isFree ? '免费' : `¥${model.price.output.toFixed(2)}` }}</strong> <span class="text-[9px] font-normal text-slate-400">/ M Tokens</span>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- Playground Modal 弹窗 (零代码集成) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full border border-purple-200 dark:border-purple-900/50 shadow-2xl space-y-5">
        
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-[#6e29f6]"></span>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
              ⚡ 快速接入模型：{{ targetModel?.id }}
            </h3>
          </div>
          <button @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="p-3.5 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/50 rounded-2xl text-[#6e29f6] dark:text-purple-300 leading-relaxed font-medium">
            💡 Sub2API 完全兼容 OpenAI 标准协议。修改 Base URL 为中转地址即可 3 行代码无缝接入。
          </div>

          <div class="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button 
              v-for="lang in ['python', 'curl', 'nodejs']" 
              :key="lang"
              @click="activeLanguage = lang as any"
              :class="[
                'px-3.5 py-1 rounded-lg font-mono font-bold uppercase transition-all',
                activeLanguage === lang ? 'bg-[#6e29f6] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              ]"
            >
              {{ lang }}
            </button>
          </div>

          <div class="space-y-1 font-mono">
            <pre v-if="activeLanguage === 'python'" class="p-4 bg-slate-950 text-slate-200 rounded-2xl text-[11px] overflow-x-auto border border-slate-800 leading-relaxed"><code>from openai import OpenAI

client = OpenAI(
    api_key="sk-sub2api-your-api-key",
    base_url="https://core.cnfcloud.com/v1"
)

response = client.chat.completions.create(
    model="{{ targetModel?.id }}",
    messages=[{"role": "user", "content": "你好，请自我介绍！"}]
)
print(response.choices[0].message.content)</code></pre>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <button @click="copyCodeSnippet" class="px-5 py-2.5 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 transition-all">
            {{ copyCodeNotice ? '✓ 已复制代码' : '📋 复制请求代码' }}
          </button>
          <button @click="isModalOpen = false" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            关闭
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(110, 41, 246, 0.3);
  border-radius: 10px;
}
</style>
