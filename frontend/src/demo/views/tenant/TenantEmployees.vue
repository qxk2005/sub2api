<script setup lang="ts">
/**
 * 2.7.6 子账号与企业员工管理 (企业租户控制台)
 * 苹果高级灰白配色，支持企业管理员直接创建员工账号 (参考 sub2api 用户模型属性: 姓名、邮箱、角色、额度、并发 QPS、RPM Cap 及状态管控)
 */
import { ref, computed } from 'vue'
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()

const searchQuery = ref('')
const statusFilter = ref('全部')

// 过滤员工列表
const filteredEmployees = computed(() => {
  return demoStore.tenant.employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        emp.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === '全部' || emp.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

// 创建员工 Modal 控制 (基于 sub2api 用户模型属性)
const isCreateEmployeeModalOpen = ref(false)
const newEmployeeForm = ref({
  name: '',
  email: '',
  role: '普通员工',
  quota: 500000,
  concurrency: 16,
  rpmLimit: 600,
  notes: ''
})

// 额度划拨 Modal 控制
const isRechargeModalOpen = ref(false)
const selectedEmployee = ref<any>(null)
const rechargeAmount = ref(100000)

// Toast 通知
const showToast = ref(false)
const toastMessage = ref('')

const triggerToast = (msg: string) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

// 提交创建员工 (sub2api 属性直接写入)
const submitCreateEmployee = () => {
  if (!newEmployeeForm.value.name || !newEmployeeForm.value.email) return
  const newId = demoStore.tenant.employees.length + 1

  const newEmp = {
    id: newId,
    name: newEmployeeForm.value.name,
    email: newEmployeeForm.value.email,
    role: newEmployeeForm.value.role,
    quota: newEmployeeForm.value.quota,
    used: 0,
    concurrency: newEmployeeForm.value.concurrency,
    rpmLimit: newEmployeeForm.value.rpmLimit,
    status: '正常',
    lastActive: '刚刚',
    notes: newEmployeeForm.value.notes || '企业管理员直接创建账号'
  }

  demoStore.tenant.employees.unshift(newEmp)
  demoStore.tenant.employeeCount++

  newEmployeeForm.value = {
    name: '',
    email: '',
    role: '普通员工',
    quota: 500000,
    concurrency: 16,
    rpmLimit: 600,
    notes: ''
  }
  isCreateEmployeeModalOpen.value = false
  triggerToast(`✓ 成功直接创建员工账号【${newEmp.name}】(${newEmp.email})！`)
}

// 划拨额度
const openRechargeModal = (emp: any) => {
  selectedEmployee.value = emp
  rechargeAmount.value = 100000
  isRechargeModalOpen.value = true
}

const submitRecharge = () => {
  if (selectedEmployee.value && rechargeAmount.value > 0) {
    selectedEmployee.value.quota += rechargeAmount.value
    if (selectedEmployee.value.status === '余额预警') {
      selectedEmployee.value.status = '正常'
    }
    isRechargeModalOpen.value = false
    triggerToast(`✓ 已成功为员工【${selectedEmployee.value.name}】划拨 ${rechargeAmount.value.toLocaleString()} Tokens 额度！`)
  }
}

// 冻结 / 解封员工账号
const toggleStatus = (emp: any) => {
  emp.status = emp.status === '已停用' ? '正常' : '已停用'
  triggerToast(`✓ 员工【${emp.name}】账号状态已更新为：${emp.status}`)
}
</script>

<template>
  <div class="tenant-employees p-6 md:p-8 font-sans space-y-6 relative selection:bg-blue-100">
    
    <!-- Toast 通知 -->
    <div v-if="showToast" class="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slide-down">
      <span class="text-emerald-400 font-bold text-base">✓</span>
      <div class="text-xs">
        <div class="font-bold text-white">企业员工管理成功</div>
        <div class="text-slate-400">{{ toastMessage }}</div>
      </div>
    </div>

    <!-- Header Banner (苹果灰白卡片风) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-dark-800 p-6 rounded-3xl border border-slate-200/80 dark:border-dark-700 shadow-sm">
      <div>
        <div class="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold border border-blue-200/80">
          <span>👥 FRS 2.7.6 企业子账号与员工直建中心</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white mt-1.5">企业员工账号管理</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          在此直接创建与管控企业内部员工账号、分配底层 API 额度、配置并发 limit 并实时监管调用状态。
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button 
          @click="isCreateEmployeeModalOpen = true"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>+ 直接创建新员工账号</span>
        </button>
      </div>
    </div>

    <!-- 员工表格主面板 -->
    <div class="bg-white dark:bg-dark-800 rounded-3xl border border-slate-200/80 dark:border-dark-700 p-6 shadow-sm space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="relative w-full sm:w-72">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索员工姓名、邮箱..." 
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div class="flex items-center space-x-3 text-xs text-slate-500">
          <span>状态过滤:</span>
          <select v-model="statusFilter" class="border border-slate-200/80 bg-slate-50 rounded-2xl px-3 py-1.5 outline-none font-bold text-slate-700">
            <option value="全部">全部状态</option>
            <option value="正常">正常运行</option>
            <option value="余额预警">余额预警</option>
            <option value="已停用">已停用</option>
          </select>
        </div>
      </div>

      <!-- 员工列表表格 (苹果灰白卡片桌布) -->
      <div class="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th class="px-5 py-3.5">员工姓名 (username) / 邮箱</th>
              <th class="px-5 py-3.5">账号角色</th>
              <th class="px-5 py-3.5">Token 额度使用情况</th>
              <th class="px-5 py-3.5">并发 (QPS) / RPM</th>
              <th class="px-5 py-3.5">账号状态</th>
              <th class="px-5 py-3.5">最近活跃时间</th>
              <th class="px-5 py-3.5 text-right">员工账号直接管控</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr v-for="emp in filteredEmployees" :key="emp.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="px-5 py-4 font-sans">
                <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>👤</span>
                  <span>{{ emp.name }}</span>
                </div>
                <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ emp.email }}</div>
              </td>

              <td class="px-5 py-4 font-sans whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                    emp.role === '部门管理员' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80' : 'bg-slate-100 text-slate-700 border-slate-200'
                  ]"
                >
                  {{ emp.role }}
                </span>
              </td>

              <td class="px-5 py-4 font-sans">
                <div class="w-48">
                  <div class="flex justify-between text-[11px] mb-1 font-mono">
                    <span class="font-bold text-slate-800">{{ emp.used.toLocaleString() }}</span>
                    <span class="text-slate-400">/ {{ emp.quota.toLocaleString() }}</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="h-1.5 rounded-full transition-all"
                      :class="(emp.used / emp.quota) > 0.9 ? 'bg-rose-500' : 'bg-blue-600'" 
                      :style="{ width: `${Math.min(100, (emp.used / emp.quota) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4 font-sans text-slate-600">
                <span class="font-bold text-slate-900">{{ emp.concurrency || 16 }} QPS</span>
                <span class="text-[10px] text-slate-400 block">{{ emp.rpmLimit || 600 }} RPM</span>
              </td>

              <td class="px-5 py-4 font-sans whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shadow-2xs',
                    emp.status === '正常' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 
                    emp.status === '余额预警' ? 'bg-amber-50 text-amber-700 border-amber-200/80' : 'bg-rose-50 text-rose-700 border-rose-200/80'
                  ]"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', emp.status === '正常' ? 'bg-emerald-500 animate-pulse' : emp.status === '余额预警' ? 'bg-amber-500' : 'bg-rose-500']"></span>
                  <span>{{ emp.status }}</span>
                </span>
              </td>

              <td class="px-5 py-4 text-slate-400 font-sans">
                {{ emp.lastActive }}
              </td>

              <td class="px-5 py-4 text-right font-sans whitespace-nowrap">
                <div class="inline-flex items-center justify-end space-x-2">
                  <button 
                    @click="openRechargeModal(emp)"
                    class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs border border-blue-200/60 transition-all shadow-2xs active:scale-95"
                  >
                    <span>⚡</span>
                    <span>划拨额度</span>
                  </button>

                  <button 
                    @click="toggleStatus(emp)"
                    :class="[
                      'inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all shadow-2xs active:scale-95',
                      emp.status === '已停用' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border-slate-200'
                    ]"
                  >
                    <span>{{ emp.status === '已停用' ? '🔓 激活' : '🔒 停用' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页控制 -->
      <div class="p-2 flex items-center justify-between text-xs text-slate-500 font-mono">
        <div>共 {{ filteredEmployees.length }} 位员工账号</div>
        <div class="flex space-x-1">
          <button class="px-3 py-1 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50" disabled>上一页</button>
          <button class="px-3 py-1 bg-slate-900 text-white rounded-xl font-bold">1</button>
          <button class="px-3 py-1 border border-slate-200 rounded-xl hover:bg-slate-50">下一页</button>
        </div>
      </div>
    </div>

    <!-- Modal 1: 直接创建新员工账号 (对齐 sub2api 用户模型属性) -->
    <div v-if="isCreateEmployeeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-5">
        <div class="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-dark-700">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>+ 直接创建新员工账号 (sub2api 属性)</span>
          </h3>
          <button @click="isCreateEmployeeModalOpen = false" class="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <!-- 员工姓名 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">员工姓名 (username) <span class="text-red-500">*</span></label>
            <input 
              v-model="newEmployeeForm.name" 
              type="text" 
              placeholder="例如: 赵云" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <!-- 员工工作邮箱 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">员工工作邮箱 (email) <span class="text-red-500">*</span></label>
            <input 
              v-model="newEmployeeForm.email" 
              type="email" 
              placeholder="例如: zhaoyun@demo.com" 
              class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none focus:border-blue-500" 
            />
          </div>

          <!-- 员工角色与初始额度 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">员工内部角色 (role)</label>
              <select v-model="newEmployeeForm.role" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none font-bold">
                <option value="部门管理员">部门管理员 (Tenant Admin)</option>
                <option value="普通员工">普通员工 (Tenant User)</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">分配 Token 初始额度 (balance)</label>
              <input v-model.number="newEmployeeForm.quota" type="number" step="100000" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono outline-none" />
            </div>
          </div>

          <!-- 并发与 RPM 限额 -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">并发 limit (concurrency)</label>
              <input v-model.number="newEmployeeForm.concurrency" type="number" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono outline-none" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-300">RPM 限额 (rpm_limit)</label>
              <input v-model.number="newEmployeeForm.rpmLimit" type="number" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs font-mono outline-none" />
            </div>
          </div>

          <!-- 员工备注 -->
          <div class="space-y-1">
            <label class="font-bold text-slate-700 dark:text-slate-300">所属部门 / 备注 (notes)</label>
            <input v-model="newEmployeeForm.notes" type="text" placeholder="例如: AI 算法团队" class="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl text-xs outline-none" />
          </div>

          <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl text-[11px] text-blue-700 dark:text-blue-300">
            💡 创建后将直接生成员工账号与初始 API Key 额度，员工可直接使用其工作邮箱进行独立调用。
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isCreateEmployeeModalOpen = false" class="px-4 py-2 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs">
            取消
          </button>
          <button 
            @click="submitCreateEmployee" 
            :disabled="!newEmployeeForm.name || !newEmployeeForm.email"
            :class="['px-4 py-2 rounded-xl font-bold text-xs transition-colors', (!newEmployeeForm.name || !newEmployeeForm.email) ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500']"
          >
            确认直接创建员工
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: 为员工划拨增加 Token 额度 -->
    <div v-if="isRechargeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-dark-800 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-dark-700 shadow-2xl space-y-4 text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-slate-200">
          <h3 class="font-bold text-sm text-slate-900">⚡ 为员工【{{ selectedEmployee?.name }}】划拨额度</h3>
          <button @click="isRechargeModalOpen = false" class="text-slate-400">✕</button>
        </div>

        <div class="space-y-3">
          <div class="text-slate-500">
            当前已有额度: <span class="font-bold text-slate-900 font-mono">{{ selectedEmployee?.quota.toLocaleString() }} Tokens</span>
          </div>
          <div class="space-y-1">
            <label class="font-bold text-slate-700">追加划拨额度 (Tokens)</label>
            <input v-model.number="rechargeAmount" type="number" step="50000" class="w-full p-2.5 bg-slate-50 border rounded-xl font-mono" />
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-2">
          <button @click="isRechargeModalOpen = false" class="px-4 py-2 bg-slate-100 rounded-xl font-bold">取消</button>
          <button @click="submitRecharge" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">确认划拨</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-slide-down {
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
