<script setup lang="ts">
/**
 * 2.7.5 登录安全与审计 (企业租户门户)
 * 苹果高级灰白配色
 */
import { ref } from 'vue'

const ipWhitelist = ref("112.45.67.89\n10.24.0.0/16")
const enable2FA = ref(true)

const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const saveIPs = () => {
  triggerToast("✓ 成功更新企业 IP 访问控制白名单！")
}
</script>

<template>
  <div class="tenant-security p-6 md:p-8 font-sans space-y-6 relative selection:bg-blue-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">安全设置更新成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold border border-indigo-200/80">
        <span>🛡️ 2.7.5 企业登录安全与审计管控</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">登录与安全策略</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">配置企业组织级双因素认证 (2FA)、IP 访问白名单及 SSO 单点登录服务。</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 身份认证策略 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-6">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-dark-700">
          🔐 身份认证与 2FA 策略
        </h3>

        <div class="space-y-6 text-xs">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-900 dark:text-white text-sm">强制双因素认证 (2FA)</div>
              <div class="text-slate-400 mt-0.5">要求所有子账号登录控制台时必须通过动态验证码二次确认</div>
            </div>
            <button @click="enable2FA = !enable2FA" :class="['px-3 py-1.5 rounded-xl font-bold text-xs transition-all', enable2FA ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500']">
              {{ enable2FA ? '已开启' : '已关停' }}
            </button>
          </div>
          
          <div class="border-t border-slate-100 dark:border-dark-700 pt-5 flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-900 dark:text-white text-sm">企业 OIDC / SAML SSO 单点登录</div>
              <div class="text-slate-400 mt-0.5">绑定钉钉 / 飞书 / Okta 实现全员一键集成登录</div>
            </div>
            <button @click="triggerToast('✓ 已打开 SSO 协议对接助手')" class="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-bold">
              配置 SSO
            </button>
          </div>
        </div>
      </div>

      <!-- 网络访问控制 -->
      <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-4">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-dark-700">
          🌐 IP 访问限制白名单
        </h3>

        <div class="space-y-3 text-xs">
          <p class="text-slate-500">仅允许以下网段或 IP 地址访问租户控制台与 API 网关调用（每行一个）。</p>
          <textarea 
            v-model="ipWhitelist"
            rows="4" 
            class="w-full bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-2xl p-3 font-mono text-xs outline-none focus:border-blue-500" 
            placeholder="192.168.1.100&#10;10.0.0.0/24"
          ></textarea>

          <button @click="saveIPs" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-2xs">
            保存白名单配置
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
