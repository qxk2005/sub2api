<script setup lang="ts">
/**
 * 2.4.2 模型广场
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="portal-models pt-12 pb-24 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- 头部标题 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">模型广场</h1>
        <p class="text-lg text-slate-500">一站式接入全球最先进的 AI 基础模型</p>
      </div>

      <!-- 按供应商分组展示模型 -->
      <div v-for="(models, provider) in demoStore.modelsByProvider" :key="provider" class="mb-16">
        <div class="flex items-center space-x-3 mb-8">
          <h2 class="text-2xl font-bold text-slate-800">{{ provider }}</h2>
          <span class="px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-md text-xs font-medium">{{ models.length }} 个模型</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="model in models" :key="model.id" class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative group">
            
            <!-- 推荐角标 -->
            <div v-if="model.badge" class="absolute -top-3 -right-3 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm z-10 transform rotate-3">
              {{ model.badge }}
            </div>

            <!-- 模型名称与上下文 -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ model.name }}</h3>
                <code class="text-xs text-slate-400 mt-1 block">{{ model.id }}</code>
              </div>
              <div class="bg-slate-50 px-2 py-1 rounded text-xs font-mono text-slate-500 border border-slate-100" title="上下文长度">
                {{ model.context }}
              </div>
            </div>

            <!-- 能力标签 -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="cap in model.capability" :key="cap" class="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[11px] font-medium border border-blue-100">
                {{ cap }}
              </span>
            </div>

            <!-- 价格信息 (分割线以上) -->
            <div class="border-t border-slate-100 pt-4">
              <div class="text-xs text-slate-500 mb-1">价格 (每 1M Tokens)</div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-[10px] text-slate-400">输入</div>
                  <div class="font-mono text-slate-900 font-medium">¥{{ model.price.input.toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400">输出</div>
                  <div class="font-mono text-slate-900 font-medium">{{ model.price.output > 0 ? `¥${model.price.output.toFixed(2)}` : '免费' }}</div>
                </div>
              </div>
            </div>
            
            <!-- 隐藏的接入按钮，hover 显示 -->
            <div class="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white via-white to-transparent translate-y-2 group-hover:translate-y-0 rounded-b-2xl">
              <button class="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                查看接入文档
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
