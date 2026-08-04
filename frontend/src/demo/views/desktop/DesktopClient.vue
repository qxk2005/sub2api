<script setup lang="ts">
/**
 * 2.2 Windows 桌面端仿真 (Web 实现版)
 */
import { ref } from 'vue'

const isMaximized = ref(false)
const isChatActive = ref(true)

// 简单的拖拽状态模拟
</script>

<template>
  <div class="desktop-client h-screen w-full bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center flex items-center justify-center p-8 overflow-hidden relative">
    
    <!-- 桌面背景遮罩 -->
    <div class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"></div>

    <!-- 顶部退出提示 -->
    <router-link to="/demo/portal" class="absolute top-4 left-4 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-slate-800 hover:bg-white flex items-center transition-colors">
      <span class="mr-2">←</span> 退出桌面仿真
    </router-link>

    <!-- 模拟 Windows 窗口 -->
    <div :class="[
      'bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 relative z-10 transition-all duration-300',
      isMaximized ? 'w-full h-full rounded-none border-0' : 'w-[1000px] h-[700px]'
    ]">
      
      <!-- 自定义窗口标题栏 -->
      <div class="h-10 bg-slate-100 flex justify-between items-center px-4 border-b border-slate-200 select-none cursor-move">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded"></div>
          <span class="text-xs font-semibold text-slate-700">Sub2API Desktop</span>
        </div>
        
        <!-- Windows 风格控制按钮 -->
        <div class="flex items-center space-x-2 -mr-2">
          <button class="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
          </button>
          <button @click="isMaximized = !isMaximized" class="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded text-slate-500 transition-colors">
            <div class="w-3 h-3 border-2 border-current rounded-sm"></div>
          </button>
          <router-link to="/demo/portal" class="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white rounded text-slate-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </router-link>
        </div>
      </div>

      <!-- 客户端主界面区 -->
      <div class="flex-1 flex overflow-hidden bg-white">
        <!-- 极简侧边栏 -->
        <div class="w-16 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 space-y-4">
          <button @click="isChatActive = true" :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-colors', isChatActive ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200']">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </button>
          <button :class="['w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors']" title="知识库管理">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </button>
          <button :class="['w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors']" title="快捷指令">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </button>
          
          <div class="mt-auto pb-2">
            <div class="w-8 h-8 rounded-full bg-slate-300 border-2 border-white shadow-sm cursor-pointer"></div>
          </div>
        </div>

        <!-- 对话内容区 -->
        <div class="flex-1 flex flex-col relative" v-if="isChatActive">
          
          <!-- 悬浮的快捷方式演示 -->
          <div class="absolute top-4 right-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg shadow-sm z-10 flex items-center">
            <span class="font-bold mr-1">Alt + 空格</span> 随时唤起系统级对话框
          </div>

          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 class="font-bold text-slate-800 text-lg">新对话</h2>
              <div class="text-xs text-slate-500 flex items-center mt-1 cursor-pointer hover:text-slate-700">
                当前模型: <span class="font-bold text-blue-600 mx-1">GPT-4o</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <button class="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
          </div>

          <!-- 对话流空状态 -->
          <div class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-3xl shadow-sm">
              ✨
            </div>
            <h3 class="text-xl font-bold text-slate-700 mb-2">今天需要什么帮助？</h3>
            <p class="text-slate-500 text-sm max-w-sm mb-8">
              您可以直接输入文本，或者拖拽任意文件（PDF、图片、代码）到此处进行分析。
            </p>
            <div class="flex gap-4">
              <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm hover:shadow transition-shadow flex items-center">
                <span class="mr-2">📄</span> 总结文档
              </button>
              <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm hover:shadow transition-shadow flex items-center">
                <span class="mr-2">💻</span> 代码审查
              </button>
              <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm hover:shadow transition-shadow flex items-center">
                <span class="mr-2">🖼️</span> 图像分析
              </button>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="p-4 bg-white border-t border-slate-100">
            <div class="border border-slate-300 rounded-xl bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all p-3">
              <textarea 
                rows="2" 
                placeholder="给大模型发送消息... (试试拖拽文件进来)" 
                class="w-full bg-transparent outline-none resize-none text-slate-800 text-sm"
              ></textarea>
              <div class="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50">
                <div class="flex space-x-1">
                  <button class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors" title="上传附件">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  </button>
                  <button class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors" title="屏幕截图">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </button>
                </div>
                <button class="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow hover:bg-slate-800 transition-colors">
                  发送
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
