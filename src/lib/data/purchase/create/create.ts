"use server";

import { getPrisma } from "@/lib/utils/database";
import { Prisma, Purchase } from "@prisma/client";
import { VendorType } from "@/types/vendor";
import {
  totPurchaseSummation,
  UnregisteredPurchaseSummation,
  vatPurchaseSummation,
} from "@/lib/utils/purchase";
import { PurchaseInputType } from "@/types/purchase";
import Decimal from "decimal.js";
import { dateSetter, getWeekOrder } from "@/lib/utils/calendar/date";
import { PurchaseReportType } from "@/types/report";
import { vendorIncludeData } from "../../vendor/common/include";
import { v4 } from "uuid";
import {
  ChartOfAccountDataType,
  ChartOfAccountListType,
} from "@/lib/context/purchase/addPurchase";
import { accountTypeObject } from "@/lib/utils/chartOfAccount/values";
import { chartOfAccountSummation } from "@/lib/utils/purchase/chartOfAccountSummation";
import { createPurchaseValidation } from "./validation";
const prisma = getPrisma();

export const createPurchaseAction = async ({
  companyId,
  fiscalYearId,
  creatorId,
  purchaseInput,
}: {
  companyId: string;
  fiscalYearId: string;
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
  const purchaseDate = dateSetter(purchaseInput.date);

  // fetch the vendor and accounting period to validate and setup the needed data
  const { vendor, accountPeriod } = await createPurchaseValidation({
    vendorId: purchaseInput.vendorId,
    date: purchaseDate,
    fiscalYearId,
  });

  /**
   * Those are going to be the values we going to use for the mass update
   * form the purchase creation
   * purchase products creation
   * inventory update
   * chartOfAccountTransactions creation
   * chartOfAccountBalance update
   */
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
    date: purchaseDate,
    receiptNumber: purchaseInput.receiptNumber,
    withholdingNumber: purchaseInput.withholdingNumber,
    mrcNumber: purchaseInput.mrcNumber,
    description: purchaseInput.gebiwoch.description,
    productType: purchaseInput.gebiwoch.productCategoryType,
    purchaseType: purchaseInput.gebiwoch.purchaseType,
  };

  let createPurchaseProductData: Prisma.Prisma__PurchaseProductClient<{}>[] =
    [];
  let inventoryUpdate: Prisma.Prisma__InventoryClient<{}>[] = [];
  let chartOfAccountTransactions: Prisma.Prisma__ChartOfAccountTransactionClient<{}>[] =
    [];
  let updateChartOfAccountBalance: Prisma.Prisma__ChartOfAccountBalanceClient<{}>[] =
    [];

  let taxableAmount = new Decimal(0);
  let nonTaxableAmount = new Decimal(0);
  let totalAmount = new Decimal(0);
  let taxAmount = new Decimal(0);
  let withholdingAmount = new Decimal(0);
  let grossAmount = new Decimal(0);
  let totalQuantity = 0;
  let averagePrice = new Decimal(0);
  let goodSummaryAmount = new Decimal(0);
  let serviceSummaryAmount = new Decimal(0);
  let totAmount = new Decimal(0);
  let vatAmount = new Decimal(0);

  const purchaseId = v4();
  createData.id = purchaseId;
  if (vendor && vendor.business && vendor.business?.tin) {
    createData.vendorTin = vendor.business?.tin;
    createData.vendorName = vendor.business.businessName;
    if (vendor.taxType === "VAT") {
      const sum = vatPurchaseSummation({
        purchaseProducts: purchaseInput.purchaseProducts,
        databaseGenerator: {
          accountPeriodId: accountPeriod.id,
          companyId: companyId,
          date: purchaseDate,
          purchaseId,
          creatorId: creatorId,
        },
      });
      createPurchaseProductData = sum.createPurchaseProductData;
      inventoryUpdate = sum.inventoryUpdate;

      const localPurchaseCapitalAssets =
        sum.summation.localPurchaseCapitalAssets;
      const vatOnLocalPurchaseCapitalAssets =
        sum.summation.vatOnLocalPurchaseCapitalAssets;
      const importedCapitalAssets = sum.summation.importedCapitalAssets;
      const vatOnImportedCapitalAssets =
        sum.summation.vatOnImportedCapitalAssets;
      const localPurchaseInputs = sum.summation.localPurchaseInputs;
      const vatOnLocalPurchaseInputs = sum.summation.vatOnLocalPurchaseInputs;
      const importedInputs = sum.summation.importedInputs;
      const vatOnImportedInputs = sum.summation.vatOnImportedInputs;
      const generalExpenseInputs = sum.summation.generalExpenseInputs;
      const vatOnGeneralExpenseInputs = sum.summation.vatOnGeneralExpenseInputs;
      const purchaseWithNoVat = sum.summation.purchaseWithNoVat;
      const totalCapitalAssets = sum.summation.totalCapitalAssets;
      const vatOnTotalAssets = sum.summation.vatOnTotalAssets;
      const totalNonCapitalInputs = sum.summation.totalNonCapitalInputs;
      const vatOnTotalInputs = sum.summation.vatOnTotalInputs;
      const importedGoodSummaryAmount = sum.summation.importedGoodSummaryAmount;
      const importedGoodWithholding = sum.summation.importedGoodWithholding;
      const localGoodSummaryAmount = sum.summation.localGoodSummaryAmount;
      const localGoodWithholding = sum.summation.localGoodWithholding;
      const serviceWithholding = sum.summation.serviceWithholding;
      serviceSummaryAmount = sum.summation.serviceSummaryAmount;
      goodSummaryAmount = localGoodSummaryAmount.plus(
        importedGoodSummaryAmount,
      );
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
      createData.goodSummaryAmount = goodSummaryAmount;
      createData.taxAmount = taxAmount;

      if (
        purchaseInput.chartOfAccount.vatAccount &&
        purchaseInput.chartOfAccount.vatAccount.id
      ) {
        chartOfAccountTransactions = [
          ...chartOfAccountTransactions,
          prisma.chartOfAccountTransaction.create({
            data: {
              chartOfAccountId: purchaseInput.chartOfAccount.vatAccount.id,
              transactionType: "TAX",
              status: "CONFIRMED",
              accountPeriodId: accountPeriod.id,
              companyId: companyId,
              date: purchaseDate,
              createdById: creatorId,
              transactionSourceId: purchaseId,
              transactionSourceTable: "Purchase",
              credit: 0,
              debit: taxAmount,
            },
          }),
        ];

        // The vatAccount Account balance update
        updateChartOfAccountBalance = [
          ...updateChartOfAccountBalance,
          prisma.chartOfAccountBalance.update({
            where: {
              chartOfAccountId_fiscalYearId: {
                chartOfAccountId: purchaseInput.chartOfAccount.vatAccount.id,
                fiscalYearId: fiscalYearId,
              },
            },
            data: {
              balance: {
                increment: taxAmount,
              },
            },
          }),
        ];
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
        },
      };

      if (withholdingAmount.greaterThan(0)) {
        if (
          purchaseInput.chartOfAccount.withHolding &&
          purchaseInput.chartOfAccount.withHolding.id
        ) {
          chartOfAccountTransactions = [
            ...chartOfAccountTransactions,
            prisma.chartOfAccountTransaction.create({
              data: {
                chartOfAccountId: purchaseInput.chartOfAccount.withHolding.id,
                transactionType: "TAX",
                status: "CONFIRMED",
                accountPeriodId: accountPeriod.id,
                companyId: companyId,
                date: purchaseDate,
                createdById: creatorId,
                transactionSourceId: purchaseId,
                transactionSourceTable: "Purchase",
                credit: withholdingAmount,
                debit: 0,
              },
            }),
          ];

          // The withholding Account balance update
          updateChartOfAccountBalance = [
            ...updateChartOfAccountBalance,
            prisma.chartOfAccountBalance.update({
              where: {
                chartOfAccountId_fiscalYearId: {
                  chartOfAccountId: purchaseInput.chartOfAccount.withHolding.id,
                  fiscalYearId: fiscalYearId,
                },
              },
              data: {
                balance: {
                  increment: withholdingAmount,
                },
              },
            }),
          ];
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
          },
        };
      }
    } else {
      const sum = totPurchaseSummation({
        purchaseProducts: purchaseInput.purchaseProducts,
        databaseGenerator: {
          accountPeriodId: accountPeriod.id,
          companyId: companyId,
          date: purchaseDate,
          purchaseId,
          creatorId: creatorId,
        },
      });
      createPurchaseProductData = sum.createPurchaseProductData;
      inventoryUpdate = sum.inventoryUpdate;

      goodSummaryAmount = sum.summation.goodSummaryAmount;
      serviceSummaryAmount = sum.summation.serviceSummaryAmount;
      totalAmount = sum.summation.totalAmount;
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
      createData.serviceSummaryAmount = serviceSummaryAmount;
      createData.goodSummaryAmount = goodSummaryAmount;
    }
  } else {
    createData.vendorName = vendor.name ?? "";
    const sum = UnregisteredPurchaseSummation({
      purchaseProducts: purchaseInput.purchaseProducts,
      hasWithholding: purchaseInput.withholdingType === "hasWithholding",
      databaseGenerator: {
        accountPeriodId: accountPeriod.id,
        companyId: companyId,
        date: purchaseDate,
        purchaseId,
        creatorId: creatorId,
      },
    });

    createPurchaseProductData = sum.createPurchaseProductData;
    inventoryUpdate = sum.inventoryUpdate;

    averagePrice = sum.summation.averagePrice;
    totalAmount = sum.summation.totalAmount;
    grossAmount = sum.summation.grossAmount;
    totalQuantity = sum.summation.totalQuantity;
    withholdingAmount = sum.summation.withholdingAmount;
    goodSummaryAmount = sum.summation.goodSummaryAmount;
    serviceSummaryAmount = sum.summation.serviceSummaryAmount;
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
      if (
        purchaseInput.chartOfAccount.withHolding &&
        purchaseInput.chartOfAccount.withHolding.id
      ) {
        chartOfAccountTransactions = [
          ...chartOfAccountTransactions,
          prisma.chartOfAccountTransaction.create({
            data: {
              chartOfAccountId: purchaseInput.chartOfAccount.withHolding.id,
              transactionType: "TAX",
              status: "CONFIRMED",
              accountPeriodId: accountPeriod.id,
              companyId: companyId,
              date: purchaseDate,
              createdById: creatorId,
              transactionSourceId: purchaseId,
              transactionSourceTable: "Purchase",
              credit: withholdingAmount,
              debit: 0,
            },
          }),
        ];

        // The withholding Account balance update
        updateChartOfAccountBalance = [
          ...updateChartOfAccountBalance,
          prisma.chartOfAccountBalance.update({
            where: {
              chartOfAccountId_fiscalYearId: {
                chartOfAccountId: purchaseInput.chartOfAccount.withHolding.id,
                fiscalYearId: fiscalYearId,
              },
            },
            data: {
              balance: {
                increment: withholdingAmount,
              },
            },
          }),
        ];
      }
      createData.withholdingDetail = {
        create: {
          taxableAmount: totalAmount,
          totalWithholding: withholdingAmount,
        },
      };
    }
  }

  /**
   * when the purchaseInput.chartOfAccount.paymentAccount is
   * setup the transaction created and the balance is updated
   * here
   */
  if (
    purchaseInput.chartOfAccount.paymentAccount &&
    purchaseInput.chartOfAccount.paymentAccount.id
  ) {
    createData.chartOfAccountTransaction = {
      create: {
        transactionType: "PAYMENT",
        accountPeriodId: accountPeriod.id,
        companyId: companyId,
        date: purchaseDate,
        chartOfAccountId: purchaseInput.chartOfAccount.paymentAccount.id,
        credit: totalAmount.plus(taxAmount).minus(withholdingAmount),
        debit: 0,
        status: "CONFIRMED",
        createdById: creatorId,
        transactionSourceId: purchaseId,
        transactionSourceTable: "Purchase",
      },
    };

    // The payment Account balance update
    updateChartOfAccountBalance = [
      ...updateChartOfAccountBalance,
      prisma.chartOfAccountBalance.update({
        where: {
          chartOfAccountId_fiscalYearId: {
            chartOfAccountId: purchaseInput.chartOfAccount.paymentAccount.id,
            fiscalYearId: fiscalYearId,
          },
        },
        data: {
          balance: {
            decrement: totalAmount.plus(taxAmount).minus(withholdingAmount),
          },
        },
      }),
    ];
  }

  const order = getWeekOrder({
    date: purchaseDate,
    startDate: accountPeriod.startDate,
    endDate: accountPeriod.endDate,
  });

  // console.log(
  //   "getWeekOrder",
  //   {
  //     date: purchaseDate,
  //     startDate: accountPeriod.startDate,
  //     endDate: accountPeriod.endDate,
  //   },
  //   order,
  // );
  // throw new Error("");
  /** The update for the purchase report for all
   *  daily
   *  weekly
   *  accounting period
   * fiscal period
   */
  const purchaseReport = prisma.purchaseDailyReport.upsert({
    where: {
      date_companyId: {
        date: purchaseDate,
        companyId: companyId,
      },
    },
    create: {
      companyId: companyId,
      nonTaxableAmount,
      taxableAmount,
      totalAmount:
        vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
      vatAmount,
      date: purchaseDate,
      withholdingAmount,
      grossAmount,
      goodSummaryAmount,
      serviceSummaryAmount,
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
        increment:
          vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
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
      goodSummaryAmount: {
        increment: goodSummaryAmount,
      },
      serviceSummaryAmount: {
        increment: serviceSummaryAmount,
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
      totalAmount:
        vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
      vatAmount,
      order,
      accountPeriodId: accountPeriod.id,
      withholdingAmount,
      grossAmount,
      goodSummaryAmount,
      serviceSummaryAmount,
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
        increment:
          vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
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
      goodSummaryAmount: {
        increment: goodSummaryAmount,
      },
      serviceSummaryAmount: {
        increment: serviceSummaryAmount,
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
        totalAmount:
          vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
        vatAmount,
        accountPeriodId: accountPeriod.id,
        withholdingAmount,
        grossAmount,
        goodSummaryAmount,
        serviceSummaryAmount,
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
          increment:
            vendor.taxType === "TOT"
              ? totalAmount.plus(totAmount)
              : totalAmount,
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
        goodSummaryAmount: {
          increment: goodSummaryAmount,
        },
        serviceSummaryAmount: {
          increment: serviceSummaryAmount,
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
        fiscalYearId: fiscalYearId,
      },
    },
    create: {
      companyId: companyId,
      nonTaxableAmount,
      taxableAmount,
      totalAmount:
        vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
      vatAmount,
      fiscalYearId: fiscalYearId,
      withholdingAmount,
      grossAmount,
      goodSummaryAmount,
      serviceSummaryAmount,
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
        increment:
          vendor.taxType === "TOT" ? totalAmount.plus(totAmount) : totalAmount,
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
      goodSummaryAmount: {
        increment: goodSummaryAmount,
      },
      serviceSummaryAmount: {
        increment: serviceSummaryAmount,
      },
      count: {
        increment: 1,
      },
    },
  });

  /**
   * this sums up the chart of account based on the purchase of products
   * and clean up the repeating type and generate the need chart of account  data
   */
  let chartOfAccountData: { [id: string]: ChartOfAccountDataType } =
    chartOfAccountSummation({
      vendor,
      purchaseProducts: purchaseInput.purchaseProducts,
    });

  // based on ht
  for (let chartOfAccountDataDetail of Object.values(chartOfAccountData)) {
    if (
      chartOfAccountDataDetail.amount &&
      chartOfAccountDataDetail.amount > 0
    ) {
      updateChartOfAccountBalance = [
        ...updateChartOfAccountBalance,
        prisma.chartOfAccountBalance.update({
          where: {
            chartOfAccountId_fiscalYearId: {
              chartOfAccountId: chartOfAccountDataDetail.id,
              fiscalYearId: fiscalYearId,
            },
          },
          data: {
            balance: {
              increment: chartOfAccountDataDetail.amount,
            },
          },
        }),
      ];

      chartOfAccountTransactions = [
        ...chartOfAccountTransactions,
        prisma.chartOfAccountTransaction.create({
          data: {
            chartOfAccountId: chartOfAccountDataDetail.id,
            transactionType: "PAYMENT",
            status: "PENDING",
            accountPeriodId: accountPeriod.id,
            companyId: companyId,
            date: purchaseDate,
            createdById: creatorId,
            transactionSourceId: purchaseId,
            transactionSourceTable: "Purchase",
            credit:
              accountTypeObject[chartOfAccountDataDetail.accountType]
                .normal_balance === "credit"
                ? chartOfAccountDataDetail.amount
                : 0,
            debit:
              accountTypeObject[chartOfAccountDataDetail.accountType]
                .normal_balance === "debit"
                ? chartOfAccountDataDetail.amount
                : 0,
          },
        }),
      ];
    }
  }

  const allData = await prisma.$transaction([
    prisma.purchase.create({
      data: createData,
    }),
    ...createPurchaseProductData,
    ...inventoryUpdate,
    ...chartOfAccountTransactions,
    ...updateChartOfAccountBalance,
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
