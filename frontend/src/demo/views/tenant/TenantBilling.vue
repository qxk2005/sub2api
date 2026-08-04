<script setup lang="ts">
/**
 * 2.6.x 财务与账单 (企业租户控制台)
 * 苹果高级灰白配色
 */
import { ref } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()

const isRechargeModalOpen = ref(false)
const rechargeAmount = ref(5000)
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const submitRecharge = () => {
  triggerToast(`✓ 成功申请充值金额 ¥${rechargeAmount.value.toLocaleString()} 元，已提交对接代理商财务！`)
  isRechargeModalOpen.value = false
}
</script>

<template>
  <div class="tenant-billing p-6 md:p-8 font-sans space-y-6 relative selection:bg-blue-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">财务操作成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div>
        <div class="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-200/80">
          <span>💳 2.6 企业财务与月度对账中心</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">企业财务与账单</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">查看消费明细、充值企业可用余额及下载月度对账单。</p>
      </div>

      <button 
        @click="isRechargeModalOpen = true"
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
      >
        <span>+ 充值企业余额</span>
      </button>
    </div>

    <!-- 3大核心卡片 (苹果灰白风) -->
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="text-xs font-bold text-slate-400">当前企业可用余额</div>
        <div class="text-3xl font-black text-slate-900 dark:text-white font-mono">¥24,560.00</div>
        <div class="text-[11px] text-slate-400 font-mono">计费周期: 2026-08-01 ~ 2026-08-31</div>
      </div>
      
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="text-xs font-bold text-slate-400">本月累计预估消费</div>
        <div class="text-3xl font-black text-blue-600 font-mono">¥1,289.50</div>
        <div class="text-[11px] text-emerald-600 font-bold">预测月底结算: ¥2,450.00</div>
      </div>

      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-3">
        <div class="text-xs font-bold text-slate-400">余额预警与自动保护</div>
        <div class="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <div class="flex items-center justify-between">
            <span>余额低于 ¥1000 自动通知管理员</span>
            <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px]">已开启</span>
          </div>
          <div class="flex items-center justify-between">
            <span>欠费无缝切至保底备用节点</span>
            <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px]">保护中</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 账单列表 -->
    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-4">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-700">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white">历史月度对账单</h3>
      </div>
      
      <div class="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th class="px-5 py-3.5">账期</th>
              <th class="px-5 py-3.5">总消耗金额</th>
              <th class="px-5 py-3.5">模型费用分布</th>
              <th class="px-5 py-3.5">状态</th>
              <th class="px-5 py-3.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr v-for="bill in demoStore.tenant.bills" :key="bill.period" class="hover:bg-slate-50">
              <td class="px-5 py-4 font-bold text-slate-900 font-sans">{{ bill.period }}</td>
              <td class="px-5 py-4 font-bold text-slate-900 text-sm">¥{{ bill.total.toFixed(2) }}</td>
              <td class="px-5 py-4 font-sans">
                <div class="flex items-center space-x-2 text-[11px]">
                  <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-bold">GPT-4o: ¥{{ bill.models['GPT-4o']?.toFixed(2) }}</span>
                  <span class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full border border-orange-100 font-bold">Claude: ¥{{ bill.models['Claude 3.5']?.toFixed(2) }}</span>
                </div>
              </td>
              <td class="px-5 py-4 font-sans">
                <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">✓ {{ bill.status }}</span>
              </td>
              <td class="px-5 py-4 text-right font-sans">
                <button @click="triggerToast(`✓ 正在下载 ${bill.period} 阶段对账单 PDF...`)" class="text-blue-600 hover:underline font-bold text-xs">
                  下载 PDF 账单 ↓
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: 充值额度 -->
    <div v-if="isRechargeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">+ 充值企业可用余额</h3>
          <button @click="isRechargeModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-slate-700">充值金额 (元)</label>
            <input v-model.number="rechargeAmount" type="number" step="1000" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm" />
          </div>
          <p class="text-[11px] text-slate-400">提交后系统将直接关联绑定代理商上游账户同步更新配额。</p>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isRechargeModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitRecharge" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">提交申请</button>
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
