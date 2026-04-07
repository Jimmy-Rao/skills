---
name: remotion-react-sslb-workflow
description: '面向本项目的需求实现工作流 Skill。用于新功能、缺陷修复、重构、代码生成、代码修改和 Remotion/React/Node 相关开发。开始实现前必须先加载 vercel-react-best-practices 与 remotion-best-practices 与 nodejs-backend-patterns；完成改动后必须主动执行 sslb 审查，并根据审查结论继续修改，直到门下省给出“准予合并”为止。适用于 React、Remotion、视频模板、字幕、动画、组合、渲染链路、nodejs相关任务。'
argument-hint: '输入需求目标，Skill 将按“先最佳实践、后实现、再 sslb 审查闭环”的流程执行'
user-invocable: true
---

# Remotion React SSLB Workflow

这是一个流程编排型 Skill，用来约束本项目中的实现节奏，而不是替代具体领域规则。

## When to Use

在以下场景优先使用本 Skill：

- 新增或修改 Remotion 组件、组合、模板、字幕、动画、音视频处理逻辑
- 新增或修改 React 组件、渲染逻辑、状态逻辑、交互逻辑
- 新增或修改 Node.js 后端逻辑、API 接口、数据处理流程

- 修复渲染链路、模板输出、时序、字幕、素材、样式相关问题
- 对现有实现进行性能优化、可维护性重构、代码审查后修复
- 修复或优化 Node.js 后端逻辑、API 接口、数据处理流程

如果需求和本项目代码实现无关，则不要强行套用。

## Non-Negotiable Rules

1. 在开始分析、设计、编码、重构之前，必须先加载并遵循以下三个 Skill：
   - `vercel-react-best-practices`
   - `remotion-best-practices`
   - `nodejs-backend-patterns`
2. 加载这三个 Skill 后，具体实现规范以它们各自原始内容为准；本 Skill 只负责定义执行顺序和审查闭环，不重写它们的细则。
3. 如果任务明显属于 Remotion 的细分主题，必须继续按需加载 `remotion-best-practices` 所指向的对应规则文件，而不是只停留在顶层 Skill。
4. 完成代码改动后，必须主动调用 `sslb` 进行三省六部审查。
5. 只要 `sslb` 的门下省裁决不是“准予合并”，就必须继续修改并重新审查，直到得到“准予合并”。
6. 不允许跳过审查闭环，也不允许只口头总结“理论上已通过”而不实际执行审查。

## Required Loading Order

每次处理需求时，按下面顺序执行：

1. 先读取 `vercel-react-best-practices`。
2. 再读取 `remotion-best-practices`。
3. 根据 `remotion-best-practices` 的指引，继续加载必要的 Remotion 细分规则。
4. 再读取 `nodejs-backend-patterns`。
5. 再开始代码分析、实现、测试与验证。
6. 完成后调用 `sslb` 做正式审查。
7. 按审查意见修正并重复审查，直到“准予合并”。

## Topic-Specific Expansion

本模块不再单独定义一套 Remotion 主题规则。

遇到字幕、动画、音频、视频、字体、测量等细分主题时，应以 `remotion-best-practices` 的原始说明为入口，按其中已经定义的方式继续加载对应规则文件。本 Skill 只要求“继续下钻”，不额外维护一份并行映射，避免和上游 Skill 的目录或命名演进发生偏差。

## Execution Procedure

### Step 1: Build Constraints First

开始工作前，先把约束讲清楚并落实到实现计划里：

- React 部分以 `vercel-react-best-practices` 为性能和结构基线
- Remotion 部分以 `remotion-best-practices` 为领域规则基线
- 若两者出现张力，优先保证 Remotion 渲染正确性，再在该前提下满足 React 最佳实践
- Node.js 后端逻辑应遵循 `nodejs-backend-patterns`，确保 API 接口、数据处理流程的健壮性和可维护性
尤其要注意：

- Remotion 动画必须由时间轴和帧驱动，不能偷用 CSS animation 或 transition
- React 代码应优先避免无意义重渲染、串行等待和不必要的包体积开销
- 不要为了套用通用 React 模式而破坏 Remotion 的可预测渲染
- Node.js 后端逻辑应避免阻塞操作，确保异步处理的正确性和性能

### Step 2: Implement Against the Constraints

实现时至少检查下面这些点：

- 是否引入了不必要的串行异步
- 是否有可提前剪枝的条件判断
- 是否把昂贵计算、依赖关系和组件边界放在了更合理的位置
- 是否使用了符合 Remotion 约束的动画、时序、媒体处理方式
- 是否维持了现有项目的 schema、composition、timeline、server 调用风格
- Node.js 后端逻辑是否遵循 `nodejs-backend-patterns`，避免阻塞操作，确保异步处理的正确性和性能

### Step 3: Validate Before Review

在调用 `sslb` 之前，先完成最基本的自检：

- 运行与本次改动直接相关的校验、测试、构建或类型检查
- 明确哪些验证已执行，哪些因为环境限制未执行
- 若发现显而易见的问题，先修掉，再进入正式审查

### Step 4: Run SSLB Review

完成改动后，必须主动发起 `sslb` 审查，审查范围默认覆盖本次变更。

审查时必须重点关注：

- React 性能与渲染边界是否符合 `vercel-react-best-practices`
- Remotion 时间轴、动画、媒体处理是否符合 `remotion-best-practices`
- 本次变更是否引入了健壮性、安全性、可维护性退化，特别是 Node.js 后端逻辑是否遵循 `nodejs-backend-patterns`，避免阻塞操作，确保异步处理的正确性和性能
- 审查意见是否给出了明确文件位置、问题原因、影响和可执行修正建议

### Step 5: Review-Fix Loop

拿到 `sslb` 结论后，按下面规则处理：

- 若裁决为“准予合并”：流程结束
- 若裁决为“修改后合并”或“驳回重写”：逐项修复后重新发起 `sslb`
- 若锦衣卫指出遗漏、越权或误判，需要把这些意见纳入下一轮修正和复核

只有在门下省明确给出“准予合并”时，才能把任务视为完成。

## Output Expectations

使用本 Skill 处理需求时，最终交付必须同时满足：

- 代码实现已落地，不停留在方案层
- 已说明本次实际参考了哪些 React/Remotion/Node.js 规则
- 已执行 `sslb`，且最终裁决为“准予合并”
- 若有未完成验证项，已明确说明风险边界
- Node.js 后端逻辑已遵循 `nodejs-backend-patterns`，避免阻塞操作，确保异步处理的正确性和性能
