import type {
  UserAccount,
  Route,
  Role,
  RouteAuth
} from "@/store/modules/types";

interface FormItemProps {
  userList: UserAccount[];
  roleList: Role[];
  routeTree: Route[];

  auths_options: RouteAuth[];

  _id?: string;
  /** 角色名称 */
  user?: string;
  /** 角色编号 */
  role?: string;
  /** 备注 */
  route: string;
  // 按钮权限选择
  auths: string[];
  meta?: {
    enabled: boolean;
  };
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
