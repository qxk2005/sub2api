<script setup lang="ts">
/**
 * 2.7.4 API Key 管理 (企业租户门户)
 * 苹果高级灰白配色
 */
import { ref } from 'vue'

interface TenantKey {
  id: string
  name: string
  keyPrefix: string
  env: string
  usedTokens: string
  scope: string
  lastActive: string
  status: 'active' | 'disabled'
}

const keys = ref<TenantKey[]>([
  { id: 'K1', name: 'Production-Main-App', keyPrefix: 'sk-prod-9f8e7d6c5b***', env: '生产环境', usedTokens: '1.2M Tokens', scope: '全量授权模型', lastActive: '2 分钟前', status: 'active' },
  { id: 'K2', name: 'Dev-Testing-01', keyPrefix: 'sk-test-1a2b3c4d5e***', env: '测试环境', usedTokens: '450K Tokens', scope: '仅 GPT-4o Mini', lastActive: '1 天前', status: 'active' },
  { id: 'K3', name: 'Algorithm-Experiment', keyPrefix: 'sk-algo-8a7b6c5d4e***', env: '实验节点', usedTokens: '890K Tokens', scope: 'Claude 3.5 Sonnet', lastActive: '3 小时前', status: 'active' }
])

const newKeyForm = ref({ name: '', scope: '不限制 (全量模型)', quota: 1000000 })
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const submitCreateKey = () => {
  if (!newKeyForm.value.name) return
  const newKey: TenantKey = {
    id: `K${keys.value.length + 1}`,
    name: newKeyForm.value.name,
    keyPrefix: `sk-tenant-${Math.floor(1000 + Math.random() * 9000)}***`,
    env: '生产环境',
    usedTokens: '0 Tokens',
    scope: newKeyForm.value.scope,
    lastActive: '刚刚',
    status: 'active'
  }
  keys.value.unshift(newKey)
  newKeyForm.value = { name: '', scope: '不限制 (全量模型)', quota: 1000000 }
  triggerToast(`✓ 成功生成新企业 API Key【${newKey.name}】！`)
}

const copyKey = (k: TenantKey) => {
  triggerToast(`✓ 已成功复制【${k.name}】全量 Key 到剪贴板！`)
}
</script>

<template>
  <div class="tenant-keys p-6 md:p-8 font-sans space-y-6 relative selection:bg-blue-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">API Key 操作成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200/80">
        <span>🔑 2.7.4 组织级 API Key 管理中心</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">企业 API 密钥管理</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">管理全公司各研发团队、线上系统及生产部署环境的 API 访问授权凭证。</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左侧：Key 列表 -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="k in keys" 
          :key="k.id"
          class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm relative overflow-hidden space-y-4 transition-all hover:border-blue-400"
        >
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-slate-900 dark:text-white text-base">{{ k.name }}</h3>
                <span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-200">
                  {{ k.env }}
                </span>
              </div>
              <div class="font-mono text-xs text-blue-600 bg-slate-50 dark:bg-dark-900 p-3 rounded-2xl border border-slate-200/60 flex justify-between items-center mt-2">
                <span class="font-bold">{{ k.keyPrefix }}</span>
                <button @click="copyKey(k)" class="text-blue-600 hover:underline text-xs font-sans font-bold">复制 Key</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-dark-700 text-xs">
            <div>
              <div class="text-[11px] text-slate-400">消耗额度 (本月)</div>
              <div class="font-bold text-slate-900 dark:text-white font-mono mt-0.5">{{ k.usedTokens }}</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-400">模型白名单权限</div>
              <div class="font-bold text-slate-900 dark:text-white mt-0.5">{{ k.scope }}</div>
            </div>
            <div>
              <div class="text-[11px] text-slate-400">最近活跃调用</div>
              <div class="font-bold text-slate-900 dark:text-white mt-0.5">{{ k.lastActive }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：创建面板 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm p-6 space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-dark-700">
          + 生成新企业 API Key
        </h3>
        
        <div class="space-y-3 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">Key 命名名称 <span class="text-red-500">*</span></label>
            <input 
              v-model="newKeyForm.name"
              type="text" 
              placeholder="例如: 财务部 AI 数据服务" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none focus:border-blue-500"
            />
          </div>
          
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">授权模型白名单</label>
            <select v-model="newKeyForm.scope" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none font-bold">
              <option value="不限制 (全量模型)">不限制 (使用租户所有模型)</option>
              <option value="仅文本模型 (GPT-4o, Claude)">仅文本大模型</option>
              <option value="仅轻量模型 (GPT-4o Mini)">仅轻量级模型</option>
            </select>
          </div>
          
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">额度限制 (Tokens)</label>
            <input v-model.number="newKeyForm.quota" type="number" step="100000" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl font-mono outline-none" />
          </div>
        </div>
        
        <div class="pt-2">
          <button 
            @click="submitCreateKey"
            :disabled="!newKeyForm.name"
            :class="['w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm', !newKeyForm.name ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800']"
          >
            确认生成 Key
          </button>
        </div>
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
