<script setup lang="ts">
/**
 * 2.10.3 专属费率
 */
</script>

<template>
  <div class="agent-pricing p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">专属费率与加价配置</h1>
      <p class="text-slate-500 text-sm mt-1">设置您的代理商基础加价倍率，支持按模型或按客户单独覆盖。</p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 max-w-3xl">
      <h3 class="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">全局基础加价率</h3>
      <div class="flex items-center space-x-6">
        <div class="flex-1">
          <input type="range" min="0" max="100" value="15" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500">
          <div class="flex justify-between text-xs text-slate-400 mt-2">
            <span>原价 (0%)</span>
            <span>+50%</span>
            <span>+100%</span>
          </div>
        </div>
        <div class="w-24 relative">
          <input type="number" value="15" class="w-full border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-center focus:outline-none focus:border-amber-500 font-bold text-amber-600">
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
        </div>
      </div>
      <div class="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800 flex items-start">
        <span class="text-lg mr-2">💡</span>
        <div>
          <p class="font-medium mb-1">价格穿透说明</p>
          <p class="opacity-80">当您设置 +15% 加价率时：若平台结算价为 ¥10/1M Tokens，您的下级客户看到的价格将是 ¥11.50。差价 ¥1.50 将作为您的直接佣金收益。</p>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button class="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">保存全局设置</button>
      </div>
    </div>

    <!-- 按模型覆盖配置 -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 class="font-bold text-slate-900">按模型覆盖费率</h3>
        <button class="text-sm font-medium text-amber-600 hover:text-amber-700">+ 添加覆盖规则</button>
      </div>
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">指定模型</th>
            <th class="px-6 py-4 font-medium">平台结算价</th>
            <th class="px-6 py-4 font-medium">自定义加价率</th>
            <th class="px-6 py-4 font-medium">客户可见最终价</th>
            <th class="px-6 py-4 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">GPT-4o</td>
            <td class="px-6 py-4 text-slate-500">¥10.00 / 1M</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">+20%</span>
            </td>
            <td class="px-6 py-4 font-bold text-slate-900">¥12.00</td>
            <td class="px-6 py-4 text-right">
              <button class="text-slate-400 hover:text-red-500 font-medium">删除</button>
            </td>
          </tr>
          <tr class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-900">Claude 3.5 Sonnet</td>
            <td class="px-6 py-4 text-slate-500">¥15.00 / 1M</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-amber-100 text-amber-700 rounded font-medium">+10%</span>
            </td>
            <td class="px-6 py-4 font-bold text-slate-900">¥16.50</td>
            <td class="px-6 py-4 text-right">
              <button class="text-slate-400 hover:text-red-500 font-medium">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
