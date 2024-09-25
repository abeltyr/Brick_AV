"use server";

import { getPrisma } from "@/lib/utils/database";
import { generate8CharUUID } from "@/lib/utils/idGenerator";
import { chartOfAccountIncludeData } from "./common/include";
import { ChartOfAccountInputType, ChartOfAccountType } from "@/types/purchase";
import { Prisma } from "@prisma/client";

const prisma = getPrisma();

export const createChartOfAccountAction = async (
  data: ChartOfAccountInputType,
): Promise<ChartOfAccountType> => {
  const productCode = generate8CharUUID();

  let year = new Date().getFullYear();

  if (data.date) year = new Date(data.date).getFullYear();

  const financialPeriod = await prisma.financialPeriod.findUnique({
    where: {
      companyId_year: {
        year,
        companyId: data.companyId,
      },
    },
  });

  if (!financialPeriod) throw new Error("Financial period not found");

  const createChartOfAccount: Prisma.ChartOfAccountCreateInput = {
    name: data.name,
    description: data.description,
    category: data.category,
    code: productCode,
    company: {
      connect: {
        id: data.companyId,
      },
    },
    type: data.type,
  };

  if (data.credit || data.debit) {
    createChartOfAccount.ChartOfAccountBalance = {
      create: {
        balance: data.credit ? data.credit : data.debit,
        periodId: financialPeriod.id,
        profileId: data.createdBy,
        initialBalance: data.credit ? data.credit : data.debit,
      },
    };

    createChartOfAccount.ChartOfAccountTransaction = {
      create: {
        transactionType: "DEPOSIT",
        companyId: data.companyId,
        createdById: data.createdBy,
        credit: data.credit,
        debit: data.debit,
        date: data.date,
      },
    };
  }

  const product = await prisma.chartOfAccount.create({
    data: createChartOfAccount,
    include: chartOfAccountIncludeData,
  });

  return product as ChartOfAccountType;
};
