<script setup lang="ts">
/**
 * FRS V3.0 2.4.5 关于/联系我们：企业信息与客服联系方式
 * 具备企业背书、SLA 保障说明与在线客服/提交工单 Demo 弹窗
 */
import { ref } from 'vue'

const isContactModalOpen = ref(false)
const contactForm = ref({
  name: '',
  company: '',
  email: '',
  message: ''
})

const isSubmitted = ref(false)

const submitTicket = () => {
  if (!contactForm.value.email || !contactForm.value.message) return
  isSubmitted.value = true
  setTimeout(() => {
    isSubmitted.value = false
    isContactModalOpen.value = false
    contactForm.value = { name: '', company: '', email: '', message: '' }
  }, 2000)
}
</script>

<template>
  <div class="portal-about pt-10 pb-24 bg-slate-50 dark:bg-dark-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
      
      <!-- 头部标题 -->
      <div class="text-center space-y-4 max-w-3xl mx-auto">
        <div class="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-900/60 shadow-2xs">
          <span>🏢 2.4.5 关于我们与客服通道</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          连接未来，<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">赋能企业 AI 智能化转型</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Sub2API 致力于构建最稳定、高效的企业级 AI 模型网关与商业化聚合分发中台。
        </p>
      </div>

      <!-- 企业与 SLA 核心承诺 -->
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-6 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl space-y-2 shadow-sm">
          <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold">🎯</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">企业使命</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            解决异构大模型 API 协议碎片化、账号管理混乱、成本不可控与网络延迟痛点，提供标准化统一路由器。
          </p>
        </div>

        <div class="p-6 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl space-y-2 shadow-sm">
          <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold">⚡️</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">SLA 99.9% 稳定保障</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            多机房节点冗余，Engine A 故障自动熔断与秒级 Failover 重试，保障业务连续性。
          </p>
        </div>

        <div class="p-6 bg-white dark:bg-dark-800 border border-slate-200/80 dark:border-dark-700 rounded-3xl space-y-2 shadow-sm">
          <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold">🛡️</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">四级数据隔离</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            首创平台-代理-企业-员工四级分层架构，支持数据物理隔离、提示词安全审计与多级穿透分账。
          </p>
        </div>
      </div>

      <!-- 联系客服与技术支持 -->
      <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 class="text-xl font-bold">联系我们 / 客服通道 (2.4.5)</h3>
            <p class="text-xs text-slate-400 mt-1">我们的专业技术架构师团队全天候在线为您解答私有化部署与对接问题</p>
          </div>
          <button @click="isContactModalOpen = true" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs transition-all shadow-lg shadow-blue-600/30">
            ✉️ 在线提交客服工单 (2.4.5)
          </button>
        </div>

        <div class="grid sm:grid-cols-3 gap-6 text-xs">
          <div class="p-4 bg-white/10 rounded-2xl space-y-1">
            <div class="text-slate-400">🏢 商务合作与私有化:</div>
            <div class="font-bold font-mono text-sm text-blue-300">business@sub2api.com</div>
          </div>
          <div class="p-4 bg-white/10 rounded-2xl space-y-1">
            <div class="text-slate-400">🔧 技术支持与 SLA 工单:</div>
            <div class="font-bold font-mono text-sm text-indigo-300">support@sub2api.com</div>
          </div>
          <div class="p-4 bg-white/10 rounded-2xl space-y-1">
            <div class="text-slate-400">💬 官方 Telegram 频道:</div>
            <div class="font-bold font-mono text-sm text-emerald-300">@Sub2API_Official</div>
          </div>
        </div>
      </div>

    </div>

    <!-- 在线提交工单 Modal 弹窗 (2.4.5) -->
    <div v-if="isContactModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-4">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">✉️ 提交技术支持工单 (2.4.5)</h3>
          <button @click="isContactModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div v-if="!isSubmitted" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold mb-1 text-slate-700 dark:text-slate-300">联系人姓名：</label>
            <input v-model="contactForm.name" type="text" placeholder="例如：张经理" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none" />
          </div>
          <div>
            <label class="block font-bold mb-1 text-slate-700 dark:text-slate-300">企业/团队名称：</label>
            <input v-model="contactForm.company" type="text" placeholder="例如：科技创新有限公司" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none" />
          </div>
          <div>
            <label class="block font-bold mb-1 text-slate-700 dark:text-slate-300">联系邮箱 *：</label>
            <input v-model="contactForm.email" type="email" placeholder="name@company.com" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none" />
          </div>
          <div>
            <label class="block font-bold mb-1 text-slate-700 dark:text-slate-300">咨询或反馈内容 *：</label>
            <textarea v-model="contactForm.message" rows="3" placeholder="请详细描述您的技术接入需求或问题..." class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl outline-none resize-none"></textarea>
          </div>

          <button @click="submitTicket" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-md">
            提交工单并通知技术客服
          </button>
        </div>

        <div v-else class="py-8 text-center space-y-3 animate-fade-in">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ✓
          </div>
          <div class="font-bold text-slate-900 dark:text-white text-base">工单已成功接收！</div>
          <p class="text-xs text-slate-500">客服工程师将在 15 分钟内通过邮件给您回复。</p>
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
