"use server";
import { Decimal } from "decimal.js";
import { getPrisma } from "@/lib/utils/database";
import { v4 } from "uuid";
import {
  ProductType,
  ProductUnit,
  Purchase,
  PurchaseReport,
  PurchaseType,
} from "@prisma/client";
import { toEthiopian } from "@/lib/utils/calendar";
const prisma = getPrisma();

export const createPurchaseAction = async (data: {
  companyId: string;
  vendorId: string;
  date: Date;
  productType: ProductType;
  purchaseType: PurchaseType;
  unit: ProductUnit;
  MRCNumber?: string;
  VatReceiptNumber?: string;
  invoiceNumber?: string;
  purchaseProducts: {
    productId: string;
    type: ProductType;
    purchaseType: PurchaseType;
    unit: ProductUnit;
    unitPrice: Decimal;
    quantity: number;
  }[];
}): Promise<{
  purchase: Purchase;
  purchaseReport: PurchaseReport;
} | null> => {
  const ethioDate = toEthiopian({
    date: new Date(data.date).getDate(),
    month: new Date(data.date).getMonth() + 1,
    year: new Date(data.date).getFullYear(),
  });
  if (!ethioDate) throw new Error("date is wrong");
  let month = ethioDate?.month >= 12 ? ethioDate?.month : 12;
  let year = ethioDate?.year;
  if (!month || !year) throw new Error("date is not setup right");
  console.log({
    month,
    year,
  });

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

  let purchaseProducts: {
    productId: string;
    type: ProductType;
    purchaseType: PurchaseType;
    unit: ProductUnit;
    unitPrice: Decimal;
    quantity: number;
    totalValue: Decimal;
    vat: Decimal;
    grossAmount: Decimal;
  }[] = [];

  let totalQuantity: number = 0;

  data.purchaseProducts.map(async (product, index) => {
    const VAT_RATE = new Decimal("0.15"); // 15% VAT rate

    const totalValue = new Decimal(product.unitPrice || 0).times(
      product.quantity || 0,
    );
    const vat = totalValue.times(VAT_RATE);

    let grossAmount = totalValue.plus(vat);
    if (product.purchaseType === "taxableLocalCapitalAssets") {
      localPurchaseCapitalAssets = localPurchaseCapitalAssets.plus(
        new Decimal(totalValue),
      );
      vatOnLocalPurchaseCapitalAssets = vatOnLocalPurchaseCapitalAssets.plus(
        new Decimal(vat),
      );
    } else if (product.purchaseType === "taxableImportedCapitalAssets") {
      importedCapitalAssets = importedCapitalAssets.plus(
        new Decimal(totalValue),
      );
      vatOnImportedCapitalAssets = vatOnImportedCapitalAssets.plus(
        new Decimal(vat),
      );
    } else if (product.purchaseType === "taxableLocalInputs") {
      localPurchaseInputs = localPurchaseInputs.plus(new Decimal(totalValue));
      vatOnLocalPurchaseInputs = vatOnLocalPurchaseInputs.plus(
        new Decimal(vat),
      );
    } else if (product.purchaseType === "taxableImportedInputs") {
      importedInputs = importedInputs.plus(new Decimal(totalValue));
      vatOnImportedInputs = vatOnImportedInputs.plus(new Decimal(vat));
    } else if (product.purchaseType === "taxableGeneralExpenseInputs") {
      generalExpenseInputs = generalExpenseInputs.plus(new Decimal(totalValue));
      vatOnGeneralExpenseInputs = vatOnGeneralExpenseInputs.plus(
        new Decimal(vat),
      );
    } else if (product.purchaseType === "taxExemptedPurchase") {
      purchaseWithNoVat = purchaseWithNoVat.plus(new Decimal(totalValue));
      grossAmount = totalValue;
    }

    totalQuantity = totalQuantity + product.quantity;

    // create the sum for each case
    purchaseProducts = [
      ...purchaseProducts,
      {
        vat: vat,
        grossAmount: grossAmount,
        productId: product.productId,
        purchaseType: product.purchaseType,
        type: product.type,
        unit: product.unit,
        unitPrice: new Decimal(product.unitPrice),
        quantity: product.quantity,
        totalValue: totalValue,
      },
    ];

    await prisma.inventory.upsert({
      where: {
        productId: product.productId,
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
    });
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

  // create month and year from the date base on ethiopia calender

  // sum up the tax and gross amount
  let taxableAmount: Decimal = totalCapitalAssets.plus(totalNonCapitalInputs);
  let nonTaxableAmount: Decimal = purchaseWithNoVat;
  console.log("vatOnTotalAssets", {
    vatOnTotalAssets,
    vatOnLocalPurchaseInputs,
    vatOnImportedInputs,
    vatOnGeneralExpenseInputs,
  });
  console.log("vatOnTotalInputs", {
    vatOnTotalInputs,
    vatOnLocalPurchaseCapitalAssets,
    vatOnImportedCapitalAssets,
  });

  let totalVat: Decimal = vatOnTotalAssets.plus(vatOnTotalInputs);
  let grossAmount: Decimal = taxableAmount
    .plus(nonTaxableAmount)
    .plus(totalVat);

  const beforeVat = taxableAmount.plus(nonTaxableAmount);

  const averagePrice = beforeVat.dividedBy(totalQuantity);

  const purchase = await prisma.purchase.create({
    data: {
      companyId: data.companyId,
      vendorId: data.vendorId,
      VatReceiptNumber: data.VatReceiptNumber,
      MRCNumber: data.MRCNumber,

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

      month,
      year,
      totalQuantity: totalQuantity,
      averagePrice: averagePrice,
      productType: data.productType,
      unit: data.unit,
      purchaseType: data.purchaseType,
      date: data.date,
      invoiceNumber: data.invoiceNumber,
      // purchaseReportId,
      PurchaseProduct: {
        create: purchaseProducts,
      },
    },
  });

  let purchaseReport = await prisma.purchaseReport.findUnique({
    where: {
      month_year_companyId: {
        companyId: data.companyId,
        month,
        year,
      },
    },
  });

  if (purchaseReport) {
    const sumLocalPurchaseCapitalAssets: Decimal =
      localPurchaseCapitalAssets.plus(
        purchaseReport.localPurchaseCapitalAssets,
      );

    const sumVatOnLocalPurchaseCapitalAssets: Decimal =
      vatOnLocalPurchaseCapitalAssets.plus(
        purchaseReport.vatOnLocalPurchaseCapitalAssets,
      );

    const sumImportedCapitalAssets: Decimal = importedCapitalAssets.plus(
      purchaseReport.importedCapitalAssets,
    );

    const sumVatOnImportedCapitalAssets: Decimal =
      vatOnImportedCapitalAssets.plus(
        purchaseReport.vatOnImportedCapitalAssets,
      );

    const sumTotalCapitalAssets: Decimal = totalCapitalAssets.plus(
      purchaseReport.totalCapitalAssets,
    );

    const sumVatOnTotalAssets: Decimal = vatOnTotalAssets.plus(
      purchaseReport.vatOnTotalAssets,
    );

    const sumLocalPurchaseInputs: Decimal = localPurchaseInputs.plus(
      purchaseReport.localPurchaseInputs,
    );

    const sumVatOnLocalPurchaseInputs: Decimal = vatOnLocalPurchaseInputs.plus(
      purchaseReport.vatOnLocalPurchaseInputs,
    );

    const sumImportedInputs: Decimal = importedInputs.plus(
      purchaseReport.importedInputs,
    );

    const sumVatOnImportedInputs: Decimal = vatOnImportedInputs.plus(
      purchaseReport.vatOnImportedInputs,
    );

    const sumGeneralExpenseInputs: Decimal = generalExpenseInputs.plus(
      purchaseReport.generalExpenseInputs,
    );

    const sumVatOnGeneralExpenseInputs: Decimal =
      vatOnGeneralExpenseInputs.plus(purchaseReport.vatOnGeneralExpenseInputs);

    const sumPurchaseWithNoVat: Decimal = purchaseWithNoVat.plus(
      purchaseReport.purchaseWithNoVat,
    );

    const sumTotalNonCapitalInputs: Decimal = totalNonCapitalInputs.plus(
      purchaseReport.totalNonCapitalInputs,
    );

    const sumVatOnTotalInputs: Decimal = vatOnTotalInputs.plus(
      purchaseReport.vatOnTotalInputs,
    );

    const sumTaxableAmount: Decimal = taxableAmount.plus(
      purchaseReport.taxableAmount,
    );

    const sumNonTaxableAmount: Decimal = nonTaxableAmount.plus(
      purchaseReport.nonTaxableAmount,
    );

    const sumTotalVat: Decimal = totalVat.plus(purchaseReport.totalVat);

    const sumGrossAmount: Decimal = grossAmount.plus(
      purchaseReport.grossAmount,
    );

    const count = purchaseReport.count + 1;

    const updatePurchaseReport = await prisma.purchaseReport.update({
      where: {
        id: purchaseReport.id,
      },
      data: {
        localPurchaseCapitalAssets: sumLocalPurchaseCapitalAssets,
        vatOnLocalPurchaseCapitalAssets: sumVatOnLocalPurchaseCapitalAssets,
        importedCapitalAssets: sumImportedCapitalAssets,
        vatOnImportedCapitalAssets: sumVatOnImportedCapitalAssets,
        totalCapitalAssets: sumTotalCapitalAssets,
        vatOnTotalAssets: sumVatOnTotalAssets,
        localPurchaseInputs: sumLocalPurchaseInputs,
        vatOnLocalPurchaseInputs: sumVatOnLocalPurchaseInputs,
        importedInputs: sumImportedInputs,
        vatOnImportedInputs: sumVatOnImportedInputs,
        generalExpenseInputs: sumGeneralExpenseInputs,
        vatOnGeneralExpenseInputs: sumVatOnGeneralExpenseInputs,
        purchaseWithNoVat: sumPurchaseWithNoVat,
        totalNonCapitalInputs: sumTotalNonCapitalInputs,
        vatOnTotalInputs: sumVatOnTotalInputs,
        taxableAmount: sumTaxableAmount,
        nonTaxableAmount: sumNonTaxableAmount,
        totalVat: sumTotalVat,
        grossAmount: sumGrossAmount,
        month: month,
        year: year,
        count: count,
        Purchase: {
          connect: {
            id: purchase.id,
          },
        },
      },
    });
    purchaseReport = updatePurchaseReport;
  } else {
    purchaseReport = await prisma.purchaseReport.create({
      data: {
        companyId: data.companyId,
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
        month: month,
        year: year,
        count: 1,
        Purchase: {
          connect: {
            id: purchase.id,
          },
        },
      },
    });
  }

  console.log({ purchase, purchaseReport });
  return {
    purchase,
    purchaseReport,
  };
};
