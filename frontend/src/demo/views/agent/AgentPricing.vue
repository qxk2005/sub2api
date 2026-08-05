<script setup lang="ts">
/**
 * 2.10.3 渠道代理专属费率与多维度加价配置
 * 支持针对「直营个人用户」与「下级企业租户」分别设置独立加价策略，
 * 且可绑定不同的「上游专属号池与底价」实现精细化差异计费。
 */
import { ref, computed } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()

// 当前激活的视图 Segment ('direct_user' | 'sub_tenant' | 'pools_view')
const activeTargetType = ref<'direct_user' | 'sub_tenant' | 'pools_view'>('direct_user')

// 过滤后的规则列表
const currentRules = computed(() => {
  if (activeTargetType.value === 'pools_view') return []
  return demoStore.agent.pricingRules.filter(
    (r: any) => r.targetType === activeTargetType.value
  )
})

// 工具函数：获取号池信息
const getPool = (poolId: string) => {
  return demoStore.agent.pools.find((p: any) => p.id === poolId) || { name: '默认号池', wholesaleDiscount: 1.0 }
}

// 工具函数：获取模型基础底价
const getModelBaseCost = (modelId: string) => {
  return demoStore.agent.baseModelCosts.find((m: any) => m.id === modelId) || { name: modelId, baseCost: 10.0, unit: '1M Tokens' }
}

// 计算价格详细数值
const calculatePrice = (rule: any) => {
  const model = getModelBaseCost(rule.modelId)
  const pool = getPool(rule.poolId)
  
  // 平台结算给代理的成本底价 = 模型官方基准价 * 号池折扣系数
  const agentCost = model.baseCost * (pool.wholesaleDiscount || 1.0)
  
  let finalCustomerPrice = 0
  let profitMargin = 0

  if (rule.markupType === 'ratio') {
    // 比例加价
    finalCustomerPrice = agentCost * (1 + rule.markupValue / 100)
  } else {
    // 固定金额加价
    finalCustomerPrice = agentCost + Number(rule.markupValue)
  }

  profitMargin = finalCustomerPrice - agentCost

  return {
    baseCost: model.baseCost,
    poolDiscount: ((1 - (pool.wholesaleDiscount || 1.0)) * 100).toFixed(0),
    agentCost: agentCost.toFixed(2),
    finalPrice: finalCustomerPrice.toFixed(2),
    profit: profitMargin.toFixed(2),
    unit: model.unit,
    modelName: model.name,
    poolName: pool.name
  }
}

// 新增加价规则弹窗控制
const showAddModal = ref(false)
const newRule = ref({
  targetType: 'direct_user' as 'direct_user' | 'sub_tenant',
  targetName: '直营个人用户 (默认全局)',
  poolId: 'pool-vip',
  modelId: 'gpt-4o',
  markupType: 'ratio' as 'ratio' | 'fixed',
  markupValue: 15,
  note: ''
})

// 监听弹窗打开时默认 targetType 与 Tab 同步
const openAddModal = () => {
  if (activeTargetType.value === 'sub_tenant') {
    newRule.value.targetType = 'sub_tenant'
    newRule.value.targetName = '下级企业租户 (自定义策略)'
  } else {
    newRule.value.targetType = 'direct_user'
    newRule.value.targetName = '直营个人用户 (自定义策略)'
  }
  showAddModal.value = true
}

// 预览当前弹窗配置的价格
const previewCalc = computed(() => {
  return calculatePrice(newRule.value)
})

let nextRuleId = 100
const saveRule = () => {
  demoStore.agent.pricingRules.unshift({
    id: nextRuleId++,
    targetType: newRule.value.targetType,
    targetName: newRule.value.targetName,
    poolId: newRule.value.poolId,
    modelId: newRule.value.modelId,
    markupType: newRule.value.markupType,
    markupValue: Number(newRule.value.markupValue),
    enabled: true,
    note: newRule.value.note || '手动新增定制策略'
  })
  demoStore.showToast(`已成功为【${newRule.value.targetName}】添加独立加价规则！`)
  showAddModal.value = false
}

// 删除规则
const deleteRule = (id: number) => {
  demoStore.agent.pricingRules = demoStore.agent.pricingRules.filter((r: any) => r.id !== id)
  demoStore.showToast('已删除该条费率加价规则')
}
</script>

<template>
  <div class="agent-pricing p-6 md:p-8 font-sans space-y-6 max-w-[1400px] mx-auto">
    <!-- 头部 Header Banner -->
    <div class="bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-2">
      <div class="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/80">
        <span>💳 2.10.3 渠道代理专属费率与分层定价矩阵</span>
      </div>
      <h1 class="text-2xl font-black text-slate-900 dark:text-white">差异化溢价与专属渠道加价配置</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        区别于统一简单加价，代理商可针对<strong class="text-slate-800 dark:text-slate-200">直营个人用户</strong>和<strong class="text-slate-800 dark:text-slate-200">下级企业租户</strong>独立制定价格策略，并基于不同的<strong class="text-amber-600 font-bold">上游专属号池折扣底价</strong>设定精确的多级穿透利润率。
      </p>
    </div>

    <!-- Segments 切换控制器 -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-dark-800 p-2 rounded-2xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div class="flex gap-2 w-full sm:w-auto overflow-x-auto">
        <button 
          @click="activeTargetType = 'direct_user'"
          :class="['px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap', activeTargetType === 'direct_user' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100']"
        >
          <span>👤 直营个人用户加价配置</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{{ demoStore.agent.pricingRules.filter((r: any) => r.targetType === 'direct_user').length }}</span>
        </button>

        <button 
          @click="activeTargetType = 'sub_tenant'"
          :class="['px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap', activeTargetType === 'sub_tenant' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100']"
        >
          <span>🏢 下级企业租户专属费率</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">{{ demoStore.agent.pricingRules.filter((r: any) => r.targetType === 'sub_tenant').length }}</span>
        </button>

        <button 
          @click="activeTargetType = 'pools_view'"
          :class="['px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap', activeTargetType === 'pools_view' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-slate-50 dark:bg-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100']"
        >
          <span>⚡ 上游专属号池底价表</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-dark-600 font-mono">{{ demoStore.agent.pools.length }}</span>
        </button>
      </div>

      <button 
        v-if="activeTargetType !== 'pools_view'"
        @click="openAddModal"
        class="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
      >
        <span>+ 新增加价规则</span>
      </button>
    </div>

    <!-- 策略说明与价格流转公式卡片 -->
    <div class="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 p-4 rounded-2xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
      <span class="text-lg">💡</span>
      <div class="space-y-1">
        <div class="font-bold flex items-center gap-2">
          <span>穿透计费与加价流转公式：</span>
          <span class="font-mono text-[11px] bg-white dark:bg-dark-800 px-2 py-0.5 rounded border border-amber-300/50">
            客户最终价 = (平台基础底价 × 号池专属折扣) + 加价额(或比例)
          </span>
        </div>
        <p class="opacity-90 leading-relaxed">
          代理商可根据客户粘性与规模，对<strong class="underline">直营散户设置统一较高零售溢价</strong>，对<strong class="underline">大客户企业租户绑定专属VIP号池并给予量大从优的低加价率</strong>。中间差价即为代理商秒级自动分账佣金。
        </p>
      </div>
    </div>

    <!-- TAB 1 & 2: 加价规则列表视图 -->
    <div v-if="activeTargetType !== 'pools_view'" class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 dark:border-dark-700 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">
            {{ activeTargetType === 'direct_user' ? '直营个人用户独立加价矩阵' : '下级企业租户专属溢价矩阵' }}
          </h3>
        </div>
        <span class="text-xs text-slate-400 font-mono">共 {{ currentRules.length }} 条生效规则</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 dark:bg-dark-700 text-slate-500 font-bold border-b border-slate-200/80 dark:border-dark-600">
            <tr>
              <th class="px-5 py-3.5">状态</th>
              <th class="px-5 py-3.5">适用客户对象</th>
              <th class="px-5 py-3.5">绑定上游专属号池</th>
              <th class="px-5 py-3.5">目标 AI 模型</th>
              <th class="px-5 py-3.5">平台结算底价 (Cost)</th>
              <th class="px-5 py-3.5">代理自主加价设定</th>
              <th class="px-5 py-3.5">客户最终实付价</th>
              <th class="px-5 py-3.5">代理预估单价利润</th>
              <th class="px-5 py-3.5">备注说明</th>
              <th class="px-5 py-3.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-dark-700">
            <tr v-for="rule in currentRules" :key="rule.id" class="hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors">
              <td class="px-5 py-3.5">
                <button 
                  @click="rule.enabled = !rule.enabled"
                  :class="['w-8 h-4.5 rounded-full transition-all relative', rule.enabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-dark-600']"
                >
                  <span :class="['absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all', rule.enabled ? 'left-4' : 'left-0.5']"></span>
                </button>
              </td>

              <!-- 客户对象 -->
              <td class="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                <span class="flex items-center gap-1.5">
                  <span class="text-slate-400">{{ rule.targetType === 'direct_user' ? '👤' : '🏢' }}</span>
                  {{ rule.targetName }}
                </span>
              </td>

              <!-- 上游号池 -->
              <td class="px-5 py-3.5">
                <span class="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 rounded-lg font-bold">
                  ⚡ {{ calculatePrice(rule).poolName }}
                </span>
              </td>

              <!-- 模型 -->
              <td class="px-5 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                {{ calculatePrice(rule).modelName }}
              </td>

              <!-- 结算成本 -->
              <td class="px-5 py-3.5 font-mono text-slate-500">
                ¥{{ calculatePrice(rule).agentCost }} / {{ calculatePrice(rule).unit }}
              </td>

              <!-- 加价设置 -->
              <td class="px-5 py-3.5">
                <span v-if="rule.markupType === 'ratio'" class="px-2 py-0.5 bg-amber-500 text-white font-mono font-bold rounded">
                  +{{ rule.markupValue }}% (按比例)
                </span>
                <span v-else class="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded">
                  +¥{{ rule.markupValue }} (按固定额)
                </span>
              </td>

              <!-- 客户实付价 -->
              <td class="px-5 py-3.5 font-mono text-base font-black text-slate-900 dark:text-white">
                ¥{{ calculatePrice(rule).finalPrice }}
              </td>

              <!-- 代理利润 -->
              <td class="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +¥{{ calculatePrice(rule).profit }} / {{ calculatePrice(rule).unit }}
              </td>

              <!-- 备注 -->
              <td class="px-5 py-3.5 text-slate-400 max-w-[150px] truncate">
                {{ rule.note }}
              </td>

              <!-- 操作 -->
              <td class="px-5 py-3.5 text-right">
                <button @click="deleteRule(rule.id)" class="text-slate-400 hover:text-red-500 font-bold transition-colors">
                  删除
                </button>
              </td>
            </tr>

            <tr v-if="currentRules.length === 0">
              <td colspan="10" class="py-12 text-center text-slate-400 text-xs">
                暂无此类客户的加价规则，点击右上角【+ 新增加价规则】快速建立。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: 上游专属号池与底价表视图 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="pool in demoStore.agent.pools" :key="pool.id" class="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-slate-200/80 dark:border-dark-700 shadow-sm space-y-4">
        <div class="flex justify-between items-center border-b border-slate-100 dark:border-dark-700 pb-3">
          <div class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>⚡ {{ pool.name }}</span>
          </div>
          <span class="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200/60">
            折算折扣: {{ ((pool.wholesaleDiscount || 1.0) * 10).toFixed(1) }} 折
          </span>
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex justify-between text-slate-500">
            <span>并发上限 (QPS):</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ pool.qps }} QPS</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>包含 Key 数量:</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">{{ pool.keys }} 个</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>运行状态:</span>
            <span class="text-emerald-600 font-bold">🟢 正常运行</span>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-dark-700">
          <div class="text-[11px] font-bold text-slate-400 mb-2">涵盖模型平台结算成本底价：</div>
          <div class="space-y-1.5 font-mono text-xs">
            <div v-for="modelId in pool.models" :key="modelId" class="flex justify-between p-2 bg-slate-50 dark:bg-dark-700 rounded-xl">
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ getModelBaseCost(modelId).name }}</span>
              <span class="text-amber-600 dark:text-amber-400 font-black">
                ¥{{ (getModelBaseCost(modelId).baseCost * (pool.wholesaleDiscount || 1.0)).toFixed(2) }} / {{ getModelBaseCost(modelId).unit }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热增加价规则 Modal 弹窗 -->
    <Transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="showAddModal = false">
        <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-slate-200/80 dark:border-dark-700 space-y-5">
          <div class="flex justify-between items-center border-b border-slate-100 dark:border-dark-700 pb-3">
            <h3 class="text-lg font-black text-slate-900 dark:text-white">💳 定制专属加价规则</h3>
            <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
          </div>

          <div class="space-y-4">
            <!-- 目标类型与对象名称 -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">客户分类</label>
                <select v-model="newRule.targetType" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option value="direct_user">👤 直营个人用户</option>
                  <option value="sub_tenant">🏢 下级企业租户</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">特定适用客户名称</label>
                <select v-if="newRule.targetType === 'sub_tenant'" v-model="newRule.targetName" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option>示例科技有限公司 (企业)</option>
                  <option>创新工坊 (企业)</option>
                  <option>智慧教育科技 (企业)</option>
                  <option>下级租户通用默认策略</option>
                </select>
                <input v-else v-model="newRule.targetName" type="text" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white" />
              </div>
            </div>

            <!-- 上游专属号池与目标模型 -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">选择上游专属号池</label>
                <select v-model="newRule.poolId" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option v-for="pool in demoStore.agent.pools" :key="pool.id" :value="pool.id">⚡ {{ pool.name }}</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">选择目标 AI 模型</label>
                <select v-model="newRule.modelId" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option v-for="model in demoStore.agent.baseModelCosts" :key="model.id" :value="model.id">{{ model.name }}</option>
                </select>
              </div>
            </div>

            <!-- 加价模式与数值 -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">加价模式</label>
                <select v-model="newRule.markupType" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-bold outline-none text-slate-900 dark:text-white">
                  <option value="ratio">按比例加价 (%)</option>
                  <option value="fixed">按固定额加价 (¥/1M)</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {{ newRule.markupType === 'ratio' ? '加价百分比 (%)' : '加价金额 (元/1M Tokens)' }}
                </label>
                <input v-model.number="newRule.markupValue" type="number" step="0.1" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs font-mono font-bold outline-none text-slate-900 dark:text-white" />
              </div>
            </div>

            <!-- 备注说明 -->
            <div>
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">备注说明</label>
              <input v-model="newRule.note" type="text" placeholder="如：大客户定制优惠协议" class="w-full px-3 py-2 bg-slate-50 dark:bg-dark-700 border border-slate-200 dark:border-dark-600 rounded-xl text-xs outline-none text-slate-900 dark:text-white" />
            </div>

            <!-- 实时价格算术预览卡 -->
            <div class="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-2 text-xs">
              <div class="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                <span>🧮 实时加价与利润测算：</span>
                <span class="font-mono">({{ previewCalc.modelName }})</span>
              </div>
              <div class="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                <div>
                  <div>代理结算底价:</div>
                  <div class="font-bold text-slate-900 dark:text-white">¥{{ previewCalc.agentCost }}</div>
                </div>
                <div>
                  <div>客户最终显示售价:</div>
                  <div class="font-bold text-amber-600 dark:text-amber-400">¥{{ previewCalc.finalPrice }}</div>
                </div>
                <div>
                  <div>代理预估净佣金:</div>
                  <div class="font-bold text-emerald-600">¥{{ previewCalc.profit }} / {{ previewCalc.unit }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button @click="showAddModal = false" class="px-5 py-2 bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">取消</button>
            <button @click="saveRule" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm">保存规则</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
