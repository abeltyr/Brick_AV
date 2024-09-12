"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { DateRangeType, Filter, RangeType } from "@/types/shared";
import { Prisma, Purchase } from "@prisma/client";
import { purchaseIncludeData } from "./common/include";
import Decimal from "decimal.js";

const prisma = getPrisma();

export const fetchPurchasesByCompanyIdAction = async ({
  companyId,
  filter,
  year,
  month,
}: {
  companyId: string;
  year: number;
  month: number;
  filter: Filter & {
    price?: RangeType;
    dateRange?: DateRangeType;
    hasVat?: boolean;
    hasWithholding?: boolean;
    vendorId?: string;
  };
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

  if (filter) {
    where = {
      OR: [],
    };

    let value = where.OR ?? [];

    //date rage filter
    if (filter.dateRange) {
      where = {
        OR: [
          {
            date: {
              gte: filter.dateRange.startDate,
            },
          },
          {
            date: {
              lte: filter.dateRange.endDate,
            },
          },
        ],
      };
    }
    //price rage filter
    if (filter.price) {
      if (filter.price.min)
        where = {
          OR: [
            ...value,
            {
              grossAmount: {
                gte: new Decimal(filter.price.min),
              },
            },
          ],
        };

      if (filter.price.max) {
        value = where.OR ?? [];
        where = {
          OR: [
            ...value,
            {
              grossAmount: {
                lte: new Decimal(filter.price.max),
              },
            },
          ],
        };
      }
    }
    if (filter.hasVat) {
      where = {
        hasVat: filter.hasVat,
      };
    }

    if (filter.hasWithholding) {
      where = {
        hasWithholding: filter.hasWithholding,
      };
    }

    if (filter.vendorId) {
      where = {
        vendorId: filter.vendorId,
      };
    }
  }

  return await prisma.purchase.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: [
      {
        date: orderBy,
      },
    ],
    skip,
    include: purchaseIncludeData,
  });
};
