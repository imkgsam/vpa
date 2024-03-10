import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";

export default {
  path: "/guide",
  redirect: "/guide/index",
  meta: {
    icon: "ep:guide",
    title: $t("menus.hsguide"),
    rank: routeRank.guide
  },
  children: [
    {
      path: "/guide/index",
      name: "Guide",
      component: () => import("@/views/guide/index.vue"),
      meta: {
        title: $t("menus.hsguide")
      }
    }
  ]
} satisfies RouteConfigsTable;
