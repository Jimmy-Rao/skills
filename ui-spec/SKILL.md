---
name: ui-spec
description: Create production-grade frontend pages and components for the Beidou Analytics Platform. Use this skill when asked to build or modify Vue pages, components, dialogs, tables, forms, or any UI in this project. Generates consistent, high-quality code that follows the project's established patterns and design system.
applyTo: "d:/Work/beidou-frontend/**"
---

This skill guides the creation of front-end UI code for the **Beidou Analytics Platform** — a data analytics SaaS built with Vue 3 + TypeScript + Element Plus + vxe-table. Code must be consistent with the existing codebase, follow established project conventions, and maintain high design quality within the constraints of the design system.

---

## 1. Technology Stack (MANDATORY)

| Layer            | Library / Version                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| Framework        | Vue 3.5 — Composition API (`<script setup lang="ts">`)                            |
| Language         | TypeScript (strict)                                                               |
| Build            | Vite 7                                                                            |
| UI Components    | **Element Plus 2.13** — primary widget library                                    |
| Data Grids       | **vxe-table 4.16** / **`ResizableTable`** wrapper (preferred for all data tables) |
| State            | Pinia 3 — `useXxxStoreHook()` pattern                                             |
| HTTP             | `@/utils/http` (`http.request<T>`) — NEVER use raw axios                          |
| Styling          | TailwindCSS 4 utility classes + SCSS with project CSS variables                   |
| Icons            | Iconify via `useRenderIcon()` from `@/components/ReIcon/src/hooks`                |
| Date             | dayjs                                                                             |
| Charts           | ECharts 6 (imported selectively from `@/plugins/echarts`)                         |
| Debounce / utils | `@pureadmin/utils`                                                                |

---

## 2. File & Code Structure Conventions

### Page Files

Every page lives at `src/views/<module>/<pageName>/index.vue` and delegates business logic to a co-located `hook.ts`:

```
src/views/analyze/myPage/
  index.vue      ← template + wire-up only
  hook.ts        ← all state, API calls, gridOptions, computed
  components/    ← page-local components if needed
```

### Script Block

```vue
<script setup lang="ts">
import useHook from "./hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
// ... other imports

defineOptions({ name: "MyPageName" });
const props = defineProps<{ query?: SomeType }>(); // if needed

const { form, loading, gridOptions, gridEvents, onSearch /* ...other exports */ } = useHook(props);
</script>
```

### Hook Pattern (`hook.ts`)

```typescript
import { ref, reactive, computed, onMounted } from "vue";
import { debounce } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import type { VxeGridProps, VxeGridListeners } from "vxe-table";

export default function useMyPageHook(props?: any) {
  const loading = ref(false);
  const dataList = ref<any[]>([]);

  const form = reactive({
    pageIndex: 1,
    pageSize: 50
    // ... domain fields
  });

  const gridOptions = computed<VxeGridProps>(() => ({
    data: dataList.value,
    columns: [
      { field: "id", title: "ID", width: 80 }
      // ...
    ],
    pagerConfig: {
      currentPage: form.pageIndex,
      pageSize: form.pageSize,
      total: total.value
    }
  }));

  const gridEvents: VxeGridListeners = {
    pageChange({ currentPage, pageSize }) {
      form.pageIndex = currentPage;
      form.pageSize = pageSize;
      onSearch();
    }
  };

  async function onSearch() {
    loading.value = true;
    try {
      const res = await http.request<any>("get", "/api/route", { params: form });
      dataList.value = res.data ?? [];
    } catch {
      message("查询失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  onMounted(onSearch);

  return { form, loading, gridOptions, gridEvents, onSearch };
}
```

---

## 3. Page Template Structure (MANDATORY Layout)

Every analytical/list page follows this exact three-zone structure:

```vue
<template>
  <!-- Zone 1: Title bar -->
  <div v-loading="loading" class="main">
    <el-row class="title-container bg-bg_color p-2">
      <el-row class="font-bold text-2xl">页面标题</el-row>
      <el-row class="flex flex-grow justify-end gap-2 items-center">
        <!-- Update time, refresh button, etc. -->
      </el-row>
    </el-row>

    <!-- Zone 2: Search / filter form -->
    <el-row class="form-container">
      <el-form
        ref="formRef"
        :inline="false"
        :model="form"
        label-position="left"
        label-width="80px"
        size="default"
        class="search-form w-full"
      >
        <!-- form items -->
        <el-form-item>
          <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="handleSearch"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
  </div>

  <!-- Zone 3: Data table (outside .main for full-width/height) -->
  <div v-enhanced-loading="loadingConfig" class="table-container mt-2">
    <ResizableTable ref="resizableTableRef" :grid-options="gridOptions" :grid-events="gridEvents">
      <template #toolbarButtons>
        <el-row class="font-bold !px-2 !text-black !text-base">数据表格</el-row>
      </template>
      <template #tools>
        <!-- Download, column-picker, etc. -->
      </template>
      <template #empty>
        <ReEmpty description="暂无数据" />
      </template>
    </ResizableTable>
  </div>
</template>
```

---

## 4. Table Rules

### Use `ResizableTable` for ALL analytical data tables

**Import:** `import ResizableTable from "@/views/analyze/eventAnalyze/components/ResizableTable/index.vue"`

**Props:**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `gridOptions` | `VxeGridProps` | required | Pass from hook's computed |
| `gridEvents` | `VxeGridListeners` | — | Pagination, sort, filter events |
| `resizable` | `boolean` | `true` | User drag-to-resize height |
| `autoHeight` | `boolean` | `true` | Viewport-based auto height |
| `minHeight` | `number` | `300` | px |
| `maxHeight` | `number` | `1200` | px |

**Slots:**

- `#toolbarButtons` — left toolbar content (title, buttons)
- `#tools` — right toolbar (download, column picker)
- `#empty` — always use `<ReEmpty description="暂无数据" />`

**Standard `gridOptions` shape (define in hook.ts):**

```typescript
const gridOptions = computed<VxeGridProps>(() => ({
  data: dataList.value,
  loading: loading.value,
  columns: [...],
  pagerConfig: {
    currentPage: form.pageIndex,
    pageSize: form.pageSize,
    total: total.value,
    layouts: ["PrevPage", "Number", "NextPage", "Sizes", "Total"],
    pageSizes: [30, 50, 100],
  },
  // Enable virtual scrolling for large data sets
  virtualYConfig: { enabled: true, gt: 50 },
}))
```

### NEVER use bare `<el-table>` for new pages. Always use ResizableTable or pure-table.

---

## 5. Icon Usage (MANDATORY)

Always use `useRenderIcon()`. Never use raw `<el-icon>` or HTML entities.

```typescript
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
// Named import for static icons:
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import Edit from "@iconify-icons/ep/edit";
import Search from "@iconify-icons/ri/search-line";
```

```vue
<!-- In template -->
<el-button :icon="useRenderIcon(Refresh)" />
<el-button :icon="useRenderIcon('ri:search-line')" />
<el-button :icon="useRenderIcon('ep:plus')" />
```

Common icon IDs: `ep:refresh`, `ep:delete`, `ep:edit`, `ep:plus`, `ep:circle-plus`, `ep:download`, `ri:search-line`, `ri:download-2-line`, `ri:filter-line`.

---

## 6. Dialog & Drawer Rules

### Dialogs — use `addDialog()` / DO NOT use `<el-dialog>` directly

```typescript
import { addDialog } from "@/components/ReDialog";
import type { FormInstance } from "element-plus";

// Open a dialog
addDialog({
  title: "新增数据",
  width: "580px",
  draggable: true,
  fullscreenIcon: true,
  closeOnClickModal: false,
  contentRenderer: () => h(MyFormComponent, { ref: formRef, formData: row }),
  beforeSure(done, { options }) {
    const formEl = formRef.value?.formRef as FormInstance;
    formEl?.validate(valid => {
      if (valid) {
        submitData().then(() => done());
      }
    });
  }
});
```

### Drawers — use `addDrawer()` for side panels

Same API as `addDialog()` with additional `direction` prop (`"rtl"` default).

### NEVER use `<el-dialog>` or `<el-drawer>` in new pages. Always use the `addDialog`/`addDrawer` programmatic API.

---

## 7. Form Conventions

```vue
<el-form ref="formRef" :model="form" :rules="rules" label-position="left" label-width="80px" size="default" status-icon>
  <!-- Text input -->
  <el-form-item label="名称" prop="name">
    <el-input v-model="form.name" placeholder="请输入名称" clearable />
  </el-form-item>

  <!-- Select with search -->
  <el-form-item label="类型" prop="type">
    <el-select
      v-model="form.type"
      filterable
      clearable
      class="!w-[200px]"
      placeholder="请选择"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>

  <!-- Multi-select -->
  <el-form-item label="属性" prop="attrs">
    <el-select
      v-model="form.attrs"
      multiple
      filterable
      collapse-tags
      :max-collapse-tags="1"
      class="!w-[220px]"
    />
  </el-form-item>

  <!-- Date range -->
  <el-form-item label="日期范围" prop="dateRange">
    <el-date-picker
      v-model="form.dateRange"
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="YYYY-MM-DD"
    />
  </el-form-item>

  <!-- Action row -->
  <el-form-item>
    <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="handleSearch">
      搜索
    </el-button>
    <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">重置</el-button>
  </el-form-item>
</el-form>
```

**Rules:**

- `label-position="left"` and explicit `label-width` on all forms
- Use `size="default"` consistently (never `"large"`)
- `clearable` on all inputs/selects
- `filterable` on all selects with more than ~5 options
- Width constraints via Tailwind: `class="!w-[200px]"`

---

## 8. Loading States

Two loading patterns — use each in the right context:

```vue
<!-- Zone 1+2 (header + form): v-loading from Element Plus -->
<div v-loading="loading" class="main"></div>
```

`loadingConfig` shape (from hook):

```typescript
const loadingConfig = reactive({
  loading: false,
  text: "数据加载中...",
  svg: `<path .../>` // optional custom spinner SVG
});
```

---

## 9. CSS / Styling Rules

### Class Naming Priority

1. **Tailwind utility classes** for spacing, flex, text sizes, colors
2. **Project CSS variables** for theme colors (`bg-bg_color`, `text-text_color_primary`)
3. **SCSS scoped** only for component-specific structural overrides
4. **NEVER** write inline `style=""` for layout properties

### Key CSS Variable Tokens

```scss
// Backgrounds
bg-bg_color          // page background
bg-bg_color_overlay  // card / panel background

// Text
text-text_color_primary   // main text
text-text_color_regular   // secondary text
text-text_color_secondary // tertiary / hint

// Borders
border-border_color_light
border-border_color

// Primary brand
text-primary  bg-primary  // Element Plus primary blue
```

### Common Class Patterns

```vue
<!-- Page title -->
<el-row class="font-bold text-2xl"></el-row>
```

### SCSS Scoped — only for Element Plus deep overrides

```scss
<style scoped lang="scss">
:deep(.el-table) {
  .el-table__expand-icon { display: none; }
}
:deep(.el-form-item) {
  &.special-formItem .el-form-item__content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
```

---

## 10. Notification & Messages

```typescript
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

// Toasts
message("操作成功", { type: "success" });
message("请检查输入", { type: "warning" });
message("操作失败", { type: "error" });

// Confirmation dialog
ElMessageBox.confirm("确认删除该记录？", "提示", {
  confirmButtonText: "确认",
  cancelButtonText: "取消",
  type: "warning"
}).then(() => {
  /* proceed */
});
```

---

## 11. Permissions & Auth

Use the `v-auth` directive for permission-gated UI:

```vue
<el-button v-auth="'sys:user:add'" type="primary">新增</el-button>
<el-button v-auth="'sys:user:delete'" type="danger">删除</el-button>
```

Use `hasAuth()` in script logic:

```typescript
import { hasAuth } from "@/utils/auth";
const canEdit = hasAuth("sys:user:edit");
```

---

## 12. Component Quick Reference

| Need                     | Component / API                                     |
| ------------------------ | --------------------------------------------------- |
| Data table (analytics)   | `ResizableTable` + `VxeGridProps`                   |
| Modal dialog             | `addDialog()` from `@/components/ReDialog`          |
| Side panel               | `addDrawer()` from `@/components/ReDrawer`          |
| Empty state              | `<ReEmpty description="暂无数据" />`                |
| Icon button              | `<el-button :icon="useRenderIcon('ep:edit')" />`    |
| Truncated text + tooltip | `<ReText :line-clamp="1">content</ReText>`          |
| Animated counter         | `<ReCountTo :start-val="0" :end-val="count" />`     |
| Org tree selector        | `<ReOrganizationTreeSelect v-model="form.orgId" />` |
| Permission gate          | `v-auth="'permission:code'"` directive              |
| Toast message            | `message("msg", { type: "success" })`               |
| Success/error feedback   | `message()` from `@/utils/message`                  |
| Chart                    | `import * as echarts from "@/plugins/echarts"`      |

---

## 13. Design Quality Within System Constraints

While the tech stack and component library are fixed, design quality still matters:

- **Spacing & Density**: Use consistent spacing tokens. Prefer `gap-2` / `gap-4` for flex rows, `p-2` / `p-4` for containers. Avoid cramped layouts.
- **Typography Hierarchy**: Page titles `text-2xl font-bold`, section headers `text-lg font-bold` / `font-semibold`, body `text-sm` or `text-base`. Never use arbitrary sizes.
- **Color Discipline**: Use semantic CSS variables (`text-text_color_primary`, `bg-bg_color`) instead of hard-coded hex values. Use Element Plus `type` props (`type="primary"`, `type="success"`, etc.) for semantic color.
- **Feedback & Loading**: Every async action must show a loading state. Every error must show a `message()` toast. Every empty result must render `<ReEmpty />`.
- **Button Grouping**: Primary action = `type="primary"`. Destructive = `type="danger"`. Secondary = `type="default"`. Reset/cancel = plain or `link` type. Never put two `type="primary"` buttons side by side.
- **Table Columns**: Always set explicit `width` or `min-width` on columns. Use `showOverflow` tooltip for text that might truncate. Fixed key columns left/right when table scrolls.
- **Tooltips**: Use `v-tippy` for icon-only buttons: `v-tippy="{ content: '刷新', placement: 'bottom-start', zIndex: 41000 }"`.

---

## 14. Anti-Patterns (NEVER DO)

- ❌ Raw `<el-table>` for new pages — use `ResizableTable` or `pure-table`
- ❌ `<el-dialog>` / `<el-drawer>` inline in templates — use `addDialog()` / `addDrawer()`
- ❌ Direct `axios` calls — always use `http.request()` from `@/utils/http`
- ❌ Inline styles for layout (`style="margin-top: 12px"`) — use Tailwind
- ❌ Hard-coded color hex values in templates or scoped CSS
- ❌ Business logic in `index.vue` — keep it in `hook.ts`
- ❌ `import { ElMessage } from 'element-plus'` for toasts — use `@/utils/message`
- ❌ `<i class="el-icon-*">` or raw emoji as icons — use `useRenderIcon()`
- ❌ `size="large"` on form controls — use `size="default"`
- ❌ Skipping `defineOptions({ name: "..." })` on page components
