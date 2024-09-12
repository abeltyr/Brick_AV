"use server";

import { getPrisma } from "@/lib/utils/database";
import { PurchaseReport } from "@prisma/client";

const prisma = getPrisma();

export const fetchPurchaseReportAction = async ({
  companyId,
  year,
  month,
}: {
  companyId: string;
  year: number;
  month: number;
}): Promise<PurchaseReport | null> => {
  return await prisma.purchaseReport.findUnique({
    where: {
      month_year_companyId: {
        companyId,
        month,
        year,
      },
    },
  });
};
