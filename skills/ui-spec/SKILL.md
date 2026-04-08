---
name: ui-spec
description: 为北斗数据中台前端创建生产级页面和组件。当用户需要构建或修改 Vue 页面、组件、弹窗、表格、表单或任何 UI 时使用此技能。生成符合项目现有模式和设计规范的高质量代码。
---

## 概述

本技能规范**北斗数据中台**前端 UI 开发（Vue 3 + TypeScript + Element Plus + vxe-table）。
本文件只定义**工作流程**与**功能约束**。所有共享开发规范、代码模板、代码片段都拆分到配套文件中，使用时直接读取，不要凭记忆编写。

---

## 必读共享文件

下面的共享文件在每次新增或修改功能前都应先读取：

| 文件                                          | 用途                                          |
| --------------------------------------------- | --------------------------------------------- |
| `.claude/skills/ui-spec/common/base-rules.md` | 前端 UI 共享规范，可被其他前端 skill 直接复用 |

---

## 模板与代码片段文件

生成代码前，按场景读取对应分类文件。

| 类别   | 任务                                   | 需读取的文件                                               |
| ------ | -------------------------------------- | ---------------------------------------------------------- |
| 页面类 | 新建列表 / CRUD 页面（`index.vue`）    | `.claude/skills/ui-spec/references/pages/list-page.vue`    |
| 页面类 | Hook 逻辑（`hook.ts`）                 | `.claude/skills/ui-spec/references/pages/hook.ts`          |
| 表格类 | vxe-table `gridOptions` + `gridEvents` | `.claude/skills/ui-spec/references/tables/grid-options.ts` |
| 弹窗类 | 弹窗 / 抽屉 / 删除确认                 | `.claude/skills/ui-spec/references/dialogs/add-dialog.ts`  |
| 表单类 | 表单控件（输入框、下拉、日期等）       | `.claude/skills/ui-spec/references/forms/form-items.vue`   |
| 通用类 | 图标导入与 ID 速查                     | `.claude/skills/ui-spec/references/common/icons.ts`        |

---

## 工作流程（按顺序执行）

1. **先读共享规范** — 首先读取 `.claude/skills/ui-spec/common/base-rules.md`，确保本次改动符合统一约束。
2. **判断页面类型** — 列表/CRUD 页、带图表的分析页，还是纯表单组件。
3. **读取分类模板** — 根据当前需求选择页面类、表格类、弹窗类、表单类或通用类参考文件。
4. **规划要创建的文件** — 最少需要 `index.vue` + `hook.ts`；如果有新增/编辑弹窗，再加 `form.vue`。
5. **生成代码** — 以模板为基础，替换所有 `MyPage` / `MyItem` / `/api/my-resource` 占位符。
6. **校验共享规范** — 提交前再次对照 `base-rules.md` 检查组件选型、样式、消息、权限和反模式。
7. **注册路由** — 如果是新页面，在 `src/router/modules/<module>.ts` 中添加路由配置。

---

## 功能约束

- 本技能用于页面、组件、弹窗、抽屉、表格、表单等 UI 场景，不用于后端逻辑设计。
- 新页面默认采用 `index.vue + hook.ts` 结构；存在新增/编辑能力时，优先补充 `form.vue`。
- `index.vue` 负责模板编排和 hook 接线；业务逻辑必须落到 `hook.ts` 或页面局部组件中。
- 新增列表或分析页时，默认按“标题栏 + 搜索区 + 数据表格”的三区结构组织。
- 新增页面时，除页面代码外，还应同步补齐路由配置；如涉及权限按钮，还应接入权限指令或脚本权限判断。
- 只在必要时读取相关代码片段，不要把所有模板内容原样拼接到最终代码中。

---

## 使用要求

- 公共约束不再重复写在本文件中，统一以 `.claude/skills/ui-spec/common/base-rules.md` 为准。
- 生成任何 UI 代码前，必须先读取共享规范，再读取具体分类模板。
- 如果共享规范与局部模板冲突，以共享规范为准；如果模板无法覆盖需求，应在不破坏共享规范前提下做最小扩展。
