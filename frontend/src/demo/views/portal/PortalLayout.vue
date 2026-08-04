<script setup lang="ts">
/**
 * 官网门户 (2.4) 布局框架
 */
import DemoNavBar from '../../components/DemoNavBar.vue'
</script>

<template>
  <div class="portal-layout min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-blue-100">
    <DemoNavBar />
    
    <!-- 官网内部专属导航 -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-[53px] z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            S2A
          </div>
          <span class="font-bold text-lg tracking-tight">Sub2API <span class="text-slate-400 font-normal">| 聚合分发中台</span></span>
        </div>
        <nav class="hidden md:flex items-center space-x-8 text-sm font-medium">
          <router-link to="/demo/portal" class="text-slate-600 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">首页</router-link>
          <router-link to="/demo/portal/models" class="text-slate-600 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">模型广场</router-link>
          <router-link to="/demo/portal/pricing" class="text-slate-600 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">定价方案</router-link>
          <router-link to="/demo/portal/docs" class="text-slate-600 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">文档中心</router-link>
          <router-link to="/demo/portal/about" class="text-slate-600 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">关于我们</router-link>
        </nav>
        <div class="flex items-center space-x-4">
          <router-link to="/demo/portal/chatbot" class="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            网页对话机器人
          </router-link>
          <button class="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
            免费试用
          </button>
        </div>
      </div>
    </header>

    <!-- 子页面路由出口 -->
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 官网公共页脚 -->
    <footer class="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 class="font-semibold text-slate-900 mb-4">产品</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>模型广场</li>
            <li>API 文档</li>
            <li>定价方案</li>
            <li>桌面客户端</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 mb-4">解决方案</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>企业私有化</li>
            <li>代理分销</li>
            <li>开发者赋能</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 mb-4">资源</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>博客与动态</li>
            <li>系统状态大盘</li>
            <li>帮助中心</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 mb-4">关于</h4>
          <ul class="space-y-2 text-sm text-slate-500">
            <li>公司介绍</li>
            <li>联系客服</li>
            <li>隐私条款</li>
            <li>服务协议</li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center">
        <p>© 2026 Sub2API. All rights reserved.</p>
        <div class="flex space-x-4 mt-4 sm:mt-0">
          <span class="hover:text-slate-600 cursor-pointer">WeChat</span>
          <span class="hover:text-slate-600 cursor-pointer">GitHub</span>
          <span class="hover:text-slate-600 cursor-pointer">Twitter</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
