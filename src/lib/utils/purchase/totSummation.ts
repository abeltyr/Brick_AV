import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { PurchaseProductInput } from "@/types/purchase";
import { TOT_RATE, WITHHOLDING_RATE } from "@/types/shared";
import { dbCodeGenerator } from "./backend";
import { DatabaseGeneratorType } from "./type";

export const totPurchaseSummation = ({
  purchaseProducts,
  databaseGenerator,
}: {
  purchaseProducts: PurchaseProductInput[];
  databaseGenerator?: DatabaseGeneratorType;
}) => {
  let chartOfAccountTransactions: Prisma.Prisma__ChartOfAccountTransactionClient<{}>[] =
    [];
  let createPurchaseProductData: Prisma.Prisma__PurchaseProductClient<{}>[] =
    [];

  let goodSummaryAmount = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);

  let serviceWithholdingAmount = new Decimal("0");
  let goodWithholdingAmount = new Decimal("0");

  let serviceTaxAmount = new Decimal("0");
  let goodTaxAmount = new Decimal("0");

  let inventoryUpdate: Prisma.Prisma__InventoryClient<{}>[] = [];

  // Calculate sums and prepare data for bulk updates

  purchaseProducts &&
    purchaseProducts.map(async (product, index) => {
      const totalValue = new Decimal(product.unitPrice || 0).times(
        product.quantity || 0,
      );

      let tax = totalValue.times(new Decimal(TOT_RATE.good));
      let withholding = totalValue.times(WITHHOLDING_RATE.local);
      let grossAmount = totalValue.plus(tax).plus(withholding);

      if (product.type === "Service") {
        serviceSummaryAmount = serviceSummaryAmount.plus(totalValue);
        tax = totalValue.times(new Decimal(TOT_RATE.service));
        serviceTaxAmount = serviceTaxAmount.plus(tax);
        serviceWithholdingAmount = serviceWithholdingAmount.plus(withholding);
      } else {
        goodSummaryAmount = goodSummaryAmount.plus(totalValue);
        goodTaxAmount = goodTaxAmount.plus(tax);
        goodWithholdingAmount = goodWithholdingAmount.plus(withholding);
      }

      if (databaseGenerator) {
        const {
          inventoryUpdateData,
          purchaseProductData,
          chartOfAccountTransaction,
        } = dbCodeGenerator({
          product,
          tax,
          grossAmount,
          index,
          totalValue,
          withholding,
          ...databaseGenerator,
        });

        if (chartOfAccountTransaction)
          chartOfAccountTransactions = [
            ...chartOfAccountTransactions,
            chartOfAccountTransaction,
          ];
        inventoryUpdate = [...inventoryUpdate, inventoryUpdateData];
        createPurchaseProductData = [
          ...createPurchaseProductData,
          purchaseProductData,
        ];
      }
    });

  let withholdingAmount = serviceWithholdingAmount.plus(goodWithholdingAmount);
  let totalAmount = serviceSummaryAmount.plus(goodSummaryAmount);
  let taxAmount = serviceTaxAmount.plus(goodTaxAmount);

  let grossAmount: Decimal = totalAmount
    .plus(withholdingAmount)
    .plus(taxAmount);

  let totalQuantity: number = 1;
  let averagePrice = totalAmount;

  if (purchaseProducts && purchaseProducts.length === 1) {
    totalQuantity = purchaseProducts[0].quantity;
    averagePrice = new Decimal(purchaseProducts[0].unitPrice);
  }

  return {
    summation: {
      goodSummaryAmount,
      serviceSummaryAmount,
      totalAmount,
      goodWithholdingAmount,
      serviceWithholdingAmount,
      withholdingAmount,
      taxAmount,
      grossAmount,
      totalQuantity,
      averagePrice,
      serviceTaxAmount,
      goodTaxAmount,
    },
    createPurchaseProductData,
    chartOfAccountTransactions,
    inventoryUpdate,
  };
};
