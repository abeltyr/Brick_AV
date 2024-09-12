"use server";

import { getPrisma } from "@/lib/utils/database";
import { Prisma, Purchase } from "@prisma/client";
const prisma = getPrisma();

export const fetchAllPurchases = async ({
  month,
  year,
  companyId,
  filter,
}: {
  year: number;
  month: number;
  companyId: string;
  filter?: {
    hasVat?: boolean;
    hasWithholding?: boolean;
  };
}): Promise<Purchase[]> => {
  const pageSize = 1200;
  let currentPage = 0;
  let hasMore = true;
  let purchasesData: Purchase[] = [];

  let where: Prisma.PurchaseWhereInput = {
    companyId,
    year,
    month,
  };
  if (filter) {
    if (filter.hasVat != undefined) where.hasVat = filter.hasVat;
    if (filter.hasWithholding != undefined)
      where.hasWithholding = filter.hasWithholding;
  }

  while (hasMore) {
    const purchases = await prisma.purchase.findMany({
      where,
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
