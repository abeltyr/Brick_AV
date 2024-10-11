"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { DateRangeType, RangeType } from "@/types/shared";
import { Filter } from "@/types/shared";
import { Prisma, Product } from "@prisma/client";
import Decimal from "decimal.js";
import { productIncludeData } from "./common/include";
const prisma = getPrisma();

export const fetchProductsByCompanyIdAction = async ({
  companyId,
  filter,
}: {
  companyId: string;
  filter: Filter & {
    price?: RangeType;
    dateRange?: DateRangeType;
  };
}): Promise<Product[]> => {
  let limit = limitSetter({ limit: filter.limit });
  let orderBy: Prisma.SortOrder = filter && filter.before ? "asc" : "desc";

  let where: Prisma.ProductWhereInput = { companyId };

  let cursor = filter?.before ?? filter?.after;

  let myCursor: Prisma.ProductWhereUniqueInput | undefined = cursor
    ? { id: cursor }
    : undefined;
  let skip = cursor ? 1 : 0;

  if (cursor) {
    myCursor = {
      id: cursor,
    };
    skip = 1;
  }

  if (filter) {
    //date rage filter
    if (filter.dateRange) {
      where.createdAt = {
        gte: filter.dateRange.startDate,
        lte: filter.dateRange.endDate,
      };

      // where.OR = [
      //   {
      //     createdAt: {
      //       gte: filter.dateRange.startDate,
      //     },
      //   },
      //   {
      //     createdAt: {
      //       lte: filter.dateRange.endDate,
      //     },
      //   },
      // ];
    }
    //price rage filter
    if (filter.price) {
      where.inventory = {
        some: {
          productPrice: {
            some: {
              AND: [
                filter.price.min !== undefined
                  ? { unitPrice: { gte: new Decimal(filter.price.min) } }
                  : {},
                filter.price.max !== undefined
                  ? { unitPrice: { lte: new Decimal(filter.price.max) } }
                  : {},
              ],
            },
          },
        },
      };
    }
  }
  console.log("where", where);
  return await prisma.product.findMany({
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
      inventory: {
        include: {
          chartOfAccount: true,
          productPrice: {
            where: {
              active: true,
            },
          },
        },
      },
    },
  });
};
