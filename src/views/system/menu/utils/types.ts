interface FormItemProps {
  /** 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）*/
  menuType: number;
  higherOptions: Record<string, unknown>[];

  _id?: string;
  path: string;
  name?: string;
  component?: string;
  redirect?: string;
  meta: {
    title: string;
    icon?: string;
    extraIcon?: string;
    showLink?: boolean;
    showParent?: boolean;
    roles?: Array<string>;
    auths?: Array<string>;
    keepAlive?: boolean;
    frameSrc?: string;
    frameLoading?: boolean;
    transition?: {
      name?: string;
      enterTransition?: string;
      leaveTransition?: string;
    };
    hiddenTag?: boolean;
    dynamicLevel?: number;
    activePath?: string;
    rank?: number;
  };
  parent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
