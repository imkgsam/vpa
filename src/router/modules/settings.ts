import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
// const { VITE_HIDE_HOME } = import.meta.env;
// const Layout = () => import("@/layout/index.vue");
const MyLayout = () => import("@/layout/mylayout.vue");

export default {
  path: "/settings",
  name: "Settings",
  component: MyLayout,
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
    },
    {
      path: "/settings/account-setting",
      name: "AccountSetting",
      component: () => import("@/views/settings/index.vue"),
      meta: {
        title: $t("menus.accountSetting"),
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
