<script setup lang="ts">
/**
 * 企业租户 - 系统设置
 */
</script>

<template>
  <div class="tenant-settings p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">企业设置</h1>
      <p class="text-slate-500 text-sm mt-1">管理您的租户级基础配置信息。</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">企业/组织名称</label>
          <input type="text" value="示例科技有限公司" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">企业标识 (Tenant ID)</label>
          <input type="text" value="TENANT_DEMO_001" disabled class="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 text-sm font-mono cursor-not-allowed">
          <p class="mt-1 text-xs text-slate-500">系统唯一标识，不可修改。</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">数据隔离级别</label>
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center">
            <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            <span class="text-sm font-medium text-slate-700">逻辑隔离 (当前套餐支持)</span>
          </div>
          <p class="mt-1 text-xs text-slate-500">升级至企业版可解锁物理资源隔离方案。</p>
        </div>

        <div class="border-t border-slate-100 pt-6">
          <button class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            保存更改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
