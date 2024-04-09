import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";

// update

export function useDetail() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;

  console.log("route", route);
  function toDetail(
    parameter: LocationQueryRaw | RouteParamsRaw,
    model: "query" | "params",
    toPath: string,
    toName: string,
    type: string = "Product"
  ) {
    console.log("in toDetail", parameter, model, toPath, toName);

    let meta = {};
    switch (type) {
      case "Product":
        meta = {
          dynamicLevel: 3,
          title: parameter?.id
            ? parameter?.code
              ? {
                  zh: `修改成品: ${parameter?.code}`,
                  en: `Edit Item: ${parameter?.code}`
                }
              : { zh: `修改产品`, en: `Edit Item` }
            : { zh: "新增成品", en: "Create Item" }
        };
        break;
      default:
        meta = { dynamicLevel: 1, title: { zh: "标题", en: "Title" } };
    }

    // ⚠️ 这里要特别注意下，因为vue-router在解析路由参数的时候会自动转化成字符串类型，比如在使用useRoute().route.query或useRoute().route.params时，得到的参数都是字符串类型
    // 所以在传参的时候，如果参数是数字类型，就需要在此处 toString() 一下，保证传参跟路由参数类型一致都是字符串，这是必不可少的环节！！！
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    if (model === "query") {
      // 保存信息到标签页
      useMultiTagsStoreHook().handleTags("push", {
        path: toPath,
        name: toName,
        query: parameter,
        meta
      });
      // 路由跳转
      router.push({ name: toName, query: parameter });
    } else if (model === "params") {
      useMultiTagsStoreHook().handleTags("push", {
        path: toPath,
        name: toName,
        params: parameter,
        meta
      });
      router.push({ name: toName, params: parameter });
    }
  }

  // 用于页面刷新，重新获取浏览器地址栏参数并保存到标签页
  const initToDetail = (model: "query" | "params") => {
    console.log("in initToDetail");
    if (getParameter)
      toDetail(getParameter, model, route.path, route.name as string);
  };

  return { toDetail, initToDetail, getParameter, router };
}
