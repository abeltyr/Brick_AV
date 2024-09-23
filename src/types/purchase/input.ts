import {
  ProductCategoryType,
  ProductPurchaseType,
  ProductUnitType,
} from "@prisma/client";

export type PurchaseInputType = {
  companyId: string;
  vendorId: string;
  vendorBusiness: boolean;
  hasVat: boolean;
  hasWithholding: boolean;
  date: Date;
  VatReceiptNumber: string;
  MRCNumber?: string;
  withholdingNumber?: string;
  purchaseType: ProductPurchaseType;
  productType: ProductCategoryType;
  unit: ProductUnitType;
  description: string;
  purchaseProducts: PurchaseProductInput[];
};

export type PurchaseProductInput = {
  inventoryId: string;
  productId: string;
  type: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  unit: ProductUnitType;
  unitPrice: number;
  quantity: number;
};
