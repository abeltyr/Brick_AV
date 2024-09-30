import {
  ProductCategoryType,
  ProductPurchaseType,
  ProductUnitType,
} from "@prisma/client";

export type PurchaseInputType = {
  companyId: string;
  vendorId: string;
  creatorId?: string;
  chartOfAccount: {
    paymentChartOfAccount?: ChartOfAccountInput;
    vatChartOfAccount?: ChartOfAccountInput;
    withholdingChartOfAccount?: ChartOfAccountInput;
  };
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
  chartOfAccount: ChartOfAccountInput;
  unit: ProductUnitType;
  unitPrice: number;
  quantity: number;
};

export type ChartOfAccountInput = {
  id: string;
  balanceType: "credit" | "debit";
};
