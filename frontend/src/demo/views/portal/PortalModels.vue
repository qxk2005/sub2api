<script setup lang="ts">
/**
 * FRS V3.0 2.4.2 模型广场 (支持的模型列表、能力说明与封面展示)
 * 具备精致 3D / AI Cover 封面展示、多品牌筛选与零代码接入指导
 */
import { ref, computed } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()

// 搜索与筛选
const searchQuery = ref('')
const selectedProvider = ref('all')

// 实时过滤模型列表
const filteredModels = computed(() => {
  return demoStore.models.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        m.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchProvider = selectedProvider.value === 'all' || m.provider === selectedProvider.value
    return matchSearch && matchProvider
  })
})

// 按供应商分组
const modelsByProvider = computed(() => {
  const map: Record<string, typeof demoStore.models> = {}
  filteredModels.value.forEach(m => {
    if (!map[m.provider]) map[m.provider] = []
    map[m.provider].push(m)
  })
  return map
})

// 代码接入 Modal
const isModalOpen = ref(false)
const targetModel = ref<any>(null)

const openAccessModal = (m: any) => {
  targetModel.value = m
  isModalOpen.value = true
}

const copySuccessNotice = ref(false)
const copySnippet = () => {
  copySuccessNotice.value = true
  setTimeout(() => copySuccessNotice.value = false, 2500)
}
</script>

<template>
  <div class="portal-models pt-10 pb-24 bg-slate-50 dark:bg-dark-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      
      <!-- 1. 头部 Banner 与价值主张 (已彻底清除“透明公开资费”字样) -->
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <div class="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200/80 dark:border-blue-900/60 shadow-2xs">
          <span>✨ 2.4.2 全球 AI 模型广场</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          聚合全球顶尖 AI 大模型 <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">全系统一接入</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400">
          一站式接入 OpenAI、Claude、Gemini、DeepSeek、Grok 全系大模型。统一 API 协议，开箱即用。
        </p>
      </div>

      <!-- 2. 搜索框与品牌筛选 Tab 栏 (苹果灰白卡片风格) -->
      <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-dark-800 p-4 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
        
        <!-- 品牌筛选 Tab -->
        <div class="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0">
          <button 
            v-for="p in ['all', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'xAI']" 
            :key="p"
            @click="selectedProvider = p"
            :class="['px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all', selectedProvider === p ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-dark-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80']"
          >
            {{ p === 'all' ? '全部品牌' : p }}
          </button>
        </div>

        <!-- 搜索输入框 -->
        <div class="relative min-w-[260px]">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索模型名称或 ID (如 gpt-4o)..." 
            class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <!-- 3. 按供应商分组展示模型卡片 Grid (包含高质感 Cover 封面图片) -->
      <div v-for="(modelsList, provider) in modelsByProvider" :key="provider" class="space-y-4">
        <div class="flex items-center space-x-3 border-b border-slate-200/80 dark:border-dark-700 pb-2">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ provider }} 专区</h2>
          <span class="px-2.5 py-0.5 bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-mono font-bold">{{ modelsList.length }} 款可用模型</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="model in modelsList" 
            :key="model.id" 
            class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between overflow-hidden"
          >
            <!-- 顶部模型 Cover 封面图片 -->
            <div class="h-36 w-full overflow-hidden relative bg-slate-900">
              <img 
                :src="model.cover" 
                :alt="model.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              
              <!-- 推荐角标 -->
              <div v-if="model.badge" class="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-10">
                {{ model.badge }}
              </div>

              <!-- Cover 上挂载的模型名称 -->
              <div class="absolute bottom-3 left-4 text-white">
                <h3 class="text-lg font-black tracking-tight drop-shadow-md">{{ model.name }}</h3>
                <code class="text-[11px] text-blue-200 font-mono opacity-90 block">{{ model.id }}</code>
              </div>
            </div>

            <!-- 卡片下半部分内容 -->
            <div class="p-5 space-y-4 flex-1 flex flex-col justify-between">
              
              <!-- 上下文上限与能力标签 -->
              <div class="space-y-3">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-slate-400 font-mono text-[10px]">上下文长度</span>
                  <span class="bg-slate-100 dark:bg-dark-900 px-2.5 py-0.5 rounded-lg text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 font-bold">
                    {{ model.context }}
                  </span>
                </div>

                <div class="flex flex-wrap gap-1.5">
                  <span v-for="cap in model.capability" :key="cap" class="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-bold border border-blue-100 dark:border-blue-900/60">
                    {{ cap }}
                  </span>
                </div>
              </div>

              <!-- 价格资费区 -->
              <div class="border-t border-slate-100 dark:border-dark-700 pt-3 space-y-3">
                <div class="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-dark-900 p-3 rounded-2xl text-xs font-mono border border-slate-200/60 dark:border-dark-700">
                  <div>
                    <div class="text-[10px] text-slate-400">输入 (Input)</div>
                    <div class="text-slate-900 dark:text-white font-bold">
                      ¥{{ model.price.input.toFixed(2) }} <span class="text-[9px] text-slate-400 font-normal">/1M</span>
                    </div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400">输出 (Output)</div>
                    <div class="text-slate-900 dark:text-white font-bold">
                      {{ model.price.output > 0 ? `¥${model.price.output.toFixed(2)} /1M` : '免费' }}
                    </div>
                  </div>
                </div>

                <!-- 快速接入按钮 -->
                <button 
                  @click="openAccessModal(model)"
                  class="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                >
                  <span>⚡ 快速接入此模型</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- 代码接入 Modal (2.4.3 零代码集成与示例) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚡ 接入模型：{{ targetModel?.name }}</span>
          </h3>
          <button @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-blue-700 dark:text-blue-300">
            💡 提示：Sub2API 完全兼容 OpenAI 标准 API 格式。修改 Base URL 与 API Key 即可零成本接入。
          </div>

          <div class="space-y-1 font-mono">
            <div class="text-slate-500">统一请求 Base URL:</div>
            <div class="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-bold">
              https://core.cnfcloud.com/v1
            </div>
          </div>

          <div class="space-y-1 font-mono">
            <div class="text-slate-500">Python (OpenAI SDK) 示例代码:</div>
            <pre class="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] overflow-x-auto"><code>from openai import OpenAI

client = OpenAI(
  api_key="sk-sub2api-your-key",
  base_url="https://core.cnfcloud.com/v1"
)
response = client.chat.completions.create(
  model="{{ targetModel?.id }}",
  messages=[{"role": "user", "content": "Hello!"}]
)</code></pre>
          </div>
        </div>

        <div class="flex justify-between items-center pt-2">
          <button @click="copySnippet" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors">
            {{ copySuccessNotice ? '✓ 已复制代码片段' : '📋 复制请求代码' }}
          </button>
          <button @click="isModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
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
</style>
