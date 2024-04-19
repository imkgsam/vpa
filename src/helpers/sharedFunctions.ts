import { transformI18n } from "@/plugins/i18n";
import type { BarcodeItem } from "@/store/modules/types";

export function usePublicSharedFunctionsHooks() {
  /**
   * 生成树状部门列表
   * @param treeList
   * @returns
   */
  function formatHigherGeneralOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = !treeList[i].meta.enabled;
      formatHigherGeneralOptions(treeList[i].children);
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

  /**
   * 生成树状地点列表
   * @param treeList
   * @returns
   */
  function formatHigherLocationOptions(
    treeList,
    disabledTypeList?: string[],
    enabledTypeList?: string[]
  ) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      //判断是否启用
      treeList[i].disabled = !treeList[i].meta.enabled;
      if (disabledTypeList && disabledTypeList.length) {
        treeList[i].disabled =
          disabledTypeList.includes(treeList[i].ltype) || treeList[i].disabled;
      }
      if (enabledTypeList && enabledTypeList.length) {
        treeList[i].disabled =
          !enabledTypeList.includes(treeList[i].ltype) || treeList[i].disabled;
      }
      formatHigherLocationOptions(
        treeList[i].children,
        disabledTypeList,
        enabledTypeList
      );
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function computeAndFormatPercentage(input1, input2, n) {
    if (!n || n < 0 || n >= 10) n = 2;
    if (input1 & input2) {
      return (Math.round((input1 / input2) * 100) / 100).toFixed(n);
    }
    return null;
  }

  return {
    formatHigherGeneralOptions,
    formatHigherMenuOptions,
    formatBarcodeString,
    formatHigherLocationOptions,
    computeAndFormatPercentage
  };
}
