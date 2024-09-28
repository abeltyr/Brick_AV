import {
  ProductCategoryType,
  ProductPrice,
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
  initialProductPrice: ProductPrice;
  inventoryId: string;
  productId: string;
  type: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  chartOfAccountId: string;
  unit: ProductUnitType;
  unitPrice: number;
  quantity: number;
};
