import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { getPrisma } from "@/lib/utils/database";
import { PurchaseProductInput } from "@/types/purchase";
import { TOT_RATE, WITHHOLDING_RATE } from "@/types/shared";
const prisma = getPrisma();

export const UnregisteredPurchaseSummation = ({
  purchaseProducts,
  generateBackendData = false,
}: {
  purchaseProducts: PurchaseProductInput[];
  generateBackendData?: Boolean;
}) => {
  let purchaseProductData: Prisma.PurchaseProductCreateManyPurchaseInput[] = [];

  let goodSummaryAmount = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);

  let serviceWithholdingAmount = new Decimal("0");
  let goodWithholdingAmount = new Decimal("0");

  let serviceTaxAmount = new Decimal("0");
  let goodTaxAmount = new Decimal("0");

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

  let withholdingAmount = serviceWithholdingAmount.plus(goodWithholdingAmount);
  let totalAmount = serviceSummaryAmount.plus(goodSummaryAmount);
  let taxAmount = serviceTaxAmount.plus(goodTaxAmount);

  let grossAmount: Decimal = totalAmount
    .plus(withholdingAmount)
    .plus(taxAmount);

  let totalQuantity: number = 1;
  let averagePrice = totalAmount;

  if (purchaseProducts.length === 1) {
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
    },
    purchaseProductData,
    inventoryUpdate,
  };
};
