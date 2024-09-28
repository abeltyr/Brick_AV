import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { getPrisma } from "@/lib/utils/database";
import { PurchaseProductInput } from "@/types/purchase";
import { WITHHOLDING_RATE } from "@/types/shared";
const prisma = getPrisma();

export const UnregisteredPurchaseSummation = ({
  hasWithholding,
  purchaseProducts,
  generateBackendData = false,
}: {
  hasWithholding: boolean;
  purchaseProducts: PurchaseProductInput[];
  generateBackendData?: Boolean;
}) => {
  let purchaseProductData: Prisma.PurchaseProductCreateManyPurchaseInput[] = [];

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

    if (generateBackendData) {
      let updateInventory: Prisma.InventoryUpdateInput = {};

      if (
        product.initialProductPrice.unit !== product.unit ||
        product.initialProductPrice.unitPrice !== new Decimal(product.unitPrice)
      ) {
        updateInventory = {
          quantity: {
            increment: product.quantity,
          },
          productPrice: {
            create: {
              unit: product.unit,
              unitPrice: product.unitPrice,
              active: true,
            },
            updateMany: {
              where: {
                inventoryId: product.inventoryId,
              },
              data: {
                active: false,
              },
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

      inventoryUpdate = [
        ...inventoryUpdate,
        prisma.inventory.upsert({
          where: {
            id: product.inventoryId,
          },
          create: {
            quantity: product.quantity,
            productId: product.productId,
            lastUpdated: new Date(),
            chartOfAccountId: product.chartOfAccountId,
          },
          update: updateInventory,
        }),
      ];

      purchaseProductData = [
        ...purchaseProductData,
        {
          grossAmount: grossAmount,
          inventoryId: product.inventoryId,
          purchaseType: product.purchaseType,
          type: product.type,
          unit: product.unit,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          totalValue: totalValue,
          order: index + 1,
          withholding,
          tax: 0,
        },
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
    purchaseProductData,
    inventoryUpdate,
  };
};
