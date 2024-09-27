"use server";
import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
import { findVendorByIdAction } from "../vendor/fetchById";
import { VendorType } from "@/types/vendor";
import { purchaseSummation } from "@/lib/utils/purchase/summation";
import { monthYearGetter } from "@/lib/utils/calendar/monthYearGetter";
import { PurchaseInputType } from "@/types/purchase";
const prisma = getPrisma();

export const createPurchaseAction = async (
  data: PurchaseInputType,
): Promise<{
  purchase: Purchase;
} | null> => {
  // validate vendor
  const vendor = (await findVendorByIdAction(data.vendorId)) as VendorType;
  if (!vendor) throw new Error("Vendor is no setup");

  // extract month and year from the current date
  let { month, year } = await monthYearGetter(data.date);
  if (!month || !year) throw new Error("date is not setup right");

  // generate summation data

  const sum = purchaseSummation({
    hasVat: data.hasVat,
    hasWithholding: data.hasWithholding,
    vendorBusiness: data.vendorBusiness,
    purchaseProducts: data.purchaseProducts,
    generateBackendData: true,
  });

  const {
    generalExpenseInputs,
    importedCapitalAssets,
    importedGoodSummaryAmount,
    importedGoodWithholding,
    importedInputs,
    localGoodSummaryAmount,
    localGoodWithholding,
    localPurchaseCapitalAssets,
    localPurchaseInputs,
    nonTaxableAmount,
    purchaseWithNoVat,
    serviceSummaryAmount,
    serviceWithholding,
    taxableAmount,
    totalCapitalAssets,
    totalNonCapitalInputs,
    totalVat,
    vatOnGeneralExpenseInputs,
    vatOnImportedCapitalAssets,
    vatOnImportedInputs,
    vatOnLocalPurchaseCapitalAssets,
    vatOnLocalPurchaseInputs,
    vatOnTotalAssets,
    vatOnTotalInputs,
    withholding,
    totalBeforeVat,
    grossAmount,
    totalQuantity,
    averagePrice,
  } = sum.summation;

  let vendorTin = null;
  let vendorVat = vendor.vat;
  let vendorName = vendor.name;
  if (vendor.business) {
    vendorTin = vendor.business.tinNumber;
  }

  const allData = await prisma.$transaction([
    prisma.purchase.create({
      data: {
        companyId: data.companyId,
        vendorId: data.vendorId,
        VatReceiptNumber: data.VatReceiptNumber,
        MRCNumber: data.MRCNumber,
        description: data.description,
        vendorTin,
        vendorName,
        vendorVat,
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
        year,
        month,
        totalQuantity: totalQuantity,
        averagePrice: averagePrice,
        totalBeforeVat,
        hasVat: data.hasVat,
        hasWithholding: data.hasWithholding,
        withholdingNumber: data.withholdingNumber,
        productType: data.productType,
        unit: data.unit,
        purchaseType: data.purchaseType,
        date: data.date,
        PurchaseProduct: {
          createMany: {
            data: sum.purchaseProductData,
            skipDuplicates: true,
          },
        },
      },
    }),
    ...sum.inventoryUpdate,
  ]);

  const purchaseReport = prisma.purchaseDailyReport.upsert({
    where: {
      date_companyId: {
        date: data.date,
        companyId: data.companyId,
      },
    },
    create: {
      companyId: data.companyId,
      nonTaxableAmount,
      taxableAmount,
      totalBeforeTax: totalBeforeVat,
      totAmount,
      vatAmount,
      date: data.date,
      withholdingAmount,
      totalVat,
      grossAmount,
      count: 1,
      Purchase: {
        connect: {
          id: allData[0].id,
        },
      },
    },
    update: {
      localPurchaseCapitalAssets: {
        increment: localPurchaseCapitalAssets,
      },
      vatOnLocalPurchaseCapitalAssets: {
        increment: vatOnLocalPurchaseCapitalAssets,
      },
      importedCapitalAssets: {
        increment: importedCapitalAssets,
      },
      vatOnImportedCapitalAssets: {
        increment: vatOnImportedCapitalAssets,
      },
      totalCapitalAssets: {
        increment: totalCapitalAssets,
      },
      vatOnTotalAssets: {
        increment: vatOnTotalAssets,
      },
      localPurchaseInputs: {
        increment: localPurchaseInputs,
      },
      vatOnLocalPurchaseInputs: {
        increment: vatOnLocalPurchaseInputs,
      },
      importedInputs: {
        increment: importedInputs,
      },
      vatOnImportedInputs: {
        increment: vatOnImportedInputs,
      },
      generalExpenseInputs: {
        increment: generalExpenseInputs,
      },
      vatOnGeneralExpenseInputs: {
        increment: vatOnGeneralExpenseInputs,
      },
      purchaseWithNoVat: {
        increment: purchaseWithNoVat,
      },
      totalNonCapitalInputs: {
        increment: totalNonCapitalInputs,
      },
      vatOnTotalInputs: {
        increment: vatOnTotalInputs,
      },
      taxableAmount: {
        increment: taxableAmount,
      },
      nonTaxableAmount: {
        increment: nonTaxableAmount,
      },
      totalVat: {
        increment: totalVat,
      },
      importedGoodSummaryAmount: {
        increment: importedGoodSummaryAmount,
      },
      importedGoodWithholding: {
        increment: importedGoodWithholding,
      },
      serviceSummaryAmount: {
        increment: serviceSummaryAmount,
      },
      serviceWithholding: {
        increment: serviceWithholding,
      },
      localGoodSummaryAmount: {
        increment: localGoodSummaryAmount,
      },
      localGoodWithholding: {
        increment: localGoodWithholding,
      },
      withholding: {
        increment: withholding,
      },
      grossAmount: {
        increment: grossAmount,
      },
      count: {
        increment: 1,
      },
      month: month,
      year: year,
      Purchase: {
        connect: {
          id: allData[0].id,
        },
      },
    },
  });

  return {
    purchase: allData[0],
  };
};
