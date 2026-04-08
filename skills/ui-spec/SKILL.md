---
name: ui-spec
description: 为北斗数据中台前端创建生产级页面和组件。当用户需要构建或修改 Vue 页面、组件、弹窗、表格、表单或任何 UI 时使用此技能。生成符合项目现有模式和设计规范的高质量代码。
---

## 概述

本技能规范**北斗数据中台**前端 UI 开发（Vue 3 + TypeScript + Element Plus + vxe-table）。
文件只定义**工作流程**和**规则**，所有具体代码模板均存放在配套文件中——直接读取文件，不要凭记忆编写。

---

## 模板与代码片段文件

生成代码前，先读取对应的参考文件。

| 任务                                   | 需读取的文件                                      |
| -------------------------------------- | ------------------------------------------------- |
| 新建列表 / CRUD 页面（`index.vue`）    | `.github/skills/ui-spec/templates/list-page.vue`  |
| Hook 逻辑（`hook.ts`）                 | `.github/skills/ui-spec/templates/hook.ts`        |
| vxe-table `gridOptions` + `gridEvents` | `.github/skills/ui-spec/snippets/grid-options.ts` |
| 弹窗 / 抽屉 / 删除确认                 | `.github/skills/ui-spec/snippets/add-dialog.ts`   |
| 表单控件（输入框、下拉、日期等）       | `.github/skills/ui-spec/snippets/form-items.vue`  |
| 图标导入与 ID 速查                     | `.github/skills/ui-spec/snippets/icons.ts`        |

---

## 工作流程（按顺序执行）

1. **判断页面类型** — 列表/CRUD 页、带图表的分析页，还是纯表单组件。
2. **读取模板文件** — 根据上方表格决定需要读哪些文件。
3. **规划要创建的文件** — 最少需要 `index.vue` + `hook.ts`；如果有新增/编辑弹窗，再加 `form.vue`。
4. **生成代码** — 以模板为基础，替换所有 `MyPage` / `MyItem` / `/api/my-resource` 占位符。
5. **检查反模式** — 对照底部的禁止清单逐条核验。
6. **注册路由** — 如果是新页面，在 `src/router/modules/<module>.ts` 中添加路由配置。

---

## 一、技术栈（强制）

| 层级      | 库 / 版本                                          |
| --------- | -------------------------------------------------- |
| 框架      | Vue 3.5 — `<script setup lang="ts">`               |
| 语言      | TypeScript strict 模式                             |
| UI 组件库 | Element Plus 2.13                                  |
| 数据表格  | vxe-table 4.16，统一通过 `ResizableTable` 封装使用 |
| 状态管理  | Pinia 3 — `useXxxStoreHook()` 模式                 |
| HTTP 请求 | `@/utils/http` — `http.request<T>()`               |
| 样式      | TailwindCSS 4 + SCSS + 项目 CSS 变量               |
| 图标      | Iconify，通过 `useRenderIcon()` 使用               |
| 图表      | ECharts 6，从 `@/plugins/echarts` 按需导入         |
| 工具函数  | `@pureadmin/utils`（debounce、cloneDeep 等）       |

---

## 二、文件目录结构

```
src/views/<模块>/<页面名>/
  index.vue      ← 仅写模板和参数传递，不写业务逻辑
  hook.ts        ← 所有状态、API 调用、gridOptions、computed
  form.vue       ← 在 addDialog/addDrawer 中渲染的表单组件
  components/    ← 页面级私有组件（按需创建）
```

每个 `index.vue` 必须包含 `defineOptions({ name: "大驼峰页面名" })`。

---

## 三、页面三区布局

所有列表 / 分析页严格按以下三个区域的顺序布局：

| 区域       | CSS 类                                    | 内容                                      |
| ---------- | ----------------------------------------- | ----------------------------------------- |
| ① 标题栏   | `title-container bg-bg_color p-2`         | 左：页面标题；右：刷新按钮 / 数据更新时间 |
| ② 搜索表单 | `form-container` + `v-loading`            | `<el-form>` 搜索条件 + 操作按钮           |
| ③ 数据表格 | `table-container mt-2`（位于 `.main` 外） | `<ResizableTable>`                        |

`ResizableTable` 导入路径：`@/views/analyze/eventAnalyze/components/ResizableTable/index.vue`

插槽说明：`#toolbarButtons`（左侧标题）、`#tools`（右侧操作）、`#empty` → 固定使用 `<ReEmpty description="暂无数据" />`。

---

## 四、核心规则（不可违反）

### 组件选型

- 数据表格 → `ResizableTable` + `VxeGridProps`（禁止裸用 `<el-table>`）
- 弹窗 → `addDialog()`（`@/components/ReDialog`，禁止 `<el-dialog>`）
- 侧边抽屉 → `addDrawer()`（`@/components/ReDrawer`，禁止 `<el-drawer>`）
- 空状态 → `<ReEmpty description="暂无数据" />`
- 图标 → 只用 `useRenderIcon()`（禁止 `<el-icon>`、emoji、`el-icon-*` 类名）

### HTTP 与消息

- HTTP 请求 → `http.request<T>()` from `@/utils/http`（禁止直接用 axios）
- 提示消息 → `message()` from `@/utils/message`（禁止直接用 `ElMessage`）

### 表单

- 所有表单必须设置 `label-position="left"` 及明确的 `label-width`
- 尺寸统一使用 `size="default"`（禁止 `size="large"`）
- 所有 `<el-input>` / `<el-select>` 必须加 `clearable`
- 超过约 5 个选项的 `<el-select>` 必须加 `filterable`
- 宽度通过 Tailwind 控制：`class="!w-[200px]"`

### 样式

- 布局间距 → Tailwind 工具类
- 主题色 → 项目 CSS 变量（`bg-bg_color`、`text-text_color_primary` 等）
- 组件样式覆盖 → `<style scoped lang="scss">` + `:deep()`
- **禁止**用 `style=""` 写布局；**禁止**硬编码十六进制颜色值

### 交互质量

- 所有异步操作 → 必须有 loading 状态
- 所有接口报错 → 必须显示 `message("…", { type: "error" })` 提示
- 所有空数据状态 → 必须渲染 `<ReEmpty />`
- 纯图标按钮 → 必须加 `v-tippy="{ content: '刷新', placement: 'bottom-start', zIndex: 41000 }"`
- 表格列 → 必须设置 `width` 或 `min-width`；文本列加 `showOverflow`
- 按钮语义：`type="primary"`（主操作）、`type="danger"`（破坏性操作）、default（次要操作）；相邻两个按钮不能同为 `primary`

### 权限控制

```vue
<el-button v-auth="'sys:user:add'" type="primary">新增</el-button>
```

```ts
import { hasAuth } from "@/utils/auth";
const canEdit = hasAuth("sys:user:edit");
```

---

## 五、常用组件速查

| 需求               | 组件 / API                                          |
| ------------------ | --------------------------------------------------- |
| 数据表格           | `ResizableTable` + `VxeGridProps`                   |
| 弹窗               | `addDialog()` — `@/components/ReDialog`             |
| 侧边抽屉           | `addDrawer()` — `@/components/ReDrawer`             |
| 空状态             | `<ReEmpty description="暂无数据" />`                |
| 文本截断 + tooltip | `<ReText :line-clamp="1">`                          |
| 数字动画           | `<ReCountTo :start-val="0" :end-val="n" />`         |
| 组织树选择         | `<ReOrganizationTreeSelect v-model="form.orgId" />` |
| 权限控制           | `v-auth="'permission:code'"`                        |
| 图表               | `import * as echarts from "@/plugins/echarts"`      |

---

## 六、禁止清单（绝对不能做）

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
