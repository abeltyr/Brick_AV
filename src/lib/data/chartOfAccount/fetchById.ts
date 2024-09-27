"use server";

import { getPrisma } from "@/lib/utils/database";
import { chartOfAccountIncludeData } from "./common/include";
import { ChartOfAccountType } from "@/types/purchase";
const prisma = getPrisma();

export const findChartOfAccountByIdAction = async (
  id: string,
): Promise<ChartOfAccountType | null> => {
  return (await prisma.chartOfAccount.findUnique({
    where: { id },
    include: chartOfAccountIncludeData,
  })) as ChartOfAccountType;
};
