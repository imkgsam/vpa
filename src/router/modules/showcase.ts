import { $t } from "@/plugins/i18n";
import { newRouteRank } from "@/router/enums";

export default {
  path: "/showcase",
  meta: {
    title: $t("menus.showcase"),
    rank: newRouteRank.showcase,
    icon: "homeFilled"
  },
  children: []
} satisfies RouteConfigsTable;

export function prependStringToFields(
  str: string,
  fields: string[],
  children: any[]
) {
  if (!Array.isArray(children)) {
    console.warn("children must be an array");
    return [];
  }
  if (!children || children.length === 0) return [];
  for (const [_, node] of children.entries()) {
    for (const field of fields) {
      if (Object.keys(node).indexOf(field) > -1) {
        node[field] = str + node[field];
      }
    }
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      prependStringToFields(str, fields, node.children);
    }
  }
  return children;
}
