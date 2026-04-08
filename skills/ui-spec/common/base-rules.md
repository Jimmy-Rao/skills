# 前端 UI 共享规范

本文件存放前端 UI 类技能的**共享开发规范**。凡是新增页面、修改页面、补充弹窗、扩展表单、调整表格时，都必须先读取并遵守本文件。

适用范围：`.github/skills/` 下所有涉及 Vue 页面、组件、弹窗、表格、表单、分析页、管理后台 UI 的技能。

---

## 一、技术栈（强制）

| 层级 | 库 / 版本 |
| --- | --- |
| 框架 | Vue 3.5 — `<script setup lang="ts">` |
| 语言 | TypeScript strict 模式 |
| UI 组件库 | Element Plus 2.13 |
| 数据表格 | vxe-table 4.16，统一通过 `ResizableTable` 封装使用 |
| 状态管理 | Pinia 3 — `useXxxStoreHook()` 模式 |
| HTTP 请求 | `@/utils/http` — `http.request<T>()` |
| 样式 | TailwindCSS 4 + SCSS + 项目 CSS 变量 |
| 图标 | Iconify，通过 `useRenderIcon()` 使用 |
| 图表 | ECharts 6，从 `@/plugins/echarts` 按需导入 |
| 工具函数 | `@pureadmin/utils`（debounce、cloneDeep 等） |

---

## 二、目录与文件结构

```
src/views/<模块>/<页面名>/
  index.vue      ← 仅写模板和参数传递，不写业务逻辑
  hook.ts        ← 所有状态、API 调用、gridOptions、computed
  form.vue       ← 在 addDialog/addDrawer 中渲染的表单组件
  components/    ← 页面级私有组件（按需创建）
```

- 每个 `index.vue` 必须包含 `defineOptions({ name: "大驼峰页面名" })`
- `index.vue` 只负责模板和 hook 接线，不承载业务逻辑
- 页面业务状态、接口请求、表格配置统一下沉到 `hook.ts`

---

## 三、页面三区布局

所有列表 / 分析页严格按以下三个区域的顺序布局：

| 区域 | CSS 类 | 内容 |
| --- | --- | --- |
| ① 标题栏 | `title-container bg-bg_color p-2` | 左：页面标题；右：刷新按钮 / 数据更新时间 |
| ② 搜索表单 | `form-container` + `v-loading` | `<el-form>` 搜索条件 + 操作按钮 |
| ③ 数据表格 | `table-container mt-2`（位于 `.main` 外） | `<ResizableTable>` |

- `ResizableTable` 导入路径：`@/views/analyze/eventAnalyze/components/ResizableTable/index.vue`
- 插槽约定：`#toolbarButtons`（左侧标题）、`#tools`（右侧操作）、`#empty` 固定使用 `<ReEmpty description="暂无数据" />`

---

## 四、核心规则

### 1. 组件选型

- 数据表格 → `ResizableTable` + `VxeGridProps`
- 弹窗 → `addDialog()`（`@/components/ReDialog`）
- 侧边抽屉 → `addDrawer()`（`@/components/ReDrawer`）
- 空状态 → `<ReEmpty description="暂无数据" />`
- 图标 → 只用 `useRenderIcon()`

### 2. HTTP 与消息

- HTTP 请求统一使用 `http.request<T>()` from `@/utils/http`
- 提示消息统一使用 `message()` from `@/utils/message`

### 3. 表单约束

- 所有表单必须设置 `label-position="left"` 及明确的 `label-width`
- 尺寸统一使用 `size="default"`
- 所有 `<el-input>` / `<el-select>` 必须加 `clearable`
- 超过约 5 个选项的 `<el-select>` 必须加 `filterable`
- 宽度通过 Tailwind 控制：`class="!w-[200px]"`

### 4. 样式约束

- 布局间距优先使用 Tailwind 工具类
- 主题色统一使用项目 CSS 变量（如 `bg-bg_color`、`text-text_color_primary`）
- 组件样式覆盖使用 `<style scoped lang="scss">` + `:deep()`
- 禁止使用内联 `style=""` 写布局
- 禁止硬编码十六进制颜色值

### 5. 交互质量

- 所有异步操作必须有 loading 状态
- 所有接口报错必须显示 `message("…", { type: "error" })`
- 所有空数据状态必须渲染 `<ReEmpty />`
- 纯图标按钮必须加 `v-tippy`
- 表格列必须设置 `width` 或 `min-width`；文本列加 `showOverflow`
- 按钮语义：`type="primary"`（主操作）、`type="danger"`（破坏性操作）、default（次要操作）；相邻两个按钮不能同为 `primary`

### 6. 权限控制

```vue
<el-button v-auth="'sys:user:add'" type="primary">新增</el-button>
```

```ts
import { hasAuth } from "@/utils/auth";
const canEdit = hasAuth("sys:user:edit");
```

---

## 五、常用组件速查

| 需求 | 组件 / API |
| --- | --- |
| 数据表格 | `ResizableTable` + `VxeGridProps` |
| 弹窗 | `addDialog()` — `@/components/ReDialog` |
| 侧边抽屉 | `addDrawer()` — `@/components/ReDrawer` |
| 空状态 | `<ReEmpty description="暂无数据" />` |
| 文本截断 + tooltip | `<ReText :line-clamp="1">` |
| 数字动画 | `<ReCountTo :start-val="0" :end-val="n" />` |
| 组织树选择 | `<ReOrganizationTreeSelect v-model="form.orgId" />` |
| 权限控制 | `v-auth="'permission:code'"` |
| 图表 | `import * as echarts from "@/plugins/echarts"` |

---

## 六、禁止清单

- ❌ 使用 `<el-table>` — 改用 `ResizableTable`
- ❌ 在模板中写 `<el-dialog>` / `<el-drawer>` — 改用 `addDialog()` / `addDrawer()`
- ❌ 直接使用 `axios` — 改用 `http.request()`
- ❌ `import { ElMessage }` — 改用 `@/utils/message`
- ❌ 使用 `<el-icon>` 或 `el-icon-*` 类名 — 改用 `useRenderIcon()`
- ❌ 用 `style=""` 写布局样式 — 改用 Tailwind
- ❌ 硬编码十六进制颜色值 — 改用 CSS 变量 token
- ❌ 在 `index.vue` 中写业务逻辑 — 移到 `hook.ts`
- ❌ 表单控件使用 `size="large"` — 统一用 `size="default"`
- ❌ `index.vue` 缺少 `defineOptions({ name: "…" })`