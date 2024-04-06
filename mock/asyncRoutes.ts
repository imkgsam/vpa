// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { routeRank, newRouteRank } from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.hssysManagement",
    rank: routeRank.system
  },
  children: [
    {
      path: "/system/employee/index",
      name: "SystemEmployee",
      meta: {
        icon: "ri:admin-line",
        title: "menus.hsEmployee",
        roles: ["admin"],
        auths: ["btn_add"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "menus.hsRole",
        roles: ["admin"],
        auths: ["btn_create"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        icon: "ep:menu",
        title: "menus.hsSystemMenu",
        roles: ["admin"],
        keepAlive: true
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.pureDept",
        roles: ["admin"]
      }
    },
    {
      path: "/system/routeAccessControl/index",
      name: "SystemAccessControl",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.hsAccessControl",
        roles: ["admin"]
        // hiddenTag:true,
        // showLink: false
      }
    },
    {
      path: "/system/barcode/index",
      name: "SystemBarcodeManagement",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.hsBarcodeManagement",
        roles: ["admin"]
      },
      children: [
        {
          path: "/system/barcode/barcodeType/index",
          name: "SystemBarcodeType",
          meta: {
            icon: "ri:git-branch-line",
            title: "menus.hsBarcodeType",
            roles: ["admin"]
          }
        },
        {
          path: "/system/barcode/barcodeItem/index",
          name: "SystemBarcodeItem",
          meta: {
            icon: "ri:git-branch-line",
            title: "menus.hsBarcodeItem",
            roles: ["admin"]
          }
        }
      ]
    },
    {
      path: "/system/mold/index",
      name: "SystemMoldManagement",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.hsMoldManagement",
        roles: ["admin"]
      },
      children: [
        {
          path: "/system/mold/moldItem/index",
          name: "SystemMoldItem",
          meta: {
            icon: "ri:git-branch-line",
            title: "menus.hsMoldItem",
            roles: ["admin"]
          }
        },
        {
          path: "/system/mold/moldGroup/index",
          name: "SystemMoldGroup",
          meta: {
            icon: "ri:git-branch-line",
            title: "menus.hsMoldGroup",
            roles: ["admin"]
          }
        }
      ]
    },
    {
      path: "/system/location/index",
      name: "SystemLocationManagement",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.hsLocationManagement",
        roles: ["admin"]
      }
    }
  ]
};

const itemManagementRouter = {
  path: "/item",
  name: "Item",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.hsitemManagement",
    rank: routeRank.item
  },
  children: [
    {
      path: "/item/category/index",
      name: "itemCategory",
      meta: {
        icon: "ri:admin-line",
        title: "menus.hsCategory",
        roles: ["admin"]
      }
    },
    {
      path: "/item/attribute/index",
      name: "itemAttribute",
      meta: {
        icon: "ri:admin-fill",
        title: "menus.hsAttribute",
        roles: ["admin"]
      }
    },
    {
      path: "/item/item",
      redirect: "/item/item/index",
      name: "ItemsPage",
      meta: {
        icon: "ep:menu",
        title: "menus.hsItem",
        roles: ["admin"]
      },
      children: [
        {
          path: "/item/item/index",
          name: "Items",
          meta: {
            icon: "ep:menu",
            title: "menus.hsItem",
            roles: ["admin"]
          }
        },
        {
          path: "/item/item/detail",
          name: "ItemDetail",
          meta: {
            icon: "ep:menu",
            title: "menus.hsItemCreate",
            roles: ["admin"],
            // hiddenTag: false,
            showLink: false,
            keepAlive: true,
            dynamicLevel: 5
            // showParent: true
          }
        }
      ]
    }
  ]
};

// const manufactureRouter = {
//   path: "/manufacture",
//   name: "Manufacture",
//   meta: {
//     icon: "ri:settings-3-line",
//     title: "menus.hsManufactureManagement",
//     rank: routeRank.manufacture
//   },
//   children: [
//     {
//       path: "/manufacture/moldgroup/index",
//       name: "manufactureMoldGroup",
//       meta: {
//         icon: "ri:admin-line",
//         title: "menus.hsMoldGroup",
//         roles: ["admin", "mold-bookkeeper"],
//         showParent: true
//       }
//     }
//   ]
// };

const systemMonitorRouter = {
  path: "/monitor",
  meta: {
    icon: "ep:monitor",
    title: "menus.pureSysMonitor",
    rank: routeRank.monitor
  },
  children: [
    {
      path: "/monitor/online-user",
      component: "monitor/online/index",
      name: "OnlineUser",
      meta: {
        icon: "ri:user-voice-line",
        title: "menus.pureOnlineUser",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/login-logs",
      component: "monitor/logs/login/index",
      name: "LoginLog",
      meta: {
        icon: "ri:window-line",
        title: "menus.pureLoginLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/operation-logs",
      component: "monitor/logs/operation/index",
      name: "OperationLog",
      meta: {
        icon: "ri:history-fill",
        title: "menus.pureOperationLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/system-logs",
      component: "monitor/logs/system/index",
      name: "SystemLog",
      meta: {
        icon: "ri:file-search-line",
        title: "menus.pureSystemLog",
        roles: ["admin"]
      }
    }
  ]
};

// const permissionRouter = {
//   path: "/permission",
//   meta: {
//     title: "menus.purePermission",
//     icon: "ep:lollipop",
//     rank: routeRank.permission
//   },
//   children: [
//     {
//       path: "/permission/page/index",
//       name: "PermissionPage",
//       meta: {
//         title: "menus.purePermissionPage",
//         roles: ["admin", "common"]
//       }
//     },
//     {
//       path: "/permission/button/index",
//       name: "PermissionButton",
//       meta: {
//         title: "menus.purePermissionButton",
//         roles: ["admin", "common"],
//         auths: [
//           "permission:btn:add",
//           "permission:btn:edit",
//           "permission:btn:delete"
//         ]
//       }
//     }
//   ]
// };

//已经创建至后端路由 数据库中
const frameRouter = {
  path: "/iframe",
  name: "Iframe",
  meta: {
    icon: "ri:links-fill",
    title: "menus.hsExternalPage",
    rank: routeRank.frame
  },
  children: [
    {
      path: "/iframe/external",
      name: "IframeExternal",
      meta: {
        title: "menus.pureExternalDoc"
      },
      children: [
        {
          path: "/external",
          name: "https://yiming_chang.gitee.io/pure-admin-doc",
          meta: {
            title: "menus.pureExternalLink",
            roles: ["admin", "common"]
          }
        },
        {
          path: "/pureUtilsLink",
          name: "https://pure-admin-utils.netlify.app/",
          meta: {
            title: "menus.pureUtilsLink",
            roles: ["admin", "common"]
          }
        }
      ]
    },
    {
      path: "/iframe/embedded",
      name: "IframeEmbedded",
      meta: {
        title: "menus.pureEmbeddedDoc"
      },
      children: [
        {
          path: "/iframe/colorhunt",
          name: "FrameColorHunt",
          meta: {
            title: "menus.pureColorHuntDoc",
            frameSrc: "https://colorhunt.co/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/uigradients",
          name: "FrameUiGradients",
          meta: {
            title: "menus.pureUiGradients",
            frameSrc: "https://uigradients.com/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/ep",
          name: "FrameEp",
          meta: {
            title: "menus.pureEpDoc",
            frameSrc: "https://element-plus.org/zh-CN/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/tailwindcss",
          name: "FrameTailwindcss",
          meta: {
            title: "menus.pureTailwindcssDoc",
            frameSrc: "https://tailwindcss.com/docs/installation",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue3",
          name: "FrameVue",
          meta: {
            title: "menus.pureVueDoc",
            frameSrc: "https://cn.vuejs.org/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vite",
          name: "FrameVite",
          meta: {
            title: "menus.pureViteDoc",
            frameSrc: "https://cn.vitejs.dev/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/pinia",
          name: "FramePinia",
          meta: {
            title: "menus.purePiniaDoc",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue-router",
          name: "FrameRouter",
          meta: {
            title: "menus.pureRouterDoc",
            frameSrc: "https://router.vuejs.org/zh/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        }
      ]
    }
  ]
};

//已经创建至后端路由 数据库中
// const tabsRouter = {
//   path: "/tabs",
//   meta: {
//     icon: "ri:bookmark-2-line",
//     title: "menus.hstabs",
//     rank: routeRank.tabs
//   },
//   children: [
//     {
//       path: "/tabs/index",
//       name: "Tabs",
//       meta: {
//         title: "menus.hstabs",
//         roles: ["admin", "common"]
//       }
//     },
//     // query 传参模式
//     {
//       path: "/tabs/query-detail",
//       name: "TabQueryDetail",
//       meta: {
//         // 不在menu菜单中显示
//         showLink: false,
//         activePath: "/tabs/index",
//         roles: ["admin", "common"]
//       }
//     },
//     // params 传参模式
//     {
//       path: "/tabs/params-detail/:id",
//       component: "params-detail",
//       name: "TabParamsDetail",
//       meta: {
//         // 不在menu菜单中显示
//         showLink: false,
//         activePath: "/tabs/index",
//         roles: ["admin", "common"]
//       }
//     }
//   ]
// };

const asyncRouter = {
  path: "/asyncroutes",
  meta: {
    icon: "IF-pure-iconfont-tabs",
    title: "menus.asyncRoutes",
    rank: newRouteRank.asyncroutes
  },
  children: [
    itemManagementRouter,
    systemManagementRouter,
    systemMonitorRouter,
    // permissionRouter,
    frameRouter
    // tabsRouter
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [asyncRouter]
      };
    }
  }
]);
