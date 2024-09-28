import {
  ProductCategoryType,
  ProductPurchaseType,
  ProductUnitType,
} from "@prisma/client";

export type PurchaseInputType = {
  companyId: string;
  vendorId: string;
  date: Date;
  taxType: "VAT" | "TOT" | "NONE";
  withholdingType: "noWithholding" | "hasWithholding";
  receiptNumber: string;
  mrcNumber?: string;
  withholdingNumber?: string;
  cashReceiptVoucher?: string;
  gebiwoch: {
    purchaseType: ProductPurchaseType;
    productCategoryType: ProductCategoryType;
    unit: ProductUnitType;
    description: string;
    quantity: number;
  };
  purchaseProducts: PurchaseProductInput[];
};

export type PurchaseProductInput = {
  initialProductPriceUnit: ProductUnitType;
  initialProductPriceUnitPrice: number;
  inventoryId: string;
  productId: string;
  type: ProductCategoryType;
  purchaseType: ProductPurchaseType;
  chartOfAccountId: string;
  unit: ProductUnitType;
  unitPrice: number;
  quantity: number;
};
