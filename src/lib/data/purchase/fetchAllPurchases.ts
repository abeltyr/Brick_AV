"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
const prisma = getPrisma();

export const fetchAllPurchases = async ({
  month,
  year,
  companyId,
}: {
  year: number;
  month: number;
  companyId: string;
}): Promise<Purchase[]> => {
  const pageSize = 1000;
  let currentPage = 0;
  let hasMore = true;
  let purchasesData: Purchase[] = [];
  while (hasMore) {
    const purchases = await prisma.purchase.findMany({
      where: {
        companyId,
        year,
        month,
      },
      take: pageSize,
      skip: currentPage * pageSize,
      orderBy: { date: "desc" },
    });

    if (purchases.length > 0) {
      purchasesData = [...purchasesData, ...purchases];
      currentPage++;
    } else {
      hasMore = false;
    }
  }

  return purchasesData;
};
