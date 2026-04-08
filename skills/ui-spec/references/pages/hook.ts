/**
 * @file hook.ts — 标准页面 Hook 模板
 * 复制此文件到 src/views/<module>/<pageName>/hook.ts 后按需修改。
 * 替换所有 `MyPage` / `MyItem` / `/api/my-resource` 占位符。
 */

import { ref, reactive, computed, onMounted } from "vue";
import { debounce } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { http } from "@/utils/http";
import type { VxeGridProps, VxeGridListeners } from "vxe-table";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MyItem {
  id: number;
  name: string;
  // ...domain fields
}

interface MyPageForm {
  pageIndex: number;
  pageSize: number;
  // ...search fields
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useMyPageHook(props?: unknown) {
  // ── State ──────────────────────────────────────────────────────────────────
  const loading = ref(false);
  const dataList = ref<MyItem[]>([]);
  const total = ref(0);

  const form = reactive<MyPageForm>({
    pageIndex: 1,
    pageSize: 50
    // ...search fields
  });

  // ── Computed ───────────────────────────────────────────────────────────────

  /** vxe-table 配置 — 所有列定义放这里 */
  const gridOptions = computed<VxeGridProps<MyItem>>(() => ({
    data: dataList.value,
    loading: loading.value,
    columns: [
      { type: "seq", width: 60, title: "#" },
      { field: "id", title: "ID", width: 80 },
      { field: "name", title: "名称", minWidth: 140, showOverflow: true }
      // ...domain columns
    ],
    pagerConfig: {
      currentPage: form.pageIndex,
      pageSize: form.pageSize,
      total: total.value,
      layouts: ["PrevPage", "Number", "NextPage", "Sizes", "Total"],
      pageSizes: [30, 50, 100]
    },
    virtualYConfig: { enabled: true, gt: 50 },
    rowConfig: { isHover: true }
  }));

  /** vxe-table 事件 — 分页、排序等放这里 */
  const gridEvents: VxeGridListeners<MyItem> = {
    pageChange({ currentPage, pageSize }) {
      form.pageIndex = currentPage;
      form.pageSize = pageSize;
      onSearch();
    }
  };

  // ── Methods ────────────────────────────────────────────────────────────────

  async function onSearch() {
    loading.value = true;
    try {
      const res = await http.request<{ list: MyItem[]; total: number }>("get", "/api/my-resource", {
        params: { ...form }
      });
      dataList.value = res.data?.list ?? [];
      total.value = res.data?.total ?? 0;
    } catch {
      message("查询失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  const handleSearch = debounce(onSearch, 300);

  function resetForm() {
    Object.assign(form, { pageIndex: 1, pageSize: 50 /* reset domain fields */ });
    onSearch();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onMounted(onSearch);

  return {
    form,
    loading,
    total,
    dataList,
    gridOptions,
    gridEvents,
    handleSearch,
    resetForm
  };
}
