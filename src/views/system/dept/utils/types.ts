interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parent: string;
  name: string;
  manager: string;
  // phone: string | number;
  // email: string;
  // sort: number;
  meta: {
    enabled: boolean;
  };
  color: string;
  // remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
