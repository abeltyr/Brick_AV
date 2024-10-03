import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { getPrisma } from "@/lib/utils/database";
import { PurchaseProductInput } from "@/types/purchase";
import { v4 } from "uuid";
const prisma = getPrisma();

export const dbCodeGenerator = ({
  product,
  purchaseId,
  tax,
  grossAmount,
  index,
  totalValue,
  withholding,
  accountPeriodId,
  companyId,
  date,
  creatorId,
}: {
  product: PurchaseProductInput;
  purchaseId: string;
  tax: Decimal;
  grossAmount: Decimal;
  totalValue: Decimal;
  withholding: Decimal;
  index: number;
  accountPeriodId: string;
  companyId: string;
  date: Date;
  creatorId?: string;
}) => {
  let updateInventory: Prisma.InventoryUpdateInput = {};
  let chartOfAccount = product.chartOfAccount;
  if (
    product.initialProductPriceUnit !== product.unit ||
    !new Decimal(product.initialProductPriceUnitPrice).equals(
      new Decimal(product.unitPrice),
    )
  ) {
    updateInventory = {
      quantity: {
        increment: product.quantity,
      },
      productPrice: {
        updateMany: {
          where: {
            inventoryId: product.inventoryId,
          },
          data: {
            active: false,
          },
        },
        create: {
          unit: product.unit,
          unitPrice: product.unitPrice,
          active: true,
        },
      },
      lastUpdated: new Date(),
    };
  } else {
    updateInventory = {
      quantity: {
        increment: product.quantity,
      },
      lastUpdated: new Date(),
    };
  }

  const inventoryUpdateData = prisma.inventory.upsert({
    where: {
      id: product.inventoryId,
    },
    create: {
      quantity: product.quantity,
      productId: product.productId,
      lastUpdated: new Date(),
      chartOfAccountId: chartOfAccount ? chartOfAccount.id : undefined,
    },
    update: updateInventory,
  });

  const chartOfAccountTransactionId = v4();
  let purchaseProductValue = {
    tax,
    grossAmount,
    inventoryId: product.inventoryId,
    purchaseType: product.purchaseType,
    type: product.type,
    unit: product.unit,
    unitPrice: product.unitPrice,
    quantity: product.quantity,
    totalValue: totalValue,
    order: index + 1,
    withholding,
    purchaseId,
    chartOfAccountTransactionId,
  };
  let chartOfAccountTransaction: Prisma.Prisma__ChartOfAccountTransactionClient<{}> | null =
    null;
  if (chartOfAccount) {
    chartOfAccountTransaction = prisma.chartOfAccountTransaction.create({
      data: {
        id: chartOfAccountTransactionId,
        chartOfAccountId: chartOfAccount.id,
        transactionType: "DEPOSIT",
        status: "PENDING",
        accountPeriodId: accountPeriodId,
        companyId: companyId,
        date: date,
        createdById: creatorId,
        credit: chartOfAccount.balanceType === "credit" ? totalValue : 0,
        debit: chartOfAccount.balanceType === "debit" ? totalValue : 0,
      },
    });
  }
  const purchaseProductData = prisma.purchaseProduct.upsert({
    where: {
      purchaseId_inventoryId: {
        purchaseId,
        inventoryId: product.inventoryId,
      },
    },
    create: { ...purchaseProductValue },
    update: { ...purchaseProductValue },
  });

  return {
    chartOfAccountTransaction,
    purchaseProductData,
    inventoryUpdateData,
  };
};
