"use server";

import { getPrisma } from "@/lib/utils/database";
import { Prisma, Purchase } from "@prisma/client";
const prisma = getPrisma();

export const fetchAllPurchases = async ({
  startDate,
  endDate,
  companyId,
  filter,
}: {
  startDate: Date;
  endDate: Date;
  companyId: string;
  filter?: {
    fetch?: "vat" | "tot" | "withholding";
  };
}): Promise<Purchase[]> => {
  if (startDate.getTime() > endDate.getTime())
    throw new Error("Invalid date range");
  // Calculate the difference in milliseconds
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  if (daysDifference > 60) {
    throw new Error("Date range cannot exceed 60 days");
  }

  const pageSize = 1200;
  let currentPage = 0;
  let hasMore = true;
  let purchasesData: Purchase[] = [];

  let where: Prisma.PurchaseWhereInput = {
    companyId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };
  if (filter) {
    if (filter.fetch === "vat")
      where.vatDetailId = {
        not: null,
      };
    if (filter.fetch === "tot")
      where.totDetailId = {
        not: null,
      };
    if (filter.fetch === "withholding")
      where.withholdingDetailId = {
        not: null,
      };
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
