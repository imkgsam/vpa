import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";

export default {
  path: "/menuoverflow",
  redirect: "/menuoverflow/index",
  meta: {
    title: $t("menus.hsMenuoverflow"),
    rank: routeRank.menuoverflow
  },
  children: [
    {
      path: "/menuoverflow/index",
      name: "MenuOverflow",
      component: () => import("@/views/menuoverflow/index.vue"),
      meta: {
        title: $t("menus.pureChildMenuOverflow"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
