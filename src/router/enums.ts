// 完整版菜单比较多，将 rank 抽离出来，在此方便维护
// 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从 1 开始哦
export const routeRank = {
  home: 0,
  doc: 1,
  utils: 2,
  table: 3,
  components: 4,
  able: 5,
  frame: 6,
  nested: 7,
  result: 8,
  error: 9,
  list: 10,
  permission: 11,
  system: 12,
  tabs: 13,
  formdesign: 14,
  flowchart: 15,
  ppt: 16,
  editor: 17,
  guide: 18,
  menuoverflow: 19,
  about: 20,
  test: 21,
  settings: 22,
  board: 23,
  monitor: 24,
  item: 25,
  manufacture: 26,
  form: 27,
  ganttastic: 28,
  mind: 29,
  vueflow: 30
};

export const newRouteRank = {
  home: 0,
  showcase: 2,
  asyncroutes: 1
};
