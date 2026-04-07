# AI 前端页面生成技能 (`ui-spec`) 使用指南

## Skill技能地址

请查看[https://github.com/Jimmy-Rao/skills/blob/main/skills/ui-spec/SKILL.md](https://github.com/Jimmy-Rao/skills/blob/main/skills/ui-spec/SKILL.md)

## 这是什么？

`ui-spec` 是一个 AI Agent 技能文件，配置在项目 `SKILL.md` 中。当你在 VS Code 或其他工具中使用 AI 助手生成或修改前端页面时，它会自动加载这套规范，确保 AI 输出的代码与项目现有风格保持一致。

## 解决什么问题？

| 问题 | 解决方式 |
|------|----------|
| AI 生成的代码风格不统一 | 技能文件定义了固定的页面结构、组件选型、命名规范 |
| 新人不熟悉项目组件封装 | AI 自动使用 `ResizableTable`、`addDrawer()`、`useRenderIcon()` 等项目封装 |
| 重复沟通"用哪个组件" | 技能文件内置了组件选型决策表，AI 直接遵循 |
| 生成代码需要大量手动修正 | 输出代码可直接运行，符合 lint 规则 |

## 如何使用

### 前置条件

- VS Code或其他工具 + GitHub Copilot Chat / claude / Codex 扩展
- 技能文件已放置在 `SKILL.md`

### 使用方式

在 AI Chat 中直接用自然语言描述需求即可，技能会自动生效：

```text
# 示例 1：创建新页面
在系统管理下新增一个全站通知菜单，功能有通知列表增删改查，查询条件可以查标题

# 示例 2：修改现有页面
给事件分析页面的表格新增一列「创建人」，加上排序功能

# 示例 3：新增弹窗表单
给用户管理页面添加一个「重置密码」的弹窗，需要输入新密码和确认密码
```

### AI 会自动完成

- 创建标准文件结构 — `index.vue` + `hook.ts` + `form.vue`（如需要）
- 选择正确的组件 — 表格用 `ResizableTable`、弹窗用 `addDrawer()`、图标用 `useRenderIcon()`
- 遵循三区布局 — 标题栏 → 搜索表单 → 数据表格
- 接入已有 API 层 — 使用 `@/utils/http` 发请求，`@/utils/message` 做提示
- 添加路由配置 — 如果是新页面，自动在 `router/modules/` 中注册

## 生成效果示例

以「新增全站通知管理页面」为例，AI 一次性生成以下文件：

```text
src/views/system/notice/
├── index.vue    ← 页面模板（三区布局 + ResizableTable）
├── hook.ts      ← 业务逻辑（查询/新增/编辑/删除）
└── form.vue     ← 抽屉表单组件
```

生成的代码包含：

- 按标题/类型/级别筛选的搜索表单
- 基于 vxe-table 的数据表格（分页、虚拟滚动）
- 新增/编辑抽屉（表单校验、提交反馈）
- 删除确认弹窗
- 权限指令 `v-auth` 控制按钮显示
- 加载态、空状态、错误提示

## 技能覆盖的规范要点

| 类别 | 关键规则 |
| --- | --- |
| 文件结构 | 页面拆分 `index.vue`（模板）+ `hook.ts`（逻辑） |
| 表格 | 统一使用 `ResizableTable`，禁止裸写 `<el-table>` |
| 弹窗/抽屉 | 统一使用 `addDialog()` / `addDrawer()`，禁止模板内 `<el-dialog>` |
| HTTP | 统一使用 `@/utils/http`，禁止直接 axios |
| 消息提示 | 统一使用 `@/utils/message`，禁止 `ElMessage` |
| 图标 | 统一使用 `useRenderIcon()`，禁止 `<el-icon>` |
| 样式 | 优先 Tailwind 工具类 + 项目 CSS 变量，禁止行内样式 |
| 表单 | 统一 `label-position="left"` + `size="default"` |

## 注意事项

- 技能只影响 AI 生成代码的行为，不会改变项目构建或运行
- 生成后建议 `pnpm lint` 检查一遍，确认代码规范
- 技能文件可随项目演进持续更新，所有人自动获取最新规范
- 现有旧页面不受影响，新页面统一按新规范生成
