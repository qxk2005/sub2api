<script setup lang="ts">
/**
 * 2.10.2 专属号池
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="agent-pools p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">代理专属号池</h1>
      <p class="text-slate-500 text-sm mt-1">查看平台为您分配的专属物理隔离号池资源及运行状态。</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <div v-for="(pool, idx) in demoStore.agent.pools" :key="idx" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center">
                {{ pool.name }}
                <span class="ml-2 px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-xs font-medium">
                  {{ pool.status }}
                </span>
              </h3>
              <p class="text-xs text-slate-500 mt-1">此号池仅供您及您的下级客户路由调度使用</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div class="text-xs text-slate-500 mb-1">包含模型数</div>
              <div class="font-bold text-slate-900">{{ pool.models.length }}</div>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div class="text-xs text-slate-500 mb-1">底层 Key 数量</div>
              <div class="font-bold text-slate-900">{{ pool.keys }}</div>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div class="text-xs text-slate-500 mb-1">并发上限 (QPS)</div>
              <div class="font-bold text-slate-900">{{ pool.qps }}</div>
            </div>
            <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div class="text-xs text-slate-500 mb-1">负载均衡策略</div>
              <div class="font-bold text-slate-900 text-sm mt-0.5">自适应延迟轮询</div>
            </div>
          </div>
          
          <div class="mt-6 pt-4 border-t border-slate-100">
            <div class="text-xs text-slate-500 mb-2">支持模型：</div>
            <div class="flex flex-wrap gap-2">
              <span v-for="m in pool.models" :key="m" class="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 shadow-sm">{{ m }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
