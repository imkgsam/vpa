import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
export default {
  path: "/about",
  redirect: "/about/index",
  meta: {
    title: $t("menus.hsAbout"),
    rank: routeRank.about
  },
  children: [
    {
      path: "/about/index",
      name: "About",
      component: () => import("@/views/about/index.vue"),
      meta: {
        title: $t("menus.hsAbout")
      }
    }
  ]
} satisfies RouteConfigsTable;
