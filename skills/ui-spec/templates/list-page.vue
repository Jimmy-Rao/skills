<script setup lang="ts">
// ========== Imports ==========
import useHook from "./hook";
import ResizableTable from "@/views/analyze/eventAnalyze/components/ResizableTable/index.vue";
import ReEmpty from "@/components/ReEmpty/index.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";

// ========== Component Options ==========
defineOptions({ name: "MyPageName" }); // ← 替换为实际页面名称

// ========== Hook ==========
const { form, loading, gridOptions, gridEvents, handleSearch, resetForm } = useHook();
</script>

<template>
  <!-- Zone 1: 标题栏 -->
  <el-row class="title-container bg-bg_color p-2">
    <el-row class="font-bold text-2xl">页面标题</el-row>
    <el-row class="flex flex-grow justify-end gap-2 items-center">
      <el-button
        v-tippy="{ content: '刷新', placement: 'bottom-start', zIndex: 41000 }"
        type="default"
        size="small"
        :icon="useRenderIcon(Refresh)"
        :loading="loading"
        @click="handleSearch"
      />
    </el-row>
  </el-row>

  <!-- Zone 2: 搜索表单 -->
  <el-row v-loading="loading" class="form-container">
    <el-form :inline="false" :model="form" label-position="left" label-width="80px" size="default" class="search-form w-full">
      <!-- 示例：文本输入 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" clearable class="!w-[200px]" />
      </el-form-item>

      <!-- 示例：下拉选择 -->
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" filterable clearable placeholder="请选择" class="!w-[160px]">
          <el-option label="选项A" value="a" />
          <el-option label="选项B" value="b" />
        </el-select>
      </el-form-item>

      <!-- 示例：日期范围 -->
      <el-form-item label="日期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-row>

  <!-- Zone 3: 数据表格 (在 .main 外层，全宽) -->
  <div class="table-container mt-2">
    <ResizableTable :grid-options="gridOptions" :grid-events="gridEvents" auto-height>
      <template #toolbarButtons>
        <el-row class="font-bold !px-2 !text-black !text-base">数据列表</el-row>
      </template>
      <template #tools>
        <!-- 下载、列选择等工具按钮 -->
      </template>
      <template #empty>
        <ReEmpty description="暂无数据" />
      </template>
    </ResizableTable>
  </div>
</template>

<style scoped lang="scss">
/* 仅在需要 Element Plus deep override 时添加 */
</style>
