import {
  Purchase,
  PurchaseProduct,
  ProductPurchaseType,
  ProductCategoryType,
  ProductUnitType,
  PurchaseReport,
} from "@prisma/client";
import { ProductType } from "./product";
import { VendorType } from "./vendor";

export type PurchaseType = Purchase & {
  PurchaseProduct?: PurchaseProductType[];
  vendor?: VendorType;
  purchaseReport?: PurchaseReportType;
};

export type PurchaseProductType = PurchaseProduct & {
  product?: ProductType;
};

export type PurchaseReportType = PurchaseReport & {
  Purchase?: PurchaseType;
};

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
