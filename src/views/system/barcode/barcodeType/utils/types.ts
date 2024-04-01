// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  _id?: string;
  code: string;
  startsWith?: string;
  remark?: string;
  length?: number;
  meta?: {
    enabled?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
