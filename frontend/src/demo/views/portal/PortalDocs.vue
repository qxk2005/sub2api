<script setup lang="ts">
/**
 * FRS V3.0 2.4.3 文档中心 (安装教程、使用指南、API 文档与 FAQ 知识库)
 * 具备交互式多语言 SDK 切换、结构化文档导航与 FAQ 常见问题解答
 */
import { ref } from 'vue'

const activeCategory = ref<'quickstart' | 'api' | 'desktop' | 'faq'>('quickstart')
const activeDocId = ref('get-started')
const selectedLanguage = ref<'python' | 'curl' | 'nodejs' | 'go'>('python')

const docSearchQuery = ref('')

// Toast Notification
const copiedNotice = ref(false)
const copySnippet = () => {
  copiedNotice.value = true
  setTimeout(() => copiedNotice.value = false, 2500)
}
</script>

<template>
  <div class="portal-docs pt-8 pb-20 bg-slate-50 dark:bg-dark-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      
      <!-- 头部 Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-2">
          <div class="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold font-mono">
            📚 2.4.3 开发者文档 & 知识库中心
          </div>
          <h1 class="text-3xl font-extrabold tracking-tight">快速接入与 API 指南</h1>
          <p class="text-xs text-blue-100 max-w-xl">
            提供 Python、Node.js、cURL、Go 等全语言 SDK 请求示例，客户端一键部署配置及常见问题排查（FAQ）。
          </p>
        </div>

        <div class="relative w-full md:w-72">
          <input 
            v-model="docSearchQuery"
            type="text" 
            placeholder="搜索文档内容/API/错误码..." 
            class="w-full pl-9 pr-4 py-2 bg-white/10 backdrop-blur border border-white/20 text-white placeholder-blue-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-white/40"
          />
          <svg class="w-4 h-4 text-blue-200 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <!-- 主文档结构 (侧边栏 + 内容区) -->
      <div class="grid md:grid-cols-12 gap-8 items-start">
        
        <!-- 左侧多维文档导航树 -->
        <aside class="md:col-span-3 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl p-4 shadow-sm space-y-6 text-xs font-semibold">
          
          <div>
            <div class="text-[10px] font-bold text-slate-400 font-mono mb-2 px-2 uppercase">🚀 快速开始</div>
            <div class="space-y-1">
              <button 
                @click="activeDocId = 'get-started'; activeCategory = 'quickstart'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'get-started' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                三步极速接入指南
              </button>
              <button 
                @click="activeDocId = 'keys'; activeCategory = 'quickstart'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'keys' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                获取 API Key 凭证
              </button>
            </div>
          </div>

          <div>
            <div class="text-[10px] font-bold text-slate-400 font-mono mb-2 px-2 uppercase">📡 API 接口参考</div>
            <div class="space-y-1">
              <button 
                @click="activeDocId = 'chat-api'; activeCategory = 'api'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'chat-api' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                Chat Completions 对话 API
              </button>
              <button 
                @click="activeDocId = 'embeddings'; activeCategory = 'api'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'embeddings' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                Embeddings 向量接口
              </button>
            </div>
          </div>

          <div>
            <div class="text-[10px] font-bold text-slate-400 font-mono mb-2 px-2 uppercase">💻 客户端部署 (2.2)</div>
            <div class="space-y-1">
              <button 
                @click="activeDocId = 'desktop-inject'; activeCategory = 'desktop'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'desktop-inject' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                环境检测与一键配置注入
              </button>
            </div>
          </div>

          <div>
            <div class="text-[10px] font-bold text-slate-400 font-mono mb-2 px-2 uppercase">❓ 常见问题与 FAQ</div>
            <div class="space-y-1">
              <button 
                @click="activeDocId = 'faq-list'; activeCategory = 'faq'"
                :class="['w-full text-left p-2.5 rounded-xl transition-all', activeDocId === 'faq-list' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60' : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300']"
              >
                常见错误码与解决排查
              </button>
            </div>
          </div>

        </aside>

        <!-- 右侧文档正文显示区 -->
        <main class="md:col-span-9 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl p-6 md:p-8 shadow-sm min-h-[550px] space-y-6">
          
          <!-- 1. 三步极速接入文档 -->
          <div v-if="activeDocId === 'get-started'" class="space-y-6">
            <div class="border-b border-slate-100 dark:border-dark-700 pb-4">
              <span class="text-xs text-blue-600 font-bold font-mono">快速开始 / 接入指南</span>
              <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1">三步零改造无缝接入 Sub2API</h2>
              <p class="text-xs text-slate-500 mt-1">兼容 OpenAI 标准报文协议，只需修改 Base URL 和 API Key。</p>
            </div>

            <!-- 步骤 1 -->
            <div class="space-y-2">
              <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>统一中网关 Base URL 替换</span>
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300">将您的 SDK 或软件工具中的基准请求地址替换为：</p>
              <div class="p-3 bg-slate-900 text-blue-400 rounded-xl font-mono text-xs font-bold flex justify-between items-center">
                <span>https://core.cnfcloud.com/v1</span>
                <button @click="copySnippet" class="text-[11px] text-slate-400 hover:text-white">复制</button>
              </div>
            </div>

            <!-- 步骤 2 -->
            <div class="space-y-2">
              <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">2</span>
                <span>创建 API Key (令牌凭证)</span>
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300">进入租户控制台生成专属的 API 密钥凭证，自动完成权限识别与自动扣费。</p>
            </div>

            <!-- 步骤 3：多语言代码范例切换 -->
            <div class="space-y-3 pt-2">
              <div class="flex justify-between items-center">
                <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-mono">3</span>
                  <span>发起大模型请求代码示例</span>
                </h3>

                <!-- 语言 Tab -->
                <div class="flex items-center gap-1 bg-slate-100 dark:bg-dark-900 p-1 rounded-xl text-xs font-mono">
                  <button 
                    v-for="lang in ['python', 'curl', 'nodejs', 'go']"
                    :key="lang"
                    @click="selectedLanguage = (lang as any)"
                    :class="['px-2.5 py-1 rounded-lg font-bold transition-all', selectedLanguage === lang ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400']"
                  >
                    {{ lang }}
                  </button>
                </div>
              </div>

              <!-- 代码块 -->
              <div class="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-200 relative overflow-x-auto">
                <pre v-if="selectedLanguage === 'python'"><code>from openai import OpenAI

client = OpenAI(
    api_key="sk-sub2api-your-key",
    base_url="https://core.cnfcloud.com/v1"
)

response = client.chat.completions.create(
    model="claude-3-5-sonnet", # 无缝调用 Claude 3.5
    messages=[{"role": "user", "content": "用 Python 写快速排序"}]
)
print(response.choices[0].message.content)</code></pre>

                <pre v-else-if="selectedLanguage === 'curl'"><code>curl https://core.cnfcloud.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-sub2api-your-key" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello Sub2API!"}]
  }'</code></pre>

                <pre v-else-if="selectedLanguage === 'nodejs'"><code>import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-sub2api-your-key',
  baseURL: 'https://core.cnfcloud.com/v1',
});

const response = await openai.chat.completions.create({
  model: 'deepseek-v3',
  messages: [{ role: 'user', content: 'Sub2API 接入节点测试' }],
});
console.log(response.choices[0].message.content);</code></pre>

                <pre v-else-if="selectedLanguage === 'go'"><code>package main

import (
	"context"
	"fmt"
	"github.com/sashabaranov/go-openai"
)

func main() {
	config := openai.DefaultConfig("sk-sub2api-your-key")
	config.BaseURL = "https://core.cnfcloud.com/v1"
	client := openai.NewClientWithConfig(config)
    // 更多 Golang 请求逻辑...
}</code></pre>
              </div>
            </div>
          </div>

          <!-- FAQ 常见问题 -->
          <div v-else-if="activeDocId === 'faq-list'" class="space-y-4">
            <div class="border-b border-slate-100 dark:border-dark-700 pb-3">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">常见问题与错误排查 (FAQ)</h2>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-dark-700 space-y-1">
                <div class="font-bold text-slate-900 dark:text-white">Q: 出现 HTTP 402 Insufficient Quota 提示？</div>
                <p class="text-slate-500">代表您的当前 API Key 或企业租户配额余额已耗尽，请进入「定价方案」或在控制台充值购买配额包。</p>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-dark-700 space-y-1">
                <div class="font-bold text-slate-900 dark:text-white">Q: 出现 HTTP 429 Rate Limit Exceeded 提示？</div>
                <p class="text-slate-500">代表当前模型的并发请求数超过了通道限制，智能引擎已自动为您进行多渠道 Failover 重试中。</p>
              </div>
            </div>
          </div>

          <div v-else class="py-12 text-center text-slate-400 text-xs">
            正在载入文档 【{{ activeDocId }}】 内容...
          </div>

        </main>
      </div>

    </div>
  </div>
</template>
