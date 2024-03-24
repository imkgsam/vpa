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
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "menus.hsUser",
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
        title: "menus.hsDept",
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
      path: "/item/item/index",
      name: "Items",
      meta: {
        icon: "ep:menu",
        title: "menus.hsItem",
        roles: ["admin"]
      }
    }
  ]
};

const systemMonitorRouter = {
  path: "/monitor",
  meta: {
    icon: "ep:monitor",
    title: "menus.hssysMonitor",
    rank: routeRank.monitor
  },
  children: [
    {
      path: "/monitor/online-user",
      component: "monitor/online/index",
      name: "OnlineUser",
      meta: {
        icon: "ri:user-voice-line",
        title: "menus.hsOnlineUser",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/login-logs",
      component: "monitor/logs/login/index",
      name: "LoginLog",
      meta: {
        icon: "ri:window-line",
        title: "menus.hsLoginLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/operation-logs",
      component: "monitor/logs/operation/index",
      name: "OperationLog",
      meta: {
        icon: "ri:history-fill",
        title: "menus.hsOperationLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/system-logs",
      component: "monitor/logs/system/index",
      name: "SystemLog",
      meta: {
        icon: "ri:file-search-line",
        title: "menus.hsSystemLog",
        roles: ["admin"]
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.permission",
    rank: routeRank.permission,
    icon: "ep:lollipop"
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.permissionPage",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button/index",
      name: "PermissionButton",
      meta: {
        title: "menus.permissionButton",
        roles: ["admin", "common"],
        auths: [
          "permission:btn:add",
          "permission:btn:edit",
          "permission:btn:delete"
        ]
      }
    }
  ]
};

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
        title: "menus.hsExternalDoc"
      },
      children: [
        {
          path: "/external",
          name: "https://yiming_chang.gitee.io/pure-admin-doc",
          meta: {
            title: "menus.externalLink",
            roles: ["admin", "common"]
          }
        },
        {
          path: "/pureutilsLink",
          name: "https://pure-admin-utils.netlify.app/",
          meta: {
            title: "menus.pureutilsLink",
            roles: ["admin", "common"]
          }
        }
      ]
    },
    {
      path: "/iframe/embedded",
      name: "IframeEmbedded",
      meta: {
        title: "menus.hsEmbeddedDoc"
      },
      children: [
        {
          path: "/iframe/ep",
          name: "FrameEp",
          meta: {
            title: "menus.hsEpDocument",
            frameSrc: "https://element-plus.org/zh-CN/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/tailwindcss",
          name: "FrameTailwindcss",
          meta: {
            title: "menus.hsTailwindcssDocument",
            frameSrc: "https://tailwindcss.com/docs/installation",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue3",
          name: "FrameVue",
          meta: {
            title: "menus.hsVueDocument",
            frameSrc: "https://cn.vuejs.org/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vite",
          name: "FrameVite",
          meta: {
            title: "menus.hsViteDocument",
            frameSrc: "https://cn.vitejs.dev/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/pinia",
          name: "FramePinia",
          meta: {
            title: "menus.hsPiniaDocument",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue-router",
          name: "FrameRouter",
          meta: {
            title: "menus.hsRouterDocument",
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
const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "menus.hstabs",
    rank: routeRank.tabs
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "menus.hstabs",
        roles: ["admin", "common"]
      }
    },
    // query 传参模式
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    },
    // params 传参模式
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    }
  ]
};

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
    permissionRouter,
    frameRouter,
    tabsRouter
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
