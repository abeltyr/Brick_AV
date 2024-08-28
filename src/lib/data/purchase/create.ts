"use server";

import { getPrisma } from "@/lib/utils/database";
import {
  Product,
  ProductType,
  ProductUnit,
  Purchase,
  PurchaseType,
} from "@prisma/client";
const prisma = getPrisma();

export const createPurchaseAction = async (data: {
  companyId: string;
  vendorId: string;
  date: Date;
  purchaseType: PurchaseType;
  MRCNumber?: string;
  VatReceiptNumber?: string;
  localPurchaseCapitalAssets?: number;
  vatOnLocalPurchaseCapitalAssets?: number;
  importedCapitalAssets?: number;
  vatOnImportedCapitalAssets?: number;
  totalCapitalAssets?: number;
  vatOnTotalAssets?: number;
  localPurchaseInputs?: number;
  vatOnLocalPurchaseInputs?: number;
  importedInputs?: number;
  vatOnImportedInputs?: number;
  generalExpenseInputs?: number;
  vatOnGeneralExpenseInputs?: number;
  purchaseWithNoVat?: number;
  totalNonCapitalInputs?: number;
  vatOnTotalInputs?: number;
  taxableAmount: number;
  nonTaxableAmount: number;
  totalVat: number;
  grossAmount: number;
  month: number;
  year: number;
  dataIndex: number;
  paymentDetailId?: string;
  purchaseReportId?: string;
  purchaseProducts: {
    productId: string;
    type: ProductType;
    purchaseType: PurchaseType;
    unit: ProductUnit;
    unitPrice: number;
    quantity: number;
    totalValue: number;
    vat: number;
    grossAmount: number;
  }[];
}): Promise<Purchase> => {
  let localPurchaseCapitalAssets: number = 0;
  let vatOnLocalPurchaseCapitalAssets: number = 0;
  let importedCapitalAssets: number = 0;
  let vatOnImportedCapitalAssets: number = 0;
  let totalCapitalAssets: number = 0;
  let vatOnTotalAssets: number = 0;
  let localPurchaseInputs: number = 0;
  let vatOnLocalPurchaseInputs: number = 0;
  let importedInputs: number = 0;
  let vatOnImportedInputs: number = 0;
  let generalExpenseInputs: number = 0;
  let vatOnGeneralExpenseInputs: number = 0;
  let purchaseWithNoVat: number = 0;
  let totalNonCapitalInputs: number = 0;
  let vatOnTotalInputs: number = 0;

  let purchaseProducts: {
    productId: string;
    type: ProductType;
    purchaseType: PurchaseType;
    unit: ProductUnit;
    unitPrice: number;
    quantity: number;
    totalValue: number;
    vat: number;
    grossAmount: number;
  }[] = [];

  data.purchaseProducts.map((product, index) => {
    // create the sum for each case
    purchaseProducts = [
      ...purchaseProducts,
      {
        vat: product.vat,
        grossAmount: product.grossAmount,
        productId: product.productId,
        purchaseType: product.purchaseType,
        type: product.type,
        unit: product.unit,
        unitPrice: product.unitPrice,
        quantity: product.quantity,
        totalValue: product.totalValue,
      },
    ];
  });

  // create month and year from the date base on ethiopia calender

  // sum up the tax and gross amount
  let taxableAmount: number = 0;
  let nonTaxableAmount: number = 0;
  let totalVat: number = 0;
  let grossAmount: number = 0;

  return await prisma.purchase.create({
    data: {
      companyId: data.companyId,
      vendorId: data.vendorId,
      VatReceiptNumber: data.VatReceiptNumber,
      MRCNumber: data.MRCNumber,
      purchaseType: data.purchaseType,
      localPurchaseCapitalAssets,
      vatOnLocalPurchaseCapitalAssets,
      importedCapitalAssets,
      vatOnImportedCapitalAssets,
      totalCapitalAssets,
      vatOnTotalAssets,
      localPurchaseInputs,
      vatOnLocalPurchaseInputs,
      importedInputs,
      vatOnImportedInputs,
      generalExpenseInputs,
      vatOnGeneralExpenseInputs,
      purchaseWithNoVat,
      totalNonCapitalInputs,
      vatOnTotalInputs,
      taxableAmount,
      nonTaxableAmount,
      totalVat,
      grossAmount,
      date: data.date,
      month: data.month,
      year: data.year,
      dataIndex: data.dataIndex,
      PurchaseProduct: {
        create: purchaseProducts,
      },
    },
  });
};
