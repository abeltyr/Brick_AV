"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma, Purchase } from "@prisma/client";

const prisma = getPrisma();

export const fetchPurchasesByCompanyIdAction = async ({
  companyId,
  filter,
  year,
  month,
}: {
  companyId: string;
  filter: Filter;
  year: number;
  month: number;
}): Promise<Purchase[]> => {
  let limit = limitSetter({ limit: filter.limit });
  let orderBy: Prisma.SortOrder = filter && filter.before ? "asc" : "desc";

  let where: Prisma.PurchaseWhereInput = {
    companyId,
    year,
    month,
  };

  let cursor = filter && filter.before ? filter.before : filter.after;

  let myCursor: Prisma.PurchaseWhereUniqueInput | undefined;
  let skip = 0;

  if (cursor) {
    myCursor = {
      id: cursor,
    };
    skip = 1;
  }

  return await prisma.purchase.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: [
      {
        createdAt: orderBy,
      },
    ],
    skip,
    include: {
      PurchaseProduct: {
        include: {
          product: true,
        },
      },
      vendor: {
        include: {
          profile: {
            include: {
              address: true,
            },
          },
        },
      },
    },
  });
};
