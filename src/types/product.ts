import {
  BOM,
  Inventory,
  Product,
  ProductCategoryType,
  ProductPrice,
  ProductPurchaseType,
  ProductUnitType,
} from "@prisma/client";

export type ProductType = Product & {
  Inventory?: InventoryType[];
};

export type InventoryType = Inventory & {
  ProductPrice?: ProductPriceType[];
  BOM?: BOMType[];
};

export type ProductPriceType = ProductPrice & {
  inventory?: Inventory;
};

export type BOMType = BOM & {
  initialInventory?: Inventory;
};

export type ProductInputType = {
  companyId: string;
  name: string;
  description?: string;
  type?: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  active?: boolean;
  purchase?: boolean;
  unitPrice: number;
  unit: ProductUnitType;
};

export type updateProductInputType = {
  name: string;
  description?: string;
  type?: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  active?: boolean;
  purchase?: boolean;
};

export type updateProductInventoryPriceInputType = {
  purchase?: boolean;
  unitPrice: number;
  unit: ProductUnitType;
};

export type InventoryInputType = {
  productId: string;
  quantity?: number;
};

export type ProductPriceInputType = {
  inventoryId: string;
  unit: ProductUnitType;
  unitPrice: number;
};

export type BOMInputType = {
  finishedProductInventoryId: string;
  initialInventoryId: string;
  quantityRequired: number;
};
