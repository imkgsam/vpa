// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

import type {
  AttributeOptions,
  BarcodeItem,
  Entity,
  Item,
  MoldGroup
} from "@/store/modules/types";

interface FormItemProps {
  _id?: string;
  //模具厂家, Entity
  supplier?: Entity | string;
  // 对应的产品模具 sku，
  mold?: Item | string;
  // 对应的产品spu 涉及属性
  product?: Item | string;
  //模具所能添加的属性以及可选值， 创建模具的时候，可以从对应的mold上选取attribute和attribute option，并附加到模具上。
  attributes: Array<AttributeOptions>;
  // 模具类型， 地摊 高压 上线
  mtype?: string;
  group?: {
    // 所属模组(线), 1.安装上了，2.还没安装
    moldGroup?: MoldGroup | string;
    // 模组的哪个位置
    index?: number;
  };
  //条码
  barcode?: BarcodeItem;
  //理论最大注浆次数
  maxGroutingTimes?: number;
  //初始注浆次数
  initialGroutingTimes?: number;
  // 预警 阈值
  warningThreadhold?: number;
  // 累计注浆次数，不含初始次数
  cumulativeGroutingTimes?: number;
  // location: Types.ObjectId,
  meta?: {
    //是否启用
    enabled?: boolean;
    //是否在使用中, 当使用中，则查看所在模组，当没在使用中，则查看所在地点
    inUse?: boolean;
    // 是否已报废
    isScraped?: boolean;
    //报废日期
    scrapDate?: Date;
    //批次
    batch?: string;
  };
  // 内部备注，
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BatchInfoProps {
  inBatch: boolean;
  count: number;
}
interface FormProps {
  formInline: FormItemProps;
  batchInfo?: BatchInfoProps;
}

export type { FormItemProps, FormProps };
