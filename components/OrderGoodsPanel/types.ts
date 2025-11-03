/**
 * OrderGoodsPanel 组件类型定义
 */

/**
 * 附加商品模型（如押筐）
 */
export interface ExtralModel {
  /** 附加商品ID */
  id: string;
  /** 附加商品名称 */
  name: string;
  /** 附加商品数量 */
  quantity: number;
  /** 附加商品单价 */
  amount?: number;
}

/**
 * 商品项数据结构
 */
export interface GoodsItem {
  /** 唯一标识 */
  key: string;
  /** 商品ID */
  id: string;
  /** 商品SKU名称 */
  skuName: string;
  /** 商品数量 */
  quantity: number;
  /** 参考单价 */
  referenceAmount: number;
  /** 总重量 */
  allweight: number;
  /** 皮重（车重） */
  carweight: number;
  /** 小计金额 */
  money2: number;
  /** 附加商品模型 */
  extralModel?: ExtralModel;
  /** 商品规格 */
  commoditySpec?: string;
  /** 库存类型 */
  stockType?: number;
  /** 商品ID */
  commodityId?: string;
  /** 销售方式 */
  saleWay?: number;
  /** 采购辅助ID */
  purchaseAssistId?: string;
  /** 原始金额 */
  money?: number;
}

/**
 * 商品点击事件参数
 */
export interface ItemClickEvent {
  /** 商品项 */
  item: GoodsItem;
  /** 索引 */
  index: number;
}

/**
 * 组件 Props
 */
export interface OrderGoodsPanelProps {
  /** 商品列表 */
  goodsList: GoodsItem[];
  /** 总计金额 */
  totalAmount: number | string;
  /** 运费 */
  shippingFee: number | string;
}

/**
 * 组件 Events
 */
export interface OrderGoodsPanelEvents {
  /** 点击表头名称 */
  'name-click': () => void;
  /** 点击商品行 */
  'item-click': (event: ItemClickEvent) => void;
  /** 删除商品 */
  'delete-item': (item: GoodsItem) => void;
  /** 点击运费 */
  'shipping-click': () => void;
  /** 挂单 */
  'hang-order': () => void;
  /** 结账 */
  'checkout': () => void;
}

/**
 * 创建空的附加商品模型
 */
export function createEmptyExtralModel(): ExtralModel {
  return {
    id: '',
    name: '',
    quantity: 0,
    amount: 0
  };
}

/**
 * 创建空的商品项
 */
export function createEmptyGoodsItem(): GoodsItem {
  return {
    key: '',
    id: '',
    skuName: '',
    quantity: 0,
    referenceAmount: 0,
    allweight: 0,
    carweight: 0,
    money2: 0,
    extralModel: createEmptyExtralModel()
  };
}

/**
 * 验证商品项数据
 */
export function validateGoodsItem(item: any): item is GoodsItem {
  return (
    item &&
    typeof item.key === 'string' &&
    typeof item.id === 'string' &&
    typeof item.skuName === 'string' &&
    typeof item.quantity === 'number' &&
    typeof item.referenceAmount === 'number' &&
    typeof item.allweight === 'number' &&
    typeof item.carweight === 'number' &&
    typeof item.money2 === 'number'
  );
}

/**
 * 计算商品列表总金额
 */
export function calculateTotalAmount(goodsList: GoodsItem[]): number {
  return goodsList.reduce((total, item) => {
    return total + (parseFloat(String(item.money2)) || 0);
  }, 0);
}

/**
 * 计算净重
 */
export function calculateNetWeight(item: GoodsItem): number {
  return item.allweight - item.carweight;
}

/**
 * 格式化金额
 */
export function formatAmount(amount: number | string, decimals: number = 2): string {
  const num = parseFloat(String(amount));
  return isNaN(num) ? '0.00' : num.toFixed(decimals);
}

/**
 * 格式化重量
 */
export function formatWeight(weight: number | string, decimals: number = 2): string {
  const num = parseFloat(String(weight));
  return isNaN(num) ? '0.00' : num.toFixed(decimals);
}

