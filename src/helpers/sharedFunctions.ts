import { transformI18n } from "@/plugins/i18n";
import type { BarcodeItem } from "@/store/modules/types";

export function usePublicSharedFunctionsHooks() {
  /**
   * 生成树状部门列表
   * @param treeList
   * @returns
   */
  function formatHigherDeptOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = !treeList[i].meta.enabled;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  /**
   * 生成树状Menu列表
   * @param treeList
   * @returns
   */
  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].title = transformI18n(treeList[i].meta.title);
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function formatBarcodeString(barcode: BarcodeItem) {
    if (!barcode || !barcode.btype) return null;
    const { startsWith, length } = barcode.btype;
    const { num } = barcode;
    if (!startsWith || !length || !num) return null;
    let rt = startsWith + "-";
    if (num.toString().length > length)
      rt = rt + "*".repeat(num.toString().length - length) + num;
    else rt = rt + ("0".repeat(20) + "" + num).slice(length * -1);
    return rt;
  }

  return {
    formatHigherDeptOptions,
    formatHigherMenuOptions,
    formatBarcodeString
  };
}
