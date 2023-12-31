import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";

export default {
  path: "/list",
  redirect: "/list/card",
  meta: {
    icon: "listCheck",
    title: $t("menus.hsList"),
    rank: routeRank.list
  },
  children: [
    {
      path: "/list/card",
      name: "ListCard",
      component: () => import("@/views/list/card/index.vue"),
      meta: {
        icon: "card",
        title: $t("menus.hsListCard"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
