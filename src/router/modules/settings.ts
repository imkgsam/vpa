import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
// const { VITE_HIDE_HOME } = import.meta.env;

export default {
  path: "/settings",
  name: "Settings",
  redirect: "/settings/profile",
  meta: {
    icon: "homeFilled",
    title: $t("menus.settings"),
    rank: routeRank.settings
  },
  children: [
    {
      path: "/settings/profile",
      name: "Profile",
      component: () => import("@/views/profile/index.vue"),
      meta: {
        title: $t("menus.profile"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
