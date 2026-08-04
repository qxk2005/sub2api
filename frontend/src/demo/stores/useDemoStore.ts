/**
 * Demo 演示平台全局模拟数据 Store
 * 提供各门户页面所需的 Mock 数据
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDemoStore = defineStore('demo', () => {
  // ============ 模型列表 Mock 数据 ============
  const models = ref([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', capability: ['文本', '视觉', '代码'], context: '128K', price: { input: 2.50, output: 10.00 }, badge: '热门' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', capability: ['文本', '代码'], context: '128K', price: { input: 0.15, output: 0.60 }, badge: '性价比' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', capability: ['文本', '视觉', '代码'], context: '200K', price: { input: 3.00, output: 15.00 }, badge: '最强代码' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', capability: ['文本', '视觉', '推理'], context: '200K', price: { input: 15.00, output: 75.00 }, badge: '' },
    { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', capability: ['文本', '视觉', '长文档'], context: '1M', price: { input: 1.25, output: 5.00 }, badge: '超长上下文' },
    { id: 'gemini-2-0-flash', name: 'Gemini 2.0 Flash', provider: 'Google', capability: ['文本', '代码'], context: '1M', price: { input: 0.10, output: 0.40 }, badge: '极速' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', capability: ['文本', '代码', '推理'], context: '64K', price: { input: 0.27, output: 1.10 }, badge: '国产之光' },
    { id: 'grok-3', name: 'Grok-3', provider: 'xAI', capability: ['文本', '推理'], context: '128K', price: { input: 3.00, output: 15.00 }, badge: '' },
    { id: 'dall-e-3', name: 'DALL·E 3', provider: 'OpenAI', capability: ['图像生成'], context: '-', price: { input: 40.00, output: 0 }, badge: '图像' },
  ])

  // ============ 套餐 Mock 数据 ============
  const plans = ref([
    { name: '入门版', price: 29, unit: '月', quota: '100万 Tokens', models: '基础模型', support: '社区支持', features: ['GPT-4o Mini', 'Gemini Flash', '基础 API 调用', '调用日志查询'] },
    { name: '专业版', price: 199, unit: '月', quota: '1000万 Tokens', models: '全部模型', support: '工单优先', features: ['全部模型无限制', '语义缓存降本', '多 Key 管理', '账单导出'], recommended: true },
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
      { id: 1, name: '张三', email: 'zhangsan@demo.com', role: '部门管理员', quota: 500000, used: 234567, status: '正常', lastActive: '2 小时前' },
      { id: 2, name: '李四', email: 'lisi@demo.com', role: '普通员工', quota: 200000, used: 89012, status: '正常', lastActive: '1 天前' },
      { id: 3, name: '王五', email: 'wangwu@demo.com', role: '普通员工', quota: 200000, used: 198765, status: '余额预警', lastActive: '3 小时前' },
      { id: 4, name: '赵六', email: 'zhaoliu@demo.com', role: '普通员工', quota: 100000, used: 45678, status: '正常', lastActive: '5 小时前' },
      { id: 5, name: '钱七', email: 'qianqi@demo.com', role: '普通员工', quota: 100000, used: 99999, status: '已停用', lastActive: '7 天前' },
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
      { name: 'VIP 专属池-华东', models: ['gpt-4o', 'claude-3-5-sonnet'], keys: 8, status: '正常', qps: 120 },
      { name: '经济池-通用', models: ['gpt-4o-mini', 'deepseek-v3'], keys: 15, status: '正常', qps: 300 },
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

  // ============ 平台管理员 FRS 子项映射 ============
  const platformAdminItems = ref([
    // 2.1 中转站中台
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.1', name: 'API 接口协议转换', route: '/admin/channels/pricing', status: 'fulfilled', desc: '支持 OpenAI/Claude/Gemini/Grok 协议自动转换', guide: '进入【渠道管理 -> 渠道列表】，在创建或编辑渠道时选择对应提供商（OpenAI/Anthropic/Gemini/Grok）。网关会自动把接收到的统一 OpenAI 接口请求流式转换为目标厂商的专用 API 协议。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.2', name: '智能路由与负载均衡', route: '/admin/settings', status: 'fulfilled', desc: '内置轮询、权重与并发调度算法', guide: '在【系统设置 -> 实验调度策略】中可配置多维加权算法（包括优先级权重、负载权重、错误率权重及 TTFT 延迟权重）；在【账号管理】中可为每个上游账号独立设置 Priority 优先级与权重倍率。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.3', name: 'API Key 鉴权与额度校验', route: '/keys', status: 'fulfilled', desc: '秒级验证 Key 合法性、余额及权限', guide: '进入左侧侧边栏【API 密钥】 (页面：/keys) 或【用户管理】(/admin/users)。在此可生成/管理 API Key，并为其设置单独的消费额度、模型白名单与 IP 限制；网关在收到请求时自动完成微秒级鉴权与余额校验。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.4', name: '调用日志与明细查询', route: '/admin/usage', status: 'fulfilled', desc: '全链路调用日志记录与敏感数据脱敏', guide: '进入【日志/用量统计】页面，筛选查看所有请求的时间、请求/响应 Token 数量、响应时延及状态码。' },
    { chapter: '2.1', chapterName: '2.1 中转站中台', section: '2.1.5', name: '频率限制（Rate Limit）与熔断', route: '/admin/channels/monitor', status: 'fulfilled', desc: '自动限流与熔断，P95≤50ms', guide: '进入【渠道监控】页面查看实时 QPS。当某个渠道持续报 5xx 或响应超时时，自动触发熔断暂停分发。' },

    // 2.5 核心网关能力
    { chapter: '2.5', chapterName: '2.5 核心网关能力', section: '2.5.1', name: '最高性价比调度策略', route: '/admin/settings', status: 'pending', desc: '多维加权算分引擎选择最优渠道', guide: '在【系统设置 -> 实验调度策略】中开启“低倍率优先调度”与“成本权重算分”，智能路由引擎优先把请求分发给成本最省且健康的渠道/账号。' },
    { chapter: '2.5', chapterName: '2.5 核心网关能力', section: '2.5.2', name: '渠道专属号池绑定与亲和路由', route: '/admin/groups', status: 'pending', desc: 'VIP 资源物理/逻辑隔离', guide: '进入【分组管理 (Groups)】，将特定号池/渠道绑定至 VIP 分组或渠道代理组，实现不同租户与代理间的资源物理/逻辑隔离。' },
    { chapter: '2.5', chapterName: '2.5 核心网关能力', section: '2.5.3', name: '用户端无感切换', route: '/admin/channels/monitor', status: 'partial', desc: '故障自动降级切换备用渠道', guide: '在【渠道监控】中观察节点健康度。主渠道异常时网关会在后端自动重试其他备用渠道，对终端响应无报错。' },
    { chapter: '2.5', chapterName: '2.5 核心网关能力', section: '2.5.4', name: '缓存降本策略（语义缓存）', route: '/admin/settings', status: 'pending', desc: '向量 Embedding 相似度>95%自动命中', guide: '进入【系统设置 -> 引擎/缓存策略】，勾选开启 Engine A 向量语义缓存，重复或近义提问直接缓存命中免扣费。' },
    { chapter: '2.5', chapterName: '2.5 核心网关能力', section: '2.5.5', name: '失败重试与优先级队列', route: '/admin/channels/monitor', status: 'partial', desc: '加权公平队列与指数退避', guide: '在【系统设置 -> 路由参数】中配置指数退避重试次数。发生临时网络波动时优先放入快速重试队列。' },

    // 2.6 财务账单系统
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.1', name: '用量计量（多级穿透分账）', route: '/admin/usage', status: 'partial', desc: '按 Prompt/Completion/Cached Tokens 精确扣费', guide: '在【用量统计】中可穿透查看用户、代理商与平台的原始输入/输出/缓存 Tokens 消费和金额扣减记录。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.2', name: '日/周/月账单推送', route: '/admin/usage', status: 'partial', desc: '定时汇总用量生成账单报告', guide: '在【用量统计】中选择不同时间维度（日/周/月）进行统计汇总，可配置定时发送对账邮件报告。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.3', name: '账单可视化', route: '/admin/dashboard', status: 'fulfilled', desc: '消费趋势图、模型占比饼图', guide: '进入【控制台首页 (Dashboard)】，查阅核心图形大盘：包括模型消费比例饼图、近30日消耗折线图及收入分析。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.4', name: '账单导出 CSV/PDF', route: '/admin/usage', status: 'partial', desc: '支持一键导出消费对账单', guide: '在【用量明细】页面顶部过滤指定用户或范围后，点击右上角【导出 CSV/PDF】下载财务核算明细。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.5', name: '余额预警与欠费停服', route: '/admin/settings', status: 'fulfilled', desc: '余额低于预警线触发多渠道通知', guide: '在【系统设置 -> 提醒设置】中配置阈值。当用户余额不足时自动触发邮件提醒；余额耗尽后禁止 API 调用。' },
    { chapter: '2.6', chapterName: '2.6 财务账单系统', section: '2.6.6', name: '充值与支付渠道对接', route: '/admin/orders', status: 'partial', desc: '在线充值集成微信/支付宝', guide: '进入【订单管理】与【支付通道】查看用户充值记录，配置微信支付/支付宝/易支付等商户对接秘钥。' },

    // 2.7 账号体系与权限管理
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.1', name: '多租户架构', route: '/admin/groups', status: 'pending', desc: '四级分层架构与数据隔离', guide: '在【分组管理 (Groups)】中配置不同用户组/租户的独立共享配额、策略模板与专属渠道绑定。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.2', name: '角色体系（RBAC）', route: '/admin/users', status: 'partial', desc: '四级分层 RBAC 权限矩阵', guide: '在【用户管理】列表中找到目标用户，点击操作栏的【修改角色】，可在系统管理员、代理商、租户管理员间切换。' },
    { chapter: '2.7', chapterName: '2.7 账号体系与权限管理', section: '2.7.3', name: '细粒度权限控制', route: '/admin/users', status: 'pending', desc: '模块级、功能级、数据级权限', guide: '在【用户编辑】弹窗中针对特定的模型列表进行勾选授权，限制用户仅能访问指定 AI 模型。' },

    // 2.8 上游号池与渠道管理
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.1', name: '渠道接入管理', route: '/admin/channels/pricing', status: 'fulfilled', desc: '新增/编辑/停用上游渠道', guide: '进入【渠道管理】，点击右上角【创建渠道】，填写渠道名称、Base URL 与 API Key 建立连接。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.2', name: '号池与 Key 权重/优先级管理', route: '/admin/accounts', status: 'fulfilled', desc: '批量导入上游 Key、分组管理与优先级控制', guide: '进入【账号管理】(即上游号池/Key管理)，在列表中可为每个账号单独配置【优先级 (Priority)】与【权重倍率】，并支持批量导入与自动检测。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.3', name: '模型映射配置', route: '/admin/channels/pricing', status: 'fulfilled', desc: '上游模型与平台标识映射', guide: '在渠道配置中的【模型重定向/映射】文本框填入例如 `gpt-4o: gpt-4o-2024-08-06` 即可完成上游映射。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.4', name: '实时监控大盘', route: '/admin/channels/monitor', status: 'fulfilled', desc: 'QPS、成功率、时延、剩余额度', guide: '点击进入【渠道监控】大盘，可以实时查阅全局 QPS 波动曲线、各渠道延迟分布柱状图及失败率统计。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.5', name: '告警规则配置', route: '/admin/ops', status: 'fulfilled', desc: '失败率飙升、额度不足自动告警', guide: '在【系统设置/运维】中配置通知 Webhook，当上游渠道连续报错 N 次或额度耗尽时自动发送钉钉/飞书告警。' },
    { chapter: '2.8', chapterName: '2.8 上游号池与渠道管理', section: '2.8.6', name: '渠道健康度评分', route: '/admin/channels/monitor', status: 'fulfilled', desc: '自动打分与调度权重建议', guide: '在【渠道监控】大盘的渠道列表第一列查看健康度 Score（综合延时、可用率自动打分），便于管理员一键优化权重。' },

    // 2.10 渠道代理与分销管理
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.1', name: '代理账户审核（平台侧）', route: '/admin/affiliates/invites', status: 'partial', desc: '代理申请审核与分级管理', guide: '进入【返佣与代理管理】，查阅提交代理申请的用户列表，点击【通过审核】并设置其代理级别与分销码。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.2', name: '专属号池分配（平台侧）', route: '/admin/channels/pricing', status: 'pending', desc: '为代理划拨专属号池资源', guide: '在【渠道管理 -> 渠道分组】中选择【代理专享】，勾选要划拨的独立上游渠道或物理服务器节点。' },
    { chapter: '2.10', chapterName: '2.10 渠道代理与分销管理', section: '2.10.3', name: '专属费率配置（平台侧）', route: '/admin/groups', status: 'partial', desc: '为代理配置差异化溢价率', guide: '在【分组管理】中为代理分组设置独立的“结算折扣比率”，如给予一级代理 7 折结算优惠。' },
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
