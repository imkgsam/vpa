interface FormItemProps {
  _id?: string;
  higherDeptOptions: Record<string, unknown>[];
  parent: string;
  name: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
