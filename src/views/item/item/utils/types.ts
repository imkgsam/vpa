// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

import type {
  AttributeOptions,
  AttributeValue,
  Category,
  Item
} from "@/store/modules/types";

interface FormItemProps {
  _id: string;
  code: string;
  category: Category | string;
  etype: string;
  meta: {
    enabled: boolean;
    canBeStocked: boolean;
    canBeSold: boolean;
    canBePurchased: boolean;
    canBenProduced: boolean;
    canBenRented: boolean;
    hasVariants: boolean;
    isVariantOf?: Item | string;
    attributeTags?: Array<AttributeValue>;
  };
  attributes?: Array<AttributeOptions>;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
