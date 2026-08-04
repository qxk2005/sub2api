<script setup lang="ts">
/**
 * 2.4.3 文档中心
 */
</script>

<template>
  <div class="portal-docs flex h-[calc(100vh-64px)] bg-white overflow-hidden">
    <!-- 侧边栏导航 -->
    <aside class="w-64 border-r border-slate-200 overflow-y-auto bg-slate-50 hidden md:block">
      <div class="p-4">
        <h3 class="font-semibold text-slate-900 mb-3 px-2 text-sm">快速开始</h3>
        <ul class="space-y-1 mb-6">
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-700 font-medium">接入指南</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">获取 API Key</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">Base URL 替换</a></li>
        </ul>

        <h3 class="font-semibold text-slate-900 mb-3 px-2 text-sm">API 参考</h3>
        <ul class="space-y-1 mb-6">
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">Chat Completions</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">Embeddings</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">Images Generation</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">错误码说明</a></li>
        </ul>

        <h3 class="font-semibold text-slate-900 mb-3 px-2 text-sm">进阶使用</h3>
        <ul class="space-y-1">
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">流式输出处理</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">Token 计算规则</a></li>
          <li><a href="#" class="block px-3 py-2 text-sm rounded-lg text-slate-600 hover:bg-slate-100">客户端工具对接</a></li>
        </ul>
      </div>
    </aside>

    <!-- 文档内容区 -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto px-6 py-12">
        <div class="text-sm text-slate-500 mb-4 font-medium">快速开始 / 接入指南</div>
        <h1 class="text-3xl font-bold text-slate-900 mb-8">三步快速接入 Sub2API</h1>
        
        <div class="prose prose-slate max-w-none">
          <p class="text-slate-600 text-lg">Sub2API 完全兼容 OpenAI 标准 API 格式。无论您想调用 Claude、Gemini 还是国产模型，都无需更改代码逻辑，只需替换 Base URL 和 API Key 即可。</p>
          
          <h2 class="text-2xl font-semibold text-slate-900 mt-10 mb-4 border-b pb-2">Step 1. 替换 Base URL</h2>
          <p>在您的代码或框架配置中，将官方的请求地址替换为 Sub2API 的统一调度网关地址：</p>
          <div class="bg-slate-900 rounded-lg p-4 relative font-mono text-sm text-slate-300 mt-4 mb-6">
            <span class="text-blue-400">https</span>://api.sub2api.com/v1
            <button class="absolute right-3 top-3 text-slate-500 hover:text-white">复制</button>
          </div>

          <h2 class="text-2xl font-semibold text-slate-900 mt-10 mb-4 border-b pb-2">Step 2. 生成 API Key</h2>
          <p>登录控制台，在「令牌管理」中生成一个新的 API Key。我们的系统会自动识别该 Key 绑定的角色、限额与权限。</p>
          <div class="bg-slate-900 rounded-lg p-4 relative font-mono text-sm text-slate-300 mt-4 mb-6">
            sk-proj-alpha-8a9b7c6d5e4f3...
          </div>

          <h2 class="text-2xl font-semibold text-slate-900 mt-10 mb-4 border-b pb-2">Step 3. 发起请求</h2>
          <p>以 Python 请求 `claude-3-5-sonnet` 为例（使用 OpenAI SDK）：</p>
          <div class="bg-slate-900 rounded-lg p-4 relative font-mono text-sm mt-4">
            <pre class="text-slate-300"><code><span class="text-purple-400">from</span> openai <span class="text-purple-400">import</span> OpenAI

client = OpenAI(
    api_key=<span class="text-green-400">"sk-proj-alpha-..."</span>,
    base_url=<span class="text-green-400">"https://api.sub2api.com/v1"</span>
)

response = client.chat.completions.create(
    model=<span class="text-green-400">"claude-3-5-sonnet"</span>, <span class="text-slate-500"># 直接写模型名称</span>
    messages=[
        {<span class="text-green-400">"role"</span>: <span class="text-green-400">"user"</span>, <span class="text-green-400">"content"</span>: <span class="text-green-400">"写一个 Hello World"</span>}
    ]
)
<span class="text-blue-400">print</span>(response.choices[0].message.content)</code></pre>
          </div>
        </div>
        
        <div class="mt-12 flex justify-between border-t border-slate-200 pt-6">
          <div></div>
          <button class="text-blue-600 font-medium hover:text-blue-700 flex items-center">
            获取 API Key <span class="ml-1">→</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
