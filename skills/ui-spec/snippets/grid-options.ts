/**
 * @file grid-options.ts — vxe-table gridOptions 配置参考
 *
 * 在 hook.ts 中使用 computed<VxeGridProps>() 定义，不要写成 reactive。
 * 所有分析/列表页表格必须使用 ResizableTable + 下方配置模式。
 */

import { computed } from "vue";
import type { VxeGridProps, VxeGridListeners } from "vxe-table";

// ─── 标准列表表格 gridOptions ──────────────────────────────────────────────────

// const gridOptions = computed<VxeGridProps>(() => ({
//   data: dataList.value,
//   loading: loading.value,
//   columns: [
//     // 序号列
//     { type: "seq", width: 60, title: "#" },
//
//     // 普通文本列
//     { field: "name", title: "名称", minWidth: 140, showOverflow: true },
//
//     // 固定宽度列（数字/状态等）
//     { field: "status", title: "状态", width: 100 },
//
//     // 带 tooltip 的长文本列
//     { field: "remark", title: "备注", minWidth: 180, showOverflow: "tooltip" },
//
//     // 操作列（固定右侧）
//     {
//       title: "操作",
//       width: 140,
//       fixed: "right",
//       slots: { default: "actions" }   // 对应模板中 <template #actions="{ row }">
//     }
//   ],
//   pagerConfig: {
//     currentPage: form.pageIndex,
//     pageSize: form.pageSize,
//     total: total.value,
//     layouts: ["PrevPage", "Number", "NextPage", "Sizes", "Total"],
//     pageSizes: [30, 50, 100]
//   },
//   // 大数据量启用虚拟滚动（超过 50 行自动开启）
//   virtualYConfig: { enabled: true, gt: 50 },
//   rowConfig: { isHover: true },
//   // 工具栏（如需导出/列选择，在此开启）
//   toolbarConfig: {
//     slots: { buttons: "toolbarButtons", tools: "tools" }
//   }
// }));

// ─── gridEvents（分页、排序）─────────────────────────────────────────────────

// const gridEvents: VxeGridListeners = {
//   pageChange({ currentPage, pageSize }) {
//     form.pageIndex = currentPage;
//     form.pageSize = pageSize;
//     onSearch();
//   },
//   sortChange({ field, order }) {
//     form.sortField = field;
//     form.sortOrder = order;
//     form.pageIndex = 1;
//     onSearch();
//   }
// };

// ─── 列类型速查 ────────────────────────────────────────────────────────────────
//
// 文本截断+tooltip  → showOverflow: true | "tooltip"
// 固定列           → fixed: "left" | "right"
// 自定义渲染       → slots: { default: "slotName" }
// 排序             → sortable: true
// 最小宽（自适应）  → minWidth: 120  (不要全用 width，避免挤压)

export {};
