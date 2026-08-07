<script setup lang="ts">
/**
 * FRS V3.0 2.4.5 关于/联系我们：企业信息与客服联系方式
 * 1:1 SiliconFlow 清爽冰晶紫白风格，无强黑色块
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
  <div class="portal-about pt-10 pb-24 bg-gradient-to-b from-[#f3effe] via-[#f8f7ff] to-white dark:from-[#0d091e] dark:to-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-purple-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
      
      <!-- 头部标题 -->
      <div class="text-center space-y-4 max-w-3xl mx-auto">
        <div class="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/60 text-[#6e29f6] dark:text-purple-300 px-3.5 py-1 rounded-full text-xs font-bold border border-purple-200/80 dark:border-purple-800/60 shadow-xs">
          <span>🏢 2.4.5 关于我们与客服通道</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          连接未来，<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">赋能企业 AI 智能化转型</span>
        </h1>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
          Sub2API 致力于构建最稳定、高效的企业级 AI 模型网关与商业化聚合分发中台。
        </p>
      </div>

      <!-- 企业与 SLA 核心承诺 -->
      <div class="grid md:grid-cols-3 gap-6">
        <div class="p-6 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-3xl space-y-2 shadow-xs">
          <div class="w-10 h-10 bg-purple-50 text-[#6e29f6] rounded-2xl flex items-center justify-center text-xl font-bold border border-purple-100">🎯</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">企业使命</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            解决异构大模型 API 协议碎片化、账号管理混乱、成本不可控与网络延迟痛点，提供标准化统一路由器。
          </p>
        </div>

        <div class="p-6 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-3xl space-y-2 shadow-xs">
          <div class="w-10 h-10 bg-purple-50 text-[#6e29f6] rounded-2xl flex items-center justify-center text-xl font-bold border border-purple-100">⚡️</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">SLA 99.9% 稳定保障</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            多机房节点冗余，安全敏感词双向合规护栏实时过滤，故障自动熔断与秒级 Failover 重试，保障业务连续性。
          </p>
        </div>

        <div class="p-6 bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/30 rounded-3xl space-y-2 shadow-xs">
          <div class="w-10 h-10 bg-purple-50 text-[#6e29f6] rounded-2xl flex items-center justify-center text-xl font-bold border border-purple-100">🛡️</div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">四级数据隔离</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            首创平台-代理-企业-员工四级分层架构，支持数据物理隔离、提示词安全审计与多级穿透分账。
          </p>
        </div>
      </div>

      <!-- 联系客服与技术支持 (SiliconFlow 冰晶浅紫风，去除强黑底) -->
      <div class="bg-gradient-to-br from-purple-50 via-violet-50/70 to-purple-100/60 dark:from-purple-950/50 dark:via-purple-900/30 dark:to-slate-900 text-slate-900 dark:text-white rounded-3xl p-8 shadow-xs border border-purple-200/80 dark:border-purple-800/50 space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-200/60 dark:border-purple-800/40 pb-4">
          <div>
            <h3 class="text-xl font-black text-[#5622d6] dark:text-purple-300">联系我们 / 客服通道 (2.4.5)</h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">我们的专业技术架构师团队全天候在线为您解答私有化部署与对接问题</p>
          </div>
          <button @click="isContactModalOpen = true" class="px-5 py-2.5 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-2xl font-bold text-xs transition-all shadow-md shadow-purple-500/25">
            ✉️ 在线提交客服工单 (2.4.5)
          </button>
        </div>

        <div class="grid sm:grid-cols-3 gap-6 text-xs">
          <div class="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl space-y-1 border border-purple-100/80 dark:border-purple-900/40 shadow-xs">
            <div class="text-slate-400 font-semibold">🏢 商务合作与私有化:</div>
            <div class="font-bold font-mono text-sm text-[#6e29f6] dark:text-purple-300">business@sub2api.com</div>
          </div>
          <div class="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl space-y-1 border border-purple-100/80 dark:border-purple-900/40 shadow-xs">
            <div class="text-slate-400 font-semibold">🔧 技术支持与 SLA 工单:</div>
            <div class="font-bold font-mono text-sm text-[#6e29f6] dark:text-purple-300">support@sub2api.com</div>
          </div>
          <div class="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl space-y-1 border border-purple-100/80 dark:border-purple-900/40 shadow-xs">
            <div class="text-slate-400 font-semibold">💬 官方 Telegram 频道:</div>
            <div class="font-bold font-mono text-sm text-[#6e29f6] dark:text-purple-300">@Sub2API_Official</div>
          </div>
        </div>
      </div>

    </div>

    <!-- 客服工单 Demo Modal 弹窗 -->
    <div v-if="isContactModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-purple-200 dark:border-purple-900/50 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✉️ 提交工单咨询 (2.4.5)</span>
          </h3>
          <button @click="isContactModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div v-if="!isSubmitted" class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">联系人姓名 / 公司:</label>
            <input v-model="contactForm.name" type="text" placeholder="如: 张经理 (某大模型科技)" class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">工作邮箱 (必填):</label>
            <input v-model="contactForm.email" type="email" placeholder="name@company.com" class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500" />
          </div>

          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">需求与问题描述:</label>
            <textarea v-model="contactForm.message" rows="3" placeholder="请简述私有化部署规模、QPS 需求或定制功能..." class="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500"></textarea>
          </div>

          <button @click="submitTicket" class="w-full py-3 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-2xl font-bold transition-all shadow-md shadow-purple-500/25">
            提交给 Sub2API 架构师团队
          </button>
        </div>

        <div v-else class="py-8 text-center space-y-3">
          <div class="w-12 h-12 bg-purple-100 text-[#6e29f6] rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ✓
          </div>
          <div class="font-bold text-slate-900 dark:text-white text-base">工单已成功提交！</div>
          <p class="text-xs text-slate-500">架构师团队将在 2 小时内给您的邮箱回复联系方案。</p>
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
