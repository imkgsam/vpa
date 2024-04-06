import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/mind-map",
  redirect: "/mind-map/index",
  meta: {
    icon: "ri:mind-map",
    title: $t("menus.pureMindMap"),
    rank: routeRank.mind
  },
  children: [
    {
      path: "/mind-map/index",
      name: "FrameMindMap",
      component: IFrame,
      meta: {
        title: $t("menus.pureMindMap"),
        keepAlive: true,
        frameSrc: "https://wanglin2.github.io/mind-map/#/"
      }
    }
  ]
} satisfies RouteConfigsTable;