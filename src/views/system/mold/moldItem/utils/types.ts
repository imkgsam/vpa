// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  /** 角色code */
  _id?: string;
  code: string;
  meta: {
    enabled: boolean;
  };
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
