<script setup lang="ts">
/**
 * 2.4.1 官网首页
 */
</script>

<template>
  <div class="portal-home">
    <!-- Hero Section -->
    <section class="relative pt-24 pb-32 overflow-hidden">
      <!-- 装饰背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 -z-10"></div>
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-8 border border-blue-100 shadow-sm">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>V3.0 全新架构上线</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          聚合全球顶尖大模型<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">一次接入，无界调用</span>
        </h1>
        
        <p class="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          极速、稳定、低成本的企业级 AI 模型 API 中转调度平台。支持 OpenAI、Claude、Gemini 全系模型，提供四级多租户管理与可视化账单。
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button class="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-slate-800 transition-transform hover:scale-105 shadow-lg shadow-slate-900/20">
            免费注册试用
          </button>
          <router-link to="/demo/portal/docs" class="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium text-lg hover:bg-slate-50 transition-colors shadow-sm">
            查看接入文档
          </router-link>
        </div>
      </div>
    </section>

    <!-- 核心痛点与价值主张 (Features) -->
    <section class="py-24 bg-white border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900">为什么选择 Sub2API？</h2>
          <p class="text-slate-500 mt-4 max-w-2xl mx-auto">直击企业 AI 接入痛点，提供完整的商业化聚合分发解决方案</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- 痛点 1 -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div class="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🔄
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">多协议自动转换</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              告别繁琐的异构 API 适配。只需一个标准的 Base URL，自动为您转换 OpenAI、Claude、Gemini、Grok 等多种协议。
            </p>
          </div>
          <!-- 痛点 2 -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div class="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              ⚡️
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">安全合规与内容护栏</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              内置安全敏感词双向拦截护栏，对接网信办标准词库，输入输出实时过滤，500+ QPS 高并发下合规拦截率 99.97%。
            </p>
          </div>
          <!-- 痛点 3 -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
            <div class="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🏢
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">四级多租户管理</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              首创"平台-代理-企业-员工"四级分层控制，支持组织级数据物理隔离、细粒度权限配置与多级穿透分账核算。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 演示入口引导 -->
    <section class="py-20 bg-slate-900 text-white rounded-[3rem] mx-4 sm:mx-8 mb-12 shadow-2xl overflow-hidden relative">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div class="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-6">全终端无缝接入体验</h2>
        <p class="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          除标准 API 外，我们还提供开箱即用的网页对话机器人与桌面一键部署客户端，满足非技术人员的 AI 办公需求。
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/demo/portal/chatbot" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition-colors">
            体验网页对话机器人
          </router-link>
          <router-link to="/demo/desktop" class="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors border border-white/10">
            体验 Windows 客户端
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
