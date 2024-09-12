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
  hasVat: boolean;
  hasWithholding: boolean;
  date: Date;
  VatReceiptNumber: string;
  MRCNumber?: string;
  withholdingNumber?: string;
  vendorTin?: string;
  vendorVat?: string;
  vendorName?: string;
  purchaseType: ProductPurchaseType;
  productType: ProductCategoryType;
  unit: ProductUnitType;
  description: string;
  localPurchaseCapitalAssets: number;
  vatOnLocalPurchaseCapitalAssets: number;
  importedCapitalAssets: number;
  vatOnImportedCapitalAssets: number;
  totalCapitalAssets: number;
  vatOnTotalAssets: number;
  localPurchaseInputs: number;
  vatOnLocalPurchaseInputs: number;
  importedInputs: number;
  vatOnImportedInputs: number;
  generalExpenseInputs: number;
  vatOnGeneralExpenseInputs: number;
  purchaseWithNoVat: number;
  totalNonCapitalInputs: number;
  vatOnTotalInputs: number;
  importedGoodSummaryAmount: number;
  importedGoodWithholding: number;
  localGoodSummaryAmount: number;
  localGoodWithholding: number;
  serviceSummaryAmount: number;
  serviceWithholdingRate: number;
  serviceWithholding: number;
  taxableAmount: number;
  nonTaxableAmount: number;
  totalVat: number;
  withholding: number;
  grossAmount: number;
  totalQuantity: number;
  averagePrice: number;
  purchaseReportId?: string;
};

export type PurchaseProductInput = {
  purchaseId: string;
  productId: string;
  type: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  unit: ProductUnitType;
  unitPrice: number;
  quantity: number;
  totalValue: number;
  vat: number;
  grossAmount: number;
  order: number;
};
