<script setup lang="ts">
/**
 * 2.7.4 API Key 管理
 */
</script>

<template>
  <div class="tenant-keys p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">组织级 API Key 管理</h1>
        <p class="text-slate-500 text-sm mt-1">管理企业所有项目与应用的 API 访问凭证。</p>
      </div>
      <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center">
        <span class="mr-2 text-lg leading-none">+</span> 创建新 Key
      </button>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- 左侧：列表 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div class="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center">
                Production-Main-App
                <span class="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] uppercase font-bold border border-blue-100">生产环境</span>
              </h3>
              <div class="mt-2 font-mono text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                <span>sk-prod-9f8e7d6c5b...</span>
                <button class="text-blue-600 hover:text-blue-800 text-xs font-sans font-medium">复制完整 Key</button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <div class="text-xs text-slate-500 mb-1">消耗额度 (本月)</div>
              <div class="font-medium text-slate-900">1.2M Tokens</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">权限范围</div>
              <div class="font-medium text-slate-900 text-sm">全部模型</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">最近调用</div>
              <div class="font-medium text-slate-900 text-sm">2 分钟前</div>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group opacity-60 hover:opacity-100 transition-opacity">
          <div class="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center">
                Dev-Testing-01
                <span class="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] uppercase font-bold border border-slate-200">测试环境</span>
              </h3>
              <div class="mt-2 font-mono text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between items-center">
                <span>sk-test-1a2b3c4d5e...</span>
                <button class="text-blue-600 hover:text-blue-800 text-xs font-sans font-medium">复制完整 Key</button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <div class="text-xs text-slate-500 mb-1">消耗额度 (本月)</div>
              <div class="font-medium text-slate-900">450K Tokens</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">权限范围</div>
              <div class="font-medium text-slate-900 text-sm">仅 GPT-4o Mini</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">最近调用</div>
              <div class="font-medium text-slate-900 text-sm">昨天</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：创建面板模拟 -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-[85px]">
        <h3 class="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">新建 API Key 选项配置</h3>
        
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Key 名称</label>
            <input type="text" placeholder="例如: 财务部数据分析" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">可用模型范围</label>
            <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option>不限制 (使用租户所有模型)</option>
              <option>仅文本模型</option>
              <option>仅 OpenAI 模型</option>
              <option>自定义...</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">额度限制 (Tokens)</label>
            <div class="flex items-center">
              <input type="number" placeholder="留空表示不限制" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">过期时间</label>
            <select class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option>永不过期</option>
              <option>30 天后</option>
              <option>90 天后</option>
              <option>自定义日期...</option>
            </select>
          </div>
        </div>
        
        <div class="mt-8">
          <button class="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 transition-colors">
            确认生成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
