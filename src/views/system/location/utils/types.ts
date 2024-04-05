import type { Entity, Location } from "@/store/modules/types";

interface FormItemProps {
  title: string;
  _id?: string;
  higherDeptOptions: Record<string, unknown>[];
  parent: string | Location;
  name: string;
  ltype: string;
  company: Entity | string;
  meta: {
    enabled: boolean;
  };
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
