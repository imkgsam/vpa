// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

// import { Department, Entity } from "@/store/modules/types";

interface FormItemProps {
  _id?: string;
  name: string;
  workers: [];
  department: string;
  manager: string;
  location: string;
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
