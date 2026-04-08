/**
 * @file add-dialog.ts — addDialog / addDrawer 使用模板
 *
 * 规则：禁止在模板中使用 <el-dialog> / <el-drawer>，
 * 一律使用此处的程序化 API。
 */

import { h, ref } from "vue";
import type { FormInstance } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { addDrawer } from "@/components/ReDrawer";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

// ─── 打开 Dialog（表单弹窗）────────────────────────────────────────────────────
//
// import MyForm from "./form.vue";
//
// function openCreateDialog() {
//   const formRef = ref();
//   addDialog({
//     title: "新增数据",
//     width: "580px",
//     draggable: true,
//     fullscreenIcon: true,
//     closeOnClickModal: false,
//     contentRenderer: () => h(MyForm, { ref: formRef }),
//     beforeSure(done) {
//       const formEl = formRef.value?.formRef as FormInstance;
//       formEl?.validate(valid => {
//         if (valid) submitCreate().then(() => done());
//       });
//     }
//   });
// }
//
// function openEditDialog(row: MyItem) {
//   const formRef = ref();
//   addDialog({
//     title: "编辑数据",
//     width: "580px",
//     draggable: true,
//     fullscreenIcon: true,
//     closeOnClickModal: false,
//     contentRenderer: () => h(MyForm, { ref: formRef, row }),
//     beforeSure(done) {
//       const formEl = formRef.value?.formRef as FormInstance;
//       formEl?.validate(valid => {
//         if (valid) submitEdit(row.id).then(() => done());
//       });
//     }
//   });
// }

// ─── 打开 Drawer（侧边抽屉）────────────────────────────────────────────────────
//
// function openDetailDrawer(row: MyItem) {
//   addDrawer({
//     title: "详情",
//     size: "600px",          // 宽度
//     direction: "rtl",      // 默认从右滑入
//     contentRenderer: () => h(MyDetailPanel, { row })
//   });
// }

// ─── 删除确认 ──────────────────────────────────────────────────────────────────
//
// async function handleDelete(row: MyItem) {
//   await ElMessageBox.confirm(`确认删除「${row.name}」？`, "提示", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning"
//   });
//   await deleteMyItem(row.id);
//   message("删除成功", { type: "success" });
//   onSearch();
// }

export {};
