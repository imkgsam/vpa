import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/form-design",
  redirect: "/form-design/index",
  meta: {
    icon: "terminalWindowLine",
    title: $t("menus.hsFormDesign"),
    rank: routeRank.formdesign
  },
  children: [
    {
      path: "/form-design/index",
      name: "FormDesign",
      component: IFrame,
      meta: {
        title: $t("menus.hsFormDesign"),
        frameSrc:
          "https://haixin-fang.github.io/vue-form-design/playground/index.html",
        frameLoading: false
      }
    }
  ]
} satisfies RouteConfigsTable;
