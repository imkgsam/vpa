interface FormItemProps {
  _id?: string;
  higherDeptOptions: Record<string, unknown>[];
  parent: string;
  name: string;
  manager: {
    _id: string;
    name: string;
  };
  meta: {
    enabled: boolean;
  };
  color: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };