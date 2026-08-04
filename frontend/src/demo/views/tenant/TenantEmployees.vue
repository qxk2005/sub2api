<script setup lang="ts">
/**
 * 2.7.6 子账号管理
 */
import { useDemoStore } from '../../stores/useDemoStore'

const demoStore = useDemoStore()
</script>

<template>
  <div class="tenant-employees p-8">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">员工与子账号管理</h1>
        <p class="text-slate-500 text-sm mt-1">管理企业内部员工账号，为团队成员分配模型调用额度。</p>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          导入 Excel
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          + 邀请员工
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- 工具栏 -->
      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div class="relative">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="搜索员工姓名或邮箱..." class="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow">
        </div>
        <div class="flex items-center space-x-2 text-sm text-slate-500">
          <span>状态过滤:</span>
          <select class="border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none">
            <option>全部</option>
            <option>正常</option>
            <option>余额预警</option>
            <option>已停用</option>
          </select>
        </div>
      </div>

      <!-- 员工列表 -->
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
          <tr>
            <th class="px-6 py-4 font-medium">员工信息</th>
            <th class="px-6 py-4 font-medium">角色</th>
            <th class="px-6 py-4 font-medium">额度使用情况</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium">最近活跃</th>
            <th class="px-6 py-4 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="emp in demoStore.tenant.employees" :key="emp.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-medium text-slate-900">{{ emp.name }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ emp.email }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-md text-xs font-medium" :class="emp.role === '部门管理员' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'">
                {{ emp.role }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="w-40">
                <div class="flex justify-between text-[11px] mb-1 font-mono">
                  <span class="text-slate-500">{{ emp.used.toLocaleString() }}</span>
                  <span class="text-slate-400">/ {{ emp.quota.toLocaleString() }}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5">
                  <div class="h-1.5 rounded-full" 
                       :class="(emp.used/emp.quota) > 0.9 ? 'bg-red-500' : 'bg-blue-500'" 
                       :style="{ width: `${Math.min(100, (emp.used/emp.quota)*100)}%` }">
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full mr-2" 
                     :class="{
                       'bg-green-500': emp.status === '正常',
                       'bg-red-500': emp.status === '已停用',
                       'bg-amber-500 animate-pulse': emp.status === '余额预警'
                     }"></div>
                <span :class="{'text-amber-600 font-medium': emp.status === '余额预警'}">{{ emp.status }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-slate-500">{{ emp.lastActive }}</td>
            <td class="px-6 py-4 text-right space-x-3">
              <button class="text-blue-600 hover:text-blue-800 font-medium">划拨额度</button>
              <button class="text-slate-400 hover:text-slate-600 font-medium">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页占位 -->
      <div class="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <div>共 {{ demoStore.tenant.employeeCount }} 条记录</div>
        <div class="flex space-x-1">
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>上一页</button>
          <button class="px-3 py-1 border border-blue-600 bg-blue-50 text-blue-600 rounded font-medium">1</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>
