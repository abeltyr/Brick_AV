"use server";

import { getPrisma } from "@/lib/utils/database";
import { chartOfAccountIncludeData } from "./common/include";
import { ChartOfAccountInputType, ChartOfAccountType } from "@/types/purchase";
import { Prisma } from "@prisma/client";
import { accountTypeObject } from "@/lib/utils/chartOfAccount/values";

const prisma = getPrisma();

export const createChartOfAccountAction = async ({
  companyId,
  creatorId,
  data,
}: {
  companyId: string;
  creatorId: string;
  data: ChartOfAccountInputType;
}): Promise<ChartOfAccountType> => {
  let date = new Date();

  const fiscalYear = await prisma.fiscalYear.findUnique({
    where: {
      companyId_year: {
        year: date.getFullYear(),
        companyId: companyId,
      },
    },
  });

  if (!fiscalYear) throw new Error("Financial period not found");

  const accountPeriods = await prisma.accountPeriod.findMany({
    where: {
      fiscalYearId: fiscalYear.id,
      startDate: {
        lte: date,
      },
      endDate: {
        gte: date,
      },
    },
  });

  if (!accountPeriods || accountPeriods.length === 0)
    throw new Error("Account period not found");

  const createChartOfAccount: Prisma.ChartOfAccountCreateInput = {
    name: data.name,
    accountType: data.accountType,
    code: data.code,
    company: {
      connect: {
        id: companyId,
      },
    },
    type: data.type,
    balanceCreditBased:
      accountTypeObject[data.accountType].normal_balance === "credit",
  };

  createChartOfAccount.chartOfAccountBalance = {
    create: {
      balance: data.amount,
      fiscalYearId: fiscalYear.id,
      creatorId: creatorId,
      initialBalance: data.amount,
    },
  };
  if (data.amount > 0) {
    createChartOfAccount.chartOfAccountTransaction = {
      create: {
        transactionType: "DEPOSIT",
        companyId: companyId,
        createdById: creatorId,
        credit:
          accountTypeObject[data.accountType].normal_balance === "credit"
            ? data.amount
            : 0,
        debit:
          accountTypeObject[data.accountType].normal_balance === "debit"
            ? data.amount
            : 0,
        date: date,
        accountPeriodId: accountPeriods[0].id,
      },
    };
  }

  const chartOfAccount = await prisma.chartOfAccount.create({
    data: createChartOfAccount,
    include: chartOfAccountIncludeData,
  });

  return chartOfAccount as ChartOfAccountType;
};
