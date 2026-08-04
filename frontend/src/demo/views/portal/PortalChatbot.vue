<script setup lang="ts">
/**
 * 2.3 网页版对话机器人 (Chatbot)
 */
import { ref } from 'vue'

const currentModel = ref('Claude 3.5 Sonnet')
const isSidebarOpen = ref(true)

const messages: any = ref([
  { role: 'assistant', content: '您好！我是 Sub2API 驱动的智能助手。您可以选择顶部模型列表中的任何模型与我对话，并且无缝切换。', time: '10:00' },
  { role: 'user', content: '可以给我展示一个基于 Vue 3 的简单计数器代码吗？', time: '10:01' },
  { role: 'assistant', content: "没问题，这里是一个基于 Vue 3 `<script setup>` 的简单计数器：\n\n```vue\n<script setup>\nimport { ref } from 'vue'\nconst count = ref(0)\n<\/script>\n\n<template>\n  <button @click=\"count++\">Count is: {{ count }}</button>\n</template>\n```", time: '10:01' }
])
</script>

<template>
  <div class="portal-chatbot h-screen bg-white flex overflow-hidden">
    <!-- 侧边栏：历史会话 -->
    <aside :class="['w-72 bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300', !isSidebarOpen && '-ml-72']">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 class="font-bold text-slate-800">历史会话</h2>
        <button class="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100">
          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div class="px-2 py-1 text-xs font-semibold text-slate-400 mt-2">今天</div>
        <div class="p-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm cursor-pointer border border-blue-100">
          Vue 3 计数器示例
        </div>
        <div class="p-3 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-sm cursor-pointer transition-colors">
          Rust 异步编程指南
        </div>
        <div class="px-2 py-1 text-xs font-semibold text-slate-400 mt-4">昨天</div>
        <div class="p-3 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-sm cursor-pointer transition-colors">
          翻译：Apple 财报摘要
        </div>
      </div>
      <div class="p-4 border-t border-slate-200 bg-white">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white">U</div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-slate-900 truncate">demo_user</div>
            <div class="text-xs text-slate-500">剩余: 2.1M Tokens</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主对话区 -->
    <main class="flex-1 flex flex-col relative">
      <!-- 顶部控制栏 -->
      <header class="h-16 border-b border-slate-200 flex justify-between items-center px-4 bg-white/80 backdrop-blur-md absolute top-0 left-0 right-0 z-10">
        <div class="flex items-center space-x-4">
          <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-500 hover:text-slate-900 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          
          <div class="relative group cursor-pointer">
            <div class="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
              <span class="font-bold text-slate-800">{{ currentModel }}</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3 text-sm">
          <router-link to="/demo/portal" class="text-slate-500 hover:text-blue-600 transition-colors">返回官网</router-link>
          <button class="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50">分享对话</button>
        </div>
      </header>

      <!-- 消息流 -->
      <div class="flex-1 overflow-y-auto pt-24 pb-8 px-4 md:px-12 scroll-smooth">
        <div class="max-w-3xl mx-auto space-y-8">
          <div v-for="(msg, idx) in messages" :key="idx" class="flex items-start" :class="msg.role === 'user' ? 'justify-end' : ''">
            
            <div v-if="msg.role === 'assistant'" class="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center mr-4 text-white shadow-md">
              AI
            </div>
            
            <div :class="[
              'max-w-[80%] rounded-2xl p-4 shadow-sm relative',
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
            ]">
              <div class="prose prose-sm max-w-none" :class="msg.role === 'user' ? 'prose-invert' : 'prose-slate'">
                <!-- 简单模拟 Markdown 渲染 -->
                <template v-if="msg.content.includes('```')">
                  <div class="whitespace-pre-wrap">{{ msg.content.split('```')[0] }}</div>
                  <pre class="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-xs my-3 font-mono"><code>{{ msg.content.split('```')[1].replace(/^vue\n/, '') }}</code></pre>
                </template>
                <div v-else class="whitespace-pre-wrap">{{ msg.content }}</div>
              </div>
            </div>

            <div v-if="msg.role === 'user'" class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center ml-4 text-slate-600">
              U
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="p-4 bg-gradient-to-t from-white via-white to-transparent">
        <div class="max-w-3xl mx-auto relative">
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5 text-xs text-slate-500 flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>已启用语义缓存，重复问题将秒级响应并免扣费</span>
          </div>
          
          <div class="relative bg-white border border-slate-300 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-shadow">
            <textarea 
              rows="1"
              placeholder="发送消息给大模型... 支持多模态拖拽上传" 
              class="w-full bg-transparent p-4 pr-32 outline-none resize-none min-h-[60px] max-h-32 text-slate-800"
            ></textarea>
            
            <div class="absolute right-2 bottom-2 flex items-center space-x-2">
              <button class="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
              </button>
              <button class="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </div>
          </div>
          <div class="text-center mt-2 text-[10px] text-slate-400">
            由 Sub2API 强力驱动 · 支持 OpenAI 标准协议无缝接入
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
