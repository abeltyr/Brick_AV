import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { PurchaseProductInput } from "@/types/purchase";
import { WITHHOLDING_RATE } from "@/types/shared";
import { dbCodeGenerator } from "./backend";
import { DatabaseGeneratorType } from "./type";

export const UnregisteredPurchaseSummation = ({
  hasWithholding,
  purchaseProducts,
  databaseGenerator,
}: {
  hasWithholding: boolean;
  purchaseProducts: PurchaseProductInput[];
  databaseGenerator?: DatabaseGeneratorType;
}) => {
  let chartOfAccountTransactions: Prisma.Prisma__ChartOfAccountTransactionClient<{}>[] =
    [];
  let createPurchaseProductData: Prisma.Prisma__PurchaseProductClient<{}>[] =
    [];
  let withholdingRate = new Decimal("0");
  let totalAmount = new Decimal(0);
  let withholdingAmount = new Decimal(0);

  if (hasWithholding) {
    withholdingRate = new Decimal(WITHHOLDING_RATE.unregistered);
  }

  let inventoryUpdate: Prisma.Prisma__InventoryClient<{
    id: string;
    productId: string;
    quantity: Prisma.Decimal;
    lastUpdated: Date;
    chartOfAccountId: string;
  }>[] = [];

  // Calculate sums and prepare data for bulk updates

  purchaseProducts.map(async (product, index) => {
    const totalValue = new Decimal(product.unitPrice || 0).times(
      product.quantity || 0,
    );
    let withholding = totalValue.mul(withholdingRate);
    let grossAmount = totalValue.plus(withholding);

    totalAmount = totalAmount.plus(totalValue);
    withholdingAmount = withholdingAmount.plus(withholding);

    if (databaseGenerator) {
      const {
        inventoryUpdateData,
        purchaseProductData,
        chartOfAccountTransaction,
      } = dbCodeGenerator({
        product,
        tax: new Decimal(0),
        grossAmount,
        index,
        totalValue,
        withholding,
        ...databaseGenerator,
      });

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

  let grossAmount: Decimal = totalAmount.plus(withholdingAmount);

  let totalQuantity: number = 1;
  let averagePrice = totalAmount;

  if (purchaseProducts.length === 1) {
    totalQuantity = purchaseProducts[0].quantity;
    averagePrice = new Decimal(purchaseProducts[0].unitPrice);
  }

  return {
    summation: {
      totalAmount,
      withholdingAmount,
      grossAmount,
      totalQuantity,
      averagePrice,
    },
    createPurchaseProductData,
    chartOfAccountTransactions,
    inventoryUpdate,
  };
};
