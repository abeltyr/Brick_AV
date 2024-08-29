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
const prisma = getPrisma();

export const createPurchaseAction = async (data: {
  companyId: string;
  vendorId: string;
  date: Date;
  purchaseType: PurchaseType;
  MRCNumber?: string;
  VatReceiptNumber?: string;
  localPurchaseCapitalAssets?: Decimal;
  vatOnLocalPurchaseCapitalAssets?: Decimal;
  importedCapitalAssets?: Decimal;
  vatOnImportedCapitalAssets?: Decimal;
  totalCapitalAssets?: Decimal;
  vatOnTotalAssets?: Decimal;
  localPurchaseInputs?: Decimal;
  vatOnLocalPurchaseInputs?: Decimal;
  importedInputs?: Decimal;
  vatOnImportedInputs?: Decimal;
  generalExpenseInputs?: Decimal;
  vatOnGeneralExpenseInputs?: Decimal;
  purchaseWithNoVat?: Decimal;
  totalNonCapitalInputs?: Decimal;
  vatOnTotalInputs?: Decimal;
  taxableAmount: Decimal;
  nonTaxableAmount: Decimal;
  totalVat: Decimal;
  grossAmount: Decimal;
  dataIndex: number;
  purchaseProducts: {
    productId: string;
    type: ProductType;
    purchaseType: PurchaseType;
    unit: ProductUnit;
    unitPrice: Decimal;
    quantity: number;
    totalValue: Decimal;
    vat: Decimal;
    grossAmount: Decimal;
  }[];
}): Promise<{
  purchase: Purchase;
  purchaseReport: PurchaseReport;
}> => {
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
  let productGood = 0;
  let productService = 0;
  let units = {
    KG: 0,
    ML: 0,
    GM: 0,
    LIT: 0,
    MT: 0,
    PCS: 0,
    CT: 0,
    OTHER: 0,
    PC: 0,
  };

  data.purchaseProducts.map(async (product, index) => {
    await prisma.inventory.update({
      where: {
        productId: product.productId,
      },
      data: {
        quantity: {
          increment: product.quantity,
        },
        lastUpdated: new Date(),
      },
    });
    if (product.purchaseType === "taxableLocalCapitalAssets") {
      localPurchaseCapitalAssets = localPurchaseCapitalAssets.plus(
        new Decimal(product.totalValue),
      );
      vatOnLocalPurchaseCapitalAssets = vatOnLocalPurchaseCapitalAssets.plus(
        new Decimal(product.vat),
      );
    } else if (product.purchaseType === "taxableImportedCapitalAssets") {
      importedCapitalAssets = importedCapitalAssets.plus(
        new Decimal(product.totalValue),
      );
      vatOnImportedCapitalAssets = vatOnImportedCapitalAssets.plus(
        new Decimal(product.vat),
      );
    } else if (product.purchaseType === "taxableLocalInputs") {
      localPurchaseInputs = localPurchaseInputs.plus(
        new Decimal(product.totalValue),
      );
      vatOnLocalPurchaseInputs = vatOnLocalPurchaseInputs.plus(
        new Decimal(product.vat),
      );
    } else if (product.purchaseType === "taxableImportedInputs") {
      importedInputs = importedInputs.plus(new Decimal(product.totalValue));
      vatOnImportedInputs = vatOnImportedInputs.plus(new Decimal(product.vat));
    } else if (product.purchaseType === "taxableGeneralExpenseInputs") {
      generalExpenseInputs = generalExpenseInputs.plus(
        new Decimal(product.totalValue),
      );
      vatOnGeneralExpenseInputs = vatOnGeneralExpenseInputs.plus(
        new Decimal(product.vat),
      );
    } else if (product.purchaseType === "taxExemptedPurchase") {
      purchaseWithNoVat = purchaseWithNoVat.plus(
        new Decimal(product.totalValue),
      );
    }

    totalQuantity = totalQuantity + product.quantity;
    productGood = productGood + product.type === "Good" ? 1 : 0;
    productService = productService + product.type === "Service" ? 1 : 0;

    units[product.unit] = units[product.unit] + 1;

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

  totalCapitalAssets = localPurchaseCapitalAssets.plus(importedCapitalAssets);
  vatOnTotalAssets = vatOnLocalPurchaseCapitalAssets.plus(
    vatOnImportedCapitalAssets,
  );
  totalNonCapitalInputs = localPurchaseInputs
    .plus(importedInputs)
    .plus(generalExpenseInputs);
  vatOnTotalInputs = localPurchaseInputs
    .plus(importedInputs)
    .plus(generalExpenseInputs);

  // create month and year from the date base on ethiopia calender

  // sum up the tax and gross amount
  let taxableAmount: Decimal = totalCapitalAssets.plus(totalNonCapitalInputs);
  let nonTaxableAmount: Decimal = purchaseWithNoVat;
  let totalVat: Decimal = vatOnTotalAssets.plus(vatOnTotalInputs);
  let grossAmount: Decimal = taxableAmount
    .plus(nonTaxableAmount)
    .plus(totalVat);

  const beforeVat = taxableAmount.plus(nonTaxableAmount);
  const averagePrice = beforeVat.dividedBy(totalQuantity);

  let unit: ProductUnit = "KG";
  let unitAmount = 0;
  Object.values(units).map((data, index) => {
    if (unitAmount < data) unit = Object.keys(units)[index] as ProductUnit;
  });
  let month = 0;
  let year = 2016;

  let purchaseReport = await prisma.purchaseReport.findUnique({
    where: {
      month_year_companyId: {
        companyId: data.companyId,
        month,
        year,
      },
    },
  });

  let purchaseReportId = v4();
  if (purchaseReport) purchaseReportId = purchaseReport.id;

  const purchase = await prisma.purchase.create({
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
      totalQuantity,
      averagePrice,
      productType: productGood > productService ? "Good" : "Service",
      unit: unit,
      date: data.date,
      month,
      year,
      dataIndex: data.dataIndex,
      purchaseReportId,
      PurchaseProduct: {
        create: purchaseProducts,
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

  return {
    purchase,
    purchaseReport,
  };
};
