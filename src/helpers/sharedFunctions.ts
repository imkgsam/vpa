// import { transformI18n } from "@/plugins/i18n";

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

  return {
    formatHigherDeptOptions,
    formatHigherMenuOptions
  };
}
