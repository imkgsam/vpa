import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";

export default {
  path: "/flowChart",
  redirect: "/flowChart/index",
  meta: {
    icon: "setUp",
    title: $t("menus.hsflowChart"),
    rank: routeRank.flowchart
  },
  children: [
    {
      path: "/flowChart/index",
      name: "FlowChart",
      component: () => import("@/views/flow-chart/index.vue"),
      meta: {
        title: $t("menus.hsflowChart")
      }
    }
  ]
} satisfies RouteConfigsTable;
