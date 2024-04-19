// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

import type { Department, Entity, Location } from "@/store/modules/types";

interface FormItemProps {
  _id?: string;
  name: string;
  workers: string[] | Entity[];
  mtype: string;
  department: string | Department;
  manager: string | Entity;
  location: string | Location;
  meta?: {
    enabled?: boolean;
    status?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
