// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface AttributeValue {
  _id?: string;
  name: string;
  code: string;
  abbr: string;
  attribute?: string;
}

interface FormItemProps {
  _id?: string;
  /** 角色名称 */
  name: string;
  code: string;
  meta: {
    enabled: boolean;
  };
  values?: Array<AttributeValue>;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
