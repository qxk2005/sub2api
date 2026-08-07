<script setup lang="ts">
/**
 * 2.4.1 官网首页
 */
</script>

<template>
  <div class="portal-home bg-slate-50 dark:bg-slate-950 font-sans selection:bg-purple-100">
    <!-- Hero Section -->
    <section class="relative pt-24 pb-32 overflow-hidden">
      <!-- 硅基流动极光装饰背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-slate-50 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/40 -z-10"></div>
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div class="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-3.5 py-1 rounded-full text-xs font-bold border border-purple-200/80 dark:border-purple-800/60 shadow-sm mb-8">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span>SiliconFlow 架构 ｜ V3.0 全新升级</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
          聚合全球顶尖大模型<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">一次接入，无界调用</span>
        </h1>
        
        <p class="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          极速、稳定、低成本的企业级 AI 模型 API 中转调度平台。支持 OpenAI、Claude、Gemini 全系模型，提供四级多租户管理与可视化账单。
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-bold text-base transition-transform hover:scale-105 shadow-lg shadow-purple-500/25">
            免费注册试用
          </button>
          <router-link to="/demo/portal/docs" class="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full font-bold text-base hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-200 transition-colors shadow-sm">
            查看接入文档
          </router-link>
        </div>
      </div>
    </section>

    <!-- 核心痛点与价值主张 (Features) -->
    <section class="py-24 bg-white dark:bg-slate-900 border-t border-purple-100/60 dark:border-purple-900/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">为什么选择 Sub2API？</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-sm">直击企业 AI 接入痛点，提供完整的商业化聚合分发解决方案</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- 痛点 1 -->
          <div class="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🔄
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">多协议自动转换</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              告别繁琐的异构 API 适配。只需一个标准的 Base URL，自动为您转换 OpenAI、Claude、Gemini、Grok 等多种协议。
            </p>
          </div>
          <!-- 痛点 2 -->
          <div class="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              ⚡️
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">安全合规与内容护栏</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              内置安全敏感词双向拦截护栏，对接网信办标准词库，输入输出实时过滤，500+ QPS 高并发下合规拦截率 99.97%。
            </p>
          </div>
          <!-- 痛点 3 -->
          <div class="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/60 dark:hover:border-purple-500/80 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/60 rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🏢
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">四级多租户管理</h3>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              首创"平台-代理-企业-员工"四级分层控制，支持组织级数据物理隔离、细粒度权限配置与多级穿透分账核算。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 演示入口引导 (SiliconFlow 冰晶浅紫风，去除强黑底) -->
    <section class="py-20 bg-gradient-to-br from-purple-50 via-violet-50/70 to-purple-100/60 dark:from-purple-950/50 dark:via-purple-900/30 dark:to-slate-900 text-slate-900 dark:text-white rounded-[3rem] mx-4 sm:mx-8 mb-12 shadow-sm overflow-hidden relative border border-purple-200/80 dark:border-purple-800/50">
      <div class="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-black text-[#5622d6] dark:text-purple-300 mb-6">全终端无缝接入体验</h2>
        <p class="text-slate-600 dark:text-slate-300 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
          除标准 API 外，我们还提供开箱即用的网页对话机器人与桌面一键部署客户端，满足非技术人员的 AI 办公需求。
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/demo/portal/chatbot" class="px-8 py-3 bg-[#6e29f6] hover:bg-[#581cd6] text-white rounded-full font-bold transition-all shadow-md shadow-purple-500/25">
            体验网页对话机器人
          </router-link>
          <router-link to="/demo/desktop" class="px-8 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-purple-50 rounded-full font-bold transition-colors border border-purple-200/80 dark:border-purple-800/50">
            体验 Windows 客户端
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
