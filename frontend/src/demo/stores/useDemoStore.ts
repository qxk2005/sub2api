/**
 * Demo 演示平台全局模拟数据 Store
 * 提供各门户页面所需的 Mock 数据
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDemoStore = defineStore('demo', () => {
  // ============ 模型列表 Mock 数据 ============
  const models = ref([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', capability: ['文本', '视觉', '代码'], context: '128K', price: { input: 2.50, output: 10.00 }, badge: '热门', cover: '/covers/cover_gpt4o.svg' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', capability: ['文本', '代码'], context: '128K', price: { input: 0.15, output: 0.60 }, badge: '性价比', cover: '/covers/cover_gpt4o_mini.svg' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', capability: ['文本', '视觉', '代码'], context: '200K', price: { input: 3.00, output: 15.00 }, badge: '最强代码', cover: '/covers/cover_claude35.svg' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', capability: ['文本', '视觉', '推理'], context: '200K', price: { input: 15.00, output: 75.00 }, badge: '', cover: '/covers/cover_claude3_opus.svg' },
    { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', capability: ['文本', '视觉', '长文档'], context: '1M', price: { input: 1.25, output: 5.00 }, badge: '超长上下文', cover: '/covers/cover_gemini_pro.svg' },
    { id: 'gemini-2-0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', capability: ['文本', '代码'], context: '1M', price: { input: 0.10, output: 0.40 }, badge: '极速', cover: '/covers/cover_gemini_flash.svg' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', capability: ['文本', '代码', '推理'], context: '64K', price: { input: 0.27, output: 1.10 }, badge: '国产之光', cover: '/covers/cover_deepseek_v3.svg' },
    { id: 'grok-3', name: 'Grok-3', provider: 'xAI', capability: ['文本', '推理'], context: '128K', price: { input: 3.00, output: 15.00 }, badge: '', cover: '/covers/cover_grok3.svg' },
    { id: 'dall-e-3', name: 'DALL·E 3', provider: 'OpenAI', capability: ['图像生成'], context: '-', price: { input: 40.00, output: 0 }, badge: '图像', cover: '/covers/cover_dalle3.svg' },
  ])

  // ============ 套餐 Mock 数据 ============
  const plans = ref([
    { name: '入门版', price: 29, unit: '月', quota: '100万 Tokens', models: '基础模型', support: '社区支持', features: ['GPT-4o Mini', 'Gemini Flash', '基础 API 调用', '调用日志查询'] },
    { name: '专业版', price: 199, unit: '月', quota: '1000万 Tokens', models: '全部模型', support: '工单优先', features: ['全部模型无限制', '安全敏感词护栏', '多 Key 管理', '账单导出'], recommended: true },
    { name: '企业版', price: '定制', unit: '', quota: '无限', models: '专属号池', support: '专属客服', features: ['专属号池隔离', '员工子账号管理', '多级分账', 'SLA 保障', '私有化部署'] },
  ])

  // ============ 企业租户 Mock 数据 ============
  const tenant = ref({
    name: '示例科技有限公司',
    id: 'TENANT_DEMO_001',
    plan: '专业版',
    allocatedQuota: 10000000,
    usedQuota: 3456789,
    employeeCount: 28,
    keyCount: 12,
    parentAgent: '智算云连华东代理',
    createdAt: '2026-03-15',
    employees: [
      { id: 1, name: '张三', email: 'zhangsan@demo.com', role: '部门管理员', quota: 500000, used: 234567, concurrency: 32, rpmLimit: 1200, status: '正常', lastActive: '2 小时前' },
      { id: 2, name: '李四', email: 'lisi@demo.com', role: '普通员工', quota: 200000, used: 89012, concurrency: 16, rpmLimit: 600, status: '正常', lastActive: '1 天前' },
      { id: 3, name: '王五', email: 'wangwu@demo.com', role: '普通员工', quota: 200000, used: 198765, concurrency: 16, rpmLimit: 600, status: '余额预警', lastActive: '3 小时前' },
      { id: 4, name: '赵六', email: 'zhaoliu@demo.com', role: '普通员工', quota: 100000, used: 45678, concurrency: 16, rpmLimit: 600, status: '正常', lastActive: '5 小时前' },
      { id: 5, name: '钱七', email: 'qianqi@demo.com', role: '普通员工', quota: 100000, used: 99999, concurrency: 16, rpmLimit: 600, status: '已停用', lastActive: '7 天前' },
    ],
    bills: [
      { period: '2026-07', total: 1289.50, models: { 'GPT-4o': 560.20, 'Claude 3.5': 489.30, '其他': 240.00 }, status: '已结算' },
      { period: '2026-06', total: 1456.80, models: { 'GPT-4o': 680.00, 'Claude 3.5': 520.80, '其他': 256.00 }, status: '已结算' },
      { period: '2026-05', total: 987.20, models: { 'GPT-4o': 450.00, 'Claude 3.5': 337.20, '其他': 200.00 }, status: '已结算' },
    ],
    auditLogs: [
      { time: '2026-08-04 10:32:15', user: '张三', action: '创建 API Key', detail: 'key_proj_alpha_***', ip: '192.168.1.100' },
      { time: '2026-08-04 09:15:42', user: '系统', action: '余额预警', detail: '员工 王五 余额不足 10%', ip: '-' },
      { time: '2026-08-03 16:20:33', user: '管理员', action: '新增员工', detail: '钱七 (qianqi@demo.com)', ip: '10.0.0.55' },
      { time: '2026-08-03 14:05:18', user: '张三', action: '导出账单', detail: '2026-07 月度账单 (PDF)', ip: '192.168.1.100' },
      { time: '2026-08-02 11:42:09', user: '系统', action: '自动停服', detail: '员工 钱七 余额归零', ip: '-' },
    ]
  })

  // ============ 渠道代理 Mock 数据 ============
  const agent = ref({
    name: '智算云连华东代理',
    id: 'AGENT_EAST_CHINA',
    level: '金牌核心代理',
    markupRate: 0.15,
    withdrawable: 12680.50,
    totalEarnings: 89450.00,
    clientCount: 42,
    monthlyVolume: 56780000,
    inviteCode: 'EAST2026VIP',
    inviteLink: 'https://api.sub2api.com/r/EAST2026VIP',
    pools: [
      { id: 'pool-vip', name: 'VIP 专属池-华东', models: ['gpt-4o', 'claude-3-5-sonnet'], keys: 8, status: '正常', qps: 120, wholesaleDiscount: 0.85 },
      { id: 'pool-economy', name: '经济号池-通用', models: ['gpt-4o-mini', 'deepseek-v3'], keys: 15, status: '正常', qps: 300, wholesaleDiscount: 0.75 },
      { id: 'pool-gpu', name: '高并发 GPU 算力池', models: ['claude-3-5-sonnet', 'gpt-4o'], keys: 12, status: '正常', qps: 200, wholesaleDiscount: 0.90 },
    ],
    baseModelCosts: [
      { id: 'gpt-4o', name: 'GPT-4o', baseCost: 10.00, unit: '1M Tokens' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', baseCost: 15.00, unit: '1M Tokens' },
      { id: 'deepseek-v3', name: 'DeepSeek V3', baseCost: 2.00, unit: '1M Tokens' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', baseCost: 1.50, unit: '1M Tokens' },
    ],
    pricingRules: [
      // 直营个人用户规则
      { id: 1, targetType: 'direct_user', targetName: '直营个人用户 (默认全局)', poolId: 'pool-vip', modelId: 'gpt-4o', markupType: 'ratio', markupValue: 25, enabled: true, note: '标准零售散户加价' },
      { id: 2, targetType: 'direct_user', targetName: '直营个人用户 (默认全局)', poolId: 'pool-economy', modelId: 'gpt-4o-mini', markupType: 'fixed', markupValue: 0.30, enabled: true, note: '小模型固定额微利' },
      { id: 3, targetType: 'direct_user', targetName: 'VIP 直营高级开发者', poolId: 'pool-gpu', modelId: 'claude-3-5-sonnet', markupType: 'ratio', markupValue: 18, enabled: true, note: '开发者专属优惠' },
      
      // 下级企业租户规则
      { id: 4, targetType: 'sub_tenant', targetName: '示例科技有限公司 (企业)', poolId: 'pool-vip', modelId: 'gpt-4o', markupType: 'ratio', markupValue: 12, enabled: true, note: 'B端战略客户大额采购价' },
      { id: 5, targetType: 'sub_tenant', targetName: '创新工坊 (企业)', poolId: 'pool-gpu', modelId: 'claude-3-5-sonnet', markupType: 'ratio', markupValue: 15, enabled: true, note: '算力池套餐加价' },
      { id: 6, targetType: 'sub_tenant', targetName: '智慧教育科技 (企业)', poolId: 'pool-economy', modelId: 'deepseek-v3', markupType: 'fixed', markupValue: 0.20, enabled: true, note: '教育机构优惠' },
      { id: 7, targetType: 'sub_tenant', targetName: '下级租户通用默认策略', poolId: 'pool-economy', modelId: 'gpt-4o-mini', markupType: 'ratio', markupValue: 10, enabled: true, note: '新挂载企业默认模板' },
    ],
    clients: [
      { name: '示例科技有限公司', type: '企业', monthly: 1289.50, tokens: 5600000, joined: '2026-03-15', status: '活跃' },
      { name: '创新工坊', type: '企业', monthly: 890.00, tokens: 3200000, joined: '2026-04-20', status: '活跃' },
      { name: '张明(个人)', type: '个人', monthly: 129.00, tokens: 890000, joined: '2026-05-10', status: '活跃' },
      { name: '智慧教育科技', type: '企业', monthly: 2100.00, tokens: 8900000, joined: '2026-02-28', status: '活跃' },
      { name: '李华(个人)', type: '个人', monthly: 0, tokens: 0, joined: '2026-07-01', status: '未激活' },
    ],
    commissionTiers: [
      { range: '0 ~ ¥5,000', rate: '8%' },
      { range: '¥5,001 ~ ¥20,000', rate: '12%' },
      { range: '¥20,001 ~ ¥50,000', rate: '15%' },
      { range: '¥50,001+', rate: '20%' },
    ],
    payoutHistory: [
      { period: '2026-07', amount: 3250.00, commission: 2860.50, status: '已到账', method: '银行转账' },
      { period: '2026-06', amount: 2980.00, commission: 2650.00, status: '已到账', method: '银行转账' },
      { period: '2026-05', amount: 2100.00, commission: 1890.00, status: '已到账', method: '银行转账' },
    ]
  })

  // ============ 对话机器人 Mock 数据 ============
  const chatSessions = ref([
    { id: 1, title: 'Vue3 Pinia Store 示例编写', model: 'claude-3-5-sonnet', time: '10 分钟前', pinned: true },
    { id: 2, title: 'API 网关架构设计讨论', model: 'gpt-4o', time: '2 小时前', pinned: false },
    { id: 3, title: '产品需求文档整理', model: 'gemini-1-5-pro', time: '昨天', pinned: false },
    { id: 4, title: '图片 UI 元素分析', model: 'gpt-4o', time: '3 天前', pinned: false },
  ])

  const taskCategories = ref([
    { key: 'chat', label: '💬 简单对话', icon: '💬', prompt: '请帮我解答以下问题...', recommended: 'gpt-4o-mini', color: 'blue' },
    { key: 'doc', label: '📄 文档整理', icon: '📄', prompt: '请对以下长篇资料做要点总结：', recommended: 'gemini-1-5-pro', color: 'emerald' },
    { key: 'code', label: '💻 代码编写', icon: '💻', prompt: '请实现以下算法和逻辑：', recommended: 'claude-3-5-sonnet', color: 'violet' },
    { key: 'image', label: '🎨 图片处理', icon: '🎨', prompt: '分析上传图片中的元素与布局：', recommended: 'gpt-4o', color: 'amber' },
    { key: 'translate', label: '🌐 翻译润色', icon: '🌐', prompt: '请将以下内容翻译/润色为：', recommended: 'gpt-4o', color: 'cyan' },
  ])

  // ============ 桌面客户端 Mock 数据 ============
  const desktopProfiles = ref([
    { id: 1, name: '默认生产线路', endpoint: 'https://api.sub2api.com/v1', key: 'sk-prod-***abc', port: 8080, active: true },
    { id: 2, name: 'VIP 极速专线', endpoint: 'https://vip.sub2api.com/v1', key: 'sk-vip-***def', port: 8081, active: false },
    { id: 3, name: '开发测试 Key', endpoint: 'https://dev.sub2api.com/v1', key: 'sk-dev-***ghi', port: 8082, active: false },
  ])

  const desktopNodes = ref([
    { name: '华东-上海节点', latency: 32, status: 'excellent' },
    { name: '华南-广州节点', latency: 58, status: 'excellent' },
    { name: '华北-北京节点', latency: 85, status: 'good' },
    { name: '美西-硅谷节点', latency: 168, status: 'good' },
    { name: '日本-东京节点', latency: 95, status: 'good' },
    { name: '欧洲-法兰克福', latency: 245, status: 'fair' },
  ])

  const detectedApps = ref([
    { name: 'Claude Code', icon: '🤖', path: '~/.claude/config.json', status: 'detected', bound: true },
    { name: 'Cursor IDE', icon: '📝', path: '~/.cursor/settings.json', status: 'detected', bound: true },
    { name: 'VS Code Copilot', icon: '💎', path: '~/.vscode/settings.json', status: 'detected', bound: false },
    { name: 'Gemini CLI', icon: '✨', path: '~/.gemini/config', status: 'detected', bound: false },
    { name: 'OpenClaw', icon: '🐾', path: 'Not Found', status: 'not_found', bound: false },
  ])

  // ============ 平台管理员 FRS V3.4 全量子项映射 ============
  const platformAdminItems = ref([
    // 2.1 中转站中台 (Platform)
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.1', name: 'API 接口协议转换', route: '/admin/channels/pricing', status: 'fulfilled', desc: '支持 OpenAI / Anthropic Claude / Google Gemini / Grok 协议微秒级双向转换', guide: '进入【渠道管理 -> 渠道列表】，在创建或编辑渠道时选择对应提供商。网关会自动把接收到的标准 OpenAI 格式请求实时转换为目标厂商的专用 API 协议。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.2', name: '智能路由与负载均衡', route: '/admin/settings', status: 'fulfilled', desc: '内置轮询、权重与并发调度算法，自适应选路', guide: '在【系统设置 -> 实验调度策略】中可配置多维加权算法（包含优先级权重、负载权重、错误率权重及 TTFT 延迟权重）；在【账号管理】中可为每个上游账号独立设置 Priority 优先级与权重倍率。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.3', name: 'API Key 鉴权与额度校验', route: '/keys', status: 'fulfilled', desc: '秒级验证 Key 合法性、余额及权限限制', guide: '进入侧边栏【API 密钥 (/keys)】或【用户管理】。可生成/管理 API Key，为其设置单独的消费额度、模型白名单与 IP 限制；网关收到请求时完成微秒级鉴权。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.4', name: '调用日志与明细查询', route: '/admin/usage', status: 'fulfilled', desc: '全链路调用日志记录与敏感数据脱敏', guide: '进入【日志/用量统计】页面，筛选查看所有请求的时间、请求/响应 Token 数量、响应时延及状态码。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.5', name: '频率限制（Rate Limit）与熔断', route: '/admin/channels/monitor', status: 'fulfilled', desc: '自动限流与熔断机制，P95 ≤ 50ms', guide: '进入【渠道监控】页面查看实时 QPS。当某个渠道持续报 5xx 或响应超时时，自动触发熔断暂停分发。' },

    // 2.2 一键部署客户端 (Desktop)
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.1', name: '无边框窗体与系统托盘', route: '/demo/desktop', status: 'fulfilled', desc: '仿真 Windows/macOS 沉浸式桌面客户端窗体', guide: '进入【桌面客户端 DEMO (/demo/desktop)】，体验轻量无边框窗体、系统托盘右键快捷选单及最小化悬浮球。' },
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.2', name: '多线路与多账号快捷切换', route: '/demo/desktop', status: 'fulfilled', desc: '支持一键切换生产线路与 API 节点', guide: '在桌面客户端左侧菜单点击【🔀 线路/Key 切换】，可查看当前激活线路并一键无缝切换上游专线。' },
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.3', name: '环境一键注入', route: '/demo/desktop', status: 'fulfilled', desc: '自动检测与一键配置 Cursor/Copilot/Claude 等开发环境', guide: '在桌面客户端侧边栏点击【🔌 环境一键注入】，可自动读取本地 IDE 配置文件并完成代理 Endpoint 写入。' },
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.4', name: '延迟测速大盘', route: '/demo/desktop', status: 'fulfilled', desc: '多节点实时 Ping/TTFT 延时检测', guide: '在桌面客户端点击【📊 延迟测速大盘】，可一键并发发起全网节点 Ping 测试并直观呈现节点健康度与延迟。' },
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.6', name: '日志与白话抓包', route: '/demo/desktop', status: 'fulfilled', desc: '实时监听本地请求，可视化解析 Header 与 Body', guide: '在桌面客户端点击【🔍 日志与白话抓包】，实时截获本地 IDE 发出的请求并以人性化白话格式拆解参数。' },
    { chapter: '2.2', chapterName: '2.2 一键部署客户端', section: '2.2.7', name: '聊天机器人客户端', route: '/demo/desktop', status: 'fulfilled', desc: '客户端内置沉浸式 AI 对话助手界面', guide: '在桌面客户端左侧菜单默认激活【🤖 聊天机器人】，支持挑选模型、Prompt 快捷预设及多轮对话体验。' },

    // 2.3 网页版对话机器人 (Web Chatbot)
    { chapter: '2.3', chapterName: '2.3 网页版对话机器人', section: '2.3.1', name: '沉浸式对话界面', route: '/demo/portal/chatbot', status: 'fulfilled', desc: '全屏对话窗口，支持流式响应与 Markdown 渲染', guide: '进入【网页对话机器人 DEMO (/demo/portal/chatbot)】，体验现代化聊天界面、打字机流式输出与代码高亮。' },
    { chapter: '2.3', chapterName: '2.3 网页版对话机器人', section: '2.3.2', name: '智能模型推荐引擎', route: '/demo/portal/chatbot', status: 'fulfilled', desc: '根据任务类型自动推荐最佳模型组合', guide: '在网页对话框顶部选择任务分类标签（如代码编写、文档整理、图片分析），系统自动切换最贴合的 AI 模型。' },
    { chapter: '2.3', chapterName: '2.3 网页版对话机器人', section: '2.3.3', name: '多模态文件上传处理', route: '/demo/portal/chatbot', status: 'fulfilled', desc: '支持图片、文档附件解析与 Vision 识别', guide: '在对话框点击附件按钮上传图片或文档，即可调用多模态模型完成图像视觉识别与文本分析。' },

    // 2.4 官方门户网站 (Portal)
    { chapter: '2.4', chapterName: '2.4 官方门户网站', section: '2.4.1', name: '官网首页与核心特性宣发', route: '/demo/portal', status: 'fulfilled', desc: '品牌官网首页，展现四级架构与核心卖点', guide: '进入【官网门户 (/demo/portal)】，浏览最新平台特性宣发、产品痛点对比及产品演示入口。' },
    { chapter: '2.4', chapterName: '2.4 官方门户网站', section: '2.4.2', name: '模型广场与价格估算器', route: '/demo/portal/models', status: 'fulfilled', desc: '收录最新主流 AI 模型参数与试算器', guide: '进入【模型广场 (/demo/portal/models)】，查阅目前支持的模型清单，并通过动态算盘实时估算月度消费。' },
    { chapter: '2.4', chapterName: '2.4 官方门户网站', section: '2.4.3', name: '开发者文档中心', route: '/demo/portal/docs', status: 'fulfilled', desc: '三步快速接入指南与 API 调优文档', guide: '进入【文档中心 (/demo/portal/docs)】，阅读统一 SDK 快速替换指南与常用环境变量配置样例。' },
    { chapter: '2.4', chapterName: '2.4 官方门户网站', section: '2.4.4', name: '定价方案与分销引导', route: '/demo/portal/pricing', status: 'fulfilled', desc: '订阅套餐与代理商加盟政策矩阵', guide: '进入【定价方案 (/demo/portal/pricing)】，查阅基础版、专业版、企业订阅价格对比及渠道代理分销政策。' },

    // 2.5 核心网关能力 (Gateway)
    { chapter: '2.5', chapterName: '2.5 核心网关能力补全', section: '2.5.1', name: '安全敏感词合规护栏', route: '/demo/admin/sensitive-words', status: 'fulfilled', desc: '输入/输出双向实时敏感词拦截，对接网信办标准词库', guide: '进入【安全敏感词护栏 DEMO (/demo/admin/sensitive-words)】，体验词库规则热管理、双向拦截开关与实时安全审计日志。' },

    // 2.6 财务账单系统 (Billing)
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.1', name: '用量计量（多级穿透分账）', route: '/demo/tenant/billing', status: 'fulfilled', desc: '按 Prompt / Completion / Cached Tokens 精确穿透扣费', guide: '进入【企业租户 - 财务与账单 (/demo/tenant/billing)】，查阅消费明细表，精准穿透至每次请求的输入、输出及缓存 Token 扣费。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.2', name: '日/周/月账单推送与报表', route: '/demo/tenant/billing', status: 'fulfilled', desc: '定时汇总用量并生成多维度分析报表', guide: '在【财务与账单】页面可切换计费周期（按日/按周/按月），直观呈现不同时间跨度的企业消耗曲线。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.3', name: '账单可视化图形大盘', route: '/demo/tenant/billing', status: 'fulfilled', desc: '消费趋势折线图、模型占比饼图及团队额度分布', guide: '在【财务与账单】顶部数据看板查阅核心图表：模型消耗比例、各部门 Token 分布及月度消费趋势。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.4', name: '账单导出 CSV / PDF', route: '/demo/tenant/billing', status: 'fulfilled', desc: '支持一键导出财务对账单与凭证', guide: '在【财务与账单】页面右上角点击【导出 CSV/PDF】，快速下载规范的企业对账单凭证。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.5', name: '余额预警与欠费停服', route: '/demo/tenant/billing', status: 'fulfilled', desc: '低于临界阈值触发预警，耗尽自动阻断', guide: '在【财务与账单】顶部查看余额预警线配置（如低至 ¥100 自动触发告警），余额归零后 API 请求自动阻断。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.6', name: '充值与支付渠道对接', route: '/admin/orders', status: 'partial', desc: '在线充值集成微信支付/支付宝/易支付', guide: '进入【订单管理 (/admin/orders)】查看用户充值记录，配置在线支付通道和价格套餐。' },

    // 2.7 账号体系与权限管理 (Tenant)
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.1', name: '四级分层多租户架构', route: '/demo/tenant/dashboard', status: 'fulfilled', desc: '平台-代理-租户-终端用户四级隔离与配额控制', guide: '进入【企业租户控制台 (/demo/tenant/dashboard)】，查看企业总配额划拨、子账号用量看板及四级数据隔离隔离。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.2', name: '角色体系（RBAC）', route: '/admin/users', status: 'fulfilled', desc: '细粒度 RBAC 权限矩阵控制', guide: '进入【用户管理 (/admin/users)】列表，在操作栏点击【修改角色】，可在系统管理员、代理商、租户管理员间无缝切换。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.3', name: '细粒度权限控制', route: '/demo/tenant/keys', status: 'fulfilled', desc: '模块级、功能级、模型级访问白名单限制', guide: '进入【API Key 管理 (/demo/tenant/keys)】，在编辑弹窗中勾选模型白名单及配置单个 Key 的最高并发额度。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.4', name: '组织级 Key 统一管理', route: '/demo/tenant/keys', status: 'fulfilled', desc: '企业租户管理员统一分发与监控组织 Key', guide: '进入【API 密钥 (/demo/tenant/keys)】，以企业管理员身份批量生成、停用及分发部门级 API Key。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.5', name: '登录安全与角色强制 2FA', route: '/demo/tenant/security', status: 'fulfilled', desc: '关键角色强制双因素认证与 IP 白名单', guide: '进入【安全设置 (/demo/tenant/security)】，开启 2FA 强认证模式、配置 SSO 单点登录与控制台 IP 白名单。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.6', name: '员工与子账号批量开户', route: '/demo/tenant/employees', status: 'fulfilled', desc: '企业管理员批量划拨子账号配额与权限', guide: '进入【员工管理 (/demo/tenant/employees)】，批量邀请员工加入企业租户，并独立划拨每个员工的月度 Token 限额。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.7', name: '租户/用户专属门户', route: '/demo/tenant/user-portal', status: 'fulfilled', desc: '租户管理员门户与员工个人门户分层展示', guide: '进入【租户/用户专属门户 (/demo/tenant/user-portal)】，体验普通员工/终端用户视角的个人 Key、用量明细与模型白名单。' },

    // 2.8 上游号池与渠道管理 (Platform)
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.1', name: '上游渠道接入管理', route: '/admin/channels/pricing', status: 'fulfilled', desc: '新增、编辑与停用上游 Provider 渠道', guide: '进入【渠道管理 (/admin/channels/pricing)】，点击【创建渠道】，填入上游 Base URL 与 API Key 完成接入。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.2', name: '号池与 Key 权重/优先级管理', route: '/admin/accounts', status: 'fulfilled', desc: '批量导入 Key，独立设置 Priority 优先级与权重', guide: '进入【账号管理 (/admin/accounts)】，在账号列表中独立调整各个 Key 的优先级 (Priority) 与权重倍率。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.3', name: '模型映射与重定向配置', route: '/admin/channels/pricing', status: 'fulfilled', desc: '平台统一模型标识与上游真实模型重定向映射', guide: '在渠道编辑弹窗的【模型重定向】配置中填入 `gpt-4o: gpt-4o-2024-08-06` 即可完成上游模型别名映射。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.4', name: '渠道实时监控大盘', route: '/admin/channels/monitor', status: 'fulfilled', desc: '全局 QPS 曲线、时延分布柱状图及成功率分析', guide: '进入【渠道监控 (/admin/channels/monitor)】大盘，查阅全站实时 QPS 波动曲线及各渠道延时柱状图。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.5', name: '运维与告警规则配置', route: '/admin/ops', status: 'fulfilled', desc: '失败率飙升或额度不足时发送多渠道通知告警', guide: '进入【运维监控 (/admin/ops)】配置通知 Webhook，当上游连续报错或余额耗尽时触发钉钉/飞书告警。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.6', name: '渠道健康度自动评分', route: '/admin/channels/monitor', status: 'fulfilled', desc: '根据延时与成功率自动打分，辅助自动降级选路', guide: '在【渠道监控】列表中查阅每个渠道的健康度 Score 分数（根据 P95 延迟与成功率动态算法实时计算）。' },

    // 2.10 渠道代理与分销管理 (Agent)
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.1', name: '代理概览与邀请分销', route: '/demo/agent/dashboard', status: 'fulfilled', desc: '专属邀请链接、返佣阶梯与收益转化漏斗', guide: '进入【代理商控制台 (/demo/agent/dashboard)】，查看专属分销邀请链接、本月预估佣金及返佣阶梯规则。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.2', name: '专属隔离号池分配', route: '/demo/agent/pools', status: 'fulfilled', desc: '平台划拨的代理专属物理隔离号池与运行状态', guide: '进入【代理专属号池 (/demo/agent/pools)】，查阅平台为其分配的隔离号池资源（如 VIP 专属池、高并发 GPU 池）。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.3', name: '专属费率与多维度加价配置', route: '/demo/agent/pricing', status: 'fulfilled', desc: '支持针对直营用户与下级企业租户独立设置加价与号池底价穿透', guide: '进入【专属费率 (/demo/agent/pricing)】，为【直营个人用户】与【下级企业租户】分别设定独立加价率，并绑定号池底价算术测算利润。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.4', name: '阶梯返佣规则与分销大盘', route: '/demo/agent/dashboard', status: 'fulfilled', desc: '按销售额阶梯自动计算返佣比例', guide: '在【代理概览】中查阅当前的返佣阶梯（如 ¥0~5,000 为 8%，¥50,001+ 为 20%）及历史结算明细。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.5', name: '下级客户管理与维护', route: '/demo/agent/clients', status: 'fulfilled', desc: '维护下级企业租户与直营用户档案与消耗占比', guide: '进入【下级租户管理 (/demo/agent/clients)】与【直营用户 (/demo/agent/direct-users)】，查阅客户月度消耗与激活状态。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.6', name: '双向结算与精准对账单', route: '/demo/agent/payouts', status: 'fulfilled', desc: '平台-代理 & 代理-下游客户双向自动对账大盘', guide: '进入【结算与双向对账 (/demo/agent/payouts)】，在 Tab 1 查看代理与平台的底层结算单，在 Tab 2 查看代理与下游客户的加价账单。' },
  ])

  // ============ Toast 通知 ============
  const toastMessage = ref('')
  const toastVisible = ref(false)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function showToast(msg: string) {
    toastMessage.value = msg
    toastVisible.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toastVisible.value = false }, 3000)
  }

  // ============ Computed ============
  const modelsByProvider = computed(() => {
    const grouped: Record<string, typeof models.value> = {}
    models.value.forEach(m => {
      if (!grouped[m.provider]) grouped[m.provider] = []
      grouped[m.provider].push(m)
    })
    return grouped
  })

  const tenantRemainingQuota = computed(() => tenant.value.allocatedQuota - tenant.value.usedQuota)
  const tenantUsagePercent = computed(() => Math.round((tenant.value.usedQuota / tenant.value.allocatedQuota) * 100))

  const platformAdminChapters = computed(() => {
    const chaptersMap: Record<string, { id: string; name: string; items: typeof platformAdminItems.value }> = {}
    platformAdminItems.value.forEach(item => {
      if (!chaptersMap[item.chapter]) {
        chaptersMap[item.chapter] = {
          id: item.chapter,
          name: item.chapterName,
          items: []
        }
      }
      chaptersMap[item.chapter].items.push(item)
    })
    return Object.values(chaptersMap)
  })

  return {
    models, plans, tenant, agent,
    chatSessions, taskCategories,
    desktopProfiles, desktopNodes, detectedApps,
    platformAdminItems, platformAdminChapters,
    toastMessage, toastVisible, showToast,
    modelsByProvider, tenantRemainingQuota, tenantUsagePercent,
  }
})
