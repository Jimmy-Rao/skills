<!--
  @file form-items.vue — 常用表单控件片段参考

  规则：
  - label-position="left"，明确 label-width
  - size="default"（禁止 size="large"）
  - 所有 input/select 必须有 clearable
  - 超过 5 个选项的 el-select 必须加 filterable
  - 宽度用 Tailwind：class="!w-[200px]"
-->

<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="80px" size="default" status-icon>
    <!-- ── 文本输入 ─────────────────────────────────────────────────────── -->
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入名称" clearable class="!w-[200px]" />
    </el-form-item>

    <!-- ── 单选下拉（≤5 选项，无需 filterable）────────────────────────── -->
    <el-form-item label="类型" prop="type">
      <el-select v-model="form.type" clearable placeholder="请选择" class="!w-[160px]">
        <el-option label="选项A" value="a" />
        <el-option label="选项B" value="b" />
      </el-select>
    </el-form-item>

    <!-- ── 单选下拉（>5 选项，加 filterable）─────────────────────────── -->
    <el-form-item label="事件" prop="eventName">
      <el-select v-model="form.eventName" filterable clearable placeholder="请搜索或选择" class="!w-[220px]">
        <el-option v-for="item in eventList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <!-- ── 多选下拉 ────────────────────────────────────────────────────── -->
    <el-form-item label="属性" prop="attrs">
      <el-select
        v-model="form.attrs"
        multiple
        filterable
        clearable
        collapse-tags
        :max-collapse-tags="1"
        placeholder="请选择"
        class="!w-[220px]"
      >
        <el-option v-for="item in attrList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <!-- ── 日期范围 ────────────────────────────────────────────────────── -->
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

    <!-- ── 数字输入 ────────────────────────────────────────────────────── -->
    <el-form-item label="数量" prop="count">
      <el-input-number v-model="form.count" :min="0" :precision="0" controls-position="right" class="!w-[160px]" />
    </el-form-item>

    <!-- ── 文本域 ──────────────────────────────────────────────────────── -->
    <el-form-item label="描述" prop="description">
      <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" clearable />
    </el-form-item>

    <!-- ── 操作按钮行 ─────────────────────────────────────────────────── -->
    <!-- 规则：Primary=搜索/提交；Default=重置；Danger=删除；不相邻两个 Primary -->
    <el-form-item>
      <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="handleSearch">
        搜索
      </el-button>
      <el-button :icon="useRenderIcon(Refresh)" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>
