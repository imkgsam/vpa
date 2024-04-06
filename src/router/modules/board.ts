import { $t } from "@/plugins/i18n";
import { routeRank } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/board",
  redirect: "/board/index",
  meta: {
    icon: "ri:artboard-line",
    title: $t("menus.hsboard"),
    rank: routeRank.board
  },
  children: [
    {
      path: "/board/index",
      name: "FrameBoard",
      component: IFrame,
      meta: {
        title: $t("menus.pureBoard"),
        keepAlive: true,
        frameSrc: "https://songlh.top/paint-board/"
      }
    }
  ]
} satisfies RouteConfigsTable;
