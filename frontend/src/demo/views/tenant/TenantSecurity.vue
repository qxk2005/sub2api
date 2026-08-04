<script setup lang="ts">
/**
 * 2.7.5 登录安全与审计
 */
</script>

<template>
  <div class="tenant-security p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">登录与安全</h1>
      <p class="text-slate-500 text-sm mt-1">配置组织级安全策略与访问控制。</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <!-- 身份认证策略 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50">
          <h3 class="font-bold text-slate-900">身份认证策略</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-slate-900 mb-1">强制双因素认证 (2FA)</div>
              <div class="text-sm text-slate-500">要求所有子账号在登录时必须进行 2FA 验证</div>
            </div>
            <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-6 shadow-sm"></div>
            </div>
          </div>
          
          <div class="border-t border-slate-100 pt-6 flex items-center justify-between">
            <div>
              <div class="font-medium text-slate-900 mb-1">密码强度要求</div>
              <div class="text-sm text-slate-500">强制要求大小写字母、数字与特殊字符组合</div>
            </div>
            <div class="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-6 shadow-sm"></div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-6 flex items-center justify-between">
            <div>
              <div class="font-medium text-slate-900 mb-1">SSO 单点登录</div>
              <div class="text-sm text-slate-500">通过企业 OIDC / SAML 协议统一登录</div>
            </div>
            <button class="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
              配置 SSO
            </button>
          </div>
        </div>
      </div>

      <!-- 网络访问控制 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-slate-50">
          <h3 class="font-bold text-slate-900">网络访问控制</h3>
        </div>
        <div class="p-6">
          <div class="mb-4">
            <div class="font-medium text-slate-900 mb-1">IP 白名单</div>
            <div class="text-sm text-slate-500 mb-3">仅允许以下 IP 或网段访问控制台和调用 API。留空则不限制。</div>
            <textarea class="w-full border border-slate-300 rounded-lg p-3 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="一行一个 IP 或 CIDR 网段，例如:
192.168.1.100
10.0.0.0/24">112.45.67.89
10.24.0.0/16</textarea>
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            保存白名单
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
