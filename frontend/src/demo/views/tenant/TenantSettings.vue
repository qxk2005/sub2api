<script setup lang="ts">
/**
 * 2.7 企业租户 - 系统设置
 * 苹果高级灰白配色
 */
import { ref } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
const tenantName = ref(demoStore.tenant.name)

const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const saveSettings = () => {
  demoStore.tenant.name = tenantName.value
  triggerToast("✓ 成功更新企业/组织基础配置！")
}
</script>

<template>
  <div class="tenant-settings p-6 md:p-8 font-sans space-y-6 relative selection:bg-blue-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">系统设置更新成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3.5 py-1 rounded-full text-xs font-bold border border-slate-200">
        <span>⚙️ 2.7.1 企业租户基础参数设置</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">企业与组织基础配置</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">管理租户身份名称、所属代理节点、数据隔离等级及合规选项。</p>
    </div>

    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 max-w-2xl space-y-5 text-xs">
      <div class="space-y-1">
        <label class="font-bold text-slate-700 dark:text-slate-300">企业/组织名称 <span class="text-red-500">*</span></label>
        <input 
          v-model="tenantName" 
          type="text" 
          class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none focus:border-blue-500 font-bold" 
        />
      </div>
      
      <div class="space-y-1">
        <label class="font-bold text-slate-700 dark:text-slate-300">企业全局 ID (Tenant ID)</label>
        <input 
          :value="demoStore.tenant.id" 
          type="text" 
          disabled 
          class="w-full p-2.5 bg-slate-100 dark:bg-dark-900 text-slate-400 border border-slate-200 dark:border-dark-700 rounded-xl font-mono cursor-not-allowed" 
        />
        <p class="text-[10px] text-slate-400">系统生成的不可变企业唯一标识符。</p>
      </div>

      <div class="space-y-1">
        <label class="font-bold text-slate-700 dark:text-slate-300">数据隔离与保护级别</label>
        <div class="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 rounded-2xl flex items-center space-x-2 text-blue-700">
          <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span class="font-bold">独立租户级别控制与加密密钥隔离 (Level-3 Strict Isolation)</span>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-dark-700 flex justify-end">
        <button 
          @click="saveSettings" 
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-2xs transition-all"
        >
          保存设置更改
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
