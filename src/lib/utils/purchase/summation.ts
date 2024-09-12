import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { getPrisma } from "@/lib/utils/database";
import { PurchaseProductInput } from "@/types/purchase";
import { DefaultArgs } from "@prisma/client/runtime/library";
const prisma = getPrisma();

export const purchaseSummation = ({
  hasVat = true,
  hasWithholding = true,
  vendorBusiness = false,
  purchaseProducts,
  generateBackendData = false,
}: {
  hasVat?: boolean;
  hasWithholding?: boolean;
  vendorBusiness?: boolean;
  purchaseProducts: PurchaseProductInput[];
  generateBackendData?: Boolean;
}) => {
  let localGoodSummaryAmount = new Decimal(0);
  let importedGoodSummaryAmount = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);

  let localPurchaseCapitalAssets: Decimal = new Decimal(0);
  let vatOnLocalPurchaseCapitalAssets: Decimal = new Decimal(0);

  let importedCapitalAssets: Decimal = new Decimal(0);
  let vatOnImportedCapitalAssets: Decimal = new Decimal(0);

  let localPurchaseInputs: Decimal = new Decimal(0);
  let vatOnLocalPurchaseInputs: Decimal = new Decimal(0);

  let importedInputs: Decimal = new Decimal(0);
  let vatOnImportedInputs: Decimal = new Decimal(0);

  let generalExpenseInputs: Decimal = new Decimal(0);
  let vatOnGeneralExpenseInputs: Decimal = new Decimal(0);

  let purchaseWithNoVat: Decimal = new Decimal(0);

  let totalCapitalAssets: Decimal = new Decimal(0);
  let vatOnTotalAssets: Decimal = new Decimal(0);

  let totalNonCapitalInputs: Decimal = new Decimal(0);
  let vatOnTotalInputs: Decimal = new Decimal(0);

  let purchaseProductData: Prisma.PurchaseProductCreateManyPurchaseInput[] = [];

  const VAT_RATE = hasVat ? new Decimal("0.15") : new Decimal("0"); // 15% VAT rate
  let SERVICE_WITHHOLDING_RATE = new Decimal("0");
  let LOCAL_GOOD_WITHHOLDING_RATE = new Decimal("0");
  let IMPORTED_GOOD_WITHHOLDING_RATE = new Decimal("0");

  if (hasWithholding) {
    if (vendorBusiness) {
      SERVICE_WITHHOLDING_RATE = new Decimal("0.02");
      LOCAL_GOOD_WITHHOLDING_RATE = new Decimal("0.02");
      IMPORTED_GOOD_WITHHOLDING_RATE = new Decimal("0.03");
    } else {
      SERVICE_WITHHOLDING_RATE = new Decimal("0.30");
      LOCAL_GOOD_WITHHOLDING_RATE = new Decimal("0.30");
      IMPORTED_GOOD_WITHHOLDING_RATE = new Decimal("0.30");
    }
  }

  let inventoryUpdate: Prisma.Prisma__InventoryClient<
    {
      id: string;
      productId: string;
      quantity: number;
      lastUpdated: Date;
    },
    never,
    DefaultArgs
  >[] = [];

  // Calculate sums and prepare data for bulk updates

  purchaseProducts.map(async (product, index) => {
    const totalValue = new Decimal(product.unitPrice || 0).times(
      product.quantity || 0,
    );
    const vat = totalValue.times(VAT_RATE);
    let grossAmount = totalValue.plus(vat);

    let withholding = new Decimal(0);

    if (product.type === "Service") {
      serviceSummaryAmount = serviceSummaryAmount.plus(totalValue);
      withholding = totalValue.times(SERVICE_WITHHOLDING_RATE);
    }

    switch (product.purchaseType) {
      case "taxableLocalCapitalAssets":
        localPurchaseCapitalAssets = localPurchaseCapitalAssets.plus(
          new Decimal(totalValue),
        );
        vatOnLocalPurchaseCapitalAssets = vatOnLocalPurchaseCapitalAssets.plus(
          new Decimal(vat),
        );
        if (product.type === "Good") {
          localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
          withholding = totalValue.times(LOCAL_GOOD_WITHHOLDING_RATE);
        }
        break;
      case "taxableImportedCapitalAssets":
        importedCapitalAssets = importedCapitalAssets.plus(
          new Decimal(totalValue),
        );
        vatOnImportedCapitalAssets = vatOnImportedCapitalAssets.plus(
          new Decimal(vat),
        );
        if (product.type === "Good") {
          importedGoodSummaryAmount =
            importedGoodSummaryAmount.plus(totalValue);
          withholding = totalValue.times(IMPORTED_GOOD_WITHHOLDING_RATE);
        }
        break;
      case "taxableLocalInputs":
        localPurchaseInputs = localPurchaseInputs.plus(new Decimal(totalValue));
        vatOnLocalPurchaseInputs = vatOnLocalPurchaseInputs.plus(
          new Decimal(vat),
        );
        if (product.type === "Good") {
          localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);

          withholding = totalValue.times(LOCAL_GOOD_WITHHOLDING_RATE);
        }
        break;
      case "taxableImportedInputs":
        importedInputs = importedInputs.plus(new Decimal(totalValue));
        vatOnImportedInputs = vatOnImportedInputs.plus(new Decimal(vat));
        if (product.type === "Good") {
          importedGoodSummaryAmount =
            importedGoodSummaryAmount.plus(totalValue);
          withholding = totalValue.times(IMPORTED_GOOD_WITHHOLDING_RATE);
        }
        break;
      case "taxableGeneralExpenseInputs":
        generalExpenseInputs = generalExpenseInputs.plus(
          new Decimal(totalValue),
        );
        vatOnGeneralExpenseInputs = vatOnGeneralExpenseInputs.plus(
          new Decimal(vat),
        );
        if (product.type === "Good") {
          localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
          withholding = totalValue.times(LOCAL_GOOD_WITHHOLDING_RATE);
        }
        break;
      case "taxExemptedPurchase":
        purchaseWithNoVat = purchaseWithNoVat.plus(new Decimal(totalValue));
        grossAmount = totalValue;
        if (product.type === "Good") {
          localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
          withholding = totalValue.times(LOCAL_GOOD_WITHHOLDING_RATE);
        }
        break;
    }

    if (generateBackendData) {
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
          },
          update: {
            quantity: {
              increment: product.quantity,
            },
            lastUpdated: new Date(),
          },
        }),
      ];

      purchaseProductData = [
        ...purchaseProductData,
        {
          vat: vat,
          grossAmount: grossAmount,
          inventoryId: product.inventoryId,
          purchaseType: product.purchaseType,
          type: product.type,
          unit: product.unit,
          unitPrice: new Decimal(product.unitPrice),
          quantity: product.quantity,
          totalValue: totalValue,
          order: index + 1,
          withholding,
        },
      ];
    }
  });

  totalCapitalAssets = localPurchaseCapitalAssets.plus(importedCapitalAssets);
  vatOnTotalAssets = vatOnLocalPurchaseCapitalAssets.plus(
    vatOnImportedCapitalAssets,
  );
  totalNonCapitalInputs = localPurchaseInputs
    .plus(importedInputs)
    .plus(generalExpenseInputs);
  vatOnTotalInputs = vatOnLocalPurchaseInputs
    .plus(vatOnImportedInputs)
    .plus(vatOnGeneralExpenseInputs);

  // sum up the tax and gross amount
  let taxableAmount: Decimal = totalCapitalAssets.plus(totalNonCapitalInputs);
  let nonTaxableAmount: Decimal = purchaseWithNoVat;
  let totalVat: Decimal = vatOnTotalAssets.plus(vatOnTotalInputs);

  let importedGoodWithholding = new Decimal(0);
  let localGoodWithholding = new Decimal(0);
  let serviceWithholding = new Decimal(0);

  if (localGoodSummaryAmount.greaterThan(10000)) {
    localGoodWithholding = localGoodSummaryAmount.times(
      LOCAL_GOOD_WITHHOLDING_RATE,
    );
  }

  if (importedGoodSummaryAmount.greaterThan(10000)) {
    importedGoodWithholding = importedGoodSummaryAmount.times(
      IMPORTED_GOOD_WITHHOLDING_RATE,
    );
  }

  if (serviceSummaryAmount.greaterThan(3000)) {
    serviceWithholding = serviceSummaryAmount.times(SERVICE_WITHHOLDING_RATE);
  }

  const withholding = serviceWithholding
    .plus(localGoodWithholding)
    .plus(importedGoodWithholding);

  let grossAmount: Decimal = taxableAmount
    .plus(nonTaxableAmount)
    .plus(totalVat)
    .minus(withholding);

  const totalBeforeVat = taxableAmount.plus(nonTaxableAmount);

  let totalQuantity: number = 1;
  let averagePrice = totalBeforeVat;

  if (purchaseProducts.length === 1) {
    totalQuantity = purchaseProducts[0].quantity;
    averagePrice = new Decimal(purchaseProducts[0].unitPrice);
  }

  return {
    summation: {
      localPurchaseCapitalAssets,
      vatOnLocalPurchaseCapitalAssets,
      importedCapitalAssets,
      vatOnImportedCapitalAssets,
      localPurchaseInputs,
      vatOnLocalPurchaseInputs,
      importedInputs,
      vatOnImportedInputs,
      generalExpenseInputs,
      vatOnGeneralExpenseInputs,
      purchaseWithNoVat,
      totalCapitalAssets,
      vatOnTotalAssets,
      totalNonCapitalInputs,
      vatOnTotalInputs,
      importedGoodSummaryAmount,
      importedGoodWithholding,
      localGoodSummaryAmount,
      localGoodWithholding,
      serviceSummaryAmount,
      serviceWithholding,
      taxableAmount,
      nonTaxableAmount,
      totalVat,
      withholding,
      grossAmount,
      totalBeforeVat,
      totalQuantity,
      averagePrice,
    },
    purchaseProductData,
    inventoryUpdate,
  };
};
