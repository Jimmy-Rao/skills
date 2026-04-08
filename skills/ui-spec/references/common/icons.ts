/**
 * @file icons.ts — 图标使用规范
 *
 * 规则：
 * - 必须使用 useRenderIcon()，禁止 <el-icon>、原始 HTML 实体、emoji
 * - 静态图标用具名导入（tree-shaking 友好）
 * - 动态图标用字符串 ID 写法
 */

import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// ─── 具名导入（推荐，静态场景）────────────────────────────────────────────────
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import Edit from "@iconify-icons/ep/edit";
import Plus from "@iconify-icons/ep/plus";
import Search from "@iconify-icons/ri/search-line";
import Download from "@iconify-icons/ri/download-2-line";
import Filter from "@iconify-icons/ri/filter-line";

// 模板用法：
//   <el-button :icon="useRenderIcon(Refresh)" />
//   <el-button :icon="useRenderIcon(Delete)" type="danger" />

// ─── 字符串 ID 写法（动态/简短场景）─────────────────────────────────────────
//   <el-button :icon="useRenderIcon('ep:plus')" type="primary" />
//   <el-button :icon="useRenderIcon('ri:search-line')" />

// ─── 常用图标 ID 速查 ─────────────────────────────────────────────────────────
//
//  ep:refresh          刷新
//  ep:delete           删除（红色 danger）
//  ep:edit             编辑
//  ep:plus             新增
//  ep:circle-plus      带圆圈新增
//  ep:download         下载
//  ep:search           搜索（ep 版）
//  ep:setting          设置
//  ep:view             查看详情
//  ep:video-pause      暂停
//  ep:upload           上传
//  ri:search-line      搜索（ri 版，更细）
//  ri:download-2-line  下载（ri 版）
//  ri:filter-line      筛选
//  ri:bar-chart-line   柱状图
//  ri:line-chart-line  折线图

export { useRenderIcon, Refresh, Delete, Edit, Plus, Search, Download, Filter };
