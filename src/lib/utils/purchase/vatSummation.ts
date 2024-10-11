import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { PurchaseProductInput } from "@/types/purchase";
import { VAT_RATE, WITHHOLDING_RATE } from "@/types/shared";
import { dbCodeGenerator } from "./backend";
import { DatabaseGeneratorType } from "./type";

export const vatPurchaseSummation = ({
  purchaseProducts,
  databaseGenerator,
}: {
  purchaseProducts: PurchaseProductInput[];
  databaseGenerator?: DatabaseGeneratorType;
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

  let createPurchaseProductData: Prisma.Prisma__PurchaseProductClient<{}>[] =
    [];

  let importedGoodWithholding = new Decimal(0);
  let localGoodWithholding = new Decimal(0);
  let serviceWithholding = new Decimal(0);

  let inventoryUpdate: Prisma.Prisma__InventoryClient<{}>[] = [];

  // Calculate sums and prepare data for bulk updates

  purchaseProducts &&
    purchaseProducts.map(async (product, index) => {
      const totalValue = new Decimal(product.unitPrice || 0).times(
        product.quantity || 0,
      );
      const tax = totalValue.times(VAT_RATE);

      let withholding = new Decimal(0);
      let grossAmount = totalValue.plus(tax);

      if (product.type === "Service") {
        serviceSummaryAmount = serviceSummaryAmount.plus(totalValue);
        if (totalValue.greaterThan(3000)) {
          withholding = totalValue.times(WITHHOLDING_RATE.local);
          serviceWithholding = serviceWithholding.plus(withholding);
        }
      }

      switch (product.purchaseType) {
        case "taxableLocalCapitalAssets":
          localPurchaseCapitalAssets = localPurchaseCapitalAssets.plus(
            new Decimal(totalValue),
          );
          vatOnLocalPurchaseCapitalAssets =
            vatOnLocalPurchaseCapitalAssets.plus(tax);
          if (product.type === "Good") {
            localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.local);
              localGoodWithholding = localGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
        case "taxableImportedCapitalAssets":
          importedCapitalAssets = importedCapitalAssets.plus(
            new Decimal(totalValue),
          );
          vatOnImportedCapitalAssets = vatOnImportedCapitalAssets.plus(tax);
          if (product.type === "Good") {
            importedGoodSummaryAmount =
              importedGoodSummaryAmount.plus(totalValue);
            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.imported);
              importedGoodWithholding =
                importedGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
        case "taxableLocalInputs":
          localPurchaseInputs = localPurchaseInputs.plus(totalValue);
          vatOnLocalPurchaseInputs = vatOnLocalPurchaseInputs.plus(tax);
          if (product.type === "Good") {
            localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.local);
              localGoodWithholding = localGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
        case "taxableImportedInputs":
          importedInputs = importedInputs.plus(totalValue);
          vatOnImportedInputs = vatOnImportedInputs.plus(tax);
          if (product.type === "Good") {
            importedGoodSummaryAmount =
              importedGoodSummaryAmount.plus(totalValue);

            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.imported);
              importedGoodWithholding =
                importedGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
        case "taxableGeneralExpenseInputs":
          generalExpenseInputs = generalExpenseInputs.plus(
            new Decimal(totalValue),
          );
          vatOnGeneralExpenseInputs = vatOnGeneralExpenseInputs.plus(tax);
          if (product.type === "Good") {
            localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);
            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.local);
              localGoodWithholding = localGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
        case "taxExemptedPurchase":
          purchaseWithNoVat = purchaseWithNoVat.plus(totalValue);
          grossAmount = totalValue;
          if (product.type === "Good") {
            localGoodSummaryAmount = localGoodSummaryAmount.plus(totalValue);

            if (totalValue.greaterThan(10000)) {
              withholding = totalValue.times(WITHHOLDING_RATE.local);
              localGoodWithholding = localGoodWithholding.plus(withholding);
              grossAmount.plus(withholding);
            }
          }
          break;
      }

      if (databaseGenerator) {
        const { inventoryUpdateData, purchaseProductData } = dbCodeGenerator({
          product,
          tax,
          grossAmount,
          index,
          totalValue,
          withholding,
          ...databaseGenerator,
        });
        inventoryUpdate = [...inventoryUpdate, inventoryUpdateData];
        createPurchaseProductData = [
          ...createPurchaseProductData,
          purchaseProductData,
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
  let taxAmount: Decimal = vatOnTotalAssets.plus(vatOnTotalInputs);

  const withholdingAmount = serviceWithholding
    .plus(localGoodWithholding)
    .plus(importedGoodWithholding);

  let grossAmount: Decimal = taxableAmount
    .plus(nonTaxableAmount)
    .plus(taxAmount)
    .minus(withholdingAmount);

  const totalAmount = taxableAmount.plus(nonTaxableAmount);

  let totalQuantity: number = 1;
  let averagePrice = totalAmount;

  if (purchaseProducts && purchaseProducts.length === 1) {
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
      totalAmount,
      taxAmount,
      withholdingAmount,
      grossAmount,
      totalQuantity,
      averagePrice,
    },
    createPurchaseProductData,
    inventoryUpdate,
  };
};
