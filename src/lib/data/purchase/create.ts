"use server";

import { getPrisma } from "@/lib/utils/database";
import { AccountPeriod, Prisma, Purchase } from "@prisma/client";
import { VendorType } from "@/types/vendor";
import {
  totPurchaseSummation,
  UnregisteredPurchaseSummation,
  vatPurchaseSummation,
} from "@/lib/utils/purchase";
import { monthYearGetter } from "@/lib/utils/calendar/monthYearGetter";
import { ChartOfAccountType, PurchaseInputType } from "@/types/purchase";
import Decimal from "decimal.js";
import { getWeekOrder } from "@/lib/utils/calendar/date";
import { PurchaseReportType } from "@/types/report";
import { vendorIncludeData } from "../vendor/common/include";
import { v4 } from "uuid";
import { ChartOfAccountListType } from "@/lib/context/purchase/addPurchase";
const prisma = getPrisma();

export const createPurchaseAction = async ({
  companyId,
  creatorId,
  purchaseInput,
}: {
  companyId: string;
  creatorId: string;
  purchaseInput: Omit<PurchaseInputType, "receiptNumber"> & {
    receiptNumber: string;
    chartOfAccount: ChartOfAccountListType;
  };
}): Promise<{
  purchase: Purchase;
  purchaseDailyReport: PurchaseReportType | null;
  purchaseWeeklyReport: PurchaseReportType | null;
  purchaseAccountPeriodReport: PurchaseReportType | null;
  purchaseFiscalYearReport: PurchaseReportType | null;
} | null> => {
  const [vendorData, fiscalYear] = await prisma.$transaction([
    prisma.vendor.findUnique({
      where: { id: purchaseInput.vendorId },
      include: vendorIncludeData,
    }),
    prisma.fiscalYear.findUnique({
      where: {
        companyId_year: {
          companyId: companyId,
          year: new Date().getFullYear(),
        },
      },
    }),
  ]);

  const vendor = vendorData as VendorType;
  if (!vendor) throw new Error("Vendor is no setup");
  if (!fiscalYear) throw new Error("fiscal Year is no setup");

  console.log("fiscalYear", fiscalYear, {
    startDate: {
      lte: purchaseInput.date,
    },
    endDate: {
      gte: purchaseInput.date,
    },
  });

  let fetchValues = [
    prisma.accountPeriod.findMany({
      where: {
        fiscalYearId: fiscalYear?.id,
        startDate: {
          lte: purchaseInput.date,
        },
        endDate: {
          gte: purchaseInput.date,
        },
      },
    }),
    prisma.chartOfAccount.findUnique({
      where: {
        id: purchaseInput.chartOfAccount.paymentAccount?.id,
      },
      include: {
        chartOfAccountBalance: true,
      },
    }),
  ];

  if (purchaseInput.chartOfAccount && purchaseInput.chartOfAccount.vatAccount)
    fetchValues = [
      ...fetchValues,
      prisma.chartOfAccount.findUnique({
        where: {
          id: purchaseInput.chartOfAccount.vatAccount.id,
        },
        include: {
          chartOfAccountBalance: true,
        },
      }),
    ];

  if (purchaseInput.chartOfAccount.withHolding)
    fetchValues = [
      ...fetchValues,
      prisma.chartOfAccount.findUnique({
        where: {
          id: purchaseInput.chartOfAccount.withHolding.id,
        },
        include: {
          chartOfAccountBalance: true,
        },
      }),
    ];

  // const [
  //   accountPeriods,
  //   paymentAccount,
  //   vatAccount,
  //   withHolding,
  // ]
  const fetchData = await prisma.$transaction([...fetchValues]);
  const accountPeriods = fetchData[0] as AccountPeriod[];
  const paymentAccount = fetchData[1] as ChartOfAccountType;
  const vatAccount = fetchData[2] as ChartOfAccountType;
  const withHolding = fetchData[3] as ChartOfAccountType;

  console.log("accountPeriods", accountPeriods);

  if (accountPeriods && accountPeriods.length != 1)
    throw new Error("Account Period is not setup right");

  const accountPeriod = accountPeriods[0];
  // extract month and year from the current date
  let { month, year } = await monthYearGetter(purchaseInput.date);
  if (!month || !year) throw new Error("date is not setup right");

  let chartOfAccountTransactions: Prisma.Prisma__ChartOfAccountTransactionClient<{}>[] =
    [];
  let createPurchaseProductData: Prisma.Prisma__PurchaseProductClient<{}>[] =
    [];
  let inventoryUpdate: Prisma.Prisma__InventoryClient<{}>[] = [];

  let createData: Prisma.PurchaseCreateInput = {
    company: {
      connect: {
        id: companyId,
      },
    },
    vendor: {
      connect: {
        id: vendor.id,
      },
    },
    date: purchaseInput.date,
    receiptNumber: purchaseInput.receiptNumber,
    withholdingNumber: purchaseInput.withholdingNumber,
    mrcNumber: purchaseInput.mrcNumber,
    description: purchaseInput.gebiwoch.description,
    productType: purchaseInput.gebiwoch.productCategoryType,
    purchaseType: purchaseInput.gebiwoch.purchaseType,
  };

  let localPurchaseCapitalAssets = new Decimal(0);
  let vatOnLocalPurchaseCapitalAssets = new Decimal(0);
  let importedCapitalAssets = new Decimal(0);
  let vatOnImportedCapitalAssets = new Decimal(0);
  let localPurchaseInputs = new Decimal(0);
  let vatOnLocalPurchaseInputs = new Decimal(0);
  let importedInputs = new Decimal(0);
  let vatOnImportedInputs = new Decimal(0);
  let generalExpenseInputs = new Decimal(0);
  let vatOnGeneralExpenseInputs = new Decimal(0);
  let purchaseWithNoVat = new Decimal(0);
  let totalCapitalAssets = new Decimal(0);
  let vatOnTotalAssets = new Decimal(0);
  let totalNonCapitalInputs = new Decimal(0);
  let vatOnTotalInputs = new Decimal(0);
  let importedGoodSummaryAmount = new Decimal(0);
  let importedGoodWithholding = new Decimal(0);
  let localGoodSummaryAmount = new Decimal(0);
  let localGoodWithholding = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);
  let serviceWithholding = new Decimal(0);
  let taxableAmount = new Decimal(0);
  let nonTaxableAmount = new Decimal(0);
  let totalAmount = new Decimal(0);
  let taxAmount = new Decimal(0);
  let withholdingAmount = new Decimal(0);
  let grossAmount = new Decimal(0);
  let totalQuantity = 0;
  let averagePrice = new Decimal(0);
  let goodSummaryAmount = new Decimal(0);
  let goodWithholdingAmount = new Decimal(0);
  let serviceWithholdingAmount = new Decimal(0);
  let totAmount = new Decimal(0);
  let vatAmount = new Decimal(0);

  const purchaseId = v4();
  if (vendor && vendor.business && vendor.business?.tin) {
    createData.vendorTin = vendor.business?.tin;
    createData.vendorName = vendor.business.businessName;
    if (vendor.taxType === "VAT") {
      const sum = vatPurchaseSummation({
        purchaseProducts: purchaseInput.purchaseProducts,
        databaseGenerator: {
          accountPeriodId: accountPeriod.id,
          companyId: companyId,
          date: purchaseInput.date,
          purchaseId,
          creatorId: creatorId,
        },
      });
      createPurchaseProductData = sum.createPurchaseProductData;
      inventoryUpdate = sum.inventoryUpdate;
      chartOfAccountTransactions = sum.chartOfAccountTransactions;

      localPurchaseCapitalAssets = sum.summation.localPurchaseCapitalAssets;
      vatOnLocalPurchaseCapitalAssets =
        sum.summation.vatOnLocalPurchaseCapitalAssets;
      importedCapitalAssets = sum.summation.importedCapitalAssets;
      vatOnImportedCapitalAssets = sum.summation.vatOnImportedCapitalAssets;
      localPurchaseInputs = sum.summation.localPurchaseInputs;
      vatOnLocalPurchaseInputs = sum.summation.vatOnLocalPurchaseInputs;
      importedInputs = sum.summation.importedInputs;
      vatOnImportedInputs = sum.summation.vatOnImportedInputs;
      generalExpenseInputs = sum.summation.generalExpenseInputs;
      vatOnGeneralExpenseInputs = sum.summation.vatOnGeneralExpenseInputs;
      purchaseWithNoVat = sum.summation.purchaseWithNoVat;
      totalCapitalAssets = sum.summation.totalCapitalAssets;
      vatOnTotalAssets = sum.summation.vatOnTotalAssets;
      totalNonCapitalInputs = sum.summation.totalNonCapitalInputs;
      vatOnTotalInputs = sum.summation.vatOnTotalInputs;
      importedGoodSummaryAmount = sum.summation.importedGoodSummaryAmount;
      importedGoodWithholding = sum.summation.importedGoodWithholding;
      localGoodSummaryAmount = sum.summation.localGoodSummaryAmount;
      localGoodWithholding = sum.summation.localGoodWithholding;
      serviceSummaryAmount = sum.summation.serviceSummaryAmount;
      serviceWithholding = sum.summation.serviceWithholding;
      taxableAmount = sum.summation.taxableAmount;
      nonTaxableAmount = sum.summation.nonTaxableAmount;
      totalAmount = sum.summation.totalAmount;
      taxAmount = sum.summation.taxAmount;
      withholdingAmount = sum.summation.withholdingAmount;
      grossAmount = sum.summation.grossAmount;
      totalQuantity = sum.summation.totalQuantity;
      averagePrice = sum.summation.averagePrice;

      vatAmount = taxAmount;
      createData.unitPrice = averagePrice;
      createData.quantity = totalQuantity;
      createData.taxableAmount = taxableAmount;
      createData.nonTaxableAmount = nonTaxableAmount;
      createData.totalAmount = totalAmount;
      createData.withholdingAmount = withholdingAmount;
      createData.grossAmount = grossAmount;
      createData.serviceSummaryAmount = serviceSummaryAmount;
      createData.goodSummaryAmount = importedGoodSummaryAmount.plus(
        localGoodSummaryAmount,
      );
      createData.taxAmount = taxAmount;

      let value:
        | Prisma.ChartOfAccountTransactionCreateNestedOneWithoutVatDetailInput
        | undefined;
      if (vatAccount) {
        value = {
          create: {
            transactionType: "TAX",
            accountPeriodId: accountPeriod.id,
            companyId: companyId,
            date: purchaseInput.date,
            chartOfAccountId: vatAccount!.id,
            credit:
              purchaseInput.chartOfAccount.vatAccount?.balanceType === "credit"
                ? taxAmount
                : 0,
            debit:
              purchaseInput.chartOfAccount.vatAccount?.balanceType === "debit"
                ? taxAmount
                : 0,
            status: "CONFIRMED",
            createdById: creatorId,
          },
        };
      }
      createData.vatDetail = {
        create: {
          localPurchaseInputs,
          vatOnLocalPurchaseInputs,
          importedInputs,
          vatOnImportedInputs,
          generalExpenseInputs,
          vatOnGeneralExpenseInputs,
          totalNonCapitalInputs,
          vatOnTotalInputs,
          localPurchaseCapitalAssets,
          vatOnLocalPurchaseCapitalAssets,
          importedCapitalAssets,
          vatOnImportedCapitalAssets,
          totalCapitalAssets,
          vatOnTotalAssets,
          purchaseWithNoVat,
          nonTaxableAmount,
          taxableAmount,
          taxAmount,
          totalAmount,
          chartOfAccountTransaction: value,
        },
      };
      if (withholdingAmount.greaterThan(0)) {
        let value:
          | Prisma.ChartOfAccountTransactionCreateNestedOneWithoutVatDetailInput
          | undefined;
        if (withHolding) {
          value = {
            create: {
              transactionType: "TAX",
              accountPeriodId: accountPeriod.id,
              companyId: companyId,
              date: purchaseInput.date,
              chartOfAccountId: withHolding.id,
              credit: 0,
              debit: withholdingAmount,
              status: "PENDING",
              createdById: creatorId,
            },
          };
        }
        createData.withholdingDetail = {
          create: {
            importedGoodSummaryAmount: importedGoodSummaryAmount,
            importedGoodWithholding: importedGoodWithholding,
            serviceSummaryAmount: serviceSummaryAmount,
            serviceWithholding: serviceWithholding,
            localGoodSummaryAmount: localGoodSummaryAmount,
            localGoodWithholding: localGoodWithholding,
            taxableAmount: totalAmount,
            totalWithholding: withholdingAmount,
            chartOfAccountTransaction: value,
          },
        };
      }
    } else {
      totAmount = taxAmount;
      const sum = totPurchaseSummation({
        purchaseProducts: purchaseInput.purchaseProducts,
        databaseGenerator: {
          accountPeriodId: accountPeriod.id,
          companyId: companyId,
          date: purchaseInput.date,
          purchaseId,
          creatorId: creatorId,
        },
      });
      createPurchaseProductData = sum.createPurchaseProductData;
      inventoryUpdate = sum.inventoryUpdate;
      chartOfAccountTransactions = sum.chartOfAccountTransactions;

      goodSummaryAmount = sum.summation.goodSummaryAmount;
      serviceSummaryAmount = sum.summation.serviceSummaryAmount;
      totalAmount = sum.summation.totalAmount;
      goodWithholdingAmount = sum.summation.goodWithholdingAmount;
      serviceWithholdingAmount = sum.summation.serviceWithholdingAmount;
      withholdingAmount = sum.summation.withholdingAmount;
      taxAmount = sum.summation.taxAmount;
      grossAmount = sum.summation.grossAmount;
      totalQuantity = sum.summation.totalQuantity;
      averagePrice = sum.summation.averagePrice;
      totAmount = sum.summation.taxAmount;

      createData.unitPrice = averagePrice;
      createData.quantity = totalQuantity;
      createData.grossAmount = grossAmount;
      createData.taxableAmount = totalAmount;
      createData.totalAmount = totalAmount;
      createData.taxAmount = taxAmount;
      createData.withholdingAmount = withholdingAmount;
      createData.serviceSummaryAmount = serviceSummaryAmount;
      createData.goodSummaryAmount = goodSummaryAmount;

      createData.totDetail = {
        create: {
          goodSummaryAmount: goodSummaryAmount,
          serviceSummaryAmount: serviceSummaryAmount,
          totalAmount: totalAmount,
          taxAmount: taxAmount,
        },
      };
      if (
        withholdingAmount.greaterThan(0) &&
        purchaseInput.chartOfAccount.withHolding
      ) {
        let value:
          | Prisma.ChartOfAccountTransactionCreateNestedOneWithoutVatDetailInput
          | undefined;
        if (withHolding) {
          value = {
            create: {
              transactionType: "TAX",
              accountPeriodId: accountPeriod.id,
              companyId: companyId,
              date: purchaseInput.date,
              chartOfAccountId: withHolding.id,
              credit: 0,
              debit: withholdingAmount,
              status: "PENDING",
              createdById: creatorId,
            },
          };
        }
        createData.withholdingDetail = {
          create: {
            serviceSummaryAmount: serviceSummaryAmount,
            serviceWithholding: serviceWithholdingAmount,
            localGoodSummaryAmount: goodSummaryAmount,
            localGoodWithholding: goodWithholdingAmount,
            taxableAmount: totalAmount,
            totalWithholding: withholdingAmount,
            chartOfAccountTransaction: value,
          },
        };
      }
    }
  } else {
    createData.vendorName = vendor.name ?? "";
    const sum = UnregisteredPurchaseSummation({
      purchaseProducts: purchaseInput.purchaseProducts,
      hasWithholding: purchaseInput.withholdingType === "hasWithholding",
      databaseGenerator: {
        accountPeriodId: accountPeriod.id,
        companyId: companyId,
        date: purchaseInput.date,
        purchaseId,
        creatorId: creatorId,
      },
    });

    createPurchaseProductData = sum.createPurchaseProductData;
    inventoryUpdate = sum.inventoryUpdate;
    chartOfAccountTransactions = sum.chartOfAccountTransactions;

    averagePrice = sum.summation.averagePrice;
    totalAmount = sum.summation.totalAmount;
    grossAmount = sum.summation.grossAmount;
    totalQuantity = sum.summation.totalQuantity;
    withholdingAmount = sum.summation.withholdingAmount;
    createData.unitPrice = averagePrice;
    createData.quantity = totalQuantity;
    createData.grossAmount = grossAmount;
    createData.taxableAmount = totalAmount;
    createData.totalAmount = totalAmount;
    createData.taxAmount = 0;
    createData.withholdingAmount = withholdingAmount;
    createData.serviceSummaryAmount = serviceSummaryAmount;
    createData.goodSummaryAmount = goodSummaryAmount;

    if (withholdingAmount.greaterThan(0)) {
      let value:
        | Prisma.ChartOfAccountTransactionCreateNestedOneWithoutVatDetailInput
        | undefined;
      if (withHolding) {
        value = {
          create: {
            transactionType: "TAX",
            accountPeriodId: accountPeriod.id,
            companyId: companyId,
            date: purchaseInput.date,
            chartOfAccountId: withHolding.id,
            credit: 0,
            debit: withholdingAmount,
            status: "PENDING",
            createdById: creatorId,
          },
        };
      }
      createData.withholdingDetail = {
        create: {
          taxableAmount: totalAmount,
          totalWithholding: withholdingAmount,
          chartOfAccountTransaction: value,
        },
      };
    }
  }

  createData.id = purchaseId;

  console.log("paymentAccount!.id", paymentAccount!.id);
  createData.chartOfAccountTransaction = {
    create: {
      transactionType: "PAYMENT",
      accountPeriodId: accountPeriod.id,
      companyId: companyId,
      date: purchaseInput.date,
      chartOfAccountId: paymentAccount!.id,
      credit:
        purchaseInput.chartOfAccount.paymentAccount?.balanceType === "credit"
          ? totalAmount.plus(taxAmount)
          : 0,
      debit:
        purchaseInput.chartOfAccount.paymentAccount?.balanceType === "debit"
          ? totalAmount.plus(taxAmount)
          : 0,
      status: "PENDING",
      createdById: creatorId,
    },
  };

  const order = getWeekOrder({
    date: purchaseInput.date,
    endDate: accountPeriod.endDate,
    startDate: accountPeriod.startDate,
  });

  const purchaseReport = prisma.purchaseDailyReport.upsert({
    where: {
      date_companyId: {
        date: purchaseInput.date,
        companyId: companyId,
      },
    },
    create: {
      companyId: companyId,
      nonTaxableAmount,
      taxableAmount,
      totalAmount,
      totAmount,
      vatAmount,
      date: purchaseInput.date,
      withholdingAmount,
      grossAmount,
      count: 1,
    },
    update: {
      companyId: companyId,
      nonTaxableAmount: {
        increment: nonTaxableAmount,
      },
      taxableAmount: {
        increment: taxableAmount,
      },
      totalAmount: {
        increment: totalAmount,
      },
      totAmount: {
        increment: totAmount,
      },
      vatAmount: {
        increment: vatAmount,
      },
      withholdingAmount: {
        increment: withholdingAmount,
      },
      grossAmount: {
        increment: grossAmount,
      },
      count: {
        increment: 1,
      },
    },
  });
  const purchaseWeeklyReport = prisma.purchaseWeeklyReport.upsert({
    where: {
      accountPeriodId_order_companyId: {
        order,
        companyId: companyId,
        accountPeriodId: accountPeriod.id,
      },
    },
    create: {
      companyId: companyId,
      nonTaxableAmount,
      taxableAmount,
      totalAmount,
      totAmount,
      vatAmount,
      order,
      accountPeriodId: accountPeriod.id,
      withholdingAmount,
      grossAmount,

      count: 1,
    },
    update: {
      companyId: companyId,
      nonTaxableAmount: {
        increment: nonTaxableAmount,
      },
      taxableAmount: {
        increment: taxableAmount,
      },
      totalAmount: {
        increment: totalAmount,
      },
      totAmount: {
        increment: totAmount,
      },
      vatAmount: {
        increment: vatAmount,
      },
      withholdingAmount: {
        increment: withholdingAmount,
      },
      grossAmount: {
        increment: grossAmount,
      },
      count: {
        increment: 1,
      },
    },
  });
  const purchaseAccountPeriodReport = prisma.purchaseAccountPeriodReport.upsert(
    {
      where: {
        accountPeriodId_companyId: {
          companyId: companyId,
          accountPeriodId: accountPeriod.id,
        },
      },
      create: {
        companyId: companyId,
        nonTaxableAmount,
        taxableAmount,
        totalAmount,
        totAmount,
        vatAmount,
        accountPeriodId: accountPeriod.id,
        withholdingAmount,
        grossAmount,
        count: 1,
      },
      update: {
        companyId: companyId,
        nonTaxableAmount: {
          increment: nonTaxableAmount,
        },
        taxableAmount: {
          increment: taxableAmount,
        },
        totalAmount: {
          increment: totalAmount,
        },
        totAmount: {
          increment: totAmount,
        },
        vatAmount: {
          increment: vatAmount,
        },
        withholdingAmount: {
          increment: withholdingAmount,
        },
        grossAmount: {
          increment: grossAmount,
        },
        count: {
          increment: 1,
        },
      },
    },
  );
  const purchaseFiscalYearReport = prisma.purchaseFiscalYearReport.upsert({
    where: {
      fiscalYearId_companyId: {
        companyId: companyId,
        fiscalYearId: fiscalYear.id,
      },
    },
    create: {
      companyId: companyId,
      nonTaxableAmount,
      taxableAmount,
      totalAmount,
      totAmount,
      vatAmount,
      fiscalYearId: fiscalYear.id,
      withholdingAmount,
      grossAmount,
      count: 1,
    },
    update: {
      companyId: companyId,
      nonTaxableAmount: {
        increment: nonTaxableAmount,
      },
      taxableAmount: {
        increment: taxableAmount,
      },
      totalAmount: {
        increment: totalAmount,
      },
      totAmount: {
        increment: totAmount,
      },
      vatAmount: {
        increment: vatAmount,
      },
      withholdingAmount: {
        increment: withholdingAmount,
      },
      grossAmount: {
        increment: grossAmount,
      },
      count: {
        increment: 1,
      },
    },
  });

  const allData = await prisma.$transaction([
    prisma.purchase.create({
      data: createData,
    }),
    ...chartOfAccountTransactions,
    ...createPurchaseProductData,
    ...inventoryUpdate,
    purchaseReport,
    purchaseWeeklyReport,
    purchaseAccountPeriodReport,
    purchaseFiscalYearReport,
  ]);

  return {
    purchase: allData[0],
    purchaseDailyReport: allData[allData.length - 4] as PurchaseReportType,
    purchaseWeeklyReport: allData[allData.length - 3] as PurchaseReportType,
    purchaseAccountPeriodReport: allData[
      allData.length - 2
    ] as PurchaseReportType,
    purchaseFiscalYearReport: allData[allData.length - 1] as PurchaseReportType,
  };
};
