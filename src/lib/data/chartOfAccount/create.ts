"use server";

import { getPrisma } from "@/lib/utils/database";
import { chartOfAccountIncludeData } from "./common/include";
import { ChartOfAccountInputType, ChartOfAccountType } from "@/types/purchase";
import { Prisma } from "@prisma/client";

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

  const financialPeriod = await prisma.financialPeriod.findUnique({
    where: {
      companyId_year: {
        year: date.getFullYear(),
        companyId: companyId,
      },
    },
  });

  if (!financialPeriod) throw new Error("Financial period not found");

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
  };

  createChartOfAccount.ChartOfAccountBalance = {
    create: {
      balance: data.amount,
      periodId: financialPeriod.id,
      profileId: creatorId,
      initialBalance: data.amount,
    },
  };
  if (data.amount > 0) {
    createChartOfAccount.ChartOfAccountTransaction = {
      create: {
        transactionType: "DEPOSIT",
        companyId: companyId,
        createdById: creatorId,
        credit: data.balanceType === "credit" ? data.amount : 0,
        debit: data.balanceType === "debit" ? data.amount : 0,
        date: date,
      },
    };
  }

  const product = await prisma.chartOfAccount.create({
    data: createChartOfAccount,
    include: chartOfAccountIncludeData,
  });

  return product as ChartOfAccountType;
};
